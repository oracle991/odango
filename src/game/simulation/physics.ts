import type {
  Arena,
  CannonConfig,
  SimulationConfig,
  SkewerState,
  TrajectoryPoint,
  Vec2,
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
): Vec2 | null {
  if (!skewer.active) return null;

  skewer.ageSeconds += deltaSeconds;
  skewer.velocity.y += config.gravity * deltaSeconds;
  const start = { ...skewer.position };
  const end = {
    x: start.x + skewer.velocity.x * deltaSeconds,
    y: start.y + skewer.velocity.y * deltaSeconds,
  };
  const wallTime = segmentArenaExitIntersection(start, end, arena);

  if (wallTime !== null) {
    skewer.position.x = start.x + (end.x - start.x) * wallTime;
    skewer.position.y = start.y + (end.y - start.y) * wallTime;
    skewer.active = false;
    return { ...skewer.position };
  }

  skewer.position = end;
  if (skewer.ageSeconds >= config.maxFlightSeconds) {
    skewer.active = false;
  }
  return null;
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
): TrajectoryPoint[] {
  const skewer = createSkewer(cannon, angle, speed);
  const points: TrajectoryPoint[] = [{ ...skewer.position, wall: false }];
  const sampleEvery = 8;
  const totalSteps = Math.ceil(seconds / config.fixedStepSeconds);

  for (let step = 0; step < totalSteps && skewer.active; step += 1) {
    const wallHit = stepSkewer(skewer, config.fixedStepSeconds, arena, config);
    if (wallHit || step % sampleEvery === 0) {
      points.push({ ...skewer.position, wall: Boolean(wallHit) });
    }
  }

  return points;
}
