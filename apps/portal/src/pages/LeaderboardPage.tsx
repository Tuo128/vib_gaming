import { useLeaderboard } from '../hooks/useLeaderboard';
import LeaderboardTable from '../components/LeaderboardTable';

export default function LeaderboardPage() {
  const { scores, loading, error } = useLeaderboard();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-400">🏆 全球排行榜</h1>
        <p className="text-gray-400 mt-2">跨游戏最高分排名</p>
      </div>

      {error && (
        <div className="text-center p-4 bg-red-900/30 border border-red-700 rounded-lg mb-4">
          <p className="text-red-400">加载失败: {error}</p>
        </div>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <LeaderboardTable scores={scores} loading={loading} showGame />
      </div>
    </div>
  );
}
