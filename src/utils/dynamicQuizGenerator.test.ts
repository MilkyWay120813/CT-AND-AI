import test from 'node:test';
import assert from 'node:assert/strict';
import { GANITA_CHAPTERS } from '../data/presets';
import {
  getPart1CurriculumById,
  getPart2CurriculumById,
  buildPart2CurriculumFromChapter,
} from '../data/part1CurriculumData';
import { ChapterAssessmentQuestion } from '../types/part1Curriculum';
import { ChapterId } from '../types/math';
import {
  generateBookWideBossQuestions,
  generateDynamicChapterQuiz,
  generateMultiChapterTrickyQuiz,
} from './dynamicQuizGenerator';
import type { QuizDifficultyLevel } from './quizDifficulty';

function buildStaticMap(): Partial<Record<ChapterId, ChapterAssessmentQuestion[]>> {
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
}

test('generateMultiChapterTrickyQuiz produces 20 unique questions for EVERY single chapter across all 4 difficulty levels', () => {
  const staticMap = buildStaticMap();
  for (const ch of GANITA_CHAPTERS) {
    const singleCh: ChapterId[] = [ch.id];
    for (const lvl of [1, 2, 3, 4] as QuizDifficultyLevel[]) {
      const quiz = generateMultiChapterTrickyQuiz(singleCh, 101, staticMap, 20, lvl);
      assert.equal(quiz.length, 20, `${ch.id} difficulty=${lvl} should yield 20 questions`);
      const prompts = new Set(quiz.map((q) => q.prompt.trim().toLowerCase()));
      assert.equal(prompts.size, 20, `${ch.id} difficulty=${lvl} had duplicate prompts`);
      for (const q of quiz) {
        assert.equal(q.sourceChapterId, ch.id);
        assert.equal(q.options.length, 4, `${ch.id} lvl=${lvl} option count`);
        assert.equal(new Set(q.options).size, 4, `${ch.id} lvl=${lvl} duplicate options in "${q.prompt}"`);
        assert.ok(q.correctIndex >= 0 && q.correctIndex < 4);
      }
    }
  }
});

test('generateMultiChapterTrickyQuiz scales genuine mathematical complexity between Level 1 (Foundation) and Level 4 (Olympiad)', async () => {
  const { scorePromptComplexity } = await import('./quizDifficulty');
  const staticMap = buildStaticMap();
  const allIds = GANITA_CHAPTERS.map((c) => c.id);
  const easy = generateMultiChapterTrickyQuiz(allIds, 777, staticMap, 20, 1);
  const olympiad = generateMultiChapterTrickyQuiz(allIds, 777, staticMap, 20, 4);

  assert.equal(easy.length, 20);
  assert.equal(olympiad.length, 20);
  assert.notDeepEqual(
    easy.map((q) => q.prompt),
    olympiad.map((q) => q.prompt)
  );

  const avgEasy = easy.reduce((s, q) => s + scorePromptComplexity(q.prompt), 0) / easy.length;
  const avgOlympiad = olympiad.reduce((s, q) => s + scorePromptComplexity(q.prompt), 0) / olympiad.length;
  assert.ok(
    avgOlympiad > avgEasy + 0.8,
    `Expected Olympiad avg complexity (${avgOlympiad.toFixed(2)}) >> Foundation avg complexity (${avgEasy.toFixed(2)})`
  );
  // Zero overlap between Foundation and Olympiad question pools
  const easySet = new Set(easy.map((q) => q.prompt.trim().toLowerCase()));
  for (const q of olympiad) {
    assert.ok(!easySet.has(q.prompt.trim().toLowerCase()), `Olympiad leaked Foundation prompt: ${q.prompt}`);
  }
});

test('generateMultiChapterTrickyQuiz scopes questions strictly to selected subset of chapters', () => {
  const staticMap = buildStaticMap();
  const chosen: ChapterId[] = ['ch1-square-cube', 'ch5-baudhayana-pythagoras'];
  const quiz = generateMultiChapterTrickyQuiz(chosen, 2026, staticMap, 20, 3);

  assert.equal(quiz.length, 20);
  const allowed = new Set(chosen);
  for (const q of quiz) {
    assert.ok(
      allowed.has(q.sourceChapterId),
      `Unexpected source chapter ${q.sourceChapterId}`
    );
  }
  const countCh1 = quiz.filter((q) => q.sourceChapterId === 'ch1-square-cube').length;
  const countP2Ch2 = quiz.filter((q) => q.sourceChapterId === 'ch5-baudhayana-pythagoras').length;
  assert.ok(countCh1 > 0 && countP2Ch2 > 0);
});

test('generateMultiChapterTrickyQuiz handles all 14 chapters and produces different sets on new seeds', () => {
  const staticMap = buildStaticMap();
  const allIds = GANITA_CHAPTERS.map((c) => c.id);
  const q1 = generateMultiChapterTrickyQuiz(allIds, 1111, staticMap, 20, 2);
  const q2 = generateMultiChapterTrickyQuiz(allIds, 9999, staticMap, 20, 2);

  assert.equal(q1.length, 20);
  assert.equal(q2.length, 20);
  assert.notDeepEqual(
    q1.map((q) => q.prompt),
    q2.map((q) => q.prompt)
  );
});

test('generateDynamicChapterQuiz & generateBookWideBossQuestions produce distinct difficulty tiers 1..4 without dilution', () => {
  const staticMap = buildStaticMap();
  const pool = staticMap['ch4-fractions-disguise'] || [];
  const chap1 = generateDynamicChapterQuiz('ch4-fractions-disguise', pool, 55, 20, 1);
  const chap4 = generateDynamicChapterQuiz('ch4-fractions-disguise', pool, 55, 20, 4);
  assert.equal(chap1.length, 20);
  assert.equal(chap4.length, 20);
  assert.notDeepEqual(
    chap1.map((q) => q.prompt),
    chap4.map((q) => q.prompt)
  );

  // Verify Olympiad chapter quiz contains ZERO easy baseline static prompts
  const staticPromptSet = new Set(pool.map((q) => q.prompt.trim().toLowerCase()));
  for (const q of chap4) {
    assert.ok(
      !staticPromptSet.has(q.prompt.trim().toLowerCase()),
      `Level 4 Olympiad diluted with baseline static question: ${q.prompt}`
    );
  }

  const allPool = Object.values(staticMap).flat() as ChapterAssessmentQuestion[];
  const boss1 = generateBookWideBossQuestions(allPool, 1, 30, 1);
  const boss3 = generateBookWideBossQuestions(allPool, 1, 30, 3);
  const boss4 = generateBookWideBossQuestions(allPool, 1, 30, 4);
  assert.equal(boss1.length, 30);
  assert.equal(boss3.length, 30);
  assert.equal(boss4.length, 30);
  assert.notDeepEqual(
    boss1.map((q) => q.prompt),
    boss4.map((q) => q.prompt)
  );
  assert.notDeepEqual(
    boss3.map((q) => q.prompt),
    boss4.map((q) => q.prompt)
  );
});

test('generateMultiChapterTrickyQuiz returns empty array when no chapters are selected', () => {
  const quiz = generateMultiChapterTrickyQuiz([], 555, {}, 20);
  assert.equal(quiz.length, 0);
});

