import { choiceGroup } from "./choiceGroup";
import type { StageRecipe } from "./types";

export const twinArcs = {
  id: "twin-arcs",
  name: "六、二筋の放物線",
  objective:
    "同じ三個を低い焼き筋と高い月見筋のどちらでも取れる。壁を選んで団子の種類を変える。",
  chapter: 2,
  groups: [
    choiceGroup({
      shot: { angle: 60, speed: 720 },
      alternateShot: { angle: 80, speed: 720 },
      center: { x: 884, y: 337 },
    }),
    choiceGroup({
      shot: { angle: 100, speed: 720 },
      alternateShot: { angle: 120, speed: 720 },
      center: { x: 396, y: 337 },
    }),
    choiceGroup({
      shot: { angle: 44, speed: 720 },
      alternateShot: { angle: 68, speed: 680 },
      center: { x: 1095, y: 405 },
    }),
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 2,
  obstacles: [{ id: "center-post", x: 620, y: 355, width: 40, height: 130 }],
} satisfies StageRecipe;
