import type { StageRecipe } from "./types";

export const twinArcs = {
    id: "twin-arcs",
    name: "六、二筋の放物線",
    objective: "低い軌道と高い軌道を使い分け、九個を三本で回収する。",
    chapter: 2,
    groups: [
      {
        shot: { angle: 42, speed: 760 },
        balls: [
          { x: 910, y: 458 },
          { x: 1023, y: 416 },
          { x: 1136, y: 398 },
        ],
      },
      {
        shot: { angle: 62, speed: 690 },
        balls: [
          { x: 798, y: 404 },
          { x: 863, y: 342 },
          { x: 927, y: 304 },
        ],
      },
      {
        shot: { angle: 118, speed: 700 },
        balls: [
          { x: 480, y: 401 },
          { x: 415, y: 336 },
          { x: 349, y: 297 },
        ],
      },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 2,
    obstacles: [{ id: "center-post", x: 620, y: 330, width: 40, height: 150 }],
  } satisfies StageRecipe;
