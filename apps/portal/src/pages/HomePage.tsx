import { useGames } from '../hooks/useGames';
import GameCard from '../components/GameCard';

export default function HomePage() {
  const { games, loading, error } = useGames();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-400">⚔️ Vib Gaming 游戏大厅</h1>
        <p className="text-gray-400 mt-2">选择一个游戏，开始割草！</p>
      </div>

      {loading && (
        <p className="text-center text-gray-500 py-8">加载游戏中...</p>
      )}
      {error && (
        <p className="text-center text-red-400 py-8">加载失败: {error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games
          .filter((g) => g.status === 'active')
          .map((game) => (
            <GameCard key={game.member_id} game={game} />
          ))}
      </div>

      {!loading && games.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🎮</p>
          <p className="text-gray-500 text-lg">还没有游戏，快去开发吧！</p>
          <p className="text-gray-600 text-sm mt-2">
            通过 Flask API 注册你的第一个游戏
          </p>
        </div>
      )}
    </div>
  );
}
