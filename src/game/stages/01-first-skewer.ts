import type { StageRecipe } from "./types";

export const firstSkewer = {
  id: "first-skewer",
  name: "一、はじめの一串",
  objective: "中くらいのチャージで素直な放物線を描き、三個刺して右壁で焼き上げる。",
  chapter: 1,
  groups: [
    {
      shot: { angle: 55, speed: 700 },
      balls: [
        { x: 930, y: 361 },
        { x: 990, y: 340 },
        { x: 1054, y: 333 },
      ],
    },
  ],
  scoringWallIds: ["right"],
  spareSkewers: 3,
} satisfies StageRecipe;
