import type { StageRecipe } from "./types";

export const splitWalls = {
    id: "split-walls",
    name: "九、二つの着地点",
    objective: "同じ球配置に見えても、完成後の着壁まで読んで左右を選ぶ。",
    chapter: 2,
    groups: [
      {
        shot: { angle: 46, speed: 740 },
        balls: [
          { x: 887, y: 445 },
          { x: 990, y: 398 },
          { x: 1092, y: 376 },
        ],
      },
      {
        shot: { angle: 134, speed: 740 },
        balls: [
          { x: 393, y: 445 },
          { x: 290, y: 398 },
          { x: 188, y: 376 },
        ],
      },
      {
        shot: { angle: 68, speed: 640 },
        balls: [
          { x: 759, y: 407 },
          { x: 807, y: 348 },
          { x: 855, y: 313 },
        ],
      },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 2,
    obstacles: [{ id: "floor-block", x: 565, y: 300, width: 150, height: 34 }],
  } satisfies StageRecipe;
