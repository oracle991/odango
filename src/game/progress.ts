import { rankConfig } from "./balance";

export type StageRank = "S" | "A" | "B" | "C";

export interface SavedStageProgress {
  bestScore: number;
  cleared: boolean;
}

export interface ProgressData {
  version: 1;
  unlockedStageCount: number;
  stages: Record<string, SavedStageProgress>;
}

export function createDefaultProgress(stageCount = 1): ProgressData {
  return {
    version: 1,
    unlockedStageCount: Math.max(1, stageCount),
    stages: {},
  };
}

export function parseProgress(
  value: string | null,
  stageCount: number,
): ProgressData {
  if (!value) return createDefaultProgress(stageCount);

  try {
    const parsed = JSON.parse(value) as Partial<ProgressData>;
    const stages =
      parsed.stages && typeof parsed.stages === "object" ? parsed.stages : {};
    return {
      version: 1,
      unlockedStageCount: Math.max(1, stageCount),
      stages,
    };
  } catch {
    return createDefaultProgress(stageCount);
  }
}

export function calculateRank(
  score: number,
  targetScore: number,
  won: boolean,
): StageRank {
  if (!won) return "C";
  const ratio = targetScore > 0 ? score / targetScore : 0;
  if (ratio >= rankConfig.sThresholdRatio) return "S";
  if (ratio >= rankConfig.aThresholdRatio) return "A";
  return "B";
}

export function recordStageResult(
  progress: ProgressData,
  stageId: string,
  _stageIndex: number,
  stageCount: number,
  score: number,
  won: boolean,
): ProgressData {
  const previous = progress.stages[stageId] ?? {
    bestScore: 0,
    cleared: false,
  };
  return {
    version: 1,
    unlockedStageCount: Math.max(1, stageCount),
    stages: {
      ...progress.stages,
      [stageId]: {
        bestScore: Math.max(previous.bestScore, score),
        cleared: previous.cleared || won,
      },
    },
  };
}
