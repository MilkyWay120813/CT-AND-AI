import { GanitaChapter, MathHomeworkSolution, ChapterId } from '../types/math';
import { GANITA_PART_1_CHAPTERS } from './ganitaChaptersPart1';
import { GANITA_PART_1_EXTRA_CHAPTERS } from './ganitaChaptersPart1Extra';
import { GANITA_PART_2_CHAPTERS } from './ganitaChaptersPart2';
import { GANITA_PART_2_EXTRA_CHAPTERS } from './ganitaChaptersPart2Extra';

const PART_2_ORDER: { id: ChapterId; titleOverride?: string }[] = [
  { id: 'ch4-fractions-disguise', titleOverride: 'Fractions in Disguise' },
  { id: 'ch5-baudhayana-pythagoras', titleOverride: 'The Baudhayana-Pythagoras Theorem' },
  { id: 'ch6-proportional-reasoning', titleOverride: 'Proportional Reasoning-2' },
  { id: 'ch11-geometric-themes', titleOverride: 'Exploring Some Geometric Themes' },
  { id: 'ch12-dots-and-lines', titleOverride: 'Tales by Dots and Lines' },
  { id: 'ch13-algebra-play', titleOverride: 'Algebra Play' },
  { id: 'ch14-area', titleOverride: 'Area' },
];

const rawPart2 = [...GANITA_PART_2_CHAPTERS, ...GANITA_PART_2_EXTRA_CHAPTERS];

const orderedPart2: GanitaChapter[] = PART_2_ORDER.map((entry, idx) => {
  const found = rawPart2.find((c) => c.id === entry.id) || rawPart2[idx];
  const chNum = idx + 1;
  return {
    ...found,
    chapterNumber: chNum,
    title: entry.titleOverride || found.title,
    subtitle: `Ganita Prakash Part II · Chapter ${chNum}`,
  };
});

export const GANITA_CHAPTERS: GanitaChapter[] = [
  ...GANITA_PART_1_CHAPTERS,
  ...GANITA_PART_1_EXTRA_CHAPTERS,
  ...orderedPart2,
];

export const PRESET_SOLUTIONS: MathHomeworkSolution[] = GANITA_CHAPTERS.flatMap((chapter) =>
  chapter.segments.flatMap((segment) => [
    segment.featuredSolution,
    ...segment.extraProblems,
  ])
);

export function getChapterById(chapterId: ChapterId): GanitaChapter {
  return GANITA_CHAPTERS.find((c) => c.id === chapterId) || GANITA_CHAPTERS[0];
}
