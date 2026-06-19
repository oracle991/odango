import {
  defaultDangoRecipes,
  scoreConfig,
  stageGenerationConfig,
} from "../balance";
import type {
  BallDefinition,
  BallMotionDefinition,
  DangoMenu,
  DangoRecipe,
  StageDefinition,
} from "../simulation/types";
import type { StageRecipe } from "./types";

function motionFor(groupIndex: number): BallMotionDefinition {
  return {
    axis: groupIndex % 2 === 0 ? "y" : "x",
    amplitude:
      stageGenerationConfig.motionBaseAmplitude +
      (groupIndex % 2) * stageGenerationConfig.motionAlternateAmplitudeBonus,
    periodSeconds:
      stageGenerationConfig.motionBasePeriodSeconds +
      groupIndex * stageGenerationConfig.motionPeriodStepSeconds,
    phase: groupIndex * stageGenerationConfig.motionPhaseStep,
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
          (group.moving ? motionFor(groupIndex) : undefined),
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

function dexBonusForCount(count: number): number {
  const bonuses = scoreConfig.dangoDexDiscoveryBonuses;
  return bonuses[Math.min(count - 1, bonuses.length - 1)] ?? 0;
}

function resolveDangoRecipes(recipe: StageRecipe): readonly DangoRecipe[] {
  return recipe.dangoRecipes ?? defaultDangoRecipes;
}

function defaultDangoMenu(recipe: StageRecipe): DangoMenu | undefined {
  const recipes = resolveDangoRecipes(recipe);
  const itemIds = recipe.scoringWallIds
    .map((wallId) => recipes.find((dango) => dango.wallId === wallId)?.id)
    .filter((id): id is string => Boolean(id))
    .filter((id, index, ids) => ids.indexOf(id) === index)
    .slice(0, 3);
  if (itemIds.length === 0) return undefined;
  return {
    id: `${recipe.id}-menu`,
    itemIds,
    points: scoreConfig.dangoMenuBonus,
    label: "お品書き",
  };
}

function resolveDangoMenu(recipe: StageRecipe): DangoMenu | undefined {
  return recipe.dangoMenu ?? defaultDangoMenu(recipe);
}

function bestDangoBonus(recipe: StageRecipe): number {
  const recipes = resolveDangoRecipes(recipe);
  const scorableIds = recipe.scoringWallIds
    .map((wallId) => recipes.find((dango) => dango.wallId === wallId)?.id)
    .filter((id): id is string => Boolean(id))
    .filter((id, index, ids) => ids.indexOf(id) === index);
  const discoveryCount = Math.min(recipe.groups.length, scorableIds.length);
  const dexBonus = Array.from({ length: discoveryCount }, (_value, index) =>
    dexBonusForCount(index + 1),
  ).reduce((sum, points) => sum + points, 0);

  const menu = resolveDangoMenu(recipe);
  const menuBonus =
    menu &&
    menu.itemIds.length <= recipe.groups.length &&
    menu.itemIds.every((id) => scorableIds.includes(id))
      ? menu.points
      : 0;
  return dexBonus + menuBonus;
}

function targetScore(recipe: StageRecipe): number {
  const bestScore =
    recipe.groups.length * (scoreConfig.completedSkewer + bestOrderBonus(recipe)) +
    bestDangoBonus(recipe) +
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
    dangoRecipes: resolveDangoRecipes(recipe),
    dangoMenu: resolveDangoMenu(recipe),
    balls: createBalls(recipe),
    bombs: recipe.bombs ?? [],
    obstacles: recipe.obstacles,
    simulation: Object.keys(simulation).length > 0 ? simulation : undefined,
  };
}
