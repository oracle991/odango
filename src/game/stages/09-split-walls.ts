import { choiceGroup } from "./choiceGroup";
import type { StageRecipe } from "./types";

export const splitWalls = {
  id: "split-walls",
  name: "九、三つの着地点",
  objective:
    "同じ配置から右壁・左壁・床のどれを作るかを読む。図鑑を埋めるなら混合ルートが必要。",
  chapter: 2,
  groups: [
    choiceGroup({
      shot: { angle: 68, speed: 840 },
      alternateShot: { angle: 72, speed: 640 },
      center: { x: 801, y: 313 },
    }),
    choiceGroup({
      shot: { angle: 60, speed: 800 },
      alternateShot: { angle: 76, speed: 600 },
      center: { x: 847, y: 355 },
    }),
    choiceGroup({
      shot: { angle: 104, speed: 600 },
      alternateShot: { angle: 120, speed: 800 },
      center: { x: 433, y: 355 },
    }),
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 2,
} satisfies StageRecipe;
