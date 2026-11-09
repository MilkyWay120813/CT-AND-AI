import React, { useEffect, useState } from 'react';
import { Sparkles, Compass, Layers, BookOpen } from 'lucide-react';
import { formatMathText } from '../utils/formatMath';

interface AnimatedChapterBannerProps {
  chapterId: string;
  chapterIndex: number;
  partLabel: 'Part I' | 'Part II';
  title: string;
  subtitle: string;
  ribbonText: string;
  moduleCount: number;
  selectedModuleCode: string | null;
}

interface ChapterVisualTheme {
  bgGradient: string;
  accentHex: string;
  glowHex: string;
  badgeBg: string;
  badgeText: string;
  orbitFormulas: string[];
  animationStyle:
    | 'tesseract-wave'
    | 'exponential-cascade'
    | 'ancient-glyph-morph'
    | 'polygon-linkage'
    | 'cipher-clockwork'
    | 'area-foil-split'
    | 'golden-spiral-balance'
    | 'percent-matrix-shimmer'
    | 'sulba-cord-squares'
    | 'compass-sector-wheel'
    | 'fractal-snowflake-bloom'
    | 'spline-fulcrum-wave'
    | 'meru-xray-pyramid'
    | 'tangram-shear-slice';
}

function getChapterVisualTheme(chapterId: string, title: string): ChapterVisualTheme {
  const key = `${chapterId} ${title}`.toLowerCase();

  if (key.includes('square') || key.includes('ch1-square-cube')) {
    return {
      bgGradient: 'linear-gradient(135deg, #1E1308 0%, #3B230E 48%, #162B24 100%)',
      accentHex: '#FBBF24',
      glowHex: 'rgba(251, 191, 36, 0.38)',
      badgeBg: 'bg-amber-400/20 border-amber-300/40',
      badgeText: 'text-amber-200',
      orbitFormulas: ['n² = 1 + 3 + 5 + … + (2n−1)', '1729 = 12³ + 1³ = 10³ + 9³', '√100 = 10', 'n³ Isometric Cube'],
      animationStyle: 'tesseract-wave',
    };
  }
  if (key.includes('power play') || key.includes('ch2-power-play')) {
    return {
      bgGradient: 'linear-gradient(135deg, #17102E 0%, #2E1B5B 52%, #0F2942 100%)',
      accentHex: '#38BDF8',
      glowHex: 'rgba(56, 189, 248, 0.38)',
      badgeBg: 'bg-sky-400/20 border-sky-300/40',
      badgeText: 'text-sky-200',
      orbitFormulas: ['aᵐ · aⁿ = aᵐ⁺ⁿ', '2⁴² Folds → Moon', 'a⁻ⁿ = 1 / aⁿ', 'c = 3 × 10⁸ m/s'],
      animationStyle: 'exponential-cascade',
    };
  }
  if (key.includes('story of numbers') || key.includes('ch3-story-numbers')) {
    return {
      bgGradient: 'linear-gradient(135deg, #271509 0%, #4A2511 50%, #1C2819 100%)',
      accentHex: '#F59E0B',
      glowHex: 'rgba(245, 158, 11, 0.4)',
      badgeBg: 'bg-amber-500/20 border-amber-300/40',
      badgeText: 'text-amber-200',
      orbitFormulas: ['Śūnya (0) · Brahmagupta 628 CE', 'Base-60 Cuneiform', 'Base-20 Mayan Shell', 'Place Value 10ⁿ'],
      animationStyle: 'ancient-glyph-morph',
    };
  }
  if (key.includes('quadrilateral') || key.includes('ch4-quadrilaterals')) {
    return {
      bgGradient: 'linear-gradient(135deg, #0D2622 0%, #134E4A 52%, #1E293B 100%)',
      accentHex: '#2DD4BF',
      glowHex: 'rgba(45, 212, 191, 0.38)',
      badgeBg: 'bg-teal-400/20 border-teal-300/40',
      badgeText: 'text-teal-200',
      orbitFormulas: ['∠A + ∠B + ∠C + ∠D = 360°', 'd₁ ⊥ d₂ in Rhombus', 'Parallelogram ↔ Rectangle', 'Isosceles Trapezium'],
      animationStyle: 'polygon-linkage',
    };
  }
  if (key.includes('number play') || key.includes('ch5-number-play')) {
    return {
      bgGradient: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #11302A 100%)',
      accentHex: '#A78BFA',
      glowHex: 'rgba(167, 139, 250, 0.38)',
      badgeBg: 'bg-violet-400/20 border-violet-300/40',
      badgeText: 'text-violet-200',
      orbitFormulas: ['N ≡ DigitSum (mod 9)', '111 = 3 × 37', 'Alternating Sum (mod 11)', 'Cryptarithm A + A + A'],
      animationStyle: 'cipher-clockwork',
    };
  }
  if (key.includes('distribute') || key.includes('ch6-we-distribute')) {
    return {
      bgGradient: 'linear-gradient(135deg, #2D121E 0%, #4C1D34 50%, #1E293B 100%)',
      accentHex: '#F472B6',
      glowHex: 'rgba(244, 114, 182, 0.38)',
      badgeBg: 'bg-pink-400/20 border-pink-300/40',
      badgeText: 'text-pink-200',
      orbitFormulas: ['(a + b)² = a² + 2ab + b²', 'a² − b² = (a + b)(a − b)', 'a(b + c) = ab + ac', '(n + 1)² − n² = 2n + 1'],
      animationStyle: 'area-foil-split',
    };
  }
  if (key.includes('fractions in disguise') || key.includes('ch4-fractions-disguise')) {
    return {
      bgGradient: 'linear-gradient(135deg, #1A240E 0%, #2E4214 50%, #13312A 100%)',
      accentHex: '#A3E635',
      glowHex: 'rgba(163, 230, 53, 0.36)',
      badgeBg: 'bg-lime-400/20 border-lime-300/40',
      badgeText: 'text-lime-200',
      orbitFormulas: ['x% = x / 100', 'A = P(1 + R/100)ⁿ', 'SP = MP × (1 − d%)', '+20% then −20% = −4%'],
      animationStyle: 'percent-matrix-shimmer',
    };
  }
  if (key.includes('baudh') || key.includes('pythagor')) {
    return {
      bgGradient: 'linear-gradient(135deg, #2A1608 0%, #4D270E 52%, #192436 100%)',
      accentHex: '#FB923C',
      glowHex: 'rgba(251, 146, 60, 0.4)',
      badgeBg: 'bg-orange-400/20 border-orange-300/40',
      badgeText: 'text-orange-200',
      orbitFormulas: ['a² + b² = c²', 'Diagonal = a√2 (Śulba-Sūtra)', '(2m, m²−1, m²+1)', 'Spiral of Theodorus √n'],
      animationStyle: 'sulba-cord-squares',
    };
  }
  if (key.includes('proportional reasoning 2') || key.includes('ch6-proportional-reasoning')) {
    return {
      bgGradient: 'linear-gradient(135deg, #0C2538 0%, #164463 50%, #1A2E26 100%)',
      accentHex: '#38BDF8',
      glowHex: 'rgba(56, 189, 248, 0.38)',
      badgeBg: 'bg-sky-400/20 border-sky-300/40',
      badgeText: 'text-sky-200',
      orbitFormulas: ['θ = (Value / Total) × 360°', 'Area Scale = k²', 'x₁ · y₁ = x₂ · y₂ = k', 'Rate = 1/t₁ + 1/t₂'],
      animationStyle: 'compass-sector-wheel',
    };
  }
  if (key.includes('geometric themes') || key.includes('ch11-geometric-themes')) {
    return {
      bgGradient: 'linear-gradient(135deg, #161F38 0%, #243660 50%, #10352E 100%)',
      accentHex: '#60A5FA',
      glowHex: 'rgba(96, 165, 250, 0.38)',
      badgeBg: 'bg-blue-400/20 border-blue-300/40',
      badgeText: 'text-blue-200',
      orbitFormulas: ['Koch Perimeter × (4/3)ⁿ', 'Menger Carpet 8ⁿ', 'd = √((l+h)² + w²)', 'Front · Top · Side Views'],
      animationStyle: 'fractal-snowflake-bloom',
    };
  }
  if (key.includes('dots and lines') || key.includes('ch12-dots-and-lines')) {
    return {
      bgGradient: 'linear-gradient(135deg, #10262B 0%, #1B424A 50%, #241C35 100%)',
      accentHex: '#34D399',
      glowHex: 'rgba(52, 211, 153, 0.38)',
      badgeBg: 'bg-emerald-400/20 border-emerald-300/40',
      badgeText: 'text-emerald-200',
      orbitFormulas: ['x̄ = (Σxᵢ) / n', 'IQR = Q₃ − Q₁', 'Σ(xᵢ − x̄) = 0', '=AVERAGE(B2:B10)'],
      animationStyle: 'spline-fulcrum-wave',
    };
  }
  if (key.includes('algebra play') || key.includes('ch13-algebra-play')) {
    return {
      bgGradient: 'linear-gradient(135deg, #26142B 0%, #44204D 50%, #162B38 100%)',
      accentHex: '#FBBF24',
      glowHex: 'rgba(251, 191, 36, 0.4)',
      badgeBg: 'bg-amber-400/20 border-amber-300/40',
      badgeText: 'text-amber-200',
      orbitFormulas: ['Birthday = 100M + D', 'Meru Apex = a + 2b + c', '3×3 Calendar Sum = 9c', 'Genie: 8x − 210 = 0'],
      animationStyle: 'meru-xray-pyramid',
    };
  }
  if (key.includes('area') || key.includes('ch14-area')) {
    return {
      bgGradient: 'linear-gradient(135deg, #132A1E 0%, #1E4631 50%, #2C1E12 100%)',
      accentHex: '#4ADE80',
      glowHex: 'rgba(74, 222, 128, 0.38)',
      badgeBg: 'bg-emerald-400/20 border-emerald-300/40',
      badgeText: 'text-emerald-200',
      orbitFormulas: ['Triangle = ½ · b · h', 'Trapezium = ½h(a + b)', 'Rhombus = ½ · d₁ · d₂', '1 Hectare = 10,000 m²'],
      animationStyle: 'tangram-shear-slice',
    };
  }

  return {
    bgGradient: 'linear-gradient(135deg, #17253B 0%, #1E3A5F 50%, #134E4A 100%)',
    accentHex: '#2DD4BF',
    glowHex: 'rgba(45, 212, 191, 0.38)',
    badgeBg: 'bg-teal-400/20 border-teal-300/40',
    badgeText: 'text-teal-200',
    orbitFormulas: ['a : b = c : d', 'Phala = (Icchā × Phala) / Pramāṇa', 'x₁ · y₁ = x₂ · y₂', 'Golden Ratio φ'],
    animationStyle: 'golden-spiral-balance',
  };
}

export const AnimatedChapterBanner: React.FC<AnimatedChapterBannerProps> = ({
  chapterId,
  chapterIndex,
  partLabel,
  title,
  subtitle,
  ribbonText,
  moduleCount,
  selectedModuleCode,
}) => {
  const [animKey, setAnimKey] = useState(0);
  const [activeFormulaIdx, setActiveFormulaIdx] = useState(0);
  const theme = getChapterVisualTheme(chapterId, title);
  const formattedTitle = formatMathText(title);
  const titleWords = formattedTitle.split(' ');

  useEffect(() => {
    setAnimKey((prev) => prev + 1);
    setActiveFormulaIdx(0);
  }, [chapterId, title]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFormulaIdx((prev) => (prev + 1) % theme.orbitFormulas.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [theme.orbitFormulas.length]);

  return (
    <div
      key={animKey}
      className="relative rounded-3xl overflow-hidden border border-stone-300/80 shadow-lg text-white px-6 sm:px-9 py-7 transition-all duration-300"
      style={{ background: theme.bgGradient }}
    >
      {/* Bespoke Chapter-Specific Animated SVG Mathematical Stage Backdrop */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
        viewBox="0 0 960 240"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`glow-${chapterId}`} cx="75%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.accentHex} stopOpacity="0.45" />
            <stop offset="100%" stopColor={theme.accentHex} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="960" height="240" fill={`url(#glow-${chapterId})`} />

        {/* Subtle Geometric Grid Lines */}
        <g stroke="rgba(255,255,255,0.08)" strokeWidth="1">
          <line x1="0" y1="60" x2="960" y2="60" />
          <line x1="0" y1="120" x2="960" y2="120" />
          <line x1="0" y1="180" x2="960" y2="180" />
          <line x1="640" y1="0" x2="640" y2="240" />
          <line x1="760" y1="0" x2="760" y2="240" />
          <line x1="880" y1="0" x2="880" y2="240" />
        </g>

        {/* Right-Side Chapter Signature Animated Emblem */}
        {theme.animationStyle === 'tesseract-wave' && (
          <g transform="translate(790, 120)" stroke={theme.accentHex} fill="none" strokeWidth="2">
            <rect x="-58" y="-58" width="76" height="76" opacity="0.7">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="28s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="-24" y="-24" width="76" height="76" stroke="#FEF08A" opacity="0.85" />
            <line x1="-58" y1="-58" x2="-24" y2="-24" />
            <line x1="18" y1="-58" x2="52" y2="-24" />
            <line x1="-58" y1="18" x2="-24" y2="52" />
            <line x1="18" y1="18" x2="52" y2="52" />
          </g>
        )}

        {theme.animationStyle === 'exponential-cascade' && (
          <g transform="translate(780, 120)" stroke={theme.accentHex} fill="none" strokeWidth="2">
            <ellipse rx="110" ry="42" transform="rotate(-18)" opacity="0.6" />
            <ellipse rx="110" ry="42" transform="rotate(42)" opacity="0.6" />
            <ellipse rx="110" ry="42" transform="rotate(102)" opacity="0.6" />
            <circle r="16" fill={theme.accentHex} opacity="0.45" />
          </g>
        )}

        {theme.animationStyle === 'sulba-cord-squares' && (
          <g transform="translate(760, 130)" stroke={theme.accentHex} fill="none" strokeWidth="2.2">
            <polygon points="0,0 72,0 0,-54" fill="rgba(251,146,60,0.22)" />
            <rect x="0" y="0" width="72" height="72" opacity="0.55" />
            <rect x="-54" y="-54" width="54" height="54" opacity="0.55" />
          </g>
        )}

        {theme.animationStyle === 'meru-xray-pyramid' && (
          <g transform="translate(785, 125)" stroke={theme.accentHex} fill="rgba(251,191,36,0.12)" strokeWidth="2">
            <rect x="-35" y="-68" width="70" height="32" rx="6" />
            <rect x="-74" y="-30" width="70" height="32" rx="6" />
            <rect x="4" y="-30" width="70" height="32" rx="6" />
            <rect x="-112" y="8" width="70" height="32" rx="6" />
            <rect x="-35" y="8" width="70" height="32" rx="6" />
            <rect x="42" y="8" width="70" height="32" rx="6" />
          </g>
        )}

        {theme.animationStyle !== 'tesseract-wave' &&
          theme.animationStyle !== 'exponential-cascade' &&
          theme.animationStyle !== 'sulba-cord-squares' &&
          theme.animationStyle !== 'meru-xray-pyramid' && (
            <g transform="translate(790, 120)" stroke={theme.accentHex} fill="none" strokeWidth="1.8">
              <circle r="78" strokeDasharray="8 6" opacity="0.65">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0"
                  to="360"
                  dur="24s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="52" opacity="0.45" />
              <polygon points="0,-68 59,34 -59,34" opacity="0.5" />
              <polygon points="0,68 59,-34 -59,-34" opacity="0.5" />
            </g>
          )}
      </svg>

      {/* Foreground Content: Pure Chapter Identity & Kinetic Animated Chapter Name */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          {/* Quiet Unboxed Editorial Kicker with Typographic Separators */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold tracking-wide text-amber-200/95">
            <Sparkles className="w-4 h-4 shrink-0" style={{ color: theme.accentHex }} />
            <span>{partLabel}</span>
            <span aria-hidden="true">·</span>
            <span>Chapter {chapterIndex}</span>
            <span aria-hidden="true">·</span>
            <span className="text-white/80">{formatMathText(ribbonText)}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-300">
              {selectedModuleCode ? `Viewing ${selectedModuleCode}` : `${moduleCount} Interactive Modules`}
            </span>
          </div>

          {/* KINETIC ANIMATED CHAPTER NAME — Each word & letter animates with chapter-specific energy */}
          <h1
            aria-label={formattedTitle}
            className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-[1.12] flex flex-wrap items-baseline gap-x-3 gap-y-1"
          >
            {titleWords.map((word, wIdx) => (
              <span
                key={`${chapterId}-w-${wIdx}`}
                className="inline-flex items-baseline chapter-word-reveal"
                style={{
                  animationDelay: `${wIdx * 75}ms`,
                }}
              >
                {word.split('').map((ch, cIdx) => (
                  <span
                    key={`${chapterId}-c-${wIdx}-${cIdx}`}
                    className="inline-block transition-transform duration-200 hover:-translate-y-1.5 hover:scale-110"
                    style={{
                      color:
                        wIdx === titleWords.length - 1
                          ? theme.accentHex
                          : '#FFFFFF',
                      textShadow:
                        wIdx === titleWords.length - 1
                          ? `0 0 24px ${theme.glowHex}`
                          : '0 2px 10px rgba(0,0,0,0.35)',
                    }}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          {/* Animated Glowing Mathematical Underline Sweep */}
          <div className="relative h-1.5 w-56 sm:w-72 rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full rounded-full chapter-underline-sweep"
              style={{
                background: `linear-gradient(90deg, transparent, ${theme.accentHex}, #FEF08A, transparent)`,
              }}
            />
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-2xl pt-0.5">
            {formatMathText(subtitle)}
          </p>
        </div>

        {/* Right-Side Live Orbiting Chapter Formula Showcase Card */}
        <div className="lg:w-72 shrink-0 rounded-2xl bg-black/35 backdrop-blur-xs border border-white/15 p-4 space-y-2.5 self-start lg:self-center">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" style={{ color: theme.accentHex }} />
              <span>Chapter Law Spotlight</span>
            </span>
            <span className="font-mono tabular-nums text-white/60">
              {activeFormulaIdx + 1}/{theme.orbitFormulas.length}
            </span>
          </div>

          <div
            key={activeFormulaIdx}
            className="min-h-[48px] flex items-center justify-center px-3 py-2.5 rounded-xl bg-white/10 border border-white/10 font-mono text-sm sm:text-base font-bold text-center text-amber-200 chapter-formula-fade"
          >
            {theme.orbitFormulas[activeFormulaIdx]}
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/75 pt-0.5">
            <span className="inline-flex items-center gap-1">
              <Layers className="w-3 h-3 text-teal-300" />
              <span>25s Gist + {moduleCount} Labs</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-amber-300" />
              <span>NCERT Class 8</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
