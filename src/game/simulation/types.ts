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
  tipRadius: number;
  skewerLength: number;
  ballSpacing: number;
  maxBallsPerSkewer: number;
  minChargeSeconds: number;
  maxChargeSeconds: number;
  minLaunchSpeed: number;
  maxLaunchSpeed: number;
  maxFlightSeconds: number;
  fixedStepSeconds: number;
}

export interface SkewerState {
  position: Vec2;
  velocity: Vec2;
  ageSeconds: number;
  active: boolean;
  attachedBallIds: string[];
}

export interface BallState {
  id: string;
  position: Vec2;
  radius: number;
  available: boolean;
  color: "white" | "pink" | "green";
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
  skewer: SkewerState | null;
  lastLaunchSpeed: number;
  skewers: number;
  score: number;
  status: StageStatus;
  balls: BallState[];
  bombs: BombState[];
}

export interface TrajectoryPoint extends Vec2 {
  wall: boolean;
}

export interface TargetDefinition {
  id: string;
  x: number;
  y: number;
  radius: number;
}

export interface BallDefinition extends TargetDefinition {
  color: BallState["color"];
}

export interface StageDefinition {
  id: string;
  skewers: number;
  targetScore: number;
  balls: BallDefinition[];
  bombs: TargetDefinition[];
}

export interface SimulationUpdate {
  ballHits: Vec2[];
  bombHit: Vec2 | null;
  wallHit: Vec2 | null;
  shotEnded: boolean;
  completedSkewer: boolean;
  restoredBalls: boolean;
  statusChanged: boolean;
}
