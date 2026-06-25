/** Shared type for postMessage communication between game and portal */
export interface ScorePayload {
  score: number;
  kills: number;
  survivalTime: number;
  level: number;
}
