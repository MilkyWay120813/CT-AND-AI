import { ChapterAssessmentQuestion } from '../types/part1Curriculum';
import { ChapterId } from '../types/math';
import {
  generateMultiChapterTrickyQuiz,
  TrickyTextbookQuestion,
} from './dynamicQuizGenerator';
import { QuizDifficultyLevel } from './quizDifficulty';

export type TrickyFormatType = 'mcq' | 'subjective' | 'long-answer' | 'case-study';
export type TrickyMcqSubKind = 'normal' | 'assertion-reason';

export const ALL_TRICKY_FORMATS: TrickyFormatType[] = [
  'mcq',
  'subjective',
  'long-answer',
  'case-study',
];

export interface CaseStudySubQuestion {
  subLabel: 'a' | 'b' | 'c' | 'd';
  subType: 'mcq' | 'subjective';
  prompt: string;
  options: string[];
  correctIndex: number;
  acceptedAnswers: string[];
  explanation: string;
}

export interface FormattedTrickyQuestion extends TrickyTextbookQuestion {
  formatType: TrickyFormatType;
  mcqSubKind?: TrickyMcqSubKind;
  assertion?: string;
  reason?: string;
  acceptedAnswers: string[];
  keySteps?: string[];
  scenarioTitle?: string;
  scenarioText?: string;
  subQuestions?: CaseStudySubQuestion[];
  markCount: number;
}

export interface GenerateFormattedTrickyParams {
  selectedChapterIds: ChapterId[];
  seed: number;
  staticByChapter?: Partial<Record<ChapterId, ChapterAssessmentQuestion[]>>;
  difficulty: QuizDifficultyLevel;
  enabledFormats: TrickyFormatType[];
  totalTarget?: number;
}

function seededRng(seed: number): () => number {
  let s = Math.abs(Math.floor(seed)) % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function ri(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pk<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function shuffleArr<T>(items: T[], rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const AR_STANDARD_OPTIONS = [
  'Both Assertion (A) and Reason (R) are true, and Reason (R) is the correct explanation of Assertion (A).',
  'Both Assertion (A) and Reason (R) are true, but Reason (R) is NOT the correct explanation of Assertion (A).',
  'Assertion (A) is true, but Reason (R) is false.',
  'Assertion (A) is false, but Reason (R) is true.',
];

// ============================================================================
// LENIENT CHECKERS FOR SUBJECTIVE & LONG ANSWER
// ============================================================================

function normalizeMathToken(raw: string): string {
  let s = String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/[−–—]/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/rs\.?/gi, '')
    .replace(/₹/g, '')
    .replace(/,/g, '')
    // strip common variable assignment prefix like "x =" or "ans:"
    .replace(/^(?:x|y|n|k|a|b|c|p|q|r|ans(?:wer)?)\s*[:=]\s*/i, '')
    // strip unit words and Unicode/superscript area/volume/degree/percent units cleanly
    .replace(/(?:sq\.?\s*)?(?:cm|m)(?:\^?[23]|[²³])(?=$|[\s.,;!?/])/gi, '')
    .replace(
      /\b(cm|km\/h|m\/s|km|meters?|metres?|m|liters?|litres?|l|kg|grams?|g|days?|hours?|hrs?|hr|min(?:utes?)?|sec(?:onds?)?|degrees?|deg|hectares?|ha|tiles?|lockers?|locks?|ways?|times?|units?|students?|boxes?|pens?|rupees?|parts?|loops?|steps?)\b/gi,
      ''
    )
    .replace(/[°%]/g, '')
    .replace(/\s+/g, '');

  // Handle simple trailing punctuation
  s = s.replace(/[.!?]+$/, '');
  return s;
}

function tryParseFractionOrNumber(s: string): number | null {
  const frac = s.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (frac) {
    const num = Number(frac[1]);
    const den = Number(frac[2]);
    if (Number.isFinite(num) && Number.isFinite(den) && den !== 0) {
      return num / den;
    }
  }
  const plain = s.match(/^(-?\d+(?:\.\d+)?)$/);
  if (plain) {
    const v = Number(plain[1]);
    return Number.isFinite(v) ? v : null;
  }
  return null;
}

export function checkSubjectiveAnswerLenient(input: string, accepted: string[]): boolean {
  const trimmed = String(input || '').trim();
  if (!trimmed) return false;

  const cleanIn = normalizeMathToken(trimmed);
  if (!cleanIn) return false;

  const inNum = tryParseFractionOrNumber(cleanIn);

  for (const ans of accepted) {
    const cleanExp = normalizeMathToken(ans);
    if (!cleanExp) continue;

    if (cleanIn === cleanExp) return true;
    if (trimmed.toLowerCase() === ans.trim().toLowerCase()) return true;

    // Also compare pure alphanumeric forms for algebraic strings like "2x+5" vs "5+2x" tokens or "-12x"
    const stripParensIn = cleanIn.replace(/[()]/g, '');
    const stripParensExp = cleanExp.replace(/[()]/g, '');
    if (stripParensIn && stripParensIn === stripParensExp) return true;

    // Numeric & fraction tolerance (±0.05)
    const expNum = tryParseFractionOrNumber(cleanExp);
    if (inNum !== null && expNum !== null && Math.abs(inNum - expNum) <= 0.05) {
      return true;
    }

    // Ratio equivalence like "2:3" vs "2/3"
    if (cleanExp.includes(':') && cleanIn.includes(':')) {
      const [a1, b1] = cleanIn.split(':').map(Number);
      const [a2, b2] = cleanExp.split(':').map(Number);
      if (
        Number.isFinite(a1) &&
        Number.isFinite(b1) &&
        Number.isFinite(a2) &&
        Number.isFinite(b2) &&
        b1 !== 0 &&
        b2 !== 0 &&
        Math.abs(a1 / b1 - a2 / b2) <= 0.005
      ) {
        return true;
      }
    }
  }

  return false;
}

export function checkLongAnswerLenientLocal(
  typedText: string,
  expectedAnswer: string,
  explanation: string,
  keySteps: string[] = []
): { isCorrect: boolean; creditScore: number; feedback: string } {
  const clean = String(typedText || '').trim();
  if (!clean) {
    return {
      isCorrect: false,
      creditScore: 0,
      feedback: 'Please enter your step-by-step working or upload/scan a photo of your solution.',
    };
  }

  // Check last line / final answer token directly first
  const lines = clean
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const lastLine = lines[lines.length - 1] || clean;
  const directFinalHit =
    checkSubjectiveAnswerLenient(clean, [expectedAnswer]) ||
    checkSubjectiveAnswerLenient(lastLine, [expectedAnswer]);

  const expNumbers = Array.from(
    new Set(
      `${expectedAnswer} ${explanation} ${keySteps.join(' ')}`
        .replace(/,/g, '')
        .match(/-?\d+(?:\.\d+)?/g) || []
    )
  ).filter((n) => n.length >= 1);

  const studentFlat = clean.replace(/,/g, '').replace(/[−–—]/g, '-');
  const expectedFinalNums = (expectedAnswer.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/g) || []);
  const hasFinalNumberInText =
    expectedFinalNums.length > 0 &&
    expectedFinalNums.every((n) => studentFlat.includes(n));

  const matchedKeyNums = expNumbers.filter((n) => studentFlat.includes(n)).length;

  if (directFinalHit || (hasFinalNumberInText && clean.length >= 8)) {
    const score = lines.length >= 2 || clean.length >= 24 ? 10 : 8;
    return {
      isCorrect: true,
      creditScore: score,
      feedback:
        score === 10
          ? 'Full credit (10/10)! Clear mathematical reasoning and accurate final answer.'
          : 'Great job (8/10)! Your answer is correct; showing one more intermediate step makes it exam-ready.',
    };
  }

  if (matchedKeyNums >= 2 && clean.length >= 16) {
    return {
      isCorrect: true,
      creditScore: 7,
      feedback:
        'Lenient partial credit awarded (7/10): Your solution uses key intermediate values/steps from the valid method. Double-check the final arithmetic.',
    };
  }

  if (matchedKeyNums >= 1 && clean.length >= 30) {
    return {
      isCorrect: true,
      creditScore: 6,
      feedback:
        'Lenient method credit awarded (6/10): Good mathematical setup detected. Review the reference steps below for precision.',
    };
  }

  return {
    isCorrect: false,
    creditScore: 4,
    feedback:
      'Method incomplete: try showing your formula/equation setup and final simplified value (or upload/scan a clearer photo).',
  };
}

// ============================================================================
// ASSERTION-REASON GENERATOR (ALL 14 CHAPTERS × D=1..4)
// ============================================================================

function buildAssertionReasonForChapter(
  chId: ChapterId,
  rng: () => number,
  d: QuizDifficultyLevel,
  idx: number
): FormattedTrickyQuestion {
  const a = ri(rng, d === 1 ? 3 : 5, d === 4 ? 19 : 12);
  const b = ri(rng, 2, 9);
  const k = ri(rng, 2, 7);

  interface ARSpec {
    moduleRef: string;
    assertion: string;
    reason: string;
    correctArIndex: 0 | 1 | 2 | 3;
    explanation: string;
  }

  let specs: ARSpec[] = [];

  switch (chId) {
    case 'ch1-square-cube': {
      const nSq = d === 1 ? ri(rng, 5, 12) : d === 4 ? ri(rng, 18, 45) : ri(rng, 11, 24);
      const endDig = pk(rng, [2, 3, 7, 8]);
      specs = [
        {
          moduleRef: 'Module 1.3',
          assertion: `The sum 1 + 3 + 5 + … + ${2 * nSq - 1} equals ${nSq * nSq}.`,
          reason: `The sum of the first n consecutive odd natural numbers starting from 1 is always n².`,
          correctArIndex: 0,
          explanation: `Both A and R are true, and R directly explains why ${nSq} odd terms sum to ${nSq}² = ${nSq * nSq}.`,
        },
        {
          moduleRef: 'Module 1.2',
          assertion: `The integer ${nSq * 10 + endDig} cannot be a perfect square.`,
          reason: `Every perfect square ends in 0, 1, 4, 5, 6, or 9 (never ${endDig}).`,
          correctArIndex: 0,
          explanation: `No integer squared ends in 2, 3, 7, or 8, so R cleanly proves A.`,
        },
        {
          moduleRef: 'Module 1.6',
          assertion: `Finding the cube root of a 6-digit perfect cube can be simplified by splitting digits into groups of 3 from the right.`,
          reason: `Every prime exponent in a perfect cube is a multiple of 2.`,
          correctArIndex: 2,
          explanation: `A is true (3-digit grouping works for cubes since 10³ = 1000), while R is FALSE — prime exponents in a cube are multiples of 3, not 2.`,
        },
        {
          moduleRef: 'Module 1.7',
          assertion: `1729 is the smallest positive integer expressible as the sum of two positive cubes in two different ways.`,
          reason: `Every perfect cube is always divisible by 3.`,
          correctArIndex: 2,
          explanation: `A is true (1729 = 1³+12³ = 9³+10³), whereas R is false (e.g., 2³ = 8 is not divisible by 3).`,
        },
      ];
      break;
    }
    case 'ch2-power-play':
      specs = [
        {
          moduleRef: 'Module 2.3',
          assertion: `For any non-zero integer a, (${a})⁰ + (${b})⁰ equals 2.`,
          reason: `Any non-zero base raised to exponent 0 equals 1 (because aⁿ ÷ aⁿ = aⁿ⁻ⁿ = a⁰ = 1).`,
          correctArIndex: 0,
          explanation: `Both are true and R explains A: 1 + 1 = 2.`,
        },
        {
          moduleRef: 'Module 2.4',
          assertion: `Multiplying ${a}⁵ × ${a}⁻² yields ${a}³.`,
          reason: `When multiplying powers with the SAME base, exponents are subtracted: aᵐ × aⁿ = aᵐ⁻ⁿ.`,
          correctArIndex: 2,
          explanation: `A is true (5 + (−2) = 3), while R states the wrong rule (exponents are ADDED, not subtracted).`,
        },
        {
          moduleRef: 'Module 2.6',
          assertion: `The standard scientific form of ${(k * 100000).toLocaleString()} is ${k} × 10⁵.`,
          reason: `Scientific notation writes a number as m × 10ⁿ where 1 ≤ m < 10 and n is an integer.`,
          correctArIndex: 0,
          explanation: `Both A and R are true, and R defines why ${k} × 10⁵ is valid.`,
        },
      ];
      break;
    case 'ch3-story-numbers':
      specs = [
        {
          moduleRef: 'Module 3.7',
          assertion: `Inserting a 0 inside ${a}${b} to get ${a}0${b} increases the number's value significantly.`,
          reason: `In a positional Base-10 system, zero acts as a placeholder that shifts preceding digits left to higher powers of 10.`,
          correctArIndex: 0,
          explanation: `Both A and R are true, and R directly explains place-value expansion.`,
        },
        {
          moduleRef: 'Module 3.4',
          assertion: `Multiplying large integers directly in Roman numerals (like XLVII × CXIV) is inconvenient compared to Hindu-Arabic numerals.`,
          reason: `Roman numerals are non-positional and lack a zero placeholder.`,
          correctArIndex: 0,
          explanation: `Both are true and R explains why column multiplication fails in Roman notation.`,
        },
        {
          moduleRef: 'Module 3.6',
          assertion: `Base-60 (Mesopotamian sexagesimal) cleanly represents halves, thirds, quarters, fifths, and sixths without repeating decimals.`,
          reason: `60 is a prime number with no factors other than 1 and 60.`,
          correctArIndex: 2,
          explanation: `A is true, while R is false — 60 is highly composite (divisible by 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60).`,
        },
      ];
      break;
    case 'ch4-quadrilaterals':
      specs = [
        {
          moduleRef: 'Module 4.6',
          assertion: `Every square is always a rhombus, and its diagonals meet at 90°.`,
          reason: `A rhombus is a parallelogram with all 4 sides equal, whose diagonals perpendicularly bisect each other.`,
          correctArIndex: 0,
          explanation: `Both A and R are true, and R explains A.`,
        },
        {
          moduleRef: 'Module 4.2',
          assertion: `The diagonals of a general parallelogram MUST always be equal in length.`,
          reason: `The diagonals of a parallelogram always bisect each other.`,
          correctArIndex: 3,
          explanation: `A is false (a non-rectangular slanted parallelogram has unequal diagonals), while R is true.`,
        },
        {
          moduleRef: 'Module 4.4',
          assertion: `The sum of the 4 exterior angles (one per vertex) of any convex quadrilateral is 360°.`,
          reason: `The sum of the 4 interior angles of any quadrilateral is also 360°.`,
          correctArIndex: 1,
          explanation: `Both A and R are true facts! However, interior sum = 360° is specific to 4 sides, whereas exterior sum = 360° holds for ANY convex n-gon.`,
        },
      ];
      break;
    case 'ch5-number-play':
      specs = [
        {
          moduleRef: 'Module 5.5',
          assertion: `A 4-digit number ${a}21${(9 - ((a + 3) % 9)) % 9} is divisible by 9.`,
          reason: `An integer is divisible by 9 if and only if the sum of its digits is divisible by 9.`,
          correctArIndex: 0,
          explanation: `The sum of digits is a multiple of 9, and R explains the modulo-9 congruence.`,
        },
        {
          moduleRef: 'Module 5.6',
          assertion: `Any 4-digit palindrome ABBA (e.g., ${a}${b}${b}${a}) is always divisible by 11.`,
          reason: `The alternating digit sum (A − B + B − A) equals 0, which is divisible by 11.`,
          correctArIndex: 0,
          explanation: `Both A and R are true, and R proves why ABBA = 1001A + 110B is divisible by 11.`,
        },
        {
          moduleRef: 'Module 5.1',
          assertion: `No power of 2 (such as 8, 16, or 32) can be written as a sum of two or more consecutive positive integers.`,
          reason: `Every odd number greater than 1 can be expressed as the sum of two consecutive integers.`,
          correctArIndex: 1,
          explanation: `Both statements are true, though R (2k+1 = k + (k+1)) alone doesn't prove the full power-of-2 impossibility.`,
        },
      ];
      break;
    case 'ch6-we-distribute':
      specs = [
        {
          moduleRef: 'Module 6.4',
          assertion: `${a + 100} × ${100 - a} equals ${10000 - a * a} without vertical multiplication.`,
          reason: `By the identity (x + y)(x − y) = x² − y², the product simplifies cleanly.`,
          correctArIndex: 0,
          explanation: `Both A and R are true, and R directly explains the computation.`,
        },
        {
          moduleRef: 'Module 6.3',
          assertion: `For any real numbers x and y, (x + y)² is identically equal to x² + y².`,
          reason: `The correct expansion of (x + y)² is x² + 2xy + y².`,
          correctArIndex: 3,
          explanation: `A is false (missing the middle term 2xy unless xy = 0), while R is true.`,
        },
      ];
      break;
    case 'ch7-proportional-1':
      specs = [
        {
          moduleRef: 'Module 7.1',
          assertion: `Enlarging all sides of a photograph by factor ${b}× multiplies its total AREA by ${b * b}×.`,
          reason: `Area scales as the square of the linear scale factor (k²).`,
          correctArIndex: 0,
          explanation: `Both A and R are true and R explains A.`,
        },
        {
          moduleRef: 'Module 7.7',
          assertion: `If 10 pumps empty a tank in 6 hours, 20 identical pumps empty it in 12 hours.`,
          reason: `More pumps working together finish the same fixed job in LESS time (inverse proportion).`,
          correctArIndex: 3,
          explanation: `A is false (it takes 3 hours, not 12), while R is true.`,
        },
      ];
      break;
    case 'ch4-fractions-disguise':
      specs = [
        {
          moduleRef: 'Module 1.5',
          assertion: `Increasing a price by 25% and then reducing the new price by 20% brings it back to the exact original price.`,
          reason: `1.25 × 0.80 = 1.00 (multiplying consecutive percentage factors returns the unit multiplier 1).`,
          correctArIndex: 0,
          explanation: `Both A and R are true and R proves why +25% followed by −20% cancels out cleanly.`,
        },
        {
          moduleRef: 'Module 1.6',
          assertion: `Increasing a price by 20% and then decreasing by 20% results in 0% net change.`,
          reason: `Successive +r% and −r% changes always give a net decrease of (r²/100)%.`,
          correctArIndex: 3,
          explanation: `A is false (1.2 × 0.8 = 0.96 ⇒ 4% loss), while R is true.`,
        },
      ];
      break;
    case 'ch5-baudhayana-pythagoras': {
      const irrPrime = pk(rng, d >= 3 ? [3, 5, 7, 11] : [2]);
      specs =
        d <= 2
          ? [
              {
                moduleRef: 'Module 2.5',
                assertion: `A triangle with sides ${3 * k} cm, ${4 * k} cm, and ${5 * k} cm is always a right-angled triangle.`,
                reason: `(${3 * k})² + (${4 * k})² = (${5 * k})², satisfying the converse of the Baudhāyana–Pythagoras theorem.`,
                correctArIndex: 0,
                explanation: `Both A and R are true and R proves A.`,
              },
              {
                moduleRef: 'Module 2.1',
                assertion: `Doubling a square of side ${a} cm creates a larger square whose side equals the original square's diagonal (${a}√2 cm).`,
                reason: `Building a square on the diagonal doubles the enclosed area from s² to 2s².`,
                correctArIndex: 0,
                explanation: `Both A and R are true and R is Baudhāyana's core diagonal-doubling theorem.`,
              },
            ]
          : [
              {
                moduleRef: 'Module 2.3',
                assertion: `√${irrPrime} cannot be written as any exact fraction p/q of coprime integers.`,
                reason: `In p² = ${irrPrime}q², prime factor ${irrPrime} appears an even number of times on the LHS and an odd number of times on the RHS.`,
                correctArIndex: 0,
                explanation: `Unique prime factorization makes an even exponent count impossible to match an odd exponent count.`,
              },
              {
                moduleRef: 'Module 2.7',
                assertion: `If three sides are 13 cm, 13 cm, and 10 cm, the triangle's area equals 60 cm².`,
                reason: `Dropping the altitude from the apex splits the 10 cm base into 5 cm halves, giving height √(13² − 5²) = 12 cm.`,
                correctArIndex: 0,
                explanation: `Area = ½ × 10 × 12 = 60 cm².`,
              },
            ];
      break;
    }
    case 'ch6-proportional-reasoning':
      specs = [
        {
          moduleRef: 'Module 3.2',
          assertion: `On a 1 : 50,000 map, a segment of length 4 cm corresponds to 2 km on the ground.`,
          reason: `Multiplying map length by 50,000 converts 4 cm into 200,000 cm = 2,000 m = 2 km.`,
          correctArIndex: 0,
          explanation: `Both A and R are true and R proves A.`,
        },
        {
          moduleRef: 'Module 3.6',
          assertion: `When speed doubles over a fixed journey, travel time also doubles.`,
          reason: `Speed and travel time vary inversely when distance is constant (Speed × Time = Distance).`,
          correctArIndex: 3,
          explanation: `A is false (time halves, not doubles), while R is true.`,
        },
      ];
      break;
    case 'ch11-geometric-themes':
      specs = [
        {
          moduleRef: 'Module 4.4',
          assertion: `A 2×2 flat square block of 4 faces inside a 6-square hexomino can NEVER fold into a closed cube.`,
          reason: `Four squares meeting around an interior vertex overlap in 3D instead of enclosing a 90° corner.`,
          correctArIndex: 0,
          explanation: `Both A and R are true and R explains why 24 of the 35 hexominoes fail to fold.`,
        },
        {
          moduleRef: 'Module 4.3',
          assertion: `After each step of a Koch curve construction, the total perimeter multiplies by 4/3.`,
          reason: `Each 1-unit segment is replaced by 4 segments of length 1/3 each.`,
          correctArIndex: 0,
          explanation: `4 × (1/3) = 4/3 per step cleanly explains A.`,
        },
      ];
      break;
    case 'ch12-dots-and-lines':
      specs = [
        {
          moduleRef: 'Module 5.3',
          assertion: `Adding +${a} to every observation in a data list increases the Mean by +${a} without changing the Range.`,
          reason: `Mean shifts linearly by +${a}, while Range (Max − Min) cancels out the common shift.`,
          correctArIndex: 0,
          explanation: `Both A and R are true and R explains A.`,
        },
        {
          moduleRef: 'Module 5.3',
          assertion: `The arithmetic mean is less affected by a huge extreme outlier than the median.`,
          reason: `The median depends solely on middle position(s), ignoring how extreme the largest value grows.`,
          correctArIndex: 3,
          explanation: `A is false (Mean is pulled heavily by outliers, whereas Median resists them), while R is true.`,
        },
      ];
      break;
    case 'ch13-algebra-play':
      specs = [
        {
          moduleRef: 'Module 6.6',
          assertion: `In any 3×3 square block on a standard calendar, the 9 numbers sum to 9 times the center date c.`,
          reason: `Dates symmetric across c satisfy (c − k) + (c + k) = 2c, canceling all offsets.`,
          correctArIndex: 0,
          explanation: `Symmetric opposite pairs cancel offsets cleanly around center c.`,
        },
        {
          moduleRef: 'Module 6.5',
          assertion: `In the doubling puzzle (Day n receives 2ⁿ⁻¹), Day 15 payout is double Day 14 payout.`,
          reason: `Doubling grows linearly by a constant difference each day.`,
          correctArIndex: 2,
          explanation: `A is true, while R is false — doubling grows exponentially (constant ratio ×2), not linearly.`,
        },
      ];
      break;
    case 'ch14-area':
    default:
      specs = [
        {
          moduleRef: 'Module 7.2',
          assertion: `Any median of a triangle splits it into two smaller triangles of equal AREA.`,
          reason: `The two half-triangles have equal bases (half of the bisected side) and share the exact same perpendicular height.`,
          correctArIndex: 0,
          explanation: `Equal bases × same altitude × ½ = equal areas.`,
        },
        {
          moduleRef: 'Module 7.3',
          assertion: `Two triangles sharing the same base between two parallel lines must have identical perimeters.`,
          reason: `Triangles on the same base between parallels always share the same altitude and therefore equal AREA.`,
          correctArIndex: 3,
          explanation: `A is false (shearing changes side lengths & perimeter!), while R is true (area stays invariant).`,
        },
      ];
      break;
  }

  const pickSpec = specs[(idx + (d >= 3 ? 1 : 0)) % specs.length];
  return {
    id: `fmt-ar-${chId}-d${d}-${idx}-${a}-${b}`,
    questionNumber: idx + 1,
    sourceChapterId: chId,
    moduleRef: pickSpec.moduleRef,
    type: 'mcq',
    formatType: 'mcq',
    mcqSubKind: 'assertion-reason',
    prompt: `Assertion (A): ${pickSpec.assertion}\nReason (R): ${pickSpec.reason}`,
    assertion: pickSpec.assertion,
    reason: pickSpec.reason,
    options: AR_STANDARD_OPTIONS,
    correctIndex: pickSpec.correctArIndex,
    acceptedAnswers: [AR_STANDARD_OPTIONS[pickSpec.correctArIndex]],
    explanation: pickSpec.explanation,
    markCount: 1,
  };
}

// ============================================================================
// LONG ANSWER GENERATOR (MULTI-STEP + TYPE OR SCAN)
// ============================================================================

function buildLongAnswerForChapter(
  chId: ChapterId,
  rng: () => number,
  d: QuizDifficultyLevel,
  idx: number
): FormattedTrickyQuestion {
  const k = ri(rng, d === 1 ? 2 : 3, d === 4 ? 14 : 9) + (idx % 5);
  const a = ri(rng, d === 1 ? 3 : 5, d === 4 ? 18 : 12) + Math.floor(idx / 5);
  const b = ri(rng, 2, 8);

  interface LASpec {
    moduleRef: string;
    prompt: string;
    expected: string;
    acceptedAnswers: string[];
    keySteps: string[];
    explanation: string;
  }

  let spec: LASpec;

  switch (chId) {
    case 'ch1-square-cube': {
      const primeMult = pk(rng, [2, 3, 5, 7]);
      const baseRoot = a + 2;
      const nVal = baseRoot * baseRoot * primeMult;
      if (d <= 2) {
        spec = {
          moduleRef: 'Module 1.5',
          prompt: `Find the smallest whole number by which ${nVal} must be multiplied so that the product becomes a perfect square. Also find the square root of the resulting perfect square. Show your prime-factorization steps.`,
          expected: `${primeMult} (root ${baseRoot * primeMult})`,
          acceptedAnswers: [`${primeMult}`, `${baseRoot * primeMult}`, `${primeMult} and ${baseRoot * primeMult}`],
          keySteps: [`${baseRoot}² × ${primeMult}`, `pair`, `multiply by ${primeMult}`, `${baseRoot * primeMult}`],
          explanation: `Step 1: Factorize ${nVal} = ${baseRoot}² × ${primeMult}. Step 2: ${primeMult} has no partner, so multiply by ${primeMult}. Step 3: √(${nVal * primeMult}) = ${baseRoot * primeMult}.`,
        };
      } else {
        const nSide = 40 + k * 5;
        const nextSq = (nSide + 1) ** 2;
        spec = {
          moduleRef: 'Module 1.4',
          prompt: `A gardener has ${nSide * nSide + b * 7} plants and wants to arrange them in an equal square grid (rows = columns) so no plant is left over. Find the MINIMUM number of additional plants needed. Show complete steps.`,
          expected: `${nextSq - (nSide * nSide + b * 7)}`,
          acceptedAnswers: [`${nextSq - (nSide * nSide + b * 7)}`],
          keySteps: [`${nSide}² = ${nSide * nSide}`, `${nSide + 1}² = ${nextSq}`, `subtract ${nSide * nSide + b * 7}`],
          explanation: `Step 1: ${nSide}² = ${nSide * nSide} < ${nSide * nSide + b * 7} < ${nextSq} = (${nSide + 1})². Step 2: Extra needed = ${nextSq} − ${nSide * nSide + b * 7} = ${nextSq - (nSide * nSide + b * 7)} plants.`,
        };
      }
      break;
    }
    case 'ch2-power-play':
      spec = {
        moduleRef: 'Module 2.5',
        prompt: `Simplify using laws of exponents and express the final value as a positive integer/fraction: [(${b}⁻² × ${b}⁵)² ÷ ${b}⁴]. Show every exponent step.`,
        expected: `${b * b}`,
        acceptedAnswers: [`${b * b}`, `${b}^2`],
        keySteps: [`${b}^(-2+5) = ${b}^3`, `(${b}^3)^2 = ${b}^6`, `${b}^6 ÷ ${b}^4 = ${b}^2`],
        explanation: `Step 1: ${b}⁻² × ${b}⁵ = ${b}³. Step 2: (${b}³)² = ${b}⁶. Step 3: ${b}⁶ ÷ ${b}⁴ = ${b}² = ${b * b}.`,
      };
      break;
    case 'ch3-story-numbers':
      spec = {
        moduleRef: 'Module 3.6',
        prompt: `A Mesopotamian tablet records two weights in Base-60: [${k + 1} ; ${25}]₆₀ and [1 ; ${45}]₆₀. Convert both to decimal, add them, and convert the total back to Base-60 [a ; b]₆₀. Show all steps.`,
        expected: `[${k + 3} ; 10]₆₀ (${(k + 3) * 60 + 10})`,
        acceptedAnswers: [`${(k + 3) * 60 + 10}`, `[${k + 3};10]`, `${k + 3};10`],
        keySteps: [`${(k + 1) * 60 + 25}`, `${105}`, `${(k + 3) * 60 + 10}`, `carry 60`],
        explanation: `Step 1: ${(k + 1) * 60 + 25} + 105 = ${(k + 3) * 60 + 10}. Step 2: 25 + 45 = 70 = 1×60 + 10 ⇒ [${k + 3} ; 10]₆₀.`,
      };
      break;
    case 'ch4-quadrilaterals':
      spec = {
        moduleRef: 'Module 4.4',
        prompt: `The four interior angles of a quadrilateral are in the ratio 2 : 3 : 4 : 6. Find the measure of all four angles (and state the largest angle). Show your full equation and steps.`,
        expected: `144° (angles 48°, 72°, 96°, 144°)`,
        acceptedAnswers: [`144`, `144°`, `48, 72, 96, 144`],
        keySteps: [`2x + 3x + 4x + 6x = 360`, `15x = 360`, `x = 24`, `144`],
        explanation: `Step 1: Sum of angles = 360°. Step 2: 15x = 360 ⇒ x = 24°. Step 3: Angles are 48°, 72°, 96°, and 144°.`,
      };
      break;
    case 'ch5-number-play': {
      const m = ri(rng, 2, 7);
      const diff9 = 9 * m;
      const sumDig = m + 2 * ri(rng, 2, 4);
      const bigD = (sumDig + m) / 2;
      const smallD = (sumDig - m) / 2;
      spec = {
        moduleRef: 'Module 5.7',
        prompt: `A 2-digit number AB exceeds its reverse BA by ${diff9}, and the sum of its digits A + B = ${sumDig}. Prove algebraically that AB − BA = 9(A − B) and find the original 2-digit number AB.`,
        expected: `${bigD * 10 + smallD}`,
        acceptedAnswers: [`${bigD * 10 + smallD}`],
        keySteps: [`(10A+B) - (10B+A) = 9(A-B)`, `A - B = ${m}`, `A + B = ${sumDig}`, `${bigD * 10 + smallD}`],
        explanation: `Step 1: 9(A − B) = ${diff9} ⇒ A − B = ${m}. Step 2: Add A + B = ${sumDig} ⇒ 2A = ${2 * bigD} ⇒ A = ${bigD}, B = ${smallD} ⇒ AB = ${bigD * 10 + smallD}.`,
      };
      break;
    }
    case 'ch6-we-distribute': {
      const xV = 50 * k;
      spec = {
        moduleRef: 'Module 6.3',
        prompt: `Using the algebraic identity (a − b)² = a² − 2ab + b², compute (${xV - b})² step-by-step without direct long multiplication.`,
        expected: `${(xV - b) ** 2}`,
        acceptedAnswers: [`${(xV - b) ** 2}`],
        keySteps: [`(${xV} - ${b})²`, `${xV * xV}`, `${2 * xV * b}`, `${(xV - b) ** 2}`],
        explanation: `Step 1: (${xV} − ${b})² = ${xV}² − 2(${xV})(${b}) + ${b}². Step 2: ${xV * xV} − ${2 * xV * b} + ${b * b} = ${(xV - b) ** 2}.`,
      };
      break;
    }
    case 'ch7-proportional-1': {
      const wStart = 12;
      const dDays = k * 5;
      const wAfter = 15;
      const dOut = (wStart * dDays) / wAfter;
      spec = {
        moduleRef: 'Module 7.7',
        prompt: `${wStart} workers can build a community library wall in ${dDays} days. How many days would ${wAfter} workers take working at the same pace? Show your inverse-proportion setup clearly.`,
        expected: `${dOut} days`,
        acceptedAnswers: [`${dOut}`, `${dOut} days`],
        keySteps: [`${wStart} × ${dDays} = ${wStart * dDays}`, `divide by ${wAfter}`, `${dOut}`],
        explanation: `Inverse proportion keeps total worker-days constant: ${wStart} × ${dDays} = ${wAfter} × D ⇒ D = ${wStart * dDays} ÷ ${wAfter} = ${dOut} days.`,
      };
      break;
    }
    case 'ch4-fractions-disguise': {
      const cp = k * 400;
      const mp = cp * 1.5;
      const sp = mp * 0.8;
      const prof = sp - cp;
      spec = {
        moduleRef: 'Module 1.6',
        prompt: `A shopkeeper buys a bicycle for ₹${cp}, marks its price 50% above Cost Price, and then offers a 20% discount to the buyer. Find the Selling Price and net Profit Percentage. Show step-by-step working.`,
        expected: `SP = ₹${sp}, Profit = 20%`,
        acceptedAnswers: [`20%`, `${sp}`, `20`],
        keySteps: [`MP = ${mp}`, `discount 20%`, `SP = ${sp}`, `profit ${prof}`, `20%`],
        explanation: `Step 1: MP = ${cp} × 1.5 = ₹${mp}. Step 2: 20% discount ⇒ SP = 0.8 × ${mp} = ₹${sp}. Step 3: Profit% = (${prof}/${cp}) × 100 = 20%.`,
      };
      break;
    }
    case 'ch5-baudhayana-pythagoras': {
      if (d <= 2) {
        const legA = 6 * k;
        const legB = 8 * k;
        const hypC = 10 * k;
        spec = {
          moduleRef: 'Module 2.5',
          prompt: `A ${hypC} m ladder leans against a vertical wall with its foot ${legA} m away from the wall base. First find how high up the wall it reaches. Then if the foot slides outward to ${legB} m, find the new height and how far down the top slid!`,
          expected: `Drops ${legB - legA} m (from ${legB} m to ${legA} m)`,
          acceptedAnswers: [`${legB - legA}`, `${legB - legA} m`, `${legA}`],
          keySteps: [`√(${hypC}² - ${legA}²) = ${legB}`, `√(${hypC}² - ${legB}²) = ${legA}`, `${legB} - ${legA} = ${legB - legA}`],
          explanation: `Initial height = √(${hypC}² − ${legA}²) = ${legB} m. After sliding out to ${legB} m, new height = √(${hypC}² − ${legB}²) = ${legA} m ⇒ slid down ${legB - legA} m.`,
        };
      } else {
        const halfBase = 5 * k;
        const alt = 12 * k;
        const slant = 13 * k;
        const fullBase = 2 * halfBase;
        const isoArea = halfBase * alt;
        spec = {
          moduleRef: 'Module 2.7',
          prompt: `An isosceles triangle banner has equal slanted sides ${slant} cm and horizontal base ${fullBase} cm. Drop the perpendicular altitude to bisect the base, compute its height via Baudhāyana's theorem, and find the total area (cm²) of the triangle. Show all steps.`,
          expected: `Height = ${alt} cm, Area = ${isoArea} cm²`,
          acceptedAnswers: [`${isoArea}`, `${isoArea} cm²`, `${alt}`],
          keySteps: [`half-base = ${halfBase}`, `√(${slant}² - ${halfBase}²) = ${alt}`, `½ × ${fullBase} × ${alt} = ${isoArea}`],
          explanation: `Half-base = ${halfBase} cm ⇒ Altitude = √(${slant}² − ${halfBase}²) = ${alt} cm ⇒ Area = ½ × ${fullBase} × ${alt} = ${isoArea} cm².`,
        };
      }
      break;
    }
    case 'ch6-proportional-reasoning': {
      const sumAmt = (2 + 3 + 5) * k * 50;
      const largest = 5 * k * 50;
      spec = {
        moduleRef: 'Module 3.4',
        prompt: `₹${sumAmt.toLocaleString()} is divided among Aarav, Bhavna, and Charu in the ratio 2 : 3 : 5. Find each person's share and verify that Charu receives 50% of the total. Show steps.`,
        expected: `₹${2 * k * 50}, ₹${3 * k * 50}, ₹${largest}`,
        acceptedAnswers: [`${largest}`, `${2 * k * 50}, ${3 * k * 50}, ${largest}`],
        keySteps: [`2+3+5=10 parts`, `1 part = ${k * 50}`, `${2 * k * 50}`, `${3 * k * 50}`, `${largest}`],
        explanation: `Total parts = 10 ⇒ 1 part = ₹${k * 50}. Shares: ₹${2 * k * 50}, ₹${3 * k * 50}, and ₹${largest} (= ½ × ₹${sumAmt}).`,
      };
      break;
    }
    case 'ch11-geometric-themes': {
      const sideC = k + 3;
      const painted1 = 6 * (sideC - 2) * (sideC - 2);
      spec = {
        moduleRef: 'Module 4.7',
        prompt: `A solid ${sideC} × ${sideC} × ${sideC} wooden cube is painted green on all 6 outer faces and cut into ${sideC ** 3} unit cubes (1×1×1). Find how many unit cubes have (i) 3 green faces, (ii) 2 green faces, and (iii) EXACTLY 1 green face. Show your counting method.`,
        expected: `(i) 8, (ii) ${12 * (sideC - 2)}, (iii) ${painted1}`,
        acceptedAnswers: [`${painted1}`, `8, ${12 * (sideC - 2)}, ${painted1}`],
        keySteps: [`8 corners`, `12×(${sideC}-2) = ${12 * (sideC - 2)}`, `6×(${sideC}-2)² = ${painted1}`],
        explanation: `Corners (3 faces) = 8; Edges (2 faces) = 12(${sideC}−2) = ${12 * (sideC - 2)}; Face interiors (1 face) = 6(${sideC}−2)² = ${painted1}.`,
      };
      break;
    }
    case 'ch12-dots-and-lines': {
      const mOrig = 10 + a;
      const newVal = mOrig + 6 * k;
      const newMean = mOrig + k;
      spec = {
        moduleRef: 'Module 5.1',
        prompt: `The mean score of 5 friends in a Ganita quiz is ${mOrig}. When a 6th friend joins with score ${newVal}, find the new combined mean of all 6 friends. Show your sum & division steps.`,
        expected: `${newMean}`,
        acceptedAnswers: [`${newMean}`],
        keySteps: [`5 × ${mOrig} = ${5 * mOrig}`, `+ ${newVal} = ${5 * mOrig + newVal}`, `÷ 6 = ${newMean}`],
        explanation: `Old sum = 5 × ${mOrig} = ${5 * mOrig}. New sum = ${5 * mOrig} + ${newVal} = ${5 * mOrig + newVal}. New mean = ${5 * mOrig + newVal} ÷ 6 = ${newMean}.`,
      };
      break;
    }
    case 'ch13-algebra-play': {
      const ansX = k + 4;
      const exactRhs = 3 * ansX + 6;
      spec = {
        moduleRef: 'Module 6.7',
        prompt: `Solve the linear equation: 5x − 2(x − 3) = ${exactRhs}. Expand the bracket carefully, solve for x, and verify LHS = RHS. Show all steps.`,
        expected: `x = ${ansX}`,
        acceptedAnswers: [`${ansX}`, `x=${ansX}`],
        keySteps: [`5x - 2x + 6 = ${exactRhs}`, `3x = ${3 * ansX}`, `x = ${ansX}`],
        explanation: `Step 1: 5x − 2x + 6 = ${exactRhs}. Step 2: 3x + 6 = ${exactRhs} ⇒ 3x = ${3 * ansX} ⇒ x = ${ansX}. Check: 5(${ansX}) − 2(${ansX - 3}) = ${5 * ansX} − ${2 * (ansX - 3)} = ${exactRhs}.`,
      };
      break;
    }
    case 'ch14-area':
    default: {
      const p1 = 10 + 2 * k;
      const p2 = p1 + 8;
      const ht = 6 + (b % 2) * 2;
      const trapArea = ((p1 + p2) / 2) * ht;
      spec = {
        moduleRef: 'Module 7.6',
        prompt: `A trapezium-shaped school courtyard has parallel sides of length ${p1} m and ${p2} m, separated by a perpendicular width of ${ht} m. Find its total area, and calculate the paving cost at ₹250 per m². Show all steps.`,
        expected: `Area = ${trapArea} m², Cost = ₹${(trapArea * 250).toLocaleString()}`,
        acceptedAnswers: [`${trapArea * 250}`, `${trapArea}`, `₹${trapArea * 250}`],
        keySteps: [`½ × (${p1} + ${p2}) × ${ht}`, `${trapArea}`, `× 250 = ${trapArea * 250}`],
        explanation: `Area = ½(${p1} + ${p2}) × ${ht} = ${trapArea} m². Cost = ${trapArea} × 250 = ₹${(trapArea * 250).toLocaleString()}.`,
      };
      break;
    }
  }

  return {
    id: `fmt-la-${chId}-d${d}-${idx}-${k}-${a}`,
    questionNumber: idx + 1,
    sourceChapterId: chId,
    moduleRef: spec.moduleRef,
    type: 'short-answer',
    formatType: 'long-answer',
    prompt: spec.prompt,
    options: [spec.expected],
    correctIndex: 0,
    acceptedAnswers: spec.acceptedAnswers,
    keySteps: spec.keySteps,
    explanation: spec.explanation,
    markCount: 1,
  };
}

// ============================================================================
// REAL-LIFE CASE STUDY GENERATOR (4 SUB-QUESTIONS a, b, c, d MIX MCQ/SUBJECTIVE)
// ============================================================================

function buildCaseStudyForChapter(
  chId: ChapterId,
  rng: () => number,
  d: QuizDifficultyLevel,
  idx: number
): FormattedTrickyQuestion {
  const k = ri(rng, d === 1 ? 2 : 3, d === 4 ? 8 : 5) + idx;
  const scale = d === 4 ? 2 : 1;

  interface CSBuilderResult {
    moduleRef: string;
    scenarioTitle: string;
    scenarioText: string;
    subs: CaseStudySubQuestion[];
    explanation: string;
  }

  let cs: CSBuilderResult;

  switch (chId) {
    case 'ch1-square-cube': {
      const side = (12 + k) * scale;
      const totTiles = side * side;
      const borderTiles = totTiles - (side - 2) * (side - 2);
      const cubEdge = 4 + k;
      cs = {
        moduleRef: 'Case Study · Chapter 1',
        scenarioTitle: 'School Assembly Hall Tiling & Water Tank',
        scenarioText: `A school designs a square courtyard floor arranged as a ${side} × ${side} grid of identical ceramic square tiles, alongside a cubical rainwater storage tank whose interior side measures ${cubEdge} m (1 m³ = 1,000 L).`,
        explanation: `Courtyard holds ${side}² = ${totTiles} tiles; 1-tile outer frame uses ${borderTiles}; Tank capacity = ${cubEdge}³ = ${cubEdge ** 3} m³.`,
        subs: [
          {
            subLabel: 'a',
            subType: 'subjective',
            prompt: `How many total square ceramic tiles cover the entire ${side} × ${side} courtyard?`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`${totTiles}`],
            explanation: `${side} × ${side} = ${totTiles} tiles.`,
          },
          {
            subLabel: 'b',
            subType: 'mcq',
            prompt: `If the contractor lays a 1-tile-wide decorative border around the outer edge, how many border tiles are used?`,
            options: [`${borderTiles}`, `${side * 4}`, `${totTiles - 4}`, `${(side - 2) * 4}`],
            correctIndex: 0,
            acceptedAnswers: [`${borderTiles}`],
            explanation: `${side}² − (${side - 2})² = 4(${side} − 1) = ${borderTiles} border tiles.`,
          },
          {
            subLabel: 'c',
            subType: 'subjective',
            prompt: `What is the volume (in m³) of the cubical rainwater tank of edge ${cubEdge} m?`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`${cubEdge ** 3}`],
            explanation: `Volume of cube = ${cubEdge}³ = ${cubEdge ** 3} m³.`,
          },
          {
            subLabel: 'd',
            subType: 'mcq',
            prompt: `Adding one more row AND column to expand the grid to (${side + 1}) × (${side + 1}) requires how many EXTRA tiles?`,
            options: [`${2 * side + 1}`, `${side + 1}`, `${2 * side}`, `${side * 2 + 2}`],
            correctIndex: 0,
            acceptedAnswers: [`${2 * side + 1}`],
            explanation: `(${side + 1})² − ${side}² = 2(${side}) + 1 = ${2 * side + 1} extra tiles.`,
          },
        ],
      };
      break;
    }

    case 'ch2-power-play': {
      const startB = 100 * k;
      const doubleSteps = d === 4 ? 6 : 4;
      const doubled = startB * (2 ** doubleSteps);
      cs = {
        moduleRef: 'Case Study · Chapter 2',
        scenarioTitle: 'Microbiology Lab & Space Distance Telemetry',
        scenarioText: `In a science lab, a harmless yogurt bacterial colony starts with ${startB} cells and doubles every 1 hour. Meanwhile, an astronomy chart records Earth–Moon distance as approximately 3.84 × 10⁵ km and a cell diameter as 2 × 10⁻⁶ m.`,
        explanation: `Doubling follows ${startB} × 2ⁿ; Scientific powers add/subtract exponents during multiplication & division.`,
        subs: [
          {
            subLabel: 'a',
            subType: 'subjective',
            prompt: `How many bacterial cells are present after ${doubleSteps} hours of doubling?`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`${doubled}`],
            explanation: `${startB} × 2^${doubleSteps} = ${startB} × ${2 ** doubleSteps} = ${doubled}.`,
          },
          {
            subLabel: 'b',
            subType: 'mcq',
            prompt: `Write 2 × 10⁻⁶ m as a standard decimal in meters:`,
            options: [`0.000002 m`, `0.00002 m`, `0.0000002 m`, `2000000 m`],
            correctIndex: 0,
            acceptedAnswers: [`0.000002`],
            explanation: `10⁻⁶ shifts the decimal point 6 places left ⇒ 0.000002 m.`,
          },
          {
            subLabel: 'c',
            subType: 'mcq',
            prompt: `What is (4 × 10⁵) ÷ (2 × 10⁻⁶) expressed in standard scientific notation?`,
            options: [`2 × 10¹¹`, `2 × 10⁻¹`, `2 × 10¹`, `8 × 10⁻¹`],
            correctIndex: 0,
            acceptedAnswers: [`2 × 10^11`, `2e11`],
            explanation: `(4÷2) × 10^(5 − (−6)) = 2 × 10¹¹.`,
          },
          {
            subLabel: 'd',
            subType: 'subjective',
            prompt: `By what power factor (2ⁿ) does the colony grow between Hour 2 and Hour ${2 + k}? (Write the integer value of 2^${k}.)`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`${2 ** k}`],
            explanation: `In ${k} hours, population multiplies by 2^${k} = ${2 ** k}.`,
          },
        ],
      };
      break;
    }

    case 'ch4-quadrilaterals': {
      const angA = 60 + k * 4;
      const angB = 180 - angA;
      const d1 = 16;
      const d2 = 12;
      const rombArea = (d1 * d2) / 2;
      cs = {
        moduleRef: 'Case Study · Chapter 4',
        scenarioTitle: 'Glass Skylight & Kite Craft Workshop',
        scenarioText: `An architect designs a skylight parallelogram ABCD with ∠A = ${angA}° and side AB = 20 cm, beside a decorative diamond-shaped rhombus window whose wooden cross-struts (diagonals) measure ${d1} cm and ${d2} cm meeting at 90°.`,
        explanation: `Parallelogram adjacent angles add to 180°; Rhombus half-diagonals form a 6-8-10 right triangle.`,
        subs: [
          {
            subLabel: 'a',
            subType: 'subjective',
            prompt: `In the parallelogram frame ABCD, if ∠A = ${angA}°, find its adjacent angle ∠B (in degrees).`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`${angB}`, `${angB}°`],
            explanation: `Adjacent angles of a parallelogram are supplementary: 180° − ${angA}° = ${angB}°.`,
          },
          {
            subLabel: 'b',
            subType: 'mcq',
            prompt: `In parallelogram ABCD, which angle MUST equal ∠A (${angA}°)?`,
            options: [`∠C (opposite angle)`, `∠D (adjacent angle)`, `90° always`, `180° − ∠A`],
            correctIndex: 0,
            acceptedAnswers: [`∠C`],
            explanation: `Opposite angles in any parallelogram are equal.`,
          },
          {
            subLabel: 'c',
            subType: 'subjective',
            prompt: `Using half-diagonals ${d1 / 2} cm and ${d2 / 2} cm of the rhombus window, find the length of ONE side of the rhombus (in cm).`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`10`, `10 cm`],
            explanation: `√(${d1 / 2}² + ${d2 / 2}²) = √(64 + 36) = √100 = 10 cm.`,
          },
          {
            subLabel: 'd',
            subType: 'mcq',
            prompt: `What is the total glass area (in cm²) of the rhombus window?`,
            options: [`${rombArea} cm²`, `${d1 * d2} cm²`, `40 cm²`, `100 cm²`],
            correctIndex: 0,
            acceptedAnswers: [`${rombArea}`],
            explanation: `Area = ½ × d₁ × d₂ = ½ × ${d1} × ${d2} = ${rombArea} cm².`,
          },
        ],
      };
      break;
    }

    case 'ch4-fractions-disguise': {
      const mp = 1000 * k;
      const disc = 20;
      const afterDisc = mp * (1 - disc / 100);
      const gstPct = 10;
      const finalBill = afterDisc * (1 + gstPct / 100);
      const costPrice = Math.round(afterDisc / 1.25);
      cs = {
        moduleRef: 'Case Study · Part II Ch 1',
        scenarioTitle: 'Festival Bookstore Checkout & GST Billing',
        scenarioText: `During a reading festival, an encyclopedia set carries a Printed Marked Price (MP) of ₹${mp.toLocaleString()}. The store grants a flat ${disc}% seasonal discount on MP, and then adds ${gstPct}% GST on the discounted selling price.`,
        explanation: `Discount reduces MP to ₹${afterDisc}; GST adds 10% on top ⇒ ₹${finalBill}.`,
        subs: [
          {
            subLabel: 'a',
            subType: 'subjective',
            prompt: `What is the selling price of the encyclopedia set AFTER the ${disc}% discount (before GST)?`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`${afterDisc}`, `₹${afterDisc}`],
            explanation: `20% of ₹${mp} = ₹${mp * 0.2}; ₹${mp} − ₹${mp * 0.2} = ₹${afterDisc}.`,
          },
          {
            subLabel: 'b',
            subType: 'subjective',
            prompt: `After adding ${gstPct}% GST onto ₹${afterDisc}, what total amount does the customer pay?`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`${finalBill}`, `₹${finalBill}`],
            explanation: `10% of ₹${afterDisc} = ₹${afterDisc * 0.1}; Total = ₹${finalBill}.`,
          },
          {
            subLabel: 'c',
            subType: 'mcq',
            prompt: `If the store made a 25% profit at the pre-GST selling price of ₹${afterDisc}, what was the store's Cost Price (CP)?`,
            options: [`₹${costPrice}`, `₹${afterDisc - 100}`, `₹${Math.round(afterDisc * 0.75)}`, `₹${mp * 0.6}`],
            correctIndex: 0,
            acceptedAnswers: [`${costPrice}`],
            explanation: `CP × 1.25 = ₹${afterDisc} ⇒ CP = ₹${afterDisc} ÷ 1.25 = ₹${costPrice}.`,
          },
          {
            subLabel: 'd',
            subType: 'mcq',
            prompt: `What single overall percentage adjustment compared to ₹${mp} gives the final paid bill ₹${finalBill}?`,
            options: [`12% net decrease`, `10% net decrease`, `8% net decrease`, `30% net decrease`],
            correctIndex: 0,
            acceptedAnswers: [`12%`, `12`],
            explanation: `0.80 × 1.10 = 0.88 ⇒ 12% net reduction from MP.`,
          },
        ],
      };
      break;
    }

    case 'ch5-baudhayana-pythagoras': {
      const mMult = k;
      const runBase = 6 * mMult;
      const riseHeight = 8 * mMult;
      const rampLen = 10 * mMult;
      cs = {
        moduleRef: 'Case Study · Part II Ch 2',
        scenarioTitle: 'Accessible School Ramp & Drone Park',
        scenarioText: `A civic engineer builds a straight wheelchair ramp reaching a porch ${riseHeight} ft above ground from a horizontal start ${runBase} ft away from the porch wall. Nearby stands a rectangular park ${3 * mMult}0 m wide and ${4 * mMult}0 m long with a diagonal footpath.`,
        explanation: `Using scaled (3,4,5) triples: ramp = ${rampLen} ft; park diagonal = ${5 * mMult}0 m.`,
        subs: [
          {
            subLabel: 'a',
            subType: 'subjective',
            prompt: `Find the exact sloped length of the wheelchair ramp (in ft) using Baudhāyana's theorem.`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`${rampLen}`, `${rampLen} ft`],
            explanation: `√(${runBase}² + ${riseHeight}²) = ${rampLen} ft.`,
          },
          {
            subLabel: 'b',
            subType: 'mcq',
            prompt: `How long is the diagonal footpath across the ${3 * mMult}0 m × ${4 * mMult}0 m rectangular park?`,
            options: [`${5 * mMult}0 m`, `${7 * mMult}0 m`, `${6 * mMult}0 m`, `${5 * mMult} m`],
            correctIndex: 0,
            acceptedAnswers: [`${5 * mMult}0`],
            explanation: `Scaled (3,4,5) × ${mMult * 10} gives diagonal = ${5 * mMult}0 m.`,
          },
          {
            subLabel: 'c',
            subType: 'subjective',
            prompt: `Walking along the diagonal footpath instead of walking along two perimeter edges (${3 * mMult}0 m + ${4 * mMult}0 m) saves how many meters?`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`${2 * mMult}0`, `${2 * mMult}0 m`],
            explanation: `(${3 * mMult}0 + ${4 * mMult}0) − ${5 * mMult}0 = ${2 * mMult}0 m saved.`,
          },
          {
            subLabel: 'd',
            subType: 'mcq',
            prompt: `Which set of triangle sides also guarantees a 90° corner check on the construction site?`,
            options: [`5 m, 12 m, 13 m`, `4 m, 5 m, 7 m`, `6 m, 7 m, 9 m`, `8 m, 9 m, 12 m`],
            correctIndex: 0,
            acceptedAnswers: [`5, 12, 13`],
            explanation: `5² + 12² = 25 + 144 = 169 = 13².`,
          },
        ],
      };
      break;
    }

    case 'ch7-proportional-1':
    case 'ch6-proportional-reasoning': {
      const baseSpeed = 60;
      const timeHrs = k + 1;
      const distKm = baseSpeed * timeHrs;
      const fastSpeed = 90;
      const fastTimeHrs = distKm / fastSpeed;
      const mapDistCm = k * 3;
      const groundKm = mapDistCm * 2;
      cs = {
        moduleRef: `Case Study · ${chId === 'ch7-proportional-1' ? 'Part I Ch 7' : 'Part II Ch 3'}`,
        scenarioTitle: 'Intercity Express Train & Route Map Scale',
        scenarioText: `An express train travels at a steady speed of ${baseSpeed} km/h and completes a route in ${timeHrs} hours. On the railway tourist map (scale 1 cm : 2 km), the route measures ${mapDistCm} cm in map length.`,
        explanation: `Distance = ${distKm} km; Map scale 1 cm = 2 km ⇒ ${groundKm} km; Inverse speed/time maintains ${distKm} km product.`,
        subs: [
          {
            subLabel: 'a',
            subType: 'subjective',
            prompt: `What is the total railway route distance (in km) covered in ${timeHrs} hours at ${baseSpeed} km/h?`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`${distKm}`, `${distKm} km`],
            explanation: `Distance = ${baseSpeed} × ${timeHrs} = ${distKm} km.`,
          },
          {
            subLabel: 'b',
            subType: 'mcq',
            prompt: `At ${fastSpeed} km/h (higher speed over the same ${distKm} km distance), how many hours will the train take?`,
            options: [
              `${fastTimeHrs % 1 === 0 ? fastTimeHrs : fastTimeHrs.toFixed(2).replace(/\.?0+$/, '')} hours`,
              `${timeHrs + 1} hours`,
              `${timeHrs} hours`,
              `${(fastTimeHrs * 2).toFixed(1).replace(/\.0$/, '')} hours`,
            ],
            correctIndex: 0,
            acceptedAnswers: [`${fastTimeHrs}`],
            explanation: `Time = ${distKm} ÷ ${fastSpeed} = ${fastTimeHrs.toFixed(2).replace(/\.?0+$/, '')} hours.`,
          },
          {
            subLabel: 'c',
            subType: 'subjective',
            prompt: `On the tourist map (1 cm = 2 km), what real ground distance (in km) does a ${mapDistCm} cm segment represent?`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`${groundKm}`, `${groundKm} km`],
            explanation: `${mapDistCm} × 2 km = ${groundKm} km.`,
          },
          {
            subLabel: 'd',
            subType: 'mcq',
            prompt: `What is the simplified Ratio of Speeds (${baseSpeed} km/h : ${fastSpeed} km/h)?`,
            options: [`2 : 3`, `3 : 2`, `1 : 3`, `4 : 5`],
            correctIndex: 0,
            acceptedAnswers: [`2:3`],
            explanation: `60 : 90 divides cleanly by 30 ⇒ 2 : 3.`,
          },
        ],
      };
      break;
    }

    case 'ch14-area': {
      const len = 30 + k * 4;
      const wid = 20 + k * 2;
      const areaM = len * wid;
      const pathW = 2;
      const borderArea = 2 * pathW * (len + wid + 2 * pathW);
      cs = {
        moduleRef: 'Case Study · Part II Ch 7',
        scenarioTitle: 'Botanical Park Lawn & Surrounding Gravel Path',
        scenarioText: `A rectangular botanical park lawn measures ${len} m long by ${wid} m wide. The parks department surrounds the entire outside perimeter with a uniform ${pathW} m wide walking track, and builds a triangular flowerbed inside with base 12 m and perpendicular height 5 m.`,
        explanation: `Lawn = ${areaM} m²; Border track = 2w(L+W+2w) = ${borderArea} m²; Flowerbed = ½(12)(5) = 30 m².`,
        subs: [
          {
            subLabel: 'a',
            subType: 'subjective',
            prompt: `What is the area (in m²) of the inner rectangular grass lawn?`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`${areaM}`, `${areaM} m²`],
            explanation: `${len} × ${wid} = ${areaM} m².`,
          },
          {
            subLabel: 'b',
            subType: 'mcq',
            prompt: `What are the OUTER dimensions (length × width) including the uniform ${pathW} m track on all four sides?`,
            options: [`${len + 4} m × ${wid + 4} m`, `${len + 2} m × ${wid + 2} m`, `${len + 8} m × ${wid + 8} m`, `${len} m × ${wid + 4} m`],
            correctIndex: 0,
            acceptedAnswers: [`${len + 4} x ${wid + 4}`],
            explanation: `Adding ${pathW} m on both ends adds 2 × ${pathW} = 4 m to length and width.`,
          },
          {
            subLabel: 'c',
            subType: 'subjective',
            prompt: `Find the exact area (in m²) of ONLY the outer gravel walking track.`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`${borderArea}`, `${borderArea} m²`],
            explanation: `(${len + 4} × ${wid + 4}) − (${len} × ${wid}) = ${borderArea} m².`,
          },
          {
            subLabel: 'd',
            subType: 'mcq',
            prompt: `What is the area of the triangular flowerbed (base 12 m, height 5 m)?`,
            options: [`30 m²`, `60 m²`, `17 m²`, `15 m²`],
            correctIndex: 0,
            acceptedAnswers: [`30`],
            explanation: `½ × 12 × 5 = 30 m².`,
          },
        ],
      };
      break;
    }

    default: {
      // Adaptive real-life scenario covering ch3, ch5, ch6, ch11, ch12, ch13 faithfully by domain
      const baseP = 10 + k * 2;
      const totCost5 = baseP * 5;
      const meanSet = [baseP - 2, baseP, baseP + 2, baseP + 4, baseP + 6];
      const avg = baseP + 2;
      cs = {
        moduleRef: `Case Study · ${chId}`,
        scenarioTitle: 'Community Science Fair Budget & Pattern Booths',
        scenarioText: `Class 8 organizes a Science Fair with exhibition booths built along a linear growth rule: Step n uses (3n + 1) wooden poles. Daily visitor counts across 5 booths were [${meanSet.join(', ')}] visitors, and ticket bundles cost ₹${baseP} each (with a group rebate formula 2x + ${baseP} for x extra kits).`,
        explanation: `Arithmetic rule 3n+1, symmetric mean ${avg}, and linear unit rates keep booth planning balanced.`,
        subs: [
          {
            subLabel: 'a',
            subType: 'subjective',
            prompt: `Using the pole pattern (3n + 1), how many wooden poles are needed to build Booth Step n = ${k + 4}?`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`${3 * (k + 4) + 1}`],
            explanation: `3(${k + 4}) + 1 = ${3 * (k + 4) + 1} poles.`,
          },
          {
            subLabel: 'b',
            subType: 'subjective',
            prompt: `Find the Mean (average) visitors per booth from [${meanSet.join(', ')}].`,
            options: [],
            correctIndex: 0,
            acceptedAnswers: [`${avg}`],
            explanation: `Symmetric arithmetic run centers cleanly at middle term ${avg}.`,
          },
          {
            subLabel: 'c',
            subType: 'mcq',
            prompt: `What is the total cost of 5 ticket bundles at ₹${baseP} each, evaluated via distributivity 5 × (${baseP - 2} + 2)?`,
            options: [`₹${totCost5}`, `₹${totCost5 + 10}`, `₹${baseP * 4}`, `₹${baseP + 5}`],
            correctIndex: 0,
            acceptedAnswers: [`${totCost5}`],
            explanation: `5 × ${baseP} = ₹${totCost5}.`,
          },
          {
            subLabel: 'd',
            subType: 'mcq',
            prompt: `If group cost 2x + ${baseP} = ${baseP + 16}, how many extra kits (x) were bought?`,
            options: [`8`, `16`, `4`, `10`],
            correctIndex: 0,
            acceptedAnswers: [`8`],
            explanation: `2x = 16 ⇒ x = 8 kits.`,
          },
        ],
      };
      break;
    }
  }

  return {
    id: `fmt-cs-${chId}-d${d}-${idx}-${k}`,
    questionNumber: idx + 1,
    sourceChapterId: chId,
    moduleRef: cs.moduleRef,
    type: 'mcq',
    formatType: 'case-study',
    scenarioTitle: cs.scenarioTitle,
    scenarioText: cs.scenarioText,
    prompt: cs.scenarioText,
    options: [],
    correctIndex: 0,
    acceptedAnswers: [],
    explanation: cs.explanation,
    subQuestions: cs.subs,
    markCount: 4,
  };
}

// ============================================================================
// SUBJECTIVE (ANSWER-ONLY) BUILDER — STRIPS MCQ CRUTCH CLEANLY
// ============================================================================

function toSubjectiveFromQuestion(
  baseQ: TrickyTextbookQuestion,
  idx: number
): FormattedTrickyQuestion {
  const canonicalAnswer = baseQ.options[baseQ.correctIndex] || baseQ.acceptedShortAnswers?.[0] || '';
  const accepted = Array.from(
    new Set([
      canonicalAnswer,
      ...(baseQ.acceptedShortAnswers || []),
    ].filter(Boolean))
  );

  // Clean MCQ phrasing if prompt says "which ... below"
  let cleanPrompt = baseQ.prompt
    .replace(/\bwhich\s+(option|one|candidate|fraction|value|expression)?\s*(below|listed|shown)\b/gi, 'what value')
    .replace(/\bselect\s+the\s+correct\b/gi, 'find the exact')
    .trim();
  if (cleanPrompt.endsWith(':')) {
    cleanPrompt = `${cleanPrompt.slice(0, -1)}?`;
  }

  return {
    ...baseQ,
    id: `fmt-subj-${baseQ.sourceChapterId}-${idx}-${baseQ.id}`,
    questionNumber: idx + 1,
    type: 'short-answer',
    formatType: 'subjective',
    prompt: cleanPrompt,
    acceptedAnswers: accepted,
    markCount: 1,
  };
}

// Check if a chapter question is suitable for direct Subjective Answer-Only typing
function isGoodSubjectiveCandidate(q: TrickyTextbookQuestion): boolean {
  const ans = (q.options[q.correctIndex] || '').trim();
  const promptLower = q.prompt.toLowerCase();
  if (!ans || ans.length > 26) return false;
  if (/\b(below|which of these|following)\b/.test(promptLower)) return false;
  // Require concise numeric / algebraic / ratio / short phrase answer
  return /^[−\-+]?[\d.,/%°₹xyn²³√^:\sa-zA-Z()]+$/.test(ans) && ans.split(/\s+/).length <= 3;
}

// ============================================================================
// MAIN ORCHESTRATOR: RESPECTS SELECTED CHAPTERS, DIFFICULTY & 4 FORMATS
// ============================================================================

export function generateFormattedTrickyQuiz({
  selectedChapterIds,
  seed,
  staticByChapter = {},
  difficulty,
  enabledFormats,
  totalTarget = 20,
}: GenerateFormattedTrickyParams): FormattedTrickyQuestion[] {
  const validChapters = Array.from(new Set(selectedChapterIds)).filter(Boolean);
  if (validChapters.length === 0) return [];

  const activeFormats: TrickyFormatType[] =
    enabledFormats.length > 0 ? Array.from(new Set(enabledFormats)) : ['mcq'];

  const rng = seededRng(
    seed * 4999 + validChapters.length * 137 + difficulty * 919 + activeFormats.length * 53
  );

  // Compute balanced mark distribution totaling `totalTarget` (default 20 marks)
  let mcqTarget = 0;
  let subjTarget = 0;
  let laTarget = 0;
  let csCount = 0;

  if (activeFormats.length === 1) {
    const only = activeFormats[0];
    if (only === 'case-study') {
      csCount = Math.max(1, Math.round(totalTarget / 4));
    } else if (only === 'mcq') {
      mcqTarget = totalTarget;
    } else if (only === 'subjective') {
      subjTarget = totalTarget;
    } else {
      laTarget = totalTarget;
    }
  } else {
    const hasMcq = activeFormats.includes('mcq');
    const hasSubj = activeFormats.includes('subjective');
    const hasLa = activeFormats.includes('long-answer');
    const hasCs = activeFormats.includes('case-study');

    if (hasMcq && hasSubj && hasLa && hasCs && totalTarget === 20) {
      mcqTarget = 6; // 4 Normal + 2 Assertion-Reason
      subjTarget = 4;
      laTarget = 2;
      csCount = 2; // 2 × 4 = 8 marks -> total 20 marks
    } else {
      let remaining = totalTarget;
      if (hasCs) {
        csCount = Math.max(1, Math.min(Math.floor(remaining / 4), activeFormats.length === 2 ? 2 : 2));
        remaining -= csCount * 4;
      }
      const others = activeFormats.filter((f) => f !== 'case-study');
      if (others.length > 0 && remaining > 0) {
        const baseShare = Math.floor(remaining / others.length);
        let extra = remaining % others.length;
        for (const f of others) {
          const alloc = baseShare + (extra > 0 ? 1 : 0);
          if (extra > 0) extra--;
          if (f === 'mcq') mcqTarget = alloc;
          if (f === 'subjective') subjTarget = alloc;
          if (f === 'long-answer') laTarget = alloc;
        }
      }
    }
  }

  // Pull deep base pool strictly from chosen chapters & difficulty
  const rawBasePool = generateMultiChapterTrickyQuiz(
    validChapters,
    seed + 31,
    staticByChapter,
    Math.max(40, totalTarget * 3),
    difficulty
  );

  const usedPrompts = new Set<string>();
  const finalItems: FormattedTrickyQuestion[] = [];

  // 1) Normal MCQs + Assertion-Reason MCQs
  if (mcqTarget > 0) {
    const arCount = mcqTarget >= 3 ? Math.max(1, Math.round(mcqTarget / 3)) : mcqTarget === 2 ? 1 : 0;
    const normalCount = mcqTarget - arCount;

    let addedNormal = 0;
    for (const q of rawBasePool) {
      if (addedNormal >= normalCount) break;
      const norm = q.prompt.trim().toLowerCase();
      if (usedPrompts.has(norm)) continue;
      if (q.options.length === 4) {
        usedPrompts.add(norm);
        finalItems.push({
          ...q,
          id: `fmt-mcq-${q.sourceChapterId}-${addedNormal}-${q.id}`,
          formatType: 'mcq',
          mcqSubKind: 'normal',
          acceptedAnswers: [q.options[q.correctIndex]],
          markCount: 1,
        });
        addedNormal++;
      }
    }

    for (let i = 0; i < arCount; i++) {
      const chId = validChapters[i % validChapters.length];
      let arQ = buildAssertionReasonForChapter(chId, rng, difficulty, i);
      let tries = 0;
      while (usedPrompts.has(arQ.prompt.trim().toLowerCase()) && tries < 6) {
        tries++;
        arQ = buildAssertionReasonForChapter(chId, rng, difficulty, i + tries * validChapters.length);
      }
      usedPrompts.add(arQ.prompt.trim().toLowerCase());
      finalItems.push(arQ);
    }
  }

  // 2) Subjective (Answer-Only)
  if (subjTarget > 0) {
    let addedSubj = 0;
    // Prefer questions that naturally have clean concise numeric/short answers
    const subjectiveCandidates = [
      ...rawBasePool.filter(isGoodSubjectiveCandidate),
      ...rawBasePool.filter((q) => !isGoodSubjectiveCandidate(q)),
    ];
    for (const q of subjectiveCandidates) {
      if (addedSubj >= subjTarget) break;
      const norm = q.prompt.trim().toLowerCase();
      if (usedPrompts.has(norm)) continue;
      usedPrompts.add(norm);
      finalItems.push(toSubjectiveFromQuestion(q, addedSubj));
      addedSubj++;
    }
  }

  // 3) Long Answer (Type or Scan, lenient grading)
  for (let i = 0; i < laTarget; i++) {
    const chId = validChapters[(i + 1) % validChapters.length];
    const laQ = buildLongAnswerForChapter(chId, rng, difficulty, i);
    usedPrompts.add(laQ.prompt.trim().toLowerCase());
    finalItems.push(laQ);
  }

  // 4) Case Studies (Real-Life Scenario + 4 Sub-Questions a, b, c, d)
  for (let i = 0; i < csCount; i++) {
    const chId = validChapters[i % validChapters.length];
    const csQ = buildCaseStudyForChapter(chId, rng, difficulty, i);
    finalItems.push(csQ);
  }

  // Shuffle presentation order so formats are pleasantly interleaved (or keep grouped cleanly? Interleaved keeps mixed quizzes dynamic!)
  const arranged = shuffleArr(finalItems, rng);
  return arranged.map((q, idx) => ({
    ...q,
    questionNumber: idx + 1,
  }));
}

export function getQuestionTotalMarks(q: FormattedTrickyQuestion): number {
  if (q.formatType === 'case-study' && Array.isArray(q.subQuestions)) {
    return q.subQuestions.length;
  }
  return q.markCount || 1;
}

export { pk };
