import type { StageRecipe } from "./types";

export const firstMotion = {
    id: "first-motion",
    name: "十一、ゆれる一串",
    objective: "ゆっくり上下する三個を、軌道が重なる瞬間に刺す。",
    chapter: 3,
    groups: [
      {
        shot: { angle: 50, speed: 720 },
        balls: [
          { x: 863, y: 434 },
          { x: 956, y: 384 },
          { x: 1049, y: 358 },
        ],
        moving: true,
      },
      {
        shot: { angle: 120, speed: 700 },
        balls: [
          { x: 470, y: 406 },
          { x: 400, y: 345 },
          { x: 330, y: 308 },
        ],
      },
      {
        shot: { angle: 65, speed: 650 },
        balls: [
          { x: 776, y: 410 },
          { x: 831, y: 352 },
          { x: 886, y: 318 },
        ],
      },
      {
        shot: { angle: 38, speed: 820 },
        balls: [
          { x: 944, y: 463 },
          { x: 1073, y: 422 },
          { x: 1202, y: 405 },
        ],
      },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 1,
  } satisfies StageRecipe;
