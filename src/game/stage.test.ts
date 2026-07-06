import { describe, expect, it } from "vitest";
import { cannon } from "./config";
import { stageGenerationConfig } from "./balance";
import { createSkewer } from "./simulation/physics";
import { GameSimulation } from "./simulation/GameSimulation";
import {
  representativeStageShotRoutes,
  representativeStageShots,
  validationStages,
} from "./stage";
import type { RepresentativeShot } from "./stage";

function playStage(
  stageIndex: number,
  route: readonly RepresentativeShot[] = representativeStageShots[stageIndex],
): {
  simulation: GameSimulation;
  wallIds: string[];
  completedShots: boolean[];
} {
  const simulation = new GameSimulation(validationStages[stageIndex]);
  const wallIds: string[] = [];
  const completedShots: boolean[] = [];

  for (const shot of route) {
    for (let elapsed = 0; elapsed < (shot.waitSeconds ?? 0); elapsed += 1 / 120) {
      simulation.update(1 / 120);
    }
    simulation.state.skewers -= 1;
    simulation.state.skewer = createSkewer(cannon, shot.angle, shot.speed);

    for (
      let step = 0;
      step < 2400 &&
      simulation.state.skewer &&
      simulation.state.status === "playing";
      step += 1
    ) {
      const result = simulation.update(1 / 120);
      if (result.wallHit) wallIds.push(result.wallHit.wallId);
      if (result.shotEnded) completedShots.push(result.completedSkewer);
    }
  }

  return { simulation, wallIds, completedShots };
}

describe("M5 stages", () => {
  it("defines fifteen hand-authored stages in three chapters", () => {
    expect(validationStages).toHaveLength(15);
    expect(validationStages.filter((stage) => stage.chapter === 1)).toHaveLength(5);
    expect(validationStages.filter((stage) => stage.chapter === 2)).toHaveLength(5);
    expect(validationStages.filter((stage) => stage.chapter === 3)).toHaveLength(5);

    for (const stage of validationStages) {
      expect(stage.balls.length).toBeGreaterThan(0);
      expect(stage.balls.length % 3).toBe(0);
      expect(stage.skewers).toBeGreaterThanOrEqual(stage.balls.length / 3);
      expect(stage.name).toBeTruthy();
      expect(stage.objective).toBeTruthy();
      expect(stage.scoringWallIds?.length).toBeGreaterThan(0);
    }
  });

  it("introduces multiple scoring walls and moving balls", () => {
    expect(
      validationStages.some((stage) => (stage.scoringWallIds?.length ?? 0) > 1),
    ).toBe(true);
    expect(
      validationStages.some((stage) => stage.balls.some((ball) => ball.motion)),
    ).toBe(true);
  });

  it("keeps moving balls visibly displaced from their resting positions", () => {
    const movingBalls = validationStages.flatMap((stage) =>
      stage.balls.filter((ball) => ball.motion),
    );

    expect(movingBalls.length).toBeGreaterThan(0);
    for (const ball of movingBalls) {
      expect(ball.motion?.amplitude).toBeGreaterThanOrEqual(ball.radius * 3);
    }
  });

  it("keeps every pair of dango at least the configured distance apart", () => {
    for (const stage of validationStages) {
      for (let firstIndex = 0; firstIndex < stage.balls.length; firstIndex += 1) {
        const first = stage.balls[firstIndex];
        for (
          let secondIndex = firstIndex + 1;
          secondIndex < stage.balls.length;
          secondIndex += 1
        ) {
          const second = stage.balls[secondIndex];
          const distance = Math.hypot(first.x - second.x, first.y - second.y);
          expect(distance, `${stage.name}: ${first.id} and ${second.id}`).toBeGreaterThanOrEqual(
            stageGenerationConfig.minimumBallCenterDistance,
          );
        }
      }
    }
  });

  it("keeps moving dango at least the configured distance apart throughout their cycles", { timeout: 60000 }, () => {
    for (const stage of validationStages.filter((candidate) =>
      candidate.balls.some((ball) => ball.motion),
    )) {
      const simulation = new GameSimulation(stage);
      for (let step = 0; step < 30 * 120; step += 1) {
        simulation.update(1 / 120);
        for (
          let firstIndex = 0;
          firstIndex < simulation.state.balls.length;
          firstIndex += 1
        ) {
          const first = simulation.state.balls[firstIndex];
          for (
            let secondIndex = firstIndex + 1;
            secondIndex < simulation.state.balls.length;
            secondIndex += 1
          ) {
            const second = simulation.state.balls[secondIndex];
            const distance = Math.hypot(
              first.position.x - second.position.x,
              first.position.y - second.position.y,
            );
            expect(
              distance,
              `${stage.name} at ${(step / 120).toFixed(2)}s: ${first.id} and ${second.id}`,
            ).toBeGreaterThanOrEqual(
              stageGenerationConfig.minimumBallCenterDistance - 1e-9,
            );
          }
        }
      }
    }
  });

  it.each(validationStages.map((stage, index) => [stage.name, index] as const))(
    "%s has a reproducible representative clear route",
    (_name, stageIndex) => {
      const { simulation, wallIds, completedShots } = playStage(stageIndex);
      const scoringWalls = validationStages[stageIndex].scoringWallIds ?? [];

      expect(
        {
          status: simulation.state.status,
          availableBalls: simulation.state.balls.filter((ball) => ball.available).length,
          wallIds,
          completedShots,
        },
      ).toEqual({
        status: "won",
        availableBalls: 0,
        completedShots: representativeStageShots[stageIndex].map(() => true),
        wallIds: expect.arrayContaining(
          representativeStageShots[stageIndex].map(() =>
            expect.stringMatching(new RegExp(`^(${scoringWalls.join("|")})$`)),
          ),
        ),
      });
    },
  );

  it.each(validationStages.slice(5).map((stage, index) => [stage.name, index + 5] as const))(
    "%s has multiple reproducible clear routes",
    (_name, stageIndex) => {
      const routes = representativeStageShotRoutes[stageIndex];
      expect(routes.length).toBeGreaterThanOrEqual(2);

      const results = routes.map((route) => playStage(stageIndex, route));
      for (const result of results) {
        expect(result.simulation.state.status).toBe("won");
        expect(result.completedShots).toEqual(
          representativeStageShotRoutes[stageIndex][0].map(() => true),
        );
      }
      expect(new Set(results.map((result) => result.wallIds.join("|"))).size)
        .toBeGreaterThanOrEqual(2);
    },
  );

  it("does not make maximum charge the shared opening solution", () => {
    const maximumChargeOpeningClears = validationStages.filter((stage, index) => {
      const simulation = new GameSimulation(stage);
      const shot = representativeStageShots[index][0];
      simulation.state.skewers -= 1;
      simulation.state.skewer = createSkewer(
        cannon,
        shot.angle,
        simulation.getConfig().maxLaunchSpeed,
      );

      for (let step = 0; step < 2400 && simulation.state.skewer; step += 1) {
        simulation.update(1 / 120);
      }
      return simulation.state.balls.filter((ball) => !ball.available).length >= 3;
    }).length;

    expect(maximumChargeOpeningClears).toBeLessThan(validationStages.length / 2);
    expect(
      new Set(representativeStageShots.flat().map((shot) => shot.speed)).size,
    ).toBeGreaterThan(8);
  });
});
