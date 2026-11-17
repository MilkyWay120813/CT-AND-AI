import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, Zap } from 'lucide-react';
import type { Custom98GameSpec } from '../../data/custom98Games';
import type { ArcadeRuntimeContext } from './ArcadeShell';
import { generateArenaConfig } from '../../utils/arcadeWaveGenerators';
import { formatMathText } from '../../utils/formatMath';

interface ArenaDefenseGameProps {
  spec: Custom98GameSpec;
  runtime: ArcadeRuntimeContext;
}

export const ArenaDefenseGame: React.FC<ArenaDefenseGameProps> = ({ spec, runtime }) => {
  const config = generateArenaConfig(spec.moduleId);
  const currentWave = config.waves[(runtime.wave - 1) % config.waves.length];
  const [progressPct, setProgressPct] = useState<number>(8);
  const [laserBurst, setLaserBurst] = useState<{ actionId: string; ok: boolean } | null>(null);
  const progressRef = useRef<number>(8);

  const runtimeRef = useRef(runtime);
  runtimeRef.current = runtime;
  const currentWaveRef = useRef(currentWave);
  currentWaveRef.current = currentWave;

  // Reset approach bar per wave / restart
  useEffect(() => {
    progressRef.current = 8;
    setProgressPct(8);
  }, [runtime.wave, runtime.resetTrigger]);

  // Smooth real-time entity approach loop (pauses cleanly when paused)
  useEffect(() => {
    let rafId = 0;
    let lastTs = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;

      if (!runtimeRef.current.isPaused) {
        const speed = 7.5 * (currentWaveRef.current?.speedFactor || 1);
        progressRef.current += speed * dt;

        if (progressRef.current >= 100) {
          progressRef.current = 8;
          runtimeRef.current.loseLife(
            `Breach! "${currentWaveRef.current.label}" hit your gate!`
          );
        }
        setProgressPct(Math.round(progressRef.current));
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [runtime.resetTrigger, runtime.wave]);

  const handleTriggerAction = (actionId: string) => {
    if (runtime.isPaused) return;
    const ok = actionId === currentWave.correctAction;
    setLaserBurst({ actionId, ok });
    setTimeout(() => setLaserBurst(null), 260);

    if (ok) {
      progressRef.current = 8;
      setProgressPct(8);
      runtime.awardHit(
        160,
        `Direct hit on ${currentWave.label}!`,
        true
      );
    } else {
      runtime.loseLife(
        `Missed! ${currentWave.label} (${currentWave.sublabel || ''}) required a different response!`
      );
    }
  };

  // Hotkeys 1..4 for fast arcade reaction
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (runtimeRef.current.isPaused) return;
      const idx = ['1', '2', '3', '4'].indexOf(e.key);
      if (idx >= 0 && config.actions[idx]) {
        e.preventDefault();
        handleTriggerAction(config.actions[idx].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const toneClass = (tone: 'emerald' | 'rose' | 'amber' | 'sky') => {
    switch (tone) {
      case 'emerald':
        return 'bg-emerald-700 hover:bg-emerald-600 border-emerald-400 text-white';
      case 'rose':
        return 'bg-rose-700 hover:bg-rose-600 border-rose-400 text-white';
      case 'amber':
        return 'bg-amber-400 hover:bg-amber-300 border-amber-200 text-stone-950';
      case 'sky':
        return 'bg-sky-700 hover:bg-sky-600 border-sky-400 text-white';
    }
  };

  const renderEntityBadge = () => {
    const k = currentWave.visualKind;
    if (k === 'goblin-wave') return '👾 Goblin Formation';
    if (k === 'asteroid') return '☄️ Incoming Asteroid';
    if (k === 'microbe') return '🦠 Bloodstream Target';
    if (k === 'crystal') return '💎 Raw Crystal';
    if (k === 'train') return '🚂 Express Freight';
    if (k === 'photo') return '📸 Red-Carpet Frame';
    if (k === 'truss') return '📐 Steel Bridge Truss';
    if (k === 'net') return '📦 6-Square Belt Net';
    return '🚀 Algebraic Missile';
  };

  const dangerHigh = progressPct >= 70;

  return (
    <div className="space-y-4">
      <p className="text-xs sm:text-sm font-semibold text-teal-100 text-center">
        {formatMathText(config.instructions)}
      </p>

      {/* LIVE 3-LANE ARCADE TRACK / CONVEYOR FIELD */}
      <div
        className="relative rounded-2xl bg-[#051811] border-2 border-teal-500/30 p-4 sm:p-5 overflow-hidden space-y-3"
        data-testid="arena-playfield"
      >
        {/* Target Gate / Turret Line on Right */}
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-teal-300">
          <span>Spawn Zone</span>
          <span className={dangerHigh ? 'text-rose-400 animate-pulse' : 'text-amber-300'}>
            {dangerHigh ? '⚠️ IMPACT IMMINENT!' : `Distance Remaining: ${100 - progressPct}%`}
          </span>
          <span className="text-rose-300 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> Defense Gate
          </span>
        </div>

        {/* 3 Visual Lanes */}
        <div className="space-y-2.5">
          {[0, 1, 2].map((laneIdx) => {
            const isActiveLane = currentWave.lane === laneIdx;
            return (
              <div
                key={laneIdx}
                className={`relative h-20 rounded-xl border flex items-center px-3 transition-colors ${
                  isActiveLane
                    ? 'bg-[#0F3828]/80 border-teal-400/50'
                    : 'bg-[#082218]/60 border-white/10'
                }`}
              >
                <div className="text-[10px] font-mono text-teal-300/50 uppercase">
                  Lane {laneIdx + 1}
                </div>

                {isActiveLane && (
                  <div
                    className={`absolute top-2 bottom-2 px-3.5 rounded-xl border-2 flex flex-col justify-center shadow-lg transition-transform ${
                      laserBurst
                        ? laserBurst.ok
                          ? 'bg-emerald-600 border-white scale-105'
                          : 'bg-rose-700 border-rose-300'
                        : dangerHigh
                        ? 'bg-rose-900/95 border-rose-400'
                        : 'bg-[#124532] border-amber-400'
                    }`}
                    style={{
                      left: `${Math.min(62, Math.max(4, progressPct * 0.62))}%`,
                    }}
                  >
                    <div className="text-[10px] font-bold text-amber-300 uppercase whitespace-nowrap">
                      {renderEntityBadge()}
                    </div>
                    <div className="text-sm sm:text-base font-black text-white whitespace-nowrap">
                      {formatMathText(currentWave.label)}
                    </div>
                    {currentWave.sublabel && (
                      <div className="text-[10px] text-teal-100 whitespace-nowrap">
                        {formatMathText(currentWave.sublabel)}
                      </div>
                    )}
                  </div>
                )}

                {/* Laser Gate Beam at right end */}
                <div
                  className={`ml-auto w-2 h-14 rounded-full ${
                    laserBurst?.ok
                      ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]'
                      : dangerHigh && isActiveLane
                      ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
                      : 'bg-teal-500/40'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* HOTKEY ARCADE CONTROLS */}
      <div
        className={`grid gap-3 ${
          config.actions.length === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : config.actions.length === 3
            ? 'grid-cols-1 sm:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-4'
        }`}
      >
        {config.actions.map((act) => (
          <button
            key={act.id}
            type="button"
            onClick={() => handleTriggerAction(act.id)}
            className={`px-4 py-3.5 rounded-2xl border-2 font-black text-sm flex items-center justify-between gap-2 transition-transform active:scale-95 cursor-pointer shadow ${toneClass(
              act.tone
            )}`}
          >
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 shrink-0" />
              <span>{formatMathText(act.label)}</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-black/25 text-xs font-mono">
              [{act.hotkey}]
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
