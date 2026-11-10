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
} from 'lucide-react';
import { ChapterId, GanitaChapter, MathHomeworkSolution } from '../types/math';
import { Part1ChapterCurriculum, Part1ModuleItem } from '../types/part1Curriculum';
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
}

type ModuleSlideId = 'text' | 'videos' | 'simulation' | 'game';

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
    subtitle: 'Interactive Mathematical Lab',
    icon: Sliders,
  },
  {
    id: 'game',
    slideNumber: 4,
    label: 'The Game',
    subtitle: 'Interactive Module Challenge',
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
  onAddPoints,
  unlockedBadgeIds,
  onUnlockBadge,
  onOpenTrophyRoom,
  onOpenBossBattle,
}) => {
  const slideshowSectionRef = useRef<HTMLDivElement | null>(null);

  const unlockedSet = useMemo(() => new Set(unlockedBadgeIds), [unlockedBadgeIds]);
  const prereqUnlockedCount = useMemo(
    () => PREREQUISITE_BADGE_IDS.filter((id) => unlockedSet.has(id)).length,
    [unlockedSet]
  );
  const isCellarKeyUnlocked = prereqUnlockedCount >= 114;

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

  useEffect(() => {
    setSelectedModuleCode(null);
    setLastHighlightedModuleCode(
      activeCurriculum.modules[0]?.moduleCode || 'Module 1.1'
    );
    setActiveSlideIndex(0);
  }, [activeChapterId, activeCurriculum.modules]);

  const activeModuleIndex = useMemo(() => {
    const targetCode = selectedModuleCode || lastHighlightedModuleCode;
    const foundIdx = activeCurriculum.modules.findIndex(
      (m) => m.moduleCode === targetCode
    );
    return foundIdx >= 0 ? foundIdx : 0;
  }, [activeCurriculum.modules, selectedModuleCode, lastHighlightedModuleCode]);

  const activeModule: Part1ModuleItem = useMemo(
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
    <div className="flex flex-col lg:flex-row items-start gap-6">
      {/* =====================================================================
          1. DEDICATED SIDE CONTROL RAIL (Shifted to the side so nothing interferes!)
             Houses: Back to Choosing, Part I / Part II Switcher, Chapter 1-8 List,
             Module Quick-Jump (when open), and NCERT Textbook PDF.
         ===================================================================== */}
      <aside
        aria-label="Chapter & Book Navigation Controls"
        className="w-full lg:w-68 xl:w-72 shrink-0 lg:sticky lg:top-6 rounded-3xl bg-white border-2 border-stone-200/90 shadow-md p-5 space-y-5"
      >
        {/* Back to Choosing Chapters Button */}
        <button
          type="button"
          onClick={onOpenAllChaptersModal}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#194530] hover:bg-[#143826] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
        >
          <LayoutGrid className="w-4 h-4 text-[#FEF08A] shrink-0" />
          <span>Back to Choosing Chapters</span>
        </button>

        {/* Part I / Part II Book Switcher */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 px-1">
            Textbook Volume
          </div>
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-stone-100 border border-stone-200">
            <button
              type="button"
              onClick={() => onSelectChapterId(PART1_CURRICULUM_CHAPTERS[0].chapterId)}
              className={`px-3 py-2 rounded-lg text-xs font-extrabold transition-colors whitespace-nowrap cursor-pointer ${
                !isPart2Active
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/70'
              }`}
            >
              Part I (Ch 1–7)
            </button>
            <button
              type="button"
              onClick={() => {
                if (part2Chapters[0]) onSelectChapterId(part2Chapters[0].id);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-extrabold transition-colors whitespace-nowrap cursor-pointer ${
                isPart2Active
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/70'
              }`}
            >
              Part II (Ch 1–7)
            </button>
          </div>
        </div>

        {/* Clean Vertical Chapter Selector List */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 px-1">
            {isPart2Active ? 'Part II Chapters' : 'Part I Chapters'}
          </div>
          <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
            {switcherItems.map((item) => {
              const isActive = item.id === activeCurriculum.chapterId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectChapterId(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]'
                      : 'text-stone-700 hover:bg-stone-100 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold tabular-nums shrink-0 ${
                      isActive
                        ? 'bg-[#0F766E] text-white'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {item.number}
                  </span>
                  <span className="truncate">{formatMathText(item.title)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Module Quick-Switcher when inside a module */}
        {selectedModuleCode && (
          <div className="pt-3 border-t border-stone-200 space-y-2.5">
            <button
              type="button"
              onClick={() => setSelectedModuleCode(null)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span>Back to All 8 Modules</span>
            </button>

            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 px-1">
              Jump to Module
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {activeCurriculum.modules.map((mod, idx) => {
                const isCurrent = mod.moduleCode === activeModule.moduleCode;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => handleOpenModuleSlideshow(mod, 0)}
                    title={`${mod.moduleCode}: ${mod.title}`}
                    className={`py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer tabular-nums ${
                      isCurrent
                        ? 'bg-[#0F766E] text-white shadow-xs'
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

        {/* Polite Side Indicator of Currently Highlighted Module (Moved to the side!) */}
        {activeCurriculum.modules.length > 0 && activeModule && (
          <div className="pt-3 border-t border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-500 px-1">
              <span>Selected Module</span>
              <span className="text-[#0F766E]">{activeModule.moduleCode}</span>
            </div>
            <div className="rounded-xl bg-[#F0FDFA] border border-[#99F6E4] px-3 py-2 text-xs font-bold text-[#115E59] flex items-center justify-between gap-2">
              <span className="truncate">{formatMathText(activeModule.title)}</span>
              {activeModuleBadge && unlockedSet.has(activeModuleBadge.id) && (
                <span className="shrink-0 text-amber-600" title="Module Badge Unlocked">
                  {activeModuleBadge.emblemGlyph}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Dedicated Trophy Room & Chained 3D Cellar Boss Battle Buttons */}
        <div className="pt-3 border-t border-stone-200 space-y-2.5">
          <button
            type="button"
            onClick={onOpenTrophyRoom}
            className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-stone-900 border-2 border-amber-300 text-xs font-extrabold transition-all cursor-pointer shadow-xs"
          >
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Trophy Room</span>
            </span>
            <span className="rounded-md bg-amber-400/30 px-2 py-0.5 text-[11px] font-extrabold text-amber-950 tabular-nums">
              {unlockedBadgeIds.length}/115
            </span>
          </button>

          {/* Chained 3D Cellar Boss Battle Button (Locked with Iron Chains until 114 Badges!) */}
          <button
            type="button"
            onClick={() => {
              if (isCellarKeyUnlocked) {
                onOpenBossBattle();
              } else {
                onOpenTrophyRoom();
              }
            }}
            className={`relative w-full overflow-hidden rounded-xl border-2 px-3.5 py-3 text-left transition-all cursor-pointer shadow-sm ${
              isCellarKeyUnlocked
                ? 'border-amber-400 bg-gradient-to-r from-[#2D1B06] via-[#1E1430] to-[#2D1B06] text-white hover:shadow-lg'
                : 'border-stone-500 bg-stone-900 text-stone-200 hover:border-amber-400/70'
            }`}
          >
            {/* Visual Iron Chains Overlay when < 114 badges */}
            {!isCellarKeyUnlocked && (
              <svg
                aria-hidden="true"
                viewBox="0 0 240 60"
                className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="240"
                  y2="60"
                  stroke="#9CA3AF"
                  strokeWidth="5"
                  strokeDasharray="8 5"
                />
                <line
                  x1="240"
                  y1="0"
                  x2="0"
                  y2="60"
                  stroke="#9CA3AF"
                  strokeWidth="5"
                  strokeDasharray="8 5"
                />
              </svg>
            )}

            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {isCellarKeyUnlocked ? (
                  <Key className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                ) : (
                  <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="text-xs font-extrabold truncate text-amber-300">
                    {isCellarKeyUnlocked
                      ? 'Enter 3D Cellar Boss!'
                      : 'Chained 3D Cellar Boss'}
                  </div>
                  <div className="text-[10px] text-stone-300 truncate">
                    {isCellarKeyUnlocked
                      ? 'Key Unlocked! Fight for Badge #115'
                      : `Cellar Key: ${prereqUnlockedCount}/114 Badges`}
                  </div>
                </div>
              </div>
              <Skull className="w-4 h-4 text-rose-400 shrink-0" />
            </div>
          </button>
        </div>

        {/* NCERT Textbook PDF Link */}
        <div className="pt-3 border-t border-stone-200">
          <a
            href={activeCurriculum.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-200 transition-colors whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
            <span>Open NCERT Chapter PDF</span>
          </a>
        </div>
      </aside>

      {/* =====================================================================
          2. MAIN CHAPTER STAGE:
             - UNIQUE ANIMATED CHAPTER BANNER AT THE TOP
             - 25-SECOND CHAPTER INTRO VIDEO ALWAYS BELOW BANNER
             - EITHER 8-MODULE GRID OR 4-SLIDE MODULE SLIDESHOW
         ===================================================================== */}
      <div className="flex-1 min-w-0 w-full space-y-7">
        {/* Unique Kinetic Animated Chapter Banner (Zero Button Clutter!) */}
        <AnimatedChapterBanner
          chapterId={activeCurriculum.chapterId}
          chapterIndex={activeCurriculum.chapterIndex}
          partLabel={isPart2Active ? 'Part II' : 'Part I'}
          title={activeCurriculum.title}
          subtitle={activeCurriculum.heroSubtitle}
          ribbonText={activeCurriculum.heroRibbonText}
          moduleCount={activeCurriculum.modules.length}
          selectedModuleCode={selectedModuleCode}
        />

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
            {selectedModuleCode && (
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
          {selectedModuleCode ? (
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

                {/* 4-Slide Navigation Tabs: 1. The Videos | 2. The Text | 3. The Simulation | 4. The Game */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
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

                {/* SLIDE 3: THE SIMULATION (Interactive Mathematical Lab) */}
                {activeSlide.id === 'simulation' && (
                  <Part1ModuleSimAndGame
                    moduleCode={activeModule.moduleCode}
                    simulation={activeModule.simulation}
                    game={activeModule.game}
                    mode="simulation"
                  />
                )}

                {/* SLIDE 4: THE GAME (Interactive Module Mini-Game — Awards Module Mastery Badge!) */}
                {activeSlide.id === 'game' && (
                  <Part1ModuleSimAndGame
                    moduleCode={activeModule.moduleCode}
                    simulation={activeModule.simulation}
                    game={activeModule.game}
                    mode="game"
                    badge={activeModuleBadge}
                    isBadgeUnlocked={Boolean(
                      activeModuleBadge && unlockedSet.has(activeModuleBadge.id)
                    )}
                    onUnlockBadge={onUnlockBadge}
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
                onAddPoints(score * 10);
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
                      className="group relative rounded-2xl overflow-hidden bg-white flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg border border-stone-200/90 shadow-xs"
                    >
                      {/* Polite Side Indicator Bar on the left edge when active */}
                      {isHighlighted && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0F766E] z-20"
                          title="Active module in side rail"
                        />
                      )}

                      <div>
                        <div className="h-32 w-full relative overflow-hidden">
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

                        <div className="h-1 w-full bg-[#14B8A6]/70" />

                        <div className="p-5 space-y-2">
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
                        </div>
                      </div>

                      <div className="px-5 pb-4 pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-stone-500">
                          Slide 4 → Badge #{modBadge?.badgeNumber}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#0F766E] group-hover:translate-x-0.5 transition-transform">
                          <span>Open</span>
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
    </div>
  );
};
