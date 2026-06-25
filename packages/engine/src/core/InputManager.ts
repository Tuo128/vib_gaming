/**
 * Keyboard and touch input abstraction.
 * Tracks which keys are currently pressed.
 */
export class InputManager {
  private keys = new Set<string>();
  private _mouseX = 0;
  private _mouseY = 0;
  private _mouseDown = false;

  constructor(private canvas: HTMLCanvasElement) {
    this.setupListeners();
  }

  private setupListeners(): void {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key.toLowerCase());
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this._mouseX = e.clientX - rect.left;
      this._mouseY = e.clientY - rect.top;
    });
    this.canvas.addEventListener('mousedown', () => {
      this._mouseDown = true;
    });
    this.canvas.addEventListener('mouseup', () => {
      this._mouseDown = false;
    });
  }

  /** Check if a key is currently held down. Use lowercase key names: 'w', 'arrowup', ' ' */
  isDown(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  /** Get the current movement direction from WASD/arrow keys as a normalized vector */
  getMovementDirection(): { x: number; y: number } {
    let dx = 0;
    let dy = 0;

    if (this.isDown('w') || this.isDown('arrowup')) dy -= 1;
    if (this.isDown('s') || this.isDown('arrowdown')) dy += 1;
    if (this.isDown('a') || this.isDown('arrowleft')) dx -= 1;
    if (this.isDown('d') || this.isDown('arrowright')) dx += 1;

    // Normalize if moving diagonally
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 0) {
      dx /= len;
      dy /= len;
    }

    return { x: dx, y: dy };
  }

  get mouseX(): number {
    return this._mouseX;
  }
  get mouseY(): number {
    return this._mouseY;
  }
  get mouseDown(): boolean {
    return this._mouseDown;
  }

  destroy(): void {
    // Simple destroy — in a full implementation, remove listeners
    this.keys.clear();
  }
}
