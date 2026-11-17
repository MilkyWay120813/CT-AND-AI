import { StudentAccountProfile } from '../types/account';

export const MAX_MASTERY_EXP = 4000;
export const MAX_CHAPTER_GAME_POINTS = 1000;

export interface StatsSnapshot {
  masteryPoints: number;
  unlockedBadgeIds: string[];
  chapterGamePoints: Record<string, number>;
}

export function buildResetStatsState(): StatsSnapshot {
  return {
    masteryPoints: 0,
    unlockedBadgeIds: [],
    chapterGamePoints: {},
  };
}

export function canUnlockStats(account: StudentAccountProfile | null | undefined): boolean {
  return Boolean(account && account.username && account.username.trim().length > 0);
}

export function clampMasteryExp(points: number): number {
  if (!Number.isFinite(points)) return 0;
  return Math.min(MAX_MASTERY_EXP, Math.max(0, Math.round(points)));
}

export function sanitizeChapterPointsMap(
  raw: Record<string, number> | null | undefined
): Record<string, number> {
  if (!raw || typeof raw !== 'object') return {};
  const result: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw)) {
    const val = Number(v);
    if (Number.isFinite(val)) {
      result[k] = Math.min(MAX_CHAPTER_GAME_POINTS, Math.max(0, Math.round(val)));
    }
  }
  return result;
}

export function hydrateStatsForSignedInAccount(
  account: StudentAccountProfile | null | undefined
): StatsSnapshot {
  if (!canUnlockStats(account) || !account) {
    return buildResetStatsState();
  }
  return {
    masteryPoints: clampMasteryExp(Number(account.points) || 0),
    unlockedBadgeIds: Array.isArray(account.unlockedBadgeIds)
      ? Array.from(new Set(account.unlockedBadgeIds))
      : [],
    chapterGamePoints: sanitizeChapterPointsMap(account.chapterGamePoints),
  };
}

export function applyBadgeUnlockIfSignedIn(
  account: StudentAccountProfile | null | undefined,
  current: StatsSnapshot,
  badgeId: string,
  rewardPoints: number
): { unlocked: boolean; next: StatsSnapshot } {
  if (!canUnlockStats(account)) {
    return { unlocked: false, next: current };
  }
  if (current.unlockedBadgeIds.includes(badgeId)) {
    return { unlocked: false, next: current };
  }
  const safeReward = Math.max(0, Number(rewardPoints) || 0);
  return {
    unlocked: true,
    next: {
      masteryPoints: clampMasteryExp(current.masteryPoints + safeReward),
      unlockedBadgeIds: [...current.unlockedBadgeIds, badgeId],
      chapterGamePoints: current.chapterGamePoints,
    },
  };
}

export function applyChapterPointsIfSignedIn(
  account: StudentAccountProfile | null | undefined,
  current: StatsSnapshot,
  chapterId: string,
  pts: number
): { added: boolean; next: StatsSnapshot } {
  if (!canUnlockStats(account)) {
    return { added: false, next: current };
  }
  const sanitizedPts = Math.min(15, Math.max(0, Number(pts) || 0));
  if (sanitizedPts <= 0) {
    return { added: false, next: current };
  }
  return {
    added: true,
    next: {
      masteryPoints: clampMasteryExp(current.masteryPoints + sanitizedPts),
      unlockedBadgeIds: current.unlockedBadgeIds,
      chapterGamePoints: {
        ...current.chapterGamePoints,
        [chapterId]: Math.min(
          MAX_CHAPTER_GAME_POINTS,
          (current.chapterGamePoints[chapterId] || 0) + sanitizedPts
        ),
      },
    },
  };
}
