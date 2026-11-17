import test from 'node:test';
import assert from 'node:assert/strict';
import { GANITA_CHAPTERS } from '../data/presets';
import { QuizAttemptRecord } from '../types/account';
import {
  classifyChapterStatus,
  buildChapterImprovementData,
  buildScoreTrendSeries,
  buildQuizStatsGist,
} from './quizAnalytics';

const SAMPLE_HISTORY: QuizAttemptRecord[] = [
  {
    id: 'q1',
    quizKey: 'chapter:ch1-square-cube',
    quizKind: 'chapter-quiz',
    title: 'Squares & Cubes Chapter Quiz',
    chapterIds: ['ch1-square-cube'],
    score: 5,
    total: 10,
    percentage: 50,
    passed: false,
    timestamp: '2026-05-01T10:00:00.000Z',
  },
  {
    id: 'q2',
    quizKey: 'module:ch2-power-play:2.1',
    quizKind: 'module-recap',
    title: 'Exponents Recap',
    chapterIds: ['ch2-power-play'],
    score: 4,
    total: 5,
    percentage: 80,
    passed: true,
    timestamp: '2026-05-02T10:00:00.000Z',
  },
  {
    id: 'q3',
    quizKey: 'tricky:mix-1',
    quizKind: 'tricky-textbook',
    title: 'Tricky 20Q Mix',
    chapterIds: ['ch1-square-cube', 'ch6-proportional-reasoning'],
    score: 18,
    total: 20,
    percentage: 90,
    passed: true,
    timestamp: '2026-05-03T10:00:00.000Z',
  },
];

test('classifyChapterStatus assigns clear accuracy thresholds', () => {
  assert.equal(classifyChapterStatus(69), 'Needs Practice');
  assert.equal(classifyChapterStatus(70), 'Improving');
  assert.equal(classifyChapterStatus(84), 'Improving');
  assert.equal(classifyChapterStatus(85), 'Mastered');
});

test('buildChapterImprovementData sorts weakest chapter first with explicit statuses', () => {
  const stats = buildChapterImprovementData(SAMPLE_HISTORY, GANITA_CHAPTERS);
  // ch1: (50 + 90) / 2 = 70% (Improving)
  // ch2: 80% (Improving)
  // ch6-proportional-reasoning: 90% (Mastered)
  assert.equal(stats.length, 3);
  assert.equal(stats[0].chapterId, 'ch1-square-cube');
  assert.equal(stats[0].accuracy, 70);
  assert.equal(stats[0].status, 'Improving');

  assert.equal(stats[2].chapterId, 'ch6-proportional-reasoning');
  assert.equal(stats[2].accuracy, 90);
  assert.equal(stats[2].status, 'Mastered');
});

test('buildScoreTrendSeries orders attempts chronologically', () => {
  const reversed = [...SAMPLE_HISTORY].reverse();
  const series = buildScoreTrendSeries(reversed);
  assert.deepEqual(
    series.map((p) => p.percentage),
    [50, 80, 90]
  );
  assert.deepEqual(
    series.map((p) => p.label),
    ['#1', '#2', '#3']
  );
});

test('buildQuizStatsGist computes KPI summary, focus chapter, and trend delta', () => {
  const gist = buildQuizStatsGist(SAMPLE_HISTORY, GANITA_CHAPTERS);
  assert.equal(gist.totalAttempts, 3);
  assert.equal(gist.passedCount, 2);
  assert.equal(gist.averagePercentage, 73);
  assert.equal(gist.bestPercentage, 90);
  assert.equal(gist.latestPercentage, 90);
  assert.equal(gist.recentTrendDelta, 10);
  assert.equal(gist.weakestChapter?.chapterId, 'ch1-square-cube');
  assert.equal(gist.strongestChapter?.chapterId, 'ch6-proportional-reasoning');
  assert.equal(gist.chaptersNeedingPractice.length, 2);
});
