import type { StageRecipe } from "./types";

export const chapterTwoFinale = {
  id: "chapter-two-finale",
  name: "十、三味の詰め合わせ",
  objective:
    "右・床・左へ伸びる四筋の軌道上に団子が並ぶ。別解で壁を選び、お品書きを揃える。",
  chapter: 2,
  groups: [
    {
      shot: { angle: 44, speed: 720 },
      balls: [
        { x: 1031, y: 412 },
        { x: 1095, y: 405 },
        { x: 1159, y: 408 },
      ],
    },
    {
      shot: { angle: 60, speed: 720 },
      alternateShots: [{ angle: 64, speed: 650 }],
      balls: [
        { x: 841, y: 373 },
        { x: 884, y: 337 },
        { x: 932, y: 308 },
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
  spareSkewers: 2,
} satisfies StageRecipe;
