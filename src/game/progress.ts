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

export function createDefaultProgress(): ProgressData {
  return {
    version: 1,
    unlockedStageCount: 1,
    stages: {},
  };
}

export function parseProgress(
  value: string | null,
  stageCount: number,
): ProgressData {
  if (!value) return createDefaultProgress();

  try {
    const parsed = JSON.parse(value) as Partial<ProgressData>;
    const stages =
      parsed.stages && typeof parsed.stages === "object" ? parsed.stages : {};
    return {
      version: 1,
      unlockedStageCount: Math.min(
        stageCount,
        Math.max(1, Number(parsed.unlockedStageCount) || 1),
      ),
      stages,
    };
  } catch {
    return createDefaultProgress();
  }
}

export function calculateRank(
  score: number,
  targetScore: number,
  won: boolean,
): StageRank {
  if (!won) return "C";
  const ratio = targetScore > 0 ? score / targetScore : 0;
  if (ratio >= 1.2) return "S";
  if (ratio >= 1) return "A";
  return "B";
}

export function recordStageResult(
  progress: ProgressData,
  stageId: string,
  stageIndex: number,
  stageCount: number,
  score: number,
  won: boolean,
): ProgressData {
  const previous = progress.stages[stageId] ?? {
    bestScore: 0,
    cleared: false,
  };
  const unlockedStageCount = won
    ? Math.max(progress.unlockedStageCount, Math.min(stageCount, stageIndex + 2))
    : progress.unlockedStageCount;

  return {
    version: 1,
    unlockedStageCount,
    stages: {
      ...progress.stages,
      [stageId]: {
        bestScore: Math.max(previous.bestScore, score),
        cleared: previous.cleared || won,
      },
    },
  };
}
