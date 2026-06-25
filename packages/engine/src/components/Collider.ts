import type { Component } from '../ecs/Component';

export class Collider implements Component {
  constructor(
    public width: number,
    public height: number,
    public radius: number = 0 // If > 0, use circle collision instead of AABB
  ) {}
}
