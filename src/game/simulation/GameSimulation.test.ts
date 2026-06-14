import { describe, expect, it } from "vitest";
import { arena } from "../config";
import type { StageDefinition } from "./types";
import { GameSimulation } from "./GameSimulation";

const createStage = (
  balls: StageDefinition["balls"],
  bombs: StageDefinition["bombs"] = [],
  skewers = 3,
): StageDefinition => ({
  id: "test",
  skewers,
  targetScore: 1000,
  balls,
  bombs,
});

const ball = (
  id: string,
  x: number,
  y = 200,
): StageDefinition["balls"][number] => ({
  id,
  x,
  y,
  radius: 2,
  color: "white",
});

const fireTestSkewer = (
  simulation: GameSimulation,
  x = arena.right - 92,
): void => {
  simulation.state.skewer = {
    position: { x, y: 200 },
    velocity: { x: 12000, y: 0 },
    ageSeconds: 0,
    active: true,
    attachedBallIds: [],
  };
};

describe("three-ball core rules", () => {
  it("aims at a position and keeps that angle as time passes", () => {
    const simulation = new GameSimulation(
      createStage([ball("a", 400), ball("b", 500), ball("c", 600)]),
    );

    simulation.setAimPosition(900, 300);
    const angle = simulation.getCurrentAngle();
    simulation.update(2);

    expect(angle).toBeCloseTo(53.86, 1);
    expect(simulation.getCurrentAngle()).toBe(angle);
    expect(simulation.state.aimPosition).toEqual({ x: 900, y: 300 });
  });

  it("clamps aim to the cannon angle limits", () => {
    const simulation = new GameSimulation(
      createStage([ball("a", 400), ball("b", 500), ball("c", 600)]),
    );

    simulation.setAimPosition(arena.right, arena.bottom);
    expect(simulation.getCurrentAngle()).toBe(25);

    simulation.setAimPosition(arena.left, arena.bottom);
    expect(simulation.getCurrentAngle()).toBe(155);
  });

  it("launches at the latest aim angle and restores the default aim on retry", () => {
    const simulation = new GameSimulation(
      createStage([ball("a", 400), ball("b", 500), ball("c", 600)]),
    );
    simulation.setAimPosition(900, 300);
    const launchAngle = simulation.getCurrentAngle();
    simulation.beginCharge();

    expect(simulation.releaseCharge()).toBe(true);
    expect(simulation.state.cannonAngle).toBe(launchAngle);
    expect(simulation.state.skewer?.velocity.x).toBeGreaterThan(0);

    simulation.reset();
    expect(simulation.getCurrentAngle()).toBe(90);
    expect(simulation.state.aimPosition).toEqual({ x: 640, y: arena.top });
  });

  it("collects balls in contact order and never attaches more than three", () => {
    const simulation = new GameSimulation(
      createStage([
        ball("a", arena.right - 72),
        ball("b", arena.right - 50),
        ball("c", arena.right - 28),
        ball("d", arena.right - 12),
      ]),
    );
    fireTestSkewer(simulation);

    const result = simulation.update(1 / 120);

    expect(result.ballHits).toHaveLength(3);
    expect(result.completedSkewer).toBe(true);
    expect(simulation.state.balls.map((candidate) => candidate.available)).toEqual([
      false,
      false,
      false,
      true,
    ]);
    expect(simulation.state.score).toBe(600);
  });

  it("awards points only when three balls reach a wall", () => {
    const simulation = new GameSimulation(
      createStage([
        ball("a", arena.right - 72),
        ball("b", arena.right - 50),
        ball("c", arena.right - 28),
        ball("spare", 400, 400),
      ]),
    );
    fireTestSkewer(simulation);

    const result = simulation.update(1 / 120);

    expect(result.wallHit).not.toBeNull();
    expect(result.completedSkewer).toBe(true);
    expect(simulation.state.score).toBe(600);
    expect(simulation.state.status).toBe("playing");
  });

  it("restores one or two collected balls when the skewer ends incomplete", () => {
    const simulation = new GameSimulation(
      createStage([
        ball("a", arena.right - 72),
        ball("b", arena.right - 50),
        ball("c", 400, 400),
      ]),
    );
    fireTestSkewer(simulation);

    const result = simulation.update(1 / 120);

    expect(result.completedSkewer).toBe(false);
    expect(result.restoredBalls).toBe(true);
    expect(simulation.state.balls.every((candidate) => candidate.available)).toBe(true);
    expect(simulation.state.score).toBe(0);
  });

  it("completes the stage and adds final and remaining-skewer bonuses", () => {
    const simulation = new GameSimulation(
      createStage([
        ball("a", arena.right - 72),
        ball("b", arena.right - 50),
        ball("c", arena.right - 28),
      ], [], 2),
    );
    simulation.state.skewers = 1;
    fireTestSkewer(simulation);

    const result = simulation.update(1 / 120);

    expect(result.statusChanged).toBe(true);
    expect(simulation.state.status).toBe("won");
    expect(simulation.state.score).toBe(1900);
  });

  it("stops at a bomb, restores balls, and applies both penalties", () => {
    const simulation = new GameSimulation(
      createStage(
        [ball("a", arena.right - 72), ball("b", 400, 400), ball("c", 500, 400)],
        [{ id: "bomb", x: arena.right - 50, y: 200, radius: 2 }],
      ),
    );
    simulation.state.skewers = 2;
    simulation.state.score = 300;
    fireTestSkewer(simulation);

    const result = simulation.update(1 / 120);

    expect(result.bombHit).toEqual({ x: arena.right - 50, y: 200 });
    expect(result.restoredBalls).toBe(true);
    expect(simulation.state.skewers).toBe(1);
    expect(simulation.state.score).toBe(0);
    expect(simulation.state.balls[0].available).toBe(true);
  });

  it("triggers a bomb touched by the skewer shaft", () => {
    const simulation = new GameSimulation(
      createStage(
        [ball("a", 400, 400), ball("b", 500, 400), ball("c", 600, 400)],
        [{ id: "bomb", x: arena.right - 105, y: 200, radius: 3 }],
      ),
    );
    fireTestSkewer(simulation);

    const result = simulation.update(1 / 120);

    expect(result.bombHit).toEqual({ x: arena.right - 105, y: 200 });
    expect(simulation.state.bombs[0].triggered).toBe(true);
  });

  it("fails after the final available skewer ends with balls remaining", () => {
    const simulation = new GameSimulation(
      createStage([ball("a", 400, 400), ball("b", 500, 400), ball("c", 600, 400)], [], 1),
    );
    simulation.beginCharge();
    expect(simulation.releaseCharge()).toBe(true);
    expect(simulation.state.skewers).toBe(0);
    if (simulation.state.skewer) simulation.state.skewer.active = false;

    simulation.update(1 / 120);

    expect(simulation.state.status).toBe("lost");
  });

  it("restores the complete stage on retry", () => {
    const simulation = new GameSimulation(
      createStage(
        [ball("a", 400), ball("b", 500), ball("c", 600)],
        [{ id: "bomb", x: 700, y: 200, radius: 10 }],
        2,
      ),
    );
    simulation.state.score = 900;
    simulation.state.skewers = 0;
    simulation.state.balls[0].available = false;
    simulation.state.bombs[0].triggered = true;

    simulation.reset();

    expect(simulation.state.score).toBe(0);
    expect(simulation.state.skewers).toBe(2);
    expect(simulation.state.status).toBe("playing");
    expect(simulation.state.balls.every((candidate) => candidate.available)).toBe(true);
    expect(simulation.state.bombs[0].triggered).toBe(false);
  });
});
