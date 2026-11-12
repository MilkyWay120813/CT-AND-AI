import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Sliders,
  Gamepad2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  CheckCircle2,
  Layers,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { ALL_MASTERY_BADGES } from '../data/masteryBadges';
import { PART1_CURRICULUM_CHAPTERS, PART2_CURRICULUM_CHAPTERS } from '../data/part1CurriculumData';

interface TotalUniverseProgressBarProps {
  unlockedBadgeIds: string[];
  onSelectChapter?: (chapterId: string) => void;
  onOpen112Hub?: () => void;
}

const TOTAL_MODULES = 112; // 56 Part I + 56 Part II
const TOTAL_SIMULATIONS = 112;

export const TotalUniverseProgressBar: React.FC<TotalUniverseProgressBarProps> = ({
  unlockedBadgeIds,
  onSelectChapter,
  onOpen112Hub,
}) => {
  const [isMatrixExpanded, setIsMatrixExpanded] = useState<boolean>(false);

  const unlockedSet = useMemo(() => new Set(unlockedBadgeIds), [unlockedBadgeIds]);

  // Count Part I completed modules (56 total)
  const part1CompletedBadges = useMemo(() => {
    return ALL_MASTERY_BADGES.filter(
      (b) => b.category === 'part1-module' && unlockedSet.has(b.id)
    );
  }, [unlockedSet]);

  // Count Part II completed modules (56 total)
  const part2CompletedBadges = useMemo(() => {
    return ALL_MASTERY_BADGES.filter(
      (b) => b.category === 'part2-module' && unlockedSet.has(b.id)
    );
  }, [unlockedSet]);

  const totalCompletedModules = part1CompletedBadges.length + part2CompletedBadges.length;
  const progressPercent = Math.min(100, Math.round((totalCompletedModules / TOTAL_MODULES) * 100));

  // Simulations explored/completed: each unlocked module badge signifies a verified completed lab
  // Plus any simulations student interacted with stored in localStorage
  const totalExploredSimulations = useMemo(() => {
    try {
      const stored = localStorage.getItem('ganita_explored_simulations_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const combined = new Set([...parsed, ...part1CompletedBadges.map((b) => b.id), ...part2CompletedBadges.map((b) => b.id)]);
          return Math.min(TOTAL_SIMULATIONS, combined.size);
        }
      }
    } catch {
      // ignore
    }
    return Math.min(TOTAL_SIMULATIONS, totalCompletedModules);
  }, [totalCompletedModules, part1CompletedBadges, part2CompletedBadges]);

  const simPercent = Math.min(100, Math.round((totalExploredSimulations / TOTAL_SIMULATIONS) * 100));

  // Determine universe rank title based on total 112 completion
  const universeRank = useMemo(() => {
    if (totalCompletedModules >= 112) {
      return { title: 'Universal Ganita Sovereign', icon: '👑', color: '#FACC15', glow: 'rgba(250, 204, 21, 0.4)' };
    }
    if (totalCompletedModules >= 84) {
      return { title: 'Grand Mathematics Luminary', icon: '🌟', color: '#A855F7', glow: 'rgba(168, 85, 247, 0.35)' };
    }
    if (totalCompletedModules >= 56) {
      return { title: 'Part I Sovereign & Part II Voyager', icon: '⚡', color: '#38BDF8', glow: 'rgba(56, 189, 248, 0.35)' };
    }
    if (totalCompletedModules >= 28) {
      return { title: 'Mastery Scholar', icon: '🔍', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.35)' };
    }
    return { title: 'Curriculum Explorer', icon: '🌱', color: '#14B8A6', glow: 'rgba(20, 184, 166, 0.35)' };
  }, [totalCompletedModules]);

  // 14 Chapters matrix (7 in Part I + 7 in Part II, each with 8 modules)
  const all14Chapters = useMemo(() => {
    const p1 = PART1_CURRICULUM_CHAPTERS.filter((c) => c.chapterId !== 'ch8-master-quiz').map((c) => ({
      ...c,
      part: 'Part I',
    }));
    const p2 = PART2_CURRICULUM_CHAPTERS.filter((c) => c.chapterId !== 'part2-ch8-master-quiz').map((c) => ({
      ...c,
      part: 'Part II',
    }));
    return [...p1, ...p2];
  }, []);

  return (
    <div
      aria-label="Universal 112 Module & Simulation Progress"
      className="w-full rounded-3xl bg-gradient-to-br from-stone-900 via-[#0C241B] to-stone-900 text-white p-5 sm:p-6 border-2 border-teal-500/40 shadow-xl relative overflow-hidden transition-all duration-300"
    >
      {/* Background Subtle Geometric Atmosphere */}
      <div className="absolute top-0 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-60 h-60 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Row: Title + Stats Pills + Expand Grid Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 shrink-0 transition-transform hover:scale-110"
            style={{
              backgroundColor: `${universeRank.color}20`,
              borderColor: universeRank.color,
              boxShadow: `0 0 16px ${universeRank.glow}`,
            }}
          >
            {universeRank.icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-stone-950"
                style={{ backgroundColor: universeRank.color }}
              >
                {universeRank.title}
              </span>
              <span className="text-xs font-bold text-teal-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Class 8 Ganita Universe</span>
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
              112 Modules & 112 Simulations Mastery Tracker
            </h3>
          </div>
        </div>

        {/* Quick Numerical Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Total Modules Completed Pill */}
          <div className="px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-center">
            <div className="text-[10px] uppercase font-bold text-teal-300 flex items-center justify-center gap-1">
              <Gamepad2 className="w-3 h-3 text-amber-400" />
              <span>Modules Mastered</span>
            </div>
            <div className="text-sm sm:text-base font-black text-amber-300 tabular-nums">
              {totalCompletedModules} / {TOTAL_MODULES}{' '}
              <span className="text-xs font-semibold text-white/70">({progressPercent}%)</span>
            </div>
          </div>

          {/* Simulations Explored Pill */}
          <div className="px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-center">
            <div className="text-[10px] uppercase font-bold text-teal-300 flex items-center justify-center gap-1">
              <Sliders className="w-3 h-3 text-emerald-400" />
              <span>Simulations Explored</span>
            </div>
            <div className="text-sm sm:text-base font-black text-emerald-300 tabular-nums">
              {totalExploredSimulations} / {TOTAL_SIMULATIONS}{' '}
              <span className="text-xs font-semibold text-white/70">({simPercent}%)</span>
            </div>
          </div>

          {/* Toggle 14-Chapter Matrix View */}
          <button
            type="button"
            onClick={() => setIsMatrixExpanded(!isMatrixExpanded)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-400/40 text-xs font-bold transition-all cursor-pointer"
            title={isMatrixExpanded ? 'Collapse 14-chapter matrix' : 'View all 14 chapters matrix'}
          >
            <span>{isMatrixExpanded ? 'Hide 14-Chapter Map' : 'View 14-Chapter Map'}</span>
            {isMatrixExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Dual-Tier Visual Progress Bar */}
      <div className="pt-4 relative z-10 space-y-2">
        <div className="flex flex-wrap items-center justify-between text-xs font-bold text-stone-300">
          <div className="flex items-center gap-3">
            <span className="text-white">Universe Mastery Progress:</span>
            <span className="text-amber-300 tabular-nums font-black text-sm">
              {totalCompletedModules} of {TOTAL_MODULES} Completed ({progressPercent}%)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-white/70">
            <span>
              Part I: <strong className="text-teal-300">{part1CompletedBadges.length}/56</strong>
            </span>
            <span>•</span>
            <span>
              Part II: <strong className="text-amber-300">{part2CompletedBadges.length}/56</strong>
            </span>
          </div>
        </div>

        {/* Outer Progress Track with Milestone Flags */}
        <div className="relative pt-2 pb-1">
          <div className="h-4.5 w-full rounded-full bg-stone-950/80 border border-white/20 overflow-hidden relative p-0.5 shadow-inner">
            {/* The Animated Filling Bar */}
            <div
              className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
              style={{
                width: `${Math.max(2, progressPercent)}%`,
                background:
                  progressPercent > 50
                    ? 'linear-gradient(90deg, #10B981 0%, #06B6D4 45%, #F59E0B 85%, #FACC15 100%)'
                    : 'linear-gradient(90deg, #059669 0%, #10B981 50%, #06B6D4 100%)',
                boxShadow: '0 0 12px rgba(45, 212, 191, 0.5)',
              }}
            >
              {/* Animated Light Sweep Shimmer across the bar */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full animate-[chapterUnderlineSweep_2.4s_infinite]" />
            </div>
          </div>

          {/* Milestone Checkpoints (28, 56, 84, 112) */}
          <div className="absolute top-0 left-0 right-0 h-4.5 pointer-events-none flex justify-between px-1">
            {/* 25% Tick */}
            <div
              className="absolute -top-1 w-0.5 h-6 bg-white/30"
              style={{ left: '25%' }}
              title="Quarter Way (28 Modules)"
            />
            {/* 50% Milestone (Part I Complete) */}
            <div
              className="absolute -top-2 flex flex-col items-center"
              style={{ left: '50%', transform: 'translateX(-50%)' }}
              title="50% Milestone · Part I Complete (56 Modules)"
            >
              <div className="w-1 h-7 bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
              <span className="text-[9px] font-black uppercase text-amber-300 bg-stone-900/90 px-1.5 py-0.2 rounded border border-amber-400/40 mt-1 whitespace-nowrap">
                🏁 56 Halfway
              </span>
            </div>
            {/* 75% Tick */}
            <div
              className="absolute -top-1 w-0.5 h-6 bg-white/30"
              style={{ left: '75%' }}
              title="Three-Quarters (84 Modules)"
            />
            {/* 100% Milestone */}
            <div
              className="absolute -top-2 flex flex-col items-center right-0"
              title="100% Universal Mastery (112 Modules)"
            >
              <div className="w-1.5 h-7 bg-[#FACC15] shadow-[0_0_10px_#FACC15]" />
              <span className="text-[9px] font-black uppercase text-[#FACC15] bg-stone-900/90 px-1.5 py-0.2 rounded border border-[#FACC15]/60 mt-1 whitespace-nowrap">
                🏆 112 All
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded 14-Chapter Interactive Matrix (Visual Grid of all 112 Modules) */}
      {isMatrixExpanded && (
        <div className="mt-7 pt-5 border-t border-white/10 space-y-4 open-from-top">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-black uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Complete 14-Chapter Map · 112 Interactive Modules & Labs</span>
            </div>
            <span className="text-[11px] text-stone-400">
              Green dot = Module & Game Mastered · Click any chapter to jump
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Part I Chapters (1 to 7) */}
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
              <div className="text-xs font-black text-teal-300 uppercase tracking-wide flex items-center justify-between">
                <span>Part I: Chapters 1 to 7 (56 Modules)</span>
                <span className="text-[11px] text-teal-400 font-bold tabular-nums">
                  {part1CompletedBadges.length} / 56 Done
                </span>
              </div>
              <div className="space-y-1.5">
                {all14Chapters.slice(0, 7).map((ch) => {
                  const chBadges = ch.modules.map((m) =>
                    unlockedSet.has(`badge-mod-${ch.chapterId}-${m.moduleCode.replace(/\s+/g, '-').toLowerCase()}`)
                  );
                  const chDone = chBadges.filter(Boolean).length;
                  return (
                    <div
                      key={ch.chapterId}
                      onClick={() => onSelectChapter && onSelectChapter(ch.chapterId)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate font-semibold text-stone-200">
                        Ch {ch.chapterIndex}: {ch.title}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {chBadges.map((done, mIdx) => (
                          <div
                            key={mIdx}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              done ? 'bg-emerald-400 shadow-[0_0_6px_#34D399]' : 'bg-stone-700'
                            }`}
                            title={`M${mIdx + 1}: ${done ? 'Mastered' : 'Not yet mastered'}`}
                          />
                        ))}
                        <span className="text-[10px] text-stone-400 font-bold ml-1 tabular-nums">
                          {chDone}/8
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Part II Chapters (1 to 7) */}
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
              <div className="text-xs font-black text-amber-300 uppercase tracking-wide flex items-center justify-between">
                <span>Part II: Chapters 1 to 7 (56 Modules)</span>
                <span className="text-[11px] text-amber-400 font-bold tabular-nums">
                  {part2CompletedBadges.length} / 56 Done
                </span>
              </div>
              <div className="space-y-1.5">
                {all14Chapters.slice(7, 14).map((ch) => {
                  const chBadges = ch.modules.map((m) =>
                    unlockedSet.has(`badge-mod-${ch.chapterId}-${m.moduleCode.replace(/\s+/g, '-').toLowerCase()}`)
                  );
                  const chDone = chBadges.filter(Boolean).length;
                  return (
                    <div
                      key={ch.chapterId}
                      onClick={() => onSelectChapter && onSelectChapter(ch.chapterId)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate font-semibold text-stone-200">
                        Ch {ch.chapterIndex}: {ch.title}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {chBadges.map((done, mIdx) => (
                          <div
                            key={mIdx}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              done ? 'bg-amber-400 shadow-[0_0_6px_#FBBF24]' : 'bg-stone-700'
                            }`}
                            title={`M${mIdx + 1}: ${done ? 'Mastered' : 'Not yet mastered'}`}
                          />
                        ))}
                        <span className="text-[10px] text-stone-400 font-bold ml-1 tabular-nums">
                          {chDone}/8
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
