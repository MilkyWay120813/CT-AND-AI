import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { solveGeniusMath } from './geniusMathSolver';

describe('solveGeniusMath universal math & calculus solver', () => {
  test('computes derivative of 3x^2 accurately as 6x', () => {
    const res = solveGeniusMath('derivative of 3x^2');
    assert.ok(res, 'Expected deterministic derivative solution');
    assert.match(res.answer, /6x/);
    assert.match(res.formula, /d\/dx.*6x/);
  });

  test('computes d/dx(x^3 + 2x) and evaluates at x = 2', () => {
    const res = solveGeniusMath('differentiate x^3 + 2x at x = 2');
    assert.ok(res);
    assert.match(res.answer, /14/);
    assert.match(res.formula, /3x² \+ 2/);
  });

  test('computes derivative of trig expression sin(x)', () => {
    const res = solveGeniusMath('What is the derivative of sin(x)?');
    assert.ok(res);
    assert.match(res.answer, /cos\(x\)/);
  });

  test('computes indefinite integral of 3x^2', () => {
    const res = solveGeniusMath('integral of 3x^2');
    assert.ok(res);
    assert.match(res.answer, /x³ \+ C/);
  });

  test('solves linear equation 3x + 5 = 20', () => {
    const res = solveGeniusMath('solve 3x + 5 = 20');
    assert.ok(res);
    assert.equal(res.answer, 'x = 5');
  });

  test('solves quadratic equation x^2 - 5x + 6 = 0', () => {
    const res = solveGeniusMath('x^2 - 5x + 6 = 0');
    assert.ok(res);
    assert.match(res.answer, /x = 3.*x = 2|x = 2.*x = 3/);
  });

  test('simplifies algebraic expression (x + 2)^2', () => {
    const res = solveGeniusMath('expand (x + 2)^2');
    assert.ok(res);
    assert.match(res.answer, /x² \+ 4x \+ 4/);
  });

  test('evaluates sin(30 degrees) and log10(1000)', () => {
    const trig = solveGeniusMath('sin(30 degrees)');
    assert.ok(trig);
    assert.match(trig.answer, /= 0\.5\b/);

    const lg = solveGeniusMath('log10(1000)');
    assert.ok(lg);
    assert.match(lg.answer, /= 3\b/);
  });

  test('computes cube, square root, prime factorization, LCM, and mean', () => {
    assert.match(solveGeniusMath('Cube of 213')?.answer || '', /9,663,597/);
    assert.match(solveGeniusMath('Square root of 15625')?.answer || '', /125/);
    assert.match(solveGeniusMath('Prime factors of 213')?.answer || '', /3 × 71/);
    assert.match(solveGeniusMath('LCM of 12, 18, 24')?.answer || '', /72/);
    assert.match(solveGeniusMath('mean of 4, 8, 12')?.answer || '', /8/);
  });

  test('returns null cleanly for general knowledge / non-expression prompts so AI/encyclopedia answers them', () => {
    assert.equal(solveGeniusMath('What is photosynthesis?'), null);
    assert.equal(solveGeniusMath('Why is the sky blue?'), null);
    assert.equal(solveGeniusMath('Explain Newton laws of motion'), null);
  });
});
