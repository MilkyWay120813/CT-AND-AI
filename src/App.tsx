import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { GANITA_CHAPTERS, getChapterById } from './data/presets';
import {
  ChapterId,
  GanitaChapter,
  StudentDiagnosticProfile,
} from './types/math';
import { DiagnosticQuestionnaire } from './components/DiagnosticQuestionnaire';
import { GanitomaniaWelcomeScreen } from './components/GanitomaniaWelcomeScreen';
import { Part1ChapterHub } from './components/Part1ChapterHub';
import { GeniusBarDrawer } from './components/GeniusBarDrawer';
import { TrickyTextbookPuzzleView } from './components/TrickyTextbookPuzzleView';
import { TrophyRoomModal } from './components/TrophyRoomModal';
import { CellarBossBattle3D } from './components/CellarBossBattle3D';
import {
  PREREQUISITE_BADGE_IDS,
  BOSS_BADGE_ID,
  MasteryBadgeDefinition,
  ALL_MASTERY_BADGES,
} from './data/masteryBadges';
import {
  getPart1CurriculumById,
  getPart2CurriculumById,
  buildPart2CurriculumFromChapter,
} from './data/part1CurriculumData';
import { ChapterAssessmentQuestion } from './types/part1Curriculum';
import { BadgeAchievementModal } from './components/BadgeAchievementModal';
import { ControlCenterDuo } from './components/ControlCenterDuo';
import { QuizAttemptRecord, StudentAccountProfile } from './types/account';
import { addCompletedQuizKey } from './utils/quizProgression';
import {
  getLocalStudentAccount,
  saveLocalStudentAccount,
  syncProgressToServer,
  getSavedPin,
  resetUnauthenticatedLocalStats,
} from './utils/accountStorage';
import {
  MAX_MASTERY_EXP,
  applyBadgeUnlockIfSignedIn,
  applyChapterPointsIfSignedIn,
  buildResetStatsState,
  canUnlockStats,
  hydrateStatsForSignedInAccount,
} from './utils/statsGate';
import {
  evaluateStreakView,
  recordStudyActivityForStreak,
  sanitizeStreakSnapshot,
} from './utils/streakTracker';
import { HeaderStreakBadge } from './components/HeaderStreakBadge';
import { AmbientCinemaBackdrop } from './components/AmbientCinemaBackdrop';
import {
  CinematicTransitionOverlay,
  CinematicTransitionState,
} from './components/CinematicTransitionOverlay';
import { AmbientStoryteller } from './components/AmbientStoryteller';
import { StudentAccountModal } from './components/StudentAccountModal';
import {
  AmbienceSettings,
  DEFAULT_AMBIENCE_SETTINGS,
  TransitionStyle,
  getTransitionTiming,
  sanitizeAmbienceSettings,
  soundscapeEngine,
} from './utils/soundscapeEngine';
import {
  computeRecommendedDifficultyFromProgress,
  DEFAULT_QUIZ_DIFFICULTY_SETTINGS,
  QuizDifficultyLevel,
  QuizDifficultySettings,
  resolveEffectiveDifficulty,
  sanitizeQuizDifficultySettings,
} from './utils/quizDifficulty';

const THEME_STORAGE_KEY = 'ganita_theme_v1';
const AMBIENCE_STORAGE_KEY = 'ganita_ambience_v1';
const QUIZ_SETTINGS_STORAGE_KEY = 'ganita_quiz_settings_v1';

export const MAX_MASTERY_POINTS = MAX_MASTERY_EXP;

export default function App() {
  const [theme, setTheme] = useState<'light' | 'midnight-chalkboard'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qTheme = params.get('theme');
      if (qTheme === 'midnight-chalkboard' || qTheme === 'light') return qTheme;
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

  const [ambienceSettings, setAmbienceSettings] = useState<AmbienceSettings>(() => {
    try {
      const raw = localStorage.getItem(AMBIENCE_STORAGE_KEY);
      if (raw) {
        return sanitizeAmbienceSettings(JSON.parse(raw));
      }
    } catch {
      // ignore storage errors
    }
    return { ...DEFAULT_AMBIENCE_SETTINGS };
  });
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

  const [cinematicTransition, setCinematicTransition] = useState<CinematicTransitionState | null>(
    null
  );
  const transitionTimersRef = useRef<number[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(AMBIENCE_STORAGE_KEY, JSON.stringify(ambienceSettings));
    } catch {
      // ignore
    }
    soundscapeEngine.applySettings(ambienceSettings, false);
  }, [ambienceSettings]);

  // Arm/unlock Web Audio ambient soundscape seamlessly on the first user gesture
  useEffect(() => {
    const unlock = () => {
      soundscapeEngine.unlockFromGesture(ambienceSettings);
      setIsAudioUnlocked(soundscapeEngine.getStatus().isAudioActive);
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [ambienceSettings]);

  const handleUpdateAmbience = useCallback(
    (patch: Partial<AmbienceSettings>, triggeredByUser = false) => {
      setAmbienceSettings((prev) => {
        const next = sanitizeAmbienceSettings({ ...prev, ...patch });
        if (triggeredByUser) {
          soundscapeEngine.applySettings(next, true);
          setTimeout(() => {
            setIsAudioUnlocked(soundscapeEngine.getStatus().isAudioActive);
          }, 80);
        }
        return next;
      });
    },
    []
  );

  const triggerCinematicTransition = useCallback(
    ({
      title,
      subtitle,
      targetKind,
      modeOverride,
      onSwap,
    }: {
      title: string;
      subtitle: string;
      targetKind: 'solver' | 'hub' | 'chapter';
      modeOverride?: TransitionStyle;
      onSwap: () => void;
    }) => {
      // Clear any previous overlapping timers
      transitionTimersRef.current.forEach((id) => window.clearTimeout(id));
      transitionTimersRef.current = [];

      const mode = modeOverride || ambienceSettings.transitionStyle;
      const timing = getTransitionTiming(mode);

      soundscapeEngine.unlockFromGesture(ambienceSettings);
      setIsAudioUnlocked(soundscapeEngine.getStatus().isAudioActive);
      if (mode === 'curtain') {
        soundscapeEngine.playCurtainTransitionSfx();
      } else {
        soundscapeEngine.playPageFlipSfx();
      }

      setCinematicTransition({
        isActive: true,
        mode,
        title,
        subtitle,
        targetKind,
        runId: Date.now(),
      });

      const swapTimer = window.setTimeout(() => {
        onSwap();
      }, timing.swapAtMs);

      const endTimer = window.setTimeout(() => {
        setCinematicTransition(null);
      }, timing.totalDurationMs);

      transitionTimersRef.current = [swapTimer, endTimer];
    },
    [ambienceSettings]
  );

  useEffect(() => {
    return () => {
      transitionTimersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const [showGanitomaniaWelcome, setShowGanitomaniaWelcome] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('autostart') !== '1';
    } catch {
      return true;
    }
  });
  const [showQuestionnaire, setShowQuestionnaire] = useState<boolean>(false);
  const [questionnaireStage, setQuestionnaireStage] = useState<
    'welcome' | 'chapters' | 'segments'
  >('chapters');

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

  const [studentAccount, setStudentAccount] = useState<StudentAccountProfile | null>(() => {
    resetUnauthenticatedLocalStats();
    return getLocalStudentAccount();
  });
  const isStatsUnlocked = canUnlockStats(studentAccount);
  const streakView = useMemo(
    () => evaluateStreakView(studentAccount),
    [studentAccount]
  );
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [accountModalInitialTab, setAccountModalInitialTab] = useState<
    'profile' | 'stats' | 'register' | 'login'
  >('profile');

  const openAccountModalWithTab = useCallback(
    (tab: 'profile' | 'stats' | 'register' | 'login') => {
      setAccountModalInitialTab(tab);
      setIsAccountModalOpen(true);
    },
    []
  );

  const [geniusBarOpen, setGeniusBarOpen] = useState<boolean>(false);
  const [geniusBarFullscreen, setGeniusBarFullscreen] = useState<boolean>(false);

  const [cinemaFocus, setCinemaFocus] = useState<boolean>(false);
  const [isStorytellerOpen, setIsStorytellerOpen] = useState<boolean>(false);

  // Allow Escape key to exit Cinema Focus cleanly
  useEffect(() => {
    if (!cinemaFocus) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCinemaFocus(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cinemaFocus]);

  // All stats start reset at 0 and are hydrated ONLY when signed in
  const [masteryPoints, setMasteryPoints] = useState<number>(() => {
    return hydrateStatsForSignedInAccount(studentAccount).masteryPoints;
  });

  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>(() => {
    return hydrateStatsForSignedInAccount(studentAccount).unlockedBadgeIds;
  });

  // Big Achievement celebration & screen shake state
  const [celebratingBadge, setCelebratingBadge] = useState<MasteryBadgeDefinition | null>(null);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);

  const [chapterGamePoints, setChapterGamePoints] = useState<Record<string, number>>(() => {
    return hydrateStatsForSignedInAccount(studentAccount).chapterGamePoints;
  });

  const [isTrophyRoomOpen, setIsTrophyRoomOpen] = useState<boolean>(false);
  const [isBossBattleOpen, setIsBossBattleOpen] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [showGanitomaniaWelcome, showQuestionnaire, activeChapterId]);

  const unlockedSet = useMemo(() => new Set(unlockedBadgeIds), [unlockedBadgeIds]);

  const prereqUnlockedCount = useMemo(
    () => PREREQUISITE_BADGE_IDS.filter((id) => unlockedSet.has(id)).length,
    [unlockedSet]
  );

  const isCellarKeyUnlocked =
    PREREQUISITE_BADGE_IDS.length === 114 &&
    prereqUnlockedCount === PREREQUISITE_BADGE_IDS.length;
  const isBossDefeated = unlockedSet.has(BOSS_BADGE_ID);

  // Global Quiz Settings (Difficulty Level 1..4 & Auto-Match to Student Progress)
  const [quizDifficultySettings, setQuizDifficultySettings] = useState<QuizDifficultySettings>(
    () => {
      try {
        const raw = localStorage.getItem(QUIZ_SETTINGS_STORAGE_KEY);
        if (raw) {
          return sanitizeQuizDifficultySettings(JSON.parse(raw));
        }
      } catch {
        // ignore storage errors
      }
      return { ...DEFAULT_QUIZ_DIFFICULTY_SETTINGS };
    }
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        QUIZ_SETTINGS_STORAGE_KEY,
        JSON.stringify(quizDifficultySettings)
      );
    } catch {
      // ignore
    }
  }, [quizDifficultySettings]);

  const progressForDifficulty = useMemo(
    () => ({
      unlockedBadgeCount: unlockedBadgeIds.length,
      masteryPoints,
      quizHistory: studentAccount?.quizHistory,
    }),
    [unlockedBadgeIds.length, masteryPoints, studentAccount?.quizHistory]
  );

  const recommendedDifficultyInfo = useMemo(
    () => computeRecommendedDifficultyFromProgress(progressForDifficulty),
    [progressForDifficulty]
  );

  const effectiveDifficulty = useMemo(
    () => resolveEffectiveDifficulty(quizDifficultySettings, progressForDifficulty),
    [quizDifficultySettings, progressForDifficulty]
  );

  const handleSelectDifficulty = useCallback((level: QuizDifficultyLevel) => {
    setQuizDifficultySettings({ difficulty: level, autoMatchProgress: false });
  }, []);

  const handleToggleAutoMatchDifficulty = useCallback(
    (enabled: boolean) => {
      setQuizDifficultySettings((prev) => ({
        difficulty: enabled ? recommendedDifficultyInfo.recommendedLevel : effectiveDifficulty,
        autoMatchProgress: enabled,
      }));
    },
    [recommendedDifficultyInfo.recommendedLevel, effectiveDifficulty]
  );

  const handleUnlockBadge = useCallback(
    (badgeId: string, rewardPoints: number) => {
      if (!canUnlockStats(studentAccount) || !studentAccount) {
        setIsAccountModalOpen(true);
        return;
      }
      const badgeDef = ALL_MASTERY_BADGES.find((b) => b.id === badgeId);

      const { unlocked, next } = applyBadgeUnlockIfSignedIn(
        studentAccount,
        {
          masteryPoints,
          unlockedBadgeIds,
          chapterGamePoints,
        },
        badgeId,
        rewardPoints
      );

      if (!unlocked) return;

      const { changed: streakChanged, next: nextStreak } =
        recordStudyActivityForStreak(studentAccount);
      const updatedAccount: StudentAccountProfile = {
        ...studentAccount,
        points: next.masteryPoints,
        unlockedBadgeIds: next.unlockedBadgeIds,
        chapterGamePoints: next.chapterGamePoints,
        ...(streakChanged ? nextStreak : {}),
      };

      setUnlockedBadgeIds(next.unlockedBadgeIds);
      setMasteryPoints(next.masteryPoints);
      setStudentAccount(updatedAccount);
      saveLocalStudentAccount(updatedAccount);

      // Screen shake and big celebration modal!
      setIsScreenShaking(true);
      setTimeout(() => setIsScreenShaking(false), 800);
      if (badgeDef) {
        setCelebratingBadge(badgeDef);
      }

      // Sync with signed-in account
      const creds = getSavedPin();
      if (creds) {
        syncProgressToServer(
          updatedAccount.username,
          creds.pin,
          next.masteryPoints,
          next.unlockedBadgeIds,
          next.chapterGamePoints,
          updatedAccount.quizHistory,
          updatedAccount.completedQuizKeys,
          nextStreak
        );
      }
    },
    [masteryPoints, unlockedBadgeIds, studentAccount, chapterGamePoints]
  );

  const handleAddChapterGamePoints = useCallback(
    (chapterId: string, pts: number) => {
      if (!canUnlockStats(studentAccount) || !studentAccount) {
        return;
      }
      const { added, next } = applyChapterPointsIfSignedIn(
        studentAccount,
        {
          masteryPoints,
          unlockedBadgeIds,
          chapterGamePoints,
        },
        chapterId,
        pts
      );
      if (!added) return;

      const { changed: streakChanged, next: nextStreak } =
        recordStudyActivityForStreak(studentAccount);
      const updatedAccount: StudentAccountProfile = {
        ...studentAccount,
        points: next.masteryPoints,
        chapterGamePoints: next.chapterGamePoints,
        ...(streakChanged ? nextStreak : {}),
      };

      setMasteryPoints(next.masteryPoints);
      setChapterGamePoints(next.chapterGamePoints);
      setStudentAccount(updatedAccount);
      saveLocalStudentAccount(updatedAccount);

      const creds = getSavedPin();
      if (creds) {
        syncProgressToServer(
          updatedAccount.username,
          creds.pin,
          next.masteryPoints,
          next.unlockedBadgeIds,
          next.chapterGamePoints,
          updatedAccount.quizHistory,
          updatedAccount.completedQuizKeys,
          nextStreak
        );
      }
    },
    [masteryPoints, unlockedBadgeIds, chapterGamePoints, studentAccount]
  );

  const handleRecordStudyActivity = useCallback(() => {
    if (!canUnlockStats(studentAccount) || !studentAccount) {
      return;
    }
    const { changed, next } = recordStudyActivityForStreak(studentAccount);
    if (!changed) return;

    const updatedAccount: StudentAccountProfile = {
      ...studentAccount,
      ...next,
      lastLoginAt: new Date().toISOString(),
    };
    setStudentAccount(updatedAccount);
    saveLocalStudentAccount(updatedAccount);

    const creds = getSavedPin();
    if (creds) {
      syncProgressToServer(
        updatedAccount.username,
        creds.pin,
        masteryPoints,
        unlockedBadgeIds,
        chapterGamePoints,
        updatedAccount.quizHistory,
        updatedAccount.completedQuizKeys,
        next
      );
    }
  }, [studentAccount, masteryPoints, unlockedBadgeIds, chapterGamePoints]);

  const handleRecordQuizAttempt = useCallback(
    (attempt: Omit<QuizAttemptRecord, 'id' | 'timestamp'>) => {
      if (!canUnlockStats(studentAccount) || !studentAccount) {
        return;
      }

      const newRecord: QuizAttemptRecord = {
        ...attempt,
        id: `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
      };

      const nextQuizHistory = [...(studentAccount.quizHistory || []), newRecord];
      const nextCompletedKeys = addCompletedQuizKey(
        studentAccount.completedQuizKeys,
        attempt.quizKey
      );
      const { changed: streakChanged, next: nextStreak } =
        recordStudyActivityForStreak(studentAccount);

      const updatedAccount: StudentAccountProfile = {
        ...studentAccount,
        quizHistory: nextQuizHistory,
        completedQuizKeys: nextCompletedKeys,
        lastLoginAt: newRecord.timestamp,
        ...(streakChanged ? nextStreak : {}),
      };

      setStudentAccount(updatedAccount);
      saveLocalStudentAccount(updatedAccount);

      const creds = getSavedPin();
      if (creds) {
        syncProgressToServer(
          updatedAccount.username,
          creds.pin,
          masteryPoints,
          unlockedBadgeIds,
          chapterGamePoints,
          nextQuizHistory,
          nextCompletedKeys,
          sanitizeStreakSnapshot(updatedAccount)
        );
      }
    },
    [studentAccount, masteryPoints, unlockedBadgeIds, chapterGamePoints]
  );

  const handleAccountChange = useCallback(
    (account: StudentAccountProfile | null) => {
      setStudentAccount(account);
      if (account) {
        const hydrated = hydrateStatsForSignedInAccount(account);
        setMasteryPoints(hydrated.masteryPoints);
        setUnlockedBadgeIds(hydrated.unlockedBadgeIds);
        setChapterGamePoints(hydrated.chapterGamePoints);
      } else {
        const reset = buildResetStatsState();
        setMasteryPoints(reset.masteryPoints);
        setUnlockedBadgeIds(reset.unlockedBadgeIds);
        setChapterGamePoints(reset.chapterGamePoints);
      }
    },
    []
  );

  const handleResetBadges = useCallback(() => {
    const reset = buildResetStatsState();
    setUnlockedBadgeIds(reset.unlockedBadgeIds);
    setMasteryPoints(reset.masteryPoints);
    setChapterGamePoints(reset.chapterGamePoints);
  }, []);

  const staticByChapter = useMemo(() => {
    const map: Partial<Record<ChapterId, ChapterAssessmentQuestion[]>> = {};
    for (const ch of GANITA_CHAPTERS) {
      const curr =
        ch.partLabel === 'Part I'
          ? getPart1CurriculumById(ch.id)
          : getPart2CurriculumById(ch.id) || buildPart2CurriculumFromChapter(ch);
      if (curr?.questionnaire) {
        map[ch.id] = curr.questionnaire;
      }
    }
    return map;
  }, []);

  const activeChapter: GanitaChapter = useMemo(
    () => getChapterById(diagnosticProfile.chapterId),
    [diagnosticProfile.chapterId]
  );

  const handleProceedToChapterHub = () => {
    const ch = getChapterById(activeChapterId as ChapterId);
    triggerCinematicTransition({
      title: 'Ganitomania · Chapter Hub',
      subtitle: `${ch.partLabel} · Opening Class VIII Classroom Stage`,
      targetKind: 'hub',
      onSwap: () => {
        setShowGanitomaniaWelcome(false);
        setShowQuestionnaire(false);
        setGeniusBarFullscreen(false);
        setGeniusBarOpen(false);
      },
    });
  };

  const handleBrowseChaptersFromWelcome = () => {
    triggerCinematicTransition({
      title: '14-Chapter Textbook Map',
      subtitle: 'Choosing Chapter & Focus',
      targetKind: 'chapter',
      modeOverride: 'page-flip',
      onSwap: () => {
        setShowGanitomaniaWelcome(false);
        setQuestionnaireStage('chapters');
        setShowQuestionnaire(true);
      },
    });
  };

  const handleOpenLessonStyle = () => {
    triggerCinematicTransition({
      title: 'Choose Classroom Lesson Style',
      subtitle: 'Visual Models · Step-by-Step Genius Bar · Tricky 20Q Arena',
      targetKind: 'chapter',
      modeOverride: 'page-flip',
      onSwap: () => {
        setShowGanitomaniaWelcome(false);
        setQuestionnaireStage('welcome');
        setShowQuestionnaire(true);
      },
    });
  };

  const handleDiagnosticComplete = (profile: StudentDiagnosticProfile) => {
    const ch = getChapterById(profile.chapterId);
    const isStepsMode = profile.difficultyFocus === 'steps';
    const isTrickyMode = profile.difficultyFocus === 'word-problems';

    triggerCinematicTransition({
      title: isStepsMode
        ? 'Genius Bar · Fullscreen Studio'
        : isTrickyMode
        ? 'Tricky Textbook 20Q Arena'
        : `Chapter ${ch.chapterNumber}: ${ch.title}`,
      subtitle: isStepsMode
        ? 'Step-by-Step Worked Explanations'
        : isTrickyMode
        ? 'Choose Any Chapters for a Fresh 20-Question Mix'
        : `${ch.partLabel} · Opening Classroom Hub`,
      targetKind: isStepsMode ? 'solver' : 'hub',
      onSwap: () => {
        setDiagnosticProfile(profile);
        setActiveChapterId(profile.chapterId);
        setShowGanitomaniaWelcome(false);
        setShowQuestionnaire(false);
        if (isStepsMode) {
          window.scrollTo({ top: 0, behavior: 'auto' });
          setGeniusBarOpen(true);
          setGeniusBarFullscreen(true);
        } else {
          if (isTrickyMode) {
            window.scrollTo({ top: 0, behavior: 'auto' });
          }
          setGeniusBarFullscreen(false);
          setGeniusBarOpen(false);
        }
      },
    });
  };

  const handleOpenChapterPicker = () => {
    triggerCinematicTransition({
      title: '14-Chapter Textbook Map',
      subtitle: 'Choosing Chapter & Focus',
      targetKind: 'chapter',
      modeOverride: 'page-flip',
      onSwap: () => {
        setShowGanitomaniaWelcome(false);
        setQuestionnaireStage('chapters');
        setShowQuestionnaire(true);
      },
    });
  };

  const handleSwitchChapterById = (chapterId: string) => {
    const chLabel =
      chapterId === 'ch8-master-quiz'
        ? 'Part I Grand Mastery Quiz'
        : chapterId === 'part2-ch8-master-quiz'
        ? 'Part II Grand Mastery Quiz'
        : getChapterById(chapterId as ChapterId).title;

    triggerCinematicTransition({
      title: chLabel,
      subtitle: 'Loading Chapter Stage',
      targetKind: 'chapter',
      onSwap: () => {
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
        }
      },
    });
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

  return (
    <div
      className={`min-h-screen flex flex-col justify-start classroom-backdrop text-[#1C1917] transition-transform relative overflow-x-clip ${
        isScreenShaking ? 'big-screen-shake' : ''
      }`}
    >
      {/* Strictly Background Moving Ambient Objects Layer (z-0, behind all cards) */}
      <AmbientCinemaBackdrop
        theme={theme}
        motionMode={ambienceSettings.motionMode}
      />

      {/* Cinema Focus Spotlight Scrim (dims room around the spotlighted Chapter Card) */}
      {cinemaFocus && !showGanitomaniaWelcome && !showQuestionnaire && (
        <div
          aria-hidden="true"
          data-testid="cinema-focus-scrim"
          className="fixed inset-0 z-20 pointer-events-none cinema-focus-scrim transition-opacity duration-500"
        />
      )}

      <main
        id="top"
        className={`w-full max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 sm:pt-6 pb-20 flex-1 relative ${
          cinemaFocus && !showGanitomaniaWelcome && !showQuestionnaire ? 'z-30' : 'z-10'
        }`}
      >
        {showGanitomaniaWelcome ? (
          <div className="w-full space-y-4">
            {/* Scroll-along Top Bar on Ganitomania Entrance Screen */}
            <header
              aria-label="Entrance Controls"
              className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 px-1 relative z-40"
            >
              <div className="flex items-center gap-2">
                {studentAccount ? (
                  <button
                    type="button"
                    onClick={() => setIsAccountModalOpen(true)}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-black border transition-all cursor-pointer shadow-2xs bg-[#12352B] hover:bg-[#1A4B3D] text-amber-300 border-teal-500/50"
                  >
                    <span>{studentAccount.mascot}</span>
                    <span>{studentAccount.username}</span>
                  </button>
                ) : (
                  <span
                    className={`font-mono text-xs uppercase tracking-widest font-semibold ${
                      theme === 'midnight-chalkboard' ? 'text-emerald-200/80' : 'text-stone-600'
                    }`}
                  >
                    Ganitomania · Class VIII
                  </span>
                )}

                <HeaderStreakBadge
                  streakView={streakView}
                  theme={theme}
                  testId="welcome-streak-badge"
                  onClick={() => openAccountModalWithTab(studentAccount ? 'profile' : 'login')}
                />
              </div>

              <ControlCenterDuo
                theme={theme}
                onToggleTheme={() =>
                  setTheme((t) => (t === 'light' ? 'midnight-chalkboard' : 'light'))
                }
                settings={ambienceSettings}
                isAudioUnlocked={isAudioUnlocked}
                onUpdateSettings={handleUpdateAmbience}
                quizDifficultySettings={quizDifficultySettings}
                effectiveDifficulty={effectiveDifficulty}
                recommendedDifficulty={recommendedDifficultyInfo.recommendedLevel}
                recommendedReason={recommendedDifficultyInfo.reason}
                onSelectDifficulty={handleSelectDifficulty}
                onToggleAutoMatchDifficulty={handleToggleAutoMatchDifficulty}
              />
            </header>

            <GanitomaniaWelcomeScreen
              theme={theme}
              studentAccount={studentAccount}
              onProceedToHub={handleProceedToChapterHub}
              onBrowseAllChapters={handleBrowseChaptersFromWelcome}
              onChooseLessonStyle={handleOpenLessonStyle}
              onOpenSignIn={() => openAccountModalWithTab('login')}
            />
          </div>
        ) : showQuestionnaire ? (
          <div className="w-full space-y-4">
            {/* Scroll-along Top Bar on Chapter Map Screen */}
            <header
              aria-label="Welcome Controls"
              className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 px-1 relative z-40"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAccountModalWithTab(studentAccount ? 'profile' : 'login')}
                  className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-black border transition-all cursor-pointer shadow-2xs ${
                    studentAccount
                      ? 'bg-[#12352B] hover:bg-[#1A4B3D] text-amber-300 border-teal-500/50'
                      : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
                  }`}
                >
                  <span>{studentAccount?.mascot || '🔓'}</span>
                  <span>{studentAccount ? studentAccount.username : 'Sign In to Save Stats'}</span>
                </button>
                <HeaderStreakBadge
                  streakView={streakView}
                  theme={theme}
                  testId="questionnaire-streak-badge"
                  onClick={() => openAccountModalWithTab(studentAccount ? 'profile' : 'login')}
                />
              </div>

              <ControlCenterDuo
                theme={theme}
                onToggleTheme={() =>
                  setTheme((t) => (t === 'light' ? 'midnight-chalkboard' : 'light'))
                }
                settings={ambienceSettings}
                isAudioUnlocked={isAudioUnlocked}
                onUpdateSettings={handleUpdateAmbience}
                quizDifficultySettings={quizDifficultySettings}
                effectiveDifficulty={effectiveDifficulty}
                recommendedDifficulty={recommendedDifficultyInfo.recommendedLevel}
                recommendedReason={recommendedDifficultyInfo.reason}
                onSelectDifficulty={handleSelectDifficulty}
                onToggleAutoMatchDifficulty={handleToggleAutoMatchDifficulty}
              />
            </header>

            <DiagnosticQuestionnaire
              chapters={GANITA_CHAPTERS}
              initialProfile={diagnosticProfile}
              initialStage={questionnaireStage}
              onComplete={handleDiagnosticComplete}
              onQuickSelectQuiz={(quizId) => handleSwitchChapterById(quizId)}
              onClose={() => setShowQuestionnaire(false)}
            />
          </div>
        ) : diagnosticProfile.difficultyFocus === 'word-problems' ? (
          <div className="w-full space-y-4">
            <header
              aria-label="Tricky Textbook Controls"
              className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 px-1 relative z-40"
            >
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAccountModalWithTab(studentAccount ? 'stats' : 'login')}
                  className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-black border transition-all cursor-pointer shadow-2xs ${
                    studentAccount
                      ? 'bg-[#12352B] hover:bg-[#1A4B3D] text-amber-300 border-teal-500/50'
                      : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
                  }`}
                >
                  <span>{studentAccount?.mascot || '🔓'}</span>
                  <span>
                    {studentAccount ? `${studentAccount.username} · Quiz Stats` : 'Sign In to Save Stats'}
                  </span>
                </button>

                <HeaderStreakBadge
                  streakView={streakView}
                  theme={theme}
                  testId="tricky-streak-badge"
                  onClick={() => openAccountModalWithTab(studentAccount ? 'profile' : 'login')}
                />

                <button
                  type="button"
                  onClick={handleOpenLessonStyle}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 transition-colors cursor-pointer"
                >
                  Switch Lesson Style
                </button>
              </div>

              <ControlCenterDuo
                theme={theme}
                onToggleTheme={() =>
                  setTheme((t) => (t === 'light' ? 'midnight-chalkboard' : 'light'))
                }
                settings={ambienceSettings}
                isAudioUnlocked={isAudioUnlocked}
                onUpdateSettings={handleUpdateAmbience}
                quizDifficultySettings={quizDifficultySettings}
                effectiveDifficulty={effectiveDifficulty}
                recommendedDifficulty={recommendedDifficultyInfo.recommendedLevel}
                recommendedReason={recommendedDifficultyInfo.reason}
                onSelectDifficulty={handleSelectDifficulty}
                onToggleAutoMatchDifficulty={handleToggleAutoMatchDifficulty}
              />
            </header>

            <TrickyTextbookPuzzleView
              allChapters={GANITA_CHAPTERS}
              initialSelectedChapterIds={[activeChapter.id]}
              staticByChapter={staticByChapter}
              onRecordQuizAttempt={handleRecordQuizAttempt}
              isStatsLocked={!isStatsUnlocked}
              onRequestSignIn={() => openAccountModalWithTab('login')}
              onOpenAccountStats={() => openAccountModalWithTab('stats')}
              onBackToHub={() =>
                setDiagnosticProfile((prev) => ({
                  ...prev,
                  difficultyFocus: 'intuition',
                }))
              }
              quizDifficultySettings={quizDifficultySettings}
              effectiveDifficulty={effectiveDifficulty}
              recommendedDifficulty={recommendedDifficultyInfo.recommendedLevel}
              recommendedReason={recommendedDifficultyInfo.reason}
              onSelectDifficulty={handleSelectDifficulty}
              onToggleAutoMatchDifficulty={handleToggleAutoMatchDifficulty}
            />
          </div>
        ) : (
          <Part1ChapterHub
            allChapters={GANITA_CHAPTERS}
            activeChapterId={activeChapterId}
            onSelectChapterId={handleSwitchChapterById}
            onOpenAllChaptersModal={handleOpenChapterPicker}
            masteryPoints={masteryPoints}
            onAddPoints={(pts) => {
              if (!isStatsUnlocked) {
                openAccountModalWithTab('login');
                return;
              }
              setMasteryPoints((prev) => Math.min(MAX_MASTERY_POINTS, prev + Math.min(15, pts)));
            }}
            unlockedBadgeIds={unlockedBadgeIds}
            onUnlockBadge={handleUnlockBadge}
            onOpenTrophyRoom={() => setIsTrophyRoomOpen(true)}
            onOpenBossBattle={() => {
              if (!isStatsUnlocked) {
                openAccountModalWithTab('login');
                return;
              }
              if (isCellarKeyUnlocked) setIsBossBattleOpen(true);
            }}
            chapterGamePoints={chapterGamePoints}
            onAddChapterPoints={handleAddChapterGamePoints}
            activeStudentAccount={studentAccount}
            onAccountChange={handleAccountChange}
            isStatsLocked={!isStatsUnlocked}
            onOpenAccountModal={() =>
              openAccountModalWithTab(studentAccount ? 'profile' : 'login')
            }
            onOpenQuizStats={() => openAccountModalWithTab('stats')}
            completedQuizKeys={studentAccount?.completedQuizKeys || []}
            onRecordQuizAttempt={handleRecordQuizAttempt}
            streakView={streakView}
            onRecordStudyActivity={handleRecordStudyActivity}
            onOpenLessonStyleModal={handleOpenLessonStyle}
            theme={theme}
            onToggleTheme={() => setTheme((t) => (t === 'light' ? 'midnight-chalkboard' : 'light'))}
            ambienceSettings={ambienceSettings}
            isAudioUnlocked={isAudioUnlocked}
            onUpdateAmbience={handleUpdateAmbience}
            quizDifficultySettings={quizDifficultySettings}
            effectiveDifficulty={effectiveDifficulty}
            recommendedDifficulty={recommendedDifficultyInfo.recommendedLevel}
            recommendedReason={recommendedDifficultyInfo.reason}
            onSelectDifficulty={handleSelectDifficulty}
            onToggleAutoMatchDifficulty={handleToggleAutoMatchDifficulty}
            cinemaFocus={cinemaFocus}
            onToggleCinemaFocus={() => setCinemaFocus((prev) => !prev)}
            isStorytellerOpen={isStorytellerOpen}
            onToggleStoryteller={() => {
              soundscapeEngine.unlockFromGesture(ambienceSettings);
              setIsStorytellerOpen((prev) => !prev);
            }}
          />
        )}
      </main>

      {/* Ambient Storyteller Theater Narration Bar */}
      <AmbientStoryteller
        chapterId={activeChapterId}
        chapterIndex={
          activeChapterId === 'ch8-master-quiz' || activeChapterId === 'part2-ch8-master-quiz'
            ? 8
            : activeChapter.chapterNumber
        }
        isOpen={isStorytellerOpen && !showGanitomaniaWelcome && !showQuestionnaire}
        onClose={() => setIsStorytellerOpen(false)}
        cinemaFocus={cinemaFocus}
        narrationRate={ambienceSettings.narrationRate}
        onUnlockAudio={() => {
          soundscapeEngine.unlockFromGesture(ambienceSettings);
          setIsAudioUnlocked(soundscapeEngine.getStatus().isAudioActive);
        }}
      />

      {/* CSS Curtain-Close & 3D Page-Flip Transition Overlay */}
      <CinematicTransitionOverlay transition={cinematicTransition} theme={theme} />

      {/* Student Account Registration & Sign-In Modal */}
      <StudentAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        activeAccount={studentAccount}
        onAccountChange={handleAccountChange}
        currentPoints={masteryPoints}
        unlockedBadgeIds={unlockedBadgeIds}
        chapterGamePoints={chapterGamePoints}
        initialTab={accountModalInitialTab}
        chapters={GANITA_CHAPTERS}
        onJumpToChapter={(chId) => {
          setIsAccountModalOpen(false);
          setDiagnosticProfile((prev) => ({
            ...prev,
            difficultyFocus: 'intuition',
            chapterId: chId as ChapterId,
          }));
          handleSwitchChapterById(chId);
        }}
      />

      {/* Dedicated Trophy Room Modal */}
      <TrophyRoomModal
        isOpen={isTrophyRoomOpen}
        onClose={() => setIsTrophyRoomOpen(false)}
        unlockedBadgeIds={unlockedBadgeIds}
        masteryPoints={masteryPoints}
        onResetBadges={handleResetBadges}
        onOpenBossBattle={() => {
          if (isStatsUnlocked && isCellarKeyUnlocked) setIsBossBattleOpen(true);
        }}
        onJumpToBadgeSource={handleJumpToBadgeSource}
        isStatsLocked={!isStatsUnlocked}
        onRequestSignIn={() => openAccountModalWithTab('login')}
      />

      {/* 3D Underground Cellar Final Boss Battle Modal */}
      <CellarBossBattle3D
        isOpen={isBossBattleOpen}
        onClose={() => setIsBossBattleOpen(false)}
        onVictoryUnlockBossBadge={handleUnlockBadge}
        isBossAlreadyDefeated={isBossDefeated}
        onRecordQuizAttempt={handleRecordQuizAttempt}
        quizDifficultySettings={quizDifficultySettings}
        effectiveDifficulty={effectiveDifficulty}
        recommendedDifficulty={recommendedDifficultyInfo.recommendedLevel}
        recommendedReason={recommendedDifficultyInfo.reason}
        onSelectDifficulty={handleSelectDifficulty}
        onToggleAutoMatchDifficulty={handleToggleAutoMatchDifficulty}
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

      {/* Floating Circle Trigger + Slide-Over / Fullscreen "Genius Bar" Q&A & Camera Scanner */}
      {!showGanitomaniaWelcome && !showQuestionnaire && (
        <div className={cinemaFocus ? 'cinema-focus-dim' : ''}>
          <GeniusBarDrawer
            isOpen={geniusBarOpen}
            onOpenChange={(open) => {
              setGeniusBarOpen(open);
              if (!open) setGeniusBarFullscreen(false);
            }}
            isFullscreen={geniusBarFullscreen}
            onToggleFullscreen={setGeniusBarFullscreen}
            onExitToHub={() => {
              setGeniusBarFullscreen(false);
              setGeniusBarOpen(false);
              setDiagnosticProfile((prev) => ({
                ...prev,
                difficultyFocus: 'intuition',
              }));
            }}
          />
        </div>
      )}
    </div>
  );
}
