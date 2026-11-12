import { StudentAccountProfile, RegisterPayload, LoginPayload } from '../types/account';

const ACTIVE_ACCOUNT_KEY = 'ganita_active_student_v1';
const SAVED_CREDENTIALS_KEY = 'ganita_student_credentials_v1';

export function getLocalStudentAccount(): StudentAccountProfile | null {
  try {
    const raw = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
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
    if (profile) {
      localStorage.setItem(ACTIVE_ACCOUNT_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
      localStorage.removeItem(SAVED_CREDENTIALS_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export function saveSavedPin(username: string, pin: string) {
  try {
    localStorage.setItem(SAVED_CREDENTIALS_KEY, JSON.stringify({ username, pin }));
  } catch {
    // Ignore
  }
}

export function getSavedPin(): { username: string; pin: string } | null {
  try {
    const raw = localStorage.getItem(SAVED_CREDENTIALS_KEY);
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
    body: JSON.stringify(payload),
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
  chapterGamePoints: Record<string, number>
): Promise<StudentAccountProfile | null> {
  try {
    const res = await fetch('/api/accounts/save-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pin, points, unlockedBadgeIds, chapterGamePoints }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.profile) {
        saveLocalStudentAccount(data.profile);
        return data.profile;
      }
    }
  } catch {
    // Non-blocking sync failure, local progress preserved
  }
  return null;
}
