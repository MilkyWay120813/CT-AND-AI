import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeRecommendedDifficultyFromProgress,
  prioritizeByDifficulty,
  randIntForDifficulty,
  resolveEffectiveDifficulty,
  sanitizeQuizDifficultySettings,
  scorePromptComplexity,
} from './quizDifficulty';

test('computeRecommendedDifficultyFromProgress maps student milestones across levels 1..4', () => {
  const brandNew = computeRecommendedDifficultyFromProgress({
    unlockedBadgeCount: 0,
    masteryPoints: 0,
    quizHistory: [],
  });
  assert.equal(brandNew.recommendedLevel, 1);

  const steadyStarter = computeRecommendedDifficultyFromProgress({
    unlockedBadgeCount: 12,
    masteryPoints: 350,
    quizHistory: [
      {
        id: 'a1',
        quizKey: 'k1',
        quizKind: 'module-recap',
        title: 'M1',
        chapterIds: ['ch1-square-cube'],
        score: 4,
        total: 5,
        percentage: 72,
        timestamp: '2026-01-01',
        passed: true,
      },
    ],
  });
  assert.equal(steadyStarter.recommendedLevel, 2);

  const challenger = computeRecommendedDifficultyFromProgress({
    unlockedBadgeCount: 36,
    masteryPoints: 1100,
    quizHistory: [],
  });
  assert.equal(challenger.recommendedLevel, 3);

  const olympiad = computeRecommendedDifficultyFromProgress({
    unlockedBadgeCount: 78,
    masteryPoints: 2600,
    quizHistory: [],
  });
  assert.equal(olympiad.recommendedLevel, 4);
});

test('computeRecommendedDifficultyFromProgress calibrates up on high quiz scores and down on struggles', () => {
  const highScoringMid = computeRecommendedDifficultyFromProgress({
    unlockedBadgeCount: 35,
    masteryPoints: 1000,
    quizHistory: [
      {
        id: 'q1',
        quizKey: 'k1',
        quizKind: 'chapter-quiz',
        title: 'Ch1',
        chapterIds: ['ch1-square-cube'],
        score: 9,
        total: 10,
        percentage: 90,
        timestamp: '2026-01-01',
        passed: true,
      },
      {
        id: 'q2',
        quizKey: 'k2',
        quizKind: 'chapter-quiz',
        title: 'Ch2',
        chapterIds: ['ch2-power-play'],
        score: 10,
        total: 10,
        percentage: 100,
        timestamp: '2026-01-02',
        passed: true,
      },
    ],
  });
  assert.equal(highScoringMid.recommendedLevel, 4);

  const strugglingStudent = computeRecommendedDifficultyFromProgress({
    unlockedBadgeCount: 35,
    masteryPoints: 1000,
    quizHistory: [
      {
        id: 's1',
        quizKey: 'k1',
        quizKind: 'chapter-quiz',
        title: 'Ch1',
        chapterIds: ['ch1-square-cube'],
        score: 4,
        total: 10,
        percentage: 40,
        timestamp: '2026-01-01',
        passed: false,
      },
      {
        id: 's2',
        quizKey: 'k2',
        quizKind: 'chapter-quiz',
        title: 'Ch2',
        chapterIds: ['ch2-power-play'],
        score: 5,
        total: 10,
        percentage: 50,
        timestamp: '2026-01-02',
        passed: false,
      },
    ],
  });
  assert.equal(strugglingStudent.recommendedLevel, 2);
});

test('resolveEffectiveDifficulty honors Auto-Match vs manual slider override & sanitization', () => {
  const sanitized = sanitizeQuizDifficultySettings({ difficulty: 99, autoMatchProgress: false });
  assert.equal(sanitized.difficulty, 4);
  assert.equal(sanitized.autoMatchProgress, false);

  const progress = { unlockedBadgeCount: 2, masteryPoints: 20, quizHistory: [] };
  assert.equal(
    resolveEffectiveDifficulty({ difficulty: 4, autoMatchProgress: false }, progress),
    4
  );
  assert.equal(
    resolveEffectiveDifficulty({ difficulty: 4, autoMatchProgress: true }, progress),
    1
  );
});

test('randIntForDifficulty & prioritizeByDifficulty scale values and ordering cleanly', () => {
  let seed = 7;
  const rng = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 15; i++) {
    const low = randIntForDifficulty(rng, 1, [2, 6], [8, 14], [16, 25], [30, 50]);
    const high = randIntForDifficulty(rng, 4, [2, 6], [8, 14], [16, 25], [30, 50]);
    assert.ok(low >= 2 && low <= 6);
    assert.ok(high >= 30 && high <= 50);
  }

  const easyPrompt = { prompt: 'Compute 4² + 3.' };
  const hardPrompt = {
    prompt:
      'Find the compound amount after 2 years on ₹18,000 at 10% per annum compounded annually, then subtract the original principal before the hike.',
  };

  assert.equal(scorePromptComplexity(easyPrompt.prompt), 1);
  assert.equal(scorePromptComplexity(hardPrompt.prompt), 4);

  const orderedFor1 = prioritizeByDifficulty([hardPrompt, easyPrompt], 1, rng);
  assert.equal(orderedFor1[0].prompt, easyPrompt.prompt);

  const orderedFor4 = prioritizeByDifficulty([easyPrompt, hardPrompt], 4, rng);
  assert.equal(orderedFor4[0].prompt, hardPrompt.prompt);
});
