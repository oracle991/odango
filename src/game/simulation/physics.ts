import type {
  Arena,
  CannonConfig,
  ObstacleDefinition,
  SimulationConfig,
  SkewerState,
  TrajectoryPoint,
  Vec2,
  WallHit,
} from "./types";

const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180;

export function chargeToSpeed(chargeSeconds: number, config: SimulationConfig): number {
  const clamped = Math.min(
    config.maxChargeSeconds,
    Math.max(config.minChargeSeconds, chargeSeconds),
  );
  const range = config.maxChargeSeconds - config.minChargeSeconds;
  const progress = range === 0 ? 1 : (clamped - config.minChargeSeconds) / range;
  return config.minLaunchSpeed + (config.maxLaunchSpeed - config.minLaunchSpeed) * progress;
}

export function muzzlePosition(cannon: CannonConfig, angle: number): Vec2 {
  const radians = degreesToRadians(angle);
  return {
    x: cannon.x + Math.cos(radians) * cannon.barrelLength,
    y: cannon.y - Math.sin(radians) * cannon.barrelLength,
  };
}

export function createSkewer(
  cannon: CannonConfig,
  angle: number,
  speed: number,
): SkewerState {
  const radians = degreesToRadians(angle);
  return {
    position: muzzlePosition(cannon, angle),
    velocity: {
      x: Math.cos(radians) * speed,
      y: -Math.sin(radians) * speed,
    },
    ageSeconds: 0,
    active: true,
    attachedBallIds: [],
  };
}

export function segmentArenaExitIntersection(
  start: Vec2,
  end: Vec2,
  arena: Arena,
): number | null {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const intersections: number[] = [];

  if (dx < 0 && end.x <= arena.left) {
    intersections.push((arena.left - start.x) / dx);
  } else if (dx > 0 && end.x >= arena.right) {
    intersections.push((arena.right - start.x) / dx);
  }
  if (dy < 0 && end.y <= arena.top) {
    intersections.push((arena.top - start.y) / dy);
  } else if (dy > 0 && end.y >= arena.bottom) {
    intersections.push((arena.bottom - start.y) / dy);
  }

  const valid = intersections.filter((time) => time >= 0 && time <= 1);
  return valid.length > 0 ? Math.min(...valid) : null;
}

export function stepSkewer(
  skewer: SkewerState,
  deltaSeconds: number,
  arena: Arena,
  config: SimulationConfig,
  obstacles: ObstacleDefinition[] = [],
): WallHit | null {
  if (!skewer.active) return null;

  skewer.ageSeconds += deltaSeconds;
  skewer.velocity.y += config.gravity * deltaSeconds;
  const start = { ...skewer.position };
  const end = {
    x: start.x + skewer.velocity.x * deltaSeconds,
    y: start.y + skewer.velocity.y * deltaSeconds,
  };
  const wallHits: Array<{ time: number; wallId: string }> = [];
  const arenaHit = getArenaExitHit(start, end, arena);
  if (arenaHit) wallHits.push(arenaHit);
  for (const obstacle of obstacles) {
    const time = getObstacleHitTime(skewer, start, end, obstacle, config);
    if (time !== null) wallHits.push({ time, wallId: `obstacle:${obstacle.id}` });
  }
  wallHits.sort((a, b) => a.time - b.time);
  const wallHit = wallHits[0] ?? null;

  if (wallHit) {
    skewer.position.x = start.x + (end.x - start.x) * wallHit.time;
    skewer.position.y = start.y + (end.y - start.y) * wallHit.time;
    skewer.active = false;
    return { ...skewer.position, wallId: wallHit.wallId };
  }

  skewer.position = end;
  if (skewer.ageSeconds >= config.maxFlightSeconds) {
    skewer.active = false;
  }
  return null;
}

function getArenaExitHit(
  start: Vec2,
  end: Vec2,
  arena: Arena,
): { time: number; wallId: string } | null {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const hits: Array<{ time: number; wallId: string }> = [];

  if (dx < 0 && end.x <= arena.left) {
    hits.push({ time: (arena.left - start.x) / dx, wallId: "left" });
  } else if (dx > 0 && end.x >= arena.right) {
    hits.push({ time: (arena.right - start.x) / dx, wallId: "right" });
  }
  if (dy < 0 && end.y <= arena.top) {
    hits.push({ time: (arena.top - start.y) / dy, wallId: "top" });
  } else if (dy > 0 && end.y >= arena.bottom) {
    hits.push({ time: (arena.bottom - start.y) / dy, wallId: "bottom" });
  }

  const valid = hits.filter((hit) => hit.time >= 0 && hit.time <= 1);
  valid.sort((a, b) => a.time - b.time);
  return valid[0] ?? null;
}

function getObstacleHitTime(
  skewer: SkewerState,
  start: Vec2,
  end: Vec2,
  obstacle: ObstacleDefinition,
  config: SimulationConfig,
): number | null {
  const speed = Math.hypot(skewer.velocity.x, skewer.velocity.y) || 1;
  const forward = {
    x: skewer.velocity.x / speed,
    y: skewer.velocity.y / speed,
  };
  const hitTimes: number[] = [];
  const sampleSpacing = config.tipRadius * 2;

  const addHit = (offset: number, padding: number): void => {
    const time = segmentRectIntersection(
      {
        x: start.x - forward.x * offset,
        y: start.y - forward.y * offset,
      },
      {
        x: end.x - forward.x * offset,
        y: end.y - forward.y * offset,
      },
      {
        left: obstacle.x - padding,
        right: obstacle.x + obstacle.width + padding,
        top: obstacle.y - padding,
        bottom: obstacle.y + obstacle.height + padding,
      },
    );
    if (time !== null) hitTimes.push(time);
  };

  for (let offset = 0; offset <= config.skewerLength; offset += sampleSpacing) {
    addHit(offset, config.tipRadius);
  }
  skewer.attachedBallIds.forEach((_ballId, index) => {
    addHit(24 + index * config.ballSpacing, 18);
  });

  return hitTimes.length > 0 ? Math.min(...hitTimes) : null;
}

export function segmentRectIntersection(
  start: Vec2,
  end: Vec2,
  rect: Arena,
): number | null {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  let near = 0;
  let far = 1;

  for (const [origin, delta, min, max] of [
    [start.x, dx, rect.left, rect.right],
    [start.y, dy, rect.top, rect.bottom],
  ] as const) {
    if (delta === 0) {
      if (origin < min || origin > max) return null;
      continue;
    }
    const first = (min - origin) / delta;
    const second = (max - origin) / delta;
    near = Math.max(near, Math.min(first, second));
    far = Math.min(far, Math.max(first, second));
    if (near > far) return null;
  }

  return near >= 0 && near <= 1 ? near : null;
}

export function segmentCircleIntersection(
  start: Vec2,
  end: Vec2,
  center: Vec2,
  radius: number,
): number | null {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const fx = start.x - center.x;
  const fy = start.y - center.y;
  const a = dx * dx + dy * dy;

  if (a === 0) {
    return fx * fx + fy * fy <= radius * radius ? 0 : null;
  }

  const c = fx * fx + fy * fy - radius * radius;
  if (c <= 0) return 0;

  const b = 2 * (fx * dx + fy * dy);
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;

  const root = Math.sqrt(discriminant);
  const near = (-b - root) / (2 * a);
  const far = (-b + root) / (2 * a);
  if (near >= 0 && near <= 1) return near;
  if (far >= 0 && far <= 1) return far;
  return null;
}

export function predictTrajectory(
  cannon: CannonConfig,
  angle: number,
  speed: number,
  arena: Arena,
  config: SimulationConfig,
  seconds = 8,
  obstacles: ObstacleDefinition[] = [],
): TrajectoryPoint[] {
  const skewer = createSkewer(cannon, angle, speed);
  const points: TrajectoryPoint[] = [{ ...skewer.position, wall: false }];
  const sampleEvery = 8;
  const totalSteps = Math.ceil(seconds / config.fixedStepSeconds);

  for (let step = 0; step < totalSteps && skewer.active; step += 1) {
    const wallHit = stepSkewer(
      skewer,
      config.fixedStepSeconds,
      arena,
      config,
      obstacles,
    );
    if (wallHit || step % sampleEvery === 0) {
      points.push({ ...skewer.position, wall: Boolean(wallHit) });
    }
  }

  return points;
}
