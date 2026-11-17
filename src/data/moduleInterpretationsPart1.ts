export interface ModuleFunInterpretation {
  headline: string;
  analogyStory: string;
  intuitiveSecret: string;
  partyTrickOrProTip: string;
  funEmoji: string;
  quoteTag: string;
}

export const PART1_MODULE_INTERPRETATIONS: Record<string, ModuleFunInterpretation> = {
  // PART I · CHAPTER 1: A Square and a Cube (mod-1-1 to mod-1-8)
  'mod-1-1': {
    headline: 'The 1,000 School Lockers Mystery',
    analogyStory:
      'Imagine 1,000 students running down a school corridor toggling locker doors. Most numbers have factors that arrive in pairs (like 12 = 1×12, 2×6, 3×4—six toggles leave it closed). Only perfect squares (1, 4, 9, 16, 25…) have a factor paired with itself (4 × 4 = 16), giving them an odd number of toggles so they stay OPEN.',
    intuitiveSecret:
      'A locker stays OPEN if and only if its number has an ODD count of divisors—which happens exclusively for square numbers.',
    partyTrickOrProTip:
      'Tell a friend to pick any number below 100 and count all its factors: if the count is odd, you instantly know it is a perfect square without even knowing their number!',
    funEmoji: '🔐',
    quoteTag: 'Squares are the only numbers with an unpaired middle factor standing at their center.',
  },
  'mod-1-2': {
    headline: 'The Unit Digit Crystal Ball',
    analogyStory:
      'No matter how huge a whole number is—even nine digits long—its square’s very last digit is locked in by its own last digit, like a shadow that never lies.',
    intuitiveSecret:
      'Squares can ONLY end in 0, 1, 4, 5, 6, or 9. The digits 2, 3, 7, and 8 are permanently exiled from the ending of any perfect square.',
    partyTrickOrProTip:
      'Notice the mirror symmetry around 5: 1² and 9² both end in 1; 2² and 8² both end in 4; 3² and 7² both end in 9; 4² and 6² both end in 6!',
    funEmoji: '🔮',
    quoteTag: 'Glance at the unit digit first—it exposes fake squares in half a second.',
  },
  'mod-1-3': {
    headline: 'The Growing L-Shape Onion Mosaic',
    analogyStory:
      'Place 1 tile on your desk. Wrap a 3-tile L-shaped border around two edges and you get a 2×2 square (1 + 3 = 4). Wrap 5 tiles around that and you get a 3×3 square (4 + 5 = 9). Every new square grows by wearing the next odd number like an outer coat!',
    intuitiveSecret:
      'The sum of the first n consecutive odd natural numbers is always exactly n²—no tedious addition required.',
    partyTrickOrProTip:
      'Between n² and (n + 1)² there are always 2n non-square integers. Between 12² and 13², there are instantly 2 × 12 = 24 whole numbers!',
    funEmoji: '🧱',
    quoteTag: 'Every perfect square is a nested staircase of consecutive odd numbers.',
  },
  'mod-1-4': {
    headline: 'Noah’s Ark: The Twin Factor Rule',
    analogyStory:
      'Think of prime factors boarding a math ark: for a number to be a perfect square, every prime factor MUST board in matching twin pairs (two 2s, two 3s, two 5s). If even one prime is left standing solo, the square fails.',
    intuitiveSecret:
      'Taking √n simply picks ONE prime representative from each matched twin pair; and for big squares, estimation narrows √n between two consecutive integers.',
    partyTrickOrProTip:
      'If 72 = (2×2) × (3×3) × 2 has a lonely 2 left over, multiplying or dividing by that lonely 2 immediately heals it into a square (144 or 36)!',
    funEmoji: '🦁',
    quoteTag: 'Square roots unlock when every prime factor finds its identical twin.',
  },
  'mod-1-5': {
    headline: 'From Flat Floor Tiles to 3D Minecraft Cubes',
    analogyStory:
      'A square lives flat on paper, but a cube explodes outward into 3D space! Doubling a block’s edge from 1 cm to 2 cm multiplies its building volume not by 2, not by 4, but by 2 × 2 × 2 = 8 solid cubes.',
    intuitiveSecret:
      'For a number to be a perfect cube, its prime factors must gather in triplets (groups of three), and its trailing zeros always come in multiples of 3.',
    partyTrickOrProTip:
      'Cube unit digits never get banned—every digit 0–9 appears! Only 2↔8 and 3↔7 swap places when cubed; all other digits keep themselves.',
    funEmoji: '🧊',
    quoteTag: 'In 3D space, doubling every edge octuples the world inside.',
  },
  'mod-1-6': {
    headline: 'Ramanujan’s London Taxi #1729',
    analogyStory:
      'When G. H. Hardy visited an ill Srinivasa Ramanujan and remarked his taxi number 1729 seemed dull, Ramanujan immediately replied: “No! It is the smallest number expressible as the sum of two cubes in two different ways!”',
    intuitiveSecret:
      '1729 = 1³ + 12³ = 1 + 1728 AND 1729 = 9³ + 10³ = 729 + 1000—making it the legendary Taxicab Number Ta(2).',
    partyTrickOrProTip:
      'Keep 1³=1, 9³=729, 10³=1000, and 12³=1728 memorized—spot 729 + 1000 anywhere and you have 1729’s secret.',
    funEmoji: '🚕',
    quoteTag: 'Where others saw a plain license plate, Ramanujan saw twin constellations of cubes.',
  },
  'mod-1-7': {
    headline: 'Peeling Cube Roots & Consecutive Odd Blocks',
    analogyStory:
      'Just as odd numbers build squares one by one (1; 3; 5), blocks of consecutive odd numbers build cubes! 1 = 1³; 3 + 5 = 8 = 2³; 7 + 9 + 11 = 27 = 3³; 13 + 15 + 17 + 19 = 64 = 4³.',
    intuitiveSecret:
      'For any perfect cube under 1,000,000, split off the rightmost 3 digits to read the unit digit of ∛n, and check which cube sits below the leftmost group for the tens digit!',
    partyTrickOrProTip:
      'Find ∛19683 mentally: last group 683 ends in 3 → root ends in 7; first group 19 lies between 2³=8 and 3³=27 → tens digit is 2 → Answer: 27!',
    funEmoji: '💎',
    quoteTag: 'Group in threes from the right and cube roots fall apart in two glances.',
  },
  'mod-1-8': {
    headline: 'The Royal Treasury Square & Cube Vault',
    analogyStory:
      'Think of Chapter 1 as a dual-key vault: Key 1 tests 2D area symmetry (squares, odd gnomons, Pythagorean triples), while Key 2 tests 3D volume symmetry (cubes, triplets, taxicab sums). Combining both keys unlocks any root puzzle.',
    intuitiveSecret:
      'Squares pair primes in twos (n^(1/2)); cubes group primes in threes (n^(1/3)). Both obey the exact same factor-grouping architecture.',
    partyTrickOrProTip:
      'Check if a number is BOTH a square and a cube (like 64 = 8² = 4³): its primes must group in sixes (n⁶)!',
    funEmoji: '🏛️',
    quoteTag: 'Master pairs and triplets, and every higher root becomes transparent.',
  },

  // PART I · CHAPTER 2: Power Play (mod-2-1 to mod-2-8)
  'mod-2-1': {
    headline: 'Folding Paper to the Moon',
    analogyStory:
      'Fold an ordinary 0.1 mm sheet of paper in half 42 times and its stack reaches from Earth to the Moon! Repeatedly multiplying by 2 starts quietly (2, 4, 8, 16…) and then accelerates faster than any spaceship.',
    intuitiveSecret:
      'Multiplicative growth multiplies the CURRENT total each step (×2), unlike additive growth (+2) which plods along in a straight line.',
    partyTrickOrProTip:
      'Remember 2¹⁰ = 1,024 ≈ 1,000. That lets you estimate big powers of 2 fast: 2²⁰ ≈ 1 million, 2³⁰ ≈ 1 billion!',
    funEmoji: '🚀',
    quoteTag: 'Doubling looks harmless for five steps and unstoppable by step thirty.',
  },
  'mod-2-2': {
    headline: 'Base Camp & Exponent Altitude',
    analogyStory:
      'Writing 5 × 5 × 5 × 5 × 5 × 5 is exhausting, so mathematicians invented compact altitude notation: 5⁶. The bottom number (5) is the Base you multiply; the elevated number (6) is the Exponent counting how many copies stand in line.',
    intuitiveSecret:
      'Watch negative bases carefully: (−2)⁴ = +16 (even exponent wipes the minus), while −2⁴ = −16 (the exponent only touches 2, not the minus sign).',
    partyTrickOrProTip:
      'Compare bases before comparing size: 2⁵ = 32 beats 5² = 25, showing the exponent usually carries more punch than the base!',
    funEmoji: '⛰️',
    quoteTag: 'An exponent isn’t extra stuff added—it’s a counter for repeated multiplication.',
  },
  'mod-2-3': {
    headline: 'The Traffic Rules for Same-Base Powers',
    analogyStory:
      'When two trains with the same engine (same base a) couple together: multiplying (aᵐ × aⁿ) adds their carriages (aᵐ⁺ⁿ), while dividing (aᵐ ÷ aⁿ) uncouples and subtracts them (aᵐ⁻ⁿ).',
    intuitiveSecret:
      'Product and Quotient laws only combine bases that MATCH! Never add exponents on 2³ × 3⁴.',
    partyTrickOrProTip:
      'Stuck on 7¹⁵ ÷ 7¹³? Don’t expand 15 sevens—just subtract exponents: 7¹⁵⁻¹³ = 7² = 49 in one second.',
    funEmoji: '🚂',
    quoteTag: 'Same base? Multiply becomes add; divide becomes subtract.',
  },
  'mod-2-4': {
    headline: 'Russian Dolls of Powers: (aᵐ)ⁿ',
    analogyStory:
      'Imagine 3 boxes, each holding 2⁴ coins: that’s (2⁴)³ = 2⁴ × 2⁴ × 2⁴ = 2¹². Packing a power inside another power multiplies the exponents!',
    intuitiveSecret:
      'Power of a power multiplies exponents ((aᵐ)ⁿ = aᵐⁿ), and sharing one exponent over a product distributes to every factor ((ab)ᵐ = aᵐbᵐ).',
    partyTrickOrProTip:
      'Compute 2⁵ × 5⁵ effortlessly by factoring out the matching exponent: (2 × 5)⁵ = 10⁵ = 100,000!',
    funEmoji: '🪆',
    quoteTag: 'Stacked powers multiply their heights; matching exponents factor together into clean tens.',
  },
  'mod-2-5': {
    headline: 'Zooming Backward: Zero & Negative Exponents',
    analogyStory:
      'Walk down the ladder of 2s: 2³ = 8, 2² = 4, 2¹ = 2. Every step down divides by 2. One step further gives 2⁰ = 2 ÷ 2 = 1. Keep stepping down and you zoom into reciprocals: 2⁻¹ = 1/2, 2⁻² = 1/4!',
    intuitiveSecret:
      'A negative exponent NEVER makes a number negative—it flips the number across the fraction bar into its multiplicative inverse (a⁻ⁿ = 1/aⁿ).',
    partyTrickOrProTip:
      'To flip a fraction with a negative power like (3/5)⁻², swap top and bottom to turn the power positive: (5/3)² = 25/9!',
    funEmoji: '🔬',
    quoteTag: 'Positive exponents are cosmic telescopes; negative exponents are precision microscopes.',
  },
  'mod-2-6': {
    headline: 'Astronomer’s Shorthand: Scientific Notation',
    analogyStory:
      'Writing the mass of an electron (0.000000000000000000000000000000911 kg) or distance to Andromeda would fill half a notebook with zeros. Scientific notation packs all those trailing or leading zeros into a clean power of 10: a × 10ⁿ where 1 ≤ a < 10.',
    intuitiveSecret:
      'Moving the decimal point LEFT gives a positive power of 10 (huge numbers); moving it RIGHT gives a negative power of 10 (microscopic numbers).',
    partyTrickOrProTip:
      'To compare two scientific numbers instantly, check the exponent of 10 FIRST—only compare the front decimal if the powers of 10 tie!',
    funEmoji: '🌌',
    quoteTag: 'Scientific notation shrinks cosmic distances and atomic specks onto a single tidy line.',
  },
  'mod-2-7': {
    headline: 'Wheat on the Chessboard & Orders of Magnitude',
    analogyStory:
      'Legend tells of a sage who asked the king for just 1 grain of wheat on square 1 of a chessboard, doubling on each square: 2, 4, 8… By square 64, the pile equals 2⁶⁴ − 1 grains—more wheat than the entire planet produces in centuries!',
    intuitiveSecret:
      'Jumping one step in 10ⁿ (order of magnitude) scales a quantity tenfold—making exponential estimation essential for physics, computing, and biology.',
    partyTrickOrProTip:
      'Every time a quantity doubles ~10 times, it becomes roughly 1,000× bigger (2¹⁰ = 1,024)!',
    funEmoji: '♟️',
    quoteTag: 'Thought experiments reveal why human intuition consistently underestimates exponents.',
  },
  'mod-2-8': {
    headline: 'Exponents Law Compass & Synthesis',
    analogyStory:
      'All five laws of exponents form one unified compass: add when multiplying same bases, subtract when dividing, multiply when stacking powers, flip when negative, and normalize to 1 ≤ m < 10 for scientific form.',
    intuitiveSecret:
      'Prime-factoring composite numbers (turning 12ⁿ into (2²×3)ⁿ) collapses intimidating fraction towers into two lines of simple arithmetic.',
    partyTrickOrProTip:
      'Before cancelling powers across a giant fraction, rewrite bases like 4, 8, 9, and 25 as 2², 2³, 3², and 5²!',
    funEmoji: '🧭',
    quoteTag: 'Break every composite base into primes and the toughest exponent problem melts.',
  },

  // PART I · CHAPTER 3: A Story of Numbers (mod-3-1 to mod-3-8)
  'mod-3-1': {
    headline: 'Before Digits: Matching Pebbles to Sheep',
    analogyStory:
      'Long before written symbols “5” or “12” existed, a shepherd kept one smooth pebble in a leather pouch for every sheep leaving the pen at dawn—and pulled one pebble out for every sheep returning at dusk. One leftover pebble meant a missing sheep!',
    intuitiveSecret:
      'Counting began as one-to-one correspondence—pairing objects against a standard set without even needing number names.',
    partyTrickOrProTip:
      'The English word “calculate” literally comes from the Latin word calculus, meaning “small counting pebble”!',
    funEmoji: '🪨',
    quoteTag: 'Mathematics started with a pocket full of pebbles matching sheep one-for-one.',
  },
  'mod-3-2': {
    headline: 'Notched Bones & The 27-Point Body Counter',
    analogyStory:
      'In Papua New Guinea, traditional counters point up their right hand, arm, shoulder, eye, across the nose (#14) and down the left side—reaching 27 using body landmarks! Ancient hunters also carved tally notches grouped neatly in fives on bone.',
    intuitiveSecret:
      'Body-part systems and tally marks work without paper, but struggle once trade requires numbers bigger than a few dozen.',
    partyTrickOrProTip:
      'Look at the Ishango Bone (20,000+ years old): its grouped tally marks show humans kept track of lunar cycles and prime counts millennia before cities existed.',
    funEmoji: '🦴',
    quoteTag: 'Before ink and paper, the human hand and bone were the world’s first calculators.',
  },
  'mod-3-3': {
    headline: 'Why Humans Bundled Numbers by Twos, Fives & Tens',
    analogyStory:
      'Try remembering 47 separate random names for numbers 1 to 47—impossible! So cultures invented bundling: one hand = 5, two hands = 10, two hands + toes = 20 (which is why French says quatre-vingts, “four twenties,” for 80!).',
    intuitiveSecret:
      'A base is simply the bundle size where counting restarts with a bigger package—saving humanity from inventing infinite unique words.',
    partyTrickOrProTip:
      'Grouping by fives (quinary) or tens (decimal) came straight from our anatomy: 5 fingers on one hand, 10 on two!',
    funEmoji: '🖐️',
    quoteTag: 'Grouping turns endless chaos of single items into structured bundles.',
  },
  'mod-3-4': {
    headline: 'Why Roman Numerals Couldn’t Do Long Multiplication',
    analogyStory:
      'Roman numerals (I, V, X, L, C, D, M) are wonderfully readable carved onto temple stones—but try multiplying XLIX × LXXVIII without converting to Arabic digits! Without place value, every larger milestone needed a brand-new symbol.',
    intuitiveSecret:
      'Roman numerals are additive/subtractive (V always means 5 wherever it sits), whereas modern digits multiply their value by their position.',
    partyTrickOrProTip:
      'To read any Roman numeral fast, scan left to right: only subtract when a smaller symbol sits directly BEFORE a larger one (like IV = 4 or XC = 90).',
    funEmoji: '🏛️',
    quoteTag: 'Carving stone favored Roman letters; fast arithmetic demanded positional columns.',
  },
  'mod-3-5': {
    headline: 'Base-n Explorers & Egyptian Powers of 10',
    analogyStory:
      'Ancient Egyptians drew distinct pictures for powers of 10: a staff for 1, heel bone for 10, coiled rope for 100, lotus flower for 1,000. Yet any base works—computers today speak purely in Base-2 (binary) using only 0 and 1!',
    intuitiveSecret:
      'In ANY Base-b system, positional columns represent b⁰, b¹, b², b³ from right to left—meaning you only ever need b symbols (0 through b − 1).',
    partyTrickOrProTip:
      'Convert (1011)₂ to decimal by adding the active powers of 2: 8 + 0 + 2 + 1 = 11!',
    funEmoji: '🪷',
    quoteTag: 'Change the bundle size from 10 to 2 or 5, and the same positional logic runs flawlessly.',
  },
  'mod-3-6': {
    headline: 'Mesopotamian Base-60: Why Hours Have 60 Minutes',
    analogyStory:
      'Scribes in Babylon pressed wedge-shaped reeds onto wet clay using Base-60! Why 60? Because 60 divides cleanly by 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30—making fractions a breeze. That’s why our clocks still have 60 minutes and circles have 360°!',
    intuitiveSecret:
      'Babylonians pioneered positional columns (each column ×60), though early tablets lacked a true zero symbol—leaving spaces ambiguous.',
    partyTrickOrProTip:
      'You can count to 60 on two hands right now: use your right thumb to tap the 12 knuckles on your 4 fingers, and tally each round of 12 on your 5 left fingers (12 × 5 = 60)!',
    funEmoji: '⏳',
    quoteTag: 'Every time you check the time, you are reading 4,000-year-old Babylonian Base-60 math.',
  },
  'mod-3-7': {
    headline: 'Śūnya (0): India’s Greatest Mathematical Gift',
    analogyStory:
      'Around 1,500 years ago, Indian mathematicians (Āryabhaṭa, Brahmagupta) completed the revolution: ten digits (0–9) + strict positional place value + treating ZERO (śūnya) not just as an empty space, but as a real number you can add, subtract, and calculate with!',
    intuitiveSecret:
      'Zero solved the positional ambiguity forever—instantly separating 25, 205, and 2,050 using just ten clean glyphs.',
    partyTrickOrProTip:
      'Writing our decimal system unlocked fast columnar addition, multiplication, and decimal fractions that powered the global scientific age.',
    funEmoji: '⭕',
    quoteTag: 'Zero looked like nothing—and gave humanity the power to write everything.',
  },
  'mod-3-8': {
    headline: 'The Evolution of Counting Time Capsule',
    analogyStory:
      'Look across the whole journey: Pebbles → Tallies → Roman Letters → Egyptian Hieroglyphs → Base-60 Wedges → Hindu-Arabic Base-10 with Zero. Each leap invented a smarter compression engine for human thought.',
    intuitiveSecret:
      'Comparing bases and ancient systems proves that “10” isn’t magic—positional columns + zero are the true engine behind modern computation.',
    partyTrickOrProTip:
      'Always test a new base by checking its landmark weights right-to-left: 1, b, b², b³.',
    funEmoji: '📜',
    quoteTag: 'Ten tiny digits conquered the world because position gives every digit a superpower.',
  },

  // PART I · CHAPTER 4: Quadrilaterals (mod-4-1 to mod-4-8)
  'mod-4-1': {
    headline: 'Four-Sided Frames & The Carpenter’s Trick',
    analogyStory:
      'Nail four wooden strips into a loop and they wobble sideways. A carpenter lays two strips crossing at their midpoints and ties corners around them—magically locking all four corners into crisp 90° angles of a rectangle!',
    intuitiveSecret:
      'Every rectangle has opposite sides equal and parallel, four 90° right angles, and equal diagonals that bisect each other.',
    partyTrickOrProTip:
      'When two equal sticks bisect each other at any angle, connecting their four tips ALWAYS forms an exact rectangle!',
    funEmoji: '🪚',
    quoteTag: 'Equal bisecting diagonals are nature’s automatic right-angle jig.',
  },
  'mod-4-2': {
    headline: 'Triangle Twins Inside Every Rectangle',
    analogyStory:
      'Slice a rectangle diagonally from corner to corner and two identical right-angled triangles pop out. Overlaying them proves why opposite sides match and why the angle pieces at each corner always total 90°!',
    intuitiveSecret:
      'If diagonal angle halves are x/2 and (90° − x/2), their sum at every corner locks cleanly to 90° via triangle congruence (SAS / SSS).',
    partyTrickOrProTip:
      'Need to square up a rectangular garden bed using only string? Measure both diagonals—when they are equal in length, your four corners are guaranteed 90°!',
    funEmoji: '📐',
    quoteTag: 'Prove it with congruent triangles and every rectangle property falls into place.',
  },
  'mod-4-3': {
    headline: 'The Square: King of Special Rectangles',
    analogyStory:
      'Among all rectangles, only one insists on wearing four equal sides AND perpendicular diagonals crossing at 90°. Fold a rectangle diagonally so adjacent sides align and trim the excess—out comes a flawless square.',
    intuitiveSecret:
      'A square inherits EVERY superpower of a rectangle (90° corners, equal diagonals) PLUS every superpower of a rhombus (equal sides, perpendicular diagonals).',
    partyTrickOrProTip:
      'Diagonals of a square bisect its 90° corners into clean 45° half-angles!',
    funEmoji: '👑',
    quoteTag: 'A square is a rectangle whose sides agreed to be equal, and a rhombus whose corners stood upright.',
  },
  'mod-4-4': {
    headline: 'The 360° Exterior Angle Walking Tour',
    analogyStory:
      'Walk all the way around ANY convex quadrilateral field, turning through the exterior angle at each fence post. When you arrive back at your starting post facing forward, your body has spun one complete 360° circle!',
    intuitiveSecret:
      'Because one diagonal splits any quadrilateral into 2 triangles (2 × 180°), interior angles ALWAYS sum to 360°—and exterior angles of ANY polygon always sum to 360°.',
    partyTrickOrProTip:
      'Even in a 100-sided convex polygon, the exterior angles STILL sum to 360°—making each exterior turn just 3.6°!',
    funEmoji: '🧭',
    quoteTag: 'Walk around any closed fence and you always complete one full 360° turn.',
  },
  'mod-4-5': {
    headline: 'The Leaning Bookshelf: Parallelograms',
    analogyStory:
      'Push gently sideways on the top of a rectangular bookshelf frame: its vertical posts tilt together, staying parallel! You just transformed a rectangle into a parallelogram without changing any side lengths.',
    intuitiveSecret:
      'In every parallelogram: opposite sides are equal & parallel, opposite angles are equal, adjacent angles sum to 180°, and diagonals bisect each other.',
    partyTrickOrProTip:
      'Watch out for the common trap: diagonals of a general parallelogram bisect each other, but they are NOT equal in length until the corners straighten to 90°.',
    funEmoji: '📚',
    quoteTag: 'Tilt a rectangle sideways and its opposite harmonies stay unbroken.',
  },
  'mod-4-6': {
    headline: 'Diamond Crosshairs: Rhombuses & 90° Diagonals',
    analogyStory:
      'Push sideways on a square frame instead of a rectangle and all four equal sides stay equal—creating a diamond-shaped rhombus! Look at its two crossing diagonals: they still slice each other at a sharp 90° crosshair.',
    intuitiveSecret:
      'A rhombus has 4 equal sides and diagonals that are perpendicular bisectors of each other—cutting the rhombus into 4 congruent right triangles.',
    partyTrickOrProTip:
      'Those 4 right triangles inside a rhombus let you find its side length instantly using half-diagonals and Baudhāyana-Pythagoras: s = √((d₁/2)² + (d₂/2)²)!',
    funEmoji: '💠',
    quoteTag: 'Inside every tilted rhombus hides four identical right triangles.',
  },
  'mod-4-7': {
    headline: 'Soaring Kites & One-Way Trapeziums',
    analogyStory:
      'A flying kite has two pairs of equal ADJACENT sides (short wings on top, long struts below) so its main spine cuts straight down the middle at 90°. Meanwhile, a trapezium is a bridge with just ONE pair of parallel rails.',
    intuitiveSecret:
      'Kite diagonals meet at 90° and the symmetry spine bisects the cross-bar; trapezium co-interior angles along each non-parallel leg sum to 180°.',
    partyTrickOrProTip:
      'Draw the whole family tree: Trapezium (1 parallel pair) → Parallelogram (2 pairs) → Rectangle (90° angles) & Rhombus (equal sides) → Square (both)!',
    funEmoji: '🪁',
    quoteTag: 'Every quadrilateral sits in one connected family tree of symmetry.',
  },
  'mod-4-8': {
    headline: 'Quadrilateral Detective Checklist',
    analogyStory:
      'When geometry shows you a four-sided mystery figure, check its diagonals first! Are they equal? Do they bisect? Do they meet at 90°? Those three clues uniquely identify the shape every single time.',
    intuitiveSecret:
      'Equal + Bisect = Rectangle; Perpendicular + Bisect = Rhombus; Equal + Perpendicular + Bisect = Square.',
    partyTrickOrProTip:
      'Sketch the diagonals before writing equations—half the angles and congruent triangles reveal themselves right on the crosshairs!',
    funEmoji: '🔎',
    quoteTag: 'Know the diagonals and you know the quadrilateral.',
  },

  // PART I · CHAPTER 5: Number Play (mod-5-1 to mod-5-8)
  'mod-5-1': {
    headline: 'Parity Balance: Why Even + Odd Never Lies',
    analogyStory:
      'Think of even numbers as paired socks and odd numbers as paired socks with ONE lonely extra sock! Put two odd sets together and the two lonely socks pair up into an even sum—no matter how massive the numbers are.',
    intuitiveSecret:
      'Flipping ANY number of + and − signs between integers (like ±a ± b ± c ± d) NEVER changes the parity (even/odd) of the result!',
    partyTrickOrProTip:
      'Need to know if 1 + 2 + 3 + … + 99 is odd or even? Just count the odd numbers (there are 50 of them): 50 odds sum to an EVEN number!',
    funEmoji: '⚖️',
    quoteTag: 'Parity ignores size and signs—only the count of odd pieces matters.',
  },
  'mod-5-2': {
    headline: 'Always, Sometimes, Never: The Proof Detective',
    analogyStory:
      '“The sum of three consecutive whole numbers is divisible by 3.” Is that Always true, Sometimes true, or Never true? Writing them algebraically as (n − 1) + n + (n + 1) = 3n proves it is ALWAYS true for every integer in existence!',
    intuitiveSecret:
      'To prove a statement is SOMETIMES false, one single counterexample is enough; to prove ALWAYS true, write a general algebraic expression.',
    partyTrickOrProTip:
      'Product of 2 consecutive integers is ALWAYS even (one of them must be even); sum of 2 consecutive integers is ALWAYS odd!',
    funEmoji: '🕵️',
    quoteTag: 'One example can disprove a myth, but algebra proves a truth forever.',
  },
  'mod-5-3': {
    headline: 'Clockwork Remainders & Modular Arithmetic',
    analogyStory:
      'If today is Tuesday, what day is it 100 days from now? You don’t count 100 days on a calendar—you divide 100 by 7 (remainder 2) and hop just 2 days forward to Thursday! Arithmetic on remainders runs on loops like a clock.',
    intuitiveSecret:
      'Two numbers with the same remainder when divided by m add and multiply predictably under modulo m—saving mountain-sized calculations.',
    partyTrickOrProTip:
      'To find the remainder of (53 × 74) ÷ 5, replace each number by its remainder mod 5 first: 3 × 4 = 12 → remainder 2!',
    funEmoji: '🕰️',
    quoteTag: 'Modular arithmetic throws away the whole laps and reads only where the hand lands.',
  },
  'mod-5-4': {
    headline: 'Tail-End Divisibility Scanners (2, 4, 5, 8, 10)',
    analogyStory:
      'Because 10 = 2 × 5, 100 = 4 × 25, and 1,000 = 8 × 125, every place value beyond a certain point is ALREADY divisible! So testing divisibility by 2 or 5 only inspects the last 1 digit; testing 4 inspects the last 2 digits; testing 8 inspects only the last 3 digits.',
    intuitiveSecret:
      'Powers of 2 and 5 only care about the trailing digits because 10ⁿ cleanly absorbs everything further to the left.',
    partyTrickOrProTip:
      'Is 98,765,432 divisible by 8? Ignore the first five digits and check only 432 ÷ 8 = 54—Instant YES!',
    funEmoji: '📡',
    quoteTag: 'Big powers of 10 wipe the front digits clean for 2, 4, 5, and 8.',
  },
  'mod-5-5': {
    headline: 'The Place-Value Suitcase & The Magic of 3 and 9',
    analogyStory:
      'Unpack 459 into suitcases: 4 × 100 + 5 × 10 + 9. Since 100 = 99 + 1 and 10 = 9 + 1, all the 99s and 9s are ALREADY multiples of 9! Only the loose digits (4 + 5 + 9 = 18) remain to be tested.',
    intuitiveSecret:
      'A number leaves the EXACT same remainder modulo 9 (and modulo 3) as the sum of its digits—also known as its digital root.',
    partyTrickOrProTip:
      '“Casting out 9s” checks huge multiplications fast: if the product of digital roots doesn’t match the answer’s digital root, you spotted a mistake!',
    funEmoji: '🎩',
    quoteTag: 'Because 10 − 1 = 9, place value lets digits pour straight down into the units pile.',
  },
  'mod-5-6': {
    headline: 'The Alternating Tug-of-War for 11',
    analogyStory:
      'Look at powers of 10 modulo 11: 10 = 11 − 1 (one short!), 100 = 99 + 1 (one extra!), 1000 = 1001 − 1 (one short!). Powers of 10 alternate −1, +1, −1, +1! So testing divisibility by 11 plays tug-of-war between alternating digits.',
    intuitiveSecret:
      'Add digits at odd positions minus digits at even positions: if the result is 0 or a multiple of 11 (like 11 or −11), the number divides cleanly by 11.',
    partyTrickOrProTip:
      'Test any palindrome with an EVEN number of digits (like 4554 or 7227): its alternating digit sum is ALWAYS 0, so it is ALWAYS divisible by 11!',
    funEmoji: '🪢',
    quoteTag: 'Ten is 11 − 1 while a hundred is 99 + 1—creating the alternating rhythm of 11.',
  },
  'mod-5-7': {
    headline: 'Cryptarithms: Cracking Digits in Disguise',
    analogyStory:
      'When letters replace digits (like EF × E = GGG, or A + A = BC), place value and multiplication tables act like logic clues in a mystery novel. Remember GGG = G × 111 = G × 3 × 37!',
    intuitiveSecret:
      'Two golden rules crack almost every cryptarithm: leading digits cannot be 0, and sums of two single digits carry at most 1 into the next column.',
    partyTrickOrProTip:
      'Memorize 111 = 3 × 37! Whenever a puzzle shows a 3-digit repunit like 222, 444, or 777, factor 37 × (3 × digit) immediately.',
    funEmoji: '🧩',
    quoteTag: 'Behind every letter puzzle stands place value waiting to confess.',
  },
  'mod-5-8': {
    headline: 'Master Number Strategist Toolkit',
    analogyStory:
      'Combine parity, modular remainders, tail-digit rules (4, 8), digit-sum rules (3, 9), and alternating sums (11) into one scanner. You can factor and check six-digit numbers in seconds without touching a calculator.',
    intuitiveSecret:
      'To test composite divisors like 12, 15, or 36, break them into coprime pairs (3×4, 3×5, 4×9) and verify BOTH rules hold.',
    partyTrickOrProTip:
      'Never split 12 into 2 and 6 (they share factor 2); always split into coprime factors like 3 and 4!',
    funEmoji: '🛡️',
    quoteTag: 'Coprime rules team up like locks on a vault.',
  },

  // PART I · CHAPTER 6: We Distribute, Yet Things Multiply (mod-6-1 to mod-6-8)
  'mod-6-1': {
    headline: 'The Split Chocolate Bar: Why Terms Distribute',
    analogyStory:
      'Break a 6 × 14 chocolate bar into a 6 × 10 chunk and a 6 × 4 chunk. You still hold the exact same chocolate (60 + 24 = 84 squares), just counted cleanly in two pieces!',
    intuitiveSecret:
      'The distributive law a(b + c) = ab + ac means multiplying a sum multiplies EVERY single term inside the bracket—never leave the second term stranded.',
    partyTrickOrProTip:
      'When subtracting a bracket like 10 − (x − 3), distribute the invisible −1 to BOTH terms inside: 10 − x + 3 = 13 − x!',
    funEmoji: '🍫',
    quoteTag: 'Distribution slices big rectangular products into friendly mental pieces.',
  },
  'mod-6-2': {
    headline: 'The 4-Room Courtyard: Expanding (a + m)(b + n)',
    analogyStory:
      'Expand a courtyard of size a × b by lengthening one wall by m and the other by n. You don’t just add a corner patch m × n—you create FOUR rooms: ab + an + mb + mn!',
    intuitiveSecret:
      'Each term in the first bracket shakes hands with EVERY term in the second bracket—two terms × two terms produces four cross-products.',
    partyTrickOrProTip:
      'For (x + p)(x + q), the x-coefficient is simply the SUM (p + q) and the constant is simply the PRODUCT (pq)!',
    funEmoji: '🏛️',
    quoteTag: 'Every binomial product draws a four-room rectangle you can see at a glance.',
  },
  'mod-6-3': {
    headline: 'The House Floor Plan: (a ± b)² Without Losing 2ab',
    analogyStory:
      'Students often rush and guess (a + b)² = a² + b²—forgetting two whole rooms in the house! Draw the square of side (a + b): there’s the big room a², the small room b², PLUS TWO matching rectangular hallways of size a × b.',
    intuitiveSecret:
      '(a + b)² = a² + 2ab + b² and (a − b)² = a² − 2ab + b². That middle 2ab term is the geometric twin wings bridging the two squares.',
    partyTrickOrProTip:
      'Square numbers ending in 5 like 65² in two seconds: 6 × 7 = 42, stick 25 at the end → 4,225! That uses (10a + 5)² = 100a(a+1) + 25.',
    funEmoji: '🏠',
    quoteTag: 'Draw the square floor plan once and you will never drop the 2ab again.',
  },
  'mod-6-4': {
    headline: 'Vanishing Wings: Difference of Squares (a + b)(a − b)',
    analogyStory:
      'Why does (a + b)(a − b) collapse down to just a² − b² with NO middle term? Slice off a strip of width b from an a × a square and swing it onto the opposite side—the +ab wing and −ab cut cancel each other to zero!',
    intuitiveSecret:
      '(a + b)(a − b) = a² − b² works in both directions: expand products fast, or factor expressions like 49x² − 36y² instantly.',
    partyTrickOrProTip:
      'Multiply 97 × 103 in two seconds: (100 − 3)(100 + 3) = 10,000 − 9 = 9,991!',
    funEmoji: '✂️',
    quoteTag: 'Balanced twins (+b and −b) cancel the middle mess and leave pure squares.',
  },
  'mod-6-5': {
    headline: 'Śrīdharāchārya’s Iṣṭa-Guṇana & ×11 Magic',
    analogyStory:
      'To square 98 mentally without long multiplication, step 2 units up to the super-friendly round number 100 and 2 units down to 96: 98² = 100 × 96 + 2² = 9,604! Ancient Indian mathematicians called this chosen-offset shortcut Iṣṭa-Guṇana.',
    intuitiveSecret:
      'Rearranging a² − b² = (a + b)(a − b) turns ANY hard square into a² = (a + b)(a − b) + b² using a convenient offset b.',
    partyTrickOrProTip:
      'Multiply any 2-digit number ab by 11 by splitting the digits and placing (a + b) in the middle (carrying 1 if ≥10): 34 × 11 = 3(3+4)4 = 374!',
    funEmoji: '⚡',
    quoteTag: 'Smart algebra turns daunting two-digit squares into round-number mental breezes.',
  },
  'mod-6-6': {
    headline: 'Algebra Bug-Buster: Spotting Sign & Term Traps',
    analogyStory:
      'Even sharp students fall into three classic traps: turning 3(x + 4) into 3x + 4, dropping the minus sign outside −(2x − 5), or writing (x − 3)² as x² − 9. Catching bugs in worked solutions locks in mastery.',
    intuitiveSecret:
      'Plug in a small test number like x = 2 to sanity-check any algebraic expansion: if Left Side ≠ Right Side at x = 2, an algebra bug is hiding inside!',
    partyTrickOrProTip:
      'Watch out when squaring coefficients: (4x)² = 16x², NOT 4x²!',
    funEmoji: '🐞',
    quoteTag: 'Plug in x = 2 for five seconds and no algebra bug escapes alive.',
  },
  'mod-6-7': {
    headline: 'Borders, Tilings & Visual Pattern Formulas',
    analogyStory:
      'Count the colored border tiles wrapping an n × n courtyard pool. Count them four different ways (4 sides + 4 corners, or big square minus pool (n+2)² − n²) and watch ALL your geometric formulas simplify to the exact same 4n + 4!',
    intuitiveSecret:
      'Two completely different ways of counting the same picture MUST produce algebraically equivalent expressions.',
    partyTrickOrProTip:
      'Check Step n = 1 and n = 2 on your pattern formula against the picture—two checks verify linear patterns instantly.',
    funEmoji: '💠',
    quoteTag: 'When two geometric stories describe one tiling, algebra proves they agree.',
  },
  'mod-6-8': {
    headline: 'The Three Algebraic Identities Toolkit',
    analogyStory:
      'Chapter 6 hands you three power wrenches—(a + b)², (a − b)², and (a + b)(a − b)—built right out of distributive rectangles. Use them forward to multiply and backward to factor.',
    intuitiveSecret:
      'Always spot common factors FIRST before hunting for binomial identities.',
    partyTrickOrProTip:
      'Verify any identity challenge by checking both sides on a quick geometric area sketch!',
    funEmoji: '🧰',
    quoteTag: 'Three visual rectangles unlock every quadratic identity.',
  },

  // PART I · CHAPTER 7: Proportional Reasoning–1 (mod-7-1 to mod-7-8)
  'mod-7-1': {
    headline: 'Stretch Without Squishing: Photo Aspect Ratios',
    analogyStory:
      'When you resize a 60×40 photo by adding +10 cm to both sides (70×50), faces look squished! To keep the picture undistorted, you must MULTIPLY both dimensions by the same scale factor (like ×1.5 → 90×60).',
    intuitiveSecret:
      'True proportion preserves the MULTIPLICATIVE ratio (width : height), never equal additive offsets.',
    partyTrickOrProTip:
      'Divide both dimensions by their HCF to uncover the core aspect ratio: 60:40 simplifies via HCF 20 to 3:2!',
    funEmoji: '🖼️',
    quoteTag: 'Add equally and shapes distort; multiply equally and beauty scales intact.',
  },
  'mod-7-2': {
    headline: 'Reducing Ratios to Pure Simplest Form',
    analogyStory:
      'Comparing 150 cm to 2.5 m directly misleads you unless both wear the exact same unit! First convert 2.5 m → 250 cm, then divide out the HCF (50) to see the true simplest heartbeat: 3 : 5.',
    intuitiveSecret:
      'A ratio is dimensionless—both quantities MUST share the exact same unit before reducing by HCF.',
    partyTrickOrProTip:
      'To test if two ratios a:b and c:d are proportional fast, check cross-products: a × d === b × c!',
    funEmoji: '⚗️',
    quoteTag: 'Convert units first, then divide by HCF until no common factor remains.',
  },
  'mod-7-3': {
    headline: 'The Fair Recipe Multiplier & Equivalent Ratios',
    analogyStory:
      'A lemonade jug mixes 2 spoons of lemon juice with 5 spoons of water. Making 3 jugs multiplies BOTH parts by 3 (6 : 15), keeping the exact same tangy taste in every single sip.',
    intuitiveSecret:
      'In a proportion a : b :: c : d, the product of outer extremes (a × d) always equals the product of inner means (b × c).',
    partyTrickOrProTip:
      'Got decimal or fraction ratios like 1.5 : 2.5? Multiply both terms by 10 (or LCD) to make whole numbers before simplifying!',
    funEmoji: '🍋',
    quoteTag: 'Good ratios keep every sip tasting identical from one glass to a banquet.',
  },
  'mod-7-4': {
    headline: 'Āryabhaṭa’s Trairāśika: The Rule of Three',
    analogyStory:
      'Over 1,500 years ago, Āryabhaṭa summarized everyday commerce in one crystal-clear verse: know three quantities (Pramāṇa, Phala, Icchā) and find the fourth by finding the unit value of 1 item first, then scaling up!',
    intuitiveSecret:
      'Unitary method: divide to find the cost/distance for 1 unit, then multiply by the desired number of units.',
    partyTrickOrProTip:
      'If 7 notebooks cost ₹210, 1 notebook is ₹30, so 12 notebooks cost 12 × ₹30 = ₹360—clean in two steps!',
    funEmoji: '⚖️',
    quoteTag: 'Find the heartbeat of ONE unit and any quantity on Earth follows.',
  },
  'mod-7-5': {
    headline: 'Metric Staircase & Unit Scaling Conversions',
    analogyStory:
      'Traveling down the metric staircase (km → m → cm → mm) multiplies by 10s, 100s, and 1,000s—because big units break into LOTS of tiny pieces! Climbing up divides instead.',
    intuitiveSecret:
      'Watch squared areas carefully: 1 m = 100 cm, so 1 m² = 100 × 100 = 10,000 cm² (not 100 cm²)!',
    partyTrickOrProTip:
      'Convert km/h to m/s instantly by multiplying by 5/18 (since 1,000 m ÷ 3,600 s = 5/18)!',
    funEmoji: '📏',
    quoteTag: 'Smaller units need larger numbers to cover the exact same physical length.',
  },
  'mod-7-6': {
    headline: 'Sharing the Treasure Chest in Ratio m : n',
    analogyStory:
      'Two partners invest in ratio 3 : 5 and split ₹4,000 profit. Imagine cutting the profit into 3 + 5 = 8 equal envelopes (₹500 each): Partner A receives 3 envelopes (₹1,500) and Partner B receives 5 envelopes (₹2,500).',
    intuitiveSecret:
      'Sum all ratio parts first (m + n), divide the total by that sum to get 1 part, then multiply back out.',
    partyTrickOrProTip:
      'Quick check: after finding both shares, add them back together—they must reconstruct the exact starting total!',
    funEmoji: '💰',
    quoteTag: 'Count the total envelopes first, then deal them out fairly.',
  },
  'mod-7-7': {
    headline: 'Direct vs. Inverse & The Non-Proportional Trap',
    analogyStory:
      'Wait—not everything in life scales proportionally! If 1 song lasts 3 minutes, 4 musicians playing it together STILL take 3 minutes, not 12 or 0.75! Meanwhile, 6 painters taking 10 days DO scale inversely: 12 painters finish in 5 days.',
    intuitiveSecret:
      'Direct variation locks the ratio y/x; inverse variation locks the product x × y; non-proportional rates stay constant or follow different laws.',
    partyTrickOrProTip:
      'Always ask the Common Sense Test first: “If workers double, does time double or halve?” before writing any equation.',
    funEmoji: '🎻',
    quoteTag: 'Check whether the world multiplies, trades off, or stays fixed before computing.',
  },
  'mod-7-8': {
    headline: 'Proportionality Compass for Real-World Problems',
    analogyStory:
      'From map scales and photo crops to partnership splits and inverse speed problems, every proportional challenge boils down to identifying what stays constant: the ratio (direct), the product (inverse), or the total parts.',
    intuitiveSecret:
      'Lock in consistent units → identify Direct vs Inverse → solve cleanly via Unitary Method or cross-product.',
    partyTrickOrProTip:
      'Check extreme direction: when one variable increases, verify your final answer moved in the right direction!',
    funEmoji: '🧭',
    quoteTag: 'Spotting what stays invariant solves every proportion.',
  },
};
