import type { StageRecipe } from "./types";

export const chapterTwoFinale = {
    id: "chapter-two-finale",
    name: "十、三路の結び",
    objective: "浅撃ち、山なり、爆弾回避を続けて成功させる章末試験。",
    chapter: 2,
    groups: [
      {
        shot: { angle: 36, speed: 850 },
        balls: [
          { x: 961, y: 467 },
          { x: 1099, y: 427 },
          { x: 1236, y: 411 },
        ],
      },
      {
        shot: { angle: 116, speed: 680 },
        balls: [
          { x: 494, y: 402 },
          { x: 435, y: 339 },
          { x: 375, y: 301 },
        ],
      },
      {
        shot: { angle: 58, speed: 710 },
        balls: [
          { x: 822, y: 409 },
          { x: 897, y: 348 },
          { x: 973, y: 312 },
        ],
      },
      {
        shot: { angle: 142, speed: 800 },
        balls: [
          { x: 342, y: 468 },
          { x: 216, y: 429 },
          { x: 90, y: 415 },
        ],
      },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 2,
    bombs: [
      { id: "bomb-mid-left", x: 250, y: 210, radius: 26 },
      { id: "bomb-mid-right", x: 1030, y: 210, radius: 26 },
    ],
    obstacles: [{ id: "high-board", x: 605, y: 160, width: 70, height: 70 }],
  } satisfies StageRecipe;
