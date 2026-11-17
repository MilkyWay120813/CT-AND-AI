import React, { useState, useRef, useEffect } from 'react';
import {
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Focus,
  AudioLines,
  Clapperboard,
  BookOpen,
  Sparkles,
  X,
  Wind,
  Gamepad2,
  Trophy,
  FileText,
} from 'lucide-react';
import {
  AmbienceSettings,
  SOUNDSCAPE_PRESETS,
  SoundscapePresetId,
} from '../utils/soundscapeEngine';
import { QuizDifficultySlider } from './QuizDifficultySlider';
import {
  DEFAULT_QUIZ_DIFFICULTY_SETTINGS,
  QuizDifficultyLevel,
  QuizDifficultySettings,
} from '../utils/quizDifficulty';

interface ControlCenterDuoProps {
  theme: 'light' | 'midnight-chalkboard';
  onToggleTheme: () => void;
  settings: AmbienceSettings;
  isAudioUnlocked: boolean;
  onUpdateSettings: (patch: Partial<AmbienceSettings>, triggeredByUser?: boolean) => void;
  quizDifficultySettings?: QuizDifficultySettings;
  effectiveDifficulty?: QuizDifficultyLevel;
  recommendedDifficulty?: QuizDifficultyLevel;
  recommendedReason?: string;
  onSelectDifficulty?: (level: QuizDifficultyLevel) => void;
  onToggleAutoMatchDifficulty?: (enabled: boolean) => void;
  cinemaFocus?: boolean;
  onToggleCinemaFocus?: () => void;
  isStorytellerOpen?: boolean;
  onToggleStoryteller?: () => void;
  showFocusAndStory?: boolean;
  onOpen112Labs?: () => void;
  onOpenTrophyRoom?: () => void;
  pdfUrl?: string;
  align?: 'left' | 'right';
}

const COMPACT_PRESETS: Array<{ id: SoundscapePresetId; short: string; emoji: string }> = [
  { id: 'classroom', short: 'Sunlit', emoji: '🌤️' },
  { id: 'observatory', short: 'Stars', emoji: '🌌' },
  { id: 'library', short: 'Rain', emoji: '🌧️' },
  { id: 'off', short: 'Off', emoji: '🔇' },
];

export const ControlCenterDuo: React.FC<ControlCenterDuoProps> = ({
  theme,
  onToggleTheme,
  settings,
  isAudioUnlocked,
  onUpdateSettings,
  quizDifficultySettings = DEFAULT_QUIZ_DIFFICULTY_SETTINGS,
  effectiveDifficulty = 2,
  recommendedDifficulty = 2,
  recommendedReason,
  onSelectDifficulty,
  onToggleAutoMatchDifficulty,
  cinemaFocus = false,
  onToggleCinemaFocus,
  isStorytellerOpen = false,
  onToggleStoryteller,
  showFocusAndStory = false,
  onOpen112Labs,
  onOpenTrophyRoom,
  pdfUrl,
  align = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const volumeRailRef = useRef<HTMLDivElement>(null);
  const paceRailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const isDark = theme === 'midnight-chalkboard';
  const isSilent = settings.muted || settings.preset === 'off' || settings.volume === 0;
  const volumePct = isSilent ? 0 : Math.round(settings.volume * 100);
  const paceNorm = Math.round(((settings.narrationRate - 0.75) / (1.15 - 0.75)) * 100);

  // Pointer vertical-rail helpers (authentic iPhone vertical duo feel)
  const updateVolumeFromPointer = (clientY: number) => {
    const el = volumeRailRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (rect.bottom - clientY) / rect.height));
    const nextVol = Number(ratio.toFixed(2));
    onUpdateSettings(
      {
        volume: nextVol,
        muted: nextVol === 0,
        preset: settings.preset === 'off' && nextVol > 0 ? 'classroom' : settings.preset,
      },
      true
    );
  };

  const updatePaceFromPointer = (clientY: number) => {
    const el = paceRailRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (rect.bottom - clientY) / rect.height));
    const nextRate = Number((0.75 + ratio * (1.15 - 0.75)).toFixed(2));
    onUpdateSettings({ narrationRate: nextRate }, true);
  };

  const presetInfo = SOUNDSCAPE_PRESETS[settings.preset];

  return (
    <div ref={containerRef} className="sm:relative inline-flex items-center" data-testid="control-center-duo">
      {/* Compact Duo Trigger Capsule: Quick Theme Switch + iPhone Duo Controls Drawer */}
      <div
        className={`inline-flex items-center h-9 p-0.5 rounded-full border shadow-2xs transition-colors ${
          isDark
            ? 'bg-[#0F241B] border-[#2C5843] text-[#FAF6EE]'
            : 'bg-stone-100 border-stone-300 text-stone-800'
        }`}
      >
        <button
          type="button"
          onClick={onToggleTheme}
          role="switch"
          aria-checked={isDark}
          aria-label={isDark ? 'Switch to Daylight Class theme' : 'Switch to Midnight Chalkboard theme'}
          title={isDark ? 'Switch to Daylight Class' : 'Switch to Midnight Chalkboard'}
          className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            isDark
              ? 'bg-[#194530] text-amber-200 hover:bg-[#1F543A]'
              : 'bg-white text-stone-800 hover:bg-stone-50 shadow-2xs'
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-amber-300" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          )}
          <span className="hidden sm:inline">{isDark ? 'Chalk' : 'Daylight'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label="Open Control Center Duo"
          data-testid="control-center-duo-trigger"
          className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            isOpen
              ? 'bg-[#00B4A7] text-white shadow-xs'
              : isDark
              ? 'text-emerald-100 hover:bg-white/10'
              : 'text-stone-700 hover:bg-white/70'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Controls</span>
          <span
            className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded-full ${
              isOpen
                ? 'bg-white/20 text-white'
                : !isSilent && isAudioUnlocked
                ? isDark
                  ? 'bg-emerald-400/20 text-emerald-200'
                  : 'bg-emerald-500/20 text-emerald-800'
                : isDark
                ? 'bg-white/10 text-stone-300'
                : 'bg-stone-200 text-stone-600'
            }`}
          >
            {isSilent ? 'Muted' : `${volumePct}%`}
          </span>
        </button>
      </div>

      {/* iPhone Control Center Duo Drawer (Scrollable, zero backdrop-blur, high-clarity controls) */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Control Center Duo"
          data-testid="control-center-duo-panel"
          className={`absolute top-full mt-2 w-[316px] sm:w-[348px] max-w-[calc(100vw-1.5rem)] max-h-[80vh] overflow-y-auto rounded-3xl border p-3.5 shadow-2xl z-50 space-y-3 ${
            align === 'left'
              ? 'left-0 right-0 mx-auto sm:mx-0 sm:right-auto sm:left-0'
              : 'left-0 right-0 mx-auto sm:mx-0 sm:left-auto sm:right-0'
          } ${
            isDark
              ? 'bg-[#0D1F17] border-[#2F5E48] text-[#FAF6EE]'
              : 'bg-[#12261D] border-[#2C5642] text-[#FAF6EE]'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-1">
            <div className="min-w-0">
              <div className="text-[11px] font-black uppercase tracking-wider text-teal-300">
                Duo Control Center
              </div>
              <div className="text-[11px] text-white/70 truncate">
                {presetInfo.emoji} {presetInfo.label} · {isDark ? 'Midnight Chalkboard' : 'Daylight Class'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Control Center Duo"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2x2 iPhone-Style Quick Action Tile Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Tile 1: Classroom Theme */}
            <button
              type="button"
              onClick={onToggleTheme}
              className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                isDark
                  ? 'bg-amber-400/20 border-amber-300/60 text-amber-100'
                  : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
              }`}
            >
              <span
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isDark ? 'bg-amber-400 text-stone-950' : 'bg-amber-300/20 text-amber-300'
                }`}
              >
                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-black leading-tight truncate">
                  {isDark ? 'Chalkboard' : 'Daylight'}
                </span>
                <span className="block text-[10px] text-white/65 truncate">Room Theme</span>
              </span>
            </button>

            {/* Tile 2: Transition Style (Curtain vs Page-Flip) */}
            <button
              type="button"
              onClick={() =>
                onUpdateSettings(
                  {
                    transitionStyle:
                      settings.transitionStyle === 'curtain' ? 'page-flip' : 'curtain',
                  },
                  true
                )
              }
              className="flex items-center gap-2.5 p-2.5 rounded-2xl border bg-white/10 hover:bg-white/15 border-white/15 text-white text-left transition-all cursor-pointer"
            >
              <span className="w-8 h-8 rounded-xl bg-teal-400/20 text-teal-300 flex items-center justify-center shrink-0">
                {settings.transitionStyle === 'curtain' ? (
                  <Clapperboard className="w-4 h-4" />
                ) : (
                  <BookOpen className="w-4 h-4" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-black leading-tight truncate">
                  {settings.transitionStyle === 'curtain' ? 'Curtain' : 'Page-Flip'}
                </span>
                <span className="block text-[10px] text-white/65 truncate">Scene Cut</span>
              </span>
            </button>

            {/* Tile 3: Cinema Focus (in Hub) OR Motion Level */}
            {showFocusAndStory && onToggleCinemaFocus ? (
              <button
                type="button"
                onClick={onToggleCinemaFocus}
                aria-pressed={cinemaFocus}
                className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  cinemaFocus
                    ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-xs'
                    : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    cinemaFocus ? 'bg-stone-950/15 text-stone-950' : 'bg-white/15 text-amber-200'
                  }`}
                >
                  <Focus className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-black leading-tight truncate">
                    Cinema Focus
                  </span>
                  <span
                    className={`block text-[10px] truncate ${
                      cinemaFocus ? 'text-stone-900/80 font-bold' : 'text-white/65'
                    }`}
                  >
                    {cinemaFocus ? 'Spotlight On' : 'Dim Stage'}
                  </span>
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings(
                    { motionMode: settings.motionMode === 'immersive' ? 'minimal' : 'immersive' },
                    true
                  )
                }
                className="flex items-center gap-2.5 p-2.5 rounded-2xl border bg-white/10 hover:bg-white/15 border-white/15 text-white text-left transition-all cursor-pointer"
              >
                <span className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Wind className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-black leading-tight truncate">
                    {settings.motionMode === 'immersive' ? 'Immersive' : 'Minimal'}
                  </span>
                  <span className="block text-[10px] text-white/65 truncate">Backdrop Drift</span>
                </span>
              </button>
            )}

            {/* Tile 4: Storyteller OR Motion Level */}
            {showFocusAndStory && onToggleStoryteller ? (
              <button
                type="button"
                onClick={onToggleStoryteller}
                aria-pressed={isStorytellerOpen}
                className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isStorytellerOpen
                    ? 'bg-[#00B4A7] text-white border-teal-300 shadow-xs'
                    : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isStorytellerOpen ? 'bg-white/20 text-white' : 'bg-teal-400/20 text-teal-300'
                  }`}
                >
                  <AudioLines className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-black leading-tight truncate">
                    Storyteller
                  </span>
                  <span className="block text-[10px] text-white/75 truncate">
                    {isStorytellerOpen ? 'Theater Open' : 'Ethereal Tale'}
                  </span>
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings(
                    {
                      muted: !isSilent,
                      preset: isSilent && settings.preset === 'off' ? 'classroom' : settings.preset,
                    },
                    true
                  )
                }
                className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  !isSilent
                    ? 'bg-emerald-500/25 border-emerald-400/50 text-white'
                    : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                }`}
              >
                <span className="w-8 h-8 rounded-xl bg-white/15 text-emerald-300 flex items-center justify-center shrink-0">
                  {isSilent ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-black leading-tight truncate">
                    {isSilent ? 'Audio Off' : 'Sound On'}
                  </span>
                  <span className="block text-[10px] text-white/65 truncate">Ambience</span>
                </span>
              </button>
            )}
          </div>

          {/* Signature iPhone Side-by-Side Vertical Duo Sliders */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* DUO COLUMN 1: Soundscape Volume Vertical Bar */}
            <div className="rounded-2xl bg-black/25 border border-white/10 p-2.5 flex flex-col items-center gap-2">
              <div className="w-full flex items-center justify-between text-[11px] font-bold">
                <span className="text-teal-200">Ambience</span>
                <span className="font-mono tabular-nums text-white" data-testid="duo-volume-value">
                  {isSilent ? 'Mute' : `${volumePct}%`}
                </span>
              </div>

              <div
                ref={volumeRailRef}
                onPointerDown={(e) => {
                  updateVolumeFromPointer(e.clientY);
                }}
                className="relative w-full h-32 rounded-2xl bg-white/10 overflow-hidden cursor-ns-resize select-none border border-white/10"
              >
                <div
                  className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#00B4A7] to-[#34D399] transition-[height] duration-100 pointer-events-none"
                  style={{ height: `${volumePct}%` }}
                />
                <div className="relative z-10 h-full flex flex-col items-center justify-end pb-2.5 pointer-events-none">
                  {isSilent ? (
                    <VolumeX className="w-5 h-5 text-white/80 drop-shadow" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white drop-shadow" />
                  )}
                </div>
              </div>

              {/* Accessible Range Slider + Mute Toggle */}
              <div className="w-full flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings(
                      {
                        muted: !isSilent,
                        preset:
                          isSilent && settings.preset === 'off' ? 'classroom' : settings.preset,
                      },
                      true
                    )
                  }
                  aria-label={isSilent ? 'Unmute Ambience' : 'Mute Ambience'}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white shrink-0 cursor-pointer"
                >
                  {isSilent ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-teal-300" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volumePct}
                  aria-label="Soundscape Volume"
                  onChange={(e) => {
                    const nextVol = Number(e.target.value) / 100;
                    onUpdateSettings(
                      {
                        volume: nextVol,
                        muted: nextVol === 0,
                        preset:
                          settings.preset === 'off' && nextVol > 0
                            ? 'classroom'
                            : settings.preset,
                      },
                      true
                    );
                  }}
                  className="w-full accent-[#2DD4BF] cursor-pointer h-1.5"
                />
              </div>
            </div>

            {/* DUO COLUMN 2: Storyteller Ethereal Pace Vertical Bar */}
            <div className="rounded-2xl bg-black/25 border border-white/10 p-2.5 flex flex-col items-center gap-2">
              <div className="w-full flex items-center justify-between text-[11px] font-bold">
                <span className="text-amber-200">Story Pace</span>
                <span className="font-mono tabular-nums text-white" data-testid="duo-pace-value">
                  {settings.narrationRate.toFixed(2)}x
                </span>
              </div>

              <div
                ref={paceRailRef}
                onPointerDown={(e) => {
                  updatePaceFromPointer(e.clientY);
                }}
                className="relative w-full h-32 rounded-2xl bg-white/10 overflow-hidden cursor-ns-resize select-none border border-white/10"
              >
                <div
                  className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#F59E0B] to-[#FDE047] transition-[height] duration-100 pointer-events-none"
                  style={{ height: `${Math.max(8, paceNorm)}%` }}
                />
                <div className="relative z-10 h-full flex flex-col items-center justify-end pb-2.5 pointer-events-none">
                  <Sparkles className="w-5 h-5 text-stone-950/90 drop-shadow" />
                </div>
              </div>

              {/* Accessible Range Slider + Motion Toggle */}
              <div className="w-full flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings(
                      {
                        motionMode:
                          settings.motionMode === 'immersive' ? 'minimal' : 'immersive',
                      },
                      true
                    )
                  }
                  title={`Backdrop Motion: ${settings.motionMode}`}
                  aria-label="Toggle Backdrop Motion"
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-amber-200 shrink-0 cursor-pointer"
                >
                  <Wind className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min={75}
                  max={115}
                  step={1}
                  value={Math.round(settings.narrationRate * 100)}
                  aria-label="Storyteller Narration Pace"
                  onChange={(e) => {
                    onUpdateSettings(
                      { narrationRate: Number(e.target.value) / 100 },
                      true
                    );
                  }}
                  className="w-full accent-[#FBBF24] cursor-pointer h-1.5"
                />
              </div>
            </div>
          </div>

          {/* Room Atmosphere Preset Selector Strip */}
          <div className="rounded-2xl bg-black/20 border border-white/10 p-1.5">
            <div className="grid grid-cols-4 gap-1">
              {COMPACT_PRESETS.map((p) => {
                const selected = settings.preset === p.id && (!settings.muted || p.id === 'off');
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      onUpdateSettings(
                        {
                          preset: p.id,
                          muted: p.id === 'off',
                        },
                        true
                      )
                    }
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                      selected
                        ? 'bg-[#00B4A7] text-white shadow-2xs'
                        : 'text-white/75 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm leading-none">{p.emoji}</span>
                    <span>{p.short}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quiz Difficulty Settings (Global Curriculum Complexity & Progress Match) */}
          {onSelectDifficulty && onToggleAutoMatchDifficulty && (
            <QuizDifficultySlider
              difficulty={effectiveDifficulty}
              autoMatchProgress={quizDifficultySettings.autoMatchProgress}
              recommendedLevel={recommendedDifficulty}
              recommendedReason={recommendedReason}
              onSelectDifficulty={onSelectDifficulty}
              onToggleAutoMatch={onToggleAutoMatchDifficulty}
              variant="dark"
              compact={true}
              testIdPrefix="duo-difficulty"
            />
          )}

          {/* Optional Quick Resource Strip inside Duo */}
          {(onOpen112Labs || onOpenTrophyRoom || pdfUrl) && (
            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
              {onOpen112Labs && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpen112Labs();
                  }}
                  className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-amber-400/90 hover:bg-amber-300 text-stone-950 text-[11px] font-black cursor-pointer transition-colors"
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>112 Labs</span>
                </button>
              )}
              {onOpenTrophyRoom && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenTrophyRoom();
                  }}
                  className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-black cursor-pointer transition-colors"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  <span>Trophies</span>
                </button>
              )}
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-black transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-300" />
                  <span>NCERT PDF</span>
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
