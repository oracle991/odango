import type { StageRecipe } from "./types";

export const firstSpark = {
  id: "first-spark",
  name: "六、火種の初見",
  objective: "初めての爆弾。低い直撃は火種に触れる。山なりで上を通す。",
  chapter: 2,
  groups: [
    {
      shot: { angle: 58, speed: 660 },
      alternateShots: [{ angle: 65, speed: 660 }],
      balls: [
        { x: 981, y: 343 },
        { x: 1045, y: 350 },
        { x: 1104, y: 374 },
      ],
    },
    {
      shot: { angle: 104, speed: 560 },
      balls: [
        { x: 486, y: 354 },
        { x: 447, y: 403 },
        { x: 422, y: 462 },
      ],
    },
    {
      shot: { angle: 88, speed: 700 },
      balls: [
        { x: 673, y: 196 },
        { x: 681, y: 257 },
        { x: 686, y: 319 },
      ],
    },
  ],
  scoringWallIds: ["right", "bottom"],
  spareSkewers: 2,
  bombs: [{ id: "spark-1", x: 1100, y: 560, radius: 24 }],
} satisfies StageRecipe;
