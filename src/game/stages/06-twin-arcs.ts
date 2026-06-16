import type { StageRecipe } from "./types";

export const twinArcs = {
    id: "twin-arcs",
    name: "六、二筋の放物線",
    objective: "低い軌道と高い軌道を使い分け、九個を三本で回収する。",
    chapter: 2,
    shots: [
      { angle: 42, speed: 760 },
      { angle: 62, speed: 690 },
      { angle: 118, speed: 700 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 2,
    obstacles: [{ id: "center-post", x: 620, y: 330, width: 40, height: 150 }],
  } satisfies StageRecipe;
