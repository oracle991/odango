import type { StageRecipe } from "./types";

export const fourWayClock = {
  id: "four-way-clock",
  name: "十四、四方の刻み",
  objective:
    "四方へ伸びる軌道上に団子が並ぶ。別解で壁を選び、爆弾は急ぎ過ぎた直線だけを止める。",
  chapter: 3,
  groups: [
    {
      shot: { angle: 40, speed: 680 },
      balls: [
        { x: 1059, y: 456 },
        { x: 1126, y: 461 },
        { x: 1193, y: 476 },
      ],
    },
    {
      shot: { angle: 72, speed: 800 },
      alternateShots: [{ angle: 75, speed: 750 }],
      balls: [
        { x: 828, y: 218 },
        { x: 861, y: 177 },
        { x: 900, y: 144 },
      ],
    },
    {
      shot: { angle: 100, speed: 760 },
      balls: [
        { x: 453, y: 139 },
        { x: 419, y: 177 },
        { x: 397, y: 224 },
      ],
    },
    {
      shot: { angle: 112, speed: 680 },
      alternateShots: [{ angle: 119, speed: 630 }],
      balls: [
        { x: 179, y: 416 },
        { x: 154, y: 462 },
        { x: 131, y: 508 },
      ],
    },
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 1,
  bombs: [
    { id: "clock-left", x: 235, y: 235, radius: 24 },
    { id: "clock-right", x: 1045, y: 235, radius: 24 },
  ],
} satisfies StageRecipe;
