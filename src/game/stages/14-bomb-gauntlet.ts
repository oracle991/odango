import type { StageRecipe } from "./types";

export const bombGauntlet = {
  id: "bomb-gauntlet",
  name: "十四、火門の刻み",
  objective: "中空の火の門をよけ、揺れる列と四筋の軌道を編む。",
  chapter: 3,
  groups: [
    {
      shot: { angle: 48, speed: 740, waitSeconds: 0.8 },
      balls: [
        { x: 940, y: 344, motion: { axis: "y", amplitude: 60, periodSeconds: 3, phase: 5.219 } },
        { x: 999, y: 320, motion: { axis: "y", amplitude: 60, periodSeconds: 3, phase: 4.974 } },
        { x: 1061, y: 305, motion: { axis: "y", amplitude: 60, periodSeconds: 3, phase: 4.712 } },
      ],
    },
    {
      shot: { angle: 80, speed: 620 },
      balls: [
        { x: 771, y: 289 },
        { x: 805, y: 343 },
        { x: 825, y: 403 },
      ],
    },
    {
      shot: { angle: 98, speed: 680 },
      balls: [
        { x: 520, y: 222 },
        { x: 487, y: 275 },
        { x: 469, y: 337 },
      ],
    },
    {
      shot: { angle: 124, speed: 650 },
      alternateShots: [{ angle: 116, speed: 640 }],
      balls: [
        { x: 311, y: 364 },
        { x: 248, y: 366 },
        { x: 187, y: 385 },
      ],
    },
    {
      shot: { angle: 31, speed: 850 },
      balls: [
        { x: 995, y: 493 },
        { x: 1057, y: 480 },
        { x: 1120, y: 470 },
      ],
    },
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 1,
  bombs: [
    { id: "gate-center", x: 640, y: 180, radius: 24 },
    { id: "gate-left", x: 300, y: 220, radius: 24 },
    { id: "gate-right", x: 830, y: 180, radius: 24 },
  ],
} satisfies StageRecipe;
