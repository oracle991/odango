import type { StageRecipe } from "./types";

export const fireAndBoard = {
  id: "fire-and-board",
  name: "九、火と板の間",
  objective: "左は板を越え、右は二つの火種の間を通す。高さの読みを試す。",
  chapter: 2,
  groups: [
    {
      shot: { angle: 116, speed: 780 },
      balls: [
        { x: 349, y: 239 },
        { x: 292, y: 209 },
        { x: 230, y: 196 },
      ],
    },
    {
      shot: { angle: 92, speed: 700 },
      balls: [
        { x: 607, y: 196 },
        { x: 598, y: 259 },
        { x: 594, y: 323 },
      ],
    },
    {
      shot: { angle: 58, speed: 665 },
      alternateShots: [{ angle: 65, speed: 660 }],
      balls: [
        { x: 985, y: 340 },
        { x: 1049, y: 345 },
        { x: 1108, y: 369 },
      ],
    },
    {
      shot: { angle: 27, speed: 840 },
      balls: [
        { x: 971, y: 527 },
        { x: 1034, y: 516 },
        { x: 1098, y: 509 },
      ],
    },
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 2,
  bombs: [
    { id: "mid-high", x: 760, y: 340, radius: 24 },
    { id: "mid-low", x: 900, y: 460, radius: 24 },
  ],
  obstacles: [{ id: "left-board", x: 430, y: 400, width: 36, height: 284 }],
} satisfies StageRecipe;
