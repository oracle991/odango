import type {
  CompletionOrderBonus,
  DangoRecipe,
  SimulationConfig,
} from "./simulation/types";

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
  defaultCompletionOrderBonus: 300,
  bombPenalty: 500,
  bombPenaltySkewers: 1,
  stageClearBonus: 1000,
  remainingSkewerBonus: 300,
  dangoDexDiscoveryBonuses: [0, 200, 500, 800],
  dangoMenuBonus: 700,
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
  defaultOrderBonuses: [
    {
      order: ["white", "pink", "green"],
      points: scoreConfig.defaultCompletionOrderBonus,
      label: "白・桜・よもぎ",
    },
  ] satisfies readonly CompletionOrderBonus[],
  motionBaseAmplitude: 60,
  motionAlternateAmplitudeBonus: 12,
  motionBasePeriodSeconds: 2.4,
  motionPeriodStepSeconds: 0.35,
  motionPhaseStep: 0.7,
} as const;

export const defaultDangoRecipes = [
  {
    id: "yaki-dango",
    name: "焼きだんご",
    method: "焼き",
    wallId: "right",
  },
  {
    id: "mitarashi-dango",
    name: "みたらしだんご",
    method: "たれ",
    wallId: "left",
  },
  {
    id: "tsukimi-dango",
    name: "月見だんご",
    method: "盛り付け",
    wallId: "bottom",
  },
  {
    id: "sasa-dango",
    name: "笹だんご",
    method: "蒸し",
    wallId: "top",
  },
] satisfies readonly DangoRecipe[];

export const defaultScoringWallIds = [
  "left",
  "right",
  "top",
  "bottom",
] as const;
