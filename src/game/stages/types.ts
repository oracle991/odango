import type {
  BallMotionDefinition,
  BallState,
  ObstacleDefinition,
  StageDefinition,
} from "../simulation/types";

export interface RepresentativeShot {
  angle: number;
  speed: number;
}

export interface StageBall {
  x: number;
  y: number;
  color?: BallState["color"];
  motion?: BallMotionDefinition;
}

export interface StageBallGroup {
  shot: RepresentativeShot;
  alternateShots?: readonly RepresentativeShot[];
  balls: readonly [StageBall, StageBall, StageBall];
  moving?: boolean;
}

export interface StageRecipe {
  id: string;
  name: string;
  objective: string;
  chapter: 1 | 2 | 3;
  groups: readonly StageBallGroup[];
  scoringWallIds: string[];
  spareSkewers: number;
  gravity?: number;
  minLaunchSpeed?: number;
  maxLaunchSpeed?: number;
  bombs?: StageDefinition["bombs"];
  obstacles?: ObstacleDefinition[];
  completionOrderBonuses?: StageDefinition["completionOrderBonuses"];
  dangoRecipes?: StageDefinition["dangoRecipes"];
  dangoMenu?: StageDefinition["dangoMenu"];
}
