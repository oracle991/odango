import type { StageRecipe } from "./types";

export const boardGraduation = {
  id: "board-graduation",
  name: "五、板越えの卒業試験",
  objective: "障害板を山なりで越え、一章で覚えた三つの軌道を続けて使う。",
  chapter: 1,
  groups: [
    {
      shot: { angle: 126, speed: 700 },
      balls: [
        { x: 317, y: 356 },
        { x: 255, y: 342 },
        { x: 191, y: 342 },
      ],
    },
    {
      shot: { angle: 74, speed: 560 },
      balls: [
        { x: 837, y: 378 },
        { x: 871, y: 432 },
        { x: 896, y: 491 },
      ],
    },
    {
      shot: { angle: 44, speed: 800 },
      balls: [
        { x: 1005, y: 396 },
        { x: 1066, y: 376 },
        { x: 1129, y: 364 },
      ],
    },
  ],
  scoringWallIds: ["left", "bottom", "right"],
  spareSkewers: 3,
  obstacles: [{ id: "board-1", x: 445, y: 540, width: 40, height: 144 }],
} satisfies StageRecipe;
