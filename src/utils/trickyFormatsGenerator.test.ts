import test from 'node:test';
import assert from 'node:assert/strict';
import { ChapterId } from '../types/math';
import {
  ALL_TRICKY_FORMATS,
  checkLongAnswerLenientLocal,
  checkSubjectiveAnswerLenient,
  generateFormattedTrickyQuiz,
  getQuestionTotalMarks,
} from './trickyFormatsGenerator';

const ALL_14_CHAPTER_IDS: ChapterId[] = [
  'ch1-square-cube',
  'ch2-power-play',
  'ch3-story-numbers',
  'ch4-quadrilaterals',
  'ch5-number-play',
  'ch6-we-distribute',
  'ch7-proportional-1',
  'ch4-fractions-disguise',
  'ch5-baudhayana-pythagoras',
  'ch6-proportional-reasoning',
  'ch11-geometric-themes',
  'ch12-dots-and-lines',
  'ch13-algebra-play',
  'ch14-area',
];

test('Mixed 4-format quiz totals 20 marks and includes all 4 requested formats including Assertion-Reason MCQ', () => {
  const qs = generateFormattedTrickyQuiz({
    selectedChapterIds: ALL_14_CHAPTER_IDS,
    seed: 123,
    difficulty: 2,
    enabledFormats: ALL_TRICKY_FORMATS,
    totalTarget: 20,
  });

  const totalMarks = qs.reduce((s, q) => s + getQuestionTotalMarks(q), 0);
  assert.equal(totalMarks, 20);

  const mcqs = qs.filter((q) => q.formatType === 'mcq');
  const normalMcqs = mcqs.filter((q) => q.mcqSubKind === 'normal');
  const arMcqs = mcqs.filter((q) => q.mcqSubKind === 'assertion-reason');
  const subj = qs.filter((q) => q.formatType === 'subjective');
  const longAns = qs.filter((q) => q.formatType === 'long-answer');
  const caseStudies = qs.filter((q) => q.formatType === 'case-study');

  assert.ok(normalMcqs.length >= 2, 'Expected normal MCQs');
  assert.ok(arMcqs.length >= 1, 'Expected Assertion-Reason MCQs');
  assert.ok(subj.length >= 2, 'Expected Subjective Answer-Only cards');
  assert.ok(longAns.length >= 1, 'Expected Long Answer cards');
  assert.ok(caseStudies.length >= 1, 'Expected Case Study cards');

  for (const ar of arMcqs) {
    assert.ok(ar.assertion && ar.assertion.length > 5);
    assert.ok(ar.reason && ar.reason.length > 5);
    assert.equal(ar.options.length, 4);
  }

  for (const cs of caseStudies) {
    assert.ok(cs.scenarioTitle && cs.scenarioText);
    assert.equal(cs.subQuestions?.length, 4);
    assert.deepEqual(
      cs.subQuestions?.map((s) => s.subLabel),
      ['a', 'b', 'c', 'd']
    );
    const hasMcq = cs.subQuestions?.some((s) => s.subType === 'mcq');
    const hasSubj = cs.subQuestions?.some((s) => s.subType === 'subjective');
    assert.ok(hasMcq && hasSubj, 'Case study should include MCQ and Subjective sub-questions');
  }
});

test('Individual format toggles strictly return ONLY chosen formats totaling 20 marks across every single chapter', () => {
  for (const fmt of ALL_TRICKY_FORMATS) {
    const qs = generateFormattedTrickyQuiz({
      selectedChapterIds: ['ch1-square-cube'],
      seed: 99,
      difficulty: 3,
      enabledFormats: [fmt],
      totalTarget: 20,
    });
    const marks = qs.reduce((s, q) => s + getQuestionTotalMarks(q), 0);
    assert.equal(marks, 20, `Format ${fmt} should total 20 marks`);
    for (const q of qs) {
      assert.equal(q.formatType, fmt, `Expected only ${fmt}, got ${q.formatType}`);
      assert.equal(q.sourceChapterId, 'ch1-square-cube', 'Strict single-chapter scope violated');
    }
  }
});

test('Difficulty 1 vs Difficulty 4 generates strictly distinct sets across formats', () => {
  const fnd = generateFormattedTrickyQuiz({
    selectedChapterIds: ['ch1-square-cube', 'ch5-baudhayana-pythagoras', 'ch14-area'],
    seed: 77,
    difficulty: 1,
    enabledFormats: ALL_TRICKY_FORMATS,
  });
  const oly = generateFormattedTrickyQuiz({
    selectedChapterIds: ['ch1-square-cube', 'ch5-baudhayana-pythagoras', 'ch14-area'],
    seed: 77,
    difficulty: 4,
    enabledFormats: ALL_TRICKY_FORMATS,
  });

  const fndPrompts = new Set(fnd.map((q) => q.prompt.trim().toLowerCase()));
  const overlap = oly.filter((q) => fndPrompts.has(q.prompt.trim().toLowerCase()));
  assert.equal(overlap.length, 0, 'Olympiad and Foundation tricky quizzes should not overlap');
});

test('Lenient subjective checker accepts currency, commas, units, variable prefix, fractions, and small tolerance', () => {
  assert.equal(checkSubjectiveAnswerLenient('1,729', ['1729']), true);
  assert.equal(checkSubjectiveAnswerLenient('Rs 1729', ['₹1,729']), true);
  assert.equal(checkSubjectiveAnswerLenient('x = 8', ['8']), true);
  assert.equal(checkSubjectiveAnswerLenient('3/4', ['0.75']), true);
  assert.equal(checkSubjectiveAnswerLenient('0.74', ['3/4']), true);
  assert.equal(checkSubjectiveAnswerLenient('120 cm²', ['120']), true);
  assert.equal(checkSubjectiveAnswerLenient('144 degrees', ['144°']), true);
  assert.equal(checkSubjectiveAnswerLenient('9999', ['1729']), false);
  assert.equal(checkSubjectiveAnswerLenient('', ['1729']), false);
});

test('Lenient Long Answer local grader awards full/partial credit for valid method & rejects unrelated gibberish', () => {
  const full = checkLongAnswerLenientLocal(
    'Step 1: 15x = 360\nStep 2: x = 24\nLargest = 6 * 24 = 144',
    '144°',
    '15x = 360 => x = 24 => 6*24 = 144',
    ['15x = 360', 'x = 24', '144']
  );
  assert.equal(full.isCorrect, true);
  assert.ok(full.creditScore >= 8);

  const partialMethod = checkLongAnswerLenientLocal(
    'Let angles be 2x, 3x, 4x, 6x so 15x = 360 and x = 24 degrees. Largest is 140',
    '144°',
    '15x = 360 => x = 24 => 144',
    ['15x = 360', 'x = 24', '144']
  );
  assert.equal(partialMethod.isCorrect, true);
  assert.ok(partialMethod.creditScore >= 6);

  const wrong = checkLongAnswerLenientLocal('hello', '144°', '15x = 360', ['144']);
  assert.equal(wrong.isCorrect, false);
  assert.ok(wrong.creditScore < 6);
});
