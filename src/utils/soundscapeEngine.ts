export type SoundscapePresetId = 'classroom' | 'observatory' | 'library' | 'off';
export type TransitionStyle = 'curtain' | 'page-flip';
export type MotionMode = 'immersive' | 'minimal';
export type StoryBeatMood = 'wonder' | 'mystery' | 'triumph' | 'cosmos';

export interface AmbienceSettings {
  preset: SoundscapePresetId;
  volume: number; // 0..1
  narrationRate: number; // 0.75..1.15
  transitionStyle: TransitionStyle;
  motionMode: MotionMode;
  muted: boolean;
}

export interface SoundscapePresetInfo {
  id: SoundscapePresetId;
  label: string;
  subtitle: string;
  emoji: string;
  baseFreqs: number[];
  noiseFilterHz: number;
  noiseLevel: number;
  chimeScale: number[];
  chimeIntervalMs: number;
}

export const SOUNDSCAPE_PRESETS: Record<SoundscapePresetId, SoundscapePresetInfo> = {
  classroom: {
    id: 'classroom',
    label: 'Sunlit Classroom',
    subtitle: 'Warm breeze & soft acoustic chimes',
    emoji: '🌤️',
    baseFreqs: [196.0, 293.66, 392.0], // G3 - D4 - G4 warm open fifth
    noiseFilterHz: 420,
    noiseLevel: 0.045,
    chimeScale: [392.0, 440.0, 493.88, 587.33, 659.25, 783.99], // G major pentatonic
    chimeIntervalMs: 3600,
  },
  observatory: {
    id: 'observatory',
    label: 'Midnight Observatory',
    subtitle: 'Velvet celestial pad & starlight bells',
    emoji: '🌌',
    baseFreqs: [146.83, 220.0, 329.63], // D3 - A3 - E4 dreamy suspended drone
    noiseFilterHz: 260,
    noiseLevel: 0.025,
    chimeScale: [440.0, 523.25, 587.33, 659.25, 783.99, 880.0], // A minor pentatonic
    chimeIntervalMs: 4200,
  },
  library: {
    id: 'library',
    label: 'Rainy Study Loft',
    subtitle: 'Soft rainfall & lo-fi marimba notes',
    emoji: '🌧️',
    baseFreqs: [174.61, 261.63, 349.23], // F3 - C4 - F4 cozy hearth chord
    noiseFilterHz: 850,
    noiseLevel: 0.07,
    chimeScale: [349.23, 392.0, 440.0, 523.25, 587.33], // F major pentatonic
    chimeIntervalMs: 3200,
  },
  off: {
    id: 'off',
    label: 'Silent Mode',
    subtitle: 'All ambient audio muted',
    emoji: '🔇',
    baseFreqs: [],
    noiseFilterHz: 200,
    noiseLevel: 0,
    chimeScale: [],
    chimeIntervalMs: 5000,
  },
};

export const DEFAULT_AMBIENCE_SETTINGS: AmbienceSettings = {
  preset: 'classroom',
  volume: 0.45,
  narrationRate: 0.94,
  transitionStyle: 'curtain',
  motionMode: 'immersive',
  muted: false,
};

export function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_AMBIENCE_SETTINGS.volume;
  return Math.min(1, Math.max(0, Number(value.toFixed(2))));
}

export function clampNarrationRate(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_AMBIENCE_SETTINGS.narrationRate;
  return Math.min(1.15, Math.max(0.75, Number(value.toFixed(2))));
}

export function sanitizeAmbienceSettings(
  raw: Partial<AmbienceSettings> | null | undefined
): AmbienceSettings {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_AMBIENCE_SETTINGS };
  }
  const preset: SoundscapePresetId =
    raw.preset && raw.preset in SOUNDSCAPE_PRESETS ? raw.preset : DEFAULT_AMBIENCE_SETTINGS.preset;
  const transitionStyle: TransitionStyle =
    raw.transitionStyle === 'curtain' || raw.transitionStyle === 'page-flip'
      ? raw.transitionStyle
      : DEFAULT_AMBIENCE_SETTINGS.transitionStyle;
  const motionMode: MotionMode =
    raw.motionMode === 'immersive' || raw.motionMode === 'minimal'
      ? raw.motionMode
      : DEFAULT_AMBIENCE_SETTINGS.motionMode;

  return {
    preset,
    volume: typeof raw.volume === 'number' ? clampVolume(raw.volume) : DEFAULT_AMBIENCE_SETTINGS.volume,
    narrationRate:
      typeof raw.narrationRate === 'number'
        ? clampNarrationRate(raw.narrationRate)
        : DEFAULT_AMBIENCE_SETTINGS.narrationRate,
    transitionStyle,
    motionMode,
    muted: Boolean(raw.muted),
  };
}

export interface TransitionTiming {
  mode: TransitionStyle;
  swapAtMs: number;
  totalDurationMs: number;
}

export function getTransitionTiming(mode: TransitionStyle): TransitionTiming {
  if (mode === 'page-flip') {
    return {
      mode: 'page-flip',
      swapAtMs: 310,
      totalDurationMs: 680,
    };
  }
  return {
    mode: 'curtain',
    swapAtMs: 350,
    totalDurationMs: 840,
  };
}

/**
 * Procedural Web Audio API soundscape & cinema foley engine.
 * Synthesizes warm ambient soundscapes and transition foley with zero external audio assets.
 */
class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  private noiseSource: AudioBufferSourceNode | null = null;
  private chimeTimer: number | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private settings: AmbienceSettings = { ...DEFAULT_AMBIENCE_SETTINGS };
  private isPlaying = false;
  private chimeStep = 0;
  private isDucked = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.25;
        this.masterGain.connect(this.ctx.destination);

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.value = 0;
        this.ambientGain.connect(this.masterGain);
      }
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  private createPinkNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * seconds;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  private stopAmbientNodes() {
    if (this.chimeTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.chimeTimer);
      this.chimeTimer = null;
    }
    this.droneOscs.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.droneOscs = [];

    if (this.lfoOsc) {
      try {
        this.lfoOsc.stop();
        this.lfoOsc.disconnect();
      } catch {
        // ignore
      }
      this.lfoOsc = null;
    }

    if (this.noiseSource) {
      try {
        this.noiseSource.stop();
        this.noiseSource.disconnect();
      } catch {
        // ignore
      }
      this.noiseSource = null;
    }
    this.isPlaying = false;
  }

  public getStatus(): { isAudioActive: boolean } {
    return {
      isAudioActive:
        this.isPlaying &&
        !this.settings.muted &&
        this.settings.preset !== 'off' &&
        Boolean(this.ctx && this.ctx.state === 'running'),
    };
  }

  public applySettings(next: AmbienceSettings, fromUserGesture = false) {
    const prevPreset = this.settings.preset;
    this.settings = sanitizeAmbienceSettings(next);

    if (!fromUserGesture && !this.ctx) {
      return;
    }

    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || !this.ambientGain) return;

    const now = ctx.currentTime;
    const duckFactor = this.isDucked ? 0.35 : 1.0;
    const effectiveMaster = this.settings.muted ? 0 : this.settings.volume * 0.38 * duckFactor;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(effectiveMaster, now, 0.12);

    if (this.settings.muted || this.settings.preset === 'off') {
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setTargetAtTime(0, now, 0.15);
      if (this.isPlaying) {
        this.stopAmbientNodes();
      }
      return;
    }

    if (!this.isPlaying || prevPreset !== this.settings.preset) {
      this.startPresetLoop(this.settings.preset);
    }
  }

  public unlockFromGesture(settings: AmbienceSettings) {
    this.settings = sanitizeAmbienceSettings(settings);
    if (this.settings.muted || this.settings.preset === 'off') return;
    if (this.isPlaying && this.ctx?.state === 'running') return;
    this.applySettings(this.settings, true);
  }

  private startPresetLoop(presetId: SoundscapePresetId) {
    const ctx = this.ensureContext();
    if (!ctx || !this.ambientGain) return;

    this.stopAmbientNodes();
    const preset = SOUNDSCAPE_PRESETS[presetId];
    if (!preset || preset.id === 'off') return;

    const now = ctx.currentTime;

    // 1. Warm filtered ambient noise bed (classroom air / soft rain)
    if (preset.noiseLevel > 0) {
      const noiseBuf = this.createPinkNoiseBuffer(ctx, 4);
      const src = ctx.createBufferSource();
      src.buffer = noiseBuf;
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = preset.noiseFilterHz;
      filter.Q.value = 0.7;

      const nGain = ctx.createGain();
      nGain.gain.value = preset.noiseLevel;

      src.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.ambientGain);
      src.start(now);
      this.noiseSource = src;
    }

    // 2. Warm harmonic pad with slow breathing LFO filter
    if (preset.baseFreqs.length > 0) {
      const padFilter = ctx.createBiquadFilter();
      padFilter.type = 'lowpass';
      padFilter.frequency.value = 540;

      const padGain = ctx.createGain();
      padGain.gain.value = 0.14;

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.11; // ~9 second breathe cycle
      const lfoDepth = ctx.createGain();
      lfoDepth.gain.value = 180;
      lfo.connect(lfoDepth);
      lfoDepth.connect(padFilter.frequency);
      lfo.start(now);
      this.lfoOsc = lfo;

      padFilter.connect(padGain);
      padGain.connect(this.ambientGain);

      preset.baseFreqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.value = freq;
        osc.detune.value = (i - 1) * 4;

        const oscGain = ctx.createGain();
        oscGain.gain.value = i === 0 ? 0.45 : 0.25;

        osc.connect(oscGain);
        oscGain.connect(padFilter);
        osc.start(now);
        this.droneOscs.push(osc);
      });
    }

    // 3. Soft generative acoustic chimes / bells
    const triggerChime = () => {
      if (!this.ctx || !this.ambientGain || this.settings.muted || this.settings.preset === 'off') {
        return;
      }
      if (this.ctx.state !== 'running') return;
      const scale = SOUNDSCAPE_PRESETS[this.settings.preset].chimeScale;
      if (!scale.length) return;

      this.chimeStep = (this.chimeStep + 1 + Math.floor(Math.random() * 2)) % scale.length;
      const freq = scale[this.chimeStep];
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const harm = this.ctx.createOscillator();
      const env = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      harm.type = 'triangle';
      harm.frequency.setValueAtTime(freq * 2, t);
      const harmGain = this.ctx.createGain();
      harmGain.gain.value = 0.08;

      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(0.11, t + 0.035);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);

      osc.connect(env);
      harm.connect(harmGain);
      harmGain.connect(env);
      env.connect(this.ambientGain);

      osc.start(t);
      harm.start(t);
      osc.stop(t + 2.5);
      harm.stop(t + 2.5);
    };

    if (typeof window !== 'undefined') {
      window.setTimeout(triggerChime, 450);
      this.chimeTimer = window.setInterval(triggerChime, preset.chimeIntervalMs);
    }

    // Smooth fade in
    this.ambientGain.gain.cancelScheduledValues(now);
    this.ambientGain.gain.setValueAtTime(0.001, now);
    this.ambientGain.gain.linearRampToValueAtTime(1.0, now + 1.2);
    this.isPlaying = true;
  }

  /**
   * Velvet theater curtain swoosh + warm spotlight chime
   */
  public playCurtainTransitionSfx() {
    if (this.settings.muted || this.settings.preset === 'off') return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    // Soft cloth swoosh (filtered noise swell)
    const buf = this.createPinkNoiseBuffer(ctx, 1);
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.exponentialRampToValueAtTime(900, now + 0.25);
    filter.frequency.exponentialRampToValueAtTime(240, now + 0.65);
    filter.Q.value = 1.4;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(0.55, now + 0.16);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.72);

    src.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);
    src.start(now);
    src.stop(now + 0.75);

    // Subtle two-note warm spotlight chime at center cross
    [392.0, 587.33].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const cGain = ctx.createGain();
      const t = now + 0.18 + idx * 0.11;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      cGain.gain.setValueAtTime(0.0001, t);
      cGain.gain.linearRampToValueAtTime(0.14, t + 0.025);
      cGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      osc.connect(cGain);
      cGain.connect(this.masterGain!);
      osc.start(t);
      osc.stop(t + 0.95);
    });
  }

  /**
   * Crisp paper page-flip rustle
   */
  public playPageFlipSfx() {
    if (this.settings.muted || this.settings.preset === 'off') return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const buf = this.createPinkNoiseBuffer(ctx, 0.5);
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.frequency.exponentialRampToValueAtTime(2600, now + 0.14);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(0.42, now + 0.05);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    src.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);
    src.start(now);
    src.stop(now + 0.3);

    // Soft tactile book thump
    const osc = ctx.createOscillator();
    const tGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(165, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.27);
    tGain.gain.setValueAtTime(0.16, now + 0.18);
    tGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(tGain);
    tGain.connect(this.masterGain);
    osc.start(now + 0.18);
    osc.stop(now + 0.3);
  }

  /**
   * Gently ducks the ambient drone while the Ambient Storyteller speaks
   */
  public setNarrationDucking(ducked: boolean) {
    this.isDucked = ducked;
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const duckFactor = ducked ? 0.35 : 1.0;
    const effectiveMaster = this.settings.muted ? 0 : this.settings.volume * 0.38 * duckFactor;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(effectiveMaster, now, 0.25);
  }

  /**
   * Ethereal mood-tailored harp & celestial harmonic arpeggio at the start of a story beat
   */
  public playStoryBeatChime(mood: StoryBeatMood = 'wonder') {
    if (this.settings.muted || this.settings.preset === 'off') return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const moodChords: Record<StoryBeatMood, number[]> = {
      wonder: [329.63, 493.88, 622.25, 739.99], // E4 Lydian shimmer
      mystery: [293.66, 440.0, 523.25, 659.25], // D4 Dorian suspension
      triumph: [261.63, 392.0, 493.88, 587.33], // C4 Major 9th resolve
      cosmos: [220.0, 329.63, 493.88, 659.25], // A3 Open starlight fifths
    };

    const now = ctx.currentTime;
    const notes = moodChords[mood] || moodChords.wonder;
    notes.forEach((freq, idx) => {
      const fundamental = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const overtoneGain = ctx.createGain();
      const env = ctx.createGain();
      const start = now + idx * 0.13;

      fundamental.type = 'sine';
      fundamental.frequency.setValueAtTime(freq, start);

      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, start);
      overtone.detune.setValueAtTime(idx % 2 === 0 ? 4 : -4, start);
      overtoneGain.gain.setValueAtTime(0.14, start);

      env.gain.setValueAtTime(0.0001, start);
      env.gain.linearRampToValueAtTime(0.075, start + 0.06);
      env.gain.exponentialRampToValueAtTime(0.0001, start + 2.25);

      fundamental.connect(env);
      overtone.connect(overtoneGain);
      overtoneGain.connect(env);
      env.connect(this.masterGain!);

      fundamental.start(start);
      overtone.start(start);
      fundamental.stop(start + 2.3);
      overtone.stop(start + 2.3);
    });
  }

  /**
   * Whisper-soft acoustic harmonic bell between storyteller phrases
   */
  public playStoryPhraseBreath(mood: StoryBeatMood = 'wonder') {
    if (this.settings.muted || this.settings.preset === 'off') return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const noteMap: Record<StoryBeatMood, number> = {
      wonder: 739.99,
      mystery: 659.25,
      triumph: 587.33,
      cosmos: 880.0,
    };

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(noteMap[mood] || 659.25, now);
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.032, now + 0.05);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);
    osc.connect(env);
    env.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 1.3);
  }
}

export const soundscapeEngine = new SoundscapeEngine();
