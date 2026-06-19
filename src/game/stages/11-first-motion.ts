import { choiceGroup } from "./choiceGroup";
import type { StageRecipe } from "./types";

export const firstMotion = {
  id: "first-motion",
  name: "十一、揺れる選択肢",
  objective:
    "揺れるまとまりはタイミングで取り、止まったまとまりは軌道上の三個を素直に通す。",
  chapter: 3,
  groups: [
    choiceGroup({
      shot: { angle: 56, speed: 800 },
      alternateShot: { angle: 84, speed: 720 },
      center: { x: 804, y: 437 },
      moving: true,
      spread: 29.5,
    }),
    {
      shot: { angle: 96, speed: 720 },
      balls: [
        { x: 479, y: 415 },
        { x: 472, y: 466 },
        { x: 466, y: 518 },
      ],
    },
    {
      shot: { angle: 60, speed: 720 },
      alternateShots: [{ angle: 64, speed: 650 }],
      balls: [
        { x: 874, y: 345 },
        { x: 917, y: 316 },
        { x: 964, y: 294 },
      ],
    },
    {
      shot: { angle: 100, speed: 720 },
      balls: [
        { x: 421, y: 261 },
        { x: 396, y: 337 },
        { x: 376, y: 415 },
      ],
    },
  ],
  scoringWallIds: ["right", "bottom"],
  spareSkewers: 1,
} satisfies StageRecipe;
