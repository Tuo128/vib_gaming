import type { Component } from '../ecs/Component';

export class Sprite implements Component {
  constructor(
    public width: number = 20,
    public height: number = 20,
    public color: string = '#fff'
  ) {}
}
