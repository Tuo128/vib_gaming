/**
 * 2D camera with smooth following.
 * Transforms world coordinates to screen coordinates.
 */
export class Camera {
  public x: number;
  public y: number;
  public zoom: number;
  private targetX: number;
  private targetY: number;
  private smoothFactor: number;

  constructor(x = 0, y = 0, zoom = 1, smoothFactor = 0.1) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.zoom = zoom;
    this.smoothFactor = smoothFactor;
  }

  /** Set the position the camera should move toward */
  lookAt(x: number, y: number): void {
    this.targetX = x;
    this.targetY = y;
  }

  /** Update camera position with smoothing. dt in seconds. */
  update(dt: number): void {
    const t = 1 - Math.pow(1 - this.smoothFactor, dt * 60);
    this.x += (this.targetX - this.x) * t;
    this.y += (this.targetY - this.y) * t;
  }

  /** Convert world position to screen position */
  worldToScreen(worldX: number, worldY: number, canvasW: number, canvasH: number): { x: number; y: number } {
    return {
      x: (worldX - this.x) * this.zoom + canvasW / 2,
      y: (worldY - this.y) * this.zoom + canvasH / 2,
    };
  }

  /** Convert screen position to world position */
  screenToWorld(screenX: number, screenY: number, canvasW: number, canvasH: number): { x: number; y: number } {
    return {
      x: (screenX - canvasW / 2) / this.zoom + this.x,
      y: (screenY - canvasH / 2) / this.zoom + this.y,
    };
  }

  /** Get visible bounds in world coordinates */
  getVisibleBounds(canvasW: number, canvasH: number): { left: number; right: number; top: number; bottom: number } {
    const halfW = canvasW / 2 / this.zoom;
    const halfH = canvasH / 2 / this.zoom;
    return {
      left: this.x - halfW,
      right: this.x + halfW,
      top: this.y - halfH,
      bottom: this.y + halfH,
    };
  }
}
