import type { StageRecipe } from "./types";

export const narrowCorridors = {
  id: "narrow-corridors",
  name: "十三、細道の分岐",
  objective:
    "細道の脇を抜ける四筋の軌道上に団子が並ぶ。狭さは精度ではなく、どの出口へ料理するかの判断を試す。",
  chapter: 3,
  groups: [
    {
      shot: { angle: 56, speed: 640 },
      alternateShots: [{ angle: 57, speed: 570 }],
      balls: [
        { x: 704, y: 562 },
        { x: 744, y: 512 },
        { x: 788, y: 465 },
      ],
    },
    {
      shot: { angle: 52, speed: 800 },
      balls: [
        { x: 1007, y: 320 },
        { x: 1055, y: 301 },
        { x: 1105, y: 288 },
      ],
    },
    {
      shot: { angle: 96, speed: 560 },
      balls: [
        { x: 543, y: 460 },
        { x: 536, y: 512 },
        { x: 530, y: 563 },
      ],
    },
    {
      shot: { angle: 104, speed: 800 },
      balls: [
        { x: 245, y: 253 },
        { x: 225, y: 301 },
        { x: 207, y: 350 },
      ],
    },
  ],
  scoringWallIds: ["right", "bottom"],
  spareSkewers: 1,
  obstacles: [
    { id: "corridor-left", x: 365, y: 120, width: 30, height: 86 },
    { id: "corridor-right", x: 885, y: 120, width: 30, height: 86 },
  ],
} satisfies StageRecipe;
