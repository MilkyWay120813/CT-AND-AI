import React, { useState } from 'react';
import type { SimRenderProps } from './Part1NumberSimulators';

function buildKochPoints(n: number): string {
  type Pt = [number, number];
  let pts: Pt[] = [
    [90, 140],
    [210, 140],
    [150, 36],
  ];
  for (let step = 0; step < Math.min(4, n); step++) {
    const next: Pt[] = [];
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i];
      const [bx, by] = pts[(i + 1) % pts.length];
      const dx = (bx - ax) / 3;
      const dy = (by - ay) / 3;
      const p1: Pt = [ax + dx, ay + dy];
      const p3: Pt = [ax + 2 * dx, ay + 2 * dy];
      const angle = -Math.PI / 3;
      const p2: Pt = [
        p1[0] + dx * Math.cos(angle) - dy * Math.sin(angle),
        p1[1] + dx * Math.sin(angle) + dy * Math.cos(angle),
      ];
      next.push([ax, ay], p1, p2, p3);
    }
    pts = next;
  }
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

function buildSierpinskiTris(
  depth: number
): Array<{ points: string }> {
  type Tri = [[number, number], [number, number], [number, number]];
  let list: Tri[] = [
    [
      [150, 18],
      [45, 185],
      [255, 185],
    ],
  ];
  for (let d = 0; d < Math.min(5, depth); d++) {
    const next: Tri[] = [];
    for (const [a, b, c] of list) {
      const ab: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const bc: [number, number] = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
      const ac: [number, number] = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2];
      next.push([a, ab, ac], [ab, b, bc], [ac, bc, c]);
    }
    list = next;
  }
  return list.map(([a, b, c]) => ({
    points: `${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]}`,
  }));
}

export const Part2GeoDataAlgAreaSimulators: React.FC<SimRenderProps> = ({
  moduleId,
  simA,
  simB,
}) => {
  // Interactive state for Ch4 isometric grid + Ch5 dot plotter + Ch6 pan scale
  const [isoCubes, setIsoCubes] = useState<number[]>([0, 1, 2, 5]);
  const [dotPlotPts, setDotPlotPts] = useState<number[]>([3, 5, 5, 6, 6, 7, 11]);
  const [removedPairs, setRemovedPairs] = useState<number>(0);

  // =========================================================================
  // PART II · CHAPTER 4: GEOMETRIC THEMES (p2-mod-4-1 .. p2-mod-4-7)
  // =========================================================================

  // p2-mod-4-1: Recursive Snowflake Iterator
  if (moduleId === 'p2-mod-4-1') {
    const n = Math.max(0, Math.min(4, simA));
    const segments = 3 * Math.pow(4, n);
    const relPerim = Math.pow(4 / 3, n).toFixed(2);
    return (
      <div data-testid="sim-canvas-p2-mod-4-1" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Koch Snowflake Iterator · Iteration n = {n}
          </div>
          <div className="text-xl font-black mt-1 tabular-nums">
            Sides = <span className="text-amber-300">{segments.toLocaleString()}</span> · Perimeter Factor = {relPerim}× Original!
          </div>
        </div>
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex justify-center">
          <svg viewBox="0 0 300 185" className="w-full max-w-sm h-48">
            <polygon points={buildKochPoints(n)} fill="rgba(45, 212, 191, 0.25)" stroke="#0F766E" strokeWidth="2" />
          </svg>
        </div>
      </div>
    );
  }

  // p2-mod-4-2: Sierpinski Subdivision Explorer
  if (moduleId === 'p2-mod-4-2') {
    const depth = Math.max(0, Math.min(5, simA));
    const tris = buildSierpinskiTris(depth);
    return (
      <div data-testid="sim-canvas-p2-mod-4-2" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Sierpinski Triangle Zoomer (Depth {depth} · {simB}× Zoom)
          </div>
          <div className="text-xl font-black mt-1 tabular-nums">
            Shaded Triangles: 3^{depth} = <span className="text-amber-300">{Math.pow(3, depth)}</span> · Area Kept: {((Math.pow(3 / 4, depth)) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex justify-center overflow-hidden">
          <svg viewBox="0 0 300 200" className="w-full max-w-sm h-48" style={{ transform: `scale(${1 + (simB - 1) * 0.25})` }}>
            {tris.map((t, i) => (
              <polygon key={i} points={t.points} fill="#0F766E" />
            ))}
          </svg>
        </div>
      </div>
    );
  }

  // p2-mod-4-3: Polyhedron Vertex-Edge-Face Counter
  if (moduleId === 'p2-mod-4-3') {
    const solids = [
      { name: 'Tetrahedron', v: 4, e: 6, f: 4 },
      { name: 'Cube (Hexahedron)', v: 8, e: 12, f: 6 },
      { name: 'Octahedron', v: 6, e: 12, f: 8 },
      { name: 'Dodecahedron', v: 20, e: 30, f: 12 },
      { name: 'Icosahedron', v: 12, e: 30, f: 20 },
    ];
    const s = solids[(simA - 1) % solids.length];
    return (
      <div data-testid="sim-canvas-p2-mod-4-3" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 space-y-3">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Platonic Orbit · {s.name} (Angle {simB}°)
        </div>
        <div className="text-2xl font-black tabular-nums">
          V ({s.v}) − E ({s.e}) + F ({s.f}) = <span className="text-amber-300">{s.v - s.e + s.f}</span>!
        </div>
      </div>
    );
  }

  // p2-mod-4-4: 3D-to-2D Net Folder
  if (moduleId === 'p2-mod-4-4') {
    const pct = Math.round((simA / 90) * 100);
    return (
      <div data-testid="sim-canvas-p2-mod-4-4" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          6-Square Cube Net Crease Folder ({simA}° Fold · Blueprint #{simB})
        </div>
        <div className="text-xl font-black mt-1">
          {simA === 90 ? '📦 Closed 3D Cube Assembled!' : simA === 0 ? '📄 Flat 2D Net Laid Open' : `Folding Flaps ${pct}% Closed...`}
        </div>
      </div>
    );
  }

  // p2-mod-4-5: 3-Spotlight Shadow Room
  if (moduleId === 'p2-mod-4-5') {
    return (
      <div data-testid="sim-canvas-p2-mod-4-5" className="grid grid-cols-3 gap-3">
        {[
          { label: 'Top Plan Shadow', count: `${simA}×2 footprint` },
          { label: 'Front Elevation', count: `${simB} blocks high` },
          { label: 'Side Profile', count: `L-Step ${simB}:${simA}` },
        ].map((view) => (
          <div key={view.label} className="p-4 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 text-center">
            <div className="text-xs uppercase font-bold text-teal-300">{view.label}</div>
            <div className="text-lg font-black text-amber-300 mt-1">{view.count}</div>
          </div>
        ))}
      </div>
    );
  }

  // p2-mod-4-6: Isometric Dot-Grid Builder
  if (moduleId === 'p2-mod-4-6') {
    return (
      <div data-testid="sim-canvas-p2-mod-4-6" className="space-y-3">
        <div className="p-4 rounded-2xl bg-[#0F3828] text-white flex items-center justify-between">
          <span className="text-sm font-black">
            Isometric Cube Snapper ({isoCubes.length} Active Cubes · Click nodes below!)
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
          {Array.from({ length: 10 }, (_, idx) => {
            const on = isoCubes.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  setIsoCubes((prev) =>
                    prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx]
                  )
                }
                className={`p-3 rounded-xl font-black text-xs border-2 cursor-pointer transition ${
                  on ? 'bg-[#0F766E] text-amber-300 border-teal-400' : 'bg-stone-100 text-stone-600 border-stone-300'
                }`}
              >
                {on ? '🧊 Cube' : `+Slot ${idx + 1}`}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // p2-mod-4-7: 3D Laser Plane Slicer
  if (moduleId === 'p2-mod-4-7') {
    const names = ['Cube', 'Cone', 'Cylinder', 'Sphere'];
    const solid = names[(simA - 1) % 4];
    const cutShape =
      solid === 'Sphere'
        ? 'Circle (Always!)'
        : solid === 'Cube'
        ? simB > 35
          ? 'Regular Hexagon / Triangle!'
          : 'Square Cross-Section'
        : simB > 15
        ? 'Ellipse Cross-Section'
        : 'Perfect Circle';
    return (
      <div data-testid="sim-canvas-p2-mod-4-7" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          3D Laser Plane Slicer ({solid} @ {simB}° Blade Tilt)
        </div>
        <div className="text-2xl font-black mt-1 text-amber-300">2D Cut Face: {cutShape}</div>
      </div>
    );
  }

  // =========================================================================
  // PART II · CHAPTER 5: TALES BY DOTS AND LINES (p2-mod-5-1 .. p2-mod-5-7)
  // =========================================================================

  // p2-mod-5-1: Interactive Dot-Plot Dropper
  if (moduleId === 'p2-mod-5-1') {
    const mean = (dotPlotPts.reduce((a, b) => a + b, 0) / Math.max(1, dotPlotPts.length)).toFixed(2);
    return (
      <div data-testid="sim-canvas-p2-mod-5-1" className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] text-white flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs uppercase font-bold text-teal-300">
              Interactive Dot-Plot Dropper ({dotPlotPts.length} dots · Mean {mean})
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDotPlotPts([3, 5, 5, 6, 6, 7, 11])}
            className="px-3 py-1 rounded-xl bg-amber-400 text-stone-950 font-black text-xs cursor-pointer"
          >
            Reset Dots
          </button>
        </div>
        <div
          className="grid gap-1 p-3 rounded-2xl bg-stone-50 border border-stone-200 items-end overflow-x-auto"
          style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}
        >
          {Array.from({ length: 13 }, (_, val) => {
            const count = dotPlotPts.filter((d) => d === val).length;
            return (
              <button
                key={val}
                type="button"
                onClick={() => setDotPlotPts((prev) => [...prev, val])}
                className="flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-teal-50 cursor-pointer"
                title={`Drop dot at ${val}`}
              >
                <div className="flex flex-col-reverse gap-0.5 min-h-[56px] justify-start">
                  {Array.from({ length: Math.min(5, count) }, (_, k) => (
                    <span key={k} className="w-3 h-3 rounded-full bg-[#0F766E] border border-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-black text-stone-700">{val}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // p2-mod-5-2: Fulcrum Seesaw Beam
  if (moduleId === 'p2-mod-5-2') {
    const weights = [2, 4, 6, simB];
    const trueMean = weights.reduce((a, b) => a + b, 0) / weights.length;
    const tilt = (trueMean - simA).toFixed(2);
    const balanced = Math.abs(Number(tilt)) < 0.6;
    return (
      <div data-testid="sim-canvas-p2-mod-5-2" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Fulcrum Seesaw Beam · Weights: [{weights.join(', ')}]
        </div>
        <div className="text-xl font-black mt-1 tabular-nums">
          Fulcrum at {simA} vs True Mean {trueMean.toFixed(1)} →{' '}
          <span className={balanced ? 'text-amber-300' : 'text-rose-300'}>
            {balanced ? '⚖️ LEVEL BALANCE ACHIEVED!' : `Tilted (Move Fulcrum toward ${trueMean.toFixed(1)})`}
          </span>
        </div>
      </div>
    );
  }

  // p2-mod-5-3: Outlier Tug-of-War Line
  if (moduleId === 'p2-mod-5-3') {
    const arr = [2, 3, 4, 4, 5, simA].sort((a, b) => a - b);
    const mean = (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
    const median = ((arr[2] + arr[3]) / 2).toFixed(1);
    return (
      <div data-testid="sim-canvas-p2-mod-5-3" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Outlier Tug-of-War · Outlier Pulled to {simA}
        </div>
        <div className="text-xl font-black mt-1 tabular-nums">
          Mean Pulled to <span className="text-rose-300">{mean}</span> · Median Steady at{' '}
          <span className="text-amber-300">{median}</span>!
        </div>
      </div>
    );
  }

  // p2-mod-5-4: Tangent Slope & Scrubbing Tracker
  if (moduleId === 'p2-mod-5-4') {
    const curve = simB === 1 ? [0, 10, 25, 45, 45, 45, 65, 90, 100] : [98, 99, 101, 102, 100, 99, 98, 98, 98];
    const t = Math.min(8, Math.max(0, simA));
    const prev = curve[Math.max(0, t - 1)];
    const cur = curve[t];
    const slope = t === 0 ? 0 : cur - prev;
    return (
      <div data-testid="sim-canvas-p2-mod-5-4" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Graph Slope Scrubber (t = {t})
        </div>
        <div className="text-xl font-black mt-1 tabular-nums">
          Value = {cur} · Instant Rate of Change ={' '}
          <span className="text-amber-300">
            {slope === 0 ? '0 (Flat Rest!)' : slope > 0 ? `+${slope}/step (Rising)` : `${slope}/step (Dropping)`}
          </span>
        </div>
      </div>
    );
  }

  // p2-mod-5-5: Telemetry Point-to-Line Plotter
  if (moduleId === 'p2-mod-5-5') {
    const pts = [20, 35, simA, 50, simB, 85];
    const svgPts = pts.map((v, i) => `${25 + i * 48},${110 - v}`).join(' ');
    return (
      <div data-testid="sim-canvas-p2-mod-5-5" className="space-y-3">
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex justify-center">
          <svg viewBox="0 0 300 120" className="w-full max-w-md h-32">
            <polyline fill="none" stroke="#0F766E" strokeWidth="3" points={svgPts} />
            {pts.map((v, i) => (
              <circle key={i} cx={25 + i * 48} cy={110 - v} r="4.5" fill="#F59E0B" stroke="#0F3828" strokeWidth="1.5" />
            ))}
          </svg>
        </div>
      </div>
    );
  }

  // p2-mod-5-6: Dual-Curve Intersection Finder
  if (moduleId === 'p2-mod-5-6') {
    // Line A: y = 1*t + offset; Line B: y = slopeB*t
    const tCross = simA > 1 ? (simB / (simA - 1)).toFixed(1) : 'Parallel';
    return (
      <div data-testid="sim-canvas-p2-mod-5-6" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Dual-Curve Crossover Solver
        </div>
        <div className="text-xl font-black mt-1 tabular-nums">
          Line A (y = t + {simB}) intersects Line B (y = {simA}t) at{' '}
          <span className="text-amber-300">t* = {tCross}</span>
        </div>
      </div>
    );
  }

  // p2-mod-5-7: Y-Axis Scale & Truncation Stretcher
  if (moduleId === 'p2-mod-5-7') {
    const base = Math.min(93, simA);
    const span = 100 - base;
    const hA = ((94 - base) / span) * 100;
    const hB = ((96 - base) / span) * 100;
    return (
      <div data-testid="sim-canvas-p2-mod-5-7" className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Misleading Y-Axis Baseline Stretcher (94% vs 96% · Baseline = {base}%)
          </div>
          <div className="text-sm text-amber-300 font-bold mt-1">
            Apparent Bar Ratio: {(hB / Math.max(1, hA)).toFixed(1)}× taller even though real difference is only 2%!
          </div>
        </div>
        <div className="flex items-end gap-8 h-32 p-4 bg-stone-50 border border-stone-200 rounded-2xl justify-center">
          <div className="w-16 bg-stone-500 text-white text-xs font-black text-center rounded-t-lg flex items-center justify-center" style={{ height: `${Math.max(12, hA)}%` }}>94%</div>
          <div className="w-16 bg-[#0F766E] text-white text-xs font-black text-center rounded-t-lg flex items-center justify-center" style={{ height: `${Math.max(12, hB)}%` }}>96%</div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PART II · CHAPTER 6: ALGEBRA PLAY (p2-ch6-m1 .. p2-ch6-m7)
  // =========================================================================

  // p2-ch6-m1: Algebraic X-Ray Bag
  if (moduleId === 'p2-ch6-m1') {
    const x = simA;
    const s1 = 2 * x;
    const s2 = s1 + 6;
    const s3 = s2 / 2;
    const s4 = s3 - x;
    return (
      <div data-testid="sim-canvas-p2-ch6-m1" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 space-y-2">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Algebraic X-Ray Mystery Bag Machine (Hidden x = {x})
        </div>
        <div className="text-lg font-black tabular-nums">
          🎒({x}) → ×2 ({s1}) → +6 ({s2}) → ÷2 ({s3}) → −🎒({x}) ={' '}
          <span className="text-amber-300">ALWAYS {s4}!</span>
        </div>
      </div>
    );
  }

  // p2-ch6-m2: 3-Tier Sum Pyramid Sandbox
  if (moduleId === 'p2-ch6-m2') {
    const x = simA;
    const y = simB;
    const z = 5;
    const m1 = x + y;
    const m2 = y + z;
    const apex = m1 + m2;
    return (
      <div data-testid="sim-canvas-p2-ch6-m2" className="space-y-2 max-w-xs mx-auto text-center font-black">
        <div className="p-3 rounded-xl bg-amber-400 text-stone-950">Apex: {apex} (x + 2y + 5)</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-[#0F766E] text-white">{m1} (x+y)</div>
          <div className="p-2.5 rounded-xl bg-[#0F766E] text-white">{m2} (y+5)</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-xl bg-stone-100 border border-stone-300 text-stone-900">{x}</div>
          <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-950">{y}</div>
          <div className="p-2 rounded-xl bg-stone-100 border border-stone-300 text-stone-900">{z}</div>
        </div>
      </div>
    );
  }

  // p2-ch6-m3: Calendar 3 × 3 Window Slider
  if (moduleId === 'p2-ch6-m3') {
    const c = simA;
    const dates = [c - 8, c - 7, c - 6, c - 1, c, c + 1, c + 6, c + 7, c + 8];
    return (
      <div data-testid="sim-canvas-p2-ch6-m3" className="space-y-3">
        <div className="p-4 rounded-2xl bg-[#0F3828] text-white font-black text-lg text-center">
          3×3 Window Centered at {c} → Sum = 9 × {c} ={' '}
          <span className="text-amber-300">{9 * c}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {dates.map((d) => (
            <div
              key={d}
              className={`p-2.5 rounded-xl border text-center font-black text-sm ${
                d === c ? 'bg-amber-400 text-stone-950 border-amber-500' : 'bg-stone-50 border-stone-200 text-stone-800'
              }`}
            >
              {d}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // p2-ch6-m4: Matchstick Chain Extender
  if (moduleId === 'p2-ch6-m4') {
    const totalSticks = 1 + simA * simB;
    return (
      <div data-testid="sim-canvas-p2-ch6-m4" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Matchstick Chain Extender ({simA} Linked Bays · +{simB}/bay)
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          1 + {simB}({simA}) = <span className="text-amber-300">{totalSticks} Matchsticks</span>
        </div>
      </div>
    );
  }

  // p2-ch6-m5: Two-Pan Algebra Balance
  if (moduleId === 'p2-ch6-m5') {
    const step = Math.min(2, simA + removedPairs);
    return (
      <div data-testid="sim-canvas-p2-ch6-m5" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Two-Pan Algebra Balance Scale
          </div>
          <div className="text-2xl font-black mt-1 text-amber-300">
            {step === 0 ? '3x + 4 = x + 12' : step === 1 ? '2x + 4 = 12 (Removed x)' : '2x = 8 ➔ x = 4!'}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setRemovedPairs((r) => (r + 1) % 3)}
          className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-black text-xs cursor-pointer"
        >
          Balance Step →
        </button>
      </div>
    );
  }

  // p2-ch6-m6: Dual-Slider Constraint Mixer
  if (moduleId === 'p2-ch6-m6') {
    const headcount = simA + simB;
    const rev = simA * 200 + simB * 100;
    const solved = headcount === 20 && rev === 2800;
    return (
      <div data-testid="sim-canvas-p2-ch6-m6" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Constraint Mixer · Target: 20 People &amp; ₹2,800
        </div>
        <div className="text-xl font-black mt-1 tabular-nums">
          Headcount: {headcount}/20 · Revenue: ₹{rev.toLocaleString()}/₹2,800{' '}
          <span className={solved ? 'text-amber-300' : 'text-teal-200'}>
            {solved ? '🎉 EXACT CONSTRAINT LOCKED!' : '(Hint: Try 8 Adults, 12 Kids)'}
          </span>
        </div>
      </div>
    );
  }

  // p2-ch6-m7: Universal Domain Stress-Tester
  if (moduleId === 'p2-ch6-m7') {
    const x = simA / 10;
    const holds = x * x > x;
    return (
      <div data-testid="sim-canvas-p2-ch6-m7" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
            Universal Domain Tester · Is x² &gt; x Always True?
          </div>
          <div className="text-xl font-black mt-1 tabular-nums">
            At x = {x.toFixed(1)} → x² = {(x * x).toFixed(2)} vs x = {x.toFixed(1)}
          </div>
        </div>
        <span className={`px-4 py-2 rounded-xl font-black text-xs ${holds ? 'bg-emerald-400 text-stone-950' : 'bg-rose-700 text-white'}`}>
          {holds ? 'HOLDS (TRUE)' : 'COUNTEREXAMPLE FOUND!'}
        </span>
      </div>
    );
  }

  // =========================================================================
  // PART II · CHAPTER 7: AREA (p2-mod-7-1 .. p2-mod-7-7)
  // =========================================================================

  // p2-mod-7-1: Shear-and-Slide Morpher
  if (moduleId === 'p2-mod-7-1') {
    const h = 5;
    return (
      <div data-testid="sim-canvas-p2-mod-7-1" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Parallelogram Shear-and-Slide Morpher (Slant Shift = {simA})
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          Area = Base ({simB}) × Height ({h}) = <span className="text-amber-300">{simB * h} sq units</span> (Constant!)
        </div>
      </div>
    );
  }

  // p2-mod-7-2: 180° Twin-Triangle Rotator
  if (moduleId === 'p2-mod-7-2') {
    const area = (0.5 * simB * 6).toFixed(1);
    return (
      <div data-testid="sim-canvas-p2-mod-7-2" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          180° Twin-Triangle Rotator ({simA}° Swing)
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          Two Triangles = 1 Parallelogram ({simB} × 6 = {simB * 6}) ⇒ 1 Triangle ={' '}
          <span className="text-amber-300">{area}</span>
        </div>
      </div>
    );
  }

  // p2-mod-7-3: Double-Trapezium Flipper
  if (moduleId === 'p2-mod-7-3') {
    const b = 10;
    const h = 6;
    const area = 0.5 * (simB + b) * h;
    return (
      <div data-testid="sim-canvas-p2-mod-7-3" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Double-Trapezium Flipper ({simA}% Docked)
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          ½({simB} + {b}) × {h} = <span className="text-amber-300">{area} sq units</span>
        </div>
      </div>
    );
  }

  // p2-mod-7-4: Bounding-Box Diagonal Frame
  if (moduleId === 'p2-mod-7-4') {
    return (
      <div data-testid="sim-canvas-p2-mod-7-4" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Bounding-Box Rhombus Frame ({simA} × {simB})
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          Box Area {simA * simB} ÷ 2 = <span className="text-amber-300">{(simA * simB) / 2} sq units</span>
        </div>
      </div>
    );
  }

  // p2-mod-7-5: Polygon Triangulation Slicer
  if (moduleId === 'p2-mod-7-5') {
    const pieces = Math.min(4, simA + 1);
    return (
      <div data-testid="sim-canvas-p2-mod-7-5" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Composite Polygon Chord Decomposer ({simA} Chords Drawn)
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          Split into <span className="text-amber-300">{pieces} Sub-Triangles</span> · Surveyor Area ≈ {pieces * simB * 2} sq m
        </div>
      </div>
    );
  }

  // p2-mod-7-6: Inner vs. Outer Lawn Subtract-Viewer
  if (moduleId === 'p2-mod-7-6') {
    const L = simB;
    const W = 12;
    const innerL = L - 2 * simA;
    const innerW = W - 2 * simA;
    const pathArea = L * W - innerL * innerW;
    return (
      <div data-testid="sim-canvas-p2-mod-7-6" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
        <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
          Outer {L}×{W} vs Inner Lawn {innerL}×{innerW} (Path Width w = {simA})
        </div>
        <div className="text-2xl font-black mt-1 tabular-nums">
          Border Area = {L * W} − {innerL * innerW} = <span className="text-amber-300">{pathArea} sq m</span>
        </div>
      </div>
    );
  }

  // p2-mod-7-7: Fixed-Loop Rope Stretcher
  const w = simA;
  const h = 20 - w;
  const area = w * h;
  return (
    <div data-testid="sim-canvas-p2-mod-7-7" className="p-5 rounded-2xl bg-[#0F3828] text-white border border-teal-500/30">
      <div className="text-xs uppercase tracking-wider text-teal-300 font-extrabold">
        Fixed 40-Unit Loop Optimizer ({w} × {h} Rectangle)
      </div>
      <div className="text-2xl font-black mt-1 tabular-nums">
        Perimeter = 40 m · Area ={' '}
        <span className={area === 100 ? 'text-amber-300' : 'text-teal-200'}>
          {area} m² {area === 100 ? '(MAXIMUM AT 10×10 SQUARE!)' : ''}
        </span>
      </div>
    </div>
  );
};
