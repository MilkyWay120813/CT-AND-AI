import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  X,
} from 'lucide-react';
import {
  getStoryForChapter,
  stepStoryBeatIndex,
  storytellerAudioDriver,
} from '../utils/ambientStorytellerEngine';
import { StoryBeatMood } from '../utils/soundscapeEngine';
import { formatMathText } from '../utils/formatMath';

interface AmbientStorytellerProps {
  chapterId: string;
  chapterIndex: number;
  isOpen: boolean;
  onClose: () => void;
  cinemaFocus?: boolean;
  narrationRate?: number;
  onUnlockAudio?: () => void;
}

const MOOD_ACCENTS: Record<
  StoryBeatMood,
  { label: string; gradient: string; auraText: string }
> = {
  wonder: {
    label: 'Wonder',
    gradient: 'from-[#2DD4BF] via-[#FDE047] to-[#34D399]',
    auraText: 'text-teal-200',
  },
  mystery: {
    label: 'Mystery',
    gradient: 'from-[#818CF8] via-[#2DD4BF] to-[#FBBF24]',
    auraText: 'text-indigo-200',
  },
  cosmos: {
    label: 'Cosmos',
    gradient: 'from-[#A78BFA] via-[#38BDF8] to-[#2DD4BF]',
    auraText: 'text-sky-200',
  },
  triumph: {
    label: 'Triumph',
    gradient: 'from-[#FBBF24] via-[#F59E0B] to-[#34D399]',
    auraText: 'text-amber-200',
  },
};

export const AmbientStoryteller: React.FC<AmbientStorytellerProps> = ({
  chapterId,
  chapterIndex,
  isOpen,
  onClose,
  cinemaFocus = false,
  narrationRate = 0.94,
  onUnlockAudio,
}) => {
  const script = useMemo(() => getStoryForChapter(chapterId), [chapterId]);
  const [beatIndex, setBeatIndex] = useState(0);
  const [phraseProgress, setPhraseProgress] = useState({ current: 0, total: 1 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const activeRunRef = useRef(0);

  // Reset beat index cleanly on chapter change
  useEffect(() => {
    activeRunRef.current += 1;
    storytellerAudioDriver.stop();
    setBeatIndex(0);
    setPhraseProgress({ current: 0, total: 1 });
    setIsPlaying(false);
  }, [chapterId]);

  // Stop narration when storyteller closes or unmounts
  useEffect(() => {
    if (!isOpen) {
      activeRunRef.current += 1;
      storytellerAudioDriver.stop();
      setIsPlaying(false);
    }
    return () => {
      storytellerAudioDriver.stop();
    };
  }, [isOpen]);

  const currentBeat = script.beats[beatIndex] || script.beats[0];
  const moodTheme = MOOD_ACCENTS[currentBeat?.mood || 'wonder'];

  // Drive phrased ethereal narration beat-by-beat when playing
  useEffect(() => {
    if (!isOpen || !isPlaying || !currentBeat) {
      storytellerAudioDriver.stop();
      return;
    }

    const runToken = ++activeRunRef.current;
    onUnlockAudio?.();

    storytellerAudioDriver.speakBeat(currentBeat.narration, {
      voiceEnabled,
      mood: currentBeat.mood,
      narrationRate,
      onPhraseChange: (idx, total) => {
        if (activeRunRef.current === runToken) {
          setPhraseProgress({ current: idx, total });
        }
      },
      onEnded: () => {
        if (activeRunRef.current !== runToken) return;
        setBeatIndex((prev) => stepStoryBeatIndex(script.beats.length, prev, 1));
      },
    });

    return () => {
      storytellerAudioDriver.stop();
    };
  }, [
    isOpen,
    isPlaying,
    beatIndex,
    voiceEnabled,
    narrationRate,
    currentBeat,
    script.beats.length,
    onUnlockAudio,
  ]);

  if (!isOpen || !currentBeat) return null;

  const progressPercent = Math.round(((beatIndex + 1) / script.beats.length) * 100);

  return (
    <aside
      aria-label="Ambient Storyteller Narration"
      data-testid="ambient-storyteller"
      className={`fixed bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-45 w-[calc(100%-1rem)] sm:w-[calc(100%-1.5rem)] max-w-2xl rounded-2xl border transition-all duration-300 overflow-hidden shadow-2xl ${
        cinemaFocus
          ? 'bg-[#0A1812] border-amber-300/70 shadow-[0_18px_40px_rgba(0,0,0,0.72)]'
          : 'bg-[#0E221A] border-teal-400/45 shadow-[0_14px_34px_rgba(10,24,18,0.5)]'
      } text-[#FAF6EE]`}
    >
      {/* Mood-Tuned Celestial Shimmer Hairline */}
      <div className="h-1 w-full bg-white/10" aria-hidden="true">
        <div
          className={`h-full bg-gradient-to-r ${moodTheme.gradient} transition-all duration-500`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="px-3 py-2 sm:px-5 sm:py-3 space-y-1.5 sm:space-y-2">
        {/* Top Metadata & Compact Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 text-[11px] font-semibold">
            {isPlaying ? (
              <span className="inline-flex items-end gap-0.5 h-3.5 shrink-0" aria-hidden="true">
                <span className="w-0.5 h-full rounded-full bg-amber-300 cinema-eq-bar-1" />
                <span className="w-0.5 h-full rounded-full bg-teal-300 cinema-eq-bar-2" />
                <span className="w-0.5 h-full rounded-full bg-amber-200 cinema-eq-bar-3" />
              </span>
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            )}
            <span className="truncate font-bold text-amber-200">{script.storyTitle}</span>
            <span aria-hidden="true" className="opacity-40 hidden sm:inline">
              ·
            </span>
            <span className={`hidden sm:inline truncate ${moodTheme.auraText}`}>
              {moodTheme.label}
            </span>
            <span aria-hidden="true" className="opacity-40 hidden md:inline">
              ·
            </span>
            <span className="hidden md:inline truncate text-white/70">
              Ch {chapterIndex} · {currentBeat.sceneLabel}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <span className="text-[11px] font-mono tabular-nums text-white/75 mr-0.5 sm:mr-1">
              {beatIndex + 1}/{script.beats.length}
            </span>
            <button
              type="button"
              onClick={() => setVoiceEnabled((v) => !v)}
              aria-label={voiceEnabled ? 'Mute Storyteller Voice' : 'Enable Storyteller Voice'}
              title={
                voiceEnabled
                  ? 'Voice Narration On (Click to Read Silently)'
                  : 'Voice Narration Off (Click to Speak)'
              }
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              {voiceEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-stone-400" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Ambient Storyteller"
              title="Close Ambient Storyteller"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Poetic Ethereal Story Narration Beat */}
        <p className="text-xs sm:text-[15px] font-serif italic tracking-[0.01em] text-[#FAF6EE]/95 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
          {formatMathText(currentBeat.narration)}
        </p>

        {/* Bottom Transport Bar & Formula Cue */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="hidden sm:flex items-center gap-2 min-w-0">
            <span className="text-[11px] font-mono text-amber-200/90 truncate max-w-[300px]">
              {formatMathText(currentBeat.formulaCue)}
            </span>
            {isPlaying && phraseProgress.total > 1 && (
              <span className="inline-flex items-center gap-1" aria-hidden="true">
                {Array.from({ length: phraseProgress.total }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      idx === phraseProgress.current
                        ? 'bg-amber-300'
                        : idx < phraseProgress.current
                        ? 'bg-teal-400/70'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            <button
              type="button"
              onClick={() =>
                setBeatIndex((prev) => stepStoryBeatIndex(script.beats.length, prev, -1))
              }
              aria-label="Previous Story Beat"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                onUnlockAudio?.();
                setIsPlaying((p) => !p);
              }}
              className={`inline-flex items-center gap-1.5 h-7 sm:h-8 px-3 sm:px-3.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                  : 'bg-[#00B4A7] hover:bg-[#14B8A6] text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Story</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Narrate Story</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setBeatIndex((prev) => stepStoryBeatIndex(script.beats.length, prev, 1))
              }
              aria-label="Next Story Beat"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
