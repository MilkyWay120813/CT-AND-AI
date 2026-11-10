import { PART1_CURRICULUM_CHAPTERS, PART2_CURRICULUM_CHAPTERS } from './part1CurriculumData';

export interface MasteryBadgeDefinition {
  id: string;
  badgeNumber: number; // 1 to 115
  title: string;
  subtitle: string;
  category: 'part1-module' | 'part2-module' | 'mastery-quiz' | 'cellar-boss';
  chapterId: string;
  chapterTitle: string;
  moduleCode?: string;
  pointsReward: number;
  accentColor: string;
  emblemGlyph: string;
}

export interface MasteryMilestoneRank {
  id: string;
  title: string;
  minPoints: number;
  description: string;
  accentHex: string;
  glyph: string;
}

export const MASTERY_POINT_MILESTONES: MasteryMilestoneRank[] = [
  {
    id: 'milestone-scribe',
    title: 'Chalkboard Initiate',
    minPoints: 100,
    description: 'Began the Ganita Prakash Class 8 journey at the classroom board.',
    accentHex: '#14B8A6',
    glyph: '✏️',
  },
  {
    id: 'milestone-number-sage',
    title: 'Number Theory Detective',
    minPoints: 350,
    description: 'Cracked square lockers, prime triplets, and modular remainders.',
    accentHex: '#38BDF8',
    glyph: '🔍',
  },
  {
    id: 'milestone-algebra-ace',
    title: 'Algebra Ace',
    minPoints: 700,
    description: 'Mastered distributive identities, number pyramids, and balanced equations.',
    accentHex: '#F59E0B',
    glyph: '⚡',
  },
  {
    id: 'milestone-quadratic-wizard',
    title: 'Quadratic Wizard',
    minPoints: 1200,
    description: 'Commanded square dissections, (a + b)² expansions, and difference of squares.',
    accentHex: '#A855F7',
    glyph: '🧙‍♂️',
  },
  {
    id: 'milestone-baudhayana-architect',
    title: 'Baudhāyana Geometrician',
    minPoints: 1800,
    description: 'Proved right-triangle rope theorems, quadrilateral diagonals, and polygon areas.',
    accentHex: '#FB923C',
    glyph: '📐',
  },
  {
    id: 'milestone-brahmagupta-scholar',
    title: 'Brahmagupta Scholar',
    minPoints: 2600,
    description: 'Synthesized proportions, ancient bases, fractals, and statistical fulcrums.',
    accentHex: '#EC4899',
    glyph: '📜',
  },
  {
    id: 'milestone-ganita-sovereign',
    title: 'Supreme Ganita Sovereign',
    minPoints: 3600,
    description: 'Achieved grand mastery across Part I, Part II, and the Underground Cellar.',
    accentHex: '#FACC15',
    glyph: '👑',
  },
];

const FLAVOR_TITLES: string[] = [
  'Square Locker Sentinel',
  'Factor Pair Voyager',
  'Odd Gnomon Sculptor',
  'Prime Root Alchemist',
  'Cube Lattice Builder',
  'Taxicab 1729 Keeper',
  'Root Splitter Pro',
  'Square & Cube Warden',
  'Paper-to-Moon Folder',
  'Exponent Law Weaver',
  'Power Quotient Guardian',
  'Bracket Power Forger',
  'Reciprocal Zero Sage',
  'Cosmic Notation Pilot',
  'Scale Jumper Ace',
  'Power Play Champion',
  'Pebble Tally Pioneer',
  'Body-Count Navigator',
  'Roman Abacus Master',
  'Lotus Scroll Scribe',
  'Base-Five Architect',
  'Babylonian 60 Scholar',
  'Śūnya Zero Visionary',
  'Number Story Chronicler',
  'Carpenter Strip Prover',
  'Rectangle Diagonal Ace',
  'Compass Square Crafter',
  '360-Degree Corner Sage',
  'Parallelogram Harmonizer',
  'Rhombus Diamond Knight',
  'Kite & Trapezium Pilot',
  'Quadrilateral Magistrate',
  'Parity Invariant Sleuth',
  'Tile Grid Strategist',
  'Remainder LCM Tracker',
  'Last-Digit Divisibility Ace',
  'Digital Root Nine Wizard',
  'Alternating Eleven Oracle',
  'Cryptarithm Vault Breaker',
  'Number Play Grand Sleuth',
  'Distributive Area Slicer',
  'FOIL Rectangle Builder',
  'Quadratic Wizard',
  'Difference-of-Squares Ace',
  'Mental Squaring Virtuoso',
  'Bracket Bug Terminator',
  'Step-k Pattern Architect',
  'Algebraic Identity Master',
  'Pixel Aspect Guardian',
  'HCF Ratio Simplifier',
  'Filter Coffee Alchemist',
  'Trairāśika Rule Master',
  'Unit Conversion Navigator',
  'Profit-Share Balancer',
  'Inverse Speed Tactician',
  'Proportionality Part I Ace',
  'Hundred-Grid Strategist',
  'FDP Triangle Translator',
  'Mental Percent Splitter',
  'Growth Ratio Analyzer',
  'Reverse Base Detective',
  'Retail Discount Tactician',
  'GST & Kautilya Auditor',
  'Compound Snowball Master',
  'Dvikaraṇī Cord Builder',
  'Area-Square Synthesizer',
  'Hypotenuse Proof Master',
  'Right-Triangle Inspector',
  'Bhāskara Lotus Solver',
  'Theodorus Spiral Artist',
  'Baudhāyana Triple Forger',
  'Pythagorean Grand Scholar',
  'Pie-Sector 360 Navigator',
  'Weighted Blend Chemist',
  'Cartography Scale Master',
  'Multi-Ratio Chain Linker',
  'Inverse Hyperbola Pilot',
  'Pump & Time Synchronizer',
  'Harmonic Gear Engineer',
  'Proportionality Part II Ace',
  'Sierpinski Gasket Weaver',
  'Menger Carpet Architect',
  'Koch Snowflake Sculptor',
  'Euler Polyhedron Sage',
  'Cuboid Net Pathfinder',
  'Shortest-Path Ant Guide',
  'Voxel Shadow Engineer',
  'Geometric Themes Master',
  'Mean Fulcrum Balancer',
  'Median Outlier Shield',
  'Spreadsheet Formula Ace',
  'Quartile Boxplot Ranger',
  'Histogram Bin Strategist',
  'Monsoon Trend Forecaster',
  'Two-Line Crossing Sleuth',
  'Data & Lines Chronicler',
  'Mystery Box x Canceler',
  'Shubham Birthday Decoder',
  'Meru Pyramid Strategist',
  'Reverse Brick Detective',
  'Banyan Genie Outsmarter',
  'Calendar 9c Mind-Reader',
  'Algebra Ace',
  'Algebra Play Grandmaster',
  'Grid-Cut Dissection Pro',
  'Obtuse Altitude Sculptor',
  'Parallel River Strategist',
  'Parallelogram Shear Ace',
  'Rhombus Diagonal Slicer',
  'Trapezium Twin Builder',
  'Surveyor Offset Master',
  'Area & Mensuration Sovereign',
];

const EMBLEM_GLYPHS = [
  '🏛️', '⚡', '📐', '🔮', '🛡️', '🧭', '💎', '🌟',
  '📜', '🔑', '🧬', '🏆', '🪐', '⚖️', '🧮', '👑',
];

const ACCENT_COLORS = [
  '#14B8A6', '#F59E0B', '#38BDF8', '#A855F7',
  '#FB923C', '#EC4899', '#10B981', '#FACC15',
];

export function getModuleBadgeId(chapterId: string, moduleCode: string): string {
  return `badge-mod-${chapterId}-${moduleCode.replace(/\s+/g, '-').toLowerCase()}`;
}

export function getQuizBadgeId(chapterId: string): string {
  if (chapterId === 'ch8-master-quiz') return 'badge-quiz-part1';
  if (chapterId === 'part2-ch8-master-quiz') return 'badge-quiz-part2';
  return `badge-quiz-${chapterId}`;
}

export const BOSS_BADGE_ID = 'badge-boss-cellar';

export const ALL_MASTERY_BADGES: MasteryBadgeDefinition[] = (() => {
  const list: MasteryBadgeDefinition[] = [];
  let counter = 1;

  // 1–56: Part I Modules (Chapters 1–7, 8 modules each = 56)
  const part1Regular = PART1_CURRICULUM_CHAPTERS.filter(
    (c) => c.chapterId !== 'ch8-master-quiz'
  );
  for (const ch of part1Regular) {
    for (const mod of ch.modules) {
      const idx = counter - 1;
      const flavor = FLAVOR_TITLES[idx] || `${ch.title} ${mod.moduleCode} Ace`;
      list.push({
        id: getModuleBadgeId(ch.chapterId, mod.moduleCode),
        badgeNumber: counter++,
        title: flavor,
        subtitle: `Part I · Ch ${ch.chapterIndex} (${mod.moduleCode}): ${mod.title}`,
        category: 'part1-module',
        chapterId: ch.chapterId,
        chapterTitle: `Part I Ch ${ch.chapterIndex}: ${ch.title}`,
        moduleCode: mod.moduleCode,
        pointsReward: 30,
        accentColor: ACCENT_COLORS[idx % ACCENT_COLORS.length],
        emblemGlyph: EMBLEM_GLYPHS[idx % EMBLEM_GLYPHS.length],
      });
    }
  }

  // 57–112: Part II Modules (Chapters 1–7, 8 modules each = 56)
  const part2Regular = PART2_CURRICULUM_CHAPTERS.filter(
    (c) => c.chapterId !== 'part2-ch8-master-quiz'
  );
  for (const ch of part2Regular) {
    for (const mod of ch.modules) {
      const idx = counter - 1;
      const flavor = FLAVOR_TITLES[idx] || `${ch.title} ${mod.moduleCode} Ace`;
      list.push({
        id: getModuleBadgeId(ch.chapterId, mod.moduleCode),
        badgeNumber: counter++,
        title: flavor,
        subtitle: `Part II · Ch ${ch.chapterIndex} (${mod.moduleCode}): ${mod.title}`,
        category: 'part2-module',
        chapterId: ch.chapterId,
        chapterTitle: `Part II Ch ${ch.chapterIndex}: ${ch.title}`,
        moduleCode: mod.moduleCode,
        pointsReward: 30,
        accentColor: ACCENT_COLORS[idx % ACCENT_COLORS.length],
        emblemGlyph: EMBLEM_GLYPHS[idx % EMBLEM_GLYPHS.length],
      });
    }
  }

  // Badge #113: Part I 30-Question Grand Mastery Quiz
  list.push({
    id: 'badge-quiz-part1',
    badgeNumber: 113,
    title: 'Part I Grand Quiz Sovereign',
    subtitle: 'Completed the 30-Question Part I Mastery Quiz (Chapters 1–7 Synthesis)',
    category: 'mastery-quiz',
    chapterId: 'ch8-master-quiz',
    chapterTitle: 'Part I Mastery Quiz (30 Questions)',
    pointsReward: 150,
    accentColor: '#F59E0B',
    emblemGlyph: '🏆',
  });

  // Badge #114: Part II 30-Question Grand Mastery Quiz
  list.push({
    id: 'badge-quiz-part2',
    badgeNumber: 114,
    title: 'Part II Grand Quiz Sovereign',
    subtitle: 'Completed the 30-Question Part II Mastery Quiz (Chapters 1–7 Synthesis)',
    category: 'mastery-quiz',
    chapterId: 'part2-ch8-master-quiz',
    chapterTitle: 'Part II Mastery Quiz (30 Questions)',
    pointsReward: 150,
    accentColor: '#38BDF8',
    emblemGlyph: '🎖️',
  });

  // Badge #115: Final 3D Cellar Boss Battle Badge
  list.push({
    id: BOSS_BADGE_ID,
    badgeNumber: 115,
    title: 'Supreme Cellar Overlord',
    subtitle: 'Unlocked the 114-Badge Cellar Key & Defeated the 3D Arch-Librarian Boss (30 Questions)',
    category: 'cellar-boss',
    chapterId: 'cellar-boss',
    chapterTitle: '3D Underground Cellar Final Boss',
    pointsReward: 500,
    accentColor: '#FACC15',
    emblemGlyph: '👑',
  });

  return list;
})();

export const PREREQUISITE_BADGE_IDS: string[] = ALL_MASTERY_BADGES.filter(
  (b) => b.id !== BOSS_BADGE_ID
).map((b) => b.id);
