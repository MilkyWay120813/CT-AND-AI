import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ArrowLeft,
  Award,
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { GanitaChapter } from '../types/math';
import { QuizAttemptRecord, QuizKind } from '../types/account';
import {
  buildChapterImprovementData,
  buildQuizStatsGist,
  buildScoreTrendSeries,
  ChapterImprovementStat,
} from '../utils/quizAnalytics';

interface AccountQuizAnalyticsViewProps {
  quizHistory: QuizAttemptRecord[];
  chapters: GanitaChapter[];
  onPracticeChapter?: (chapterId: string) => void;
}

const QUIZ_KIND_LABELS: Record<QuizKind, string> = {
  'module-recap': 'Module Recap',
  'chapter-quiz': 'Chapter Quiz',
  'grand-mastery': 'Grand Mastery (30Q)',
  'tricky-textbook': 'Tricky 20Q Puzzle',
  'boss-battle': 'Cellar Boss 3D',
};

export const AccountQuizAnalyticsView: React.FC<AccountQuizAnalyticsViewProps> = ({
  quizHistory,
  chapters,
  onPracticeChapter,
}) => {
  const [viewMode, setViewMode] = useState<'gist' | 'graphs'>('gist');
  const [selectedPointIdx, setSelectedPointIdx] = useState<number | null>(null);

  const gist = useMemo(
    () => buildQuizStatsGist(quizHistory, chapters),
    [quizHistory, chapters]
  );

  const chapterStats = useMemo(
    () => buildChapterImprovementData(quizHistory, chapters),
    [quizHistory, chapters]
  );

  const trendSeries = useMemo(
    () => buildScoreTrendSeries(quizHistory),
    [quizHistory]
  );

  if (quizHistory.length === 0) {
    return (
      <div
        data-testid="quiz-stats-empty"
        className="p-6 rounded-2xl bg-white border border-stone-200 text-center space-y-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#0F766E] flex items-center justify-center mx-auto">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h4 className="text-lg font-black text-stone-900">
            No Quiz Stats Recorded Yet
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Complete any <strong>Module Recap Quiz</strong>,{' '}
            <strong>Part I / II Grand Mastery Quiz</strong>,{' '}
            <strong>Tricky Textbook 20Q Puzzle</strong>, or{' '}
            <strong>Cellar Boss Battle</strong> while signed in to unlock your
            score gist, improvement radar, and chronological trend line graph.
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadgeClasses = (status: ChapterImprovementStat['status']) => {
    if (status === 'Mastered') {
      return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
    if (status === 'Improving') {
      return 'bg-amber-100 text-amber-900 border-amber-300';
    }
    return 'bg-rose-100 text-rose-900 border-rose-300';
  };

  const getBarFillClass = (status: ChapterImprovementStat['status']) => {
    if (status === 'Mastered') return 'bg-emerald-600';
    if (status === 'Improving') return 'bg-amber-500';
    return 'bg-rose-600';
  };

  // SVG Line Chart geometry (Responsive 640x230 coordinate space)
  const chartW = 640;
  const chartH = 230;
  const padLeft = 44;
  const padRight = 24;
  const padTop = 20;
  const padBottom = 34;
  const plotW = chartW - padLeft - padRight;
  const plotH = chartH - padTop - padBottom;

  const pointsCoords = trendSeries.map((pt, i) => {
    const x =
      trendSeries.length === 1
        ? padLeft + plotW / 2
        : padLeft + (i / (trendSeries.length - 1)) * plotW;
    const y = padTop + ((100 - pt.percentage) / 100) * plotH;
    return { ...pt, x, y };
  });

  const polylinePoints = pointsCoords.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath =
    pointsCoords.length >= 2
      ? `M ${pointsCoords[0].x.toFixed(1)},${(padTop + plotH).toFixed(1)} ` +
        pointsCoords.map((p) => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
        ` L ${pointsCoords[pointsCoords.length - 1].x.toFixed(1)},${(padTop + plotH).toFixed(1)} Z`
      : '';

  const activePoint =
    selectedPointIdx !== null && pointsCoords[selectedPointIdx]
      ? pointsCoords[selectedPointIdx]
      : pointsCoords[pointsCoords.length - 1];

  // =========================================================================
  // VIEW 2: FULL IMPROVEMENT BAR GRAPH + SCORE TREND LINE GRAPH
  // =========================================================================
  if (viewMode === 'graphs') {
    return (
      <div data-testid="quiz-stats-graphs" className="space-y-5">
        {/* Top Navigation Back to Gist */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <button
            type="button"
            data-testid="back-to-gist-btn"
            onClick={() => setViewMode('gist')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-black transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Quiz Gist</span>
          </button>

          <div className="text-xs font-bold text-stone-600 tabular-nums">
            {gist.totalAttempts} Completed Quizzes · Avg {gist.averagePercentage}%
          </div>
        </div>

        {/* GRAPH 1: WHERE YOU NEED TO IMPROVE (PER-CHAPTER BAR CHART) */}
        <section
          data-testid="improvement-bar-graph"
          aria-label="Where You Need to Improve by Chapter"
          className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h4 className="text-base font-black text-stone-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#0F766E]" />
                <span>Where You Need to Improve (Chapter Accuracy)</span>
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Sorted weakest-first so you immediately see which chapters need practice below the 70% mastery line.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-200">
                Needs Practice (&lt;70%)
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                Improving (70–84%)
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                Mastered (≥85%)
              </span>
            </div>
          </div>

          {chapterStats.length === 0 ? (
            <p className="text-xs text-stone-500 py-3">
              Chapter-level data will populate as soon as you complete a chapter quiz, module recap, or tricky textbook puzzle.
            </p>
          ) : (
            <div className="space-y-3 pt-1">
              {chapterStats.map((stat) => (
                <div
                  key={stat.chapterId}
                  className="p-3 rounded-xl bg-[#FAF6EE]/80 border border-stone-200 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-bold text-[#0F766E] shrink-0">
                        {stat.shortLabel}
                      </span>
                      <span className="font-bold text-stone-900 truncate">
                        {stat.chapterTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded border text-[11px] font-extrabold ${getStatusBadgeClasses(
                          stat.status
                        )}`}
                      >
                        {stat.status}
                      </span>
                      <span className="font-black text-stone-900 tabular-nums w-10 text-right">
                        {stat.accuracy}%
                      </span>
                      {stat.status === 'Needs Practice' && onPracticeChapter && (
                        <button
                          type="button"
                          onClick={() => onPracticeChapter(stat.chapterId)}
                          className="px-2.5 py-1 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-[11px] font-bold transition cursor-pointer"
                        >
                          Practice
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bar track with 70% mastery threshold marker */}
                  <div className="relative h-3.5 w-full rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getBarFillClass(
                        stat.status
                      )}`}
                      style={{ width: `${Math.max(4, stat.accuracy)}%` }}
                    />
                    <div
                      title="70% Target Threshold"
                      className="absolute top-0 bottom-0 w-0.5 bg-stone-900/60"
                      style={{ left: '70%' }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 tabular-nums">
                    <span>
                      {stat.attempts} quiz attempt{stat.attempts === 1 ? '' : 's'}
                    </span>
                    <span>70% target line</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* GRAPH 2: CHRONOLOGICAL SCORE TREND LINE GRAPH */}
        <section
          data-testid="score-line-graph"
          aria-label="Score Trend Line Graph"
          className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-base font-black text-stone-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#0F766E]" />
                <span>Score Trend Line Graph (Across All Quizzes)</span>
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Track how your percentage score evolves from quiz #{trendSeries[0]?.index} to #{trendSeries[trendSeries.length - 1]?.index}. Click any point to inspect details.
              </p>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full min-w-[440px] h-56 select-none"
              role="img"
              aria-label="Line graph of chronological quiz percentage scores"
            >
              <defs>
                <linearGradient id="scoreLineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F766E" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#0F766E" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Y-Axis Gridlines (0%, 25%, 50%, 75%, 100%) */}
              {[0, 25, 50, 75, 100].map((tick) => {
                const y = padTop + ((100 - tick) / 100) * plotH;
                const isTarget = tick === 75;
                return (
                  <g key={tick}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={chartW - padRight}
                      y2={y}
                      stroke={isTarget ? '#D97706' : '#E7E5E4'}
                      strokeDasharray={isTarget ? '4 4' : '2 3'}
                      strokeWidth={isTarget ? 1.5 : 1}
                    />
                    <text
                      x={padLeft - 8}
                      y={y + 4}
                      textAnchor="end"
                      fill="#57534E"
                      fontSize="11"
                      fontWeight="700"
                    >
                      {tick}%
                    </text>
                  </g>
                );
              })}

              {/* Shaded area under curve */}
              {areaPath && <path d={areaPath} fill="url(#scoreLineAreaGrad)" />}

              {/* Main score line */}
              {pointsCoords.length >= 2 && (
                <polyline
                  fill="none"
                  stroke="#14B8A6"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={polylinePoints}
                />
              )}

              {/* Data Nodes & X-Axis Labels */}
              {pointsCoords.map((pt, idx) => {
                const isSelected = activePoint?.index === pt.index;
                return (
                  <g
                    key={pt.index}
                    className="cursor-pointer"
                    onClick={() => setSelectedPointIdx(idx)}
                  >
                    <text
                      x={pt.x}
                      y={chartH - 10}
                      textAnchor="middle"
                      fill="#57534E"
                      fontSize="11"
                      fontWeight={isSelected ? '800' : '600'}
                    >
                      {pt.label}
                    </text>

                    {(pointsCoords.length <= 10 || isSelected) && (
                      <text
                        x={pt.x}
                        y={Math.max(12, pt.y - 11)}
                        textAnchor="middle"
                        fill="#0F766E"
                        fontSize="11"
                        fontWeight="800"
                      >
                        {pt.percentage}%
                      </text>
                    )}

                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 7 : 5}
                      fill={pt.passed ? '#0F766E' : '#E11D48'}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Attempt Inspector Bar */}
          {activePoint && (
            <div className="p-3 rounded-xl bg-[#FAF6EE] border border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="font-black text-stone-900">
                  Attempt {activePoint.label}: {activePoint.title}
                </div>
                <div className="text-stone-600">
                  {QUIZ_KIND_LABELS[activePoint.quizKind]} ·{' '}
                  {new Date(activePoint.timestamp).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2 tabular-nums">
                <span className="font-extrabold text-stone-800">
                  {activePoint.scoreText}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-lg font-black text-xs ${
                    activePoint.passed
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-rose-100 text-rose-900'
                  }`}
                >
                  {activePoint.percentage}% ({activePoint.passed ? 'Passed' : 'Review'})
                </span>
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: GIST SUMMARY VIEW (DEFAULT)
  // =========================================================================
  return (
    <div data-testid="quiz-stats-gist" className="space-y-5">
      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="text-[11px] uppercase font-bold text-stone-500">
            Quizzes Given
          </div>
          <div className="text-2xl font-black text-stone-900 tabular-nums mt-0.5">
            {gist.totalAttempts}
          </div>
          <div className="text-[11px] font-semibold text-[#0F766E] tabular-nums">
            {gist.passedCount} passed
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="text-[11px] uppercase font-bold text-stone-500">
            Average Score
          </div>
          <div className="text-2xl font-black text-[#0F766E] tabular-nums mt-0.5">
            {gist.averagePercentage}%
          </div>
          <div className="text-[11px] font-semibold text-stone-600 tabular-nums">
            {gist.recentTrendDelta !== null
              ? `${gist.recentTrendDelta >= 0 ? '+' : ''}${gist.recentTrendDelta}% vs prior`
              : 'Steady baseline'}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="text-[11px] uppercase font-bold text-stone-500">
            Best Score
          </div>
          <div className="text-2xl font-black text-amber-600 tabular-nums mt-0.5">
            {gist.bestPercentage}%
          </div>
          <div className="text-[11px] font-semibold text-stone-600">
            Personal high
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="text-[11px] uppercase font-bold text-stone-500">
            Top Focus Area
          </div>
          {gist.weakestChapter ? (
            <>
              <div className="text-sm font-black text-stone-900 mt-1 truncate">
                {gist.weakestChapter.shortLabel}
              </div>
              <div className="text-[11px] font-bold text-stone-700 tabular-nums">
                {gist.weakestChapter.accuracy}% · {gist.weakestChapter.status}
              </div>
            </>
          ) : (
            <div className="text-sm font-bold text-stone-600 mt-1">All Good</div>
          )}
        </div>
      </div>

      {/* Gist Callout + CTA Button to Open Full Improvement & Line Graph */}
      <div className="p-5 rounded-2xl bg-[#12352B] text-white border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#FDE047]">
            <Sparkles className="w-4 h-4" />
            <span>Performance Gist</span>
          </div>
          <p className="text-sm text-emerald-100 leading-relaxed">
            {gist.weakestChapter && gist.weakestChapter.status === 'Needs Practice' ? (
              <>
                You averaged <strong className="tabular-nums">{gist.averagePercentage}%</strong> across{' '}
                <strong className="tabular-nums">{gist.totalAttempts}</strong> quiz
                {gist.totalAttempts === 1 ? '' : 'zes'}. Focus next on{' '}
                <strong className="text-[#FDE047]">{gist.weakestChapter.chapterTitle}</strong> ({gist.weakestChapter.accuracy}%).
              </>
            ) : (
              <>
                Strong work! You are averaging{' '}
                <strong className="tabular-nums">{gist.averagePercentage}%</strong> across{' '}
                <strong className="tabular-nums">{gist.totalAttempts}</strong> completed quizzes.
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          data-testid="open-quiz-graphs-btn"
          onClick={() => setViewMode('graphs')}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FDE047] hover:bg-[#FACC15] text-[#142E21] font-black text-xs sm:text-sm shadow transition cursor-pointer shrink-0 whitespace-nowrap"
        >
          <TrendingUp className="w-4 h-4" />
          <span>View Improvement &amp; Score Line Graphs</span>
        </button>
      </div>

      {/* Recent Quiz Attempts List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-stone-600">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Recent Quizzes (All Types)</span>
          </span>
          <span className="tabular-nums">Latest {gist.recentAttempts.length}</span>
        </div>

        <div className="space-y-2">
          {gist.recentAttempts.map((attempt) => (
            <div
              key={attempt.id}
              className="p-3.5 rounded-xl bg-white border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="font-bold text-stone-900 truncate">
                  {attempt.title}
                </div>
                <div className="text-stone-500">
                  {QUIZ_KIND_LABELS[attempt.quizKind]} ·{' '}
                  {new Date(attempt.timestamp).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 tabular-nums">
                <span className="font-bold text-stone-700">
                  {attempt.score}/{attempt.total}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-extrabold ${
                    attempt.passed
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-rose-100 text-rose-900'
                  }`}
                >
                  {attempt.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {attempt.percentage}% · {attempt.passed ? 'Passed' : 'Review'}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
