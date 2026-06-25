import type { GameMeta, GameInput, ScoreEntry, ScoreInput, ApiResponse } from '@vib/types';

const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

// Games
export function fetchGames(): Promise<GameMeta[]> {
  return request<GameMeta[]>('/games');
}

export function fetchGame(memberId: string): Promise<GameMeta> {
  return request<GameMeta>(`/games/${memberId}`);
}

export function createGame(data: GameInput): Promise<GameMeta> {
  return request<GameMeta>('/games', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateGame(memberId: string, data: Partial<GameInput>): Promise<GameMeta> {
  return request<GameMeta>(`/games/${memberId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Scores
export function fetchScores(gameId?: number, limit = 20): Promise<ScoreEntry[]> {
  const params = new URLSearchParams();
  if (gameId) params.set('game_id', String(gameId));
  params.set('limit', String(limit));
  return request<ScoreEntry[]>(`/scores?${params}`);
}

export function submitScore(data: ScoreInput): Promise<ScoreEntry> {
  return request<ScoreEntry>('/scores', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function fetchLeaderboard(limit = 50): Promise<ScoreEntry[]> {
  return request<ScoreEntry[]>(`/leaderboard?limit=${limit}`);
}
