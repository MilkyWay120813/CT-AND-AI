import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computePhraseProsody,
  estimateBeatDurationMs,
  getStoryForChapter,
  splitNarrationPhrases,
  stepStoryBeatIndex,
} from './ambientStorytellerEngine';
import { AMBIENT_STORY_SCRIPTS } from './ambientStorytellerData';

const VALID_MOODS = new Set(['wonder', 'mystery', 'triumph', 'cosmos']);

test('getStoryForChapter resolves rich multi-beat scripts with valid moods for all configured chapters', () => {
  const keys = Object.keys(AMBIENT_STORY_SCRIPTS);
  assert.ok(keys.length >= 16);
  for (const id of keys) {
    const story = getStoryForChapter(id);
    assert.equal(story.chapterId, id);
    assert.ok(story.storyTitle.length > 3);
    assert.ok(story.beats.length >= 2);
    for (const beat of story.beats) {
      assert.ok(VALID_MOODS.has(beat.mood), `${beat.id} has valid mood`);
    }
  }
  assert.equal(getStoryForChapter('unknown-id').chapterId, 'ch1-square-cube');
});

test('stepStoryBeatIndex wraps forward and backward across beat counts', () => {
  assert.equal(stepStoryBeatIndex(4, 0, 1), 1);
  assert.equal(stepStoryBeatIndex(4, 3, 1), 0);
  assert.equal(stepStoryBeatIndex(4, 0, -1), 3);
  assert.equal(stepStoryBeatIndex(0, 0, 1), 0);
});

test('estimateBeatDurationMs scales within bounded cinematic limits and honors narrationRate', () => {
  const shortMs = estimateBeatDurationMs('Short beat.');
  const longMs = estimateBeatDurationMs(
    'This is a much longer atmospheric mathematical narration spanning several sentences to simulate realistic storytelling pacing across a chapter.'
  );
  const slowerMs = estimateBeatDurationMs('Measure the lake depth across a quiet evening breeze.', 0.78);
  const fasterMs = estimateBeatDurationMs('Measure the lake depth across a quiet evening breeze.', 1.12);
  assert.ok(shortMs >= 4800);
  assert.ok(longMs > shortMs);
  assert.ok(longMs <= 14500);
  assert.ok(slowerMs > fasterMs);
});

test('splitNarrationPhrases separates sentences and em-dash pauses cleanly', () => {
  const phrases = splitNarrationPhrases(
    'Picture a quiet stone corridor lined with bronze lockers. Student after student walks past — flipping doors open and shut in silent rhythm.'
  );
  assert.equal(phrases.length, 3);
  assert.equal(splitNarrationPhrases('   ').length, 0);
});

test('computePhraseProsody produces an expressive, bounded pitch and rate contour', () => {
  const open = computePhraseProsody(0, 3, 0.94);
  const mid = computePhraseProsody(1, 3, 0.94);
  const close = computePhraseProsody(2, 3, 0.94);

  // Opening should lift slightly higher than closing cadence for non-monotonous delivery
  assert.ok(open.pitch > close.pitch);
  assert.ok(close.pauseMs > open.pauseMs);
  for (const p of [open, mid, close]) {
    assert.ok(p.rate >= 0.68 && p.rate <= 1.25);
    assert.ok(p.pitch >= 0.84 && p.pitch <= 1.18);
  }
});
