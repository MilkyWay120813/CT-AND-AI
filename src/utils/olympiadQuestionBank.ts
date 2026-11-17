import { ChapterAssessmentQuestion, ModuleGameChallenge } from '../types/part1Curriculum';
import { ChapterId } from '../types/math';
import { QuizDifficultyLevel } from './quizDifficulty';

function randInt(rng: () => number, min: number, max: number): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return Math.floor(rng() * (hi - lo + 1)) + lo;
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[randInt(rng, 0, arr.length - 1)];
}

function seededRng(seed: number): () => number {
  let s = ((Math.abs(Math.floor(seed)) || 1) % 2147483647) || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shuffleTagged<T>(items: T[], correctIndex: number, rng: () => number): { options: T[]; correctIndex: number } {
  const tagged = items.map((val, idx) => ({ val, ok: idx === correctIndex }));
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [tagged[i], tagged[j]] = [tagged[j], tagged[i]];
  }
  return {
    options: tagged.map((t) => t.val),
    correctIndex: tagged.findIndex((t) => t.ok),
  };
}

function makeChQ(
  id: string,
  type: 'mcq' | 'short-answer',
  prompt: string,
  correctAnswer: string,
  distractors: string[],
  explanation: string,
  moduleRef: string,
  rng: () => number,
  acceptedShortAnswers?: string[]
): Omit<ChapterAssessmentQuestion, 'questionNumber'> {
  const unique = [correctAnswer];
  for (const d of distractors) {
    if (d && !unique.includes(d)) unique.push(d);
  }
  const baseNum = Number(correctAnswer.replace(/[^0-9.-]/g, ''));
  let pad = 1;
  while (unique.length < 4) {
    const cand = Number.isFinite(baseNum)
      ? `${baseNum + (pad % 2 === 0 ? -pad : pad) * 3}`
      : `Option ${pad + 1}`;
    if (!unique.includes(cand)) unique.push(cand);
    pad++;
  }
  const { options, correctIndex } = shuffleTagged(unique.slice(0, 4), 0, rng);
  return {
    id,
    type,
    prompt,
    options,
    correctIndex,
    acceptedShortAnswers: acceptedShortAnswers || [correctAnswer],
    explanation,
    moduleRef,
  };
}

function makeModQ(
  prompt: string,
  clue: string,
  correctAnswer: string,
  distractors: string[],
  explanation: string,
  rng: () => number
): ModuleGameChallenge {
  const unique = [correctAnswer];
  for (const d of distractors) {
    if (d && !unique.includes(d)) unique.push(d);
  }
  const baseNum = Number(correctAnswer.replace(/[^0-9.-]/g, ''));
  let pad = 1;
  while (unique.length < 4) {
    const cand = Number.isFinite(baseNum)
      ? `${baseNum + (pad % 2 === 0 ? -pad : pad) * 2}`
      : `Choice ${pad + 1}`;
    if (!unique.includes(cand)) unique.push(cand);
    pad++;
  }
  const { options, correctIndex } = shuffleTagged(unique.slice(0, 4), 0, rng);
  return {
    prompt,
    clue,
    options,
    correctIndex,
    explanation,
  };
}

function modDigitCyclicity(base: number, exp: number): number {
  const b = ((base % 10) + 10) % 10;
  if (exp === 0) return 1;
  if (b === 0 || b === 1 || b === 5 || b === 6) return b;
  const r = exp % 4;
  const effectiveExp = r === 0 ? 4 : r;
  return Math.pow(b, effectiveExp) % 10;
}

/**
 * Generates genuinely difficulty-calibrated procedural questions for every chapter.
 * - Level 1 (Foundation): friendly mental math, clear single-step concept checks, wide distractors.
 * - Level 3 (Challenger): multi-step reverse reasoning, algebraic constraints, tighter distractors.
 * - Level 4 (Olympiad): AMC-8 / IOQM / PRMO Grade-8 competition caliber problems strictly anchored to each chapter.
 */
export function generateTieredChapterPool(
  chapterId: ChapterId | 'ch8-master-quiz' | 'part2-ch8-master-quiz' | 'cellar-boss',
  rng: () => number,
  difficulty: QuizDifficultyLevel
): Omit<ChapterAssessmentQuestion, 'questionNumber'>[] {
  const pool: Omit<ChapterAssessmentQuestion, 'questionNumber'>[] = [];
  const uid = (tag: string) => `${tag}-d${difficulty}-${randInt(rng, 1000, 999999)}`;

  const includeCh = (target: ChapterId, part: 1 | 2): boolean => {
    if (chapterId === target) return true;
    if (chapterId === 'cellar-boss') return true;
    if (part === 1 && chapterId === 'ch8-master-quiz') return true;
    if (part === 2 && chapterId === 'part2-ch8-master-quiz') return true;
    return false;
  };

  // =========================================================================
  // PART I · CHAPTER 1: A SQUARE AND A CUBE
  // =========================================================================
  if (includeCh('ch1-square-cube', 1)) {
    if (difficulty === 1) {
      const k = randInt(rng, 3, 10);
      const c = randInt(rng, 2, 6);
      const endsBad = pick(rng, [2, 3, 7, 8]);
      const prefix = randInt(rng, 1, 8);
      pool.push(
        makeChQ(
          uid('f-ch1-sq'),
          'mcq',
          `What is the area of a square tile whose side length is ${k} units (${k}²)?`,
          `${k * k}`,
          [`${k * 2}`, `${k + k + k}`, `${(k + 1) * (k + 1)}`],
          `${k} × ${k} = ${k * k}.`,
          'Module 1.1',
          rng
        ),
        makeChQ(
          uid('f-ch1-unit'),
          'mcq',
          `Which number below CANNOT be a perfect square because of its last digit?`,
          `${prefix}${endsBad}`,
          ['16', '25', '49'],
          `Perfect squares only end in 0, 1, 4, 5, 6, or 9 — never ${endsBad}.`,
          'Module 1.2',
          rng
        ),
        makeChQ(
          uid('f-ch1-cube'),
          'short-answer',
          `Find the volume of a ${c} × ${c} × ${c} unit cube (${c}³).`,
          `${c * c * c}`,
          [`${c * c}`, `${c * 3}`, `${c * c * c + 2}`],
          `${c} × ${c} × ${c} = ${c * c * c}.`,
          'Module 1.5',
          rng
        ),
        makeChQ(
          uid('f-ch1-odd'),
          'short-answer',
          `Add the first ${k} odd numbers: 1 + 3 + … + ${2 * k - 1}.`,
          `${k * k}`,
          [`${2 * k}`, `${k * k + 1}`, `${(k - 1) * (k - 1)}`],
          `The sum of the first ${k} odd numbers is ${k}² = ${k * k}.`,
          'Module 1.3',
          rng
        )
      );
    } else if (difficulty === 3) {
      const pMult = pick(rng, [
        { num: 72, mult: 2, sq: 12 },
        { num: 180, mult: 5, sq: 30 },
        { num: 245, mult: 5, sq: 35 },
        { num: 288, mult: 2, sq: 24 },
        { num: 392, mult: 2, sq: 28 },
        { num: 507, mult: 3, sq: 39 },
      ]);
      const cubeNeed = pick(rng, [
        { num: 72, mult: 3, div: 9, cb: 6 },
        { num: 108, mult: 2, div: 4, cb: 6 },
        { num: 256, mult: 2, div: 4, cb: 8 },
        { num: 500, mult: 2, div: 4, cb: 10 },
        { num: 675, mult: 5, div: 25, cb: 15 },
      ]);
      const b = randInt(rng, 14, 34);
      const c = randInt(rng, 4, 9);
      const diff = (b + c) * (b + c) - b * b;

      pool.push(
        makeChQ(
          uid('c-ch1-makingsq'),
          'short-answer',
          `Find the smallest positive integer k such that ${pMult.num} × k becomes a perfect square.`,
          `${pMult.mult}`,
          [`${pMult.mult * 2}`, `${pMult.mult + 1}`, `${pMult.sq}`],
          `Factoring ${pMult.num} leaves an unpaired prime factor of ${pMult.mult}; multiplying by ${pMult.mult} produces ${pMult.sq}².`,
          'Module 1.4',
          rng
        ),
        makeChQ(
          uid('c-ch1-makingcb'),
          'short-answer',
          `What is the smallest positive integer d by which ${cubeNeed.num} must be DIVIDED so the quotient is a perfect cube?`,
          `${cubeNeed.div}`,
          [`${cubeNeed.mult}`, `${cubeNeed.div * 2}`, `${cubeNeed.cb}`],
          `Removing excess prime factors outside triplets from ${cubeNeed.num} requires dividing by ${cubeNeed.div}.`,
          'Module 1.7',
          rng
        ),
        makeChQ(
          uid('c-ch1-oddgap'),
          'short-answer',
          `The sum of consecutive odd numbers from ${2 * b + 1} up to ${2 * (b + c) - 1} equals ${diff}. If there are ${c} odd terms, what is √(${b * b + diff})?`,
          `${b + c}`,
          [`${b}`, `${b + c + 1}`, `${b + c - 1}`],
          `${b}² + ${diff} = (${b + c})², so √(${b * b + diff}) = ${b + c}.`,
          'Module 1.3',
          rng
        ),
        makeChQ(
          uid('c-ch1-taxi'),
          'short-answer',
          `Hardy-Ramanujan number 1729 equals 1³ + 12³ and 9³ + 10³. Scaling by ${c}³ gives (${c})³ + x³ = (${9 * c})³ + (${10 * c})³. Find x.`,
          `${12 * c}`,
          [`${10 * c}`, `${12 * c - 2}`, `${12 * c + 2}`],
          `Scaling 1³ + 12³ by ${c}³ gives ${c}³ + (${12 * c})³ = (${9 * c})³ + (${10 * c})³.`,
          'Module 1.6',
          rng
        )
      );
    } else if (difficulty === 4) {
      // Olympiad 1: Smallest k making N * k BOTH a perfect square AND a perfect cube (a 6th power!)
      const a = randInt(rng, 1, 5);
      const b = randInt(rng, 1, 4);
      const nVal = Math.pow(2, a) * Math.pow(3, b);
      const need2 = (6 - (a % 6)) % 6;
      const need3 = (6 - (b % 6)) % 6;
      const kSixth = Math.pow(2, need2) * Math.pow(3, need3);

      // Olympiad 2: Sum of cubes 1³ + 2³ + ... + k³ = (k(k+1)/2)² reverse solve
      const kSum = randInt(rng, 7, 24);
      const tri = (kSum * (kSum + 1)) / 2;
      const cubeSeriesSum = tri * tri;

      // Olympiad 3: Difference of two squares a² - b² = D with a - b = step
      const bSq = randInt(rng, 14, 48);
      const stepSq = pick(rng, [3, 5, 7, 9]);
      const aSq = bSq + stepSq;
      const diffSq = aSq * aSq - bSq * bSq;

      // Olympiad 4: Lockers ≤ N divisible by prime p that remain OPEN
      const pDiv = pick(rng, [3, 5, 7]);
      const rootCap = pDiv * randInt(rng, 5, 11) + randInt(rng, 0, pDiv - 1);
      const nLockers = rootCap * rootCap + randInt(rng, 5, 25);
      const openDivCount = Math.floor(Math.sqrt(nLockers) / pDiv);

      // Olympiad 5: Taxicab modular / parity + exact ∛(a³ + b³) evaluation
      const mTax = randInt(rng, 2, 9);
      const scaledTax = 1729 * mTax * mTax * mTax;

      pool.push(
        makeChQ(
          uid('o-ch1-sixth'),
          'short-answer',
          `Find the smallest positive integer k such that ${nVal.toLocaleString()} × k is simultaneously BOTH a perfect square AND a perfect cube.`,
          `${kSixth}`,
          [`${Math.pow(2, (2 - (a % 2)) % 2) * Math.pow(3, (2 - (b % 2)) % 2)}`, `${kSixth * 2}`, `${Math.max(2, kSixth / 2)}`],
          `A number that is both a square and a cube must be a 6th power. ${nVal} = 2^${a} × 3^${b}, so we multiply by 2^${need2} × 3^${need3} = ${kSixth}.`,
          'Module 1.7',
          rng
        ),
        makeChQ(
          uid('o-ch1-cubesum'),
          'short-answer',
          `Given the identity 1³ + 2³ + 3³ + … + k³ = [k(k + 1)/2]², find k if 1³ + 2³ + … + k³ = ${cubeSeriesSum.toLocaleString()}.`,
          `${kSum}`,
          [`${kSum - 1}`, `${kSum + 1}`, `${kSum + 2}`],
          `Taking √${cubeSeriesSum.toLocaleString()} = ${tri}, solve k(k + 1)/2 = ${tri} ⇒ k(k + 1) = ${2 * tri}, giving k = ${kSum}.`,
          'Module 1.5',
          rng
        ),
        makeChQ(
          uid('o-ch1-diffsq'),
          'short-answer',
          `Two positive integers a and b satisfy a − b = ${stepSq} and a² − b² = ${diffSq.toLocaleString()}. What is the LARGER integer a?`,
          `${aSq}`,
          [`${bSq}`, `${aSq + 1}`, `${aSq - 2}`],
          `Using a² − b² = (a − b)(a + b), we get a + b = ${diffSq} ÷ ${stepSq} = ${aSq + bSq}. Adding a − b = ${stepSq} gives 2a = ${2 * aSq} ⇒ a = ${aSq}.`,
          'Module 1.3',
          rng
        ),
        makeChQ(
          uid('o-ch1-lockersp'),
          'short-answer',
          `In a hallway of ${nLockers.toLocaleString()} lockers toggled from 1 to ${nLockers.toLocaleString()}, how many OPEN lockers have locker numbers divisible by ${pDiv}?`,
          `${openDivCount}`,
          [`${openDivCount + 1}`, `${Math.max(1, openDivCount - 1)}`, `${Math.floor(nLockers / (pDiv * pDiv))}`],
          `Open lockers are perfect squares k² ≤ ${nLockers} (so k ≤ ${Math.floor(Math.sqrt(nLockers))}). For ${pDiv} to divide k², ${pDiv} must divide k, giving ⌊${Math.floor(Math.sqrt(nLockers))}/${pDiv}⌋ = ${openDivCount}.`,
          'Module 1.1',
          rng
        ),
        makeChQ(
          uid('o-ch1-taximult'),
          'short-answer',
          `The number ${scaledTax.toLocaleString()} = (${mTax})³ × 1729 can be written as a³ + b³ = c³ + d³ with a < c < d < b. What is the largest base b?`,
          `${12 * mTax}`,
          [`${10 * mTax}`, `${9 * mTax}`, `${12 * mTax + 1}`],
          `Scaling 1729 = 1³ + 12³ = 9³ + 10³ by ${mTax}³ gives ${mTax}³ + (${12 * mTax})³ = (${9 * mTax})³ + (${10 * mTax})³, so b = ${12 * mTax}.`,
          'Module 1.6',
          rng
        )
      );
    }
  }

  // =========================================================================
  // PART I · CHAPTER 2: POWER PLAY
  // =========================================================================
  if (includeCh('ch2-power-play', 1)) {
    if (difficulty === 1) {
      const e1 = randInt(rng, 2, 6);
      const e2 = randInt(rng, 2, 5);
      const base = pick(rng, [2, 3, 5, 7]);
      const baseZero = randInt(rng, 11, 98);
      const addPow = pick(rng, [
        { label: '2²', val: 4 },
        { label: '2³', val: 8 },
        { label: '3²', val: 9 },
        { label: '4²', val: 16 },
        { label: '5²', val: 25 },
      ]);
      const negBase = pick(rng, [2, 3, 4, 5, 6, 7, 8, 9]);
      const negExp = randInt(rng, 2, 5);
      pool.push(
        makeChQ(
          uid('f-ch2-prod'),
          'mcq',
          `Simplify ${base}^${e1} × ${base}^${e2} using the law of exponents.`,
          `${base}^${e1 + e2}`,
          [`${base}^${e1 * e2}`, `${base * base}^${e1 + e2}`, `${base}^${Math.abs(e1 - e2) || 1}`],
          `When multiplying with the same base, add exponents: ${e1} + ${e2} = ${e1 + e2}.`,
          'Module 2.3',
          rng
        ),
        makeChQ(
          uid('f-ch2-zero'),
          'short-answer',
          `What is the exact value of (${baseZero})⁰ + ${addPow.label}?`,
          `${1 + addPow.val}`,
          [`${addPow.val}`, `${addPow.val + 2}`, `0`],
          `Any non-zero number to the 0th power is 1, so 1 + ${addPow.val} = ${1 + addPow.val}.`,
          'Module 2.5',
          rng
        ),
        makeChQ(
          uid('f-ch2-neg'),
          'mcq',
          `Write 1 / ${negBase}^${negExp} using a negative exponent.`,
          `${negBase}^(−${negExp})`,
          [`−${negBase}^${negExp}`, `${negExp}^(−${negBase})`, `${negBase}⁻¹`],
          `1 / a^n = a^(−n), so 1 / ${negBase}^${negExp} = ${negBase}^(−${negExp}).`,
          'Module 2.5',
          rng
        )
      );
    } else if (difficulty === 3) {
      const xAns = randInt(rng, 3, 9);
      const pShift = randInt(rng, 1, 4);
      const rhsExp = 2 * xAns + pShift;
      const dSmall = randInt(rng, 3, 12);
      const invK = randInt(rng, 1, 6);
      // (1/(3k) + 1/(6k))^-1 = (3/(6k))^-1 = 2k!
      pool.push(
        makeChQ(
          uid('c-ch2-solve4'),
          'short-answer',
          `Solve for x in: 4^x × 2^${pShift} = 2^${rhsExp}.`,
          `${xAns}`,
          [`${xAns + 1}`, `${xAns - 1}`, `${rhsExp - pShift}`],
          `Since 4^x = 2^(2x), we get 2x + ${pShift} = ${rhsExp} ⇒ 2x = ${2 * xAns} ⇒ x = ${xAns}.`,
          'Module 2.4',
          rng
        ),
        makeChQ(
          uid('c-ch2-pair10'),
          'short-answer',
          `How many trailing zeros are at the end of 2^${dSmall + 4} × 5^${dSmall}?`,
          `${dSmall}`,
          [`${dSmall + 4}`, `${dSmall * 2}`, `${dSmall - 1}`],
          `Each 2 × 5 pair creates one 10. With ${dSmall} factors of 5 and more 2s, there are ${dSmall} trailing zeros.`,
          'Module 2.7',
          rng
        ),
        makeChQ(
          uid('c-ch2-negfrac'),
          'short-answer',
          `Evaluate: (${3 * invK}⁻¹ + ${6 * invK}⁻¹)⁻¹.`,
          `${2 * invK}`,
          [`${9 * invK}`, `${invK}`, `${3 * invK}`],
          `1/${3 * invK} + 1/${6 * invK} = 3/${6 * invK} = 1/${2 * invK}. Taking its reciprocal gives ${2 * invK}.`,
          'Module 2.5',
          rng
        )
      );
    } else if (difficulty === 4) {
      // Olympiad 1: Multi-base linear exponential equation 4^(x+p) * 8^(x-q) = 2^T
      const xVal = randInt(rng, 4, 11);
      const p = randInt(rng, 1, 4);
      const q = randInt(rng, 1, 3);
      const rhs = 2 * (xVal + p) + 3 * (xVal - q);

      // Olympiad 2: Digit count of 4^p * 5^(2p + d)
      const pPairs = randInt(rng, 8, 17);
      const dRem = randInt(rng, 2, 4); // 5^2=25 (2d), 5^3=125 (3d), 5^4=625 (3d)
      const leadVal = Math.pow(5, dRem);
      const digitCount = String(leadVal).length + 2 * pPairs;

      // Olympiad 3: Units digit cyclicity of a^N + b^M
      const baseA = pick(rng, [2, 3, 7, 8]);
      const baseB = pick(rng, [2, 3, 7, 8]);
      const expN = randInt(rng, 2023, 2099);
      const expM = randInt(rng, 2023, 2099);
      const uAns = (modDigitCyclicity(baseA, expN) + modDigitCyclicity(baseB, expM)) % 10;

      // Olympiad 4: Compare huge powers via common factor exponent
      const kScale = randInt(rng, 25, 65);

      // Olympiad 5: Solve (27^a / 9^b) = 3^k in reverse
      const aExp = randInt(rng, 5, 11);
      const kDiff = randInt(rng, 3, 9);
      // 3^(3a - 2b) = 3^k => choose b so k = 3a - 2b
      const bExp = randInt(rng, 2, Math.floor((3 * aExp - 2) / 2));
      const netK = 3 * aExp - 2 * bExp;

      pool.push(
        makeChQ(
          uid('o-ch2-multibase'),
          'short-answer',
          `Solve for the integer x: 4^(x + ${p}) × 8^(x − ${q}) = 2^${rhs}.`,
          `${xVal}`,
          [`${xVal - 1}`, `${xVal + 1}`, `${xVal + 2}`],
          `Convert to base 2: 2^(2x + ${2 * p}) × 2^(3x − ${3 * q}) = 2^${rhs} ⇒ 5x + ${2 * p - 3 * q} = ${rhs} ⇒ x = ${xVal}.`,
          'Module 2.4',
          rng
        ),
        makeChQ(
          uid('o-ch2-digits'),
          'short-answer',
          `How many digits are in the exact decimal expansion of 4^${pPairs} × 5^${2 * pPairs + dRem}?`,
          `${digitCount}`,
          [`${2 * pPairs + dRem}`, `${digitCount - 1}`, `${digitCount + 1}`],
          `4^${pPairs} × 5^${2 * pPairs + dRem} = 2^${2 * pPairs} × 5^${2 * pPairs} × 5^${dRem} = ${leadVal} × 10^${2 * pPairs}, which has ${String(leadVal).length} + ${2 * pPairs} = ${digitCount} digits.`,
          'Module 2.7',
          rng
        ),
        makeChQ(
          uid('o-ch2-unit'),
          'short-answer',
          `What is the units digit of (${baseA}^${expN} + ${baseB}^${expM})?`,
          `${uAns}`,
          [`${(uAns + 2) % 10}`, `${(uAns + 4) % 10}`, `${(uAns + 5) % 10}`],
          `Powers of ${baseA} and ${baseB} repeat every 4 exponents: ${baseA}^${expN} ends in ${modDigitCyclicity(baseA, expN)} and ${baseB}^${expM} ends in ${modDigitCyclicity(baseB, expM)}, summing to units digit ${uAns}.`,
          'Module 2.2',
          rng
        ),
        makeChQ(
          uid('o-ch2-compare'),
          'mcq',
          `Which of the following colossal numbers has the GREATEST value?`,
          `3^${8 * kScale}`,
          [`2^${12 * kScale}`, `5^${4 * kScale}`, `7^${3 * kScale}`],
          `Rewrite each as (...)^${kScale}: 2^12 = 4096, 3^8 = 6561, 5^4 = 625, 7^3 = 343. Clearly 3^${8 * kScale} = 6561^${kScale} is largest.`,
          'Module 2.7',
          rng
        ),
        makeChQ(
          uid('o-ch2-nested'),
          'short-answer',
          `If (27^${aExp} ÷ 9^b) × 3⁻¹ = 3^${netK - 1}, find the integer value of b.`,
          `${bExp}`,
          [`${bExp + 1}`, `${Math.max(1, bExp - 1)}`, `${aExp}`],
          `Rewrite in base 3: 3^(3×${aExp} − 2b − 1) = 3^${netK - 1} ⇒ ${3 * aExp} − 2b = ${netK} ⇒ b = ${bExp}.`,
          'Module 2.3',
          rng
        )
      );
    }
  }

  // =========================================================================
  // PART I · CHAPTER 3: A STORY OF NUMBERS
  // =========================================================================
  if (includeCh('ch3-story-numbers', 1)) {
    if (difficulty === 1) {
      const k = randInt(rng, 1, 4);
      const r = randInt(rng, 0, 4);
      const rom = pick(rng, [
        { num: 4, big: 'V (5)', sym: 'IV', sub: '1 from 5', wrong: ['IIII', 'VI', 'IX'] },
        { num: 9, big: 'X (10)', sym: 'IX', sub: '1 from 10', wrong: ['XI', 'VIIII', 'IV'] },
        { num: 40, big: 'L (50)', sym: 'XL', sub: '10 from 50', wrong: ['LX', 'XXXX', 'XC'] },
        { num: 90, big: 'C (100)', sym: 'XC', sub: '10 from 100', wrong: ['CX', 'LXXXX', 'XL'] },
        { num: 400, big: 'D (500)', sym: 'CD', sub: '100 from 500', wrong: ['DC', 'CCCC', 'CM'] },
        { num: 900, big: 'M (1000)', sym: 'CM', sub: '100 from 1000', wrong: ['MC', 'DCCCC', 'CD'] },
      ]);
      const hDig = randInt(rng, 1, 9);
      const oDig = randInt(rng, 1, 9);
      const b4a = randInt(rng, 1, 3);
      const b4b = randInt(rng, 0, 3);
      pool.push(
        makeChQ(
          uid('f-ch3-base5'),
          'short-answer',
          `In Base-5, what decimal number is ${k} groups of 5 plus ${r} ones, written (${k}${r})₅?`,
          `${k * 5 + r}`,
          [`${k + r}`, `${k * 10 + r}`, `${k * 5 + r + 5}`],
          `(${k}${r})₅ = ${k} × 5 + ${r} = ${k * 5 + r}.`,
          'Module 3.5',
          rng
        ),
        makeChQ(
          uid('f-ch3-base4'),
          'short-answer',
          `In Base-4, evaluate (${b4a}${b4b})₄ in standard decimal.`,
          `${b4a * 4 + b4b}`,
          [`${b4a * 10 + b4b}`, `${b4a + b4b}`, `${b4a * 4 + b4b + 4}`],
          `(${b4a}${b4b})₄ = ${b4a} × 4 + ${b4b} = ${b4a * 4 + b4b}.`,
          'Module 3.5',
          rng
        ),
        makeChQ(
          uid('f-ch3-roman'),
          'mcq',
          `Which Roman numeral uses subtraction (${rom.sub}) to represent ${rom.num}?`,
          rom.sym,
          rom.wrong,
          `Placing the smaller symbol before ${rom.big} subtracts it to make ${rom.num}.`,
          'Module 3.4',
          rng
        ),
        makeChQ(
          uid('f-ch3-zero'),
          'mcq',
          `In the Hindu decimal system, what crucial role does zero (0) play in ${hDig}0${oDig} vs ${hDig}${oDig}?`,
          `A place-holder showing zero tens`,
          [`Multiplying ${hDig} by ${oDig}`, `Adding 10 to ${oDig}`, `Deleting the hundreds place`],
          `Zero holds the empty tens column so ${hDig} stays in the hundreds place.`,
          'Module 3.7',
          rng
        )
      );
    } else if (difficulty === 3) {
      const decTarget = randInt(rng, 30, 120);
      const b5a = Math.floor(decTarget / 25);
      const b5b = Math.floor((decTarget % 25) / 5);
      const b5c = decTarget % 5;
      const babA = randInt(rng, 2, 7);
      const babB = randInt(rng, 35, 55);
      const babC = randInt(rng, 18, 45);
      const babSumDec = (babA + 1) * 60 + (babB + babC);
      const rPair = pick(rng, [
        { expr: 'CDXLIV + CMXCIX', ans: 1443, a: 444, b: 999 },
        { expr: 'DCCXL + CDXXV', ans: 1165, a: 740, b: 425 },
        { expr: 'CMLIV + DXLVII', ans: 1501, a: 954, b: 547 },
        { expr: 'DCXCII + CDXLIV', ans: 1136, a: 692, b: 444 },
        { expr: 'CMXL + DCCLXV', ans: 1705, a: 940, b: 765 },
        { expr: 'DLXXIV + CMXIX', ans: 1493, a: 574, b: 919 },
      ]);
      pool.push(
        makeChQ(
          uid('c-ch3-to5'),
          'short-answer',
          `Convert decimal ${decTarget} into Base-5 notation (write digits only, e.g. 342).`,
          `${b5a}${b5b}${b5c}`,
          [`${b5a}${b5c}${b5b}`, `${b5a + 1}${b5b}${b5c}`, `${decTarget}`],
          `${decTarget} = ${b5a}×25 + ${b5b}×5 + ${b5c}×1 = (${b5a}${b5b}${b5c})₅.`,
          'Module 3.5',
          rng
        ),
        makeChQ(
          uid('c-ch3-babadd'),
          'short-answer',
          `In Mesopotamian Base-60, add [${babA} ; ${babB}]₆₀ + [1 ; ${babC}]₆₀ and express the total in DECIMAL.`,
          `${babSumDec}`,
          [`${babSumDec - 60}`, `${babSumDec + 60}`, `${babA * 100 + babB + babC}`],
          `[${babA};${babB}]₆₀ + [1;${babC}]₆₀ = ${babA + 1}×60 + ${babB + babC} = ${babSumDec}.`,
          'Module 3.6',
          rng
        ),
        makeChQ(
          uid('c-ch3-romanadd'),
          'short-answer',
          `Convert Roman (${rPair.expr}) into a Hindu-Arabic decimal integer.`,
          `${rPair.ans}`,
          [`${rPair.ans + 10}`, `${rPair.ans - 100}`, `${rPair.ans + 100}`],
          `${rPair.expr} = ${rPair.a} + ${rPair.b} = ${rPair.ans}.`,
          'Module 3.4',
          rng
        )
      );
    } else if (difficulty === 4) {
      // Olympiad 1: Unknown base b in (1 d1 d0)_b = decVal
      const baseB = randInt(rng, 6, 13);
      const d1 = randInt(rng, 1, baseB - 1);
      const d0 = randInt(rng, 1, baseB - 1);
      const decVal = baseB * baseB + d1 * baseB + d0;

      // Olympiad 2: Cross-base equation (x d)_6 = (q y)_8 -> find missing digit y
      const xB6 = randInt(rng, 2, 5);
      const dB6 = randInt(rng, 0, 5);
      const vCross = xB6 * 6 + dB6;
      const qB8 = Math.floor(vCross / 8);
      const yB8 = vCross % 8;

      // Olympiad 3: Mayan calendar-vigesimal (1, 20, 360, 7200)
      const c360 = randInt(rng, 2, 7);
      const c20 = randInt(rng, 4, 17);
      const c1 = randInt(rng, 3, 19);
      const mayanTotal = c360 * 360 + c20 * 20 + c1;

      // Olympiad 4: Base-60 borrow subtraction
      const hiA = randInt(rng, 4, 9);
      const loA = randInt(rng, 8, 22);
      const hiB = randInt(rng, 1, hiA - 2);
      const loB = randInt(rng, 38, 55);
      const ansDec60 = (hiA * 60 + loA) - (hiB * 60 + loB);

      pool.push(
        makeChQ(
          uid('o-ch3-findbase'),
          'short-answer',
          `If the positional numeral (1${d1.toString(16).toUpperCase()}${d0.toString(16).toUpperCase()})_b represents decimal ${decVal} (where digits are in single-column places < b), find base b.`,
          `${baseB}`,
          [`${baseB + 1}`, `${baseB - 1}`, `${baseB + 2}`],
          `b² + ${d1}b + ${d0} = ${decVal} ⇒ testing integers > ${Math.max(d1, d0)} yields b = ${baseB} (${baseB}² + ${d1}×${baseB} + ${d0} = ${decVal}).`,
          'Module 3.5',
          rng
        ),
        makeChQ(
          uid('o-ch3-crossbase'),
          'short-answer',
          `The same natural number is written (${xB6}${dB6})₆ in Base-6 and (${qB8}y)₈ in Base-8. What is the missing Base-8 digit y?`,
          `${yB8}`,
          [`${(yB8 + 2) % 8}`, `${(yB8 + 1) % 8}`, `${(yB8 + 3) % 8}`],
          `(${xB6}${dB6})₆ = ${xB6}×6 + ${dB6} = ${vCross}. Converting ${vCross} to Base-8 gives ${qB8}×8 + ${yB8}, so y = ${yB8}.`,
          'Module 3.5',
          rng
        ),
        makeChQ(
          uid('o-ch3-mayan'),
          'short-answer',
          `In the classic Mayan system (place values 1, 20, and 18×20 = 360), evaluate the 3-level numeral [${c360} | ${c20} | ${c1}] in decimal.`,
          `${mayanTotal}`,
          [`${c360 * 400 + c20 * 20 + c1}`, `${mayanTotal - 40}`, `${mayanTotal + 20}`],
          `Unlike pure Base-20, the 3rd Mayan tier has weight 360: ${c360}×360 + ${c20}×20 + ${c1} = ${mayanTotal}.`,
          'Module 3.6',
          rng
        ),
        makeChQ(
          uid('o-ch3-babdiff'),
          'short-answer',
          `Subtract two Mesopotamian Base-60 numbers: [${hiA} ; ${loA}]₆₀ − [${hiB} ; ${loB}]₆₀. Express the difference as a single decimal number.`,
          `${ansDec60}`,
          [`${ansDec60 + 60}`, `${ansDec60 - 60}`, `${(hiA - hiB) * 100 + (loA - loB)}`],
          `(${hiA}×60 + ${loA}) − (${hiB}×60 + ${loB}) = ${hiA * 60 + loA} − ${hiB * 60 + loB} = ${ansDec60}.`,
          'Module 3.6',
          rng
        )
      );
    }
  }

  // =========================================================================
  // PART I · CHAPTER 4: QUADRILATERALS
  // =========================================================================
  if (includeCh('ch4-quadrilaterals', 1)) {
    if (difficulty === 1) {
      const side = randInt(rng, 5, 12);
      const a1 = randInt(rng, 70, 95);
      pool.push(
        makeChQ(
          uid('f-ch4-sum'),
          'short-answer',
          `Three angles of a quadrilateral are 90°, 90°, and ${a1}°. Find the fourth angle (in degrees).`,
          `${180 - a1}`,
          [`${a1}`, `${360 - a1}`, `${90}`],
          `360 − (90 + 90 + ${a1}) = ${180 - a1}°.`,
          'Module 4.4',
          rng
        ),
        makeChQ(
          uid('f-ch4-diag'),
          'short-answer',
          `In a square of diagonal ${2 * side} cm, how long is the OTHER diagonal (in cm)?`,
          `${2 * side}`,
          [`${side}`, `${4 * side}`, `${side + 2}`],
          `Both diagonals of a rectangle or square are equal in length (${2 * side} cm).`,
          'Module 4.3',
          rng
        ),
        makeChQ(
          uid('f-ch4-rhombperim'),
          'short-answer',
          `A rhombus has side length ${side} cm. Find its perimeter (in cm).`,
          `${4 * side}`,
          [`${2 * side}`, `${side * side}`, `${3 * side}`],
          `All 4 sides of a rhombus are equal, so perimeter = 4 × ${side} = ${4 * side} cm.`,
          'Module 4.6',
          rng
        )
      );
    } else if (difficulty === 3) {
      // Angle ratio p : q in parallelogram (sum divides 180)
      const [r1, r2] = pick(rng, [[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [2, 7], [4, 5], [5, 7]]);
      const angSmall = (180 * r1) / (r1 + r2);
      const angLarge = 180 - angSmall;
      const diffSides = randInt(rng, 4, 11);
      const bSide = randInt(rng, 8, 18);
      const aSide = bSide + diffSides;
      const perim = 2 * (aSide + bSide);
      const kitePreset = pick(rng, [
        { pairSum: 220, rA: 2, rB: 5, ans: 100, small: 40 },
        { pairSum: 200, rA: 3, rB: 5, ans: 100, small: 60 },
        { pairSum: 180, rA: 4, rB: 5, ans: 100, small: 80 },
        { pairSum: 240, rA: 1, rB: 3, ans: 90, small: 30 },
        { pairSum: 210, rA: 2, rB: 3, ans: 90, small: 60 },
      ]);

      pool.push(
        makeChQ(
          uid('c-ch4-ratioang'),
          'short-answer',
          `Two adjacent angles of a parallelogram are in the ratio ${r1} : ${r2}. Find the LARGER angle (in degrees).`,
          `${angLarge}`,
          [`${angSmall}`, `${angLarge - 10}`, `${180 - angLarge}`],
          `Adjacent angles sum to 180°: 180° × (${r2}/${r1 + r2}) = ${angLarge}°.`,
          'Module 4.5',
          rng
        ),
        makeChQ(
          uid('c-ch4-perimside'),
          'short-answer',
          `A parallelogram has perimeter ${perim} cm, and its longer side exceeds its shorter side by ${diffSides} cm. Find the length of the LONGER side (in cm).`,
          `${aSide}`,
          [`${bSide}`, `${perim / 4}`, `${aSide + 2}`],
          `Semi-perimeter a + b = ${perim / 2} and a − b = ${diffSides}, so a = (${perim / 2} + ${diffSides}) ÷ 2 = ${aSide} cm.`,
          'Module 4.5',
          rng
        ),
        makeChQ(
          uid('c-ch4-kite'),
          'short-answer',
          `A symmetric kite has its two congruent side angles summing to ${kitePreset.pairSum}°, and its symmetry-axis angles have ratio ${kitePreset.rA} : ${kitePreset.rB}. Find the larger axis angle (in degrees).`,
          `${kitePreset.ans}`,
          [`${kitePreset.small}`, `${kitePreset.ans + 10}`, `${360 - kitePreset.pairSum}`],
          `The two axis angles sum to 360° − ${kitePreset.pairSum}° = ${360 - kitePreset.pairSum}°. Splitting in ratio ${kitePreset.rA}:${kitePreset.rB} gives larger angle ${kitePreset.ans}°.`,
          'Module 4.7',
          rng
        )
      );
    } else if (difficulty === 4) {
      // Olympiad 1: Bisectors of adjacent angles C and D meet at P => ∠CPD = 1/2 (∠A + ∠B)
      const angA = randInt(rng, 58, 118);
      const angB = angA + 2 * randInt(rng, 4, 19);
      const angAPB = (angA + angB) / 2;

      // Olympiad 2: Rhombus altitude from clean scaled triples yielding exact integer altitudes
      const rTri = pick(rng, [
        { h1: 15, h2: 20, s: 25, alt: 24 },
        { h1: 30, h2: 40, s: 50, alt: 48 },
        { h1: 45, h2: 60, s: 75, alt: 72 },
        { h1: 65, h2: 156, s: 169, alt: 120 },
        { h1: 60, h2: 80, s: 100, alt: 96 },
      ]);
      const h1 = rTri.h1;
      const h2 = rTri.h2;
      const sideR = rTri.s;
      const altR = rTri.alt;

      // Olympiad 3: Varignon midpoint quadrilateral perimeter = d1 + d2
      const d1 = randInt(rng, 14, 34);
      const d2 = randInt(rng, 16, 38);
      const varPerim = d1 + d2;

      // Olympiad 4: Exterior + algebraic angle chase 2x, 3x+10, ...
      const xDeg = randInt(rng, 18, 28);
      const a1 = 2 * xDeg;
      const a2 = 3 * xDeg;
      const a3 = 4 * xDeg;
      const a4 = 360 - 9 * xDeg;

      pool.push(
        makeChQ(
          uid('o-ch4-bisector'),
          'short-answer',
          `In quadrilateral ABCD, ∠A = ${angA}° and ∠B = ${angB}°. If the internal angle bisectors of ∠C and ∠D intersect at point P inside ABCD, find ∠CPD (in degrees).`,
          `${angAPB}`,
          [`${180 - angAPB}`, `${angAPB + 10}`, `${Math.abs(angB - angA)}`],
          `In △CPD, ∠CPD = 180° − ½(∠C + ∠D) = 180° − ½(360° − ∠A − ∠B) = ½(∠A + ∠B) = ½(${angA + angB}°) = ${angAPB}°.`,
          'Module 4.4',
          rng
        ),
        makeChQ(
          uid('o-ch4-rhombusalt'),
          'short-answer',
          `A rhombus has diagonals of lengths ${2 * h1} cm and ${2 * h2} cm. Find the perpendicular altitude (height) of this rhombus (in cm).`,
          `${altR}`,
          [`${sideR}`, `${h1 + h2}`, `${altR - 2}`],
          `Side = √(${h1}² + ${h2}²) = ${sideR} cm. Area = ½(${2 * h1})(${2 * h2}) = ${2 * h1 * h2} cm². Dividing Area by base ${sideR} gives altitude = ${altR} cm.`,
          'Module 4.6',
          rng
        ),
        makeChQ(
          uid('o-ch4-varignon'),
          'short-answer',
          `A convex quadrilateral has diagonals of lengths ${d1} cm and ${d2} cm. Joining the midpoints of all four consecutive sides forms an inner parallelogram. What is the PERIMETER of this inner midpoint parallelogram (in cm)?`,
          `${varPerim}`,
          [`${Math.round(varPerim / 2)}`, `${2 * varPerim}`, `${d1 * 2}`],
          `By the midpoint theorem (Varignon), opposite pairs of the inner parallelogram are parallel to and half of each diagonal, so perimeter = 2(½ d₁ + ½ d₂) = d₁ + d₂ = ${varPerim} cm.`,
          'Module 4.5',
          rng
        ),
        makeChQ(
          uid('o-ch4-chase'),
          'short-answer',
          `Four interior angles of a quadrilateral are 2x°, 3x°, 4x°, and ${a4}°. Find the measure of the LARGEST angle among the four (in degrees).`,
          `${Math.max(a3, a4)}`,
          [`${a1}`, `${xDeg}`, `${a2}`],
          `9x + ${a4} = 360 ⇒ 9x = ${9 * xDeg} ⇒ x = ${xDeg}. The angles are ${a1}°, ${a2}°, ${a3}°, and ${a4}°; largest = ${Math.max(a3, a4)}°.`,
          'Module 4.4',
          rng
        )
      );
    }
  }

  // =========================================================================
  // PART I · CHAPTER 5: NUMBER PLAY
  // =========================================================================
  if (includeCh('ch5-number-play', 1)) {
    if (difficulty === 1) {
      const a = randInt(rng, 1, 8);
      const x = randInt(rng, 1, 8);
      const ans3 = (3 - ((a + x) % 3)) % 3 || 3;
      const d1 = randInt(rng, 1, 8);
      const d2 = randInt(rng, 1, 8);
      const rem9 = (d1 + 4 + d2) % 9;
      const ans9 = (9 - rem9) % 9 || 9;
      const parityQ = pick(rng, [
        { q: `The sum of ANY two consecutive integers (like n and n + 1) is always:`, ans: `Odd`, wrong: [`Even`, `Divisible by 4`, `Zero`], exp: `Even + Odd = Odd always.` },
        { q: `The sum of ANY two odd integers is always:`, ans: `Even`, wrong: [`Odd`, `Prime`, `Divisible by 3`], exp: `(2a+1) + (2b+1) = 2(a+b+1), which is always Even.` },
        { q: `The product of ANY two odd integers is always:`, ans: `Odd`, wrong: [`Even`, `Multiple of 10`, `Zero`], exp: `Without a factor of 2 in either factor, the product stays Odd.` },
      ]);
      pool.push(
        makeChQ(
          uid('f-ch5-div3'),
          'short-answer',
          `What smallest non-zero digit d makes the 3-digit number ${a}${x}d divisible by 3?`,
          `${ans3}`,
          [`${(ans3 % 9) + 1}`, `${((ans3 + 3) % 9) + 1}`, `8`],
          `Digits ${a} + ${x} + d must sum to a multiple of 3, giving d = ${ans3}.`,
          'Module 5.5',
          rng
        ),
        makeChQ(
          uid('f-ch5-parity'),
          'mcq',
          parityQ.q,
          parityQ.ans,
          parityQ.wrong,
          parityQ.exp,
          'Module 5.1',
          rng
        ),
        makeChQ(
          uid('f-ch5-div9'),
          'short-answer',
          `Find the smallest non-zero digit X so that ${d1}4${d2}X is divisible by 9.`,
          `${ans9}`,
          [`${(ans9 % 9) + 1}`, `${((ans9 + 2) % 9) + 1}`, `${((ans9 + 5) % 9) + 1}`],
          `${d1} + 4 + ${d2} = ${d1 + 4 + d2}. Adding X = ${ans9} reaches a multiple of 9.`,
          'Module 5.5',
          rng
        )
      );
    } else if (difficulty === 3) {
      // Unique digit cryptarithm AB + BA = 11 * S
      const sumAB = randInt(rng, 11, 16);
      const ansRev = 11 * sumAB;
      const p1 = randInt(rng, 4, 8);
      const p2 = randInt(rng, 1, 5);
      const p4 = randInt(rng, 1, 5);
      const p5 = randInt(rng, 2, 6);
      const xValid = ((11 - ((p1 - p2 - p4 + p5) % 11) + 11) % 11) % 11;
      const p5Fixed = xValid <= 9 ? p5 : ((p5 + (11 - xValid)) % 10);
      const targetX11 = (((p2 + p4 - p1 - p5Fixed) % 11) + 11) % 11;
      const ma = randInt(rng, 22, 68);
      const mb = randInt(rng, 23, 74);
      const mc = randInt(rng, 15, 59);
      const exactMod9 = (ma * mb + mc) % 9;

      pool.push(
        makeChQ(
          uid('c-ch5-revab'),
          'short-answer',
          `For non-zero digits A and B, if A + B = ${sumAB}, find the exact sum of the two 2-digit numbers AB + BA.`,
          `${ansRev}`,
          [`${10 * sumAB}`, `${ansRev + 11}`, `${9 * sumAB}`],
          `(10A + B) + (10B + A) = 11(A + B) = 11 × ${sumAB} = ${ansRev}.`,
          'Module 5.7',
          rng
        ),
        makeChQ(
          uid('c-ch5-div11'),
          'short-answer',
          targetX11 <= 9
            ? `Find the single digit X so that the 5-digit number ${p1}${p2}X${p4}${p5Fixed} is divisible by 11.`
            : `Find the remainder when 2025 is divided by 11.`,
          targetX11 <= 9 ? `${targetX11}` : `1`,
          [`${((targetX11 <= 9 ? targetX11 : 1) + 2) % 10}`, `${((targetX11 <= 9 ? targetX11 : 1) + 3) % 10}`, `${((targetX11 <= 9 ? targetX11 : 1) + 5) % 10}`],
          `Apply alternating digit-sum rule for divisibility by 11.`,
          'Module 5.6',
          rng
        ),
        makeChQ(
          uid('c-ch5-mod9'),
          'short-answer',
          `Without multiplying everything out, find the remainder when (${ma} × ${mb} + ${mc}) is divided by 9.`,
          `${exactMod9}`,
          [`${(exactMod9 + 1) % 9}`, `${(exactMod9 + 3) % 9}`, `${(exactMod9 + 5) % 9}`],
          `Replace each number by its digit sum mod 9: (${ma % 9} × ${mb % 9} + ${mc % 9}) mod 9 = ${exactMod9}.`,
          'Module 5.3',
          rng
        )
      );
    } else if (difficulty === 4) {
      // Olympiad 1: Divisible by BOTH 8 and 9 (= 72)
      const head3 = randInt(rng, 21, 95);
      let p72Str = '';
      let ansSum72 = 0;
      for (let tryH = head3; tryH <= 99; tryH++) {
        const matches: Array<{ x: number; y: number }> = [];
        for (let x = 1; x <= 9; x++) {
          for (let y = 0; y <= 9; y++) {
            const val = tryH * 1000 + x * 100 + 30 + y;
            if (val % 72 === 0) matches.push({ x, y });
          }
        }
        if (matches.length === 1) {
          p72Str = `${tryH}X3Y`;
          ansSum72 = matches[0].x + matches[0].y;
          break;
        }
      }
      if (!p72Str) {
        p72Str = '42X3Y';
        ansSum72 = 9;
      }

      // Olympiad 2: Chinese Remainder deficit puzzle
      const modTriplet = pick(rng, [
        { divs: [5, 6, 7], lcm: 210, k: 2, minBound: 500 },
        { divs: [5, 6, 7], lcm: 210, k: 3, minBound: 700 },
        { divs: [4, 5, 6], lcm: 60, k: 1, minBound: 300 },
        { divs: [4, 5, 6], lcm: 60, k: 2, minBound: 450 },
        { divs: [6, 7, 8], lcm: 168, k: 3, minBound: 400 },
        { divs: [6, 7, 8], lcm: 168, k: 4, minBound: 600 },
        { divs: [3, 4, 5], lcm: 60, k: 1, minBound: 250 },
        { divs: [4, 7, 8], lcm: 56, k: 3, minBound: 350 },
      ]);
      const multM = Math.ceil((modTriplet.minBound + modTriplet.k) / modTriplet.lcm);
      const crtAns = modTriplet.lcm * multM - modTriplet.k;

      // Olympiad 3: 3-digit reverse difference ABC - CBA = 99*(A - C)
      const diffAC = randInt(rng, 2, 6);
      const sumAC = diffAC + 2 * randInt(rng, 1, Math.floor((9 - diffAC) / 2));
      const digitA = (sumAC + diffAC) / 2;
      const digitC = (sumAC - diffAC) / 2;
      const digitB = randInt(rng, 1, 8);
      const abcVal = digitA * 100 + digitB * 10 + digitC;

      // Olympiad 4: Multi-letter & repunit cryptarithms
      const repD = randInt(rng, 4, 9);
      const cryptoPool = [
        {
          prompt: `In the 3-letter cryptarithm AA + BB + CC = ABC (distinct non-zero digits A, B, C), find the 3-digit number ABC.`,
          ans: '198',
          d: ['189', '297', '178'],
          exp: '11(A + B + C) = 100A + 10B + C. Since A + B + C ≤ 24 and 11(A+B+C) ≥ 100, A = 1 or 2. Only A = 1, B = 9, C = 8 satisfies 11 + 99 + 88 = 198.',
        },
        {
          prompt: `Given 37 × 3 = 111, find the 2-digit number k that satisfies the cryptarithm 37 × k = ${repD * 111}.`,
          ans: `${3 * repD}`,
          d: [`${3 * repD - 2}`, `${3 * repD + 3}`, `${repD + 10}`],
          exp: `Since ${repD * 111} = ${repD} × 111 = ${repD} × 3 × 37 = 37 × ${3 * repD}, k = ${3 * repD}.`,
        },
        {
          prompt: `Find the unique 2-digit number XY such that XY + YX = 11 × (X + Y) is a perfect square, AND X − Y = 3 (with X > Y).`,
          ans: '74',
          d: ['85', '63', '96'],
          exp: 'XY + YX = 11(X+Y) is a square only when X + Y = 11. Solving X + Y = 11 and X − Y = 3 gives X = 7, Y = 4 ⇒ 74.',
        },
        {
          prompt: `In the 3-digit addition cryptarithm A6B + B6A = 1029 (with A > B and A − B = 3), find the 2-digit number AB.`,
          ans: '63',
          d: ['74', '52', '81'],
          exp: 'Tens 6 + 6 = 12 writes 2 and carries 1, so A + B = 9. With A − B = 3, A = 6 and B = 3 ⇒ 63.',
        },
      ];
      const cr = pick(rng, cryptoPool);

      pool.push(
        makeChQ(
          uid('o-ch5-div72'),
          'short-answer',
          `The 5-digit number ${p72Str} (with non-zero digit X ≥ 1) is divisible by 72. Find the value of X + Y.`,
          `${ansSum72}`,
          [`${ansSum72 + 1}`, `${Math.max(1, ansSum72 - 2)}`, `${ansSum72 + 9}`],
          `Divisible by 72 means divisible by both 8 and 9. Test last 3 digits X3Y divisible by 8 and total digit sum divisible by 9, giving X + Y = ${ansSum72}.`,
          'Module 5.5',
          rng
        ),
        makeChQ(
          uid('o-ch5-crt'),
          'short-answer',
          `Find the smallest integer GREATER than ${modTriplet.minBound} that leaves remainders ${modTriplet.divs[0] - modTriplet.k}, ${modTriplet.divs[1] - modTriplet.k}, and ${modTriplet.divs[2] - modTriplet.k} when divided by ${modTriplet.divs[0]}, ${modTriplet.divs[1]}, and ${modTriplet.divs[2]} respectively.`,
          `${crtAns}`,
          [`${crtAns + modTriplet.k}`, `${crtAns - modTriplet.lcm}`, `${crtAns + 2}`],
          `Notice every remainder is ${modTriplet.k} less than its divisor! So N + ${modTriplet.k} is a multiple of LCM(${modTriplet.divs.join(', ')}) = ${modTriplet.lcm}. Above ${modTriplet.minBound}, ${multM} × ${modTriplet.lcm} − ${modTriplet.k} = ${crtAns}.`,
          'Module 5.3',
          rng
        ),
        makeChQ(
          uid('o-ch5-reversethree'),
          'short-answer',
          `In a 3-digit number ABC (with middle digit B = ${digitB} and A > C), reversing its digits gives ABC − CBA = ${99 * diffAC}. If A + C = ${sumAC}, find the 3-digit number ABC.`,
          `${abcVal}`,
          [`${digitC * 100 + digitB * 10 + digitA}`, `${abcVal + 99}`, `${abcVal - 99}`],
          `ABC − CBA = 99(A − C) = ${99 * diffAC} ⇒ A − C = ${diffAC}. With A + C = ${sumAC}, A = ${digitA} and C = ${digitC}, so ABC = ${abcVal}.`,
          'Module 5.7',
          rng
        ),
        makeChQ(uid('o-ch5-crypto'), 'short-answer', cr.prompt, cr.ans, cr.d, cr.exp, 'Module 5.7', rng)
      );
    }
  }

  // =========================================================================
  // PART I · CHAPTER 6: WE DISTRIBUTE, YET THINGS MULTIPLY
  // =========================================================================
  if (includeCh('ch6-we-distribute', 1)) {
    if (difficulty === 1) {
      const a = randInt(rng, 2, 8);
      const b = randInt(rng, 2, 9);
      const c = randInt(rng, 2, 9);
      pool.push(
        makeChQ(
          uid('f-ch6-dist'),
          'mcq',
          `Expand ${a}(x + ${b}) using the distributive law.`,
          `${a}x + ${a * b}`,
          [`${a}x + ${b}`, `x + ${a * b}`, `${a + b}x`],
          `Multiply ${a} by both terms inside: ${a}·x + ${a}·${b} = ${a}x + ${a * b}.`,
          'Module 6.1',
          rng
        ),
        makeChQ(
          uid('f-ch6-distsub'),
          'mcq',
          `Expand ${a}(y − ${c}) using the distributive law.`,
          `${a}y − ${a * c}`,
          [`${a}y − ${c}`, `${a}y + ${a * c}`, `y − ${a * c}`],
          `Multiply ${a} by each term: ${a}·y − ${a}·${c} = ${a}y − ${a * c}.`,
          'Module 6.2',
          rng
        ),
        makeChQ(
          uid('f-ch6-sq100'),
          'short-answer',
          `Compute (100 + ${a})² using a² + 2ab + b².`,
          `${(100 + a) * (100 + a)}`,
          [`${10000 + a * a}`, `${10000 + 100 * a + a * a}`, `${(100 + a) * 2}`],
          `10,000 + ${200 * a} + ${a * a} = ${(100 + a) * (100 + a)}.`,
          'Module 6.3',
          rng
        )
      );
    } else if (difficulty === 3) {
      const s = randInt(rng, 11, 22);
      const aVal = randInt(rng, 4, Math.floor(s / 2) - 1);
      const bVal = s - aVal;
      const p = aVal * bVal;
      const sumSq = aVal * aVal + bVal * bVal;
      const diffAB = Math.abs(bVal - aVal);

      pool.push(
        makeChQ(
          uid('c-ch6-sumsq'),
          'short-answer',
          `If a + b = ${s} and ab = ${p}, find the exact value of a² + b².`,
          `${sumSq}`,
          [`${s * s}`, `${s * s - p}`, `${sumSq + 2 * p}`],
          `a² + b² = (a + b)² − 2ab = ${s * s} − ${2 * p} = ${sumSq}.`,
          'Module 6.3',
          rng
        ),
        makeChQ(
          uid('c-ch6-diffsqrev'),
          'short-answer',
          `If a − b = ${diffAB} and a² − b² = ${diffAB * s}, find a + b.`,
          `${s}`,
          [`${s + diffAB}`, `${s - diffAB}`, `${diffAB * 2}`],
          `(a − b)(a + b) = a² − b² ⇒ a + b = ${diffAB * s} ÷ ${diffAB} = ${s}.`,
          'Module 6.4',
          rng
        ),
        makeChQ(
          uid('c-ch6-mid'),
          'short-answer',
          `Find the value of (a + b)² − (a − b)² when a = ${aVal} and b = ${bVal}.`,
          `${4 * p}`,
          [`${2 * p}`, `${sumSq}`, `${aVal * aVal - bVal * bVal}`],
          `(a + b)² − (a − b)² simplifies directly to 4ab = 4 × ${aVal} × ${bVal} = ${4 * p}.`,
          'Module 6.6',
          rng
        )
      );
    } else if (difficulty === 4) {
      // Olympiad 1: x + 1/x = k -> x^4 + 1/x^4
      const kRec = randInt(rng, 3, 10);
      const sqRec = kRec * kRec - 2;
      const fourthRec = sqRec * sqRec - 2;

      // Olympiad 2: Telescoping difference of squares product (1 - 1/2^2)...(1 - 1/n^2) = (n+1)/(2n)
      const nTele = pick(rng, [9, 11, 15, 19, 25, 29, 39, 49]);
      const numT = (nTele + 1) / 2;
      const denT = nTele;

      // Olympiad 3: Large difference of squares simplification ((N)^2 - (M)^2) / (N - M) or 4ab trap
      const xBig = randInt(rng, 1015, 2045);
      const dHalf = randInt(rng, 4, 14);
      const aBig = xBig + dHalf;
      const bBig = xBig - dHalf;
      const exprDiff = (aBig * aBig - bBig * bBig) / (2 * dHalf); // = 2 * xBig!

      // Olympiad 4: Given a + b = S and a^2 + b^2 = Q, find (a - b)^2!
      const r1 = randInt(rng, 12, 27);
      const r2 = r1 + randInt(rng, 5, 13);
      const sumR = r1 + r2;
      const sqSumR = r1 * r1 + r2 * r2;
      const diffSqR = (r2 - r1) * (r2 - r1);

      pool.push(
        makeChQ(
          uid('o-ch6-recip4'),
          'short-answer',
          `If x + (1/x) = ${kRec}, find the exact value of x⁴ + (1/x⁴).`,
          `${fourthRec}`,
          [`${Math.pow(kRec, 4)}`, `${fourthRec + 2}`, `${sqRec * sqRec}`],
          `x² + 1/x² = ${kRec}² − 2 = ${sqRec}. Squaring again: x⁴ + 1/x⁴ = ${sqRec}² − 2 = ${fourthRec}.`,
          'Module 6.3',
          rng
        ),
        makeChQ(
          uid('o-ch6-telescoping'),
          'mcq',
          `Evaluate the telescoping product (1 − 1/2²)(1 − 1/3²)(1 − 1/4²) · … · (1 − 1/${nTele}²).`,
          `${numT}/${denT}`,
          [`1/${denT}`, `${numT - 1}/${denT}`, `${nTele + 1}/${nTele}`],
          `Factor each term as (k − 1)(k + 1)/k². Neighboring factors cancel, leaving (1/2) × (${nTele + 1}/${nTele}) = ${numT}/${denT}.`,
          'Module 6.4',
          rng
        ),
        makeChQ(
          uid('o-ch6-largesimplify'),
          'short-answer',
          `Evaluate (${aBig}² − ${bBig}²) ÷ (${aBig} − ${bBig}) without squaring ${aBig} or ${bBig}.`,
          `${exprDiff}`,
          [`${2 * dHalf}`, `${xBig}`, `${exprDiff + 2}`],
          `(a² − b²) ÷ (a − b) = a + b = ${aBig} + ${bBig} = ${exprDiff}.`,
          'Module 6.4',
          rng
        ),
        makeChQ(
          uid('o-ch6-identchain'),
          'short-answer',
          `If a + b = ${sumR} and a² + b² = ${sqSumR}, find the exact value of (a − b)².`,
          `${diffSqR}`,
          [`${sumR * sumR - sqSumR}`, `${(sumR * sumR - sqSumR) / 2}`, `${diffSqR + 4}`],
          `2ab = (a + b)² − (a² + b²) = ${sumR * sumR - sqSumR}. Then (a − b)² = (a² + b²) − 2ab = ${sqSumR} − ${sumR * sumR - sqSumR} = ${diffSqR}.`,
          'Module 6.3',
          rng
        )
      );
    }
  }

  // =========================================================================
  // PART I · CHAPTER 7: PROPORTIONAL REASONING - 1
  // =========================================================================
  if (includeCh('ch7-proportional-1', 1)) {
    if (difficulty === 1) {
      const k = randInt(rng, 2, 12);
      const pair = pick(rng, [[2, 3], [3, 4], [3, 5], [4, 7], [5, 8], [2, 5]]);
      const u = randInt(rng, 4, 24);
      const q1 = randInt(rng, 2, 5);
      const q2 = q1 + randInt(rng, 3, 7);
      pool.push(
        makeChQ(
          uid('f-ch7-ratio'),
          'mcq',
          `Simplify the ratio ${k * pair[0]} : ${k * pair[1]} to lowest terms.`,
          `${pair[0]} : ${pair[1]}`,
          [`${pair[1]} : ${pair[0]}`, `1 : ${k}`, `${pair[0] * 2} : ${pair[1] * 2 + 1}`],
          `Divide both terms by ${k} to get ${pair[0]} : ${pair[1]}.`,
          'Module 7.2',
          rng
        ),
        makeChQ(
          uid('f-ch7-unit'),
          'short-answer',
          `If ${q1} pens cost ₹${q1 * u}, how much do ${q2} pens cost (in ₹)?`,
          `${q2 * u}`,
          [`${q2 * u + u}`, `${q2 * u - q1}`, `${q1 * u + q2}`],
          `1 pen costs ₹${u}, so ${q2} pens cost ${q2} × ₹${u} = ₹${q2 * u}.`,
          'Module 7.4',
          rng
        )
      );
    } else if (difficulty === 3) {
      const workPreset = pick(rng, [
        { men: 12, days: 10, split: 4, newMen: 18, ans: 4 },
        { men: 15, days: 12, split: 4, newMen: 20, ans: 6 },
        { men: 16, days: 15, split: 5, newMen: 20, ans: 8 },
        { men: 18, days: 14, split: 4, newMen: 30, ans: 6 },
        { men: 20, days: 15, split: 3, newMen: 24, ans: 10 },
        { men: 14, days: 16, split: 4, newMen: 21, ans: 8 },
        { men: 24, days: 14, split: 4, newMen: 30, ans: 8 },
        { men: 10, days: 18, split: 3, newMen: 15, ans: 10 },
      ]);
      const rA = randInt(rng, 2, 5);
      const rB = rA + randInt(rng, 2, 4);
      const unitX = randInt(rng, 15, 45);
      const diffVal = (rB - rA) * unitX;

      pool.push(
        makeChQ(
          uid('c-ch7-reinforce'),
          'short-answer',
          `A camp has food for ${workPreset.men} hikers for ${workPreset.days} days. After ${workPreset.split} days, more hikers arrive making the group ${workPreset.newMen} hikers total. How many days will the remaining food last?`,
          `${workPreset.ans}`,
          [`${workPreset.days - workPreset.split}`, `${workPreset.ans + 2}`, `${Math.max(1, workPreset.ans - 1)}`],
          `Remaining food = ${workPreset.men} × (${workPreset.days} − ${workPreset.split}) = ${workPreset.men * (workPreset.days - workPreset.split)} hiker-days. Divided among ${workPreset.newMen} hikers gives ${workPreset.ans} days.`,
          'Module 7.7',
          rng
        ),
        makeChQ(
          uid('c-ch7-diffpart'),
          'short-answer',
          `Two numbers are in the ratio ${rA} : ${rB}. If their difference is ${diffVal}, find the SUM of the two numbers.`,
          `${(rA + rB) * unitX}`,
          [`${rB * unitX}`, `${rA * unitX}`, `${diffVal * (rA + rB)}`],
          `${rB - rA} parts = ${diffVal} ⇒ 1 part = ${unitX}. Sum = (${rA} + ${rB}) × ${unitX} = ${(rA + rB) * unitX}.`,
          'Module 7.6',
          rng
        )
      );
    } else if (difficulty === 4) {
      // Olympiad 1: Two-stage mixture replacement
      const kMix = randInt(rng, 3, 22);
      const volMix = 5 * kMix;
      const addWater = 2 * kMix;

      // Olympiad 2: Multi-variable Trairāśika: M1 men, H1 hrs, D1 days, W1 units
      const mVars = pick(rng, [
        { m1: 8, h1: 6, d1: 15, w1: 12, m2: 10, h2: 9, w2: 18, d2: 12 },
        { m1: 12, h1: 8, d1: 10, w1: 16, m2: 16, h2: 5, w2: 20, d2: 15 },
        { m1: 9, h1: 6, d1: 14, w1: 21, m2: 7, h2: 9, w2: 28, d2: 16 },
        { m1: 10, h1: 8, d1: 12, w1: 15, m2: 12, h2: 10, w2: 25, d2: 16 },
        { m1: 15, h1: 6, d1: 12, w1: 18, m2: 9, h2: 10, w2: 25, d2: 18 },
        { m1: 6, h1: 8, d1: 21, w1: 14, m2: 12, h2: 7, w2: 21, d2: 18 },
      ]);

      // Olympiad 3: Harmonic average speed trap
      const spPair = pick(rng, [
        { v1: 20, v2: 30, avg: 24 },
        { v1: 30, v2: 60, avg: 40 },
        { v1: 40, v2: 60, avg: 48 },
        { v1: 24, v2: 40, avg: 30 },
        { v1: 36, v2: 45, avg: 40 },
        { v1: 20, v2: 60, avg: 30 },
        { v1: 45, v2: 90, avg: 60 },
        { v1: 60, v2: 120, avg: 80 },
      ]);

      // Olympiad 4: Couple of gears A -> B -> C
      const gearSet = pick(rng, [
        { tA: 36, tB: 18, tC: 24, rpmA: 10, rpmC: 15 },
        { tA: 48, tB: 16, tC: 32, rpmA: 12, rpmC: 18 },
        { tA: 45, tB: 15, tC: 25, rpmA: 20, rpmC: 36 },
        { tA: 60, tB: 20, tC: 40, rpmA: 14, rpmC: 21 },
        { tA: 54, tB: 18, tC: 36, rpmA: 16, rpmC: 24 },
        { tA: 72, tB: 24, tC: 48, rpmA: 10, rpmC: 15 },
      ]);

      pool.push(
        makeChQ(
          uid('o-ch7-mixture'),
          'short-answer',
          `A ${volMix}-liter solution has acid and water in the ratio 3 : 2. How many liters of pure water must be added to change the ratio of acid to water to 3 : 4?`,
          `${addWater}`,
          [`${kMix}`, `${addWater + kMix}`, `${volMix / 2}`],
          `Initial acid = ${3 * kMix} L, water = ${2 * kMix} L. Acid stays ${3 * kMix} L, so target water is ${4 * kMix} L ⇒ add ${4 * kMix} − ${2 * kMix} = ${addWater} L.`,
          'Module 7.6',
          rng
        ),
        makeChQ(
          uid('o-ch7-chainrule'),
          'short-answer',
          `If ${mVars.m1} artisans working ${mVars.h1} hours/day craft ${mVars.w1} carpets in ${mVars.d1} days, how many days will ${mVars.m2} artisans working ${mVars.h2} hours/day take to craft ${mVars.w2} carpets?`,
          `${mVars.d2}`,
          [`${mVars.d2 - 2}`, `${mVars.d2 + 3}`, `${mVars.d1}`],
          `Total man-hours per carpet = (${mVars.m1}×${mVars.h1}×${mVars.d1})/${mVars.w1}. Solving (${mVars.m2}×${mVars.h2}×d)/${mVars.w2} gives d = ${mVars.d2} days.`,
          'Module 7.4',
          rng
        ),
        makeChQ(
          uid('o-ch7-harmonic'),
          'short-answer',
          `A cyclist travels uphill at ${spPair.v1} km/h and returns along the EXACT same route downhill at ${spPair.v2} km/h. What is the cyclist’s true average speed for the round trip (in km/h)?`,
          `${spPair.avg}`,
          [`${(spPair.v1 + spPair.v2) / 2}`, `${spPair.avg + 2}`, `${spPair.v2 - spPair.v1}`],
          `Harmonic mean: 2·v₁·v₂ / (v₁ + v₂) = 2×${spPair.v1}×${spPair.v2} / (${spPair.v1 + spPair.v2}) = ${spPair.avg} km/h (never the arithmetic mean ${(spPair.v1 + spPair.v2) / 2}!).`,
          'Module 7.7',
          rng
        ),
        makeChQ(
          uid('o-ch7-gears'),
          'short-answer',
          `Three meshed gears A, B, and C have ${gearSet.tA}, ${gearSet.tB}, and ${gearSet.tC} teeth respectively. If Gear A rotates ${gearSet.rpmA} times, how many full rotations does Gear C make?`,
          `${gearSet.rpmC}`,
          [`${gearSet.rpmA}`, `${gearSet.rpmC + 4}`, `${Math.round((gearSet.tA * gearSet.rpmA) / gearSet.tB)}`],
          `Rotations × teeth is constant across the train: ${gearSet.tA} × ${gearSet.rpmA} = ${gearSet.tC} × rpmC ⇒ rpmC = ${gearSet.rpmC}.`,
          'Module 7.7',
          rng
        )
      );
    }
  }

  // =========================================================================
  // PART II · CHAPTER 1: FRACTIONS IN DISGUISE (PERCENTAGES)
  // =========================================================================
  if (includeCh('ch4-fractions-disguise', 2)) {
    if (difficulty === 1) {
      const base = randInt(rng, 2, 18) * 50;
      const pct = pick(rng, [10, 20, 25, 30, 40, 50, 60, 80]);
      const fracPick = pick(rng, [
        { f: '1/4', p: '25%', w: ['14%', '40%', '50%'] },
        { f: '3/4', p: '75%', w: ['34%', '70%', '80%'] },
        { f: '1/5', p: '20%', w: ['15%', '25%', '50%'] },
        { f: '2/5', p: '40%', w: ['25%', '20%', '45%'] },
        { f: '3/5', p: '60%', w: ['35%', '50%', '65%'] },
        { f: '4/5', p: '80%', w: ['45%', '75%', '85%'] },
        { f: '1/8', p: '12.5%', w: ['18%', '25%', '12%'] },
        { f: '3/8', p: '37.5%', w: ['38%', '35%', '40%'] },
        { f: '7/20', p: '35%', w: ['27%', '70%', '45%'] },
        { f: '9/25', p: '36%', w: ['39%', '29%', '45%'] },
      ]);
      pool.push(
        makeChQ(
          uid('f-p2c1-pct'),
          'short-answer',
          `What is ${pct}% of ${base}?`,
          `${(base * pct) / 100}`,
          [`${base / 10}`, `${base - pct}`, `${(base * pct) / 100 + 25}`],
          `(${pct}/100) × ${base} = ${(base * pct) / 100}.`,
          'Module 1.2',
          rng
        ),
        makeChQ(
          uid('f-p2c1-fdp'),
          'mcq',
          `Express the fraction ${fracPick.f} as a percentage.`,
          fracPick.p,
          fracPick.w,
          `${fracPick.f} × 100% = ${fracPick.p}.`,
          'Module 1.1',
          rng
        )
      );
    } else if (difficulty === 3) {
      const mMarkup = pick(rng, [20, 25, 40, 50, 60]);
      const dDisc = pick(rng, [10, 15, 20, 25, 30]);
      const netProfit = Number((((100 + mMarkup) * (100 - dDisc)) / 100 - 100).toFixed(1));
      const pVal = randInt(rng, 2, 18) * 1000;
      const rPct = pick(rng, [10, 20]);
      const factor2 = rPct === 10 ? 1.21 : 1.44;
      const ciAmt = Math.round(pVal * factor2);
      const siAmt = Math.round(pVal * (1 + (2 * rPct) / 100));
      pool.push(
        makeChQ(
          uid('c-p2c1-markup'),
          'short-answer',
          `A store marks items ${mMarkup}% above cost price and then gives a ${dDisc}% discount. What is the net percentage profit?`,
          `${netProfit}%`,
          [`${mMarkup - dDisc}%`, `${netProfit + 5}%`, `${mMarkup + dDisc}%`],
          `On CP = 100, MP = ${100 + mMarkup}. After ${dDisc}% discount, SP = ${100 + netProfit}, leaving net ${netProfit}%.`,
          'Module 1.6',
          rng,
          [`${netProfit}%`, `${netProfit}`]
        ),
        makeChQ(
          uid('c-p2c1-ci'),
          'short-answer',
          `₹${pVal.toLocaleString()} is invested at ${rPct}% p.a. compounded annually. Find the compound INTEREST (only interest, not total amount) after 2 years (in ₹).`,
          `${ciAmt - pVal}`,
          [`${ciAmt}`, `${siAmt - pVal}`, `${ciAmt - pVal + 100}`],
          `Total = ${pVal} × ${factor2} = ₹${ciAmt}. Interest = ₹${ciAmt} − ₹${pVal} = ₹${ciAmt - pVal}.`,
          'Module 1.7',
          rng
        )
      );
    } else if (difficulty === 4) {
      // Olympiad 1: CI - SI difference over 2 years -> Find P
      const rCi = pick(rng, [10, 20, 25]);
      const pCi = randInt(rng, 3, 24) * 1000;
      const diffCiSi = Math.round(pCi * Math.pow(rCi / 100, 2));
      const ciDiffPreset = { r: rCi, p: pCi, diff: diffCiSi };

      // Olympiad 2: Equal SP one at +p% profit and one at -p% loss -> net loss % = p^2 / 100
      const lossP = pick(rng, [10, 20, 30, 40, 50]);
      const netLossP = (lossP * lossP) / 100;
      const eqSp = pick(rng, [18000, 24000, 36000, 45000, 72000]);

      // Olympiad 3: Markup + Discount + GST chain -> solve backwards from final bill to CP!
      const kItem = randInt(rng, 2, 16);
      const cpOrigin = 1000 * kItem;
      const finalGstPrice = 1260 * kItem;

      // Olympiad 4: Reverse 2-year compounding (+20% then -25%) -> factor 1.2 * 0.75 = 0.90
      const baseOrigin = randInt(rng, 3, 24) * 1000;
      const endPop = baseOrigin * 0.9;

      pool.push(
        makeChQ(
          uid('o-p2c1-cisi'),
          'short-answer',
          `Over 2 years at ${ciDiffPreset.r}% per annum, the difference between Compound Interest (compounded annually) and Simple Interest on a sum P is ₹${ciDiffPreset.diff}. Find the original principal P (in ₹).`,
          `${ciDiffPreset.p}`,
          [`${ciDiffPreset.p / 2}`, `${ciDiffPreset.p + 1000}`, `${ciDiffPreset.diff * 10}`],
          `For 2 years, CI − SI = P(r/100)². Thus ${ciDiffPreset.diff} = P × (${ciDiffPreset.r}/100)² ⇒ P = ₹${ciDiffPreset.p.toLocaleString()}.`,
          'Module 1.7',
          rng
        ),
        makeChQ(
          uid('o-p2c1-equalsp'),
          'mcq',
          `A dealer sells two bikes at the EXACT same selling price ₹${eqSp.toLocaleString()} each—one at a ${lossP}% profit and the other at a ${lossP}% loss. What is the dealer’s overall percentage profit or loss?`,
          `${netLossP}% loss`,
          [`0% (no profit, no loss)`, `${netLossP}% profit`, `${lossP / 2}% loss`],
          `Selling two items at equal SP with +p% and −p% always gives a net loss of p²/100 % = ${lossP}²/100 = ${netLossP}% loss.`,
          'Module 1.6',
          rng
        ),
        makeChQ(
          uid('o-p2c1-chain'),
          'short-answer',
          `A coat’s cost price is marked up by 40%, then discounted by 25%, and finally 20% GST is added to reach a customer bill of ₹${finalGstPrice.toLocaleString()}. What was the original Cost Price (in ₹)?`,
          `${cpOrigin}`,
          [`${Math.round(finalGstPrice * 0.75)}`, `${cpOrigin + 500}`, `${cpOrigin - 500}`],
          `Multiplier = 1.40 × 0.75 × 1.20 = 1.26. Dividing ₹${finalGstPrice.toLocaleString()} ÷ 1.26 gives CP = ₹${cpOrigin.toLocaleString()}.`,
          'Module 1.7',
          rng
        ),
        makeChQ(
          uid('o-p2c1-rev2yr'),
          'short-answer',
          `A town’s population rose by 20% in Year 1 and fell by 25% in Year 2, ending at ${endPop.toLocaleString()} residents. What was the population BEFORE Year 1?`,
          `${baseOrigin}`,
          [`${Math.round(endPop * 1.05)}`, `${baseOrigin - 500}`, `${endPop}`],
          `Net multiplier = 1.20 × 0.75 = 0.90. Original = ${endPop.toLocaleString()} ÷ 0.90 = ${baseOrigin.toLocaleString()}.`,
          'Module 1.5',
          rng
        )
      );
    }
  }

  // =========================================================================
  // PART II · CHAPTER 2: THE BAUDHAYANA-PYTHAGORAS THEOREM
  // =========================================================================
  if (includeCh('ch5-baudhayana-pythagoras', 2)) {
    if (difficulty === 1) {
      const s = randInt(rng, 2, 24);
      const scale345 = randInt(rng, 1, 9);
      pool.push(
        makeChQ(
          uid('f-p2c2-345'),
          'short-answer',
          `A right triangle has legs ${3 * scale345} cm and ${4 * scale345} cm. Find the hypotenuse (in cm).`,
          `${5 * scale345}`,
          [`${7 * scale345}`, `${5 * scale345 + 2}`, `${12 * scale345}`],
          `√(${3 * scale345}² + ${4 * scale345}²) = ${5 * scale345} cm.`,
          'Module 2.5',
          rng
        ),
        makeChQ(
          uid('f-p2c2-diag'),
          'mcq',
          `By Baudhāyana’s dvikaraṇī, what is the diagonal of a square of side ${s} cm?`,
          `${s}√2 cm`,
          [`${2 * s} cm`, `${s * s} cm`, `${s}√3 cm`],
          `Diagonal = side × √2 = ${s}√2 cm.`,
          'Module 2.2',
          rng
        )
      );
    } else if (difficulty === 3) {
      const baseTris = [
        { a: 3, b: 4, c: 5 },
        { a: 5, b: 12, c: 13 },
        { a: 8, b: 15, c: 17 },
        { a: 7, b: 24, c: 25 },
        { a: 9, b: 40, c: 41 },
        { a: 20, b: 21, c: 29 },
      ];
      const bt1 = pick(rng, baseTris);
      const sc1 = randInt(rng, 1, 9);
      const tri1 = { a: bt1.a * sc1, b: bt1.b * sc1, c: bt1.c * sc1 };

      const bt2 = pick(rng, baseTris);
      const sc2 = randInt(rng, 1, 9);
      const tri2 = { a: bt2.a * sc2, b: bt2.b * sc2, c: bt2.c * sc2 };
      const perim2 = tri2.a + tri2.b + tri2.c;
      const area2 = (tri2.a * tri2.b) / 2;

      // Isosceles triangle apex-to-base height using doubled right triangle
      const isoArea = tri1.a * tri1.b;
      pool.push(
        makeChQ(
          uid('c-p2c2-rect'),
          'short-answer',
          `A rectangle has diagonal ${tri1.c} cm and one side ${tri1.a} cm. Find the AREA of the rectangle (in cm²).`,
          `${tri1.a * tri1.b}`,
          [`${(tri1.a * tri1.b) / 2}`, `${2 * (tri1.a + tri1.b)}`, `${tri1.a * tri1.c}`],
          `Other side = √(${tri1.c}² − ${tri1.a}²) = ${tri1.b} cm. Area = ${tri1.a} × ${tri1.b} = ${tri1.a * tri1.b} cm².`,
          'Module 2.5',
          rng
        ),
        makeChQ(
          uid('c-p2c2-bound'),
          'short-answer',
          `Find the area of the right triangle with legs ${tri2.a} cm and ${tri2.b} cm (perimeter ${perim2} cm).`,
          `${area2}`,
          [`${tri2.a * tri2.b}`, `${area2 + tri2.a}`, `${perim2}`],
          `Area = ½ × ${tri2.a} × ${tri2.b} = ${area2} cm².`,
          'Module 2.6',
          rng
        ),
        makeChQ(
          uid('c-p2c2-iso'),
          'short-answer',
          `An isosceles triangle has equal sides of ${tri1.c} cm each and a base of ${2 * tri1.a} cm. Find the AREA of the isosceles triangle (in cm²).`,
          `${isoArea}`,
          [`${isoArea / 2}`, `${2 * tri1.a * tri1.c}`, `${isoArea + tri1.b}`],
          `Dropping the perpendicular altitude splits the base into ${tri1.a} cm halves. Height = √(${tri1.c}² − ${tri1.a}²) = ${tri1.b} cm. Area = ½ × ${2 * tri1.a} × ${tri1.b} = ${isoArea} cm².`,
          'Module 2.5',
          rng
        )
      );
    } else if (difficulty === 4) {
      // Olympiad 1: Bhaskara II Lotus / Broken Bamboo (infinite integer family: h=2, d=2k => depth = k^2 - 1)
      const kLot = randInt(rng, 3, 16);
      const lotus = { d: 2 * kLot, h: 2, depth: kLot * kLot - 1 };

      // Olympiad 2: Spider shortest surface path across unfolded cuboid from primitive triples
      const sTri = pick(rng, [
        { A: 6, B: 8, C: 10 },
        { A: 5, B: 12, C: 13 },
        { A: 8, B: 15, C: 17 },
        { A: 7, B: 24, C: 25 },
      ]);
      const scSp = randInt(rng, 1, 4);
      const lSp = Math.floor((sTri.A * scSp) / 2);
      const wSp = sTri.A * scSp - lSp;
      const spider = { l: lSp, w: wSp, h: sTri.B * scSp, ans: sTri.C * scSp };

      // Olympiad 3: Altitude to the hypotenuse h = ab / c
      const mAlt = randInt(rng, 1, 8);
      const altTri = pick(rng, [
        { a: 15 * mAlt, b: 20 * mAlt, c: 25 * mAlt, h: 12 * mAlt },
        { a: 30 * mAlt, b: 40 * mAlt, c: 50 * mAlt, h: 24 * mAlt },
        { a: 65 * mAlt, b: 156 * mAlt, c: 169 * mAlt, h: 60 * mAlt },
      ]);

      // Olympiad 4: 3D Room space diagonal (l, w, h -> D)
      const kRm = randInt(rng, 1, 8);
      const room = pick(rng, [
        { l: 2 * kRm, w: 3 * kRm, h: 6 * kRm, d: 7 * kRm },
        { l: 1 * kRm, w: 4 * kRm, h: 8 * kRm, d: 9 * kRm },
        { l: 4 * kRm, w: 4 * kRm, h: 7 * kRm, d: 9 * kRm },
        { l: 2 * kRm, w: 5 * kRm, h: 14 * kRm, d: 15 * kRm },
      ]);

      pool.push(
        makeChQ(
          uid('o-p2c2-lotus'),
          'short-answer',
          `Bhāskara II’s Lotus Puzzle: A lotus rises ${lotus.h} cm vertically above still water. When blown aside, its blossom touches the water ${lotus.d} cm horizontally from its base stem. Find the depth of the water (in cm).`,
          `${lotus.depth}`,
          [`${lotus.depth - lotus.h}`, `${lotus.d + lotus.h}`, `${lotus.depth + 2}`],
          `If depth is x, stem length = x + ${lotus.h}. By Baudhāyana’s theorem: x² + ${lotus.d}² = (x + ${lotus.h})² ⇒ ${2 * lotus.h}x = ${lotus.d * lotus.d - lotus.h * lotus.h} ⇒ x = ${lotus.depth} cm.`,
          'Module 2.7',
          rng
        ),
        makeChQ(
          uid('o-p2c2-spider'),
          'short-answer',
          `An ant stands at one corner of a closed ${spider.l} × ${spider.w} × ${spider.h} rectangular wooden box and wants to crawl along the OUTSIDE SURFACE to the opposite diagonal corner. What is the SHORTEST path length?`,
          `${spider.ans}`,
          [`${spider.l + spider.w + spider.h}`, `${spider.ans + 2}`, `${spider.h + spider.l}`],
          `Unfolding adjacent faces flattens the shortest path into a right triangle of legs (${spider.l} + ${spider.w}) = ${spider.l + spider.w} and ${spider.h}: √(${spider.l + spider.w}² + ${spider.h}²) = ${spider.ans}.`,
          'Module 2.5',
          rng
        ),
        makeChQ(
          uid('o-p2c2-alt'),
          'short-answer',
          `A right triangle has perpendicular legs ${altTri.a} cm and ${altTri.b} cm. Find the length of the perpendicular altitude drawn from the right angle to the hypotenuse (in cm).`,
          `${altTri.h}`,
          [`${altTri.a}`, `${altTri.c}`, `${altTri.h + 3}`],
          `Hypotenuse c = √(${altTri.a}² + ${altTri.b}²) = ${altTri.c} cm. Equating area ½ab = ½ch gives h = (${altTri.a} × ${altTri.b}) ÷ ${altTri.c} = ${altTri.h} cm.`,
          'Module 2.5',
          rng
        ),
        makeChQ(
          uid('o-p2c2-3d'),
          'short-answer',
          `Find the straight 3D space diagonal (corner to opposite corner) of a room measuring ${room.l} m × ${room.w} m × ${room.h} m (in meters).`,
          `${room.d}`,
          [`${room.h + 2}`, `${room.l + room.w + room.h}`, `${room.d - 2}`],
          `D = √(${room.l}² + ${room.w}² + ${room.h}²) = √(${room.l * room.l + room.w * room.w + room.h * room.h}) = ${room.d} m.`,
          'Module 2.5',
          rng
        )
      );
    }
  }

  // =========================================================================
  // PART II · CHAPTER 3: PROPORTIONAL REASONING - 2
  // =========================================================================
  if (includeCh('ch6-proportional-reasoning', 2)) {
    if (difficulty === 1) {
      const pct = pick(rng, [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 75]);
      const deg = (pct * 360) / 100;
      const mapScale = pick(rng, [5, 10, 15, 20, 25]);
      const mapCm = randInt(rng, 2, 15);
      pool.push(
        makeChQ(
          uid('f-p2c3-pie'),
          'short-answer',
          `In a 360° pie chart, what central angle (in degrees) corresponds to ${pct}%?`,
          `${deg}`,
          [`${pct}`, `${360 - deg}`, `${deg + 10}`],
          `${pct}% of 360° = ${deg}°.`,
          'Module 3.5',
          rng
        ),
        makeChQ(
          uid('f-p2c3-map'),
          'short-answer',
          `On a map with scale 1 cm = ${mapScale} km, how many km does ${mapCm} cm represent?`,
          `${mapCm * mapScale}`,
          [`${mapCm}`, `${mapCm * mapScale * 10}`, `${mapCm + mapScale}`],
          `${mapCm} × ${mapScale} = ${mapCm * mapScale} km.`,
          'Module 3.2',
          rng
        )
      );
    } else if (difficulty === 3) {
      const k = randInt(rng, 2, 12);
      const tot = 35 * k;
      const ansC = 15 * k;
      const totStudents = pick(rng, [360, 720, 1080, 1440]);
      const anglePie = pick(rng, [45, 60, 72, 90, 108, 120, 135, 144, 150]);
      const sciCnt = Math.round((anglePie * totStudents) / 360);
      pool.push(
        makeChQ(
          uid('c-p2c3-chain'),
          'short-answer',
          `Given A : B = 2 : 3 and B : C = 4 : 5, if A + B + C = ${tot}, find the value of C.`,
          `${ansC}`,
          [`${12 * k}`, `${8 * k}`, `${ansC + 5}`],
          `Combine at B = 12: A:B:C = 8:12:15 (35 parts = ${tot} ⇒ 1 part = ${k}), so C = 15 × ${k} = ${ansC}.`,
          'Module 3.3',
          rng
        ),
        makeChQ(
          uid('c-p2c3-piecnt'),
          'short-answer',
          `In a pie chart of ${totStudents} students, the Science sector spans ${anglePie}°. How many students chose Science?`,
          `${sciCnt}`,
          [`${anglePie}`, `${totStudents / 2}`, `${sciCnt + 24}`],
          `(${anglePie} / 360) × ${totStudents} = ${sciCnt} students.`,
          'Module 3.5',
          rng
        )
      );
    } else if (difficulty === 4) {
      // Olympiad 1: Map RF AREA scaling (quadratic!)
      const rfChoice = pick(rng, [
        { rf: '1 : 50,000', kmPerCm: 0.5 },
        { rf: '1 : 100,000', kmPerCm: 1 },
        { rf: '1 : 200,000', kmPerCm: 2 },
        { rf: '1 : 400,000', kmPerCm: 4 },
      ]);
      const mw = randInt(rng, 3, 9) * 2;
      const mh = randInt(rng, 3, 9) * 2;
      const mapAreaSet = {
        rf: rfChoice.rf,
        kmPerCm: rfChoice.kmPerCm,
        mapW: mw,
        mapH: mh,
        km2: mw * mh * rfChoice.kmPerCm * rfChoice.kmPerCm,
      };

      // Olympiad 2: Relative work efficiency: A is p% more efficient than B
      const effPreset = pick(rng, [
        { pctFaster: 50, togetherDays: 12, bAlone: 30 },
        { pctFaster: 50, togetherDays: 16, bAlone: 40 },
        { pctFaster: 25, togetherDays: 16, bAlone: 36 },
        { pctFaster: 25, togetherDays: 20, bAlone: 45 },
        { pctFaster: 100, togetherDays: 10, bAlone: 30 },
        { pctFaster: 100, togetherDays: 14, bAlone: 42 },
      ]);

      // Olympiad 3: 4-term ratio chain A:B, B:C, C:D -> find D - A or sum
      const k4 = randInt(rng, 2, 16);
      const total4 = 37 * k4;

      // Olympiad 4: Upstream / Downstream proportional time ratio
      const streamS = randInt(rng, 2, 5);
      const boatS = streamS * 4; // still water = 4s, up = 3s, down = 5s
      const downTime = 3 * randInt(rng, 2, 5);
      const upTime = (5 * downTime) / 3; // inverse ratio of 5s : 3s

      pool.push(
        makeChQ(
          uid('o-p2c3-maparea'),
          'short-answer',
          `On a survey map with Representative Fraction (RF) ${mapAreaSet.rf}, a rectangular forest measures ${mapAreaSet.mapW} cm by ${mapAreaSet.mapH} cm on the map. What is its actual ground AREA (in km²)?`,
          `${mapAreaSet.km2}`,
          [`${mapAreaSet.mapW * mapAreaSet.mapH * mapAreaSet.kmPerCm}`, `${mapAreaSet.km2 * 2}`, `${mapAreaSet.km2 / 2}`],
          `Linear scale: 1 cm = ${mapAreaSet.kmPerCm} km ⇒ Area scale squares the factor: 1 cm² = ${mapAreaSet.kmPerCm * mapAreaSet.kmPerCm} km². ${mapAreaSet.mapW * mapAreaSet.mapH} cm² × ${mapAreaSet.kmPerCm * mapAreaSet.kmPerCm} = ${mapAreaSet.km2} km².`,
          'Module 3.2',
          rng
        ),
        makeChQ(
          uid('o-p2c3-eff'),
          'short-answer',
          `Worker A is ${effPreset.pctFaster}% more efficient than Worker B. Working together, they finish a bridge in ${effPreset.togetherDays} days. How many days would Worker B take to finish it ALONE?`,
          `${effPreset.bAlone}`,
          [`${effPreset.togetherDays * 2}`, `${effPreset.bAlone - 6}`, `${effPreset.bAlone + 6}`],
          `If B's rate is 1 unit/day, A's rate is ${1 + effPreset.pctFaster / 100} units/day. Combined rate = ${2 + effPreset.pctFaster / 100}. Total work = ${effPreset.togetherDays} × ${2 + effPreset.pctFaster / 100} = ${effPreset.bAlone} days for B alone.`,
          'Module 3.7',
          rng
        ),
        makeChQ(
          uid('o-p2c3-chain4'),
          'short-answer',
          `If A : B = 1 : 2, B : C = 3 : 4, C : D = 2 : 5, and A + B + C + D = ${total4}, find the value of (D − A).`,
          `${17 * k4}`,
          [`${20 * k4}`, `${14 * k4}`, `${37}`],
          `Common ratio A : B : C : D = 3 : 6 : 8 : 20 (sum = 37 parts = ${total4} ⇒ 1 part = ${k4}). Thus D − A = 17 × ${k4} = ${17 * k4}.`,
          'Module 3.3',
          rng
        ),
        makeChQ(
          uid('o-p2c3-boat'),
          'short-answer',
          `A boat’s speed in still water is ${boatS} km/h and the river current flows at ${streamS} km/h. If a downstream trip takes ${downTime} hours, how many hours does the SAME distance take returning upstream?`,
          `${upTime}`,
          [`${downTime}`, `${upTime - 2}`, `${Math.round((downTime * boatS) / (boatS - streamS))}`],
          `Downstream speed = ${boatS + streamS} km/h; Upstream speed = ${boatS - streamS} km/h. By inverse proportion, upstream time = ${downTime} × (${boatS + streamS}/${boatS - streamS}) = ${upTime} hours.`,
          'Module 3.6',
          rng
        )
      );
    }
  }

  // =========================================================================
  // PART II · CHAPTER 4: EXPLORING SOME GEOMETRIC THEMES
  // =========================================================================
  if (includeCh('ch11-geometric-themes', 2)) {
    if (difficulty === 1) {
      const sidesPoly = randInt(rng, 3, 12);
      const nPrism = randInt(rng, 3, 11);
      const gLvl1 = randInt(rng, 1, 4);
      pool.push(
        makeChQ(
          uid('f-p2c4-sym'),
          'short-answer',
          `How many lines of symmetry does a regular ${sidesPoly}-sided polygon have?`,
          `${sidesPoly}`,
          [`${sidesPoly * 2}`, `${sidesPoly - 1}`, `${sidesPoly + 2}`],
          `Any regular n-sided polygon has exactly n = ${sidesPoly} lines of reflection symmetry.`,
          'Module 4.1',
          rng
        ),
        makeChQ(
          uid('f-p2c4-euler'),
          'short-answer',
          `Using Euler’s Formula F + V − E = 2, a prism with a ${nPrism}-sided base has ${nPrism + 2} faces and ${2 * nPrism} vertices. How many edges E does it have?`,
          `${3 * nPrism}`,
          [`${2 * nPrism}`, `${3 * nPrism + 2}`, `${3 * nPrism - 2}`],
          `E = F + V − 2 = ${nPrism + 2} + ${2 * nPrism} − 2 = ${3 * nPrism} edges.`,
          'Module 4.4',
          rng
        ),
        makeChQ(
          uid('f-p2c4-gasket'),
          'short-answer',
          `In the Sierpinski Gasket triangle, each step triples the shaded triangles (3ⁿ). How many shaded triangles appear at Step ${gLvl1}?`,
          `${Math.pow(3, gLvl1)}`,
          [`${3 * gLvl1}`, `${Math.pow(2, gLvl1)}`, `${Math.pow(4, gLvl1)}`],
          `3^${gLvl1} = ${Math.pow(3, gLvl1)} shaded triangles.`,
          'Module 4.2',
          rng
        )
      );
    } else if (difficulty === 3) {
      const nStep = randInt(rng, 2, 6);
      const lAnt = randInt(rng, 4, 12);
      const wAnt = randInt(rng, 3, 9);
      const hAnt = randInt(rng, 5, 14);
      pool.push(
        makeChQ(
          uid('c-p2c4-sierp'),
          'mcq',
          `After ${nStep} subdivisions of a unit-area Sierpinski Gasket (removing central 1/4 triangles), what fraction of the original area remains shaded?`,
          `${Math.pow(3, nStep)}/${Math.pow(4, nStep)}`,
          [`1/${Math.pow(4, nStep)}`, `${Math.pow(3, nStep)}/${Math.pow(2, nStep)}`, `${nStep}/4`],
          `Each step keeps 3/4 of the shaded area, giving (3/4)^${nStep} = ${Math.pow(3, nStep)}/${Math.pow(4, nStep)}.`,
          'Module 4.2',
          rng
        ),
        makeChQ(
          uid('c-p2c4-ant'),
          'mcq',
          `An ant crawls across two unfolded faces of a ${lAnt} × ${wAnt} × ${hAnt} box via path length √((${lAnt}+${wAnt})² + ${hAnt}²). Which integer equals the radicand (${lAnt + wAnt})² + ${hAnt}²?`,
          `${(lAnt + wAnt) * (lAnt + wAnt) + hAnt * hAnt}`,
          [`${lAnt * lAnt + wAnt * wAnt + hAnt * hAnt}`, `${(lAnt + wAnt + hAnt) * (lAnt + wAnt + hAnt)}`, `${(lAnt + hAnt) * (lAnt + hAnt) + wAnt * wAnt}`],
          `(${lAnt + wAnt})² + ${hAnt}² = ${(lAnt + wAnt) ** 2} + ${hAnt ** 2} = ${(lAnt + wAnt) ** 2 + hAnt ** 2}.`,
          'Module 4.5',
          rng
        )
      );
    } else if (difficulty === 4) {
      // Olympiad 1: Polyhedron face-type Euler system
      const nAnti = randInt(rng, 4, 10);
      const polySet = pick(rng, [
        { desc: `12 pentagons and 20 hexagons (soccer ball)`, edges: 90, faces: 32, verts: 60 },
        { desc: `8 equilateral triangles and 6 squares`, edges: 24, faces: 14, verts: 12 },
        { desc: `32 equilateral triangles and 6 squares`, edges: 60, faces: 38, verts: 24 },
        { desc: `${2 * nAnti} lateral triangles and 2 ${nAnti}-gonal bases (a ${nAnti}-antiprism)`, edges: 4 * nAnti, faces: 2 * nAnti + 2, verts: 2 * nAnti },
      ]);
      // Olympiad 2: Koch Snowflake perimeter multiplier ratio (4/3)^n from P0 = 81 * m
      const kPow = randInt(rng, 2, 4);
      const mKoch = randInt(rng, 1, 5);
      const p0Koch = 81 * mKoch;
      const pEndKoch = p0Koch * Math.pow(4, kPow) / Math.pow(3, kPow);

      // Olympiad 3: Exact exposed surface area of 2x2 unit cube stack resting on table
      const h11 = randInt(rng, 2, 6);
      const h12 = randInt(rng, 1, 5);
      const h21 = randInt(rng, 1, 5);
      const h22 = randInt(rng, 2, 7);
      const expVert =
        h11 + h12 + h21 + h22 +
        h11 + h21 + h12 + h22 +
        Math.abs(h11 - h12) + Math.abs(h21 - h22) + Math.abs(h11 - h21) + Math.abs(h12 - h22);
      const totalCubesSA = h11 + h12 + h21 + h22;
      const totalSAWithBase = 8 + expVert;
      const totalSAOnTable = 4 + expVert;

      // Olympiad 4: Max minus Min cubes on a 2x2 grid with front=(pHi, pLo) and side=(pHi, pLo)
      const pHi = randInt(rng, 4, 10);
      const pLo = randInt(rng, 1, pHi - 1);
      const minC = pHi + pLo + 2;
      const diffMaxMin = pHi + 3 * pLo - minC;

      pool.push(
        makeChQ(
          uid('o-p2c4-soccer'),
          'short-answer',
          `A convex polyhedron is built from ${polySet.desc}. Using Euler’s Formula F + V − E = 2, find the exact number of VERTICES V.`,
          `${polySet.verts}`,
          [`${polySet.edges}`, `${polySet.verts + 6}`, `${polySet.verts - 2}`],
          `Total faces F = ${polySet.faces}. Each edge joins 2 faces, so E = (total polygon sides) ÷ 2 = ${polySet.edges}. Then V = E − F + 2 = ${polySet.verts}.`,
          'Module 4.4',
          rng
        ),
        makeChQ(
          uid('o-p2c4-kochratio'),
          'short-answer',
          `A Koch Snowflake starts with perimeter P₀ = ${p0Koch} cm at Step 0. If each iteration replaces every straight segment with 4 segments of 1/3 the length, what is its exact perimeter (in cm) at Step ${kPow}?`,
          `${pEndKoch}`,
          [`${p0Koch * Math.pow(4, kPow)}`, `${p0Koch + kPow * 27}`, `${pEndKoch - 12}`],
          `Each step multiplies perimeter by 4/3: P_${kPow} = ${p0Koch} × (4/3)^${kPow} = ${pEndKoch} cm.`,
          'Module 4.3',
          rng
        ),
        makeChQ(
          uid('o-p2c4-voxelpaint'),
          'short-answer',
          `A solid 3D tower of ${totalCubesSA} unit cubes is built on a 2×2 table with column heights [[${h11}, ${h12}], [${h21}, ${h22}]]. If you spray-paint all EXPOSED faces (including top and all side walls, but NOT the bottom resting on the table), how many 1×1 square faces get painted?`,
          `${totalSAOnTable}`,
          [`${totalSAWithBase}`, `${6 * totalCubesSA}`, `${totalSAOnTable - 4}`],
          `Top view shows 4 unit faces. Sum the 8 outer wall heights (${2 * totalCubesSA}) plus 4 internal step differences (${Math.abs(h11 - h12) + Math.abs(h21 - h22) + Math.abs(h11 - h21) + Math.abs(h12 - h22)}) + 4 top = ${totalSAOnTable}.`,
          'Module 4.7',
          rng
        ),
        makeChQ(
          uid('o-p2c4-minmax'),
          'short-answer',
          `A cube building stands on all 4 squares of a 2×2 base. Both its Front and Side views show column heights (${pHi}, ${pLo}). Find (Maximum possible cubes) − (Minimum possible cubes).`,
          `${diffMaxMin}`,
          [`${pHi - pLo}`, `${2 * pLo}`, `${diffMaxMin + 2}`],
          `Max = ${pHi} + 3(${pLo}) = ${pHi + 3 * pLo}; Min = ${pHi} + ${pLo} + 2 = ${minC}. Difference = ${diffMaxMin}.`,
          'Module 4.7',
          rng
        )
      );
    }
  }

  // =========================================================================
  // PART II · CHAPTER 5: TALES BY DOTS AND LINES
  // =========================================================================
  if (includeCh('ch12-dots-and-lines', 2)) {
    if (difficulty === 1) {
      const m = randInt(rng, 6, 45);
      const medMid = randInt(rng, 12, 32);
      pool.push(
        makeChQ(
          uid('f-p2c5-mean'),
          'short-answer',
          `Find the mean (average) of ${m - 2}, ${m}, and ${m + 2}.`,
          `${m}`,
          [`${m + 2}`, `${m - 2}`, `${3 * m}`],
          `(${m - 2} + ${m} + ${m + 2}) ÷ 3 = ${m}.`,
          'Module 5.1',
          rng
        ),
        makeChQ(
          uid('f-p2c5-med'),
          'short-answer',
          `Find the median of [4, 9, ${medMid}, 35, 42].`,
          `${medMid}`,
          [`9`, `35`, `${Math.round((90 + medMid) / 5)}`],
          `The middle (3rd) value of 5 sorted numbers is ${medMid}.`,
          'Module 5.2',
          rng
        )
      );
    } else if (difficulty === 3) {
      const n = randInt(rng, 5, 12);
      const meanOld = randInt(rng, 22, 58);
      const delta = randInt(rng, 2, 6);
      const addedScore = meanOld + (n + 1) * delta;
      const baseSc = randInt(rng, 8, 16);
      const cA = randInt(rng, 3, 7);
      const cB = randInt(rng, 4, 8);
      const cC = 20 - cA - cB;
      const wSum = cA * baseSc + cB * (baseSc + 5) + cC * (baseSc + 10);
      const wMean = Number((wSum / 20).toFixed(2));
      pool.push(
        makeChQ(
          uid('c-p2c5-newmean'),
          'short-answer',
          `The mean of ${n} tests is ${meanOld}. After 1 new test is added, the mean rises to ${meanOld + delta}. What was the score on the new test?`,
          `${addedScore}`,
          [`${meanOld + delta}`, `${meanOld + n * delta}`, `${addedScore - delta}`],
          `New total = ${n + 1} × ${meanOld + delta} = ${(n + 1) * (meanOld + delta)}; old total = ${n * meanOld}. Difference = ${addedScore}.`,
          'Module 5.3',
          rng
        ),
        makeChQ(
          uid('c-p2c5-freq'),
          'short-answer',
          `In a 20-student quiz, ${cA} students scored ${baseSc}, ${cB} students scored ${baseSc + 5}, and ${cC} students scored ${baseSc + 10}. Find the exact weighted mean score.`,
          `${wMean}`,
          [`${baseSc + 5}`, `${Number((wMean + 1.5).toFixed(2))}`, `${Number((wMean - 1).toFixed(2))}`],
          `(${cA * baseSc} + ${cB * (baseSc + 5)} + ${cC * (baseSc + 10)}) ÷ 20 = ${wSum} ÷ 20 = ${wMean}.`,
          'Module 5.4',
          rng
        )
      );
    } else if (difficulty === 4) {
      // Olympiad 1: Removing both highest H and lowest L shifts mean
      const nCnt = randInt(rng, 8, 18);
      const mOrig = randInt(rng, 52, 82);
      const mNew = mOrig - randInt(rng, 2, 6);
      const hlSum = nCnt * mOrig - (nCnt - 2) * mNew;

      // Olympiad 2: Two-group weighted mean solve for n2 (ratio 2:1 -> combined = m1 + (m2 - m1)/3)
      const n1 = 2 * randInt(rng, 5, 16);
      const gapBase = randInt(rng, 3, 6);
      const m1 = randInt(rng, 64, 74);
      const m2 = m1 + 3 * gapBase;
      const mComb = m1 + gapBase;
      const n2 = n1 / 2;

      // Olympiad 3: 5 distinct positive integers [a, b, M, d, e] with median M and mean X -> max possible e!
      const medVal = randInt(rng, 14, 24);
      const mean5 = medVal + randInt(rng, 4, 9);
      const sum5 = 5 * mean5;
      // Minimize a, b, d: a=1, b=2, c=medVal, d=medVal+1 => eMax = sum5 - (1 + 2 + medVal + medVal + 1)
      const eMax = sum5 - (2 * medVal + 4);

      // Olympiad 4: Spreadsheet absolute/relative formula trace
      const a1 = randInt(rng, 3, 9);
      const b4 = randInt(rng, 4, 12);
      const c1 = randInt(rng, 5, 15);
      const sheetAns = a1 * b4 + c1;

      pool.push(
        makeChQ(
          uid('o-p2c5-trim'),
          'short-answer',
          `The mean of ${nCnt} test scores is ${mOrig}. When BOTH the single highest score H and single lowest score L are removed, the mean of the remaining ${nCnt - 2} scores drops to ${mNew}. Find H + L.`,
          `${hlSum}`,
          [`${2 * mOrig}`, `${hlSum - 10}`, `${hlSum + mNew}`],
          `Total of all ${nCnt} scores = ${nCnt * mOrig}. Remaining ${nCnt - 2} sum = ${(nCnt - 2) * mNew}. Thus H + L = ${nCnt * mOrig} − ${(nCnt - 2) * mNew} = ${hlSum}.`,
          'Module 5.3',
          rng
        ),
        makeChQ(
          uid('o-p2c5-wmean'),
          'short-answer',
          `Section A (${n1} students) has an average score of ${m1}. Section B has an average of ${m2}. If the combined average of both sections is ${mComb}, how many students are in Section B?`,
          `${n2}`,
          [`${n1}`, `${n2 * 3}`, `${n2 + 4}`],
          `Using balance deviations around ${mComb}: A has ${n1}×(−${gapBase}) = −${gapBase * n1}; B contributes +${2 * gapBase} per student, so n_B = ${gapBase * n1} ÷ ${2 * gapBase} = ${n2}.`,
          'Module 5.1',
          rng
        ),
        makeChQ(
          uid('o-p2c5-maxelem'),
          'short-answer',
          `Five DISTINCT positive integers have a median of ${medVal} and an arithmetic mean of ${mean5}. What is the MAXIMUM possible value of the largest integer among the five?`,
          `${eMax}`,
          [`${eMax + 2}`, `${eMax - 3}`, `${sum5 - 3 * medVal}`],
          `Total sum = 5 × ${mean5} = ${sum5}. To maximize the 5th term, minimize the first four distinct positive integers while keeping median ${medVal}: [1, 2, ${medVal}, ${medVal + 1}] ⇒ max = ${sum5} − ${2 * medVal + 4} = ${eMax}.`,
          'Module 5.2',
          rng
        ),
        makeChQ(
          uid('o-p2c5-sheet'),
          'short-answer',
          `In a spreadsheet, cell D2 holds "=$A$1 * B2 + C$1" and is dragged down 2 rows to D4. If A1 = ${a1}, B4 = ${b4}, and C1 = ${c1}, what value does D4 display?`,
          `${sheetAns}`,
          [`${a1 * b4}`, `${a1 + b4 + c1}`, `${sheetAns + c1}`],
          `$A$1 and C$1 lock row 1, while relative B2 shifts 2 rows down to B4: D4 = A1 × B4 + C1 = ${a1} × ${b4} + ${c1} = ${sheetAns}.`,
          'Module 5.5',
          rng
        )
      );
    }
  }

  // =========================================================================
  // PART II · CHAPTER 6: ALGEBRA PLAY
  // =========================================================================
  if (includeCh('ch13-algebra-play', 2)) {
    if (difficulty === 1) {
      const c = randInt(rng, 8, 22);
      const pa = randInt(rng, 2, 8);
      const pb = randInt(rng, 2, 9);
      const pc = randInt(rng, 2, 8);
      const pTop = pa + 2 * pb + pc;
      pool.push(
        makeChQ(
          uid('f-p2c6-cal5'),
          'short-answer',
          `In a calendar \`+\` cross of 5 dates centered at ${c}, what is the sum of all 5 dates?`,
          `${5 * c}`,
          [`${4 * c}`, `${9 * c}`, `${5 * c + 7}`],
          `5 × ${c} = ${5 * c}.`,
          'Module 6.6',
          rng
        ),
        makeChQ(
          uid('f-p2c6-pyr'),
          'short-answer',
          `In a 3-row number pyramid with base [${pa}, ${pb}, ${pc}], find the top brick (a + 2b + c).`,
          `${pTop}`,
          [`${pa + pb + pc}`, `${pTop - pb}`, `${pTop + pb}`],
          `${pa} + 2(${pb}) + ${pc} = ${pTop}.`,
          'Module 6.3',
          rng
        )
      );
    } else if (difficulty === 3) {
      const a = randInt(rng, 2, 9);
      const b = randInt(rng, 4, 14);
      const c = randInt(rng, 3, 11);
      const top = a + 2 * b + c;
      const cCalMid = randInt(rng, 8, 22);
      pool.push(
        makeChQ(
          uid('c-p2c6-revpyr'),
          'short-answer',
          `In a 3-row number pyramid with base [${a}, b, ${c}], the top apex brick is ${top}. Solve backwards for the middle base brick b.`,
          `${b}`,
          [`${b + 2}`, `${Math.max(1, b - 1)}`, `${top - a - c}`],
          `${a} + 2b + ${c} = ${top} ⇒ 2b = ${2 * b} ⇒ b = ${b}.`,
          'Module 6.4',
          rng
        ),
        makeChQ(
          uid('c-p2c6-calplus'),
          'short-answer',
          `In a 3×3 calendar square, the sum of the 4 corner dates equals 4C (where C is the center date). If the 4 corners sum to ${4 * cCalMid}, what is the CENTER date C?`,
          `${cCalMid}`,
          [`${cCalMid - 1}`, `${cCalMid + 1}`, `${cCalMid + 7}`],
          `The 4 corners are (C−8)+(C−6)+(C+6)+(C+8) = 4C = ${4 * cCalMid} ⇒ C = ${cCalMid}.`,
          'Module 6.6',
          rng
        )
      );
    } else if (difficulty === 4) {
      // Olympiad 1: 4-row Virahanka Binomial Pyramid reverse solve: Top = a + 3b + 3c + d!
      const a4 = randInt(rng, 2, 10);
      const b4 = randInt(rng, 3, 14);
      const c4 = randInt(rng, 4, 16);
      const d4 = randInt(rng, 1, 11);
      const apex4 = a4 + 3 * b4 + 3 * c4 + d4;

      // Olympiad 2: Karim & The Genie N-shrine backwards doubling-and-fee puzzle
      const nShrines = pick(rng, [2, 3, 4, 5]);
      const feeF = Math.pow(2, nShrines) * randInt(rng, 2, 9);
      const startCoins = (feeF * (Math.pow(2, nShrines) - 1)) / Math.pow(2, nShrines);

      // Olympiad 3: Calendar 4 corners + center = 5c => find top-left corner c - 8
      const cCal = randInt(rng, 9, 22);
      const cornerCenterSum = 5 * cCal;

      // Olympiad 4: Cyclic 3-digit sum (ABC + BCA + CAB) / (A + B + C) = 111
      const sumABC = randInt(rng, 8, 26);
      const cyclicSum = 111 * sumABC;

      pool.push(
        makeChQ(
          uid('o-p2c6-pyr4'),
          'short-answer',
          `A 4-row Virahāṅka Number Pyramid has base [${a4}, b, ${c4}, ${d4}] and top apex ${apex4} (where each brick equals the sum of the two below it). Solve for the missing base brick b.`,
          `${b4}`,
          [`${b4 + 1}`, `${b4 - 1}`, `${apex4 - a4 - c4 - d4}`],
          `By binomial weights [1, 3, 3, 1], Top = ${a4} + 3b + 3(${c4}) + ${d4} = ${apex4} ⇒ 3b = ${3 * b4} ⇒ b = ${b4}.`,
          'Module 6.4',
          rng
        ),
        makeChQ(
          uid('o-p2c6-genie'),
          'short-answer',
          `Karim visits ${nShrines} magical shrines in a row. At each shrine, his coins DOUBLE first, and he immediately pays ₹${feeF} as an offering. After paying at the ${nShrines}th shrine, he has ₹0 left. How many rupees did Karim start with?`,
          `${startCoins}`,
          [`${feeF}`, `${startCoins + 4}`, `${Math.round(feeF / 2)}`],
          `Work backwards: before the last offering he had ${feeF}, so before doubling ${feeF / 2}; repeating ${nShrines} steps gives S = ${feeF}×(${Math.pow(2, nShrines) - 1}/${Math.pow(2, nShrines)}) = ₹${startCoins}.`,
          'Module 6.5',
          rng
        ),
        makeChQ(
          uid('o-p2c6-cal5'),
          'short-answer',
          `In a 3×3 square on a standard 7-column calendar, the sum of the 4 corner dates PLUS the center date is ${cornerCenterSum}. What is the TOP-LEFT corner date?`,
          `${cCal - 8}`,
          [`${cCal}`, `${cCal - 7}`, `${cCal - 6}`],
          `4 corners + center = 5c = ${cornerCenterSum} ⇒ center c = ${cCal}. The top-left corner is c − 8 = ${cCal - 8}.`,
          'Module 6.6',
          rng
        ),
        makeChQ(
          uid('o-p2c6-cyclic'),
          'short-answer',
          `If the three 3-digit numbers ABC, BCA, and CAB add up to ${cyclicSum.toLocaleString()}, what is the sum of the three digits (A + B + C)?`,
          `${sumABC}`,
          [`${sumABC - 1}`, `${Math.round(cyclicSum / 100)}`, `${sumABC + 3}`],
          `ABC + BCA + CAB = 111(A + B + C) = ${cyclicSum} ⇒ A + B + C = ${cyclicSum} ÷ 111 = ${sumABC}.`,
          'Module 6.7',
          rng
        )
      );
    }
  }

  // =========================================================================
  // PART II · CHAPTER 7: AREA
  // =========================================================================
  if (includeCh('ch14-area', 2)) {
    if (difficulty === 1) {
      const b = randInt(rng, 4, 10) * 2;
      const h = randInt(rng, 3, 9);
      pool.push(
        makeChQ(
          uid('f-p2c7-tri'),
          'short-answer',
          `Find the area (in cm²) of a triangle with base ${b} cm and height ${h} cm.`,
          `${(b * h) / 2}`,
          [`${b * h}`, `${b + h}`, `${(b * h) / 2 + 4}`],
          `Area = ½ × ${b} × ${h} = ${(b * h) / 2} cm².`,
          'Module 7.1',
          rng
        ),
        makeChQ(
          uid('f-p2c7-para'),
          'short-answer',
          `A parallelogram has base ${b} cm and height ${h} cm. Find its area (in cm²).`,
          `${b * h}`,
          [`${(b * h) / 2}`, `${2 * (b + h)}`, `${b * h + b}`],
          `Area = base × height = ${b} × ${h} = ${b * h} cm².`,
          'Module 7.4',
          rng
        )
      );
    } else if (difficulty === 3) {
      const h = randInt(rng, 4, 11) * 2;
      const a = randInt(rng, 8, 20);
      const b = a + randInt(rng, 6, 16);
      const areaT = 0.5 * h * (a + b);
      const pL = randInt(rng, 14, 30);
      const pW = randInt(rng, 10, pL - 2);
      const pBorder = randInt(rng, 1, 4);
      const borderArea = (pL + 2 * pBorder) * (pW + 2 * pBorder) - pL * pW;
      pool.push(
        makeChQ(
          uid('c-p2c7-revtrap'),
          'short-answer',
          `A trapezium has area ${areaT} cm², perpendicular height ${h} cm, and one parallel base ${a} cm. Find the length of the OTHER parallel base (in cm).`,
          `${b}`,
          [`${a}`, `${b + 4}`, `${Math.round(areaT / h)}`],
          `a + b = (2 × ${areaT}) ÷ ${h} = ${a + b} ⇒ b = ${a + b} − ${a} = ${b} cm.`,
          'Module 7.6',
          rng
        ),
        makeChQ(
          uid('c-p2c7-border'),
          'short-answer',
          `A ${pL} m × ${pW} m rectangular pool is surrounded on the outside by a uniform ${pBorder} m tiled path. Find the area of ONLY the tiled path (in m²).`,
          `${borderArea}`,
          [`${pL * pW}`, `${(pL + 2 * pBorder) * (pW + 2 * pBorder)}`, `${borderArea - 16}`],
          `Outer dimensions = ${pL + 2 * pBorder} m × ${pW + 2 * pBorder} m. Subtract inner pool ${pL} × ${pW} = ${pL * pW} m² ⇒ ${borderArea} m².`,
          'Module 7.7',
          rng
        )
      );
    } else if (difficulty === 4) {
      // Olympiad 1: Isosceles trapezium with slant sides -> extract height via Pythagoras -> find area!
      const isoBase = pick(rng, [
        { a: 10, b: 16, slant: 5, h: 4, area: 52 },
        { a: 12, b: 22, slant: 13, h: 12, area: 204 },
        { a: 14, b: 30, slant: 17, h: 15, area: 330 },
        { a: 18, b: 30, slant: 10, h: 8, area: 192 },
      ]);
      const isoK = randInt(rng, 1, 5);
      const isoTrap = {
        a: isoBase.a * isoK,
        b: isoBase.b * isoK,
        slant: isoBase.slant * isoK,
        h: isoBase.h * isoK,
        area: isoBase.area * isoK * isoK,
      };

      // Olympiad 2: Rhombus given Perimeter and ONE diagonal -> find Area!
      const rhomBase = pick(rng, [
        { s: 13, d1: 10, d2: 24, area: 120 },
        { s: 17, d1: 16, d2: 30, area: 240 },
        { s: 25, d1: 14, d2: 48, area: 336 },
        { s: 5, d1: 6, d2: 8, area: 24 },
      ]);
      const rK = randInt(rng, 1, 4);
      const rhomPerim = {
        s: rhomBase.s * rK,
        d1: rhomBase.d1 * rK,
        d2: rhomBase.d2 * rK,
        area: rhomBase.area * rK * rK,
      };

      // Olympiad 3: Crossroads inside L x W garden -> planted area (L - w)(W - w)
      const lG = randInt(rng, 32, 65);
      const wG = randInt(rng, 22, 40);
      const pathW = randInt(rng, 3, 6);
      const plantedArea = (lG - pathW) * (wG - pathW);

      // Olympiad 4: Triangle median chain: E midpoint of median AD in △ABC -> Area(△BDE) = K/4
      const areaABC = 4 * randInt(rng, 12, 60);
      const areaBDE = areaABC / 4;

      pool.push(
        makeChQ(
          uid('o-p2c7-isotrap'),
          'short-answer',
          `An isosceles trapezium has parallel bases of ${isoTrap.a} cm and ${isoTrap.b} cm, and BOTH non-parallel slant sides measure ${isoTrap.slant} cm. Find the AREA of the trapezium (in cm²).`,
          `${isoTrap.area}`,
          [`${(isoTrap.a + isoTrap.b) * isoTrap.slant * 0.5}`, `${isoTrap.area + isoTrap.h}`, `${isoTrap.b * isoTrap.h}`],
          `Half base difference = (${isoTrap.b} − ${isoTrap.a}) ÷ 2 = ${(isoTrap.b - isoTrap.a) / 2} cm. Height h = √(${isoTrap.slant}² − ${(isoTrap.b - isoTrap.a) / 2}²) = ${isoTrap.h} cm. Area = ½(${isoTrap.a} + ${isoTrap.b})(${isoTrap.h}) = ${isoTrap.area} cm².`,
          'Module 7.6',
          rng
        ),
        makeChQ(
          uid('o-p2c7-rhomperim'),
          'short-answer',
          `A rhombus has perimeter ${4 * rhomPerim.s} cm and one diagonal of length ${rhomPerim.d1} cm. Find the AREA of the rhombus (in cm²).`,
          `${rhomPerim.area}`,
          [`${rhomPerim.s * rhomPerim.d1}`, `${rhomPerim.area / 2}`, `${rhomPerim.d1 * rhomPerim.d2}`],
          `Side s = ${4 * rhomPerim.s} ÷ 4 = ${rhomPerim.s} cm, half-diagonal = ${rhomPerim.d1 / 2} cm. Other half-diagonal = √(${rhomPerim.s}² − ${rhomPerim.d1 / 2}²) = ${rhomPerim.d2 / 2} cm ⇒ d₂ = ${rhomPerim.d2} cm. Area = ½ × ${rhomPerim.d1} × ${rhomPerim.d2} = ${rhomPerim.area} cm².`,
          'Module 7.5',
          rng
        ),
        makeChQ(
          uid('o-p2c7-crossroads'),
          'short-answer',
          `Two perpendicular roads of uniform width ${pathW} m run straight through the center of a ${lG} m × ${wG} m rectangular park (parallel to its sides). Find the remaining LAWN area excluding the roads (in m²).`,
          `${plantedArea}`,
          [`${lG * wG - pathW * (lG + wG)}`, `${pathW * (lG + wG - pathW)}`, `${plantedArea + pathW * pathW}`],
          `Sliding the lawn quadrants together closes the crossroads into a (${lG} − ${pathW}) × (${wG} − ${pathW}) rectangle = ${lG - pathW} × ${wG - pathW} = ${plantedArea} m².`,
          'Module 7.4',
          rng
        ),
        makeChQ(
          uid('o-p2c7-median'),
          'short-answer',
          `In △ABC of total area ${areaABC} cm², D is the midpoint of side BC, and E is the midpoint of median AD. Find the area of △BDE (in cm²).`,
          `${areaBDE}`,
          [`${areaABC / 2}`, `${areaABC / 3}`, `${areaBDE + 4}`],
          `Median AD splits △ABC into equal halves: Area(△ABD) = ${areaABC / 2} cm². Median BE of △ABD splits it in half again: Area(△BDE) = ${areaABC / 2} ÷ 2 = ${areaBDE} cm².`,
          'Module 7.2',
          rng
        )
      );
    }
  }

  return pool;
}

/** Maps any of the 98 M1-M7 moduleIds strictly to its parent teaching chapterId. */
function resolveChapterForModuleId(moduleId: string): ChapterId | null {
  if (moduleId.startsWith('mod-1-')) return 'ch1-square-cube';
  if (moduleId.startsWith('mod-2-')) return 'ch2-power-play';
  if (moduleId.startsWith('mod-3-')) return 'ch3-story-numbers';
  if (moduleId.startsWith('mod-4-')) return 'ch4-quadrilaterals';
  if (moduleId.startsWith('mod-5-')) return 'ch5-number-play';
  if (moduleId.startsWith('mod-6-')) return 'ch6-we-distribute';
  if (moduleId.startsWith('mod-7-')) return 'ch7-proportional-1';
  if (moduleId.startsWith('p2-mod-1-')) return 'ch4-fractions-disguise';
  if (moduleId.startsWith('p2-mod-2-')) return 'ch5-baudhayana-pythagoras';
  if (moduleId.startsWith('p2-mod-3-')) return 'ch6-proportional-reasoning';
  if (moduleId.startsWith('p2-mod-4-')) return 'ch11-geometric-themes';
  if (moduleId.startsWith('p2-mod-5-')) return 'ch12-dots-and-lines';
  if (moduleId.startsWith('p2-ch6-m')) return 'ch13-algebra-play';
  if (moduleId.startsWith('p2-mod-7-')) return 'ch14-area';
  return null;
}

function toModuleChallenge(q: Omit<ChapterAssessmentQuestion, 'questionNumber'>): ModuleGameChallenge {
  return {
    prompt: q.prompt,
    clue: `Ref: ${q.moduleRef} · Step carefully through every constraint.`,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
  };
}

/**
 * Generates ≥ 5 strictly module/chapter-scoped Foundation (1), Challenger (3),
 * or Olympiad (4) questions for EVERY one of the 98 M1-M7 modules so Slide 5
 * Module Recap Quizzes genuinely match the selected difficulty level!
 */
export function generateTieredModulePool(
  moduleId: string,
  randomSeed: number,
  difficulty: QuizDifficultyLevel
): ModuleGameChallenge[] {
  const chapterId = resolveChapterForModuleId(moduleId);
  if (!chapterId) return [];

  let modHash = 0;
  for (let i = 0; i < moduleId.length; i++) {
    modHash = (modHash * 31 + moduleId.charCodeAt(i)) % 1000003;
  }

  const exactOut: ModuleGameChallenge[] = [];
  const seen = new Set<string>();

  const modMatch = moduleId.match(/(\d+)$/);
  const modNum = modMatch ? Number(modMatch[1]) : 1;

  for (let sweep = 0; sweep < 10; sweep++) {
    const rng = seededRng(randomSeed * 1009 + modHash * 17 + sweep * 7919 + difficulty * 313 + 41);
    const candidates = generateTieredChapterPool(chapterId, rng, difficulty);
    for (const c of candidates) {
      if (!c.moduleRef.endsWith(`.${modNum}`)) continue;
      const challenge = toModuleChallenge(c);
      const key = challenge.prompt.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      exactOut.push(challenge);
    }
    if (exactOut.length >= 6) break;
  }

  return exactOut;
}

