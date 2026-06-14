import { describe, expect, it } from "vitest";
import { arena, cannon, simulationConfig } from "../config";
import {
  chargeToSpeed,
  createProjectile,
  predictTrajectory,
  segmentCircleIntersection,
  stepProjectile,
} from "./physics";

describe("cannon physics", () => {
  it("maps minimum and maximum charge to the configured speed range", () => {
    expect(chargeToSpeed(0, simulationConfig)).toBe(simulationConfig.minLaunchSpeed);
    expect(chargeToSpeed(99, simulationConfig)).toBe(simulationConfig.maxLaunchSpeed);
  });

  it("produces the same trajectory for identical angle and charge", () => {
    const first = predictTrajectory(cannon, 58, 720, arena, simulationConfig, 5);
    const second = predictTrajectory(cannon, 58, 720, arena, simulationConfig, 5);
    expect(second).toEqual(first);
  });

  it("reflects from the right wall while preserving most speed", () => {
    const projectile = createProjectile(cannon, 45, 700);
    projectile.position.x = arena.right - simulationConfig.radius - 1;
    projectile.velocity.x = 300;
    projectile.velocity.y = 0;

    const bounced = stepProjectile(projectile, 1 / 60, arena, simulationConfig);
    expect(bounced).toBe(true);
    expect(projectile.velocity.x).toBeLessThan(0);
    expect(Math.abs(projectile.velocity.x)).toBeCloseTo(300 * simulationConfig.restitution);
    expect(projectile.bounces).toBe(1);
  });

  it("allows six bounces and ends on the following surface contact", () => {
    const projectile = createProjectile(cannon, 45, 700);
    projectile.bounces = simulationConfig.maxBounces - 1;
    projectile.position.y = arena.bottom - simulationConfig.radius - 1;
    projectile.velocity.y = 300;

    stepProjectile(projectile, 1 / 60, arena, simulationConfig);
    expect(projectile.active).toBe(true);
    expect(projectile.bounces).toBe(simulationConfig.maxBounces);

    projectile.position.y = arena.bottom - simulationConfig.radius - 1;
    projectile.velocity.y = 300;
    stepProjectile(projectile, 1 / 60, arena, simulationConfig);
    expect(projectile.active).toBe(false);
    expect(projectile.bounces).toBe(simulationConfig.maxBounces);
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
