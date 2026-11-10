import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Trophy, Lock, Key, Award, Skull, Sparkles } from 'lucide-react';
import { GANITA_CHAPTERS, getChapterById } from './data/presets';
import {
  ChapterId,
  GanitaChapter,
  MathHomeworkSolution,
  StudentDiagnosticProfile,
} from './types/math';
import { DiagnosticQuestionnaire } from './components/DiagnosticQuestionnaire';
import { Part1ChapterHub } from './components/Part1ChapterHub';
import { GeniusBarDrawer } from './components/GeniusBarDrawer';
import { TrophyRoomModal } from './components/TrophyRoomModal';
import { CellarBossBattle3D } from './components/CellarBossBattle3D';
import {
  ALL_MASTERY_BADGES,
  MASTERY_POINT_MILESTONES,
  PREREQUISITE_BADGE_IDS,
  BOSS_BADGE_ID,
  MasteryBadgeDefinition,
} from './data/masteryBadges';

const BADGE_STORAGE_KEY = 'ganita_prakash_unlocked_badges_v1';
const POINTS_STORAGE_KEY = 'ganita_prakash_mastery_points_v1';

export default function App() {
  const [showQuestionnaire, setShowQuestionnaire] = useState<boolean>(true);
  const [questionnaireStage, setQuestionnaireStage] = useState<
    'welcome' | 'chapters' | 'segments'
  >('welcome');

  const [activeChapterId, setActiveChapterId] = useState<string>(
    GANITA_CHAPTERS[0].id
  );

  const [diagnosticProfile, setDiagnosticProfile] =
    useState<StudentDiagnosticProfile>({
      completedQuestionnaire: true,
      chapterId: GANITA_CHAPTERS[0].id,
      segmentId: GANITA_CHAPTERS[0].segments[0].id,
      difficultyFocus: 'intuition',
    });

  const [customSolutionsByChapter, setCustomSolutionsByChapter] = useState<
    Record<string, MathHomeworkSolution[]>
  >({});
  const [activeSolution, setActiveSolution] = useState<MathHomeworkSolution>(
    GANITA_CHAPTERS[0].segments[0].featuredSolution
  );
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [masteryPoints, setMasteryPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(POINTS_STORAGE_KEY);
      return saved ? Math.max(120, Number(saved)) : 120;
    } catch {
      return 120;
    }
  });

  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(BADGE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  const [isTrophyRoomOpen, setIsTrophyRoomOpen] = useState<boolean>(false);
  const [isBossBattleOpen, setIsBossBattleOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(unlockedBadgeIds));
    } catch {
      // ignore storage errors
    }
  }, [unlockedBadgeIds]);

  useEffect(() => {
    try {
      localStorage.setItem(POINTS_STORAGE_KEY, String(masteryPoints));
    } catch {
      // ignore storage errors
    }
  }, [masteryPoints]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [showQuestionnaire, activeChapterId]);

  const unlockedSet = useMemo(() => new Set(unlockedBadgeIds), [unlockedBadgeIds]);

  const prereqUnlockedCount = useMemo(
    () => PREREQUISITE_BADGE_IDS.filter((id) => unlockedSet.has(id)).length,
    [unlockedSet]
  );

  const isCellarKeyUnlocked =
    PREREQUISITE_BADGE_IDS.length === 114 &&
    prereqUnlockedCount === PREREQUISITE_BADGE_IDS.length;
  const isBossDefeated = unlockedSet.has(BOSS_BADGE_ID);

  const handleUnlockBadge = useCallback((badgeId: string, rewardPoints: number) => {
    setUnlockedBadgeIds((prev) => {
      if (prev.includes(badgeId)) return prev;
      setMasteryPoints((pts) => pts + rewardPoints);
      return [...prev, badgeId];
    });
  }, []);

  const handleResetBadges = useCallback(() => {
    setUnlockedBadgeIds([]);
    setMasteryPoints(120);
  }, []);

  const activeChapter: GanitaChapter = useMemo(
    () => getChapterById(diagnosticProfile.chapterId),
    [diagnosticProfile.chapterId]
  );

  const activeSegment = useMemo(
    () =>
      activeChapter.segments.find(
        (s) => s.id === diagnosticProfile.segmentId
      ) || activeChapter.segments[0],
    [activeChapter, diagnosticProfile.segmentId]
  );

  const chapterSolutions = useMemo(() => {
    const segmentProblems = activeChapter.segments.flatMap((s) => [
      s.featuredSolution,
      ...s.extraProblems,
    ]);
    const customList = customSolutionsByChapter[activeChapter.id] || [];
    return [...customList, ...segmentProblems];
  }, [activeChapter, customSolutionsByChapter]);

  const handleDiagnosticComplete = (profile: StudentDiagnosticProfile) => {
    const ch = getChapterById(profile.chapterId);
    const seg =
      ch.segments.find((s) => s.id === profile.segmentId) || ch.segments[0];
    setDiagnosticProfile(profile);
    setActiveChapterId(profile.chapterId);
    setActiveSolution(seg.featuredSolution);
    setActiveStepIndex(0);
    setErrorMsg(null);
    setShowQuestionnaire(false);
  };

  const handleOpenChapterPicker = () => {
    setQuestionnaireStage('chapters');
    setShowQuestionnaire(true);
  };

  const handleSwitchChapterById = (chapterId: string) => {
    setActiveChapterId(chapterId);
    setShowQuestionnaire(false);
    if (chapterId !== 'ch8-master-quiz' && chapterId !== 'part2-ch8-master-quiz') {
      const ch = getChapterById(chapterId as ChapterId);
      const firstSeg = ch.segments[0];
      setDiagnosticProfile((prev) => ({
        ...prev,
        completedQuestionnaire: true,
        chapterId: ch.id,
        segmentId: firstSeg.id,
      }));
      setActiveSolution(firstSeg.featuredSolution);
      setActiveStepIndex(0);
      setErrorMsg(null);
    }
  };

  const handleJumpToBadgeSource = (badge: MasteryBadgeDefinition) => {
    if (badge.category === 'cellar-boss') {
      if (isCellarKeyUnlocked) {
        setIsBossBattleOpen(true);
      } else {
        setIsTrophyRoomOpen(true);
      }
      return;
    }
    handleSwitchChapterById(badge.chapterId);
  };

  const handleSelectSolution = (sol: MathHomeworkSolution) => {
    setActiveSolution(sol);
    setActiveStepIndex(0);
    setErrorMsg(null);
    const matchingSeg = activeChapter.segments.find(
      (s) =>
        s.featuredSolution.id === sol.id ||
        s.extraProblems.some((ep) => ep.id === sol.id)
    );
    if (matchingSeg) {
      setDiagnosticProfile((prev) => ({
        ...prev,
        segmentId: matchingSeg.id,
      }));
    }
  };

  const handleSolveCustom = async ({
    problemText,
    imageBase64,
    imageMimeType,
    explanationStyle,
  }: {
    problemText: string;
    imageBase64?: string;
    imageMimeType?: string;
    explanationStyle: 'balanced' | 'arcade' | 'visual';
  }) => {
    setIsSolving(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemText,
          imageBase64,
          imageMimeType,
          explanationStyle,
          chapterContext: `${activeChapter.partLabel} Chapter ${activeChapter.chapterNumber}: ${activeChapter.title} — ${activeSegment.segmentCode}: ${activeSegment.title}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || 'Could not solve this problem right now.'
        );
      }

      const solvedProblem: MathHomeworkSolution = {
        ...data,
        graphConfig: {
          ...data.graphConfig,
          xDomain:
            Array.isArray(data.graphConfig?.xDomain) &&
            data.graphConfig.xDomain.length === 2
              ? [
                  Number(data.graphConfig.xDomain[0]),
                  Number(data.graphConfig.xDomain[1]),
                ]
              : [-8, 8],
          yDomain:
            Array.isArray(data.graphConfig?.yDomain) &&
            data.graphConfig.yDomain.length === 2
              ? [
                  Number(data.graphConfig.yDomain[0]),
                  Number(data.graphConfig.yDomain[1]),
                ]
              : [-8, 8],
          parameters: Array.isArray(data.graphConfig?.parameters)
            ? data.graphConfig.parameters
            : [],
          keyPoints: Array.isArray(data.graphConfig?.keyPoints)
            ? data.graphConfig.keyPoints
            : [],
        },
      };

      setCustomSolutionsByChapter((prev) => ({
        ...prev,
        [activeChapter.id]: [
          solvedProblem,
          ...(prev[activeChapter.id] || []),
        ],
      }));
      setActiveSolution(solvedProblem);
      setActiveStepIndex(0);
      setMasteryPoints((pts) => pts + 25);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to connect to the math solver. Please check your problem syntax.';
      setErrorMsg(message);
    } finally {
      setIsSolving(false);
    }
  };

  // Badges to showcase in Footer strip (unlocked badges first, then upcoming locked badges)
  const footerShowcaseBadges = useMemo(() => {
    const unlockedList = ALL_MASTERY_BADGES.filter((b) => unlockedSet.has(b.id));
    const lockedList = ALL_MASTERY_BADGES.filter((b) => !unlockedSet.has(b.id));
    return [...unlockedList.slice(-12), ...lockedList.slice(0, Math.max(0, 14 - unlockedList.slice(-12).length))];
  }, [unlockedSet]);

  return (
    <div className="min-h-screen flex flex-col justify-start classroom-backdrop text-[#1C1917]">
      <main
        id="top"
        className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 pt-6 pb-14 flex-1"
      >
        {showQuestionnaire ? (
          <DiagnosticQuestionnaire
            chapters={GANITA_CHAPTERS}
            initialProfile={diagnosticProfile}
            initialStage={questionnaireStage}
            onComplete={handleDiagnosticComplete}
            onQuickSelectQuiz={(quizId) => handleSwitchChapterById(quizId)}
            onClose={() => setShowQuestionnaire(false)}
          />
        ) : (
          <Part1ChapterHub
            allChapters={GANITA_CHAPTERS}
            activeChapterId={activeChapterId}
            onSelectChapterId={handleSwitchChapterById}
            onOpenAllChaptersModal={handleOpenChapterPicker}
            activeSolution={activeSolution}
            activeStepIndex={activeStepIndex}
            onSelectStep={(idx) => setActiveStepIndex(idx)}
            chapterSolutions={chapterSolutions}
            onSelectSolution={handleSelectSolution}
            onSolveCustom={handleSolveCustom}
            isSolving={isSolving}
            errorMsg={errorMsg}
            masteryPoints={masteryPoints}
            onAddPoints={(pts) => setMasteryPoints((prev) => prev + pts)}
            unlockedBadgeIds={unlockedBadgeIds}
            onUnlockBadge={handleUnlockBadge}
            onOpenTrophyRoom={() => setIsTrophyRoomOpen(true)}
            onOpenBossBattle={() => {
              if (isCellarKeyUnlocked) setIsBossBattleOpen(true);
            }}
          />
        )}
      </main>

      {/* =====================================================================
          MASTERY BADGE & MILESTONE SHOWCASE FOOTER (115 Badges + Milestone Ranks + Chained Boss Button)
         ===================================================================== */}
      <footer className="border-t-2 border-stone-300 bg-[#FAF6EE] mt-auto">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 py-6 space-y-5 text-xs sm:text-sm text-stone-700">
          {/* Row 1: Visual Mastery Badge & Milestone Ranks Bar */}
          <div className="rounded-2xl border-2 border-[#0F766E]/25 bg-white p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F3828] text-amber-300 shadow-xs">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-stone-900 text-sm sm:text-base">
                      Mastery Badge Collection &amp; Milestone Ranks
                    </span>
                    <span className="rounded-full bg-[#0F766E] px-2.5 py-0.5 text-xs font-extrabold text-white tabular-nums">
                      {unlockedBadgeIds.length} / 115 Badges
                    </span>
                    <span className="rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-xs font-extrabold text-amber-900 tabular-nums">
                      {masteryPoints.toLocaleString()} Mastery Pts
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    112 Module Badges (acquired on Slide 4 of each module) · 2 Grand 30-Question Quiz Badges (#113 &amp; #114) · 1 Chained 3D Cellar Final Boss Badge (#115)
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsTrophyRoomOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-amber-400 bg-amber-400 hover:bg-amber-300 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-stone-950 transition cursor-pointer shadow-xs"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Open Dedicated Trophy Room ({unlockedBadgeIds.length}/115)</span>
                </button>

                {/* Chained Cellar Boss Battle Button in Footer */}
                <button
                  type="button"
                  onClick={() => {
                    if (isCellarKeyUnlocked) {
                      setIsBossBattleOpen(true);
                    } else {
                      setIsTrophyRoomOpen(true);
                    }
                  }}
                  className={`relative overflow-hidden inline-flex items-center gap-2.5 rounded-xl border-2 px-4 py-2.5 text-xs sm:text-sm font-extrabold transition cursor-pointer shadow-xs ${
                    isCellarKeyUnlocked
                      ? 'border-amber-400 bg-[#1B122B] text-amber-300 hover:bg-[#2A1C42]'
                      : 'border-stone-500 bg-stone-900 text-stone-200 hover:border-amber-400'
                  }`}
                >
                  {!isCellarKeyUnlocked && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 220 48"
                      className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
                      preserveAspectRatio="none"
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="220"
                        y2="48"
                        stroke="#9CA3AF"
                        strokeWidth="4"
                        strokeDasharray="7 4"
                      />
                      <line
                        x1="220"
                        y1="0"
                        x2="0"
                        y2="48"
                        stroke="#9CA3AF"
                        strokeWidth="4"
                        strokeDasharray="7 4"
                      />
                    </svg>
                  )}
                  <span className="relative z-10 inline-flex items-center gap-2">
                    {isCellarKeyUnlocked ? (
                      <Key className="w-4 h-4 text-amber-400 animate-pulse" />
                    ) : (
                      <Lock className="w-4 h-4 text-rose-400" />
                    )}
                    <span>
                      {isCellarKeyUnlocked
                        ? 'Enter 3D Cellar Boss Battle (Key Unlocked!)'
                        : `Chained 3D Cellar Boss (Key: ${prereqUnlockedCount}/114)`}
                    </span>
                    <Skull className="w-4 h-4 text-rose-400" />
                  </span>
                </button>
              </div>
            </div>

            {/* Mastery Point Milestone Ranks Strip (Chalkboard Initiate, Algebra Ace, Quadratic Wizard, etc.) */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 mr-1">
                Milestone Ranks:
              </span>
              {MASTERY_POINT_MILESTONES.map((rank) => {
                const isReached = masteryPoints >= rank.minPoints;
                return (
                  <button
                    key={rank.id}
                    type="button"
                    onClick={() => setIsTrophyRoomOpen(true)}
                    title={`${rank.title} (${rank.minPoints} pts): ${rank.description}`}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                      isReached
                        ? 'border-[#0F766E] bg-[#F0FDFA] text-[#0F766E] shadow-2xs'
                        : 'border-stone-200 bg-stone-100 text-stone-400 opacity-75'
                    }`}
                  >
                    <span>{rank.glyph}</span>
                    <span>{rank.title}</span>
                    <span className="text-[10px] opacity-75">
                      ({rank.minPoints}p {isReached ? '✓' : '🔒'})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 115 Mastery Badges Footer Strip */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 mr-1">
                Mastery Badges ({unlockedBadgeIds.length}/115):
              </span>
              {footerShowcaseBadges.map((b) => {
                const isUnlocked = unlockedSet.has(b.id);
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleJumpToBadgeSource(b)}
                    title={`Badge #${b.badgeNumber}: ${b.title} — ${b.subtitle}`}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                      isUnlocked
                        ? 'border-amber-400 bg-amber-50 text-stone-900 shadow-2xs'
                        : 'border-stone-200 bg-stone-50 text-stone-500 hover:border-stone-400'
                    }`}
                  >
                    <span>{b.emblemGlyph}</span>
                    <span className="font-mono text-[10px]">#{b.badgeNumber}</span>
                    <span className="truncate max-w-[130px]">{b.title}</span>
                    {isUnlocked ? (
                      <span className="text-emerald-600 font-extrabold">✓</span>
                    ) : (
                      <Lock className="w-3 h-3 text-stone-400" />
                    )}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setIsTrophyRoomOpen(true)}
                className="text-xs font-extrabold text-[#0F766E] hover:underline ml-1 cursor-pointer"
              >
                View all 115 badges →
              </button>
            </div>
          </div>


        </div>
      </footer>

      {/* Dedicated Trophy Room Modal */}
      <TrophyRoomModal
        isOpen={isTrophyRoomOpen}
        onClose={() => setIsTrophyRoomOpen(false)}
        unlockedBadgeIds={unlockedBadgeIds}
        masteryPoints={masteryPoints}
        onResetBadges={handleResetBadges}
        onOpenBossBattle={() => {
              if (isCellarKeyUnlocked) setIsBossBattleOpen(true);
            }}
        onJumpToBadgeSource={handleJumpToBadgeSource}
      />

      {/* 3D Underground Cellar Final Boss Battle Modal */}
      <CellarBossBattle3D
        isOpen={isBossBattleOpen}
        onClose={() => setIsBossBattleOpen(false)}
        onVictoryUnlockBossBadge={handleUnlockBadge}
        isBossAlreadyDefeated={isBossDefeated}
      />

      {/* Floating Circle Trigger + Slide-Over "Genius Bar" Q&A & Camera Scanner Side Tab (Hidden on Intro & Chapter Selection screens) */}
      {!showQuestionnaire && <GeniusBarDrawer />}
    </div>
  );
}
