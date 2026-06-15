import { cannon, simulationConfig } from "./config";
import { muzzlePosition } from "./simulation/physics";
import type {
  BallDefinition,
  BallMotionDefinition,
  ObstacleDefinition,
  StageDefinition,
} from "./simulation/types";

export interface RepresentativeShot {
  angle: number;
  speed: number;
}

interface StageRecipe {
  id: string;
  name: string;
  objective: string;
  chapter: 1 | 2 | 3;
  shots: RepresentativeShot[];
  scoringWallIds: string[];
  spareSkewers: number;
  times?: number[][];
  gravity?: number;
  minLaunchSpeed?: number;
  maxLaunchSpeed?: number;
  bombs?: StageDefinition["bombs"];
  obstacles?: ObstacleDefinition[];
  movingGroups?: number[];
}

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

function createStage(recipe: StageRecipe): StageDefinition {
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

const recipes: StageRecipe[] = [
  {
    id: "straight-trio",
    name: "一、まっすぐ三連",
    objective: "中速の素直な放物線で、三個を順番に刺して右壁へ届ける。",
    chapter: 1,
    shots: [{ angle: 55, speed: 650 }],
    scoringWallIds: ["right"],
    spareSkewers: 3,
  },
  {
    id: "soft-arc",
    name: "二、ふわり山なり",
    objective: "弱いチャージで頂点をまたぎ、三個を床へ届ける。",
    chapter: 1,
    shots: [{ angle: 76, speed: 500 }],
    scoringWallIds: ["bottom"],
    spareSkewers: 3,
    minLaunchSpeed: 400,
    maxLaunchSpeed: 860,
  },
  {
    id: "fast-shallow",
    name: "三、疾風の浅撃ち",
    objective: "強いチャージの浅い軌道で、遠い三個を壁際まで運ぶ。",
    chapter: 1,
    shots: [{ angle: 35, speed: 860 }],
    times: [[0.28, 0.42, 0.56]],
    scoringWallIds: ["right"],
    spareSkewers: 3,
    minLaunchSpeed: 450,
    maxLaunchSpeed: 900,
  },
  {
    id: "over-the-board",
    name: "四、板を越えて",
    objective: "手前の障害壁を山なりに越え、左壁へ三個を届ける。",
    chapter: 1,
    shots: [{ angle: 125, speed: 700 }],
    scoringWallIds: ["left"],
    spareSkewers: 3,
    obstacles: [{ id: "board-1", x: 510, y: 552, width: 42, height: 104 }],
  },
  {
    id: "bomb-lane",
    name: "五、火種の向こう",
    objective: "爆弾の上側を通し、完成後も安全な右壁まで運ぶ。",
    chapter: 1,
    shots: [{ angle: 48, speed: 690 }],
    scoringWallIds: ["right"],
    spareSkewers: 3,
    bombs: [{ id: "bomb-1", x: 930, y: 530, radius: 30 }],
  },
  {
    id: "twin-arcs",
    name: "六、二筋の放物線",
    objective: "低い軌道と高い軌道を使い分け、九個を三本で回収する。",
    chapter: 2,
    shots: [
      { angle: 42, speed: 760 },
      { angle: 62, speed: 690 },
      { angle: 118, speed: 700 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 2,
    obstacles: [{ id: "center-post", x: 620, y: 330, width: 40, height: 150 }],
  },
  {
    id: "low-high-low",
    name: "七、低く高く",
    objective: "左右へ振り分けた三つの軌道で、中央の板を避ける。",
    chapter: 2,
    shots: [
      { angle: 32, speed: 820 },
      { angle: 72, speed: 610 },
      { angle: 145, speed: 820 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 2,
    obstacles: [
      { id: "roof-left", x: 300, y: 205, width: 220, height: 28 },
      { id: "roof-right", x: 760, y: 205, width: 220, height: 28 },
    ],
  },
  {
    id: "bomb-gates",
    name: "八、火門三つ",
    objective: "爆弾の間を抜ける角度を選び、左右の壁へ三連刺しを届ける。",
    chapter: 2,
    shots: [
      { angle: 52, speed: 720 },
      { angle: 128, speed: 720 },
      { angle: 82, speed: 600 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 2,
    bombs: [
      { id: "bomb-left", x: 430, y: 500, radius: 28 },
      { id: "bomb-right", x: 850, y: 500, radius: 28 },
    ],
  },
  {
    id: "split-walls",
    name: "九、二つの着地点",
    objective: "同じ球配置に見えても、完成後の着壁まで読んで左右を選ぶ。",
    chapter: 2,
    shots: [
      { angle: 46, speed: 740 },
      { angle: 134, speed: 740 },
      { angle: 68, speed: 640 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 2,
    obstacles: [{ id: "floor-block", x: 565, y: 300, width: 150, height: 34 }],
  },
  {
    id: "chapter-two-finale",
    name: "十、三路の結び",
    objective: "浅撃ち、山なり、爆弾回避を続けて成功させる章末試験。",
    chapter: 2,
    shots: [
      { angle: 36, speed: 850 },
      { angle: 116, speed: 680 },
      { angle: 58, speed: 710 },
      { angle: 142, speed: 800 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 2,
    bombs: [
      { id: "bomb-mid-left", x: 250, y: 210, radius: 26 },
      { id: "bomb-mid-right", x: 1030, y: 210, radius: 26 },
    ],
    obstacles: [{ id: "high-board", x: 605, y: 160, width: 70, height: 70 }],
  },
  {
    id: "first-motion",
    name: "十一、ゆれる一串",
    objective: "ゆっくり上下する三個を、軌道が重なる瞬間に刺す。",
    chapter: 3,
    shots: [
      { angle: 50, speed: 720 },
      { angle: 120, speed: 700 },
      { angle: 65, speed: 650 },
      { angle: 38, speed: 820 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 1,
    movingGroups: [0],
  },
  {
    id: "moving-pairs",
    name: "十二、ゆらぎの対",
    objective: "横移動と縦移動の周期を見て、二種類のタイミングを使い分ける。",
    chapter: 3,
    shots: [
      { angle: 45, speed: 760 },
      { angle: 135, speed: 760 },
      { angle: 70, speed: 620 },
      { angle: 110, speed: 620 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 1,
    movingGroups: [0, 1],
    obstacles: [{ id: "timing-post", x: 620, y: 300, width: 40, height: 170 }],
  },
  {
    id: "narrow-corridors",
    name: "十三、細道四連",
    objective: "狭い通路ごとに角度とチャージを変え、動く球も回収する。",
    chapter: 3,
    shots: [
      { angle: 34, speed: 840 },
      { angle: 56, speed: 700 },
      { angle: 124, speed: 700 },
      { angle: 146, speed: 840 },
    ],
    scoringWallIds: ["left", "right"],
    spareSkewers: 1,
    movingGroups: [1, 2],
    obstacles: [
      { id: "corridor-left", x: 265, y: 120, width: 34, height: 100 },
      { id: "corridor-right", x: 981, y: 120, width: 34, height: 100 },
    ],
  },
  {
    id: "four-way-clock",
    name: "十四、四方の刻",
    objective: "四方向の着壁と球の揺れを読み、余分な一投なしでつなぐ。",
    chapter: 3,
    shots: [
      { angle: 30, speed: 860 },
      { angle: 78, speed: 580 },
      { angle: 102, speed: 580 },
      { angle: 150, speed: 860 },
    ],
    times: [
      [0.24, 0.38, 0.52],
      [0.38, 0.58, 0.78],
      [0.38, 0.58, 0.78],
      [0.24, 0.38, 0.52],
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 1,
    bombs: [
      { id: "clock-left", x: 210, y: 190, radius: 24 },
      { id: "clock-right", x: 1070, y: 190, radius: 24 },
    ],
  },
  {
    id: "grand-finale",
    name: "十五、重力砲台皆伝",
    objective: "壁、爆弾、細道、移動球を組み合わせた全要素の最終試験。",
    chapter: 3,
    shots: [
      { angle: 40, speed: 810 },
      { angle: 64, speed: 680 },
      { angle: 116, speed: 680 },
      { angle: 140, speed: 810 },
      { angle: 82, speed: 590 },
    ],
    scoringWallIds: ["left", "right", "bottom"],
    spareSkewers: 1,
    movingGroups: [1, 2, 4],
    bombs: [
      { id: "final-left", x: 250, y: 215, radius: 27 },
      { id: "final-right", x: 1030, y: 215, radius: 27 },
      { id: "final-top", x: 120, y: 100, radius: 25 },
    ],
    obstacles: [
      { id: "final-left-board", x: 315, y: 90, width: 35, height: 70 },
      { id: "final-right-board", x: 930, y: 90, width: 35, height: 70 },
    ],
  },
];

export const validationStages = recipes.map(createStage);
export const representativeStageShots = recipes.map((recipe) => recipe.shots);
export const coreRulesStage = validationStages[0];
