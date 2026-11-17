import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { searchBookKnowledge } from './bookKnowledgeSearch';

describe('searchBookKnowledge Ganita Prakash Class 8 index', () => {
  test('returns exact Ganita Prakash book explanation for gnomon', () => {
    const res = searchBookKnowledge('What is a gnomon?');
    assert.ok(res);
    assert.match(res.answer, /L-shaped layer|odd/i);
    assert.match(res.formula, /n²/);
  });

  test('returns exact Hardy-Ramanujan 1729 taxicab answer from Ch 1.6', () => {
    const res = searchBookKnowledge('What is 1729?');
    assert.ok(res);
    assert.match(res.answer, /1729/);
    assert.match(res.formula, /1³ \+ 12³ = 9³ \+ 10³/);
  });

  test('explains negative exponents / Why is 3^-2 = 1/9 clearly from Ch 2', () => {
    const res = searchBookKnowledge('Why is 3^-2 = 1/9?');
    assert.ok(res);
    assert.match(res.answer, /exponent|divides by the base/i);
    assert.match(res.example, /1\/9/);
  });

  test('returns geometry kite definition from book instead of flying toy', () => {
    const res = searchBookKnowledge('What is a kite?');
    assert.ok(res);
    assert.match(res.answer, /quadrilateral/i);
    assert.match(res.answer, /adjacent sides/i);
    assert.match(res.formula, /½ × d₁ × d₂/);
  });

  test('returns Baudhayana-Pythagoras Theorem from Part II Ch 2', () => {
    const res = searchBookKnowledge('Explain Baudhayana theorem');
    assert.ok(res);
    assert.match(res.formula, /a² \+ b² = c²/);
  });

  test('returns direct Koch snowflake explanation (not chapter summary)', () => {
    for (const q of ['Koch snowflake', 'What is the Koch snowflake?']) {
      const res = searchBookKnowledge(q);
      assert.ok(res);
      assert.match(res.answer, /equilateral triangle/i);
      assert.match(res.answer, /middle third/i);
      assert.match(res.formula, /3 × 4ⁿ/);
      assert.match(res.formula, /\(4\/3\)ⁿ/);
      assert.doesNotMatch(res.answer, /11 nets|orthographic|hungry ant|temple/i);
    }
  });

  test('returns dedicated Sierpinski, 11 cube nets, hungry ant, number pyramid, and ista-gunana answers', () => {
    const sierp = searchBookKnowledge('What is a Sierpinski triangle?');
    assert.ok(sierp);
    assert.match(sierp.formula, /3ⁿ/);

    const nets = searchBookKnowledge('How many nets of a cube?');
    assert.ok(nets);
    assert.match(nets.answer, /11 nets/i);

    const ant = searchBookKnowledge('hungry ant laddu');
    assert.ok(ant);
    assert.match(ant.answer, /unfolding the box/i);

    const pyr = searchBookKnowledge('number pyramid');
    assert.ok(pyr);
    assert.match(pyr.formula, /a \+ 2b \+ c/);

    const ista = searchBookKnowledge('What is ista-gunana?');
    assert.ok(ista);
    assert.match(ista.answer, /Brahmagupta/i);
  });

  test('returns Trairasika (Rule of Three) and Cryptarithm book concepts', () => {
    const r1 = searchBookKnowledge('What is Trairasika?');
    assert.ok(r1);
    assert.match(r1.answer, /Rule of Three/i);

    const r2 = searchBookKnowledge('What is a cryptarithm?');
    assert.ok(r2);
    assert.match(r2.answer, /letters stand.*hidden.*digits/i);
  });

  test('does not false-trigger on calculations or non-book science questions', () => {
    assert.equal(searchBookKnowledge('derivative of 3x^2'), null);
    assert.equal(searchBookKnowledge('What is photosynthesis?'), null);
    assert.equal(searchBookKnowledge('What do you mean?'), null);
  });
});
