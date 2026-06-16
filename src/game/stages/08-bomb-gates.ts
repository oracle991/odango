import type { StageRecipe } from "./types";

export const bombGates = {
    id: "bomb-gates",
    name: "八、火門三つ",
    objective: "爆弾の間を抜ける角度を選び、左右の壁へ三連刺しを届ける。",
    chapter: 2,
    groups: [
      {
        shot: { angle: 52, speed: 720 },
        balls: [
          { x: 854, y: 427 },
          { x: 943, y: 373 },
          { x: 1031, y: 344 },
        ],
      },
      {
        shot: { angle: 128, speed: 720 },
        balls: [
          { x: 426, y: 427 },
          { x: 337, y: 373 },
          { x: 249, y: 344 },
        ],
      },
      {
        shot: { angle: 82, speed: 600 },
        balls: [
          { x: 682, y: 402 },
          { x: 699, y: 342 },
          { x: 715, y: 308 },
        ],
      },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 2,
    bombs: [
      { id: "bomb-left", x: 430, y: 500, radius: 28 },
      { id: "bomb-right", x: 850, y: 500, radius: 28 },
    ],
  } satisfies StageRecipe;
