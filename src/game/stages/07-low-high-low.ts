import type { StageRecipe } from "./types";

export const lowHighLow = {
    id: "low-high-low",
    name: "七、低く高く",
    objective: "左右へ振り分けた三つの軌道で、中央の板を避ける。",
    chapter: 2,
    groups: [
      {
        shot: { angle: 32, speed: 820 },
        balls: [
          { x: 967, y: 496 },
          { x: 1106, y: 469 },
          { x: 1245, y: 466 },
        ],
      },
      {
        shot: { angle: 72, speed: 610 },
        balls: [
          { x: 734, y: 410 },
          { x: 772, y: 353 },
          { x: 810, y: 322 },
        ],
      },
      {
        shot: { angle: 145, speed: 820 },
        balls: [
          { x: 324, y: 480 },
          { x: 190, y: 445 },
          { x: 55, y: 435 },
        ],
      },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 2,
    obstacles: [
      { id: "roof-left", x: 300, y: 205, width: 220, height: 28 },
      { id: "roof-right", x: 760, y: 205, width: 220, height: 28 },
    ],
  } satisfies StageRecipe;
