// Inline shared UI components — avoids cross-package type resolution issues

// ============ Button ============

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-gray-700 text-gray-100 hover:bg-gray-600',
  ghost: 'bg-transparent text-gray-300 hover:bg-gray-800',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-5 py-2 text-base',
  lg: 'px-7 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const cls = `rounded-lg font-semibold transition-all cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}

// ============ Card ============

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ className = '', children, hover = false }: CardProps) {
  const cls = `bg-gray-800 border border-gray-700 rounded-xl overflow-hidden ${hover ? 'hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all' : ''} ${className}`;
  return <div className={cls}>{children}</div>;
}

// ============ Badge ============

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const badgeColors: Record<string, string> = {
  default: 'bg-gray-700 text-gray-300',
  success: 'bg-emerald-900 text-emerald-300',
  warning: 'bg-amber-900 text-amber-300',
  danger: 'bg-red-900 text-red-300',
};

export function Badge({ text, variant = 'default' }: BadgeProps) {
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badgeColors[variant]}`}>{text}</span>;
}

// ============ ScoreDisplay ============

interface ScoreDisplayProps {
  score: number;
  kills?: number;
  survivalTime?: number;
  label?: string;
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function ScoreDisplay({ score, kills, survivalTime, label = 'Score' }: ScoreDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-3xl font-bold text-indigo-400">{score.toLocaleString()}</span>
      {(kills !== undefined || survivalTime !== undefined) && (
        <div className="flex gap-3 text-sm text-gray-400">
          {kills !== undefined && <span>🗡️ {kills} kills</span>}
          {survivalTime !== undefined && <span>⏱️ {fmtTime(survivalTime)}</span>}
        </div>
      )}
    </div>
  );
}
