import { useState, useEffect } from 'react';
import type { GameMeta } from '@vib/types';
import { fetchGames } from '../api/client';

export function useGames() {
  const [games, setGames] = useState<GameMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGames()
      .then(setGames)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { games, loading, error };
}
