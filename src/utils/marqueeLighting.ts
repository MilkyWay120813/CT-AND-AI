export type MarqueeTheme = 'light' | 'midnight-chalkboard';

export interface MarqueeBulb {
  index: number;
  phase: 'even' | 'odd';
  delaySeconds: number;
}

export interface MarqueeThemePalette {
  trimBg: string;
  trimBorder: string;
  bulbOnHex: string;
  bulbGlowCss: string;
  headlineGlowCss: string;
}

export function buildMarqueeBulbs(count: number): MarqueeBulb[] {
  const safeCount = Math.max(4, Math.min(48, Math.floor(count)));
  return Array.from({ length: safeCount }, (_, index) => ({
    index,
    phase: index % 2 === 0 ? 'even' : 'odd',
    delaySeconds: Number(((index % 4) * 0.18).toFixed(2)),
  }));
}

export function getMarqueePaletteForTheme(theme: MarqueeTheme): MarqueeThemePalette {
  if (theme === 'midnight-chalkboard') {
    return {
      trimBg: 'rgba(11, 28, 20, 0.85)',
      trimBorder: 'rgba(253, 224, 71, 0.35)',
      bulbOnHex: '#FDE047',
      bulbGlowCss: '0 0 10px rgba(253, 224, 71, 0.9)',
      headlineGlowCss: '0 2px 18px rgba(253, 224, 71, 0.25)',
    };
  }
  return {
    trimBg: 'rgba(63, 39, 20, 0.92)',
    trimBorder: 'rgba(251, 191, 36, 0.45)',
    bulbOnHex: '#FEF08A',
    bulbGlowCss: '0 0 9px rgba(251, 191, 36, 0.85)',
    headlineGlowCss: '0 2px 14px rgba(251, 191, 36, 0.2)',
  };
}
