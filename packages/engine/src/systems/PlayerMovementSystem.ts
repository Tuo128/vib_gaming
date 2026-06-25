import { System } from '../ecs/System';
import type { World } from '../ecs/World';
import { Transform } from '../components/Transform';
import { Velocity } from '../components/Velocity';
import { Player } from '../components/Player';
import type { InputManager } from '../core/InputManager';

/**
 * Reads input and applies movement to the player entity.
 */
export class PlayerMovementSystem extends System {
  constructor(private input: InputManager) {
    super();
  }

  update(_dt: number, world: World): void {
    const dir = this.input.getMovementDirection();
    const players = world.query(Transform, Velocity, Player);

    for (const [, , velocity, player] of players) {
      velocity.vx = dir.x * player.speed;
      velocity.vy = dir.y * player.speed;
    }
  }
}
