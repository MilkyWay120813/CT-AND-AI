import { GanitaChapter } from '../types/math';

export const GANITA_PART_2_EXTRA_CHAPTERS: GanitaChapter[] = [
  // ===========================================================================
  // PART II · CHAPTER 4: EXPLORING SOME GEOMETRIC THEMES
  // ===========================================================================
  {
    id: 'ch11-geometric-themes',
    partLabel: 'Part II',
    chapterNumber: 4,
    title: 'Exploring Some Geometric Themes',
    sanskritOrHistoricalHook: 'Kandariya Mahadev Temple Śikhara Fractals, Polyhedron Nets & Isometric Shadows',
    pdfUrl: '/assets/aistudio/4.-EXPLORING-SOME-GEOMETRIC-THEMES_7ce5eee5.pdf',
    summary:
      'Explore self-similar fractals (Sierpinski Carpet, Sierpinski Gasket, Koch Snowflake, and Indian temple śikharas), unfold 3D polyhedron nets to find the hungry ant’s shortest path, and master front/top/side orthographic projections.',
    diagnosticSymptom:
      'I struggle to count remaining squares or holes at Step n of a fractal, or to unfold a 3D cuboid net to find the shortest surface path.',
    interactiveLabTitle: 'Fractal Step Animator & Hungry Ant Cuboid Net Unfolder',
    segments: [
      {
        id: 'seg-p2c4-1',
        segmentCode: 'Segment 4.1',
        title: 'Self-Similar Fractals: Sierpinski Carpet, Gasket & Koch Snowflake',
        subtitle:
          'How repeating a simple geometric rule creates 8ⁿ remaining squares in the Sierpinski Carpet, 3ⁿ triangles in the Gasket, and 3×4ⁿ sides in the Koch Snowflake.',
        commonStruggle:
          'Adding 8 each step instead of multiplying by 8 when counting remaining squares in the Sierpinski Carpet!',
        coreConcepts: [
          'Fractals exhibit self-similarity across scales—seen in ferns, clouds, coastlines, and the 84 mini-spires (uruśṛṅgas) of the Kandariya Mahadev Temple in Khajuraho.',
          'Sierpinski Carpet: At each step, every remaining square is split into 9 sub-squares and the center 1 is punched out → Remaining squares at Step n = 8ⁿ; total holes = 1 + 8 + 8² + ... + 8ⁿ⁻¹.',
          'Sierpinski Triangle (Gasket): Remaining upward triangles at Step n = 3ⁿ.',
          'Koch Snowflake: Each segment becomes 4 segments of length 1/3 → Sides at Step n = 3 × 4ⁿ; Perimeter multiplies by (4/3)ⁿ at every step!',
        ],
        keyFormulas: [
          { label: 'Sierpinski Carpet', formula: 'Remaining = 8ⁿ,   Holes Hₙ = 1 + 8 + 8² + ... + 8ⁿ⁻¹' },
          { label: 'Gasket & Koch Snowflake', formula: 'Gasket Triangles = 3ⁿ,   Koch Sides = 3 × 4ⁿ' },
        ],
        featuredSolution: {
          id: 'p2c4-sierpinski-carpet',
          title: 'Counting Squares & Holes in the Sierpinski Carpet & Koch Snowflake',
          topic: 'Geometric Themes · Segment 4.1',
          difficulty: 'Ganita Prakash · Part II Ch 4 Core',
          estimatedMinutes: 4,
          originalProblem:
            'In the Sierpinski Carpet fractal, Step 0 is 1 solid square. In Step 1, it is divided into 9 equal sub-squares and the middle square is removed (leaving 8 squares and 1 hole). Find: (1) the number of remaining squares at Step 3, (2) the total number of holes punched out by Step 3, and (3) the number of sides in the Koch Snowflake at Step 3.',
          finalAnswer: '(1) 8³ = 512 remaining squares; (2) 1 + 8 + 64 = 73 total holes; (3) 3 × 4³ = 192 Koch Snowflake sides',
          funAnalogy: {
            title: 'The Infinite Temple Spire Blueprint',
            story:
              'Just like the architects of the Kandariya Mahadev Temple surrounded the central śikhara with smaller identical replicas of itself, every surviving square in the Sierpinski Carpet gives birth to 8 baby squares and 1 new center courtyard at the next step!',
            punchline:
              'Every surviving square multiplies by 8—so Step n has 8ⁿ squares and adds 8ⁿ⁻¹ brand-new holes!',
            realWorldVariableMap: [
              { symbol: 'Rₙ = 8ⁿ', meaning: 'Number of remaining solid squares at Step n' },
              { symbol: 'Hₙ = 1 + 8 + ... + 8ⁿ⁻¹', meaning: 'Cumulative holes punched out up to Step n' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Find Remaining Solid Squares at Step 3 (8ⁿ)',
              ruleUsed: 'Each Square Splits into 8 Surviving Sub-Squares',
              mathBefore: 'R₀ = 1,   R₁ = 8,   R₂ = 8² = 64,   R₃ = 8³',
              mathAfter: 'R₃ = 8 × 64 = 512 remaining squares',
              explanation:
                'Because each surviving square at Step n-1 becomes 8 smaller squares at Step n, the number of remaining squares grows exponentially as 8ⁿ.',
              funTip: 'Notice that 8³ = (2³)³ = 2⁹ = 512 from Power Play!',
              checkQuestion: {
                prompt: 'How many NEW holes are punched out when moving from Step 2 (which has 64 remaining squares) to Step 3?',
                options: [
                  '64 new holes (1 inside each of the 64 squares)',
                  '8 new holes',
                  '512 new holes',
                  '9 new holes',
                ],
                correctIndex: 0,
                hint: 'Each of the 64 remaining squares at Step 2 gets 1 center hole punched out in Step 3!',
              },
              graphHighlight: {
                x: 2,
                y: 64,
                label: 'Step 2: 8² = 64 squares',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 2,
              title: 'Sum the Holes Punched Out Across Steps 1, 2, and 3',
              ruleUsed: 'Hₙ = Hₙ₋₁ + 8ⁿ⁻¹',
              mathBefore: 'H₃ = 1 (Step 1) + 8 (Step 2) + 64 (Step 3)',
              mathAfter: 'H₃ = 73 total holes',
              explanation:
                'Step 1 punches 1 big hole; Step 2 punches 8 medium holes; Step 3 punches 64 small holes, giving 1 + 8 + 64 = 73 holes in total.',
              funTip: 'Formula bonus: 1 + 8 + 8² = (8³ - 1) ÷ (8 - 1) = 511 ÷ 7 = 73!',
              graphHighlight: {
                x: 3,
                y: 512,
                label: 'Step 3: 8³ = 512 squares',
                kind: 'vertex',
              },
            },
            {
              stepNumber: 3,
              title: 'Find the Number of Sides in the Koch Snowflake at Step 3',
              ruleUsed: 'Each Side Splits into 4 Segments → Sₙ = 3 × 4ⁿ',
              mathBefore: 'S₀ = 3,   S₁ = 3 × 4 = 12,   S₃ = 3 × 4³',
              mathAfter: 'S₃ = 3 × 64 = 192 sides',
              explanation:
                'Starting with an equilateral triangle (3 sides), every side turns into 4 smaller segments at each step, so Step 3 has 3 × 4³ = 192 sides.',
              funTip: 'While the area of a Koch Snowflake stays finite, its perimeter (4/3)ⁿ grows to infinity!',
              graphHighlight: {
                x: 3,
                y: 192,
                label: 'Koch Step 3: 192 sides',
                kind: 'intercept',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '8 ^ x',
            primaryLabel: 'Sierpinski Carpet Squares R(n) = 8ⁿ',
            secondaryExpression: '3 * (4 ^ x)',
            secondaryLabel: 'Koch Snowflake Sides S(n) = 3 × 4ⁿ',
            xDomain: [0, 3.2],
            yDomain: [0, 540],
            parameters: [],
            keyPoints: [
              { x: 1, y: 8, label: 'Step 1: 8 squares', kind: 'intercept' },
              { x: 2, y: 64, label: 'Step 2: 64 squares', kind: 'intersection' },
              { x: 3, y: 512, label: 'Step 3: 512 squares', kind: 'vertex' },
            ],
          },
          practiceTwin: {
            question:
              'In the Sierpinski Triangle (Gasket), Step 0 has 1 upward triangle, and each step replaces every upward triangle with 3 smaller upward triangles. How many upward triangles are there at Step 4?',
            equation: 'Tₙ = 3ⁿ  at  n = 4',
            options: ['81 triangles', '12 triangles', '27 triangles', '64 triangles'],
            correctIndex: 0,
            explanation:
              'At Step 4, the number of upward triangles is 3⁴ = 3 × 3 × 3 × 3 = 81!',
            funRewardMessage: 'Fractal Architect Badge! +20 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p2c4-2',
        segmentCode: 'Segment 4.2',
        title: 'Visualising Solids, Polyhedron Nets & Shortest Path on a Cuboid',
        subtitle:
          'The 11 nets of a cube, nets of pyramids/prisms/octahedra, and unfolding a cuboid so the hungry ant walks in a straight line to the laddu!',
        commonStruggle:
          'Making the ant walk strictly parallel to the edges of the box (46 cm) instead of unfolding the two faces flat and taking the 40 cm diagonal!',
        coreConcepts: [
          'A cube has exactly 11 distinct flat nets (6 square faces); a regular tetrahedron has 2 nets; an octahedron has 11 nets; a dodecahedron has 43,380 nets!',
          'The shortest distance between two points on the surface of a 3D polyhedron is a straight line drawn on its unfolded flat net!',
          'For the textbook Hungry Ant on a 30 × 12 × 12 cm cuboid: unfolding the front and right faces creates a right triangle with legs 24 cm and 32 cm, giving shortest path √(24² + 32²) = 40 cm!',
        ],
        keyFormulas: [
          { label: 'Unfolded Net Shortest Path', formula: 'd = √(ΔX² + ΔY²) on the flattened 2D net' },
          { label: 'Textbook Ant & Laddu Path', formula: 'd = √(24² + 32²) = √(576 + 1024) = √1600 = 40 cm' },
        ],
        featuredSolution: {
          id: 'p2c4-hungry-ant-cuboid',
          title: 'The Hungry Ant & The Laddu on a 30 × 12 × 12 cm Cuboid',
          topic: 'Geometric Themes · Segment 4.2',
          difficulty: 'Ganita Prakash · Part II Ch 4 Classic',
          estimatedMinutes: 5,
          originalProblem:
            'From Ganita Prakash Part II Ch 4: A hungry ant is on the left wall of a 30 cm × 12 cm × 12 cm cuboid box, 2 cm above the floor (so 10 cm below the roof). A laddu is on the right wall, 2 cm below the roof (10 cm above the floor). By unfolding the cuboid net flat, compare the two diagonal routes to find the shortest path!',
          finalAnswer: '40 cm (unfolding the front + right wall gives legs 24 cm and 32 cm: √(24² + 32²) = 40 cm, beating the 42.4 cm roof route and 46 cm edge walk!)',
          funAnalogy: {
            title: 'Flatten the Cardboard Box Before Drawing Your Map!',
            story:
              'An ant crawling across a cardboard box doesn’t care about 3D corners—if you slit the tape and lay the cardboard flat on your desk, the ant’s crooked 2-wall journey becomes one laser-straight hypotenuse!',
            punchline:
              'Unfold the faces into a flat net, then apply the Baudhāyana-Pythagoras theorem!',
            realWorldVariableMap: [
              { symbol: 'Route 1 Legs: 30 & 30 cm', meaning: 'Over the top roof: Δx = 30 cm, Δy = 10 + 12 + 8 = 30 cm' },
              { symbol: 'Route 2 Legs: 24 & 32 cm', meaning: 'Around the front + right side: Δx = 12 + 12 = 24 cm, Δy = 30 + 2 = 32 cm' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Check the Edge-Parallel Walk & Top-Roof Net Route',
              ruleUsed: 'Flatten Top Roof Between Left & Right Walls',
              mathBefore: 'd_edges = 10 + 30 + 2 + 4 = 46 cm,   d_roof = √(30² + 30²)',
              mathAfter: 'd_roof = √1800 ≈ 42.43 cm',
              explanation:
                'Walking straight across the top roof (length 30 cm) with a total vertical/depth shift of 30 cm gives a right triangle with legs 30 cm and 30 cm, so d = √1800 ≈ 42.43 cm.',
              funTip: '42.43 cm already beats walking along the edges (46 cm)—but can unfolding the side wall beat 42.43 cm?',
              checkQuestion: {
                prompt: 'In Route 2 (unfolding the front wall and right wall flat), the horizontal leg is 24 cm and the vertical leg is 32 cm. What is √(24² + 32²)?',
                options: ['40 cm', '42 cm', '38 cm', '44 cm'],
                correctIndex: 0,
                hint: '(24, 32, 40) is 8 times the famous (3, 4, 5) Baudhāyana triple: 8 × 5 = 40 cm!',
              },
              graphHighlight: {
                x: 30,
                y: 42.43,
                label: 'Roof Unfold: √(30²+30²) ≈ 42.43 cm',
                kind: 'intercept',
              },
            },
            {
              stepNumber: 2,
              title: 'Unfold the Front & Right Side Walls (Legs 24 cm and 32 cm)',
              ruleUsed: 'Baudhāyana-Pythagoras Theorem on Flattened Net',
              mathBefore: 'd_side = √(24² + 32²) = √(576 + 1,024)',
              mathAfter: 'd_side = √1600 = 40 cm',
              explanation:
                'When the right face is folded down flat next to the front face, the horizontal span is 12 + 12 = 24 cm and the length span is 30 + 2 = 32 cm. Thus √(576 + 1024) = √1600 = 40 cm!',
              funTip: 'Notice how 24 : 32 : 40 is just 8 × (3 : 4 : 5)!',
              graphHighlight: {
                x: 24,
                y: 40,
                label: 'Winner! Side Unfold: √(24²+32²) = 40 cm',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 3,
              title: 'Compare All Three Paths',
              ruleUsed: '40 cm < 42.43 cm < 46 cm',
              mathBefore: '40 cm < 42.43 cm < 46 cm',
              mathAfter: 'Shortest Path = 40 cm',
              explanation:
                'Even though the ant crosses an extra crease on the side-wall net, the unfolded straight line of 40 cm is 2.43 cm shorter than the roof route and 6 cm shorter than walking parallel to the edges!',
              funTip: 'Always test different ways of unfolding the net—different creases create different right triangles!',
              graphHighlight: {
                x: 0,
                y: 32,
                label: 'Vertical Span = 32 cm',
                kind: 'vertex',
              },
            },
          ],
          graphConfig: {
            primaryExpression: 'sqrt(x * x + 32 * 32)',
            primaryLabel: 'Unfolded Hypotenuse d(x) = √(x² + 32²)',
            secondaryExpression: '42.43',
            secondaryLabel: 'Roof Route Benchmark (42.43 cm)',
            xDomain: [0, 35],
            yDomain: [30, 50],
            parameters: [],
            keyPoints: [
              { x: 24, y: 40, label: 'x = 24 cm → Shortest Path = 40 cm!', kind: 'intersection' },
              { x: 28, y: 42.52, label: 'Exceeds roof route past x = 27.8 cm', kind: 'intercept' },
            ],
          },
          practiceTwin: {
            question:
              'How many distinct flat nets can be folded to form a standard 6-faced cube (without overlapping squares)?',
            equation: 'Distinct Hexomino Nets of a Cube',
            options: ['11 nets', '6 nets', '8 nets', '12 nets'],
            correctIndex: 0,
            explanation:
              'A cube has exactly 11 distinct flat nets (out of the 35 possible hexominoes made of 6 squares)!',
            funRewardMessage: '3D Spatial Master! +25 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p2c4-3',
        segmentCode: 'Segment 4.3',
        title: 'Orthographic Projections (Front, Top, Side Views) & Isometric Grids',
        subtitle:
          'How parallel sunbeams cast undistorted shadows on vertical, horizontal, and side planes, and drawing 3D cube stacks on isometric dot paper.',
        commonStruggle:
          'Confusing the Top View (looking straight down at the horizontal plane) with the Front View (looking horizontally at the vertical plane).',
        coreConcepts: [
          'Orthographic projection uses perpendicular rays onto three mutually perpendicular planes: Front View (Vertical Plane), Top View (Horizontal Plane), and Side View (Profile Plane).',
          'Parallel line segments on a 3D object project to parallel line segments on the projection plane!',
          'Isometric grids use equilateral triangles (60°/120° axes) so that unit lengths along width, depth, and height are all drawn at the exact same 1:1 scale.',
        ],
        keyFormulas: [
          { label: 'Max vs Min Cubes', formula: 'Given Front & Top views, count column heights h(r, c)' },
          { label: 'Foreshortening Law', formula: 'Projected length L′ = L when parallel to plane; 0 when perpendicular' },
        ],
        featuredSolution: {
          id: 'p2c4-voxel-projections',
          title: 'Counting Minimum & Maximum Unit Cubes from Front and Top Shadows',
          topic: 'Geometric Themes · Segment 4.3',
          difficulty: 'Ganita Prakash · Part II Ch 4 Spatial Puzzle',
          estimatedMinutes: 4,
          originalProblem:
            'A 3D building is made of unit cubes on a 2×2 base grid. Its Top View shows all 4 base squares covered. Its Front View shows column heights of 3 cubes on the left and 2 cubes on the right. Its Side View also shows heights of 3 cubes and 2 cubes. What are the MAXIMUM and MINIMUM number of unit cubes that could form this structure?',
          finalAnswer: 'Maximum = 9 cubes (with Front+Side+Top views: [3, 2; 2, 2]) or 10 cubes (Front+Top only); Minimum = 7 cubes (heights [3, 1; 1, 2])',
          funAnalogy: {
            title: 'The Shadow Detective Puzzle',
            story:
              'A tall tower in the front row can hide a shorter tower right behind it in the Front View shadow! To find the maximum cubes, pack every hidden spot as tall as the shadows allow; to find the minimum cubes, drop hidden spots down to 1 cube!',
            punchline:
              'Each row and column max must match the Front/Side view height, and every Top-View square needs at least 1 cube!',
            realWorldVariableMap: [
              { symbol: 'Max Grid: [3, 2 ; 2, 2]', meaning: 'Every cell takes the smaller of its row max and column max (3+2+2+2 = 9)' },
              { symbol: 'Min Grid: [3, 1 ; 1, 2]', meaning: 'Only one cell hits height 3 and one hits height 2; others stay at 1 (3+1+1+2 = 7)' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Set Up the 2×2 Base Grid from the Top View',
              ruleUsed: 'Top View = Non-Zero Cells in Base Grid',
              mathBefore: 'Base Grid = [a, b ; c, d],   where a, b, c, d ≥ 1',
              mathAfter: 'max(a, c) = 3,  max(b, d) = 2,  max(a, b) = 3,  max(c, d) = 2',
              explanation:
                'Since all 4 squares appear in the Top View, every cell has at least 1 cube. The Front View fixes column maximums to (3, 2) and the Side View fixes row maximums to (3, 2).',
              funTip: 'Writing a 2D height grid turns a tricky 3D puzzle into simple number logic!',
              checkQuestion: {
                prompt: 'In the cell where the height-3 row meets the height-3 column, what is the maximum height a can have?',
                options: ['3 cubes', '2 cubes', '4 cubes', '1 cube'],
                correctIndex: 0,
                hint: 'Both the Front View and Side View allow height 3 in that corner!',
              },
              graphHighlight: {
                x: 2,
                y: 9,
                label: 'Max with both views (3,2): 3+2+2+2 = 9 cubes',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 2,
              title: 'Find the Maximum Cube Count',
              ruleUsed: 'h_max(r, c) = min(RowMax[r], ColMax[c])',
              mathBefore: 'Grid = [min(3,3), min(3,2) ; min(2,3), min(2,2)] = [3, 2 ; 2, 2]',
              mathAfter: 'Max Cubes = 3 + 2 + 2 + 2 = 9 cubes (or 10 if Side View is unconstrained)',
              explanation:
                'When both Front and Side views are fixed at (3, 2), each cell can be at most min(rowMax, colMax), giving 3 + 2 + 2 + 2 = 9 cubes (and 3 + 3 + 2 + 2 = 10 cubes if only Front + Top views are given).',
              funTip: 'Notice how adding a Side View constraint trims the maximum from 10 down to 9!',
              graphHighlight: {
                x: 1,
                y: 7,
                label: 'Minimum Cubes: 3+1+1+2 = 7 cubes',
                kind: 'intercept',
              },
            },
            {
              stepNumber: 3,
              title: 'Find the Minimum Cube Count',
              ruleUsed: 'Place Peaks on Diagonal, Set Remaining Covered Cells to 1',
              mathBefore: 'Min Grid = [3, 1 ; 1, 2]',
              mathAfter: 'Min Cubes = 3 + 1 + 1 + 2 = 7 cubes',
              explanation:
                'Placing height 3 at top-left satisfies both the height-3 row and height-3 column at once! Placing height 2 at bottom-right satisfies both height-2 views, and the other two cells need just 1 cube each → 3 + 1 + 1 + 2 = 7 cubes.',
              funTip: 'Putting tall towers on the diagonal lets one tower cast two shadows at once!',
              graphHighlight: {
                x: 3,
                y: 10,
                label: 'Front+Top Only Max = 10 cubes',
                kind: 'vertex',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '7 + x',
            primaryLabel: 'Total Cubes C(x) as Hidden Cells Fill Up',
            xDomain: [0, 4],
            yDomain: [5, 12],
            parameters: [],
            keyPoints: [
              { x: 0, y: 7, label: 'Min Cubes = 7 ([3,1; 1,2])', kind: 'intercept' },
              { x: 2, y: 9, label: 'Front+Side+Top Max = 9 ([3,2; 2,2])', kind: 'intersection' },
              { x: 3, y: 10, label: 'Front+Top Max = 10 ([3,2; 3,2])', kind: 'vertex' },
            ],
          },
          practiceTwin: {
            question:
              'A line segment AB of length 10 cm is held perpendicular to the vertical projection screen. What is the shadow (projection) of AB on the screen?',
            equation: 'L′ = L · cos(90°) = 0',
            options: [
              'A single point (length 0 cm)',
              'A line segment of 10 cm',
              'A line segment of 5 cm',
              'A circle of diameter 10 cm',
            ],
            correctIndex: 0,
            explanation:
              'When a line segment is perpendicular to the projection plane, all points on the segment project onto the exact same point!',
            funRewardMessage: 'Projection Architect! +20 pts',
          },
        },
        extraProblems: [],
      },
    ],
  },

  // ===========================================================================
  // PART II · CHAPTER 5: TALES BY DOTS AND LINES
  // ===========================================================================
  {
    id: 'ch12-dots-and-lines',
    partLabel: 'Part II',
    chapterNumber: 5,
    title: 'Tales by Dots and Lines',
    sanskritOrHistoricalHook: 'Mean as the Seesaw Balance Point (∑d_LHS = ∑d_RHS), Medians & Monsoon Line Graphs',
    pdfUrl: '/assets/aistudio/5.-TALES-BY-DOTS-AND-LINES_73a3818f.pdf',
    summary:
      'Discover why the arithmetic mean acts as a physical fulcrum where left and right distances balance, track how adding/removing values shifts the mean and median, and decode multi-line climate and space-launch graphs.',
    diagnosticSymptom:
      'I forget to sort numbers before finding the median, or I recalculate an entire sum from scratch when one new number is added to a dataset.',
    interactiveLabTitle: 'The Balancing Act: Interactive Mean Fulcrum Seesaw & Median Tracker',
    segments: [
      {
        id: 'seg-p2c5-1',
        segmentCode: 'Segment 5.1',
        title: 'The Balancing Act: Mean as Fulcrum (∑d_LHS = ∑d_RHS) & Data Shifts',
        subtitle:
          'Why total distance below the mean equals total distance above the mean, and solving Coach Balwan’s smudged kushti weight.',
        commonStruggle:
          'Not realizing that ∑(Mean - xᵢ) on the left equals ∑(xⱼ - Mean) on the right, which lets you find missing data points in seconds!',
        coreConcepts: [
          'The arithmetic mean is the exact center of gravity (fulcrum) of a dot plot: Total distance of dots to the left of the mean = Total distance of dots to the right of the mean (∑d_LHS = ∑d_RHS).',
          'Adding a constant c to every data point shifts the mean by +c; multiplying every data point by k multiplies the mean by k.',
          'Adding a value greater than the current mean pulls the mean UP; removing a value greater than the mean pulls the mean DOWN.',
        ],
        keyFormulas: [
          { label: 'Fulcrum Balance Law', formula: '∑ (Mean - x_left) = ∑ (x_right - Mean)' },
          { label: 'Shift & Scale Laws', formula: 'Mean(x + c) = Mean(x) + c,   Mean(k·x) = k · Mean(x)' },
        ],
        featuredSolution: {
          id: 'p2c5-coach-balwan-kushti',
          title: 'Coach Balwan’s Smudged Kushti Wrestler Weight via Fulcrum Balance',
          topic: 'Tales by Dots and Lines · Segment 5.1',
          difficulty: 'Ganita Prakash · Part II Ch 5 Core',
          estimatedMinutes: 4,
          originalProblem:
            'Coach Balwan recorded the weights of 6 kushti wrestlers with an average (mean) weight of 55 kg. Five of the weights are 48 kg, 51 kg, 53 kg, 58 kg, and 61 kg, while the 6th weight got smudged by mud. Find the 6th wrestler’s weight using (A) the Mean Fulcrum Balance Law ∑d_LHS = ∑d_RHS and (B) Total Sum.',
          finalAnswer: '59 kg (Left distances below 55 sum to 7 + 4 + 2 = 13; known right distances above 55 sum to 3 + 6 = 9, so the 6th weight is 4 kg above 55 → 55 + 4 = 59 kg!)',
          funAnalogy: {
            title: 'The Wrestlers’ Seesaw at 55 kg',
            story:
              'Place a playground seesaw fulcrum right at 55 kg. The three lighter wrestlers sit at 7, 4, and 2 steps to the left (total left torque = 13). Two heavier wrestlers sit at 3 and 6 steps to the right (torque = 9). To balance the seesaw at 13 = 13, the mud-smudged wrestler must sit at step +4 on the right—which is 59 kg!',
            punchline:
              'You never need big multiplication when you balance distances around the mean!',
            realWorldVariableMap: [
              { symbol: 'd_LHS = 7 + 4 + 2 = 13', meaning: 'Total kg below the 55 kg mean (48, 51, 53)' },
              { symbol: 'd_RHS = 3 + 6 + d₆ = 13', meaning: 'Total kg above the 55 kg mean (58, 61, and x₆)' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Sum the Left Distances Below the Mean (55 kg)',
              ruleUsed: 'd_LHS = ∑ (55 - xᵢ) for xᵢ < 55',
              mathBefore: 'd_LHS = (55 - 48) + (55 - 51) + (55 - 53)',
              mathAfter: 'd_LHS = 7 + 4 + 2 = 13 kg',
              explanation:
                'The three wrestlers lighter than 55 kg (48, 51, 53) are 7 kg, 4 kg, and 2 kg below the mean, giving a total left distance of 13 kg.',
              funTip: 'Subtracting near 55 uses tiny 1-digit numbers instead of 3-digit sums!',
              checkQuestion: {
                prompt: 'The two known wrestlers above 55 kg weigh 58 kg and 61 kg. What is their combined distance above 55 kg?',
                options: ['3 + 6 = 9 kg', '8 + 1 = 9 kg', '58 + 61 = 119 kg', '4 kg'],
                correctIndex: 0,
                hint: '(58 - 55) + (61 - 55) = 3 + 6 = 9 kg.',
              },
              graphHighlight: {
                x: 55,
                y: 13,
                label: 'Fulcrum at 55 kg: d_LHS = d_RHS = 13',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 2,
              title: 'Balance the Right Distances Above the Mean (∑d_RHS = 13)',
              ruleUsed: 'Fulcrum Balance Law: ∑d_LHS = ∑d_RHS',
              mathBefore: '(58 - 55) + (61 - 55) + (x₆ - 55) = 13',
              mathAfter: '3 + 6 + (x₆ - 55) = 13  ⇒  x₆ - 55 = 4',
              explanation:
                'For the mean to balance at 55 kg, the right side must also total 13 kg. Since 3 + 6 = 9 kg is already there, the 6th wrestler must be 4 kg above 55 kg.',
              funTip: 'So x₆ = 55 + 4 = 59 kg!',
              graphHighlight: {
                x: 59,
                y: 4,
                label: '6th Wrestler = 59 kg (+4 above mean)',
                kind: 'vertex',
              },
            },
            {
              stepNumber: 3,
              title: 'Verify with the Total Sum Method',
              ruleUsed: 'Total Sum = n × Mean = 6 × 55 = 330 kg',
              mathBefore: '48 + 51 + 53 + 58 + 61 + x₆ = 330',
              mathAfter: '271 + x₆ = 330  ⇒  x₆ = 59 kg',
              explanation:
                'Both methods agree: 271 + 59 = 330 kg, and 330 ÷ 6 = 55 kg!',
              funTip: 'If every wrestler drinks 0.5 kg of water (+0.5 kg each), the new mean immediately becomes 55.5 kg!',
              graphHighlight: {
                x: 48,
                y: -7,
                label: 'Lightest Wrestler: 48 kg (-7 from mean)',
                kind: 'intercept',
              },
            },
          ],
          graphConfig: {
            primaryExpression: 'x - 55',
            primaryLabel: 'Signed Distance from Mean Fulcrum: d(x) = x - 55',
            secondaryExpression: '0',
            secondaryLabel: 'Balanced Mean Line (55 kg)',
            xDomain: [45, 65],
            yDomain: [-10, 10],
            parameters: [],
            keyPoints: [
              { x: 48, y: -7, label: '48 kg (d = -7)', kind: 'intercept' },
              { x: 55, y: 0, label: 'Mean Fulcrum = 55 kg', kind: 'root' },
              { x: 59, y: 4, label: 'Smudged Weight = 59 kg (d = +4)', kind: 'vertex' },
            ],
          },
          practiceTwin: {
            question:
              'The mean of 8 numbers is 24. If 5 is added to every number and then each result is multiplied by 2, what is the new mean?',
            equation: 'New Mean = 2 × (24 + 5)',
            options: ['58', '53', '48', '29'],
            correctIndex: 0,
            explanation:
              'Adding 5 shifts the mean to 24 + 5 = 29; multiplying by 2 scales the mean to 2 × 29 = 58!',
            funRewardMessage: 'Seesaw Balance Master! +20 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p2c5-2',
        segmentCode: 'Segment 5.2',
        title: 'Tinkering with the Median, Frequency Tables & Spreadsheets',
        subtitle:
          'Why the median ignores extreme outliers, computing frequency-weighted means ∑(fᵢxᵢ)/∑fᵢ, and spreadsheet formulas.',
        commonStruggle:
          'Picking the middle number of an unsorted list as the median, or forgetting to average the two middle numbers when n is even.',
        coreConcepts: [
          'Always sort data in ascending order first! If n is odd, Median = ((n+1)/2)-th value; if n is even, Median = average of (n/2)-th and (n/2 + 1)-th values.',
          'Unlike the mean, changing the largest value to 1,000,000 does not change the median at all (outlier resistance!).',
          'In a frequency table, Total = ∑(fᵢ · xᵢ) and Mean = ∑(fᵢ · xᵢ) / ∑fᵢ. In spreadsheets, `=SUM(B3:G3)` and `=AVERAGE(B3:G3)` automate this.',
        ],
        keyFormulas: [
          { label: 'Frequency Table Mean', formula: 'Mean = ∑(fᵢ · xᵢ) ÷ ∑fᵢ' },
          { label: 'Median Position (Sorted)', formula: 'Odd n: pos (n+1)/2;   Even n: avg of pos n/2 & n/2 + 1' },
        ],
        featuredSolution: {
          id: 'p2c5-median-frequency',
          title: 'Frequency Table Mean & Median Outlier Resistance',
          topic: 'Tales by Dots and Lines · Segment 5.2',
          difficulty: 'Ganita Prakash · Part II Ch 5 Core',
          estimatedMinutes: 4,
          originalProblem:
            'In a class shoe-size survey of 15 students, the sorted sizes are: four 5s, six 6s, three 7s, and two 8s. Find (1) the Mean shoe size using ∑(fᵢxᵢ) ÷ ∑fᵢ, (2) the Median shoe size, and (3) what happens to the Median if one student with size 8 is replaced by a visiting basketball giant with size 18!',
          finalAnswer: '(1) Mean = 93 ÷ 15 = 6.2; (2) Median (8th value) = 6; (3) Median stays 6 (while Mean jumps to 6.87)!',
          funAnalogy: {
            title: 'The Middle Student in the Height Lineup',
            story:
              'If 15 students stand in order of height, student #8 in the exact middle determines the median. Even if the tallest student #15 stands on stilts and grows 10 feet taller, student #8 in the middle doesn’t budge an inch!',
            punchline:
              'The Mean listens to every value’s magnitude; the Median only cares about who stands in the middle!',
            realWorldVariableMap: [
              { symbol: '∑(fᵢxᵢ) = 93', meaning: '4(5) + 6(6) + 3(7) + 2(8) = 20 + 36 + 21 + 16 = 93' },
              { symbol: 'Pos (15+1)/2 = 8th', meaning: 'Middle position for n = 15 sorted values' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Multiply Each Value by Its Frequency (∑fᵢxᵢ)',
              ruleUsed: 'Weighted Frequency Sum',
              mathBefore: '∑(fᵢ × xᵢ) = 4(5) + 6(6) + 3(7) + 2(8) = 20 + 36 + 21 + 16 = 93',
              mathAfter: 'Mean = 93 ÷ 15 = 6.2',
              explanation:
                'Instead of adding fifteen numbers one by one, multiply each shoe size by how many students wear it, sum to 93, and divide by 15 students.',
              funTip: 'In a spreadsheet where B2:E2 has sizes and B3:E3 has frequencies, this is ∑(size × count) ÷ SUM(B3:E3)!',
              checkQuestion: {
                prompt: 'For n = 15 sorted students, which position is the exact median, and which shoe size is at that position?',
                options: [
                  '8th student → shoe size 6 (since positions 5 to 10 have size 6)',
                  '7th student → shoe size 5',
                  '11th student → shoe size 7',
                  '15th student → shoe size 8',
                ],
                correctIndex: 0,
                hint: 'Positions 1–4 are size 5; positions 5–10 are size 6. So the 8th student has size 6!',
              },
              graphHighlight: {
                x: 8,
                y: 6,
                label: 'Original Mean = 6.2, Median = 6',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 2,
              title: 'Locate the Median via Cumulative Frequency',
              ruleUsed: 'Median Position = (15 + 1) ÷ 2 = 8th Student',
              mathBefore: 'Positions 1–4: size 5,   Positions 5–10: size 6',
              mathAfter: '8th value = 6  ⇒  Median = 6',
              explanation:
                'The first 4 students wear size 5, and the next 6 students (positions 5 through 10) wear size 6. Therefore the 8th student wears size 6.',
              funTip: 'Cumulative frequencies (4, 10, 13, 15) let you spot where position 8 lands instantly!',
              graphHighlight: {
                x: 18,
                y: 6.87,
                label: 'Outlier x=18 pulls Mean to 6.87 (Median stays 6!)',
                kind: 'vertex',
              },
            },
            {
              stepNumber: 3,
              title: 'Test the Giant Outlier (Size 8 → Size 18)',
              ruleUsed: 'Outlier Sensitivity: Mean vs Median',
              mathBefore: 'New Sum = 93 + 10 = 103  ⇒  New Mean = 103 ÷ 15 ≈ 6.87',
              mathAfter: 'New Median (8th student) = 6 (Unchanged!)',
              explanation:
                'Replacing one 8 with 18 adds +10 to the sum, pulling the mean up from 6.2 to 6.87, but the 8th student in the middle still wears size 6!',
              funTip: 'That’s why shoe shops use the Mode and Median to stock shelves instead of just the Mean!',
              graphHighlight: {
                x: 12,
                y: 6.47,
                label: 'At x=12, Mean = 6.47, Median = 6',
                kind: 'intercept',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '(85 + x) / 15',
            primaryLabel: 'Mean Shoe Size as Largest Student’s Size x Increases',
            secondaryExpression: '6',
            secondaryLabel: 'Median Shoe Size = 6 (Rock-steady against outliers!)',
            xDomain: [8, 20],
            yDomain: [5.5, 7.5],
            parameters: [],
            keyPoints: [
              { x: 8, y: 6.2, label: 'x = 8: Mean = 6.2', kind: 'intersection' },
              { x: 18, y: 6.87, label: 'x = 18: Mean = 6.87, Median = 6', kind: 'vertex' },
            ],
          },
          practiceTwin: {
            question:
              'Find the median of the 8 numbers: 14, 7, 22, 9, 18, 11, 25, 15.',
            equation: 'Sorted: 7, 9, 11, 14, 15, 18, 22, 25 (Average of 4th & 5th)',
            options: ['14.5', '14', '15', '13.5'],
            correctIndex: 0,
            explanation:
              'Sorting gives 7, 9, 11, 14, 15, 18, 22, 25. For n = 8 (even), average the 4th (14) and 5th (15) values: (14 + 15) ÷ 2 = 14.5!',
            funRewardMessage: 'Median Maestro! +20 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p2c5-3',
        segmentCode: 'Segment 5.3',
        title: 'Line Graphs, Monsoon Coast Trends & Visual Infographics',
        subtitle:
          'Reading slope steepness as rate of change, comparing Kerala vs Punjab temperature curves, and Manoj’s 48-box daily strip.',
        commonStruggle:
          'Looking only at the height of a line graph instead of its slope (steepness) when asked which period had the fastest increase.',
        coreConcepts: [
          'In a time-series line graph, a steeper upward slope means a faster rate of increase; a flat horizontal segment means zero change; a downward slope means a decrease.',
          'Comparing Kerala vs Punjab monthly temperatures: Kerala (coastal/tropical) stays flat and warm year-round (26°C–29°C), while Punjab (continental) swings widely from 12°C in January to 34°C in June!',
          'Comparing West Coast vs East Coast rainfall: West Coast peaks sharply in June–July (Southwest Monsoon), while East Coast (Tamil Nadu) peaks in October–November (Northeast Monsoon).',
        ],
        keyFormulas: [
          { label: 'Rate of Change (Slope)', formula: 'Rate = (Change in Y) ÷ (Change in Time Δt)' },
          { label: 'Temperature Range', formula: 'Range = Maximum Temperature - Minimum Temperature' },
        ],
        featuredSolution: {
          id: 'p2c5-kerala-punjab-climate',
          title: 'Decoding Kerala vs Punjab Temperature Curves & Monsoon Slopes',
          topic: 'Tales by Dots and Lines · Segment 5.3',
          difficulty: 'Ganita Prakash · Part II Ch 5 Data Story',
          estimatedMinutes: 4,
          originalProblem:
            'In the Ganita Prakash monthly temperature graph, Kerala’s monthly average temperatures stay between 26°C and 29°C all year, while Punjab’s monthly average rises from 12°C in January (Month 1) to 34°C in June (Month 6). Find (1) the annual temperature range of each state and (2) Punjab’s average rate of warming (°C per month) from January to June.',
          finalAnswer: '(1) Kerala Range = 3°C, Punjab Range = 22°C; (2) Punjab warms at +4.4°C per month from Jan to June',
          funAnalogy: {
            title: 'The Rollercoaster vs The Cruise Ship',
            story:
              'On a temperature graph, Kerala rides a calm ocean cruise ship—kept steady by the Arabian Sea breeze within a 3°C band. Far inland, Punjab rides a dramatic rollercoaster—climbing 22°C from chilly January mornings to blazing June afternoons!',
            punchline:
              'Flat curve = small range & maritime stability; steep curve = rapid rate of change!',
            realWorldVariableMap: [
              { symbol: 'Range_Kerala = 29 - 26 = 3°C', meaning: 'Tiny coastal temperature variation' },
              { symbol: 'Slope_Punjab = (34 - 12)/5 = +4.4°C/mo', meaning: 'Average monthly warming rate from Jan to June' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Compare the Annual Temperature Ranges (Max - Min)',
              ruleUsed: 'Range = T_max - T_min',
              mathBefore: 'Range(Kerala) = 29°C - 26°C,   Range(Punjab) = 34°C - 12°C',
              mathAfter: 'Range(Kerala) = 3°C,   Range(Punjab) = 22°C',
              explanation:
                'Punjab’s temperature range (22°C) is more than 7 times wider than Kerala’s range (3°C) because inland plains heat and cool much faster than coastal regions.',
              funTip: 'On a graph, Range is the vertical gap between the highest peak and lowest valley!',
              checkQuestion: {
                prompt: 'How many months elapse between Month 1 (January, 12°C) and Month 6 (June, 34°C)?',
                options: ['5 months (6 - 1 = 5)', '6 months', '4 months', '7 months'],
                correctIndex: 0,
                hint: 'From Month 1 to Month 6 is Δt = 6 - 1 = 5 monthly intervals.',
              },
              graphHighlight: {
                x: 1,
                y: 12,
                label: 'Punjab Jan (Month 1): 12°C',
                kind: 'intercept',
              },
            },
            {
              stepNumber: 2,
              title: 'Calculate Punjab’s Rate of Warming (Slope)',
              ruleUsed: 'Rate = ΔT ÷ Δt',
              mathBefore: 'Rate = (34°C - 12°C) ÷ (6 - 1 months) = 22°C ÷ 5 months',
              mathAfter: 'Rate = +4.4°C per month',
              explanation:
                'Over the 5 monthly intervals from January to June, Punjab warms by 22°C, which is an average slope of +4.4°C per month.',
              funTip: 'After June (Month 6), the slope turns negative as monsoon rains and winter cool Punjab back down!',
              graphHighlight: {
                x: 6,
                y: 34,
                label: 'Punjab June Peak (Month 6): 34°C',
                kind: 'vertex',
              },
            },
            {
              stepNumber: 3,
              title: 'Find When the Two Temperature Curves Cross',
              ruleUsed: 'Intersection Point = Equal Temperature in Both States',
              mathBefore: '12 + 4.4(x - 1) ≈ 27.5',
              mathAfter: 'x ≈ 4.5 (Mid-April: Both states at ≈ 27.5°C)',
              explanation:
                'Around mid-April (between Month 4 and Month 5), Punjab’s rising curve crosses Kerala’s flat curve at roughly 27.5°C.',
              funTip: 'Where two curves intersect on a graph, both states have the exact same temperature on that date!',
              graphHighlight: {
                x: 4.5,
                y: 27.4,
                label: 'April Crossover (~27.5°C)',
                kind: 'intersection',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '34 - 0.88 * (x - 6) * (x - 6)',
            primaryLabel: 'Punjab Monthly Temp Curve (°C) — Wide 22°C Swing',
            secondaryExpression: '27.5 - 0.1 * (x - 6) * (x - 6)',
            secondaryLabel: 'Kerala Coastal Temp Curve (°C) — Steady ~27°C',
            xDomain: [1, 12],
            yDomain: [10, 38],
            parameters: [],
            keyPoints: [
              { x: 1, y: 12, label: 'Jan: Punjab 12°C', kind: 'intercept' },
              { x: 4.5, y: 27.3, label: 'Mid-April Crossover (~27.3°C)', kind: 'intersection' },
              { x: 6, y: 34, label: 'June Peak: Punjab 34°C', kind: 'vertex' },
            ],
          },
          practiceTwin: {
            question:
              'In Manoj’s 48-box daily routine strip (where 48 equal boxes represent the 24 hours of a day), how many minutes does each box represent, and how many boxes represent 8 hours of sleep?',
            equation: '24 hours ÷ 48 boxes = 0.5 hours/box',
            options: [
              '30 minutes per box; 16 boxes for 8 hours of sleep',
              '15 minutes per box; 32 boxes for 8 hours of sleep',
              '60 minutes per box; 8 boxes for 8 hours of sleep',
              '20 minutes per box; 24 boxes for 8 hours of sleep',
            ],
            correctIndex: 0,
            explanation:
              '24 hours = 1,440 minutes ÷ 48 boxes = 30 minutes (0.5 hr) per box. So 8 hours of sleep = 8 × 2 = 16 boxes!',
            funRewardMessage: 'Data Storyteller Badge! +20 pts',
          },
        },
        extraProblems: [],
      },
    ],
  },

  // ===========================================================================
  // PART II · CHAPTER 6: ALGEBRA PLAY
  // ===========================================================================
  {
    id: 'ch13-algebra-play',
    partLabel: 'Part II',
    chapterNumber: 6,
    title: 'Algebra Play',
    sanskritOrHistoricalHook: 'Shubham’s 100M+165+D Birthday Mind-Reader, Virahāṅka Pyramids & Karim’s Genie',
    pdfUrl: '/assets/aistudio/6.-ALGEBRA-PLAY_24d0580f.pdf',
    summary:
      'Unmask "Think of a Number" magic tricks using algebra, solve 3-row and 4-row Number Pyramids (a + 2b + c) and Virahāṅka-Fibonacci pyramids, and crack calendar 2×2 grids and Karim’s Banyan Tree Genie puzzle.',
    diagnosticSymptom:
      'I get stuck when a number pyramid is missing its middle base number, or I don’t know how to turn a multi-step story like Karim and the Genie into an equation.',
    interactiveLabTitle: 'Number Pyramid Solver (a + 2b + c) & Shubham’s Birthday Decoder',
    segments: [
      {
        id: 'seg-p2c6-1',
        segmentCode: 'Segment 6.1',
        title: '“Think of a Number” Tricks & Shubham’s 100M + 165 + D Birthday Decoder',
        subtitle:
          'How algebraic simplification exposes why (2x + 4)/2 - x is always 2, and how 5(4(5M + 6) + 9) + D hides the month and day in plain sight!',
        commonStruggle:
          'Being mystified by number-guessing tricks instead of naming the secret number x (or M and D) and simplifying the expression step by step.',
        coreConcepts: [
          'In "Think of a number x, double it (2x), add 4 (2x+4), divide by 2 (x+2), subtract x", the x cancels out to leave 2 for EVERY starting number!',
          'In Shubham’s Birthday Trick: Multiply Month M by 5 (5M), add 6 (5M+6), multiply by 4 (20M+24), add 9 (20M+33), multiply by 5 (100M+165), and add Day D → Result = 100M + D + 165!',
          'Subtracting 165 from Shubham’s final number leaves 100M + D: the hundreds/thousands digits give Month M and the last two digits give Day D!',
        ],
        keyFormulas: [
          { label: 'Shubham’s Birthday Formula', formula: '5(4(5M + 6) + 9) + D = 100M + D + 165' },
          { label: 'Decoder Rule', formula: 'Result - 165 = 100M + D  →  [Month M][Day D]' },
        ],
        featuredSolution: {
          id: 'p2c6-shubham-birthday',
          title: 'Decoding Shubham’s Birthday Magic Trick (100M + D + 165)',
          topic: 'Algebra Play · Segment 6.1',
          difficulty: 'Ganita Prakash · Part II Ch 6 Highlight',
          estimatedMinutes: 4,
          originalProblem:
            'Shubham asks a friend to take their birth month M, multiply by 5, add 6, multiply by 4, add 9, multiply by 5, and finally add their birth day D. (1) Simplify this entire algebraic expression. (2) If the friend announces the final number 291, what is their birthday?',
          finalAnswer: '(1) 100M + D + 165; (2) 291 - 165 = 126 → Month M = 1 (January), Day D = 26 (26th January — Republic Day!)',
          funAnalogy: {
            title: 'The Place-Value Suitcase',
            story:
              'Multiplying M by 5, then by 4, then by 5 secretly multiplies M by 5 × 4 × 5 = 100! That shoves the Month M into the hundreds compartment of a place-value suitcase, leaving the last two digits empty for Day D, while +6, +9 pile up into a constant +165 luggage tag!',
            punchline:
              'Snip off the +165 luggage tag, and 100M + D reads out [Month][Day] automatically!',
            realWorldVariableMap: [
              { symbol: '100M', meaning: 'Month shifted two decimal places to the left' },
              { symbol: '+165', meaning: 'Constant offset from 5 × (4 × 6 + 9) = 5 × 33 = 165' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Build and Expand the Expression Inside-Out',
              ruleUsed: 'Distributive Property Step-by-Step',
              mathBefore: '5 × (4(5M + 6) + 9) + D = 5 × (20M + 24 + 9) + D',
              mathAfter: '5(20M + 33) + D = 100M + 165 + D',
              explanation:
                'Inside the bracket, 4(5M + 6) + 9 simplifies to 20M + 33. Multiplying by 5 gives 100M + 165, and adding D produces 100M + D + 165.',
              funTip: 'Notice how 5 × 4 × 5 = 100 was designed specifically to shift M into the hundreds place!',
              checkQuestion: {
                prompt: 'Once the friend tells you their final result R = 100M + D + 165, what single arithmetic step reveals 100M + D?',
                options: [
                  'Subtract 165 from R',
                  'Divide R by 165',
                  'Add 165 to R',
                  'Subtract 100 from R',
                ],
                correctIndex: 0,
                hint: '(100M + D + 165) - 165 = 100M + D.',
              },
              graphHighlight: {
                x: 1,
                y: 291,
                label: 'Jan 26 (M=1, D=26) → Result = 291',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 2,
              title: 'Subtract 165 from the Friend’s Number 291',
              ruleUsed: 'Inverse Operation: R - 165 = 100M + D',
              mathBefore: '100M + D = 291 - 165',
              mathAfter: '100M + D = 126',
              explanation:
                'Subtracting the constant 165 from 291 leaves 126.',
              funTip: 'Since D is at most 31, D never overflows into the hundreds place!',
              graphHighlight: {
                x: 8,
                y: 980,
                label: 'Aug 15 (M=8, D=15) → Result = 980',
                kind: 'vertex',
              },
            },
            {
              stepNumber: 3,
              title: 'Read Off Month M and Day D by Place Value',
              ruleUsed: '126 = 100(1) + 26',
              mathBefore: 'M = 1,   D = 26',
              mathAfter: 'Birthday: 26th January (Republic Day!)',
              explanation:
                'The hundreds digit 1 gives Month M = 1 (January), and the last two digits 26 give Day D = 26!',
              funTip: 'What if someone was born on 15th August (M=8, D=15)? Their number is 815 + 165 = 980!',
              graphHighlight: {
                x: 10,
                y: 1167,
                label: 'Oct 2 (M=10, D=02) → Result = 1167',
                kind: 'intercept',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '100 * x + 165 + 26',
            primaryLabel: 'Shubham’s Output R(M) = 100M + 165 + D (for Day D = 26)',
            secondaryExpression: '100 * x + 26',
            secondaryLabel: 'Decoded Number After Subtracting 165: 100M + 26',
            xDomain: [1, 12],
            yDomain: [100, 1400],
            parameters: [],
            keyPoints: [
              { x: 1, y: 291, label: 'Jan 26 → 291 (291-165 = 126)', kind: 'intersection' },
              { x: 8, y: 991, label: 'Aug 26 → 991 (991-165 = 826)', kind: 'vertex' },
            ],
          },
          practiceTwin: {
            question:
              'If a student uses Shubham’s Birthday Trick and gets the final number 1,094, what is their birthday? (Remember: subtract 165 first!)',
            equation: '1094 - 165 = 929 = 100(9) + 29',
            options: [
              '29th September (M = 9, D = 29)',
              '14th October (M = 10, D = 14)',
              '29th August (M = 8, D = 29)',
              '19th September (M = 9, D = 19)',
            ],
            correctIndex: 0,
            explanation:
              '1094 - 165 = 929. The hundreds digit is M = 9 (September) and the last two digits are D = 29!',
            funRewardMessage: 'Mind-Reader Mathematician! +20 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p2c6-2',
        segmentCode: 'Segment 6.2',
        title: 'Number Pyramids (a + 2b + c, a + 3b + 3c + d) & Virahāṅka-Fibonacci Pyramids',
        subtitle:
          'Why the middle base number counts TWICE in a 3-row pyramid (a + 2b + c) and THREE times in a 4-row pyramid (a + 3b + 3c + d).',
        commonStruggle:
          'Thinking the top of a 3-row pyramid with base (a, b, c) is just a + b + c instead of a + 2b + c!',
        coreConcepts: [
          'In a Number Pyramid where each brick is the sum of the two bricks below it: Row 1 = (a, b, c) → Row 2 = (a + b, b + c) → Top Row 3 = (a + b) + (b + c) = a + 2b + c!',
          'In a 4-row pyramid with base (a, b, c, d), the top brick equals a + 3b + 3c + d (Pascal/Pingala Meru Prastāra coefficients 1, 3, 3, 1!).',
          'When adjacent bricks follow the Virahāṅka-Fibonacci sequence (1, 1, 2, 3, 5, 8...), every brick in the pyramid is also a Virahāṅka number!',
        ],
        keyFormulas: [
          { label: '3-Row Pyramid Top', formula: 'Top = (a + b) + (b + c) = a + 2b + c' },
          { label: '4-Row Pyramid Top', formula: 'Top = a + 3b + 3c + d' },
        ],
        featuredSolution: {
          id: 'p2c6-number-pyramid',
          title: 'Solving Missing Bricks in a 3-Row & 4-Row Number Pyramid',
          topic: 'Algebra Play · Segment 6.2',
          difficulty: 'Ganita Prakash · Part II Ch 6 Core',
          estimatedMinutes: 4,
          originalProblem:
            'In a 3-row number pyramid, each brick is the sum of the two bricks directly below it. The bottom row has (12, b, 8) and the very top brick is 60. Find the missing middle base number b and the two second-row bricks!',
          finalAnswer: 'b = 20 (since 12 + 2b + 8 = 60 ⇒ 2b = 40 ⇒ b = 20), and the second row is (32, 28)',
          funAnalogy: {
            title: 'The Middle Brick’s Double Promotion',
            story:
              'When bricks climb a 3-row pyramid, the left corner brick a only climbs up the left stairs, and the right corner brick c only climbs up the right stairs. But the middle brick b climbs BOTH staircases at once—so it arrives at the top twice (2b)!',
            punchline:
              'Top of 3-row pyramid = a + 2b + c because the middle brick feeds both upper neighbors!',
            realWorldVariableMap: [
              { symbol: 'a = 12, c = 8', meaning: 'Left and right corner bricks of the bottom row' },
              { symbol: '2b', meaning: 'Double contribution of the middle brick b to the apex 60' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Write the Second Row in Terms of b',
              ruleUsed: 'Each Upper Brick = Sum of Two Supporting Bricks',
              mathBefore: 'Row 1 = [12,  b,  8]',
              mathAfter: 'Row 2 = [12 + b,  b + 8]',
              explanation:
                'Naming the unknown middle brick b lets us write the second row immediately as (12 + b) on the left and (b + 8) on the right.',
              funTip: 'Never guess-and-check when a single letter b lets you climb straight to the top!',
              checkQuestion: {
                prompt: 'When we add the two Row-2 bricks (12 + b) and (b + 8) to get the top brick 60, what equation do we get?',
                options: [
                  '20 + 2b = 60',
                  '20 + b = 60',
                  '12 + b + 8 = 60',
                  '96b = 60',
                ],
                correctIndex: 0,
                hint: '(12 + b) + (b + 8) = 20 + 2b = 60.',
              },
              graphHighlight: {
                x: 20,
                y: 60,
                label: 'b = 20 gives Top = 60',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 2,
              title: 'Solve a + 2b + c = 60 for b',
              ruleUsed: '3-Row Pyramid Identity: Top = a + 2b + c',
              mathBefore: '12 + 2b + 8 = 60  ⇒  20 + 2b = 60',
              mathAfter: '2b = 40  ⇒  b = 20',
              explanation:
                'Subtracting 20 from 60 gives 2b = 40, so the middle base brick is b = 20.',
              funTip: 'Notice how if you forgot the 2 in 2b, you would have guessed b = 40 and gotten 92 at the top!',
              graphHighlight: {
                x: 0,
                y: 20,
                label: 'If b = 0, Top = 12 + 8 = 20',
                kind: 'intercept',
              },
            },
            {
              stepNumber: 3,
              title: 'Fill In and Verify the Complete Pyramid',
              ruleUsed: 'Substitute b = 20',
              mathBefore: 'Row 2 = [12 + 20,  20 + 8] = [32,  28]',
              mathAfter: 'Top = 32 + 28 = 60  ✓',
              explanation:
                'With b = 20, Row 2 is [32, 28], and 32 + 28 = 60 matches the top brick!',
              funTip: 'In a 4-row pyramid with base [a, b, c, d], the weights are 1, 3, 3, 1: Top = a + 3b + 3c + d!',
              graphHighlight: {
                x: 10,
                y: 40,
                label: 'If b = 10, Top = 40',
                kind: 'vertex',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '20 + 2 * x',
            primaryLabel: 'Pyramid Top Brick T(b) = 12 + 2b + 8 = 20 + 2b',
            secondaryExpression: '60',
            secondaryLabel: 'Target Top Value = 60',
            xDomain: [0, 30],
            yDomain: [0, 85],
            parameters: [],
            keyPoints: [
              { x: 0, y: 20, label: 'b = 0 → Top = 20', kind: 'intercept' },
              { x: 20, y: 60, label: 'Solution: b = 20 → Top = 60', kind: 'intersection' },
            ],
          },
          practiceTwin: {
            question:
              'In a 4-row number pyramid with bottom row (2, x, x, 5), the top brick is 43. Using Top = a + 3b + 3c + d, find x!',
            equation: '2 + 3x + 3x + 5 = 43  ⇒  6x + 7 = 43',
            options: ['x = 6', 'x = 7', 'x = 5', 'x = 8'],
            correctIndex: 0,
            explanation:
              '2 + 3x + 3x + 5 = 6x + 7 = 43 ⇒ 6x = 36 ⇒ x = 6!',
            funRewardMessage: 'Pyramid Architect! +20 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p2c6-3',
        segmentCode: 'Segment 6.3',
        title: 'Calendar 2×2 Magic (4a + 16), Largest Product (qp × r) & Karim and the Genie',
        subtitle:
          'Decoding any 2×2 calendar square sum, proving why qp × r beats pr × q, and solving Karim’s 3-round Banyan Tree Genie puzzle (8x - 56 = 0).',
        commonStruggle:
          'Trying to work backwards through Karim’s 3 doubling-and-paying rounds by guessing instead of setting up 2(2(2x - 8) - 8) - 8 = 0.',
        coreConcepts: [
          'Calendar 2×2 Square: If top-left date is a, the four dates are a, a+1, a+7, a+8 → Sum = 4a + 16, and diagonal sums (a + a + 8) = (a+1 + a+7) = 2a + 8 are always equal!',
          'Reversed 2-Digit Subtraction: For b > a, ba - ab = (10b + a) - (10a + b) = 9(b - a), which is always a multiple of 9!',
          'Largest 2-Digit × 1-Digit Product from digits p < q < r: Compare qp × r vs rp × q → Difference is 10p(r - q) > 0, so putting the largest digit r as the 1-digit multiplier qp × r ALWAYS wins!',
          'Karim and the Genie: Each round doubles Karim’s coins and subtracts 8 coins → after 3 rounds, 8x - 56 = 0 ⇒ x = 7 coins!',
        ],
        keyFormulas: [
          { label: 'Calendar 2×2 Sum', formula: 'a + (a+1) + (a+7) + (a+8) = 4a + 16' },
          { label: 'Karim & the Genie (3 Rounds)', formula: '2(2(2x - 8) - 8) - 8 = 8x - 56 = 0  ⇒  x = 7' },
        ],
        featuredSolution: {
          id: 'p2c6-karim-genie',
          title: 'Karim and the Banyan Tree Genie & Calendar 2×2 Grid Decoder',
          topic: 'Algebra Play · Segment 6.3',
          difficulty: 'Ganita Prakash · Part II Ch 6 Story Puzzle',
          estimatedMinutes: 5,
          originalProblem:
            'From Ganita Prakash Part II Ch 6: A genie under a banyan tree tells Karim: "Every time you walk around the tree, the coins in your pouch will double, and after each round you must give me 8 coins." After 3 rounds, Karim gives the genie 8 coins and finds his pouch completely empty (0 coins left). How many coins x did Karim start with?',
          finalAnswer: 'x = 7 coins (Round 1: 7×2 - 8 = 6; Round 2: 6×2 - 8 = 4; Round 3: 4×2 - 8 = 0!)',
          funAnalogy: {
            title: 'The Genie’s Compound Fee Trap',
            story:
              'Starting with 7 coins feels like free money when the genie doubles it to 14—until he takes 8 coins, leaving you with 6! Next round 6 doubles to 12 and drops to 4; third round 4 doubles to 8 and drops to 0. Algebra exposes the genie’s formula: 8x - 56 = 0!',
            punchline:
              'Track x round by round: x → 2x - 8 → 4x - 24 → 8x - 56 = 0 ⇒ x = 7!',
            realWorldVariableMap: [
              { symbol: 'x', meaning: 'Initial number of coins in Karim’s pouch' },
              { symbol: '8x - 56', meaning: 'Coins remaining after 3 doubling-and-paying rounds' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Write the Algebraic Expression After Round 1 and Round 2',
              ruleUsed: 'Each Round: Coins_new = 2 × Coins_old - 8',
              mathBefore: 'R₁ = 2x - 8,   R₂ = 2(2x - 8) - 8',
              mathAfter: 'R₂ = 4x - 16 - 8 = 4x - 24',
              explanation:
                'After Round 1, Karim has 2x - 8 coins. In Round 2, that whole amount doubles to 2(2x - 8) = 4x - 16, and paying 8 coins leaves 4x - 24.',
              funTip: 'Always put brackets around (2x - 8) when doubling it for the next round!',
              checkQuestion: {
                prompt: 'In Round 3, Karim’s (4x - 24) coins double and then he pays 8 coins. What expression represents his coins after Round 3?',
                options: [
                  '2(4x - 24) - 8 = 8x - 56',
                  '2(4x - 24) - 8 = 8x - 32',
                  '4x - 24 - 8 = 4x - 32',
                  '8x - 24',
                ],
                correctIndex: 0,
                hint: '2 × 4x = 8x, and 2 × (-24) - 8 = -48 - 8 = -56.',
              },
              graphHighlight: {
                x: 7,
                y: 0,
                label: 'x = 7 coins → Ends with 0 coins!',
                kind: 'root',
              },
            },
            {
              stepNumber: 2,
              title: 'Set Round 3 Equal to 0 and Solve for x',
              ruleUsed: 'Linear Equation Solution',
              mathBefore: 'R₃ = 2(4x - 24) - 8 = 8x - 56 = 0',
              mathAfter: '8x = 56  ⇒  x = 7 coins',
              explanation:
                'Since Karim’s pouch is empty after Round 3, 8x - 56 = 0, so x = 56 ÷ 8 = 7 coins.',
              funTip: 'Notice that 56 = 8 × (1 + 2 + 4) = 8 × 7!',
              graphHighlight: {
                x: 8,
                y: 8,
                label: 'Start with 8 coins → Stays at 8 forever!',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 3,
              title: 'Trace the 3 Rounds with x = 7 to Verify',
              ruleUsed: 'Step-by-Step Numerical Check',
              mathBefore: '7 →(×2 - 8)→ 6 →(×2 - 8)→ 4 →(×2 - 8)→ 0',
              mathAfter: 'Verified! (7 → 6 → 4 → 0)',
              explanation:
                'Round 1: 7×2 - 8 = 6; Round 2: 6×2 - 8 = 4; Round 3: 4×2 - 8 = 0.',
              funTip: 'What if Karim started with 8 coins? 8×2 - 8 = 8 forever! What if he started with 9 coins? He gets richer every round (8x - 56 = 16)!',
              graphHighlight: {
                x: 6,
                y: -8,
                label: 'Start with 6 coins → Owes 8 coins!',
                kind: 'intercept',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '8 * x - 56',
            primaryLabel: 'Coins Left After 3 Rounds: R₃(x) = 8x - 56',
            secondaryExpression: 'x',
            secondaryLabel: 'Starting Coins Line y = x (Crosses at x = 8!)',
            xDomain: [5, 10],
            yDomain: [-16, 25],
            parameters: [],
            keyPoints: [
              { x: 7, y: 0, label: 'x = 7 → 0 coins left', kind: 'root' },
              { x: 8, y: 8, label: 'x = 8 → Fixed point (8 coins left)', kind: 'intersection' },
            ],
          },
          practiceTwin: {
            question:
              'A friend picks a 2×2 square of 4 dates on a monthly calendar and tells you their sum is 68. Using the formula Sum = 4a + 16, what is the top-left date a?',
            equation: '4a + 16 = 68  ⇒  4a = 52',
            options: [
              'a = 13 (Dates are 13, 14, 20, 21)',
              'a = 15 (Dates are 15, 16, 22, 23)',
              'a = 12 (Dates are 12, 13, 19, 20)',
              'a = 17 (Dates are 17, 18, 24, 25)',
            ],
            correctIndex: 0,
            explanation:
              'Subtract 16 from 68 to get 52, then divide by 4: a = 52 ÷ 4 = 13! Check: 13 + 14 + 20 + 21 = 68.',
            funRewardMessage: 'Genie Outsmarted! +25 pts',
          },
        },
        extraProblems: [],
      },
    ],
  },

  // ===========================================================================
  // PART II · CHAPTER 7: AREA
  // ===========================================================================
  {
    id: 'ch14-area',
    partLabel: 'Part II',
    chapterNumber: 7,
    title: 'Area',
    sanskritOrHistoricalHook: 'Śulba-Sūtra Geometric Dissections, Gopal’s River Reflection Path & Indian Land Units',
    pdfUrl: '/assets/aistudio/7.-AREA_a525f2c3.pdf',
    summary:
      'Cut and slide triangles to prove the area formulas for triangles (½bh), parallelograms (bh), rhombuses (½d₁d₂), and trapeziums (½h(a+b)), solve Gopal’s river reflection shortest path, and triangulate polygons.',
    diagnosticSymptom:
      'I mix up the slant side with the perpendicular altitude h in a parallelogram, or I forget why a trapezium has ½h(a + b).',
    interactiveLabTitle: 'Śulba-Sūtra Shape Dissection & Cut-and-Slide Area Animator',
    segments: [
      {
        id: 'seg-p2c7-1',
        segmentCode: 'Segment 7.1',
        title: 'Area vs Perimeter, Triangle Enclosure (½bh) & Gopal’s River Reflection',
        subtitle:
          'Why every triangle is half of its enclosing rectangle, why a median splits area in half, and Gopal’s equal-area shortest path.',
        commonStruggle:
          'Thinking two triangles with the same area must have the same perimeter (a tilted obtuse triangle has the same ½bh area with a much longer perimeter!).',
        coreConcepts: [
          'Enclosing any acute, right, or obtuse triangle in a rectangle of base b and height h proves Area(Δ) = ½ × b × h.',
          'Any median of a triangle splits the base into two equal halves (b/2) with the exact same altitude h, so a median divides a triangle into two equal areas!',
          'Gopal’s River Puzzle: Moving vertex C along a line parallel to base AB keeps Area(ΔABC) = ½bh constant; by mirror reflection, the shortest perimeter (shortest walk to the river and back) happens when the triangle is isosceles (∠1 = ∠2)!',
        ],
        keyFormulas: [
          { label: 'Triangle Area', formula: 'Area = ½ × base (b) × perpendicular height (h)' },
          { label: 'Median Area Bisection', formula: 'Area(ΔABD) = Area(ΔACD) = ½ · Area(ΔABC)' },
        ],
        featuredSolution: {
          id: 'p2c7-triangle-gopal-river',
          title: 'Proving Triangle Area ½bh, Obtuse Altitude & Gopal’s River Walk',
          topic: 'Area · Segment 7.1',
          difficulty: 'Ganita Prakash · Part II Ch 7 Core',
          estimatedMinutes: 4,
          originalProblem:
            'In the Ganita Prakash parallel-line investigation, base AB = 10 cm lies on line L₁, and vertex C slides along a parallel line L₂ at perpendicular distance h = 6 cm. (1) What is the area of ΔABC for ANY position of C on L₂? (2) If C is shifted far to the right so the foot of the altitude lands 4 cm outside B (at X, with BX = 4 cm), verify that Area(ΔABC) = Area(ΔAXC) - Area(ΔBXC) still equals 30 cm²!',
          finalAnswer: 'Area = ½ × 10 × 6 = 30 cm² everywhere! For the obtuse triangle: ½(14)(6) - ½(4)(6) = 42 - 12 = 30 cm²!',
          funAnalogy: {
            title: 'Slicing a Deck of Cards Sideways (Cavalieri’s Principle)',
            story:
              'Imagine a triangular stack of playing cards 10 cm wide at the bottom and 6 cm tall. If you push the top card sideways so the stack leans over, you haven’t added or removed a single card—so the area stays 30 cm² even though the side edges stretch longer!',
            punchline:
              'Sliding the apex parallel to the base changes the perimeter, but NEVER changes the ½bh area!',
            realWorldVariableMap: [
              { symbol: 'b = 10 cm, h = 6 cm', meaning: 'Fixed base AB and perpendicular parallel-line height' },
              { symbol: 'AX = 10 + 4 = 14 cm', meaning: 'Extended base to the external altitude foot X' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Compute the Constant Area Using ½ × Base × Height',
              ruleUsed: 'Triangle Area Formula: A = ½bh',
              mathBefore: 'Area(ΔABC) = ½ × 10 cm × 6 cm',
              mathAfter: 'Area(ΔABC) = 30 cm²',
              explanation:
                'Because L₂ is parallel to L₁, the perpendicular height h = 6 cm never changes as C slides along L₂.',
              funTip: 'In Gopal’s river problem, the shortest perimeter (AC + CB) occurs when C is centered at x = 5 cm (isosceles)!',
              checkQuestion: {
                prompt: 'When C leans 4 cm past B so AX = 10 + 4 = 14 cm, what is the area of the big right triangle ΔAXC?',
                options: ['42 cm² (½ × 14 × 6)', '30 cm²', '48 cm²', '24 cm²'],
                correctIndex: 0,
                hint: '½ × base AX (14) × height CX (6) = 7 × 6 = 42 cm².',
              },
              graphHighlight: {
                x: 5,
                y: 30,
                label: 'Centered Isosceles (x=5): Area = 30 cm², Min Perimeter!',
                kind: 'vertex',
              },
            },
            {
              stepNumber: 2,
              title: 'Prove the Obtuse Triangle Case by Subtracting Right Triangles',
              ruleUsed: 'Area(ΔABC) = Area(ΔAXC) - Area(ΔBXC)',
              mathBefore: 'Area(ΔABC) = ½(10 + 4)(6) - ½(4)(6)',
              mathAfter: '42 cm² - 12 cm² = 30 cm²',
              explanation:
                'For an obtuse triangle where the altitude falls outside the base at X, subtracting the outer right triangle ΔBXC (12 cm²) from ΔAXC (42 cm²) leaves 30 cm².',
              funTip: 'Algebraically: ½(b + d)h - ½dh = ½bh + ½dh - ½dh = ½bh!',
              graphHighlight: {
                x: 14,
                y: 30,
                label: 'Obtuse Apex (x=14): Area still 30 cm²!',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 3,
              title: 'Compare Area (Constant) vs Perimeter (U-Shaped Curve)',
              ruleUsed: 'Mirror Reflection Shortest Path',
              mathBefore: 'P(x) = 10 + √(x² + 6²) + √((10 - x)² + 6²)',
              mathAfter: 'P_min = P(5) = 10 + 2√61 ≈ 25.62 cm',
              explanation:
                'While the area stays flat at 30 cm², the perimeter reaches its minimum at the symmetric midpoint x = 5 cm (where angle of incidence = angle of reflection!).',
              funTip: 'Light rays in a mirror follow this exact same shortest-path law!',
              graphHighlight: {
                x: 5,
                y: 25.62,
                label: 'Gopal’s Shortest Path at Midpoint x = 5',
                kind: 'intercept',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '30',
            primaryLabel: 'Triangle Area A(x) = ½(10)(6) = 30 cm² (Constant!)',
            secondaryExpression: '10 + sqrt(x*x + 36) + sqrt((10-x)*(10-x) + 36)',
            secondaryLabel: 'Triangle Perimeter P(x) (Minimum at Isosceles Midpoint x = 5!)',
            xDomain: [0, 15],
            yDomain: [20, 40],
            parameters: [],
            keyPoints: [
              { x: 5, y: 30, label: 'Constant Area = 30 cm²', kind: 'intersection' },
              { x: 5, y: 25.62, label: 'Min Perimeter = 25.62 cm (at x=5)', kind: 'vertex' },
            ],
          },
          practiceTwin: {
            question:
              'In ΔABC, area is 48 cm². If AD is a median from vertex A to the midpoint D of side BC, what is the area of ΔABD?',
            equation: 'Area(ΔABD) = ½ × Area(ΔABC)',
            options: ['24 cm²', '16 cm²', '32 cm²', '12 cm²'],
            correctIndex: 0,
            explanation:
              'A median bisects the base (BD = DC) while sharing the exact same perpendicular height from A, so it cuts the triangle area into two equal halves of 24 cm²!',
            funRewardMessage: 'Śulba Geometry Scholar! +20 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p2c7-2',
        segmentCode: 'Segment 7.2',
        title: 'Śulba-Sūtra Dissections: Parallelogram (bh), Rhombus (½d₁d₂) & Trapezium',
        subtitle:
          'How cutting and sliding a right triangle turns a parallelogram into a rectangle (bh), a rhombus into ½d₁d₂, and a trapezium into ½h(a + b).',
        commonStruggle:
          'Multiplying the two adjacent sides of a parallelogram to find its area (that only works for a 90° rectangle—you must multiply base × perpendicular height h!).',
        coreConcepts: [
          'Parallelogram Dissection: Drop altitude DX = h; cut right triangle ΔAXD from the left and slide it to the right to form a rectangle of base b and height h → Area = b × h.',
          'Rhombus Dissection: Cut along perpendicular diagonals d₁, d₂ and rearrange the 4 right triangles into a rectangle of length d₁ and width ½d₂ → Area = ½ × d₁ × d₂.',
          'Trapezium Dissection (3 textbook proofs!): Join two identical trapeziums (one flipped upside down) to form a parallelogram of base (a + b) and height h → Area = ½ × h × (a + b).',
        ],
        keyFormulas: [
          { label: 'Parallelogram & Rhombus', formula: 'Parallelogram = b × h,   Rhombus = ½ × d₁ × d₂' },
          { label: 'Trapezium Area', formula: 'Area = ½ × h × (a + b)' },
        ],
        featuredSolution: {
          id: 'p2c7-trapezium-rhombus-dissection',
          title: 'Trapezium & Rhombus Area via Cut-and-Slide Dissection',
          topic: 'Area · Segment 7.2',
          difficulty: 'Ganita Prakash · Part II Ch 7 Core',
          estimatedMinutes: 4,
          originalProblem:
            '(1) A trapezium has parallel sides a = 14 cm and b = 10 cm, and perpendicular distance (height) h = 8 cm between them. Find its area using the doubled-parallelogram dissection. (2) A rhombus has diagonals d₁ = 16 cm and d₂ = 12 cm. Find its area.',
          finalAnswer: '(1) Trapezium Area = ½ × 8 × (14 + 10) = 96 cm²; (2) Rhombus Area = ½ × 16 × 12 = 96 cm²',
          funAnalogy: {
            title: 'The Upside-Down Twin Puzzle Piece',
            story:
              'How do you measure a lopsided trapezium? Clone an identical twin, flip the twin upside down, and snap them together! The short top (10 cm) and long bottom (14 cm) fuse into a parallelogram of base 24 cm and height 8 cm (area 192 cm²)—so one trapezium is half of that: 96 cm²!',
            punchline:
              'Every area formula in Chapter 7 comes from cutting and sliding shapes back into a rectangle!',
            realWorldVariableMap: [
              { symbol: 'a + b = 14 + 10 = 24 cm', meaning: 'Combined base when two identical trapeziums join' },
              { symbol: '½ d₁ d₂ = ½(16)(12)', meaning: 'Rectangle of base d₁ = 16 and half-diagonal height 6' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Join Two Identical Trapeziums into a Parallelogram',
              ruleUsed: 'Doubled Trapezium Base = a + b',
              mathBefore: 'Parallelogram Base = a + b = 14 + 10 = 24 cm,   h = 8 cm',
              mathAfter: 'Parallelogram Area = 24 × 8 = 192 cm²',
              explanation:
                'Placing an upside-down copy of the trapezium next to the original creates a parallelogram with base (14 + 10) = 24 cm and height 8 cm.',
              funTip: 'You can also split the trapezium with a diagonal into two triangles: ½ah + ½bh = ½h(a + b)!',
              checkQuestion: {
                prompt: 'Since two identical trapeziums have a combined area of 192 cm², what is the area of one trapezium?',
                options: ['96 cm²', '192 cm²', '48 cm²', '112 cm²'],
                correctIndex: 0,
                hint: 'Divide 192 cm² by 2: 192 ÷ 2 = 96 cm².',
              },
              graphHighlight: {
                x: 8,
                y: 96,
                label: 'Trapezium Area = 96 cm² (at h = 8)',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 2,
              title: 'Halve the Parallelogram to Get the Trapezium Area',
              ruleUsed: 'Area(Trapezium) = ½ × h × (a + b)',
              mathBefore: 'Area = ½ × 8 × (14 + 10)',
              mathAfter: 'Area = 4 × 24 = 96 cm²',
              explanation:
                'Multiplying half the height (4 cm) by the sum of parallel sides (24 cm) gives 96 cm².',
              funTip: 'Or take the average of the parallel sides (14+10) ÷ 2 = 12 cm and multiply by height 8 cm → 96 cm²!',
              graphHighlight: {
                x: 12,
                y: 96,
                label: 'Rhombus Area = ½(16)(12) = 96 cm²',
                kind: 'vertex',
              },
            },
            {
              stepNumber: 3,
              title: 'Compute the Rhombus Area via ½ × d₁ × d₂',
              ruleUsed: 'Rhombus Area = ½ × Product of Diagonals',
              mathBefore: 'Area(Rhombus) = ½ × 16 cm × 12 cm',
              mathAfter: 'Area(Rhombus) = 96 cm²',
              explanation:
                'A rhombus fits inside a 16 cm × 12 cm bounding box and takes up exactly half of each of the 4 sub-rectangles: ½ × 16 × 12 = 96 cm².',
              funTip: 'Notice how both shapes have area 96 cm² even though they look completely different!',
              graphHighlight: {
                x: 4,
                y: 48,
                label: 'At h = 4, Trapezium Area = 48 cm²',
                kind: 'intercept',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '12 * x',
            primaryLabel: 'Trapezium Area A(h) = ½(14+10)h = 12h',
            secondaryExpression: '8 * x',
            secondaryLabel: 'Rhombus Area A(d₂) = ½(16)d₂ = 8d₂',
            xDomain: [0, 14],
            yDomain: [0, 160],
            parameters: [],
            keyPoints: [
              { x: 8, y: 96, label: 'Trapezium at h=8 → 96 cm²', kind: 'intersection' },
              { x: 12, y: 96, label: 'Rhombus at d₂=12 → 96 cm²', kind: 'vertex' },
            ],
          },
          practiceTwin: {
            question:
              'A parallelogram has base b = 15 cm, slant side s = 10 cm, and perpendicular altitude h = 6 cm. What is its area?',
            equation: 'Area = base × perpendicular height (NOT slant side!)',
            options: ['90 cm²', '150 cm²', '60 cm²', '75 cm²'],
            correctIndex: 0,
            explanation:
              'Area of a parallelogram is base × perpendicular altitude = 15 × 6 = 90 cm² (the 10 cm slant side is a distractor for perimeter!).',
            funRewardMessage: 'Dissection Master! +20 pts',
          },
        },
        extraProblems: [],
      },
      {
        id: 'seg-p2c7-3',
        segmentCode: 'Segment 7.3',
        title: 'Polygon Triangulation & Real-World Area Conversions',
        subtitle:
          'Finding the area of any quadrilateral or pentagon by slicing it into triangles, and converting cm², m², acres, hectares, and bigha/gaj/cent.',
        commonStruggle:
          'Dividing by 100 instead of 10,000 when converting cm² to m² (1 m = 100 cm, so 1 m² = 100 × 100 = 10,000 cm²!).',
        coreConcepts: [
          'Any polygon can be triangulated by drawing non-intersecting diagonals from one vertex, reducing any land-survey area problem to summing ½bh of triangles!',
          'General Quadrilateral with diagonal d and perpendicular offsets h₁, h₂ from opposite vertices: Area = ½·d·h₁ + ½·d·h₂ = ½ · d · (h₁ + h₂).',
          'Square unit conversions square the linear scale factor: 1 m² = 100² cm² = 10,000 cm²; 1 in² = 2.54² cm² = 6.4516 cm²; 1 hectare = 10,000 m²; 1 acre = 43,560 ft² ≈ 4,046.86 m².',
        ],
        keyFormulas: [
          { label: 'Diagonal-Offset Formula', formula: 'Area(Quad) = ½ × d × (h₁ + h₂)' },
          { label: 'Square Unit Scaling', formula: '1 m² = 10,000 cm²,   1 in² = 6.4516 cm²,   1 acre = 43,560 ft²' },
        ],
        featuredSolution: {
          id: 'p2c7-polygon-triangulation',
          title: 'Triangulating a Field Quadrilateral & Square-Unit Conversions',
          topic: 'Area · Segment 7.3',
          difficulty: 'Ganita Prakash · Part II Ch 7 Application',
          estimatedMinutes: 4,
          originalProblem:
            'A surveyor measures a four-sided agricultural plot ABCD. The diagonal AC is d = 40 m long, and the perpendicular offsets from vertices B and D to diagonal AC are h₁ = 15 m and h₂ = 25 m. (1) Find the total area of the plot ABCD in m². (2) Express this area in cm² and as a fraction of 1 hectare (10,000 m²).',
          finalAnswer: '(1) Area = ½ × 40 × (15 + 25) = 800 m²; (2) 8,000,000 cm² = 0.08 hectares',
          funAnalogy: {
            title: 'The Surveyor’s Central Baseline Rope',
            story:
              'Irregular farm fields don’t come with neat 90° corners! So Indian land surveyors stretch one long rope across the diagonal AC (40 m) and measure two perpendicular bamboo poles to corners B (15 m) and D (25 m)—turning a crooked 4-sided field into two simple triangles sharing the same base!',
            punchline:
              'Factor out ½d from the two triangles: ½·d·h₁ + ½·d·h₂ = ½ · d · (h₁ + h₂)!',
            realWorldVariableMap: [
              { symbol: 'd = 40 m', meaning: 'Shared diagonal AC of triangles ABC and ADC' },
              { symbol: 'h₁ + h₂ = 15 + 25 = 40 m', meaning: 'Sum of perpendicular offsets from B and D to AC' },
            ],
          },
          steps: [
            {
              stepNumber: 1,
              title: 'Split Quadrilateral ABCD Along Diagonal AC into Two Triangles',
              ruleUsed: 'Area(ABCD) = Area(ΔABC) + Area(ΔADC)',
              mathBefore: 'Area = (½ × 40 × 15) + (½ × 40 × 25)',
              mathAfter: 'Area = ½ × 40 × (15 + 25)',
              explanation:
                'By the distributive property (Chapter 6!), we factor out ½ × 40 and add the two perpendicular heights 15 + 25 = 40 m.',
              funTip: 'Notice how Algebra (Distributivity) and Geometry (Triangulation) team up here!',
              checkQuestion: {
                prompt: 'What is ½ × 40 m × (15 m + 25 m)?',
                options: ['800 m²', '1,600 m²', '400 m²', '600 m²'],
                correctIndex: 0,
                hint: '½ × 40 = 20, and 15 + 25 = 40, so 20 × 40 = 800 m².',
              },
              graphHighlight: {
                x: 40,
                y: 800,
                label: 'h₁ + h₂ = 40 m → Area = 800 m²',
                kind: 'intersection',
              },
            },
            {
              stepNumber: 2,
              title: 'Convert 800 m² to cm² by Squaring the 100× Scale Factor',
              ruleUsed: '1 m = 100 cm  ⇒  1 m² = 100² cm² = 10,000 cm²',
              mathBefore: '800 m² = 800 × 10,000 cm²',
              mathAfter: '8,000,000 cm²  (8 × 10⁶ cm²)',
              explanation:
                'Because area has two dimensions (length × width), converting meters to centimeters multiplies by 100 × 100 = 10,000.',
              funTip: 'Never multiply m² by just 100—always square the linear conversion factor!',
              graphHighlight: {
                x: 20,
                y: 400,
                label: 'h₁ + h₂ = 20 m → Area = 400 m²',
                kind: 'intercept',
              },
            },
            {
              stepNumber: 3,
              title: 'Convert 800 m² to Hectares (1 Hectare = 100 m × 100 m = 10,000 m²)',
              ruleUsed: 'Hectares = Area(m²) ÷ 10,000',
              mathBefore: 'Hectares = 800 ÷ 10,000',
              mathAfter: '0.08 hectares',
              explanation:
                'A hectare is the area of a 100 m × 100 m square (10,000 m²), so 800 m² is 800 ÷ 10,000 = 0.08 hectares.',
              funTip: 'In India, land is also measured in Regional Units like Bigha, Katha, Gaj (1 sq yd), and Cent (1/100 of an acre)!',
              graphHighlight: {
                x: 50,
                y: 1000,
                label: 'h₁ + h₂ = 50 m → Area = 1,000 m² (0.1 ha)',
                kind: 'vertex',
              },
            },
          ],
          graphConfig: {
            primaryExpression: '20 * x',
            primaryLabel: 'Quadrilateral Area A(x) = ½(40)x = 20x (where x = h₁ + h₂)',
            xDomain: [0, 60],
            yDomain: [0, 1250],
            parameters: [],
            keyPoints: [
              { x: 15, y: 300, label: 'ΔABC Area (h₁=15) = 300 m²', kind: 'intercept' },
              { x: 40, y: 800, label: 'Total Quad Area (15+25=40) = 800 m²', kind: 'intersection' },
            ],
          },
          practiceTwin: {
            question:
              'Since 1 inch = 2.54 cm, how many square centimeters (cm²) are in 1 square inch (1 in²)?',
            equation: '1 in² = (2.54 cm) × (2.54 cm)',
            options: [
              '6.4516 cm²',
              '2.54 cm²',
              '5.08 cm²',
              '10.16 cm²',
            ],
            correctIndex: 0,
            explanation:
              '1 in² is a square of side 2.54 cm, so its area is 2.54 × 2.54 = 6.4516 cm²!',
            funRewardMessage: 'Master Land Surveyor! +25 pts',
          },
        },
        extraProblems: [],
      },
    ],
  },
];
