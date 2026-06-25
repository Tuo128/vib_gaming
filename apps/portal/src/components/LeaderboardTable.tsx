import type { ScoreEntry } from '@vib/types';

interface LeaderboardTableProps {
  scores: ScoreEntry[];
  loading: boolean;
  showGame?: boolean;
}

export default function LeaderboardTable({ scores, loading, showGame = false }: LeaderboardTableProps) {
  if (loading) {
    return <p className="text-center text-gray-500 py-8">加载中...</p>;
  }

  if (scores.length === 0) {
    return <p className="text-center text-gray-500 py-8">暂无数据，快去玩游戏吧！</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400 text-left">
            <th className="py-3 px-4 w-12">#</th>
            <th className="py-3 px-4">玩家</th>
            {showGame && <th className="py-3 px-4">游戏</th>}
            <th className="py-3 px-4 text-right">分数</th>
            <th className="py-3 px-4 text-right">击杀</th>
            <th className="py-3 px-4 text-right">存活时间</th>
            <th className="py-3 px-4 text-right">等级</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, i) => (
            <tr
              key={score.id}
              className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                i < 3 ? 'font-semibold' : ''
              }`}
            >
              <td className="py-3 px-4">
                {i < 3 ? (
                  <span className="text-lg">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                  </span>
                ) : (
                  <span className="text-gray-500">{i + 1}</span>
                )}
              </td>
              <td className="py-3 px-4 text-gray-200">{score.player_name}</td>
              {showGame && (
                <td className="py-3 px-4 text-gray-400">{score.game_title || score.member_name}</td>
              )}
              <td className="py-3 px-4 text-right text-indigo-400 font-mono">
                {score.score.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right text-gray-300">{score.kills}</td>
              <td className="py-3 px-4 text-right text-gray-400 font-mono">
                {Math.floor(score.survival_time / 60)}:
                {(score.survival_time % 60).toString().padStart(2, '0')}
              </td>
              <td className="py-3 px-4 text-right text-yellow-400">Lv.{score.level_reached}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
