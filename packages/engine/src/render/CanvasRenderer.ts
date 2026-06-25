import type { Camera } from './Camera';

/**
 * Canvas 2D rendering utility.
 * Provides draw methods for common game graphics.
 */
export class CanvasRenderer {
  public ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D context');
    this.ctx = ctx;
  }

  get width(): number {
    return this.canvas.width;
  }
  get height(): number {
    return this.canvas.height;
  }

  /** Clear the entire canvas */
  clear(color = '#1a1a2e'): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /** Draw a filled circle in world space */
  drawCircle(
    worldX: number,
    worldY: number,
    radius: number,
    color: string,
    camera?: Camera
  ): void {
    let sx = worldX;
    let sy = worldY;
    let sr = radius;

    if (camera) {
      const screen = camera.worldToScreen(worldX, worldY, this.width, this.height);
      sx = screen.x;
      sy = screen.y;
      sr = radius * camera.zoom;
    }

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /** Draw a stroked circle in world space */
  drawCircleOutline(
    worldX: number,
    worldY: number,
    radius: number,
    color: string,
    lineWidth = 1,
    camera?: Camera
  ): void {
    let sx = worldX;
    let sy = worldY;
    let sr = radius;

    if (camera) {
      const screen = camera.worldToScreen(worldX, worldY, this.width, this.height);
      sx = screen.x;
      sy = screen.y;
      sr = radius * camera.zoom;
    }

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  /** Draw a filled rectangle in world space */
  drawRect(
    worldX: number,
    worldY: number,
    w: number,
    h: number,
    color: string,
    camera?: Camera
  ): void {
    let sx = worldX;
    let sy = worldY;
    let sw = w;
    let sh = h;

    if (camera) {
      const screen = camera.worldToScreen(worldX, worldY, this.width, this.height);
      sx = screen.x;
      sy = screen.y;
      sw = w * camera.zoom;
      sh = h * camera.zoom;
    }

    this.ctx.fillStyle = color;
    this.ctx.fillRect(sx - sw / 2, sy - sh / 2, sw, sh);
  }

  /** Draw a health bar above an entity */
  drawHealthBar(
    worldX: number,
    worldY: number,
    width: number,
    healthRatio: number,
    camera?: Camera,
    height = 4
  ): void {
    let sx = worldX;
    let sy = worldY;
    let sw = width;
    let sh = height;

    if (camera) {
      const screen = camera.worldToScreen(worldX, worldY, this.width, this.height);
      sx = screen.x;
      sy = screen.y;
      sw = width * camera.zoom;
      sh = height * camera.zoom;
    }

    const y = sy - 15 * (camera?.zoom ?? 1);

    // Background
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(sx - sw / 2, y, sw, sh);

    // Health fill
    const ratio = Math.max(0, Math.min(1, healthRatio));
    const color = ratio > 0.5 ? '#4ade80' : ratio > 0.25 ? '#fbbf24' : '#ef4444';
    this.ctx.fillStyle = color;
    this.ctx.fillRect(sx - sw / 2, y, sw * ratio, sh);
  }

  /** Draw text in screen space */
  drawText(text: string, x: number, y: number, color = '#fff', fontSize = 16, align: CanvasTextAlign = 'left'): void {
    this.ctx.fillStyle = color;
    this.ctx.font = `${fontSize}px monospace`;
    this.ctx.textAlign = align;
    this.ctx.fillText(text, x, y);
  }

  /** Draw a line */
  drawLine(x1: number, y1: number, x2: number, y2: number, color: string, width = 1): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }
}
