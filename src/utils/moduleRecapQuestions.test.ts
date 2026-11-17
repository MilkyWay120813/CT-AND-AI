import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PART1_CURRICULUM_CHAPTERS,
  PART2_CURRICULUM_CHAPTERS,
} from '../data/part1CurriculumData';
import { getRecapQuizConfig } from './moduleRecapQuestions';
import { generateModuleSpecificQuestions } from './moduleSpecificQuestions';

const BANNED_FILLER_FRAGMENTS = [
  'reciprocal (multiplicative inverse) of −5/8',
  'additive inverse of 14/19',
  'solve for x: 3x − 7 = 14',
  'what is 35% of 240',
  'verified and correct',
  'contradicts the rule',
  'alternative option',
  'which arithmetic operation is commutative for all rational numbers',
];

const teachingChapters = [...PART1_CURRICULUM_CHAPTERS, ...PART2_CURRICULUM_CHAPTERS].filter(
  (ch) => ch.modules.length === 8
);

test('Curriculum has 14 teaching chapters and 112 modules total', () => {
  assert.equal(teachingChapters.length, 14);
  const totalMods = teachingChapters.reduce((sum, ch) => sum + ch.modules.length, 0);
  assert.equal(totalMods, 112);
});

test('All 98 M1-M7 modules return 5 unique, valid, strictly module-related questions (seed 0 & retake seed 42)', () => {
  for (const chapter of teachingChapters) {
    for (let i = 0; i < chapter.modules.length - 1; i++) {
      const mod = chapter.modules[i];

      for (const seed of [0, 42]) {
        const config = getRecapQuizConfig(
          mod.moduleCode,
          mod.title,
          mod.simulation.formulaHighlight,
          mod.game.challenges,
          mod.simulation,
          false,
          seed,
          mod.id,
          chapter.chapterId
        );

        assert.equal(
          config.isLastModule,
          false,
          `${mod.id} seed=${seed} should not be marked isLastModule`
        );
        assert.equal(
          config.questions.length,
          5,
          `${mod.id} (${mod.title}) seed=${seed} expected 5 questions, got ${config.questions.length}`
        );
        assert.equal(config.totalMarks, 5);
        assert.equal(config.passingMarks, 4);
        assert.equal(config.passingPercentage, 80);

        const promptSet = new Set<string>();
        const allowedPrompts = new Set(
          [
            ...mod.game.challenges,
            ...generateModuleSpecificQuestions(mod.id, seed),
            ...generateModuleSpecificQuestions(mod.id, seed + 137),
          ].map((q) => q.prompt.trim().toLowerCase())
        );

        for (const q of config.questions) {
          const normalizedPrompt = q.prompt.trim().toLowerCase();
          assert.ok(normalizedPrompt.length > 10, `${mod.id}: empty/short prompt`);
          assert.ok(
            !promptSet.has(normalizedPrompt),
            `${mod.id} seed=${seed}: duplicate prompt "${q.prompt}"`
          );
          promptSet.add(normalizedPrompt);

          assert.ok(
            allowedPrompts.has(normalizedPrompt),
            `${mod.id}: leaked non-module question "${q.prompt}"`
          );

          assert.equal(
            q.options.length,
            4,
            `${mod.id}: prompt "${q.prompt}" should have 4 options, got ${q.options.length}`
          );
          assert.equal(
            new Set(q.options).size,
            4,
            `${mod.id}: prompt "${q.prompt}" has duplicate options: ${JSON.stringify(q.options)}`
          );
          assert.ok(
            q.correctIndex >= 0 && q.correctIndex < q.options.length,
            `${mod.id}: invalid correctIndex ${q.correctIndex}`
          );
          assert.ok(q.explanation && q.explanation.trim().length > 3, `${mod.id}: missing explanation`);

          const combinedText = `${q.prompt} ${q.options.join(' ')} ${q.explanation}`.toLowerCase();
          for (const banned of BANNED_FILLER_FRAGMENTS) {
            assert.ok(
              !combinedText.includes(banned),
              `${mod.id}: contains off-topic/filler "${banned}" in "${q.prompt}"`
            );
          }
        }
      }
    }
  }
});

test('All 14 Module 8 Capstones return 10 unique chapter-scoped questions with zero off-chapter leakage', () => {
  for (const chapter of teachingChapters) {
    const m8 = chapter.modules[chapter.modules.length - 1];

    // Collect valid chapter-scoped prompts from M1-M7 + M8 existing
    const chapterValidPrompts = new Set<string>(
      m8.game.challenges.map((c) => c.prompt.trim().toLowerCase())
    );
    for (let i = 0; i < chapter.modules.length - 1; i++) {
      const mod = chapter.modules[i];
      for (const seed of [0, 42]) {
        const qs = generateModuleSpecificQuestions(mod.id, seed + i * 17);
        qs.forEach((q) => chapterValidPrompts.add(q.prompt.trim().toLowerCase()));
      }
    }

    for (const seed of [0, 42]) {
      const config = getRecapQuizConfig(
        m8.moduleCode,
        m8.title,
        m8.simulation.formulaHighlight,
        m8.game.challenges,
        m8.simulation,
        true,
        seed,
        m8.id,
        chapter.chapterId
      );

      assert.equal(config.isLastModule, true);
      assert.equal(
        config.questions.length,
        10,
        `${chapter.chapterId} (${m8.id}) seed=${seed} expected 10 capstone questions, got ${config.questions.length}`
      );
      assert.equal(config.totalMarks, 10);
      assert.equal(config.passingMarks, 8);
      assert.equal(config.passingPercentage, 80);

      const promptSet = new Set<string>();
      for (const q of config.questions) {
        const key = q.prompt.trim().toLowerCase();
        assert.ok(!promptSet.has(key), `${m8.id}: duplicate capstone prompt "${q.prompt}"`);
        promptSet.add(key);
        assert.ok(
          chapterValidPrompts.has(key),
          `${chapter.chapterId} (${m8.id}): leaked cross-chapter prompt "${q.prompt}"`
        );
        assert.equal(q.options.length, 4, `${m8.id}: capstone option count != 4`);
        assert.ok(q.correctIndex >= 0 && q.correctIndex < 4, `${m8.id}: invalid correctIndex`);

        const combinedText = `${q.prompt} ${q.options.join(' ')} ${q.explanation}`.toLowerCase();
        for (const banned of BANNED_FILLER_FRAGMENTS) {
          assert.ok(!combinedText.includes(banned), `${m8.id}: banned filler "${banned}"`);
        }
      }
    }
  }
});

test('Spot-check Part I & Part II domain fidelity (zero cross-chapter collision on matching module codes)', () => {
  // Part I 3.1 (Counting) vs Part II 3.1 (Proportional Reasoning)
  const p1_3_1 = PART1_CURRICULUM_CHAPTERS[2].modules[0];
  const p2_3_1 = PART2_CURRICULUM_CHAPTERS[2].modules[0];

  const qP1 = getRecapQuizConfig(
    p1_3_1.moduleCode,
    p1_3_1.title,
    p1_3_1.simulation.formulaHighlight,
    p1_3_1.game.challenges,
    p1_3_1.simulation,
    false,
    0,
    p1_3_1.id,
    'ch3-story-numbers'
  );
  const qP2 = getRecapQuizConfig(
    p2_3_1.moduleCode,
    p2_3_1.title,
    p2_3_1.simulation.formulaHighlight,
    p2_3_1.game.challenges,
    p2_3_1.simulation,
    false,
    0,
    p2_3_1.id,
    'ch6-proportional-reasoning'
  );

  const p1AllText = qP1.questions.map((q) => q.prompt).join(' ').toLowerCase();
  const p2AllText = qP2.questions.map((q) => q.prompt).join(' ').toLowerCase();

  assert.ok(
    p1AllText.includes('count') || p1AllText.includes('knot') || p1AllText.includes('alphabet') || p1AllText.includes('token'),
    `Part I 3.1 should test counting mechanisms: ${p1AllText}`
  );
  assert.ok(!p1AllText.includes('exponent'), 'Part I 3.1 must NOT leak exponents');
  assert.ok(
    p2AllText.includes('ratio') || p2AllText.includes('proportion') || p2AllText.includes('recipe') || p2AllText.includes('additive'),
    `Part II 3.1 should test proportions/ratios: ${p2AllText}`
  );
});

test('All 112 module Slide 5 recap quizzes adapt cleanly across difficulty 1, 3, and 4 with distinct Olympiad vs Foundation sets', () => {
  for (const chapter of teachingChapters) {
    for (let i = 0; i < chapter.modules.length; i++) {
      const mod = chapter.modules[i];
      const isCapstone = i === chapter.modules.length - 1;
      const results: Record<number, ReturnType<typeof getRecapQuizConfig>> = {};
      for (const difficulty of [1, 2, 3, 4] as const) {
        const config = getRecapQuizConfig(
          mod.moduleCode,
          mod.title,
          mod.simulation.formulaHighlight,
          mod.game.challenges,
          mod.simulation,
          isCapstone,
          0,
          mod.id,
          chapter.chapterId,
          difficulty
        );
        assert.equal(
          config.questions.length,
          isCapstone ? 10 : 5,
          `${mod.id} difficulty=${difficulty} count mismatch`
        );
        const promptSet = new Set<string>();
        for (const q of config.questions) {
          const p = q.prompt.trim().toLowerCase();
          assert.ok(!promptSet.has(p), `${mod.id} d=${difficulty} duplicate prompt: ${q.prompt}`);
          promptSet.add(p);
          assert.equal(q.options.length, 4);
          assert.equal(new Set(q.options).size, 4, `${mod.id} d=${difficulty} duplicate options`);
          assert.ok(q.correctIndex >= 0 && q.correctIndex < 4);
          if (!isCapstone && q.clue) {
            const refMatch = q.clue.match(/Ref:\s*Module\s+(\d+\.\d+)/i);
            if (refMatch) {
              assert.equal(
                `Module ${refMatch[1]}`,
                mod.moduleCode,
                `${mod.id} d=${difficulty} leaked sibling module Ref: Module ${refMatch[1]} in prompt "${q.prompt}"`
              );
            }
          }
        }
        results[difficulty] = config;
      }

      // Foundation (1), Challenger (3), and Olympiad (4) must produce completely distinct prompts for EVERY module
      const p1 = new Set(results[1].questions.map((q) => q.prompt.trim().toLowerCase()));
      const p3 = new Set(results[3].questions.map((q) => q.prompt.trim().toLowerCase()));
      const p4 = new Set(results[4].questions.map((q) => q.prompt.trim().toLowerCase()));
      for (const p of p4) {
        assert.ok(!p1.has(p), `${mod.id}: Olympiad question repeated in Foundation: ${p}`);
        assert.ok(!p3.has(p), `${mod.id}: Olympiad question repeated in Challenger: ${p}`);
      }
    }
  }
});

