import { Link } from 'react-router-dom';
import type { GameMeta } from '@vib/types';
import { Card, Badge } from './shared';

export default function GameCard({ game }: { game: GameMeta }) {
  return (
    <Link to={`/games/${game.member_id}`}>
      <Card hover className="h-full cursor-pointer">
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={game.game_title}
            className="w-full h-36 object-cover"
          />
        ) : (
          <div className="w-full h-36 bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-4xl">
            🎮
          </div>
        )}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-100">{game.game_title}</h3>
          <p className="text-sm text-gray-400 mt-1">{game.member_name}</p>
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{game.description}</p>
          <div className="flex gap-1 mt-3 flex-wrap">
            {game.tags?.map((tag) => (
              <Badge key={tag} text={tag} />
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}
