import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sliders,
  Trophy,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Award,
  Sparkles,
  Gamepad2,
  Heart,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Scale,
  Rocket,
  Compass,
  Zap,
  Target,
  Grid,
  ShieldAlert,
  Boxes,
  Key,
  Lock,
  Layers,
  Shapes,
  Hash,
  ShoppingBag,
  Percent,
  Triangle,
  PieChart,
  BarChart3,
  Calendar,
  MapPin,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ModuleSimulationConfig, ModuleGameConfig } from '../types/part1Curriculum';
import { formatMathText } from '../utils/formatMath';
import { MasteryBadgeDefinition } from '../data/masteryBadges';
import { getRecapQuizConfig, RecapQuizConfig } from '../utils/moduleRecapQuestions';
import { fireBigAchievementConfetti, playAchievementFanfare } from './BadgeAchievementModal';

interface Part1ModuleSimAndGameProps {
  moduleCode: string;
  moduleId?: string;
  chapterId?: string;
  simulation: ModuleSimulationConfig;
  game: ModuleGameConfig;
  mode: 'simulation' | 'game' | 'quiz';
  badge?: MasteryBadgeDefinition;
  isBadgeUnlocked?: boolean;
  onUnlockBadge?: (badgeId: string, rewardPoints: number) => void;
  onGoToGame?: () => void;
  onGoToQuiz?: () => void;
  onAddGamePoints?: (points: number) => void;
  isLastModule?: boolean;
}

// ============================================================================
// WEB AUDIO API SYNTHESIZER (Pure client-side, zero external audio dependencies)
// ============================================================================
function playSound(type: 'hit' | 'miss' | 'win' | 'click' | 'step', soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    if (type === 'hit') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'miss') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.24);
    } else if (type === 'win') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, now + idx * 0.08);
        g.gain.setValueAtTime(0.18, now + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.24);
        o.start(now + idx * 0.08);
        o.stop(now + idx * 0.08 + 0.26);
      });
    } else if (type === 'click' || type === 'step') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(700, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Non-blocking catch
  }
}

export const Part1ModuleSimAndGame: React.FC<Part1ModuleSimAndGameProps> = ({
  moduleCode,
  moduleId = '',
  chapterId = '',
  simulation,
  game,
  mode,
  badge,
  isBadgeUnlocked = false,
  onUnlockBadge,
  onGoToGame,
  onGoToQuiz,
  onAddGamePoints,
  isLastModule = false,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  // --------------------------------------------------------------------------
  // SLIDE 3: SIMULATION CONTROLS STATE
  // --------------------------------------------------------------------------
  const [simA, setSimA] = useState<number>(simulation.defaultControlA);
  const [simB, setSimB] = useState<number>(simulation.defaultControlB ?? 3);
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simStudentStep, setSimStudentStep] = useState<number>(1);
  const [selectedLockerInspect, setSelectedLockerInspect] = useState<number | null>(null);

  useEffect(() => {
    setSimA(simulation.defaultControlA);
    setSimB(simulation.defaultControlB ?? 3);
    setSimRunning(false);
    setSimStudentStep(1);
    setSelectedLockerInspect(null);
  }, [moduleCode, simulation]);

  // Hallway Locker Wave Runner
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (simRunning && simStudentStep <= simA) {
      timer = setTimeout(() => {
        setSimStudentStep((prev) => prev + 1);
        playSound('step', soundEnabled);
      }, 350);
    } else if (simRunning && simStudentStep > simA) {
      setSimRunning(false);
      playSound('win', soundEnabled);
    }
    return () => clearTimeout(timer);
  }, [simRunning, simStudentStep, simA, soundEnabled]);

  // --------------------------------------------------------------------------
  // SLIDE 4: PLAYABLE MINI-GAME STATE
  // --------------------------------------------------------------------------
  type GameStage = 'ready' | 'playing' | 'game_over' | 'victory';
  const [gameStage, setGameStage] = useState<GameStage>('ready');
  const [lives, setLives] = useState<number>(3);
  const [gameScore, setGameScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [gameRound, setGameRound] = useState<number>(1);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [wrongTiles, setWrongTiles] = useState<number[]>([]);
  const [selectedStrings, setSelectedStrings] = useState<string[]>([]);
  const [gameTimer, setGameTimer] = useState<number>(35);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);

  // DETERMINISTIC GAME ENGINE ID RESOLVER
  // Matches each module & chapter directly without any incorrect fallbacks!
  const resolvedGameEngine = useMemo(() => {
    const t = simulation.interactionType;
    const ch = chapterId.toLowerCase();
    const mod = moduleId.toLowerCase();

    // 1. Part I Chapter 1: A Square and a Cube
    if (mod === 'mod-1-1' || t === 'locker-grid') return 'lockers-quest';
    if (mod === 'mod-1-2' || t === 'unit-digit-machine') return 'forbidden-digits';
    if (mod === 'mod-1-3' || t === 'odd-l-grid') return 'odd-builder';
    if (mod === 'mod-1-4' || t === 'prime-factor-scale') return 'prime-twins';
    if (mod === 'mod-1-5' || t === 'cube-3d-stacker') return 'cube-paint';
    if (mod === 'mod-1-6' || t === 'taxicab-analyzer') return 'taxicab-duel';
    if (mod === 'mod-1-7' || t === 'difference-table') return 'cube-diff';
    if (mod === 'mod-1-8' || t === 'treasury-vault') return 'treasury-vault';

    // 2. Part I Chapter 2: Power Play (Exponents)
    if (ch.includes('ch2-power-play') || mod.startsWith('mod-2-') || t === 'paper-folder' || t === 'power-line' || t === 'bracket-expander' || t === 'prime-exp-converter' || t === 'halving-scale') {
      return 'power-orbit';
    }

    // 3. Part I Chapter 3: A Story of Numbers
    if (ch.includes('ch3-story-numbers') || mod.startsWith('mod-3-') || t === 'roman-board' || t === 'babylonian-translator' || t === 'brahmi-timeline' || t === 'base-n-converter') {
      return 'ancient-ciphers';
    }

    // 4. Part I Chapter 4: Quadrilaterals
    if (ch.includes('ch4-quadrilaterals') || mod.startsWith('mod-4-') || t === 'carpenter-strips' || t === 'congruence-overlay' || t === 'square-angle-adjuster' || t === 'diagonal-splitter' || t === 'compass-rhombus') {
      return 'shape-detective';
    }

    // 5. Part I Chapter 5: Number Play
    if (ch.includes('ch5-number-play') || mod.startsWith('mod-5-') || t === 'parity-scale' || t === 'digital-root-adder' || t === 'alternating-sign-balance' || t === 'cryptarithm-grid' || t === 'divisibility-matrix') {
      return 'divisibility-rush';
    }

    // 6. Part I Chapter 6: We Distribute, Yet Things Multiply
    if (ch.includes('ch6-we-distribute') || mod.startsWith('mod-6-') || t === 'distributive-array' || t === 'binomial-tiles' || t === 'nested-square' || t === 'diff-squares-strip') {
      return 'algebra-tiles';
    }

    // 7. Part I Chapter 7: Proportional Reasoning 1
    if (ch.includes('ch7-proportional-1') || mod.startsWith('mod-7-')) {
      return 'trairasika-market';
    }

    // 8. Part II Chapter 1: Fractions in Disguise (Percentages, Discount, Profit/Loss)
    if (ch.includes('fractions-disguise') || mod.startsWith('p2-mod-1-')) {
      return 'percent-matchmaker';
    }

    // 9. Part II Chapter 2: The Baudhāyana-Pythagoras Theorem
    if (ch.includes('baudhayana-pythagoras') || mod.startsWith('p2-mod-2-')) {
      return 'baudhayana-cord';
    }

    // 10. Part II Chapter 3: Proportional Reasoning 2
    if (ch.includes('proportional-reasoning') || mod.startsWith('p2-mod-3-')) {
      return 'pie-scale-surveyor';
    }

    // 11. Part II Chapter 4: Geometric Themes (Fractals, Ant Net)
    if (ch.includes('geometric-themes') || mod.startsWith('p2-mod-4-')) {
      return 'fractal-net-quest';
    }

    // 12. Part II Chapter 5: Tales by Dots and Lines (Mean / Median / Statistics)
    if (ch.includes('dots-and-lines') || mod.startsWith('p2-mod-5-')) {
      return 'data-fulcrum-clash';
    }

    // 13. Part II Chapter 6: Algebra Play (Meru Prastāra & Calendar Tricks)
    if (ch.includes('algebra-play') || mod.startsWith('p2-mod-6-')) {
      return 'genie-algebra';
    }

    // 14. Part II Chapter 7: Area
    if (ch.includes('area') || mod.startsWith('p2-mod-7-')) {
      return 'area-tangram';
    }

    return 'lockers-quest';
  }, [simulation.interactionType, chapterId, moduleId]);

  // Reset Game state when module changes
  useEffect(() => {
    setGameStage('ready');
    setLives(3);
    setGameScore(0);
    setCombo(0);
    setGameRound(1);
    setSelectedTiles([]);
    setWrongTiles([]);
    setSelectedStrings([]);
    setGameTimer(35);
    setGameFeedback(null);
  }, [moduleCode, moduleId]);

  // Robust, non-glitchy Game Timer
  useEffect(() => {
    if (gameStage !== 'playing') return;

    const interval = setInterval(() => {
      setGameTimer((prev) => {
        if (prev > 1) {
          return prev - 1;
        }
        // When timer reaches 0, safely decrement 1 life and reset timer to 30s
        playSound('miss', soundEnabled);
        setCombo(0);
        setGameFeedback('⏱ Round timer expired! -1 Life ❤️');
        setLives((l) => {
          const next = l - 1;
          if (next <= 0) {
            setGameStage('game_over');
          }
          return Math.max(0, next);
        });
        return 30;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStage, soundEnabled]);

  // --------------------------------------------------------------------------
  // SLIDE 5: RECAP QUIZ STATE (DYNAMIC 5-QUESTION RECAP OR 10-MARKER CAPSTONE)
  // --------------------------------------------------------------------------
  const [quizRandomSeed, setQuizRandomSeed] = useState<number>(0);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizShowHint, setQuizShowHint] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizStreak, setQuizStreak] = useState<number>(0);
  const [quizCorrectCount, setQuizCorrectCount] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [hasPassed80Percent, setHasPassed80Percent] = useState<boolean>(false);
  const [isModuleShaking, setIsModuleShaking] = useState<boolean>(false);

  // Dynamic recap quiz configuration: 5 questions for regular modules, 10-marker paper for last module
  const recapConfig: RecapQuizConfig = useMemo(() => {
    return getRecapQuizConfig(
      moduleCode,
      game.title,
      simulation.formulaHighlight,
      game.challenges,
      simulation,
      Boolean(isLastModule),
      quizRandomSeed
    );
  }, [
    moduleCode,
    game.title,
    simulation.formulaHighlight,
    game.challenges,
    simulation,
    isLastModule,
    quizRandomSeed,
  ]);

  const recapRounds = recapConfig.questions;

  useEffect(() => {
    setQuizIndex(0);
    setQuizSelectedOption(null);
    setQuizShowHint(false);
    setQuizScore(0);
    setQuizStreak(0);
    setQuizCorrectCount(0);
    setQuizCompleted(false);
    setHasPassed80Percent(false);
  }, [moduleCode, moduleId, isLastModule]);

  const handleRetakeQuiz = useCallback(() => {
    setQuizRandomSeed((s) => s + 1);
    setQuizIndex(0);
    setQuizSelectedOption(null);
    setQuizShowHint(false);
    setQuizScore(0);
    setQuizStreak(0);
    setQuizCorrectCount(0);
    setQuizCompleted(false);
    setHasPassed80Percent(false);
  }, []);

  // Scoring helper
  const handleAwardGamePoints = useCallback(
    (points: number) => {
      setGameScore((s) => s + points);
      setCombo((c) => c + 1);
      // Balanced EXP: awards 5-10 EXP per challenge to prevent astronomical EXP inflation (Hard Cap: 4,000)
      const balancedExp = Math.min(10, Math.max(2, Math.round(points / 25)));
      if (onAddGamePoints) onAddGamePoints(balancedExp);
    },
    [onAddGamePoints]
  );

  const handleLoseGameLife = useCallback(
    (reason: string) => {
      playSound('miss', soundEnabled);
      setCombo(0);
      setGameFeedback(reason);
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) {
          setGameStage('game_over');
        }
        return Math.max(0, next);
      });
    },
    [soundEnabled]
  );

  // ==========================================================================
  // RENDER SLIDE 3: INTERACTIVE BESPOKE SIMULATIONS
  // ==========================================================================
  const renderSlide3Simulation = () => {
    const t = simulation.interactionType;
    const ch = chapterId.toLowerCase();

    // 1. HALLWAY LOCKER WAVE (Module 1.1)
    if (t === 'locker-grid' || moduleId === 'mod-1-1') {
      const lockerCount = Math.max(12, Math.min(36, simA));
      const lockerStates = Array.from({ length: lockerCount }, (_, idx) => {
        const lockerNum = idx + 1;
        let flips = 0;
        const divisors: number[] = [];
        for (let s = 1; s <= simStudentStep; s++) {
          if (lockerNum % s === 0) {
            flips++;
            divisors.push(s);
          }
        }
        const isOpen = flips % 2 === 1;
        const root = Math.round(Math.sqrt(lockerNum));
        const isPerfectSquare = root * root === lockerNum;
        return { lockerNum, flips, isOpen, isPerfectSquare, divisors };
      });

      const inspected = selectedLockerInspect ? lockerStates[selectedLockerInspect - 1] : null;

      return (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-4 border border-teal-500/30">
            <div>
              <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-300" />
                <span>Queen Ratnamanjuri’s Locker Hallway Simulation</span>
              </div>
              <div className="text-lg font-bold mt-1">
                Student #{Math.min(simStudentStep, lockerCount)} of {lockerCount} walking through the hallway
              </div>
              <div className="text-xs text-teal-200/80 mt-0.5">
                Each student flips lockers whose number is a multiple of their student ID.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (simStudentStep > lockerCount) setSimStudentStep(1);
                  setSimRunning(!simRunning);
                  playSound('click', soundEnabled);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer shadow ${
                  simRunning
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                }`}
              >
                {simRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{simRunning ? 'Pause Students' : 'Run Student Wave'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSimRunning(false);
                  setSimStudentStep(1);
                  playSound('click', soundEnabled);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-teal-100 text-xs font-bold transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSimRunning(false);
                  setSimStudentStep(lockerCount);
                  playSound('win', soundEnabled);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Fast-Forward All</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-2.5">
            {lockerStates.map((l) => (
              <button
                key={l.lockerNum}
                type="button"
                onClick={() => {
                  setSelectedLockerInspect(l.lockerNum);
                  playSound('click', soundEnabled);
                }}
                className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  selectedLockerInspect === l.lockerNum ? 'ring-3 ring-amber-400 scale-105' : ''
                } ${
                  l.isOpen
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white border-emerald-300 shadow-md'
                    : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                }`}
              >
                <div className="text-[10px] font-bold uppercase opacity-80">#{l.lockerNum}</div>
                <div className="text-base font-extrabold mt-1">{l.isOpen ? '🔓 OPEN' : '🔒 SHUT'}</div>
                <div className="text-[10px] mt-1 font-semibold opacity-80">{l.flips} flips</div>
              </button>
            ))}
          </div>

          {inspected && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-stone-900">
              <div className="text-xs font-bold text-amber-900 uppercase">
                Locker #{inspected.lockerNum} Factor Inspector
              </div>
              <div className="text-sm font-semibold mt-1">
                Divisors: [{inspected.divisors.join(', ')}] ({inspected.flips} total factors)
              </div>
              <div className="text-xs text-stone-700 mt-1">
                {inspected.isPerfectSquare ? (
                  <strong className="text-emerald-800">
                    ✨ Perfect Square! Has an ODD number of factors because its square root factor pairs with itself.
                  </strong>
                ) : (
                  <span>Factors come in pairs, so it ends up closed.</span>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    // 2. PROPERTIES OF SQUARE NUMBERS (Module 1.2)
    if (t === 'unit-digit-machine' || moduleId === 'mod-1-2') {
      const n = simA;
      const lastDigitOfN = n % 10;
      const square = n * n;
      const lastDigitOfSquare = square % 10;

      const digitMapping = [
        { endsWith: '0', squareEndsWith: '0 (always pair 00)' },
        { endsWith: '1 or 9', squareEndsWith: '1' },
        { endsWith: '2 or 8', squareEndsWith: '4' },
        { endsWith: '3 or 7', squareEndsWith: '9' },
        { endsWith: '4 or 6', squareEndsWith: '6' },
        { endsWith: '5', squareEndsWith: '5 (always ends in 25)' },
      ];

      return (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-4 border border-teal-500/30">
            <div>
              <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-300" />
                <span>Properties of Square Numbers · Ending Digit Machine</span>
              </div>
              <div className="text-2xl font-black mt-1">
                {n}² = {square} (Unit Digit: <span className="text-amber-300">{lastDigitOfSquare}</span>)
              </div>
              <div className="text-xs text-teal-200 mt-1">
                Because base ends in <strong>{lastDigitOfN}</strong>, its square must end in{' '}
                <strong>{lastDigitOfSquare}</strong>!
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-black text-xs">
              No Square Ever Ends in 2, 3, 7, or 8!
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <div className="text-xs font-black uppercase text-rose-800">
                The Forbidden Square Endings: [2, 3, 7, 8]
              </div>
              <div className="text-xs text-rose-700 mt-0.5">
                If an integer ends in 2, 3, 7, or 8, it is mathematically GUARANTEED to NOT be a perfect square!
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {digitMapping.map((item, idx) => {
              const isActive =
                item.endsWith.includes(String(lastDigitOfN)) ||
                (lastDigitOfN === 0 && item.endsWith.includes('0'));
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 border-amber-500 font-black scale-105 shadow-md'
                      : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold opacity-80">Base Ends In:</div>
                  <div className="text-base font-black mt-0.5">{item.endsWith}</div>
                  <div className="text-[10px] font-bold mt-1 opacity-90">
                    Square ends in: <strong>{item.squareEndsWith}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 3. ODD GNOMON SCULPTOR (Module 1.3)
    if (t === 'odd-l-grid' || moduleId === 'mod-1-3') {
      const layers = Math.max(1, Math.min(8, simA));
      const oddNumbers = Array.from({ length: layers }, (_, i) => 2 * i + 1);
      const totalSquare = layers * layers;

      return (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
                Sum of Consecutive Odd Numbers = Perfect Square
              </div>
              <div className="text-xl font-bold mt-1">
                {oddNumbers.join(' + ')} = {totalSquare} = {layers}²
              </div>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-stone-950 font-black text-xs">
              {layers} × {layers} Square Grid
            </div>
          </div>

          <div
            className="grid gap-1.5 p-4 rounded-2xl bg-stone-950 border border-stone-800 w-fit mx-auto"
            style={{ gridTemplateColumns: `repeat(${layers}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: layers * layers }, (_, idx) => {
              const r = Math.floor(idx / layers);
              const c = idx % layers;
              const layerIndex = Math.max(r, c);
              const colors = [
                'bg-teal-400 text-stone-950',
                'bg-amber-400 text-stone-950',
                'bg-rose-400 text-white',
                'bg-sky-400 text-stone-950',
                'bg-emerald-400 text-stone-950',
                'bg-purple-400 text-white',
              ];
              return (
                <div
                  key={idx}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${colors[layerIndex % colors.length]} flex items-center justify-center text-xs font-black shadow`}
                >
                  {2 * layerIndex + 1}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 4. PRIME FACTOR SCALE / SQUARE ROOT (Module 1.4 & Part II Ch 2)
    if (t === 'prime-factor-scale' || (moduleId.startsWith('mod-1-4') || moduleId.startsWith('p2-mod-2-2'))) {
      const val = Math.max(16, Math.min(144, simA));
      let temp = val;
      const factors: number[] = [];
      let d = 2;
      while (d * d <= temp) {
        while (temp % d === 0) {
          factors.push(d);
          temp /= d;
        }
        d++;
      }
      if (temp > 1) factors.push(temp);

      const root = Math.round(Math.sqrt(val));
      const isPerfect = root * root === val;

      return (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-300" />
                <span>Square Root by Prime Factor Pairing</span>
              </div>
              <div className="text-2xl font-black mt-1">
                {val} = {factors.join(' × ')}
              </div>
              <div className="text-xs text-teal-200 mt-1">
                {isPerfect ? (
                  <span>
                    Twin prime factors pair up: √{val} = <strong>{root}</strong>!
                  </span>
                ) : (
                  <span>Prime factors do not all have twins; {val} is not a perfect square.</span>
                )}
              </div>
            </div>

            <div
              className={`px-4 py-2 rounded-xl text-xs font-black ${
                isPerfect ? 'bg-amber-400 text-stone-950' : 'bg-rose-500 text-white'
              }`}
            >
              {isPerfect ? `√${val} = ${root}` : 'Not a Square'}
            </div>
          </div>
        </div>
      );
    }

    // 5. 3D CUBES (Module 1.5)
    if (t === 'cube-3d-stacker' || moduleId === 'mod-1-5') {
      const n = Math.max(2, Math.min(5, simA));
      const total = n * n * n;
      const corners = 8;
      const edges = 12 * (n - 2);
      const faces = 6 * (n - 2) * (n - 2);
      const core = (n - 2) * (n - 2) * (n - 2);

      return (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold flex items-center gap-2">
                <Boxes className="w-4 h-4 text-amber-300" />
                <span>3D Painted Cube Layers ({n} × {n} × {n} = {total} Cubes)</span>
              </div>
              <div className="text-lg font-bold mt-1">
                Where does the paint land when the entire solid cube is dipped in paint?
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-stone-900 text-center">
              <div className="text-xs font-black text-amber-800 uppercase">3 Faces (Corners)</div>
              <div className="text-2xl font-black text-amber-950 mt-1">{corners}</div>
              <div className="text-[10px] text-stone-600 mt-1">Always exactly 8!</div>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-300 text-stone-900 text-center">
              <div className="text-xs font-black text-sky-800 uppercase">2 Faces (Edges)</div>
              <div className="text-2xl font-black text-sky-950 mt-1">{edges}</div>
              <div className="text-[10px] text-stone-600 mt-1">12 × ({n} - 2)</div>
            </div>
            <div className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-300 text-stone-900 text-center">
              <div className="text-xs font-black text-teal-800 uppercase">1 Face (Centers)</div>
              <div className="text-2xl font-black text-teal-950 mt-1">{faces}</div>
              <div className="text-[10px] text-stone-600 mt-1">6 × ({n} - 2)²</div>
            </div>
            <div className="p-4 rounded-2xl bg-stone-100 border-2 border-stone-300 text-stone-900 text-center">
              <div className="text-xs font-black text-stone-700 uppercase">0 Faces (Core)</div>
              <div className="text-2xl font-black text-stone-950 mt-1">{core}</div>
              <div className="text-[10px] text-stone-600 mt-1">({n} - 2)³</div>
            </div>
          </div>
        </div>
      );
    }

    // 6. RAMANUJAN 1729 TAXICAB (Module 1.6)
    if (t === 'taxicab-analyzer' || moduleId === 'mod-1-6') {
      return (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-amber-300 uppercase font-black">
                Ramanujan’s Hardy-Taxicab Number: 1729
              </div>
              <div className="text-2xl font-black mt-1">
                1729 = 12³ + 1³ (1728 + 1) = 10³ + 9³ (1000 + 729)
              </div>
              <div className="text-xs text-teal-200 mt-1">
                Smallest integer expressible as the sum of two cubes in two different ways!
              </div>
            </div>
            <span className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-black text-xs">
              Taxicab Equilibrium
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-700 text-white text-center space-y-2">
              <div className="text-xs font-bold text-teal-300 uppercase">First Cube Pair</div>
              <div className="text-xl font-black">12³ + 1³</div>
              <div className="text-sm font-semibold text-stone-300">1728 + 1 = 1729</div>
            </div>
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-700 text-white text-center space-y-2">
              <div className="text-xs font-bold text-amber-300 uppercase">Second Cube Pair</div>
              <div className="text-xl font-black">10³ + 9³</div>
              <div className="text-sm font-semibold text-stone-300">1000 + 729 = 1729</div>
            </div>
          </div>
        </div>
      );
    }

    // 7. SUCCESSIVE DIFFERENCE TABLE & DUAL VAULT (Module 1.7 & 1.8)
    if (t === 'difference-table' || t === 'treasury-vault') {
      const a = simA;
      const b = simB;
      return (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-amber-300 uppercase font-black">
                {t === 'treasury-vault' ? 'Royal Treasury Vault Ring' : 'Successive Differences Pyramid'}
              </div>
              <div className="text-xl font-black mt-1">
                {t === 'treasury-vault' ? (
                  <span>
                    Square Dial {a}² = {a * a} · Cube Dial {b}³ = {b * b * b}
                  </span>
                ) : (
                  <span>
                    Base {a}³ = {a * a * a} · Next {(a + 1)}³ = {(a + 1) * (a + 1) * (a + 1)}
                  </span>
                )}
              </div>
              <div className="text-xs text-teal-200 mt-1">
                {t === 'treasury-vault'
                  ? 'Sixth powers n⁶ (e.g. 64 = 8² = 4³) unlock both chambers!'
                  : 'The 3rd difference between consecutive cubes is always 6!'}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 8. EXPONENTS & POWERS (Chapter 2)
    if (ch.includes('ch2-power-play') || t === 'paper-folder' || t === 'power-line' || t === 'bracket-expander') {
      const folds = Math.max(0, Math.min(42, simA));
      const thickness = 0.0001 * Math.pow(2, folds);
      let formatted = `${(thickness * 1000).toFixed(1)} mm`;
      if (thickness >= 1000) formatted = `${(thickness / 1000).toLocaleString()} km`;
      else if (thickness >= 1) formatted = `${thickness.toFixed(1)} m`;

      return (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold flex items-center gap-2">
                <Rocket className="w-4 h-4 text-amber-300" />
                <span>Exponential Growth Accelerator (2^{folds})</span>
              </div>
              <div className="text-2xl font-black mt-1">
                {folds} Folds → Thickness: {formatted}
              </div>
              <div className="text-xs text-teal-200 mt-1">
                42 folds reaches the Moon (384,400 km)!
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 9. FRACTIONS IN DISGUISE (Part II Chapter 1 - NO FALSE PROPORTIONS!)
    if (ch.includes('fractions-disguise') || moduleId.startsWith('p2-mod-1-')) {
      const num = simA;
      const den = Math.max(1, simB);
      const decimal = (num / den).toFixed(3);
      const percent = ((num / den) * 100).toFixed(1);

      return (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-4 border border-teal-500/30">
            <div>
              <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold flex items-center gap-2">
                <Percent className="w-4 h-4 text-amber-300" />
                <span>Fractions in Disguise · Fraction-Decimal-Percentage Converter</span>
              </div>
              <div className="text-2xl font-black mt-1">
                Fraction {num}/{den} = Decimal {decimal} = <span className="text-amber-300">{percent}%</span>
              </div>
              <div className="text-xs text-teal-200 mt-1">
                Percentages represent parts per 100 hundredths!
              </div>
            </div>
          </div>
          <div className="h-6 w-full rounded-full bg-stone-200 border border-stone-300 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-amber-400 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, Number(percent)))}%` }}
            />
          </div>
        </div>
      );
    }

    // 10. BAUDHAYANA-PYTHAGORAS THEOREM (Part II Chapter 2)
    if (ch.includes('baudhayana-pythagoras') || moduleId.startsWith('p2-mod-2-')) {
      const a = simA;
      const b = simB;
      const cSq = a * a + b * b;
      const c = Math.sqrt(cSq).toFixed(2);

      return (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-4 border border-teal-500/30">
            <div>
              <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold flex items-center gap-2">
                <Triangle className="w-4 h-4 text-amber-300" />
                <span>Baudhāyana-Pythagoras Right Triangle Theorem</span>
              </div>
              <div className="text-2xl font-black mt-1">
                {a}² + {b}² = {a * a} + {b * b} = {cSq} → Hypotenuse c = <span className="text-amber-300">{c}</span>
              </div>
              <div className="text-xs text-teal-200 mt-1">
                The diagonal square equals the sum of the squares on both sides!
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 11. PROPORTIONS & RATIOS (Chapter 7 ONLY)
    if (ch.includes('ch7-proportional-1') || ch.includes('proportional-reasoning')) {
      const ratio = simB !== 0 ? (simA / simB).toFixed(2) : '1';
      return (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-300" />
                <span>Proportional Reasoning & Rule of Three (Trairāśika)</span>
              </div>
              <div className="text-2xl font-black mt-1">
                Ratio A : B = {simA} : {simB} (Value: {ratio})
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 12. BESPOKE GENERAL SIMULATOR FOR ALL OTHER TOPICS
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-4 border border-teal-500/30">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              {simulation.title}
            </div>
            <div className="text-xl font-black mt-1">
              Active Control: {simA} {simulation.controlBLabel ? `· Parameter 2: ${simB}` : ''}
            </div>
            <div className="text-xs text-teal-200 mt-1">
              Formula: {formatMathText(simulation.formulaHighlight)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // RENDER SLIDE 4: PLAYABLE MINI-GAMES ROUTED BY RESOLVED GAME ENGINE
  // ==========================================================================
  const renderSlide4MiniGame = () => {
    // A. READY SCREEN
    if (gameStage === 'ready') {
      return (
        <div className="rounded-3xl bg-gradient-to-br from-[#0F3828] to-[#134E4A] text-white p-8 md:p-10 space-y-6 text-center shadow-md">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center text-3xl shadow-lg">
            <Gamepad2 className="w-9 h-9" />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Slide 4 · Interactive Game ({resolvedGameEngine})
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">{formatMathText(game.title)}</h3>
            <p className="text-teal-100 text-sm leading-relaxed">{formatMathText(game.rules)}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-teal-200 pt-2">
            <div className="flex items-center gap-1.5 font-bold">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>3 Lives</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Streak Combo Multipliers</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>+Points for Chapter Mastery Rank</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setGameStage('playing');
                setLives(3);
                setGameScore(0);
                setCombo(0);
                setGameTimer(35);
                setSelectedTiles([]);
                setWrongTiles([]);
                setSelectedStrings([]);
                setGameFeedback(null);
                playSound('hit', soundEnabled);
              }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-base transition-all transform hover:scale-105 shadow-lg cursor-pointer"
            >
              <Play className="w-5 h-5 fill-stone-950" />
              <span>Start Game</span>
            </button>
          </div>
        </div>
      );
    }

    // B. GAME OVER SCREEN
    if (gameStage === 'game_over') {
      return (
        <div className="rounded-3xl bg-stone-900 text-white p-8 md:p-10 text-center space-y-6 shadow-md border border-stone-800">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-3xl">
            💔
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-rose-400">Game Over!</h3>
            <p className="text-stone-300 text-sm max-w-md mx-auto">
              {gameFeedback || 'You ran out of lives! Dust off your chalkboard and try again.'}
            </p>
            <div className="text-xl font-bold text-amber-300 pt-2">
              Final Score: {gameScore} pts
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setGameStage('playing');
                setLives(3);
                setGameScore(0);
                setCombo(0);
                setGameTimer(35);
                setSelectedTiles([]);
                setWrongTiles([]);
                setSelectedStrings([]);
                setGameFeedback(null);
                playSound('hit', soundEnabled);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            {onGoToQuiz && (
              <button
                type="button"
                onClick={onGoToQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition cursor-pointer"
              >
                <span>Advance to Slide 5: Recap Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      );
    }

    // C. VICTORY SCREEN
    if (gameStage === 'victory') {
      return (
        <div className="rounded-3xl bg-gradient-to-br from-[#0F3828] to-[#134E4A] text-white p-8 md:p-10 text-center space-y-6 shadow-lg border-2 border-amber-400">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400 text-stone-950 flex items-center justify-center text-4xl shadow-xl animate-bounce">
            🏆
          </div>
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase">
              Victory Achieved!
            </span>
            <h3 className="text-3xl font-black">Outstanding Math Skills!</h3>
            <p className="text-teal-100 text-sm max-w-md mx-auto">
              You conquered the {game.title} challenge!
            </p>
            <div className="text-3xl font-black text-amber-300 pt-2">
              Score: {gameScore} pts
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setGameStage('playing');
                setLives(3);
                setGameScore(0);
                setCombo(0);
                setGameTimer(35);
                setSelectedTiles([]);
                setWrongTiles([]);
                setSelectedStrings([]);
                setGameFeedback(null);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>

            {onGoToQuiz && (
              <button
                type="button"
                onClick={onGoToQuiz}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm transition shadow-lg cursor-pointer transform hover:scale-105"
              >
                <span>Proceed to Slide 5: Recap Quiz</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      );
    }

    // D. SHARED HUD BAR COMPONENT FOR ACTIVE GAMES
    const renderGameHUD = () => (
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-teal-600/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }, (_, idx) => (
              <Heart
                key={idx}
                className={`w-5 h-5 ${idx < lives ? 'text-rose-400 fill-rose-400' : 'text-stone-600'}`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-teal-200">Lives</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-teal-300">Score</div>
            <div className="text-lg font-black text-amber-300">{gameScore} pts</div>
          </div>
          <div className="text-center px-3 py-1 rounded-xl bg-white/10 font-mono font-bold text-sm">
            ⏱ {gameTimer}s
          </div>
        </div>
      </div>
    );

    // ========================================================================
    // GAME ENGINE 1: QUEEN RATNAMANJURI'S LOCKER QUEST (Module 1.1)
    // Non-glitchy, 16 discrete doors, clear factor explanation, zero-glitch clicks
    // ========================================================================
    if (resolvedGameEngine === 'lockers-quest') {
      const lockerList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      const squareLockers = [1, 4, 9, 16];

      const factorDescriptions: Record<number, string> = {
        1: 'Factors: [1] (1 factor = ODD!)',
        2: 'Factors: [1, 2] (2 factors = Even)',
        3: 'Factors: [1, 3] (2 factors = Even)',
        4: 'Factors: [1, 2, 4] (3 factors = ODD!)',
        5: 'Factors: [1, 5] (2 factors = Even)',
        6: 'Factors: [1, 2, 3, 6] (4 factors = Even)',
        7: 'Factors: [1, 7] (2 factors = Even)',
        8: 'Factors: [1, 2, 4, 8] (4 factors = Even)',
        9: 'Factors: [1, 3, 9] (3 factors = ODD!)',
        10: 'Factors: [1, 2, 5, 10] (4 factors = Even)',
        11: 'Factors: [1, 11] (2 factors = Even)',
        12: 'Factors: [1, 2, 3, 4, 6, 12] (6 factors = Even)',
        13: 'Factors: [1, 13] (2 factors = Even)',
        14: 'Factors: [1, 2, 7, 14] (4 factors = Even)',
        15: 'Factors: [1, 3, 5, 15] (4 factors = Even)',
        16: 'Factors: [1, 2, 4, 8, 16] (5 factors = ODD!)',
      };

      const handleLockerClick = (num: number) => {
        // Prevent double-clicking already handled lockers
        if (selectedTiles.includes(num) || wrongTiles.includes(num)) return;

        const isSquare = squareLockers.includes(num);

        if (isSquare) {
          playSound('hit', soundEnabled);
          const next = [...selectedTiles, num];
          setSelectedTiles(next);
          handleAwardGamePoints(150);
          setGameFeedback(`✨ Locker #${num} OPEN! ${factorDescriptions[num]}`);

          const remaining = squareLockers.filter((s) => !next.includes(s));
          if (remaining.length === 0) {
            playSound('win', soundEnabled);
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
            setGameStage('victory');
          }
        } else {
          setWrongTiles((prev) => [...prev, num]);
          handleLoseGameLife(`Locker #${num} stays SHUT! ${factorDescriptions[num]}`);
        }
      };

      return (
        <div className="rounded-3xl bg-[#0F3828] text-white p-6 sm:p-8 space-y-6 border-2 border-teal-500/30">
          {renderGameHUD()}

          <div className="text-center space-y-1">
            <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
              QUEEN RATNAMANJURI'S VAULT MISSION
            </span>
            <h4 className="text-xl sm:text-2xl font-black">
              Click all lockers that remain OPEN (Odd number of factors / Perfect Squares)!
            </h4>
            <p className="text-xs text-teal-200">
              There are exactly 4 open square lockers among doors 1 to 16:
            </p>
          </div>

          {gameFeedback && (
            <div className="p-3 rounded-xl bg-white/10 text-center text-xs font-bold text-amber-200">
              {gameFeedback}
            </div>
          )}

          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 pt-2">
            {lockerList.map((num) => {
              const isFound = selectedTiles.includes(num);
              const isWrong = wrongTiles.includes(num);

              let buttonStyle =
                'bg-stone-800 hover:bg-teal-800 text-white border-stone-700 hover:border-teal-400 hover:scale-105';
              if (isFound) {
                buttonStyle = 'bg-emerald-600 border-emerald-300 text-white shadow-lg scale-105';
              } else if (isWrong) {
                buttonStyle = 'bg-rose-900/60 border-rose-500/50 text-stone-400 opacity-60';
              }

              return (
                <button
                  key={num}
                  type="button"
                  disabled={isFound || isWrong}
                  onClick={() => handleLockerClick(num)}
                  className={`p-3.5 rounded-2xl text-center border-2 transition cursor-pointer ${buttonStyle}`}
                >
                  <div className="text-[10px] font-bold opacity-80">#{num}</div>
                  <div className="text-xl font-black mt-1">
                    {isFound ? '🔓 OPEN' : isWrong ? '❌ SHUT' : '🔒'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // ========================================================================
    // GAME ENGINE 2: GATE OF FORBIDDEN DIGITS (Module 1.2)
    // ========================================================================
    if (resolvedGameEngine === 'forbidden-digits') {
      const numbersQueue = [
        { num: 144, canBeSquare: true, ending: 4 },
        { num: 258, canBeSquare: false, ending: 8 },
        { num: 625, canBeSquare: true, ending: 5 },
        { num: 432, canBeSquare: false, ending: 2 },
        { num: 729, canBeSquare: true, ending: 9 },
        { num: 1087, canBeSquare: false, ending: 7 },
        { num: 1024, canBeSquare: true, ending: 4 },
        { num: 993, canBeSquare: false, ending: 3 },
      ];
      const currentItem = numbersQueue[gameRound - 1] || numbersQueue[0];

      const handleGateDecision = (userSaidCanBeSquare: boolean) => {
        const correct = userSaidCanBeSquare === currentItem.canBeSquare;
        if (correct) {
          playSound('hit', soundEnabled);
          handleAwardGamePoints(150);
          setGameFeedback(`Spot on! ${currentItem.num} ends in ${currentItem.ending}.`);
          if (gameRound >= numbersQueue.length) {
            playSound('win', soundEnabled);
            setGameStage('victory');
          } else {
            setGameRound((r) => r + 1);
          }
        } else {
          handleLoseGameLife(
            `Wrong gate! Numbers ending in ${currentItem.ending} ${
              currentItem.canBeSquare ? 'CAN' : 'CANNOT'
            } be squares!`
          );
        }
      };

      return (
        <div className="rounded-3xl bg-[#0F3828] text-white p-6 sm:p-8 space-y-6 border-2 border-teal-500/30">
          {renderGameHUD()}

          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase text-amber-300">
              GATE OF FORBIDDEN DIGITS (Round {gameRound} of {numbersQueue.length})
            </span>
            <div className="text-5xl font-black text-amber-300 py-3">{currentItem.num}</div>
            <p className="text-xs text-teal-200">
              Inspect the unit digit ({currentItem.ending}). Can this number possibly be a perfect square?
            </p>
          </div>

          {gameFeedback && (
            <div className="p-3 rounded-xl bg-white/10 text-center text-xs font-bold text-amber-200">
              {gameFeedback}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => handleGateDecision(true)}
              className="p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base sm:text-lg transition cursor-pointer shadow-lg"
            >
              🟢 CAN BE A SQUARE (Ends in 0, 1, 4, 5, 6, 9)
            </button>
            <button
              type="button"
              onClick={() => handleGateDecision(false)}
              className="p-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-base sm:text-lg transition cursor-pointer shadow-lg"
            >
              🔴 FORBIDDEN ENDING (Ends in 2, 3, 7, 8)
            </button>
          </div>
        </div>
      );
    }

    // ========================================================================
    // GAME ENGINE 3: ODD GNOMON ARCHITECT (Module 1.3)
    // ========================================================================
    if (resolvedGameEngine === 'odd-builder') {
      const targetSquare = 25; // 5^2: 1 + 3 + 5 + 7 + 9
      const availableOdds = [1, 3, 5, 7, 9];
      const currentSum = selectedTiles.reduce((a, b) => a + b, 0);

      const handleAddOdd = (odd: number) => {
        if (selectedTiles.includes(odd)) return;
        const nextSum = currentSum + odd;
        if (nextSum > targetSquare) {
          handleLoseGameLife(`Exceeded target square (${nextSum} > ${targetSquare})!`);
          return;
        }

        playSound('hit', soundEnabled);
        const next = [...selectedTiles, odd];
        setSelectedTiles(next);
        handleAwardGamePoints(100);

        if (nextSum === targetSquare) {
          playSound('win', soundEnabled);
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
          setGameStage('victory');
        }
      };

      return (
        <div className="rounded-3xl bg-[#0F3828] text-white p-6 sm:p-8 space-y-6 border-2 border-teal-500/30">
          {renderGameHUD()}

          <div className="text-center space-y-1">
            <span className="text-xs font-black uppercase text-amber-300">
              ODD GNOMON ARCHITECT
            </span>
            <h4 className="text-xl sm:text-2xl font-black">
              Build Target Square 25 (5²) using consecutive odd numbers!
            </h4>
            <div className="text-2xl font-black text-amber-300 mt-2">
              Current Sum: {currentSum} / 25
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3 pt-2">
            {availableOdds.map((odd) => {
              const isUsed = selectedTiles.includes(odd);
              return (
                <button
                  key={odd}
                  type="button"
                  disabled={isUsed}
                  onClick={() => handleAddOdd(odd)}
                  className={`p-5 rounded-2xl text-2xl font-black border-2 transition cursor-pointer ${
                    isUsed
                      ? 'bg-emerald-600 border-emerald-300 text-white shadow'
                      : 'bg-stone-800 hover:bg-teal-700 text-white border-stone-600'
                  }`}
                >
                  +{odd}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // ========================================================================
    // GAME ENGINE 4: PRIME FACTOR ROOT ALCHEMY (Module 1.4 & Part II Ch 2)
    // ========================================================================
    if (resolvedGameEngine === 'prime-twins') {
      const primeRounds = [
        { number: 144, pairs: '2 × 2 × 3', root: 12, choices: [10, 12, 14, 16] },
        { number: 400, pairs: '2 × 2 × 5', root: 20, choices: [18, 20, 22, 25] },
        { number: 900, pairs: '2 × 3 × 5', root: 30, choices: [25, 30, 35, 45] },
      ];
      const cur = primeRounds[gameRound - 1] || primeRounds[0];

      const handleSelectRoot = (ans: number) => {
        if (ans === cur.root) {
          playSound('hit', soundEnabled);
          handleAwardGamePoints(150);
          setGameFeedback(`Correct! √${cur.number} = ${cur.pairs} = ${cur.root}`);
          if (gameRound >= primeRounds.length) {
            playSound('win', soundEnabled);
            setGameStage('victory');
          } else {
            setGameRound((r) => r + 1);
          }
        } else {
          handleLoseGameLife(`Incorrect! √${cur.number} is ${cur.root}.`);
        }
      };

      return (
        <div className="rounded-3xl bg-[#0F3828] text-white p-6 sm:p-8 space-y-6 border-2 border-teal-500/30">
          {renderGameHUD()}

          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase text-amber-300">
              PRIME FACTOR ROOT ALCHEMY (Round {gameRound} of {primeRounds.length})
            </span>
            <div className="text-4xl sm:text-5xl font-black text-amber-300 py-2">
              √{cur.number} = ?
            </div>
            <p className="text-xs text-teal-200">
              Pair the twin prime factors: pulling one out of each pair yields:
            </p>
          </div>

          {gameFeedback && (
            <div className="p-3 rounded-xl bg-white/10 text-center text-xs font-bold text-amber-200">
              {gameFeedback}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {cur.choices.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleSelectRoot(c)}
                className="p-5 rounded-2xl bg-stone-800 hover:bg-teal-700 border border-teal-400 text-xl font-black transition cursor-pointer shadow hover:scale-105"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ========================================================================
    // GAME ENGINE 5: 3D PAINTED CUBE LAYERS (Module 1.5)
    // ========================================================================
    if (resolvedGameEngine === 'cube-paint') {
      const questions = [
        { prompt: 'A solid 3×3×3 cube is painted blue all over. How many small cubes have EXACTLY 3 painted faces?', ans: '8', options: ['6', '8', '12', '1'] },
        { prompt: 'In the same 3×3×3 cube, how many small cubes have EXACTLY 0 painted faces (the core)?', ans: '1', options: ['0', '1', '2', '8'] },
        { prompt: 'How many small cubes sit along the 12 edges and have EXACTLY 2 painted faces?', ans: '12', options: ['8', '12', '6', '24'] },
      ];
      const curQ = questions[gameRound - 1] || questions[0];

      const handleAnswer = (choice: string) => {
        if (choice === curQ.ans) {
          playSound('hit', soundEnabled);
          handleAwardGamePoints(150);
          if (gameRound >= questions.length) {
            playSound('win', soundEnabled);
            setGameStage('victory');
          } else {
            setGameRound((r) => r + 1);
          }
        } else {
          handleLoseGameLife(`Miss! The correct count is ${curQ.ans}.`);
        }
      };

      return (
        <div className="rounded-3xl bg-[#0F3828] text-white p-6 sm:p-8 space-y-6 border-2 border-teal-500/30">
          {renderGameHUD()}

          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase text-amber-300">
              3D PAINTED CUBE INSPECTOR (Round {gameRound} of {questions.length})
            </span>
            <div className="text-lg sm:text-xl font-black text-amber-300 py-2">
              {curQ.prompt}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {curQ.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleAnswer(opt)}
                className="p-5 rounded-2xl bg-stone-800 hover:bg-teal-700 border border-teal-400 text-2xl font-black transition cursor-pointer shadow hover:scale-105"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ========================================================================
    // GAME ENGINE 6: RAMANUJAN 1729 TAXICAB BALANCE (Module 1.6)
    // ========================================================================
    if (resolvedGameEngine === 'taxicab-duel') {
      const cubePairs = [
        { label: '12³ + 1³ (1728 + 1)', is1729: true },
        { label: '10³ + 9³ (1000 + 729)', is1729: true },
        { label: '11³ + 4³ (1331 + 64 = 1395)', is1729: false },
        { label: '8³ + 7³ (512 + 343 = 855)', is1729: false },
      ];

      const handleSelectPair = (idx: number, is1729: boolean) => {
        if (selectedTiles.includes(idx)) return;
        if (is1729) {
          playSound('hit', soundEnabled);
          const next = [...selectedTiles, idx];
          setSelectedTiles(next);
          handleAwardGamePoints(200);
          if (next.length === 2) {
            playSound('win', soundEnabled);
            setGameStage('victory');
          }
        } else {
          handleLoseGameLife('That sum does not equal 1729!');
        }
      };

      return (
        <div className="rounded-3xl bg-[#0F3828] text-white p-6 sm:p-8 space-y-6 border-2 border-teal-500/30">
          {renderGameHUD()}

          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase text-amber-300">
              RAMANUJAN'S 1729 TAXICAB EQUILIBRIUM
            </span>
            <h4 className="text-xl sm:text-2xl font-black">
              Select BOTH cube pairs that add up to 1729!
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {cubePairs.map((p, idx) => {
              const isFound = selectedTiles.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isFound}
                  onClick={() => handleSelectPair(idx, p.is1729)}
                  className={`p-5 rounded-2xl border-2 text-lg font-black transition cursor-pointer ${
                    isFound
                      ? 'bg-emerald-600 border-emerald-300 text-white'
                      : 'bg-stone-800 hover:bg-teal-700 text-white border-stone-600'
                  }`}
                >
                  {isFound ? '⚖️ ' + p.label + ' = 1729 ✓' : p.label}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // ========================================================================
    // GAME ENGINE 7: EXPONENT POWER BLASTER (Part I Chapter 2)
    // ========================================================================
    if (resolvedGameEngine === 'power-orbit') {
      const powerRounds = [
        { equation: '2³ × 2⁴ = ?', correct: '2⁷', options: ['2⁷', '2¹²', '4⁷', '2¹'] },
        { equation: '(3²)⁴ = ?', correct: '3⁸', options: ['3⁶', '3⁸', '9⁴', '3²'] },
        { equation: '5⁶ ÷ 5² = ?', correct: '5⁴', options: ['5³', '5¹²', '5⁴', '1⁴'] },
        { equation: '10⁻³ = ?', correct: '1 / 1000', options: ['-30', '1 / 1000', '0.0001', '-1000'] },
      ];
      const cur = powerRounds[gameRound - 1] || powerRounds[0];

      const handleSelectOrb = (opt: string) => {
        if (opt === cur.correct) {
          playSound('hit', soundEnabled);
          handleAwardGamePoints(150);
          if (gameRound >= powerRounds.length) {
            playSound('win', soundEnabled);
            setGameStage('victory');
          } else {
            setGameRound((r) => r + 1);
          }
        } else {
          handleLoseGameLife(`Miss! ${cur.equation} equals ${cur.correct}.`);
        }
      };

      return (
        <div className="rounded-3xl bg-[#0F3828] text-white p-6 sm:p-8 space-y-6 border-2 border-teal-500/30">
          {renderGameHUD()}

          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase text-amber-300">
              POWER ORBIT BLASTER (Round {gameRound} of {powerRounds.length})
            </span>
            <div className="text-3xl sm:text-4xl font-black text-amber-300 py-2">
              {cur.equation}
            </div>
            <p className="text-xs text-teal-200">Click the matching power orb:</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {cur.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOrb(opt)}
                className="p-5 rounded-2xl bg-stone-800 hover:bg-teal-700 border border-teal-400 text-xl font-black transition cursor-pointer shadow hover:scale-105"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ========================================================================
    // GAME ENGINE 8: ANCIENT NUMERAL ARCHAEOLOGIST (Part I Chapter 3)
    // ========================================================================
    if (resolvedGameEngine === 'ancient-ciphers') {
      const cipherRounds = [
        { numeral: 'XLVII', system: 'Roman Numeral', value: 47, options: [37, 47, 57, 67] },
        { numeral: 'Cuneiform 𒁹 (60 + 5)', system: 'Babylonian Base-60', value: 65, options: [15, 65, 125, 360] },
        { numeral: 'Śūnya Rules', system: 'Brahmagupta (628 CE)', question: 'What is 5 × 0?', value: 0, options: [0, 5, 1, 50] },
      ];
      const cur = cipherRounds[gameRound - 1] || cipherRounds[0];

      const handleDecipher = (val: number) => {
        if (val === cur.value) {
          playSound('hit', soundEnabled);
          handleAwardGamePoints(150);
          if (gameRound >= cipherRounds.length) {
            playSound('win', soundEnabled);
            setGameStage('victory');
          } else {
            setGameRound((r) => r + 1);
          }
        } else {
          handleLoseGameLife(`Incorrect deciphering! Target was ${cur.value}.`);
        }
      };

      return (
        <div className="rounded-3xl bg-[#0F3828] text-white p-6 sm:p-8 space-y-6 border-2 border-teal-500/30">
          {renderGameHUD()}

          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase text-amber-300">
              ANCIENT CIPHER ARCHAEOLOGIST ({cur.system})
            </span>
            <div className="text-4xl sm:text-5xl font-black text-amber-300 py-2">
              {cur.numeral}
            </div>
            <p className="text-xs text-teal-200">
              {cur.question || 'What integer value does this ancient numeral represent?'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {cur.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleDecipher(opt)}
                className="p-5 rounded-2xl bg-stone-800 hover:bg-teal-700 border border-teal-400 text-2xl font-black transition cursor-pointer shadow hover:scale-105"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ========================================================================
    // GAME ENGINE 9: QUADRILATERAL DETECTIVE (Part I Chapter 4)
    // ========================================================================
    if (resolvedGameEngine === 'shape-detective') {
      const clues = [
        {
          clue: 'Diagonals are perpendicular to each other, bisect each other, but are NOT equal in length.',
          ans: 'Rhombus',
          choices: ['Rectangle', 'Rhombus', 'Trapezium', 'Parallelogram'],
        },
        {
          clue: 'Diagonals are equal in length and bisect each other at non-perpendicular angles.',
          ans: 'Rectangle',
          choices: ['Square', 'Rectangle', 'Kite', 'Rhombus'],
        },
        {
          clue: 'Only ONE pair of opposite sides is parallel.',
          ans: 'Trapezium',
          choices: ['Trapezium', 'Parallelogram', 'Rhombus', 'Square'],
        },
      ];
      const curClue = clues[gameRound - 1] || clues[0];

      const handleGuessShape = (s: string) => {
        if (s === curClue.ans) {
          playSound('hit', soundEnabled);
          handleAwardGamePoints(150);
          if (gameRound >= clues.length) {
            playSound('win', soundEnabled);
            setGameStage('victory');
          } else {
            setGameRound((r) => r + 1);
          }
        } else {
          handleLoseGameLife(`Incorrect! The clues describe a ${curClue.ans}.`);
        }
      };

      return (
        <div className="rounded-3xl bg-[#0F3828] text-white p-6 sm:p-8 space-y-6 border-2 border-teal-500/30">
          {renderGameHUD()}

          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase text-amber-300">
              QUADRILATERAL DETECTIVE (Clue {gameRound} of {clues.length})
            </span>
            <div className="p-4 rounded-2xl bg-stone-900 border border-teal-500/40 text-base sm:text-lg font-bold text-amber-200">
              "{curClue.clue}"
            </div>
            <p className="text-xs text-teal-200">Identify the mystery quadrilateral:</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {curClue.choices.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleGuessShape(c)}
                className="p-5 rounded-2xl bg-stone-800 hover:bg-teal-700 border border-teal-400 text-base font-black transition cursor-pointer shadow hover:scale-105"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ========================================================================
    // GAME ENGINE 10: DIVISIBILITY SPEED-RUN (Part I Chapter 5)
    // ========================================================================
    if (resolvedGameEngine === 'divisibility-rush') {
      const rushTasks = [
        { num: 4572, rule: 'Is 4572 divisible by 9? (Digit sum: 4+5+7+2 = 18)', correct: true },
        { num: 1331, rule: 'Is 1331 divisible by 11? (Alt sum: (1+3) - (3+1) = 0)', correct: true },
        { num: 8214, rule: 'Is 8214 divisible by 9? (Digit sum: 8+2+1+4 = 15)', correct: false },
        { num: 9812, rule: 'Is 9812 divisible by 4? (Last two digits: 12)', correct: true },
      ];
      const curTask = rushTasks[gameRound - 1] || rushTasks[0];

      const handleRushDecision = (ans: boolean) => {
        if (ans === curTask.correct) {
          playSound('hit', soundEnabled);
          handleAwardGamePoints(150);
          if (gameRound >= rushTasks.length) {
            playSound('win', soundEnabled);
            setGameStage('victory');
          } else {
            setGameRound((r) => r + 1);
          }
        } else {
          handleLoseGameLife(`Incorrect! ${curTask.rule}`);
        }
      };

      return (
        <div className="rounded-3xl bg-[#0F3828] text-white p-6 sm:p-8 space-y-6 border-2 border-teal-500/30">
          {renderGameHUD()}

          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase text-amber-300">
              DIVISIBILITY SPEED-RUN (Round {gameRound} of {rushTasks.length})
            </span>
            <div className="text-4xl font-black text-amber-300 py-2">{curTask.num}</div>
            <p className="text-sm font-semibold text-teal-100">{curTask.rule}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => handleRushDecision(true)}
              className="p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl transition cursor-pointer shadow-lg"
            >
              YES (Divisible)
            </button>
            <button
              type="button"
              onClick={() => handleRushDecision(false)}
              className="p-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xl transition cursor-pointer shadow-lg"
            >
              NO (Not Divisible)
            </button>
          </div>
        </div>
      );
    }

    // ========================================================================
    // GAME ENGINE 11: ALGEBRA TILES DISSECTION (Part I Chapter 6)
    // ========================================================================
    if (resolvedGameEngine === 'algebra-tiles') {
      const tilePuzzles = [
        { expr: '(x + 3)²', ans: 'x² + 6x + 9', choices: ['x² + 9', 'x² + 6x + 9', 'x² + 3x + 9', '2x + 6'] },
        { expr: '(a - 4)²', ans: 'a² - 8a + 16', choices: ['a² - 16', 'a² - 8a + 16', 'a² + 8a + 16', 'a² - 4a + 16'] },
        { expr: '(y + 5)(y - 5)', ans: 'y² - 25', choices: ['y² - 10y + 25', 'y² - 25', 'y² + 25', '2y - 25'] },
      ];
      const curP = tilePuzzles[gameRound - 1] || tilePuzzles[0];

      const handleSelectTile = (ans: string) => {
        if (ans === curP.ans) {
          playSound('hit', soundEnabled);
          handleAwardGamePoints(150);
          if (gameRound >= tilePuzzles.length) {
            playSound('win', soundEnabled);
            setGameStage('victory');
          } else {
            setGameRound((r) => r + 1);
          }
        } else {
          handleLoseGameLife(`Miss! ${curP.expr} expands to ${curP.ans}.`);
        }
      };

      return (
        <div className="rounded-3xl bg-[#0F3828] text-white p-6 sm:p-8 space-y-6 border-2 border-teal-500/30">
          {renderGameHUD()}

          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase text-amber-300">
              ALGEBRA TILE EXPANDER (Puzzle {gameRound} of {tilePuzzles.length})
            </span>
            <div className="text-4xl font-black text-amber-300 py-2">{curP.expr}</div>
            <p className="text-xs text-teal-200">Select the correct geometric area expansion:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {curP.choices.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleSelectTile(c)}
                className="p-5 rounded-2xl bg-stone-800 hover:bg-teal-700 border border-teal-400 text-lg font-black transition cursor-pointer shadow hover:scale-105"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ========================================================================
    // GAME ENGINE 12: ANCIENT BAZAAR TRAIRĀŚIKA (Part I Chapter 7)
    // ========================================================================
    if (resolvedGameEngine === 'trairasika-market') {
      const trades = [
        { prompt: 'If 4 sacks of wheat cost 12 silver coins, how much do 7 sacks cost?', ans: '21', choices: ['18', '21', '24', '28'] },
        { prompt: 'A recipe uses 3 cups of flour for every 2 cups of sugar. For 9 cups of flour, how much sugar?', ans: '6', choices: ['4', '5', '6', '8'] },
        { prompt: 'Photo aspect ratio is 3 : 2. If the width is enlarged to 15 cm, what is the proportional height?', ans: '10', choices: ['8', '10', '12', '14'] },
      ];
      const curTrade = trades[gameRound - 1] || trades[0];

      const handleTradeAns = (c: string) => {
        if (c === curTrade.ans) {
          playSound('hit', soundEnabled);
          handleAwardGamePoints(150);
          if (gameRound >= trades.length) {
            playSound('win', soundEnabled);
            setGameStage('victory');
          } else {
            setGameRound((r) => r + 1);
          }
        } else {
          handleLoseGameLife(`Incorrect trade! Correct answer is ${curTrade.ans}.`);
        }
      };

      return (
        <div className="rounded-3xl bg-[#0F3828] text-white p-6 sm:p-8 space-y-6 border-2 border-teal-500/30">
          {renderGameHUD()}

          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase text-amber-300">
              ĀRYABHAṬA'S TRAIRĀŚIKA BAZAAR (Round {gameRound} of {trades.length})
            </span>
            <div className="p-4 rounded-2xl bg-stone-900 border border-teal-500/40 text-base sm:text-lg font-bold text-amber-200">
              {curTrade.prompt}
            </div>
            <p className="text-xs text-teal-200">Phala = (Icchā × Phala) / Pramāṇa</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {curTrade.choices.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleTradeAns(c)}
                className="p-5 rounded-2xl bg-stone-800 hover:bg-teal-700 border border-teal-400 text-2xl font-black transition cursor-pointer shadow hover:scale-105"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ========================================================================
    // GAME ENGINE 13: FRACTIONS IN DISGUISE / RETAIL HUNTER (Part II Chapter 1)
    // ========================================================================
    if (resolvedGameEngine === 'percent-matchmaker') {
      const discountTasks = [
        { item: 'A jacket marked ₹2,000 has a 30% discount. What is the selling price?', ans: '₹1,400', choices: ['₹1,400', '₹1,700', '₹1,600', '₹1,300'] },
        { item: 'An item is marked up +50% then discounted by 50%. What is the net result?', ans: '25% Loss', choices: ['0% Break Even', '25% Loss', '10% Gain', '20% Loss'] },
        { item: 'Convert 3/8 into an exact percentage:', ans: '37.5%', choices: ['35%', '37.5%', '38%', '42.5%'] },
      ];
      const curTask = discountTasks[gameRound - 1] || discountTasks[0];

      const handlePercentAns = (c: string) => {
        if (c === curTask.ans) {
          playSound('hit', soundEnabled);
          handleAwardGamePoints(150);
          if (gameRound >= discountTasks.length) {
            playSound('win', soundEnabled);
            setGameStage('victory');
          } else {
            setGameRound((r) => r + 1);
          }
        } else {
          handleLoseGameLife(`Incorrect! The correct answer is ${curTask.ans}.`);
        }
      };

      return (
        <div className="rounded-3xl bg-[#0F3828] text-white p-6 sm:p-8 space-y-6 border-2 border-teal-500/30">
          {renderGameHUD()}

          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase text-amber-300">
              FRACTIONS IN DISGUISE: RETAIL PERCENTAGE HUNTER
            </span>
            <div className="p-4 rounded-2xl bg-stone-900 border border-teal-500/40 text-base sm:text-lg font-bold text-amber-200">
              {curTask.item}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {curTask.choices.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handlePercentAns(c)}
                className="p-5 rounded-2xl bg-stone-800 hover:bg-teal-700 border border-teal-400 text-lg font-black transition cursor-pointer shadow hover:scale-105"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ========================================================================
    // GAME ENGINE 14: BAUDHĀYANA KNOTTED CORD (Part II Chapter 2)
    // ========================================================================
    if (resolvedGameEngine === 'baudhayana-cord') {
      const triples = [
        { legs: '3 and 4', hypotenuse: '5', choices: ['5', '6', '7', '8'] },
        { legs: '5 and 12', hypotenuse: '13', choices: ['13', '14', '15', '17'] },
        { legs: '8 and 15', hypotenuse: '17', choices: ['16', '17', '18', '20'] },
      ];
      const curTriple = triples[gameRound - 1] || triples[0];

      const handleTripleAns = (c: string) => {
        if (c === curTriple.hypotenuse) {
          playSound('hit', soundEnabled);
          handleAwardGamePoints(150);
          if (gameRound >= triples.length) {
            playSound('win', soundEnabled);
            setGameStage('victory');
          } else {
            setGameRound((r) => r + 1);
          }
        } else {
          handleLoseGameLife(`Miss! Legs ${curTriple.legs} form hypotenuse ${curTriple.hypotenuse}.`);
        }
      };

      return (
        <div className="rounded-3xl bg-[#0F3828] text-white p-6 sm:p-8 space-y-6 border-2 border-teal-500/30">
          {renderGameHUD()}

          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase text-amber-300">
              BAUDHĀYANA KNOTTED CORD TRIPLETS
            </span>
            <div className="text-2xl font-black text-amber-300 py-2">
              Right triangle with legs {curTriple.legs}. Hypotenuse?
            </div>
            <p className="text-xs text-teal-200">a² + b² = c²</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {curTriple.choices.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleTripleAns(c)}
                className="p-5 rounded-2xl bg-stone-800 hover:bg-teal-700 border border-teal-400 text-2xl font-black transition cursor-pointer shadow hover:scale-105"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ========================================================================
    // GAME ENGINE 15: FALLBACK BESPOKE MINI-GAME (Chapter specific questions)
    // ========================================================================
    const fallbackChallenges = game.challenges || [
      { prompt: 'Mastery challenge for ' + game.title, clue: 'Review the chapter key formulas.', options: ['Option A', 'Option B', 'Option C', 'Option D'], correctIndex: 0, explanation: 'Correctly solved.' },
    ];
    const curFb = fallbackChallenges[gameRound - 1] || fallbackChallenges[0];

    return (
      <div className="rounded-3xl bg-[#0F3828] text-white p-6 sm:p-8 space-y-6 border-2 border-teal-500/30">
        {renderGameHUD()}

        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase text-amber-300">
            {game.title} · Challenge {gameRound} of {fallbackChallenges.length}
          </span>
          <div className="p-4 rounded-2xl bg-stone-900 border border-teal-500/40 text-base sm:text-lg font-bold text-amber-200">
            {formatMathText(curFb.prompt)}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {curFb.options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (idx === curFb.correctIndex) {
                  playSound('hit', soundEnabled);
                  handleAwardGamePoints(150);
                  if (gameRound >= fallbackChallenges.length) {
                    playSound('win', soundEnabled);
                    setGameStage('victory');
                  } else {
                    setGameRound((r) => r + 1);
                  }
                } else {
                  handleLoseGameLife('Incorrect! ' + curFb.clue);
                }
              }}
              className="p-5 rounded-2xl bg-stone-800 hover:bg-teal-700 border border-teal-400 text-base font-black transition cursor-pointer shadow hover:scale-105 text-left"
            >
              {formatMathText(opt)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================================================
  // RENDER SLIDE 5: RECAP QUIZ (DYNAMIC 5-QUESTION RECAP OR 10-MARKER CAPSTONE)
  // ==========================================================================
  const renderSlide5RecapQuiz = () => {
    const rounds = recapRounds;
    const currentRound = rounds[quizIndex] || rounds[0];
    const isAnswered = quizSelectedOption !== null;
    const isCorrect = quizSelectedOption === currentRound.correctIndex;
    const totalQuestions = recapConfig.totalMarks;
    const passingQuestions = recapConfig.passingMarks;

    const handleSelectQuizOption = (idx: number) => {
      if (isAnswered) return;
      setQuizSelectedOption(idx);
      const isRight = idx === currentRound.correctIndex;
      const nextCorrect = isRight ? quizCorrectCount + 1 : quizCorrectCount;

      if (isRight) {
        playSound('hit', soundEnabled);
        setQuizScore((s) => s + 100 + quizStreak * 25);
        setQuizStreak((st) => st + 1);
        setQuizCorrectCount(nextCorrect);
      } else {
        playSound('miss', soundEnabled);
        setQuizStreak(0);
      }

      // Check if this was the last question of the paper
      if (quizIndex === rounds.length - 1) {
        const passed = nextCorrect >= passingQuestions;
        setHasPassed80Percent(passed);
        if (passed) {
          playSound('win', soundEnabled);
          fireBigAchievementConfetti();
          playAchievementFanfare();
          setIsModuleShaking(true);
          setTimeout(() => setIsModuleShaking(false), 900);
          if (badge && !isBadgeUnlocked && onUnlockBadge) {
            onUnlockBadge(badge.id, badge.pointsReward);
          }
        }
      }
    };

    const handleNextQuizRound = () => {
      setQuizSelectedOption(null);
      setQuizShowHint(false);
      setQuizIndex((prev) => prev + 1);
    };

    const handleFinishAndShowResults = () => {
      setQuizCompleted(true);
    };

    const renderBadgeBar = () => {
      if (!badge) return null;
      const isUnlocked = Boolean(isBadgeUnlocked || hasPassed80Percent);

      return (
        <div
          className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 p-4 transition-all ${
            isUnlocked
              ? 'border-amber-400 bg-gradient-to-r from-[#0F3828] via-[#134E4A] to-[#0F3828] text-white shadow-md'
              : 'border-teal-600/30 bg-[#F0FDFA] text-stone-900'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 text-2xl shadow-sm ${
                isUnlocked ? 'border-amber-300 bg-amber-400/20' : 'border-teal-500/40 bg-white'
              }`}
            >
              {badge.emblemGlyph}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    isUnlocked ? 'bg-amber-400 text-stone-950' : 'bg-teal-700 text-white'
                  }`}
                >
                  Module Mastery Badge #{badge.badgeNumber} of 115
                </span>
                <span
                  className={`text-xs font-bold ${isUnlocked ? 'text-amber-300' : 'text-teal-700'}`}
                >
                  +{badge.pointsReward} Mastery Points
                </span>
              </div>
              <div className="mt-1 text-base font-bold">
                {badge.title}{' '}
                <span className="text-xs font-normal opacity-80">({badge.subtitle})</span>
              </div>
            </div>
          </div>

          <div>
            {isUnlocked ? (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-400/20 border border-emerald-300 px-3.5 py-2 text-xs font-bold text-emerald-200">
                <CheckCircle2 className="h-4 w-4" /> Badge Acquired!
              </span>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-stone-100 border border-stone-300 px-3.5 py-2 text-xs font-bold text-stone-600">
                <Lock className="h-4 w-4 text-stone-500" />
                <span>Locked (Requires ≥80% score: {passingQuestions}/{totalQuestions} correct)</span>
              </div>
            )}
          </div>
        </div>
      );
    };

    if (quizCompleted) {
      const percentage = Math.round((quizCorrectCount / totalQuestions) * 100);
      const passed = hasPassed80Percent;

      return (
        <div className={`space-y-6 transition-transform ${isModuleShaking ? 'big-screen-shake' : ''}`}>
          {/* Badge Display Banner */}
          {renderBadgeBar()}

          {/* Assessment Scorecard */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border-2 text-white shadow-md space-y-6 ${
              passed
                ? 'bg-gradient-to-br from-[#0F3828] via-[#134E4A] to-[#042F2E] border-emerald-400'
                : 'bg-gradient-to-br from-stone-900 via-stone-800 to-rose-950 border-rose-400/60'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/20 pb-5">
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    passed ? 'bg-emerald-400 text-stone-950' : 'bg-rose-400 text-stone-950'
                  }`}
                >
                  {passed ? '🎉 Assessment Passed with 80%+ Mastery!' : '⚠️ Needs Re-attempt (Minimum 80% Required)'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black mt-2">
                  {passed ? 'Outstanding Work, Mathematician!' : 'Keep Practicing to Unlock the Badge!'}
                </h3>
                <p className="text-stone-300 text-sm mt-1">
                  {passed
                    ? `You scored ${quizCorrectCount} out of ${totalQuestions} (${percentage}%) and met the ${recapConfig.passingPercentage}% mastery threshold.`
                    : `You scored ${quizCorrectCount} out of ${totalQuestions} (${percentage}%). The badge unlocks only when scoring ≥80% (${passingQuestions} / ${totalQuestions} correct).`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center min-w-[100px]">
                  <div className="text-xs uppercase font-bold text-teal-300">Final Score</div>
                  <div className="text-3xl font-black mt-0.5">{quizCorrectCount} / {totalQuestions}</div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-400 text-stone-950 text-center min-w-[100px]">
                  <div className="text-xs uppercase font-bold text-stone-800">Accuracy</div>
                  <div className="text-3xl font-black mt-0.5">{percentage}%</div>
                </div>
              </div>
            </div>

            {/* Passing status summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs text-white/60 font-semibold uppercase">Total Questions</div>
                <div className="text-lg font-bold mt-1 text-white">{totalQuestions} Questions</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs text-white/60 font-semibold uppercase">Passing Threshold</div>
                <div className="text-lg font-bold mt-1 text-amber-300">≥ {passingQuestions} / {totalQuestions} (80%)</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs text-white/60 font-semibold uppercase">Mastery Badge</div>
                <div className={`text-lg font-bold mt-1 ${passed ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {passed ? 'Unlocked 🔓 (+Points Awarded)' : 'Locked 🔒 (Requires ≥80%)'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={handleRetakeQuiz}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 font-black text-sm transition shadow cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-teal-700" />
                <span>Retake Assessment (Fresh Randomized Questions)</span>
              </button>

              {passed && onGoToQuiz && (
                <span className="text-xs text-emerald-200 font-semibold">
                  Badge successfully recorded to your profile!
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`space-y-6 transition-transform ${isModuleShaking ? 'big-screen-shake' : ''}`}>
        {renderBadgeBar()}

        <div className="rounded-3xl bg-[#0F3828] text-white p-6 md:p-8 space-y-6 border-2 border-[#2DD4BF]/30">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-teal-300">
            <span>
              {isLastModule ? '10 Marker Comprehensive Paper' : 'Recap Assessment'} · Question {quizIndex + 1} of {rounds.length}
            </span>
            <button
              type="button"
              onClick={() => setQuizShowHint((h) => !h)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{quizShowHint ? 'Hide Clue' : 'Need a Clue?'}</span>
            </button>
          </div>

          <h4 className="text-xl md:text-2xl font-bold leading-snug">
            {formatMathText(currentRound.prompt)}
          </h4>

          {quizShowHint && (
            <div className="p-3.5 rounded-2xl bg-amber-400/15 border border-amber-300/40 text-amber-200 text-sm">
              💡 <strong>Clue:</strong> {formatMathText(currentRound.clue)}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentRound.options.map((opt: string, idx: number) => {
              let btnStyle = 'bg-white/10 hover:bg-white/20 border-white/20 text-white';
              if (isAnswered) {
                if (idx === currentRound.correctIndex) {
                  btnStyle = 'bg-emerald-500 text-stone-950 border-emerald-300 font-bold shadow-lg';
                } else if (idx === quizSelectedOption) {
                  btnStyle = 'bg-rose-500/80 text-white border-rose-300';
                } else {
                  btnStyle = 'bg-white/5 text-white/50 border-white/10';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectQuizOption(idx)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                >
                  <span className="text-base font-semibold">{formatMathText(opt)}</span>
                  {isAnswered && idx === currentRound.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  )}
                  {isAnswered && idx === quizSelectedOption && idx !== currentRound.correctIndex && (
                    <XCircle className="w-5 h-5 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="p-4 rounded-2xl bg-black/30 border border-white/15 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div
                  className={`text-sm font-bold uppercase ${
                    isCorrect ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {isCorrect ? '✨ Correct!' : 'Check the explanation:'}
                </div>
                <p className="text-sm text-emerald-100">{formatMathText(currentRound.explanation)}</p>
              </div>

              {quizIndex < rounds.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextQuizRound}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2DD4BF] hover:bg-[#14B8A6] text-stone-950 font-bold text-sm transition shadow cursor-pointer"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishAndShowResults}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm transition shadow cursor-pointer transform hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>View Assessment Results & Badge</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================================================
  // ROOT RETURN: DISPATCHED BY MODE
  // ==========================================================================
  if (mode === 'simulation') {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                simulation.isBigSimulation ? 'bg-amber-400 text-stone-950' : 'bg-[#CCFBF1] text-[#0F766E]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              {simulation.isBigSimulation
                ? 'Big Chapter Capstone Simulation'
                : `Interactive Hands-On Lab · ${moduleCode}`}
            </span>
            <h3 className="text-2xl font-bold text-stone-900 mt-2">
              {formatMathText(simulation.title)}
            </h3>
            <p className="text-stone-600 text-sm mt-1">{formatMathText(simulation.description)}</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] font-bold text-sm">
            {formatMathText(simulation.formulaHighlight)}
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-5 rounded-2xl border border-stone-200">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold text-stone-800">
              <span>{formatMathText(simulation.controlALabel)}</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#0F766E] text-white">{simA}</span>
            </div>
            <input
              type="range"
              min={simulation.controlAMin}
              max={simulation.controlAMax}
              step={1}
              value={simA}
              onChange={(e) => setSimA(Number(e.target.value))}
              className="w-full accent-[#0F766E] cursor-pointer"
            />
          </div>

          {simulation.controlBLabel && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-stone-800">
                <span>{formatMathText(simulation.controlBLabel)}</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-[#0F766E] text-white">{simB}</span>
              </div>
              <input
                type="range"
                min={simulation.controlBMin ?? 1}
                max={simulation.controlBMax ?? 12}
                step={1}
                value={simB}
                onChange={(e) => setSimB(Number(e.target.value))}
                className="w-full accent-[#0F766E] cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Dynamic Simulation Output */}
        {renderSlide3Simulation()}

        {onGoToGame && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onGoToGame}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0F766E] hover:bg-[#115E59] text-white font-black text-xs sm:text-sm transition cursor-pointer shadow-sm"
            >
              <span>Ready for the Mini-Game? Proceed to Slide 4: The Game</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'game') {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
        {renderSlide4MiniGame()}
      </div>
    );
  }

  // mode === 'quiz'
  return (
    <div
      className={`bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6 transition-transform ${
        isModuleShaking ? 'big-screen-shake' : ''
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-stone-950">
            <Trophy className="w-3.5 h-3.5" />
            {isLastModule ? 'Chapter Capstone · 10 Marker Paper' : 'Recap Mastery Quiz · Slide 5 of 5'}
          </span>
          <h3 className="text-2xl font-bold text-stone-900 mt-2">
            {recapConfig.paperTitle}
          </h3>
          <p className="text-stone-600 text-sm mt-1">
            {isLastModule
              ? 'Complete this 10-marker paper with at least 80% (8/10 correct) to earn your Chapter Mastery Badge!'
              : 'Answer these 5 randomized recap questions with at least 80% (4/5 correct) to prove understanding and unlock your Module Badge!'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-[#0F3828] text-white text-center">
            <div className="text-[10px] uppercase tracking-wider text-teal-300 font-bold">Accuracy</div>
            <div className="text-lg font-bold">{quizCorrectCount} / {recapConfig.totalMarks}</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-center">
            <div className="text-[10px] uppercase tracking-wider font-bold">Required to Pass</div>
            <div className="text-lg font-bold">≥ 80% ({recapConfig.passingMarks}/{recapConfig.totalMarks})</div>
          </div>
        </div>
      </div>

      {renderSlide5RecapQuiz()}
    </div>
  );
};
