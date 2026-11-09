import React from 'react';
import { formatMathText } from '../utils/formatMath';

interface ModuleTitleArtworkProps {
  chapterId: string;
  moduleCode: string;
  moduleTitle: string;
  moduleIndex: number;
}

// 16 rich, high-contrast color palettes combined with chapter/module offsets so every single module has a distinct atmosphere
const ARTWORK_PALETTES = [
  { bg: 'from-[#092C2E] via-[#0F5257] to-[#0D9488]', accent: '#5EEAD4', gold: '#FDE047', glow: '#2DD4BF' },
  { bg: 'from-[#451A03] via-[#92400E] to-[#D97706]', accent: '#FDE68A', gold: '#FEF08A', glow: '#F59E0B' },
  { bg: 'from-[#1E1B4B] via-[#312E81] to-[#4F46E5]', accent: '#C7D2FE', gold: '#FDE047', glow: '#818CF8' },
  { bg: 'from-[#064E3B] via-[#047857] to-[#10B981]', accent: '#A7F3D0', gold: '#FEF08A', glow: '#34D399' },
  { bg: 'from-[#3B0764] via-[#6B21A8] to-[#9333EA]', accent: '#E9D5FF', gold: '#FDE047', glow: '#C084FC' },
  { bg: 'from-[#0C4A6E] via-[#0369A1] to-[#0284C7]', accent: '#BAE6FD', gold: '#FEF08A', glow: '#38BDF8' },
  { bg: 'from-[#500724] via-[#9D174D] to-[#E11D48]', accent: '#FECDD3', gold: '#FDE047', glow: '#FB7185' },
  { bg: 'from-[#1C1917] via-[#44403C] to-[#0F766E]', accent: '#5EEAD4', gold: '#FBBF24', glow: '#14B8A6' },
  { bg: 'from-[#172554] via-[#1D4ED8] to-[#2563EB]', accent: '#BFDBFE', gold: '#FDE047', glow: '#60A5FA' },
  { bg: 'from-[#3F2E04] via-[#854D0E] to-[#CA8A04]', accent: '#FEF08A', gold: '#FFFFFF', glow: '#FACC15' },
  { bg: 'from-[#2E1065] via-[#5B21B6] to-[#7C3AED]', accent: '#DDD6FE', gold: '#FDE047', glow: '#A78BFA' },
  { bg: 'from-[#042F2E] via-[#115E59] to-[#059669]', accent: '#99F6E4', gold: '#FDE047', glow: '#2DD4BF' },
  { bg: 'from-[#4C0519] via-[#881337] to-[#BE123C]', accent: '#FFE4E6', gold: '#FDE047', glow: '#F43F5E' },
  { bg: 'from-[#0F172A] via-[#1E293B] to-[#334155]', accent: '#93C5FD', gold: '#FDE047', glow: '#38BDF8' },
];

export const ModuleTitleArtwork: React.FC<ModuleTitleArtworkProps> = ({
  chapterId,
  moduleCode,
  moduleTitle,
  moduleIndex,
}) => {
  const shortNum = moduleCode.replace('Module ', '').trim();
  const titleLower = moduleTitle.toLowerCase();

  // Compute a deterministic, unique hash for each of the 112+ modules
  const uniqueKey = `${chapterId}:${shortNum}:${moduleTitle}`;
  let hash = 0;
  for (let i = 0; i < uniqueKey.length; i++) {
    hash = (hash * 31 + uniqueKey.charCodeAt(i)) >>> 0;
  }
  const pal = ARTWORK_PALETTES[(hash + moduleIndex * 3) % ARTWORK_PALETTES.length];

  // Classify each module's exact title into a bespoke reimagined visual illustration
  const renderSpecificScene = () => {
    // =========================================================================
    // PART I · CHAPTER 1: A SQUARE AND A CUBE (Modules 1.1 – 1.8)
    // =========================================================================
    if (titleLower.includes('square numbers & factors')) {
      return (
        <g>
          {/* 100 Lockers Doors + Factor Pair Rainbow Arcs */}
          {[0, 1, 2, 3, 4].map((i) => {
            const isOpen = i === 0 || i === 1 || i === 3;
            return (
              <g key={i} transform={`translate(${24 + i * 34}, 28)`}>
                <rect
                  width="26"
                  height="52"
                  rx="4"
                  fill={isOpen ? pal.gold : 'rgba(255,255,255,0.12)'}
                  stroke={pal.accent}
                  strokeWidth="1.5"
                />
                <text
                  x="13"
                  y="30"
                  textAnchor="middle"
                  fill={isOpen ? '#1C1917' : '#FFFFFF'}
                  fontSize="11"
                  fontWeight="bold"
                >
                  {[1, 4, 6, 9, 12][i]}
                </text>
              </g>
            );
          })}
          <path d="M 37 26 Q 88 2 139 26" fill="none" stroke={pal.gold} strokeWidth="2" strokeDasharray="3 2" />
          <text x="216" y="52" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">
            1, 4, 9, 16
          </text>
          <text x="216" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11">
            Odd Factors
          </text>
        </g>
      );
    }

    if (titleLower.includes('patterns & properties of perfect squares')) {
      return (
        <g>
          {/* Allowed Ending Digits 0,1,4,5,6,9 vs Forbidden 2,3,7,8 */}
          {[0, 1, 4, 5, 6, 9].map((d, i) => (
            <g key={d} transform={`translate(${20 + i * 26}, 26)`}>
              <circle cx="12" cy="14" r="11" fill={pal.gold} />
              <text x="12" y="18" textAnchor="middle" fill="#1C1917" fontSize="12" fontWeight="bold">
                {d}
              </text>
            </g>
          ))}
          {[2, 3, 7, 8].map((d, i) => (
            <g key={d} transform={`translate(${45 + i * 32}, 68)`}>
              <circle cx="12" cy="14" r="11" fill="rgba(244,63,94,0.35)" stroke="#FDA4AF" strokeWidth="1.5" />
              <text x="12" y="18" textAnchor="middle" fill="#FFE4E6" fontSize="11" fontWeight="bold">
                ≠{d}
              </text>
            </g>
          ))}
          <text x="215" y="58" textAnchor="middle" fill={pal.accent} fontSize="13" fontWeight="bold">
            Ends in
          </text>
          <text x="215" y="76" textAnchor="middle" fill={pal.gold} fontSize="13" fontWeight="bold">
            0,1,4,5,6,9
          </text>
        </g>
      );
    }

    if (titleLower.includes('perfect squares & odd numbers')) {
      return (
        <g>
          {/* Nested L-shaped Gnomons: 1 + 3 + 5 + 7 = 4² */}
          <rect x="34" y="20" width="76" height="76" rx="6" fill="rgba(255,255,255,0.12)" stroke={pal.accent} strokeWidth="2" />
          <rect x="34" y="20" width="57" height="57" rx="5" fill="rgba(255,255,255,0.2)" stroke={pal.gold} strokeWidth="1.8" />
          <rect x="34" y="20" width="38" height="38" rx="4" fill="rgba(253,224,71,0.45)" stroke="#FFFFFF" strokeWidth="1.5" />
          <rect x="34" y="20" width="19" height="19" rx="3" fill={pal.gold} />
          <text x="182" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="bold">
            1 + 3 + 5 + 7
          </text>
          <text x="182" y="76" textAnchor="middle" fill={pal.gold} fontSize="19" fontWeight="bold">
            = 4² = 16
          </text>
        </g>
      );
    }

    if (titleLower.includes('square roots & estimation')) {
      return (
        <g>
          {/* Radical symbol √ + Prime Pair Tree */}
          <path d="M 28 65 L 40 65 L 52 90 L 68 26 L 145 26" fill="none" stroke={pal.gold} strokeWidth="3.5" strokeLinecap="round" />
          <text x="104" y="68" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="bold">
            324 = 18
          </text>
          <circle cx="195" cy="36" r="14" fill={pal.gold} />
          <line x1="195" y1="50" x2="175" y2="78" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="195" y1="50" x2="215" y2="78" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="175" cy="82" r="11" fill={pal.accent} />
          <circle cx="215" cy="82" r="11" fill={pal.accent} />
          <text x="175" y="86" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="bold">p</text>
          <text x="215" y="86" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="bold">p</text>
        </g>
      );
    }

    if (titleLower.includes('introduction to cubic numbers')) {
      return (
        <g>
          {/* 3D Isometric 3x3x3 Cube */}
          <polygon points="95,18 145,42 95,66 45,42" fill={pal.accent} opacity="0.9" stroke="#FFFFFF" strokeWidth="1.5" />
          <polygon points="45,42 95,66 95,112 45,88" fill="rgba(0,0,0,0.38)" stroke="#FFFFFF" strokeWidth="1.5" />
          <polygon points="145,42 95,66 95,112 145,88" fill={pal.gold} opacity="0.9" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="95" y="48" textAnchor="middle" fill="#0F172A" fontSize="14" fontWeight="bold">3×3×3</text>
          <text x="200" y="56" textAnchor="middle" fill={pal.gold} fontSize="20" fontWeight="bold">n³ = 27</text>
          <text x="200" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="11">3D Volume Cube</text>
        </g>
      );
    }

    if (titleLower.includes('taxicab numbers & ramanujan')) {
      return (
        <g>
          {/* Hardy-Ramanujan Taxicab 1729 */}
          <rect x="24" y="28" width="112" height="54" rx="10" fill={pal.gold} stroke="#FFFFFF" strokeWidth="2.5" />
          <text x="80" y="46" textAnchor="middle" fill="#1C1917" fontSize="10" fontWeight="bold">TAXICAB NO.</text>
          <text x="80" y="72" textAnchor="middle" fill="#1C1917" fontSize="24" fontWeight="bold">1729</text>
          <text x="195" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">1³ + 12³</text>
          <text x="195" y="74" textAnchor="middle" fill={pal.accent} fontSize="14" fontWeight="bold">= 9³ + 10³</text>
        </g>
      );
    }

    if (titleLower.includes('cube roots & successive differences')) {
      return (
        <g>
          {/* Cube Root ∛ + Consecutive Odd Sum 7+9+11 = 3³ */}
          <text x="72" y="58" textAnchor="middle" fill={pal.gold} fontSize="24" fontWeight="bold">∛1728 = 12</text>
          <rect x="148" y="24" width="90" height="24" rx="6" fill="rgba(255,255,255,0.16)" stroke={pal.accent} />
          <text x="193" y="40" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">7 + 9 + 11 = 3³</text>
          <rect x="140" y="56" width="104" height="24" rx="6" fill="rgba(253,224,71,0.22)" stroke={pal.gold} />
          <text x="192" y="72" textAnchor="middle" fill={pal.gold} fontSize="11" fontWeight="bold">13+15+17+19 = 4³</text>
        </g>
      );
    }

    // =========================================================================
    // PART I · CHAPTER 2: POWER PLAY (Modules 2.1 – 2.8)
    // =========================================================================
    if (titleLower.includes('multiplicative growth')) {
      return (
        <g>
          {/* Exponential Folding Curve */}
          {[1, 2, 4, 8, 16, 32].map((h, i) => (
            <rect
              key={i}
              x={28 + i * 24}
              y={94 - h * 2.1}
              width="16"
              height={h * 2.1}
              rx="3"
              fill={i === 5 ? pal.gold : pal.accent}
              opacity={0.45 + i * 0.1}
            />
          ))}
          <path d="M 36 90 Q 95 82 156 26" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="212" cy="36" r="18" fill="#FEF08A" />
          <text x="212" y="80" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">2³⁰ → Moon</text>
        </g>
      );
    }

    if (titleLower.includes('exponential notation & bases')) {
      return (
        <g>
          <rect x="34" y="24" width="76" height="68" rx="12" fill="rgba(255,255,255,0.14)" stroke={pal.accent} strokeWidth="2" />
          <text x="64" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="38" fontWeight="bold">a</text>
          <circle cx="92" cy="40" r="13" fill={pal.gold} />
          <text x="92" y="45" textAnchor="middle" fill="#1C1917" fontSize="15" fontWeight="bold">n</text>
          <text x="184" y="54" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">a × a × … × a</text>
          <text x="184" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="12">(n factors)</text>
        </g>
      );
    }

    if (titleLower.includes('laws of exponents (multiplication & division)')) {
      return (
        <g>
          <rect x="22" y="24" width="102" height="32" rx="8" fill="rgba(253,224,71,0.22)" stroke={pal.gold} strokeWidth="1.5" />
          <text x="73" y="45" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">aᵐ · aⁿ = aᵐ⁺ⁿ</text>
          <rect x="22" y="62" width="102" height="32" rx="8" fill="rgba(255,255,255,0.15)" stroke={pal.accent} strokeWidth="1.5" />
          <text x="73" y="83" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">aᵐ ÷ aⁿ = aᵐ⁻ⁿ</text>
          <circle cx="195" cy="58" r="32" fill="rgba(0,0,0,0.3)" stroke={pal.gold} strokeWidth="2" />
          <text x="195" y="63" textAnchor="middle" fill={pal.accent} fontSize="14" fontWeight="bold">m ± n</text>
        </g>
      );
    }

    if (titleLower.includes('power of a power & product of powers')) {
      return (
        <g>
          <circle cx="78" cy="58" r="36" fill="none" stroke={pal.gold} strokeWidth="2.5" strokeDasharray="5 3" />
          <circle cx="78" cy="58" r="22" fill="rgba(255,255,255,0.18)" stroke={pal.accent} strokeWidth="2" />
          <text x="78" y="63" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">(aᵐ)ⁿ</text>
          <text x="188" y="48" textAnchor="middle" fill={pal.gold} fontSize="16" fontWeight="bold">= aᵐⁿ</text>
          <text x="188" y="76" textAnchor="middle" fill={pal.accent} fontSize="14" fontWeight="bold">(ab)ᵐ = aᵐbᵐ</text>
        </g>
      );
    }

    if (titleLower.includes('zero and negative exponents')) {
      return (
        <g>
          <line x1="25" y1="58" x2="235" y2="58" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          <circle cx="130" cy="58" r="22" fill={pal.gold} />
          <text x="130" y="63" textAnchor="middle" fill="#1C1917" fontSize="13" fontWeight="bold">a⁰ = 1</text>
          <text x="60" y="42" textAnchor="middle" fill={pal.accent} fontSize="13" fontWeight="bold">a⁻ⁿ = 1/aⁿ</text>
          <text x="200" y="42" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">a⁺ⁿ</text>
        </g>
      );
    }

    if (titleLower.includes('scientific notation & standard form')) {
      return (
        <g>
          <circle cx="52" cy="58" r="20" fill={pal.gold} />
          <circle cx="52" cy="58" r="32" fill="none" stroke="rgba(253,224,71,0.35)" strokeWidth="2" strokeDasharray="4 3" />
          <line x1="86" y1="58" x2="145" y2="58" stroke={pal.accent} strokeWidth="2.5" strokeDasharray="4 2" />
          <circle cx="156" cy="58" r="8" fill={pal.accent} />
          <text x="195" y="48" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">m × 10ⁿ</text>
          <text x="195" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="11">1 ≤ m &lt; 10</text>
        </g>
      );
    }

    if (titleLower.includes('large numbers & thought experiments')) {
      return (
        <g>
          {/* Chessboard 2^64 Doubling Grid */}
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={28 + c * 20}
                y={18 + r * 20}
                width="19"
                height="19"
                fill={(r + c) % 2 === 0 ? pal.gold : 'rgba(0,0,0,0.45)'}
              />
            ))
          )}
          <text x="180" y="52" textAnchor="middle" fill={pal.gold} fontSize="18" fontWeight="bold">2⁶⁴ − 1</text>
          <text x="180" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="12">Chessboard Grains</text>
        </g>
      );
    }

    // =========================================================================
    // PART I · CHAPTER 3: A STORY OF NUMBERS (Modules 3.1 – 3.8)
    // =========================================================================
    if (titleLower.includes('mechanism of counting')) {
      return (
        <g>
          {/* 1-to-1 Pebble Pairing */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <circle cx={42 + i * 32} cy="34" r="9" fill="#FFFFFF" />
              <line x1={42 + i * 32} y1="45" x2={42 + i * 32} y2="68" stroke={pal.gold} strokeWidth="2" strokeDasharray="3 2" />
              <ellipse cx={42 + i * 32} cy="80" rx="11" ry="7" fill={pal.accent} />
            </g>
          ))}
          <text x="206" y="56" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">1 - to - 1</text>
          <text x="206" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="11">Pebble Match</text>
        </g>
      );
    }

    if (titleLower.includes('early number systems')) {
      return (
        <g>
          {/* Tally Bundles ||||/ & Ishango Bone */}
          {[0, 1].map((b) => (
            <g key={b} transform={`translate(${32 + b * 62}, 32)`}>
              {[0, 1, 2, 3].map((l) => (
                <line key={l} x1={l * 10} y1="0" x2={l * 10} y2="42" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
              ))}
              <line x1="-5" y1="36" x2="36" y2="6" stroke={pal.gold} strokeWidth="3.5" strokeLinecap="round" />
            </g>
          ))}
          <text x="200" y="56" textAnchor="middle" fill={pal.gold} fontSize="16" fontWeight="bold">5 + 5 = 10</text>
          <text x="200" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="11">Tally Bundles</text>
        </g>
      );
    }

    if (titleLower.includes('grouping & number names')) {
      return (
        <g>
          {/* Base-2 Pairs and Base-5 Clusters */}
          {[0, 1, 2].map((g) => (
            <g key={g} transform={`translate(${26 + g * 44}, 36)`}>
              <rect x="0" y="0" width="36" height="44" rx="8" fill="rgba(255,255,255,0.14)" stroke={pal.accent} strokeWidth="1.5" />
              <circle cx="11" cy="22" r="5" fill={pal.gold} />
              <circle cx="25" cy="22" r="5" fill={pal.gold} />
            </g>
          ))}
          <text x="205" y="54" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">Base-2 &amp; 5</text>
          <text x="205" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11">Grouping</text>
        </g>
      );
    }

    if (titleLower.includes('roman numerals')) {
      return (
        <g>
          <polygon points="30,32 135,14 240,32" fill="rgba(255,255,255,0.18)" stroke={pal.gold} strokeWidth="2" />
          <rect x="42" y="34" width="186" height="52" rx="6" fill="rgba(0,0,0,0.3)" stroke={pal.accent} strokeWidth="1.5" />
          <text x="135" y="68" textAnchor="middle" fill={pal.gold} fontSize="22" fontWeight="bold" letterSpacing="3">
            MCMXCIX
          </text>
        </g>
      );
    }

    if (titleLower.includes('idea of a base')) {
      return (
        <g>
          {/* Powers of Base b^0, b^1, b^2, b^3 */}
          {['b³', 'b²', 'b¹', 'b⁰'].map((lbl, i) => (
            <g key={lbl} transform={`translate(${24 + i * 54}, 30)`}>
              <rect width="46" height="52" rx="8" fill="rgba(255,255,255,0.15)" stroke={i === 0 ? pal.gold : pal.accent} strokeWidth="2" />
              <text x="23" y="33" textAnchor="middle" fill={i === 0 ? pal.gold : '#FFFFFF'} fontSize="17" fontWeight="bold">
                {lbl}
              </text>
            </g>
          ))}
        </g>
      );
    }

    if (titleLower.includes('positional place value') || titleLower.includes('base-60')) {
      return (
        <g>
          <circle cx="72" cy="56" r="36" fill="rgba(0,0,0,0.32)" stroke={pal.gold} strokeWidth="2.5" />
          <line x1="72" y1="56" x2="72" y2="30" stroke={pal.gold} strokeWidth="3" strokeLinecap="round" />
          <line x1="72" y1="56" x2="94" y2="56" stroke={pal.accent} strokeWidth="2.5" strokeLinecap="round" />
          <text x="182" y="52" textAnchor="middle" fill={pal.gold} fontSize="18" fontWeight="bold">Base - 60</text>
          <text x="182" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12">Sexagesimal</text>
        </g>
      );
    }

    if (titleLower.includes('hindu number system & zero')) {
      return (
        <g>
          <circle cx="76" cy="56" r="32" fill="rgba(253,224,71,0.2)" stroke={pal.gold} strokeWidth="4" />
          <text x="76" y="68" textAnchor="middle" fill={pal.gold} fontSize="34" fontWeight="bold">0</text>
          <text x="182" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold">Śūnya (Zero)</text>
          <text x="182" y="72" textAnchor="middle" fill={pal.accent} fontSize="13" fontWeight="bold">0 1 2 3 4 5 6 7 8 9</text>
        </g>
      );
    }

    // =========================================================================
    // PART I · CHAPTER 4: QUADRILATERALS (Modules 4.1 – 4.8)
    // =========================================================================
    if (titleLower.includes('introduction to quadrilaterals & rectangles')) {
      return (
        <g>
          <rect x="36" y="24" width="116" height="66" fill="rgba(255,255,255,0.14)" stroke="#FFFFFF" strokeWidth="2.5" />
          <line x1="36" y1="24" x2="152" y2="90" stroke={pal.gold} strokeWidth="2" />
          <line x1="152" y1="24" x2="36" y2="90" stroke={pal.gold} strokeWidth="2" />
          <rect x="36" y="24" width="10" height="10" fill="none" stroke={pal.accent} strokeWidth="1.5" />
          <text x="206" y="54" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">AC = BD</text>
          <text x="206" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11">All Angles 90°</text>
        </g>
      );
    }

    if (titleLower.includes('rectangle properties & congruence')) {
      return (
        <g>
          <polygon points="36,24 148,24 36,90" fill="rgba(94,234,212,0.3)" stroke={pal.accent} strokeWidth="2" />
          <polygon points="148,24 148,90 36,90" fill="rgba(253,224,71,0.3)" stroke={pal.gold} strokeWidth="2" />
          <text x="204" y="54" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">△ABC ≅ △CDA</text>
          <text x="204" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="11">SAS / ASA Proof</text>
        </g>
      );
    }

    if (titleLower.includes('squares & special rectangles')) {
      return (
        <g>
          <rect x="52" y="20" width="74" height="74" fill="rgba(255,255,255,0.16)" stroke={pal.gold} strokeWidth="2.5" />
          <line x1="52" y1="20" x2="126" y2="94" stroke={pal.accent} strokeWidth="2" />
          <line x1="126" y1="20" x2="52" y2="94" stroke={pal.accent} strokeWidth="2" />
          <text x="195" y="52" textAnchor="middle" fill={pal.gold} fontSize="16" fontWeight="bold">45° / 90°</text>
          <text x="195" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12">Equal Sides</text>
        </g>
      );
    }

    if (titleLower.includes('angle sum property of quadrilaterals')) {
      return (
        <g>
          <polygon points="36,86 64,22 142,30 156,88" fill="rgba(255,255,255,0.15)" stroke="#FFFFFF" strokeWidth="2.5" />
          <line x1="36" y1="86" x2="142" y2="30" stroke={pal.gold} strokeWidth="2" strokeDasharray="4 3" />
          <text x="80" y="48" textAnchor="middle" fill={pal.accent} fontSize="12" fontWeight="bold">180°</text>
          <text x="114" y="76" textAnchor="middle" fill={pal.gold} fontSize="12" fontWeight="bold">180°</text>
          <text x="208" y="62" textAnchor="middle" fill={pal.gold} fontSize="18" fontWeight="bold">∑ = 360°</text>
        </g>
      );
    }

    if (titleLower.includes('parallelograms & parallel properties')) {
      return (
        <g>
          <polygon points="56,26 158,26 132,88 30,88" fill="rgba(255,255,255,0.16)" stroke={pal.accent} strokeWidth="2.5" />
          <line x1="56" y1="26" x2="132" y2="88" stroke={pal.gold} strokeWidth="1.8" />
          <line x1="158" y1="26" x2="30" y2="88" stroke={pal.gold} strokeWidth="1.8" />
          <text x="208" y="52" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">∠A + ∠B</text>
          <text x="208" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="bold">= 180°</text>
        </g>
      );
    }

    if (titleLower.includes('rhombuses & perpendicular diagonals')) {
      return (
        <g>
          <polygon points="92,16 144,56 92,96 40,56" fill="rgba(253,224,71,0.22)" stroke={pal.gold} strokeWidth="2.5" />
          <line x1="40" y1="56" x2="144" y2="56" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="92" y1="16" x2="92" y2="96" stroke="#FFFFFF" strokeWidth="2" />
          <rect x="92" y="46" width="10" height="10" fill="none" stroke={pal.accent} strokeWidth="2" />
          <text x="204" y="58" textAnchor="middle" fill={pal.gold} fontSize="16" fontWeight="bold">d₁ ⊥ d₂</text>
        </g>
      );
    }

    if (titleLower.includes('kites & trapeziums')) {
      return (
        <g>
          <polygon points="62,18 94,48 62,96 30,48" fill="rgba(94,234,212,0.28)" stroke={pal.accent} strokeWidth="2" />
          <polygon points="145,30 205,30 225,88 125,88" fill="rgba(253,224,71,0.25)" stroke={pal.gold} strokeWidth="2" />
          <text x="175" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">AB ∥ DC</text>
        </g>
      );
    }

    // =========================================================================
    // PART I · CHAPTER 5: NUMBER PLAY (Modules 5.1 – 5.8)
    // =========================================================================
    if (titleLower.includes('sums of consecutive numbers & parity')) {
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={34 + i * 32}
              y={66 - i * 18}
              width="28"
              height={26 + i * 18}
              rx="4"
              fill={i === 1 ? pal.gold : pal.accent}
            />
          ))}
          <text x="186" y="50" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">n+(n+1)+(n+2)</text>
          <text x="186" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="bold">= 3(n + 1)</text>
        </g>
      );
    }

    if (titleLower.includes('always/sometimes/never')) {
      return (
        <g>
          {['ALWAYS', 'SOMETIMES', 'NEVER'].map((lbl, i) => (
            <g key={lbl} transform={`translate(34, ${20 + i * 26})`}>
              <rect width="106" height="21" rx="6" fill={i === 0 ? pal.gold : 'rgba(255,255,255,0.16)'} />
              <text x="53" y="15" textAnchor="middle" fill={i === 0 ? '#1C1917' : '#FFFFFF'} fontSize="10" fontWeight="bold">
                {lbl}
              </text>
            </g>
          ))}
          <text x="198" y="62" textAnchor="middle" fill={pal.accent} fontSize="15" fontWeight="bold">a | b ⇒ a | bc</text>
        </g>
      );
    }

    if (titleLower.includes('remainders & modular arithmetic')) {
      return (
        <g>
          <circle cx="78" cy="56" r="34" fill="rgba(0,0,0,0.3)" stroke={pal.gold} strokeWidth="2.5" />
          {[0, 1, 2, 3, 4, 5].map((k) => {
            const ang = (k * Math.PI) / 3 - Math.PI / 2;
            return (
              <circle
                key={k}
                cx={78 + 26 * Math.cos(ang)}
                cy={56 + 26 * Math.sin(ang)}
                r="4"
                fill={pal.accent}
              />
            );
          })}
          <text x="186" y="54" textAnchor="middle" fill={pal.gold} fontSize="16" fontWeight="bold">N = kq + r</text>
          <text x="186" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="12">Modular Clock</text>
        </g>
      );
    }

    if (titleLower.includes('quick divisibility rules')) {
      return (
        <g>
          <text x="90" y="62" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="22" fontWeight="bold">
            7 4 9
          </text>
          <circle cx="152" cy="55" r="26" fill="rgba(253,224,71,0.22)" stroke={pal.gold} strokeWidth="3" />
          <text x="152" y="62" textAnchor="middle" fill={pal.gold} fontSize="20" fontWeight="bold">24</text>
          <line x1="172" y1="73" x2="196" y2="94" stroke={pal.gold} strokeWidth="4" strokeLinecap="round" />
          <text x="220" y="56" textAnchor="middle" fill={pal.accent} fontSize="13" fontWeight="bold">÷2,4,8</text>
        </g>
      );
    }

    if (titleLower.includes('divisibility rules for 3 and 9')) {
      return (
        <g>
          <rect x="28" y="26" width="96" height="58" rx="10" fill="rgba(255,255,255,0.14)" stroke={pal.accent} strokeWidth="2" />
          <text x="76" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">100 = 99 + 1</text>
          <text x="76" y="72" textAnchor="middle" fill={pal.gold} fontSize="12" fontWeight="bold">1000 = 999 + 1</text>
          <text x="192" y="54" textAnchor="middle" fill={pal.gold} fontSize="16" fontWeight="bold">∑ Digits</text>
          <text x="192" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="13">÷ 3 and ÷ 9</text>
        </g>
      );
    }

    if (titleLower.includes('divisibility rule for 11')) {
      return (
        <g>
          <line x1="36" y1="88" x2="156" y2="88" stroke="#FFFFFF" strokeWidth="2.5" />
          <polygon points="96,58 80,88 112,88" fill={pal.gold} />
          <line x1="42" y1="46" x2="150" y2="68" stroke={pal.accent} strokeWidth="3.5" />
          <text x="54" y="36" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">+ Odd</text>
          <text x="138" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="bold">− Even</text>
          <text x="208" y="62" textAnchor="middle" fill={pal.gold} fontSize="16" fontWeight="bold">÷ 11</text>
        </g>
      );
    }

    if (titleLower.includes('cryptarithms')) {
      return (
        <g>
          {['A', 'B', '+B', 'A'].map((ch, i) => (
            <g key={i} transform={`translate(${24 + i * 32}, 32)`}>
              <rect width="26" height="36" rx="5" fill={i % 2 === 0 ? pal.gold : 'rgba(255,255,255,0.18)'} />
              <text x="13" y="24" textAnchor="middle" fill={i % 2 === 0 ? '#1C1917' : '#FFFFFF'} fontSize="13" fontWeight="bold">
                {ch}
              </text>
            </g>
          ))}
          <text x="204" y="54" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">= C A C</text>
          <text x="204" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="11">Code Breaker</text>
        </g>
      );
    }

    // =========================================================================
    // PART I · CHAPTER 6: WE DISTRIBUTE, YET THINGS MULTIPLY (Modules 6.1 – 6.8)
    // =========================================================================
    if (titleLower.includes('distributive property & increments')) {
      return (
        <g>
          <rect x="28" y="26" width="66" height="60" fill="rgba(94,234,212,0.32)" stroke={pal.accent} strokeWidth="2" />
          <rect x="94" y="26" width="44" height="60" fill="rgba(253,224,71,0.35)" stroke={pal.gold} strokeWidth="2" />
          <text x="61" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="bold">ab</text>
          <text x="116" y="60" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">ac</text>
          <text x="198" y="58" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">a(b+c) = ab+ac</text>
        </g>
      );
    }

    if (titleLower.includes('expanding binomial products')) {
      return (
        <g>
          <rect x="30" y="20" width="48" height="38" fill="rgba(253,224,71,0.35)" stroke="#FFFFFF" strokeWidth="1.5" />
          <rect x="78" y="20" width="34" height="38" fill="rgba(94,234,212,0.3)" stroke="#FFFFFF" strokeWidth="1.5" />
          <rect x="30" y="58" width="48" height="30" fill="rgba(94,234,212,0.3)" stroke="#FFFFFF" strokeWidth="1.5" />
          <rect x="78" y="58" width="34" height="30" fill="rgba(255,255,255,0.2)" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="54" y="44" textAnchor="middle" fill={pal.gold} fontSize="12" fontWeight="bold">ac</text>
          <text x="95" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">ad</text>
          <text x="54" y="77" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">bc</text>
          <text x="95" y="77" textAnchor="middle" fill={pal.accent} fontSize="12" fontWeight="bold">bd</text>
          <text x="188" y="58" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">(a+b)(c+d)</text>
        </g>
      );
    }

    if (titleLower.includes('squares of sums & differences')) {
      return (
        <g>
          <rect x="32" y="18" width="52" height="52" fill={pal.gold} opacity="0.85" />
          <rect x="84" y="18" width="24" height="52" fill={pal.accent} opacity="0.65" />
          <rect x="32" y="70" width="52" height="24" fill={pal.accent} opacity="0.65" />
          <rect x="84" y="70" width="24" height="24" fill="#FFFFFF" opacity="0.85" />
          <text x="58" y="48" textAnchor="middle" fill="#1C1917" fontSize="14" fontWeight="bold">a²</text>
          <text x="96" y="86" textAnchor="middle" fill="#1C1917" fontSize="11" fontWeight="bold">b²</text>
          <text x="186" y="54" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">(a ± b)²</text>
          <text x="186" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="13">= a² ± 2ab + b²</text>
        </g>
      );
    }

    if (titleLower.includes('difference of two squares')) {
      return (
        <g>
          <rect x="32" y="20" width="72" height="72" fill="rgba(253,224,71,0.3)" stroke={pal.gold} strokeWidth="2" />
          <rect x="74" y="20" width="30" height="30" fill="#0F172A" stroke="#FDA4AF" strokeWidth="2" strokeDasharray="3 2" />
          <text x="54" y="66" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">a² − b²</text>
          <text x="184" y="58" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">(a + b)(a − b)</text>
        </g>
      );
    }

    if (titleLower.includes('fast mental multiplication')) {
      return (
        <g>
          <polygon points="72,16 48,58 70,58 58,96 102,48 78,48" fill={pal.gold} />
          <text x="176" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="bold">98 × 102</text>
          <text x="176" y="70" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">= 100² − 2²</text>
          <text x="176" y="88" textAnchor="middle" fill={pal.accent} fontSize="13" fontWeight="bold">= 9996</text>
        </g>
      );
    }

    if (titleLower.includes('mind the mistake')) {
      return (
        <g>
          <rect x="24" y="26" width="96" height="30" rx="6" fill="rgba(244,63,94,0.3)" stroke="#FDA4AF" strokeWidth="1.5" />
          <text x="72" y="45" textAnchor="middle" fill="#FFE4E6" fontSize="11" fontWeight="bold">(a+b)² ≠ a²+b²</text>
          <rect x="24" y="64" width="118" height="30" rx="6" fill="rgba(16,185,129,0.3)" stroke={pal.accent} strokeWidth="1.5" />
          <text x="83" y="83" textAnchor="middle" fill={pal.gold} fontSize="11" fontWeight="bold">✓ a² + 2ab + b²</text>
          <text x="204" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">+2ab Bridge</text>
        </g>
      );
    }

    if (titleLower.includes('visual pattern generalization')) {
      return (
        <g>
          {[1, 2, 3].map((step) => (
            <g key={step} transform={`translate(${18 + (step - 1) * 44}, 34)`}>
              <rect width={16 + step * 6} height={16 + step * 6} rx="3" fill="none" stroke={pal.gold} strokeWidth="2.5" />
            </g>
          ))}
          <text x="195" y="54" textAnchor="middle" fill={pal.gold} fontSize="16" fontWeight="bold">Tₙ = 4n + 4</text>
          <text x="195" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="11">Nth Pattern Rule</text>
        </g>
      );
    }

    // =========================================================================
    // PART I · CHAPTER 7 & PART II · CHAPTER 3: PROPORTIONAL REASONING
    // =========================================================================
    if (titleLower.includes('image scaling & similarity')) {
      return (
        <g>
          <rect x="30" y="44" width="44" height="34" rx="4" fill="rgba(255,255,255,0.2)" stroke="#FFFFFF" strokeWidth="2" />
          <rect x="92" y="22" width="74" height="56" rx="5" fill="rgba(253,224,71,0.25)" stroke={pal.gold} strokeWidth="2.5" />
          <line x1="30" y1="78" x2="166" y2="22" stroke={pal.accent} strokeWidth="1.8" strokeDasharray="4 2" />
          <text x="214" y="58" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">w₁/h₁ = w₂/h₂</text>
        </g>
      );
    }

    if (titleLower.includes('ratios & simplest form') || titleLower.includes('proportionality quick recap')) {
      return (
        <g>
          <circle cx="58" cy="56" r="24" fill={pal.gold} />
          <text x="58" y="61" textAnchor="middle" fill="#1C1917" fontSize="14" fontWeight="bold">12:18</text>
          <text x="104" y="61" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="bold">⇒</text>
          <circle cx="150" cy="56" r="24" fill={pal.accent} />
          <text x="150" y="61" textAnchor="middle" fill="#0F172A" fontSize="15" fontWeight="bold">2 : 3</text>
          <text x="216" y="60" textAnchor="middle" fill={pal.gold} fontSize="12" fontWeight="bold">÷ HCF(6)</text>
        </g>
      );
    }

    if (titleLower.includes('proportions & problem solving')) {
      return (
        <g>
          <text x="82" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="bold">a : b :: c : d</text>
          <path d="M 46 56 Q 82 82 118 56" fill="none" stroke={pal.gold} strokeWidth="2.5" />
          <path d="M 70 56 Q 82 70 94 56" fill="none" stroke={pal.accent} strokeWidth="2.5" />
          <text x="195" y="62" textAnchor="middle" fill={pal.gold} fontSize="16" fontWeight="bold">a · d = b · c</text>
        </g>
      );
    }

    if (titleLower.includes('rule of three') || titleLower.includes('trairāśika')) {
      return (
        <g>
          <polygon points="86,18 136,88 36,88" fill="rgba(253,224,71,0.2)" stroke={pal.gold} strokeWidth="2.5" />
          <text x="86" y="38" textAnchor="middle" fill={pal.gold} fontSize="10" fontWeight="bold">Phala × Icchā</text>
          <text x="86" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">÷ Pramāṇa</text>
          <text x="196" y="54" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">Trairāśika</text>
          <text x="196" y="72" textAnchor="middle" fill={pal.accent} fontSize="11">Rule of Three</text>
        </g>
      );
    }

    if (titleLower.includes('unit conversions & metric scaling')) {
      return (
        <g>
          <circle cx="64" cy="56" r="24" fill="none" stroke={pal.gold} strokeWidth="3" strokeDasharray="6 3" />
          <circle cx="114" cy="56" r="18" fill="none" stroke={pal.accent} strokeWidth="3" strokeDasharray="5 3" />
          <text x="64" y="60" textAnchor="middle" fill={pal.gold} fontSize="11" fontWeight="bold">km/h</text>
          <text x="114" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">m/s</text>
          <text x="196" y="58" textAnchor="middle" fill={pal.gold} fontSize="16" fontWeight="bold">× 5 / 18</text>
        </g>
      );
    }

    if (titleLower.includes('sharing in ratios') || titleLower.includes('dividing a whole in a given ratio')) {
      return (
        <g>
          <rect x="28" y="38" width="78" height="32" rx="6" fill={pal.gold} />
          <rect x="108" y="38" width="52" height="32" rx="6" fill={pal.accent} />
          <text x="67" y="59" textAnchor="middle" fill="#1C1917" fontSize="13" fontWeight="bold">m parts</text>
          <text x="134" y="59" textAnchor="middle" fill="#0F172A" fontSize="13" fontWeight="bold">n parts</text>
          <text x="212" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">m/(m+n)</text>
        </g>
      );
    }

    if (titleLower.includes('inverse proportions')) {
      return (
        <g>
          <line x1="34" y1="20" x2="34" y2="92" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="34" y1="92" x2="140" y2="92" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M 44 26 Q 56 80 132 84" fill="none" stroke={pal.gold} strokeWidth="3.5" />
          <text x="194" y="54" textAnchor="middle" fill={pal.gold} fontSize="18" fontWeight="bold">x · y = k</text>
          <text x="194" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="11">Inverse Curve</text>
        </g>
      );
    }

    if (titleLower.includes('ratios in maps') || titleLower.includes('representative fractions')) {
      return (
        <g>
          <rect x="28" y="22" width="102" height="68" rx="8" fill="rgba(255,255,255,0.14)" stroke={pal.accent} strokeWidth="2" />
          <polygon points="79,30 85,52 79,46 73,52" fill={pal.gold} />
          <line x1="42" y1="74" x2="116" y2="74" stroke={pal.gold} strokeWidth="3" />
          <text x="192" y="52" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">1 : 50,000</text>
          <text x="192" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11">Map Scale RF</text>
        </g>
      );
    }

    if (titleLower.includes('ratios with more than two terms')) {
      return (
        <g>
          <circle cx="52" cy="56" r="20" fill={pal.gold} />
          <circle cx="98" cy="56" r="20" fill={pal.accent} />
          <circle cx="144" cy="56" r="20" fill="#FFFFFF" />
          <text x="52" y="61" textAnchor="middle" fill="#1C1917" fontSize="14" fontWeight="bold">a</text>
          <text x="98" y="61" textAnchor="middle" fill="#0F172A" fontSize="14" fontWeight="bold">b</text>
          <text x="144" y="61" textAnchor="middle" fill="#0F172A" fontSize="14" fontWeight="bold">c</text>
          <text x="212" y="60" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">a : b : c</text>
        </g>
      );
    }

    if (titleLower.includes('pie charts & data proportions')) {
      return (
        <g>
          <circle cx="76" cy="56" r="34" fill="rgba(255,255,255,0.16)" stroke="#FFFFFF" strokeWidth="2" />
          <path d="M 76 56 L 76 22 A 34 34 0 0 1 110 56 Z" fill={pal.gold} />
          <path d="M 76 56 L 110 56 A 34 34 0 0 1 52 80 Z" fill={pal.accent} />
          <text x="186" y="52" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">θ = (x/T)·360°</text>
          <text x="186" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11">Sector Angle</text>
        </g>
      );
    }

    if (titleLower.includes('advanced proportional word problems')) {
      return (
        <g>
          <rect x="30" y="26" width="90" height="60" rx="8" fill="rgba(255,255,255,0.15)" stroke={pal.gold} strokeWidth="2" />
          <rect x="34" y="54" width="82" height="28" rx="4" fill={pal.accent} opacity="0.7" />
          <text x="188" y="52" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">1/A + 1/B</text>
          <text x="188" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12">Combined Rate</text>
        </g>
      );
    }

    // =========================================================================
    // PART II · CHAPTER 1: FRACTIONS IN DISGUISE (Modules 1.1 – 1.8)
    // =========================================================================
    if (titleLower.includes('fractions as percentages') || titleLower.includes('fdp trio')) {
      return (
        <g>
          <polygon points="84,20 134,88 34,88" fill="rgba(255,255,255,0.15)" stroke={pal.gold} strokeWidth="2.5" />
          <text x="84" y="16" textAnchor="middle" fill={pal.gold} fontSize="12" fontWeight="bold">75%</text>
          <text x="26" y="96" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">3/4</text>
          <text x="144" y="96" textAnchor="middle" fill={pal.accent} fontSize="12" fontWeight="bold">0.75</text>
          <text x="202" y="58" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">F ↔ D ↔ P</text>
        </g>
      );
    }

    if (titleLower.includes('percentage of a quantity')) {
      return (
        <g>
          <rect x="28" y="28" width="110" height="24" rx="6" fill={pal.gold} />
          <text x="83" y="44" textAnchor="middle" fill="#1C1917" fontSize="12" fontWeight="bold">35% = 10%+10%+10%+5%</text>
          <rect x="28" y="60" width="110" height="24" rx="6" fill="rgba(255,255,255,0.18)" stroke={pal.accent} />
          <text x="83" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">x% of y = y% of x</text>
          <text x="202" y="58" textAnchor="middle" fill={pal.accent} fontSize="14" fontWeight="bold">Mental Split</text>
        </g>
      );
    }

    if (titleLower.includes('percentages greater than 100')) {
      return (
        <g>
          <rect x="28" y="52" width="48" height="34" rx="4" fill="rgba(255,255,255,0.25)" stroke="#FFFFFF" />
          <text x="52" y="73" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">100%</text>
          <rect x="88" y="20" width="64" height="66" rx="6" fill={pal.gold} />
          <text x="120" y="58" textAnchor="middle" fill="#1C1917" fontSize="15" fontWeight="bold">250%</text>
          <text x="206" y="58" textAnchor="middle" fill={pal.accent} fontSize="14" fontWeight="bold">2.5× Growth</text>
        </g>
      );
    }

    if (titleLower.includes('comparing proportions using percentages')) {
      return (
        <g>
          <rect x="38" y="24" width="32" height="64" rx="6" fill="rgba(255,255,255,0.15)" stroke="#FFFFFF" strokeWidth="2" />
          <rect x="40" y="44" width="28" height="42" rx="4" fill={pal.accent} />
          <rect x="92" y="24" width="32" height="64" rx="6" fill="rgba(255,255,255,0.15)" stroke="#FFFFFF" strokeWidth="2" />
          <rect x="94" y="32" width="28" height="54" rx="4" fill={pal.gold} />
          <text x="192" y="54" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">Normalize</text>
          <text x="192" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="13">to 100%</text>
        </g>
      );
    }

    if (titleLower.includes('percentage increase, decrease, & inflation')) {
      return (
        <g>
          <path d="M 34 76 L 78 28 L 122 82" fill="none" stroke={pal.gold} strokeWidth="3.5" strokeLinecap="round" />
          <text x="52" y="42" textAnchor="middle" fill={pal.accent} fontSize="12" fontWeight="bold">+20%</text>
          <text x="108" y="48" textAnchor="middle" fill="#FDA4AF" fontSize="12" fontWeight="bold">−20%</text>
          <text x="192" y="54" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">1.2 × 0.8</text>
          <text x="192" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">= 96% (−4%)</text>
        </g>
      );
    }

    if (titleLower.includes('profit, loss, marked price, & discounts')) {
      return (
        <g>
          <polygon points="32,32 108,32 128,56 108,80 32,80" fill={pal.gold} />
          <circle cx="112" cy="56" r="4" fill="#1C1917" />
          <text x="70" y="61" textAnchor="middle" fill="#1C1917" fontSize="14" fontWeight="bold">−DISC %</text>
          <text x="192" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">CP → MP → SP</text>
          <text x="192" y="72" textAnchor="middle" fill={pal.accent} fontSize="12" fontWeight="bold">Profit / Loss</text>
        </g>
      );
    }

    if (titleLower.includes('taxes, growth, compounding')) {
      return (
        <g>
          <path d="M 32 86 Q 82 80 132 22" fill="none" stroke={pal.gold} strokeWidth="4" strokeLinecap="round" />
          <circle cx="132" cy="22" r="6" fill={pal.gold} />
          <text x="188" y="52" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">P(1 + R/100)ⁿ</text>
          <text x="188" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11">Compounding</text>
        </g>
      );
    }

    // =========================================================================
    // PART II · CHAPTER 2: THE BAUDHAYANA-PYTHAGORAS THEOREM (Modules 2.1 – 2.8)
    // =========================================================================
    if (titleLower.includes('doubling and halving squares')) {
      return (
        <g>
          <rect x="38" y="34" width="52" height="52" fill="rgba(255,255,255,0.18)" stroke="#FFFFFF" strokeWidth="2" />
          <polygon points="90,34 126,70 90,106 54,70" fill="rgba(253,224,71,0.32)" stroke={pal.gold} strokeWidth="2.5" />
          <text x="192" y="52" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">Dvikaraṇī</text>
          <text x="192" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="13">Diagonal = 2× Area</text>
        </g>
      );
    }

    if (titleLower.includes('hypotenuse of an isosceles right triangle')) {
      return (
        <g>
          <polygon points="44,86 116,86 44,18" fill="rgba(94,234,212,0.28)" stroke="#FFFFFF" strokeWidth="2.5" />
          <line x1="44" y1="18" x2="116" y2="86" stroke={pal.gold} strokeWidth="3.5" />
          <text x="32" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">1</text>
          <text x="80" y="98" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">1</text>
          <text x="94" y="46" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">√2</text>
          <text x="194" y="60" textAnchor="middle" fill={pal.gold} fontSize="17" fontWeight="bold">c = a√2</text>
        </g>
      );
    }

    if (titleLower.includes('decimal bounds') || titleLower.includes('non-terminating nature')) {
      return (
        <g>
          <line x1="28" y1="58" x2="152" y2="58" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="90" cy="58" r="18" fill="rgba(253,224,71,0.25)" stroke={pal.gold} strokeWidth="2.5" />
          <text x="90" y="32" textAnchor="middle" fill={pal.gold} fontSize="13" fontWeight="bold">√2 ≈ 1.4142…</text>
          <text x="198" y="54" textAnchor="middle" fill={pal.accent} fontSize="15" fontWeight="bold">577 / 408</text>
          <text x="198" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="11">Sulba Bound</text>
        </g>
      );
    }

    if (titleLower.includes('combining two different squares')) {
      return (
        <g>
          <rect x="34" y="34" width="54" height="54" fill="rgba(94,234,212,0.3)" stroke={pal.accent} strokeWidth="2" />
          <rect x="88" y="52" width="36" height="36" fill="rgba(253,224,71,0.35)" stroke={pal.gold} strokeWidth="2" />
          <text x="61" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">a²</text>
          <text x="106" y="74" textAnchor="middle" fill={pal.gold} fontSize="13" fontWeight="bold">b²</text>
          <text x="192" y="58" textAnchor="middle" fill={pal.gold} fontSize="16" fontWeight="bold">a² + b² → c²</text>
        </g>
      );
    }

    if (titleLower.includes('baudhāyana’s theorem on right-angled triangles')) {
      return (
        <g>
          <polygon points="62,74 114,74 62,34" fill="#FFFFFF" opacity="0.9" />
          <rect x="62" y="74" width="52" height="24" fill={pal.accent} opacity="0.65" />
          <rect x="34" y="34" width="28" height="40" fill={pal.gold} opacity="0.75" />
          <text x="190" y="56" textAnchor="middle" fill={pal.gold} fontSize="18" fontWeight="bold">a² + b² = c²</text>
          <text x="190" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="11">Sūtra 1.12</text>
        </g>
      );
    }

    if (titleLower.includes('baudhāyana triples')) {
      return (
        <g>
          <polygon points="36,84 116,84 36,24" fill="rgba(253,224,71,0.22)" stroke={pal.gold} strokeWidth="2.5" />
          {[0, 1, 2, 3].map((k) => (
            <circle key={k} cx={36 + k * 26} cy="84" r="3.5" fill="#FFFFFF" />
          ))}
          <text x="184" y="48" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">(3, 4, 5)</text>
          <text x="184" y="68" textAnchor="middle" fill={pal.accent} fontSize="14" fontWeight="bold">(5, 12, 13)</text>
          <text x="184" y="86" textAnchor="middle" fill="#FFFFFF" fontSize="12">(8, 15, 17)</text>
        </g>
      );
    }

    if (titleLower.includes('fermat’s last theorem') || titleLower.includes('historical applications')) {
      return (
        <g>
          <line x1="28" y1="74" x2="144" y2="74" stroke={pal.accent} strokeWidth="2.5" />
          <line x1="68" y1="94" x2="68" y2="28" stroke="#FFFFFF" strokeWidth="2.5" />
          <line x1="68" y1="94" x2="122" y2="74" stroke={pal.gold} strokeWidth="2.5" />
          <circle cx="68" cy="24" r="7" fill="#FDA4AF" />
          <text x="194" y="52" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">xⁿ + yⁿ ≠ zⁿ</text>
          <text x="194" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11">for n &gt; 2</text>
        </g>
      );
    }

    // =========================================================================
    // PART II · CHAPTER 4: EXPLORING SOME GEOMETRIC THEMES (Modules 4.1 – 4.8)
    // =========================================================================
    if (titleLower.includes('self-similarity') || titleLower.includes('śikharas')) {
      return (
        <g>
          <polygon points="84,14 128,90 40,90" fill="rgba(253,224,71,0.28)" stroke={pal.gold} strokeWidth="2" />
          <polygon points="52,44 74,90 30,90" fill="rgba(94,234,212,0.3)" stroke={pal.accent} strokeWidth="1.5" />
          <polygon points="116,44 138,90 94,90" fill="rgba(94,234,212,0.3)" stroke={pal.accent} strokeWidth="1.5" />
          <text x="196" y="54" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">Śikhara</text>
          <text x="196" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="12">Self-Similarity</text>
        </g>
      );
    }

    if (titleLower.includes('sierpinski')) {
      return (
        <g>
          <polygon points="78,16 128,92 28,92" fill={pal.gold} />
          <polygon points="53,54 103,54 78,92" fill="#0F172A" />
          <text x="192" y="52" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">3ⁿ Triangles</text>
          <text x="192" y="72" textAnchor="middle" fill={pal.accent} fontSize="12">Sierpinski</text>
        </g>
      );
    }

    if (titleLower.includes('koch snowflake')) {
      return (
        <g>
          <polygon points="78,16 122,82 34,82" fill="rgba(94,234,212,0.28)" stroke={pal.accent} strokeWidth="2" />
          <polygon points="78,96 122,30 34,30" fill="rgba(253,224,71,0.28)" stroke={pal.gold} strokeWidth="2" />
          <text x="192" y="52" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">Pₙ = P₀(4/3)ⁿ</text>
          <text x="192" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11">Koch Snowflake</text>
        </g>
      );
    }

    if (titleLower.includes('11 nets of a cube')) {
      return (
        <g>
          {/* Cross Net of 6 Squares */}
          {[
            [64, 18],
            [40, 42],
            [64, 42],
            [88, 42],
            [64, 66],
            [64, 90],
          ].map(([x, y], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width="22"
              height="22"
              fill={i === 2 ? pal.gold : 'rgba(255,255,255,0.2)'}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          ))}
          <text x="188" y="54" textAnchor="middle" fill={pal.gold} fontSize="16" fontWeight="bold">11 Cube Nets</text>
          <text x="188" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="11">6 Faces Fold</text>
        </g>
      );
    }

    if (titleLower.includes('hungry ant') || titleLower.includes('shortest surface path')) {
      return (
        <g>
          <rect x="30" y="34" width="54" height="54" fill="rgba(255,255,255,0.16)" stroke="#FFFFFF" strokeWidth="2" />
          <rect x="84" y="34" width="44" height="54" fill="rgba(255,255,255,0.16)" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="30" y1="88" x2="128" y2="34" stroke={pal.gold} strokeWidth="3" strokeDasharray="4 2" />
          <circle cx="30" cy="88" r="5" fill={pal.accent} />
          <circle cx="128" cy="34" r="6" fill={pal.gold} />
          <text x="194" y="56" textAnchor="middle" fill={pal.gold} fontSize="13" fontWeight="bold">√((L+B)² + H²)</text>
        </g>
      );
    }

    if (titleLower.includes('orthographic projections') || titleLower.includes('shadows')) {
      return (
        <g>
          {['FRONT', 'TOP', 'SIDE'].map((v, i) => (
            <g key={v} transform={`translate(${24 + i * 50}, 30)`}>
              <rect width="42" height="50" rx="5" fill="rgba(255,255,255,0.15)" stroke={i === 0 ? pal.gold : pal.accent} strokeWidth="2" />
              <text x="21" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">{v}</text>
            </g>
          ))}
          <text x="214" y="58" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">3 Views</text>
        </g>
      );
    }

    if (titleLower.includes('isometric grids')) {
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <polygon
              key={i}
              points={`${60 + i * 26},${30 + i * 10} ${86 + i * 26},${44 + i * 10} ${60 + i * 26},${58 + i * 10} ${34 + i * 26},${44 + i * 10}`}
              fill={i === 1 ? pal.gold : pal.accent}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          ))}
          <text x="196" y="54" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">Isometric 3D</text>
          <text x="196" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11">Min/Max Cubes</text>
        </g>
      );
    }

    // =========================================================================
    // PART II · CHAPTER 5: TALES BY DOTS AND LINES (Modules 5.1 – 5.8)
    // =========================================================================
    if (titleLower.includes('mean as a centre of balance')) {
      return (
        <g>
          <line x1="28" y1="68" x2="152" y2="68" stroke="#FFFFFF" strokeWidth="3" />
          <polygon points="90,68 76,94 104,94" fill={pal.gold} />
          {[42, 64, 112, 142].map((x, i) => (
            <circle key={i} cx={x} cy="56" r="7" fill={pal.accent} />
          ))}
          <text x="198" y="54" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">x̄ = ∑x / n</text>
          <text x="198" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="11">Fulcrum Balance</text>
        </g>
      );
    }

    if (titleLower.includes('comparing mean and median')) {
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={28 + i * 24}
              y={68 - i * 9}
              width="18"
              height={22 + i * 9}
              rx="3"
              fill={i === 2 ? pal.gold : 'rgba(255,255,255,0.22)'}
            />
          ))}
          <text x="192" y="52" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">Median vs Mean</text>
          <text x="192" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11">Middle Value</text>
        </g>
      );
    }

    if (titleLower.includes('effect of data changes')) {
      return (
        <g>
          {[36, 52, 68, 84].map((x, i) => (
            <circle key={i} cx={x} cy="62" r="7" fill={pal.accent} />
          ))}
          <circle cx="144" cy="62" r="10" fill={pal.gold} stroke="#FFFFFF" strokeWidth="2" />
          <text x="144" y="42" textAnchor="middle" fill={pal.gold} fontSize="10" fontWeight="bold">Outlier</text>
          <text x="204" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">Δx̄ = Δx / n</text>
        </g>
      );
    }

    if (titleLower.includes('frequency tables & weighted averages')) {
      return (
        <g>
          <rect x="28" y="24" width="96" height="64" rx="6" fill="rgba(255,255,255,0.14)" stroke={pal.accent} strokeWidth="2" />
          <line x1="76" y1="24" x2="76" y2="88" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="52" y="46" textAnchor="middle" fill={pal.gold} fontSize="12" fontWeight="bold">xᵢ</text>
          <text x="100" y="46" textAnchor="middle" fill={pal.accent} fontSize="12" fontWeight="bold">fᵢ</text>
          <text x="190" y="58" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">∑(fᵢxᵢ) / ∑fᵢ</text>
        </g>
      );
    }

    if (titleLower.includes('spreadsheets')) {
      return (
        <g>
          <rect x="28" y="22" width="104" height="66" rx="6" fill="rgba(0,0,0,0.35)" stroke={pal.accent} strokeWidth="2" />
          <line x1="28" y1="44" x2="132" y2="44" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="62" y1="22" x2="62" y2="88" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="80" y="37" textAnchor="middle" fill={pal.gold} fontSize="10" fontWeight="bold">=AVERAGE(B2:B9)</text>
          <text x="194" y="58" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">Cells &amp; Formulas</text>
        </g>
      );
    }

    if (titleLower.includes('line graphs vs. bar graphs')) {
      return (
        <g>
          <polyline
            points="32,78 58,52 84,64 110,30 136,42"
            fill="none"
            stroke={pal.gold}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {[32, 58, 84, 110, 136].map((x, idx) => (
            <circle key={idx} cx={x} cy={[78, 52, 64, 30, 42][idx]} r="4.5" fill="#FFFFFF" />
          ))}
          <text x="196" y="54" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">Trend Lines</text>
          <text x="196" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11">Dots &amp; Slopes</text>
        </g>
      );
    }

    if (titleLower.includes('infographics & maps')) {
      return (
        <g>
          <circle cx="64" cy="56" r="28" fill="rgba(94,234,212,0.22)" stroke={pal.accent} strokeWidth="2" />
          <circle cx="96" cy="56" r="20" fill="rgba(253,224,71,0.3)" stroke={pal.gold} strokeWidth="2" />
          <text x="188" y="54" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">Multi-Variable</text>
          <text x="188" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12">Visual Stories</text>
        </g>
      );
    }

    // =========================================================================
    // PART II · CHAPTER 6: ALGEBRA PLAY (Modules 6.1 – 6.8)
    // =========================================================================
    if (titleLower.includes('think of a number')) {
      return (
        <g>
          <rect x="32" y="30" width="52" height="52" rx="10" fill={pal.gold} />
          <text x="58" y="64" textAnchor="middle" fill="#1C1917" fontSize="24" fontWeight="bold">x</text>
          <text x="172" y="54" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="bold">(2x + 10)/2 − x</text>
          <text x="172" y="76" textAnchor="middle" fill={pal.gold} fontSize="16" fontWeight="bold">= 5 Always!</text>
        </g>
      );
    }

    if (titleLower.includes('birthday trick') || titleLower.includes('100m')) {
      return (
        <g>
          <rect x="28" y="32" width="52" height="46" rx="8" fill={pal.gold} />
          <text x="54" y="60" textAnchor="middle" fill="#1C1917" fontSize="15" fontWeight="bold">MM</text>
          <rect x="86" y="32" width="52" height="46" rx="8" fill={pal.accent} />
          <text x="112" y="60" textAnchor="middle" fill="#0F172A" fontSize="15" fontWeight="bold">DD</text>
          <text x="198" y="52" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">100M + D</text>
          <text x="198" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="13">+ 165</text>
        </g>
      );
    }

    if (titleLower.includes('number pyramids')) {
      return (
        <g>
          <rect x="64" y="20" width="44" height="20" rx="4" fill={pal.gold} />
          <rect x="40" y="44" width="44" height="20" rx="4" fill="rgba(255,255,255,0.22)" />
          <rect x="88" y="44" width="44" height="20" rx="4" fill="rgba(255,255,255,0.22)" />
          <rect x="18" y="68" width="40" height="20" rx="4" fill={pal.accent} />
          <rect x="64" y="68" width="44" height="20" rx="4" fill={pal.accent} />
          <rect x="114" y="68" width="40" height="20" rx="4" fill={pal.accent} />
          <text x="206" y="56" textAnchor="middle" fill={pal.gold} fontSize="13" fontWeight="bold">a+3b+3c+d</text>
        </g>
      );
    }

    if (titleLower.includes('genie')) {
      return (
        <g>
          <ellipse cx="74" cy="64" rx="34" ry="18" fill={pal.gold} />
          <path d="M 108 60 Q 128 42 134 26" fill="none" stroke={pal.accent} strokeWidth="4" strokeLinecap="round" />
          <text x="188" y="52" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">8x − 350 = 0</text>
          <text x="188" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="13">x = 43.75</text>
        </g>
      );
    }

    if (titleLower.includes('calendar grids')) {
      return (
        <g>
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={34 + c * 24}
                y={22 + r * 22}
                width="21"
                height="19"
                rx="3"
                fill={r === 1 && c === 1 ? pal.gold : 'rgba(255,255,255,0.18)'}
              />
            ))
          )}
          <text x="70" y="58" textAnchor="middle" fill="#1C1917" fontSize="11" fontWeight="bold">c</text>
          <text x="184" y="58" textAnchor="middle" fill={pal.gold} fontSize="17" fontWeight="bold">Sum = 9c</text>
        </g>
      );
    }

    if (titleLower.includes('balancing equations')) {
      return (
        <g>
          <line x1="34" y1="54" x2="144" y2="54" stroke={pal.gold} strokeWidth="3.5" />
          <polygon points="89,54 75,88 103,88" fill="#FFFFFF" />
          <rect x="38" y="32" width="28" height="20" rx="4" fill={pal.accent} />
          <rect x="112" y="32" width="28" height="20" rx="4" fill={pal.gold} />
          <text x="196" y="58" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">ax + b = cx + d</text>
        </g>
      );
    }

    // =========================================================================
    // PART II · CHAPTER 7: AREA (Modules 7.1 – 7.8)
    // =========================================================================
    if (titleLower.includes('enclosing triangles in rectangles')) {
      return (
        <g>
          <rect x="32" y="24" width="96" height="64" fill="rgba(255,255,255,0.12)" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 2" />
          <polygon points="32,88 128,88 76,24" fill="rgba(253,224,71,0.38)" stroke={pal.gold} strokeWidth="2.5" />
          <text x="192" y="56" textAnchor="middle" fill={pal.gold} fontSize="18" fontWeight="bold">Area = ½ b h</text>
        </g>
      );
    }

    if (titleLower.includes('obtuse triangles') || titleLower.includes('medians')) {
      return (
        <g>
          <polygon points="56,86 128,86 28,26" fill="rgba(94,234,212,0.32)" stroke={pal.accent} strokeWidth="2.5" />
          <line x1="28" y1="26" x2="28" y2="86" stroke={pal.gold} strokeWidth="2" strokeDasharray="3 2" />
          <line x1="28" y1="86" x2="56" y2="86" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="192" y="54" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">External h</text>
          <text x="192" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="12">Median = ½ Area</text>
        </g>
      );
    }

    if (titleLower.includes('triangles between parallel lines') || titleLower.includes('gopal')) {
      return (
        <g>
          <line x1="24" y1="26" x2="148" y2="26" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="24" y1="86" x2="148" y2="86" stroke="#FFFFFF" strokeWidth="2.5" />
          <polygon points="38,86 112,86 54,26" fill="rgba(253,224,71,0.3)" stroke={pal.gold} strokeWidth="2" />
          <polygon points="38,86 112,86 128,26" fill="rgba(94,234,212,0.28)" stroke={pal.accent} strokeWidth="2" />
          <text x="200" y="58" textAnchor="middle" fill={pal.gold} fontSize="15" fontWeight="bold">Equal Areas</text>
        </g>
      );
    }

    if (titleLower.includes('area of parallelograms')) {
      return (
        <g>
          <polygon points="52,26 138,26 114,86 28,86" fill="rgba(94,234,212,0.3)" stroke={pal.accent} strokeWidth="2.5" />
          <line x1="52" y1="26" x2="52" y2="86" stroke={pal.gold} strokeWidth="2" strokeDasharray="3 2" />
          <text x="194" y="58" textAnchor="middle" fill={pal.gold} fontSize="18" fontWeight="bold">Area = b × h</text>
        </g>
      );
    }

    if (titleLower.includes('area of rhombuses and kites')) {
      return (
        <g>
          <polygon points="80,16 128,54 80,94 32,54" fill="rgba(253,224,71,0.3)" stroke={pal.gold} strokeWidth="2.5" />
          <line x1="32" y1="54" x2="128" y2="54" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="80" y1="16" x2="80" y2="94" stroke={pal.accent} strokeWidth="2" />
          <text x="194" y="58" textAnchor="middle" fill={pal.gold} fontSize="17" fontWeight="bold">½ × d₁ × d₂</text>
        </g>
      );
    }

    if (titleLower.includes('area of trapeziums')) {
      return (
        <g>
          <polygon points="48,26 108,26 132,86 24,86" fill="rgba(253,224,71,0.32)" stroke={pal.gold} strokeWidth="2.5" />
          <text x="78" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">a</text>
          <text x="78" y="99" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">b</text>
          <text x="194" y="58" textAnchor="middle" fill={pal.gold} fontSize="16" fontWeight="bold">½ h (a + b)</text>
        </g>
      );
    }

    if (titleLower.includes('polygon triangulation') || titleLower.includes('surveyor')) {
      return (
        <g>
          <polygon points="30,64 62,20 120,28 140,72 78,92" fill="rgba(94,234,212,0.25)" stroke={pal.accent} strokeWidth="2.5" />
          <line x1="30" y1="64" x2="120" y2="28" stroke={pal.gold} strokeWidth="1.8" strokeDasharray="4 2" />
          <line x1="30" y1="64" x2="140" y2="72" stroke={pal.gold} strokeWidth="1.8" strokeDasharray="4 2" />
          <text x="200" y="56" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">∑ △ Areas</text>
        </g>
      );
    }

    // =========================================================================
    // PART I CAPSTONE CHAPTER 8 (Modules 8.1 – 8.8) & CHAPTER-SPECIFIC .8 WRAP-UPS
    // =========================================================================
    const chKey = `${chapterId}:${shortNum}`;
    const wrapUpMap: Record<string, { badge: string; sub: string; shape: number }> = {
      'ch1-square-cube:1.8': { badge: 'n² & n³ Vault', sub: 'Squares, Cubes & 1729', shape: 0 },
      'ch2-power-play:2.8': { badge: 'aᵐ · aⁿ = aᵐ⁺ⁿ', sub: 'Exponents & Cosmic Scale', shape: 1 },
      'ch3-story-numbers:3.8': { badge: '0 · Place Value', sub: 'Tally to Hindu Decimal', shape: 2 },
      'ch4-quadrilaterals:4.8': { badge: '∑ Angles = 360°', sub: 'Quadrilateral Family Tree', shape: 3 },
      'ch5-number-play:5.8': { badge: 'Mod & Divisibility', sub: 'Parity, Digital Roots & Code', shape: 4 },
      'ch6-we-distribute:6.8': { badge: '(a ± b)² · a² − b²', sub: 'Algebraic Identities Lab', shape: 5 },
      'ch7-proportional-1:7.8': { badge: 'Trairāśika Seal', sub: 'Ratios & Rule of Three', shape: 6 },
      'ch8-master-quiz:8.1': { badge: 'Capstone 8.1', sub: 'Squares, Cubes & 1729', shape: 0 },
      'ch8-master-quiz:8.2': { badge: 'Capstone 8.2', sub: 'Laws of Exponents', shape: 1 },
      'ch8-master-quiz:8.3': { badge: 'Capstone 8.3', sub: 'Base-n & Hindu Zero', shape: 2 },
      'ch8-master-quiz:8.4': { badge: 'Capstone 8.4', sub: 'Quadrilateral Proofs', shape: 3 },
      'ch8-master-quiz:8.5': { badge: 'Capstone 8.5', sub: 'Divisibility & Cryptarithms', shape: 4 },
      'ch8-master-quiz:8.6': { badge: 'Capstone 8.6', sub: 'Binomial & Square Identities', shape: 5 },
      'ch8-master-quiz:8.7': { badge: 'Capstone 8.7', sub: 'Proportional Trairāśika', shape: 6 },
      'ch8-master-quiz:8.8': { badge: 'Grand Finale 8.8', sub: 'Part I Master Championship', shape: 7 },
      'ch4-fractions-disguise:1.8': { badge: 'F ↔ D ↔ % Seal', sub: 'Discounts, Tax & Growth', shape: 8 },
      'ch5-baudhayana-pythagoras:2.8': { badge: 'a² + b² = c² Seal', sub: 'Sulba-Sutra to Fermat', shape: 9 },
      'ch6-proportional-reasoning:3.8': { badge: 'RF · Pie · Inverse', sub: 'Proportional Reasoning II', shape: 10 },
      'ch11-geometric-themes:4.8': { badge: 'Fractals & 3D Nets', sub: 'Sierpinski, Koch & Solids', shape: 11 },
      'ch12-dots-and-lines:5.8': { badge: 'Mean & Median', sub: 'Data, Graphs & Balance', shape: 12 },
      'ch13-algebra-play:6.8': { badge: '100M+D · 9c', sub: 'Pyramids & Genie Algebra', shape: 13 },
      'ch14-area:7.8': { badge: '½bh · ½d₁d₂', sub: 'Polygon Area Dissections', shape: 14 },
    };

    const meta = wrapUpMap[chKey] || {
      badge: `Module ${shortNum}`,
      sub: formatMathText(moduleTitle).slice(0, 22),
      shape: hash % 15,
    };

    return (
      <g>
        {meta.shape % 4 === 0 && (
          <g>
            <rect x="34" y="24" width="60" height="60" rx="10" fill="rgba(253,224,71,0.22)" stroke={pal.gold} strokeWidth="2.5" />
            <polygon points="64,32 84,54 64,76 44,54" fill={pal.gold} />
          </g>
        )}
        {meta.shape % 4 === 1 && (
          <g>
            <circle cx="64" cy="54" r="32" fill="rgba(94,234,212,0.22)" stroke={pal.accent} strokeWidth="2.5" />
            <polygon points="64,26 88,70 40,70" fill={pal.gold} />
          </g>
        )}
        {meta.shape % 4 === 2 && (
          <g>
            <polygon points="64,20 98,44 84,84 44,84 30,44" fill="rgba(253,224,71,0.25)" stroke={pal.gold} strokeWidth="2.5" />
            <circle cx="64" cy="54" r="14" fill={pal.accent} />
          </g>
        )}
        {meta.shape % 4 === 3 && (
          <g>
            <circle cx="64" cy="54" r="32" fill="rgba(253,224,71,0.18)" stroke={pal.gold} strokeWidth="2.5" strokeDasharray="5 3" />
            <polygon points="44,70 51,38 64,52 77,38 84,70" fill={pal.gold} />
          </g>
        )}
        <text x="178" y="48" textAnchor="middle" fill={pal.gold} fontSize="14" fontWeight="bold">
          {meta.badge}
        </text>
        <text x="178" y="68" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
          {meta.sub}
        </text>
      </g>
    );
  };

  return (
    <div
      className={`relative w-full h-full bg-gradient-to-br ${pal.bg} overflow-hidden flex items-center justify-center`}
    >
      {/* Subtle unique decorative geometric aura per module hash */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${pal.glow}, transparent 70%)` }}
      />
      <div className="absolute top-2 left-2.5 z-20 px-2 py-0.5 rounded-md bg-black/35 backdrop-blur-xs border border-white/15 text-[10px] font-extrabold text-amber-200 tracking-wider">
        {shortNum}
      </div>

      <svg className="relative z-10 w-60 h-28" viewBox="0 0 260 112">
        {renderSpecificScene()}
      </svg>
    </div>
  );
};
