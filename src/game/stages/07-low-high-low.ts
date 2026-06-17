import { choiceGroup } from "./choiceGroup";
import type { StageRecipe } from "./types";

export const lowHighLow = {
  id: "low-high-low",
  name: "七、低く高く選ぶ",
  objective:
    "近いまとまりほど角度差が小さく、遠いまとまりほど壁選択が大きく変わる。お品書きのために混ぜる。",
  chapter: 2,
  groups: [
    choiceGroup({
      shot: { angle: 72, speed: 800 },
      alternateShot: { angle: 80, speed: 760 },
      center: { x: 861, y: 177 },
    }),
    choiceGroup({
      shot: { angle: 100, speed: 760 },
      alternateShot: { angle: 108, speed: 800 },
      center: { x: 419, y: 177 },
    }),
    choiceGroup({
      shot: { angle: 40, speed: 600 },
      alternateShot: { angle: 84, speed: 600 },
      center: { x: 765, y: 558 },
    }),
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 2,
} satisfies StageRecipe;
