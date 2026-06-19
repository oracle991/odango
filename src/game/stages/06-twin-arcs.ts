import type { StageRecipe } from "./types";

export const twinArcs = {
  id: "twin-arcs",
  name: "六、二筋の放物線",
  objective:
    "同じ三個を低い焼き筋と高い月見筋のどちらでも取れる。壁を選んで団子の種類を変える。",
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
  obstacles: [{ id: "center-post", x: 620, y: 355, width: 40, height: 130 }],
} satisfies StageRecipe;
