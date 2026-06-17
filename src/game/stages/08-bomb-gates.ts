import { choiceGroup } from "./choiceGroup";
import type { StageRecipe } from "./types";

export const bombGates = {
  id: "bomb-gates",
  name: "八、火門三つ",
  objective:
    "爆弾は中央の雑な直線を咎める。左右と月見のどちらへ逃がすかで得点計画を変える。",
  chapter: 2,
  groups: [
    choiceGroup({
      shot: { angle: 56, speed: 600 },
      alternateShot: { angle: 80, speed: 760 },
      center: { x: 933, y: 398 },
    }),
    choiceGroup({
      shot: { angle: 100, speed: 760 },
      alternateShot: { angle: 124, speed: 600 },
      center: { x: 347, y: 398 },
    }),
    choiceGroup({
      shot: { angle: 60, speed: 800 },
      alternateShot: { angle: 64, speed: 600 },
      center: { x: 817, y: 388 },
    }),
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 2,
  bombs: [
    { id: "bomb-low-left", x: 430, y: 535, radius: 26 },
    { id: "bomb-low-right", x: 850, y: 535, radius: 26 },
    { id: "bomb-center", x: 640, y: 455, radius: 22 },
  ],
} satisfies StageRecipe;
