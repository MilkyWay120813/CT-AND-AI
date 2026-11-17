import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, SlidersHorizontal, Film, BookOpen } from 'lucide-react';
import {
  AmbienceSettings,
  MotionMode,
  SOUNDSCAPE_PRESETS,
  SoundscapePresetId,
  TransitionStyle,
} from '../utils/soundscapeEngine';

interface AmbienceControlPillProps {
  settings: AmbienceSettings;
  isAudioUnlocked: boolean;
  onUpdateSettings: (patch: Partial<AmbienceSettings>, triggeredByUser?: boolean) => void;
  variant?: 'inline' | 'fixed';
}

export const AmbienceControlPill: React.FC<AmbienceControlPillProps> = ({
  settings,
  isAudioUnlocked,
  onUpdateSettings,
  variant = 'inline',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isOpen]);

  const isAudible = !settings.muted && settings.preset !== 'off';
  const currentPreset = SOUNDSCAPE_PRESETS[settings.preset];

  return (
    <div
      ref={containerRef}
      className={
        variant === 'fixed'
          ? 'fixed top-3 left-3 sm:top-4 sm:left-6 z-50 select-none'
          : 'relative inline-flex items-center select-none'
      }
    >
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (isAudible) {
            onUpdateSettings({}, true);
          }
        }}
        aria-expanded={isOpen}
        aria-label="Cinema Ambience & Soundscape Controls"
        title="Soundscape, Transitions & Ambient Motion"
        className={`inline-flex items-center gap-2 h-9 px-3 rounded-full text-xs font-black transition-all cursor-pointer shadow-2xs border ${
          isAudible
            ? 'bg-[#0F766E] hover:bg-[#115E59] text-white border-[#0F766E]'
            : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
        }`}
      >
        {isAudible ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Ambience</span>
            {/* Tiny Live Equalizer Bars */}
            <span className="inline-flex items-end gap-[2px] h-3" aria-hidden="true">
              <span
                className={`w-[2px] rounded-full bg-amber-300 ${
                  isAudioUnlocked ? 'cinema-eq-bar-1' : 'h-1.5 opacity-70'
                }`}
              />
              <span
                className={`w-[2px] rounded-full bg-teal-200 ${
                  isAudioUnlocked ? 'cinema-eq-bar-2' : 'h-2.5 opacity-70'
                }`}
              />
              <span
                className={`w-[2px] rounded-full bg-amber-300 ${
                  isAudioUnlocked ? 'cinema-eq-bar-3' : 'h-1.5 opacity-70'
                }`}
              />
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">Muted</span>
          </>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 w-76 sm:w-80 rounded-2xl bg-white border-2 border-stone-200 shadow-2xl p-4 space-y-4 z-50 text-stone-900 ${
            variant === 'fixed' ? 'left-0' : 'right-0'
          }`}
        >
          {/* Header + Mute Toggle */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0F766E]" />
              <div>
                <div className="text-xs font-black text-stone-900">Cinema Ambience</div>
                <div className="text-[10px] font-semibold text-stone-500">
                  {isAudible ? `${currentPreset.emoji} ${currentPreset.label}` : '🔇 Audio Muted'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onUpdateSettings(
                  {
                    muted: !settings.muted,
                    preset: settings.muted && settings.preset === 'off' ? 'classroom' : settings.preset,
                  },
                  true
                )
              }
              className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-colors cursor-pointer ${
                isAudible
                  ? 'bg-teal-50 text-[#0F766E] border border-teal-200 hover:bg-teal-100'
                  : 'bg-[#0F766E] text-white hover:bg-[#115E59]'
              }`}
            >
              {isAudible ? 'Mute' : 'Turn On'}
            </button>
          </div>

          {/* Soundscape Presets */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-stone-500">
              Soundscape Room
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {(['classroom', 'observatory', 'library'] as SoundscapePresetId[]).map((id) => {
                const p = SOUNDSCAPE_PRESETS[id];
                const active = !settings.muted && settings.preset === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onUpdateSettings({ preset: id, muted: false }, true)}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-teal-50 border-[#0F766E] text-[#0F766E]'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{p.emoji}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-black truncate">{p.label}</div>
                        <div className="text-[10px] text-stone-500 truncate">{p.subtitle}</div>
                      </div>
                    </div>
                    {active && (
                      <span className="w-2 h-2 rounded-full bg-[#00B4A7] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-700">
              <span>Ambience Volume</span>
              <span className="tabular-nums font-mono">{Math.round(settings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={1}
              step={0.05}
              value={settings.volume}
              onChange={(e) =>
                onUpdateSettings({ volume: parseFloat(e.target.value), muted: false }, true)
              }
              className="w-full math-slider cursor-pointer"
            />
          </div>

          {/* Scene Transition Animation Choice (Curtain vs Page-Flip) */}
          <div className="space-y-1.5 pt-2 border-t border-stone-200">
            <div className="text-[10px] font-black uppercase tracking-wider text-stone-500 flex items-center gap-1">
              <Film className="w-3 h-3" />
              <span>Hub ↔ Solver Transition</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'curtain', label: 'Curtain Close', icon: Film },
                  { id: 'page-flip', label: '3D Page-Flip', icon: BookOpen },
                ] as Array<{ id: TransitionStyle; label: string; icon: React.ComponentType<{ className?: string }> }>
              ).map((opt) => {
                const OptIcon = opt.icon;
                const active = settings.transitionStyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onUpdateSettings({ transitionStyle: opt.id }, true)}
                    className={`inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border text-[11px] font-black cursor-pointer transition-colors ${
                      active
                        ? 'bg-[#0F766E] text-white border-[#0F766E]'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <OptIcon className="w-3 h-3" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Background Moving Objects Toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-stone-200">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-700">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Moving Backdrop Objects</span>
            </div>
            <div className="inline-flex rounded-lg bg-stone-100 p-0.5 border border-stone-200">
              {(['immersive', 'minimal'] as MotionMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onUpdateSettings({ motionMode: mode }, true)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black capitalize cursor-pointer transition-colors ${
                    settings.motionMode === mode
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
