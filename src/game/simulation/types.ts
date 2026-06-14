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

export interface EnemyState {
  id: string;
  position: Vec2;
  radius: number;
  alive: boolean;
}

export interface BombState {
  id: string;
  position: Vec2;
  radius: number;
  triggered: boolean;
}

export type StageStatus = "playing" | "won" | "lost";

export interface SimulationState {
  elapsedSeconds: number;
  cannonAngle: number;
  chargeSeconds: number;
  charging: boolean;
  paused: boolean;
  projectile: ProjectileState | null;
  lastLaunchSpeed: number;
  ammo: number;
  score: number;
  status: StageStatus;
  shotCombo: number;
  enemies: EnemyState[];
  bombs: BombState[];
}

export interface TrajectoryPoint extends Vec2 {
  bounce: boolean;
}

export interface TargetDefinition {
  id: string;
  x: number;
  y: number;
  radius: number;
}

export interface StageDefinition {
  id: string;
  ammo: number;
  targetScore: number;
  enemies: TargetDefinition[];
  bombs: TargetDefinition[];
}

export interface SimulationUpdate {
  bounced: boolean;
  enemyHits: Vec2[];
  bombHit: Vec2 | null;
  shotEnded: boolean;
  statusChanged: boolean;
}
