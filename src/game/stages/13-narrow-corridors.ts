import type { StageRecipe } from "./types";

export const narrowCorridors = {
    id: "narrow-corridors",
    name: "十三、細道四連",
    objective: "狭い通路ごとに角度とチャージを変え、動く球も回収する。",
    chapter: 3,
    groups: [
      {
        shot: { angle: 34, speed: 840 },
        balls: [
          { x: 966, y: 481 },
          { x: 1105, y: 446 },
          { x: 1245, y: 437 },
        ],
      },
      {
        shot: { angle: 56, speed: 700 },
        balls: [
          { x: 830, y: 419 },
          { x: 908, y: 362 },
          { x: 987, y: 331 },
        ],
        moving: true,
      },
      {
        shot: { angle: 124, speed: 700 },
        balls: [
          { x: 450, y: 419 },
          { x: 372, y: 362 },
          { x: 293, y: 331 },
        ],
        moving: true,
      },
      {
        shot: { angle: 146, speed: 840 },
        balls: [
          { x: 314, y: 481 },
          { x: 175, y: 446 },
          { x: 35, y: 437 },
        ],
      },
    ],
    scoringWallIds: ["left", "right"],
    spareSkewers: 1,
    obstacles: [
      { id: "corridor-left", x: 265, y: 120, width: 34, height: 100 },
      { id: "corridor-right", x: 981, y: 120, width: 34, height: 100 },
    ],
  } satisfies StageRecipe;
