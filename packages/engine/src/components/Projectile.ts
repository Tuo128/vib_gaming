import type { Component } from '../ecs/Component';

export class Projectile implements Component {
  constructor(
    public lifetime: number = 5, // seconds until auto-destroy
    public damage: number = 10,
    public pierce: number = 0, // remaining pierces
    public ownerId: number = 0 // entity id that fired this
  ) {}
}
