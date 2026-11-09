export interface GraphParameter {
  symbol: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  description: string;
}

export interface GraphKeyPoint {
  x: number;
  y: number;
  label: string;
  kind: 'root' | 'vertex' | 'intercept' | 'intersection' | 'tangent';
}

export interface StepCheckQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

export interface SolutionStep {
  stepNumber: number;
  title: string;
  ruleUsed: string;
  mathBefore: string;
  mathAfter: string;
  explanation: string;
  funTip: string;
  checkQuestion?: StepCheckQuestion;
  graphHighlight?: GraphKeyPoint;
}

export interface FunAnalogy {
  title: string;
  story: string;
  punchline: string;
  realWorldVariableMap: {
    symbol: string;
    meaning: string;
  }[];
}

export interface GraphConfiguration {
  primaryExpression: string;
  primaryLabel: string;
  secondaryExpression?: string;
  secondaryLabel?: string;
  xDomain: [number, number];
  yDomain: [number, number];
  parameters: GraphParameter[];
  keyPoints: GraphKeyPoint[];
  showAreaUnderCurve?: boolean;
  areaBounds?: [number, number];
  showTangentAtX?: number;
}

export interface PracticeTwinChallenge {
  question: string;
  equation: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  funRewardMessage: string;
}

export interface MathHomeworkSolution {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  estimatedMinutes: number;
  originalProblem: string;
  finalAnswer: string;
  funAnalogy: FunAnalogy;
  steps: SolutionStep[];
  graphConfig: GraphConfiguration;
  practiceTwin: PracticeTwinChallenge;
}

export type ChapterId =
  | 'ch1-square-cube'
  | 'ch2-power-play'
  | 'ch3-story-numbers'
  | 'ch4-quadrilaterals'
  | 'ch5-number-play'
  | 'ch6-we-distribute'
  | 'ch7-proportional-1'
  | 'ch4-fractions-disguise'
  | 'ch5-baudhayana-pythagoras'
  | 'ch6-proportional-reasoning'
  | 'ch11-geometric-themes'
  | 'ch12-dots-and-lines'
  | 'ch13-algebra-play'
  | 'ch14-area';

export type DifficultyFocus = 'intuition' | 'steps' | 'word-problems';

export interface ChapterSegment {
  id: string;
  segmentCode: string;
  title: string;
  subtitle: string;
  commonStruggle: string;
  coreConcepts: string[];
  keyFormulas: { label: string; formula: string }[];
  featuredSolution: MathHomeworkSolution;
  extraProblems: MathHomeworkSolution[];
}

export interface GanitaChapter {
  id: ChapterId;
  partLabel: 'Part I' | 'Part II';
  chapterNumber: number;
  title: string;
  sanskritOrHistoricalHook: string;
  pdfUrl: string;
  summary: string;
  diagnosticSymptom: string;
  interactiveLabTitle: string;
  segments: ChapterSegment[];
}

export interface StudentDiagnosticProfile {
  chapterId: ChapterId;
  segmentId: string;
  difficultyFocus: DifficultyFocus;
  completedQuestionnaire: boolean;
}
