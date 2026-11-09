import { Part1ChapterCurriculum } from '../types/part1Curriculum';

export const PART2_CHAPTERS_3_TO_4: Part1ChapterCurriculum[] = [
  // ============================================================================
  // PART II · CHAPTER 3: PROPORTIONAL REASONING-2
  // ============================================================================
  {
    chapterId: 'ch6-proportional-reasoning',
    chapterIndex: 3,
    chapterBadgeLabel: 'Ganita Prakash Part II · Chapter 3',
    title: 'Proportional Reasoning-2',
    heroRibbonText: 'Ganita Prakash Class 8 · Part II Master Curriculum',
    heroSubtitle:
      'Master map scales & Representative Fractions (RF), multi-term ratios (a : b : c), dividing wholes in m : n, 360° pie chart sectors, and inverse proportions (speed × time = distance).',
    pdfCode: 'Part II · Ch 3',
    pdfUrl: '/assets/aistudio/7.-PROPORTIONAL_e37987b4.pdf',
    heroBgGradient: 'from-[#0C4A6E] via-[#0369A1] to-[#082F49]',
    accentColor: '#38BDF8',
    challengeBannerTitle: 'Are you ready for the Global Cartography & Expedition Planner Challenge?',
    challengeBannerSubtitle:
      'Plan a round-the-world expedition using map Representative Fractions, currency ratios, pie sectors, and the Inverse Proportion Speed-Time Dynamics Lab.',
    modules: [
      {
        id: 'p2-mod-3-1',
        moduleCode: 'Module 3.1',
        shortNumber: '3.1',
        title: 'Proportionality Quick Recap',
        cardHeadline: 'Proportionality Quick Recap',
        cardTeaser:
          'Review ratio notation (a : b), simplest form via HCF, cross-multiplication (a·d = b·c), and constant scaling factors.',
        artworkTheme: 'trairasika',
        videoCue: {
          title: '3-Minute Video on Ratio Equivalence, Cross-Products & Scaling Factors',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Refresh the foundations of proportionality: simplifying ratios by their HCF, verifying a : b :: c : d via ad = bc, and scaling quantities smoothly.',
          readingParagraphs: [
            'Two ratios a : b and c : d are in proportion (written a : b :: c : d) if and only if their cross-products are equal: a × d = b × c (Product of Extremes = Product of Means).',
            'Every proportional relationship y = k·x has a constant multiplier k = y/x, so doubling x always doubles y.',
          ],
          keyTakeaways: [
            'a : b :: c : d  ⇔  a × d = b × c.',
            'To solve for the fourth proportional d: d = (b × c) / a.',
            'Ratios are unitless only when both quantities are expressed in the SAME unit first.',
          ],
          workedExample: {
            problem: 'Check whether 12 : 18 and 28 : 42 are in proportion, and find x if 15 : 20 :: x : 36.',
            steps: [
              'Compare cross-products for 12 : 18 and 28 : 42: 12 × 42 = 504 and 18 × 28 = 504 → Yes, in proportion!',
              'For 15 : 20 :: x : 36, cross-multiply: 20x = 15 × 36 = 540 ⇒ x = 540 ÷ 20 = 27.',
            ],
            answer: 'Yes (both simplify to 2 : 3) · x = 27',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Simplest Form & Constant Scaling Factor k',
              narration:
                'Dividing both terms of a : b by HCF(a, b) reveals the core ratio that remains invariant under any scale factor k.',
              boardFormula: 'ka : kb = a : b  (for all k > 0)',
              visualCaption: 'Ratio bars scaling in lockstep while maintaining 2 : 3',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Cross-Multiplication Test: Extremes vs. Means',
              narration:
                'In a : b :: c : d, multiply the outer Extremes (a·d) and inner Means (b·c)—equality guarantees proportion.',
              boardFormula: 'a : b :: c : d  ⇔  a · d = b · c',
              visualCaption: 'Golden cross-product arcs locking at 504 = 504',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Unitary Method & Trairāśika Bridge',
              narration:
                'Finding the value of 1 unit (b/a) and multiplying by c gives the exact same result as cross-multiplication.',
              boardFormula: 'x = (b ÷ a) × c = (b × c) ÷ a',
              visualCaption: 'Balance scale equating Unitary Method and Cross-Product',
            },
          ],
        },
        simulation: {
          title: 'Ratio Balance Scale (ad = bc Verifier)',
          description:
            'Adjust terms to test whether two ratios are proportional via cross-products and scaling factors.',
          interactionType: 'trairasika-scale',
          defaultControlA: 15,
          defaultControlB: 20,
          controlALabel: 'First Term (a)',
          controlAMin: 1,
          controlAMax: 50,
          controlBLabel: 'Second Term (b)',
          controlBMin: 1,
          controlBMax: 50,
          formulaHighlight: 'a : b :: c : d  ⇔  a × d = b × c',
        },
        game: {
          title: 'Proportion Matcher',
          subtitle: 'Pair equivalent ratios and solve for missing fourth proportionals!',
          rules: 'Use HCF reduction or cross-products ad = bc.',
          challenges: [
            {
              prompt: 'Find the missing value x in the proportion 9 : 15 :: 24 : x:',
              clue: '9 : 15 simplifies to 3 : 5, so 24 : x = 3 : 5.',
              options: ['40', '36', '45', '38'],
              correctIndex: 0,
              explanation: 'x = (15 × 24) / 9 = (5 × 24) / 3 = 40.',
            },
            {
              prompt: 'Which ratio is equivalent to 45 minutes : 2 hours?',
              clue: 'Convert 2 hours into 120 minutes first!',
              options: ['3 : 8', '45 : 2', '3 : 4', '9 : 20'],
              correctIndex: 0,
              explanation: '45 min : 120 min = (45 ÷ 15) : (120 ÷ 15) = 3 : 8.',
            },
            {
              prompt: 'If 8 solar panels generate 3.6 kW of power, how much power do 20 identical panels generate?',
              clue: 'Multiply 3.6 kW by (20 / 8) = 2.5.',
              options: ['9.0 kW', '8.4 kW', '7.2 kW', '10.0 kW'],
              correctIndex: 0,
              explanation: 'Power = (3.6 / 8) × 20 = 0.45 × 20 = 9.0 kW.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-3-2',
        moduleCode: 'Module 3.2',
        shortNumber: '3.2',
        title: 'Ratios in Maps & Representative Fractions (RF)',
        cardHeadline: 'Ratios in Maps & Representative Fractions (RF)',
        cardTeaser:
          'Read cartographic map scales, decode unitless Representative Fractions like 1 : 60,00,000, and convert ruler centimeters into real-world kilometers.',
        artworkTheme: 'world-map',
        videoCue: {
          title: '3-Minute Video on Map Scales, Representative Fractions (RF) & Ground Distance',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Learn how 1 : 60,00,000 means 1 cm on the map represents 60,00,000 cm = 60 km on the ground, and how area scales by the SQUARE of the linear map scale!',
          readingParagraphs: [
            'A map’s Representative Fraction (RF), such as 1 : 60,00,000, is a unitless ratio where 1 unit on paper equals 60,00,000 of the SAME units on the Earth’s surface.',
            'Since 1 km = 1,000 m = 1,00,000 cm (10⁵ cm), dividing the RF denominator by 1,00,000 immediately tells you how many kilometers 1 cm on the map represents: 60,00,000 ÷ 1,00,000 = 60 km per cm!',
          ],
          keyTakeaways: [
            '1 km = 1,000 m = 1,00,000 cm (10⁵ cm).',
            'In RF 1 : N, 1 cm on the map = (N ÷ 1,00,000) km on the ground.',
            'Ground Distance = Map Distance (cm) × (km per cm).',
          ],
          workedExample: {
            problem: 'A map of India has Representative Fraction 1 : 60,00,000. If two cities are 4.5 cm apart on the map, what is the actual ground distance between them?',
            steps: [
              'Convert 1 cm on map to km: 60,00,000 cm ÷ 1,00,000 cm/km = 60 km.',
              'So the map scale is 1 cm = 60 km.',
              'For 4.5 cm on the map: Ground Distance = 4.5 × 60 km = 270 km.',
            ],
            answer: '270 km',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Decoding Representative Fraction (RF) 1 : 60,00,000',
              narration:
                'Because 1 km equals 1,00,000 cm, cancelar five zeros from 60,00,000 cm converts 1 cm on paper to 60 km on the ground!',
              boardFormula: '1 km = 1,00,000 cm  ⇒  RF 1 : 60,00,000 means 1 cm = 60 km',
              visualCaption: 'Map ruler measuring 1 cm = 60 km across a cartographic grid',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Converting Map Centimeters to Ground Kilometers',
              narration:
                'Multiply the measured ruler distance in cm by the scale factor (km/cm) to get the real highway or flight distance.',
              boardFormula: 'Actual Distance = Map cm × Scale (km/cm)',
              visualCaption: '4.5 cm map line expanding to 270 km between two cities',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Reverse Mapping: Ground Kilometers to Map Centimeters',
              narration:
                'To plot a 420 km railway on a 1 cm = 60 km map, divide 420 ÷ 60 = 7 cm!',
              boardFormula: 'Map Distance (cm) = Ground Distance (km) ÷ (km per cm)',
              visualCaption: '420 km railway compressing neatly into a 7 cm map segment',
            },
          ],
        },
        simulation: {
          title: 'Map Distance Scaler & RF Converter',
          description:
            'Slide the ruler distance on the map (cm) and the scale factor (km per cm) to compute real geographical distances.',
          interactionType: 'unit-converter',
          defaultControlA: 5,
          defaultControlB: 60,
          controlALabel: 'Map Ruler Distance (cm)',
          controlAMin: 1,
          controlAMax: 25,
          controlBLabel: 'Map Scale (1 cm = k km)',
          controlBMin: 5,
          controlBMax: 150,
          formulaHighlight: 'RF = 1 : (k × 1,00,000) · Ground Distance = cm × k km',
        },
        game: {
          title: 'Navigator Dash',
          subtitle: 'Calculate real-world travel distances and Representative Fractions from map scales!',
          rules: 'Remember that 1 km = 1,00,000 cm.',
          challenges: [
            {
              prompt: 'A map has scale 1 : 25,00,000. How many kilometers on the ground does 1 cm on the map represent?',
              clue: 'Divide 25,00,000 by 1,00,000.',
              options: ['25 km', '2.5 km', '250 km', '0.25 km'],
              correctIndex: 0,
              explanation: '25,00,000 cm ÷ 1,00,000 cm/km = 25 km.',
            },
            {
              prompt: 'On a map where 1 cm = 40 km, two ports are 6.5 cm apart. What is the actual sea distance between them?',
              clue: 'Multiply 6.5 × 40.',
              options: ['260 km', '240 km', '280 km', '250 km'],
              correctIndex: 0,
              explanation: '6.5 × 40 km = 260 km.',
            },
            {
              prompt: 'If the actual distance between Delhi and Jaipur is 280 km, how far apart will they appear on a map with scale 1 cm = 35 km?',
              clue: 'Divide 280 by 35.',
              options: ['8 cm', '7 cm', '8.5 cm', '9 cm'],
              correctIndex: 0,
              explanation: '280 km ÷ 35 km/cm = 8 cm.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-3-3',
        moduleCode: 'Module 3.3',
        shortNumber: '3.3',
        title: 'Ratios with More Than Two Terms',
        cardHeadline: 'Ratios with More Than Two Terms (a : b : c)',
        cardTeaser:
          'Work with 3-term and 4-term ratios (like 1 : 3 : 5 triangle angles or concrete mixes) and link two overlapping ratios a : b and b : c via LCM.',
        artworkTheme: 'hcf-ratio',
        videoCue: {
          title: '3-Minute Video on Multi-Term Ratios (a : b : c) & Bridge Term Alignment',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'See how a multi-term ratio a : b : c means (ka, kb, kc) for a single multiplier k, and how to combine a : b = 2 : 3 and b : c = 4 : 5 into a : b : c = 8 : 12 : 15!',
          readingParagraphs: [
            'A three-part ratio like Cement : Sand : Gravel = 1 : 2 : 4 means that for every 1 bag of cement, you must use 2 bags of sand and 4 bags of gravel (total 1 + 2 + 4 = 7 parts). Scaling any one ingredient by k scales ALL of them by k!',
            'What if you are given two separate ratios that share a middle term, such as a : b = 2 : 3 and b : c = 4 : 5? Match the bridge term b to LCM(3, 4) = 12: scale 2 : 3 → 8 : 12 and 4 : 5 → 12 : 15, yielding the unified ratio a : b : c = 8 : 12 : 15!',
          ],
          keyTakeaways: [
            'In a : b : c, the quantities can be written as k·a, k·b, k·c with total (a + b + c)k.',
            'To combine a : b and b : c, scale both ratios so the common term b equals LCM(b₁, b₂).',
            'Simplest form of a : b : c divides all terms by HCF(a, b, c).',
          ],
          workedExample: {
            problem: 'Combine A : B = 3 : 4 and B : C = 6 : 7 into a single three-term ratio A : B : C.',
            steps: [
              'The bridge term B has values 4 and 6. Find LCM(4, 6) = 12.',
              'Scale A : B = 3 : 4 by ×3 to get 9 : 12.',
              'Scale B : C = 6 : 7 by ×2 to get 12 : 14. Combined ratio A : B : C = 9 : 12 : 14.',
            ],
            answer: 'A : B : C = 9 : 12 : 14',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Three-Term Ratios in Geometry & Mixtures (1 : 3 : 5)',
              narration:
                'When a triangle’s angles are in ratio 1 : 3 : 5, there are 1 + 3 + 5 = 9 total parts sharing 180°, so each part is 20°!',
              boardFormula: '1k + 3k + 5k = 180° ⇒ 9k = 180° ⇒ Angles: 20°, 60°, 100°',
              visualCaption: 'Bar divided into 1, 3, and 5 glowing segments summing to 180°',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Linking Overlapping Ratios A : B and B : C via LCM',
              narration:
                'To merge A : B = 2 : 3 and B : C = 4 : 5, make B equal to LCM(3, 4) = 12 in both ratios.',
              boardFormula: '2:3 = 8:12  and  4:5 = 12:15  ⇒  A:B:C = 8 : 12 : 15',
              visualCaption: 'Two ratio bars locking at common bridge B = 12',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Clearing Fractions in a 3-Term Ratio (1/2 : 1/3 : 1/4)',
              narration:
                'Multiply every fraction by LCM(2, 3, 4) = 12 to transform 1/2 : 1/3 : 1/4 into whole numbers 6 : 4 : 3!',
              boardFormula: '(1/2 : 1/3 : 1/4) × 12 = 6 : 4 : 3',
              visualCaption: 'Fractions multiplying by 12 into whole-number blocks 6 : 4 : 3',
            },
          ],
        },
        simulation: {
          title: 'Multi-Term Bar Divider (a : b : c)',
          description:
            'Adjust ratio parts to partition a total quantity across three proportional components.',
          interactionType: 'hcf-reducer',
          defaultControlA: 3,
          defaultControlB: 5,
          controlALabel: 'Middle Term Ratio (b)',
          controlAMin: 1,
          controlAMax: 10,
          controlBLabel: 'Third Term Ratio (c)',
          controlBMin: 1,
          controlBMax: 10,
          formulaHighlight: 'Total Parts = a + b + c · Share_i = (Part_i / Total) × Whole',
        },
        game: {
          title: 'Recipe & Ratio Scaler',
          subtitle: 'Combine overlapping ratios and scale multi-ingredient mixtures!',
          rules: 'Match the bridge term or sum all ratio parts.',
          challenges: [
            {
              prompt: 'If X : Y = 2 : 5 and Y : Z = 3 : 4, what is the combined ratio X : Y : Z?',
              clue: 'Match Y to LCM(5, 3) = 15.',
              options: ['6 : 15 : 20', '2 : 15 : 4', '6 : 5 : 20', '5 : 15 : 12'],
              correctIndex: 0,
              explanation: 'X : Y = 6 : 15 and Y : Z = 15 : 20 ⇒ X : Y : Z = 6 : 15 : 20.',
            },
            {
              prompt: 'Express the fractional ratio 1/2 : 1/3 : 1/6 as whole numbers in simplest form:',
              clue: 'Multiply all three terms by LCM(2, 3, 6) = 6.',
              options: ['3 : 2 : 1', '2 : 3 : 6', '1 : 2 : 3', '6 : 3 : 2'],
              correctIndex: 0,
              explanation: '(1/2)×6 : (1/3)×6 : (1/6)×6 = 3 : 2 : 1.',
            },
            {
              prompt: 'Bronze is made by mixing Copper, Tin, and Zinc in the ratio 16 : 3 : 1. How many kg of Copper are in a 60 kg bronze statue?',
              clue: 'Total parts = 16 + 3 + 1 = 20.',
              options: ['48 kg', '45 kg', '50 kg', '42 kg'],
              correctIndex: 0,
              explanation: '1 part = 60 ÷ 20 = 3 kg, so Copper = 16 × 3 = 48 kg.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-3-4',
        moduleCode: 'Module 3.4',
        shortNumber: '3.4',
        title: 'Dividing a Whole in a Given Ratio (m : n)',
        cardHeadline: 'Dividing a Whole in a Given Ratio (m : n)',
        cardTeaser:
          'Split any total x into proportional groups m : n using fractional shares m·x/(m+n) and n·x/(m+n).',
        artworkTheme: 'profit-share',
        videoCue: {
          title: '3-Minute Video on Dividing a Whole in Ratio m : n',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Visualize why splitting x in the ratio m : n creates m + n equal unit shares of size x / (m + n).',
          readingParagraphs: [
            'To divide a total quantity x between two partners in the ratio m : n, first count the total number of equal parts: Total Parts = m + n.',
            'Each single part has value x / (m + n). Therefore, the first share is m × [x / (m + n)] and the second share is n × [x / (m + n)]. Notice that the two shares always add back to x!',
          ],
          keyTakeaways: [
            'Total Parts = m + n; Value of 1 Part = x ÷ (m + n).',
            'First Share = (m / (m + n)) × x; Second Share = (n / (m + n)) × x.',
            'Difference between the two shares = (|m − n| / (m + n)) × x.',
          ],
          workedExample: {
            problem: 'Divide ₹4,500 between Asha and Kiran in the ratio 4 : 5.',
            steps: [
              'Total ratio parts = 4 + 5 = 9 parts.',
              'Value of 1 part = ₹4,500 ÷ 9 = ₹500.',
              'Asha’s share (4 parts) = 4 × ₹500 = ₹2,000; Kiran’s share (5 parts) = 5 × ₹500 = ₹2,500.',
            ],
            answer: 'Asha = ₹2,000 · Kiran = ₹2,500',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Why We Divide by (m + n), Not by m or n Alone',
              narration:
                'Every round of distribution hands m units to Partner A and n units to Partner B, consuming (m + n) units per round!',
              boardFormula: 'Number of Rounds (1 Part) = Total x ÷ (m + n)',
              visualCaption: '9 equal blocks of ₹500 splitting into 4 left and 5 right',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Fractional Share Formula: m/(m+n) and n/(m+n)',
              narration:
                'In a 4 : 5 split, the first person gets 4/9 of the whole and the second gets 5/9 of the whole.',
              boardFormula: 'Share₁ = [m / (m + n)] · x · Share₂ = [n / (m + n)] · x',
              visualCaption: 'Pie and bar models highlighting 4/9 and 5/9 shares',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Solving When the Difference Between Shares Is Given',
              narration:
                'If the ratio is 7 : 4 and Partner A gets ₹600 more than Partner B, then (7 − 4) = 3 parts equal ₹600, so 1 part = ₹200!',
              boardFormula: '|m − n| parts = Difference ⇒ 1 part = Diff ÷ |m − n|',
              visualCaption: 'Comparison bracket highlighting the 3 extra parts = ₹600',
            },
          ],
        },
        simulation: {
          title: 'Counter Grouping & Ratio Splitter (m : n)',
          description:
            'Slide m and n to partition ₹3,600 into m + n equal blocks and inspect both fractional shares.',
          interactionType: 'ratio-sharer',
          defaultControlA: 5,
          defaultControlB: 7,
          controlALabel: 'Partner A Ratio (m)',
          controlAMin: 1,
          controlAMax: 15,
          controlBLabel: 'Partner B Ratio (n)',
          controlBMin: 1,
          controlBMax: 15,
          formulaHighlight: 'Share A = m·x/(m+n) · Share B = n·x/(m+n)',
        },
        game: {
          title: 'Profit Splitter',
          subtitle: 'Divide business profits and lengths fairly according to investment ratios!',
          rules: 'Sum the ratio parts first to find the value of 1 part.',
          challenges: [
            {
              prompt: 'Two partners invest in the ratio 3 : 5 and earn a total profit of ₹64,000. What is the larger share?',
              clue: 'Total parts = 8; larger share is 5/8 of ₹64,000.',
              options: ['₹40,000', '₹24,000', '₹45,000', '₹38,400'],
              correctIndex: 0,
              explanation: '1 part = 64,000 ÷ 8 = ₹8,000 ⇒ 5 parts = ₹40,000.',
            },
            {
              prompt: 'A 84 cm wire is bent into a rectangle whose length and breadth are in the ratio 4 : 3. What is the length of the rectangle?',
              clue: 'Semi-perimeter (L + B) = 84 ÷ 2 = 42 cm! Split 42 cm in ratio 4 : 3.',
              options: ['24 cm', '48 cm', '18 cm', '28 cm'],
              correctIndex: 0,
              explanation: 'L + B = 42 cm. With 4 + 3 = 7 parts, 1 part = 6 cm ⇒ Length = 4 × 6 = 24 cm.',
            },
            {
              prompt: 'A sum of money is shared in the ratio 9 : 4. If the first person receives ₹1,500 MORE than the second, what is the total sum?',
              clue: '9 − 4 = 5 parts = ₹1,500 ⇒ 1 part = ₹300; total = 13 parts.',
              options: ['₹3,900', '₹3,600', '₹4,200', '₹2,700'],
              correctIndex: 0,
              explanation: '1 part = 1,500 ÷ 5 = ₹300. Total sum = (9 + 4) × ₹300 = 13 × ₹300 = ₹3,900.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-3-5',
        moduleCode: 'Module 3.5',
        shortNumber: '3.5',
        title: 'Pie Charts & Data Proportions',
        cardHeadline: 'Pie Charts & 360° Data Proportions',
        cardTeaser:
          'Convert proportional data and percentages into central angles of a 360° circle (θ = (Part / Whole) × 360°).',
        artworkTheme: 'angle-sum',
        videoCue: {
          title: '3-Minute Video on Pie Charts & Converting Proportions to 360° Angles',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'See how every slice of a circular pie chart is a direct proportion between the category share (Part / Whole) and the full 360° circle.',
          readingParagraphs: [
            'A pie chart (circle graph) divides a full 360° circle into sectors whose central angles are directly proportional to each category’s share of the total data.',
            'Specifically, Central Angle θ = (Category Value ÷ Total Value) × 360°, or equivalently θ = (Percentage ÷ 100) × 360° = 3.6° per 1%. For example, 25% is 90°, 50% is 180°, and 10% is 36°!',
          ],
          keyTakeaways: [
            'Central Angle θ = (Part ÷ Whole) × 360°.',
            '1% of a pie chart = 360° ÷ 100 = 3.6°; 5% = 18°; 10% = 36°; 25% = 90°.',
            'Conversely, Part = (θ ÷ 360°) × Total.',
          ],
          workedExample: {
            problem: 'In a survey of 120 students, 45 chose Cricket. What is the central angle of the Cricket sector in a pie chart?',
            steps: [
              'Fraction of students choosing Cricket = 45 / 120 = 3 / 8.',
              'Multiply by 360°: θ = (3 / 8) × 360° = 3 × 45° = 135°.',
            ],
            answer: '135° (which is 37.5% of the circle)',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Mapping 100% of Data onto a 360° Circle',
              narration:
                'The whole dataset corresponds to 360°, so every 1% slice subtends an angle of 3.6° at the center.',
              boardFormula: '100% = 360°  ⇒  1% = 3.6°  ·  25% = 90°',
              visualCaption: '360° circular protractor partitioning into coloured data sectors',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'From Frequency Table to Central Angles',
              narration:
                'Divide each frequency by total N and multiply by 360°. All sector angles must sum to exactly 360°!',
              boardFormula: 'θ_i = (f_i / N) × 360°  ·  ∑ θ_i = 360°',
              visualCaption: 'Four angle wedges snapping together into a full 360° pie chart',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Reading Values Back from a Given Sector Angle',
              narration:
                'If the Rent sector measures 72° out of a ₹40,000 monthly budget, Rent is (72°/360°) = 1/5 of ₹40,000 = ₹8,000!',
              boardFormula: 'Value = (θ / 360°) × Total',
              visualCaption: '72° sector highlighting 1/5 of the circle = ₹8,000',
            },
          ],
        },
        simulation: {
          title: 'Pie Sector Angle Builder (360° Converter)',
          description:
            'Adjust category percentage or part/whole values to see the exact central angle θ on a 360° pie chart.',
          interactionType: 'diagonal-splitter',
          defaultControlA: 45,
          defaultControlB: 120,
          controlALabel: 'Category Count (Part)',
          controlAMin: 5,
          controlAMax: 120,
          controlBLabel: 'Total Survey Size (Whole)',
          controlBMin: 40,
          controlBMax: 360,
          formulaHighlight: 'Central Angle θ = (Part ÷ Whole) × 360°',
        },
        game: {
          title: 'Data Slicer',
          subtitle: 'Match survey percentages and fractions to their exact pie chart central angles!',
          rules: 'Use 100% = 360° (so 1% = 3.6°).',
          challenges: [
            {
              prompt: 'What central angle on a pie chart represents 35% of a household budget?',
              clue: 'Multiply 35 × 3.6° (or 25% = 90° plus 10% = 36°).',
              options: ['126°', '120°', '135°', '108°'],
              correctIndex: 0,
              explanation: '35% of 360° = 90° + 36° = 126°.',
            },
            {
              prompt: 'A sector on a pie chart has a central angle of 54°. What percentage of the total data does it represent?',
              clue: 'Divide 54° by 3.6° (or compute (54/360) × 100%).',
              options: ['15%', '18%', '12%', '20%'],
              correctIndex: 0,
              explanation: '(54 / 360) × 100% = (3 / 20) × 100% = 15%.',
            },
            {
              prompt: 'In a school of 720 students, the cycling club is represented by an 80° sector on the pie chart. How many students are in the cycling club?',
              clue: '720 ÷ 360° = 2 students per degree!',
              options: ['160 students', '140 students', '180 students', '120 students'],
              correctIndex: 0,
              explanation: '(80 / 360) × 720 = 80 × 2 = 160 students.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-3-6',
        moduleCode: 'Module 3.6',
        shortNumber: '3.6',
        title: 'Inverse Proportions & Speed-Time-Distance',
        cardHeadline: 'Inverse Proportions & Speed-Time-Distance',
        cardTeaser:
          'Distinguish direct proportion (x/y = k) from inverse proportion (x × y = k) across speed-time journeys, gear teeth, and workforce schedules.',
        artworkTheme: 'inverse-speed',
        videoCue: {
          title: '3-Minute Video on Inverse Proportion (x × y = k) & Speed-Time Problems',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'See why doubling speed halves travel time for a fixed distance (s₁t₁ = s₂t₂ = D), and why multiplying workers by days stays constant for a fixed project.',
          readingParagraphs: [
            'Two quantities x and y are in inverse proportion if multiplying x by k divides y by k, keeping their product constant: x₁ × y₁ = x₂ × y₂ = k.',
            'For a fixed trip of distance D = 240 km, Speed × Time = 240: at 40 km/h it takes 6 hours; at 60 km/h it takes 4 hours; at 80 km/h it takes 3 hours. Never cross-multiply an inverse proportion—equate the products instead!',
          ],
          keyTakeaways: [
            'Inverse Proportion Rule: x₁ × y₁ = x₂ × y₂ = Constant k.',
            'Fixed Distance: Speed₁ × Time₁ = Speed₂ × Time₂ = Distance.',
            'Fixed Work: Workers₁ × Days₁ = Workers₂ × Days₂ = Total Man-Days.',
          ],
          workedExample: {
            problem: 'An express train travelling at 60 km/h completes a journey in 4 hours. What speed is needed to complete the same journey in 3 hours?',
            steps: [
              'Total fixed distance D = Speed₁ × Time₁ = 60 km/h × 4 h = 240 km.',
              'Set Speed₂ × 3 h = 240 km.',
              'Speed₂ = 240 ÷ 3 = 80 km/h.',
            ],
            answer: '80 km/h',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Constant Product Law: x₁ × y₁ = x₂ × y₂',
              narration:
                'In direct proportion the ratio y/x is constant; in inverse proportion the product x × y is constant!',
              boardFormula: 'Direct: y₁/x₁ = y₂/x₂  vs  Inverse: x₁·y₁ = x₂·y₂',
              visualCaption: 'Hyperbola curve x·y = 240 showing rectangles of equal area 240',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Speed × Time = Constant Distance',
              narration:
                'Increasing speed by a factor of 4/3 reduces travel time by 3/4 because (4/3)s × (3/4)t = s·t.',
              boardFormula: 's₁ · t₁ = s₂ · t₂ = Distance D',
              visualCaption: 'Speedometer rising from 60 to 80 km/h as clock drops from 4 h to 3 h',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Pipes, Pumps & Workforce Allocation',
              narration:
                'If 6 pumps fill a reservoir in 10 hours (60 pump-hours), then 12 pumps fill it in 60 ÷ 12 = 5 hours!',
              boardFormula: 'Pumps₁ × Hours₁ = Pumps₂ × Hours₂',
              visualCaption: '12 water pumps filling the tank in half the time of 6 pumps',
            },
          ],
        },
        simulation: {
          title: 'Speed-Time Hyperbola Curve Tracker',
          description:
            'Adjust vehicle speed and fixed trip distance to watch travel time drop inversely along the hyperbola s × t = D.',
          interactionType: 'inverse-speed-curve',
          defaultControlA: 60,
          defaultControlB: 240,
          controlALabel: 'Vehicle Speed (km/h)',
          controlAMin: 20,
          controlAMax: 120,
          controlBLabel: 'Fixed Trip Distance (km)',
          controlBMin: 120,
          controlBMax: 600,
          formulaHighlight: 'Speed × Time = Distance  ⇒  t = D ÷ s',
        },
        game: {
          title: 'Inverse Navigator',
          subtitle: 'Solve travel time, gear ratio, and workforce inverse proportion puzzles!',
          rules: 'Equate products x₁y₁ = x₂y₂ for inverse proportions.',
          challenges: [
            {
              prompt: '15 workers can repair a bridge in 12 days. How many workers are needed to finish the repair in 9 days?',
              clue: 'Total work = 15 × 12 = 180 worker-days.',
              options: ['20 workers', '18 workers', '24 workers', '16 workers'],
              correctIndex: 0,
              explanation: 'Workers = (15 × 12) ÷ 9 = 180 ÷ 9 = 20 workers.',
            },
            {
              prompt: 'A hostel has enough food rations for 120 students for 20 days. If 30 MORE students join the hostel, how many days will the rations last?',
              clue: 'New student count is 120 + 30 = 150 students!',
              options: ['16 days', '15 days', '18 days', '25 days'],
              correctIndex: 0,
              explanation: 'Total ration = 120 × 20 = 2,400 student-days. For 150 students: 2,400 ÷ 150 = 16 days.',
            },
            {
              prompt: 'A driving gear with 36 teeth meshes with a driven gear of 18 teeth. If the driving gear rotates at 100 rpm, how fast does the 18-tooth gear rotate?',
              clue: 'Teeth₁ × RPM₁ = Teeth₂ × RPM₂.',
              options: ['200 rpm', '50 rpm', '150 rpm', '180 rpm'],
              correctIndex: 0,
              explanation: '36 × 100 = 18 × RPM₂ ⇒ RPM₂ = 200 rpm.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-3-7',
        moduleCode: 'Module 3.7',
        shortNumber: '3.7',
        title: 'Advanced Proportional Word Problems',
        cardHeadline: 'Advanced Multi-Step Proportional Word Problems',
        cardTeaser:
          'Solve chain proportions (compound Rule of Three / Pañcarāśika), alloy replacement puzzles, and relative speed problems.',
        artworkTheme: 'coffee-mixer',
        videoCue: {
          title: '3-Minute Video on Compound Proportions (Pañcarāśika) & Mixture Adjustments',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Extend Āryabhaṭa’s Rule of Three to the Rule of Five (Pañcarāśika) where output depends on both workers and days simultaneously.',
          readingParagraphs: [
            'In Indian mathematics (Brahmagupta and Bhāskarāchārya), problems involving three or more Simultaneous variables—such as W workers weaving L meters of cloth in D days—are solved by the Rule of Five (Pañcarāśika).',
            'Since output L is directly proportional to both Workers (W) and Days (D), the quantity L / (W × D) is constant: L₁ / (W₁ × D₁) = L₂ / (W₂ × D₂)!',
          ],
          keyTakeaways: [
            'Compound Work Law: Work₁ / (Workers₁ × Days₁) = Work₂ / (Workers₂ × Days₂).',
            'When adding pure milk/water to a mixture, keep track of the UNCHANGED component first!',
            'Currency Exchange Chain: multiply conversion rates so intermediate units cancel out.',
          ],
          workedExample: {
            problem: 'If 6 weavers weave 72 carpets in 4 days, how many carpets will 10 weavers weave in 6 days?',
            steps: [
              'Find the rate of 1 weaver in 1 day: 72 ÷ (6 × 4) = 72 ÷ 24 = 3 carpets per weaver-day.',
              'Multiply by 10 weavers and 6 days: 3 × 10 × 6 = 180 carpets.',
            ],
            answer: '180 carpets',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Pañcarāśika: The Rule of Five for Multi-Variable Rates',
              narration:
                'Combine workers and days into "worker-days" (W × D) so any compound rate reduces to a single clean proportion!',
              boardFormula: 'Output₁ ÷ (W₁ × D₁) = Output₂ ÷ (W₂ × D₂)',
              visualCaption: 'Weaver-days grid scaling from 6×4 = 24 to 10×6 = 60',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'The Invariant Component Trick in Mixtures',
              narration:
                'When adding water to a 40 L milk-water mixture, the amount of pure MILK does not change—anchor your ratio to the invariant milk!',
              boardFormula: 'Invariant Quantity Stays Constant Before & After Addition',
              visualCaption: 'Mixture vessel showing constant milk block while water level rises',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Dimensional Analysis & Currency Chains',
              narration:
                'Align ratios so matching units cancel diagonally from numerator to denominator.',
              boardFormula: '(A / B) × (B / C) = A / C',
              visualCaption: 'Chain conversion cards canceling intermediate units',
            },
          ],
        },
        simulation: {
          title: 'Compound Proportion Step-Solver',
          description:
            'Adjust workers and days simultaneously to observe how total output scales with worker-days (W × D).',
          interactionType: 'recipe-mixer',
          defaultControlA: 10,
          defaultControlB: 6,
          controlALabel: 'Number of Workers (W)',
          controlAMin: 2,
          controlAMax: 25,
          controlBLabel: 'Number of Days (D)',
          controlBMin: 1,
          controlBMax: 15,
          formulaHighlight: 'Total Output = (Rate per Worker-Day) × W × D',
        },
        game: {
          title: 'Merchant Challenge',
          subtitle: 'Solve multi-step trading, mixture, and compound proportion word problems!',
          rules: 'Use worker-days or anchor to the unchanged mixture ingredient.',
          challenges: [
            {
              prompt: '4 machines produce 200 bolts in 5 hours. How many bolts will 6 machines produce in 8 hours?',
              clue: '200 ÷ (4 × 5) = 10 bolts per machine-hour.',
              options: ['480 bolts', '400 bolts', '450 bolts', '520 bolts'],
              correctIndex: 0,
              explanation: 'Rate = 10 bolts per machine-hour ⇒ 10 × 6 × 8 = 480 bolts.',
            },
            {
              prompt: 'A 45 L mixture has milk and water in the ratio 4 : 1. How much water must be added to make the ratio 3 : 2?',
              clue: 'Milk = 36 L, Water = 9 L. Milk stays 36 L = 3 parts ⇒ 1 part = 12 L ⇒ New water = 24 L.',
              options: ['15 L', '12 L', '18 L', '9 L'],
              correctIndex: 0,
              explanation: 'Original: 36 L milk and 9 L water. For 3 : 2 with 36 L milk, water must be 24 L ⇒ add 24 − 9 = 15 L.',
            },
            {
              prompt: 'If 3 Gold Coins = 8 Silver Coins and 4 Silver Coins = 15 Copper Coins, how many Copper Coins equal 6 Gold Coins?',
              clue: '6 Gold = 16 Silver = 4 × (4 Silver).',
              options: ['60 Copper Coins', '45 Copper Coins', '50 Copper Coins', '75 Copper Coins'],
              correctIndex: 0,
              explanation: '6 Gold = 16 Silver = 4 × 15 Copper = 60 Copper Coins.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-3-8',
        moduleCode: 'Module 3.8',
        shortNumber: '3.8',
        title: 'Chapter Assessment & Questionnaire',
        cardHeadline: 'Global Cartography & Inverse Dynamics Capstone',
        cardTeaser:
          'Synthesize map scales, multi-term ratios, pie charts, and inverse proportions in the Expedition Planner Big Game and Speed-Time Lab.',
        isWrapUpModule: true,
        artworkTheme: 'master-boss',
        videoCue: {
          title: '3-Minute Chapter 3 Review: Maps, Multi-Term Ratios, Pie Charts & Inverse Proportion',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Complete your mastery of Proportional Reasoning-2 before launching the Global Cartography Expedition Planner and 20-Question Assessment.',
          readingParagraphs: [
            'Always ask the fundamental question first: "As x doubles, does y double (Direct: y/x = k) or does y halve (Inverse: x·y = k)?"',
            'Explore the Inverse Proportion Speed-Time Dynamics Lab and Global Cartography Expedition Planner below, then take the randomized Chapter 3 Quiz!',
          ],
          keyTakeaways: [
            'Map RF 1 : N means 1 cm = (N / 10⁵) km.',
            'Multi-term split of x in a : b : c gives unit part = x / (a + b + c).',
            'Pie chart central angle θ = (Part / Whole) × 360°; Inverse proportion: x₁y₁ = x₂y₂.',
          ],
          workedExample: {
            problem: 'On a map with RF 1 : 40,00,000, two towns are 6 cm apart. How long will a car at 80 km/h take to drive between them?',
            steps: [
              '1 cm on map = 40,00,000 ÷ 1,00,000 = 40 km.',
              'Actual distance D = 6 × 40 km = 240 km.',
              'Travel time t = 240 km ÷ 80 km/h = 3 hours.',
            ],
            answer: '240 km distance · 3 hours travel time',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Direct vs. Inverse Decision Compass',
              narration:
                'Map scales, pie charts, and recipe shares are Direct (y/x = k); speed-time and workers-days for fixed tasks are Inverse (x·y = k).',
              boardFormula: 'Direct: x₁/y₁ = x₂/y₂  ·  Inverse: x₁·y₁ = x₂·y₂',
              visualCaption: 'Two-branch decision compass separating Direct and Inverse problems',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Combining Map RF with Speed-Time Logistics',
              narration:
                'Convert map centimeters to ground kilometers first, then divide by speed to plan expedition arrival times.',
              boardFormula: 'Time = (Map cm × Scale km/cm) ÷ Speed',
              visualCaption: 'Expedition route map linking RF ruler to vehicle chronometer',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Ready for the Expedition Planner & 20-Question Quiz',
              narration:
                'Launch the capstone activities and test your mastery with freshly generated questions!',
              boardFormula: 'Chapter 3 Mastery Seal Unlocked',
              visualCaption: 'Golden Cartographer’s Compass glowing on the board',
            },
          ],
        },
        simulation: {
          title: 'Inverse Proportion Speed-Time Dynamics Lab (Big Simulation)',
          isBigSimulation: true,
          description:
            'Simulate complex transport logistics, map distances, pump flow rates, and workforce allocations.',
          interactionType: 'grand-capstone-sim',
          defaultControlA: 75,
          defaultControlB: 300,
          controlALabel: 'Expedition Speed / Flow Rate',
          controlAMin: 25,
          controlAMax: 150,
          controlBLabel: 'Total Ground Distance / Capacity',
          controlBMin: 100,
          controlBMax: 600,
          formulaHighlight: 'RF 1:N · Share = m·x/(∑m) · Inverse: s₁t₁ = s₂t₂',
        },
        game: {
          title: 'Global Cartography & Expedition Planner (Big Game)',
          isBigGame: true,
          subtitle: 'Plan a round-the-world expedition using map scales, supply ratios, and travel speeds!',
          rules: 'Solve all three expedition leg calculations accurately.',
          challenges: [
            {
              prompt: 'Leg 1 (Cartography): Your map has RF 1 : 50,00,000 and Leg 1 measures 7.2 cm on the map. What is the actual ground distance?',
              clue: '1 cm = 50 km; multiply 7.2 × 50.',
              options: ['360 km', '350 km', '320 km', '380 km'],
              correctIndex: 0,
              explanation: '1 cm = 50 km ⇒ 7.2 × 50 = 360 km.',
            },
            {
              prompt: 'Leg 2 (Supply Rationing): You pack 180 kg of expedition supplies split among Food, Water, and Gear in the ratio 3 : 4 : 2. How many kg is Water?',
              clue: 'Total parts = 3 + 4 + 2 = 9.',
              options: ['80 kg', '60 kg', '90 kg', '40 kg'],
              correctIndex: 0,
              explanation: '1 part = 180 ÷ 9 = 20 kg ⇒ Water (4 parts) = 80 kg.',
            },
            {
              prompt: 'Leg 3 (Inverse Speed): To cross the 360 km desert in 4.5 hours instead of 6 hours, what average speed must your rover maintain?',
              clue: 'Divide 360 km by 4.5 hours.',
              options: ['80 km/h', '75 km/h', '90 km/h', '72 km/h'],
              correctIndex: 0,
              explanation: 'Speed = 360 ÷ 4.5 = 80 km/h.',
            },
          ],
        },
      },
    ],
    questionnaire: [
      {
        id: 'p2-ch3-q1',
        questionNumber: 1,
        type: 'mcq',
        prompt: 'If 14 : 21 :: x : 33, what is the value of x?',
        options: ['22', '24', '20', '21'],
        correctIndex: 0,
        explanation: '14 : 21 = 2 : 3, so x = (2/3) × 33 = 22.',
        moduleRef: 'Module 3.1',
      },
      {
        id: 'p2-ch3-q2',
        questionNumber: 2,
        type: 'mcq',
        prompt: 'On a map with Representative Fraction 1 : 30,00,000, what ground distance does 5 cm represent?',
        options: ['150 km', '15 km', '300 km', '1,500 km'],
        correctIndex: 0,
        explanation: '1 cm = 30 km, so 5 cm = 150 km.',
        moduleRef: 'Module 3.2',
      },
      {
        id: 'p2-ch3-q3',
        questionNumber: 3,
        type: 'mcq',
        prompt: 'If A : B = 3 : 5 and B : C = 10 : 7, what is A : B : C in simplest form?',
        options: ['6 : 10 : 7', '3 : 10 : 7', '6 : 5 : 7', '30 : 50 : 35'],
        correctIndex: 0,
        explanation: 'Scale A : B = 3 : 5 by ×2 to get 6 : 10, giving A : B : C = 6 : 10 : 7.',
        moduleRef: 'Module 3.3',
      },
      {
        id: 'p2-ch3-q4',
        questionNumber: 4,
        type: 'mcq',
        prompt: 'The angles of a triangle are in the ratio 2 : 3 : 4. What is the measure of the largest angle?',
        options: ['80°', '60°', '90°', '100°'],
        correctIndex: 0,
        explanation: 'Total parts = 9; 180° ÷ 9 = 20° per part ⇒ largest angle = 4 × 20° = 80°.',
        moduleRef: 'Module 3.4',
      },
      {
        id: 'p2-ch3-q5',
        questionNumber: 5,
        type: 'mcq',
        prompt: 'What is the central angle on a pie chart for a category that makes up 40% of the total?',
        options: ['144°', '120°', '150°', '136°'],
        correctIndex: 0,
        explanation: '0.40 × 360° = 144°.',
        moduleRef: 'Module 3.5',
      },
      {
        id: 'p2-ch3-q6',
        questionNumber: 6,
        type: 'mcq',
        prompt: '8 taps of equal flow rate can fill a tank in 27 minutes. How long will 12 such taps take to fill the tank?',
        options: ['18 minutes', '20 minutes', '16 minutes', '36 minutes'],
        correctIndex: 0,
        explanation: 'Inverse proportion: (8 × 27) ÷ 12 = 216 ÷ 12 = 18 minutes.',
        moduleRef: 'Module 3.6',
      },
      {
        id: 'p2-ch3-q7',
        questionNumber: 7,
        type: 'mcq',
        prompt: 'A cyclist at 15 km/h reaches school in 24 minutes. What speed is required to reach in 20 minutes?',
        options: ['18 km/h', '16 km/h', '20 km/h', '17.5 km/h'],
        correctIndex: 0,
        explanation: 'Speed = (15 × 24) ÷ 20 = 360 ÷ 20 = 18 km/h.',
        moduleRef: 'Module 3.6',
      },
      {
        id: 'p2-ch3-q8',
        questionNumber: 8,
        type: 'mcq',
        prompt: 'Divide ₹2,600 in the ratio 1/2 : 1/3 : 1/4. What is the first share?',
        options: ['₹1,200', '₹800', '₹600', '₹1,300'],
        correctIndex: 0,
        explanation: 'Multiply by 12: ratio is 6 : 4 : 3 (13 parts). 1 part = ₹200 ⇒ first share = 6 × 200 = ₹1,200.',
        moduleRef: 'Module 3.3',
      },
      {
        id: 'p2-ch3-q9',
        questionNumber: 9,
        type: 'mcq',
        prompt: 'If 5 carpenters make 20 chairs in 4 days, how many chairs will 8 carpenters make in 6 days?',
        options: ['48 chairs', '40 chairs', '36 chairs', '54 chairs'],
        correctIndex: 0,
        explanation: 'Rate = 20 ÷ (5 × 4) = 1 chair per carpenter-day ⇒ 1 × 8 × 6 = 48 chairs.',
        moduleRef: 'Module 3.7',
      },
      {
        id: 'p2-ch3-q10',
        questionNumber: 10,
        type: 'mcq',
        prompt: 'Which equation represents an inverse proportion between x and y (with positive constant k)?',
        options: ['x × y = k', 'y = k × x', 'x + y = k', 'x − y = k'],
        correctIndex: 0,
        explanation: 'In an inverse proportion, the product x × y remains constant.',
        moduleRef: 'Module 3.6',
      },
    ],
  },

  // ============================================================================
  // PART II · CHAPTER 7: AREA (Pure 2D Polygons, Dissections & Land Surveying)
  // ============================================================================
  {
    chapterId: 'ch14-area',
    chapterIndex: 7,
    chapterBadgeLabel: 'Ganita Prakash Part II · Chapter 7',
    title: 'Area',
    heroRibbonText: 'Ganita Prakash Class 8 · Part II Master Curriculum',
    heroSubtitle:
      'Cut, shear, and reassemble 2D shapes to derive the area of acute, right, and obtuse triangles (½bh), parallelograms (bh), rhombuses & kites (½d₁d₂), trapeziums (½h(a+b)), and triangulated polygons—with zero circles or 3D shapes.',
    pdfCode: 'Part II · Ch 7',
    pdfUrl: '/assets/aistudio/7.-AREA_a525f2c3.pdf',
    heroBgGradient: 'from-[#064E3B] via-[#047857] to-[#022C22]',
    accentColor: '#10B981',
    challengeBannerTitle: 'Are you ready for the Area Architect & Land Surveyor Challenge?',
    challengeBannerSubtitle:
      'Dissect triangles, parallelograms, rhombuses, and trapeziums, survey irregular multi-sided fields by triangulation, and complete the 20-Question 2D Area Exam.',
    modules: [
      {
        id: 'p2-mod-7-1',
        moduleCode: 'Module 7.1',
        shortNumber: '7.1',
        title: 'Area vs. Perimeter & Enclosing Triangles in Rectangles (½bh)',
        cardHeadline: 'Triangle Area via Rectangle Enclosure (½bh)',
        cardTeaser:
          'Frame any right or acute triangle inside a b × h bounding rectangle and drop an internal altitude to prove why the triangle occupies exactly half the rectangle’s area.',
        artworkTheme: 'congruence',
        videoCue: {
          title: '3-Minute Video on Framing Any Triangle Inside a b × h Rectangle',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Discover why Area = ½ × base × perpendicular height works for every right and acute triangle by splitting its enclosing b × h rectangle into two pairs of congruent right triangles.',
          readingParagraphs: [
            'To find the area of a right-angled triangle with legs b and h, simply complete the b × h rectangle around it. The diagonal splits the rectangle into two congruent right triangles, so each triangle has Area = ½ × b × h.',
            'For any acute triangle ABC with base b and perpendicular altitude h, enclose it in a b × h rectangle and drop the altitude from apex A to foot X on the base. This splits the rectangle into a left sub-rectangle (b₁ × h) and a right sub-rectangle (b₂ × h). Our triangle takes up half of the left box (½b₁h) plus half of the right box (½b₂h) = ½(b₁ + b₂)h = ½bh!',
          ],
          keyTakeaways: [
            'Area of a Rectangle = length × breadth (b × h); Area of a Square = side².',
            'Enclosing an acute triangle in a b × h rectangle proves Area = ½b₁h + ½b₂h = ½bh.',
            'Two shapes can have the exact same area while having completely different perimeters.',
          ],
          workedExample: {
            problem: 'An acute triangle has base BC = 14 cm (split by altitude AX into BX = 5 cm and XC = 9 cm) and perpendicular height AX = 8 cm. Verify that summing the two right triangles gives ½ × 14 × 8.',
            steps: [
              'Left right-triangle area = ½ × 5 × 8 = 20 cm².',
              'Right right-triangle area = ½ × 9 × 8 = 36 cm².',
              'Total Area = 20 + 36 = 56 cm², which equals ½ × 14 × 8 = 56 cm².',
            ],
            answer: '56 cm²',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Right Triangle as Half of a b × h Bounding Rectangle',
              narration:
                'Draw a diagonal across any b × h rectangle: it divides the rectangle into two congruent right-angled triangles, each of area ½ × b × h.',
              boardFormula: 'Area(Right Δ) = ½ × Base (b) × Height (h)',
              visualCaption: 'Rectangle b × h splitting along its diagonal into two congruent right triangles',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Acute Triangle Enclosure: ½b₁h + ½b₂h = ½bh',
              narration:
                'Drop the perpendicular altitude h from the top vertex: it splits the enclosing rectangle into two smaller rectangles, and the triangle takes exactly half of each!',
              boardFormula: '½ b₁ h + ½ b₂ h = ½ (b₁ + b₂) h = ½ b h',
              visualCaption: 'Acute triangle framed inside a b × h rectangle split by altitude h into two halves',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Why Any Side Can Serve as the Base: b₁h₁ = b₂h₂ = b₃h₃',
              narration:
                'A triangle has three sides and three corresponding perpendicular altitudes—and ½ × side × its altitude gives the exact same area for all three!',
              boardFormula: '½ b₁ h₁ = ½ b₂ h₂ = ½ b₃ h₃ = Area(Δ)',
              visualCaption: 'Triangle rotating to show all three base-altitude pairs yielding the same area',
            },
          ],
        },
        simulation: {
          title: 'Triangle Bounding-Box & Dual-Altitude Inspector',
          description:
            'Adjust base b and perpendicular height h to see how the enclosing rectangle (b × h) always has twice the triangle’s area (½bh).',
          interactionType: 'congruence-overlay',
          defaultControlA: 14,
          defaultControlB: 8,
          controlALabel: 'Triangle Base b (cm)',
          controlAMin: 4,
          controlAMax: 24,
          controlBLabel: 'Perpendicular Altitude h (cm)',
          controlBMin: 3,
          controlBMax: 20,
          formulaHighlight: 'Enclosing Rectangle = b × h · Triangle Area = ½ × b × h',
        },
        game: {
          title: 'Triangle Enclosure Sprint',
          subtitle: 'Compute triangle areas and missing altitudes using ½b₁h₁ = ½b₂h₂!',
          rules: 'Always multiply the chosen base by the altitude perpendicular to that base.',
          challenges: [
            {
              prompt: 'An acute triangle is enclosed tightly inside a rectangle of base 16 cm and height 9 cm. What is the area of the triangle?',
              clue: 'Take half the area of the 16 cm × 9 cm enclosing rectangle.',
              options: ['72 cm²', '144 cm²', '64 cm²', '80 cm²'],
              correctIndex: 0,
              explanation: 'Area = ½ × 16 × 9 = 72 cm².',
            },
            {
              prompt: 'A right-angled triangle has perpendicular legs 15 cm and 20 cm, and hypotenuse 25 cm. What is the length of the perpendicular altitude h drawn from the right angle to the 25 cm hypotenuse?',
              clue: 'Area = ½(15)(20) = 150 cm² = ½(25)(h).',
              options: ['12 cm', '10 cm', '15 cm', '12.5 cm'],
              correctIndex: 0,
              explanation: '½ × 25 × h = 150 ⇒ h = 300 ÷ 25 = 12 cm.',
            },
            {
              prompt: 'Two rectangles both have perimeter 24 cm: Rectangle A is 6 cm × 6 cm, and Rectangle B is 10 cm × 2 cm. How do their areas compare?',
              clue: 'Compute 6 × 6 vs 10 × 2.',
              options: [
                'Rectangle A (36 cm²) has a much larger area than Rectangle B (20 cm²)',
                'Both have the same area because their perimeters are equal',
                'Rectangle B has a larger area',
                'Both have area 24 cm²',
              ],
              correctIndex: 0,
              explanation: 'Equal perimeters do not mean equal areas: 6 × 6 = 36 cm² while 10 × 2 = 20 cm².',
            },
          ],
        },
      },
      {
        id: 'p2-mod-7-2',
        moduleCode: 'Module 7.2',
        shortNumber: '7.2',
        title: 'Obtuse Triangles (External Altitude Proof) & Triangle Medians',
        cardHeadline: 'Obtuse Triangle Proof & Median Area Bisection',
        cardTeaser:
          'Prove why Area = ½bh still holds when an obtuse triangle’s altitude lands outside its base, and see why every median slices a triangle into two equal areas.',
        artworkTheme: 'carpenter',
        videoCue: {
          title: '3-Minute Video on Obtuse External Altitudes & Median Area Bisection',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Watch how subtracting the outer right triangle ½dh from the full right triangle ½(b+d)h proves Area = ½bh for any obtuse triangle, and how medians bisect area.',
          readingParagraphs: [
            'When a triangle is obtuse, the perpendicular altitude h from the top vertex C misses the base AB and lands on the extended base line at point X (a distance d past B). Why does Area = ½bh still work? Because ΔABC is the difference between the large right triangle ΔAXC of base (b + d) and the overhanging right triangle ΔBXC of base d: Area = ½(b + d)h − ½dh = ½bh!',
            'Now draw a median AD from vertex A to the midpoint D of base BC. The two smaller triangles ΔABD and ΔADC have equal bases (BD = DC = ½b) and share the exact same perpendicular height h from A—so every median cuts a triangle into two triangles of EQUAL area!',
          ],
          keyTakeaways: [
            'Obtuse Triangle Proof: ½(b + d)h − ½dh = ½bh + ½dh − ½dh = ½bh.',
            'Never measure along the slanted side—extend the base line to meet the perpendicular altitude h at 90°.',
            'A median divides any triangle into two smaller triangles of equal area; all three medians divide it into 6 equal-area triangles!',
          ],
          workedExample: {
            problem: 'In obtuse triangle ABC, base AB = 10 cm. Extending AB by BX = 4 cm meets the perpendicular altitude CX = 6 cm at a 90° angle. Compute Area(ΔAXC) − Area(ΔBXC) and compare with ½ × 10 × 6.',
            steps: [
              'Large right triangle ΔAXC has base 10 + 4 = 14 cm and height 6 cm ⇒ Area = ½ × 14 × 6 = 42 cm².',
              'Outer right triangle ΔBXC has base 4 cm and height 6 cm ⇒ Area = ½ × 4 × 6 = 12 cm².',
              'Subtracting gives Area(ΔABC) = 42 − 12 = 30 cm², which matches ½ × 10 × 6 = 30 cm²!',
            ],
            answer: '30 cm²',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Dropping the External Altitude of an Obtuse Triangle',
              narration:
                'When vertex C leans past B, extend the base line AB horizontally so the plumb-line altitude h from C meets it at 90° at point X.',
              boardFormula: 'Extended Base AX = b + d · Perpendicular Altitude = h',
              visualCaption: 'Obtuse triangle with dashed extended base d and external perpendicular altitude h',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Algebraic Subtraction Proof: ½(b + d)h − ½dh = ½bh',
              narration:
                'Subtracting the unshaded outer right triangle (½dh) from the big right triangle (½(b+d)h) cancels ½dh and leaves ½bh!',
              boardFormula: 'Area = ½(b + d)h − ½dh = ½bh',
              visualCaption: 'Outer right triangle ½dh sliding away to leave the shaded obtuse triangle ½bh',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Why a Median Cuts Any Triangle into Two Equal Areas',
              narration:
                'A median bisects the base into b/2 and b/2 while sharing the same apex height h, so both halves have area ½(b/2)h!',
              boardFormula: 'Area(ΔABD) = Area(ΔADC) = ½ · Area(ΔABC)',
              visualCaption: 'Median splitting a triangle into two equal-area halves with shared altitude h',
            },
          ],
        },
        simulation: {
          title: 'Obtuse Overhang & Median Bisection Lab',
          description:
            'Adjust base b and overhang shift d (with height h = 6 cm) to verify that ½(b+d)h − ½dh always equals ½bh.',
          interactionType: 'diagonal-splitter',
          defaultControlA: 10,
          defaultControlB: 4,
          controlALabel: 'Triangle Base b (cm)',
          controlAMin: 4,
          controlAMax: 20,
          controlBLabel: 'Obtuse Overhang Shift d (cm)',
          controlBMin: 1,
          controlBMax: 15,
          formulaHighlight: '½(b + d)h − ½dh = ½bh · Median splits Area into two equal halves',
        },
        game: {
          title: 'Obtuse & Median Master',
          subtitle: 'Solve obtuse triangle altitudes and median area puzzles!',
          rules: 'Use external perpendicular height for obtuse triangles and equal base ratios for medians.',
          challenges: [
            {
              prompt: 'An obtuse triangle has base AB = 12 cm, slanted side BC = 10 cm, and external perpendicular altitude h = 7 cm (dropped to the extended line AB). What is its area?',
              clue: 'Multiply ½ × base (12) × perpendicular altitude (7).',
              options: ['42 cm²', '60 cm²', '35 cm²', '84 cm²'],
              correctIndex: 0,
              explanation: 'Area = ½ × 12 cm × 7 cm = 42 cm².',
            },
            {
              prompt: 'Triangle ABC has area 64 cm². Median AD connects A to the midpoint D of BC, and E is the midpoint of AD. What is the area of ΔBDE?',
              clue: 'Median AD gives ΔABD = 32 cm²; median BE of ΔABD cuts it in half again!',
              options: ['16 cm²', '32 cm²', '8 cm²', '24 cm²'],
              correctIndex: 0,
              explanation: 'Area(ΔABD) = ½(64) = 32 cm², and since E is the midpoint of AD, Area(ΔBDE) = ½(32) = 16 cm².',
            },
            {
              prompt: 'Point P lies on side BC of ΔABC such that BP : PC = 1 : 3. If the area of ΔABC is 40 cm², what is the area of ΔABP?',
              clue: 'Both triangles share the same altitude from A, so their areas are in the ratio of their bases (1 : 3, or 1/4 of the total).',
              options: ['10 cm²', '13.3 cm²', '20 cm²', '15 cm²'],
              correctIndex: 0,
              explanation: 'Since BP is 1/(1+3) = 1/4 of base BC and shares the same height, Area(ΔABP) = 40 ÷ 4 = 10 cm².',
            },
          ],
        },
      },
      {
        id: 'p2-mod-7-3',
        moduleCode: 'Module 7.3',
        shortNumber: '7.3',
        title: 'Triangles Between Parallel Lines & Gopal’s River Reflection Path',
        cardHeadline: 'Parallel-Line Shearing & Gopal’s River Walk',
        cardTeaser:
          'Slide a triangle’s top vertex along a parallel line without changing its ½bh area, and use mirror reflection to find Gopal’s minimum-perimeter river walk.',
        artworkTheme: 'parallelogram',
        videoCue: {
          title: '3-Minute Video on Parallel-Line Equal Areas & Gopal’s River Reflection Puzzle',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Explore why all triangles sharing base AB and having their third vertex on a parallel line have identical area, and which one has the shortest perimeter!',
          readingParagraphs: [
            'Let base AB lie on line L₁ and let L₂ be a line parallel to L₁ at perpendicular distance h. As vertex C slides anywhere along L₂, the base AB and height h remain completely constant—so every single triangle ΔABC has the exact same area ½bh (Cavalieri’s Shearing Principle)!',
            'In the Ganita Prakash story of Gopal fetching water from a straight river bank L₂ to go from A to B (where A and B are on L₁ parallel to the river), every point C on the river forms a triangle ΔABC of the same area. By reflecting B across the river to B′, the shortest walk AC + CB = AC + CB′ is a straight line—which happens when ΔABC is ISOSCELES (AC = CB)!',
          ],
          keyTakeaways: [
            'All triangles on the same base (or equal bases) and between the same parallel lines have EQUAL area.',
            'Shearing a triangle far to the side keeps its area constant while stretching its perimeter to infinity.',
            'Among all triangles with fixed base b and fixed area (fixed height h), the ISOSCELES triangle has the minimum perimeter!',
          ],
          workedExample: {
            problem: 'Base AB = 16 cm is fixed on line L₁, and vertex C slides along parallel line L₂ at distance h = 6 cm. Find (a) the constant area of ΔABC, and (b) the minimum possible perimeter of ΔABC when C is centered at the midpoint (x = 8 cm).',
            steps: [
              'Constant Area = ½ × 16 × 6 = 48 cm² for every position of C on L₂.',
              'At the symmetric midpoint (8 cm from A and 8 cm from B), each slanted side is √(8² + 6²) = √(64 + 36) = 10 cm.',
              'Minimum Perimeter = 16 + 10 + 10 = 36 cm.',
            ],
            answer: 'Constant Area = 48 cm² · Minimum Perimeter = 36 cm (Isosceles!)',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Sliding Vertex C Along a Parallel Track: Constant ½bh Area',
              narration:
                'Because the perpendicular distance h between two parallel lines never changes, sliding C along the top track preserves the exact same area ½bh.',
              boardFormula: 'L₁ ∥ L₂ (Distance h)  ⇒  Area(ΔABC) = ½ b h = Constant',
              visualCaption: 'Vertex C gliding along parallel line L₂ while the triangle area meter stays locked',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Gopal’s River Walk: Reflecting Point B Across the River',
              narration:
                'Reflect point B across the river line to B′: the bent path A → C → B has the exact same length as A → C → B′, which is shortest when A-C-B′ is a straight line!',
              boardFormula: 'Shortest Path AC + CB  ⇔  Isosceles Triangle (AC = CB)',
              visualCaption: 'Mirror reflection of B across the river line showing straight-line shortest path at midpoint C',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Fixed Area, Minimum Perimeter: The Isosceles Victory',
              narration:
                'At the midpoint x = b/2, both slanted sides equal √((b/2)² + h²), giving the smallest possible perimeter for that area.',
              boardFormula: 'P_min = b + 2√((b/2)² + h²)',
              visualCaption: 'U-shaped perimeter curve hitting its minimum at the isosceles center while area stays flat',
            },
          ],
        },
        simulation: {
          title: 'Parallel Track Shearer & Gopal’s River Reflection Lab',
          description:
            'Slide apex position x along the parallel river line (for base b = 16 cm, height h = 6 cm) to watch Area stay constant at 48 cm² while Perimeter changes.',
          interactionType: 'parallel-ruler',
          defaultControlA: 8,
          defaultControlB: 6,
          controlALabel: 'Apex Horizontal Position x along L₂ (Midpoint = 8 cm)',
          controlAMin: 0,
          controlAMax: 20,
          controlBLabel: 'Parallel Line Distance h (cm)',
          controlBMin: 3,
          controlBMax: 15,
          formulaHighlight: 'Area = ½(16)h (Constant!) · Min Perimeter occurs at Isosceles Midpoint x = 8',
        },
        game: {
          title: 'Parallel Track & River Puzzle',
          subtitle: 'Use parallel-line area invariance and reflection symmetry!',
          rules: 'Triangles sharing a base between parallel lines have equal area; symmetry minimizes perimeter.',
          challenges: [
            {
              prompt: 'Triangles ΔPQR and ΔPQS share the same base PQ = 12 cm, and vertices R and S both lie on a line parallel to PQ at distance 7 cm. If Area(ΔPQR) = 42 cm², what is Area(ΔPQS)?',
              clue: 'Same base PQ and same perpendicular height between parallel lines.',
              options: ['42 cm²', '21 cm²', '84 cm²', 'Cannot be determined'],
              correctIndex: 0,
              explanation: 'Both triangles have base 12 cm and height 7 cm, so both have area ½ × 12 × 7 = 42 cm².',
            },
            {
              prompt: 'Among all triangles with base AB = 10 cm and vertex C on a line parallel to AB at distance 12 cm, which position of C gives the SMALLEST perimeter?',
              clue: 'Use Gopal’s river reflection symmetry.',
              options: [
                'When ΔABC is isosceles (AC = BC = 13 cm, perimeter = 36 cm)',
                'When ∠ABC = 90° (right-angled)',
                'When ΔABC is obtuse',
                'All positions have the same perimeter',
              ],
              correctIndex: 0,
              explanation: 'By reflection symmetry, the isosceles triangle minimizes AC + BC = 2 × √(5² + 12²) = 26 cm, giving perimeter 36 cm.',
            },
            {
              prompt: 'In trapezium ABCD with AB ∥ DC, diagonals AC and BD intersect at O. Why does Area(ΔDAB) equal Area(ΔCAB)?',
              clue: 'Both triangles stand on base AB and have their third vertex (D and C) on the parallel line DC!',
              options: [
                'They share base AB and lie between the same parallel lines AB and DC',
                'Because all trapeziums are rectangles',
                'Because diagonals are always equal',
                'Because O is the midpoint',
              ],
              correctIndex: 0,
              explanation: 'ΔDAB and ΔCAB share base AB and have equal heights between parallel lines AB ∥ DC (and subtracting ΔOAB proves Area(ΔAOD) = Area(ΔBOC)!).',
            },
          ],
        },
      },
      {
        id: 'p2-mod-7-4',
        moduleCode: 'Module 7.4',
        shortNumber: '7.4',
        title: 'Area of Parallelograms: Cut-and-Slide Dissection (b × h)',
        cardHeadline: 'Parallelogram Cut-and-Slide Proof (b × h)',
        cardTeaser:
          'Slice a right-angled triangle off one end of a parallelogram and translate it to the other end to form a b × h rectangle, and use b₁h₁ = b₂h₂ to find missing altitudes.',
        artworkTheme: 'parallelogram',
        videoCue: {
          title: '3-Minute Video on Parallelogram Cut-and-Slide Dissection (Area = b × h)',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'See why a parallelogram’s area depends strictly on its base b and perpendicular height h (never the slanted side!), and how to equate b₁h₁ = b₂h₂.',
          readingParagraphs: [
            'Drop a perpendicular altitude h from vertex D of parallelogram ABCD to base AB at point X. Cutting along DX removes right triangle ΔAXD from the left side; sliding it across to the right side fits seamlessly against BC to form a rectangle of base b and height h! Thus Area(Parallelogram) = b × h.',
            'Alternatively, drawing diagonal AC splits the parallelogram into two congruent triangles, each of area ½bh, which sum to ½bh + ½bh = bh. Because either pair of parallel sides can be chosen as the base, Base₁ × Height₁ = Base₂ × Height₂!',
          ],
          keyTakeaways: [
            'Area of a Parallelogram = Base (b) × Perpendicular Height (h).',
            'When a rectangular frame is sheared sideways into a parallelogram, its perimeter stays constant while its perpendicular height h (and therefore its area!) decreases.',
            'Dual Base-Altitude Identity: b₁ × h₁ = b₂ × h₂ = Area.',
          ],
          workedExample: {
            problem: 'A parallelogram has adjacent sides b₁ = 20 cm and b₂ = 15 cm. If the perpendicular distance between the 20 cm sides is h₁ = 9 cm, find the area of the parallelogram and the perpendicular distance h₂ between the 15 cm sides.',
            steps: [
              'Area = b₁ × h₁ = 20 cm × 9 cm = 180 cm².',
              'Using the 15 cm side as base: 15 × h₂ = 180 cm² ⇒ h₂ = 180 ÷ 15 = 12 cm.',
            ],
            answer: 'Area = 180 cm² · Second altitude h₂ = 12 cm',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Slicing and Translating the Overhanging Right Triangle',
              narration:
                'Cut along the perpendicular altitude h and slide the right triangle to the opposite side: the slanted parallelogram locks into a b × h rectangle!',
              boardFormula: 'Area(Parallelogram) = Area(Rectangle) = b × h',
              visualCaption: 'Right triangle detaching from left of parallelogram and docking on the right',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Shearing a Hinged Rectangular Frame: Constant Perimeter, Shrinking Area',
              narration:
                'Push the top of a hinged rectangular frame sideways: the 4 bar lengths stay unchanged, but the perpendicular height h drops—shrinking the area!',
              boardFormula: 'h < Slant Side s  ⇒  Area(Parallelogram) = b × h < b × s',
              visualCaption: 'Hinged frame tilting from 90° rectangle down to a low-height parallelogram',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Dual Base-Altitude Equation: b₁ × h₁ = b₂ × h₂',
              narration:
                'Rotating the parallelogram onto its shorter side b₂ gives a taller altitude h₂ whose product b₂ × h₂ equals the exact same area b₁ × h₁!',
              boardFormula: 'b₁ × h₁ = b₂ × h₂ = Area',
              visualCaption: 'Parallelogram showing both perpendicular altitudes h₁ and h₂ at 90°',
            },
          ],
        },
        simulation: {
          title: 'Parallelogram Cut-and-Slide Shearer',
          description:
            'Adjust base b and perpendicular height h to watch the cut-and-slide transformation into a b × h rectangle.',
          interactionType: 'carpenter-strips',
          defaultControlA: 18,
          defaultControlB: 9,
          controlALabel: 'Parallelogram Base b (cm)',
          controlAMin: 4,
          controlAMax: 25,
          controlBLabel: 'Perpendicular Altitude h (cm)',
          controlBMin: 3,
          controlBMax: 20,
          formulaHighlight: 'Area = b × h · Dual Altitudes: b₁ × h₁ = b₂ × h₂',
        },
        game: {
          title: 'Parallelogram Dissection Dash',
          subtitle: 'Compute parallelogram areas and missing altitudes!',
          rules: 'Never multiply the two slanted adjacent sides together—always use the perpendicular height.',
          challenges: [
            {
              prompt: 'A parallelogram has base 18 cm, slant side 12 cm, and perpendicular height 9 cm to the 18 cm base. What is its area?',
              clue: 'Multiply base (18) by perpendicular height (9); ignore the 12 cm slant side!',
              options: ['162 cm²', '216 cm²', '108 cm²', '180 cm²'],
              correctIndex: 0,
              explanation: 'Area = 18 cm × 9 cm = 162 cm².',
            },
            {
              prompt: 'Adjacent sides of a parallelogram are 24 cm and 16 cm. If the perpendicular distance between the 24 cm sides is 8 cm, what is the perpendicular distance between the 16 cm sides?',
              clue: 'Area = 24 × 8 = 192 cm² = 16 × h₂.',
              options: ['12 cm', '10 cm', '14 cm', '16 cm'],
              correctIndex: 0,
              explanation: 'h₂ = (24 × 8) ÷ 16 = 192 ÷ 16 = 12 cm.',
            },
            {
              prompt: 'A parallelogram and a rectangle stand on the same base of 14 cm and lie between the same parallel lines (distance 7 cm apart). Which one has the larger perimeter, and how do their areas compare?',
              clue: 'Slant side > perpendicular height 7 cm, while both have area 14 × 7.',
              options: [
                'Their areas are equal (98 cm²), and the parallelogram has a larger perimeter',
                'The parallelogram has a larger area and equal perimeter',
                'The rectangle has a larger area and larger perimeter',
                'Both area and perimeter are equal',
              ],
              correctIndex: 0,
              explanation: 'Both have Area = 14 × 7 = 98 cm², but the parallelogram’s slanted sides are longer than the 7 cm vertical sides of the rectangle.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-7-5',
        moduleCode: 'Module 7.5',
        shortNumber: '7.5',
        title: 'Area of Rhombuses and Kites via Diagonal Dissection (½ d₁ d₂)',
        cardHeadline: 'Area of Rhombuses & Kites (½ × d₁ × d₂)',
        cardTeaser:
          'Cut along the perpendicular diagonals d₁ and d₂ of any rhombus or kite to reassemble the four right triangles into a rectangle of area ½ × d₁ × d₂.',
        artworkTheme: 'rhombus',
        videoCue: {
          title: '3-Minute Video on Rhombus & Kite Diagonal Dissection (Area = ½ d₁ d₂)',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'See why any quadrilateral whose diagonals meet at 90° (rhombus, square, or kite) has Area = ½ × d₁ × d₂, and how to find a rhombus’s altitude by equating b × h = ½ d₁ d₂.',
          readingParagraphs: [
            'In every rhombus and kite, the two diagonals d₁ and d₂ intersect at right angles (90°). Frame the shape inside a bounding rectangle whose sides are parallel to the diagonals: the rectangle has dimensions d₁ by d₂ (area d₁ × d₂), and each of the 4 right triangles of the rhombus or kite occupies half of its corner sub-rectangle—giving Area = ½ × d₁ × d₂!',
            'Equivalently, slicing a rhombus along its diagonals creates 4 congruent right triangles with legs ½d₁ and ½d₂; reassembling them forms a rectangle of base d₁ and height ½d₂! And because a rhombus is also a parallelogram of side s and altitude h, we can equate s × h = ½ d₁ d₂ to find its perpendicular height h.',
          ],
          keyTakeaways: [
            'Area of any Rhombus or Kite = ½ × d₁ × d₂ (half the product of its perpendicular diagonals).',
            'For a Square of diagonal d (where d₁ = d₂ = d): Area = ½ d².',
            'In a Rhombus of side s and altitude h: Area = s × h = ½ × d₁ × d₂.',
          ],
          workedExample: {
            problem: 'A rhombus has diagonals d₁ = 24 cm and d₂ = 10 cm (so its side length is √(12² + 5²) = 13 cm). Find its area and its perpendicular altitude h.',
            steps: [
              'Area = ½ × d₁ × d₂ = ½ × 24 × 10 = 120 cm².',
              'Since Area also equals side × altitude (13 × h = 120), altitude h = 120 / 13 ≈ 9.23 cm.',
            ],
            answer: 'Area = 120 cm² · Altitude h = 120/13 cm (≈ 9.23 cm)',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Framing a Rhombus or Kite Inside a d₁ × d₂ Bounding Box',
              narration:
                'Because the diagonals d₁ and d₂ meet at 90°, the four inner right triangles are mirrored by four identical outer right triangles inside the d₁ × d₂ box.',
              boardFormula: 'Area(Rhombus / Kite) = ½ × d₁ × d₂',
              visualCaption: 'Rhombus and kite enclosed in a d₁ × d₂ rectangle showing exact 1:1 triangle pairing',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Cut-and-Slide Rearrangement into a d₁ × (½d₂) Rectangle',
              narration:
                'Cut the bottom two right triangles of the rhombus and flip them up beside the top half to form a neat rectangle of width d₁ and height ½d₂!',
              boardFormula: 'Rectangle Width = d₁ · Height = ½d₂  ⇒  Area = ½ d₁ d₂',
              visualCaption: 'Four right triangles of a rhombus reassembling into a d₁ by ½d₂ rectangle',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Connecting Both Rhombus Formulas: Side × Altitude = ½ d₁ d₂',
              narration:
                'Use Baudhāyana-Pythagoras on the half-diagonals to find side s = √((d₁/2)² + (d₂/2)²), then divide Area by s to get the altitude h!',
              boardFormula: 's = √((d₁/2)² + (d₂/2)²)  ·  h = (½ d₁ d₂) ÷ s',
              visualCaption: 'Rhombus highlighting diagonals (16, 12), side 10 cm, and perpendicular altitude 9.6 cm',
            },
          ],
        },
        simulation: {
          title: 'Rhombus & Kite Diagonal Dissection Studio',
          description:
            'Dial perpendicular diagonals d₁ and d₂ to inspect the d₁ × d₂ bounding rectangle, rhombus area ½d₁d₂, side length, and altitude.',
          interactionType: 'compass-rhombus',
          defaultControlA: 16,
          defaultControlB: 12,
          controlALabel: 'First Diagonal d₁ (cm)',
          controlAMin: 4,
          controlAMax: 30,
          controlBLabel: 'Second Diagonal d₂ (cm)',
          controlBMin: 4,
          controlBMax: 24,
          formulaHighlight: 'Area = ½ × d₁ × d₂ · Side s = √((d₁/2)² + (d₂/2)²)',
        },
        game: {
          title: 'Diagonal Dissector',
          subtitle: 'Calculate rhombus, kite, and square areas from their diagonals!',
          rules: 'Multiply the two perpendicular diagonals and divide by 2.',
          challenges: [
            {
              prompt: 'A kite has perpendicular diagonals of lengths 18 cm and 24 cm. What is its area?',
              clue: '½ × 18 × 24.',
              options: ['216 cm²', '432 cm²', '196 cm²', '208 cm²'],
              correctIndex: 0,
              explanation: 'Area = ½ × 18 × 24 = 9 × 24 = 216 cm².',
            },
            {
              prompt: 'A rhombus has diagonals 16 cm and 12 cm (so each side is 10 cm). What is its perpendicular altitude h?',
              clue: 'Area = ½(16)(12) = 96 cm² = 10 × h.',
              options: ['9.6 cm', '9.2 cm', '10 cm', '8.4 cm'],
              correctIndex: 0,
              explanation: 'Area = 96 cm². Since Side × h = 10h = 96, h = 9.6 cm.',
            },
            {
              prompt: 'What is the area of a square whose diagonal measures d = 10 cm?',
              clue: 'A square is a rhombus with d₁ = d₂ = 10 cm: Area = ½ × 10 × 10.',
              options: ['50 cm²', '100 cm²', '25 cm²', '40 cm²'],
              correctIndex: 0,
              explanation: 'Area = ½ d² = ½ × 10² = 50 cm².',
            },
          ],
        },
      },
      {
        id: 'p2-mod-7-6',
        moduleCode: 'Module 7.6',
        shortNumber: '7.6',
        title: 'Area of Trapeziums: Three Visual Dissection Proofs (½ h (a + b))',
        cardHeadline: 'Area of Trapeziums (½ × h × (a + b))',
        cardTeaser:
          'Master all three Ganita Prakash proofs of Area = ½h(a + b): doubling two trapeziums into a parallelogram, diagonal splitting into two triangles, and midpoint-hinge rotation.',
        artworkTheme: 'kite-trap',
        videoCue: {
          title: '3-Minute Video on Three Visual Proofs of Trapezium Area ½h(a + b)',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Prove Area(Trapezium) = ½ × h × (a + b) three ways: (1) joining an inverted twin into an (a+b) × h parallelogram, (2) diagonal splitting into ½ah + ½bh, and (3) slicing at half-height ½h!',
          readingParagraphs: [
            'Proof 1 (Doubled Parallelogram): Take two identical trapeziums with parallel sides a and b and height h. Flip the second one upside down and place it beside the first: the top and bottom edges both become (a + b), forming a parallelogram of area (a + b) × h. Thus one trapezium has Area = ½ × h × (a + b)!',
            'Proof 2 (Diagonal Split): Draw one diagonal to divide the trapezium into two triangles of height h and bases a and b. Their areas sum to ½ah + ½bh = ½h(a + b). Proof 3 (Midpoint Cut): Slice horizontally at half-height (½h) and rotate the top pieces down to form a parallelogram of base (a + b) and height ½h!',
          ],
          keyTakeaways: [
            'Area of a Trapezium = ½ × h × (a + b) = (Average of Parallel Sides) × Perpendicular Height.',
            'Doubling a trapezium (with one inverted) creates a parallelogram of base (a + b) and height h.',
            'To find a missing parallel side: a + b = (2 × Area) ÷ h.',
          ],
          workedExample: {
            problem: 'An irrigation canal cross-section is a trapezium with top width a = 15 m, bottom width b = 9 m, and depth (perpendicular height) h = 4 m. Find its cross-sectional area, and find b if the area were 60 m² with a = 15 m and h = 4 m.',
            steps: [
              'Area = ½ × h × (a + b) = ½ × 4 × (15 + 9) = 2 × 24 = 48 m².',
              'If Area = 60 m²: ½ × 4 × (15 + b) = 60 ⇒ 2(15 + b) = 60 ⇒ 15 + b = 30 ⇒ b = 15 m.',
            ],
            answer: 'Area = 48 m²',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Proof 1: Flipping a Twin Trapezium into an (a + b) × h Parallelogram',
              narration:
                'Clone the trapezium, rotate the twin 180°, and lock their slanted sides together: you get a parallelogram of base (a + b) and height h!',
              boardFormula: '2 × Area(Trapezium) = (a + b) × h  ⇒  Area = ½ h (a + b)',
              visualCaption: 'Two congruent trapeziums locking into an (a + b) × h parallelogram',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Proof 2: Diagonal Decomposition into Two Triangles (½ah + ½bh)',
              narration:
                'A single diagonal splits the trapezium into a bottom triangle of base a and height h, and a top triangle of base b and height h.',
              boardFormula: 'Area = ½ a h + ½ b h = ½ h (a + b)',
              visualCaption: 'Trapezium splitting along its diagonal into two triangles of shared altitude h',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Proof 3: Mid-Height Horizontal Cut into base (a + b) and height ½h',
              narration:
                'Cut horizontally through the midpoints of the slanted sides and hinge the top half down: it forms a parallelogram of base (a + b) and height ½h!',
              boardFormula: 'Average Base ½(a + b) × Height h = Area',
              visualCaption: 'Trapezium hinged at midpoints folding into a single strip of height ½h',
            },
          ],
        },
        simulation: {
          title: 'Trapezium Twin-Folder & Dissection Lab',
          description:
            'Adjust sum of parallel bases (a + b) and perpendicular height h to watch two trapeziums lock into an (a + b) × h parallelogram.',
          interactionType: 'trapezium-folder',
          defaultControlA: 24,
          defaultControlB: 8,
          controlALabel: 'Sum of Parallel Bases (a + b) (cm)',
          controlAMin: 8,
          controlAMax: 40,
          controlBLabel: 'Perpendicular Height h (cm)',
          controlBMin: 2,
          controlBMax: 20,
          formulaHighlight: 'Doubled Parallelogram = (a + b)h · Single Trapezium = ½ h (a + b)',
        },
        game: {
          title: 'Trapezium Builder',
          subtitle: 'Find trapezium areas, canal depths, and missing parallel bases!',
          rules: 'Multiply average of parallel bases ½(a + b) by perpendicular height h.',
          challenges: [
            {
              prompt: 'A trapezium has parallel sides a = 13 cm and b = 21 cm, and perpendicular height h = 10 cm. What is its area?',
              clue: '½ × 10 × (13 + 21).',
              options: ['170 cm²', '340 cm²', '160 cm²', '180 cm²'],
              correctIndex: 0,
              explanation: 'Area = 5 × 34 = 170 cm².',
            },
            {
              prompt: 'The area of a trapezium is 108 cm², its height is 9 cm, and one of its parallel sides is 10 cm. Find the length of the other parallel side.',
              clue: '½ × 9 × (10 + b) = 108 ⇒ 10 + b = 216 ÷ 9 = 24.',
              options: ['14 cm', '12 cm', '16 cm', '18 cm'],
              correctIndex: 0,
              explanation: '10 + b = (2 × 108) ÷ 9 = 24 ⇒ b = 14 cm.',
            },
            {
              prompt: 'When two identical trapeziums with parallel sides 8 cm and 14 cm and height 6 cm are joined to form a parallelogram, what are the base and area of that parallelogram?',
              clue: 'Base = 8 + 14 = 22 cm; Area = 22 × 6.',
              options: [
                'Base = 22 cm, Area = 132 cm² (so one trapezium is 66 cm²)',
                'Base = 14 cm, Area = 84 cm²',
                'Base = 22 cm, Area = 66 cm²',
                'Base = 11 cm, Area = 66 cm²',
              ],
              correctIndex: 0,
              explanation: 'The combined parallelogram has base 8 + 14 = 22 cm and area 22 × 6 = 132 cm².',
            },
          ],
        },
      },
      {
        id: 'p2-mod-7-7',
        moduleCode: 'Module 7.7',
        shortNumber: '7.7',
        title: 'Polygon Triangulation, Surveyor Offsets & Square-Unit Land Conversions',
        cardHeadline: 'Polygon Triangulation & Land Unit Conversions',
        cardTeaser:
          'Survey irregular quadrilaterals (½d(h₁ + h₂)) and multi-sided fields by baseline triangulation, and convert cm², m², hectares, acres, and Indian land units.',
        artworkTheme: 'quad-tree',
        videoCue: {
          title: '3-Minute Video on Polygon Triangulation, Surveyor’s Baseline & Land Units',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Learn how land surveyors measure any irregular quadrilateral or pentagon using a diagonal baseline and perpendicular offsets, and why 1 m² = 10,000 cm²!',
          readingParagraphs: [
            'To find the area of a general quadrilateral ABCD, draw diagonal AC of length d and drop perpendicular offsets h₁ and h₂ from opposite vertices B and D to AC. By the distributive property, Area = ½dh₁ + ½dh₂ = ½ × d × (h₁ + h₂)! More generally, any n-sided polygon can be triangulated into (n − 2) triangles or surveyed along a baseline into right triangles and right trapeziums.',
            'When converting square units, remember to SQUARE the linear conversion factor! Since 1 m = 100 cm, a 1 m × 1 m square contains 100 × 100 = 10,000 cm². Similarly, 1 inch = 2.54 cm ⇒ 1 in² = 2.54² = 6.4516 cm²; 1 hectare = 100 m × 100 m = 10,000 m²; and 1 acre = 43,560 ft² ≈ 4,047 m².',
          ],
          keyTakeaways: [
            'General Quadrilateral Area = ½ × d × (h₁ + h₂), where d is a diagonal and h₁, h₂ are perpendicular offsets.',
            'Square-Unit Law: If 1 unit A = k units B in length, then 1 sq unit A = k² sq units B in area!',
            '1 m² = 10,000 cm²; 1 km² = 100 hectares = 1,000,000 m²; 1 hectare = 10,000 m².',
          ],
          workedExample: {
            problem: 'An agricultural plot ABCD has diagonal d = 40 m and perpendicular offsets h₁ = 15 m and h₂ = 25 m from B and D. Find its area in m², in hectares, and in cm².',
            steps: [
              'Area in m² = ½ × 40 × (15 + 25) = 20 × 40 = 800 m².',
              'Area in hectares = 800 ÷ 10,000 = 0.08 hectares.',
              'Area in cm² = 800 × 10,000 = 8,000,000 cm².',
            ],
            answer: '800 m² = 0.08 hectares = 8,000,000 cm²',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Quadrilateral Diagonal-Offset Formula: ½ d (h₁ + h₂)',
              narration:
                'Drawing diagonal d splits any quadrilateral into two triangles sharing base d, whose areas add by distributivity to ½ d (h₁ + h₂).',
              boardFormula: 'Area = ½ d h₁ + ½ d h₂ = ½ d (h₁ + h₂)',
              visualCaption: 'Quadrilateral field with central rope diagonal d and perpendicular bamboo offsets h₁, h₂',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Surveyor’s Field Baseline: Right Triangles & Trapeziums',
              narration:
                'For a 5- or 6-sided farm plot, drop perpendiculars from every corner to one main diagonal baseline to slice the plot into right triangles and right trapeziums.',
              boardFormula: 'Total Polygon Area = ∑ Area(Right Triangles) + ∑ Area(Right Trapeziums)',
              visualCaption: 'Pentagonal field partitioned along a surveyor baseline into triangles and trapeziums',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Why Square Units Multiply by k²: 1 m² = 10,000 cm²',
              narration:
                'Because both length and width scale by 100 when converting meters to centimeters, area scales by 100² = 10,000!',
              boardFormula: '1 m² = (100 cm)² = 10,000 cm² · 1 Hectare = (100 m)² = 10,000 m²',
              visualCaption: '1 m × 1 m square subdividing into 100 × 100 = 10,000 unit cm² tiles',
            },
          ],
        },
        simulation: {
          title: 'Polygon Offset Surveyor & Land Unit Converter',
          description:
            'Adjust diagonal baseline d (m) and sum of perpendicular offsets (h₁ + h₂) (m) to calculate plot area in m², cm², and hectares.',
          interactionType: 'quad-venn-tree',
          defaultControlA: 40,
          defaultControlB: 30,
          controlALabel: 'Main Diagonal Baseline d (m)',
          controlAMin: 10,
          controlAMax: 60,
          controlBLabel: 'Sum of Perpendicular Offsets h₁ + h₂ (m)',
          controlBMin: 6,
          controlBMax: 50,
          formulaHighlight: 'Area = ½ d (h₁ + h₂) m² · 1 Hectare = 10,000 m² · 1 m² = 10,000 cm²',
        },
        game: {
          title: 'Master Land Surveyor',
          subtitle: 'Survey triangulated polygons and convert square land units!',
          rules: 'Use ½d(h₁+h₂) for quadrilaterals and remember to square linear conversion factors.',
          challenges: [
            {
              prompt: 'A quadrilateral park has a diagonal of 30 m, and the perpendiculars to this diagonal from the opposite corners are 11 m and 9 m. What is the park’s area?',
              clue: '½ × 30 × (11 + 9).',
              options: ['300 m²', '270 m²', '330 m²', '600 m²'],
              correctIndex: 0,
              explanation: 'Area = ½ × 30 × 20 = 300 m².',
            },
            {
              prompt: 'How many square centimeters (cm²) are there in 3.5 m²?',
              clue: 'Multiply by 100² = 10,000.',
              options: ['35,000 cm²', '350 cm²', '3,500 cm²', '3,50,000 cm²'],
              correctIndex: 0,
              explanation: '3.5 × 10,000 = 35,000 cm².',
            },
            {
              prompt: 'A rectangular orchard is 250 m long and 160 m wide. What is its area in hectares (where 1 hectare = 10,000 m²)?',
              clue: '250 × 160 = 40,000 m²; divide by 10,000.',
              options: ['4 hectares', '40 hectares', '0.4 hectares', '16 hectares'],
              correctIndex: 0,
              explanation: 'Area = 250 × 160 = 40,000 m² = 4 hectares.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-7-8',
        moduleCode: 'Module 7.8',
        shortNumber: '7.8',
        title: 'Chapter 7 Capstone & 20-Question 2D Area Assessment',
        cardHeadline: '2D Area Architect & Land Surveyor Capstone',
        cardTeaser:
          'Synthesize all 2D polygon dissections—triangles (½bh), medians, Gopal’s river walk, parallelograms (bh), rhombuses/kites (½d₁d₂), trapeziums (½h(a+b)), and triangulation—in the Capstone Studio and 20-Question Exam.',
        isWrapUpModule: true,
        artworkTheme: 'master-boss',
        videoCue: {
          title: '3-Minute Chapter 7 Synthesis: The Complete Family Tree of 2D Polygon Areas',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'See how every 2D area formula in Chapter 7 flows from cutting and sliding shapes back into a rectangle before launching the Area Architect Capstone and 20-Question Exam!',
          readingParagraphs: [
            'Every 2D area formula in Ganita Prakash Chapter 7 is connected by visual cut-and-slide dissection: framing a triangle inside a rectangle gives ½bh; sliding a right triangle across a parallelogram gives bh; framing a rhombus or kite inside a d₁ × d₂ rectangle gives ½d₁d₂; and joining two identical trapeziums into a parallelogram gives ½h(a + b).',
            'Furthermore, any multi-sided polygon can be triangulated into non-overlapping triangles, and any uniform-width path or framed border can be computed by subtracting inner area from outer area!',
          ],
          keyTakeaways: [
            'Triangle = ½bh (acute, right, or obtuse); Medians split area equally; Isosceles minimizes perimeter between parallel lines.',
            'Parallelogram = bh; Rhombus & Kite = ½d₁d₂; Trapezium = ½h(a + b).',
            'General Quadrilateral = ½d(h₁ + h₂); 1 m² = 10,000 cm²; 1 hectare = 10,000 m².',
          ],
          workedExample: {
            problem: 'A rectangular park 30 m × 20 m has a 2 m wide gravel path running all around the inside of its boundary. Find the area of the gravel path and the remaining inner lawn area.',
            steps: [
              'Outer park area = 30 m × 20 m = 600 m².',
              'Inner lawn dimensions (subtracting 2 m from each side): (30 − 4) m × (20 − 4) m = 26 m × 16 m = 416 m².',
              'Gravel path area = 600 m² − 416 m² = 184 m².',
            ],
            answer: 'Gravel Path Area = 184 m² · Inner Lawn Area = 416 m²',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'The Unified Family Tree of 2D Polygon Dissections',
              narration:
                'Every 2D polygon dissects into rectangles and triangles: Rectangle (bh) → Triangle (½bh) → Parallelogram (bh) → Rhombus/Kite (½d₁d₂) → Trapezium (½h(a+b)).',
              boardFormula: 'bh  ·  ½bh  ·  ½d₁d₂  ·  ½h(a + b)  ·  ½d(h₁ + h₂)',
              visualCaption: 'Five 2D polygons transforming via cut-and-slide dissections from a base rectangle',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Framed Borders & Crossroads Paths by Area Subtraction',
              narration:
                'For a uniform path around a rectangular garden or two perpendicular crossroads across a field, subtract the inner unshaded area (or overlap square) from the total area!',
              boardFormula: 'Path Area = Area(Outer) − Area(Inner)',
              visualCaption: 'Rectangular garden highlighting outer boundary, uniform path border, and inner lawn',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Area Architect & 20-Question 2D Area Assessment Ready',
              narration:
                'Test your dissections in the Land Surveyor Sandbox and complete the randomized 20-Question Chapter 7 Assessment!',
              boardFormula: 'Chapter 7 Mastery Seal Unlocked',
              visualCaption: 'Golden Surveyor’s Triangulation Seal glowing on the board',
            },
          ],
        },
        simulation: {
          title: 'Śulba-Sūtra 2D Shape Dissection & Land Surveyor Sandbox (Big Simulation)',
          isBigSimulation: true,
          description:
            'Explore live 2D area dissections across triangles, parallelograms, rhombuses, trapeziums, and triangulated land plots.',
          interactionType: 'grand-capstone-sim',
          defaultControlA: 20,
          defaultControlB: 12,
          controlALabel: 'Primary Base / Diagonal d₁ (cm or m)',
          controlAMin: 4,
          controlAMax: 40,
          controlBLabel: 'Perpendicular Height h / Diagonal d₂ (cm or m)',
          controlBMin: 4,
          controlBMax: 30,
          formulaHighlight: 'Parallelogram = bh · Triangle = ½bh · Rhombus/Kite = ½d₁d₂ · Trapezium = ½h(a+b)',
        },
        game: {
          title: 'Area Architect & Land Surveyor Challenge (Big Game)',
          isBigGame: true,
          subtitle: 'Survey trapezium fields, rhombus plazas, and bordered rectangular parks!',
          rules: 'Complete all three 2D land-surveying stages to earn the Chapter 7 Mastery Seal.',
          challenges: [
            {
              prompt: 'Stage 1 (Trapezium & Rhombus Plaza): A trapezium courtyard has parallel sides 25 m and 15 m, and perpendicular width 14 m. Inside it sits a rhombus tile mosaic with diagonals 16 m and 12 m. What is the remaining courtyard area outside the rhombus?',
              clue: 'Trapezium = ½(14)(25 + 15) = 280 m²; Rhombus = ½(16)(12) = 96 m².',
              options: ['184 m²', '194 m²', '280 m²', '96 m²'],
              correctIndex: 0,
              explanation: '280 m² − 96 m² = 184 m².',
            },
            {
              prompt: 'Stage 2 (Park Border Path): A rectangular lawn is 20 m × 14 m, surrounded on the outside by a uniform 2 m wide footpath. What is the area of the footpath?',
              clue: 'Outer rectangle is (20+4) × (14+4) = 24 × 18 = 432 m²; subtract 20 × 14 = 280 m².',
              options: ['152 m²', '136 m²', '144 m²', '160 m²'],
              correctIndex: 0,
              explanation: '432 m² − 280 m² = 152 m².',
            },
            {
              prompt: 'Stage 3 (Triangulated Pentagon Barn): A pentagon-shaped barn wall consists of a 12 m × 7 m rectangle topped by a triangular roof of base 12 m and perpendicular height 4 m. What is the total wall area?',
              clue: 'Rectangle (84 m²) + Triangle (½ × 12 × 4 = 24 m²).',
              options: ['108 m²', '96 m²', '132 m²', '104 m²'],
              correctIndex: 0,
              explanation: '84 m² + 24 m² = 108 m².',
            },
          ],
        },
      },
    ],
    questionnaire: [
      {
        id: 'p2-ch7-q1',
        questionNumber: 1,
        type: 'mcq',
        prompt: 'A parallelogram has base 16 cm, slant side 11 cm, and perpendicular height 7 cm. What is its area?',
        options: ['112 cm²', '176 cm²', '56 cm²', '77 cm²'],
        correctIndex: 0,
        explanation: 'Area = base × perpendicular height = 16 × 7 = 112 cm².',
        moduleRef: 'Module 7.4',
      },
      {
        id: 'p2-ch7-q2',
        questionNumber: 2,
        type: 'mcq',
        prompt: 'What is the area of an obtuse triangle with base 18 cm and external perpendicular altitude 11 cm?',
        options: ['99 cm²', '198 cm²', '88 cm²', '108 cm²'],
        correctIndex: 0,
        explanation: 'Area = ½ × 18 × 11 = 99 cm².',
        moduleRef: 'Module 7.2',
      },
      {
        id: 'p2-ch7-q3',
        questionNumber: 3,
        type: 'mcq',
        prompt: 'A trapezium has parallel sides 11 cm and 19 cm, and area 120 cm². What is its perpendicular height h?',
        options: ['8 cm', '6 cm', '10 cm', '4 cm'],
        correctIndex: 0,
        explanation: '½(11 + 19)h = 15h = 120 ⇒ h = 8 cm.',
        moduleRef: 'Module 7.6',
      },
      {
        id: 'p2-ch7-q4',
        questionNumber: 4,
        type: 'mcq',
        prompt: 'The perpendicular diagonals of a rhombus are 14 cm and 20 cm. What is its area?',
        options: ['140 cm²', '280 cm²', '70 cm²', '160 cm²'],
        correctIndex: 0,
        explanation: 'Area = ½ × d₁ × d₂ = ½ × 14 × 20 = 140 cm².',
        moduleRef: 'Module 7.5',
      },
      {
        id: 'p2-ch7-q5',
        questionNumber: 5,
        type: 'mcq',
        prompt: 'A quadrilateral field has diagonal 20 m, and perpendicular offsets to it from opposite vertices are 6 m and 9 m. What is its area?',
        options: ['150 m²', '300 m²', '120 m²', '180 m²'],
        correctIndex: 0,
        explanation: 'Area = ½ × 20 × (6 + 9) = 10 × 15 = 150 m².',
        moduleRef: 'Module 7.7',
      },
      {
        id: 'p2-ch7-q6',
        questionNumber: 6,
        type: 'mcq',
        prompt: 'In ΔABC, area is 72 cm² and AD is a median from A to the midpoint D of side BC. What is the area of ΔABD?',
        options: ['36 cm²', '24 cm²', '48 cm²', '18 cm²'],
        correctIndex: 0,
        explanation: 'A median divides any triangle into two smaller triangles of equal area: 72 ÷ 2 = 36 cm².',
        moduleRef: 'Module 7.2',
      },
      {
        id: 'p2-ch7-q7',
        questionNumber: 7,
        type: 'mcq',
        prompt: 'Among all triangles standing on a fixed base AB with their third vertex C on a line parallel to AB, which triangle has the MINIMUM perimeter?',
        options: [
          'The isosceles triangle (AC = BC)',
          'The right-angled triangle',
          'The most obtuse triangle',
          'All have the same perimeter',
        ],
        correctIndex: 0,
        explanation: 'By Gopal’s river reflection principle, all such triangles have equal area, and the isosceles one has minimum perimeter.',
        moduleRef: 'Module 7.3',
      },
      {
        id: 'p2-ch7-q8',
        questionNumber: 8,
        type: 'mcq',
        prompt: 'Adjacent sides of a parallelogram are 15 cm and 10 cm. If the perpendicular height to the 15 cm base is 6 cm, what is the perpendicular height to the 10 cm base?',
        options: ['9 cm', '4 cm', '8 cm', '12 cm'],
        correctIndex: 0,
        explanation: 'b₁h₁ = b₂h₂ ⇒ 15 × 6 = 90 cm² = 10 × h₂ ⇒ h₂ = 9 cm.',
        moduleRef: 'Module 7.4',
      },
      {
        id: 'p2-ch7-q9',
        questionNumber: 9,
        type: 'mcq',
        prompt: 'How many square centimeters (cm²) are equal to 1 square meter (1 m²)?',
        options: ['10,000 cm²', '100 cm²', '1,000 cm²', '1,00,000 cm²'],
        correctIndex: 0,
        explanation: '1 m = 100 cm ⇒ 1 m² = 100 cm × 100 cm = 10,000 cm².',
        moduleRef: 'Module 7.7',
      },
      {
        id: 'p2-ch7-q10',
        questionNumber: 10,
        type: 'mcq',
        prompt: 'A rhombus has diagonals 24 cm and 10 cm (so each side is 13 cm). What is its area?',
        options: ['120 cm²', '240 cm²', '130 cm²', '60 cm²'],
        correctIndex: 0,
        explanation: 'Area = ½ × 24 × 10 = 120 cm².',
        moduleRef: 'Module 7.5',
      },
    ],
  },
];
