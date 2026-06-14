import type { StageDefinition } from "./simulation/types";

export const coreRulesStage: StageDefinition = {
  id: "core-rules",
  skewers: 6,
  targetScore: 2500,
  balls: [
    { id: "ball-left-1", x: 467, y: 447, radius: 20, color: "white" },
    { id: "ball-left-2", x: 355, y: 380, radius: 20, color: "pink" },
    { id: "ball-left-3", x: 244, y: 389, radius: 20, color: "green" },
    { id: "ball-right-1", x: 813, y: 447, radius: 20, color: "white" },
    { id: "ball-right-2", x: 925, y: 380, radius: 20, color: "pink" },
    { id: "ball-right-3", x: 1036, y: 389, radius: 20, color: "green" },
  ],
  bombs: [{ id: "bomb-1", x: 640, y: 390, radius: 28 }],
};
