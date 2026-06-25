import { System } from '../ecs/System';
import type { World } from '../ecs/World';
import { Transform } from '../components/Transform';
import { Collider } from '../components/Collider';
import { checkCircle } from '../physics/Collision';
import { Vector2 } from '../math/Vector2';

/**
 * Detects collisions between groups and emits events.
 * For performance, we use circle-circle collision as default.
 */
export class CollisionSystem extends System {
  update(_dt: number, world: World): void {
    const collidables = world.query(Transform, Collider);
    const count = collidables.length;

    // Simple O(n²) loop — fine for <500 entities
    for (let i = 0; i < count; i++) {
      const [entityA, transformA, colliderA] = collidables[i];
      const aPos = new Vector2(transformA.x, transformA.y);
      const aRadius = colliderA.radius > 0 ? colliderA.radius : Math.max(colliderA.width, colliderA.height) / 2;

      for (let j = i + 1; j < count; j++) {
        const [entityB, transformB, colliderB] = collidables[j];
        const bPos = new Vector2(transformB.x, transformB.y);
        const bRadius = colliderB.radius > 0 ? colliderB.radius : Math.max(colliderB.width, colliderB.height) / 2;

        if (checkCircle(aPos, aRadius, bPos, bRadius)) {
          world.events.emit('collision', { entityA, entityB });
        }
      }
    }
  }
}
