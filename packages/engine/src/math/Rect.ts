/**
 * Axis-aligned rectangle, defined by top-left corner + dimensions.
 */
export class Rect {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}

  get left(): number {
    return this.x;
  }
  get right(): number {
    return this.x + this.width;
  }
  get top(): number {
    return this.y;
  }
  get bottom(): number {
    return this.y + this.height;
  }
  get centerX(): number {
    return this.x + this.width / 2;
  }
  get centerY(): number {
    return this.y + this.height / 2;
  }
}
