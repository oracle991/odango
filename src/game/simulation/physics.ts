import type {
  Arena,
  CannonConfig,
  ProjectileState,
  SimulationConfig,
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

export function createProjectile(
  cannon: CannonConfig,
  angle: number,
  speed: number,
): ProjectileState {
  const radians = degreesToRadians(angle);
  return {
    position: muzzlePosition(cannon, angle),
    velocity: {
      x: Math.cos(radians) * speed,
      y: -Math.sin(radians) * speed,
    },
    bounces: 0,
    ageSeconds: 0,
    active: true,
  };
}

export function stepProjectile(
  projectile: ProjectileState,
  deltaSeconds: number,
  arena: Arena,
  config: SimulationConfig,
): boolean {
  if (!projectile.active) return false;

  projectile.ageSeconds += deltaSeconds;
  projectile.velocity.y += config.gravity * deltaSeconds;
  projectile.position.x += projectile.velocity.x * deltaSeconds;
  projectile.position.y += projectile.velocity.y * deltaSeconds;

  let bounced = false;
  const radius = config.radius;

  if (projectile.position.x - radius <= arena.left && projectile.velocity.x < 0) {
    projectile.position.x = arena.left + radius;
    projectile.velocity.x = -projectile.velocity.x * config.restitution;
    bounced = true;
  } else if (projectile.position.x + radius >= arena.right && projectile.velocity.x > 0) {
    projectile.position.x = arena.right - radius;
    projectile.velocity.x = -projectile.velocity.x * config.restitution;
    bounced = true;
  }

  if (projectile.position.y - radius <= arena.top && projectile.velocity.y < 0) {
    projectile.position.y = arena.top + radius;
    projectile.velocity.y = -projectile.velocity.y * config.restitution;
    bounced = true;
  } else if (projectile.position.y + radius >= arena.bottom && projectile.velocity.y > 0) {
    projectile.position.y = arena.bottom - radius;
    projectile.velocity.y = -projectile.velocity.y * config.restitution;
    bounced = true;
  }

  if (bounced) projectile.bounces += 1;
  if (
    projectile.bounces >= config.maxBounces ||
    projectile.ageSeconds >= config.maxFlightSeconds
  ) {
    projectile.active = false;
  }

  return bounced;
}

export function predictTrajectory(
  cannon: CannonConfig,
  angle: number,
  speed: number,
  arena: Arena,
  config: SimulationConfig,
  seconds = 8,
): TrajectoryPoint[] {
  const projectile = createProjectile(cannon, angle, speed);
  const points: TrajectoryPoint[] = [
    { ...projectile.position, bounce: false },
  ];
  const sampleEvery = 8;
  const totalSteps = Math.ceil(seconds / config.fixedStepSeconds);

  for (let step = 0; step < totalSteps && projectile.active; step += 1) {
    const bounced = stepProjectile(projectile, config.fixedStepSeconds, arena, config);
    if (bounced || step % sampleEvery === 0) {
      points.push({ ...projectile.position, bounce: bounced });
    }
  }

  return points;
}
