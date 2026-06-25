import { System } from '../ecs/System';
import type { World } from '../ecs/World';
import { Transform } from '../components/Transform';
import { Velocity } from '../components/Velocity';
import { Enemy } from '../components/Enemy';
import { Player } from '../components/Player';

/**
 * Makes enemies move toward the nearest player.
 */
export class EnemyAISystem extends System {
  update(_dt: number, world: World): void {
    // Find the player position (use first player)
    const players = world.query(Transform, Player);
    if (players.length === 0) return;

    const playerPos = players[0][1]; // [entity, transform, player] → transform is [1]

    const enemies = world.query(Transform, Velocity, Enemy);

    for (const [, transform, velocity, enemy] of enemies) {
      const dx = playerPos.x - transform.x;
      const dy = playerPos.y - transform.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0) {
        velocity.vx = (dx / dist) * enemy.speed;
        velocity.vy = (dy / dist) * enemy.speed;
      }
    }
  }
}
