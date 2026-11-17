import {
  ModuleFunInterpretation,
  PART1_MODULE_INTERPRETATIONS,
} from '../data/moduleInterpretationsPart1';
import { PART2_MODULE_INTERPRETATIONS } from '../data/moduleInterpretationsPart2';

export type { ModuleFunInterpretation };

const ALL_MODULE_INTERPRETATIONS: Record<string, ModuleFunInterpretation> = {
  ...PART1_MODULE_INTERPRETATIONS,
  ...PART2_MODULE_INTERPRETATIONS,
};

/**
 * Resolves a 100% unique, topic-accurate interactive interpretation for every module.
 * Uses exact `moduleId` lookup first (covering all 112 modules across all 14 chapters),
 * and falls back safely by explicit `chapterId` / title keywords rather than ambiguous moduleCode prefixes.
 */
export function getModuleFunInterpretation(
  moduleCode: string,
  moduleTitle: string,
  formulaHighlight: string = '',
  chapterTitle: string = '',
  moduleId: string = '',
  chapterId: string = ''
): ModuleFunInterpretation {
  const cleanId = (moduleId || '').trim();
  if (cleanId && ALL_MODULE_INTERPRETATIONS[cleanId]) {
    return ALL_MODULE_INTERPRETATIONS[cleanId];
  }

  const chId = (chapterId || '').toLowerCase();
  const chTitle = (chapterTitle || '').toLowerCase();
  const title = (moduleTitle || '').toLowerCase();

  // Explicit chapterId fallback routing (never mixes Part II Ch 3 Proportions with Part I Ch 3 Exponents!)
  if (chId === 'ch6-proportional-reasoning' || chTitle.includes('proportional')) {
    return ALL_MODULE_INTERPRETATIONS['p2-mod-3-1'];
  }
  if (chId === 'ch2-power-play' || title.includes('exponent') || title.includes('scientific notation')) {
    return ALL_MODULE_INTERPRETATIONS['mod-2-1'];
  }
  if (chId === 'ch3-story-numbers') {
    return ALL_MODULE_INTERPRETATIONS['mod-3-7'];
  }
  if (chId === 'ch1-square-cube') {
    return ALL_MODULE_INTERPRETATIONS['mod-1-1'];
  }
  if (chId === 'ch4-quadrilaterals') {
    return ALL_MODULE_INTERPRETATIONS['mod-4-4'];
  }
  if (chId === 'ch5-number-play') {
    return ALL_MODULE_INTERPRETATIONS['mod-5-5'];
  }
  if (chId === 'ch6-we-distribute') {
    return ALL_MODULE_INTERPRETATIONS['mod-6-3'];
  }
  if (chId === 'ch7-proportional-1') {
    return ALL_MODULE_INTERPRETATIONS['mod-7-4'];
  }
  if (chId === 'ch4-fractions-disguise') {
    return ALL_MODULE_INTERPRETATIONS['p2-mod-1-1'];
  }
  if (chId === 'ch5-baudhayana-pythagoras') {
    return ALL_MODULE_INTERPRETATIONS['p2-mod-2-5'];
  }
  if (chId === 'ch11-geometric-themes') {
    return ALL_MODULE_INTERPRETATIONS['p2-mod-4-2'];
  }
  if (chId === 'ch12-dots-and-lines') {
    return ALL_MODULE_INTERPRETATIONS['p2-mod-5-1'];
  }
  if (chId === 'ch13-algebra-play') {
    return ALL_MODULE_INTERPRETATIONS['p2-ch6-m1'];
  }
  if (chId === 'ch14-area') {
    return ALL_MODULE_INTERPRETATIONS['p2-mod-7-6'];
  }

  return {
    headline: `${moduleCode ? `${moduleCode}: ` : ''}The Secret Behind ${moduleTitle}`,
    analogyStory:
      `Mathematics in ${moduleTitle} uncovers the hidden structure connecting patterns, shapes, and numbers so calculations become visual and predictable.`,
    intuitiveSecret: formulaHighlight
      ? `The key relationship "${formulaHighlight}" keeps both sides balanced whenever quantities scale or rearrange.`
      : 'Every rule here grows out of simple visual symmetry rather than rote memorization.',
    partyTrickOrProTip:
      'Plug in simple boundary values like 0, 1, or 10 first to test any mathematical rule in seconds.',
    funEmoji: '💡',
    quoteTag: 'Math is about discovering why patterns hold true everywhere.',
  };
}

export function getAllCatalogedModuleIds(): string[] {
  return Object.keys(ALL_MODULE_INTERPRETATIONS);
}
