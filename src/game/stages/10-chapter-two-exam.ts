import type { StageRecipe } from "./types";

export const chapterTwoExam = {
  id: "chapter-two-exam",
  name: "十、二章の大試験",
  objective: "五筋の軌道と二つの火種。壁を選んでお品書きを揃える二章の試験。",
  chapter: 2,
  groups: [
    {
      shot: { angle: 120, speed: 700 },
      balls: [
        { x: 318, y: 306 },
        { x: 255, y: 298 },
        { x: 192, y: 310 },
      ],
    },
    {
      shot: { angle: 94, speed: 560 },
      balls: [
        { x: 598, y: 334 },
        { x: 582, y: 395 },
        { x: 575, y: 459 },
      ],
    },
    {
      shot: { angle: 86, speed: 760 },
      balls: [
        { x: 709, y: 122 },
        { x: 732, y: 178 },
        { x: 743, y: 242 },
      ],
    },
    {
      shot: { angle: 58, speed: 655 },
      alternateShots: [{ angle: 65, speed: 660 }],
      balls: [
        { x: 992, y: 347 },
        { x: 1055, y: 358 },
        { x: 1112, y: 386 },
      ],
    },
    {
      shot: { angle: 28, speed: 800 },
      balls: [
        { x: 998, y: 520 },
        { x: 1062, y: 512 },
        { x: 1126, y: 509 },
      ],
    },
  ],
  scoringWallIds: ["left", "right", "bottom"],
  spareSkewers: 2,
  bombs: [
    { id: "exam-left", x: 480, y: 300, radius: 24 },
    { id: "exam-right", x: 950, y: 610, radius: 24 },
  ],
} satisfies StageRecipe;
