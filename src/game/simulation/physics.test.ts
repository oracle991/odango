import { describe, expect, it } from "vitest";
import { arena, cannon, simulationConfig } from "../config";
import {
  chargeToSpeed,
  createSkewer,
  predictTrajectory,
  segmentArenaExitIntersection,
  segmentCircleIntersection,
  stepSkewer,
} from "./physics";

describe("skewer physics", () => {
  it("maps minimum and maximum charge to the configured speed range", () => {
    expect(chargeToSpeed(0, simulationConfig)).toBe(simulationConfig.minLaunchSpeed);
    expect(chargeToSpeed(99, simulationConfig)).toBe(simulationConfig.maxLaunchSpeed);
  });

  it("produces the same trajectory for identical angle and charge", () => {
    const first = predictTrajectory(cannon, 58, 720, arena, simulationConfig, 5);
    const second = predictTrajectory(cannon, 58, 720, arena, simulationConfig, 5);
    expect(second).toEqual(first);
  });

  it("stops at the first wall without reflecting", () => {
    const skewer = createSkewer(cannon, 45, 700);
    skewer.position.x = arena.right - 1;
    skewer.velocity.x = 300;
    skewer.velocity.y = 0;

    const wallHit = stepSkewer(skewer, 1 / 60, arena, simulationConfig);

    expect(wallHit).toEqual({ x: arena.right, y: expect.any(Number) });
    expect(skewer.active).toBe(false);
    expect(skewer.velocity.x).toBe(300);
  });

  it("finds the earliest arena boundary crossed by a segment", () => {
    expect(
      segmentArenaExitIntersection(
        { x: 100, y: 100 },
        { x: 1400, y: -100 },
        arena,
      ),
    ).toBeCloseTo((arena.top - 100) / -200);
  });

  it("finds a circle crossed between fixed-step positions", () => {
    expect(
      segmentCircleIntersection(
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 50, y: 0 },
        10,
      ),
    ).toBeCloseTo(0.4);
    expect(
      segmentCircleIntersection(
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 50, y: 30 },
        10,
      ),
    ).toBeNull();
  });
});
