import React, { useState } from 'react';

export interface SimRenderProps {
  moduleId: string;
  simA: number;
  simB: number;
}

function primeFactorize(n: number): number[] {
  const out: number[] = [];
  let rem = Math.max(2, Math.floor(n));
  let d = 2;
  while (d * d <= rem) {
    while (rem % d === 0) {
      out.push(d);
      rem /= d;
    }
    d++;
  }
  if (rem > 1) out.push(rem);
  return out;
}

function toRoman(num: number): string {
  const table: Array<[number, string]> = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let rem = Math.max(1, Math.min(3999, Math.floor(num)));
  let res = '';
  for (const [val, sym] of table) {
    while (rem >= val) {
      res += sym;
      rem -= val;
    }
  }
  return res;
}

function toEgyptianTokens(num: number): Array<{ glyph: string; name: string; count: number }> {
  const specs = [
    { unit: 1000, glyph: '🪷', name: 'Lotus (1,000)' },
    { unit: 100, glyph: '🌀', name: 'Coil (100)' },
    { unit: 10, glyph: '∩', name: 'Heel Bone (10)' },
    { unit: 1, glyph: '|', name: 'Staff (1)' },
  ];
  let rem = Math.max(1, Math.floor(num));
  return specs
    .map((s) => {
      const count = Math.floor(rem / s.unit);
      rem %= s.unit;
      return { glyph: s.glyph, name: s.name, count };
    })
    .filter((x) => x.count > 0);
}

export const Part1NumberSimulators: React.FC<SimRenderProps> = ({
  moduleId,
  simA,
  simB,
}) => {
  const [slabTotal, setSlabTotal] = useState<number>(47);
  const [abacusCarries, setAbacusCarries] = useState<boolean>(true);

  // =========================================================================
  // PART I · CHAPTER 1: A SQUARE AND A CUBE (mod-1-1 .. mod-1-7)
  // =========================================================================

  // mod-1-1: Gnomon Grid Expander
  if (moduleId === 'mod-1-1') {
    const n = Math.max(1, Math.min(10, simA));
    const highlightLatest = simB >= 1;
    const oddList = Array.from({ length: n }, (_, i) => 2 * i + 1);
    const palette = [
      '#0F766E',
      '#115E59',
      '#1E40AF',
      '#6D28D9',
      '#B45309',
      '#1D4ED8',
      '#047857',
      '#BE123C',
      '#3730A3',
      '#9A3412',
    ];

    return (
      <div data-testid="sim-canvas-mod-1-1" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Gnomon Grid Expander · Live L-Border Snapping
            </div>
            <div className="text-xl sm:text-2xl font-black mt-1">
              {oddList.join(' + ')} = <span className="text-amber-300">{n * n}</span> ({n} × {n})
            </div>
            <div className="text-xs text-teal-200 mt-1">
              Outer L-Gnomon adds {2 * n - 1} unit tiles around the ({n - 1} × {n - 1}) core square.
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-black text-sm tabular-nums">
            +{2 * n - 1} Tiles
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col items-center">
          <div
            className="grid gap-1 p-3 rounded-2xl bg-white border border-stone-200 shadow-inner"
            style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: n * n }, (_, idx) => {
              const r = Math.floor(idx / n);
              const c = idx % n;
              const layer = Math.max(r, c);
              const isLatest = layer === n - 1;
              return (
                <div
                  key={idx}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-[10px] font-black text-white transition-all duration-200 ${
                    highlightLatest && isLatest ? 'ring-2 ring-amber-300 scale-105' : ''
                  }`}
                  style={{ backgroundColor: palette[layer % palette.length] }}
                  title={`Layer ${layer + 1} (${2 * layer + 1} tiles)`}
                >
                  {2 * layer + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // mod-1-2: Last-Digit Ending Explorer
  if (moduleId === 'mod-1-2') {
    const base = Math.max(0, Math.min(99, simA));
    const factorZeros = Math.max(0, Math.min(3, simB));
    const scaled = base * Math.pow(10, factorZeros);
    const squared = BigInt(scaled) * BigInt(scaled);
    const unitDigit = base % 10;
    const squareUnit = (unitDigit * unitDigit) % 10;
    const validEndings = new Set([0, 1, 4, 5, 6, 9]);

    return (
      <div data-testid="sim-canvas-mod-1-2" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Last-Digit Wheel · 0–99 Square Ending Inspector
            </div>
            <div className="text-xl sm:text-2xl font-black mt-1 tabular-nums">
              {scaled.toLocaleString()}² ={' '}
              <span className="text-amber-300">{squared.toLocaleString()}</span>
            </div>
            <div className="text-xs text-teal-200 mt-1">
              Unit digit {unitDigit}² ends in {squareUnit}. Appending {factorZeros} zeros doubles to{' '}
              {factorZeros * 2} trailing zeros!
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-teal-400 text-stone-950 font-black text-xs uppercase">
            Unit: {squareUnit} · Zeros: Even
          </div>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Array.from({ length: 10 }, (_, d) => {
            const isValid = validEndings.has(d);
            const isActive = d === squareUnit;
            return (
              <div
                key={d}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 border-amber-500 scale-105 shadow-md'
                    : isValid
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-800 opacity-85'
                }`}
              >
                <div className="text-xl font-black">{d}</div>
                <div className="text-[10px] font-bold uppercase mt-0.5">
                  {isValid ? 'Valid' : 'Never'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // mod-1-3: Prime Pair Loom
  if (moduleId === 'mod-1-3') {
    const num = Math.max(4, Math.min(400, simA));
    const factors = primeFactorize(num);
    const counts = new Map<number, number>();
    factors.forEach((f) => counts.set(f, (counts.get(f) || 0) + 1));

    const pairedRoots: number[] = [];
    const leftoverPrimes: number[] = [];
    Array.from(counts.entries()).forEach(([p, cnt]) => {
      const pairs = Math.floor(cnt / 2);
      for (let i = 0; i < pairs; i++) pairedRoots.push(p);
      if (cnt % 2 === 1) leftoverPrimes.push(p);
    });
    const isPerfect = leftoverPrimes.length === 0;
    const sideLength = pairedRoots.reduce((acc, p) => acc * p, 1);

    return (
      <div data-testid="sim-canvas-mod-1-3" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Prime Pair Loom · Thread Decomposition
            </div>
            <div className="text-xl sm:text-2xl font-black mt-1 tabular-nums">
              {num} = {factors.join(' × ')}{' '}
              {isPerfect ? (
                <span className="text-amber-300">⇒ √{num} = {sideLength}</span>
              ) : (
                <span className="text-rose-300">⇒ √{num} = {sideLength}√{leftoverPrimes.reduce((a, b) => a * b, 1)}</span>
              )}
            </div>
          </div>
          <span
            className={`px-3.5 py-2 rounded-xl text-xs font-black ${
              isPerfect ? 'bg-amber-400 text-stone-950' : 'bg-rose-700 text-white'
            }`}
          >
            {isPerfect ? `Perfect Square (${sideLength}²)` : `Unpaired: ${leftoverPrimes.join('×')}`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
            <div className="text-xs font-black uppercase text-emerald-900">
              Paired Prime Threads (Extract Side Length)
            </div>
            <div className="flex flex-wrap gap-2">
              {pairedRoots.length === 0 ? (
                <span className="text-xs text-stone-600 font-semibold">No prime pairs yet</span>
              ) : (
                pairedRoots.map((p, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-white border-2 border-emerald-400 font-black text-xs text-emerald-900 shadow-2xs"
                  >
                    ({p} × {p}) ➔ {p}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 space-y-2">
            <div className="text-xs font-black uppercase text-rose-900">
              Lonely Unpaired Threads
            </div>
            <div className="flex flex-wrap gap-2">
              {leftoverPrimes.length === 0 ? (
                <span className="text-xs font-bold text-emerald-700">
                  Zero leftovers — Clean exact square root!
                </span>
              ) : (
                leftoverPrimes.map((p, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-white border-2 border-rose-400 font-black text-xs text-rose-900"
                  >
                    Lonely {p} (Needs ×{p})
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // mod-1-4: 3D Voxel Cube Builder
  if (moduleId === 'mod-1-4') {
    const n = Math.max(1, Math.min(6, simA));
    const visibleLayers = Math.max(1, Math.min(n, simB));
    const totalVoxels = n * n * n;
    const shownVoxels = n * n * visibleLayers;
    const dx = 18;
    const dy = 10;
    const dz = 18;
    const cx = 190;
    const cy = 195;

    const voxels: Array<{ x: number; y: number; z: number; depth: number }> = [];
    for (let z = 0; z < visibleLayers; z++) {
      for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
          voxels.push({ x, y, z, depth: x + y + z * 1.1 });
        }
      }
    }
    voxels.sort((a, b) => a.depth - b.depth);

    return (
      <div data-testid="sim-canvas-mod-1-4" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              3D Voxel Cube Builder · Isometric Layer Stacker
            </div>
            <div className="text-xl sm:text-2xl font-black mt-1 tabular-nums">
              Full {n}³ = <span className="text-amber-300">{totalVoxels}</span> voxels ·{' '}
              Showing {visibleLayers}/{n} layers = {shownVoxels}
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-400 text-stone-950 text-xs font-black tabular-nums">
            Each Layer: {n}×{n} = {n * n}
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex justify-center">
          <svg viewBox="0 0 380 260" className="w-full max-w-md h-60">
            {voxels.map((v, i) => {
              const px = cx + (v.x - v.y) * dx;
              const py = cy - v.z * dz + (v.x + v.y) * dy - n * dy;
              const top = `${px},${py - dz} ${px + dx},${py - dz + dy} ${px},${py - dz + 2 * dy} ${px - dx},${py - dz + dy}`;
              const left = `${px - dx},${py - dz + dy} ${px},${py - dz + 2 * dy} ${px},${py + 2 * dy} ${px - dx},${py + dy}`;
              const right = `${px + dx},${py - dz + dy} ${px},${py - dz + 2 * dy} ${px},${py + 2 * dy} ${px + dx},${py + dy}`;
              return (
                <g key={i} opacity={v.z === visibleLayers - 1 ? 0.96 : 0.78}>
                  <polygon points={top} fill="#5EEAD4" stroke="#0F3828" strokeWidth="1" />
                  <polygon points={left} fill="#0D9488" stroke="#0F3828" strokeWidth="1" />
                  <polygon points={right} fill="#115E59" stroke="#0F3828" strokeWidth="1" />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  }

  // mod-1-5: Taxicab Number Split Viewer
  if (moduleId === 'mod-1-5') {
    const a = simA;
    const b = simB;
    const sum = a * a * a + b * b * b;
    const altPairs: Array<[number, number]> = [];
    for (let x = 1; x <= 20; x++) {
      for (let y = x; y <= 20; y++) {
        if (x * x * x + y * y * y === sum) altPairs.push([x, y]);
      }
    }
    const isTaxicab = altPairs.length >= 2;

    return (
      <div data-testid="sim-canvas-mod-1-5" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Taxicab Split Viewer · Two-Way Cube Sums
            </div>
            <div className="text-xl sm:text-2xl font-black mt-1 tabular-nums">
              {a}³ + {b}³ = {a ** 3} + {b ** 3} ={' '}
              <span className="text-amber-300">{sum.toLocaleString()}</span>
            </div>
          </div>
          <span
            className={`px-3.5 py-2 rounded-xl text-xs font-black ${
              isTaxicab ? 'bg-amber-400 text-stone-950' : 'bg-white/15 text-teal-200'
            }`}
          >
            {isTaxicab ? `✨ TAXICAB MATCH! (${altPairs.length} ways)` : 'Single Split Found — Try 12 & 1'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {altPairs.map(([x, y], idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-between"
            >
              <div>
                <div className="text-[11px] font-black uppercase text-amber-800">
                  Cubic Pair #{idx + 1}
                </div>
                <div className="text-lg font-black text-amber-950">
                  {x}³ + {y}³ = {sum.toLocaleString()}
                </div>
              </div>
              <div className="text-xs font-bold text-amber-800 tabular-nums">
                {x ** 3} + {y ** 3}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // mod-1-6: Triplet Centrifuge
  if (moduleId === 'mod-1-6') {
    const n = Math.max(8, simA);
    const factors = primeFactorize(n);
    const groups = new Map<number, number>();
    factors.forEach((f) => groups.set(f, (groups.get(f) || 0) + 1));

    const buckets: Array<{ p: number; count: number; locked: boolean }> = [];
    Array.from(groups.entries()).forEach(([p, total]) => {
      let rem = total;
      while (rem > 0) {
        const take = Math.min(3, rem);
        buckets.push({ p, count: take, locked: take === 3 });
        rem -= take;
      }
    });
    const isExactCube = buckets.every((b) => b.locked);
    const cubeRoot = buckets.reduce((acc, b) => (b.locked ? acc * b.p : acc), 1);

    return (
      <div data-testid="sim-canvas-mod-1-6" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Triplet Centrifuge · 3-Lock Factor Buckets
            </div>
            <div className="text-xl sm:text-2xl font-black mt-1 tabular-nums">
              {n} = {factors.join(' × ')} ·{' '}
              {isExactCube ? (
                <span className="text-amber-300">∛{n} = {cubeRoot}</span>
              ) : (
                <span className="text-rose-300">Not all buckets locked at 3!</span>
              )}
            </div>
          </div>
          <span
            className={`px-3.5 py-2 rounded-xl text-xs font-black ${
              isExactCube ? 'bg-amber-400 text-stone-950' : 'bg-white/15 text-teal-200'
            }`}
          >
            {isExactCube ? `Locked: ${cubeRoot}³ = ${n}` : 'Spin Incomplete Bucket'}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {buckets.map((b, idx) => (
            <div
              key={idx}
              className={`px-4 py-3 rounded-2xl border-2 text-center min-w-[110px] transition-all ${
                b.locked
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              <div className="text-xs font-black uppercase">
                {b.locked ? '3/3 Locked ✨' : `${b.count}/3 Needs ${3 - b.count}`}
              </div>
              <div className="text-lg font-black mt-1">
                {Array.from({ length: b.count }, () => b.p).join(' · ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // mod-1-7: Number Line Bracket Magnifier
  if (moduleId === 'mod-1-7') {
    const n = simA;
    const low = Math.floor(Math.sqrt(n));
    const high = low * low === n ? low : low + 1;
    const approx = Math.sqrt(n);
    const pct = low === high ? 50 : ((approx - low) / (high - low)) * 100;

    return (
      <div data-testid="sim-canvas-mod-1-7" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Number Line Bracket Magnifier
            </div>
            <div className="text-xl sm:text-2xl font-black mt-1 tabular-nums">
              {low}² ({low * low}) ≤ {n} ≤ {high}² ({high * high}) ⇒ √{n} ≈{' '}
              <span className="text-amber-300">{approx.toFixed(simB)}</span>
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-400 text-stone-950 font-black text-xs">
            Zoom: 10⁻{simB} Precision
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
          <div className="flex justify-between text-xs font-black text-stone-700">
            <span>
              Lower Bound: √{low * low} = {low}
            </span>
            <span className="text-[#0F766E]">Target √{n}</span>
            <span>
              Upper Bound: √{high * high} = {high}
            </span>
          </div>
          <div className="relative h-4 rounded-full bg-stone-200 border border-stone-300">
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0F766E] border-2 border-amber-400 shadow"
              style={{ left: `${Math.max(4, Math.min(96, pct))}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PART I · CHAPTER 2: POWER PLAY (mod-2-1 .. mod-2-7)
  // =========================================================================

  // mod-2-1: Paper-Fold Altitude Graph
  if (moduleId === 'mod-2-1') {
    const folds = Math.max(0, Math.min(42, simA));
    const mm = 0.1 * Math.pow(2, folds);
    const formatted =
      mm < 1000
        ? `${mm.toFixed(1)} mm`
        : mm < 1e6
        ? `${(mm / 1000).toFixed(2)} meters`
        : `${(mm / 1e6).toLocaleString(undefined, { maximumFractionDigits: 1 })} km`;
    const moonKm = mm / 1e6;
    const progressPct = Math.min(100, (folds / 42) * 100);

    return (
      <div data-testid="sim-canvas-mod-2-1" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Paper-Fold Altitude Graph · Exponential Growth
            </div>
            <div className="text-xl sm:text-2xl font-black mt-1 tabular-nums">
              {folds} Folds → Stack Thickness: <span className="text-amber-300">{formatted}</span>
            </div>
            <div className="text-xs text-teal-200 mt-1">
              {folds >= 42
                ? '🌕 Reached Beyond the Moon (384,400 km)!'
                : folds >= 27
                ? '🏔️ Taller than Mount Everest (8.8 km)!'
                : 'Paper doubles every single fold: 2ⁿ × 0.1 mm'}
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-400 text-stone-950 text-xs font-black tabular-nums">
            2^{folds} = {Math.pow(2, folds).toLocaleString()} Sheets
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex justify-between text-xs font-bold text-stone-700">
            <span>0.1 mm Desk</span>
            <span>Everest (27 folds)</span>
            <span>Orbit (30)</span>
            <span>Moon ({moonKm >= 384400 ? 'REACHED!' : '42 folds'})</span>
          </div>
          <div className="h-5 w-full rounded-full bg-stone-200 overflow-hidden border border-stone-300">
            <div
              className="h-full bg-gradient-to-r from-[#0F766E] via-teal-500 to-amber-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // mod-2-2: Base-Exponent Collider
  if (moduleId === 'mod-2-2') {
    const m = simA;
    const n = simB;
    const prod = m + n;
    const quot = m - n;
    return (
      <div data-testid="sim-canvas-mod-2-2" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Base-Exponent Collider · Visual Factor Merge & Cancel
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div className="p-3 rounded-xl bg-white/10 border border-teal-400/30">
              <div className="text-xs text-teal-200 font-bold">Product Law (Merge)</div>
              <div className="text-xl font-black text-amber-300 tabular-nums">
                2^{m} × 2^{n} = 2^{prod} ({Math.pow(2, prod).toLocaleString()})
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/10 border border-teal-400/30">
              <div className="text-xs text-teal-200 font-bold">Quotient Law (Cancel)</div>
              <div className="text-xl font-black text-emerald-300 tabular-nums">
                2^{m} ÷ 2^{n} = 2^{quot >= 0 ? quot : `(${quot})`}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center p-4 rounded-2xl bg-stone-50 border border-stone-200">
          {Array.from({ length: m }, (_, i) => (
            <span key={`m-${i}`} className="px-2.5 py-1 rounded-lg bg-[#0F766E] text-white text-xs font-black">
              2
            </span>
          ))}
          <span className="font-black text-amber-700 mx-1">×</span>
          {Array.from({ length: n }, (_, i) => (
            <span key={`n-${i}`} className="px-2.5 py-1 rounded-lg bg-amber-400 text-stone-950 text-xs font-black">
              2
            </span>
          ))}
          <span className="font-black text-stone-800 ml-2">= 2^{prod} Factors Total</span>
        </div>
      </div>
    );
  }

  // mod-2-3: Nested Lens Array
  if (moduleId === 'mod-2-3') {
    const m = simA;
    const n = simB;
    const totalExp = m * n;
    return (
      <div data-testid="sim-canvas-mod-2-3" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Nested Lens Array · Beam Magnification & Zero Reset
            </div>
            <div className="text-xl sm:text-2xl font-black mt-1 tabular-nums">
              (3^{m})^{n} = 3^{totalExp} ={' '}
              <span className="text-amber-300">{Math.pow(3, totalExp).toLocaleString()}</span>
            </div>
            <div className="text-xs text-teal-200 mt-1">
              {totalExp === 0
                ? 'Zero-Power Lens Reset! Any non-zero base to exponent 0 collapses cleanly to 1.'
                : `Ray passes through ${n} outer lenses, each multiplying exponent ${m}.`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // mod-2-4: Reciprocal Elevator
  if (moduleId === 'mod-2-4') {
    const exp = simA;
    const base = Math.max(2, simB);
    const val = Math.pow(base, exp);
    return (
      <div data-testid="sim-canvas-mod-2-4" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Reciprocal Elevator · Fraction Bar Sign Flip
            </div>
            <div className="text-2xl font-black mt-1 tabular-nums">
              {base}^{exp < 0 ? `(${exp})` : exp} ={' '}
              <span className="text-amber-300">
                {exp < 0 ? `1 / ${base}^${Math.abs(exp)} = 1/${Math.pow(base, Math.abs(exp))}` : val.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-black text-xs">
            {exp < 0 ? 'Elevator Below Bar (Denominator)' : exp === 0 ? 'Ground Level (= 1)' : 'Elevator Above Bar (Numerator)'}
          </div>
        </div>
      </div>
    );
  }

  // mod-2-5: Cosmic Powers-of-10 Slider
  if (moduleId === 'mod-2-5') {
    const exp = Math.max(0, Math.min(24, simA));
    const landmarks: Array<{ exp: number; label: string }> = [
      { exp: 0, label: '10⁰ m · Human (~1.7 m)' },
      { exp: 4, label: '10⁴ m · Everest Height' },
      { exp: 7, label: '10⁷ m · Earth Diameter' },
      { exp: 11, label: '10¹¹ m · Earth-to-Sun Orbit' },
      { exp: 16, label: '10¹⁶ m · 1 Light Year' },
      { exp: 21, label: '10²¹ m · Milky Way Galaxy' },
      { exp: 24, label: '10²⁴ m · Observable Galaxy Clusters' },
    ];
    const nearest = landmarks.reduce((best, cur) =>
      Math.abs(cur.exp - exp) < Math.abs(best.exp - exp) ? cur : best
    );

    return (
      <div data-testid="sim-canvas-mod-2-5" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Cosmic Powers-of-10 Radar · 10⁰ m → 10²⁴ m
          </div>
          <div className="text-2xl font-black mt-1 tabular-nums">
            10^{exp} meters <span className="text-amber-300">({nearest.label})</span>
          </div>
          <div className="w-full h-3 rounded-full bg-black/40 mt-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-amber-400 transition-all"
              style={{ width: `${(exp / 24) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // mod-2-6: Electron Microscope Zoom
  if (moduleId === 'mod-2-6') {
    const depth = Math.max(2, Math.min(10, simA));
    const scaleNames: Record<number, string> = {
      2: '1 cm · Water Drop / Fingernail',
      3: '1 mm · Grain of Sand',
      4: '100 μm · Human Hair Width',
      5: '10 μm · Red Blood Cell',
      6: '1 μm · Bacteria',
      7: '100 nm · Virus Capsule',
      8: '10 nm · Cell Membrane / Transistor',
      9: '1 nm · DNA Helix Strand',
      10: '0.1 nm (1 Å) · Hydrogen Atom',
    };
    return (
      <div data-testid="sim-canvas-mod-2-6" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Electron Microscope Zoom · 10⁻² m → 10⁻¹⁰ m
            </div>
            <div className="text-2xl font-black mt-1 tabular-nums">
              10⁻^{depth} m = <span className="text-amber-300">{scaleNames[depth] || 'Subatomic'}</span>
            </div>
            <div className="text-xs text-teal-200 mt-1">
              Equal to 1 / 10^{depth} meter = {Math.pow(10, -depth).toFixed(Math.min(10, depth))} m
            </div>
          </div>
        </div>
      </div>
    );
  }

  // mod-2-7: Scientific Notation Balance
  if (moduleId === 'mod-2-7') {
    const coeff = (simA / 10).toFixed(1);
    const exp = simB;
    const numeric = Number(coeff) * Math.pow(10, exp);
    return (
      <div data-testid="sim-canvas-mod-2-7" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Scientific Notation Decimal Shifter
            </div>
            <div className="text-2xl font-black mt-1 tabular-nums">
              {coeff} × 10^{exp} ={' '}
              <span className="text-amber-300">
                {exp < 0 ? numeric.toFixed(Math.abs(exp) + 1) : numeric.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-400 text-stone-950 text-xs font-black">
            Standard Form: 1 ≤ {coeff} &lt; 10
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PART I · CHAPTER 3: A STORY OF NUMBERS (mod-3-1 .. mod-3-7)
  // =========================================================================

  // mod-3-1: Pebble & Tally Bundler
  if (moduleId === 'mod-3-1') {
    const pebbles = Math.max(1, simA);
    const bundleSize = simB >= 8 ? 10 : 5;
    const bundles = Math.floor(pebbles / bundleSize);
    const singles = pebbles % bundleSize;

    return (
      <div data-testid="sim-canvas-mod-3-1" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Pebble &amp; Tally Gate Bundler
            </div>
            <div className="text-2xl font-black mt-1 tabular-nums">
              {pebbles} Pebbles = <span className="text-amber-300">{bundles}</span>{' '}
              {bundleSize === 5 ? 'Tally Gates (5)' : 'Clay Tokens (10)'} + {singles} Loose
            </div>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap gap-3">
          {Array.from({ length: bundles }, (_, i) => (
            <span
              key={i}
              className="px-3 py-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 font-black text-sm"
            >
              {bundleSize === 5 ? '𝍸 (5)' : '🏺 (10)'}
            </span>
          ))}
          {Array.from({ length: singles }, (_, i) => (
            <span
              key={`s-${i}`}
              className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 font-black text-sm"
            >
              ● (1)
            </span>
          ))}
        </div>
      </div>
    );
  }

  // mod-3-2: Ancient Symbol Converter
  if (moduleId === 'mod-3-2') {
    const val = simA;
    const roman = toRoman(val);
    const egypt = toEgyptianTokens(val);
    return (
      <div data-testid="sim-canvas-mod-3-2" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
              Ancient Stone Slab Converter
            </span>
            <div className="flex gap-1.5">
              {[1, 5, 10, 50].map((inc) => (
                <button
                  key={inc}
                  type="button"
                  onClick={() => setSlabTotal((s) => Math.min(1999, s + inc))}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 text-stone-950 text-xs font-black cursor-pointer"
                >
                  +{inc}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSlabTotal(val)}
                className="px-2.5 py-1 rounded-lg bg-white/15 text-white text-xs font-bold cursor-pointer"
              >
                Sync Slider ({val})
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-black/25 border border-white/15">
              <div className="text-[11px] uppercase text-teal-200 font-bold">Roman Slab ({val})</div>
              <div className="text-2xl font-black text-amber-300 mt-1 tracking-wider">{roman}</div>
            </div>
            <div className="p-4 rounded-xl bg-black/25 border border-white/15">
              <div className="text-[11px] uppercase text-teal-200 font-bold">
                Custom Tap Slab ({slabTotal} = {toRoman(slabTotal)})
              </div>
              <div className="text-lg font-black text-emerald-200 mt-1">
                {egypt.map((e) => `${e.glyph.repeat(e.count)}`).join(' ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // mod-3-3: Mayan Tiered Abacus
  if (moduleId === 'mod-3-3') {
    const val = simA;
    const t400 = Math.floor(val / 400);
    const t20 = Math.floor((val % 400) / 20);
    const t1 = val % 20;
    const renderGlyph = (d: number) => {
      if (d === 0) return '🐚 (0 Shell)';
      const bars = Math.floor(d / 5);
      const dots = d % 5;
      return `${'●'.repeat(dots)} ${'▬'.repeat(bars)} (${d})`;
    };

    return (
      <div data-testid="sim-canvas-mod-3-3" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Mayan Tiered Abacus · Base-20 Vertical Stack
          </div>
          <div className="text-xl font-black mt-1 tabular-nums">
            {val} = ({t400} × 400) + ({t20} × 20) + ({t1} × 1)
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Tier 3 (400s)', v: t400 },
            { label: 'Tier 2 (20s)', v: t20 },
            { label: 'Tier 1 (1s)', v: t1 },
          ].map((tier) => (
            <div key={tier.label} className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-center">
              <div className="text-xs font-black text-amber-800 uppercase">{tier.label}</div>
              <div className="text-lg font-black text-amber-950 mt-1">{renderGlyph(tier.v)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // mod-3-4: Cuneiform Sexagesimal Board
  if (moduleId === 'mod-3-4') {
    const total = simA;
    const sixties = Math.floor(total / 60);
    const ones = total % 60;
    const wedges = (n: number) => `${'◀'.repeat(Math.floor(n / 10))}${'▼'.repeat(n % 10)}` || '∅';

    return (
      <div data-testid="sim-canvas-mod-3-4" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Babylonian Base-60 Cuneiform Clay Tablet
          </div>
          <div className="text-2xl font-black mt-1 tabular-nums">
            {total} min = <span className="text-amber-300">{sixties}h : {String(ones).padStart(2, '0')}m</span> · Angle: {total % 360}°
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-3 rounded-xl bg-amber-400/15 border border-amber-300/40">
              <div className="text-xs text-amber-200 font-bold">Left Column (×60): {sixties}</div>
              <div className="text-xl font-black text-amber-300 mt-1">{wedges(sixties)}</div>
            </div>
            <div className="p-3 rounded-xl bg-teal-400/15 border border-teal-300/40">
              <div className="text-xs text-teal-200 font-bold">Right Column (×1): {ones}</div>
              <div className="text-xl font-black text-teal-300 mt-1">{wedges(ones)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // mod-3-5: Multi-Base Odometer
  if (moduleId === 'mod-3-5') {
    const v = simA;
    return (
      <div data-testid="sim-canvas-mod-3-5" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { name: 'Base-2 (Binary)', val: v.toString(2) },
          { name: 'Base-5 (Quinary)', val: v.toString(5) },
          { name: 'Base-8 (Octal)', val: v.toString(8) },
          { name: 'Base-10 (Decimal)', val: v.toString(10) },
        ].map((b) => (
          <div key={b.name} className="p-4 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 text-center">
            <div className="text-xs font-extrabold uppercase text-teal-300">{b.name}</div>
            <div className="text-2xl font-black text-amber-300 mt-2 font-mono tabular-nums">{b.val}</div>
          </div>
        ))}
      </div>
    );
  }

  // mod-3-6: Exploding Dots Machine
  if (moduleId === 'mod-3-6') {
    const ones = simA % 10;
    const carryFromOnes = Math.floor(simA / 10);
    const rawTens = carryFromOnes + simB;
    const tens = rawTens % 10;
    const hundreds = Math.floor(rawTens / 10);
    const total = hundreds * 100 + tens * 10 + ones;

    return (
      <div data-testid="sim-canvas-mod-3-6" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Exploding 10 ← 1 Machine
          </div>
          <div className="text-xl font-black mt-1 tabular-nums">
            Dropped {simA} ones + {simB} extra tens ➔ Exploded Result:{' '}
            <span className="text-amber-300">{total}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Hundreds Box (100)', count: hundreds },
            { label: 'Tens Box (10)', count: tens },
            { label: 'Ones Box (1)', count: ones },
          ].map((box) => (
            <div key={box.label} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <div className="text-xs font-black text-stone-700">{box.label}</div>
              <div className="text-2xl font-black text-[#0F766E] mt-1">{box.count}</div>
              <div className="text-xs tracking-widest mt-1 text-amber-600">
                {'●'.repeat(Math.min(9, box.count)) || '0'}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // mod-3-7: Abacus vs. Positional Race
  const sum = simA + simB;
  return (
    <div data-testid="sim-canvas-mod-3-7" className="space-y-4">
      <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Abacus vs. Positional Hindu-Arabic Zero Placeholder
          </div>
          <div className="text-2xl font-black mt-1 tabular-nums">
            {simA} + {simB} = <span className="text-amber-300">{sum}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setAbacusCarries((c) => !c)}
          className="px-3.5 py-2 rounded-xl bg-amber-400 text-stone-950 font-black text-xs cursor-pointer"
        >
          {abacusCarries ? 'Hide Carry Indicators' : 'Show Carry Indicators'}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 font-mono text-sm space-y-1">
          <div className="text-xs font-black text-stone-500 uppercase">Hindu-Arabic Positional Alignment</div>
          <div className="text-lg font-black text-stone-900">
            &nbsp;&nbsp;{simA}<br />+ {simB}<br />─────<br />= {sum}
          </div>
          {abacusCarries && (
            <div className="text-xs text-[#0F766E] font-bold">
              Zero placeholders keep Hundreds / Tens / Ones aligned automatically!
            </div>
          )}
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-sm">
          <div className="text-xs font-black text-amber-900 uppercase">Abacus Bead Columns</div>
          <div className="mt-2 font-black text-amber-950">
            1000s: {Math.floor(sum / 1000)} · 100s: {Math.floor((sum % 1000) / 100)} · 10s:{' '}
            {Math.floor((sum % 100) / 10)} · 1s: {sum % 10}
          </div>
        </div>
      </div>
    </div>
  );
};
