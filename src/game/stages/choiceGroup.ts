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
}

export function choiceGroup({
  shot,
  alternateShot,
  center,
  moving,
  spread = 18,
}: ChoiceGroupOptions): StageBallGroup {
  return {
    shot,
    alternateShots: [alternateShot],
    balls: [
      { x: Math.round(center.x - spread), y: Math.round(center.y + 8) },
      { x: Math.round(center.x), y: Math.round(center.y - 10) },
      { x: Math.round(center.x + spread), y: Math.round(center.y + 8) },
    ],
    moving,
  };
}
