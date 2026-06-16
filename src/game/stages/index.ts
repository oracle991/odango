import { straightTrio } from "./01-straight-trio";
import { softArc } from "./02-soft-arc";
import { fastShallow } from "./03-fast-shallow";
import { overTheBoard } from "./04-over-the-board";
import { bombLane } from "./05-bomb-lane";
import { twinArcs } from "./06-twin-arcs";
import { lowHighLow } from "./07-low-high-low";
import { bombGates } from "./08-bomb-gates";
import { splitWalls } from "./09-split-walls";
import { chapterTwoFinale } from "./10-chapter-two-finale";
import { firstMotion } from "./11-first-motion";
import { movingPairs } from "./12-moving-pairs";
import { narrowCorridors } from "./13-narrow-corridors";
import { fourWayClock } from "./14-four-way-clock";
import { grandFinale } from "./15-grand-finale";
import type { StageRecipe } from "./types";

export const stageRecipes = [
  straightTrio,
  softArc,
  fastShallow,
  overTheBoard,
  bombLane,
  twinArcs,
  lowHighLow,
  bombGates,
  splitWalls,
  chapterTwoFinale,
  firstMotion,
  movingPairs,
  narrowCorridors,
  fourWayClock,
  grandFinale,
] satisfies StageRecipe[];
