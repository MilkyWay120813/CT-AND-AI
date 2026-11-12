import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Flame,
  Zap,
  CheckCircle2,
  Lock,
  Gamepad2,
  ArrowRight,
} from 'lucide-react';
import { ALL_MASTERY_BADGES, MasteryBadgeDefinition } from '../data/masteryBadges';
import { formatMathText } from '../utils/formatMath';

interface ChapterLevelProgressProps {
  chapterId: string;
  chapterTitle: string;
  chapterIndex: number;
  chapterGamePoints: number;
  unlockedBadgeIds: string[];
  onSelectModule?: (moduleCode: string) => void;
  onOpenTrophyRoom?: () => void;
}

interface ChapterRankTier {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  badgeHex: string;
  icon: string;
  perk: string;
}

const CHAPTER_RANKS: ChapterRankTier[] = [
  {
    level: 1,
    title: 'Chalkboard Initiate',
    minPoints: 0,
    maxPoints: 100,
    badgeHex: '#14B8A6',
    icon: '✏️',
    perk: 'Began exploring the chapter mechanics.',
  },
  {
    level: 2,
    title: 'Pattern Apprentice',
    minPoints: 100,
    maxPoints: 250,
    badgeHex: '#38BDF8',
    icon: '🔍',
    perk: 'Cracking games and discovering chapter rhythms.',
  },
  {
    level: 3,
    title: 'Lab Tactician',
    minPoints: 250,
    maxPoints: 450,
    badgeHex: '#F59E0B',
    icon: '⚡',
    perk: 'High-score combos and game simulations unlocked.',
  },
  {
    level: 4,
    title: 'Algebraic Alchemist',
    minPoints: 450,
    maxPoints: 700,
    badgeHex: '#A855F7',
    icon: '🧙‍♂️',
    perk: 'Mastering multiple modules and fast-paced game boards.',
  },
  {
    level: 5,
    title: 'Supreme Chapter Sovereign',
    minPoints: 700,
    maxPoints: 1000,
    badgeHex: '#FACC15',
    icon: '👑',
    perk: 'Complete chapter mastery achieved across all 8 modules!',
  },
];

export const ChapterLevelProgress: React.FC<ChapterLevelProgressProps> = ({
  chapterId,
  chapterTitle,
  chapterIndex,
  chapterGamePoints,
  unlockedBadgeIds,
  onSelectModule,
  onOpenTrophyRoom,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Badges strictly belonging to this chapter
  const chapterBadges = useMemo(() => {
    return ALL_MASTERY_BADGES.filter((b) => b.chapterId === chapterId);
  }, [chapterId]);

  const unlockedInChapterCount = useMemo(() => {
    const set = new Set(unlockedBadgeIds);
    return chapterBadges.filter((b) => set.has(b.id)).length;
  }, [chapterBadges, unlockedBadgeIds]);

  // Determine current chapter rank
  const currentRank = useMemo(() => {
    for (let i = CHAPTER_RANKS.length - 1; i >= 0; i--) {
      if (chapterGamePoints >= CHAPTER_RANKS[i].minPoints) {
        return CHAPTER_RANKS[i];
      }
    }
    return CHAPTER_RANKS[0];
  }, [chapterGamePoints]);

  const nextRank = useMemo(() => {
    return CHAPTER_RANKS.find((r) => r.level === currentRank.level + 1) || null;
  }, [currentRank]);

  // Calculate percentage toward next level
  const levelProgressPercent = useMemo(() => {
    if (!nextRank) return 100;
    const range = nextRank.minPoints - currentRank.minPoints;
    const progress = chapterGamePoints - currentRank.minPoints;
    return Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
  }, [chapterGamePoints, currentRank, nextRank]);

  return (
    <section
      aria-label="Chapter Level & Badge Progress"
      className="w-full rounded-3xl bg-gradient-to-r from-stone-900 via-[#0A261D] to-stone-900 text-white p-5 sm:p-6 border-2 border-teal-500/40 shadow-md relative overflow-hidden"
    >
      {/* Background glow accent */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#00B4A7]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row: Current Level Rank + Points + Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div
            className="w-13 h-13 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 shrink-0 animate-pulse"
            style={{
              backgroundColor: `${currentRank.badgeHex}25`,
              borderColor: currentRank.badgeHex,
            }}
          >
            {currentRank.icon}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-stone-950"
                style={{ backgroundColor: currentRank.badgeHex }}
              >
                Level {currentRank.level} · {currentRank.title}
              </span>
              <span className="text-xs font-bold text-teal-300">
                Chapter {chapterIndex} Mastery Rank
              </span>
            </div>
            <div className="text-base sm:text-lg font-black text-white mt-1">
              {formatMathText(chapterTitle)}
            </div>
          </div>
        </div>

        {/* Right Info: Game Points + Badges Count + Expansion Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-center">
            <div className="text-[10px] uppercase font-bold text-teal-300 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Chapter Game Points</span>
            </div>
            <div className="text-sm sm:text-base font-black text-amber-300 tabular-nums">
              {chapterGamePoints} pts
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-center">
            <div className="text-[10px] uppercase font-bold text-teal-300 flex items-center justify-center gap-1">
              <Award className="w-3 h-3 text-emerald-400" />
              <span>Badges Mastered</span>
            </div>
            <div className="text-sm sm:text-base font-black text-emerald-300 tabular-nums">
              {unlockedInChapterCount} / {chapterBadges.length}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
            title={isExpanded ? 'Collapse Badges' : 'Expand Badges'}
          >
            <span>{isExpanded ? 'Hide Badges' : 'View Badges'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Level XP Progress Bar */}
      <div className="mt-4 pt-4 border-t border-white/10 relative z-10 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-stone-300">
          <span>
            Progress to Level {currentRank.level + 1}
            {nextRank ? ` (${nextRank.title})` : ' (MAX LEVEL)'}:
          </span>
          <span className="text-amber-300 tabular-nums font-black">
            {nextRank
              ? `${chapterGamePoints} / ${nextRank.minPoints} pts (${levelProgressPercent}%)`
              : '🌟 Chapter Sovereign Grandmaster!'}
          </span>
        </div>

        <div className="h-3 w-full rounded-full bg-stone-800 border border-stone-700 overflow-hidden relative p-0.5">
          <div
            className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
            style={{
              width: `${levelProgressPercent}%`,
              background: `linear-gradient(90deg, #00B4A7 0%, ${currentRank.badgeHex} 100%)`,
            }}
          >
            {/* Shimmer sweep animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Animated Badges Grid (Fills up based on points earned through creative games!) */}
      {isExpanded && chapterBadges.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/10 relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-extrabold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-amber-300" />
              <span>Chapter Module Badges · Liquid Fill Driven by Game Points</span>
            </span>
            <span className="text-stone-400">
              Score in Slide 4 Mini-Games & complete Slide 5 Quizzes to fill badges to 100%!
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {chapterBadges.map((badge, bIdx) => {
              const isUnlocked = unlockedBadgeIds.includes(badge.id);
              // Each badge requires 80 game points per module index to fill up or is 100% if unlocked
              const pointsNeeded = 80;
              const pointsEarnedForThisBadge = Math.min(
                pointsNeeded,
                Math.max(0, chapterGamePoints - bIdx * 60)
              );
              const fillPercent = isUnlocked
                ? 100
                : Math.min(100, Math.round((pointsEarnedForThisBadge / pointsNeeded) * 100));

              return (
                <div
                  key={badge.id}
                  onClick={() => {
                    if (badge.moduleCode && onSelectModule) {
                      onSelectModule(badge.moduleCode);
                    }
                  }}
                  title={`${badge.title} (${isUnlocked ? 'Mastered!' : `${fillPercent}% Filled`})`}
                  className={`group relative rounded-2xl border-2 p-3 text-center transition-all cursor-pointer overflow-hidden ${
                    isUnlocked
                      ? 'border-amber-400 bg-amber-400/10 shadow-lg scale-102 hover:scale-105'
                      : fillPercent > 50
                      ? 'border-teal-400/60 bg-stone-900 hover:border-teal-300 hover:scale-105'
                      : 'border-stone-700/80 bg-stone-900/80 hover:border-stone-500'
                  }`}
                >
                  {/* Liquid fill gauge background */}
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all duration-700 pointer-events-none"
                    style={{
                      height: `${fillPercent}%`,
                      background: isUnlocked
                        ? 'linear-gradient(to top, rgba(245, 158, 11, 0.35), rgba(245, 158, 11, 0.1))'
                        : 'linear-gradient(to top, rgba(0, 180, 167, 0.3), rgba(0, 180, 167, 0.05))',
                    }}
                  />

                  {/* Emblem Glyph & Module Code */}
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase text-teal-300/80">
                      M{bIdx + 1}
                    </span>

                    <div
                      className={`w-10 h-10 rounded-xl my-1 flex items-center justify-center text-xl shadow-xs transition-transform group-hover:scale-110 ${
                        isUnlocked
                          ? 'bg-amber-400 text-stone-950 border border-amber-300 ring-2 ring-amber-300/50'
                          : fillPercent >= 50
                          ? 'bg-teal-500/20 text-teal-200 border border-teal-400/40'
                          : 'bg-stone-800 text-stone-400 border border-stone-700'
                      }`}
                    >
                      {badge.emblemGlyph}
                    </div>

                    <div className="text-[11px] font-bold text-white truncate w-full mt-0.5">
                      {badge.title.split(' ')[0]}
                    </div>

                    {/* Fill percentage / status */}
                    <div className="mt-1">
                      {isUnlocked ? (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-amber-300 uppercase">
                          <CheckCircle2 className="w-2.5 h-2.5" /> 100%
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-stone-400 tabular-nums">
                          {fillPercent}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
