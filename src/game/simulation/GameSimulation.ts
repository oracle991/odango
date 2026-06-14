import { arena, cannon, simulationConfig } from "../config";
import { coreRulesStage } from "../stage";
import {
  chargeToSpeed,
  createSkewer,
  predictTrajectory,
  segmentCircleIntersection,
  stepSkewer,
} from "./physics";
import type {
  SimulationState,
  SimulationUpdate,
  StageDefinition,
  TrajectoryPoint,
  Vec2,
} from "./types";

export class GameSimulation {
  readonly state: SimulationState;

  private accumulator = 0;

  constructor(private readonly stage: StageDefinition = coreRulesStage) {
    this.state = this.createInitialState();
  }

  update(deltaSeconds: number): SimulationUpdate {
    const result: SimulationUpdate = {
      ballHits: [],
      bombHit: null,
      wallHit: null,
      shotEnded: false,
      completedSkewer: false,
      restoredBalls: false,
      statusChanged: false,
    };
    if (this.state.paused || this.state.status !== "playing") return result;

    this.state.elapsedSeconds += deltaSeconds;
    if (this.state.charging) {
      this.state.chargeSeconds = Math.min(
        simulationConfig.maxChargeSeconds,
        this.state.chargeSeconds + deltaSeconds,
      );
    }

    this.accumulator += Math.min(deltaSeconds, 0.1);
    while (this.accumulator >= simulationConfig.fixedStepSeconds) {
      const skewer = this.state.skewer;
      if (skewer?.active) {
        const start = { ...skewer.position };
        const wallHit = stepSkewer(
          skewer,
          simulationConfig.fixedStepSeconds,
          arena,
          simulationConfig,
        );
        this.processTargets(start, skewer.position, result);
        if (wallHit && !result.bombHit) result.wallHit = wallHit;
      }
      this.accumulator -= simulationConfig.fixedStepSeconds;
    }

    if (this.state.skewer && !this.state.skewer.active) {
      result.shotEnded = true;
      result.completedSkewer = this.finishSkewer(result);
      this.state.skewer = null;
      result.statusChanged = this.finishStage();
    }
    return result;
  }

  getCurrentAngle(): number {
    return this.state.cannonAngle;
  }

  setAimPosition(x: number, y: number): void {
    if (this.state.paused || this.state.status !== "playing") return;

    const aimX = Math.min(arena.right, Math.max(arena.left, x));
    const aimY = Math.min(arena.bottom, Math.max(arena.top, y));
    const deltaX = aimX - cannon.x;
    const angle = aimY >= cannon.y
      ? deltaX < 0
        ? 180
        : deltaX > 0
          ? 0
          : 90
      : Math.atan2(cannon.y - aimY, deltaX) * (180 / Math.PI);

    this.state.aimPosition = { x: aimX, y: aimY };
    this.state.cannonAngle = Math.min(
      cannon.maxAngle,
      Math.max(cannon.minAngle, angle),
    );
  }

  beginCharge(): void {
    if (
      this.state.paused ||
      this.state.status !== "playing" ||
      this.state.skewers <= 0 ||
      this.state.charging ||
      this.state.skewer
    ) {
      return;
    }
    this.state.charging = true;
    this.state.chargeSeconds = 0;
  }

  releaseCharge(): boolean {
    if (!this.state.charging || this.state.paused) return false;
    const angle = this.state.cannonAngle;
    const speed = chargeToSpeed(this.state.chargeSeconds, simulationConfig);
    this.state.lastLaunchSpeed = speed;
    this.state.skewer = createSkewer(cannon, angle, speed);
    this.state.skewers -= 1;
    this.state.charging = false;
    return true;
  }

  getChargeProgress(): number {
    return Math.min(1, this.state.chargeSeconds / simulationConfig.maxChargeSeconds);
  }

  getTargetScore(): number {
    return this.stage.targetScore;
  }

  getPreview(): TrajectoryPoint[] {
    const speed = chargeToSpeed(this.state.chargeSeconds, simulationConfig);
    return predictTrajectory(
      cannon,
      this.state.cannonAngle,
      speed,
      arena,
      simulationConfig,
    );
  }

  togglePause(): boolean {
    if (this.state.status !== "playing") return this.state.paused;
    this.state.paused = !this.state.paused;
    return this.state.paused;
  }

  reset(): void {
    Object.assign(this.state, this.createInitialState());
    this.accumulator = 0;
  }

  private createInitialState(): SimulationState {
    return {
      elapsedSeconds: 0,
      cannonAngle: 90,
      aimPosition: { x: cannon.x, y: arena.top },
      chargeSeconds: 0,
      charging: false,
      paused: false,
      skewer: null,
      lastLaunchSpeed: simulationConfig.minLaunchSpeed,
      skewers: this.stage.skewers,
      score: 0,
      status: "playing",
      balls: this.stage.balls.map((ball) => ({
        id: ball.id,
        position: { x: ball.x, y: ball.y },
        radius: ball.radius,
        available: true,
        color: ball.color,
      })),
      bombs: this.stage.bombs.map((bomb) => ({
        id: bomb.id,
        position: { x: bomb.x, y: bomb.y },
        radius: bomb.radius,
        triggered: false,
      })),
    };
  }

  private processTargets(
    start: Vec2,
    end: Vec2,
    result: SimulationUpdate,
  ): void {
    const skewer = this.state.skewer;
    if (!skewer) return;

    const hits: Array<{
      time: number;
      kind: "ball" | "bomb";
      id: string;
      position: Vec2;
    }> = [];

    if (skewer.attachedBallIds.length < simulationConfig.maxBallsPerSkewer) {
      for (const ball of this.state.balls) {
        if (!ball.available) continue;
        const time = segmentCircleIntersection(
          start,
          end,
          ball.position,
          ball.radius + simulationConfig.tipRadius,
        );
        if (time !== null) {
          hits.push({ time, kind: "ball", id: ball.id, position: ball.position });
        }
      }
    }

    for (const bomb of this.state.bombs) {
      if (bomb.triggered) continue;
      const time = this.getBombHitTime(start, end, bomb.position, bomb.radius);
      if (time !== null) {
        hits.push({ time, kind: "bomb", id: bomb.id, position: bomb.position });
      }
    }

    hits.sort((a, b) => a.time - b.time);
    for (const hit of hits) {
      if (hit.kind === "bomb") {
        const bomb = this.state.bombs.find((candidate) => candidate.id === hit.id);
        if (!bomb || bomb.triggered) continue;
        bomb.triggered = true;
        skewer.active = false;
        this.state.skewers = Math.max(0, this.state.skewers - 1);
        this.state.score = Math.max(0, this.state.score - 500);
        result.bombHit = { ...hit.position };
        result.wallHit = null;
        return;
      }

      if (skewer.attachedBallIds.length >= simulationConfig.maxBallsPerSkewer) {
        continue;
      }
      const ball = this.state.balls.find((candidate) => candidate.id === hit.id);
      if (!ball || !ball.available) continue;
      ball.available = false;
      skewer.attachedBallIds.push(ball.id);
      result.ballHits.push({ ...hit.position });
    }
  }

  private finishSkewer(result: SimulationUpdate): boolean {
    const skewer = this.state.skewer;
    if (!skewer) return false;

    const completed =
      Boolean(result.wallHit) &&
      skewer.attachedBallIds.length === simulationConfig.maxBallsPerSkewer;
    if (completed) {
      this.state.score += 600;
      return true;
    }

    for (const ballId of skewer.attachedBallIds) {
      const ball = this.state.balls.find((candidate) => candidate.id === ballId);
      if (ball) ball.available = true;
    }
    result.restoredBalls = skewer.attachedBallIds.length > 0;
    return false;
  }

  private getBombHitTime(
    start: Vec2,
    end: Vec2,
    bombPosition: Vec2,
    bombRadius: number,
  ): number | null {
    const skewer = this.state.skewer;
    if (!skewer) return null;

    const speed = Math.hypot(skewer.velocity.x, skewer.velocity.y) || 1;
    const forward = {
      x: skewer.velocity.x / speed,
      y: skewer.velocity.y / speed,
    };
    const candidates: number[] = [];
    const sampleSpacing = simulationConfig.tipRadius * 2;

    for (
      let offset = 0;
      offset <= simulationConfig.skewerLength;
      offset += sampleSpacing
    ) {
      const time = segmentCircleIntersection(
        {
          x: start.x - forward.x * offset,
          y: start.y - forward.y * offset,
        },
        {
          x: end.x - forward.x * offset,
          y: end.y - forward.y * offset,
        },
        bombPosition,
        bombRadius + simulationConfig.tipRadius,
      );
      if (time !== null) candidates.push(time);
    }

    skewer.attachedBallIds.forEach((_ballId, index) => {
      const offset = 24 + index * simulationConfig.ballSpacing;
      const time = segmentCircleIntersection(
        {
          x: start.x - forward.x * offset,
          y: start.y - forward.y * offset,
        },
        {
          x: end.x - forward.x * offset,
          y: end.y - forward.y * offset,
        },
        bombPosition,
        bombRadius + 18,
      );
      if (time !== null) candidates.push(time);
    });

    return candidates.length > 0 ? Math.min(...candidates) : null;
  }

  private finishStage(): boolean {
    if (this.state.balls.every((ball) => !ball.available)) {
      this.state.score += 1000 + this.state.skewers * 300;
      this.state.status = "won";
      return true;
    }
    if (this.state.skewers <= 0) {
      this.state.status = "lost";
      return true;
    }
    return false;
  }
}
