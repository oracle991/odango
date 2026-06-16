import type { StageRecipe } from "./types";

export const narrowCorridors = {
    id: "narrow-corridors",
    name: "十三、細道四連",
    objective: "狭い通路ごとに角度とチャージを変え、動く球も回収する。",
    chapter: 3,
    shots: [
      { angle: 34, speed: 840 },
      { angle: 56, speed: 700 },
      { angle: 124, speed: 700 },
      { angle: 146, speed: 840 },
    ],
    scoringWallIds: ["left", "right"],
    spareSkewers: 1,
    movingGroups: [1, 2],
    obstacles: [
      { id: "corridor-left", x: 265, y: 120, width: 34, height: 100 },
      { id: "corridor-right", x: 981, y: 120, width: 34, height: 100 },
    ],
  } satisfies StageRecipe;
