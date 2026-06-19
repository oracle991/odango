import type { StageRecipe } from "./types";

export const bombGates = {
  id: "bomb-gates",
  name: "八、火門三つ",
  objective:
    "爆弾を避ける三筋の軌道上に団子が並ぶ。焼きで仕上げるか、一段沈めて月見にするかを選ぶ。",
  chapter: 2,
  groups: [
    {
      shot: { angle: 56, speed: 600 },
      balls: [
        { x: 882, y: 409 },
        { x: 933, y: 398 },
        { x: 985, y: 401 },
      ],
    },
    {
      shot: { angle: 100, speed: 760 },
      balls: [
        { x: 361, y: 340 },
        { x: 347, y: 398 },
        { x: 334, y: 457 },
      ],
    },
    {
      shot: { angle: 60, speed: 800 },
      alternateShots: [{ angle: 63, speed: 640 }],
      balls: [
        { x: 784, y: 429 },
        { x: 817, y: 388 },
        { x: 852, y: 350 },
      ],
    },
  ],
  scoringWallIds: ["right", "bottom"],
  spareSkewers: 2,
  bombs: [
    { id: "bomb-low-left", x: 430, y: 535, radius: 26 },
    { id: "bomb-low-right", x: 850, y: 535, radius: 26 },
    { id: "bomb-center", x: 640, y: 455, radius: 22 },
  ],
} satisfies StageRecipe;
