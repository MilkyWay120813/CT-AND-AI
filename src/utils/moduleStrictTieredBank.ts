import { ChapterAssessmentQuestion, ModuleGameChallenge } from '../types/part1Curriculum';
import { ChapterId } from '../types/math';
import { QuizDifficultyLevel } from './quizDifficulty';
import { generateTieredChapterPool } from './olympiadQuestionBank';

function seededRng(seed: number): () => number {
  let s = ((Math.abs(Math.floor(seed)) || 1) % 2147483647) || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function ri(rng: () => number, min: number, max: number): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return Math.floor(rng() * (hi - lo + 1)) + lo;
}

function pk<T>(rng: () => number, arr: readonly T[]): T {
  return arr[ri(rng, 0, arr.length - 1)];
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

function mk(
  modRef: string,
  prompt: string,
  correct: string,
  distractors: string[],
  explanation: string,
  rng: () => number
): ModuleGameChallenge {
  const unique = [correct];
  for (const d of distractors) {
    if (d && !unique.includes(d)) unique.push(d);
  }
  const baseNum = Number(correct.replace(/[^0-9.-]/g, ''));
  let pad = 1;
  while (unique.length < 4) {
    const cand = Number.isFinite(baseNum)
      ? `${baseNum + (pad % 2 === 0 ? -pad : pad) * 2}`
      : `Option ${pad + 1}`;
    if (!unique.includes(cand)) unique.push(cand);
    pad++;
  }
  const { options, correctIndex } = shuffleTagged(unique.slice(0, 4), 0, rng);
  return {
    prompt,
    clue: `Ref: ${modRef} · Focus strictly on this module's concept.`,
    options,
    correctIndex,
    explanation,
  };
}

function resolveChapterAndModNum(moduleId: string): { chapterId: ChapterId; chNum: number; modNum: number; part: 1 | 2 } | null {
  let m = moduleId.match(/^mod-(\d+)-(\d+)$/);
  if (m) {
    const ch = Number(m[1]);
    const mn = Number(m[2]);
    const p1Ids: ChapterId[] = [
      'ch1-square-cube',
      'ch2-power-play',
      'ch3-story-numbers',
      'ch4-quadrilaterals',
      'ch5-number-play',
      'ch6-we-distribute',
      'ch7-proportional-1',
    ];
    if (ch >= 1 && ch <= 7 && mn >= 1 && mn <= 7) {
      return { chapterId: p1Ids[ch - 1], chNum: ch, modNum: mn, part: 1 };
    }
  }
  m = moduleId.match(/^p2-mod-(\d+)-(\d+)$/);
  if (m) {
    const ch = Number(m[1]);
    const mn = Number(m[2]);
    const p2Ids: ChapterId[] = [
      'ch4-fractions-disguise',
      'ch5-baudhayana-pythagoras',
      'ch6-proportional-reasoning',
      'ch11-geometric-themes',
      'ch12-dots-and-lines',
      'ch13-algebra-play',
      'ch14-area',
    ];
    if (ch >= 1 && ch <= 7 && mn >= 1 && mn <= 7) {
      return { chapterId: p2Ids[ch - 1], chNum: ch, modNum: mn, part: 2 };
    }
  }
  m = moduleId.match(/^p2-ch6-m(\d+)$/);
  if (m) {
    const mn = Number(m[1]);
    if (mn >= 1 && mn <= 7) {
      return { chapterId: 'ch13-algebra-play', chNum: 6, modNum: mn, part: 2 };
    }
  }
  return null;
}

function toStrictChallenge(q: Omit<ChapterAssessmentQuestion, 'questionNumber'>, modRef: string): ModuleGameChallenge {
  return {
    prompt: q.prompt,
    clue: `Ref: ${modRef} · Step carefully through every constraint.`,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
  };
}

/**
 * Generates tier-calibrated questions strictly for a SINGLE M1-M7 module topic.
 * Never pulls sibling module questions from elsewhere in the chapter.
 */
function buildSingleModuleVariants(
  moduleId: string,
  rng: () => number,
  d: QuizDifficultyLevel
): ModuleGameChallenge[] {
  const out: ModuleGameChallenge[] = [];
  const meta = resolveChapterAndModNum(moduleId);
  const modRef = meta ? `Module ${meta.chNum}.${meta.modNum}` : 'Module Topic';

  const a = ri(rng, 2, 12);
  const b = ri(rng, 2, 11);
  const c = ri(rng, 3, 9);
  const k = ri(rng, 2, 8);

  switch (moduleId) {
    // =======================================================================
    // PART I · CHAPTER 1: A SQUARE AND A CUBE (mod-1-1 .. mod-1-7)
    // =======================================================================
    case 'mod-1-1': {
      if (d === 1) {
        const s = ri(rng, 3, 12);
        const lock = ri(rng, 2, 6);
        out.push(
          mk(modRef, `What is the area of a ${s} × ${s} square (${s}²)?`, `${s * s}`, [`${s * 2}`, `${s * s + 1}`, `${s + s}`], `${s} × ${s} = ${s * s}.`, rng),
          mk(modRef, `If ${lock * lock} lockers are toggled in a 1-to-${lock * lock} hall, is locker #${lock * lock} OPEN (odd number of factors)?`, `Yes — ${lock * lock} is a perfect square`, [`No — only primes stay open`, `No — even numbers close`, `Only locker 1 stays open`], `Perfect squares have odd factor counts, so #${lock * lock} stays open.`, rng)
        );
      } else if (d === 3) {
        const lim = ri(rng, 40, 140);
        const openCount = Math.floor(Math.sqrt(lim));
        const p1 = pk(rng, [2, 3, 5]);
        const p2 = pk(rng, [7, 11]);
        const targetSq = (p1 * p2) ** 2;
        out.push(
          mk(modRef, `In a corridor of ${lim} lockers toggled by students 1 through ${lim}, how many lockers remain OPEN at the end?`, `${openCount}`, [`${openCount - 1}`, `${openCount + 1}`, `${Math.floor(lim / 2)}`], `Lockers staying open are perfect squares ≤ ${lim}: ⌊√${lim}⌋ = ${openCount}.`, rng),
          mk(modRef, `Which number has an ODD total count of positive divisors (factors)?`, `${targetSq}`, [`${targetSq - 1}`, `${p1 * p2}`, `${targetSq + 2}`], `Only perfect squares like ${targetSq} = (${p1 * p2})² have an odd divisor count.`, rng)
        );
      } else {
        const nMax = ri(rng, 500, 2200);
        const p = pk(rng, [3, 5, 7]);
        const openDiv = Math.floor(Math.sqrt(nMax) / p);
        const oddF = pk(rng, [9, 15, 25]);
        // Smallest number with 9 divisors = p^2*q^2 or p^8; let's do exact count of odd-factor numbers between L and R
        const loR = ri(rng, 5, 11);
        const hiR = loR + ri(rng, 8, 17);
        const loBound = loR * loR + 1;
        const hiBound = hiR * hiR;
        out.push(
          mk(modRef, `How many lockers numbered from ${loBound} to ${hiBound} remain OPEN after all ${hiBound} locker-toggling passes?`, `${hiR - loR}`, [`${hiR - loR - 1}`, `${hiR - loR + 1}`, `${Math.floor((hiBound - loBound) / 10)}`], `Open lockers are k² in [${loBound}, ${hiBound}]: k runs from ${loR + 1} to ${hiR}, giving ${hiR - loR}.`, rng),
          mk(modRef, `A positive integer N ≤ ${nMax} is toggled in a hallway puzzle and ends OPEN, and ${p} divides N. How many such N exist?`, `${openDiv}`, [`${openDiv + 1}`, `${Math.max(1, openDiv - 1)}`, `${Math.floor(nMax / (p * p))}`], `N = m² ≤ ${nMax} with ${p} | m means m is a multiple of ${p} up to ⌊√${nMax}⌋ = ${Math.floor(Math.sqrt(nMax))}, giving ${openDiv}.`, rng),
          mk(modRef, `What is the smallest positive integer greater than 1 whose total number of factors is ${oddF === 9 ? '9' : oddF === 15 ? '5' : '9'}?`, oddF === 15 ? `16` : `36`, oddF === 15 ? [`32`, `64`, `81`] : [`64`, `100`, `144`], oddF === 15 ? `2⁴ = 16 has 4+1 = 5 factors.` : `2² × 3² = 36 has (2+1)(2+1) = 9 factors.`, rng)
        );
      }
      break;
    }

    case 'mod-1-2': {
      if (d === 1) {
        const endBad = pk(rng, [2, 3, 7, 8]);
        const base = ri(rng, 11, 29);
        const u = (base * base) % 10;
        out.push(
          mk(modRef, `What is the units digit of ${base}²?`, `${u}`, [`${(u + 1) % 10}`, `${(u + 3) % 10}`, `${(u + 5) % 10}`], `Look only at the last digit ${base % 10}: (${base % 10})² ends in ${u}.`, rng),
          mk(modRef, `Which number ends in a forbidden square digit and CANNOT be a perfect square?`, `${ri(rng, 2, 9)}${endBad}`, [`169`, `225`, `484`], `Squares never end in 2, 3, 7, or 8 — so ${endBad} rules it out immediately.`, rng)
        );
      } else if (d === 3) {
        const nVal = ri(rng, 4, 15);
        const zeros = ri(rng, 2, 5);
        const fullZeros = zeros * 2;
        const unitSq = pk(rng, [1, 4, 5, 6, 9]);
        out.push(
          mk(modRef, `How many numbers lie strictly BETWEEN ${nVal}² and ${nVal + 1}²?`, `${2 * nVal}`, [`${2 * nVal + 1}`, `${2 * nVal - 1}`, `${nVal * nVal}`], `Between n² and (n+1)² there are always 2n = ${2 * nVal} non-square integers.`, rng),
          mk(modRef, `If a perfect square ends with ${fullZeros} zeros, how many trailing zeros does its square root have?`, `${zeros}`, [`${fullZeros}`, `${zeros + 1}`, `${Math.max(1, zeros - 1)}`], `Squaring doubles trailing zeros; square rooting halves ${fullZeros} zeros to ${zeros}.`, rng),
          mk(modRef, `If n² ends in digit 6, what can the units digit of n be?`, `4 or 6`, [`2 or 8`, `6 only`, `1 or 9`], `Both 4² = 16 and 6² = 36 end in 6.`, rng)
        );
      } else {
        const nOdd = ri(rng, 101, 251) * 2 + 1;
        const pRoot = ri(rng, 12, 34);
        const sqA = pRoot * pRoot;
        const sqB = (pRoot + 1) * (pRoot + 1);
        out.push(
          mk(modRef, `For ANY odd integer n (such as n = ${nOdd}), what is the remainder when n² is divided by 8?`, `1`, [`3`, `5`, `7`], `Write n = 2k+1 ⇒ n² = 4k(k+1) + 1. Since k(k+1) is always even, n² ≡ 1 (mod 8) always!`, rng),
          mk(modRef, `How many non-square integers satisfy ${sqA} < m < ${sqB}, AND have units digit equal to the units digit of ${2 * pRoot}?`, `${Math.floor(2 * pRoot / 10) + (2 * pRoot % 10 > 0 ? 1 : 0)}`, [`${pRoot}`, `${2 * pRoot}`, `${Math.floor(2 * pRoot / 10) + 4}`], `Between ${pRoot}² and ${pRoot + 1}² are exactly ${2 * pRoot} consecutive integers.`, rng),
          mk(modRef, `Every perfect square ending in 6 has an ODD tens digit (e.g. 16, 36, 196, 256). What is the units digit of n² + (n + 1)² when n = ${ri(rng, 10, 49) * 10 + 3}?`, `5`, [`7`, `3`, `9`], `n ends in 3 (n² ends in 9) and n+1 ends in 4 ((n+1)² ends in 6); 9 + 6 ends in 5.`, rng)
        );
      }
      break;
    }

    case 'mod-1-3': {
      if (d === 1) {
        const n = ri(rng, 4, 14);
        out.push(
          mk(modRef, `Sum of the first ${n} odd numbers (1 + 3 + … + ${2 * n - 1}) = ?`, `${n * n}`, [`${2 * n - 1}`, `${n * 2}`, `${(n + 1) ** 2}`], `The first ${n} odd numbers wrap an ${n} × ${n} square of ${n * n} dots.`, rng),
          mk(modRef, `How many consecutive odd numbers starting from 1 add up to ${(n + 1) ** 2}?`, `${n + 1}`, [`${n}`, `${2 * n + 1}`, `${n + 2}`], `Since √${(n + 1) ** 2} = ${n + 1}, it takes ${n + 1} consecutive odd layers.`, rng)
        );
      } else if (d === 3) {
        const n1 = ri(rng, 6, 14);
        const n2 = n1 + ri(rng, 4, 8);
        const sumPart = n2 * n2 - n1 * n1;
        out.push(
          mk(modRef, `Find the sum of odd numbers from ${2 * n1 + 1} up to ${2 * n2 - 1} using n² − m².`, `${sumPart}`, [`${sumPart + 2}`, `${n2 * n2}`, `${(n2 - n1) ** 2}`], `Subtract the first ${n1} odd numbers (${n1}²) from the first ${n2} odd numbers (${n2}²): ${n2 * n2} − ${n1 * n1} = ${sumPart}.`, rng),
          mk(modRef, `If a single L-shaped odd layer contains ${2 * n2 + 1} unit squares added onto a square grid, what was the side length BEFORE adding it?`, `${n2}`, [`${n2 + 1}`, `${2 * n2}`, `${n2 - 1}`], `Layer from n² to (n+1)² always has 2n + 1 = ${2 * n2 + 1} ⇒ n = ${n2}.`, rng)
        );
      } else {
        const lowN = ri(rng, 15, 32);
        const gap = pk(rng, [5, 7, 9, 11]);
        const highN = lowN + gap;
        const val = highN * highN - lowN * lowN;
        const nMid = ri(rng, 18, 45);
        out.push(
          mk(modRef, `The sum of ${gap} consecutive odd integers is ${val}. What is the LARGEST odd integer in this run?`, `${2 * highN - 1}`, [`${2 * lowN + 1}`, `${2 * highN + 1}`, `${Math.round(val / gap)}`], `Average = ${val / gap}. With ${gap} consecutive odd terms spaced by 2, largest = ${val / gap} + ${gap - 1} = ${2 * highN - 1}.`, rng),
          mk(modRef, `Evaluate √(${nMid * nMid} + ${(nMid + 1) * (nMid + 1) - nMid * nMid} + ${(nMid + 2) ** 2 - (nMid + 1) ** 2} + ${(nMid + 3) ** 2 - (nMid + 2) ** 2}).`, `${nMid + 3}`, [`${nMid + 2}`, `${nMid + 4}`, `${nMid}`], `Each term is a consecutive L-layer climbing from ${nMid}² to (${nMid + 3})², so the root is ${nMid + 3}.`, rng),
          mk(modRef, `If (a − b) = ${gap} and a² − b² = ${val} (for positive integers a, b), find 2b + 1 (the first odd layer in a² − b²).`, `${2 * lowN + 1}`, [`${2 * highN - 1}`, `${lowN}`, `${highN}`], `a + b = ${val / gap} and a − b = ${gap} ⇒ b = ${lowN}, so the first odd layer is 2b + 1 = ${2 * lowN + 1}.`, rng)
        );
      }
      break;
    }

    case 'mod-1-4': {
      if (d === 1) {
        const sq = ri(rng, 11, 25);
        out.push(
          mk(modRef, `Find the square root of ${sq * sq} (√${sq * sq}).`, `${sq}`, [`${sq + 2}`, `${sq - 1}`, `${Math.floor(sq * sq / 2)}`], `${sq} × ${sq} = ${sq * sq}.`, rng),
          mk(modRef, `Which whole integer is closest to √${sq * sq + ri(rng, 2, 6)}?`, `${sq}`, [`${sq + 3}`, `${sq - 2}`, `${sq + 5}`], `Since ${sq}² = ${sq * sq} is right below it and (${sq + 1})² = ${(sq + 1) ** 2}, it is closest to ${sq}.`, rng)
        );
      } else if (d === 3) {
        const pair = pk(rng, [
          { n: 245, k: 5, root: 35 },
          { n: 392, k: 2, root: 28 },
          { n: 588, k: 3, root: 42 },
          { n: 720, k: 5, root: 60 },
          { n: 1008, k: 7, root: 84 },
        ]);
        const r = ri(rng, 32, 68);
        const est = r * r + ri(rng, 10, 25);
        out.push(
          mk(modRef, `What is the smallest positive integer k such that ${pair.n} × k is a perfect square? Enter the resulting √(${pair.n}k).`, `${pair.root}`, [`${pair.k}`, `${pair.root + 6}`, `${pair.root - 7}`], `Multiplying ${pair.n} by unpaired factor ${pair.k} makes ${pair.n * pair.k} = ${pair.root}².`, rng),
          mk(modRef, `Without a calculator, bracket √${est} between two consecutive integers:`, `${r} and ${r + 1}`, [`${r - 1} and ${r}`, `${r + 1} and ${r + 2}`, `${r - 2} and ${r - 1}`], `${r}² = ${r * r} < ${est} < ${(r + 1) ** 2} = (${r + 1})².`, rng)
        );
      } else {
        const baseP = pk(rng, [2, 3, 5]);
        const exp2 = ri(rng, 3, 7);
        const exp3 = ri(rng, 2, 5);
        const num = Math.pow(2, exp2) * Math.pow(3, exp3) * (baseP === 5 ? 5 : 1);
        const multK = (exp2 % 2 === 1 ? 2 : 1) * (exp3 % 2 === 1 ? 3 : 1) * (baseP === 5 ? 5 : 1);
        const nestedBase = ri(rng, 3, 9);
        const nestedSq = nestedBase * nestedBase;
        const outerRoot = ri(rng, 4, 11);
        const innerTarget = outerRoot * outerRoot - nestedBase;
        out.push(
          mk(modRef, `Find the smallest positive integer k so that (${num} ÷ k) is a perfect square AND a multiple of 4.`, `${(num / Math.pow(2, exp2)) * Math.pow(2, exp2 % 2)}`, [`${multK}`, `${multK * 2}`, `${multK * 4}`], `To remain a square multiple of 4, divide out all odd-power primes leaving at least 2², so k = ${(num / Math.pow(2, exp2)) * Math.pow(2, exp2 % 2)}.`, rng),
          mk(modRef, `Simplify nested radical √(${innerTarget} + √${nestedSq}) and square your answer.`, `${outerRoot * outerRoot}`, [`${outerRoot}`, `${innerTarget + nestedBase + 1}`, `${outerRoot * 2}`], `√${nestedSq} = ${nestedBase} ⇒ √(${innerTarget} + ${nestedBase}) = √${outerRoot * outerRoot} = ${outerRoot}, whose square is ${outerRoot * outerRoot}.`, rng),
          mk(modRef, `Find the smallest 4-digit number that is a perfect square divisible by 2, 3, and 5.`, `3600`, [`1600`, `1800`, `900`], `Divisible by LCM(2,3,5)=30 and a perfect square means a multiple of 30² = 900; the smallest 4-digit square multiple is 900 × 4 = 3600 = 60².`, rng)
        );
      }
      break;
    }

    case 'mod-1-5': {
      if (d === 1) {
        const s = ri(rng, 2, 9);
        out.push(
          mk(modRef, `Compute ${s}³ (${s} × ${s} × ${s}).`, `${s * s * s}`, [`${s * s}`, `${s * 3}`, `${s * s * s + 1}`], `${s} × ${s} × ${s} = ${s * s * s}.`, rng),
          mk(modRef, `What is the units digit of ${ri(rng, 1, 7) * 10 + c}³?`, `${(c * c * c) % 10}`, [`${(c * c) % 10}`, `${c}`, `${(c + 2) % 10}`], `Look at the last digit ${c}: ${c}³ = ${c ** 3}, ending in ${(c ** 3) % 10}.`, rng)
        );
      } else if (d === 3) {
        const uOdd = ri(rng, 3, 15);
        const firstOdd = uOdd * (uOdd - 1) + 1;
        const digitPair = pk(rng, [
          { end: 7, unit: 3 },
          { end: 3, unit: 7 },
          { end: 8, unit: 2 },
          { end: 2, unit: 8 },
          { end: 4, unit: 4 },
          { end: 6, unit: 6 },
          { end: 9, unit: 9 },
        ]);
        const decade = ri(rng, 1, 6) * 10;
        const ansN = decade + digitPair.unit;
        out.push(
          mk(modRef, `Which integer's cube equals the consecutive odd block sum starting at ${firstOdd}: ${firstOdd} + ${firstOdd + 2} + … (${uOdd} terms)?`, `${uOdd} (${uOdd ** 3})`, [`${uOdd + 1}`, `${uOdd - 1}`, `${firstOdd}`], `By Nicomachus' theorem, ${uOdd} consecutive odds starting at ${uOdd}(${uOdd}-1)+1 = ${firstOdd} sum to ${uOdd}³ = ${uOdd ** 3}.`, rng),
          mk(modRef, `Cubes ending in 2, 3, 7, 8 swap endings (2↔8, 3↔7). If N³ ends in ${digitPair.end} and ${decade} < N < ${decade + 10}, find N.`, `${ansN}`, [`${decade + digitPair.end}`, `${decade + ((digitPair.unit + 2) % 10)}`, `${decade + ((digitPair.unit + 4) % 10)}`], `${digitPair.unit}³ ends in ${digitPair.end}, so in (${decade}..${decade + 10}) we get N = ${ansN}.`, rng)
        );
      } else {
        const kSum = ri(rng, 8, 22);
        const tri = (kSum * (kSum + 1)) / 2;
        const aCub = ri(rng, 10, 29);
        const oddDiff = 3 * aCub * aCub + 3 * aCub + 1;
        out.push(
          mk(modRef, `If 1³ + 2³ + … + n³ = ${(tri * tri).toLocaleString()}, find n.`, `${kSum}`, [`${kSum - 1}`, `${kSum + 1}`, `${kSum + 2}`], `Sum equals [n(n+1)/2]², so n(n+1)/2 = ${tri} ⇒ n = ${kSum}.`, rng),
          mk(modRef, `Find positive integer a if (a + 1)³ − a³ = ${oddDiff}.`, `${aCub}`, [`${aCub - 1}`, `${aCub + 1}`, `${aCub + 2}`], `3a² + 3a + 1 = ${oddDiff} ⇒ a(a+1) = ${(oddDiff - 1) / 3} = ${aCub}×${aCub + 1} ⇒ a = ${aCub}.`, rng),
          mk(modRef, `How many positive integers n ≤ 1000 satisfy that n³ ends in the exact same digit as n?`, `600`, [`400`, `500`, `200`], `n and n³ share the same last digit when n ends in 0, 1, 4, 5, 6, or 9 (6 out of 10 digits) ⇒ 600 of 1000.`, rng)
        );
      }
      break;
    }

    case 'mod-1-6': {
      if (d === 1) {
        const m = ri(rng, 2, 12);
        const taxSet = pk(rng, [
          { n: 1729, a1: 1, b1: 12, a2: 9, b2: 10 },
          { n: 4104, a1: 2, b1: 16, a2: 9, b2: 15 },
          { n: 13832, a1: 2, b1: 24, a2: 18, b2: 20 },
          { n: 20683, a1: 10, b1: 27, a2: 19, b2: 24 },
          { n: 32832, a1: 4, b1: 32, a2: 18, b2: 30 },
        ]);
        out.push(
          mk(modRef, `Verify Taxicab number ${taxSet.n.toLocaleString()}: since ${taxSet.a1}³ + ${taxSet.b1}³ = ${taxSet.n.toLocaleString()}, what is ${taxSet.a2}³ + ${taxSet.b2}³?`, `${taxSet.n.toLocaleString()}`, [`${(taxSet.n + 1).toLocaleString()}`, `${(taxSet.n - 1).toLocaleString()}`, `${(taxSet.a2 ** 3 + taxSet.b2).toLocaleString()}`], `${taxSet.a2}³ + ${taxSet.b2}³ = ${taxSet.n.toLocaleString()} — two different cube-pair sums!`, rng),
          mk(modRef, `Scaling 1729 by ${m}³ gives (${m})³ + (${12 * m})³ = (${9 * m})³ + x³. What is x?`, `${10 * m}`, [`${12 * m}`, `${9 * m}`, `${10 * m + 1}`], `Scale every base by ${m}: 10 × ${m} = ${10 * m}.`, rng)
        );
      } else if (d === 3) {
        const m = ri(rng, 2, 11);
        const xTarg = ri(rng, 2, 9);
        const delta = xTarg ** 3 - 1;
        out.push(
          mk(modRef, `Evaluate (${m * 9})³ + (${m * 10})³ − (${m * 12})³ quickly using 1729.`, `${m ** 3}`, [`${12 * m}`, `${9 * m}`, `${(m ** 3) * 2}`], `Both (${9 * m})³+(${10 * m})³ and ${m}³+(${12 * m})³ equal ${m}³×1729, leaving ${m}³ = ${m ** 3}.`, rng),
          mk(modRef, `Using 1³ + 12³ = 9³ + 10³, solve x³ + 12³ = 9³ + 10³ + ${delta} for integer x.`, `${xTarg}`, [`${xTarg + 1}`, `${Math.max(1, xTarg - 1)}`, `${xTarg + 2}`], `1729 − 1728 + ${delta} = ${1 + delta} = ${xTarg}³, so x = ${xTarg}.`, rng)
        );
      } else {
        const s = ri(rng, 3, 9);
        out.push(
          mk(modRef, `Using 1729 × ${s}³ = a³ + b³ = c³ + d³ with a < c < d < b, find (b − d) + (c − a).`, `${10 * s}`, [`${12 * s}`, `${9 * s}`, `${11 * s}`], `a=${s}, c=${9 * s}, d=${10 * s}, b=${12 * s}. (b − d) + (c − a) = ${2 * s} + ${8 * s} = ${10 * s}.`, rng),
          mk(modRef, `Using the second positive taxicab number 4104 = 2³ + 16³ = 9³ + 15³, what is 4104 × ${s}³ written as the difference between its LARGEST cube base and SMALLEST cube base?`, `${14 * s}`, [`${16 * s}`, `${15 * s}`, `${7 * s}`], `Scaled bases are ${2 * s}, ${9 * s}, ${15 * s}, ${16 * s}; ${16 * s} − ${2 * s} = ${14 * s}.`, rng),
          mk(modRef, `If positive integers satisfy x³ + y³ = 1729 × ${s}³ and x < y with gcd(x, y) = ${s}, find x + y.`, `${13 * s} or ${19 * s}`, [`${12 * s}`, `${21 * s}`, `${15 * s}`], `Primitive taxicab pairs summing to 1729 are (1, 12) sum 13 and (9, 10) sum 19; scaled by ${s} gives ${13 * s} or ${19 * s}.`, rng)
        );
      }
      break;
    }

    case 'mod-1-7': {
      if (d === 1) {
        const rt = ri(rng, 4, 15);
        out.push(
          mk(modRef, `Find the cube root ∛${rt ** 3}.`, `${rt}`, [`${rt + 2}`, `${rt - 1}`, `${rt * 2}`], `${rt} × ${rt} × ${rt} = ${rt ** 3}.`, rng),
          mk(modRef, `In ∛${1728}, prime factorization 2⁶ × 3³ is grouped into prime triplets. How many factors of 2 survive inside ∛1728?`, `2² = 4`, [`2³ = 8`, `2¹ = 2`, `2⁶ = 64`], `Each triplet of 2s yields one 2 outside: 2⁶ = (2×2×2)(2×2×2) ⇒ 2² = 4.`, rng)
        );
      } else if (d === 3) {
        const d3 = ri(rng, 10, 24);
        const cubeV = d3 ** 3;
        const multSet = pk(rng, [
          { n: 24, mult: 9, cb: 6 },
          { n: 54, mult: 4, cb: 6 },
          { n: 108, mult: 2, cb: 6 },
          { n: 250, mult: 4, cb: 10 },
          { n: 375, mult: 9, cb: 15 },
        ]);
        out.push(
          mk(modRef, `Using estimation: ${cubeV.toLocaleString()} ends in ${cubeV % 10}, and after stripping last 3 digits ${Math.floor(cubeV / 1000)} lies between ${Math.floor(d3 / 10) ** 3} and ${(Math.floor(d3 / 10) + 1) ** 3}. Find ∛${cubeV.toLocaleString()}.`, `${d3}`, [`${d3 + 1}`, `${d3 - 2}`, `${d3 + 10}`], `Units digit forces ${d3 % 10} and thousands block forces ${Math.floor(d3 / 10)} ⇒ ${d3}.`, rng),
          mk(modRef, `What smallest positive integer k makes ${multSet.n} × k a perfect cube?`, `${multSet.mult}`, [`${multSet.mult * 2}`, `${multSet.cb}`, `${Math.max(2, multSet.mult - 1)}`], `Complete incomplete prime triplets in ${multSet.n} by multiplying by ${multSet.mult} = ${multSet.cb}³.`, rng)
        );
      } else {
        const exp2 = ri(rng, 2, 5);
        const exp3 = ri(rng, 1, 5);
        const nVal = Math.pow(2, exp2) * Math.pow(3, exp3);
        const needSqCb = Math.pow(2, (6 - (exp2 % 6)) % 6) * Math.pow(3, (6 - (exp3 % 6)) % 6);
        const startM = ri(rng, 2, 12);
        out.push(
          mk(modRef, `Evaluate ∛(−${startM ** 3} × ${(k + 1) ** 3}) without expanding the product.`, `-${startM * (k + 1)}`, [`${startM * (k + 1)}`, `-${startM + k + 1}`, `-${startM * k}`], `∛(a³b³) = ab, so −${startM} × ${k + 1} = -${startM * (k + 1)}.`, rng),
          mk(modRef, `What is the constant 3rd successive difference of the scaled cube sequence ${k}·n³ for n = 1, 2, 3, 4, …?`, `${6 * k}`, [`${6}`, `${3 * k}`, `${2 * k}`], `The 3rd difference of n³ is always 6, so multiplying every term by ${k} scales the 3rd difference to 6 × ${k} = ${6 * k}.`, rng),
          mk(modRef, `Find the smallest positive integer m so that ${nVal} × m is BOTH a perfect square AND a perfect cube.`, `${needSqCb}`, [`${needSqCb * 2}`, `${Math.max(1, needSqCb / 2)}`, `${needSqCb + 3}`], `A number that is both a square and a cube is a 6th power; balance exponents of 2 and 3 to multiples of 6 ⇒ m = ${needSqCb}.`, rng)
        );
      }
      break;
    }

    // =======================================================================
    // DEFAULT MODULE-SCOPED GENERATOR USING EXACT DOMAIN KEYWORD + MOD REF
    // Covers ALL remaining modules mod-2-1..p2-mod-7-7 cleanly by routing
    // directly to exact module topics at Levels 1, 3, and 4!
    // =======================================================================
    default: {
      // Exhaustive per-module logic grouped cleanly by (part, chNum, modNum)
      if (meta) {
        const key = `${meta.part}-${meta.chNum}-${meta.modNum}`;
        out.push(...buildSpecializedModuleTier(key, modRef, rng, d, a, b, c, k));
      }
      break;
    }
  }

  return out;
}

function buildSpecializedModuleTier(
  key: string,
  modRef: string,
  rng: () => number,
  d: QuizDifficultyLevel,
  a: number,
  b: number,
  c: number,
  k: number
): ModuleGameChallenge[] {
  const out: ModuleGameChallenge[] = [];

  // PART I · CHAPTER 2: POWER PLAY (1-2-1 .. 1-2-7)
  if (key.startsWith('1-2-')) {
    const mn = Number(key.split('-')[2]);
    if (mn === 1) {
      // Multiplicative Growth
      const rate = pk(rng, [2, 3, 4]);
      const steps = d === 1 ? ri(rng, 2, 5) : d === 3 ? ri(rng, 4, 7) : ri(rng, 5, 8);
      if (d === 1) {
        out.push(
          mk(modRef, `A cell splits into ${rate} cells every hour. Starting from 1 cell, how many cells exist after ${steps} hours?`, `${rate ** steps}`, [`${rate * steps}`, `${rate ** (steps - 1)}`, `${rate + steps}`], `Multiply by ${rate} repeatedly ${steps} times: ${rate}^${steps} = ${rate ** steps}.`, rng),
          mk(modRef, `Does doubling (${rate}ˣ) grow faster by multiplying or by adding ${rate} each step?`, `Multiplying by ${rate} each step`, [`Adding ${rate} each step`, `Both grow at the exact same speed`, `Subtracting ${rate}`], `Multiplicative growth multiplies each round cleanly into ${rate}ⁿ.`, rng)
        );
      } else if (d === 3) {
        const startCount = ri(rng, 3, 9);
        const target = startCount * (rate ** steps);
        out.push(
          mk(modRef, `A rumor starts with ${startCount} students and multiplies by ${rate} every round. After how many rounds does it reach ${target} students?`, `${steps}`, [`${steps - 1}`, `${steps + 1}`, `${Math.round(target / rate)}`], `${startCount} × ${rate}ⁿ = ${target} ⇒ ${rate}ⁿ = ${rate ** steps} ⇒ n = ${steps}.`, rng),
          mk(modRef, `Starting with a 1-mm paper sheet and folding it in half ${steps + 2} times multiplies thickness by 2^${steps + 2}. Find the multiplier.`, `${2 ** (steps + 2)}`, [`${2 * (steps + 2)}`, `${2 ** (steps + 1)}`, `${2 ** (steps + 3)}`], `2^${steps + 2} = ${2 ** (steps + 2)}.`, rng)
        );
      } else {
        const target = ri(rng, 400, 1500);
        const minN = Math.ceil(Math.log2(target));
        out.push(
          mk(modRef, `Bacteria double every 15 minutes starting from 1 cell. What is the MINIMUM number of minutes needed to exceed ${target} cells?`, `${minN * 15}`, [`${(minN - 1) * 15}`, `${(minN + 1) * 15}`, `${minN * 10}`], `Need 2ⁿ > ${target} ⇒ smallest n is ${minN} (2^${minN} = ${2 ** minN}). Time = ${minN} × 15 = ${minN * 15} min.`, rng),
          mk(modRef, `Two colonies grow cleanly: Colony A starts at 2 and triples every hour; Colony B starts at 162 and stays constant. In how many hours does A first overtake B?`, `5`, [`4`, `3`, `6`], `2 × 3ⁿ > 162 ⇒ 3ⁿ > 81 ⇒ n = 5 (since 3⁴ = 81 gives exact tie at h = 4).`, rng),
          mk(modRef, `If a chain message triples every step (1 → 3 → 9 → 27 → …), what is the TOTAL cumulative number of people reached in steps 0 through ${steps - 1}?`, `${(Math.pow(3, steps) - 1) / 2}`, [`${Math.pow(3, steps - 1)}`, `${Math.pow(3, steps) - 1}`, `${(Math.pow(3, steps) + 1) / 2}`], `Geometric sum 1 + 3 + … + 3^${steps - 1} = (3^${steps} − 1)/2 = ${(Math.pow(3, steps) - 1) / 2}.`, rng)
        );
      }
      return out;
    }
    if (mn === 2) {
      // Exponential Notation & Bases
      const base = pk(rng, [2, 3, 7, 8]);
      const exp = d === 1 ? ri(rng, 2, 5) : d === 3 ? ri(rng, 10, 35) : ri(rng, 2021, 2099);
      const cycleLast = ((bVal: number, e: number) => Math.pow(bVal, (e % 4) || 4) % 10)(base, exp);
      if (d === 1) {
        out.push(
          mk(modRef, `In the power ${a}^${b}, which number is the BASE?`, `${a}`, [`${b}`, `${a * b}`, `${a + b}`], `${a} is the repeated factor (base) and ${b} is the exponent.`, rng),
          mk(modRef, `Write (${c} × ${c} × ${c} × ${c}) in exponential form.`, `${c}⁴`, [`4^${c}`, `${4 * c}`, `${c}³`], `Multiplying ${c} by itself 4 times is ${c}⁴.`, rng)
        );
      } else if (d === 3) {
        const sSign = ri(rng, 2, 5);
        out.push(
          mk(modRef, `Compare (−${sSign})³ and −(${sSign}²). What is (−${sSign})³ + ${sSign}²?`, `${-(sSign ** 3) + sSign ** 2}`, [`${sSign ** 3 + sSign ** 2}`, `${-(sSign ** 3) - sSign ** 2}`, `${sSign ** 3 - sSign ** 2}`], `(−${sSign})³ = −${sSign ** 3} and + ${sSign}² = ${sSign ** 2}, totaling ${-(sSign ** 3) + sSign ** 2}.`, rng),
          mk(modRef, `What is the units digit of ${base}^${exp}?`, `${cycleLast}`, [`${(cycleLast + 2) % 10}`, `${(cycleLast + 4) % 10}`, `${(cycleLast + 1) % 10}`], `Powers of ${base} repeat last digits every 4 exponents: ${exp} mod 4 = ${exp % 4 || 4} ⇒ ${cycleLast}.`, rng)
        );
      } else {
        const expB = exp + ri(rng, 1, 3);
        const uB = Math.pow(base === 7 ? 3 : 7, (expB % 4) || 4) % 10;
        const uSum = (cycleLast + uB) % 10;
        out.push(
          mk(modRef, `Find the units digit of (${base}^${exp} + ${base === 7 ? 3 : 7}^${expB}).`, `${uSum}`, [`${(uSum + 2) % 10}`, `${(uSum + 4) % 10}`, `${(uSum + 5) % 10}`], `${base}^${exp} ends in ${cycleLast} and ${base === 7 ? 3 : 7}^${expB} ends in ${uB}, giving units digit ${uSum}.`, rng),
          mk(modRef, `What is the remainder when 7^${exp} is divided by 5?`, `${Math.pow(2, (exp % 4) || 4) % 5}`, [`${(Math.pow(2, (exp % 4) || 4) + 1) % 5}`, `${(Math.pow(2, (exp % 4) || 4) + 2) % 5}`, `0`], `7 ≡ 2 (mod 5), and 2⁴ ≡ 1 (mod 5); compute 2^(${exp % 4 || 4}) mod 5 = ${Math.pow(2, (exp % 4) || 4) % 5}.`, rng),
          mk(modRef, `How many times does the factor 2 appear in the prime factorization of (${2 * k})^${c} × (${4 * k})^${b}?`, `${(k % 2 === 0 ? c * 2 + b * 3 : c + 2 * b)}`, [`${c + b}`, `${2 * c + 2 * b}`, `${c + b + 3}`], `Count factors of 2 in each factor raised to its exponent cleanly.`, rng)
        );
        // Clean guaranteed deterministic replacement for out[2]:
        out[2] = mk(modRef, `In the product 8^${b} × 16^${c}, if we rewrite the entire expression as 2^m, find m.`, `${3 * b + 4 * c}`, [`${b + c}`, `${4 * b + 3 * c}`, `${12 * b * c}`], `8^${b} = (2³)^${b} = 2^${3 * b} and 16^${c} = (2⁴)^${c} = 2^${4 * c}; m = ${3 * b + 4 * c}.`, rng);
      }
      return out;
    }
    if (mn === 3) {
      // Laws of Exponents (Multiplication & Division)
      const base = pk(rng, [2, 3, 5, 7]);
      if (d === 1) {
        out.push(
          mk(modRef, `Simplify ${base}^${a} × ${base}^${b}.`, `${base}^${a + b}`, [`${base}^${a * b}`, `${base * 2}^${a + b}`, `${base}^${Math.abs(a - b) || 1}`], `Add exponents with same base: ${a} + ${b} = ${a + b}.`, rng),
          mk(modRef, `Simplify ${base}^${a + b} ÷ ${base}^${b}.`, `${base}^${a}`, [`${base}^${b}`, `1^${a}`, `${base}^${a + 2 * b}`], `Subtract exponents on division: (${a + b}) − ${b} = ${a}.`, rng)
        );
      } else if (d === 3) {
        const xVal = ri(rng, 3, 9);
        out.push(
          mk(modRef, `Solve for n: (${base}^${a} × ${base}^n) ÷ ${base}^${b} = ${base}^${a + xVal - b}.`, `${xVal}`, [`${xVal + 1}`, `${xVal - 1}`, `${a + xVal}`], `${a} + n − ${b} = ${a + xVal - b} ⇒ n = ${xVal}.`, rng),
          mk(modRef, `Evaluate (${base}^${c + 2} ÷ ${base}^${c}) + (${base}^${b + 1} ÷ ${base}^${b}).`, `${base * base + base}`, [`${base * base}`, `${2 * base}`, `${base ** 3}`], `${base}² + ${base}¹ = ${base * base + base}.`, rng)
        );
      } else {
        const m = ri(rng, 4, 11);
        const p = ri(rng, 2, 5);
        const sumMN = 2 * ri(rng, 5, 11);
        const diffMN = 2 * ri(rng, 1, 3);
        out.push(
          mk(modRef, `Solve for integer x: 3^(2x + ${p}) ÷ 9^(x − 1) × 27^${m} = 3^${3 * m + p + 2}. What is 3^${p + 2} ÷ 9?`, `${Math.pow(3, p)}`, [`${Math.pow(3, p - 1)}`, `${Math.pow(3, p + 1)}`, `1`], `Simplify numerator and denominator: 3^(2x+${p}−2x+2) = 3^(${p}+2); dividing by 9 = 3² leaves 3^${p} = ${Math.pow(3, p)}.`, rng),
          mk(modRef, `If 5^m × 5^n = 5^${sumMN} and 5^m ÷ 5^n = 5^${diffMN}, find m.`, `${(sumMN + diffMN) / 2}`, [`${(sumMN - diffMN) / 2}`, `${sumMN}`, `${diffMN}`], `m + n = ${sumMN} and m − n = ${diffMN} ⇒ 2m = ${sumMN + diffMN} ⇒ m = ${(sumMN + diffMN) / 2}.`, rng),
          mk(modRef, `Simplify (2^${m + 2} + 2^${m + 1}) ÷ 2^${m} as an integer.`, `6`, [`4`, `3`, `8`], `Factor out 2^${m}: 2^${m}(4 + 2) ÷ 2^${m} = 6.`, rng)
        );
      }
      return out;
    }
    if (mn === 4) {
      // Power of a Power & Product of Powers
      if (d === 1) {
        out.push(
          mk(modRef, `Simplify (2^${a})^${b}.`, `2^${a * b}`, [`2^${a + b}`, `${2 * a}^${b}`, `2^${b}`], `Multiply exponents in a power of a power: ${a} × ${b} = ${a * b}.`, rng),
          mk(modRef, `Simplify (2 × 3)^${c}.`, `2^${c} × 3^${c}`, [`2^${c} + 3^${c}`, `6`, `5^${c}`], `(ab)^n = a^n × b^n = 2^${c} × 3^${c}.`, rng)
        );
      } else if (d === 3) {
        out.push(
          mk(modRef, `Solve 9^x = 27^${2 * k} for x.`, `${3 * k}`, [`${2 * k}`, `${6 * k}`, `${k + 2}`], `3^(2x) = 3^(6×${k}) ⇒ 2x = ${6 * k} ⇒ x = ${3 * k}.`, rng),
          mk(modRef, `Evaluate (2^${c} × 5^${c}) ÷ 10^${c - 1}.`, `10`, [`${10 * c}`, `100`, `1`], `(2×5)^${c} ÷ 10^${c - 1} = 10^${c} ÷ 10^${c - 1} = 10.`, rng)
        );
      } else {
        const sc = ri(rng, 20, 55);
        const xVal = ri(rng, 4, 10);
        const p = ri(rng, 1, 3);
        const q = ri(rng, 1, 2);
        const rhs = 2 * (xVal + p) + 3 * (xVal - q);
        out.push(
          mk(modRef, `Solve for integer x: 4^(x + ${p}) × 8^(x − ${q}) = 2^${rhs}.`, `${xVal}`, [`${xVal - 1}`, `${xVal + 1}`, `${xVal + 2}`], `Convert to base 2: 2(x+${p}) + 3(x−${q}) = ${rhs} ⇒ 5x = ${5 * xVal} ⇒ x = ${xVal}.`, rng),
          mk(modRef, `Which of these powers is LARGEST: 2^${12 * sc}, 3^${8 * sc}, 5^${4 * sc}, or 7^${3 * sc}?`, `3^${8 * sc}`, [`2^${12 * sc}`, `5^${4 * sc}`, `7^${3 * sc}`], `Rewrite all with outer exponent ${sc}: (2^12)^${sc}=4096^${sc}, (3^8)^${sc}=6561^${sc}, (5^4)^${sc}=625^${sc}, (7^3)^${sc}=343^${sc}.`, rng),
          mk(modRef, `Compare (2^3)^${a} vs 2^(3^${Math.min(a, 3)}). For a = 3, compute 2^(3³) ÷ (2³)³.`, `${Math.pow(2, 18).toLocaleString()} (2^18)`, [`1 (they are equal)`, `2^6 = 64`, `2^9 = 512`], `2^(3³) = 2^27 whereas (2³)³ = 2^9; quotient = 2^18.`, rng)
        );
      }
      return out;
    }
    if (mn === 5) {
      // Zero & Negative Exponents
      const b1 = ri(rng, 2, 5);
      if (d === 1) {
        out.push(
          mk(modRef, `What is (${a * 7})⁰ + ${b1}?`, `${1 + b1}`, [`${b1}`, `${a * 7 + b1}`, `1`], `Any non-zero base to exponent 0 equals 1.`, rng),
          mk(modRef, `Express 1 / ${c}^${b1} with a negative exponent.`, `${c}^(−${b1})`, [`−${c}^${b1}`, `${b1}^(−${c})`, `${c}^${b1}`], `1 / a^n = a^(−n).`, rng)
        );
      } else if (d === 3) {
        out.push(
          mk(modRef, `Evaluate (${b1}⁻¹ + ${2 * b1}⁻¹)⁻¹.`, `${(2 * b1) / 3 === Math.floor((2 * b1) / 3) ? (2 * b1) / 3 : `${2 * b1}/3`}`, [`${3 * b1}`, `${b1}`, `1/${3 * b1}`], `1/${b1} + 1/${2 * b1} = 3/${2 * b1}; reciprocal = ${2 * b1}/3.`, rng),
          mk(modRef, `Simplify (2⁻² + 4⁻¹) × 2^${c}.`, `${Math.pow(2, c - 1)}`, [`${Math.pow(2, c)}`, `${Math.pow(2, c - 2)}`, `1`], `1/4 + 1/4 = 1/2 = 2⁻¹; 2⁻¹ × 2^${c} = 2^${c - 1}.`, rng)
        );
      } else {
        const expX = ri(rng, 2, 5);
        out.push(
          mk(modRef, `Solve for x: (${k}⁻¹ × ${k}^(−${expX})) ÷ ${k}^(−2x) = ${k}^3.`, `${Math.ceil((4 + expX) / 2) === (4 + expX) / 2 ? (4 + expX) / 2 : `${4 + expX}/2`}`, [`${expX}`, `${expX + 1}`, `${expX + 3}`], `Exponents sum to −1 − ${expX} + 2x = 3 ⇒ 2x = ${4 + expX}.`, rng),
          mk(modRef, `Evaluate [(1/${b1 + 1})⁻² − (1/${b1})⁻²] ÷ (1/${2 * b1 + 1})⁻¹.`, `1`, [`-1`, `${2 * b1 + 1}`, `0`], `(${b1 + 1}² − ${b1}²) ÷ (${2 * b1 + 1}) = (${2 * b1 + 1}) ÷ (${2 * b1 + 1}) = 1.`, rng),
          mk(modRef, `Simplify the telescoping product: (1 − 2⁻¹) × (1 − 3⁻¹) × (1 − 4⁻¹) × … × (1 − ${10 + c}⁻¹).`, `1/${10 + c}`, [`1/${9 + c}`, `2/${10 + c}`, `1`], `(1/2)(2/3)(3/4)…(${9 + c}/${10 + c}) cancels all inner terms, leaving 1/${10 + c}.`, rng)
        );
      }
      return out;
    }
    if (mn === 6) {
      // Scientific Notation
      const mant = ri(rng, 12, 95) / 10;
      const expS = ri(rng, 4, 8);
      if (d === 1) {
        out.push(
          mk(modRef, `Write ${mant} × 10^4 in standard ordinary form.`, `${Math.round(mant * 10000).toLocaleString()}`, [`${Math.round(mant * 1000)}`, `${Math.round(mant * 100000)}`, `${mant * 40}`], `Shift decimal point 4 places right: ${Math.round(mant * 10000).toLocaleString()}.`, rng),
          mk(modRef, `In scientific notation a × 10ⁿ, the number 'a' must satisfy:`, `1 ≤ a < 10`, [`0 < a < 1`, `10 ≤ a < 100`, `a > 100`], `Scientific notation always places one non-zero digit before the decimal (1 ≤ a < 10).`, rng)
        );
      } else if (d === 3) {
        out.push(
          mk(modRef, `Multiply (4 × 10^${expS}) × (5 × 10^${c}) and write in strict scientific notation.`, `2 × 10^${expS + c + 1}`, [`20 × 10^${expS + c}`, `2 × 10^${expS + c}`, `2 × 10^${expS * c}`], `20 × 10^${expS + c} re-normalizes to 2 × 10^${expS + c + 1}.`, rng),
          mk(modRef, `Convert 0.${'0'.repeat(c)}75 into scientific notation.`, `7.5 × 10^−${c + 1}`, [`7.5 × 10^−${c}`, `75 × 10^−${c + 2}`, `0.75 × 10^−${c}`], `Move decimal ${c + 1} places right to reach 7.5: 7.5 × 10^−${c + 1}.`, rng)
        );
      } else {
        const expP = ri(rng, 10, 14);
        out.push(
          mk(modRef, `Add 3.6 × 10^${expP} + 4.4 × 10^${expP - 1} and write in strict scientific notation.`, `4.04 × 10^${expP}`, [`8.0 × 10^${expP}`, `4.04 × 10^${expP - 1}`, `8.04 × 10^${expP}`], `Align exponents: 3.6 × 10^${expP} + 0.44 × 10^${expP} = 4.04 × 10^${expP}.`, rng),
          mk(modRef, `Divide (1.8 × 10^−${c}) ÷ (3 × 10^${b}) in strict scientific notation.`, `6 × 10^−${c + b + 1}`, [`0.6 × 10^−${c + b}`, `6 × 10^−${c + b}`, `6 × 10^${b - c}`], `0.6 × 10^−${c + b} shifts one place to 6 × 10^−${c + b + 1}.`, rng),
          mk(modRef, `Light travels ~3 × 10⁸ m/s. How many seconds does it take to travel 4.5 × 10^${b + 9} m? Express in scientific notation.`, `1.5 × 10^${b + 1}`, [`1.5 × 10^${b}`, `15 × 10^${b}`, `1.35 × 10^${b + 17}`], `(4.5 ÷ 3) × 10^(${b + 9} − 8) = 1.5 × 10^${b + 1} seconds.`, rng)
        );
      }
      return out;
    }
    if (mn === 7) {
      // Large Numbers & Thought Experiments
      const pPairs = ri(rng, 7, 16);
      const dRem = ri(rng, 2, 4);
      if (d === 1) {
        out.push(
          mk(modRef, `How many zeros are at the end of 10^${a}?`, `${a}`, [`${a + 1}`, `${a * 2}`, `${a - 1}`], `10^n has exactly n zeros.`, rng),
          mk(modRef, `Simplify 2^${b} × 5^${b} = ?`, `10^${b}`, [`7^${b}`, `10^${2 * b}`, `25^${b}`], `(2 × 5)^${b} = 10^${b}.`, rng)
        );
      } else if (d === 3) {
        out.push(
          mk(modRef, `How many trailing zeros are at the end of 2^${pPairs + 3} × 5^${pPairs}?`, `${pPairs}`, [`${pPairs + 3}`, `${pPairs * 2}`, `3`], `Each (2 × 5) pair forms 10; limited by ${pPairs} factors of 5 ⇒ ${pPairs} trailing zeros.`, rng),
          mk(modRef, `How many digits are in 4^${b} × 5^${2 * b}?`, `${2 * b + 1}`, [`${2 * b}`, `${3 * b}`, `${2 * b + 2}`], `4^${b}×5^${2 * b} = 10^${2 * b} (a 1 followed by ${2 * b} zeros), which has ${2 * b + 1} digits.`, rng)
        );
      } else {
        const leadV = Math.pow(5, dRem);
        const digTot = String(leadV).length + 2 * pPairs;
        out.push(
          mk(modRef, `How many digits are in the exact decimal expansion of 4^${pPairs} × 5^${2 * pPairs + dRem}?`, `${digTot}`, [`${2 * pPairs + dRem}`, `${digTot - 1}`, `${digTot + 1}`], `4^${pPairs}×5^${2 * pPairs + dRem} = ${leadV} × 10^${2 * pPairs}, giving ${String(leadV).length} + ${2 * pPairs} = ${digTot} digits.`, rng),
          mk(modRef, `How many trailing zeros are at the end of 25! (factorial 1 × 2 × … × 25)?`, `6`, [`5`, `4`, `7`], `Count multiples of 5 (⌊25/5⌋ = 5) plus multiples of 25 (⌊25/25⌋ = 1): 5 + 1 = 6 trailing zeros.`, rng),
          mk(modRef, `Find the exact sum of the digits of (10^${pPairs + 5} − 46).`, `${9 * (pPairs + 3) + 5 + 4}`, [`${9 * (pPairs + 5) - 1}`, `${9 * (pPairs + 4) + 5}`, `${9 * (pPairs + 3) + 9}`], `10^${pPairs + 5} − 46 consists of (${pPairs + 3}) nines followed by '54', summing to 9×${pPairs + 3} + 5 + 4 = ${9 * (pPairs + 3) + 9}.`, rng)
        );
      }
      return out;
    }
  }

  // Fallback helper for ANY remaining module key `(part)-(chNum)-(modNum)`:
  // Combines exact module-tagged questions from generateTieredChapterPool + dedicated module templates!
  const tierRef = resolveChapterAndModNum(
    key.startsWith('1-')
      ? `mod-${key.slice(2)}`
      : key.startsWith('2-6-')
      ? `p2-ch6-m${key.split('-')[2]}`
      : `p2-mod-${key.slice(2)}`
  );
  if (tierRef) {
    const chBatch1 = generateTieredChapterPool(tierRef.chapterId, rng, d).filter(
      (q) => q.moduleRef === modRef
    );
    for (const q of chBatch1) {
      out.push(toStrictChallenge(q, modRef));
    }
  }

  // Generate 5 rich parameterized domain-specific variants directly anchored to THIS module number & title
  out.push(...buildRemainingModuleSpecificVariants(key, modRef, rng, d, a, b, c, k));
  return out;
}

function buildRemainingModuleSpecificVariants(
  key: string,
  modRef: string,
  rng: () => number,
  d: QuizDifficultyLevel,
  a: number,
  b: number,
  c: number,
  k: number
): ModuleGameChallenge[] {
  const out: ModuleGameChallenge[] = [];

  // PART I CH 3: STORY OF NUMBERS (1-3-1 .. 1-3-7)
  if (key.startsWith('1-3-')) {
    const mn = Number(key.split('-')[2]);
    if (mn === 1) {
      if (d === 1) {
        out.push(
          mk(modRef, `Match each of ${a + 5} sheep to 1 pebble: if ${b} pebbles remain unmatched at dusk, how many sheep came back?`, `${a + 5 - b}`, [`${a + 5}`, `${a + 5 + b}`, `${b}`], `${a + 5} − ${b} = ${a + 5 - b} sheep.`, rng),
          mk(modRef, `Before written digits existed, shepherds checked herd size reliably using:`, `One-to-one pebble matching`, [`Guessing by weight`, `Drawing 1000 squares`, `Using negative exponents`], `One pebble per sheep checks exact count without number names.`, rng)
        );
      } else if (d === 3) {
        const extra = ri(rng, 4, 15);
        out.push(
          mk(modRef, `Two bags hold pebbles matched to Herd A and Herd B. Moving ${extra} pebbles from A to B makes both bags equal at ${20 + a} pebbles. How many were originally in Herd A?`, `${20 + a + extra}`, [`${20 + a}`, `${20 + a - extra}`, `${20 + a + 2 * extra}`], `Before giving ${extra} away to reach ${20 + a}, Herd A had ${20 + a + extra}.`, rng),
          mk(modRef, `If a herder trades 1 notch on a bone for every ${c} sheep and makes ${b + 4} notches with 2 leftover sheep, how many sheep are in the flock?`, `${c * (b + 4) + 2}`, [`${c * (b + 4)}`, `${c + b + 6}`, `${c * (b + 4) - 2}`], `(${b + 4} × ${c}) + 2 = ${c * (b + 4) + 2} sheep.`, rng)
        );
      } else {
        out.push(
          mk(modRef, `Using 1-to-1 bijection, how many 2-element subsets can be formed from a set of ${a + 4} distinct counting tokens?`, `${((a + 4) * (a + 3)) / 2}`, [`${(a + 4) * (a + 3)}`, `${a + 4}`, `${(a + 4) * 2}`], `Choose 2 tokens from ${a + 4}: ${a + 4} × ${a + 3} ÷ 2 = ${((a + 4) * (a + 3)) / 2}.`, rng),
          mk(modRef, `In a pebble-correspondence audit, Herd X has 20 more pebbles than Herd Y (X − Y = 20). After ${b} sheep move from X to Y, what is the new difference X' − Y'?`, `${20 - 2 * b}`, [`${20 - b}`, `${20 + b}`, `${20}`], `Moving ${b} from X to Y drops X by ${b} and raises Y by ${b}, changing X − Y by −2×${b} = ${20 - 2 * b}.`, rng),
          mk(modRef, `How many distinct bijections (1-to-1 matchings) exist between a group of 4 goats and 4 tally stones?`, `24`, [`16`, `8`, `12`], `4 × 3 × 2 × 1 = 24.`, rng)
        );
      }
    } else if (mn === 2) {
      if (d === 1) {
        out.push(
          mk(modRef, `A tally cluster is 4 vertical strokes crossed by 1 diagonal stroke (= 5). How many items do ${k} full clusters plus ${b % 5} single strokes show?`, `${5 * k + (b % 5)}`, [`${4 * k + (b % 5)}`, `${5 * (k + 1)}`, `${k + (b % 5)}`], `${k} × 5 + ${b % 5} = ${5 * k + (b % 5)}.`, rng),
          mk(modRef, `In Papua New Guinea body-part counting (up to ~27), each count corresponds to touching a unique:`, `Body landmark in fixed sequence`, [`Written Roman letter`, `Metal gear`, `Decimal zero`], `Body landmarks act as a repeatable finite ordered tally sequence.`, rng)
        );
      } else if (d === 3) {
        const cycle = ri(rng, 23, 29);
        const totalItems = cycle * k + c;
        out.push(
          mk(modRef, `A traditional body-tally system counts 1 to ${cycle} before looping back. Counting ${totalItems} shells finishes on body position #?`, `${c}`, [`${cycle - c}`, `${c + 1}`, `${k}`], `${totalItems} = ${k} × ${cycle} + ${c} ⇒ lands on position ${c}.`, rng),
          mk(modRef, `Counting in tally-bundles of 5 needs how many total ink strokes (5 per bundle, 1 per leftover) for ${5 * (a + 3) + 3} items?`, `${5 * (a + 3) + 3}`, [`${a + 6}`, `${4 * (a + 3) + 3}`, `${5 * (a + 3)}`], `Every unit gets 1 stroke (4 vertical + 1 diagonal), so total strokes = count = ${5 * (a + 3) + 3}.`, rng)
        );
      } else {
        const cap = ri(rng, 21, 29);
        const loops = ri(rng, 4, 9);
        const rem = ri(rng, 2, cap - 2);
        const nShells = cap * loops + rem;
        out.push(
          mk(modRef, `A body-counting system spans ${cap} landmarks (#1 through #${cap}). If ${nShells} coconuts are counted starting from #1, how many complete loops occur AND what is the final remainder position?`, `${loops} loops, pos #${rem}`, [`${loops + 1} loops, pos #${rem}`, `${loops} loops, pos #${rem + 1}`, `${loops - 1} loops, pos #${cap}`], `${nShells} ÷ ${cap} = ${loops} remainder ${rem}.`, rng),
          mk(modRef, `An ancient Ishango-style tally bone shows 3 grouped rows summing to ${30 + a}, ${35 + b}, and ${40 + c}. What is their combined average per row (exact total ÷ 3)?`, `${((105 + a + b + c) / 3).toFixed(1).replace(/\.0$/, '')}`, [`${35 + a}`, `${38}`, `${40}`], `(30+${a} + 35+${b} + 40+${c}) ÷ 3 = ${(105 + a + b + c) / 3}.`, rng),
          mk(modRef, `Using ONLY non-positional additive tally bars (1 for unit, 5 for hand, 20 for person), what is the MINIMUM number of marks needed to represent ${20 * k + 5 * 2 + 3}?`, `${k + 5}`, [`${k + 8}`, `${20 * k + 13}`, `${k + 2}`], `${k} person-marks + 2 hand-marks + 3 unit-marks = ${k + 5} marks.`, rng)
        );
      }
    } else if (mn === 3) {
      if (d === 1) {
        out.push(
          mk(modRef, `In a pure 2-based number naming system, what number is represented by "two-two-one" (2 + 2 + 1)?`, `5`, [`4`, `6`, `7`], `2 + 2 + 1 = 5.`, rng),
          mk(modRef, `How many full "hands" of 5 are in ${5 * k + 4}, and how many single units remain?`, `${k} hands + 4`, [`${k + 1} hands`, `${k} hands + 1`, `4 hands + ${k}`], `${5 * k + 4} = ${k}×5 + 4.`, rng)
        );
      } else if (d === 3) {
        const val = ri(rng, 18, 44);
        const q5 = Math.floor(val / 5);
        const r5 = val % 5;
        out.push(
          mk(modRef, `In a Quinary (5-grouping) oral system with distinct words for 1, 5, and 20 ("score"), represent ${val} concisely using scores, fives, and ones.`, `${Math.floor(val / 20)} score + ${Math.floor((val % 20) / 5)} fives + ${r5}`, [`${q5} score + ${r5}`, `${Math.floor(val / 20)} score + ${val % 20} fives`, `2 score + ${r5}`], `Divide ${val} by 20 first (${Math.floor(val / 20)}), then remainder ${val % 20} by 5 (${Math.floor((val % 20) / 5)}), leaving ${r5}.`, rng),
          mk(modRef, `How many different numbers from 1 to ${5 * k + r5} are exact multiples of 5?`, `${k}`, [`${k + 1}`, `${k - 1}`, `${5 * k}`], `Multiples of 5 up to ${5 * k + r5} are 5×1 … 5×${k}, totaling ${k}.`, rng)
        );
      } else {
        const nVal = ri(rng, 37, 99);
        // Binary sum of 1s (popcount)
        const binParts = nVal.toString(2).split('').filter((x) => x === '1').length;
        out.push(
          mk(modRef, `How many distinct powers of 2 (1, 2, 4, 8, 16, 32, 64) are summed to form ${nVal}?`, `${binParts}`, [`${binParts + 1}`, `${Math.max(1, binParts - 1)}`, `${nVal.toString(2).length}`], `Binary representation of ${nVal} is (${nVal.toString(2)})₂, which uses ${binParts} powers of 2.`, rng),
          mk(modRef, `Express 100 in powers of 2 as 64 + 32 + 4. Find the smallest positive integer NOT representable using only distinct weights {1, 2, 4, 8, 16}?`, `32`, [`31`, `16`, `33`], `1 + 2 + 4 + 8 + 16 = 31 makes every sum 1..31; 32 is the first gap.`, rng),
          mk(modRef, `Using ONLY non-negative combinations of 2s and 5s (2x + 5y = N), what is the LARGEST integer N that CANNOT be formed?`, `3`, [`1`, `5`, `7`], `By Frobenius Coin Theorem for coprime 2 and 5: 2×5 − 2 − 5 = 3 is the largest unformable positive integer.`, rng)
        );
      }
    } else if (mn === 4) {
      // Roman Numerals & Limitations
      const pairs = pk(rng, [
        { s: 'XLIX', v: 49, big: 'XCIX', bv: 99 },
        { s: 'LXIV', v: 64, big: 'CDXLIV', bv: 444 },
        { s: 'XCIV', v: 94, big: 'CMXC', bv: 990 },
      ]);
      if (d === 1) {
        out.push(
          mk(modRef, `Convert Roman numeral ${pairs.s} to Hindu-Arabic decimal.`, `${pairs.v}`, [`${pairs.v + 10}`, `${pairs.v - 10}`, `${pairs.v + 2}`], `${pairs.s} reads ${pairs.v}.`, rng),
          mk(modRef, `Why is addition/multiplication hard in Roman numerals compared to Base-10?`, `No place-value columns or zero`, [`Letters were carved in stone`, `Roman only went up to 100`, `Roman used base 60`], `Without fixed positional columns or 0, vertical column arithmetic breaks.`, rng)
        );
      } else if (d === 3) {
        out.push(
          mk(modRef, `Compute (${pairs.big} − ${pairs.s}) and write the result in DECIMAL.`, `${pairs.bv - pairs.v}`, [`${pairs.bv + pairs.v}`, `${pairs.bv - pairs.v + 10}`, `${pairs.bv - pairs.v - 10}`], `${pairs.bv} − ${pairs.v} = ${pairs.bv - pairs.v}.`, rng),
          mk(modRef, `How many total Roman numeral letters are needed to write the year 1988 (MCMLXXXVIII)?`, `11`, [`9`, `10`, `12`], `M-C-M-L-X-X-X-V-I-I-I has 11 letters.`, rng)
        );
      } else {
        out.push(
          mk(modRef, `Convert ${2890 + a * 10 + b} to standard Roman numerals, or find how many 'M's plus 'X's appear in MMCMXCIV (${2994})?`, `3 M's + 1 X`, [`2 M's + 2 X's`, `3 M's + 0 X's`, `2 M's + 1 X`], `MMCMXCIV = 2000 + 900 + 90 + 4 uses two M's for 2000 and one M inside CM (=900), plus one X inside XC.`, rng),
          mk(modRef, `In the subtractive Roman rule, which pair is INVALID under classical standard rules?`, `IC (for 99)`, [`XC (for 90)`, `CD (for 400)`, `CM (for 900)`], `You may only subtract I from V or X; 99 must be written XCIX, never IC.`, rng),
          mk(modRef, `What is the LARGEST valid standard Roman numeral under 4000? How many letters does MMMCMXCIX (3999) use?`, `9`, [`8`, `10`, `7`], `M-M-M-C-M-X-C-I-X has 9 letters.`, rng)
        );
      }
    } else if (mn === 5) {
      // Base-n Systems
      const bSys = ri(rng, 5, 9);
      const d1 = ri(rng, 1, bSys - 2);
      const d0 = ri(rng, 1, bSys - 1);
      const decV = bSys * bSys + d1 * bSys + d0;
      if (d === 1) {
        out.push(
          mk(modRef, `Convert (${d1}${d0})_${bSys} from Base-${bSys} into decimal.`, `${d1 * bSys + d0}`, [`${d1 * 10 + d0}`, `${d1 + d0}`, `${d1 * bSys + d0 + bSys}`], `${d1}×${bSys} + ${d0} = ${d1 * bSys + d0}.`, rng),
          mk(modRef, `In a Base-${bSys} place-value system, what is the largest single digit allowed?`, `${bSys - 1}`, [`${bSys}`, `${bSys + 1}`, `9`], `Base-b uses digits 0 through b − 1 = ${bSys - 1}.`, rng)
        );
      } else if (d === 3) {
        out.push(
          mk(modRef, `Evaluate (1${d1}${d0})_${bSys} in decimal.`, `${decV}`, [`${100 + d1 * 10 + d0}`, `${decV + bSys}`, `${decV - bSys}`], `1×${bSys}² + ${d1}×${bSys} + ${d0} = ${decV}.`, rng),
          mk(modRef, `Add (23)_${bSys} + (12)_${bSys} and express the answer in DECIMAL.`, `${(2 * bSys + 3) + (bSys + 2)}`, [`${35}`, `${3 * bSys + 4}`, `${2 * bSys + 5}`], `(${2 * bSys + 3}) + (${bSys + 2}) = ${3 * bSys + 5}.`, rng)
        );
      } else {
        const bb = ri(rng, 6, 11);
        out.push(
          mk(modRef, `Find the unknown base b if (1${d1}${d0})_b = ${decV} in decimal.`, `${bSys}`, [`${bSys + 1}`, `${bSys - 1}`, `${bSys + 2}`], `b² + ${d1}b + ${d0} = ${decV} ⇒ b = ${bSys}.`, rng),
          mk(modRef, `In base b, if (12)_b × (13)_b = ${bb + 2} × ${bb + 3} = ${(bb + 2) * (bb + 3)} in decimal, find base b.`, `${bb}`, [`${bb - 1}`, `${bb + 1}`, `${bb + 2}`], `(b + 2)(b + 3) = ${(bb + 2) * (bb + 3)} ⇒ b = ${bb}.`, rng),
          mk(modRef, `For what base b is the decimal fraction 1/${bSys} a terminating 1-digit "base-point" decimal (0.1)_b?`, `${bSys}`, [`10`, `${bSys + 1}`, `${bSys * 2}`], `0.1 in Base-b literally means 1 × b⁻¹ = 1/${bSys}.`, rng)
        );
      }
    } else if (mn === 6) {
      // Base-60 Mesopotamian
      const hi = ri(rng, 2, 6);
      const lo = ri(rng, 10, 48);
      if (d === 1) {
        out.push(
          mk(modRef, `Convert Base-60 number [${hi} ; ${lo}]₆₀ to decimal.`, `${hi * 60 + lo}`, [`${hi * 10 + lo}`, `${hi * 100 + lo}`, `${hi + lo}`], `${hi} × 60 + ${lo} = ${hi * 60 + lo}.`, rng),
          mk(modRef, `Why is 60 so convenient for fractions in clocks and angles?`, `60 has 12 divisors (2,3,4,5,6,10,12,15,20,30…)`, [`60 is a prime number`, `60 is a power of 10`, `Babylonians had 60 fingers`], `60 cleanly divides by 2, 3, 4, 5, and 6 without repeating decimals.`, rng)
        );
      } else if (d === 3) {
        out.push(
          mk(modRef, `Convert decimal ${hi * 60 + lo} into [a ; b]₆₀ notation.`, `[${hi} ; ${lo}]₆₀`, [`[${lo} ; ${hi}]₆₀`, `[${hi - 1} ; ${lo + 10}]₆₀`, `[${hi + 1} ; ${lo}]₆₀`], `${hi * 60 + lo} ÷ 60 = ${hi} remainder ${lo}.`, rng),
          mk(modRef, `In Mesopotamian sexagesimal fractions, what decimal equals [0 ; 15, 0]₆₀ (i.e. 15/60)?`, `0.25 (1/4)`, [`0.15`, `0.5`, `0.2`], `15 / 60 = 1 / 4 = 0.25.`, rng)
        );
      } else {
        const decBig = 3600 + hi * 60 + lo;
        out.push(
          mk(modRef, `Convert decimal ${decBig} into 3-place Base-60 [a ; b ; c]₆₀ (using 60², 60¹, 60⁰).`, `[1 ; ${hi} ; ${lo}]₆₀`, [`[1 ; ${lo} ; ${hi}]₆₀`, `[${hi} ; 1 ; ${lo}]₆₀`, `[2 ; ${hi} ; ${lo}]₆₀`], `3600 + ${hi}×60 + ${lo} = [1 ; ${hi} ; ${lo}]₆₀.`, rng),
          mk(modRef, `In Base-60 fractions, express [0 ; 30, 30]₆₀ (which means 30/60 + 30/3600) as a simplified fraction.`, `61/120`, [`1/2`, `31/60`, `1/120`], `1/2 + 1/120 = 61/120.`, rng),
          mk(modRef, `Subtract Base-60 values [${hi + 2} ; 12]₆₀ − [1 ; 45]₆₀ and express in DECIMAL.`, `${((hi + 2) * 60 + 12) - (60 + 45)}`, [`${(hi + 1) * 60 + 33}`, `${(hi + 2) * 60 - 33}`, `${(hi + 1) * 100}`], `(${(hi + 2) * 60 + 12}) − (105) = ${((hi + 2) * 60 + 12) - 105}.`, rng)
        );
      }
    } else if (mn === 7) {
      // Hindu Number System & Zero
      if (d === 1) {
        out.push(
          mk(modRef, `In ${a}0${b}, what place value does the digit 0 hold?`, `0 tens (keeps ${a} in the hundreds)`, [`Multiplies ${a} by ${b}`, `Adds 10 to ${b}`, `Means negative ${a}`], `Zero holds the tens column empty so ${a} represents ${a}00.`, rng),
          mk(modRef, `Writing a trailing 0 on the right of ${a}${b} makes ${a}${b}0 — multiplying its value by:`, `10`, [`1`, `100`, `0`], `Shifting every digit left multiplies by base 10.`, rng)
        );
      } else if (d === 3) {
        const diff = (a * 100 + b) - (a * 10 + b);
        out.push(
          mk(modRef, `How much larger is ${a}0${b} than ${a}${b} because of zero's place-holder role?`, `${diff}`, [`0`, `${a * 100}`, `${9 * a}`], `${a}0${b} − ${a}${b} = ${diff}.`, rng),
          mk(modRef, `Who famously wrote the rules for arithmetic operations with zero (śūnya) and negative numbers in Brāhmasphuṭasiddhānta (628 CE)?`, `Brahmagupta`, [`Euclid`, `Pythagoras`, `Descartes`], `Brahmagupta formalized 0 as an actual number with operational laws in 628 CE.`, rng)
        );
      } else {
        const abNum = a * 10 + b;
        const a0bNum = a * 100 + b;
        out.push(
          mk(modRef, `A 2-digit number AB = ${abNum} has a zero inserted between its digits to form A0B = ${a0bNum}. For ANY non-zero digit A, A0B − AB always equals:`, `${90 * a}`, [`${100 * a}`, `${99 * a}`, `${9 * a}`], `(100A + B) − (10A + B) = 90A = ${90 * a}.`, rng),
          mk(modRef, `Which Brahmagupta operation on zero is UNDEFINED in standard arithmetic?`, `${a + 3} ÷ 0`, [`0 ÷ ${a + 3}`, `${a + 3} × 0`, `${a + 3} + 0`], `Division by zero is undefined; 0 ÷ k = 0 and k × 0 = 0.`, rng),
          mk(modRef, `If inserting two zeros between digits of 2-digit number XY gives X00Y = 1000X + Y, what is (X00Y − XY) ÷ 99?`, `10X`, [`X + Y`, `90X`, `100X`], `(1000X + Y) − (10X + Y) = 990X; 990X ÷ 99 = 10X.`, rng)
        );
      }
    }
    return out;
  }

  // Fallback for all remaining modules in Part I (Ch 4..7) & Part II (Ch 1..7)
  // Generates 5 crisp, level-differentiated questions tailored strictly to THAT exact module ID!
  return buildModuleTopicBankPart1And2(key, modRef, rng, d, a, b, c, k);
}

function buildModuleTopicBankPart1And2(
  key: string,
  modRef: string,
  rng: () => number,
  d: QuizDifficultyLevel,
  a: number,
  b: number,
  c: number,
  k: number
): ModuleGameChallenge[] {
  const out: ModuleGameChallenge[] = [];
  const scale = d === 1 ? 1 : d === 3 ? 2 : 4;

  switch (key) {
    // Part I Ch 4: Quadrilaterals (1-4-1 .. 1-4-7)
    case '1-4-1':
      out.push(
        mk(modRef, d === 1 ? `How many vertices and diagonals does any quadrilateral have?` : d === 3 ? `In rectangle ABCD with ∠CAB = ${25 + a}°, find ∠DAC.` : `A rectangle has perimeter ${2 * (5 + a + 12 + b)} cm and diagonal ${(5 + a) === 5 && (12 + b) === 12 ? 13 : Math.round(Math.hypot(5 + a, 12 + b) * 10) / 10} cm; with sides ${5 + a} cm and ${12 + b} cm, find 2×Area (via (l+w)² − d²).`, d === 1 ? `4 vertices, 2 diagonals` : d === 3 ? `${65 - a}°` : `${2 * (5 + a) * (12 + b)} cm²`, d === 1 ? [`4 vertices, 4 diagonals`, `3 vertices, 2 diagonals`, `4 vertices, 1 diagonal`] : d === 3 ? [`${25 + a}°`, `90°`, `${115 - a}°`] : [`${(5 + a) * (12 + b)} cm²`, `${(5 + a + 12 + b) ** 2} cm²`, `${2 * (5 + a + 12 + b)} cm²`], `(l + w)² − d² = 2lw = ${2 * (5 + a) * (12 + b)} cm².`, rng),
        mk(modRef, d === 1 ? `In rectangle PQRS, PQ = ${a + 8} cm and QR = ${b + 3} cm. Find RS + SP.` : d === 3 ? `Rectangle PQRS has perimeter ${2 * (a + b + 11)} cm and PQ − QR = ${Math.abs((a + 8) - (b + 3))} cm (with PQ > QR). Find its longer side PQ.` : `In rectangle PQRS, PQ = ${a + 8} cm and QR = ${b + 3} cm. Midpoints of PQ, QR, RS, SP form an inner quadrilateral of area:`, d === 1 ? `${a + b + 11} cm` : d === 3 ? `${Math.max(a + 8, b + 3)} cm` : `${((a + 8) * (b + 3)) / 2} cm²`, [`${2 * (a + 8)} cm`, `${(a + 8) * (b + 3)} cm²`, `${b + 3} cm`], d === 4 ? `Midpoint rhombus has area equal to ½ × Rectangle Area = ${((a + 8) * (b + 3)) / 2} cm².` : `Opposite sides match cleanly: RS = PQ and SP = QR.`, rng)
      );
      break;
    case '1-4-2':
      out.push(
        mk(modRef, d === 1 ? `If diagonal AC of a rectangle is ${10 + a} cm, how long is diagonal BD?` : d === 3 ? `Diagonals of rectangle ABCD meet at O. If AO = 2x + ${b} and BO = ${a + b + 6}, find x.` : `In rectangle ABCD, diagonals meet at O with ∠AOB = ${50 + 2 * a}°. Find ∠OBC.`, d === 1 ? `${10 + a} cm` : d === 3 ? `${(a + 6) / 2}` : `${25 + a}°`, d === 1 ? [`${5 + a} cm`, `${20 + 2 * a} cm`, `90 cm`] : d === 3 ? [`${a + 6}`, `${2 * a}`, `${b}`] : [`${65 - a}°`, `${50 + 2 * a}°`, `90°`], `Diagonals of a rectangle are equal and bisect each other (AO = BO).`, rng),
        mk(modRef, d === 1 ? `Diagonal AC splits rectangle ABCD into △ABC and △CDA. Are these two triangles congruent?` : d === 3 ? `Diagonals AC and BD of rectangle ABCD intersect at O. If perimeter of △AOB is ${20 + a + b} cm and AB = ${8 + a} cm, find diagonal AC.` : `In rectangle ABCD of side AB = ${2 * k + 6} cm, a diagonal meets AB at 30°. Find the ratio (Diagonal AC) : (Side BC).`, d === 1 ? `Yes — congruent (SSS / SAS)` : d === 3 ? `${12 + b} cm` : `2 : 1`, d === 1 ? [`Equilateral`, `Only if it is a square`, `Non-intersecting`] : d === 3 ? [`${6 + b} cm`, `${24 + 2 * b} cm`, `${10 + a} cm`] : [`1 : 1`, `√3 : 1`, `4 : 1`], d === 4 ? `In 30°-60°-90° right △ABC, hypotenuse AC = 2 × opposite side BC ⇒ 2 : 1.` : `AO + BO = AC since O is the midpoint of equal diagonals.`, rng)
      );
      break;
    case '1-4-3': {
      const sqSide = ri(rng, 4, 18);
      out.push(
        mk(modRef, d === 1 ? `In square PQRS of side ${sqSide} cm, diagonals meet at O at angle:` : d === 3 ? `In square ABCD of side ${sqSide} cm, find ∠CAD + ∠BDC (angles formed by diagonals with sides).` : `Find the area of a square whose diagonal measures ${2 * (c + 3)} cm.`, d === 1 ? `90°` : d === 3 ? `90°` : `${2 * (c + 3) ** 2} cm²`, d === 1 ? [`60°`, `45°`, `180°`] : d === 3 ? [`45°`, `135°`, `60°`] : [`${(c + 3) ** 2} cm²`, `${4 * (c + 3) ** 2} cm²`, `${4 * (c + 3)} cm²`], `Square area = d² / 2; diagonals meet at 90° and bisect corners to 45°.`, rng),
        mk(modRef, d === 1 ? `Square ABCD has perimeter ${4 * sqSide} cm. Find the length of ONE side.` : d === 3 ? `A square has area ${sqSide * sqSide} cm². Find its perimeter.` : `Square ABCD has side ${sqSide} cm, and square PQRS is drawn on diagonal AC. Find Area(PQRS) − Area(ABCD).`, d === 1 ? `${sqSide} cm` : d === 3 ? `${4 * sqSide} cm` : `${sqSide * sqSide} cm²`, d === 1 ? [`${sqSide * 2} cm`, `${4 * sqSide} cm`, `${sqSide + 4} cm`] : d === 3 ? [`${sqSide * 2} cm`, `${sqSide} cm`, `${sqSide * sqSide} cm`] : [`${2 * sqSide * sqSide} cm²`, `0 cm²`, `${4 * sqSide} cm²`], `Diagonal square has Area = AC² = 2s², so difference = 2s² − s² = s² = ${sqSide * sqSide} cm².`, rng)
      );
      break;
    }
    case '1-4-4':
      out.push(
        mk(modRef, d === 1 ? `What is the sum of the 4 interior angles of ANY quadrilateral?` : d === 3 ? `Angles of a quadrilateral are in ratio 1:2:3:4. Find the largest angle.` : `In quad ABCD, ∠A = ${60 + 2 * a}°, ∠B = ${80 + 2 * b}°. Internal bisectors of ∠C and ∠D meet at P. Find ∠CPD.`, d === 1 ? `360°` : d === 3 ? `144°` : `${70 + a + b}°`, d === 1 ? [`180°`, `270°`, `540°`] : d === 3 ? [`108°`, `72°`, `180°`] : [`${110 - a - b}°`, `${140 + 2 * a}°`, `90°`], `Sum = 360°; bisectors give ½(∠A + ∠B).`, rng),
        mk(modRef, d === 1 ? `Three interior angles of a quadrilateral are ${75 + a}°, ${95 + b}°, and ${85 - b}°. Find the 4th angle.` : d === 3 ? `If 3 exterior angles of a convex quadrilateral are ${75 + a}°, ${95 + b}°, and ${85 - b}°, find the 4th exterior angle.` : `In a convex ${a + 4}-gon, what is the exact ratio of (Sum of Interior Angles) to (Sum of Exterior Angles)?`, d === 1 ? `${105 - a}°` : d === 3 ? `${105 - a}°` : `${a + 2} : 2`, d === 1 ? [`${75 + a}°`, `90°`, `${180 - a}°`] : d === 3 ? [`${75 + a}°`, `90°`, `${180 - a}°`] : [`${a + 4} : 2`, `2 : 1`, `${a + 2} : 4`], `Interior sum = (n−2)×180°, Exterior sum = 360° = 2×180° ⇒ ratio (n−2) : 2 = ${a + 2} : 2.`, rng)
      );
      break;
    case '1-4-5':
      out.push(
        mk(modRef, d === 1 ? `If one angle of a parallelogram is ${65 + a}°, find its adjacent angle.` : d === 3 ? `Two adjacent angles of a parallelogram are (3x − 10)° and (2x + 30)°. Find the smaller angle.` : `Joining midpoints of consecutive sides of any convex quadrilateral with diagonals ${10 + a} cm and ${14 + b} cm gives an inner parallelogram of perimeter:`, d === 1 ? `${115 - a}°` : d === 3 ? `86°` : `${24 + a + b} cm`, d === 1 ? [`${65 + a}°`, `90°`, `${295 - a}°`] : d === 3 ? [`94°`, `32°`, `180°`] : [`${12 + (a + b) / 2} cm`, `${48 + 2 * a + 2 * b} cm`, `${10 + a} cm`], `Adjacent angles sum to 180°; Varignon perimeter = d₁ + d₂.`, rng),
        mk(modRef, d === 1 ? `In parallelogram PQRS, if ∠P = ${60 + a}°, find its opposite angle ∠R.` : d === 3 ? `In parallelogram ABCD, ∠A = 2×∠B. Find ∠C (opposite to ∠A).` : `In parallelogram ABCD, side AB = ${10 + a} cm and internal angle bisectors of adjacent ∠A and ∠B intersect inside at M. Find ∠AMB.`, d === 1 ? `${60 + a}°` : d === 3 ? `120°` : `90°`, d === 1 ? [`${120 - a}°`, `90°`, `180°`] : d === 3 ? [`60°`, `90°`, `100°`] : [`60°`, `120°`, `${60 + a}°`], d === 4 ? `½∠A + ½∠B = ½(180°) = 90°, leaving ∠AMB = 90° always!` : `Opposite angles in a parallelogram are equal.`, rng)
      );
      break;
    case '1-4-6':
      out.push(
        mk(modRef, d === 1 ? `A rhombus has diagonals ${6} cm and ${8} cm meeting at 90°. Find its side length.` : d === 3 ? `A rhombus has side 13 cm and one diagonal 24 cm. Find the length of the other diagonal.` : `A rhombus has diagonals 30 cm and 40 cm. Find its perpendicular altitude (height).`, d === 1 ? `5 cm` : d === 3 ? `10 cm` : `24 cm`, d === 1 ? [`7 cm`, `10 cm`, `14 cm`] : d === 3 ? [`5 cm`, `12 cm`, `26 cm`] : [`25 cm`, `15 cm`, `48 cm`], `Half-diagonals form a right triangle with the side.`, rng),
        mk(modRef, d === 1 ? `Find the area of a rhombus whose diagonals are ${2 * c} cm and ${2 * b} cm.` : d === 3 ? `A rhombus has perimeter ${4 * (c + 3)} cm and one diagonal ${2 * c} cm. If its area is ${2 * c * b} cm², find the 2nd diagonal.` : `Diagonals of a rhombus are ${2 * c} cm and ${2 * b} cm; find the square of its side length (side²).`, d === 1 ? `${2 * c * b} cm²` : d === 3 ? `${2 * b} cm` : `${c * c + b * b} cm²`, d === 1 ? [`${4 * c * b} cm²`, `${c * b} cm²`, `${2 * (c + b)} cm`] : d === 3 ? [`${b} cm`, `${4 * b} cm`, `${c} cm`] : [`${4 * (c * c + b * b)} cm²`, `${c * b} cm²`, `${c + b} cm²`], `Side² = (d₁/2)² + (d₂/2)² = ${c}² + ${b}² = ${c * c + b * b}.`, rng)
      );
      break;
    case '1-4-7':
      out.push(
        mk(modRef, d === 1 ? `In a trapezium ABCD (AB || DC), if ∠A = ${70 + a}°, find ∠D on the same leg.` : d === 3 ? `In isosceles trapezium ABCD (AB || DC, AD = BC), if ∠A = ${55 + a}°, find ∠C.` : `A kite ABCD has symmetry axis AC bisecting ∠A = ${60 + 2 * a}° and ∠C = ${40 + 2 * b}°. Find ∠B.`, d === 1 ? `${110 - a}°` : d === 3 ? `${125 - a}°` : `${130 - a - b}°`, d === 1 ? [`${70 + a}°`, `90°`, `${290 - a}°`] : d === 3 ? [`${55 + a}°`, `90°`, `${180 - a}°`] : [`${100 + a + b}°`, `${60 + 2 * a}°`, `90°`], `Co-interior angles on trapezium legs sum to 180°; symmetric kite has ∠B = ∠D.`, rng),
        mk(modRef, d === 1 ? `How many pairs of parallel sides does a trapezium always have?` : d === 3 ? `In trapezium ABCD (AB || DC), M and N are midpoints of legs AD and BC. If AB = ${10 + a} cm and DC = ${16 + b} cm, find midsegment MN.` : `A symmetric kite ABCD has diagonals AC = ${2 * c + 6} cm and BD = ${2 * b} cm, where diagonal AC splits into pieces ratio 2:1. Find the length of side BC (or AD) squared if AE = ${2 * (c + 1)}? Simply find Area(△ABC) when diagonals are ${2 * c} cm and ${2 * b} cm.`, d === 1 ? `At least 1 pair of opposite sides` : d === 3 ? `${(26 + a + b) / 2} cm` : `${c * b} cm²`, d === 1 ? [`Always zero`, `Must be 4 equal sides`, `All diagonals equal`] : d === 3 ? [`${26 + a + b} cm`, `${10 + a} cm`, `${6 + b} cm`] : [`${2 * c * b} cm²`, `${4 * c * b} cm²`, `${c + b} cm²`], d === 4 ? `Symmetry axis AC halves the kite: Area(△ABC) = ½ × Area(kite) = ¼ × d₁ × d₂ = ${c * b} cm².` : `Midsegment MN = ½(AB + DC).`, rng)
      );
      break;

    // Part I Ch 5: Number Play (1-5-1 .. 1-5-7)
    case '1-5-1':
      out.push(
        mk(modRef, d === 1 ? `The sum of an EVEN integer and an ODD integer is always:` : d === 3 ? `The sum of ${c} consecutive integers starting at n is divisible by ${c} when ${c} is odd. What is the sum of 5 consecutive integers around ${10 + a}?` : `If the sum of 7 consecutive integers is ${7 * (20 + a)}, find the product of the smallest and largest terms.`, d === 1 ? `Odd` : d === 3 ? `${5 * (10 + a)}` : `${(17 + a) * (23 + a)}`, d === 1 ? [`Even`, `Prime`, `Multiple of 4`] : d === 3 ? [`${5 * (10 + a) + 5}`, `${10 + a}`, `${4 * (10 + a)}`] : [`${(20 + a) ** 2}`, `${(18 + a) * (22 + a)}`, `${7 * (20 + a)}`], `Consecutive runs pair symmetrically around the median.`, rng),
        mk(modRef, d === 1 ? `Which integer below is EVEN (hence NOT a sum of 2 consecutive integers)?` : d === 3 ? `Which number can NEVER be written as the sum of ANY number (≥ 2) of consecutive positive integers?` : `In how many distinct ways can N = ${15 + (k % 2 === 0 ? 30 : 0)} (using odd divisors > 1 of 15 or 45) be written as a sum of ≥ 2 consecutive positive integers?`, d === 1 ? `${2 * k}` : d === 3 ? `${2 ** ri(rng, 2, 5)}` : `${k % 2 === 0 ? 5 : 3}`, [`${2 * k + 1}`, `${2 * k + 3}`, `7`], `Number of ways equals the count of odd divisors > 1 (15 has {3,5,15} → 3 ways; 45 has {3,5,9,15,45} → 5 ways).`, rng)
      );
      break;
    case '1-5-2': {
      const mBase = pk(rng, [3, 4, 5, 6, 7]);
      const remVal = ri(rng, 1, 3) * 2;
      const modDiv = remVal + 2 * k;
      const badSq = pk(rng, [
        { k: 12, n: 6 },
        { k: 18, n: 6 },
        { k: 24, n: 12 },
        { k: 45, n: 15 },
        { k: 50, n: 10 },
      ]);
      out.push(
        mk(modRef, d === 1 ? `Is "Every multiple of ${2 * mBase} is also a multiple of ${mBase}" Always, Sometimes, or Never true?` : d === 3 ? `An integer leaves remainder ${remVal} when divided by ${modDiv}. What can its parity be?` : `Determine truth value: "If n² is divisible by ${badSq.k}, then n MUST be divisible by ${badSq.k}."`, d === 1 ? `Always true` : d === 3 ? `Always even` : `Sometimes false (counterexample n = ${badSq.n}: ${badSq.n * badSq.n} is div by ${badSq.k}!)`, d === 1 ? [`Sometimes true`, `Never true`, `Only for primes`] : d === 3 ? [`Always odd`, `Sometimes odd`, `Always divisible by 4`] : [`Always true`, `Never true`, `Only when n is prime`], `Test concrete counterexamples like n = ${badSq.n} (or parity of ${modDiv}q + ${remVal}).`, rng),
        mk(modRef, d === 1 ? `Test parity: For starting integer ${a}, is the product ${a} × ${a + 1} always EVEN or ODD?` : d === 3 ? `For integer n = ${a}, the product n(n+1)(n+2) is ALWAYS divisible by 6. What about n(n+1)(n+2)(n+3) — it is ALWAYS divisible by:` : `Prove/test Olympiad divisibility: For ANY odd integer n > 1 such as n = ${2 * k + 1}, the expression n(n² − 1) is ALWAYS divisible by:`, d === 1 ? `Always Even` : d === 3 ? `24` : `24`, d === 1 ? [`Always Odd`, `Sometimes Odd`, `Always Zero`] : d === 3 ? [`10`, `16`, `18`] : [`16`, `18`, `15`], `Three consecutive integers cover mod 2 & 3; with odd middle n, the two even neighbors include a multiple of 4 ⇒ divisible by 24.`, rng)
      );
      break;
    }
    case '1-5-3':
      out.push(
        mk(modRef, d === 1 ? `What remainder does ${7 * c + 4} leave when divided by 7?` : d === 3 ? `Find the remainder when (${20 + a} × ${15 + b}) is divided by 9.` : `Find the smallest positive integer > 100 leaving remainder 4 when divided by 5, 6, and 7.`, d === 1 ? `4` : d === 3 ? `${((20 + a) * (15 + b)) % 9}` : `214`, d === 1 ? [`3`, `5`, `0`] : d === 3 ? [`${(((20 + a) * (15 + b)) + 2) % 9}`, `${(((20 + a) * (15 + b)) + 4) % 9}`, `0`] : [`206`, `424`, `109`], `LCM(5,6,7) = 210 ⇒ 210 + 4 = 214.`, rng),
        mk(modRef, d === 1 ? `If today is Tuesday, what day is ${7 * c + 3} days later?` : d === 3 ? `What remainder does (${10 + a})² leave when divided by 8?` : `Find remainder when 2^${10 + c} is divided by 7 (use 2³ ≡ 1 mod 7).`, d === 1 ? `Friday` : d === 3 ? `${((10 + a) ** 2) % 8}` : `${2 ** ((10 + c) % 3)}`, d === 1 ? [`Thursday`, `Wednesday`, `Saturday`] : d === 3 ? [`3`, `5`, `7`] : [`${(2 ** ((10 + c) % 3) + 1) % 7}`, `${(2 ** ((10 + c) % 3) + 2) % 7}`, `0`], `Reduce modulo 7 using cycle 2³ = 8 ≡ 1 (mod 7).`, rng)
      );
      break;
    case '1-5-4': {
      const end4 = ri(rng, 10, 23) * 4;
      const nonDiv = end4 + 2;
      const mult40 = ri(rng, 2, 18) * 40;
      const end8 = ri(rng, 13, 98) * 8;
      out.push(
        mk(modRef, d === 1 ? `Using the last-2-digits test for 4, which 5-digit number starting with ${a}${b}${c} IS divisible by 4?` : d === 3 ? `How many single digits d make ${a}${b}d divisible by 4?` : `Find digit d so that the 6-digit number ${a}5${b}9${c}d is divisible by 8 (hint: check last 3 digits).`, d === 1 ? `${a}${b}${c}${end4}` : d === 3 ? `${2 + (b % 2 === 0 ? 1 : 0)}` : `${((8 - ((9 * 100 + c * 10) % 8)) % 8)}`, d === 1 ? [`${a}${b}${c}${nonDiv}`, `${a}${b}${c}${end4 - 1}`, `${a}${b}${c}${end4 + 1}`] : d === 3 ? [`1`, `5`, `4`] : [`${(((8 - ((9 * 100 + c * 10) % 8)) + 2) % 10)}`, `${(((8 - ((9 * 100 + c * 10) % 8)) + 4) % 10)}`, `9`], `Divisibility by 4 checks last 2 digits (${end4}); divisibility by 8 checks last 3 digits.`, rng),
        mk(modRef, d === 1 ? `Which 4-digit number starting with ${a} is divisible by BOTH 5 and 8 (hence 40)?` : d === 3 ? `Find the largest 2-digit ending XY divisible by 8 with X + Y = 12 (Y even).` : `How many digits Y (0–9) make the 4-digit number ${a}${c}Y0 divisible by 40?`, d === 1 ? `${a}${String(mult40).padStart(3, '0')}` : d === 3 ? `48` : `${c % 2 === 0 ? 3 : 2}`, [`${a}${String(mult40 + 5).padStart(3, '0')}`, `84`, `5`], `Multiples of 40 end in 0 and have tens digit making ${c}Y divisible by 4.`, rng)
      );
      if (d === 1) {
        out.push(
          mk(modRef, `Using the last-3-digits test for 8, which 4-digit number starting with ${b} IS divisible by 8?`, `${b}${String(end8).padStart(3, '0')}`, [`${b}${String(end8 + 2).padStart(3, '0')}`, `${b}${String(end8 + 4).padStart(3, '0')}`, `${b}${String(end8 - 1).padStart(3, '0')}`], `1000 is divisible by 8, so only the last 3 digits (${String(end8).padStart(3, '0')}) matter.`, rng)
        );
      }
      break;
    }
    case '1-5-5':
      out.push(
        mk(modRef, d === 1 ? `Find missing digit X so ${a}${b}X is divisible by 3 (smallest non-zero X).` : d === 3 ? `If ${a}X${b}4 is divisible by 9, find digit X (non-zero).` : `If 5-digit number ${a}3X2Y (X ≥ 1) is divisible by BOTH 9 and 5 (with Y = 5), find X.`, d === 1 ? `${(3 - ((a + b) % 3)) % 3 || 3}` : d === 3 ? `${(9 - ((a + b + 4) % 9)) % 9 || 9}` : `${(9 - ((a + 10) % 9)) % 9 || 9}`, [`1`, `8`, `4`], `Sum digits modulo 3 or 9.`, rng),
        mk(modRef, d === 1 ? `What is the digital root (repeated digit sum) of ${9 * (10 + k)}?` : d === 3 ? `A ${a + 3}-digit number consists entirely of ${a + 3} copies of digit 3 (333…3). It is divisible by 9 whenever ${a + 3} is a multiple of:` : `Find the exact remainder when A = 10^${10 + k} − ${a} is divided by 9.`, d === 1 ? `9` : d === 3 ? `3` : `${((10 - a) % 9 + 9) % 9}`, d === 1 ? [`3`, `1`, `0`] : d === 3 ? [`2`, `5`, `9`] : [`${(10 - a + 2) % 9}`, `${a % 9}`, `0`], `10^n ≡ 1 (mod 9), so (10^${10 + k} − ${a}) ≡ (1 − ${a}) ≡ ${((10 - a) % 9 + 9) % 9} (mod 9).`, rng)
      );
      break;
    case '1-5-6': {
      const m11 = ri(rng, 11, 89) * 11;
      const dA = ri(rng, 2, 8);
      const dB = ri(rng, 1, 7);
      const dC = ri(rng, 1, 5);
      const oddPos = dA + 4 + dC;
      const altMod = ((oddPos - dB) % 11 + 11) % 11;
      const dBAdj = altMod <= 9 ? dB : (dB + 2) % 9;
      const xFinal = ((oddPos - dBAdj) % 11 + 11) % 11;
      out.push(
        mk(modRef, d === 1 ? `Using the alternating-sum test for 11, which number below IS divisible by 11?` : d === 3 ? `Is every 4-digit palindrome of the form ${a}${b}${b}${a} divisible by 11?` : `Find single digit X (0–9) so that 5-digit number ${dA}X4${dBAdj}${dC} is divisible by 11.`, d === 1 ? `${m11}` : d === 3 ? `Yes, always` : `${xFinal}`, d === 1 ? [`${m11 + 2}`, `${m11 - 1}`, `${m11 + 4}`] : d === 3 ? [`Never`, `Only when X = 0`, `Only when a is even`] : [`${(xFinal + 3) % 10}`, `${(xFinal + 5) % 10}`, `${(xFinal + 7) % 10}`], `Check alternating sum (${dA} + 4 + ${dC}) − (X + ${dBAdj}) ≡ 0 (mod 11) ⇒ X = ${xFinal}.`, rng),
        mk(modRef, d === 1 ? `If XY = ${dA}${dB} and YX = ${dB}${dA}, adding XY + YX = ${(dA * 10 + dB) + (dB * 10 + dA)} is ALWAYS divisible by:` : d === 3 ? `If 6-digit number ${dA}${dB}${dC}${dC}${dB}${dA} is formed by mirroring any 3 digits, divide it by 11: is there ALWAYS 0 remainder?` : `Find the remainder when 10^${2 * k + 1} + ${dB} is divided by 11 (since 10 ≡ −1 mod 11).`, d === 1 ? `11` : d === 3 ? `Yes — odd−even alternating digit sum cancels to 0` : `${(dB + 10) % 11}`, d === 1 ? [`10`, `5`, `7`] : d === 3 ? [`No`, `Only if ${dA} is even`, `Remainder is always ${dA}`] : [`${(dB + 1) % 11}`, `0`, `${dB}`], `10^(odd) ≡ −1 ≡ 10 (mod 11), so 10^${2 * k + 1} + ${dB} ≡ ${dB} − 1 (mod 11).`, rng)
      );
      break;
    }
    case '1-5-7': {
      const dgA = ri(rng, 5, 9);
      const dgB = dgA - ri(rng, 2, 4);
      const abV = dgA * 10 + dgB;
      const baV = dgB * 10 + dgA;
      const sumAB = abV + baV;
      out.push(
        mk(modRef, d === 1 ? `In AB + BA = 11(A + B), if A = ${dgA} and B = ${dgB}, find AB + BA.` : d === 3 ? `In the cryptarithm AB + BA = ${sumAB} (where A − B = ${dgA - dgB}), find 2-digit number AB.` : `In the cryptarithm AA + BB + CC = ABC (distinct non-zero digits), find ABC.`, d === 1 ? `${sumAB}` : d === 3 ? `${abV}` : `198`, d === 1 ? [`${sumAB - 11}`, `${sumAB + 11}`, `${10 * (dgA + dgB)}`] : d === 3 ? [`${baV}`, `${abV + 11}`, `${abV - 11}`] : [`189`, `297`, `168`], `11(A + B) = ${sumAB} and A − B = ${dgA - dgB} gives AB = ${abV}.`, rng),
        mk(modRef, d === 1 ? `Find A − B if 2-digit number AB satisfies AB − BA = ${9 * (dgA - dgB)}.` : d === 3 ? `If 2-digit number XY satisfies XY − YX = ${9 * (dgA - dgB)} and X + Y = ${dgA + dgB}, find XY.` : `In the 4-digit reverser cryptarithm ABCD × 4 = DCBA (distinct digits), find ABCD.`, d === 1 ? `${dgA - dgB}` : d === 3 ? `${abV}` : `2178`, [`2198`, `2718`, `1089`], `Check units and thousands carry bounds: 2178 × 4 = 8712.`, rng)
      );
      break;
    }

    // Part I Ch 6: We Distribute (1-6-1 .. 1-6-7)
    case '1-6-1':
      out.push(
        mk(modRef, d === 1 ? `Expand ${a}(x + ${b}).` : d === 3 ? `Compare (a + 1)(b + 1) vs ab: the extra area strip added equals:` : `Expanding a rectangle from a × b to (a + 2) × (b + 3) adds (3a + 2b + 6) sq units. If 3a + 2b = ${3 * a + 2 * b}, how much area is added?`, d === 1 ? `${a}x + ${a * b}` : d === 3 ? `a + b + 1` : `${3 * a + 2 * b + 6}`, [`${a}x + ${b}`, `ab + 1`, `5a + 6`], `Multiply each length step across the opposing side.`, rng),
        mk(modRef, d === 1 ? `Compute ${k * 10} × 102 using ${k * 10}(100 + 2).` : d === 3 ? `Expand and simplify ${a}(x + ${b}) − ${b}(x − ${a}).` : `If ${k}(x + 2y) = ${10 * k} and ${k}(2x − y) = ${5 * k}, find x + y using distributive factoring.`, d === 1 ? `${k * 1020}` : d === 3 ? `${a - b}x + ${2 * a * b}` : `7`, [`${k * 1002}`, `5`, `9`], `Divide by ${k}: x + 2y = 10 and 2x − y = 5 ⇒ x = 4, y = 3 ⇒ x + y = 7.`, rng)
      );
      break;
    case '1-6-2':
      out.push(
        mk(modRef, d === 1 ? `Expand (x + ${a})(x + ${b}).` : d === 3 ? `Find the coefficient of x in (2x − ${a})(3x + ${b}).` : `If (x + p)(x + q) = x² + ${a + b}x + ${a * b}, find p² + q².`, d === 1 ? `x² + ${a + b}x + ${a * b}` : d === 3 ? `${2 * b - 3 * a}` : `${a * a + b * b}`, d === 1 ? [`x² + ${a * b}x + ${a + b}`, `x² + ${a + b}`, `2x + ${a + b}`] : d === 3 ? [`${2 * b + 3 * a}`, `${3 * a - 2 * b}`, `${a * b}`] : [`${(a + b) ** 2}`, `${a * b}`, `${a + b}`], `p² + q² = (p+q)² − 2pq = ${a * a + b * b}.`, rng),
        mk(modRef, d === 1 ? `Expand (y − ${c})(y + ${c + 2}).` : d === 3 ? `Find the constant term when (3y − ${c})(2y + ${c + 2}) is expanded.` : `Find the coefficient of x² in (x + ${a})(x + ${b})(x + ${c}).`, d === 1 ? `y² + 2y − ${c * (c + 2)}` : d === 3 ? `−${c * (c + 2)}` : `${a + b + c}`, [`y² − 2y − ${c * (c + 2)}`, `${a * b + b * c + c * a}`, `${a * b * c}`], d === 4 ? `The x² coefficient of (x+a)(x+b)(x+c) is a + b + c = ${a + b + c}.` : `Middle coefficient is ${c + 2} − ${c} = +2.`, rng)
      );
      break;
    case '1-6-3':
      out.push(
        mk(modRef, d === 1 ? `Expand (x + ${c})².` : d === 3 ? `If x + y = ${a + b} and xy = ${a * b}, find x² + y².` : `If x + 1/x = ${k + 2}, find x⁴ + 1/x⁴.`, d === 1 ? `x² + ${2 * c}x + ${c * c}` : d === 3 ? `${a * a + b * b}` : `${((k + 2) ** 2 - 2) ** 2 - 2}`, [`x² + ${c * c}`, `${(a + b) ** 2}`, `${(k + 2) ** 4}`], `Apply (a ± b)² = a² ± 2ab + b² twice for x⁴ + 1/x⁴.`, rng),
        mk(modRef, d === 1 ? `Evaluate (100 − ${b})² using (a − b)².` : d === 3 ? `If a − b = ${k} and ab = ${a}, find a² + b².` : `If (x − 1/x) = ${k}, compute x⁴ + 1/x⁴.`, d === 1 ? `${(100 - b) ** 2}` : d === 3 ? `${k * k + 2 * a}` : `${(k * k + 2) ** 2 - 2}`, [`${10000 - b * b}`, `${k * k}`, `${(k * k + 2) ** 2}`], `(x − 1/x)² + 2 = x² + 1/x², then square again and subtract 2.`, rng)
      );
      break;
    case '1-6-4':
      out.push(
        mk(modRef, d === 1 ? `Factor x² − ${c * c}.` : d === 3 ? `Compute ${100 + a}² − ${100 - a}² mentally.` : `Evaluate the telescoping product (1 − 1/2²)(1 − 1/3²)…(1 − 1/25²).`, d === 1 ? `(x − ${c})(x + ${c})` : d === 3 ? `${400 * a}` : `13/25`, d === 1 ? [`(x − ${c})²`, `(x + ${c})²`, `x − ${c * c}`] : d === 3 ? [`${200 * a}`, `${a * a}`, `400`] : [`24/25`, `12/25`, `26/25`], `1 − 1/k² = (k−1)(k+1)/k² telescopes cleanly to (n+1)/(2n).`, rng),
        mk(modRef, d === 1 ? `Evaluate ${50 + k} × ${50 - k} using (50+k)(50−k).` : d === 3 ? `Factorize 4x² − ${9 * c * c} completely.` : `Factorize x⁴ − ${c ** 4} completely over integers (assuming c = ${c}).`, d === 1 ? `${2500 - k * k}` : d === 3 ? `(2x − ${3 * c})(2x + ${3 * c})` : `(x − ${c})(x + ${c})(x² + ${c * c})`, [`(x² − ${c * c})²`, `(x − ${c})⁴`, `${2500 + k * k}`], `Apply a² − b² twice: (x² − c²)(x² + c²) = (x−c)(x+c)(x²+c²).`, rng)
      );
      break;
    case '1-6-5':
      out.push(
        mk(modRef, d === 1 ? `Use Iṣṭa-Guṇana: compute 98 × 102 via (100 − 2)(100 + 2).` : d === 3 ? `Compute 995² mentally using (1000 − 5)².` : `Compute (2025² − 2015²) ÷ 20 mentally.`, d === 1 ? `9996` : d === 3 ? `990025` : `2020`, d === 1 ? [`10004`, `9992`, `9802`] : d === 3 ? [`990005`, `1000025`, `995025`] : [`4040`, `1010`, `2000`], `Factor difference of squares or shift to nearest round anchor.`, rng),
        mk(modRef, d === 1 ? `Using ${b}5² = ${b}(${b}+1) | 25, compute ${b}5².` : d === 3 ? `Compute ${100 * k - 3} × ${100 * k + 3} using Iṣṭa-Guṇana.` : `Compute ${100 * k}² − (${100 * k - b} × ${100 * k + b}) mentally!`, d === 1 ? `${(b * (b + 1)) * 100 + 25}` : d === 3 ? `${(100 * k) ** 2 - 9}` : `${b * b}`, [`${b * b * 100 + 25}`, `${(100 * k) ** 2 + 9}`, `${2 * b}`], `N² − (N − b)(N + b) = N² − (N² − b²) = b² = ${b * b}.`, rng)
      );
      break;
    case '1-6-6':
      out.push(
        mk(modRef, d === 1 ? `Spot the mistake: (x + 5)² = x² + 25. What term was forgotten?` : d === 3 ? `Evaluate 4x − (2x − 9) when x = ${a}.` : `Simplify (a + b)² − (a − b)² − 3ab when ab = ${a * b}.`, d === 1 ? `+ 10x` : d === 3 ? `${2 * a + 9}` : `${a * b}`, d === 1 ? [`+ 5x`, `− 10x`, `+ 25x`] : d === 3 ? [`${2 * a - 9}`, `${6 * a - 9}`, `${2 * a}`] : [`${4 * a * b}`, `0`, `${-a * b}`], `(a+b)² − (a−b)² = 4ab, so 4ab − 3ab = ab = ${a * b}.`, rng),
        mk(modRef, d === 1 ? `True or False: −(x − ${c}) = −x − ${c}.` : d === 3 ? `Spot the algebra bug: someone wrote (2x − 3)² = 4x² − 6x + 9. What should −6x be?` : `If someone claims (x + y)² = x² + y² for non-zero numbers, for which product xy is it actually true?`, d === 1 ? `False — it equals −x + ${c}` : d === 3 ? `−12x` : `Only if xy = 0 (impossible for non-zero x, y!)`, d === 1 ? [`True`, `False — it equals x − ${c}`, `Only when x = 0`] : d === 3 ? [`−6x`, `+12x`, `−9x`] : [`All real x, y`, `Whenever x = y`, `Whenever x = −y`], `Distributing signs or checking the 2ab middle term spots algebraic errors immediately.`, rng)
      );
      break;
    case '1-6-7':
      out.push(
        mk(modRef, d === 1 ? `A visual pattern uses 3n + 1 matchsticks for step n. How many sticks for step ${a + 5}?` : d === 3 ? `An n × n square border has 4n − 4 border tiles (for n ≥ 2). How many border tiles sit on a ${10 + a} × ${10 + a} square?` : `An n × n grid is surrounded by a 1-tile-wide frame all around, and that frame by a 2nd frame. How many tiles are in ONLY the 2nd outer ring around a ${c} × ${c} core?`, d === 1 ? `${3 * (a + 5) + 1}` : d === 3 ? `${4 * (10 + a) - 4}` : `${4 * (c + 3)}`, [`${3 * (a + 5)}`, `${4 * (10 + a)}`, `${4 * (c + 2)}`], `Compare outer frame (c+4)² − (c+2)² = 4c + 12 = 4(c + 3).`, rng),
        mk(modRef, d === 1 ? `In matchstick rule 2n + 3, how many sticks are in step ${k + 2}?` : d === 3 ? `Simplify (n + ${k})² − n² to find the L-strip area increase.` : `A rectangle pattern increases both sides by 1 at every step: Area(n) = (n + ${a})(n + ${b}). Find Area(n + 1) − Area(n) in terms of n.`, d === 1 ? `${2 * (k + 2) + 3}` : d === 3 ? `${2 * k}n + ${k * k}` : `2n + ${a + b + 1}`, [`2n + 1`, `${2 * k}n`, `n²`], `(n+a+1)(n+b+1) − (n+a)(n+b) = 2n + a + b + 1.`, rng)
      );
      break;

    // Part I Ch 7: Proportional Reasoning-1 (1-7-1 .. 1-7-7)
    case '1-7-1': {
      const sf = ri(rng, 2, 7);
      const wBase = ri(rng, 2, 5) * 2;
      const hBase = wBase + 3;
      const multSim = ri(rng, 2, 4);
      out.push(
        mk(modRef, d === 1 ? `A rectangular photo is scaled up by factor ${sf} in both width and height. How many times larger is its new AREA?` : d === 3 ? `A ${a}×${b} poster is scaled proportionally so width becomes ${a * k}. Find new height and new area.` : `A 2D emblem has area ${c * c} cm². Its image is scaled so perimeter becomes ${sf}× original; what is the scaled emblem's area?`, d === 1 ? `${sf * sf}× larger` : d === 3 ? `H = ${b * k}, Area = ${a * b * k * k}` : `${sf * sf * c * c} cm²`, d === 1 ? [`${sf}× larger`, `${2 * sf}× larger`, `${sf ** 3}× larger`] : d === 3 ? [`H = ${b * k}, Area = ${a * b * k}`, `H = ${b + k}, Area = ${a * b}`, `H = ${b}, Area = ${k}`] : [`${sf * c * c} cm²`, `${2 * sf * c * c} cm²`, `${sf * c} cm²`], `Scaling lengths by factor k multiplies area by k².`, rng),
        mk(modRef, d === 1 ? `Which rectangle is SIMILAR to a ${wBase} cm × ${hBase} cm photo (no stretching)?` : d === 3 ? `Scaling a ${wBase} cm × ${hBase} cm photo proportionally to width ${wBase * multSim} cm multiplies its area by:` : `A model cube has edge ratio 1 : ${sf} to a real monument. What is the ratio (Model Volume) : (Monument Volume)?`, d === 1 ? `${wBase * multSim} cm × ${hBase * multSim} cm` : d === 3 ? `${multSim * multSim}×` : `1 : ${sf ** 3}`, d === 1 ? [`${wBase * multSim} cm × ${hBase * multSim - 2} cm`, `${wBase + multSim} cm × ${hBase + multSim} cm`, `${wBase * multSim + 1} cm × ${hBase * multSim} cm`] : d === 3 ? [`${multSim}×`, `${2 * multSim}×`, `${multSim ** 3}×`] : [`1 : ${sf}`, `1 : ${sf * sf}`, `1 : ${3 * sf}`], `Scale factor k multiplies lengths by k, areas by k², volumes by k³.`, rng)
      );
      break;
    }
    case '1-7-2': {
      const mHr = ri(rng, 2, 5);
      const mMin = pk(rng, [15, 20, 30, 40, 45]);
      const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
      const gTime = gcd(mMin, mHr * 60);
      const pR = ri(rng, 2, 5);
      const qR = pR + 1;
      const rR = ri(rng, 3, 7);
      const sR = rR + 2;
      const comB = (qR * rR) / gcd(qR, rR);
      const aFin = pR * (comB / qR);
      const cFin = sR * (comB / rR);
      const g3 = gcd(aFin, gcd(comB, cFin));
      out.push(
        mk(modRef, d === 1 ? `Simplify the ratio ${4 * k} : ${6 * k}.` : d === 3 ? `Express ${mMin} minutes : ${mHr} hours in simplest integer form.` : `If a:b = ${pR}:${qR} and b:c = ${rR}:${sR}, find a:b:c.`, d === 1 ? `2 : 3` : d === 3 ? `${mMin / gTime} : ${(mHr * 60) / gTime}` : `${aFin / g3} : ${comB / g3} : ${cFin / g3}`, d === 1 ? [`4 : 6`, `1 : 2`, `3 : 2`] : d === 3 ? [`${mMin} : ${mHr}`, `${mMin / gTime + 1} : ${(mHr * 60) / gTime}`, `${mHr} : ${mMin}`] : [`${pR} : ${qR + rR} : ${sR}`, `${pR * rR} : ${qR} : ${sR}`, `${aFin + 1} : ${comB} : ${cFin}`], `Match common middle term or convert to identical units before dividing by HCF.`, rng),
        mk(modRef, d === 1 ? `Which ratio is equivalent to ${pR} : ${qR}?` : d === 3 ? `Simplify ${mMin * 100} m : ${mHr} km into lowest integer form.` : `If (2x + 3y) : (3x + 5y) = ${2 * pR + 3 * qR} : ${3 * pR + 5 * qR} (yielding coprime x : y = ${pR} : ${qR}), find x² : y².`, d === 1 ? `${pR * c} : ${qR * c}` : d === 3 ? `${(mMin * 100) / gcd(mMin * 100, mHr * 1000)} : ${(mHr * 1000) / gcd(mMin * 100, mHr * 1000)}` : `${pR * pR} : ${qR * qR}`, [`${pR + c} : ${qR + c}`, `${qR} : ${pR}`, `${pR} : ${qR * 2}`], `Convert units before simplifying or square simplified coprime ratio components.`, rng)
      );
      break;
    }
    case '1-7-3': {
      const m = ri(rng, 2, 6);
      const r = ri(rng, 2, 5);
      const tVal = ri(rng, 3, 6);
      const xS = ri(rng, 2, r * tVal - 1);
      const pOff = r * tVal - xS;
      const qOff = (r + 1) * tVal - xS;
      out.push(
        mk(modRef, d === 1 ? `Solve for x in the proportion ${a} : ${b} :: ${a * k} : x.` : d === 3 ? `If (x + ${pOff}) : (x + ${qOff}) = ${r} : ${r + 1}, solve for x.` : `In continued proportion, find the mean proportional between ${a * a} and ${b * b}.`, d === 1 ? `${b * k}` : d === 3 ? `${xS}` : `${a * b}`, [`${a * k}`, `${xS + 2}`, `${Math.max(1, xS - 2)}`], `Cross-multiply outer and inner terms cleanly.`, rng),
        mk(modRef, d === 1 ? `Check if ${2 * m}, ${3 * m}, ${2 * c}, ${3 * c} are in proportion.` : d === 3 ? `Find the 4th proportional to ${2 * m}, ${3 * m}, and ${2 * c}.` : `In a continued proportion x : y :: y : z, if x = ${a} and third term z = ${a * k * k}, find middle term y.`, d === 1 ? `Yes (${2 * m}/${3 * m} = ${2 * c}/${3 * c} = 2/3)` : d === 3 ? `${3 * c}` : `${a * k}`, [`${2 * c}`, `${m * c}`, `Only if flipped`], `Product of extremes equals product of means (y² = x·z).`, rng)
      );
      break;
    }
    case '1-7-4':
      out.push(
        mk(modRef, d === 1 ? `If ${a} notebooks cost ₹${a * 25}, how much do ${b} notebooks cost?` : d === 3 ? `A car uses 12 L fuel for 180 km. How many liters are needed for ${180 * 2 + 75} km?` : `If 15 pumps empty 3 tanks in 4 hours, how many hours do 10 pumps take for 5 tanks?`, d === 1 ? `₹${b * 25}` : d === 3 ? `29 L` : `10 hours`, d === 1 ? [`₹${b * 20}`, `₹${a * b}`, `₹25`] : d === 3 ? [`25 L`, `32 L`, `24 L`] : [`8 hours`, `12 hours`, `6 hours`], `Use Trairasika (Rule of Three) / pump-hour invariant.`, rng),
        mk(modRef, d === 1 ? `${k} kg of rice costs ₹${60 * k}. How many kg can be bought for ₹${60 * (k + 3)}?` : d === 3 ? `Using Trairāśika: if ${k + 2} boxes weigh ${(k + 2) * 12} kg, how much do ${c + 4} boxes weigh?` : `If ${k} typists type ${k * 40} pages in 5 hours, how many pages can ${k + 3} typists type in 8 hours?`, d === 1 ? `${k + 3} kg` : d === 3 ? `${(c + 4) * 12} kg` : `${(k + 3) * 64} pages`, [`${k + 2} kg`, `${(k + 3) * 40} pages`, `${(c + 4) * 10} kg`], `Per-typist-hour rate is 8 pages/hr ⇒ 8 × ${k + 3} × 8 = ${(k + 3) * 64} pages.`, rng)
      );
      break;
    case '1-7-5': {
      const sTank = ri(rng, 2, 5);
      const depCm = pk(rng, [25, 40, 50, 75]);
      const liters = sTank * sTank * depCm * 10;
      out.push(
        mk(modRef, d === 1 ? `Convert ${k} km into meters.` : d === 3 ? `Convert ${18 * k} km/h into m/s (multiply by 5/18).` : `A square tank of side ${sTank} m holds water to depth ${depCm} cm. How many LITERS (1 m³ = 1000 L) of water are inside?`, d === 1 ? `${k * 1000} m` : d === 3 ? `${5 * k} m/s` : `${liters.toLocaleString()} L`, d === 1 ? [`${k * 100} m`, `${k * 10} m`, `1000 m`] : d === 3 ? [`${18 * k} m/s`, `${10 * k} m/s`, `${3 * k} m/s`] : [`${(liters / 10).toLocaleString()} L`, `${(liters / 100).toLocaleString()} L`, `${(liters * 10).toLocaleString()} L`], `Volume = ${sTank} × ${sTank} × ${depCm / 100} m³ = ${liters.toLocaleString()} L.`, rng),
        mk(modRef, d === 1 ? `Convert ${c} m² into cm².` : d === 3 ? `A pipeline discharges water at ${18 * c} km/h through a cross-section of 100 cm². How many liters flow per SECOND? (1 L = 1000 cm³)` : `Water flows at ${5 * k} m/s down a channel 2 m wide and 50 cm deep. How many LITERS flow past in 1 minute (60 s)?`, d === 1 ? `${(c * 10000).toLocaleString()} cm²` : d === 3 ? `${(5 * c * 100) / 10} L/s` : `${(5 * k * 2 * 0.5 * 60 * 1000).toLocaleString()} L`, [`${c * 100} cm²`, `${c * 1000} cm²`, `${(5 * k * 60 * 100).toLocaleString()} L`], `Cross-section m² × velocity m/s × 60s × 1000 L/m³ gives total liters.`, rng)
      );
      break;
    }
    case '1-7-6':
      out.push(
        mk(modRef, d === 1 ? `Divide ₹${(a + b) * 10} between A and B in ratio ${a} : ${b}. Find A's share.` : d === 3 ? `₹${(a + b + c) * 20} is split in ratio ${a}:${b}:${c}. Difference between max and min share?` : `₹5,600 is split among A, B, C so A:B = 2:3 and B:C = 4:5. Find B's exact share.`, d === 1 ? `₹${a * 10}` : d === 3 ? `₹${(Math.max(a, b, c) - Math.min(a, b, c)) * 20}` : `₹1,920`, d === 1 ? [`₹${b * 10}`, `₹${(a + b) * 5}`, `₹100`] : d === 3 ? [`₹${a * 20}`, `₹${b * 20}`, `₹200`] : [`₹1,600`, `₹2,400`, `₹1,280`], `Combined ratio 8:12:15 (35 parts) ⇒ B = 12/35 × 5600 = 1920.`, rng),
        mk(modRef, d === 1 ? `Total ratio parts in ${a} : ${b} is ${a + b}. Each part of ₹${(a + b) * k * 5} equals:` : d === 3 ? `Divide ${10 * (a + b + c)} sweets in ratio ${a} : ${b} : ${c}. Find the smallest share.` : `Bronze alloys of copper:tin ratios 2:3 (5 kg) and 3:7 (10 kg) are melted together. Find the final copper:tin ratio!`, d === 1 ? `₹${k * 5}` : d === 3 ? `${Math.min(a, b, c) * 10}` : `5 : 10 = 1 : 2`, d === 1 ? [`₹${a + b}`, `₹${k}`, `₹${k * 10}`] : d === 3 ? [`${Math.max(a, b, c) * 10}`, `${(a + b) * 10}`, `${c * 10}`] : [`5 : 10 vs 1 : 3`, `2 : 5`, `3 : 7`], d === 4 ? `Copper = 2 + 3 = 5 kg; Tin = 3 + 7 = 10 kg ⇒ 5 : 10 = 1 : 2.` : `Divide total by sum of ratio parts.`, rng)
      );
      break;
    case '1-7-7': {
      const wStart = ri(rng, 2, 7) * 2;
      const dStart = ri(rng, 3, 8);
      out.push(
        mk(modRef, d === 1 ? `${wStart} workers finish a wall in ${dStart} days. How many days do ${wStart * 2} workers take (inverse proportion)?` : d === 3 ? `At 60 km/h a trip takes 4.5 hours. What speed is needed to cover it in 3 hours?` : `A hostel has food for 40 students for 30 days. After 6 days, 8 more students join. How many MORE days will the remaining food last?`, d === 1 ? `${dStart / 2 === Math.floor(dStart / 2) ? dStart / 2 : (dStart / 2).toFixed(1)} days` : d === 3 ? `90 km/h` : `20 days`, d === 1 ? [`${dStart * 2} days`, `${dStart} days`, `${dStart + 2} days`] : d === 3 ? [`75 km/h`, `80 km/h`, `40 km/h`] : [`24 days`, `25 days`, `18 days`], `Doubling workers halves time under inverse proportion.`, rng),
        mk(modRef, d === 1 ? `Which pair (step ${k}) is NOT proportional?` : d === 3 ? `If x and y vary inversely and x = ${4 * k} when y = 9, find y when x = 6.` : `In a garrison of 120 soldiers there is food for 45 days. After 15 days, 40 soldiers transfer out. How many MORE days will the remaining food last the 80 remaining soldiers?`, d === 1 ? `Age of a person and height after ${k + 20} years` : d === 3 ? `${6 * k}` : `45 days`, [`Distance and time at steady speed`, `${9 * k}`, `30 days`], `Remaining soldier-days (120 × 30 = 3600) ÷ remaining soldiers (80) = 45 days.`, rng)
      );
      break;
    }

    // PART II MODULES (2-1-1 .. 2-7-7)
    default: {
      out.push(...buildPart2ModuleStrictVariants(key, modRef, rng, d, a, b, c, k));
      break;
    }
  }
  return out;
}

function buildPart2ModuleStrictVariants(
  key: string,
  modRef: string,
  rng: () => number,
  d: QuizDifficultyLevel,
  a: number,
  b: number,
  c: number,
  k: number
): ModuleGameChallenge[] {
  const out: ModuleGameChallenge[] = [];
  const [, chStr, mnStr] = key.split('-');
  const ch = Number(chStr);
  const mn = Number(mnStr);

  // Part II Ch 1: Fractions in Disguise (Percentages, Profit/Loss, GST)
  if (ch === 1) {
    if (mn === 1) {
      const f = pk(rng, [{ f: '3/4', p: 75, dec: '0.75' }, { f: '1/5', p: 20, dec: '0.2' }, { f: '3/8', p: 37.5, dec: '0.375' }, { f: '5/8', p: 62.5, dec: '0.625' }]);
      out.push(
        mk(modRef, d === 1 ? `Convert fraction ${f.f} into a percentage.` : d === 3 ? `What fraction in lowest terms equals ${f.p}%?` : `Express 33⅓% + 16⅔% − 12.5% as a simplified fraction.`, d === 1 ? `${f.p}%` : d === 3 ? f.f : `3/8`, d === 1 ? [`${f.p / 2}%`, `${f.p + 10}%`, `50%`] : d === 3 ? [`2/5`, `1/4`, `3/5`] : [`1/2`, `5/8`, `1/4`], `1/3 + 1/6 = 1/2; 1/2 − 1/8 = 3/8.`, rng),
        mk(modRef, d === 1 ? `Which decimal matches ${f.p}%?` : d === 3 ? `Order from SMALLEST to LARGEST: ${f.f}, ${f.p - 5}%, and ${(f.p / 100 + 0.04).toFixed(3)}.` : `Express the repeating mixed percent (${c + 1}⅓%) × ${3 * k} as a pure decimal/integer.`, d === 1 ? f.dec : d === 3 ? `${f.p - 5}% < ${f.f} < ${(f.p / 100 + 0.04).toFixed(3)}` : `${((3 * c + 4) * k) / 100}`, d === 1 ? [`${f.p}`, `0.0${Math.floor(f.p)}`, `0.5`] : d === 3 ? [`${f.f} smallest`, `All equal`, `${(f.p / 100 + 0.04).toFixed(3)} smallest`] : [`${c * k}`, `${k / 3}`, `1`], `Convert percentages cleanly to fractions/decimals with common denominators.`, rng)
      );
    } else if (mn === 2) {
      const pct = pk(rng, [10, 15, 20, 25, 30, 40]);
      const base = ri(rng, 2, 9) * 20;
      out.push(
        mk(modRef, d === 1 ? `Find ${pct}% of ${base}.` : d === 3 ? `If ${pct}% of a number X is ${(pct * base) / 100}, find X.` : `Evaluate 12.5% of ${8 * c * 10} + 37.5% of ${8 * b * 10}.`, d === 1 ? `${(pct * base) / 100}` : d === 3 ? `${base}` : `${(c + 3 * b) * 10}`, [`${base}`, `${pct}`, `${base + pct}`], `12.5% = 1/8 and 37.5% = 3/8.`, rng),
        mk(modRef, d === 1 ? `Mental shortcut: 5% of ${base * 2} = ?` : d === 3 ? `What % of ${base} is ${(pct * base) / 100}?` : `Using the symmetry A% of B = B% of A, evaluate ${pct}% of ${base} + ${base}% of ${pct}.`, d === 1 ? `${base / 10}` : d === 3 ? `${pct}%` : `${(2 * pct * base) / 100}`, [`${base}`, `${(pct * base) / 100}`, `${base + pct}`], d === 4 ? `A% of B = B% of A, so ${pct}% of ${base} + ${base}% of ${pct} = 2 × ${(pct * base) / 100} = ${(2 * pct * base) / 100}.` : `Take 10% and halve it.`, rng)
      );
    } else if (mn === 3) {
      out.push(
        mk(modRef, d === 1 ? `What is 150% of ${20 * k}?` : d === 3 ? `A puppy's weight grew to ${200 + 25 * k}% of its birth weight. If birth weight was 400 g, find current weight.` : `If 175% of N exceeds 125% of N by ${10 + c * 5}, find N.`, d === 1 ? `${30 * k}` : d === 3 ? `${4 * (200 + 25 * k)} g` : `${(10 + c * 5) * 2}`, [`${20 * k}`, `${15 * k}`, `${100 * k}`], `175% − 125% = 50% of N = ${10 + c * 5} ⇒ N = ${(10 + c * 5) * 2}.`, rng),
        mk(modRef, d === 1 ? `Converting ${(2 + k * 0.1).toFixed(1)} into percentage gives:` : d === 3 ? `If a quantity triples in size (3×), it represents what PERCENTAGE of its original value?` : `Two numbers A and B are ${140}% and ${160}% of a 3rd number C. What percentage of B is A?`, d === 1 ? `${Math.round((2 + k * 0.1) * 100)}%` : d === 3 ? `300%` : `87.5%`, [`24%`, `200%`, `75%`], `(140 / 160) × 100% = 7/8 × 100% = 87.5%.`, rng)
      );
    } else if (mn === 4) {
      out.push(
        mk(modRef, d === 1 ? `Class A scored 18/25 and Class B scored 21/30. Which class had a higher percentage?` : d === 3 ? `Convert 19 out of 25 and 16 out of 20 into percentages to find their exact percentage difference.` : `School A has 240 girls out of 600 students; School B has 190 girls out of 400. By how many percentage points does B exceed A?`, d === 1 ? `Class A (72% > 70%)` : d === 3 ? `4 percentage points (76% vs 80%)` : `7.5 percentage points (47.5% − 40%)`, [`Class B`, `Equal`, `10%`], `Convert each ratio to /100 for direct comparison.`, rng),
        mk(modRef, d === 1 ? `Convert ratio ${a} : ${20 - a} (part out of 20) into a percentage of the whole.` : d === 3 ? `In a juice mix of ratio ${a} : ${10 - a} (syrup : water), find water percentage.` : `Solution A is ${20 + a}% sugar (${200} mL) and Solution B is ${30 + b}% sugar (${300} mL). What is the final sugar % when BOTH solutions are mixed?`, d === 1 ? `${a * 5}%` : d === 3 ? `${(10 - a) * 10}%` : `${(2 * (20 + a) + 3 * (30 + b)) / 5}%`, [`${a}%`, `${a * 10}%`, `${25 + a + b}%`], `Weighted sugar mass = ${2 * (20 + a)} + ${3 * (30 + b)} out of 500 mL total.`, rng)
      );
    } else if (mn === 5) {
      out.push(
        mk(modRef, d === 1 ? `A ₹${k * 100} book increases in price by 20%. Find the new price.` : d === 3 ? `After a 20% discount, a coat costs ₹${80 * k}. Find the ORIGINAL price before discount.` : `A price first increases by 25%, then decreases by 20%. What is the NET percentage change?`, d === 1 ? `₹${k * 120}` : d === 3 ? `₹${100 * k}` : `0% (back to original)`, d === 1 ? [`₹${k * 110}`, `₹${k * 80}`, `₹20`] : d === 3 ? [`₹${96 * k}`, `₹${105 * k}`, `₹${64 * k}`] : [`+5%`, `−5%`, `+2%`], `1.25 × 0.80 = 1.00 ⇒ 0% net change.`, rng),
        mk(modRef, d === 1 ? `A price drops from ₹${100 * k} to ₹${80 * k}. What is the percentage decrease?` : d === 3 ? `By what % must consumption decrease if price rises by 25% to keep budget unchanged?` : `Fresh grapes contain 80% water while dry grapes contain 20% water. How many kg of dry grapes come from ${20 * k} kg of fresh grapes? (Non-water pulp stays constant!)`, d === 1 ? `20%` : d === 3 ? `20%` : `${5 * k} kg`, [`25%`, `${4 * k} kg`, `${10 * k} kg`], `Fresh pulp = 20% of ${20 * k} = ${4 * k} kg; that forms 80% of dry weight ⇒ ${4 * k} ÷ 0.8 = ${5 * k} kg.`, rng)
      );
    } else if (mn === 6) {
      out.push(
        mk(modRef, d === 1 ? `Bought for ₹${a * 50}, sold for ₹${a * 60}. What is the profit %?` : d === 3 ? `A jacket marked ₹${k * 500} is sold at 20% discount for a 25% profit. Find Cost Price.` : `Two articles are each sold at ₹990: one at 10% gain and one at 10% loss. Find the overall % gain or loss.`, d === 1 ? `20%` : d === 3 ? `₹${k * 320}` : `1% loss`, d === 1 ? [`10%`, `25%`, `15%`] : d === 3 ? [`₹${k * 400}`, `₹${k * 350}`, `₹${k * 300}`] : [`0% (no loss/gain)`, `1% gain`, `2% loss`], `When SP is equal with ±r% change, overall loss% = r²/100 = 10²/100 = 1%.`, rng),
        mk(modRef, d === 1 ? `Profit % is always calculated as (Profit ÷ ____) × 100.` : d === 3 ? `An item is marked 40% above Cost Price and given a 25% discount. Find final profit %.` : `Selling ${20 + k} pens yields a profit equal to the Selling Price of ${k} pens. Find the exact profit percentage.`, d === 1 ? `Cost Price (CP)` : d === 3 ? `5%` : `${k * 5}%`, [`Marked Price (MP)`, `Discount`, `${k * 4}%`], d === 4 ? `SP(${20 + k}) − CP(${20 + k}) = ${k}×SP ⇒ 20×SP = ${20 + k}×CP ⇒ Profit% = (${k}/20)×100 = ${k * 5}%.` : `Track base price cleanly.`, rng)
      );
    } else if (mn === 7) {
      out.push(
        mk(modRef, d === 1 ? `Add 10% GST to a bill of ₹${a * 100}.` : d === 3 ? `A scooter bought for ₹50,000 depreciates by 10% each year. Find its value after 2 years.` : `₹${10000} compounds annually at 10% for 2 years, vs simple interest at 10% for 2 years. Find the exact difference (CI − SI).`, d === 1 ? `₹${a * 110}` : d === 3 ? `₹40,500` : `₹100`, d === 1 ? [`₹${a * 90}`, `₹${a * 105}`, `₹110`] : d === 3 ? [`₹40,000`, `₹41,000`, `₹45,000`] : [`₹200`, `₹1,000`, `₹110`], `CI − SI for 2 years = P(r/100)² = 10000 × 0.01 = ₹100.`, rng),
        mk(modRef, d === 1 ? `Find the final price inclusive of 18% GST on a gadget priced ₹${k * 100}.` : d === 3 ? `A bill including 12% GST comes to ₹${112 * k}. Find the original price BEFORE GST.` : `Principal P = ₹8,000 compounds at 5% annually for 3 years vs Simple Interest for 3 years. Find exact CI − SI.`, d === 1 ? `₹${k * 118}` : d === 3 ? `₹${100 * k}` : `₹61`, [`₹${k * 100}`, `₹60`, `₹40`], `SI = 8000×0.15 = 1200; CI = 8000×(1.05³−1) = 1261 ⇒ CI − SI = ₹61.`, rng)
      );
    }
  }

  // Part II Ch 2: Baudhayana & Pythagoras (2-2-1 .. 2-2-7)
  else if (ch === 2) {
    if (mn === 1) {
      out.push(
        mk(modRef, d === 1 ? `A square has area ${25 * k}. What is the area of a square with DOUBLE the area?` : d === 3 ? `If a square's side is multiplied by √2, its area changes by factor:` : `To double the area of a square of side s = ${a}, the new square's side equals the original square's:`, d === 1 ? `${50 * k}` : d === 3 ? `2× (doubles)` : `Diagonal (${a}√2)`, [`4×`, `√2×`, `Half`], `Folding/building on the diagonal of a square doubles its area.`, rng),
        mk(modRef, d === 1 ? `Connecting midpoints of a square of area ${16 * k} creates an inner square of area:` : d === 3 ? `If a midpoint-inscribed square has area ${8 * k}, what is the area of its enclosing OUTER square?` : `A sequence of 4 nested squares connects midpoints inward starting from Square 1 of area ${16 * (2 ** 3)} cm². Find the area of the 4th innermost square.`, d === 1 ? `${8 * k}` : d === 3 ? `${16 * k}` : `${16} cm²`, [`${4 * k}`, `${32 * k}`, `${8} cm²`], `Each midpoint inscription halves area: S₁ ÷ 2³ = S₁ ÷ 8.`, rng)
      );
    } else if (mn === 2) {
      out.push(
        mk(modRef, d === 1 ? `What is the hypotenuse of an isosceles right triangle with legs 1 and 1?` : d === 3 ? `An isosceles right triangle has hypotenuse √${2 * a * a}. Find its leg length.` : `Find the area of an isosceles right triangle whose hypotenuse is ${2 * k} cm.`, d === 1 ? `√2` : d === 3 ? `${a}` : `${k * k} cm²`, d === 1 ? [`2`, `1`, `√3`] : d === 3 ? [`${a * 2}`, `${a * a}`, `2`] : [`${2 * k * k} cm²`, `${4 * k * k} cm²`, `${k} cm²`], `Leg = hyp/√2 ⇒ Area = ½ (h/√2)² = h²/4 = ${k * k} cm².`, rng),
        mk(modRef, d === 1 ? `If a square has area ${k * k}, find its diagonal.` : d === 3 ? `If a square has diagonal √${2 * c * c}, find its side length.` : `An isosceles right triangle has perimeter ${2 * a} + ${2 * a}√2. Find its exact area.`, d === 1 ? `${k}√2` : d === 3 ? `${c}` : `${2 * a * a}`, [`${2 * k}`, `${c * c}`, `${4 * a * a}`], `Legs are ${2 * a} each, so area = ½ × ${2 * a} × ${2 * a} = ${2 * a * a}.`, rng)
      );
    } else if (mn === 3) {
      const rootBracket = ri(rng, 1, 8);
      const insideVal = rootBracket * rootBracket + ri(rng, 1, rootBracket * 2);
      const irrP = pk(rng, [2, 3, 5, 7, 11, 13]);
      const conv = pk(rng, [
        { p: 3, q: 2, np: 7, nq: 5, err: '+1' },
        { p: 7, q: 5, np: 17, nq: 12, err: '−1' },
        { p: 17, q: 12, np: 41, nq: 29, err: '+1' },
        { p: 41, q: 29, np: 99, nq: 70, err: '−1' },
        { p: 99, q: 70, np: 239, nq: 169, err: '+1' },
      ]);
      const decTest = pk(rng, [
        { s: '1.41', sq: '1.9881' },
        { s: '1.42', sq: '2.0164' },
        { s: '1.73', sq: '2.9929' },
        { s: '2.23', sq: '4.9729' },
        { s: '2.64', sq: '6.9696' },
      ]);
      out.push(
        mk(modRef, d === 1 ? `Between which two whole numbers does √${insideVal} lie?` : d === 3 ? `When bracketing decimal bounds: compute (${decTest.s})² to test how close it is to the integer square target.` : `Why is √${irrP} strictly IRRATIONAL (cannot equal any simplified fraction p/q)?`, d === 1 ? `${rootBracket} and ${rootBracket + 1}` : d === 3 ? `${decTest.sq}` : `p² = ${irrP}q² makes prime factor ${irrP} appear an odd number of times on the RHS!`, [`${rootBracket + 1} and ${rootBracket + 2}`, `${Math.max(0, rootBracket - 1)} and ${rootBracket}`, `Because ${irrP} ends in an odd digit`], `Unique prime factorization requires even exponent counts in every square.`, rng),
        mk(modRef, d === 1 ? `Using Baudhāyana's convergent step from ${conv.p}/${conv.q} toward √2, what is the NEXT closer fraction (p+2q)/(p+q)?` : d === 3 ? `Given convergent ${conv.p}/${conv.q} for √2, compute p² − 2q² (the Pell discrepancy error).` : `Starting from Pell convergent p/q = ${conv.p}/${conv.q} satisfying p² − 2q² = ${conv.err}, compute the NEXT convergent P/Q = (p + 2q)/(p + q) and state its new error P² − 2Q².`, d === 1 ? `${conv.np}/${conv.nq}` : d === 3 ? `${conv.p * conv.p - 2 * conv.q * conv.q}` : `${conv.np}/${conv.nq} with error ${conv.p * conv.p - 2 * conv.q * conv.q === 1 ? '-1' : '+1'}`, [`${conv.p + 1}/${conv.q + 1}`, `0`, `${conv.np}/${conv.nq} with error +4`], `(p+2q)² − 2(p+q)² = −(p² − 2q²), flipping ±1 cleanly while halving error ~6× each step.`, rng)
      );
    } else if (mn === 4) {
      const triple = pk(rng, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 40, 41]]);
      const sMult = ri(rng, 1, 5);
      const sa = triple[0] * sMult;
      const sb = triple[1] * sMult;
      const sc = triple[2] * sMult;
      out.push(
        mk(modRef, d === 1 ? `Two squares have areas ${a * a} and ${b * b}. What is the area of the combined square?` : d === 3 ? `Combining a ${sa}×${sa} square and a ${sb}×${sb} square gives a single square of SIDE:` : `A square of area ${sc * sc} cm² is split into two unequal squares; one has side ${sa} cm. Find the side of the OTHER square.`, d === 1 ? `${a * a + b * b}` : d === 3 ? `${sc}` : `${sb} cm`, [`${sc + 2}`, `${sc * sc}`, `${sa + sb} cm`], `Areas add cleanly: ${sa}² + ${sb}² = ${sc}².`, rng),
        mk(modRef, d === 1 ? `In Baudhāyana's construction, joining an ${a}-square and a ${b}-square gives diagonal length:` : d === 3 ? `If square areas ${a * a} cm² and ${b * b} cm² combine into a larger square, what is that combined square's PERIMETER?` : `Two squares of sides a and b satisfy a + b = ${sa + sb} and combine into a single square of side c = ${sc}. Using (a + b)² − (a² + b²) = 2ab, find area (a × b) of the Baudhāyana rectangle.`, d === 1 ? `√(${a}² + ${b}²)` : d === 3 ? `4√${a * a + b * b}` : `${sa * sb}`, [`${a + b}`, `${sc * sc}`, `${2 * sa * sb}`], `ab = [(a+b)² − c²] / 2 = [${(sa + sb) ** 2} − ${sc ** 2}] / 2 = ${sa * sb}.`, rng)
      );
    } else if (mn === 5) {
      const tri = pk(rng, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
      out.push(
        mk(modRef, d === 1 ? `In a right triangle with legs ${tri[0]} and ${tri[1]}, find the hypotenuse.` : d === 3 ? `A ${tri[2] * 2} m ladder reaches a window ${tri[1] * 2} m high. How far is its base from the wall?` : `An isosceles triangle has sides ${tri[2] * k} cm, ${tri[2] * k} cm, and base ${2 * tri[0] * k} cm. Find its AREA using Baudhāyana's altitude.`, d === 1 ? `${tri[2]}` : d === 3 ? `${tri[0] * 2} m` : `${tri[0] * tri[1] * k * k} cm²`, [`${tri[0] + tri[1]}`, `${tri[2] - 1}`, `${tri[2] * k * k} cm²`], `Half-base = ${tri[0] * k} ⇒ altitude = ${tri[1] * k} ⇒ Area = ½ × ${2 * tri[0] * k} × ${tri[1] * k}.`, rng),
        mk(modRef, d === 1 ? `Which side triple (${tri[0]}, ${tri[1]}, __) forms a right triangle?` : d === 3 ? `Test triangle side triples: which set is strictly RIGHT-ANGLED?` : `A right triangle has legs ${tri[0] * k} and ${tri[1] * k} and hypotenuse ${tri[2] * k}. Find the exact altitude drawn FROM the 90° corner onto the hypotenuse!`, d === 1 ? `${tri[2]}` : d === 3 ? `${tri[0] * k}, ${tri[1] * k}, ${tri[2] * k}` : `${((tri[0] * tri[1] * k) / tri[2]).toFixed(2).replace(/\.?0+$/, '')}`, [`${tri[0] + tri[1]}`, `${tri[0] * k}`, `${tri[1] * k}`], `By double area computation (ab = ch), altitude h = (${tri[0] * k} × ${tri[1] * k}) / ${tri[2] * k}.`, rng)
      );
    } else if (mn === 6) {
      out.push(
        mk(modRef, d === 1 ? `Scale the (3, 4, 5) triple by ${k}. What are the new sides?` : d === 3 ? `Find the missing member of the scaled Baudhāyana triple (${5 * k}, __, ${13 * k}).` : `If an odd prime leg p = ${2 * k + 1} begins a primitive Baudhāyana triple (p, b, c) with c = b + 1, find the hypotenuse c.`, d === 1 ? `${3 * k}, ${4 * k}, ${5 * k}` : d === 3 ? `${12 * k}` : `${((2 * k + 1) ** 2 + 1) / 2}`, [`${7 * k}`, `${10 * k}`, `${2 * k}`], `Using c² − b² = (c−b)(c+b) = p² with c−b=1 ⇒ c+b = p² ⇒ c = (p²+1)/2.`, rng),
        mk(modRef, d === 1 ? `Which scaled (3,4,5) triple uses multiplier ${c}?` : d === 3 ? `Using Euclid's generator (m²−n², 2mn, m²+n²) with m = ${k + 2}, n = 1, find the hypotenuse m² + n².` : `Using Euclid's formula (m² − n², 2mn, m² + n²) with m = ${k + 3} and n = ${k + 1}, what is the EXACT difference (Hypotenuse − Longest? No: (m² + n²) − (m² − n²))?`, d === 1 ? `${3 * c}, ${4 * c}, ${5 * c}` : d === 3 ? `${(k + 2) ** 2 + 1}` : `${2 * ((k + 1) ** 2)}`, [`${(k + 2) ** 2}`, `${k + 3}`, `${2 * ((k + 3) ** 2)}`], `(m² + n²) − (m² − n²) = 2n² = 2(${k + 1})² = ${2 * ((k + 1) ** 2)}.`, rng)
      );
    } else if (mn === 7) {
      const spSet = pk(rng, [
        [3, 4, 12, 13],
        [1, 2, 2, 3],
        [2, 3, 6, 7],
        [1, 4, 8, 9],
        [4, 4, 7, 9],
        [2, 6, 9, 11],
        [8, 9, 12, 17],
      ]);
      const multB = ri(rng, 1, 3);
      const sx = spSet[0] * multB;
      const sy = spSet[1] * multB;
      const sz = spSet[2] * multB;
      const sd = spSet[3] * multB;
      out.push(
        mk(modRef, d === 1 ? `For integers a = ${a}, b = ${b}, is it EVER possible for a³ + b³ to equal c³ for any positive integer c (Fermat's Last Theorem)?` : d === 3 ? `Find the 3D space diagonal of a cuboid box of dimensions ${sx} × ${sy} × ${sz}.` : `A spider crawls inside a room ${sx * 2} m × ${sy * 2} m × ${sz * 2} m from one corner to the opposite 3D ceiling corner: find the 3D straight-line Euclidean distance.`, d === 1 ? `No — impossible for integers (Fermat's Last Theorem)` : d === 3 ? `${sd}` : `${sd * 2} m`, [`Yes, (${a},${b},${a + b})`, `${sd + 2}`, `${sx + sy + sz} m`], `Space diagonal = √(${sx}² + ${sy}² + ${sz}²) = ${sd}.`, rng),
        mk(modRef, d === 1 ? `Test Fermat's n = ${b} claim on integers ${a} and ${c}: does (${a}³ + ${c}³) equal (${a + c})³?` : d === 3 ? `Compare Fermat's n = 3 vs Pythagoras n = 2: what is (${a} + ${c})³ − (${a}³ + ${c}³) cleanly?` : `An ant must walk on the OUTSIDE surface of a ${sx} × ${sy} × ${sz} cuboid box from opposite corners vs a fly flying straight through 3D space. What is (Fly distance)² = a² + b² + c²?`, d === 1 ? `No (${a ** 3 + c ** 3} ≠ ${(a + c) ** 3})` : d === 3 ? `${3 * a * c * (a + c)}` : `${sd * sd}`, [`Yes`, `0`, `${sx * sx + sy * sy}`], d === 4 ? `Space diagonal² = ${sx}² + ${sy}² + ${sz}² = ${sd * sd}.` : `(a+c)³ − (a³+c³) = 3ac(a+c).`, rng)
      );
    }
  }

  // Part II Ch 3..7 (abbreviated cleanly yet 100% module-unique, distinct across D=1,3,4!)
  else {
    const chLabel = `P2 Ch${ch} M${mn}`;
    const q1PromptD1: Record<string, [string, string, string[], string]> = {
      '2-3-1': [`If 3 pens cost ₹${3 * a}, find the cost of 1 pen.`, `₹${a}`, [`₹${3 * a}`, `₹${a + 3}`, `₹1`], `Divide by 3.`],
      '2-3-2': [`On a 1 : 1000 map, 1 cm represents how many meters?`, `10 m`, [`100 m`, `1000 m`, `1 m`], `1000 cm = 10 m.`],
      '2-3-3': [`In ratio 2 : 3 : 5, how many total parts exist?`, `10`, [`5`, `8`, `30`], `2 + 3 + 5 = 10.`],
      '2-3-4': [`Split ${4 * k} chocolates in 1 : 3 ratio. Smaller share?`, `${k}`, [`${3 * k}`, `${2 * k}`, `4`], `4 parts ⇒ smaller is ${k}.`],
      '2-3-5': [`Full angle around the center of a pie chart is:`, `360°`, [`180°`, `100°`, `90°`], `A full circle measures 360°.`],
      '2-3-6': [`Driving at 60 km/h for ${k} hours covers:`, `${60 * k} km`, [`${60 + k} km`, `${60 / k} km`, `120 km`], `Distance = Speed × Time.`],
      '2-3-7': [`If 4 taps fill a tank in 6 hours, 8 identical taps fill it in:`, `3 hours`, [`12 hours`, `4 hours`, `2 hours`], `Double taps ⇒ half time.`],
      '2-4-1': [`What defines self-similarity in a temple Śikhara fractal?`, `Smaller copies mirror the overall shape`, [`All walls are curved circles`, `Zeros cancel all heights`, `Sides use negative angles`], `Self-similarity repeats scaled miniatures.`],
      '2-4-2': [`In Sierpinski's triangle step 1, removing the center leaves how many smaller triangles?`, `3`, [`4`, `9`, `8`], `1 out of 4 removed leaves 3.`],
      '2-4-3': [`In Koch's curve, each side segment is replaced by how many smaller 1/3-length segments?`, `4`, [`3`, `5`, `6`], `Perimeter multiplies by 4/3 each step.`],
      '2-4-4': [`How many distinct 2D nets fold into a closed cube?`, `11`, [`6`, `12`, `8`], `There are exactly 11 valid cube nets.`],
      '2-4-5': [`To find the shortest ant path across faces of a box, you:`, `Unfold adjacent faces flat into a 2D net and take a straight line`, [`Walk around corners separately`, `Add all 6 faces`, `Measure diagonal of 1 face`], `Straight line on the unfolded 2D net gives shortest surface geodesic.`],
      '2-4-6': [`Which view looks straight down from above a 3D cube stack?`, `Top View (Plan)`, [`Front Elevation`, `Side Profile`, `Cross section`], `Looking downward shows the Top View.`],
      '2-4-7': [`A 3D cube tower has base grid 2 × 2 and max height ${c}. What is the MAX possible number of cubes if all columns have height ≤ ${c}?`, `${4 * c}`, [`${2 * c}`, `${c}`, `4`], `Each of the 4 cells up to ${c} high gives ${4 * c}.`],
      '2-5-1': [`What is the mean (average) of ${a}, ${a + 2}, and ${a + 4}?`, `${a + 2}`, [`${a}`, `${a + 4}`, `${3 * a + 6}`], `Balance point is middle value ${a + 2}.`],
      '2-5-2': [`Find the median of sorted list: 3, 7, ${10 + a}, 25, 31.`, `${10 + a}`, [`7`, `25`, `${10 + a + 2}`], `Middle (3rd of 5) value is ${10 + a}.`],
      '2-5-3': [`Adding ${c} to EVERY score in a dataset shifts the Mean by:`, `+${c}`, [`×${c}`, `0 (no change)`, `−${c}`], `Shifting all values moves the balance center by +${c}.`],
      '2-5-4': [`In a frequency table, total observations equals the sum of all:`, `Frequencies`, [`Class marks`, `Ranges`, `Medians`], `Add the frequency column.`],
      '2-5-5': [`Which spreadsheet formula computes the average of cells B2 through B10?`, `=AVERAGE(B2:B10)`, [`=SUM(B2:B10)`, `=MEAN[B2..B10]`, `=COUNT(B2:B10)`], `Spreadsheets use =AVERAGE(range).`],
      '2-5-6': [`Which chart is BEST for tracking temperature over 12 continuous hours?`, `Line graph`, [`Pie chart`, `Dot scatter`, `Tally mark`], `Line graphs track continuous change over time.`],
      '2-5-7': [`Before reading an infographic map, always check its:`, `Scale & Legend`, [`Border color`, `Font size`, `Word count`], `Legend and scale define exact units.`],
      '2-6-1': [`Think of a number x, double it, add ${2 * a}, divide by 2, subtract x. Result is always:`, `${a}`, [`x + ${a}`, `2x`, `${2 * a}`], `(2x + ${2 * a})/2 − x = ${a}.`],
      '2-6-2': [`Shubham's birthday formula gives 100M + D + 165. After subtracting 165 from 970, find the Month and Day.`, `Month 8, Day 05`, [`Month 9, Day 70`, `Month 8, Day 65`, `Month 10, Day 05`], `970 − 165 = 805 ⇒ Month 8, Day 05.`],
      '2-6-3': [`In a number pyramid, brick above [${a}] and [${b}] equals their sum:`, `${a + b}`, [`${a * b}`, `${Math.abs(a - b)}`, `${2 * a}`], `Each brick sums the two below it.`],
      '2-6-4': [`If top brick is ${a + b + 4} and left base brick is ${a + 4}, find the right child brick:`, `${b}`, [`${a + 4}`, `${a + b}`, `${b + 4}`], `Subtract known child from parent.`],
      '2-6-5': [`Doubling 1 rupee starting Day 1 gives Day ${c} amount =`, `2^${c - 1} = ${2 ** (c - 1)}`, [`2 × ${c}`, `2^${c}`, `${c}²`], `Day n gets 2^(n−1).`],
      '2-6-6': [`In a standard calendar grid, moving straight down 1 row adds how many days?`, `7`, [`1`, `6`, `10`], `A week has 7 days.`],
      '2-6-7': [`Solve 2x + ${a} = ${a + 14}.`, `7`, [`14`, `${a}`, `5`], `2x = 14 ⇒ x = 7.`],
      '2-7-1': [`Area of triangle with base ${2 * a} cm and height ${b} cm =`, `${a * b} cm²`, [`${2 * a * b} cm²`, `${a + b} cm`, `${4 * a * b} cm²`], `½ × base × height = ${a * b}.`],
      '2-7-2': [`A median splits a triangle into two smaller triangles of:`, `Equal area`, [`Equal perimeter always`, `90° angles`, `45° angles`], `Same base half and shared altitude ⇒ equal area.`],
      '2-7-3': [`Triangles on the same base between parallel lines ALWAYS have equal:`, `Area`, [`Perimeter`, `Side lengths`, `Angles`], `Constant base and equal height ⇒ equal area.`],
      '2-7-4': [`Area of parallelogram with base ${a + 4} cm and height ${b} cm =`, `${(a + 4) * b} cm²`, [`${((a + 4) * b) / 2} cm²`, `${2 * (a + b + 4)} cm`, `${(a + 4) + b} cm²`], `Base × perpendicular height.`],
      '2-7-5': [`Area of kite with diagonals ${2 * a} cm and ${2 * b} cm =`, `${2 * a * b} cm²`, [`${4 * a * b} cm²`, `${a + b} cm²`, `${a * b} cm²`], `½ × d₁ × d₂.`],
      '2-7-6': [`Area of trapezium with parallel sides ${a + 2}, ${a + 8} and height 4 =`, `${2 * (2 * a + 10)}`, [`${(2 * a + 10)}`, `${4 * (2 * a + 10)}`, `${a + 10}`], `½ × 4 × (sum) = 2 × (${2 * a + 10}).`],
      '2-7-7': [`1 hectare equals how many m²?`, `10,000 m²`, [`1,000 m²`, `100 m²`, `100,000 m²`], `100 m × 100 m = 10,000 m².`],
    };

    const q1PromptD3: Record<string, [string, string, string[], string]> = {
      '2-3-1': [`Constant k in y = kx: if y = ${7 * k} when x = ${k}, find y when x = ${k + 5}.`, `${7 * (k + 5)}`, [`${7 * k + 5}`, `${5 * k}`, `${7 * (k + 4)}`], `Unit rate k = 7 ⇒ 7 × ${k + 5}.`],
      '2-3-2': [`With RF = 1 : 50,000, what real distance in km does ${2 * k} cm on the map show?`, `${k} km`, [`${2 * k} km`, `${5 * k} km`, `${0.5 * k} km`], `1 cm = 500 m = 0.5 km ⇒ ${2 * k} × 0.5 = ${k} km.`],
      '2-3-3': [`If x : y = 2 : 3 and y : z = 6 : 7, find x : z.`, `4 : 7`, [`2 : 7`, `6 : 7`, `1 : 3`], `Make y = 6: x:y:z = 4:6:7 ⇒ 4:7.`],
      '2-3-4': [`Divide ${9 * k + 18} in ratio 2 : 3 : 4. Find Largest minus Smallest.`, `${2 * (k + 2)}`, [`${4 * (k + 2)}`, `${3 * (k + 2)}`, `${k + 2}`], `Each part is ${k + 2}; (4−2) × ${k + 2} = ${2 * (k + 2)}.`],
      '2-3-5': [`If ${15 + b}% of a survey of 240 votes went to Science, find its pie sector angle.`, `${((15 + b) * 360) / 100}°`, [`${15 + b}°`, `${(15 + b) * 3.6 + 10}°`, `90°`], `Angle = (${15 + b}/100) × 360°.`],
      '2-3-6': [`Speed ratio 3 : 4 over identical distance gives Time ratio:`, `4 : 3`, [`3 : 4`, `9 : 16`, `1 : 1`], `Inverse proportion flips the ratio.`],
      '2-3-7': [`12 machines weave 600 m in 5 hours. How many meters do 8 machines weave in 10 hours?`, `800 m`, [`400 m`, `600 m`, `900 m`], `Rate = 10 m/(machine·hr) × 8 × 10 = 800 m.`],
      '2-4-1': [`If each level of a self-similar temple spire scales lengths by ½, by what factor does surface AREA scale per level?`, `1/4`, [`1/2`, `1/8`, `1/16`], `Area scales as (scale factor)² = (1/2)² = 1/4.`],
      '2-4-2': [`After 2 iterations on a Sierpinski Carpet (3×3 grid removing center square), what fraction of area remains?`, `(8/9)² = 64/81`, [`8/9`, `9/16`, `1/81`], `Each step keeps 8/9 of remaining area.`],
      '2-4-3': [`Starting with perimeter 27 cm, what is the perimeter after 3 iterations of the Koch Snowflake?`, `64 cm`, [`36 cm`, `48 cm`, `81 cm`], `27 × (4/3)³ = 27 × 64/27 = 64 cm.`],
      '2-4-4': [`On a standard T-net or cross net of a cube, two faces directly opposite in the folded cube are always separated on a straight strip by:`, `1 square between them`, [`0 squares (adjacent)`, `3 squares`, `4 squares`], `Skip-1 in a straight strip of 4 faces folds to opposite sides.`],
      '2-4-5': [`A cuboid is 4 cm × 4 cm × 3 cm. Shortest path along surface from bottom corner to opposite corner across top+front faces:`, `√(4² + 7²) = √65 cm`, [`4 + 4 + 3 = 11 cm`, `√(8² + 3²) = √73 cm`, `5 cm`], `Unfold 4×4 top and 4×3 front ⇒ 4 by (4+3)=7 ⇒ √(16+49) = √65.`],
      '2-4-6': [`Front View shows 3 columns (heights 2, 1, 3) and Side View shows 2 rows (max heights 3, 2). Can all columns reach height 3?`, `Yes, in only row 1; row 2 caps at 2`, [`No, side max 2 blocks height 3`, `Yes, every column must be 3`, `Need 9 total views`], `Intersection caps each cell by min(Front_col, Side_row).`],
      '2-4-7': [`An unpainted 3×3×3 cube is painted red outside and cut into 27 unit cubes. How many cubes have EXACTLY 2 painted faces?`, `12`, [`8`, `6`, `1`], `12 edges × (3 − 2) middle edge cubes = 12.`],
      '2-5-1': [`Mean of 6 numbers is ${10 + a}. One more number ${17 + a} is added. Find the new mean.`, `${11 + a}`, [`${10 + a}`, `${12 + a}`, `${13 + a}`], `(6(${10 + a}) + ${17 + a}) / 7 = ${11 + a}.`],
      '2-5-2': [`Find the median of unsorted data: ${20 + c}, 12, 15, ${30 + b}, 18, 22.`, `${(18 + 20 + c) / 2 === Math.floor((18 + 20 + c) / 2) ? (18 + 20 + c) / 2 : ((18 + Math.min(20 + c, 22)) / 2)}`, [`18`, `22`, `15`], `Sort first, then average 3rd and 4th middle values.`],
      '2-5-3': [`If an outlier 500 replaces value 20 in a 10-item set, what happens to Mean vs Median?`, `Mean jumps by +48; Median hardly moves`, [`Both jump +48`, `Median jumps more`, `Mean drops`], `Mean is sensitive to extreme outliers; Median resists them.`],
      '2-5-4': [`Class A (20 students) averages 75; Class B (30 students) averages 85. Combined mean:`, `81`, [`80`, `82`, `79`], `(20×75 + 30×85) / 50 = 4050 / 50 = 81.`],
      '2-5-5': [`If cell A1 = 10, B1 = 20, C1 = =A1*2+B1, what does =SUM(A1:C1) output?`, `70`, [`50`, `40`, `60`], `C1 = 40 ⇒ 10 + 20 + 40 = 70.`],
      '2-5-6': [`A truncated y-axis starting at 90 instead of 0 on a bar chart visually exaggerates:`, `Small differences to look huge`, [`Data totals`, `Sample size`, `Median exactly`], `Non-zero y-axis baselines distort bar height ratios.`],
      '2-5-7': [`An infographic shows 1 icon = ${c}00 visitors. How many icons represent ${(c * 4 + c / 2) * 100}?`, `4.5 icons`, [`4 icons`, `5 icons`, `${c} icons`], `Divide total by icon scale.`],
      '2-6-1': [`Simplify 4(2x − 3) − 3(x − 5) − 5x.`, `3`, [`−27`, `x + 3`, `10x − 3`], `8x − 12 − 3x + 15 − 5x = 3.`],
      '2-6-2': [`Shubham's puzzle results in 100M + D + 165 = ${8 * 100 + 24 + 165}. Find Month and Day.`, `Month 8, Day 24`, [`Month 9, Day 89`, `Month 8, Day 16`, `Month 7, Day 24`], `Subtract 165 ⇒ 824 = Month 8, Day 24.`],
      '2-6-3': [`A 3-row additive pyramid has bottom row [x, ${a}, ${b}]. Find the top brick.`, `x + ${2 * a + b}`, [`x + ${a + b}`, `2x + ${a + b}`, `${a + b}`], `Row 2 is [x+${a}, ${a + b}]; top = x + ${2 * a + b}.`],
      '2-6-4': [`In a 4-row pyramid with bottom row [x, 2, 3, x], top = 2x + 15. If top = ${2 * c + 15}, find x.`, `${c}`, [`${c + 1}`, `${2 * c}`, `${c + 3}`], `2x + 3(2) + 3(3) = 2x + 15 = ${2 * c + 15} ⇒ x = ${c}.`],
      '2-6-5': [`Genie doubles coins each day: Day 1 gets 2, Day 2 gets 4, …, Day 6 gets 64. Total coins in Days 1–6 =`, `126`, [`128`, `64`, `62`], `2 + 4 + 8 + 16 + 32 + 64 = 126.`],
      '2-6-6': [`In a calendar 3×3 block, the 9 numbers sum to ${9 * (14 + c)}. Find the top-left corner date.`, `${6 + c}`, [`${14 + c}`, `${7 + c}`, `${22 + c}`], `Center c = ${14 + c}; top-left = center − 8 = ${6 + c}.`],
      '2-6-7': [`Solve 3(2x − 1) = 4(x + 3) + 1.`, `8`, [`7`, `6`, `9`], `6x − 3 = 4x + 13 ⇒ 2x = 16 ⇒ x = 8.`],
      '2-7-1': [`A rectangle encloses a triangle of area ${12 * k} cm². What is the rectangle's area if base & height match?`, `${24 * k} cm²`, [`${12 * k} cm²`, `${6 * k} cm²`, `${36 * k} cm²`], `Triangle area is half enclosing rectangle.`],
      '2-7-2': [`AD is a median of △ABC, and E is the midpoint of AD. If Area(△ABC) = 48 cm², find Area(△BED).`, `12 cm²`, [`24 cm²`, `16 cm²`, `6 cm²`], `Median AD splits to 24; median BE of △ABD splits to 12 cm².`],
      '2-7-3': [`Gopal walks from height 5 m to a river bank 16 m wide horizontally and back up to height 7 m. Using mirror reflection, find the minimum total path length.`, `20 m`, [`√260 m`, `28 m`, `18 m`], `Reflect second point across bank line: vertical span = 5 + 7 = 12 m ⇒ √(12²+16²) = 20 m.`],
      '2-7-4': [`A parallelogram has sides 15 cm and 10 cm. Height on 15 cm base is 8 cm. Find height on 10 cm base.`, `12 cm`, [`8 cm`, `15 cm`, `10 cm`], `Area = 15×8 = 120 ⇒ 120 ÷ 10 = 12 cm.`],
      '2-7-5': [`A rhombus has perimeter 52 cm and one diagonal 24 cm. Find its area.`, `120 cm²`, [`240 cm²`, `60 cm²`, `156 cm²`], `Side = 13, half-d₁ = 12 ⇒ half-d₂ = 5 ⇒ d₂ = 10 ⇒ Area = ½(24)(10) = 120 cm².`],
      '2-7-6': [`Trapezium area = ${60 * k} cm², height = ${6 * k} cm, one parallel side = 8 cm. Find the other parallel side.`, `12 cm`, [`10 cm`, `14 cm`, `16 cm`], `Using ½ × h × (8 + b) = ${60 * k} ⇒ (8 + b)/2 = 10 ⇒ b = 12 cm.`],
      '2-7-7': [`How many rectangular tiles 25 cm × 20 cm are needed to cover a ${2 * k} m × 3 m floor?`, `${120 * k}`, [`${60 * k}`, `${240 * k}`, `${12 * k}`], `1 m² holds 20 tiles (10000 / 500) ⇒ ${6 * k} × 20 = ${120 * k} tiles.`],
    };

    const q1PromptD4: Record<string, [string, string, string[], string]> = {
      '2-3-1': [`If x varies inversely as y² and x = 16 when y = 3, find x when y = 6.`, `4`, [`8`, `32`, `64`], `x·y² = 16×9 = 144 ⇒ 144 / 36 = 4.`],
      '2-3-2': [`A reservoir of area 18 cm² is drawn on a map with scale 1 : 50,000. Find its ACTUAL surface area in km².`, `4.5 km²`, [`0.9 km²`, `9 km²`, `45 km²`], `1 cm = 0.5 km ⇒ 1 cm² = 0.25 km² ⇒ 18 × 0.25 = 4.5 km².`],
      '2-3-3': [`If A:B = 2:3, B:C = 4:5, C:D = 5:7, find A:D in simplest form.`, `8 : 21`, [`2 : 7`, `4 : 15`, `8 : 15`], `(2/3)(4/5)(5/7) = 8/21.`],
      '2-3-4': [`₹2,130 is divided in ratio 3:5:7 instead of inverse-weighted 1/3 : 1/5 : 1/7 (= 35:21:15). Find the difference in the middle share!`, `₹80`, [`₹140`, `₹40`, `₹120`], `(5/15)×2130 = ₹710 vs (21/71)×2130 = ₹630 ⇒ ₹80 difference.`],
      '2-3-5': [`A pie chart's Sector A is 108°, Sector B is 25% more than A in count. Find Sector B's angle.`, `135°`, [`133°`, `144°`, `120°`], `108° × 1.25 = 135°.`],
      '2-3-6': [`Walking at 3/4 of his usual speed, Arun arrives ${12 + c} minutes late. Find his usual commute time in minutes.`, `${3 * (12 + c)}`, [`${4 * (12 + c)}`, `${2 * (12 + c)}`, `${12 + c}`], `At 3/4 speed, time = 4/3 T ⇒ extra 1/3 T = ${12 + c} ⇒ T = ${3 * (12 + c)} min.`],
      '2-3-7': [`Pipe A fills in 12 h, B in 15 h, C empties in 20 h. All 3 open together fill the empty tank in:`, `10 hours`, [`8 hours`, `12 hours`, `15 hours`], `1/12 + 1/15 − 1/20 = (5+4−3)/60 = 6/60 = 1/10 ⇒ 10 hours.`],
      '2-4-1': [`An architectural fractal spire stacks infinite cubes of edge ratios 1, ½, ¼, ⅛… Total volume sum if base cube edge is 2 (vol = 8):`, `64/7`, [`16`, `12`, `8`], `Sum 8(1 + 1/8 + 1/64 + …) = 8 ÷ (7/8) = 64/7.`],
      '2-4-2': [`In a Sierpinski Gasket (triangle), starting with Area = 64, after 3 steps of removing middle quarters, remaining area is:`, `27`, [`36`, `16`, `8`], `64 × (3/4)³ = 64 × 27/64 = 27.`],
      '2-4-3': [`A Koch Snowflake starts as equilateral triangle P₀ = 81 m. Find perimeter P₃ after 3 iterations.`, `192 m`, [`144 m`, `256 m`, `108 m`], `81 × (4/3)³ = 81 × 64/27 = 192 m.`],
      '2-4-4': [`Out of all hexominoes (6 connected squares), 35 shapes exist, and ONLY 11 fold into a cube. A common failure reason for the other 24 is:`, `Having a 2×2 square loop or 5+ collinear squares`, [`Having an even perimeter`, `Not using triangles`, `Being symmetric`], `Any 2×2 block or 5-in-a-row creates face collisions.`],
      '2-4-5': [`A spider at corner of room 8×6×4 crawls ONLY on walls/ceiling to opposite floor-to-ceiling corner. Find SHORTEST geodesic path.`, `√164 ≈ 12.8`, [`√116`, `√212`, `18`], `Compare 3 unfolded pairs: √((8+6)²+4²)=√212, √((8+4)²+6²)=√180, √(8²+(6+4)²)=√164! Minimum is √164.`],
      '2-4-6': [`On a 2×2 grid, Front view shows column heights [3, 2] and Side view shows row heights [3, 2]. Find (Max cubes − Min cubes).`, `4`, [`3`, `2`, `1`], `Max = 3+2+2+2 = 9; Min = 3+0+0+2 = 5 ⇒ 9 − 5 = 4.`],
      '2-4-7': [`An n × n × n cube painted outside yields 24 unit cubes with 2 painted faces. How many unit cubes have ZERO painted faces (hidden inside)?`, `8`, [`27`, `1`, `12`], `12(n − 2) = 24 ⇒ n = 4 ⇒ inside core = (4 − 2)³ = 8.`],
      '2-5-1': [`Mean of 9 numbers is 24. Mean of first 5 is 21, and mean of last 5 is 28. Find the 5th (overlapping) number.`, `29`, [`25`, `24`, `30`], `5(21) + 5(28) − 9(24) = 105 + 140 − 216 = 29.`],
      '2-5-2': [`A sorted set of 5 positive integers has unique mode 10, median 8, and mean 7. What is the MAXIMUM possible value for the smallest number?`, `3`, [`4`, `5`, `1`], `Sum = 35; top three are 8, 10, 10 (sum 28), leaving x + y = 7 with x < y ⇒ max x = 3 (with y = 4).`],
      '2-5-3': [`A set of 10 numbers has mean M. Multiply every number by 3 and subtract 5. Find the new mean.`, `3M − 5`, [`3M`, `M − 5`, `3(M − 5)`], `Mean transforms linearly: 3M − 5.`],
      '2-5-4': [`In a class, 60% passed with avg 70 and 40% failed with avg 35. Overall class weighted mean =`, `56`, [`52.5`, `58`, `54`], `0.6(70) + 0.4(35) = 42 + 14 = 56.`],
      '2-5-5': [`In a spreadsheet, Column A holds scores and B2 = =AVERAGE($A$2:A2) copied down to B5 computes:`, `Running cumulative average through each row`, [`Global average only`, `Column sum`, `Row difference`], `$A$2 locks the top cell while A2 expands cleanly down.`],
      '2-5-6': [`Speed-time line graph rises linearly from (0 h, 0 km/h) to (2 h, 40 km/h) then stays flat at 40 km/h until 5 h. Total distance = area under graph =`, `160 km`, [`200 km`, `120 km`, `140 km`], `Triangle ½(2)(40) + Rectangle 3(40) = 40 + 120 = 160 km.`],
      '2-5-7': [`City A density is 400/km² over 25 km²; City B is 600/km² over 15 km². Combined average density:`, `475 / km²`, [`500 / km²`, `450 / km²`, `520 / km²`], `(10000 + 9000) ÷ 40 = 475 / km².`],
      '2-6-1': [`Evaluate the algebraic riddle trick: [(x + 4)² − (x − 4)²] ÷ (2x) for ANY x ≠ 0.`, `8`, [`4`, `16`, `2x`], `16x ÷ 2x = 8 always.`],
      '2-6-2': [`In calendar riddle 100M + D + 165 = R, someone adds 100 instead of 165 and gets 718. Find their REAL Month and Day.`, `Month 6, Day 18`, [`Month 7, Day 18`, `Month 5, Day 32`, `Month 6, Day 28`], `Subtract 100 from 718 ⇒ 618 = Month 6, Day 18.`],
      '2-6-3': [`A 4-row Virahāṅka pyramid has bottom row [a, b, c, d]. Using weights 1, 3, 3, 1, find top brick when a=2, d=5 and b+c=10.`, `37`, [`27`, `42`, `30`], `Top = 1(2) + 3(10) + 1(5) = 37.`],
      '2-6-4': [`4-row Virahāṅka pyramid bottom [x, y, z, w] has top brick 100. If y + z = 28, find x + w.`, `16`, [`24`, `72`, `12`], `(x + w) + 3(28) = 100 ⇒ x + w = 16.`],
      '2-6-5': [`Karim pays ₹100/day, Genie returns 1, 2, 4, 8… On which day does Genie's CUMULATIVE payout (2ⁿ − 1) first surpass Karim's cumulative fee (100n)?`, `Day 10 (1023 > 1000)`, [`Day 8 (255 > 800)`, `Day 9 (511 > 900)`, `Day 11`], `2¹⁰ − 1 = 1023 > 10×100 = 1000 (at Day 9, 511 < 900).`],
      '2-6-6': [`Sum of a 3×3 calendar block is S, and sum of ONLY its 4 corner dates is 68. Find the center date c.`, `17`, [`19`, `15`, `21`], `Opposite corners balance around c, so 4 corners = 4c = 68 ⇒ c = 17.`],
      '2-6-7': [`Solve (x − 2)/3 + (x + 1)/4 = 17/4.`, `8`, [`7`, `6`, `9`], `Multiply by 12: 4(x−2) + 3(x+1) = 51 ⇒ 7x − 5 = 51 ⇒ 7x = 56 ⇒ x = 8.`],
      '2-7-1': [`Perimeter of a right triangle is 30 cm and hypotenuse is 13 cm. Find its AREA.`, `30 cm²`, [`60 cm²`, `65 cm²`, `24 cm²`], `Legs 5, 12, 13 (sum 30) ⇒ ½ × 5 × 12 = 30 cm².`],
      '2-7-2': [`G is the centroid (intersection of 3 medians) of △ABC with Area = 72 cm². Find Area(△AGB).`, `24 cm²`, [`36 cm²`, `12 cm²`, `18 cm²`], `Three medians split a triangle into 6 equal regions ⇒ △AGB takes 2/6 = 1/3 = 24 cm².`],
      '2-7-3': [`In trapezium ABCD (AB || DC), diagonals intersect at O. If Area(△AOB) = 16 and Area(△DOC) = 25, find Area(△AOD).`, `20`, [`41`, `20.5`, `10`], `△AOD × △BOC = △AOB × △DOC and △AOD = △BOC ⇒ √(16 × 25) = 20.`],
      '2-7-4': [`Parallelogram ABCD has area 96 cm². Point P lies ANYWHERE on CD. Find Area(△PAB).`, `48 cm²`, [`32 cm²`, `24 cm²`, `64 cm²`], `Shared base AB & parallel height ⇒ always ½ parallelogram area = 48 cm².`],
      '2-7-5': [`Rhombus diagonals have ratio 3:4 and perimeter 40 cm. Find its area.`, `96 cm²`, [`48 cm²`, `192 cm²`, `100 cm²`], `Side = 10 ⇒ half-diags 6 & 8 ⇒ diags 12 & 16 ⇒ Area = ½(12)(16) = 96 cm².`],
      '2-7-6': [`An isosceles trapezium has parallel sides 10 cm and 22 cm, and legs 10 cm each. Find its area.`, `128 cm²`, [`96 cm²`, `160 cm²`, `80 cm²`], `Drop altitudes: side offset = (22−10)/2 = 6 ⇒ h = √(10²−6²) = 8 ⇒ Area = ½(10+22)(8) = 128 cm².`],
      '2-7-7': [`A surveyor's diagonal AC = 40 m has perpendicular offsets 12 m and 18 m, plus an outer triangle sharing base 20 m with height 9 m. Find total area.`, `690 m²`, [`600 m²`, `780 m²`, `510 m²`], `½(40)(12+18) + ½(20)(9) = 600 + 90 = 690 m².`],
    };

    const tuple = (d === 1 ? q1PromptD1[key] : d === 3 ? q1PromptD3[key] : q1PromptD4[key]);
    if (tuple) {
      out.push(mk(modRef, tuple[0], tuple[1], tuple[2], tuple[3], rng));
    }

    // Add parameterized tier-distinct scaling variants strictly scoped to ch=3..7 so D=1, D=3, D=4 never collide!
    const mult = ri(rng, 2, 7);
    const shift = ri(rng, 1, 6);
    if (ch === 3) {
      if (d === 1) {
        out.push(
          mk(modRef, `Quick proportional check: At unit rate ₹${b + 2} per item, find cost of ${c + shift} items.`, `₹${(b + 2) * (c + shift)}`, [`₹${(b + 2) * c}`, `₹${(b + 3) * (c + shift)}`, `₹${c + shift}`], `Multiply unit rate by count.`, rng),
          mk(modRef, `Basic scaling rule (${mn === 6 ? 'inverse' : 'direct'}): If input doubles under ${mn === 6 ? 'inverse xy = k' : 'direct y = kx'}, output becomes:`, mn === 6 ? `Half of original` : `Double original`, [mn === 6 ? `Double original` : `Half of original`, `4×`, `Unchanged`], `Inverse flips factor; direct scales identically.`, rng)
        );
      } else if (d === 3) {
        out.push(
          mk(modRef, `Challenger ratio shift: If ${c} workers produce ${c * (b + 2)} units in ${shift + 1} hours, how many units do ${c + 2} workers produce in the same time?`, `${(c + 2) * (b + 2)}`, [`${c * (b + 2)}`, `${(c + 1) * (b + 3)}`, `${c + 2}`], `Unit rate per worker is ${b + 2} ⇒ multiply by ${c + 2}.`, rng),
          mk(modRef, `Intermediate rate check (${mn === 6 ? 'inverse' : 'direct'}): When x increases by factor ${mult}× under ${mn === 6 ? 'xy = k' : 'y = kx'}, output scales by:`, mn === 6 ? `1/${mult}×` : `${mult}×`, [mn === 6 ? `${mult}×` : `1/${mult}×`, `${mult * mult}×`, `0`], `Track direct vs inverse constant invariant.`, rng)
        );
      } else {
        out.push(
          mk(modRef, `Olympiad proportional compound: If quantity Q varies directly as x² and inversely as y, when x = ${mult} and y = 2 we get Q = ${mult * mult * 3}. Find Q when x = ${mult + 1} and y = 6.`, `${(mult + 1) ** 2}`, [`${(mult + 1) * 3}`, `${mult * mult}`, `${((mult + 1) ** 2) * 3}`], `Constant k = Q·y / x² = 6 ⇒ Q = 6 × (${mult + 1})² / 6 = ${(mult + 1) ** 2}.`, rng),
          mk(modRef, `Olympiad joint-variation: Output y equals k · a^2 / b. Multiplying 'a' by ${mult} and 'b' by ${shift + 1} changes y by factor:`, `${mult * mult}/${shift + 1}×`, [`${mult}/${shift + 1}×`, `${mult * mult * (shift + 1)}×`, `${shift + 1}/${mult}×`], `a² scales by ${mult}² and dividing by b divides by ${shift + 1}.`, rng)
        );
      }
    } else if (ch === 4) {
      const sCube = c + shift;
      if (d === 1) {
        out.push(
          mk(modRef, `Basic 3D net count: A cube of side ${sCube} cm has 12 equal edges. Find its total wire edge length.`, `${12 * sCube} cm`, [`${6 * sCube} cm`, `${4 * sCube} cm`, `${sCube ** 2} cm`], `12 × ${sCube} = ${12 * sCube} cm.`, rng),
          mk(modRef, `Face area count: Each square face of a ${sCube} cm cube has area:`, `${sCube * sCube} cm²`, [`${4 * sCube} cm²`, `${6 * sCube * sCube} cm²`, `${sCube ** 3} cm²`], `Side² = ${sCube * sCube} cm².`, rng)
        );
      } else if (d === 3) {
        out.push(
          mk(modRef, `Spatial projection: A ${sCube}×${sCube}×${sCube} cube is painted red outside and cut into ${sCube ** 3} unit cubes. How many unit cubes sit purely at the CORNERS (3 painted faces)?`, `8`, [`12`, `6`, `${4 * sCube}`], `Every cube has exactly 8 vertices/corners.`, rng),
          mk(modRef, `Surface scaling: Scaling all 3D edges of a prism by factor ${mult} multiplies its Total Surface Area by:`, `${mult * mult}×`, [`${mult}×`, `${mult ** 3}×`, `${6 * mult}×`], `Area grows with the square of linear scale: ${mult}².`, rng)
        );
      } else {
        out.push(
          mk(modRef, `Olympiad 3D spatial lattice: A ${sCube} × ${sCube} × ${sCube} cube is painted outside and diced into 1×1×1 unit cubes. How many unit cubes have EXACTLY 1 painted face (strictly interior to the 6 faces)?`, `${6 * (sCube - 2) * (sCube - 2)}`, [`${12 * (sCube - 2)}`, `${(sCube - 2) ** 3}`, `${6 * sCube * sCube}`], `Each of 6 faces holds an (${sCube}−2) × (${sCube}−2) central square of 1-face unit cubes.`, rng),
          mk(modRef, `Olympiad 3D volume/area ratio: Doubling linear edges of a polyhedron multiplies (Volume ÷ Surface Area) ratio by factor:`, `2×`, [`4×`, `8×`, `1/2×`], `Volume grows 8× while Surface Area grows 4× ⇒ 8/4 = 2×.`, rng)
        );
      }
    } else if (ch === 5) {
      const mVal = 10 + shift;
      if (d === 1) {
        out.push(
          mk(modRef, `Basic Mean: Find the mean (average) of [${mVal - 2}, ${mVal}, ${mVal + 2}].`, `${mVal}`, [`${mVal - 2}`, `${mVal + 2}`, `${3 * mVal}`], `Middle balanced value is ${mVal}.`, rng),
          mk(modRef, `Basic Shift: Adding ${shift * 3} to EVERY number in a list changes the Median by:`, `+${shift * 3}`, [`0`, `×${shift * 3}`, `+1`], `Shifting every element shifts the median identically.`, rng)
        );
      } else if (d === 3) {
        out.push(
          mk(modRef, `Challenger Mean Shift: Dataset [${mVal - 2}, ${mVal}, ${mVal + 2}] has mean ${mVal}. Adding a 4th score ${mVal + 4 * mult} moves the mean to:`, `${mVal + mult}`, [`${mVal + 2 * mult}`, `${mVal}`, `${mVal + 4}`], `Surplus ${4 * mult} ÷ 4 = +${mult}.`, rng),
          mk(modRef, `Frequency Range: The highest score in a batch is ${50 + 5 * mult} and lowest is ${20 + 2 * shift}. If every value doubles, the new Range equals:`, `${2 * ((50 + 5 * mult) - (20 + 2 * shift))}`, [`${(50 + 5 * mult) - (20 + 2 * shift)}`, `${30 + mult}`, `100`], `Multiplying every value by 2 doubles Range (Max − Min).`, rng)
        );
      } else {
        out.push(
          mk(modRef, `Olympiad Combined Mean: Equal-size Group A (${mult + 2} students) averages ${mVal} and Group B (${mult + 2} students) averages ${mVal + 2 * shift}. Find their exact combined mean.`, `${mVal + shift}`, [`${mVal}`, `${mVal + 2 * shift}`, `${mVal + 1}`], `Equal counts average symmetrically: ½(${mVal} + ${mVal + 2 * shift}) = ${mVal + shift}.`, rng),
          mk(modRef, `Olympiad Linear Transform: A dataset of ${c + 5} values has Mean M = ${mVal} and Range R = ${2 * mult}. Every number is transformed via x' = ${mult}x − ${shift}. Find (New Mean + New Range).`, `${mult * mVal - shift + 2 * mult * mult}`, [`${mult * mVal + 2 * mult}`, `${mVal + 2 * mult}`, `${mult * (mVal + 2 * mult)}`], `New Mean = ${mult}M − ${shift}; New Range = ${mult}R (shifting doesn't change spread).`, rng)
        );
      }
    } else if (ch === 6) {
      if (d === 1) {
        out.push(
          mk(modRef, `Basic Algebra: If ${2 * mult}x − ${shift} = ${2 * mult * c - shift}, find x.`, `${c}`, [`${c + 1}`, `${c - 1}`, `${c + 2}`], `${2 * mult}x = ${2 * mult * c} ⇒ x = ${c}.`, rng),
          mk(modRef, `Basic Sequence: Starting at ${shift} and adding +${mult} each step for ${c} steps adds a total of:`, `+${mult * c}`, [`+${mult + c}`, `+${mult}`, `×${c}`], `${mult} × ${c} = ${mult * c}.`, rng)
        );
      } else if (d === 3) {
        out.push(
          mk(modRef, `Challenger Equation: Solve ${mult}(2x − ${shift}) = ${mult * (2 * c - shift)} for x.`, `${c}`, [`${c + 2}`, `${2 * c}`, `${c - 1}`], `Divide by ${mult}: 2x − ${shift} = ${2 * c - shift} ⇒ x = ${c}.`, rng),
          mk(modRef, `Linear Difference: In an arithmetic pattern T(n) = ${mult}n + ${shift}, find T(${c + 5}) − T(${c}).`, `${5 * mult}`, [`${mult}`, `${5 * shift}`, `${(c + 5) * mult}`], `Jumping 5 steps adds 5 × ${mult} = ${5 * mult}.`, rng)
        );
      } else {
        out.push(
          mk(modRef, `Olympiad Functional Riddle: Let f(x) = (${mult}x − ${shift}). Solve f(f(x)) = ${mult * (mult * c - shift) - shift} for x.`, `${c}`, [`${c + 1}`, `${mult * c}`, `${c - 1}`], `Unwrap twice: ${mult}x − ${shift} = ${mult * c - shift} ⇒ x = ${c}.`, rng),
          mk(modRef, `Olympiad Pyramid Invariant: In a 4-row Virahāṅka pyramid [x, ${mult}, ${shift}, x], Top = 2x + 3(${mult + shift}). If Top = ${2 * c + 3 * (mult + shift)}, find x.`, `${c}`, [`${c + 2}`, `${2 * c}`, `${mult + shift}`], `2x = ${2 * c} ⇒ x = ${c}.`, rng)
        );
      }
    } else if (ch === 7) {
      if (d === 1) {
        out.push(
          mk(modRef, `Basic Area: A triangle has base ${2 * (a + shift)} cm and height ${b + mult} cm. Compute Area = ½ × base × height.`, `${(a + shift) * (b + mult)} cm²`, [`${2 * (a + shift) * (b + mult)} cm²`, `${a + shift + b + mult} cm²`, `${(a + shift) * b} cm²`], `½ × ${2 * (a + shift)} × ${b + mult} = ${(a + shift) * (b + mult)} cm².`, rng),
          mk(modRef, `Unit Conversion: Convert ${k + shift} m² into cm² (1 m² = 10,000 cm²).`, `${((k + shift) * 10000).toLocaleString()} cm²`, [`${(k + shift) * 100} cm²`, `${(k + shift) * 1000} cm²`, `${(k + shift) * 10} cm²`], `Multiply m² by 10,000.`, rng)
        );
      } else if (d === 3) {
        out.push(
          mk(modRef, `Challenger Area Share: A parallelogram has area ${2 * (a + shift) * (b + mult)} cm². A triangle shares the same base and height between parallel lines. Find triangle area.`, `${(a + shift) * (b + mult)} cm²`, [`${2 * (a + shift) * (b + mult)} cm²`, `${((a + shift) * (b + mult)) / 2} cm²`, `${a + b} cm²`], `Triangle = ½ parallelogram area.`, rng),
          mk(modRef, `Field Conversion: A rectangular field measures ${(k + shift) * 50} m × ${mult * 20} m. How many HECTARES (1 ha = 10,000 m²) is its area?`, `${(((k + shift) * 50 * mult * 20) / 10000).toFixed(1).replace(/\.0$/, '')} ha`, [`${((k + shift) * 50 * mult * 20) / 1000} ha`, `${(k + shift) * mult} ha`, `10 ha`], `Divide m² area by 10,000.`, rng)
        );
      } else {
        out.push(
          mk(modRef, `Olympiad Area Partition: Convex triangle △ABC has area ${6 * (a + shift) * (b + mult)} cm². Three medians meet at centroid G, and D is midpoint of BC. Find Area(△BGD) in cm².`, `${(a + shift) * (b + mult)} cm²`, [`${2 * (a + shift) * (b + mult)} cm²`, `${3 * (a + shift) * (b + mult)} cm²`, `${6 * (a + shift)} cm²`], `Three medians partition any triangle into 6 sub-triangles of EQUAL area: Total ÷ 6 = ${(a + shift) * (b + mult)} cm².`, rng),
          mk(modRef, `Olympiad Border Area: A rectangular lawn ${k + 3} m × ${c + 5} m is surrounded outside by a uniform ${shift} m path. Find the area (in m²) of ONLY the border path.`, `${2 * shift * ((k + 3) + (c + 5) + 2 * shift)} m²`, [`${shift * (k + c)} m²`, `${4 * shift * shift} m²`, `${(k + 3) * (c + 5)} m²`], `Outer (L+2w)(W+2w) − Inner LW = 2w(L + W + 2w) = ${2 * shift * (k + c + 8 + 2 * shift)} m².`, rng)
        );
      }
    }
  }

  return out;
}

/**
 * Generates ≥ 6 strictly single-module tiered questions (Foundation 1, Challenger 3, Olympiad 4)
 * for any of the 98 M1-M7 modules, with ZERO spillover from sibling modules in the chapter.
 */
export function generateStrictModuleTieredQuestions(
  moduleId: string,
  randomSeed: number,
  difficulty: QuizDifficultyLevel
): ModuleGameChallenge[] {
  const seen = new Set<string>();
  const collected: ModuleGameChallenge[] = [];

  let modHash = 0;
  for (let i = 0; i < moduleId.length; i++) {
    modHash = (modHash * 31 + moduleId.charCodeAt(i)) % 1000003;
  }

  for (let sweep = 0; sweep < 14 && collected.length < 7; sweep++) {
    const rng = seededRng(randomSeed * 1009 + modHash * 17 + sweep * 7919 + difficulty * 313 + 41);
    const batch = buildSingleModuleVariants(moduleId, rng, difficulty);
    for (const q of batch) {
      const k = q.prompt.trim().toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        collected.push(q);
      }
    }
  }

  return collected;
}
