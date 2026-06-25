import { System } from '../ecs/System';
import type { World } from '../ecs/World';
import { Transform } from '../components/Transform';
import { Sprite } from '../components/Sprite';
import { Health } from '../components/Health';
import type { CanvasRenderer } from '../render/CanvasRenderer';
import type { Camera } from '../render/Camera';

/**
 * Renders sprites and health bars to the canvas.
 */
export class RenderSystem extends System {
  constructor(
    private renderer: CanvasRenderer,
    private camera: Camera
  ) {
    super();
  }

  update(_dt: number, world: World): void {
    const entities = world.query(Transform, Sprite);

    for (const [entity, transform, sprite] of entities) {
      const health = world.getComponent(entity, Health);
      if (health && !health.alive) continue;

      this.renderer.drawCircle(
        transform.x,
        transform.y,
        sprite.width / 2,
        sprite.color,
        this.camera
      );

      // Draw health bar for entities with health
      if (health && health.current < health.max) {
        this.renderer.drawHealthBar(
          transform.x,
          transform.y,
          sprite.width + 4,
          health.ratio,
          this.camera
        );
      }
    }
  }
}
