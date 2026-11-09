import { Part1ChapterCurriculum, Part1ModuleItem, ChapterAssessmentQuestion } from '../types/part1Curriculum';
import { ChapterId, GanitaChapter } from '../types/math';
import { PART1_CHAPTERS_1_TO_3 } from './part1CurriculumCh1to3';
import { PART1_CHAPTERS_4_TO_6 } from './part1CurriculumCh4to6';
import { PART1_CHAPTERS_7_TO_8 } from './part1CurriculumCh7to8';
import { PART2_CHAPTERS_1_TO_2 } from './part2CurriculumCh1to2';
import { PART2_CHAPTERS_3_TO_4 } from './part2CurriculumCh3to4';
import { PART2_CHAPTER_4_GEOMETRIC_THEMES } from './part2CurriculumCh4Geometric';
import { PART2_CHAPTER_5 } from './part2CurriculumCh5';

const allPart1Questions: ChapterAssessmentQuestion[] = [
  ...PART1_CHAPTERS_1_TO_3.flatMap((c) => c.questionnaire),
  ...PART1_CHAPTERS_4_TO_6.flatMap((c) => c.questionnaire),
  ...PART1_CHAPTERS_7_TO_8.filter((c) => c.chapterId !== 'ch8-master-quiz').flatMap((c) => c.questionnaire),
];

export const PART1_CURRICULUM_CHAPTERS: Part1ChapterCurriculum[] = [
  ...PART1_CHAPTERS_1_TO_3,
  ...PART1_CHAPTERS_4_TO_6,
  ...PART1_CHAPTERS_7_TO_8.map((ch) =>
    ch.chapterId === 'ch8-master-quiz'
      ? { ...ch, questionnaire: allPart1Questions }
      : ch
  ),
];

const PART2_CHAPTER_6_ALGEBRA_PLAY: Part1ChapterCurriculum = {
  chapterId: 'ch13-algebra-play',
  chapterIndex: 6,
  chapterBadgeLabel: 'Ganita Prakash Part II · Chapter 6',
  title: 'Algebra Play',
  heroRibbonText: 'Ganita Prakash Class 8 · Part II Challenge',
  heroSubtitle:
    'Decode “Think of a Number” tricks, Shubham’s 100M + D + 165 birthday machine, algebraic number pyramids, calendar cross patterns, and reverse genie puzzles.',
  pdfCode: 'hegp206.pdf',
  pdfUrl: 'https://ncert.nic.in/textbook.php?hegp2=6-7',
  heroBgGradient: 'from-[#172B46] via-[#1B3656] to-[#134E4A]',
  accentColor: '#14B8A6',
  challengeBannerTitle: 'Algebra Play Master Challenge',
  challengeBannerSubtitle:
    'Master all 8 modules of algebraic decoding, number pyramids, calendar matrices, and reverse equations!',
  modules: [
    {
      id: 'p2-ch6-m1',
      moduleCode: 'Module 6.1',
      shortNumber: '6.1',
      title: '“Think of a Number” Tricks & Algebraic Simplification',
      cardHeadline: 'Think of a Number Tricks',
      cardTeaser:
        'See why (2x + 10)/2 − x always equals 5 no matter what secret number x a friend chooses!',
      artworkTheme: 'algebra-tiles',
      videoCue: {
        title: 'Decoding Think-of-a-Number Magic Tricks',
        duration: '1:30',
        durationSeconds: 90,
        summary:
          'By naming the secret number x and simplifying the expression, the variable x cancels out completely.',
        readingParagraphs: [
          'When a magician says “Think of a number, double it, add 10, divide by 2, and subtract your original number,” we can write the entire journey as a single algebraic expression: (2x + 10) / 2 − x.',
          'Simplifying (2x + 10)/2 gives x + 5. When we subtract x, we get (x + 5) − x = 5. Because x vanishes, the final answer is guaranteed to be 5 for every number in the universe!',
        ],
        keyTakeaways: [
          'Represent the unknown secret number as a variable x',
          '(2x + 2k)/2 − x simplifies to the constant k',
          'Variable cancellation explains why the trick always lands on the same number',
        ],
        workedExample: {
          problem: 'Simplify the trick: Think of x, multiply by 3, add 12, divide by 3, subtract x.',
          steps: [
            'Write the expression: (3x + 12) / 3 − x',
            'Divide each term in the numerator by 3: (x + 4) − x',
            'Cancel x − x to reveal the constant result: 4',
          ],
          answer: '4 (Independent of x)',
        },
        scenes: [
          {
            sceneNumber: 1,
            timeRange: '0:00 – 0:18',
            title: 'The Secret Number Box x',
            narration:
              'Imagine placing any secret number inside a sealed mystery box labeled x. Doubling the box gives two x, and adding ten adds ten golden unit tiles beside it.',
            boardFormula: 'x → 2x + 10',
            visualCaption: 'Packing the secret number x into an algebraic expression',
          },
          {
            sceneNumber: 2,
            timeRange: '0:24 – 0:48',
            title: 'Halving and Canceling x',
            narration:
              'Dividing two x plus ten in half leaves exactly one x box and five golden tiles. Subtracting your original box x removes the mystery variable completely, leaving five!',
            boardFormula: '(2x + 10)/2 − x = 5',
            visualCaption: 'Variable x cancels out to leave a pure constant',
          },
          {
            sceneNumber: 3,
            timeRange: '0:48 – 1:12',
            title: 'Designing Your Own Mind-Reading Trick',
            narration:
              'By choosing any multiplier m and adding m times k before dividing by m and subtracting x, you can force the final answer to land on any target constant k you desire!',
            boardFormula: '(mx + mk)/m − x = k',
            visualCaption: 'Generalizing the variable-cancellation blueprint',
          },
        ],
      },
      simulation: {
        title: 'Think-of-a-Number Expression Canceler',
        description: 'Test different secret numbers x and additive constants to watch x cancel out live.',
        interactionType: 'algebra-workbench',
        defaultControlA: 7,
        defaultControlB: 10,
        controlALabel: 'Secret Number (x)',
        controlAMin: 1,
        controlAMax: 50,
        controlBLabel: 'Added Even Constant (2k)',
        controlBMin: 2,
        controlBMax: 40,
        formulaHighlight: '(2x + 2k)/2 − x = k',
      },
      game: {
        title: 'Mind-Reader Decoder',
        subtitle: 'Predict the guaranteed final output of each algebraic mind-reading trick!',
        rules: 'Simplify the algebraic expression to find what remains when x cancels.',
        challenges: [
          {
            prompt: 'What does ((4x + 20) / 4) − x always equal?',
            clue: 'Divide both 4x and 20 by 4 first.',
            options: ['4', '5', '10', '20'],
            correctIndex: 1,
            explanation: '(4x + 20)/4 − x = x + 5 − x = 5.',
          },
        ],
      },
    },
    {
      id: 'p2-ch6-m2',
      moduleCode: 'Module 6.2',
      shortNumber: '6.2',
      title: 'Decoding Shubham’s Birthday Trick (100M + D + 165)',
      cardHeadline: 'Shubham’s Birthday Decoder',
      cardTeaser:
        'Unpack 5(4(5M + 6) + 9) + D = 100M + D + 165 to see how place value hides the Month and Day in plain sight!',
      artworkTheme: 'vault',
      videoCue: {
        title: 'The Place-Value Suitcase: 100M + D + 165',
        duration: '1:30',
        durationSeconds: 90,
        summary:
          'Multiplying the month M by 100 shifts it two decimal places to the left so the day D sits cleanly in the last two digits.',
        readingParagraphs: [
          'Shubham asks you to take your birth month M, multiply by 5, add 6, multiply by 4, add 9, multiply by 5, and finally add your birth day D.',
          'Expanding 5(4(5M + 6) + 9) + D inside-out yields 100M + D + 165. Subtracting 165 leaves 100M + D, where the hundreds/thousands digits show M and the tens/ones digits show D!',
        ],
        keyTakeaways: [
          '5(4(5M + 6) + 9) + D expands to 100M + D + 165',
          'Subtracting 165 isolates 100M + D',
          '100M shifts the month two places left so the day D occupies the last two digits',
        ],
        workedExample: {
          problem: 'Shubham’s trick gives 1089. Find the birth month M and day D.',
          steps: [
            'Subtract the fixed offset 165: 1089 − 165 = 924',
            'Match 924 with 100M + D: 900 + 24',
            'Read M = 9 (September) and D = 24',
          ],
          answer: 'September 24 (M = 9, D = 24)',
        },
        scenes: [
          {
            sceneNumber: 1,
            timeRange: '0:00 – 0:18',
            title: 'Expanding Nested Brackets Inside-Out',
            narration:
              'Starting with five M plus six, multiplying by four gives twenty M plus twenty-four. Adding nine and multiplying by five creates one hundred M plus one hundred sixty-five!',
            boardFormula: '5(20M + 33) + D = 100M + D + 165',
            visualCaption: 'Distributing factors step by step',
          },
          {
            sceneNumber: 2,
            timeRange: '0:24 – 0:48',
            title: 'The Place-Value Suitcase 100M + D',
            narration:
              'Once we subtract one hundred sixty-five, we are left with one hundred M plus D. Multiplying M by one hundred opens two empty digit compartments on the right for the day D!',
            boardFormula: '1089 − 165 = 924 ⇒ Month 9, Day 24',
            visualCaption: 'Hundreds slot holds M, last two digits hold D',
          },
          {
            sceneNumber: 3,
            timeRange: '0:48 – 1:12',
            title: 'Why Day D Never Overlaps Month M',
            narration:
              'Because a month never has more than thirty-one days, the day D always fits inside the tens and units places without ever carrying over into the hundreds column of M!',
            boardFormula: '1 ≤ D ≤ 31 < 100',
            visualCaption: 'Non-overlapping decimal compartments guarantee unique decoding',
          },
        ],
      },
      simulation: {
        title: 'Place-Value Birthday Suitcase Lab',
        description: 'Pick any Month M and Day D to trace 100M + D + 165 in real time.',
        interactionType: 'algebra-workbench',
        defaultControlA: 9,
        defaultControlB: 24,
        controlALabel: 'Birth Month (M)',
        controlAMin: 1,
        controlAMax: 12,
        controlBLabel: 'Birth Day (D)',
        controlBMin: 1,
        controlBMax: 31,
        formulaHighlight: '5(4(5M + 6) + 9) + D = 100M + D + 165',
      },
      game: {
        title: 'Birthday Vault Cracker',
        subtitle: 'Subtract 165 and split the number into Month M and Day D!',
        rules: 'Use 100M + D = Total − 165 to decode each date.',
        challenges: [
          {
            prompt: 'If Shubham’s formula outputs 1379, what is the birthday (M, D)?',
            clue: 'Compute 1379 − 165 first.',
            options: ['Dec 14 (12, 14)', 'Nov 14 (11, 14)', 'Oct 29 (10, 29)', 'Aug 15 (8, 15)'],
            correctIndex: 0,
            explanation: '1379 − 165 = 1214 = 100(12) + 14 → Month 12, Day 14.',
          },
        ],
      },
    },
    {
      id: 'p2-ch6-m3',
      moduleCode: 'Module 6.3',
      shortNumber: '6.3',
      title: 'Number Pyramids & Virahāṅka-Binomial Weights',
      cardHeadline: 'Algebraic Number Pyramids',
      cardTeaser:
        'Discover why a 3-row pyramid top equals a + 2b + c and a 4-row pyramid top equals a + 3b + 3c + d!',
      artworkTheme: 'odd-grid',
      videoCue: {
        title: 'Algebraic Number Pyramids & Pascal Weights',
        duration: '1:30',
        durationSeconds: 90,
        summary:
          'When each brick is the sum of the two bricks below it, the middle bottom bricks feed into multiple paths upward.',
        readingParagraphs: [
          'In an addition pyramid, each brick equals the sum of the two bricks directly beneath it. If the bottom row has 3 bricks (a, b, c), the middle row is (a + b) and (b + c), so the apex is a + 2b + c.',
          'For a 4-brick base (a, b, c, d), the apex simplifies to a + 3b + 3c + d. Notice the coefficients 1, 2, 1 and 1, 3, 3, 1—the middle bricks carry triple the weight of the corner bricks!',
        ],
        keyTakeaways: [
          '3-brick base (a, b, c) → Apex = a + 2b + c',
          '4-brick base (a, b, c, d) → Apex = a + 3b + 3c + d',
          'Coefficients follow Meru-Prastāra (Pascal’s Triangle): 1, 3, 3, 1',
        ],
        workedExample: {
          problem: 'Find the apex of a 4-row pyramid with bottom bricks 2, 5, 4, 3.',
          steps: [
            'Apply the 4-row formula: Apex = a + 3b + 3c + d',
            'Substitute a=2, b=5, c=4, d=3: 2 + 3(5) + 3(4) + 3',
            'Sum the weighted terms: 2 + 15 + 12 + 3 = 32',
          ],
          answer: '32',
        },
        scenes: [
          {
            sceneNumber: 1,
            timeRange: '0:00 – 0:18',
            title: 'Building Upward with Variables a, b, c, d',
            narration:
              'Place variables a, b, c, and d along the base of a four-tier pyramid. Row two becomes a plus b, b plus c, and c plus d as adjacent bricks merge upward.',
            boardFormula: 'Row 2: (a+b), (b+c), (c+d)',
            visualCaption: 'Each brick sums the two bricks directly below it',
          },
          {
            sceneNumber: 2,
            timeRange: '0:24 – 0:48',
            title: 'The 1 : 3 : 3 : 1 Apex Formula',
            narration:
              'At the summit, the expression simplifies to a plus three b plus three c plus d. The inner bricks b and c travel along three upward pathways to reach the top!',
            boardFormula: 'Apex = a + 3b + 3c + d',
            visualCaption: 'Meru-Prastāra weights 1, 3, 3, 1 at the summit',
          },
          {
            sceneNumber: 3,
            timeRange: '0:48 – 1:12',
            title: 'Maximizing the Summit by Placing Largest Numbers Inside',
            narration:
              'Because the two inner base positions are multiplied by three while the outer corners are multiplied by one, placing your largest numbers in the middle maximizes the pyramid summit!',
            boardFormula: '3(b + c) + (a + d)',
            visualCaption: 'Inner bricks carry 3× the weight of corner bricks',
          },
        ],
      },
      simulation: {
        title: 'Algebraic Pyramid Weight Explorer',
        description: 'Adjust base bricks and watch the 1-3-3-1 algebraic weights propagate to the apex.',
        interactionType: 'algebra-workbench',
        defaultControlA: 5,
        defaultControlB: 4,
        controlALabel: 'Inner Brick b',
        controlAMin: 1,
        controlAMax: 20,
        controlBLabel: 'Inner Brick c',
        controlBMin: 1,
        controlBMax: 20,
        formulaHighlight: 'Apex = a + 3b + 3c + d',
      },
      game: {
        title: 'Pyramid Summit Racer',
        subtitle: 'Use the 1-3-3-1 shortcut to compute the apex without filling every row!',
        rules: 'Apply Apex = a + 3b + 3c + d.',
        challenges: [
          {
            prompt: 'Base bricks of a 4-row pyramid are (1, 10, 10, 1). What is the top brick?',
            clue: 'Use a + 3b + 3c + d.',
            options: ['22', '42', '62', '82'],
            correctIndex: 2,
            explanation: '1 + 3(10) + 3(10) + 1 = 62.',
          },
        ],
      },
    },
    {
      id: 'p2-ch6-m4',
      moduleCode: 'Module 6.4',
      shortNumber: '6.4',
      title: 'Reverse Number Pyramids & Solving for Missing Bricks',
      cardHeadline: 'Reverse Pyramid Solver',
      cardTeaser:
        'Given the top summit and three base bricks, use algebra to solve for the hidden bottom brick in one step!',
      artworkTheme: 'carpenter',
      videoCue: {
        title: 'Solving Reverse Number Pyramids with Algebra',
        duration: '1:30',
        durationSeconds: 90,
        summary:
          'Instead of guessing and checking, substitute the known bricks into T = a + 3b + 3c + d and solve for the unknown brick.',
        readingParagraphs: [
          'Suppose the apex of a 4-row pyramid is 50, and the first three bottom bricks are a = 4, b = 8, c = 7, while d is unknown.',
          'Using 50 = 4 + 3(8) + 3(7) + d, we get 50 = 4 + 24 + 21 + d = 49 + d, which immediately reveals d = 1 without trial and error!',
        ],
        keyTakeaways: [
          'Write the apex equation T = a + 3b + 3c + d',
          'To find corner brick d: d = T − a − 3(b + c)',
          'To find inner brick b: b = (T − a − 3c − d) / 3',
        ],
        workedExample: {
          problem: 'In a 4-row pyramid, Apex = 60 and base is (3, 7, 8, d). Find d.',
          steps: [
            'Use T = a + 3b + 3c + d → 60 = 3 + 3(7) + 3(8) + d',
            'Compute known sum: 3 + 21 + 24 = 48',
            'Subtract from 60: d = 60 − 48 = 12',
          ],
          answer: 'd = 12',
        },
        scenes: [
          {
            sceneNumber: 1,
            timeRange: '0:00 – 0:18',
            title: 'Why Guess-and-Check Fails on Reverse Pyramids',
            narration:
              'When the summit is given and a bottom brick d is missing, guessing bottom numbers requires rebuilding the entire pyramid over and over.',
            boardFormula: '60 = 3 + 3(7) + 3(8) + d',
            visualCaption: 'Connecting the summit directly to the unknown base brick',
          },
          {
            sceneNumber: 2,
            timeRange: '0:24 – 0:48',
            title: 'Isolating the Unknown Brick d',
            narration:
              'With our algebraic formula, we simply subtract a plus three b plus three c from the summit T. Sixty minus forty-eight unlocks d equals twelve in a single step!',
            boardFormula: 'd = 60 − 48 = 12',
            visualCaption: 'Direct algebraic inversion solves the puzzle instantly',
          },
          {
            sceneNumber: 3,
            timeRange: '0:48 – 1:12',
            title: 'Solving for a Missing Inner Brick b',
            narration:
              'When an inner brick b is unknown, we subtract the corner bricks and three c from the summit T, and then divide by three to pinpoint the exact value of b!',
            boardFormula: 'b = (T − a − 3c − d) ÷ 3',
            visualCaption: 'Dividing by the pathway weight 3 recovers any inner brick',
          },
        ],
      },
      simulation: {
        title: 'Reverse Pyramid Missing-Brick Lab',
        description: 'Change the target apex T and watch the required base brick d update live.',
        interactionType: 'algebra-workbench',
        defaultControlA: 60,
        defaultControlB: 15,
        controlALabel: 'Target Apex (T)',
        controlAMin: 30,
        controlAMax: 100,
        controlBLabel: 'Sum of Inner Bricks (b + c)',
        controlBMin: 5,
        controlBMax: 25,
        formulaHighlight: 'd = T − a − 3(b + c)',
      },
      game: {
        title: 'Missing Brick Detective',
        subtitle: 'Find the missing bottom brick that produces the target apex!',
        rules: 'Use d = T − a − 3(b + c).',
        challenges: [
          {
            prompt: 'Apex = 50, and base bricks are (0, 8, 7, d). What is d?',
            clue: '50 − 3(8 + 7) = ?',
            options: ['3', '5', '7', '9'],
            correctIndex: 1,
            explanation: 'd = 50 − 0 − 3(15) = 50 − 45 = 5.',
          },
        ],
      },
    },
    {
      id: 'p2-ch6-m5',
      moduleCode: 'Module 6.5',
      shortNumber: '6.5',
      title: 'Karim & The Genie’s Doubling-and-Fee Puzzle',
      cardHeadline: 'The Genie’s Doubling Puzzle',
      cardTeaser:
        'Each time Karim crosses the bridge, his coins double and he pays 50 coins. How can he end with 0 coins after 3 crossings?',
      artworkTheme: 'cosmic',
      videoCue: {
        title: 'Karim & The Genie: Forward Algebra vs. Backward Inversion',
        duration: '1:30',
        durationSeconds: 90,
        summary:
          'Three rounds of doubling and paying 50 coins yield 8x − 350 = 0, so Karim started with 43.75 coins!',
        readingParagraphs: [
          'A magical genie tells Karim: “Each time you cross this bridge, I will double your money, and then you must pay me 50 coins.” After 3 crossings, Karim has 0 coins left.',
          'Starting with x coins: after Crossing 1 he has 2x − 50; after Crossing 2 he has 2(2x − 50) − 50 = 4x − 150; after Crossing 3 he has 2(4x − 150) − 50 = 8x − 350. Solving 8x = 350 gives x = 43.75!',
        ],
        keyTakeaways: [
          'Crossing 1: 2x − 50',
          'Crossing 2: 4x − 150',
          'Crossing 3: 8x − 350 = 0 ⇒ x = 43.75',
        ],
        workedExample: {
          problem: 'If the Genie charges 40 coins per crossing and Karim has 0 left after 3 crossings, find x.',
          steps: [
            'Write the 3-crossing equation: 8x − 7(40) = 0',
            '8x = 280',
            'Divide by 8: x = 35 coins',
          ],
          answer: '35 coins',
        },
        scenes: [
          {
            sceneNumber: 1,
            timeRange: '0:00 – 0:18',
            title: 'Three Bridge Crossings: 8x − 350',
            narration:
              'Each crossing doubles Karim’s current pouch and subtracts fifty coins. After three crossings, his initial x coins have been multiplied by eight while the fees compound to three hundred fifty!',
            boardFormula: '2(2(2x − 50) − 50) − 50 = 8x − 350',
            visualCaption: 'Compounding the doubling and toll across 3 crossings',
          },
          {
            sceneNumber: 2,
            timeRange: '0:24 – 0:48',
            title: 'Working Backward (Vilomakriyā)',
            narration:
              'Setting eight x minus three hundred fifty equal to zero gives x equals forty-three point seven five—showing why Karim could never start with a whole number of coins if the toll is fifty!',
            boardFormula: '8x = 350 ⇒ x = 43.75',
            visualCaption: 'Exact algebraic solution reveals the genie’s trap',
          },
          {
            sceneNumber: 3,
            timeRange: '0:48 – 1:12',
            title: 'Choosing a Toll Divisible by 8',
            narration:
              'In general, after n crossings with toll F, Karim has two to the power n times x minus two to the power n minus one times F. When F is a multiple of eight, x is a clean whole number!',
            boardFormula: '2ⁿx − (2ⁿ − 1)F = 0',
            visualCaption: 'General n-crossing Genie formula',
          },
        ],
      },
      simulation: {
        title: 'Genie Bridge Crossing Simulator',
        description: 'Adjust the Genie’s toll F and starting coins x to test 3 bridge crossings.',
        interactionType: 'algebra-workbench',
        defaultControlA: 35,
        defaultControlB: 40,
        controlALabel: 'Starting Coins (x)',
        controlAMin: 10,
        controlAMax: 80,
        controlBLabel: 'Genie Toll per Crossing (F)',
        controlBMin: 8,
        controlBMax: 80,
        formulaHighlight: 'After 3 Crossings: 8x − 7F',
      },
      game: {
        title: 'Outsmart the Genie',
        subtitle: 'Find the starting coins x so you finish with the target amount after 3 crossings!',
        rules: 'Use Final = 8x − 7F.',
        challenges: [
          {
            prompt: 'If the Genie charges F = 16 coins per crossing and you end with 0 after 3 crossings, what was x?',
            clue: 'Solve 8x = 7 × 16.',
            options: ['12', '14', '16', '18'],
            correctIndex: 1,
            explanation: '8x = 112 → x = 14 coins.',
          },
        ],
      },
    },
    {
      id: 'p2-ch6-m6',
      moduleCode: 'Module 6.6',
      shortNumber: '6.6',
      title: 'Calendar Grids & 3×3 Cross Sums (9c)',
      cardHeadline: 'Algebraic Calendar Grids',
      cardTeaser:
        'Prove why any 3×3 square on a monthly calendar has a total sum equal to exactly 9 times its center date c!',
      artworkTheme: 'div-matrix',
      videoCue: {
        title: 'The Secret Algebra Inside Monthly Calendars',
        duration: '1:30',
        durationSeconds: 90,
        summary:
          'On a 7-day calendar grid, moving one row up/down changes the date by ±7 and left/right by ±1, so opposite pairs around center c cancel to 2c.',
        readingParagraphs: [
          'Call the center number of a 3×3 calendar window c. The numbers to the left and right are (c − 1) and (c + 1). The numbers directly above and below are (c − 7) and (c + 7).',
          'Every symmetric pair around the center sums to 2c, so all 9 dates in the 3×3 grid sum to 9c! Tell me the sum S of any 3×3 calendar block, and dividing by 9 immediately reveals the center date c = S / 9.',
        ],
        keyTakeaways: [
          'Horizontal step on a calendar = ±1; Vertical step = ±7',
          '5-number Plus Cross sum = 5c',
          'Full 3×3 Calendar Block sum = 9c',
        ],
        workedExample: {
          problem: 'The sum of all 9 dates in a 3×3 calendar square is 135. Find the center date and top-left date.',
          steps: [
            'Use 9c = 135 → c = 135 / 9 = 15 (center date)',
            'Top-left date is 1 row up (−7) and 1 column left (−1): c − 8',
            'Compute 15 − 8 = 7',
          ],
          answer: 'Center = 15, Top-Left = 7',
        },
        scenes: [
          {
            sceneNumber: 1,
            timeRange: '0:00 – 0:18',
            title: 'Mapping a 3×3 Calendar Window Around Center c',
            narration:
              'Because every week has seven days, stepping one row up subtracts seven and stepping one row down adds seven. Around the center date c, every opposite pair of offsets cancels out!',
            boardFormula: '(c − 7) + c + (c + 7) = 3c',
            visualCaption: 'Symmetric ±1, ±6, ±7, ±8 offsets around center c',
          },
          {
            sceneNumber: 2,
            timeRange: '0:24 – 0:48',
            title: 'The 9c Calendar Magic Shortcut',
            narration:
              'Adding all nine cells cancels every plus and minus offset, leaving nine times the center date c. Dividing any three-by-three calendar sum by nine reveals the middle date instantly!',
            boardFormula: 'Sum of 3×3 Calendar Square = 9c',
            visualCaption: 'Center date c = Total Sum ÷ 9',
          },
          {
            sceneNumber: 3,
            timeRange: '0:48 – 1:12',
            title: 'Diagonal Sums Equal 3c Inside the Calendar Square',
            narration:
              'Even the two diagonals—from c minus eight through c to c plus eight, and from c minus six through c to c plus six—each sum to exactly three times the center date!',
            boardFormula: '(c − 8) + c + (c + 8) = 3c',
            visualCaption: 'Both diagonals and middle row/column equal 3c',
          },
        ],
      },
      simulation: {
        title: '3×3 Calendar Matrix Explorer',
        description: 'Slide the 3×3 window across the calendar and watch Sum = 9c hold everywhere.',
        interactionType: 'algebra-workbench',
        defaultControlA: 15,
        defaultControlB: 9,
        controlALabel: 'Center Date (c)',
        controlAMin: 9,
        controlAMax: 22,
        controlBLabel: 'Window Cells (5 or 9)',
        controlBMin: 5,
        controlBMax: 9,
        formulaHighlight: '3×3 Sum = 9c · Plus-Cross Sum = 5c',
      },
      game: {
        title: 'Calendar Mind-Reader',
        subtitle: 'Find the center date c from the 3×3 or 5-cell cross sum!',
        rules: 'Divide the 3×3 sum by 9 (or the 5-cell cross sum by 5).',
        challenges: [
          {
            prompt: 'A 3×3 square on a calendar has a total sum of 180. What is the center date?',
            clue: '9c = 180.',
            options: ['18', '20', '22', '25'],
            correctIndex: 1,
            explanation: 'c = 180 / 9 = 20.',
          },
        ],
      },
    },
    {
      id: 'p2-ch6-m7',
      moduleCode: 'Module 6.7',
      shortNumber: '6.7',
      title: 'Balancing Equations & Multi-Step Inverse Puzzles',
      cardHeadline: 'Balancing Linear Equations',
      cardTeaser:
        'Keep the two pans of an equation in perfect equilibrium while isolating x in multi-step word problems!',
      artworkTheme: 'trairasika',
      videoCue: {
        title: 'The Golden Balance Scale of Algebra',
        duration: '1:30',
        durationSeconds: 90,
        summary:
          'Whatever operation you perform on the left pan of an equation must be mirrored on the right pan to preserve equality.',
        readingParagraphs: [
          'An equation like 5x + 12 = 3x + 28 is like a balanced two-pan scale: 5 mystery weights and 12 unit coins on the left balance 3 mystery weights and 28 unit coins on the right.',
          'Removing 3x from both pans leaves 2x + 12 = 28. Removing 12 coins from both pans gives 2x = 16, so each mystery weight is x = 8!',
        ],
        keyTakeaways: [
          'Subtract the smaller variable term from both sides first',
          'Isolate the variable term by undoing addition/subtraction',
          'Divide both sides by the coefficient of x',
        ],
        workedExample: {
          problem: 'Solve 5x + 12 = 3x + 28.',
          steps: [
            'Subtract 3x from both sides: 2x + 12 = 28',
            'Subtract 12 from both sides: 2x = 16',
            'Divide by 2: x = 8',
          ],
          answer: 'x = 8',
        },
        scenes: [
          {
            sceneNumber: 1,
            timeRange: '0:00 – 0:18',
            title: 'Two Pans in Equilibrium: 5x + 12 = 3x + 28',
            narration:
              'Picture five golden x-weights and twelve coins on the left pan balancing three x-weights and twenty-eight coins on the right pan.',
            boardFormula: '5x + 12 = 3x + 28',
            visualCaption: 'Equal operations on both pans keep the beam level',
          },
          {
            sceneNumber: 2,
            timeRange: '0:24 – 0:48',
            title: 'Removing Equal Weights to Isolate x',
            narration:
              'Lifting three x-weights from each pan and then removing twelve coins leaves two x balancing sixteen coins, proving each x weighs eight!',
            boardFormula: '2x = 16 ⇒ x = 8',
            visualCaption: 'Step-by-step inverse operations isolate x',
          },
          {
            sceneNumber: 3,
            timeRange: '0:48 – 1:12',
            title: 'Verifying Equilibrium by Substitution',
            narration:
              'Substituting x equals eight back into both pans gives five times eight plus twelve equals fifty-two on the left, and three times eight plus twenty-eight equals fifty-two on the right!',
            boardFormula: '5(8) + 12 = 52 = 3(8) + 28',
            visualCaption: 'Both sides evaluate to 52, confirming balance',
          },
        ],
      },
      simulation: {
        title: 'Two-Pan Equation Balance Lab',
        description: 'Remove variable weights and constants from both pans to isolate x.',
        interactionType: 'algebra-workbench',
        defaultControlA: 8,
        defaultControlB: 12,
        controlALabel: 'True Value of x',
        controlAMin: 1,
        controlAMax: 20,
        controlBLabel: 'Left Constant Offset',
        controlBMin: 2,
        controlBMax: 30,
        formulaHighlight: 'ax + b = cx + d ⇒ (a − c)x = d − b',
      },
      game: {
        title: 'Equilibrium Master',
        subtitle: 'Solve multi-step linear equations with variables on both sides!',
        rules: 'Collect x terms on one side and constants on the other.',
        challenges: [
          {
            prompt: 'Solve for x: 7x + 5 = 4x + 26',
            clue: 'Subtract 4x and 5 from both sides.',
            options: ['x = 5', 'x = 6', 'x = 7', 'x = 8'],
            correctIndex: 2,
            explanation: '3x = 21 → x = 7.',
          },
        ],
      },
    },
    {
      id: 'p2-ch6-m8',
      moduleCode: 'Module 6.8',
      shortNumber: '6.8',
      title: 'Chapter Wrap-up & Assessment',
      cardHeadline: 'Algebra Play Master Assessment',
      cardTeaser:
        'Synthesize number tricks, place-value decoders, pyramids, calendar algebra, and genie equations in the final challenge!',
      isWrapUpModule: true,
      artworkTheme: 'master-boss',
      videoCue: {
        title: 'Chapter 6 Synthesis: The Power of Algebraic Modeling',
        duration: '1:30',
        durationSeconds: 90,
        summary:
          'Algebra turns every number puzzle, calendar pattern, and reverse riddle into a transparent equation.',
        readingParagraphs: [
          'Across Chapter 6, we saw that algebra is not about memorizing dry rules—it is an X-ray lens that reveals why number tricks work, how place-value formulas pack multiple numbers together, and how reverse puzzles unwind effortlessly.',
        ],
        keyTakeaways: [
          'Birthday Decoder: 100M + D + 165',
          '4-Row Pyramid Apex: a + 3b + 3c + d',
          '3×3 Calendar Sum = 9c & 3-Crossing Genie = 8x − 7F',
        ],
        workedExample: {
          problem: 'Combine two tricks: A 3×3 calendar sum is 99, and a 3-row pyramid has base (3, c, 5). Find the pyramid apex.',
          steps: [
            'From 9c = 99, find the calendar center c = 11',
            'Use 3-row pyramid formula Apex = a + 2b + c with (3, 11, 5)',
            'Compute 3 + 2(11) + 5 = 30',
          ],
          answer: '30',
        },
        scenes: [
          {
            sceneNumber: 1,
            timeRange: '0:00 – 0:24',
            title: 'Algebra as the Ultimate Pattern Decoder',
            narration:
              'From Shubham’s one hundred M plus D birthday formula to the one-three-three-one pyramid weights, algebra gives us a universal language to see inside any numerical pattern.',
            boardFormula: '100M + D · a + 3b + 3c + d',
            visualCaption: 'Every number trick is an algebraic identity in disguise',
          },
          {
            sceneNumber: 2,
            timeRange: '0:24 – 0:48',
            title: 'Calendar Symmetry and Reverse Equations',
            narration:
              'Whether we are decoding a three-by-three calendar block using nine c or unwinding Karim’s three bridge crossings with eight x minus seven F, inverse operations unlock the unknown.',
            boardFormula: 'Sum = 9c · 8x − 7F = 0',
            visualCaption: 'Symmetric offsets and inverse operations',
          },
          {
            sceneNumber: 3,
            timeRange: '0:48 – 1:12',
            title: 'Mastering the Two-Pan Balance of Algebra',
            narration:
              'By translating word riddles into balanced equations and simplifying step by step, you can solve any algebraic challenge with certainty and elegance!',
            boardFormula: 'ax + b = cx + d ⇒ x = (d − b)/(a − c)',
            visualCaption: 'Ready for the Chapter 6 Master Assessment',
          },
        ],
      },
      simulation: {
        title: 'Algebra Play Grand Sandbox',
        isBigSimulation: true,
        description: 'Test birthday decoders, pyramids, and genie equations in one unified lab.',
        interactionType: 'grand-capstone-sim',
        defaultControlA: 10,
        defaultControlB: 6,
        controlALabel: 'Variable x / Month M',
        controlAMin: 1,
        controlAMax: 20,
        controlBLabel: 'Parameter y / Day D',
        controlBMin: 1,
        controlBMax: 30,
        formulaHighlight: '100M + D + 165 · Apex = a + 3b + 3c + d',
      },
      game: {
        title: 'Algebra Play Championship',
        isBigGame: true,
        subtitle: 'Complete the multi-stage Algebra Play tournament!',
        rules: 'Solve each algebraic puzzle to earn the Chapter 6 Mastery Seal.',
        challenges: [
          {
            prompt: 'In a 3-row number pyramid with base (4, x, 6), the apex is 26. Find x.',
            clue: 'Apex = a + 2b + c → 4 + 2x + 6 = 26.',
            options: ['x = 6', 'x = 8', 'x = 10', 'x = 12'],
            correctIndex: 1,
            explanation: '2x + 10 = 26 → 2x = 16 → x = 8.',
          },
        ],
      },
    },
  ],
  questionnaire: [],
};

export const PART2_CURRICULUM_CHAPTERS: Part1ChapterCurriculum[] = [
  ...PART2_CHAPTERS_1_TO_2,
  PART2_CHAPTERS_3_TO_4[0], // Ch 3: Proportional Reasoning-2
  PART2_CHAPTER_4_GEOMETRIC_THEMES, // Ch 4: Exploring Some Geometric Themes
  ...PART2_CHAPTER_5, // Ch 5: Tales by Dots and Lines
  PART2_CHAPTER_6_ALGEBRA_PLAY, // Ch 6: Algebra Play (8 modules)
  PART2_CHAPTERS_3_TO_4[1], // Ch 7: Area
];

export function getPart1CurriculumById(
  id: ChapterId | 'ch8-master-quiz'
): Part1ChapterCurriculum | undefined {
  return (
    PART1_CURRICULUM_CHAPTERS.find((c) => c.chapterId === id) ||
    PART2_CURRICULUM_CHAPTERS.find((c) => c.chapterId === id)
  );
}

/**
 * Converts a Part II GanitaChapter into the ITZA-style Part1ChapterCurriculum format
 * so that ALL chapters in the app open with the unified ITZA card-grid & challenge banner interface!
 */
export function buildPart2CurriculumFromChapter(chapter: GanitaChapter): Part1ChapterCurriculum {
  const artworkCycle: Part1ModuleItem['artworkTheme'][] = [
    'cosmic',
    'carpenter',
    'algebra-tiles',
    'trairasika',
    'odd-grid',
    'div-matrix',
    'quad-tree',
    'vault',
  ];

  const segmentModules: Part1ModuleItem[] = chapter.segments.flatMap((seg, segIdx) => {
    const problems = [seg.featuredSolution, ...seg.extraProblems];
    return problems.map((prob, probIdx) => {
      const modNum = segIdx * 2 + probIdx + 1;
      const code = `${chapter.chapterNumber}.${modNum}`;
      return {
        id: `${seg.id}-mod-${modNum}`,
        moduleCode: `Module ${code}`,
        shortNumber: code,
        title: prob.title,
        cardHeadline: prob.title,
        cardTeaser: `${seg.subtitle} — ${prob.funAnalogy.story}`,
        artworkTheme: artworkCycle[(modNum - 1) % artworkCycle.length],
        videoCue: {
          title: `3-Minute Video Cue: ${prob.title}`,
          duration: '2:50',
          durationSeconds: 170,
          summary: prob.funAnalogy.story,
          readingParagraphs: [
            `In ${chapter.partLabel} Chapter ${chapter.chapterNumber} (${chapter.title}), this module explores ${seg.title}: ${seg.subtitle}.`,
            `Common Homework Hurdle Fixed: ${seg.commonStruggle}`,
            ...seg.coreConcepts,
          ],
          keyTakeaways: seg.keyFormulas.map((kf) => `${kf.label}: ${kf.formula}`),
          workedExample: {
            problem: prob.originalProblem,
            steps: prob.steps.map((s) => `${s.title}: ${s.mathBefore} ⇒ ${s.mathAfter} (${s.explanation})`),
            answer: prob.finalAnswer,
          },
          scenes: prob.steps.map((st, idx) => ({
            sceneNumber: idx + 1,
            timeRange: `0:${idx * 45 < 10 ? '0' : ''}${idx * 45} – ${idx + 1}:30`,
            title: st.title,
            narration: st.explanation,
            boardFormula: `${st.mathBefore} ⇒ ${st.mathAfter}`,
            visualCaption: st.funTip,
          })),
        },
        simulation: {
          title: `Interactive Simulation: ${seg.title}`,
          description: `Manipulate parameters and inspect live mathematical relationships for ${prob.title}.`,
          interactionType: 'grand-capstone-sim',
          defaultControlA: 12,
          defaultControlB: 5,
          controlALabel: prob.graphConfig.parameters[0]?.label || 'Primary Value (a)',
          controlAMin: 1,
          controlAMax: 25,
          controlBLabel: prob.graphConfig.parameters[1]?.label || 'Secondary Value (b)',
          controlBMin: 1,
          controlBMax: 20,
          formulaHighlight: seg.keyFormulas[0]
            ? `${seg.keyFormulas[0].label}: ${seg.keyFormulas[0].formula}`
            : prob.finalAnswer,
        },
        game: {
          title: `Mini Game: ${seg.segmentCode} Challenge`,
          subtitle: prob.funAnalogy.punchline,
          rules: 'Solve each step check and twin challenge to earn mastery points!',
          challenges: [
            ...prob.steps
              .filter((st) => st.checkQuestion)
              .map((st) => ({
                prompt: st.checkQuestion!.prompt,
                clue: st.checkQuestion!.hint,
                options: st.checkQuestion!.options,
                correctIndex: st.checkQuestion!.correctIndex,
                explanation: st.explanation,
              })),
            {
              prompt: prob.practiceTwin.question,
              clue: prob.practiceTwin.equation,
              options: prob.practiceTwin.options,
              correctIndex: prob.practiceTwin.correctIndex,
              explanation: prob.practiceTwin.explanation,
            },
          ],
        },
      };
    });
  });

  // Add Wrap-up & Assessment Module at the end
  const wrapIndex = segmentModules.length + 1;
  const wrapCode = `${chapter.chapterNumber}.${wrapIndex}`;
  const wrapUpModule: Part1ModuleItem = {
    id: `${chapter.id}-wrapup`,
    moduleCode: `Module ${wrapCode}`,
    shortNumber: wrapCode,
    title: 'Chapter Wrap-up & Assessment',
    cardHeadline: 'Chapter Wrap-up & Master Assessment',
    cardTeaser: `Synthesize all concepts in ${chapter.title}, explore the Chapter Lab, and take a freshly randomized 10-Question Assessment!`,
    isWrapUpModule: true,
    artworkTheme: 'master-boss',
    videoCue: {
      title: `Chapter ${chapter.chapterNumber} Synthesis: ${chapter.title}`,
      duration: '2:45',
      durationSeconds: 165,
      summary: chapter.summary,
      readingParagraphs: [
        chapter.summary,
        ...chapter.segments.map((s) => `${s.segmentCode} (${s.title}): ${s.commonStruggle}`),
      ],
      keyTakeaways: chapter.segments.flatMap((s) =>
        s.keyFormulas.map((kf) => `${kf.label}: ${kf.formula}`)
      ),
      workedExample: {
        problem: chapter.segments[0].featuredSolution.originalProblem,
        steps: chapter.segments[0].featuredSolution.steps.map(
          (st) => `${st.title}: ${st.mathBefore} ⇒ ${st.mathAfter}`
        ),
        answer: chapter.segments[0].featuredSolution.finalAnswer,
      },
      scenes: chapter.segments.map((s, idx) => ({
        sceneNumber: idx + 1,
        timeRange: `0:${idx * 50} – ${idx + 1}:40`,
        title: s.title,
        narration: s.commonStruggle,
        boardFormula: s.keyFormulas[0]?.formula || s.title,
        visualCaption: s.subtitle,
      })),
    },
    simulation: {
      title: chapter.interactiveLabTitle,
      isBigSimulation: true,
      description: `Capstone interactive laboratory for ${chapter.title}.`,
      interactionType: 'grand-capstone-sim',
      defaultControlA: 10,
      defaultControlB: 6,
      controlALabel: 'Parameter A',
      controlAMin: 1,
      controlAMax: 24,
      controlBLabel: 'Parameter B',
      controlBMin: 1,
      controlBMax: 20,
      formulaHighlight: chapter.segments[0]?.keyFormulas[0]?.formula || chapter.title,
    },
    game: {
      title: `${chapter.title} Tournament`,
      isBigGame: true,
      subtitle: `Multi-stage challenge across all segments of ${chapter.title}!`,
      rules: 'Complete all tournament stages to earn the Chapter Mastery Seal.',
      challenges: chapter.segments.map((s) => ({
        prompt: s.featuredSolution.practiceTwin.question,
        clue: s.featuredSolution.practiceTwin.equation,
        options: s.featuredSolution.practiceTwin.options,
        correctIndex: s.featuredSolution.practiceTwin.correctIndex,
        explanation: s.featuredSolution.practiceTwin.explanation,
      })),
    },
  };

  // Build static question pool from all segment checkQuestions and practiceTwins
  const staticQuestions: ChapterAssessmentQuestion[] = [];
  let qNum = 1;
  for (const seg of chapter.segments) {
    const probs = [seg.featuredSolution, ...seg.extraProblems];
    for (const p of probs) {
      for (const st of p.steps) {
        if (st.checkQuestion) {
          staticQuestions.push({
            id: `${p.id}-st-${st.stepNumber}`,
            questionNumber: qNum++,
            type: 'mcq',
            prompt: st.checkQuestion.prompt,
            options: st.checkQuestion.options,
            correctIndex: st.checkQuestion.correctIndex,
            explanation: st.explanation,
            moduleRef: seg.segmentCode,
          });
        }
      }
      staticQuestions.push({
        id: `${p.id}-twin`,
        questionNumber: qNum++,
        type: 'mcq',
        prompt: `${p.practiceTwin.question} (${p.practiceTwin.equation})`,
        options: p.practiceTwin.options,
        correctIndex: p.practiceTwin.correctIndex,
        explanation: p.practiceTwin.explanation,
        moduleRef: seg.segmentCode,
      });
    }
  }

  return {
    chapterId: chapter.id,
    chapterIndex: chapter.chapterNumber,
    chapterBadgeLabel: `Ganita Prakash ${chapter.partLabel} · Chapter ${chapter.chapterNumber}`,
    title: chapter.title,
    heroRibbonText: `Ganita Prakash Class 8 · ${chapter.partLabel} Challenge`,
    heroSubtitle: chapter.summary,
    pdfCode: `${chapter.partLabel} Ch ${chapter.chapterNumber}`,
    pdfUrl: chapter.pdfUrl,
    heroBgGradient: 'from-[#0F3828] via-[#1E3A5F] to-[#0F172A]',
    accentColor: '#10B981',
    challengeBannerTitle: `Are you ready for the ${chapter.title} challenge?`,
    challengeBannerSubtitle: `Explore ${chapter.interactiveLabTitle}, play the Chapter Tournament, and test yourself with a freshly randomized 10-Question Quiz!`,
    modules: [...segmentModules, wrapUpModule],
    questionnaire: staticQuestions,
  };
}
