import type { SimulationConfig } from "./simulation/types";

export const simulationConfig: SimulationConfig = {
  gravity: 620,
  tipRadius: 7,
  skewerLength: 88,
  ballSpacing: 30,
  attachedBallOffset: 24,
  attachedBallRadius: 18,
  maxBallsPerSkewer: 3,
  minChargeSeconds: 0.15,
  maxChargeSeconds: 1.5,
  minLaunchSpeed: 430,
  maxLaunchSpeed: 900,
  maxFlightSeconds: 10,
  fixedStepSeconds: 1 / 120,
};

export const scoreConfig = {
  completedSkewer: 600,
  bombPenalty: 500,
  bombPenaltySkewers: 1,
  stageClearBonus: 1000,
  remainingSkewerBonus: 300,
  targetScoreDivisor: 12,
  targetScoreStep: 10,
} as const;

export const rankConfig = {
  sThresholdRatio: 1.2,
  aThresholdRatio: 1,
} as const;

export const stageGenerationConfig = {
  targetBallRadius: 20,
  ballColors: ["white", "pink", "green"],
  defaultTrajectoryTimes: [0.38, 0.58, 0.78],
  motionBaseAmplitude: 6,
  motionAlternateAmplitudeBonus: 3,
  motionBasePeriodSeconds: 2.4,
  motionPeriodStepSeconds: 0.35,
  motionPhaseStep: 0.7,
} as const;

export const defaultScoringWallIds = [
  "left",
  "right",
  "top",
  "bottom",
] as const;
