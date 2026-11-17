import { ModuleGameChallenge, ModuleSimulationConfig } from '../types/part1Curriculum';
import {
  generateModuleSpecificQuestions,
  getChapterCapstoneRecapQuestions,
  getChapterIdForModuleId,
} from './moduleSpecificQuestions';
import { prioritizeByDifficulty, QuizDifficultyLevel } from './quizDifficulty';

export interface RecapQuizConfig {
  questions: ModuleGameChallenge[];
  isLastModule: boolean;
  totalMarks: number; // 5 for regular, 10 for chapter capstone
  passingMarks: number; // 4 for regular (80%), 8 for capstone (80%)
  passingPercentage: number; // 80%
  paperTitle: string;
}

/**
 * Deterministic PRNG for reproducible yet varied question sets & option orders.
 */
function createSeededRng(seed: number): () => number {
  let s = ((Math.abs(Math.floor(seed)) + 1) % 2147483647) || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const rng = createSeededRng(seed * 73 + items.length * 19 + 11);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function shuffleChallengeOptions(q: ModuleGameChallenge, seed: number): ModuleGameChallenge {
  const safeIdx =
    typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < q.options.length
      ? q.correctIndex
      : 0;
  const tagged = q.options.map((opt, idx) => ({ opt, isCorrect: idx === safeIdx }));
  const shuffled = shuffleWithSeed(tagged, seed);
  return {
    ...q,
    options: shuffled.map((item) => item.opt),
    correctIndex: shuffled.findIndex((item) => item.isCorrect),
  };
}

/**
 * Fallback resolver when a caller invokes getRecapQuizConfig without explicit moduleId.
 * Uses exact chapter/module code clues without naive digit substring collisions.
 */
function inferModuleAndChapterIds(
  moduleCode: string,
  moduleTitle: string,
  formulaHighlight: string
): { moduleId?: string; chapterId?: string } {
  const hay = `${moduleTitle} ${formulaHighlight}`.toLowerCase();
  const codeMatch = moduleCode.match(/(\d+)\.(\d+)/);
  const chNum = codeMatch ? Number(codeMatch[1]) : 0;
  const modNum = codeMatch ? Number(codeMatch[2]) : 0;

  if (chNum >= 1 && chNum <= 7 && modNum >= 1 && modNum <= 8) {
    // Disambiguate overlapping 1.x - 7.x numbering between Part I and Part II via keywords
    const isPart2Ch1 = hay.includes('%') || hay.includes('percent') || hay.includes('gst') || hay.includes('profit') || hay.includes('fdp');
    const isPart2Ch2 = hay.includes('baudh') || hay.includes('pythagor') || hay.includes('√2') || hay.includes('hypotenuse') || hay.includes('fermat');
    const isPart2Ch3 = hay.includes('rf') || hay.includes('representative fraction') || hay.includes('pie chart') || (chNum === 3 && hay.includes('proportion'));
    const isPart2Ch4 = hay.includes('sierpinski') || hay.includes('koch') || hay.includes('fractal') || hay.includes('isometric') || hay.includes('net');
    const isPart2Ch5 = hay.includes('mean') || hay.includes('median') || hay.includes('spreadsheet') || hay.includes('infographic') || hay.includes('line graph');
    const isPart2Ch6 = hay.includes('shubham') || hay.includes('100m') || hay.includes('pyramid') || hay.includes('genie') || hay.includes('calendar') || (chNum === 6 && hay.includes('8x − 7f'));
    const isPart2Ch7 = hay.includes('area') || hay.includes('trapezium') || hay.includes('hectare') || hay.includes('parallelogram') || hay.includes('dissection');

    if (chNum === 1 && isPart2Ch1) return { moduleId: `p2-mod-1-${modNum}`, chapterId: 'ch4-fractions-disguise' };
    if (chNum === 2 && isPart2Ch2) return { moduleId: `p2-mod-2-${modNum}`, chapterId: 'ch5-baudhayana-pythagoras' };
    if (chNum === 3 && isPart2Ch3) return { moduleId: `p2-mod-3-${modNum}`, chapterId: 'ch6-proportional-reasoning' };
    if (chNum === 4 && isPart2Ch4) return { moduleId: `p2-mod-4-${modNum}`, chapterId: 'ch11-geometric-themes' };
    if (chNum === 5 && isPart2Ch5) return { moduleId: `p2-mod-5-${modNum}`, chapterId: 'ch12-dots-and-lines' };
    if (chNum === 6 && isPart2Ch6) return { moduleId: `p2-ch6-m${modNum}`, chapterId: 'ch13-algebra-play' };
    if (chNum === 7 && isPart2Ch7) return { moduleId: `p2-mod-7-${modNum}`, chapterId: 'ch14-area' };

    const inferredId = `mod-${chNum}-${modNum}`;
    return {
      moduleId: inferredId,
      chapterId: getChapterIdForModuleId(inferredId),
    };
  }

  return {};
}

/**
 * Generates strictly module-specific (Modules 1-7) or chapter-scoped (Module 8)
 * randomized math questions for Slide 5 Recap Quizzes:
 * - Regular modules (M1-M7): 5 questions strictly about THIS module (80% = 4/5 to pass)
 * - Chapter Capstone (M8): 10 questions synthesized from THIS chapter's M1-M7 + capstone (80% = 8/10 to pass)
 * - Zero unrelated off-topic rational/equation filler or generic "Verified and Correct" padding.
 */
export function getRecapQuizConfig(
  moduleCode: string,
  moduleTitle: string,
  formulaHighlight: string,
  existingChallenges: ModuleGameChallenge[] = [],
  _simulation?: ModuleSimulationConfig,
  isLastModule: boolean = false,
  randomSeed: number = 0,
  moduleId?: string,
  chapterId?: string,
  difficulty: QuizDifficultyLevel = 2
): RecapQuizConfig {
  const targetCount = isLastModule ? 10 : 5;
  const passingMarks = isLastModule ? 8 : 4;
  const passingPercentage = 80;
  const paperTitle = isLastModule
    ? 'Chapter Capstone · 10 Marker Comprehensive Paper'
    : 'Module Mastery Recap Quiz · 5-Question Challenge';

  const inferred = !moduleId
    ? inferModuleAndChapterIds(moduleCode, moduleTitle, formulaHighlight)
    : {};
  const resolvedModuleId = moduleId || inferred.moduleId || '';
  const resolvedChapterId =
    chapterId ||
    inferred.chapterId ||
    (resolvedModuleId ? getChapterIdForModuleId(resolvedModuleId) : undefined) ||
    '';

  let candidatePool: ModuleGameChallenge[] = [];

  if (isLastModule) {
    // M8 Chapter Capstone: draw strictly from this chapter's existing capstone checks + its M1-M7 module banks
    const chapterQuestionsPrimary = resolvedChapterId
      ? getChapterCapstoneRecapQuestions(resolvedChapterId, randomSeed, difficulty)
      : [];
    const chapterQuestionsSecondary =
      resolvedChapterId && chapterQuestionsPrimary.length < targetCount + 4
        ? getChapterCapstoneRecapQuestions(resolvedChapterId, randomSeed + 109, difficulty)
        : [];
    const chapterQuestionsTertiary =
      resolvedChapterId && difficulty !== 2 && chapterQuestionsPrimary.length + chapterQuestionsSecondary.length < targetCount + 4
        ? getChapterCapstoneRecapQuestions(resolvedChapterId, randomSeed + 211, difficulty)
        : [];

    candidatePool =
      difficulty !== 2
        ? [
            ...chapterQuestionsPrimary,
            ...chapterQuestionsSecondary,
            ...chapterQuestionsTertiary,
          ]
        : [
            ...chapterQuestionsPrimary,
            ...(existingChallenges || []),
            ...chapterQuestionsSecondary,
          ];
  } else {
    // M1-M7 Regular Module: draw strictly from THIS module's curriculum challenges + module-specific generator
    const generatedPrimary = resolvedModuleId
      ? generateModuleSpecificQuestions(resolvedModuleId, randomSeed, difficulty)
      : [];
    const generatedSecondary = resolvedModuleId
      ? generateModuleSpecificQuestions(resolvedModuleId, randomSeed + 137, difficulty)
      : [];

    candidatePool =
      difficulty !== 2
        ? [
            // For Foundation / Challenger / Olympiad, keep pool strictly calibrated to chosen difficulty first
            ...generatedPrimary,
            ...generatedSecondary,
          ]
        : randomSeed > 0
          ? [
              ...generatedPrimary,
              ...generatedSecondary,
              ...(existingChallenges || []),
            ]
          : [
              ...(existingChallenges || []),
              ...generatedPrimary,
              ...generatedSecondary,
            ];
  }

  // Deduplicate cleanly by normalized prompt while preserving valid >=4 options
  const seenPrompts = new Set<string>();
  const uniqueQuestions: ModuleGameChallenge[] = [];

  for (let i = 0; i < candidatePool.length; i++) {
    const q = candidatePool[i];
    if (!q || !q.prompt || !Array.isArray(q.options) || q.options.length < 2) continue;
    const key = q.prompt.trim().toLowerCase();
    if (!seenPrompts.has(key)) {
      seenPrompts.add(key);
      // Re-shuffle existing challenge option orders deterministically on retakes or difficulty switches
      uniqueQuestions.push(
        randomSeed > 0 || difficulty !== 2
          ? shuffleChallengeOptions(q, randomSeed + difficulty * 97 + i * 31)
          : q
      );
    }
  }

  const rng = createSeededRng(randomSeed * 73 + difficulty * 313 + uniqueQuestions.length * 19 + 11);
  const selected =
    difficulty === 2 && randomSeed === 0
      ? shuffleWithSeed(uniqueQuestions, randomSeed).slice(0, targetCount)
      : difficulty !== 2
        ? [
            // Keep first exact-module tiered question when !isLastModule, shuffle remaining up to targetCount
            ...(isLastModule
              ? shuffleWithSeed(uniqueQuestions, randomSeed + difficulty * 313).slice(0, targetCount)
              : uniqueQuestions.slice(0, targetCount)),
          ]
        : prioritizeByDifficulty(uniqueQuestions, difficulty, rng).slice(0, targetCount);

  return {
    questions: selected,
    isLastModule,
    totalMarks: selected.length || targetCount,
    passingMarks: Math.ceil((selected.length || targetCount) * 0.8),
    passingPercentage,
    paperTitle,
  };
}

export function getFiveRecapQuestions(
  moduleCode: string,
  moduleTitle: string,
  formulaHighlight: string,
  existingChallenges: ModuleGameChallenge[] = [],
  simulation?: ModuleSimulationConfig,
  randomSeed: number = 0,
  moduleId?: string,
  chapterId?: string,
  difficulty: QuizDifficultyLevel = 2
): ModuleGameChallenge[] {
  return getRecapQuizConfig(
    moduleCode,
    moduleTitle,
    formulaHighlight,
    existingChallenges,
    simulation,
    false,
    randomSeed,
    moduleId,
    chapterId,
    difficulty
  ).questions;
}
