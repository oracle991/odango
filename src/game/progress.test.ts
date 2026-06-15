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

  it("records the best score and unlocks only the next stage on clear", () => {
    let progress = createDefaultProgress();
    progress = recordStageResult(progress, "one", 0, 15, 900, false);
    expect(progress.unlockedStageCount).toBe(1);

    progress = recordStageResult(progress, "one", 0, 15, 800, true);
    expect(progress.unlockedStageCount).toBe(2);
    expect(progress.stages.one).toEqual({ bestScore: 900, cleared: true });
  });

  it("recovers from invalid save data and clamps unlocked stages", () => {
    expect(parseProgress("not-json", 15)).toEqual(createDefaultProgress());
    expect(
      parseProgress(JSON.stringify({ unlockedStageCount: 99, stages: {} }), 15)
        .unlockedStageCount,
    ).toBe(15);
  });
});
