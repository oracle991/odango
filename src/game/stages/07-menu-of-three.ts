import type { StageRecipe } from "./types";

export const menuOfThree = {
  id: "menu-of-three",
  name: "七、お品書き三品",
  objective: "たれ・焼き・月見。三つの壁で三品を作り、お品書きを埋める。",
  chapter: 2,
  groups: [
    {
      shot: { angle: 116, speed: 700 },
      balls: [
        { x: 299, y: 273 },
        { x: 237, y: 285 },
        { x: 182, y: 317 },
      ],
    },
    {
      shot: { angle: 59, speed: 655 },
      alternateShots: [{ angle: 65, speed: 660 }],
      balls: [
        { x: 996, y: 341 },
        { x: 1058, y: 356 },
        { x: 1113, y: 388 },
      ],
    },
    {
      shot: { angle: 88, speed: 540 },
      balls: [
        { x: 664, y: 371 },
        { x: 669, y: 435 },
        { x: 672, y: 499 },
      ],
    },
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 2,
  bombs: [{ id: "hearth-1", x: 350, y: 560, radius: 24 }],
} satisfies StageRecipe;
