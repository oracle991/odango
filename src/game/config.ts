import type { Arena, CannonConfig, SimulationConfig } from "./simulation/types";

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
  swingPeriodSeconds: 4,
  barrelLength: 74,
};

export const simulationConfig: SimulationConfig = {
  gravity: 620,
  radius: 17,
  restitution: 0.98,
  minChargeSeconds: 0.15,
  maxChargeSeconds: 1.5,
  minLaunchSpeed: 430,
  maxLaunchSpeed: 900,
  maxBounces: 6,
  maxFlightSeconds: 10,
  fixedStepSeconds: 1 / 120,
};
