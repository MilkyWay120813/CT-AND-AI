/**
 * Controls quiz seed progression:
 * - Before a quiz is completed for the first time, it uses a deterministic initial seed
 *   so the quiz remains stable until completed once.
 * - Only AFTER first completion does every subsequent retake / revisit dynamically
 *   change the generated quiz set every time.
 */

export function hashQuizKey(quizKey: string): number {
  let h = 2166136261;
  for (let i = 0; i < quizKey.length; i++) {
    h ^= quizKey.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % 9000 + 100;
}

export function hasCompletedQuizOnce(
  quizKey: string,
  completedQuizKeys: string[] | null | undefined
): boolean {
  if (!Array.isArray(completedQuizKeys) || !quizKey) return false;
  return completedQuizKeys.includes(quizKey);
}

export function getInitialQuizSeedForAttempt(
  quizKey: string,
  completedQuizKeys: string[] | null | undefined,
  entropySource: number = Date.now()
): number {
  const baseSeed = hashQuizKey(quizKey);
  if (!hasCompletedQuizOnce(quizKey, completedQuizKeys)) {
    // Deterministic first-pass seed: stays the same until completed once!
    return baseSeed;
  }
  // Already completed at least once: dynamically vary every time
  const dynamicOffset = (Math.abs(Math.floor(entropySource)) % 89999) + 17;
  return baseSeed + dynamicOffset === baseSeed
    ? baseSeed + 97
    : baseSeed + dynamicOffset;
}

export function getNextDynamicSeed(
  previousSeed: number,
  quizKey: string,
  completedQuizKeys: string[] | null | undefined,
  entropySource: number = Date.now()
): { seed: number; changed: boolean } {
  if (!hasCompletedQuizOnce(quizKey, completedQuizKeys)) {
    const fixedSeed = hashQuizKey(quizKey);
    return { seed: fixedSeed, changed: false };
  }
  const jump = (Math.abs(Math.floor(entropySource)) % 7919) + 137;
  const candidate = previousSeed + jump;
  return {
    seed: candidate === previousSeed ? previousSeed + 193 : candidate,
    changed: true,
  };
}

export function addCompletedQuizKey(
  completedQuizKeys: string[] | null | undefined,
  quizKey: string
): string[] {
  const existing = Array.isArray(completedQuizKeys) ? completedQuizKeys : [];
  if (!quizKey || existing.includes(quizKey)) return existing;
  return [...existing, quizKey];
}
