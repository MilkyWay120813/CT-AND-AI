/**
 * Provides fun, intuitive, and delightful mathematical interpretations
 * for every module in Ganita Prakash Class 8.
 */

export interface ModuleFunInterpretation {
  headline: string;
  analogyStory: string;
  intuitiveSecret: string;
  partyTrickOrProTip: string;
  funEmoji: string;
  quoteTag: string;
}

export function getModuleFunInterpretation(
  moduleCode: string,
  moduleTitle: string,
  formulaHighlight: string = '',
  chapterTitle: string = ''
): ModuleFunInterpretation {
  const code = (moduleCode || '').toLowerCase();
  const title = (moduleTitle || '').toLowerCase();

  // 1. Module 1.1 / Locker Problem / Square numbers intro
  if (code.includes('1.1') || title.includes('locker')) {
    return {
      headline: 'The 1,000 School Lockers Mystery',
      analogyStory:
        'Imagine 1,000 students running down a hallway toggling locker doors. Most numbers have factors that travel in pairs (like 12 having 1×12, 2×6, 3×4—an even number of toggles, leaving them closed). Only perfect squares (like 1, 4, 9, 16, 25) have a factor paired with itself (like 4 × 4 = 16), giving them an odd number of toggles!',
      intuitiveSecret:
        'A locker stays OPEN if and only if its locker number is a perfect square! This is the geometry of squares hiding inside plain arithmetic.',
      partyTrickOrProTip:
        'Next time someone gives you a number, count its factors: if the total count is odd, it is 100% guaranteed to be a square number!',
      funEmoji: '🔐',
      quoteTag: 'Squares are the only numbers that dare to stand alone with an odd number of divisors.',
    };
  }

  // 2. Module 1.2 / Unit digits of square numbers
  if (code.includes('1.2') || title.includes('unit digit') || title.includes('ending digit')) {
    return {
      headline: 'The Unit Digit Crystal Ball',
      analogyStory:
        'No matter how giant a number is—even a billion digits long—its square’s last digit is strictly determined by its single last digit! It’s like the number’s personal fingerprint.',
      intuitiveSecret:
        'Squares NEVER end in 2, 3, 7, or 8! They can only ever finish in 0, 1, 4, 5, 6, or 9. If someone claims 4,872 is a square, you can instantly call their bluff without doing any math.',
      partyTrickOrProTip:
        'Notice the symmetric pairs: 1² and 9² both end in 1; 2² and 8² both end in 4; 3² and 7² both end in 9; 4² and 6² both end in 6! Numbers that sum to 10 share the exact same last digit.',
      funEmoji: '🔮',
      quoteTag: 'The last digit never lies: 2, 3, 7, and 8 are permanently banned from the end of squares.',
    };
  }

  // 3. Module 1.3 / Odd Gnomon / Sum of consecutive odds
  if (code.includes('1.3') || title.includes('odd') || title.includes('gnomon')) {
    return {
      headline: 'The Growing L-Shape Mosaic',
      analogyStory:
        'Start with 1 tile. To make a 2×2 square, you wrap an "L-shaped" layer of 3 tiles around it (1 + 3 = 4). To expand to 3×3, wrap 5 tiles around that (4 + 5 = 9). Each new square is born by wrapping the next odd number like an extra skin on an onion!',
      intuitiveSecret:
        'The sum of the first n odd numbers is always exactly n². You don’t need to add them up on paper: 1 + 3 + 5 + 7 + 9 is automatically 5² = 25 because you just laid down 5 concentric L-layers.',
      partyTrickOrProTip:
        'Mental math challenge: What is 1 + 3 + 5 + ... + 19? There are 10 odd numbers here, so the answer is instantly 10² = 100 in two seconds!',
      funEmoji: '🧱',
      quoteTag: 'Every square number is secretly just a pyramid of odd numbers stacked around a corner.',
    };
  }

  // 4. Module 1.4 / Prime Factorization for square roots
  if (code.includes('1.4') || title.includes('prime') || title.includes('twin factor')) {
    return {
      headline: 'Noah’s Ark: The Twin Factor Rule',
      analogyStory:
        'Think of prime factors like animals boarding Noah’s Ark: for a number to be a perfect square, every single prime factor MUST board in matching pairs (twos by twos: two 2s, two 3s, two 7s). If any lone factor is left without a twin, the number cannot form a square!',
      intuitiveSecret:
        'Taking a square root is simply sending one animal from each pair off the boat. For 144 = 2⁴ × 3² = (2×2) × (2×2) × (3×3), its square root takes one from each pair: 2 × 2 × 3 = 12.',
      partyTrickOrProTip:
        'If 72 is not a square (72 = 2³ × 3²), just spot the lonely 2 that has no twin and multiply by 2 to give 144 (12²)!',
      funEmoji: '🦁',
      quoteTag: 'In square root country, single primes are not allowed—everybody needs a dance partner.',
    };
  }

  // 5. Module 1.5 / Pythagorean Triplets
  if (code.includes('1.5') || title.includes('pythagorean') || title.includes('triplet')) {
    return {
      headline: 'The Carpenter’s Corner Triangle',
      analogyStory:
        'Ancient Egyptian rope stretchers tied 12 knots into a loop with intervals of 3, 4, and 5 knots. By pulling it taut into a triangle, they instantly guaranteed a perfect 90° right angle for laying the foundation of the Great Pyramids!',
      intuitiveSecret:
        'Any integer m > 1 can generate a right triangle through (2m, m² − 1, m² + 1). Try m = 3: you get sides 6, 8, 10 (which is 36 + 64 = 100)!',
      partyTrickOrProTip:
        'Want to check if a room corner is square without a protractor? Measure 3 feet along one wall, 4 feet along the other; if the diagonal between them is exactly 5 feet, the corner is 100% square.',
      funEmoji: '📐',
      quoteTag: 'Three numbers, one right angle, and thousands of years of architectural perfection.',
    };
  }

  // 6. Chapter 2: Cubes and 3D Volume
  if (code.includes('2.') || title.includes('cube') || formulaHighlight.includes('³')) {
    return {
      headline: 'Minecraft Blocks & The Ramanujan Taxi Cab',
      analogyStory:
        'A square lives on flat paper, but a cube bursts into real 3D space! When you double the edge of a Minecraft block from 1 to 2, its volume doesn’t just double—it explodes to 2 × 2 × 2 = 8 blocks! That is why giant monsters in movies would need super-thick bones to hold 8× the weight.',
      intuitiveSecret:
        '1729 is the famous Hardy-Ramanujan number: the smallest number expressible as the sum of two cubes in two different ways (1³ + 12³ and 9³ + 10³). Ramanujan saw this instantly while visiting a sick friend in London!',
      partyTrickOrProTip:
        'Cubes are super friendly with unit digits: numbers ending in 0, 1, 4, 5, 6, 9 keep their exact same ending digit when cubed. Only 2 flips to 8 (and 8 to 2), and 3 flips to 7 (and 7 to 3)!',
      funEmoji: '🧊',
      quoteTag: 'Volume explodes in 3D: double the size, octuple the weight!',
    };
  }

  // 7. Chapter 3: Exponents and Powers
  if (code.includes('3.') || title.includes('exponent') || title.includes('power') || formulaHighlight.includes('10^')) {
    return {
      headline: 'Folding Paper to the Moon',
      analogyStory:
        'If you could fold an ordinary piece of paper in half 42 times, the stack would reach all the way from Earth to the Moon! Each fold doubles the thickness: 2⁴² is over 4.3 trillion sheets. Exponents start slow and then skyrocket faster than a rocket ship.',
      intuitiveSecret:
        'What does 10⁻³ mean? It’s not a negative number—it’s just zooming in! 10³ zooms out to a thousand, while 10⁻³ zooms down to a thousandth (one millimetre on a meter stick). Negative powers are just microscopes, positive powers are telescopes.',
      partyTrickOrProTip:
        'Remember: Any number to the power 0 is 1. Why? Because 2³ ÷ 2³ = 8 ÷ 8 = 1, but by power laws it is also 2³⁻³ = 2⁰! Math always stays consistent.',
      funEmoji: '🚀',
      quoteTag: 'Exponents are rocket fuel for numbers: they turn everyday additions into cosmic leaps.',
    };
  }

  // 8. Chapter 4: Quadrilaterals
  if (code.includes('4.') || title.includes('quadrilateral') || title.includes('parallel') || title.includes('rhombus')) {
    return {
      headline: 'The Wobbly Wooden Gate',
      analogyStory:
        'Four wooden boards nailed in a square can wobble and lean side-to-side into a slanted parallelogram! That’s why carpenters always nail a diagonal board across a fence gate: the diagonal splits the wobbly quadrilateral into two rigid triangles that cannot budge.',
      intuitiveSecret:
        'Walk along the perimeter of ANY polygon and turn at each corner: when you return to where you started, you have made one complete 360° turn! That is why the exterior angles of ANY polygon ALWAYS sum to 360°.',
      partyTrickOrProTip:
        'A rectangle has equal diagonals, a rhombus has perpendicular diagonals, and a square is the royal king that possesses BOTH superpowers at once!',
      funEmoji: '🚪',
      quoteTag: 'Triangles are rigid; quadrilaterals have freedom to flex until you bind them with a diagonal.',
    };
  }

  // 9. Chapter 5: Number Play & Divisibility
  if (code.includes('5.') || title.includes('number play') || title.includes('digit') || title.includes('divisib')) {
    return {
      headline: 'The Place-Value Suitcase & The Magic of 9',
      analogyStory:
        'A number like 352 isn’t just digits sitting together—it’s three suitcases! 3 bundles of 100, 5 bundles of 10, and 2 singles. Because 100 = 99 + 1 and 10 = 9 + 1, all those 99s and 9s are already divisible by 9, leaving behind only the single digits (3 + 5 + 2 = 10) to test for divisibility!',
      intuitiveSecret:
        'When you reverse any two-digit number and subtract (like 72 − 27 = 45), the answer is ALWAYS a multiple of 9! Specifically, it is 9 × (first digit − second digit): 9 × (7 − 2) = 45.',
      partyTrickOrProTip:
        'Ask someone to secretly pick a 2-digit number, reverse it, subtract the smaller from larger, and tell you only the tens digit. You can instantly reveal their ones digit because the two digits always add up to 9!',
      funEmoji: '🎩',
      quoteTag: 'Place value is a suitcase packing trick where 9 does all the heavy lifting behind the scenes.',
    };
  }

  // 10. Chapter 6: Algebraic Expressions & Identities
  if (code.includes('6.') || title.includes('distribute') || title.includes('identit') || title.includes('algebra')) {
    return {
      headline: 'The House Blueprint: Splitting the Rooms',
      analogyStory:
        'To calculate (a + b)², picture a big square room split into four sections: one master bedroom of a², one guest bedroom of b², and two symmetric hallways of a × b each! Put them together and you see why (a + b)² = a² + 2ab + b².',
      intuitiveSecret:
        'Why does (a + b)(a − b) equal a² − b²? The two middle rectangles (+ab and −ab) perfectly cancel each other out, leaving only the difference of two pure squares!',
      partyTrickOrProTip:
        'Multiply 52 × 48 in your head in 3 seconds: write it as (50 + 2)(50 − 2) = 50² − 2² = 2500 − 4 = 2,496! Your friends will think you’re a human calculator.',
      funEmoji: '🏠',
      quoteTag: 'Algebraic identities aren’t formulas to memorize—they are geometric floor plans for fast mental math.',
    };
  }

  // 11. Chapter 7: Proportional Reasoning
  if (code.includes('7.') || title.includes('proportion') || title.includes('ratio') || title.includes('reasoning')) {
    return {
      headline: 'The Giant Chef’s Secret Recipe',
      analogyStory:
        'If a pancake recipe needs 2 cups of flour for 4 people, making pancakes for 12 people means tripling the flour to 6 cups. That’s DIRECT proportion: as eaters go up, pancakes go up at the exact same pace.',
      intuitiveSecret:
        'In direct proportion, the RATIO (x ÷ y) is locked solid. But in INVERSE proportion (like 4 painters painting a house in 6 hours), the PRODUCT (x × y) is locked: 4 × 6 = 24 painter-hours. If 8 painters show up, 24 ÷ 8 = 3 hours!',
      partyTrickOrProTip:
        'Before calculating any proportion, ask yourself the "Common Sense Direction Test": If one number gets bigger, should the answer get bigger (direct) or smaller (inverse)? That prevents 99% of mistakes.',
      funEmoji: '🥞',
      quoteTag: 'Direct proportion scales like a recipe; inverse proportion shares the load like teammates.',
    };
  }

  // Generic fallback with tailored, cheerful mathematical insight
  return {
    headline: `The Mathematical Secret Behind ${moduleTitle}`,
    analogyStory:
      `Mathematics in ${moduleTitle} is like discovering the hidden clockwork gears running inside our universe. Instead of memorizing static numbers, this module gives you a dynamic mathematical tool that stays true whether you are measuring atoms, school playgrounds, or distant stars.`,
    intuitiveSecret:
      formulaHighlight
        ? `The governing law "${formulaHighlight}" acts as an unbreakable balance: what you change on the left must reflect in harmony on the right.`
        : 'Every pattern you see here is governed by symmetric logical rules that make complex calculations simple.',
    partyTrickOrProTip:
      'Always test the extreme edge cases: try plugging in 0, 1, or 10. If the pattern holds at the boundaries, your mathematical intuition is rock solid!',
    funEmoji: '💡',
    quoteTag: 'Math is not about following rules; it is about discovering how pieces naturally fit together.',
  };
}
