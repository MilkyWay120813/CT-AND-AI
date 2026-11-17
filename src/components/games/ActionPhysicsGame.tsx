import React, { useState, useEffect } from 'react';
import { Rocket, Crosshair, Zap, Flame, Activity, Compass } from 'lucide-react';
import type { Custom98GameSpec } from '../../data/custom98Games';
import type { ArcadeRuntimeContext } from './ArcadeShell';
import { formatMathText } from '../../utils/formatMath';

interface ActionPhysicsGameProps {
  spec: Custom98GameSpec;
  runtime: ArcadeRuntimeContext;
}

export const ActionPhysicsGame: React.FC<ActionPhysicsGameProps> = ({ spec, runtime }) => {
  const id = spec.moduleId;
  const wIdx = runtime.wave - 1;

  // =========================================================================
  // 1. ARTILLERY BOMBARDMENT (mod-1-7): Bracket Irrational √N Trajectory
  // =========================================================================
  const [cannonDial, setCannonDial] = useState<number>(7.0);
  const [shotsLeft, setShotsLeft] = useState<number>(3);
  useEffect(() => {
    setCannonDial(5.0);
    setShotsLeft(3);
  }, [wIdx, runtime.resetTrigger]);

  if (id === 'mod-1-7') {
    const targets = [
      { n: 50, root: Math.sqrt(50), bounds: [7, 8] },
      { n: 85, root: Math.sqrt(85), bounds: [9, 10] },
      { n: 30, root: Math.sqrt(30), bounds: [5, 6] },
      { n: 110, root: Math.sqrt(110), bounds: [10, 11] },
    ];
    const cur = targets[wIdx % targets.length];
    const diff = cannonDial - cur.root;

    const fireCannon = () => {
      if (Math.abs(diff) <= 0.25) {
        runtime.awardHit(
          200,
          `DIRECT HIT! √${cur.n} ≈ ${cur.root.toFixed(2)} (Shell landed at ${cannonDial.toFixed(1)})`,
          true
        );
      } else if (shotsLeft <= 1) {
        runtime.loseLife(`Bunker survived! √${cur.n} ≈ ${cur.root.toFixed(2)} (Between ${cur.bounds[0]} and ${cur.bounds[1]}).`);
        setShotsLeft(3);
      } else {
        setShotsLeft((s) => s - 1);
        runtime.setFeedback(
          diff < 0
            ? `📉 ${cannonDial.toFixed(1)}² = ${(cannonDial * cannonDial).toFixed(1)} < ${cur.n}! Aim HIGHER! (${shotsLeft - 1} shots left)`
            : `📈 ${cannonDial.toFixed(1)}² = ${(cannonDial * cannonDial).toFixed(1)} > ${cur.n}! Aim LOWER! (${shotsLeft - 1} shots left)`
        );
      }
    };

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-rose-400/40 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase text-amber-300">
              Enemy Bunker Distance: √{cur.n} km
            </div>
            <p className="text-xs text-teal-100 mt-0.5">
              Dial decimal trajectory within ±0.25 km in {shotsLeft} shots!
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-700 text-white text-xs font-black">
            Ammo: {shotsLeft}/3 Shells
          </div>
        </div>

        {/* Visual Horizon Trajectory Strip */}
        <div className="p-4 rounded-2xl bg-[#051811] border border-teal-500/30 space-y-3">
          <div className="relative h-14 rounded-xl bg-[#082218] border border-white/10 flex items-center px-4">
            <div className="text-lg">🪖</div>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"
              style={{ left: `${Math.min(90, Math.max(10, (cannonDial / 12) * 85))}%` }}
              title="Aim Marker"
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 text-lg"
              style={{ left: `${Math.min(90, Math.max(10, (cur.root / 12) * 85))}%` }}
              title="Enemy Bunker"
            >
              🏰
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-teal-200">
              <span>Trajectory Range Dial: {cannonDial.toFixed(1)} km</span>
              <span>{cannonDial.toFixed(1)}² = {(cannonDial * cannonDial).toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={2}
              max={12}
              step={0.1}
              value={cannonDial}
              onChange={(e) => setCannonDial(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={fireCannon}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm cursor-pointer shadow"
          >
            <Crosshair className="w-4 h-4" />
            <span>FIRE ARTILLERY ({cannonDial.toFixed(1)} km)</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. TEMPLE TRAP TOMB RAIDER (mod-3-2): Ascending Roman/Egyptian Stepping Slabs
  // =========================================================================
  const [steppedSlabs, setSteppedSlabs] = useState<number[]>([]);
  useEffect(() => {
    setSteppedSlabs([]);
  }, [wIdx, runtime.resetTrigger]);

  if (id === 'mod-3-2') {
    const slabCourses = [
      [{ label: 'XLII (Roman)', val: 42 }, { label: 'XIX (Roman)', val: 19 }, { label: 'LX (Roman)', val: 60 }, { label: 'XXIV (Roman)', val: 24 }],
      [{ label: '𓏺𓏺𓏺 (3)', val: 3 }, { label: '𓎆𓎆 (20)', val: 20 }, { label: 'XIV (14)', val: 14 }, { label: 'XC (90)', val: 90 }],
      [{ label: 'CD (400)', val: 400 }, { label: 'LXXV (75)', val: 75 }, { label: 'CX (110)', val: 110 }, { label: 'XXXIX (39)', val: 39 }],
      [{ label: 'MCM', val: 1900 }, { label: 'DCCC', val: 800 }, { label: 'CCXL', val: 240 }, { label: 'CM', val: 900 }],
    ];
    const slabs = slabCourses[wIdx % slabCourses.length];
    const sortedVals = [...slabs].map((s) => s.val).sort((a, b) => a - b);
    const nextExpected = sortedVals[steppedSlabs.length];

    const stepSlab = (val: number) => {
      if (steppedSlabs.includes(val)) return;
      if (val === nextExpected) {
        const next = [...steppedSlabs, val];
        setSteppedSlabs(next);
        if (next.length === slabs.length) {
          runtime.awardHit(180, 'Outran the rolling boulder across all ancient slabs!', true);
        } else {
          runtime.setFeedback(`Good leap onto ${val}! Find the next larger slab!`);
        }
      } else {
        runtime.loseLife(`Trap triggered! ${val} is not next smallest (Expected ${nextExpected}).`);
      }
    };

    return (
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0F3828] border border-amber-400/40 text-center">
          <div className="text-xs font-black uppercase text-amber-300">
            Rolling Boulder Pursuit! ({steppedSlabs.length}/4 Slabs Cleared)
          </div>
          <p className="text-xs text-teal-100 mt-1">
            Step strictly from SMALLEST to LARGEST numerical value to open the temple exit!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {slabs.map((slab) => {
            const done = steppedSlabs.includes(slab.val);
            return (
              <button
                key={slab.label}
                type="button"
                disabled={done}
                onClick={() => stepSlab(slab.val)}
                className={`p-5 rounded-2xl border-2 text-center font-black transition cursor-pointer ${
                  done
                    ? 'bg-emerald-700 border-emerald-300 text-white'
                    : 'bg-[#082218] hover:bg-[#124532] border-amber-400/60 text-amber-200'
                }`}
              >
                <div className="text-lg sm:text-xl">{slab.label}</div>
                <div className="text-[10px] mt-1 text-teal-300">
                  {done ? `Cleared (${slab.val}) ✓` : 'Click to Step'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. FAST-REACTION RUNNER / RESCUE / SLALOM / DISPATCH MODULES
  // Covers mod-2-1, mod-2-4, mod-2-5, mod-4-2, mod-4-7, mod-5-5, mod-7-5,
  // p2-mod-1-6, p2-mod-2-3, p2-mod-2-4, p2-mod-2-7, p2-mod-3-7, p2-mod-5-4, p2-mod-5-6
  // =========================================================================
  const [sliderVal, setSliderVal] = useState<number>(5);
  useEffect(() => {
    setSliderVal(5);
  }, [wIdx, id, runtime.resetTrigger]);

  interface ActionStage {
    banner: string;
    prompt: string;
    mode: 'choices' | 'slider';
    choices?: { id: string; label: string; isCorrect: boolean }[];
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    checkSlider?: (v: number) => boolean;
    successText: string;
    failText: string;
  }

  const getStage = (): ActionStage => {
    if (id === 'mod-2-1') {
      const waves = [
        { pond: 'Day 4: 2⁴ Lilypads bloom!', choices: [{ id: 'a', label: 'Harvest 16 Pads', isCorrect: true }, { id: 'b', label: 'Harvest 8 Pads', isCorrect: false }, { id: 'c', label: 'Harvest 32 Pads', isCorrect: false }, { id: 'd', label: 'Harvest 64 Pads', isCorrect: false }], ans: 16 },
        { pond: 'Day 6: 2⁶ Lilypads choke East bank!', choices: [{ id: 'a', label: 'Harvest 32 Pads', isCorrect: false }, { id: 'b', label: 'Harvest 64 Pads', isCorrect: true }, { id: 'c', label: 'Harvest 12 Pads', isCorrect: false }, { id: 'd', label: 'Harvest 128 Pads', isCorrect: false }], ans: 64 },
        { pond: 'Pond Half-Full (50%) on Day 29!', choices: [{ id: 'a', label: 'Chokes Day 30 (Next Day!)', isCorrect: true }, { id: 'b', label: 'Chokes Day 58', isCorrect: false }, { id: 'c', label: 'Chokes Day 45', isCorrect: false }, { id: 'd', label: 'Chokes Day 60', isCorrect: false }], ans: 30 },
        { pond: 'Day 8: 2⁸ Lilypad Surge!', choices: [{ id: 'a', label: 'Harvest 128', isCorrect: false }, { id: 'b', label: 'Harvest 256', isCorrect: true }, { id: 'c', label: 'Harvest 512', isCorrect: false }, { id: 'd', label: 'Harvest 64', isCorrect: false }], ans: 256 },
        { pond: 'Day 10: 2¹⁰ Massive Bloom!', choices: [{ id: 'a', label: 'Harvest 1000', isCorrect: false }, { id: 'b', label: 'Harvest 1024', isCorrect: true }, { id: 'c', label: 'Harvest 512', isCorrect: false }, { id: 'd', label: 'Harvest 2048', isCorrect: false }], ans: 1024 },
      ];
      const w = waves[wIdx % waves.length];
      return {
        banner: w.pond,
        prompt: 'Leap your frog onto the matching exponential lilypad cluster!',
        mode: 'choices',
        choices: w.choices,
        successText: `Frog harvested exponential cluster cleanly!`,
        failText: `Wrong stone! Frog splashed into the doubling pond!`,
      };
    }

    if (id === 'mod-2-4') {
      const gaps = [
        { block: 'Trap Ceiling: 2⁻³', choices: [{ id: 'a', label: 'Flip → 1/8 Floor Bridge', isCorrect: true }, { id: 'b', label: 'Flip → −8 Trap', isCorrect: false }, { id: 'c', label: 'Flip → −6 Trap', isCorrect: false }, { id: 'd', label: 'Flip → 1/6 Bridge', isCorrect: false }] },
        { block: 'Trap Ceiling: 5⁻²', choices: [{ id: 'a', label: 'Flip → −25 Spike', isCorrect: false }, { id: 'b', label: 'Flip → 1/25 Floor Bridge', isCorrect: true }, { id: 'c', label: 'Flip → 1/10 Bridge', isCorrect: false }, { id: 'd', label: 'Flip → 25 Bridge', isCorrect: false }] },
        { block: 'Trap Ceiling: (1/3)⁻²', choices: [{ id: 'a', label: 'Flip → 1/9 Trap', isCorrect: false }, { id: 'b', label: 'Flip → 9 Solid Bridge', isCorrect: true }, { id: 'c', label: 'Flip → −6 Trap', isCorrect: false }, { id: 'd', label: 'Flip → 6 Bridge', isCorrect: false }] },
        { block: 'Trap Ceiling: 10⁻³', choices: [{ id: 'a', label: 'Flip → 0.001 Platform', isCorrect: true }, { id: 'b', label: 'Flip → −1000 Pit', isCorrect: false }, { id: 'c', label: 'Flip → 0.01 Platform', isCorrect: false }, { id: 'd', label: 'Flip → −30 Spike', isCorrect: false }] },
      ];
      const g = gaps[wIdx % gaps.length];
      return {
        banner: g.block,
        prompt: 'Shoot polarity beam to flip negative exponent into a safe floor bridge!',
        mode: 'choices',
        choices: g.choices,
        successText: 'Polarity flipped! Runner dashed cleanly across!',
        failText: 'Wrong polarity flip—runner fell into cyber pit!',
      };
    }

    if (id === 'mod-2-5') {
      const jumps = [
        { dist: 100000, label: 'Star Beacon: 100,000 ly ahead', exp: 5 },
        { dist: 10000000, label: 'Nebula Gate: 10,000,000 ly ahead', exp: 7 },
        { dist: 1000, label: 'Solar Outpost: 1,000 ly ahead', exp: 3 },
        { dist: 1000000000, label: 'Andromeda Rim: 1,000,000,000 ly ahead', exp: 9 },
        { dist: 10000, label: 'Pulsar Buoy: 10,000 ly ahead', exp: 4 },
      ];
      const j = jumps[wIdx % jumps.length];
      return {
        banner: j.label,
        prompt: 'Set exact 10ⁿ Warp Exponent to land on the beacon before black hole pulls you in!',
        mode: 'slider',
        min: 1,
        max: 12,
        step: 1,
        unit: '10^n',
        checkSlider: (v) => v === j.exp,
        successText: `Warp jump 10^${j.exp} docked safely at star beacon!`,
        failText: `Overshot or fell short! Target jump was 10^${j.exp}!`,
      };
    }

    if (id === 'mod-4-2') {
      const gates = [
        { tunnel: 'Narrow Kite Tunnel: Crossbars at 90°, unequal diagonals 8m & 6m', choices: [{ id: 'a', label: 'Kite Crossbar Mode ✓', isCorrect: true }, { id: 'b', label: 'Trapezium Base Mode', isCorrect: false }, { id: 'c', label: 'Square Rigid Mode', isCorrect: false }] },
        { tunnel: 'Flat Wind Shelf: Only ONE pair of parallel sides (Top & Bottom)', choices: [{ id: 'a', label: 'Kite Crossbar Mode', isCorrect: false }, { id: 'b', label: 'Trapezium Wing Mode ✓', isCorrect: true }, { id: 'c', label: 'Rhombus Equal Mode', isCorrect: false }] },
        { tunnel: 'Symmetric Trapezium Gust: Equal non-parallel slanted sides', choices: [{ id: 'a', label: 'Isosceles Trapezium Rig ✓', isCorrect: true }, { id: 'b', label: 'Random Scalene Quad', isCorrect: false }, { id: 'c', label: 'Right-Angle Box', isCorrect: false }] },
        { tunnel: 'Equal-Diagonal Kite Boost: Diags ⊥ and d₁=d₂, 2 pairs adjacent equal', choices: [{ id: 'a', label: 'Diamond/Square Kite Mode ✓', isCorrect: true }, { id: 'b', label: 'Oblique Trapezium', isCorrect: false }, { id: 'c', label: 'Long Parallelogram', isCorrect: false }] },
      ];
      const g = gates[wIdx % gates.length];
      return {
        banner: g.tunnel,
        prompt: 'Morph kite wing & crossbar rig mid-flight to thread the storm tunnel!',
        mode: 'choices',
        choices: g.choices,
        successText: 'Kite glided smoothly past lightning bolts!',
        failText: 'Storm shear tore kite sail!',
      };
    }

    if (id === 'mod-4-7') {
      const shields = [
        { gate: 'Gate Condition: Exactly 1 pair of opposite sides parallel', right: 'Trapezium' },
        { gate: 'Gate Condition: All 4 sides equal, angles NOT 90°', right: 'Rhombus' },
        { gate: 'Gate Condition: Diagonals equal & 4 right angles, adjacent sides unequal', right: 'Rectangle' },
        { gate: 'Gate Condition: All 4 sides equal AND 4 right angles', right: 'Square' },
        { gate: 'Gate Condition: Opposite sides parallel & equal, diagonals bisect unevenly', right: 'Parallelogram' },
      ];
      const sh = shields[wIdx % shields.length];
      return {
        banner: sh.gate,
        prompt: 'Morph your running bot into the exact qualifying quadrilateral!',
        mode: 'choices',
        choices: [
          sh.right,
          ...['Trapezium', 'Rhombus', 'Rectangle', 'Square', 'Parallelogram'].filter(
            (s) => s !== sh.right
          ).slice(0, 3),
        ]
          .sort()
          .map((name, i) => ({
            id: `sh-${i}`,
            label: name,
            isCorrect: name === sh.right,
          })),
        successText: `Bot morphed into ${sh.right} and cleared barrier!`,
        failText: `Forcefield collision! Gate required ${sh.right}!`,
      };
    }

    if (id === 'mod-5-5') {
      const barriers = [
        { barrier: 'Crystal Lock: Mirror 3-digit difference 954 − 459 + reverse = ?', ans: '1089' },
        { barrier: 'Crystal Lock: Mirror digits [7, 2] into 3-digit palindrome starting with 7', ans: '727' },
        { barrier: 'Crystal Lock: Mirror [4, 9] into 4-digit symmetric palindrome', ans: '4994' },
        { barrier: 'Crystal Lock: Smallest 3-digit palindrome after 191', ans: '202' },
        { barrier: 'Crystal Lock: Reverse of 813 added? Wait mirror [6, 5] → 4-digit', ans: '6556' },
      ];
      const b = barriers[wIdx % barriers.length];
      const pool = ['1089', '727', '4994', '202', '6556', '990', '772', '4949'];
      const opts = [b.ans, ...pool.filter((x) => x !== b.ans).slice(0, 3)].sort();
      return {
        banner: b.barrier,
        prompt: 'Flip mirror digit card to shatter the crystal track barrier!',
        mode: 'choices',
        choices: opts.map((o, i) => ({ id: `p-${i}`, label: o, isCorrect: o === b.ans })),
        successText: `Crystal barrier shattered at mirror ${b.ans}!`,
        failText: `Barrier deflected shot! Target palindrome was ${b.ans}.`,
      };
    }

    if (id === 'mod-7-5') {
      const trains = [
        { dist: 240, hours: 3, targetSpeed: 80 },
        { dist: 360, hours: 4, targetSpeed: 90 },
        { dist: 300, hours: 5, targetSpeed: 60 },
        { dist: 440, hours: 4, targetSpeed: 110 },
      ];
      const t = trains[wIdx % trains.length];
      return {
        banner: `Express Route: ${t.dist} km · Station Window in ${t.hours} hours`,
        prompt: 'Set constant train throttle speed (Distance ÷ Time) to hit station window!',
        mode: 'slider',
        min: 40,
        max: 140,
        step: 10,
        unit: 'km/h',
        checkSlider: (v) => v === t.targetSpeed,
        successText: `Express docked on schedule at ${t.targetSpeed} km/h!`,
        failText: `Missed station window! Required speed = ${t.dist} ÷ ${t.hours} = ${t.targetSpeed} km/h!`,
      };
    }

    if (id === 'p2-mod-1-6') {
      const slopes = [
        { start: 100, target: 132, rightLabel: 'Pass +10% Gate then +20% Gate (132 kg)' },
        { start: 100, target: 144, rightLabel: 'Pass +20% Gate then +20% Gate (144 kg)' },
        { start: 100, target: 121, rightLabel: 'Pass +10% Gate then +10% Gate (121 kg)' },
        { start: 100, target: 150, rightLabel: 'Pass +25% Gate then +20% Gate (150 kg)' },
      ];
      const sl = slopes[wIdx % slopes.length];
      return {
        banner: `Ice Wall Threshold: ≥ ${sl.target} kg (Starting Snowball: ${sl.start} kg)`,
        prompt: 'Steer into the compounding percentage gate path that reaches the exact smash mass!',
        mode: 'choices',
        choices: [
          { id: 'right', label: sl.rightLabel, isCorrect: true },
          { id: 'w1', label: `Pass +30% then −20% Gate (${Math.round(sl.start * 1.3 * 0.8)} kg)`, isCorrect: false },
          { id: 'w2', label: `Pass +10% then −10% Gate (99 kg)`, isCorrect: false },
        ],
        successText: `Avalanche smashed through the ${sl.target} kg ice wall!`,
        failText: `Snowball bounced off the ice wall—check your compound multipliers!`,
      };
    }

    if (id === 'p2-mod-2-3') {
      const gorges = [
        { a: 6, b: 8, c: 10 },
        { a: 5, b: 12, c: 13 },
        { a: 8, b: 15, c: 17 },
        { a: 9, b: 12, c: 15 },
      ];
      const g = gorges[wIdx % gorges.length];
      return {
        banner: `Canyon Drop: Vertical = ${g.a} m · Horizontal Gorge = ${g.b} m`,
        prompt: 'Dial exact Zipline Cable Length c = √(a² + b²) and fire grappler!',
        mode: 'slider',
        min: 5,
        max: 25,
        step: 1,
        unit: 'm',
        checkSlider: (v) => v === g.c,
        successText: `Zipline anchored cleanly at ${g.c} m! Hiker rescued!`,
        failText: `Cable snapped! Correct hypotenuse = √(${g.a}² + ${g.b}²) = ${g.c} m!`,
      };
    }

    if (id === 'p2-mod-2-4') {
      const fires = [
        { ladder: 13, floorHeight: 12, streetOffset: 5 },
        { ladder: 10, floorHeight: 8, streetOffset: 6 },
        { ladder: 17, floorHeight: 15, streetOffset: 8 },
        { ladder: 25, floorHeight: 24, streetOffset: 7 },
      ];
      const f = fires[wIdx % fires.length];
      return {
        banner: `Fixed Ladder L = ${f.ladder} m · Trapped Window Height = ${f.floorHeight} m`,
        prompt: 'Park firetruck at exact street offset b = √(L² − a²)!',
        mode: 'slider',
        min: 3,
        max: 15,
        step: 1,
        unit: 'm',
        checkSlider: (v) => v === f.streetOffset,
        successText: `Ladder locked at window from ${f.streetOffset} m street offset!`,
        failText: `Ladder missed window! Offset = √(${f.ladder}² − ${f.floorHeight}²) = ${f.streetOffset} m!`,
      };
    }

    if (id === 'p2-mod-2-7') {
      const runs = [
        { label: 'Courtyard: 12 m × 16 m Rectangle (vs Perimeter 28 m)', ans: 20 },
        { label: 'Warehouse: 6 m × 8 m + 24 m Diagonal? Check 3D 3×4×12 room!', ans: 13 },
        { label: 'Courtyard: 9 m × 12 m Zone (vs Perimeter 21 m)', ans: 15 },
        { label: 'Hangar 3D Cube Diagonal: 4 m × 4 m × 7 m -> √(16+16+49)', ans: 9 },
      ];
      const r = runs[wIdx % runs.length];
      return {
        banner: r.label,
        prompt: 'Dial diagonal shortcut flight distance before drone battery drains!',
        mode: 'slider',
        min: 5,
        max: 25,
        step: 1,
        unit: 'm',
        checkSlider: (v) => v === r.ans,
        successText: `Drone extracted on diagonal shortcut (${r.ans} m)!`,
        failText: `Battery depleted! True diagonal = ${r.ans} m!`,
      };
    }

    if (id === 'p2-mod-3-7') {
      const stages = [
        { grade: 'Steep 14% Alpine Climb (Need High Torque, Low Ratio)', ans: '34T Front / 34T Rear (1:1 Climb)' },
        { grade: 'Fast −8% Valley Descent (Need Max Wheel RPM)', ans: '50T Front / 12T Rear (4.17:1 Sprint)' },
        { grade: 'Rolling Flat 2% Tempo (Smooth Cadence)', ans: '50T Front / 20T Rear (2.5:1 Cruise)' },
        { grade: 'Summit Switchback 18% Wall!', ans: '30T Front / 36T Rear (0.83:1 Granny Gear)' },
      ];
      const st = stages[wIdx % stages.length];
      return {
        banner: st.grade,
        prompt: 'Shift bicycle chainring/sprocket ratio to maintain peak climbing cadence!',
        mode: 'choices',
        choices: [
          '34T Front / 34T Rear (1:1 Climb)',
          '50T Front / 12T Rear (4.17:1 Sprint)',
          '50T Front / 20T Rear (2.5:1 Cruise)',
          '30T Front / 36T Rear (0.83:1 Granny Gear)',
        ].map((lbl, i) => ({ id: `g-${i}`, label: lbl, isCorrect: lbl === st.ans })),
        successText: 'Chain shifted cleanly—cadence locked in green!',
        failText: `Chain slipped on wrong gear for "${st.grade}"!`,
      };
    }

    if (id === 'p2-mod-5-4') {
      const sonars = [
        { ping: 'Enemy Sub at −60 m rising at +15 m/min', minute: 4 },
        { ping: 'Enemy Sub at −90 m rising at +15 m/min', minute: 6 },
        { ping: 'Enemy Sub at −80 m rising at +10 m/min', minute: 8 },
        { ping: 'Enemy Sub at −100 m rising at +20 m/min', minute: 5 },
      ];
      const s = sonars[wIdx % sonars.length];
      return {
        banner: s.ping,
        prompt: 'Track line-graph slope to fire torpedo at the exact 0 m surfacing minute!',
        mode: 'slider',
        min: 1,
        max: 12,
        step: 1,
        unit: 'min',
        checkSlider: (v) => v === s.minute,
        successText: `TORPEDO HIT! Sub surfaced right at t = ${s.minute} min!`,
        failText: `Torpedo missed! Surfacing occurs at Minute ${s.minute}!`,
      };
    }

    // p2-mod-5-6: Street-Race Nitro Overtake
    const races = [
      { curve: 'Rival: d = 40 + 20t | Your Car: d = 30t', crossT: 4 },
      { curve: 'Rival: d = 60 + 15t | Your Car: d = 25t', crossT: 6 },
      { curve: 'Rival: d = 50 + 20t | Your Car: d = 30t', crossT: 5 },
      { curve: 'Rival: d = 90 + 10t | Your Car: d = 25t', crossT: 6 },
    ];
    const rc = races[wIdx % races.length];
    return {
      banner: rc.curve,
      prompt: 'Hit NITRO at the exact intersection hour t where both distance curves cross!',
      mode: 'slider',
      min: 1,
      max: 10,
      step: 1,
      unit: 'hr',
      checkSlider: (v) => v === rc.crossT,
      successText: `NITRO OVERTAKE at Hour ${rc.crossT}! Left rival in the dust!`,
      failText: `Misfired Nitro! Curves intersect at Hour ${rc.crossT}!`,
    };
  };

  const st = getStage();
  const clamped =
    st.mode === 'slider'
      ? Math.max(st.min ?? 1, Math.min(st.max ?? 12, sliderVal))
      : 0;

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-[#0F3828] border border-teal-400/40 text-center space-y-1.5">
        <div className="text-xs font-black uppercase text-amber-300 flex items-center justify-center gap-1.5">
          <Rocket className="w-4 h-4" /> Wave {runtime.wave} Action Telemetry
        </div>
        <div className="text-lg sm:text-xl font-black text-white">
          {formatMathText(st.banner)}
        </div>
        <p className="text-xs text-teal-100">{formatMathText(st.prompt)}</p>
      </div>

      {st.mode === 'choices' && st.choices ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {st.choices.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => {
                if (ch.isCorrect) {
                  runtime.awardHit(175, st.successText, true);
                } else {
                  runtime.loseLife(st.failText);
                }
              }}
              className="p-4 rounded-2xl bg-[#082218] hover:bg-[#124532] border-2 border-teal-400/60 text-white font-black text-sm flex items-center justify-between gap-2 transition cursor-pointer"
            >
              <span>{formatMathText(ch.label)}</span>
              <Zap className="w-4 h-4 text-amber-300 shrink-0" />
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4 bg-[#082218] p-5 rounded-2xl border border-white/15">
          <div className="flex justify-between text-xs font-bold text-teal-200">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-300" /> Action Gauge Setting
            </span>
            <span className="px-3 py-1 rounded-lg bg-amber-400 text-stone-950 font-black">
              {st.unit === '10^n' ? `10^${clamped}` : `${clamped} ${st.unit || ''}`}
            </span>
          </div>

          <input
            type="range"
            min={st.min ?? 1}
            max={st.max ?? 12}
            step={st.step ?? 1}
            value={clamped}
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />

          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() => {
                if (st.checkSlider && st.checkSlider(clamped)) {
                  runtime.awardHit(185, st.successText, true);
                } else {
                  runtime.loseLife(st.failText);
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm cursor-pointer shadow"
            >
              <Compass className="w-4 h-4" />
              <span>ENGAGE ACTION!</span>
              <Flame className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
