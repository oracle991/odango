import type { StageRecipe } from "./types";

export const fourWayClock = {
    id: "four-way-clock",
    name: "十四、四方の刻",
    objective: "四方向の着壁と球の揺れを読み、余分な一投なしでつなぐ。",
    chapter: 3,
    groups: [
      {
        shot: { angle: 30, speed: 860 },
        balls: [
          { x: 883, y: 534 },
          { x: 987, y: 500 },
          { x: 1091, y: 479 },
        ],
      },
      {
        shot: { angle: 78, speed: 580 },
        balls: [
          { x: 701, y: 413 },
          { x: 725, y: 359 },
          { x: 749, y: 330 },
        ],
      },
      {
        shot: { angle: 102, speed: 580 },
        balls: [
          { x: 579, y: 413 },
          { x: 555, y: 359 },
          { x: 531, y: 330 },
        ],
      },
      {
        shot: { angle: 150, speed: 860 },
        balls: [
          { x: 397, y: 534 },
          { x: 293, y: 500 },
          { x: 189, y: 479 },
        ],
      },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 1,
    bombs: [
      { id: "clock-left", x: 210, y: 190, radius: 24 },
      { id: "clock-right", x: 1070, y: 190, radius: 24 },
    ],
  } satisfies StageRecipe;
