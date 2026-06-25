import type { Component } from '../ecs/Component';

export class Velocity implements Component {
  constructor(
    public vx: number = 0,
    public vy: number = 0
  ) {}
}
