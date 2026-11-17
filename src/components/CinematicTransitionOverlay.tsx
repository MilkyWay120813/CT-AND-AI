import React from 'react';
import { Sparkles, Calculator, BookOpen } from 'lucide-react';
import { TransitionStyle } from '../utils/soundscapeEngine';

export interface CinematicTransitionState {
  isActive: boolean;
  mode: TransitionStyle;
  title: string;
  subtitle: string;
  targetKind: 'solver' | 'hub' | 'chapter';
  runId: number;
}

interface CinematicTransitionOverlayProps {
  transition: CinematicTransitionState | null;
  theme: 'light' | 'midnight-chalkboard';
}

export const CinematicTransitionOverlay: React.FC<CinematicTransitionOverlayProps> = ({
  transition,
  theme,
}) => {
  if (!transition || !transition.isActive) return null;

  const isDark = theme === 'midnight-chalkboard';
  const Icon =
    transition.targetKind === 'solver'
      ? Calculator
      : transition.targetKind === 'hub'
      ? BookOpen
      : Sparkles;

  if (transition.mode === 'page-flip') {
    return (
      <div
        key={`flip-${transition.runId}`}
        aria-live="polite"
        data-testid="cinematic-transition-overlay"
        data-mode="page-flip"
        className="fixed inset-0 z-50 pointer-events-none overflow-hidden cinema-page-flip-perspective"
      >
        {/* Subtle dim scrim */}
        <div className="absolute inset-0 bg-black/25 cinema-scrim-pulse" />

        {/* Turning Folio Page */}
        <div
          className={`absolute inset-y-0 right-0 w-full cinema-page-flip-sheet flex items-center justify-center ${
            isDark
              ? 'bg-gradient-to-l from-[#10261C] via-[#153124] to-[#0A1912] border-l-4 border-[#34D399]/60'
              : 'bg-gradient-to-l from-[#FAF6EE] via-[#FFFDF7] to-[#EFE6D2] border-l-4 border-[#8D5B34]/60'
          }`}
        >
          {/* Spine shadow & specular paper gleam */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/25 to-transparent" />
          <div className="relative flex flex-col items-center gap-3 px-8 py-6 rounded-3xl border border-amber-400/40 bg-black/15 backdrop-blur-xs shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#00B4A7] text-white flex items-center justify-center shadow-lg">
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-center">
              <div className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                Turning Page
              </div>
              <div
                className={`text-xl sm:text-2xl font-chalk-title tracking-wide mt-0.5 ${
                  isDark ? 'text-white' : 'text-stone-900'
                }`}
              >
                {transition.title}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Theater Velvet Curtain Close -> Reveal
  return (
    <div
      key={`curtain-${transition.runId}`}
      aria-live="polite"
      data-testid="cinematic-transition-overlay"
      data-mode="curtain"
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
    >
      {/* Left Velvet Theater Curtain Panel */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 cinema-curtain-left flex items-center justify-end"
        style={{
          background: isDark
            ? 'repeating-linear-gradient(90deg, #0D291D 0px, #16402E 28px, #091E15 56px, #123626 84px)'
            : 'repeating-linear-gradient(90deg, #133827 0px, #1C5038 28px, #0F2D1F 56px, #194530 84px)',
          boxShadow: 'inset -18px 0 36px rgba(0,0,0,0.45)',
        }}
      >
        <div className="h-full w-2.5 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.5)]" />
      </div>

      {/* Right Velvet Theater Curtain Panel */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 cinema-curtain-right flex items-center justify-start"
        style={{
          background: isDark
            ? 'repeating-linear-gradient(90deg, #123626 0px, #091E15 28px, #16402E 56px, #0D291D 84px)'
            : 'repeating-linear-gradient(90deg, #194530 0px, #0F2D1F 28px, #1C5038 56px, #133827 84px)',
          boxShadow: 'inset 18px 0 36px rgba(0,0,0,0.45)',
        }}
      >
        <div className="h-full w-2.5 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.5)]" />
      </div>

      {/* Center Stage Spotlight Medallion during curtain meet */}
      <div className="absolute inset-0 flex items-center justify-center cinema-curtain-spotlight">
        <div className="px-7 py-5 rounded-3xl bg-[#0B1F16]/95 border-2 border-amber-400/75 shadow-[0_0_60px_rgba(251,191,36,0.35)] text-center space-y-1.5 max-w-sm mx-4">
          <div className="w-11 h-11 mx-auto rounded-2xl bg-amber-400/20 border border-amber-300/60 flex items-center justify-center text-amber-300">
            <Icon className="w-5 h-5" />
          </div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-300">
            {transition.subtitle}
          </div>
          <div className="text-xl sm:text-2xl font-chalk-title text-white tracking-wide">
            {transition.title}
          </div>
        </div>
      </div>
    </div>
  );
};
