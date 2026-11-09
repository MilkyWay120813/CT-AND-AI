import { GanitaChapter } from '../types/math';

export const GANITA_PART_1_EXTRA_CHAPTERS: GanitaChapter[] = [
  // ===========================================================================
  // PART I · CHAPTER 4: QUADRILATERALS
  // ===========================================================================
  {
    id: 'ch4-quadrilaterals',
    partLabel: 'Part I',
    chapterNumber: 4,
    title: 'Quadrilaterals',
    sanskritOrHistoricalHook: 'The Carpenter’s Diagonal Strips & Venn Family of 4-Sided Shapes',
    pdfUrl: '/assets/aistudio/4.-QUADRILATERALS_9e36cb84.pdf',
    summary:
      'Discover how two wooden diagonal strips control every corner of a quadrilateral—from rectangles and squares to parallelograms, rhombuses, kites, and trapeziums.',
    diagnosticSymptom:
      'I get confused about which quadrilaterals have equal diagonals, perpendicular diagonals, or bisecting diagonals.',
    interactiveLabTitle: 'The Carpenter’s Diagonal Strip & Angle Explorer',
    segments: [
      {
        id: 'seg-p1c4-1',
        segmentCode: 'Segment 4.1',
        title: 'The Carpenter’s Problem: Rectangles & Squares via Diagonals',
        subtitle:
          'Why equal diagonals bisecting each other always form 90° corners, and when they become a square.',
        commonStruggle:
          'Assuming any quadrilateral with equal diagonals is a rectangle (they must also bisect each other!) or forgetting why the intersection angle needs to be 90° for a square.',
        coreConcepts: [
          'Two equal strips joined at their midpoints (OA = OB = OC = OD) create 4 isosceles triangles.',
          'At every corner, the two base angles sum to (90° - x/2) + x/2 = 90°, guaranteeing a Rectangle for any angle x!',
          'When the equal bisecting strips cross at exactly x = 90°, congruent SAS triangles make all 4 sides equal → Square.',
        ],
        keyFormulas: [
          { label: 'Corner Angle Proof', formula: '(90° - x/2) + (x/2) = 90°' },
          { label: 'Square Diagonals', formula: 'd₁ = d₂, bisect at 90°, bisect corner into 45° + 45°' },
        ],
        featuredSolution: {
          id: 'p1c4-carpenter-rectangle',
          title: 'The Carpenter’s Diagonal Angle Proof',
          topic: 'Quadrilaterals · Segment 4.1',
          difficulty: 'Ganita Prakash · Ch 4 Core',
          estimatedMinutes: 4,
          originalProblem:
            'A carpenter joins two 10 cm wooden strips AC and BD at their midpoints O (so OA = OB = OC = OD = 5 cm) at an acute angle ∠AOB = 50°. Find the angles ∠OAB and ∠OAD, and prove that corner ∠DAB is 90°.',
          finalAnswer: '∠OAB = 65°, ∠OAD = 25°, and ∠DAB = 65° + 25° = 90° (Rectangle)',
          funAnalogy: {
            title: 'The Self-Balancing Scissor Frame',
            story:
              'Imagine bolting two identical wooden rulers right through their 5 cm center marks like a pair of scissors. As you open or close the scissors, one triangle gets wider while the neighboring triangle gets narrower by the exact same amount—keeping every outer corner locked at 90°!',
            punchline:
              'Equal half-diagonals trade degrees like a seesaw: whatever ∠OAB loses, ∠OAD gains, so their sum is always 90°!',
            realWorldVariableMap: [
              { symbol: 'x = 50°', meaning: 'Acute angle ∠AOB between the two wooden strips' },
              { symbol: '180° - x = 130°', meaning: 'Supplementary obtuse angle ∠AOD' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Use Isosceles Triangle OAB to Find ∠OAB',
              ruleUsed: 'Base Angles of Isosceles Triangle (OA = OB = 5 cm)',
              mathBefore: '∠AOB = 50°,  OA = OB = 5 cm',
              mathAfter: '∠OAB = ∠OBA = (180° - 50°) ÷ 2 = 65°',
              explanation:
                'Since O is the midpoint of both equal diagonals, OA = OB = 5 cm. Thus ΔOAB is isosceles, and its two base angles are equal.',
              funTip: 'Formula from textbook: (180° - x) ÷ 2 = 90° - x/2 = 90° - 25° = 65°.',
              checkQuestion: {
                prompt: 'What is the supplementary angle ∠AOD next to ∠AOB = 50° along straight strip BD?',
                options: ['50°', '90°', '130°', '140°'],
                correctIndex: 2,
                hint: 'Angles on a straight line add up to 180°: 180° - 50° = 130°.',
              },
              graphHighlight: {
                x: 50,
                y: 65,
                label: '∠OAB = 65° at x = 50°',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 2,
              title: 'Use Isosceles Triangle OAD to Find ∠OAD',
              ruleUsed: 'Linear Pair ∠AOD = 180° - 50° = 130°',
              mathBefore: '∠AOD = 130°,  OA = OD = 5 cm',
              mathAfter: '∠OAD = ∠ODA = (180° - 130°) ÷ 2 = 25°',
              explanation:
                'In ΔOAD, OA = OD = 5 cm, so the base angles equal (180° - 130°) ÷ 2 = 25° (which is x/2).',
              funTip: 'Notice how ∠OAD is always half of the acute diagonal angle x!',
              graphHighlight: {
                x: 50,
                y: 25,
                label: '∠OAD = 25°',
                kind: 'intercept',
              },
            },
            {
              stepNumber: 3,
              title: 'Add the Two Parts to Find Corner Angle ∠DAB',
              ruleUsed: 'Angle Addition at Corner A',
              mathBefore: '∠DAB = ∠OAB + ∠OAD = (90° - x/2) + (x/2)',
              mathAfter: '∠DAB = 65° + 25° = 90°',
              explanation:
                'The -x/2 and +x/2 terms cancel out completely! Every corner of ABCD is 90°, proving ABCD is a rectangle.',
              funTip: 'When x = 90°, both ∠OAB and ∠OAD become 45°, making a Square!',
              graphHighlight: {
                x: 90,
                y: 45,
                label: 'Square at x = 90° (45° + 45°)',
                kind: 'vertex',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '90 - 0.5 * x',
            primaryLabel: 'Base Angle ∠OAB = 90° - x/2',
            secondaryExpression: '0.5 * x',
            secondaryLabel: 'Adjacent Base Angle ∠OAD = x/2 (Sum is always 90°!)',
            xDomain: [0, 180],
            yDomain: [0, 100],
            parameters: [
              {
                symbol: 'x',
                label: 'Diagonal Intersection Angle x°',
                value: 50,
                min: 10,
                max: 170,
                step: 5,
                unit: '°',
                description: 'Angle ∠AOB between the two equal bisecting strips',
              },
            ],
            keyPoints: [
              { x: 50, y: 65, label: '∠OAB = 65° (x=50°)', kind: 'intersection' },
              { x: 50, y: 25, label: '∠OAD = 25° (x=50°)', kind: 'intercept' },
              { x: 90, y: 45, label: 'Square Corner (45° + 45°)', kind: 'vertex' },
            ],
          },
          practiceTwin: {
            question:
              'If the carpenter sets the acute angle between the two equal bisecting strips to ∠AOB = 70°, what are ∠OAB and ∠OAD?',
            equation: '∠OAB = 90° - 70°/2,  ∠OAD = 70°/2',
            options: [
              '∠OAB = 55°, ∠OAD = 35° (Sum = 90°)',
              '∠OAB = 70°, ∠OAD = 20° (Sum = 90°)',
              '∠OAB = 45°, ∠OAD = 45° (Sum = 90°)',
              '∠OAB = 60°, ∠OAD = 30° (Sum = 90°)',
            ],
            correctIndex: 0,
            explanation:
              '∠OAB = (180° - 70°) ÷ 2 = 55° and ∠OAD = 70° ÷ 2 = 35°. Together 55° + 35° = 90°!',
            funRewardMessage: 'Master Carpenter Badge Unlocked! +20 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p1c4-2',
        segmentCode: 'Segment 4.2',
        title: 'Angles in a Quadrilateral (360°) & Parallelograms',
        subtitle:
          'Splitting any 4-sided shape into two 180° triangles and proving opposite sides/angles of a parallelogram are equal.',
        commonStruggle:
          'Confusing opposite angles of a parallelogram (which are equal) with adjacent angles (which are co-interior and sum to 180°).',
        coreConcepts: [
          'Drawing one diagonal splits any quadrilateral into 2 triangles: 180° + 180° = 360°.',
          'When diagonals bisect each other at a non-equal length, SAS congruence makes opposite sides parallel and equal → Parallelogram.',
          'In a parallelogram, adjacent angles sum to 180° and opposite angles are equal.',
        ],
        keyFormulas: [
          { label: 'Quadrilateral Angle Sum', formula: '∠A + ∠B + ∠C + ∠D = 360°' },
          { label: 'Parallelogram Adjacent Angles', formula: '∠A + ∠B = 180°  and  ∠A = ∠C, ∠B = ∠D' },
        ],
        featuredSolution: {
          id: 'p1c4-parallelogram-angles',
          title: 'Parallelogram Co-Interior & Opposite Angles',
          topic: 'Quadrilaterals · Segment 4.2',
          difficulty: 'Ganita Prakash · Ch 4 Core',
          estimatedMinutes: 4,
          originalProblem:
            'In a parallelogram ABCD, one interior angle ∠A is (2x + 15)° and the adjacent angle ∠B is (3x - 25)°. Find x and all four angles of the parallelogram.',
          finalAnswer: 'x = 38° → ∠A = ∠C = 91° and ∠B = ∠D = 89°',
          funAnalogy: {
            title: 'The Tilted Bookshelf Frame',
            story:
              'When a rectangular bookshelf tilts sideways into a parallelogram, every left-leaning corner opens up by the exact number of degrees that its neighboring corner closes down—so any two neighbor corners always add up to 180°!',
            punchline:
              'Neighbor corners in a parallelogram are co-interior partners summing to 180°; opposite corners are twins!',
            realWorldVariableMap: [
              { symbol: '∠A = 2x + 15', meaning: 'Obtuse corner angle of the parallelogram' },
              { symbol: '∠B = 3x - 25', meaning: 'Adjacent acute corner angle' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Set Adjacent Angles Equal to 180°',
              ruleUsed: 'Co-Interior Angles Between Parallel Lines AD ∥ BC',
              mathBefore: '(2x + 15)° + (3x - 25)° = 180°',
              mathAfter: '5x - 10 = 180',
              explanation:
                'Because opposite sides of a parallelogram are parallel, any two adjacent angles are interior angles on the same side of a transversal and sum to 180°.',
              funTip: 'Never set adjacent angles equal unless the parallelogram is a rectangle!',
              checkQuestion: {
                prompt: 'If 5x - 10 = 180, what is 5x?',
                options: ['170', '180', '190', '200'],
                correctIndex: 2,
                hint: 'Add 10 to both sides: 180 + 10 = 190.',
              },
              graphHighlight: {
                x: 38,
                y: 180,
                label: 'Sum = 180° at x = 38',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 2,
              title: 'Solve for x and Substitute Back',
              ruleUsed: 'Linear Equation Solution',
              mathBefore: '5x = 190  ⇒  x = 38',
              mathAfter: '∠A = 2(38) + 15 = 91°,  ∠B = 3(38) - 25 = 89°',
              explanation:
                'Dividing 190 by 5 gives x = 38. Substituting x = 38 gives ∠A = 91° and ∠B = 89°.',
              funTip: 'Quick check: 91° + 89° = 180°!',
              graphHighlight: {
                x: 38,
                y: 91,
                label: '∠A = 91°',
                kind: 'vertex',
              },
            },
            {
              stepNumber: 3,
              title: 'Use Opposite Angle Equality for ∠C and ∠D',
              ruleUsed: 'Opposite Angles of a Parallelogram are Equal',
              mathBefore: '∠C = ∠A,  ∠D = ∠B',
              mathAfter: '∠C = 91°,  ∠D = 89°  (Total = 360°)',
              explanation:
                'Opposite angles in a parallelogram are equal, so ∠C = 91° and ∠D = 89°. All four sum to 91° + 89° + 91° + 89° = 360°.',
              funTip: 'Notice how 91° and 89° are just 1° away from a 90° rectangle!',
              graphHighlight: {
                x: 38,
                y: 89,
                label: '∠B = 89°',
                kind: 'intercept',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '5 * x - 10',
            primaryLabel: 'Adjacent Angle Sum ∠A + ∠B = 5x - 10',
            secondaryExpression: '180',
            secondaryLabel: 'Parallelogram Co-Interior Target = 180°',
            xDomain: [0, 50],
            yDomain: [0, 240],
            parameters: [],
            keyPoints: [
              { x: 38, y: 180, label: 'x = 38 (Sum = 180°)', kind: 'intersection' },
            ],
          },
          practiceTwin: {
            question:
              'In a parallelogram, if one angle is 65°, what are the measures of its adjacent angle and its opposite angle?',
            equation: 'Adjacent = 180° - 65°,  Opposite = 65°',
            options: [
              'Adjacent = 115°, Opposite = 65°',
              'Adjacent = 65°, Opposite = 115°',
              'Adjacent = 25°, Opposite = 65°',
              'Adjacent = 125°, Opposite = 65°',
            ],
            correctIndex: 0,
            explanation:
              'Adjacent angles sum to 180° (180° - 65° = 115°), and opposite angles are equal (65°).',
            funRewardMessage: 'Parallelogram Pro! +20 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p1c4-3',
        segmentCode: 'Segment 4.3',
        title: 'Rhombuses, Kites, Trapeziums & the Venn Family Tree',
        subtitle:
          'Why perpendicular diagonals create rhombuses and kites, and how squares sit at the intersection of rectangles and rhombuses.',
        commonStruggle:
          'Thinking a rhombus is not a parallelogram, or thinking a rectangle is a rhombus.',
        coreConcepts: [
          'Rhombus: All 4 sides equal; opposite sides parallel; diagonals bisect each other at 90° and bisect corner angles.',
          'Kite: Two pairs of adjacent equal sides (AB = BC, CD = DA); longer diagonal perpendicularly bisects the shorter diagonal.',
          'Venn Hierarchy: Every Square is both a Rectangle AND a Rhombus, and every Rectangle/Rhombus is a Parallelogram and a Trapezium!',
        ],
        keyFormulas: [
          { label: 'Rhombus Diagonals', formula: 'd₁ ⊥ d₂ at midpoint O; side s = √((d₁/2)² + (d₂/2)²)' },
          { label: 'Venn Inclusion', formula: 'Squares = Rectangles ∩ Rhombuses ⊂ Parallelograms ⊂ Trapeziums' },
        ],
        featuredSolution: {
          id: 'p1c4-rhombus-angles',
          title: 'Finding Angles in a Rhombus from One Diagonal Angle',
          topic: 'Quadrilaterals · Segment 4.3',
          difficulty: 'Ganita Prakash · Ch 4 Exercise',
          estimatedMinutes: 4,
          originalProblem:
            'In a rhombus ABCD, the diagonals AC and BD intersect at O. If ∠OAB = 30°, find all the angles of the rhombus ABCD and the angle ∠AOB.',
          finalAnswer: '∠AOB = 90°, ∠ABO = 60°, so full corner angles are ∠A = ∠C = 60° and ∠B = ∠D = 120°',
          funAnalogy: {
            title: 'The Diamond Kite Crossbar',
            story:
              'A rhombus is built from four identical right-angled triangles meeting back-to-back at the center O. Once you know one acute angle of one right triangle (30°), the whole diamond unlocks automatically!',
            punchline:
              'Diagonals of a rhombus cross at 90° and slice every corner angle cleanly in half!',
            realWorldVariableMap: [
              { symbol: '∠OAB = 30°', meaning: 'Half of corner angle ∠DAB' },
              { symbol: '∠AOB = 90°', meaning: 'Right angle between perpendicular rhombus diagonals' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Use Perpendicular Diagonals in ΔAOB',
              ruleUsed: 'Diagonals of a Rhombus Intersect at 90°',
              mathBefore: '∠AOB = 90°,  ∠OAB = 30°',
              mathAfter: '∠ABO = 180° - (90° + 30°) = 60°',
              explanation:
                'Because the diagonals of a rhombus are perpendicular bisectors of each other, ΔAOB is a right-angled triangle at O.',
              funTip: 'The two half-corner angles ∠OAB and ∠ABO always add up to 90°!',
              checkQuestion: {
                prompt: 'Since diagonal AC bisects corner ∠DAB, what is the full angle ∠DAB?',
                options: ['30°', '60°', '90°', '120°'],
                correctIndex: 1,
                hint: 'Double the half-angle: 2 × 30° = 60°.',
              },
              graphHighlight: {
                x: 30,
                y: 60,
                label: '∠ABO = 60° when ∠OAB = 30°',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 2,
              title: 'Double the Half-Angles to Find Corners ∠A and ∠B',
              ruleUsed: 'Rhombus Diagonals Bisect Vertex Angles',
              mathBefore: '∠DAB = 2 × 30°,  ∠ABC = 2 × 60°',
              mathAfter: '∠A = 60°,  ∠B = 120°',
              explanation:
                'By SSS congruence of the triangles formed by the diagonals, each diagonal bisects the corner angles of the rhombus.',
              funTip: 'Notice that when ∠A = 60°, triangle ABD is actually an equilateral triangle!',
              graphHighlight: {
                x: 30,
                y: 120,
                label: 'Full Corner ∠B = 120°',
                kind: 'vertex',
              },
            },
            {
              stepNumber: 3,
              title: 'Find Opposite Corners ∠C and ∠D',
              ruleUsed: 'Opposite Angles of a Rhombus are Equal',
              mathBefore: '∠C = ∠A,  ∠D = ∠B',
              mathAfter: '∠C = 60°,  ∠D = 120°',
              explanation:
                'Every rhombus is a parallelogram, so opposite angles are equal: ∠A = ∠C = 60° and ∠B = ∠D = 120°.',
              funTip: '60° + 120° + 60° + 120° = 360°!',
              graphHighlight: {
                x: 45,
                y: 90,
                label: 'Square when half-angle = 45°',
                kind: 'intercept',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '2 * x',
            primaryLabel: 'Full Corner Angle ∠A = 2x',
            secondaryExpression: '180 - 2 * x',
            secondaryLabel: 'Adjacent Corner Angle ∠B = 180° - 2x',
            xDomain: [0, 90],
            yDomain: [0, 180],
            parameters: [],
            keyPoints: [
              { x: 30, y: 60, label: '∠A = 60° (at x=30°)', kind: 'intersection' },
              { x: 30, y: 120, label: '∠B = 120° (at x=30°)', kind: 'vertex' },
              { x: 45, y: 90, label: 'Square (∠A = ∠B = 90°)', kind: 'intercept' },
            ],
          },
          practiceTwin: {
            question:
              'Which statement about the Venn hierarchy of quadrilaterals in Ganita Prakash Chapter 4 is TRUE?',
            equation: 'Squares ⊂ Rectangles ⊂ Parallelograms',
            options: [
              'Every square is a rhombus, and every rhombus is a parallelogram',
              'Every rhombus is a square',
              'Every parallelogram is a rectangle',
              'Every kite is a parallelogram',
            ],
            correctIndex: 0,
            explanation:
              'A square has 4 equal sides (so it is a rhombus) and 4 right angles (so it is a rectangle), and every rhombus is a parallelogram.',
            funRewardMessage: 'Venn Master Unlocked! +20 pts',
          },
        },
        extraProblems: [],
      },
    ],
  },

  // ===========================================================================
  // PART I · CHAPTER 5: NUMBER PLAY
  // ===========================================================================
  {
    id: 'ch5-number-play',
    partLabel: 'Part I',
    chapterNumber: 5,
    title: 'Number Play',
    sanskritOrHistoricalHook: 'Āryabhaṭa II’s Digital Roots (Mahāsiddhānta), Parity & Cryptarithms',
    pdfUrl: '/assets/aistudio/5.-NUMBER-PLAY_6bd747ee.pdf',
    summary:
      'Explore why switching + and - signs never changes even/odd parity, prove divisibility shortcuts for 9, 3, and 11 using algebra, and crack Digits-in-Disguise cryptarithms.',
    diagnosticSymptom:
      'I know the rule for divisibility by 9 and 11, but I don’t know WHY it works or how to solve letter-digit puzzles like PQ × 8 = RS.',
    interactiveLabTitle: 'Divisibility by 9 & 11 Place-Value Machine & Cryptarithm Lab',
    segments: [
      {
        id: 'seg-p1c5-1',
        segmentCode: 'Segment 5.1',
        title: 'Consecutive Sums, Parity Invariance (±a ± b ± c ± d) & Remainders',
        subtitle:
          'Why flipping + to - always changes a sum by an even number (2b), and solving the 91-pebbles riddle.',
        commonStruggle:
          'Trying all 8 sign combinations of ±a ± b ± c ± d by brute force instead of using parity invariance.',
        coreConcepts: [
          'Sum of 4 consecutive numbers n + (n+1) + (n+2) + (n+3) = 4n + 6 = 4(n+1) + 2, which always leaves remainder 2 when divided by 4.',
          'Flipping +b to -b reduces an expression by 2b (an even number), so all ± combinations share the exact same even/odd parity!',
          'A number leaving remainder 3 when divided by 5 can be written both as 5k + 3 and 5m - 2.',
        ],
        keyFormulas: [
          { label: 'Sign Flip Difference', formula: '(A + b) - (A - b) = 2b (Always Even!)' },
          { label: '4 Consecutive Integers', formula: 'n + (n+1) + (n+2) + (n+3) = 4n + 6' },
        ],
        featuredSolution: {
          id: 'p1c5-parity-invariance',
          title: 'Parity Invariance of ±a ± b ± c ± d & The 91 Pebbles Riddle',
          topic: 'Number Play · Segment 5.1',
          difficulty: 'Ganita Prakash · Ch 5 Core',
          estimatedMinutes: 4,
          originalProblem:
            'Without computing all 8 combinations of ±13 ± 28 ± 41 ± 19, explain why EVERY combination is an ODD number and why none of them can ever equal 0.',
          finalAnswer: '13 + 28 + 41 + 19 = 101 (Odd). Flipping any sign subtracts 2×(number), which is even, so every combination is Odd and can never be 0 (even)!',
          funAnalogy: {
            title: 'The Two-Step Staircase Jump',
            story:
              'When you flip a number from +b to -b, you don’t just lose b—you lose b twice (2b)! Jumping down an even number of stairs on a numbered staircase keeps you on the exact same color step (Odd stays Odd, Even stays Even).',
            punchline:
              'Flipping a + sign to a - sign subtracts 2b—so parity never changes!',
            realWorldVariableMap: [
              { symbol: 'S₀ = 101', meaning: 'All-plus sum 13 + 28 + 41 + 19' },
              { symbol: '-2b', meaning: 'Even change caused by switching +b to -b' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Find the Parity of the All-Positive Sum',
              ruleUsed: 'Odd + Even + Odd + Odd = Odd',
              mathBefore: 'S₀ = 13 + 28 + 41 + 19',
              mathAfter: 'S₀ = 101  (Odd Number)',
              explanation:
                'We have three odd numbers (13, 41, 19) and one even number (28). The sum of three odds and an even is always odd (101).',
              funTip: 'You don’t even need the exact sum 101—just counting 3 odd numbers tells you the sum is odd!',
              checkQuestion: {
                prompt: 'If we flip +28 to -28 in 13 + 28 + 41 + 19 = 101, how much does the total decrease by?',
                options: ['28', '56 (which is 2 × 28)', '14', '0'],
                correctIndex: 1,
                hint: 'Removing +28 and replacing it with -28 changes the sum by -2(28) = -56.',
              },
              graphHighlight: {
                x: 0,
                y: 101,
                label: 'All-Plus Sum = 101 (Odd)',
                kind: 'intercept',
              },
            },
            {
              stepNumber: 2,
              title: 'Analyze the Effect of Flipping Any Sign',
              ruleUsed: 'Algebraic Difference: (Sum with +x) - (Sum with -x) = 2x',
              mathBefore: 'S_new = 101 - 2x',
              mathAfter: 'Odd - Even = Always Odd',
              explanation:
                'Replacing any +x with -x subtracts 2x from 101. Since 2x is always even, 101 - 2x is always odd.',
              funTip: 'For example, 13 - 28 + 41 + 19 = 101 - 56 = 45 (still odd!).',
              graphHighlight: {
                x: 28,
                y: 45,
                label: 'Flip 28 → 101 - 56 = 45 (Odd)',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 3,
              title: 'Conclude Why Zero is Impossible',
              ruleUsed: '0 is an Even Integer',
              mathBefore: 'Every combination is Odd (remainder 1 mod 2),  while 0 is Even',
              mathAfter: 'No combination can ever equal 0!',
              explanation:
                'Since every one of the 16 sign combinations of ±13 ± 28 ± 41 ± 19 is odd, and 0 is an even number, no combination can ever equal 0!',
              funTip: 'This is how mathematicians prove impossibility in 5 seconds without testing 16 cases!',
              graphHighlight: {
                x: 41,
                y: 19,
                label: 'Flip 41 → 101 - 82 = 19 (Odd)',
                kind: 'vertex',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '101 - 2 * x',
            primaryLabel: 'New Sum After Flipping +x to -x: S(x) = 101 - 2x',
            secondaryExpression: '0',
            secondaryLabel: 'Zero Target Line (Never reached at integer x!)',
            xDomain: [0, 55],
            yDomain: [-15, 110],
            parameters: [],
            keyPoints: [
              { x: 0, y: 101, label: 'Start: 101 (Odd)', kind: 'intercept' },
              { x: 28, y: 45, label: 'Flip 28 → 45 (Odd)', kind: 'intersection' },
              { x: 50.5, y: 0, label: 'Zero requires x = 50.5 (Not an integer!)', kind: 'root' },
            ],
          },
          practiceTwin: {
            question:
              'A child has 91 pebbles and groups them into fives, getting expressions like 5+5+3+5+3... Which single algebraic expression represents 91?',
            equation: '91 ÷ 5 = 18 remainder 1',
            options: [
              '5k + 1 (where k = 18)',
              '5k + 3 (where k = 18)',
              '5k + 2 (where k = 18)',
              '5k + 4 (where k = 18)',
            ],
            correctIndex: 0,
            explanation:
              'Since 91 = 5 × 18 + 1, 91 is 1 more than a multiple of 5, which is 5k + 1 (or 5m - 4).',
            funRewardMessage: 'Parity Detective! +20 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p1c5-2',
        segmentCode: 'Segment 5.2',
        title: 'Divisibility Shortcuts for 9, 3, and 11 via Place Value',
        subtitle:
          'Why 10ⁿ = (99...9 + 1) makes the digit sum work for 9 & 3, and 10ⁿ = (11m ± 1) creates alternating sums for 11.',
        commonStruggle:
          'Adding all digits to test for 11 (that’s for 9 and 3!), or mixing up which digits get + and - in the alternating sum for 11.',
        coreConcepts: [
          'Any number dcba = 1000d + 100c + 10b + a = (999d + 99c + 9b) + (d + c + b + a). Since 999d + 99c + 9b is always divisible by 9 (and 3), the remainder comes purely from (d + c + b + a)!',
          'Powers of 10 alternate around multiples of 11: 10 = 11 - 1, 100 = 99 + 1, 1000 = 1001 - 1.',
          'Thus dcba mod 11 depends on (a + c + ...) - (b + d + ...): (sum of odd-place digits from right) minus (sum of even-place digits from right).',
        ],
        keyFormulas: [
          { label: 'Divisibility by 9 & 3', formula: 'dcba = 9(111d + 11c + b) + (d + c + b + a)' },
          { label: 'Divisibility by 11', formula: '(a + c + e...) - (b + d + f...) = 0 or 11k' },
        ],
        featuredSolution: {
          id: 'p1c5-divisibility-9-11',
          title: 'Algebraic Proof & Remainder Finder for 9 and 11',
          topic: 'Number Play · Segment 5.2',
          difficulty: 'Ganita Prakash · Ch 5 Core',
          estimatedMinutes: 4,
          originalProblem:
            'Use place-value decomposition to find the remainder when 42,739 is divided by 9 AND when 42,739 is divided by 11, without performing long division.',
          finalAnswer: 'Remainder mod 9 = 7 (since 4+2+7+3+9 = 25 = 9×2 + 7); Remainder mod 11 = 4 (since (9+7+4) - (3+2) = 15 = 11×1 + 4)',
          funAnalogy: {
            title: 'Bundles of 99 and 1001 Coins',
            story:
              'Imagine paying a 9-rupee toll using bags of 100 coins. Every 100-coin bag has 99 coins that divide evenly by 9 plus 1 loose coin left over! So 4 bags of 10,000 leave 4 loose coins, 2 bags of 1,000 leave 2 loose coins, and so on!',
            punchline:
              'Every power of 10 leaves +1 remainder mod 9, and alternates +1, -1, +1, -1 mod 11!',
            realWorldVariableMap: [
              { symbol: '4+2+7+3+9 = 25', meaning: 'Loose coins left over after removing multiples of 9' },
              { symbol: '(9+7+4) - (3+2) = 15', meaning: 'Alternating loose coins after removing multiples of 11' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Remainder When 42,739 is Divided by 9',
              ruleUsed: '10ⁿ = (Multiple of 9) + 1',
              mathBefore: '42,739 = 9k + (4 + 2 + 7 + 3 + 9)',
              mathAfter: 'Digit Sum = 25 = 9(2) + 7  ⇒  Remainder = 7',
              explanation:
                'Summing the digits gives 4 + 2 + 7 + 3 + 9 = 25. Summing again gives 2 + 5 = 7, which is the exact remainder when 42,739 is divided by 9!',
              funTip: 'Āryabhaṭa II called this repeated digit sum the Digital Root!',
              checkQuestion: {
                prompt: 'In 42,739, which digits are in the odd positions starting from the units place (rightmost)?',
                options: ['9, 7, and 4', '3 and 2', '4, 2, and 7', '7, 3, and 9'],
                correctIndex: 0,
                hint: '1st from right is 9 (units), 3rd is 7 (hundreds), 5th is 4 (ten-thousands).',
              },
              graphHighlight: {
                x: 9,
                y: 7,
                label: '42739 mod 9 = 7',
                kind: 'intercept',
              },
            },
            {
              stepNumber: 2,
              title: 'Compute the Alternating Sum for Divisibility by 11',
              ruleUsed: '10⁰ = 1, 10¹ = 11-1, 10² = 99+1, 10³ = 1001-1, 10⁴ = 9999+1',
              mathBefore: '(9 + 7 + 4) - (3 + 2)',
              mathAfter: '20 - 5 = 15',
              explanation:
                'Starting from the units digit 9 with +, we alternate signs right-to-left: +9 - 3 + 7 - 2 + 4 = 20 - 5 = 15.',
              funTip: 'Always start with + on the units digit (10⁰ = +1) so your remainder sign is right!',
              graphHighlight: {
                x: 11,
                y: 15,
                label: 'Alternating Sum = 15',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 3,
              title: 'Reduce 15 Modulo 11 for the Exact Remainder',
              ruleUsed: 'Remainder Reduction',
              mathBefore: '15 = 11 × 1 + 4',
              mathAfter: 'Remainder when 42,739 ÷ 11 = 4',
              explanation:
                'Since 15 leaves a remainder of 4 when divided by 11, 42,739 also leaves a remainder of 4 when divided by 11 (42,739 = 11 × 3885 + 4).',
              funTip: 'What if we want to make 42,739 divisible by 11? Subtract 4 to get 42,735!',
              graphHighlight: {
                x: 11,
                y: 4,
                label: '42739 mod 11 = 4',
                kind: 'vertex',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '9 * x + 7',
            primaryLabel: 'Numbers with Digital Root 7: N = 9x + 7',
            secondaryExpression: '11 * x + 4',
            secondaryLabel: 'Numbers with Remainder 4 mod 11: N = 11x + 4',
            xDomain: [0, 12],
            yDomain: [0, 120],
            parameters: [],
            keyPoints: [
              { x: 0, y: 7, label: 'Remainder mod 9 = 7', kind: 'intercept' },
              { x: 0, y: 4, label: 'Remainder mod 11 = 4', kind: 'root' },
            ],
          },
          practiceTwin: {
            question:
              'Find the missing digit X so that the 5-digit number 72X54 is divisible by 9.',
            equation: '7 + 2 + X + 5 + 4 = 18 + X',
            options: ['X = 0 or X = 9', 'X = 3', 'X = 5', 'X = 7'],
            correctIndex: 0,
            explanation:
              'Since 7 + 2 + 5 + 4 = 18 is already a multiple of 9, X can be 0 (sum = 18) or 9 (sum = 27)!',
            funRewardMessage: 'Divisibility Wizard! +20 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p1c5-3',
        segmentCode: 'Segment 5.3',
        title: 'Āryabhaṭa II’s Digital Roots & Cryptarithms (Digits in Disguise)',
        subtitle:
          'Cracking letter-for-digit puzzles like PQ × 8 = RS and EF × E = GGG using place value and factor bounds.',
        commonStruggle:
          'Guessing random digits in cryptarithms instead of using magnitude bounds (e.g., a 2-digit number × 8 still being 2 digits forces P = 1!) and repunit factorization (111 = 3 × 37).',
        coreConcepts: [
          'In PQ × 8 = RS (where PQ and RS are 2-digit numbers), PQ ≤ 12 because 13 × 8 = 104 (3 digits!).',
          'In AB + AB + AB = CB (i.e. 3 × AB = CB), units digit 3×B ends in B, forcing B = 5 and A = 2 → 25 × 3 = 75.',
          'Any 3-digit repunit GGG = 111 × G = 3 × 37 × G, immediately unlocking EF × E = GGG as 37 × 3 = 111!',
        ],
        keyFormulas: [
          { label: 'Repunit Factoring', formula: 'GGG = 111 × G = 3 × 37 × G' },
          { label: '2-Digit Place Value', formula: 'PQ = 10P + Q' },
        ],
        featuredSolution: {
          id: 'p1c5-cryptarithm-repunit',
          title: 'Cracking the Cryptarithms PQ × 8 = RS & EF × E = GGG',
          topic: 'Number Play · Segment 5.3',
          difficulty: 'Ganita Prakash · Ch 5 Puzzle',
          estimatedMinutes: 5,
          originalProblem:
            'Solve the two Ganita Prakash cryptarithms where each distinct letter stands for a distinct digit: (1) PQ × 8 = RS (all 4 digits distinct) and (2) EF × E = GGG.',
          finalAnswer: '(1) 12 × 8 = 96 (P=1, Q=2, R=9, S=6); (2) 37 × 3 = 111 (E=3, F=7, G=1)',
          funAnalogy: {
            title: 'The Secret Agent Number Safe',
            story:
              'Letters in a cryptarithm wear masks, but their place values give them away! If multiplying a 2-digit number PQ by 8 still gives a 2-digit number RS, then PQ cannot be 13 or bigger—because 13 × 8 = 104 spills into 3 digits!',
            punchline:
              'Digit count bounds and 111 = 3 × 37 strip the disguise off every letter!',
            realWorldVariableMap: [
              { symbol: 'PQ ≤ 12', meaning: 'Upper limit so PQ × 8 stays under 100' },
              { symbol: '111 = 3 × 37', meaning: 'Prime factorization of repunit 111' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Use the 2-Digit Bound on PQ × 8 = RS',
              ruleUsed: 'RS < 100  ⇒  PQ ≤ 12',
              mathBefore: '10 ≤ PQ ≤ 12',
              mathAfter: 'PQ can only be 10, 11, or 12',
              explanation:
                'Since PQ is a 2-digit number and RS = 8 × PQ is also a 2-digit number, PQ can only be 10, 11, or 12.',
              funTip: 'Always check the tens digit first—it narrows 90 possibilities down to 3!',
              checkQuestion: {
                prompt: 'Which of 10 × 8 = 80, 11 × 8 = 88, or 12 × 8 = 96 has all four digits P, Q, R, S distinct?',
                options: ['12 × 8 = 96', '10 × 8 = 80', '11 × 8 = 88', 'None of them'],
                correctIndex: 0,
                hint: '10×8=80 repeats 0; 11×8=88 repeats 1 and 8; 12×8=96 uses 1, 2, 9, 6 (all distinct!).',
              },
              graphHighlight: {
                x: 12,
                y: 96,
                label: '12 × 8 = 96 (Valid 2-digit RS)',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 2,
              title: 'Factor GGG in EF × E = GGG',
              ruleUsed: 'Place-Value Decomposition of Repunit GGG',
              mathBefore: 'GGG = 100G + 10G + G = 111G',
              mathAfter: 'EF × E = 3 × 37 × G',
              explanation:
                'Every 3-digit number with identical digits GGG equals 111 × G = 3 × 37 × G.',
              funTip: 'Memorize 111 = 3 × 37—it is the golden key to repunit puzzles!',
              graphHighlight: {
                x: 3,
                y: 111,
                label: '37 × 3 = 111',
                kind: 'vertex',
              },
            },
            {
              stepNumber: 3,
              title: 'Match the Two-Digit Factor EF = 37 × G',
              ruleUsed: 'Prime Factor Matching',
              mathBefore: 'EF is a multiple of 37  ⇒  EF is 37 or 74',
              mathAfter: '37 × 3 = 111  ⇒  E = 3, F = 7, G = 1',
              explanation:
                'Since 37 is prime, the 2-digit number EF must be 37 or 74. Since EF starts with digit E, testing E = 3 gives EF = 37 and 37 × 3 = 111 (G = 1).',
              funTip: 'Notice how E = 3 appears both as the tens digit of 37 and the multiplier 3!',
              graphHighlight: {
                x: 13,
                y: 104,
                label: '13 × 8 = 104 (Overflows to 3 digits!)',
                kind: 'intercept',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '8 * x',
            primaryLabel: 'Product RS = 8 × PQ',
            secondaryExpression: '100',
            secondaryLabel: '3-Digit Overflow Ceiling (100)',
            xDomain: [8, 16],
            yDomain: [60, 130],
            parameters: [],
            keyPoints: [
              { x: 12, y: 96, label: 'PQ = 12 → RS = 96 (<100)', kind: 'intersection' },
              { x: 13, y: 104, label: 'PQ = 13 → 104 (3 digits!)', kind: 'intercept' },
            ],
          },
          practiceTwin: {
            question:
              'Solve the cryptarithm AB + AB + AB = CB (i.e., 3 × AB = CB), where A, B, C are distinct non-zero digits.',
            equation: '3 × (10A + B) = 10C + B',
            options: [
              'AB = 25, CB = 75 (A=2, B=5, C=7)',
              'AB = 15, CB = 45 (A=1, B=5, C=4)',
              'AB = 35, CB = 95 (A=3, B=5, C=9)',
              'AB = 20, CB = 60 (A=2, B=0, C=6)',
            ],
            correctIndex: 0,
            explanation:
              'Since 3 × B ends in the same units digit B (and B ≠ 0), B must be 5! Then 25 × 3 = 75 (and 15 × 3 = 45 also works; among the options 25 × 3 = 75 is exact!).',
            funRewardMessage: 'Cryptarithm Codebreaker! +25 pts',
          },
        },
        extraProblems: [],
      },
    ],
  },

  // ===========================================================================
  // PART I · CHAPTER 6: WE DISTRIBUTE, YET THINGS MULTIPLY
  // ===========================================================================
  {
    id: 'ch6-we-distribute',
    partLabel: 'Part I',
    chapterNumber: 6,
    title: 'We Distribute, Yet Things Multiply',
    sanskritOrHistoricalHook: 'Brahmagupta’s Khaṇḍa-Guṇanam (628 CE) & Śrīdharāchārya’s Squaring Method',
    pdfUrl: '/assets/aistudio/6.-WE-DISTRIBUTE_769a53e1.pdf',
    summary:
      'See how splitting rectangles into 4 regions proves (a+m)(b+n), (a+b)², (a-b)², and (a+b)(a-b) = a² - b², and compute mental squares in seconds using Śrīdharāchārya’s verse.',
    diagnosticSymptom:
      'I accidentally write (a + b)² = a² + b² (forgetting 2ab!) or forget to flip signs when expanding -3(x - 5).',
    interactiveLabTitle: '4-Region Algebraic Area Dissection & Śrīdharāchārya Squarer',
    segments: [
      {
        id: 'seg-p1c6-1',
        segmentCode: 'Segment 6.1',
        title: 'Brahmagupta’s Khaṇḍa-Guṇanam, Product Increments & Fast ×11, ×101',
        subtitle:
          'How increasing (a+1)(b+1) adds a + b + 1, and multiplying by 11 or 101 in a single line.',
        commonStruggle:
          'Thinking (a + 1)(b + 1) increases ab by just 1 instead of a + b + 1.',
        coreConcepts: [
          'Brahmagupta (Brāhmasphuṭasiddhānta, 628 CE) defined Khaṇḍa-guṇanam: splitting a multiplier into parts and summing the partial products.',
          'Increasing both factors by 1 gives (a + 1)(b + 1) = ab + a + b + 1 (an extra row of b, an extra column of a, and 1 corner square).',
          'General Identity 1: (a + m)(b + n) = ab + mb + an + mn.',
          'Fast ×11 rule: Write the units digit, add adjacent pairs of digits right-to-left, then write the leftmost digit!',
        ],
        keyFormulas: [
          { label: 'Unit Increment', formula: '(a + 1)(b + 1) = ab + a + b + 1' },
          { label: 'Identity 1 (4-Part Area)', formula: '(a + m)(b + n) = ab + mb + an + mn' },
        ],
        featuredSolution: {
          id: 'p1c6-khanda-gunanam',
          title: 'Expanding (a + m)(b - n) & Fast Multiplication by 11',
          topic: 'Distributive Property · Segment 6.1',
          difficulty: 'Ganita Prakash · Ch 6 Core',
          estimatedMinutes: 4,
          originalProblem:
            'If the length of a rectangle of sides a = 20 m and b = 15 m is increased by 4 m and its breadth is decreased by 2 m, use Identity 1 to find the change in area: (a + 4)(b - 2) - ab.',
          finalAnswer: 'Change in area = 4b - 2a - 8 = 4(15) - 2(20) - 8 = +12 m² (Area increases by 12 m²)',
          funAnalogy: {
            title: 'Adding a Balcony, Trimming a Sidewalk',
            story:
              'When you widen a 20×15 garden by 4 m on one side (+4b = +60 m²) and trim 2 m off the other side (-2a = -40 m²), the 4×2 corner strip (-8 m²) gets trimmed too!',
            punchline:
              '(a + 4)(b - 2) = ab + 4b - 2a - 8: four terms for four rectangular regions!',
            realWorldVariableMap: [
              { symbol: '+4b = +60', meaning: 'New strip added along side b = 15' },
              { symbol: '-2a - 8 = -48', meaning: 'Strip removed along side a + 4 = 24' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Expand (a + 4)(b - 2) Using Distributivity',
              ruleUsed: 'Identity 1: (a + m)(b + n) = ab + an + mb + mn',
              mathBefore: '(a + 4)(b - 2) = a(b - 2) + 4(b - 2)',
              mathAfter: '(a + 4)(b - 2) = ab - 2a + 4b - 8',
              explanation:
                'Multiply each term in the first bracket by each term in the second bracket, keeping careful track of the negative sign on -2.',
              funTip: 'Notice how (+4) × (-2) = -8 gives the corner piece!',
              checkQuestion: {
                prompt: 'After subtracting the original area ab from (ab - 2a + 4b - 8), what expression remains for the change in area?',
                options: ['4b - 2a - 8', '4b - 2a + 8', '2a - 4b - 8', '-8'],
                correctIndex: 0,
                hint: 'The ab and -ab cancel out, leaving 4b - 2a - 8.',
              },
              graphHighlight: {
                x: 4,
                y: 12,
                label: 'Net Area Change = +12 m² at m = 4',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 2,
              title: 'Substitute a = 20 and b = 15 into 4b - 2a - 8',
              ruleUsed: 'Algebraic Evaluation',
              mathBefore: 'ΔArea = 4(15) - 2(20) - 8',
              mathAfter: 'ΔArea = 60 - 40 - 8 = +12 m²',
              explanation:
                'The added strip gives +60 m², while the removed strips take away 40 + 8 = 48 m², leaving a net gain of +12 m².',
              funTip: 'Direct check: Original = 20 × 15 = 300 m²; New = 24 × 13 = 312 m²; 312 - 300 = +12 m²!',
              graphHighlight: {
                x: 0,
                y: -40,
                label: 'At m = 0, loss is -40 m²',
                kind: 'intercept',
              },
            },
            {
              stepNumber: 3,
              title: 'Bonus Check: Fast Multiplication 3874 × 11',
              ruleUsed: '3874 × (10 + 1) = 38,740 + 3,874',
              mathBefore: '3874 × 11 = 3 | (3+8) | (8+7) | (7+4) | 4',
              mathAfter: '3874 × 11 = 42,614',
              explanation:
                'Because 11 = 10 + 1, each place value adds its neighbor: 4, then 7+4=11 (1 carry 1), 8+7+1=16 (6 carry 1), 3+8+1=12 (2 carry 1), 3+1=4 → 42,614!',
              funTip: 'Multiplying by 101 = 100 + 1 is even easier: 58 × 101 = 5858!',
              graphHighlight: {
                x: 3.08,
                y: 0,
                label: 'Break-even width increase m ≈ 3.08 m',
                kind: 'root',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '13 * x - 40',
            primaryLabel: 'Net Area Change ΔA(x) = (20+x)(15-2) - 300 = 13x - 40',
            secondaryExpression: '0',
            secondaryLabel: 'Zero Change Line (Original Area = 300 m²)',
            xDomain: [0, 8],
            yDomain: [-45, 70],
            parameters: [],
            keyPoints: [
              { x: 4, y: 12, label: 'x = 4 m → +12 m²', kind: 'intersection' },
              { x: 3.08, y: 0, label: 'Break-even x ≈ 3.08 m', kind: 'root' },
            ],
          },
          practiceTwin: {
            question:
              'If ab = 50 and a + b = 15, what is the value of (a + 1)(b + 1)?',
            equation: '(a + 1)(b + 1) = ab + a + b + 1',
            options: ['66', '51', '65', '75'],
            correctIndex: 0,
            explanation:
              'By Identity (a+1)(b+1) = ab + a + b + 1 = 50 + 15 + 1 = 66!',
            funRewardMessage: 'Khaṇḍa-Guṇanam Master! +20 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p1c6-2',
        segmentCode: 'Segment 6.2',
        title: 'Special Identities (a+b)², (a-b)² & Śrīdharāchārya’s Squaring Method',
        subtitle:
          'Why (a+b)² has a middle +2ab term, and how Śrīdharāchārya (750 CE) squared numbers via a² = (a+b)(a-b) + b².',
        commonStruggle:
          'Forgetting the middle 2ab term in (a ± b)² = a² ± 2ab + b².',
        coreConcepts: [
          'Identity 1A: (a + b)² = a² + 2ab + b² (two squares a², b² plus two rectangles of area ab).',
          'Identity 1B: (a - b)² = a² - 2ab + b² (subtracting two strips of ab double-counts the b² corner, so we add +b² back!).',
          'Identity 1C: (a + b)(a - b) = a² - b² (Difference of Squares).',
          'Śrīdharāchārya’s Pāṭīgaṇita Verse: Rearranging a² - b² = (a+b)(a-b) gives a² = (a+b)(a-b) + b² for lightning mental squaring!',
        ],
        keyFormulas: [
          { label: 'Square of Sum / Diff', formula: '(a ± b)² = a² ± 2ab + b²' },
          { label: 'Śrīdharāchārya’s Rule', formula: 'a² = (a + b)(a - b) + b²   &   (a + b)(a - b) = a² - b²' },
        ],
        featuredSolution: {
          id: 'p1c6-sridharacharya-squares',
          title: 'Śrīdharāchārya’s Instant Squaring & Difference of Squares',
          topic: 'Distributive Property · Segment 6.2',
          difficulty: 'Ganita Prakash · Ch 6 Core',
          estimatedMinutes: 4,
          originalProblem:
            'Use Śrīdharāchārya’s formula a² = (a + b)(a - b) + b² to mentally compute 98² and 104², and evaluate 73² - 27² using Identity 1C.',
          finalAnswer: '98² = 9,604;  104² = 10,816;  and 73² - 27² = (73+27)(73-27) = 4,600',
          funAnalogy: {
            title: 'Stepping to the Nearest Round 100',
            story:
              'Squaring 98 in your head feels hard, until Śrīdharāchārya whispers: step 2 units up to 100 and 2 units down to 96! Multiply 100 × 96 = 9600 effortlessly, then toss in the tiny 2² = 4 corner to get 9,604!',
            punchline:
              'Choose b so that (a + b) or (a - b) lands on 100 or 1000, then add b²!',
            realWorldVariableMap: [
              { symbol: 'a = 98, b = 2', meaning: 'Distance from 98 to round landmark 100' },
              { symbol: '(98+2)(98-2) + 2²', meaning: '100 × 96 + 4 = 9,604' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Compute 98² Using a = 98, b = 2',
              ruleUsed: 'Śrīdharāchārya’s Identity: a² = (a + b)(a - b) + b²',
              mathBefore: '98² = (98 + 2)(98 - 2) + 2²',
              mathAfter: '98² = 100 × 96 + 4 = 9,604',
              explanation:
                'By choosing b = 2, (98 + 2) becomes 100. Multiplying 100 × 96 gives 9,600, and adding 2² = 4 gives 9,604.',
              funTip: 'Notice this also equals (100 - 2)² = 10,000 - 400 + 4 = 9,604!',
              checkQuestion: {
                prompt: 'To compute 104² using a = 104 and b = 4, what is (104 + 4)(104 - 4) + 4²?',
                options: ['108 × 100 + 16 = 10,816', '104 × 100 + 16 = 10,416', '108 × 100 - 16 = 10,784', '10,016'],
                correctIndex: 0,
                hint: '104 + 4 = 108, 104 - 4 = 100, and 4² = 16 → 10,800 + 16 = 10,816.',
              },
              graphHighlight: {
                x: 2,
                y: 9604,
                label: '98² = 9,604 (at b = 2)',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 2,
              title: 'Compute 104² Using a = 104, b = 4',
              ruleUsed: 'a² = (a + b)(a - b) + b²',
              mathBefore: '104² = (104 + 4)(104 - 4) + 4²',
              mathAfter: '104² = 108 × 100 + 16 = 10,816',
              explanation:
                'Stepping 4 down to 100 and 4 up to 108 turns the multiplication into 108 × 100 = 10,800, plus 16 = 10,816.',
              funTip: 'You can square ANY number near 100 in 3 seconds this way!',
              graphHighlight: {
                x: 4,
                y: 9588,
                label: '(98+4)(98-4) = 98² - 16',
                kind: 'intercept',
              },
            },
            {
              stepNumber: 3,
              title: 'Evaluate 73² - 27² Using Difference of Squares',
              ruleUsed: 'Identity 1C: a² - b² = (a + b)(a - b)',
              mathBefore: '73² - 27² = (73 + 27)(73 - 27)',
              mathAfter: '100 × 46 = 4,600',
              explanation:
                'Instead of squaring 73 and 27 separately, factor the difference of squares into (73 + 27)(73 - 27) = 100 × 46 = 4,600.',
              funTip: 'Whenever you see a² - b², check if a + b or a - b is a round number!',
              graphHighlight: {
                x: 0,
                y: 9604,
                label: 'Exact 98² = 9,604',
                kind: 'vertex',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '9604 - x * x',
            primaryLabel: 'Product (98 + x)(98 - x) = 98² - x²',
            secondaryExpression: '9604',
            secondaryLabel: 'Target Square 98² = 9,604 (after adding +x²)',
            xDomain: [0, 10],
            yDomain: [9500, 9620],
            parameters: [],
            keyPoints: [
              { x: 0, y: 9604, label: '98² = 9604', kind: 'vertex' },
              { x: 2, y: 9600, label: 'x=2: 100×96 = 9600 (+4 = 9604)', kind: 'intersection' },
            ],
          },
          practiceTwin: {
            question:
              'Use Identity 1C (a + b)(a - b) = a² - b² to mentally compute 55 × 45.',
            equation: '55 × 45 = (50 + 5)(50 - 5)',
            options: ['2,475', '2,525', '2,500', '2,425'],
            correctIndex: 0,
            explanation:
              '(50 + 5)(50 - 5) = 50² - 5² = 2,500 - 25 = 2,475!',
            funRewardMessage: 'Śrīdharāchārya Scholar! +20 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p1c6-3',
        segmentCode: 'Segment 6.3',
        title: 'Mind the Mistake & Visual Tile Patterns (k² + 2k Four Ways)',
        subtitle:
          'Why different ways of slicing a geometric tile border always simplify to the exact same algebraic expression.',
        commonStruggle:
          'Thinking two classmates who wrote (k + 1)² - 1 and k(k + 2) for a pattern must have different answers.',
        coreConcepts: [
          'A square of side (k + 1) with 1 corner tile missing has area (k + 1)² - 1.',
          'Expanding (k + 1)² - 1 = (k² + 2k + 1) - 1 = k² + 2k.',
          'Rearranging the tiles into a k × (k + 2) rectangle gives k(k + 2) = k² + 2k—four visual ways, one identical polynomial!',
        ],
        keyFormulas: [
          { label: 'Four Equivalent Forms', formula: '(k+1)² - 1 = k² + 2k = k(k+1) + k = k(k+2)' },
          { label: 'Sign Distribution Rule', formula: 'a - (b - c) = a - b + c' },
        ],
        featuredSolution: {
          id: 'p1c6-tile-patterns',
          title: 'Proving 4 Visual Tile Formulas Equal k² + 2k',
          topic: 'Distributive Property · Segment 6.3',
          difficulty: 'Ganita Prakash · Ch 6 Investigation',
          estimatedMinutes: 4,
          originalProblem:
            'In the Ganita Prakash Step-Grid pattern, Step k has a k×k square plus two arms of length k. Four students write the number of tiles at Step k as: (A) k² + 2k, (B) (k + 1)² - 1, (C) k(k + 1) + k, and (D) k(k + 2). Prove all four are algebraically identical and find the number of tiles at Step k = 19.',
          finalAnswer: 'All four expand to k² + 2k. At Step k = 19: (19 + 1)² - 1 = 400 - 1 = 399 tiles!',
          funAnalogy: {
            title: 'Four Photographers, One Sculpture',
            story:
              'One student sees a k×k square with two wings (k² + 2k). Another sees a (k+1)×(k+1) square missing its top-right tooth ((k+1)² - 1). A third swings one wing around to make a k×(k+2) rectangle. Algebra proves they are all looking at the exact same sculpture!',
            punchline:
              'Expanding brackets reveals when different-looking formulas are twins in disguise!',
            realWorldVariableMap: [
              { symbol: 'k = 19', meaning: 'Step number in the tile pattern' },
              { symbol: '(k+1)² - 1 = 399', meaning: 'Fastest mental formula at k = 19 (20² - 1)' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Expand Student B’s Formula (k + 1)² - 1',
              ruleUsed: 'Identity 1A: (k + 1)² = k² + 2k + 1',
              mathBefore: '(k + 1)² - 1 = (k² + 2k + 1) - 1',
              mathAfter: 'k² + 2k',
              explanation:
                'Expanding (k + 1)² gives k² + 2k + 1. Subtracting the 1 missing corner tile leaves k² + 2k.',
              funTip: 'At k = 19, Student B’s formula is the fastest: 20² - 1 = 400 - 1 = 399!',
              checkQuestion: {
                prompt: 'What do you get when you expand Student D’s rectangle formula k(k + 2)?',
                options: ['k² + 2k', 'k² + 2', '2k + 2', 'k² + k + 2'],
                correctIndex: 0,
                hint: 'Distribute k across (k + 2): k·k + k·2 = k² + 2k.',
              },
              graphHighlight: {
                x: 5,
                y: 35,
                label: 'Step 5: 6² - 1 = 35 tiles',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 2,
              title: 'Expand Student C’s and Student D’s Formulas',
              ruleUsed: 'Distributive Law a(b + c) = ab + ac',
              mathBefore: 'k(k + 1) + k = k² + k + k,   k(k + 2) = k² + 2k',
              mathAfter: 'k² + 2k = k² + 2k',
              explanation:
                'Both k(k + 1) + k and k(k + 2) simplify to k² + 2k, proving all four students are 100% correct!',
              funTip: 'Notice how k(k + 2) at k = 19 gives 19 × 21 = (20 - 1)(20 + 1) = 399!',
              graphHighlight: {
                x: 10,
                y: 120,
                label: 'Step 10: 11² - 1 = 120 tiles',
                kind: 'vertex',
              },
            },
            {
              stepNumber: 3,
              title: 'Evaluate at Step k = 19',
              ruleUsed: 'Substitute k = 19 into (k + 1)² - 1',
              mathBefore: 'T(19) = (19 + 1)² - 1 = 20² - 1',
              mathAfter: 'T(19) = 400 - 1 = 399 tiles',
              explanation:
                'Using the (k + 1)² - 1 form turns k = 19 into 20² - 1 = 399 with zero hard multiplication.',
              funTip: 'Different algebraic forms have different superpowers—pick the easiest one to evaluate!',
              graphHighlight: {
                x: 19,
                y: 399,
                label: 'Step 19: 399 tiles',
                kind: 'intercept',
              },
            },
          ],
          graphConfig: {
            primaryExpression: 'x * x + 2 * x',
            primaryLabel: 'Tile Count T(k) = k² + 2k = (k+1)² - 1',
            secondaryExpression: '(x + 1) * (x + 1)',
            secondaryLabel: 'Full Square (k+1)² (always 1 tile above T(k))',
            xDomain: [0, 20],
            yDomain: [0, 420],
            parameters: [],
            keyPoints: [
              { x: 5, y: 35, label: 'Step 5: 35 tiles', kind: 'intersection' },
              { x: 10, y: 120, label: 'Step 10: 120 tiles', kind: 'vertex' },
              { x: 19, y: 399, label: 'Step 19: 399 tiles', kind: 'intercept' },
            ],
          },
          practiceTwin: {
            question:
              'Fix the common algebra mistake from "Mind the Mistake, Mend the Mistake": What is the correct simplified form of (2x + 3)² - (4x² + 9)?',
            equation: '(2x + 3)² - 4x² - 9 = (4x² + 12x + 9) - 4x² - 9',
            options: ['12x', '0', '6x', '18'],
            correctIndex: 0,
            explanation:
              '(2x + 3)² expands to 4x² + 12x + 9 (don’t forget the middle 2·(2x)·3 = 12x term!). Subtracting 4x² + 9 leaves 12x.',
            funRewardMessage: 'Mistake Mender Badge! +20 pts',
          },
        },
        extraProblems: [],
      },
    ],
  },

  // ===========================================================================
  // PART I · CHAPTER 7: PROPORTIONAL REASONING–1
  // ===========================================================================
  {
    id: 'ch7-proportional-1',
    partLabel: 'Part I',
    chapterNumber: 7,
    title: 'Proportional Reasoning–1',
    sanskritOrHistoricalHook: 'Āryabhaṭa’s Trairāśika (Rule of Three) & Bhāskarāchārya’s Līlāvatī Saffron Puzzle',
    pdfUrl: '/assets/aistudio/7.-PROPORTIONAL_e37987b4.pdf',
    summary:
      'Learn why resizing a tiger photo requires multiplicative ratios (not additive changes!), reduce ratios via HCF, solve Āryabhaṭa’s Trairāśika, and split quantities in m : n.',
    diagnosticSymptom:
      'I add the same number to both terms of a ratio (thinking 60:40 equals 70:50) instead of multiplying by a common scale factor.',
    interactiveLabTitle: 'Tiger Aspect-Ratio Resizer & Āryabhaṭa’s Trairāśika Mixer',
    segments: [
      {
        id: 'seg-p1c7-1',
        segmentCode: 'Segment 7.1',
        title: 'Observing Similarity in Change (Tiger Image Ratios) & HCF Simplest Form',
        subtitle:
          'Why adding +10 to width and height distorts an image, while multiplying by k preserves the exact 3 : 2 proportion.',
        commonStruggle:
          'Adding the same constant to both parts of a ratio (e.g. turning 60 : 40 into 80 : 60) and wondering why the picture looks squished!',
        coreConcepts: [
          'A ratio a : b stays proportional ONLY when both terms are multiplied or divided by the same non-zero factor k → ka : kb.',
          'Dividing both a and b by their Highest Common Factor (HCF) reduces a : b to its simplest form (e.g., 60 : 40 ÷ 20 = 3 : 2).',
          'When two ratios a : b and c : d have the same simplest form, they are in proportion, written a : b :: c : d.',
        ],
        keyFormulas: [
          { label: 'Equivalent Ratio Rule', formula: 'a : b :: ka : kb  (k ≠ 0)' },
          { label: 'Simplest Form via HCF', formula: '(a ÷ HCF(a,b)) : (b ÷ HCF(a,b))' },
        ],
        featuredSolution: {
          id: 'p1c7-tiger-coffee-ratios',
          title: 'The Tiger Photo Aspect Ratio & Manjunath’s Filter Coffee',
          topic: 'Proportional Reasoning–1 · Segment 7.1',
          difficulty: 'Ganita Prakash · Ch 7 Core',
          estimatedMinutes: 4,
          originalProblem:
            'An original tiger photograph measures 60 mm wide by 40 mm high. (1) If resized to width 90 mm, what height keeps the image undistorted? (2) Manjunath mixes 15 mL coffee decoction with 35 mL milk for himself. If his sister wants 24 mL decoction with the exact same coffee strength, how much milk should he add?',
          finalAnswer: '(1) Height = 60 mm (90 : 60 :: 3 : 2); (2) Milk = 56 mL (24 : 56 :: 3 : 7)',
          funAnalogy: {
            title: 'Don’t Squish the Tiger, Don’t Water Down the Coffee!',
            story:
              'Whether you are stretching a tiger photo on a screen or pouring South Indian filter coffee, adding +20 to both numbers changes the balance! Instead, simplify to the core recipe via HCF (3:2 for the tiger, 3:7 for the coffee) and scale both parts together!',
            punchline:
              'Proportions are multiplicative recipes—scale both ingredients by the same multiplier k!',
            realWorldVariableMap: [
              { symbol: '60 : 40 = 3 : 2', meaning: 'Simplest width-to-height ratio of the tiger photo' },
              { symbol: '15 : 35 = 3 : 7', meaning: 'Simplest decoction-to-milk ratio of Manjunath’s coffee' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Reduce the Tiger Photo Ratio 60 : 40 Using HCF',
              ruleUsed: 'HCF(60, 40) = 20',
              mathBefore: '60 : 40 = (60 ÷ 20) : (40 ÷ 20) = 3 : 2',
              mathAfter: '90 : h :: 3 : 2  ⇒  h = 2 × 30 = 60 mm',
              explanation:
                'Dividing 60 and 40 by their HCF (20) gives 3 : 2. Since 90 = 3 × 30, the matching height is 2 × 30 = 60 mm.',
              funTip: 'If you added +30 instead (+30 to 40 = 70 mm), 90:70 ≠ 3:2 and the tiger would look stretched vertically!',
              checkQuestion: {
                prompt: 'What is the simplest form of Manjunath’s coffee ratio 15 mL decoction : 35 mL milk?',
                options: ['3 : 7 (dividing by HCF = 5)', '1 : 3', '5 : 7', '3 : 5'],
                correctIndex: 0,
                hint: 'Divide both 15 and 35 by their HCF, which is 5.',
              },
              graphHighlight: {
                x: 60,
                y: 40,
                label: 'Original Photo (60, 40)',
                kind: 'intercept',
              },
            },
            {
              stepNumber: 2,
              title: 'Reduce the Filter Coffee Ratio 15 : 35 Using HCF',
              ruleUsed: 'HCF(15, 35) = 5',
              mathBefore: '15 : 35 = (15 ÷ 5) : (35 ÷ 5) = 3 : 7',
              mathAfter: 'Every 3 parts decoction needs 7 parts milk',
              explanation:
                'Dividing both 15 and 35 by 5 gives the core coffee-strength ratio 3 : 7.',
              funTip: 'Larger decoction-to-milk ratio = stronger coffee!',
              graphHighlight: {
                x: 90,
                y: 60,
                label: 'Scaled Photo (90, 60)',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 3,
              title: 'Scale 3 : 7 to Match 24 mL of Decoction',
              ruleUsed: 'Scale Factor k = 24 ÷ 3 = 8',
              mathBefore: '(3 × 8) : (7 × 8) = 24 : m',
              mathAfter: 'm = 56 mL of milk',
              explanation:
                'Since 24 mL is 8 times 3 mL, we multiply the 7 parts of milk by 8 to get 56 mL of milk.',
              funTip: '15 : 35 :: 24 : 56 because 15 × 56 = 840 and 35 × 24 = 840!',
              graphHighlight: {
                x: 30,
                y: 20,
                label: 'Half-Size Photo (30, 20)',
                kind: 'vertex',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '(2 / 3) * x',
            primaryLabel: 'Proportional Tiger Height h = (2/3)w (3:2 Ratio)',
            secondaryExpression: 'x - 20',
            secondaryLabel: 'Wrong Additive Rule h = w - 20 (Distorts shape!)',
            xDomain: [0, 120],
            yDomain: [0, 90],
            parameters: [],
            keyPoints: [
              { x: 30, y: 20, label: '30 × 20 mm (3:2)', kind: 'vertex' },
              { x: 60, y: 40, label: 'Original 60 × 40 mm', kind: 'intersection' },
              { x: 90, y: 60, label: 'Scaled 90 × 60 mm (3:2)', kind: 'intercept' },
            ],
          },
          practiceTwin: {
            question:
              'Which of the following tiger photo dimensions is proportional to the original 60 mm × 40 mm photograph?',
            equation: '60 : 40 = 3 : 2',
            options: [
              '45 mm × 30 mm',
              '70 mm × 50 mm',
              '80 mm × 60 mm',
              '50 mm × 30 mm',
            ],
            correctIndex: 0,
            explanation:
              'Dividing 45 and 30 by HCF(45, 30) = 15 gives 3 : 2, matching 60 : 40!',
            funRewardMessage: 'Sharp Eye for Proportions! +20 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p1c7-2',
        segmentCode: 'Segment 7.2',
        title: 'Āryabhaṭa’s Trairāśika (Rule of Three) & Cross Multiplication',
        subtitle:
          'Pramāṇa, Phala, and Ichchhā from Āryabhaṭīya (499 CE), cross-product ad = bc, and Līlāvatī’s Saffron puzzle.',
        commonStruggle:
          'Putting the three known quantities in the wrong order when setting up the Rule of Three.',
        coreConcepts: [
          'In Āryabhaṭa’s Trairāśika (Rule of Three): Pramāṇa (a, standard measure) yields Phala (b, fruit/result). What will Ichchhā (c, desired measure) yield?',
          'Āryabhaṭa’s verse: Ichchhāphala (d) = (Phala × Ichchhā) ÷ Pramāṇa = (b × c) / a.',
          'Cross-multiplication test: a : b :: c : d ⟺ a × d = b × c.',
        ],
        keyFormulas: [
          { label: 'Āryabhaṭa’s Trairāśika', formula: 'Ichchhāphala d = (Phala b × Ichchhā c) / Pramāṇa a' },
          { label: 'Cross-Multiplication', formula: 'a : b :: c : d  ⟺  a × d = b × c' },
        ],
        featuredSolution: {
          id: 'p1c7-lilavati-saffron',
          title: 'Bhāskarāchārya’s Līlāvatī Saffron Problem via Trairāśika',
          topic: 'Proportional Reasoning–1 · Segment 7.2',
          difficulty: 'Ganita Prakash · Ch 7 Historical Gem',
          estimatedMinutes: 4,
          originalProblem:
            'From Bhāskarāchārya’s Līlāvatī: If 3/7 of a pala of saffron costs 9/2 niskas, O expert mathematician, tell me quickly what quantity of saffron can be bought for 9 niskas?',
          finalAnswer: '6/7 of a pala of saffron',
          funAnalogy: {
            title: 'The Ancient Spice Market Calculator',
            story:
              'Over 1,500 years ago, Indian merchants used Āryabhaṭa’s Trairāśika to price silk, saffron, and camphor: multiply the fruit (Phala) by your wish (Ichchhā) and divide by the standard measure (Pramāṇa)!',
            punchline:
              'Pramāṇa (9/2 niskas) : Phala (3/7 pala) :: Ichchhā (9 niskas) : Ichchhāphala (x palas)!',
            realWorldVariableMap: [
              { symbol: 'Pramāṇa a = 9/2', meaning: 'Known cost in niskas (4.5 niskas)' },
              { symbol: 'Phala b = 3/7', meaning: 'Known saffron weight in palas' },
              { symbol: 'Ichchhā c = 9', meaning: 'Desired spending in niskas' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Identify Pramāṇa, Phala, and Ichchhā',
              ruleUsed: 'Match Units: Cost : Saffron :: Desired Cost : Desired Saffron',
              mathBefore: 'a = 9/2 niskas,  b = 3/7 pala,  c = 9 niskas',
              mathAfter: '(9/2) : (3/7) :: 9 : x',
              explanation:
                'Here the known money (9/2 niskas) is Pramāṇa, the saffron it buys (3/7 pala) is Phala, and the money we have (9 niskas) is Ichchhā.',
              funTip: 'Notice right away that 9 niskas is exactly DOUBLE 9/2 niskas!',
              checkQuestion: {
                prompt: 'According to Āryabhaṭa’s Trairāśika rule, how do we compute Ichchhāphala x?',
                options: [
                  'x = (Phala × Ichchhā) ÷ Pramāṇa',
                  'x = (Pramāṇa × Phala) ÷ Ichchhā',
                  'x = Pramāṇa + Phala - Ichchhā',
                  'x = (Pramāṇa × Ichchhā) ÷ Phala',
                ],
                correctIndex: 0,
                hint: 'Multiply the middle two terms (Phala × Ichchhā) and divide by the first term (Pramāṇa).',
              },
              graphHighlight: {
                x: 4.5,
                y: 0.43,
                label: 'Pramāṇa: 4.5 niskas → 3/7 pala',
                kind: 'intercept',
              },
            },
            {
              stepNumber: 2,
              title: 'Apply Āryabhaṭa’s Rule x = (b × c) ÷ a',
              ruleUsed: 'Fraction Multiplication & Division',
              mathBefore: 'x = ((3/7) × 9) ÷ (9/2)',
              mathAfter: 'x = (27/7) × (2/9)',
              explanation:
                'Dividing by 9/2 is the same as multiplying by its reciprocal 2/9.',
              funTip: 'Cancel 27 and 9 before multiplying to keep the numbers tiny!',
              graphHighlight: {
                x: 9,
                y: 0.86,
                label: 'Ichchhā: 9 niskas → 6/7 pala',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 3,
              title: 'Simplify to Find the Final Saffron Quantity',
              ruleUsed: 'Cancel Common Factor 9',
              mathBefore: 'x = (3 × 2) / 7',
              mathAfter: 'x = 6/7 pala of saffron',
              explanation:
                'Since 9 niskas is twice 9/2 niskas, it buys twice 3/7 pala = 6/7 pala of saffron.',
              funTip: 'Cross-multiplication check: (9/2) × (6/7) = 27/7 and (3/7) × 9 = 27/7!',
              graphHighlight: {
                x: 10.5,
                y: 1,
                label: '10.5 niskas → 1 full pala',
                kind: 'vertex',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '(2 / 21) * x',
            primaryLabel: 'Saffron Bought (palas) = (2/21) × Cost (niskas)',
            xDomain: [0, 12],
            yDomain: [0, 1.2],
            parameters: [],
            keyPoints: [
              { x: 4.5, y: 0.43, label: '9/2 niskas → 3/7 pala', kind: 'intercept' },
              { x: 9, y: 0.86, label: '9 niskas → 6/7 pala', kind: 'intersection' },
              { x: 10.5, y: 1, label: '10.5 niskas → 1 pala', kind: 'vertex' },
            ],
          },
          practiceTwin: {
            question:
              'Solve for x in the proportion 18 : 24 :: x : 36 using cross multiplication.',
            equation: '24 × x = 18 × 36',
            options: ['x = 27', 'x = 30', 'x = 24', 'x = 32'],
            correctIndex: 0,
            explanation:
              '18 : 24 simplifies to 3 : 4. Since 36 = 4 × 9, x = 3 × 9 = 27!',
            funRewardMessage: 'Trairāśika Champion! +20 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p1c7-3',
        segmentCode: 'Segment 7.3',
        title: 'Sharing Not Equally (m : n Split) & Unit Conversions',
        subtitle:
          'Dividing a total x into mx/(m+n) and nx/(m+n), Mason’s sand-cement mixture, and why °C to °F is NOT proportional.',
        commonStruggle:
          'Dividing a total of 40 kg in the ratio 3 : 5 by computing 40 ÷ 3 and 40 ÷ 5 instead of dividing by the total parts (3 + 5 = 8)!',
        coreConcepts: [
          'To divide a total quantity x in the ratio m : n, first add the parts (m + n) to find the total number of equal shares.',
          'Each single part equals x / (m + n), so the two shares are mx / (m + n) and nx / (m + n).',
          'Watch out: Celsius to Fahrenheit (F = 1.8C + 32) is NOT proportional because 0°C = 32°F (non-zero offset!).',
        ],
        keyFormulas: [
          { label: 'Share 1 & Share 2', formula: 'Share₁ = m·x / (m + n),   Share₂ = n·x / (m + n)' },
          { label: 'Check Sum', formula: 'Share₁ + Share₂ = (m + n)·x / (m + n) = x' },
        ],
        featuredSolution: {
          id: 'p1c7-sand-cement-split',
          title: 'Prashanti & Bhuvan’s Profit Split & Mason’s Concrete Mix',
          topic: 'Proportional Reasoning–1 · Segment 7.3',
          difficulty: 'Ganita Prakash · Ch 7 Word Problem',
          estimatedMinutes: 4,
          originalProblem:
            'Prashanti and Bhuvan start a food-cart venture investing ₹40,000 and ₹10,000 respectively, agreeing to share profits in the ratio of their investments. If they earn ₹3,000 profit at the end of the month, how much does each receive?',
          finalAnswer: 'Investment ratio = 4 : 1 (5 total parts) → Prashanti gets ₹2,400 and Bhuvan gets ₹600',
          funAnalogy: {
            title: 'Slicing the Profit Pie into m + n Equal Slices',
            story:
              'If Prashanti puts in 4 bags of gold and Bhuvan puts in 1 bag, don’t cut the profit pie into 4 slices—cut it into 4 + 1 = 5 equal slices! Give 4 slices to Prashanti and 1 slice to Bhuvan!',
            punchline:
              'Always add m + n first to find the total number of slices!',
            realWorldVariableMap: [
              { symbol: 'm : n = 4 : 1', meaning: 'Simplified ratio of investments ₹40,000 : ₹10,000' },
              { symbol: 'm + n = 5', meaning: 'Total equal slices of the ₹3,000 profit' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Simplify the Investment Ratio 40,000 : 10,000',
              ruleUsed: 'Divide Both Terms by HCF = 10,000',
              mathBefore: '40,000 : 10,000 = 4 : 1',
              mathAfter: 'm = 4,  n = 1,  m + n = 5 total parts',
              explanation:
                'Prashanti invested 4 parts for every 1 part Bhuvan invested, making 4 + 1 = 5 equal parts in total.',
              funTip: '4 out of 5 parts is 4/5 (80%), and 1 out of 5 parts is 1/5 (20%)!',
              checkQuestion: {
                prompt: 'If ₹3,000 is divided into 5 equal parts, how much is 1 single part worth?',
                options: ['₹600', '₹750', '₹500', '₹1,000'],
                correctIndex: 0,
                hint: 'Divide ₹3,000 by 5 total parts: 3000 ÷ 5 = 600.',
              },
              graphHighlight: {
                x: 3000,
                y: 600,
                label: 'Bhuvan’s Share (1/5) = ₹600',
                kind: 'intercept',
              },
            },
            {
              stepNumber: 2,
              title: 'Find the Value of 1 Part: x ÷ (m + n)',
              ruleUsed: 'Unit Part Formula',
              mathBefore: '1 Part = 3,000 ÷ (4 + 1) = 3,000 ÷ 5',
              mathAfter: '1 Part = ₹600',
              explanation:
                'Dividing the total ₹3,000 profit by 5 total parts gives ₹600 per part.',
              funTip: 'Once you know 1 part, every share is just a single multiplication!',
              graphHighlight: {
                x: 3000,
                y: 2400,
                label: 'Prashanti’s Share (4/5) = ₹2,400',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 3,
              title: 'Multiply by m = 4 and n = 1 for Each Share',
              ruleUsed: 'Share₁ = 4 × 600, Share₂ = 1 × 600',
              mathBefore: 'Prashanti = 4 × ₹600,   Bhuvan = 1 × ₹600',
              mathAfter: 'Prashanti = ₹2,400,   Bhuvan = ₹600',
              explanation:
                'Prashanti receives ₹2,400 and Bhuvan receives ₹600. Together ₹2,400 + ₹600 = ₹3,000!',
              funTip: 'Double-check: 2400 : 600 = 4 : 1 and 2400 + 600 = 3000!',
              graphHighlight: {
                x: 5000,
                y: 4000,
                label: 'At ₹5,000 profit → ₹4,000 & ₹1,000',
                kind: 'vertex',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '0.8 * x',
            primaryLabel: 'Prashanti’s Share (4/5 of Total Profit x)',
            secondaryExpression: '0.2 * x',
            secondaryLabel: 'Bhuvan’s Share (1/5 of Total Profit x)',
            xDomain: [0, 5000],
            yDomain: [0, 4500],
            parameters: [],
            keyPoints: [
              { x: 3000, y: 2400, label: 'Prashanti: ₹2,400 (at ₹3,000)', kind: 'intersection' },
              { x: 3000, y: 600, label: 'Bhuvan: ₹600 (at ₹3,000)', kind: 'intercept' },
            ],
          },
          practiceTwin: {
            question:
              'A mason mixes sand and cement in the ratio 5 : 2 to make 42 kg of dry concrete mix. How many kilograms of sand and cement are in the bag?',
            equation: 'Total parts = 5 + 2 = 7;  1 part = 42 ÷ 7 = 6 kg',
            options: [
              '30 kg sand and 12 kg cement',
              '35 kg sand and 7 kg cement',
              '25 kg sand and 17 kg cement',
              '28 kg sand and 14 kg cement',
            ],
            correctIndex: 0,
            explanation:
              'There are 5 + 2 = 7 parts. Each part is 42 ÷ 7 = 6 kg. So sand = 5 × 6 = 30 kg and cement = 2 × 6 = 12 kg.',
            funRewardMessage: 'Master Ratio Mixer! +20 pts',
          },
        },
        extraProblems: [],
      },
    ],
  },
];
