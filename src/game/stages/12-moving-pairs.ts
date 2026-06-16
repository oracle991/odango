import type { StageRecipe } from "./types";

export const movingPairs = {
    id: "moving-pairs",
    name: "十二、ゆらぎの対",
    objective: "横移動と縦移動の周期を見て、二種類のタイミングを使い分ける。",
    chapter: 3,
    groups: [
      {
        shot: { angle: 45, speed: 760 },
        balls: [
          { x: 897, y: 444 },
          { x: 1004, y: 396 },
          { x: 1111, y: 373 },
        ],
        moving: true,
      },
      {
        shot: { angle: 135, speed: 760 },
        balls: [
          { x: 383, y: 444 },
          { x: 276, y: 396 },
          { x: 169, y: 373 },
        ],
        moving: true,
      },
      {
        shot: { angle: 70, speed: 620 },
        balls: [
          { x: 746, y: 410 },
          { x: 788, y: 353 },
          { x: 831, y: 321 },
        ],
      },
      {
        shot: { angle: 110, speed: 620 },
        balls: [
          { x: 534, y: 410 },
          { x: 492, y: 353 },
          { x: 449, y: 321 },
        ],
      },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 1,
    obstacles: [{ id: "timing-post", x: 620, y: 300, width: 40, height: 170 }],
  } satisfies StageRecipe;
