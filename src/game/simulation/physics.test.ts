import { describe, expect, it } from "vitest";
import { arena, cannon, simulationConfig } from "../config";
import {
  chargeToSpeed,
  createSkewer,
  predictTrajectory,
  segmentArenaExitIntersection,
  segmentCircleIntersection,
  segmentRectIntersection,
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

    expect(wallHit).toEqual({
      x: arena.right,
      y: expect.any(Number),
      wallId: "right",
    });
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

  it("stops at an internal obstacle before the arena boundary", () => {
    const skewer = createSkewer(cannon, 45, 700);
    skewer.position = { x: 100, y: 200 };
    skewer.velocity = { x: 600, y: 0 };

    const wallHit = stepSkewer(
      skewer,
      1,
      arena,
      { ...simulationConfig, gravity: 0 },
      [
      { id: "board", x: 400, y: 100, width: 40, height: 200 },
      ],
    );

    expect(wallHit?.wallId).toBe("obstacle:board");
    expect(wallHit?.x).toBeCloseTo(400 - simulationConfig.tipRadius);
    expect(skewer.active).toBe(false);
  });

  it("stops when the skewer shaft reaches an obstacle before the tip", () => {
    const skewer = createSkewer(cannon, 0, 700);
    skewer.position = { x: 500, y: 200 };
    skewer.velocity = { x: 100, y: 0 };

    const wallHit = stepSkewer(
      skewer,
      0.1,
      arena,
      { ...simulationConfig, gravity: 0 },
      [{ id: "board", x: 420, y: 180, width: 20, height: 40 }],
    );

    expect(wallHit?.wallId).toBe("obstacle:board");
    expect(skewer.active).toBe(false);
  });

  it("finds the first crossing of an axis-aligned rectangle", () => {
    expect(
      segmentRectIntersection(
        { x: 0, y: 50 },
        { x: 100, y: 50 },
        { left: 40, right: 60, top: 20, bottom: 80 },
      ),
    ).toBeCloseTo(0.4);
  });
});
