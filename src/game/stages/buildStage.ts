import {
  scoreConfig,
  stageGenerationConfig,
} from "../balance";
import type {
  BallDefinition,
  BallMotionDefinition,
  StageDefinition,
} from "../simulation/types";
import type { StageRecipe } from "./types";

function motionFor(groupIndex: number, ballIndex: number): BallMotionDefinition {
  return {
    axis: groupIndex % 2 === 0 ? "y" : "x",
    amplitude:
      stageGenerationConfig.motionBaseAmplitude +
      (ballIndex % 2) * stageGenerationConfig.motionAlternateAmplitudeBonus,
    periodSeconds:
      stageGenerationConfig.motionBasePeriodSeconds +
      groupIndex * stageGenerationConfig.motionPeriodStepSeconds,
    phase: ballIndex * stageGenerationConfig.motionPhaseStep,
  };
}

function createBalls(recipe: StageRecipe): BallDefinition[] {
  return recipe.groups.flatMap((group, groupIndex) =>
    group.balls.map((ball, ballIndex) => {
      return {
        id: `${recipe.id}-${groupIndex + 1}-${ballIndex + 1}`,
        x: ball.x,
        y: ball.y,
        radius: stageGenerationConfig.targetBallRadius,
        color: ball.color ?? stageGenerationConfig.ballColors[ballIndex],
        motion:
          ball.motion ??
          (group.moving ? motionFor(groupIndex, ballIndex) : undefined),
      };
    }),
  );
}

function bestOrderBonus(recipe: StageRecipe): number {
  return Math.max(
    0,
    ...(recipe.completionOrderBonuses ?? stageGenerationConfig.defaultOrderBonuses)
      .map((bonus) => bonus.points),
  );
}

function targetScore(recipe: StageRecipe): number {
  const bestScore =
    recipe.groups.length * (scoreConfig.completedSkewer + bestOrderBonus(recipe)) +
    scoreConfig.stageClearBonus +
    recipe.spareSkewers * scoreConfig.remainingSkewerBonus;
  return (
    Math.floor(bestScore / scoreConfig.targetScoreDivisor) *
    scoreConfig.targetScoreStep
  );
}

export function createStage(recipe: StageRecipe): StageDefinition {
  const simulation: StageDefinition["simulation"] = {};
  if (recipe.gravity !== undefined) simulation.gravity = recipe.gravity;
  if (recipe.minLaunchSpeed !== undefined) {
    simulation.minLaunchSpeed = recipe.minLaunchSpeed;
  }
  if (recipe.maxLaunchSpeed !== undefined) {
    simulation.maxLaunchSpeed = recipe.maxLaunchSpeed;
  }

  return {
    id: recipe.id,
    name: recipe.name,
    objective: recipe.objective,
    chapter: recipe.chapter,
    skewers: recipe.groups.length + recipe.spareSkewers,
    targetScore: targetScore(recipe),
    scoringWallIds: recipe.scoringWallIds,
    completionOrderBonuses:
      recipe.completionOrderBonuses ?? stageGenerationConfig.defaultOrderBonuses,
    balls: createBalls(recipe),
    bombs: recipe.bombs ?? [],
    obstacles: recipe.obstacles,
    simulation: Object.keys(simulation).length > 0 ? simulation : undefined,
  };
}
