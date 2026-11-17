import * as math from 'mathjs';
import { formatMathText } from './formatMath';

export interface GeniusMathResult {
  answer: string;
  steps: string[];
  formula: string;
  example: string;
  diagramSvg?: string;
}

const KNOWN_FUNCTIONS = new Set([
  'sin',
  'cos',
  'tan',
  'cot',
  'sec',
  'csc',
  'asin',
  'acos',
  'atan',
  'sinh',
  'cosh',
  'tanh',
  'sqrt',
  'cbrt',
  'abs',
  'log',
  'log10',
  'log2',
  'ln',
  'exp',
  'factorial',
  'pi',
  'e',
  'tau',
  'deg',
  'rad',
]);

export function prepareMathJsExpr(raw: string): string {
  let s = raw
    .trim()
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[−–—]/g, '-')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/⁴/g, '^4')
    .replace(/⁵/g, '^5')
    .replace(/⁶/g, '^6')
    .replace(/⁷/g, '^7')
    .replace(/⁸/g, '^8')
    .replace(/⁹/g, '^9')
    .replace(/√\(([^)]+)\)/g, 'sqrt($1)')
    .replace(/√(\d+(?:\.\d+)?)/g, 'sqrt($1)')
    .replace(/π/g, 'pi')
    .replace(/\bln\s*\(/gi, 'log(')
    .replace(/(\d+(?:\.\d+)?)\s*(?:degrees|degree|°)\b/gi, '($1 deg)')
    .replace(/(\d+(?:\.\d+)?)\s*°/g, '($1 deg)')
    .replace(/(\d+(?:\.\d+)?)\s*!/g, 'factorial($1)');

  // Temporarily protect multi-char identifiers ending with digits like log10, log2, atan2
  s = s
    .replace(/\blog10\b/g, '__LOG10__')
    .replace(/\blog2\b/g, '__LOG2__')
    .replace(/\batan2\b/g, '__ATAN2__');

  // Insert explicit multiplication: 3x -> 3*x, 2(x+1) -> 2*(x+1), ) ( -> )*(
  s = s
    .replace(/(?<![a-zA-Z_])(\d+(?:\.\d+)?)\s*([a-zA-Z(])/g, '$1*$2')
    .replace(/\)\s*\(/g, ')*(')
    .replace(/\)\s*(\d+|[a-zA-Z])/g, ')*$1');

  s = s
    .replace(/__LOG10__/g, 'log10')
    .replace(/__LOG2__/g, 'log2')
    .replace(/__ATAN2__/g, 'atan2');

  return s.trim();
}

export function prettifySymExpr(exprStr: string): string {
  let s = exprStr.trim();
  // Clean "3 * x ^ 2" -> "3x^2"
  s = s
    .replace(/(\d+(?:\.\d+)?)\s*\*\s*([a-zA-Z])/g, '$1$2')
    .replace(/([a-zA-Z0-9)])\s*\*\s*([a-zA-Z(])/g, '$1·$2')
    .replace(/\s*\^\s*/g, '^')
    .replace(/\+\s*-/g, '- ')
    .replace(/\b1([a-zA-Z])\b/g, '$1');
  return formatMathText(s);
}

function extractFreeVariables(expr: string): string[] {
  const tokens = expr.match(/[a-zA-Z]+/g) || [];
  const vars = new Set<string>();
  for (const tok of tokens) {
    if (!KNOWN_FUNCTIONS.has(tok.toLowerCase())) {
      if (tok.length === 1) {
        vars.add(tok);
      } else {
        // Multi-letter non-function like xy -> treat single letters unless standard
        for (const ch of tok) {
          if (ch.toLowerCase() !== 'e') vars.add(ch);
        }
      }
    }
  }
  return Array.from(vars);
}

function fmtNum(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  if (Math.abs(n) < 1e-12) return '0';
  const rounded = Math.round(n);
  if (Math.abs(n - rounded) < 1e-9) {
    return rounded.toLocaleString('en-US');
  }
  return Number(n.toFixed(6)).toString();
}

function fmtPlainNum(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  if (Math.abs(n) < 1e-12) return '0';
  const rounded = Math.round(n);
  if (Math.abs(n - rounded) < 1e-9) return String(rounded);
  return Number(n.toFixed(6)).toString();
}

function formatCoeffTerm(coeff: number, power: number, sym: string): string {
  if (Math.abs(coeff) < 1e-12) return '';
  const cStr = Math.abs(coeff - 1) < 1e-9 ? '' : Math.abs(coeff + 1) < 1e-9 ? '-' : fmtPlainNum(coeff);
  if (power === 0) return fmtPlainNum(coeff);
  if (power === 1) return `${cStr}${sym}`;
  return formatMathText(`${cStr}${sym}^${power}`);
}

function gcdTwo(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function trySimpleIntegral(rawExpr: string, sym: string): string | null {
  try {
    const prep = prepareMathJsExpr(rawExpr);
    // Split at top-level + and - (respecting parentheses)
    const terms: string[] = [];
    let depth = 0;
    let cur = '';
    for (let i = 0; i < prep.length; i++) {
      const ch = prep[i];
      if (ch === '(') depth++;
      else if (ch === ')') depth = Math.max(0, depth - 1);
      if (depth === 0 && (ch === '+' || ch === '-') && cur.trim().length > 0 && prep[i - 1] !== '^' && prep[i - 1] !== '*') {
        terms.push(cur.trim());
        cur = ch;
      } else {
        cur += ch;
      }
    }
    if (cur.trim()) terms.push(cur.trim());
    if (terms.length === 0) return null;

    const integratedTerms: string[] = [];
    for (const termRaw of terms) {
      let term = termRaw.replace(/^\+/, '').trim();
      let sign = 1;
      if (term.startsWith('-')) {
        sign = -1;
        term = term.slice(1).trim();
      }

      // Constant term (no variable)
      if (!new RegExp(`\\b${sym}\\b`).test(term)) {
        const val = math.evaluate(term);
        if (typeof val !== 'number' || !Number.isFinite(val)) return null;
        const c = sign * val;
        if (Math.abs(c) < 1e-12) continue;
        integratedTerms.push(formatCoeffTerm(c, 1, sym));
        continue;
      }

      // Trig / exp standard terms
      if (term === `sin(${sym})`) {
        integratedTerms.push(`${sign < 0 ? '' : '-'}cos(${sym})`);
        continue;
      }
      if (term === `cos(${sym})`) {
        integratedTerms.push(`${sign < 0 ? '-' : ''}sin(${sym})`);
        continue;
      }
      if (term === `exp(${sym})` || term === `e^${sym}`) {
        integratedTerms.push(`${sign < 0 ? '-' : ''}e^${sym}`);
        continue;
      }

      // Polynomial term a * x^n or x^n or a * x or x
      const polyMatch =
        term.match(new RegExp(`^(?:(\\d+(?:\\.\\d+)?)\\s*\\*\\s*)?${sym}(?:\\s*\\^\\s*\\(?([+-]?\\d+(?:\\.\\d+)?)\\)?)?$`));
      if (!polyMatch) return null;

      const coeff = (polyMatch[1] ? parseFloat(polyMatch[1]) : 1) * sign;
      const exp = polyMatch[2] !== undefined ? parseFloat(polyMatch[2]) : 1;

      if (Math.abs(exp + 1) < 1e-9) {
        const cPrefix = Math.abs(coeff - 1) < 1e-9 ? '' : Math.abs(coeff + 1) < 1e-9 ? '-' : `${fmtPlainNum(coeff)}·`;
        integratedTerms.push(`${cPrefix}ln|${sym}|`);
      } else {
        const newExp = exp + 1;
        const newCoeff = coeff / newExp;
        integratedTerms.push(formatCoeffTerm(newCoeff, newExp, sym));
      }
    }

    if (integratedTerms.length === 0) return 'C';
    let combined = integratedTerms[0];
    for (let i = 1; i < integratedTerms.length; i++) {
      const t = integratedTerms[i];
      combined += t.startsWith('-') ? ` - ${t.slice(1)}` : ` + ${t}`;
    }
    return formatMathText(`${combined} + C`);
  } catch {
    return null;
  }
}

export function solveGeniusMath(rawQuestion: string): GeniusMathResult | null {
  const q = rawQuestion.trim();
  if (!q) return null;

  const qStripped = q
    .replace(
      /^(?:please\s+|can\s+you\s+|could\s+you\s+)?(?:what\s+is\s+(?:the\s+)?|what's\s+(?:the\s+)?|find\s+(?:the\s+)?|calculate\s+(?:the\s+)?|compute\s+(?:the\s+)?|evaluate\s+(?:the\s+)?|tell\s+me\s+(?:the\s+)?|solve\s+(?:the\s+)?|work\s+out\s+(?:the\s+)?)/i,
      ''
    )
    .trim();
  const qLower = qStripped.toLowerCase().replace(/[?!.]+$/, '').trim();

  // ==========================================================================
  // 1. CALCULUS: DERIVATIVES / DIFFERENTIATION (e.g. "derivative of 3x^2", "d/dx(3x^2)")
  // ==========================================================================
  const isSecondDeriv = /\b(?:second|2nd)\s+derivative\b|\bd\^2\s*\/?\s*d([a-z])\^2\b/i.test(q);
  const derivMatch =
    qStripped.match(
      /^(?:(?:first|1st|second|2nd)\s+)?derivative\s+(?:of\s+)?(.+?)(?:\s+(?:with\s+respect\s+to|wrt)\s+([a-zA-Z]))?(?:\s+at\s+([a-zA-Z])\s*=\s*([+-]?\d+(?:\.\d+)?))?[?!.]*$/i
    ) ||
    qStripped.match(
      /^differentiate\s+(.+?)(?:\s+(?:with\s+respect\s+to|wrt)\s+([a-zA-Z]))?(?:\s+at\s+([a-zA-Z])\s*=\s*([+-]?\d+(?:\.\d+)?))?[?!.]*$/i
    ) ||
    qStripped.match(
      /^d(?:y)?\s*\/\s*d([a-zA-Z])\s*(?:of\s*)?\(?(.+?)\)?(?:\s+at\s+([a-zA-Z])\s*=\s*([+-]?\d+(?:\.\d+)?))?[?!.]*$/i
    ) ||
    qStripped.match(
      /^f'\(([a-zA-Z])\)\s*(?:for|of|if|when)?\s*(?:f\([a-zA-Z]\)\s*=\s*)?(.+?)[?!.]*$/i
    ) ||
    qStripped.match(
      /^slope\s+of\s+(?:the\s+)?(?:tangent\s+(?:line\s+)?to\s+)?(?:y\s*=\s*|f\([a-zA-Z]\)\s*=\s*)?(.+?)(?:\s+at\s+([a-zA-Z])\s*=\s*([+-]?\d+(?:\.\d+)?))?[?!.]*$/i
    );

  if (derivMatch) {
    let exprRaw = '';
    let explicitVar: string | undefined;
    let evalVar: string | undefined;
    let evalValStr: string | undefined;

    if (/^d(?:y)?\s*\/\s*d([a-zA-Z])/i.test(qStripped)) {
      explicitVar = derivMatch[1];
      exprRaw = derivMatch[2];
      evalVar = derivMatch[3];
      evalValStr = derivMatch[4];
    } else if (/^f'\(/i.test(qStripped)) {
      explicitVar = derivMatch[1];
      exprRaw = derivMatch[2];
    } else if (/^slope\s+of/i.test(qStripped)) {
      exprRaw = derivMatch[1];
      evalVar = derivMatch[2];
      evalValStr = derivMatch[3];
    } else {
      exprRaw = derivMatch[1];
      explicitVar = derivMatch[2];
      evalVar = derivMatch[3];
      evalValStr = derivMatch[4];
    }

    exprRaw = exprRaw.replace(/^(?:y|f\([a-zA-Z]\))\s*=\s*/i, '').trim();
    const prep = prepareMathJsExpr(exprRaw);
    const detectedVars = extractFreeVariables(prep);
    const sym = explicitVar || evalVar || (detectedVars.length > 0 ? detectedVars[0] : 'x');

    try {
      const d1 = math.derivative(prep, sym);
      const d1Simple = math.simplify(d1);
      const dFinal = isSecondDeriv ? math.simplify(math.derivative(d1Simple, sym)) : d1Simple;
      const dFinalPretty = prettifySymExpr(dFinal.toString());
      const origPretty = prettifySymExpr(exprRaw);

      let evalLine = '';
      if (evalValStr !== undefined) {
        const atX = parseFloat(evalValStr);
        const val = dFinal.evaluate({ [sym]: atX });
        if (typeof val === 'number' && Number.isFinite(val)) {
          evalLine = `At ${sym} = ${atX}, the value of the derivative is ${fmtNum(val)}.`;
        }
      } else {
        try {
          const sampleX = 2;
          const sampleVal = dFinal.evaluate({ [sym]: sampleX });
          if (typeof sampleVal === 'number' && Number.isFinite(sampleVal)) {
            evalLine = `For example, at ${sym} = 2, the rate of change (slope) is ${fmtNum(sampleVal)}.`;
          }
        } catch {
          // Ignore example eval if domain restricted
        }
      }

      return {
        answer: evalValStr
          ? `${evalLine} (d/d${sym}(${origPretty}) = ${dFinalPretty})`
          : `The ${isSecondDeriv ? 'second ' : ''}derivative of ${origPretty} with respect to ${sym} is ${dFinalPretty}.`,
        steps: [
          `Function to differentiate: f(${sym}) = ${origPretty}`,
          `Apply standard differentiation rules (Power Rule: d/d${sym}(a·${sym}ⁿ) = a·n·${sym}ⁿ⁻¹, plus Chain/Product rules where needed).`,
          isSecondDeriv
            ? `First derivative: f'(${sym}) = ${prettifySymExpr(d1Simple.toString())}`
            : `Compute d/d${sym}(${origPretty}) = ${dFinalPretty}`,
          isSecondDeriv ? `Differentiate again: f''(${sym}) = ${dFinalPretty}` : `Simplified derivative: ${dFinalPretty}`,
        ],
        formula: isSecondDeriv ? `d²/d${sym}²(${origPretty}) = ${dFinalPretty}` : `d/d${sym}(${origPretty}) = ${dFinalPretty}`,
        example: evalLine || `Derivative measures the instantaneous rate of change of ${origPretty} with respect to ${sym}.`,
      };
    } catch {
      // Fall through if expression contains unsupported English words
    }
  }

  // ==========================================================================
  // 2. CALCULUS: INDEFINITE INTEGRALS / ANTIDERIVATIVES
  // ==========================================================================
  const intMatch =
    qStripped.match(/^(?:indefinite\s+)?(?:integral|antiderivative)\s+(?:of\s+)?(.+?)(?:\s+d([a-zA-Z]))?[?!.]*$/i) ||
    qStripped.match(/^integrate\s+(.+?)(?:\s+(?:with\s+respect\s+to|wrt)\s+([a-zA-Z]))?(?:\s+d([a-zA-Z]))?[?!.]*$/i) ||
    qStripped.match(/^∫\s*(.+?)\s*d([a-zA-Z])[?!.]*$/i);

  if (intMatch) {
    const rawIntExpr = intMatch[1].trim();
    const prep = prepareMathJsExpr(rawIntExpr);
    const vars = extractFreeVariables(prep);
    const sym = intMatch[2] || intMatch[3] || (vars[0] || 'x');
    const integrated = trySimpleIntegral(rawIntExpr, sym);
    if (integrated) {
      const origPretty = prettifySymExpr(rawIntExpr);
      return {
        answer: `The indefinite integral of ${origPretty} with respect to ${sym} is ${integrated}.`,
        steps: [
          `Integrand: ∫ (${origPretty}) d${sym}`,
          `Apply the reverse Power Rule: ∫ a·${sym}ⁿ d${sym} = a·${sym}ⁿ⁺¹ / (n + 1) + C (for n ≠ -1).`,
          `Result with constant of integration C: ${integrated}`,
        ],
        formula: `∫ (${origPretty}) d${sym} = ${integrated}`,
        example: `Check by differentiating ${integrated.replace(/\s*\+\s*C$/, '')}: you recover ${origPretty}.`,
      };
    }
  }

  // ==========================================================================
  // 3. ALGEBRA: SIMPLIFY / EXPAND EXPRESSIONS OR EVALUATE WITH VARIABLE
  // ==========================================================================
  const evalAtMatch = qStripped.match(
    /^(.+?)\s+(?:at|when|where|for)\s+([a-zA-Z])\s*=\s*([+-]?\d+(?:\.\d+)?)[?!.]*$/i
  );
  if (evalAtMatch) {
    const exprPart = evalAtMatch[1].replace(/^(?:simplify|expand|f\([a-zA-Z]\)\s*=|y\s*=)\s*/i, '').trim();
    const sym = evalAtMatch[2];
    const valNum = parseFloat(evalAtMatch[3]);
    try {
      const prep = prepareMathJsExpr(exprPart);
      const result = math.evaluate(prep, { [sym]: valNum });
      if (typeof result === 'number' && Number.isFinite(result)) {
        return {
          answer: `When ${sym} = ${valNum}, ${prettifySymExpr(exprPart)} = ${fmtNum(result)}.`,
          steps: [
            `Expression: ${prettifySymExpr(exprPart)}`,
            `Substitute ${sym} = ${valNum} into every ${sym} term.`,
            `Evaluated value: ${fmtNum(result)}`,
          ],
          formula: `${prettifySymExpr(exprPart)} | (${sym} = ${valNum}) = ${fmtNum(result)}`,
          example: '',
        };
      }
    } catch {
      // Fall through
    }
  }

  const simpMatch = qStripped.match(/^(?:simplify|expand)\s+(.+?)[?!.]*$/i);
  if (simpMatch) {
    const rawAlg = simpMatch[1].trim();
    const prep = prepareMathJsExpr(rawAlg);
    const vars = extractFreeVariables(prep);
    if (vars.length >= 1) {
      try {
        const rat = math.rationalize(prep);
        const out = prettifySymExpr(rat.toString());
        const inPretty = prettifySymExpr(rawAlg);
        return {
          answer: `${inPretty} simplifies to ${out}.`,
          steps: [
            `Original expression: ${inPretty}`,
            `Expand brackets and combine like terms.`,
            `Simplified form: ${out}`,
          ],
          formula: `${inPretty} = ${out}`,
          example: '',
        };
      } catch {
        try {
          const simp = math.simplify(prep);
          const out = prettifySymExpr(simp.toString());
          const inPretty = prettifySymExpr(rawAlg);
          return {
            answer: `${inPretty} simplifies to ${out}.`,
            steps: [
              `Original expression: ${inPretty}`,
              `Simplified form: ${out}`,
            ],
            formula: `${inPretty} = ${out}`,
            example: '',
          };
        } catch {
          // Continue
        }
      }
    }
  }

  // ==========================================================================
  // 4. ALGEBRA: LINEAR & QUADRATIC EQUATION SOLVER
  // ==========================================================================
  const eqRaw = qStripped
    .replace(/^solve\s*(?:for\s*[a-zA-Z]\s*[:,-]?\s*)?/i, '')
    .replace(/[?!.]+$/, '')
    .trim();

  if (/^[0-9a-zA-Z+\-*/^().\s=²³]+$/.test(eqRaw) && eqRaw.includes('=')) {
    const sides = eqRaw.split('=');
    if (sides.length === 2) {
      const prepL = prepareMathJsExpr(sides[0]);
      const prepR = prepareMathJsExpr(sides[1]);
      const expr = `(${prepL}) - (${prepR})`;
      const uniqueVars = extractFreeVariables(expr);

      if (uniqueVars.length === 1) {
        const sym = uniqueVars[0];
        try {
          const f0 = math.evaluate(expr, { [sym]: 0 });
          const f1 = math.evaluate(expr, { [sym]: 1 });
          const f2 = math.evaluate(expr, { [sym]: 2 });
          const f3 = math.evaluate(expr, { [sym]: 3 });

          if (
            typeof f0 === 'number' &&
            typeof f1 === 'number' &&
            typeof f2 === 'number' &&
            typeof f3 === 'number'
          ) {
            const d1 = f1 - f0;
            const d2 = f2 - f1;
            const d3 = f3 - f2;
            const dd1 = d2 - d1;
            const dd2 = d3 - d2;

            // Linear equation: second difference is 0
            if (Math.abs(dd1) < 1e-9 && Math.abs(d1) > 1e-9) {
              const sol = -f0 / d1;
              const solFmt = fmtPlainNum(sol);
              return {
                answer: `${sym} = ${solFmt}`,
                steps: [
                  `Given equation: ${sides[0].trim()} = ${sides[1].trim()}`,
                  `Standard form: ${fmtPlainNum(d1)}${sym} ${f0 >= 0 ? `+ ${fmtPlainNum(f0)}` : `- ${fmtPlainNum(Math.abs(f0))}`} = 0`,
                  `Isolate ${sym}: ${sym} = ${fmtPlainNum(-f0)} ÷ ${fmtPlainNum(d1)} = ${solFmt}`,
                ],
                formula: `${sides[0].trim()} = ${sides[1].trim()}  ⇒  ${sym} = ${solFmt}`,
                example: `Check by substituting ${sym} = ${solFmt} into both sides.`,
              };
            }

            // Quadratic equation: third difference is 0, second difference non-zero
            if (Math.abs(dd1 - dd2) < 1e-8 && Math.abs(dd1) > 1e-9) {
              const a = dd1 / 2;
              const b = d1 - a;
              const c = f0;
              const disc = b * b - 4 * a * c;
              const vertexX = -b / (2 * a);
              const vertexY = a * vertexX * vertexX + b * vertexX + c;

              if (disc > 1e-9) {
                const sqrtD = Math.sqrt(disc);
                const r1 = (-b + sqrtD) / (2 * a);
                const r2 = (-b - sqrtD) / (2 * a);
                const r1s = fmtPlainNum(r1);
                const r2s = fmtPlainNum(r2);
                return {
                  answer: `${sym} = ${r1s} or ${sym} = ${r2s}`,
                  steps: [
                    `Rewrite in standard quadratic form a${sym}² + b${sym} + c = 0: a = ${fmtPlainNum(a)}, b = ${fmtPlainNum(b)}, c = ${fmtPlainNum(c)}`,
                    `Compute discriminant Δ = b² - 4ac = (${fmtPlainNum(b)})² - 4(${fmtPlainNum(a)})(${fmtPlainNum(c)}) = ${fmtPlainNum(disc)} > 0 (two distinct real roots).`,
                    `Apply Quadratic Formula ${sym} = (-b ± √Δ) / (2a): ${sym}₁ = ${r1s}, ${sym}₂ = ${r2s}`,
                  ],
                  formula: `${sym} = (-b ± √(b² - 4ac)) / (2a)  ⇒  ${sym} ∈ {${r1s}, ${r2s}}`,
                  example: `Parabola vertex is at (${fmtPlainNum(vertexX)}, ${fmtPlainNum(vertexY)}).`,
                };
              } else if (Math.abs(disc) <= 1e-9) {
                const r = -b / (2 * a);
                const rs = fmtPlainNum(r);
                return {
                  answer: `${sym} = ${rs} (repeated real root)`,
                  steps: [
                    `Standard form: a = ${fmtPlainNum(a)}, b = ${fmtPlainNum(b)}, c = ${fmtPlainNum(c)}`,
                    `Discriminant Δ = b² - 4ac = 0 (one repeated root).`,
                    `${sym} = -b / (2a) = ${rs}`,
                  ],
                  formula: `${sym} = ${rs}`,
                  example: `The parabola touches the x-axis right at its vertex (${rs}, 0).`,
                };
              } else {
                const realPart = fmtPlainNum(-b / (2 * a));
                const imagPart = fmtPlainNum(Math.sqrt(-disc) / Math.abs(2 * a));
                return {
                  answer: `${sym} = ${realPart} ± ${imagPart}i (complex roots)`,
                  steps: [
                    `Standard form: a = ${fmtPlainNum(a)}, b = ${fmtPlainNum(b)}, c = ${fmtPlainNum(c)}`,
                    `Discriminant Δ = b² - 4ac = ${fmtPlainNum(disc)} < 0 (no real roots; two complex conjugate roots).`,
                    `${sym} = (${fmtPlainNum(-b)} ± √(${fmtPlainNum(-disc)})i) / ${fmtPlainNum(2 * a)} = ${realPart} ± ${imagPart}i`,
                  ],
                  formula: `${sym} = ${realPart} ± ${imagPart}i`,
                  example: `Since Δ < 0, the parabola does not cross the real x-axis.`,
                };
              }
            }
          }
        } catch {
          // Continue to other solvers
        }
      }
    }
  }

  // ==========================================================================
  // 5. CUBE, SQUARE, ROOTS, POWERS
  // ==========================================================================
  const cubeMatch =
    qLower.match(/^cube\s+of\s+([+-]?\d+(?:\.\d+)?)$/) ||
    qLower.match(/^([+-]?\d+(?:\.\d+)?)\s*cubed$/) ||
    qLower.match(/^cube\s+([+-]?\d+(?:\.\d+)?)$/) ||
    qLower.match(/^([+-]?\d+(?:\.\d+)?)\s*\^\s*3$/) ||
    qLower.match(/^([+-]?\d+(?:\.\d+)?)\s*³$/);

  if (cubeMatch) {
    const n = parseFloat(cubeMatch[1]);
    const nSq = n * n;
    const nCube = nSq * n;
    const nFormatted = Number.isInteger(n) ? String(n) : n.toString();
    const cubeFormatted = fmtNum(nCube);
    const sqFormatted = fmtNum(nSq);
    return {
      answer: `The cube of ${nFormatted} is ${cubeFormatted} (${nFormatted}³ = ${cubeFormatted}).`,
      steps: [
        `Definition: n³ = n × n × n.`,
        `Step 1: ${nFormatted} × ${nFormatted} = ${sqFormatted}.`,
        `Step 2: ${sqFormatted} × ${nFormatted} = ${cubeFormatted}.`,
      ],
      formula: `n³ = n × n × n  ⇒  ${nFormatted}³ = ${cubeFormatted}`,
      example: `A 3D cube with edge ${nFormatted} has volume V = s³ = ${cubeFormatted} cubic units.`,
      diagramSvg: `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="240" rx="14" fill="#0F172A"/>
        <polygon points="170,120 250,120 250,200 170,200" fill="rgba(45,212,191,0.2)" stroke="#2DD4BF" stroke-width="2.5"/>
        <polygon points="170,120 250,120 290,75 210,75" fill="rgba(45,212,191,0.35)" stroke="#2DD4BF" stroke-width="2.5"/>
        <polygon points="250,120 290,75 290,155 250,200" fill="rgba(45,212,191,0.15)" stroke="#2DD4BF" stroke-width="2.5"/>
        <text x="180" y="215" fill="#5EEAD4" font-size="13" font-weight="bold" font-family="monospace">edge = ${nFormatted}</text>
        <text x="120" y="42" fill="#FDE047" font-size="14" font-weight="bold" font-family="monospace">Volume = s³ = ${cubeFormatted}</text>
      </svg>`,
    };
  }

  const sqMatch =
    qLower.match(/^square\s+of\s+([+-]?\d+(?:\.\d+)?)$/) ||
    qLower.match(/^([+-]?\d+(?:\.\d+)?)\s*squared$/) ||
    qLower.match(/^square\s+([+-]?\d+(?:\.\d+)?)$/) ||
    qLower.match(/^([+-]?\d+(?:\.\d+)?)\s*\^\s*2$/) ||
    qLower.match(/^([+-]?\d+(?:\.\d+)?)\s*²$/);

  if (sqMatch) {
    const n = parseFloat(sqMatch[1]);
    const nFormatted = Number.isInteger(n) ? String(n) : n.toString();
    const sqFormatted = fmtNum(n * n);
    return {
      answer: `The square of ${nFormatted} is ${sqFormatted} (${nFormatted}² = ${sqFormatted}).`,
      steps: [
        `Definition: n² = n × n.`,
        `Multiply: ${nFormatted} × ${nFormatted} = ${sqFormatted}.`,
      ],
      formula: `n² = n × n  ⇒  ${nFormatted}² = ${sqFormatted}`,
      example: `A square of side ${nFormatted} has area A = s² = ${sqFormatted} square units.`,
    };
  }

  const cbrtMatch = qLower.match(/^(?:cube\s*root\s*(?:of)?|cbrt|∛)\s*([+-]?\d+(?:\.\d+)?)$/);
  if (cbrtMatch) {
    const n = parseFloat(cbrtMatch[1]);
    const val = Math.cbrt(n);
    const formatted = fmtPlainNum(val);
    return {
      answer: `The cube root of ${n} is ${formatted} (∛${n} = ${formatted}).`,
      steps: [
        `Definition: ∛x is the number y where y³ = x.`,
        `Calculation: ∛${n} = ${formatted}.`,
        `Check: (${formatted})³ ≈ ${fmtPlainNum(val * val * val)}.`,
      ],
      formula: `∛${n} = ${formatted}`,
      example: `A cube with volume ${n} has edge length ${formatted}.`,
    };
  }

  const sqrtMatch = qLower.match(/^(?:square\s*root\s*(?:of)?|sqrt|√)\s*(\d+(?:\.\d+)?)$/);
  if (sqrtMatch) {
    const n = parseFloat(sqrtMatch[1]);
    const val = Math.sqrt(n);
    const formatted = fmtPlainNum(val);
    return {
      answer: `The square root of ${n} is ${formatted} (√${n} = ${formatted}).`,
      steps: [
        `Definition: √x is the non-negative number y such that y² = x.`,
        `Calculation: √${n} = ${formatted}.`,
        `Verification: ${formatted} × ${formatted} = ${fmtPlainNum(val * val)}.`,
      ],
      formula: `√${n} = ${formatted}`,
      example: `A square with area ${n} has side length ${formatted}.`,
    };
  }

  const powerMatch = qLower.match(
    /^([+-]?\d+(?:\.\d+)?)\s*(?:to the power of|raised to(?:\s+the\s+power\s+of)?|\^)\s*([+-]?\d+(?:\.\d+)?)$/
  );
  if (powerMatch) {
    const base = parseFloat(powerMatch[1]);
    const exp = parseFloat(powerMatch[2]);
    const res = Math.pow(base, exp);
    if (Number.isFinite(res)) {
      const resFmt = fmtNum(res);
      return {
        answer: `${base}^${exp} = ${resFmt}.`,
        steps: [
          `Base = ${base}, Exponent = ${exp}.`,
          exp < 0 ? `Negative exponent rule: a⁻ⁿ = 1 / aⁿ = 1 / ${base}^${Math.abs(exp)}.` : `Evaluate ${base} raised to ${exp}.`,
          `Result: ${resFmt}.`,
        ],
        formula: `${base}^(${exp}) = ${resFmt}`,
        example: '',
      };
    }
  }

  // ==========================================================================
  // 6. NUMBER THEORY: PRIME TEST, FACTORS, LCM, HCF/GCD, PERCENTAGES, MEAN
  // ==========================================================================
  const primeCheckMatch = qLower.match(/^is\s+(\d+)\s+(?:a\s+)?prime(?:\s+number)?$/);
  if (primeCheckMatch) {
    const n = parseInt(primeCheckMatch[1], 10);
    if (n >= 0 && n <= 100000000) {
      if (n < 2) {
        return {
          answer: `${n} is NOT a prime number (primes are integers greater than 1).`,
          steps: [`By definition, a prime number has exactly 2 distinct positive divisors: 1 and itself.`],
          formula: `${n} < 2 ⇒ Not Prime`,
          example: '',
        };
      }
      let smallestDiv = 0;
      for (let d = 2; d * d <= n; d++) {
        if (n % d === 0) {
          smallestDiv = d;
          break;
        }
      }
      return smallestDiv === 0
        ? {
            answer: `Yes, ${n} is a PRIME number.`,
            steps: [
              `Checked all integers from 2 up to √${n} ≈ ${Math.floor(Math.sqrt(n))}.`,
              `No integer divides ${n} evenly other than 1 and ${n}.`,
            ],
            formula: `Divisors(${n}) = {1, ${n}}`,
            example: '',
          }
        : {
            answer: `No, ${n} is a COMPOSITE number (not prime), because ${n} = ${smallestDiv} × ${n / smallestDiv}.`,
            steps: [
              `Divide ${n} by ${smallestDiv}: ${n} ÷ ${smallestDiv} = ${n / smallestDiv} (remainder 0).`,
              `Since ${n} has divisors beyond 1 and ${n}, it is composite.`,
            ],
            formula: `${n} = ${smallestDiv} × ${n / smallestDiv}`,
            example: '',
          };
    }
  }

  const factorMatch = qLower.match(/^(?:prime\s+)?(?:factors|factorization|divisors)\s+(?:of\s+)?(\d+)$/);
  if (factorMatch) {
    const n = parseInt(factorMatch[1], 10);
    if (n > 0 && n <= 100000000) {
      const divisors: number[] = [];
      for (let i = 1; i * i <= n; i++) {
        if (n % i === 0) {
          divisors.push(i);
          if (i * i !== n) divisors.push(n / i);
        }
      }
      divisors.sort((a, b) => a - b);
      let temp = n;
      const primeFactors: number[] = [];
      for (let d = 2; d * d <= temp; d++) {
        while (temp % d === 0) {
          primeFactors.push(d);
          temp = Math.floor(temp / d);
        }
      }
      if (temp > 1) primeFactors.push(temp);
      const freq: Record<number, number> = {};
      primeFactors.forEach((p) => {
        freq[p] = (freq[p] || 0) + 1;
      });
      const prodStr =
        Object.entries(freq)
          .map(([p, c]) => (c > 1 ? formatMathText(`${p}^${c}`) : p))
          .join(' × ') || String(n);

      return {
        answer: `The number ${n} has ${divisors.length} divisor${divisors.length === 1 ? '' : 's'}. Prime factorization: ${n} = ${prodStr}.`,
        steps: [
          `All divisors: ${divisors.join(', ')}.`,
          `Prime factors: ${Array.from(new Set(primeFactors)).join(', ') || String(n)}.`,
          `Prime power product: ${n} = ${prodStr}.`,
        ],
        formula: `${n} = ${prodStr}`,
        example: divisors.length > 2 ? `${divisors[1]} × ${n / divisors[1]} = ${n}` : '',
      };
    }
  }

  const lcmListMatch = qLower.match(/^(?:lcm|least common multiple)\s+(?:of\s+)?([\d,\sand]+)$/);
  if (lcmListMatch) {
    const nums = (lcmListMatch[1].match(/\d+/g) || []).map((x) => parseInt(x, 10)).filter((x) => x > 0);
    if (nums.length >= 2) {
      const lcmVal = nums.reduce((acc, cur) => (acc * cur) / gcdTwo(acc, cur));
      return {
        answer: `The LCM of ${nums.join(', ')} is ${lcmVal.toLocaleString('en-US')}.`,
        steps: [
          `Numbers: ${nums.join(', ')}`,
          `Using LCM(a, b) = (a × b) ÷ GCD(a, b) iteratively.`,
          `Result: LCM = ${lcmVal.toLocaleString('en-US')}.`,
        ],
        formula: `LCM(${nums.join(', ')}) = ${lcmVal.toLocaleString('en-US')}`,
        example: '',
      };
    }
  }

  const gcdListMatch = qLower.match(
    /^(?:gcd|hcf|greatest common divisor|highest common factor)\s+(?:of\s+)?([\d,\sand]+)$/
  );
  if (gcdListMatch) {
    const nums = (gcdListMatch[1].match(/\d+/g) || []).map((x) => parseInt(x, 10)).filter((x) => x > 0);
    if (nums.length >= 2) {
      const gVal = nums.reduce((acc, cur) => gcdTwo(acc, cur));
      return {
        answer: `The HCF (GCD) of ${nums.join(', ')} is ${gVal}.`,
        steps: [
          `Numbers: ${nums.join(', ')}`,
          `Apply Euclidean algorithm across the numbers.`,
          `Greatest common divisor: ${gVal}.`,
        ],
        formula: `HCF(${nums.join(', ')}) = ${gVal}`,
        example: '',
      };
    }
  }

  const pctMatch = qLower.match(/^(\d+(?:\.\d+)?)\s*%\s*(?:of\s*)?(\d+(?:\.\d+)?)$/);
  if (pctMatch) {
    const p = parseFloat(pctMatch[1]);
    const total = parseFloat(pctMatch[2]);
    const res = fmtPlainNum((p / 100) * total);
    return {
      answer: `${p}% of ${total} is ${res}.`,
      steps: [
        `Convert ${p}% to decimal: ${p} ÷ 100 = ${p / 100}.`,
        `Multiply by ${total}: ${p / 100} × ${total} = ${res}.`,
      ],
      formula: `(${p} ÷ 100) × ${total} = ${res}`,
      example: '',
    };
  }

  const meanMatch = qLower.match(/^(?:mean|average)\s+(?:of\s+)?([\d.,\sand-]+)$/);
  if (meanMatch) {
    const nums = (meanMatch[1].match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
    if (nums.length >= 2) {
      const sum = nums.reduce((a, b) => a + b, 0);
      const mean = sum / nums.length;
      return {
        answer: `The mean (average) of [${nums.join(', ')}] is ${fmtPlainNum(mean)}.`,
        steps: [
          `Sum of ${nums.length} numbers = ${fmtPlainNum(sum)}`,
          `Divide sum by count: ${fmtPlainNum(sum)} ÷ ${nums.length} = ${fmtPlainNum(mean)}`,
        ],
        formula: `Mean = (Sum of terms) ÷ (Count) = ${fmtPlainNum(sum)} ÷ ${nums.length} = ${fmtPlainNum(mean)}`,
        example: '',
      };
    }
  }

  // ==========================================================================
  // 7. GEOMETRY / MENSURATION FORMULAS & CALCULATIONS
  // ==========================================================================
  if (/^area\s+of\s+(?:a\s+)?trapez(?:ium|oid)$/i.test(qLower)) {
    return {
      answer: 'The area of a trapezium is ½ × (a + b) × h, where a and b are the two parallel sides and h is the perpendicular height between them.',
      steps: [
        'Add the lengths of the two parallel sides: (a + b).',
        'Multiply by the perpendicular distance (height h) between them.',
        'Divide the product by 2 (multiply by ½).',
      ],
      formula: 'Area = ½ × (a + b) × h',
      example: 'If parallel sides are a = 10 cm, b = 14 cm and height h = 6 cm, Area = ½ × (10 + 14) × 6 = 72 cm².',
    };
  }

  const circleAreaMatch = qLower.match(/^area\s+of\s+(?:a\s+)?circle\s+(?:with\s+)?(?:r(?:adius)?\s*=?\s*)(\d+(?:\.\d+)?)$/);
  if (circleAreaMatch) {
    const r = parseFloat(circleAreaMatch[1]);
    const area = Math.PI * r * r;
    return {
      answer: `Area of a circle with radius r = ${r} is π × ${r}² ≈ ${fmtPlainNum(area)} square units.`,
      steps: [
        `Formula: Area = πr²`,
        `Substitute r = ${r}: Area = π × ${r * r} ≈ ${fmtPlainNum(area)}`,
      ],
      formula: `A = πr² = ${fmtPlainNum(r * r)}π ≈ ${fmtPlainNum(area)}`,
      example: '',
    };
  }

  // ==========================================================================
  // 8. DIRECT SCIENTIFIC / TRIG / LOG / ARITHMETIC MATHJS EVALUATION
  // ==========================================================================
  const exprCandidate = qStripped
    .replace(/^(?:simplify|evaluate|calculate|compute|solve)\s+/i, '')
    .replace(/[?!.]+$/, '')
    .trim();

  const prepDirect = prepareMathJsExpr(exprCandidate);
  const freeVarsDirect = extractFreeVariables(prepDirect);
  const hasMathOpOrFunc =
    /[+\-*/^%!()=√∛]|(?:sin|cos|tan|log|ln|sqrt|cbrt|abs|factorial)/i.test(exprCandidate) ||
    /\bpi\b/i.test(prepDirect);
  if (hasMathOpOrFunc && freeVarsDirect.length === 0 && /[\d]|pi|\be\b/i.test(prepDirect)) {
    try {
      const val = math.evaluate(prepDirect);
      if (typeof val === 'number' && Number.isFinite(val)) {
        const formattedVal = fmtNum(val);
        return {
          answer: `${exprCandidate} = ${formattedVal}`,
          steps: [
            `Expression: ${exprCandidate}`,
            `Computed value: ${formattedVal}`,
          ],
          formula: `${exprCandidate} = ${formattedVal}`,
          example: '',
        };
      }
    } catch {
      // Not a pure numeric mathjs expression — let AI / encyclopedia answer
    }
  }

  return null;
}
