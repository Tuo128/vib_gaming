import type { Component } from '../ecs/Component';

export class Transform implements Component {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public rotation: number = 0
  ) {}
}
