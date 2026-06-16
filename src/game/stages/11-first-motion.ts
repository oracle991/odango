import type { StageRecipe } from "./types";

export const firstMotion = {
    id: "first-motion",
    name: "十一、ゆれる一串",
    objective: "ゆっくり上下する三個を、軌道が重なる瞬間に刺す。",
    chapter: 3,
    shots: [
      { angle: 50, speed: 720 },
      { angle: 120, speed: 700 },
      { angle: 65, speed: 650 },
      { angle: 38, speed: 820 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 1,
    movingGroups: [0],
  } satisfies StageRecipe;
