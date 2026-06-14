import { arena, cannon, simulationConfig } from "../config";
import { coreRulesStage } from "../stage";
import {
  chargeToSpeed,
  createProjectile,
  predictTrajectory,
  segmentCircleIntersection,
  stepProjectile,
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
  private readonly totalEnemies: number;

  constructor(private readonly stage: StageDefinition = coreRulesStage) {
    this.totalEnemies = stage.enemies.length;
    this.state = this.createInitialState();
  }

  update(deltaSeconds: number): SimulationUpdate {
    const result: SimulationUpdate = {
      bounced: false,
      enemyHits: [],
      bombHit: null,
      shotEnded: false,
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
      if (this.state.projectile?.active) {
        const start = { ...this.state.projectile.position };
        const bounced = stepProjectile(
          this.state.projectile,
          simulationConfig.fixedStepSeconds,
          arena,
          simulationConfig,
        );
        result.bounced = bounced || result.bounced;
        this.processTargets(start, this.state.projectile.position, result);
      }
      this.accumulator -= simulationConfig.fixedStepSeconds;
    }

    if (this.state.projectile && !this.state.projectile.active) {
      this.state.projectile = null;
      result.shotEnded = true;
      result.statusChanged = this.finishShot();
    }
    return result;
  }

  getCurrentAngle(): number {
    const phase =
      (this.state.elapsedSeconds / cannon.swingPeriodSeconds) * Math.PI * 2;
    const midpoint = (cannon.minAngle + cannon.maxAngle) / 2;
    const amplitude = (cannon.maxAngle - cannon.minAngle) / 2;
    return midpoint + Math.sin(phase) * amplitude;
  }

  beginCharge(): void {
    if (
      this.state.paused ||
      this.state.status !== "playing" ||
      this.state.ammo <= 0 ||
      this.state.charging ||
      this.state.projectile
    ) {
      return;
    }
    this.state.charging = true;
    this.state.chargeSeconds = 0;
  }

  releaseCharge(): boolean {
    if (!this.state.charging || this.state.paused) return false;
    const angle = this.getCurrentAngle();
    const speed = chargeToSpeed(this.state.chargeSeconds, simulationConfig);
    this.state.cannonAngle = angle;
    this.state.lastLaunchSpeed = speed;
    this.state.projectile = createProjectile(cannon, angle, speed);
    this.state.ammo -= 1;
    this.state.shotCombo = 0;
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
      this.getCurrentAngle(),
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
      chargeSeconds: 0,
      charging: false,
      paused: false,
      projectile: null,
      lastLaunchSpeed: simulationConfig.minLaunchSpeed,
      ammo: this.stage.ammo,
      score: 0,
      status: "playing",
      shotCombo: 0,
      enemies: this.stage.enemies.map((enemy) => ({
        id: enemy.id,
        position: { x: enemy.x, y: enemy.y },
        radius: enemy.radius,
        alive: true,
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
    const projectile = this.state.projectile;
    if (!projectile) return;

    const hits: Array<{
      time: number;
      kind: "enemy" | "bomb";
      id: string;
      position: Vec2;
    }> = [];
    const projectileRadius = simulationConfig.radius;

    for (const enemy of this.state.enemies) {
      if (!enemy.alive) continue;
      const time = segmentCircleIntersection(
        start,
        end,
        enemy.position,
        enemy.radius + projectileRadius,
      );
      if (time !== null) {
        hits.push({ time, kind: "enemy", id: enemy.id, position: enemy.position });
      }
    }

    for (const bomb of this.state.bombs) {
      if (bomb.triggered) continue;
      const time = segmentCircleIntersection(
        start,
        end,
        bomb.position,
        bomb.radius + projectileRadius,
      );
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
        projectile.active = false;
        this.state.ammo = Math.max(0, this.state.ammo - 1);
        this.state.score = Math.max(0, this.state.score - 500);
        result.bombHit = { ...hit.position };
        return;
      }

      const enemy = this.state.enemies.find((candidate) => candidate.id === hit.id);
      if (!enemy || !enemy.alive) continue;
      enemy.alive = false;
      this.state.shotCombo += 1;
      this.state.score += 100 * this.state.shotCombo;
      if (projectile.bounces >= 2) this.state.score += 100;
      result.enemyHits.push({ ...hit.position });

      if (
        this.state.enemies.every((candidate) => !candidate.alive) &&
        this.state.shotCombo === this.totalEnemies
      ) {
        this.state.score += 1000;
      }
    }
  }

  private finishShot(): boolean {
    if (this.state.enemies.every((enemy) => !enemy.alive)) {
      this.state.score += this.state.ammo * 300;
      this.state.status = "won";
      return true;
    }
    if (this.state.ammo <= 0) {
      this.state.status = "lost";
      return true;
    }
    return false;
  }
}
