import type { StageRecipe } from "./types";

export const strongAndSoft = {
  id: "strong-and-soft",
  name: "四、強弓と小弓",
  objective: "最大近くの強チャージと最弱近くの小弓、チャージ幅の両端を使い分ける。",
  chapter: 1,
  groups: [
    {
      shot: { angle: 33, speed: 880 },
      balls: [
        { x: 992, y: 476 },
        { x: 1054, y: 459 },
        { x: 1117, y: 446 },
      ],
    },
    {
      shot: { angle: 99, speed: 470 },
      balls: [
        { x: 556, y: 430 },
        { x: 538, y: 485 },
        { x: 526, y: 542 },
      ],
    },
  ],
  scoringWallIds: ["right", "bottom"],
  spareSkewers: 3,
} satisfies StageRecipe;
