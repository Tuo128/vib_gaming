import { System } from '../ecs/System';
import type { World } from '../ecs/World';
import { Transform } from '../components/Transform';
import { Velocity } from '../components/Velocity';

/**
 * Moves entities by their velocity: position += velocity * dt
 */
export class MovementSystem extends System {
  update(dt: number, world: World): void {
    const entities = world.query(Transform, Velocity);
    for (const [, transform, velocity] of entities) {
      transform.x += velocity.vx * dt;
      transform.y += velocity.vy * dt;
    }
  }
}
