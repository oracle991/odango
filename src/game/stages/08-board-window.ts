import type { StageRecipe } from "./types";

export const boardWindow = {
  id: "board-window",
  name: "八、二枚板の窓",
  objective: "二枚の板の窓を強チャージで撃ち抜く。低すぎる糸は火種が止める。",
  chapter: 2,
  groups: [
    {
      shot: { angle: 52, speed: 900 },
      balls: [
        { x: 1002, y: 295 },
        { x: 1058, y: 263 },
        { x: 1116, y: 236 },
      ],
    },
    {
      shot: { angle: 96, speed: 660 },
      balls: [
        { x: 551, y: 242 },
        { x: 528, y: 302 },
        { x: 515, y: 365 },
      ],
    },
    {
      shot: { angle: 122, speed: 660 },
      alternateShots: [{ angle: 114, speed: 660 }],
      balls: [
        { x: 299, y: 343 },
        { x: 235, y: 350 },
        { x: 176, y: 374 },
      ],
    },
    {
      shot: { angle: 86, speed: 520 },
      balls: [
        { x: 673, y: 369 },
        { x: 691, y: 425 },
        { x: 698, y: 489 },
      ],
    },
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 2,
  bombs: [{ id: "under-thread", x: 870, y: 560, radius: 22 }],
  obstacles: [
    { id: "window-top", x: 900, y: 60, width: 34, height: 210 },
    { id: "window-bottom", x: 900, y: 400, width: 34, height: 284 },
  ],
} satisfies StageRecipe;
