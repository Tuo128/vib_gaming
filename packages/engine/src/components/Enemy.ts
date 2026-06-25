import type { Component } from '../ecs/Component';

export class Enemy implements Component {
  constructor(
    public xpValue: number = 10,
    public damage: number = 10,
    public speed: number = 80
  ) {}
}
