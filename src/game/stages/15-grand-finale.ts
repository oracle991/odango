import type { StageRecipe } from "./types";

export const grandFinale = {
    id: "grand-finale",
    name: "十五、重力砲台皆伝",
    objective: "壁、爆弾、細道、移動球を組み合わせた全要素の最終試験。",
    chapter: 3,
    shots: [
      { angle: 40, speed: 810 },
      { angle: 64, speed: 680 },
      { angle: 116, speed: 680 },
      { angle: 140, speed: 810 },
      { angle: 82, speed: 590 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 1,
    movingGroups: [1, 2, 4],
    bombs: [
      { id: "final-left", x: 250, y: 215, radius: 27 },
      { id: "final-right", x: 1030, y: 215, radius: 27 },
      { id: "final-top", x: 120, y: 100, radius: 25 },
    ],
    obstacles: [
      { id: "final-left-board", x: 315, y: 90, width: 35, height: 70 },
      { id: "final-right-board", x: 930, y: 90, width: 35, height: 70 },
    ],
  } satisfies StageRecipe;
