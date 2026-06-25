import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage';
import GamePlayPage from './pages/GamePlayPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games/:memberId" element={<GameDetailPage />} />
        <Route path="/games/:memberId/play" element={<GamePlayPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Layout>
  );
}
