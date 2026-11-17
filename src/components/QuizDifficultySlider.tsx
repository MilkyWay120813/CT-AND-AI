import React, { useId } from 'react';
import { Gauge, Sparkles, SlidersHorizontal } from 'lucide-react';
import {
  clampDifficultyLevel,
  QUIZ_DIFFICULTY_META,
  QuizDifficultyLevel,
} from '../utils/quizDifficulty';

export interface QuizDifficultySliderProps {
  difficulty: QuizDifficultyLevel;
  autoMatchProgress: boolean;
  recommendedLevel: QuizDifficultyLevel;
  recommendedReason?: string;
  onSelectDifficulty: (level: QuizDifficultyLevel) => void;
  onToggleAutoMatch: (enabled: boolean) => void;
  variant?: 'card' | 'chalkboard' | 'dark';
  compact?: boolean;
  testIdPrefix?: string;
}

const LEVELS: QuizDifficultyLevel[] = [1, 2, 3, 4];

export const QuizDifficultySlider: React.FC<QuizDifficultySliderProps> = ({
  difficulty,
  autoMatchProgress,
  recommendedLevel,
  recommendedReason,
  onSelectDifficulty,
  onToggleAutoMatch,
  variant = 'card',
  compact = false,
  testIdPrefix = 'quiz-difficulty',
}) => {
  const sliderId = useId();
  const activeMeta = QUIZ_DIFFICULTY_META[difficulty];
  const recMeta = QUIZ_DIFFICULTY_META[recommendedLevel];

  const isDarkSurface = variant === 'dark' || variant === 'chalkboard';

  const containerCls =
    variant === 'dark'
      ? 'rounded-2xl bg-black/25 border border-white/15 text-white'
      : variant === 'chalkboard'
      ? 'rounded-2xl bg-black/25 border border-white/20 text-white'
      : 'rounded-2xl bg-[#FAF6EE] border border-stone-200 text-stone-900';

  const levelPillCls =
    difficulty === 1
      ? isDarkSurface
        ? 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40'
        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
      : difficulty === 2
      ? isDarkSurface
        ? 'bg-teal-400/20 text-teal-200 border-teal-300/40'
        : 'bg-[#CCFBF1] text-[#0F766E] border-[#5EEAD4]'
      : difficulty === 3
      ? isDarkSurface
        ? 'bg-amber-400/20 text-amber-200 border-amber-300/40'
        : 'bg-amber-100 text-amber-950 border-amber-300'
      : isDarkSurface
      ? 'bg-rose-400/25 text-rose-200 border-rose-300/50'
      : 'bg-rose-100 text-rose-950 border-rose-300';

  return (
    <div
      data-testid={`${testIdPrefix}-control`}
      data-difficulty={difficulty}
      data-auto-match={autoMatchProgress ? 'true' : 'false'}
      className={`${containerCls} ${compact ? 'p-3 space-y-2' : 'p-3.5 sm:p-4 space-y-2.5'}`}
    >
      {/* Header Row: Label + Active Tier Badge + Auto-Match Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
              isDarkSurface
                ? 'bg-amber-400/20 text-amber-300'
                : 'bg-[#0F766E]/10 text-[#0F766E]'
            }`}
          >
            {compact ? (
              <SlidersHorizontal className="w-3.5 h-3.5" />
            ) : (
              <Gauge className="w-3.5 h-3.5" />
            )}
          </span>
          <label
            htmlFor={sliderId}
            className={`text-xs font-extrabold uppercase tracking-wider cursor-pointer ${
              isDarkSurface ? 'text-teal-200' : 'text-[#0F766E]'
            }`}
          >
            Quiz Difficulty
          </label>
          <span
            data-testid={`${testIdPrefix}-active-label`}
            className={`px-2 py-0.5 rounded-lg border text-[11px] font-black tabular-nums ${levelPillCls}`}
          >
            {activeMeta.shortLabel}
          </span>
        </div>

        <button
          type="button"
          data-testid={`${testIdPrefix}-automatch-btn`}
          aria-pressed={autoMatchProgress}
          onClick={() => onToggleAutoMatch(!autoMatchProgress)}
          title={`Match complexity automatically to your student progress (Recommended: ${recMeta.label})`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-black transition-all cursor-pointer shrink-0 ${
            autoMatchProgress
              ? isDarkSurface
                ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-2xs'
                : 'bg-[#0F766E] text-white border-[#0F766E] shadow-2xs'
              : isDarkSurface
              ? 'bg-white/10 hover:bg-white/20 text-white/85 border-white/15'
              : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>
            {autoMatchProgress
              ? `Auto-Matched · ${recMeta.label}`
              : `Match Progress (Lvl ${recommendedLevel})`}
          </span>
        </button>
      </div>

      {/* Native Accessible Range Input (1..4) */}
      <div className="space-y-1.5">
        <input
          id={sliderId}
          type="range"
          min={1}
          max={4}
          step={1}
          value={difficulty}
          aria-label="Quiz Difficulty Level"
          data-testid={`${testIdPrefix}-slider`}
          onChange={(e) => onSelectDifficulty(clampDifficultyLevel(e.target.value))}
          className={`w-full h-2 rounded-lg cursor-pointer ${
            isDarkSurface ? 'accent-amber-300' : 'accent-[#0F766E]'
          }`}
        />

        {/* Clickable 4-Step Tick Labels */}
        <div className="grid grid-cols-4 gap-1">
          {LEVELS.map((lvl) => {
            const meta = QUIZ_DIFFICULTY_META[lvl];
            const isSelected = difficulty === lvl;
            return (
              <button
                key={lvl}
                type="button"
                data-testid={`${testIdPrefix}-step-${lvl}`}
                aria-pressed={isSelected}
                onClick={() => onSelectDifficulty(lvl)}
                className={`py-1 px-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-colors cursor-pointer text-center truncate ${
                  isSelected
                    ? isDarkSurface
                      ? 'bg-white/20 text-amber-200 border border-amber-300/50'
                      : 'bg-white text-[#0F766E] border border-[#0F766E] shadow-2xs font-extrabold'
                    : isDarkSurface
                    ? 'text-white/65 hover:text-white hover:bg-white/10 border border-transparent'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 border border-transparent'
                }`}
              >
                {lvl}. {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Concise Explanatory Sub-caption */}
      {!compact && (
        <p
          className={`text-[11px] leading-snug ${
            isDarkSurface ? 'text-white/75' : 'text-stone-600'
          }`}
        >
          {autoMatchProgress && recommendedReason
            ? `${recommendedReason} — ${activeMeta.description}`
            : activeMeta.scalingNote}
        </p>
      )}
    </div>
  );
};
