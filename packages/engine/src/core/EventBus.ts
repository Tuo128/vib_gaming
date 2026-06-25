type Listener = (payload: unknown) => void;

/**
 * Simple publish-subscribe event bus.
 * Used for decoupled communication between systems.
 */
export class EventBus {
  private listeners = new Map<string, Set<Listener>>();

  on(event: string, listener: Listener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off(event: string, listener: Listener): void {
    this.listeners.get(event)?.delete(listener);
  }

  emit(event: string, payload?: unknown): void {
    this.listeners.get(event)?.forEach((fn) => fn(payload));
  }

  clear(): void {
    this.listeners.clear();
  }
}
