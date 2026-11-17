import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_MASTERY_EXP,
  applyBadgeUnlockIfSignedIn,
  applyChapterPointsIfSignedIn,
  buildResetStatsState,
  canUnlockStats,
  hydrateStatsForSignedInAccount,
} from './statsGate';
import { StudentAccountProfile } from '../types/account';

const demoAccount: StudentAccountProfile = {
  username: 'DemoStudent',
  mascot: '🦉',
  grade: 'Class 8',
  createdAt: '2026-11-13T00:00:00.000Z',
  lastLoginAt: '2026-11-13T00:00:00.000Z',
  points: 250,
  unlockedBadgeIds: ['m1_1'],
  chapterGamePoints: { 'ch1-square-cube': 90 },
};

test('buildResetStatsState resets all stats cleanly to zero', () => {
  const reset = buildResetStatsState();
  assert.equal(reset.masteryPoints, 0);
  assert.deepEqual(reset.unlockedBadgeIds, []);
  assert.deepEqual(reset.chapterGamePoints, {});
});

test('canUnlockStats requires an active signed-in student profile', () => {
  assert.equal(canUnlockStats(null), false);
  assert.equal(canUnlockStats(undefined), false);
  assert.equal(canUnlockStats(demoAccount), true);
});

test('badge unlocks and points are blocked while signed out and enabled once signed in', () => {
  const initial = buildResetStatsState();

  const lockedBadgeResult = applyBadgeUnlockIfSignedIn(null, initial, 'm1_1', 35);
  assert.equal(lockedBadgeResult.unlocked, false);
  assert.equal(lockedBadgeResult.next.masteryPoints, 0);
  assert.deepEqual(lockedBadgeResult.next.unlockedBadgeIds, []);

  const lockedGameResult = applyChapterPointsIfSignedIn(null, initial, 'ch1-square-cube', 12);
  assert.equal(lockedGameResult.added, false);
  assert.equal(lockedGameResult.next.masteryPoints, 0);

  const unlockedBadgeResult = applyBadgeUnlockIfSignedIn(demoAccount, initial, 'm1_1', 35);
  assert.equal(unlockedBadgeResult.unlocked, true);
  assert.equal(unlockedBadgeResult.next.masteryPoints, 35);
  assert.deepEqual(unlockedBadgeResult.next.unlockedBadgeIds, ['m1_1']);
});

test('hydrateStatsForSignedInAccount restores profile stats and enforces 4000 EXP cap', () => {
  const overCapProfile: StudentAccountProfile = {
    ...demoAccount,
    points: 81000,
  };
  const hydrated = hydrateStatsForSignedInAccount(overCapProfile);
  assert.equal(hydrated.masteryPoints, MAX_MASTERY_EXP);
  assert.deepEqual(hydrated.unlockedBadgeIds, ['m1_1']);
  assert.equal(hydrated.chapterGamePoints['ch1-square-cube'], 90);
});
