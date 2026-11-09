import React, { useState, useMemo } from 'react';
import { Sliders, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ChapterId } from '../types/math';

interface ChapterInteractiveLabProps {
  chapterId: ChapterId;
  segmentId: string;
  accentColor: string;
}

const LOCKER_COLORS = [
  '#2563EB',
  '#D97706',
  '#16A34A',
  '#9333EA',
  '#DC2626',
  '#0891B2',
  '#4F46E5',
  '#EA580C',
  '#0D9488',
  '#BE185D',
];

function toRoman(num: number): string {
  if (num <= 0) return 'N/A (No zero in Roman)';
  const map: [number, string][] = [
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
  let n = num;
  let res = '';
  for (const [val, sym] of map) {
    while (n >= val) {
      res += sym;
      n -= val;
    }
  }
  return res;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export const ChapterInteractiveLab: React.FC<ChapterInteractiveLabProps> = ({
  chapterId,
  segmentId,
  accentColor,
}) => {
  // ---------------- PART I · CHAPTER 1 STATE ----------------
  const [selectedLocker, setSelectedLocker] = useState<number>(16);
  const [oddGridN, setOddGridN] = useState<number>(5);

  // ---------------- PART I · CHAPTER 2 STATE ----------------
  const [paperFolds, setPaperFolds] = useState<number>(10);
  const [expBase, setExpBase] = useState<number>(3);
  const [expPower, setExpPower] = useState<number>(-2);

  // ---------------- PART I · CHAPTER 3 STATE ----------------
  const [ancientNum, setAncientNum] = useState<number>(143);

  // ---------------- PART I · CHAPTER 4 (QUADRILATERALS) STATE ----------------
  const [diag1, setDiag1] = useState<number>(10);
  const [diag2, setDiag2] = useState<number>(10);
  const [diagAngle, setDiagAngle] = useState<number>(90);

  // ---------------- PART I · CHAPTER 5 (NUMBER PLAY) STATE ----------------
  const [divNum, setDivNum] = useState<number>(42739);
  const [cryptoChoice, setCryptoChoice] = useState<'pq8' | 'efe' | 'on3'>('pq8');

  // ---------------- PART I · CHAPTER 6 (WE DISTRIBUTE) STATE ----------------
  const [distA, setDistA] = useState<number>(10);
  const [distM, setDistM] = useState<number>(4);
  const [distB, setDistB] = useState<number>(8);
  const [distN, setDistN] = useState<number>(3);
  const [sridharaNum, setSridharaNum] = useState<number>(98);

  // ---------------- PART I · CHAPTER 7 (PROPORTIONAL-1) STATE ----------------
  const [tigerW, setTigerW] = useState<number>(90);
  const [tigerH, setTigerH] = useState<number>(60);
  const [coffeeDecoction, setCoffeeDecoction] = useState<number>(24);

  // ---------------- PART II · CHAPTER 1 (FRACTIONS IN DISGUISE) STATE ----------------
  const [basePrice, setBasePrice] = useState<number>(100);
  const [firstPct, setFirstPct] = useState<number>(50);
  const [secondPct, setSecondPct] = useState<number>(50);
  const [trapMode, setTrapMode] = useState<'markup-discount' | 'double-discount'>(
    'markup-discount'
  );

  // ---------------- PART II · CHAPTER 2 (BAUDHAYANA-PYTHAGORAS) STATE ----------------
  const [pythMode, setPythMode] = useState<'squares' | 'lotus'>(
    segmentId.includes('lotus') ? 'lotus' : 'squares'
  );
  const [legA, setLegA] = useState<number>(6);
  const [legB, setLegB] = useState<number>(8);
  const [lotusH, setLotusH] = useState<number>(3);
  const [lotusD, setLotusD] = useState<number>(9);

  // ---------------- PART II · CHAPTER 3 (PROPORTIONAL-2) STATE ----------------
  const [ratioTotal, setRatioTotal] = useState<number>(360);
  const [r1, setR1] = useState<number>(8);
  const [r2, setR2] = useState<number>(4);
  const [r3, setR3] = useState<number>(2);
  const [r4, setR4] = useState<number>(1);

  // ---------------- PART II · CHAPTER 4 (GEOMETRIC THEMES) STATE ----------------
  const [fractalStep, setFractalStep] = useState<number>(2);
  const [antRoute, setAntRoute] = useState<'side-40' | 'roof-42'>('side-40');

  // ---------------- PART II · CHAPTER 5 (DOTS AND LINES) STATE ----------------
  const [wrestler6, setWrestler6] = useState<number>(59);

  // ---------------- PART II · CHAPTER 6 (ALGEBRA PLAY) STATE ----------------
  const [pyrA, setPyrA] = useState<number>(12);
  const [pyrB, setPyrB] = useState<number>(20);
  const [pyrC, setPyrC] = useState<number>(8);
  const [birthMonth, setBirthMonth] = useState<number>(1);
  const [birthDay, setBirthDay] = useState<number>(26);

  // ---------------- PART II · CHAPTER 7 (AREA) STATE ----------------
  const [slideProgress, setSlideProgress] = useState<number>(100);
  const [areaShapeMode, setAreaShapeMode] = useState<'parallelogram' | 'trapezium'>(
    'parallelogram'
  );

  // Chapter 1: Factor pairs of selectedLocker
  const lockerFactors = useMemo(() => {
    const pairs: [number, number][] = [];
    const allFactors: number[] = [];
    for (let i = 1; i <= Math.sqrt(selectedLocker); i++) {
      if (selectedLocker % i === 0) {
        const j = selectedLocker / i;
        pairs.push([i, j]);
        allFactors.push(i);
        if (i !== j) allFactors.push(j);
      }
    }
    allFactors.sort((a, b) => a - b);
    return { pairs, allFactors, isOpen: allFactors.length % 2 === 1 };
  }, [selectedLocker]);

  // Chapter 2: Paper fold thickness calculation
  const paperMetrics = useMemo(() => {
    const cm = 0.001 * Math.pow(2, paperFolds);
    const meters = cm / 100;
    const km = meters / 1000;
    let display = '';
    if (cm < 1) display = `${cm.toFixed(4)} cm`;
    else if (meters < 1) display = `${cm.toFixed(2)} cm`;
    else if (km < 1) display = `${meters.toFixed(2)} meters`;
    else display = `${km.toLocaleString(undefined, { maximumFractionDigits: 1 })} km`;

    let milestone = 'Thinner than a fingernail';
    if (cm >= 1 && meters < 1.5) milestone = 'Thickness of a textbook stack';
    else if (meters >= 1.5 && meters < 828) milestone = 'Taller than a human / building';
    else if (meters >= 828 && km < 8.848) milestone = 'Taller than Burj Khalifa (828 m)';
    else if (km >= 8.848 && km < 400) milestone = 'Higher than Mount Everest (8.85 km)';
    else if (km >= 400 && km < 384400) milestone = 'Past the International Space Station!';
    else if (km >= 384400) milestone = 'Reached the Moon (384,400 km) & beyond!';

    return { cm, meters, km, display, milestone };
  }, [paperFolds]);

  // Chapter 3: Base translations
  const ancientTranslations = useMemo(() => {
    const n = Math.max(0, Math.min(999, Math.round(ancientNum)));
    const b5_125 = Math.floor(n / 125);
    const b5_25 = Math.floor((n % 125) / 25);
    const b5_5 = Math.floor((n % 25) / 5);
    const b5_1 = n % 5;

    const bab_60 = Math.floor(n / 60);
    const bab_1 = n % 60;

    const may_400 = Math.floor(n / 400);
    const may_20 = Math.floor((n % 400) / 20);
    const may_1 = n % 20;

    const pairsCount = Math.floor(n / 2);
    const rem1 = n % 2;
    const gumulgalText =
      n === 0
        ? 'Zero'
        : n <= 8
        ? [
            ...Array(pairsCount).fill('ukasar (2)'),
            ...(rem1 ? ['urapun (1)'] : []),
          ].join(' + ')
        : `${pairsCount} × ukasar (2) ${rem1 ? '+ urapun (1)' : ''} [Binary: ${n.toString(2)}₂]`;

    return {
      n,
      base5Digits: `${b5_125}${b5_25}${b5_5}${b5_1}₅`,
      b5Breakdown: `${b5_125}×125 + ${b5_25}×25 + ${b5_5}×5 + ${b5_1}×1`,
      babylonian: `[ ${bab_60} ] sixties , [ ${bab_1} ] ones`,
      mayan: [
        ...(may_400 > 0 ? [`400s level: ${may_400}`] : []),
        `20s level: ${may_20} (${Math.floor(may_20 / 5)} bars, ${may_20 % 5} dots)`,
        `1s level: ${may_1 === 0 ? 'Seashell (0)' : `${may_1} (${Math.floor(may_1 / 5)} bars, ${may_1 % 5} dots)`}`,
      ],
      roman: toRoman(n),
      gumulgalText,
    };
  }, [ancientNum]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white border-2 border-[#E5DEC9] rounded-2xl overflow-hidden shadow-xs"
    >
      {/* Lab Top Bar */}
      <div className="px-5 py-3.5 bg-[#FAF6EE] border-b border-[#E5DEC9] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 12, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sliders className="w-4 h-4" style={{ color: accentColor }} />
          </motion.div>
          <span className="font-display font-bold text-sm text-[#18181B]">
            Chapter Hands-On Concept Simulator
          </span>
        </div>
        <span className="text-xs font-mono text-[#71717A] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
          Interactive Chalkboard Manipulative · Touch &amp; Slide to Explore
        </span>
      </div>

      {/* =====================================================================
          PART I · CHAPTER 1 LAB: A SQUARE AND A CUBE
         ===================================================================== */}
      {chapterId === 'ch1-square-cube' && (
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Queen Ratnamanjuri's 36 Lockers Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#18181B]">
                  1. Queen Ratnamanjuri’s Lockers (1–36)
                </h4>
                <span className="text-[11px] font-mono text-[#52525B]">
                  Click any locker to test its factors
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => {
                  const isSquare = Number.isInteger(Math.sqrt(num));
                  const isSelected = num === selectedLocker;
                  return (
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      key={num}
                      type="button"
                      onClick={() => setSelectedLocker(num)}
                      className={`py-2 rounded-lg font-mono text-xs font-bold transition-colors cursor-pointer border tabular-nums ${
                        isSelected
                          ? 'ring-2 ring-[#18181B] border-[#18181B]'
                          : 'border-[#E6E2D8]'
                      } ${
                        isSquare
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-[#FAF8F5] text-[#52525B] hover:bg-[#F2EFE9]'
                      }`}
                    >
                      {num}
                    </motion.button>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#18181B]">
                    Locker #{selectedLocker} ({lockerFactors.allFactors.length} factors)
                  </span>
                  <span
                    className={`font-bold ${
                      lockerFactors.isOpen ? 'text-[#2563EB]' : 'text-[#71717A]'
                    }`}
                  >
                    {lockerFactors.isOpen ? 'OPEN (Perfect Square!)' : 'CLOSED (Even Factors)'}
                  </span>
                </div>
                <p className="text-xs font-mono text-[#52525B]">
                  Factor Pairs:{' '}
                  {lockerFactors.pairs
                    .map(([a, b]) => (a === b ? `(${a}×${b}★)` : `(${a}×${b})`))
                    .join(' · ')}
                </p>
              </div>
            </div>

            {/* Right: Odd-Number L-Layers Builder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#18181B]">
                  2. Sum of First n Odd Numbers = n²
                </h4>
                <span className="font-mono text-xs font-bold text-[#2563EB] tabular-nums">
                  n = {oddGridN} → {oddGridN}² = {oddGridN * oddGridN}
                </span>
              </div>

              <input
                type="range"
                min={1}
                max={8}
                value={oddGridN}
                onChange={(e) => setOddGridN(Number(e.target.value))}
                className="w-full accent-[#2563EB] cursor-pointer"
              />

              <div className="flex items-center gap-4">
                <div
                  className="grid gap-1 p-2 bg-[#FAF8F5] rounded-xl border border-[#E6E2D8] shrink-0"
                  style={{
                    gridTemplateColumns: `repeat(${oddGridN}, minmax(0, 1fr))`,
                    width: '164px',
                    height: '164px',
                  }}
                >
                  {Array.from({ length: oddGridN * oddGridN }, (_, idx) => {
                    const r = Math.floor(idx / oddGridN);
                    const c = idx % oddGridN;
                    const layer = Math.max(r, c);
                    return (
                      <motion.div
                        key={`${oddGridN}-${idx}`}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: layer * 0.04 }}
                        className="rounded-xs"
                        style={{
                          backgroundColor: LOCKER_COLORS[layer % LOCKER_COLORS.length],
                        }}
                        title={`Layer ${layer + 1}: adds ${2 * layer + 1} tiles`}
                      />
                    );
                  })}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-mono text-[#18181B] font-semibold bg-[#F2EFE9] p-2.5 rounded-lg border border-[#E6E2D8] tabular-nums">
                    {Array.from({ length: oddGridN }, (_, i) => 2 * i + 1).join(' + ')} ={' '}
                    {oddGridN * oddGridN}
                  </div>
                  <p className="text-[#52525B] leading-relaxed">
                    Each colored L-layer adds the next odd number{' '}
                    <span className="font-mono font-semibold text-[#18181B]">
                      (2k - 1)
                    </span>{' '}
                    to complete the next Perfect Square!
                  </p>
                  <div className="pt-1 text-[11px] font-mono text-[#71717A]">
                    Taxicab Cube Bonus: 1729 = 12³ + 1³ = 10³ + 9³
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PART I · CHAPTER 2 LAB: POWER PLAY
         ===================================================================== */}
      {chapterId === 'ch2-power-play' && (
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#18181B]">
                  1. Paper Folding Simulator (t = 0.001 × 2ⁿ cm)
                </h4>
                <span className="font-mono text-xs font-bold text-[#D97706] tabular-nums">
                  {paperFolds} Folds
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={46}
                value={paperFolds}
                onChange={(e) => setPaperFolds(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-mono text-[#71717A]">
                    2^{paperFolds} = {Math.pow(2, paperFolds).toLocaleString()} layers
                  </span>
                  <span className="font-mono text-base font-bold text-[#18181B] tabular-nums">
                    {paperMetrics.display}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#D97706]">
                  Milestone: {paperMetrics.milestone}
                </div>
                <div className="flex gap-1.5 pt-1">
                  {[0, 10, 20, 30, 42, 46].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPaperFolds(preset)}
                      className={`px-2 py-1 rounded-md font-mono text-[11px] border cursor-pointer tabular-nums ${
                        paperFolds === preset
                          ? 'bg-[#D97706] text-white border-[#D97706]'
                          : 'bg-white text-[#52525B] border-[#E6E2D8]'
                      }`}
                    >
                      {preset}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#18181B]">
                  2. Why Negative Exponents Mean Division
                </h4>
                <span className="font-mono text-xs font-bold text-[#18181B] tabular-nums">
                  {expBase}^{expPower} ={' '}
                  {expPower >= 0
                    ? Math.pow(expBase, expPower)
                    : `1/${Math.pow(expBase, Math.abs(expPower))} (${(
                        1 / Math.pow(expBase, Math.abs(expPower))
                      ).toFixed(4)})`}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[11px] font-mono text-[#71717A] block">
                    Base b = {expBase}
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={10}
                    value={expBase}
                    onChange={(e) => setExpBase(Number(e.target.value))}
                    className="w-full accent-[#18181B] cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] font-mono text-[#71717A] block">
                    Exponent k = {expPower}
                  </label>
                  <input
                    type="range"
                    min={-3}
                    max={3}
                    value={expPower}
                    onChange={(e) => setExpPower(Number(e.target.value))}
                    className="w-full accent-[#D97706] cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 pt-1">
                {[-3, -2, -1, 0, 1, 2, 3].map((k) => {
                  const isCurr = k === expPower;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setExpPower(k)}
                      className={`p-1.5 rounded-lg border text-center font-mono cursor-pointer transition-all tabular-nums ${
                        isCurr
                          ? 'bg-[#18181B] text-white border-[#18181B]'
                          : 'bg-[#FAF8F5] text-[#52525B] border-[#E6E2D8]'
                      }`}
                    >
                      <div className="text-[10px] opacity-75">
                        {expBase}^{k}
                      </div>
                      <div className="text-[11px] font-bold mt-0.5">
                        {k >= 0 ? Math.pow(expBase, k) : `1/${Math.pow(expBase, -k)}`}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[#52525B]">
                Every step left divides by <strong className="font-mono">{expBase}</strong>: so{' '}
                <span className="font-mono font-semibold text-[#18181B]">
                  {expBase}⁰ = 1
                </span>{' '}
                and{' '}
                <span className="font-mono font-semibold text-[#18181B]">
                  {expBase}⁻ⁿ = 1/{expBase}ⁿ
                </span>{' '}
                (never negative!).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PART I · CHAPTER 3 LAB: A STORY OF NUMBERS
         ===================================================================== */}
      {chapterId === 'ch3-story-numbers' && (
        <div className="p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-display text-sm font-bold text-[#18181B]">
                Ancient Civilizations &amp; Base-n Live Number Translator
              </h4>
              <p className="text-xs text-[#52525B]">
                Slide or pick a number to see how different civilizations in Ganita Prakash Ch 3 wrote it.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={450}
                value={ancientNum}
                onChange={(e) => setAncientNum(Number(e.target.value))}
                className="w-40 accent-[#7C3AED] cursor-pointer"
              />
              <input
                type="number"
                min={0}
                max={999}
                value={ancientNum}
                onChange={(e) => setAncientNum(Number(e.target.value))}
                className="w-20 px-2.5 py-1.5 rounded-lg border border-[#E6E2D8] font-mono text-sm font-bold text-[#18181B] tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1">
              <div className="text-[11px] font-mono uppercase text-[#7C3AED] font-semibold">
                Indian Place Value (Base-10)
              </div>
              <div className="font-mono text-base font-bold text-[#18181B] tabular-nums">
                {ancientTranslations.n} = {Math.floor(ancientTranslations.n / 100)}×10² +{' '}
                {Math.floor((ancientTranslations.n % 100) / 10)}×10¹ +{' '}
                {ancientTranslations.n % 10}×10⁰
              </div>
              <p className="text-[11px] text-[#52525B]">
                Uses 0 as both placeholder &amp; number (Āryabhaṭa / Brahmagupta).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1">
              <div className="text-[11px] font-mono uppercase text-[#2563EB] font-semibold">
                Custom Base-5 System (Powers of 5)
              </div>
              <div className="font-mono text-base font-bold text-[#18181B] tabular-nums">
                {ancientTranslations.base5Digits}
              </div>
              <p className="text-[11px] font-mono text-[#52525B] tabular-nums">
                {ancientTranslations.b5Breakdown}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1">
              <div className="text-[11px] font-mono uppercase text-[#D97706] font-semibold">
                Babylonian Sexagesimal (Base-60)
              </div>
              <div className="font-mono text-sm font-bold text-[#18181B] tabular-nums">
                {ancientTranslations.babylonian}
              </div>
              <p className="text-[11px] font-mono text-[#52525B] tabular-nums">
                {Math.floor(ancientTranslations.n / 60)}×60 + {ancientTranslations.n % 60}×1
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1">
              <div className="text-[11px] font-mono uppercase text-[#16A34A] font-semibold">
                Mayan Vertical Base-20 (Bars=5, Dots=1)
              </div>
              <div className="font-mono text-xs font-bold text-[#18181B] space-y-0.5 tabular-nums">
                {ancientTranslations.mayan.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1">
              <div className="text-[11px] font-mono uppercase text-[#DC2626] font-semibold">
                Roman Landmark Numerals (Non-Positional)
              </div>
              <div className="font-mono text-base font-bold text-[#18181B]">
                {ancientTranslations.roman}
              </div>
              <p className="text-[11px] text-[#52525B]">
                Additive/subtractive landmarks (I, V, X, L, C, D, M)—no zero!
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-1">
              <div className="text-[11px] font-mono uppercase text-[#0891B2] font-semibold">
                Gumulgal Counting in 2s (Base-2 Origin)
              </div>
              <div className="font-mono text-xs font-bold text-[#18181B] tabular-nums">
                {ancientTranslations.gumulgalText}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PART I · CHAPTER 4 LAB: QUADRILATERALS (CARPENTER'S DIAGONALS)
         ===================================================================== */}
      {chapterId === 'ch4-quadrilaterals' && (
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#18181B]">
                  The Carpenter’s Bisecting Diagonal Strips Builder
                </h4>
                <div className="flex gap-1.5">
                  {[
                    { name: 'Square', d1: 10, d2: 10, ang: 90 },
                    { name: 'Rectangle', d1: 10, d2: 10, ang: 50 },
                    { name: 'Rhombus', d1: 12, d2: 8, ang: 90 },
                    { name: 'Parallelogram', d1: 12, d2: 8, ang: 60 },
                  ].map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setDiag1(p.d1);
                        setDiag2(p.d2);
                        setDiagAngle(p.ang);
                      }}
                      className="px-2 py-1 rounded-md text-[11px] font-mono bg-[#FAF6EE] hover:bg-[#194530] hover:text-white border border-[#E5DEC9] cursor-pointer transition-colors"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-[#52525B] block tabular-nums">
                    Wooden Strip AC Length (d₁): {diag1} cm (Half = {diag1 / 2} cm)
                  </label>
                  <input
                    type="range"
                    min={6}
                    max={14}
                    step={2}
                    value={diag1}
                    onChange={(e) => setDiag1(Number(e.target.value))}
                    className="w-full accent-[#194530] cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#52525B] block tabular-nums">
                    Wooden Strip BD Length (d₂): {diag2} cm (Half = {diag2 / 2} cm)
                  </label>
                  <input
                    type="range"
                    min={6}
                    max={14}
                    step={2}
                    value={diag2}
                    onChange={(e) => setDiag2(Number(e.target.value))}
                    className="w-full accent-[#D97706] cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#52525B] block tabular-nums">
                    Intersection Angle ∠AOB (x°): {diagAngle}°
                  </label>
                  <input
                    type="range"
                    min={30}
                    max={150}
                    step={5}
                    value={diagAngle}
                    onChange={(e) => setDiagAngle(Number(e.target.value))}
                    className="w-full accent-[#2563EB] cursor-pointer"
                  />
                </div>
              </div>

              {(() => {
                const equalDiags = diag1 === diag2;
                const perpDiags = diagAngle === 90;
                let shapeName = 'Parallelogram (Opposite sides equal & parallel)';
                if (equalDiags && perpDiags) shapeName = 'SQUARE (Equal & 90° bisecting diagonals!)';
                else if (equalDiags) shapeName = 'RECTANGLE (Equal bisecting diagonals → all corners 90°!)';
                else if (perpDiags) shapeName = 'RHOMBUS (Perpendicular bisecting diagonals → all 4 sides equal!)';

                return (
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] font-mono text-xs space-y-1.5">
                    <div className="text-sm font-bold text-[#194530]">{shapeName}</div>
                    {equalDiags ? (
                      <div className="text-[#2563EB]">
                        Corner Proof: ∠OAB = {(90 - diagAngle / 2).toFixed(1)}° + ∠OAD ={' '}
                        {(diagAngle / 2).toFixed(1)}° → ∠A = 90.0°!
                      </div>
                    ) : (
                      <div className="text-[#52525B]">
                        Since d₁ ≠ d₂, corners are oblique unless diagonals become equal.
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Animated SVG Quadrilateral & Diagonal Strips */}
            <div className="flex flex-col items-center justify-center bg-[#194530] rounded-2xl border-4 border-[#8D5B34] p-4 text-white">
              <svg viewBox="-90 -75 180 150" className="w-full max-w-[280px] h-auto">
                {(() => {
                  const scale = 8.5;
                  const r1 = (diag1 / 2) * scale;
                  const r2 = (diag2 / 2) * scale;
                  const rad = (diagAngle * Math.PI) / 180;
                  const ax = r1;
                  const ay = 0;
                  const cx = -r1;
                  const cy = 0;
                  const bx = r2 * Math.cos(rad);
                  const by = -r2 * Math.sin(rad);
                  const dx = -r2 * Math.cos(rad);
                  const dy = r2 * Math.sin(rad);

                  return (
                    <>
                      {/* Outer Quadrilateral ABCD */}
                      <motion.polygon
                        animate={{
                          points: `${ax},${ay} ${bx},${by} ${cx},${cy} ${dx},${dy}`,
                        }}
                        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                        fill="rgba(253, 224, 71, 0.14)"
                        stroke="#FDE047"
                        strokeWidth="2.2"
                      />
                      {/* Diagonal Strip 1 (AC) */}
                      <line
                        x1={cx}
                        y1={cy}
                        x2={ax}
                        y2={ay}
                        stroke="#93C5FD"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {/* Diagonal Strip 2 (BD) */}
                      <line
                        x1={dx}
                        y1={dy}
                        x2={bx}
                        y2={by}
                        stroke="#FCA5A5"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
                      <text x={ax + 6} y={ay + 4} fill="#FDE047" fontSize="10">
                        A
                      </text>
                      <text x={bx + 5} y={by - 5} fill="#FCA5A5" fontSize="10">
                        B
                      </text>
                      <text x={cx - 12} y={cy + 4} fill="#FDE047" fontSize="10">
                        C
                      </text>
                      <text x={dx - 10} y={dy + 12} fill="#FCA5A5" fontSize="10">
                        D
                      </text>
                    </>
                  );
                })()}
              </svg>
              <span className="text-xs font-mono text-emerald-200 mt-1">
                Center Pin O · ∠AOB = {diagAngle}°
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PART I · CHAPTER 5 LAB: NUMBER PLAY (DIVISIBILITY & CRYPTARITHMS)
         ===================================================================== */}
      {chapterId === 'ch5-number-play' && (
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Live Divisibility by 9, 3, and 11 Machine */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#18181B]">
                  1. Āryabhaṭa II’s Digital Root &amp; Mod-11 Alternating Scanner
                </h4>
                <input
                  type="number"
                  min={10}
                  max={999999}
                  value={divNum}
                  onChange={(e) =>
                    setDivNum(Math.max(10, Math.min(999999, Number(e.target.value) || 10)))
                  }
                  className="w-28 px-2.5 py-1 rounded-lg border border-[#E5DEC9] font-mono text-sm font-bold text-[#194530]"
                />
              </div>

              {(() => {
                const digits = String(Math.abs(Math.round(divNum)))
                  .split('')
                  .map(Number);
                const sum9 = digits.reduce((a, b) => a + b, 0);
                const rem9 = divNum % 9;
                const rev = [...digits].reverse();
                let oddPosSum = 0;
                let evenPosSum = 0;
                rev.forEach((d, i) => {
                  if (i % 2 === 0) oddPosSum += d;
                  else evenPosSum += d;
                });
                const altDiff = oddPosSum - evenPosSum;
                const rem11 = ((divNum % 11) + 11) % 11;

                return (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {digits.map((d, idx) => {
                        const fromRight = digits.length - 1 - idx;
                        const isPlus = fromRight % 2 === 0;
                        return (
                          <motion.div
                            key={`${idx}-${d}`}
                            initial={{ y: -8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`px-3 py-2 rounded-xl border font-mono text-sm font-bold ${
                              isPlus
                                ? 'bg-[#EFF6FF] border-[#93C5FD] text-[#1E40AF]'
                                : 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]'
                            }`}
                          >
                            <div>{d}</div>
                            <div className="text-[10px] opacity-75">
                              {isPlus ? '+ (11m+1)' : '- (11m-1)'}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] font-mono text-xs space-y-1.5">
                      <div className="text-[#18181B] font-bold">
                        Mod 9 &amp; 3 Digit Sum: {digits.join(' + ')} = {sum9} → Remainder mod 9 ={' '}
                        <span className="text-[#2563EB]">{rem9}</span>{' '}
                        {rem9 === 0 && '★ Divisible by 9!'}
                      </div>
                      <div className="text-[#18181B] font-bold">
                        Mod 11 Alternating Sum: ({ oddPosSum }) - ({ evenPosSum }) = {altDiff} →
                        Remainder mod 11 = <span className="text-[#D97706]">{rem11}</span>{' '}
                        {rem11 === 0 && '★ Divisible by 11!'}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Right: Interactive Cryptarithm Decoder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#18181B]">
                  2. Digits in Disguise (Cryptarithm Cracker)
                </h4>
                <div className="flex gap-1">
                  {[
                    { id: 'pq8' as const, label: 'PQ × 8 = RS' },
                    { id: 'efe' as const, label: 'EF × E = GGG' },
                    { id: 'on3' as const, label: '3 × AB = CB' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCryptoChoice(c.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono border cursor-pointer ${
                        cryptoChoice === c.id
                          ? 'bg-[#194530] text-white border-[#194530]'
                          : 'bg-[#FAF6EE] text-[#1C1917] border-[#E5DEC9]'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#194530] text-white border-2 border-[#8D5B34] font-mono text-xs space-y-2">
                {cryptoChoice === 'pq8' && (
                  <>
                    <div className="text-base font-bold text-[#FDE047]">
                      Puzzle: PQ × 8 = RS  →  12 × 8 = 96
                    </div>
                    <p className="text-emerald-100 leading-relaxed">
                      • Since RS is 2 digits (&lt; 100), PQ can only be 10, 11, or 12!
                      <br />• 10×8 = 80 (repeats 0), 11×8 = 88 (repeats 1,8).
                      <br />• Only <strong>12 × 8 = 96</strong> gives four distinct digits (P=1, Q=2, R=9, S=6)!
                    </p>
                  </>
                )}
                {cryptoChoice === 'efe' && (
                  <>
                    <div className="text-base font-bold text-[#FDE047]">
                      Puzzle: EF × E = GGG  →  37 × 3 = 111
                    </div>
                    <p className="text-emerald-100 leading-relaxed">
                      • Every 3-digit repunit GGG factors as <strong>111 × G = 3 × 37 × G</strong>!
                      <br />• So the 2-digit number EF must be a multiple of prime 37 (37 or 74).
                      <br />• Testing EF = 37 gives E = 3, and <strong>37 × 3 = 111</strong> (G = 1)!
                    </p>
                  </>
                )}
                {cryptoChoice === 'on3' && (
                  <>
                    <div className="text-base font-bold text-[#FDE047]">
                      Puzzle: AB + AB + AB = CB  →  25 × 3 = 75
                    </div>
                    <p className="text-emerald-100 leading-relaxed">
                      • Since 3 × B ends in the same units digit B, B must be 0 or 5!
                      <br />• Testing B = 5 gives carry 1: 3×2 + 1 = 7 → <strong>25 × 3 = 75</strong>!
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PART I · CHAPTER 6 LAB: WE DISTRIBUTE, YET THINGS MULTIPLY
         ===================================================================== */}
      {chapterId === 'ch6-we-distribute' && (
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#18181B]">
                  1. Brahmagupta’s 4-Region Area Dissection: (a + m)(b + n)
                </h4>
                <span className="font-mono text-xs font-bold text-[#194530]">
                  ({distA}+{distM})({distB}+{distN}) = {(distA + distM) * (distB + distN)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#52525B] block">
                    a = {distA}, m = {distM}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="range"
                      min={4}
                      max={14}
                      value={distA}
                      onChange={(e) => setDistA(Number(e.target.value))}
                      className="w-full accent-[#2563EB]"
                    />
                    <input
                      type="range"
                      min={1}
                      max={8}
                      value={distM}
                      onChange={(e) => setDistM(Number(e.target.value))}
                      className="w-full accent-[#D97706]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[#52525B] block">
                    b = {distB}, n = {distN}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="range"
                      min={4}
                      max={12}
                      value={distB}
                      onChange={(e) => setDistB(Number(e.target.value))}
                      className="w-full accent-[#16A34A]"
                    />
                    <input
                      type="range"
                      min={1}
                      max={6}
                      value={distN}
                      onChange={(e) => setDistN(Number(e.target.value))}
                      className="w-full accent-[#9333EA]"
                    />
                  </div>
                </div>
              </div>

              {/* 4-Box Area Grid */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#DBEAFE] border border-[#93C5FD] text-[#1E3A8A]">
                  <div className="font-bold">a × b = {distA * distB}</div>
                  <div className="text-[11px]">({distA} × {distB})</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]">
                  <div className="font-bold">m × b = {distM * distB}</div>
                  <div className="text-[11px]">({distM} × {distB})</div>
                </div>
                <div className="p-3 rounded-lg bg-[#DCFCE7] border border-[#86EFAC] text-[#166534]">
                  <div className="font-bold">a × n = {distA * distN}</div>
                  <div className="text-[11px]">({distA} × {distN})</div>
                </div>
                <div className="p-3 rounded-lg bg-[#F3E8FF] border border-[#D8B4FE] text-[#6B21A8]">
                  <div className="font-bold">m × n = {distM * distN}</div>
                  <div className="text-[11px]">({distM} × {distN})</div>
                </div>
              </div>
            </div>

            {/* Right: Śrīdharāchārya's Mental Squarer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#18181B]">
                  2. Śrīdharāchārya’s Mental Squarer: a² = (a+b)(a-b) + b²
                </h4>
                <span className="font-mono text-xs font-bold text-[#D97706]">
                  a = {sridharaNum}
                </span>
              </div>
              <input
                type="range"
                min={85}
                max={115}
                value={sridharaNum}
                onChange={(e) => setSridharaNum(Number(e.target.value))}
                className="w-full accent-[#194530] cursor-pointer"
              />
              {(() => {
                const b = Math.abs(100 - sridharaNum);
                const plus = sridharaNum + b;
                const minus = sridharaNum - b;
                const prod = plus * minus;
                const sq = prod + b * b;
                return (
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] font-mono text-xs space-y-2">
                    <div className="text-[#52525B]">
                      Distance to 100: <strong>b = {b}</strong>
                    </div>
                    <div className="text-sm font-bold text-[#18181B]">
                      {sridharaNum}² = ({sridharaNum} + {b})({sridharaNum} - {b}) + {b}²
                    </div>
                    <div className="text-base font-bold text-[#194530]">
                      = {plus} × {minus} + {b * b} = {prod.toLocaleString()} + {b * b} ={' '}
                      {sq.toLocaleString()}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PART I · CHAPTER 7 LAB: PROPORTIONAL REASONING-1 (TIGER & COFFEE)
         ===================================================================== */}
      {chapterId === 'ch7-proportional-1' && (
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Tiger Aspect Ratio Tester */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#18181B]">
                  1. Tiger Photo Aspect-Ratio Resizer (Original 60:40 = 3:2)
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setTigerW(90);
                    setTigerH(60);
                  }}
                  className="text-xs font-mono text-[#194530] underline cursor-pointer"
                >
                  Lock to 3:2
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#52525B] block">
                    Width W = {tigerW} mm
                  </label>
                  <input
                    type="range"
                    min={30}
                    max={120}
                    step={5}
                    value={tigerW}
                    onChange={(e) => setTigerW(Number(e.target.value))}
                    className="w-full accent-[#194530]"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#52525B] block">
                    Height H = {tigerH} mm
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={90}
                    step={5}
                    value={tigerH}
                    onChange={(e) => setTigerH(Number(e.target.value))}
                    className="w-full accent-[#D97706]"
                  />
                </div>
              </div>

              {(() => {
                const g = gcd(tigerW, tigerH);
                const simpW = tigerW / g;
                const simpH = tigerH / g;
                const isProp = simpW === 3 && simpH === 2;
                return (
                  <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8]">
                    <motion.div
                      animate={{ width: tigerW * 1.1, height: tigerH * 1.1 }}
                      className={`rounded-xl border-2 flex items-center justify-center font-display font-bold text-xs shrink-0 ${
                        isProp
                          ? 'bg-[#DCFCE7] border-[#16A34A] text-[#166534]'
                          : 'bg-[#FEE2E2] border-[#DC2626] text-[#991B1B]'
                      }`}
                    >
                      🐅 {simpW}:{simpH}
                    </motion.div>
                    <div className="font-mono text-xs space-y-1">
                      <div className="font-bold text-[#18181B]">
                        HCF({tigerW}, {tigerH}) = {g} → Simplest Ratio = {simpW} : {simpH}
                      </div>
                      <div className={isProp ? 'text-[#16A34A] font-bold' : 'text-[#DC2626]'}>
                        {isProp
                          ? '★ Undistorted! Proportional to 60:40 (3:2)!'
                          : `Distorted! For Width ${tigerW} mm, Height needs to be ${((tigerW * 2) / 3).toFixed(1)} mm.`}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Right: Manjunath's Filter Coffee Trairāśika Mixer */}
            <div className="space-y-3">
              <h4 className="font-display text-sm font-bold text-[#18181B]">
                2. Manjunath’s Filter Coffee Trairāśika Mixer (3 : 7 Decoction to Milk)
              </h4>
              <label className="text-xs font-mono text-[#52525B] block">
                Desired Coffee Decoction (Ichchhā): {coffeeDecoction} mL
              </label>
              <input
                type="range"
                min={6}
                max={45}
                step={3}
                value={coffeeDecoction}
                onChange={(e) => setCoffeeDecoction(Number(e.target.value))}
                className="w-full accent-[#8D5B34] cursor-pointer"
              />
              {(() => {
                const milkNeeded = (coffeeDecoction * 7) / 3;
                return (
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] font-mono text-xs space-y-1.5">
                    <div className="text-[#52525B]">
                      Pramāṇa (15 mL) : Phala (35 mL) :: Ichchhā ({coffeeDecoction} mL) : Milk
                    </div>
                    <div className="text-sm font-bold text-[#194530]">
                      Milk (Ichchhāphala) = (35 × {coffeeDecoction}) ÷ 15 = {milkNeeded.toFixed(0)} mL
                    </div>
                    <div className="text-[#78716C]">
                      Total Cup = {coffeeDecoction + milkNeeded} mL (30% Decoction, 70% Milk)
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PART II · CHAPTER 1 LAB: FRACTIONS IN DISGUISE
         ===================================================================== */}
      {chapterId === 'ch4-fractions-disguise' && (
        <div className="p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl bg-[#F2EFE9] p-1 border border-[#E6E2D8]">
              <button
                type="button"
                onClick={() => setTrapMode('markup-discount')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  trapMode === 'markup-discount'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-[#52525B]'
                }`}
              >
                Surbhi’s +Markup% then -Discount% Trap
              </button>
              <button
                type="button"
                onClick={() => setTrapMode('double-discount')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  trapMode === 'double-discount'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-[#52525B]'
                }`}
              >
                Cakely vs Cakify Sequential Discounts
              </button>
            </div>
            <span className="text-xs font-mono text-[#059669] font-semibold">
              Percentages Always Act on the CURRENT Base!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2">
              <label className="text-xs font-mono text-[#52525B] block tabular-nums">
                Initial Cost / MRP: ₹{basePrice}
              </label>
              <input
                type="range"
                min={50}
                max={500}
                step={10}
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full accent-[#059669] cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2">
              <label className="text-xs font-mono text-[#52525B] block tabular-nums">
                Step 1 ({trapMode === 'markup-discount' ? '+Markup' : '-Discount 1'}):{' '}
                {firstPct}%
              </label>
              <input
                type="range"
                min={5}
                max={80}
                step={5}
                value={firstPct}
                onChange={(e) => setFirstPct(Number(e.target.value))}
                className="w-full accent-[#2563EB] cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] space-y-2">
              <label className="text-xs font-mono text-[#52525B] block tabular-nums">
                Step 2 (-Discount 2): {secondPct}%
              </label>
              <input
                type="range"
                min={5}
                max={80}
                step={5}
                value={secondPct}
                onChange={(e) => setSecondPct(Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
            </div>
          </div>

          {(() => {
            const afterStep1 =
              trapMode === 'markup-discount'
                ? basePrice * (1 + firstPct / 100)
                : basePrice * (1 - firstPct / 100);
            const finalPrice = afterStep1 * (1 - secondPct / 100);
            const netChangePct = ((finalPrice - basePrice) / basePrice) * 100;
            return (
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono tabular-nums">
                <div>
                  <div className="text-[11px] text-[#71717A]">1. Starting Value</div>
                  <div className="text-lg font-bold text-[#18181B]">
                    ₹{basePrice.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#2563EB]">
                    2. After {trapMode === 'markup-discount' ? `+${firstPct}%` : `-${firstPct}%`} (New Base!)
                  </div>
                  <div className="text-lg font-bold text-[#2563EB]">
                    ₹{afterStep1.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#D97706]">
                    3. Final After -{secondPct}% on ₹{afterStep1.toFixed(0)}
                  </div>
                  <div className="text-lg font-bold text-[#18181B]">
                    ₹{finalPrice.toFixed(2)}{' '}
                    <span
                      className={`text-xs ${
                        netChangePct >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
                      }`}
                    >
                      ({netChangePct >= 0 ? '+' : ''}
                      {netChangePct.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* =====================================================================
          PART II · CHAPTER 2 LAB: THE BAUDHAYANA-PYTHAGORAS THEOREM
         ===================================================================== */}
      {chapterId === 'ch5-baudhayana-pythagoras' && (
        <div className="p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl bg-[#F2EFE9] p-1 border border-[#E6E2D8]">
              <button
                type="button"
                onClick={() => setPythMode('squares')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  pythMode === 'squares'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-[#52525B]'
                }`}
              >
                Baudhāyana Square Combiner (a² + b² = c²)
              </button>
              <button
                type="button"
                onClick={() => setPythMode('lotus')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  pythMode === 'lotus'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-[#52525B]'
                }`}
              >
                Bhāskarāchārya’s Swaying Lotus Lake Depth
              </button>
            </div>
          </div>

          {pythMode === 'squares' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-[#52525B] block tabular-nums">
                    Horizontal Leg a = {legA} (Area a² = {legA * legA})
                  </label>
                  <input
                    type="range"
                    min={3}
                    max={15}
                    value={legA}
                    onChange={(e) => setLegA(Number(e.target.value))}
                    className="w-full accent-[#2563EB] cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#52525B] block tabular-nums">
                    Vertical Leg b = {legB} (Area b² = {legB * legB})
                  </label>
                  <input
                    type="range"
                    min={3}
                    max={15}
                    value={legB}
                    onChange={(e) => setLegB(Number(e.target.value))}
                    className="w-full accent-[#D97706] cursor-pointer"
                  />
                </div>

                {(() => {
                  const c2 = legA * legA + legB * legB;
                  const c = Math.sqrt(c2);
                  const isExactTriple = Number.isInteger(c);
                  return (
                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] font-mono text-xs space-y-1.5 tabular-nums">
                      <div className="font-bold text-[#18181B] text-sm">
                        {legA}² + {legB}² = {legA * legA} + {legB * legB} = {c2}
                      </div>
                      <div className="text-[#2563EB] font-semibold">
                        Hypotenuse c = √{c2} ≈ {c.toFixed(3)}
                      </div>
                      <div
                        className={`font-semibold ${
                          isExactTriple ? 'text-[#16A34A]' : 'text-[#71717A]'
                        }`}
                      >
                        {isExactTriple
                          ? `★ Exact Baudhāyana Triple: (${legA}, ${legB}, ${c})!`
                          : 'Irrational diagonal (try 3 & 4, 5 & 12, 6 & 8, or 8 & 15)'}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex justify-center bg-[#FAF8F5] rounded-xl border border-[#E6E2D8] p-4">
                <svg viewBox="0 0 220 160" className="w-full max-w-[260px] h-auto">
                  {(() => {
                    const scale = 7;
                    const x0 = 55;
                    const y0 = 115;
                    const w = legA * scale;
                    const h = legB * scale;
                    return (
                      <>
                        <rect
                          x={x0 - h}
                          y={y0 - h}
                          width={h}
                          height={h}
                          fill="#FEF3C7"
                          stroke="#D97706"
                          strokeWidth="1.5"
                        />
                        <rect
                          x={x0}
                          y={y0}
                          width={w}
                          height={w}
                          fill="#DBEAFE"
                          stroke="#2563EB"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points={`${x0},${y0} ${x0 + w},${y0} ${x0},${y0 - h}`}
                          fill="#FEE2E2"
                          stroke="#DC2626"
                          strokeWidth="2"
                        />
                        <text
                          x={x0 + w / 2}
                          y={y0 + 14}
                          textAnchor="middle"
                          fontSize="9"
                          fill="#1E40AF"
                        >
                          a²={legA * legA}
                        </text>
                        <text
                          x={x0 - h / 2}
                          y={y0 - h / 2 + 3}
                          textAnchor="middle"
                          fontSize="9"
                          fill="#92400E"
                        >
                          b²={legB * legB}
                        </text>
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-[#52525B] block tabular-nums">
                    Height of Lotus Bud Above Water (h): {lotusH} units
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={6}
                    step={0.5}
                    value={lotusH}
                    onChange={(e) => setLotusH(Number(e.target.value))}
                    className="w-full accent-[#DC2626] cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#52525B] block tabular-nums">
                    Horizontal Breeze Drift Distance (d): {lotusD} units
                  </label>
                  <input
                    type="range"
                    min={4}
                    max={15}
                    step={0.5}
                    value={lotusD}
                    onChange={(e) => setLotusD(Number(e.target.value))}
                    className="w-full accent-[#2563EB] cursor-pointer"
                  />
                </div>

                {(() => {
                  const depthX = (lotusD * lotusD - lotusH * lotusH) / (2 * lotusH);
                  const stemLen = depthX + lotusH;
                  return (
                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] font-mono text-xs space-y-1 tabular-nums">
                      <div className="text-[#52525B]">
                        Equation: x² + {lotusD}² = (x + {lotusH})²
                      </div>
                      <div className="font-bold text-sm text-[#18181B]">
                        Lake Depth x = ({lotusD}² - {lotusH}²) / (2×{lotusH}) ={' '}
                        <span className="text-[#2563EB]">{depthX.toFixed(2)} units</span>
                      </div>
                      <div className="text-[#16A34A]">
                        Total Lotus Stem Length = x + h = {stemLen.toFixed(2)} units
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="p-4 rounded-xl bg-[#EFF6FF]/50 border border-[#DBEAFE] text-xs space-y-2">
                <div className="font-display font-bold text-[#1E3A8A]">
                  Why the x² Term Cancels Out:
                </div>
                <p className="text-[#1E40AF] leading-relaxed">
                  Whether the lotus stands straight up or tilts to touch the water at distance{' '}
                  <strong className="font-mono">d = {lotusD}</strong>, its total stem length never changes:{' '}
                  <strong className="font-mono">c = x + {lotusH}</strong>. Expanding{' '}
                  <span className="font-mono">x² + d² = x² + 2hx + h²</span> cancels{' '}
                  <span className="font-mono">x²</span> on both sides!
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          PART II · CHAPTER 3 LAB: PROPORTIONAL REASONING-2
         ===================================================================== */}
      {chapterId === 'ch6-proportional-reasoning' && (
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#18181B]">
                  Multi-Term Ratio Splitter &amp; 360° Pie Chart
                </h4>
                <span className="font-mono text-xs font-bold text-[#0891B2] tabular-nums">
                  Ratio {r1} : {r2} : {r3} : {r4}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#52525B] block tabular-nums">
                    Total Whole (T): {ratioTotal}
                  </label>
                  <input
                    type="range"
                    min={60}
                    max={1000}
                    step={10}
                    value={ratioTotal}
                    onChange={(e) => setRatioTotal(Number(e.target.value))}
                    className="w-full accent-[#0891B2] cursor-pointer"
                  />
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: 'A', val: r1, set: setR1 },
                    { label: 'B', val: r2, set: setR2 },
                    { label: 'C', val: r3, set: setR3 },
                    { label: 'D', val: r4, set: setR4 },
                  ].map((part) => (
                    <div key={part.label}>
                      <label className="text-[10px] font-mono text-[#71717A] block text-center">
                        {part.label}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={part.val}
                        onChange={(e) =>
                          part.set(Math.max(1, Number(e.target.value) || 1))
                        }
                        className="w-full px-1.5 py-1 rounded-md border border-[#E6E2D8] font-mono text-xs font-bold text-center tabular-nums"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {(() => {
                const sumParts = r1 + r2 + r3 + r4;
                const parts = [
                  { name: 'Part A', r: r1, color: '#2563EB' },
                  { name: 'Part B', r: r2, color: '#D97706' },
                  { name: 'Part C', r: r3, color: '#16A34A' },
                  { name: 'Part D', r: r4, color: '#9333EA' },
                ];
                return (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {parts.map((p) => {
                      const share = (ratioTotal * p.r) / sumParts;
                      const deg = (360 * p.r) / sumParts;
                      return (
                        <div
                          key={p.name}
                          className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E6E2D8] font-mono text-xs tabular-nums"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold" style={{ color: p.color }}>
                              {p.name} ({p.r}/{sumParts})
                            </span>
                            <span className="text-[#71717A]">{deg.toFixed(0)}°</span>
                          </div>
                          <div className="text-sm font-bold text-[#18181B] mt-0.5">
                            {share.toFixed(1)} units
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            <div className="flex flex-col items-center justify-center bg-[#FAF8F5] rounded-xl border border-[#E6E2D8] p-4">
              <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-36 h-36 -rotate-90">
                {(() => {
                  const sumParts = r1 + r2 + r3 + r4;
                  const vals = [r1, r2, r3, r4];
                  const colors = ['#2563EB', '#D97706', '#16A34A', '#9333EA'];
                  let cumAngle = 0;
                  return vals.map((v, idx) => {
                    const frac = v / sumParts;
                    const startAngle = cumAngle;
                    const endAngle = cumAngle + frac * Math.PI * 2;
                    cumAngle = endAngle;
                    const x1 = Math.cos(startAngle);
                    const y1 = Math.sin(startAngle);
                    const x2 = Math.cos(endAngle);
                    const y2 = Math.sin(endAngle);
                    const largeArc = frac > 0.5 ? 1 : 0;
                    const d = `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArc} 1 ${x2} ${y2} Z`;
                    return (
                      <path
                        key={idx}
                        d={d}
                        fill={colors[idx]}
                        stroke="#FFFFFF"
                        strokeWidth="0.03"
                      />
                    );
                  });
                })()}
              </svg>
              <span className="text-[11px] font-mono text-[#52525B] mt-2 tabular-nums">
                Total = {r1 + r2 + r3 + r4} parts → 360° Full Circle
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PART II · CHAPTER 4 LAB: EXPLORING SOME GEOMETRIC THEMES
         ===================================================================== */}
      {chapterId === 'ch11-geometric-themes' && (
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Sierpinski Carpet Step Animator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#18181B]">
                  1. Sierpinski Carpet Fractal Animator (8ⁿ Squares)
                </h4>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFractalStep(s)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs border cursor-pointer ${
                        fractalStep === s
                          ? 'bg-[#194530] text-white border-[#194530]'
                          : 'bg-[#FAF6EE] text-[#1C1917] border-[#E5DEC9]'
                      }`}
                    >
                      Step {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="grid bg-[#194530] p-2 rounded-xl border-2 border-[#8D5B34] shrink-0"
                  style={{
                    width: '148px',
                    height: '148px',
                    gridTemplateColumns: `repeat(${Math.pow(3, fractalStep)}, minmax(0, 1fr))`,
                    gap: fractalStep <= 1 ? '3px' : '1px',
                  }}
                >
                  {Array.from(
                    { length: Math.pow(9, fractalStep) },
                    (_, idx) => {
                      const dim = Math.pow(3, fractalStep);
                      let r = Math.floor(idx / dim);
                      let c = idx % dim;
                      let isHole = false;
                      while (r > 0 || c > 0) {
                        if (r % 3 === 1 && c % 3 === 1) {
                          isHole = true;
                          break;
                        }
                        r = Math.floor(r / 3);
                        c = Math.floor(c / 3);
                      }
                      return (
                        <motion.div
                          key={`${fractalStep}-${idx}`}
                          initial={{ scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`rounded-[1px] ${
                            isHole ? 'bg-[#112A1E]' : 'bg-[#FDE047]'
                          }`}
                        />
                      );
                    }
                  )}
                </div>

                <div className="font-mono text-xs space-y-1.5">
                  <div className="font-bold text-sm text-[#194530]">
                    Step {fractalStep}: 8^{fractalStep} = {Math.pow(8, fractalStep)} Remaining Squares
                  </div>
                  <div className="text-[#52525B]">
                    Total Holes Punched:{' '}
                    {fractalStep === 0 ? 0 : fractalStep === 1 ? 1 : 9} (Step 3 has 512 squares &amp; 73 holes!)
                  </div>
                  <div className="text-[#D97706]">
                    Koch Snowflake at Step {fractalStep}: 3 × 4^{fractalStep} ={' '}
                    {3 * Math.pow(4, fractalStep)} sides!
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Hungry Ant Cuboid Unfolded Net Comparator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#18181B]">
                  2. Hungry Ant &amp; Laddu Unfolded Net (30 × 12 × 12 cm)
                </h4>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAntRoute('side-40')}
                    className={`px-2.5 py-1 rounded-lg font-mono text-xs border cursor-pointer ${
                      antRoute === 'side-40'
                        ? 'bg-[#16A34A] text-white border-[#16A34A]'
                        : 'bg-[#FAF6EE] text-[#1C1917] border-[#E5DEC9]'
                    }`}
                  >
                    Side Unfold (40 cm ★)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAntRoute('roof-42')}
                    className={`px-2.5 py-1 rounded-lg font-mono text-xs border cursor-pointer ${
                      antRoute === 'roof-42'
                        ? 'bg-[#DC2626] text-white border-[#DC2626]'
                        : 'bg-[#FAF6EE] text-[#1C1917] border-[#E5DEC9]'
                    }`}
                  >
                    Roof Unfold (42.4 cm)
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] font-mono text-xs space-y-2">
                {antRoute === 'side-40' ? (
                  <>
                    <div className="text-sm font-bold text-[#16A34A]">
                      ★ Winner! Front + Right Wall Net: Legs 24 cm &amp; 32 cm
                    </div>
                    <p className="text-[#52525B] leading-relaxed">
                      Unfolding the right wall next to the front wall creates a right triangle with{' '}
                      <strong>Δx = 12 + 12 = 24 cm</strong> and <strong>Δy = 30 + 2 = 32 cm</strong>:
                      <br />
                      <strong className="text-[#18181B]">
                        d = √(24² + 32²) = √(576 + 1024) = √1600 = 40.00 cm!
                      </strong>
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-bold text-[#DC2626]">
                      Runner-Up: Over the Top Roof Net: Legs 30 cm &amp; 30 cm
                    </div>
                    <p className="text-[#52525B] leading-relaxed">
                      Unfolding the top roof directly between the left and right walls gives{' '}
                      <strong>Δx = 30 cm</strong> and <strong>Δy = 10 + 12 + 8 = 30 cm</strong>:
                      <br />
                      <strong className="text-[#18181B]">
                        d = √(30² + 30²) = √1800 ≈ 42.43 cm (2.43 cm longer!)
                      </strong>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PART II · CHAPTER 5 LAB: TALES BY DOTS AND LINES (MEAN SEESAW)
         ===================================================================== */}
      {chapterId === 'ch12-dots-and-lines' && (
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#18181B]">
                  Coach Balwan’s Kushti Mean Fulcrum Seesaw (∑d_LHS = ∑d_RHS)
                </h4>
                <span className="font-mono text-xs font-bold text-[#194530]">
                  6th Wrestler = {wrestler6} kg
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={68}
                value={wrestler6}
                onChange={(e) => setWrestler6(Number(e.target.value))}
                className="w-full accent-[#194530] cursor-pointer"
              />
              {(() => {
                const weights = [48, 51, 53, 58, 61, wrestler6].sort((a, b) => a - b);
                const sum = weights.reduce((a, b) => a + b, 0);
                const mean = sum / 6;
                const median = (weights[2] + weights[3]) / 2;
                const dLeft = weights
                  .filter((w) => w < mean)
                  .reduce((acc, w) => acc + (mean - w), 0);
                const dRight = weights
                  .filter((w) => w > mean)
                  .reduce((acc, w) => acc + (w - mean), 0);

                return (
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#194530] text-sm">
                        Mean Fulcrum = {mean.toFixed(2)} kg
                      </span>
                      <span className="font-bold text-[#2563EB] text-sm">
                        Median = {median.toFixed(1)} kg
                      </span>
                    </div>
                    <div className="text-[#52525B]">
                      Sorted Weights: [{weights.join(', ')}] kg
                    </div>
                    <div className="text-[#D97706] font-semibold">
                      Left Distance ∑d_LHS = {dLeft.toFixed(1)} kg  |  Right Distance ∑d_RHS ={' '}
                      {dRight.toFixed(1)} kg (Always Equal!)
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Visual Seesaw Beam */}
            <div className="p-5 rounded-2xl bg-[#194530] border-4 border-[#8D5B34] text-white flex flex-col items-center justify-center space-y-3">
              <div className="text-xs font-mono text-[#FDE047]">
                {wrestler6 === 59
                  ? '★ Balanced at Exact Mean = 55.0 kg (59 kg = 55 + 4)!'
                  : `Fulcrum Shifts to ${((271 + wrestler6) / 6).toFixed(2)} kg`}
              </div>
              <div className="w-full h-3 bg-[#FDE047] rounded-full relative flex items-center justify-between px-4">
                <span className="text-[10px] font-mono bg-[#142E21] px-2 py-0.5 rounded-md border border-white/30">
                  48, 51, 53
                </span>
                <span className="text-[10px] font-mono bg-[#142E21] px-2 py-0.5 rounded-md border border-white/30">
                  58, {wrestler6}, 61
                </span>
              </div>
              <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[22px] border-b-[#FCA5A5]" />
              <div className="text-xs font-mono text-emerald-200">
                Fulcrum Point = {((271 + wrestler6) / 6).toFixed(2)} kg
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PART II · CHAPTER 6 LAB: ALGEBRA PLAY (PYRAMIDS & BIRTHDAY DECODER)
         ===================================================================== */}
      {chapterId === 'ch13-algebra-play' && (
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Interactive 3-Row Number Pyramid (a + 2b + c) */}
            <div className="space-y-3">
              <h4 className="font-display text-sm font-bold text-[#18181B]">
                1. Interactive 3-Row Number Pyramid: Top = a + 2b + c
              </h4>
              <div className="flex flex-col items-center space-y-2 bg-[#FAF8F5] p-4 rounded-xl border border-[#E6E2D8] font-mono">
                {/* Top Row */}
                <motion.div
                  key={pyrA + 2 * pyrB + pyrC}
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  className="px-5 py-2 rounded-xl bg-[#194530] text-[#FDE047] font-bold text-base border-2 border-[#8D5B34]"
                >
                  Top = {pyrA + 2 * pyrB + pyrC}  ({pyrA} + 2×{pyrB} + {pyrC})
                </motion.div>
                {/* Middle Row */}
                <div className="flex gap-4">
                  <div className="px-4 py-1.5 rounded-lg bg-[#DBEAFE] text-[#1E3A8A] font-bold text-sm border border-[#93C5FD]">
                    a + b = {pyrA + pyrB}
                  </div>
                  <div className="px-4 py-1.5 rounded-lg bg-[#DCFCE7] text-[#166534] font-bold text-sm border border-[#86EFAC]">
                    b + c = {pyrB + pyrC}
                  </div>
                </div>
                {/* Base Row Inputs */}
                <div className="flex gap-3">
                  {[
                    { label: 'a', val: pyrA, set: setPyrA },
                    { label: 'b (×2!)', val: pyrB, set: setPyrB },
                    { label: 'c', val: pyrC, set: setPyrC },
                  ].map((brick) => (
                    <div key={brick.label} className="text-center">
                      <input
                        type="number"
                        value={brick.val}
                        onChange={(e) => brick.set(Number(e.target.value) || 0)}
                        className="w-16 px-2 py-1 rounded-lg border-2 border-[#8D5B34] bg-white font-bold text-center text-sm"
                      />
                      <div className="text-[10px] text-[#78716C] mt-0.5">{brick.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Shubham's 100M + 165 + D Birthday Mind-Reader */}
            <div className="space-y-3">
              <h4 className="font-display text-sm font-bold text-[#18181B]">
                2. Shubham’s Birthday Trick Decoder (100M + D + 165)
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#52525B] block">
                    Birth Month M (1–12): {birthMonth}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(Number(e.target.value))}
                    className="w-full accent-[#194530]"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#52525B] block">
                    Birth Day D (1–31): {birthDay}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={31}
                    value={birthDay}
                    onChange={(e) => setBirthDay(Number(e.target.value))}
                    className="w-full accent-[#D97706]"
                  />
                </div>
              </div>
              {(() => {
                const secretTotal = 100 * birthMonth + birthDay + 165;
                const decoded = secretTotal - 165;
                return (
                  <div className="p-4 rounded-xl bg-[#194530] text-white border-2 border-[#8D5B34] font-mono text-xs space-y-1.5">
                    <div className="text-[#FDE047] font-bold text-sm">
                      Friend’s Final Number: 5(4(5×{birthMonth} + 6) + 9) + {birthDay} = {secretTotal}
                    </div>
                    <div className="text-emerald-100">
                      Subtract 165: {secretTotal} - 165 = <strong>{decoded}</strong>
                    </div>
                    <div className="text-white font-bold">
                      Place-Value Readout: Month M = {Math.floor(decoded / 100)}, Day D ={' '}
                      {String(decoded % 100).padStart(2, '0')}!
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PART II · CHAPTER 7 LAB: AREA (SULBA-SUTRA CUT-AND-SLIDE DISSECTION)
         ===================================================================== */}
      {chapterId === 'ch14-area' && (
        <div className="p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl bg-[#FAF6EE] p-1 border border-[#E5DEC9]">
              <button
                type="button"
                onClick={() => setAreaShapeMode('parallelogram')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  areaShapeMode === 'parallelogram'
                    ? 'bg-[#194530] text-white'
                    : 'text-[#52525B]'
                }`}
              >
                Parallelogram → Rectangle (Cut &amp; Slide ΔAXD)
              </button>
              <button
                type="button"
                onClick={() => setAreaShapeMode('trapezium')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  areaShapeMode === 'trapezium'
                    ? 'bg-[#194530] text-white'
                    : 'text-[#52525B]'
                }`}
              >
                Trapezium + Flipped Twin → Parallelogram ½h(a+b)
              </button>
            </div>
            <span className="text-xs font-mono text-[#194530] font-bold">
              Slide Progress: {slideProgress}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <label className="text-xs font-mono text-[#52525B] block">
                Drag Slider to Cut &amp; Slide the Geometric Piece (0% → 100%):
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={slideProgress}
                onChange={(e) => setSlideProgress(Number(e.target.value))}
                className="w-full accent-[#194530] cursor-pointer"
              />
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E2D8] font-mono text-xs space-y-1.5">
                {areaShapeMode === 'parallelogram' ? (
                  <>
                    <div className="font-bold text-sm text-[#194530]">
                      Parallelogram Dissection (Base b = 12, Altitude h = 7 → Area = 84)
                    </div>
                    <p className="text-[#52525B] leading-relaxed">
                      Cutting the left right-triangle ΔAXD along the perpendicular altitude h and sliding it by{' '}
                      <strong>b = 12 units</strong> to the right turns the tilted parallelogram into a crisp{' '}
                      <strong>12 × 7 Rectangle</strong>!
                    </p>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-sm text-[#194530]">
                      Doubled Trapezium Dissection (a = 14, b = 10, h = 8 → Area = 96)
                    </div>
                    <p className="text-[#52525B] leading-relaxed">
                      Sliding an upside-down copy of the trapezium alongside the original locks them into a parallelogram of base{' '}
                      <strong>(a + b) = 24</strong> and height <strong>h = 8</strong>. So 1 trapezium ={' '}
                      <strong>½ × 8 × (14 + 10) = 96!</strong>
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Animated SVG Dissection Stage */}
            <div className="flex flex-col items-center justify-center bg-[#194530] rounded-2xl border-4 border-[#8D5B34] p-4">
              <svg viewBox="0 0 260 120" className="w-full max-w-[300px] h-auto">
                {areaShapeMode === 'parallelogram' ? (
                  <>
                    {/* Stationary Trapezoid Body of the Parallelogram */}
                    <polygon
                      points="60,20 180,20 140,95 60,95"
                      fill="rgba(147, 197, 253, 0.35)"
                      stroke="#93C5FD"
                      strokeWidth="2"
                    />
                    {/* Sliding Right Triangle ΔAXD */}
                    <polygon
                      points={`${20 + (slideProgress / 100) * 120},95 ${
                        60 + (slideProgress / 100) * 120
                      },20 ${60 + (slideProgress / 100) * 120},95`}
                      fill="rgba(253, 224, 71, 0.55)"
                      stroke="#FDE047"
                      strokeWidth="2"
                    />
                    <text x="115" y="62" fill="#FFFFFF" fontSize="10" textAnchor="middle">
                      Area = b × h = 84
                    </text>
                  </>
                ) : (
                  <>
                    {/* Original Trapezium */}
                    <polygon
                      points="20,95 120,95 100,25 40,25"
                      fill="rgba(147, 197, 253, 0.4)"
                      stroke="#93C5FD"
                      strokeWidth="2"
                    />
                    {/* Upside-down Twin Trapezium sliding into place */}
                    <polygon
                      points={`${180 - (slideProgress / 100) * 60},95 ${
                        240 - (slideProgress / 100) * 60
                      },95 ${260 - (slideProgress / 100) * 60},25 ${
                        160 - (slideProgress / 100) * 60
                      },25`}
                      fill="rgba(253, 224, 71, 0.45)"
                      stroke="#FDE047"
                      strokeWidth="2"
                    />
                    <text x="130" y="112" fill="#FDE047" fontSize="9.5" textAnchor="middle">
                      Combined Base = a + b → One Trapezium = ½h(a + b)
                    </text>
                  </>
                )}
              </svg>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
