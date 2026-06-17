import { choiceGroup } from "./choiceGroup";
import type { StageRecipe } from "./types";

export const fourWayClock = {
  id: "four-way-clock",
  name: "十四、四方の刻み",
  objective:
    "上下左右のまとまりを時計回りにも反時計回りにも崩せる。爆弾は急ぎ過ぎた直線だけを止める。",
  chapter: 3,
  groups: [
    choiceGroup({
      shot: { angle: 40, speed: 680 },
      alternateShot: { angle: 68, speed: 680 },
      center: { x: 1126, y: 461 },
    }),
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
      shot: { angle: 112, speed: 680 },
      alternateShot: { angle: 140, speed: 680 },
      center: { x: 154, y: 461 },
    }),
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 1,
  bombs: [
    { id: "clock-left", x: 235, y: 235, radius: 24 },
    { id: "clock-right", x: 1045, y: 235, radius: 24 },
  ],
} satisfies StageRecipe;
