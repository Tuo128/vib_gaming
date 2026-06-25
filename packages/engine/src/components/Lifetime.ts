import type { Component } from '../ecs/Component';

/** Component for entities that should be destroyed after a certain time */
export class Lifetime implements Component {
  constructor(
    public remaining: number // seconds
  ) {}
}
