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

export const Part2PercentPythPropSimulators: React.FC<SimRenderProps> = ({
  moduleId,
  simA,
  simB,
}) => {
  const [paintedOffset, setPaintedOffset] = useState<number>(0);

  // =========================================================================
  // PART II · CHAPTER 1: FRACTIONS IN DISGUISE (p2-mod-1-1 .. p2-mod-1-7)
  // =========================================================================

  // p2-mod-1-1: 100-Square Grid Converter
  if (moduleId === 'p2-mod-1-1') {
    const cells = Math.max(0, Math.min(100, (simA + paintedOffset + 101) % 101));
    const g = cells > 0 ? gcd(cells, 100) : 1;
    const simpNum = cells / g;
    const simpDen = 100 / g;
    return (
      <div data-testid="sim-canvas-p2-mod-1-1" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              100-Square Interactive Painter Grid (Click any cell!)
            </div>
            <div className="text-xl sm:text-2xl font-black mt-1 tabular-nums">
              {cells}/100 ({simpNum}/{simpDen}) ={' '}
              {(cells / 100).toFixed(2)} = <span className="text-amber-300">{cells}%</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPaintedOffset(0)}
            className="px-3 py-1.5 rounded-xl bg-amber-400 text-stone-950 font-black text-xs cursor-pointer"
          >
            Reset to Slider ({simA}%)
          </button>
        </div>
        <div className="grid grid-cols-10 gap-1 max-w-xs mx-auto p-3 rounded-2xl bg-stone-50 border border-stone-200">
          {Array.from({ length: 100 }, (_, i) => {
            const active = i < cells;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Paint ${i + 1} percent`}
                onClick={() => setPaintedOffset(i + 1 - simA)}
                className={`h-5 rounded-xs transition cursor-pointer ${
                  active ? 'bg-[#0F766E] border border-teal-400' : 'bg-white border border-stone-300 hover:bg-teal-50'
                }`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // p2-mod-1-2: Elastic Bar Stretcher
  if (moduleId === 'p2-mod-1-2') {
    const after1 = 100 * (1 + simA / 100);
    const after2 = after1 * (1 + simB / 100);
    return (
      <div data-testid="sim-canvas-p2-mod-1-2" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Elastic Sequential Percentage Bar
          </div>
          <div className="text-xl font-black mt-1 tabular-nums">
            100% → ({simA >= 0 ? `+${simA}` : simA}%) = {after1.toFixed(1)}% → ({simB >= 0 ? `+${simB}` : simB}%) ={' '}
            <span className="text-amber-300">{after2.toFixed(1)}%</span>
          </div>
        </div>
        <div className="space-y-2 p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="text-xs font-bold text-stone-700">Original Reference Bar: 100%</div>
          <div className="h-4 rounded-full bg-stone-300 w-1/2" />
          <div className="text-xs font-bold text-[#0F766E]">After Step 1 &amp; 2: {after2.toFixed(1)}%</div>
          <div
            className="h-5 rounded-full bg-gradient-to-r from-[#0F766E] to-amber-400 transition-all"
            style={{ width: `${Math.max(5, Math.min(100, after2 / 2))}%` }}
          />
        </div>
      </div>
    );
  }

  // p2-mod-1-3: Price-Tag Layer Peeler
  if (moduleId === 'p2-mod-1-3') {
    const cp = 100;
    const mp = cp * (1 + simA / 100);
    const sp = mp * (1 - simB / 100);
    const netPct = sp - cp;
    return (
      <div data-testid="sim-canvas-p2-mod-1-3" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Price-Tag Layer Peeler (Base CP = ₹100)
          </div>
          <div className="text-xl font-black mt-1 tabular-nums">
            CP ₹100 → Marked ₹{mp.toFixed(0)} → After {simB}% off: <span className="text-amber-300">SP ₹{sp.toFixed(1)}</span> ({netPct >= 0 ? `+${netPct.toFixed(1)}% Profit` : `${netPct.toFixed(1)}% Loss`})
          </div>
        </div>
      </div>
    );
  }

  // p2-mod-1-4: Revenue vs. Cost Balance Scale
  if (moduleId === 'p2-mod-1-4') {
    const diff = simB - simA;
    const pct = ((diff / Math.max(1, simA)) * 100).toFixed(1);
    return (
      <div data-testid="sim-canvas-p2-mod-1-4" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Wholesale Cost vs. Retail Price Meter
          </div>
          <div className="text-2xl font-black mt-1 tabular-nums">
            CP ₹{simA} vs SP ₹{simB} →{' '}
            <span className={diff >= 0 ? 'text-amber-300' : 'text-rose-300'}>
              {diff >= 0 ? `PROFIT +₹${diff} (+${pct}%)` : `LOSS ₹${Math.abs(diff)} (${pct}%)`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // p2-mod-1-5: Tax-Slab Stacker
  if (moduleId === 'p2-mod-1-5') {
    const validSlab = [5, 12, 18, 28].reduce((best, cur) =>
      Math.abs(cur - simB) < Math.abs(best - simB) ? cur : best
    );
    const gst = (simA * validSlab) / 100;
    return (
      <div data-testid="sim-canvas-p2-mod-1-5" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          GST Tax-Slab Stacker ({validSlab}% Slab · CGST {validSlab / 2}% + SGST {validSlab / 2}%)
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          ₹{simA.toLocaleString()} + ₹{gst.toFixed(0)} Tax ={' '}
          <span className="text-amber-300">Final Bill ₹{(simA + gst).toLocaleString()}</span>
        </div>
      </div>
    );
  }

  // p2-mod-1-6: Step-by-Step Interest Brick Builder
  if (moduleId === 'p2-mod-1-6') {
    const r = simA / 100;
    const years = Math.max(1, Math.min(6, simB));
    let p = 1000;
    const rows = Array.from({ length: years }, (_, idx) => {
      const intr = p * r;
      const nextP = p + intr;
      const out = { year: idx + 1, start: p, interest: intr, end: nextP };
      p = nextP;
      return out;
    });

    return (
      <div data-testid="sim-canvas-p2-mod-1-6" className="space-y-3">
        <div className="p-4 rounded-2xl bg-[#0F3828] text-white font-black text-lg">
          Year-by-Year Compound Brick Stack (Start ₹1,000 @ {simA}%) → Final:{' '}
          <span className="text-amber-300">₹{p.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {rows.map((row) => (
            <div key={row.year} className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs">
              <div className="font-black text-amber-950">Year {row.year}</div>
              <div className="text-stone-700">Principal: ₹{row.start.toFixed(0)}</div>
              <div className="text-[#0F766E] font-bold">+Interest: ₹{row.interest.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // p2-mod-1-7: Simple vs. Compound Curve Racer
  if (moduleId === 'p2-mod-1-7') {
    const r = simA / 100;
    const t = simB;
    const si = Math.round(1000 * (1 + r * t));
    const ci = Math.round(1000 * Math.pow(1 + r, t));
    return (
      <div data-testid="sim-canvas-p2-mod-1-7" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Simple vs. Compound 20-Year Curve Race (₹1,000 @ {simA}% for {t} yrs)
          </div>
          <div className="text-xl font-black mt-1 tabular-nums">
            Simple (Line): ₹{si.toLocaleString()} vs{' '}
            <span className="text-amber-300">Compound (Curve): ₹{ci.toLocaleString()}</span>{' '}
            (+₹{(ci - si).toLocaleString()} Extra!)
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PART II · CHAPTER 2: BAUDHAYANA-PYTHAGORAS (p2-mod-2-1 .. p2-mod-2-7)
  // =========================================================================

  // p2-mod-2-1: Tilting Water-Square Apparatus
  if (moduleId === 'p2-mod-2-1') {
    const drain = simA;
    const triples = [
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
    ];
    const [a, b, c] = triples[(simB - 1) % triples.length];
    return (
      <div data-testid="sim-canvas-p2-mod-2-1" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Tilting Water-Square Apparatus ({a}–{b}–{c} Triple · {drain}% Drained)
          </div>
          <div className="text-xl font-black mt-1 tabular-nums">
            Leg Tanks Remaining: {(((a * a + b * b) * (100 - drain)) / 100).toFixed(1)} L →
            Hypotenuse c² Filled:{' '}
            <span className="text-amber-300">{(((c * c) * drain) / 100).toFixed(1)} / {c * c} L</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-center">
            <div className="text-xs font-black text-sky-900">Tank a² ({a * a} L)</div>
            <div className="h-12 mt-2 bg-white rounded-lg border border-sky-200 flex items-end overflow-hidden">
              <div className="w-full bg-sky-400 transition-all" style={{ height: `${100 - drain}%` }} />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-center">
            <div className="text-xs font-black text-sky-900">Tank b² ({b * b} L)</div>
            <div className="h-12 mt-2 bg-white rounded-lg border border-sky-200 flex items-end overflow-hidden">
              <div className="w-full bg-sky-400 transition-all" style={{ height: `${100 - drain}%` }} />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-center">
            <div className="text-xs font-black text-amber-950">Hypotenuse c² ({c * c} L)</div>
            <div className="h-12 mt-2 bg-white rounded-lg border border-amber-300 flex items-end overflow-hidden">
              <div className="w-full bg-[#0F766E] transition-all" style={{ height: `${drain}%` }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // p2-mod-2-2: Peg-and-Rope Sulbasutra Grid
  if (moduleId === 'p2-mod-2-2') {
    const diag = Math.sqrt(simA * simA + simB * simB).toFixed(2);
    return (
      <div data-testid="sim-canvas-p2-mod-2-2" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Peg-and-Rope Śulbasūtra Knot Stretcher
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          East Rope = {simA} · North Rope = {simB} → 90° Diagonal Cord ={' '}
          <span className="text-amber-300">{diag} knots</span>
        </div>
      </div>
    );
  }

  // p2-mod-2-3: Right-Triangle Leg Stretcher
  if (moduleId === 'p2-mod-2-3') {
    const hyp = Math.sqrt(simA * simA + simB * simB).toFixed(2);
    return (
      <div data-testid="sim-canvas-p2-mod-2-3" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Right-Triangle Live Hypotenuse Tape Measure
          </div>
          <div className="text-2xl font-black mt-1 tabular-nums">
            {simA}² + {simB}² = {simA * simA + simB * simB} ⇒ c ={' '}
            <span className="text-amber-300">{hyp}</span>
          </div>
        </div>
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex justify-center">
          <svg viewBox="0 0 260 180" className="w-full max-w-sm h-44">
            <polygon
              points={`40,150 ${40 + simA * 11},150 40,${150 - simB * 8}`}
              fill="rgba(15, 118, 110, 0.2)"
              stroke="#0F766E"
              strokeWidth="3"
            />
            <rect x="40" y="138" width="12" height="12" fill="none" stroke="#D97706" strokeWidth="2" />
          </svg>
        </div>
      </div>
    );
  }

  // p2-mod-2-4: Wall-Ladder Sliding Sim
  if (moduleId === 'p2-mod-2-4') {
    const L = Math.max(simB, simA + 1);
    const x = Math.min(L - 1, simA);
    const h = Math.sqrt(Math.max(0, L * L - x * x)).toFixed(2);
    return (
      <div data-testid="sim-canvas-p2-mod-2-4" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Sliding Wall-Ladder Simulator (Ladder Length = {L} m)
          </div>
          <div className="text-2xl font-black mt-1 tabular-nums">
            Floor Out = {x} m ⇒ Top Height = √({L}² − {x}²) ={' '}
            <span className="text-amber-300">{h} m</span>
          </div>
        </div>
      </div>
    );
  }

  // p2-mod-2-5: Euclid's (m, n) Triple Generator
  if (moduleId === 'p2-mod-2-5') {
    const m = Math.max(simA, simB + 1);
    const n = Math.min(simB, m - 1);
    const a = m * m - n * n;
    const b = 2 * m * n;
    const c = m * m + n * n;
    return (
      <div data-testid="sim-canvas-p2-mod-2-5" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Euclid’s Triple Forge (m = {m}, n = {n})
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          Triple: <span className="text-amber-300">({a}, {b}, {c})</span> · Check: {a}² + {b}² = {a * a + b * b} = {c}²!
        </div>
      </div>
    );
  }

  // p2-mod-2-6: Acute / Right / Obtuse Hinge Tester
  if (moduleId === 'p2-mod-2-6') {
    const a = 3;
    const b = 4;
    const c = simA;
    const sumSq = a * a + b * b;
    const cSq = c * c;
    const verdict =
      sumSq === cSq ? 'RIGHT 90° (a²+b² = c²)' : sumSq > cSq ? 'ACUTE (< 90°)' : 'OBTUSE (> 90°)';
    return (
      <div data-testid="sim-canvas-p2-mod-2-6" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Triangle Hinge Checker (Legs 3 &amp; 4, Side c = {c})
          </div>
          <div className="text-xl font-black mt-1 tabular-nums">
            3² + 4² = 25 vs {c}² = {cSq}
          </div>
        </div>
        <span className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-black text-xs">
          {verdict}
        </span>
      </div>
    );
  }

  // p2-mod-2-7: 3D Room Diagonal Laser
  if (moduleId === 'p2-mod-2-7') {
    const l = simA;
    const w = simB;
    const h = 5;
    const floorD = Math.sqrt(l * l + w * w).toFixed(2);
    const spaceD = Math.sqrt(l * l + w * w + h * h).toFixed(2);
    return (
      <div data-testid="sim-canvas-p2-mod-2-7" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          3D Room Laser Diagonal ({l} × {w} × {h} m)
        </div>
        <div className="text-xl font-black mt-1 tabular-nums">
          Floor Diagonal: {floorD} m → Full 3D Corner-to-Corner Laser:{' '}
          <span className="text-amber-300">{spaceD} m</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PART II · CHAPTER 3: PROPORTIONAL REASONING-2 (p2-mod-3-1 .. p2-mod-3-7)
  // =========================================================================

  // p2-mod-3-1: Zoomable Map Scale Bar
  if (moduleId === 'p2-mod-3-1') {
    const realKm = simA * simB;
    return (
      <div data-testid="sim-canvas-p2-mod-3-1" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Caliper Map Scale Bar (1 cm : {simB} km)
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          Caliper Span: {simA} cm → Real Distance:{' '}
          <span className="text-amber-300">{realKm} km</span>
        </div>
      </div>
    );
  }

  // p2-mod-3-2: Multi-Part Ratio Bar Splitter
  if (moduleId === 'p2-mod-3-2') {
    const z = 2;
    const sum = simA + simB + z;
    return (
      <div data-testid="sim-canvas-p2-mod-3-2" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          100 kg Multi-Alloy Splitter ({simA} : {simB} : {z})
        </div>
        <div className="text-xl font-black mt-1 tabular-nums text-amber-300">
          Copper {((simA / sum) * 100).toFixed(1)} kg · Tin {((simB / sum) * 100).toFixed(1)} kg · Zinc{' '}
          {((z / sum) * 100).toFixed(1)} kg
        </div>
      </div>
    );
  }

  // p2-mod-3-3: 360° Protractor Wedge Slicer
  if (moduleId === 'p2-mod-3-3') {
    const degA = ((simA / 100) * 360).toFixed(1);
    const degB = ((simB / 100) * 360).toFixed(1);
    return (
      <div data-testid="sim-canvas-p2-mod-3-3" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          360° Protractor Sector Slicer
        </div>
        <div className="text-xl font-black mt-1 tabular-nums">
          Wedge A ({simA}% = <span className="text-amber-300">{degA}°</span>) · Wedge B ({simB}% ={' '}
          <span className="text-teal-300">{degB}°</span>) · Rest ({100 - simA - simB}%)
        </div>
      </div>
    );
  }

  // p2-mod-3-4: Interactive Budget Pie
  if (moduleId === 'p2-mod-3-4') {
    const hydro = 30;
    const total = simA + simB + hydro;
    return (
      <div data-testid="sim-canvas-p2-mod-3-4" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Interactive City Energy Wheel (360° Normalized)
        </div>
        <div className="text-lg font-black mt-1 tabular-nums text-amber-300">
          Solar {Math.round((simA / total) * 360)}° ({Math.round((simA / total) * 100)}%) · Wind{' '}
          {Math.round((simB / total) * 360)}° · Hydro {Math.round((hydro / total) * 360)}°
        </div>
      </div>
    );
  }

  // p2-mod-3-5: Dual-Graph Behavior Comparator
  if (moduleId === 'p2-mod-3-5') {
    const k = simA;
    const x = Math.max(1, simB);
    return (
      <div data-testid="sim-canvas-p2-mod-3-5" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs font-black uppercase text-teal-300">Direct: y = {k}·x</div>
          <div className="text-2xl font-black text-amber-300 mt-1">At x = {x} → y = {k * x}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#12352B] text-white border border-amber-400/30">
          <div className="text-xs font-black uppercase text-amber-300">Inverse: y = {k} / x</div>
          <div className="text-2xl font-black text-white mt-1">At x = {x} → y = {(k / x).toFixed(2)}</div>
        </div>
      </div>
    );
  }

  // p2-mod-3-6: Worker-Days Hyperbola Curve
  if (moduleId === 'p2-mod-3-6') {
    const days = (simB / Math.max(1, simA)).toFixed(1);
    return (
      <div data-testid="sim-canvas-p2-mod-3-6" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Worker-Days Inverse Hyperbola ({simB} Total Worker-Days)
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          {simA} Active Workers finish in <span className="text-amber-300">{days} Days</span>
        </div>
      </div>
    );
  }

  // p2-mod-3-7: Bicycle Chainring & Sprocket Sim
  const gearRatio = (simA / Math.max(1, simB)).toFixed(2);
  const wheelRpm = Math.round(60 * (simA / Math.max(1, simB)));
  return (
    <div data-testid="sim-canvas-p2-mod-3-7" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
      <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
        Bicycle Chainring ({simA}T) → Rear Sprocket ({simB}T) @ 60 Pedal RPM
      </div>
      <div className="text-2xl font-black mt-1 tabular-nums">
        Gear Ratio {gearRatio}× → Wheel Speed: <span className="text-amber-300">{wheelRpm} RPM</span>
      </div>
    </div>
  );
};
