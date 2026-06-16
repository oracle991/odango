import type { StageRecipe } from "./types";

export const lowHighLow = {
    id: "low-high-low",
    name: "七、低く高く",
    objective: "左右へ振り分けた三つの軌道で、中央の板を避ける。",
    chapter: 2,
    shots: [
      { angle: 32, speed: 820 },
      { angle: 72, speed: 610 },
      { angle: 145, speed: 820 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 2,
    obstacles: [
      { id: "roof-left", x: 300, y: 205, width: 220, height: 28 },
      { id: "roof-right", x: 760, y: 205, width: 220, height: 28 },
    ],
  } satisfies StageRecipe;
