import type { StageRecipe } from "./types";

export const splitWalls = {
    id: "split-walls",
    name: "九、二つの着地点",
    objective: "同じ球配置に見えても、完成後の着壁まで読んで左右を選ぶ。",
    chapter: 2,
    shots: [
      { angle: 46, speed: 740 },
      { angle: 134, speed: 740 },
      { angle: 68, speed: 640 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 2,
    obstacles: [{ id: "floor-block", x: 565, y: 300, width: 150, height: 34 }],
  } satisfies StageRecipe;
