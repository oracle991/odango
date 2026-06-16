import type { StageRecipe } from "./types";

export const fastShallow = {
    id: "fast-shallow",
    name: "三、疾風の浅撃ち",
    objective: "強いチャージの浅い軌道で、遠い三個を壁際まで運ぶ。",
    chapter: 1,
    shots: [{ angle: 35, speed: 860 }],
    times: [[0.28, 0.42, 0.56]],
    scoringWallIds: ["right"],
    spareSkewers: 3,
    minLaunchSpeed: 450,
    maxLaunchSpeed: 900,
  } satisfies StageRecipe;
