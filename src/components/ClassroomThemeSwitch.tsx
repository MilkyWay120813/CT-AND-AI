import React, { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';

interface ClassroomThemeSwitchProps {
  theme: 'light' | 'midnight-chalkboard';
  onToggleTheme: () => void;
  variant?: 'fixed' | 'inline';
}

/**
 * Synthesizes an authentic mechanical wall switch click via Web Audio API.
 */
function playSwitchSound(isTurningOn: boolean) {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (isTurningOn) {
      // Crisp upward snap
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.04);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.06);
    } else {
      // Deeper downward thud snap
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.05);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.07);
    }
  } catch {
    // Graceful fallback if Web Audio is restricted
  }
}

export const ClassroomThemeSwitch: React.FC<ClassroomThemeSwitchProps> = ({
  theme,
  onToggleTheme,
  variant = 'fixed',
}) => {
  const isChalkboard = theme === 'midnight-chalkboard';
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    playSwitchSound(!isChalkboard);
    onToggleTheme();
  };

  const containerClass =
    variant === 'inline'
      ? 'relative inline-flex items-center select-none'
      : 'fixed top-3 right-3 sm:top-4 sm:right-6 z-50 select-none';

  return (
    <div
      className={containerClass}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Real Classroom Light Switch Plate */}
      <button
        type="button"
        role="switch"
        aria-checked={isChalkboard}
        aria-label={`Toggle classroom theme. Currently in ${isChalkboard ? 'Midnight Chalkboard' : 'Daylight'} mode`}
        onClick={handleClick}
        className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-2xl transition-all duration-300 shadow-lg cursor-pointer border-2 ${
          isChalkboard
            ? 'bg-[#152B20] border-[#34D399]/60 shadow-[0_4px_20px_rgba(15,29,23,0.8)] text-[#F3F4F6]'
            : 'bg-[#FFFDF7] border-[#D6C7A1] shadow-[0_4px_16px_rgba(80,60,30,0.15)] text-[#1C1917]'
        } hover:scale-105 active:scale-95`}
      >
        {/* Top Screw Representation */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full border border-stone-400 bg-stone-300 flex items-center justify-center opacity-60">
          <div className="w-1 h-[0.5px] bg-stone-600 rotate-45" />
        </div>

        {/* Tactile Mechanical Switch Mechanism */}
        <div
          className={`relative w-12 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center border ${
            isChalkboard
              ? 'bg-[#0B1711] border-[#34D399]/40'
              : 'bg-[#E5DEC9] border-[#C8BFA5]'
          }`}
        >
          {/* Neon / Glow Indicator Light */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 ${
              isChalkboard
                ? 'bg-[#34D399] shadow-[0_0_8px_#34D399]'
                : 'bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]'
            }`}
          />

          {/* Toggle Thumb / Lever */}
          <div
            className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
              isChalkboard
                ? 'translate-x-6 bg-[#34D399] text-[#0A1A12]'
                : 'translate-x-0 bg-[#FFF] text-[#D97706]'
            }`}
          >
            {isChalkboard ? (
              <Moon className="w-3 h-3 stroke-[2.5]" />
            ) : (
              <Sun className="w-3 h-3 stroke-[2.5]" />
            )}
          </div>
        </div>

        {/* Classroom Theme Text Badge */}
        <div className="text-left hidden sm:block">
          <div className="text-[9px] font-black uppercase tracking-wider opacity-70">
            Classroom Mode
          </div>
          <div className="text-xs font-black tracking-tight flex items-center gap-1">
            <span>{isChalkboard ? 'Midnight Chalkboard' : 'Daylight Class'}</span>
            {isChalkboard && <Sparkles className="w-3 h-3 text-[#34D399] animate-pulse" />}
          </div>
        </div>

        {/* Bottom Screw Representation */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full border border-stone-400 bg-stone-300 flex items-center justify-center opacity-60">
          <div className="w-1 h-[0.5px] bg-stone-600 -rotate-45" />
        </div>
      </button>

      {/* Floating Helper Tooltip on Hover */}
      {isHovered && (
        <div
          className={`absolute top-full right-0 mt-2 px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-xl border whitespace-nowrap pointer-events-none transition-opacity ${
            isChalkboard
              ? 'bg-[#0E1F16] border-[#34D399]/40 text-[#E2E8F0]'
              : 'bg-[#1C1917] border-stone-700 text-[#FAF6EE]'
          }`}
        >
          {isChalkboard
            ? '💡 Click to turn on classroom lights (Daylight Theme)'
            : '🌙 Click switch to enter Midnight Chalkboard Dark Mode'}
        </div>
      )}
    </div>
  );
};
