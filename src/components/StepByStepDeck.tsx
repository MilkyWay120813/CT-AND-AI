import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Trophy,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { MathHomeworkSolution, SolutionStep } from '../types/math';
import { formatMathText } from '../utils/formatMath';

interface StepByStepDeckProps {
  solution: MathHomeworkSolution;
  activeStepIndex: number;
  onSelectStep: (index: number) => void;
  onAddStreakPoints: (points: number) => void;
}

export const StepByStepDeck: React.FC<StepByStepDeckProps> = ({
  solution,
  activeStepIndex,
  onSelectStep,
  onAddStreakPoints,
}) => {
  const [unlockedUpTo, setUnlockedUpTo] = useState<number>(0);
  const [stepQuizAnswers, setStepQuizAnswers] = useState<Record<number, number>>({});
  const [showStepQuiz, setShowStepQuiz] = useState<Record<number, boolean>>({});
  const [twinSelectedOption, setTwinSelectedOption] = useState<number | null>(null);
  const [twinSolved, setTwinSolved] = useState<boolean>(false);

  // Reset progression when a new homework problem loads
  useEffect(() => {
    setUnlockedUpTo(0);
    setStepQuizAnswers({});
    setShowStepQuiz({});
    setTwinSelectedOption(null);
    setTwinSolved(false);
  }, [solution.id]);

  const totalSteps = solution.steps.length;

  const handleRevealNextStep = () => {
    if (unlockedUpTo < totalSteps - 1) {
      const nextIdx = unlockedUpTo + 1;
      setUnlockedUpTo(nextIdx);
      onSelectStep(nextIdx);
    } else {
      onSelectStep(Math.min(activeStepIndex + 1, totalSteps - 1));
    }
  };

  const handleRevealAll = () => {
    setUnlockedUpTo(totalSteps - 1);
  };

  const handleStepQuizSelect = (stepIdx: number, optionIdx: number, correctIdx: number) => {
    if (stepQuizAnswers[stepIdx] !== undefined) return;
    setStepQuizAnswers((prev) => ({ ...prev, [stepIdx]: optionIdx }));
    if (optionIdx === correctIdx) {
      onAddStreakPoints(15);
    }
  };

  const handleTwinAnswer = (optionIdx: number) => {
    setTwinSelectedOption(optionIdx);
    if (optionIdx === solution.practiceTwin.correctIndex && !twinSolved) {
      setTwinSolved(true);
      onAddStreakPoints(30);
      try {
        confetti({
          particleCount: 55,
          spread: 60,
          origin: { y: 0.75 },
        });
      } catch {
        // Ignore confetti errors in headless environments
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Problem Overview & Final Solution Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sky-700">{solution.topic}</span>
            <span aria-hidden="true">·</span>
            <span>{solution.difficulty}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{solution.estimatedMinutes} min walkthrough</span>
          </div>
          <span className="font-mono text-slate-500 tabular-nums">
            Step {activeStepIndex + 1} of {totalSteps}
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {formatMathText(solution.title)}
          </h2>
          <p className="text-sm text-slate-700 font-medium bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 font-mono">
            {formatMathText(solution.originalProblem)}
          </p>
        </div>

        {/* Final Answer Banner */}
        <div className="bg-sky-50/70 border border-sky-200 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-sky-800 block">
              Verified Solution
            </span>
            <p className="text-sm sm:text-base font-mono font-semibold text-slate-900 tabular-nums">
              {formatMathText(solution.finalAnswer)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRevealAll}
            className="px-3 py-1.5 text-xs font-medium text-sky-800 bg-white border border-sky-200 rounded-lg hover:bg-sky-100/60 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            Show All {totalSteps} Steps
          </button>
        </div>
      </div>

      {/* 2. "Simple & Fun" Real-World Analogy Card */}
      <div
        id="visual-intuition-section"
        className="bg-amber-50/50 border border-amber-200/90 rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-900">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs font-semibold tracking-wide text-amber-800">
              Simple Intuition & Real-World Analogy
            </span>
          </div>
          <span className="text-xs text-amber-700">Zero-Jargon Breakdown</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">
            {formatMathText(solution.funAnalogy.title)}
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {formatMathText(solution.funAnalogy.story)}
          </p>
        </div>

        {/* Variable Decoder Grid */}
        {solution.funAnalogy.realWorldVariableMap &&
          solution.funAnalogy.realWorldVariableMap.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {solution.funAnalogy.realWorldVariableMap.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 border border-amber-200/70 rounded-xl p-3 space-y-1"
                >
                  <div className="text-xs font-mono font-semibold text-amber-900">
                    {formatMathText(item.symbol)}
                  </div>
                  <div className="text-xs text-slate-600 leading-snug">
                    {formatMathText(item.meaning)}
                  </div>
                </div>
              ))}
            </div>
          )}

        <div className="pt-2 border-t border-amber-200/60 flex items-center gap-2 text-xs font-medium text-amber-950">
          <span>Key Rule of Thumb:</span>
          <span className="font-semibold">{formatMathText(solution.funAnalogy.punchline)}</span>
        </div>
      </div>

      {/* 3. Interactive Step-by-Step Walkthrough Deck */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Step-by-Step Guided Solution
            </h3>
            <p className="text-xs text-slate-500">
              Click any step to highlight its exact point on the coordinate graph
            </p>
          </div>

          {/* Step Playback Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={activeStepIndex === 0}
              onClick={() => onSelectStep(Math.max(0, activeStepIndex - 1))}
              className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-40 bg-slate-50 border border-slate-200 rounded-lg transition-colors"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRevealNextStep}
              disabled={activeStepIndex === totalSteps - 1 && unlockedUpTo === totalSteps - 1}
              className="px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <span>
                {unlockedUpTo < totalSteps - 1 ? 'Unlock Next Step' : 'Next Step'}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setUnlockedUpTo(0);
                onSelectStep(0);
              }}
              title="Restart Step-by-Step"
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {solution.steps.map((step: SolutionStep, idx: number) => {
            const isUnlocked = idx <= unlockedUpTo;
            const isActive = idx === activeStepIndex;
            const selectedQuizAns = stepQuizAnswers[idx];
            const quizOpen = showStepQuiz[idx];

            if (!isUnlocked) {
              return (
                <div
                  key={step.stepNumber}
                  onClick={() => {
                    setUnlockedUpTo(idx);
                    onSelectStep(idx);
                  }}
                  className="border border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-sky-300 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-semibold flex items-center justify-center tabular-nums">
                      {step.stepNumber}
                    </span>
                    <span className="text-sm font-medium text-slate-600">
                      {formatMathText(step.title)}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-sky-700 whitespace-nowrap">
                    Click to reveal step →
                  </span>
                </div>
              );
            }

            return (
              <div
                key={step.stepNumber}
                onClick={() => onSelectStep(idx)}
                className={`border rounded-xl p-4 transition-colors cursor-pointer space-y-3 ${
                  isActive
                    ? 'border-sky-500 bg-sky-50/25'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-mono font-semibold flex items-center justify-center tabular-nums ${
                        isActive
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {formatMathText(step.title)}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500">
                    {formatMathText(step.ruleUsed)}
                  </span>
                </div>

                {/* Math Transformation Box */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 font-mono text-xs sm:text-sm">
                  <span className="text-slate-600">{formatMathText(step.mathBefore)}</span>
                  <ArrowRight className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="font-semibold text-slate-900">{formatMathText(step.mathAfter)}</span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {formatMathText(step.explanation)}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500">
                  <span>
                    <strong className="font-semibold text-slate-700">Shortcut Tip:</strong>{' '}
                    {formatMathText(step.funTip)}
                  </span>

                  {step.checkQuestion && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStepQuiz((prev) => ({ ...prev, [idx]: !prev[idx] }));
                      }}
                      className="text-xs font-medium text-sky-700 hover:text-sky-900 flex items-center gap-1 whitespace-nowrap shrink-0"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {quizOpen ? 'Hide Step Check' : 'Test This Step (+15 pts)'}
                    </button>
                  )}
                </div>

                {/* Interactive Micro-Quiz for this step */}
                {step.checkQuestion && quizOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 pt-3 border-t border-slate-200/80 space-y-2.5"
                  >
                    <p className="text-xs font-semibold text-slate-800">
                      Quick Check: {formatMathText(step.checkQuestion.prompt)}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.checkQuestion.options.map((opt, optIdx) => {
                        const isSelected = selectedQuizAns === optIdx;
                        const isCorrect = optIdx === step.checkQuestion!.correctIndex;
                        const answered = selectedQuizAns !== undefined;

                        let btnStyle =
                          'bg-white border-slate-200 text-slate-700 hover:border-sky-300';
                        if (answered) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                          } else if (isSelected) {
                            btnStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() =>
                              handleStepQuizSelect(
                                idx,
                                optIdx,
                                step.checkQuestion!.correctIndex
                              )
                            }
                            className={`px-3 py-2 text-xs font-mono rounded-lg border text-left transition-colors flex items-center justify-between gap-2 ${btnStyle}`}
                          >
                            <span>{formatMathText(opt)}</span>
                            {answered && isCorrect && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {selectedQuizAns !== undefined && (
                      <p className="text-xs text-slate-600">
                        {selectedQuizAns === step.checkQuestion.correctIndex
                          ? 'Spot on! +15 Mastery Points added.'
                          : `Hint: ${formatMathText(step.checkQuestion.hint)}`}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Practice Arcade: Twin Homework Challenge */}
      <div
        id="practice-arcade-section"
        className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Practice Arcade — Try the Twin Problem
            </h3>
          </div>
          <span className="text-xs text-emerald-700 font-medium">
            +30 Mastery Points
          </span>
        </div>

        <p className="text-sm text-slate-700">
          {formatMathText(solution.practiceTwin.question)}
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm font-semibold text-slate-900">
          {formatMathText(solution.practiceTwin.equation)}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {solution.practiceTwin.options.map((option, idx) => {
            const isSelected = twinSelectedOption === idx;
            const isCorrect = idx === solution.practiceTwin.correctIndex;

            let optionClasses =
              'bg-white border-slate-200 text-slate-800 hover:border-sky-400';
            if (twinSelectedOption !== null) {
              if (isCorrect) {
                optionClasses =
                  'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold';
              } else if (isSelected) {
                optionClasses = 'bg-rose-50 border-rose-300 text-rose-900';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleTwinAnswer(idx)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-mono transition-colors flex items-center justify-between gap-2 ${optionClasses}`}
              >
                <span>{formatMathText(option)}</span>
                {twinSelectedOption !== null && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {twinSelectedOption !== null && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1 ${
              twinSelectedOption === solution.practiceTwin.correctIndex
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}
          >
            <p className="font-semibold">
              {twinSelectedOption === solution.practiceTwin.correctIndex
                ? formatMathText(solution.practiceTwin.funRewardMessage)
                : 'Almost! Check the step breakdown below:'}
            </p>
            <p className="text-slate-700">{formatMathText(solution.practiceTwin.explanation)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

