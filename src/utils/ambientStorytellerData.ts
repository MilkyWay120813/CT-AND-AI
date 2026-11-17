import { StoryBeatMood } from './soundscapeEngine';

export interface StoryBeat {
  id: string;
  sceneLabel: string;
  formulaCue: string;
  mood: StoryBeatMood;
  narration: string;
}

export interface ChapterStoryScript {
  chapterId: string;
  storyTitle: string;
  moodLabel: string;
  beats: StoryBeat[];
}

export const AMBIENT_STORY_SCRIPTS: Record<string, ChapterStoryScript> = {
  'ch1-square-cube': {
    chapterId: 'ch1-square-cube',
    storyTitle: 'The Corridor of a Hundred Lockers',
    moodLabel: 'Golden Courtyard Tale',
    beats: [
      {
        id: 'ch1-b1',
        sceneLabel: 'Act I · Midnight Hallway',
        formulaCue: 'n² = 1 + 3 + 5 + … + (2n − 1)',
        mood: 'mystery',
        narration:
          'Picture a quiet stone corridor lined with one hundred bronze lockers. Student after student walks past — flipping doors open and shut in silent, lantern-lit rhythm.',
      },
      {
        id: 'ch1-b2',
        sceneLabel: 'Act II · Odd Factor Mirrors',
        formulaCue: 'Perfect Squares → Odd Number of Divisors',
        mood: 'wonder',
        narration:
          'Most numbers pair up their factors like dancing partners, leaving the bronze door closed at dawn. Only the square numbers stand without a twin — keeping lockers one, four, nine, and sixteen softly ajar.',
      },
      {
        id: 'ch1-b3',
        sceneLabel: 'Act III · Ramanujan’s Cab 1729',
        formulaCue: '1729 = 12³ + 1³ = 10³ + 9³',
        mood: 'cosmos',
        narration:
          'Outside a rainy window in London, Ramanujan smiled at taxi number seventeen twenty-nine — the smallest number that whispers itself as two distinct pairs of cubes.',
      },
      {
        id: 'ch1-b4',
        sceneLabel: 'Finale · Geometry of Growth',
        formulaCue: 'Squares (2D) → Cubes (3D)',
        mood: 'triumph',
        narration:
          'Whether tiling a sunlit floor with L-shaped gnomons or stacking wooden cubes in shadow, square and cube numbers reveal luminous order hiding inside everyday counting.',
      },
    ],
  },
  'ch2-power-play': {
    chapterId: 'ch2-power-play',
    storyTitle: 'Forty-Two Folds to the Moon',
    moodLabel: 'Observatory Chronicle',
    beats: [
      {
        id: 'ch2-b1',
        sceneLabel: 'Act I · A Single Sheet of Paper',
        formulaCue: 'Thickness = 0.1 mm × 2ⁿ',
        mood: 'wonder',
        narration:
          'Hold a crisp sheet of notebook paper between your fingers. Fold it once, twice, three times — barely the width of a fingernail. Nothing seems extraordinary yet.',
      },
      {
        id: 'ch2-b2',
        sceneLabel: 'Act II · Breaking the Horizon',
        formulaCue: '2⁴² × 0.1 mm ≈ 439,804 km',
        mood: 'cosmos',
        narration:
          'Yet exponential multiplication hides an avalanche inside every gentle crease. By the forty-second fold, that humble paper bridge stretches past clouds and stars to touch the Moon.',
      },
      {
        id: 'ch2-b3',
        sceneLabel: 'Act III · Looking Inward',
        formulaCue: 'a⁻ⁿ = 1 / aⁿ',
        mood: 'mystery',
        narration:
          'Flip the exponent negative, and the telescope reverses direction — diving smoothly from meters to micrometers and shimmering crystal atoms without ever breaking the law of powers.',
      },
    ],
  },
  'ch3-story-numbers': {
    chapterId: 'ch3-story-numbers',
    storyTitle: 'The Birth of Śūnya & Place Value',
    moodLabel: 'Ancient Caravan Tale',
    beats: [
      {
        id: 'ch3-b1',
        sceneLabel: 'Act I · Bones & Clay Tablets',
        formulaCue: 'Lebombo Tallies · Base-60 Babylon',
        mood: 'mystery',
        narration:
          'Before ink touched paper, shepherds notched lunar cycles onto bone and scribes pressed reeds into Babylonian clay — counting skies in sixties and temples in limestone.',
      },
      {
        id: 'ch3-b2',
        sceneLabel: 'Act II · The Empty Column Puzzle',
        formulaCue: 'Śūnya (0) · Brahmagupta 628 CE',
        mood: 'wonder',
        narration:
          'For centuries, writing two hundred and five without mistaking it for twenty-five puzzled empires. In ancient India, a tiny dot named Śūnya stepped into the empty column and transformed everything.',
      },
      {
        id: 'ch3-b3',
        sceneLabel: 'Act III · Ten Symbols, Infinite Worlds',
        formulaCue: '∑ dᵢ × 10ⁱ',
        mood: 'triumph',
        narration:
          'With just ten luminous digits and the quiet grace of zero, humanity unlocked a language swift enough to weigh distant planets and measure heartbeats alike.',
      },
    ],
  },
  'ch4-quadrilaterals': {
    chapterId: 'ch4-quadrilaterals',
    storyTitle: 'The Carpenter’s Crossed Strips',
    moodLabel: 'Workshop Blueprint',
    beats: [
      {
        id: 'ch4-b1',
        sceneLabel: 'Act I · Two Wooden Strips & a Brass Pin',
        formulaCue: 'Diagonals Bisect → Parallelogram',
        mood: 'wonder',
        narration:
          'In a sunlit timber workshop, a carpenter pins two wooden rulers together right at their midpoints. Stretch strings around their four tips, and a parallelogram springs gently to life.',
      },
      {
        id: 'ch4-b2',
        sceneLabel: 'Act II · When Diagonals Agree',
        formulaCue: 'Equal & Bisecting → Rectangle · ⊥ → Rhombus',
        mood: 'mystery',
        narration:
          'Make the crossed strips equal in length, and every corner locks to ninety degrees. Cross them at a right angle instead — and a shimmering diamond rhombus emerges.',
      },
      {
        id: 'ch4-b3',
        sceneLabel: 'Act III · The 360° Compass Walk',
        formulaCue: '∠A + ∠B + ∠C + ∠D = 360°',
        mood: 'triumph',
        narration:
          'Walk completely around the outer fence of any four-sided courtyard and turn each corner — by the time you face home again, your four turns have swept one full circle.',
      },
    ],
  },
  'ch5-number-play': {
    chapterId: 'ch5-number-play',
    storyTitle: 'Detectives of Parity & Remainders',
    moodLabel: 'Cipher Room Mystery',
    beats: [
      {
        id: 'ch5-b1',
        sceneLabel: 'Act I · Nine’s Echo',
        formulaCue: 'N ≡ DigitSum(N) (mod 9)',
        mood: 'mystery',
        narration:
          'Every time you multiply a digit by ten, it whispers a remainder of one when divided by nine. That tiny echo lets detectives test huge numbers simply by summing their digits.',
      },
      {
        id: 'ch5-b2',
        sceneLabel: 'Act II · The Alternating Pendulum',
        formulaCue: 'N ≡ a − b + c − d (mod 11)',
        mood: 'wonder',
        narration:
          'Step forward to tens, step back to hundreds — elevens swing left and right like a brass clock pendulum. Balance the alternating digits, and divisibility reveals itself effortlessly.',
      },
      {
        id: 'ch5-b3',
        sceneLabel: 'Act III · Disguised Letter Locks',
        formulaCue: '37 × 3 = 111 · 37 × 6 = 222',
        mood: 'triumph',
        narration:
          'Inside cryptarithm puzzles, humble letters guard steady arithmetic truths — waiting for one patient clue to unlock the entire combination.',
      },
    ],
  },
  'ch6-we-distribute': {
    chapterId: 'ch6-we-distribute',
    storyTitle: 'Splitting the Golden Courtyard',
    moodLabel: 'Archway Geometry',
    beats: [
      {
        id: 'ch6-b1',
        sceneLabel: 'Act I · Four Courtyards in One',
        formulaCue: '(a + b)² = a² + 2ab + b²',
        mood: 'wonder',
        narration:
          'Imagine expanding a square stone garden by stepping forward a little on both sides. Two slender side rectangles join one corner tile — explaining why two a b never vanishes.',
      },
      {
        id: 'ch6-b2',
        sceneLabel: 'Act II · Śrīdharāchārya’s Lightning Trick',
        formulaCue: 'n² = (n − d)(n + d) + d²',
        mood: 'triumph',
        narration:
          'Long before pocket calculators, Indian mathematician Śrīdharāchārya slid numbers evenly up and down to friendly tens — computing ninety-eight squared in a single quiet breath.',
      },
      {
        id: 'ch6-b3',
        sceneLabel: 'Act III · Algebra Seen with Fresh Eyes',
        formulaCue: 'a² − b² = (a + b)(a − b)',
        mood: 'cosmos',
        narration:
          'When symbols fold back into cut paper rectangles, algebraic identities stop feeling like memorized chants — and begin behaving like honest, breathing shapes.',
      },
    ],
  },
  'ch7-proportional-1': {
    chapterId: 'ch7-proportional-1',
    storyTitle: 'Āryabhaṭa’s Rule of Three',
    moodLabel: 'Market & Map Studio',
    beats: [
      {
        id: 'ch7-b1',
        sceneLabel: 'Act I · Harmony on the Canvas',
        formulaCue: 'a : b = c : d ⇔ a · d = b · c',
        mood: 'wonder',
        narration:
          'Stretch a photograph sideways without raising its height and faces warp immediately. Preserve the silent ratio between width and height — and harmony scales effortlessly.',
      },
      {
        id: 'ch7-b2',
        sceneLabel: 'Act II · Trairāśika of Ancient India',
        formulaCue: 'Phala = (Icchā × Phala₀) / Pramāṇa',
        mood: 'cosmos',
        narration:
          'Over fifteen centuries ago, Āryabhaṭa arranged three known measures beside one unknown question — naming measure, fruit, and desire so merchants and astronomers never lost balance.',
      },
      {
        id: 'ch7-b3',
        sceneLabel: 'Act III · Mixing Colors & Speeds',
        formulaCue: 'HCF Simplification → Lowest Terms',
        mood: 'triumph',
        narration:
          'From saffron spices in a kitchen jar to emerald pigment on wet paper, proportional reasoning keeps every ingredient singing in the exact same key.',
      },
    ],
  },
  'ch8-master-quiz': {
    chapterId: 'ch8-master-quiz',
    storyTitle: 'The Part I Lantern Arena',
    moodLabel: 'Grand Synthesis',
    beats: [
      {
        id: 'ch8-b1',
        sceneLabel: 'Prelude · Seven Chapters Under One Dome',
        formulaCue: 'Squares · Powers · Zero · Quads · Play · Algebra · Ratios',
        mood: 'cosmos',
        narration:
          'Take a unhurried breath as the lantern dome illuminates. Every concept from Part One now weaves together — geometry greeting algebra, and ancient number stories powering modern logic.',
      },
      {
        id: 'ch8-b2',
        sceneLabel: 'Focus · Trust Your Intuition',
        formulaCue: '80%+ Accuracy Unlocks Badge #113',
        mood: 'triumph',
        narration:
          'Pause softly before choosing. Sketch a small rectangle in your mind, test a gentle number like two or ten — and watch hidden patterns guide your answer.',
      },
    ],
  },
  'ch4-fractions-disguise': {
    chapterId: 'ch4-fractions-disguise',
    storyTitle: 'Fractions Wearing a Mask of 100',
    moodLabel: 'Treasury Ledger',
    beats: [
      {
        id: 'p2c1-b1',
        sceneLabel: 'Act I · A Common Hundred-Square Yardstick',
        formulaCue: 'p% = p / 100',
        mood: 'wonder',
        narration:
          'Comparing three-eighths to five-twelfths blurs at first glance. Dress both fractions inside a luminous hundred-square grid — and the winner stands clear in daylight.',
      },
      {
        id: 'p2c1-b2',
        sceneLabel: 'Act II · The Markup-Discount Illusion',
        formulaCue: '(1 + r)(1 − r) = 1 − r²',
        mood: 'mystery',
        narration:
          'Raise a price by twenty percent and cut it back by twenty percent — yet it never returns home! The second cut shrinks a larger whole, leaving behind an unmistakable four-percent shadow.',
      },
      {
        id: 'p2c1-b3',
        sceneLabel: 'Act III · Snowballs of Compound Growth',
        formulaCue: 'A = P(1 + R/100)ⁿ',
        mood: 'cosmos',
        narration:
          'Whether forest saplings or quiet savings ledgers, compounding folds tomorrow’s growth onto today’s harvest — curving gracefully skyward year after year.',
      },
    ],
  },
  'ch5-baudhayana-pythagoras': {
    chapterId: 'ch5-baudhayana-pythagoras',
    storyTitle: 'The Knotted Rope of Baudhāyana',
    moodLabel: 'Torchlit Courtyard',
    beats: [
      {
        id: 'p2c2-b1',
        sceneLabel: 'Act I · Drawing Square Altars with Cord',
        formulaCue: 'a² + b² = c² · Śulba-Sūtra (c. 800 BCE)',
        mood: 'mystery',
        narration:
          'On tranquil riverbanks long ago, builders stretched a knotted hemp cord across pegs at three, four, and five steps — watching a true right corner snap effortlessly into place.',
      },
      {
        id: 'p2c2-b2',
        sceneLabel: 'Act II · Bhāskara’s Swaying Lotus',
        formulaCue: 'h² + d² = (h + c)²',
        mood: 'wonder',
        narration:
          'An evening breeze tilts a lotus stem above a calm pond until its petals kiss the water nine spans away. From that single triangle, Bhāskarāchārya measured the hidden depth of the lake.',
      },
      {
        id: 'p2c2-b3',
        sceneLabel: 'Act III · Spirals of Irrational Roots',
        formulaCue: '√1 → √2 → √3 → √4 → √5',
        mood: 'cosmos',
        narration:
          'Chain right triangles edge to edge like a silver Nautilus shell, and square roots unfurl into a glowing spiral reaching across the number line.',
      },
    ],
  },
  'ch6-proportional-reasoning': {
    chapterId: 'ch6-proportional-reasoning',
    storyTitle: 'Shrinking Continents onto Paper',
    moodLabel: 'Cartographer’s Desk',
    beats: [
      {
        id: 'p2c3-b1',
        sceneLabel: 'Act I · Scales of Length vs Scales of Area',
        formulaCue: 'Length × k ⇒ Area × k²',
        mood: 'wonder',
        narration:
          'Double every road on a town map and the parchment grows four times wider in area. Understanding squared scale keeps bridges, maps, and blueprints honest.',
      },
      {
        id: 'p2c3-b2',
        sceneLabel: 'Act II · Spinning 360 Degrees of Data',
        formulaCue: 'Sector Angle θ = (Part / Whole) × 360°',
        mood: 'cosmos',
        narration:
          'Fold a survey table around a single brass compass point — and fractions bloom into painted sectors sweeping gently around three hundred and sixty degrees.',
      },
      {
        id: 'p2c3-b3',
        sceneLabel: 'Act III · When More Means Less',
        formulaCue: 'x₁ · y₁ = x₂ · y₂ (Inverse Hyperbola)',
        mood: 'triumph',
        narration:
          'Double the crew painting a courtyard mural and the hours cut cleanly in half. Direct and inverse proportions choreograph how speed, crew size, and time trade places.',
      },
    ],
  },
  'ch11-geometric-themes': {
    chapterId: 'ch11-geometric-themes',
    storyTitle: 'Infinite Snowflakes & Folding Nets',
    moodLabel: 'Temple & Origami Studio',
    beats: [
      {
        id: 'p2c4-b1',
        sceneLabel: 'Act I · Echoes Within Stone Spires',
        formulaCue: 'Self-Similarity · Koch × (4/3)ⁿ',
        mood: 'cosmos',
        narration:
          'Look closely at a fern frond, a rocky coastline, or the tiered stone spires of Khajuraho — each miniature crown carries a faithful portrait of the whole.',
      },
      {
        id: 'p2c4-b2',
        sceneLabel: 'Act II · The Hungry Ant on the Box',
        formulaCue: 'Unfold 3D Faces → Straight Euclidean Line',
        mood: 'wonder',
        narration:
          'Trapped in three dimensions, an ant faces vertical walls and folded corners. Unfold the cardboard box flat upon the table — and one straight ruler line reveals the shortest path home.',
      },
    ],
  },
  'ch12-dots-and-lines': {
    chapterId: 'ch12-dots-and-lines',
    storyTitle: 'Finding the Balance Point of Stories',
    moodLabel: 'Monsoon Weather Log',
    beats: [
      {
        id: 'p2c5-b1',
        sceneLabel: 'Act I · The Seesaw Mean',
        formulaCue: '∑ (xᵢ − x̄) = 0',
        mood: 'wonder',
        narration:
          'Imagine sliding brass weights along a cedar beam until it rests level on one delicate fulcrum. That exact tipping point is the arithmetic mean — where pull left equals pull right.',
      },
      {
        id: 'p2c5-b2',
        sceneLabel: 'Act II · Guards Against Extreme Outliers',
        formulaCue: 'Median & IQR = Q₃ − Q₁',
        mood: 'mystery',
        narration:
          'When one towering skyscraper joins a street of cottages, the mean drifts skyward — while the quiet median stands calmly at the middle house to tell the neighborhood’s truest story.',
      },
    ],
  },
  'ch13-algebra-play': {
    chapterId: 'ch13-algebra-play',
    storyTitle: 'X-Ray Vision Behind Mind-Reading Tricks',
    moodLabel: 'Banyan Tree Parable',
    beats: [
      {
        id: 'p2c6-b1',
        sceneLabel: 'Act I · Seeing Inside the Sealed Envelope',
        formulaCue: 'Birthday Trick → 100M + D + 165',
        mood: 'mystery',
        narration:
          'A magician asks you to multiply your birth month, add a few whispers, and share the total — then names your birthday aloud. Shine the light of letter x inside, and the velvet curtain falls away.',
      },
      {
        id: 'p2c6-b2',
        sceneLabel: 'Act II · Karim & the Banyan Genie',
        formulaCue: '8x − 56 = 0 ⇒ x = 7 Coins',
        mood: 'triumph',
        narration:
          'Under a sprawling banyan tree, a clever genie doubles coins three times while claiming seven coins at every crossing — yet simple balanced equations untangle the riddle in seconds.',
      },
    ],
  },
  'ch14-area': {
    chapterId: 'ch14-area',
    storyTitle: 'Slicing Polygons Into Honest Rectangles',
    moodLabel: 'Paper Tangram Desk',
    beats: [
      {
        id: 'p2c7-b1',
        sceneLabel: 'Act I · Scissors Without Formulas',
        formulaCue: 'Triangle = ½bh · Trapezium = ½h(a + b)',
        mood: 'wonder',
        narration:
          'Forget memorizing half a dozen disconnected area chants. Snip one slanted triangle off a parallelogram, slide it across — and watch it snap cleanly into an ordinary rectangle.',
      },
      {
        id: 'p2c7-b2',
        sceneLabel: 'Act II · Twin Trapeziums Lock Together',
        formulaCue: 'Parallelogram Base = (a + b)',
        mood: 'triumph',
        narration:
          'Flip a second identical trapezium upside down beside the first — together they form one wide rectangle of width a plus b, proving the formula gracefully before your eyes.',
      },
    ],
  },
  'part2-ch8-master-quiz': {
    chapterId: 'part2-ch8-master-quiz',
    storyTitle: 'The Part II Grand Observatory Finale',
    moodLabel: 'Capstone Expedition',
    beats: [
      {
        id: 'p2c8-b1',
        sceneLabel: 'Prelude · All Fourteen Chapters United',
        formulaCue: 'Percentages · Pythagoras · Fractals · Data · Algebra · Area',
        mood: 'cosmos',
        narration:
          'Look back across every chapter you have explored — from knotted cords and self-similar temples to balanced data seesaws and algebraic x-rays.',
      },
      {
        id: 'p2c8-b2',
        sceneLabel: 'Finale · Forge the Final Key',
        formulaCue: '80%+ Accuracy Unlocks Badge #114',
        mood: 'triumph',
        narration:
          'Step into the final thirty-question synthesis with calm curiosity. You already hold every visual story shining inside your mind.',
      },
    ],
  },
};
