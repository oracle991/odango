import { stageGenerationConfig } from "../balance";
import type { RepresentativeShot, StageBallGroup } from "./types";

interface ChoiceGroupOptions {
  shot: RepresentativeShot;
  alternateShot: RepresentativeShot;
  center: {
    x: number;
    y: number;
  };
  moving?: boolean;
  spread?: number;
  rotationDegrees?: number;
}

export function choiceGroup({
  shot,
  alternateShot,
  center,
  moving,
  spread = stageGenerationConfig.minimumBallCenterDistance / Math.sqrt(3) + 0.5,
  rotationDegrees = 0,
}: ChoiceGroupOptions): StageBallGroup {
  const pointAt = (degrees: number): { x: number; y: number } => {
    const radians = ((degrees + rotationDegrees) * Math.PI) / 180;
    return {
      x: Math.round(center.x + Math.cos(radians) * spread),
      y: Math.round(center.y + Math.sin(radians) * spread),
    };
  };

  return {
    shot,
    alternateShots: [alternateShot],
    balls: [
      pointAt(150),
      pointAt(270),
      pointAt(30),
    ],
    moving,
  };
}
