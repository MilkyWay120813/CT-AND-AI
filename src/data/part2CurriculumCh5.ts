import { Part1ChapterCurriculum } from '../types/part1Curriculum';

export const PART2_CHAPTER_5: Part1ChapterCurriculum[] = [
  // ============================================================================
  // PART II · CHAPTER 5: TALES BY DOTS AND LINES
  // ============================================================================
  {
    chapterId: 'ch12-dots-and-lines',
    chapterIndex: 5,
    chapterBadgeLabel: 'Ganita Prakash Part II · Chapter 5',
    title: 'Tales by Dots and Lines',
    heroRibbonText: 'Ganita Prakash Class 8 · Part II Master Curriculum',
    heroSubtitle:
      'Discover the Arithmetic Mean as a physical center of balance on a dot plot, contrast Mean vs. Median under extreme outliers, master frequency tables, spreadsheet formulas (=SUM, =AVERAGE), line graphs, and geographic infographics.',
    pdfCode: 'Part II · Ch 5',
    pdfUrl: '/assets/aistudio/5.-TALES-BY-DOTS-AND-LINES_73a3818f.pdf',
    heroBgGradient: 'from-[#1E1B4B] via-[#0F4C5C] to-[#042F2E]',
    accentColor: '#2DD4BF',
    challengeBannerTitle: 'Are you ready for the National Census Data Bureau Challenge?',
    challengeBannerSubtitle:
      'Clean, analyze, and present demographic datasets using spreadsheets and line graphs, explore the Climate & Weather Visualizer Lab, and complete the 20-Question Exam.',
    modules: [
      {
        id: 'p2-mod-5-1',
        moduleCode: 'Module 5.1',
        shortNumber: '5.1',
        title: 'The Balancing Act: Mean as a Centre of Balance',
        cardHeadline: 'Mean as a Centre of Balance (Fulcrum)',
        cardTeaser:
          'Explore the arithmetic mean through dot plots and physical balance beams where Sum of Left Deviations = Sum of Right Deviations.',
        artworkTheme: 'parity',
        videoCue: {
          title: '3-Minute Video on the Arithmetic Mean as a Physical Fulcrum on a Dot Plot',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Place equal weights on a number-line beam and see why it balances at x̄ = (∑x_i)/n—where total distance to the left equals total distance to the right!',
          readingParagraphs: [
            'The Arithmetic Mean (Average) of n numbers is x̄ = (x₁ + x₂ + … + x_n) / n. Physically, if you place identical coins at positions x₁, x₂, …, x_n along a weightless ruler, the ruler balances horizontally when the fulcrum is placed at x̄!',
            'Why does it balance? Because the sum of distances of points to the LEFT of the mean always equals the sum of distances of points to the RIGHT of the mean: ∑(x̄ − x_left) = ∑(x_right − x̄)!',
          ],
          keyTakeaways: [
            'Arithmetic Mean x̄ = (Sum of all observations) ÷ (Number of observations).',
            'Total Sum of n observations = n × x̄.',
            'Balance Property: Sum of deviations below x̄ equals sum of deviations above x̄.',
          ],
          workedExample: {
            problem: 'Verify that the data points {2, 3, 7, 12} balance at their mean x̄ = 6 by comparing left and right distances from 6.',
            steps: [
              'Compute Mean: x̄ = (2 + 3 + 7 + 12) ÷ 4 = 24 ÷ 4 = 6.',
              'Distances to the LEFT of 6: (6 − 2) + (6 − 3) = 4 + 3 = 7.',
              'Distances to the RIGHT of 6: (7 − 6) + (12 − 6) = 1 + 6 = 7. Left = Right = 7 (Balanced!).',
            ],
            answer: 'Mean x̄ = 6 · Left Deviations (4 + 3 = 7) = Right Deviations (1 + 6 = 7)',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Leveling Stacks & The Fulcrum on a Dot Plot',
              narration:
                'Place dots at 2, 3, 7, and 12 on a number line. Sliding the triangular fulcrum to 6 brings the beam into perfect horizontal equilibrium!',
              boardFormula: 'Mean x̄ = (∑ x_i) ÷ n · Fulcrum Point on Number Line',
              visualCaption: 'Number-line seesaw with dots at 2, 3, 7, 12 balancing on fulcrum 6',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Why Left Deviations Equal Right Deviations',
              narration:
                'From fulcrum 6, the left dots are 4 and 3 units away (sum = 7), and the right dots are 1 and 6 units away (sum = 7)!',
              boardFormula: '∑ (x̄ − x_left) = ∑ (x_right − x̄)',
              visualCaption: 'Left torque arrows (4 + 3 = 7) matching right torque arrows (1 + 6 = 7)',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Finding a Missing Data Point from the Target Mean',
              narration:
                'If 5 numbers have mean 14, their total sum must be 5 × 14 = 70—making it easy to find any missing fifth value!',
              boardFormula: 'Total Sum = n × x̄',
              visualCaption: 'Five data blocks leveling to height 14 (Total = 70)',
            },
          ],
        },
        simulation: {
          title: 'Dot Plot Balance Beam',
          description:
            'Adjust data weights on the number line to watch the fulcrum slide to the exact arithmetic mean x̄.',
          interactionType: 'parity-scale',
          defaultControlA: 4,
          defaultControlB: 12,
          controlALabel: 'Left Data Cluster Position',
          controlAMin: 1,
          controlAMax: 15,
          controlBLabel: 'Right Outlier Position',
          controlBMin: 5,
          controlBMax: 30,
          formulaHighlight: 'x̄ = (∑ x_i) / n · ∑(x̄ − x_left) = ∑(x_right − x̄)',
        },
        game: {
          title: 'Balance Master',
          subtitle: 'Add or shift dots on the number line to maintain a target mean fulcrum!',
          rules: 'Use Sum = n × Mean or equate left and right deviations.',
          challenges: [
            {
              prompt: 'Three dots sit at 4, 5, and 6 on a balance beam (current mean = 5). If you place a new dot at 1, where must you place a fifth dot so the balance point stays at 5?',
              clue: '1 is 4 units to the left of 5, so place the new dot 4 units to the right of 5!',
              options: ['At 9', 'At 8', 'At 10', 'At 7'],
              correctIndex: 0,
              explanation: 'Left deviation is 5 − 1 = 4, so the right dot must be at 5 + 4 = 9.',
            },
            {
              prompt: 'The mean of 5 numbers is 18. If four of the numbers are 12, 15, 20, and 21, what is the fifth number?',
              clue: 'Total sum must be 5 × 18 = 90.',
              options: ['22', '20', '24', '18'],
              correctIndex: 0,
              explanation: 'Sum of 4 numbers = 12 + 15 + 20 + 21 = 68. Fifth number = 90 − 68 = 22.',
            },
            {
              prompt: 'For the dataset {10, 12, 14, 24}, the mean is 15. What is the sum of deviations of the numbers below 15 from the mean?',
              clue: '(15 − 10) + (15 − 12) + (15 − 14).',
              options: ['9 (which matches 24 − 15 = 9 above the mean!)', '6', '12', '15'],
              correctIndex: 0,
              explanation: '5 + 3 + 1 = 9 on the left, balancing 24 − 15 = 9 on the right.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-5-2',
        moduleCode: 'Module 5.2',
        shortNumber: '5.2',
        title: 'Comparing Mean and Median',
        cardHeadline: 'Comparing Mean vs. Median & Outliers',
        cardTeaser:
          'Contrast the Mean (balance point) with the Median (middle sorted position) and see why the Median resists extreme outliers.',
        artworkTheme: 'alternating-sign-balance' as never,
        videoCue: {
          title: '3-Minute Video on Mean vs. Median & Why Outliers Pull the Mean',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Sort data from least to greatest to locate the Median, and watch how a single extreme billionaire outlier drags the Mean far away while the Median barely moves!',
          readingParagraphs: [
            'To find the Median, ALWAYS sort the data in ascending (or descending) order first! If n is odd, the Median is the exact middle value at position (n + 1)/2. If n is even, the Median is the average of the two middle values at positions n/2 and (n/2) + 1.',
            'Consider 5 household incomes (in ₹ thousands): {20, 22, 24, 26, 208}. The Median is the middle number, ₹24k—which represents a typical family well. The Mean is 300 ÷ 5 = ₹60k, pulled way up by the single ₹208k outlier!',
          ],
          keyTakeaways: [
            'Always SORT data first before finding the Median!',
            'Odd n: Median is term (n+1)/2. Even n: Median is average of terms n/2 and (n/2)+1.',
            'The Mean is sensitive to extreme outliers; the Median is robust (outlier-resistant).',
          ],
          workedExample: {
            problem: 'Find the Mean and Median of the 6 sorted scores: {10, 12, 14, 16, 18, 50}.',
            steps: [
              'Mean = (10 + 12 + 14 + 16 + 18 + 50) ÷ 6 = 120 ÷ 6 = 20.',
              'Since n = 6 is even, average the 3rd and 4th sorted terms (14 and 16): Median = (14 + 16) ÷ 2 = 15.',
              'Notice how the outlier 50 pulls the Mean (20) above the Median (15)!',
            ],
            answer: 'Mean = 20 · Median = 15',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Step 1 for Median: Sort First! (Odd n vs. Even n)',
              narration:
                'Never pick the middle number of an unsorted list! Sort first, then take the middle item (odd n) or the midpoint of the two middle items (even n).',
              boardFormula: 'Odd n: x_{(n+1)/2}  ·  Even n: ½ (x_{n/2} + x_{n/2 + 1})',
              visualCaption: 'Number cards sorting into order to spotlight the central median card',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'How an Outlier Drags the Mean Fulcrum',
              narration:
                'When the largest value jumps from 18 to 98, the balance-beam Mean shifts strongly right, while the positional Median stays anchored!',
              boardFormula: 'Outlier ↑  ⇒  Mean Shifts Strongly · Median Stays Stable',
              visualCaption: 'Outlier dot sliding right, pulling the Mean arrow while Median stays fixed',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Choosing the Right Representative Average',
              narration:
                'Use Mean for symmetric data without outliers (like heights); use Median for skewed data with extreme outliers (like incomes or house prices).',
              boardFormula: 'Symmetric Data → Mean  ·  Skewed / Outlier Data → Median',
              visualCaption: 'Comparison chart of symmetric vs skewed distributions',
            },
          ],
        },
        simulation: {
          title: 'Mean vs. Median Outlier Squeezer',
          description:
            'Drag the rightmost outlier value in a 5-point dataset {10, 12, 15, 18, Outlier} to see how Mean shifts while Median stays at 15!',
          interactionType: 'alternating-sign-balance',
          defaultControlA: 15,
          defaultControlB: 60,
          controlALabel: 'Middle Value (Median = 15)',
          controlAMin: 10,
          controlAMax: 20,
          controlBLabel: '5th Value (Outlier x₅)',
          controlBMin: 18,
          controlBMax: 120,
          formulaHighlight: 'Dataset {10, 12, 15, 18, x₅}: Median = 15 (Fixed!) · Mean = (55 + x₅)/5',
        },
        game: {
          title: 'Center Predictor',
          subtitle: 'Compute medians for odd/even lists and predict how outliers affect the center!',
          rules: 'Sort the numbers first before locating the median.',
          challenges: [
            {
              prompt: 'What is the median of the unsorted list: 19, 11, 25, 14, 17?',
              clue: 'Sort first: 11, 14, 17, 19, 25.',
              options: ['17', '25', '15.5', '18'],
              correctIndex: 0,
              explanation: 'Sorted: 11, 14, 17, 19, 25. The 3rd (middle) number is 17.',
            },
            {
              prompt: 'What is the median of the 6 numbers: 8, 12, 15, 19, 22, 30?',
              clue: 'Average the 3rd and 4th numbers (15 and 19).',
              options: ['17', '15', '19', '17.67'],
              correctIndex: 0,
              explanation: 'Median = (15 + 19) ÷ 2 = 34 ÷ 2 = 17.',
            },
            {
              prompt: 'In the sorted dataset {4, 6, 8, 10, 12}, if 12 is replaced by 112, what happens to the Mean and Median?',
              clue: 'Total sum increases by 100 (for 5 items), while the 3rd item is still 8.',
              options: [
                'Mean increases by 20; Median stays 8',
                'Both Mean and Median increase by 20',
                'Mean stays 8; Median increases by 20',
                'Mean increases by 100; Median stays 8',
              ],
              correctIndex: 0,
              explanation: 'New Mean = 8 + (100 ÷ 5) = 28, whereas the middle (3rd) value is still 8!',
            },
          ],
        },
      },
      {
        id: 'p2-mod-5-3',
        moduleCode: 'Module 5.3',
        shortNumber: '5.3',
        title: 'Effect of Data Changes on Mean & Median',
        cardHeadline: 'Effect of Data Changes on Mean & Median',
        cardTeaser:
          'Analyze how shifting every value by +c, scaling by ×k, or inserting/removing observations updates the Mean and Median.',
        artworkTheme: 'always-never',
        videoCue: {
          title: '3-Minute Video on Shifting, Scaling & Updating Datasets',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'See why adding +5 bonus marks to every student adds +5 to both Mean and Median, and why inserting a new value equal to x̄ leaves the Mean unchanged!',
          readingParagraphs: [
            'If every observation x_i in a dataset is increased by a constant c (x_i → x_i + c), the entire dot plot slides right by c units—so BOTH the Mean and the Median increase by c! Similarly, multiplying every observation by k multiplies both the Mean and Median by k.',
            'What if you add one new observation to a list of n numbers with mean x̄? If the new number equals x̄ (it lands right on the fulcrum!), the mean stays x̄! If a number is replaced or added, compute the New Total Sum and divide by the New Count.',
          ],
          keyTakeaways: [
            'Shift Rule: If every x_i → x_i ± c, then Mean → x̄ ± c and Median → Median ± c.',
            'Scale Rule: If every x_i → k·x_i, then Mean → k·x̄ and Median → k·Median.',
            'Invariant Mean Rule: Adding or removing a value equal to x̄ leaves the mean x̄ unchanged!',
          ],
          workedExample: {
            problem: 'The mean of 8 observations is 25. Later it is discovered that one observation 14 was misread as 30. Find the correct mean.',
            steps: [
              'Incorrect Total Sum = 8 × 25 = 200.',
              'Subtract the wrong value (30) and add the correct value (14): Correct Sum = 200 − 30 + 14 = 184.',
              'Correct Mean = 184 ÷ 8 = 23.',
            ],
            answer: 'Correct Mean = 23',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Uniform Shift (+c) and Uniform Scaling (×k)',
              narration:
                'Adding +10 to every score shifts the entire balance beam 10 units right; multiplying every score by 2 stretches the beam by ×2.',
              boardFormula: 'Mean(k·x + c) = k · Mean(x) + c',
              visualCaption: 'Dot plot sliding right by +c and stretching by ×k along the axis',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Adding a Value Right on the Fulcrum (x_new = x̄)',
              narration:
                'Placing a new weight directly on top of the fulcrum adds zero torque, so the balance point x̄ does not move at all!',
              boardFormula: '(n·x̄ + x̄) ÷ (n + 1) = (n + 1)x̄ ÷ (n + 1) = x̄',
              visualCaption: 'New dot dropping straight onto fulcrum x̄ with zero tilt',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Fixing a Misread Entry in Seconds',
              narration:
                'Instead of re-adding all numbers, just divide the net change (Correct − Wrong) by n and add to the old mean!',
              boardFormula: 'New Mean = Old Mean + (Correct − Wrong) ÷ n',
              visualCaption: 'Correction delta (−16 ÷ 8 = −2) shifting mean from 25 to 23',
            },
          ],
        },
        simulation: {
          title: 'Data Modifier & Shift/Scale Analyzer',
          description:
            'Apply a constant shift (+c) or multiplier (×k) to a dataset of mean 20 to observe real-time mean and median updates.',
          interactionType: 'dot-grid-multiplier',
          defaultControlA: 5,
          defaultControlB: 2,
          controlALabel: 'Additive Shift (+c)',
          controlAMin: 0,
          controlAMax: 25,
          controlBLabel: 'Scale Factor (×k)',
          controlBMin: 1,
          controlBMax: 5,
          formulaHighlight: 'New Mean = k × (Old Mean) + c',
        },
        game: {
          title: 'Invariant Meaner',
          subtitle: 'Predict updated means after shifts, scalings, and data corrections!',
          rules: 'Use linear properties of the mean or Total Sum = n × Mean.',
          challenges: [
            {
              prompt: 'The mean of 12 numbers is 30. If every number is multiplied by 3 and then increased by 4, what is the new mean?',
              clue: 'New Mean = 3 × 30 + 4.',
              options: ['94', '90', '102', '37'],
              correctIndex: 0,
              explanation: '3 × 30 + 4 = 94.',
            },
            {
              prompt: 'A batsman has a mean score of 42 across 9 innings. How many runs must he score in his 10th innings to raise his mean to 45?',
              clue: 'New 10-innings total = 450; old 9-innings total = 9 × 42 = 378.',
              options: ['72 runs', '69 runs', '75 runs', '45 runs'],
              correctIndex: 0,
              explanation: '450 − 378 = 72 runs (or 42 + 10 × 3 = 72 runs!).',
            },
            {
              prompt: 'The mean of 7 numbers is 20. If two numbers 14 and 26 are removed, what is the mean of the remaining 5 numbers?',
              clue: 'Notice that 14 + 26 = 40 has mean 20—equal to the original mean!',
              options: ['20 (unchanged!)', '18', '22', '19'],
              correctIndex: 0,
              explanation: 'Old sum = 140; removing 14 + 26 = 40 leaves 100 for 5 numbers ⇒ 100 ÷ 5 = 20.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-5-4',
        moduleCode: 'Module 5.4',
        shortNumber: '5.4',
        title: 'Frequency Tables & Weighted Averages',
        cardHeadline: 'Frequency Tables & Weighted Averages (∑fx / ∑f)',
        cardTeaser:
          'Compute the weighted mean and median from grouped frequency tables (x_i with frequency f_i) using x̄ = (∑ f_i x_i) ÷ (∑ f_i).',
        artworkTheme: 'diff-table',
        videoCue: {
          title: '3-Minute Video on Frequency Tables, ∑fx / ∑f & Cumulative Frequency Medians',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'See why repeating value x_i exactly f_i times turns addition into multiplication f_i × x_i, and how cumulative frequencies locate the median row!',
          readingParagraphs: [
            'When a survey of 40 households records family sizes x_i ∈ {2, 3, 4, 5, 6} with frequencies f_i (how many families have that size), adding x_i repeatedly f_i times is simply f_i × x_i!',
            'Therefore, Total Sum = ∑(f_i · x_i) and Total Count N = ∑f_i, giving the Weighted Mean formula: x̄ = (∑ f_i x_i) ÷ (∑ f_i). Remember to divide by total frequency ∑f_i, NEVER by the number of rows!',
          ],
          keyTakeaways: [
            'Frequency Table Mean: x̄ = (∑ f_i x_i) ÷ (∑ f_i).',
            'Never divide ∑(f_i x_i) by the number of distinct x_i categories—always divide by N = ∑f_i!',
            'Combined Mean of two groups: x̄₁₂ = (n₁x̄₁ + n₂x̄₂) ÷ (n₁ + n₂).',
          ],
          workedExample: {
            problem: 'In a class test: 4 students scored 6, 10 students scored 8, and 6 students scored 10. Find the class mean score.',
            steps: [
              'Multiply each score by its frequency: ∑(f·x) = (4 × 6) + (10 × 8) + (6 × 10) = 24 + 80 + 60 = 164.',
              'Total number of students: N = ∑f = 4 + 10 + 6 = 20.',
              'Class Mean = 164 ÷ 20 = 8.2.',
            ],
            answer: 'Class Mean = 8.2',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Why Frequency f_i Multiplies Value x_i',
              narration:
                'Instead of adding 8 ten separate times, a frequency table groups them into one product: f × x = 10 × 8 = 80.',
              boardFormula: 'x̄ = (f₁x₁ + f₂x₂ + … + f_kx_k) ÷ (f₁ + f₂ + … + f_k)',
              visualCaption: 'Dot stacks compressing into a 3-column table: x_i | f_i | f_i·x_i',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Finding the Median Using Cumulative Frequency',
              narration:
                'Keep a running total of frequencies (Cumulative Frequency) to spot which row contains the middle observation N/2!',
              boardFormula: 'Locate position (N + 1)/2 in the Cumulative Frequency column',
              visualCaption: 'Cumulative frequency bar highlighting the 10th and 11th student row',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Combined Mean of Two Sections: (n₁x̄₁ + n₂x̄₂)/(n₁ + n₂)',
              narration:
                'When Section A (20 students, mean 70) joins Section B (30 students, mean 80), the larger section pulls the combined mean to 76!',
              boardFormula: 'Combined Mean = (20×70 + 30×80) ÷ 50 = 76',
              visualCaption: 'Weighted balance beam closer to the heavier 30-student group at 76',
            },
          ],
        },
        simulation: {
          title: 'Frequency Table & Weighted Mean Aggregator',
          description:
            'Adjust group sizes (n₁, n₂) to see how the combined weighted mean shifts toward the group with higher frequency.',
          interactionType: 'difference-table',
          defaultControlA: 20,
          defaultControlB: 30,
          controlALabel: 'Group A Frequency (n₁, mean 70)',
          controlAMin: 5,
          controlAMax: 50,
          controlBLabel: 'Group B Frequency (n₂, mean 90)',
          controlBMin: 5,
          controlBMax: 50,
          formulaHighlight: 'x̄ = (∑ f_i x_i) ÷ (∑ f_i) = (70·n₁ + 90·n₂) ÷ (n₁ + n₂)',
        },
        game: {
          title: 'Frequency Calculator',
          subtitle: 'Compute weighted means and medians from frequency tables and combined groups!',
          rules: 'Always divide total ∑(fx) by total frequency ∑f.',
          challenges: [
            {
              prompt: 'In a plant height survey: 3 plants are 10 cm, 5 plants are 12 cm, and 2 plants are 15 cm. What is the mean plant height?',
              clue: '∑fx = 30 + 60 + 30 = 120; ∑f = 3 + 5 + 2 = 10.',
              options: ['12 cm', '12.33 cm', '40 cm', '11.5 cm'],
              correctIndex: 0,
              explanation: 'Mean = (30 + 60 + 30) ÷ (3 + 5 + 2) = 120 ÷ 10 = 12 cm.',
            },
            {
              prompt: 'Section A of 15 students has mean 80, and Section B of 25 students has mean 64. What is the combined mean of all 40 students?',
              clue: '(15×80 + 25×64) ÷ 40 = (1200 + 1600) ÷ 40.',
              options: ['70', '72', '68', '74'],
              correctIndex: 0,
              explanation: 'Total marks = 1,200 + 1,600 = 2,800 ⇒ 2,800 ÷ 40 = 70.',
            },
            {
              prompt: 'In a frequency table of 19 observations sorted by x, which cumulative frequency position gives the Median?',
              clue: '(19 + 1) ÷ 2.',
              options: ['The 10th observation', 'The 9th observation', 'The 9.5th observation', 'The 19th observation'],
              correctIndex: 0,
              explanation: 'For n = 19 (odd), the median is the (19 + 1)/2 = 10th sorted observation.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-5-5',
        moduleCode: 'Module 5.5',
        shortNumber: '5.5',
        title: 'Spreadsheets for Data Analysis',
        cardHeadline: 'Spreadsheets for Data Analysis (=SUM, =AVERAGE)',
        cardTeaser:
          'Navigate digital spreadsheets: address cells by Column-Row (like B3), specify cell ranges (B3:G3), and write live formulas starting with =.',
        artworkTheme: 'div-matrix',
        videoCue: {
          title: '3-Minute Video on Spreadsheet Cells, Ranges (B3:G3) & Dynamic Formulas',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Learn how columns (A, B, C…) and rows (1, 2, 3…) form cell addresses like C4, and how =SUM(B2:B10) and =AVERAGE(C2:C10) automate large mark sheets.',
          readingParagraphs: [
            'In a spreadsheet, vertical Columns are labeled with letters (A, B, C…) and horizontal Rows are numbered (1, 2, 3…). Their intersection is a Cell address: Column Letter first, Row Number second (e.g., B3, never 3B!).',
            'A contiguous block of cells from B3 to G3 is written with a colon as the range B3:G3. Every formula must start with an equals sign (=): =SUM(B3:G3) adds all 6 cells, =AVERAGE(B3:G3) computes their mean, and =MAX(B3:G3) or =MIN(B3:G3) finds the highest or lowest score!',
          ],
          keyTakeaways: [
            'Cell Address = Column Letter + Row Number (e.g., D5).',
            'Range Notation: B3:G3 means all cells from B3 through G3 inclusive.',
            'Formulas always begin with "=": =SUM(range), =AVERAGE(range), =MAX(range), =MIN(range).',
          ],
          workedExample: {
            problem: 'A student’s marks in 5 subjects are stored in cells B4, C4, D4, E4, and F4. Write the spreadsheet formulas for Total Marks in G4 and Mean Marks in H4.',
            steps: [
              'For Total Marks in G4: type =SUM(B4:F4).',
              'For Mean Marks in H4: type =AVERAGE(B4:F4) (or =G4/5).',
            ],
            answer: 'G4: =SUM(B4:F4) · H4: =AVERAGE(B4:F4)',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Grid Coordinates: Column Letter + Row Number (B3)',
              narration:
                'Columns run vertically (A, B, C…) and rows run horizontally (1, 2, 3…). Cell B3 sits in Column B, Row 3.',
              boardFormula: 'Cell Address: <Column Letter><Row Number> · Range: B3:G3',
              visualCaption: 'Spreadsheet grid highlighting Column B, Row 3, and range B3:G3',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Writing Live Formulas: =SUM and =AVERAGE',
              narration:
                'Starting a cell with "=" tells the computer to evaluate a formula. Changing any input cell updates the formula result automatically!',
              boardFormula: '=SUM(B3:G3)  ·  =AVERAGE(B3:G3)  ·  =MAX(B3:G3)',
              visualCaption: 'Formula bar typing =AVERAGE(B3:G3) and computing 84.5 live',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Dragging the Fill Handle Across Rows',
              narration:
                'Drag the bottom-right corner of G3 down to G20: the relative range B3:F3 automatically updates to B4:F4, B5:F5… for every student!',
              boardFormula: 'Relative Fill: =SUM(B3:F3) → =SUM(B4:F4) → =SUM(B5:F5)',
              visualCaption: 'Auto-fill handle copying formulas down an entire class mark sheet',
            },
          ],
        },
        simulation: {
          title: 'Spreadsheet Formula Sandbox',
          description:
            'Adjust cell values in range B2:E2 to watch =SUM(B2:E2), =AVERAGE(B2:E2), and =MAX(B2:E2) recalculate instantly.',
          interactionType: 'divisibility-matrix',
          defaultControlA: 78,
          defaultControlB: 92,
          controlALabel: 'Cell B2 Score',
          controlAMin: 40,
          controlAMax: 100,
          controlBLabel: 'Cell C2 Score',
          controlBMin: 40,
          controlBMax: 100,
          formulaHighlight: '=SUM(B2:E2) · =AVERAGE(B2:E2) · =SUM(B2:E2)/COUNT(B2:E2)',
        },
        game: {
          title: 'Data Wizard',
          subtitle: 'Write valid spreadsheet formulas and count cells in 2D ranges!',
          rules: 'Remember that formulas begin with = and ranges use a colon (:).',
          challenges: [
            {
              prompt: 'Which spreadsheet formula correctly calculates the mean of cells C2, C3, C4, C5, and C6?',
              clue: 'Must start with = and use a colon for the range C2 to C6.',
              options: ['=AVERAGE(C2:C6)', 'AVERAGE(C2-C6)', '=MEAN(2C:6C)', '=SUM(C2:C6)'],
              correctIndex: 0,
              explanation: '=AVERAGE(C2:C6) computes the arithmetic mean of all cells from C2 through C6.',
            },
            {
              prompt: 'How many individual cells are included in the rectangular spreadsheet range B2:D5?',
              clue: '3 columns (B, C, D) × 4 rows (2, 3, 4, 5).',
              options: ['12 cells', '7 cells', '9 cells', '15 cells'],
              correctIndex: 0,
              explanation: 'Columns B, C, D (3) × Rows 2, 3, 4, 5 (4) = 3 × 4 = 12 cells.',
            },
            {
              prompt: 'If cell A1 = 10, B1 = 20, C1 = 30, what value is displayed by the formula =SUM(A1:C1)/2?',
              clue: 'Sum is 60; divide by 2.',
              options: ['30', '60', '20', '15'],
              correctIndex: 0,
              explanation: 'SUM(A1:C1) = 10 + 20 + 30 = 60, and 60 / 2 = 30.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-5-6',
        moduleCode: 'Module 5.6',
        shortNumber: '5.6',
        title: 'Visualizing Data: Line Graphs vs. Bar Graphs',
        cardHeadline: 'Visualizing Data: Line Graphs vs. Bar Graphs',
        cardTeaser:
          'Choose between bar graphs (categorical comparison) and line graphs (continuous trends over time), and interpret slopes, peaks, and multi-line crossings.',
        artworkTheme: 'paper-moon',
        videoCue: {
          title: '3-Minute Video on Line Graphs, Slopes, Trends & Bar vs. Line Selection',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'See why line graphs excel at showing continuous change over time (temperature, ISRO space launches, plant growth) where steeper segments mean faster rates of change!',
          readingParagraphs: [
            'Bar graphs compare distinct categories (like favorite sports), whereas Line Graphs connect data points over sequential time intervals (hours, months, years, decades) to highlight trends, rates of change, and turning points.',
            'On a time-series line graph: a steep upward segment means rapid growth, a flat horizontal segment means zero change, a downward segment means a decrease, and the point where two lines cross shows when two series had the exact same value!',
          ],
          keyTakeaways: [
            'Use Bar Graphs for discrete categories; use Line Graphs for trends over continuous time.',
            'Steeper slope = faster rate of increase or decrease per unit time.',
            'Flat horizontal line segment = constant value (zero change) during that interval.',
          ],
          workedExample: {
            problem: 'A city’s temperature was 22°C at 8 AM, 30°C at 12 PM, and 30°C at 2 PM. Describe the line graph segments and find the rate of warming from 8 AM to 12 PM.',
            steps: [
              'From 8 AM to 12 PM (4 hours), temperature rose by 30 − 22 = 8°C ⇒ upward slope of 8°C ÷ 4 h = +2°C per hour.',
              'From 12 PM to 2 PM, temperature stayed at 30°C ⇒ flat horizontal segment (0°C/h).',
            ],
            answer: '+2°C/hour rising segment (8 AM–12 PM), then flat horizontal segment (12 PM–2 PM)',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'When to Use a Line Graph vs. a Bar Graph',
              narration:
                'Connect points with a line only when the horizontal axis is ordered and continuous—like time—so slopes between points have real meaning!',
              boardFormula: 'Time Series (Hours, Months, Years)  ⇒  Connected Line Graph',
              visualCaption: 'Bar chart of categories vs continuous time-series line graph',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Reading Slopes: Steep Rise, Flat Plateau, and Drop',
              narration:
                'The steepest upward segment marks the period of fastest growth; a horizontal segment means the quantity stayed constant.',
              boardFormula: 'Slope (Rate of Change) = Change in Y ÷ Change in Time X',
              visualCaption: 'Line graph highlighting steep rise, flat plateau, and sharp drop',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Comparing Two Series on a Double Line Graph',
              narration:
                'Plotting two cities on the same axes lets you see at a glance when City A was warmer than City B and the exact hour their temperatures crossed!',
              boardFormula: 'Intersection Point = Equal Values at That Time',
              visualCaption: 'Two coloured trend lines crossing at an intersection marker',
            },
          ],
        },
        simulation: {
          title: 'Time-Series Line Graph & Slope Analyzer',
          description:
            'Adjust start and end values across a time interval to inspect line slope and rate of change.',
          interactionType: 'power-line',
          defaultControlA: 22,
          defaultControlB: 34,
          controlALabel: 'Initial Value at t₁',
          controlAMin: 10,
          controlAMax: 50,
          controlBLabel: 'Final Value at t₂ (after 4 hrs)',
          controlBMin: 10,
          controlBMax: 60,
          formulaHighlight: 'Rate of Change (Slope) = (y₂ − y₁) ÷ (t₂ − t₁)',
        },
        game: {
          title: 'Trend Spotter',
          subtitle: 'Interpret peaks, plateaus, intersection points, and steepest slopes on line graphs!',
          rules: 'Check the vertical change per unit of horizontal time.',
          challenges: [
            {
              prompt: 'On a distance-time line graph for a cyclist, what does a flat HORIZONTAL line segment between t = 2 hr and t = 3 hr represent?',
              clue: 'Distance is not changing during that hour.',
              options: [
                'The cyclist stopped and rested (speed = 0)',
                'The cyclist rode at constant high speed',
                'The cyclist rode downhill',
                'The cyclist turned back toward home',
              ],
              correctIndex: 0,
              explanation: 'When distance stays constant over time, speed is zero (the cyclist is stationary).',
            },
            {
              prompt: 'Plant A grows from 10 cm to 22 cm in 4 weeks. Plant B grows from 15 cm to 23 cm in 4 weeks. Which plant has the steeper line graph segment?',
              clue: 'Compare growth rates: 12 cm / 4 wk vs 8 cm / 4 wk.',
              options: [
                'Plant A (3 cm/week vs 2 cm/week)',
                'Plant B because 23 cm > 22 cm',
                'Both have the same slope',
                'Cannot be determined',
              ],
              correctIndex: 0,
              explanation: 'Plant A grew 12 cm in 4 weeks (3 cm/wk), steeper than Plant B’s 8 cm in 4 weeks (2 cm/wk).',
            },
            {
              prompt: 'Why should we NOT use a connected line graph to display the favorite ice-cream flavors (Vanilla, Mango, Chocolate) of a class?',
              clue: 'Ice-cream flavors are discrete categories with no continuous order between them.',
              options: [
                'Because flavors are categorical, so slopes between them have no meaning',
                'Because line graphs can only show up to 3 numbers',
                'Because percentages cannot be plotted on graphs',
                'Because bar graphs cannot show frequencies',
              ],
              correctIndex: 0,
              explanation: 'Line graphs connect ordered continuous variables (like time); categorical data belongs on a bar chart.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-5-7',
        moduleCode: 'Module 5.7',
        shortNumber: '5.7',
        title: 'Reading Complex Infographics & Maps',
        cardHeadline: 'Reading Complex Infographics & Choropleth Maps',
        cardTeaser:
          'Decode multi-variable infographics from Ganita Prakash—including India’s Rice vs. Wheat choropleth maps, bubble charts, and 24-hour time-use strips.',
        artworkTheme: 'world-map',
        videoCue: {
          title: '3-Minute Video on Choropleth Maps, Multi-Dimensional Infographics & Time-Use Strips',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Learn how a single infographic encodes 3 or 4 variables at once using X/Y position, bubble size, color shading (choropleth), and proportional strip lengths!',
          readingParagraphs: [
            'Modern data storytelling combines multiple visual encodings in one graphic. In Ganita Prakash’s Rice vs. Wheat map of India, color hue shows which grain dominates (Rice vs. Wheat), while color intensity/dot size shows total consumption per person!',
            'Similarly, a 24-hour time-use strip divides a horizontal bar of length 24 hours into proportional colored segments (Sleeping, School, Play, Homework), letting you compare daily schedules across age groups at a single glance.',
          ],
          keyTakeaways: [
            'Always read the Legend/Key first: check what Position, Size, Color Hue, and Shade represent.',
            'Choropleth Map: regions are shaded by intensity of a rate or percentage (e.g., literacy % or rainfall).',
            '100% Stacked Bar / 24-Hour Strip: compares proportional breakdowns across multiple groups.',
          ],
          workedExample: {
            problem: 'On a 24-hour time-use strip of length 12 cm, the "Sleep" segment is 4.5 cm long. How many hours of sleep does this represent, and what percentage of the day is it?',
            steps: [
              'Scale: 12 cm represents 24 hours ⇒ 1 cm = 2 hours.',
              'Sleep duration = 4.5 cm × 2 hours/cm = 9 hours.',
              'Percentage of day = (9 / 24) × 100% = (3 / 8) × 100% = 37.5%.',
            ],
            answer: '9 hours of sleep (37.5% of the 24-hour day)',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Decoding Color & Size in Choropleth Maps (Rice vs. Wheat)',
              narration:
                'On a statistical map, color hue distinguishes categories while darker shading indicates higher percentage intensity.',
              boardFormula: 'Legend Key: Color Hue = Category · Shade Intensity = Magnitude',
              visualCaption: 'Choropleth state map legend contrasting Rice-dominant vs Wheat-dominant zones',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: '24-Hour Proportional Time-Use Strips',
              narration:
                'Stacked horizontal strips let you compare how students, athletes, and adults allocate their 24 hours without drawing separate pie charts.',
              boardFormula: 'Hours = (Segment Length ÷ Total Bar Length) × 24',
              visualCaption: 'Parallel 24-hour stacked strips comparing daily activities',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'Spotting Misleading Graphs (Truncated Axes & Area Distortion)',
              narration:
                'Always check if the vertical axis starts at 0! Starting a bar chart at 90 instead of 0 makes a 2% difference look like a 300% jump!',
              boardFormula: 'Check Axis Origin (0) · Compare Area vs. Height',
              visualCaption: 'Side-by-side comparison of truncated-axis graph vs true zero-baseline graph',
            },
          ],
        },
        simulation: {
          title: 'Infographic & 24-Hour Strip Analyzer',
          description:
            'Adjust activity hours on a 24-hour proportional strip to see its exact percentage share and bar length.',
          interactionType: 'population-slider',
          defaultControlA: 8,
          defaultControlB: 6,
          controlALabel: 'Sleep Hours (out of 24h)',
          controlAMin: 4,
          controlAMax: 12,
          controlBLabel: 'Study & School Hours (out of 24h)',
          controlBMin: 2,
          controlBMax: 12,
          formulaHighlight: 'Share % = (Hours / 24) × 100% · Strip cm = (Hours / 24) × Total cm',
        },
        game: {
          title: 'Infographic Decoder',
          subtitle: 'Decode multi-variable bubble charts, time-use strips, and misleading axis traps!',
          rules: 'Inspect the axes, baseline, and legend carefully.',
          challenges: [
            {
              prompt: 'In a bubble chart where X = Study Hours, Y = Test Score, and Bubble Area = Attendance %, what does a LARGE bubble in the TOP-RIGHT corner represent?',
              clue: 'Top = high Y; Right = high X; Large = high Attendance.',
              options: [
                'High study hours, high test score, and high attendance',
                'Low study hours, high test score, and low attendance',
                'High study hours, low test score, and high attendance',
                'Average performance across all three variables',
              ],
              correctIndex: 0,
              explanation: 'Top-right means high X and high Y, and a large bubble indicates high attendance %.',
            },
            {
              prompt: 'Why can a bar chart whose vertical axis starts at 95 instead of 0 be misleading?',
              clue: 'A bar for 98 is 3 units tall while a bar for 96 is 1 unit tall.',
              options: [
                'It visually exaggerates small differences by making 98 look 3 times as tall as 96',
                'It makes the mean equal to the median',
                'It hides the horizontal categories',
                'It converts a bar graph into a pie chart',
              ],
              correctIndex: 0,
              explanation: 'Truncating the baseline at 95 makes a tiny 2% difference look like a 300% ratio in bar heights.',
            },
            {
              prompt: 'On a 100% stacked bar chart comparing grain consumption across states, what must all the colored segments in any single state’s bar add up to?',
              clue: 'It is a 100% stacked bar!',
              options: ['100%', '360°', '24 hours', 'The state population'],
              correctIndex: 0,
              explanation: 'Each bar in a 100% stacked bar chart partitions that state’s total consumption into percentages summing to 100%.',
            },
          ],
        },
      },
      {
        id: 'p2-mod-5-8',
        moduleCode: 'Module 5.8',
        shortNumber: '5.8',
        title: 'Chapter Assessment & Questionnaire',
        cardHeadline: 'National Census Bureau & Climate Visualizer Capstone',
        cardTeaser:
          'Synthesize dot-plot balance means, outlier-resistant medians, frequency tables, spreadsheets, and line graphs in the Census Bureau Challenge and Climate Lab.',
        isWrapUpModule: true,
        artworkTheme: 'master-boss',
        videoCue: {
          title: '3-Minute Chapter 5 Synthesis: Mean, Median, Spreadsheets & Visual Storytelling',
          duration: '3:00',
          durationSeconds: 180,
          summary:
            'Review every statistical concept from Tales by Dots and Lines before launching the National Census Data Bureau Big Game and 20-Question Assessment.',
          readingParagraphs: [
            'Statistics turns raw numbers into clear stories: the Mean balances deviations (∑x_i / n), the Median anchors the middle sorted position against outliers, Spreadsheets automate large tables (=SUM, =AVERAGE), and Line Graphs reveal trends over time.',
            'Launch the Interactive Climate & Weather Data Visualizer Lab and National Census Data Bureau Challenge below, then complete the randomized Chapter 5 Exam!',
          ],
          keyTakeaways: [
            'Mean = ∑x_i / n (or ∑fx / ∑f for frequency tables); balances left and right deviations.',
            'Median = middle sorted value; unaffected by extreme outliers.',
            'Spreadsheets use =SUM(A1:A10) and =AVERAGE(A1:A10); Line graphs show rates of change via slope.',
          ],
          workedExample: {
            problem: 'Five cities recorded rainfall (in mm): 40, 45, 50, 55, 110. Find both the Mean and the Median, and state which is lower.',
            steps: [
              'Data is already sorted: {40, 45, 50, 55, 110}. The middle (3rd) value is Median = 50 mm.',
              'Mean = (40 + 45 + 50 + 55 + 110) ÷ 5 = 300 ÷ 5 = 60 mm.',
              'The Median (50 mm) is lower because the outlier 110 mm pulls the Mean up to 60 mm.',
            ],
            answer: 'Median = 50 mm · Mean = 60 mm',
          },
          scenes: [
            {
              sceneNumber: 1,
              timeRange: '0:00 – 1:00',
              title: 'Complete Statistical Toolkit Recap',
              narration:
                'Combine dot-plot balance intuition, median sorting, frequency weighting, and spreadsheet automation.',
              boardFormula: 'x̄ = ∑fx / ∑f · Median = Middle Sorted · =AVERAGE(B2:B50)',
              visualCaption: 'Dashboard connecting Dot Plot, Frequency Table, Spreadsheet, and Line Graph',
            },
            {
              sceneNumber: 2,
              timeRange: '1:00 – 2:00',
              title: 'Extracting Insights from Multi-City Climate Curves',
              narration:
                'Compare seasonal peaks, average annual rainfall, and temperature ranges across cities on a unified chart.',
              boardFormula: 'Range = Max − Min · Steepest Slope = Fastest Seasonal Shift',
              visualCaption: 'Dual climate curves comparing coastal vs inland temperature trends',
            },
            {
              sceneNumber: 3,
              timeRange: '2:00 – 3:00',
              title: 'National Census Bureau & 20-Question Exam Ready',
              narration:
                'Step into the Chief Data Scientist role in the Capstone Challenge and ace the Chapter 5 Assessment!',
              boardFormula: 'Chapter 5 Mastery Seal Unlocked',
              visualCaption: 'Golden Data Scientist Emblem illuminating on the board',
            },
          ],
        },
        simulation: {
          title: 'Interactive Climate & Weather Data Visualizer Lab (Big Simulation)',
          isBigSimulation: true,
          description:
            'Plot and compare multi-city rainfall and temperature trends, means, medians, and outlier shifts.',
          interactionType: 'grand-capstone-sim',
          defaultControlA: 50,
          defaultControlB: 95,
          controlALabel: 'Baseline Monthly Rainfall (mm)',
          controlAMin: 10,
          controlAMax: 100,
          controlBLabel: 'Monsoon Peak Rainfall (mm)',
          controlBMin: 40,
          controlBMax: 250,
          formulaHighlight: 'Mean = ∑fx / ∑f · Median = Middle Sorted · Slope = Δy / Δt',
        },
        game: {
          title: 'The National Census Data Bureau Challenge (Big Game)',
          isBigGame: true,
          subtitle: 'Clean, analyze, and present demographic datasets using spreadsheets, means, and line graphs!',
          rules: 'Complete all three Chief Data Analyst missions.',
          challenges: [
            {
              prompt: 'Mission 1 (Outlier Audit): Five towns have populations (in thousands) of 18, 20, 22, 25, and 115. Which measure better represents the typical town among the first four, and what is its value?',
              clue: 'The 115k metropolis is an extreme outlier!',
              options: [
                'Median = 22 thousand (Mean is pulled up to 40 thousand)',
                'Mean = 40 thousand',
                'Median = 40 thousand',
                'Mean = 22 thousand',
              ],
              correctIndex: 0,
              explanation: 'The middle (3rd) sorted value is Median = 22k, whereas the outlier 115k pulls the Mean to 200/5 = 40k.',
            },
            {
              prompt: 'Mission 2 (Spreadsheet Correction): In a spreadsheet of 10 districts with =AVERAGE(B2:B11) showing 65, cell B5 was typed as 90 instead of 40. What will the average show after you fix B5 to 40?',
              clue: 'Total sum drops by 50 across 10 districts (50 ÷ 10 = 5).',
              options: ['60', '62', '55', '64'],
              correctIndex: 0,
              explanation: 'Old sum = 650; new sum = 650 − 50 = 600 ⇒ new average = 600 ÷ 10 = 60.',
            },
            {
              prompt: 'Mission 3 (Weighted Survey): In a literacy survey, District X (100 villages) has mean literacy 72%, and District Y (300 villages) has mean literacy 84%. What is the combined mean literacy across all 400 villages?',
              clue: '(1 × 72 + 3 × 84) ÷ 4.',
              options: ['81%', '78%', '80%', '82%'],
              correctIndex: 0,
              explanation: '(100×72 + 300×84) ÷ 400 = (72 + 252) ÷ 4 = 324 ÷ 4 = 81%.',
            },
          ],
        },
      },
    ],
    questionnaire: [
      {
        id: 'p2-ch5-q1',
        questionNumber: 1,
        type: 'mcq',
        prompt: 'What is the arithmetic mean of the dataset {14, 18, 22, 26, 30}?',
        options: ['22', '20', '24', '21'],
        correctIndex: 0,
        explanation: 'Sum = 110; 110 ÷ 5 = 22 (for equally spaced numbers, mean = middle number!).',
        moduleRef: 'Module 5.1',
      },
      {
        id: 'p2-ch5-q2',
        questionNumber: 2,
        type: 'mcq',
        prompt: 'If the mean of 6 observations is 15, what is the sum of all 6 observations?',
        options: ['90', '75', '84', '96'],
        correctIndex: 0,
        explanation: 'Sum = n × Mean = 6 × 15 = 90.',
        moduleRef: 'Module 5.1',
      },
      {
        id: 'p2-ch5-q3',
        questionNumber: 3,
        type: 'mcq',
        prompt: 'Find the median of the unsorted values: 12, 7, 19, 9, 15, 11:',
        options: ['11.5', '14', '12', '11'],
        correctIndex: 0,
        explanation: 'Sorted: 7, 9, 11, 12, 15, 19. Average of 3rd (11) and 4th (12) is 11.5.',
        moduleRef: 'Module 5.2',
      },
      {
        id: 'p2-ch5-q4',
        questionNumber: 4,
        type: 'mcq',
        prompt: 'If every number in a dataset with mean 24 is decreased by 6, what is the new mean?',
        options: ['18', '24', '30', '4'],
        correctIndex: 0,
        explanation: 'Shifting every observation by −6 shifts the mean by −6: 24 − 6 = 18.',
        moduleRef: 'Module 5.3',
      },
      {
        id: 'p2-ch5-q5',
        questionNumber: 5,
        type: 'mcq',
        prompt: 'In a frequency table, 5 students scored 10 marks and 15 students scored 14 marks. What is the mean score of all 20 students?',
        options: ['13 marks', '12 marks', '12.5 marks', '13.5 marks'],
        correctIndex: 0,
        explanation: '(5×10 + 15×14) ÷ 20 = (50 + 210) ÷ 20 = 260 ÷ 20 = 13 marks.',
        moduleRef: 'Module 5.4',
      },
      {
        id: 'p2-ch5-q6',
        questionNumber: 6,
        type: 'mcq',
        prompt: 'Which symbol must every formula in a digital spreadsheet begin with?',
        options: ['=', '#', '@', ':'],
        correctIndex: 0,
        explanation: 'All spreadsheet formulas begin with an equals sign (=), such as =SUM(A1:A5).',
        moduleRef: 'Module 5.5',
      },
      {
        id: 'p2-ch5-q7',
        questionNumber: 7,
        type: 'mcq',
        prompt: 'Which spreadsheet formula adds all numbers in Column B from Row 2 to Row 15?',
        options: ['=SUM(B2:B15)', '=ADD(2B:15B)', '=TOTAL(B2-B15)', 'SUM(B2:B15)'],
        correctIndex: 0,
        explanation: '=SUM(B2:B15) sums the contiguous cell range from B2 through B15.',
        moduleRef: 'Module 5.5',
      },
      {
        id: 'p2-ch5-q8',
        questionNumber: 8,
        type: 'mcq',
        prompt: 'Which graph type is best suited for showing a patient’s body temperature recorded every 2 hours over 3 days?',
        options: ['Line graph', 'Pie chart', 'Pictograph', 'Venn diagram'],
        correctIndex: 0,
        explanation: 'A line graph best displays continuous trends and rates of change over time.',
        moduleRef: 'Module 5.6',
      },
      {
        id: 'p2-ch5-q9',
        questionNumber: 9,
        type: 'mcq',
        prompt: 'On a 24-hour time-use strip, a student spends 6 hours at school. What fraction and percentage of the strip is the School segment?',
        options: ['1/4 and 25%', '1/3 and 33.33%', '1/6 and 16.67%', '1/5 and 20%'],
        correctIndex: 0,
        explanation: '6 hours / 24 hours = 1/4 = 25%.',
        moduleRef: 'Module 5.7',
      },
      {
        id: 'p2-ch5-q10',
        questionNumber: 10,
        type: 'mcq',
        prompt: 'For the dataset {5, 7, 8, 12}, the mean is 8. What is the sum of all signed deviations (x_i − 8)?',
        options: ['0', '8', '4', '−2'],
        correctIndex: 0,
        explanation: '(5−8) + (7−8) + (8−8) + (12−8) = −3 − 1 + 0 + 4 = 0 (always zero around the mean!).',
        moduleRef: 'Module 5.1',
      },
    ],
  },
];
