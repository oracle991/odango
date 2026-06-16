import type { StageRecipe } from "./types";

export const bombGates = {
    id: "bomb-gates",
    name: "八、火門三つ",
    objective: "爆弾の間を抜ける角度を選び、左右の壁へ三連刺しを届ける。",
    chapter: 2,
    shots: [
      { angle: 52, speed: 720 },
      { angle: 128, speed: 720 },
      { angle: 82, speed: 600 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 2,
    bombs: [
      { id: "bomb-left", x: 430, y: 500, radius: 28 },
      { id: "bomb-right", x: 850, y: 500, radius: 28 },
    ],
  } satisfies StageRecipe;
