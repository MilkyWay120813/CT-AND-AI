// Pure arcade math, wave generation, scoring, combo multipliers, and Web Audio SFX

export type ArcadeOutcome = 'hit' | 'miss' | 'win' | 'click' | 'alarm';

export function playArcadeSfx(type: ArcadeOutcome, enabled = true): void {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'hit') {
      const jitter = 0.94 + Math.random() * 0.12;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(840 * jitter, now + 0.11);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.008, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'miss' || type === 'alarm') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(type === 'alarm' ? 320 : 230, now);
      osc.frequency.exponentialRampToValueAtTime(115, now + 0.22);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.008, now + 0.24);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'win') {
      osc.disconnect();
      gain.disconnect();
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, now + idx * 0.08);
        g.gain.setValueAtTime(0.16, now + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.008, now + idx * 0.08 + 0.24);
        o.start(now + idx * 0.08);
        o.stop(now + idx * 0.08 + 0.26);
      });
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(680, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.004, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch {
    // Non-blocking fallback
  }
}

export function computeComboScore(basePoints: number, comboCount: number): {
  totalPoints: number;
  balancedExp: number;
  multiplierLabel: string;
} {
  const mult = Math.min(3, 1 + Math.floor(comboCount / 2) * 0.5);
  const totalPoints = Math.round(basePoints * mult);
  const balancedExp = Math.min(10, Math.max(2, Math.round(totalPoints / 35)));
  return {
    totalPoints,
    balancedExp,
    multiplierLabel: mult > 1 ? `×${mult}` : '×1',
  };
}

export function isPerfectSquareInt(n: number): boolean {
  if (!Number.isInteger(n) || n < 0) return false;
  const r = Math.round(Math.sqrt(n));
  return r * r === n;
}

export function primeFactorList(n: number): number[] {
  const out: number[] = [];
  let temp = Math.max(2, Math.floor(n));
  let d = 2;
  while (d * d <= temp) {
    while (temp % d === 0) {
      out.push(d);
      temp = Math.floor(temp / d);
    }
    d++;
  }
  if (temp > 1) out.push(temp);
  return out;
}

export function digitalRoot(n: number): number {
  let v = Math.abs(Math.floor(n));
  if (v === 0) return 0;
  return 1 + ((v - 1) % 9);
}

export function gcdInt(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
}

export function evaluateLoShuBoard(cells: number[]): {
  rowSums: number[];
  colSums: number[];
  diag1: number;
  diag2: number;
  isSolved: boolean;
} {
  const rowSums = [
    cells[0] + cells[1] + cells[2],
    cells[3] + cells[4] + cells[5],
    cells[6] + cells[7] + cells[8],
  ];
  const colSums = [
    cells[0] + cells[3] + cells[6],
    cells[1] + cells[4] + cells[7],
    cells[2] + cells[5] + cells[8],
  ];
  const diag1 = cells[0] + cells[4] + cells[8];
  const diag2 = cells[2] + cells[4] + cells[6];
  const target = rowSums[0];
  const isSolved =
    rowSums.every((s) => s === target) &&
    colSums.every((s) => s === target) &&
    diag1 === target &&
    diag2 === target;
  return { rowSums, colSums, diag1, diag2, isSolved };
}

export function checkPythagoreanTriple(a: number, b: number, c: number): 'right' | 'acute' | 'obtuse' | 'invalid' {
  const sorted = [a, b, c].sort((x, y) => x - y);
  if (sorted[0] <= 0 || sorted[0] + sorted[1] <= sorted[2]) return 'invalid';
  const lhs = sorted[0] * sorted[0] + sorted[1] * sorted[1];
  const rhs = sorted[2] * sorted[2];
  if (lhs === rhs) return 'right';
  return lhs > rhs ? 'acute' : 'obtuse';
}

export function checkEulerPolyhedron(V: number, E: number, F: number): boolean {
  return V - E + F === 2;
}

export function formatTimeRemaining(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r < 10 ? '0' : ''}${r}`;
}
