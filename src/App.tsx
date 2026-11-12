import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  PREREQUISITE_BADGE_IDS,
  BOSS_BADGE_ID,
  MasteryBadgeDefinition,
  ALL_MASTERY_BADGES,
} from './data/masteryBadges';
import { BadgeAchievementModal } from './components/BadgeAchievementModal';
import { ClassroomThemeSwitch } from './components/ClassroomThemeSwitch';
import { ChapterFloatingElements } from './components/ChapterFloatingElements';
import { StudentAccountProfile } from './types/account';
import {
  getLocalStudentAccount,
  saveLocalStudentAccount,
  syncProgressToServer,
  getSavedPin,
} from './utils/accountStorage';

const BADGE_STORAGE_KEY = 'ganita_prakash_unlocked_badges_v1';
const POINTS_STORAGE_KEY = 'ganita_prakash_mastery_points_v1';
const CHAPTER_POINTS_KEY = 'ganita_prakash_chapter_points_v1';
const THEME_STORAGE_KEY = 'ganita_theme_v1';

export const MAX_MASTERY_POINTS = 4000;

export default function App() {
  const [theme, setTheme] = useState<'light' | 'midnight-chalkboard'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem('ganita_theme');
      if (saved === 'midnight-chalkboard' || saved === 'light') return saved;
      return 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      localStorage.setItem('ganita_theme', theme);
    } catch {}
    if (theme === 'midnight-chalkboard') {
      document.documentElement.classList.add('midnight-chalkboard');
      document.body.classList.add('midnight-chalkboard');
    } else {
      document.documentElement.classList.remove('midnight-chalkboard');
      document.body.classList.remove('midnight-chalkboard');
    }
  }, [theme]);

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

  // Hard ceiling of 4,000 EXP (fixes any 81,000 EXP farm)
  const [masteryPoints, setMasteryPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(POINTS_STORAGE_KEY);
      if (saved) {
        const val = Number(saved);
        if (!isNaN(val)) {
          return Math.min(MAX_MASTERY_POINTS, Math.max(0, val));
        }
      }
      return 120;
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

  // Big Achievement celebration & screen shake state
  const [celebratingBadge, setCelebratingBadge] = useState<MasteryBadgeDefinition | null>(null);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);

  const [chapterGamePoints, setChapterGamePoints] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem(CHAPTER_POINTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'object' && parsed !== null) {
          const clamped: Record<string, number> = {};
          for (const [k, v] of Object.entries(parsed)) {
            clamped[k] = Math.min(1000, Math.max(0, Number(v) || 0));
          }
          return clamped;
        }
      }
    } catch {
      // ignore storage errors
    }
    return {};
  });

  const [studentAccount, setStudentAccount] = useState<StudentAccountProfile | null>(() => {
    return getLocalStudentAccount();
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
    try {
      localStorage.setItem(CHAPTER_POINTS_KEY, JSON.stringify(chapterGamePoints));
    } catch {
      // ignore storage errors
    }
  }, [chapterGamePoints]);

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

  const handleUnlockBadge = useCallback(
    (badgeId: string, rewardPoints: number) => {
      const badgeDef = ALL_MASTERY_BADGES.find((b) => b.id === badgeId);

      setUnlockedBadgeIds((prev) => {
        if (prev.includes(badgeId)) return prev;
        const nextBadges = [...prev, badgeId];
        // Enforce hard cap of 4,000 EXP
        const nextPts = Math.min(MAX_MASTERY_POINTS, masteryPoints + rewardPoints);
        setMasteryPoints(nextPts);

        // Screen shake and big celebration modal!
        setIsScreenShaking(true);
        setTimeout(() => setIsScreenShaking(false), 800);
        if (badgeDef) {
          setCelebratingBadge(badgeDef);
        }

        // Sync with account if logged in
        if (studentAccount) {
          const creds = getSavedPin();
          if (creds) {
            syncProgressToServer(
              studentAccount.username,
              creds.pin,
              nextPts,
              nextBadges,
              chapterGamePoints
            );
          }
        }
        return nextBadges;
      });
    },
    [masteryPoints, studentAccount, chapterGamePoints]
  );

  const handleAddChapterGamePoints = useCallback(
    (chapterId: string, pts: number) => {
      // Balanced EXP per game round (max 15 EXP per action, max 4000 total EXP)
      const sanitizedPts = Math.min(15, Math.max(0, pts));
      const nextTotal = Math.min(MAX_MASTERY_POINTS, masteryPoints + sanitizedPts);
      setMasteryPoints(nextTotal);

      setChapterGamePoints((prev) => {
        const nextChapterPts = {
          ...prev,
          [chapterId]: Math.min(1000, (prev[chapterId] || 0) + sanitizedPts),
        };

        if (studentAccount) {
          const creds = getSavedPin();
          if (creds) {
            syncProgressToServer(
              studentAccount.username,
              creds.pin,
              nextTotal,
              unlockedBadgeIds,
              nextChapterPts
            );
          }
        }
        return nextChapterPts;
      });
    },
    [masteryPoints, studentAccount, unlockedBadgeIds]
  );

  const handleAccountChange = useCallback(
    (account: StudentAccountProfile | null) => {
      setStudentAccount(account);
      if (account) {
        // Enforce hard cap of 4,000 EXP when loading account
        const clampedPoints = Math.min(MAX_MASTERY_POINTS, Math.max(0, account.points || 0));
        setMasteryPoints(clampedPoints);
        if (account.unlockedBadgeIds && account.unlockedBadgeIds.length > 0) {
          setUnlockedBadgeIds((prev) => {
            const set = new Set([...prev, ...account.unlockedBadgeIds]);
            return Array.from(set);
          });
        }
        if (account.chapterGamePoints) {
          const clampedChapterPts: Record<string, number> = {};
          for (const [k, v] of Object.entries(account.chapterGamePoints)) {
            clampedChapterPts[k] = Math.min(1000, Math.max(0, Number(v) || 0));
          }
          setChapterGamePoints((prev) => ({
            ...prev,
            ...clampedChapterPts,
          }));
        }
      }
    },
    []
  );

  const handleResetBadges = useCallback(() => {
    setUnlockedBadgeIds([]);
    setMasteryPoints(120);
    setChapterGamePoints({});
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
      setMasteryPoints((pts) => Math.min(MAX_MASTERY_POINTS, pts + 5));
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

  return (
    <div
      className={`min-h-screen flex flex-col justify-start classroom-backdrop text-[#1C1917] transition-transform ${
        isScreenShaking ? 'big-screen-shake' : ''
      }`}
    >
      {/* Soft Floating Mathematical Charms along screen margins for immersion */}
      <ChapterFloatingElements chapterId={activeChapterId} />

      {/* Classroom Light Switch in the corner ONLY when on Diagnostic Questionnaire */}
      {showQuestionnaire && (
        <ClassroomThemeSwitch
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'light' ? 'midnight-chalkboard' : 'light'))}
          variant="fixed"
        />
      )}

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
            onAddPoints={(pts) => setMasteryPoints((prev) => Math.min(MAX_MASTERY_POINTS, prev + Math.min(15, pts)))}
            unlockedBadgeIds={unlockedBadgeIds}
            onUnlockBadge={handleUnlockBadge}
            onOpenTrophyRoom={() => setIsTrophyRoomOpen(true)}
            onOpenBossBattle={() => {
              if (isCellarKeyUnlocked) setIsBossBattleOpen(true);
            }}
            chapterGamePoints={chapterGamePoints}
            onAddChapterPoints={handleAddChapterGamePoints}
            activeStudentAccount={studentAccount}
            onAccountChange={handleAccountChange}
            theme={theme}
            onToggleTheme={() => setTheme((t) => (t === 'light' ? 'midnight-chalkboard' : 'light'))}
          />
        )}
      </main>



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

      {/* Big Achievement Celebration Modal with Screen Shake & Confetti Fanfare */}
      <BadgeAchievementModal
        isOpen={Boolean(celebratingBadge)}
        badge={celebratingBadge}
        onClose={() => setCelebratingBadge(null)}
        totalUnlockedCount={unlockedBadgeIds.length}
        onTriggerShake={() => {
          setIsScreenShaking(true);
          setTimeout(() => setIsScreenShaking(false), 800);
        }}
      />

      {/* Floating Circle Trigger + Slide-Over "Genius Bar" Q&A & Camera Scanner Side Tab (Hidden on Intro & Chapter Selection screens) */}
      {!showQuestionnaire && <GeniusBarDrawer />}
    </div>
  );
}
