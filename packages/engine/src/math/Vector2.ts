/**
 * 2D vector with common operations for game math.
 */
export class Vector2 {
  constructor(
    public x: number,
    public y: number
  ) {}

  /** Distance to another vector */
  distanceTo(other: Vector2): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /** Squared distance to another vector (faster, avoids sqrt) */
  distanceSqTo(other: Vector2): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return dx * dx + dy * dy;
  }

  /** Length (magnitude) of this vector */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /** Return a normalized copy (unit length) */
  normalize(): Vector2 {
    const len = this.length();
    if (len === 0) return new Vector2(0, 0);
    return new Vector2(this.x / len, this.y / len);
  }

  /** Vector addition */
  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  /** Vector subtraction */
  subtract(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  /** Scalar multiplication */
  scale(s: number): Vector2 {
    return new Vector2(this.x * s, this.y * s);
  }

  /** Clone this vector */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /** Direction from this vector to another (normalized) */
  directionTo(target: Vector2): Vector2 {
    return target.subtract(this).normalize();
  }

  /** Angle from this to target in radians */
  angleTo(target: Vector2): number {
    return Math.atan2(target.y - this.y, target.x - this.x);
  }

  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  static fromAngle(angle: number): Vector2 {
    return new Vector2(Math.cos(angle), Math.sin(angle));
  }
}
