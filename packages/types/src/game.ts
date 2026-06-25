/** Metadata for a team member's game */
export interface GameMeta {
  id: number;
  member_id: string; // e.g. "alice"
  member_name: string; // e.g. "Alice"
  game_title: string; // e.g. "Alice's Night Hunt"
  description: string;
  thumbnail: string;
  game_url: string;
  tags: string[];
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

/** Request to create or update a game */
export interface GameInput {
  member_id: string;
  member_name: string;
  game_title: string;
  description: string;
  thumbnail: string;
  game_url: string;
  tags?: string[];
}

/** A score entry on the leaderboard */
export interface ScoreEntry {
  id: number;
  game_id: number;
  player_name: string;
  score: number;
  kills: number;
  survival_time: number; // seconds
  level_reached: number;
  created_at: string;
  game_title?: string; // joined from game table
  member_name?: string; // joined
}

/** Request to submit a score */
export interface ScoreInput {
  game_id: number;
  player_name: string;
  score: number;
  kills?: number;
  survival_time?: number;
  level_reached?: number;
}

/** API response wrapper */
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
