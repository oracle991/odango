import type { StageDefinition } from "./simulation/types";

export const coreRulesStage: StageDefinition = {
  id: "core-rules",
  ammo: 6,
  targetScore: 3000,
  enemies: [
    { id: "enemy-1", x: 308, y: 486, radius: 27 },
    { id: "enemy-2", x: 432, y: 372, radius: 27 },
    { id: "enemy-3", x: 640, y: 210, radius: 27 },
    { id: "enemy-4", x: 848, y: 372, radius: 27 },
    { id: "enemy-5", x: 972, y: 486, radius: 27 },
  ],
  bombs: [
    { id: "bomb-1", x: 640, y: 418, radius: 31 },
  ],
};
