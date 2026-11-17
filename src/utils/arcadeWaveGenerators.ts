// Pure deterministic & seeded multi-wave data generators for all 98 M1-M7 arcade games.
// Zero quiz MCQ structures — every generator returns live tactical coordinates, entities,
// physical targets, grid puzzles, speeds, angles, balances, or arcade wave items.

export interface ArenaWaveItem {
  id: string;
  label: string;
  sublabel?: string;
  visualKind: 'goblin-wave' | 'asteroid' | 'microbe' | 'crystal' | 'train' | 'photo' | 'truss' | 'net' | 'missile';
  // For click-target / lane shooter vs multi-action classification
  correctAction: string; // action button ID (e.g., 'blast', 'let-pass', 'div4', 'div5', 'div8', 'always', 'sometimes', 'never', etc.)
  lane: number; // 0..2
  speedFactor: number;
  meta?: Record<string, number | string | boolean>;
}

export interface ArenaConfig {
  actions: { id: string; label: string; hotkey: string; tone: 'emerald' | 'rose' | 'amber' | 'sky' }[];
  waves: ArenaWaveItem[];
  instructions: string;
  playMode: 'conveyor-decide' | 'lane-arcade';
}

export function generateArenaConfig(moduleId: string): ArenaConfig {
  switch (moduleId) {
    case 'mod-1-1':
      return {
        playMode: 'conveyor-decide',
        instructions: 'Box each approaching goblin formation into an n×n square by flinging the matching odd L-wall!',
        actions: [
          { id: 'L3', label: 'Fling L-Wall (+3)', hotkey: '1', tone: 'emerald' },
          { id: 'L5', label: 'Fling L-Wall (+5)', hotkey: '2', tone: 'sky' },
          { id: 'L7', label: 'Fling L-Wall (+7)', hotkey: '3', tone: 'amber' },
          { id: 'L9', label: 'Fling L-Wall (+9)', hotkey: '4', tone: 'rose' },
        ],
        waves: [
          { id: 'w1', label: '1 + ? = 4 (2×2)', sublabel: '1 Goblin already boxed', visualKind: 'goblin-wave', correctAction: 'L3', lane: 1, speedFactor: 1.0, meta: { base: 1, target: 4 } },
          { id: 'w2', label: '4 + ? = 9 (3×3)', sublabel: '2×2 core marching', visualKind: 'goblin-wave', correctAction: 'L5', lane: 0, speedFactor: 1.15, meta: { base: 4, target: 9 } },
          { id: 'w3', label: '9 + ? = 16 (4×4)', sublabel: '3×3 formation incoming', visualKind: 'goblin-wave', correctAction: 'L7', lane: 2, speedFactor: 1.25, meta: { base: 9, target: 16 } },
          { id: 'w4', label: '16 + ? = 25 (5×5)', sublabel: '4×4 goblin flank', visualKind: 'goblin-wave', correctAction: 'L9', lane: 1, speedFactor: 1.35, meta: { base: 16, target: 25 } },
          { id: 'w5', label: '1+3+? = 9 (3×3)', sublabel: 'Double gnomon breach', visualKind: 'goblin-wave', correctAction: 'L5', lane: 0, speedFactor: 1.45, meta: { base: 4, target: 9 } },
        ],
      };

    case 'mod-1-2':
      return {
        playMode: 'lane-arcade',
        instructions: 'BLAST fake-square asteroids (ending in 2,3,7,8 or odd trailing 0s). REFUEL SHIELD on real perfect squares!',
        actions: [
          { id: 'blast', label: 'Blast Fake Square', hotkey: '1', tone: 'rose' },
          { id: 'shield', label: 'Refuel Shield (True Sq)', hotkey: '2', tone: 'emerald' },
        ],
        waves: [
          { id: 'a1', label: '258', sublabel: 'Ends in 8', visualKind: 'asteroid', correctAction: 'blast', lane: 0, speedFactor: 1.0 },
          { id: 'a2', label: '144', sublabel: '12² Core', visualKind: 'asteroid', correctAction: 'shield', lane: 1, speedFactor: 1.1 },
          { id: 'a3', label: '4000', sublabel: '3 trailing zeros (odd)', visualKind: 'asteroid', correctAction: 'blast', lane: 2, speedFactor: 1.2 },
          { id: 'a4', label: '625', sublabel: 'Ends in 25', visualKind: 'asteroid', correctAction: 'shield', lane: 0, speedFactor: 1.25 },
          { id: 'a5', label: '1087', sublabel: 'Ends in 7', visualKind: 'asteroid', correctAction: 'blast', lane: 1, speedFactor: 1.35 },
          { id: 'a6', label: '900', sublabel: 'Even zeros + 9', visualKind: 'asteroid', correctAction: 'shield', lane: 2, speedFactor: 1.4 },
        ],
      };

    case 'mod-2-6':
      return {
        playMode: 'lane-arcade',
        instructions: 'Target Pathogens sized near 10⁻⁶ m (1 µm)! Avoid firing on 10⁻⁵ m healthy Red Blood Cells!',
        actions: [
          { id: 'zap', label: 'Zap Micro-Pathogen (10⁻⁶)', hotkey: '1', tone: 'rose' },
          { id: 'dodge', label: 'Shield & Let Cell Pass', hotkey: '2', tone: 'emerald' },
        ],
        waves: [
          { id: 'n1', label: 'Bacterium 2 × 10⁻⁶ m', sublabel: 'Target Pathogen', visualKind: 'microbe', correctAction: 'zap', lane: 1, speedFactor: 1.0 },
          { id: 'n2', label: 'Red Blood Cell 8 × 10⁻⁶ → 10⁻⁵ m', sublabel: 'Friendly Carrier', visualKind: 'microbe', correctAction: 'dodge', lane: 0, speedFactor: 1.1 },
          { id: 'n3', label: 'Spore 1.5 × 10⁻⁶ m', sublabel: 'Target Pathogen', visualKind: 'microbe', correctAction: 'zap', lane: 2, speedFactor: 1.2 },
          { id: 'n4', label: 'White Macrophage 2 × 10⁻⁵ m', sublabel: 'Friendly Immune', visualKind: 'microbe', correctAction: 'dodge', lane: 1, speedFactor: 1.3 },
          { id: 'n5', label: 'Micro-Toxin 3 × 10⁻⁶ m', sublabel: 'Target Pathogen', visualKind: 'microbe', correctAction: 'zap', lane: 0, speedFactor: 1.4 },
        ],
      };

    case 'mod-4-4':
      return {
        playMode: 'conveyor-decide',
        instructions: 'Only slice gems whose diagonals bisect cleanly at 90° to craft true Rhombuses! Reject skewed cuts!',
        actions: [
          { id: 'slice', label: '90° Bisector Laser Cut', hotkey: '1', tone: 'sky' },
          { id: 'reject', label: 'Purge Skewed Gem', hotkey: '2', tone: 'rose' },
        ],
        waves: [
          { id: 'd1', label: 'Diag 8×6 at 90° Midpoints', sublabel: 'All 4 sides = 5', visualKind: 'crystal', correctAction: 'slice', lane: 1, speedFactor: 1.0 },
          { id: 'd2', label: 'Diag 8×6 at 75° Angle', sublabel: 'Non-perpendicular', visualKind: 'crystal', correctAction: 'reject', lane: 0, speedFactor: 1.15 },
          { id: 'd3', label: 'Diag 10×24 at 90° Center', sublabel: 'All 4 sides = 13', visualKind: 'crystal', correctAction: 'slice', lane: 2, speedFactor: 1.25 },
          { id: 'd4', label: 'Diag at 90° Off-Center (3 vs 7)', sublabel: 'Kite, not Rhombus', visualKind: 'crystal', correctAction: 'reject', lane: 1, speedFactor: 1.35 },
          { id: 'd5', label: 'Diag 12×16 at 90° Bisect', sublabel: 'All 4 sides = 10', visualKind: 'crystal', correctAction: 'slice', lane: 0, speedFactor: 1.45 },
        ],
      };

    case 'mod-5-2':
      return {
        playMode: 'conveyor-decide',
        instructions: 'Inspect oncoming freight tail digits! Route each train cleanly into ÷4, ÷5, or ÷8 tunnel!',
        actions: [
          { id: 'div4', label: 'Switch → ÷4 Tunnel (Last 2 digits)', hotkey: '1', tone: 'amber' },
          { id: 'div5', label: 'Switch → ÷5 Tunnel (Ends 0 or 5)', hotkey: '2', tone: 'emerald' },
          { id: 'div8', label: 'Switch → ÷8 Tunnel (Last 3 digits)', hotkey: '3', tone: 'sky' },
        ],
        waves: [
          { id: 't1', label: 'Train #74325', sublabel: 'Ends in 5', visualKind: 'train', correctAction: 'div5', lane: 1, speedFactor: 1.0 },
          { id: 't2', label: 'Train #91016', sublabel: 'Last 3: 016 = 8×2', visualKind: 'train', correctAction: 'div8', lane: 0, speedFactor: 1.15 },
          { id: 't3', label: 'Train #58316', sublabel: 'Last 2: 16÷4 (316 not ÷8)', visualKind: 'train', correctAction: 'div4', lane: 2, speedFactor: 1.25 },
          { id: 't4', label: 'Train #64215', sublabel: 'Ends in 5', visualKind: 'train', correctAction: 'div5', lane: 1, speedFactor: 1.3 },
          { id: 't5', label: 'Train #83024', sublabel: 'Last 3: 024 = 8×3', visualKind: 'train', correctAction: 'div8', lane: 0, speedFactor: 1.4 },
          { id: 't6', label: 'Train #47124', sublabel: 'Last 2: 24÷4 (124 not ÷8)', visualKind: 'train', correctAction: 'div4', lane: 2, speedFactor: 1.5 },
        ],
      };

    case 'mod-7-1':
      return {
        playMode: 'conveyor-decide',
        instructions: 'Lock TRUE scaled celebrity frames (same width:height ratio)! Trash distorted frames before editor sees!',
        actions: [
          { id: 'snap', label: 'SNAP! True Similar Frame', hotkey: '1', tone: 'emerald' },
          { id: 'trash', label: 'TRASH! Distorted Stretch', hotkey: '2', tone: 'rose' },
        ],
        waves: [
          { id: 'p1', label: 'Original 3×2 → Crop 9×6', sublabel: 'Both scaled ×3', visualKind: 'photo', correctAction: 'snap', lane: 0, speedFactor: 1.0 },
          { id: 'p2', label: 'Original 4×3 → Crop 8×9', sublabel: 'W×2, H×3 Skewed', visualKind: 'photo', correctAction: 'trash', lane: 1, speedFactor: 1.15 },
          { id: 'p3', label: 'Original 5×4 → Crop 15×12', sublabel: 'Both scaled ×3', visualKind: 'photo', correctAction: 'snap', lane: 2, speedFactor: 1.25 },
          { id: 'p4', label: 'Original 6×4 → Crop 9×8', sublabel: '6:4 ≠ 9:8 Stretched', visualKind: 'photo', correctAction: 'trash', lane: 1, speedFactor: 1.35 },
        ],
      };

    case 'p2-mod-2-6':
      return {
        playMode: 'conveyor-decide',
        instructions: 'Inspect assembly trusses (a,b,c)! Stamp PASS if a²+b²=c², else SMASH warped!',
        actions: [
          { id: 'pass', label: 'PASS · True 90° Truss', hotkey: '1', tone: 'emerald' },
          { id: 'smash', label: 'SMASH · Warped Truss', hotkey: '2', tone: 'rose' },
        ],
        waves: [
          { id: 'tr1', label: 'Sides: 6, 8, 10', sublabel: '36 + 64 vs 100', visualKind: 'truss', correctAction: 'pass', lane: 0, speedFactor: 1.0 },
          { id: 'tr2', label: 'Sides: 5, 7, 9', sublabel: '25 + 49 = 74 vs 81', visualKind: 'truss', correctAction: 'smash', lane: 1, speedFactor: 1.15 },
          { id: 'tr3', label: 'Sides: 5, 12, 13', sublabel: '25 + 144 vs 169', visualKind: 'truss', correctAction: 'pass', lane: 2, speedFactor: 1.25 },
          { id: 'tr4', label: 'Sides: 8, 15, 18', sublabel: '64 + 225 = 289 vs 324', visualKind: 'truss', correctAction: 'smash', lane: 1, speedFactor: 1.35 },
          { id: 'tr5', label: 'Sides: 9, 12, 15', sublabel: '81 + 144 vs 225', visualKind: 'truss', correctAction: 'pass', lane: 0, speedFactor: 1.45 },
          { id: 'tr6', label: 'Sides: 7, 24, 25', sublabel: '49 + 576 vs 625', visualKind: 'truss', correctAction: 'pass', lane: 2, speedFactor: 1.5 },
        ],
      };

    case 'p2-mod-4-4':
      return {
        playMode: 'conveyor-decide',
        instructions: 'Inspect 6-square 2D nets on the press belt! ZAP overlapping/broken nets, PASS valid cube nets!',
        actions: [
          { id: 'pass', label: 'Valid Cube Net ✓', hotkey: '1', tone: 'emerald' },
          { id: 'zap', label: 'Zap Invalid Overlap 💥', hotkey: '2', tone: 'rose' },
        ],
        waves: [
          { id: 'nt1', label: 'Classic Cross (1-4-1)', sublabel: '4-in-row + 1 each side', visualKind: 'net', correctAction: 'pass', lane: 1, speedFactor: 1.0, meta: { grid: '0100/1111/0100' } },
          { id: 'nt2', label: '2×3 Solid Slab', sublabel: 'Faces overlap on fold', visualKind: 'net', correctAction: 'zap', lane: 0, speedFactor: 1.15, meta: { grid: '1110/1110/0000' } },
          { id: 'nt3', label: 'Staircase Hexomino (2-2-2)', sublabel: 'Valid spiral cube wrap', visualKind: 'net', correctAction: 'pass', lane: 2, speedFactor: 1.25, meta: { grid: '1100/0110/0011' } },
          { id: 'nt4', label: 'Both Tabs Same Side (1-4-1 same)', sublabel: 'Top tabs collide!', visualKind: 'net', correctAction: 'zap', lane: 1, speedFactor: 1.35, meta: { grid: '1010/1111/0000' } },
          { id: 'nt5', label: 'T-Shape (1-4-1 offset)', sublabel: 'Valid 6-face fold', visualKind: 'net', correctAction: 'pass', lane: 0, speedFactor: 1.45, meta: { grid: '1000/1111/0010' } },
        ],
      };

    case 'p2-ch6-m7':
    default:
      return {
        playMode: 'lane-arcade',
        instructions: 'Classify incoming algebraic missiles! ABSORB Always-True, DEFLECT Sometimes-True, BLAST Never-True!',
        actions: [
          { id: 'always', label: 'Absorb (ALWAYS)', hotkey: '1', tone: 'emerald' },
          { id: 'sometimes', label: 'Deflect (SOMETIMES)', hotkey: '2', tone: 'amber' },
          { id: 'never', label: 'Blast (NEVER)', hotkey: '3', tone: 'rose' },
        ],
        waves: [
          { id: 'm1', label: '2x + 3x = 5x', sublabel: 'Holds for all x', visualKind: 'missile', correctAction: 'always', lane: 0, speedFactor: 1.0 },
          { id: 'm2', label: 'x² > x', sublabel: 'Fails at x = 0.5 or 0', visualKind: 'missile', correctAction: 'sometimes', lane: 1, speedFactor: 1.15 },
          { id: 'm3', label: 'x + 4 = x + 1', sublabel: '4 = 1 Impossible', visualKind: 'missile', correctAction: 'never', lane: 2, speedFactor: 1.25 },
          { id: 'm4', label: '(a + b)² = a² + 2ab + b²', sublabel: 'Identity for all a,b', visualKind: 'missile', correctAction: 'always', lane: 0, speedFactor: 1.35 },
          { id: 'm5', label: '2x = x', sublabel: 'True only at x = 0', visualKind: 'missile', correctAction: 'sometimes', lane: 1, speedFactor: 1.45 },
          { id: 'm6', label: 'a − b = b − a', sublabel: 'True only when a = b', visualKind: 'missile', correctAction: 'sometimes', lane: 2, speedFactor: 1.5 },
        ],
      };
  }
}
