import React, { useState, useEffect } from 'react';
import { Scissors, Sparkles, Compass, Eye } from 'lucide-react';
import type { Custom98GameSpec } from '../../data/custom98Games';
import type { ArcadeRuntimeContext } from './ArcadeShell';
import { formatMathText } from '../../utils/formatMath';

interface GeometryLaserGameProps {
  spec: Custom98GameSpec;
  runtime: ArcadeRuntimeContext;
}

export const GeometryLaserGame: React.FC<GeometryLaserGameProps> = ({ spec, runtime }) => {
  const id = spec.moduleId;
  const wIdx = runtime.wave - 1;

  // Interactive angle / wedge / mirror / voxel / scale state
  const [angleVal, setAngleVal] = useState<number>(90);
  const [diagA, setDiagA] = useState<number>(8);
  const [diagB, setDiagB] = useState<number>(6);
  const [voxels, setVoxels] = useState<boolean[]>([true, true, true, true, false, false, false, false]);

  useEffect(() => {
    setAngleVal(id === 'p2-mod-5-7' ? 85 : 90);
    setDiagA(8);
    setDiagB(6);
    setVoxels([true, true, true, true, false, false, false, false]);
  }, [wIdx, id, runtime.resetTrigger]);

  // =========================================================================
  // 1. INTERGALACTIC PIZZA CHEF (p2-mod-3-3): Live 360° Protractor SVG Cutter
  // =========================================================================
  if (id === 'p2-mod-3-3') {
    const orders = [
      { alien: 'Zorg Crew asks for 25% of a Plasma Pie', targetDeg: 90 },
      { alien: 'Nebula Captain asks for 1/3 of a Plasma Pie', targetDeg: 120 },
      { alien: 'Quadra Fleet asks for 20% of a Plasma Pie', targetDeg: 72 },
      { alien: 'Orion Guild asks for 40% of a Plasma Pie', targetDeg: 144 },
    ];
    const ord = orders[wIdx % orders.length];
    const rad = ((angleVal - 90) * Math.PI) / 180;
    const x2 = 100 + 75 * Math.cos(rad);
    const y2 = 100 + 75 * Math.sin(rad);
    const largeArc = angleVal > 180 ? 1 : 0;

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-pink-400/50 text-center">
          <div className="text-xs font-black uppercase text-pink-300">
            Drive-Thru Alien Order · {ord.alien}
          </div>
          <p className="text-xs text-teal-100 mt-0.5">
            Rotate the glowing 360° laser cutter wedge and SLICE cleanly before they warp away!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-[#082218] p-5 rounded-2xl border border-white/10">
          <svg viewBox="0 0 200 200" className="w-44 h-44 shrink-0">
            <circle cx="100" cy="100" r="78" fill="#1F2937" stroke="#334155" strokeWidth="3" />
            <path
              d={`M 100 100 L 100 25 A 75 75 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`}
              fill="rgba(236,72,153,0.45)"
              stroke="#F472B6"
              strokeWidth="2.5"
            />
            <line x1="100" y1="100" x2="100" y2="25" stroke="#FDE047" strokeWidth="2.5" />
            <line
              x1="100"
              y1="100"
              x2={x2}
              y2={y2}
              stroke="#F43F5E"
              strokeWidth="3"
              strokeDasharray="4 2"
            />
            <circle cx="100" cy="100" r="5" fill="#FDE047" />
          </svg>

          <div className="space-y-3 w-full max-w-xs">
            <div className="flex justify-between text-xs font-bold text-teal-200">
              <span>Protractor Angle Dial</span>
              <span className="px-2.5 py-0.5 rounded bg-pink-600 text-white font-black">
                {angleVal}° ({((angleVal / 360) * 100).toFixed(1)}%)
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={330}
              step={1}
              value={angleVal}
              onChange={(e) => setAngleVal(Number(e.target.value))}
              className="w-full accent-pink-400 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => {
                if (Math.abs(angleVal - ord.targetDeg) <= 2) {
                  runtime.awardHit(185, `Perfect ${ord.targetDeg}° plasma slice served!`, true);
                } else {
                  runtime.loseLife(`Sloppy slice! Needed ${ord.targetDeg}°, cut ${angleVal}°!`);
                }
              }}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Scissors className="w-4 h-4" /> SLICE PLASMA PIE ({angleVal}°)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. SHADOW-SCULPTOR HEIST (p2-mod-4-5): 2×2×2 Voxel Carving for Top/Front Shadows
  // =========================================================================
  if (id === 'p2-mod-4-5') {
    const goals = [
      { label: 'L-Sculpture: Carve Top-Right Front Pillar', targetTop: [true, false, true, true], targetFront: [true, true, true, false] },
      { label: 'Step-Tower: Carve Upper Back-Right', targetTop: [true, true, true, false], targetFront: [true, true, false, true] },
      { label: 'Full Corner Arch: 3 Bottom + Top-Left', targetTop: [true, true, true, false], targetFront: [true, false, true, true] },
    ];
    const g = goals[wIdx % goals.length];
    // Top view: [b0||b4, b1||b5, b2||b6, b3||b7]
    const curTop = [0, 1, 2, 3].map((i) => voxels[i] || voxels[i + 4]);
    const topMatch = curTop.every((v, idx) => v === g.targetTop[idx]);

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-teal-400/40 text-center">
          <div className="text-xs font-black uppercase text-amber-300 flex items-center justify-center gap-1.5">
            <Eye className="w-4 h-4" /> {g.label}
          </div>
          <p className="text-xs text-teal-100 mt-0.5">
            Click Floor Voxels (2×2 Grid) to toggle marble blocks so the Top Spotlight shadow matches Target!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <div className="p-4 rounded-2xl bg-[#082218] border border-white/10 text-center space-y-2">
            <div className="text-[11px] font-black text-teal-300 uppercase">Target Top Shadow</div>
            <div className="grid grid-cols-2 gap-2 w-28 mx-auto">
              {g.targetTop.map((filled, idx) => (
                <div
                  key={idx}
                  className={`h-11 rounded-lg border ${
                    filled ? 'bg-amber-400 border-amber-200' : 'bg-stone-900 border-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#082218] border border-teal-400/50 text-center space-y-2">
            <div className="text-[11px] font-black text-amber-300 uppercase">Your Marble Voxels (Click)</div>
            <div className="grid grid-cols-2 gap-2 w-28 mx-auto">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const next = [...voxels];
                    next[idx] = !next[idx];
                    next[idx + 4] = false;
                    setVoxels(next);
                  }}
                  className={`h-11 rounded-lg border-2 font-black text-xs cursor-pointer ${
                    curTop[idx]
                      ? 'bg-teal-500 border-teal-200 text-stone-950'
                      : 'bg-stone-900 border-dashed border-stone-600 text-stone-400'
                  }`}
                >
                  {curTop[idx] ? 'SOLID' : 'EMPTY'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (topMatch) {
                runtime.awardHit(190, 'Spotlight silhouette sensors bypassed at 100% match!', true);
              } else {
                runtime.loseLife('Museum laser tripped! Top shadow did not match target!');
              }
            }}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer"
          >
            TEST MUSEUM SPOTLIGHTS ({topMatch ? '100% READY' : 'MISMATCH'})
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. FAKE-NEWS EDITOR SHOWDOWN (p2-mod-5-7): Fix Truncated Y-Axis Baseline → 0
  // =========================================================================
  if (id === 'p2-mod-5-7') {
    const charts = [
      { headline: 'TV Chart: "Sales Skyrocket!" (Axis starts at 88 instead of 0)', trueMin: 0 },
      { headline: 'TV Chart: "Scores Crash!" (Axis cropped at 72% instead of 0%)', trueMin: 0 },
      { headline: 'TV Chart: "Profits 10×!" (Baseline lifted to 94 instead of 0)', trueMin: 0 },
      { headline: 'TV Chart: "Temp Spike!" (Baseline truncated at 65° instead of 0°)', trueMin: 0 },
    ];
    const c = charts[wIdx % charts.length];

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-400/50 text-center">
          <div className="text-xs font-black uppercase text-rose-300">{c.headline}</div>
          <p className="text-xs text-teal-100 mt-0.5">
            Drag the manipulative Y-Axis Baseline slider all the way down to 0 before the 6 PM broadcast!
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#082218] border border-white/15 space-y-4 max-w-md mx-auto">
          <div className="flex items-end gap-4 h-28 px-6 border-l-2 border-b-2 border-teal-400 relative">
            <span className="absolute -left-7 bottom-0 text-[10px] font-mono text-amber-300">
              {angleVal}
            </span>
            <div
              className="flex-1 bg-sky-500 rounded-t-md transition-all"
              style={{ height: `${Math.max(12, Math.min(95, 92 - angleVal))}%` }}
            />
            <div
              className="flex-1 bg-rose-500 rounded-t-md transition-all"
              style={{ height: `${Math.max(16, Math.min(100, 96 - angleVal))}%` }}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-teal-200">
              <span>Y-Axis Baseline Start:</span>
              <span className="font-mono text-amber-300">{angleVal}</span>
            </div>
            <input
              type="range"
              min={0}
              max={90}
              step={1}
              value={Math.min(90, angleVal)}
              onChange={(e) => setAngleVal(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              if (angleVal === 0) {
                runtime.awardHit(185, 'Truth restored! Y-axis baseline fixed cleanly to 0!', true);
              } else {
                runtime.loseLife(`Fake chart aired! Baseline was still truncated at ${angleVal}!`);
              }
            }}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer"
          >
            PUBLISH CORRECTED GRAPH (Baseline: {angleVal})
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. STAINED-GLASS CATHEDRAL RESTORER (p2-mod-7-4): Diagonal d1 × d2 Rhombus Frame
  // =========================================================================
  if (id === 'p2-mod-7-4') {
    const orders = [
      { targetArea: 24, hint: '½ × d₁ × d₂ = 24 cm² (e.g. d₁=8, d₂=6)' },
      { targetArea: 40, hint: '½ × d₁ × d₂ = 40 cm² (e.g. d₁=10, d₂=8)' },
      { targetArea: 60, hint: '½ × d₁ × d₂ = 60 cm² (e.g. d₁=12, d₂=10)' },
      { targetArea: 36, hint: '½ × d₁ × d₂ = 36 cm² (e.g. d₁=9, d₂=8 or 12×6)' },
    ];
    const ord = orders[wIdx % orders.length];
    const curArea = (diagA * diagB) / 2;

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-purple-400/50 text-center">
          <div className="text-xs font-black uppercase text-purple-300">
            Cathedral Glass Order: Target Rhombus Area = {ord.targetArea} cm²
          </div>
          <p className="text-xs text-teal-100 mt-0.5">
            Set diamond diagonals d₁ and d₂ so ½ × d₁ × d₂ equals {ord.targetArea} cm² without shattering!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#082218] p-4 rounded-2xl border border-white/10">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-teal-200">
              <span>Horizontal Diagonal (d₁)</span>
              <span className="text-amber-300 font-black">{diagA} cm</span>
            </div>
            <input
              type="range"
              min={4}
              max={16}
              value={diagA}
              onChange={(e) => setDiagA(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-teal-200">
              <span>Vertical Diagonal (d₂)</span>
              <span className="text-teal-300 font-black">{diagB} cm</span>
            </div>
            <input
              type="range"
              min={4}
              max={16}
              value={diagB}
              onChange={(e) => setDiagB(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
          </div>
        </div>

        <div className="text-center text-sm font-mono font-bold text-amber-300">
          Diamond Area = ½ × {diagA} × {diagB} = {curArea} cm² (Need {ord.targetArea} cm²)
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (curArea === ord.targetArea) {
                runtime.awardHit(185, `Flawless ${curArea} cm² stained-glass diamond cut!`, true);
              } else {
                runtime.loseLife(`Glass shattered! Area was ${curArea} cm², needed ${ord.targetArea} cm²!`);
              }
            }}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer"
          >
            CUT DIAMOND PANE ({curArea} cm²)
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. ALL REMAINING GEOMETRY / LASER / FRACTAL / DOJO MODULES
  // Covers mod-2-3, mod-4-1, mod-4-6, p2-mod-4-1, p2-mod-4-6, p2-mod-4-7,
  // p2-mod-5-1, p2-mod-5-5, p2-mod-7-5
  // =========================================================================
  interface LaserActionStage {
    banner: string;
    prompt: string;
    choices: { id: string; label: string; ok: boolean }[];
    okMsg: string;
    errMsg: string;
  }

  const getLaserStage = (): LaserActionStage => {
    if (id === 'mod-2-3') {
      const stages = [
        { b: 'Laser Source 2² enters Nested Mirror (2²)³ → Hit Sensor 2⁶!', ch: [{ id: 'a', label: 'Lock (2²)³ = 2⁶ (64W)', ok: true }, { id: 'b', label: 'Lock 2⁵ (32W)', ok: false }, { id: 'c', label: 'Lock 2⁰ (1W Reset)', ok: false }] },
        { b: 'Security Gate needs Exact 1 Watt Laser Slip!', ch: [{ id: 'a', label: 'Hit Zero-Power Mirror a⁰ = 1', ok: true }, { id: 'b', label: 'Hit a⁰ = 0 Burnout', ok: false }, { id: 'c', label: 'Hit (3²)² = 81W', ok: false }] },
        { b: 'Triple Mirror Bounce: ((5²)³)⁰ → Final Laser Power?', ch: [{ id: 'a', label: '1 Watt (Outer 0 resets all!)', ok: true }, { id: 'b', label: '5⁶ Watts', ok: false }, { id: 'c', label: '0 Watts', ok: false }] },
        { b: 'Vault Sensor requires (3³)² Watts!', ch: [{ id: 'a', label: '3⁶ (729W)', ok: true }, { id: 'b', label: '3⁵ (243W)', ok: false }, { id: 'c', label: '9³ (Too Hot? Wait 9³=3⁶, let us pick 3⁹)', ok: false }].map((c) => (c.id === 'c' ? { ...c, label: '3⁹ (19683W)' } : c)) },
      ];
      const s = stages[wIdx % stages.length];
      return { banner: s.b, prompt: 'Rotate heist mirror bank to hit exact wattage!', choices: s.ch, okMsg: 'Security beam bypassed cleanly!', errMsg: 'Alarm tripped—beam wattage mismatch!' };
    }
    if (id === 'mod-4-1') {
      const polys = [
        { b: 'Triangle Arena: Two angles are 55° & 65°. Align 3rd ricochet corner!', ch: [{ id: 'a', label: 'Rotate Mirror → 60°', ok: true }, { id: 'b', label: 'Rotate Mirror → 80°', ok: false }, { id: 'c', label: 'Rotate Mirror → 120°', ok: false }] },
        { b: 'Quad Arena (360°): Corners are 90°, 110°, 85°. Align 4th mirror!', ch: [{ id: 'a', label: 'Rotate Mirror → 75°', ok: true }, { id: 'b', label: 'Rotate Mirror → 95°', ok: false }, { id: 'c', label: 'Rotate Mirror → 65°', ok: false }] },
        { b: 'Pentagon Arena (540°): 4 corners sum to 430°. Align 5th wall!', ch: [{ id: 'a', label: 'Rotate Mirror → 110°', ok: true }, { id: 'b', label: 'Rotate Mirror → 90°', ok: false }, { id: 'c', label: 'Rotate Mirror → 130°', ok: false }] },
        { b: 'Hexagon Arena: Total Interior Sum for 6 walls?', ch: [{ id: 'a', label: '(6−2)×180° = 720° Lock', ok: true }, { id: 'b', label: '540° Lock', ok: false }, { id: 'c', label: '900° Lock', ok: false }] },
      ];
      const p = polys[wIdx % polys.length];
      return { banner: p.b, prompt: 'Calibrate corner mirror using polygon angle sum!', choices: p.ch, okMsg: 'Laser ricocheted cleanly into target core!', errMsg: 'Laser bounced into outer bunker wall!' };
    }
    if (id === 'mod-4-6') {
      const folds = [
        { b: 'How many total reflection symmetry lines fold a Square shuriken?', ch: [{ id: 'a', label: '4 Lines (2 Mid + 2 Diag)', ok: true }, { id: 'b', label: '2 Lines only', ok: false }, { id: 'c', label: '8 Lines', ok: false }] },
        { b: 'Smallest 90° rotational symmetry step matching a square?', ch: [{ id: 'a', label: '90° Quarter Turn', ok: true }, { id: 'b', label: '45° Eighth Turn', ok: false }, { id: 'c', label: '120° Third Turn', ok: false }] },
        { b: 'Diagonal Fold: Opposite corners map onto each other cleanly!', ch: [{ id: 'a', label: 'Diagonal Symmetry Crease ✓', ok: true }, { id: 'b', label: 'Off-Center Skew Crease', ok: false }, { id: 'c', label: '30° Corner Crease', ok: false }] },
        { b: 'Rectangle vs Square: Which symmetry axis belongs ONLY to Square (not non-square Rectangle)?', ch: [{ id: 'a', label: 'Diagonal Creases!', ok: true }, { id: 'b', label: 'Vertical Midline', ok: false }, { id: 'c', label: 'Horizontal Midline', ok: false }] },
        { b: 'Order 4 Rotational Symmetry spins 4 times in 360°!', ch: [{ id: 'a', label: 'Launch 4-Blade Order-4 Shuriken!', ok: true }, { id: 'b', label: 'Order 2 Blade', ok: false }, { id: 'c', label: 'Order 3 Blade', ok: false }] },
      ];
      const f = folds[wIdx % folds.length];
      return { banner: f.b, prompt: 'Crease paper square on true symmetry axis & throw!', choices: f.ch, okMsg: 'Bullseye shuriken strike!', errMsg: 'Wobbly uneven fold missed dummy!' };
    }
    if (id === 'p2-mod-4-1') {
      const koch = [
        { b: 'Wave 1: Perimeter starts at 3 units (n=0). Multiply × 4/3 at Iteration n=1!', ch: [{ id: 'a', label: '4 units Koch Shield', ok: true }, { id: 'b', label: '3 units Flat', ok: false }, { id: 'c', label: '6 units', ok: false }] },
        { b: 'Wave 2: One segment sprouts into how many sub-segments per Koch iteration?', ch: [{ id: 'a', label: '4 sub-segments (of length 1/3)', ok: true }, { id: 'b', label: '2 sub-segments', ok: false }, { id: 'c', label: '3 sub-segments', ok: false }] },
        { b: 'Wave 3: Koch Snowflake at n=2 has Perimeter = 3 × (4/3)² = ?', ch: [{ id: 'a', label: '16/3 units (5.33)', ok: true }, { id: 'b', label: '8/3 units', ok: false }, { id: 'c', label: '12 units', ok: false }] },
        { b: 'Wave 4: As n → ∞, Koch Snowflake perimeter & area do what?', ch: [{ id: 'a', label: 'Perimeter → ∞ while Area stays Finite!', ok: true }, { id: 'b', label: 'Both shrink to 0', ok: false }, { id: 'c', label: 'Area → ∞ while Perimeter stays 3', ok: false }] },
      ];
      const k = koch[wIdx % koch.length];
      return { banner: k.b, prompt: 'Iterate recursive frost-crystal pocket barrier!', choices: k.ch, okMsg: 'Fireballs trapped inside fractal pocket!', errMsg: 'Ice core scorched by fireball!' };
    }
    if (id === 'p2-mod-4-6') {
      const iso = [
        { b: 'Gap Ahead: Place Isometric Cube Step along 30° North-East axis!', ch: [{ id: 'a', label: 'Snap 30° NE Isometric Cube ✓', ok: true }, { id: 'b', label: 'Place Flat 90° Perspective Block', ok: false }, { id: 'c', label: 'Leave Open Chasm', ok: false }] },
        { b: 'Three axes meet at what equal angles around an Isometric vertex?', ch: [{ id: 'a', label: '120° apart evenly', ok: true }, { id: 'b', label: '90° + 45° + 45°', ok: false }, { id: 'c', label: '60° + 150° + 150°', ok: false }] },
        { b: 'Bridge Staircase: Courier needs +1 Elevation Vertical Axis step!', ch: [{ id: 'a', label: 'Lift Step Along Vertical 90° Axis ✓', ok: true }, { id: 'b', label: 'Drop -2 Steps Down', ok: false }, { id: 'c', label: 'Twist 45° Skew', ok: false }] },
        { b: 'Final Optical Stair: Connect Left-30° + Vertical-90° to Exit Flag!', ch: [{ id: 'a', label: 'Weld Isometric Corner Stairs ✓', ok: true }, { id: 'b', label: 'Break Corner Step', ok: false }, { id: 'c', label: 'Place Hollow Frame', ok: false }] },
      ];
      const is = iso[wIdx % iso.length];
      return { banner: is.b, prompt: 'Snap isometric dot-grid bridge block for the courier!', choices: is.ch, okMsg: 'Courier walked safely across Escher bridge!', errMsg: 'Courier stepped into optical gap!' };
    }
    if (id === 'p2-mod-4-7') {
      const slices = [
        { b: 'Flying Solid: CUBOID — Target Cut: SQUARE Face!', ch: [{ id: 'a', label: 'Slice Parallel to Square Base ✓', ok: true }, { id: 'b', label: 'Slice Shallow Grazing Corner (Triangle)', ok: false }, { id: 'c', label: 'Slice Long Diagonal Strip', ok: false }] },
        { b: 'Flying Solid: RIGHT CYLINDER — Target Cut: ELLIPSE (Oval)!', ch: [{ id: 'a', label: 'Slash at Oblique 45° Tilt ✓', ok: true }, { id: 'b', label: 'Slash Flat 0° Horizontal (Circle)', ok: false }, { id: 'c', label: 'Slash Vertical 90° (Rectangle)', ok: false }] },
        { b: 'Flying Solid: CONE — Target Cut: TRIANGLE through Apex!', ch: [{ id: 'a', label: 'Slice Vertically Straight Through Apex ✓', ok: true }, { id: 'b', label: 'Slice Horizontal Parallel to Base (Circle)', ok: false }, { id: 'c', label: 'Slice Slanted Side-to-Side', ok: false }] },
        { b: 'Flying Solid: CUBE — Target Cut: REGULAR HEXAGON!', ch: [{ id: 'a', label: 'Slice Diagonal Across 6 Mid-Edges ✓', ok: true }, { id: 'b', label: 'Slice Flat Parallel to Top (Square)', ok: false }, { id: 'c', label: 'Slice Corner Tip (Triangle)', ok: false }] },
        { b: 'Flying Solid: SPHERE — Target Cut: ALWAYS WHAT SHAPE?', ch: [{ id: 'a', label: 'Any Plane Cut → CIRCLE ✓', ok: true }, { id: 'b', label: 'Tilted Cut → Ellipse', ok: false }, { id: 'c', label: 'Center Cut → Square', ok: false }] },
      ];
      const sl = slices[wIdx % slices.length];
      return { banner: sl.b, prompt: 'Aim blade cutting angle & SLASH flying 3D solid!', choices: sl.ch, okMsg: 'Clean cross-section dojo slice!', errMsg: 'Wrong blade angle produced wrong 2D face!' };
    }
    if (id === 'p2-mod-5-1') {
      const winds = [
        { b: 'Practice Dots clustered at [−3, −3, −2, −4] left of 0. Aim Correction?', ch: [{ id: 'a', label: 'Aim +3 Units Right!', ok: true }, { id: 'b', label: 'Aim −3 Units Left', ok: false }, { id: 'c', label: 'Aim 0 Straight', ok: false }] },
        { b: 'Gust shifted cluster to [+4, +5, +5, +6]. Dial Wind Offset!', ch: [{ id: 'a', label: 'Aim −5 Units Left!', ok: true }, { id: 'b', label: 'Aim +5 Units Right', ok: false }, { id: 'c', label: 'Aim −1 Unit Left', ok: false }] },
        { b: 'Bulls-eye Streak: Dots at [+2, +2, +3, +1]. Median Wind Shift?', ch: [{ id: 'a', label: 'Compensate −2 Units Left!', ok: true }, { id: 'b', label: 'Compensate +2 Right', ok: false }, { id: 'c', label: 'Compensate −6 Left', ok: false }] },
        { b: 'Crosswind Gap: [−4, −4, −4, −4] zero spread! Compensate:', ch: [{ id: 'a', label: 'Aim +4 Right for Bullseye!', ok: true }, { id: 'b', label: 'Aim −4 Left', ok: false }, { id: 'c', label: 'Aim +1 Right', ok: false }] },
      ];
      const w = winds[wIdx % winds.length];
      return { banner: w.b, prompt: 'Read dot-plot cluster drift and loose compensated arrow!', choices: w.ch, okMsg: 'BULLSEYE! Compensated wind drift cleanly!', errMsg: 'Arrow drifted wide in crosswind!' };
    }
    if (id === 'p2-mod-5-5') {
      const storm = [
        { b: 'Telemetry Trend: 1008 mb (hr 1) → 1002 mb (hr 2) → 996 mb (hr 3). Next pin?', ch: [{ id: 'a', label: 'Pin Hour 4 at 990 mb', ok: true }, { id: 'b', label: 'Pin Hour 4 at 1010 mb', ok: false }, { id: 'c', label: 'Pin Hour 4 at 996 mb', ok: false }] },
        { b: 'Storm Track: Lat 12°N (t=2), 14°N (t=4), 16°N (t=6). Plot Landfall at t=8!', ch: [{ id: 'a', label: 'Evacuate 18°N Coast (t=8)', ok: true }, { id: 'b', label: 'Evacuate 15°N', ok: false }, { id: 'c', label: 'Evacuate 22°N', ok: false }] },
        { b: 'Wind Surge: 60 km/h (2pm) → 85 km/h (3pm) → 110 km/h (4pm). Forecast 5pm?', ch: [{ id: 'a', label: 'Plot 135 km/h Category Peak', ok: true }, { id: 'b', label: 'Plot 115 km/h', ok: false }, { id: 'c', label: 'Plot 75 km/h', ok: false }] },
        { b: 'Eye Wall Stabilizing: 985 → 985 → 985 mb steady trend line:', ch: [{ id: 'a', label: 'Flat Zero-Slope Pin (985 mb)', ok: true }, { id: 'b', label: 'Steep Drop to 940 mb', ok: false }, { id: 'c', label: 'Jump to 1020 mb', ok: false }] },
      ];
      const s = storm[wIdx % storm.length];
      return { banner: s.b, prompt: 'Pin incoming telemetry coordinates onto hurricane map!', choices: s.ch, okMsg: 'Coastal towns warned accurately!', errMsg: 'Misplotted trajectory missed storm landfall!' };
    }
    // p2-mod-7-5: Asteroid Claim Surveyor
    const zones = [
      { b: 'Partition Pentagon: Split into Triangle (b=8,h=5) + Rectangle (8×6). Total Zone?', ch: [{ id: 'a', label: '20 + 48 = 68 km² Claim', ok: true }, { id: 'b', label: '40 + 48 = 88 km²', ok: false }, { id: 'c', label: '64 km²', ok: false }] },
      { b: 'Asteroid Wedge: Triangle (10×6/2) + Trapezium ½(6+10)×4. Claim Total?', ch: [{ id: 'a', label: '30 + 32 = 62 km² Claim', ok: true }, { id: 'b', label: '60 + 32 = 92 km²', ok: false }, { id: 'c', label: '50 km²', ok: false }] },
      { b: 'Minimum diagonals from 1 vertex to triangulate an n=7 sided polygon?', ch: [{ id: 'a', label: '4 Diagonals → 5 Triangles', ok: true }, { id: 'b', label: '7 Diagonals', ok: false }, { id: 'c', label: '2 Diagonals', ok: false }] },
      { b: 'Dual Triangle Sector: ½×12×4 + ½×12×6 = ?', ch: [{ id: 'a', label: '24 + 36 = 60 km² Claim', ok: true }, { id: 'b', label: '48 + 72 = 120 km²', ok: false }, { id: 'c', label: '48 km²', ok: false }] },
    ];
    const z = zones[wIdx % zones.length];
    return { banner: z.b, prompt: 'Fire diagonal chord to claim composite rock zone!', choices: z.ch, okMsg: 'Asteroid mining sector staked ahead of rivals!', errMsg: 'Rivals claimed zone while chord calculation missed!' };
  };

  const lSpec = getLaserStage();

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-[#0F3828] border border-teal-400/40 text-center space-y-1.5">
        <div className="text-xs font-black uppercase text-amber-300 flex items-center justify-center gap-1.5">
          <Compass className="w-4 h-4" /> Geometric Action Wave {runtime.wave}
        </div>
        <div className="text-lg font-black text-white">{formatMathText(lSpec.banner)}</div>
        <p className="text-xs text-teal-100">{formatMathText(lSpec.prompt)}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {lSpec.choices.map((ch) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => {
              if (ch.ok) {
                runtime.awardHit(180, lSpec.okMsg, true);
              } else {
                runtime.loseLife(lSpec.errMsg);
              }
            }}
            className="p-4 rounded-2xl bg-[#082218] hover:bg-[#124532] border-2 border-teal-400/60 text-white font-black text-sm flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{formatMathText(ch.label)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
