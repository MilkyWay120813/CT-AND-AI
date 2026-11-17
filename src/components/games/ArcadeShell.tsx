import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Heart,
  Flame,
  Gamepad2,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowRight,
  Zap,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Custom98GameSpec } from '../../data/custom98Games';
import {
  computeComboScore,
  formatTimeRemaining,
  playArcadeSfx,
} from '../../utils/arcadeGameEngine';
import { formatMathText } from '../../utils/formatMath';

export interface ArcadeRuntimeContext {
  score: number;
  combo: number;
  lives: number;
  wave: number;
  waveCount: number;
  timeLeft: number;
  soundEnabled: boolean;
  isPaused: boolean;
  hitFlash: 'hit' | 'miss' | null;
  lastFeedback: string | null;
  awardHit: (basePoints: number, feedback: string, advanceWave?: boolean) => void;
  loseLife: (reason: string) => void;
  completeGame: (bonusPoints?: number, message?: string) => void;
  setWave: React.Dispatch<React.SetStateAction<number>>;
  setFeedback: (msg: string) => void;
  resetTrigger: number;
}

interface ArcadeShellProps {
  spec: Custom98GameSpec;
  onAddGamePoints?: (points: number) => void;
  onGoToQuiz?: () => void;
  children: (ctx: ArcadeRuntimeContext) => React.ReactNode;
}

type ShellStage = 'title' | 'playing' | 'paused' | 'victory' | 'gameover';

export const ArcadeShell: React.FC<ArcadeShellProps> = ({
  spec,
  onAddGamePoints,
  onGoToQuiz,
  children,
}) => {
  const [stage, setStage] = useState<ShellStage>('title');
  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [wave, setWave] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(spec.roundSeconds);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hitFlash, setHitFlash] = useState<'hit' | 'miss' | null>(null);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [resetTrigger, setResetTrigger] = useState<number>(0);

  const stageRef = useRef<ShellStage>(stage);
  stageRef.current = stage;

  // Reset clean state whenever module changes
  useEffect(() => {
    setStage('title');
    setLives(3);
    setScore(0);
    setCombo(0);
    setWave(1);
    setTimeLeft(spec.roundSeconds);
    setHitFlash(null);
    setLastFeedback(null);
    setResetTrigger((r) => r + 1);
  }, [spec.moduleId, spec.roundSeconds]);

  // Mirror state machine to document.body.dataset.state
  useEffect(() => {
    const mapped =
      stage === 'title'
        ? 'title'
        : stage === 'playing'
        ? 'playing'
        : stage === 'paused'
        ? 'paused'
        : 'gameover';
    document.body.dataset.state = mapped;
    return () => {
      delete document.body.dataset.state;
    };
  }, [stage]);

  const startGame = useCallback(() => {
    setStage('playing');
    setLives(3);
    setScore(0);
    setCombo(0);
    setWave(1);
    setTimeLeft(spec.roundSeconds);
    setHitFlash(null);
    setLastFeedback(null);
    setResetTrigger((r) => r + 1);
    playArcadeSfx('hit', soundEnabled);
  }, [spec.roundSeconds, soundEnabled]);

  const completeGame = useCallback(
    (bonusPoints = 200, message?: string) => {
      setScore((prev) => {
        const next = prev + bonusPoints;
        setBestScore((b) => Math.max(b, next));
        return next;
      });
      if (onAddGamePoints) {
        onAddGamePoints(Math.min(10, Math.max(4, Math.round(bonusPoints / 35))));
      }
      if (message) setLastFeedback(message);
      playArcadeSfx('win', soundEnabled);
      try {
        confetti({ particleCount: 55, spread: 65, origin: { y: 0.62 } });
      } catch {
        // Ignore headless confetti guard
      }
      setStage('victory');
    },
    [onAddGamePoints, soundEnabled]
  );

  const awardHit = useCallback(
    (basePoints: number, feedback: string, advanceWave = true) => {
      setCombo((c) => {
        const nextCombo = c + 1;
        const { totalPoints, balancedExp, multiplierLabel } = computeComboScore(
          basePoints,
          c
        );
        setScore((s) => {
          const next = s + totalPoints;
          setBestScore((b) => Math.max(b, next));
          return next;
        });
        if (onAddGamePoints) onAddGamePoints(balancedExp);
        setLastFeedback(
          multiplierLabel !== '×1'
            ? `${feedback} (+${totalPoints} pts · ${multiplierLabel} Combo!)`
            : `${feedback} (+${totalPoints} pts)`
        );
        return nextCombo;
      });
      setHitFlash('hit');
      playArcadeSfx('hit', soundEnabled);
      setTimeout(() => setHitFlash(null), 220);

      if (advanceWave) {
        setWave((w) => {
          if (w >= spec.waveCount) {
            setTimeout(() => completeGame(220, 'All waves cleared!'), 180);
            return w;
          }
          return w + 1;
        });
      }
    },
    [completeGame, onAddGamePoints, soundEnabled, spec.waveCount]
  );

  const loseLife = useCallback(
    (reason: string) => {
      setCombo(0);
      setHitFlash('miss');
      setLastFeedback(reason);
      playArcadeSfx('miss', soundEnabled);
      setTimeout(() => setHitFlash(null), 260);
      setLives((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setTimeout(() => setStage('gameover'), 300);
        }
        return Math.max(0, next);
      });
    },
    [soundEnabled]
  );

  // Real countdown timer while playing
  useEffect(() => {
    if (stage !== 'playing') return;
    const id = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;
        loseLife('Time expired on this wave! -1 Life');
        return spec.roundSeconds;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [stage, loseLife, spec.roundSeconds]);

  // Global keyboard shortcuts: Enter/Space on title, P/Escape pause, M mute, R restart
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      const key = e.key.toLowerCase();
      if (stageRef.current === 'title' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        startGame();
        return;
      }
      if (key === 'm') {
        setSoundEnabled((s) => !s);
        return;
      }
      if (key === 'p' || e.key === 'Escape') {
        if (stageRef.current === 'playing') {
          e.preventDefault();
          setStage('paused');
        } else if (stageRef.current === 'paused') {
          e.preventDefault();
          setStage('playing');
        }
        return;
      }
      if (key === 'r' && (stageRef.current === 'playing' || stageRef.current === 'paused')) {
        e.preventDefault();
        startGame();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [startGame]);

  // TITLE SCREEN
  if (stage === 'title') {
    return (
      <div
        className="rounded-3xl bg-[#0B2B1F] text-white p-8 md:p-10 text-center space-y-6 border-2 border-teal-500/40 shadow-lg"
        data-testid="arcade-title-screen"
      >
        <div
          className="w-16 h-16 mx-auto rounded-2xl text-stone-950 flex items-center justify-center shadow-lg"
          style={{ backgroundColor: spec.accentHex }}
        >
          <Gamepad2 className="w-9 h-9" />
        </div>

        <div className="max-w-xl mx-auto space-y-2.5">
          <div className="text-xs uppercase tracking-widest text-teal-300 font-black">
            {spec.part} · Chapter {spec.chapterNum} · Arcade Challenge
          </div>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {formatMathText(spec.title)}
          </h3>
          <p className="text-sm font-semibold text-amber-300">{formatMathText(spec.subtitle)}</p>
          <p className="text-sm text-teal-100 leading-relaxed">{formatMathText(spec.rules)}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-teal-200 pt-1">
          <span className="inline-flex items-center gap-1.5 font-bold">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            3 Vitality Lives
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold">
            <Flame className="w-4 h-4 text-amber-400" />
            Streak Combos ({spec.waveCount} Waves)
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold">
            <Zap className="w-4 h-4 text-emerald-400" />
            +{spec.roundSeconds}s Wave Timer
          </span>
        </div>

        <div className="pt-2 flex flex-col items-center gap-3">
          <button
            type="button"
            data-start="true"
            onClick={(e) => {
              e.currentTarget.blur();
              startGame();
            }}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-base transition-transform hover:scale-105 shadow-lg cursor-pointer"
          >
            <Play className="w-5 h-5 fill-stone-950" />
            <span>Start Game</span>
          </button>
          <p className="text-[11px] font-mono text-teal-200/80">
            {spec.controlHint} · Press Space or Enter to Start · P Pause · M Mute
          </p>
        </div>
      </div>
    );
  }

  // VICTORY SCREEN
  if (stage === 'victory') {
    return (
      <div
        className="rounded-3xl bg-[#0B2B1F] text-white p-8 md:p-10 text-center space-y-6 border-2 border-amber-400 shadow-lg"
        data-testid="arcade-victory-screen"
      >
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400 text-stone-950 flex items-center justify-center shadow-xl">
          <Trophy className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-black uppercase tracking-widest text-amber-300">
            Mission Cleared · {spec.title}
          </div>
          <h3 className="text-3xl font-black">Stage Conquered!</h3>
          <p className="text-sm text-teal-100 max-w-md mx-auto">
            {lastFeedback || `You conquered all ${spec.waveCount} waves with ${lives} lives remaining!`}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto tabular-nums">
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
            <div className="text-[10px] uppercase font-bold text-teal-300">Score</div>
            <div className="text-2xl font-black text-amber-300">{score}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
            <div className="text-[10px] uppercase font-bold text-teal-300">Best</div>
            <div className="text-2xl font-black text-white">{bestScore}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
            <div className="text-[10px] uppercase font-bold text-teal-300">Lives Left</div>
            <div className="text-2xl font-black text-emerald-300">{lives}/3</div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            data-start="true"
            onClick={startGame}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
          {onGoToQuiz && (
            <button
              type="button"
              onClick={onGoToQuiz}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm transition shadow-lg cursor-pointer"
            >
              <span>Proceed to Slide 5: Recap Quiz</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // GAME OVER SCREEN
  if (stage === 'gameover') {
    return (
      <div
        className="rounded-3xl bg-stone-900 text-white p-8 md:p-10 text-center space-y-6 border-2 border-rose-500/60 shadow-lg"
        data-testid="arcade-gameover-screen"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 border border-rose-400 text-rose-300 flex items-center justify-center text-3xl">
          💔
        </div>
        <div className="space-y-2">
          <div className="text-xs font-black uppercase tracking-widest text-rose-400">
            Defeat · {spec.title}
          </div>
          <h3 className="text-2xl font-black text-white">Game Over!</h3>
          <p className="text-sm text-stone-300 max-w-md mx-auto">
            {lastFeedback || 'You ran out of lives! Re-focus and launch another run.'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto tabular-nums">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-stone-400">Wave</div>
            <div className="text-xl font-black text-white">
              {wave}/{spec.waveCount}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-stone-400">Score</div>
            <div className="text-xl font-black text-amber-300">{score}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-stone-400">Best</div>
            <div className="text-xl font-black text-teal-300">{bestScore}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            data-start="true"
            onClick={startGame}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          {onGoToQuiz && (
            <button
              type="button"
              onClick={onGoToQuiz}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition cursor-pointer"
            >
              <span>Advance to Slide 5</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // PLAYING / PAUSED SHELL + HUD
  return (
    <div
      className={`relative rounded-3xl bg-[#09241A] text-white p-5 sm:p-7 space-y-5 border-2 transition-colors ${
        hitFlash === 'hit'
          ? 'border-emerald-400'
          : hitFlash === 'miss'
          ? 'border-rose-500'
          : 'border-teal-500/40'
      }`}
      data-testid="arcade-active-shell"
    >
      {/* WORLD-MATCHED ARCADE HUD */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-500/30 pb-3.5"
        data-testid="arcade-hud"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1" aria-label={`Lives: ${lives} of 3`}>
            {Array.from({ length: 3 }, (_, idx) => (
              <Heart
                key={idx}
                className={`w-5 h-5 transition-transform ${
                  idx < lives
                    ? 'text-rose-400 fill-rose-400 scale-100'
                    : 'text-stone-700 scale-90'
                }`}
              />
            ))}
          </div>

          <div className="h-5 w-px bg-teal-500/30" aria-hidden="true" />

          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-teal-300">
              {spec.title}
            </div>
            <div className="text-xs font-black text-white tabular-nums">
              Wave {wave} / {spec.waveCount}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 tabular-nums">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-teal-300">Score</div>
            <div className="text-lg font-black text-amber-300">{score}</div>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-black">
            🔥 {combo}×
          </div>

          <div
            className={`px-3 py-1 rounded-lg font-mono font-black text-sm border ${
              timeLeft <= 8
                ? 'bg-rose-700 border-rose-400 text-white'
                : 'bg-white/10 border-white/15 text-white'
            }`}
          >
            {formatTimeRemaining(timeLeft)}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              tabIndex={-1}
              aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
              onClick={(e) => {
                e.currentTarget.blur();
                setSoundEnabled((s) => !s);
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-teal-100 cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              tabIndex={-1}
              aria-label={stage === 'paused' ? 'Resume game' : 'Pause game'}
              onClick={(e) => {
                e.currentTarget.blur();
                setStage((s) => (s === 'paused' ? 'playing' : 'paused'));
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-teal-100 cursor-pointer"
            >
              {stage === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              type="button"
              tabIndex={-1}
              aria-label="Restart game"
              onClick={(e) => {
                e.currentTarget.blur();
                startGame();
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-teal-100 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* LIVE FEEDBACK BANNER */}
      {lastFeedback && (
        <div
          className={`px-4 py-2 rounded-xl text-xs font-bold text-center border ${
            hitFlash === 'miss' || lastFeedback.includes('-1 Life') || lastFeedback.includes('Miss')
              ? 'bg-rose-950/70 border-rose-500/50 text-rose-200'
              : 'bg-teal-950/70 border-teal-400/40 text-amber-200'
          }`}
        >
          {formatMathText(lastFeedback)}
        </div>
      )}

      {/* PLAYFIELD */}
      {children({
        score,
        combo,
        lives,
        wave,
        waveCount: spec.waveCount,
        timeLeft,
        soundEnabled,
        isPaused: stage === 'paused',
        hitFlash,
        lastFeedback,
        awardHit,
        loseLife,
        completeGame,
        setWave,
        setFeedback: setLastFeedback,
        resetTrigger,
      })}

      {/* PAUSE MODAL */}
      {stage === 'paused' && (
        <div className="absolute inset-0 rounded-3xl bg-[#071D15]/95 flex items-center justify-center p-6 z-20">
          <div className="max-w-sm w-full p-6 rounded-2xl bg-[#0F3828] border-2 border-amber-400 text-center space-y-4">
            <h4 className="text-2xl font-black text-white">Game Paused</h4>
            <p className="text-xs text-teal-200">
              {spec.title} · Wave {wave} of {spec.waveCount} · {score} pts
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setStage('playing')}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer"
              >
                Resume Game (P)
              </button>
              <button
                type="button"
                onClick={startGame}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm cursor-pointer"
              >
                Restart Run (R)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
