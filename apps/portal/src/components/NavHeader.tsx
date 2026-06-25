import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: '游戏大厅' },
  { to: '/leaderboard', label: '排行榜' },
  { to: '/about', label: '关于我们' },
];

export default function NavHeader() {
  const location = useLocation();

  return (
    <header className="bg-gray-800/80 backdrop-blur border-b border-gray-700 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-400 hover:text-indigo-300">
          ⚔️ Vib Gaming
        </Link>
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm transition-colors ${
                location.pathname === link.to
                  ? 'text-indigo-400 font-semibold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
