import { System } from '../ecs/System';
import type { World } from '../ecs/World';
import { Transform } from '../components/Transform';
import { Velocity } from '../components/Velocity';
import { Experience } from '../components/Experience';
import { Pickup } from '../components/Pickup';
import { Player } from '../components/Player';
import { Sprite } from '../components/Sprite';
import { Lifetime } from '../components/Lifetime';

/**
 * Handles XP gem collection and level-ups.
 */
export class XPSystem extends System {
  private magnetRange = 80;
  private magnetSpeed = 500;

  constructor(
    private xpPerLevel: (level: number) => number = (lvl) => Math.floor(20 * Math.pow(1.2, lvl - 1)),
    private onLevelUp?: (newLevel: number) => void
  ) {
    super();
  }

  update(dt: number, world: World): void {
    // Find the player
    const players = world.query(Transform, Player);
    if (players.length === 0) return;

    const [playerEntity, playerTransform] = players[0];
    const playerExp = world.getComponent(playerEntity, Experience);
    if (!playerExp) return;

    // Process XP pickups
    const gems = world.query(Transform, Pickup, Sprite);

    for (const [entity, transform, pickup] of gems) {
      const dx = playerTransform.x - transform.x;
      const dy = playerTransform.y - transform.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Magnet effect
      if (dist <= pickup.attractRange + playerExp.level * 5 || dist <= this.magnetRange) {
        const vel = world.getComponent(entity, Velocity);
        if (vel) {
          vel.vx = (dx / dist) * this.magnetSpeed;
          vel.vy = (dy / dist) * this.magnetSpeed;
        }

        // Collect if very close
        const collectDist = 20;
        if (dist <= collectDist) {
          playerExp.current += pickup.xpAmount;
          world.removeEntity(entity);
          world.events.emit('xpCollected', { amount: pickup.xpAmount });
        }
      }
    }

    // Check for level up
    while (playerExp.current >= playerExp.toNextLevel) {
      playerExp.current -= playerExp.toNextLevel;
      playerExp.level++;
      playerExp.toNextLevel = this.xpPerLevel(playerExp.level);
      world.events.emit('levelUp', { level: playerExp.level });
      this.onLevelUp?.(playerExp.level);
    }
  }

  /** Spawn an XP gem at a position */
  spawnXP(world: World, x: number, y: number, amount: number): number {
    const entity = world.createEntity();
    world.addComponent(entity, new Transform(x, y));
    world.addComponent(entity, new Velocity(0, 0));
    world.addComponent(entity, new Pickup(amount));
    world.addComponent(entity, new Sprite(8, 8, '#4ade80'));
    world.addComponent(entity, new Lifetime(30));
    return entity;
  }
}
