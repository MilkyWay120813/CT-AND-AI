import { Part1ChapterCurriculum } from '../types/part1Curriculum';

export const PART2_CHAPTERS_1_TO_2: Part1ChapterCurriculum[] = [
  // ============================================================================
  // PART II · CHAPTER 1: FRACTIONS IN DISGUISE
  // ============================================================================
  {
    chapterId: 'ch4-fractions-disguise',
    chapterIndex: 1,
    chapterBadgeLabel: 'Ganita Prakash Part II · Chapter 1',
    title: 'Fractions in Disguise',
    heroRibbonText: 'Ganita Prakash Class 8 · Part II Master Curriculum',
    heroSubtitle:
      'Uncover percentages ("per cent" = per 100) from Kautilya’s Arthaśhāstra to modern finance: master the FDP Trio, mental percentage splits, KYC food labels, inflation, sequential discounts, GST, and compound growth.',
    pdfCode: 'Part II · Ch 1',
    pdfUrl: '/assets/aistudio/1.-FRACTIONS-IN-DISGUISE_86cfb50d.pdf',
    heroBgGradient: 'from-[#0F3828] via-[#134E3A] to-[#0D2E22]',
    accentColor: '#10B981',
    challengeBannerTitle: 'Are you ready for the Market Tycoon & Compound Growth Challenge?',
    challengeBannerSubtitle:
      'Run a retail store, manage profit margins, offer sequential discounts, explore the Global Economic Sandbox, and complete the 20-Question Assessment.',
    modules: [
      {
        id: 'p2-mod-1-1',
        moduleCode: 'Module 1.1',
        shortNumber: '1.1',
        title: 'Fractions as Percentages & FDP Trio',
        cardHeadline: 'Fractions as Percentages & FDP Trio',
        cardTeaser:
          'Explore "per cent" (per 100), historical context from Kautilya’s Arthashastra, and dynamically convert between Fractions, Decimals, and Percentages.',
        artworkTheme: 'photo-scale',
        videoCue: {
          title: '3-Minute Intro to "Per Cent", Kautilya’s Arthashastra & the FDP Trio',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Trace how ancient Indian texts like Kautilya’s Arthashastra measured interest and taxes per 100 (śatam), and see how any fraction transforms into a decimal and a percentage.',
          readingParagraphs: [
            'The phrase "per cent" comes from Latin per centum ("for every hundred"), matching the ancient Indian tradition in Kautilya’s Arthashastra where interest and trade duties were stated per hundred (śatam).',
            'Every percentage is a fraction in disguise with denominator 100: p% = p/100. Thus 75% = 75/100 = 3/4 = 0.75.',
            'Mastering the FDP Trio (Fraction ↔ Decimal ↔ Percentage) lets you switch representations effortlessly: multiply a fraction by 100% to get its percentage, or divide a percentage by 100 to recover its simplest fraction.',
          ],
          keyTakeaways: [
            'p% means p parts out of every 100 equal parts: p% = p / 100.',
            'To convert a fraction a/b to a percentage, compute (a / b) × 100%.',
            'Benchmark FDP equivalents: 1/2 = 50%, 1/4 = 25%, 3/4 = 75%, 1/5 = 20%, 1/8 = 12.5%.',
          ],
          workedExample: {
            problem: 'Convert the fraction 3/8 into an exact decimal and percentage.',
            steps: [
              'Divide 3 by 8 or scale the denominator to 1,000: 3/8 = (3 × 125) / 1000 = 375/1000 = 0.375.',
              'Multiply the decimal 0.375 by 100% to shift the decimal point two places right.',
              'Result: 3/8 = 0.375 = 37.5%.',
            ],
            answer: '3/8 = 0.375 = 37.5%',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Kautilya’s Arthashastra & Per Cent (Out of 100)',
              narration:
                'Long before the % symbol, Kautilya’s Arthashastra expressed interest and taxes per hundred coins. A percentage is simply a fraction standardized to a denominator of 100.',
              boardFormula: 'p% = p / 100 · Arthashastra Śatam (Per 100)',
              visualCaption: '10×10 hundred-grid lighting up 75 golden cells for 75% = 3/4',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'The FDP Trio Transformation Bridge',
              narration:
                'Watch 3/4 expand by ×25/25 into 75/100, which reads directly as the decimal 0.75 and the percentage 75%.',
              boardFormula: '3/4 = 75/100 = 0.75 = 75%',
              visualCaption: 'Fraction bar 3/4 subdividing into 75/100 and 0.75',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Eighths, Fifths, and Thirds Benchmarks',
              narration:
                'Since 1/4 is 25%, half of that is 1/8 = 12.5%, so 3/8 = 37.5% and 5/8 = 62.5%.',
              boardFormula: '1/8 = 12.5% · 1/3 ≈ 33.33% · 1/5 = 20%',
              visualCaption: 'Proportional number line aligning fractions, decimals, and percentages',
            },
          ],
        },
        simulation: {
          title: 'FDP Slider Scale',
          description:
            'Dynamically drag numerator and denominator sliders (e.g. 3/4) and instantly watch the fraction transform into its decimal (0.75) and percentage (75%).',
          interactionType: 'aspect-ratio-scaler',
          defaultControlA: 3,
          defaultControlB: 4,
          controlALabel: 'Numerator (a)',
          controlAMin: 1,
          controlAMax: 20,
          controlBLabel: 'Denominator (b)',
          controlBMin: 1,
          controlBMax: 20,
          formulaHighlight: 'a / b = Decimal = (a / b) × 100%',
        },
        game: {
          title: 'Percentage Matchmaker',
          subtitle: 'Quickly match fraction blocks to their exact percentage buckets before time runs out!',
          rules: 'Select the matching percentage and decimal pair for each fraction.',
          challenges: [
            {
              prompt: 'Which percentage and decimal pair matches the fraction 5/8?',
              clue: '1/8 = 12.5%, so multiply 12.5% by 5.',
              options: ['62.5% and 0.625', '58% and 0.58', '65% and 0.65', '37.5% and 0.375'],
              correctIndex: 0,
              explanation: '5/8 = 5 × 0.125 = 0.625 = 62.5%.',
            },
            {
              prompt: 'What is 0.085 expressed as a percentage and a simplified fraction?',
              clue: 'Multiply by 100 to get the percentage, and write 85/1000 in lowest terms.',
              options: ['8.5% and 17/200', '85% and 17/20', '0.85% and 85/100', '8.5% and 17/100'],
              correctIndex: 0,
              explanation: '0.085 × 100% = 8.5%, and 85/1000 ÷ 5/5 = 17/200.',
            },
            {
              prompt: 'In a mixture where millet to water is in the ratio 2 : 3, what percentage of the total mixture is millet?',
              clue: 'Total parts = 2 + 3 = 5.',
              options: ['40%', '66.67%', '20%', '60%'],
              correctIndex: 0,
              explanation: 'Millet is 2 out of 5 total parts: (2/5) × 100% = 40%.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-1-2',
        moduleCode: 'Module 1.2',
        shortNumber: '1.2',
        title: 'Percentage of a Quantity & Free-Hand Computations',
        cardHeadline: 'Percentage of a Quantity & Free-Hand Computations',
        cardTeaser:
          'Calculate percentages of real-world quantities (like sugar content in biscuits) using 10%/5%/1% decomposing blocks and the x% of y = y% of x symmetry shortcut.',
        artworkTheme: 'coffee-mixer',
        videoCue: {
          title: '3-Minute Video on Real-World Quantities & Mental Math Shortcuts',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Learn how to decompose any percentage into effortless 10%, 5%, and 1% mental blocks and use the commutative law x% of y = y% of x.',
          readingParagraphs: [
            'To find 35% of a 240 g biscuit pack without a calculator, break 35% into 10% + 10% + 10% + 5%. Since 10% of 240 g is 24 g and 5% is half of that (12 g), 35% is 3(24) + 12 = 84 g!',
            'Even faster: because (x/100) × y = (y/100) × x, we always have x% of y = y% of x. Thus 16% of 25 is identical to 25% of 16 = 4!',
          ],
          keyTakeaways: [
            '10% of N = N ÷ 10; 1% of N = N ÷ 100; 5% is half of 10%.',
            'Commutative Percentage Law: x% of y = y% of x.',
            'If k% of a whole W is known, you can scale directly to find 100% (W) or any other percentage.',
          ],
          workedExample: {
            problem: 'Compute 15% of ₹640 mentally, and find 28% of 50 using symmetry.',
            steps: [
              'For 15% of 640: 10% of 640 = 64, and 5% of 640 = 32. Add them: 64 + 32 = ₹96.',
              'For 28% of 50: flip to 50% of 28 = half of 28 = 14.',
            ],
            answer: '15% of ₹640 = ₹96 · 28% of 50 = 14',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Decomposing into 10%, 5%, and 1% Building Blocks',
              narration:
                'Every percentage can be built from 10% and 1% blocks. To find 15% of 640, take 10% (64) plus 5% (32) to get 96 in two seconds.',
              boardFormula: '15% of 640 = 10%(64) + 5%(32) = 96',
              visualCaption: 'Proportional bar model splitting 100% into 10% and 5% blocks',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'The Symmetry Shortcut: x% of y = y% of x',
              narration:
                'Why struggle with 36% of 25 when you can flip it to 25% of 36? One-quarter of 36 is immediately 9!',
              boardFormula: 'x% of y = (x·y)/100 = y% of x',
              visualCaption: 'Balance beam swapping x and y across the % sign',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Reconstructing the Whole from a Part',
              narration:
                'If 40% of a journey is 92 km, then 20% is 46 km, and the full 100% journey is 5 × 46 = 230 km.',
              boardFormula: '40% = 92 km ⇒ 20% = 46 km ⇒ 100% = 230 km',
              visualCaption: 'Five 20% highway segments of 46 km locking together',
            },
          ],
        },
        simulation: {
          title: 'Proportional Bar Model',
          description:
            'Adjust the total quantity and target percentage sliders to see 10%, 5%, and 1% partitions scale live.',
          interactionType: 'recipe-mixer',
          defaultControlA: 35,
          defaultControlB: 240,
          controlALabel: 'Percentage (p%)',
          controlAMin: 5,
          controlAMax: 100,
          controlBLabel: 'Total Quantity (W)',
          controlBMin: 50,
          controlBMax: 500,
          formulaHighlight: 'p% of W = (p / 100) × W',
        },
        game: {
          title: 'Mental Math Sprint',
          subtitle: 'Compute 10%, 20%, 25%, and 50% of quantities instantly without pen and paper!',
          rules: 'Use block decomposition and x% of y = y% of x to answer rapidly.',
          challenges: [
            {
              prompt: 'Mentally compute 32% of 25:',
              clue: 'Flip it to 25% of 32!',
              options: ['8', '6', '12', '9'],
              correctIndex: 0,
              explanation: '32% of 25 = 25% of 32 = (1/4) × 32 = 8.',
            },
            {
              prompt: 'A 150 g biscuit packet contains 22% sugar. How many grams of sugar is that?',
              clue: '20% of 150 is 30 g, and 2% of 150 is 3 g.',
              options: ['33 g', '30 g', '28 g', '35 g'],
              correctIndex: 0,
              explanation: '22% of 150 = 20%(30) + 2%(3) = 33 g.',
            },
            {
              prompt: 'If 30% of a number is 45, what is 90% of that same number?',
              clue: '90% is 3 times 30%.',
              options: ['135', '150', '120', '90'],
              correctIndex: 0,
              explanation: 'Since 90% = 3 × 30%, 90% of the number is 3 × 45 = 135.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-1-3',
        moduleCode: 'Module 1.3',
        shortNumber: '1.3',
        title: 'Percentages Greater than 100 & Estimations',
        cardHeadline: 'Percentages Greater than 100 & Estimations',
        cardTeaser:
          'Understand when percentages exceed 100% (harvest growth, sales targets, multiples of base values) and use smart estimation before calculating.',
        artworkTheme: 'population',
        videoCue: {
          title: '3-Minute Video on Percentages Over 100% and Prior Estimation',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'See why 200% means twice the base value, 250% means 2.5 times the base value, and how rounding to friendly benchmarks catches calculation blunders.',
          readingParagraphs: [
            'Can a percentage be greater than 100%? When referring to a part of a single fixed whole (like share of students in a room), 100% is the ceiling. But when comparing a new quantity against an original baseline (like rainfall or store sales), 150% means 1.5 times the baseline, and 300% means 3 times the baseline!',
            'Before computing an exact percentage like 48.7% of 812, estimate first: 50% of 800 is 400, so the exact answer must sit very close to 400.',
          ],
          keyTakeaways: [
            '100% = 1 × Base; 200% = 2 × Base; 250% = 2.5 × Base.',
            'Percentages > 100% occur when comparing a larger quantity to a smaller reference base.',
            'Always bracket messy percentages between friendly benchmarks (like 25%, 50%, 75%) first.',
          ],
          workedExample: {
            problem: 'A bakery’s festive sales reached 225% of its normal daily goal of ₹8,000. Find the festive sales.',
            steps: [
              'Split 225% into 200% + 25%.',
              '200% of ₹8,000 = 2 × ₹8,000 = ₹16,000.',
              '25% of ₹8,000 = (1/4) × ₹8,000 = ₹2,000. Total = ₹16,000 + ₹2,000 = ₹18,000.',
            ],
            answer: '₹18,000 (2.25 times the ₹8,000 goal)',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'When Can Percentages Exceed 100%?',
              narration:
                'You cannot eat 150% of one pizza, but a factory can produce 150% of last month’s output—meaning 1.5 times as much!',
              boardFormula: '150% = 1.5 × Base · 250% = 2.5 × Base',
              visualCaption: 'Sales bar overflowing past the 100% mark up to 250%',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Multiples as Percentages: 200%, 300%, 400%',
              narration:
                'Every additional 100% adds one full copy of the base quantity.',
              boardFormula: 'k × 100% = k copies of the base quantity',
              visualCaption: 'Stacked 100% blocks building 225% = 100% + 100% + 25%',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'The Power of Prior Estimation',
              narration:
                'To estimate 295 / 598 as a percentage, notice it is almost 300 / 600 = 50%!',
              boardFormula: '295 / 598 ≈ 300 / 600 = 50% (Exact: 49.33%)',
              visualCaption: 'Estimation caliper locking near the 50% benchmark',
            },
          ],
        },
        simulation: {
          title: 'Target Sales Overflow Bar',
          description:
            'Push daily sales past 100% (up to 250%) to visualize how percentages above 100% represent multiples of the base target.',
          interactionType: 'population-slider',
          defaultControlA: 175,
          defaultControlB: 400,
          controlALabel: 'Achievement Percentage (p%)',
          controlAMin: 50,
          controlAMax: 250,
          controlBLabel: 'Base Target (T)',
          controlBMin: 100,
          controlBMax: 1000,
          formulaHighlight: 'Value = (p / 100) × Base Target',
        },
        game: {
          title: 'Estimate First!',
          subtitle: 'Spot approximate percentage values and >100% multiples to win bonus points!',
          rules: 'Pick the closest estimate or exact >100% value.',
          challenges: [
            {
              prompt: 'What is 175% of 120?',
              clue: '175% = 100% (120) + 50% (60) + 25% (30).',
              options: ['210', '195', '180', '225'],
              correctIndex: 0,
              explanation: '120 + 60 + 30 = 210 (or 7/4 × 120 = 210).',
            },
            {
              prompt: 'Which is the best mental estimate for 19.8% of ₹495?',
              clue: 'Round 19.8% to 20% and ₹495 to ₹500.',
              options: ['Around ₹100', 'Around ₹50', 'Around ₹200', 'Around ₹150'],
              correctIndex: 0,
              explanation: '20% of ₹500 = (1/5) × 500 = ₹100 (exact value is ₹98.01).',
            },
            {
              prompt: 'If this year’s reservoir level is 360 liters compared to 150 liters last year, this year’s level is what percentage of last year’s?',
              clue: 'Compute (360 / 150) × 100%.',
              options: ['240%', '140%', '210%', '300%'],
              correctIndex: 0,
              explanation: '(360 / 150) × 100% = (12 / 5) × 100% = 240%.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-1-4',
        moduleCode: 'Module 1.4',
        shortNumber: '1.4',
        title: 'Comparing Proportions Using Percentages (KYC)',
        cardHeadline: 'Comparing Proportions Using Percentages (KYC)',
        cardTeaser:
          'Compare parts across different-sized wholes—from test scores to "Know Your Contents" (KYC) nutrition labels on food packets.',
        artworkTheme: 'hcf-ratio',
        videoCue: {
          title: '3-Minute Video on Comparing Different Wholes & KYC Nutrition Labels',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Why comparing raw grams on a 65 g snack vs. an 80 g snack is misleading, and how converting to percentages ("per 100 g") reveals the true winner.',
          readingParagraphs: [
            'Suppose Brand A has 13 g of protein in a 50 g bar, while Brand B has 18 g of protein in an 80 g bar. Raw grams (18 g > 13 g) can trick you because the packet sizes differ!',
            'Converting both to percentages standardizes them to a 100 g pack: Brand A is (13/50) × 100% = 26% protein, whereas Brand B is (18/80) × 100% = 22.5% protein. Brand A is actually richer in protein!',
          ],
          keyTakeaways: [
            'Percentages standardize different-sized wholes to a common denominator of 100.',
            'Share % = (Part / Whole) × 100%.',
            'Always check the serving size (Whole) when reading Know Your Contents (KYC) food labels.',
          ],
          workedExample: {
            problem: 'Riya scored 36/40 in Science and 44/50 in Mathematics. In which subject did she perform better proportionally?',
            steps: [
              'Science percentage: (36 / 40) × 100% = (9 / 10) × 100% = 90%.',
              'Mathematics percentage: (44 / 50) × 100% = 88%.',
              'Since 90% > 88%, her proportional score is higher in Science.',
            ],
            answer: 'Science (90% vs. 88% in Mathematics)',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Why Raw Counts Can Mislead When Wholes Differ',
              narration:
                'Scoring 44 marks sounds better than 36 marks—until you see that 36 was out of 40 (90%) while 44 was out of 50 (88%)!',
              boardFormula: '36/40 = 90%  >  44/50 = 88%',
              visualCaption: 'Two test bars scaling to a common 100% ruler',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Know Your Contents (KYC): Inspecting Food Labels',
              narration:
                'On nutrition labels, "Per 100 g" is literally the percentage composition of sugar, protein, and dietary fiber.',
              boardFormula: '% Ingredient = (Grams of Ingredient ÷ Pack Weight) × 100%',
              visualCaption: 'Two snack packages side by side with % composition bars',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Ranking Proportions Instantly',
              narration:
                'Once converted to percentages, any number of products or test scores can be ranked on the same 0–100 scale.',
              boardFormula: 'Brand A: 13/50 = 26%  vs  Brand B: 18/80 = 22.5%',
              visualCaption: 'Concentration meters locking onto 26% vs 22.5%',
            },
          ],
        },
        simulation: {
          title: 'Food Label Inspector (KYC Analyzer)',
          description:
            'Adjust nutrient weight and total packet weight to compare ingredient breakdown percentages across competing packages.',
          interactionType: 'hcf-reducer',
          defaultControlA: 13,
          defaultControlB: 50,
          controlALabel: 'Nutrient Grams (Part)',
          controlAMin: 1,
          controlAMax: 50,
          controlBLabel: 'Total Packet Weight (Whole)',
          controlBMin: 20,
          controlBMax: 200,
          formulaHighlight: 'Nutrient % = (Part ÷ Whole) × 100%',
        },
        game: {
          title: 'Proportion Duel',
          subtitle: 'Determine which student or food product has the higher proportional share!',
          rules: 'Convert both fractions to percentages to crown the winner.',
          challenges: [
            {
              prompt: 'Snack X has 15 g of oats in a 60 g pack. Snack Y has 18 g of oats in an 80 g pack. Which has a higher percentage of oats?',
              clue: 'Compare 15/60 vs 18/80.',
              options: [
                'Snack X (25% vs 22.5%)',
                'Snack Y (22.5% vs 20%)',
                'Both are equal at 25%',
                'Snack Y because 18 g > 15 g',
              ],
              correctIndex: 0,
              explanation: 'Snack X = 15/60 = 1/4 = 25%, whereas Snack Y = 18/80 = 9/40 = 22.5%.',
            },
            {
              prompt: 'Batch A of lemonade uses 3 lemons in 12 cups. Batch B uses 4 lemons in 20 cups. Which batch is tangier?',
              clue: 'Compare 3/12 vs 4/20.',
              options: ['Batch A (25% vs 20%)', 'Batch B (20% vs 15%)', 'Equal tanginess', 'Batch B'],
              correctIndex: 0,
              explanation: 'Batch A = 3/12 = 25%, while Batch B = 4/20 = 20%.',
            },
            {
              prompt: 'Arjun made 14 out of 20 free throws; Kabir made 18 out of 25. Who had the higher shooting percentage?',
              clue: '14/20 = 70%; 18/25 = 72%.',
              options: ['Kabir (72% vs 70%)', 'Arjun (70% vs 68%)', 'Tied at 70%', 'Arjun'],
              correctIndex: 0,
              explanation: 'Arjun = 70%, while Kabir = (18 × 4)/100 = 72%.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-1-5',
        moduleCode: 'Module 1.5',
        shortNumber: '1.5',
        title: 'Percentage Increase, Decrease, & Inflation',
        cardHeadline: 'Percentage Increase, Decrease, & Inflation',
        cardTeaser:
          'Master the universal percentage change formula ((Change ÷ Original Base) × 100%), track commodity inflation, and expose the +20% / -20% asymmetry trap.',
        artworkTheme: 'metric-units',
        videoCue: {
          title: '3-Minute Video on Percentage Change, Base Value & Inflation',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Learn why percentage increase and decrease ALWAYS divide by the original starting value, and why a 20% rise followed by a 20% drop leaves you at 96%, not 100%!',
          readingParagraphs: [
            'Whenever a quantity changes from an Original Base (B) to a New Value (N), the Percentage Change is ((|N - B|) / B) × 100%. The denominator is ALWAYS the chronological starting value B!',
            'Notice the asymmetry: if a ₹100 item rises by 20% to ₹120, and then drops by 20%, the 20% drop is taken on ₹120 (which is ₹24), bringing the price to ₹96—a net 4% loss!',
          ],
          keyTakeaways: [
            '% Change = (Change ÷ Original Base) × 100%.',
            'New Value after +p% increase = Base × (1 + p/100).',
            'A +p% increase followed by a -p% decrease always results in a net decrease of (p²/100)%.',
          ],
          workedExample: {
            problem: 'The price of a liter of milk rose from ₹50 to ₹62. Find the percentage increase (inflation rate).',
            steps: [
              'Find the absolute increase: Change = ₹62 − ₹50 = ₹12.',
              'Divide by the original base price (₹50) and multiply by 100%: (12 / 50) × 100%.',
              'Result: 12 × 2% = 24% increase.',
            ],
            answer: '24% increase',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Always Divide by the Original Base!',
              narration:
                'When a price jumps from ₹50 to ₹62, the ₹12 change is measured against the starting ₹50—giving a 24% increase.',
              boardFormula: '% Change = (Change ÷ Original Base) × 100%',
              visualCaption: 'Price gauge rising from ₹50 to ₹62 (+24%)',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Why +50% (80→120) Reverses via −33.33% (120→80)',
              narration:
                'Going from 80 to 120 is +40 on 80 (+50%). Going back from 120 to 80 is −40 on 120 (−33.33%) because the base changed!',
              boardFormula: '80 → 120 is +50% · 120 → 80 is −33.33%',
              visualCaption: 'Two-way arrow highlighting different denominators 80 vs 120',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'The Up-Then-Down Multiplier Trap',
              narration:
                'Increasing by 20% multiplies by 1.20; decreasing by 20% multiplies by 0.80. Together, 1.20 × 0.80 = 0.96 (96%, or 4% less!).',
              boardFormula: '1.20 × 0.80 = 0.96 ⇒ Net 4% Decrease',
              visualCaption: 'Multiplier chain 100 → 120 → 96',
            },
          ],
        },
        simulation: {
          title: 'Price Timeline & Inflation Slider',
          description:
            'Track commodity price changes from base year to present day and calculate exact percentage increase or decrease.',
          interactionType: 'unit-converter',
          defaultControlA: 50,
          defaultControlB: 65,
          controlALabel: 'Base Year Price (₹)',
          controlAMin: 20,
          controlAMax: 200,
          controlBLabel: 'Current Year Price (₹)',
          controlBMin: 20,
          controlBMax: 250,
          formulaHighlight: '% Change = ((Current − Base) ÷ Base) × 100%',
        },
        game: {
          title: 'Inflation Tracker',
          subtitle: 'Compute percentage increases, decreases, and sequential changes!',
          rules: 'Always check which number is the original starting base.',
          challenges: [
            {
              prompt: 'A town’s daily water usage dropped from 80,000 L to 68,000 L. What is the percentage decrease?',
              clue: 'Change = 12,000 L; Base = 80,000 L.',
              options: ['15% decrease', '12% decrease', '17.6% decrease', '20% decrease'],
              correctIndex: 0,
              explanation: '(12,000 / 80,000) × 100% = (3 / 20) × 100% = 15% decrease.',
            },
            {
              prompt: 'A stock rises by 10% on Monday and falls by 10% on Tuesday. Compared to Monday morning, the stock is:',
              clue: '1.10 × 0.90 = 0.99.',
              options: ['Down by 1%', 'Unchanged (0%)', 'Up by 1%', 'Down by 2%'],
              correctIndex: 0,
              explanation: '100 → 110 → 99, which is a net 1% decrease.',
            },
            {
              prompt: 'Onion prices increased by 25% to reach ₹100/kg. What was the original price before the increase?',
              clue: '125% of Original = ₹100.',
              options: ['₹80/kg', '₹75/kg', '₹85/kg', '₹90/kg'],
              correctIndex: 0,
              explanation: 'Original = 100 ÷ 1.25 = ₹80/kg (check: ₹80 + 25% of ₹80 = ₹80 + ₹20 = ₹100).',
            },
          ],
        },
      },
      {
        id: 'p2-mod-1-6',
        moduleCode: 'Module 1.6',
        shortNumber: '1.6',
        title: 'Profit, Loss, Marked Price, & Discounts',
        cardHeadline: 'Profit, Loss, Marked Price, & Discounts',
        cardTeaser:
          'Connect Cost Price (CP), Marked Price (MP), and Selling Price (SP): master profit/loss on CP, discounts on MP, and sequential retail offers.',
        artworkTheme: 'profit-share',
        videoCue: {
          title: '3-Minute Video on CP, MP, SP, Profit Margins & Retail Discounts',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Follow a winter jacket from factory Cost Price (CP) to showroom Marked Price (MP) to discounted Selling Price (SP), and see which base each percentage uses.',
          readingParagraphs: [
            'In commerce, two different base prices govern percentages: Profit% and Loss% are ALWAYS calculated on Cost Price (CP), whereas Discount% is ALWAYS calculated on Marked Price (MP, the price printed on the tag).',
            'When a shop advertises "50% + 20% off", the discounts apply successively: first multiply MP by 0.50, then multiply that reduced price by 0.80, giving 0.40 × MP (an effective 60% discount, not 70%!).',
          ],
          keyTakeaways: [
            'Profit % = ((SP − CP) ÷ CP) × 100%; Loss % = ((CP − SP) ÷ CP) × 100%.',
            'Discount is subtracted from Marked Price: SP = MP × (1 − Discount%/100).',
            'Successive discounts d₁% and d₂% multiply: SP = MP × (1 − d₁/100) × (1 − d₂/100).',
          ],
          workedExample: {
            problem: 'A shopkeeper buys a sweater for CP = ₹500, marks it up by 40% to set the Marked Price (MP), and gives a 10% discount on MP. Find SP and Profit%.',
            steps: [
              'Marked Price MP = ₹500 × 1.40 = ₹700.',
              'Selling Price SP after 10% discount on ₹700 = ₹700 × 0.90 = ₹630.',
              'Profit = ₹630 − ₹500 = ₹130. Profit % = (130 / 500) × 100% = 26%.',
            ],
            answer: 'SP = ₹630 · Net Profit = 26%',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'The Three Price Tags: CP → MP → SP',
              narration:
                'Cost Price (CP) is what the merchant pays. Marked Price (MP) is printed on the label. Selling Price (SP) is what the customer pays after discount.',
              boardFormula: 'CP (Markup) → MP (Discount) → SP',
              visualCaption: 'Supply chain bridge connecting CP ₹500 → MP ₹700 → SP ₹630',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Profit/Loss Uses CP; Discount Uses MP',
              narration:
                'Never mix up the denominators: Profit% divides by CP, while Discount% divides by MP.',
              boardFormula: 'Profit% = (Profit / CP) × 100% · Discount% = (Discount / MP) × 100%',
              visualCaption: 'Two color-coded badges locking Profit to CP and Discount to MP',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Decoding Successive Discounts (30% + 20% Off)',
              narration:
                '30% off leaves 70% of the price; another 20% off leaves 80% of that 70%, which is 0.70 × 0.80 = 56% paid (44% total discount).',
              boardFormula: '0.70 × 0.80 = 0.56 ⇒ 44% Effective Discount',
              visualCaption: 'Price bar shrinking first to 70% then to 56%',
            },
          ],
        },
        simulation: {
          title: 'Supply Chain Pricing Model (CP → MP → SP)',
          description:
            'Adjust markup % and discount % sliders to trace a garment’s price from Cost Price to Marked Price to final Selling Price.',
          interactionType: 'ratio-sharer',
          defaultControlA: 40,
          defaultControlB: 10,
          controlALabel: 'Markup % above CP',
          controlAMin: 10,
          controlAMax: 100,
          controlBLabel: 'Discount % off MP',
          controlBMin: 0,
          controlBMax: 50,
          formulaHighlight: 'SP = CP × (1 + Markup/100) × (1 − Discount/100)',
        },
        game: {
          title: 'Bargain Master',
          subtitle: 'Calculate net selling prices and profit margins after markups and consecutive discounts!',
          rules: 'Apply each percentage to its proper base price.',
          challenges: [
            {
              prompt: 'A backpack with Marked Price ₹1,000 is sold with successive discounts of 30% and 20%. What is the final Selling Price?',
              clue: 'Multiply ₹1,000 × 0.70 × 0.80.',
              options: ['₹560', '₹500', '₹600', '₹540'],
              correctIndex: 0,
              explanation: 'After 30% off: ₹700. After 20% off ₹700: ₹700 × 0.80 = ₹560.',
            },
            {
              prompt: 'A book bought for CP = ₹250 is sold for SP = ₹310. What is the profit percentage?',
              clue: 'Profit = ₹60; divide by CP = ₹250.',
              options: ['24%', '19.35%', '20%', '25%'],
              correctIndex: 0,
              explanation: '(60 / 250) × 100% = 24% profit.',
            },
            {
              prompt: 'If a merchant marks goods 50% above CP and gives a 20% discount, what is the net profit percentage?',
              clue: '1.50 × 0.80 = 1.20.',
              options: ['20% profit', '30% profit', '25% profit', '15% profit'],
              correctIndex: 0,
              explanation: 'SP = 1.50 × 0.80 × CP = 1.20 × CP, which is a 20% net profit.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-1-7',
        moduleCode: 'Module 1.7',
        shortNumber: '1.7',
        title: 'Taxes, Growth, Compounding, & Depreciation',
        cardHeadline: 'Taxes, Growth, Compounding, & Depreciation',
        cardTeaser:
          'Compute GST invoice totals, contrast linear Simple Interest against exponential Compound Interest P(1 + r/100)^t, and model asset depreciation.',
        artworkTheme: 'global-market',
        videoCue: {
          title: '3-Minute Video on GST, Simple vs. Compound Interest & Depreciation',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'See why Simple Interest adds the same fixed amount every year while Compound Interest earns "interest on interest" via P(1 + r/100)^t.',
          readingParagraphs: [
            'Goods and Services Tax (GST) is added to the sale price at checkout: Final Bill = Sale Price × (1 + GST%/100).',
            'Under Simple Interest (SI), interest is computed only on the original Principal P every year: A = P + (P·r·t)/100 (linear growth). Under Compound Interest (CI), each year’s interest is added to the principal for the next year: A = P(1 + r/100)^t (exponential growth).',
            'When machinery or vehicles lose value at r% per year, we use the depreciation multiplier: Value = P(1 − r/100)^t.',
          ],
          keyTakeaways: [
            'Simple Interest: SI = (P × r × t) / 100; Total Amount = P + SI.',
            'Compound Interest Amount: A = P × (1 + r/100)^t.',
            'Depreciation after t years: V = P × (1 − r/100)^t.',
          ],
          workedExample: {
            problem: 'Compare Simple Interest vs. Compound Interest on P = ₹10,000 at r = 10% per annum for t = 2 years.',
            steps: [
              'Simple Interest for 2 years: SI = (10,000 × 10 × 2) / 100 = ₹2,000 ⇒ Amount = ₹12,000.',
              'Compound Amount for 2 years: A = 10,000 × (1.10)² = 10,000 × 1.21 = ₹12,100.',
              'Compound Interest earns ₹100 extra (which is 10% interest on Year 1’s ₹1,000 interest!).',
            ],
            answer: 'SI Amount = ₹12,000 vs. CI Amount = ₹12,100 (Difference = ₹100)',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Adding GST on a Retail Invoice',
              narration:
                'An 18% GST on a ₹2,000 appliance adds 18% of ₹2,000 = ₹360, making the total bill ₹2,360.',
              boardFormula: 'Final Bill = Price × (1 + GST% / 100)',
              visualCaption: 'Invoice breakdown showing Base ₹2,000 + 18% GST (₹360) = ₹2,360',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Simple Interest (Linear) vs. Compound Interest (Exponential)',
              narration:
                'Simple interest climbs by equal steps P·(r/100) each year. Compound interest multiplies by (1 + r/100) each year, curving upward!',
              boardFormula: 'SI: P(1 + rt/100)  vs  CI: P(1 + r/100)^t',
              visualCaption: 'Exponential CI curve pulling away from the straight SI line',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Asset Depreciation: P(1 − r/100)^t',
              narration:
                'A scooter worth ₹50,000 depreciating at 10% per year is worth 50,000 × 0.90 × 0.90 = ₹40,500 after 2 years.',
              boardFormula: 'V(t) = P × (1 − r/100)^t',
              visualCaption: 'Value bars stepping down by ×0.90 each year',
            },
          ],
        },
        simulation: {
          title: 'Compound Growth vs. Simple Interest Curve',
          description:
            'Compare linear Simple Interest against exponential Compound Interest over time for any rate r% and duration t years.',
          interactionType: 'market-proportionality-lab',
          defaultControlA: 12,
          defaultControlB: 8,
          controlALabel: 'Annual Interest Rate (r%)',
          controlAMin: 4,
          controlAMax: 25,
          controlBLabel: 'Time Horizon (t years)',
          controlBMin: 1,
          controlBMax: 15,
          formulaHighlight: 'CI = P(1 + r/100)^t − P  vs  SI = P·r·t / 100',
        },
        game: {
          title: 'Tax & Interest Wizard',
          subtitle: 'Compute GST bills, compound maturity values, and depreciated asset values!',
          rules: 'Choose the exact final amount for each financial scenario.',
          challenges: [
            {
              prompt: 'What is the final bill for a ₹1,500 restaurant meal with 5% GST added?',
              clue: '5% of 1,500 = 75.',
              options: ['₹1,575', '₹1,550', '₹1,625', '₹1,505'],
              correctIndex: 0,
              explanation: '₹1,500 + 5% of ₹1,500 = ₹1,500 + ₹75 = ₹1,575.',
            },
            {
              prompt: 'Find the total amount after 2 years if ₹5,000 is invested at 20% p.a. compounded annually:',
              clue: 'Multiply ₹5,000 × 1.20 × 1.20.',
              options: ['₹7,200', '₹7,000', '₹6,800', '₹7,500'],
              correctIndex: 0,
              explanation: '5,000 × (1.20)² = 5,000 × 1.44 = ₹7,200.',
            },
            {
              prompt: 'A laptop bought for ₹40,000 depreciates by 10% each year. What is its value after 2 years?',
              clue: 'Multiply ₹40,000 × 0.90 × 0.90.',
              options: ['₹32,400', '₹32,000', '₹36,000', '₹30,000'],
              correctIndex: 0,
              explanation: '40,000 × 0.81 = ₹32,400.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-1-8',
        moduleCode: 'Module 1.8',
        shortNumber: '1.8',
        title: 'Chapter Assessment & Questionnaire',
        cardHeadline: 'Market Tycoon & Compound Growth Capstone',
        cardTeaser:
          'Synthesize the FDP Trio, profit/loss, sequential discounts, GST, and compounding in the Global Economic Sandbox, Market Tycoon Big Game, and 20-Question Exam.',
        isWrapUpModule: true,
        artworkTheme: 'master-boss',
        videoCue: {
          title: '3-Minute Chapter 1 Review: Percentages, Retail Pricing & Compounding',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Review every formula from Chapter 1 (Fractions in Disguise) before launching the Market Tycoon Big Game and randomized 20-Question Assessment.',
          readingParagraphs: [
            'Across Modules 1.1 to 1.7, we saw that every percentage problem comes down to identifying the right Base (100%) and applying the right multiplier (1 ± r/100).',
            'Launch the Global Economic & Inflation Sandbox below, play the Market Tycoon & Compound Growth Challenge, and test your mastery in the 20-Question Chapter Assessment!',
          ],
          keyTakeaways: [
            'Identify the Base first: Original value for % change, CP for profit/loss, MP for discount.',
            'Chain sequential percentage changes by multiplying factors: (1 ± r₁/100)(1 ± r₂/100).',
            'Compound growth/decay over t periods raises the multiplier to power t: P(1 ± r/100)^t.',
          ],
          workedExample: {
            problem: 'An item with CP = ₹800 is marked up by 50%, given a 20% discount, and then taxed at 10% GST. Find the customer’s final price.',
            steps: [
              'Marked Price MP = ₹800 × 1.50 = ₹1,200.',
              'Discounted Selling Price SP = ₹1,200 × 0.80 = ₹960.',
              'Final Price with 10% GST = ₹960 × 1.10 = ₹1,056.',
            ],
            answer: '₹1,056 (Store SP = ₹960, Store Profit = 20%)',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Master Multiplier Map of Chapter 1',
              narration:
                'Every percentage operation is a clean multiplier: +p% is ×(1 + p/100) and −p% is ×(1 − p/100).',
              boardFormula: 'Final = Base × ∏ (1 ± r_k / 100)',
              visualCaption: 'Flowchart linking FDP, CP→MP→SP, GST, and Compounding',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Avoiding the Three Classic Percentage Traps',
              narration:
                'Never add sequential discounts, never divide profit by SP, and never confuse simple interest with compounding.',
              boardFormula: 'Base Check: CP for Profit · MP for Discount · P(1+r)^t for CI',
              visualCaption: 'Three green check shields verifying correct bases',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Market Tycoon & 20-Question Assessment Ready',
              narration:
                'You are ready to run the Global Economic Sandbox, conquer Market Tycoon, and ace the randomized quiz!',
              boardFormula: 'Chapter 1 Mastery Seal Unlocked',
              visualCaption: 'Golden Market Tycoon emblem illuminating on the board',
            },
          ],
        },
        simulation: {
          title: 'Global Economic & Inflation Sandbox (Big Simulation)',
          isBigSimulation: true,
          description:
            'Simulate multi-year economic growth, retail pricing chains, compound interest, and depreciation across industries.',
          interactionType: 'grand-capstone-sim',
          defaultControlA: 15,
          defaultControlB: 10,
          controlALabel: 'Annual Growth / Markup Rate (%)',
          controlAMin: 5,
          controlAMax: 50,
          controlBLabel: 'Compounding Years / Discount (%)',
          controlBMin: 1,
          controlBMax: 20,
          formulaHighlight: 'A = P(1 + r/100)^t · SP = MP(1 − d/100)',
        },
        game: {
          title: 'Market Tycoon & Compound Growth Challenge (Big Game)',
          isBigGame: true,
          subtitle: 'Run a retail store, manage profit margins, offer discounts, and invest capital!',
          rules: 'Complete all three executive financial stages to earn the Market Tycoon Trophy.',
          challenges: [
            {
              prompt: 'Stage 1 (Retail Pricing): You buy headphones at CP = ₹1,000 and want a 20% net profit even after giving customers a 20% discount on MP. What Marked Price (MP) must you print?',
              clue: 'Target SP = ₹1,200, and 0.80 × MP = ₹1,200.',
              options: ['₹1,500', '₹1,400', '₹1,440', '₹1,600'],
              correctIndex: 0,
              explanation: 'Target SP = ₹1,200. Since SP = 0.80 × MP, MP = 1,200 ÷ 0.80 = ₹1,500.',
            },
            {
              prompt: 'Stage 2 (Treasury Compounding): You invest ₹20,000 of store profit at 10% p.a. compound interest for 3 years. How much total interest do you earn?',
              clue: '(1.10)³ = 1.331.',
              options: ['₹6,620', '₹6,000', '₹6,400', '₹6,200'],
              correctIndex: 0,
              explanation: 'Amount = 20,000 × 1.331 = ₹26,620 ⇒ Compound Interest = ₹6,620.',
            },
            {
              prompt: 'Stage 3 (GST Checkout): A customer buys a jacket with discounted SP = ₹2,500 plus 12% GST. What is the total invoice amount?',
              clue: '12% of ₹2,500 = 25 × 12 = ₹300.',
              options: ['₹2,800', '₹2,750', '₹2,850', '₹2,620'],
              correctIndex: 0,
              explanation: '₹2,500 + ₹300 GST = ₹2,800.',
            },
          ],
        },
      },
    ],
    questionnaire: [
      {
        id: 'p2-ch1-q1',
        questionNumber: 1,
        type: 'mcq',
        prompt: 'What is the fraction 7/8 expressed as an exact percentage?',
        options: ['87.5%', '78.5%', '82.5%', '85%'],
        correctIndex: 0,
        explanation: '7/8 = 7 × 12.5% = 87.5%.',
        moduleRef: 'Module 1.1',
      },
      {
        id: 'p2-ch1-q2',
        questionNumber: 2,
        type: 'mcq',
        prompt: 'Using the symmetry rule x% of y = y% of x, what is 28% of 25?',
        options: ['7', '6', '8', '7.5'],
        correctIndex: 0,
        explanation: '28% of 25 = 25% of 28 = (1/4) × 28 = 7.',
        moduleRef: 'Module 1.2',
      },
      {
        id: 'p2-ch1-q3',
        questionNumber: 3,
        type: 'mcq',
        prompt: 'If 40% of a journey is 120 km, what is the REMAINING 60% distance?',
        options: ['180 km', '300 km', '160 km', '200 km'],
        correctIndex: 0,
        explanation: '20% = 60 km, so the remaining 60% (three 20% blocks) is 3 × 60 = 180 km.',
        moduleRef: 'Module 1.2',
      },
      {
        id: 'p2-ch1-q4',
        questionNumber: 4,
        type: 'mcq',
        prompt: 'What is 225% of 80?',
        options: ['180', '160', '200', '175'],
        correctIndex: 0,
        explanation: '225% = 2.25 × 80 = 160 + 20 = 180.',
        moduleRef: 'Module 1.3',
      },
      {
        id: 'p2-ch1-q5',
        questionNumber: 5,
        type: 'mcq',
        prompt: 'Brand A has 12 g protein in a 60 g pack; Brand B has 16 g protein in a 100 g pack. Which has a higher protein percentage?',
        options: ['Brand A (20% vs 16%)', 'Brand B (16% vs 12%)', 'Both equal', 'Cannot be determined'],
        correctIndex: 0,
        explanation: 'Brand A = (12/60) × 100% = 20%, which exceeds Brand B’s 16%.',
        moduleRef: 'Module 1.4',
      },
      {
        id: 'p2-ch1-q6',
        questionNumber: 6,
        type: 'mcq',
        prompt: 'A salary increases from ₹25,000 to ₹30,000. What is the percentage increase?',
        options: ['20%', '16.67%', '25%', '15%'],
        correctIndex: 0,
        explanation: '(5,000 / 25,000) × 100% = 20%.',
        moduleRef: 'Module 1.5',
      },
      {
        id: 'p2-ch1-q7',
        questionNumber: 7,
        type: 'mcq',
        prompt: 'A price rises by 20% and then falls by 20%. The net percentage change is:',
        options: ['4% decrease', '0% (no change)', '4% increase', '2% decrease'],
        correctIndex: 0,
        explanation: '1.20 × 0.80 = 0.96, which is 4% below the original value.',
        moduleRef: 'Module 1.5',
      },
      {
        id: 'p2-ch1-q8',
        questionNumber: 8,
        type: 'mcq',
        prompt: 'An item with Marked Price ₹800 is sold at ₹680. What is the discount percentage?',
        options: ['15%', '12%', '17.6%', '20%'],
        correctIndex: 0,
        explanation: 'Discount = ₹120 on MP ₹800 ⇒ (120 / 800) × 100% = 15%.',
        moduleRef: 'Module 1.6',
      },
      {
        id: 'p2-ch1-q9',
        questionNumber: 9,
        type: 'mcq',
        prompt: 'Successive discounts of 20% and 10% on a Marked Price are equivalent to a single discount of:',
        options: ['28%', '30%', '25%', '27%'],
        correctIndex: 0,
        explanation: '0.80 × 0.90 = 0.72 of MP paid ⇒ 100% − 72% = 28% single discount.',
        moduleRef: 'Module 1.6',
      },
      {
        id: 'p2-ch1-q10',
        questionNumber: 10,
        type: 'mcq',
        prompt: 'What is the difference between Compound Interest and Simple Interest on ₹10,000 at 10% p.a. for 2 years?',
        options: ['₹100', '₹200', '₹0', '₹50'],
        correctIndex: 0,
        explanation: 'CI = ₹2,100 and SI = ₹2,000, so the difference is ₹100.',
        moduleRef: 'Module 1.7',
      },
    ],
  },

  // ============================================================================
  // PART II · CHAPTER 2: THE BAUDHAYANA-PYTHAGORAS THEOREM
  // ============================================================================
  {
    chapterId: 'ch5-baudhayana-pythagoras',
    chapterIndex: 2,
    chapterBadgeLabel: 'Ganita Prakash Part II · Chapter 2',
    title: 'The Baudhayana-Pythagoras Theorem',
    heroRibbonText: 'Ganita Prakash Class 8 · Part II Master Curriculum',
    heroSubtitle:
      'Journey to Baudhāyana’s Śulba-Sūtra (c. 800 BCE): double and combine squares using diagonals, trap √2 between tight decimal bounds, prove a² + b² = c², generate primitive triples, and solve Bhāskarāchārya’s Līlāvatī lotus puzzle.',
    pdfCode: 'Part II · Ch 2',
    pdfUrl: '/assets/aistudio/4.-EXPLORING-SOME-GEOMETRIC-THEMES_7ce5eee5.pdf',
    heroBgGradient: 'from-[#1E1B4B] via-[#312E81] to-[#0F172A]',
    accentColor: '#38BDF8',
    challengeBannerTitle: 'Are you ready for the Pythagorean Bridge Builder Challenge?',
    challengeBannerSubtitle:
      'Construct ancient fire-altar squares in the Śulba-Sūtra Tangram Studio, build truss bridges with Baudhāyana triples, and complete the 20-Question Assessment.',
    modules: [
      {
        id: 'p2-mod-2-1',
        moduleCode: 'Module 2.1',
        shortNumber: '2.1',
        title: 'Doubling and Halving Squares',
        cardHeadline: 'Doubling and Halving Squares (Dvikaraṇī)',
        cardTeaser:
          'Explore Baudhāyana’s Śulba-Sūtra (c. 800 BCE) method of constructing a square with double or half the area using the diagonal.',
        artworkTheme: 'square-diag',
        videoCue: {
          title: '3-Minute Video on Baudhāyana’s Diagonal Square Doubler (Dvikaraṇī)',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'See how Vedic altar builders constructed a square of exact area 2a² by drawing a new square directly on the diagonal of a side-a square.',
          readingParagraphs: [
            'In the Baudhāyana Śulba-Sūtra (c. 800 BCE), verse 1.96 states that the rope stretched across the diagonal of a square produces a square of twice the original area, calling the diagonal the dvikaraṇī ("doubler").',
            'When you slice a unit square along both diagonals into 4 congruent right triangles, two of those triangles make the original square, while four of them assemble around the diagonal to form a tilted square of twice the area!',
          ],
          keyTakeaways: [
            'A square drawn on the diagonal of a side-a square has area 2a².',
            'Joining the midpoints of the four sides of a square produces an inner tilted square of HALF the area (a²/2).',
            'Baudhāyana called the diagonal of a unit square dvikaraṇī ("that which doubles").',
          ],
          workedExample: {
            problem: 'A square altar has side length 6 m (area 36 m²). What is the area of the square constructed on its diagonal?',
            steps: [
              'By Baudhāyana’s dvikaraṇī rule, the square on the diagonal has area = 2 × (original area).',
              'Area of diagonal square = 2 × 36 m² = 72 m².',
              'Its side length is √72 = 6√2 m.',
            ],
            answer: 'Area = 72 m² (Side = 6√2 m)',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'The Vedic Altar Puzzle: How to Double a Square’s Area',
              narration:
                'Doubling the side of a square quadruples its area (4a²). To merely double the area to 2a², Baudhāyana stretched the cord across the diagonal!',
              boardFormula: '(2a)² = 4a² (Quadrupled!) · Diagonal² = 2a² (Doubled!)',
              visualCaption: 'Tilted square rising on the diagonal of a base square',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Four Congruent Right Triangles Dissection Proof',
              narration:
                'The base square contains 2 half-square triangles; the diagonal square contains 4 of the exact same triangles—proving Area = 2a².',
              boardFormula: 'Diagonal Square = 4 Triangles = 2 × Base Square',
              visualCaption: 'Four right triangles unfolding to form the tilted 2a² square',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Halving a Square via Midpoint Joining',
              narration:
                'Conversely, connecting the midpoints of a square’s four sides folds the four corner triangles inward, halving the area to a²/2.',
              boardFormula: 'Midpoint Square Area = (1/2) a²',
              visualCaption: 'Corner triangles folding inward to reveal the half-area square',
            },
          ],
        },
        simulation: {
          title: 'Diagonal Square Rotator',
          description:
            'Rotate and scale a square on the diagonal of another to visually verify that its area is always exactly double.',
          interactionType: 'square-angle-adjuster',
          defaultControlA: 5,
          defaultControlB: 45,
          controlALabel: 'Base Square Side (a)',
          controlAMin: 1,
          controlAMax: 15,
          controlBLabel: 'Rotation Angle (°)',
          controlBMin: 0,
          controlBMax: 90,
          formulaHighlight: 'Base Area = a² · Diagonal Square Area = 2a²',
        },
        game: {
          title: 'Square Splitter',
          subtitle: 'Cut and rearrange square pieces to form double-area and half-area squares!',
          rules: 'Apply Baudhāyana’s diagonal doubling and midpoint halving rules.',
          challenges: [
            {
              prompt: 'If a square has area 50 cm², what is the side length of a square with HALF its area?',
              clue: 'Half of 50 cm² is 25 cm².',
              options: ['5 cm', '25 cm', '7.07 cm', '10 cm'],
              correctIndex: 0,
              explanation: 'Half area = 25 cm², so its side length is √25 = 5 cm.',
            },
            {
              prompt: 'What happens to a square’s area if you construct a new square on its diagonal THREE times in succession?',
              clue: 'Each diagonal step multiplies area by 2: ×2 ×2 ×2.',
              options: ['It becomes 8 times the original area', 'It becomes 6 times the original area', 'It becomes 9 times the original area', 'It becomes 3 times the original area'],
              correctIndex: 0,
              explanation: 'Three doublings multiply the area by 2³ = 8.',
            },
            {
              prompt: 'What is the Sanskrit term in the Śulba-Sūtra for the diagonal of a unit square that doubles the area?',
              clue: 'Dvi means "two" (double).',
              options: ['Dvikaraṇī', 'Trairāśika', 'Śūnya', 'Kuṭṭaka'],
              correctIndex: 0,
              explanation: 'Dvikaraṇī literally means "the producer of double the area" (√2).',
            },
          ],
        },
      },
      {
        id: 'p2-mod-2-2',
        moduleCode: 'Module 2.2',
        shortNumber: '2.2',
        title: 'Hypotenuse of an Isosceles Right Triangle (√2)',
        cardHeadline: 'Hypotenuse of an Isosceles Right Triangle (√2)',
        cardTeaser:
          'Discover why an isosceles right triangle with legs of 1 unit has hypotenuse c = √2, and generalize to legs of length a giving c = a√2.',
        artworkTheme: 'roots',
        videoCue: {
          title: '3-Minute Video on Isosceles Right Triangles & the Birth of √2',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'See how a 1 × 1 right triangle forces c² = 1² + 1² = 2, introducing the irrational length c = √2.',
          readingParagraphs: [
            'When both perpendicular legs of a right-angled triangle equal 1 unit, the square built on its hypotenuse has area 1² + 1² = 2 square units.',
            'Since the area of that square is c² = 2, its side length c is the positive number whose square is 2—written as √2. For any isosceles right triangle with legs of length a, the hypotenuse is c = √(a² + a²) = a√2.',
          ],
          keyTakeaways: [
            'In an isosceles right triangle (45°–45°–90°) with legs 1 and 1, hypotenuse c = √2.',
            'For legs of length a, hypotenuse c = a√2 and c² = 2a².',
            'Conversely, if the hypotenuse is c, each leg has length c / √2.',
          ],
          workedExample: {
            problem: 'Find the exact hypotenuse and its square for an isosceles right triangle with legs of length 7 cm.',
            steps: [
              'Use c² = a² + a² = 7² + 7² = 49 + 49 = 98 cm².',
              'Take the square root: c = √98 = √(49 × 2) = 7√2 cm.',
            ],
            answer: 'c² = 98 cm² · Exact Hypotenuse c = 7√2 cm',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Unit Legs (1, 1) and the Hypotenuse Square c² = 2',
              narration:
                'Place unit squares of area 1 on each perpendicular leg. Together their areas fill a square of area 2 on the hypotenuse.',
              boardFormula: '1² + 1² = c² = 2  ⇒  c = √2',
              visualCaption: 'Two 1×1 squares merging into a hypotenuse square of area 2',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Scaling to Any Leg Length a: c = a√2',
              narration:
                'Scaling the triangle by factor a multiplies every side by a, turning (1, 1, √2) into (a, a, a√2).',
              boardFormula: 'Legs (a, a)  ⇒  Hypotenuse c = a√2',
              visualCaption: '45°–45°–90° triangle scaling smoothly with ratio 1 : 1 : √2',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Finding the Leg When the Diagonal Is Known',
              narration:
                'If the diagonal of a square is 10 cm, then 2a² = 10² = 100, so a² = 50 and a = 5√2 cm.',
              boardFormula: '2a² = d²  ⇒  a = d / √2',
              visualCaption: 'Square with diagonal 10 cm revealing side √50 cm',
            },
          ],
        },
        simulation: {
          title: 'Right Triangle Area Grid (c² = 2a²)',
          description:
            'Build area squares on the legs of an isosceles right triangle to measure c² = 2a² and c = a√2.',
          interactionType: 'prime-factor-scale',
          defaultControlA: 5,
          defaultControlB: 5,
          controlALabel: 'Equal Leg Length (a)',
          controlAMin: 1,
          controlAMax: 15,
          formulaHighlight: 'c² = a² + a² = 2a²  ⇒  c = a√2 ≈ 1.414·a',
        },
        game: {
          title: 'Hypotenuse Hunter',
          subtitle: 'Calculate exact hypotenuse lengths for isosceles right triangles!',
          rules: 'Identify c² and c for each 45°–45°–90° triangle.',
          challenges: [
            {
              prompt: 'An isosceles right triangle has legs of 9 cm each. What is the area of the square drawn on its hypotenuse?',
              clue: 'c² = 9² + 9².',
              options: ['162 cm²', '81 cm²', '18 cm²', '324 cm²'],
              correctIndex: 0,
              explanation: 'c² = 81 + 81 = 162 cm².',
            },
            {
              prompt: 'If the hypotenuse of an isosceles right triangle is √32 cm, what is the length of each leg?',
              clue: '2a² = 32 ⇒ a² = 16.',
              options: ['4 cm', '8 cm', '16 cm', '2√2 cm'],
              correctIndex: 0,
              explanation: 'Since a² + a² = (√32)² = 32, we get 2a² = 32 ⇒ a² = 16 ⇒ a = 4 cm.',
            },
            {
              prompt: 'A baseball diamond is a square of side 27 m. How far is the throw from Home Plate straight across the diagonal to Second Base?',
              clue: 'Diagonal of side-a square is a√2.',
              options: ['27√2 m', '54 m', '27 m', '13.5√2 m'],
              correctIndex: 0,
              explanation: 'The diagonal is the hypotenuse of legs 27 m and 27 m, which is 27√2 m.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-2-3',
        moduleCode: 'Module 2.3',
        shortNumber: '2.3',
        title: 'Decimal Bounds & Non-Terminating Nature of √2',
        cardHeadline: 'Decimal Bounds & Non-Terminating Nature of √2',
        cardTeaser:
          'Trap √2 between tight decimal bounds (1.414 < √2 < 1.415), compare Baudhāyana’s 577/408 approximation, and prove why √2 has no terminating decimal.',
        artworkTheme: 'digits',
        videoCue: {
          title: '3-Minute Video on Trapping √2 & Proof of Irrationality',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Zoom in on the number line to trap √2 = 1.41421356..., inspect Baudhāyana’s remarkable fraction 1 + 1/3 + 1/12 − 1/408 = 577/408, and see why no terminating decimal can ever square to 2.',
          readingParagraphs: [
            'Since 1² = 1 and 2² = 4, √2 lies between 1 and 2. Testing tenths: 1.4² = 1.96 < 2 < 2.25 = 1.5². Testing hundredths: 1.41² = 1.9881 < 2 < 2.0164 = 1.42². Testing thousandths: 1.414 < √2 < 1.415.',
            'Why can √2 never be a terminating decimal? The last non-zero digit of any terminating decimal must be 1–9, and squaring 1–9 produces last digits 1, 4, 9, 6, 5—never 0! Thus a terminating decimal squared can NEVER equal the whole number 2.',
            'Baudhāyana gave the rational approximation 1 + 1/3 + 1/(3×4) − 1/(3×4×34) = 577/408 ≈ 1.4142156, accurate to 5 decimal places!',
          ],
          keyTakeaways: [
            '1.414 < √2 < 1.415 (since 1.414² = 1.999396 and 1.415² = 2.002225).',
            'No terminating decimal can square to 2 because the square of its last non-zero digit (1–9) cannot end in 0.',
            'Baudhāyana’s Śulba-Sūtra approximation: 577 / 408 ≈ 1.4142156.',
          ],
          workedExample: {
            problem: 'Trap √5 between two consecutive tenths by squaring decimals.',
            steps: [
              'Since 2² = 4 and 3² = 9, √5 lies between 2 and 3 (closer to 2).',
              'Test 2.2² = 4.84 < 5, and test 2.3² = 5.29 > 5.',
              'Therefore, 2.2 < √5 < 2.3.',
            ],
            answer: '2.2 < √5 < 2.3',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Nested Interval Zoom: 1.4 < 1.41 < 1.414 < √2',
              narration:
                'Each decimal magnification narrows the cage around √2: [1, 2] → [1.4, 1.5] → [1.41, 1.42] → [1.414, 1.415].',
              boardFormula: '1.414² = 1.999396 < 2 < 2.002225 = 1.415²',
              visualCaption: 'Number line magnifying glass zooming into 1.41421...',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Why Terminating Decimals Can Never Equal √2',
              narration:
                'If a decimal ends in a non-zero digit d ∈ {1..9}, its square ends in d² ∈ {1,4,5,6,9}—never zero, so it can never collapse to the integer 2!',
              boardFormula: 'Last digit d ∈ {1..9} ⇒ d² ≠ 0 (Cannot terminate!)',
              visualCaption: 'Unit-digit filter proving no finite decimal squares to 2.000...',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Baudhāyana’s Ancient Masterpiece: 577 / 408',
              narration:
                'Over 2,500 years ago, Baudhāyana wrote √2 ≈ 1 + 1/3 + 1/12 − 1/408 = 577/408 = 1.4142156...—off by only two millionths!',
              boardFormula: '577 / 408 ≈ 1.4142156  (√2 ≈ 1.4142135)',
              visualCaption: 'Palm-leaf fraction strips summing to 577/408',
            },
          ],
        },
        simulation: {
          title: 'Interval Zoomer for Trapping √2',
          description:
            'Dial decimal places to narrow down upper and lower bounds on the number line and trap √2.',
          interactionType: 'decimal-shifter',
          defaultControlA: 14,
          defaultControlB: 3,
          controlALabel: 'Tenths / Hundredths Probe',
          controlAMin: 10,
          controlAMax: 20,
          controlBLabel: 'Precision Depth (Digits)',
          controlBMin: 1,
          controlBMax: 5,
          formulaHighlight: '1.414 < √2 < 1.415 · Baudhāyana: 577/408 ≈ 1.414216',
        },
        game: {
          title: 'Decimal Trap',
          subtitle: 'Test decimal squares to lock irrational roots inside the tightest bounds!',
          rules: 'Compare squares of the boundary numbers.',
          challenges: [
            {
              prompt: 'Between which two consecutive tenths does √3 lie?',
              clue: '1.7² = 2.89 and 1.8² = 3.24.',
              options: ['1.7 and 1.8', '1.6 and 1.7', '1.8 and 1.9', '1.5 and 1.6'],
              correctIndex: 0,
              explanation: 'Since 1.7² = 2.89 < 3 < 3.24 = 1.8², we have 1.7 < √3 < 1.8.',
            },
            {
              prompt: 'Why can 1.414 NOT be the exact value of √2?',
              clue: 'Look at the last digit of 1.414²: 4² ends in 6.',
              options: [
                'Because 1.414² = 1.999396 ends in 6, not 0',
                'Because 1.414 is greater than 2',
                'Because 4 is an even number',
                'Because 1.414 is negative',
              ],
              correctIndex: 0,
              explanation: 'Any decimal ending in 4 has a square ending in 6, so 1.414² = 1.999396 ≠ 2.',
            },
            {
              prompt: 'Which ancient fraction from the Śulba-Sūtra approximates √2 to five decimal places?',
              clue: '1 + 1/3 + 1/12 − 1/408.',
              options: ['577 / 408', '22 / 7', '355 / 113', '99 / 70'],
              correctIndex: 0,
              explanation: '577 / 408 ≈ 1.414215686 matches √2 ≈ 1.414213562 to 5 decimal places!',
            },
          ],
        },
      },
      {
        id: 'p2-mod-2-4',
        moduleCode: 'Module 2.4',
        shortNumber: '2.4',
        title: 'Combining Two Different Squares',
        cardHeadline: 'Combining Two Different Squares (Samāsa)',
        cardTeaser:
          'Use Baudhāyana’s geometric dissection to slice and combine two unequal squares (a² and b²) into a single larger square (c²).',
        artworkTheme: 'diff-squares',
        videoCue: {
          title: '3-Minute Video on Baudhāyana’s Dissection for Combining Two Unequal Squares',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Watch how placing two unequal squares a² and b² side by side into an L-shape and making two diagonal cuts reassembles them into a single tilted square of area a² + b²!',
          readingParagraphs: [
            'In Śulba-Sūtra 1.12, Baudhāyana explains how to combine two unequal square altars of sides a and b into one combined square altar of area a² + b².',
            'Place the two squares side by side (forming an L-shaped figure of total area a² + b²). Mark off length b along the base, draw two segments of length c = √(a² + b²) to the top corners, and fold the two outer right triangles over to lock into a single perfect square of side c!',
          ],
          keyTakeaways: [
            'Two squares of areas a² and b² dissect and reassemble into one square of area c² = a² + b².',
            'The cut lines form congruent right triangles with legs a and b and hypotenuse c.',
            'To subtract a smaller square b² from a², reverse the construction so leg a = √(c² − b²).',
          ],
          workedExample: {
            problem: 'Two square park plots have sides 6 m and 8 m. What is the side length of a single square plot with their combined area?',
            steps: [
              'Areas of the two squares are 6² = 36 m² and 8² = 64 m².',
              'Combined area c² = 36 + 64 = 100 m².',
              'Side of the combined square c = √100 = 10 m.',
            ],
            answer: 'Combined Area = 100 m² · Side c = 10 m',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Placing Side-a and Side-b Squares into an L-Shape',
              narration:
                'Place the a × a square and b × b square side by side so their bases align to total length a + b.',
              boardFormula: 'Total L-Shape Area = a² + b²',
              visualCaption: 'Adjacent a² and b² squares forming a stepped L-figure',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Baudhāyana’s Two Diagonal Cuts',
              narration:
                'Mark segment b from the corner and slice along two hypotenuse lines of length c = √(a² + b²).',
              boardFormula: 'Two Right Triangles of Legs (a, b) Sliced & Hinged',
              visualCaption: 'Glowing diagonal cut lines slicing off two (a,b,c) right triangles',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Hinging the Triangles to Form the c × c Square',
              narration:
                'Rotate the two cut right triangles upward—the pieces lock together without a single gap into a tilted c × c square!',
              boardFormula: 'a² + b² = c² (Conservation of Dissected Area)',
              visualCaption: 'Cut triangles rotating smoothly into a single tilted c² square',
            },
          ],
        },
        simulation: {
          title: 'L-Shaped Square Combiner',
          description:
            'Adjust square sides a and b to watch how their areas a² and b² combine into a single hypotenuse square c².',
          interactionType: 'diff-squares-strip',
          defaultControlA: 6,
          defaultControlB: 8,
          controlALabel: 'First Square Side (a)',
          controlAMin: 3,
          controlAMax: 15,
          controlBLabel: 'Second Square Side (b)',
          controlBMin: 3,
          controlBMax: 15,
          formulaHighlight: 'Combined Square Area c² = a² + b²  ⇒  c = √(a² + b²)',
        },
        game: {
          title: 'Area Merger',
          subtitle: 'Match pairs of unequal squares to their combined hypotenuse square!',
          rules: 'Sum the areas a² + b² and take the square root.',
          challenges: [
            {
              prompt: 'Combining a square of side 5 cm and a square of side 12 cm produces a single square of what side length?',
              clue: '5² + 12² = 25 + 144 = 169.',
              options: ['13 cm', '17 cm', '15 cm', '14 cm'],
              correctIndex: 0,
              explanation: 'c² = 25 + 144 = 169 ⇒ c = √169 = 13 cm.',
            },
            {
              prompt: 'If a large square has area 85 cm² and you remove a square of area 36 cm², what is the side of the remaining square?',
              clue: '85 − 36 = 49.',
              options: ['7 cm', '6 cm', '8 cm', '9 cm'],
              correctIndex: 0,
              explanation: 'Remaining area = 85 − 36 = 49 cm² ⇒ side = √49 = 7 cm.',
            },
            {
              prompt: 'Two squares of sides 9 m and 12 m are combined. What is the perimeter of the resulting single square?',
              clue: 'First find side c = √(81 + 144) = 15 m, then multiply by 4.',
              options: ['60 m', '45 m', '84 m', '225 m'],
              correctIndex: 0,
              explanation: 'c = √225 = 15 m, so Perimeter = 4 × 15 = 60 m.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-2-5',
        moduleCode: 'Module 2.5',
        shortNumber: '2.5',
        title: 'Baudhāyana’s Theorem on Right-Angled Triangles (a² + b² = c²)',
        cardHeadline: 'Baudhāyana’s Theorem (a² + b² = c²)',
        cardTeaser:
          'Formulate Baudhāyana’s Sūtra 1.12 on rectangles and right-angled triangles, prove it via the (a + b)² square dissection, and solve for any unknown side.',
        artworkTheme: 'carpenter',
        videoCue: {
          title: '3-Minute Video on Baudhāyana’s Theorem & the (a+b)² Dissection Proof',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Read Baudhāyana’s original Sanskrit rule (c. 800 BCE)—centuries before Pythagoras—and prove a² + b² = c² by arranging four right triangles inside an (a + b) × (a + b) square.',
          readingParagraphs: [
            'Baudhāyana Śulba-Sūtra 1.12 states: "The diagonal of a rectangle produces by itself both the areas which the two sides of the rectangle produce separately"—that is, a² + b² = c².',
            'To prove this visually, place four identical right triangles of sides (a, b, c) inside a large square of side (a + b). In Arrangement 1, the uncovered space is a tilted square of area c². In Arrangement 2, sliding the four triangles into two rectangles leaves two uncovered squares of areas a² and b². Therefore, a² + b² = c²!',
          ],
          keyTakeaways: [
            'In any right-angled triangle with legs a, b and hypotenuse c (opposite 90°): a² + b² = c².',
            'To find the hypotenuse: c = √(a² + b²).',
            'To find a missing leg: a = √(c² − b²).',
          ],
          workedExample: {
            problem: 'A 17 m ladder leans against a vertical wall with its foot 8 m from the base of the wall. How high up the wall does it reach?',
            steps: [
              'Here hypotenuse c = 17 m and base leg b = 8 m.',
              'By Baudhāyana’s Theorem: a² = c² − b² = 17² − 8² = 289 − 64 = 225.',
              'Height a = √225 = 15 m.',
            ],
            answer: '15 m high up the wall',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Baudhāyana’s Sūtra 1.12 (c. 800 BCE)',
              narration:
                'Centuries before Pythagoras, Baudhāyana stated that the diagonal of a rectangle of sides a and b produces a square equal to a² + b².',
              boardFormula: 'dīrghacaturasrasya akṣṇayā rajjuḥ: a² + b² = c²',
              visualCaption: 'Rectangle with squares a² and b² on sides and c² on the diagonal',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'The Two Arrangements Inside an (a + b) × (a + b) Square',
              narration:
                'Four identical right triangles inside an (a+b) square leave uncovered area c² on the left, and uncovered areas a² + b² on the right!',
              boardFormula: '(a + b)² − 4(½ab) = c² = a² + b²',
              visualCaption: 'Side-by-side comparison of the two (a+b)² square dissections',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Finding a Missing Leg: a² = c² − b²',
              narration:
                'When the hypotenuse c and one leg b are known, subtract their squares: a² = c² − b² = (c − b)(c + b).',
              boardFormula: 'a = √(c² − b²) = √((c − b)(c + b))',
              visualCaption: '17 m ladder triangle locking onto height 15 m',
            },
          ],
        },
        simulation: {
          title: 'Pythagorean Water Tile & (a+b)² Dissection Lab',
          description:
            'Adjust legs a and b to see the squares a² and b² fill the hypotenuse square c² = a² + b².',
          interactionType: 'nested-square',
          defaultControlA: 8,
          defaultControlB: 15,
          controlALabel: 'Leg a',
          controlAMin: 3,
          controlAMax: 20,
          controlBLabel: 'Leg b',
          controlBMin: 3,
          controlBMax: 20,
          formulaHighlight: 'a² + b² = c²  ⇒  c = √(a² + b²)',
        },
        game: {
          title: 'Side Length Rescue',
          subtitle: 'Find missing side lengths (a, b, or c) in right-angled triangles!',
          rules: 'Add squares when finding the hypotenuse; subtract squares when finding a leg.',
          challenges: [
            {
              prompt: 'In a right triangle with legs a = 9 cm and b = 40 cm, what is the hypotenuse c?',
              clue: '9² + 40² = 81 + 1600 = 1681 = 41².',
              options: ['41 cm', '49 cm', '39 cm', '42 cm'],
              correctIndex: 0,
              explanation: 'c = √(81 + 1600) = √1681 = 41 cm.',
            },
            {
              prompt: 'A right triangle has hypotenuse c = 25 m and one leg b = 24 m. Find the other leg a:',
              clue: 'Use difference of squares: 25² − 24² = (25−24)(25+24) = 1 × 49.',
              options: ['7 m', '5 m', '9 m', '1 m'],
              correctIndex: 0,
              explanation: 'a² = 25² − 24² = 625 − 576 = 49 ⇒ a = 7 m.',
            },
            {
              prompt: 'A ship sails 12 km East and then 16 km North. How far is it in a straight line from its starting port?',
              clue: '√(12² + 16²) = √(144 + 256).',
              options: ['20 km', '28 km', '24 km', '18 km'],
              correctIndex: 0,
              explanation: 'Distance = √(144 + 256) = √400 = 20 km.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-2-6',
        moduleCode: 'Module 2.6',
        shortNumber: '2.6',
        title: 'Baudhāyana Triples & Primitive Scaling',
        cardHeadline: 'Baudhāyana Triples & Primitive Scaling',
        cardTeaser:
          'Generate integer right-triangle triples like (3,4,5), (5,12,13), (8,15,17), and (7,24,25), distinguish primitive triples from scaled multiples (ka, kb, kc), and use Euclid’s formula.',
        artworkTheme: 'odd-grid',
        videoCue: {
          title: '3-Minute Video on Baudhāyana Triples, Scaling & Euclid’s Generator',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Explore the integer triples listed in the Śulba-Sūtras—(3,4,5), (5,12,13), (8,15,17), (7,24,25), (12,35,37)—and generate infinitely many using (m² − n², 2mn, m² + n²).',
          readingParagraphs: [
            'A Baudhāyana (Pythagorean) triple is a set of three positive integers (a, b, c) satisfying a² + b² = c². The Śulba-Sūtras explicitly used (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25), and (12, 35, 37) to lay out exact right angles with knotted cords!',
            'If gcd(a, b, c) = 1, the triple is called primitive. Multiplying any triple by a positive integer k gives a scaled triple (ka, kb, kc), such as 2 × (3, 4, 5) = (6, 8, 10) or 3 × (5, 12, 13) = (15, 36, 39).',
            'Furthermore, for any integers m > n > 0, the formulas a = m² − n², b = 2mn, c = m² + n² always produce a valid Baudhāyana triple!',
          ],
          keyTakeaways: [
            'Classic Primitive Triples: (3,4,5), (5,12,13), (8,15,17), (7,24,25), (20,21,29).',
            'Scaling Rule: If (a, b, c) is a triple, then (ka, kb, kc) is also a triple for any k ≥ 1.',
            'Generator Identity: (m² − n²)² + (2mn)² = (m² + n²)².',
          ],
          workedExample: {
            problem: 'Use m = 4 and n = 1 to generate a Baudhāyana triple, and verify that a² + b² = c².',
            steps: [
              'Compute a = m² − n² = 4² − 1² = 16 − 1 = 15.',
              'Compute b = 2mn = 2(4)(1) = 8, and c = m² + n² = 16 + 1 = 17.',
              'Check: 8² + 15² = 64 + 225 = 289 = 17². Valid primitive triple (8, 15, 17)!',
            ],
            answer: '(8, 15, 17) since 8² + 15² = 17² = 289',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Knotted Cord Triples in the Śulba-Sūtras',
              narration:
                'With a rope knotted at 3, 4, and 5 units—or 5, 12, and 13 units—ancient builders formed an instant 90° corner without a protractor.',
              boardFormula: '(3,4,5) · (5,12,13) · (8,15,17) · (7,24,25)',
              visualCaption: '12-unit knotted cord pulled taut into a 3-4-5 right triangle',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Primitive vs. Scaled Triples (ka, kb, kc)',
              narration:
                '(15, 20, 25) looks big, but dividing by 5 reveals it is just 5 × (3, 4, 5)!',
              boardFormula: '(ka)² + (kb)² = k²(a² + b²) = (kc)²',
              visualCaption: '(3,4,5) triangle scaling by ×2, ×3, and ×5',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'The Infinite Triple Generator: (m² − n², 2mn, m² + n²)',
              narration:
                'Pick any m > n: their squares add to the hypotenuse m² + n² and subtract to leg m² − n², with second leg 2mn!',
              boardFormula: 'a = m² − n²,  b = 2mn,  c = m² + n²',
              visualCaption: 'Generator machine turning (m=3, n=2) into (5, 12, 13)',
            },
          ],
        },
        simulation: {
          title: 'Baudhāyana Triple Generator Matrix',
          description:
            'Dial integer seeds m and n (with m > n) to generate Baudhāyana triples (m² − n², 2mn, m² + n²) live.',
          interactionType: 'odd-l-grid',
          defaultControlA: 4,
          defaultControlB: 1,
          controlALabel: 'Seed Integer m',
          controlAMin: 2,
          controlAMax: 10,
          controlBLabel: 'Seed Integer n (< m)',
          controlBMin: 1,
          controlBMax: 9,
          formulaHighlight: 'a = m² − n² · b = 2mn · c = m² + n²',
        },
        game: {
          title: 'Triple Bridge',
          subtitle: 'Step only on planks whose three lengths form a valid Baudhāyana triple!',
          rules: 'Spot primitive and scaled triples quickly.',
          challenges: [
            {
              prompt: 'Which of the following is a PRIMITIVE Baudhāyana triple?',
              clue: 'Check a² + b² = c² AND gcd(a, b, c) = 1.',
              options: ['(8, 15, 17)', '(6, 8, 10)', '(9, 12, 15)', '(8, 12, 15)'],
              correctIndex: 0,
              explanation: '8² + 15² = 64 + 225 = 289 = 17², and gcd(8, 15, 17) = 1.',
            },
            {
              prompt: 'Find the missing hypotenuse in the scaled triple (15, 36, ___):',
              clue: 'Factor out 3: (15, 36) = 3 × (5, 12).',
              options: ['39', '37', '41', '45'],
              correctIndex: 0,
              explanation: 'Since (5, 12, 13) is a triple, multiplying by 3 gives (15, 36, 39).',
            },
            {
              prompt: 'What Baudhāyana triple is generated by m = 5 and n = 2?',
              clue: 'a = 25 − 4, b = 2(5)(2), c = 25 + 4.',
              options: ['(20, 21, 29)', '(15, 20, 25)', '(21, 28, 35)', '(9, 40, 41)'],
              correctIndex: 0,
              explanation: 'a = 21, b = 20, c = 29; check: 400 + 441 = 841 = 29².',
            },
          ],
        },
      },
      {
        id: 'p2-mod-2-7',
        moduleCode: 'Module 2.7',
        shortNumber: '2.7',
        title: 'Fermat’s Last Theorem & Historical Applications',
        cardHeadline: 'Bhāskarāchārya’s Lotus & Fermat’s Last Theorem',
        cardTeaser:
          'Solve Bhāskarāchārya’s poetic lotus-in-a-lake puzzle from the Līlāvatī (1150 CE) and discover Pierre de Fermat’s 358-year mystery solved by Andrew Wiles.',
        artworkTheme: 'zero-india',
        videoCue: {
          title: '3-Minute Video on Bhāskarāchārya’s Lotus Problem & Fermat’s Last Theorem',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Watch a breeze push a lotus flower across a pond to reveal the water’s depth via Baudhāyana’s theorem, then ask what happens when the exponent 2 in a² + b² = c² is raised to n ≥ 3!',
          readingParagraphs: [
            'In his renowned 1150 CE treatise Līlāvatī, Bhāskarāchārya posed poetic geometry problems: a lotus bud stands h units above a lake of depth x (so stem length = x + h). When blown sideways by distance d, the bud touches the water surface. This forms a right triangle with legs x and d and hypotenuse (x + h): x² + d² = (x + h)²!',
            'Notice how x² cancels on both sides: x² + d² = x² + 2hx + h² ⇒ 2hx = d² − h², solving for the lake depth x in one step!',
            'While a² + b² = c² has infinitely many positive integer solutions, in 1637 Pierre de Fermat conjectured that aⁿ + bⁿ = cⁿ has NO positive integer solutions for any integer exponent n ≥ 3. This remained unsolved for 358 years until Andrew Wiles proved it in 1994!',
          ],
          keyTakeaways: [
            'In Bhāskarāchārya’s Lotus Problem: x² + d² = (x + h)² ⇒ x = (d² − h²) / (2h).',
            'Broken Bamboo Problem: If a pole of height H breaks at height x and touches the ground d units away, x² + d² = (H − x)².',
            'Fermat’s Last Theorem (proved by Andrew Wiles, 1994): No positive integers satisfy aⁿ + bⁿ = cⁿ for n ≥ 3.',
          ],
          workedExample: {
            problem: 'A lotus stands h = 1 foot above a lake. Blown by the wind, it touches the water d = 4 feet away. Find the depth x of the lake.',
            steps: [
              'Let lake depth = x feet, so total lotus stem length = (x + 1) feet.',
              'Apply Baudhāyana’s Theorem: x² + 4² = (x + 1)² ⇒ x² + 16 = x² + 2x + 1.',
              'Subtract x² from both sides: 2x = 15 ⇒ x = 7.5 feet.',
            ],
            answer: 'Lake depth x = 7.5 feet (Lotus stem = 8.5 feet)',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Bhāskarāchārya’s Līlāvatī (1150 CE): The Swaying Lotus',
              narration:
                'As the lotus sways in the breeze, its stem of length x + h pivots from vertical to form the hypotenuse of a submerged right triangle!',
              boardFormula: 'x² + d² = (x + h)²  ⇒  x = (d² − h²) ÷ (2h)',
              visualCaption: 'Lotus stem arcing across water surface to form right triangle (x, d, x+h)',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'The Broken Bamboo Tree Puzzle',
              narration:
                'When a bamboo of total height H snaps at height x, the fallen top has length H − x, giving x² + d² = (H − x)².',
              boardFormula: 'x² + d² = (H − x)²',
              visualCaption: 'Bamboo stalk snapping to form a right triangle with the ground',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Fermat’s Last Theorem (1637) & Andrew Wiles (1994)',
              narration:
                'Squares combine into squares (3² + 4² = 5²), but cubes never combine into a cube (a³ + b³ ≠ c³) for positive integers!',
              boardFormula: 'aⁿ + bⁿ = cⁿ has NO positive integer solutions for n ≥ 3',
              visualCaption: 'Margin note from 1637 meeting Andrew Wiles’ 1994 proof seal',
            },
          ],
        },
        simulation: {
          title: 'Bhāskarāchārya’s Lotus Stem Triangle Simulator',
          description:
            'Adjust horizontal wind drift (d) and lotus height above water (h) to compute the exact lake depth x.',
          interactionType: 'compass-rhombus',
          defaultControlA: 4,
          defaultControlB: 1,
          controlALabel: 'Horizontal Drift Distance d (ft)',
          controlAMin: 2,
          controlAMax: 16,
          controlBLabel: 'Height Above Water h (ft)',
          controlBMin: 1,
          controlBMax: 6,
          formulaHighlight: 'x² + d² = (x + h)²  ⇒  Depth x = (d² − h²) / (2h)',
        },
        game: {
          title: 'History Quest',
          subtitle: 'Solve Līlāvatī word problems and match mathematicians to their breakthroughs!',
          rules: 'Apply Baudhāyana’s equation and historical milestones.',
          challenges: [
            {
              prompt: 'A lotus bud is 2 cubits above a pond. Blown by the wind, it touches the water 6 cubits away. What is the depth of the pond?',
              clue: 'x = (d² − h²) / (2h) = (36 − 4) / 4.',
              options: ['8 cubits', '10 cubits', '6 cubits', '9 cubits'],
              correctIndex: 0,
              explanation: 'x² + 6² = (x + 2)² ⇒ x² + 36 = x² + 4x + 4 ⇒ 4x = 32 ⇒ x = 8 cubits.',
            },
            {
              prompt: 'A 16 m tall bamboo breaks during a storm so its tip touches the ground 8 m from its base. At what height x from the ground did it break?',
              clue: 'x² + 8² = (16 − x)²; test x = 6 (6, 8, 10).',
              options: ['6 m', '8 m', '5 m', '7 m'],
              correctIndex: 0,
              explanation: 'If x = 6 m, the broken top is 16 − 6 = 10 m, and 6² + 8² = 10²!',
            },
            {
              prompt: 'Who proved Fermat’s Last Theorem (that aⁿ + bⁿ = cⁿ has no positive integer solutions for n ≥ 3) in 1994?',
              clue: 'British mathematician who solved the 358-year-old problem.',
              options: ['Andrew Wiles', 'G. H. Hardy', 'Leonhard Euler', 'Carl Friedrich Gauss'],
              correctIndex: 0,
              explanation: 'Sir Andrew Wiles completed the proof of Fermat’s Last Theorem in 1994.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-2-8',
        moduleCode: 'Module 2.8',
        shortNumber: '2.8',
        title: 'Chapter Assessment & Questionnaire',
        cardHeadline: 'Pythagorean Bridge Builder & Śulba-Sūtra Tangram Capstone',
        cardTeaser:
          'Review geometric proofs, irrational bounds, primitive triples, and Līlāvatī applications in the Śulba-Sūtra Tangram Studio and Pythagorean Bridge Builder.',
        isWrapUpModule: true,
        artworkTheme: 'master-boss',
        videoCue: {
          title: '3-Minute Chapter 2 Synthesis: From Śulba-Sūtras to Modern Geometry',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Connect square doubling, √2 bounds, Baudhāyana’s dissection proof, primitive triples, and Līlāvatī puzzles before taking the 20-Question Assessment.',
          readingParagraphs: [
            'From Baudhāyana’s c. 800 BCE altar ropes to Bhāskarāchārya’s Līlāvatī and modern truss bridges, the identity a² + b² = c² is the cornerstone of Euclidean distance and geometry.',
            'Launch the Śulba-Sūtra Geometric Tangram Studio and Pythagorean Bridge Builder below, then complete the randomized Chapter 2 Assessment!',
          ],
          keyTakeaways: [
            'Diagonal of a square of side a is a√2; diagonal of a rectangle (a, b) is √(a² + b²).',
            'Always check whether the unknown side is the hypotenuse (add squares) or a leg (subtract squares).',
            'Memorize the core primitive triples: (3,4,5), (5,12,13), (8,15,17), (7,24,25), (9,40,41), (20,21,29).',
          ],
          workedExample: {
            problem: 'Find the length of the longest straight rod that can fit flat on the floor of a 12 m × 5 m hall.',
            steps: [
              'The longest floor line is the diagonal of the 12 m × 5 m rectangle.',
              'd² = 12² + 5² = 144 + 25 = 169.',
              'd = √169 = 13 m.',
            ],
            answer: '13 m',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Master Synthesis of Baudhāyana’s Theorem',
              narration:
                'Every right triangle links algebra (a² + b² = c²) and geometry (area dissections of squares).',
              boardFormula: 'a² + b² = c² · c = √(a² + b²) · a = √(c² − b²)',
              visualCaption: 'Three squares glowing around a right-angled truss triangle',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Converse of the Theorem: Testing for a 90° Angle',
              narration:
                'If the three sides of a triangle satisfy a² + b² = c², the angle opposite side c is guaranteed to be 90°.',
              boardFormula: 'a² + b² = c²  ⇔  ∠C = 90°',
              visualCaption: 'Right-angle square marker locking in as a² + b² matches c²',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Pythagorean Bridge Builder & 20-Question Quiz Ready',
              narration:
                'Test your structural engineering skills in the Bridge Builder game and complete the Chapter 2 Assessment!',
              boardFormula: 'Chapter 2 Mastery Seal Unlocked',
              visualCaption: 'Golden truss bridge spanning across the river',
            },
          ],
        },
        simulation: {
          title: 'Śulba-Sūtra Geometric Tangram Studio (Big Simulation)',
          isBigSimulation: true,
          description:
            'Reconstruct ancient altar geometries, combine unequal squares, and test right-triangle trusses interactively.',
          interactionType: 'grand-capstone-sim',
          defaultControlA: 9,
          defaultControlB: 12,
          controlALabel: 'Altar Side / Truss Base (a)',
          controlAMin: 3,
          controlAMax: 24,
          controlBLabel: 'Altar Side / Truss Height (b)',
          controlBMin: 3,
          controlBMax: 24,
          formulaHighlight: 'a² + b² = c² · Diagonal Square Area = 2a²',
        },
        game: {
          title: 'Pythagorean Bridge Builder (Big Game)',
          isBigGame: true,
          subtitle: 'Design and test complex architectural structures using right-triangle properties!',
          rules: 'Calculate the exact diagonal braces and cable lengths to stabilize the bridge.',
          challenges: [
            {
              prompt: 'Bridge Truss 1: A vertical tower rises 24 m above the deck, and a steel cable anchors 7 m away on the deck. How long must the cable be?',
              clue: '(7, 24, 25) is a primitive Baudhāyana triple!',
              options: ['25 m', '26 m', '31 m', '24.5 m'],
              correctIndex: 0,
              explanation: 'c = √(7² + 24²) = √(49 + 576) = √625 = 25 m.',
            },
            {
              prompt: 'Bridge Truss 2: Two vertical pillars of heights 12 m and 20 m stand 15 m apart on level ground. What is the straight-line distance between their tops?',
              clue: 'Form a right triangle with horizontal leg 15 m and vertical height difference 20 − 12 = 8 m.',
              options: ['17 m', '19 m', '23 m', '16 m'],
              correctIndex: 0,
              explanation: 'd = √(15² + (20 − 12)²) = √(225 + 64) = √289 = 17 m.',
            },
            {
              prompt: 'Bridge Truss 3: A square support frame has diagonal 12√2 m. What is the perimeter of the square frame?',
              clue: 'If diagonal is a√2 = 12√2, then side a = 12 m.',
              options: ['48 m', '24 m', '36 m', '48√2 m'],
              correctIndex: 0,
              explanation: 'Side a = 12 m, so Perimeter = 4 × 12 = 48 m.',
            },
          ],
        },
      },
    ],
    questionnaire: [
      {
        id: 'p2-ch2-q1',
        questionNumber: 1,
        type: 'mcq',
        prompt: 'If a square has side 8 cm, what is the area of the square constructed on its diagonal?',
        options: ['128 cm²', '64 cm²', '256 cm²', '96 cm²'],
        correctIndex: 0,
        explanation: 'By Baudhāyana’s doubling rule, diagonal square area = 2 × 8² = 2 × 64 = 128 cm².',
        moduleRef: 'Module 2.1',
      },
      {
        id: 'p2-ch2-q2',
        questionNumber: 2,
        type: 'mcq',
        prompt: 'What is the hypotenuse of an isosceles right triangle whose equal legs are each 10 cm?',
        options: ['10√2 cm', '20 cm', '100 cm', '5√2 cm'],
        correctIndex: 0,
        explanation: 'c = √(10² + 10²) = √200 = 10√2 cm.',
        moduleRef: 'Module 2.2',
      },
      {
        id: 'p2-ch2-q3',
        questionNumber: 3,
        type: 'mcq',
        prompt: 'Which inequality correctly traps √2 to three decimal places?',
        options: ['1.414 < √2 < 1.415', '1.412 < √2 < 1.413', '1.415 < √2 < 1.416', '1.404 < √2 < 1.405'],
        correctIndex: 0,
        explanation: '1.414² = 1.999396 < 2 and 1.415² = 2.002225 > 2.',
        moduleRef: 'Module 2.3',
      },
      {
        id: 'p2-ch2-q4',
        questionNumber: 4,
        type: 'mcq',
        prompt: 'Two squares of areas 36 cm² and 64 cm² are combined into a single square. What is the side length of the new square?',
        options: ['10 cm', '14 cm', '100 cm', '12 cm'],
        correctIndex: 0,
        explanation: 'Combined area = 36 + 64 = 100 cm² ⇒ side = √100 = 10 cm.',
        moduleRef: 'Module 2.4',
      },
      {
        id: 'p2-ch2-q5',
        questionNumber: 5,
        type: 'mcq',
        prompt: 'A 13 m ladder leans against a wall with its base 5 m from the wall. How high up the wall does it reach?',
        options: ['12 m', '8 m', '11 m', '14 m'],
        correctIndex: 0,
        explanation: 'h = √(13² − 5²) = √(169 − 25) = √144 = 12 m.',
        moduleRef: 'Module 2.5',
      },
      {
        id: 'p2-ch2-q6',
        questionNumber: 6,
        type: 'mcq',
        prompt: 'Which of these sets of side lengths forms a right-angled triangle?',
        options: ['(7, 24, 25)', '(6, 12, 13)', '(8, 14, 17)', '(5, 10, 12)'],
        correctIndex: 0,
        explanation: '7² + 24² = 49 + 576 = 625 = 25².',
        moduleRef: 'Module 2.6',
      },
      {
        id: 'p2-ch2-q7',
        questionNumber: 7,
        type: 'mcq',
        prompt: 'Using Euclid’s formula (m² − n², 2mn, m² + n²) with m = 3, n = 2 gives which triple?',
        options: ['(5, 12, 13)', '(3, 4, 5)', '(8, 15, 17)', '(7, 24, 25)'],
        correctIndex: 0,
        explanation: 'm² − n² = 9 − 4 = 5, 2mn = 12, m² + n² = 13.',
        moduleRef: 'Module 2.6',
      },
      {
        id: 'p2-ch2-q8',
        questionNumber: 8,
        type: 'mcq',
        prompt: 'A lotus stands 1 m above a lake and touches the surface 3 m away when blown by wind. What is the depth of the lake?',
        options: ['4 m', '4.5 m', '5 m', '3.5 m'],
        correctIndex: 0,
        explanation: 'x = (d² − h²) / (2h) = (9 − 1) / 2 = 4 m (check: 3² + 4² = 5²).',
        moduleRef: 'Module 2.7',
      },
      {
        id: 'p2-ch2-q9',
        questionNumber: 9,
        type: 'mcq',
        prompt: 'A person walks 15 km South and then 8 km West. How far are they from their starting point?',
        options: ['17 km', '23 km', '19 km', '16 km'],
        correctIndex: 0,
        explanation: '√(15² + 8²) = √(225 + 64) = √289 = 17 km.',
        moduleRef: 'Module 2.5',
      },
      {
        id: 'p2-ch2-q10',
        questionNumber: 10,
        type: 'mcq',
        prompt: 'What does Fermat’s Last Theorem state for integer exponents n ≥ 3?',
        options: [
          'aⁿ + bⁿ = cⁿ has no positive integer solutions (a, b, c)',
          'aⁿ + bⁿ = cⁿ has infinitely many solutions',
          'Only prime numbers satisfy a³ + b³ = c³',
          '√2 is a rational number',
        ],
        correctIndex: 0,
        explanation: 'Proved by Andrew Wiles in 1994, aⁿ + bⁿ = cⁿ has no positive integer solutions for n ≥ 3.',
        moduleRef: 'Module 2.7',
      },
    ],
  },
];
