import { ChapterAssessmentQuestion } from '../types/part1Curriculum';
import { ChapterId } from '../types/math';

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
  chapterId: ChapterId | 'ch8-master-quiz',
  rng: () => number
): Omit<ChapterAssessmentQuestion, 'questionNumber'>[] {
  const pool: Omit<ChapterAssessmentQuestion, 'questionNumber'>[] = [];

  if (chapterId === 'ch1-square-cube' || chapterId === 'ch8-master-quiz') {
    const oddCount = randInt(rng, 11, 28);
    const oddLast = 2 * oddCount - 1;
    const oddSum = oddCount * oddCount;
    pool.push(
      makeQuestion(
        `dyn-ch1-odd-${oddCount}`,
        1,
        'short-answer',
        `Find the exact sum of the first ${oddCount} consecutive odd numbers: 1 + 3 + 5 + … + ${oddLast}.`,
        `${oddSum}`,
        [`${(oddCount - 1) * (oddCount - 1)}`, `${(oddCount + 1) * (oddCount + 1)}`, `${oddSum + oddCount}`],
        `The sum of the first n consecutive odd numbers is always n². Here n = ${oddCount}, so ${oddCount}² = ${oddSum}.`,
        'Module 1.3',
        rng,
        [`${oddSum}`, `${oddCount}^2`]
      )
    );

    const nBetween = randInt(rng, 14, 35);
    const betweenAns = 2 * nBetween;
    pool.push(
      makeQuestion(
        `dyn-ch1-between-${nBetween}`,
        1,
        'mcq',
        `How many natural numbers lie strictly between ${nBetween}² (${nBetween * nBetween}) and ${nBetween + 1}² (${(nBetween + 1) * (nBetween + 1)})?`,
        `${betweenAns}`,
        [`${nBetween}`, `${betweenAns + 1}`, `${betweenAns + 2}`],
        `Strictly between n² and (n+1)² there are exactly 2n natural numbers: 2 × ${nBetween} = ${betweenAns}.`,
        'Module 1.3',
        rng
      )
    );

    const sqRoot = randInt(rng, 21, 64);
    const sqVal = sqRoot * sqRoot;
    pool.push(
      makeQuestion(
        `dyn-ch1-sqrt-${sqRoot}`,
        1,
        'short-answer',
        `Find the exact square root of ${sqVal.toLocaleString()} (√${sqVal}).`,
        `${sqRoot}`,
        [`${sqRoot - 2}`, `${sqRoot + 2}`, `${sqRoot + 4}`],
        `Since ${sqRoot} × ${sqRoot} = ${sqVal.toLocaleString()}, √${sqVal} = ${sqRoot}.`,
        'Module 1.4',
        rng,
        [`${sqRoot}`]
      )
    );

    const cbRoot = randInt(rng, 12, 32);
    const cbVal = cbRoot * cbRoot * cbRoot;
    pool.push(
      makeQuestion(
        `dyn-ch1-cbrt-${cbRoot}`,
        1,
        'short-answer',
        `Using the 3-digit split method, find the exact cube root of ${cbVal.toLocaleString()} (∛${cbVal}).`,
        `${cbRoot}`,
        [`${cbRoot - 2}`, `${cbRoot + 2}`, `${cbRoot + 10}`],
        `Splitting ${cbVal.toLocaleString()} gives tens digit ${Math.floor(cbRoot / 10)} and units digit ${cbRoot % 10}, so ∛${cbVal} = ${cbRoot}.`,
        'Module 1.7',
        rng,
        [`${cbRoot}`]
      )
    );

    const lockerLimit = randInt(rng, 5, 15) * 20;
    const openCount = Math.floor(Math.sqrt(lockerLimit));
    pool.push(
      makeQuestion(
        `dyn-ch1-lockers-${lockerLimit}`,
        1,
        'mcq',
        `In a corridor of ${lockerLimit} royal lockers toggled by ${lockerLimit} people, how many lockers remain OPEN at the end?`,
        `${openCount} lockers`,
        [`${openCount - 2} lockers`, `${openCount + 2} lockers`, `${lockerLimit / 10} lockers`],
        `Only perfect square lockers ≤ ${lockerLimit} stay open. Since ${openCount}² = ${openCount * openCount} ≤ ${lockerLimit}, ${openCount} lockers stay open.`,
        'Module 1.1',
        rng
      )
    );
  }

  if (chapterId === 'ch2-power-play' || chapterId === 'ch8-master-quiz') {
    const folds = randInt(rng, 6, 11);
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

    const baseP = randInt(rng, 3, 9);
    const expA = randInt(rng, 4, 9);
    const expB = randInt(rng, 3, 7);
    const expSum = expA + expB;
    const xAns = randInt(rng, 3, 8);
    const totalExp = expSum + xAns;
    pool.push(
      makeQuestion(
        `dyn-ch2-law-${baseP}-${xAns}`,
        1,
        'short-answer',
        `Find the value of x that satisfies: ${baseP}^${expA} × ${baseP}^x ÷ ${baseP}^${expB} = ${baseP}^${totalExp - expB}.`,
        `${expSum + xAns - expA}`,
        [`${expSum + xAns - expA + 2}`, `${expSum + xAns - expA - 1}`, `${expA + expB}`],
        `Using the Product and Quotient Laws: ${expA} + x - ${expB} = ${totalExp - expB} ⇒ x = ${totalExp - expA}.`,
        'Module 2.3',
        rng,
        [`${totalExp - expA}`]
      )
    );

    const negBase = randInt(rng, 2, 6);
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

    const mant = randInt(rng, 12, 95) / 10;
    const zeros = randInt(rng, 5, 9);
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
  }

  if (chapterId === 'ch3-story-numbers' || chapterId === 'ch8-master-quiz') {
    const b2 = randInt(rng, 1, 4);
    const b1 = randInt(rng, 0, 4);
    const b0 = randInt(rng, 1, 4);
    const decVal = b2 * 25 + b1 * 5 + b0;
    pool.push(
      makeQuestion(
        `dyn-ch3-base5-${decVal}`,
        1,
        'short-answer',
        `In a Base-5 system (with landmark blocks of 25, 5, and 1), what decimal number is represented by (${b2}${b1}${b0})₅?`,
        `${decVal}`,
        [`${decVal + 5}`, `${decVal - 5}`, `${b2 * 100 + b1 * 10 + b0}`],
        `(${b2} × 25) + (${b1} × 5) + (${b0} × 1) = ${b2 * 25} + ${b1 * 5} + ${b0} = ${decVal}.`,
        'Module 3.5',
        rng,
        [`${decVal}`]
      )
    );

    const sixties = randInt(rng, 2, 8);
    const ones = randInt(rng, 11, 55);
    const babTotal = sixties * 60 + ones;
    pool.push(
      makeQuestion(
        `dyn-ch3-bab-${babTotal}`,
        1,
        'short-answer',
        `Evaluate the Mesopotamian Base-60 positional number [${sixties} : ${ones}]₆₀ (${sixties} in the 60s place and ${ones} in the 1s place).`,
        `${babTotal}`,
        [`${babTotal - 60}`, `${babTotal + 20}`, `${sixties * 100 + ones}`],
        `In Base-60, [${sixties} : ${ones}]₆₀ = ${sixties} × 60 + ${ones} = ${sixties * 60} + ${ones} = ${babTotal}.`,
        'Module 3.6',
        rng,
        [`${babTotal}`]
      )
    );

    const bodyRight = randInt(rng, 2, 12);
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

  if (chapterId === 'ch4-quadrilaterals' || chapterId === 'ch8-master-quiz') {
    const a1 = randInt(rng, 65, 95);
    const a2 = randInt(rng, 80, 115);
    const a3 = randInt(rng, 70, 105);
    const a4 = 360 - (a1 + a2 + a3);
    pool.push(
      makeQuestion(
        `dyn-ch4-angles-${a1}-${a2}-${a3}`,
        1,
        'short-answer',
        `Three interior angles of a quadrilateral measure ${a1}°, ${a2}°, and ${a3}°. Find the measure of the fourth angle (in degrees).`,
        `${a4}`,
        [`${a4 + 10}`, `${a4 - 10}`, `${180 - a1}`],
        `The four interior angles of any quadrilateral sum to 360°: 360° - (${a1}° + ${a2}° + ${a3}°) = ${a4}°.`,
        'Module 4.4',
        rng,
        [`${a4}`, `${a4}°`]
      )
    );

    const pAngle = randInt(rng, 48, 86);
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
          `∠B = ${90 - pAngle / 2}° and ∠C = ${pAngle}°`,
          `∠B = ${pSupp - 10}° and ∠C = ${pAngle + 10}°`,
        ],
        `In a parallelogram, adjacent angles sum to 180° (180° - ${pAngle}° = ${pSupp}°) and opposite angles are equal (∠C = ∠A = ${pAngle}°).`,
        'Module 4.5',
        rng
      )
    );

    const triples = [
      [6, 8, 10],
      [5, 12, 13],
      [8, 15, 17],
      [9, 12, 15],
      [12, 16, 20],
    ];
    const [h1, h2, side] = triples[randInt(rng, 0, triples.length - 1)];
    pool.push(
      makeQuestion(
        `dyn-ch4-rhombus-${h1}-${h2}`,
        1,
        'short-answer',
        `The diagonals of a rhombus measure ${2 * h1} cm and ${2 * h2} cm. Find the length of one side of the rhombus (in cm).`,
        `${side}`,
        [`${h1 + h2}`, `${side + 2}`, `${2 * side}`],
        `The diagonals bisect each other at 90° into half-diagonals of ${h1} cm and ${h2} cm. Side = √(${h1}² + ${h2}²) = ${side} cm.`,
        'Module 4.6',
        rng,
        [`${side}`, `${side} cm`]
      )
    );
  }

  if (chapterId === 'ch5-number-play' || chapterId === 'ch8-master-quiz') {
    const d1 = randInt(rng, 2, 8);
    const d2 = randInt(rng, 1, 7);
    const d3 = randInt(rng, 2, 8);
    const d4 = randInt(rng, 1, 7);
    const partialSum = d1 + d2 + d3 + d4;
    const nextMult9 = Math.ceil((partialSum + 1) / 9) * 9;
    const missingX = nextMult9 - partialSum;
    pool.push(
      makeQuestion(
        `dyn-ch5-div9-${d1}${d2}${d3}${d4}`,
        1,
        'short-answer',
        `Find the missing single digit X so that the 5-digit number ${d1}${d2}X${d3}${d4} is divisible by 9.`,
        `${missingX}`,
        [`${(missingX + 2) % 10}`, `${(missingX + 4) % 10}`, `${(missingX + 5) % 10}`],
        `Sum of known digits = ${d1} + ${d2} + ${d3} + ${d4} = ${partialSum}. The next multiple of 9 is ${nextMult9}, so X = ${nextMult9} - ${partialSum} = ${missingX}.`,
        'Module 5.5',
        rng,
        [`${missingX}`]
      )
    );

    const rem = randInt(rng, 1, 3);
    const lcmBase = [12, 20, 30, 60][randInt(rng, 0, 3)];
    const ansRem = lcmBase + rem;
    pool.push(
      makeQuestion(
        `dyn-ch5-rem-${lcmBase}-${rem}`,
        1,
        'short-answer',
        `What is the smallest number > ${rem} that leaves a remainder of ${rem} when divided by ${lcmBase === 60 ? '3, 4, and 5' : lcmBase === 30 ? '2, 3, and 5' : lcmBase === 20 ? '4 and 5' : '3 and 4'}?`,
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
        [`k = ${multFactor + 1}`, `k = ${multFactor - 1}`, `k = 7`],
        `Since ${gRep} = ${gDigit} × 111 = ${gDigit} × 3 × 37 = ${twoDigit} × ${multFactor}, k = ${multFactor}.`,
        'Module 5.7',
        rng
      )
    );
  }

  if (chapterId === 'ch6-we-distribute' || chapterId === 'ch8-master-quiz') {
    const offset = randInt(rng, 2, 9);
    const low = 100 - offset;
    const high = 100 + offset;
    const diffProd = 10000 - offset * offset;
    pool.push(
      makeQuestion(
        `dyn-ch6-diff-${offset}`,
        1,
        'short-answer',
        `Using (a - b)(a + b) = a² - b², compute the exact product ${low} × ${high}.`,
        `${diffProd}`,
        [`${diffProd + 100}`, `${diffProd - 10}`, `${10000 + offset * offset}`],
        `${low} × ${high} = (100 - ${offset})(100 + ${offset}) = 10,000 - ${offset}² = ${diffProd.toLocaleString()}.`,
        'Module 6.4',
        rng,
        [`${diffProd}`, diffProd.toLocaleString()]
      )
    );

    const sqAdd = randInt(rng, 1, 8);
    const sqNum = 100 + sqAdd;
    const sqAns = sqNum * sqNum;
    pool.push(
      makeQuestion(
        `dyn-ch6-sq-${sqAdd}`,
        1,
        'short-answer',
        `Using (100 + ${sqAdd})² = 100² + 2(100)(${sqAdd}) + ${sqAdd}², compute ${sqNum}².`,
        `${sqAns}`,
        [`${10000 + sqAdd * sqAdd}`, `${sqAns - 100}`, `${sqAns + 100}`],
        `10,000 + ${200 * sqAdd} + ${sqAdd * sqAdd} = ${sqAns.toLocaleString()}.`,
        'Module 6.3',
        rng,
        [`${sqAns}`, sqAns.toLocaleString()]
      )
    );

    const n11 = randInt(rng, 21, 88);
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

    const stepK = randInt(rng, 15, 45);
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

  if (chapterId === 'ch7-proportional-1' || chapterId === 'ch8-master-quiz') {
    const rA = randInt(rng, 2, 5);
    const rB = randInt(rng, rA + 1, 9);
    const partVal = randInt(rng, 2, 9) * 100;
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

    const uRate = randInt(rng, 12, 35);
    const q1 = randInt(rng, 4, 9);
    const q2 = randInt(rng, 11, 18);
    const cost1 = q1 * uRate;
    const cost2 = q2 * uRate;
    pool.push(
      makeQuestion(
        `dyn-ch7-trairasika-${q1}-${q2}-${uRate}`,
        1,
        'short-answer',
        `By Āryabhaṭa’s Trairāśika (Rule of Three), if ${q1} meters of fabric cost ₹${cost1}, how much will ${q2} meters cost (in ₹)?`,
        `${cost2}`,
        [`${cost2 - uRate}`, `${cost2 + uRate}`, `${cost1 + q2}`],
        `Unit price = ₹${cost1} ÷ ${q1} = ₹${uRate}/m. For ${q2} m: ${q2} × ₹${uRate} = ₹${cost2}.`,
        'Module 7.4',
        rng,
        [`${cost2}`, `₹${cost2}`]
      )
    );

    const workers1 = 6;
    const days1 = randInt(rng, 3, 8) * 2;
    const workers2 = 4;
    const days2 = (workers1 * days1) / workers2;
    pool.push(
      makeQuestion(
        `dyn-ch7-inv-${days1}`,
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
  if (chapterId === 'ch4-fractions-disguise') {
    const basePrice = randInt(rng, 2, 9) * 200;
    const discPct = [10, 15, 20, 25][randInt(rng, 0, 3)];
    const salePrice = basePrice * (1 - discPct / 100);
    pool.push(
      makeQuestion(
        `dyn-p2-disc-${basePrice}-${discPct}`,
        1,
        'short-answer',
        `A jacket marked at ₹${basePrice} is sold at a ${discPct}% discount. What is the sale price (in ₹)?`,
        `${salePrice}`,
        [`${basePrice - discPct}`, `${salePrice + 50}`, `${basePrice * (1 + discPct / 100)}`],
        `Discount = ${discPct}% of ₹${basePrice} = ₹${basePrice - salePrice}. Sale price = ₹${salePrice}.`,
        'Module 1.6',
        rng,
        [`${salePrice}`, `₹${salePrice}`]
      )
    );

    const cpVal = randInt(rng, 4, 15) * 100;
    const profPct = [12, 15, 20, 25, 30][randInt(rng, 0, 4)];
    const spVal = cpVal * (1 + profPct / 100);
    pool.push(
      makeQuestion(
        `dyn-p2-profit-${cpVal}-${profPct}`,
        1,
        'short-answer',
        `A shopkeeper buys an item for ₹${cpVal} and sells it at a ${profPct}% profit. Find the selling price (in ₹).`,
        `${spVal}`,
        [`${cpVal + profPct}`, `${spVal - 40}`, `${cpVal * (1 - profPct / 100)}`],
        `SP = CP × (1 + ${profPct}/100) = ₹${cpVal} × ${1 + profPct / 100} = ₹${spVal}.`,
        'Module 1.6',
        rng,
        [`${spVal}`, `₹${spVal}`]
      )
    );

    const billAmt = randInt(rng, 3, 12) * 500;
    const gstRate = [5, 12, 18][randInt(rng, 0, 2)];
    const totalWithGst = billAmt * (1 + gstRate / 100);
    pool.push(
      makeQuestion(
        `dyn-p2-gst-${billAmt}-${gstRate}`,
        1,
        'short-answer',
        `A restaurant bill before tax is ₹${billAmt}. If ${gstRate}% GST is added, what is the final bill amount (in ₹)?`,
        `${totalWithGst}`,
        [`${billAmt + gstRate}`, `${totalWithGst - 50}`, `${billAmt * (1 - gstRate / 100)}`],
        `GST = ${gstRate}% of ₹${billAmt} = ₹${totalWithGst - billAmt}. Final bill = ₹${totalWithGst}.`,
        'Module 1.7',
        rng,
        [`${totalWithGst}`, `₹${totalWithGst}`]
      )
    );

    const pAmt = randInt(rng, 1, 5) * 2000;
    const ciAns = pAmt * 1.21;
    pool.push(
      makeQuestion(
        `dyn-p2-ci-${pAmt}`,
        1,
        'mcq',
        `Find the compound amount after 2 years on ₹${pAmt.toLocaleString()} at 10% per annum compounded annually.`,
        `₹${ciAns.toLocaleString()}`,
        [`₹${(pAmt * 1.2).toLocaleString()}`, `₹${(ciAns + 100).toLocaleString()}`, `₹${(pAmt * 1.1).toLocaleString()}`],
        `A = P(1 + 10/100)² = ₹${pAmt.toLocaleString()} × 1.21 = ₹${ciAns.toLocaleString()}.`,
        'Module 1.8',
        rng
      )
    );

    const revAfter25 = randInt(rng, 4, 16) * 125;
    const origBefore25 = (revAfter25 / 125) * 100;
    pool.push(
      makeQuestion(
        `dyn-p2-rev-${revAfter25}`,
        1,
        'short-answer',
        `After a 25% salary hike, an employee earns ₹${revAfter25}. What was the original salary before the hike (in ₹)?`,
        `${origBefore25}`,
        [`${revAfter25 * 0.75}`, `${origBefore25 - 50}`, `${origBefore25 + 100}`],
        `Original × 1.25 = ₹${revAfter25} ⇒ Original = ₹${revAfter25} ÷ 1.25 = ₹${origBefore25}.`,
        'Module 1.5',
        rng,
        [`${origBefore25}`, `₹${origBefore25}`]
      )
    );
  }

  if (chapterId === 'ch5-baudhayana-pythagoras') {
    const pTriples = [
      [6, 8, 10],
      [9, 12, 15],
      [8, 15, 17],
      [12, 16, 20],
      [7, 24, 25],
      [15, 20, 25],
    ];
    const [a, b, c] = pTriples[randInt(rng, 0, pTriples.length - 1)];
    pool.push(
      makeQuestion(
        `dyn-p2-pyth-${a}-${b}`,
        1,
        'short-answer',
        `In a right-angled triangle with perpendicular legs a = ${a} cm and b = ${b} cm, find the length of the hypotenuse c (in cm).`,
        `${c}`,
        [`${a + b}`, `${c - 2}`, `${c + 2}`],
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
        [`${hypKnown - legKnown}`, `${legMissing + 2}`, `${legMissing - 1}`],
        `Height b = √(${hypKnown}² - ${legKnown}²) = √(${hypKnown * hypKnown} - ${legKnown * legKnown}) = ${legMissing} m.`,
        'Module 2.5',
        rng,
        [`${legMissing}`, `${legMissing} m`]
      )
    );

    const sqSide = randInt(rng, 5, 18);
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

    const kScale = randInt(rng, 3, 7);
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

    const nOdd = randInt(rng, 4, 11);
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

  if (chapterId === 'ch6-proportional-reasoning') {
    const slicePct = [15, 20, 25, 30, 40][randInt(rng, 0, 4)];
    const centralAngle = (slicePct * 360) / 100;
    pool.push(
      makeQuestion(
        `dyn-p2-pie-${slicePct}`,
        1,
        'short-answer',
        `In a pie chart (360° circle), what is the central angle (in degrees) for a category representing ${slicePct}% of the total?`,
        `${centralAngle}`,
        [`${centralAngle + 18}`, `${slicePct * 3}`, `${centralAngle - 18}`],
        `${slicePct}% of 360° = (${slicePct} ÷ 100) × 360° = ${centralAngle}°.`,
        'Module 3.1',
        rng,
        [`${centralAngle}`, `${centralAngle}°`]
      )
    );

    const mapCm = randInt(rng, 3, 12);
    const kmPerCm = [5, 10, 25, 50][randInt(rng, 0, 3)];
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

    const speed1 = 60;
    const hrs1 = randInt(rng, 2, 6);
    const dist = speed1 * hrs1;
    const speed2 = [40, 80, 90][randInt(rng, 0, 2)];
    const hrs2 = dist / speed2;
    pool.push(
      makeQuestion(
        `dyn-p2-inv-speed-${hrs1}-${speed2}`,
        1,
        'mcq',
        `A car traveling at ${speed1} km/h covers a journey in ${hrs1} hours (${dist} km). How long will the same journey take at ${speed2} km/h?`,
        `${hrs2} hours`,
        [`${hrs1 + 1} hours`, `${(hrs1 * speed2) / speed1} hours`, `${hrs2 + 1.5} hours`],
        `By inverse proportion, s₁t₁ = s₂t₂ ⇒ ${speed1} × ${hrs1} = ${speed2} × t₂ ⇒ t₂ = ${dist} ÷ ${speed2} = ${hrs2} hours.`,
        'Module 3.5',
        rng
      )
    );

    const men1 = 8;
    const daysWork1 = randInt(rng, 3, 9) * 3;
    const men2 = 6;
    const daysWork2 = (men1 * daysWork1) / men2;
    pool.push(
      makeQuestion(
        `dyn-p2-pipes-${daysWork1}`,
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

    const r1 = 2;
    const r2 = 3;
    const r3 = 5;
    const mult = randInt(rng, 2, 9) * 100;
    const tot = (r1 + r2 + r3) * mult;
    pool.push(
      makeQuestion(
        `dyn-p2-split3-${mult}`,
        1,
        'short-answer',
        `A prize of ₹${tot.toLocaleString()} is divided among 3 winners in the ratio 2 : 3 : 5. What is the largest share (in ₹)?`,
        `${r3 * mult}`,
        [`${r2 * mult}`, `${r1 * mult}`, `${tot / 3}`],
        `Total parts = 2 + 3 + 5 = 10. Largest share = (5/10) × ₹${tot.toLocaleString()} = ₹${(r3 * mult).toLocaleString()}.`,
        'Module 3.4',
        rng,
        [`${r3 * mult}`, `₹${r3 * mult}`]
      )
    );
  }

  if (chapterId === 'ch11-geometric-themes') {
    const stepF = randInt(rng, 2, 4);
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

    const gStep = randInt(rng, 2, 5);
    const gTris = Math.pow(3, gStep);
    pool.push(
      makeQuestion(
        `dyn-p2-gasket-${gStep}`,
        1,
        'short-answer',
        `In the Sierpinski Triangle (Gasket), how many upward-pointing shaded triangles exist at Step n = ${gStep} (using Tₙ = 3ⁿ)?`,
        `${gTris}`,
        [`${3 * gStep}`, `${Math.pow(4, gStep)}`, `${gTris - 3}`],
        `At Step ${gStep}, T_${gStep} = 3^${gStep} = ${gTris} upward triangles.`,
        'Module 4.2',
        rng,
        [`${gTris}`]
      )
    );

    const kStep = randInt(rng, 1, 4);
    const kSides = 3 * Math.pow(4, kStep);
    pool.push(
      makeQuestion(
        `dyn-p2-koch-${kStep}`,
        1,
        'short-answer',
        `In the Koch Snowflake (where Step 0 has 3 sides and each side splits into 4 segments per step), how many sides are there at Step n = ${kStep}?`,
        `${kSides}`,
        [`${Math.pow(4, kStep)}`, `${3 * kStep * 4}`, `${kSides / 2}`],
        `S_${kStep} = 3 × 4^${kStep} = ${kSides} sides.`,
        'Module 4.3',
        rng,
        [`${kSides}`]
      )
    );

    const fFaces = randInt(rng, 6, 12);
    const vVerts = randInt(rng, 6, 12);
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

    const hPeak1 = randInt(rng, 3, 6);
    const hPeak2 = randInt(rng, 2, hPeak1);
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

  if (chapterId === 'ch12-dots-and-lines') {
    const targetMean = randInt(rng, 20, 50);
    const d1 = randInt(rng, 2, 8);
    const d2 = randInt(rng, 3, 9);
    const x1 = targetMean - d1;
    const x2 = targetMean - d2;
    const x3 = targetMean + d1;
    const x4 = targetMean + d2;
    pool.push(
      makeQuestion(
        `dyn-p2-mean-${targetMean}`,
        1,
        'short-answer',
        `Find the arithmetic mean (balance point) of the four data values: ${x1}, ${x2}, ${x3}, ${x4}.`,
        `${targetMean}`,
        [`${targetMean + 2}`, `${targetMean - 2}`, `${targetMean + 4}`],
        `The values are symmetrically balanced (±${d1} and ±${d2}) around ${targetMean}, so their mean is ${targetMean}.`,
        'Module 5.1',
        rng,
        [`${targetMean}`]
      )
    );

    const medMid = randInt(rng, 18, 45);
    const mArr = [medMid - 7, medMid - 3, medMid, medMid + 4, medMid + 19];
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

    const q1Val = randInt(rng, 20, 40);
    const iqrVal = randInt(rng, 12, 28);
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

    const cStart = randInt(rng, 10, 30);
    const cEnd = cStart + randInt(rng, 12, 36);
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

    const cellCnt = randInt(rng, 5, 10);
    const avgCell = randInt(rng, 12, 30);
    const sumCell = cellCnt * avgCell;
    pool.push(
      makeQuestion(
        `dyn-p2-sheet-${cellCnt}-${avgCell}`,
        1,
        'short-answer',
        `In a spreadsheet, if =SUM(B1:B${cellCnt}) returns ${sumCell}, what value will =AVERAGE(B1:B${cellCnt}) return?`,
        `${avgCell}`,
        [`${avgCell + 2}`, `${sumCell}`, `${avgCell - 2}`],
        `=AVERAGE divides the sum (${sumCell}) by the count of cells (${cellCnt}): ${sumCell} ÷ ${cellCnt} = ${avgCell}.`,
        'Module 5.3',
        rng,
        [`${avgCell}`]
      )
    );
  }

  if (chapterId === 'ch13-algebra-play') {
    const pA = randInt(rng, 3, 12);
    const pB = randInt(rng, 4, 15);
    const pC = randInt(rng, 2, 11);
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
        'Number Pyramids & Algebra',
        rng,
        [`${pTop}`]
      )
    );
  }

  if (chapterId === 'ch14-area') {
    const b1 = randInt(rng, 8, 16);
    const b2 = randInt(rng, 10, 20);
    const h = randInt(rng, 3, 8) * 2;
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

    const d1R = randInt(rng, 6, 16) * 2;
    const d2R = randInt(rng, 5, 14) * 2;
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

    const triB = randInt(rng, 6, 16) * 2;
    const triH = randInt(rng, 5, 15);
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

    const diagD = randInt(rng, 6, 15) * 2;
    const off1 = randInt(rng, 4, 12);
    const off2 = randInt(rng, 5, 14);
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

    const paraB = randInt(rng, 9, 22);
    const paraH = randInt(rng, 5, 14);
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

const TWENTY_QUESTION_CHAPTERS = new Set<string>([
  'ch8-master-quiz',
  'ch4-fractions-disguise',
  'ch5-baudhayana-pythagoras',
  'ch6-proportional-reasoning',
  'ch11-geometric-themes',
  'ch14-area',
  'ch12-dots-and-lines',
]);

export function generateDynamicChapterQuiz(
  chapterId: ChapterId | 'ch8-master-quiz',
  staticPool: ChapterAssessmentQuestion[],
  seed: number,
  targetCount = 10
): ChapterAssessmentQuestion[] {
  const rng = seededRandom(seed * 7919 + chapterId.length * 131 + 17);

  // Shuffle options inside every static question so even conceptual questions have different option orders each time
  const reshuffledStatic: Omit<ChapterAssessmentQuestion, 'questionNumber'>[] = staticPool.map((q, idx) => {
    const { shuffled, newCorrectIndex } = shuffleWithCorrect(q.options, q.correctIndex, rng);
    return {
      ...q,
      id: `${q.id}-seed-${seed}-${idx}`,
      options: shuffled,
      correctIndex: newCorrectIndex,
    };
  });

  const proceduralPool = generateProceduralPoolForChapter(chapterId, rng);

  // Combine procedural questions and reshuffled static questions, then shuffle the order
  const combined = [...proceduralPool, ...reshuffledStatic];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = combined[i];
    combined[i] = combined[j];
    combined[j] = temp;
  }

  const count = TWENTY_QUESTION_CHAPTERS.has(chapterId) ? 20 : targetCount;
  return combined.slice(0, count).map((q, idx) => ({
    ...q,
    questionNumber: idx + 1,
  }));
}
