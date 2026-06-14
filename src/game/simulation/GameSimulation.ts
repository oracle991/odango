import { arena, cannon, simulationConfig } from "../config";
import {
  chargeToSpeed,
  createProjectile,
  predictTrajectory,
  stepProjectile,
} from "./physics";
import type { SimulationState, TrajectoryPoint } from "./types";

export class GameSimulation {
  readonly state: SimulationState = this.createInitialState();

  private accumulator = 0;

  update(deltaSeconds: number): boolean {
    if (this.state.paused) return false;

    this.state.elapsedSeconds += deltaSeconds;
    if (this.state.charging) {
      this.state.chargeSeconds = Math.min(
        simulationConfig.maxChargeSeconds,
        this.state.chargeSeconds + deltaSeconds,
      );
    }

    let bounced = false;
    this.accumulator += Math.min(deltaSeconds, 0.1);
    while (this.accumulator >= simulationConfig.fixedStepSeconds) {
      if (this.state.projectile?.active) {
        bounced =
          stepProjectile(
            this.state.projectile,
            simulationConfig.fixedStepSeconds,
            arena,
            simulationConfig,
          ) || bounced;
      }
      this.accumulator -= simulationConfig.fixedStepSeconds;
    }

    if (this.state.projectile && !this.state.projectile.active) {
      this.state.projectile = null;
    }
    return bounced;
  }

  getCurrentAngle(): number {
    const phase =
      (this.state.elapsedSeconds / cannon.swingPeriodSeconds) * Math.PI * 2;
    const midpoint = (cannon.minAngle + cannon.maxAngle) / 2;
    const amplitude = (cannon.maxAngle - cannon.minAngle) / 2;
    return midpoint + Math.sin(phase) * amplitude;
  }

  beginCharge(): void {
    if (this.state.paused || this.state.charging || this.state.projectile) return;
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
    this.state.charging = false;
    return true;
  }

  getChargeProgress(): number {
    return Math.min(1, this.state.chargeSeconds / simulationConfig.maxChargeSeconds);
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
    };
  }
}
