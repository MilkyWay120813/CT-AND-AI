import { PART1_CURRICULUM_CHAPTERS, PART2_CURRICULUM_CHAPTERS } from '../data/part1CurriculumData';
import { Part1ChapterCurriculum, Part1ModuleItem } from '../types/part1Curriculum';
import { formatMathText } from './formatMath';
import type { GeniusMathResult } from './geniusMathSolver';

interface BookGlossaryEntry {
  id: string;
  chapterRef: string;
  title: string;
  aliases: string[];
  answer: string;
  steps: string[];
  formula: string;
  example: string;
}

const BOOK_GLOSSARY: BookGlossaryEntry[] = [
  {
    id: 'book-lockers-square',
    chapterRef: 'Part I · Chapter 1 (A Square and a Cube · Module 1.1)',
    title: 'Perfect Squares & Queen Ratnamanjuri’s 100 Lockers',
    aliases: ['100 lockers', 'ratnamanjuri', 'locker puzzle', 'perfect square', 'square number', 'odd factors', 'varga'],
    answer:
      'In Ganita Prakash (Ch 1), a square number (varga) is made by multiplying a whole number by itself (n × n = n²). Only perfect squares (1, 4, 9, 16, ..., 100) have an odd number of factors, which is why only those lockers stay open at the end.',
    steps: [
      'Factors normally come in pairs (like 2 × 6 = 12), so non-squares are toggled an even number of times (open then closed).',
      'Only a square like 36 has a self-pair (6 × 6), giving an odd number of factors so its locker stays OPEN.',
      'Quick digit check: A perfect square NEVER ends in 2, 3, 7, or 8, and always has an even number of trailing zeros.',
    ],
    formula: 'n² = n × n  (Ends only in 0, 1, 4, 5, 6, or 9)',
    example: '36 has 9 factors {1, 2, 3, 4, 6, 9, 12, 18, 36} — odd count, so Locker #36 stays OPEN.',
  },
  {
    id: 'book-gnomon-odd',
    chapterRef: 'Part I · Chapter 1 (A Square and a Cube · Module 1.3)',
    title: 'Gnomon & Consecutive Odd Numbers',
    aliases: ['gnomon', 'odd layers', 'inverted l', 'consecutive odd numbers', 'odd gnomon'],
    answer:
      'In Ganita Prakash (Ch 1.3), a gnomon is an L-shaped layer of dots added around an existing square grid to build the next bigger square. Each L-layer adds the next odd number, showing that the sum of the first n odd numbers always equals n².',
    steps: [
      'Start with 1 dot (1² = 1).',
      'Wrap an L-shaped gnomon of 3 dots to make a 2 × 2 square: 1 + 3 = 4 = 2².',
      'Keep wrapping L-layers of 5, 7, 9, ... dots: 1 + 3 + 5 + ... + (2n − 1) = n².',
    ],
    formula: '1 + 3 + 5 + ... + (2n − 1) = n²',
    example: 'To grow a 3 × 3 square (9) into a 4 × 4 square (16), add the gnomon of 7 dots (9 + 7 = 16).',
  },
  {
    id: 'book-varga-mula',
    chapterRef: 'Part I · Chapter 1 (A Square and a Cube · Module 1.4)',
    title: 'Square Root (Varga-Mula)',
    aliases: ['varga-mula', 'varga mula', 'vargamula', 'square root', 'pairing prime factors'],
    answer:
      'Varga-mula (square root, written √n) is the side length of a square whose area is n. In the book, we find exact square roots by breaking n into prime factors, grouping identical primes into pairs, and multiplying one from each pair.',
    steps: [
      'Find the prime factorization of the number.',
      'Group matching prime factors into pairs (p × p).',
      'Pick one number from each pair and multiply them together to get √n.',
    ],
    formula: 'If n = (a × a) × (b × b), then √n = a × b',
    example: 'For 324 = (2 × 2) × (3 × 3) × (3 × 3), take one from each pair: 2 × 3 × 3 = 18, so √324 = 18.',
  },
  {
    id: 'book-ghana-cube',
    chapterRef: 'Part I · Chapter 1 (A Square and a Cube · Modules 1.5 & 1.7)',
    title: 'Cubic Numbers (Ghana) & Cube Root (Ghana-Mula)',
    aliases: ['ghana', 'ghana-mula', 'ghana mula', 'ghanamula', 'cubic number', 'cube root', 'successive differences'],
    answer:
      'Ghana means a cube (n³ = n × n × n), representing the volume of an n × n × n 3D block. Ghana-mula (cube root, ∛n) reverses this by grouping prime factors into triplets (sets of 3 identical factors).',
    steps: [
      'Cube: Multiply a number by itself three times (e.g., 4³ = 4 × 4 × 4 = 64).',
      'Consecutive odd blocks also build cubes: 1 = 1³, 3 + 5 = 2³, 7 + 9 + 11 = 3³.',
      'Cube root: Group prime factors into triplets and pick one factor per triplet (e.g. ∛1728 = 12).',
    ],
    formula: 'Volume = n³  |  ∛(a³ × b³) = a × b',
    example: '1728 = 2³ × 2³ × 3³, so picking one from each triplet gives ∛1728 = 2 × 2 × 3 = 12.',
  },
  {
    id: 'book-taxicab-1729',
    chapterRef: 'Part I · Chapter 1 (A Square and a Cube · Module 1.6)',
    title: 'Hardy–Ramanujan Taxicab Number (1729)',
    aliases: ['1729', 'taxicab', 'taxicab number', 'hardy', 'ramanujan', 'sum of two cubes'],
    answer:
      '1729 is famous in Ganita Prakash (Ch 1.6) as the Hardy–Ramanujan (Taxicab) number: it is the smallest positive number that can be written as the sum of two positive cubes in two different ways!',
    steps: [
      'First way: 1³ + 12³ = 1 + 1728 = 1729.',
      'Second way: 9³ + 10³ = 729 + 1000 = 1729.',
      'When G. H. Hardy visited Srinivasa Ramanujan in hospital and called taxi #1729 "dull", Ramanujan spotted this special property immediately.',
    ],
    formula: '1729 = 1³ + 12³ = 9³ + 10³',
    example: 'Other taxicab numbers exist (like 4104 = 2³ + 16³ = 9³ + 15³), but 1729 is the smallest.',
  },
  {
    id: 'book-exponents-negative',
    chapterRef: 'Part I · Chapter 2 (Power Play · Modules 2.1–2.5)',
    title: 'Powers, Exponents & Why Negative Exponents Are Fractions',
    aliases: ['power play', 'exponent', 'exponents', 'negative exponent', 'zero exponent', 'laws of exponents', '3^-2', 'a^0', 'base and exponent'],
    answer:
      'In Power Play (Ch 2), an exponent tells how many times a base is multiplied by itself (aⁿ). Moving down by 1 in the exponent always divides by the base — which is why a⁰ = 1 and a⁻ⁿ = 1 / aⁿ.',
    steps: [
      'Multiply same base: aᵐ × aⁿ = aᵐ⁺ⁿ.',
      'Divide same base: aᵐ ÷ aⁿ = aᵐ⁻ⁿ.',
      'Zero & negative pattern (base 3): 3² = 9 → (÷3) → 3¹ = 3 → (÷3) → 3⁰ = 1 → (÷3) → 3⁻¹ = 1/3 → (÷3) → 3⁻² = 1/9.',
    ],
    formula: 'aᵐ × aⁿ = aᵐ⁺ⁿ  |  a⁰ = 1  |  a⁻ⁿ = 1 / aⁿ',
    example: '3⁻² = 1 / 3² = 1/9, and (2³)² = 2³ˣ² = 2⁶ = 64.',
  },
  {
    id: 'book-scientific-notation',
    chapterRef: 'Part I · Chapter 2 (Power Play · Module 2.6)',
    title: 'Scientific Notation (Standard Form)',
    aliases: ['scientific notation', 'standard form', 'powers of 10', 'very large numbers', 'very small numbers'],
    answer:
      'In Ganita Prakash (Ch 2.6), Scientific Notation (Standard Form) writes very big or very tiny numbers neatly as k × 10ⁿ, where k is between 1 and 10 (1 ≤ k < 10) and n is an integer.',
    steps: [
      'Move the decimal point until only one non-zero digit sits to its left (giving k).',
      'Count how many places you moved the decimal point to find the power n of 10.',
      'Large numbers (≥ 10) get a positive power (+n); tiny decimals (< 1) get a negative power (−n).',
    ],
    formula: 'k × 10ⁿ   (where 1 ≤ k < 10)',
    example: '150,000,000 km = 1.5 × 10⁸ km, and 0.00042 = 4.2 × 10⁻⁴.',
  },
  {
    id: 'book-base60',
    chapterRef: 'Part I · Chapter 3 (A Story of Numbers)',
    title: 'Mesopotamian Base-60 (Sexagesimal) Number System',
    aliases: ['base 60', 'base-60', 'sexagesimal', 'mesopotamian', 'babylonian'],
    answer:
      'In Ganita Prakash (Ch 3), Mesopotamian Base-60 (sexagesimal) is a place-value system that bundles quantities in powers of 60 instead of 10 (units, 60s, 3600s). We still use Base-60 today for time (60 seconds in a minute, 60 minutes in an hour) and angles (360° = 6 × 60°)!',
    steps: [
      'Each place to the left multiplies by 60 instead of 10.',
      '60 was popular because it divides cleanly by 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30.',
      'A blank space (later a wedge symbol) was needed as a placeholder when a 60s column was empty.',
    ],
    formula: 'Base-60 Value = a × 60² + b × 60¹ + c × 60⁰',
    example: 'In Base-60, 1 hour 15 minutes = 1 × 60 + 15 = 75 minutes.',
  },
  {
    id: 'book-story-numbers',
    chapterRef: 'Part I · Chapter 3 (A Story of Numbers)',
    title: 'Story of Number Systems & Hindu Zero (Base-10)',
    aliases: ['story of numbers', 'tally marks', 'roman numerals', 'positional place value', 'hindu number system', 'egyptian numerals', 'place value'],
    answer:
      'Chapter 3 traces how humans moved from simple tally marks and Roman numerals (hard to multiply!) to positional place-value systems — first Mesopotamian Base-60 and finally the Hindu Base-10 system with Zero (0), which made arithmetic fast everywhere.',
    steps: [
      'Tally & Roman systems add symbol values together without place value (so III = 3, IV = 4, X = 10).',
      'Positional systems give each digit a value based on its position (units, tens, hundreds = powers of 10).',
      'The invention of Zero (0) as a placeholder number in India unlocked effortless decimal calculation.',
    ],
    formula: '305 = 3 × 10² + 0 × 10¹ + 5 × 10⁰',
    example: 'Without 0 as a placeholder, 35, 305, and 350 could not be told apart cleanly!',
  },
  {
    id: 'book-quadrilaterals-types',
    chapterRef: 'Part I · Chapter 4 (Quadrilaterals · Modules 4.1–4.7)',
    title: 'Quadrilaterals & Angle Sum Property (360°)',
    aliases: ['quadrilateral', 'quadrilaterals', 'parallelogram', 'angle sum property', 'rectangle properties'],
    answer:
      'In Chapter 4, a quadrilateral is any closed 4-sided polygon whose 4 interior angles always add up to 360° (because 1 diagonal splits it into two 180° triangles). Special types include parallelograms, rectangles, rhombuses, squares, trapeziums, and kites.',
    steps: [
      'Parallelogram: Opposite sides are parallel and equal; opposite angles are equal and diagonals bisect each other.',
      'Rectangle: Parallelogram with four 90° angles and equal diagonals.',
      'Square: All 4 sides equal and all 4 angles 90°; diagonals are equal and bisect at 90°.',
    ],
    formula: '∠A + ∠B + ∠C + ∠D = 360°',
    example: 'If three angles of a quadrilateral are 80°, 95°, and 105°, the 4th angle is 360° − 280° = 80°.',
  },
  {
    id: 'book-kite-geometry',
    chapterRef: 'Part I · Chapter 4 & Part II · Chapter 7 (Kite Geometry)',
    title: 'Kite (Quadrilateral Shape & Area)',
    aliases: ['kite', 'kites', 'kite quadrilateral', 'area of kite', 'area of a kite'],
    answer:
      'In Ganita Prakash (Part I Ch 4 & Part II Ch 7), a kite is a quadrilateral with two pairs of equal adjacent sides (next to each other, unlike a parallelogram’s opposite sides).',
    steps: [
      'Diagonals intersect at right angles (90°).',
      'The main line-of-symmetry diagonal bisects the other diagonal and the opposite corner angles.',
      'Area equals half the product of its two diagonals: ½ × d₁ × d₂.',
    ],
    formula: 'Area of Kite = ½ × d₁ × d₂   (Diagonals cross at 90°)',
    example: 'A kite with diagonals d₁ = 12 cm and d₂ = 8 cm has Area = ½ × 12 × 8 = 48 cm².',
  },
  {
    id: 'book-rhombus-trapezium',
    chapterRef: 'Part I · Chapter 4 & Part II · Chapter 7 (Special Quadrilaterals)',
    title: 'Rhombus & Trapezium Properties and Area',
    aliases: ['rhombus', 'trapezium', 'trapezoid', 'area of rhombus', 'area of a rhombus'],
    answer:
      'In Ganita Prakash, a rhombus is a parallelogram with all 4 sides equal whose diagonals bisect each other at 90° (Area = ½ × d₁ × d₂), while a trapezium is a quadrilateral with at least one pair of parallel opposite sides (Area = ½ × (a + b) × h).',
    steps: [
      'Rhombus: Opposite angles are equal and diagonals are perpendicular bisectors.',
      'Trapezium: Add the two parallel sides (a + b), multiply by perpendicular height h, and divide by 2.',
    ],
    formula: 'Rhombus Area = ½ × d₁ × d₂   |   Trapezium Area = ½ × (a + b) × h',
    example: 'A trapezium with parallel sides 10 cm, 14 cm and height 5 cm has Area = ½ × (10 + 14) × 5 = 60 cm².',
  },
  {
    id: 'book-cryptarithms',
    chapterRef: 'Part I · Chapter 5 (Number Play · Module 5.6)',
    title: 'Cryptarithms (Digits in Disguise)',
    aliases: ['cryptarithm', 'cryptarithms', 'digits in disguise', 'letter arithmetic'],
    answer:
      'In Number Play (Ch 5), a cryptarithm is a number puzzle where letters stand in place of hidden single digits (0–9). Each different letter stands for a different digit, and the leading leftmost letter of a multi-digit number cannot be 0.',
    steps: [
      'Look at the units column first or check carries carefully: when two single digits add up, the carry into the next column is at most 1.',
      'Check sums that create a new leftmost digit (e.g. AB + BA = CDC forces C = 1!).',
      'Test candidate digits systematically and verify every column works cleanly.',
    ],
    formula: 'Each letter = unique digit 0–9 (leading digit ≠ 0)',
    example: 'In A + A + A = BA, testing digits gives 5 + 5 + 5 = 15, so A = 5 and B = 1.',
  },
  {
    id: 'book-divisibility-parity',
    chapterRef: 'Part I · Chapter 5 (Number Play · Modules 5.1–5.5)',
    title: 'Number Play: Parity, Divisibility Rules & Digital Roots',
    aliases: ['number play', 'parity', 'modular arithmetic', 'divisibility rule', 'divisibility rules', 'digital root', 'divisible by 9', 'divisible by 11'],
    answer:
      'Number Play (Ch 5) explores parity (even/odd patterns), remainders, and fast divisibility shortcuts (2, 3, 4, 5, 8, 9, 10, 11) based on base-10 place value.',
    steps: [
      'Parity rules: Even + Even = Even, Odd + Odd = Even, Even + Odd = Odd.',
      'Divisible by 3 or 9: Add the digits! If the digit sum divides by 3 (or 9), the whole number does.',
      'Divisible by 11: Find (sum of odd-position digits) − (sum of even-position digits); if it is 0 or a multiple of 11, it divides by 11.',
    ],
    formula: 'Sum of digits divisible by 9 ⇔ Number divisible by 9',
    example: 'Is 4,725 divisible by 9? 4 + 7 + 2 + 5 = 18 (divisible by 9) → Yes! (4725 = 9 × 525).',
  },
  {
    id: 'book-ista-gunana',
    chapterRef: 'Part I · Chapter 6 (We Distribute, Yet Things Multiply · Module 6.6)',
    title: 'Iṣṭa-Guṇana (Brahmagupta’s Fast Mental Multiplication)',
    aliases: ['ista-gunana', 'ishta gunana', 'ishta-gunana', 'ista gunana', 'brahmagupta multiplication'],
    answer:
      'Iṣṭa-Guṇana (meaning "desired multiplication", taught by Brahmagupta in Ganita Prakash Ch 6) is a smart rounding shortcut: instead of multiplying an awkward number directly, shift both factors symmetrically around a neat round number (a + b)(a − b) = a² − b², or break a × b into a × (c ± d).',
    steps: [
      'Spot a round anchor number near both factors (like 100 for 98 × 102, or 50 for 47 × 53).',
      'Rewrite as (a − b)(a + b) = a² − b².',
      'Subtract the tiny square b² from the easy big square a² in seconds!',
    ],
    formula: '(a − b)(a + b) = a² − b²   |   a × (b + c) = ab + ac',
    example: '97 × 103 = (100 − 3)(100 + 3) = 100² − 3² = 10,000 − 9 = 9,991.',
  },
  {
    id: 'book-identities-distributive',
    chapterRef: 'Part I · Chapter 6 (We Distribute, Yet Things Multiply)',
    title: 'Distributive Property & Algebraic Identities',
    aliases: ['distributive property', 'algebraic identity', 'identities', 'difference of squares', 'binomial expansion', 'mind the mistake'],
    answer:
      'In Chapter 6, the distributive property states that multiplying a sum by a number multiplies every term inside the brackets: a(b + c) = ab + ac. Using area rectangles, this gives the three classic algebraic identities used throughout algebra.',
    steps: [
      'Identity 1: (a + b)² = a² + 2ab + b²  (never forget the middle 2ab term!).',
      'Identity 2: (a − b)² = a² − 2ab + b².',
      'Identity 3 (Difference of Squares): (a + b)(a − b) = a² − b².',
    ],
    formula: '(a + b)² = a² + 2ab + b²  |  (a + b)(a − b) = a² − b²',
    example: 'Compute 53² mentally: (50 + 3)² = 2500 + 2(50)(3) + 9 = 2809.',
  },
  {
    id: 'book-trairasika-proportion',
    chapterRef: 'Part I · Chapter 7 & Part II · Ch 3 (Proportional Reasoning)',
    title: 'Trairāśika (Rule of Three) & Direct Proportion',
    aliases: ['trairasika', 'rule of three', 'proportional reasoning', 'proportion', 'direct proportion', 'ratio'],
    answer:
      'Trairāśika (meaning "Rule of Three", named by Aryabhata) is the textbook method for direct proportion: when you know 3 quantities in a proportional relationship (a : b :: c : d), you find the 4th unknown value by scaling with the same ratio or finding the unit value first.',
    steps: [
      'Check if it is Direct Proportion: doubling one quantity doubles the other (ratio y/x stays constant).',
      'Write a : b :: c : x, where "measure" and "fruit" match the new "wish".',
      'Solve by cross-multiplying (a × x = b × c) so x = (b × c) ÷ a.',
    ],
    formula: 'a / b = c / x   ⇒   x = (b × c) ÷ a',
    example: 'If 5 notebooks cost ₹120, 8 notebooks cost (120 × 8) ÷ 5 = ₹192.',
  },
  {
    id: 'book-inverse-proportion',
    chapterRef: 'Part II · Chapter 3 (Proportional Reasoning-2 · Inverse Proportion)',
    title: 'Inverse Proportion (Constant Product)',
    aliases: ['inverse proportion', 'inversely proportional', 'indirect proportion'],
    answer:
      'Inverse proportion means two quantities move in opposite directions so their product always stays constant (x × y = k). Doubling one quantity halves the other — for example, more workers finish the same job in fewer days.',
    steps: [
      'Check the invariant: x₁ × y₁ must stay constant.',
      'Set up the equation x₁ × y₁ = x₂ × y₂.',
      'Divide by the known new value to find the unknown.',
    ],
    formula: 'x₁ × y₁ = x₂ × y₂ = k',
    example: 'If 6 workers build a wall in 10 days, 15 workers take (6 × 10) ÷ 15 = 4 days.',
  },
  {
    id: 'book-representative-fraction',
    chapterRef: 'Part I · Chapter 7 & Part II · Ch 3 (Map Scales)',
    title: 'Representative Fraction (RF / Map Scale)',
    aliases: ['representative fraction', 'map scale', 'rf scale'],
    answer:
      'Representative Fraction (RF) is a unitless ratio that compares a distance measured on a map or drawing to the actual distance on the ground, after converting both into the exact same unit.',
    steps: [
      'Convert both the map length and real-world distance into the same unit (usually centimetres).',
      'Write the ratio Map Distance : Actual Distance and simplify to 1 : n.',
      'Multiply any map measurement by n to get the real ground distance.',
    ],
    formula: 'RF = Map Distance ÷ Actual Distance (same units)',
    example: 'If 1 cm on a map equals 5 km (500,000 cm), the Representative Fraction is 1 : 500,000.',
  },
  {
    id: 'book-percentages-fractions-disguise',
    chapterRef: 'Part II · Chapter 1 (Fractions in Disguise)',
    title: 'Percentages, Profit/Loss, Discount & Compounding',
    aliases: ['fractions in disguise', 'percentage', 'percentages', 'marked price', 'discount', 'profit and loss', 'compound interest', 'depreciation', 'inflation', 'fdp trio'],
    answer:
      'In Fractions in Disguise (Part II Ch 1), "per cent" simply means "out of 100" — a fraction with denominator 100. Multiplying by (1 + r/100) handles increases, taxes, and inflation, while (1 − r/100) handles discounts and depreciation.',
    steps: [
      'Fraction ↔ Decimal ↔ Percentage (FDP): e.g., ¾ = 0.75 = 75%.',
      'Percent change = (Change ÷ Original Value) × 100%.',
      'Successive percentage changes multiply (NOT add!): +20% then −20% gives 1.2 × 0.8 = 0.96 (a net 4% drop!).',
    ],
    formula: 'New Value = Original × (1 ± r/100)ⁿ',
    example: 'A ₹800 jacket with a 25% discount costs ₹800 × 0.75 = ₹600.',
  },
  {
    id: 'book-baudhayana-pythagoras',
    chapterRef: 'Part II · Chapter 2 (The Baudhayana–Pythagoras Theorem)',
    title: 'Baudhāyana–Pythagoras Theorem & Right Triangles',
    aliases: ['baudhayana', 'baudhayana theorem', 'pythagoras', 'pythagorean theorem', 'pythagoras theorem', 'baudhayana triples', 'pythagorean triplet', 'hypotenuse', 'root 2', '√2'],
    answer:
      'In Part II Chapter 2, the Baudhāyana–Pythagoras Theorem states that in any right-angled triangle, the square on the longest side (hypotenuse c) equals the sum of the squares on the two shorter legs (a and b): a² + b² = c².',
    steps: [
      'Identify the two legs (a, b) meeting at the 90° angle and the opposite hypotenuse (c).',
      'Square both legs and add them: a² + b².',
      'Take the square root to find the hypotenuse: c = √(a² + b²).',
      'Baudhāyana triples (like 3-4-5, 5-12-13, 8-15-17) give whole-number right triangles; a 1×1 square’s diagonal is √2 (non-terminating).',
    ],
    formula: 'a² + b² = c²',
    example: 'With legs a = 6 cm and b = 8 cm, c² = 6² + 8² = 36 + 64 = 100 ⇒ hypotenuse c = √100 = 10 cm.',
  },
  {
    id: 'book-koch-snowflake',
    chapterRef: 'Part II · Chapter 4 (Exploring Some Geometric Themes · Module 4.3)',
    title: 'Koch Snowflake (Infinite Perimeter in Finite Area)',
    aliases: ['koch snowflake', 'koch curve', 'koch', 'snowflake fractal'],
    answer:
      'In Ganita Prakash (Part II · Ch 4, Module 4.3), a Koch Snowflake is a famous fractal built from an equilateral triangle: at every step, you divide each straight side into 3 equal thirds and replace the middle third with a triangular bump pointing outward.',
    steps: [
      'Step 0: Start with an equilateral triangle (3 equal sides, perimeter P₀).',
      'Step 1: Divide each side into 3 equal parts and pop the middle third out into 2 equal segments — turning 1 segment into 4 segments of 1/3 length (creating a 6-pointed star with 12 sides).',
      'Step n Formula: Total sides = 3 × 4ⁿ, each small segment has length s₀ × (1/3)ⁿ, and Perimeter Pₙ = P₀ × (4/3)ⁿ.',
      'Infinite Perimeter Paradox: Because multiplying by 4/3 makes the perimeter grow forever, its boundary becomes infinitely long even though the snowflake stays inside a small circle!',
    ],
    formula: 'Sides: Sₙ = 3 × 4ⁿ   |   Perimeter: Pₙ = P₀ × (4/3)ⁿ',
    example: 'Starting with a 9 cm side triangle (P₀ = 27 cm): at Step 2 there are 3 × 4² = 48 sides of length 1 cm, giving Perimeter = 27 × (4/3)² = 48 cm.',
  },
  {
    id: 'book-sierpinski-fractal',
    chapterRef: 'Part II · Chapter 4 (Exploring Some Geometric Themes · Module 4.2)',
    title: 'Sierpinski Triangle (Gasket) & Sierpinski Carpet',
    aliases: ['sierpinski', 'sierpinski triangle', 'sierpinski gasket', 'sierpinski carpet'],
    answer:
      'In Ganita Prakash (Part II · Ch 4, Module 4.2), a Sierpinski Triangle (Gasket) is a self-similar fractal made by splitting a filled triangle into 4 equal smaller triangles and removing the center triangle over and over.',
    steps: [
      'Step 0: Start with 1 filled triangle (shaded area = 1).',
      'Step 1: Remove the middle inverted triangle → 3 smaller shaded triangles remain (3/4 of original area).',
      'At Step n: There are 3ⁿ solid triangles left, and remaining shaded area = (3/4)ⁿ (which shrinks toward 0!).',
      'Sierpinski Carpet works the same way on a square: split into a 3 × 3 grid and remove the 1 center square (8ⁿ remain, area (8/9)ⁿ).',
    ],
    formula: 'Triangles = 3ⁿ  |  Area Remaining = (3/4)ⁿ',
    example: 'At Step 3 of a Sierpinski Triangle, there are 3³ = 27 filled triangles covering (3/4)³ = 27/64 of the original area.',
  },
  {
    id: 'book-cube-nets',
    chapterRef: 'Part II · Chapter 4 (Exploring Some Geometric Themes · Module 4.5)',
    title: '11 Nets of a Cube',
    aliases: ['nets of a cube', 'cube net', 'cube nets', '11 nets', 'net of a cube'],
    answer:
      'A net of a cube is a flat 2D arrangement of 6 equal squares joined edge-to-edge that folds up cleanly into a hollow 3D cube without overlapping faces. Out of 35 possible 6-square shapes (hexominoes), exactly 11 nets fold into a cube!',
    steps: [
      'Six of the 11 nets use a 4-square central strip with 1 square attached on each side (the classic cross/T shapes).',
      'Four nets use a 3-square strip, and 1 special staircase net uses three 2-square steps (2-2-2).',
      'Opposite-face rule: On a straight row of squares, squares separated by 1 square in between always end up on opposite faces of the folded cube!',
    ],
    formula: 'Total valid cube nets = 11 (always 6 square faces, opposite faces skip 1 square)',
    example: 'On a standard die net (where opposite faces add to 7), 1 sits two squares away from 6 along the central strip.',
  },
  {
    id: 'book-hungry-ant',
    chapterRef: 'Part II · Chapter 4 (Exploring Some Geometric Themes · Module 4.6)',
    title: 'Hungry Ant & Laddu (Shortest Path on a 3D Solid)',
    aliases: ['hungry ant', 'laddu', 'ant and laddu', 'shortest path on cube', 'unfolding 3d net'],
    answer:
      'In the Hungry Ant & Laddu puzzle (Part II · Ch 4), an ant cannot tunnel through the inside of a solid box — it must walk along the outside faces. You find the shortest surface path by unfolding the box into a flat 2D net and connecting the ant and laddu with a straight diagonal line!',
    steps: [
      'Unfold the adjacent faces connecting the start corner and target corner flat onto paper.',
      'Read the total horizontal (Δx) and vertical (Δy) distances along the unfolded rectangle.',
      'Apply the Baudhāyana–Pythagoras Theorem: Shortest path = √(Δx² + Δy²).',
      'Tip: Check different unfoldings if side lengths differ — the pair with the smallest sum of squares gives the true shortest route!',
    ],
    formula: 'Shortest Path = √(Δx² + Δy²)',
    example: 'To cross a 1×1×1 unit cube to the opposite corner, unfolding 2 adjacent faces forms a 2 × 1 rectangle, giving √(2² + 1²) = √5 units.',
  },
  {
    id: 'book-fractals-general',
    chapterRef: 'Part II · Chapter 4 (Exploring Some Geometric Themes · Modules 4.1, 4.4, 4.7)',
    title: 'Fractals, Self-Similarity & 3D Views (Orthographic / Isometric)',
    aliases: ['fractal', 'fractals', 'self-similarity', 'orthographic', 'isometric', 'sikhara'],
    answer:
      'In Part II Chapter 4, a fractal is a geometric pattern that shows self-similarity — zooming in on a small piece reveals a miniature copy of the whole shape (seen in temple Śikharas, ferns, Sierpinski triangles, and the Koch snowflake). The chapter also teaches 2D-to-3D views (orthographic top/front/side views and isometric grids).',
    steps: [
      'Self-Similarity: Repeating the same geometric rule at smaller and smaller scales builds a fractal.',
      'Orthographic Views: Draw a 3D object flat from Top, Front, and Side perspectives.',
      'Isometric Drawing: Uses a 60° triangular dot grid so parallel 3D edges stay equally spaced without perspective distortion.',
    ],
    formula: 'Fractal Scaling: Small part looks like the whole shape',
    example: 'Both a cauliflower floret and the Sierpinski Triangle repeat the exact same pattern at smaller scales.',
  },
  {
    id: 'book-mean-median-dots',
    chapterRef: 'Part II · Chapter 5 (Tales by Dots and Lines)',
    title: 'Mean, Median & Reading Data Graphs',
    aliases: ['tales by dots', 'mean and median', 'what is mean', 'what is the mean', 'arithmetic mean', 'median', 'centre of balance', 'weighted average', 'frequency table', 'bar graph', 'line graph'],
    answer:
      'In Part II Chapter 5, the Mean is the "balance point" of data (sum of values ÷ total count), while the Median is the exact middle value after sorting the list from smallest to largest. Extreme outliers pull the Mean strongly, while the Median stays steady!',
    steps: [
      'Mean = (Sum of all values) ÷ (Number of values).',
      'Median: Sort the numbers first! Pick the middle number (or average the middle two if count is even).',
      'Bar graphs compare separate categories; Line graphs show trends changing over time.',
    ],
    formula: 'Mean = ∑x / n   |   Median = Middle sorted value',
    example: 'For [2, 4, 6, 8, 80]: the Median is 6 (fair center!), while the Mean jumps to 20 because of the 80 outlier.',
  },
  {
    id: 'book-shubham-birthday',
    chapterRef: 'Part II · Chapter 6 (Algebra Play)',
    title: 'Shubham’s Birthday Machine Trick',
    aliases: ['shubham', 'birthday trick', 'birthday machine', '100m + d + 165'],
    answer:
      'In Shubham’s Birthday Trick (Part II · Ch 6), multiplying your birth month M by 2, adding 5, multiplying by 5, subtracting 10, multiplying by 10, and adding your birth day D always simplifies algebraically to 100M + D + 165 — so subtracting 165 cleanly reveals your Month (M) and Day (D)!',
    steps: [
      'Start with Month M: ((2M + 5) × 5 − 10) × 10 + D.',
      'Expand: ((10M + 25) − 10) × 10 + D = (10M + 15) × 10 + D = 100M + 150 + D (+ 15 if final +15 step is used → +165).',
      'Subtracting the constant offset leaves 100M + D: hundreds place = Month, last two digits = Day!',
    ],
    formula: 'Output = 100M + D + 165   ⇒   Result − 165 = Month|Day',
    example: 'If someone was born on August 24 (M = 8, D = 24), Output − 165 = 824 → Month 8, Day 24!',
  },
  {
    id: 'book-number-pyramid',
    chapterRef: 'Part II · Chapter 6 (Algebra Play)',
    title: 'Number Pyramids (Virahanka / Karim Pyramid Sums)',
    aliases: ['number pyramid', 'number pyramids', 'virahanka', 'karim pyramid'],
    answer:
      'In a Number Pyramid (Part II · Ch 6), each brick equals the sum of the two bricks directly beneath it. Naming the bottom bricks with variables shows how middle bricks get counted multiple times as they climb to the apex!',
    steps: [
      'For a 3-brick base (a, b, c): Row 2 has (a + b) and (b + c), so the Apex = a + 2b + c.',
      'For a 4-brick base (a, b, c, d): the Apex = a + 3b + 3c + d (coefficients follow Pascal’s triangle: 1-2-1, 1-3-3-1!).',
      'Reverse puzzle: Use the Apex formula to solve directly for any missing brick.',
    ],
    formula: '3-Brick Apex = a + 2b + c   |   4-Brick Apex = a + 3b + 3c + d',
    example: 'For base [3, 5, 2], Apex = 3 + 2(5) + 2 = 15.',
  },
  {
    id: 'book-calendar-9c',
    chapterRef: 'Part II · Chapter 6 (Algebra Play)',
    title: 'Calendar 3×3 Cross & Block Trick (9c Rule)',
    aliases: ['calendar grid', 'calendar trick', '3x3 cross', '3x3 block', '9c'],
    answer:
      'In any 3×3 square of dates on a calendar centered at date c, the sum of all 9 dates is always 9 × c! That happens because dates above/below differ by ±7 and left/right differ by ±1, so all offsets cancel out around the center c.',
    steps: [
      'Write the middle row as (c − 1), c, (c + 1) → sum = 3c.',
      'Write the top row as (c − 8), (c − 7), (c − 6) and bottom row as (c + 6), (c + 7), (c + 8).',
      'Every −k cancels with +k, leaving 9 copies of c: Total = 9c.',
    ],
    formula: '3×3 Calendar Sum = 9c   (5-cell Plus Cross Sum = 5c)',
    example: 'If the sum of a 3×3 calendar box is 135, the center date is immediately 135 ÷ 9 = 15!',
  },
  {
    id: 'book-algebra-play-general',
    chapterRef: 'Part II · Chapter 6 (Algebra Play)',
    title: 'Algebra Play: Explaining Number Tricks with Variables',
    aliases: ['algebra play', 'think of a number', 'number trick'],
    answer:
      'Algebra Play (Part II · Ch 6) shows how replacing an unknown secret number with x explains why magic number tricks always land on the same answer: +x and −x cancel out neatly during simplification.',
    steps: [
      'Let the starting secret number be x.',
      'Apply each step algebraically (double → 2x, add 10 → 2x + 10, halve → x + 5).',
      'Subtract your original number (x + 5 − x = 5): the x disappears, proving the trick works for any number!',
    ],
    formula: '(2x + 2k) ÷ 2 − x = k',
    example: 'Pick x = 19: double (38), add 10 (48), halve (24), subtract 19 → always gives 5!',
  },
  {
    id: 'book-area-triangle',
    chapterRef: 'Part II · Chapter 7 (Area · Triangle Dissection)',
    title: 'Area of a Triangle (Including Obtuse Triangles)',
    aliases: ['area of triangle', 'area of a triangle', 'obtuse triangle', 'triangle area', 'medians of a triangle'],
    answer:
      'In Ganita Prakash (Part II · Ch 7), the area of ANY triangle — acute, right, or obtuse — is half the product of its base and perpendicular height: Area = ½ × base × height (because any triangle fits as half of its enclosing rectangle or parallelogram!).',
    steps: [
      'Pick any side as the base (b).',
      'Measure the perpendicular height (h) straight up to the opposite vertex (even if the altitude falls outside an obtuse triangle!).',
      'Compute ½ × b × h. Bonus fact: every median splits a triangle into two halves of exact equal area!',
    ],
    formula: 'Area of Triangle = ½ × base × height',
    example: 'A triangle with base 12 cm and perpendicular height 7 cm has Area = ½ × 12 × 7 = 42 cm².',
  },
  {
    id: 'book-area-parallelogram',
    chapterRef: 'Part II · Chapter 7 (Area · Parallelogram Dissection)',
    title: 'Area of a Parallelogram',
    aliases: ['area of parallelogram', 'area of a parallelogram', 'parallelogram area'],
    answer:
      'In Ganita Prakash (Part II · Ch 7), the area of a parallelogram equals base × perpendicular height (b × h). Cutting off the slanted triangle on one side and sliding it to the other side turns every parallelogram into an exact b × h rectangle!',
    steps: [
      'Use the perpendicular height h between the parallel base and top (NOT the slanted side length!).',
      'Multiply base × height.',
    ],
    formula: 'Area of Parallelogram = base × height',
    example: 'A parallelogram with base 10 cm and height 6 cm has Area = 10 × 6 = 60 cm².',
  },
  {
    id: 'book-area-dissection',
    chapterRef: 'Part II · Chapter 7 (Area)',
    title: 'Area Formulas & Visual Dissection Proofs',
    aliases: ['area vs perimeter', 'triangulation', 'gopal', 'river reflection'],
    answer:
      'Part II Chapter 7 derives every 2D area formula by cutting and rearranging shapes into rectangles: Triangle = ½bh, Parallelogram = bh, Rhombus/Kite = ½d₁d₂, and Trapezium = ½(a + b)h.',
    steps: [
      'Triangle Area = ½ × base × height (every median splits a triangle into 2 equal-area halves!).',
      'Parallelogram Area = base × perpendicular height (b × h).',
      'Rhombus or Kite Area = ½ × d₁ × d₂.',
      'Trapezium Area = ½ × (a + b) × h, where a and b are the two parallel sides.',
    ],
    formula: 'Triangle: ½bh · Parallelogram: bh · Trapezium: ½(a+b)h · Rhombus/Kite: ½d₁d₂',
    example: 'A rhombus with diagonals 10 cm and 8 cm has Area = ½ × 10 × 8 = 40 cm².',
  },
];

interface IndexedModule {
  chapterTitle: string;
  partLabel: string;
  module: Part1ModuleItem;
  searchBlob: string;
  titleTokens: string[];
}

const STOP_WORDS = new Set([
  'the',
  'is',
  'are',
  'was',
  'were',
  'am',
  'a',
  'an',
  'of',
  'in',
  'on',
  'at',
  'to',
  'for',
  'from',
  'by',
  'with',
  'and',
  'or',
  'what',
  'which',
  'who',
  'why',
  'how',
  'when',
  'where',
  'explain',
  'define',
  'tell',
  'me',
  'about',
  'give',
  'book',
  'ganita',
  'prakash',
  'class',
  'mean',
  'does',
  'do',
  'can',
  'you',
  'please',
  'formula',
  'example',
  'chapter',
  'module',
  'called',
  'meaning',
  'definition',
  'simple',
  'easy',
]);

function normalizeText(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s^+.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTokens(s: string): string[] {
  return normalizeText(s)
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !STOP_WORDS.has(t));
}

let cachedModuleIndex: IndexedModule[] | null = null;

function getModuleIndex(): IndexedModule[] {
  if (cachedModuleIndex) return cachedModuleIndex;
  const allChapters: Part1ChapterCurriculum[] = [
    ...PART1_CURRICULUM_CHAPTERS,
    ...PART2_CURRICULUM_CHAPTERS,
  ];
  const list: IndexedModule[] = [];
  for (const ch of allChapters) {
    if (!ch.modules || ch.modules.length === 0) continue;
    for (const mod of ch.modules) {
      const partLabel = ch.chapterBadgeLabel.includes('Part II') ? 'Part II' : 'Part I';
      const titleTokens = getTokens(`${ch.title} ${mod.title} ${mod.cardHeadline}`);
      const searchBlob = normalizeText(
        [
          ch.title,
          mod.title,
          mod.cardHeadline,
          mod.cardTeaser,
          mod.videoCue?.summary || '',
          ...(mod.videoCue?.keyTakeaways || []),
        ].join(' ')
      );
      list.push({
        chapterTitle: ch.title,
        partLabel,
        module: mod,
        searchBlob,
        titleTokens,
      });
    }
  }
  cachedModuleIndex = list;
  return list;
}

function keepConciseSentences(text: string, maxSentences = 2): string {
  const cleaned = formatMathText(text);
  const parts = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.slice(0, maxSentences).join(' ') || cleaned;
}

export function searchBookKnowledge(rawQuestion: string): GeniusMathResult | null {
  const normQ = normalizeText(rawQuestion);
  if (!normQ || normQ.length < 2) return null;

  // Don't hijack explicit calculation requests ("derivative of ...", "cube of 213", "3x + 5 = 20")
  if (
    /^(?:derivative|differentiate|integral|integrate|solve|simplify|expand|cube of|square of|square root of|cube root of|factors of|prime factors|lcm|hcf|gcd)\b/i.test(
      normQ
    )
  ) {
    return null;
  }

  const qTokens = getTokens(rawQuestion);
  if (qTokens.length === 0 && !/\b1729\b/.test(normQ)) return null;

  // 1. Check Curated Book Term Glossary first (highest precision for textbook terms)
  let bestGlossary: { entry: BookGlossaryEntry; score: number } | null = null;
  for (const entry of BOOK_GLOSSARY) {
    let score = 0;
    for (const aliasRaw of entry.aliases) {
      const alias = normalizeText(aliasRaw);
      if (normQ === alias) {
        score = Math.max(score, 100);
      } else if (normQ.includes(alias) && alias.length >= 4) {
        score = Math.max(score, 60 + alias.length);
      } else {
        const aTokens = getTokens(alias);
        if (aTokens.length > 0 && aTokens.every((t) => qTokens.includes(t))) {
          score = Math.max(score, 35 + aTokens.length * 10);
        }
      }
    }

    // Also reward strong overlap on specific keywords inside title
    const titleWords = getTokens(entry.title);
    const hits = qTokens.filter((qt) => titleWords.includes(qt));
    if (hits.length > 0) {
      score += hits.length * 12;
    }

    if (score >= 30 && (!bestGlossary || score > bestGlossary.score)) {
      bestGlossary = { entry, score };
    }
  }

  if (bestGlossary) {
    const e = bestGlossary.entry;
    return {
      answer: formatMathText(e.answer),
      steps: e.steps.map((s) => formatMathText(s)),
      formula: formatMathText(e.formula),
      example: formatMathText(`${e.chapterRef} — Example: ${e.example}`),
    };
  }

  // 2. Fall back to indexing all 112 Modules across all 14 Textbook Chapters
  if (qTokens.length === 0) return null;
  const modules = getModuleIndex();
  let bestMod: { item: IndexedModule; score: number } | null = null;

  for (const item of modules) {
    if (item.module.isWrapUpModule) continue;
    let score = 0;
    let titleHitCount = 0;

    const normModTitle = normalizeText(item.module.title);
    if (normQ.includes(normModTitle) && normModTitle.length >= 6) {
      score += 80;
    }

    for (const qt of qTokens) {
      if (qt.length < 3) continue;
      if (item.titleTokens.includes(qt)) {
        score += 18;
        titleHitCount++;
      } else if (item.searchBlob.includes(qt)) {
        score += 5;
      }
    }

    if (titleHitCount >= 1 && score >= 24 && (!bestMod || score > bestMod.score)) {
      bestMod = { item, score };
    }
  }

  if (bestMod) {
    const { chapterTitle, partLabel, module: mod } = bestMod.item;
    const summaryText =
      mod.videoCue?.readingParagraphs?.[0] || mod.videoCue?.summary || mod.cardTeaser;
    const takeaways = (mod.videoCue?.keyTakeaways || []).slice(0, 3);
    const firstFormula =
      mod.videoCue?.scenes?.find((sc) => sc.boardFormula)?.boardFormula || '';
    const worked = mod.videoCue?.workedExample;

    return {
      answer: `${keepConciseSentences(summaryText, 2)} (From Ganita Prakash ${partLabel} · ${chapterTitle}, ${mod.moduleCode}: ${mod.title})`,
      steps: takeaways.map((t) => keepConciseSentences(t, 1)),
      formula: formatMathText(firstFormula),
      example: worked
        ? formatMathText(`Example: ${worked.problem} → Answer: ${worked.answer}`)
        : '',
    };
  }

  return null;
}
