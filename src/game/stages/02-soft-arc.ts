import type { StageRecipe } from "./types";

export const softArc = {
    id: "soft-arc",
    name: "二、ふわり山なり",
    objective: "弱いチャージで頂点をまたぎ、三個を床へ届ける。",
    chapter: 1,
    shots: [{ angle: 76, speed: 500 }],
    scoringWallIds: ["bottom"],
    spareSkewers: 3,
    minLaunchSpeed: 400,
    maxLaunchSpeed: 860,
  } satisfies StageRecipe;
