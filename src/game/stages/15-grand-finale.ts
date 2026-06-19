import { choiceGroup } from "./choiceGroup";
import type { StageRecipe } from "./types";

export const grandFinale = {
  id: "grand-finale",
  name: "十五、重力砲台詰め合わせ",
  objective:
    "壁、爆弾、細道、移動団子を組み合わせた最終試験。複数解からお品書き達成を組み立てる。",
  chapter: 3,
  groups: [
    choiceGroup({
      shot: { angle: 72, speed: 840 },
      alternateShot: { angle: 84, speed: 560 },
      center: { x: 728, y: 406 },
      spread: 29.5,
      rotationDegrees: 67,
    }),
    choiceGroup({
      shot: { angle: 44, speed: 720 },
      alternateShot: { angle: 68, speed: 680 },
      center: { x: 1095, y: 405 },
    }),
    choiceGroup({
      shot: { angle: 56, speed: 800 },
      alternateShot: { angle: 84, speed: 720 },
      center: { x: 804, y: 437 },
      spread: 29.5,
      rotationDegrees: 7,
    }),
    choiceGroup({
      shot: { angle: 96, speed: 720 },
      alternateShot: { angle: 128, speed: 720 },
      center: { x: 472, y: 466 },
      spread: 29.5,
    }),
    choiceGroup({
      shot: { angle: 112, speed: 680 },
      alternateShot: { angle: 136, speed: 720 },
      center: { x: 185, y: 405 },
    }),
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 1,
} satisfies StageRecipe;
