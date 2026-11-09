import { ChapterId } from './math';

export interface VideoScene {
  sceneNumber: number;
  timeRange: string;
  title: string;
  narration: string;
  boardFormula: string;
  visualCaption: string;
}

export interface ModuleVideoCue {
  title: string;
  duration: string; // e.g. "2:45" or "3:00"
  durationSeconds: number; // e.g. 165 or 180
  summary: string;
  readingParagraphs: string[];
  keyTakeaways: string[];
  workedExample: {
    problem: string;
    steps: string[];
    answer: string;
  };
  scenes: VideoScene[];
}

export interface ModuleSimulationConfig {
  title: string;
  isBigSimulation?: boolean;
  description: string;
  interactionType:
    | 'locker-grid'
    | 'unit-digit-machine'
    | 'odd-l-grid'
    | 'prime-factor-scale'
    | 'cube-3d-stacker'
    | 'taxicab-analyzer'
    | 'difference-table'
    | 'treasury-vault'
    | 'paper-folder'
    | 'prime-exp-converter'
    | 'power-line'
    | 'bracket-expander'
    | 'halving-scale'
    | 'decimal-shifter'
    | 'population-slider'
    | 'universe-zoom'
    | 'pebble-Stick-counter'
    | 'body-part-mapper'
    | 'subitizing-flasher'
    | 'roman-board'
    | 'base-n-converter'
    | 'babylonian-translator'
    | 'brahmi-timeline'
    | 'civilization-map'
    | 'carpenter-strips'
    | 'congruence-overlay'
    | 'square-angle-adjuster'
    | 'diagonal-splitter'
    | 'parallel-ruler'
    | 'compass-rhombus'
    | 'trapezium-folder'
    | 'quad-venn-tree'
    | 'parity-scale'
    | 'dot-grid-multiplier'
    | 'remainder-pot'
    | 'tail-digit-extractor'
    | 'digital-root-adder'
    | 'alternating-sign-balance'
    | 'cryptarithm-grid'
    | 'divisibility-matrix'
    | 'distributive-array'
    | 'binomial-tiles'
    | 'nested-square'
    | 'diff-squares-strip'
    | 'ista-gunana-adder'
    | 'error-debugger'
    | 'pattern-stepper'
    | 'algebra-workbench'
    | 'aspect-ratio-scaler'
    | 'hcf-reducer'
    | 'recipe-mixer'
    | 'trairasika-scale'
    | 'unit-converter'
    | 'ratio-sharer'
    | 'inverse-speed-curve'
    | 'market-proportionality-lab'
    | 'grand-capstone-sim';
  defaultControlA: number;
  defaultControlB: number;
  controlALabel: string;
  controlAMin: number;
  controlAMax: number;
  controlBLabel?: string;
  controlBMin?: number;
  controlBMax?: number;
  formulaHighlight: string;
}

export interface ModuleGameChallenge {
  prompt: string;
  clue: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleGameConfig {
  title: string;
  isBigGame?: boolean;
  subtitle: string;
  rules: string;
  challenges: ModuleGameChallenge[];
}

export interface ChapterAssessmentQuestion {
  id: string;
  questionNumber: number;
  type: 'mcq' | 'short-answer';
  prompt: string;
  options: string[];
  correctIndex: number;
  acceptedShortAnswers?: string[];
  explanation: string;
  moduleRef: string;
}

export interface Part1ModuleItem {
  id: string;
  moduleCode: string; // e.g. "Module 1.1"
  shortNumber: string; // e.g. "1.1"
  title: string;
  cardHeadline: string;
  cardTeaser: string;
  isWrapUpModule?: boolean;
  artworkTheme:
    | 'lockers'
    | 'digits'
    | 'odd-grid'
    | 'roots'
    | 'cubes'
    | 'taxicab'
    | 'diff-table'
    | 'vault'
    | 'paper-moon'
    | 'exponents'
    | 'power-laws'
    | 'brackets'
    | 'negative-exp'
    | 'cosmic'
    | 'population'
    | 'universe'
    | 'pebbles'
    | 'tally-bones'
    | 'subitize'
    | 'roman'
    | 'egyptian-base'
    | 'babylonian'
    | 'zero-india'
    | 'world-map'
    | 'carpenter'
    | 'congruence'
    | 'square-diag'
    | 'angle-sum'
    | 'parallelogram'
    | 'rhombus'
    | 'kite-trap'
    | 'quad-tree'
    | 'parity'
    | 'always-never'
    | 'remainders'
    | 'div-248'
    | 'div-39'
    | 'div-11'
    | 'cryptarithm'
    | 'div-matrix'
    | 'dist-grid'
    | 'binomial'
    | 'square-sum'
    | 'diff-squares'
    | 'mental-mult'
    | 'mend-mistake'
    | 'visual-pattern'
    | 'algebra-tiles'
    | 'photo-scale'
    | 'hcf-ratio'
    | 'coffee-mixer'
    | 'trairasika'
    | 'metric-units'
    | 'profit-share'
    | 'inverse-speed'
    | 'global-market'
    | 'master-boss';
  videoCue: ModuleVideoCue;
  simulation: ModuleSimulationConfig;
  game: ModuleGameConfig;
}

export interface Part1ChapterCurriculum {
  chapterId: ChapterId | 'ch8-master-quiz';
  chapterIndex: number; // 1 to 8
  chapterBadgeLabel: string; // e.g. "Ganita Prakash Part I · hegp101.pdf"
  title: string;
  heroRibbonText: string;
  heroSubtitle: string;
  pdfCode: string;
  pdfUrl: string;
  heroBgGradient: string;
  accentColor: string;
  challengeBannerTitle: string;
  challengeBannerSubtitle: string;
  modules: Part1ModuleItem[];
  questionnaire: ChapterAssessmentQuestion[];
}
