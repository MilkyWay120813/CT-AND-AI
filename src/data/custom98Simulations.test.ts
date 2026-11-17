import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CUSTOM_98_SIMULATIONS_MAP,
  getCustom98SimulationByModuleId,
  isCustom98SimulationModule,
} from './custom98Simulations';
import {
  PART1_CURRICULUM_CHAPTERS,
  PART2_CURRICULUM_CHAPTERS,
} from './part1CurriculumData';

test('CUSTOM_98_SIMULATIONS_MAP defines exactly 98 unique M1-M7 entries across 14 chapters', () => {
  const entries = Object.values(CUSTOM_98_SIMULATIONS_MAP);
  assert.equal(entries.length, 98);

  const uniqueTitles = new Set(entries.map((e) => e.title));
  assert.equal(uniqueTitles.size, 98, 'Every simulation title should be unique');
});

test('All Part I and Part II M1-M7 modules resolve to replaced custom simulations while M8 stays untouched', () => {
  const teachingChapters = [
    ...PART1_CURRICULUM_CHAPTERS.filter((c) => c.modules.length > 0),
    ...PART2_CURRICULUM_CHAPTERS.filter((c) => c.modules.length > 0),
  ];

  assert.equal(teachingChapters.length, 14);

  let replacedCount = 0;
  let wrapUpCount = 0;

  for (const ch of teachingChapters) {
    assert.equal(ch.modules.length, 8, `${ch.chapterId} should have 8 modules`);
    ch.modules.slice(0, 7).forEach((mod, idx) => {
      const spec = getCustom98SimulationByModuleId(mod.id);
      assert.ok(spec, `Missing custom98 spec for ${ch.chapterId} M${idx + 1} (${mod.id})`);
      assert.equal(mod.simulation.title, spec.title);
      assert.equal(mod.simulation.description, spec.description);
      assert.equal(isCustom98SimulationModule(mod.id), true);
      replacedCount++;
    });

    const m8 = ch.modules[7];
    assert.equal(
      isCustom98SimulationModule(m8.id),
      false,
      `M8 (${m8.id}) must NOT be replaced`
    );
    wrapUpCount++;
  }

  assert.equal(replacedCount, 98);
  assert.equal(wrapUpCount, 14);
});
