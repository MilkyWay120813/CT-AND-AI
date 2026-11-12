import React, { useMemo } from 'react';

interface ChapterFloatingElementsProps {
  chapterId: string;
}

interface FloatingCharm {
  id: string;
  glyph: string;
  label?: string;
  xPercent: number; // 1 to 96
  yPercent: number; // 8 to 90
  animDuration: number;
  animDelay: number;
  color: string;
  borderGlow: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ChapterFloatingElements: React.FC<ChapterFloatingElementsProps> = ({ chapterId }) => {
  const charms: FloatingCharm[] = useMemo(() => {
    const ch = (chapterId || '').toLowerCase();

    // 1. A Square and a Cube
    if (ch.includes('ch1-square') || ch.includes('square')) {
      return [
        { id: 'sq1', glyph: 'n² = 1 + 3 + 5 + …', label: 'Sum of Odds', xPercent: 2, yPercent: 14, animDuration: 12, animDelay: 0, color: '#F59E0B', borderGlow: 'rgba(245, 158, 11, 0.45)', size: 'md' },
        { id: 'sq2', glyph: '∛1729', label: 'Taxicab Number', xPercent: 91, yPercent: 18, animDuration: 14, animDelay: 1, color: '#FBBF24', borderGlow: 'rgba(251, 191, 36, 0.45)', size: 'lg' },
        { id: 'sq3', glyph: '√100 = 10', label: 'Principal Root', xPercent: 2.5, yPercent: 42, animDuration: 13, animDelay: 2, color: '#10B981', borderGlow: 'rgba(16, 185, 129, 0.45)', size: 'sm' },
        { id: 'sq4', glyph: '■ Gnomon', label: 'L-Shaped Growth', xPercent: 92, yPercent: 46, animDuration: 15, animDelay: 3, color: '#38BDF8', borderGlow: 'rgba(56, 189, 248, 0.45)', size: 'md' },
        { id: 'sq5', glyph: '1³ + 2³ + 3³', label: '= (1+2+3)²', xPercent: 1.5, yPercent: 72, animDuration: 11, animDelay: 1.5, color: '#A855F7', borderGlow: 'rgba(168, 85, 247, 0.45)', size: 'md' },
        { id: 'sq6', glyph: '✦ 9² = 81', label: '8 + 1 = 9', xPercent: 91.5, yPercent: 76, animDuration: 16, animDelay: 2.5, color: '#EC4899', borderGlow: 'rgba(236, 72, 153, 0.45)', size: 'sm' },
      ];
    }

    // 2. Power Play (Exponents)
    if (ch.includes('ch2-power') || ch.includes('power')) {
      return [
        { id: 'pow1', glyph: 'aᵐ · aⁿ = aᵐ⁺ⁿ', label: 'Product Law', xPercent: 2, yPercent: 14, animDuration: 12, animDelay: 0, color: '#0ea5e9', borderGlow: 'rgba(14, 165, 233, 0.45)', size: 'md' },
        { id: 'pow2', glyph: '2⁴² → Moon', label: 'Cosmic Fold', xPercent: 91, yPercent: 20, animDuration: 14, animDelay: 1, color: '#6366f1', borderGlow: 'rgba(99, 102, 241, 0.45)', size: 'lg' },
        { id: 'pow3', glyph: 'a⁻ⁿ = 1 / aⁿ', label: 'Inverse Power', xPercent: 2.5, yPercent: 44, animDuration: 13, animDelay: 2, color: '#06b6d4', borderGlow: 'rgba(6, 182, 212, 0.45)', size: 'sm' },
        { id: 'pow4', glyph: '(aᵐ)ⁿ = aᵐⁿ', label: 'Power of Power', xPercent: 92, yPercent: 48, animDuration: 15, animDelay: 3, color: '#a855f7', borderGlow: 'rgba(168, 85, 247, 0.45)', size: 'md' },
        { id: 'pow5', glyph: '3 × 10⁸ m/s', label: 'Speed of Light', xPercent: 1.5, yPercent: 70, animDuration: 11, animDelay: 1.5, color: '#ec4899', borderGlow: 'rgba(236, 72, 153, 0.45)', size: 'md' },
        { id: 'pow6', glyph: '🪐 10¹¹ Stars', label: 'Milky Way', xPercent: 91.5, yPercent: 74, animDuration: 16, animDelay: 2.5, color: '#38bdf8', borderGlow: 'rgba(56, 189, 248, 0.45)', size: 'sm' },
      ];
    }

    // 3. A Story of Numbers
    if (ch.includes('ch3-story') || ch.includes('numbers')) {
      return [
        { id: 'num1', glyph: 'Śūnya · 0', label: 'Brahmagupta 628 CE', xPercent: 2, yPercent: 15, animDuration: 12, animDelay: 0, color: '#f59e0b', borderGlow: 'rgba(245, 158, 11, 0.45)', size: 'lg' },
        { id: 'num2', glyph: 'Base-60 𒐕', label: 'Babylonian Wedge', xPercent: 91, yPercent: 18, animDuration: 14, animDelay: 1, color: '#eab308', borderGlow: 'rgba(234, 179, 8, 0.45)', size: 'md' },
        { id: 'num3', glyph: 'Roman: XLII', label: 'Tally Additive', xPercent: 2.5, yPercent: 45, animDuration: 13, animDelay: 2, color: '#10b981', borderGlow: 'rgba(16, 185, 129, 0.45)', size: 'sm' },
        { id: 'num4', glyph: '10ⁿ Place Value', label: 'Positional Wonder', xPercent: 92, yPercent: 50, animDuration: 15, animDelay: 3, color: '#06b6d4', borderGlow: 'rgba(6, 182, 212, 0.45)', size: 'md' },
        { id: 'num5', glyph: 'Brahmi ౨', label: '3rd c. BCE Origin', xPercent: 1.5, yPercent: 72, animDuration: 11, animDelay: 1.5, color: '#a855f7', borderGlow: 'rgba(168, 85, 247, 0.45)', size: 'md' },
        { id: 'num6', glyph: '📜 Zero as Number', label: 'Khandakhadyaka', xPercent: 91.5, yPercent: 76, animDuration: 16, animDelay: 2.5, color: '#f97316', borderGlow: 'rgba(249, 115, 22, 0.45)', size: 'sm' },
      ];
    }

    // 4. Quadrilaterals
    if (ch.includes('ch4-quad') || ch.includes('quad')) {
      return [
        { id: 'q1', glyph: '◇ Rhombus', label: 'd₁ ⊥ d₂ Bisectors', xPercent: 2, yPercent: 14, animDuration: 12, animDelay: 0, color: '#14b8a6', borderGlow: 'rgba(20, 184, 166, 0.45)', size: 'lg' },
        { id: 'q2', glyph: 'Σ Angles = 360°', label: '(4−2) × 180°', xPercent: 91, yPercent: 18, animDuration: 14, animDelay: 1, color: '#06b6d4', borderGlow: 'rgba(6, 182, 212, 0.45)', size: 'md' },
        { id: 'q3', glyph: '▱ Parallelogram', label: 'Opposite Angles =', xPercent: 2.5, yPercent: 44, animDuration: 13, animDelay: 2, color: '#3b82f6', borderGlow: 'rgba(59, 130, 246, 0.45)', size: 'sm' },
        { id: 'q4', glyph: 'Trapezium ⏢', label: 'One Parallel Pair', xPercent: 92, yPercent: 48, animDuration: 15, animDelay: 3, color: '#8b5cf6', borderGlow: 'rgba(139, 92, 246, 0.45)', size: 'md' },
        { id: 'q5', glyph: '◜ Compass Arc', label: 'Unique Diagonal', xPercent: 1.5, yPercent: 70, animDuration: 11, animDelay: 1.5, color: '#10b981', borderGlow: 'rgba(16, 185, 129, 0.45)', size: 'md' },
        { id: 'q6', glyph: '🪁 Kite Symmetry', label: 'Perpendicular Arms', xPercent: 91.5, yPercent: 74, animDuration: 16, animDelay: 2.5, color: '#ec4899', borderGlow: 'rgba(236, 72, 153, 0.45)', size: 'sm' },
      ];
    }

    // 5. Number Play
    if (ch.includes('ch5-number') || ch.includes('play')) {
      return [
        { id: 'np1', glyph: 'N ≡ ΣDigits (mod 9)', label: 'Navashesa Casting', xPercent: 2, yPercent: 14, animDuration: 12, animDelay: 0, color: '#a855f7', borderGlow: 'rgba(168, 85, 247, 0.45)', size: 'lg' },
        { id: 'np2', glyph: '111 = 3 × 37', label: 'Repunit Secret', xPercent: 91, yPercent: 18, animDuration: 14, animDelay: 1, color: '#c084fc', borderGlow: 'rgba(192, 132, 252, 0.45)', size: 'md' },
        { id: 'np3', glyph: 'Magic Square 3×3', label: 'Center = 5, Sum = 15', xPercent: 2.5, yPercent: 44, animDuration: 13, animDelay: 2, color: '#6366f1', borderGlow: 'rgba(99, 102, 241, 0.45)', size: 'sm' },
        { id: 'np4', glyph: 'Divisibility 11', label: 'Alt-Sum Difference', xPercent: 92, yPercent: 48, animDuration: 15, animDelay: 3, color: '#f43f5e', borderGlow: 'rgba(244, 63, 94, 0.45)', size: 'md' },
        { id: 'np5', glyph: 'Palindromes 121', label: '11 × 11', xPercent: 1.5, yPercent: 70, animDuration: 11, animDelay: 1.5, color: '#eab308', borderGlow: 'rgba(234, 179, 8, 0.45)', size: 'md' },
        { id: 'np6', glyph: '🔮 Cryptarithm', label: 'A + B = C', xPercent: 91.5, yPercent: 74, animDuration: 16, animDelay: 2.5, color: '#06b6d4', borderGlow: 'rgba(6, 182, 212, 0.45)', size: 'sm' },
      ];
    }

    // 6. We Distribute, Yet Things Multiply
    if (ch.includes('ch6-we-distribute') || ch.includes('distribute')) {
      return [
        { id: 'dist1', glyph: '(a + b)² = a² + 2ab + b²', label: 'Geometric Square', xPercent: 2, yPercent: 14, animDuration: 12, animDelay: 0, color: '#f97316', borderGlow: 'rgba(249, 115, 22, 0.45)', size: 'lg' },
        { id: 'dist2', glyph: '(a − b)(a + b) = a² − b²', label: 'Difference of Squares', xPercent: 91, yPercent: 18, animDuration: 14, animDelay: 1, color: '#fb923c', borderGlow: 'rgba(251, 146, 60, 0.45)', size: 'md' },
        { id: 'dist3', glyph: 'Area Grid ⊞', label: 'Split Rectangles', xPercent: 2.5, yPercent: 44, animDuration: 13, animDelay: 2, color: '#eab308', borderGlow: 'rgba(234, 179, 8, 0.45)', size: 'sm' },
        { id: 'dist4', glyph: 'FOIL Arc ↷', label: 'First Outer Inner Last', xPercent: 92, yPercent: 48, animDuration: 15, animDelay: 3, color: '#ef4444', borderGlow: 'rgba(239, 68, 68, 0.45)', size: 'md' },
        { id: 'dist5', glyph: 'x² + (a+b)x + ab', label: 'Quadratic Expansion', xPercent: 1.5, yPercent: 70, animDuration: 11, animDelay: 1.5, color: '#10b981', borderGlow: 'rgba(16, 185, 129, 0.45)', size: 'md' },
        { id: 'dist6', glyph: '98 × 102 = 100² − 2²', label: 'Mental Math Hack', xPercent: 91.5, yPercent: 74, animDuration: 16, animDelay: 2.5, color: '#38bdf8', borderGlow: 'rgba(56, 189, 248, 0.45)', size: 'sm' },
      ];
    }

    // 7. Proportional Reasoning
    if (ch.includes('ch7-proportion') || ch.includes('proport')) {
      return [
        { id: 'prop1', glyph: 'Golden Spiral ୭', label: 'Φ = 1.618033…', xPercent: 2, yPercent: 14, animDuration: 12, animDelay: 0, color: '#ec4899', borderGlow: 'rgba(236, 72, 153, 0.45)', size: 'lg' },
        { id: 'prop2', glyph: 'y = kx', label: 'Direct Proportion', xPercent: 91, yPercent: 18, animDuration: 14, animDelay: 1, color: '#f43f5e', borderGlow: 'rgba(244, 63, 94, 0.45)', size: 'md' },
        { id: 'prop3', glyph: 'x · y = C', label: 'Inverse Proportion', xPercent: 2.5, yPercent: 44, animDuration: 13, animDelay: 2, color: '#8b5cf6', borderGlow: 'rgba(139, 92, 246, 0.45)', size: 'sm' },
        { id: 'prop4', glyph: 'Gear Ratio ⚙', label: 'T₁ · ω₁ = T₂ · ω₂', xPercent: 92, yPercent: 48, animDuration: 15, animDelay: 3, color: '#f59e0b', borderGlow: 'rgba(245, 158, 11, 0.45)', size: 'md' },
        { id: 'prop5', glyph: 'Rule of Three ⚖', label: 'Trairāśika Ancient Math', xPercent: 1.5, yPercent: 70, animDuration: 11, animDelay: 1.5, color: '#10b981', borderGlow: 'rgba(16, 185, 129, 0.45)', size: 'md' },
        { id: 'prop6', glyph: 'Map Scale 1:50000', label: 'Scale Factor', xPercent: 91.5, yPercent: 74, animDuration: 16, animDelay: 2.5, color: '#06b6d4', borderGlow: 'rgba(6, 182, 212, 0.45)', size: 'sm' },
      ];
    }

    // Part II & General Universe Fallback
    return [
      { id: 'gen1', glyph: 'Baudhāyana Cord', label: 'a² + b² = c²', xPercent: 2, yPercent: 14, animDuration: 12, animDelay: 0, color: '#14b8a6', borderGlow: 'rgba(20, 184, 166, 0.45)', size: 'lg' },
      { id: 'gen2', glyph: 'Meru Prastāra ▲', label: 'Pingala / Pascal', xPercent: 91, yPercent: 18, animDuration: 14, animDelay: 1, color: '#f59e0b', borderGlow: 'rgba(245, 158, 11, 0.45)', size: 'md' },
      { id: 'gen3', glyph: 'Euler: V − E + F = 2', label: 'Polyhedral Polyglot', xPercent: 2.5, yPercent: 44, animDuration: 13, animDelay: 2, color: '#a855f7', borderGlow: 'rgba(168, 85, 247, 0.45)', size: 'sm' },
      { id: 'gen4', glyph: 'π ≈ 355 / 113', label: 'Aryabhata Approximation', xPercent: 92, yPercent: 48, animDuration: 15, animDelay: 3, color: '#eab308', borderGlow: 'rgba(234, 179, 8, 0.45)', size: 'md' },
      { id: 'gen5', glyph: '❄ Koch Snowflake', label: 'Infinite Perimeter', xPercent: 1.5, yPercent: 70, animDuration: 11, animDelay: 1.5, color: '#38bdf8', borderGlow: 'rgba(56, 189, 248, 0.45)', size: 'md' },
      { id: 'gen6', glyph: '✧ 112 Masteries', label: 'Complete Ganita Universe', xPercent: 91.5, yPercent: 74, animDuration: 16, animDelay: 2.5, color: '#ec4899', borderGlow: 'rgba(236, 72, 153, 0.45)', size: 'sm' },
    ];
  }, [chapterId]);

  return (
    <aside
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
    >
      {/* Ambient soft glow clouds in background */}
      <div className="absolute top-1/6 left-6 w-72 h-72 rounded-full bg-teal-500/5 blur-3xl soft-shimmer" />
      <div
        className="absolute bottom-1/4 right-8 w-80 h-80 rounded-full bg-amber-400/5 blur-3xl soft-shimmer"
        style={{ animationDelay: '2.5s' }}
      />

      {/* Floating Mathematical Charms along screen margins */}
      {charms.map((charm) => {
        let sizeClasses = 'text-xs px-2.5 py-1';
        if (charm.size === 'lg') sizeClasses = 'text-xs sm:text-sm px-3 py-1.5 font-black';
        if (charm.size === 'sm') sizeClasses = 'text-[11px] px-2 py-0.5 font-bold';

        return (
          <div
            key={charm.id}
            className="absolute float-gentle transition-transform duration-700"
            style={{
              top: `${charm.yPercent}%`,
              left: `${charm.xPercent}%`,
              animationDuration: `${charm.animDuration}s`,
              animationDelay: `${charm.animDelay}s`,
            }}
          >
            <div
              className={`rounded-2xl border backdrop-blur-md shadow-md flex items-center gap-1.5 whitespace-nowrap ${sizeClasses}`}
              style={{
                backgroundColor: 'rgba(255, 253, 245, 0.88)',
                borderColor: charm.borderGlow,
                color: charm.color,
                boxShadow: `0 4px 14px -2px ${charm.borderGlow}`,
                textShadow: `0 0 1px ${charm.color}`,
              }}
            >
              <span className="tracking-tight">{charm.glyph}</span>
              {charm.label && (
                <span className="text-[9px] opacity-75 font-medium tracking-normal hidden xl:inline">
                  · {charm.label}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </aside>
  );
};
