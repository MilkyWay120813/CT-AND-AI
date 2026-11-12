export interface StudentAccountProfile {
  username: string;
  mascot: string; // e.g. '🦉', '🐯', '🚀', '🧙‍♂️', '🦁', '🦊', '🐬', '🦅'
  grade?: string; // e.g. 'Class 8'
  createdAt: string;
  lastLoginAt: string;
  points: number;
  unlockedBadgeIds: string[];
  chapterGamePoints: Record<string, number>; // Points earned in creative games per chapter
}

export interface RegisterPayload {
  username: string;
  mascot: string;
  pin: string;
  grade?: string;
  initialPoints?: number;
  initialBadgeIds?: string[];
  initialChapterPoints?: Record<string, number>;
}

export interface LoginPayload {
  username: string;
  pin: string;
}

export const STUDENT_MASCOTS = [
  { emoji: '🦉', label: 'Owl Scholar', desc: 'Wise & observant' },
  { emoji: '🐯', label: 'Bengal Tiger', desc: 'Fierce tactician' },
  { emoji: '🚀', label: 'Cosmic Voyager', desc: 'Reaches the stars' },
  { emoji: '🧙‍♂️', label: 'Math Alchemist', desc: 'Transforms numbers' },
  { emoji: '🦁', label: 'Royal Lion', desc: 'Brave & determined' },
  { emoji: '🦊', label: 'Clever Fox', desc: 'Pattern detector' },
  { emoji: '🐬', label: 'Deep Thinker', desc: 'Fluid & analytical' },
  { emoji: '🦅', label: 'Sky Sovereign', desc: 'Broad vision' },
] as const;
