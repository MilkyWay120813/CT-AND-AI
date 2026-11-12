import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Play,
  FileText,
  ArrowLeft,
  ArrowRight,
  Sliders,
  Trophy,
  Film,
  BookOpen,
  CheckCircle2,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Lock,
  Key,
  Award,
  Skull,
  Gamepad2,
  Sparkles,
  Lightbulb,
  Zap,
  Quote,
} from 'lucide-react';
import { ChapterId, GanitaChapter, MathHomeworkSolution } from '../types/math';
import { Part1ChapterCurriculum, Part1ModuleItem } from '../types/part1Curriculum';
import { getModuleFunInterpretation } from '../utils/moduleFunInterpretations';
import {
  PART1_CURRICULUM_CHAPTERS,
  getPart1CurriculumById,
  getPart2CurriculumById,
  buildPart2CurriculumFromChapter,
} from '../data/part1CurriculumData';
import { Part1VideoPlayer } from './Part1VideoPlayer';
import { Part1ModuleSimAndGame } from './Part1ModuleSimAndGame';
import { Part1ChapterQuiz } from './Part1ChapterQuiz';
import { ModuleTitleArtwork } from './ModuleTitleArtwork';
import { AnimatedChapterBanner } from './AnimatedChapterBanner';
import { ChapterLevelProgress } from './ChapterLevelProgress';
import { CircularUniverseProgress } from './CircularUniverseProgress';
import { ClassroomThemeSwitch } from './ClassroomThemeSwitch';
import { StudentAccountModal } from './StudentAccountModal';
import { All112HubModal } from './All112HubModal';
import { StudentAccountProfile } from '../types/account';
import { formatMathText } from '../utils/formatMath';
import {
  ALL_MASTERY_BADGES,
  PREREQUISITE_BADGE_IDS,
  getModuleBadgeId,
  getQuizBadgeId,
} from '../data/masteryBadges';

interface Part1ChapterHubProps {
  allChapters: GanitaChapter[];
  activeChapterId: string;
  onSelectChapterId: (chapterId: string) => void;
  onOpenAllChaptersModal: () => void;
  activeSolution: MathHomeworkSolution;
  activeStepIndex: number;
  onSelectStep: (idx: number) => void;
  chapterSolutions: MathHomeworkSolution[];
  onSelectSolution: (sol: MathHomeworkSolution) => void;
  onSolveCustom: (payload: {
    problemText: string;
    imageBase64?: string;
    imageMimeType?: string;
    explanationStyle: 'balanced' | 'arcade' | 'visual';
  }) => Promise<void>;
  isSolving: boolean;
  errorMsg: string | null;
  masteryPoints: number;
  onAddPoints: (pts: number) => void;
  unlockedBadgeIds: string[];
  onUnlockBadge: (badgeId: string, rewardPoints: number) => void;
  onOpenTrophyRoom: () => void;
  onOpenBossBattle: () => void;
  chapterGamePoints: Record<string, number>;
  onAddChapterPoints: (chapterId: string, pts: number) => void;
  activeStudentAccount: StudentAccountProfile | null;
  onAccountChange: (account: StudentAccountProfile | null) => void;
  theme?: 'light' | 'midnight-chalkboard';
  onToggleTheme?: () => void;
}

type ModuleSlideId = 'videos' | 'text' | 'simulation' | 'game' | 'quiz';

const SLIDESHOW_SLIDES: Array<{
  id: ModuleSlideId;
  slideNumber: number;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'videos',
    slideNumber: 1,
    label: 'The Videos',
    subtitle: '6-Scene Animated Documentary Lesson',
    icon: Film,
  },
  {
    id: 'text',
    slideNumber: 2,
    label: 'The Text',
    subtitle: 'Concept Guide, Key Takeaways & Worked Example',
    icon: BookOpen,
  },
  {
    id: 'simulation',
    slideNumber: 3,
    label: 'The Simulation',
    subtitle: 'Interactive Hands-On Lab',
    icon: Sliders,
  },
  {
    id: 'game',
    slideNumber: 4,
    label: 'The Game',
    subtitle: 'Creative Playable Mini-Game',
    icon: Gamepad2,
  },
  {
    id: 'quiz',
    slideNumber: 5,
    label: 'Recap Quiz',
    subtitle: 'Recap Mastery Challenge & Badge',
    icon: Trophy,
  },
];

// 25-Second High-Level Chapter Gist Trailers (Only the big-picture gist, never the actual module lessons!)
const CHAPTER_GIST_TRAILERS: Record<
  string,
  {
    gistHeadline: string;
    gistCaption: string;
    gistNarration: string;
  }
> = {
  'ch1-square-cube': {
    gistHeadline: 'The Gist: 2D Squares & 3D Cubes',
    gistCaption: 'How numbers arrange into perfect squares and three-dimensional cubes',
    gistNarration:
      'Welcome to the big-picture gist of A Square and a Cube. At its heart, this chapter is about what happens when numbers multiply by themselves to form flat geometric squares and solid three-dimensional cubes. Select any module below when you are ready to dive into the full chapter.',
  },
  'ch2-power-play': {
    gistHeadline: 'The Gist: The Power of Exponential Growth',
    gistCaption: 'How repeated multiplication scales from microscopic cells to cosmic distances',
    gistNarration:
      'Here is the quick gist of Power Play. Instead of adding step by step, repeated multiplication launches numbers into explosive growth that can reach from tiny atoms to distant galaxies in just a few steps. Choose a module below to explore the full lessons.',
  },
  'ch3-story-numbers': {
    gistHeadline: 'The Gist: Humanity’s Journey to Zero',
    gistCaption: 'From ancient pebbles and tallies to the revolutionary Hindu place-value system',
    gistNarration:
      'This twenty-five second preview captures the gist of A Story of Numbers. Across thousands of years, human civilizations searched for a way to write any number effortlessly, culminating in the Indian invention of zero and place value. Open any module below to begin the journey.',
  },
  'ch4-quadrilaterals': {
    gistHeadline: 'The Gist: The Hidden Architecture of Four-Sided Shapes',
    gistCaption: 'How angles, sides, and diagonals govern every four-sided figure',
    gistNarration:
      'Welcome to the gist of Quadrilaterals. Every four-sided frame around us, from windows to soaring kites, is held together by a secret symmetry of diagonals and parallel sides. Pick a module below to investigate each shape in detail.',
  },
  'ch5-number-play': {
    gistHeadline: 'The Gist: The Detective Patterns Inside Whole Numbers',
    gistCaption: 'Uncovering parity, remainders, divisibility shortcuts, and number ciphers',
    gistNarration:
      'Here is the core gist of Number Play. Numbers are full of hidden rhythms that let you spot divisibility at a glance and crack disguised digit puzzles like a mathematician detective. Click any module below to enter the full lab.',
  },
  'ch6-we-distribute': {
    gistHeadline: 'The Gist: Turning Multiplication Into Visual Geometry',
    gistCaption: 'How splitting rectangles makes complex algebra effortless',
    gistNarration:
      'This brief preview gives you the gist of We Distribute, Yet Things Multiply. By viewing multiplication as the area of a split rectangle, tricky products transform into elegant visual patterns and mental math shortcuts. Open a module below to see how.',
  },
  'ch7-proportional-1': {
    gistHeadline: 'The Gist: Keeping the World in Fair Balance',
    gistCaption: 'How ratios and the ancient Rule of Three scale recipes, maps, and speeds',
    gistNarration:
      'Welcome to the gist of Proportional Reasoning. Whenever you resize a photograph, mix colors, or compare speeds, ratios ensure every part scales in harmony. Select any module below to explore the full chapter.',
  },
  'ch8-master-quiz': {
    gistHeadline: 'The Gist: The Grand Part I Synthesis',
    gistCaption: 'Bringing together numbers, geometry, algebra, and proportions',
    gistNarration:
      'Here is the twenty-five second gist of the Part One Capstone. This arena unites every big idea from Chapters One through Seven into interactive simulations and championship challenges. Choose a capstone module below to test your mastery.',
  },
  'ch4-fractions-disguise': {
    gistHeadline: 'The Gist: How Fractions Wear the Mask of Percentages',
    gistCaption: 'Comparing quantities on a universal scale of one hundred',
    gistNarration:
      'Welcome to the gist of Fractions in Disguise. Percentages are simply fractions standardized out of one hundred, giving us a universal lens to understand discounts, inflation, and everyday growth. Select a module below to explore the full chapter.',
  },
  'ch5-baudhayana-pythagoras': {
    gistHeadline: 'The Gist: The Ancient Rope Secret of Right Triangles',
    gistCaption: 'How the squares on two perpendicular sides merge into the diagonal square',
    gistNarration:
      'Here is the big-picture gist of The Baudhayana-Pythagoras Theorem. Long before modern calculators, ancient geometry builders discovered that the diagonal of a rectangle links the areas of squares in unbreakable harmony. Open any module below to see the proofs.',
  },
  'ch6-proportional-reasoning': {
    gistHeadline: 'The Gist: Scaling Maps, Data Sectors, and Inverse Rates',
    gistCaption: 'Connecting real-world maps, pie charts, and inverse relationships',
    gistNarration:
      'This twenty-five second preview shares the gist of Proportional Reasoning Part Two. From shrinking entire continents onto paper maps to balancing speed against travel time, proportions govern how quantities interact. Pick a module below to dive in.',
  },
  'ch11-geometric-themes': {
    gistHeadline: 'The Gist: Infinite Fractals & Folding 3D Worlds',
    gistCaption: 'Self-repeating patterns in nature, temple spires, and three-dimensional solids',
    gistNarration:
      'Welcome to the gist of Exploring Some Geometric Themes. Here we discover how simple shapes repeat infinitely inside snowflakes and temple architecture, and how flat paper nets fold into three-dimensional solids. Choose a module below to begin.',
  },
  'ch12-dots-and-lines': {
    gistHeadline: 'The Gist: Turning Raw Data Into Visual Stories',
    gistCaption: 'Finding the balance point of numbers and reading trends across time',
    gistNarration:
      'Here is the quick gist of Tales by Dots and Lines. Every collection of numbers tells a story when we locate its center of balance and trace its movement across graphs and maps. Open any module below to explore the data lab.',
  },
  'ch13-algebra-play': {
    gistHeadline: 'The Gist: X-Ray Vision for Number Tricks & Puzzles',
    gistCaption: 'How a single letter variable exposes the secret behind mind-reading games',
    gistNarration:
      'This twenty-five second trailer gives you the gist of Algebra Play. Algebra acts like X-ray vision, revealing why birthday mind-reading tricks, number pyramids, and calendar squares always work without fail. Select a module below to unlock the secrets.',
  },
  'ch14-area': {
    gistHeadline: 'The Gist: The Art of Slicing and Rearranging Space',
    gistCaption: 'How every polygon transforms into a simple rectangle or triangle',
    gistNarration:
      'Welcome to the gist of Area. Instead of memorizing disconnected formulas, you will see how any triangle, parallelogram, kite, or trapezium can be sliced and rearranged into a familiar rectangle. Click any module below to start exploring.',
  },
  'part2-ch8-master-quiz': {
    gistHeadline: 'The Gist: The Grand Part II Synthesis (30 Questions)',
    gistCaption: 'Uniting percentages, Pythagoras, proportions, fractals, data, algebra, and area',
    gistNarration:
      'Welcome to the Part Two Grand Mastery Quiz. Complete this thirty-question randomized championship across all seven Part Two chapters to earn Grand Quiz Badge number one hundred and fourteen!',
  },
};

export const Part1ChapterHub: React.FC<Part1ChapterHubProps> = ({
  allChapters,
  activeChapterId,
  onSelectChapterId,
  onOpenAllChaptersModal,
  masteryPoints,
  onAddPoints,
  unlockedBadgeIds,
  onUnlockBadge,
  onOpenTrophyRoom,
  onOpenBossBattle,
  chapterGamePoints,
  onAddChapterPoints,
  activeStudentAccount,
  onAccountChange,
  theme = 'light',
  onToggleTheme,
}) => {
  const slideshowSectionRef = useRef<HTMLDivElement | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);

  const unlockedSet = useMemo(() => new Set(unlockedBadgeIds), [unlockedBadgeIds]);
  const prereqUnlockedCount = useMemo(
    () => PREREQUISITE_BADGE_IDS.filter((id) => unlockedSet.has(id)).length,
    [unlockedSet]
  );
  const isCellarKeyUnlocked =
    PREREQUISITE_BADGE_IDS.length === 114 &&
    prereqUnlockedCount === PREREQUISITE_BADGE_IDS.length;

  const part2Chapters = useMemo(
    () => allChapters.filter((ch) => ch.partLabel === 'Part II'),
    [allChapters]
  );

  const isPart2Active = useMemo(
    () =>
      activeChapterId === 'part2-ch8-master-quiz' ||
      part2Chapters.some((ch) => ch.id === activeChapterId),
    [part2Chapters, activeChapterId]
  );

  const activeCurriculum: Part1ChapterCurriculum = useMemo(() => {
    const part1Match = getPart1CurriculumById(
      activeChapterId as ChapterId | 'ch8-master-quiz'
    );
    if (part1Match) return part1Match;

    const part2Direct = getPart2CurriculumById(activeChapterId);
    if (part2Direct) return part2Direct;

    const part2Match = allChapters.find((ch) => ch.id === activeChapterId);
    if (part2Match) {
      return buildPart2CurriculumFromChapter(part2Match);
    }
    return PART1_CURRICULUM_CHAPTERS[0];
  }, [activeChapterId, allChapters]);

  const [selectedModuleCode, setSelectedModuleCode] = useState<string | null>(null);
  const [lastHighlightedModuleCode, setLastHighlightedModuleCode] = useState<string>(
    activeCurriculum.modules[0]?.moduleCode || 'Module 1.1'
  );
  const [visitedModules, setVisitedModules] = useState<Record<string, boolean>>({});
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [is112HubOpen, setIs112HubOpen] = useState<boolean>(false);
  const [hubInitialTab, setHubInitialTab] = useState<'games' | 'simulations'>('games');

  const handleLaunch112Module = (
    targetChapterId: string,
    targetModuleCode: string,
    targetSlideIdx: 2 | 3
  ) => {
    onSelectChapterId(targetChapterId);
    setSelectedModuleCode(targetModuleCode);
    setActiveSlideIndex(targetSlideIdx);
    setTimeout(() => {
      slideshowSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  useEffect(() => {
    setSelectedModuleCode(null);
    setLastHighlightedModuleCode(
      activeCurriculum.modules[0]?.moduleCode || 'Module 1.1'
    );
    setActiveSlideIndex(0);
  }, [activeChapterId, activeCurriculum.modules]);

  // Validate that selectedModuleCode actually belongs to the activeCurriculum
  const effectiveSelectedModuleCode = useMemo(() => {
    if (!selectedModuleCode) return null;
    return activeCurriculum.modules.some((m) => m.moduleCode === selectedModuleCode)
      ? selectedModuleCode
      : null;
  }, [activeCurriculum.modules, selectedModuleCode]);

  const activeModuleIndex = useMemo(() => {
    if (activeCurriculum.modules.length === 0) return 0;
    const targetCode = effectiveSelectedModuleCode || lastHighlightedModuleCode;
    const foundIdx = activeCurriculum.modules.findIndex(
      (m) => m.moduleCode === targetCode
    );
    return foundIdx >= 0 ? foundIdx : 0;
  }, [activeCurriculum.modules, effectiveSelectedModuleCode, lastHighlightedModuleCode]);

  const activeModule: Part1ModuleItem | undefined = useMemo(
    () => activeCurriculum.modules[activeModuleIndex] || activeCurriculum.modules[0],
    [activeCurriculum.modules, activeModuleIndex]
  );

  const activeSlide = SLIDESHOW_SLIDES[activeSlideIndex] || SLIDESHOW_SLIDES[0];

  const handleOpenModuleSlideshow = (
    moduleItem: Part1ModuleItem,
    initialSlideIdx = 0
  ) => {
    const visitKey = `${activeCurriculum.chapterId}:${moduleItem.moduleCode}`;
    setVisitedModules((prev) => ({ ...prev, [visitKey]: true }));
    setLastHighlightedModuleCode(moduleItem.moduleCode);
    setSelectedModuleCode(moduleItem.moduleCode);
    setActiveSlideIndex(initialSlideIdx);

    setTimeout(() => {
      slideshowSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 60);
  };

  const handleStepSlide = (delta: number) => {
    const nextSlide = activeSlideIndex + delta;
    if (nextSlide >= 0 && nextSlide < SLIDESHOW_SLIDES.length) {
      setActiveSlideIndex(nextSlide);
      return;
    }
    // If on the final slide ("The Game") and clicking Next, advance to the next module's slideshow
    if (nextSlide >= SLIDESHOW_SLIDES.length) {
      const nextModIdx = activeModuleIndex + 1;
      if (nextModIdx < activeCurriculum.modules.length) {
        handleOpenModuleSlideshow(activeCurriculum.modules[nextModIdx], 0);
      }
    } else if (nextSlide < 0 && activeModuleIndex > 0) {
      handleOpenModuleSlideshow(
        activeCurriculum.modules[activeModuleIndex - 1],
        SLIDESHOW_SLIDES.length - 1
      );
    }
  };

  const switcherItems = useMemo(() => {
    if (!isPart2Active) {
      return PART1_CURRICULUM_CHAPTERS.map((ch) => ({
        id: ch.chapterId,
        number: ch.chapterIndex,
        title: ch.title,
      }));
    }
    return [
      ...part2Chapters.map((ch) => ({
        id: ch.id,
        number: ch.chapterNumber,
        title: ch.title,
      })),
      {
        id: 'part2-ch8-master-quiz',
        number: 8,
        title: 'Part II Mastery Quiz (30Q)',
      },
    ];
  }, [isPart2Active, part2Chapters]);

  const activeModuleBadge = useMemo(() => {
    if (!activeModule) return undefined;
    const badgeId = getModuleBadgeId(activeCurriculum.chapterId, activeModule.moduleCode);
    return ALL_MASTERY_BADGES.find((b) => b.id === badgeId);
  }, [activeCurriculum.chapterId, activeModule]);

  const activeQuizBadge = useMemo(() => {
    const qId = getQuizBadgeId(activeCurriculum.chapterId);
    return ALL_MASTERY_BADGES.find((b) => b.id === qId);
  }, [activeCurriculum.chapterId]);

  // 25-Second Chapter Gist Intro Video (ONLY the high-level gist of the chapter, never the actual module lessons!)
  const chapterIntroVideoCue = useMemo(() => {
    const gist = CHAPTER_GIST_TRAILERS[activeCurriculum.chapterId] || {
      gistHeadline: `The Gist of ${activeCurriculum.title}`,
      gistCaption: activeCurriculum.heroSubtitle,
      gistNarration: `Welcome to the twenty-five second gist of ${activeCurriculum.title}. ${activeCurriculum.heroSubtitle} Select any module below when you are ready to explore the full chapter.`,
    };
    return {
      title: `${activeCurriculum.title} — 25s Chapter Gist`,
      duration: '0:25',
      durationSeconds: 25,
      summary: gist.gistNarration,
      readingParagraphs: [gist.gistNarration],
      keyTakeaways: [gist.gistHeadline, gist.gistCaption],
      workedExample: {
        problem: gist.gistHeadline,
        steps: [gist.gistCaption],
        answer: activeCurriculum.title,
      },
      scenes: [
        {
          sceneNumber: 1,
          timeRange: '0:00 – 0:25',
          title: gist.gistHeadline,
          narration: gist.gistNarration,
          boardFormula: gist.gistHeadline,
          visualCaption: gist.gistCaption,
        },
      ],
    };
  }, [activeCurriculum]);

  return (
    <div className="w-full space-y-6 relative">

      {/* Streamlined, Readable Top Navigation Ribbon */}
      <header
        aria-label="Chapter Controls & Tools"
        className="w-full flex flex-wrap items-center justify-between gap-3 px-1 py-1"
      >
        {/* Left: Chapters Picker + Compact Part I / Part II Volume Switch */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAllChaptersModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-white hover:bg-stone-50 text-stone-800 border-2 border-stone-200 text-xs sm:text-sm font-black transition-all cursor-pointer shadow-2xs hover:shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            title="Browse All 14 Chapters"
          >
            <LayoutGrid className="w-4 h-4 text-[#00B4A7]" />
            <span>Chapters</span>
            <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-full border border-teal-200 hidden sm:inline">
              {isPart2Active ? `Part II · Ch ${activeCurriculum.chapterIndex}` : `Ch ${activeCurriculum.chapterIndex}`}
            </span>
          </button>

          {/* Compact Part I / Part II Switch */}
          <div className="inline-flex items-center p-0.5 rounded-full bg-stone-200/80 border border-stone-300 shadow-inner">
            <button
              type="button"
              onClick={() => onSelectChapterId(PART1_CURRICULUM_CHAPTERS[0].chapterId)}
              className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                !isPart2Active
                  ? 'bg-[#00B4A7] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              Part I
            </button>
            <button
              type="button"
              onClick={() => {
                if (part2Chapters[0]) onSelectChapterId(part2Chapters[0].id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                isPart2Active
                  ? 'bg-[#00B4A7] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              Part II
            </button>
          </div>
        </div>

        {/* Center: Creative Circular Universe Progress Astrolabe */}
        <div className="flex items-center justify-center">
          <CircularUniverseProgress
            unlockedBadgeIds={unlockedBadgeIds}
            activeChapterId={activeCurriculum.chapterId}
            onSelectChapter={onSelectChapterId}
            onOpen112Hub={(tab) => {
              setHubInitialTab(tab);
              setIs112HubOpen(true);
            }}
          />
        </div>

        {/* Right: Consolidated Tools & Inline Classroom Switch */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 112 Hub Fast Launch */}
          <button
            type="button"
            onClick={() => {
              setHubInitialTab('games');
              setIs112HubOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs transition-all cursor-pointer shadow-2xs hover:scale-105"
            title="Browse all 112 Games & 112 Simulations"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">112 Arcade & Labs</span>
            <span className="sm:hidden">112 Hub</span>
          </button>

          {/* Trophy Room Counter */}
          <button
            type="button"
            onClick={onOpenTrophyRoom}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-black transition-all cursor-pointer shadow-2xs"
            title="Open Trophy Room"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span className="tabular-nums">{unlockedBadgeIds.length}/115</span>
          </button>

          {/* Cellar Boss */}
          <button
            type="button"
            onClick={() => {
              if (isCellarKeyUnlocked) {
                onOpenBossBattle();
              } else {
                onOpenTrophyRoom();
              }
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-2xs ${
              isCellarKeyUnlocked
                ? 'bg-[#1E1430] hover:bg-[#2A1C42] text-amber-300 border border-amber-400'
                : 'bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700'
            }`}
            title="Cellar Boss Battle"
          >
            {isCellarKeyUnlocked ? (
              <Key className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span className="hidden md:inline">Boss</span>
          </button>

          {/* Student Account */}
          <button
            type="button"
            onClick={() => setIsAccountModalOpen(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-2xs ${
              activeStudentAccount
                ? 'bg-[#12352B] hover:bg-[#1A4B3D] text-amber-300 border border-teal-500/50'
                : 'bg-emerald-50 hover:bg-emerald-100 text-[#0F766E] border border-emerald-300'
            }`}
            title="Student Account & Cloud Save"
          >
            <span>{activeStudentAccount?.mascot || '👤'}</span>
            <span className="max-w-[75px] truncate hidden sm:inline">
              {activeStudentAccount ? activeStudentAccount.username : 'Account'}
            </span>
          </button>

          {/* NCERT PDF Link */}
          <a
            href={activeCurriculum.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-stone-200 text-xs font-bold transition-all shadow-2xs hidden lg:inline-flex"
            title="Open NCERT Textbook PDF"
          >
            <FileText className="w-3.5 h-3.5 text-[#00B4A7]" />
            <span>PDF</span>
          </a>

          {/* Inline Classroom Light Switch (Never overlaps content!) */}
          {onToggleTheme && (
            <ClassroomThemeSwitch
              theme={theme}
              onToggleTheme={onToggleTheme}
              variant="inline"
            />
          )}
        </div>
      </header>

      {/* Main Chapter Stage with Itza-Style Animated Chapter Banner */}
      <div className="w-full space-y-7 relative z-10">
        <AnimatedChapterBanner
          chapterId={activeCurriculum.chapterId}
          chapterIndex={activeCurriculum.chapterIndex}
          partLabel={isPart2Active ? 'Part II' : 'Part I'}
          title={activeCurriculum.title}
          subtitle={activeCurriculum.heroSubtitle}
          ribbonText={activeCurriculum.heroRibbonText}
          moduleCount={activeCurriculum.modules.length}
          selectedModuleCode={effectiveSelectedModuleCode}
          chapters={switcherItems}
          onSelectChapter={onSelectChapterId}
        />

        {/* Level Progress Indicator for Current Chapter with Animated Filling Badges */}
        <ChapterLevelProgress
          chapterId={activeCurriculum.chapterId}
          chapterTitle={activeCurriculum.title}
          chapterIndex={activeCurriculum.chapterIndex}
          chapterGamePoints={chapterGamePoints[activeCurriculum.chapterId] || 0}
          unlockedBadgeIds={unlockedBadgeIds}
          onSelectModule={(modCode) => {
            const mod = activeCurriculum.modules.find((m) => m.moduleCode === modCode);
            if (mod) handleOpenModuleSlideshow(mod, 3); // Jump straight to Slide 4 (The Game!)
          }}
          onOpenTrophyRoom={onOpenTrophyRoom}
        />

        {/* When viewing a module, show a clean jump strip */}
        {effectiveSelectedModuleCode && activeModule && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border-2 border-stone-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setSelectedModuleCode(null)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-black transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All 8 Modules</span>
            </button>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-stone-500 mr-1 uppercase tracking-wider text-[11px]">
                Jump to Module:
              </span>
              {activeCurriculum.modules.map((mod, idx) => {
                const isCurrent = mod.moduleCode === activeModule?.moduleCode;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => handleOpenModuleSlideshow(mod, 0)}
                    title={`${mod.moduleCode}: ${mod.title}`}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-colors cursor-pointer tabular-nums ${
                      isCurrent
                        ? 'bg-[#00B4A7] text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    M{idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ALWAYS AT THE TOP OF WORKSPACE: 25-SECOND CHAPTER INTRO VIDEO */}
        <section
          aria-label="Chapter Intro Video"
          className="rounded-3xl bg-white border-2 border-stone-200/90 shadow-md p-5 sm:p-6 space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#0F766E]">
              <Film className="w-4 h-4" />
              <span>
                Chapter {activeCurriculum.chapterIndex} Gist Intro (0:25) —{' '}
                {formatMathText(activeCurriculum.title)}
              </span>
            </span>
            {effectiveSelectedModuleCode && (
              <button
                type="button"
                onClick={() => setSelectedModuleCode(null)}
                className="text-xs font-bold text-[#0F766E] hover:underline cursor-pointer"
              >
                ← Back to All 8 Modules
              </button>
            )}
          </div>

          <Part1VideoPlayer
            moduleCode={`Chapter ${activeCurriculum.chapterIndex} Intro`}
            moduleTitle={`The Gist of ${activeCurriculum.title}`}
            chapterTitle={activeCurriculum.title}
            videoCue={chapterIntroVideoCue}
            showStudyNotes={false}
            isChapterIntro={true}
          />
        </section>

        {/* ===================================================================
            BELOW THE INTRO VIDEO:
            - IF A MODULE IS OPEN -> 4-SLIDE MODULE SLIDESHOW (VIDEOS, TEXT, SIMULATION, GAME)
            - IF NO MODULE IS OPEN -> CLEAN 8-MODULE SELECTION GRID
           =================================================================== */}
        <div ref={slideshowSectionRef} className="scroll-mt-6">
          {effectiveSelectedModuleCode && activeModule ? (
            /* =================================================================
               MODULE SLIDESHOW VIEW (4 SLIDES: THE VIDEOS, THE TEXT, THE SIMULATION, THE GAME)
               ================================================================= */
            <section
              aria-label={`${activeModule.moduleCode} Interactive Slideshow`}
              className="rounded-3xl bg-white border-2 border-stone-200 shadow-lg overflow-hidden"
            >
              {/* Reimagined Module Visual Banner above the open module */}
              <div className="h-36 sm:h-40 w-full relative overflow-hidden border-b border-stone-200">
                <ModuleTitleArtwork
                  chapterId={activeCurriculum.chapterId}
                  moduleCode={activeModule.moduleCode}
                  moduleTitle={activeModule.title}
                  moduleIndex={activeModuleIndex}
                />
              </div>

              {/* Clean Warm Desk Slideshow Header (Replaced old dark-blue bar!) */}
              <div className="bg-[#FAF6EE] px-6 py-5 border-b border-stone-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
                      {activeModule.moduleCode} Interactive Slideshow · Slide{' '}
                      {activeSlideIndex + 1} of {SLIDESHOW_SLIDES.length}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                      {formatMathText(activeModule.title)}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedModuleCode(null)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold border border-stone-300 transition-colors cursor-pointer self-start sm:self-center shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#0F766E]" />
                    <span>All 8 Modules</span>
                  </button>
                </div>

                {/* 5-Slide Navigation Tabs: 1. The Videos | 2. The Text | 3. The Simulation | 4. The Game | 5. Recap Quiz */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
                  {SLIDESHOW_SLIDES.map((slide, sIdx) => {
                    const Icon = slide.icon;
                    const isCurrentSlide = sIdx === activeSlideIndex;
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setActiveSlideIndex(sIdx)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl text-left transition-all cursor-pointer border ${
                          isCurrentSlide
                            ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm font-extrabold'
                            : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200 font-semibold'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                            isCurrentSlide
                              ? 'bg-white/20 text-white'
                              : 'bg-stone-100 text-[#0F766E]'
                          }`}
                        >
                          {slide.slideNumber}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm truncate">
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{slide.label}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Slide Stage Banner */}
              <div className="bg-stone-100/80 px-6 py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0F766E]">
                  <span>
                    Slide {activeSlide.slideNumber} of {SLIDESHOW_SLIDES.length}:{' '}
                    {activeSlide.label}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-stone-600 font-medium">
                    {activeSlide.subtitle}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStepSlide(-1)}
                    disabled={activeSlideIndex === 0 && activeModuleIndex === 0}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-200 disabled:opacity-40 text-stone-800 border border-stone-300 text-xs font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev Slide</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStepSlide(1)}
                    disabled={
                      activeSlideIndex === SLIDESHOW_SLIDES.length - 1 &&
                      activeModuleIndex === activeCurriculum.modules.length - 1
                    }
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span>
                      {activeSlideIndex < SLIDESHOW_SLIDES.length - 1
                        ? 'Next Slide'
                        : 'Next Module'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ===============================================================
                  SLIDESHOW CONTENT AREA (Renders ONLY the active slide!)
                 =============================================================== */}
              <div className="p-6 sm:p-8 bg-[#FAF6EE]/60">
                {/* SLIDE 1: THE TEXT (Concept Guide, Key Takeaways & Worked Example) */}
                {activeSlide.id === 'text' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-xs space-y-5">
                      <div className="flex items-center gap-2 text-[#0F766E] font-bold text-xs uppercase tracking-wider">
                        <BookOpen className="w-4 h-4" />
                        <span>
                          {activeModule.moduleCode} Reading Guide ·{' '}
                          {formatMathText(activeModule.title)}
                        </span>
                      </div>

                      <h3 className="text-2xl font-extrabold text-stone-900">
                        {formatMathText(activeModule.title)}
                      </h3>

                      <div className="space-y-3.5 text-stone-700 leading-relaxed text-base">
                        {activeModule.videoCue.readingParagraphs.map(
                          (paragraph: string, idx: number) => (
                            <p key={idx}>{formatMathText(paragraph)}</p>
                          )
                        )}
                      </div>

                      <div className="pt-4 border-t border-stone-200 space-y-2.5">
                        <div className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                          Key Mathematical Takeaways
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {activeModule.videoCue.keyTakeaways.map(
                            (item: string, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 p-3.5 rounded-2xl bg-[#F0FDFA] border border-[#99F6E4] text-[#115E59] text-xs font-semibold"
                              >
                                <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                                <span>{formatMathText(item)}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-[#12352B] text-white rounded-3xl p-6 md:p-8 border border-[#2DD4BF]/30 shadow-xs flex flex-col justify-between space-y-5">
                      <div className="space-y-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold uppercase tracking-wider">
                          Step-by-Step Worked Example
                        </span>
                        <h4 className="text-xl font-bold leading-snug">
                          {formatMathText(
                            activeModule.videoCue.workedExample.problem
                          )}
                        </h4>
                        <div className="space-y-2.5 pt-1">
                          {activeModule.videoCue.workedExample.steps.map(
                            (step: string, i: number) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 p-3 rounded-xl bg-black/25 border border-white/10 text-sm text-emerald-100"
                              >
                                <span className="w-6 h-6 rounded-full bg-[#2DD4BF] text-[#042F2E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <span>{formatMathText(step)}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-400/15 border border-amber-300/40 text-amber-200 font-bold text-base">
                        Answer:{' '}
                        {formatMathText(
                          activeModule.videoCue.workedExample.answer
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fun Mathematical Interpretation & "Aha!" Intuitive Model Card */}
                  {(() => {
                    const funInterpretation = getModuleFunInterpretation(
                      activeModule.moduleCode,
                      activeModule.title,
                      activeModule.simulation.formulaHighlight,
                      activeCurriculum.title
                    );
                    return (
                      <div className="mt-6 rounded-3xl bg-gradient-to-br from-[#FFFDF7] via-[#FEF9ED] to-[#FEF3C7]/60 border-2 border-amber-200 shadow-sm p-6 sm:p-8 space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 pb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl p-2 rounded-2xl bg-white border border-amber-200 shadow-2xs">
                              {funInterpretation.funEmoji}
                            </span>
                            <div>
                              <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                <span>Intuitive Interpretation & Mental Model · {activeModule.moduleCode}</span>
                              </div>
                              <h4 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mt-0.5">
                                {funInterpretation.headline}
                              </h4>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold">
                            ✨ Delightful Math Intuition
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* 1. Playful Analogy Story */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200/90 shadow-2xs space-y-2">
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-800">
                              <span>📖</span>
                              <span>Playful Analogy Story</span>
                            </div>
                            <p className="text-stone-700 text-sm leading-relaxed">
                              {funInterpretation.analogyStory}
                            </p>
                          </div>

                          {/* 2. Intuitive Secret / Mental Model */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#F0FDFA] to-[#CCFBF1]/50 border border-[#99F6E4] shadow-2xs space-y-2">
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0F766E]">
                              <Lightbulb className="w-4 h-4 text-[#0D9488]" />
                              <span>The "Aha!" Secret Key</span>
                            </div>
                            <p className="text-[#115E59] text-sm leading-relaxed font-semibold">
                              {funInterpretation.intuitiveSecret}
                            </p>
                          </div>

                          {/* 3. Math Superpower / Party Trick */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] border border-amber-300 shadow-2xs space-y-2">
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900">
                              <Zap className="w-4 h-4 text-amber-600" />
                              <span>Math Superpower / Party Trick</span>
                            </div>
                            <p className="text-amber-950 text-sm leading-relaxed font-semibold">
                              {funInterpretation.partyTrickOrProTip}
                            </p>
                          </div>
                        </div>

                        {funInterpretation.quoteTag && (
                          <div className="p-3.5 rounded-2xl bg-amber-400/15 border border-amber-300/60 text-stone-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
                            <Quote className="w-4 h-4 text-amber-700 shrink-0" />
                            <span className="italic">"{funInterpretation.quoteTag}"</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
                )}

                {/* SLIDE 2: THE VIDEOS (Dedicated Module Documentary Video Player) */}
                {activeSlide.id === 'videos' && (
                  <Part1VideoPlayer
                    moduleCode={activeModule.moduleCode}
                    moduleTitle={activeModule.title}
                    chapterTitle={activeCurriculum.title}
                    videoCue={activeModule.videoCue}
                    showStudyNotes={false}
                  />
                )}

                {/* SLIDE 3: THE SIMULATION (Interactive Mathematical Hands-on Lab) */}
                {activeSlide.id === 'simulation' && (
                  <Part1ModuleSimAndGame
                    moduleCode={activeModule.moduleCode}
                    moduleId={activeModule.id}
                    chapterId={activeCurriculum.chapterId}
                    simulation={activeModule.simulation}
                    game={activeModule.game}
                    mode="simulation"
                    onGoToGame={() => setActiveSlideIndex(3)}
                  />
                )}

                {/* SLIDE 4: THE GAME (Creative Playable Mini-Game) */}
                {activeSlide.id === 'game' && (
                  <Part1ModuleSimAndGame
                    moduleCode={activeModule.moduleCode}
                    moduleId={activeModule.id}
                    chapterId={activeCurriculum.chapterId}
                    simulation={activeModule.simulation}
                    game={activeModule.game}
                    mode="game"
                    onGoToQuiz={() => setActiveSlideIndex(4)}
                    onAddGamePoints={(pts) => onAddChapterPoints(activeCurriculum.chapterId, pts)}
                  />
                )}

                {/* SLIDE 5: RECAP QUIZ (Recap Mastery Challenge — Awards Module Mastery Badge!) */}
                {activeSlide.id === 'quiz' && (
                  <Part1ModuleSimAndGame
                    moduleCode={activeModule.moduleCode}
                    moduleId={activeModule.id}
                    chapterId={activeCurriculum.chapterId}
                    simulation={activeModule.simulation}
                    game={activeModule.game}
                    mode="quiz"
                    badge={activeModuleBadge}
                    isBadgeUnlocked={Boolean(
                      activeModuleBadge && unlockedSet.has(activeModuleBadge.id)
                    )}
                    onUnlockBadge={onUnlockBadge}
                    isLastModule={activeModuleIndex === activeCurriculum.modules.length - 1}
                  />
                )}
              </div>

              {/* Bottom Slideshow Footer: Prev Slide / Dots / Next Slide */}
              <div className="px-6 py-4 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => handleStepSlide(-1)}
                  disabled={activeSlideIndex === 0 && activeModuleIndex === 0}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-800 text-xs sm:text-sm font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>
                    {activeSlideIndex > 0
                      ? `Previous: ${SLIDESHOW_SLIDES[activeSlideIndex - 1].label}`
                      : 'Previous Module'}
                  </span>
                </button>

                {/* Slide Dots */}
                <div className="flex items-center gap-2">
                  {SLIDESHOW_SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      title={`Slide ${idx + 1}: ${s.label}`}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        idx === activeSlideIndex
                          ? 'w-8 bg-[#0F766E]'
                          : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleStepSlide(1)}
                  disabled={
                    activeSlideIndex === SLIDESHOW_SLIDES.length - 1 &&
                    activeModuleIndex === activeCurriculum.modules.length - 1
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
                >
                  <span>
                    {activeSlideIndex < SLIDESHOW_SLIDES.length - 1
                      ? `Next: ${SLIDESHOW_SLIDES[activeSlideIndex + 1].label}`
                      : `Next Module (${
                          activeCurriculum.modules[activeModuleIndex + 1]?.moduleCode || ''
                        })`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          ) : activeCurriculum.modules.length === 0 ? (
            /* =================================================================
               30-QUESTION GRAND MASTERY QUIZ VIEW (NO MODULES! DIRECT 30Q QUIZ)
               Used by Part I Mastery Quiz (ch8-master-quiz) & Part II Mastery Quiz (part2-ch8-master-quiz)
               ================================================================= */
            <Part1ChapterQuiz
              chapterId={
                activeCurriculum.chapterId as
                  | ChapterId
                  | 'ch8-master-quiz'
                  | 'part2-ch8-master-quiz'
              }
              chapterTitle={activeCurriculum.title}
              baseQuestions={activeCurriculum.questionnaire}
              quizBadge={activeQuizBadge}
              isQuizBadgeUnlocked={Boolean(
                activeQuizBadge && unlockedSet.has(activeQuizBadge.id)
              )}
              onUnlockBadge={onUnlockBadge}
              onCompleteQuiz={(score) => {
                onAddPoints(Math.min(25, score * 2));
              }}
            />
          ) : (
            /* =================================================================
               CLEAN 8-MODULE SELECTION GRID (WHEN NO MODULE IS OPEN)
               With polite side indicator instead of heavy full-card selected box!
               ================================================================= */
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                  Chapter {activeCurriculum.chapterIndex} Modules (1–8)
                </h2>
                <span className="text-xs sm:text-sm font-semibold text-stone-600">
                  Earn each module’s Mastery Badge on Slide 4 ("The Game")!
                </span>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {activeCurriculum.modules.map((mod, idx) => {
                  const isHighlighted = mod.moduleCode === activeModule?.moduleCode;
                  const isVisited = Boolean(
                    visitedModules[`${activeCurriculum.chapterId}:${mod.moduleCode}`]
                  );
                  const modBadgeId = getModuleBadgeId(
                    activeCurriculum.chapterId,
                    mod.moduleCode
                  );
                  const modBadge = ALL_MASTERY_BADGES.find((b) => b.id === modBadgeId);
                  const hasBadge = unlockedSet.has(modBadgeId);

                  return (
                    <article
                      key={mod.id}
                      onClick={() => handleOpenModuleSlideshow(mod, 0)}
                      className="group relative rounded-2xl overflow-hidden bg-white flex flex-col min-h-[245px] cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg border border-stone-200/90 shadow-xs"
                    >
                      {/* Polite Side Indicator Bar on the left edge when active */}
                      {isHighlighted && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0F766E] z-20"
                          title="Active module in side rail"
                        />
                      )}

                      <div className="flex flex-col sm:flex-row flex-1 min-w-0">
                        <div className="h-44 sm:h-auto w-full sm:w-[46%] sm:min-h-[245px] shrink-0 relative overflow-hidden">
                          <ModuleTitleArtwork
                            chapterId={activeCurriculum.chapterId}
                            moduleCode={mod.moduleCode}
                            moduleTitle={mod.title}
                            moduleIndex={idx}
                          />
                          {/* Module Badge Pill in corner */}
                          {modBadge && (
                            <div
                              className={`absolute top-2 right-2 z-10 rounded-lg px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow-sm ${
                                hasBadge
                                  ? 'bg-amber-400 text-stone-950'
                                  : 'bg-black/65 text-white/90 backdrop-blur-xs'
                              }`}
                            >
                              <span>{modBadge.emblemGlyph}</span>
                              <span>#{modBadge.badgeNumber}</span>
                              {hasBadge && <span>✓</span>}
                            </div>
                          )}
                        </div>

                        <div className="h-1 w-full sm:h-auto sm:w-1 sm:shrink-0 bg-[#14B8A6]/70" />

                        <div className="p-5 sm:p-6 space-y-2 flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#0F766E]">
                            <span>{mod.moduleCode}</span>
                            <div className="flex items-center gap-1.5">
                              {hasBadge ? (
                                <span className="text-amber-700 font-bold">
                                  🏆 Badge Earned
                                </span>
                              ) : isVisited ? (
                                <span className="text-emerald-700 font-semibold">
                                  ✓ Explored
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <h3 className="text-base sm:text-lg font-extrabold text-stone-950 leading-snug line-clamp-2">
                            {formatMathText(mod.title)}
                          </h3>
                          <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                            {formatMathText(mod.cardTeaser)}
                          </p>

                          {/* Quick Launch Chips for Slide 3 Simulation & Slide 4 Game */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenModuleSlideshow(mod, 2); // Jump to Slide 3: The Simulation!
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#0F766E] border border-teal-200 text-[10px] font-bold transition cursor-pointer"
                              title={`Launch Simulation: ${mod.simulation.title}`}
                            >
                              <Sliders className="w-3 h-3" />
                              <span className="truncate max-w-[140px]">Sim: {mod.simulation.title}</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenModuleSlideshow(mod, 3); // Jump to Slide 4: The Game!
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-[10px] font-bold transition cursor-pointer"
                              title={`Play Game: ${mod.game.title}`}
                            >
                              <Gamepad2 className="w-3 h-3" />
                              <span className="truncate max-w-[140px]">Game: {mod.game.title}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="px-5 pb-4 pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-stone-500">
                          Slide 4 → Badge #{modBadge?.badgeNumber}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0F766E] group-hover:translate-x-0.5 transition-transform">
                          <span>Open Slideshow (5 Slides)</span>
                          <Play className="w-3 h-3 fill-current" />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Student Account Registration & Progress Saving Modal (NO EMAIL REQUIRED) */}
      <StudentAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        activeAccount={activeStudentAccount}
        onAccountChange={onAccountChange}
        currentPoints={masteryPoints}
        unlockedBadgeIds={unlockedBadgeIds}
        chapterGamePoints={chapterGamePoints}
      />

      {/* Complete 112 Games Arcade & Simulations Lab Gallery Modal */}
      <All112HubModal
        isOpen={is112HubOpen}
        onClose={() => setIs112HubOpen(false)}
        initialTab={hubInitialTab}
        onLaunchModule={handleLaunch112Module}
      />
    </div>
  );
};
