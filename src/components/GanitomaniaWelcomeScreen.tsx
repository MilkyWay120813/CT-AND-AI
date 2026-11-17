import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clapperboard, LayoutGrid, LogIn, CheckCircle2, Layers } from 'lucide-react';
import { StudentAccountProfile } from '../types/account';
import {
  MarqueeTheme,
  buildMarqueeBulbs,
  getMarqueePaletteForTheme,
} from '../utils/marqueeLighting';

interface GanitomaniaWelcomeScreenProps {
  theme: MarqueeTheme;
  studentAccount: StudentAccountProfile | null;
  onProceedToHub: () => void;
  onBrowseAllChapters: () => void;
  onChooseLessonStyle?: () => void;
  onOpenSignIn: () => void;
}

export const GanitomaniaWelcomeScreen: React.FC<GanitomaniaWelcomeScreenProps> = ({
  theme,
  studentAccount,
  onProceedToHub,
  onBrowseAllChapters,
  onChooseLessonStyle,
  onOpenSignIn,
}) => {
  const bulbs = useMemo(() => buildMarqueeBulbs(22), []);
  const palette = useMemo(() => getMarqueePaletteForTheme(theme), [theme]);

  return (
    <section
      aria-label="Welcome to Ganitomania Entrance"
      data-testid="ganitomania-welcome-screen"
      className="open-from-top max-w-5xl mx-auto pt-3 sm:pt-6 pb-10"
    >
      <div
        className="chalkboard-frame chalkboard-grid rounded-3xl overflow-hidden text-[#F9F8F3] relative"
        style={{
          boxShadow:
            theme === 'midnight-chalkboard'
              ? '0 24px 60px -12px rgba(0, 0, 0, 0.72), 0 0 0 1px rgba(253, 224, 71, 0.22)'
              : '0 22px 52px -12px rgba(25, 69, 48, 0.34), 0 0 0 1px rgba(141, 91, 52, 0.35)',
        }}
      >
        {/* Top Movie-Theater Marquee Bulb Chase Strip */}
        <div
          data-testid="welcome-marquee-lights-top"
          aria-hidden="true"
          className="px-4 sm:px-5 py-3 border-b flex items-center justify-between gap-1 sm:gap-2"
          style={{
            background: palette.trimBg,
            borderColor: palette.trimBorder,
          }}
        >
          {bulbs.map((bulb) => (
            <span
              key={`top-${bulb.index}`}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 ${
                bulb.phase === 'even' ? 'marquee-chase-even' : 'marquee-chase-odd'
              }`}
              style={{
                backgroundColor: palette.bulbOnHex,
                boxShadow: palette.bulbGlowCss,
              }}
            />
          ))}
        </div>

        {/* Center Cinema Stage Content */}
        <div className="px-6 py-10 sm:px-14 sm:py-14 relative overflow-hidden space-y-8">
          {/* Subtle Warm Projector Beam Sweep */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent cinema-banner-sweep"
          />

          {/* Top Quiet Cinema Kicker */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4 text-xs sm:text-sm font-mono text-[#FDE68A]/90">
            <div className="flex items-center gap-2.5 tracking-wider uppercase">
              <Clapperboard className="w-4 h-4 text-[#FDE047] shrink-0" />
              <span>Feature Presentation · NCERT Ganita Prakash Class VIII</span>
            </div>
            <div className="text-emerald-200/85 tabular-nums">
              Part I &amp; Part II · Screen 8-A
            </div>
          </div>

          {/* Focal Hero Title & Synopsis */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 max-w-3xl relative z-10"
          >
            <h1
              className="font-chalk-title text-4xl sm:text-6xl text-white leading-[1.12]"
              style={{
                textShadow: palette.headlineGlowCss,
                textWrap: 'balance',
              }}
            >
              Welcome to{' '}
              <span className="text-[#FDE047] underline decoration-wavy decoration-[#FDE047]/65 underline-offset-8">
                Ganitomania
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/95 leading-relaxed max-w-2xl">
              Step into the complete Class 8 mathematics studio. Explore all 14 chapters through interactive geometric labs, concept films, and timed mastery challenges—crafted to build deep mathematical intuition.
            </p>
          </motion.div>

          {/* Clean Unboxed Curriculum Highlights (Zero Pill Clutter) */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-4 gap-y-1.5 text-xs sm:text-[13px] font-mono text-[#FEF08A]/90 pt-1 tabular-nums relative z-10">
            <span className="whitespace-nowrap">14 Textbook Chapters</span>
            <span aria-hidden="true" className="hidden sm:inline text-white/35">·</span>
            <span className="whitespace-nowrap">112 Interactive Labs &amp; Games</span>
            <span aria-hidden="true" className="hidden sm:inline text-white/35">·</span>
            <span className="whitespace-nowrap">115 Mastery Badges</span>
            <span aria-hidden="true" className="hidden sm:inline text-white/35">·</span>
            <span className="whitespace-nowrap">Genius Bar Math Solver</span>
          </div>

          {/* Action Bar: Primary Proceed + Student Sign In + Browse 14 Chapters */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/15 relative z-10">
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <motion.button
                type="button"
                data-testid="ganitomania-proceed-btn"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onProceedToHub}
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-[#FDE047] hover:bg-[#FACC15] text-[#142E21] font-display font-bold text-base sm:text-lg shadow-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Proceed to Chapter Hub</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <button
                type="button"
                data-testid="ganitomania-signin-btn"
                onClick={onOpenSignIn}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  studentAccount
                    ? 'bg-emerald-950/60 border-[#5EEAD4]/55 text-[#5EEAD4] hover:bg-emerald-950/80'
                    : 'bg-white/10 hover:bg-white/15 border-white/25 text-white'
                }`}
              >
                {studentAccount ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                    <span>Signed In: {studentAccount.username}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-[#FDE047]" />
                    <span>Sign In to Save Stats</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 self-start sm:self-end pt-1">
              {onChooseLessonStyle && (
                <button
                  type="button"
                  data-testid="welcome-choose-lesson-style-btn"
                  onClick={onChooseLessonStyle}
                  className="inline-flex items-center gap-2 text-sm font-mono text-emerald-200 hover:text-white underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Layers className="w-4 h-4 text-[#FDE047]" />
                  <span>Choose Lesson Style (3 Modes)</span>
                </button>
              )}

              <button
                type="button"
                onClick={onBrowseAllChapters}
                className="inline-flex items-center gap-2 text-sm font-mono text-[#FDE047] hover:text-white underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Browse 14-Chapter Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Movie-Theater Marquee Bulb Chase Strip */}
        <div
          data-testid="welcome-marquee-lights-bottom"
          aria-hidden="true"
          className="px-4 sm:px-5 py-3 border-t flex items-center justify-between gap-1 sm:gap-2"
          style={{
            background: palette.trimBg,
            borderColor: palette.trimBorder,
          }}
        >
          {bulbs.map((bulb) => (
            <span
              key={`bot-${bulb.index}`}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 ${
                bulb.phase === 'odd' ? 'marquee-chase-even' : 'marquee-chase-odd'
              }`}
              style={{
                backgroundColor: palette.bulbOnHex,
                boxShadow: palette.bulbGlowCss,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
