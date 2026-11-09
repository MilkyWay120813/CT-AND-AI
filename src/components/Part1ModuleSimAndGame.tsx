import React, { useState, useEffect } from 'react';
import { Sliders, Trophy, HelpCircle, CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { ModuleSimulationConfig, ModuleGameConfig } from '../types/part1Curriculum';
import { formatMathText } from '../utils/formatMath';

interface Part1ModuleSimAndGameProps {
  moduleCode: string;
  simulation: ModuleSimulationConfig;
  game: ModuleGameConfig;
  mode: 'simulation' | 'game';
}

export const Part1ModuleSimAndGame: React.FC<Part1ModuleSimAndGameProps> = ({
  moduleCode,
  simulation,
  game,
  mode,
}) => {
  // Simulation state
  const [valA, setValA] = useState<number>(simulation.defaultControlA);
  const [valB, setValB] = useState<number>(simulation.defaultControlB ?? 3);
  const [toggledCells, setToggledCells] = useState<number[]>([]);

  // Game state
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completedRounds, setCompletedRounds] = useState<number>(0);

  useEffect(() => {
    setValA(simulation.defaultControlA);
    setValB(simulation.defaultControlB ?? 3);
    setToggledCells([]);
    setRoundIdx(0);
    setSelectedOption(null);
    setShowHint(false);
    setScore(0);
    setStreak(0);
    setCompletedRounds(0);
  }, [moduleCode, simulation]);

  const toggleCell = (idx: number) => {
    setToggledCells((prev) =>
      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx]
    );
  };

  // Dynamic mathematical readout for the simulation
  const renderSimulationOutput = () => {
    const type = simulation.interactionType;

    if (type === 'locker-grid') {
      const n = Math.max(1, Math.min(25, valA));
      const factors: number[] = [];
      for (let i = 1; i <= n; i++) {
        if (n % i === 0) factors.push(i);
      }
      const isSquare = factors.length % 2 === 1;

      return (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 p-4 rounded-2xl bg-[#0F3828] text-white">
            <div>
              <div className="text-xs uppercase tracking-wider text-teal-300 font-bold">
                Locker #{n} Factor Analysis
              </div>
              <div className="text-lg font-bold mt-0.5">
                Factors of {n}: [{factors.join(', ')}] → {factors.length} factors
              </div>
            </div>
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase ${
                isSquare
                  ? 'bg-amber-400 text-stone-950'
                  : 'bg-teal-900 text-teal-200 border border-teal-600'
              }`}
            >
              {isSquare ? 'ODD FACTORS → LOCKER OPEN (Perfect Square!)' : 'EVEN FACTORS → LOCKER CLOSED'}
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5">
            {Array.from({ length: Math.min(24, Math.max(12, n)) }, (_, i) => {
              const num = i + 1;
              const root = Math.round(Math.sqrt(num));
              const open = root * root === num;
              const active = num === n;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setValA(num)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    active ? 'ring-2 ring-amber-400 scale-105' : ''
                  } ${
                    open
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                      : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                  }`}
                >
                  <div className="text-xs font-bold">#{num}</div>
                  <div className="text-[11px] mt-0.5 font-semibold">
                    {open ? 'OPEN' : 'Shut'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (type === 'odd-l-grid') {
      const layers = Math.max(1, Math.min(10, valA));
      const oddNumbers = Array.from({ length: layers }, (_, i) => 2 * i + 1);
      const sum = layers * layers;

      return (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-teal-300 font-bold">
                Sum of First {layers} Consecutive Odd Numbers
              </div>
              <div className="text-lg font-bold mt-1">
                {oddNumbers.join(' + ')} = {sum} = {layers}²
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-amber-400/20 border border-amber-300 text-amber-200 font-bold">
              {layers} × {layers} Square Grid
            </div>
          </div>

          <div
            className="grid gap-1.5 p-4 rounded-2xl bg-stone-900 border border-stone-700 w-fit mx-auto"
            style={{ gridTemplateColumns: `repeat(${layers}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: layers * layers }, (_, idx) => {
              const r = Math.floor(idx / layers);
              const c = idx % layers;
              const layerIndex = Math.max(r, c);
              const palette = [
                'bg-teal-400',
                'bg-amber-400',
                'bg-rose-400',
                'bg-sky-400',
                'bg-emerald-400',
                'bg-purple-400',
                'bg-orange-400',
                'bg-lime-400',
                'bg-pink-400',
                'bg-cyan-400',
              ];
              return (
                <div
                  key={idx}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${palette[layerIndex % palette.length]} flex items-center justify-center text-xs font-bold text-stone-950 shadow`}
                >
                  {2 * layerIndex + 1}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Universal interactive mathematical workbench for all other modules
    const computedSquare = valA * valA;
    const computedCube = valA * valA * valA;
    const computedProduct = valA * valB;
    const computedRatio = valB !== 0 ? (valA / valB).toFixed(2) : '∞';
    const hasControlB = Boolean(simulation.controlBLabel);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
            <div className="text-xs text-teal-300 uppercase font-bold">Primary Input (A)</div>
            <div className="text-2xl font-bold mt-1">{valA}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
            <div className="text-xs text-teal-300 uppercase font-bold">
              {hasControlB ? 'Secondary Input (B)' : 'Square (A²)'}
            </div>
            <div className="text-2xl font-bold mt-1">
              {hasControlB ? valB : computedSquare}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#134E4A] text-amber-200 border border-amber-300/30">
            <div className="text-xs text-teal-200 uppercase font-bold">
              {hasControlB ? 'Combined (A × B)' : 'Cube (A³)'}
            </div>
            <div className="text-2xl font-bold mt-1">
              {hasControlB ? computedProduct : computedCube}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#134E4A] text-emerald-200 border border-emerald-300/30">
            <div className="text-xs text-teal-200 uppercase font-bold">
              {hasControlB ? 'Proportional Ratio (A : B)' : 'Digital Root (mod 9)'}
            </div>
            <div className="text-2xl font-bold mt-1">
              {hasControlB ? `${valA}:${valB} (${computedRatio})` : (valA % 9) || 9}
            </div>
          </div>
        </div>

        {/* Interactive Visual Canvas Grid */}
        <div className="p-5 rounded-2xl bg-stone-900 text-white border border-stone-700 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2DD4BF]">
              Interactive Geometric & Numeric Model (Click nodes to inspect)
            </span>
            <span className="text-xs text-stone-300">
              Active Formula: {formatMathText(simulation.formulaHighlight)}
            </span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {Array.from({ length: Math.min(24, Math.max(8, valA + valB)) }, (_, idx) => {
              const isSelected = toggledCells.includes(idx);
              const val = (idx + 1) * valA;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleCell(idx)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-[#2DD4BF] text-stone-950 border-white font-bold scale-105'
                      : idx < valA
                      ? 'bg-emerald-900/80 text-emerald-100 border-emerald-500/40 hover:bg-emerald-800'
                      : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                  }`}
                >
                  <div className="text-[10px] opacity-75">n={idx + 1}</div>
                  <div className="text-xs font-bold mt-0.5">{val}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (mode === 'simulation') {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                simulation.isBigSimulation
                  ? 'bg-amber-400 text-stone-950'
                  : 'bg-[#CCFBF1] text-[#0F766E]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              {simulation.isBigSimulation
                ? 'Big Chapter Capstone Simulation'
                : `Mini Simulation · ${moduleCode}`}
            </span>
            <h3 className="text-2xl font-bold text-stone-900 mt-2">
              {formatMathText(simulation.title)}
            </h3>
            <p className="text-stone-600 text-sm mt-1">
              {formatMathText(simulation.description)}
            </p>
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
              <span className="px-2.5 py-0.5 rounded-lg bg-[#0F766E] text-white">
                {valA}
              </span>
            </div>
            <input
              type="range"
              min={simulation.controlAMin}
              max={simulation.controlAMax}
              step={1}
              value={valA}
              onChange={(e) => setValA(Number(e.target.value))}
              className="w-full accent-[#0F766E] cursor-pointer"
            />
          </div>

          {simulation.controlBLabel && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-stone-800">
                <span>{formatMathText(simulation.controlBLabel)}</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-[#0F766E] text-white">
                  {valB}
                </span>
              </div>
              <input
                type="range"
                min={simulation.controlBMin ?? 1}
                max={simulation.controlBMax ?? 12}
                step={1}
                value={valB}
                onChange={(e) => setValB(Number(e.target.value))}
                className="w-full accent-[#0F766E] cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Dynamic Output */}
        {renderSimulationOutput()}
      </div>
    );
  }

  // Game Mode
  const rounds = game.challenges;
  const currentRound = rounds[roundIdx] || rounds[0];
  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentRound.correctIndex;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setCompletedRounds((c) => c + 1);
    if (idx === currentRound.correctIndex) {
      setScore((s) => s + 100 + streak * 25);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextRound = () => {
    setSelectedOption(null);
    setShowHint(false);
    setRoundIdx((prev) => (prev + 1) % rounds.length);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              game.isBigGame
                ? 'bg-amber-400 text-stone-950'
                : 'bg-[#CCFBF1] text-[#0F766E]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            {game.isBigGame
              ? 'Big Chapter Boss Game'
              : `Mini Game · ${moduleCode}`}
          </span>
          <h3 className="text-2xl font-bold text-stone-900 mt-2">
            {formatMathText(game.title)}
          </h3>
          <p className="text-stone-600 text-sm mt-1">
            {formatMathText(game.rules)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-[#0F3828] text-white text-center">
            <div className="text-[10px] uppercase tracking-wider text-teal-300 font-bold">
              Score
            </div>
            <div className="text-lg font-bold">{score} pts</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-center">
            <div className="text-[10px] uppercase tracking-wider font-bold">
              Streak
            </div>
            <div className="text-lg font-bold">🔥 {streak}</div>
          </div>
        </div>
      </div>

      {/* Active Challenge Round Card */}
      <div className="rounded-3xl bg-[#0F3828] text-white p-6 md:p-8 space-y-6 border-2 border-[#2DD4BF]/30">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-teal-300">
          <span>
            Challenge Round {roundIdx + 1} of {rounds.length}
          </span>
          <button
            type="button"
            onClick={() => setShowHint((h) => !h)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-amber-200"
          >
            <HelpCircle className="w-3.5 h-3.5" /> {showHint ? 'Hide Clue' : 'Need a Clue?'}
          </button>
        </div>

        <h4 className="text-xl md:text-2xl font-bold leading-snug">
          {formatMathText(currentRound.prompt)}
        </h4>

        {showHint && (
          <div className="p-3.5 rounded-2xl bg-amber-400/15 border border-amber-300/40 text-amber-200 text-sm">
            💡 <strong>Clue:</strong> {formatMathText(currentRound.clue)}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentRound.options.map((opt: string, idx: number) => {
            let btnStyle =
              'bg-white/10 hover:bg-white/20 border-white/20 text-white';
            if (isAnswered) {
              if (idx === currentRound.correctIndex) {
                btnStyle =
                  'bg-emerald-500 text-stone-950 border-emerald-300 font-bold shadow-lg';
              } else if (idx === selectedOption) {
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
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 ${btnStyle}`}
              >
                <span className="text-base font-semibold">
                  {formatMathText(opt)}
                </span>
                {isAnswered && idx === currentRound.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                {isAnswered &&
                  idx === selectedOption &&
                  idx !== currentRound.correctIndex && (
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
                {isCorrect ? '✨ Spot On!' : 'Not quite — check the proof:'}
              </div>
              <p className="text-sm text-emerald-100">
                {formatMathText(currentRound.explanation)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleNextRound}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2DD4BF] hover:bg-[#14B8A6] text-stone-950 font-bold text-sm transition shadow"
            >
              <span>Next Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>Completed Rounds in Session: {completedRounds}</span>
        <button
          type="button"
          onClick={() => {
            setScore(0);
            setStreak(0);
            setRoundIdx(0);
            setSelectedOption(null);
          }}
          className="inline-flex items-center gap-1 text-[#0F766E] font-bold hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Game Score
        </button>
      </div>
    </div>
  );
};
