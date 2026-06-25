import type { Component } from '../ecs/Component';

export class Experience implements Component {
  constructor(
    public current: number = 0,
    public toNextLevel: number = 20,
    public level: number = 1
  ) {}

  get ratio(): number {
    return this.current / this.toNextLevel;
  }
}
