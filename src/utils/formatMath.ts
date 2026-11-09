/**
 * Converts any stray LaTeX or code-style math strings into clean, human-readable
 * classroom chalkboard mathematics (Unicode symbols, clean fractions, superscripts/subscripts).
 */
export function formatMathText(input: string | undefined | null): string {
  if (!input) return '';

  let s = input;

  // 1. Replace matrices like \begin{bmatrix} a & b \\ c & d \end{bmatrix}
  s = s.replace(
    /\\begin\{[bpv]?matrix\}\s*([\s\S]*?)\s*\\end\{[bpv]?matrix\}/g,
    (_, inner: string) => {
      const rows = inner
        .split(/\\\\/)
        .map((r) =>
          r
            .split('&')
            .map((c) => c.trim())
            .join(', ')
        )
        .join(' ; ');
      return `[${rows}]`;
    }
  );

  // 2. Unwrap \text{...}, \mathrm{...}, \mathbf{...}, \big, \Big, \left, \right
  for (let i = 0; i < 3; i++) {
    s = s.replace(/\\(?:text|mathrm|mathbf|textbf|textit)\{([^{}]*)\}/g, '$1');
  }
  s = s.replace(/\\(?:big|Big|bigg|Bigg|left|right)\b/g, '');

  // 3. Convert \xrightarrow{...}
  s = s.replace(/\\xrightarrow\{([^{}]*)\}/g, ' →($1)→ ');

  // 4. Convert \frac{a}{b} (handle nested or simple)
  for (let i = 0; i < 3; i++) {
    s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (_, num: string, den: string) => {
      const n = num.trim();
      const d = den.trim();
      if (n === '1' && d === '2') return '½';
      if (n === '1' && d === '3') return '⅓';
      if (n === '2' && d === '3') return '⅔';
      if (n === '1' && d === '4') return '¼';
      if (n === '3' && d === '4') return '¾';
      const nWrap = /[+\-]/.test(n) ? `(${n})` : n;
      const dWrap = /[+\-*/×÷\s]/.test(d) ? `(${d})` : d;
      return `${nWrap}/${dWrap}`;
    });
  }

  // 5. Convert \sqrt{...}
  for (let i = 0; i < 2; i++) {
    s = s.replace(/\\sqrt\{([^{}]+)\}/g, (_, rad: string) => {
      const r = rad.trim();
      return /^[a-zA-Z0-9]+$/.test(r) ? `√${r}` : `√(${r})`;
    });
  }

  // 6. Common LaTeX symbols & spacing commands
  const symbolMap: [RegExp, string][] = [
    [/\\angle\b\s*/g, '∠'],
    [/\\triangle\b\s*/g, 'Δ'],
    [/\\Delta\b\s*/g, 'Δ'],
    [/\^\\circ/g, '°'],
    [/\\circ\b/g, '°'],
    [/\\times\b/g, '×'],
    [/\\div\b/g, '÷'],
    [/\\cdot\b/g, '·'],
    [/\\pm\b/g, '±'],
    [/\\implies\b/g, '⇒'],
    [/\\Rightarrow\b/g, '⇒'],
    [/\\iff\b/g, '⟺'],
    [/\\to\b/g, '→'],
    [/\\rightarrow\b/g, '→'],
    [/\\approx\b/g, '≈'],
    [/\\neq\b/g, '≠'],
    [/\\ne\b/g, '≠'],
    [/\\le\b/g, '≤'],
    [/\\leq\b/g, '≤'],
    [/\\ge\b/g, '≥'],
    [/\\geq\b/g, '≥'],
    [/\\equiv\b/g, '≡'],
    [/\\pmod\s*\{?(\d+)\}?/g, '(mod $1)'],
    [/\\in\b/g, '∈'],
    [/\\subset\b/g, '⊂'],
    [/\\cap\b/g, '∩'],
    [/\\cup\b/g, '∪'],
    [/\\perp\b/g, '⊥'],
    [/\\parallel\b/g, '∥'],
    [/\\sum\b/g, '∑'],
    [/\\prod\b/g, '∏'],
    [/\\min\b/g, 'min'],
    [/\\max\b/g, 'max'],
    [/\\checkmark\b/g, '✓'],
    [/\\quad\b/g, '  '],
    [/\\qquad\b/g, '   '],
    [/\\[,;!]/g, ' '],
    [/\\\{/g, '{'],
    [/\\\}/g, '}'],
    [/\\\|/g, ' | '],
  ];

  for (const [regex, replacement] of symbolMap) {
    s = s.replace(regex, replacement);
  }

  // 7. Convert ^{...} and ^2, ^3, ^n and _{...}, _0, _1, _2, etc.
  const superMap: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
    '+': '⁺',
    '-': '⁻',
    n: 'ⁿ',
  };

  const subMap: Record<string, string> = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
    i: 'ᵢ',
    j: 'ⱼ',
    n: 'ₙ',
    k: 'ₖ',
  };

  s = s.replace(/\^\{([^{}]+)\}/g, (_, exp: string) => {
    const trimmed = exp.trim();
    if ([...trimmed].every((ch) => superMap[ch])) {
      return [...trimmed].map((ch) => superMap[ch]).join('');
    }
    return `^(${trimmed})`;
  });

  s = s.replace(/\^([0-9n])/g, (_, ch: string) => superMap[ch] || `^${ch}`);

  s = s.replace(/_\{([^{}]+)\}/g, (_, sub: string) => {
    const trimmed = sub.trim();
    if ([...trimmed].every((ch) => subMap[ch])) {
      return [...trimmed].map((ch) => subMap[ch]).join('');
    }
    return `_(${trimmed})`;
  });

  s = s.replace(/_([0-9ijnk])/g, (_, ch: string) => subMap[ch] || `_${ch}`);

  // 8. Convert any JavaScript Math.* calls if present in display strings
  s = s.replace(/Math\.sqrt\(([^()]+)\)/g, '√($1)');
  s = s.replace(/Math\.pow\(([^,]+),\s*([^)]+)\)/g, '$1^$2');

  // 9. Remove any remaining stray single backslashes before letters and clean up curly braces
  s = s.replace(/\\([a-zA-Z]+)/g, '$1');
  s = s.replace(/[{}]/g, '');

  return s.replace(/\s{3,}/g, '  ').trim();
}
