import {
  scoreConfig,
  simulationConfig,
  stageGenerationConfig,
} from "../balance";
import { cannon } from "../config";
import { muzzlePosition } from "../simulation/physics";
import type {
  BallDefinition,
  BallMotionDefinition,
  StageDefinition,
} from "../simulation/types";
import type { RepresentativeShot, StageRecipe } from "./types";

function trajectoryPoint(
  shot: RepresentativeShot,
  time: number,
  gravity: number,
): { x: number; y: number } {
  const radians = (shot.angle * Math.PI) / 180;
  const start = muzzlePosition(cannon, shot.angle);
  return {
    x: start.x + Math.cos(radians) * shot.speed * time,
    y:
      start.y -
      Math.sin(radians) * shot.speed * time +
      0.5 * gravity * time * time,
  };
}

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
  const gravity = recipe.gravity ?? simulationConfig.gravity;

  return recipe.shots.flatMap((shot, groupIndex) => {
    const times =
      recipe.times?.[groupIndex] ?? stageGenerationConfig.defaultTrajectoryTimes;
    return times.map((time, ballIndex) => {
      const position = trajectoryPoint(shot, time, gravity);
      return {
        id: `${recipe.id}-${groupIndex + 1}-${ballIndex + 1}`,
        x: Math.round(position.x),
        y: Math.round(position.y),
        radius: stageGenerationConfig.targetBallRadius,
        color: stageGenerationConfig.ballColors[ballIndex],
        motion: recipe.movingGroups?.includes(groupIndex)
          ? motionFor(groupIndex, ballIndex)
          : undefined,
      };
    });
  });
}

function targetScore(groups: number, spareSkewers: number): number {
  const bestScore =
    groups * scoreConfig.completedSkewer +
    scoreConfig.stageClearBonus +
    spareSkewers * scoreConfig.remainingSkewerBonus;
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
    skewers: recipe.shots.length + recipe.spareSkewers,
    targetScore: targetScore(recipe.shots.length, recipe.spareSkewers),
    scoringWallIds: recipe.scoringWallIds,
    balls: createBalls(recipe),
    bombs: recipe.bombs ?? [],
    obstacles: recipe.obstacles,
    simulation: Object.keys(simulation).length > 0 ? simulation : undefined,
  };
}
