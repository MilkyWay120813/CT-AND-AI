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

  if (variant === 'inline') {
    return (
      <div
        className="relative inline-flex items-center select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          type="button"
          role="switch"
          aria-checked={isChalkboard}
          aria-label={`Toggle classroom theme. Currently in ${isChalkboard ? 'Midnight Chalkboard' : 'Daylight'} mode`}
          onClick={handleClick}
          className={`inline-flex items-center gap-2 h-9 pl-1.5 pr-3 rounded-full transition-all duration-200 cursor-pointer border text-xs font-bold shadow-2xs ${
            isChalkboard
              ? 'bg-[#12261C] border-[#34D399]/50 text-[#F3F4F6] hover:bg-[#193326]'
              : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
          }`}
        >
          {/* Compact Switch Track */}
          <span
            className={`relative w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
              isChalkboard ? 'bg-[#0B1711] border border-[#34D399]/40' : 'bg-[#E5DEC9]'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full shadow-xs transform transition-transform duration-200 flex items-center justify-center ${
                isChalkboard
                  ? 'translate-x-4 bg-[#34D399] text-[#0A1A12]'
                  : 'translate-x-0 bg-white text-[#D97706]'
              }`}
            >
              {isChalkboard ? (
                <Moon className="w-2.5 h-2.5 stroke-[2.5]" />
              ) : (
                <Sun className="w-2.5 h-2.5 stroke-[2.5]" />
              )}
            </span>
          </span>
          <span className="hidden sm:inline whitespace-nowrap">
            {isChalkboard ? 'Chalkboard' : 'Daylight'}
          </span>
        </button>

        {isHovered && (
          <div
            className={`absolute top-full right-0 mt-2 px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-xl border whitespace-nowrap pointer-events-none z-50 ${
              isChalkboard
                ? 'bg-[#0E1F16] border-[#34D399]/40 text-[#E2E8F0]'
                : 'bg-[#1C1917] border-stone-700 text-[#FAF6EE]'
            }`}
          >
            {isChalkboard
              ? 'Switch to Daylight Classroom'
              : 'Switch to Midnight Chalkboard'}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="fixed top-3 right-3 sm:top-4 sm:right-6 z-50 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Real Classroom Light Switch Plate (Welcome Screen) */}
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
        <div
          className={`relative w-11 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center border ${
            isChalkboard
              ? 'bg-[#0B1711] border-[#34D399]/40'
              : 'bg-[#E5DEC9] border-[#C8BFA5]'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
              isChalkboard
                ? 'translate-x-5 bg-[#34D399] text-[#0A1A12]'
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

        <div className="text-left hidden sm:block">
          <div className="text-xs font-black tracking-tight flex items-center gap-1">
            <span>{isChalkboard ? 'Midnight Chalkboard' : 'Daylight Class'}</span>
            {isChalkboard && <Sparkles className="w-3 h-3 text-[#34D399] animate-pulse" />}
          </div>
        </div>
      </button>

      {isHovered && (
        <div
          className={`absolute top-full right-0 mt-2 px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-xl border whitespace-nowrap pointer-events-none transition-opacity ${
            isChalkboard
              ? 'bg-[#0E1F16] border-[#34D399]/40 text-[#E2E8F0]'
              : 'bg-[#1C1917] border-stone-700 text-[#FAF6EE]'
          }`}
        >
          {isChalkboard
            ? 'Switch to Daylight Classroom'
            : 'Switch to Midnight Chalkboard'}
        </div>
      )}
    </div>
  );
};
