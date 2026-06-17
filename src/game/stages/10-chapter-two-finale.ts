import { choiceGroup } from "./choiceGroup";
import type { StageRecipe } from "./types";

export const chapterTwoFinale = {
  id: "chapter-two-finale",
  name: "十、三味の詰め合わせ",
  objective:
    "四つのまとまりすべてに別解がある。安全クリアとお品書き達成でショットの組み合わせを変える。",
  chapter: 2,
  groups: [
    choiceGroup({
      shot: { angle: 44, speed: 720 },
      alternateShot: { angle: 68, speed: 680 },
      center: { x: 1095, y: 405 },
    }),
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
      shot: { angle: 112, speed: 680 },
      alternateShot: { angle: 136, speed: 720 },
      center: { x: 185, y: 405 },
    }),
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 2,
} satisfies StageRecipe;
