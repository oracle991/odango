import type { StageRecipe } from "./types";

export const overTheBoard = {
    id: "over-the-board",
    name: "四、板を越えて",
    objective: "手前の障害壁を山なりに越え、左壁へ三個を届ける。",
    chapter: 1,
    groups: [
      {
        shot: { angle: 125, speed: 700 },
        balls: [
          { x: 445, y: 422 },
          { x: 365, y: 367 },
          { x: 284, y: 337 },
        ],
      },
    ],
    scoringWallIds: ["left"],
    spareSkewers: 3,
    obstacles: [{ id: "board-1", x: 510, y: 552, width: 42, height: 104 }],
  } satisfies StageRecipe;
