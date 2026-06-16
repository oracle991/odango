import type { StageRecipe } from "./types";

export const fastShallow = {
    id: "fast-shallow",
    name: "三、疾風の浅撃ち",
    objective: "強いチャージの浅い軌道で、遠い三個を壁際まで運ぶ。",
    chapter: 1,
    groups: [
      {
        shot: { angle: 35, speed: 860 },
        balls: [
          { x: 898, y: 500 },
          { x: 996, y: 461 },
          { x: 1095, y: 435 },
        ],
      },
    ],
    scoringWallIds: ["right"],
    spareSkewers: 3,
    minLaunchSpeed: 450,
    maxLaunchSpeed: 900,
  } satisfies StageRecipe;
