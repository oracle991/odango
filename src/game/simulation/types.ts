export interface Vec2 {
  x: number;
  y: number;
}

export interface Arena {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface CannonConfig {
  x: number;
  y: number;
  minAngle: number;
  maxAngle: number;
  swingPeriodSeconds: number;
  barrelLength: number;
}

export interface SimulationConfig {
  gravity: number;
  radius: number;
  restitution: number;
  minChargeSeconds: number;
  maxChargeSeconds: number;
  minLaunchSpeed: number;
  maxLaunchSpeed: number;
  maxBounces: number;
  maxFlightSeconds: number;
  fixedStepSeconds: number;
}

export interface ProjectileState {
  position: Vec2;
  velocity: Vec2;
  bounces: number;
  ageSeconds: number;
  active: boolean;
}

export interface SimulationState {
  elapsedSeconds: number;
  cannonAngle: number;
  chargeSeconds: number;
  charging: boolean;
  paused: boolean;
  projectile: ProjectileState | null;
  lastLaunchSpeed: number;
}

export interface TrajectoryPoint extends Vec2 {
  bounce: boolean;
}
