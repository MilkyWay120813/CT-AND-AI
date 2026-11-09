import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  BookOpen,
  Layers,
  Sparkles,
  FileText,
  GraduationCap,
  Compass,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  ChapterId,
  DifficultyFocus,
  GanitaChapter,
  StudentDiagnosticProfile,
} from '../types/math';
import { ChalkDustOverlay } from './ChalkDustOverlay';

interface DiagnosticQuestionnaireProps {
  chapters: GanitaChapter[];
  initialProfile?: StudentDiagnosticProfile | null;
  initialStage?: 'welcome' | 'chapters' | 'segments';
  onComplete: (profile: StudentDiagnosticProfile) => void;
  onClose?: () => void;
}

interface StruggleSymptom {
  id: string;
  question: string;
  example: string;
  chapterId: ChapterId;
  segmentIndex: number;
  recommendedFocus: DifficultyFocus;
}

const STRUGGLE_SYMPTOMS: StruggleSymptom[] = [
  {
    id: 'sym-1',
    question:
      'Finding square roots or cube roots using prime factorization, or why perfect squares have an odd number of factors.',
    example: 'Why do only square lockers stay open? How do I find √15625 or ∛1729?',
    chapterId: 'ch1-square-cube',
    segmentIndex: 1,
    recommendedFocus: 'steps',
  },
  {
    id: 'sym-2',
    question:
      'Simplifying expressions with negative exponents, powers of powers, or huge scientific notation numbers.',
    example: 'Why is 3⁻² = 1/9 instead of -9? How thick is a paper folded 46 times?',
    chapterId: 'ch2-power-play',
    segmentIndex: 1,
    recommendedFocus: 'intuition',
  },
  {
    id: 'sym-3',
    question:
      'Understanding ancient number systems (Roman, Egyptian, Babylonian Base-60, Mayan Base-20) and why zero changed mathematics.',
    example: 'How do you convert 143 into a Base-5 system or read Babylonian 60s?',
    chapterId: 'ch3-story-numbers',
    segmentIndex: 2,
    recommendedFocus: 'intuition',
  },
  {
    id: 'sym-4',
    question:
      'Proving why a carpenter’s bisecting diagonal strips make a rectangle or square, or finding angles in parallelograms and rhombuses.',
    example: 'Why do (90° - x/2) and x/2 always add up to 90° at every rectangle corner?',
    chapterId: 'ch4-quadrilaterals',
    segmentIndex: 0,
    recommendedFocus: 'intuition',
  },
  {
    id: 'sym-5',
    question:
      'Proving divisibility shortcuts for 9, 3, and 11 using place value, parity of ±a ± b ± c ± d, or cracking letter-digit cryptarithms.',
    example: 'Why does alternating sum test divisibility by 11? How does EF × E = GGG become 37 × 3 = 111?',
    chapterId: 'ch5-number-play',
    segmentIndex: 1,
    recommendedFocus: 'steps',
  },
  {
    id: 'sym-6',
    question:
      'Expanding brackets with (a + m)(b + n), remembering the +2ab middle term in (a + b)², or using Śrīdharāchārya’s mental squaring rule.',
    example: 'How do I mentally compute 98² = 100 × 96 + 4 = 9,604 or prove (k+1)² - 1 = k(k+2)?',
    chapterId: 'ch6-we-distribute',
    segmentIndex: 1,
    recommendedFocus: 'intuition',
  },
  {
    id: 'sym-7',
    question:
      'Keeping image aspect ratios proportional via HCF, Āryabhaṭa’s Trairāśika (Rule of Three), or splitting a total in ratio m : n.',
    example: 'Why is 60:40 proportional to 90:60 (3:2) instead of 70:50?',
    chapterId: 'ch7-proportional-1',
    segmentIndex: 0,
    recommendedFocus: 'word-problems',
  },
  {
    id: 'sym-8',
    question:
      'Solving tricky percentage problems: successive discounts, markup vs discount traps, GST, and Simple vs Compound Interest.',
    example: 'Why does +50% markup followed by 50% discount cause a 25% loss?',
    chapterId: 'ch4-fractions-disguise',
    segmentIndex: 1,
    recommendedFocus: 'word-problems',
  },
  {
    id: 'sym-9',
    question:
      'Applying the Baudhāyana-Pythagoras Theorem (a² + b² = c²) to diagonals, rhombuses, and Bhāskarāchārya’s swaying lotus puzzle.',
    example: 'A lotus 3 units above water touches water 9 units away—how deep is the lake?',
    chapterId: 'ch5-baudhayana-pythagoras',
    segmentIndex: 2,
    recommendedFocus: 'word-problems',
  },
  {
    id: 'sym-10',
    question:
      'Combining multi-term ratios (A:B and B:C), dividing totals into pie charts, or telling Direct vs Inverse Proportions apart.',
    example: 'If 6 workers take 15 days, why do 10 workers take 9 days instead of 25?',
    chapterId: 'ch6-proportional-reasoning',
    segmentIndex: 2,
    recommendedFocus: 'steps',
  },
  {
    id: 'sym-11',
    question:
      'Counting squares and holes in self-similar fractals (Sierpinski Carpet 8ⁿ, Koch Snowflake), or unfolding a cuboid net for the shortest path.',
    example: 'How does unfolding a 30×12×12 cm cuboid let the hungry ant reach the laddu in 40 cm?',
    chapterId: 'ch11-geometric-themes',
    segmentIndex: 1,
    recommendedFocus: 'intuition',
  },
  {
    id: 'sym-12',
    question:
      'Using the Mean as a seesaw balance point (∑d_LHS = ∑d_RHS), finding Medians from frequency tables, or reading monsoon line graphs.',
    example: 'How do distances from the 55 kg mean immediately reveal the 6th wrestler’s 59 kg weight?',
    chapterId: 'ch12-dots-and-lines',
    segmentIndex: 0,
    recommendedFocus: 'intuition',
  },
  {
    id: 'sym-13',
    question:
      'Decoding Shubham’s 100M + 165 + D birthday trick, solving Number Pyramids (a + 2b + c), or cracking Karim and the Banyan Tree Genie (8x - 56 = 0).',
    example: 'Why does the middle base number count twice (2b) at the top of a 3-row pyramid?',
    chapterId: 'ch13-algebra-play',
    segmentIndex: 1,
    recommendedFocus: 'word-problems',
  },
  {
    id: 'sym-14',
    question:
      'Cutting and sliding shapes to prove the area of a triangle (½bh), parallelogram (bh), rhombus (½d₁d₂), or trapezium (½h(a+b)).',
    example: 'How do two identical trapeziums snap together to prove Area = ½h(a + b)?',
    chapterId: 'ch14-area',
    segmentIndex: 1,
    recommendedFocus: 'intuition',
  },
];

export const DiagnosticQuestionnaire: React.FC<DiagnosticQuestionnaireProps> = ({
  chapters,
  initialProfile,
  initialStage = 'welcome',
  onComplete,
  onClose,
}) => {
  const [stage, setStage] = useState<'welcome' | 'chapters' | 'segments' | 'symptoms'>(
    initialStage
  );
  const [selectedChapterId, setSelectedChapterId] = useState<ChapterId>(
    initialProfile?.chapterId || chapters[0].id
  );
  const [partFilter, setPartFilter] = useState<'all' | 'Part I' | 'Part II'>('all');

  const activeChapter =
    chapters.find((c) => c.id === selectedChapterId) || chapters[0];

  const [selectedSegmentId, setSelectedSegmentId] = useState<string>(
    initialProfile?.segmentId || activeChapter.segments[0].id
  );
  const [difficultyFocus, setDifficultyFocus] = useState<DifficultyFocus>(
    initialProfile?.difficultyFocus || 'intuition'
  );

  const visibleChapters = useMemo(() => {
    if (partFilter === 'all') return chapters;
    return chapters.filter((ch) => ch.partLabel === partFilter);
  }, [chapters, partFilter]);

  // Always scroll to the very top whenever stage or chapter changes so everything opens from the top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage, selectedChapterId]);

  const handleChooseChapterCard = (chapter: GanitaChapter) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onComplete({
      completedQuestionnaire: true,
      chapterId: chapter.id,
      segmentId: chapter.segments[0].id,
      difficultyFocus,
    });
  };

  const handleLaunchLesson = (segmentIdOverride?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onComplete({
      completedQuestionnaire: true,
      chapterId: selectedChapterId,
      segmentId: segmentIdOverride || selectedSegmentId,
      difficultyFocus,
    });
  };

  const handleSymptomSelect = (sym: StruggleSymptom) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const targetChapter =
      chapters.find((c) => c.id === sym.chapterId) || chapters[0];
    const targetSeg =
      targetChapter.segments[sym.segmentIndex] || targetChapter.segments[0];
    onComplete({
      completedQuestionnaire: true,
      chapterId: targetChapter.id,
      segmentId: targetSeg.id,
      difficultyFocus: sym.recommendedFocus,
    });
  };

  // STAGE 1: SPACIOUS CLASSROOM CHALKBOARD WELCOME SCREEN (OPENS FROM TOP)
  if (stage === 'welcome') {
    return (
      <div key="stage-welcome" className="open-from-top max-w-5xl mx-auto pt-2 pb-8 space-y-8">
        <ChalkDustOverlay triggerKey={`welcome-${difficultyFocus}`} />
        <div className="chalkboard-frame chalkboard-grid bg-[#194530] rounded-3xl overflow-hidden text-[#F9F8F3]">
          <div className="px-6 py-10 sm:px-14 sm:py-12 space-y-9 relative">
            {/* Floating Animated Curiosity Chalk Doodles on the Board */}
            <div className="hidden lg:flex flex-col items-end gap-2.5 absolute right-10 top-24 pointer-events-none select-none opacity-85">
              {[
                { formula: '1729 = 12³ + 1³ = 10³ + 9³', color: '#FDE047', delay: 0 },
                { formula: 'a² + b² = c² · √(24² + 32²) = 40', color: '#93C5FD', delay: 0.4 },
                { formula: '100M + D + 165 · Top = a + 2b + c', color: '#FCA5A5', delay: 0.8 },
                { formula: 'Area = ½h(a + b) · 8ⁿ Fractals', color: '#86EFAC', delay: 1.2 },
              ].map((doodle, idx) => (
                <motion.div
                  key={doodle.formula}
                  animate={{
                    y: [0, -5, 0],
                    rotate: [idx % 2 === 0 ? -1.5 : 1.5, idx % 2 === 0 ? 1.5 : -1.5, idx % 2 === 0 ? -1.5 : 1.5],
                  }}
                  transition={{
                    duration: 3.6 + idx * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: doodle.delay,
                  }}
                  className="px-3 py-1 rounded-xl bg-white/5 border border-white/15 font-mono text-xs"
                  style={{ color: doodle.color }}
                >
                  {doodle.formula}
                </motion.div>
              ))}
            </div>

            {/* Top Chalkboard Header Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
              <div className="flex items-center gap-2.5 text-sm font-mono text-[#FDE68A] tracking-wider uppercase">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <GraduationCap className="w-5 h-5" />
                </motion.div>
                <span>Room 8-A · NCERT Ganita Prakash Class 8 Complete Classroom (All 14 Chapters)</span>
              </div>
              <div className="font-mono text-sm text-emerald-200/90 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#FDE047] animate-spin" style={{ animationDuration: '12s' }} />
                <span>Part I (Ch 1–7) &amp; Part II (Ch 1–7) · 42 Interactive Lessons</span>
              </div>
            </div>

            {/* Grand Classroom Chalk Title */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="space-y-4 max-w-2xl"
            >
              <h1 className="font-chalk-title text-3xl sm:text-5xl text-white leading-[1.18]">
                Welcome to the Class 8{' '}
                <span className="text-[#FDE047] underline decoration-wavy decoration-[#FDE047]/60 underline-offset-8">
                  Ganita Prakash
                </span>{' '}
                Classroom
              </h1>
              <p className="text-base sm:text-lg text-emerald-100/95 leading-relaxed">
                Pull up a chair at the front desk! Explore all <strong>14 chapters</strong> of NCERT Class 8 <em>Ganita Prakash</em> (Part I &amp; Part II)—from square lockers, quadrilaterals, number play, and Brahmagupta’s algebra to fractals, mean seesaws, number pyramids, and Śulba-Sūtra area dissections.
              </p>
            </motion.div>

            {/* Quick Pre-Class Question: Preferred Teaching Style */}
            <div className="bg-black/20 border border-white/15 rounded-2xl p-6 sm:p-7 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-display text-lg font-bold text-[#FEF08A]">
                  How would you like today’s chalkboard lesson taught?
                </span>
                <span className="text-xs font-mono text-emerald-200/85">
                  Pick your style &amp; click Proceed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'intuition' as DifficultyFocus,
                    title: 'Visual Chalkboard Models',
                    desc: 'Show me hands-on grids, shape dissections, and interactive sliders first.',
                    icon: Sparkles,
                  },
                  {
                    id: 'steps' as DifficultyFocus,
                    title: 'Step-by-Step Board Work',
                    desc: 'Walk me through every equation line-by-line with zero skipped steps.',
                    icon: Layers,
                  },
                  {
                    id: 'word-problems' as DifficultyFocus,
                    title: 'Tricky Textbook Puzzles',
                    desc: 'Help me decode word problems, historical gems, and practice twins.',
                    icon: BookOpen,
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = difficultyFocus === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      initial={{ opacity: 0, y: -14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      whileHover={{ y: -4, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDifficultyFocus(item.id)}
                      className={`text-left p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'bg-white/15 border-[#FDE047] shadow-sm'
                          : 'bg-white/5 border-white/15 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-base text-white flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#FDE047]" />
                          {item.title}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#FDE047] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
                        {item.desc}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Primary Proceed Button Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div className="flex flex-wrap items-center gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStage('chapters')}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#FDE047] hover:bg-[#FACC15] text-[#142E21] font-display font-bold text-lg shadow-md transition-colors cursor-pointer"
                >
                  <span>Proceed to All 14 Textbook Chapters</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStage('symptoms')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border border-white/25 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-[#FDE047]" />
                  <span>Not sure which chapter? Match my struggle</span>
                </motion.button>
              </div>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm font-mono text-[#FDE047] hover:text-white underline underline-offset-4 cursor-pointer self-start sm:self-center"
                >
                  Return to current lesson →
                </button>
              )}
            </div>
          </div>

          {/* Decorative Classroom Wooden Chalk Ledge with Animated Chalk Sticks & Duster */}
          <div className="bg-[#6E4423] border-t-4 border-[#9C663B] px-8 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {[
                { w: 'w-10', bg: 'bg-[#F9F8F3]', label: 'White Chalk' },
                { w: 'w-8', bg: 'bg-[#FDE047]', label: 'Yellow Chalk' },
                { w: 'w-9', bg: 'bg-[#93C5FD]', label: 'Blue Chalk' },
                { w: 'w-7', bg: 'bg-[#FCA5A5]', label: 'Coral Chalk' },
              ].map((chalk) => (
                <motion.div
                  key={chalk.label}
                  whileHover={{ y: -4, rotate: -6, scale: 1.12 }}
                  className={`${chalk.w} h-2.5 rounded-xs ${chalk.bg} shadow-xs`}
                  title={chalk.label}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ x: [0, -8, 8, 0] }}
                className="w-14 h-3.5 rounded-xs bg-[#3F2714] border-b-2 border-[#D6D3D1]"
                title="Chalkboard Duster"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STAGE 2: CLEAN, UNCRAMPED 14-CHAPTER SELECTION BOARD WITH PART I / PART II FILTER TABS
  if (stage === 'chapters') {
    return (
      <div key="stage-chapters" className="open-from-top max-w-6xl mx-auto pt-2 pb-8 space-y-8">
        <ChalkDustOverlay triggerKey={`chapters-${partFilter}-${selectedChapterId}`} />
        {/* Top Chalkboard Banner */}
        <div className="chalkboard-frame chalkboard-grid bg-[#194530] rounded-2xl px-6 py-6 sm:px-10 sm:py-8 text-white space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setStage('welcome')}
                className="inline-flex items-center gap-1.5 text-sm font-mono text-[#FDE047] hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Classroom Welcome Chalkboard</span>
              </button>
              <h2 className="font-chalk-title text-2xl sm:text-4xl text-white">
                Select Your Ganita Prakash Class 8 Chapter
              </h2>
              <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl">
                Choose any of the 14 textbook chapters across Part I (Chapters 1–7) and Part II (Chapters 1–7) to open its 3 core concept segments on the chalkboard.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-center">
              <button
                type="button"
                onClick={() => setStage('symptoms')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-xs sm:text-sm font-semibold text-[#FDE047] transition-all cursor-pointer"
              >
                Match by Struggle Question Instead
              </button>
            </div>
          </div>

          {/* Part I / Part II Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-white/15">
            <span className="text-xs font-mono text-emerald-200 mr-1">Filter Textbook Volume:</span>
            {[
              { id: 'all' as const, label: 'All 14 Chapters (Part I & II)' },
              { id: 'Part I' as const, label: 'Part I Only (Chapters 1–7)' },
              { id: 'Part II' as const, label: 'Part II Only (Chapters 1–7)' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPartFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                  partFilter === tab.id
                    ? 'bg-[#FDE047] text-[#142E21] shadow-xs'
                    : 'bg-black/25 text-white border border-white/20 hover:bg-white/10'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Clean 14-Chapter Classroom Desk Cards Grid with Staggered Curiosity Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleChapters.map((chapter, index) => {
            const isSelected = chapter.id === selectedChapterId;
            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.32,
                  delay: Math.min(index * 0.04, 0.36),
                }}
                whileHover={{ y: -6, scale: 1.01 }}
                onClick={() => handleChooseChapterCard(chapter)}
                className={`desk-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-6 transition-colors cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#194530] border-[#194530]'
                    : 'hover:border-[#8D5B34]'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Meta Row */}
                  <div className="flex items-center justify-between text-xs font-mono text-[#78716C]">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FAF6EE] border border-[#E5DEC9] font-bold text-[#194530]">
                      {chapter.partLabel} · Chapter {chapter.chapterNumber}
                    </span>
                    <span className="font-bold text-[#8D5B34]">
                      3 Core Segments
                    </span>
                  </div>

                  {/* Chapter Title & Hook */}
                  <div className="space-y-1.5">
                    <h3 className="font-display text-2xl font-bold text-[#1C1917] leading-snug">
                      {chapter.title}
                    </h3>
                    <p className="text-xs font-mono text-[#8D5B34] font-semibold">
                      {chapter.sanskritOrHistoricalHook}
                    </p>
                  </div>

                  {/* Spacious Summary */}
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    {chapter.summary}
                  </p>

                  {/* Preview of the 3 Core Segments */}
                  <div className="bg-[#FAF6EE] border border-[#E5DEC9] rounded-xl p-3.5 space-y-1.5">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#78716C] font-semibold">
                      3 Core Concept Segments Inside:
                    </div>
                    {chapter.segments.map((seg) => (
                      <div
                        key={seg.id}
                        className="text-xs text-[#292524] flex items-center gap-2 truncate"
                      >
                        <span className="font-mono text-xs font-bold text-[#194530]">
                          {seg.segmentCode.replace('Segment ', '')}
                        </span>
                        <span className="truncate">{seg.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-[#EFECE2] flex items-center justify-between gap-3">
                  <a
                    href={chapter.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#78716C] hover:text-[#1C1917]"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Textbook PDF</span>
                  </a>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChooseChapterCard(chapter);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#194530] hover:bg-[#143826] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <span>Select Chapter</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // STAGE 3: FOCUSED 3-SEGMENT LESSON PICKER FOR THE CHOSEN CHAPTER (OPENS FROM TOP)
  if (stage === 'segments') {
    return (
      <div key="stage-segments" className="open-from-top max-w-5xl mx-auto pt-2 pb-8 space-y-8">
        <ChalkDustOverlay triggerKey={`segments-${selectedChapterId}-${selectedSegmentId}`} />
        {/* Chapter Chalkboard Header */}
        <div className="chalkboard-frame chalkboard-grid bg-[#194530] rounded-2xl px-6 py-7 sm:px-10 sm:py-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setStage('chapters')}
                className="inline-flex items-center gap-1.5 text-sm font-mono text-[#FDE047] hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All 14 Chapters</span>
              </button>
              <div className="text-xs sm:text-sm font-mono text-emerald-200">
                {activeChapter.partLabel} · Chapter {activeChapter.chapterNumber} ·{' '}
                {activeChapter.sanskritOrHistoricalHook}
              </div>
              <h2 className="font-chalk-title text-2xl sm:text-4xl text-white">
                {activeChapter.title}: Choose Your Lesson Segment
              </h2>
              <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl">
                We have divided this chapter into 3 focused classroom periods. Click any segment to open its interactive blackboard &amp; step-by-step walkthrough.
              </p>
            </div>

            <a
              href={activeChapter.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-semibold text-white self-start md:self-center"
            >
              <FileText className="w-4 h-4 text-[#FDE047]" />
              <span>Open Chapter PDF</span>
            </a>
          </div>
        </div>

        {/* 3 Spacious Lesson Period Cards with Spring Entrance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {activeChapter.segments.map((seg, idx) => {
            const isSelected = seg.id === selectedSegmentId;
            const primaryFormula = seg.keyFormulas[0];
            return (
              <motion.div
                key={seg.id}
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                onClick={() => handleLaunchLesson(seg.id)}
                className={`desk-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-6 transition-colors cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#194530] border-[#194530]'
                    : 'hover:border-[#8D5B34]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#194530]">
                      Period 0{idx + 1} · {seg.segmentCode}
                    </span>
                    {isSelected && (
                      <span className="text-[#15803D] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Ready
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold text-[#1C1917] leading-snug">
                      {seg.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                      {seg.subtitle}
                    </p>
                  </div>

                  {primaryFormula && (
                    <div className="bg-[#194530] text-white p-3.5 rounded-xl font-mono">
                      <div className="text-[11px] uppercase tracking-wider text-[#FDE047]">
                        Chalkboard Formula · {primaryFormula.label}
                      </div>
                      <div className="text-sm font-semibold mt-1">
                        {primaryFormula.formula}
                      </div>
                    </div>
                  )}

                  <div className="bg-[#FEF3C7]/60 border border-[#FDE68A] rounded-xl p-3.5 text-xs text-[#78350F] space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>Homework Hurdle Fixed:</span>
                    </div>
                    <p className="leading-relaxed">{seg.commonStruggle}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunchLesson(seg.id);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#194530] hover:bg-[#143826] text-white font-display font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Start This Classroom Lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // STAGE 4 (OPTIONAL): MATCH MY HOMEWORK STRUGGLE VIEW (ALL 14 CHAPTERS)
  return (
    <div key="stage-symptoms" className="open-from-top max-w-5xl mx-auto pt-2 pb-8 space-y-8">
      <ChalkDustOverlay triggerKey="symptoms-stage" />
      <div className="chalkboard-frame chalkboard-grid bg-[#194530] rounded-2xl px-6 py-7 sm:px-10 sm:py-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setStage('chapters')}
              className="inline-flex items-center gap-1.5 text-sm font-mono text-[#FDE047] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All 14 Chapters Board</span>
            </button>
            <h2 className="font-chalk-title text-2xl sm:text-4xl text-white">
              Match Your Homework Question to a Chapter
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90">
              Click the homework hurdle below that looks closest to your worksheet problem across all 14 chapters.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STRUGGLE_SYMPTOMS.map((sym, idx) => {
          const ch = chapters.find((c) => c.id === sym.chapterId);
          const seg = ch?.segments[sym.segmentIndex] || ch?.segments[0];
          return (
            <motion.button
              key={sym.id}
              type="button"
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.35) }}
              whileHover={{ y: -4, scale: 1.01 }}
              onClick={() => handleSymptomSelect(sym)}
              className="desk-card text-left p-6 rounded-2xl hover:border-[#194530] transition-colors group flex flex-col justify-between gap-5 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#78716C]">
                  <span>
                    {ch?.partLabel} · Ch {ch?.chapterNumber}: {ch?.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#194530] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-base font-bold text-[#1C1917] leading-snug">
                  “{sym.question}”
                </p>
                <p className="text-xs font-mono text-[#194530] bg-[#FAF6EE] px-3.5 py-2.5 rounded-xl border border-[#E5DEC9]">
                  Example: {sym.example}
                </p>
              </div>
              <div className="pt-3 border-t border-[#EFECE2] flex items-center justify-between text-xs">
                <span className="text-[#57534E] font-medium">
                  Opens {seg?.segmentCode}: {seg?.title}
                </span>
                <span className="font-bold text-[#194530]">
                  Open Lesson →
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
