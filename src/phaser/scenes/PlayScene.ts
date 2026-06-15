import Phaser from "phaser";
import { arena, cannon, DESIGN_HEIGHT, DESIGN_WIDTH } from "../../game/config";
import { gameEvents, type GameCommand } from "../../game/input/gameEvents";
import { chargeToSpeed, muzzlePosition } from "../../game/simulation/physics";
import { GameSimulation } from "../../game/simulation/GameSimulation";
import type { BallState } from "../../game/simulation/types";
import { validationStages } from "../../game/stage";

interface HudDetail {
  angle: number;
  speed: number;
  charging: boolean;
  charge: number;
  skewerActive: boolean;
  attachedBalls: number;
  score: number;
  skewers: number;
  balls: number;
  status: "playing" | "won" | "lost";
  targetScore: number;
  shotResult: "complete" | "incomplete" | null;
  stageIndex: number;
  stageCount: number;
  stageName: string;
  stageObjective: string;
}

interface ImpactFx {
  x: number;
  y: number;
  kind: "ball" | "bomb" | "complete" | "incomplete";
  life: number;
}

interface GameSettings {
  screenShake: boolean;
  trajectoryAssist: boolean;
}

const ballColors: Record<BallState["color"], number> = {
  white: 0xfff8e8,
  pink: 0xf5a3a7,
  green: 0x91c98f,
};

export class PlayScene extends Phaser.Scene {
  private simulation = new GameSimulation(validationStages[0]);
  private stageIndex = 0;
  private worldGraphics!: Phaser.GameObjects.Graphics;
  private targetGraphics!: Phaser.GameObjects.Graphics;
  private trajectoryGraphics!: Phaser.GameObjects.Graphics;
  private cannonGraphics!: Phaser.GameObjects.Graphics;
  private aimGraphics!: Phaser.GameObjects.Graphics;
  private skewerGraphics!: Phaser.GameObjects.Graphics;
  private fxGraphics!: Phaser.GameObjects.Graphics;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private trajectoryAssist = true;
  private screenShake = true;
  private lastPreviewKey = "";
  private impacts: ImpactFx[] = [];
  private lastShotResult: HudDetail["shotResult"] = null;
  private shotResultLife = 0;

  constructor() {
    super("play");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#17162b");
    this.worldGraphics = this.add.graphics();
    this.targetGraphics = this.add.graphics();
    this.trajectoryGraphics = this.add.graphics();
    this.cannonGraphics = this.add.graphics();
    this.aimGraphics = this.add.graphics();
    this.skewerGraphics = this.add.graphics();
    this.fxGraphics = this.add.graphics();
    this.drawWorld();

    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error("Keyboard input is unavailable");
    this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    keyboard.on("keydown-ESC", () => this.handleCommand("pause"));
    keyboard.on("keydown-R", () => this.handleCommand("retry"));
    keyboard.on("keydown-P", () => this.handleCommand("previous-stage"));
    keyboard.on("keydown-N", () => this.handleCommand("next-stage"));
    keyboard.on("keydown-D", () => {
      this.trajectoryAssist = !this.trajectoryAssist;
      this.lastPreviewKey = "";
    });
    gameEvents.addEventListener("command", this.onCommand);
    window.addEventListener("odango-settings", this.onSettings);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      gameEvents.removeEventListener("command", this.onCommand);
      window.removeEventListener("odango-settings", this.onSettings);
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!pointer.wasTouch) this.updateAim(pointer);
    });
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (!this.isPlayArea(pointer)) return;
      this.updateAim(pointer);
      if (!pointer.wasTouch && pointer.leftButtonDown()) {
        this.simulation.beginCharge();
      }
    });
    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (!pointer.wasTouch) this.releaseCharge();
    });
    window.dispatchEvent(new CustomEvent("odango-ready"));
  }

  update(_time: number, deltaMilliseconds: number): void {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) this.simulation.beginCharge();
    if (Phaser.Input.Keyboard.JustUp(this.spaceKey)) this.releaseCharge();

    const result = this.simulation.update(deltaMilliseconds / 1000);
    let attachedCount =
      (this.simulation.state.skewer?.attachedBallIds.length ?? 0) - result.ballHits.length;
    for (const hit of result.ballHits) {
      attachedCount += 1;
      this.impacts.push({ ...hit, kind: "ball", life: 1 });
      this.emitFeedback("ball", attachedCount);
    }
    if (result.bombHit) {
      this.impacts.push({ ...result.bombHit, kind: "bomb", life: 1 });
      this.emitFeedback("bomb");
      if (this.screenShake) this.cameras.main.shake(260, 0.012);
    }
    if (result.wallHit) {
      const kind = result.completedSkewer ? "complete" : "incomplete";
      this.impacts.push({ ...result.wallHit, kind, life: 1 });
      this.emitFeedback(kind);
      if (result.completedSkewer && this.screenShake) {
        this.cameras.main.shake(180, 0.005);
      }
    }
    if (result.shotEnded) {
      this.lastShotResult = result.completedSkewer ? "complete" : "incomplete";
      this.shotResultLife = 1.25;
    }

    this.shotResultLife = Math.max(0, this.shotResultLife - deltaMilliseconds / 1000);
    if (this.shotResultLife === 0) this.lastShotResult = null;
    this.impacts = this.impacts
      .map((impact) => ({ ...impact, life: impact.life - deltaMilliseconds / 600 }))
      .filter((impact) => impact.life > 0);

    this.drawTargets();
    this.drawCannon();
    this.drawAim();
    this.drawSkewer();
    this.drawPreview();
    this.drawFx();
    this.emitHud();
  }

  private readonly onCommand = (event: Event): void => {
    this.handleCommand((event as CustomEvent<GameCommand>).detail);
  };

  private readonly onSettings = (event: Event): void => {
    const detail = (event as CustomEvent<GameSettings>).detail;
    this.screenShake = detail.screenShake;
    this.trajectoryAssist = detail.trajectoryAssist;
    this.lastPreviewKey = "";
  };

  private handleCommand(command: GameCommand): void {
    if (typeof command !== "string") {
      if (command.type === "load-stage") this.loadStage(command.stageIndex);
      return;
    }
    switch (command) {
      case "charge-start":
        this.simulation.beginCharge();
        break;
      case "charge-release":
        this.releaseCharge();
        break;
      case "pause":
        if (!this.simulation.state.paused) this.setPaused(true);
        break;
      case "resume":
        if (this.simulation.state.paused) this.setPaused(false);
        break;
      case "retry":
        this.resetStage();
        break;
      case "previous-stage":
        this.loadStage(this.stageIndex - 1);
        break;
      case "next-stage":
        this.loadStage(this.stageIndex + 1);
        break;
    }
  }

  private loadStage(index: number): void {
    this.stageIndex = Phaser.Math.Wrap(index, 0, validationStages.length);
    this.simulation = new GameSimulation(validationStages[this.stageIndex]);
    this.resetStage();
  }

  private releaseCharge(): void {
    if (this.simulation.releaseCharge()) this.emitFeedback("launch");
  }

  private resetStage(): void {
    this.simulation.reset();
    this.impacts = [];
    this.lastShotResult = null;
    this.shotResultLife = 0;
    this.lastPreviewKey = "";
    window.dispatchEvent(new CustomEvent("odango-pause", { detail: false }));
    this.drawWorld();
  }

  private setPaused(paused: boolean): void {
    if (this.simulation.state.paused !== paused) this.simulation.togglePause();
    window.dispatchEvent(new CustomEvent("odango-pause", { detail: paused }));
  }

  private isPlayArea(pointer: Phaser.Input.Pointer): boolean {
    return pointer.x >= arena.left &&
      pointer.x <= arena.right &&
      pointer.y >= arena.top &&
      pointer.y <= arena.bottom;
  }

  private updateAim(pointer: Phaser.Input.Pointer): void {
    if (!this.isPlayArea(pointer)) return;
    this.simulation.setAimPosition(pointer.x, pointer.y);
    this.lastPreviewKey = "";
  }

  private drawWorld(): void {
    const g = this.worldGraphics;
    g.clear();
    g.fillGradientStyle(0x302b55, 0x302b55, 0x17162b, 0x17162b, 1);
    g.fillRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);

    g.fillStyle(0xf5c5d8, 0.08);
    for (let i = 0; i < 28; i += 1) {
      const x = (i * 173) % DESIGN_WIDTH;
      const y = 80 + ((i * 97) % 430);
      g.fillCircle(x, y, 2 + (i % 3));
    }

    g.lineStyle(8, 0x8f542f, 1);
    g.strokeRoundedRect(
      arena.left,
      arena.top,
      arena.right - arena.left,
      arena.bottom - arena.top,
      18,
    );
    g.lineStyle(3, 0xf4d7a1, 0.75);
    g.strokeRoundedRect(
      arena.left + 5,
      arena.top + 5,
      arena.right - arena.left - 10,
      arena.bottom - arena.top - 10,
      14,
    );

    g.lineStyle(1, 0xf4d7a1, 0.1);
    for (let x = arena.left + 80; x < arena.right; x += 80) {
      g.lineBetween(x, arena.top, x, arena.bottom);
    }
    for (let y = arena.top + 80; y < arena.bottom; y += 80) {
      g.lineBetween(arena.left, y, arena.right, y);
    }

    for (const obstacle of this.simulation.getStage().obstacles ?? []) {
      g.fillStyle(0x4a2d21, 1);
      g.fillRoundedRect(
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height,
        8,
      );
      g.lineStyle(5, 0xf4d7a1, 0.8);
      g.strokeRoundedRect(
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height,
        8,
      );
    }
  }

  private drawCannon(): void {
    const g = this.cannonGraphics;
    const angle = this.simulation.getCurrentAngle();
    const radians = Phaser.Math.DegToRad(angle);
    const muzzle = muzzlePosition(cannon, angle);
    g.clear();

    g.lineStyle(20, 0x9d5c63, 1);
    g.lineBetween(cannon.x, cannon.y, muzzle.x, muzzle.y);
    g.lineStyle(10, 0xf4d7a1, 1);
    g.lineBetween(
      cannon.x + Math.cos(radians) * 8,
      cannon.y - Math.sin(radians) * 8,
      muzzle.x,
      muzzle.y,
    );
    g.fillStyle(0x3f2a3d, 1);
    g.fillRoundedRect(cannon.x - 62, cannon.y - 18, 124, 48, 20);
    g.fillStyle(0xd88972, 1);
    g.fillCircle(cannon.x, cannon.y, 30);
    g.fillStyle(0xf9e9c8, 1);
    g.fillCircle(cannon.x, cannon.y, 14);

    if (this.simulation.state.charging) {
      const pulse = 28 + this.simulation.getChargeProgress() * 20;
      g.lineStyle(5, 0xffb84d, 0.8);
      g.strokeCircle(cannon.x, cannon.y, pulse);
    }
  }

  private drawAim(): void {
    const g = this.aimGraphics;
    const { x, y } = this.simulation.state.aimPosition;
    const angle = Phaser.Math.DegToRad(this.simulation.getCurrentAngle());
    const directionX = cannon.x + Math.cos(angle) * 150;
    const directionY = cannon.y - Math.sin(angle) * 150;
    g.clear();
    if (
      this.simulation.state.paused ||
      this.simulation.state.status !== "playing" ||
      this.simulation.state.skewer
    ) {
      return;
    }

    g.lineStyle(2, 0xffcf70, 0.26);
    g.lineBetween(cannon.x, cannon.y, directionX, directionY);
    g.lineStyle(2, 0xffcf70, 0.75);
    g.strokeCircle(x, y, 12);
    g.lineBetween(x - 18, y, x - 7, y);
    g.lineBetween(x + 7, y, x + 18, y);
    g.lineBetween(x, y - 18, x, y - 7);
    g.lineBetween(x, y + 7, x, y + 18);
    g.fillStyle(0xffcf70, 0.9);
    g.fillCircle(x, y, 3);
  }

  private drawTargets(): void {
    const g = this.targetGraphics;
    g.clear();

    for (const ball of this.simulation.state.balls) {
      if (!ball.available) continue;
      const { x, y } = ball.position;
      const float = Math.sin(this.simulation.state.elapsedSeconds * 3 + x) * 3;
      g.fillStyle(0x000000, 0.2);
      g.fillEllipse(x + 5, y + float + 19, 38, 12);
      g.fillStyle(ballColors[ball.color], 1);
      g.fillCircle(x, y + float, ball.radius);
      g.lineStyle(3, 0x5d3948, 0.8);
      g.strokeCircle(x, y + float, ball.radius);
      this.drawBallMark(g, ball.color, x, y + float);
      g.fillStyle(0x5d3948, 1);
      g.fillCircle(x - 6, y + float - 4, 2);
      g.fillCircle(x + 6, y + float - 4, 2);
    }

    for (const bomb of this.simulation.state.bombs) {
      if (bomb.triggered) continue;
      const { x, y } = bomb.position;
      const pulse = 1 + Math.sin(this.simulation.state.elapsedSeconds * 8) * 0.08;
      g.fillStyle(0x0b0912, 1);
      g.fillCircle(x, y, bomb.radius * pulse);
      g.lineStyle(5, 0xff5d5d, 0.9);
      g.strokeCircle(x, y, (bomb.radius + 7) * pulse);
      g.lineStyle(4, 0xffcf70, 1);
      g.lineBetween(x + 10, y - 24, x + 21, y - 42);
      g.fillStyle(0xff5d5d, 1);
      g.fillCircle(x + 23, y - 45, 6);
    }
  }

  private drawSkewer(): void {
    const g = this.skewerGraphics;
    const skewer = this.simulation.state.skewer;
    const config = this.simulation.getConfig();
    g.clear();
    if (!skewer) return;

    const length = Math.hypot(skewer.velocity.x, skewer.velocity.y) || 1;
    const forwardX = skewer.velocity.x / length;
    const forwardY = skewer.velocity.y / length;
    const backX = skewer.position.x - forwardX * config.skewerLength;
    const backY = skewer.position.y - forwardY * config.skewerLength;

    g.lineStyle(9, 0x4a2d21, 0.25);
    g.lineBetween(backX + 5, backY + 6, skewer.position.x + 5, skewer.position.y + 6);
    g.lineStyle(7, 0xc88b52, 1);
    g.lineBetween(backX, backY, skewer.position.x, skewer.position.y);
    g.lineStyle(3, 0xffe0a3, 1);
    g.lineBetween(
      skewer.position.x - forwardX * 12,
      skewer.position.y - forwardY * 12,
      skewer.position.x,
      skewer.position.y,
    );

    skewer.attachedBallIds.forEach((ballId, index) => {
      const ball = this.simulation.state.balls.find((candidate) => candidate.id === ballId);
      if (!ball) return;
      const distance = 24 + index * config.ballSpacing;
      const x = skewer.position.x - forwardX * distance;
      const y = skewer.position.y - forwardY * distance;
      g.fillStyle(0x000000, 0.2);
      g.fillCircle(x + 4, y + 5, 19);
      g.fillStyle(ballColors[ball.color], 1);
      g.fillCircle(x, y, 18);
      g.lineStyle(3, 0x5d3948, 0.85);
      g.strokeCircle(x, y, 18);
      this.drawBallMark(g, ball.color, x, y);
    });

    const indicatorY = skewer.position.y - 42;
    for (let i = 0; i < config.maxBallsPerSkewer; i += 1) {
      const x = skewer.position.x + (i - 1) * 18;
      const filled = i < skewer.attachedBallIds.length;
      g.fillStyle(filled ? 0xffcf70 : 0x302b55, filled ? 1 : 0.75);
      g.fillCircle(x, indicatorY, 6);
      g.lineStyle(2, 0xfff8e8, 0.85);
      g.strokeCircle(x, indicatorY, 6);
    }
  }

  private drawPreview(): void {
    const config = this.simulation.getConfig();
    const angle = Math.round(this.simulation.getCurrentAngle() * 2) / 2;
    const speed = Math.round(
      chargeToSpeed(this.simulation.state.chargeSeconds, config) / 5,
    ) * 5;
    const key = `${angle}:${speed}:${this.trajectoryAssist}:${Boolean(this.simulation.state.skewer)}:${this.simulation.state.status}`;
    if (key === this.lastPreviewKey) return;
    this.lastPreviewKey = key;

    const g = this.trajectoryGraphics;
    g.clear();
    if (
      !this.trajectoryAssist ||
      this.simulation.state.skewer ||
      this.simulation.state.status !== "playing"
    ) {
      return;
    }

    const points = this.simulation.getPreview();
    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      if (point.wall) {
        g.fillStyle(0xffb84d, 0.95);
        g.fillPoints(
          [
            new Phaser.Geom.Point(point.x, point.y - 8),
            new Phaser.Geom.Point(point.x + 8, point.y),
            new Phaser.Geom.Point(point.x, point.y + 8),
            new Phaser.Geom.Point(point.x - 8, point.y),
          ],
          true,
        );
      } else if (i % 2 === 0) {
        g.fillStyle(0xf4d7a1, Math.max(0.16, 0.72 - i / points.length));
        g.fillCircle(point.x, point.y, 3);
      }
    }
  }

  private drawFx(): void {
    const g = this.fxGraphics;
    g.clear();
    for (const impact of this.impacts) {
      const color =
        impact.kind === "bomb"
          ? 0xff5d5d
          : impact.kind === "complete"
            ? 0xffcf70
            : impact.kind === "incomplete"
              ? 0xa99eae
              : 0xb7f1e5;
      const radius = impact.kind === "bomb" ? 90 : impact.kind === "complete" ? 70 : 42;
      g.lineStyle(8, color, impact.life);
      g.strokeCircle(impact.x, impact.y, 12 + (1 - impact.life) * radius);
      if (impact.kind === "bomb" || impact.kind === "complete") {
        g.fillStyle(color, impact.life * 0.25);
        g.fillCircle(impact.x, impact.y, 54 * impact.life);
      }
      const rayCount = impact.kind === "complete" ? 12 : impact.kind === "ball" ? 6 : 8;
      for (let i = 0; i < rayCount; i += 1) {
        const angle = (Math.PI * 2 * i) / rayCount;
        const inner = 18 + (1 - impact.life) * 22;
        const outer = inner + (impact.kind === "complete" ? 18 : 10);
        g.lineStyle(3, color, impact.life);
        g.lineBetween(
          impact.x + Math.cos(angle) * inner,
          impact.y + Math.sin(angle) * inner,
          impact.x + Math.cos(angle) * outer,
          impact.y + Math.sin(angle) * outer,
        );
      }
    }
  }

  private drawBallMark(
    graphics: Phaser.GameObjects.Graphics,
    color: BallState["color"],
    x: number,
    y: number,
  ): void {
    graphics.lineStyle(3, 0x5d3948, 0.8);
    if (color === "white") {
      graphics.strokeCircle(x, y + 7, 4);
    } else if (color === "pink") {
      graphics.lineBetween(x - 7, y + 7, x + 7, y + 7);
    } else {
      graphics.strokeTriangle(x, y + 1, x - 6, y + 11, x + 6, y + 11);
    }
  }

  private emitFeedback(
    kind: "ball" | "bomb" | "complete" | "incomplete" | "launch",
    count?: number,
  ): void {
    window.dispatchEvent(
      new CustomEvent("odango-feedback", { detail: { kind, count } }),
    );
  }

  private emitHud(): void {
    const config = this.simulation.getConfig();
    const stage = this.simulation.getStage();
    const speed = this.simulation.state.charging
      ? chargeToSpeed(this.simulation.state.chargeSeconds, config)
      : this.simulation.state.lastLaunchSpeed;
    const detail: HudDetail = {
      angle: this.simulation.getCurrentAngle(),
      speed,
      charging: this.simulation.state.charging,
      charge: this.simulation.getChargeProgress(),
      skewerActive: Boolean(this.simulation.state.skewer),
      attachedBalls: this.simulation.state.skewer?.attachedBallIds.length ?? 0,
      score: this.simulation.state.score,
      skewers: this.simulation.state.skewers,
      balls: this.simulation.state.balls.filter((ball) => ball.available).length,
      status: this.simulation.state.status,
      targetScore: this.simulation.getTargetScore(),
      shotResult: this.lastShotResult,
      stageIndex: this.stageIndex,
      stageCount: validationStages.length,
      stageName: stage.name ?? stage.id,
      stageObjective: stage.objective ?? "",
    };
    window.dispatchEvent(new CustomEvent<HudDetail>("odango-hud", { detail }));
  }
}
