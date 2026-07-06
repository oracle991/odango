import type { StageRecipe } from "./types";

export const firstSway = {
  id: "first-sway",
  name: "十一、初めての揺れ",
  objective: "縦に揺れるまとまりをタイミングで刺す。止まった三筋は素直に通す。",
  chapter: 3,
  groups: [
    {
      shot: { angle: 50, speed: 720, waitSeconds: 0.9 },
      balls: [
        { x: 937, y: 334, motion: { axis: "y", amplitude: 60, periodSeconds: 3, phase: 4.939 } },
        { x: 997, y: 311, motion: { axis: "y", amplitude: 60, periodSeconds: 3, phase: 4.677 } },
        { x: 1059, y: 298, motion: { axis: "y", amplitude: 60, periodSeconds: 3, phase: 4.398 } },
      ],
    },
    {
      shot: { angle: 84, speed: 560 },
      balls: [
        { x: 713, y: 349 },
        { x: 729, y: 411 },
        { x: 739, y: 474 },
      ],
    },
    {
      shot: { angle: 122, speed: 660 },
      alternateShots: [{ angle: 114, speed: 660 }],
      balls: [
        { x: 299, y: 343 },
        { x: 235, y: 350 },
        { x: 176, y: 374 },
      ],
    },
    {
      shot: { angle: 44, speed: 640 },
      balls: [
        { x: 989, y: 449 },
        { x: 1053, y: 449 },
        { x: 1116, y: 460 },
      ],
    },
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 1,
} satisfies StageRecipe;
