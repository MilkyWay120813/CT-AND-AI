import test from 'node:test';
import assert from 'node:assert/strict';
import { GANITA_CHAPTERS } from '../data/presets';
import {
  getPart1CurriculumById,
  getPart2CurriculumById,
  buildPart2CurriculumFromChapter,
} from '../data/part1CurriculumData';
import {
  getModuleFunInterpretation,
  getAllCatalogedModuleIds,
} from './moduleFunInterpretations';

test('all 112 modules across all 14 chapters are explicitly cataloged by unique ID', () => {
  const catalogIds = getAllCatalogedModuleIds();
  assert.equal(catalogIds.length, 112);

  const seenHeadlines = new Set<string>();
  const seenAnalogyStories = new Set<string>();
  let totalChecked = 0;

  for (const ch of GANITA_CHAPTERS) {
    const curr =
      ch.partLabel === 'Part I'
        ? getPart1CurriculumById(ch.id)
        : getPart2CurriculumById(ch.id) || buildPart2CurriculumFromChapter(ch);
    assert.ok(curr, `Curriculum missing for ${ch.id}`);
    assert.equal(curr.modules.length, 8, `Expected 8 modules in ${ch.id}`);

    for (const mod of curr.modules) {
      totalChecked++;
      const interp = getModuleFunInterpretation(
        mod.moduleCode,
        mod.title,
        mod.cardHeadline || '',
        curr.title,
        mod.id,
        curr.chapterId
      );
      assert.ok(interp.headline.length > 5, `Empty headline for ${mod.id}`);
      assert.ok(interp.analogyStory.length > 20, `Empty analogyStory for ${mod.id}`);
      assert.ok(interp.intuitiveSecret.length > 15, `Empty intuitiveSecret for ${mod.id}`);
      assert.ok(interp.partyTrickOrProTip.length > 15, `Empty pro tip for ${mod.id}`);

      assert.equal(
        seenHeadlines.has(interp.headline),
        false,
        `Duplicate headline found for ${mod.id}: ${interp.headline}`
      );
      seenHeadlines.add(interp.headline);

      assert.equal(
        seenAnalogyStories.has(interp.analogyStory),
        false,
        `Duplicate analogyStory found for ${mod.id}`
      );
      seenAnalogyStories.add(interp.analogyStory);
    }
  }

  assert.equal(totalChecked, 112);
});

test('Part II Chapter 3 (Proportional Reasoning-2) never leaks Exponents/Moon folding', () => {
  const p2Ch3 = getPart2CurriculumById('ch6-proportional-reasoning');
  assert.ok(p2Ch3);
  assert.equal(p2Ch3.modules.length, 8);

  for (const mod of p2Ch3.modules) {
    const interp = getModuleFunInterpretation(
      mod.moduleCode,
      mod.title,
      mod.cardHeadline || '',
      p2Ch3.title,
      mod.id,
      p2Ch3.chapterId
    );
    const combined =
      `${interp.headline} ${interp.analogyStory} ${interp.intuitiveSecret} ${interp.partyTrickOrProTip}`.toLowerCase();
    assert.equal(
      combined.includes('folding paper to the moon'),
      false,
      `Module ${mod.id} leaked Exponent text`
    );
    assert.equal(
      combined.includes('exponent ladder'),
      false,
      `Module ${mod.id} leaked Exponent text`
    );
  }
});
