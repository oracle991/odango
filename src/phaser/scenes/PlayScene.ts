import Phaser from "phaser";
import { arena, cannon, DESIGN_HEIGHT, DESIGN_WIDTH, simulationConfig } from "../../game/config";
import { gameEvents, type GameCommand } from "../../game/input/gameEvents";
import { chargeToSpeed, muzzlePosition } from "../../game/simulation/physics";
import { GameSimulation } from "../../game/simulation/GameSimulation";

interface HudDetail {
  angle: number;
  speed: number;
  bounces: number;
  charging: boolean;
  charge: number;
  projectileActive: boolean;
}

export class PlayScene extends Phaser.Scene {
  private readonly simulation = new GameSimulation();
  private worldGraphics!: Phaser.GameObjects.Graphics;
  private trajectoryGraphics!: Phaser.GameObjects.Graphics;
  private cannonGraphics!: Phaser.GameObjects.Graphics;
  private projectileGraphics!: Phaser.GameObjects.Graphics;
  private fxGraphics!: Phaser.GameObjects.Graphics;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private debugVisible = true;
  private lastPreviewKey = "";
  private flash = 0;

  constructor() {
    super("play");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#17162b");
    this.worldGraphics = this.add.graphics();
    this.trajectoryGraphics = this.add.graphics();
    this.cannonGraphics = this.add.graphics();
    this.projectileGraphics = this.add.graphics();
    this.fxGraphics = this.add.graphics();
    this.drawWorld();

    const keyboard = this.input.keyboard;
    if (!keyboard) throw new Error("Keyboard input is unavailable");
    this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    keyboard.on("keydown-ESC", () => this.handleCommand("pause"));
    keyboard.on("keydown-R", () => this.handleCommand("retry"));
    keyboard.on("keydown-D", () => {
      this.debugVisible = !this.debugVisible;
      this.lastPreviewKey = "";
    });
    gameEvents.addEventListener("command", this.onCommand);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      gameEvents.removeEventListener("command", this.onCommand);
    });

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.y < DESIGN_HEIGHT - 110) this.simulation.beginCharge();
    });
    this.input.on("pointerup", () => this.simulation.releaseCharge());
    window.dispatchEvent(new CustomEvent("odango-ready"));
  }

  update(_time: number, deltaMilliseconds: number): void {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) this.simulation.beginCharge();
    if (Phaser.Input.Keyboard.JustUp(this.spaceKey)) this.simulation.releaseCharge();

    const bounced = this.simulation.update(deltaMilliseconds / 1000);
    if (bounced) this.flash = 1;
    this.flash = Math.max(0, this.flash - deltaMilliseconds / 180);

    this.drawCannon();
    this.drawProjectile();
    this.drawPreview();
    this.drawFx();
    this.emitHud();
  }

  private readonly onCommand = (event: Event): void => {
    this.handleCommand((event as CustomEvent<GameCommand>).detail);
  };

  private handleCommand(command: GameCommand): void {
    switch (command) {
      case "charge-start":
        this.simulation.beginCharge();
        break;
      case "charge-release":
        this.simulation.releaseCharge();
        break;
      case "pause":
        if (!this.simulation.state.paused) this.setPaused(true);
        break;
      case "resume":
        if (this.simulation.state.paused) this.setPaused(false);
        break;
      case "retry":
        this.simulation.reset();
        this.setPaused(false);
        break;
    }
  }

  private setPaused(paused: boolean): void {
    if (this.simulation.state.paused !== paused) this.simulation.togglePause();
    window.dispatchEvent(new CustomEvent("odango-pause", { detail: paused }));
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

    g.lineStyle(4, 0xf4d7a1, 0.7);
    g.strokeRoundedRect(
      arena.left,
      arena.top,
      arena.right - arena.left,
      arena.bottom - arena.top,
      18,
    );
    g.lineStyle(1, 0xf4d7a1, 0.12);
    for (let x = arena.left + 80; x < arena.right; x += 80) {
      g.lineBetween(x, arena.top, x, arena.bottom);
    }
    for (let y = arena.top + 80; y < arena.bottom; y += 80) {
      g.lineBetween(arena.left, y, arena.right, y);
    }

    g.fillStyle(0x0d0c1a, 0.6);
    g.fillRect(arena.left, arena.bottom - 10, arena.right - arena.left, 10);
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

  private drawProjectile(): void {
    const g = this.projectileGraphics;
    const projectile = this.simulation.state.projectile;
    g.clear();
    if (!projectile) return;

    const { x, y } = projectile.position;
    g.fillStyle(0x000000, 0.25);
    g.fillCircle(x + 7, y + 9, simulationConfig.radius + 2);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(x, y, simulationConfig.radius);
    g.fillStyle(0xf5a3a7, 1);
    g.fillCircle(x, y - 1, simulationConfig.radius * 0.7);
    g.fillStyle(0x91c98f, 1);
    g.fillCircle(x, y + 5, simulationConfig.radius * 0.42);
    g.fillStyle(0x3f2a3d, 1);
    g.fillCircle(x - 5, y - 4, 2);
    g.fillCircle(x + 5, y - 4, 2);
  }

  private drawPreview(): void {
    const angle = Math.round(this.simulation.getCurrentAngle() * 2) / 2;
    const speed = Math.round(
      chargeToSpeed(this.simulation.state.chargeSeconds, simulationConfig) / 5,
    ) * 5;
    const key = `${angle}:${speed}:${this.debugVisible}:${Boolean(this.simulation.state.projectile)}`;
    if (key === this.lastPreviewKey) return;
    this.lastPreviewKey = key;

    const g = this.trajectoryGraphics;
    g.clear();
    if (!this.debugVisible || this.simulation.state.projectile) return;

    const points = this.simulation.getPreview();
    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      if (point.bounce) {
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
    if (this.flash <= 0 || !this.simulation.state.projectile) return;
    const { x, y } = this.simulation.state.projectile.position;
    g.lineStyle(7, 0xffb84d, this.flash);
    g.strokeCircle(x, y, 24 + (1 - this.flash) * 36);
  }

  private emitHud(): void {
    const angle = this.simulation.getCurrentAngle();
    const speed = this.simulation.state.charging
      ? chargeToSpeed(this.simulation.state.chargeSeconds, simulationConfig)
      : this.simulation.state.lastLaunchSpeed;
    const detail: HudDetail = {
      angle,
      speed,
      bounces: this.simulation.state.projectile?.bounces ?? 0,
      charging: this.simulation.state.charging,
      charge: this.simulation.getChargeProgress(),
      projectileActive: Boolean(this.simulation.state.projectile),
    };
    window.dispatchEvent(new CustomEvent<HudDetail>("odango-hud", { detail }));
  }
}
