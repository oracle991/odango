import { cannon, simulationConfig } from "../config";
import { muzzlePosition } from "../simulation/physics";
import type {
  BallDefinition,
  BallMotionDefinition,
  StageDefinition,
} from "../simulation/types";
import type { RepresentativeShot, StageRecipe } from "./types";

const colors = ["white", "pink", "green"] as const;

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
    amplitude: 6 + (ballIndex % 2) * 3,
    periodSeconds: 2.4 + groupIndex * 0.35,
    phase: ballIndex * 0.7,
  };
}

function createBalls(recipe: StageRecipe): BallDefinition[] {
  const gravity = recipe.gravity ?? simulationConfig.gravity;
  const defaultTimes = [0.38, 0.58, 0.78];

  return recipe.shots.flatMap((shot, groupIndex) => {
    const times = recipe.times?.[groupIndex] ?? defaultTimes;
    return times.map((time, ballIndex) => {
      const position = trajectoryPoint(shot, time, gravity);
      return {
        id: `${recipe.id}-${groupIndex + 1}-${ballIndex + 1}`,
        x: Math.round(position.x),
        y: Math.round(position.y),
        radius: 20,
        color: colors[ballIndex],
        motion: recipe.movingGroups?.includes(groupIndex)
          ? motionFor(groupIndex, ballIndex)
          : undefined,
      };
    });
  });
}

function targetScore(groups: number, spareSkewers: number): number {
  const bestScore = groups * 600 + 1000 + spareSkewers * 300;
  return Math.floor(bestScore / 12) * 10;
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
