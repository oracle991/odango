import type { StageRecipe } from "./types";

export const lowHighLow = {
  id: "low-high-low",
  name: "七、低く高く選ぶ",
  objective:
    "高い山なりと低い直線、二筋の軌道上に三個ずつ並ぶ。狙った筋へ素直に通せば三連刺しになる。",
  chapter: 2,
  groups: [
    {
      shot: { angle: 72, speed: 800 },
      alternateShots: [{ angle: 73, speed: 780 }],
      balls: [
        { x: 825, y: 221 },
        { x: 861, y: 177 },
        { x: 903, y: 141 },
      ],
    },
    {
      shot: { angle: 100, speed: 760 },
      balls: [
        { x: 453, y: 139 },
        { x: 419, y: 177 },
        { x: 397, y: 224 },
      ],
    },
    {
      shot: { angle: 40, speed: 600 },
      alternateShots: [{ angle: 41, speed: 540 }],
      balls: [
        { x: 717, y: 592 },
        { x: 766, y: 558 },
        { x: 818, y: 529 },
      ],
    },
  ],
  scoringWallIds: ["right", "bottom"],
  spareSkewers: 2,
} satisfies StageRecipe;
