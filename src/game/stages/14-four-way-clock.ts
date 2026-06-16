import type { StageRecipe } from "./types";

export const fourWayClock = {
    id: "four-way-clock",
    name: "十四、四方の刻",
    objective: "四方向の着壁と球の揺れを読み、余分な一投なしでつなぐ。",
    chapter: 3,
    shots: [
      { angle: 30, speed: 860 },
      { angle: 78, speed: 580 },
      { angle: 102, speed: 580 },
      { angle: 150, speed: 860 },
    ],
    times: [
      [0.24, 0.38, 0.52],
      [0.38, 0.58, 0.78],
      [0.38, 0.58, 0.78],
      [0.24, 0.38, 0.52],
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 1,
    bombs: [
      { id: "clock-left", x: 210, y: 190, radius: 24 },
      { id: "clock-right", x: 1070, y: 190, radius: 24 },
    ],
  } satisfies StageRecipe;
