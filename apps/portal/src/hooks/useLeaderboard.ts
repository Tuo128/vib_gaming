import { useState, useEffect } from 'react';
import type { ScoreEntry } from '@vib/types';
import { fetchLeaderboard } from '../api/client';

export function useLeaderboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard()
      .then(setScores)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { scores, loading, error };
}
