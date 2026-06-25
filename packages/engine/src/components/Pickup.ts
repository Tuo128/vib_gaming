import type { Component } from '../ecs/Component';

export class Pickup implements Component {
  constructor(
    public xpAmount: number = 10,
    public attractRange: number = 50, // distance at which magnet effect starts
    public attractSpeed: number = 300 // speed when magnetized
  ) {}
}
