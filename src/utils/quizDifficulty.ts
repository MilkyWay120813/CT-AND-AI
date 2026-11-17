import type { QuizAttemptRecord } from '../types/account';

export type QuizDifficultyLevel = 1 | 2 | 3 | 4;

export interface QuizDifficultySettings {
  difficulty: QuizDifficultyLevel;
  autoMatchProgress: boolean;
}

export interface ProgressDifficultyInput {
  unlockedBadgeCount: number;
  masteryPoints: number;
  quizHistory?: QuizAttemptRecord[];
}

export interface RecommendedDifficultyResult {
  recommendedLevel: QuizDifficultyLevel;
  avgQuizPercentage: number | null;
  reason: string;
}

export interface QuizDifficultyMeta {
  level: QuizDifficultyLevel;
  label: string;
  shortLabel: string;
  description: string;
  scalingNote: string;
}

export const DEFAULT_QUIZ_DIFFICULTY_SETTINGS: QuizDifficultySettings = {
  difficulty: 2,
  autoMatchProgress: true,
};

export const QUIZ_DIFFICULTY_META: Record<QuizDifficultyLevel, QuizDifficultyMeta> = {
  1: {
    level: 1,
    label: 'Foundation',
    shortLabel: 'Lvl 1 · Foundation',
    description: 'Approachable mental-math numbers & core concept checks.',
    scalingNote: 'Smaller numbers, direct single-step questions & wide distractors.',
  },
  2: {
    level: 2,
    label: 'Standard',
    shortLabel: 'Lvl 2 · Standard',
    description: 'Balanced Class VIII NCERT textbook pace & mixed applications.',
    scalingNote: 'Grade-level operands, standard formulas & classic word problems.',
  },
  3: {
    level: 3,
    label: 'Challenger',
    shortLabel: 'Lvl 3 · Challenger',
    description: 'Multi-step reasoning, reverse problems & larger calculations.',
    scalingNote: 'Multi-step problems, reverse percentages/roots & tighter distractors.',
  },
  4: {
    level: 4,
    label: 'Olympiad',
    shortLabel: 'Lvl 4 · Olympiad',
    description: 'Competition-grade twists, big numbers & precision traps.',
    scalingNote: 'Large operands, compound steps, proof logic & close trap options.',
  },
};

export function clampDifficultyLevel(value: unknown): QuizDifficultyLevel {
  const num = Number(value);
  if (!Number.isFinite(num)) return 2;
  const rounded = Math.round(num);
  if (rounded <= 1) return 1;
  if (rounded === 2) return 2;
  if (rounded === 3) return 3;
  return 4;
}

export function sanitizeQuizDifficultySettings(raw: unknown): QuizDifficultySettings {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_QUIZ_DIFFICULTY_SETTINGS };
  }
  const obj = raw as Partial<QuizDifficultySettings>;
  return {
    difficulty: clampDifficultyLevel(obj.difficulty),
    autoMatchProgress:
      typeof obj.autoMatchProgress === 'boolean'
        ? obj.autoMatchProgress
        : DEFAULT_QUIZ_DIFFICULTY_SETTINGS.autoMatchProgress,
  };
}

export function computeRecommendedDifficultyFromProgress(
  input: ProgressDifficultyInput
): RecommendedDifficultyResult {
  const badges = Math.max(0, Math.floor(input.unlockedBadgeCount || 0));
  const points = Math.max(0, Math.floor(input.masteryPoints || 0));
  const history = Array.isArray(input.quizHistory) ? input.quizHistory : [];
  const recent = history.slice(-10);

  const avgQuizPercentage =
    recent.length > 0
      ? Math.round(
          recent.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0) / recent.length
        )
      : null;

  let baseLevel: QuizDifficultyLevel = 1;
  if (badges >= 70 || points >= 2200) {
    baseLevel = 4;
  } else if (badges >= 30 || points >= 900) {
    baseLevel = 3;
  } else if (badges >= 8 || points >= 200) {
    baseLevel = 2;
  } else {
    baseLevel = 1;
  }

  let adjusted = baseLevel;
  if (avgQuizPercentage !== null && recent.length >= 2) {
    if (avgQuizPercentage >= 88 && badges >= 12 && adjusted < 4) {
      adjusted = (adjusted + 1) as QuizDifficultyLevel;
    } else if (avgQuizPercentage >= 78 && adjusted < 3 && recent.length >= 3) {
      adjusted = Math.max(adjusted, 3) as QuizDifficultyLevel;
    } else if (avgQuizPercentage < 55 && adjusted > 1) {
      adjusted = (adjusted - 1) as QuizDifficultyLevel;
    }
  } else if (avgQuizPercentage !== null && recent.length === 1 && avgQuizPercentage >= 85 && adjusted < 2) {
    adjusted = 2;
  }

  const finalLevel = clampDifficultyLevel(adjusted);
  const badgeText = `${badges} badge${badges === 1 ? '' : 's'}`;
  const avgText = avgQuizPercentage !== null ? ` · ${avgQuizPercentage}% recent quiz avg` : '';

  return {
    recommendedLevel: finalLevel,
    avgQuizPercentage,
    reason: `Matched to ${badgeText}${avgText}`,
  };
}

export function resolveEffectiveDifficulty(
  settings: QuizDifficultySettings,
  progress: ProgressDifficultyInput
): QuizDifficultyLevel {
  if (settings.autoMatchProgress) {
    return computeRecommendedDifficultyFromProgress(progress).recommendedLevel;
  }
  return clampDifficultyLevel(settings.difficulty);
}

export function pickRangeForDifficulty(
  difficulty: QuizDifficultyLevel,
  r1: [number, number],
  r2: [number, number],
  r3: [number, number],
  r4: [number, number]
): [number, number] {
  switch (difficulty) {
    case 1:
      return r1;
    case 2:
      return r2;
    case 3:
      return r3;
    case 4:
    default:
      return r4;
  }
}

export function randIntForDifficulty(
  rng: () => number,
  difficulty: QuizDifficultyLevel,
  r1: [number, number],
  r2: [number, number],
  r3: [number, number],
  r4: [number, number]
): number {
  const [min, max] = pickRangeForDifficulty(difficulty, r1, r2, r3, r4);
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return Math.floor(rng() * (hi - lo + 1)) + lo;
}

export function scorePromptComplexity(prompt: string): QuizDifficultyLevel {
  const text = (prompt || '').toLowerCase();
  let score = 1.5;

  // Larger numbers increase computational demand
  const numbers = (text.match(/\d[\d,]*/g) || [])
    .map((n) => Number(n.replace(/,/g, '')))
    .filter((n) => Number.isFinite(n));
  const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;

  if (maxNum >= 5000) score += 1.4;
  else if (maxNum >= 400) score += 0.9;
  else if (maxNum >= 60) score += 0.4;

  // Multi-step or advanced mathematical structure signals
  const advancedCues = [
    'compounded',
    'per annum',
    'original',
    'before the hike',
    'remainder',
    'reverse',
    'without a calculator',
    'both ',
    'combined',
    'minimum',
    'diagonal',
    'sierpinski',
    'koch',
    'polyhedron',
    'interquartile',
    'simultaneous',
    'simultaneously',
    'cryptarithm',
    'gst',
    'successive',
    'isosceles',
    'bisector',
    'telescoping',
    'harmonic',
    '6th power',
    'exposed faces',
    'altitude',
    'trapezium',
    'representative fraction',
    'virah',
    'shrines',
    'divisible by 72',
    'units digit',
    'varignon',
    'lotus',
    'maximum',
    'median',
    '⁻',
    '^−',
    '⁻¹',
    '⁻²',
    '⁻³',
  ];
  let cueHits = 0;
  for (const cue of advancedCues) {
    if (text.includes(cue)) cueHits++;
  }
  score += Math.min(1.6, cueHits * 0.55);

  // Word length / multi-clause check
  if (text.length > 135) score += 0.5;
  else if (text.length < 75 && maxNum <= 35 && cueHits === 0) score -= 0.6;

  return clampDifficultyLevel(score);
}

export function prioritizeByDifficulty<T extends { prompt: string }>(
  items: T[],
  difficulty: QuizDifficultyLevel,
  rng: () => number
): T[] {
  const scored = items.map((item) => {
    const tier = scorePromptComplexity(item.prompt);
    const distance = Math.abs(tier - difficulty);
    // Primary sort key is closeness to chosen difficulty; subtle seeded jitter keeps retakes fresh
    return {
      item,
      rank: distance + rng() * 0.75,
    };
  });
  scored.sort((a, b) => a.rank - b.rank);
  return scored.map((entry) => entry.item);
}
