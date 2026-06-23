import { describe, expect, it } from "vitest";
import {
  calculateRank,
  createDefaultProgress,
  parseProgress,
  recordStageResult,
} from "./progress";

describe("stage progress", () => {
  it("calculates S/A/B/C ranks from clear state and target score", () => {
    expect(calculateRank(1200, 1000, true)).toBe("S");
    expect(calculateRank(1000, 1000, true)).toBe("A");
    expect(calculateRank(999, 1000, true)).toBe("B");
    expect(calculateRank(9999, 1000, false)).toBe("C");
  });

  it("records the best score while keeping every stage unlocked", () => {
    let progress = createDefaultProgress(15);
    progress = recordStageResult(progress, "one", 0, 15, 900, false);
    expect(progress.unlockedStageCount).toBe(15);

    progress = recordStageResult(progress, "one", 0, 15, 800, true);
    expect(progress.unlockedStageCount).toBe(15);
    expect(progress.stages.one).toEqual({ bestScore: 900, cleared: true });
  });

  it("recovers from invalid save data and unlocks every stage", () => {
    expect(parseProgress("not-json", 15)).toEqual(createDefaultProgress(15));
    expect(
      parseProgress(JSON.stringify({ unlockedStageCount: 1, stages: {} }), 15)
        .unlockedStageCount,
    ).toBe(15);
  });
});
