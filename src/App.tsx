import React, { useState, useMemo, useEffect } from 'react';
import { GANITA_CHAPTERS, getChapterById } from './data/presets';
import {
  ChapterId,
  GanitaChapter,
  MathHomeworkSolution,
  StudentDiagnosticProfile,
} from './types/math';
import { DiagnosticQuestionnaire } from './components/DiagnosticQuestionnaire';
import { Part1ChapterHub } from './components/Part1ChapterHub';
import { GeniusBarDrawer } from './components/GeniusBarDrawer';

export default function App() {
  const [showQuestionnaire, setShowQuestionnaire] = useState<boolean>(true);
  const [questionnaireStage, setQuestionnaireStage] = useState<
    'welcome' | 'chapters' | 'segments'
  >('welcome');

  const [activeChapterId, setActiveChapterId] = useState<string>(
    GANITA_CHAPTERS[0].id
  );

  const [diagnosticProfile, setDiagnosticProfile] =
    useState<StudentDiagnosticProfile>({
      completedQuestionnaire: true,
      chapterId: GANITA_CHAPTERS[0].id,
      segmentId: GANITA_CHAPTERS[0].segments[0].id,
      difficultyFocus: 'intuition',
    });

  const [customSolutionsByChapter, setCustomSolutionsByChapter] = useState<
    Record<string, MathHomeworkSolution[]>
  >({});
  const [activeSolution, setActiveSolution] = useState<MathHomeworkSolution>(
    GANITA_CHAPTERS[0].segments[0].featuredSolution
  );
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [masteryPoints, setMasteryPoints] = useState<number>(120);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [showQuestionnaire, activeChapterId]);

  const activeChapter: GanitaChapter = useMemo(
    () => getChapterById(diagnosticProfile.chapterId),
    [diagnosticProfile.chapterId]
  );

  const activeSegment = useMemo(
    () =>
      activeChapter.segments.find(
        (s) => s.id === diagnosticProfile.segmentId
      ) || activeChapter.segments[0],
    [activeChapter, diagnosticProfile.segmentId]
  );

  const chapterSolutions = useMemo(() => {
    const segmentProblems = activeChapter.segments.flatMap((s) => [
      s.featuredSolution,
      ...s.extraProblems,
    ]);
    const customList = customSolutionsByChapter[activeChapter.id] || [];
    return [...customList, ...segmentProblems];
  }, [activeChapter, customSolutionsByChapter]);

  const handleDiagnosticComplete = (profile: StudentDiagnosticProfile) => {
    const ch = getChapterById(profile.chapterId);
    const seg =
      ch.segments.find((s) => s.id === profile.segmentId) || ch.segments[0];
    setDiagnosticProfile(profile);
    setActiveChapterId(profile.chapterId);
    setActiveSolution(seg.featuredSolution);
    setActiveStepIndex(0);
    setErrorMsg(null);
    setShowQuestionnaire(false);
  };

  const handleOpenChapterPicker = () => {
    setQuestionnaireStage('chapters');
    setShowQuestionnaire(true);
  };

  const handleSwitchChapterById = (chapterId: string) => {
    setActiveChapterId(chapterId);
    setShowQuestionnaire(false);
    if (chapterId !== 'ch8-master-quiz') {
      const ch = getChapterById(chapterId as ChapterId);
      const firstSeg = ch.segments[0];
      setDiagnosticProfile((prev) => ({
        ...prev,
        completedQuestionnaire: true,
        chapterId: ch.id,
        segmentId: firstSeg.id,
      }));
      setActiveSolution(firstSeg.featuredSolution);
      setActiveStepIndex(0);
      setErrorMsg(null);
    }
  };

  const handleSelectSolution = (sol: MathHomeworkSolution) => {
    setActiveSolution(sol);
    setActiveStepIndex(0);
    setErrorMsg(null);
    const matchingSeg = activeChapter.segments.find(
      (s) =>
        s.featuredSolution.id === sol.id ||
        s.extraProblems.some((ep) => ep.id === sol.id)
    );
    if (matchingSeg) {
      setDiagnosticProfile((prev) => ({
        ...prev,
        segmentId: matchingSeg.id,
      }));
    }
  };

  const handleSolveCustom = async ({
    problemText,
    imageBase64,
    imageMimeType,
    explanationStyle,
  }: {
    problemText: string;
    imageBase64?: string;
    imageMimeType?: string;
    explanationStyle: 'balanced' | 'arcade' | 'visual';
  }) => {
    setIsSolving(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemText,
          imageBase64,
          imageMimeType,
          explanationStyle,
          chapterContext: `${activeChapter.partLabel} Chapter ${activeChapter.chapterNumber}: ${activeChapter.title} — ${activeSegment.segmentCode}: ${activeSegment.title}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || 'Could not solve this problem right now.'
        );
      }

      const solvedProblem: MathHomeworkSolution = {
        ...data,
        graphConfig: {
          ...data.graphConfig,
          xDomain:
            Array.isArray(data.graphConfig?.xDomain) &&
            data.graphConfig.xDomain.length === 2
              ? [
                  Number(data.graphConfig.xDomain[0]),
                  Number(data.graphConfig.xDomain[1]),
                ]
              : [-8, 8],
          yDomain:
            Array.isArray(data.graphConfig?.yDomain) &&
            data.graphConfig.yDomain.length === 2
              ? [
                  Number(data.graphConfig.yDomain[0]),
                  Number(data.graphConfig.yDomain[1]),
                ]
              : [-8, 8],
          parameters: Array.isArray(data.graphConfig?.parameters)
            ? data.graphConfig.parameters
            : [],
          keyPoints: Array.isArray(data.graphConfig?.keyPoints)
            ? data.graphConfig.keyPoints
            : [],
        },
      };

      setCustomSolutionsByChapter((prev) => ({
        ...prev,
        [activeChapter.id]: [
          solvedProblem,
          ...(prev[activeChapter.id] || []),
        ],
      }));
      setActiveSolution(solvedProblem);
      setActiveStepIndex(0);
      setMasteryPoints((pts) => pts + 25);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to connect to the math solver. Please check your problem syntax.';
      setErrorMsg(message);
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start classroom-backdrop text-[#1C1917]">
      <main
        id="top"
        className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 pt-6 pb-14 flex-1"
      >
        {showQuestionnaire ? (
          <DiagnosticQuestionnaire
            chapters={GANITA_CHAPTERS}
            initialProfile={diagnosticProfile}
            initialStage={questionnaireStage}
            onComplete={handleDiagnosticComplete}
            onClose={() => setShowQuestionnaire(false)}
          />
        ) : (
          <Part1ChapterHub
            allChapters={GANITA_CHAPTERS}
            activeChapterId={activeChapterId}
            onSelectChapterId={handleSwitchChapterById}
            onOpenAllChaptersModal={handleOpenChapterPicker}
            activeSolution={activeSolution}
            activeStepIndex={activeStepIndex}
            onSelectStep={(idx) => setActiveStepIndex(idx)}
            chapterSolutions={chapterSolutions}
            onSelectSolution={handleSelectSolution}
            onSolveCustom={handleSolveCustom}
            isSolving={isSolving}
            errorMsg={errorMsg}
            masteryPoints={masteryPoints}
            onAddPoints={(pts) => setMasteryPoints((prev) => prev + pts)}
          />
        )}
      </main>

      {/* Clean Minimal Classroom Footer */}
      <footer className="border-t border-stone-300 bg-[#FAF6EE] mt-auto">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 py-6 flex flex-col gap-3 text-xs sm:text-sm text-stone-600">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-[#0F766E]">
              Ganita Prakash Class 8 Interactive Classroom · Part I (Ch 1–7, 56 Modules) &amp; Part II (Ch 1–7, 56 Modules)
            </span>
            <span className="font-mono tabular-nums text-stone-700 font-semibold">
              Mastery Score: {masteryPoints} pts
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            {GANITA_CHAPTERS.map((ch, idx) => {
              const isCurrent = ch.id === activeChapterId;
              return (
                <React.Fragment key={ch.id}>
                  {idx > 0 && <span aria-hidden="true">·</span>}
                  <button
                    type="button"
                    onClick={() => handleSwitchChapterById(ch.id)}
                    className={`transition-colors cursor-pointer ${
                      isCurrent
                        ? 'text-[#0F766E] font-bold underline underline-offset-4'
                        : 'hover:text-stone-950 font-medium'
                    }`}
                  >
                    {ch.partLabel} Ch {ch.chapterNumber}: {ch.title}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </footer>

      {/* Floating Circle Trigger + Slide-Over "Genius Bar" Q&A & Camera Scanner Side Tab (Hidden on Intro & Chapter Selection screens) */}
      {!showQuestionnaire && <GeniusBarDrawer />}
    </div>
  );
}
