import { createStage } from "./stages/buildStage";
import { stageRecipes } from "./stages";

export type { RepresentativeShot, StageRecipe } from "./stages/types";

export const validationStages = stageRecipes.map(createStage);
export const representativeStageShotRoutes = stageRecipes.map((recipe) => {
  const defaultRoute = recipe.groups.map((group) => group.shot);
  const alternateRouteCount = Math.max(
    0,
    ...recipe.groups.map((group) =>
      "alternateShots" in group ? (group.alternateShots?.length ?? 0) : 0,
    ),
  );
  const alternateRoutes = Array.from({ length: alternateRouteCount }, (_value, index) =>
    recipe.groups.map((group) =>
      "alternateShots" in group ? (group.alternateShots?.[index] ?? group.shot) : group.shot,
    ),
  );
  return [defaultRoute, ...alternateRoutes];
});
export const representativeStageShots = stageRecipes.map((recipe) =>
  recipe.groups.map((group) => group.shot),
);
export const coreRulesStage = validationStages[0];
