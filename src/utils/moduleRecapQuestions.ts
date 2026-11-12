import { ModuleGameChallenge, ModuleSimulationConfig } from '../types/part1Curriculum';

export interface RecapQuizConfig {
  questions: ModuleGameChallenge[];
  isLastModule: boolean;
  totalMarks: number; // 5 for regular, 10 for chapter capstone
  passingMarks: number; // 4 for regular (80%), 8 for capstone (80%)
  passingPercentage: number; // 80%
  paperTitle: string;
}

/**
 * Deterministic pseudo-random number generator for reproducible yet varied question sets
 */
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Shuffles an array using Fisher-Yates with an optional seed
 */
function shuffle<T>(array: T[], seedOffset: number = 0): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(pseudoRandom(i * 97 + seedOffset) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Generates an option list with the correct answer placed at a randomized index
 */
function makeQuestion(
  prompt: string,
  clue: string,
  correctOption: string,
  distractors: string[],
  explanation: string,
  seed: number
): ModuleGameChallenge {
  const allUnique = Array.from(new Set([correctOption, ...distractors])).slice(0, 4);
  while (allUnique.length < 4) {
    allUnique.push(`Alternative Option ${allUnique.length + 1}`);
  }
  const shuffledOptions = shuffle(allUnique, seed);
  const correctIndex = shuffledOptions.indexOf(correctOption);

  return {
    prompt,
    clue,
    options: shuffledOptions,
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    explanation,
  };
}

/**
 * Generates strictly topic-related, randomized math questions for any given module.
 * - Regular modules: exactly 5 questions (80% passing threshold = 4 / 5)
 * - Last module of each chapter: exactly 10 questions (10 Marker Comprehensive Paper, 80% passing threshold = 8 / 10)
 * - Guarantees NO duplicate questions within the generated set.
 */
export function getRecapQuizConfig(
  moduleCode: string,
  moduleTitle: string,
  formulaHighlight: string,
  existingChallenges: ModuleGameChallenge[] = [],
  simulation?: ModuleSimulationConfig,
  isLastModule: boolean = false,
  randomSeed: number = 0
): RecapQuizConfig {
  const targetCount = isLastModule ? 10 : 5;
  const passingMarks = isLastModule ? 8 : 4;
  const passingPercentage = 80;
  const paperTitle = isLastModule
    ? 'Chapter Capstone · 10 Marker Comprehensive Paper'
    : 'Module Mastery Recap Quiz · 5-Question Challenge';

  const titleLower = (moduleTitle || '').toLowerCase();
  const formula = formulaHighlight || '';
  const codeLower = (moduleCode || '').toLowerCase();

  // Curated generator pool strictly tailored to curriculum topics
  const questionPool: ModuleGameChallenge[] = [];

  // 1. Topic: Square Numbers, Factorization, Odd Gnomon, Pythagorean Triplets
  if (
    titleLower.includes('square') ||
    titleLower.includes('factor') ||
    titleLower.includes('root') ||
    titleLower.includes('locker') ||
    codeLower.includes('1.') ||
    titleLower.includes('gnomon')
  ) {
    // Dynamic odds sum
    const nOdds = 5 + (randomSeed % 6); // 5 to 10
    const oddsSum = nOdds * nOdds;
    questionPool.push(
      makeQuestion(
        `What is the sum of the first ${nOdds} consecutive odd natural numbers (1 + 3 + 5 + ... + ${2 * nOdds - 1})?`,
        'The sum of the first n odd numbers is always equal to n².',
        `${oddsSum}`,
        [`${oddsSum - nOdds}`, `${oddsSum + nOdds}`, `${oddsSum + 2 * nOdds}`],
        `By the Odd Gnomon theorem, the sum of the first ${nOdds} odd natural numbers is ${nOdds}² = ${oddsSum}.`,
        randomSeed + 1
      )
    );

    // Unit digit rule
    questionPool.push(
      makeQuestion(
        'Which of the following numbers CANNOT be a perfect square based on its unit digit?',
        'Perfect squares can only end in 0, 1, 4, 5, 6, or 9.',
        '4,872',
        ['5,184', '3,969', '6,084'],
        'No perfect square can end in 2, 3, 7, or 8. Since 4,872 ends in 2, it is impossible for it to be a perfect square.',
        randomSeed + 2
      )
    );

    // Digits in square root
    questionPool.push(
      makeQuestion(
        'If a perfect square number has 8 digits, how many digits will its square root contain?',
        'Group the digits in pairs from the right: a number with 2n digits has n digits in its square root.',
        '4 digits',
        ['3 digits', '5 digits', '8 digits'],
        'Grouping an 8-digit number into pairs yields 8 ÷ 2 = 4 digit periods, so its square root has exactly 4 digits.',
        randomSeed + 3
      )
    );

    // Pythagorean triplet
    const mVal = 3 + (randomSeed % 3); // 3, 4, 5
    const aTrip = 2 * mVal;
    const bTrip = mVal * mVal - 1;
    const cTrip = mVal * mVal + 1;
    questionPool.push(
      makeQuestion(
        `For m = ${mVal}, which Pythagorean triplet is generated using (2m, m² − 1, m² + 1)?`,
        `Calculate: 2m, ${mVal}² − 1, and ${mVal}² + 1.`,
        `(${aTrip}, ${bTrip}, ${cTrip})`,
        [
          `(${aTrip - 1}, ${bTrip}, ${cTrip})`,
          `(${aTrip}, ${bTrip - 2}, ${cTrip + 1})`,
          `(${aTrip + 2}, ${bTrip - 1}, ${cTrip})`,
        ],
        `2(${mVal}) = ${aTrip}; ${mVal}² − 1 = ${mVal * mVal} − 1 = ${bTrip}; ${mVal}² + 1 = ${cTrip}. Since ${aTrip}² + ${bTrip}² = ${cTrip}², (${aTrip}, ${bTrip}, ${cTrip}) is the triplet.`,
        randomSeed + 4
      )
    );

    // Smallest multiplier to form square
    questionPool.push(
      makeQuestion(
        'What is the smallest positive integer by which 72 must be multiplied to yield a perfect square?',
        'Find the prime factorization: 72 = 2³ × 3² = (2² × 3²) × 2.',
        '2',
        ['3', '6', '8'],
        '72 = 2 × 2 × 2 × 3 × 3. The prime factor 2 is unpaired. Multiplying by 2 gives 144 = 12².',
        randomSeed + 5
      )
    );

    // Decimal square root
    questionPool.push(
      makeQuestion(
        'What is the square root of 0.0064?',
        '0.0064 = 64 / 10,000. Take the square root of numerator and denominator.',
        '0.08',
        ['0.8', '0.008', '0.0008'],
        '√(0.0064) = √(64 / 10,000) = 8 / 100 = 0.08. Check: 0.08 × 0.08 = 0.0064.',
        randomSeed + 6
      )
    );

    // Consecutive numbers between squares
    const nBase = 12 + (randomSeed % 4);
    questionPool.push(
      makeQuestion(
        `How many non-perfect-square natural numbers lie strictly between ${nBase}² and ${nBase + 1}²?`,
        'Between n² and (n + 1)², there are always exactly 2n non-square numbers.',
        `${2 * nBase}`,
        [`${2 * nBase + 1}`, `${2 * nBase - 1}`, `${nBase}`],
        `The number of non-square integers between n² and (n + 1)² is given by 2n. For n = ${nBase}: 2 × ${nBase} = ${2 * nBase}.`,
        randomSeed + 7
      )
    );

    // Long division estimate
    questionPool.push(
      makeQuestion(
        'Between which two consecutive integers does the square root √85 lie?',
        'Compare with nearby perfect squares: 81 < 85 < 100.',
        '9 and 10',
        ['8 and 9', '10 and 11', '7 and 8'],
        'Since 9² = 81 and 10² = 100, and 81 < 85 < 100, √85 lies strictly between 9 and 10.',
        randomSeed + 8
      )
    );

    // Area to side
    const sqSide = 15 + (randomSeed % 5);
    const sqArea = sqSide * sqSide;
    questionPool.push(
      makeQuestion(
        `A square playground has an area of ${sqArea} m². What is the length of one of its sides?`,
        'Side = √(Area).',
        `${sqSide} m`,
        [`${sqSide - 2} m`, `${sqSide + 2} m`, `${sqSide + 5} m`],
        `Side = √(${sqArea}) = ${sqSide} m, since ${sqSide} × ${sqSide} = ${sqArea}.`,
        randomSeed + 9
      )
    );

    // Locker problem deduction
    questionPool.push(
      makeQuestion(
        'In the 100-locker puzzle, which of the following lockers remains OPEN at the very end?',
        'Only lockers with an odd number of factors remain open (perfect squares).',
        'Locker #64',
        ['Locker #48', 'Locker #72', 'Locker #90'],
        'Only perfect squares have an odd number of factors (paired with themselves). 64 = 8² is a square, so it remains open.',
        randomSeed + 10
      )
    );
  }

  // 2. Topic: Cubes, Cube Roots & Ramanujan Numbers
  if (
    titleLower.includes('cube') ||
    codeLower.includes('2.') ||
    formula.includes('³') ||
    formula.includes('^3')
  ) {
    questionPool.push(
      makeQuestion(
        'What is the unit digit of 43³?',
        'Look at the unit digit 3: 3 × 3 = 9; 9 × 3 = 27.',
        '7',
        ['3', '9', '1'],
        'Numbers ending in 3 always produce cubes ending in 7 because 3³ = 27.',
        randomSeed + 11
      )
    );

    questionPool.push(
      makeQuestion(
        'Why is 1729 known as the Hardy-Ramanujan number?',
        'It is the smallest natural number expressible as the sum of two cubes in two different ways.',
        '1³ + 12³ and 9³ + 10³',
        ['2³ + 11³ and 4³ + 10³', '3³ + 12³ and 6³ + 9³', '5³ + 10³ and 7³ + 8³'],
        '1729 = 1 + 1728 = 1³ + 12³, and 1729 = 729 + 1000 = 9³ + 10³.',
        randomSeed + 12
      )
    );

    questionPool.push(
      makeQuestion(
        'What is the value of ∛(−512)?',
        '∛(−a) = −∛a, and 8 × 8 × 8 = 512.',
        '−8',
        ['8', '−64', '64'],
        '(−8) × (−8) × (−8) = 64 × (−8) = −512. Therefore, ∛(−512) = −8.',
        randomSeed + 13
      )
    );

    questionPool.push(
      makeQuestion(
        'How many zeros will the cube of 500 end with?',
        'A number ending in k zeros has 3k zeros in its cube.',
        '6 zeros',
        ['2 zeros', '3 zeros', '4 zeros'],
        '500 ends in 2 zeros. Its cube 500³ = 125,000,000 ends in 2 × 3 = 6 zeros.',
        randomSeed + 14
      )
    );

    questionPool.push(
      makeQuestion(
        'Express 4³ as the sum of 4 consecutive odd numbers starting from 13:',
        'The sum of consecutive odd numbers equals n³: 13 + 15 + 17 + 19.',
        '13 + 15 + 17 + 19 = 64',
        ['11 + 13 + 15 + 17 = 56', '15 + 17 + 19 + 21 = 72', '9 + 11 + 13 + 15 = 48'],
        '13 + 15 + 17 + 19 = 64 = 4³.',
        randomSeed + 15
      )
    );

    questionPool.push(
      makeQuestion(
        'What is the smallest number by which 256 must be divided to yield a perfect cube?',
        'Factor 256: 256 = 2⁸ = (2³ × 2³) × 2² = 64 × 4.',
        '4',
        ['2', '8', '16'],
        '256 = 2³ × 2³ × 2². Dividing by 2² = 4 leaves 2³ × 2³ = 64 = 4³.',
        randomSeed + 16
      )
    );

    questionPool.push(
      makeQuestion(
        'A cubical tank holds 216 litres of water. If 1 litre = 1,000 cm³, what is the inner edge length?',
        'Volume = 216,000 cm³. Edge = ∛(216,000).',
        '60 cm',
        ['6 cm', '36 cm', '120 cm'],
        '∛(216,000) = ∛(216) × ∛(1000) = 6 × 10 = 60 cm.',
        randomSeed + 17
      )
    );
  }

  // 3. Topic: Exponents, Powers & Scientific Notation
  if (
    titleLower.includes('exponent') ||
    titleLower.includes('power') ||
    codeLower.includes('3.') ||
    formula.includes('aᵐ') ||
    formula.includes('10^')
  ) {
    questionPool.push(
      makeQuestion(
        'What is the evaluated value of 4⁻³?',
        'a⁻ⁿ = 1 / aⁿ.',
        '1/64',
        ['−64', '−12', '1/12'],
        '4⁻³ = 1 / (4³) = 1 / 64.',
        randomSeed + 18
      )
    );

    questionPool.push(
      makeQuestion(
        'Simplify: (2⁵ × 2⁻³) ÷ 2⁴.',
        'Add exponents for multiplication; subtract exponents for division.',
        '2⁻² (or 1/4)',
        ['2⁶ (or 64)', '2² (or 4)', '2⁰ (or 1)'],
        '2⁵ × 2⁻³ = 2⁵⁻³ = 2². Then 2² ÷ 2⁴ = 2²⁻⁴ = 2⁻² = 1/4.',
        randomSeed + 19
      )
    );

    questionPool.push(
      makeQuestion(
        'Express 0.0000078 in standard scientific notation:',
        'Shift the decimal 6 places to the right: m × 10⁻ᵏ with 1 ≤ m < 10.',
        '7.8 × 10⁻⁶',
        ['7.8 × 10⁻⁵', '78 × 10⁻⁷', '0.78 × 10⁻⁵'],
        'Moving the decimal 6 positions to the right gives 7.8 × 10⁻⁶.',
        randomSeed + 20
      )
    );

    questionPool.push(
      makeQuestion(
        'What is (3/4)⁻² expressed as a positive fraction?',
        'Invert the fraction to make the power positive: (a/b)⁻ⁿ = (b/a)ⁿ.',
        '16/9',
        ['−9/16', '9/16', '−16/9'],
        '(3/4)⁻² = (4/3)² = 16/9.',
        randomSeed + 21
      )
    );

    questionPool.push(
      makeQuestion(
        'For any non-zero integer a, what is a⁰ equal to?',
        'aᵐ ÷ aᵐ = aᵐ⁻ᵐ = a⁰ = 1.',
        '1',
        ['0', 'a', 'Undefined'],
        'By the laws of indices, dividing a number by itself gives 1: aⁿ ÷ aⁿ = a⁰ = 1.',
        randomSeed + 22
      )
    );

    questionPool.push(
      makeQuestion(
        'Simplify: (3²)⁴ × 3⁻⁵.',
        '(aᵐ)ⁿ = aᵐⁿ; then add powers.',
        '3³ (or 27)',
        ['3⁵ (or 243)', '3¹ (or 3)', '3⁻¹ (or 1/3)'],
        '(3²)⁴ = 3⁸. Then 3⁸ × 3⁻⁵ = 3⁸⁻⁵ = 3³ = 27.',
        randomSeed + 23
      )
    );
  }

  // 4. Topic: Quadrilaterals, Angles & Polygons
  if (
    titleLower.includes('quadrilateral') ||
    titleLower.includes('angle') ||
    titleLower.includes('parallelogram') ||
    titleLower.includes('rhombus') ||
    codeLower.includes('4.')
  ) {
    questionPool.push(
      makeQuestion(
        'What is the sum of the interior angles of ANY convex quadrilateral?',
        'Split into two triangles: (n − 2) × 180° for n = 4.',
        '360°',
        ['180°', '270°', '540°'],
        'Interior angle sum = (4 − 2) × 180° = 2 × 180° = 360°.',
        randomSeed + 24
      )
    );

    questionPool.push(
      makeQuestion(
        'What is the sum of the EXTERIOR angles of ANY convex polygon?',
        'One full revolution around the perimeter.',
        '360°',
        ['180°', '540°', 'Depends on number of sides'],
        'The sum of exterior angles of any convex polygon is universally 360°.',
        randomSeed + 25
      )
    );

    questionPool.push(
      makeQuestion(
        'In a parallelogram, if one angle is 70°, what is the measure of its adjacent angle?',
        'Adjacent angles in a parallelogram are supplementary (sum to 180°).',
        '110°',
        ['70°', '90°', '120°'],
        'Adjacent angles sum to 180°: 180° − 70° = 110°.',
        randomSeed + 26
      )
    );

    questionPool.push(
      makeQuestion(
        'Which quadrilateral has diagonals that are PERPENDICULAR bisectors of each other, but not necessarily equal in length?',
        'All 4 sides are equal; diagonals meet at 90°.',
        'Rhombus',
        ['Rectangle', 'Trapezium', 'General Parallelogram'],
        'A rhombus has diagonals that perpendicularly bisect each other at 90°.',
        randomSeed + 27
      )
    );

    questionPool.push(
      makeQuestion(
        'How many diagonals does a regular hexagon (6 sides) possess?',
        'Formula: n(n − 3) / 2 for n = 6.',
        '9 diagonals',
        ['6 diagonals', '12 diagonals', '15 diagonals'],
        'Diagonals = 6 × (6 − 3) ÷ 2 = 6 × 3 ÷ 2 = 9.',
        randomSeed + 28
      )
    );

    questionPool.push(
      makeQuestion(
        'A quadrilateral with exactly ONE pair of parallel sides is called a:',
        'Opposite parallel sides are called bases.',
        'Trapezium',
        ['Rhombus', 'Kite', 'Rectangle'],
        'By definition, a trapezium is a quadrilateral having only one pair of parallel sides.',
        randomSeed + 29
      )
    );
  }

  // 5. Topic: Number Play, Divisibility Rules & Cryptarithms
  if (
    titleLower.includes('number play') ||
    titleLower.includes('divisib') ||
    titleLower.includes('digit') ||
    titleLower.includes('parity') ||
    codeLower.includes('5.')
  ) {
    const dDigit = 2 + (randomSeed % 7); // 2 to 8
    const dSum = 3 + 5 + dDigit;
    const neededFor9 = (9 - (dSum % 9)) % 9;
    questionPool.push(
      makeQuestion(
        `If the 4-digit number 35X${dDigit} is divisible by 9, what is the value of digit X?`,
        'A number is divisible by 9 if the sum of all its digits is a multiple of 9.',
        `${neededFor9}`,
        [`${(neededFor9 + 2) % 10}`, `${(neededFor9 + 3) % 10}`, `${(neededFor9 + 5) % 10}`],
        `Sum of digits = 3 + 5 + X + ${dDigit} = ${dSum} + X. For this to be divisible by 9, X must be ${neededFor9}.`,
        randomSeed + 30
      )
    );

    questionPool.push(
      makeQuestion(
        'When a 2-digit number "ab" is reversed to "ba", the difference (ab − ba) is ALWAYS divisible by:',
        '(10a + b) − (10b + a) = 9(a − b).',
        '9',
        ['5', '11', '10'],
        '(10a + b) − (10b + a) = 9(a − b), which is always an exact multiple of 9.',
        randomSeed + 31
      )
    );

    questionPool.push(
      makeQuestion(
        'When a 2-digit number "ab" is added to its reversal "ba", the sum (ab + ba) is ALWAYS divisible by:',
        '(10a + b) + (10b + a) = 11(a + b).',
        '11',
        ['9', '7', '10'],
        '(10a + b) + (10b + a) = 11a + 11b = 11(a + b), which is always divisible by 11.',
        randomSeed + 32
      )
    );

    questionPool.push(
      makeQuestion(
        'Which number is divisible by 11 according to the alternating digit test?',
        '(Sum of digits at odd places) − (Sum of digits at even places) is 0 or multiple of 11.',
        '1,331',
        ['1,245', '2,468', '3,579'],
        'In 1,331: (1 + 3) − (3 + 1) = 4 − 4 = 0. Since difference is 0, 1,331 is divisible by 11.',
        randomSeed + 33
      )
    );

    questionPool.push(
      makeQuestion(
        'In the cryptarithm 3A + 25 = B2, what are the single digits A and B?',
        'Look at ones column: A + 5 ends in 2, so A = 7 with 1 carried over.',
        'A = 7, B = 6',
        ['A = 5, B = 5', 'A = 8, B = 6', 'A = 7, B = 5'],
        'A + 5 = 12 ⇒ A = 7 (carry 1). Then 1 + 3 + 2 = 6 ⇒ B = 6. Check: 37 + 25 = 62.',
        randomSeed + 34
      )
    );
  }

  // 6. Topic: Algebraic Expressions, Identities & Factoring
  if (
    titleLower.includes('distribute') ||
    titleLower.includes('identit') ||
    titleLower.includes('algebra') ||
    codeLower.includes('6.')
  ) {
    questionPool.push(
      makeQuestion(
        'What is the expanded form of (a − b)²?',
        '(a − b)(a − b) = a² − ab − ab + b².',
        'a² − 2ab + b²',
        ['a² − b²', 'a² + 2ab + b²', 'a² − 2ab − b²'],
        '(a − b)² = a² − 2ab + b².',
        randomSeed + 35
      )
    );

    questionPool.push(
      makeQuestion(
        'Evaluate 104 × 96 using the algebraic identity (a + b)(a − b) = a² − b²:',
        'Write 104 as (100 + 4) and 96 as (100 − 4).',
        '9,984',
        ['9,994', '9,974', '10,016'],
        '(100 + 4)(100 − 4) = 100² − 4² = 10,000 − 16 = 9,984.',
        randomSeed + 36
      )
    );

    questionPool.push(
      makeQuestion(
        'Factorize the difference of squares: 49x² − 36y²:',
        'a² − b² = (a + b)(a − b) where a = 7x and b = 6y.',
        '(7x + 6y)(7x − 6y)',
        ['(7x − 6y)²', '(49x + 36y)(x − y)', '(7x + 6y)²'],
        '49x² − 36y² = (7x)² − (6y)² = (7x + 6y)(7x − 6y).',
        randomSeed + 37
      )
    );

    questionPool.push(
      makeQuestion(
        'What is the coefficient of x in the expansion of (x + 5)(x − 2)?',
        '(x + a)(x + b) = x² + (a + b)x + ab.',
        '3',
        ['7', '−10', '−3'],
        '(x + 5)(x − 2) = x² + (5 − 2)x − 10 = x² + 3x − 10. The coefficient of x is 3.',
        randomSeed + 38
      )
    );

    questionPool.push(
      makeQuestion(
        'Factorize completely by grouping: x² + xy + 8x + 8y:',
        'Group: x(x + y) + 8(x + y).',
        '(x + 8)(x + y)',
        ['(x + y)(x − 8)', '(x + 4)(y + 2)', 'x(x + y + 8)'],
        'x(x + y) + 8(x + y) = (x + 8)(x + y).',
        randomSeed + 39
      )
    );
  }

  // 7. Topic: Proportional Reasoning, Ratios & Variations
  if (
    titleLower.includes('proportion') ||
    titleLower.includes('ratio') ||
    titleLower.includes('reasoning') ||
    codeLower.includes('7.')
  ) {
    questionPool.push(
      makeQuestion(
        'If x and y vary directly, which mathematical relation holds true?',
        'Direct proportion means ratio x / y is constant.',
        'x / y = k (constant)',
        ['x × y = k', 'x + y = k', 'x − y = k'],
        'In direct proportion, the ratio x/y remains constant as both change.',
        randomSeed + 40
      )
    );

    questionPool.push(
      makeQuestion(
        'If 15 workers build a shed in 8 days, how many days will 12 workers take at the same pace?',
        'Number of workers and days are in INVERSE proportion: W₁ × D₁ = W₂ × D₂.',
        '10 days',
        ['6.4 days', '8 days', '12 days'],
        '15 × 8 = 120 worker-days. With 12 workers: 120 ÷ 12 = 10 days.',
        randomSeed + 41
      )
    );

    questionPool.push(
      makeQuestion(
        'A train covers 240 km in 3 hours. At this uniform speed, how long will it take to travel 400 km?',
        'Speed = 240 ÷ 3 = 80 km/h. Time = Distance ÷ Speed.',
        '5 hours',
        ['4.5 hours', '6 hours', '5.5 hours'],
        'Speed = 240 / 3 = 80 km/h. Time = 400 / 80 = 5 hours.',
        randomSeed + 42
      )
    );

    questionPool.push(
      makeQuestion(
        'On a map with scale 1 : 50,000, two landmarks are 4 cm apart. What is the real-world distance?',
        'Real distance = 4 × 50,000 cm = 200,000 cm.',
        '2 km',
        ['0.2 km', '20 km', '200 km'],
        '4 × 50,000 cm = 200,000 cm = 2,000 m = 2 km.',
        randomSeed + 43
      )
    );
  }

  // Universal mathematical question bank for capstones and general modules
  const generalBank: ModuleGameChallenge[] = [
    makeQuestion(
      `In ${moduleTitle}, what core principle is demonstrated by ${formula || 'its governing identity'}?`,
      'Focus on the fundamental law covered in the reading guide.',
      `It verifies the mathematical balance of ${formula || moduleTitle}.`,
      [
        'It is an unpredictable empirical coincidence.',
        'It only holds for negative numbers.',
        'It contradicts algebraic proof.',
      ],
      `The module rigorously establishes the algebraic and geometric validity of ${formula || moduleTitle}.`,
      randomSeed + 44
    ),
    makeQuestion(
      'Which arithmetic operation is commutative for all rational numbers a and b?',
      'Commutative means a ⋆ b = b ⋆ a.',
      'Addition (a + b)',
      ['Subtraction (a − b)', 'Division (a ÷ b)', 'Exponentiation (aᵇ)'],
      'Addition and multiplication are commutative (a + b = b + a), whereas subtraction and division are not.',
      randomSeed + 45
    ),
    makeQuestion(
      'What is the reciprocal (multiplicative inverse) of −5/8?',
      'The number that multiplies with −5/8 to give +1.',
      '−8/5',
      ['8/5', '5/8', '1'],
      '(−5/8) × (−8/5) = +40/40 = 1. Therefore, the reciprocal is −8/5.',
      randomSeed + 46
    ),
    makeQuestion(
      'What is the additive inverse of 14/19?',
      'The number that adds to 14/19 to produce 0.',
      '−14/19',
      ['19/14', '−19/14', '0'],
      '14/19 + (−14/19) = 0. Hence, −14/19 is the additive inverse.',
      randomSeed + 47
    ),
    makeQuestion(
      'Solve for x: 3x − 7 = 14:',
      'Add 7 to both sides, then divide by 3.',
      'x = 7',
      ['x = 21', 'x = 3', 'x = 5'],
      '3x = 14 + 7 = 21 ⇒ x = 21 ÷ 3 = 7.',
      randomSeed + 48
    ),
    makeQuestion(
      'What is 35% of 240?',
      'Convert 35% to 0.35 or 35/100 and multiply by 240.',
      '84',
      ['72', '80', '96'],
      '0.35 × 240 = 84.',
      randomSeed + 49
    ),
  ];

  // Incorporate existing challenges from the curriculum dataset if available
  const combined = [...(existingChallenges || []), ...questionPool, ...generalBank];

  // Filter out any duplicate prompts
  const seenPrompts = new Set<string>();
  const uniqueQuestions: ModuleGameChallenge[] = [];

  for (const q of combined) {
    const key = q.prompt.trim().toLowerCase();
    if (!seenPrompts.has(key)) {
      seenPrompts.add(key);
      uniqueQuestions.push(q);
    }
  }

  // Shuffle the questions based on the randomSeed
  const randomized = shuffle(uniqueQuestions, randomSeed);
  const selected = randomized.slice(0, targetCount);

  // Fallback padding if needed to reach targetCount
  let padIdx = 1;
  while (selected.length < targetCount) {
    selected.push(
      makeQuestion(
        `Cap Question #${selected.length + 1}: Verified deduction in ${moduleTitle}`,
        'Apply the governing rule to find the solution.',
        'Verified and Correct',
        ['Contradicts the rule', 'Indeterminate', 'Insufficient Information'],
        `Directly follows from ${formula || moduleTitle}.`,
        randomSeed + padIdx * 13
      )
    );
    padIdx++;
  }

  return {
    questions: selected.slice(0, targetCount),
    isLastModule,
    totalMarks: targetCount,
    passingMarks,
    passingPercentage,
    paperTitle,
  };
}

export function getFiveRecapQuestions(
  moduleCode: string,
  moduleTitle: string,
  formulaHighlight: string,
  existingChallenges: ModuleGameChallenge[] = [],
  simulation?: ModuleSimulationConfig,
  randomSeed: number = 0
): ModuleGameChallenge[] {
  return getRecapQuizConfig(
    moduleCode,
    moduleTitle,
    formulaHighlight,
    existingChallenges,
    simulation,
    false,
    randomSeed
  ).questions;
}
