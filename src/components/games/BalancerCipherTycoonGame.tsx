import React, { useState, useEffect } from 'react';
import {
  Train,
  Lock,
  Scale,
  FlaskConical,
  Bomb,
  Zap,
  ShieldCheck,
  Coins,
  Wrench,
  Sparkles,
} from 'lucide-react';
import type { Custom98GameSpec } from '../../data/custom98Games';
import type { ArcadeRuntimeContext } from './ArcadeShell';
import { checkEulerPolyhedron, digitalRoot, gcdInt } from '../../utils/arcadeGameEngine';
import { formatMathText } from '../../utils/formatMath';

interface BalancerCipherTycoonGameProps {
  spec: Custom98GameSpec;
  runtime: ArcadeRuntimeContext;
}

export const BalancerCipherTycoonGame: React.FC<BalancerCipherTycoonGameProps> = ({
  spec,
  runtime,
}) => {
  const id = spec.moduleId;
  const wIdx = runtime.wave - 1;

  // Reset shared interactive dials on wave change / restart
  const [valA, setValA] = useState<number>(0);
  const [valB, setValB] = useState<number>(0);
  const [valC, setValC] = useState<number>(0);
  const [arrPick, setArrPick] = useState<number[]>([]);
  const [boolMask, setBoolMask] = useState<boolean[]>([]);

  useEffect(() => {
    setValA(0);
    setValB(0);
    setValC(0);
    setArrPick([]);
    setBoolMask([]);
  }, [wIdx, id, runtime.resetTrigger]);

  // =========================================================================
  // 1. 1729 EXPRESS RUSH (mod-1-5): Dual Cubic Crate Loader
  // =========================================================================
  if (id === 'mod-1-5') {
    const dispatches = [
      { target: 1729, hint: 'Load TWO distinct pairs of cubic crates summing to 1729!' },
      { target: 4104, hint: 'Load TWO distinct cubic pairs summing to 4104! (2³+16³ or 9³+15³)' },
      { target: 1729, hint: 'Final Taxicab Sprint: Load 1³+12³ on Train A & 9³+10³ on Train B!' },
      { target: 13832, hint: 'Express Heavy Haul: 2³+24³ vs 18³+20³ = 13832!' },
    ];
    const d = dispatches[wIdx % dispatches.length];
    const cubes = d.target === 4104
      ? [2, 9, 15, 16]
      : d.target === 13832
      ? [2, 18, 20, 24]
      : [1, 9, 10, 12];

    const trainACubes = arrPick.slice(0, 2);
    const trainBCubes = arrPick.slice(2, 4);
    const sumA = trainACubes.reduce((acc, n) => acc + n * n * n, 0);
    const sumB = trainBCubes.reduce((acc, n) => acc + n * n * n, 0);

    const addCrate = (n: number) => {
      if (arrPick.includes(n) || arrPick.length >= 4) return;
      const next = [...arrPick, n];
      setArrPick(next);
    };

    const dispatchTrains = () => {
      if (trainACubes.length === 2 && trainBCubes.length === 2 && sumA === d.target && sumB === d.target) {
        runtime.awardHit(210, `Dual Express dispatched cleanly at ${d.target}!`, true);
      } else {
        runtime.loseLife(`Train balance mismatch! Train A = ${sumA}, Train B = ${sumB} (Target ${d.target})`);
        setArrPick([]);
      }
    };

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-amber-400/40 text-center">
          <div className="text-xs font-black uppercase text-amber-300 flex items-center justify-center gap-1.5">
            <Train className="w-4 h-4" /> Target Dual Tonnage: {d.target}
          </div>
          <p className="text-xs text-teal-100 mt-0.5">{d.hint}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-[#082218] border border-emerald-400/50 space-y-2">
            <div className="text-xs font-black text-emerald-300 uppercase flex justify-between">
              <span>Train A (Slots 1–2)</span>
              <span>{sumA} / {d.target}</span>
            </div>
            <div className="flex gap-2 min-h-[40px]">
              {trainACubes.map((c) => (
                <span key={c} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-black text-xs">
                  {c}³ ({c * c * c})
                </span>
              ))}
              {trainACubes.length < 2 && (
                <span className="text-xs text-teal-300/70 italic self-center">Click crate below...</span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#082218] border border-amber-400/50 space-y-2">
            <div className="text-xs font-black text-amber-300 uppercase flex justify-between">
              <span>Train B (Slots 3–4)</span>
              <span>{sumB} / {d.target}</span>
            </div>
            <div className="flex gap-2 min-h-[40px]">
              {trainBCubes.map((c) => (
                <span key={c} className="px-3 py-1.5 rounded-lg bg-amber-600 text-stone-950 font-black text-xs">
                  {c}³ ({c * c * c})
                </span>
              ))}
              {trainBCubes.length < 2 && (
                <span className="text-xs text-teal-300/70 italic self-center">Loads after Train A...</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {cubes.map((c) => {
            const used = arrPick.includes(c);
            return (
              <button
                key={c}
                type="button"
                disabled={used}
                onClick={() => addCrate(c)}
                className={`px-4 py-3 rounded-xl font-black text-sm border-2 transition cursor-pointer ${
                  used
                    ? 'bg-stone-800 border-stone-700 text-stone-500'
                    : 'bg-[#124532] hover:bg-teal-600 border-teal-300 text-white'
                }`}
              >
                {c}³ Crate
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setArrPick([])}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white cursor-pointer"
          >
            Unload Crates
          </button>
          <button
            type="button"
            onClick={dispatchTrains}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer"
          >
            DISPATCH DUAL TRAINS
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. BIO-LAB CONTAINMENT (mod-1-6): Lasso Triplets of Identical Prime Spores
  // =========================================================================
  if (id === 'mod-1-6') {
    const dishes = [
      { target: 216, spores: [2, 3, 2, 3, 2, 3], factorsNeeded: 2 },
      { target: 1000, spores: [2, 5, 2, 5, 2, 5], factorsNeeded: 2 },
      { target: 3375, spores: [3, 5, 3, 5, 3, 5], factorsNeeded: 2 },
      { target: 729, spores: [3, 3, 3, 3, 3, 3], factorsNeeded: 2 },
    ];
    const dish = dishes[wIdx % dishes.length];
    const selectedIndices = arrPick;
    const clearedSet = new Set(
      boolMask.map((v, i) => (v ? i : -1)).filter((x) => x >= 0)
    );

    const pickSpore = (idx: number) => {
      if (clearedSet.has(idx) || selectedIndices.includes(idx)) return;
      const next = [...selectedIndices, idx];
      if (next.length === 3) {
        const vals = next.map((i) => dish.spores[i]);
        if (vals[0] === vals[1] && vals[1] === vals[2]) {
          const nextCleared = [...boolMask];
          while (nextCleared.length < dish.spores.length) nextCleared.push(false);
          next.forEach((i) => {
            nextCleared[i] = true;
          });
          setBoolMask(nextCleared);
          setArrPick([]);
          const countDone = nextCleared.filter(Boolean).length;
          if (countDone === dish.spores.length) {
            runtime.awardHit(195, `Cube-root crystal ∛${dish.target} stabilized cleanly!`, true);
          } else {
            runtime.setFeedback(`Triplet fused (${vals[0]}³)! Lasso the next identical triplet!`);
          }
        } else {
          setArrPick([]);
          runtime.loseLife(`Contamination! Spores [${vals.join(', ')}] were not identical!`);
        }
      } else {
        setArrPick(next);
      }
    };

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-teal-400/50 text-center">
          <div className="text-xs font-black uppercase text-teal-300">
            Petri Containment Target: ∛{dish.target}
          </div>
          <p className="text-xs text-teal-100 mt-0.5">
            Click 3 IDENTICAL prime spores to fuse each triplet into a cube-root crystal!
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          {dish.spores.map((p, idx) => {
            const done = clearedSet.has(idx);
            const active = selectedIndices.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                disabled={done}
                onClick={() => pickSpore(idx)}
                className={`h-16 rounded-full border-2 font-black text-lg transition cursor-pointer ${
                  done
                    ? 'bg-emerald-900/40 border-emerald-400/40 text-emerald-300 opacity-50'
                    : active
                    ? 'bg-amber-400 border-white text-stone-950 scale-105'
                    : 'bg-[#082218] hover:bg-[#124532] border-teal-400 text-white'
                }`}
              >
                {done ? '💎' : `×${p}`}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. ANCIENT NUMERAL & BASE LOCKS (mod-3-1, mod-3-3, mod-3-4, mod-3-5, mod-3-7)
  // =========================================================================
  if (id === 'mod-3-1') {
    const flocks = [18, 27, 34, 43];
    const target = flocks[wIdx % flocks.length];
    const current = valA * 5 + valB;
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-amber-400/50 text-center">
          <div className="text-xs font-black uppercase text-amber-300">
            Evening Flock Count: {target} Sheep Entering Pen
          </div>
          <p className="text-xs text-teal-100 mt-0.5">
            Stamp +5 Tally Gates and +1 Pebbles to lock exact count before a wolf sneaks in!
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#082218] border border-white/10 text-center space-y-4">
          <div className="text-3xl font-black text-amber-300 tabular-nums">
            Pen Count: {current} <span className="text-sm text-teal-300">({valA} Gates × 5 + {valB} Pebbles)</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            <button
              type="button"
              onClick={() => setValA((v) => v + 1)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs cursor-pointer"
            >
              +5 Tally Gate (𝍸)
            </button>
            <button
              type="button"
              onClick={() => setValB((v) => v + 1)}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-black text-xs cursor-pointer"
            >
              +1 Pebble (●)
            </button>
            <button
              type="button"
              onClick={() => {
                setValA(0);
                setValB(0);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
            >
              Reset Pen
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              if (current === target) {
                runtime.awardHit(180, `Flock of ${target} locked safely! Wolves blocked!`, true);
              } else {
                runtime.loseLife(`Count mismatch (${current} ≠ ${target})! A wolf slipped past the gate!`);
              }
            }}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm cursor-pointer"
          >
            SHUT NIGHT GATE ({current})
          </button>
        </div>
      </div>
    );
  }

  if (id === 'mod-3-3' || id === 'mod-3-4') {
    const isMayan = id === 'mod-3-3';
    const base = isMayan ? 20 : 60;
    const targets = isMayan ? [27, 45, 80, 113] : [75, 130, 195, 252];
    const target = targets[wIdx % targets.length];
    const totalVal = valA * base + valB;

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-emerald-400/50 text-center">
          <div className="text-xs font-black uppercase text-amber-300">
            Target {isMayan ? 'Mayan Base-20' : 'Babylonian Base-60'} Decimal Value: {target}
          </div>
          <p className="text-xs text-teal-100 mt-0.5">
            Set the {base}s Tier and 1s Tier wheels cleanly before trap vents trigger!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="p-4 rounded-2xl bg-[#082218] border border-amber-400/40 text-center space-y-2">
            <div className="text-xs font-bold text-amber-300 uppercase">{base}s Tier</div>
            <div className="text-3xl font-black text-white">{valA}</div>
            <div className="flex justify-center gap-2">
              <button type="button" onClick={() => setValA((v) => Math.max(0, v - 1))} className="px-3 py-1 rounded bg-white/10 font-black cursor-pointer">−1</button>
              <button type="button" onClick={() => setValA((v) => Math.min(base - 1, v + 1))} className="px-3 py-1 rounded bg-amber-400 text-stone-950 font-black cursor-pointer">+1</button>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#082218] border border-teal-400/40 text-center space-y-2">
            <div className="text-xs font-bold text-teal-300 uppercase">1s Tier</div>
            <div className="text-3xl font-black text-white">{valB}</div>
            <div className="flex justify-center gap-2">
              <button type="button" onClick={() => setValB((v) => Math.max(0, v - 1))} className="px-3 py-1 rounded bg-white/10 font-black cursor-pointer">−1</button>
              <button type="button" onClick={() => setValB((v) => Math.min(base - 1, v + 5))} className="px-3 py-1 rounded bg-teal-400 text-stone-950 font-black cursor-pointer">+5</button>
              <button type="button" onClick={() => setValB((v) => Math.min(base - 1, v + 1))} className="px-3 py-1 rounded bg-teal-300 text-stone-950 font-black cursor-pointer">+1</button>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="text-sm font-mono text-amber-200">
            Lock Value: ({valA} × {base}) + {valB} = <strong className="text-white">{totalVal}</strong>
          </div>
          <button
            type="button"
            onClick={() => {
              if (totalVal === target) {
                runtime.awardHit(185, `Dial locked at ${target} (${valA}·${base} + ${valB})!`, true);
              } else {
                runtime.loseLife(`Trap triggered! Your dial read ${totalVal}, needed ${target}.`);
              }
            }}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer inline-flex items-center gap-2"
          >
            <Lock className="w-4 h-4" /> PULL STONE LEVER
          </button>
        </div>
      </div>
    );
  }

  if (id === 'mod-3-5') {
    const crates = [
      { base: 4, dec: 27, label: 'Base-4 Manifest: 27 Decimal Pods' },
      { base: 7, dec: 52, label: 'Base-7 Manifest: 52 Decimal Pods' },
      { base: 5, dec: 63, label: 'Base-5 Manifest: 63 Decimal Pods' },
      { base: 4, dec: 45, label: 'Base-4 Manifest: 45 Decimal Pods' },
    ];
    const c = crates[wIdx % crates.length];
    const curWeight = valA * c.base * c.base + valB * c.base + valC;

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-purple-400/50 text-center">
          <div className="text-xs font-black uppercase text-purple-300">{c.label}</div>
          <p className="text-xs text-teal-100 mt-0.5">
            Spin Base-{c.base} digit tumblers (b², b¹, b⁰) to smuggle {c.dec} pods past drone scan!
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          {[
            { lbl: `${c.base}²s (${c.base * c.base})`, v: valA, set: setValA },
            { lbl: `${c.base}¹s (${c.base})`, v: valB, set: setValB },
            { lbl: `${c.base}⁰s (1)`, v: valC, set: setValC },
          ].map((col) => (
            <button
              key={col.lbl}
              type="button"
              onClick={() => col.set((x) => (x + 1) % c.base)}
              className="p-4 rounded-2xl bg-[#082218] hover:bg-[#124532] border-2 border-purple-400/60 text-center cursor-pointer"
            >
              <div className="text-[11px] font-bold text-purple-300">{col.lbl}</div>
              <div className="text-3xl font-black text-white mt-1">{col.v}</div>
              <div className="text-[10px] text-teal-300 mt-0.5">Tap to +1</div>
            </button>
          ))}
        </div>
        <div className="text-center space-y-2">
          <div className="text-sm font-mono text-amber-200">Manifest Load: {curWeight} / {c.dec}</div>
          <button
            type="button"
            onClick={() => {
              if (curWeight === c.dec) {
                runtime.awardHit(190, `Cleared customs with Base-${c.base} code (${valA}${valB}${valC})!`, true);
              } else {
                runtime.loseLife(`Patrol alert! Loaded weight was ${curWeight}, needed ${c.dec}!`);
              }
            }}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer"
          >
            TRANSMIT MANIFEST
          </button>
        </div>
      </div>
    );
  }

  if (id === 'mod-3-7') {
    const ledgers = [
      { prompt: 'Make THREE HUNDRED FIVE from digits [3, 5]: Insert placeholder ZERO!', options: ['350', '305', '035'], ok: '305' },
      { prompt: 'Make TWO THOUSAND FORTY from [2, 4]: Lock exact 0s!', options: ['2400', '2004', '2040'], ok: '2040' },
      { prompt: 'Make FOUR THOUSAND EIGHT from [4, 8]!', options: ['4008', '4080', '4800'], ok: '4008' },
      { prompt: 'Make SEVEN THOUSAND FIFTY from [7, 5]!', options: ['7500', '7050', '7005'], ok: '7050' },
    ];
    const l = ledgers[wIdx % ledgers.length];
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-teal-400/50 text-center">
          <div className="text-xs font-black uppercase text-amber-300">Silk Road Toll Gate Ledger</div>
          <div className="text-base font-black text-white mt-1">{l.prompt}</div>
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          {l.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                if (opt === l.ok) {
                  runtime.awardHit(175, `Caravan crossed toll bridge first with ${opt}!`, true);
                } else {
                  runtime.loseLife(`Rival overtook you! ${opt} had misplaced zeros vs ${l.ok}!`);
                }
              }}
              className="p-5 rounded-2xl bg-[#082218] hover:bg-[#124532] border-2 border-amber-400/60 text-2xl font-black text-amber-300 cursor-pointer"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. DIGITAL ROOT PINBALL (mod-5-3), BOMB DEFUSAL (mod-5-4), SAFE-CRACKER (mod-5-6)
  // =========================================================================
  if (id === 'mod-5-3') {
    const balls = [4521, 783, 5142, 628, 8190];
    const b = balls[wIdx % balls.length];
    const root = digitalRoot(b);
    const pocket = root === 3 || root === 6 || root === 9 ? String(root) : 'non';
    return (
      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] border border-pink-400/50 text-center space-y-2">
          <div className="text-xs font-black uppercase text-pink-300">Active Pinball Number</div>
          <div className="text-4xl font-black text-amber-300 tabular-nums">{b}</div>
          <p className="text-xs text-teal-100">Route ball to its matching Digital Root Pocket!</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: '3', label: 'Pocket DR = 3' },
            { id: '6', label: 'Pocket DR = 6' },
            { id: '9', label: 'Pocket DR = 9' },
            { id: 'non', label: 'Non-Multiple of 3' },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                if (p.id === pocket) {
                  runtime.awardHit(185, `Multi-ball fever! Digital root of ${b} = ${root}!`, true);
                } else {
                  runtime.loseLife(`Pinball drained! Digital root of ${b} is ${root}.`);
                }
              }}
              className="p-4 rounded-2xl bg-[#082218] hover:bg-pink-950/70 border-2 border-pink-400/60 font-black text-sm text-white cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (id === 'mod-5-4') {
    // Cut one rogue wire from digit sequence so remaining number is divisible by 11!
    const bombs = [
      { digits: [3, 5, 9, 2], cutIdx: 2, clean: '352 (÷11)' },
      { digits: [7, 4, 8, 1], cutIdx: 2, clean: '741? Check 7−4+1=4 no! Wait [1, 8, 3, 2]: cut 8 -> 132 (1-3+2=0!)', altDigits: [1, 8, 3, 2], altCutIdx: 1, altClean: '132' },
      { digits: [2, 7, 5, 3], cutIdx: 2, clean: '273? Cut 3 -> 275 (2-7+5=0)' },
      { digits: [4, 9, 6, 2], cutIdx: 2, clean: '492? Cut 2 -> 496? Wait 4-9+5=0' },
    ];
    // Clean verified 4-digit wire puzzles where cutting exactly 1 wire leaves a true mult of 11
    const verifiedBombs = [
      { digits: [3, 9, 5, 2], cutIdx: 1, resNum: 352 }, // cut 9 -> 352 (3-5+2=0)
      { digits: [1, 8, 3, 2], cutIdx: 1, resNum: 132 }, // cut 8 -> 132 (1-3+2=0)
      { digits: [2, 7, 9, 5], cutIdx: 2, resNum: 275 }, // cut 9 -> 275 (2-7+5=0)
      { digits: [6, 1, 8, 2], cutIdx: 1, resNum: 682 }, // cut 1 -> 682 (6-8+2=0)
    ];
    void bombs;
    const vb = verifiedBombs[wIdx % verifiedBombs.length];
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-400/50 text-center">
          <div className="text-xs font-black uppercase text-rose-300 flex items-center justify-center gap-1.5">
            <Bomb className="w-4 h-4" /> Alternating +/− Bomb Defusal
          </div>
          <p className="text-xs text-teal-100 mt-1">
            Cut ONE rogue digit wire so the remaining 3-digit number has alternating sum = 0 (divisible by 11)!
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {vb.digits.map((d, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const rem = vb.digits.filter((_, i) => i !== idx);
                const val = Number(rem.join(''));
                if (val % 11 === 0) {
                  runtime.awardHit(200, `DEFUSED! Remaining wire ${val} ÷ 11 = ${val / 11}!`, true);
                } else {
                  runtime.loseLife(`SPARK! Remaining ${val} is NOT divisible by 11!`);
                }
              }}
              className="p-4 rounded-2xl bg-[#082218] hover:bg-rose-900/60 border-2 border-rose-400 text-center cursor-pointer"
            >
              <div className="text-[10px] font-bold text-rose-300">CUT WIRE {idx + 1}</div>
              <div className="text-3xl font-black text-white mt-1">{d}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (id === 'mod-5-6') {
    const safes = [
      { clue: 'Dial A and B so:  A B  +  B A  =  77  (with A > B, A=5, B=2)', targetA: 5, targetB: 2 },
      { clue: 'Dial A and B so:  A 4  +  2 B  =  80  (Find carry A & B!)', targetA: 5, targetB: 6 },
      { clue: 'Dial A and B so:  3 A  +  A B  =  81  (Notice ones + carry!)', targetA: 4, targetB: 7 },
      { clue: 'Dial A and B so:  B B  +  A  =  101  (99 + 2)', targetA: 2, targetB: 9 },
    ];
    const s = safes[wIdx % safes.length];
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-amber-400/50 text-center">
          <div className="text-xs font-black uppercase text-amber-300">Vault Cryptarithm Lock</div>
          <div className="text-sm sm:text-base font-black text-white mt-1 font-mono">{s.clue}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setValA((v) => (v + 1) % 10)}
            className="p-4 rounded-2xl bg-[#082218] hover:bg-[#124532] border-2 border-amber-400 text-center cursor-pointer"
          >
            <div className="text-xs font-bold text-amber-300">Gear A (Tap +1)</div>
            <div className="text-3xl font-black text-white">{valA}</div>
          </button>
          <button
            type="button"
            onClick={() => setValB((v) => (v + 1) % 10)}
            className="p-4 rounded-2xl bg-[#082218] hover:bg-[#124532] border-2 border-teal-400 text-center cursor-pointer"
          >
            <div className="text-xs font-bold text-teal-300">Gear B (Tap +1)</div>
            <div className="text-3xl font-black text-white">{valB}</div>
          </button>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (valA === s.targetA && valB === s.targetB) {
                runtime.awardHit(195, `VAULT CRACKED! (A=${valA}, B=${valB})`, true);
              } else {
                runtime.loseLife(`Wrong safe gears (${valA}, ${valB})! Security siren tripped!`);
              }
            }}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer"
          >
            OPEN SAFE DOOR
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. POTION BARTENDER RUSH (mod-7-2): Live GCD Reduction Cauldron
  // =========================================================================
  if (id === 'mod-7-2') {
    const potions = [
      { a: 24, b: 36 },
      { a: 45, b: 60 },
      { a: 42, b: 70 },
      { a: 36, b: 84 },
    ];
    const p = potions[wIdx % potions.length];
    const divFactor = valA === 0 ? 1 : valA;
    const curA = p.a / divFactor;
    const curB = p.b / divFactor;
    const isSimplified = gcdInt(curA, curB) === 1;

    const applyDiv = (d: number) => {
      if (curA % d === 0 && curB % d === 0) {
        setValA(divFactor * d);
        runtime.setFeedback(`Cauldron reduced ÷${d}! Current ratio: ${curA / d} : ${curB / d}`);
      } else {
        runtime.loseLife(`Potion exploded! ${d} does not divide both ${curA} and ${curB}!`);
      }
    };

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-purple-400/50 text-center">
          <div className="text-xs font-black uppercase text-purple-300 flex items-center justify-center gap-1.5">
            <FlaskConical className="w-4 h-4" /> Cauldron Batch: {p.a} : {p.b}
          </div>
          <p className="text-xs text-teal-100 mt-0.5">
            Divide by shared prime factors until no common factor remains, then Serve Mug!
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#082218] border border-white/10 text-center space-y-4">
          <div className="text-3xl font-black text-amber-300 tabular-nums">
            {curA} : {curB}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[2, 3, 5, 7].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => applyDiv(d)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm cursor-pointer"
              >
                Divide ÷{d}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              if (isSimplified) {
                runtime.awardHit(185, `Served crisp simplest potion ${curA}:${curB}!`, true);
              } else {
                runtime.loseLife(`Not simplest yet! ${curA}:${curB} still share GCD = ${gcdInt(curA, curB)}!`);
              }
            }}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer"
          >
            SERVE POTION MUG ({curA}:{curB})
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 6. ZERO-G HABITAT WELDER (p2-mod-4-3): Euler V - E + F = 2
  // =========================================================================
  if (id === 'p2-mod-4-3') {
    const hulls = [
      { name: 'Cube Airlock (F=6, E=12)', F: 6, E: 12, targetV: 8 },
      { name: 'Triangular Prism Pod (F=5, E=9)', F: 5, E: 9, targetV: 6 },
      { name: 'Square Pyramid Dome (F=5, E=8)', F: 5, E: 8, targetV: 5 },
      { name: 'Octahedron Thruster (F=8, E=12)', F: 8, E: 12, targetV: 6 },
    ];
    const h = hulls[wIdx % hulls.length];
    const curV = Math.max(3, valA === 0 ? 4 : valA);
    const ok = checkEulerPolyhedron(curV, h.E, h.F);

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-sky-400/50 text-center">
          <div className="text-xs font-black uppercase text-sky-300">{h.name}</div>
          <p className="text-xs text-teal-100 mt-0.5">
            Set airlock Vertices (V) so Euler invariant V − E + F = 2 seals hull pressure!
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-[#082218] border border-white/10 space-y-3 max-w-md mx-auto text-center">
          <div className="font-mono text-lg font-black text-amber-300">
            V({curV}) − E({h.E}) + F({h.F}) = {curV - h.E + h.F} (Need 2)
          </div>
          <input
            type="range"
            min={4}
            max={12}
            value={curV}
            onChange={(e) => setValA(Number(e.target.value))}
            className="w-full accent-sky-400 cursor-pointer"
          />
          <button
            type="button"
            onClick={() => {
              if (ok) {
                runtime.awardHit(185, `Space habitat welded! V=${curV} satisfied V−E+F=2!`, true);
              } else {
                runtime.loseLife(`Hull leak! Needed V=${h.targetV} for V−E+F=2!`);
              }
            }}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer"
          >
            WELD ZERO-G AIRLOCK
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. ALCHEMIST'S POISON SCALE (p2-ch6-m5) & SHEEP CORRAL (p2-mod-7-7)
  // =========================================================================
  if (id === 'p2-ch6-m5') {
    const scales = [
      { eq: '3x + 6 = 21', stepLabel: 'Undo +6, then ÷3 to find x', targetX: 5 },
      { eq: '4x − 8 = 20', stepLabel: 'Undo −8 (+8), then ÷4 to find x', targetX: 7 },
      { eq: '5x + 10 = 45', stepLabel: 'Undo +10, then ÷5 to find x', targetX: 7 },
      { eq: '2x + 9 = 27', stepLabel: 'Undo +9, then ÷2 to find x', targetX: 9 },
    ];
    const sc = scales[wIdx % scales.length];
    const curX = Math.max(1, valA === 0 ? 4 : valA);
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-emerald-400/50 text-center">
          <div className="text-xs font-black uppercase text-amber-300 flex items-center justify-center gap-1.5">
            <Scale className="w-4 h-4" /> Two-Pan Elixir Equation: {sc.eq}
          </div>
          <p className="text-xs text-teal-100 mt-0.5">{sc.stepLabel}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#082218] border border-white/10 max-w-md mx-auto space-y-3 text-center">
          <div className="text-2xl font-black text-white font-mono">Elixir x = {curX} g</div>
          <input
            type="range"
            min={1}
            max={12}
            value={curX}
            onChange={(e) => setValA(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <button
            type="button"
            onClick={() => {
              if (curX === sc.targetX) {
                runtime.awardHit(190, `Antidote balanced cleanly at x = ${curX}!`, true);
              } else {
                runtime.loseLife(`Poison pan tipped! Balanced solution was x = ${sc.targetX}!`);
              }
            }}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer"
          >
            POUR BALANCED ELIXIR (x = {curX})
          </button>
        </div>
      </div>
    );
  }

  if (id === 'p2-mod-7-7') {
    const pens = [
      { fence: 40, optW: 10 }, // 3 sides: W + L + W = 40 -> max area at W=10, L=20 (Area 200)
      { fence: 60, optW: 15 },
      { fence: 80, optW: 20 },
      { fence: 100, optW: 25 },
    ];
    const pn = pens[wIdx % pens.length];
    const widthW = Math.max(4, Math.min(pn.fence / 2 - 2, valA === 0 ? 6 : valA));
    const lenL = pn.fence - 2 * widthW;
    const area = widthW * lenL;

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-amber-400/50 text-center">
          <div className="text-xs font-black uppercase text-amber-300">
            Wolf-Proof Corral · {pn.fence} m Fence Along Canyon Wall (3 Fenced Sides!)
          </div>
          <p className="text-xs text-teal-100 mt-0.5">
            Slide Width (W) to maximize pasture Area = W × ({pn.fence} − 2W) before wolves strike!
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-[#082218] border border-white/10 max-w-md mx-auto space-y-3 text-center">
          <div className="flex justify-between text-xs font-bold text-teal-200">
            <span>Width W = {widthW} m | Length = {lenL} m</span>
            <span className="text-amber-300 font-black">Area = {area} m²</span>
          </div>
          <input
            type="range"
            min={4}
            max={pn.fence / 2 - 2}
            step={1}
            value={widthW}
            onChange={(e) => setValA(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <button
            type="button"
            onClick={() => {
              if (widthW === pn.optW) {
                runtime.awardHit(200, `PEAK CORRAL LOCKED! ${area} m² max pasture!`, true);
              } else {
                runtime.loseLife(`Wolves squeezed weak fence! Peak area is at W = ${pn.optW} m!`);
              }
            }}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer"
          >
            STAKE WOLF-PROOF FENCE ({area} m²)
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 8. ALL REMAINING TYCOON / CIRCUIT / FOUNDRY / STATISTICAL / ALGEBRA MODULES
  // Covers all remaining 32 moduleIds with exact bespoke multi-wave controls!
  // =========================================================================
  interface TycoonWave {
    header: string;
    prompt: string;
    mode: 'choices' | 'slider';
    choices?: { id: string; label: string; ok: boolean }[];
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    targetSlider?: number;
    okMsg: string;
    errMsg: string;
  }

  const getTycoonWave = (): TycoonWave => {
    switch (id) {
      case 'mod-2-2': {
        const w = [
          { h: 'Core Target: 2⁵ × 2³ (Same Base Multiply)', c: [{ id: 'a', label: '2⁸ Fuel Merge', ok: true }, { id: 'b', label: '2¹⁵ Overload', ok: false }, { id: 'c', label: '4⁸ Meltdown', ok: false }] },
          { h: 'Core Target: 5⁷ ÷ 5² (Dividing Powers)', c: [{ id: 'a', label: '5⁵ Vent Stabilizer', ok: true }, { id: 'b', label: '5⁹ Overheat', ok: false }, { id: 'c', label: '1⁵ Leak', ok: false }] },
          { h: 'Core Target: 3⁴ × 2⁴ (Same Exponent Lock)', c: [{ id: 'a', label: '6⁴ Cooling Rod', ok: true }, { id: 'b', label: '6⁸ Meltdown', ok: false }, { id: 'c', label: '5⁴ Leak', ok: false }] },
          { h: 'Core Target: 7³ ÷ 7³', c: [{ id: 'a', label: '7⁰ = 1 Neutral Zero-State', ok: true }, { id: 'b', label: '0 Shutdown', ok: false }, { id: 'c', label: '7⁶ Blast', ok: false }] },
          { h: 'Core Target: 4² × 4⁵', c: [{ id: 'a', label: '4⁷ Stabilizer', ok: true }, { id: 'b', label: '4¹⁰ Boom', ok: false }, { id: 'c', label: '16⁷ Leak', ok: false }] },
        ][wIdx % 5];
        return { header: w.h, prompt: 'Merge fuel rods using matching-base exponent laws!', mode: 'choices', choices: w.c, okMsg: 'Reactor temperature stabilized!', errMsg: 'Base mismatch triggered thermal spike!' };
      }
      case 'mod-2-7': {
        const w = [
          { h: 'Contract Quote: (3 × 10⁴) × (2 × 10⁵) kg Ore', c: [{ id: 'a', label: '6 × 10⁹ kg', ok: true }, { id: 'b', label: '6 × 10²⁰ kg', ok: false }, { id: 'c', label: '5 × 10⁹ kg', ok: false }] },
          { h: 'Normalize Cargo: 45 × 10⁵ tons', c: [{ id: 'a', label: '4.5 × 10⁶ tons', ok: true }, { id: 'b', label: '4.5 × 10⁴ tons', ok: false }, { id: 'c', label: '0.45 × 10⁵ tons', ok: false }] },
          { h: 'Refinery Split: (8 × 10⁷) ÷ (2 × 10³)', c: [{ id: 'a', label: '4 × 10⁴', ok: true }, { id: 'b', label: '4 × 10¹⁰', ok: false }, { id: 'c', label: '6 × 10⁴', ok: false }] },
          { h: 'Micro-Dust Haul: 0.00052 kg', c: [{ id: 'a', label: '5.2 × 10⁻⁴ kg', ok: true }, { id: 'b', label: '5.2 × 10⁴ kg', ok: false }, { id: 'c', label: '52 × 10⁻³ kg', ok: false }] },
        ][wIdx % 4];
        return { header: w.h, prompt: 'Dispatch normalized scientific-notation yield!', mode: 'choices', choices: w.c, okMsg: 'Space station contract won!', errMsg: 'Rival miner beat your misformatted quote!' };
      }
      case 'mod-4-3': {
        const ang = [65, 110, 75, 125][wIdx % 4];
        return { header: `Rising Flood! Left Link Arm = ${ang}°. Match Right Parallel Link Angle!`, prompt: 'Set opposite parallel arm angle to keep drawbridge level!', mode: 'slider', min: 50, max: 140, step: 5, unit: '°', targetSlider: ang, okMsg: 'Drawbridge stayed dead-level—convoy crossed!', errMsg: `Bridge tilted! Opposite link must match ${ang}°!` };
      }
      case 'mod-4-5': {
        const d = [12, 16, 18, 20][wIdx % 4];
        return { header: `Seismic Sway! Beam Diagonal 1 = ${d} m. Match Diagonal 2 for 90° lock!`, prompt: 'Lock equal-length steel cross-brace!', mode: 'slider', min: 8, max: 24, step: 2, unit: 'm', targetSlider: d, okMsg: 'Tower braced rigidly at 90°!', errMsg: `Unequal diagonals! Frame twisted—needed ${d} m!` };
      }
      case 'mod-6-7': {
        const w = [
          { h: 'Sparking Board: (x + 5)² = x² + [ ??? ] + 25', c: [{ id: 'a', label: 'Solder +10x Wire', ok: true }, { id: 'b', label: 'Solder +5x Wire', ok: false }, { id: 'c', label: 'Solder +25x Wire', ok: false }] },
          { h: 'Sparking Board: (a − 4)² = a² − 8a + [ ??? ]', c: [{ id: 'a', label: 'Solder +16 Wire', ok: true }, { id: 'b', label: 'Solder −16 Wire', ok: false }, { id: 'c', label: 'Solder +8 Wire', ok: false }] },
          { h: 'Sparking Board: (y + 6)(y − 6) = y² − [ ??? ]', c: [{ id: 'a', label: 'Solder −36 Fuse', ok: true }, { id: 'b', label: 'Solder −12 Fuse', ok: false }, { id: 'c', label: 'Solder +12y Fuse', ok: false }] },
          { h: 'Sparking Board: (2x + 3)² = 4x² + [ ??? ] + 9', c: [{ id: 'a', label: 'Solder +12x Wire', ok: true }, { id: 'b', label: 'Solder +6x Wire', ok: false }, { id: 'c', label: 'Solder +9x Wire', ok: false }] },
          { h: 'Sparking Board: x² − 16 = (x + 4)[ ??? ]', c: [{ id: 'a', label: 'Solder (x − 4)', ok: true }, { id: 'b', label: 'Solder (x + 4)', ok: false }, { id: 'c', label: 'Solder (x − 8)', ok: false }] },
        ][wIdx % 5];
        return { header: w.h, prompt: 'Solder missing algebraic wire onto sparking circuit node!', mode: 'choices', choices: w.c, okMsg: 'City power grid restored!', errMsg: 'Short circuit sparked across city block!' };
      }
      case 'mod-7-3': {
        const w = [
          { mapCm: 6, scale: 5, target: 30 },
          { mapCm: 4, scale: 8, target: 32 },
          { mapCm: 5, scale: 6, target: 30 },
          { mapCm: 7, scale: 4, target: 28 },
        ][wIdx % 4];
        return { header: `Blueprint Span = ${w.mapCm} cm · Scale: 1 cm : ${w.scale} m`, prompt: 'Scale gorge bridge span cleanly before test locomotive rolls out!', mode: 'slider', min: 15, max: 45, step: 1, unit: 'm', targetSlider: w.target, okMsg: 'Locomotive thundered safely across bridge!', errMsg: `Bridge fell short! Required ${w.mapCm} × ${w.scale} = ${w.target} m!` };
      }
      case 'mod-7-4': {
        const w = [
          { h: 'Compare Mango Crates: Grab Cheapest per Mango!', c: [{ id: 'a', label: 'Vendor A: ₹120 for 6 (₹20/ea)', ok: false }, { id: 'b', label: 'Vendor B: ₹144 for 8 (₹18/ea) ★', ok: true }, { id: 'c', label: 'Vendor C: ₹110 for 5 (₹22/ea)', ok: false }] },
          { h: 'Compare Notebook Packs: Grab Lowest Unit Price!', c: [{ id: 'a', label: 'Pack X: ₹240 / 12 (₹20/ea) ★', ok: true }, { id: 'b', label: 'Pack Y: ₹230 / 10 (₹23/ea)', ok: false }, { id: 'c', label: 'Pack Z: ₹175 / 7 (₹25/ea)', ok: false }] },
          { h: 'Compare Juice Cartons!', c: [{ id: 'a', label: 'Stand 1: ₹90 / 3L (₹30/L)', ok: false }, { id: 'b', label: 'Stand 2: ₹130 / 5L (₹26/L) ★', ok: true }, { id: 'c', label: 'Stand 3: ₹116 / 4L (₹29/L)', ok: false }] },
          { h: 'Compare Spice Bags!', c: [{ id: 'a', label: 'Vendor P: ₹320 / 8kg (₹40)', ok: false }, { id: 'b', label: 'Vendor Q: ₹270 / 6kg (₹45)', ok: false }, { id: 'c', label: 'Vendor R: ₹360 / 10kg (₹36) ★', ok: true }] },
          { h: 'Compare Rope Coils!', c: [{ id: 'a', label: 'Coil 1: ₹180 / 15m (₹12/m) ★', ok: true }, { id: 'b', label: 'Coil 2: ₹150 / 10m (₹15/m)', ok: false }, { id: 'c', label: 'Coil 3: ₹260 / 20m (₹13/m)', ok: false }] },
        ][wIdx % 5];
        return { header: w.h, prompt: 'Snap every vendor to 1-item unit cost & grab the bargain!', mode: 'choices', choices: w.c, okMsg: 'Bargain crate snatched!', errMsg: 'Overpaid! Compare Total ÷ Quantity first!' };
      }
      case 'mod-7-6': {
        const raids = [
          { h: 'Hoard: 300 Gold Coins · Ratio 3 : 2 : 1 (Captain : Mate : Crew). How many for CAPTAIN?', ans: 150, min: 50, max: 250, step: 25 },
          { h: 'Hoard: 240 Gold Coins · Ratio 5 : 2 : 1. How many for CAPTAIN?', ans: 150, min: 60, max: 200, step: 30 },
          { h: 'Hoard: 360 Gold Coins · Ratio 4 : 3 : 2. How many for CAPTAIN?', ans: 160, min: 80, max: 240, step: 40 },
          { h: 'Hoard: 400 Gold Coins · Ratio 2 : 1 : 1. How many for CAPTAIN?', ans: 200, min: 100, max: 300, step: 50 },
        ][wIdx % 4];
        return { header: raids.h, prompt: 'Slide Captain chest allocation to split hoard without mutiny!', mode: 'slider', min: raids.min, max: raids.max, step: raids.step, unit: 'Gold', targetSlider: raids.ans, okMsg: 'Loot divided fairly—crew cheered!', errMsg: `MUTINY! Captain share was ${raids.ans} Gold!` };
      }
      case 'mod-7-7': {
        const w = [
          { h: 'Rival Mix: 2 Lemon / 5 Water (40%). Beat concentration!', c: [{ id: 'a', label: 'Pump 3 Lemon : 6 Water (50%!) ★', ok: true }, { id: 'b', label: 'Pump 2 Lemon : 6 Water (33%)', ok: false }, { id: 'c', label: 'Pump 1 Lemon : 3 Water (33%)', ok: false }] },
          { h: 'Rival Mix: 3 Lemon / 8 Water (37.5%). Out-tart rival!', c: [{ id: 'a', label: 'Pump 4 Lemon : 8 Water (50%!) ★', ok: true }, { id: 'b', label: 'Pump 3 Lemon : 9 Water (33%)', ok: false }, { id: 'c', label: 'Pump 2 Lemon : 7 Water (28%)', ok: false }] },
          { h: 'Match Exact 3 : 4 Recipe Ratio!', c: [{ id: 'a', label: 'Mix 9 Lemon : 12 Water ✓', ok: true }, { id: 'b', label: 'Mix 6 Lemon : 10 Water', ok: false }, { id: 'c', label: 'Mix 9 Lemon : 10 Water', ok: false }] },
          { h: 'Pure Lemon Surge: Beat 4 : 10 Mix!', c: [{ id: 'a', label: 'Pump 5 : 10 (50%) ★', ok: true }, { id: 'b', label: 'Pump 3 : 10 (30%)', ok: false }, { id: 'c', label: 'Pump 4 : 12 (33%)', ok: false }] },
        ][wIdx % 4];
        return { header: w.h, prompt: 'Mix pitcher to crush rival lemonade stand!', mode: 'choices', choices: w.c, okMsg: 'Line rushed to YOUR lemonade stand!', errMsg: 'Customer frowned—check lemon-to-water ratio!' };
      }
      case 'p2-mod-1-2': {
        const w = [
          { h: 'Reservoir at 100 ML: Surge +20% then Emergency Release −25% = ?', ans: 90 },
          { h: 'Reservoir at 200 ML: Drop −10% then Monsoon Surge +20% = ?', ans: 216 },
          { h: 'Reservoir at 100 ML: Spill −20% then Surge +25% (Back to 100!)', ans: 100 },
          { h: 'Reservoir at 100 ML: Surge +50% then Release −20% = ?', ans: 120 },
        ][wIdx % 4];
        return { header: w.h, prompt: 'Calculate post-sequence reservoir volume (successive % changes)!', mode: 'slider', min: 80, max: 240, step: 2, unit: 'ML', targetSlider: w.ans, okMsg: 'Dam crest held steady!', errMsg: `Spillway overflowed! Exact volume was ${w.ans} ML!` };
      }
      case 'p2-mod-1-3': {
        const w = [
          { h: 'Cost Price = ₹800 · Marked Price = ₹1000. Max Safe Discount without Loss?', c: [{ id: 'a', label: '20% Discount (SP = ₹800 Safe!)', ok: true }, { id: 'b', label: '30% Discount (SP = ₹700 LOSS!)', ok: false }, { id: 'c', label: '25% Discount (SP = ₹750 LOSS!)', ok: false }] },
          { h: 'Cost = ₹600 · Marked = ₹800. Pick Safe Profit Tag!', c: [{ id: 'a', label: '20% Discount (SP = ₹640 Profit!) ★', ok: true }, { id: 'b', label: '40% Discount (SP = ₹480 Loss)', ok: false }, { id: 'c', label: '30% Discount (SP = ₹560 Loss)', ok: false }] },
          { h: 'Cost = ₹400 · Marked = ₹500. Safe Discount?', c: [{ id: 'a', label: '10% Discount (SP = ₹450) ★', ok: true }, { id: 'b', label: '25% Discount (SP = ₹375 Loss)', ok: false }, { id: 'c', label: '30% Discount (SP = ₹350 Loss)', ok: false }] },
          { h: 'Zero-Loss Sale on ₹1200 CP / ₹1500 MP:', c: [{ id: 'a', label: '15% Discount (SP = ₹1275) ★', ok: true }, { id: 'b', label: '25% Discount (SP = ₹1125 Loss)', ok: false }, { id: 'c', label: '40% Discount (Loss)', ok: false }] },
          { h: 'Quick Clearance: CP = ₹500, MP = ₹1000:', c: [{ id: 'a', label: '45% Off (SP = ₹550) ★', ok: true }, { id: 'b', label: '60% Off (SP = ₹400 Loss)', ok: false }, { id: 'c', label: '55% Off (SP = ₹450 Loss)', ok: false }] },
        ][wIdx % 5];
        return { header: w.h, prompt: 'Stamp clearance discount staying strictly above wholesale Cost!', mode: 'choices', choices: w.c, okMsg: 'Black Friday profit secured!', errMsg: 'Sold below wholesale Cost Price!' };
      }
      case 'p2-mod-1-4': {
        const w = [
          { cp: 80, pct: 25, sp: 100 },
          { cp: 120, pct: 25, sp: 150 },
          { cp: 100, pct: 30, sp: 130 },
          { cp: 150, pct: 20, sp: 180 },
        ][wIdx % 4];
        return { header: `Cost = ₹${w.cp} per Wrap · Target Profit = +${w.pct}%`, prompt: 'Dial retail wrap Selling Price!', mode: 'slider', min: 80, max: 220, step: 5, unit: '₹', targetSlider: w.sp, okMsg: 'Shawarma profits hit exact target!', errMsg: `Margin missed! Target price = ₹${w.sp}!` };
      }
      case 'p2-mod-1-5': {
        const w = [
          { h: 'Item Base ₹1000 -> Final Customer Bill ₹1180. Slap GST Slab!', c: [{ id: 'a', label: '18% GST Slab ✓', ok: true }, { id: 'b', label: '12% GST Slab', ok: false }, { id: 'c', label: '5% GST Slab', ok: false }] },
          { h: 'Essential Basket ₹400 -> Final Bill ₹420. Slap GST Slab!', c: [{ id: 'a', label: '5% GST Slab ✓', ok: true }, { id: 'b', label: '12% GST Slab', ok: false }, { id: 'c', label: '18% GST Slab', ok: false }] },
          { h: 'Luxury Item ₹1000 -> Final Bill ₹1280. Slap GST Slab!', c: [{ id: 'a', label: '28% GST Slab ✓', ok: true }, { id: 'b', label: '18% GST Slab', ok: false }, { id: 'c', label: '12% GST Slab', ok: false }] },
          { h: 'Standard Appliance ₹500 -> Final Bill ₹560. Slap GST!', c: [{ id: 'a', label: '12% GST Slab ✓', ok: true }, { id: 'b', label: '18% GST Slab', ok: false }, { id: 'c', label: '5% GST Slab', ok: false }] },
          { h: 'Gadget ₹2000 -> Final Bill ₹2360. Slap GST Slab!', c: [{ id: 'a', label: '18% GST Slab ✓', ok: true }, { id: 'b', label: '28% GST Slab', ok: false }, { id: 'c', label: '12% GST Slab', ok: false }] },
        ][wIdx % 5];
        return { header: w.h, prompt: 'Stamp matching GST tax slab onto speeding item!', mode: 'choices', choices: w.c, okMsg: 'Express checkout stamped cleanly!', errMsg: 'Wrong tax slab jammed the scanner!' };
      }
      case 'p2-mod-1-7': {
        const w = [
          { h: 'Need max return on ₹1000 at 10% for 2 Years!', c: [{ id: 'a', label: 'Compound Vault (₹1210!) ★', ok: true }, { id: 'b', label: 'Simple Interest Vault (₹1200)', ok: false }, { id: 'c', label: 'Zero-Growth Safe (₹1000)', ok: false }] },
          { h: 'Choose fastest O₂ growth: 20% Simple 2yr vs 20% Compound 2yr on ₹100!', c: [{ id: 'a', label: 'Compound Vault (₹144!) ★', ok: true }, { id: 'b', label: 'Simple Vault (₹140)', ok: false }, { id: 'c', label: 'Hold Cash (₹100)', ok: false }] },
          { h: 'Half-Yearly 10% p.a. splits into what per 6-month cycle?', c: [{ id: 'a', label: '5% Rate Every 6 Months ★', ok: true }, { id: 'b', label: '10% Twice (20% p.a.)', ok: false }, { id: 'c', label: '2% Every Month', ok: false }] },
          { h: '3 Years at 10% Compound on ₹1000 reaches:', c: [{ id: 'a', label: '₹1331 O₂ Dome Funded! ★', ok: true }, { id: 'b', label: '₹1300 (Short!)', ok: false }, { id: 'c', label: '₹1100', ok: false }] },
        ][wIdx % 4];
        return { header: w.h, prompt: 'Allocate Mars Colony credits to fund O₂ dome ahead of meteors!', mode: 'choices', choices: w.c, okMsg: 'Oxygen dome pressurized in time!', errMsg: 'Compound growth beat simple interest—dome underfunded!' };
      }
      case 'p2-mod-2-1': {
        const basins = [
          { h: 'Main Basin Capacity = 25 units² (c²). Open twin square leg valves!', c: [{ id: 'a', label: 'Legs 3² + 4² (9 + 16 = 25) ★', ok: true }, { id: 'b', label: 'Legs 2² + 4² (20)', ok: false }, { id: 'c', label: 'Legs 4² + 4² (32 Overflow!)', ok: false }] },
          { h: 'Main Basin = 169 units² (c²). Open twin square legs!', c: [{ id: 'a', label: 'Legs 5² + 12² (25 + 144 = 169) ★', ok: true }, { id: 'b', label: 'Legs 6² + 11² (157)', ok: false }, { id: 'c', label: 'Legs 8² + 10² (164)', ok: false }] },
          { h: 'Main Basin = 100 units² (c²). Open twin square legs!', c: [{ id: 'a', label: 'Legs 6² + 8² (36 + 64 = 100) ★', ok: true }, { id: 'b', label: 'Legs 5² + 7² (74)', ok: false }, { id: 'c', label: 'Legs 7² + 7² (98)', ok: false }] },
          { h: 'Main Basin = 289 units² (c²). Open twin square legs!', c: [{ id: 'a', label: 'Legs 8² + 15² (64 + 225 = 289) ★', ok: true }, { id: 'b', label: 'Legs 9² + 14² (277)', ok: false }, { id: 'c', label: 'Legs 10² + 12² (244)', ok: false }] },
        ][wIdx % 4];
        return { header: basins.h, prompt: 'Route matching a² + b² reservoir legs into c² basin!', mode: 'choices', choices: basins.c, okMsg: 'Aqueduct pressure balanced cleanly!', errMsg: 'Basin overflowed or dried up!' };
      }
      case 'p2-mod-2-2': {
        const cords = [
          { a: 3, b: 4, c: 5 },
          { a: 6, b: 8, c: 10 },
          { a: 5, b: 12, c: 13 },
          { a: 8, b: 15, c: 17 },
        ][wIdx % 4];
        return { header: `Altar Rope Sides: a = ${cords.a} cubits, b = ${cords.b} cubits`, prompt: 'Stake exact closing hypotenuse cord c to lock 90° fire-altar!', mode: 'slider', min: 4, max: 20, step: 1, unit: 'cubits', targetSlider: cords.c, okMsg: '90° Vedic Fire-Altar locked true!', errMsg: `Skewed corner! Needed c = ${cords.c} cubits!` };
      }
      case 'p2-mod-2-5': {
        const w = [
          { h: 'Anvil Pair: [9 m, 12 m] — Hammer 3rd Integer Triple Bar!', c: [{ id: 'a', label: 'Hammer 15 m Bar ★', ok: true }, { id: 'b', label: 'Hammer 14 m Bar', ok: false }, { id: 'c', label: 'Hammer 18 m Bar', ok: false }] },
          { h: 'Anvil Pair: [7 m, 24 m] — Hammer Hypotenuse Bar!', c: [{ id: 'a', label: 'Hammer 25 m Bar ★', ok: true }, { id: 'b', label: 'Hammer 26 m Bar', ok: false }, { id: 'c', label: 'Hammer 22 m Bar', ok: false }] },
          { h: 'Anvil Pair: [10 m, 24 m] — Hammer 3rd Bar!', c: [{ id: 'a', label: 'Hammer 26 m Bar ★', ok: true }, { id: 'b', label: 'Hammer 25 m Bar', ok: false }, { id: 'c', label: 'Hammer 28 m Bar', ok: false }] },
          { h: 'Anvil Pair: [12 m, 16 m] — Hammer 3rd Bar!', c: [{ id: 'a', label: 'Hammer 20 m Bar ★', ok: true }, { id: 'b', label: 'Hammer 18 m Bar', ok: false }, { id: 'c', label: 'Hammer 22 m Bar', ok: false }] },
        ][wIdx % 4];
        return { header: w.h, prompt: 'Forge unbreakable right-triangle knight shield!', mode: 'choices', choices: w.c, okMsg: 'Forged true Pythagorean steel shield!', errMsg: 'Shield cracked under siege impact!' };
      }
      case 'p2-mod-3-1': {
        const w = [
          { cm: 4, km: 25, ans: 100 },
          { cm: 6, km: 15, ans: 90 },
          { cm: 5, km: 20, ans: 100 },
          { cm: 3, km: 35, ans: 105 },
        ][wIdx % 4];
        return { header: `Sonar Bearing: ${w.cm} cm on Chart · Scale: 1 cm = ${w.km} km`, prompt: 'Lock true submarine distance for depth-charge strike!', mode: 'slider', min: 60, max: 130, step: 5, unit: 'km', targetSlider: w.ans, okMsg: 'Direct Sonar Strike on Enemy Sub!', errMsg: `Sub slipped past! True distance = ${w.ans} km!` };
      }
      case 'p2-mod-3-2': {
        const w = [
          { h: '100 kg Bronze · Ratio Copper:Tin:Zinc = 7:2:1. Dial Copper kg!', ans: 70, min: 40, max: 90, step: 5 },
          { h: '80 kg Bronze · Ratio 5:2:1. Dial Copper kg!', ans: 50, min: 30, max: 70, step: 5 },
          { h: '120 kg Bronze · Ratio 6:3:1. Dial Copper kg!', ans: 72, min: 48, max: 96, step: 6 },
          { h: '90 kg Bronze · Ratio 6:2:1. Dial Copper kg!', ans: 60, min: 30, max: 80, step: 5 },
        ][wIdx % 4];
        return { header: w.h, prompt: 'Pour exact Copper alloy mass!', mode: 'slider', min: w.min, max: w.max, step: w.step, unit: 'kg', targetSlider: w.ans, okMsg: 'Cannon barrel forged with zero cracks!', errMsg: `Alloy ratio failed! Needed ${w.ans} kg Copper!` };
      }
      case 'p2-mod-3-4': {
        const grids = [
          { h: 'Solar 45% + Wind 30% + Hydro [ ? ]% = 100% Grid Load', ans: 25 },
          { h: 'Solar 35% + Wind 45% + Hydro [ ? ]% = 100% Grid Load', ans: 20 },
          { h: 'Solar 50% + Wind 15% + Hydro [ ? ]% = 100% Grid Load', ans: 35 },
          { h: 'Solar 40% + Wind 45% + Hydro [ ? ]% = 100% Grid Load', ans: 15 },
        ][wIdx % 4];
        return { header: grids.h, prompt: 'Dial missing Hydro power slice to balance grid at 100%!', mode: 'slider', min: 5, max: 50, step: 5, unit: '%', targetSlider: grids.ans, okMsg: 'City grid lights glow at 100% stability!', errMsg: `Grid tripped! Missing Hydro slice was ${grids.ans}%!` };
      }
      case 'p2-mod-3-5': {
        const rigs = [
          { h: 'Belt Rig: (x=2, y=10), (x=4, y=20), (x=6, y=30)', c: [{ id: 'a', label: 'DIRECT Chute (y/x = 5)', ok: true }, { id: 'b', label: 'INVERSE Chute (xy = k)', ok: false }] },
          { h: 'Belt Rig: (x=2, y=30), (x=3, y=20), (x=5, y=12)', c: [{ id: 'a', label: 'DIRECT Chute (y/x = k)', ok: false }, { id: 'b', label: 'INVERSE Chute (xy = 60)', ok: true }] },
          { h: 'Belt Rig: (x=1, y=8), (x=3, y=24), (x=5, y=40)', c: [{ id: 'a', label: 'DIRECT Chute (y/x = 8)', ok: true }, { id: 'b', label: 'INVERSE Chute (xy = k)', ok: false }] },
          { h: 'Belt Rig: (x=4, y=12), (x=6, y=8), (x=8, y=6)', c: [{ id: 'a', label: 'DIRECT Chute (y/x = k)', ok: false }, { id: 'b', label: 'INVERSE Chute (xy = 48)', ok: true }] },
          { h: 'Belt Rig: (x=2, y=14), (x=5, y=35), (x=10, y=70)', c: [{ id: 'a', label: 'DIRECT Chute (y/x = 7)', ok: true }, { id: 'b', label: 'INVERSE Chute (xy = k)', ok: false }] },
        ][wIdx % 5];
        return { header: rigs.h, prompt: 'Pull Direct or Inverse conveyor lever before belt jams!', mode: 'choices', choices: rigs.c, okMsg: 'Conveyor rig sorted cleanly!', errMsg: 'Wrong chute! Gearbox belt jammed!' };
      }
      case 'p2-mod-3-6': {
        const w = [
          { h: '6 Workers build wall in 10 Days (=60 Worker-Days). Finish in 4 Days?', ans: 15 },
          { h: '12 Workers haul stone in 5 Days (=60 Worker-Days). Finish in 3 Days?', ans: 20 },
          { h: '8 Workers finish ramp in 9 Days (=72 Worker-Days). Finish in 6 Days?', ans: 12 },
          { h: '10 Workers clear block in 12 Days. Finish in 8 Days?', ans: 15 },
        ][wIdx % 4];
        return { header: w.h, prompt: 'Hire exact Workers needed to beat the Nile flood!', mode: 'slider', min: 6, max: 25, step: 1, unit: 'Workers', targetSlider: w.ans, okMsg: 'Pyramid stone locked ahead of flood!', errMsg: `Flood hit early! Needed ${w.ans} Workers!` };
      }
      case 'p2-mod-5-2': {
        const ropes = [
          { h: 'Acrobats perched at [4 kg, 6 kg, 8 kg, 10 kg]. Place Balance Fulcrum Mean!', ans: 7 },
          { h: 'Acrobats perched at [2 kg, 5 kg, 11 kg]. Place Balance Mean!', ans: 6 },
          { h: 'Acrobats perched at [5 kg, 7 kg, 9 kg, 11 kg]. Place Mean!', ans: 8 },
          { h: 'Acrobats perched at [3 kg, 6 kg, 9 kg, 14 kg]. Place Mean!', ans: 8 },
        ][wIdx % 4];
        return { header: ropes.h, prompt: 'Slide Tightrope Fulcrum to exact Arithmetic Mean!', mode: 'slider', min: 3, max: 12, step: 1, unit: 'pos', targetSlider: ropes.ans, okMsg: 'Tightrope dead-level—crowd roared!', errMsg: `Beam tilted! Mean was ${ropes.ans}!` };
      }
      case 'p2-mod-5-3': {
        const w = [
          { h: 'Queue Ages: [14, 15, 19, 22, 30] — Admit EXACT MEDIAN Guest!', c: [{ id: 'a', label: 'Admit 19 ✓', ok: true }, { id: 'b', label: 'Admit 20', ok: false }, { id: 'c', label: 'Admit 22', ok: false }] },
          { h: 'Scores: [8, 9, 9, 10, 9, 12] — Admit MODE Winner!', c: [{ id: 'a', label: 'Admit 9 ★', ok: true }, { id: 'b', label: 'Admit 10', ok: false }, { id: 'c', label: 'Admit 12', ok: false }] },
          { h: 'Even Queue: [10, 14, 18, 22] — Compute True MEDIAN!', c: [{ id: 'a', label: 'Admit 16 ★', ok: true }, { id: 'b', label: 'Admit 14', ok: false }, { id: 'c', label: 'Admit 18', ok: false }] },
          { h: 'Outlier Trap Queue: [10, 11, 12, 13, 99] — True MEDIAN!', c: [{ id: 'a', label: 'Admit 12 ★', ok: true }, { id: 'b', label: 'Admit 29 (Distorted Mean!)', ok: false }, { id: 'c', label: 'Admit 13', ok: false }] },
        ][wIdx % 4];
        return { header: w.h, prompt: 'Bounce impostors and clear velvet rope for Median/Mode VIP!', mode: 'choices', choices: w.c, okMsg: 'VIP passed velvet rope cleanly!', errMsg: 'Wrong guest admitted!' };
      }
      case 'p2-ch6-m1': {
        const w = [
          { h: 'Magician: "Think x. Double it, add 6, halve it, subtract x." Final Result?', c: [{ id: 'a', label: 'ALWAYS 3! (Expose Trick!)', ok: true }, { id: 'b', label: '2x + 3', ok: false }, { id: 'c', label: 'Depends on x', ok: false }] },
          { h: 'Trick: "Think n. Multiply by 3, add 12, divide by 3, subtract n." Always?', c: [{ id: 'a', label: 'ALWAYS 4!', ok: true }, { id: 'b', label: 'ALWAYS 12', ok: false }, { id: 'c', label: 'ALWAYS n', ok: false }] },
          { h: 'Trick: "3 consecutive numbers summed: (x−1) + x + (x+1) ="', c: [{ id: 'a', label: '3x (Always Mult of 3!)', ok: true }, { id: 'b', label: 'x³', ok: false }, { id: 'c', label: '3x + 2', ok: false }] },
          { h: 'Trick: "Reverse 2-digit number 10a+b minus 10b+a ="', c: [{ id: 'a', label: '9(a − b) (Multiple of 9!)', ok: true }, { id: 'b', label: '11(a + b)', ok: false }, { id: 'c', label: 'a − b', ok: false }] },
        ][wIdx % 4];
        return { header: w.h, prompt: 'Sabotage magician trick using algebra cancellation!', mode: 'choices', choices: w.c, okMsg: 'Sabotaged illusion before stage lights flashed!', errMsg: 'Audience fooled—check algebra cancellation!' };
      }
      case 'p2-ch6-m2': {
        const p = [
          { h: '3-Brick Pyramid Base: [x, 5, 3] → Apex Cap = 22. Find Base x!', ans: 9 }, // (x+5)+(5+3) = x+13 = 22 -> x=9
          { h: '3-Brick Pyramid Base: [4, x, 6] → Apex Cap = 24. Find Middle x!', ans: 7 }, // (4+x)+(x+6) = 2x+10 = 24 -> x=7
          { h: '3-Brick Pyramid Base: [3, x, 5] → Apex Cap = 20. Find Middle x!', ans: 6 }, // 2x+8=20 -> x=6
          { h: '3-Brick Pyramid Base: [x, 4, 8] → Apex Cap = 26. Find Base x!', ans: 10 }, // x+4+12=26 -> x=10
        ][wIdx % 4];
        return { header: p.h, prompt: 'Slide hidden base brick value before Mayan pyramid collapses!', mode: 'slider', min: 3, max: 14, step: 1, unit: 'brick', targetSlider: p.ans, okMsg: 'Apex capstone locked!', errMsg: `Pyramid crumbled! Base brick was ${p.ans}!` };
      }
      case 'p2-ch6-m4': {
        const w = [
          { h: 'Bridge Spans Total = 26 m: Left = (3x + 2), Right = (2x + 4). Find x!', ans: 4 },
          { h: 'Girder Cost Total = ₹55: Bolt (4x + 5) + Beam (x + 10) = 55. Find x!', ans: 8 },
          { h: 'Three Span Total = 36 m: x + (x + 2) + (x + 4) = 36. Find x!', ans: 10 },
          { h: 'Cable Length = 42 m: (2x − 3) + (3x + 5) = 42. Find x!', ans: 8 },
        ][wIdx % 4];
        return { header: w.h, prompt: 'Solve bridge equation for base unit x!', mode: 'slider', min: 2, max: 14, step: 1, unit: 'x', targetSlider: w.ans, okMsg: 'Girders bolted within mm tolerance!', errMsg: `Gap too wide! Needed x = ${w.ans}!` };
      }
      case 'p2-ch6-m6': {
        const w = [
          { h: 'Tickets Sold = 10 total · ₹800 collected (Adult ₹100, Child ₹50). How many ADULTS?', ans: 6 },
          { h: 'Tickets Sold = 12 total · ₹900 collected (Adult ₹100, Child ₹50). How many ADULTS?', ans: 6 },
          { h: 'Tickets Sold = 15 total · ₹1100 collected (Adult ₹100, Child ₹50). How many ADULTS?', ans: 7 },
          { h: 'Tickets Sold = 8 total · ₹650 collected (Adult ₹100, Child ₹50). How many ADULTS?', ans: 5 },
        ][wIdx % 4];
        return { header: w.h, prompt: 'Set Adult Turnstile count matching both Total Guests & Revenue!', mode: 'slider', min: 2, max: 12, step: 1, unit: 'Adults', targetSlider: w.ans, okMsg: 'Turnstiles balanced revenue & guest count!', errMsg: `Gate mismatch! Exact Adult count = ${w.ans}!` };
      }
      case 'p2-mod-7-1': {
        const w = [
          { h: 'Plot Triangle: Base 12 m × Height 8 m vs Half-Mower Fuel!', ans: 48 },
          { h: 'Plot Triangle: Base 14 m × Height 6 m. Compute Mow Area!', ans: 42 },
          { h: 'Plot Parallelogram: Base 9 m × Perp Height 7 m. Compute Mow Area!', ans: 63 },
          { h: 'Plot Triangle: Base 15 m × Height 6 m. Compute Mow Area!', ans: 45 },
        ][wIdx % 4];
        return { header: w.h, prompt: 'Dial exact turf square-meters to claim plot!', mode: 'slider', min: 30, max: 75, step: 3, unit: 'm²', targetSlider: w.ans, okMsg: 'Claimed full turf territory cleanly!', errMsg: `Out of fuel! Exact plot area was ${w.ans} m²!` };
      }
      default: {
        // p2-mod-7-6 Royal Palace Garden Paver
        const w = [
          { h: 'Trapezium Patio: Top b₁=6m, Bottom b₂=10m, Height h=5m → Total Tile Area?', ans: 40 },
          { h: 'Trapezium Patio: Top b₁=8m, Bottom b₂=12m, Height h=6m → Tile Area?', ans: 60 },
          { h: 'Trapezium Patio: Top b₁=5m, Bottom b₂=9m, Height h=6m → Tile Area?', ans: 42 },
          { h: 'Trapezium Patio: Top b₁=10m, Bottom b₂=14m, Height h=5m → Tile Area?', ans: 60 },
        ][wIdx % 4];
        return { header: w.h, prompt: 'Calculate ½ × (b₁ + b₂) × h marble paver batch!', mode: 'slider', min: 30, max: 72, step: 2, unit: 'm²', targetSlider: w.ans, okMsg: 'Royal trapezium garden paved seamlessly!', errMsg: `Short on marble tiles! Needed ${w.ans} m²!` };
      }
    }
  };

  const tw = getTycoonWave();
  const clampedSlider =
    tw.mode === 'slider'
      ? Math.max(tw.min ?? 1, Math.min(tw.max ?? 100, valA === 0 ? tw.min ?? 1 : valA))
      : 0;

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-[#0F3828] border border-amber-400/40 text-center space-y-1.5">
        <div className="text-xs font-black uppercase text-amber-300 flex items-center justify-center gap-1.5">
          <Wrench className="w-4 h-4" /> Wave {runtime.wave} Control Deck
        </div>
        <div className="text-base sm:text-lg font-black text-white">
          {formatMathText(tw.header)}
        </div>
        <p className="text-xs text-teal-100">{formatMathText(tw.prompt)}</p>
      </div>

      {tw.mode === 'choices' && tw.choices ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tw.choices.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => {
                if (ch.ok) {
                  runtime.awardHit(180, tw.okMsg, true);
                } else {
                  runtime.loseLife(tw.errMsg);
                }
              }}
              className="p-4 rounded-2xl bg-[#082218] hover:bg-[#124532] border-2 border-teal-400/60 text-white font-black text-sm flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{formatMathText(ch.label)}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-[#082218] border border-white/15 space-y-4 max-w-md mx-auto">
          <div className="flex justify-between text-xs font-bold text-teal-200">
            <span className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-300" /> Calibration Setting
            </span>
            <span className="px-3 py-1 rounded-lg bg-amber-400 text-stone-950 font-black">
              {clampedSlider} {tw.unit}
            </span>
          </div>
          <input
            type="range"
            min={tw.min ?? 1}
            max={tw.max ?? 100}
            step={tw.step ?? 1}
            value={clampedSlider}
            onChange={(e) => setValA(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <button
            type="button"
            onClick={() => {
              if (clampedSlider === tw.targetSlider) {
                runtime.awardHit(185, tw.okMsg, true);
              } else {
                runtime.loseLife(tw.errMsg);
              }
            }}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" /> LOCK & EXECUTE ({clampedSlider} {tw.unit}) <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
