import type { StageRecipe } from "./types";

export const swayDuet = {
  id: "sway-duet",
  name: "十二、揺れの二重奏",
  objective: "縦揺れと横揺れ、二つの動くまとまりを読み切ってから静かな二筋を仕上げる。",
  chapter: 3,
  groups: [
    {
      shot: { angle: 114, speed: 760, waitSeconds: 0.8 },
      balls: [
        { x: 372, y: 180, motion: { axis: "y", amplitude: 60, periodSeconds: 3, phase: 4.712 } },
        { x: 315, y: 151, motion: { axis: "y", amplitude: 60, periodSeconds: 3, phase: 4.363 } },
        { x: 252, y: 143, motion: { axis: "y", amplitude: 60, periodSeconds: 3, phase: 3.944 } },
      ],
    },
    {
      shot: { angle: 86, speed: 780, waitSeconds: 0.7 },
      balls: [
        { x: 694, y: 271, motion: { axis: "x", amplitude: 60, periodSeconds: 3.4, phase: 4.297 } },
        { x: 701, y: 335, motion: { axis: "x", amplitude: 60, periodSeconds: 3.4, phase: 4.05 } },
        { x: 707, y: 398, motion: { axis: "x", amplitude: 60, periodSeconds: 3.4, phase: 3.835 } },
      ],
    },
    {
      shot: { angle: 60, speed: 650 },
      alternateShots: [{ angle: 63, speed: 640 }],
      balls: [
        { x: 1005, y: 342 },
        { x: 1065, y: 365 },
        { x: 1117, y: 402 },
      ],
    },
    {
      shot: { angle: 108, speed: 560 },
      balls: [
        { x: 424, y: 380 },
        { x: 386, y: 431 },
        { x: 357, y: 489 },
      ],
    },
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 1,
  bombs: [
    { id: "duet-high", x: 930, y: 260, radius: 24 },
    { id: "duet-low", x: 250, y: 520, radius: 24 },
  ],
} satisfies StageRecipe;
