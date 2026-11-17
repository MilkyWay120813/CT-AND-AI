import React from 'react';
import { Flame, Lock } from 'lucide-react';
import type { EvaluatedStreakView } from '../utils/streakTracker';

interface HeaderStreakBadgeProps {
  streakView: EvaluatedStreakView;
  theme?: 'light' | 'midnight-chalkboard';
  onClick?: () => void;
  testId?: string;
}

export const HeaderStreakBadge: React.FC<HeaderStreakBadgeProps> = ({
  streakView,
  theme = 'light',
  onClick,
  testId = 'header-streak-badge',
}) => {
  const { displayStreak, status, longestStreak } = streakView;
  const isDark = theme === 'midnight-chalkboard';

  const labelTitle =
    status === 'locked'
      ? 'Daily Study Streak Locked · Sign in to start tracking your daily streak'
      : status === 'active-today'
      ? `${displayStreak}-day Daily Study Streak active today! (Best: ${longestStreak} days)`
      : status === 'at-risk'
      ? `${displayStreak}-day Streak ready — open a lesson or simulation today to keep it alive! (Best: ${longestStreak} days)`
      : `0-day Streak — open any module, simulation, or quiz today to ignite your streak! (Best: ${longestStreak} days)`;

  const containerStyle =
    status === 'locked'
      ? isDark
        ? 'bg-[#14281E] hover:bg-[#1B3829] text-slate-200 border-[#2B503D]'
        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
      : status === 'active-today'
      ? isDark
        ? 'bg-[#2B1F0E] hover:bg-[#3A2912] text-amber-200 border-orange-500/70 shadow-xs'
        : 'bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 text-orange-950 border-orange-300 shadow-2xs'
      : status === 'at-risk'
      ? isDark
        ? 'bg-[#26210F] hover:bg-[#342C14] text-amber-200 border-amber-400/70'
        : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300'
      : isDark
      ? 'bg-[#14281E] hover:bg-[#1C382A] text-amber-200 border-[#2D5640]'
      : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200';

  const flameClass =
    status === 'locked'
      ? isDark
        ? 'text-slate-400'
        : 'text-stone-400'
      : status === 'active-today'
      ? 'text-orange-500 fill-orange-400'
      : status === 'at-risk'
      ? 'text-amber-500 fill-amber-300 animate-pulse'
      : isDark
      ? 'text-amber-300'
      : 'text-orange-500';

  return (
    <button
      type="button"
      data-testid={testId}
      data-streak-status={status}
      data-streak-count={displayStreak}
      onClick={onClick}
      title={labelTitle}
      aria-label={
        status === 'locked'
          ? 'Daily Streak: 0 (Locked until sign in)'
          : `Daily Streak: ${displayStreak} ${displayStreak === 1 ? 'day' : 'days'}`
      }
      className={`inline-flex items-center gap-1.5 h-9 px-2.5 rounded-full text-xs font-black transition-all cursor-pointer border whitespace-nowrap ${containerStyle}`}
    >
      <Flame className={`w-4 h-4 shrink-0 ${flameClass}`} />
      <span className="tabular-nums font-black">{displayStreak}</span>
      {status === 'locked' && (
        <Lock className="w-3 h-3 opacity-75 shrink-0" aria-hidden="true" />
      )}
      {status === 'active-today' && (
        <span
          className={`hidden xl:inline text-[10px] font-extrabold uppercase tracking-wider ${
            isDark ? 'text-amber-300' : 'text-orange-700'
          }`}
        >
          {displayStreak === 1 ? 'day' : 'days'}
        </span>
      )}
    </button>
  );
};
