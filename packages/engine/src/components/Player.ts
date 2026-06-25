import type { Component } from '../ecs/Component';

/** Tag component marking the player entity */
export class Player implements Component {
  constructor(
    public speed: number = 200
  ) {}
}
