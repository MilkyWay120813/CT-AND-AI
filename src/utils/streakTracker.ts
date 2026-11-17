import type { StudentAccountProfile } from '../types/account';

export interface StreakSnapshot {
  streakCount: number;
  longestStreak: number;
  lastStreakDate: string | null;
  streakHistoryDays: string[];
}

export type StreakStatus = 'locked' | 'inactive' | 'active-today' | 'at-risk';

export interface EvaluatedStreakView {
  displayStreak: number;
  longestStreak: number;
  status: StreakStatus;
  studiedToday: boolean;
  lastStreakDate: string | null;
  recent7Days: Array<{
    dateKey: string;
    label: string;
    active: boolean;
    isToday: boolean;
  }>;
}

const DATE_KEY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MAX_HISTORY_DAYS = 90;

/**
 * Formats a Date into local YYYY-MM-DD so calendar streaks match the student's study day.
 */
export function formatLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Computes exact whole calendar day difference (b - a) between two YYYY-MM-DD strings.
 * Uses UTC midnight from the parsed components to avoid DST hour-drift.
 */
export function getCalendarDaysBetween(earlierKey: string, laterKey: string): number | null {
  const m1 = DATE_KEY_RE.exec(earlierKey.trim());
  const m2 = DATE_KEY_RE.exec(laterKey.trim());
  if (!m1 || !m2) return null;

  const utc1 = Date.UTC(Number(m1[1]), Number(m1[2]) - 1, Number(m1[3]));
  const utc2 = Date.UTC(Number(m2[1]), Number(m2[2]) - 1, Number(m2[3]));
  return Math.round((utc2 - utc1) / 86_400_000);
}

export function sanitizeDateKey(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return DATE_KEY_RE.test(trimmed) ? trimmed : null;
}

export function sanitizeStreakSnapshot(
  raw?: Partial<StreakSnapshot> | null
): StreakSnapshot {
  const count = Math.max(0, Math.floor(Number(raw?.streakCount) || 0));
  const longest = Math.max(count, Math.floor(Number(raw?.longestStreak) || 0));
  const lastDate = sanitizeDateKey(raw?.lastStreakDate);
  const rawDays = Array.isArray(raw?.streakHistoryDays) ? raw.streakHistoryDays : [];
  const dedupedDays = Array.from(
    new Set(
      rawDays
        .map((d) => sanitizeDateKey(d))
        .filter((d): d is string => Boolean(d))
    )
  )
    .sort()
    .slice(-MAX_HISTORY_DAYS);

  return {
    streakCount: count,
    longestStreak: longest,
    lastStreakDate: lastDate,
    streakHistoryDays: dedupedDays,
  };
}

function buildRecent7Days(
  todayKey: string,
  historyDays: string[]
): EvaluatedStreakView['recent7Days'] {
  const m = DATE_KEY_RE.exec(todayKey);
  if (!m) return [];
  const baseUtc = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const activeSet = new Set(historyDays);
  const weekdayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days: EvaluatedStreakView['recent7Days'] = [];
  for (let offset = 6; offset >= 0; offset--) {
    const dt = new Date(baseUtc - offset * 86_400_000);
    const key = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(
      2,
      '0'
    )}-${String(dt.getUTCDate()).padStart(2, '0')}`;
    days.push({
      dateKey: key,
      label: offset === 0 ? 'Today' : weekdayShort[dt.getUTCDay()],
      active: activeSet.has(key),
      isToday: offset === 0,
    });
  }
  return days;
}

/**
 * Evaluates what streak UI should show right now for either signed-in or guest users.
 */
export function evaluateStreakView(
  account: StudentAccountProfile | null,
  todayKey: string = formatLocalDateKey()
): EvaluatedStreakView {
  if (!account || !account.username?.trim()) {
    return {
      displayStreak: 0,
      longestStreak: 0,
      status: 'locked',
      studiedToday: false,
      lastStreakDate: null,
      recent7Days: buildRecent7Days(todayKey, []),
    };
  }

  const snap = sanitizeStreakSnapshot({
    streakCount: account.streakCount,
    longestStreak: account.longestStreak,
    lastStreakDate: account.lastStreakDate,
    streakHistoryDays: account.streakHistoryDays,
  });

  if (!snap.lastStreakDate || snap.streakCount <= 0) {
    return {
      displayStreak: 0,
      longestStreak: snap.longestStreak,
      status: 'inactive',
      studiedToday: false,
      lastStreakDate: snap.lastStreakDate,
      recent7Days: buildRecent7Days(todayKey, snap.streakHistoryDays),
    };
  }

  const diff = getCalendarDaysBetween(snap.lastStreakDate, todayKey);
  if (diff === null) {
    return {
      displayStreak: 0,
      longestStreak: snap.longestStreak,
      status: 'inactive',
      studiedToday: false,
      lastStreakDate: snap.lastStreakDate,
      recent7Days: buildRecent7Days(todayKey, snap.streakHistoryDays),
    };
  }

  // Same day (or minor clock skew slightly in past)
  if (diff <= 0) {
    return {
      displayStreak: snap.streakCount,
      longestStreak: snap.longestStreak,
      status: 'active-today',
      studiedToday: true,
      lastStreakDate: snap.lastStreakDate,
      recent7Days: buildRecent7Days(todayKey, snap.streakHistoryDays),
    };
  }

  // Studied yesterday — streak still alive today if they study before midnight!
  if (diff === 1) {
    return {
      displayStreak: snap.streakCount,
      longestStreak: snap.longestStreak,
      status: 'at-risk',
      studiedToday: false,
      lastStreakDate: snap.lastStreakDate,
      recent7Days: buildRecent7Days(todayKey, snap.streakHistoryDays),
    };
  }

  // Missed >= 1 full calendar day (diff >= 2): streak has expired to 0
  return {
    displayStreak: 0,
    longestStreak: snap.longestStreak,
    status: 'inactive',
    studiedToday: false,
    lastStreakDate: snap.lastStreakDate,
    recent7Days: buildRecent7Days(todayKey, snap.streakHistoryDays),
  };
}

/**
 * Pure state transition when a signed-in student performs a study activity on `todayKey`.
 */
export function recordStudyActivityForStreak(
  current: Partial<StreakSnapshot> | null | undefined,
  todayKey: string = formatLocalDateKey()
): { changed: boolean; next: StreakSnapshot } {
  const snap = sanitizeStreakSnapshot(current);
  const validToday = sanitizeDateKey(todayKey) || formatLocalDateKey();
  const hasTodayInHistory = snap.streakHistoryDays.includes(validToday);

  if (!snap.lastStreakDate || snap.streakCount <= 0) {
    const nextHistory = hasTodayInHistory
      ? snap.streakHistoryDays
      : [...snap.streakHistoryDays, validToday].sort().slice(-MAX_HISTORY_DAYS);
    return {
      changed: true,
      next: {
        streakCount: 1,
        longestStreak: Math.max(1, snap.longestStreak),
        lastStreakDate: validToday,
        streakHistoryDays: nextHistory,
      },
    };
  }

  const diff = getCalendarDaysBetween(snap.lastStreakDate, validToday);
  if (diff === null || diff >= 2) {
    const nextHistory = hasTodayInHistory
      ? snap.streakHistoryDays
      : [...snap.streakHistoryDays, validToday].sort().slice(-MAX_HISTORY_DAYS);
    return {
      changed: true,
      next: {
        streakCount: 1,
        longestStreak: Math.max(1, snap.longestStreak),
        lastStreakDate: validToday,
        streakHistoryDays: nextHistory,
      },
    };
  }

  if (diff <= 0) {
    // Already recorded today — idempotent!
    if (hasTodayInHistory) {
      return { changed: false, next: snap };
    }
    return {
      changed: true,
      next: {
        ...snap,
        streakHistoryDays: [...snap.streakHistoryDays, validToday]
          .sort()
          .slice(-MAX_HISTORY_DAYS),
      },
    };
  }

  // diff === 1 -> Consecutive day! Increment streak!
  const nextCount = snap.streakCount + 1;
  const nextHistory = hasTodayInHistory
    ? snap.streakHistoryDays
    : [...snap.streakHistoryDays, validToday].sort().slice(-MAX_HISTORY_DAYS);

  return {
    changed: true,
    next: {
      streakCount: nextCount,
      longestStreak: Math.max(nextCount, snap.longestStreak),
      lastStreakDate: validToday,
      streakHistoryDays: nextHistory,
    },
  };
}

/**
 * Merges client and server streak snapshots conservatively without losing earned days.
 */
export function mergeStreakSnapshots(
  existing: Partial<StreakSnapshot> | null | undefined,
  incoming: Partial<StreakSnapshot> | null | undefined
): StreakSnapshot {
  const a = sanitizeStreakSnapshot(existing);
  const b = sanitizeStreakSnapshot(incoming);
  const mergedDays = Array.from(
    new Set([...a.streakHistoryDays, ...b.streakHistoryDays])
  )
    .sort()
    .slice(-MAX_HISTORY_DAYS);

  const aDate = a.lastStreakDate || '';
  const bDate = b.lastStreakDate || '';

  if (bDate > aDate) {
    return {
      streakCount: b.streakCount,
      longestStreak: Math.max(a.longestStreak, b.longestStreak),
      lastStreakDate: b.lastStreakDate,
      streakHistoryDays: mergedDays,
    };
  }
  if (aDate === bDate) {
    return {
      streakCount: Math.max(a.streakCount, b.streakCount),
      longestStreak: Math.max(a.longestStreak, b.longestStreak),
      lastStreakDate: a.lastStreakDate || b.lastStreakDate,
      streakHistoryDays: mergedDays,
    };
  }
  return {
    streakCount: a.streakCount,
    longestStreak: Math.max(a.longestStreak, b.longestStreak),
    lastStreakDate: a.lastStreakDate,
    streakHistoryDays: mergedDays,
  };
}
