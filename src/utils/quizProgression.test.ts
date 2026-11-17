import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hashQuizKey,
  hasCompletedQuizOnce,
  getInitialQuizSeedForAttempt,
  getNextDynamicSeed,
  addCompletedQuizKey,
} from './quizProgression';

test('quiz seed stays deterministic before first completion', () => {
  const key = 'chapter:ch1-square-cube';
  const completed: string[] = [];

  assert.equal(hasCompletedQuizOnce(key, completed), false);

  const seedA = getInitialQuizSeedForAttempt(key, completed, 1000);
  const seedB = getInitialQuizSeedForAttempt(key, completed, 999999);
  assert.equal(seedA, hashQuizKey(key));
  assert.equal(seedA, seedB);

  const next = getNextDynamicSeed(seedA, key, completed, 5555);
  assert.equal(next.changed, false);
  assert.equal(next.seed, seedA);
});

test('quiz seed changes dynamically every time only AFTER first completion', () => {
  const key = 'chapter:ch1-square-cube';
  const completed = addCompletedQuizKey([], key);

  assert.equal(hasCompletedQuizOnce(key, completed), true);

  const baseSeed = hashQuizKey(key);
  const retake1 = getInitialQuizSeedForAttempt(key, completed, 12345);
  const retake2 = getInitialQuizSeedForAttempt(key, completed, 67890);

  assert.notEqual(retake1, baseSeed);
  assert.notEqual(retake2, baseSeed);
  assert.notEqual(retake1, retake2);

  const next = getNextDynamicSeed(retake1, key, completed, 4321);
  assert.equal(next.changed, true);
  assert.notEqual(next.seed, retake1);
});

test('addCompletedQuizKey deduplicates keys cleanly', () => {
  const keys = addCompletedQuizKey(['module:ch1:1.1'], 'module:ch1:1.1');
  assert.deepEqual(keys, ['module:ch1:1.1']);
  const keys2 = addCompletedQuizKey(keys, 'chapter:ch1-square-cube');
  assert.deepEqual(keys2, ['module:ch1:1.1', 'chapter:ch1-square-cube']);
});
