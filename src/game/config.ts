import type { Arena, CannonConfig } from "./simulation/types";
export { simulationConfig } from "./balance";

export const DESIGN_WIDTH = 1280;
export const DESIGN_HEIGHT = 720;

export const arena: Arena = {
  left: 28,
  right: DESIGN_WIDTH - 28,
  top: 28,
  bottom: DESIGN_HEIGHT - 36,
};

export const cannon: CannonConfig = {
  x: DESIGN_WIDTH / 2,
  y: arena.bottom - 28,
  minAngle: 25,
  maxAngle: 155,
  barrelLength: 74,
};
