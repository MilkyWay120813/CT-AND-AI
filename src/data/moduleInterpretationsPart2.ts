import type { ModuleFunInterpretation } from './moduleInterpretationsPart1';

export const PART2_MODULE_INTERPRETATIONS: Record<string, ModuleFunInterpretation> = {
  // PART II · CHAPTER 1: Fractions in Disguise (p2-mod-1-1 to p2-mod-1-8)
  'p2-mod-1-1': {
    headline: 'One Value, Three Disguises: Fraction = Decimal = %',
    analogyStory:
      'Think of 3/4, 0.75, and 75% like the same superhero wearing three different outfits: a classic fraction suit, a decimal cape, and a per-cent (“per hundred”) jersey! Converting between them simply places everyone onto a universal 100-square grid.',
    intuitiveSecret:
      '“Percent” literally means divided by 100—so multiplying any fraction or decimal by 100 reveals its exact percentage.',
    partyTrickOrProTip:
      'Keep key triplets on speed-dial: 1/2 = 50%, 1/4 = 25%, 1/5 = 20%, 1/8 = 12.5%, 1/3 ≈ 33.33%!',
    funEmoji: '🎭',
    quoteTag: 'Fractions, decimals, and percentages are three languages telling the exact same amount.',
  },
  'p2-mod-1-2': {
    headline: 'The 10% + 5% + 1% Mental Calculator',
    analogyStory:
      'Never reach for a calculator to find 15% of ₹640! Find 10% instantly by shifting one decimal place (₹64), take half of that for 5% (₹32), and add them together: ₹64 + ₹32 = ₹96!',
    intuitiveSecret:
      'Any percentage can be snapped together like Lego bricks from 50% (÷2), 25% (÷4), 10% (÷10), and 1% (÷100).',
    partyTrickOrProTip:
      'Percentages are commutative! Stuck on 18% of 50? Flip it to 50% of 18 = 9 in half a second!',
    funEmoji: '⚡',
    quoteTag: 'Break any tricky percentage into 10%, 5%, and 1% Lego pieces.',
  },
  'p2-mod-1-3': {
    headline: 'Breaking Past 100%: Double, Triple & Beyond',
    analogyStory:
      'Wait—can a percentage exceed 100%? If you eat 1 whole pizza, that’s 100%; if a friend eats 1½ pizzas, that’s 150%! Percentages greater than 100% compare a new amount that outgrew the original whole.',
    intuitiveSecret:
      '100% = 1× original, 200% = 2× original, 250% = 2.5× original—and percentages below 1% (like 0.5%) represent tiny fractions like 1/200.',
    partyTrickOrProTip:
      'Notice the vital difference: “increased TO 200%” means 2× the original, whereas “increased BY 200%” means original + 2× original = 3× original!',
    funEmoji: '📈',
    quoteTag: '100% is the starting baseline, never the ceiling.',
  },
  'p2-mod-1-4': {
    headline: 'Fair Scoreboards: Know Your Comparison Base',
    analogyStory:
      'Who scored better: 18/20 in Math or 34/40 in Science? Comparing raw numerators misleads you! Scaling both denominators onto a shared 100-square stadium shows 90% vs. 85% immediately.',
    intuitiveSecret:
      'Percentages level the playing field only when you clearly ask: “100% of WHAT base quantity?”',
    partyTrickOrProTip:
      'When two ratios look close (like 7/12 vs 11/18), convert both to percentages or cross-multiply to see the true winner.',
    funEmoji: '🏟️',
    quoteTag: 'Percent puts every test, budget, and survey onto one shared 100-point scoreboard.',
  },
  'p2-mod-1-5': {
    headline: 'The Price Rollercoaster: Why +50% then −50% Loses Money!',
    analogyStory:
      'Raise a ₹100 jacket by +50% and it hits ₹150. Now apply a 50% discount! Watch out—the 50% cut slices half of ₹150 (₹75 off!), landing at ₹75—a net 25% LOSS instead of returning to ₹100!',
    intuitiveSecret:
      'Successive percentage changes multiply (1.5 × 0.5 = 0.75), NEVER cancel by addition, because the second percentage runs on the NEW base.',
    partyTrickOrProTip:
      'Always use multipliers: +p% multiplies by (1 + p/100); −d% multiplies by (1 − d/100)!',
    funEmoji: '🎢',
    quoteTag: 'An equal percent up and down never lands back where you started—the bigger base bites harder.',
  },
  'p2-mod-1-6': {
    headline: 'Market Tag Traps: Cost Price vs. Marked Price',
    analogyStory:
      'Inside a shop, three prices dance together: Cost Price (what the store paid), Marked Price (printed on the hangtag), and Selling Price (what you pay at checkout). Profit/loss comes ONLY from Cost Price; discounts slice ONLY from Marked Price!',
    intuitiveSecret:
      'Never compute discount on Cost Price or profit on Marked Price—always anchor each percentage to its rightful owner.',
    partyTrickOrProTip:
      'Two quick discounts of 20% and 10% do NOT equal 30% off: 0.8 × 0.9 = 0.72 → 28% net discount!',
    funEmoji: '🏷️',
    quoteTag: 'Profit belongs to Cost Price; discount belongs to Marked Price.',
  },
  'p2-mod-1-7': {
    headline: 'Snowball Compounding, GST & Depreciation',
    analogyStory:
      'Simple interest hands you the same flat bonus every year, like walking upstairs. Compound interest folds each year’s interest INTO the snowball, so next year’s interest earns interest on earlier interest—growing exponentially!',
    intuitiveSecret:
      'Compound amount multiplies every year by (1 + r/100)ⁿ; GST adds tax on the discounted price; depreciation multiplies by (1 − r/100)ⁿ.',
    partyTrickOrProTip:
      'The Rule of 72: divide 72 by an annual interest rate (say 8%) to estimate how many years it takes money to double (72 ÷ 8 ≈ 9 years)!',
    funEmoji: '❄️',
    quoteTag: 'Compounding turns small annual percentages into an accelerating snowball.',
  },
  'p2-mod-1-8': {
    headline: 'Mastering Percentages Without Hidden Traps',
    analogyStory:
      'Whether decoding bank compounding, store tags, GST bills, or backward “reverse percentage” puzzles (finding the price BEFORE a 20% hike by dividing by 1.2), multipliers keep every step crisp.',
    intuitiveSecret:
      'To reverse a +20% increase, divide by 1.20—NEVER subtract 20% from the inflated total!',
    partyTrickOrProTip:
      'Translate every word problem into: New = Old × Multiplier. Solve forward by multiplying; solve backward by dividing.',
    funEmoji: '🧭',
    quoteTag: 'One multiplier line handles markup, discount, tax, and compounding alike.',
  },

  // PART II · CHAPTER 2: The Baudhāyana-Pythagoras Theorem (p2-mod-2-1 to p2-mod-2-8)
  'p2-mod-2-1': {
    headline: 'Doubling & Halving a Square Altar',
    analogyStory:
      'In ancient Indian Śulbasūtras (~800 BCE), builders wanted a square altar with EXACTLY twice the area of a given square. Folding a square’s 4 corners inward to its center makes a diamond half its area—showing its DIAGONAL builds a square of double the area!',
    intuitiveSecret:
      'Baudhāyana’s Rope Verse (dvikaraṇī): the square constructed on the diagonal of a square has exactly twice the area of the original square.',
    partyTrickOrProTip:
      'Watch the 4 right-triangle origami fold: the inner rotated square holds half the outer square’s area cleanly without measuring a single decimal!',
    funEmoji: '🪢',
    quoteTag: 'To double a square without distorting its shape, build on its diagonal.',
  },
  'p2-mod-2-2': {
    headline: 'Measuring the Unmeasurable: Meet √2',
    analogyStory:
      'Take a unit 1×1 square. Its diagonal square has area 2, so the diagonal length itself must be √2! No exact terminating fraction can equal √2—it lives quietly between 1.414 and 1.415 forever.',
    intuitiveSecret:
      'Any square of side s has exact diagonal d = s√2—even when no whole-number ruler can tick off its end.',
    partyTrickOrProTip:
      'Check √2 ≈ 1.414 fast: 1.414² = 1.999396, only 0.0006 shy of 2!',
    funEmoji: '📏',
    quoteTag: 'A 1-meter square hides an endless irrational diagonal right across its middle.',
  },
  'p2-mod-2-3': {
    headline: 'Zooming Forever: Decimal Bounds on √2',
    analogyStory:
      'Squeeze √2 like a detective narrowing a hiding spot: 1²=1 < 2 < 2²=4 (between 1 and 2); 1.4²=1.96 < 2 < 1.5²=2.25 (between 1.4 and 1.5); 1.41²=1.9881 < 2 < 1.42²=2.0164! Each decimal digit narrows the trap ten times tighter.',
    intuitiveSecret:
      'Why can’t √2 ever be a fraction p/q? Squaring doubles every prime’s exponent—so p² = 2q² creates an impossible odd count of prime factor 2!',
    partyTrickOrProTip:
      'Compare odd vs even factors of 2: the parity contradiction proves √2 is irrational in just three lines.',
    funEmoji: '🔎',
    quoteTag: 'An odd count of prime 2s guarantees √2 never ends in any fraction.',
  },
  'p2-mod-2-4': {
    headline: 'Merging Two Different Squares Into One',
    analogyStory:
      'Suppose you need one single square rug whose area equals a 3×3 rug PLUS a 4×4 rug (9 + 16 = 25). Baudhāyana discovered you simply place the two squares corner-to-corner at 90° and span the diagonal—it measures √25 = 5!',
    intuitiveSecret:
      'Four identical right triangles placed inside a (a + b) × (a + b) frame rearrange visually to prove c² = a² + b² without a single word.',
    partyTrickOrProTip:
      'Want the DIFFERENCE of two squares (c² − a²)? Simply use the larger square as the hypotenuse and fold the smaller leg beside it!',
    funEmoji: '🔲',
    quoteTag: 'Sliding four triangles inside one box lets two squares fuse cleanly into one.',
  },
  'p2-mod-2-5': {
    headline: 'The Heart of Right Triangles: a² + b² = c²',
    analogyStory:
      'In ANY right-angled triangle, the longest side opposite the 90° corner (the hypotenuse c) carries a square equal to the combined areas of both perpendicular leg squares (a² + b²).',
    intuitiveSecret:
      'If a² + b² = c² holds, the triangle is guaranteed 90°; if a² + b² > c² it’s acute; if a² + b² < c² it’s obtuse!',
    partyTrickOrProTip:
      'Before solving for a missing side, circle the 90° box first and draw an arrow across to label the hypotenuse c so you never add when you should subtract.',
    funEmoji: '📐',
    quoteTag: 'Always point across from the right angle first—that side alone is c.',
  },
  'p2-mod-2-6': {
    headline: 'Baudhāyana Triples & Scaling Families',
    analogyStory:
      'Some magical integer trios click cleanly into a² + b² = c² with zero messy decimals: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25). Scale ANY triple by 2, 3, or 10 and you earn infinite new right triangles!',
    intuitiveSecret:
      'Scaling every side of a right triangle by k scales its area by k² while preserving the 90° angle and exact Pythagorean balance.',
    partyTrickOrProTip:
      'Spot (6, 8, ?) or (15, 20, ?) on a test? Divide by the HCF first to recognize the friendly (3, 4, 5) cousin and answer in one second!',
    funEmoji: '🔺',
    quoteTag: 'Memorize four primitive triples and hundreds of test triangles solve themselves.',
  },
  'p2-mod-2-7': {
    headline: 'Bhāskara’s Swaying Lotus & Why Cubes Fail (Fermat)',
    analogyStory:
      'Bhāskarāchārya imagined a lotus blooming 3 units above calm water until the wind blew it sideways to touch the surface 9 units away! That bowed stem forms a right triangle whose hypotenuse is (depth + 3). Meanwhile, no whole cubes can ever satisfy a³ + b³ = c³ (Fermat’s Last Theorem)!',
    intuitiveSecret:
      'In swaying-reed puzzles, the underwater stem equals x and the tilted reed equals x + height-above-water, setting up x² + d² = (x + h)².',
    partyTrickOrProTip:
      'Watch x² cancel cleanly on both sides of x² + 9² = (x + 3)², leaving a super-simple linear equation for lake depth!',
    funEmoji: '🪷',
    quoteTag: 'Squares unite infinitely into right triangles; higher powers stand alone forever.',
  },
  'p2-mod-2-8': {
    headline: 'Right-Angle Geometry & Distance Synthesis',
    analogyStory:
      'Ladders on walls, rhombus sides from diagonals, cuboid space diagonals, and Bhāskara’s lotus all reduce to hunting down hidden right triangles inside larger shapes.',
    intuitiveSecret:
      'Whenever perpendicular lines cross—altitudes, corners, or diagonals—a² + b² = c² unlocks the missing length.',
    partyTrickOrProTip:
      'Find a box’s 3D space diagonal in one sweep: D = √(l² + w² + h²)!',
    funEmoji: '🧭',
    quoteTag: 'Draw one right-angle drop-line and 2D or 3D space opens up.',
  },

  // PART II · CHAPTER 3: Proportional Reasoning-2 (p2-mod-3-1 to p2-mod-3-8)  <-- COMPLETELY FIXED (NO EXPONENTS!)
  'p2-mod-3-1': {
    headline: 'Two Ways Quantities Travel: Direct & Equal Ratios',
    analogyStory:
      'Imagine doubling a spice mix or tripling a blueprint: every ingredient scales at the exact same heartbeat so nothing overpowers the flavor. Part II takes proportionality from simple pairs out into maps, pies, and multi-partner ratios.',
    intuitiveSecret:
      'Quantities are proportional when their simplified ratio a : b stays invariant across every scaled state.',
    partyTrickOrProTip:
      'Check if a table is proportional by dividing y ÷ x down each column—every row must give the exact same constant k!',
    funEmoji: '⚖️',
    quoteTag: 'Proportionality means every scaled copy keeps the exact same inner balance.',
  },
  'p2-mod-3-2': {
    headline: 'Shrinking Continents onto Paper: Map Representative Fractions',
    analogyStory:
      'How do cartographers squeeze 50 km of winding highway onto a 2 cm strip of textbook paper? They use a Representative Fraction (RF) like 1 : 2,500,000—meaning 1 cm on paper represents 2,500,000 cm (25 km) on Earth!',
    intuitiveSecret:
      'In a map RF scale 1 : N, BOTH sides are measured in the exact same tiny unit (cm or mm) before converting ground distance into km.',
    partyTrickOrProTip:
      'To convert cm to km in one glance, knock off FIVE zeros (since 1 km = 1,000 m × 100 cm = 100,000 cm)!',
    funEmoji: '🗺️',
    quoteTag: 'Representative Fractions pack whole mountains into a pocket ruler using pure ratios.',
  },
  'p2-mod-3-3': {
    headline: 'Linking Three Quantities: Combining A:B and B:C',
    analogyStory:
      'Suppose paint mixes Red : Yellow = 2 : 3, while Yellow : Blue = 4 : 5. You cannot write 2 : 3 : 5 because Yellow wears “3” in the first recipe and “4” in the second! Match Yellow to their LCM (12) so both recipes speak the same language: 8 : 12 : 15.',
    intuitiveSecret:
      'The bridge variable (B) connecting A : B and B : C MUST be scaled to the exact same common multiple before merging into A : B : C.',
    partyTrickOrProTip:
      'Write them in an “N-shape” bridge: multiply left-down, diagonal, and right-down to chain A:B:C in three seconds!',
    funEmoji: '🎨',
    quoteTag: 'Find one shared voice for the bridge term and multi-part ratios snap together.',
  },
  'p2-mod-3-4': {
    headline: 'Splitting Loot Three Ways in Ratio m : n : p',
    analogyStory:
      'When three friends invest ₹200, ₹300, and ₹500 in a lemonade stall (ratio 2 : 3 : 5) and earn ₹3,000 profit, bundle the profit into 2 + 3 + 5 = 10 equal shares of ₹300 each, then hand out 2, 3, and 5 bundles!',
    intuitiveSecret:
      'Whether sharing among 2, 3, or 5 partners, 1 share always equals Total ÷ (sum of all ratio terms).',
    partyTrickOrProTip:
      'Always simplify the ratio by HCF first (200:300:500 → 2:3:5) so your division stays effortless!',
    funEmoji: '🍕',
    quoteTag: 'Sum all parts into one pie, find the size of one slice, then serve fairly.',
  },
  'p2-mod-3-5': {
    headline: '360° Story Circles: Pie Charts as Angle Proportions',
    analogyStory:
      'A pie chart turns dry table rows into a spinning 360° pizza! Every category wins an angle proportional to its share of the whole—so 25% of the class earns a crisp 90° quarter-slice.',
    intuitiveSecret:
      'Every sector obeys: Central Angle = (Part ÷ Total) × 360° = Percentage × 3.6°.',
    partyTrickOrProTip:
      'Notice the magic shortcut: each 1% of data equals 3.6° of angle—so 10% is always 36° and 5% is always 18°!',
    funEmoji: '🥧',
    quoteTag: 'In a circle graph, every 1% claims exactly 3.6° of the 360° horizon.',
  },
  'p2-mod-3-6': {
    headline: 'The Speed-Time Seesaw: Inverse Proportions',
    analogyStory:
      'If you ride twice as fast to school, does your travel time double? No—it gets cut in HALF! In inverse proportion, when one quantity scales up by ×k, its partner shrinks by ÷k so their PRODUCT stays locked.',
    intuitiveSecret:
      'In inverse variation (speed vs time, workers vs days, gear teeth vs RPM), x₁ × y₁ = x₂ × y₂ remains rock-solid constant.',
    partyTrickOrProTip:
      'Wait—before multiplying x₁y₁, double-check: “More workers = fewer days” (inverse ✓), whereas “More workers = more bricks laid” (direct)!',
    funEmoji: '🚴',
    quoteTag: 'Direct keeps the fraction fixed; inverse keeps the product fixed.',
  },
  'p2-mod-3-7': {
    headline: 'Solving Multi-Stage & Compound Ratio Puzzles',
    analogyStory:
      'Real problems often mix ratios with extra twists: a garrison adds soldiers mid-month, a pipe drains while another fills, or a rectangle scales width by 2× and height by 3× (scaling area by 6×!). Break the journey phase by phase.',
    intuitiveSecret:
      'Track total remaining “person-days” or “pump-hours” whenever conditions change halfway through a story.',
    partyTrickOrProTip:
      'When 500 rations last 20 days and 5 days pass first, reset the clock to “15 days left for 500 people” BEFORE adding new guests!',
    funEmoji: '🏕️',
    quoteTag: 'Account for days already spent first, then balance remaining resources.',
  },
  'p2-mod-3-8': {
    headline: 'Proportional Reasoning-2 Mastery Blueprint',
    analogyStory:
      'Maps, multi-term bridges (A:B:C), 360° pie slices, and inverse speed/work balances all share one single engine: discovering what stays constant while numbers scale.',
    intuitiveSecret:
      'Match units for maps → align bridge for A:B:C → scale 360° for pies → multiply pairs for inverse rates.',
    partyTrickOrProTip:
      'Estimate first! If workers drop from 12 to 8, days MUST rise above the original count.',
    funEmoji: '🧭',
    quoteTag: 'Identify the conserved invariant first and every ratio puzzle yields.',
  },

  // PART II · CHAPTER 4: Exploring Some Geometric Themes (p2-mod-4-1 to p2-mod-4-8)
  'p2-mod-4-1': {
    headline: 'Nature’s Copying Machine: Self-Similarity & Śikharas',
    analogyStory:
      'Snap a single frond off a fern leaf or zoom in on an ancient Indian temple’s carved śikhara spire: each miniature tower looks like a tiny clone of the whole tower! Geometry calls this endless nested echo self-similarity.',
    intuitiveSecret:
      'A fractal repeats its blueprint inside itself across shrinking scales—so zooming in keeps revealing familiar structure.',
    partyTrickOrProTip:
      'Look at broccoli Romanesco or lightning bolts outdoors—nature uses fractal branching everywhere to pack huge surface area into tiny spaces!',
    funEmoji: '🌿',
    quoteTag: 'Magnify a piece of a fractal and the whole architecture stares back at you.',
  },
  'p2-mod-4-2': {
    headline: 'The Swiss-Cheese Carpet & Sierpinski Gasket',
    analogyStory:
      'Take a square carpet, divide it into a 3×3 grid, and punch out the center square (leaving 8 shaded squares). Now punch the center out of EACH of those 8 squares (8² = 64!), then each of those (8³ = 512!)—creating infinite holes in finite space!',
    intuitiveSecret:
      'Sierpinski Carpet grows as 8ⁿ shaded squares (area shrinking by (8/9)ⁿ toward zero!), while Sierpinski Gasket grows as 3ⁿ upward triangles.',
    partyTrickOrProTip:
      'At Step 0 there is 1 square; at Step 1 there are 8; at Step 2 there are 64—exponents count fractal generations cleanly!',
    funEmoji: '🧀',
    quoteTag: 'Punch out 1/9 again and again, and solid area dissolves into lacy geometry.',
  },
  'p2-mod-4-3': {
    headline: 'The Koch Snowflake: Infinite Coastline Around Finite Area',
    analogyStory:
      'Start with an equilateral triangle (3 sides). Replace the middle third of EVERY edge with a two-sided tent bump (turning 1 segment into 4 segments of length 1/3). Every step multiplies perimeter by 4/3—growing perimeter toward INFINITY inside a small circle!',
    intuitiveSecret:
      'At Step n, sides = 3 × 4ⁿ and perimeter scales by (4/3)ⁿ → ∞, yet the entire snowflake stays neatly trapped inside its bounding circle!',
    partyTrickOrProTip:
      'That’s the Coastline Paradox: measure a rocky coast with a shorter ruler and the measured coastline keeps growing longer!',
    funEmoji: '❄️',
    quoteTag: 'Finite room can hold an infinitely long crinkled boundary.',
  },
  'p2-mod-4-4': {
    headline: 'The 11 Blueprints of a Cube & Euler’s F + V − E = 2',
    analogyStory:
      'Imagine unfolding a hollow cardboard cube flat onto your desk without tearing any edge apart from the hinge: out of 35 possible 6-square hexominoes, ONLY 11 fold cleanly into a closed 3D cube!',
    intuitiveSecret:
      'Every convex polyhedron—cube, pyramid, prism, or soccer ball—obeys Euler’s invariant: Faces + Vertices − Edges = 2.',
    partyTrickOrProTip:
      'Spot a T-shape or 1-4-1 cross of 6 squares? It folds into a cube. Spot a 2×2 cluster of 4 squares inside the flat net? Impossible—two faces will collide!',
    funEmoji: '📦',
    quoteTag: 'Flatten a 3D solid into a 2D net and F + V − E = 2 still watches over every corner.',
  },
  'p2-mod-4-5': {
    headline: 'The Hungry Ant & The Unfolded Box Trick',
    analogyStory:
      'A hungry ant stands on one corner of a 30×12×12 cm sweet-box eyeing a laddu on the opposite corner. Walking in 3D feels confusing—until you UNFOLD the box’s side walls flat onto the table so the ant walks a dead-straight Euclidean diagonal!',
    intuitiveSecret:
      'On a folded box surface, unfolding adjacent faces turns bent 3D paths into straight hypotenuses computed via a² + b² = c².',
    partyTrickOrProTip:
      'Always test ALL possible pairs of faces to unfold! On a 30×12×12 cuboid, √((12+12)² + 30²) = √(576 + 900) = √1476, whereas unfolding across two other faces can yield √((30+12)² + 12²) or shorter!',
    funEmoji: '🐜',
    quoteTag: 'Unfold the walls flat and the shortest 3D surface trail snaps into a straight line.',
  },
  'p2-mod-4-6': {
    headline: 'Parallel Sun Shadows & Architect Projections',
    analogyStory:
      'Stand a stack of toy blocks in bright sunlight and inspect its Front View, Top View, and Side View! Engineers draw three flat 2D orthographic silhouettes so factory builders can reconstruct any complex 3D machine.',
    intuitiveSecret:
      'Front view sees height × width; Top view maps the 2D footprint; Side view maps height × depth.',
    partyTrickOrProTip:
      'Notice a neat shadow fact: parallel midday sun rays cast shadows proportional to height without stretching circles into wild trapezoids.',
    funEmoji: '🏗️',
    quoteTag: 'Three 2D blueprints capture one 3D sculpture completely.',
  },
  'p2-mod-4-7': {
    headline: 'Reconstructing 3D Cube Towers (Min & Max Puzzle)',
    analogyStory:
      'Given only the Top View footprint and Front/Side height skylines, how many cubes are inside a hidden building? For MAXIMUM cubes, fill every square as tall as allowed; for MINIMUM cubes, place tall columns diagonally to satisfy both skylines at once!',
    intuitiveSecret:
      'Diagonal placement lets a single tall stack cover BOTH a Front skyline peak and a Side skyline peak simultaneously—saving extra cubes.',
    partyTrickOrProTip:
      'Max height at cell (row r, col c) = min(Front[c], Side[r])!',
    funEmoji: '🧊',
    quoteTag: 'Shared peaks along a diagonal build the exact same skyline with fewer blocks.',
  },
  'p2-mod-4-8': {
    headline: 'Fractals, Nets & 3D Views Synthesis',
    analogyStory:
      'From infinite Koch coastlines to unfolding cube nets for ants and decoding architectural skylines, Chapter 4 trains your mind to flip effortlessly back and forth between flat 2D plans and 3D space.',
    intuitiveSecret:
      'Check F + V − E = 2 for polyhedra, unfold adjacent faces for surface paths, and intersect Front×Side views for 3D stacks.',
    partyTrickOrProTip:
      'Mental 3D rotation gets effortless when you anchor one fixed corner and track its two neighbor faces.',
    funEmoji: '🧭',
    quoteTag: 'Master 2D-to-3D folding and geometry unfolds before your eyes.',
  },

  // PART II · CHAPTER 5: Tales by Dots and Lines (p2-mod-5-1 to p2-mod-5-8)
  'p2-mod-5-1': {
    headline: 'The Mean as a Seesaw Balance Point',
    analogyStory:
      'Don’t think of the arithmetic mean as just “add and divide”—picture weights sitting along a wooden ruler! The Mean is the EXACT fulcrum point where the total pull on the left (∑ distances below) balances the total pull on the right (∑ distances above)!',
    intuitiveSecret:
      'At the true Mean μ, signed deviations always cancel cleanly to zero: ∑(xᵢ − μ) = 0.',
    partyTrickOrProTip:
      'Find the missing 6th score fast! If 5 wrestlers average 55 kg, see how far the first 5 sit from 55 (+3, −4, +1, −2, +2 → net −2), so the 6th wrestler MUST sit +2 above 55 = 57 kg!',
    funEmoji: '⚖️',
    quoteTag: 'The mean is where left-side pulls and right-side pulls lock in perfect zero balance.',
  },
  'p2-mod-5-2': {
    headline: 'Mean vs. Median: Why One Billionaire Skews the Room',
    analogyStory:
      'Suppose five friends earn ₹20,000 a month and one billionaire walks into the café! The Mean jumps sky-high into millions—misleading everyone—while the Median (simply sorting everyone in line and picking the middle person) calmly ignores extreme outliers.',
    intuitiveSecret:
      'Always sort data first for Median! Mean feels every extreme outlier like a heavy weight on a lever; Median cares ONLY about rank order.',
    partyTrickOrProTip:
      'For an EVEN count of sorted numbers, take the average of the two middle values!',
    funEmoji: '📊',
    quoteTag: 'Sort first, guard against outliers, and pick the center that tells the honest story.',
  },
  'p2-mod-5-3': {
    headline: 'Shifting & Scaling Data: What Happens to Averages?',
    analogyStory:
      'Give every student in a class +5 bonus marks: both the Mean AND the Median slide right by +5, while the spread stays untouched! Double every student’s mark: both Mean and Median double too!',
    intuitiveSecret:
      'Adding a constant shifts center (+c); multiplying by a factor scales BOTH center and spread (×k).',
    partyTrickOrProTip:
      'Watch out when a single new giant outlier joins a dataset: the Mean moves noticeably toward it, while the Median barely nudges by half a step!',
    funEmoji: '🎚️',
    quoteTag: 'Shift everyone equally and the whole scoreboard glides together.',
  },
  'p2-mod-5-4': {
    headline: 'Weighted Averages, Frequency Tables & IQR Spread',
    analogyStory:
      'If Class A (10 students) averages 90 and Class B (30 students) averages 70, the combined average is NOT 80! Class B is 3× larger, so its weight pulls the combined Mean down to 75.',
    intuitiveSecret:
      'Weighted Mean = (∑ value × frequency) ÷ (∑ frequency), while Interquartile Range (IQR = Q₃ − Q₁) measures the middle 50% spread.',
    partyTrickOrProTip:
      'Never average two averages directly unless both groups have the exact same headcount!',
    funEmoji: '📋',
    quoteTag: 'Larger groups carry heavier voices when averages merge.',
  },
  'p2-mod-5-5': {
    headline: 'Spreadsheet Formulas: Automating Data Tales',
    analogyStory:
      'Instead of summing 500 rainfall measurements by hand, a spreadsheet turns cells into live math calculators: =SUM(B2:B20), =AVERAGE(B2:B20), =MEDIAN(B2:B20). Change one cell and every summary chart updates live!',
    intuitiveSecret:
      'Spreadsheets separate raw data storage from formula logic, letting analysts spot errors and test “what-if” scenarios instantly.',
    partyTrickOrProTip:
      'Remember =AVERAGE(A1:A10) ignores blank cells—so blank vs zero entries change denominators!',
    funEmoji: '📑',
    quoteTag: 'Write the formula once and let the grid do thousands of sums accurately.',
  },
  'p2-mod-5-6': {
    headline: 'Line Graphs vs. Bar Graphs: Choosing the Right Lens',
    analogyStory:
      'Comparing favorite fruits across 5 classes? Use discrete Bar Graphs! Tracking monsoon rainfall or patient fever changing smoothly over time? Connect chronological dots into a Line Graph so slopes reveal speed of change at a glance!',
    intuitiveSecret:
      'Steep upward segments on a line graph signal rapid rise; flat horizontal segments mean zero change; downward slopes show decline.',
    partyTrickOrProTip:
      'Always check the Y-axis start! A chart starting at 90 instead of 0 can make a tiny 2% bump look like a cliff.',
    funEmoji: '📉',
    quoteTag: 'Bars compare categories; connected lines trace stories unfolding over time.',
  },
  'p2-mod-5-7': {
    headline: 'Spotting Misleading Charts & Complex Infographics',
    analogyStory:
      'Ever seen a newspaper infographic draw a “2× bigger” bar as a 2× taller AND 2× wider 3D cube? That exaggerates 2× into 8× visually! Critical data readers inspect scales, units, sample sizes, and axes before believing headlines.',
    intuitiveSecret:
      'True visual comparison scales area/height strictly proportionally to data values—and checks totals alongside percentages.',
    partyTrickOrProTip:
      'Ask two sharp questions on every chart: “Where does the axis start?” and “Out of how many total people?”',
    funEmoji: '🔍',
    quoteTag: 'Honest charts illuminate patterns; distorted scales deceive the eye.',
  },
  'p2-mod-5-8': {
    headline: 'Data Storyteller Capstone',
    analogyStory:
      'Balance points (Mean), middle ranks (Median), group weights, IQR spreads, spreadsheets, and honest line graphs turn noisy tables into crisp decisions.',
    intuitiveSecret:
      'Pair a center measure (Mean or Median) with a spread measure (Range or IQR) to summarize any dataset honestly.',
    partyTrickOrProTip:
      'Always inspect outliers visually before picking Mean over Median!',
    funEmoji: '🧭',
    quoteTag: 'Numbers whisper individually; organized charts tell the whole story.',
  },

  // PART II · CHAPTER 6: Algebra Play (p2-ch6-m1 to p2-ch6-m8)
  'p2-ch6-m1': {
    headline: 'Mind-Reading Math Tricks: Watch x Vanish!',
    analogyStory:
      '“Think of any secret number, double it, add 10, divide by 2, subtract your secret number—you’re holding 5!” Put your friend’s secret inside a mystery box labeled x: (2x + 10)/2 − x simplifies to x + 5 − x = 5, evaporating x completely!',
    intuitiveSecret:
      'Algebra gives you X-ray vision inside number tricks: whenever the final expression drops x, the ending result is guaranteed constant for every number in the universe.',
    partyTrickOrProTip:
      'Invent your own trick in 5 seconds: pick target answer k, tell them (mx + mk)/m − x, and you will hit k every single time!',
    funEmoji: '🎩',
    quoteTag: 'Magicians hide variables; algebra makes the secret trick glass-clear.',
  },
  'p2-ch6-m2': {
    headline: 'Decoding Shubham’s Birthday Machine (100M + D + 165)',
    analogyStory:
      'Ask a friend to take their birth MONTH M, multiply by 5, add 6, multiply by 4, add 9, multiply by 5, and add their birth DAY D! Subtract 165 from their final answer and the hundreds digits reveal Month M while the last two digits reveal Day D!',
    intuitiveSecret:
      'Expand the chain algebraically: 5(4(5M + 6) + 9) + D = 100M + D + 165. Multiplying M by 100 shifts it two columns left so Month and Day never collide!',
    partyTrickOrProTip:
      'Try it live at dinner: August 24 (M=8, D=24) ends at 989; subtract 165 → 824 (Month 8, Day 24)!',
    funEmoji: '🎂',
    quoteTag: 'Place value 100M packs Month and Day cleanly side by side inside one number.',
  },
  'p2-ch6-m3': {
    headline: 'Number Pyramids & Virahāṅka-Binomial Weights',
    analogyStory:
      'Build a 3-row adding pyramid on base blocks [a, b, c]. The middle row holds (a + b) and (b + c), so the apex becomes a + 2b + c! Notice the middle brick b sits in the center and feeds BOTH paths upward, doubling its weight to 2b!',
    intuitiveSecret:
      'Pyramid apex weights match Virahāṅka–Pascal’s Triangle: 3 bricks = [1, 2, 1]; 4 bricks = [1, 3, 3, 1]; 5 bricks = [1, 4, 6, 4, 1].',
    partyTrickOrProTip:
      'Want to make a 3-row pyramid hit target Apex T fast? Just solve a + 2b + c = T without building row 2 at all!',
    funEmoji: '🔺',
    quoteTag: 'Every brick’s influence at the summit counts how many paths climb up from it.',
  },
  'p2-ch6-m4': {
    headline: 'Reverse Pyramids: Solving for Buried Bricks',
    analogyStory:
      'What if a pyramid shows you the top apex 50 and two scattered clues while burying the rest? Calling an unknown base brick x lets every higher brick carry simple expressions in x until the summit turns into a clean linear equation!',
    intuitiveSecret:
      'Assign ONE strategic variable x (usually at a bottom or shared middle brick), cascade upward, and solve for x at the top.',
    partyTrickOrProTip:
      'Watch consecutive integers along the base: [x, x+1, x+2] produces apex 4x + 4—instantly telling you if an apex is even reachable!',
    funEmoji: '🧱',
    quoteTag: 'One well-placed x unlocks an entire buried pyramid from top to bottom.',
  },
  'p2-ch6-m5': {
    headline: 'Karim & The Banyan Tree Genie (8x − 56 = 0)',
    analogyStory:
      'A sly genie tells Karim: “Each time you walk past this banyan tree, I’ll double the coins in your pocket, if you pay me 8 coins each visit.” After 3 visits Karim has 0 coins left! Working backward—or writing 2(2(2x − 8) − 8) − 8 = 0—reveals 8x − 56 = 0 → Karim started with ₹7!',
    intuitiveSecret:
      'Double-and-fee puzzles solve in two elegant ways: expand forward algebraically to 2ⁿx − fee·(2ⁿ − 1), OR walk backward undoing “−fee” as “+fee” and “×2” as “÷2”.',
    partyTrickOrProTip:
      'Notice the symmetry when start = fee − 1: paying 8 coins out of 14 leaves 6... wait: 7 doubled is 14 minus 8 is 6 (no, wait: let’s test 7: 7×2−8=6; 6×2−8=4; 4×2−8=0!). Every visit drops the remainder neatly by 1, 2, 4!',
    funEmoji: '🧞',
    quoteTag: 'Walk backward in reverse order and the genie’s compounding loop unwinds completely.',
  },
  'p2-ch6-m6': {
    headline: 'Calendar Grids & The Magic 9c Cross',
    analogyStory:
      'Pick ANY 3×3 square block of 9 dates on a calendar grid centered at date c. Moving left/right subtracts/adds 1; moving up/down subtracts/adds 7! All the ±1s and ±7s cancel pairwise across the center—meaning the sum of all 9 dates ALWAYS equals 9 × c!',
    intuitiveSecret:
      'In a 2×2 calendar square, diagonal products differ by EXACTLY 7 (since c(c+8) − (c+1)(c+7) = 8c − 8c − 7 = −7)!',
    partyTrickOrProTip:
      'Bet someone they can’t beat your speed: have them circle ANY 3×3 block on a calendar and point to the middle number—multiply it by 9 and announce all 9 dates’ sum instantaneously!',
    funEmoji: '📅',
    quoteTag: 'A 7-column calendar hides symmetric arithmetic magic inside every 3×3 block.',
  },
  'p2-ch6-m7': {
    headline: 'The Balance Beam & Multi-Step Inverse Equations',
    analogyStory:
      'Picture an equation like a golden balance scale: whatever sits on the left pan equals the right pan. Whatever operation you do to one pan (add, subtract, multiply, divide), do identically to the other pan until x stands alone!',
    intuitiveSecret:
      'Undo operations in reverse wrapping order—peel away outer additions/subtractions and outer divisions before opening inner brackets.',
    partyTrickOrProTip:
      'Got fractions like (x/3) + (x/4) = 14? Multiply the ENTIRE equation by the LCM (12) on line 1 to turn it instantly into integer 4x + 3x = 168!',
    funEmoji: '⚖️',
    quoteTag: 'Clear denominators first and keep both pans equally balanced.',
  },
  'p2-ch6-m8': {
    headline: 'Algebra Play Master Codebreaker',
    analogyStory:
      'Mind-reading tricks, birthday machines, binomial pyramids, genie doublings, and calendar squares all prove one joyous idea: replacing “some mystery number” with x exposes the hidden gears underneath.',
    intuitiveSecret:
      'Translate words into x → simplify or expand → match structure or solve balanced pans.',
    partyTrickOrProTip:
      'Plug your solved x back into the original word puzzle—checking takes 5 seconds and guarantees 100% accuracy!',
    funEmoji: '🧭',
    quoteTag: 'Algebra turns every riddle into a crystal-clear equation.',
  },

  // PART II · CHAPTER 7: Area (p2-mod-7-1 to p2-mod-7-8)
  'p2-mod-7-1': {
    headline: 'Why Every Triangle Is Half a Bounding Rectangle',
    analogyStory:
      'Draw any acute triangle on paper and frame it snugly inside a rectangle sharing its base b and height h. Drop a line down from the top peak: the left triangle fills half its left rectangle, and the right triangle fills half its right rectangle—making the WHOLE triangle exact ½ × b × h!',
    intuitiveSecret:
      'Area measures 2D tiles inside (cm²), whereas perimeter traces the 1D fence around. Two shapes with equal perimeter can hold wildly different areas!',
    partyTrickOrProTip:
      'A 1×9 rectangle and a 5×5 square BOTH have perimeter 20—yet their areas are 9 vs. 25! Squares maximize area for a given perimeter.',
    funEmoji: '📐',
    quoteTag: 'Drop one vertical altitude and every triangle reveals itself as half a rectangle.',
  },
  'p2-mod-7-2': {
    headline: 'Leaning Obtuse Triangles & Median Equal-Area Splitters',
    analogyStory:
      'What if a triangle leans way over sideways so its top tip hangs outside its base? Does ½ × base × height break? No! Slide the tip horizontally along a parallel ceiling—its perpendicular height outside still creates ½bh, and EVERY median slices a triangle into two halves of equal area!',
    intuitiveSecret:
      'Triangles sharing equal bases and equal perpendicular height hold identical area, regardless of how skewed or obtuse their lean is.',
    partyTrickOrProTip:
      'Never use a slanted side length as the height! Always drop a perpendicular (90°) altitude to the extended base line.',
    funEmoji: '🔺',
    quoteTag: 'Slide a triangle’s apex parallel to its base and its area never changes by a speck.',
  },
  'p2-mod-7-3': {
    headline: 'Parallel Tracks & Gopal’s River Reflection Path',
    analogyStory:
      'Imagine two parallel train tracks h meters apart. Anchor a triangle’s base on the bottom rail and slide its top vertex anywhere along the top rail—stretch it a kilometer away and the area NEVER changes! Plus, reflecting Gopal’s hut across a river finds his shortest water-fetching walk in one straight line.',
    intuitiveSecret:
      'All triangles on the same base between the same parallel lines possess identical area because their perpendicular height h is locked.',
    partyTrickOrProTip:
      'For reflection shortest-path puzzles, reflect the destination point across the boundary line and measure a straight hypotenuse!',
    funEmoji: '🛤️',
    quoteTag: 'Parallel rails preserve triangle area across infinite shearing.',
  },
  'p2-mod-7-4': {
    headline: 'Cut-and-Slide Carpentry: Parallelogram Area = b × h',
    analogyStory:
      'Slice a right-angled triangle off one slanted end of a parallelogram and slide it horizontally to the opposite edge—SNAP! It locks cleanly into a perfect rectangle of width b and vertical height h, proving Area = b × h!',
    intuitiveSecret:
      'A parallelogram uses its PERPENDICULAR height h (not its slanted side!)—because tilting a rectangular fence shrinks the area trapped inside.',
    partyTrickOrProTip:
      'If a parallelogram gives TWO bases and ONE altitude, pair EACH base with its OWN perpendicular height: b₁h₁ = b₂h₂!',
    funEmoji: '🪚',
    quoteTag: 'Slice one triangle off the left, snap it onto the right, and a parallelogram turns into a rectangle.',
  },
  'p2-mod-7-5': {
    headline: 'Diamond Crosshairs: Rhombus & Kite Area = ½ d₁ d₂',
    analogyStory:
      'Because a rhombus (or kite!) has perpendicular diagonals d₁ and d₂ crossing at 90°, draw a tight d₁ × d₂ rectangle touching all four tips. Each quadrant of the rhombus covers exactly half of its corner box—giving Area = ½ × d₁ × d₂!',
    intuitiveSecret:
      'Any quadrilateral whose diagonals cross at 90° (rhombus, kite, square) has Area = ½ × d₁ × d₂.',
    partyTrickOrProTip:
      'For a square with diagonal d, ½ × d × d = d²/2 gives its area without even solving for its side length!',
    funEmoji: '🪁',
    quoteTag: 'Perpendicular diagonals split their bounding box in half.',
  },
  'p2-mod-7-6': {
    headline: 'The Twin-Trapezium Snap: Area = ½ h (a + b)',
    analogyStory:
      'Take any trapezium with parallel sides a and b. Clone a second identical trapezium, flip it upside-down, and slide it flush against the slanted leg—together they form ONE giant parallelogram of total base (a + b) and height h! Half of that gives ½ h (a + b)!',
    intuitiveSecret:
      'You can also read ½ h (a + b) as: Average Width × Height—literally turning the slanted trapezium into an equivalent rectangle of width (a+b)/2!',
    partyTrickOrProTip:
      'Check extreme cases: set a = b and ½h(b + b) simplifies back to b × h (parallelogram); set a = 0 and it becomes ½bh (triangle)! One formula rules them all.',
    funEmoji: '🔷',
    quoteTag: 'Flip a twin trapezium upside down and a parallelogram appears like magic.',
  },
  'p2-mod-7-7': {
    headline: 'Land Surveyor Offsets & Square-Unit Conversions',
    analogyStory:
      'Real land fields aren’t tidy rectangles—so a surveyor walks one main diagonal d across the irregular quadrilateral and drops perpendicular offset strings h₁ and h₂ to the two side corners, giving Area = ½ d (h₁ + h₂)!',
    intuitiveSecret:
      'Always square linear conversion factors for area: 1 m = 100 cm ⇒ 1 m² = 10,000 cm²; 1 hectare = 10,000 m² (a 100m × 100m field).',
    partyTrickOrProTip:
      'Break complex composite floor plans into rectangles + right triangles, OR enclose the whole shape in one big box and subtract the empty corner triangles!',
    funEmoji: '🗺️',
    quoteTag: 'Triangulate across a main diagonal and any crooked polygon bends to simple halves.',
  },
  'p2-mod-7-8': {
    headline: '2D Area Dissection Master Summary',
    analogyStory:
      'Every polygon formula you need—triangle (½bh), parallelogram (bh), rhombus/kite (½d₁d₂), trapezium (½h(a+b)), and surveyed field (½d(h₁+h₂))—comes from slicing and rearranging shapes back into rectangles.',
    intuitiveSecret:
      'You don’t need to memorize 6 separate rules when all of them grow out of Rectangle Area = length × perpendicular width.',
    partyTrickOrProTip:
      'Before multiplying two lengths for area, check with a ruler test: are those two segments actually at 90° to each other?',
    funEmoji: '🧭',
    quoteTag: 'Dissect, rotate, and reassemble—every polygon is a rectangle in disguise.',
  },
};
