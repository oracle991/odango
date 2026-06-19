import type { StageRecipe } from "./types";

export const splitWalls = {
  id: "split-walls",
  name: "九、二つの着地点",
  objective:
    "右壁筋と床筋の軌道上に三個ずつ並ぶ。手前のまとまりは焼きと月見を選べる。",
  chapter: 2,
  groups: [
    {
      shot: { angle: 60, speed: 720 },
      alternateShots: [{ angle: 64, speed: 650 }],
      balls: [
        { x: 841, y: 373 },
        { x: 884, y: 337 },
        { x: 932, y: 308 },
      ],
    },
    {
      shot: { angle: 100, speed: 720 },
      balls: [
        { x: 421, y: 261 },
        { x: 396, y: 337 },
        { x: 376, y: 415 },
      ],
    },
    {
      shot: { angle: 44, speed: 720 },
      balls: [
        { x: 1031, y: 412 },
        { x: 1095, y: 405 },
        { x: 1159, y: 408 },
      ],
    },
  ],
  scoringWallIds: ["right", "bottom"],
  spareSkewers: 2,
} satisfies StageRecipe;
