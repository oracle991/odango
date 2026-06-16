import type { StageRecipe } from "./types";

export const movingPairs = {
    id: "moving-pairs",
    name: "十二、ゆらぎの対",
    objective: "横移動と縦移動の周期を見て、二種類のタイミングを使い分ける。",
    chapter: 3,
    shots: [
      { angle: 45, speed: 760 },
      { angle: 135, speed: 760 },
      { angle: 70, speed: 620 },
      { angle: 110, speed: 620 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 1,
    movingGroups: [0, 1],
    obstacles: [{ id: "timing-post", x: 620, y: 300, width: 40, height: 170 }],
  } satisfies StageRecipe;
