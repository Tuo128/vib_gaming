import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { GameMeta } from '@vib/types';
import { fetchGame } from '../api/client';
import GameEmbed from '../components/GameEmbed';

export default function GamePlayPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const [game, setGame] = useState<GameMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) return;
    fetchGame(memberId)
      .then(setGame)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [memberId]);

  if (loading) {
    return <p className="text-center text-gray-500 py-8">加载中...</p>;
  }

  if (!game) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">游戏未找到</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">
          ← 返回大厅
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <GameEmbed gameUrl={game.game_url} gameId={game.id} fullscreen />
    </div>
  );
}
