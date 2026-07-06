import type { StageRecipe } from "./types";

export const grandFinale = {
  id: "grand-finale",
  name: "十五、大団円",
  objective: "揺れ、板、火種、三つの壁。全部を一皿に盛る最終試験。",
  chapter: 3,
  groups: [
    {
      shot: { angle: 118, speed: 720, waitSeconds: 0.9 },
      balls: [
        { x: 361, y: 235, motion: { axis: "y", amplitude: 60, periodSeconds: 3, phase: 4.59 } },
        { x: 301, y: 212, motion: { axis: "y", amplitude: 60, periodSeconds: 3, phase: 4.241 } },
        { x: 237, y: 209, motion: { axis: "y", amplitude: 60, periodSeconds: 3, phase: 3.857 } },
      ],
    },
    {
      shot: { angle: 84, speed: 760, waitSeconds: 0.7 },
      balls: [
        { x: 742, y: 287, motion: { axis: "x", amplitude: 60, periodSeconds: 3.4, phase: 4.558 } },
        { x: 752, y: 350, motion: { axis: "x", amplitude: 60, periodSeconds: 3.4, phase: 4.297 } },
        { x: 761, y: 414, motion: { axis: "x", amplitude: 60, periodSeconds: 3.4, phase: 4.066 } },
      ],
    },
    {
      shot: { angle: 56, speed: 720 },
      balls: [
        { x: 956, y: 334 },
        { x: 1017, y: 315 },
        { x: 1080, y: 310 },
      ],
    },
    {
      shot: { angle: 36, speed: 840 },
      balls: [
        { x: 988, y: 460 },
        { x: 1050, y: 442 },
        { x: 1112, y: 429 },
      ],
    },
    {
      shot: { angle: 92, speed: 560 },
      balls: [
        { x: 615, y: 352 },
        { x: 610, y: 415 },
        { x: 606, y: 479 },
      ],
    },
    {
      shot: { angle: 134, speed: 620 },
      alternateShots: [{ angle: 125, speed: 580 }],
      balls: [
        { x: 318, y: 447 },
        { x: 255, y: 445 },
        { x: 192, y: 457 },
      ],
    },
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 1,
  obstacles: [{ id: "final-board", x: 300, y: 520, width: 36, height: 164 }],
  bombs: [
    { id: "final-right", x: 950, y: 560, radius: 24 },
    { id: "final-high", x: 520, y: 180, radius: 24 },
  ],
} satisfies StageRecipe;
