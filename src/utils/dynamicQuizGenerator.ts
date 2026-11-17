import { ChapterAssessmentQuestion } from '../types/part1Curriculum';
import { ChapterId } from '../types/math';
import {
  prioritizeByDifficulty,
  QuizDifficultyLevel,
  randIntForDifficulty,
} from './quizDifficulty';
import { generateTieredChapterPool } from './olympiadQuestionBank';

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function shuffleWithCorrect<T>(
  items: T[],
  correctIndex: number,
  rng: () => number
): { shuffled: T[]; newCorrectIndex: number } {
  const tagged = items.map((item, idx) => ({ item, isCorrect: idx === correctIndex }));
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = tagged[i];
    tagged[i] = tagged[j];
    tagged[j] = temp;
  }
  return {
    shuffled: tagged.map((t) => t.item),
    newCorrectIndex: tagged.findIndex((t) => t.isCorrect),
  };
}

function makeQuestion(
  id: string,
  questionNumber: number,
  type: 'mcq' | 'short-answer',
  prompt: string,
  correctAnswer: string,
  distractors: string[],
  explanation: string,
  moduleRef: string,
  rng: () => number,
  acceptedShortAnswers?: string[]
): ChapterAssessmentQuestion {
  const uniqueDistractors = Array.from(new Set(distractors.filter((d) => d !== correctAnswer))).slice(0, 3);
  while (uniqueDistractors.length < 3) {
    uniqueDistractors.push(`${Number(correctAnswer.replace(/[^0-9.-]/g, '') || 10) + (uniqueDistractors.length + 1) * 3}`);
  }
  const rawOptions = [correctAnswer, ...uniqueDistractors];
  const { shuffled, newCorrectIndex } = shuffleWithCorrect(rawOptions, 0, rng);
  return {
    id,
    questionNumber,
    type,
    prompt,
    options: shuffled,
    correctIndex: newCorrectIndex,
    acceptedShortAnswers: acceptedShortAnswers || [correctAnswer],
    explanation,
    moduleRef,
  };
}

function generateProceduralPoolForChapter(
  chapterId: ChapterId | 'ch8-master-quiz' | 'part2-ch8-master-quiz' | 'cellar-boss',
  rng: () => number,
  difficulty: QuizDifficultyLevel = 2
): Omit<ChapterAssessmentQuestion, 'questionNumber'>[] {
  if (difficulty === 1 || difficulty === 3 || difficulty === 4) {
    const tiered = generateTieredChapterPool(chapterId, rng, difficulty);
    if (tiered.length > 0) {
      return tiered;
    }
  }

  const pool: Omit<ChapterAssessmentQuestion, 'questionNumber'>[] = [];
  const dRand = (
    r1: [number, number],
    r2: [number, number],
    r3: [number, number],
    r4: [number, number]
  ) => randIntForDifficulty(rng, difficulty, r1, r2, r3, r4);
  const tightStep = difficulty >= 3 ? 1 : 2;

  if (chapterId === 'ch1-square-cube' || chapterId === 'ch8-master-quiz' || chapterId === 'cellar-boss') {
    const oddCount = dRand([4, 10], [11, 22], [23, 40], [42, 75]);
    const oddLast = 2 * oddCount - 1;
    const oddSum = oddCount * oddCount;
    pool.push(
      makeQuestion(
        `dyn-ch1-odd-${oddCount}`,
        1,
        'short-answer',
        `Find the exact sum of the first ${oddCount} consecutive odd numbers: 1 + 3 + 5 + … + ${oddLast}.`,
        `${oddSum}`,
        [
          `${(oddCount - 1) * (oddCount - 1)}`,
          `${(oddCount + 1) * (oddCount + 1)}`,
          `${oddSum + (difficulty >= 3 ? tightStep : oddCount)}`,
        ],
        `The sum of the first n consecutive odd numbers is always n². Here n = ${oddCount}, so ${oddCount}² = ${oddSum}.`,
        'Module 1.3',
        rng,
        [`${oddSum}`, `${oddCount}^2`]
      )
    );

    const nBetween = dRand([5, 14], [15, 32], [35, 65], [70, 140]);
    const betweenAns = 2 * nBetween;
    pool.push(
      makeQuestion(
        `dyn-ch1-between-${nBetween}`,
        1,
        'mcq',
        `How many natural numbers lie strictly between ${nBetween}² (${(nBetween * nBetween).toLocaleString()}) and ${nBetween + 1}² (${((nBetween + 1) * (nBetween + 1)).toLocaleString()})?`,
        `${betweenAns}`,
        [`${nBetween}`, `${betweenAns + 1}`, `${betweenAns + (difficulty >= 3 ? -1 : 2)}`],
        `Strictly between n² and (n+1)² there are exactly 2n natural numbers: 2 × ${nBetween} = ${betweenAns}.`,
        'Module 1.3',
        rng
      )
    );

    const sqRoot = dRand([6, 19], [21, 55], [56, 95], [105, 195]);
    const sqVal = sqRoot * sqRoot;
    pool.push(
      makeQuestion(
        `dyn-ch1-sqrt-${sqRoot}`,
        1,
        'short-answer',
        `Find the exact square root of ${sqVal.toLocaleString()} (√${sqVal}).`,
        `${sqRoot}`,
        [`${sqRoot - tightStep}`, `${sqRoot + tightStep}`, `${sqRoot + (difficulty >= 3 ? 4 : 6)}`],
        `Since ${sqRoot} × ${sqRoot} = ${sqVal.toLocaleString()}, √${sqVal} = ${sqRoot}.`,
        'Module 1.4',
        rng,
        [`${sqRoot}`]
      )
    );

    const cbRoot = dRand([3, 9], [11, 25], [26, 48], [52, 89]);
    const cbVal = cbRoot * cbRoot * cbRoot;
    pool.push(
      makeQuestion(
        `dyn-ch1-cbrt-${cbRoot}`,
        1,
        'short-answer',
        `Using the 3-digit split method, find the exact cube root of ${cbVal.toLocaleString()} (∛${cbVal}).`,
        `${cbRoot}`,
        [`${cbRoot - tightStep}`, `${cbRoot + tightStep}`, `${cbRoot + 10}`],
        `Splitting ${cbVal.toLocaleString()} gives tens digit ${Math.floor(cbRoot / 10)} and units digit ${cbRoot % 10}, so ∛${cbVal} = ${cbRoot}.`,
        'Module 1.7',
        rng,
        [`${cbRoot}`]
      )
    );

    const lockerLimit = dRand([2, 6], [5, 15], [16, 30], [32, 60]) * 20;
    const openCount = Math.floor(Math.sqrt(lockerLimit));
    pool.push(
      makeQuestion(
        `dyn-ch1-lockers-${lockerLimit}`,
        1,
        'mcq',
        `In a corridor of ${lockerLimit} royal lockers toggled by ${lockerLimit} people, how many lockers remain OPEN at the end?`,
        `${openCount} lockers`,
        [`${Math.max(1, openCount - 1)} lockers`, `${openCount + 1} lockers`, `${openCount + 2} lockers`],
        `Only perfect square lockers ≤ ${lockerLimit} stay open. Since ${openCount}² = ${openCount * openCount} ≤ ${lockerLimit}, ${openCount} lockers stay open.`,
        'Module 1.1',
        rng
      )
    );

    if (difficulty >= 3) {
      const mStart = dRand([8, 12], [11, 18], [15, 29], [31, 55]);
      const mEnd = mStart + dRand([4, 6], [5, 9], [7, 14], [10, 22]);
      const oddRangeSum = mEnd * mEnd - (mStart - 1) * (mStart - 1);
      pool.push(
        makeQuestion(
          `dyn-ch1-oddrange-${mStart}-${mEnd}`,
          1,
          'short-answer',
          `Compute the combined difference of sums: (sum of first ${mEnd} odd numbers) − (sum of first ${mStart - 1} odd numbers).`,
          `${oddRangeSum}`,
          [`${oddRangeSum - 2}`, `${oddRangeSum + 2}`, `${mEnd * mEnd - mStart * mStart}`],
          `Using Sₙ = n², the difference is ${mEnd}² − ${mStart - 1}² = ${mEnd * mEnd} − ${(mStart - 1) * (mStart - 1)} = ${oddRangeSum}.`,
          'Module 1.3',
          rng,
          [`${oddRangeSum}`]
        )
      );
    }
  }

  if (chapterId === 'ch2-power-play' || chapterId === 'ch8-master-quiz' || chapterId === 'cellar-boss') {
    const folds = dRand([3, 6], [6, 10], [10, 14], [12, 17]);
    const layers = Math.pow(2, folds);
    pool.push(
      makeQuestion(
        `dyn-ch2-folds-${folds}`,
        1,
        'mcq',
        `If a sheet of paper is folded in half ${folds} times, how many layers of paper are in the stack?`,
        `${layers.toLocaleString()} layers`,
        [`${(folds * 2).toLocaleString()} layers`, `${(layers / 2).toLocaleString()} layers`, `${(layers * 2).toLocaleString()} layers`],
        `Each fold doubles the layers: 2^${folds} = ${layers.toLocaleString()} layers.`,
        'Module 2.1',
        rng
      )
    );

    const baseP = dRand([2, 5], [3, 9], [5, 13], [7, 19]);
    const expA = dRand([2, 5], [4, 9], [6, 14], [9, 21]);
    const expB = dRand([1, 3], [3, 7], [4, 11], [6, 15]);
    const expSum = expA + expB;
    const xAns = dRand([2, 4], [3, 8], [5, 12], [8, 17]);
    const totalExp = expSum + xAns;
    pool.push(
      makeQuestion(
        `dyn-ch2-law-${baseP}-${expA}-${xAns}`,
        1,
        'short-answer',
        `Find the value of x that satisfies: ${baseP}^${expA} × ${baseP}^x ÷ ${baseP}^${expB} = ${baseP}^${totalExp - expB}.`,
        `${expSum + xAns - expA}`,
        [`${expSum + xAns - expA + tightStep}`, `${expSum + xAns - expA - 1}`, `${expA + expB}`],
        `Using the Product and Quotient Laws: ${expA} + x - ${expB} = ${totalExp - expB} ⇒ x = ${totalExp - expA}.`,
        'Module 2.3',
        rng,
        [`${totalExp - expA}`]
      )
    );

    const negBase = dRand([2, 3], [2, 6], [4, 9], [6, 12]);
    const negSq = negBase * negBase;
    pool.push(
      makeQuestion(
        `dyn-ch2-neg-${negBase}`,
        1,
        'mcq',
        `What is the exact value of (${negBase}⁰ + ${negBase}⁻²) × ${negSq}?`,
        `${negSq + 1}`,
        [`${negSq - 1}`, `${negBase + 1}`, `1/${negSq}`],
        `(${negBase}⁰ + ${negBase}⁻²) × ${negSq} = (1 + 1/${negSq}) × ${negSq} = ${negSq} + 1 = ${negSq + 1}.`,
        'Module 2.5',
        rng
      )
    );

    const mant = dRand([12, 45], [12, 95], [15, 98], [18, 99]) / 10;
    const zeros = dRand([3, 6], [5, 9], [8, 15], [12, 24]);
    pool.push(
      makeQuestion(
        `dyn-ch2-sci-${mant}-${zeros}`,
        1,
        'mcq',
        `How is ${(mant * 100).toFixed(0)} × 10^${zeros - 2} written in proper standard scientific notation (1 ≤ x < 10)?`,
        `${mant} × 10^${zeros}`,
        [`${mant} × 10^${zeros - 2}`, `${(mant * 10).toFixed(0)} × 10^${zeros - 1}`, `${mant} × 10^${zeros - 4}`],
        `Since ${(mant * 100).toFixed(0)} = ${mant} × 10², multiplying by 10^${zeros - 2} gives ${mant} × 10^${zeros}.`,
        'Module 2.6',
        rng
      )
    );

    if (difficulty >= 3) {
      const mPow = dRand([2, 3], [3, 5], [4, 7], [6, 11]);
      const pAns = mPow * 2 + 1;
      pool.push(
        makeQuestion(
          `dyn-ch2-oly-${mPow}`,
          1,
          'short-answer',
          `Solve for the combined exponent k in (8^${mPow} × 4⁻¹) ÷ 2 = 2^k.`,
          `${mPow * 3 - 3}`,
          [`${mPow * 3 - 2}`, `${pAns}`, `${mPow * 3 - 1}`],
          `Convert to base 2: (2^(3×${mPow}) × 2⁻²) ÷ 2¹ = 2^(${mPow * 3} − 3) ⇒ k = ${mPow * 3 - 3}.`,
          'Module 2.4',
          rng,
          [`${mPow * 3 - 3}`]
        )
      );
    }
  }

  if (chapterId === 'ch3-story-numbers' || chapterId === 'ch8-master-quiz' || chapterId === 'cellar-boss') {
    const b2 = dRand([0, 2], [1, 4], [2, 4], [3, 4]);
    const b1 = randInt(rng, 0, 4);
    const b0 = randInt(rng, 1, 4);
    const b3 = difficulty === 4 ? dRand([1, 2], [1, 2], [1, 3], [1, 4]) : 0;
    const decVal = b3 * 125 + b2 * 25 + b1 * 5 + b0;
    const repLabel = b3 > 0 ? `${b3}${b2}${b1}${b0}` : `${b2}${b1}${b0}`;
    pool.push(
      makeQuestion(
        `dyn-ch3-base5-${decVal}`,
        1,
        'short-answer',
        `In a Base-5 system (${b3 > 0 ? 'with landmark blocks 125, 25, 5, 1' : 'with landmark blocks of 25, 5, and 1'}), what decimal number is represented by (${repLabel})₅?`,
        `${decVal}`,
        [`${decVal + 5}`, `${Math.max(1, decVal - 5)}`, `${b3 * 1000 + b2 * 100 + b1 * 10 + b0}`],
        `(${repLabel})₅ evaluates place values in powers of 5 to give decimal ${decVal}.`,
        'Module 3.5',
        rng,
        [`${decVal}`]
      )
    );

    const sixties = dRand([1, 4], [2, 8], [7, 18], [15, 35]);
    const ones = dRand([2, 20], [11, 55], [15, 58], [21, 59]);
    const babTotal = sixties * 60 + ones;
    pool.push(
      makeQuestion(
        `dyn-ch3-bab-${babTotal}`,
        1,
        'short-answer',
        `Evaluate the Mesopotamian Base-60 positional number [${sixties} : ${ones}]₆₀ (${sixties} in the 60s place and ${ones} in the 1s place).`,
        `${babTotal}`,
        [`${babTotal - 60}`, `${babTotal + (difficulty >= 3 ? 6 : 20)}`, `${sixties * 100 + ones}`],
        `In Base-60, [${sixties} : ${ones}]₆₀ = ${sixties} × 60 + ${ones} = ${sixties * 60} + ${ones} = ${babTotal}.`,
        'Module 3.6',
        rng,
        [`${babTotal}`]
      )
    );

    const bodyRight = dRand([1, 7], [2, 12], [3, 13], [4, 13]);
    const bodyLeft = 28 - bodyRight;
    pool.push(
      makeQuestion(
        `dyn-ch3-body-${bodyRight}`,
        1,
        'mcq',
        `In the 27-point Papua New Guinea body-part counting system (centered at the nose = 14), which number is symmetric on the left side to point #${bodyRight} on the right side?`,
        `#${bodyLeft}`,
        [`#${bodyLeft - 1}`, `#${bodyLeft + 1}`, `#${27 - bodyRight}`],
        `Symmetric left/right body landmarks sum to 2 × 14 = 28, so 28 - ${bodyRight} = #${bodyLeft}.`,
        'Module 3.2',
        rng
      )
    );
  }

  if (chapterId === 'ch4-quadrilaterals' || chapterId === 'ch8-master-quiz' || chapterId === 'cellar-boss') {
    const a1 = dRand([70, 90], [65, 95], [58, 104], [47, 113]);
    const a2 = dRand([80, 100], [80, 115], [76, 124], [79, 133]);
    const a3 = dRand([75, 95], [70, 105], [64, 112], [55, 98]);
    const a4 = 360 - (a1 + a2 + a3);
    pool.push(
      makeQuestion(
        `dyn-ch4-angles-${a1}-${a2}-${a3}`,
        1,
        'short-answer',
        `Three interior angles of a quadrilateral measure ${a1}°, ${a2}°, and ${a3}°. Find the measure of the fourth angle (in degrees).`,
        `${a4}`,
        [`${a4 + (difficulty >= 3 ? 5 : 10)}`, `${a4 - (difficulty >= 3 ? 5 : 10)}`, `${Math.abs(180 - a1)}`],
        `The four interior angles of any quadrilateral sum to 360°: 360° - (${a1}° + ${a2}° + ${a3}°) = ${a4}°.`,
        'Module 4.4',
        rng,
        [`${a4}`, `${a4}°`]
      )
    );

    const pAngle = dRand([50, 80], [48, 86], [37, 83], [29, 77]);
    const pSupp = 180 - pAngle;
    pool.push(
      makeQuestion(
        `dyn-ch4-para-${pAngle}`,
        1,
        'mcq',
        `In parallelogram ABCD, if ∠A = ${pAngle}°, what are the measures of adjacent angle ∠B and opposite angle ∠C?`,
        `∠B = ${pSupp}° and ∠C = ${pAngle}°`,
        [
          `∠B = ${pAngle}° and ∠C = ${pSupp}°`,
          `∠B = ${90 - Math.floor(pAngle / 2)}° and ∠C = ${pAngle}°`,
          `∠B = ${pSupp - 10}° and ∠C = ${pAngle + 10}°`,
        ],
        `In a parallelogram, adjacent angles sum to 180° (180° - ${pAngle}° = ${pSupp}°) and opposite angles are equal (∠C = ∠A = ${pAngle}°).`,
        'Module 4.5',
        rng
      )
    );

    const triples =
      difficulty === 1
        ? [[3, 4, 5], [6, 8, 10]]
        : difficulty === 2
        ? [[6, 8, 10], [5, 12, 13], [9, 12, 15]]
        : difficulty === 3
        ? [[5, 12, 13], [8, 15, 17], [12, 16, 20]]
        : [[8, 15, 17], [7, 24, 25], [20, 21, 29], [12, 35, 37]];
    const [h1, h2, side] = triples[randInt(rng, 0, triples.length - 1)];
    pool.push(
      makeQuestion(
        `dyn-ch4-rhombus-${h1}-${h2}`,
        1,
        'short-answer',
        `The diagonals of a rhombus measure ${2 * h1} cm and ${2 * h2} cm. Find the length of one side of the rhombus (in cm).`,
        `${side}`,
        [`${h1 + h2}`, `${side + tightStep}`, `${2 * side}`],
        `The diagonals bisect each other at 90° into half-diagonals of ${h1} cm and ${h2} cm. Side = √(${h1}² + ${h2}²) = ${side} cm.`,
        'Module 4.6',
        rng,
        [`${side}`, `${side} cm`]
      )
    );
  }

  if (chapterId === 'ch5-number-play' || chapterId === 'ch8-master-quiz' || chapterId === 'cellar-boss') {
    const d1 = dRand([1, 5], [2, 8], [3, 9], [4, 9]);
    const d2 = dRand([1, 5], [1, 7], [2, 9], [3, 9]);
    const d3 = dRand([1, 5], [2, 8], [3, 9], [4, 9]);
    const d4 = difficulty === 1 ? 0 : randInt(rng, 1, 7);
    const partialSum = d1 + d2 + d3 + d4;
    const nextMult9 = Math.ceil((partialSum + 1) / 9) * 9;
    const missingX = nextMult9 - partialSum;
    pool.push(
      makeQuestion(
        `dyn-ch5-div9-${d1}${d2}${d3}${d4}`,
        1,
        'short-answer',
        `Find the missing single digit X so that the ${difficulty === 1 ? '4-digit' : '5-digit'} number ${d1}${d2}X${d3}${difficulty === 1 ? '' : d4} is divisible by 9.`,
        `${missingX}`,
        [`${(missingX + tightStep) % 10}`, `${(missingX + 4) % 10}`, `${(missingX + 5) % 10}`],
        `Sum of known digits = ${partialSum}. The next multiple of 9 is ${nextMult9}, so X = ${nextMult9} - ${partialSum} = ${missingX}.`,
        'Module 5.5',
        rng,
        [`${missingX}`]
      )
    );

    const rem = dRand([1, 2], [1, 3], [2, 5], [3, 7]);
    const lcmChoices = difficulty === 1 ? [6, 10, 12] : difficulty === 2 ? [12, 20, 30] : difficulty === 3 ? [30, 60, 84] : [60, 120, 168];
    const lcmBase = lcmChoices[randInt(rng, 0, lcmChoices.length - 1)];
    const ansRem = lcmBase + rem;
    const divLabel =
      lcmBase === 168 ? '6, 7, and 8' :
      lcmBase === 120 ? '5, 8, and 12' :
      lcmBase === 84 ? '4, 6, and 7' :
      lcmBase === 60 ? '3, 4, and 5' :
      lcmBase === 30 ? '2, 3, and 5' :
      lcmBase === 20 ? '4 and 5' :
      lcmBase === 10 ? '2 and 5' :
      lcmBase === 6 ? '2 and 3' : '3 and 4';
    pool.push(
      makeQuestion(
        `dyn-ch5-rem-${lcmBase}-${rem}`,
        1,
        'short-answer',
        `What is the smallest number > ${rem} that leaves a remainder of ${rem} when divided by ${divLabel}?`,
        `${ansRem}`,
        [`${lcmBase - rem}`, `${lcmBase * 2 + rem}`, `${lcmBase}`],
        `LCM is ${lcmBase}. Adding the common remainder ${rem} gives ${lcmBase} + ${rem} = ${ansRem}.`,
        'Module 5.3',
        rng,
        [`${ansRem}`]
      )
    );

    const gDigit = randInt(rng, 2, 9);
    const gRep = 111 * gDigit;
    const twoDigit = 37 * (gDigit % 2 === 0 ? 2 : 1);
    const multFactor = gRep / twoDigit;
    pool.push(
      makeQuestion(
        `dyn-ch5-crypt-${gDigit}`,
        1,
        'mcq',
        `In the repunit multiplication ${twoDigit} × k = ${gRep}, what single digit is k (using 111 = 37 × 3)?`,
        `k = ${multFactor}`,
        [`k = ${multFactor + 1}`, `k = ${multFactor - 1}`, `k = ${(multFactor + 3) % 9 + 1}`],
        `Since ${gRep} = ${gDigit} × 111 = ${gDigit} × 3 × 37 = ${twoDigit} × ${multFactor}, k = ${multFactor}.`,
        'Module 5.7',
        rng
      )
    );
  }

  if (chapterId === 'ch6-we-distribute' || chapterId === 'ch8-master-quiz' || chapterId === 'cellar-boss') {
    const baseRound = dRand([1, 1], [1, 1], [2, 3], [4, 9]) * 100;
    const offset = dRand([1, 4], [2, 9], [4, 14], [7, 19]);
    const low = baseRound - offset;
    const high = baseRound + offset;
    const diffProd = baseRound * baseRound - offset * offset;
    pool.push(
      makeQuestion(
        `dyn-ch6-diff-${baseRound}-${offset}`,
        1,
        'short-answer',
        `Using (a - b)(a + b) = a² - b², compute the exact product ${low} × ${high}.`,
        `${diffProd}`,
        [`${diffProd + 100}`, `${diffProd - (difficulty >= 3 ? 4 : 10)}`, `${baseRound * baseRound + offset * offset}`],
        `${low} × ${high} = (${baseRound} - ${offset})(${baseRound} + ${offset}) = ${(baseRound * baseRound).toLocaleString()} - ${offset}² = ${diffProd.toLocaleString()}.`,
        'Module 6.4',
        rng,
        [`${diffProd}`, diffProd.toLocaleString()]
      )
    );

    const sqAdd = dRand([1, 4], [1, 8], [6, 15], [12, 24]);
    const sqNum = baseRound + sqAdd;
    const sqAns = sqNum * sqNum;
    pool.push(
      makeQuestion(
        `dyn-ch6-sq-${baseRound}-${sqAdd}`,
        1,
        'short-answer',
        `Using (${baseRound} + ${sqAdd})² = ${baseRound}² + 2(${baseRound})(${sqAdd}) + ${sqAdd}², compute ${sqNum}².`,
        `${sqAns}`,
        [`${baseRound * baseRound + sqAdd * sqAdd}`, `${sqAns - 100}`, `${sqAns + (difficulty >= 3 ? 20 : 100)}`],
        `${(baseRound * baseRound).toLocaleString()} + ${(2 * baseRound * sqAdd).toLocaleString()} + ${sqAdd * sqAdd} = ${sqAns.toLocaleString()}.`,
        'Module 6.3',
        rng,
        [`${sqAns}`, sqAns.toLocaleString()]
      )
    );

    const n11 = dRand([12, 34], [21, 88], [105, 489], [512, 978]);
    const ans11 = n11 * 11;
    pool.push(
      makeQuestion(
        `dyn-ch6-mult11-${n11}`,
        1,
        'short-answer',
        `Using the neighbor-addition rule for ×11, compute ${n11} × 11.`,
        `${ans11}`,
        [`${ans11 - 10}`, `${ans11 + 10}`, `${n11 * 10 + 1}`],
        `${n11} × (10 + 1) = ${n11 * 10} + ${n11} = ${ans11}.`,
        'Module 6.5',
        rng,
        [`${ans11}`]
      )
    );

    const stepK = dRand([5, 14], [15, 45], [46, 120], [125, 350]);
    const tilesAns = 4 * stepK + 4;
    pool.push(
      makeQuestion(
        `dyn-ch6-pattern-${stepK}`,
        1,
        'mcq',
        `A square border pattern around a k × k grid has (k + 2)² - k² = 4k + 4 tiles. How many border tiles are in Step k = ${stepK}?`,
        `${tilesAns} tiles`,
        [`${4 * stepK} tiles`, `${tilesAns + 4} tiles`, `${stepK * stepK} tiles`],
        `At Step k = ${stepK}, 4(${stepK}) + 4 = ${tilesAns} tiles.`,
        'Module 6.7',
        rng
      )
    );
  }

  if (chapterId === 'ch7-proportional-1' || chapterId === 'ch8-master-quiz' || chapterId === 'cellar-boss') {
    const rA = dRand([1, 3], [2, 5], [3, 7], [5, 11]);
    const rB = rA + dRand([1, 3], [2, 4], [2, 6], [3, 8]);
    const partVal = dRand([1, 4], [2, 9], [8, 22], [18, 45]) * 100;
    const totalAmt = (rA + rB) * partVal;
    const largerShare = rB * partVal;
    pool.push(
      makeQuestion(
        `dyn-ch7-share-${rA}-${rB}-${partVal}`,
        1,
        'short-answer',
        `Divide ₹${totalAmt.toLocaleString()} between two partners in the ratio ${rA} : ${rB}. What is the LARGER share (in ₹)?`,
        `${largerShare}`,
        [`${rA * partVal}`, `${largerShare + partVal}`, `${totalAmt / 2}`],
        `Total parts = ${rA} + ${rB} = ${rA + rB}. 1 part = ₹${totalAmt} ÷ ${rA + rB} = ₹${partVal}. Larger share = ${rB} × ₹${partVal} = ₹${largerShare.toLocaleString()}.`,
        'Module 7.6',
        rng,
        [`${largerShare}`, largerShare.toLocaleString(), `₹${largerShare}`]
      )
    );

    const uRate = dRand([5, 12], [12, 35], [28, 65], [55, 125]);
    const q1 = dRand([2, 5], [4, 9], [7, 13], [9, 17]);
    const q2 = dRand([6, 10], [11, 18], [16, 27], [24, 43]);
    const cost1 = q1 * uRate;
    const cost2 = q2 * uRate;
    pool.push(
      makeQuestion(
        `dyn-ch7-trairasika-${q1}-${q2}-${uRate}`,
        1,
        'short-answer',
        `By Āryabhaṭa’s Trairāśika (Rule of Three), if ${q1} meters of fabric cost ₹${cost1}, what do ${q2} meters cost (in ₹)?`,
        `${cost2}`,
        [`${cost2 - uRate}`, `${cost2 + uRate}`, `${cost1 + q2}`],
        `Unit price = ₹${cost1} ÷ ${q1} = ₹${uRate}/m. For ${q2} m: ${q2} × ₹${uRate} = ₹${cost2}.`,
        'Module 7.4',
        rng,
        [`${cost2}`, `₹${cost2}`]
      )
    );

    const workers1 = difficulty >= 3 ? 12 : 6;
    const days1 = dRand([2, 5], [3, 8], [5, 14], [9, 25]) * 2;
    const workers2 = difficulty >= 3 ? 8 : 4;
    const days2 = (workers1 * days1) / workers2;
    pool.push(
      makeQuestion(
        `dyn-ch7-inv-${workers1}-${days1}`,
        1,
        'mcq',
        `If ${workers1} workers can complete a harvest in ${days1} days, how many days will ${workers2} workers take at the same pace?`,
        `${days2} days`,
        [`${days1 - 2} days`, `${days2 + 3} days`, `${(days1 * workers2) / workers1} days`],
        `Inverse proportion: Total work = ${workers1} × ${days1} = ${workers1 * days1} worker-days. With ${workers2} workers: ${workers1 * days1} ÷ ${workers2} = ${days2} days.`,
        'Module 7.7',
        rng
      )
    );
  }

  // Procedural questions for Part II chapters (Chapters 1 to 5 + 6 to 7)
  if (chapterId === 'ch4-fractions-disguise' || chapterId === 'part2-ch8-master-quiz' || chapterId === 'cellar-boss') {
    const basePrice = dRand([1, 4], [2, 9], [8, 22], [15, 45]) * 200;
    const discPct = (difficulty >= 3 ? [12, 15, 18, 25, 35] : [10, 20, 25, 50])[
      randInt(rng, 0, difficulty >= 3 ? 4 : 3)
    ];
    const salePrice = Math.round(basePrice * (1 - discPct / 100));
    pool.push(
      makeQuestion(
        `dyn-p2-disc-${basePrice}-${discPct}`,
        1,
        'short-answer',
        `A jacket marked at ₹${basePrice.toLocaleString()} is sold at a ${discPct}% discount. What is the sale price (in ₹)?`,
        `${salePrice}`,
        [`${basePrice - discPct}`, `${salePrice + 50}`, `${Math.round(basePrice * (1 + discPct / 100))}`],
        `Discount = ${discPct}% of ₹${basePrice} = ₹${basePrice - salePrice}. Sale price = ₹${salePrice}.`,
        'Module 1.6',
        rng,
        [`${salePrice}`, `₹${salePrice}`]
      )
    );

    const cpVal = dRand([1, 5], [4, 15], [12, 32], [25, 75]) * 100;
    const profPct = (difficulty >= 3 ? [12, 15, 18, 24, 32] : [10, 20, 25, 50])[
      randInt(rng, 0, difficulty >= 3 ? 4 : 3)
    ];
    const spVal = Math.round(cpVal * (1 + profPct / 100));
    pool.push(
      makeQuestion(
        `dyn-p2-profit-${cpVal}-${profPct}`,
        1,
        'short-answer',
        `A shopkeeper buys an item for ₹${cpVal.toLocaleString()} and sells it at a ${profPct}% profit. Find the selling price (in ₹).`,
        `${spVal}`,
        [`${cpVal + profPct}`, `${spVal - 40}`, `${Math.round(cpVal * (1 - profPct / 100))}`],
        `SP = CP × (1 + ${profPct}/100) = ₹${cpVal} × ${1 + profPct / 100} = ₹${spVal}.`,
        'Module 1.6',
        rng,
        [`${spVal}`, `₹${spVal}`]
      )
    );

    const billAmt = dRand([1, 4], [3, 12], [10, 24], [18, 50]) * 500;
    const gstRate = [5, 12, 18, 28][randInt(rng, 0, difficulty >= 3 ? 3 : 2)];
    const totalWithGst = Math.round(billAmt * (1 + gstRate / 100));
    pool.push(
      makeQuestion(
        `dyn-p2-gst-${billAmt}-${gstRate}`,
        1,
        'short-answer',
        `A restaurant bill before tax is ₹${billAmt.toLocaleString()}. If ${gstRate}% GST is added, what is the final bill amount (in ₹)?`,
        `${totalWithGst}`,
        [`${billAmt + gstRate}`, `${totalWithGst - 50}`, `${Math.round(billAmt * (1 - gstRate / 100))}`],
        `GST = ${gstRate}% of ₹${billAmt} = ₹${totalWithGst - billAmt}. Final bill = ₹${totalWithGst}.`,
        'Module 1.7',
        rng,
        [`${totalWithGst}`, `₹${totalWithGst}`]
      )
    );

    const pAmt = dRand([1, 2], [1, 5], [4, 12], [10, 30]) * 2000;
    const ratePct = difficulty === 4 ? 20 : 10;
    const factor = difficulty === 4 ? 1.44 : 1.21;
    const ciAns = Math.round(pAmt * factor);
    pool.push(
      makeQuestion(
        `dyn-p2-ci-${pAmt}-${ratePct}`,
        1,
        'mcq',
        `Find the compound amount after 2 years on ₹${pAmt.toLocaleString()} at ${ratePct}% per annum compounded annually.`,
        `₹${ciAns.toLocaleString()}`,
        [
          `₹${Math.round(pAmt * (1 + (2 * ratePct) / 100)).toLocaleString()}`,
          `₹${(ciAns + 100).toLocaleString()}`,
          `₹${Math.round(pAmt * (1 + ratePct / 100)).toLocaleString()}`,
        ],
        `A = P(1 + ${ratePct}/100)² = ₹${pAmt.toLocaleString()} × ${factor} = ₹${ciAns.toLocaleString()}.`,
        'Module 1.8',
        rng
      )
    );

    const hikePct = difficulty >= 3 ? 25 : 20;
    const multNum = hikePct === 25 ? 125 : 120;
    const revAfter = dRand([2, 6], [4, 16], [12, 35], [25, 80]) * multNum;
    const origBefore = (revAfter / multNum) * 100;
    pool.push(
      makeQuestion(
        `dyn-p2-rev-${revAfter}-${hikePct}`,
        1,
        'short-answer',
        `After a ${hikePct}% salary hike, an employee earns ₹${revAfter.toLocaleString()}. What was the original salary before the hike (in ₹)?`,
        `${origBefore}`,
        [`${Math.round(revAfter * (1 - hikePct / 100))}`, `${origBefore - 50}`, `${origBefore + 100}`],
        `Original × ${1 + hikePct / 100} = ₹${revAfter} ⇒ Original = ₹${revAfter} ÷ ${1 + hikePct / 100} = ₹${origBefore}.`,
        'Module 1.5',
        rng,
        [`${origBefore}`, `₹${origBefore}`]
      )
    );
  }

  if (chapterId === 'ch5-baudhayana-pythagoras' || chapterId === 'part2-ch8-master-quiz' || chapterId === 'cellar-boss') {
    const pTriples =
      difficulty === 1
        ? [[3, 4, 5], [6, 8, 10], [9, 12, 15]]
        : difficulty === 2
        ? [[6, 8, 10], [9, 12, 15], [8, 15, 17], [12, 16, 20]]
        : difficulty === 3
        ? [[5, 12, 13], [8, 15, 17], [7, 24, 25], [15, 20, 25], [10, 24, 26]]
        : [[7, 24, 25], [20, 21, 29], [12, 35, 37], [9, 40, 41], [16, 30, 34]];
    const [a, b, c] = pTriples[randInt(rng, 0, pTriples.length - 1)];
    pool.push(
      makeQuestion(
        `dyn-p2-pyth-${a}-${b}`,
        1,
        'short-answer',
        `In a right-angled triangle with perpendicular legs a = ${a} cm and b = ${b} cm, find the length of the hypotenuse c (in cm).`,
        `${c}`,
        [`${a + b}`, `${c - tightStep}`, `${c + tightStep}`],
        `By the Baudhāyana-Pythagoras Theorem, c = √(${a}² + ${b}²) = √(${a * a} + ${b * b}) = ${c} cm.`,
        'Module 2.3',
        rng,
        [`${c}`, `${c} cm`]
      )
    );

    const [legKnown, legMissing, hypKnown] = pTriples[randInt(rng, 0, pTriples.length - 1)];
    pool.push(
      makeQuestion(
        `dyn-p2-leg-${legKnown}-${hypKnown}`,
        1,
        'short-answer',
        `A ${hypKnown} m ladder leans against a vertical wall with its foot ${legKnown} m from the base. How high up the wall does it reach (in m)?`,
        `${legMissing}`,
        [`${hypKnown - legKnown}`, `${legMissing + tightStep}`, `${Math.max(1, legMissing - 1)}`],
        `Height b = √(${hypKnown}² - ${legKnown}²) = √(${hypKnown * hypKnown} - ${legKnown * legKnown}) = ${legMissing} m.`,
        'Module 2.5',
        rng,
        [`${legMissing}`, `${legMissing} m`]
      )
    );

    const sqSide = dRand([2, 8], [5, 18], [15, 42], [45, 120]);
    pool.push(
      makeQuestion(
        `dyn-p2-dvikarani-${sqSide}`,
        1,
        'mcq',
        `According to Baudhāyana’s dvikaraṇī rule, what is the exact diagonal of a square of side ${sqSide} cm?`,
        `${sqSide}√2 cm`,
        [`${2 * sqSide} cm`, `${sqSide}√3 cm`, `${sqSide * sqSide} cm`],
        `Diagonal d = √(${sqSide}² + ${sqSide}²) = √(2 × ${sqSide}²) = ${sqSide}√2 cm.`,
        'Module 2.1',
        rng
      )
    );

    const kScale = dRand([2, 4], [3, 7], [6, 14], [11, 29]);
    pool.push(
      makeQuestion(
        `dyn-p2-triple-scale-${kScale}`,
        1,
        'mcq',
        `Scaling the primitive Baudhāyana triple (3, 4, 5) by factor k = ${kScale} produces which right-angled triple?`,
        `(${3 * kScale}, ${4 * kScale}, ${5 * kScale})`,
        [
          `(${3 + kScale}, ${4 + kScale}, ${5 + kScale})`,
          `(${3 * kScale}, ${4 * kScale}, ${6 * kScale})`,
          `(${9 * kScale}, ${16 * kScale}, ${25 * kScale})`,
        ],
        `Multiplying each side of (3, 4, 5) by ${kScale} gives (${3 * kScale}, ${4 * kScale}, ${5 * kScale}).`,
        'Module 2.7',
        rng
      )
    );

    const nOdd = dRand([2, 5], [4, 11], [9, 18], [14, 28]);
    const seqHyp = nOdd;
    pool.push(
      makeQuestion(
        `dyn-p2-spiral-${nOdd}`,
        1,
        'mcq',
        `In the Theodorus spiral of right triangles where each new step adds a perpendicular leg of 1, what is the hypotenuse after ${seqHyp * seqHyp - 1} steps starting from √1?`,
        `√${seqHyp * seqHyp} = ${seqHyp}`,
        [`${seqHyp - 1}`, `${seqHyp + 1}`, `√${seqHyp}`],
        `Each step increases the radicand by 1, reaching √${seqHyp * seqHyp} = ${seqHyp}.`,
        'Module 2.6',
        rng
      )
    );
  }

  if (chapterId === 'ch6-proportional-reasoning' || chapterId === 'part2-ch8-master-quiz' || chapterId === 'cellar-boss') {
    const pctPool = difficulty <= 2 ? [10, 15, 20, 25, 30, 40, 50] : [12.5, 15, 22.5, 35, 45, 65];
    const slicePct = pctPool[randInt(rng, 0, pctPool.length - 1)];
    const centralAngle = Number(((slicePct * 360) / 100).toFixed(1));
    pool.push(
      makeQuestion(
        `dyn-p2-pie-${slicePct}`,
        1,
        'short-answer',
        `In a pie chart (360° circle), what is the central angle (in degrees) for a category representing ${slicePct}% of the total?`,
        `${centralAngle}`,
        [`${centralAngle + 18}`, `${slicePct * 3}`, `${Math.max(10, centralAngle - 18)}`],
        `${slicePct}% of 360° = (${slicePct} ÷ 100) × 360° = ${centralAngle}°.`,
        'Module 3.1',
        rng,
        [`${centralAngle}`, `${centralAngle}°`]
      )
    );

    const mapCm = dRand([2, 6], [3, 12], [8, 22], [15, 45]);
    const kmPerCm = (difficulty >= 3 ? [15, 25, 35, 75, 120] : [5, 10, 20, 25])[
      randInt(rng, 0, difficulty >= 3 ? 4 : 3)
    ];
    const realKm = mapCm * kmPerCm;
    pool.push(
      makeQuestion(
        `dyn-p2-map-${mapCm}-${kmPerCm}`,
        1,
        'short-answer',
        `On a map where 1 cm represents ${kmPerCm} km, two cities are ${mapCm} cm apart. What is the actual ground distance between them (in km)?`,
        `${realKm}`,
        [`${realKm + kmPerCm}`, `${mapCm + kmPerCm}`, `${realKm / 2}`],
        `Actual distance = ${mapCm} × ${kmPerCm} km = ${realKm} km.`,
        'Module 3.3',
        rng,
        [`${realKm}`, `${realKm} km`]
      )
    );

    const speed1 = difficulty >= 3 ? 75 : 60;
    const hrs1 = dRand([2, 4], [2, 6], [4, 12], [8, 16]);
    const dist = speed1 * hrs1;
    const speed2Pool = difficulty >= 3 ? [50, 100, 125] : [30, 40, 80, 90];
    const speed2 = speed2Pool[randInt(rng, 0, speed2Pool.length - 1)];
    const hrs2 = Number((dist / speed2).toFixed(2));
    pool.push(
      makeQuestion(
        `dyn-p2-inv-speed-${speed1}-${hrs1}-${speed2}`,
        1,
        'mcq',
        `A car traveling at ${speed1} km/h covers a journey in ${hrs1} hours (${dist} km). How long will the same journey take at ${speed2} km/h?`,
        `${hrs2} hours`,
        [`${hrs1 + 1} hours`, `${Number(((hrs1 * speed2) / speed1).toFixed(2))} hours`, `${Number((hrs2 + 1.5).toFixed(2))} hours`],
        `By inverse proportion, s₁t₁ = s₂t₂ ⇒ ${speed1} × ${hrs1} = ${speed2} × t₂ ⇒ t₂ = ${dist} ÷ ${speed2} = ${hrs2} hours.`,
        'Module 3.5',
        rng
      )
    );

    const men1 = difficulty >= 3 ? 12 : 8;
    const daysWork1 = dRand([2, 4], [3, 9], [6, 15], [10, 24]) * 3;
    const men2 = difficulty >= 3 ? 9 : 6;
    const daysWork2 = (men1 * daysWork1) / men2;
    pool.push(
      makeQuestion(
        `dyn-p2-pipes-${men1}-${daysWork1}`,
        1,
        'short-answer',
        `If ${men1} identical pumps can fill a reservoir in ${daysWork1} hours, how many hours will ${men2} pumps take?`,
        `${daysWork2}`,
        [`${daysWork1 - 2}`, `${daysWork2 + 4}`, `${(daysWork1 * men2) / men1}`],
        `Constant total pump-hours = ${men1} × ${daysWork1} = ${men1 * daysWork1}. With ${men2} pumps: ${men1 * daysWork1} ÷ ${men2} = ${daysWork2} hours.`,
        'Module 3.6',
        rng,
        [`${daysWork2}`, `${daysWork2} hours`]
      )
    );

    const r1 = difficulty >= 3 ? 3 : 2;
    const r2 = difficulty >= 3 ? 5 : 3;
    const r3 = difficulty >= 3 ? 7 : 5;
    const mult = dRand([1, 4], [2, 9], [8, 25], [20, 65]) * 100;
    const tot = (r1 + r2 + r3) * mult;
    pool.push(
      makeQuestion(
        `dyn-p2-split3-${r1}-${mult}`,
        1,
        'short-answer',
        `A prize of ₹${tot.toLocaleString()} is divided among 3 winners in the ratio ${r1} : ${r2} : ${r3}. What is the largest share (in ₹)?`,
        `${r3 * mult}`,
        [`${r2 * mult}`, `${r1 * mult}`, `${Math.round(tot / 3)}`],
        `Total parts = ${r1} + ${r2} + ${r3} = ${r1 + r2 + r3}. Largest share = (${r3}/${r1 + r2 + r3}) × ₹${tot.toLocaleString()} = ₹${(r3 * mult).toLocaleString()}.`,
        'Module 3.4',
        rng,
        [`${r3 * mult}`, `₹${r3 * mult}`]
      )
    );
  }

  if (chapterId === 'ch11-geometric-themes' || chapterId === 'part2-ch8-master-quiz' || chapterId === 'cellar-boss') {
    const stepF = dRand([1, 2], [2, 3], [3, 4], [4, 5]);
    const holes = Math.pow(8, stepF - 1);
    pool.push(
      makeQuestion(
        `dyn-p2-fractal-${stepF}`,
        1,
        'mcq',
        `In the Sierpinski Carpet fractal, each step multiplies the number of shaded sub-squares by 8 (8ⁿ). How many shaded sub-squares exist at Step n = ${stepF}?`,
        `${Math.pow(8, stepF).toLocaleString()}`,
        [`${(8 * stepF).toLocaleString()}`, `${holes.toLocaleString()}`, `${Math.pow(9, stepF).toLocaleString()}`],
        `At Step ${stepF}, there are 8^${stepF} = ${Math.pow(8, stepF).toLocaleString()} shaded sub-squares.`,
        'Module 4.2',
        rng
      )
    );

    const gStep = dRand([1, 3], [2, 5], [4, 7], [6, 9]);
    const gTris = Math.pow(3, gStep);
    pool.push(
      makeQuestion(
        `dyn-p2-gasket-${gStep}`,
        1,
        'short-answer',
        `In the Sierpinski Triangle (Gasket), how many upward-pointing shaded triangles exist at Step n = ${gStep} (using Tₙ = 3ⁿ)?`,
        `${gTris}`,
        [`${3 * gStep}`, `${Math.pow(4, gStep)}`, `${gTris - 3}`],
        `At Step ${gStep}, T_${gStep} = 3^${gStep} = ${gTris.toLocaleString()} upward triangles.`,
        'Module 4.2',
        rng,
        [`${gTris}`]
      )
    );

    const kStep = dRand([1, 2], [2, 4], [3, 5], [4, 6]);
    const kSides = 3 * Math.pow(4, kStep);
    pool.push(
      makeQuestion(
        `dyn-p2-koch-${kStep}`,
        1,
        'short-answer',
        `In the Koch Snowflake (where Step 0 has 3 sides and each side splits into 4 segments per step), how many sides are there at Step n = ${kStep}?`,
        `${kSides}`,
        [`${Math.pow(4, kStep)}`, `${3 * kStep * 4}`, `${kSides / 2}`],
        `S_${kStep} = 3 × 4^${kStep} = ${kSides.toLocaleString()} sides.`,
        'Module 4.3',
        rng,
        [`${kSides}`]
      )
    );

    const fFaces = dRand([4, 8], [6, 12], [12, 24], [24, 60]);
    const vVerts = dRand([4, 8], [6, 12], [12, 24], [24, 60]);
    const eEdges = fFaces + vVerts - 2;
    pool.push(
      makeQuestion(
        `dyn-p2-euler-${fFaces}-${vVerts}`,
        1,
        'short-answer',
        `By Euler’s Polyhedron Formula (F + V − E = 2), if a convex polyhedron has F = ${fFaces} faces and V = ${vVerts} vertices, how many edges E does it have?`,
        `${eEdges}`,
        [`${fFaces + vVerts}`, `${eEdges + 2}`, `${eEdges - 2}`],
        `E = F + V − 2 = ${fFaces} + ${vVerts} − 2 = ${eEdges} edges.`,
        'Module 4.4',
        rng,
        [`${eEdges}`]
      )
    );

    const hPeak1 = dRand([2, 4], [3, 6], [5, 10], [8, 16]);
    const hPeak2 = dRand([1, hPeak1], [2, hPeak1], [3, hPeak1], [4, hPeak1]);
    const minCubes = hPeak1 + hPeak2 + 2;
    pool.push(
      makeQuestion(
        `dyn-p2-voxel-${hPeak1}-${hPeak2}`,
        1,
        'short-answer',
        `A 3D unit-cube building covers all 4 squares of a 2×2 Top View grid. Both its Front View and Side View show column heights of (${hPeak1}, ${hPeak2}). What is the MINIMUM number of unit cubes needed?`,
        `${minCubes}`,
        [`${hPeak1 + 3 * hPeak2}`, `${minCubes + 2}`, `${hPeak1 + hPeak2}`],
        `Placing ${hPeak1} and ${hPeak2} on the diagonal and 1 cube in each of the other two cells gives ${hPeak1} + ${hPeak2} + 1 + 1 = ${minCubes} cubes.`,
        'Module 4.7',
        rng,
        [`${minCubes}`]
      )
    );
  }

  if (chapterId === 'ch12-dots-and-lines' || chapterId === 'part2-ch8-master-quiz' || chapterId === 'cellar-boss') {
    const targetMean = dRand([10, 25], [20, 50], [45, 95], [110, 260]);
    const d1 = dRand([1, 4], [2, 8], [6, 17], [15, 42]);
    const d2 = dRand([2, 5], [3, 9], [8, 23], [20, 55]);
    const x1 = targetMean - d1;
    const x2 = targetMean - d2;
    const x3 = targetMean + d1;
    const x4 = targetMean + d2;
    pool.push(
      makeQuestion(
        `dyn-p2-mean-${targetMean}-${d1}`,
        1,
        'short-answer',
        `Find the arithmetic mean (balance point) of the four data values: ${x1}, ${x2}, ${x3}, ${x4}.`,
        `${targetMean}`,
        [`${targetMean + tightStep}`, `${targetMean - tightStep}`, `${targetMean + 4}`],
        `The values are symmetrically balanced (±${d1} and ±${d2}) around ${targetMean}, so their mean is ${targetMean}.`,
        'Module 5.1',
        rng,
        [`${targetMean}`]
      )
    );

    const medMid = dRand([10, 22], [18, 45], [40, 88], [95, 220]);
    const mArr = [medMid - 7, medMid - 3, medMid, medMid + 4, medMid + (difficulty >= 3 ? 39 : 19)];
    pool.push(
      makeQuestion(
        `dyn-p2-median-${medMid}`,
        1,
        'short-answer',
        `Find the median of the sorted dataset: [${mArr.join(', ')}].`,
        `${medMid}`,
        [`${medMid - 3}`, `${medMid + 4}`, `${(mArr.reduce((a, b) => a + b, 0) / 5).toFixed(1)}`],
        `For 5 sorted values, the median is the 3rd (middle) value = ${medMid}.`,
        'Module 5.2',
        rng,
        [`${medMid}`]
      )
    );

    const q1Val = dRand([10, 25], [20, 40], [35, 75], [80, 160]);
    const iqrVal = dRand([6, 14], [12, 28], [22, 48], [35, 85]);
    const q3Val = q1Val + iqrVal;
    pool.push(
      makeQuestion(
        `dyn-p2-iqr-${q1Val}-${q3Val}`,
        1,
        'short-answer',
        `In a box-and-whisker plot, if the Lower Quartile Q₁ = ${q1Val} and the Upper Quartile Q₃ = ${q3Val}, what is the Interquartile Range (IQR)?`,
        `${iqrVal}`,
        [`${(q1Val + q3Val) / 2}`, `${q3Val}`, `${iqrVal + 5}`],
        `IQR = Q₃ - Q₁ = ${q3Val} - ${q1Val} = ${iqrVal}.`,
        'Module 5.4',
        rng,
        [`${iqrVal}`]
      )
    );

    const cStart = dRand([6, 16], [10, 30], [24, 60], [50, 120]);
    const cEnd = cStart + dRand([8, 20], [12, 36], [24, 68], [44, 124]);
    const cRise = cEnd - cStart;
    pool.push(
      makeQuestion(
        `dyn-p2-line-${cStart}-${cEnd}`,
        1,
        'mcq',
        `On a time-series line graph, a plant’s height rises from ${cStart} cm in Week 1 to ${cEnd} cm in Week 5. What is its average weekly growth rate?`,
        `${(cRise / 4).toFixed(1)} cm/week`,
        [`${(cRise / 5).toFixed(1)} cm/week`, `${cRise} cm/week`, `${(cEnd / 5).toFixed(1)} cm/week`],
        `Over 4 week-intervals (Week 1 to Week 5), growth = (${cEnd} - ${cStart}) ÷ 4 = ${(cRise / 4).toFixed(1)} cm/week.`,
        'Module 5.6',
        rng
      )
    );

    const cellCnt = dRand([4, 6], [5, 10], [8, 16], [12, 25]);
    const avgCell = dRand([8, 18], [12, 30], [28, 65], [55, 145]);
    const sumCell = cellCnt * avgCell;
    pool.push(
      makeQuestion(
        `dyn-p2-sheet-${cellCnt}-${avgCell}`,
        1,
        'short-answer',
        `In a spreadsheet, if =SUM(B1:B${cellCnt}) returns ${sumCell}, what value will =AVERAGE(B1:B${cellCnt}) return?`,
        `${avgCell}`,
        [`${avgCell + tightStep}`, `${sumCell}`, `${avgCell - tightStep}`],
        `=AVERAGE divides the sum (${sumCell}) by the count of cells (${cellCnt}): ${sumCell} ÷ ${cellCnt} = ${avgCell}.`,
        'Module 5.3',
        rng,
        [`${avgCell}`]
      )
    );
  }

  if (chapterId === 'ch13-algebra-play' || chapterId === 'part2-ch8-master-quiz' || chapterId === 'cellar-boss') {
    const pA = dRand([1, 6], [3, 12], [11, 28], [25, 65]);
    const pB = dRand([2, 7], [4, 15], [14, 34], [30, 80]);
    const pC = dRand([1, 5], [2, 11], [9, 25], [20, 60]);
    const pTop = pA + 2 * pB + pC;
    pool.push(
      makeQuestion(
        `dyn-p2-pyramid-${pA}-${pB}-${pC}`,
        1,
        'short-answer',
        `In a 3-row Number Pyramid with base row [${pA}, ${pB}, ${pC}], what is the top apex number (using Top = a + 2b + c)?`,
        `${pTop}`,
        [`${pA + pB + pC}`, `${pTop - pB}`, `${pTop + pB}`],
        `Middle row is [${pA + pB}, ${pB + pC}], so Top = ${pA} + 2(${pB}) + ${pC} = ${pTop}.`,
        'Module 6.3',
        rng,
        [`${pTop}`]
      )
    );

    const kConst = dRand([2, 8], [4, 15], [12, 32], [25, 75]);
    const multTrick = dRand([2, 3], [2, 5], [4, 9], [6, 14]);
    pool.push(
      makeQuestion(
        `dyn-p2-thinknum-${kConst}-${multTrick}`,
        1,
        'short-answer',
        `A math trick says: "Pick any number x, multiply by ${multTrick}, add ${multTrick * kConst}, divide by ${multTrick}, then subtract your original number x." What constant answer do you always get?`,
        `${kConst}`,
        [`${multTrick * kConst}`, `${kConst + multTrick}`, `${kConst - 1}`],
        `(${multTrick}x + ${multTrick * kConst}) ÷ ${multTrick} − x = (x + ${kConst}) − x = ${kConst}.`,
        'Module 6.1',
        rng,
        [`${kConst}`]
      )
    );

    const bMonth = randInt(rng, 2, 12);
    const bDay = randInt(rng, 10, 28);
    const shubhamOut = 100 * bMonth + bDay + 165;
    pool.push(
      makeQuestion(
        `dyn-p2-bday-${bMonth}-${bDay}`,
        1,
        'mcq',
        `In Shubham’s birthday trick (Result = 100M + D + 165), if the student’s final number is ${shubhamOut}, what is their birth month M and day D?`,
        `Month ${bMonth}, Day ${bDay}`,
        [
          `Month ${bMonth}, Day ${Math.max(1, bDay - 5)}`,
          `Month ${Math.min(12, bMonth + 1)}, Day ${bDay}`,
          `Month ${bMonth - 1}, Day ${bDay + 10}`,
        ],
        `Subtract 165: ${shubhamOut} − 165 = ${100 * bMonth + bDay} ⇒ Month M = ${bMonth} and Day D = ${bDay}.`,
        'Module 6.2',
        rng
      )
    );

    const calCenter = randInt(rng, 9, 22);
    const calSum = 9 * calCenter;
    pool.push(
      makeQuestion(
        `dyn-p2-cal9-${calCenter}`,
        1,
        'short-answer',
        `On a standard 7-column calendar grid, a 3×3 square of 9 dates has center date ${calCenter}. What is the sum of all 9 dates in that 3×3 square?`,
        `${calSum}`,
        [`${8 * calCenter}`, `${calSum + 7}`, `${calSum - 9}`],
        `All ±1 and ±7 offsets around the center cancel pairwise, leaving 9 × ${calCenter} = ${calSum}.`,
        'Module 6.6',
        rng,
        [`${calSum}`]
      )
    );
  }

  if (chapterId === 'ch14-area' || chapterId === 'part2-ch8-master-quiz' || chapterId === 'cellar-boss') {
    const b1 = dRand([4, 9], [8, 16], [14, 28], [25, 55]);
    const b2 = dRand([6, 12], [10, 20], [18, 36], [32, 75]);
    const h = dRand([2, 4], [3, 8], [6, 14], [10, 24]) * 2;
    const trapArea = 0.5 * h * (b1 + b2);
    pool.push(
      makeQuestion(
        `dyn-p2-trap-${b1}-${b2}-${h}`,
        1,
        'short-answer',
        `Find the area (in cm²) of a trapezium with parallel bases a = ${b1} cm and b = ${b2} cm, and perpendicular height h = ${h} cm.`,
        `${trapArea}`,
        [`${h * (b1 + b2)}`, `${trapArea + h}`, `${b1 * b2}`],
        `Area = ½ × h × (a + b) = ½ × ${h} × (${b1} + ${b2}) = ${trapArea} cm².`,
        'Module 7.6',
        rng,
        [`${trapArea}`, `${trapArea} cm²`]
      )
    );

    const d1R = dRand([3, 7], [6, 16], [12, 26], [22, 45]) * 2;
    const d2R = dRand([3, 6], [5, 14], [10, 24], [18, 40]) * 2;
    const rhomArea = 0.5 * d1R * d2R;
    pool.push(
      makeQuestion(
        `dyn-p2-rhom-area-${d1R}-${d2R}`,
        1,
        'short-answer',
        `Find the area (in cm²) of a rhombus whose perpendicular diagonals measure d₁ = ${d1R} cm and d₂ = ${d2R} cm.`,
        `${rhomArea}`,
        [`${d1R * d2R}`, `${d1R + d2R}`, `${rhomArea / 2}`],
        `Area of a rhombus = ½ × d₁ × d₂ = ½ × ${d1R} × ${d2R} = ${rhomArea} cm².`,
        'Module 7.5',
        rng,
        [`${rhomArea}`, `${rhomArea} cm²`]
      )
    );

    const triB = dRand([3, 8], [6, 16], [14, 28], [24, 52]) * 2;
    const triH = dRand([3, 7], [5, 15], [12, 27], [22, 48]);
    const triArea = 0.5 * triB * triH;
    pool.push(
      makeQuestion(
        `dyn-p2-tri-area-${triB}-${triH}`,
        1,
        'short-answer',
        `An obtuse triangle has base b = ${triB} cm and external perpendicular altitude h = ${triH} cm. What is its area (in cm²)?`,
        `${triArea}`,
        [`${triB * triH}`, `${triArea + triB}`, `${triB + triH}`],
        `Area of any triangle = ½ × base × perpendicular altitude = ½ × ${triB} × ${triH} = ${triArea} cm².`,
        'Module 7.2',
        rng,
        [`${triArea}`, `${triArea} cm²`]
      )
    );

    const diagD = dRand([3, 7], [6, 15], [12, 25], [20, 45]) * 2;
    const off1 = dRand([2, 6], [4, 12], [9, 21], [16, 38]);
    const off2 = dRand([3, 7], [5, 14], [10, 24], [18, 42]);
    const quadArea = 0.5 * diagD * (off1 + off2);
    pool.push(
      makeQuestion(
        `dyn-p2-quad-offset-${diagD}-${off1}-${off2}`,
        1,
        'short-answer',
        `A quadrilateral field has diagonal d = ${diagD} m, and perpendicular offsets from the opposite corners to this diagonal are h₁ = ${off1} m and h₂ = ${off2} m. Find the area of the field (in m²).`,
        `${quadArea}`,
        [`${diagD * (off1 + off2)}`, `${quadArea + diagD}`, `${diagD * off1}`],
        `Area = ½ × d × (h₁ + h₂) = ½ × ${diagD} × (${off1} + ${off2}) = ${quadArea} m².`,
        'Module 7.7',
        rng,
        [`${quadArea}`, `${quadArea} m²`]
      )
    );

    const paraB = dRand([4, 10], [9, 22], [18, 38], [32, 75]);
    const paraH = dRand([3, 7], [5, 14], [11, 25], [22, 48]);
    const paraArea = paraB * paraH;
    pool.push(
      makeQuestion(
        `dyn-p2-para-area-${paraB}-${paraH}`,
        1,
        'short-answer',
        `A parallelogram has base b = ${paraB} cm and perpendicular altitude h = ${paraH} cm. What is its area (in cm²)?`,
        `${paraArea}`,
        [`${0.5 * paraArea}`, `${2 * (paraB + paraH)}`, `${paraArea + paraB}`],
        `Area of a parallelogram = base × perpendicular height = ${paraB} × ${paraH} = ${paraArea} cm².`,
        'Module 7.4',
        rng,
        [`${paraArea}`, `${paraArea} cm²`]
      )
    );
  }

  return pool;
}

const THIRTY_QUESTION_CHAPTERS = new Set<string>([
  'ch8-master-quiz',
  'part2-ch8-master-quiz',
  'cellar-boss',
]);

const TWENTY_QUESTION_CHAPTERS = new Set<string>([
  'ch4-fractions-disguise',
  'ch5-baudhayana-pythagoras',
  'ch6-proportional-reasoning',
  'ch11-geometric-themes',
  'ch14-area',
  'ch12-dots-and-lines',
]);

export function generateDynamicChapterQuiz(
  chapterId: ChapterId | 'ch8-master-quiz' | 'part2-ch8-master-quiz' | 'cellar-boss',
  staticPool: ChapterAssessmentQuestion[],
  seed: number,
  targetCount = 10,
  difficulty: QuizDifficultyLevel = 2
): ChapterAssessmentQuestion[] {
  const rng = seededRandom(seed * 7919 + chapterId.length * 131 + difficulty * 3571 + 17);

  // Shuffle options inside every static question so even conceptual questions have different option orders each time
  const reshuffledStatic: Omit<ChapterAssessmentQuestion, 'questionNumber'>[] = staticPool.map((q, idx) => {
    const { shuffled, newCorrectIndex } = shuffleWithCorrect(q.options, q.correctIndex, rng);
    return {
      ...q,
      id: `${q.id}-seed-${seed}-d${difficulty}-${idx}`,
      options: shuffled,
      correctIndex: newCorrectIndex,
    };
  });

  const count = THIRTY_QUESTION_CHAPTERS.has(chapterId)
    ? 30
    : TWENTY_QUESTION_CHAPTERS.has(chapterId)
      ? 20
      : targetCount;

  if (difficulty !== 2) {
    const seen = new Set<string>();
    const tieredCollected: Omit<ChapterAssessmentQuestion, 'questionNumber'>[] = [];
    const maxTieredSweeps = THIRTY_QUESTION_CHAPTERS.has(chapterId) ? 6 : 24;
    for (let s = 0; s < maxTieredSweeps && tieredCollected.length < count + 8; s++) {
      const sRng = seededRandom(seed * 7919 + s * 104729 + chapterId.length * 131 + difficulty * 3571 + 17);
      const batch = generateProceduralPoolForChapter(chapterId, sRng, difficulty);
      for (const item of batch) {
        const key = item.prompt.trim().toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          tieredCollected.push(item);
        }
      }
    }

    if (tieredCollected.length < count) {
      const rankedStatic = prioritizeByDifficulty(reshuffledStatic, difficulty, rng);
      for (const item of rankedStatic) {
        if (tieredCollected.length >= count) break;
        const key = item.prompt.trim().toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          tieredCollected.push(item);
        }
      }
    }

    for (let i = tieredCollected.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [tieredCollected[i], tieredCollected[j]] = [tieredCollected[j], tieredCollected[i]];
    }

    return tieredCollected.slice(0, count).map((q, idx) => ({
      ...q,
      questionNumber: idx + 1,
    }));
  }

  const proceduralPool = generateProceduralPoolForChapter(chapterId, rng, difficulty);
  const extraProceduralPool = THIRTY_QUESTION_CHAPTERS.has(chapterId)
    ? generateProceduralPoolForChapter(
        chapterId,
        seededRandom(seed * 104729 + difficulty * 997 + 97),
        difficulty
      ).map((q, idx) => ({
        ...q,
        id: `${q.id}-extra-${idx}`,
      }))
    : [];

  // Standard Difficulty (2): combine procedural questions and reshuffled static curriculum questions
  const combined = [...proceduralPool, ...reshuffledStatic, ...extraProceduralPool];
  const prioritized = prioritizeByDifficulty(combined, difficulty, rng);

  return prioritized.slice(0, count).map((q, idx) => ({
    ...q,
    questionNumber: idx + 1,
  }));
}

export function generateBookWideBossQuestions(
  staticPool: ChapterAssessmentQuestion[],
  seed: number,
  count = 30,
  difficulty: QuizDifficultyLevel = 2
): ChapterAssessmentQuestion[] {
  return generateDynamicChapterQuiz('cellar-boss', staticPool, seed, count, difficulty).slice(0, count);
}

export interface TrickyTextbookQuestion extends ChapterAssessmentQuestion {
  sourceChapterId: ChapterId;
}

/**
 * Generates an always-different 20-question Tricky Textbook Quiz drawn strictly
 * from the student's chosen chapters (`selectedChapterIds`), scaled in complexity
 * to `difficulty` (1=Foundation .. 4=Olympiad).
 */
export function generateMultiChapterTrickyQuiz(
  selectedChapterIds: ChapterId[],
  seed: number,
  staticByChapter: Partial<Record<ChapterId, ChapterAssessmentQuestion[]>> = {},
  totalCount = 20,
  difficulty: QuizDifficultyLevel = 2
): TrickyTextbookQuestion[] {
  const validChapters = Array.from(new Set(selectedChapterIds)).filter(Boolean);
  if (validChapters.length === 0) return [];

  const seenPrompts = new Set<string>();
  const collectedByChapter = new Map<ChapterId, TrickyTextbookQuestion[]>();
  validChapters.forEach((chId) => collectedByChapter.set(chId, []));

  // Run multi-sweep extraction per chapter so even 1 single selected chapter reaches 20 unique items at any difficulty
  const maxSweeps = validChapters.length === 1 ? 24 : 8;
  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    for (let cIdx = 0; cIdx < validChapters.length; cIdx++) {
      const chId = validChapters[cIdx];
      const rng = seededRandom(
        seed * 7919 + sweep * 104729 + cIdx * 997 + chId.length * 131 + difficulty * 3571 + 19
      );

      const procedural = generateProceduralPoolForChapter(chId, rng, difficulty).map((q, qIdx) => ({
        ...q,
        id: `tricky-${chId}-d${difficulty}-s${seed}-w${sweep}-p${qIdx}`,
        questionNumber: 1,
        sourceChapterId: chId,
      }));

      // Only blend baseline static textbook questions in Standard (2); Foundation (1) and Olympiad (4) stay strictly tiered
      const staticList =
        difficulty === 2 && sweep === 0 && Array.isArray(staticByChapter[chId])
          ? (staticByChapter[chId] || []).map((q, qIdx) => {
              const { shuffled, newCorrectIndex } = shuffleWithCorrect(
                q.options,
                q.correctIndex,
                rng
              );
              return {
                ...q,
                id: `tricky-${chId}-d${difficulty}-s${seed}-st${qIdx}`,
                options: shuffled,
                correctIndex: newCorrectIndex,
                sourceChapterId: chId,
              };
            })
          : [];

      const candidates =
        difficulty === 2
          ? prioritizeByDifficulty([...procedural, ...staticList], difficulty, rng)
          : procedural;

      const bucket = collectedByChapter.get(chId)!;
      for (const item of candidates) {
        const norm = item.prompt.trim().toLowerCase();
        if (!seenPrompts.has(norm)) {
          seenPrompts.add(norm);
          bucket.push(item);
        }
      }
    }
  }

  // Round-robin pick across chosen chapters so every chosen chapter gets fair representation up to 20
  const selected: TrickyTextbookQuestion[] = [];
  let roundIdx = 0;
  while (selected.length < totalCount) {
    let addedInRound = false;
    for (const chId of validChapters) {
      if (selected.length >= totalCount) break;
      const bucket = collectedByChapter.get(chId)!;
      if (roundIdx < bucket.length) {
        selected.push(bucket[roundIdx]);
        addedInRound = true;
      }
    }
    if (!addedInRound) break;
    roundIdx++;
  }

  // Shuffle the final 20 questions using the seed so order varies too
  const finalRng = seededRandom(seed * 31337 + validChapters.length * 73 + difficulty * 199);
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(finalRng() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  return selected.slice(0, totalCount).map((q, idx) => ({
    ...q,
    questionNumber: idx + 1,
  }));
}

