import type {
  ObstacleDefinition,
  StageDefinition,
} from "../simulation/types";

export interface RepresentativeShot {
  angle: number;
  speed: number;
}

export interface StageRecipe {
  id: string;
  name: string;
  objective: string;
  chapter: 1 | 2 | 3;
  shots: RepresentativeShot[];
  scoringWallIds: string[];
  spareSkewers: number;
  times?: number[][];
  gravity?: number;
  minLaunchSpeed?: number;
  maxLaunchSpeed?: number;
  bombs?: StageDefinition["bombs"];
  obstacles?: ObstacleDefinition[];
  movingGroups?: number[];
}
