import type { World } from './World';

/**
 * Base class for systems that process entities each frame.
 * Override update() to implement behavior.
 */
export abstract class System {
  /** Whether this system should run */
  enabled = true;

  /** Called each fixed timestep. dt is in seconds. */
  abstract update(dt: number, world: World): void;
}
