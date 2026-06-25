import type { Component } from '../ecs/Component';

export class Health implements Component {
  public invincibleTimer = 0;

  constructor(
    public current: number,
    public max: number
  ) {}

  get ratio(): number {
    return this.current / this.max;
  }

  get alive(): boolean {
    return this.current > 0;
  }

  damage(amount: number): void {
    if (this.invincibleTimer > 0) return;
    this.current = Math.max(0, this.current - amount);
  }

  heal(amount: number): void {
    this.current = Math.min(this.max, this.current + amount);
  }
}
