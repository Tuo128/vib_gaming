import React from 'react';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = 'default' }) => {
  const colors: Record<string, string> = {
    default: 'bg-gray-700 text-gray-300',
    success: 'bg-emerald-900 text-emerald-300',
    warning: 'bg-amber-900 text-amber-300',
    danger: 'bg-red-900 text-red-300',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors[variant]}`}>
      {text}
    </span>
  );
};
