import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  clampNarrationRate,
  clampVolume,
  DEFAULT_AMBIENCE_SETTINGS,
  getTransitionTiming,
  sanitizeAmbienceSettings,
  SOUNDSCAPE_PRESETS,
} from './soundscapeEngine.ts';

describe('soundscapeEngine pure helpers', () => {
  it('clamps volume values safely between 0 and 1', () => {
    assert.equal(clampVolume(-0.4), 0);
    assert.equal(clampVolume(1.8), 1);
    assert.equal(clampVolume(0.456), 0.46);
    assert.equal(clampVolume(Number.NaN), DEFAULT_AMBIENCE_SETTINGS.volume);
  });

  it('clamps storyteller narrationRate cleanly between 0.75 and 1.15', () => {
    assert.equal(clampNarrationRate(0.2), 0.75);
    assert.equal(clampNarrationRate(1.9), 1.15);
    assert.equal(clampNarrationRate(0.964), 0.96);
    assert.equal(clampNarrationRate(Number.NaN), DEFAULT_AMBIENCE_SETTINGS.narrationRate);
  });

  it('sanitizes partial or malformed stored ambience settings', () => {
    const valid = sanitizeAmbienceSettings({
      preset: 'observatory',
      volume: 0.72,
      narrationRate: 0.88,
      transitionStyle: 'page-flip',
      motionMode: 'minimal',
      muted: true,
    });
    assert.deepEqual(valid, {
      preset: 'observatory',
      volume: 0.72,
      narrationRate: 0.88,
      transitionStyle: 'page-flip',
      motionMode: 'minimal',
      muted: true,
    });

    const fallback = sanitizeAmbienceSettings({
      // @ts-expect-error testing invalid runtime values
      preset: 'unknown-mode',
      volume: 5,
      narrationRate: 4,
      // @ts-expect-error testing invalid runtime values
      transitionStyle: 'dissolve',
      // @ts-expect-error testing invalid runtime values
      motionMode: 'extreme',
    });
    assert.deepEqual(fallback, {
      preset: DEFAULT_AMBIENCE_SETTINGS.preset,
      volume: 1,
      narrationRate: 1.15,
      transitionStyle: DEFAULT_AMBIENCE_SETTINGS.transitionStyle,
      motionMode: DEFAULT_AMBIENCE_SETTINGS.motionMode,
      muted: false,
    });
  });

  it('defines swap midpoint before total duration for curtain and page-flip transitions', () => {
    const curtain = getTransitionTiming('curtain');
    assert.equal(curtain.mode, 'curtain');
    assert.ok(curtain.swapAtMs > 150 && curtain.swapAtMs < curtain.totalDurationMs);

    const flip = getTransitionTiming('page-flip');
    assert.equal(flip.mode, 'page-flip');
    assert.ok(flip.swapAtMs > 150 && flip.swapAtMs < flip.totalDurationMs);
  });

  it('provides non-empty harmonic scales for all active soundscape presets', () => {
    for (const key of ['classroom', 'observatory', 'library'] as const) {
      const preset = SOUNDSCAPE_PRESETS[key];
      assert.ok(preset.baseFreqs.length >= 3, `${key} should have base chord frequencies`);
      assert.ok(preset.chimeScale.length >= 4, `${key} should have chime pentatonic scale`);
    }
    assert.equal(SOUNDSCAPE_PRESETS.off.baseFreqs.length, 0);
  });
});
