import type { StageRecipe } from "./types";

export const gentleMoon = {
  id: "gentle-moon",
  name: "二、ふわり月見",
  objective: "弱いチャージで頂点をまたぎ、床へ落として月見だんごに仕上げる。",
  chapter: 1,
  groups: [
    {
      shot: { angle: 78, speed: 520 },
      balls: [
        { x: 763, y: 387 },
        { x: 792, y: 440 },
        { x: 811, y: 497 },
      ],
    },
  ],
  scoringWallIds: ["bottom"],
  spareSkewers: 3,
} satisfies StageRecipe;
