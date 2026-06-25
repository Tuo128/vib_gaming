import { System } from '../ecs/System';
import type { World } from '../ecs/World';
import { Transform } from '../components/Transform';
import { Health } from '../components/Health';
import { Projectile } from '../components/Projectile';
import { Enemy } from '../components/Enemy';
import { Player } from '../components/Player';

/**
 * Damage system - subscribes to collision events.
 * Call setupDamageHandler() after creating this system.
 */
export class DamageSystem extends System {
  constructor() {
    super();
  }

  update(_dt: number, _world: World): void {
    // Handled via event subscription in setupDamageHandler
  }
}

/**
 * Wire up collision → damage logic.
 * Call this after adding CollisionSystem to the world.
 */
export function setupDamageHandler(world: World): void {
  world.events.on('collision', (data: unknown) => {
    const { entityA, entityB } = data as { entityA: number; entityB: number };

    const pairs = [[entityA, entityB] as const, [entityB, entityA] as const];

    for (const [projEntity, targetEntity] of pairs) {
      // Check if this is a projectile hitting something
      const proj = world.getComponent(projEntity, Projectile);
      if (!proj) continue;

      // Don't hit the owner
      if (targetEntity === proj.ownerId) continue;

      // Hit enemy?
      const enemyHealth = world.getComponent(targetEntity, Health);
      const enemyComp = world.getComponent(targetEntity, Enemy);
      if (enemyHealth && enemyComp) {
        enemyHealth.damage(proj.damage);
        world.events.emit('enemyHit', { enemy: targetEntity, damage: proj.damage });

        if (!enemyHealth.alive) {
          const pos = world.getComponent(targetEntity, Transform);
          world.events.emit('enemyKilled', {
            enemy: targetEntity,
            xpValue: enemyComp.xpValue,
            position: pos,
          });
          world.removeEntity(targetEntity);
        }

        // Handle pierce
        if (proj.pierce > 0) {
          proj.pierce--;
        } else {
          world.removeEntity(projEntity);
        }
        return;
      }

      // Hit player?
      const playerComp = world.getComponent(targetEntity, Player);
      if (playerComp) {
        const playerHealth = world.getComponent(targetEntity, Health);
        if (playerHealth) {
          playerHealth.damage(enemyComp?.damage ?? proj.damage);
          world.events.emit('playerHit', { damage: enemyComp?.damage ?? proj.damage });
          world.removeEntity(projEntity);
        }
      }
    }
  });
}
