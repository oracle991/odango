import type { StageRecipe } from "./types";

export const leftAndRight = {
  id: "left-and-right",
  name: "三、左右の焼き分け",
  objective: "左をたれ、右を焼きで仕上げる。左向きの照準を安全に試す。",
  chapter: 1,
  groups: [
    {
      shot: { angle: 118, speed: 680 },
      balls: [
        { x: 296, y: 302 },
        { x: 234, y: 315 },
        { x: 178, y: 346 },
      ],
    },
    {
      shot: { angle: 52, speed: 720 },
      balls: [
        { x: 963, y: 366 },
        { x: 1024, y: 347 },
        { x: 1088, y: 340 },
      ],
    },
  ],
  scoringWallIds: ["left", "right"],
  spareSkewers: 3,
} satisfies StageRecipe;
