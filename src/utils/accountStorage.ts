import {
  StudentAccountProfile,
  RegisterPayload,
  LoginPayload,
  QuizAttemptRecord,
} from '../types/account';
import type { StreakSnapshot } from './streakTracker';

const SESSION_ACCOUNT_KEY = 'ganita_session_student_v1';
const SESSION_CREDENTIALS_KEY = 'ganita_session_credentials_v1';

// Legacy localStorage keys that previously leaked guest EXP/badges before sign-in
const LEGACY_STORAGE_KEYS = [
  'ganita_active_student_v1',
  'ganita_student_credentials_v1',
  'ganita_prakash_unlocked_badges_v1',
  'ganita_prakash_mastery_points_v1',
  'ganita_prakash_chapter_points_v1',
];

export function resetUnauthenticatedLocalStats(): void {
  try {
    LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Ignore storage errors
  }
}

export function getLocalStudentAccount(): StudentAccountProfile | null {
  try {
    // Always wipe legacy unauthenticated local stats on entry
    resetUnauthenticatedLocalStats();
    const raw = sessionStorage.getItem(SESSION_ACCOUNT_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore storage parse errors
  }
  return null;
}

export function saveLocalStudentAccount(profile: StudentAccountProfile | null) {
  try {
    resetUnauthenticatedLocalStats();
    if (profile) {
      sessionStorage.setItem(SESSION_ACCOUNT_KEY, JSON.stringify(profile));
    } else {
      sessionStorage.removeItem(SESSION_ACCOUNT_KEY);
      sessionStorage.removeItem(SESSION_CREDENTIALS_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export function saveSavedPin(username: string, pin: string) {
  try {
    sessionStorage.setItem(SESSION_CREDENTIALS_KEY, JSON.stringify({ username, pin }));
  } catch {
    // Ignore
  }
}

export function getSavedPin(): { username: string; pin: string } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_CREDENTIALS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return null;
}

export async function registerAccountOnServer(
  payload: RegisterPayload
): Promise<StudentAccountProfile> {
  const res = await fetch('/api/accounts/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      initialPoints: 0,
      initialBadgeIds: [],
      initialChapterPoints: {},
      initialQuizHistory: [],
      initialCompletedQuizKeys: [],
      initialStreakCount: 0,
      initialLongestStreak: 0,
      initialLastStreakDate: null,
      initialStreakHistoryDays: [],
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to register student account.');
  }

  saveLocalStudentAccount(data.profile);
  saveSavedPin(payload.username, payload.pin);
  return data.profile;
}

export async function loginAccountOnServer(
  payload: LoginPayload
): Promise<StudentAccountProfile> {
  const res = await fetch('/api/accounts/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to log in to student account.');
  }

  saveLocalStudentAccount(data.profile);
  saveSavedPin(payload.username, payload.pin);
  return data.profile;
}

export async function syncProgressToServer(
  username: string,
  pin: string,
  points: number,
  unlockedBadgeIds: string[],
  chapterGamePoints: Record<string, number>,
  quizHistory?: QuizAttemptRecord[],
  completedQuizKeys?: string[],
  streak?: StreakSnapshot
): Promise<StudentAccountProfile | null> {
  try {
    const res = await fetch('/api/accounts/save-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        pin,
        points,
        unlockedBadgeIds,
        chapterGamePoints,
        quizHistory,
        completedQuizKeys,
        ...(streak
          ? {
              streakCount: streak.streakCount,
              longestStreak: streak.longestStreak,
              lastStreakDate: streak.lastStreakDate,
              streakHistoryDays: streak.streakHistoryDays,
            }
          : {}),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.profile) {
        saveLocalStudentAccount(data.profile);
        return data.profile;
      }
    }
  } catch {
    // Non-blocking sync failure
  }
  return null;
}
