import { ModuleGameChallenge } from '../types/part1Curriculum';
import type { QuizDifficultyLevel } from './quizDifficulty';
import { generateStrictModuleTieredQuestions } from './moduleStrictTieredBank';

function seededRng(seed: number): () => number {
  let s = ((Math.abs(Math.floor(seed)) || 1) % 2147483647) || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function rawRi(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function scaledRi(
  rng: () => number,
  min: number,
  max: number,
  difficulty: QuizDifficultyLevel
): number {
  const span = max - min;
  // Preserve 0-based array index picks and tiny boolean/discrete ranges untouched
  if (min <= 0 || span <= 2) {
    return rawRi(rng, min, max);
  }
  let lo = min;
  let hi = max;
  if (difficulty === 1) {
    hi = Math.min(max, min + Math.max(1, Math.floor(span * 0.45)));
  } else if (difficulty === 2) {
    lo = min + Math.floor(span * 0.15);
    hi = max - Math.floor(span * 0.15);
    if (hi < lo) hi = lo;
  } else if (difficulty === 3) {
    lo = min + Math.floor(span * 0.45);
  } else {
    lo = min + Math.floor(span * 0.65);
  }
  return rawRi(rng, lo, hi);
}

function mq(
  prompt: string,
  clue: string,
  correctOption: string,
  distractors: string[],
  explanation: string,
  rng: () => number
): ModuleGameChallenge {
  const unique = [correctOption];
  for (const d of distractors) {
    if (d && !unique.includes(d)) unique.push(d);
  }
  let pad = 1;
  while (unique.length < 4) {
    const candidate = String(Number(correctOption.replace(/[^0-9-]/g, '') || 5) + pad * 2);
    if (!unique.includes(candidate)) unique.push(candidate);
    pad++;
  }
  const sliced = unique.slice(0, 4);
  const tagged = sliced.map((val, i) => ({ val, ok: i === 0 }));
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [tagged[i], tagged[j]] = [tagged[j], tagged[i]];
  }
  return {
    prompt,
    clue,
    options: tagged.map((t) => t.val),
    correctIndex: tagged.findIndex((t) => t.ok),
    explanation,
  };
}

/**
 * Generates strictly module-specific, parameterized recap questions for EVERY ONE
 * of the 98 M1-M7 modules across Part I (Chapters 1-7) and Part II (Chapters 1-7).
 * Zero cross-chapter contamination and zero generic/off-topic math questions.
 */
export function generateModuleSpecificQuestions(
  moduleId: string,
  randomSeed: number = 0,
  difficulty: QuizDifficultyLevel = 2
): ModuleGameChallenge[] {
  if (difficulty === 1 || difficulty === 3 || difficulty === 4) {
    const tiered = generateStrictModuleTieredQuestions(moduleId, randomSeed, difficulty);
    if (tiered.length > 0) {
      return tiered;
    }
  }

  const rng = seededRng(randomSeed * 997 + moduleId.length * 131 + difficulty * 211 + 37);
  const ri = (r: () => number, min: number, max: number) => scaledRi(r, min, max, difficulty);

  switch (moduleId) {
    // =========================================================================
    // PART I — CHAPTER 1: A SQUARE AND A CUBE
    // =========================================================================
    case 'mod-1-1': {
      const k = ri(rng, 4, 12);
      const sq = k * k;
      const nonSq = sq + 3;
      const factorsLimit = ri(rng, 4, 9) * 20;
      const openCount = Math.floor(Math.sqrt(factorsLimit));
      return [
        mq(
          `How many factors does the perfect square ${sq} (${k}²) have?`,
          'Non-squares have an EVEN number of factors; perfect squares always have an ODD number of factors.',
          'An odd number of factors',
          ['An even number of factors', 'Exactly 2 factors', 'Exactly 4 factors'],
          `Factor pairs of ${sq} meet at ${k} × ${k}, so ${k} is paired with itself, leaving an ODD total factor count.`,
          rng
        ),
        mq(
          `In the Locker Toggle puzzle up to ${factorsLimit} lockers, how many lockers stay OPEN at the end?`,
          'Only perfect-square locker numbers ≤ N stay open.',
          `${openCount} lockers`,
          [`${openCount + 2} lockers`, `${openCount - 1} lockers`, `${factorsLimit / 2} lockers`],
          `Every locker up to ${factorsLimit} that is a perfect square stays open: 1² up to ${openCount}² = ${openCount} lockers.`,
          rng
        ),
        mq(
          `Which locker number stays CLOSED at the end of the 200-locker challenge?`,
          `Check whether the locker number is a perfect square (${sq} = ${k}²) or non-square (${nonSq}).`,
          `Locker #${nonSq}`,
          [`Locker #${sq}`, 'Locker #144', 'Locker #169'],
          `${nonSq} is not a perfect square, so its factors pair evenly and it returns to CLOSED.`,
          rng
        ),
        mq(
          `A square patio is tiled using ${sq} square stone slabs of side 1 m. How many slabs line each edge?`,
          'Edge length = √(Area).',
          `${k} slabs`,
          [`${k + 2} slabs`, `${Math.max(2, k - 2)} slabs`, `${sq / 2} slabs`],
          `${k} × ${k} = ${sq}, so each edge of the square patio has ${k} stone slabs.`,
          rng
        ),
        ...(difficulty >= 3
          ? [
              mq(
                `If ${sq} is a perfect square (${k}²), what is the NEXT smallest perfect square strictly larger than ${sq} × 4?`,
                `Note that ${k}² × 4 = (2 × ${k})² = ${(2 * k)}². The next perfect square is (${2 * k + 1})².`,
                `${(2 * k + 1) * (2 * k + 1)}`,
                [
                  `${(2 * k) * (2 * k)}`,
                  `${(2 * k + 2) * (2 * k + 2)}`,
                  `${sq * 4 + 1}`,
                ],
                `4 × ${k}² = (${2 * k})², so the very next perfect square integer is (${2 * k + 1})² = ${(2 * k + 1) * (2 * k + 1)}.`,
                rng
              ),
            ]
          : []),
      ];
    }

    case 'mod-1-2': {
      const badEnd = [2, 3, 7, 8][ri(rng, 0, 3)];
      const n5 = ri(rng, 2, 8);
      const val5 = n5 * 10 + 5;
      const sq5 = n5 * (n5 + 1) * 100 + 25;
      const z = ri(rng, 1, 3);
      return [
        mq(
          `Why can the number ${ri(rng, 12, 95)}${badEnd} NEVER be a perfect square?`,
          'Perfect squares can only end in 0, 1, 4, 5, 6, or 9.',
          `No perfect square ends in ${badEnd}`,
          ['Because it is too large', 'Because its digits add to an odd number', 'Because it is not divisible by 4'],
          `Squaring any integer 0–9 never produces unit digit 2, 3, 7, or 8.`,
          rng
        ),
        mq(
          `Compute ${val5}² using the shortcut for squaring a number ending in 5:`,
          `Multiply ${n5} × (${n5} + 1) and append 25.`,
          `${sq5}`,
          [`${sq5 - 100}`, `${sq5 + 100}`, `${n5 * n5 * 100 + 25}`],
          `${n5} × ${n5 + 1} = ${n5 * (n5 + 1)}; appending 25 yields ${sq5}.`,
          rng
        ),
        mq(
          `If a number ends with ${z} zero(s), how many trailing zeros will its square end with?`,
          'Squaring doubles the number of trailing zeros.',
          `${2 * z} trailing zeros`,
          [`${z} trailing zeros`, `${z + 1} trailing zeros`, `${3 * z} trailing zeros`],
          `10^${z} squared is 10^${2 * z}, so its square always ends in ${2 * z} zeros (always an even count).`,
          rng
        ),
        mq(
          `Which of these numbers ending in zeros is a genuine perfect square?`,
          'A square needs an EVEN count of trailing zeros AND the leading part must be a square.',
          '6,400',
          ['64,000', '250', '9,000'],
          `6,400 = 64 × 100 = 8² × 10² = 80², having 2 (even) zeros and square prefix 64.`,
          rng
        ),
      ];
    }

    case 'mod-1-3': {
      const n = ri(rng, 6, 15);
      const lastOdd = 2 * n - 1;
      const base = ri(rng, 10, 25);
      return [
        mq(
          `What is the exact sum of the first ${n} consecutive odd numbers (1 + 3 + 5 + … + ${lastOdd})?`,
          'Each odd number adds an L-gnomon layer to complete an n × n square.',
          `${n * n}`,
          [`${(n - 1) * (n - 1)}`, `${n * n + n}`, `${2 * n}`],
          `The sum of the first ${n} odd natural numbers equals ${n}² = ${n * n}.`,
          rng
        ),
        mq(
          `How many natural numbers lie strictly between ${base}² and ${base + 1}²?`,
          'Between n² and (n + 1)², there are exactly 2n non-square natural numbers.',
          `${2 * base}`,
          [`${2 * base + 1}`, `${base}`, `${2 * base - 1}`],
          `Using the 2n rule between ${base}² and ${base + 1}², 2 × ${base} = ${2 * base}.`,
          rng
        ),
        mq(
          `What two consecutive triangular numbers sum to the square ${n * n}?`,
          'T(n − 1) + T(n) = n².',
          `T(${n - 1}) + T(${n}) = ${((n - 1) * n) / 2} + ${(n * (n + 1)) / 2}`,
          [`T(${n - 2}) + T(${n})`, `T(${n}) + T(${n + 1})`, `2 × T(${n})`],
          `Adding consecutive triangular numbers ${(n - 1) * n / 2} and ${n * (n + 1) / 2} gives ${n * n}.`,
          rng
        ),
        mq(
          `To expand a ${n} × ${n} square into a (${n + 1}) × (${n + 1}) square, what single odd L-gnomon must be added?`,
          'Difference (n + 1)² − n² = 2n + 1.',
          `${2 * n + 1}`,
          [`${2 * n - 1}`, `${n + 1}`, `${n * 2}`],
          `(${n + 1})² − ${n}² = 2(${n}) + 1 = ${2 * n + 1}.`,
          rng
        ),
      ];
    }

    case 'mod-1-4': {
      const m = ri(rng, 6, 12);
      const val = m * m + 4;
      const multNum = 12 * 6; // 72 -> ×2
      return [
        mq(
          `Between which two consecutive whole numbers does √${val} lie?`,
          `Compare ${val} with ${m}² = ${m * m} and ${m + 1}² = ${(m + 1) * (m + 1)}.`,
          `Between ${m} and ${m + 1}`,
          [`Between ${m - 1} and ${m}`, `Between ${m + 1} and ${m + 2}`, `Between ${m - 2} and ${m - 1}`],
          `${m}² = ${m * m} < ${val} < ${(m + 1) * (m + 1)} = ${m + 1}², so √${val} lies between ${m} and ${m + 1}.`,
          rng
        ),
        mq(
          `What is the exact value of √(0.0${m < 10 ? '0' : ''}${m * m > 99 ? (m - 3) * (m - 3) : m * m})?`.includes('0.00')
            ? 'What is √0.0081?'
            : 'What is √0.0144?',
          'Convert decimal to fraction over 10,000 before taking root.',
          m % 2 === 0 ? '0.12' : '0.09',
          ['0.012', '1.2', '0.81'],
          `Splitting 10,000 in denominator gives /100, moving decimal 2 places.`,
          rng
        ),
        mq(
          `If a perfect square has ${ri(rng, 3, 4) * 2} digits, how many digits will its square root have?`,
          'Divide digits into pairs from right: d digits → ceil(d / 2) digits.',
          `Half as many digits`,
          ['Double as many digits', 'Same number of digits', 'One fewer digit'],
          `Every 2 digits under the bar yield 1 digit in the square root.`,
          rng
        ),
        mq(
          `Find the smallest positive integer by which ${multNum} (2³ × 3²) must be multiplied to form a perfect square:`,
          'Pair all prime factors; any leftover single prime factor must be multiplied once.',
          '2',
          ['3', '6', '4'],
          `${multNum} = (2² × 3²) × 2. Multiplying by 2 pairs the lonely 2 to yield 144 = 12².`,
          rng
        ),
      ];
    }

    case 'mod-1-5': {
      const s = ri(rng, 4, 10);
      const endDigit = [2, 3, 7, 8][ri(rng, 0, 3)];
      const cubeEnd = (endDigit * endDigit * endDigit) % 10;
      return [
        mq(
          `A solid cube has edge length ${s} cm. What is its volume V = s³?`,
          'Volume of a cube = side × side × side.',
          `${s * s * s} cm³`,
          [`${s * s} cm³`, `${6 * s * s} cm³`, `${3 * s} cm³`],
          `V = ${s}³ = ${s} × ${s} × ${s} = ${s * s * s} cm³.`,
          rng
        ),
        mq(
          `What is the unit digit of (${ri(rng, 1, 9)}${endDigit})³?`,
          `Cube the unit digit ${endDigit}³ = ${endDigit ** 3}.`,
          `${cubeEnd}`,
          [`${endDigit}`, `${(cubeEnd + 3) % 10}`, `${(cubeEnd + 5) % 10}`],
          `${endDigit}³ = ${endDigit ** 3}, so any number ending in ${endDigit} has cube ending in ${cubeEnd}.`,
          rng
        ),
        mq(
          `If a number ends in 2 trailing zeros, how many trailing zeros will its CUBE end in?`,
          'Cubing triples the trailing zero count.',
          '6 trailing zeros',
          ['2 trailing zeros', '4 trailing zeros', '8 trailing zeros'],
          `(10²)³ = 10⁶, so cubing triples 2 zeros into 6 zeros.`,
          rng
        ),
        mq(
          `Which consecutive odd-number sum equals 4³ = 64?`,
          '4³ is the sum of 4 consecutive odds starting from 4×3 + 1 = 13.',
          '13 + 15 + 17 + 19',
          ['11 + 13 + 15 + 17', '15 + 17 + 19 + 21', '9 + 11 + 13 + 15'],
          `13 + 15 + 17 + 19 = 64 = 4³.`,
          rng
        ),
      ];
    }

    case 'mod-1-6': {
      return [
        mq(
          `Express 1729 as the sum of two positive cubes in TWO different ways:`,
          'Remember Hardy & Ramanujan’s famous taxi cab number!',
          '1³ + 12³ and 9³ + 10³',
          ['2³ + 12³ and 8³ + 10³', '1³ + 11³ and 7³ + 10³', '3³ + 12³ and 5³ + 11³'],
          `1 + 1728 = 1729 and 729 + 1000 = 1729.`,
          rng
        ),
        mq(
          `Which is the next smallest Taxicab number after 1729 (equal to 2³ + 16³ and 9³ + 15³)?`,
          'Compute 2³ + 16³ = 8 + 4096.',
          '4,104',
          ['4,096', '3,375', '2,197'],
          `2³ + 16³ = 8 + 4,096 = 4,104, and 9³ + 15³ = 729 + 3,375 = 4,104.`,
          rng
        ),
        mq(
          `Why is 1729 specifically called Taxicab(2)?`,
          'It is the SMALLEST natural number expressible as a³ + b³ in 2 ways.',
          'Smallest number expressible as a³ + b³ in two distinct ways',
          ['First prime number above 1700', 'Only cube divisible by 19', 'Sum of two squares in two ways'],
          `Ramanujan noted 1729 is the smallest sum of two positive cubes in two distinct ways.`,
          rng
        ),
        mq(
          `Compute the difference 10³ − 9³:`,
          '10³ = 1000 and 9³ = 729.',
          '271',
          ['217', '371', '261'],
          `1000 − 729 = 271.`,
          rng
        ),
      ];
    }

    case 'mod-1-7': {
      const k = ri(rng, 5, 9);
      const negCube = -(k * k * k);
      return [
        mq(
          `What is the exact value of ∛(${negCube})?`,
          'Cube root preserves minus sign: ∛(−a) = −∛a.',
          `−${k}`,
          [`${k}`, `−${k * k}`, `${k * k}`],
          `(−${k}) × (−${k}) × (−${k}) = ${negCube}, so ∛(${negCube}) = −${k}.`,
          rng
        ),
        mq(
          `Using the 3-digit split method, find ∛(13,824):`,
          'Tail 824 ends in 4 ⇒ units digit is 4; leading 13 lies between 2³=8 and 3³=27.',
          '24',
          ['14', '26', '34'],
          `Units digit is 4 (since 4³=64 ends in 4) and 2³ < 13 < 3³, giving tens digit 2 ⇒ 24.`,
          rng
        ),
        mq(
          `What is the smallest positive integer by which 256 (2⁸) must be DIVIDED to yield a perfect cube?`,
          'Exponents of prime factors in a perfect cube must be multiples of 3.',
          '4',
          ['2', '8', '16'],
          `256 = 2⁶ × 2² = 64 × 4. Dividing out the extra 2² = 4 leaves 64 = 4³.`,
          rng
        ),
        mq(
          `What is the cube root of 27,000?`,
          'Factor 27 × 1,000 = 3³ × 10³.',
          '30',
          ['300', '90', '3'],
          `∛(27 × 1,000) = 3 × 10 = 30.`,
          rng
        ),
      ];
    }

    // =========================================================================
    // PART I — CHAPTER 2: POWER PLAY
    // =========================================================================
    case 'mod-2-1': {
      const folds = ri(rng, 6, 10);
      const dayFull = ri(rng, 20, 30);
      return [
        mq(
          `If a paper sheet starts at 1 layer and doubles every fold, how many layers appear after ${folds} folds?`,
          'Multiply by 2 cleanly: 2ⁿ.',
          `${Math.pow(2, folds)} layers`,
          [`${2 * folds} layers`, `${Math.pow(2, folds - 1)} layers`, `${Math.pow(2, folds + 1)} layers`],
          `After ${folds} doublings, layer count = 2^${folds} = ${Math.pow(2, folds)}.`,
          rng
        ),
        mq(
          `Doubling lilypads completely fill a pond on Day ${dayFull}. On which day was the pond HALF full?`,
          'Work backward 1 day before full capacity!',
          `Day ${dayFull - 1}`,
          [`Day ${Math.floor(dayFull / 2)}`, `Day ${dayFull - 2}`, `Day ${dayFull - 5}`],
          `Since the lilypads double each day, half-full becomes full on the very next day: Day ${dayFull - 1}.`,
          rng
        ),
        mq(
          `Which grows faster after step 10: doubling (2ⁿ) or adding +1000 every step (1000n)?`,
          'Exponential growth always overtakes linear growth.',
          'Doubling (2ⁿ)',
          ['Adding +1000 (1000n)', 'They stay equal forever', 'Additive growth wins after step 20'],
          `At n=14, 2¹⁴ = 16,384 > 14,000 and keeps pulling astronomically ahead.`,
          rng
        ),
        mq(
          `A single bacterium splits into 2 every hour. How many bacteria exist after 5 hours?`,
          'Compute 2⁵.',
          '32',
          ['10', '16', '64'],
          `2⁵ = 32 bacteria after 5 hourly doublings.`,
          rng
        ),
      ];
    }

    case 'mod-2-2': {
      const p = ri(rng, 10, 25) * 2;
      return [
        mq(
          `In the exponential expression 7⁵, what are the BASE and the EXPONENT?`,
          'In aᵇ, a is the base and b is the exponent.',
          'Base = 7, Exponent = 5',
          ['Base = 5, Exponent = 7', 'Base = 35, Exponent = 1', 'Base = 7, Exponent = 7'],
          `The base being multiplied is 7, and the exponent telling how many times is 5.`,
          rng
        ),
        mq(
          `What is the exact value of (−1)^${p + 1}?`,
          '−1 raised to an ODD power stays −1; raised to an EVEN power becomes +1.',
          '−1',
          ['+1', `${-(p + 1)}`, '0'],
          `Since ${p + 1} is odd, multiplying −1 by itself ${p + 1} times leaves −1.`,
          rng
        ),
        mq(
          `Express 5 × 5 × 3 × 3 × 3 in concise exponential notation:`,
          'Group identical factors as bases with powers.',
          '5² × 3³',
          ['15⁵', '5³ × 3²', '15⁶'],
          `Two factors of 5 give 5² and three factors of 3 give 3³: 5² × 3³.`,
          rng
        ),
        mq(
          `Which is larger: 2⁵ or 5²?`,
          'Calculate 2⁵ = 32 and 5² = 25.',
          '2⁵ (32)',
          ['5² (25)', 'Both are equal', 'Cannot compare'],
          `2⁵ = 32 > 5² = 25.`,
          rng
        ),
      ];
    }

    case 'mod-2-3': {
      const b = ri(rng, 2, 7);
      const m = ri(rng, 4, 8);
      const n = ri(rng, 2, 5);
      return [
        mq(
          `Simplify using the Product Law: ${b}^${m} × ${b}^${n} = ?`,
          'Same base multiplied: add exponents aᵐ × aⁿ = aᵐ⁺ⁿ.',
          `${b}^${m + n}`,
          [`${b}^${m * n}`, `${b * b}^${m + n}`, `${b}^${m - n}`],
          `Keeping base ${b} and adding exponents ${m} + ${n} yields ${b}^${m + n}.`,
          rng
        ),
        mq(
          `Simplify using the Quotient Law: ${b}^${m + 3} ÷ ${b}^${n} = ?`,
          'Same base divided: subtract exponents aᵐ ÷ aⁿ = aᵐ⁻ⁿ.',
          `${b}^${m + 3 - n}`,
          [`${b}^${m + 3 + n}`, `1^${m + 3 - n}`, `${b}^${Math.max(1, n - 1)}`],
          `Subtracting exponents (${m + 3} − ${n}) gives ${b}^${m + 3 - n}.`,
          rng
        ),
        mq(
          `Find x if ${b}⁴ × ${b}ˣ = ${b}¹¹:`,
          '4 + x = 11.',
          'x = 7',
          ['x = 15', 'x = 2.75', 'x = 44'],
          `Equating exponents on same base ${b}: 4 + x = 11 ⇒ x = 7.`,
          rng
        ),
        mq(
          `Does the Product Law aᵐ × aⁿ = aᵐ⁺ⁿ apply to 2⁴ × 3⁵ without rewriting?`,
          'Bases must match!',
          'No, the bases 2 and 3 are different',
          ['Yes, it equals 6⁹', 'Yes, it equals 5⁹', 'Yes, it equals 2⁹'],
          `Product law requires identical bases; 2 and 3 cannot combine bases by adding exponents.`,
          rng
        ),
      ];
    }

    case 'mod-2-4': {
      const x = ri(rng, 2, 5);
      const y = ri(rng, 3, 4);
      return [
        mq(
          `Simplify the Power-of-a-Power expression: (${x}²)³ = ?`,
          '(aᵐ)ⁿ = aᵐˣⁿ — multiply the exponents!',
          `${x}⁶`,
          [`${x}⁵`, `${x}⁸`, `${x * 2}³`],
          `(${x}²)³ = ${x}^(2×3) = ${x}⁶.`,
          rng
        ),
        mq(
          `Simplify using Same-Exponent Product Rule: 2^${y} × 5^${y} = ?`,
          'aᵐ × bᵐ = (a × b)ᵐ.',
          `10^${y}`,
          [`7^${y}`, `10^${2 * y}`, `7^${2 * y}`],
          `2^${y} × 5^${y} = (2 × 5)^${y} = 10^${y}.`,
          rng
        ),
        mq(
          `Which is greater: (2³)² or 2^(3²)?`,
          '(2³)² = 2⁶ = 64 whereas 2^(3²) = 2⁹ = 512.',
          '2^(3²) = 512',
          ['(2³)² = 64', 'Both equal 2⁹', 'Both equal 2⁶'],
          `Parentheses multiply exponents (2⁶ = 64); tower 2^(3²) evaluates top-down first (2⁹ = 512).`,
          rng
        ),
        mq(
          `Rewrite 16⁵ with base 2:`,
          'Replace 16 with 2⁴: (2⁴)⁵.',
          '2²⁰',
          ['2⁹', '2¹⁶', '8¹⁰'],
          `16⁵ = (2⁴)⁵ = 2^(4×5) = 2²⁰.`,
          rng
        ),
      ];
    }

    case 'mod-2-5': {
      const b = ri(rng, 2, 6);
      const sq = b * b;
      return [
        mq(
          `Evaluate (${b}⁰ + 5⁰) × ${sq}:`,
          'Any non-zero base to the 0th power equals 1.',
          `${2 * sq}`,
          ['0', `${sq}`, `${(b + 5) * sq}`],
          `${b}⁰ = 1 and 5⁰ = 1, so (1 + 1) × ${sq} = ${2 * sq}.`,
          rng
        ),
        mq(
          `Write ${b}⁻² as a positive rational fraction:`,
          'a⁻ⁿ = 1 / aⁿ.',
          `1/${sq}`,
          [`−${sq}`, `−1/${sq}`, `${sq}`],
          `${b}⁻² = 1 / (${b}²) = 1/${sq}.`,
          rng
        ),
        mq(
          `Evaluate (2/5)⁻²:`,
          '(a/b)⁻ⁿ = (b/a)ⁿ.',
          '25/4',
          ['−4/25', '4/25', '−25/4'],
          `(2/5)⁻² = (5/2)² = 25/4.`,
          rng
        ),
        mq(
          `Express 10⁻³ as a decimal:`,
          '10⁻³ = 1 / 1,000.',
          '0.001',
          ['0.01', '−30', '−0.001'],
          `10⁻³ = 1/1000 = 0.001.`,
          rng
        ),
      ];
    }

    case 'mod-2-6': {
      const d = ri(rng, 2, 8);
      return [
        mq(
          `Write 0.0000${d}3 in standard scientific notation (m × 10⁻ⁿ, 1 ≤ m < 10):`,
          'Count decimal shifts right until one non-zero digit sits left of decimal.',
          `${d}.3 × 10⁻⁵`,
          [`${d}3 × 10⁻⁶`, `0.${d}3 × 10⁻⁴`, `${d}.3 × 10⁵`],
          `Moving decimal 5 places right produces ${d}.3 × 10⁻⁵.`,
          rng
        ),
        mq(
          `Express ${d},500,000 in proper scientific notation:`,
          'Count decimal shifts left from end.',
          `${d}.5 × 10⁶`,
          [`${d}5 × 10⁵`, `${d}.5 × 10⁷`, `0.${d}5 × 10⁷`],
          `Moving 6 places left yields ${d}.5 × 10⁶.`,
          rng
        ),
        mq(
          `Simplify (4 × 10⁵) × (2 × 10³) in scientific notation:`,
          'Multiply mantissas (4×2) and add powers of 10.',
          '8 × 10⁸',
          ['8 × 10¹⁵', '6 × 10⁸', '8 × 10²'],
          `(4 × 2) × 10^(5+3) = 8 × 10⁸.`,
          rng
        ),
        mq(
          `Which is larger: 4.5 × 10⁻⁴ or 8.2 × 10⁻⁶?`,
          'Larger exponent of 10 (−4 > −6) determines size first!',
          '4.5 × 10⁻⁴',
          ['8.2 × 10⁻⁶', 'Both are equal', 'Cannot tell without expanding'],
          `10⁻⁴ (0.0001) is 100 times larger than 10⁻⁶ (0.000001).`,
          rng
        ),
      ];
    }

    case 'mod-2-7': {
      return [
        mq(
          `If a chessboard doubles grains on each square (1, 2, 4, 8, ...), how many grains sit on square 11 (2¹⁰)?`,
          'Square k holds 2^(k−1) grains.',
          '1,024 grains',
          ['20 grains', '512 grains', '2,048 grains'],
          `Square 11 holds 2¹⁰ = 1,024 grains.`,
          rng
        ),
        mq(
          `Light travels ~3 × 10⁸ m/s. How far does it travel in 10³ seconds?`,
          'Distance = Speed × Time.',
          '3 × 10¹¹ m',
          ['3 × 10²⁴ m', '3 × 10⁵ m', '1.3 × 10¹¹ m'],
          `(3 × 10⁸) × 10³ = 3 × 10^(8+3) = 3 × 10¹¹ m.`,
          rng
        ),
        mq(
          `Why is 10¹⁰⁰ (a Googol) larger than the estimated number of atoms in the observable universe (~10⁸⁰)?`,
          'Each +1 on an exponent of 10 multiplies size ×10.',
          'It is 10²⁰ times larger',
          ['It is only 20 grains larger', 'It is 10 times larger', 'They are roughly equal'],
          `10¹⁰⁰ ÷ 10⁸⁰ = 10²⁰ times larger.`,
          rng
        ),
        mq(
          `How many zeros follow 1 in one billion (10⁹)?`,
          '1 billion = 1,000 × 1,000 × 1,000.',
          '9 zeros',
          ['6 zeros', '12 zeros', '3 zeros'],
          `10⁹ = 1 followed by 9 zeros (1,000,000,000).`,
          rng
        ),
      ];
    }

    // =========================================================================
    // PART I — CHAPTER 3: A STORY OF NUMBERS
    // =========================================================================
    case 'mod-3-1': {
      const morning = ri(rng, 18, 28);
      const missing = ri(rng, 2, 4);
      return [
        mq(
          `A shepherd ties 1 pebble per sheep leaving at dawn (${morning} pebbles). At dusk, ${missing} pebbles remain unmatched in the bowl. What happened?`,
          'One-to-one correspondence compares counts directly without number names.',
          `${missing} sheep are missing`,
          [`${missing} extra sheep joined`, 'All sheep returned safely', 'Counting failed without zero'],
          `Each unmatched pebble stands for 1 sheep still out, so ${missing} sheep have not returned.`,
          rng
        ),
        mq(
          `How can two teams check who gathered MORE shells without knowing how to count?`,
          'Match 1 shell from Team A with 1 shell from Team B until one pile runs out.',
          'Pair items one-to-one side by side',
          ['Estimate by pile weight only', 'Guess by color brightness', 'Wait for full moon'],
          `One-to-one correspondence determines equality or which pile has leftovers without number words.`,
          rng
        ),
        mq(
          `Why could ancient herders verify exact herd size using notched bones before inventing written digits?`,
          'One notch corresponded cleanly to one animal.',
          'Each notch matched one animal via one-to-one mapping',
          ['Bones magically multiplied counts', 'Only multiples of 10 existed', 'Notches represented fractions'],
          `A single tally notch tracks one exact unit independently of spoken number names.`,
          rng
        ),
      ];
    }

    case 'mod-3-2': {
      const gates = ri(rng, 3, 6);
      const singles = ri(rng, 1, 4);
      return [
        mq(
          `An ancient carved tally shows ${gates} five-mark bundles (𝍸) and ${singles} single strokes. What count does it represent?`,
          `Compute (${gates} × 5) + ${singles}.`,
          `${gates * 5 + singles}`,
          [`${gates + singles}`, `${gates * 10 + singles}`, `${gates * 4 + singles}`],
          `${gates} bundles of 5 equal ${gates * 5}, plus ${singles} = ${gates * 5 + singles}.`,
          rng
        ),
        mq(
          `Why did early civilizations organize tally marks into bundles of 5 or 10?`,
          'Look at your own hands!',
          'Humans have 5 fingers per hand (10 total) for instant visual subitizing',
          ['Stone chisels broke after 4 lines', '5 was the largest known number', 'Weeks had 5 days'],
          `Fingers on one/two hands naturally anchor bundling in groups of 5 and 10.`,
          rng
        ),
        mq(
          `The 20,000-year-old Ishango bone demonstrates early humans recorded what mathematical idea?`,
          'Carved grouped notches show systematic tallying.',
          'Intentional grouped counting & numerical tallies',
          ['Modern zero place value', 'Quadratic equations', 'Base-10 decimal points'],
          `Its grouped notch clusters preserve early evidence of deliberate tally recording.`,
          rng
        ),
      ];
    }

    case 'mod-3-3': {
      const g2 = ri(rng, 3, 5);
      return [
        mq(
          `In the traditional Gumulgal two-counting language (ukasar = 2, urapon = 1), how is ${2 * g2 + 1} expressed?`,
          `Count how many pairs of 2 (${g2}) plus 1 leftover.`,
          `${g2} pairs (ukasar) + urapon (1)`,
          ['One single name for every integer', 'Subtracted from 10', 'Multiples of 60'],
          `Base-2 word grouping builds numbers from pairs ("two") plus 1 ("one").`,
          rng
        ),
        mq(
          `What does a quinary (Base-5) tally system use as its main bundle size?`,
          'Quinary comes from "five".',
          'Groups of 5 (5¹, 5², ...)',
          ['Groups of 12', 'Groups of 60', 'Groups of 2'],
          `A quinary/base-5 system bundles every 5 units into the next rank.`,
          rng
        ),
        mq(
          `Which Mayan glyph represents the bundle value 5 (one horizontal bar)?`,
          'Mayan notation uses Shell=0, Dot=1, Bar=5.',
          'Horizontal Bar (—)',
          ['Single Dot (•)', 'Shell (⊝)', 'Diamond (◇)'],
          `In the Mayan system, 1 bar = 5 and 1 dot = 1.`,
          rng
        ),
      ];
    }

    case 'mod-3-4': {
      return [
        mq(
          'What is the Roman numeral XLIX equal to in decimal?',
          'XL = 50 − 10 = 40; IX = 10 − 1 = 9.',
          '49',
          ['69', '41', '59'],
          `XL (40) + IX (9) = 49.`,
          rng
        ),
        mq(
          'Why were Roman numerals difficult for large arithmetic like multiplication (XLII × XIX)?',
          'Contrast Roman additive/subtractive letters with positional columns.',
          'Roman numerals lack positional place value and a zero digit',
          ['Romans did not allow subtraction', 'Letters could not exceed 100', 'Only even numbers were written'],
          `Because symbols like X and L do not scale by column position, column arithmetic fails without an abacus.`,
          rng
        ),
        mq(
          'Which Roman numeral correctly represents 90?',
          'Place X (10) before C (100) to subtract 10 from 100.',
          'XC',
          ['LXXXX', 'CX', 'IC'],
          `XC = 100 − 10 = 90 (subtractive notation).`,
          rng
        ),
        mq(
          'Compute the sum: MCM + CD = ?',
          'M=1000, CM=900, CD=400.',
          '2,300',
          ['1,500', '2,500', '1,400'],
          `MCM (1900) + CD (400) = 2,300.`,
          rng
        ),
      ];
    }

    case 'mod-3-5': {
      const b2 = ri(rng, 1, 3);
      const b1 = ri(rng, 1, 4);
      const b0 = ri(rng, 1, 4);
      const dec5 = b2 * 25 + b1 * 5 + b0;
      return [
        mq(
          `In a Base-5 landmark system (25s, 5s, 1s), what decimal number is (${b2}${b1}${b0})₅?`,
          `Compute ${b2}×25 + ${b1}×5 + ${b0}×1.`,
          `${dec5}`,
          [`${b2 * 100 + b1 * 10 + b0}`, `${dec5 + 10}`, `${dec5 - 5}`],
          `${b2}×25 + ${b1}×5 + ${b0} = ${b2 * 25} + ${b1 * 5} + ${b0} = ${dec5}.`,
          rng
        ),
        mq(
          `In a Base-4 system, what happens when a column reaches 4 dots?`,
          'Trade 4 dots in one column for 1 dot in the next column left.',
          'It explodes/trades 4-for-1 into the next place value (4ⁿ)',
          ['The 4th dot is discarded', 'You wait until 10 dots', 'It splits into halves'],
          `In Base-B, every B units in one column regroup into 1 unit of the next column (B-times larger).`,
          rng
        ),
        mq(
          `Egyptian hieroglyphs used distinct pictures for 1, 10, 100, 1000. Was that a positional place-value system?`,
          'Does rearranging symbols change the value in Egyptian hieroglyphs?',
          'No — it was an additive base-10 system (order did not matter)',
          ['Yes — identical to modern decimal', 'Yes — it used Base-60', 'Only for fractions'],
          `Egyptian notation summed symbol values regardless of order rather than assigning meaning by column position.`,
          rng
        ),
      ];
    }

    case 'mod-3-6': {
      const s60 = ri(rng, 2, 5);
      const rem = ri(rng, 12, 48);
      return [
        mq(
          `In Mesopotamian Base-60 (sexagesimal), what decimal value is represented by (${s60} ; ${rem})₆₀?`,
          `Compute (${s60} × 60) + ${rem}.`,
          `${s60 * 60 + rem}`,
          [`${s60 * 100 + rem}`, `${s60 * 10 + rem}`, `${s60 * 60 - rem}`],
          `${s60} × 60 + ${rem} = ${s60 * 60} + ${rem} = ${s60 * 60 + rem}.`,
          rng
        ),
        mq(
          `Where do we STILL use Mesopotamian Base-60 every day?`,
          'Think of clocks and geometry protractors!',
          '60 seconds/min, 60 minutes/hour, and 360° (6×60) in a circle',
          ['100 centimeters in a meter', '12 months in a year', 'Days in a week'],
          `Timekeeping (60s, 60m) and angle degrees (360°) preserve Babylonian Base-60 math.`,
          rng
        ),
        mq(
          `Before inventing a placeholder symbol, what ambiguity occurred in early Babylonian Base-60 tablets?`,
          'How did scribes distinguish 62 (1 ; 2) from 3602 (1 ; 0 ; 2)?',
          'Empty spaces between columns made 1×60 + 2 easy to confuse with 1×3600 + 2',
          ['Numbers above 60 were forbidden', 'Only odd numbers existed', 'Wedges pointed downward only'],
          `Without an explicit zero placeholder digit, an empty gap between wedges left positional value ambiguous.`,
          rng
        ),
      ];
    }

    case 'mod-3-7': {
      return [
        mq(
          'Why is the digit 0 essential as a PLACEHOLDER in the Hindu-Arabic decimal number 4,050?',
          'What happens if you drop the zeros?',
          'It holds empty Hundreds and Ones places so 4 stays 4 Thousands and 5 stays 5 Tens',
          ['It changes the base to Base-5', 'It means 4 × 5', 'It only marks negative values'],
          `Without placeholder 0s, 4,050 would collapse ambiguously into 45.`,
          rng
        ),
        mq(
          'Who authored the Brāhmasphuṭasiddhānta (628 CE), giving the first clear arithmetic rules for zero (śūnya) and negative numbers?',
          'Think of the great Indian astronomer-mathematician of Bhillamāla!',
          'Brahmagupta',
          ['Euclid', 'Fibonacci', 'Pythagoras'],
          `Brahmagupta formalized rules for adding, subtracting, and multiplying with 0 (śūnya) and negative debt numbers.`,
          rng
        ),
        mq(
          'Why can ANY finite or huge integer be written using ONLY 10 digits (0–9) in the Hindu system?',
          'Digits take powers of 10 depending on column position.',
          'Place value multiplies each digit by 10⁰, 10¹, 10², 10³, ...',
          ['New symbols are invented for every million', 'Letters replace every digit past 99', 'Only even bases allow 10 digits'],
          `Combining 10 digits (0–9) with base-10 positional columns represents every natural number uniquely.`,
          rng
        ),
      ];
    }

    // =========================================================================
    // PART I — CHAPTER 4: QUADRILATERALS
    // =========================================================================
    case 'mod-4-1': {
      const l = ri(rng, 8, 15);
      const w = ri(rng, 4, 7);
      return [
        mq(
          `A rectangle has adjacent sides ${l} cm and ${w} cm. What is its perimeter and angle at each corner?`,
          'Opposite sides are equal and all 4 interior corners are 90°.',
          `Perimeter = ${2 * (l + w)} cm, Corner = 90°`,
          [`Perimeter = ${l * w} cm, Corner = 90°`, `Perimeter = ${l + w} cm, Corner = 60°`, `Perimeter = ${2 * (l + w)} cm, Corner = 120°`],
          `Perimeter = 2(${l} + ${w}) = ${2 * (l + w)} cm; every rectangle corner measures 90°.`,
          rng
        ),
        mq(
          'How many diagonals does ANY quadrilateral (4-sided polygon) have?',
          'Diagonals join non-adjacent opposite vertices.',
          '2 diagonals',
          ['4 diagonals', '1 diagonal', '3 diagonals'],
          `Using n(n−3)/2 for n=4 gives 4(1)/2 = 2 diagonals.`,
          rng
        ),
        mq(
          'Why is a rectangle NOT necessarily a square?',
          'Compare all 4 side lengths.',
          'Adjacent sides in a rectangle can have different lengths (though all angles are 90°)',
          ['Rectangle diagonals are unequal', 'Rectangle corners are acute', 'Opposite sides of a rectangle are not parallel'],
          `A rectangle requires four 90° corners, whereas a square additionally requires all four sides equal.`,
          rng
        ),
      ];
    }

    case 'mod-4-2': {
      const diag = ri(rng, 5, 11) * 2;
      return [
        mq(
          `In rectangle ABCD, diagonal AC = ${diag} cm. What is the length of half-diagonal OB (from center intersection O to corner B)?`,
          'Rectangle diagonals are EQUAL and BISECT each other.',
          `${diag / 2} cm`,
          [`${diag} cm`, `${diag * 2} cm`, `${diag - 2} cm`],
          `Both diagonals equal ${diag} cm and bisect at O, so OB = ${diag} ÷ 2 = ${diag / 2} cm.`,
          rng
        ),
        mq(
          `Which triangle congruence criterion proves rectangle diagonals AC and BD are equal in length (using ΔABC ≅ ΔBAD)?`,
          'AB = BA (common), ∠B = ∠A = 90°, BC = AD (opposite sides equal).',
          'SAS Congruence (Side-Angle-Side)',
          ['AAA Similarity', 'SSA (ambiguous)', 'Exterior angle sum'],
          `Side AB, included 90° corner, and opposite side BC=AD prove ΔABC ≅ ΔBAD by SAS ⇒ AC = BD.`,
          rng
        ),
        mq(
          'If a wooden door frame has opposite sides equal (100 cm & 200 cm), how can a carpenter check its corners are true 90° without a protractor?',
          'Compare both corner-to-corner diagonals!',
          'Measure both diagonals — if they are EQUAL, all 4 corners are 90°',
          ['Check only bottom edge length', 'Measure one corner only', 'Spin the frame'],
          `A parallelogram with equal diagonals is guaranteed to be a true 90° rectangle.`,
          rng
        ),
      ];
    }

    case 'mod-4-3': {
      return [
        mq(
          'Which special property holds for the diagonals of a SQUARE (in addition to rectangle diagonals)?',
          'Squares combine Rectangle (equal) + Rhombus (90° perpendicular)!',
          'Diagonals are EQUAL, BISECT each other, and meet at 90°',
          ['Diagonals never intersect', 'Diagonals are unequal and meet at 60°', 'Only one diagonal bisects the other'],
          `A square inherits equal diagonals from rectangles and perpendicular 90° bisectors from rhombuses.`,
          rng
        ),
        mq(
          'Which Venn classification statement is ALWAYS true?',
          'Compare Square, Rectangle, and Rhombus definitions.',
          'Every Square is both a Rectangle and a Rhombus',
          ['Every Rectangle is a Square', 'Every Rhombus is a Square', 'No Square is a Parallelogram'],
          `A square has 4 right angles (making it a rectangle) AND 4 equal sides (making it a rhombus).`,
          rng
        ),
        mq(
          'At what angle does each diagonal cut the 90° vertex corner of a square?',
          'Diagonals of a square bisect corner angles.',
          '45°',
          ['60°', '30°', '90°'],
          `Each diagonal splits the 90° square corner cleanly into two 45° angles.`,
          rng
        ),
      ];
    }

    case 'mod-4-4': {
      const a = ri(rng, 70, 100);
      const b = ri(rng, 80, 110);
      const c = ri(rng, 60, 85);
      const fourth = 360 - (a + b + c);
      return [
        mq(
          `Three interior angles of a quadrilateral measure ${a}°, ${b}°, and ${c}°. Find the 4th angle:`,
          'Sum of interior angles of any quadrilateral = 360°.',
          `${fourth}°`,
          [`${180 - fourth}°`, `${fourth + 20}°`, `${fourth - 15}°`],
          `360° − (${a}° + ${b}° + ${c}°) = 360° − ${a + b + c}° = ${fourth}°.`,
          rng
        ),
        mq(
          'Why is the interior angle sum of any convex quadrilateral always 360°?',
          'Draw 1 diagonal across the quadrilateral.',
          'One diagonal divides it into 2 triangles (2 × 180° = 360°)',
          ['Every corner is always 90°', 'Exterior angles sum to 180°', 'Sides are always parallel'],
          `Two non-overlapping triangles fill any convex quadrilateral: 180° + 180° = 360°.`,
          rng
        ),
        mq(
          'What is the sum of the 4 EXTERIOR angles (1 per vertex) of any quadrilateral?',
          'Walking completely around one closed loop turns 1 full circle.',
          '360°',
          ['180°', '540°', '720°'],
          `For any convex polygon, exterior angles always sum to 360°.`,
          rng
        ),
      ];
    }

    case 'mod-4-5': {
      const adj = ri(rng, 55, 85);
      return [
        mq(
          `In parallelogram PQRS, ∠P = ${adj}°. What is the measure of adjacent angle ∠Q and opposite angle ∠R?`,
          'Opposite angles are equal; adjacent angles sum to 180°.',
          `∠Q = ${180 - adj}°, ∠R = ${adj}°`,
          [`∠Q = ${adj}°, ∠R = ${180 - adj}°`, `∠Q = 90°, ∠R = 90°`, `∠Q = ${360 - adj}°, ∠R = ${adj}°`],
          `Opposite angle ∠R = ∠P = ${adj}°; adjacent angle ∠Q = 180° − ${adj}° = ${180 - adj}°.`,
          rng
        ),
        mq(
          'Which statement is ALWAYS true for ANY parallelogram?',
          'Check opposite sides, angles, and diagonals.',
          'Opposite sides are parallel & equal, and diagonals bisect each other',
          ['All 4 sides are equal', 'Diagonals are always equal in length', 'All interior angles are 90°'],
          `Parallel opposite sides guarantee congruent alternate triangles, making opposite sides/angles equal and diagonals bisect.`,
          rng
        ),
        mq(
          'Why does a parallelogram lock rigidly only when an angle or diagonal length is specified?',
          'Think of a hinged drawbridge frame!',
          'Same 4 side lengths can shear into infinitely many angles unless fixed',
          ['Opposite sides have different lengths', 'Diagonals cannot meet', 'Angles always exceed 180°'],
          `Side lengths alone allow hinged parallelograms to tilt until diagonals or corner angles fix the shape.`,
          rng
        ),
      ];
    }

    case 'mod-4-6': {
      return [
        mq(
          'Diagonals of a rhombus bisect at center O with lengths 12 cm and 16 cm. What is the side length of the rhombus?',
          'Half-diagonals (6 cm, 8 cm) form a 90° right triangle with the rhombus side!',
          '10 cm',
          ['14 cm', '20 cm', '28 cm'],
          `By Pythagoras on right triangle 6–8–c: side = √(6² + 8²) = √(36 + 64) = 10 cm.`,
          rng
        ),
        mq(
          'If all 4 sides of a quadrilateral are 9 cm and one angle is 65°, what shape is it?',
          '4 equal sides with non-90° angles.',
          'Rhombus (non-square)',
          ['Square', 'Rectangle', 'Kite with unequal sides'],
          `Four equal sides without 90° corners define a rhombus.`,
          rng
        ),
        mq(
          'Do the diagonals of a rhombus bisect the corner angles?',
          'Symmetry along each diagonal maps equal sides onto equal sides.',
          'Yes — every rhombus diagonal bisects its vertex angles',
          ['Never', 'Only if diagonals are equal', 'Only at obtuse corners'],
          `Because all 4 sides are equal, ΔABD ≅ ΔCBD (SSS), bisecting every corner cleanly.`,
          rng
        ),
      ];
    }

    case 'mod-4-7': {
      return [
        mq(
          'Which property distinguishes a KITE from a general Trapezium?',
          'Compare parallel pairs vs adjacent equal sides.',
          'A kite has 2 pairs of equal ADJACENT sides & perpendicular diagonals',
          ['A kite has 4 right angles', 'A kite has all 4 sides parallel', 'A trapezium has perpendicular diagonals always'],
          `A kite has adjacent equal edges (not opposite parallel sides) whose symmetry diagonal bisects the cross-diagonal at 90°.`,
          rng
        ),
        mq(
          'If a trapezium has base angles 70° and 70° (equal non-parallel legs), what is it called?',
          'Symmetric parallel-side quadrilateral!',
          'Isosceles Trapezium',
          ['Rhombus', 'Square', 'Skewed Kite'],
          `Equal non-parallel legs and equal base angles define an isosceles trapezium.`,
          rng
        ),
        mq(
          'In kite WXYZ with equal pairs WX=WZ and YX=YZ, how many diagonals bisect EACH OTHER?',
          'In a non-rhombus kite, check which diagonal cuts which.',
          'Only the symmetry diagonal bisects the cross diagonal (at 90°)',
          ['Both diagonals always bisect each other evenly', 'Neither diagonal cuts the other', 'Both are equal and perpendicular'],
          `Only the axis of symmetry bisects the second diagonal perpendicularly.`,
          rng
        ),
      ];
    }

    // =========================================================================
    // PART I — CHAPTER 5: NUMBER PLAY
    // =========================================================================
    case 'mod-5-1': {
      const k = ri(rng, 3, 9);
      return [
        mq(
          `Without calculating every term, determine whether the sum of ${2 * k + 1} odd integers is EVEN or ODD:`,
          'Adding an ODD count of odd numbers preserves odd parity.',
          'Always ODD',
          ['Always EVEN', 'Depends on size', 'Zero'],
          `Odd + Odd = Even, so pairing ${2 * k} odds leaves 1 odd unpaired ⇒ ODD.`,
          rng
        ),
        mq(
          `If a and b are BOTH odd integers, which expression is ALWAYS EVEN?`,
          'Try a = 3, b = 5.',
          'a + b',
          ['a × b', 'a + 2b', '3a'],
          `Odd + Odd is always Even; Odd × Odd stays Odd.`,
          rng
        ),
        mq(
          `Can the sum of 5 consecutive integers EVER be odd?`,
          'n + (n+1) + (n+2) + (n+3) + (n+4) = 5(n + 2).',
          'Yes — whenever the middle number (n + 2) is odd!',
          ['Never — consecutive sums are always even', 'Always — for any starting n', 'Only when n = 0'],
          `5 × (odd middle) = odd (e.g., 1+2+3+4+5 = 15); 5 × (even middle) = even.`,
          rng
        ),
      ];
    }

    case 'mod-5-2': {
      return [
        mq(
          'Classify the statement: "The product of ANY 3 consecutive integers n(n+1)(n+2) is divisible by 6."',
          'At least 1 is even (÷2) and at least 1 is a multiple of 3 (÷3).',
          'ALWAYS true',
          ['SOMETIMES true', 'NEVER true', 'Only for odd n'],
          `Every run of 3 consecutive integers contains a multiple of 2 and a multiple of 3 ⇒ always divisible by 6.`,
          rng
        ),
        mq(
          'Classify: "If an integer is divisible by 4, it is also divisible by 8."',
          'Test n = 12 or n = 20!',
          'SOMETIMES true (e.g. true for 16, false for 12)',
          ['ALWAYS true', 'NEVER true', 'True only for odd integers'],
          `12 is divisible by 4 (4×3) but not by 8; 16 is divisible by both.`,
          rng
        ),
        mq(
          'If a number is divisible by both 3 and 4 (co-prime), it is ALWAYS divisible by:',
          'Since GCD(3, 4) = 1, multiply them.',
          '12',
          ['7', '24', '9'],
          `Co-prime divisors 3 and 4 combine to guarantee divisibility by 3 × 4 = 12.`,
          rng
        ),
      ];
    }

    case 'mod-5-3': {
      const rem = ri(rng, 2, 5);
      return [
        mq(
          `Today is Day 0 (Monday). What day of the week is Day ${7 * 10 + rem} in 7-day modular arithmetic?`,
          `Find remainder when ${7 * 10 + rem} is divided by 7.`,
          `${rem} days past Monday (mod 7 remainder = ${rem})`,
          [`${(rem + 3) % 7} days past Monday`, 'Monday (remainder 0)', 'Sunday (remainder 6)'],
          `${7 * 10 + rem} = 7×10 + ${rem}, so it lands at remainder +${rem} mod 7.`,
          rng
        ),
        mq(
          'If A leaves remainder 3 when divided by 5, and B leaves remainder 4 mod 5, what remainder does (A + B) leave mod 5?',
          'Add remainders and reduce mod 5: 3 + 4 = 7.',
          '2',
          ['0', '1', '4'],
          `3 + 4 = 7 ≡ 2 (mod 5).`,
          rng
        ),
        mq(
          'What remainder does ANY square n² leave when divided by 4?',
          'Test even (2k)² = 4k² and odd (2k+1)² = 4k(k+1) + 1.',
          'Only 0 or 1',
          ['Only 2 or 3', '0, 1, 2, or 3', 'Always 3'],
          `Squares only ever yield remainder 0 (even) or 1 (odd) mod 4 — never 2 or 3!`,
          rng
        ),
      ];
    }

    case 'mod-5-4': {
      return [
        mq(
          'Which rule tests whether a huge 6-digit number 748,316 is divisible by 8?',
          '1000 = 8 × 125.',
          'Check only if its LAST 3 digits (316) are divisible by 8',
          ['Sum all 6 digits', 'Check last 1 digit only', 'Check last 2 digits only'],
          `Since 1,000 is divisible by 8, only the last 3 digits affect divisibility by 8.`,
          rng
        ),
        mq(
          'Which of these numbers is divisible by 4?',
          'A number is ÷4 iff its last TWO digits are divisible by 4.',
          '91,524',
          ['91,518', '91,534', '91,510'],
          `Only 24 (last 2 digits of 91,524) is evenly divisible by 4.`,
          rng
        ),
        mq(
          'If a number ends in 0, which pair of divisors ALWAYS divides it evenly?',
          'Any number ending in 0 is 10 × k.',
          '2, 5, and 10',
          ['4 and 8 always', '3 and 9 always', '11 always'],
          `Ending in 0 guarantees divisibility by 10, hence always 2 and 5.`,
          rng
        ),
      ];
    }

    case 'mod-5-5': {
      const k = ri(rng, 1, 4);
      const digitMissing = 9 - (7 % 9); // e.g. 2 + 5 + X + k
      const sumKnown = 4 + 3 + k;
      const ans = (9 - (sumKnown % 9)) % 9;
      return [
        mq(
          `If 43X${k} is divisible by 9, what single digit must X be?`,
          `4 + 3 + X + ${k} must be a multiple of 9.`,
          `${ans}`,
          [`${(ans + 2) % 10}`, `${(ans + 4) % 10}`, `${(ans + 7) % 10}`],
          `Known digit sum = ${sumKnown}; ${sumKnown} + ${ans} = ${sumKnown + ans} (divisible by 9).`,
          rng
        ),
        mq(
          'Why can the sum of digits test divisibility by 9 cleanly?',
          'Every power of 10 leaves remainder 1 when divided by 9: 10 = 9+1, 100 = 99+1.',
          '10ⁿ − 1 is always divisible by 9',
          ['Only the last digit matters for 9', 'Because 9 = 3²', 'Because 9 is odd'],
          `100a + 10b + c = 99a + 9b + (a + b + c), leaving just the digit sum!`,
          rng
        ),
        mq(
          'What is the digital root of 8,451?',
          'Sum digits repeatedly: 8+4+5+1 = 18 → 1+8.',
          '9',
          ['3', '6', '8'],
          `8 + 4 + 5 + 1 = 18; 1 + 8 = 9.`,
          rng
        ),
      ];
    }

    case 'mod-5-6': {
      return [
        mq(
          'Using the alternating + / − digit test, which number is divisible by 11?',
          'Compute (odd-position sum) − (even-position sum).',
          '5,390',
          ['5,391', '4,126', '7,214'],
          `For 5,390: (5 + 9) − (3 + 0) = 14 − 3 = 11 (multiple of 11).`,
          rng
        ),
        mq(
          'Is ANY 4-digit palindrome (abba, like 3773) always divisible by 11?',
          'Check alternating sum: a − b + b − a.',
          'Yes — alternating digit sum always cancels to 0',
          ['Never', 'Only if a is even', 'Only if b = 0'],
          `In any even-length palindrome abba, (a + b) − (b + a) = 0, so all even palindromes divide cleanly by 11!`,
          rng
        ),
        mq(
          'Find single digit D so 2D7 is divisible by 11:',
          '(2 + 7) − D must equal 0 or 11.',
          'D = 9 (giving 297)',
          ['D = 1', 'D = 4', 'D = 5'],
          `Alternating sum (2 + 7) − 9 = 0 ⇒ 297 = 11 × 27.`,
          rng
        ),
      ];
    }

    case 'mod-5-7': {
      return [
        mq(
          'In the addition cryptarithm  A B  +  B A  =  88 (with distinct digits A > B, A = 5), find B:',
          'Check 5B + B5 = 88.',
          'B = 3 (53 + 35 = 88)',
          ['B = 4', 'B = 2', 'B = 6'],
          `53 + 35 = 88 cleanly!`,
          rng
        ),
        mq(
          'In a standard 3×3 Lo Shu magic square using digits 1–9, what is EVERY row, column, and diagonal sum?',
          'Total sum 1+2+...+9 = 45 split across 3 rows.',
          '15',
          ['12', '18', '45'],
          `45 ÷ 3 = 15, with 5 locked in the center cell.`,
          rng
        ),
        mq(
          'Why must the number 5 ALWAYS sit in the center of a 1–9 3×3 magic square?',
          'Check four sums passing through the center cell.',
          '5 pairs symmetrically with (1,9), (2,8), (3,7), and (4,6) to reach 15 across all 4 lines',
          ['Because 5 is the largest odd digit', 'Any corner digit works instead', 'Corner cells cannot sum to 15 horizontally and vertically'],
          `Only 5 forms 4 distinct sum-to-10 pairs passing through the center cell.`,
          rng
        ),
      ];
    }

    // =========================================================================
    // PART I — CHAPTER 6: WE DISTRIBUTE, YET THINGS MULTIPLY
    // =========================================================================
    case 'mod-6-1': {
      const a = ri(rng, 14, 24);
      const b = ri(rng, 30, 50);
      return [
        mq(
          `Given ${a} × ${b} = ${a * b}, use the Distributive Increment rule to compute (${a + 1}) × ${b}:`,
          `(a + 1) × b = a×b + b.`,
          `${a * b + b}`,
          [`${a * b + 1}`, `${a * b + a}`, `${a * b + 2 * b}`],
          `Increasing the first factor by 1 adds one more copy of ${b}: ${a * b} + ${b} = ${a * b + b}.`,
          rng
        ),
        mq(
          `Which geometric split represents a(b + c) = ab + ac?`,
          'Cut a rectangle of height a and total width (b + c) vertically.',
          'Two side-by-side rectangles of area (a × b) and (a × c)',
          ['Two squares of area a² and b²', 'One triangle and one rectangle', 'Subtracting b from c'],
          `Slicing a rectangle of width (b+c) vertically splits its total area cleanly into ab + ac.`,
          rng
        ),
        mq(
          `Simplify 7x(x + 4) − 2x²:`,
          'Distribute 7x across (x + 4) first, then combine like terms.',
          '5x² + 28x',
          ['7x² + 4 − 2x²', '5x² + 4x', '9x² + 28x'],
          `7x² + 28x − 2x² = 5x² + 28x.`,
          rng
        ),
      ];
    }

    case 'mod-6-2': {
      const p = ri(rng, 2, 7);
      const q = ri(rng, 2, 6);
      return [
        mq(
          `Expand the binomial product (x + ${p})(x + ${q}):`,
          'Use (x + a)(x + b) = x² + (a + b)x + ab.',
          `x² + ${p + q}x + ${p * q}`,
          [`x² + ${p * q}x + ${p + q}`, `x² + ${p + q}x`, `2x + ${p + q}`],
          `Middle coefficient = ${p} + ${q} = ${p + q}; constant = ${p} × ${q} = ${p * q}.`,
          rng
        ),
        mq(
          `How many rectangular sub-tiles appear in the 2×2 area diagram of (x + a)(y + b)?`,
          'Each term of binomial 1 multiplies each term of binomial 2.',
          '4 tiles (xy + xb + ay + ab)',
          ['2 tiles (xy + ab)', '3 tiles', '6 tiles'],
          `Multiplying two 2-term sums produces 2 × 2 = 4 rectangular area tiles.`,
          rng
        ),
        mq(
          `What is the coefficient of x in the expansion of (x + 8)(x − 3)?`,
          'Sum +8 + (−3).',
          '5',
          ['11', '−24', '−5'],
          `8x − 3x = +5x, so coefficient of x is 5.`,
          rng
        ),
      ];
    }

    case 'mod-6-3': {
      const c = ri(rng, 3, 8);
      return [
        mq(
          `Expand (x + ${c})² using Identity 1:`,
          '(a + b)² = a² + 2ab + b².',
          `x² + ${2 * c}x + ${c * c}`,
          [`x² + ${c * c}`, `x² + ${c}x + ${c * c}`, `x² − ${2 * c}x + ${c * c}`],
          `Double the product gives 2(${c})x = ${2 * c}x, plus ${c}² = ${c * c}.`,
          rng
        ),
        mq(
          `Expand (a − ${c})² using Identity 2:`,
          '(a − b)² = a² − 2ab + b² (notice the +b² at the end!).',
          `a² − ${2 * c}a + ${c * c}`,
          [`a² − ${c * c}`, `a² − ${2 * c}a − ${c * c}`, `a² + ${2 * c}a + ${c * c}`],
          `Subtracting 2 overlapping strips cuts the ${c}² corner twice, so we add +${c * c} back!`,
          rng
        ),
        mq(
          'Why is (a + b)² NOT equal to a² + b² for positive numbers a, b?',
          'Draw the (a+b) × (a+b) square!',
          'It leaves out the two rectangular strips (2ab)',
          ['It leaves out b³', '2ab is always negative', 'Both expressions are equal'],
          `The full courtyard contains Keep (a²), Tower (b²), AND two Barracks (2ab).`,
          rng
        ),
      ];
    }

    case 'mod-6-4': {
      const a = ri(rng, 4, 9);
      return [
        mq(
          `Factorize using Difference of Squares: x² − ${a * a} = ?`,
          'a² − b² = (a + b)(a − b).',
          `(x + ${a})(x − ${a})`,
          [`(x − ${a})²`, `(x + ${a})²`, `(x + ${a * a})(x − 1)`],
          `x² − ${a}² = (x + ${a})(x − ${a}).`,
          rng
        ),
        mq(
          'In the geometric proof of a² − b², cutting a b×b notch out of an a×a square swings the leftover strip into what rectangle?',
          'Add width a+b and height a−b.',
          'Length (a + b) by Width (a − b)',
          ['Length a by Width b', 'Length 2a by Width 2b', 'Square of side a − b'],
          `Moving the side strip creates a flat rectangle measuring (a + b) × (a − b).`,
          rng
        ),
        mq(
          'Factorize completely: 25p² − 16q²:',
          'Rewrite as (5p)² − (4q)².',
          '(5p + 4q)(5p − 4q)',
          ['(5p − 4q)²', '(25p + 16q)(p − q)', '(5p + 4q)²'],
          `Difference of two squares gives (5p + 4q)(5p − 4q).`,
          rng
        ),
      ];
    }

    case 'mod-6-5': {
      const d = ri(rng, 2, 7);
      const ans = 10000 - d * d;
      return [
        mq(
          `Compute ${100 + d} × ${100 - d} mentally using Iṣṭa-Guṇana / (a+b)(a−b):`,
          `(100 + ${d})(100 − ${d}) = 100² − ${d}².`,
          `${ans.toLocaleString()}`,
          [`${(10000 + d * d).toLocaleString()}`, `${(10000 - d).toLocaleString()}`, `${(10000 - 2 * d).toLocaleString()}`],
          `10,000 − ${d * d} = ${ans.toLocaleString()}.`,
          rng
        ),
        mq(
          `Calculate 97² rapidly using (100 − 3)²:`,
          '100² − 2(100)(3) + 3².',
          '9,409',
          ['9,403', '10,609', '9,991'],
          `10,000 − 600 + 9 = 9,409.`,
          rng
        ),
        mq(
          `Calculate 103² rapidly using (100 + 3)²:`,
          '100² + 2(100)(3) + 3².',
          '10,609',
          ['10,009', '10,309', '9,409'],
          `10,000 + 600 + 9 = 10,609.`,
          rng
        ),
      ];
    }

    case 'mod-6-6': {
      return [
        mq(
          'Spot & fix the student’s algebra mistake: "−2(x − 5) = −2x − 10". What is the TRUE expansion?',
          'Negative × Negative = Positive!',
          '−2x + 10',
          ['−2x − 5', '2x − 10', '−2x + 5'],
          `Distributing −2 onto −5 produces +10, giving −2x + 10.`,
          rng
        ),
        mq(
          'Spot the missing term in (3x + 4)² written as "9x² + 16":',
          'Compute 2 × (3x) × 4.',
          'Missing +24x middle term',
          ['Missing +12x term', 'Missing +7x term', 'No mistake — already complete'],
          `(3x + 4)² = 9x² + 24x + 16.`,
          rng
        ),
        mq(
          'Mend the mistake: "(5x)² = 5x²". What did the student forget?',
          'Power applies to BOTH factor 5 and variable x!',
          'Square the coefficient too: 25x²',
          ['Make it 10x²', 'Double x to 5x⁴', 'Add +5'],
          `(5x)² = 5² · x² = 25x².`,
          rng
        ),
      ];
    }

    case 'mod-6-7': {
      const k = ri(rng, 2, 4);
      const step = ri(rng, 6, 12);
      return [
        mq(
          `A tile border around an n × n square uses 4n + 4 corner/edge tiles. Check equivalence: which expression equals 4n + 4?`,
          'Factor 4 cleanly out of 4n + 4.',
          '4(n + 1)',
          ['4(n + 4)', '2(n + 4)', 'n² + 4'],
          `By distributivity, 4(n + 1) = 4n + 4.`,
          rng
        ),
        mq(
          `A growing pattern needs ${k} + 3(n − 1) matchsticks at Step n. Simplified cleanly, how many sticks at Step ${step}?`,
          `Plug n = ${step} cleanly.`,
          `${k + 3 * (step - 1)} sticks`,
          [`${3 * step} sticks`, `${k + 3 * step} sticks`, `${3 * (step - 1)} sticks`],
          `${k} + 3(${step - 1}) = ${k} + ${3 * (step - 1)} = ${k + 3 * (step - 1)} sticks.`,
          rng
        ),
        mq(
          'Why can two students write DIFFERENT-looking formulas for the same visual tile grid (e.g. 2n + 2(n+2) vs 4(n+1)) and BOTH be right?',
          'Expand 2n + 2(n+2).',
          'Both simplify algebraically to 4n + 4 via different valid slicings',
          ['Only one formula can work per shape', 'Variables represent angles', 'Both are coincidences for n=1 only'],
          `Different geometric decompositions produce algebraically equivalent expressions.`,
          rng
        ),
      ];
    }

    // =========================================================================
    // PART I — CHAPTER 7: PROPORTIONAL REASONING-1
    // =========================================================================
    case 'mod-7-1': {
      const k = ri(rng, 2, 4);
      return [
        mq(
          `An original photo measures 4 cm × 6 cm. Which resized frame keeps TRUE aspect ratio without stretching?`,
          `Multiply BOTH 4 cm and 6 cm by the SAME scale factor ${k}.`,
          `${4 * k} cm × ${6 * k} cm`,
          [`${4 + k} cm × ${6 + k} cm`, `${4 * k} cm × ${6 + k} cm`, `${4 * k} cm × ${6 * (k + 1)} cm`],
          `Adding constant offsets distorts images; multiplying both sides by ${k} preserves 2:3 ratio.`,
          rng
        ),
        mq(
          'Why does adding +5 cm to BOTH width and height distort a non-square rectangle?',
          'Compare old ratio 4/6 vs new ratio 9/11.',
          'Adding a constant changes the multiplicative ratio (w/h)',
          ['Perimeter must stay constant', 'Rectangles cannot enlarge', '5 cm is odd'],
          `Proportional similarity preserves ratios under × or ÷, never + or −.`,
          rng
        ),
        mq(
          'A blueprint scales up by factor ×3. If a doorway is 2 cm on paper, how wide is the enlarged drawing?',
          'Multiply 2 cm × 3.',
          '6 cm',
          ['5 cm', '8 cm', '9 cm'],
          `2 × 3 = 6 cm.`,
          rng
        ),
      ];
    }

    case 'mod-7-2': {
      const g = ri(rng, 3, 7);
      return [
        mq(
          `Reduce the ratio ${3 * g} : ${5 * g} to its simplest indivisible form:`,
          `Divide both terms by GCD = ${g}.`,
          '3 : 5',
          ['5 : 3', `${3 * g} : 5`, '1 : 2'],
          `Dividing ${3 * g} and ${5 * g} by ${g} produces simplest ratio 3 : 5.`,
          rng
        ),
        mq(
          'Before writing the ratio of 500 m to 2 km, what crucial first step is required?',
          'Compare meters with kilometers!',
          'Convert both to the same unit (500 m : 2000 m = 1 : 4)',
          ['Leave units different and simplify 500:2 = 250:1', 'Multiply 500 × 2', 'Add 500 + 2'],
          `Ratios are unitless comparisons requiring matching units first: 500 m : 2000 m = 1 : 4.`,
          rng
        ),
        mq(
          `Which mixture is MORE concentrated in lemon: Stand A (3:5) or Stand B (2:4)?`,
          'Compare fractions 3/5 (60%) vs 2/4 (50%).',
          'Stand A (3/5 = 60%)',
          ['Stand B (2/4 = 50%)', 'Both identical', 'Cannot tell'],
          `3/5 = 0.60 > 2/4 = 0.50.`,
          rng
        ),
      ];
    }

    case 'mod-7-3': {
      const k = ri(rng, 3, 6);
      return [
        mq(
          `Find x in the proportion  4 : 7 :: ${4 * k} : x :`,
          'Use product of extremes = product of means, or scale ×' + k + '.',
          `x = ${7 * k}`,
          [`x = ${7 + k}`, `x = ${4 * k}`, `x = ${7 * (k + 1)}`],
          `Multiplying 4 by ${k} gives ${4 * k}, so 7 × ${k} = ${7 * k}.`,
          rng
        ),
        mq(
          'Check whether 6 : 9 and 10 : 15 form a true proportion:',
          'Compare cross-products 6 × 15 vs 9 × 10.',
          'Yes (6 × 15 = 90 and 9 × 10 = 90)',
          ['No (cross products differ)', 'Only if 6 > 10', 'No — sum differs'],
          `Both simplify to 2 : 3 (and 6×15 = 9×10 = 90).`,
          rng
        ),
        mq(
          'In proportion a : b :: c : d, what are a and d called?',
          'Outer vs inner terms!',
          'Extremes (while b and c are Means)',
          ['Means', 'Numerators', 'Exponents'],
          `Outer terms a, d are Extremes; inner terms b, c are Means (ad = bc).`,
          rng
        ),
      ];
    }

    case 'mod-7-4': {
      const unitP = ri(rng, 15, 25);
      const q1 = 6;
      const q2 = 9;
      return [
        mq(
          `Using Trairāśika (Rule of Three), if ${q1} notebooks cost ₹${unitP * q1}, what do ${q2} notebooks cost?`,
          `Find 1-notebook unit cost (₹${unitP}), then multiply × ${q2}.`,
          `₹${unitP * q2}`,
          [`₹${unitP * q1 + q2}`, `₹${unitP * (q2 + 1)}`, `₹${unitP * (q2 - 2)}`],
          `1 notebook = ₹${unitP * q1} ÷ ${q1} = ₹${unitP}. Thus ${q2} notebooks = ${q2} × ₹${unitP} = ₹${unitP * q2}.`,
          rng
        ),
        mq(
          'Which vendor offers the LOWEST unit price: Vendor A (₹144 for 8 kg) or Vendor B (₹120 for 6 kg)?',
          'Compute Total ÷ Quantity.',
          'Vendor A (₹18/kg)',
          ['Vendor B (₹20/kg)', 'Both cost the same', 'Vendor B (₹16/kg)'],
          `144 ÷ 8 = ₹18/kg < 120 ÷ 6 = ₹20/kg.`,
          rng
        ),
        mq(
          'Why did Āryabhaṭa and Brahmagupta call this the Rule of Three (Trairāśika)?',
          'Pramāṇa (measure), Phala (fruit), Icchā (demand).',
          'Because 3 known quantities determine the 4th desired quantity',
          ['Because 3 is always the denominator', 'Only 3 items can be sold', 'It averages 3 prices'],
          `From Measure, Fruit, and Demand (3 knowns), Fruit×Demand ÷ Measure yields the unknown 4th.`,
          rng
        ),
      ];
    }

    case 'mod-7-5': {
      const hrs = ri(rng, 3, 5);
      const spd = ri(rng, 6, 9) * 10;
      return [
        mq(
          `At uniform speed ${spd} km/h, how far does an express train travel in ${hrs} hours?`,
          'Distance = Speed × Time.',
          `${spd * hrs} km`,
          [`${spd + hrs} km`, `${spd * (hrs + 1)} km`, `${Math.round(spd / hrs)} km`],
          `${spd} km/h × ${hrs} h = ${spd * hrs} km.`,
          rng
        ),
        mq(
          'Convert 72 km/h into meters per second (m/s):',
          'Multiply km/h by 5/18 (since 1000m / 3600s = 5/18).',
          '20 m/s',
          ['7.2 m/s', '36 m/s', '259.2 m/s'],
          `72 × 5/18 = 4 × 5 = 20 m/s.`,
          rng
        ),
        mq(
          'If 1 cm on a map equals 5 km on land, how long is a 7 cm road on land?',
          '7 × 5 km.',
          '35 km',
          ['12 km', '1.4 km', '70 km'],
          `7 cm × 5 km/cm = 35 km.`,
          rng
        ),
      ];
    }

    case 'mod-7-6': {
      const unit = ri(rng, 20, 50);
      const total = 5 * unit; // ratio 3:2
      return [
        mq(
          `Split ${total} gold coins between Captain and First Mate in the ratio 3 : 2. How much does each get?`,
          `Total parts = 3 + 2 = 5. One part = ${total} ÷ 5 = ${unit}.`,
          `Captain ${3 * unit}, Mate ${2 * unit}`,
          [`Captain ${total / 2}, Mate ${total / 2}`, `Captain ${4 * unit}, Mate ${unit}`, `Captain ${2 * unit}, Mate ${3 * unit}`],
          `One share = ${total}/5 = ${unit} ⇒ Captain gets 3×${unit}=${3 * unit}, Mate gets 2×${unit}=${2 * unit}.`,
          rng
        ),
        mq(
          `Two angles of a linear pair (180°) are in ratio 4 : 5. Find the larger angle:`,
          'Total parts = 9 ⇒ 1 part = 180 ÷ 9 = 20°.',
          '100°',
          ['80°', '90°', '120°'],
          `5 × 20° = 100° (while the smaller is 4 × 20° = 80°).`,
          rng
        ),
        mq(
          'A ₹600 prize splits 1 : 2 : 3 among three winners. What is the smallest share?',
          'Sum of parts = 1 + 2 + 3 = 6.',
          '₹100',
          ['₹200', '₹300', '₹150'],
          `₹600 ÷ 6 = ₹100 per part ⇒ shares are ₹100, ₹200, ₹300.`,
          rng
        ),
      ];
    }

    case 'mod-7-7': {
      return [
        mq(
          'If 12 masons build a stone wall in 10 days, how many days will 15 masons take at the same pace?',
          'Workers × Days = Constant (Inverse proportion)!',
          '8 days',
          ['12.5 days', '13 days', '5 days'],
          `12 × 10 = 120 worker-days. With 15 workers: 120 ÷ 15 = 8 days.`,
          rng
        ),
        mq(
          'Which pair is INVERSELY proportional?',
          'As one doubles, the other halves.',
          'Speed of a car and Time taken for a fixed 300 km trip',
          ['Side of a square and its Perimeter', 'Number of pens bought and Total cost', 'Age of a child and Shoe size'],
          `Higher speed cuts travel time proportionally (Speed × Time = 300).`,
          rng
        ),
        mq(
          'Why is "1 shirt dries in 2 hours in sunlight, so 5 shirts dry in 10 hours" a NON-PROPORTIONAL trap?',
          'All 5 shirts hang simultaneously in the sun!',
          'Drying happens simultaneously (~2 hours), not sequentially',
          ['Shirts double weight when wet', 'Solar energy divides by 5', 'Time always scales inversely'],
          `Parallel drying does not obey linear unit-cost multiplication.`,
          rng
        ),
      ];
    }

    // =========================================================================
    // PART II — CHAPTER 1: FRACTIONS IN DISGUISE (p2-mod-1-1 .. p2-mod-1-7)
    // =========================================================================
    case 'p2-mod-1-1': {
      const fChoices = [
        { f: '3/8', pct: '37.5%', dec: '0.375' },
        { f: '3/5', pct: '60%', dec: '0.6' },
        { f: '7/20', pct: '35%', dec: '0.35' },
        { f: '9/25', pct: '36%', dec: '0.36' },
      ];
      const pick = fChoices[ri(rng, 0, 3)];
      return [
        mq(
          `Convert the fraction ${pick.f} cleanly into a percentage and decimal (FDP Trio):`,
          'Divide numerator by denominator, then × 100 for %.',
          `${pick.pct} and ${pick.dec}`,
          ['25% and 0.25', '45% and 0.45', '12.5% and 0.125'].filter((x) => !x.includes(pick.pct)),
          `${pick.f} = ${pick.dec} = ${pick.pct}.`,
          rng
        ),
        mq(
          'Convert 65% into its simplest reduced fraction:',
          '65/100 ÷ 5.',
          '13/20',
          ['65/10', '6/10', '3/5'],
          `65/100 divides cleanly by 5 to give 13/20.`,
          rng
        ),
        mq(
          'On a 10×10 percentage grid (100 cells), shading 3 full rows and 4 single squares represents:',
          'Count 3×10 + 4 = 34 cells out of 100.',
          '34% (or 17/50)',
          ['3.4%', '7% (3+4)', '66%'],
          `34 shaded out of 100 total = 34% = 17/50.`,
          rng
        ),
      ];
    }

    case 'p2-mod-1-2': {
      const qty = ri(rng, 2, 8) * 100;
      const pct = [15, 25, 35, 45][ri(rng, 0, 3)];
      return [
        mq(
          `Calculate ${pct}% of ${qty} using quick mental decomposition (10% + 5% blocks):`,
          `10% of ${qty} = ${qty / 10}.`,
          `${(pct * qty) / 100}`,
          [`${(pct * qty) / 100 + 20}`, `${(pct * qty) / 100 - 15}`, `${pct + qty}`],
          `(${pct}/100) × ${qty} = ${(pct * qty) / 100}.`,
          rng
        ),
        mq(
          'If 25% of an unknown number N is 45, what is N?',
          '25% = 1/4, so multiply 45 × 4.',
          '180',
          ['11.25', '135', '225'],
          `N = 45 × (100/25) = 45 × 4 = 180.`,
          rng
        ),
        mq(
          'Free-hand shortcut: 50% of 86 + 10% of 80 = ?',
          'Half of 86 plus one-tenth of 80.',
          '51',
          ['43', '59', '48'],
          `43 + 8 = 51.`,
          rng
        ),
      ];
    }

    case 'p2-mod-1-3': {
      const k = ri(rng, 2, 4);
      return [
        mq(
          `A rocket payload doubles in mass (+100% increase), becoming 200% of original. What is ${k * 100}% as a multiplier?`,
          'Divide percentage by 100.',
          `${k}× (multiplied by ${k})`,
          [`${k / 10}×`, `${k + 1}×`, `${k * 10}×`],
          `${k * 100}% = ${k * 100}/100 = ${k}× the base quantity.`,
          rng
        ),
        mq(
          'Convert 175% into a mixed fraction/decimal:',
          '175/100 = 1.75.',
          '1¾ (or 1.75)',
          ['0.175', '17.5', '1¼'],
          `175% = 100% + 75% = 1 + 3/4 = 1.75.`,
          rng
        ),
        mq(
          'If a price increases FROM ₹100 TO ₹250, what is the percentage of old price it now represents?',
          '(250 / 100) × 100%.',
          '250% (which is a +150% increase)',
          ['150%', '2.5%', '350%'],
          `New value is 250% of original ₹100 (+150% net increase).`,
          rng
        ),
      ];
    }

    case 'p2-mod-1-4': {
      return [
        mq(
          'Student A scored 36/45 and Student B scored 42/50. Who achieved the higher percentage score?',
          'Convert both to percentages out of 100.',
          'Student B (84% vs 80%)',
          ['Student A (85% vs 84%)', 'Both scored identically', 'Student A (because 36/45 simplifies higher)'],
          `36/45 = 4/5 = 80%; 42/50 = 84/100 = 84% ⇒ Student B wins!`,
          rng
        ),
        mq(
          'Why do percentages let us compare fractions with different denominators (like 17/25 vs 27/40)?',
          'All percentages normalize to a common denominator.',
          'Percentages convert every fraction to a common base of 100',
          ['Percentages make numerators disappear', 'Only integers can compare', 'Base changes to 60'],
          `Expressing both "per 100" puts completely different wholes on the exact same scale.`,
          rng
        ),
        mq(
          'Juice X has 18 ml pure fruit in 60 ml; Juice Y has 21 ml in 75 ml. Which is richer?',
          '18/60 = 30%; 21/75 = 28%.',
          'Juice X (30% vs 28%)',
          ['Juice Y (28% vs 25%)', 'Equal concentration', 'Juice Y (35%)'],
          `18/60 = 3/10 = 30% > 21/75 = 7/25 = 28%.`,
          rng
        ),
      ];
    }

    case 'p2-mod-1-5': {
      return [
        mq(
          'A phone costs ₹10,000. Its price rises +20% then drops −20%. What is the FINAL price?',
          'Successive percentage changes apply to the NEW value after Step 1!',
          '₹9,600 (a net −4% drop!)',
          ['₹10,000 (unchanged)', '₹10,400', '₹8,000'],
          `₹10,000 × 1.20 = ₹12,000; then −20% of 12,000 = −2,400 ⇒ ₹9,600!`,
          rng
        ),
        mq(
          'Milk goes from ₹50/L to ₹58/L due to inflation. Find the percentage increase:',
          '(% Change) = (Change / Original Price) × 100.',
          '+16%',
          ['+8%', '+13.8%', '+18%'],
          `(8 / 50) × 100% = 16%.`,
          rng
        ),
        mq(
          'If a salary increases +25%, what percentage decrease restores it back to the original salary?',
          'From 125 back to 100 is −25 out of 125!',
          '−20%',
          ['−25%', '−15%', '−33.3%'],
          `25 / 125 = 1/5 = 20% drop restores 125 back to 100.`,
          rng
        ),
      ];
    }

    case 'p2-mod-1-6': {
      const cp = ri(rng, 4, 8) * 100;
      const profitPct = 20;
      return [
        mq(
          `A jacket costs wholesale ₹${cp}. Sold at a ${profitPct}% profit, find its Selling Price (SP):`,
          `SP = CP × (1 + ${profitPct}/100).`,
          `₹${cp * 1.2}`,
          [`₹${cp + 20}`, `₹${cp * 0.8}`, `₹${cp * 1.4}`],
          `20% of ₹${cp} = ₹${cp * 0.2}, so SP = ₹${cp} + ₹${cp * 0.2} = ₹${cp * 1.2}.`,
          rng
        ),
        mq(
          'Discount % is ALWAYS calculated on which price tag?',
          'Shoppers see Marked Price on the sticker!',
          'Marked Price (MP)',
          ['Cost Price (CP)', 'Wholesale Profit', 'GST Tax'],
          `Discount = Marked Price − Selling Price; Discount % = (Discount / MP) × 100.`,
          rng
        ),
        mq(
          'Marked Price is ₹1,200 with a 15% Black Friday discount. Find the customer’s Selling Price:',
          '15% of 1200 = 120 + 60 = 180.',
          '₹1,020',
          ['₹1,185', '₹980', '₹1,080'],
          `₹1,200 − ₹180 = ₹1,020.`,
          rng
        ),
      ];
    }

    case 'p2-mod-1-7': {
      const base = 1000;
      const gst = [12, 18][ri(rng, 0, 1)];
      return [
        mq(
          `A bicycle base price is ₹${base} with ${gst}% GST added at checkout. What is the final bill?`,
          `Add ${gst}% of ${base} to ${base}.`,
          `₹${base + base * (gst / 100)}`,
          [`₹${base + gst}`, `₹${base - base * (gst / 100)}`, `₹${base + 2 * gst}`],
          `${gst}% of ₹${base} = ₹${base * (gst / 100)}; final bill = ₹${base + base * (gst / 100)}.`,
          rng
        ),
        mq(
          'Why does ₹1,000 at 10% Compound Interest for 2 years earn MORE than Simple Interest?',
          'Compare Year 2 interest!',
          'Year 2 earns 10% on Year 1’s ₹100 interest too (₹1,210 vs ₹1,200)',
          ['Simple interest multiplies by time squared', 'Compound interest adds double rate every month', 'They earn the exact same amount'],
          `Compound interest grows exponentially on prior interest: 1000×(1.1)² = ₹1,210 vs Simple ₹1,200.`,
          rng
        ),
        mq(
          'A car worth ₹5,00,000 depreciates by 10% per year. What is its value after 1 year?',
          'Subtract 10% of 5,00,000.',
          '₹4,50,000',
          ['₹5,50,000', '₹4,90,000', '₹4,00,000'],
          `5,00,000 × 0.90 = ₹4,50,000.`,
          rng
        ),
      ];
    }

    // =========================================================================
    // PART II — CHAPTER 2: THE BAUDHAYANA-PYTHAGORAS THEOREM (p2-mod-2-1..7)
    // =========================================================================
    case 'p2-mod-2-1': {
      const side = ri(rng, 4, 10);
      return [
        mq(
          `A square has side ${side} cm (area ${side * side} cm²). What is the AREA of a square built on its DIAGONAL?`,
          'By Baudhāyana’s Sulbasutra doubling theorem, the diagonal square has DOUBLE the area!',
          `${2 * side * side} cm²`,
          [`${4 * side * side} cm²`, `${side * side} cm²`, `${side * side / 2} cm²`],
          `Folding the 4 half-squares formed by diagonals doubles area cleanly to 2 × ${side * side} = ${2 * side * side} cm².`,
          rng
        ),
        mq(
          'To build a square with HALF the area of a given square of side 10 cm (area 100 cm²), connect what points?',
          'Connect the midpoints of the 4 sides!',
          'Join the midpoints of all 4 edges (area = 50 cm²)',
          ['Halve the side to 5 cm (area = 25 cm²!)', 'Double the perimeter', 'Cut off one strip'],
          `Halving edge length cuts area to 1/4 (25 cm²), whereas midpoint-joining forms an exact 50 cm² square.`,
          rng
        ),
        mq(
          'A square altar has area 36 m². What is the side length of an altar with DOUBLE its area (72 m²)?',
          'Side = √72.',
          '√72 m (= 6√2 m)',
          ['12 m (area 144!)', '18 m', '9 m'],
          `Doubling area scales side by √2, not ×2.`,
          rng
        ),
      ];
    }

    case 'p2-mod-2-2': {
      const s = ri(rng, 3, 9);
      return [
        mq(
          `An isosceles right triangle has legs ${s} cm and ${s} cm. What is the exact length of its hypotenuse?`,
          'By a² + a² = c² ⇒ c = √(2a²) = a√2.',
          `√(${2 * s * s}) cm (= ${s}√2 cm)`,
          [`${2 * s} cm`, `${s * s} cm`, `${s + 2} cm`],
          `c² = ${s}² + ${s}² = ${2 * s * s}, so c = √(${2 * s * s}) = ${s}√2 cm.`,
          rng
        ),
        mq(
          'For a unit square (side = 1), its diagonal is √2. Is √2 a rational fraction p/q?',
          'Classic Greek & Indian proof!',
          'No — √2 is irrational (never exact p/q)',
          ['Yes, 7/5 is exact', 'Yes, 1.414 is exact', 'Yes, 17/12 is exact'],
          `Since p² = 2q² implies impossible odd/even 2-factor parity, √2 is irrational.`,
          rng
        ),
        mq(
          'Between which two integers does √2 lie?',
          'Compare 1² < 2 < 2².',
          'Between 1 and 2 (≈ 1.414)',
          ['Between 0 and 1', 'Between 2 and 3', 'Equals 1.5'],
          `1² = 1 < 2 < 4 = 2², so √2 ≈ 1.4142...`,
          rng
        ),
      ];
    }

    case 'p2-mod-2-3': {
      return [
        mq(
          'Why can 1.414 NEVER be the exact value of √2?',
          'Check the last digit of 1.414 × 1.414!',
          'A decimal ending in 4 squared ends in 6 (1.999396), never 2.000000',
          ['Because 1.414 is smaller than 1', 'Because 2 is odd', 'Because calculators round down always'],
          `No finite non-zero decimal digit squared ends in 000..., proving √2 is non-terminating.`,
          rng
        ),
        mq(
          'What close rational approximation of √2 did the ancient Baudhāyana Śulbasūtra provide?',
          '1 + 1/3 + 1/(3×4) − 1/(3×4×34).',
          '577/408 ≈ 1.41421568... (accurate to 5 decimal places!)',
          ['3/2 = 1.5', '11/10 = 1.1', '7/4 = 1.75'],
          `Baudhāyana’s series gives 1.4142156..., differing from true √2 by less than 2 millionths.`,
          rng
        ),
        mq(
          'Which decimal interval brackets √2 to the hundredths place?',
          'Compare 1.41² = 1.9881 and 1.42² = 2.0164.',
          'Between 1.41 and 1.42',
          ['Between 1.40 and 1.41', 'Between 1.42 and 1.43', 'Between 1.44 and 1.45'],
          `1.41² = 1.9881 < 2 < 2.0164 = 1.42².`,
          rng
        ),
      ];
    }

    case 'p2-mod-2-4': {
      return [
        mq(
          'To construct ONE square whose area equals the SUM of a 6×6 square and an 8×8 square, what must its side length be?',
          'Combined area = 6² + 8² = 36 + 64 = 100.',
          '10 units (10² = 100)',
          ['14 units (6 + 8)', '12 units', '48 units'],
          `By Baudhāyana’s rope construction, √(36 + 64) = √100 = 10.`,
          rng
        ),
        mq(
          'If Area(Square C) = 169 cm² and Area(Square A) = 25 cm², find Area and Side of missing Square B:',
          'Subtract 169 − 25 = 144.',
          'Area = 144 cm², Side = 12 cm',
          ['Area = 194 cm², Side = 14 cm', 'Area = 144 cm², Side = 72 cm', 'Area = 100 cm², Side = 10 cm'],
          `169 − 25 = 144 = 12².`,
          rng
        ),
        mq(
          'When Bhāskara II arranged 4 identical right triangles (a, b, c) around an inner (b−a)×(b−a) square, what did he prove?',
          'Total c² = 4×(½ab) + (b−a)² = a² + b²!',
          'a² + b² = c² geometrically ("Behold!")',
          ['a + b = c', '2a = c', 'Area = 4c²'],
          `Bhāskara’s dissection proof visually verifies a² + b² = c².`,
          rng
        ),
      ];
    }

    case 'p2-mod-2-5': {
      const trips = [
        { a: 5, b: 12, c: 13 },
        { a: 8, b: 15, c: 17 },
        { a: 7, b: 24, c: 25 },
      ];
      const t = trips[ri(rng, 0, 2)];
      return [
        mq(
          `A right-angled triangle has legs ${t.a} cm and ${t.b} cm. Compute exact hypotenuse c:`,
          `c = √(${t.a}² + ${t.b}²).`,
          `${t.c} cm`,
          [`${t.a + t.b} cm`, `${t.c - 2} cm`, `${t.c + 3} cm`],
          `${t.a}² + ${t.b}² = ${t.a * t.a} + ${t.b * t.b} = ${t.c * t.c} ⇒ c = ${t.c} cm.`,
          rng
        ),
        mq(
          `A ${t.c} m ladder leans against a wall, reaching ${t.b} m high. How far is the base from the wall?`,
          `Leg a = √(${t.c}² − ${t.b}²).`,
          `${t.a} m`,
          [`${t.c - t.b} m`, `${t.a + 2} m`, `${t.b} m`],
          `√(${t.c * t.c} − ${t.b * t.b}) = √${t.a * t.a} = ${t.a} m.`,
          rng
        ),
        mq(
          'A rectangle is 9 cm by 12 cm. How long is its diagonal?',
          'Right triangle with legs 9 and 12.',
          '15 cm',
          ['21 cm', '18 cm', '13 cm'],
          `√(9² + 12²) = √(81 + 144) = √225 = 15 cm.`,
          rng
        ),
      ];
    }

    case 'p2-mod-2-6': {
      const k = ri(rng, 2, 5);
      return [
        mq(
          `Scaling the primitive triple (3, 4, 5) by ×${k} produces which right-triangle triple?`,
          `Multiply all 3 sides by ${k}.`,
          `(${3 * k}, ${4 * k}, ${5 * k})`,
          [`(${3 + k}, ${4 + k}, ${5 + k})`, `(${3 * k}, ${4 * k}, ${5 * (k + 1)})`, `(3, 4, ${5 * k})`],
          `(${3 * k})² + (${4 * k})² = (${5 * k})² holds for any scale k.`,
          rng
        ),
        mq(
          'Check whether triangle sides (5, 7, 9) form a Right, Acute, or Obtuse triangle:',
          'Compare 5² + 7² (74) against 9² (81).',
          'Obtuse triangle (5² + 7² = 74 < 81 = 9²)',
          ['Right triangle (a² + b² = c²)', 'Acute triangle (a² + b² > c²)', 'Cannot form a triangle'],
          `When a² + b² < c², the largest corner opens wider than 90° ⇒ OBTUSE.`,
          rng
        ),
        mq(
          'Which set is a TRUE primitive Baudhāyana-Pythagorean triple?',
          'Check a² + b² = c².',
          '(8, 15, 17)',
          ['(6, 9, 12)', '(7, 12, 15)', '(4, 6, 8)'],
          `8² + 15² = 64 + 225 = 289 = 17².`,
          rng
        ),
      ];
    }

    case 'p2-mod-2-7': {
      return [
        mq(
          'What does Fermat’s Last Theorem prove about aⁿ + bⁿ = cⁿ for whole numbers a, b, c when n ≥ 3 (e.g. a³ + b³ = c³)?',
          'Squares work (n=2), what about cubes and higher powers?',
          'There are ZERO positive integer solutions for n ≥ 3',
          ['Infinitely many cube triples exist starting with 3³+4³=5³', 'Solutions exist only for prime n', 'It works up to n=10'],
          `Proved by Andrew Wiles (1995), aⁿ + bⁿ = cⁿ has no positive integer solutions for any n ≥ 3.`,
          rng
        ),
        mq(
          'Find the 3D space diagonal inside a 3 m × 4 m × 12 m cargo hangar:',
          '3D Pythagoras: d = √(l² + w² + h²).',
          '13 m',
          ['19 m', '15 m', '17 m'],
          `√(3² + 4² + 12²) = √(9 + 16 + 144) = √169 = 13 m.`,
          rng
        ),
        mq(
          'In ancient Sulbasutras, why were knotted 3–4–5 and 5–12–13 ropes stretched around wooden pegs?',
          'No modern steel squares existed!',
          'To construct true 90° right angles accurately for fire-altars',
          ['To measure rainfall', 'To calculate cube roots', 'To divide fractions'],
          `Because 3² + 4² = 5², stretching a 12-unit knotted loop guarantees an exact 90° corner.`,
          rng
        ),
      ];
    }

    // =========================================================================
    // PART II — CHAPTER 3: PROPORTIONAL REASONING-2 (p2-mod-3-1 .. p2-mod-3-7)
    // =========================================================================
    case 'p2-mod-3-1': {
      const m = ri(rng, 2, 5);
      return [
        mq(
          `If 6 : x :: ${6 * m} : ${11 * m}, what is x?`,
          'Divide second ratio back by scale factor.',
          '11',
          [`${11 + m}`, `${6 + m}`, `${11 * m}`],
          `6 × ${m} = ${6 * m}, so x × ${m} = ${11 * m} ⇒ x = 11.`,
          rng
        ),
        mq(
          'In a direct variation y = kx, if y = 36 when x = 9, find k and y when x = 15:',
          'k = 36 ÷ 9 = 4.',
          'k = 4, y = 60',
          ['k = 27, y = 42', 'k = 0.25, y = 45', 'k = 4, y = 48'],
          `Constant ratio k = 4 ⇒ y = 4 × 15 = 60.`,
          rng
        ),
        mq(
          'Which table pair is directly proportional (y/x constant)?',
          'Check if y ÷ x stays identical.',
          '(2, 10), (5, 25), (8, 40)',
          ['(2, 12), (4, 20), (6, 28)', '(1, 6), (2, 7), (3, 8)', '(2, 30), (3, 20), (5, 12)'],
          `In every pair, y/x = 5.`,
          rng
        ),
      ];
    }

    case 'p2-mod-3-2': {
      const cm = ri(rng, 3, 7);
      return [
        mq(
          `On a map with Representative Fraction (RF) 1 : 200,000, two cities are ${cm} cm apart. What is the real distance in km?`,
          'Multiply cm × 200,000 cm, then divide by 100,000 cm/km.',
          `${2 * cm} km`,
          [`${20 * cm} km`, `${0.2 * cm} km`, `${cm} km`],
          `1 cm = 200,000 cm = 2 km ⇒ ${cm} cm = ${2 * cm} km.`,
          rng
        ),
        mq(
          'Express map scale "1 cm = 500 m" as a unitless Representative Fraction (RF):',
          'Convert 500 m to 50,000 cm.',
          '1 : 50,000',
          ['1 : 500', '1 : 5,000', '1 : 5,00,000'],
          `1 cm : 50,000 cm = 1 : 50,000.`,
          rng
        ),
        mq(
          'An architectural model uses RF = 1 : 100. How tall is a 35 m building on the model?',
          'Divide 35 m (3,500 cm) by 100.',
          '35 cm',
          ['3.5 cm', '350 cm', '0.35 cm'],
          `3,500 cm ÷ 100 = 35 cm.`,
          rng
        ),
      ];
    }

    case 'p2-mod-3-3': {
      return [
        mq(
          'Combine the linked ratios A : B = 2 : 3 and B : C = 4 : 5 into A : B : C:',
          'Match the common term B to LCM(3, 4) = 12!',
          '8 : 12 : 15',
          ['2 : 12 : 5', '2 : 3 : 5', '6 : 12 : 20'],
          `Scale 2:3 by ×4 → 8:12; scale 4:5 by ×3 → 12:15 ⇒ A:B:C = 8 : 12 : 15.`,
          rng
        ),
        mq(
          'Bronze uses Copper : Tin : Zinc = 7 : 2 : 1. How much Tin is needed for 200 kg of Bronze?',
          'Total parts = 7 + 2 + 1 = 10.',
          '40 kg',
          ['20 kg', '140 kg', '50 kg'],
          `Tin share = (2/10) × 200 = 40 kg.`,
          rng
        ),
        mq(
          'If X : Y = 3 : 5 and Y : Z = 5 : 9, find X : Z directly:',
          'Notice Y is ALREADY 5 in both!',
          '3 : 9 = 1 : 3',
          ['3 : 5', '5 : 9', '15 : 27'],
          `X:Y:Z = 3:5:9 ⇒ X:Z = 3:9 = 1:3.`,
          rng
        ),
      ];
    }

    case 'p2-mod-3-4': {
      const shareBase = ri(rng, 10, 30);
      const total = 10 * shareBase; // ratio 5:3:2
      return [
        mq(
          `Divide ₹${total} in the ratio 5 : 3 : 2. What is the largest share?`,
          `Total parts = 5 + 3 + 2 = 10.`,
          `₹${5 * shareBase}`,
          [`₹${3 * shareBase}`, `₹${2 * shareBase}`, `₹${4 * shareBase}`],
          `Each part = ₹${shareBase}; largest share = 5 × ₹${shareBase} = ₹${5 * shareBase}.`,
          rng
        ),
        mq(
          'Concrete is mixed Cement : Sand : Gravel = 1 : 2 : 3. If 24 buckets of Gravel are poured, how many buckets of Cement are needed?',
          '3 parts = 24 ⇒ 1 part = 8.',
          '8 buckets',
          ['16 buckets', '4 buckets', '12 buckets'],
          `Gravel is 3× Cement, so 24 ÷ 3 = 8 buckets Cement.`,
          rng
        ),
        mq(
          'Angles of a triangle are in ratio 2 : 3 : 4. Find all 3 angles:',
          'Total sum = 180° split into 2+3+4 = 9 parts (20°/part).',
          '40°, 60°, 80°',
          ['20°, 60°, 100°', '30°, 60°, 90°', '50°, 60°, 70°'],
          `9 parts = 180° ⇒ 1 part = 20° ⇒ 40°, 60°, 80°.`,
          rng
        ),
      ];
    }

    case 'p2-mod-3-5': {
      const pct = [15, 25, 30, 40][ri(rng, 0, 3)];
      return [
        mq(
          `On a 360° pie chart, a sector represents ${pct}% of total budget. What is its central angle?`,
          `Multiply (${pct}/100) × 360°.`,
          `${(pct * 360) / 100}°`,
          [`${pct}°`, `${(pct * 180) / 100}°`, `${360 - pct}°`],
          `(${pct}/100) × 360° = ${(pct * 360) / 100}°.`,
          rng
        ),
        mq(
          'In a survey of 120 students, 30 chose Cricket. What pie-chart sector angle represents Cricket?',
          '(30 / 120) × 360° = 1/4 × 360°.',
          '90°',
          ['30°', '120°', '45°'],
          `1/4 of a full 360° circle = 90°.`,
          rng
        ),
        mq(
          'Why must all sectors of a pie chart sum to 360° (and 100%)?',
          'Every slice partitions the whole!',
          'Because a complete circle around the center is 360° (100% of data)',
          ['Angles depend on sample size', 'Only 4 slices are allowed', '100° makes a half circle'],
          `All fractional parts of 1 whole sum to 100%, occupying 360°.`,
          rng
        ),
      ];
    }

    case 'p2-mod-3-6': {
      const d = 360;
      const t = [4, 5, 6][ri(rng, 0, 2)];
      return [
        mq(
          `A train must cover ${d} km in ${t} hours. If it cuts travel time in HALF (${t / 2} hours), what happens to required speed?`,
          'Distance = Speed × Time (inverse variation).',
          `Speed DOUBLES to ${(d / t) * 2} km/h`,
          [`Speed halves to ${d / (2 * t)} km/h`, 'Speed stays unchanged', 'Speed rises by 50%'],
          `To cover fixed ${d} km in half the time, speed must double cleanly.`,
          rng
        ),
        mq(
          'Two pipes fill a tank in 6 hours together. How long will 3 identical pipes take?',
          'Pipes × Hours = Constant (2 × 6 = 12 pipe-hours).',
          '4 hours',
          ['9 hours', '3 hours', '5 hours'],
          `12 pipe-hours ÷ 3 pipes = 4 hours.`,
          rng
        ),
        mq(
          'In xy = 120, what happens to y as x grows 3× larger?',
          'Product stays fixed at 120.',
          'y shrinks to 1/3 of its value',
          ['y triples', 'y increases by +3', 'y stays 120'],
          `In inverse proportion, multiplying x by 3 divides y by 3.`,
          rng
        ),
      ];
    }

    case 'p2-mod-3-7': {
      return [
        mq(
          'A 48-tooth front chainring drives a 16-tooth rear sprocket. How many times does the rear wheel turn for 1 pedal revolution?',
          'Divide front teeth ÷ rear teeth.',
          '3 full revolutions',
          ['1/3 revolution', '32 revolutions', '1.5 revolutions'],
          `Small gear spins faster inversely to teeth count: 48 ÷ 16 = 3 turns.`,
          rng
        ),
        mq(
          'If 4 painters paint 4 houses in 4 days, how many days does 1 painter need for 1 house?',
          'Rate per painter = 1 house per 4 days!',
          '4 days',
          ['1 day', '16 days', '2 days'],
          `Each painter handles 1 house in 4 days independently.`,
          rng
        ),
        mq(
          'Alloy A is 40% gold and Alloy B is 70% gold. Mixing 100 g of A with 100 g of B yields what gold %?',
          'Equal weights blend to midpoint (40 + 70)/2.',
          '55% gold',
          ['110% gold', '50% gold', '30% gold'],
          `(40 g + 70 g) / 200 g = 110 / 200 = 55%.`,
          rng
        ),
      ];
    }

    // =========================================================================
    // PART II — CHAPTER 4: EXPLORING SOME GEOMETRIC THEMES (p2-mod-4-1..7)
    // =========================================================================
    case 'p2-mod-4-1': {
      return [
        mq(
          'What defines SELF-SIMILARITY in fractals like ferns, Romanesco broccoli, and Hindu temple śikhara towers?',
          'Zoom into one small branch or mini-shrine.',
          'Smaller parts mimic the geometric shape of the whole structure across scales',
          ['Every angle increases by 90°', 'Perimeter shrinks to zero', 'Shapes have only 1 symmetry line'],
          `Self-similarity means zoomed-in sub-motifs repeat the large-scale pattern recursively.`,
          rng
        ),
        mq(
          'A branching tree splits 1 trunk into 3 twigs per iteration. How many new twig tips appear at Step 4?',
          '3⁴ = 3×3×3×3.',
          '81 twig tips',
          ['12 twig tips', '27 twig tips', '64 twig tips'],
          `Tripling per generation gives 3⁴ = 81 tips.`,
          rng
        ),
        mq(
          'Which architectural feature of classical Indian temples illustrates nested mini-towers echoing the main spire?',
          'Uruśṛṅga miniature turrets clustered up the spire!',
          'Self-similar Śikhara turrets (Uruśṛṅga)',
          ['Random scattered arches', 'Flat grid ceiling tiles', 'Circular dome only'],
          `Temple śikharas stack smaller replicas of the main spire around its flanks recursively.`,
          rng
        ),
      ];
    }

    case 'p2-mod-4-2': {
      const step = ri(rng, 2, 4);
      return [
        mq(
          `In the Sierpinski Carpet (punch out 1 center sub-square leaving 8 around it), how many tiny filled squares exist after ${step} iterations?`,
          `Compute 8^${step}.`,
          `${Math.pow(8, step)} squares`,
          [`${Math.pow(9, step)} squares`, `${8 * step} squares`, `${Math.pow(3, step)} squares`],
          `Each filled square splits into 8 sub-squares per step ⇒ 8^${step} = ${Math.pow(8, step)}.`,
          rng
        ),
        mq(
          `In the Sierpinski Gasket (remove center inverted triangle, keep 3 corners), how many filled triangles exist at Iteration ${step}?`,
          `Compute 3^${step}.`,
          `${Math.pow(3, step)} triangles`,
          [`${3 * step} triangles`, `${Math.pow(4, step)} triangles`, `${Math.pow(2, step)} triangles`],
          `Keeping 3 corner sub-triangles multiplies filled count ×3 per iteration ⇒ 3^${step}.`,
          rng
        ),
        mq(
          'What happens to the REMAINING solid AREA fraction of a Sierpinski Gasket after 1 cut?',
          '1 middle out of 4 equal triangles is removed.',
          '3/4 of previous area remains (and approaches 0 as n → ∞)',
          ['Area stays 100% forever', 'Area doubles each step', 'Area becomes 1/2 forever'],
          `Removing 1/4 leaves 3/4; repeating n times gives (3/4)ⁿ → 0.`,
          rng
        ),
      ];
    }

    case 'p2-mod-4-3': {
      return [
        mq(
          'At every iteration of the Koch Snowflake, each straight segment splits into 4 sub-segments of length 1/3. By what factor does PERIMETER scale per step?',
          '4 × (1/3) = ?',
          '4/3 (growing larger every step!)',
          ['1/3 (shrinking)', '3/4', 'Stays constant 1'],
          `Each segment of length 1 becomes 4 segments of length 1/3 ⇒ new perimeter = 4/3 × old.`,
          rng
        ),
        mq(
          'A Koch Snowflake begins with an equilateral triangle of perimeter 9 cm. Find its perimeter after 2 iterations:',
          'Multiply 9 × (4/3)² = 9 × 16/9.',
          '16 cm',
          ['12 cm', '27 cm', '13.5 cm'],
          `9 × 4/3 = 12 cm (Step 1); 12 × 4/3 = 16 cm (Step 2).`,
          rng
        ),
        mq(
          'Why is the Koch Snowflake famous mathematically as iterations n → ∞?',
          'Compare perimeter growth (4/3)ⁿ vs bounded enclosing circle.',
          'Its perimeter grows INFINITE while its enclosed area stays FINITE',
          ['Area becomes infinite while perimeter stays 3', 'Both vanish to 0', 'It becomes a smooth circle'],
          `(4/3)ⁿ diverges to infinity while staying tucked neatly inside a finite bounding circle!`,
          rng
        ),
      ];
    }

    case 'p2-mod-4-4': {
      return [
        mq(
          'How many distinct valid 6-square 2D nets fold cleanly into a 3D cube (counting rotations/flips as one)?',
          'Exact combinatorial count of hexomino cube nets!',
          '11 nets',
          ['6 nets', '8 nets', '35 nets'],
          `Out of all 35 hexominoes, exactly 11 fold without overlapping into a closed 3D cube.`,
          rng
        ),
        mq(
          'Why can a net containing a 2×2 square cluster of 4 tiles NEVER fold into a cube?',
          'Check corners meeting at a single vertex.',
          '4 squares share one corner (360°), overlapping when folded up',
          ['A cube only has 4 faces', 'Square faces cannot have 90° edges', 'It turns into a sphere'],
          `At any cube vertex only 3 squares meet (270°); 4 coplanar squares around one point cannot fold into 3D.`,
          rng
        ),
        mq(
          'Verify Euler’s Polyhedron Formula V − E + F = 2 for a square-based pyramid (V=5, F=5):',
          'Find Edges E so 5 − E + 5 = 2.',
          'E = 8 edges (4 base + 4 slant edges)',
          ['E = 6 edges', 'E = 10 edges', 'E = 12 edges'],
          `5 − 8 + 5 = 2 holds true.`,
          rng
        ),
      ];
    }

    case 'p2-mod-4-5': {
      return [
        mq(
          'An ant sits on corner A of a 3×4×5 room/box floor and must crawl along faces to opposite top corner B. How do you find the SHORTEST surface path?',
          'Straight lines on flat paper are always shortest!',
          'Unfold the adjacent faces into a flat 2D net and connect A to B with a straight line (Pythagoras)',
          ['Measure the space diagonal through air', 'Walk only along edges', 'Multiply all 3 dimensions'],
          `Unfolding adjacent faces turns crooked 3D paths into simple straight-line hypotenuses √(x² + y²).`,
          rng
        ),
        mq(
          'On a 1×1×1 unit cube, an ant crawls from bottom-front-left to top-back-right across two faces. What is the shortest surface distance?',
          'Unfold 2 faces into a 2 × 1 flat rectangle!',
          '√5 units (≈ 2.236)',
          ['2 units', '3 units', '√3 units (internal air path)'],
          `On the unfolded 2 × 1 rectangle, straight diagonal = √(2² + 1²) = √5.`,
          rng
        ),
        mq(
          'When unfolding a rectangular box multiple ways (e.g. Front+Top vs Front+Right), why must you check all 3 unfoldings?',
          'Shortest hypotenuse belongs to (small + mid)² + large²!',
          'Different unfoldings change the leg sums, giving different diagonal lengths',
          ['All 3 unfoldings always give identical lengths', 'The ant cannot cross edges', 'Top face vanishes'],
          `Pairing the two smaller edges (a+b)² + c² yields the minimum surface distance!`,
          rng
        ),
      ];
    }

    case 'p2-mod-4-6': {
      return [
        mq(
          'Look straight down (TOP orthographic view) at a right circular cone standing flat on its base. What 2D shape do you see?',
          'Look from directly overhead at the circular base and apex dot.',
          'A circle with a center point',
          ['A triangle', 'A rectangle', 'A hexagon'],
          `Overhead, a cone projects its circular base with the apex at center; Front/Side views show a triangle!`,
          rng
        ),
        mq(
          'Which 3D solid casts a CIRCLE shadow from top, and a RECTANGLE shadow from front/side?',
          'Rollable soup can!',
          'Right circular Cylinder',
          ['Cone', 'Sphere', 'Cube'],
          `A vertical cylinder projects a circle overhead and a rectangle horizontally.`,
          rng
        ),
        mq(
          'Do parallel sunlight rays shrink distant parts in an orthographic projection?',
          'Parallel orthographic rays strike vertically without perspective vanishing points.',
          'No — parallel projections preserve true perpendicular widths across depth',
          ['Yes — height shrinks to zero', 'Shadows twist 45°', 'Curved edges always turn triangular'],
          `Orthographic views map parallel lines directly onto 2D coordinate planes cleanly.`,
          rng
        ),
      ];
    }

    case 'p2-mod-4-7': {
      return [
        mq(
          'On isometric dot paper, how many degrees apart are the 3 principal axes meeting at a corner vertex?',
          '360° ÷ 3 symmetric axes.',
          '120° apart (two at 30° horizontal + one vertical)',
          ['90° apart', '45° apart', '60° and 180°'],
          `Isometric axes split 360° cleanly into three equal 120° angles.`,
          rng
        ),
        mq(
          'Why do TOP + FRONT + SIDE orthographic shadow grids leave the exact cube count within a Min–Max range instead of 1 unique answer?',
          'Internal hidden columns behind taller towers may stay invisible!',
          'Hidden lower columns behind taller front cubes can be empty or filled without altering silhouettes',
          ['Top view ignores corners', 'Cubes melt into cylinders', 'Front view doubles height'],
          `Different hidden stacks share identical projections: Minimum omits hidden backups while Maximum fills every overlapping column.`,
          rng
        ),
        mq(
          'If a 2×2 top footprint has Front heights [2, 1] and Side heights [2, 1], what is the MAXIMUM cubes possible?',
          'Take min(front[c], side[r]) in every 2×2 cell: [2, 1; 1, 1].',
          '5 cubes (2 + 1 + 1 + 1)',
          ['4 cubes', '8 cubes', '3 cubes'],
          `Summing min(rowMax, colMax) across all 4 cells gives 2 + 1 + 1 + 1 = 5.`,
          rng
        ),
      ];
    }

    // =========================================================================
    // PART II — CHAPTER 5: TALES BY DOTS AND LINES (p2-mod-5-1..7)
    // =========================================================================
    case 'p2-mod-5-1': {
      const m = ri(rng, 6, 12);
      return [
        mq(
          `On a balance beam, weights sit at ${m - 2}, ${m}, and ${m + 5}. Where must a 4th equal weight sit to keep the Mean balanced at ${m}?`,
          'Deviations from the Mean must sum to ZERO: (−2) + 0 + (+5) + d = 0!',
          `At ${m - 3} (deviation −3)`,
          [`At ${m + 3}`, `At ${m}`, `At ${m - 5}`],
          `(−2) + (+5) = +3 extra right pull, so the 4th dot sits 3 units left at ${m - 3}!`,
          rng
        ),
        mq(
          'Why is the Arithmetic Mean described as a "centre of balance"?',
          'Compare sum of distances left of Mean vs right of Mean.',
          'Total deviations below the mean ALWAYS cancel total deviations above it (sum = 0)',
          ['Because half the dots are always equal', 'It is always an integer in the list', 'It equals (Max − Min)'],
          `Σ(xᵢ − x̄) = 0 — the mean acts literally like a seesaw fulcrum!`,
          rng
        ),
        mq(
          `Five friends score [12, 14, 15, 17, 22]. Compute the Mean score:`,
          'Sum ÷ 5.',
          '16',
          ['15 (that is the Median!)', '17', '14'],
          `(12 + 14 + 15 + 17 + 22) ÷ 5 = 80 ÷ 5 = 16.`,
          rng
        ),
      ];
    }

    case 'p2-mod-5-2': {
      return [
        mq(
          'Salaries at a small shop are [₹20k, ₹22k, ₹24k, ₹24k, ₹210k]. Which measure better describes a typical worker’s pay?',
          'Watch out for the extreme ₹210k outlier!',
          'Median (₹24k) — unaffected by the extreme ₹210k outlier (Mean jumps to ₹60k!)',
          ['Mean (₹60k)', 'Range (₹190k)', 'Minimum'],
          `Outliers pull the Mean sharply upward while Median stays anchored at the middle worker.`,
          rng
        ),
        mq(
          'Find the MEDIAN of the unsorted list [18, 7, 25, 12, 9, 20]:',
          'Sort first: [7, 9, 12, 18, 20, 25], then average the two middle items.',
          '15',
          ['12', '18', '16'],
          `Sorted middle pair is 12 and 18 ⇒ Median = (12 + 18) ÷ 2 = 15.`,
          rng
        ),
        mq(
          'When are Mean and Median EQUAL?',
          'Test symmetric data like [4, 6, 8, 10, 12].',
          'In symmetric distributions (no skew or extreme outliers)',
          ['Only when all values are 0', 'Never', 'Whenever n is even'],
          `Symmetry balances both the middle rank and arithmetic balance at the exact same point.`,
          rng
        ),
      ];
    }

    case 'p2-mod-5-3': {
      const shift = ri(rng, 4, 9);
      return [
        mq(
          `Every student in a class gets +${shift} bonus marks added to their score. How do Mean and Median change?`,
          'Shifting every point right moves the entire distribution rigidly.',
          `Both Mean and Median increase by exactly +${shift}`,
          ['Only Mean increases; Median stays put', `Both multiply by ×${shift}`, 'Neither changes'],
          `Adding constant +${shift} to every entry shifts both balance point (Mean) and middle score (Median) by +${shift}.`,
          rng
        ),
        mq(
          'If every measurement in a dataset is DOUBLED (×2), what happens to the Mean?',
          'Σ(2xᵢ)/n = 2(Σxᵢ/n).',
          'The Mean doubles cleanly',
          ['Mean stays the same', 'Mean quadruples (×4)', 'Mean increases by +2'],
          `Scaling every number ×k scales both Mean and Median by ×k.`,
          rng
        ),
        mq(
          'In dataset [10, 12, 14, 16, 18], if 18 changes to 180, which statistic stays COMPLETELY UNCHANGED?',
          'Does the 3rd sorted item change?',
          'Median (still 14)',
          ['Mean (jumps from 14 to 46.4)', 'Sum', 'Range'],
          `Raising the maximum does not move the middle rank 14.`,
          rng
        ),
      ];
    }

    case 'p2-mod-5-4': {
      return [
        mq(
          'Marks frequency: 3 students scored 10, and 7 students scored 20. Why is the class average NOT (10 + 20)/2 = 15?',
          'More students scored 20 than 10 — weight by frequency!',
          'Weighted Mean = (3×10 + 7×20) / (3 + 7) = 170 / 10 = 17',
          ['Because 10 < 20', 'Average is always 20', 'Weighted Mean = 13'],
          `Multiplying each value by its frequency fᵢ reflects unequal group sizes accurately.`,
          rng
        ),
        mq(
          'To compute Weighted Mean from a frequency table (Values xᵢ, Counts fᵢ), you evaluate:',
          'Divide total value sum by total count.',
          'Σ(fᵢ × xᵢ) ÷ Σfᵢ',
          ['Σxᵢ ÷ number of rows', 'Σfᵢ ÷ Σxᵢ', 'max(xᵢ) − min(xᵢ)'],
          `Divide weighted total Σ(f·x) by total items Σf.`,
          rng
        ),
        mq(
          'In [Score 5: freq 4, Score 10: freq 6], find the Weighted Mean:',
          '(5×4 + 10×6) ÷ (4 + 6).',
          '8',
          ['7.5', '10', '5'],
          `(20 + 60) ÷ 10 = 80 ÷ 10 = 8.`,
          rng
        ),
      ];
    }

    case 'p2-mod-5-5': {
      return [
        mq(
          'In a spreadsheet, cells B2 through B6 contain daily rainfall. Which formula computes their Mean?',
          'Built-in spreadsheet function!',
          '=AVERAGE(B2:B6)',
          ['=MEAN(B2-B6)', '=SUM(B2*B6)', '=MEDIAN(B2:B6)'],
          `=AVERAGE(B2:B6) sums the range B2:B6 and divides by 5 cleanly.`,
          rng
        ),
        mq(
          'Which spreadsheet formula totals cells C1 through C10?',
          'Range colon notation from first to last cell.',
          '=SUM(C1:C10)',
          ['=ADD(C1..C10)', '=TOTAL(C1+C10)', '=COUNT(C1:C10)'],
          `=SUM(C1:C10) adds every cell in the block C1..C10.`,
          rng
        ),
        mq(
          'What happens in a spreadsheet chart & formula when you edit one raw number inside cell B4?',
          'Dynamic spreadsheet recalculation!',
          'All linked formulas (=SUM, =AVERAGE) and linked graphs update instantaneously',
          ['Old static answers stay locked until reboot', 'Cell B4 deletes the sheet', 'Only bold text updates'],
          `Spreadsheets dynamically recompute dependent outputs whenever source data changes.`,
          rng
        ),
      ];
    }

    case 'p2-mod-5-6': {
      return [
        mq(
          'When is a LINE GRAPH strictly better than a BAR GRAPH?',
          'Think of temperature changing hour-by-hour vs comparing favorite sports.',
          'Showing continuous trends over time (where slopes between points are meaningful)',
          ['Comparing unrelated fruit preferences', 'Showing 3 discrete school clubs', 'Listing random ID codes'],
          `Line graphs reveal rate-of-change and continuous trends over ordered time intervals.`,
          rng
        ),
        mq(
          'On a time-series line graph, what does a COMPLETELY HORIZONTAL flat segment between 2 PM and 4 PM indicate?',
          'Zero vertical change!',
          'Zero change — the quantity remained steady between 2 PM and 4 PM',
          ['Fastest growth rate', 'Missing data error', 'Return to zero'],
          `Zero slope means value neither rose nor fell over that interval.`,
          rng
        ),
        mq(
          'Why must categorical data (e.g. Mango, Apple, Kiwi votes) use separated BARS instead of a connecting Line Graph?',
          'Is there a "half-mango-half-apple" fruit between them?',
          'Categories have no continuous intermediate values along a line between bars',
          ['Bars hold more numbers', 'Lines cannot go up and down', 'Bars show time better'],
          `Connecting unrelated categories implies nonexistent intermediate trends.`,
          rng
        ),
      ];
    }

    case 'p2-mod-5-7': {
      return [
        mq(
          'A TV news bar chart compares Brand A (92%) vs Brand B (90%), making Brand A look 3× taller because the Y-axis starts at 88 instead of 0. Why is this misleading?',
          'Visual height ratio exaggerates a tiny 2% difference!',
          'Truncating the Y-axis baseline distorts bar height proportions visually',
          ['Bars should never be vertical', 'Percentages above 50% are invalid', 'Brand A should be horizontal'],
          `Bar charts encode magnitude via full height from 0; cropping the baseline creates false visual exaggeration.`,
          rng
        ),
        mq(
          'How can doubling a 2D icon’s width AND height to represent a 2× sales increase mislead readers?',
          '2 × width × 2 × height = 4 × AREA!',
          'Its visual 2D AREA balloons 4× even though data only doubled (2×)',
          ['Icons shrink by half', 'Colors turn invisible', 'Readers look at the title only'],
          `Scaling both dimensions ×2 enlarges visual area by 2² = 4×, overstating growth.`,
          rng
        ),
        mq(
          'Before trusting any newspaper infographic, what should you inspect FIRST?',
          'Check axes, baselines, sample size, and units!',
          'Y-axis starting at 0, consistent scale intervals, and clear unit labels',
          ['Just the brightest bar color', 'How fancy the font looks', 'Only the headline'],
          `Checking axis origin, uniform intervals, and units prevents visual data manipulation.`,
          rng
        ),
      ];
    }

    // =========================================================================
    // PART II — CHAPTER 6: ALGEBRA PLAY (p2-ch6-m1 .. p2-ch6-m7)
    // =========================================================================
    case 'p2-ch6-m1': {
      const a = ri(rng, 3, 7);
      const b = ri(rng, 2, 5) * a;
      return [
        mq(
          `"Think of a number x. Multiply by ${a}, add ${b}, divide by ${a}, subtract x." What do you ALWAYS get?`,
          `Simplify ((${a}x + ${b}) ÷ ${a}) − x algebraically!`,
          `Always ${b / a}`,
          [`Always ${b}`, `Always ${a}x`, `Always ${a}`],
          `(${a}x + ${b})/${a} − x = (x + ${b / a}) − x = ${b / a} cleanly!`,
          rng
        ),
        mq(
          '"Think of a number x. Double it, add 10, halve it, then add 3 − x." Simplified result:',
          '(2x + 10)/2 + 3 − x = (x + 5) + 3 − x.',
          'Always 8',
          ['Always 13', 'Always 2x + 8', 'Always 5'],
          `(x + 5) + 3 − x = 8 regardless of starting x!`,
          rng
        ),
        mq(
          'Why do "think-of-a-number" party tricks always end at a fixed constant?',
          'Track +x and −x!',
          'Inverse operations systematically cancel the unknown variable +x − x = 0',
          ['Every number reduces to 1', 'Audience picks 5 secretly', 'Division removes constants'],
          `Algebra reveals how doubling/halving and subtracting x strips x away, leaving a preset constant.`,
          rng
        ),
        mq(
          '"Think of a number n. Add 6, multiply by 3, subtract 18, then divide by 3." What returns?',
          'Simplify (3(n + 6) − 18) ÷ 3.',
          'Always your original number n',
          ['Always 6', 'Always 3n', 'Always n + 6'],
          `3(n + 6) − 18 = 3n + 18 − 18 = 3n; dividing by 3 restores n!`,
          rng
        ),
        mq(
          'Design a trick whose guaranteed output is ALWAYS 9 starting from x: "Double x, add ___, divide by 2, subtract x."',
          '(2x + C)/2 − x = C/2 = 9.',
          'Add 18',
          ['Add 9', 'Add 4.5', 'Add 27'],
          `(2x + 18)/2 − x = (x + 9) − x = 9 cleanly!`,
          rng
        ),
      ];
    }

    case 'p2-ch6-m2': {
      const m = ri(rng, 3, 11);
      const d = ri(rng, 10, 26);
      const finalOut = 100 * m + d + 165;
      return [
        mq(
          `In Shubham’s Birthday Trick, steps yield (100M + D + 165). If final answer is ${finalOut}, decode Month M and Day D:`,
          `Subtract 165 from ${finalOut}: first digits = Month, last 2 digits = Day!`,
          `Month ${m}, Day ${d}`,
          [`Month ${m + 1}, Day ${d}`, `Month ${m}, Day ${d + 5}`, `Month ${m - 1}, Day ${d}`],
          `${finalOut} − 165 = ${100 * m + d} ⇒ Month = ${m}, Day = ${d}.`,
          rng
        ),
        mq(
          'Why does multiplying Month M by 5, adding 6, multiplying by 4, adding 9, multiplying by 5, and adding D equal 100M + D + 165?',
          'Expand 5(4(5M + 6) + 9) + D!',
          'Because 5 × 4 × 5 = 100 (shifting M into the hundreds) and constants expand to 165',
          ['Because months always have 30 days', 'It subtracts your birth year', 'M becomes ones place'],
          `4(5M + 6) + 9 = 20M + 33; multiplying by 5 gives 5(20M + 33) + D = 100M + 165 + D!`,
          rng
        ),
        mq(
          `Subtract 165 from 985 to decode a birthday using Shubham’s trick:`,
          '985 − 165 = 820.',
          'Month 8 (August), Day 20',
          ['Month 9, Day 85', 'Month 8, Day 02', 'Month 11, Day 50'],
          `820 splits into hundreds 8 (Month 8) and last 2 digits 20 (Day 20).`,
          rng
        ),
        mq(
          'Why can Day D (1 to 31) NEVER overflow into the Month M hundreds column in (100M + D)?',
          'Compare maximum day D = 31 against 100!',
          'Because 1 ≤ D ≤ 31 always stays below 100 (within tens & ones digits)',
          ['Because Month M ≤ 12', 'Because 165 is odd', 'Because leap years subtract 1'],
          `Since D < 100, M occupies hundreds/thousands cleanly while D stays in the last two digits.`,
          rng
        ),
        mq(
          'For March 7 (M = 3, D = 7), what number does Shubham’s trick 100M + D + 165 output?',
          'Compute 100(3) + 7 + 165.',
          '472',
          ['307', '535', '465'],
          `300 + 7 + 165 = 472 (subtracting 165 later gives 307 → Month 3, Day 07).`,
          rng
        ),
      ];
    }

    case 'p2-ch6-m3': {
      return [
        mq(
          'In a 3-brick base pyramid [a, b, c] where each brick above equals the SUM of two bricks below, what algebraic expression sits at the TOP capstone?',
          'Middle row is (a + b) and (b + c); add them together!',
          'a + 2b + c',
          ['a + b + c', '2a + b + 2c', 'a + 3b + c'],
          `(a + b) + (b + c) = a + 2b + c — notice middle brick b has weight ×2!`,
          rng
        ),
        mq(
          'In a 4-brick base pyramid [a, b, c, d], what binomial weights appear at the 4th-row apex?',
          'Pascal/Virahāṅka row [1, 3, 3, 1]!',
          'a + 3b + 3c + d',
          ['a + 2b + 2c + d', 'a + 4b + 4c + d', 'a + b + c + d'],
          `Sums double down internal weights cleanly in Virahāṅka–Pascal coefficients 1, 3, 3, 1.`,
          rng
        ),
        mq(
          'If base bricks of a 3-tier pyramid are [4, x, 7] and apex cap is 23, find middle brick x:',
          '4 + 2x + 7 = 23.',
          'x = 6',
          ['x = 12', 'x = 5', 'x = 8'],
          `11 + 2x = 23 ⇒ 2x = 12 ⇒ x = 6.`,
          rng
        ),
        mq(
          'To MAXIMIZE the apex of a 4-brick pyramid using base tiles {2, 5, 9, 12}, which two tiles go in the INNER slots (b, c)?',
          'Apex = a + 3b + 3c + d, so middle positions count 3×!',
          '9 and 12 in the middle slots',
          ['2 and 5 in the middle slots', '2 and 12 in the middle slots', 'Order does not change the apex'],
          `3(12 + 9) + (2 + 5) = 63 + 7 = 70 is maximum because inner tiles carry weight ×3.`,
          rng
        ),
        mq(
          'What is the apex of a 4-row addition pyramid with base [3, 4, 2, 1]?',
          'Compute a + 3b + 3c + d.',
          '22',
          ['10', '20', '26'],
          `3 + 3(4) + 3(2) + 1 = 3 + 12 + 6 + 1 = 22.`,
          rng
        ),
      ];
    }

    case 'p2-ch6-m4': {
      const x = ri(rng, 4, 9);
      return [
        mq(
          `A reverse pyramid has apex 34, middle-left (2x + 4), and middle-right (x + 9). Solve for x:`,
          '(2x + 4) + (x + 9) = 34 ⇒ 3x + 13 = 34.',
          'x = 7',
          ['x = 5', 'x = 11', 'x = 8'],
          `3x = 21 ⇒ x = 7.`,
          rng
        ),
        mq(
          `In a 3-brick pyramid base [x, 5, ${x}], find the top apex when left brick x = ${x}:`,
          `Middle row = (${x}+5) and (5+${x}).`,
          `${2 * x + 10}`,
          [`${x + 10}`, `${x + 5}`, `${3 * x + 5}`],
          `${x} + 2(5) + ${x} = ${2 * x + 10}.`,
          rng
        ),
        mq(
          'To work BACKWARD down a number pyramid when Apex and ONE child brick are known, you:',
          'Apex = Left + Right.',
          'Subtract the known lower brick from the upper brick above it',
          ['Multiply upper by lower', 'Divide by 2', 'Add upper + lower'],
          `Right = Upper − Left reverses upward addition brick-by-brick.`,
          rng
        ),
        mq(
          'In a 4-row pyramid, Apex T = 32 and base is [1, b, 5, 4]. Solve for missing inner brick b:',
          'Apply T = a + 3b + 3c + d: 32 = 1 + 3b + 3(5) + 4 = 20 + 3b.',
          'b = 4',
          ['b = 3', 'b = 5', 'b = 6'],
          `1 + 3b + 15 + 4 = 32 ⇒ 3b = 12 ⇒ b = 4.`,
          rng
        ),
      ];
    }

    case 'p2-ch6-m5': {
      return [
        mq(
          'Karim meets a Genie at 3 shrines: each shrine DOUBLES Karim’s money, then charges ₹100 fee. After Shrine 3 he has ₹0 left. How much did he start with?',
          'Work BACKWARD from ₹0: add ₹100 then ÷2 three times!',
          '₹87.50',
          ['₹100', '₹150', '₹75'],
          `Before S3: (0+100)/2 = 50; before S2: (50+100)/2 = 75; before S1: (75+100)/2 = ₹87.50.`,
          rng
        ),
        mq(
          'Write the algebraic expression if Karim starts with x, enters 1 shrine (doubles then subtracts fee F), then repeats at Shrine 2:',
          'Shrine 1 = (2x − F); Shrine 2 = 2(2x − F) − F.',
          '4x − 3F',
          ['2x − 2F', '4x − 2F', '4x − F'],
          `2(2x − F) − F = 4x − 2F − F = 4x − 3F.`,
          rng
        ),
        mq(
          'After 3 shrines with fee ₹80 each ending at ₹0 (8x − 7×80 = 0), how much did Karim bring?',
          '8x = 560.',
          '₹70',
          ['₹80', '₹100', '₹60'],
          `x = 560 ÷ 8 = ₹70.`,
          rng
        ),
        mq(
          'If Karim visits 2 shrines (doubles, then ₹40 fee each) and ends with ₹20, how much did he bring?',
          'Work backwards: (20 + 40)/2 = 30; (30 + 40)/2 = 35.',
          '₹35',
          ['₹50', '₹40', '₹25'],
          `4(35) − 3(40) = 140 − 120 = ₹20 cleanly.`,
          rng
        ),
        mq(
          'For n shrines with fee F ending at ₹0, the formula 2ⁿx − (2ⁿ − 1)F = 0 shows why starting money x is a whole integer whenever:',
          'x = ((2ⁿ − 1) / 2ⁿ) × F.',
          'F is an exact multiple of 2ⁿ (e.g., 8 for 3 shrines)',
          ['F is prime', 'F is an odd number', 'F equals 0 only'],
          `Since (2ⁿ − 1) is always odd, F itself must carry the factor 2ⁿ for x to stay a whole integer.`,
          rng
        ),
      ];
    }

    case 'p2-ch6-m6': {
      const c = ri(rng, 10, 22);
      return [
        mq(
          `Draw any 3×3 square window on a monthly calendar centered on date c = ${c}. What is the SUM of all 9 dates inside?`,
          'Vertical neighbors are c−7 & c+7; horizontal c−1 & c+1; diagonals cancel identically around c!',
          `${9 * c} (always 9 × center date)`,
          [`${8 * c}`, `${9 * c + 7}`, `${3 * c}`],
          `Every symmetric opposite pair around ${c} averages cleanly to ${c}, so 9 dates sum to 9 × ${c} = ${9 * c}.`,
          rng
        ),
        mq(
          `On a standard calendar grid, if the top-left of a 2×2 box is date d, express the sum of the 4 dates in the 2×2 box:`,
          'Dates are d, d+1, d+7, and d+8.',
          '4d + 16',
          ['4d + 4', '4d + 14', '2d + 16'],
          `d + (d + 1) + (d + 7) + (d + 8) = 4d + 16.`,
          rng
        ),
        mq(
          'In a 5-cell "+" cross on a calendar centered at c, what does Top + Bottom + Left + Right + Center equal?',
          '(c − 7) + (c + 7) + (c − 1) + (c + 1) + c.',
          '5c',
          ['5c + 7', '4c + 8', '5c − 1'],
          `All ±7 and ±1 offsets cancel cleanly, leaving 5c.`,
          rng
        ),
        mq(
          'A 3×3 calendar window sum is 144. Find the TOP-LEFT corner date of that 3×3 block:',
          'First find center c = 144 ÷ 9, then subtract 8 (1 row up −7, 1 col left −1).',
          '8 (since center c = 16, and 16 − 8 = 8)',
          ['16', '9', '7'],
          `144 ÷ 9 = 16 (center); top-left cell is c − 7 − 1 = 16 − 8 = 8.`,
          rng
        ),
        mq(
          'Why is the vertical offset between directly stacked dates on a calendar always ±7?',
          'Count the columns in one full calendar week!',
          'Because every calendar row represents 7 consecutive days (Sun–Sat / Mon–Sun)',
          ['Because months have 7 weeks', 'Because diagonals jump by 7', 'It only works in February'],
          `Stepping directly down one row moves forward exactly 1 week = +7 days.`,
          rng
        ),
      ];
    }

    case 'p2-ch6-m7': {
      const x = ri(rng, 4, 9);
      return [
        mq(
          `Solve the two-pan balance equation: 3x + 5 = ${3 * x + 5}:`,
          'Subtract 5 from both pans, then divide both by 3.',
          `x = ${x}`,
          [`x = ${x + 2}`, `x = ${x - 1}`, `x = ${3 * x}`],
          `3x = ${3 * x} ⇒ x = ${x}.`,
          rng
        ),
        mq(
          'Why must any operation performed on the Left-Hand Side (LHS) of an equation ALSO be performed identically on the RHS?',
          'Think of a physical two-pan balance scale!',
          'Equal adjustments preserve equality so both sides stay balanced',
          ['To turn x negative', 'Only subtraction requires both sides', 'To eliminate constants only'],
          `Doing the identical inverse operation to both sides preserves balance while isolating x.`,
          rng
        ),
        mq(
          `Solve: 4(x − 2) = 24:`,
          'Divide both sides by 4 first, then add 2.',
          'x = 8',
          ['x = 6', 'x = 10', 'x = 4'],
          `x − 2 = 6 ⇒ x = 8.`,
          rng
        ),
        mq(
          'Solve for x with variables on both pans: 6x + 4 = 2x + 28:',
          'Subtract 2x from both sides, then subtract 4.',
          'x = 6',
          ['x = 4', 'x = 8', 'x = 12'],
          `4x = 24 ⇒ x = 6 (Check: 6(6)+4 = 40 and 2(6)+28 = 40).`,
          rng
        ),
        mq(
          'To check whether x = 5 truly solves 3x + 9 = 2x + 14, you:',
          'Evaluate LHS and RHS separately at x = 5.',
          'Substitute x = 5 into both sides (LHS = 24 = RHS ✓)',
          ['Divide both sides by 5', 'Multiply 3x by 2x', 'Assume LHS > RHS'],
          `LHS = 3(5) + 9 = 24 and RHS = 2(5) + 14 = 24 — verified equal!`,
          rng
        ),
      ];
    }

    // =========================================================================
    // PART II — CHAPTER 7: AREA (p2-mod-7-1 .. p2-mod-7-7)
    // =========================================================================
    case 'p2-mod-7-1': {
      const b = ri(rng, 8, 16);
      const h = ri(rng, 5, 9);
      return [
        mq(
          `A triangle is enclosed tightly inside a rectangle of base ${b} cm and height ${h} cm. What is the triangle’s area?`,
          'Enclosing rectangle proof splits into 2 halves along the altitude.',
          `${(b * h) / 2} cm²`,
          [`${b * h} cm²`, `${2 * (b + h)} cm²`, `${b + h} cm²`],
          `Area = ½ × base × height = ½ × ${b} × ${h} = ${(b * h) / 2} cm².`,
          rng
        ),
        mq(
          'Can two rectangles with the EXACT SAME Perimeter (24 cm) have different Areas?',
          'Compare 6×6 square vs 10×2 rectangle!',
          'Yes — 6×6 has Area 36 cm² whereas 10×2 has Area 20 cm²',
          ['No — equal perimeter always guarantees equal area', 'Only circles vary', 'Squares always have smallest area'],
          `Area measures interior 2D space whereas Perimeter measures only outer boundary length.`,
          rng
        ),
        mq(
          'Every right triangle with legs a and b is visually half of what enclosing rectangle?',
          'Split rectangle along its diagonal!',
          'An a × b rectangle (giving Area = ½ ab)',
          ['A square of side a + b', 'Two equal trapeziums', 'A circle of radius a'],
          `The diagonal slices an a × b rectangle cleanly into two congruent halves.`,
          rng
        ),
      ];
    }

    case 'p2-mod-7-2': {
      const area = ri(rng, 12, 24) * 2;
      return [
        mq(
          `A median connects vertex A to the midpoint M of opposite side BC. If ΔABC has area ${area} cm², find Area(ΔABM):`,
          'Equal bases BM = MC and identical altitude from A!',
          `${area / 2} cm² (exact half!)`,
          [`${area} cm²`, `${area / 4} cm²`, `${area - 4} cm²`],
          `Because BM = MC and both sub-triangles share height from A, a median ALWAYS splits triangle area cleanly in half.`,
          rng
        ),
        mq(
          'Where does the perpendicular altitude (height) fall in an OBTUSE-angled triangle when standing on a short side adjacent to the obtuse angle?',
          'Drop perpendicular from apex down to the extended base line!',
          'OUTSIDE the triangle onto the extended base line',
          ['Strictly inside near the center', 'It does not exist', 'Equal to perimeter ÷ 2'],
          `Despite falling outside the triangle, Area = ½ × true base × external perpendicular altitude still holds!`,
          rng
        ),
        mq(
          'An obtuse triangle has base 10 cm and external perpendicular altitude 7 cm. What is its area?',
          'Do NOT add the extra outside extension to base length!',
          '35 cm² (½ × 10 × 7)',
          ['70 cm²', '17 cm²', '45 cm²'],
          `Use ONLY the actual side length (10 cm) times perpendicular height (7 cm) ÷ 2 = 35 cm².`,
          rng
        ),
      ];
    }

    case 'p2-mod-7-3': {
      return [
        mq(
          'Three triangles ΔABC, ΔDBC, and ΔEBC share the same base BC = 8 cm, and vertices A, D, E all lie on a line PARALLEL to BC. Which has the largest area?',
          'Parallel tracks stay constant perpendicular distance h apart!',
          'All three have the EXACT SAME area (½ × BC × h)',
          ['The widest slanted one ΔEBC', 'The symmetric one ΔABC', 'Depends on side slant lengths'],
          `Vertices sliding along a line parallel to the base keep base AND perpendicular height constant ⇒ identical area.`,
          rng
        ),
        mq(
          'In Gopal’s river reflection problem, why does reflecting point B across the straight river bank find the shortest A → River → B walk?',
          'Any path A → P → B equals straight segments A → P → B′!',
          'Reflecting B to B′ turns two angled hops into a single shortest straight line AB′',
          ['Water speeds up walking', 'Parallel lines curve upward', 'All river points give equal length'],
          `Triangle inequality confirms straight path AB′ is strictly shorter than any bent path AP + PB′.`,
          rng
        ),
        mq(
          'Shearing a stack of cards sideways leaves volume/area unchanged while perimeter tilts. This illustrates:',
          'Keep base & perpendicular height invariant!',
          'Equal-base triangles between parallels conserve area even as side slopes stretch',
          ['Perimeter never changes either', 'Height becomes slant edge', 'Area shrinks by half'],
          `Only perpendicular altitude determines area between parallel boundaries.`,
          rng
        ),
      ];
    }

    case 'p2-mod-7-4': {
      const b = ri(rng, 7, 14);
      const h = ri(rng, 4, 8);
      return [
        mq(
          `A parallelogram has base ${b} cm, slant side ${h + 3} cm, and perpendicular height ${h} cm. Compute its Area:`,
          'Cut-and-slide proof turns it into a b × h rectangle — ignore slant side!',
          `${b * h} cm²`,
          [`${b * (h + 3)} cm²`, `${(b * h) / 2} cm²`, `${2 * (b + h + 3)} cm²`],
          `Sliding the end right-triangle across forms a ${b} × ${h} rectangle of area ${b * h} cm².`,
          rng
        ),
        mq(
          'Which mistake commonly costs marks on parallelogram area questions?',
          'Compare perpendicular h vs slanted side s.',
          'Multiplying Base × Slant Edge instead of Base × Perpendicular Height',
          ['Forgetting to divide by 4', 'Measuring angles in radians', 'Adding base + height'],
          `Rectangles align perpendicularly; tilted parallelograms must use perpendicular altitude h, not slant edge.`,
          rng
        ),
        mq(
          `A parallelogram has area 72 cm² and base 12 cm. Find its perpendicular height:`,
          '72 ÷ 12.',
          '6 cm',
          ['3 cm', '12 cm', '60 cm'],
          `Height = Area ÷ Base = 72 ÷ 12 = 6 cm.`,
          rng
        ),
      ];
    }

    case 'p2-mod-7-5': {
      const d1 = ri(rng, 4, 9) * 2;
      const d2 = ri(rng, 3, 7) * 2;
      return [
        mq(
          `A kite/rhombus has perpendicular diagonals d₁ = ${d1} cm and d₂ = ${d2} cm. Calculate its Area:`,
          'Inscribe inside a d₁ × d₂ rectangle — the diamond fills exact HALF!',
          `${(d1 * d2) / 2} cm²`,
          [`${d1 * d2} cm²`, `${2 * (d1 + d2)} cm²`, `${d1 + d2} cm²`],
          `Area = ½ × d₁ × d₂ = ½ × ${d1} × ${d2} = ${(d1 * d2) / 2} cm².`,
          rng
        ),
        mq(
          'Why does Area = ½ × d₁ × d₂ work for BOTH rhombuses AND kites?',
          'Look at how the 4 sub-triangles sit inside the enclosing d₁ × d₂ rectangle.',
          'Both have perpendicular diagonals that each fill half of 4 corner rectangles',
          ['Both have 4 equal sides', 'Only rhombuses have 90° corners', 'Kites are squares'],
          `Perpendicular diagonals divide the enclosing rectangle into 4 boxes, each half-shaded inside the kite/rhombus.`,
          rng
        ),
        mq(
          'A rhombus has Area 48 cm² and one diagonal 12 cm. Find the other diagonal:',
          '48 = ½ × 12 × d₂ ⇒ 6 × d₂ = 48.',
          '8 cm',
          ['4 cm', '16 cm', '24 cm'],
          `d₂ = (2 × 48) ÷ 12 = 96 ÷ 12 = 8 cm.`,
          rng
        ),
      ];
    }

    case 'p2-mod-7-6': {
      const a = ri(rng, 5, 9);
      const b = ri(rng, 10, 15);
      const h = ri(rng, 4, 8);
      return [
        mq(
          `Find the area of a trapezium with parallel sides a = ${a} cm, b = ${b} cm, and height h = ${h} cm:`,
          'Rotate a twin upside-down copy beside it → parallelogram base (a+b)!',
          `${((a + b) * h) / 2} cm²`,
          [`${(a + b) * h} cm²`, `${a * b * h} cm²`, `${((a + b) + h) * 2} cm²`],
          `Area = ½ × (${a} + ${b}) × ${h} = ½ × ${a + b} × ${h} = ${((a + b) * h) / 2} cm².`,
          rng
        ),
        mq(
          'What shape is formed when two identical trapeziums (bases a and b, height h) are placed side-by-side with one inverted 180°?',
          'Bottom edge becomes a + b and top edge becomes b + a!',
          'A parallelogram of base (a + b) and height h — making 1 trapezium ½ h(a + b)',
          ['A cube', 'An equilateral triangle', 'A rhombus of side a − b'],
          `Combining a copy inverted 180° creates a full (a+b) × h parallelogram, proving each trapezium is half of it.`,
          rng
        ),
        mq(
          'A trapezium has parallel bases 8 m and 12 m and Area 60 m². Find height h:',
          '½(8 + 12) × h = 60 ⇒ 10h = 60.',
          '6 m',
          ['3 m', '12 m', '5 m'],
          `Average base = (8+12)/2 = 10 m ⇒ h = 60 ÷ 10 = 6 m.`,
          rng
        ),
      ];
    }

    case 'p2-mod-7-7': {
      return [
        mq(
          'How many square centimeters (cm²) equal 1 square meter (1 m²)?',
          '1 m = 100 cm, so 1 m × 1 m = 100 cm × 100 cm!',
          '10,000 cm²',
          ['100 cm²', '1,000 cm²', '100,000 cm²'],
          `Area scales with the SQUARE of length unit: 100² = 10,000 cm².`,
          rng
        ),
        mq(
          'How many square meters (m²) are in 1 Hectare (100 m × 100 m plot)?',
          '100 × 100 m².',
          '10,000 m²',
          ['1,000 m²', '100 m²', '1,000,000 m²'],
          `1 Hectare = 100 m × 100 m = 10,000 m².`,
          rng
        ),
        mq(
          'To measure an irregular pentagonal field, how do land surveyors compute total area accurately?',
          'Draw main diagonal & drop perpendicular offsets!',
          'Partition into clean triangles and trapeziums using perpendicular offsets from a baseline diagonal',
          ['Multiply perimeter × 2', 'Average the 5 edge lengths squared', 'Only circles can enclose polygons'],
          `Triangulation + surveyor offsets partition any straight-edged polygon into easy triangles and trapeziums.`,
          rng
        ),
      ];
    }

    default:
      return [];
  }
}

const CHAPTER_MODULE_IDS_MAP: Record<string, string[]> = {
  'ch1-square-cube': ['mod-1-1', 'mod-1-2', 'mod-1-3', 'mod-1-4', 'mod-1-5', 'mod-1-6', 'mod-1-7'],
  'ch2-power-play': ['mod-2-1', 'mod-2-2', 'mod-2-3', 'mod-2-4', 'mod-2-5', 'mod-2-6', 'mod-2-7'],
  'ch3-story-numbers': ['mod-3-1', 'mod-3-2', 'mod-3-3', 'mod-3-4', 'mod-3-5', 'mod-3-6', 'mod-3-7'],
  'ch4-quadrilaterals': ['mod-4-1', 'mod-4-2', 'mod-4-3', 'mod-4-4', 'mod-4-5', 'mod-4-6', 'mod-4-7'],
  'ch5-number-play': ['mod-5-1', 'mod-5-2', 'mod-5-3', 'mod-5-4', 'mod-5-5', 'mod-5-6', 'mod-5-7'],
  'ch6-we-distribute': ['mod-6-1', 'mod-6-2', 'mod-6-3', 'mod-6-4', 'mod-6-5', 'mod-6-6', 'mod-6-7'],
  'ch7-proportional-1': ['mod-7-1', 'mod-7-2', 'mod-7-3', 'mod-7-4', 'mod-7-5', 'mod-7-6', 'mod-7-7'],
  'ch4-fractions-disguise': ['p2-mod-1-1', 'p2-mod-1-2', 'p2-mod-1-3', 'p2-mod-1-4', 'p2-mod-1-5', 'p2-mod-1-6', 'p2-mod-1-7'],
  'ch5-baudhayana-pythagoras': ['p2-mod-2-1', 'p2-mod-2-2', 'p2-mod-2-3', 'p2-mod-2-4', 'p2-mod-2-5', 'p2-mod-2-6', 'p2-mod-2-7'],
  'ch6-proportional-reasoning': ['p2-mod-3-1', 'p2-mod-3-2', 'p2-mod-3-3', 'p2-mod-3-4', 'p2-mod-3-5', 'p2-mod-3-6', 'p2-mod-3-7'],
  'ch11-geometric-themes': ['p2-mod-4-1', 'p2-mod-4-2', 'p2-mod-4-3', 'p2-mod-4-4', 'p2-mod-4-5', 'p2-mod-4-6', 'p2-mod-4-7'],
  'ch12-dots-and-lines': ['p2-mod-5-1', 'p2-mod-5-2', 'p2-mod-5-3', 'p2-mod-5-4', 'p2-mod-5-5', 'p2-mod-5-6', 'p2-mod-5-7'],
  'ch13-algebra-play': ['p2-ch6-m1', 'p2-ch6-m2', 'p2-ch6-m3', 'p2-ch6-m4', 'p2-ch6-m5', 'p2-ch6-m6', 'p2-ch6-m7'],
  'ch14-area': ['p2-mod-7-1', 'p2-mod-7-2', 'p2-mod-7-3', 'p2-mod-7-4', 'p2-mod-7-5', 'p2-mod-7-6', 'p2-mod-7-7'],
};

/**
 * Resolves the parent chapterId for any moduleId across all 14 chapters.
 */
export function getChapterIdForModuleId(moduleId: string): string | undefined {
  for (const [chId, ids] of Object.entries(CHAPTER_MODULE_IDS_MAP)) {
    if (ids.includes(moduleId)) return chId;
  }
  const m1 = moduleId.match(/^mod-(\d+)-8$/);
  if (m1) {
    const idx = Number(m1[1]) - 1;
    const keys = Object.keys(CHAPTER_MODULE_IDS_MAP);
    return keys[idx];
  }
  const m2 = moduleId.match(/^p2-mod-(\d+)-8$/);
  if (m2) {
    const idx = 7 + Number(m2[1]) - 1;
    const keys = Object.keys(CHAPTER_MODULE_IDS_MAP);
    return keys[idx];
  }
  if (moduleId === 'p2-ch6-m8') return 'ch13-algebra-play';
  return undefined;
}

/**
 * Generates chapter-scoped synthesis questions strictly drawn from Modules 1-7
 * of the given chapterId for Module 8 Capstone 10-marker assessments.
 */
export function getChapterCapstoneRecapQuestions(
  chapterId: string,
  randomSeed: number = 0,
  difficulty: QuizDifficultyLevel = 2
): ModuleGameChallenge[] {
  const modIds = CHAPTER_MODULE_IDS_MAP[chapterId];
  if (!modIds) return [];
  const collected: ModuleGameChallenge[] = [];
  modIds.forEach((id, idx) => {
    const qs = generateModuleSpecificQuestions(id, randomSeed + idx * 17, difficulty);
    collected.push(...qs);
  });
  return collected;
}

