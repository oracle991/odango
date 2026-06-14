import { describe, expect, it } from "vitest";
import { cannon } from "./config";
import { createSkewer } from "./simulation/physics";
import { GameSimulation } from "./simulation/GameSimulation";
import { validationStages } from "./stage";

const representativeShots = [
  { angle: 55, speed: 650, wallId: "right" },
  { angle: 76, speed: 500, wallId: "bottom" },
  { angle: 35, speed: 860, wallId: "right" },
  { angle: 125, speed: 700, wallId: "left" },
  { angle: 48, speed: 690, wallId: "right" },
] as const;

function playShot(
  stageIndex: number,
  speed: number = representativeShots[stageIndex].speed,
): { simulation: GameSimulation; wallId: string | null } {
  const simulation = new GameSimulation(validationStages[stageIndex]);
  const shot = representativeShots[stageIndex];
  let wallId: string | null = null;
  simulation.state.skewers -= 1;
  simulation.state.skewer = createSkewer(cannon, shot.angle, speed);

  for (let step = 0; step < 2400 && simulation.state.status === "playing"; step += 1) {
    const result = simulation.update(1 / 120);
    if (result.wallHit) wallId = result.wallHit.wallId;
  }
  return { simulation, wallId };
}

describe("M3 validation stages", () => {
  it("defines five hand-authored stages with valid target groups", () => {
    expect(validationStages).toHaveLength(5);
    for (const stage of validationStages) {
      expect(stage.balls.length).toBeGreaterThan(0);
      expect(stage.balls.length % 3).toBe(0);
      expect(stage.skewers).toBeGreaterThanOrEqual(stage.balls.length / 3);
      expect(stage.name).toBeTruthy();
      expect(stage.objective).toBeTruthy();
    }
  });

  it.each(validationStages.map((stage, index) => [stage.name, index] as const))(
    "%s has a reproducible representative clear route",
    (_name, stageIndex) => {
      const { simulation, wallId } = playShot(stageIndex);

      expect(simulation.state.status).toBe("won");
      expect(simulation.state.balls.every((ball) => !ball.available)).toBe(true);
      expect(simulation.state.score).toBeGreaterThanOrEqual(600);
      expect(wallId).toBe(representativeShots[stageIndex].wallId);
    },
  );

  it("does not make maximum charge the shared solution", () => {
    const maximumChargeClears = validationStages.filter((_stage, index) => {
      const simulation = new GameSimulation(validationStages[index]);
      return playShot(index, simulation.getConfig().maxLaunchSpeed).simulation.state.status === "won";
    }).length;

    expect(maximumChargeClears).toBeLessThan(validationStages.length);
    expect(new Set(representativeShots.map((shot) => shot.speed)).size).toBeGreaterThan(3);
  });
});
