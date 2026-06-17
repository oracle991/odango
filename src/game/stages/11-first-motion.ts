import { choiceGroup } from "./choiceGroup";
import type { StageRecipe } from "./types";

export const firstMotion = {
  id: "first-motion",
  name: "十一、揺れる選択肢",
  objective:
    "動くまとまりにも二つの正解筋を残す。タイミングで焼きにするか月見にするかを選ぶ。",
  chapter: 3,
  groups: [
    choiceGroup({
      shot: { angle: 56, speed: 800 },
      alternateShot: { angle: 84, speed: 720 },
      center: { x: 804, y: 437 },
      moving: true,
      spread: 16,
    }),
    choiceGroup({
      shot: { angle: 96, speed: 720 },
      alternateShot: { angle: 128, speed: 720 },
      center: { x: 472, y: 466 },
    }),
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
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 1,
} satisfies StageRecipe;
