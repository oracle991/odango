import type { StageRecipe } from "./types";

export const grandFinale = {
    id: "grand-finale",
    name: "十五、重力砲台皆伝",
    objective: "壁、爆弾、細道、移動球を組み合わせた全要素の最終試験。",
    chapter: 3,
    groups: [
      {
        shot: { angle: 40, speed: 810 },
        balls: [
          { x: 932, y: 455 },
          { x: 1057, y: 411 },
          { x: 1181, y: 391 },
        ],
      },
      {
        shot: { angle: 64, speed: 680 },
        balls: [
          { x: 786, y: 402 },
          { x: 845, y: 339 },
          { x: 905, y: 301 },
        ],
        moving: true,
      },
      {
        shot: { angle: 116, speed: 680 },
        balls: [
          { x: 494, y: 402 },
          { x: 435, y: 339 },
          { x: 375, y: 301 },
        ],
        moving: true,
      },
      {
        shot: { angle: 140, speed: 810 },
        balls: [
          { x: 348, y: 455 },
          { x: 223, y: 411 },
          { x: 99, y: 391 },
        ],
      },
      {
        shot: { angle: 82, speed: 590 },
        balls: [
          { x: 682, y: 405 },
          { x: 698, y: 348 },
          { x: 714, y: 316 },
        ],
        moving: true,
      },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 1,
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
