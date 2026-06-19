import { choiceGroup } from "./choiceGroup";
import type { StageRecipe } from "./types";

export const narrowCorridors = {
  id: "narrow-corridors",
  name: "十三、細道の分岐",
  objective:
    "左右の細道は塞がず、どの出口へ料理するかを選ばせる。狭さは精度ではなく判断を試す。",
  chapter: 3,
  groups: [
    choiceGroup({
      shot: { angle: 56, speed: 640 },
      alternateShot: { angle: 84, speed: 560 },
      center: { x: 744, y: 512 },
      spread: 29.5,
    }),
    choiceGroup({
      shot: { angle: 52, speed: 800 },
      alternateShot: { angle: 76, speed: 800 },
      center: { x: 1055, y: 301 },
    }),
    choiceGroup({
      shot: { angle: 96, speed: 560 },
      alternateShot: { angle: 124, speed: 640 },
      center: { x: 536, y: 512 },
      spread: 29.5,
    }),
    choiceGroup({
      shot: { angle: 104, speed: 800 },
      alternateShot: { angle: 128, speed: 800 },
      center: { x: 225, y: 301 },
    }),
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 1,
  obstacles: [
    { id: "corridor-left", x: 365, y: 120, width: 30, height: 86 },
    { id: "corridor-right", x: 885, y: 120, width: 30, height: 86 },
  ],
} satisfies StageRecipe;
