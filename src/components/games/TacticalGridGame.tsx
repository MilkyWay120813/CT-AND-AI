import React, { useState, useEffect } from 'react';
import { Flame, ShieldCheck, Bomb, Layers, RotateCw, Zap } from 'lucide-react';
import type { Custom98GameSpec } from '../../data/custom98Games';
import type { ArcadeRuntimeContext } from './ArcadeShell';
import { evaluateLoShuBoard, primeFactorList } from '../../utils/arcadeGameEngine';
import { formatMathText } from '../../utils/formatMath';

interface TacticalGridGameProps {
  spec: Custom98GameSpec;
  runtime: ArcadeRuntimeContext;
}

export const TacticalGridGame: React.FC<TacticalGridGameProps> = ({ spec, runtime }) => {
  const id = spec.moduleId;
  const wIdx = runtime.wave - 1;

  // =========================================================================
  // 1. DUNGEON TILE ESCAPE (mod-1-3): Rising Lava + Prime Factor Pairs
  // =========================================================================
  const [dungeonRow, setDungeonRow] = useState<number>(0);
  useEffect(() => {
    setDungeonRow(0);
  }, [runtime.wave, runtime.resetTrigger]);

  if (id === 'mod-1-3') {
    const levels = [
      { target: 36, root: 6, rows: [[{ val: '2×3', ok: true }, { val: '2×2×3', ok: false }, { val: '3×3', ok: false }], [{ val: '2×2', ok: false }, { val: '2×3', ok: true }, { val: '5×2', ok: false }], [{ val: '2×3 (pair √36)', ok: true }, { val: '3×5', ok: false }, { val: '2×7', ok: false }]] },
      { target: 144, root: 12, rows: [[{ val: '2×2×3', ok: true }, { val: '2×3×3', ok: false }, { val: '2×5', ok: false }], [{ val: '3×5', ok: false }, { val: '2×2×3', ok: true }, { val: '2×2×2', ok: false }], [{ val: '2×7', ok: false }, { val: '3×7', ok: false }, { val: '2×2×3', ok: true }]] },
      { target: 196, root: 14, rows: [[{ val: '2×5', ok: false }, { val: '2×7', ok: true }, { val: '3×7', ok: false }], [{ val: '2×7', ok: true }, { val: '2×11', ok: false }, { val: '7×7', ok: false }], [{ val: '3×5', ok: false }, { val: '2×7', ok: true }, { val: '2×9', ok: false }]] },
      { target: 400, root: 20, rows: [[{ val: '2×2×5', ok: true }, { val: '2×5×5', ok: false }, { val: '2×3×5', ok: false }], [{ val: '2×3×3', ok: false }, { val: '2×2×5', ok: true }, { val: '4×7', ok: false }], [{ val: '5×5', ok: false }, { val: '2×2×5', ok: true }, { val: '2×2×3', ok: false }]] },
    ];
    const cur = levels[wIdx % levels.length];
    const factors = primeFactorList(cur.target).join(' × ');

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-teal-500/40 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase">
              Exit Key Target: √{cur.target} ({cur.target} = {factors})
            </div>
            <div className="text-sm text-teal-100 mt-0.5">
              Climb from Row 1 → Row 3! Step ONLY on the tile with one factor from each prime pair!
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-black flex items-center gap-1.5">
            <Flame className="w-4 h-4" /> Lava at Row {dungeonRow}
          </div>
        </div>

        <div className="space-y-2.5 flex flex-col-reverse">
          {cur.rows.map((rowTiles, rIdx) => {
            const isCurrent = rIdx === dungeonRow;
            const isPast = rIdx < dungeonRow;
            return (
              <div
                key={rIdx}
                className={`p-3 rounded-2xl border-2 transition ${
                  isPast
                    ? 'bg-orange-950/80 border-orange-500/40 opacity-55'
                    : isCurrent
                    ? 'bg-[#124532] border-amber-400 shadow-lg'
                    : 'bg-[#082218] border-white/10 opacity-75'
                }`}
              >
                <div className="text-[10px] font-bold uppercase text-teal-300 mb-2 flex justify-between">
                  <span>Floor {rIdx + 1}</span>
                  <span>{isPast ? '🔥 Submerged in Lava' : isCurrent ? '⬆️ Jump Next' : 'Locked Above'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {rowTiles.map((tile, cIdx) => (
                    <button
                      key={cIdx}
                      type="button"
                      disabled={!isCurrent}
                      onClick={() => {
                        if (tile.ok) {
                          if (rIdx + 1 >= cur.rows.length) {
                            runtime.awardHit(180, `Unlocked √${cur.target} = ${cur.root}!`, true);
                          } else {
                            setDungeonRow((r) => r + 1);
                            runtime.setFeedback(`Safe landing! Jump to Floor ${rIdx + 2}!`);
                          }
                        } else {
                          runtime.loseLife(`Searing tile! ${tile.val} ≠ √${cur.target}.`);
                        }
                      }}
                      className={`py-3 px-2 rounded-xl font-black text-sm border-2 transition cursor-pointer disabled:cursor-not-allowed ${
                        isCurrent
                          ? 'bg-stone-900 hover:bg-teal-700 border-teal-400 text-white'
                          : 'bg-stone-950 border-white/10 text-stone-400'
                      }`}
                    >
                      {tile.val}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. CUBE TETRIS 3D (mod-1-4): Complete 3×3 Floor Layers to Stack Solid Cube
  // =========================================================================
  const [filledCells, setFilledCells] = useState<number[]>([0, 1, 3, 4, 6]);
  const [cubeRotation, setCubeRotation] = useState<number>(0);
  useEffect(() => {
    const presets = [
      [0, 1, 3, 4, 6], // missing 4-L chunk: 2,5,7,8
      [0, 1, 2, 3, 5, 6], // missing 4,7,8
      [0, 2, 4, 6, 8], // missing 1,3,5,7
      [0, 1, 2, 4, 7], // missing 3,5,6,8
    ];
    setFilledCells(presets[wIdx % presets.length]);
    setCubeRotation(0);
  }, [wIdx, runtime.resetTrigger]);

  if (id === 'mod-1-4') {
    const missingCount = 9 - filledCells.length;
    const layerGoal = runtime.wave + 1;
    const targetVolume = 9 * layerGoal;

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-teal-500/40 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase">
              3×3 Polycube Layer {runtime.wave} · Complete all 9 unit voxels
            </div>
            <div className="text-sm text-teal-100 mt-0.5">
              Click empty slots to drop rotated voxel chunks! Remaining voxels: {missingCount}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCubeRotation((r) => (r + 90) % 360)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-black cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" /> Rotate ({cubeRotation}°)
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto p-4 rounded-2xl bg-[#051811] border border-sky-400/40">
          {Array.from({ length: 9 }, (_, idx) => {
            const occupied = filledCells.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                disabled={occupied}
                onClick={() => {
                  const next = [...filledCells, idx];
                  setFilledCells(next);
                  if (next.length === 9) {
                    runtime.awardHit(
                      180,
                      `Completed 3×3 layer (${targetVolume} total unit cubes stacked)!`,
                      true
                    );
                  }
                }}
                className={`h-16 rounded-xl border-2 font-black text-xs transition cursor-pointer ${
                  occupied
                    ? 'bg-sky-500 border-sky-200 text-stone-950 shadow'
                    : 'bg-stone-900 hover:bg-amber-400/20 border-dashed border-amber-400/60 text-amber-300'
                }`}
              >
                {occupied ? 'CUBE ✓' : '+ DROP'}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. DOT-EXPLOSION CHAIN REACTION (mod-3-6): Base-10 / Base-B Exploding Dots
  // =========================================================================
  const [dotCols, setDotCols] = useState<[number, number, number]>([0, 2, 9]);
  const [viruses, setViruses] = useState<[boolean, boolean, boolean]>([true, true, false]);
  useEffect(() => {
    const startStates: [number, number, number][] = [
      [0, 1, 9],
      [0, 9, 9],
      [1, 9, 8],
      [0, 8, 9],
    ];
    setDotCols(startStates[wIdx % startStates.length]);
    setViruses([true, true, false]);
  }, [wIdx, runtime.resetTrigger]);

  if (id === 'mod-3-6') {
    const base = 10;
    const dropDotInCol = (colIdx: 0 | 1 | 2) => {
      const next = [...dotCols] as [number, number, number];
      const nextV = [...viruses] as [boolean, boolean, boolean];
      next[colIdx] += 1;
      let exploded = false;

      // Cascade carry explosions right-to-left (10 -> 1 left!)
      for (let i = 2; i >= 1; i--) {
        if (next[i] >= base) {
          next[i] -= base;
          next[i - 1] += 1;
          nextV[i - 1] = false;
          exploded = true;
        }
      }
      if (next[0] >= base) {
        next[0] -= base;
        exploded = true;
      }

      setDotCols(next);
      setViruses(nextV);

      if (nextV.every((v) => !v)) {
        runtime.awardHit(200, 'Chain-reaction explosion cleared all viral blocks!', true);
      } else if (exploded) {
        runtime.setFeedback('💥 10 dots exploded into 1 dot in the left column!');
      }
    };

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-pink-400/40 text-center">
          <div className="text-xs font-black uppercase text-pink-300">
            10-for-1 Exploding Dots Chain Reactor
          </div>
          <p className="text-xs text-teal-100 mt-1">
            Click a box to drop a dot! When a box hits 10 dots, it explodes and fires 1 dot left to vaporize the virus!
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
          {(['100s Box', '10s Box', '1s Box'] as const).map((label, cIdx) => {
            const count = dotCols[cIdx];
            const hasVirus = viruses[cIdx];
            return (
              <button
                key={label}
                type="button"
                onClick={() => dropDotInCol(cIdx as 0 | 1 | 2)}
                className={`p-4 rounded-2xl border-2 text-center space-y-2 transition cursor-pointer ${
                  hasVirus
                    ? 'bg-rose-950/70 border-rose-400 hover:bg-rose-900/70'
                    : 'bg-[#082218] border-teal-400/60 hover:bg-[#124532]'
                }`}
              >
                <div className="text-[11px] font-black uppercase text-teal-300">{label}</div>
                <div className="text-3xl font-black text-amber-300">{count} / 10</div>
                <div className="text-xs font-bold">
                  {hasVirus ? '🦠 VIRUS ACTIVE' : '✅ CLEAR'}
                </div>
                <div className="text-[10px] text-teal-200">+ Drop Dot</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. PARITY LAVA STEPPING-STONES (mod-5-1): Pair Odd+Odd or Even+Even -> EVEN
  // =========================================================================
  const [selectedPair, setSelectedPair] = useState<number[]>([]);
  useEffect(() => {
    setSelectedPair([]);
  }, [wIdx, runtime.resetTrigger]);

  if (id === 'mod-5-1') {
    const stoneSets = [
      [14, 21, 33, 8, 19],
      [7, 12, 29, 44, 51],
      [101, 204, 305, 408, 17],
      [31, 46, 53, 62, 85],
      [11, 24, 37, 50, 99],
    ];
    const stones = stoneSets[wIdx % stoneSets.length];

    const handlePickStone = (idx: number) => {
      if (selectedPair.includes(idx)) return;
      const next = [...selectedPair, idx];
      if (next.length < 2) {
        setSelectedPair(next);
        return;
      }
      const sum = stones[next[0]] + stones[next[1]];
      if (sum % 2 === 0) {
        setSelectedPair([]);
        runtime.awardHit(
          160,
          `Solid Bridge! ${stones[next[0]]} + ${stones[next[1]]} = ${sum} (EVEN!)`,
          true
        );
      } else {
        setSelectedPair([]);
        runtime.loseLife(
          `Sank! ${stones[next[0]]} + ${stones[next[1]]} = ${sum} (ODD sinks in lava!)`
        );
      }
    };

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-emerald-400/40 text-center">
          <div className="text-xs font-black uppercase text-amber-300">
            Outrun the Crocodile · Build an EVEN Bridge!
          </div>
          <p className="text-xs text-teal-100 mt-1">
            Select TWO stepping stones whose sum is EVEN (Odd+Odd or Even+Even). Odd+Even sinks!
          </p>
        </div>

        <div className="grid grid-cols-5 gap-2.5">
          {stones.map((num, idx) => {
            const active = selectedPair.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePickStone(idx)}
                className={`py-5 rounded-2xl border-2 text-center font-black transition cursor-pointer ${
                  active
                    ? 'bg-amber-400 border-white text-stone-950 scale-105'
                    : 'bg-[#082218] hover:bg-[#124532] border-teal-400 text-white'
                }`}
              >
                <div className="text-xl sm:text-2xl">{num}</div>
                <div className="text-[10px] uppercase text-teal-300 mt-1">
                  {num % 2 === 0 ? 'EVEN' : 'ODD'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. TEMPLE FLOOD GATE (mod-5-7): Swappable 3×3 Lo Shu Magic Square
  // =========================================================================
  const [magicCells, setMagicCells] = useState<number[]>([8, 1, 6, 3, 5, 7, 4, 2, 9]);
  const [swapPick, setSwapPick] = useState<number | null>(null);
  useEffect(() => {
    const scrambles = [
      [8, 1, 6, 3, 5, 7, 4, 2, 9], // swap 2 & 9 solves 15
      [6, 1, 8, 3, 5, 7, 4, 9, 2], // swap 6 & 8 solves 15
      [16, 2, 12, 6, 10, 14, 8, 4, 18], // 2x Lo Shu (swap 4 & 18 solves 30)
    ];
    setMagicCells(scrambles[wIdx % scrambles.length]);
    setSwapPick(null);
  }, [wIdx, runtime.resetTrigger]);

  if (id === 'mod-5-7') {
    const evalBoard = evaluateLoShuBoard(magicCells);
    const targetSum = magicCells.includes(18) ? 30 : 15;

    const handleSwapCell = (idx: number) => {
      if (swapPick === null) {
        setSwapPick(idx);
        return;
      }
      if (swapPick === idx) {
        setSwapPick(null);
        return;
      }
      const next = [...magicCells];
      const tmp = next[swapPick];
      next[swapPick] = next[idx];
      next[idx] = tmp;
      setMagicCells(next);
      setSwapPick(null);

      if (evaluateLoShuBoard(next).isSolved) {
        runtime.awardHit(220, `All 8 magic sums locked to ${targetSum}! Flood gate sealed!`, true);
      }
    };

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-teal-400/40 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase text-amber-300">
              Equalize All 8 Magic Sums to {targetSum}
            </div>
            <p className="text-xs text-teal-100 mt-0.5">
              Click two stone slabs to swap them! Target sum: {targetSum} in every row, column & diagonal.
            </p>
          </div>
          <div className="text-xs font-mono font-bold text-teal-200">
            Diags: {evalBoard.diag1} & {evalBoard.diag2}
          </div>
        </div>

        <div className="max-w-xs mx-auto space-y-2">
          {[0, 1, 2].map((r) => (
            <div key={r} className="grid grid-cols-4 gap-2 items-center">
              {[0, 1, 2].map((c) => {
                const idx = r * 3 + c;
                const active = swapPick === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSwapCell(idx)}
                    className={`h-16 rounded-xl border-2 text-xl font-black transition cursor-pointer ${
                      active
                        ? 'bg-amber-400 border-white text-stone-950 scale-105'
                        : 'bg-[#082218] hover:bg-[#124532] border-teal-400 text-white'
                    }`}
                  >
                    {magicCells[idx]}
                  </button>
                );
              })}
              <div
                className={`h-12 rounded-xl flex items-center justify-center text-xs font-black border ${
                  evalBoard.rowSums[r] === targetSum
                    ? 'bg-emerald-700 border-emerald-400 text-white'
                    : 'bg-rose-900 border-rose-400 text-rose-100'
                }`}
              >
                ={evalBoard.rowSums[r]}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {evalBoard.colSums.map((cs, cIdx) => (
              <div
                key={cIdx}
                className={`py-1.5 rounded-lg text-center text-xs font-black border ${
                  cs === targetSum
                    ? 'bg-emerald-700 border-emerald-400 text-white'
                    : 'bg-rose-900 border-rose-400 text-rose-100'
                }`}
              >
                ={cs}
              </div>
            ))}
            <div className="py-1.5 rounded-lg text-center text-[10px] font-bold bg-white/10 text-teal-200">
              Goal:{targetSum}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 6. NEON GRID HACK (p2-mod-1-1): Click-Paint 10x10 Grid to Match Fraction/Percent
  // =========================================================================
  const [hackPercent, setHackPercent] = useState<number>(0);
  useEffect(() => {
    setHackPercent(0);
  }, [wIdx, runtime.resetTrigger]);

  if (id === 'p2-mod-1-1') {
    const targets = [
      { prompt: 'Paint 3/5 of the firewall matrix', targetPct: 60 },
      { prompt: 'Paint 0.35 (Decimal) of the firewall matrix', targetPct: 35 },
      { prompt: 'Paint 3/4 of the firewall matrix', targetPct: 75 },
      { prompt: 'Paint 9/20 of the firewall matrix', targetPct: 45 },
    ];
    const cur = targets[wIdx % targets.length];

    const toggleCell = (cellIdx: number) => {
      const targetFilled = cellIdx + 1;
      setHackPercent(targetFilled === hackPercent ? cellIdx : targetFilled);
    };

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-teal-400/50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase text-amber-300">
              Firewall Payload: {cur.prompt}
            </div>
            <div className="text-xs text-teal-100 mt-0.5">
              Click any cell in the 10×10 grid (or +10% / +5% / −1% injectors) then press BREACH NODE!
            </div>
          </div>
          <div className="text-xl font-black text-teal-300 tabular-nums">
            Painted: {hackPercent}/100 ({hackPercent}%)
          </div>
        </div>

        <div className="grid grid-cols-10 gap-1 max-w-md mx-auto p-3 rounded-2xl bg-[#051811] border border-teal-500/40">
          {Array.from({ length: 100 }, (_, i) => {
            const on = i < hackPercent;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Firewall cell ${i + 1}`}
                onClick={() => toggleCell(i)}
                className={`h-6 rounded-sm transition cursor-pointer ${
                  on ? 'bg-teal-400 shadow-[0_0_6px_#2dd4bf]' : 'bg-stone-800 hover:bg-stone-700'
                }`}
              />
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {[-10, -1, 1, 5, 10].map((delta) => (
            <button
              key={delta}
              type="button"
              onClick={() => setHackPercent((p) => Math.max(0, Math.min(100, p + delta)))}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-teal-400/40 text-xs font-black cursor-pointer"
            >
              {delta > 0 ? `+${delta}%` : `${delta}%`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              if (hackPercent === cur.targetPct) {
                runtime.awardHit(180, `Firewall breached at exact ${cur.targetPct}%!`, true);
              } else {
                runtime.loseLife(`Trace Alert! Painted ${hackPercent}%, needed ${cur.targetPct}%!`);
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs cursor-pointer"
          >
            BREACH NODE ⚡
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. TIME-BOMB CALENDAR HACK (p2-ch6-m3): Interactive 5×7 Month Grid (3×3 Window)
  // =========================================================================
  const [calCenter, setCalCenter] = useState<number>(10);
  useEffect(() => {
    setCalCenter(10);
  }, [wIdx, runtime.resetTrigger]);

  if (id === 'p2-ch6-m3') {
    const disarmTargets = [
      { targetSum: 90, expectedCenter: 10 },
      { targetSum: 144, expectedCenter: 16 },
      { targetSum: 189, expectedCenter: 21 },
      { targetSum: 108, expectedCenter: 12 },
    ];
    const cur = disarmTargets[wIdx % disarmTargets.length];

    const isInsideWindow = (day: number) => {
      const rC = Math.floor((calCenter - 1) / 7);
      const cC = (calCenter - 1) % 7;
      const rD = Math.floor((day - 1) / 7);
      const cD = (day - 1) % 7;
      return Math.abs(rD - rC) <= 1 && Math.abs(cD - cC) <= 1;
    };

    const currentWindowSum = calCenter * 9;

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-400/50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase text-rose-300 flex items-center gap-1.5">
              <Bomb className="w-4 h-4" /> Disarm Code Target Sum: {cur.targetSum}
            </div>
            <p className="text-xs text-teal-100 mt-0.5">
              Click any valid inner calendar date (Days 9..20 etc.) to center the 3×3 decoder window! Sum = 9 × Center!
            </p>
          </div>
          <div className="text-lg font-black text-amber-300 tabular-nums">
            9 × {calCenter} = {currentWindowSum}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 max-w-md mx-auto">
          {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
            const r = Math.floor((day - 1) / 7);
            const c = (day - 1) % 7;
            const validCenter = r >= 1 && r <= 2 && c >= 1 && c <= 5;
            const inWin = isInsideWindow(day);
            const isC = day === calCenter;
            return (
              <button
                key={day}
                type="button"
                disabled={!validCenter}
                onClick={() => setCalCenter(day)}
                className={`h-11 rounded-lg font-black text-sm border transition cursor-pointer disabled:cursor-default ${
                  isC
                    ? 'bg-amber-400 border-white text-stone-950 scale-105'
                    : inWin
                    ? 'bg-teal-700 border-teal-300 text-white'
                    : 'bg-[#082218] border-white/10 text-teal-200/70'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (currentWindowSum === cur.targetSum) {
                runtime.awardHit(200, `Disarmed! 9 × ${calCenter} = ${cur.targetSum}!`, true);
              } else {
                runtime.loseLife(`Wrong code! 9 × ${calCenter} = ${currentWindowSum} ≠ ${cur.targetSum}!`);
              }
            }}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm cursor-pointer"
          >
            ENTER DISARM CODE ({currentWindowSum})
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 8. ALL OTHER TACTICAL GRID & ALGEBRA/GEOMETRY DISSECTION GAMES
  // (mod-6-1, mod-6-2, mod-6-3, mod-6-4, mod-6-5, mod-6-6, p2-mod-4-2, p2-mod-7-2, p2-mod-7-3)
  // Interactive live dial/slot assembly board matching each module's specific geometry/algebra!
  // =========================================================================
  const [slotA, setSlotA] = useState<number>(1);
  const [slotB, setSlotB] = useState<number>(1);
  const [carveToggle, setCarveToggle] = useState<boolean>(false);
  useEffect(() => {
    setSlotA(1);
    setSlotB(1);
    setCarveToggle(false);
  }, [wIdx, id, runtime.resetTrigger]);

  interface TacticalRound {
    header: string;
    prompt: string;
    labelA: string;
    labelB: string;
    minA: number;
    maxA: number;
    minB: number;
    maxB: number;
    check: (a: number, b: number, flipped: boolean) => boolean;
    toggleLabel?: string;
    requireToggle?: boolean;
    preview: (a: number, b: number, flipped: boolean) => string;
  }

  const getTacticalSpec = (): TacticalRound => {
    if (id === 'mod-6-1') {
      const orders = [
        { a: 6, b: 4, c: 3 },
        { a: 5, b: 7, c: 2 },
        { a: 8, b: 3, c: 5 },
        { a: 7, b: 6, c: 4 },
      ];
      const o = orders[wIdx % orders.length];
      return {
        header: `Room Dimensions: ${o.a} × (${o.b} + ${o.c})`,
        prompt: 'Slice into Left Batch (a×b) and Right Batch (a×c) tiles!',
        labelA: `Left Batch Tiles (${o.a}×${o.b})`,
        labelB: `Right Batch Tiles (${o.a}×${o.c})`,
        minA: 6,
        maxA: 56,
        minB: 6,
        maxB: 45,
        check: (a, b) => a === o.a * o.b && b === o.a * o.c,
        preview: (a, b) => `Left = ${a} + Right = ${b} (Total = ${a + b})`,
      };
    }
    if (id === 'mod-6-2') {
      const rounds = [
        { expr: '3x · (2x + 4)', x2: 6, x1: 12 },
        { expr: '2x · (4x + 5)', x2: 8, x1: 10 },
        { expr: '4x · (x + 3)', x2: 4, x1: 12 },
        { expr: '5x · (2x + 1)', x2: 10, x1: 5 },
      ];
      const r = rounds[wIdx % rounds.length];
      return {
        header: `Capture Pulse: ${r.expr}`,
        prompt: 'Dial exact x² tiles and x-rod tiles to capture cyber-nodes!',
        labelA: 'x² Tiles Count',
        labelB: 'x-Rod Tiles Count',
        minA: 1,
        maxA: 15,
        minB: 1,
        maxB: 20,
        check: (a, b) => a === r.x2 && b === r.x1,
        preview: (a, b) => `${a}x² + ${b}x Nodes Armed`,
      };
    }
    if (id === 'mod-6-3') {
      const rounds = [
        { expr: '(x + 3)(x + 5)', midX: 8, ab: 15 },
        { expr: '(x + 2)(x + 7)', midX: 9, ab: 14 },
        { expr: '(x + 4)(x + 6)', midX: 10, ab: 24 },
        { expr: '(x + 5)(x + 5)', midX: 10, ab: 25 },
      ];
      const r = rounds[wIdx % rounds.length];
      return {
        header: `Hull Breach Frame: ${r.expr}`,
        prompt: 'Set combined ax + bx panel strip and unit ab plate before O₂ drains!',
        labelA: 'Middle x-Terms (a + b)',
        labelB: 'Corner Unit Plate (a × b)',
        minA: 2,
        maxA: 18,
        minB: 4,
        maxB: 32,
        check: (a, b) => a === r.midX && b === r.ab,
        preview: (a, b) => `Hull Seal: x² + ${a}x + ${b}`,
      };
    }
    if (id === 'mod-6-4') {
      const rounds = [
        { a: 6, b: 3 },
        { a: 7, b: 4 },
        { a: 8, b: 2 },
        { a: 5, b: 4 },
      ];
      const r = rounds[wIdx % rounds.length];
      return {
        header: `Fortress Blueprint: (${r.a} + ${r.b})²`,
        prompt: 'Configure Keep (a²), Twin Barracks (2ab), and Watchtower (b²)!',
        labelA: `Keep + Tower (a² + b²)`,
        labelB: `Twin Barracks (2 × a × b)`,
        minA: 10,
        maxA: 90,
        minB: 6,
        maxB: 72,
        check: (a, b) => a === r.a * r.a + r.b * r.b && b === 2 * r.a * r.b,
        preview: (a, b) => `Total Fort Area = ${a} + ${b} = ${a + b}`,
      };
    }
    if (id === 'mod-6-5') {
      const rounds = [
        { a: 10, b: 2 },
        { a: 9, b: 3 },
        { a: 8, b: 1 },
        { a: 12, b: 2 },
      ];
      const r = rounds[wIdx % rounds.length];
      return {
        header: `Metal Plate Trim: (${r.a} − ${r.b})²`,
        prompt: 'Subtract 2ab edge strips, then CLICK Restore +b² Corner Patch!',
        labelA: `Subtract 2ab Strips (Value)`,
        labelB: `Final Tolerance (a−b)²`,
        minA: 8,
        maxA: 80,
        minB: 10,
        maxB: 120,
        toggleLabel: `Restore Overlapping +b² Corner (+${r.b * r.b})`,
        requireToggle: true,
        check: (a, b, flipped) => flipped && a === 2 * r.a * r.b && b === (r.a - r.b) * (r.a - r.b),
        preview: (a, b, f) => `−2ab=${a} | Patch=${f ? 'RESTORED ✓' : 'MISSING!'} | Final=${b}`,
      };
    }
    if (id === 'mod-6-6') {
      const rounds = [
        { a: 8, b: 3 },
        { a: 9, b: 4 },
        { a: 10, b: 2 },
        { a: 7, b: 3 },
      ];
      const r = rounds[wIdx % rounds.length];
      return {
        header: `Reforge Block: ${r.a}² − ${r.b}²`,
        prompt: 'Carve b² notch, Swing Arm into Flat Rectangle (a+b) × (a−b)!',
        labelA: 'Length (a + b)',
        labelB: 'Height (a − b)',
        minA: 5,
        maxA: 18,
        minB: 1,
        maxB: 12,
        toggleLabel: 'Swing Leftover Arm 90° into Flat Beam',
        requireToggle: true,
        check: (a, b, f) => f && a === r.a + r.b && b === r.a - r.b,
        preview: (a, b, f) => `Beam: ${a} × ${b} = ${a * b} (${f ? 'Swung Flat ✓' : 'L-Shape'})`,
      };
    }
    if (id === 'p2-mod-4-2') {
      const waves = [
        { depth: 1, removed: 1, remaining: 3 },
        { depth: 2, removed: 4, remaining: 9 },
        { depth: 3, removed: 13, remaining: 27 },
        { depth: 4, removed: 40, remaining: 81 },
      ];
      const w = waves[wIdx % waves.length];
      return {
        header: `Sierpinski Carve Depth n = ${w.depth}`,
        prompt: 'Each step keeps 3 smaller upright triangles per triangle (3ⁿ)!',
        labelA: 'Solid Uprights Remaining (3ⁿ)',
        labelB: 'Carved Holes Total',
        minA: 1,
        maxA: 90,
        minB: 1,
        maxB: 50,
        check: (a, b) => a === w.remaining && b === w.removed,
        preview: (a, b) => `${a} Solid Triangles · ${b} Holes Punched`,
      };
    }
    if (id === 'p2-mod-7-2') {
      const sails = [
        { base: 8, height: 6 },
        { base: 10, height: 5 },
        { base: 12, height: 4 },
        { base: 9, height: 8 },
      ];
      const s = sails[wIdx % sails.length];
      return {
        header: `Twin Sail Scraps: Base = ${s.base} m, Height = ${s.height} m`,
        prompt: 'Rotate twin triangle 180° into a Parallelogram, then verify Single Sail Area (½bh)!',
        labelA: 'Twin Parallelogram Area (b×h)',
        labelB: 'Single Sail Area (½×b×h)',
        minA: 10,
        maxA: 100,
        minB: 5,
        maxB: 60,
        toggleLabel: 'Rotate Twin Triangle 180° & Stitch Seam',
        requireToggle: true,
        check: (a, b, f) => f && a === s.base * s.height && b === (s.base * s.height) / 2,
        preview: (a, b, f) => `Twin = ${a} m² · Sail = ${b} m² (${f ? 'Stitched ✓' : 'Unpaired'})`,
      };
    }
    // p2-mod-7-3: River Dam Spillway Paver
    const slabs = [
      { a: 6, b: 10, h: 4 },
      { a: 5, b: 9, h: 6 },
      { a: 4, b: 8, h: 5 },
      { a: 7, b: 11, h: 4 },
    ];
    const sl = slabs[wIdx % slabs.length];
    return {
      header: `Spillway Trapezium: a=${sl.a}, b=${sl.b}, h=${sl.h}`,
      prompt: 'Flip twin slab upside-down into a (a+b)×h bay & compute Single Slab Area ½(a+b)h!',
      labelA: 'Bay Width (a + b)',
      labelB: 'Single Slab Area ½(a+b)h',
      minA: 6,
      maxA: 24,
      minB: 10,
      maxB: 70,
      toggleLabel: 'Flip Twin Trapezium Upside Down',
      requireToggle: true,
      check: (a, b, f) => f && a === sl.a + sl.b && b === ((sl.a + sl.b) * sl.h) / 2,
      preview: (a, b, f) => `Bay (a+b)=${a}m · Slab Area=${b}m² (${f ? 'Locked ✓' : 'Open Gap'})`,
    };
  };

  const tSpec = getTacticalSpec();

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#0F3828] border border-teal-400/40 text-center space-y-1">
        <div className="text-xs font-black uppercase text-amber-300 flex items-center justify-center gap-1.5">
          <Layers className="w-4 h-4" /> {formatMathText(tSpec.header)}
        </div>
        <p className="text-xs text-teal-100">{formatMathText(tSpec.prompt)}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#082218] p-4 rounded-2xl border border-white/10">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-teal-200">
            <span>{formatMathText(tSpec.labelA)}</span>
            <span className="px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-black">
              {slotA}
            </span>
          </div>
          <input
            type="range"
            min={tSpec.minA}
            max={tSpec.maxA}
            value={Math.max(tSpec.minA, Math.min(tSpec.maxA, slotA))}
            onChange={(e) => setSlotA(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-teal-200">
            <span>{formatMathText(tSpec.labelB)}</span>
            <span className="px-2 py-0.5 rounded bg-teal-400 text-stone-950 font-black">
              {slotB}
            </span>
          </div>
          <input
            type="range"
            min={tSpec.minB}
            max={tSpec.maxB}
            value={Math.max(tSpec.minB, Math.min(tSpec.maxB, slotB))}
            onChange={(e) => setSlotB(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer"
          />
        </div>
      </div>

      {tSpec.toggleLabel && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setCarveToggle((c) => !c)}
            className={`px-4 py-2.5 rounded-xl border-2 text-xs font-black cursor-pointer transition ${
              carveToggle
                ? 'bg-emerald-700 border-emerald-300 text-white'
                : 'bg-stone-900 border-amber-400 text-amber-300'
            }`}
          >
            {carveToggle ? `✓ ${tSpec.toggleLabel}` : tSpec.toggleLabel}
          </button>
        </div>
      )}

      <div className="p-3 rounded-xl bg-black/30 text-center text-sm font-mono font-bold text-amber-300">
        {tSpec.preview(
          Math.max(tSpec.minA, Math.min(tSpec.maxA, slotA)),
          Math.max(tSpec.minB, Math.min(tSpec.maxB, slotB)),
          carveToggle
        )}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => {
            const clampedA = Math.max(tSpec.minA, Math.min(tSpec.maxA, slotA));
            const clampedB = Math.max(tSpec.minB, Math.min(tSpec.maxB, slotB));
            if (tSpec.check(clampedA, clampedB, carveToggle)) {
              runtime.awardHit(185, `Locked tactical geometry!`, true);
            } else {
              runtime.loseLife(
                `Mismatch! Double check your dimensions${
                  tSpec.requireToggle && !carveToggle ? ' and activate the geometry transform button' : ''
                }!`
              );
            }
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer shadow"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>LOCK & CLEAR WAVE</span>
          <Zap className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
