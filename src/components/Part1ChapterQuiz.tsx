import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Shuffle,
  Award,
  ArrowRight,
  Sparkles,
  ClipboardCheck,
} from 'lucide-react';
import { ChapterId } from '../types/math';
import { ChapterAssessmentQuestion } from '../types/part1Curriculum';
import { generateDynamicChapterQuiz } from '../utils/dynamicQuizGenerator';
import { formatMathText } from '../utils/formatMath';

interface Part1ChapterQuizProps {
  chapterId: ChapterId | 'ch8-master-quiz';
  chapterTitle: string;
  baseQuestions: ChapterAssessmentQuestion[];
  onCompleteQuiz?: (score: number, total: number) => void;
}

export const Part1ChapterQuiz: React.FC<Part1ChapterQuizProps> = ({
  chapterId,
  chapterTitle,
  baseQuestions,
  onCompleteQuiz,
}) => {
  // Seed starts with current timestamp + random offset so every open is fresh
  const [attemptSeed, setAttemptSeed] = useState<number>(() =>
    Math.floor(Date.now() % 100000) + Math.floor(Math.random() * 9000)
  );
  const [attemptCount, setAttemptCount] = useState<number>(1);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<number, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Reset and generate a brand new quiz whenever chapterId changes
  useEffect(() => {
    setAttemptSeed(Math.floor(Date.now() % 100000) + Math.floor(Math.random() * 9000));
    setAttemptCount(1);
    setCurrentIdx(0);
    setSelectedOptions({});
    setShortAnswers({});
    setSubmittedQuestions({});
    setQuizFinished(false);
  }, [chapterId]);

  const questions = useMemo(
    () => generateDynamicChapterQuiz(chapterId, baseQuestions, attemptSeed),
    [chapterId, baseQuestions, attemptSeed]
  );

  const handleGenerateNewQuiz = () => {
    setAttemptSeed((prev) => prev + Math.floor(Math.random() * 7919) + 137);
    setAttemptCount((c) => c + 1);
    setCurrentIdx(0);
    setSelectedOptions({});
    setShortAnswers({});
    setSubmittedQuestions({});
    setQuizFinished(false);
  };

  const currentQuestion = questions[currentIdx] || questions[0];
  const isCurrentSubmitted = Boolean(submittedQuestions[currentIdx]);

  const handleSelectOption = (optIdx: number) => {
    if (isCurrentSubmitted) return;
    setSelectedOptions((prev) => ({ ...prev, [currentIdx]: optIdx }));
    setSubmittedQuestions((prev) => ({ ...prev, [currentIdx]: true }));
  };

  const scoreCount = useMemo(() => {
    return questions.reduce((acc, q, idx) => {
      if (!submittedQuestions[idx]) return acc;
      if (selectedOptions[idx] === q.correctIndex) return acc + 1;
      return acc;
    }, 0);
  }, [questions, submittedQuestions, selectedOptions]);

  const answeredCount = Object.keys(submittedQuestions).length;

  const handleFinishQuiz = () => {
    setQuizFinished(true);
    if (onCompleteQuiz) {
      onCompleteQuiz(scoreCount, questions.length);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
      {/* Top Header with Dynamic Generator Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] text-xs font-bold uppercase tracking-wider">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>
              Dynamic Randomized Assessment · Set #{attemptCount} ({questions.length} Questions)
            </span>
          </div>
          <h3 className="text-2xl font-bold text-stone-900 mt-2">
            {formatMathText(chapterTitle)} — Mastery Questionnaire
          </h3>
          <p className="text-sm text-stone-600 mt-0.5">
            Every attempt dynamically generates fresh procedural numbers, roots, ratios, and shuffled options so no two quizzes are alike.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-[#0F3828] text-white text-center">
            <div className="text-[10px] uppercase tracking-wider text-teal-300 font-bold">
              Score
            </div>
            <div className="text-lg font-bold">
              {scoreCount} / {questions.length}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateNewQuiz}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold text-xs sm:text-sm shadow transition cursor-pointer"
          >
            <Shuffle className="w-4 h-4" />
            <span>New Quiz Set (Different Questions)</span>
          </button>
        </div>
      </div>

      {/* Question Number Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {questions.map((q, idx) => {
          const isSubmitted = Boolean(submittedQuestions[idx]);
          const isCorrect = isSubmitted && selectedOptions[idx] === q.correctIndex;
          const isCurrent = idx === currentIdx;

          let pillClass = 'bg-stone-100 text-stone-700 border-stone-300';
          if (isSubmitted) {
            pillClass = isCorrect
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-rose-600 text-white border-rose-600';
          } else if (isCurrent) {
            pillClass = 'bg-[#0F766E] text-white border-[#0F766E]';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setQuizFinished(false);
                setCurrentIdx(idx);
              }}
              className={`w-9 h-9 rounded-full border text-xs font-bold transition-all cursor-pointer ${pillClass} ${
                isCurrent ? 'ring-2 ring-amber-400 scale-110' : ''
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {quizFinished ? (
        <div className="rounded-3xl bg-gradient-to-br from-[#0F3828] to-[#115E59] text-white p-8 text-center space-y-5">
          <Award className="w-14 h-14 text-amber-300 mx-auto" />
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-white/15 text-teal-200 text-xs font-bold uppercase tracking-wider">
              Quiz Set #{attemptCount} Complete
            </span>
            <h4 className="text-3xl font-bold">
              You Scored {scoreCount} out of {questions.length}!
            </h4>
            <p className="text-emerald-100 max-w-xl mx-auto text-sm sm:text-base">
              Want to test your mastery again with a fresh set of numbers, equations, and questions? Click below to generate a brand-new dynamic quiz!
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleGenerateNewQuiz}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2DD4BF] hover:bg-[#14B8A6] text-stone-950 font-bold text-sm shadow-lg transition cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              <span>Generate Brand-New Quiz Set</span>
            </button>
            <button
              type="button"
              onClick={() => setQuizFinished(false)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm transition cursor-pointer"
            >
              <span>Review My Answers</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-[#FAF6EE] border-2 border-[#E5DEC9] p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-[#0F766E]">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Question {currentIdx + 1} of {questions.length} ·{' '}
              {currentQuestion.type === 'short-answer'
                ? 'Procedural Calculation'
                : 'Conceptual & Analytical'}
            </span>
            <span className="text-stone-500">
              Answered: {answeredCount} / {questions.length}
            </span>
          </div>

          <h4 className="text-xl md:text-2xl font-bold text-stone-900 leading-snug">
            {formatMathText(currentQuestion.prompt)}
          </h4>

          {/* Optional Short-Answer Scratchpad for short-answer questions */}
          {currentQuestion.type === 'short-answer' && (
            <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-white border border-stone-200">
              <input
                type="text"
                value={shortAnswers[currentIdx] || ''}
                onChange={(e) =>
                  setShortAnswers((prev) => ({
                    ...prev,
                    [currentIdx]: e.target.value,
                  }))
                }
                placeholder="Type your mental calculation first, then verify below..."
                className="flex-1 min-w-[220px] px-3.5 py-2 rounded-xl border border-stone-300 text-sm text-stone-800 focus:outline-none focus:border-[#0F766E]"
              />
              <span className="text-xs text-stone-500 font-medium">
                Select the matching option below to lock in your answer
              </span>
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQuestion.options.map((opt, idx) => {
              const chosen = selectedOptions[currentIdx] === idx;
              let cardClass =
                'bg-white hover:bg-[#F0FDFA] border-stone-300 text-stone-900';
              if (isCurrentSubmitted) {
                if (idx === currentQuestion.correctIndex) {
                  cardClass =
                    'bg-emerald-600 text-white border-emerald-600 font-bold shadow-md';
                } else if (chosen) {
                  cardClass = 'bg-rose-600 text-white border-rose-600';
                } else {
                  cardClass = 'bg-stone-100 text-stone-400 border-stone-200';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isCurrentSubmitted}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${cardClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-base font-semibold">
                      {formatMathText(opt)}
                    </span>
                  </div>
                  {isCurrentSubmitted && idx === currentQuestion.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  )}
                  {isCurrentSubmitted &&
                    chosen &&
                    idx !== currentQuestion.correctIndex && (
                      <XCircle className="w-5 h-5 shrink-0" />
                    )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Button */}
          {isCurrentSubmitted && (
            <div className="p-5 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="text-xs font-bold uppercase tracking-wider text-[#2DD4BF]">
                  {selectedOptions[currentIdx] === currentQuestion.correctIndex
                    ? '✓ Correct Answer!'
                    : '✗ Step-by-Step Solution'}
                </div>
                <p className="text-sm text-emerald-100 leading-relaxed">
                  {formatMathText(currentQuestion.explanation)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {currentIdx < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((i) => i + 1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2DD4BF] hover:bg-[#14B8A6] text-stone-950 font-bold text-sm shadow transition cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishQuiz}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm shadow transition cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Final Score</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
