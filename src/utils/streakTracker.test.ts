import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateStreakView,
  formatLocalDateKey,
  getCalendarDaysBetween,
  mergeStreakSnapshots,
  recordStudyActivityForStreak,
} from './streakTracker';
import type { StudentAccountProfile } from '../types/account';

function makeAccount(
  overrides: Partial<StudentAccountProfile> = {}
): StudentAccountProfile {
  return {
    username: 'TestScholar',
    mascot: '🦉',
    grade: 'Class 8',
    createdAt: '2026-11-01T10:00:00.000Z',
    lastLoginAt: '2026-11-16T10:00:00.000Z',
    points: 0,
    unlockedBadgeIds: [],
    chapterGamePoints: {},
    streakCount: 0,
    longestStreak: 0,
    lastStreakDate: null,
    streakHistoryDays: [],
    ...overrides,
  };
}

test('formatLocalDateKey formats YYYY-MM-DD accurately', () => {
  const d = new Date(2026, 10, 5, 14, 30); // Nov 5, 2026 local
  assert.equal(formatLocalDateKey(d), '2026-11-05');
});

test('getCalendarDaysBetween handles month/year rollovers cleanly', () => {
  assert.equal(getCalendarDaysBetween('2026-11-15', '2026-11-16'), 1);
  assert.equal(getCalendarDaysBetween('2026-10-31', '2026-11-01'), 1);
  assert.equal(getCalendarDaysBetween('2026-11-16', '2026-11-16'), 0);
  assert.equal(getCalendarDaysBetween('2026-11-10', '2026-11-16'), 6);
});

test('evaluateStreakView locks streak to 0 when signed out', () => {
  const view = evaluateStreakView(null, '2026-11-16');
  assert.equal(view.status, 'locked');
  assert.equal(view.displayStreak, 0);
  assert.equal(view.studiedToday, false);
  assert.equal(view.recent7Days.length, 7);
});

test('recordStudyActivityForStreak starts at 1 on first activity and is idempotent same day', () => {
  const first = recordStudyActivityForStreak(null, '2026-11-16');
  assert.equal(first.changed, true);
  assert.equal(first.next.streakCount, 1);
  assert.equal(first.next.longestStreak, 1);
  assert.equal(first.next.lastStreakDate, '2026-11-16');
  assert.deepEqual(first.next.streakHistoryDays, ['2026-11-16']);

  const secondSameDay = recordStudyActivityForStreak(first.next, '2026-11-16');
  assert.equal(secondSameDay.changed, false);
  assert.equal(secondSameDay.next.streakCount, 1);
});

test('recordStudyActivityForStreak increments on consecutive calendar day and resets after gap', () => {
  const day1 = recordStudyActivityForStreak(null, '2026-11-14').next;
  const day2 = recordStudyActivityForStreak(day1, '2026-11-15').next;
  const day3 = recordStudyActivityForStreak(day2, '2026-11-16').next;

  assert.equal(day3.streakCount, 3);
  assert.equal(day3.longestStreak, 3);
  assert.deepEqual(day3.streakHistoryDays, [
    '2026-11-14',
    '2026-11-15',
    '2026-11-16',
  ]);

  // Gap of 2 days (skipped Nov 17, returned Nov 18)
  const afterGap = recordStudyActivityForStreak(day3, '2026-11-18').next;
  assert.equal(afterGap.streakCount, 1);
  assert.equal(afterGap.longestStreak, 3);
  assert.equal(afterGap.lastStreakDate, '2026-11-18');
});

test('evaluateStreakView reports active-today, at-risk yesterday, and expired gap accurately', () => {
  const activeToday = evaluateStreakView(
    makeAccount({
      streakCount: 4,
      longestStreak: 5,
      lastStreakDate: '2026-11-16',
      streakHistoryDays: ['2026-11-15', '2026-11-16'],
    }),
    '2026-11-16'
  );
  assert.equal(activeToday.status, 'active-today');
  assert.equal(activeToday.displayStreak, 4);
  assert.equal(activeToday.studiedToday, true);

  const atRisk = evaluateStreakView(
    makeAccount({
      streakCount: 4,
      longestStreak: 5,
      lastStreakDate: '2026-11-15',
      streakHistoryDays: ['2026-11-15'],
    }),
    '2026-11-16'
  );
  assert.equal(atRisk.status, 'at-risk');
  assert.equal(atRisk.displayStreak, 4);
  assert.equal(atRisk.studiedToday, false);

  const expired = evaluateStreakView(
    makeAccount({
      streakCount: 4,
      longestStreak: 5,
      lastStreakDate: '2026-11-14',
    }),
    '2026-11-16'
  );
  assert.equal(expired.status, 'inactive');
  assert.equal(expired.displayStreak, 0);
  assert.equal(expired.longestStreak, 5);
});

test('mergeStreakSnapshots preserves newest streak date and highest longestStreak', () => {
  const merged = mergeStreakSnapshots(
    {
      streakCount: 2,
      longestStreak: 4,
      lastStreakDate: '2026-11-15',
      streakHistoryDays: ['2026-11-14', '2026-11-15'],
    },
    {
      streakCount: 3,
      longestStreak: 3,
      lastStreakDate: '2026-11-16',
      streakHistoryDays: ['2026-11-16'],
    }
  );
  assert.equal(merged.streakCount, 3);
  assert.equal(merged.longestStreak, 4);
  assert.equal(merged.lastStreakDate, '2026-11-16');
  assert.deepEqual(merged.streakHistoryDays, [
    '2026-11-14',
    '2026-11-15',
    '2026-11-16',
  ]);
});
