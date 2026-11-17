import React, { useState } from 'react';
import type { SimRenderProps } from './Part1NumberSimulators';

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export const Part1ShapeLogicSimulators: React.FC<SimRenderProps> = ({
  moduleId,
  simA,
  simB,
}) => {
  // Interactive state for Ch4 Venn mask & Ch5/Ch6
  const [vennProps, setVennProps] = useState({
    fourEqual: true,
    rightAngles: true,
    parallelOne: true,
  });

  // =========================================================================
  // PART I · CHAPTER 4: QUADRILATERALS (mod-4-1 .. mod-4-7)
  // =========================================================================

  // mod-4-1: Polygon Vertex Stretcher
  if (moduleId === 'mod-4-1') {
    const sides = Math.max(3, Math.min(6, simA));
    const offset = simB;
    const lockedSum = (sides - 2) * 180;
    const pts = Array.from({ length: sides }, (_, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
      const r = 72 + (i === 0 ? offset * 0.45 : 0);
      const x = 150 + r * Math.cos(ang) + (i === 0 ? offset * 0.6 : 0);
      const y = 105 + r * Math.sin(ang);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    return (
      <div data-testid="sim-canvas-mod-4-1" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Polygon Vertex Stretcher ({sides}-Gon)
            </div>
            <div className="text-2xl font-black mt-1 tabular-nums">
              Interior Sum Locked = ({sides} − 2) × 180° ={' '}
              <span className="text-amber-300">{lockedSum}°</span>
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-400 text-stone-950 font-black text-xs">
            Avg Angle: {(lockedSum / sides).toFixed(1)}°
          </div>
        </div>
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex justify-center">
          <svg viewBox="0 0 300 210" className="w-full max-w-sm h-48">
            <polygon
              points={pts}
              fill="rgba(20, 184, 166, 0.25)"
              stroke="#0F766E"
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>
    );
  }

  // mod-4-2: Kite & Trapezium Morph Rig
  if (moduleId === 'mod-4-2') {
    const topArm = simA * 10;
    const botArm = simB * 9;
    return (
      <div data-testid="sim-canvas-mod-4-2" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Kite &amp; Trapezium Dual Rig
          </div>
          <div className="text-xl font-black mt-1 tabular-nums">
            Kite Arms ({simA}, {simB}) vs Trapezium Parallel Bases
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <svg viewBox="0 0 220 170" className="w-full h-44 bg-stone-50 rounded-2xl border border-stone-200">
            <polygon
              points={`110,${Math.max(15, 75 - topArm * 0.5)} ${110 + 55},80 110,${Math.min(160, 85 + botArm * 0.6)} ${110 - 55},80`}
              fill="rgba(251, 191, 36, 0.35)"
              stroke="#D97706"
              strokeWidth="2.5"
            />
            <line x1="110" y1="20" x2="110" y2="155" stroke="#0F766E" strokeDasharray="4 3" />
            <line x1="55" y1="80" x2="165" y2="80" stroke="#0F766E" strokeDasharray="4 3" />
          </svg>
          <svg viewBox="0 0 220 170" className="w-full h-44 bg-stone-50 rounded-2xl border border-stone-200">
            <polygon
              points={`${110 - simA * 5},40 ${110 + simA * 5},40 ${110 + simB * 7},135 ${110 - simB * 7},135`}
              fill="rgba(20, 184, 166, 0.28)"
              stroke="#0F766E"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </div>
    );
  }

  // mod-4-3: 4-Bar Linkage Pantograph (Parallelogram)
  if (moduleId === 'mod-4-3') {
    const rad = (simA * Math.PI) / 180;
    const slantDx = Math.cos(rad) * 70;
    const h = Math.sin(rad) * 70;
    const base = simB * 11;
    const x0 = 55;
    const y0 = 140;
    const p1 = `${x0},${y0}`;
    const p2 = `${x0 + base},${y0}`;
    const p3 = `${x0 + base + slantDx},${y0 - h}`;
    const p4 = `${x0 + slantDx},${y0 - h}`;

    return (
      <div data-testid="sim-canvas-mod-4-3" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            4-Bar Linkage Pantograph · Hinge Angle {simA}°
          </div>
          <div className="text-xl font-black mt-1 tabular-nums">
            Adjacent Angles: <span className="text-amber-300">{simA}° + {180 - simA}° = 180°</span> · Diagonals Bisect!
          </div>
        </div>
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex justify-center">
          <svg viewBox="0 0 320 170" className="w-full max-w-md h-44">
            <polygon points={`${p1} ${p2} ${p3} ${p4}`} fill="rgba(15, 118, 110, 0.2)" stroke="#0F766E" strokeWidth="3" />
            <line x1={x0} y1={y0} x2={x0 + base + slantDx} y2={y0 - h} stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 3" />
            <line x1={x0 + base} y1={y0} x2={x0 + slantDx} y2={y0 - h} stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 3" />
          </svg>
        </div>
      </div>
    );
  }

  // mod-4-4: Perpendicular Bisector Slicer (Rhombus)
  if (moduleId === 'mod-4-4') {
    const d1 = simA;
    const d2 = simB;
    const side = Math.sqrt((d1 / 2) ** 2 + (d2 / 2) ** 2).toFixed(2);
    return (
      <div data-testid="sim-canvas-mod-4-4" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Perpendicular Bisector Slicer (90° Cross)
          </div>
          <div className="text-2xl font-black mt-1 tabular-nums">
            d₁ = {d1}, d₂ = {d2} ⇒ All 4 Sides Equal{' '}
            <span className="text-amber-300">{side}</span>!
          </div>
        </div>
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex justify-center">
          <svg viewBox="0 0 280 170" className="w-full max-w-sm h-44">
            <polygon
              points={`140,${85 - d2 * 4} ${140 + d1 * 6},85 140,${85 + d2 * 4} ${140 - d1 * 6},85`}
              fill="rgba(251, 191, 36, 0.28)"
              stroke="#D97706"
              strokeWidth="3"
            />
            <line x1={140 - d1 * 6} y1="85" x2={140 + d1 * 6} y2="85" stroke="#0F766E" strokeWidth="2" />
            <line x1="140" y1={85 - d2 * 4} x2="140" y2={85 + d2 * 4} stroke="#0F766E" strokeWidth="2" />
          </svg>
        </div>
      </div>
    );
  }

  // mod-4-5: Diagonal Equality Tester (Rectangle)
  if (moduleId === 'mod-4-5') {
    const angle = simA;
    const isRect = Math.abs(angle - 90) <= 2;
    const skew = ((90 - angle) / 40) * 45;
    return (
      <div data-testid="sim-canvas-mod-4-5" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Diagonal Equality Tester
            </div>
            <div className="text-xl font-black mt-1 tabular-nums">
              Corner = {angle}° ·{' '}
              <span className={isRect ? 'text-amber-300' : 'text-rose-300'}>
                {isRect ? 'AC = BD (RECTANGLE LOCKED 90°!)' : `Diagonals Unequal (${Math.abs(angle - 90)}° off)`}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex justify-center">
          <svg viewBox="0 0 300 160" className="w-full max-w-sm h-40">
            <polygon
              points={`${65 + skew},35 ${225 + skew},35 225,130 65,130`}
              fill={isRect ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.16)'}
              stroke={isRect ? '#059669' : '#E11D48'}
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>
    );
  }

  // mod-4-6: Origami Symmetry Folder
  if (moduleId === 'mod-4-6') {
    const rot = simA * 90;
    const axis = simB;
    return (
      <div data-testid="sim-canvas-mod-4-6" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Origami Square Symmetry Folder
          </div>
          <div className="text-xl font-black mt-1">
            Rotated {rot}° · Active Symmetry Crease Line #{axis} of 4
          </div>
        </div>
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex justify-center">
          <svg viewBox="0 0 200 160" className="w-48 h-40">
            <g transform={`rotate(${rot} 100 80)`}>
              <rect x="45" y="25" width="110" height="110" rx="4" fill="#CCFBF1" stroke="#0F766E" strokeWidth="3" />
              <circle cx="65" cy="45" r="7" fill="#F59E0B" />
            </g>
            {axis === 1 && <line x1="100" y1="15" x2="100" y2="145" stroke="#E11D48" strokeWidth="2.5" strokeDasharray="5 3" />}
            {axis === 2 && <line x1="30" y1="80" x2="170" y2="80" stroke="#E11D48" strokeWidth="2.5" strokeDasharray="5 3" />}
            {axis === 3 && <line x1="35" y1="15" x2="165" y2="145" stroke="#E11D48" strokeWidth="2.5" strokeDasharray="5 3" />}
            {axis === 4 && <line x1="165" y1="15" x2="35" y2="145" stroke="#E11D48" strokeWidth="2.5" strokeDasharray="5 3" />}
          </svg>
        </div>
      </div>
    );
  }

  // mod-4-7: Venn & Family Tree Explorer
  if (moduleId === 'mod-4-7') {
    const shapes = [
      { name: 'Trapezium', match: vennProps.parallelOne && !vennProps.fourEqual && !vennProps.rightAngles },
      { name: 'Parallelogram', match: vennProps.parallelOne && !vennProps.fourEqual },
      { name: 'Rectangle', match: vennProps.parallelOne && vennProps.rightAngles },
      { name: 'Rhombus', match: vennProps.parallelOne && vennProps.fourEqual },
      { name: 'Square', match: vennProps.parallelOne && vennProps.fourEqual && vennProps.rightAngles },
    ];
    return (
      <div data-testid="sim-canvas-mod-4-7" className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'parallelOne', label: '1+ Pair Parallel Sides' },
            { key: 'rightAngles', label: '90° Right Corners' },
            { key: 'fourEqual', label: '4 Equal Side Lengths' },
          ].map((item) => {
            const k = item.key as keyof typeof vennProps;
            const active = vennProps[k];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setVennProps((prev) => ({ ...prev, [k]: !prev[k] }))}
                className={`px-3.5 py-2 rounded-xl text-xs font-black border-2 transition cursor-pointer ${
                  active ? 'bg-amber-400 text-stone-950 border-amber-500' : 'bg-stone-100 text-stone-700 border-stone-300'
                }`}
              >
                {active ? '✓ ' : ''}{item.label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {shapes.map((s) => (
            <div
              key={s.name}
              className={`p-3 rounded-xl border-2 text-center font-black text-xs ${
                s.match ? 'bg-[#0F3828] text-amber-300 border-teal-400 shadow-md' : 'bg-stone-100 text-stone-500 border-stone-200 opacity-60'
              }`}
            >
              {s.name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // PART I · CHAPTER 5: NUMBER PLAY (mod-5-1 .. mod-5-7)
  // =========================================================================

  // mod-5-1: Parity Tile Combiner
  if (moduleId === 'mod-5-1') {
    const sum = simA + simB;
    const isEvenSum = sum % 2 === 0;
    return (
      <div data-testid="sim-canvas-mod-5-1" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Parity Tile Combiner · Odd/Even Unit Pairing
          </div>
          <div className="text-2xl font-black mt-1 tabular-nums">
            {simA} ({simA % 2 === 0 ? 'Even' : 'Odd'}) + {simB} ({simB % 2 === 0 ? 'Even' : 'Odd'}) ={' '}
            <span className="text-amber-300">{sum} ({isEvenSum ? 'EVEN' : 'ODD'})</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 p-4 rounded-2xl bg-stone-50 border border-stone-200">
          {Array.from({ length: Math.floor(sum / 2) }, (_, i) => (
            <div key={i} className="px-2.5 py-1.5 rounded-lg bg-[#0F766E] text-white text-xs font-black">
              [2 Pair]
            </div>
          ))}
          {!isEvenSum && (
            <div className="px-2.5 py-1.5 rounded-lg bg-amber-400 text-stone-950 text-xs font-black">
              +1 Protruding Unit
            </div>
          )}
        </div>
      </div>
    );
  }

  // mod-5-2: Tail-Digit X-Ray
  if (moduleId === 'mod-5-2') {
    const str = String(simA);
    const tailLen = Math.max(1, Math.min(3, simB));
    const head = str.slice(0, str.length - tailLen);
    const tail = Number(str.slice(-tailLen));
    const d2 = simA % 2 === 0;
    const d4 = simA % 4 === 0;
    const d8 = simA % 8 === 0;
    return (
      <div data-testid="sim-canvas-mod-5-2" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div className="text-3xl font-black font-mono">
            <span className="text-stone-400">{head}</span>
            <span className="text-amber-300 underline decoration-amber-400">{str.slice(-tailLen)}</span>
          </div>
          <div className="flex gap-2 text-xs font-black">
            <span className={`px-3 py-1.5 rounded-lg ${d2 ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white'}`}>
              ÷2: {d2 ? 'YES' : 'NO'}
            </span>
            <span className={`px-3 py-1.5 rounded-lg ${d4 ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white'}`}>
              ÷4: {d4 ? 'YES' : 'NO'}
            </span>
            <span className={`px-3 py-1.5 rounded-lg ${d8 ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white'}`}>
              ÷8: {d8 ? 'YES' : 'NO'}
            </span>
          </div>
        </div>
        <div className="text-xs font-bold text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200">
          Tail {tailLen} digit(s) = {tail}. Earlier place-value chunks ({head}{'0'.repeat(tailLen)}) automatically divide!
        </div>
      </div>
    );
  }

  // mod-5-3: Bundle-of-9 Remainder Visualizer
  if (moduleId === 'mod-5-3') {
    const digits = String(simA).split('').map(Number);
    const digitSum = digits.reduce((a, b) => a + b, 0);
    const div = simB >= 9 ? 9 : 3;
    const ok = digitSum % div === 0;
    return (
      <div data-testid="sim-canvas-mod-5-3" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Bundle-of-9 Remainder Peeler
          </div>
          <div className="text-2xl font-black mt-1 tabular-nums">
            Digits: {digits.join(' + ')} = <span className="text-amber-300">{digitSum}</span>{' '}
            ({ok ? `Divisible by ${div} ✓` : `Remainder ${digitSum % div} ÷ ${div}`})
          </div>
        </div>
      </div>
    );
  }

  // mod-5-4: Alternating + / - Balance Beam
  if (moduleId === 'mod-5-4') {
    const digits = String(simA).split('').map(Number);
    let altSum = 0;
    const expr = digits
      .map((d, idx) => {
        const sign = idx % 2 === 0 ? 1 : -1;
        altSum += sign * d;
        return `${sign > 0 ? '+' : '−'}${d}`;
      })
      .join(' ');
    const div11 = Math.abs(altSum) % 11 === 0;
    return (
      <div data-testid="sim-canvas-mod-5-4" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Alternating + / − Divisibility-by-11 Beam
          </div>
          <div className="text-2xl font-black mt-1 font-mono">
            {expr} = <span className="text-amber-300">{altSum}</span>{' '}
            {div11 ? '⇒ DIVISIBLE BY 11 ✓' : '⇒ Not ×11'}
          </div>
        </div>
      </div>
    );
  }

  // mod-5-5: 1089 Reverse-Subtract Machine
  if (moduleId === 'mod-5-5') {
    const s = String(simA).padStart(3, '0');
    const rev = Number(s.split('').reverse().join(''));
    const diff = Math.abs(simA - rev);
    const diffStr = String(diff).padStart(3, '0');
    const diffRev = Number(diffStr.split('').reverse().join(''));
    const magic = diff + diffRev;
    return (
      <div data-testid="sim-canvas-mod-5-5" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 space-y-2">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            1089 Reverse-Subtract Machine
          </div>
          <div className="text-lg font-black tabular-nums">
            Step 1: |{simA} − {rev}| = {diffStr}
            {simB >= 2 && ` ➔ Step 2 Reverse: ${diffRev}`}
            {simB >= 3 && (
              <span className="text-amber-300"> ➔ Step 3 Sum: {diff + diffRev}!</span>
            )}
          </div>
          {magic === 1089 && simB >= 3 && (
            <div className="text-xs text-emerald-300 font-bold">
              ✨ Always locks onto 1089 whenever first digit ≠ last digit!
            </div>
          )}
        </div>
      </div>
    );
  }

  // mod-5-6: Column Carry-Over Sandbox
  if (moduleId === 'mod-5-6') {
    const sum = simA * 10 + simB + (simA * 10 + simB);
    return (
      <div data-testid="sim-canvas-mod-5-6" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Cryptarithm Carry-Over Evaluator
        </div>
        <div className="text-2xl font-black mt-1 font-mono tabular-nums">
          KR ({simA}{simB}) + KR ({simA}{simB}) = <span className="text-amber-300">{sum}</span>{' '}
          (Ones Carry = {simB + simB >= 10 ? 1 : 0})
        </div>
      </div>
    );
  }

  // mod-5-7: Lo Shu Sum Heatmap
  if (moduleId === 'mod-5-7') {
    const center = simA;
    const grid = [
      8, 1, 6,
      3, center, 7,
      4, 9, 2,
    ];
    const rowSums = [
      grid[0] + grid[1] + grid[2],
      grid[3] + grid[4] + grid[5],
      grid[6] + grid[7] + grid[8],
    ];
    return (
      <div data-testid="sim-canvas-mod-5-7" className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] text-white flex items-center justify-between">
          <span className="text-sm font-black">
            Lo Shu 3×3 Heatmap · Row Sums: {rowSums.join(' / ')}
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-400 text-stone-950 text-xs font-black">
            {center === 5 ? 'ALL 8 LINES = 15 ✨' : 'Set Center to 5 to Balance!'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {grid.map((cell, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border-2 text-center text-lg font-black ${
                i === 4 && cell !== 5
                  ? 'bg-rose-100 border-rose-400 text-rose-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}
            >
              {cell}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // PART I · CHAPTER 6: WE DISTRIBUTE (mod-6-1 .. mod-6-7)
  // =========================================================================

  // mod-6-1: Area-Split Rectangle Slicer
  if (moduleId === 'mod-6-1') {
    const a = simA;
    const b = simB;
    const c = Math.max(2, 14 - b);
    return (
      <div data-testid="sim-canvas-mod-6-1" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Area-Split Rectangle Slicer
          </div>
          <div className="text-2xl font-black mt-1 tabular-nums">
            {a} × ({b} + {c}) = ({a}×{b}) + ({a}×{c}) = {a * b} + {a * c} ={' '}
            <span className="text-amber-300">{a * (b + c)}</span>
          </div>
        </div>
        <div className="flex h-24 rounded-2xl overflow-hidden border-2 border-stone-300">
          <div
            className="bg-[#0F766E] text-white flex items-center justify-center font-black text-sm transition-all"
            style={{ width: `${(b / (b + c)) * 100}%` }}
          >
            {a} × {b} = {a * b}
          </div>
          <div
            className="bg-amber-400 text-stone-950 flex items-center justify-center font-black text-sm transition-all border-l-4 border-white"
            style={{ width: `${(c / (b + c)) * 100}%` }}
          >
            {a} × {c} = {a * c}
          </div>
        </div>
      </div>
    );
  }

  // mod-6-2: Algebra Tile Array Builder
  if (moduleId === 'mod-6-2') {
    return (
      <div data-testid="sim-canvas-mod-6-2" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Algebra Tile Array Builder
          </div>
          <div className="text-2xl font-black mt-1">
            x({simA}x + {simB}) = <span className="text-amber-300">{simA}x² + {simB}x</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-stone-50 border border-stone-200">
          {Array.from({ length: simA }, (_, i) => (
            <div key={`x2-${i}`} className="w-14 h-14 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-black">
              x²
            </div>
          ))}
          {Array.from({ length: simB }, (_, i) => (
            <div key={`x-${i}`} className="w-6 h-14 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-black text-xs">
              x
            </div>
          ))}
        </div>
      </div>
    );
  }

  // mod-6-3: 4-Quadrant FOIL Box
  if (moduleId === 'mod-6-3') {
    return (
      <div data-testid="sim-canvas-mod-6-3" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            4-Quadrant FOIL Box
          </div>
          <div className="text-2xl font-black mt-1">
            (x + {simA})(x + {simB}) = <span className="text-amber-300">x² + {simA + simB}x + {simA * simB}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 max-w-md">
          <div className="p-4 rounded-xl bg-[#0F766E] text-white font-black text-center">x²</div>
          <div className="p-4 rounded-xl bg-amber-100 text-amber-950 font-black text-center">{simA}x</div>
          <div className="p-4 rounded-xl bg-amber-100 text-amber-950 font-black text-center">{simB}x</div>
          <div className="p-4 rounded-xl bg-amber-400 text-stone-950 font-black text-center">{simA * simB}</div>
        </div>
      </div>
    );
  }

  // mod-6-4: (a+b)² Square Expander
  if (moduleId === 'mod-6-4') {
    const a = simA;
    const b = simB;
    return (
      <div data-testid="sim-canvas-mod-6-4" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Identity I · (a + b)² Corner Expander
          </div>
          <div className="text-2xl font-black mt-1 tabular-nums">
            ({a} + {b})² = {a * a} + 2({a * b}) + {b * b} ={' '}
            <span className="text-amber-300">{(a + b) ** 2}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 max-w-xs">
          <div className="p-5 rounded-tl-xl bg-[#0F766E] text-white font-black text-center">a² = {a * a}</div>
          <div className="p-5 rounded-tr-xl bg-amber-200 text-stone-950 font-black text-center">ab = {a * b}</div>
          <div className="p-5 rounded-bl-xl bg-amber-200 text-stone-950 font-black text-center">ab = {a * b}</div>
          <div className="p-3 rounded-br-xl bg-amber-400 text-stone-950 font-black text-center">b² = {b * b}</div>
        </div>
      </div>
    );
  }

  // mod-6-5: Overlapping Trim Visualizer
  if (moduleId === 'mod-6-5') {
    const a = simA;
    const b = Math.min(a - 1, simB);
    return (
      <div data-testid="sim-canvas-mod-6-5" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Identity II · Overlapping Trim Visualizer
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          ({a} − {b})² = {a * a} − 2({a * b}) + {b * b} ={' '}
          <span className="text-amber-300">{(a - b) ** 2}</span>
        </div>
        <p className="text-xs text-teal-200 mt-2">
          Subtracting two {a}×{b} edge strips double-subtracts the {b}×{b} = {b * b} corner, so +{b * b} is added back!
        </p>
      </div>
    );
  }

  // mod-6-6: Cut-and-Rotate Morph
  if (moduleId === 'mod-6-6') {
    const a = simA;
    const b = Math.min(a - 1, simB);
    return (
      <div data-testid="sim-canvas-mod-6-6" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Identity III · Cut &amp; Rotate Strip Morph
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          {a}² − {b}² = ({a} + {b})({a} − {b}) = {a + b} × {a - b} ={' '}
          <span className="text-amber-300">{a * a - b * b}</span>
        </div>
      </div>
    );
  }

  // mod-6-7: Expression Circuit Tester
  if (moduleId === 'mod-6-7') {
    const x = simA;
    const lhs = (x + 3) ** 2;
    const trueRhs = x * x + 6 * x + 9;
    const buggyRhs = x * x + 9;
    const circuitClosed = simB % 2 === 1;
    const rhsVal = circuitClosed ? trueRhs : buggyRhs;
    const match = lhs === rhsVal;
    return (
      <div data-testid="sim-canvas-mod-6-7" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Expression Identity Circuit Tester (x = {x})
          </div>
          <div className="text-xl font-black mt-1 tabular-nums">
            (x+3)² = {lhs} vs {circuitClosed ? 'x² + 6x + 9' : 'x² + 9 (Buggy)'} = {rhsVal}
          </div>
        </div>
        <span className={`px-4 py-2 rounded-xl font-black text-xs ${match ? 'bg-emerald-400 text-stone-950' : 'bg-rose-700 text-white'}`}>
          {match ? '💡 BULB GREEN — MATCH!' : '⚡ SHORT CIRCUIT — MISSING 6x!'}
        </span>
      </div>
    );
  }

  // =========================================================================
  // PART I · CHAPTER 7: PROPORTIONAL REASONING-1 (mod-7-1 .. mod-7-7)
  // =========================================================================

  // mod-7-1: Aspect-Ratio Image Stretcher
  if (moduleId === 'mod-7-1') {
    const similar = Math.abs(simA - simB) <= 5;
    return (
      <div data-testid="sim-canvas-mod-7-1" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Aspect-Ratio Image Stretcher
            </div>
            <div className="text-xl font-black mt-1 tabular-nums">
              Width {simA}% × Height {simB}% →{' '}
              <span className={similar ? 'text-amber-300' : 'text-rose-300'}>
                {similar ? 'TRUE SIMILARITY!' : 'DISTORTED STRETCH!'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center p-4 bg-stone-50 rounded-2xl border border-stone-200">
          <div
            className="rounded-2xl bg-[#0F766E] border-4 border-amber-400 text-white flex items-center justify-center font-black transition-all"
            style={{ width: `${Math.round(simA * 0.9)}px`, height: `${Math.round(simB * 0.6)}px` }}
          >
            🦉 Photo
          </div>
        </div>
      </div>
    );
  }

  // mod-7-2: GCD Bucket Reducer
  if (moduleId === 'mod-7-2') {
    const g = gcd(simA, simB);
    return (
      <div data-testid="sim-canvas-mod-7-2" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          GCD Liquid Bucket Reducer (GCD = {g})
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          {simA} : {simB} reduces ÷{g} to{' '}
          <span className="text-amber-300">{simA / g} : {simB / g}</span>
        </div>
      </div>
    );
  }

  // mod-7-3: Pantograph Map Enlarger
  if (moduleId === 'mod-7-3') {
    return (
      <div data-testid="sim-canvas-mod-7-3" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Pantograph {simA}× Map Enlarger
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          Original Radius {simB} cm × {simA} = <span className="text-amber-300">{simA * simB} cm</span> Scaled Span
        </div>
      </div>
    );
  }

  // mod-7-4: Single-Unit Price Strip
  if (moduleId === 'mod-7-4') {
    const unitPrice = 12;
    const packPrice = simA * unitPrice;
    return (
      <div data-testid="sim-canvas-mod-7-4" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Unitary Method Price Strip
        </div>
        <div className="text-xl font-black mt-1 tabular-nums">
          {simA} Items = ₹{packPrice} ➔ 1 Item = ₹{unitPrice} ➔ {simB} Items ={' '}
          <span className="text-amber-300">₹{simB * unitPrice}</span>
        </div>
      </div>
    );
  }

  // mod-7-5: Constant-Speed Motion Track
  if (moduleId === 'mod-7-5') {
    const dist = simA * simB;
    return (
      <div data-testid="sim-canvas-mod-7-5" className="space-y-3">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Constant-Speed Motion Tape
          </div>
          <div className="text-2xl font-black mt-1 tabular-nums">
            {simA} m/s × {simB} s = <span className="text-amber-300">{dist} meters</span>
          </div>
        </div>
        <div className="h-8 bg-stone-100 rounded-full border border-stone-300 relative overflow-hidden">
          <div
            className="h-full bg-[#0F766E] transition-all flex items-center justify-end pr-2 text-xs text-white font-black"
            style={{ width: `${Math.min(100, (dist / 480) * 100)}%` }}
          >
            🏎️
          </div>
        </div>
      </div>
    );
  }

  // mod-7-6: Bar-Model Partitioner
  if (moduleId === 'mod-7-6') {
    const totalParts = 2 + simB + 5;
    const unit = simA / totalParts;
    return (
      <div data-testid="sim-canvas-mod-7-6" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Ratio Loot Bar Partitioner (2 : {simB} : 5)
        </div>
        <div className="text-lg font-black mt-1 tabular-nums">
          {simA} Coins ÷ {totalParts} shares = {unit.toFixed(1)}/share →{' '}
          <span className="text-amber-300">
            {(2 * unit).toFixed(1)} : {(simB * unit).toFixed(1)} : {(5 * unit).toFixed(1)}
          </span>
        </div>
      </div>
    );
  }

  // mod-7-7: Two-Tank Concentration Mixer
  const pctA = ((simA / (simA + 10)) * 100).toFixed(1);
  const pctB = ((simB / (simB + 12)) * 100).toFixed(1);
  return (
    <div data-testid="sim-canvas-mod-7-7" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="p-4 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase font-bold text-teal-300">Tank A Mixture</div>
        <div className="text-2xl font-black text-amber-300 mt-1">{pctA}% Syrup</div>
        <div className="text-xs text-teal-200">{simA} Syrup : 10 Water</div>
      </div>
      <div className="p-4 rounded-2xl bg-[#12352B] text-white border border-amber-400/40">
        <div className="text-xs uppercase font-bold text-amber-300">Tank B Mixture</div>
        <div className="text-2xl font-black text-white mt-1">{pctB}% Syrup</div>
        <div className="text-xs text-teal-200">
          {Number(pctA) > Number(pctB) ? 'Tank A is sweeter!' : Number(pctB) > Number(pctA) ? 'Tank B is sweeter!' : 'Identical concentration!'}
        </div>
      </div>
    </div>
  );
};
