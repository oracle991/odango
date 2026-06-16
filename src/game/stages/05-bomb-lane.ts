import type { StageRecipe } from "./types";

export const bombLane = {
    id: "bomb-lane",
    name: "五、火種の向こう",
    objective: "爆弾の上側を通し、完成後も安全な右壁まで運ぶ。",
    chapter: 1,
    shots: [{ angle: 48, speed: 690 }],
    scoringWallIds: ["right"],
    spareSkewers: 3,
    bombs: [{ id: "bomb-1", x: 930, y: 530, radius: 30 }],
  } satisfies StageRecipe;
