import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Sliders,
  Gamepad2,
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  Award,
  Layers,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { ALL_MASTERY_BADGES } from '../data/masteryBadges';
import { PART1_CURRICULUM_CHAPTERS, PART2_CURRICULUM_CHAPTERS } from '../data/part1CurriculumData';

interface CircularUniverseProgressProps {
  unlockedBadgeIds: string[];
  activeChapterId?: string;
  onSelectChapter?: (chapterId: string) => void;
  onOpen112Hub?: (tab: 'games' | 'simulations') => void;
}

const TOTAL_MODULES = 112; // 56 Part I + 56 Part II

export const CircularUniverseProgress: React.FC<CircularUniverseProgressProps> = ({
  unlockedBadgeIds,
  activeChapterId,
  onSelectChapter,
  onOpen112Hub,
}) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'part1' | 'part2'>('all');

  const unlockedSet = useMemo(() => new Set(unlockedBadgeIds), [unlockedBadgeIds]);

  const part1CompletedBadges = useMemo(() => {
    return ALL_MASTERY_BADGES.filter(
      (b) => b.category === 'part1-module' && unlockedSet.has(b.id)
    );
  }, [unlockedSet]);

  const part2CompletedBadges = useMemo(() => {
    return ALL_MASTERY_BADGES.filter(
      (b) => b.category === 'part2-module' && unlockedSet.has(b.id)
    );
  }, [unlockedSet]);

  const totalCompleted = part1CompletedBadges.length + part2CompletedBadges.length;
  const progressPercent = Math.min(100, Math.round((totalCompleted / TOTAL_MODULES) * 100));

  // Determine universe rank title
  const universeRank = useMemo(() => {
    if (totalCompleted >= 112) {
      return { title: 'Universal Ganita Sovereign', icon: '👑', color: '#FACC15', step: 4 };
    }
    if (totalCompleted >= 84) {
      return { title: 'Mathematics Luminary', icon: '🌟', color: '#A855F7', step: 3 };
    }
    if (totalCompleted >= 56) {
      return { title: 'Part I Sovereign', icon: '⚡', color: '#38BDF8', step: 2 };
    }
    if (totalCompleted >= 28) {
      return { title: 'Mastery Scholar', icon: '🔍', color: '#F59E0B', step: 1 };
    }
    return { title: 'Curriculum Explorer', icon: '🌱', color: '#14B8A6', step: 0 };
  }, [totalCompleted]);

  // SVG circular ring geometry
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Chapter matrices
  const part1Chapters = useMemo(() => {
    return PART1_CURRICULUM_CHAPTERS.filter((c) => c.chapterId !== 'ch8-master-quiz').map((ch) => {
      const completedCount = ch.modules.filter((m) => {
        const badge = ALL_MASTERY_BADGES.find((b) => b.id.includes(m.moduleCode.replace(' ', '')));
        return badge && unlockedSet.has(badge.id);
      }).length;
      return {
        ...ch,
        completedCount,
        isCurrent: activeChapterId === ch.chapterId,
      };
    });
  }, [activeChapterId, unlockedSet]);

  const part2Chapters = useMemo(() => {
    return PART2_CURRICULUM_CHAPTERS.filter((c) => c.chapterId !== 'part2-ch8-master-quiz').map((ch) => {
      const completedCount = ch.modules.filter((m) => {
        const badge = ALL_MASTERY_BADGES.find((b) => b.id.includes(m.moduleCode.replace(' ', '')));
        return badge && unlockedSet.has(badge.id);
      }).length;
      return {
        ...ch,
        completedCount,
        isCurrent: activeChapterId === ch.chapterId,
      };
    });
  }, [activeChapterId, unlockedSet]);

  return (
    <>
      {/* Sleek Circular Progress Astrolabe Button (Header Element) */}
      <button
        type="button"
        onClick={() => setIsMapModalOpen(true)}
        className="group relative flex items-center gap-2.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white hover:bg-stone-50 border-2 border-stone-200 text-stone-800 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        title="Open 112 Universe Progress Map"
      >
        {/* Circular SVG Progress Dial */}
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 54 54">
            {/* Background ring */}
            <circle
              cx="27"
              cy="27"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              className="text-stone-200"
              fill="transparent"
            />
            {/* 14 Chapter Tick Notches along perimeter */}
            {Array.from({ length: 14 }).map((_, i) => {
              const angle = (i * 360) / 14;
              const rad = (angle * Math.PI) / 180;
              const x1 = 27 + (radius + 2.5) * Math.cos(rad);
              const y1 = 27 + (radius + 2.5) * Math.sin(rad);
              const x2 = 27 + (radius - 2.5) * Math.cos(rad);
              const y2 = 27 + (radius - 2.5) * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="1.2"
                  className={i < (totalCompleted / 8) ? 'text-teal-500' : 'text-stone-300'}
                  opacity={0.8}
                />
              );
            })}
            {/* Animated Active Progress Stroke */}
            <circle
              cx="27"
              cy="27"
              r={radius}
              stroke="url(#universeRingGrad)"
              strokeWidth="4.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="universeRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00B4A7" />
                <stop offset="60%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central Hub Counter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] sm:text-[11px] font-black leading-tight text-stone-900 tabular-nums">
              {totalCompleted}
            </span>
            <span className="text-[8px] font-bold text-stone-500 leading-none">
              /112
            </span>
          </div>

          {/* Glowing pulse ring if at least one module completed */}
          {totalCompleted > 0 && (
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-teal-400 ring-2 ring-white animate-pulse" />
          )}
        </div>

        {/* Text Context (Hidden on ultra-narrow, clean and readable on normal) */}
        <div className="text-left hidden md:block pr-1">
          <div className="flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase text-teal-700">
            <span>{universeRank.icon}</span>
            <span>112 Progress</span>
            <span className="bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded-full text-[9px] font-bold">
              {progressPercent}%
            </span>
          </div>
          <div className="text-xs font-black text-stone-900 tracking-tight flex items-center gap-1.5">
            <span>Part I: {part1CompletedBadges.length}/56</span>
            <span className="text-stone-300">·</span>
            <span>Part II: {part2CompletedBadges.length}/56</span>
          </div>
        </div>

        {/* Mobile Minimal Badge */}
        <div className="md:hidden text-left pr-0.5">
          <div className="text-[10px] font-black text-teal-700">112</div>
          <div className="text-[11px] font-black text-stone-900">{progressPercent}%</div>
        </div>
      </button>

      {/* 112 Universe Progress Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl border-2 border-stone-200 shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-gradient-to-r from-teal-900 via-[#102B22] to-stone-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-2xl shadow-inner">
                  {universeRank.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-teal-300">
                      Class 8 Ganita Universe
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-stone-950">
                      112 Modules · 112 Sims · 112 Games
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                    <span>Universal Mastery Map</span>
                    <span className="text-sm font-bold text-teal-200">
                      ({totalCompleted} of 112 Completed · {progressPercent}%)
                    </span>
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions & Milestones Banner */}
            <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
              {/* Filter Tabs */}
              <div className="inline-flex items-center p-1 rounded-xl bg-stone-200/80 border border-stone-300">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  All 14 Chapters ({totalCompleted}/112)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('part1')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'part1'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  Part I ({part1CompletedBadges.length}/56)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('part2')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'part2'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  Part II ({part2CompletedBadges.length}/56)
                </button>
              </div>

              {/* Fast Launch 112 Arcade & Sim buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMapModalOpen(false);
                    onOpen112Hub?.('games');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black transition-all cursor-pointer shadow-xs"
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Explore 112 Games</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMapModalOpen(false);
                    onOpen112Hub?.('simulations');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black transition-all cursor-pointer shadow-xs"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Explore 112 Sims</span>
                </button>
              </div>
            </div>

            {/* Scrollable Chapters Matrix */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Part I Section */}
              {(activeTab === 'all' || activeTab === 'part1') && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                      <h4 className="text-sm font-black uppercase tracking-wider text-stone-800">
                        Part I: Chapters 1 to 7 (56 Modules & Sims)
                      </h4>
                    </div>
                    <span className="text-xs font-extrabold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                      {part1CompletedBadges.length} / 56 Mastered
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {part1Chapters.map((ch) => (
                      <div
                        key={ch.chapterId}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          ch.isCurrent
                            ? 'bg-teal-50/70 border-teal-400 ring-2 ring-teal-400/30 shadow-xs'
                            : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-[10px] font-black uppercase text-teal-700">
                              Chapter {ch.chapterIndex}
                            </span>
                            <h5 className="text-xs font-black text-stone-900 leading-tight">
                              {ch.title}
                            </h5>
                          </div>
                          <span className="text-[11px] font-black tabular-nums px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                            {ch.completedCount}/8
                          </span>
                        </div>

                        {/* 8 Module Dots Strip */}
                        <div className="flex items-center gap-1.5 my-2.5">
                          {Array.from({ length: 8 }).map((_, idx) => {
                            const isFilled = idx < ch.completedCount;
                            return (
                              <div
                                key={idx}
                                className={`flex-1 h-2 rounded-full transition-all ${
                                  isFilled
                                    ? 'bg-teal-500 shadow-[0_0_6px_rgba(20,184,166,0.6)]'
                                    : 'bg-stone-200'
                                }`}
                                title={`Module ${idx + 1}: ${isFilled ? 'Mastered' : 'Pending'}`}
                              />
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsMapModalOpen(false);
                            onSelectChapter?.(ch.chapterId);
                          }}
                          className="w-full mt-2 inline-flex items-center justify-center gap-1 py-1 px-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-black transition-colors cursor-pointer"
                        >
                          <span>{ch.isCurrent ? 'Current Chapter' : 'Open Chapter'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Part II Section */}
              {(activeTab === 'all' || activeTab === 'part2') && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <h4 className="text-sm font-black uppercase tracking-wider text-stone-800">
                        Part II: Chapters 1 to 7 (56 Modules & Sims)
                      </h4>
                    </div>
                    <span className="text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      {part2CompletedBadges.length} / 56 Mastered
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {part2Chapters.map((ch) => (
                      <div
                        key={ch.chapterId}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          ch.isCurrent
                            ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/30 shadow-xs'
                            : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-[10px] font-black uppercase text-amber-700">
                              Part II · Ch {ch.chapterIndex}
                            </span>
                            <h5 className="text-xs font-black text-stone-900 leading-tight">
                              {ch.title}
                            </h5>
                          </div>
                          <span className="text-[11px] font-black tabular-nums px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                            {ch.completedCount}/8
                          </span>
                        </div>

                        {/* 8 Module Dots Strip */}
                        <div className="flex items-center gap-1.5 my-2.5">
                          {Array.from({ length: 8 }).map((_, idx) => {
                            const isFilled = idx < ch.completedCount;
                            return (
                              <div
                                key={idx}
                                className={`flex-1 h-2 rounded-full transition-all ${
                                  isFilled
                                    ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                                    : 'bg-stone-200'
                                }`}
                                title={`Module ${idx + 1}: ${isFilled ? 'Mastered' : 'Pending'}`}
                              />
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsMapModalOpen(false);
                            onSelectChapter?.(ch.chapterId);
                          }}
                          className="w-full mt-2 inline-flex items-center justify-center gap-1 py-1 px-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-black transition-colors cursor-pointer"
                        >
                          <span>{ch.isCurrent ? 'Current Chapter' : 'Open Chapter'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Milestone Guide */}
            <div className="px-6 py-3 border-t border-stone-200 bg-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
              <div className="flex items-center gap-3">
                <span className="font-bold">Universe Milestones:</span>
                <span className={totalCompleted >= 28 ? 'text-teal-700 font-black' : 'opacity-60'}>
                  28 (Scholar)
                </span>
                <span>•</span>
                <span className={totalCompleted >= 56 ? 'text-teal-700 font-black' : 'opacity-60'}>
                  56 (Part I Halfway Master)
                </span>
                <span>•</span>
                <span className={totalCompleted >= 84 ? 'text-teal-700 font-black' : 'opacity-60'}>
                  84 (Luminary)
                </span>
                <span>•</span>
                <span className={totalCompleted >= 112 ? 'text-amber-600 font-black' : 'opacity-60'}>
                  112 (Universal Sovereign 👑)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold cursor-pointer"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
