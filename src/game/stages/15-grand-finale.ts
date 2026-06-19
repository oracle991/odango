import type { StageRecipe } from "./types";

export const grandFinale = {
  id: "grand-finale",
  name: "十五、重力砲台詰め合わせ",
  objective:
    "五筋の軌道上に団子が並ぶ最終試験。右・床・左の別解を組み合わせてお品書きを達成する。",
  chapter: 3,
  groups: [
    {
      shot: { angle: 72, speed: 840 },
      alternateShots: [{ angle: 73, speed: 690 }],
      balls: [
        { x: 707, y: 458 },
        { x: 728, y: 406 },
        { x: 750, y: 354 },
      ],
    },
    {
      shot: { angle: 44, speed: 720 },
      balls: [
        { x: 1031, y: 412 },
        { x: 1095, y: 405 },
        { x: 1159, y: 408 },
      ],
    },
    {
      shot: { angle: 56, speed: 800 },
      alternateShots: [{ angle: 60, speed: 580 }],
      balls: [
        { x: 770, y: 476 },
        { x: 804, y: 436 },
        { x: 840, y: 399 },
      ],
    },
    {
      shot: { angle: 96, speed: 720 },
      balls: [
        { x: 479, y: 415 },
        { x: 472, y: 466 },
        { x: 466, y: 518 },
      ],
    },
    {
      shot: { angle: 112, speed: 680 },
      alternateShots: [{ angle: 117, speed: 650 }],
      balls: [
        { x: 215, y: 362 },
        { x: 186, y: 405 },
        { x: 160, y: 450 },
      ],
    },
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 1,
} satisfies StageRecipe;
