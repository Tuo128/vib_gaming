/**
 * Bridge for communication between game iframe and portal via postMessage.
 * Games use this to report scores and receive portal commands.
 */

export interface ScorePayload {
  score: number;
  kills: number;
  survivalTime: number;
  level: number;
}

export interface GameMessage {
  type: 'SCORE_UPDATE' | 'GAME_OVER';
  payload: ScorePayload;
}

export interface PortalCommand {
  type: 'PAUSE' | 'RESUME' | 'RESTART';
}

type CommandCallback = (command: PortalCommand) => void;

export class PortalBridge {
  private commandCallbacks: CommandCallback[] = [];

  constructor() {
    window.addEventListener('message', (event) => {
      // In production, verify event.origin
      const data = event.data as PortalCommand;
      if (data.type && ['PAUSE', 'RESUME', 'RESTART'].includes(data.type)) {
        this.commandCallbacks.forEach((cb) => cb(data));
      }
    });
  }

  /** Report a live score update to the portal */
  reportScore(payload: ScorePayload): void {
    this.send({ type: 'SCORE_UPDATE', payload });
  }

  /** Report game over with final score to the portal */
  reportGameOver(payload: ScorePayload): void {
    this.send({ type: 'GAME_OVER', payload });
  }

  /** Listen for commands from the portal (PAUSE, RESUME, RESTART) */
  onCommand(callback: CommandCallback): void {
    this.commandCallbacks.push(callback);
  }

  private send(message: GameMessage): void {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, '*');
    }
  }
}
