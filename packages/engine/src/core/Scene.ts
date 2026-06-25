import { World } from '../ecs/World';

/**
 * Base class for game scenes.
 * Each scene owns a World and manages its lifecycle.
 */
export abstract class Scene {
  public world: World;

  constructor() {
    this.world = new World();
  }

  /** Called when the scene is entered. Set up entities and systems here. */
  abstract enter(): void;

  /** Called each fixed timestep. dt is in seconds. */
  update(dt: number): void {
    this.world.update(dt);
  }

  /** Called when the scene is exited. Clean up resources. */
  exit(): void {
    this.world.clear();
  }
}
