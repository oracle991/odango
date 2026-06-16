import type { StageRecipe } from "./types";

export const chapterTwoFinale = {
    id: "chapter-two-finale",
    name: "十、三路の結び",
    objective: "浅撃ち、山なり、爆弾回避を続けて成功させる章末試験。",
    chapter: 2,
    shots: [
      { angle: 36, speed: 850 },
      { angle: 116, speed: 680 },
      { angle: 58, speed: 710 },
      { angle: 142, speed: 800 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 2,
    bombs: [
      { id: "bomb-mid-left", x: 250, y: 210, radius: 26 },
      { id: "bomb-mid-right", x: 1030, y: 210, radius: 26 },
    ],
    obstacles: [{ id: "high-board", x: 605, y: 160, width: 70, height: 70 }],
  } satisfies StageRecipe;
