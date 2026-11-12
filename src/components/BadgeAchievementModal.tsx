import React, { useEffect, useCallback } from 'react';
import { Trophy, Sparkles, X, Award, CheckCircle2, Flame, Star, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MasteryBadgeDefinition } from '../data/masteryBadges';

interface BadgeAchievementModalProps {
  isOpen: boolean;
  badge: MasteryBadgeDefinition | null;
  onClose: () => void;
  totalUnlockedCount: number;
  onTriggerShake?: () => void;
}

// Multi-stage confetti celebration
export function fireBigAchievementConfetti() {
  try {
    // 1. Center burst
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#FDE047'],
    });

    // 2. Left and right cannons
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.7 },
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.7 },
      });
    }, 220);

    // 3. Falling gold stars & circles
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.3 },
        shapes: ['star', 'circle'],
        colors: ['#FFD700', '#FFA500', '#00FFFF', '#FF1493'],
      });
    }, 450);
  } catch {
    // Graceful fallback if in unsupported environment
  }
}

// Triumphant 4-note ascending fanfare via Web Audio API
export function playAchievementFanfare() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') ctx.resume();

    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.16 }, // C5
      { freq: 659.25, time: 0.16, dur: 0.16 }, // E5
      { freq: 783.99, time: 0.32, dur: 0.18 }, // G5
      { freq: 1046.5, time: 0.5, dur: 0.5 }, // C6
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + dur + 0.05);
    });
  } catch {
    // Ignore audio errors
  }
}

export const BadgeAchievementModal: React.FC<BadgeAchievementModalProps> = ({
  isOpen,
  badge,
  onClose,
  totalUnlockedCount,
  onTriggerShake,
}) => {
  const triggerCelebration = useCallback(() => {
    fireBigAchievementConfetti();
    playAchievementFanfare();
    if (onTriggerShake) {
      onTriggerShake();
    }
  }, [onTriggerShake]);

  useEffect(() => {
    if (isOpen && badge) {
      triggerCelebration();
    }
  }, [isOpen, badge, triggerCelebration]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !badge) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievement-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all duration-300"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-b from-[#0F3828] via-[#092218] to-[#04120D] border-4 border-amber-400 text-white shadow-2xl p-6 sm:p-8 text-center space-y-6">
        {/* Animated Background Aura Sunburst */}
        <div
          aria-hidden="true"
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-400/20 blur-3xl pointer-events-none"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close celebration modal"
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-stone-950 font-black text-xs uppercase tracking-widest shadow-md">
            <Sparkles className="w-4 h-4 fill-stone-950" />
            <span>Big Achievement Unlocked!</span>
            <Sparkles className="w-4 h-4 fill-stone-950" />
          </div>

          <h2
            id="achievement-modal-title"
            className="text-2xl sm:text-3xl font-black text-amber-200 tracking-tight"
          >
            {badge.title}
          </h2>
          <p className="text-teal-200/90 text-sm font-semibold max-w-md mx-auto">
            {badge.subtitle}
          </p>
        </div>

        {/* Centerpiece Giant Badge Emblem */}
        <div className="relative flex justify-center py-2">
          {/* Rotating Ray Aura */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full border-2 border-dashed border-amber-400/40 badge-ray-spin" />
          </div>

          <div className="relative flex flex-col items-center justify-center w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-stone-950 shadow-xl border-4 border-white/90 transform hover:scale-105 transition-transform duration-300">
            <span className="text-5xl sm:text-6xl filter drop-shadow-md">{badge.emblemGlyph}</span>
            <span className="text-[10px] uppercase font-black tracking-widest mt-1 opacity-90">
              Badge #{badge.badgeNumber}
            </span>
          </div>
        </div>

        {/* Points & Progress Stats */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-center">
            <div className="text-[11px] uppercase tracking-wider text-amber-300 font-bold flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Reward</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
              +{badge.pointsReward} pts
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-center">
            <div className="text-[11px] uppercase tracking-wider text-teal-300 font-bold flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-teal-300" />
              <span>Total Badges</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {totalUnlockedCount} / 115
            </div>
          </div>
        </div>

        {/* Badge Chapter & Concept Summary */}
        <p className="text-xs sm:text-sm text-stone-300 italic max-w-md mx-auto leading-relaxed border-t border-b border-white/10 py-3">
          &ldquo;Mastered in {badge.chapterTitle}: {badge.subtitle}&rdquo;
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={triggerCelebration}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/50 font-black text-xs sm:text-sm transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-amber-300" />
            <span>Celebrate Again! (Shake &amp; Confetti)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#2DD4BF] to-[#14B8A6] hover:from-[#14B8A6] hover:to-[#0D9488] text-stone-950 font-black text-xs sm:text-sm shadow-lg transition cursor-pointer transform hover:scale-105"
          >
            <span>Awesome, Keep Learning! 🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};
