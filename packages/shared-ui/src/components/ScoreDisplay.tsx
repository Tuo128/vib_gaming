import React from 'react';

interface ScoreDisplayProps {
  score: number;
  kills?: number;
  survivalTime?: number; // seconds
  label?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  kills,
  survivalTime,
  label = 'Score',
}) => {
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-3xl font-bold text-indigo-400">{score.toLocaleString()}</span>
      <div className="flex gap-3 text-sm text-gray-400">
        {kills !== undefined && <span>🗡️ {kills} kills</span>}
        {survivalTime !== undefined && <span>⏱️ {formatTime(survivalTime)}</span>}
      </div>
    </div>
  );
};
