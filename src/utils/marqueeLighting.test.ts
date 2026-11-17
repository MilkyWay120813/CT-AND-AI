import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMarqueeBulbs, getMarqueePaletteForTheme } from './marqueeLighting';

test('buildMarqueeBulbs generates alternating even/odd chasing bulbs within safe bounds', () => {
  const bulbs = buildMarqueeBulbs(16);
  assert.equal(bulbs.length, 16);
  assert.equal(bulbs[0].phase, 'even');
  assert.equal(bulbs[1].phase, 'odd');
  assert.equal(bulbs[2].phase, 'even');

  const minBulbs = buildMarqueeBulbs(1);
  assert.equal(minBulbs.length, 4);
});

test('getMarqueePaletteForTheme returns distinct calibrated palettes for light and midnight-chalkboard', () => {
  const light = getMarqueePaletteForTheme('light');
  const dark = getMarqueePaletteForTheme('midnight-chalkboard');
  assert.notEqual(light.trimBg, dark.trimBg);
  assert.ok(light.bulbOnHex.startsWith('#'));
  assert.ok(dark.bulbOnHex.startsWith('#'));
});
