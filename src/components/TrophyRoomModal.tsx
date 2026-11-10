import React, { useState, useMemo } from 'react';
import {
  Trophy,
  X,
  Lock,
  Unlock,
  Key,
  Sparkles,
  Award,
  Flame,
  ShieldAlert,
  CheckCircle2,
  Compass,
  RotateCcw,
} from 'lucide-react';
import {
  ALL_MASTERY_BADGES,
  MASTERY_POINT_MILESTONES,
  PREREQUISITE_BADGE_IDS,
  BOSS_BADGE_ID,
  MasteryBadgeDefinition,
} from '../data/masteryBadges';

interface TrophyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedBadgeIds: string[];
  masteryPoints: number;
  onResetBadges: () => void;
  onOpenBossBattle: () => void;
  onJumpToBadgeSource?: (badge: MasteryBadgeDefinition) => void;
}

export const TrophyRoomModal: React.FC<TrophyRoomModalProps> = ({
  isOpen,
  onClose,
  unlockedBadgeIds,
  masteryPoints,
  onResetBadges,
  onOpenBossBattle,
  onJumpToBadgeSource,
}) => {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'part1-module' | 'part2-module' | 'mastery-quiz' | 'cellar-boss' | 'unlocked'
  >('all');

  const unlockedSet = useMemo(() => new Set(unlockedBadgeIds), [unlockedBadgeIds]);

  const prereqUnlockedCount = useMemo(
    () => PREREQUISITE_BADGE_IDS.filter((id) => unlockedSet.has(id)).length,
    [unlockedSet]
  );

  const isCellarKeyUnlocked =
    PREREQUISITE_BADGE_IDS.length === 114 &&
    prereqUnlockedCount === PREREQUISITE_BADGE_IDS.length;
  const isBossDefeated = unlockedSet.has(BOSS_BADGE_ID);

  const filteredBadges = useMemo(() => {
    return ALL_MASTERY_BADGES.filter((b) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'unlocked') return unlockedSet.has(b.id);
      return b.category === activeFilter;
    });
  }, [activeFilter, unlockedSet]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl border-4 border-[#FACC15]/50 bg-[#14281D] text-[#FFFDF5] shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Top Royal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#FFFDF5]/15 bg-[#0D1F16] px-6 py-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#FACC15]/60 bg-[#FACC15]/15 text-[#FACC15] shadow-md">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#FACC15] font-hand">
                  Ganita Prakash Hall of Champions
                </span>
                <span className="rounded bg-[#FACC15]/20 px-2 py-0.5 text-xs font-bold text-[#FACC15] border border-[#FACC15]/40 font-chalk">
                  {unlockedBadgeIds.length} / 115 Badges
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFDF5] font-display tracking-wide">
                Dedicated Mastery Trophy Room
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border-2 border-[#38BDF8]/40 bg-[#38BDF8]/10 px-3.5 py-1.5 text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#BAE6FD] font-hand">
                Mastery Score
              </div>
              <div className="text-lg font-bold text-[#38BDF8] font-chalk">
                {masteryPoints.toLocaleString()} pts
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#FFFDF5]/25 bg-black/40 text-[#FFFDF5] hover:border-[#FACC15] hover:text-[#FACC15] transition-colors cursor-pointer"
              title="Close Trophy Room"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Section 1: Cellar Key & 114-Badge Vault Status */}
          <div
            className={`relative overflow-hidden rounded-2xl border-2 p-5 transition-all ${
              isCellarKeyUnlocked
                ? 'border-[#FACC15] bg-gradient-to-r from-[#2D1B06] via-[#1C2A1E] to-[#2D1B06] shadow-[0_0_35px_rgba(250,204,21,0.2)]'
                : 'border-[#F87171]/50 bg-gradient-to-r from-[#1F1215] via-[#17221B] to-[#1F1215]'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 shadow-lg ${
                    isCellarKeyUnlocked
                      ? 'border-[#FACC15] bg-[#FACC15]/20 text-[#FACC15]'
                      : 'border-[#F87171]/60 bg-black/50 text-[#F87171]'
                  }`}
                >
                  {isCellarKeyUnlocked ? (
                    <Key className="h-8 w-8 animate-pulse" />
                  ) : (
                    <Lock className="h-8 w-8" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider font-hand ${
                        isCellarKeyUnlocked
                          ? 'bg-[#4ADE80]/20 text-[#86EFAC] border border-[#4ADE80]/50'
                          : 'bg-[#F87171]/20 text-[#FCA5A5] border border-[#F87171]/50'
                      }`}
                    >
                      {isCellarKeyUnlocked
                        ? 'Golden Cellar Key Forged (114 / 114)'
                        : `Chained Cellar Vault (${prereqUnlockedCount} / 114 Prerequisite Badges)`}
                    </span>
                    {isBossDefeated && (
                      <span className="rounded bg-[#FACC15] px-2.5 py-0.5 text-xs font-bold text-[#1C1917] font-hand">
                        👑 Badge #115 Acquired!
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1.5 text-xl font-bold text-[#FFFDF5] font-chalk">
                    {isCellarKeyUnlocked
                      ? 'The Chains Are Shattered! The Underground Cellar Awaits.'
                      : 'Acquire All 114 Badges (112 Modules + 2 30Q Mastery Quizzes) to Forge the Cellar Key'}
                  </h3>
                  <p className="mt-1 text-sm text-[#FFFDF5]/80 font-hand max-w-2xl">
                    112 badges are earned on the last slide ("The Game") of every module across Part I & Part II, plus 2 Grand Badges from the 30-question Part I & Part II Mastery Quizzes. Once all 114 are earned, the Cellar Key unlocks the chained 3D Final Boss Battle for Badge #115!
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {!isCellarKeyUnlocked ? (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-[#FACC15] bg-[#FACC15]/20 px-4 py-2.5 text-xs font-bold text-[#FACC15] hover:bg-[#FACC15] hover:text-[#1C1917] transition-all cursor-pointer font-hand shadow-md"
                  >
                    <Key className="h-4 w-4" />
                    Earn all 114 badges to unlock the Cellar Key
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenBossBattle();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-[#FACC15] bg-[#FACC15] px-5 py-3 text-sm font-bold text-[#1C1917] hover:bg-[#FDE047] transition-all cursor-pointer font-chalk shadow-[0_0_25px_rgba(250,204,21,0.5)]"
                  >
                    <Flame className="h-5 w-5 fill-[#B91C1C] text-[#B91C1C]" />
                    Enter 3D Cellar Boss Battle (30Q)
                  </button>
                )}

                {unlockedBadgeIds.length > 0 && (
                  <button
                    type="button"
                    onClick={onResetBadges}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#FFFDF5]/25 bg-black/30 px-3 py-2.5 text-xs font-bold text-[#FFFDF5]/70 hover:border-[#F87171] hover:text-[#FCA5A5] transition-colors cursor-pointer font-hand"
                    title="Reset unlocked badges"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar towards 114 key */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#FFFDF5]/80 font-hand mb-1">
                <span>Cellar Key Forging Progress</span>
                <span className="text-[#FACC15] font-chalk">{prereqUnlockedCount} / 114 Badges</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-black/50 border border-[#FFFDF5]/15">
                <div
                  className="h-full bg-gradient-to-r from-[#14B8A6] via-[#F59E0B] to-[#FACC15] transition-all duration-500"
                  style={{ width: `${Math.min(100, (prereqUnlockedCount / 114) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Mastery Point Milestone Ranks (Quadratic Wizard, Algebra Ace, etc.) */}
          <div className="rounded-2xl border-2 border-[#FFFDF5]/15 bg-black/25 p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#FACC15]" />
                <h3 className="text-lg font-bold text-[#FFFDF5] font-chalk">
                  Mastery Point Milestone Ranks
                </h3>
              </div>
              <span className="text-xs text-[#FFFDF5]/70 font-hand">
                Unlocked automatically as your Mastery Points climb
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {MASTERY_POINT_MILESTONES.map((m) => {
                const reached = masteryPoints >= m.minPoints;
                return (
                  <div
                    key={m.id}
                    className={`rounded-xl border-2 p-3.5 transition-all ${
                      reached
                        ? 'border-[#FACC15]/60 bg-[#1B3B2B]/80 shadow-md'
                        : 'border-[#FFFDF5]/10 bg-black/30 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-2xl">{m.glyph}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-[11px] font-bold font-chalk ${
                          reached
                            ? 'bg-[#4ADE80]/20 text-[#86EFAC] border border-[#4ADE80]/40'
                            : 'bg-white/10 text-[#FFFDF5]/60'
                        }`}
                      >
                        {m.minPoints} pts {reached ? '✓' : '🔒'}
                      </span>
                    </div>
                    <div className="mt-2 text-base font-bold text-[#FFFDF5] font-chalk">
                      {m.title}
                    </div>
                    <p className="mt-1 text-xs text-[#FFFDF5]/75 font-hand leading-snug">
                      {m.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Filter Tabs for the 115 Badges */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: `All Badges (115)` },
                  {
                    id: 'part1-module',
                    label: `Part I Modules (${ALL_MASTERY_BADGES.filter((b) => b.category === 'part1-module' && unlockedSet.has(b.id)).length}/56)`,
                  },
                  {
                    id: 'part2-module',
                    label: `Part II Modules (${ALL_MASTERY_BADGES.filter((b) => b.category === 'part2-module' && unlockedSet.has(b.id)).length}/56)`,
                  },
                  {
                    id: 'mastery-quiz',
                    label: `30Q Mastery Quizzes (${ALL_MASTERY_BADGES.filter((b) => b.category === 'mastery-quiz' && unlockedSet.has(b.id)).length}/2)`,
                  },
                  {
                    id: 'cellar-boss',
                    label: `3D Cellar Boss (${isBossDefeated ? 1 : 0}/1)`,
                  },
                  {
                    id: 'unlocked',
                    label: `Unlocked (${unlockedBadgeIds.length})`,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer font-hand border-2 ${
                      activeFilter === tab.id
                        ? 'border-[#FACC15] bg-[#FACC15] text-[#1C1917] shadow-sm'
                        : 'border-[#FFFDF5]/15 bg-black/30 text-[#FFFDF5]/80 hover:border-[#FFFDF5]/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 115 Badge Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredBadges.map((badge) => {
                const isUnlocked = unlockedSet.has(badge.id);
                const isSpecial =
                  badge.category === 'mastery-quiz' || badge.category === 'cellar-boss';

                return (
                  <div
                    key={badge.id}
                    onClick={() => {
                      if (badge.category === 'cellar-boss') {
                        if (isCellarKeyUnlocked) {
                          onClose();
                          onOpenBossBattle();
                        }
                      } else if (onJumpToBadgeSource) {
                        onJumpToBadgeSource(badge);
                        onClose();
                      }
                    }}
                    className={`group relative flex flex-col justify-between rounded-xl border-2 p-3.5 transition-all cursor-pointer ${
                      isUnlocked
                        ? isSpecial
                          ? 'border-[#FACC15] bg-gradient-to-br from-[#2B2108] to-[#172E21] shadow-[0_0_20px_rgba(250,204,21,0.2)]'
                          : 'border-[#4ADE80]/60 bg-[#1B3B2B]/80 hover:border-[#FACC15]'
                        : 'border-[#FFFDF5]/15 bg-black/35 opacity-75 hover:opacity-100 hover:border-[#FFFDF5]/35'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FACC15] border border-[#FFFDF5]/15 font-chalk">
                          Badge #{badge.badgeNumber}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold font-hand ${
                            isUnlocked
                              ? 'bg-[#4ADE80]/20 text-[#86EFAC] border border-[#4ADE80]/40'
                              : 'bg-white/10 text-[#FFFDF5]/60'
                          }`}
                        >
                          {isUnlocked ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" /> Unlocked
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3" /> Locked
                            </>
                          )}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xl shadow-inner ${
                            isUnlocked
                              ? 'border-[#FACC15]/60 bg-[#FACC15]/15'
                              : 'border-[#FFFDF5]/15 bg-black/40 grayscale'
                          }`}
                        >
                          {badge.emblemGlyph}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-[#FFFDF5] font-chalk truncate">
                            {badge.title}
                          </h4>
                          <p className="text-[11px] text-[#FFFDF5]/70 font-hand line-clamp-2 leading-tight mt-0.5">
                            {badge.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#FFFDF5]/10 pt-2 text-[10px] font-bold text-[#FFFDF5]/65 font-hand">
                      <span>+{badge.pointsReward} Mastery Pts</span>
                      <span className="text-[#FACC15] group-hover:underline">
                        {badge.category === 'cellar-boss'
                          ? isCellarKeyUnlocked
                            ? 'Fight 3D Boss →'
                            : 'Requires 114 Key'
                          : badge.category === 'mastery-quiz'
                            ? 'Open 30Q Quiz →'
                            : 'Go to Module →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
