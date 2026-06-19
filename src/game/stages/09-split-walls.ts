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
      shot: { angle: 60, speed: 720 },
      alternateShot: { angle: 80, speed: 720 },
      center: { x: 884, y: 337 },
    }),
    choiceGroup({
      shot: { angle: 100, speed: 720 },
      alternateShot: { angle: 120, speed: 720 },
      center: { x: 396, y: 337 },
    }),
    choiceGroup({
      shot: { angle: 44, speed: 720 },
      alternateShot: { angle: 68, speed: 680 },
      center: { x: 1095, y: 405 },
    }),
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 2,
} satisfies StageRecipe;
