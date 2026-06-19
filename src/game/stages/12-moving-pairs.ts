import { choiceGroup } from "./choiceGroup";
import type { StageRecipe } from "./types";

export const movingPairs = {
  id: "moving-pairs",
  name: "十二、揺らぎの対",
  objective:
    "左右の動く対はタイミングで仕上げ、上段の止まった二筋は軌道上の三個を通す。混ぜてお品書きを狙う。",
  chapter: 3,
  groups: [
    choiceGroup({
      shot: { angle: 52, speed: 720, waitSeconds: 1 },
      alternateShot: { angle: 84, speed: 640 },
      center: { x: 775, y: 497 },
      moving: true,
      spread: 29.5,
    }),
    choiceGroup({
      shot: { angle: 96, speed: 640, waitSeconds: 1 },
      alternateShot: { angle: 128, speed: 720 },
      center: { x: 505, y: 497 },
      moving: true,
      spread: 29.5,
    }),
    {
      shot: { angle: 68, speed: 720 },
      alternateShots: [{ angle: 69, speed: 700 }],
      balls: [
        { x: 795, y: 342 },
        { x: 836, y: 293 },
        { x: 886, y: 252 },
      ],
    },
    {
      shot: { angle: 108, speed: 640 },
      alternateShots: [{ angle: 113, speed: 710 }],
      balls: [
        { x: 487, y: 321 },
        { x: 444, y: 293 },
        { x: 394, y: 297 },
      ],
    },
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 1,
} satisfies StageRecipe;
