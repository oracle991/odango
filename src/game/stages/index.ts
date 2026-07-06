import { firstSkewer } from "./01-first-skewer";
import { gentleMoon } from "./02-gentle-moon";
import { leftAndRight } from "./03-left-and-right";
import { strongAndSoft } from "./04-strong-and-soft";
import { boardGraduation } from "./05-board-graduation";
import { firstSpark } from "./06-first-spark";
import { menuOfThree } from "./07-menu-of-three";
import { boardWindow } from "./08-board-window";
import { fireAndBoard } from "./09-fire-and-board";
import { chapterTwoExam } from "./10-chapter-two-exam";
import { firstSway } from "./11-first-sway";
import { swayDuet } from "./12-sway-duet";
import { chimneyDrop } from "./13-chimney-drop";
import { bombGauntlet } from "./14-bomb-gauntlet";
import { grandFinale } from "./15-grand-finale";
import type { StageRecipe } from "./types";

export const stageRecipes = [
  firstSkewer,
  gentleMoon,
  leftAndRight,
  strongAndSoft,
  boardGraduation,
  firstSpark,
  menuOfThree,
  boardWindow,
  fireAndBoard,
  chapterTwoExam,
  firstSway,
  swayDuet,
  chimneyDrop,
  bombGauntlet,
  grandFinale,
] satisfies StageRecipe[];
