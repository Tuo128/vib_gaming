/**
 * Fixed-timestep game loop with variable rendering.
 * Ensures deterministic physics updates regardless of frame rate.
 * Based on Glenn Fiedler's "Fix Your Timestep" article.
 */
export class GameLoop {
  private lastTime = 0;
  private accumulator = 0;
  private readonly FIXED_DT = 1000 / 60; // 16.67ms → 60 updates/sec
  private readonly MAX_FRAME_TIME = 250; // Spiral of death guard
  private _running = false;
  private rafId: number | null = null;
  private gameTime = 0; // Total elapsed game time in milliseconds

  constructor(
    private update: (dt: number) => void, // dt in seconds
    private render: (alpha: number) => void // interpolation alpha [0, 1]
  ) {}

  get running(): boolean {
    return this._running;
  }

  get elapsed(): number {
    return this.gameTime;
  }

  start(): void {
    if (this._running) return;
    this._running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.gameTime = 0;
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop(): void {
    this._running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private loop = (currentTime: number): void => {
    if (!this._running) return;

    let frameTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Prevent spiral of death when tab is backgrounded
    if (frameTime > this.MAX_FRAME_TIME) {
      frameTime = this.MAX_FRAME_TIME;
    }

    this.accumulator += frameTime;
    this.gameTime += frameTime;

    while (this.accumulator >= this.FIXED_DT) {
      this.update(this.FIXED_DT / 1000); // Convert to seconds
      this.accumulator -= this.FIXED_DT;
    }

    const alpha = this.accumulator / this.FIXED_DT;
    this.render(alpha);

    this.rafId = requestAnimationFrame(this.loop);
  };
}
