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
  barrelLength: number;
}

export interface SimulationConfig {
  gravity: number;
  tipRadius: number;
  skewerLength: number;
  ballSpacing: number;
  attachedBallOffset: number;
  attachedBallRadius: number;
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
  basePosition: Vec2;
  radius: number;
  available: boolean;
  color: "white" | "pink" | "green";
  motion?: BallMotionDefinition;
}

export interface BombState {
  id: string;
  position: Vec2;
  radius: number;
  triggered: boolean;
}

export interface CompletionOrderBonus {
  order: readonly BallState["color"][];
  points: number;
  label?: string;
}

export type StageStatus = "playing" | "won" | "lost";

export interface SimulationState {
  elapsedSeconds: number;
  cannonAngle: number;
  aimPosition: Vec2;
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

export interface WallHit extends Vec2 {
  wallId: string;
}

export interface TargetDefinition {
  id: string;
  x: number;
  y: number;
  radius: number;
}

export interface ObstacleDefinition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BallDefinition extends TargetDefinition {
  color: BallState["color"];
  motion?: BallMotionDefinition;
}

export interface BallMotionDefinition {
  axis: "x" | "y";
  amplitude: number;
  periodSeconds: number;
  phase?: number;
}

export interface StageDefinition {
  id: string;
  name?: string;
  objective?: string;
  chapter?: 1 | 2 | 3;
  skewers: number;
  targetScore: number;
  balls: BallDefinition[];
  bombs: TargetDefinition[];
  obstacles?: ObstacleDefinition[];
  scoringWallIds?: string[];
  completionOrderBonuses?: readonly CompletionOrderBonus[];
  simulation?: Partial<
    Pick<SimulationConfig, "gravity" | "minLaunchSpeed" | "maxLaunchSpeed">
  >;
}

export interface SimulationUpdate {
  ballHits: Vec2[];
  bombHit: Vec2 | null;
  wallHit: WallHit | null;
  shotEnded: boolean;
  completedSkewer: boolean;
  completionOrderBonus: CompletionOrderBonus | null;
  restoredBalls: boolean;
  statusChanged: boolean;
}
