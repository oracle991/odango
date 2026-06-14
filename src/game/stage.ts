import type { StageDefinition } from "./simulation/types";

const trio = (
  prefix: string,
  positions: Array<{ x: number; y: number }>,
): StageDefinition["balls"] =>
  positions.map((position, index) => ({
    id: `${prefix}-${index + 1}`,
    ...position,
    radius: 20,
    color: (["white", "pink", "green"] as const)[index],
  }));

export const validationStages: StageDefinition[] = [
  {
    id: "straight-trio",
    name: "一、まっすぐ三連",
    objective: "中速の素直な放物線で、三個を順番に刺して右壁へ届ける。",
    skewers: 4,
    targetScore: 1900,
    scoringWallIds: ["right"],
    balls: trio("straight", [
      { x: 802, y: 457 },
      { x: 887, y: 396 },
      { x: 973, y: 369 },
    ]),
    bombs: [],
  },
  {
    id: "soft-arc",
    name: "二、ふわり山なり",
    objective: "弱いチャージで頂点をまたぐ、縦にまとまった三個を拾う。",
    skewers: 4,
    targetScore: 1900,
    scoringWallIds: ["bottom"],
    balls: trio("arc", [
      { x: 700, y: 452 },
      { x: 745, y: 396 },
      { x: 789, y: 422 },
    ]),
    bombs: [],
    simulation: {
      minLaunchSpeed: 400,
      maxLaunchSpeed: 860,
    },
  },
  {
    id: "fast-shallow",
    name: "三、疾風の浅撃ち",
    objective: "強いチャージの浅い軌道で、遠い三個を壁際まで一気に運ぶ。",
    skewers: 3,
    targetScore: 1600,
    scoringWallIds: ["right"],
    balls: trio("fast", [
      { x: 870, y: 513 },
      { x: 1025, y: 452 },
      { x: 1180, y: 421 },
    ]),
    bombs: [],
    simulation: {
      minLaunchSpeed: 450,
      maxLaunchSpeed: 900,
    },
  },
  {
    id: "over-the-board",
    name: "四、板を越えて",
    objective: "手前の障害壁を山なりに越え、左壁へ三個を届ける。",
    skewers: 4,
    targetScore: 1900,
    scoringWallIds: ["left"],
    balls: trio("board", [
      { x: 497, y: 471 },
      { x: 397, y: 386 },
      { x: 296, y: 340 },
    ]),
    bombs: [],
    obstacles: [
      { id: "board-1", x: 480, y: 570, width: 44, height: 86 },
    ],
  },
  {
    id: "bomb-lane",
    name: "五、火種の向こう",
    objective: "爆弾の上側を通し、完成後も安全な右壁まで運ぶ。",
    skewers: 4,
    targetScore: 1900,
    scoringWallIds: ["right"],
    balls: trio("bomb-lane", [
      { x: 828, y: 475 },
      { x: 957, y: 408 },
      { x: 1087, y: 389 },
    ]),
    bombs: [{ id: "bomb-1", x: 930, y: 515, radius: 30 }],
  },
];

export const coreRulesStage = validationStages[0];
