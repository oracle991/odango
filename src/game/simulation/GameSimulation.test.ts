import { describe, expect, it } from "vitest";
import type { StageDefinition } from "./types";
import { GameSimulation } from "./GameSimulation";

const createStage = (
  enemies: StageDefinition["enemies"],
  bombs: StageDefinition["bombs"] = [],
  ammo = 3,
): StageDefinition => ({
  id: "test",
  ammo,
  targetScore: 1000,
  enemies,
  bombs,
});

const fireTestProjectile = (simulation: GameSimulation): void => {
  simulation.state.projectile = {
    position: { x: 100, y: 200 },
    velocity: { x: 12000, y: 0 },
    bounces: 0,
    ageSeconds: 0,
    active: true,
  };
};

describe("core game rules", () => {
  it("hits every enemy crossed in one fixed step without slowing the projectile", () => {
    const simulation = new GameSimulation(
      createStage([
        { id: "a", x: 145, y: 200, radius: 10 },
        { id: "b", x: 185, y: 200, radius: 10 },
      ]),
    );
    fireTestProjectile(simulation);

    const result = simulation.update(1 / 120);

    expect(result.enemyHits).toHaveLength(2);
    expect(simulation.state.enemies.every((enemy) => !enemy.alive)).toBe(true);
    expect(simulation.state.projectile?.velocity.x).toBe(12000);
    expect(simulation.state.shotCombo).toBe(2);
    expect(simulation.state.score).toBe(1300);
  });

  it("adds a reflection bonus to kills after the second bounce", () => {
    const simulation = new GameSimulation(
      createStage([{ id: "a", x: 145, y: 200, radius: 10 }]),
    );
    fireTestProjectile(simulation);
    if (simulation.state.projectile) simulation.state.projectile.bounces = 2;

    simulation.update(1 / 120);

    expect(simulation.state.score).toBe(1200);
  });

  it("stops at a bomb and applies both penalties without a negative score", () => {
    const simulation = new GameSimulation(
      createStage(
        [{ id: "enemy", x: 210, y: 200, radius: 10 }],
        [{ id: "bomb", x: 150, y: 200, radius: 10 }],
      ),
    );
    simulation.state.ammo = 2;
    simulation.state.score = 300;
    fireTestProjectile(simulation);

    const result = simulation.update(1 / 120);

    expect(result.bombHit).toEqual({ x: 150, y: 200 });
    expect(simulation.state.ammo).toBe(1);
    expect(simulation.state.score).toBe(0);
    expect(simulation.state.enemies[0].alive).toBe(true);
    expect(simulation.state.projectile).toBeNull();
  });

  it("awards one-shot and remaining-ammo bonuses when the final shot ends", () => {
    const simulation = new GameSimulation(
      createStage([{ id: "enemy", x: 145, y: 200, radius: 10 }], [], 4),
    );
    fireTestProjectile(simulation);
    simulation.update(1 / 120);
    expect(simulation.state.status).toBe("playing");
    expect(simulation.state.score).toBe(1100);

    if (simulation.state.projectile) simulation.state.projectile.active = false;
    const result = simulation.update(1 / 120);

    expect(result.statusChanged).toBe(true);
    expect(simulation.state.status).toBe("won");
    expect(simulation.state.score).toBe(2300);
  });

  it("fails after the final available shot ends with enemies remaining", () => {
    const simulation = new GameSimulation(
      createStage([{ id: "enemy", x: 500, y: 500, radius: 10 }], [], 1),
    );
    simulation.beginCharge();
    expect(simulation.releaseCharge()).toBe(true);
    expect(simulation.state.ammo).toBe(0);
    if (simulation.state.projectile) simulation.state.projectile.active = false;

    simulation.update(1 / 120);

    expect(simulation.state.status).toBe("lost");
  });

  it("restores the complete stage on retry", () => {
    const simulation = new GameSimulation(
      createStage(
        [{ id: "enemy", x: 145, y: 200, radius: 10 }],
        [{ id: "bomb", x: 400, y: 200, radius: 10 }],
        2,
      ),
    );
    simulation.state.score = 900;
    simulation.state.ammo = 0;
    simulation.state.enemies[0].alive = false;
    simulation.state.bombs[0].triggered = true;

    simulation.reset();

    expect(simulation.state.score).toBe(0);
    expect(simulation.state.ammo).toBe(2);
    expect(simulation.state.status).toBe("playing");
    expect(simulation.state.enemies[0].alive).toBe(true);
    expect(simulation.state.bombs[0].triggered).toBe(false);
  });
});
