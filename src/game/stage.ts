import { createStage } from "./stages/buildStage";
import { stageRecipes } from "./stages";

export type { RepresentativeShot, StageRecipe } from "./stages/types";

export const validationStages = stageRecipes.map(createStage);
export const representativeStageShots = stageRecipes.map((recipe) =>
  recipe.groups.map((group) => group.shot),
);
export const coreRulesStage = validationStages[0];
