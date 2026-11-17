import { AMBIENT_STORY_SCRIPTS, ChapterStoryScript } from './ambientStorytellerData';
import { clampNarrationRate, soundscapeEngine, StoryBeatMood } from './soundscapeEngine';

export function getStoryForChapter(chapterId: string): ChapterStoryScript {
  if (chapterId in AMBIENT_STORY_SCRIPTS) {
    return AMBIENT_STORY_SCRIPTS[chapterId];
  }
  return AMBIENT_STORY_SCRIPTS['ch1-square-cube'];
}

export function stepStoryBeatIndex(
  totalBeats: number,
  currentIndex: number,
  delta: number
): number {
  if (totalBeats <= 0) return 0;
  return (((currentIndex + delta) % totalBeats) + totalBeats) % totalBeats;
}

export function estimateBeatDurationMs(narration: string, narrationRate = 0.94): number {
  const words = narration.trim().split(/\s+/).filter(Boolean).length;
  const safeRate = clampNarrationRate(narrationRate);
  const scale = 0.94 / safeRate;
  // Comfortable cinematic storytelling pacing scaled by user narrationRate + atmospheric breath
  const raw = Math.round(((words / 2.4) * 1000 + 2100) * scale);
  return Math.min(14500, Math.max(4800, raw));
}

/**
 * Splits a narration beat into natural vocal phrases at sentence boundaries and em-dash / semicolon pauses
 * so Web Speech reads with organic cadence instead of flat monotony.
 */
export function splitNarrationPhrases(narration: string): string[] {
  const normalized = narration.trim().replace(/\s+/g, ' ');
  if (!normalized) return [];

  // Split after sentence punctuation (.!?) or expressive em-dash/semicolon pauses
  const rawParts = normalized
    .split(/(?<=[.!?])\s+|(?:\s*[—;]\s+)/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (rawParts.length <= 1) return rawParts;

  // Merge very short orphan fragments (< 3 words) into the adjacent phrase for natural breathing
  const merged: string[] = [];
  for (const part of rawParts) {
    const wordCount = part.split(/\s+/).filter(Boolean).length;
    if (merged.length > 0 && wordCount <= 2) {
      merged[merged.length - 1] = `${merged[merged.length - 1]} — ${part}`;
    } else {
      merged.push(part);
    }
  }
  return merged;
}

export interface PhraseProsody {
  rate: number;
  pitch: number;
  pauseMs: number;
}

/**
 * Computes a gentle, non-monotonous melodic pitch & rate contour across story phrases:
 * - Opening phrase: lifted curiosity
 * - Middle phrases: subtle ebb & flow
 * - Closing phrase: warm ritardando cadence
 */
export function computePhraseProsody(
  phraseIndex: number,
  totalPhrases: number,
  baseRate = 0.94
): PhraseProsody {
  const safeBase = clampNarrationRate(baseRate);
  const safeTotal = Math.max(1, totalPhrases);
  const clampRate = (v: number) => Math.min(1.25, Math.max(0.68, Number(v.toFixed(2))));
  const clampPitch = (v: number) => Math.min(1.18, Math.max(0.84, Number(v.toFixed(2))));

  if (safeTotal === 1) {
    return {
      rate: clampRate(safeBase * 0.96),
      pitch: clampPitch(1.01),
      pauseMs: 950,
    };
  }

  if (phraseIndex <= 0) {
    // Gentle inviting lift
    return {
      rate: clampRate(safeBase * 0.97),
      pitch: clampPitch(1.06),
      pauseMs: 240,
    };
  }

  if (phraseIndex >= safeTotal - 1) {
    // Soft resonant closing cadence
    return {
      rate: clampRate(safeBase * 0.9),
      pitch: clampPitch(0.94),
      pauseMs: 1050,
    };
  }

  // Alternating conversational arc across inner clauses
  const lift = phraseIndex % 2 === 1 ? 1.03 : 0.98;
  const rateScale = phraseIndex % 2 === 1 ? 1.01 : 0.97;
  return {
    rate: clampRate(safeBase * rateScale),
    pitch: clampPitch(lift),
    pauseMs: 260,
  };
}

/**
 * Ethereal Ambient Storyteller audio driver combining phrase-contoured Web Speech API narration
 * with mood-tuned harmonic chimes, inter-clause acoustic breaths, and ambient pad ducking.
 */
class AmbientStorytellerAudioDriver {
  private onBeatFinished: (() => void) | null = null;
  private fallbackTimer: number | null = null;
  private phraseTimer: number | null = null;
  private runSequence = 0;

  public stop() {
    this.runSequence += 1;
    this.clearTimers();
    this.onBeatFinished = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    soundscapeEngine.setNarrationDucking(false);
  }

  private clearTimers() {
    if (typeof window !== 'undefined') {
      if (this.fallbackTimer !== null) {
        window.clearTimeout(this.fallbackTimer);
        this.fallbackTimer = null;
      }
      if (this.phraseTimer !== null) {
        window.clearTimeout(this.phraseTimer);
        this.phraseTimer = null;
      }
    }
  }

  public speakBeat(
    narration: string,
    options: {
      voiceEnabled: boolean;
      mood?: StoryBeatMood;
      narrationRate?: number;
      onPhraseChange?: (phraseIdx: number, totalPhrases: number) => void;
      onEnded: () => void;
    }
  ) {
    this.clearTimers();
    const myRun = ++this.runSequence;
    this.onBeatFinished = options.onEnded;

    const mood = options.mood || 'wonder';
    const baseRate = clampNarrationRate(options.narrationRate ?? 0.94);
    const phrases = splitNarrationPhrases(narration);
    const totalPhrases = Math.max(1, phrases.length);

    // Mood-tuned celestial arpeggio introduces the story beat
    soundscapeEngine.playStoryBeatChime(mood);
    soundscapeEngine.setNarrationDucking(true);
    options.onPhraseChange?.(0, totalPhrases);

    const estimatedMs = estimateBeatDurationMs(narration, baseRate);
    const finishOnce = () => {
      if (this.runSequence !== myRun) return;
      this.clearTimers();
      soundscapeEngine.setNarrationDucking(false);
      const cb = this.onBeatFinished;
      this.onBeatFinished = null;
      if (cb) cb();
    };

    const canUseSpeech =
      options.voiceEnabled &&
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof SpeechSynthesisUtterance !== 'undefined';

    if (canUseSpeech && phrases.length > 0) {
      try {
        window.speechSynthesis.cancel();
        const voices = window.speechSynthesis.getVoices();
        const preferred =
          voices.find(
            (v) =>
              /en/i.test(v.lang) &&
              /(natural|neural|samantha|serena|aria|daniel|google uk|google us)/i.test(v.name)
          ) || voices.find((v) => /en/i.test(v.lang));

        const speakNextPhrase = (idx: number) => {
          if (this.runSequence !== myRun) return;
          if (idx >= phrases.length) {
            finishOnce();
            return;
          }

          options.onPhraseChange?.(idx, phrases.length);
          if (idx > 0) {
            soundscapeEngine.playStoryPhraseBreath(mood);
          }

          const prosody = computePhraseProsody(idx, phrases.length, baseRate);
          const utter = new SpeechSynthesisUtterance(phrases[idx]);
          utter.rate = prosody.rate;
          utter.pitch = prosody.pitch;
          utter.volume = 0.92;
          if (preferred) {
            utter.voice = preferred;
          }

          utter.onend = () => {
            if (this.runSequence !== myRun) return;
            this.phraseTimer = window.setTimeout(() => {
              speakNextPhrase(idx + 1);
            }, prosody.pauseMs);
          };

          utter.onerror = () => {
            if (this.runSequence !== myRun) return;
            this.phraseTimer = window.setTimeout(finishOnce, Math.round(estimatedMs / 2));
          };

          window.speechSynthesis.speak(utter);
        };

        // Soft prelude breath before the opening voice enters
        this.phraseTimer = window.setTimeout(() => {
          speakNextPhrase(0);
        }, 180);

        // Safety deadline in case a headless browser never fires onend
        this.fallbackTimer = window.setTimeout(finishOnce, estimatedMs + 5500);
        return;
      } catch {
        // Fall back to timed reading beat
      }
    }

    // Silent / fallback timed reading: still steps gently across phrases with soft chime breaths
    if (typeof window !== 'undefined') {
      const stepDuration = Math.max(1600, Math.round(estimatedMs / totalPhrases));
      const scheduleSilentPhrase = (idx: number) => {
        if (this.runSequence !== myRun) return;
        options.onPhraseChange?.(idx, totalPhrases);
        if (idx > 0) {
          soundscapeEngine.playStoryPhraseBreath(mood);
        }
        if (idx >= totalPhrases - 1) {
          this.fallbackTimer = window.setTimeout(finishOnce, stepDuration);
        } else {
          this.phraseTimer = window.setTimeout(() => {
            scheduleSilentPhrase(idx + 1);
          }, stepDuration);
        }
      };
      scheduleSilentPhrase(0);
    }
  }
}

export const storytellerAudioDriver = new AmbientStorytellerAudioDriver();
