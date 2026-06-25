import { System } from '../ecs/System';
import type { World } from '../ecs/World';
import { Projectile } from '../components/Projectile';
import { Lifetime } from '../components/Lifetime';

/**
 * Updates projectile lifetime and destroys expired ones.
 * Movement is handled by MovementSystem.
 */
export class ProjectileSystem extends System {
  update(dt: number, world: World): void {
    const projectiles = world.query(Projectile);

    for (const [entity, projectile] of projectiles) {
      projectile.lifetime -= dt;
      if (projectile.lifetime <= 0) {
        world.removeEntity(entity);
      }
    }
  }
}

/**
 * Destroys entities whose Lifetime has expired.
 */
export class LifetimeSystem extends System {
  update(dt: number, world: World): void {
    const entities = world.query(Lifetime);

    for (const [entity, lifetime] of entities) {
      lifetime.remaining -= dt;
      if (lifetime.remaining <= 0) {
        world.removeEntity(entity);
      }
    }
  }
}
