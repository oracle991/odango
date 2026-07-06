import type { StageRecipe } from "./types";

export const chimneyDrop = {
  id: "chimney-drop",
  name: "十三、煙突くぐり",
  objective: "真上の煙突へ串を通し、落ちて月見になる。左右の火種は欲張りを止める。",
  chapter: 3,
  groups: [
    {
      shot: { angle: 90, speed: 755 },
      balls: [
        { x: 640, y: 285 },
        { x: 640, y: 225 },
        { x: 640, y: 165 },
      ],
    },
    {
      shot: { angle: 62, speed: 700 },
      balls: [
        { x: 968, y: 288 },
        { x: 1031, y: 288 },
        { x: 1092, y: 309 },
      ],
    },
    {
      shot: { angle: 96, speed: 560 },
      balls: [
        { x: 567, y: 349 },
        { x: 551, y: 411 },
        { x: 541, y: 474 },
      ],
    },
    {
      shot: { angle: 124, speed: 650 },
      alternateShots: [{ angle: 117, speed: 640 }],
      balls: [
        { x: 297, y: 363 },
        { x: 234, y: 369 },
        { x: 174, y: 391 },
      ],
    },
    {
      shot: { angle: 38, speed: 850 },
      balls: [
        { x: 986, y: 444 },
        { x: 1046, y: 424 },
        { x: 1108, y: 408 },
      ],
    },
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 1,
  bombs: [
    { id: "lip-left", x: 520, y: 280, radius: 24 },
    { id: "lip-right", x: 770, y: 280, radius: 24 },
  ],
  obstacles: [
    { id: "chimney-left", x: 560, y: 60, width: 34, height: 180 },
    { id: "chimney-right", x: 700, y: 60, width: 34, height: 180 },
  ],
} satisfies StageRecipe;
