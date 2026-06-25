import { System } from '../ecs/System';
import type { World } from '../ecs/World';
import { Transform } from '../components/Transform';
import { Velocity } from '../components/Velocity';
import { Health } from '../components/Health';
import { Enemy } from '../components/Enemy';
import { Sprite } from '../components/Sprite';
import { Collider } from '../components/Collider';

export interface WaveConfig {
  enemyConfig: {
    health: number;
    speed: number;
    damage: number;
    xpValue: number;
    color: string;
  };
  count: number;
  interval: number; // seconds between individual spawns
  startTime: number; // seconds into the game
}

/**
 * Wave-based enemy spawner.
 * Spawns enemies at random positions around the edges of the game area.
 */
export class EnemySpawnSystem extends System {
  private elapsed = 0;
  private spawnTimers = new Map<number, number>(); // wave index -> next spawn timer
  private spawnedCount = new Map<number, number>(); // wave index -> spawned so far
  private completedWaves = new Set<number>();
  private spawnArea = 600; // distance from origin to spawn

  constructor(private waves: WaveConfig[]) {
    super();
    // Initialize timers
    waves.forEach((_, i) => {
      this.spawnTimers.set(i, 0);
      this.spawnedCount.set(i, 0);
    });
  }

  setPlayerPosition(x: number, y: number): void {
    // Spawn enemies relative to player position
    this.spawnX = x;
    this.spawnY = y;
  }

  private spawnX = 0;
  private spawnY = 0;

  update(dt: number, world: World): void {
    this.elapsed += dt;

    for (let i = 0; i < this.waves.length; i++) {
      if (this.completedWaves.has(i)) continue;

      const wave = this.waves[i];

      // Not time yet
      if (this.elapsed < wave.startTime) continue;

      // Tick spawn timer
      const currentTimer = this.spawnTimers.get(i)!;
      const newTimer = Math.max(0, currentTimer - dt);
      this.spawnTimers.set(i, newTimer);

      if (newTimer > 0) continue;

      // Spawn one enemy
      const spawned = this.spawnedCount.get(i)!;
      if (spawned < wave.count) {
        this.spawnEnemy(wave, world);
        this.spawnedCount.set(i, spawned + 1);
        this.spawnTimers.set(i, wave.interval);
      }

      if (this.spawnedCount.get(i)! >= wave.count) {
        this.completedWaves.add(i);
      }
    }
  }

  private spawnEnemy(wave: WaveConfig, world: World): void {
    // Random position around the spawn area perimeter
    const angle = Math.random() * Math.PI * 2;
    const x = this.spawnX + Math.cos(angle) * this.spawnArea;
    const y = this.spawnY + Math.sin(angle) * this.spawnArea;

    const cfg = wave.enemyConfig;
    const entity = world.createEntity();
    world.addComponent(entity, new Transform(x, y));
    world.addComponent(entity, new Velocity(0, 0));
    world.addComponent(entity, new Health(cfg.health, cfg.health));
    world.addComponent(entity, new Enemy(cfg.xpValue, cfg.damage, cfg.speed));
    world.addComponent(entity, new Sprite(16, 16, cfg.color));
    world.addComponent(entity, new Collider(14, 14, 8));
  }
}
