import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ className = '', children, hover = false }) => {
  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-xl overflow-hidden ${
        hover ? 'hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
