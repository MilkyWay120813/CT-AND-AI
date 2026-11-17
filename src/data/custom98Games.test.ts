import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CUSTOM_98_GAMES_MAP,
  getCustom98GameByModuleId,
  isCustom98GameModule,
} from './custom98Games';
import {
  computeComboScore,
  isPerfectSquareInt,
  primeFactorList,
  digitalRoot,
  gcdInt,
  evaluateLoShuBoard,
  checkPythagoreanTriple,
  checkEulerPolyhedron,
} from '../utils/arcadeGameEngine';

test('CUSTOM_98_GAMES_MAP defines exactly 98 unique M1-M7 games across 14 chapters', () => {
  const entries = Object.values(CUSTOM_98_GAMES_MAP);
  assert.equal(entries.length, 98);

  const uniqueTitles = new Set(entries.map((e) => e.title));
  assert.equal(uniqueTitles.size, 98, 'Every game title should be unique');

  // Spot check key exact titles across Part I and Part II
  assert.equal(getCustom98GameByModuleId('mod-1-1')?.title, 'Square Siege');
  assert.equal(getCustom98GameByModuleId('mod-1-2')?.title, 'Asteroid Cannon');
  assert.equal(getCustom98GameByModuleId('mod-1-5')?.title, '1729 Express Rush');
  assert.equal(getCustom98GameByModuleId('mod-4-7')?.title, 'Shape-Shifter Parkour');
  assert.equal(getCustom98GameByModuleId('mod-7-7')?.title, 'Lemonade Stand Showdown');
  assert.equal(getCustom98GameByModuleId('p2-mod-1-1')?.title, 'Neon Grid Hack');
  assert.equal(getCustom98GameByModuleId('p2-mod-2-5')?.title, 'Blacksmith Triple Forge');
  assert.equal(getCustom98GameByModuleId('p2-mod-4-7')?.title, 'Fruit-Ninja Geometry Dojo');
  assert.equal(getCustom98GameByModuleId('p2-ch6-m3')?.title, 'Time-Bomb Calendar Hack');
  assert.equal(getCustom98GameByModuleId('p2-mod-7-7')?.title, 'Wolf-Proof Sheep Corral');
  assert.equal(isCustom98GameModule('mod-1-8'), false);
});

test('arcadeGameEngine pure math and combo scoring helpers behave accurately', () => {
  assert.equal(computeComboScore(100, 0).totalPoints, 100);
  assert.equal(computeComboScore(100, 4).totalPoints, 200);
  assert.equal(computeComboScore(100, 4).multiplierLabel, '×2');

  assert.equal(isPerfectSquareInt(144), true);
  assert.equal(isPerfectSquareInt(145), false);
  assert.deepEqual(primeFactorList(36), [2, 2, 3, 3]);
  assert.equal(digitalRoot(4572), 9);
  assert.equal(gcdInt(24, 36), 12);

  const solvedBoard = evaluateLoShuBoard([8, 1, 6, 3, 5, 7, 4, 9, 2]);
  assert.equal(solvedBoard.isSolved, true);
  const brokenBoard = evaluateLoShuBoard([1, 8, 6, 3, 5, 7, 4, 9, 2]);
  assert.equal(brokenBoard.isSolved, false);

  assert.equal(checkPythagoreanTriple(5, 12, 13), 'right');
  assert.equal(checkPythagoreanTriple(5, 6, 7), 'acute');
  assert.equal(checkPythagoreanTriple(4, 5, 7), 'obtuse');

  assert.equal(checkEulerPolyhedron(8, 12, 6), true);
  assert.equal(checkEulerPolyhedron(8, 11, 6), false);
});

import {
  PART1_CURRICULUM_CHAPTERS,
  PART2_CURRICULUM_CHAPTERS,
} from './part1CurriculumData';
import { generateArenaConfig } from '../utils/arcadeWaveGenerators';

test('All Part I & Part II M1-M7 modules carry custom98 game titles while M8 stays untouched', () => {
  const teachingChapters = [
    ...PART1_CURRICULUM_CHAPTERS.filter((c) => c.modules.length > 0),
    ...PART2_CURRICULUM_CHAPTERS.filter((c) => c.modules.length > 0),
  ];
  assert.equal(teachingChapters.length, 14);

  const validFamilies = new Set([
    'arena-defense',
    'tactical-grid',
    'action-physics',
    'geometry-laser',
    'balancer-cipher-tycoon',
  ]);

  let replaced = 0;
  for (const ch of teachingChapters) {
    assert.equal(ch.modules.length, 8);
    ch.modules.slice(0, 7).forEach((m) => {
      const spec = getCustom98GameByModuleId(m.id);
      assert.ok(spec, `Expected game spec for ${m.id}`);
      assert.ok(validFamilies.has(spec.family), `Unexpected family ${spec.family}`);
      assert.equal(m.game.title, spec.title);
      assert.equal(m.game.rules, spec.rules);
      replaced++;
    });
    const m8 = ch.modules[7];
    assert.equal(isCustom98GameModule(m8.id), false);
  }
  assert.equal(replaced, 98);
});

test('generateArenaConfig returns valid multi-wave threats and actions for all 9 arena modules', () => {
  const arenaIds = Object.values(CUSTOM_98_GAMES_MAP)
    .filter((g) => g.family === 'arena-defense')
    .map((g) => g.moduleId);
  assert.equal(arenaIds.length, 9);

  for (const id of arenaIds) {
    const cfg = generateArenaConfig(id);
    assert.ok(cfg.waves.length > 0, `Missing waves for ${id}`);
    assert.ok(cfg.actions.length >= 2, `Missing actions for ${id}`);
    for (const threat of cfg.waves) {
      assert.ok(
        cfg.actions.some((a) => a.id === threat.correctAction),
        `No matching action for threat in ${id}`
      );
    }
  }
});
