import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { GameMeta, ScoreEntry } from '@vib/types';
import { fetchGame, fetchScores } from '../api/client';
import { Badge } from '../components/shared';
import GameEmbed from '../components/GameEmbed';
import LeaderboardTable from '../components/LeaderboardTable';

export default function GameDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const [game, setGame] = useState<GameMeta | null>(null);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoresLoading, setScoresLoading] = useState(true);
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    if (!memberId) return;
    setLoading(true);
    fetchGame(memberId)
      .then(setGame)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [memberId]);

  useEffect(() => {
    if (!game) return;
    setScoresLoading(true);
    fetchScores(game.id)
      .then(setScores)
      .catch(console.error)
      .finally(() => setScoresLoading(false));
  }, [game]);

  if (loading) {
    return <p className="text-center text-gray-500 py-8">加载中...</p>;
  }

  if (!game) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-gray-400 text-lg">游戏未找到</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">
          ← 返回大厅
        </Link>
      </div>
    );
  }

  if (showGame) {
    return (
      <div>
        <div className="flex items-center gap-4 px-4 py-2 bg-gray-800">
          <button
            onClick={() => setShowGame(false)}
            className="text-indigo-400 hover:text-indigo-300"
          >
            ← 返回详情
          </button>
          <span className="text-gray-400">{game.game_title}</span>
        </div>
        <div style={{ height: 'calc(100vh - 140px)' }}>
          <GameEmbed gameUrl={game.game_url} gameId={game.id} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/" className="text-indigo-400 hover:text-indigo-300 text-sm">
        ← 返回大厅
      </Link>

      <div className="mt-4 flex flex-col lg:flex-row gap-8">
        {/* Game Info */}
        <div className="lg:w-1/3">
          {game.thumbnail ? (
            <img src={game.thumbnail} alt={game.game_title} className="w-full h-48 object-cover rounded-xl" />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center text-6xl">
              🎮
            </div>
          )}
          <h1 className="text-3xl font-bold mt-4">{game.game_title}</h1>
          <p className="text-gray-400 mt-1">作者: {game.member_name}</p>
          <p className="text-gray-300 mt-4">{game.description}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {game.tags?.map((tag) => (
              <Badge key={tag} text={tag} />
            ))}
          </div>
          <button
            onClick={() => setShowGame(true)}
            className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold text-lg transition cursor-pointer"
          >
            ▶ 开始游戏
          </button>
          <Link
            to={`/games/${memberId}/play`}
            className="mt-3 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-center block transition"
          >
            全屏模式
          </Link>
        </div>

        {/* Scoreboard */}
        <div className="lg:w-2/3">
          <h2 className="text-xl font-bold mb-4">🏆 排行榜</h2>
          <LeaderboardTable scores={scores} loading={scoresLoading} />
        </div>
      </div>
    </div>
  );
}
