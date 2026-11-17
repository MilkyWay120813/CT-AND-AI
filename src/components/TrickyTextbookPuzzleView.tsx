import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Image as ImageIcon,
  Keyboard,
  ListChecks,
  Loader2,
  PenTool,
  Shuffle,
  Sparkles,
  Trash2,
  TrendingUp,
  Trophy,
  Upload,
  XCircle,
} from 'lucide-react';
import { ChapterId, GanitaChapter } from '../types/math';
import { ChapterAssessmentQuestion } from '../types/part1Curriculum';
import { QuizAttemptRecord } from '../types/account';
import { formatMathText } from '../utils/formatMath';
import { QuizDifficultySlider } from './QuizDifficultySlider';
import {
  DEFAULT_QUIZ_DIFFICULTY_SETTINGS,
  QuizDifficultyLevel,
  QuizDifficultySettings,
} from '../utils/quizDifficulty';
import {
  ALL_TRICKY_FORMATS,
  checkLongAnswerLenientLocal,
  checkSubjectiveAnswerLenient,
  FormattedTrickyQuestion,
  generateFormattedTrickyQuiz,
  getQuestionTotalMarks,
  TrickyFormatType,
} from '../utils/trickyFormatsGenerator';

interface TrickyTextbookPuzzleViewProps {
  allChapters: GanitaChapter[];
  initialSelectedChapterIds?: ChapterId[];
  staticByChapter: Partial<Record<ChapterId, ChapterAssessmentQuestion[]>>;
  onRecordQuizAttempt?: (attempt: Omit<QuizAttemptRecord, 'id' | 'timestamp'>) => void;
  isStatsLocked?: boolean;
  onRequestSignIn?: () => void;
  onOpenAccountStats?: () => void;
  onBackToHub: () => void;
  quizDifficultySettings?: QuizDifficultySettings;
  effectiveDifficulty?: QuizDifficultyLevel;
  recommendedDifficulty?: QuizDifficultyLevel;
  recommendedReason?: string;
  onSelectDifficulty?: (level: QuizDifficultyLevel) => void;
  onToggleAutoMatchDifficulty?: (enabled: boolean) => void;
}

interface LongAnswerResult {
  isCorrect: boolean;
  creditScore: number;
  feedback: string;
}

interface CaseStudySubState {
  selectedOption?: number;
  textInput?: string;
  submitted: boolean;
  isCorrect: boolean;
}

const FORMAT_META: Record<
  TrickyFormatType,
  { label: string; sub: string; badge: string }
> = {
  mcq: {
    label: 'MCQ (Normal & Assertion–Reason)',
    sub: '4-choice problems + Assertion (A) & Reason (R) cards',
    badge: 'MCQ · 1 Mark',
  },
  subjective: {
    label: 'Subjective (Answer Only)',
    sub: 'Direct value input with lenient units & fraction check',
    badge: 'Subjective · Answer Only',
  },
  'long-answer': {
    label: 'Long Answer (Type or Scan)',
    sub: 'Show full steps or scan/upload handwritten work · lenient grading',
    badge: 'Long Answer · Step Check',
  },
  'case-study': {
    label: 'Case Study (Real-Life · 4 Qs)',
    sub: 'Applied real-world scenario with 4 mixed sub-questions (a–d)',
    badge: 'Case Study · 4 Marks',
  },
};

export const TrickyTextbookPuzzleView: React.FC<TrickyTextbookPuzzleViewProps> = ({
  allChapters,
  initialSelectedChapterIds,
  staticByChapter,
  onRecordQuizAttempt,
  isStatsLocked = false,
  onRequestSignIn,
  onOpenAccountStats,
  onBackToHub,
  quizDifficultySettings,
  effectiveDifficulty,
  recommendedDifficulty = 2,
  recommendedReason,
  onSelectDifficulty,
  onToggleAutoMatchDifficulty,
}) => {
  const [selectedChapterIds, setSelectedChapterIds] = useState<ChapterId[]>(() => {
    if (initialSelectedChapterIds && initialSelectedChapterIds.length > 0) {
      return initialSelectedChapterIds;
    }
    return [allChapters[0].id, allChapters[7]?.id || allChapters[1].id];
  });

  const [enabledFormats, setEnabledFormats] = useState<TrickyFormatType[]>(ALL_TRICKY_FORMATS);

  const [phase, setPhase] = useState<'setup' | 'quiz' | 'results'>('setup');
  const [seed, setSeed] = useState<number>(() =>
    Math.floor(Date.now() % 100000) + Math.floor(Math.random() * 9000) + 101
  );
  const [generationCount, setGenerationCount] = useState<number>(1);
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  // Per-question attempt states
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [subjectiveInputs, setSubjectiveInputs] = useState<Record<number, string>>({});
  const [subjectiveCorrect, setSubjectiveCorrect] = useState<Record<number, boolean>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});

  // Long Answer state (type or scan)
  const [longInputs, setLongInputs] = useState<Record<number, string>>({});
  const [longImages, setLongImages] = useState<
    Record<number, { dataUrl: string; base64: string; mimeType: string }>
  >({});
  const [longResults, setLongResults] = useState<Record<number, LongAnswerResult>>({});
  const [longInputMode, setLongInputMode] = useState<'type' | 'scan'>('type');
  const [isGradingLong, setIsGradingLong] = useState<boolean>(false);

  // Camera scanner state for handwritten solutions
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Case Study sub-questions (keyed by question index -> subIndex 0..3)
  const [csStates, setCsStates] = useState<Record<number, Record<number, CaseStudySubState>>>({});

  const recordedSeedRef = useRef<number | null>(null);

  const [localDifficulty, setLocalDifficulty] = useState<QuizDifficultySettings>(
    DEFAULT_QUIZ_DIFFICULTY_SETTINGS
  );
  const activeSettings = quizDifficultySettings || localDifficulty;
  const resolvedDifficulty: QuizDifficultyLevel =
    effectiveDifficulty ??
    (activeSettings.autoMatchProgress ? recommendedDifficulty : activeSettings.difficulty);

  const handleSelectDifficultyLevel = (lvl: QuizDifficultyLevel) => {
    if (onSelectDifficulty) {
      onSelectDifficulty(lvl);
    } else {
      setLocalDifficulty({ difficulty: lvl, autoMatchProgress: false });
    }
  };

  const handleToggleAutoMatchLevel = (enabled: boolean) => {
    if (onToggleAutoMatchDifficulty) {
      onToggleAutoMatchDifficulty(enabled);
    } else {
      setLocalDifficulty((prev) => ({ ...prev, autoMatchProgress: enabled }));
    }
  };

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

  useEffect(() => {
    stopCameraStream();
    setCameraError('');
  }, [currentIdx, phase, stopCameraStream]);

  const part1Chapters = useMemo(
    () => allChapters.filter((c) => c.partLabel === 'Part I'),
    [allChapters]
  );
  const part2Chapters = useMemo(
    () => allChapters.filter((c) => c.partLabel === 'Part II'),
    [allChapters]
  );

  const questions: FormattedTrickyQuestion[] = useMemo(
    () =>
      generateFormattedTrickyQuiz({
        selectedChapterIds,
        seed,
        staticByChapter,
        difficulty: resolvedDifficulty,
        enabledFormats,
        totalTarget: 20,
      }),
    [selectedChapterIds, seed, staticByChapter, resolvedDifficulty, enabledFormats]
  );

  const currentQuestion = questions[currentIdx] || questions[0];

  const getQuestionEarnedMarks = useCallback(
    (q: FormattedTrickyQuestion, idx: number): { earned: number; total: number; submitted: boolean } => {
      const total = getQuestionTotalMarks(q);
      if (q.formatType === 'case-study' && Array.isArray(q.subQuestions)) {
        const subMap = csStates[idx] || {};
        let earned = 0;
        let subCount = 0;
        q.subQuestions.forEach((_, sIdx) => {
          const st = subMap[sIdx];
          if (st?.submitted) {
            subCount++;
            if (st.isCorrect) earned++;
          }
        });
        return {
          earned,
          total,
          submitted: subCount === q.subQuestions.length && q.subQuestions.length > 0,
        };
      }
      if (q.formatType === 'long-answer') {
        const res = longResults[idx];
        return {
          earned: res?.isCorrect ? 1 : 0,
          total: 1,
          submitted: Boolean(submittedQuestions[idx]),
        };
      }
      if (q.formatType === 'subjective') {
        return {
          earned: submittedQuestions[idx] && subjectiveCorrect[idx] ? 1 : 0,
          total: 1,
          submitted: Boolean(submittedQuestions[idx]),
        };
      }
      return {
        earned: submittedQuestions[idx] && selectedOptions[idx] === q.correctIndex ? 1 : 0,
        total: 1,
        submitted: Boolean(submittedQuestions[idx]),
      };
    },
    [csStates, longResults, selectedOptions, subjectiveCorrect, submittedQuestions]
  );

  const totalMarks = useMemo(
    () => questions.reduce((sum, q) => sum + getQuestionTotalMarks(q), 0),
    [questions]
  );

  const scoreMarks = useMemo(
    () =>
      questions.reduce((acc, q, idx) => acc + getQuestionEarnedMarks(q, idx).earned, 0),
    [questions, getQuestionEarnedMarks]
  );

  const answeredCardsCount = useMemo(
    () =>
      questions.reduce(
        (acc, q, idx) => (getQuestionEarnedMarks(q, idx).submitted ? acc + 1 : acc),
        0
      ),
    [questions, getQuestionEarnedMarks]
  );

  const toggleChapter = (id: ChapterId) => {
    setSelectedChapterIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFormat = (fmt: TrickyFormatType) => {
    setEnabledFormats((prev) => {
      if (prev.includes(fmt)) {
        if (prev.length === 1) return prev; // always retain at least 1 active format
        return prev.filter((f) => f !== fmt);
      }
      return [...prev, fmt];
    });
  };

  const resetAttemptState = () => {
    stopCameraStream();
    setCurrentIdx(0);
    setSelectedOptions({});
    setSubjectiveInputs({});
    setSubjectiveCorrect({});
    setSubmittedQuestions({});
    setLongInputs({});
    setLongImages({});
    setLongResults({});
    setCsStates({});
    setCameraError('');
    recordedSeedRef.current = null;
  };

  const prevDifficultyRef = useRef<QuizDifficultyLevel>(resolvedDifficulty);
  useEffect(() => {
    if (prevDifficultyRef.current !== resolvedDifficulty) {
      prevDifficultyRef.current = resolvedDifficulty;
      if (phase === 'quiz') {
        resetAttemptState();
      }
    }
  }, [resolvedDifficulty, phase]);

  const handleStartQuiz = () => {
    if (selectedChapterIds.length === 0) return;
    const nextSeed = seed + Math.floor(Math.random() * 7919) + 173;
    setSeed(nextSeed);
    resetAttemptState();
    setPhase('quiz');
  };

  const handleGenerateFreshSet = () => {
    const nextSeed = seed + Math.floor(Math.random() * 9973) + 211;
    setSeed(nextSeed);
    setGenerationCount((c) => c + 1);
    resetAttemptState();
    setPhase('quiz');
  };

  const handleSelectMcqOption = (optIdx: number) => {
    if (submittedQuestions[currentIdx]) return;
    setSelectedOptions((prev) => ({ ...prev, [currentIdx]: optIdx }));
    setSubmittedQuestions((prev) => ({ ...prev, [currentIdx]: true }));
  };

  const handleCheckSubjective = () => {
    if (!currentQuestion || submittedQuestions[currentIdx]) return;
    const val = (subjectiveInputs[currentIdx] || '').trim();
    if (!val) return;
    const ok = checkSubjectiveAnswerLenient(val, currentQuestion.acceptedAnswers);
    setSubjectiveCorrect((prev) => ({ ...prev, [currentIdx]: ok }));
    setSubmittedQuestions((prev) => ({ ...prev, [currentIdx]: true }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      const commaIdx = dataUrl.indexOf(',');
      if (commaIdx !== -1) {
        const mimeMatch = dataUrl.slice(0, commaIdx).match(/data:([^;]+);base64/);
        const mimeType = mimeMatch ? mimeMatch[1] : file.type || 'image/jpeg';
        const base64 = dataUrl.slice(commaIdx + 1);
        setLongImages((prev) => ({
          ...prev,
          [currentIdx]: { dataUrl, base64, mimeType },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartCamera = async () => {
    setCameraError('');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Live camera access is unavailable in this browser. Please upload a photo file instead.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play().catch(() => {});
        }
      }, 60);
    } catch {
      setCameraError('Could not open camera (permission denied or no camera device). Use Upload Photo instead.');
    }
  };

  const handleCaptureCamera = () => {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const base64 = dataUrl.split(',')[1] || '';
      setLongImages((prev) => ({
        ...prev,
        [currentIdx]: { dataUrl, base64, mimeType: 'image/jpeg' },
      }));
    }
    stopCameraStream();
  };

  const handleGradeLongAnswer = async () => {
    if (!currentQuestion || isGradingLong || submittedQuestions[currentIdx]) return;
    const typedText = (longInputs[currentIdx] || '').trim();
    const scannedImg = longImages[currentIdx];
    if (!typedText && !scannedImg) return;

    const targetIdx = currentIdx;
    const expectedAns = currentQuestion.acceptedAnswers[0] || currentQuestion.options[0] || '';
    setIsGradingLong(true);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch('/api/grade-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          questionPrompt: currentQuestion.prompt,
          expectedAnswer: expectedAns,
          expectedExplanation: currentQuestion.explanation,
          typedSolution: typedText,
          imageBase64: scannedImg?.base64,
          imageMimeType: scannedImg?.mimeType,
        }),
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        setLongResults((prev) => ({
          ...prev,
          [targetIdx]: {
            isCorrect: Boolean(data.isCorrect),
            creditScore: Number(data.creditScore ?? (data.isCorrect ? 8 : 4)),
            feedback: String(data.feedback || 'Checked using lenient rubric.'),
          },
        }));
        setSubmittedQuestions((prev) => ({ ...prev, [targetIdx]: true }));
        setIsGradingLong(false);
        return;
      }
    } catch {
      clearTimeout(timer);
    }

    // Deterministic offline lenient fallback (or lenient photo fallback)
    const local = scannedImg && !typedText
      ? {
          isCorrect: true,
          creditScore: 8,
          feedback:
            'Handwritten scan attached & recorded (8/10 lenient offline check). Compare your steps carefully with the model solution below!',
        }
      : checkLongAnswerLenientLocal(
          typedText,
          expectedAns,
          currentQuestion.explanation,
          currentQuestion.keySteps
        );

    setLongResults((prev) => ({ ...prev, [targetIdx]: local }));
    setSubmittedQuestions((prev) => ({ ...prev, [targetIdx]: true }));
    setIsGradingLong(false);
  };

  const handleCaseStudyMcq = (subIdx: number, optIdx: number) => {
    if (!currentQuestion?.subQuestions) return;
    const sub = currentQuestion.subQuestions[subIdx];
    if (!sub || csStates[currentIdx]?.[subIdx]?.submitted) return;
    const ok = optIdx === sub.correctIndex;
    setCsStates((prev) => ({
      ...prev,
      [currentIdx]: {
        ...(prev[currentIdx] || {}),
        [subIdx]: {
          selectedOption: optIdx,
          submitted: true,
          isCorrect: ok,
        },
      },
    }));
  };

  const handleCaseStudySubjectiveChange = (subIdx: number, val: string) => {
    setCsStates((prev) => ({
      ...prev,
      [currentIdx]: {
        ...(prev[currentIdx] || {}),
        [subIdx]: {
          ...(prev[currentIdx]?.[subIdx] || { submitted: false, isCorrect: false }),
          textInput: val,
        },
      },
    }));
  };

  const handleCaseStudyCheckSubjective = (subIdx: number) => {
    if (!currentQuestion?.subQuestions) return;
    const sub = currentQuestion.subQuestions[subIdx];
    const currentSub = csStates[currentIdx]?.[subIdx];
    if (!sub || currentSub?.submitted) return;
    const val = (currentSub?.textInput || '').trim();
    if (!val) return;
    const ok = checkSubjectiveAnswerLenient(val, sub.acceptedAnswers);
    setCsStates((prev) => ({
      ...prev,
      [currentIdx]: {
        ...(prev[currentIdx] || {}),
        [subIdx]: {
          ...currentSub,
          submitted: true,
          isCorrect: ok,
        },
      },
    }));
  };

  const handleFinishQuiz = () => {
    stopCameraStream();
    setPhase('results');
    if (
      !isStatsLocked &&
      onRecordQuizAttempt &&
      recordedSeedRef.current !== seed
    ) {
      recordedSeedRef.current = seed;
      const total = totalMarks || 20;
      const pct = Math.round((scoreMarks / total) * 100);
      const chapterTitles = selectedChapterIds
        .map((id) => allChapters.find((c) => c.id === id))
        .filter((c): c is GanitaChapter => Boolean(c))
        .map((c) => `Ch ${c.chapterNumber}`);
      onRecordQuizAttempt({
        quizKey: `tricky-20q-${selectedChapterIds.join(',')}`,
        quizKind: 'tricky-textbook',
        title: `Tricky Puzzle (${chapterTitles.slice(0, 3).join(', ')}${
          chapterTitles.length > 3 ? ` +${chapterTitles.length - 3}` : ''
        })`,
        chapterIds: selectedChapterIds,
        score: scoreMarks,
        total,
        percentage: pct,
        passed: pct >= 70,
      });
    }
  };

  const chapterBreakdown = useMemo(() => {
    const map = new Map<ChapterId, { correct: number; total: number }>();
    questions.forEach((q, idx) => {
      const cur = map.get(q.sourceChapterId) || { correct: 0, total: 0 };
      const st = getQuestionEarnedMarks(q, idx);
      map.set(q.sourceChapterId, {
        correct: cur.correct + st.earned,
        total: cur.total + st.total,
      });
    });
    return Array.from(map.entries()).map(([chId, counts]) => {
      const ch = allChapters.find((c) => c.id === chId);
      const pct = counts.total > 0 ? Math.round((counts.correct / counts.total) * 100) : 0;
      return {
        chapterId: chId,
        label: ch ? `${ch.partLabel} Ch ${ch.chapterNumber}: ${ch.title}` : chId,
        ...counts,
        pct,
      };
    });
  }, [questions, getQuestionEarnedMarks, allChapters]);

  // =========================================================================
  // PHASE 1: CHAPTER + DIFFICULTY + FORMAT MULTI-SELECTOR
  // =========================================================================
  if (phase === 'setup') {
    const renderChapterGroup = (title: string, list: GanitaChapter[]) => (
      <div className="space-y-3">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F766E]">
          {title}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((ch) => {
            const isSelected = selectedChapterIds.includes(ch.id);
            return (
              <button
                key={ch.id}
                type="button"
                data-testid={`tricky-chapter-toggle-${ch.id}`}
                aria-pressed={isSelected}
                onClick={() => toggleChapter(ch.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#F0FDFA] border-[#0F766E] shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="text-[11px] font-mono font-bold text-stone-500">
                    {ch.partLabel} · Chapter {ch.chapterNumber}
                  </div>
                  <div className="text-sm font-extrabold text-stone-900 leading-snug">
                    {ch.title}
                  </div>
                </div>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-[#0F766E] border-[#0F766E] text-white'
                      : 'bg-stone-100 border-stone-300 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );

    return (
      <section
        data-testid="tricky-textbook-puzzle-view"
        className="max-w-6xl mx-auto space-y-6 pt-2 pb-12"
      >
        {/* Top Navigation Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            data-testid="tricky-back-to-hub-btn"
            onClick={onBackToHub}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs sm:text-sm font-bold transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#0F766E]" />
            <span>Return to Chapter Hub</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {isStatsLocked && onRequestSignIn ? (
              <button
                type="button"
                onClick={onRequestSignIn}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold transition cursor-pointer"
              >
                <span>Sign In to Save Quiz Stats</span>
              </button>
            ) : (
              onOpenAccountStats && (
                <button
                  type="button"
                  onClick={onOpenAccountStats}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#12352B] hover:bg-[#194530] text-amber-300 text-xs font-bold transition cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>View My Quiz Stats &amp; Graphs</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Chalkboard Banner */}
        <div className="chalkboard-frame chalkboard-grid bg-[#194530] rounded-3xl p-6 sm:p-9 text-white space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FDE047]">
                <BookOpen className="w-4 h-4" />
                <span>Tricky Textbook Puzzles · Dynamic Multi-Format Generator</span>
              </div>
              <h1 className="font-chalk-title text-2xl sm:text-4xl text-white leading-tight">
                Build Your Custom Challenge ({totalMarks} Marks)
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                Pick chapters, calibrate difficulty, and combine up to{' '}
                <strong>4 real exam formats</strong>: Normal &amp; Assertion–Reason MCQs, Answer-Only
                Subjective, Type/Scan Long Answers, and 4-question Case Studies.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/25 border border-white/15 text-center shrink-0 min-w-[165px]">
              <div className="text-xs font-mono text-emerald-200">Selected Chapters</div>
              <div className="text-3xl font-black text-[#FDE047] tabular-nums mt-0.5">
                {selectedChapterIds.length} / {allChapters.length}
              </div>
              <div className="text-xs font-bold text-white mt-0.5">
                {questions.length} Cards · {totalMarks} Marks
              </div>
            </div>
          </div>

          {/* Quiz Settings: Difficulty Slider & Progress-Level Match */}
          <QuizDifficultySlider
            difficulty={resolvedDifficulty}
            autoMatchProgress={activeSettings.autoMatchProgress}
            recommendedLevel={recommendedDifficulty}
            recommendedReason={recommendedReason}
            onSelectDifficulty={handleSelectDifficultyLevel}
            onToggleAutoMatch={handleToggleAutoMatchLevel}
            variant="chalkboard"
            testIdPrefix="tricky-setup-difficulty"
          />

          {/* Question Format Selector (4 Modes) */}
          <div
            data-testid="tricky-format-selector"
            className="rounded-2xl bg-black/25 border border-white/20 p-4 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-[#FDE047]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-200">
                  Question Formats ({enabledFormats.length} / 4 Active)
                </span>
              </div>
              <button
                type="button"
                data-testid="tricky-format-mix-all-btn"
                onClick={() => setEnabledFormats(ALL_TRICKY_FORMATS)}
                className={`px-3 py-1 rounded-xl text-[11px] font-black border transition cursor-pointer ${
                  enabledFormats.length === 4
                    ? 'bg-[#FDE047] text-stone-950 border-amber-300'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                Mix All 4 Formats
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {ALL_TRICKY_FORMATS.map((fmt) => {
                const isOn = enabledFormats.includes(fmt);
                const meta = FORMAT_META[fmt];
                const Icon =
                  fmt === 'mcq'
                    ? ListChecks
                    : fmt === 'subjective'
                    ? PenTool
                    : fmt === 'long-answer'
                    ? Camera
                    : FileText;

                return (
                  <button
                    key={fmt}
                    type="button"
                    data-testid={`tricky-format-toggle-${fmt}`}
                    aria-pressed={isOn}
                    onClick={() => toggleFormat(fmt)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      isOn
                        ? 'bg-[#0F766E] border-[#5EEAD4] text-white shadow-sm'
                        : 'bg-white/5 hover:bg-white/15 border-white/15 text-emerald-100/80'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isOn ? 'bg-amber-400 text-stone-950' : 'bg-white/10 text-emerald-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold leading-snug">{meta.label}</div>
                      <div className="text-[11px] opacity-85 leading-snug mt-0.5">{meta.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Selection Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/15">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedChapterIds(allChapters.map((c) => c.id))}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
              >
                Select All 14
              </button>
              <button
                type="button"
                onClick={() => setSelectedChapterIds(part1Chapters.map((c) => c.id))}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
              >
                Part I (Ch 1–7)
              </button>
              <button
                type="button"
                onClick={() => setSelectedChapterIds(part2Chapters.map((c) => c.id))}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
              >
                Part II (Ch 1–7)
              </button>
              <button
                type="button"
                onClick={() => setSelectedChapterIds([])}
                className="px-3.5 py-2 rounded-xl bg-black/30 hover:bg-black/45 text-emerald-200 text-xs font-bold transition cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <button
              type="button"
              data-testid="generate-tricky-20q-btn"
              disabled={selectedChapterIds.length === 0}
              onClick={handleStartQuiz}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#FDE047] hover:bg-[#FACC15] disabled:opacity-40 text-[#142E21] font-display font-bold text-sm sm:text-base shadow-lg transition cursor-pointer disabled:cursor-not-allowed"
            >
              <Shuffle className="w-4 h-4" />
              <span>Generate {totalMarks}-Mark Tricky Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 14-Chapter Checklist Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-7">
          {renderChapterGroup('Ganita Prakash · Part I (Chapters 1–7)', part1Chapters)}
          <div className="border-t border-stone-200 pt-6">
            {renderChapterGroup('Ganita Prakash · Part II (Chapters 1–7)', part2Chapters)}
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // PHASE 3: RESULTS SCREEN
  // =========================================================================
  if (phase === 'results') {
    const pct = totalMarks > 0 ? Math.round((scoreMarks / totalMarks) * 100) : 0;
    return (
      <section
        data-testid="tricky-quiz-results"
        className="max-w-4xl mx-auto space-y-6 pt-2 pb-12"
      >
        <div className="rounded-3xl bg-gradient-to-br from-[#0F3828] to-[#115E59] text-white p-8 space-y-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-teal-200">
                <Award className="w-4 h-4 text-[#FDE047]" />
                <span>Tricky Puzzle Set #{generationCount} Complete</span>
              </div>
              <h2 className="text-3xl font-black">
                You Scored {scoreMarks} out of {totalMarks} Marks ({pct}%)
              </h2>
              <p className="text-sm text-emerald-100/90">
                {isStatsLocked
                  ? 'Sign in with your student account to save this score and inspect your improvement line graphs.'
                  : 'This quiz result has been saved to your Account Quiz Stats & Score Trend Line Graph.'}
              </p>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-amber-400 text-stone-950 text-center tabular-nums">
              <div className="text-[11px] font-bold uppercase">Accuracy</div>
              <div className="text-3xl font-black">{pct}%</div>
            </div>
          </div>

          {/* Per-chapter performance breakdown */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono uppercase tracking-wider text-teal-200">
              Breakdown by Chosen Chapter
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {chapterBreakdown.map((item) => (
                <div
                  key={item.chapterId}
                  className="p-3.5 rounded-2xl bg-black/25 border border-white/15 flex items-center justify-between gap-3 text-xs"
                >
                  <span className="font-bold text-white truncate">{item.label}</span>
                  <span className="font-black text-[#FDE047] tabular-nums shrink-0">
                    {item.correct}/{item.total} ({item.pct}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Result Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleGenerateFreshSet}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2DD4BF] hover:bg-[#14B8A6] text-stone-950 font-black text-sm transition cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              <span>Generate Another Different Set</span>
            </button>

            <button
              type="button"
              onClick={() => setPhase('setup')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm transition cursor-pointer"
            >
              <span>Change Chapters or Formats</span>
            </button>

            {isStatsLocked && onRequestSignIn ? (
              <button
                type="button"
                onClick={onRequestSignIn}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FDE047] hover:bg-[#FACC15] text-stone-950 font-black text-sm transition cursor-pointer"
              >
                <span>Sign In to Save Stats</span>
              </button>
            ) : (
              onOpenAccountStats && (
                <button
                  type="button"
                  data-testid="results-open-quiz-stats-btn"
                  onClick={onOpenAccountStats}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FDE047] hover:bg-[#FACC15] text-stone-950 font-black text-sm transition cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>View Quiz Stats &amp; Line Graphs</span>
                </button>
              )
            )}

            <button
              type="button"
              onClick={onBackToHub}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-black/30 hover:bg-black/45 text-emerald-100 font-bold text-sm transition cursor-pointer"
            >
              <span>Return to Chapter Hub</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // PHASE 2: ACTIVE MULTI-FORMAT PUZZLE ARENA
  // =========================================================================
  const sourceChapter = allChapters.find((c) => c.id === currentQuestion?.sourceChapterId);
  const currentStatus = currentQuestion
    ? getQuestionEarnedMarks(currentQuestion, currentIdx)
    : { earned: 0, total: 1, submitted: false };

  const activeFormatBadge =
    currentQuestion?.formatType === 'mcq' && currentQuestion.mcqSubKind === 'assertion-reason'
      ? 'MCQ · Assertion–Reason (1 Mark)'
      : currentQuestion?.formatType === 'mcq'
      ? 'MCQ · Normal (1 Mark)'
      : currentQuestion?.formatType === 'subjective'
      ? 'Subjective · Answer Only (1 Mark)'
      : currentQuestion?.formatType === 'long-answer'
      ? 'Long Answer · Type or Scan (Lenient Check)'
      : 'Case Study · Real-Life Scenario (4 Questions)';

  return (
    <section
      data-testid="tricky-quiz-active"
      className="max-w-5xl mx-auto space-y-6 pt-2 pb-12"
    >
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0F766E]">
              <ClipboardCheck className="w-4 h-4" />
              <span>
                Tricky Textbook Puzzles · Set #{generationCount} ({questions.length} Cards ·{' '}
                {totalMarks} Marks)
              </span>
            </div>
            <h2 className="text-2xl font-black text-stone-900">
              Multi-Format NCERT Challenge
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-4 py-2 rounded-2xl bg-[#0F3828] text-white text-center tabular-nums">
              <div className="text-[10px] uppercase tracking-wider text-teal-300 font-bold">
                Marks
              </div>
              <div className="text-lg font-bold" data-testid="tricky-score-display">
                {scoreMarks} / {totalMarks}
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateFreshSet}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold text-xs transition cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              <span>New Set</span>
            </button>

            <button
              type="button"
              onClick={() => setPhase('setup')}
              className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition cursor-pointer"
            >
              Formats &amp; Chapters
            </button>

            <button
              type="button"
              onClick={handleFinishQuiz}
              data-testid="finish-tricky-20q-btn"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs transition cursor-pointer shadow-xs"
            >
              <Trophy className="w-4 h-4" />
              <span>Grade &amp; Finish</span>
            </button>
          </div>
        </div>

        {/* Inline Quiz Settings Difficulty Slider while taking the Puzzle */}
        <QuizDifficultySlider
          difficulty={resolvedDifficulty}
          autoMatchProgress={activeSettings.autoMatchProgress}
          recommendedLevel={recommendedDifficulty}
          recommendedReason={recommendedReason}
          onSelectDifficulty={handleSelectDifficultyLevel}
          onToggleAutoMatch={handleToggleAutoMatchLevel}
          variant="card"
          compact={true}
          testIdPrefix="tricky-active-difficulty"
        />

        {/* Card Jump Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {questions.map((q, idx) => {
            const st = getQuestionEarnedMarks(q, idx);
            const isCur = idx === currentIdx;
            const hasAnyProgress =
              q.formatType === 'case-study' &&
              Object.values(csStates[idx] || {}).some((s) => s?.submitted);

            let cls = 'bg-stone-100 text-stone-700 border-stone-300';
            if (st.submitted) {
              if (st.earned === st.total) {
                cls = 'bg-emerald-600 text-white border-emerald-600';
              } else if (st.earned > 0) {
                cls = 'bg-amber-500 text-stone-950 border-amber-500';
              } else {
                cls = 'bg-rose-600 text-white border-rose-600';
              }
            } else if (hasAnyProgress) {
              cls = 'bg-amber-100 text-amber-900 border-amber-400';
            } else if (isCur) {
              cls = 'bg-[#0F766E] text-white border-[#0F766E]';
            }

            const shortTag =
              q.formatType === 'case-study'
                ? 'CS'
                : q.formatType === 'long-answer'
                ? 'LA'
                : q.formatType === 'subjective'
                ? 'S'
                : q.mcqSubKind === 'assertion-reason'
                ? 'AR'
                : '';

            return (
              <button
                key={q.id}
                type="button"
                data-testid={`tricky-jump-q-${idx + 1}`}
                aria-label={`Jump to Card ${idx + 1} (${q.formatType})`}
                onClick={() => setCurrentIdx(idx)}
                className={`min-w-9 h-9 px-2 rounded-full border text-xs font-bold tabular-nums transition-colors cursor-pointer flex items-center justify-center gap-1 ${cls} ${
                  isCur ? 'ring-2 ring-amber-400 ring-offset-1' : ''
                }`}
              >
                <span>{idx + 1}</span>
                {shortTag && <span className="text-[9px] opacity-85">{shortTag}</span>}
              </button>
            );
          })}
        </div>

        {/* Active Card Panel */}
        {currentQuestion && (
          <div
            data-testid={`tricky-card-format-${currentQuestion.formatType}`}
            className="rounded-3xl bg-[#FAF6EE] border-2 border-[#E5DEC9] p-6 md:p-8 space-y-6"
          >
            {/* Header & Format Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                <Sparkles className="w-4 h-4" />
                Card {currentIdx + 1} of {questions.length} ·{' '}
                {sourceChapter
                  ? `${sourceChapter.partLabel} Ch ${sourceChapter.chapterNumber} (${sourceChapter.title})`
                  : currentQuestion.moduleRef}
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  data-testid="active-question-format-badge"
                  className="px-3 py-1 rounded-full bg-[#12352B] text-[#FDE047] text-[11px] font-extrabold uppercase tracking-wider"
                >
                  {activeFormatBadge}
                </span>
                <span className="text-xs font-bold text-stone-600 tabular-nums">
                  Completed: {answeredCardsCount} / {questions.length}
                </span>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* FORMAT 1A: ASSERTION-REASON CALLOUTS                          */}
            {/* ------------------------------------------------------------- */}
            {currentQuestion.formatType === 'mcq' &&
              currentQuestion.mcqSubKind === 'assertion-reason' &&
              currentQuestion.assertion &&
              currentQuestion.reason && (
                <div className="space-y-3" data-testid="assertion-reason-card">
                  <div className="p-4 rounded-2xl bg-white border border-stone-300 space-y-1">
                    <div className="text-[11px] font-black uppercase tracking-wider text-[#0F766E]">
                      Assertion (A)
                    </div>
                    <p className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                      {formatMathText(currentQuestion.assertion)}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-stone-300 space-y-1">
                    <div className="text-[11px] font-black uppercase tracking-wider text-amber-800">
                      Reason (R)
                    </div>
                    <p className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                      {formatMathText(currentQuestion.reason)}
                    </p>
                  </div>
                </div>
              )}

            {/* Prompt Heading (for Normal MCQ, Subjective, Long Answer) */}
            {(currentQuestion.formatType === 'mcq' &&
              currentQuestion.mcqSubKind !== 'assertion-reason') ||
            currentQuestion.formatType === 'subjective' ||
            currentQuestion.formatType === 'long-answer' ? (
              <h3 className="text-xl md:text-2xl font-bold text-stone-900 leading-snug">
                {formatMathText(currentQuestion.prompt)}
              </h3>
            ) : null}

            {/* ------------------------------------------------------------- */}
            {/* FORMAT 1: MCQ OPTIONS (NORMAL & ASSERTION-REASON)             */}
            {/* ------------------------------------------------------------- */}
            {currentQuestion.formatType === 'mcq' && (
              <div
                className={`grid gap-3.5 ${
                  currentQuestion.mcqSubKind === 'assertion-reason'
                    ? 'grid-cols-1'
                    : 'grid-cols-1 sm:grid-cols-2'
                }`}
              >
                {currentQuestion.options.map((opt, idx) => {
                  const chosen = selectedOptions[currentIdx] === idx;
                  const isSub = Boolean(submittedQuestions[currentIdx]);
                  let cardClass =
                    'bg-white hover:bg-[#F0FDFA] border-stone-300 text-stone-900';
                  if (isSub) {
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
                      disabled={isSub}
                      data-testid={`mcq-option-${idx}`}
                      onClick={() => handleSelectMcqOption(idx)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${cardClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center text-xs font-bold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm sm:text-base font-semibold">
                          {formatMathText(opt)}
                        </span>
                      </div>
                      {isSub && idx === currentQuestion.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                      )}
                      {isSub && chosen && idx !== currentQuestion.correctIndex && (
                        <XCircle className="w-5 h-5 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* FORMAT 2: SUBJECTIVE (ANSWER ONLY — LENIENT CHECK)            */}
            {/* ------------------------------------------------------------- */}
            {currentQuestion.formatType === 'subjective' && (
              <div
                data-testid="subjective-answer-box"
                className="p-5 rounded-2xl bg-white border-2 border-stone-200 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor={`subj-input-${currentIdx}`}
                    className="text-xs font-extrabold uppercase tracking-wider text-[#0F766E]"
                  >
                    Final Answer Only (Slightly Lenient Checking)
                  </label>
                  <span className="text-[11px] font-medium text-stone-500">
                    Accepts numbers, fractions (e.g. 3/4), ±0.05 decimals, and optional units
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    id={`subj-input-${currentIdx}`}
                    data-testid="subjective-answer-input"
                    type="text"
                    disabled={Boolean(submittedQuestions[currentIdx])}
                    value={subjectiveInputs[currentIdx] || ''}
                    onChange={(e) =>
                      setSubjectiveInputs((prev) => ({
                        ...prev,
                        [currentIdx]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCheckSubjective();
                    }}
                    placeholder="Type your exact answer here..."
                    className="flex-1 min-w-[220px] px-4 py-3 rounded-xl border-2 border-stone-300 text-base font-bold text-stone-900 focus:outline-none focus:border-[#0F766E] disabled:bg-stone-50"
                  />

                  {!submittedQuestions[currentIdx] && (
                    <button
                      type="button"
                      data-testid="subjective-check-btn"
                      disabled={!(subjectiveInputs[currentIdx] || '').trim()}
                      onClick={handleCheckSubjective}
                      className="px-6 py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 text-white font-black text-sm transition cursor-pointer disabled:cursor-not-allowed"
                    >
                      Check Answer
                    </button>
                  )}
                </div>

                {submittedQuestions[currentIdx] && (
                  <div
                    className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                      subjectiveCorrect[currentIdx]
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-sm font-bold">
                      {subjectiveCorrect[currentIdx] ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                      <span>
                        {subjectiveCorrect[currentIdx]
                          ? `Correct! Accepted answer: ${formatMathText(
                              currentQuestion.acceptedAnswers[0] || ''
                            )}`
                          : `Expected answer: ${formatMathText(
                              currentQuestion.acceptedAnswers[0] || ''
                            )}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* FORMAT 3: LONG ANSWER (TYPE OR SCAN + LENIENT GRADING)        */}
            {/* ------------------------------------------------------------- */}
            {currentQuestion.formatType === 'long-answer' && (
              <div
                data-testid="long-answer-box"
                className="p-5 rounded-2xl bg-white border-2 border-stone-200 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wider text-[#0F766E]">
                      Step-by-Step Working Required · Lenient Method Grading
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Type your mathematical steps OR scan/upload a photo of your handwritten notebook solution.
                    </p>
                  </div>

                  <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200">
                    <button
                      type="button"
                      data-testid="long-mode-type-btn"
                      onClick={() => {
                        stopCameraStream();
                        setLongInputMode('type');
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        longInputMode === 'type'
                          ? 'bg-[#0F766E] text-white shadow-2xs'
                          : 'text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      <Keyboard className="w-3.5 h-3.5" />
                      <span>Type Solution</span>
                    </button>
                    <button
                      type="button"
                      data-testid="long-mode-scan-btn"
                      onClick={() => setLongInputMode('scan')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        longInputMode === 'scan'
                          ? 'bg-[#0F766E] text-white shadow-2xs'
                          : 'text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Scan / Upload Photo</span>
                    </button>
                  </div>
                </div>

                {longInputMode === 'type' ? (
                  <textarea
                    data-testid="long-answer-textarea"
                    rows={5}
                    disabled={Boolean(submittedQuestions[currentIdx])}
                    value={longInputs[currentIdx] || ''}
                    onChange={(e) =>
                      setLongInputs((prev) => ({
                        ...prev,
                        [currentIdx]: e.target.value,
                      }))
                    }
                    placeholder="Write each step on a new line (formula, substitution, intermediate calculation, and final answer)..."
                    className="w-full p-4 rounded-xl border-2 border-stone-300 text-sm sm:text-base font-medium text-stone-900 focus:outline-none focus:border-[#0F766E] disabled:bg-stone-50"
                  />
                ) : (
                  <div
                    data-testid="long-scan-panel"
                    className="p-4 rounded-xl bg-[#FAF6EE] border border-stone-300 space-y-3"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold transition cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>Upload Photo / Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={Boolean(submittedQuestions[currentIdx])}
                          data-testid="long-file-upload-input"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>

                      {!isCameraActive ? (
                        <button
                          type="button"
                          disabled={Boolean(submittedQuestions[currentIdx])}
                          data-testid="long-open-camera-btn"
                          onClick={handleStartCamera}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white text-xs font-bold transition cursor-pointer"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Scan Using Camera</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleCaptureCamera}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black transition cursor-pointer"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span>Capture Page</span>
                        </button>
                      )}
                    </div>

                    {cameraError && (
                      <p className="text-xs font-semibold text-rose-700">{cameraError}</p>
                    )}

                    {isCameraActive && (
                      <div className="rounded-xl overflow-hidden bg-black max-w-md border border-stone-300">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-56 object-cover"
                        />
                      </div>
                    )}

                    {longImages[currentIdx] && (
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-200">
                        <img
                          src={longImages[currentIdx].dataUrl}
                          alt="Scanned handwritten math solution"
                          className="w-28 h-24 object-cover rounded-lg border border-stone-300"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="text-xs font-bold text-stone-900">
                            Handwritten Solution Attached
                          </div>
                          <p className="text-[11px] text-stone-600">
                            Ready for lenient examiner evaluation.
                          </p>
                          {!submittedQuestions[currentIdx] && (
                            <button
                              type="button"
                              onClick={() =>
                                setLongImages((prev) => {
                                  const next = { ...prev };
                                  delete next[currentIdx];
                                  return next;
                                })
                              }
                              className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-800 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Image</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!submittedQuestions[currentIdx] && (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-stone-500">
                      Method &amp; valid reasoning earn full/partial credit even with small arithmetic slips.
                    </span>
                    <button
                      type="button"
                      data-testid="long-submit-grade-btn"
                      disabled={
                        isGradingLong ||
                        (!(longInputs[currentIdx] || '').trim() && !longImages[currentIdx])
                      }
                      onClick={handleGradeLongAnswer}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 text-white font-black text-sm transition cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isGradingLong ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Checking Steps...</span>
                        </>
                      ) : (
                        <span>Submit for Lenient Check</span>
                      )}
                    </button>
                  </div>
                )}

                {submittedQuestions[currentIdx] && longResults[currentIdx] && (
                  <div
                    data-testid="long-grade-feedback"
                    className={`p-4 rounded-xl border space-y-2 ${
                      longResults[currentIdx].isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-black">
                        {longResults[currentIdx].isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600" />
                        )}
                        <span>
                          {longResults[currentIdx].isCorrect
                            ? 'Credit Awarded (1/1 Mark)'
                            : 'Needs More Step Clarity (0/1 Mark)'}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-lg bg-white border border-stone-300 text-xs font-black tabular-nums">
                        Method Score: {longResults[currentIdx].creditScore} / 10
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {longResults[currentIdx].feedback}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* FORMAT 4: CASE STUDY (REAL-LIFE SCENARIO + 4 QUESTIONS a–d)   */}
            {/* ------------------------------------------------------------- */}
            {currentQuestion.formatType === 'case-study' &&
              Array.isArray(currentQuestion.subQuestions) && (
                <div data-testid="case-study-card" className="space-y-5">
                  <div className="p-5 rounded-2xl bg-[#0F3828] text-white space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FDE047]">
                        Real-Life Scenario · {currentQuestion.scenarioTitle}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-white/15 text-xs font-bold tabular-nums">
                        Sub-Score: {currentStatus.earned} / {currentStatus.total}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-medium">
                      {formatMathText(currentQuestion.scenarioText || currentQuestion.prompt)}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {currentQuestion.subQuestions.map((sub, sIdx) => {
                      const subState = csStates[currentIdx]?.[sIdx] || {
                        submitted: false,
                        isCorrect: false,
                      };

                      return (
                        <div
                          key={sub.subLabel}
                          data-testid={`cs-sub-${sIdx}`}
                          className="p-5 rounded-2xl bg-white border-2 border-stone-200 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-full bg-[#0F766E] text-white text-xs font-black flex items-center justify-center uppercase">
                                {sub.subLabel}
                              </span>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                {sub.subType === 'mcq' ? 'MCQ Sub-Question' : 'Subjective Sub-Question'} · 1 Mark
                              </span>
                            </div>

                            {subState.submitted && (
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-black ${
                                  subState.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                                }`}
                              >
                                {subState.isCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Correct (+1)</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4" />
                                    <span>Incorrect</span>
                                  </>
                                )}
                              </span>
                            )}
                          </div>

                          <p className="text-base font-bold text-stone-900 leading-snug">
                            {formatMathText(sub.prompt)}
                          </p>

                          {sub.subType === 'mcq' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {sub.options.map((opt, oIdx) => {
                                const chosen = subState.selectedOption === oIdx;
                                let optCls =
                                  'bg-[#FAF6EE] hover:bg-[#F0FDFA] border-stone-300 text-stone-900';
                                if (subState.submitted) {
                                  if (oIdx === sub.correctIndex) {
                                    optCls =
                                      'bg-emerald-600 text-white border-emerald-600 font-bold';
                                  } else if (chosen) {
                                    optCls = 'bg-rose-600 text-white border-rose-600';
                                  } else {
                                    optCls = 'bg-stone-100 text-stone-400 border-stone-200';
                                  }
                                }
                                return (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    disabled={subState.submitted}
                                    data-testid={`cs-sub-${sIdx}-opt-${oIdx}`}
                                    onClick={() => handleCaseStudyMcq(sIdx, oIdx)}
                                    className={`p-3 rounded-xl border text-left text-sm font-semibold transition cursor-pointer flex items-center gap-2.5 ${optCls}`}
                                  >
                                    <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-[11px] font-bold shrink-0">
                                      {String.fromCharCode(65 + oIdx)}
                                    </span>
                                    <span>{formatMathText(opt)}</span>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex flex-wrap items-center gap-2.5">
                              <input
                                type="text"
                                disabled={subState.submitted}
                                data-testid={`cs-sub-${sIdx}-input`}
                                value={subState.textInput || ''}
                                onChange={(e) =>
                                  handleCaseStudySubjectiveChange(sIdx, e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleCaseStudyCheckSubjective(sIdx);
                                }}
                                placeholder="Enter value..."
                                className="flex-1 min-w-[180px] px-3.5 py-2.5 rounded-xl border-2 border-stone-300 text-sm font-bold text-stone-900 focus:outline-none focus:border-[#0F766E] disabled:bg-stone-50"
                              />
                              {!subState.submitted && (
                                <button
                                  type="button"
                                  data-testid={`cs-sub-${sIdx}-check-btn`}
                                  disabled={!(subState.textInput || '').trim()}
                                  onClick={() => handleCaseStudyCheckSubjective(sIdx)}
                                  className="px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 text-white text-xs font-black transition cursor-pointer"
                                >
                                  Check
                                </button>
                              )}
                            </div>
                          )}

                          {subState.submitted && (
                            <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200 leading-relaxed">
                              <strong>Answer:</strong>{' '}
                              {sub.subType === 'mcq'
                                ? formatMathText(sub.options[sub.correctIndex])
                                : formatMathText(sub.acceptedAnswers[0] || '')}{' '}
                              — {formatMathText(sub.explanation)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Shared Model Solution Footer once card is graded/completed */}
            {currentStatus.submitted && (
              <div className="p-5 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#2DD4BF]">
                    {currentStatus.earned === currentStatus.total
                      ? 'Full Credit Earned!'
                      : 'Step-by-Step Model Solution'}
                  </div>
                  <p className="text-sm text-emerald-100 leading-relaxed">
                    {formatMathText(currentQuestion.explanation)}
                  </p>
                </div>

                {currentIdx < questions.length - 1 ? (
                  <button
                    type="button"
                    data-testid="tricky-next-card-btn"
                    onClick={() => setCurrentIdx((i) => i + 1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2DD4BF] hover:bg-[#14B8A6] text-stone-950 font-bold text-sm transition cursor-pointer"
                  >
                    <span>Next Card</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    data-testid="tricky-view-final-btn"
                    onClick={handleFinishQuiz}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm transition cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Final Score</span>
                  </button>
                )}
              </div>
            )}

            {/* Always-accessible Card Navigation (Previous / Next Card) */}
            {!currentStatus.submitted && questions.length > 1 && (
              <div className="flex items-center justify-between pt-2 border-t border-stone-300/60">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-100 disabled:opacity-40 text-stone-800 border border-stone-300 text-xs font-bold transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  disabled={currentIdx === questions.length - 1}
                  onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-100 disabled:opacity-40 text-stone-800 border border-stone-300 text-xs font-bold transition cursor-pointer"
                >
                  <span>Skip / Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
