import { choiceGroup } from "./choiceGroup";
import type { StageRecipe } from "./types";

export const movingPairs = {
  id: "moving-pairs",
  name: "十二、揺らぎの対",
  objective:
    "左右の動く対をどちらの壁へ仕上げるか選ぶ。安全な全同系ルートと高得点の混合ルートを読む。",
  chapter: 3,
  groups: [
    choiceGroup({
      shot: { angle: 52, speed: 720, waitSeconds: 1 },
      alternateShot: { angle: 84, speed: 640 },
      center: { x: 775, y: 497 },
      moving: true,
      spread: 16,
    }),
    choiceGroup({
      shot: { angle: 96, speed: 640, waitSeconds: 1 },
      alternateShot: { angle: 128, speed: 720 },
      center: { x: 505, y: 497 },
      moving: true,
      spread: 16,
    }),
    choiceGroup({
      shot: { angle: 68, speed: 720 },
      alternateShot: { angle: 72, speed: 640 },
      center: { x: 836, y: 293 },
    }),
    choiceGroup({
      shot: { angle: 108, speed: 640 },
      alternateShot: { angle: 112, speed: 720 },
      center: { x: 444, y: 293 },
    }),
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 1,
} satisfies StageRecipe;
