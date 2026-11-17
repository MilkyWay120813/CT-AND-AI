import { GanitaChapter } from '../types/math';
import { QuizAttemptRecord, QuizKind } from '../types/account';

export type ImprovementStatus = 'Needs Practice' | 'Improving' | 'Mastered';

export interface ChapterImprovementStat {
  chapterId: string;
  shortLabel: string;
  chapterTitle: string;
  partLabel: string;
  chapterNumber: number;
  accuracy: number; // 0 - 100
  attempts: number;
  status: ImprovementStatus;
}

export interface ScoreTrendPoint {
  index: number;
  label: string;
  title: string;
  quizKind: QuizKind;
  percentage: number;
  scoreText: string;
  timestamp: string;
  passed: boolean;
}

export interface QuizStatsGist {
  totalAttempts: number;
  passedCount: number;
  averagePercentage: number;
  bestPercentage: number;
  latestPercentage: number | null;
  recentTrendDelta: number | null;
  strongestChapter: ChapterImprovementStat | null;
  weakestChapter: ChapterImprovementStat | null;
  chaptersNeedingPractice: ChapterImprovementStat[];
  recentAttempts: QuizAttemptRecord[];
}

export function classifyChapterStatus(accuracy: number): ImprovementStatus {
  if (accuracy >= 85) return 'Mastered';
  if (accuracy >= 70) return 'Improving';
  return 'Needs Practice';
}

export function buildChapterImprovementData(
  history: QuizAttemptRecord[] | null | undefined,
  chapters: GanitaChapter[]
): ChapterImprovementStat[] {
  if (!Array.isArray(history) || history.length === 0) return [];

  const buckets = new Map<string, { earnedPctSum: number; attempts: number }>();

  for (const record of history) {
    const chList =
      Array.isArray(record.chapterIds) && record.chapterIds.length > 0
        ? record.chapterIds
        : [];
    const safePct = Number.isFinite(record.percentage)
      ? Math.min(100, Math.max(0, record.percentage))
      : record.total > 0
      ? Math.round((record.score / record.total) * 100)
      : 0;

    for (const chId of chList) {
      const chMatch = chapters.find((c) => c.id === chId);
      if (!chMatch) continue;
      const cur = buckets.get(chId) || { earnedPctSum: 0, attempts: 0 };
      buckets.set(chId, {
        earnedPctSum: cur.earnedPctSum + safePct,
        attempts: cur.attempts + 1,
      });
    }
  }

  const stats: ChapterImprovementStat[] = [];
  for (const [chId, bucket] of buckets.entries()) {
    const ch = chapters.find((c) => c.id === chId);
    if (!ch) continue;
    const accuracy = Math.round(bucket.earnedPctSum / bucket.attempts);
    stats.push({
      chapterId: chId,
      shortLabel: `${ch.partLabel === 'Part I' ? 'P1' : 'P2'} Ch ${ch.chapterNumber}`,
      chapterTitle: ch.title,
      partLabel: ch.partLabel,
      chapterNumber: ch.chapterNumber,
      accuracy,
      attempts: bucket.attempts,
      status: classifyChapterStatus(accuracy),
    });
  }

  // Sort weakest accuracy first so "Where You Need to Improve" immediately prioritizes weak areas
  return stats.sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts);
}

export function buildScoreTrendSeries(
  history: QuizAttemptRecord[] | null | undefined
): ScoreTrendPoint[] {
  if (!Array.isArray(history) || history.length === 0) return [];
  const sorted = [...history].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return sorted.map((item, idx) => {
    const pct = Number.isFinite(item.percentage)
      ? Math.min(100, Math.max(0, Math.round(item.percentage)))
      : item.total > 0
      ? Math.round((item.score / item.total) * 100)
      : 0;
    return {
      index: idx + 1,
      label: `#${idx + 1}`,
      title: item.title,
      quizKind: item.quizKind,
      percentage: pct,
      scoreText: `${item.score}/${item.total}`,
      timestamp: item.timestamp,
      passed: Boolean(item.passed),
    };
  });
}

export function buildQuizStatsGist(
  history: QuizAttemptRecord[] | null | undefined,
  chapters: GanitaChapter[]
): QuizStatsGist {
  const safeHistory = Array.isArray(history) ? history : [];
  if (safeHistory.length === 0) {
    return {
      totalAttempts: 0,
      passedCount: 0,
      averagePercentage: 0,
      bestPercentage: 0,
      latestPercentage: null,
      recentTrendDelta: null,
      strongestChapter: null,
      weakestChapter: null,
      chaptersNeedingPractice: [],
      recentAttempts: [],
    };
  }

  const trend = buildScoreTrendSeries(safeHistory);
  const percentages = trend.map((t) => t.percentage);
  const averagePercentage = Math.round(
    percentages.reduce((a, b) => a + b, 0) / percentages.length
  );
  const bestPercentage = Math.max(...percentages);
  const latestPercentage = trend[trend.length - 1]?.percentage ?? null;
  const recentTrendDelta =
    trend.length >= 2
      ? trend[trend.length - 1].percentage - trend[trend.length - 2].percentage
      : null;

  const chapterStats = buildChapterImprovementData(safeHistory, chapters);
  const weakestChapter = chapterStats[0] || null;
  const strongestChapter =
    chapterStats.length > 0 ? chapterStats[chapterStats.length - 1] : null;
  const chaptersNeedingPractice = chapterStats.filter(
    (c) => c.status !== 'Mastered'
  );

  const recentAttempts = [...safeHistory]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 6);

  return {
    totalAttempts: safeHistory.length,
    passedCount: safeHistory.filter((h) => h.passed).length,
    averagePercentage,
    bestPercentage,
    latestPercentage,
    recentTrendDelta,
    strongestChapter,
    weakestChapter,
    chaptersNeedingPractice,
    recentAttempts,
  };
}
