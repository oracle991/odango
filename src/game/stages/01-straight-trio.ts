import type { StageRecipe } from "./types";

export const straightTrio = {
    id: "straight-trio",
    name: "一、まっすぐ三連",
    objective: "中速の素直な放物線で、三個を順番に刺して右壁へ届ける。",
    chapter: 1,
    groups: [
      {
        shot: { angle: 55, speed: 650 },
        balls: [
          { x: 824, y: 438 },
          { x: 899, y: 391 },
          { x: 973, y: 369 },
        ],
      },
    ],
    scoringWallIds: ["right"],
    spareSkewers: 3,
  } satisfies StageRecipe;
