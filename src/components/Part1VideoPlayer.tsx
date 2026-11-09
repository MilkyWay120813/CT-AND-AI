import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  BookOpen,
  CheckCircle2,
  Maximize2,
  Film,
} from 'lucide-react';
import { ModuleVideoCue, VideoScene } from '../types/part1Curriculum';
import { formatMathText } from '../utils/formatMath';

interface Part1VideoPlayerProps {
  moduleCode: string;
  moduleTitle: string;
  chapterTitle?: string;
  videoCue: ModuleVideoCue;
  showStudyNotes?: boolean;
  isChapterIntro?: boolean;
}

type VisualSceneId =
  | 'chapter_odyssey_map'
  | 'corridor_3d_perspective'
  | 'factor_partner_arcs'
  | 'square_twin_crown'
  | 'hundred_grid_pillars'
  | 'unit_digit_wheel'
  | 'forbidden_digits_gate'
  | 'trailing_zero_doubler'
  | 'concentric_l_gnomons'
  | 'staircase_diamond_square'
  | 'prime_factor_tree'
  | 'repeated_odd_subtraction'
  | 'number_line_caliper'
  | 'isometric_3d_cubes'
  | 'taxicab_1729_nocturne'
  | 'dual_cube_balance'
  | 'difference_pyramid'
  | 'paper_moon_trajectory'
  | 'chessboard_exponential'
  | 'exponent_laws_fusion'
  | 'negative_exponent_halving'
  | 'cosmic_scale_dual_lens'
  | 'bijection_river_stones'
  | 'lebombo_lunar_tally'
  | 'roman_marble_abacus'
  | 'egyptian_papyrus_lotus'
  | 'babylon_cuneiform_base60'
  | 'india_sunya_astrolabe'
  | 'quad_diagonal_triangles'
  | 'four_corners_360_rose'
  | 'compass_rhombus_kite'
  | 'quad_hierarchy_venn'
  | 'modular_remainder_rings'
  | 'digital_root_mod11_beam'
  | 'cryptarithm_cipher_lock'
  | 'binomial_area_dissection'
  | 'difference_squares_slider'
  | 'visual_pattern_step_k'
  | 'aspect_ratio_grid'
  | 'mixture_decanters'
  | 'trairasika_sanskrit_matrix'
  | 'inverse_hyperbola_gauge'
  | 'triangle_enclosure_altitude'
  | 'gopal_parallel_river_reflection'
  | 'parallelogram_cut_slide'
  | 'trapezium_twin_lock'
  | 'polygon_surveyor_offsets'
  | 'percentage_hundred_bar'
  | 'mental_percent_decomposer'
  | 'retail_price_waterfall'
  | 'compound_snowball_curve'
  | 'arthashastra_treasury_ledger'
  | 'baudhayana_right_triangle_squares'
  | 'sulba_altar_square_doubler'
  | 'knotted_cord_triples'
  | 'bhaskara_lotus_pond'
  | 'theodorus_root_spiral'
  | 'pie_chart_360_sector'
  | 'cartography_map_scale_compass'
  | 'harmonic_gear_train'
  | 'fractal_sierpinski_koch'
  | 'sikhara_temple_self_similarity'
  | 'cuboid_net_hungry_ant'
  | 'orthographic_shadow_projector'
  | 'mean_fulcrum_line_graph'
  | 'mean_vs_median_podium'
  | 'quartile_boxplot_whisker'
  | 'spreadsheet_formula_matrix'
  | 'crossing_trajectories_chart'
  | 'think_of_number_mystery_box'
  | 'birthday_place_value_suitcase'
  | 'meru_number_pyramid_weights'
  | 'genie_bridge_doubling_loop'
  | 'calendar_3x3_symmetric_cross'
  | 'two_pan_equation_scale'
  | 'worked_example_stepper'
  | 'mastery_takeaway_prism';

interface EnrichedClip extends VideoScene {
  clipIndex: number;
  sceneId: VisualSceneId;
  stepsList?: string[];
}

const ATMOSPHERE_PALETTES = [
  { bg0: '#0E0804', bg1: '#26180B', accent: '#F59E0B', gold: '#FDE047', rose: '#FBBF24' },
  { bg0: '#100905', bg1: '#2B1B0D', accent: '#FBBF24', gold: '#FEF08A', rose: '#F59E0B' },
  { bg0: '#0C0906', bg1: '#23180C', accent: '#EAB308', gold: '#FDE047', rose: '#FDBA74' },
  { bg0: '#120A05', bg1: '#2D1B0E', accent: '#F59E0B', gold: '#FEF3C7', rose: '#FBBF24' },
  { bg0: '#0D0805', bg1: '#25170B', accent: '#D97706', gold: '#FDE047', rose: '#FCD34D' },
  { bg0: '#110904', bg1: '#29190C', accent: '#FBBF24', gold: '#FEF08A', rose: '#F59E0B' },
  { bg0: '#0F0905', bg1: '#27180A', accent: '#F59E0B', gold: '#FDE047', rose: '#FDE68A' },
  { bg0: '#120B06', bg1: '#2A1A0D', accent: '#EAB308', gold: '#FEF3C7', rose: '#FBBF24' },
];

function computeHash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

// Chapter-scoped, topic-accurate classifier so no clip ever repeats within a video or leaks across unrelated chapters
function classifySceneVisual(
  sceneTitle: string,
  narration: string,
  visualCaption: string,
  boardFormula: string,
  moduleCode: string,
  chapterTitle: string,
  clipIndex: number,
  usedInThisVideo: Set<VisualSceneId>
): VisualSceneId {
  const s = `${sceneTitle} ${visualCaption} ${narration} ${boardFormula}`.toLowerCase();
  const ch = `${chapterTitle} ${moduleCode}`.toLowerCase();

  // Only Part I Chapter 1 Intro uses the 100-Locker & Factor-Tree Odyssey Map
  if (
    moduleCode.toLowerCase().startsWith('chapter') &&
    clipIndex === 0 &&
    (ch.includes('square') || moduleCode.toUpperCase() === 'CHAPTER 1')
  ) {
    return 'chapter_odyssey_map';
  }

  const candidates: VisualSceneId[] = [];
  let chapterPool: VisualSceneId[] = [];

  // PART II · CH 1: Fractions in Disguise (Percentages, Profit/Loss, GST, Compound Growth)
  if (ch.includes('fractions in disguise') || ch.includes('p2-ch1') || (ch.includes('part ii') && ch.includes('ch 1'))) {
    chapterPool = [
      'percentage_hundred_bar',
      'mental_percent_decomposer',
      'retail_price_waterfall',
      'compound_snowball_curve',
      'arthashastra_treasury_ledger',
    ];
    if (s.includes('compound') || s.includes('1.1') || s.includes('depreciat') || s.includes('population') || s.includes('year')) {
      candidates.push('compound_snowball_curve');
    }
    if (s.includes('bill') || s.includes('discount') || s.includes('marked price') || s.includes('gst') || s.includes('profit') || s.includes('margin') || s.includes('selling price')) {
      candidates.push('retail_price_waterfall');
    }
    if (s.includes('10%') || s.includes('1%') || s.includes('5%') || s.includes('mental') || s.includes('split') || s.includes('fdp') || s.includes('0.01')) {
      candidates.push('mental_percent_decomposer');
    }
    if (s.includes('arthashastra') || s.includes('kautilya') || s.includes('tax') || s.includes('successive') || s.includes('trap') || s.includes('inflation')) {
      candidates.push('arthashastra_treasury_ledger');
    }
    if (s.includes('100') || s.includes('per cent') || s.includes('tape') || s.includes('bar')) {
      candidates.push('percentage_hundred_bar');
    }
  }
  // PART II · CH 2: The Baudhāyana-Pythagoras Theorem
  else if (ch.includes('baudh') || ch.includes('pythagor') || ch.includes('p2-ch2') || (ch.includes('part ii') && ch.includes('ch 2'))) {
    chapterPool = [
      'baudhayana_right_triangle_squares',
      'sulba_altar_square_doubler',
      'knotted_cord_triples',
      'bhaskara_lotus_pond',
      'theodorus_root_spiral',
    ];
    if (s.includes('spiral') || s.includes('theodorus') || s.includes('number line') || s.includes('arc') || s.includes('√3') || s.includes('√5')) {
      candidates.push('theodorus_root_spiral');
    }
    if (s.includes('lotus') || s.includes('bhāskara') || s.includes('bhaskara') || s.includes('wind') || s.includes('pond') || s.includes('ladder') || s.includes('drone') || s.includes('3d')) {
      candidates.push('bhaskara_lotus_pond');
    }
    if (s.includes('rope') || s.includes('knot') || s.includes('3, 4, 5') || s.includes('(3, 4, 5)') || s.includes('5, 12, 13') || s.includes('2m') || s.includes('m² - 1') || s.includes('triple')) {
      candidates.push('knotted_cord_triples');
    }
    if (s.includes('altar') || s.includes('śulba') || s.includes('sulba') || s.includes('doubl') || s.includes('combining') || s.includes('2a²') || s.includes('diagonal')) {
      candidates.push('sulba_altar_square_doubler');
    }
    if (s.includes('a² + b²') || s.includes('hypotenuse') || s.includes('right triangle') || s.includes('square')) {
      candidates.push('baudhayana_right_triangle_squares');
    }
  }
  // PART II · CH 3: Proportional Reasoning 2 (Maps, Pie Charts, Sharing in Ratios)
  else if (ch.includes('proportional reasoning 2') || ch.includes('p2-ch3') || (ch.includes('part ii') && ch.includes('ch 3'))) {
    chapterPool = [
      'pie_chart_360_sector',
      'cartography_map_scale_compass',
      'harmonic_gear_train',
      'mixture_decanters',
      'inverse_hyperbola_gauge',
      'aspect_ratio_grid',
      'trairasika_sanskrit_matrix',
    ];
    if (s.includes('map') || s.includes('scale') || s.includes('rf') || s.includes('1 : ') || s.includes('1:') || s.includes('blueprint') || s.includes('ground') || s.includes('area scale')) {
      candidates.push('cartography_map_scale_compass');
    }
    if (s.includes('pie') || s.includes('sector') || s.includes('360°') || s.includes('central angle') || s.includes('circle')) {
      candidates.push('pie_chart_360_sector');
    }
    if (s.includes('gear') || s.includes('pulley') || s.includes('work') || s.includes('provision') || s.includes('worker') || s.includes('inverse') || s.includes('time')) {
      candidates.push('harmonic_gear_train');
      candidates.push('inverse_hyperbola_gauge');
    }
    if (s.includes('bridge') || s.includes('a : b : c') || s.includes('partner') || s.includes('capital') || s.includes('slice')) {
      candidates.push('trairasika_sanskrit_matrix');
      candidates.push('mixture_decanters');
    }
    if (s.includes('alloy') || s.includes('916') || s.includes('karat') || s.includes('triangle') || s.includes('perimeter')) {
      candidates.push('aspect_ratio_grid');
    }
  }
  // PART II · CH 4: Exploring Some Geometric Themes (Fractals, Nets, Shortest Path, 3D Projections)
  else if (ch.includes('geometric themes') || ch.includes('p2-ch4') || (ch.includes('part ii') && ch.includes('ch 4'))) {
    chapterPool = [
      'fractal_sierpinski_koch',
      'sikhara_temple_self_similarity',
      'cuboid_net_hungry_ant',
      'orthographic_shadow_projector',
      'isometric_3d_cubes',
    ];
    if (s.includes('śikhara') || s.includes('sikhara') || s.includes('temple') || s.includes('kandariya') || s.includes('fern') || s.includes('tree') || s.includes('coastline') || s.includes('carpet') || s.includes('8^n')) {
      candidates.push('sikhara_temple_self_similarity');
    }
    if (s.includes('sierpinski') || s.includes('koch') || s.includes('snowflake') || s.includes('3^n') || s.includes('4/3') || s.includes('perimeter')) {
      candidates.push('fractal_sierpinski_koch');
    }
    if (s.includes('hungry ant') || s.includes('unfold') || s.includes('net') || s.includes('hexomino') || s.includes('11 ') || s.includes('prism') || s.includes('pyramid')) {
      candidates.push('cuboid_net_hungry_ant');
    }
    if (s.includes('front') || s.includes('top view') || s.includes('side view') || s.includes('shadow') || s.includes('orthographic') || s.includes('elevation') || s.includes('plan')) {
      candidates.push('orthographic_shadow_projector');
    }
    if (s.includes('voxel') || s.includes('hidden') || s.includes('isometric') || s.includes('unit cube')) {
      candidates.push('isometric_3d_cubes');
    }
  }
  // PART II · CH 5: Tales by Dots and Lines (Statistics, Mean/Median, IQR, Line Graphs, Spreadsheets)
  else if (ch.includes('dots and lines') || ch.includes('p2-ch5') || (ch.includes('part ii') && ch.includes('ch 5'))) {
    chapterPool = [
      'mean_fulcrum_line_graph',
      'mean_vs_median_podium',
      'quartile_boxplot_whisker',
      'spreadsheet_formula_matrix',
      'crossing_trajectories_chart',
    ];
    if (s.includes('spreadsheet') || s.includes('cell') || s.includes('=average') || s.includes('=median') || s.includes('column') || s.includes('row')) {
      candidates.push('spreadsheet_formula_matrix');
    }
    if (s.includes('quartile') || s.includes('q₁') || s.includes('q1') || s.includes('iqr') || s.includes('box') || s.includes('whisker') || s.includes('5-number')) {
      candidates.push('quartile_boxplot_whisker');
    }
    if (s.includes('outlier') || s.includes('median') || s.includes('middle') || s.includes('sorted') || s.includes('weighted') || s.includes('frequency')) {
      candidates.push('mean_vs_median_podium');
    }
    if (s.includes('line graph') || s.includes('slope') || s.includes('two-line') || s.includes('crossing') || s.includes('scale trap') || s.includes('truncated') || s.includes('time-series') || s.includes('infographic')) {
      candidates.push('crossing_trajectories_chart');
    }
    if (s.includes('fulcrum') || s.includes('seesaw') || s.includes('balance') || s.includes('deviation') || s.includes('mean')) {
      candidates.push('mean_fulcrum_line_graph');
    }
  }
  // PART II · CH 6: Algebra Play (Number Tricks, Birthday 100m+d, Meru Pyramids, Genie Bridge, Calendar Cross, Equations)
  else if (ch.includes('algebra play') || ch.includes('p2-ch6') || (ch.includes('part ii') && ch.includes('ch 6'))) {
    chapterPool = [
      'think_of_number_mystery_box',
      'birthday_place_value_suitcase',
      'meru_number_pyramid_weights',
      'genie_bridge_doubling_loop',
      'calendar_3x3_symmetric_cross',
      'two_pan_equation_scale',
    ];
    if (s.includes('calendar') || s.includes('3×3') || s.includes('9c') || s.includes('diagonal') || s.includes('grid')) {
      candidates.push('calendar_3x3_symmetric_cross');
    }
    if (s.includes('genie') || s.includes('bridge') || s.includes('24') || s.includes('8x - 210') || s.includes('4x - 90') || s.includes('2x - 30') || s.includes('backward')) {
      candidates.push('genie_bridge_doubling_loop');
    }
    if (s.includes('pyramid') || s.includes('virahāṅka') || s.includes('virahanka') || s.includes('meru') || s.includes('a + 2b + c') || s.includes('brick') || s.includes('4-row')) {
      candidates.push('meru_number_pyramid_weights');
    }
    if (s.includes('birthday') || s.includes('100m + d') || s.includes('place-value') || s.includes('suitcase') || s.includes('20m') || s.includes('225') || s.includes('two-digit')) {
      candidates.push('birthday_place_value_suitcase');
    }
    if (s.includes('horse') || s.includes('cow') || s.includes('goat') || s.includes('cart') || s.includes('consecutive') || s.includes('3n + 3') || s.includes('pan') || s.includes('equation')) {
      candidates.push('two_pan_equation_scale');
    }
    if (s.includes('think of a number') || s.includes('bag') || s.includes('coin') || s.includes('shabnam') || s.includes('always returns')) {
      candidates.push('think_of_number_mystery_box');
    }
  }
  // PART II · CH 7: Area (Triangles, Parallelograms, Rhombuses, Trapeziums & Polygons)
  else if (ch.includes('area') || ch.includes('p2-ch7') || (ch.includes('part ii') && ch.includes('ch 7'))) {
    chapterPool = [
      'triangle_enclosure_altitude',
      'gopal_parallel_river_reflection',
      'parallelogram_cut_slide',
      'trapezium_twin_lock',
      'polygon_surveyor_offsets',
      'compass_rhombus_kite',
      'quad_diagonal_triangles',
    ];
    if (s.includes('trapezium') || s.includes('a + b') || s.includes('rotating 180') || s.includes('midpoint')) {
      candidates.push('trapezium_twin_lock');
    }
    if (s.includes('gopal') || s.includes('river') || s.includes('cow shed') || s.includes('parallel line') || s.includes('c₁') || s.includes('c_1') || s.includes('sliding the apex')) {
      candidates.push('gopal_parallel_river_reflection');
    }
    if (s.includes('cut-and-slide') || s.includes('shearing') || s.includes('deck of cards') || s.includes('parallelogram')) {
      candidates.push('parallelogram_cut_slide');
    }
    if (s.includes('surveyor') || s.includes('offset') || s.includes('hectare') || s.includes('acre') || s.includes('10,000') || s.includes('pentagon') || s.includes('polygon') || s.includes('frame') || s.includes('pathway')) {
      candidates.push('polygon_surveyor_offsets');
    }
    if (s.includes('rhombus') || s.includes('d₁') || s.includes('d_1') || s.includes('kite')) {
      candidates.push('compass_rhombus_kite');
    }
    if (s.includes('median') || s.includes('equal-area') || s.includes('diagonal')) {
      candidates.push('quad_diagonal_triangles');
    }
    if (s.includes('triangle') || s.includes('obtuse') || s.includes('altitude') || s.includes('enclosing rectangle') || s.includes('tangram')) {
      candidates.push('triangle_enclosure_altitude');
    }
  }
  // PART I · CH 2: Power Play (Exponents & Scientific Notation)
  else if (ch.includes('power play') || ch.includes('ch2')) {
    chapterPool = [
      'paper_moon_trajectory',
      'chessboard_exponential',
      'exponent_laws_fusion',
      'negative_exponent_halving',
      'cosmic_scale_dual_lens',
      'prime_factor_tree',
      'trailing_zero_doubler',
    ];
    if (s.includes('paper') || s.includes('qutub') || s.includes('everest') || s.includes('moon') || s.includes('fold')) {
      candidates.push('paper_moon_trajectory');
    }
    if (s.includes('chessboard') || s.includes('rice') || s.includes('grain') || s.includes('viral') || s.includes('padlock') || s.includes('pin')) {
      candidates.push('chessboard_exponential');
    }
    if (s.includes('negative') || s.includes('descending') || s.includes('1/2, 1/4') || s.includes('flipping') || s.includes('a⁰') || s.includes('a^0')) {
      candidates.push('negative_exponent_halving');
    }
    if (s.includes('telescope') || s.includes('microscope') || s.includes('quark') || s.includes('galaxy') || s.includes('scientific') || s.includes('10^')) {
      candidates.push('cosmic_scale_dual_lens');
    }
    if (s.includes('exponent') || s.includes('power') || s.includes('a^m')) {
      candidates.push('exponent_laws_fusion');
    }
  }
  // PART I · CH 3: A Story of Numbers (Ancient Number Systems)
  else if (ch.includes('story of numbers') || ch.includes('ch3')) {
    chapterPool = [
      'bijection_river_stones',
      'lebombo_lunar_tally',
      'roman_marble_abacus',
      'egyptian_papyrus_lotus',
      'babylon_cuneiform_base60',
      'india_sunya_astrolabe',
    ];
    if (s.includes('herder') || s.includes('cow') || s.includes('pebble') || s.includes('pouch')) {
      candidates.push('bijection_river_stones');
    }
    if (s.includes('lebombo') || s.includes('ishango') || s.includes('bone') || s.includes('tally') || s.includes('body-part') || s.includes('subitiz')) {
      candidates.push('lebombo_lunar_tally');
    }
    if (s.includes('roman') || s.includes('i, v, x') || s.includes('abacus')) {
      candidates.push('roman_marble_abacus');
    }
    if (s.includes('egypt') || s.includes('lotus') || s.includes('heel bone') || s.includes('papyrus') || s.includes('base-5') || s.includes('gumulgal')) {
      candidates.push('egyptian_papyrus_lotus');
    }
    if (s.includes('babylon') || s.includes('mesopotamia') || s.includes('wedge') || s.includes('clay') || s.includes('base-60') || s.includes('maya') || s.includes('shell')) {
      candidates.push('babylon_cuneiform_base60');
    }
    if (s.includes('brahmagupta') || s.includes('bakhshali') || s.includes('śūnya') || s.includes('sunya') || s.includes('brahmi') || s.includes('baghdad') || s.includes('al-khwarizmi')) {
      candidates.push('india_sunya_astrolabe');
    }
  }
  // PART I · CH 4: Quadrilaterals
  else if (ch.includes('quadrilateral') || ch.includes('ch4')) {
    chapterPool = [
      'quad_diagonal_triangles',
      'four_corners_360_rose',
      'compass_rhombus_kite',
      'quad_hierarchy_venn',
      'parallelogram_cut_slide',
      'trapezium_twin_lock',
    ];
    if (s.includes('tearing') || s.includes('4 corners') || s.includes('360°') || s.includes('angle') || s.includes('supplementary')) {
      candidates.push('four_corners_360_rose');
    }
    if (s.includes('compass') || s.includes('kite') || s.includes('rhombus') || s.includes('perpendicular') || s.includes('isosceles')) {
      candidates.push('compass_rhombus_kite');
    }
    if (s.includes('hierarchy') || s.includes('venn') || s.includes('family tree') || s.includes('subset')) {
      candidates.push('quad_hierarchy_venn');
    }
    if (s.includes('trapezium')) {
      candidates.push('trapezium_twin_lock');
    }
    if (s.includes('diagonal') || s.includes('two triangles') || s.includes('strip') || s.includes('carpenter') || s.includes('rectangle')) {
      candidates.push('quad_diagonal_triangles');
    }
  }
  // PART I · CH 5: Number Play (Divisibility, Remainders, Cryptarithms)
  else if (ch.includes('number play') || ch.includes('ch5')) {
    chapterPool = [
      'modular_remainder_rings',
      'digital_root_mod11_beam',
      'cryptarithm_cipher_lock',
      'factor_partner_arcs',
      'concentric_l_gnomons',
      'difference_pyramid',
    ];
    if (s.includes('cryptarithm') || s.includes('letter') || s.includes('repunit') || s.includes('111') || s.includes('37') || s.includes('cipher')) {
      candidates.push('cryptarithm_cipher_lock');
    }
    if (s.includes('11') || s.includes('digital root') || s.includes('99 + 1') || s.includes('alternating') || s.includes('9')) {
      candidates.push('digital_root_mod11_beam');
    }
    if (s.includes('remainder') || s.includes('pot') || s.includes('parity') || s.includes('consecutive') || s.includes('multiple')) {
      candidates.push('modular_remainder_rings');
    }
  }
  // PART I · CH 6: We Distribute, Yet Things Multiply
  else if (ch.includes('distribute') || ch.includes('ch6')) {
    chapterPool = [
      'binomial_area_dissection',
      'difference_squares_slider',
      'visual_pattern_step_k',
      'concentric_l_gnomons',
      'staircase_diamond_square',
      'two_pan_equation_scale',
    ];
    if (s.includes('cutting b²') || s.includes('difference of two squares') || s.includes('a² - b²') || s.includes('(a+b)(a-b)') || s.includes('(a - b)')) {
      candidates.push('difference_squares_slider');
    }
    if (s.includes('picture frame') || s.includes('step k') || s.includes('step 100') || s.includes('pierced') || s.includes('tile')) {
      candidates.push('visual_pattern_step_k');
    }
    if (s.includes('odd') || s.includes('2n - 1') || s.includes('l-shape')) {
      candidates.push('concentric_l_gnomons');
    }
    if (s.includes('binomial') || s.includes('distributive') || s.includes('(a + b)') || s.includes('quadrant') || s.includes('foil')) {
      candidates.push('binomial_area_dissection');
    }
  }
  // PART I · CH 7: Proportional Reasoning 1
  else if (ch.includes('proportional') || ch.includes('ch7')) {
    chapterPool = [
      'aspect_ratio_grid',
      'mixture_decanters',
      'trairasika_sanskrit_matrix',
      'inverse_hyperbola_gauge',
      'harmonic_gear_train',
      'cartography_map_scale_compass',
    ];
    if (s.includes('aryabhata') || s.includes('āryabhaṭa') || s.includes('pramāṇa') || s.includes('pramana') || s.includes('trairāśika') || s.includes('trairasika') || s.includes('rule of three') || s.includes('cross')) {
      candidates.push('trairasika_sanskrit_matrix');
    }
    if (s.includes('coffee') || s.includes('lemonade') || s.includes('decoction') || s.includes('davara') || s.includes('pitcher') || s.includes('recipe') || s.includes('cement') || s.includes('share')) {
      candidates.push('mixture_decanters');
    }
    if (s.includes('inverse') || s.includes('hyperbola') || s.includes('speed') || s.includes('shirt') || s.includes('km/h') || s.includes('unitary')) {
      candidates.push('inverse_hyperbola_gauge');
    }
    if (s.includes('photo') || s.includes('aspect') || s.includes('ratio') || s.includes('hcf')) {
      candidates.push('aspect_ratio_grid');
    }
  }
  // PART I · CH 1 (Default): A Square and a Cube
  else {
    chapterPool = [
      'corridor_3d_perspective',
      'factor_partner_arcs',
      'square_twin_crown',
      'hundred_grid_pillars',
      'unit_digit_wheel',
      'forbidden_digits_gate',
      'trailing_zero_doubler',
      'concentric_l_gnomons',
      'staircase_diamond_square',
      'prime_factor_tree',
      'repeated_odd_subtraction',
      'number_line_caliper',
      'isometric_3d_cubes',
      'taxicab_1729_nocturne',
      'dual_cube_balance',
      'difference_pyramid',
    ];
    if (s.includes('corridor') || s.includes('100 closed') || s.includes('open (green)')) {
      candidates.push('corridor_3d_perspective');
    }
    if (s.includes('factor arc') || s.includes('partner') || s.includes('1↔18') || s.includes('1 × 18')) {
      candidates.push('factor_partner_arcs');
    }
    if (s.includes('self-loop') || s.includes('solo twin') || s.includes('4 × 4') || s.includes('6 × 6')) {
      candidates.push('square_twin_crown');
    }
    if (s.includes('10×10 grid') || s.includes('10 open square') || s.includes('{1, 4, 9, 16')) {
      candidates.push('hundred_grid_pillars');
    }
    if (s.includes('wheel') || s.includes('symmetric pairing') || s.includes('1↔9')) {
      candidates.push('unit_digit_wheel');
    }
    if (s.includes('forbidden') || s.includes('2, 3, 7, 8') || s.includes('warning stamp')) {
      candidates.push('forbidden_digits_gate');
    }
    if (s.includes('trailing zero') || s.includes('zero pairs') || s.includes('even zeros')) {
      candidates.push('trailing_zero_doubler');
    }
    if (s.includes('l-layer') || s.includes('l-shape') || s.includes('1 + 3 + 5')) {
      candidates.push('concentric_l_gnomons');
    }
    if (s.includes('staircase') || s.includes('tilted 45') || s.includes('1+2+3+4+3+2+1')) {
      candidates.push('staircase_diamond_square');
    }
    if (s.includes('factor tree') || s.includes('prime factor') || s.includes('triplet')) {
      candidates.push('prime_factor_tree');
    }
    if (s.includes('repeated') || s.includes('losing 1, 3, 5')) {
      candidates.push('repeated_odd_subtraction');
    }
    if (s.includes('number line') || s.includes('interval') || s.includes('zoom from [')) {
      candidates.push('number_line_caliper');
    }
    if (s.includes('taxicab') || s.includes('1729') || s.includes('putney') || s.includes('cab')) {
      if (s.includes('balance') || s.includes('1728 + 1')) {
        candidates.push('dual_cube_balance');
      }
      candidates.push('taxicab_1729_nocturne');
    }
    if (s.includes('difference pyramid') || s.includes('constant 6') || s.includes('3rd-difference')) {
      candidates.push('difference_pyramid');
    }
    if (s.includes('isometric cube') || s.includes('layer by layer') || s.includes('n³') || s.includes('cube')) {
      candidates.push('isometric_3d_cubes');
    }
  }

  for (const c of candidates) {
    if (!usedInThisVideo.has(c)) {
      return c;
    }
  }

  const hashIdx = computeHash(`${moduleCode}:${sceneTitle}:${clipIndex}`);
  for (let k = 0; k < chapterPool.length; k++) {
    const pick = chapterPool[(hashIdx + k) % chapterPool.length];
    if (!usedInThisVideo.has(pick)) {
      return pick;
    }
  }
  return chapterPool[hashIdx % chapterPool.length];
}

export const Part1VideoPlayer: React.FC<Part1VideoPlayerProps> = ({
  moduleCode,
  moduleTitle,
  chapterTitle = 'Ganita Prakash Class 8',
  videoCue,
  showStudyNotes = false,
  isChapterIntro = false,
}) => {
  const isEffectiveIntro = isChapterIntro || moduleCode.toLowerCase().includes('intro');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeClipIdx, setActiveClipIdx] = useState(0);
  const [clipProgress, setClipProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceName, setVoiceName] = useState<'Kore' | 'Puck'>('Kore');
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Record<string, string[]>>({});
  const ambientCtxRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  // If Chapter Intro: 1 single 25-second Gist Scene (00:25 total).
  // If Module Video: Play ONLY the authentic hand-crafted story scenes from videoCue.scenes (24s per scene => 1:12 to 1:20 total, zero repetitive synthetic filler!).
  const clips: EnrichedClip[] = useMemo(() => {
    const base = videoCue.scenes || [];
    const list: EnrichedClip[] = [];
    const usedIds = new Set<VisualSceneId>();

    if (isEffectiveIntro) {
      const introScene = base[0] || {
        sceneNumber: 1,
        timeRange: '0:00 – 0:25',
        title: `The Gist of ${moduleTitle}`,
        narration: videoCue.summary,
        boardFormula: moduleTitle,
        visualCaption: videoCue.summary,
      };
      const sId = classifySceneVisual(
        introScene.title,
        introScene.narration,
        introScene.visualCaption,
        introScene.boardFormula,
        moduleCode,
        chapterTitle,
        0,
        usedIds
      );
      return [
        {
          ...introScene,
          sceneNumber: 1,
          timeRange: '0:00 – 0:25',
          title: formatMathText(introScene.title),
          narration: formatMathText(introScene.narration),
          boardFormula: formatMathText(introScene.boardFormula),
          visualCaption: formatMathText(introScene.visualCaption),
          clipIndex: 0,
          sceneId: sId,
          stepsList: videoCue.keyTakeaways.map((k) => formatMathText(k)),
        },
      ];
    }

    // Enrich narration naturally so each genuine story scene fills its ~22-24s animation window smoothly
    const enrichNarrationForDuration = (
      rawNarration: string,
      sceneTitle: string,
      formula: string,
      caption: string,
      sceneIdx: number,
      totalScenes: number
    ) => {
      const clean = formatMathText(rawNarration).trim();
      const sentences = clean.split(/(?<=[.?!])\s+/).filter(Boolean);
      if (sentences.length >= 3 && clean.length >= 230) {
        return clean;
      }
      const takeawayHint =
        videoCue.keyTakeaways[sceneIdx % Math.max(1, videoCue.keyTakeaways.length)];
      const extra1 =
        caption && !clean.toLowerCase().includes(caption.toLowerCase().slice(0, 18))
          ? `On the canvas, watch how ${formatMathText(caption).replace(/\.$/, '')}.`
          : `Follow the moving geometry as each step of ${formatMathText(sceneTitle)} locks into place.`;
      const extra2 =
        sceneIdx === totalScenes - 1 && takeawayHint
          ? `This completes our core insight: ${formatMathText(takeawayHint)}`
          : formula
          ? `This reveals the relationship ${formatMathText(formula)}.`
          : '';
      return `${clean} ${extra1} ${extra2}`.trim();
    };

    const perSceneSec = base.length >= 4 ? 20 : 24;
    for (let i = 0; i < base.length; i++) {
      const sc = base[i];
      if (sc) {
        const sId = classifySceneVisual(
          sc.title,
          sc.narration,
          sc.visualCaption,
          sc.boardFormula,
          moduleCode,
          chapterTitle,
          list.length,
          usedIds
        );
        usedIds.add(sId);
        const startSec = list.length * perSceneSec;
        const endSec = (list.length + 1) * perSceneSec;
        const fmtSec = (s: number) =>
          `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
        list.push({
          ...sc,
          sceneNumber: list.length + 1,
          timeRange: `${fmtSec(startSec)} – ${fmtSec(endSec)}`,
          title: formatMathText(sc.title),
          narration: enrichNarrationForDuration(
            sc.narration,
            sc.title,
            sc.boardFormula,
            sc.visualCaption,
            i,
            base.length
          ),
          boardFormula: formatMathText(sc.boardFormula),
          visualCaption: formatMathText(sc.visualCaption),
          clipIndex: list.length,
          sceneId: sId,
        });
      }
    }

    return list;
  }, [videoCue, moduleCode, moduleTitle, chapterTitle, isEffectiveIntro]);

  const SCENE_DURATION_SEC = isEffectiveIntro ? 25 : clips.length >= 4 ? 20 : 24; // 25s for Chapter Intro Gist; 3×24s = 72s (1:12) or 4×20s = 80s (1:20) for Module Videos
  const totalVideoSeconds = clips.length * SCENE_DURATION_SEC;
  const elapsedVideoSeconds = Math.min(
    totalVideoSeconds,
    Math.round((activeClipIdx + clipProgress) * SCENE_DURATION_SEC)
  );
  const formatMMSS = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

  const currentClip = clips[activeClipIdx] || clips[0];

  // Warm ambient documentary pad
  const startAmbientMusic = useCallback(() => {
    if (isMuted || typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!ambientCtxRef.current) {
        ambientCtxRef.current = new AudioCtx();
      }
      const ctx = ambientCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      if (ambientGainRef.current) return;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.008, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 1.5);
      masterGain.connect(ctx.destination);
      ambientGainRef.current = masterGain;

      const freqs = [130.81, 196.0, 246.94, 293.66];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(540, ctx.currentTime);
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.14 / freqs.length, ctx.currentTime);
        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
      });
    } catch {
      // Ignore
    }
  }, [isMuted]);

  const stopAmbientMusic = useCallback(() => {
    try {
      if (ambientCtxRef.current && ambientGainRef.current) {
        ambientCtxRef.current.close().catch(() => {});
        ambientCtxRef.current = null;
        ambientGainRef.current = null;
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    if (isPlaying && !isMuted) {
      startAmbientMusic();
    } else {
      stopAmbientMusic();
    }
    return () => stopAmbientMusic();
  }, [isPlaying, isMuted, startAmbientMusic, stopAmbientMusic]);

  const renderStateRef = useRef({
    isPlaying,
    activeClipIdx,
    clipProgress,
    currentClip,
    moduleCode,
    moduleTitle,
    chapterTitle,
    clipsCount: clips.length,
    allClips: clips,
  });

  useEffect(() => {
    renderStateRef.current = {
      isPlaying,
      activeClipIdx,
      clipProgress,
      currentClip,
      moduleCode,
      moduleTitle,
      chapterTitle,
      clipsCount: clips.length,
      allClips: clips,
    };
  }, [
    isPlaying,
    activeClipIdx,
    clipProgress,
    currentClip,
    moduleCode,
    moduleTitle,
    chapterTitle,
    clips,
  ]);

  useEffect(() => {
    setIsPlaying(false);
    setActiveClipIdx(0);
    setClipProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [moduleCode, moduleTitle]);

  const fetchClipAudio = useCallback(
    async (clip: EnrichedClip, voice: 'Kore' | 'Puck'): Promise<string[]> => {
      if (!clip) return [];
      const key = `${voice}:${moduleCode}:${moduleTitle}:${clip.clipIndex}`;
      if (audioCacheRef.current[key] && audioCacheRef.current[key].length > 0) {
        return audioCacheRef.current[key];
      }
      try {
        const res = await fetch('/api/lesson-voiceover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `${clip.title}. ${clip.narration}`,
            voiceName: voice,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const chunks: string[] =
            Array.isArray(data.audioChunks) && data.audioChunks.length > 0
              ? data.audioChunks
              : data.audioDataUrl
                ? [data.audioDataUrl]
                : [];
          if (chunks.length > 0) {
            audioCacheRef.current[key] = chunks;
            return chunks;
          }
        }
      } catch {
        // Fallback handled in startPlayback
      }
      return [];
    },
    [moduleCode, moduleTitle]
  );

  useEffect(() => {
    if (clips[0]) fetchClipAudio(clips[0], voiceName);
    if (clips[1]) fetchClipAudio(clips[1], voiceName);
  }, [clips, voiceName, fetchClipAudio]);

  // Synchronized 18-second-per-scene (1:30 total) playback engine with sequential MP3 chunk queue + Web Speech fallback
  useEffect(() => {
    if (!isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    let cancelled = false;
    let timerId: ReturnType<typeof setInterval> | null = null;
    const clip = clips[activeClipIdx];
    if (!clip) return;

    if (clips[activeClipIdx + 1]) {
      fetchClipAudio(clips[activeClipIdx + 1], voiceName);
    }

    const speakWithBrowserFallback = () => {
      if (cancelled || isMuted) return;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(`${clip.title}. ${clip.narration}`);
          utter.lang = voiceName === 'Kore' ? 'en-GB' : 'en-US';
          utter.rate = 0.98;
          window.speechSynthesis.speak(utter);
        } catch {
          // Ignore
        }
      }
    };

    const startPlayback = async () => {
      setIsLoadingAudio(true);
      const chunks = await fetchClipAudio(clip, voiceName);
      if (cancelled) return;
      setIsLoadingAudio(false);

      const minSceneMs = SCENE_DURATION_SEC * 1000;
      const started = performance.now();
      let accumulatedAudioMs = 0;
      let targetSceneMs = minSceneMs;
      let audioFinished = false;

      if (chunks.length > 0) {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        const audio = audioRef.current;
        audio.muted = isMuted;

        const playChunk = (chunkIdx: number) => {
          if (cancelled) return;
          if (chunkIdx >= chunks.length) {
            audioFinished = true;
            return;
          }
          audio.src = chunks[chunkIdx];
          audio.muted = isMuted;
          audio.onloadedmetadata = () => {
            if (!isEffectiveIntro && audio.duration && Number.isFinite(audio.duration)) {
              accumulatedAudioMs += audio.duration * 1000;
              const remainingChunksEst = (chunks.length - 1 - chunkIdx) * 3600;
              targetSceneMs = Math.max(
                minSceneMs,
                accumulatedAudioMs + remainingChunksEst + 600
              );
            }
          };
          audio.onended = () => {
            playChunk(chunkIdx + 1);
          };
          audio.onerror = () => {
            playChunk(chunkIdx + 1);
          };
          audio.play().catch(() => {
            if (chunkIdx === 0) {
              audioFinished = true;
              speakWithBrowserFallback();
            } else {
              playChunk(chunkIdx + 1);
            }
          });
        };

        playChunk(0);
      } else {
        audioFinished = true;
        speakWithBrowserFallback();
      }

      timerId = setInterval(() => {
        if (cancelled) {
          if (timerId) clearInterval(timerId);
          return;
        }
        const elapsed = performance.now() - started;
        const p = Math.min(1, elapsed / targetSceneMs);
        setClipProgress(p);

        if (p >= 1 && (isEffectiveIntro || audioFinished || elapsed >= targetSceneMs + 2500)) {
          if (timerId) clearInterval(timerId);
          if (activeClipIdx < clips.length - 1) {
            setClipProgress(0);
            setActiveClipIdx((prev) => prev + 1);
          } else {
            setIsPlaying(false);
            setClipProgress(1);
          }
        }
      }, 50);
    };

    startPlayback();

    return () => {
      cancelled = true;
      if (timerId) clearInterval(timerId);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, activeClipIdx, clips, voiceName, fetchClipAudio, SCENE_DURATION_SEC, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
    if (isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [isMuted]);

  // ===========================================================================
  // GOLDEN VAULT & STARDUST CINEMA ENGINE (Inspired by the Reference Video!)
  // Every scene renders on a warm obsidian-mahogany vault stage with floating
  // golden stardust motes, swirling light trails, and beat-by-beat scenery
  // synchronized directly to the active spoken sentence in the transcript.
  // ===========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const t0 = performance.now();

    const drawDocumentaryFrame = (now: number) => {
      const st = renderStateRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2 - 15;

      const videoSeed = computeHash(`${st.chapterTitle}:${st.moduleCode}:${st.moduleTitle}`);
      const pal =
        ATMOSPHERE_PALETTES[(videoSeed + st.activeClipIdx * 3) % ATMOSPHERE_PALETTES.length];

      const t = (now - t0) / 1000;
      const prog = st.isPlaying ? st.clipProgress : ((t * 0.06) % 1);

      const sentences = st.currentClip.narration
        .split(/(?<=[.?!])\s+/)
        .filter(Boolean);
      const sIdx = Math.min(
        sentences.length - 1,
        Math.floor(prog * Math.max(1, sentences.length))
      );
      const activeSentence = sentences[sIdx] || st.currentClip.narration;
      const activeSentenceLower = activeSentence.toLowerCase();

      // 1. Warm Obsidian & Mahogany Vault Backdrop (Matches 00:00-00:09 Reference Video)
      const bgGrad = ctx.createRadialGradient(cx, cy, 40, cx, cy, w * 0.75);
      bgGrad.addColorStop(0, '#2B1B0D');
      bgGrad.addColorStop(0.55, '#180E06');
      bgGrad.addColorStop(1, '#090502');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle Carved Mahogany Library Pilaster Borders on Left & Right Edges
      ctx.fillStyle = 'rgba(18, 10, 4, 0.72)';
      ctx.fillRect(0, 0, 56, h);
      ctx.fillRect(w - 56, 0, 56, h);
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(12, 16, 32, h - 32);
      ctx.strokeRect(w - 44, 16, 32, h - 32);

      // Delicate Golden Coordinate Blueprint Grid
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.055)';
      ctx.lineWidth = 1;
      const gridShift = (t * 8) % 64;
      for (let gx = 56 + gridShift; gx < w - 56; gx += 64) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = gridShift; gy < h; gy += 64) {
        ctx.beginPath();
        ctx.moveTo(56, gy);
        ctx.lineTo(w - 56, gy);
        ctx.stroke();
      }

      // 50 Floating Golden Stardust Particles & Warm Bokeh Motes
      for (let p = 0; p < 50; p++) {
        const px = ((p * 173 + t * (12 + (p % 7) * 2)) % (w - 120)) + 60;
        const py = ((p * 97 - t * (8 + (p % 5) * 2) + h * 10) % (h - 80)) + 40;
        const alpha = 0.2 + 0.55 * Math.abs(Math.sin(t * 1.8 + p));
        const r = (p % 3) + 1.2;
        ctx.fillStyle = `rgba(254, 240, 138, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dynamic Transcript-Driven Scene Choreography:
      // 1. For 25-second Chapter Intro Videos: transition smoothly across 3 distinct chapter-specific visual beats
      //    synchronized to Sentences 1, 2, and 3 of the 25s Gist voiceover!
      // 2. For 1-2 minute Module Videos: dynamically synchronize the visual stage to the active spoken sentence
      //    and apply a unique per-module geometric camera perspective so no two modules ever repeat footage!
      let sceneId = st.currentClip.sceneId;
      const isIntroVideo = st.moduleCode.toLowerCase().includes('intro');
      const isSquaresChapter =
        st.chapterTitle.toLowerCase().includes('square') ||
        st.moduleTitle.toLowerCase().includes('square') ||
        st.moduleTitle.toLowerCase().includes('locker');

      if (isIntroVideo && !isSquaresChapter) {
        const introBeat = prog < 0.34 ? 0 : prog < 0.68 ? 1 : 2;
        const usedIntroSet = new Set<VisualSceneId>();
        for (let b = 0; b <= introBeat; b++) {
          const beatSentence = sentences[b] || activeSentence;
          const picked = classifySceneVisual(
            st.currentClip.title,
            beatSentence,
            st.currentClip.visualCaption,
            st.currentClip.boardFormula,
            `IntroBeat.${b + 1}`,
            st.chapterTitle,
            b,
            usedIntroSet
          );
          usedIntroSet.add(picked);
          sceneId = picked;
        }
      } else if (
        isSquaresChapter &&
        (activeSentenceLower.includes('locker') ||
          activeSentenceLower.includes('door') ||
          activeSentenceLower.includes('corridor'))
      ) {
        sceneId = 'corridor_3d_perspective';
      } else if (
        isSquaresChapter &&
        (activeSentenceLower.includes('factor') ||
          activeSentenceLower.includes('root') ||
          activeSentenceLower.includes('prime'))
      ) {
        sceneId = 'prime_factor_tree';
      }

      const modSubMatch = st.moduleCode.match(/\.(\d+)/);
      const activeModSubIdx = modSubMatch ? parseInt(modSubMatch[1], 10) : 0;

      ctx.save();
      if (!isIntroVideo && activeModSubIdx > 0) {
        // Subtle per-module camera framing so every module (X.1 through X.8) has a distinct visual composition
        const shiftX = ((activeModSubIdx % 3) - 1) * 14;
        const shiftY = ((activeModSubIdx % 2) - 0.5) * 8;
        ctx.translate(shiftX, shiftY);
      }

      // =======================================================================
      // 1. GRAND CHAPTER ODYSSEY VAULT (Synchronized to Transcript Beats!)
      // =======================================================================
      if (sceneId === 'chapter_odyssey_map') {
        if (isSquaresChapter && prog < 0.48) {
          // BEAT 1 (00:00 - 00:04 of Reference Video): 100 Brass Lockers Wall with Glowing Open Doors & Swirling Golden Light Ring!
          const cols = 10;
          const rows = 7;
          const cellW = 84;
          const cellH = 50;
          const x0 = cx - (cols * cellW) / 2;
          const y0 = 105;

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const num = r * cols + c + 1;
              const lx = x0 + c * cellW;
              const ly = y0 + r * cellH;
              const root = Math.round(Math.sqrt(num));
              const isSquare = root * root === num;
              const isGlowingOpen =
                isSquare && ((num <= 49 && prog > 0.05) || (r === 2 && c === 4));

              // Brass Locker Frame
              ctx.fillStyle = isGlowingOpen ? '#FEF08A' : '#3E2A16';
              ctx.strokeStyle = isGlowingOpen ? '#FDE047' : '#24170B';
              ctx.lineWidth = 2;
              ctx.fillRect(lx + 2, ly + 2, cellW - 4, cellH - 4);
              ctx.strokeRect(lx + 2, ly + 2, cellW - 4, cellH - 4);

              if (isGlowingOpen) {
                // Volumetric Golden Light Spill from Open Locker
                ctx.save();
                ctx.shadowColor = '#FDE047';
                ctx.shadowBlur = 28;
                ctx.fillStyle = '#FFFBEB';
                ctx.fillRect(lx + 4, ly + 4, cellW - 8, cellH - 8);
                ctx.restore();

                // Swinging Brass Door in 3D Perspective
                ctx.fillStyle = '#78522B';
                ctx.strokeStyle = '#FDE047';
                ctx.beginPath();
                ctx.moveTo(lx + cellW - 4, ly + 2);
                ctx.lineTo(lx + cellW + 18, ly + 10);
                ctx.lineTo(lx + cellW + 18, ly + cellH - 6);
                ctx.lineTo(lx + cellW - 4, ly + cellH - 2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
              } else {
                // Brass Number Plate & Keyhole
                ctx.fillStyle = '#1C1208';
                ctx.fillRect(lx + cellW / 2 - 14, ly + 7, 28, 11);
                ctx.fillStyle = '#D97706';
                ctx.font = 'bold 9px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(String(num).padStart(3, '0'), lx + cellW / 2, ly + 16);
                ctx.beginPath();
                ctx.arc(lx + cellW / 2, ly + 31, 3, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }

          // Swirling Golden Light Ribbon (Exact match to 00:03-00:04 of Reference Video!)
          ctx.save();
          ctx.translate(cx, cy + 5);
          for (let ring = 0; ring < 3; ring++) {
            ctx.strokeStyle =
              ring === 0 ? '#FFFBEB' : ring === 1 ? '#FDE047' : 'rgba(245, 158, 11, 0.55)';
            ctx.lineWidth = 3.5 - ring;
            ctx.shadowColor = '#FDE047';
            ctx.shadowBlur = 18;
            ctx.beginPath();
            for (let a = 0; a < Math.PI * 1.85; a += 0.08) {
              const rad = 115 + Math.sin(a * 2 + t * 4 + ring) * 18;
              const rx = Math.cos(a + t * 2.4 + ring * 0.5) * rad;
              const ry = Math.sin(a + t * 2.4 + ring * 0.5) * rad * 0.85;
              if (a === 0) ctx.moveTo(rx, ry);
              else ctx.lineTo(rx, ry);
            }
            ctx.stroke();
          }
          ctx.restore();
        } else if (isSquaresChapter) {
          // BEAT 2 (00:05 - 00:09 of Reference Video): Split Golden Dot-Matrix Square (Left) + Golden Factor Tree (Right)!
          const dotStartX = 250;
          const dotStartY = 125;
          const spacing = 36;
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              const dx = dotStartX + c * spacing;
              const dy = dotStartY + r * spacing;
              ctx.save();
              ctx.shadowColor = '#FDE047';
              ctx.shadowBlur = 10;
              ctx.fillStyle = '#FEF08A';
              ctx.beginPath();
              ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }
          // Glowing Dotted Gnomon Sub-Squares on the 8×8 Dot Matrix
          ctx.strokeStyle = '#FDE047';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 6]);
          ctx.strokeRect(dotStartX - 8, dotStartY - 8, spacing * 2 + 16, spacing * 2 + 16);
          ctx.strokeRect(dotStartX + spacing * 3 - 8, dotStartY - 8, spacing * 4 + 16, spacing * 4 + 16);
          ctx.strokeRect(dotStartX + spacing * 3 - 8, dotStartY + spacing * 5 - 8, spacing * 4 + 16, spacing * 2 + 16);
          ctx.setLineDash([]);

          // Right Side: Glowing Golden Factor Tree for 100 -> 10, 10 -> 2, 2, 5, 5
          const tx = 860;
          const ty = 135;
          ctx.strokeStyle = '#FDE047';
          ctx.lineWidth = 2.5;
          const treeEdges = [
            [tx, ty + 10, tx - 95, ty + 80],
            [tx, ty + 10, tx + 95, ty + 80],
            [tx - 95, ty + 110, tx - 145, ty + 175],
            [tx - 95, ty + 110, tx - 45, ty + 175],
            [tx + 95, ty + 110, tx + 45, ty + 175],
            [tx + 95, ty + 110, tx + 145, ty + 175],
          ];
          treeEdges.forEach(([x1, y1, x2, y2]) => {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          });

          ctx.fillStyle = '#FEF08A';
          ctx.shadowColor = '#FDE047';
          ctx.shadowBlur = 12;
          ctx.font = 'bold 28px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.fillText('100', tx, ty);
          ctx.fillText('10', tx - 95, ty + 105);
          ctx.fillText('10', tx + 95, ty + 105);
          ctx.fillText('2', tx - 145, ty + 205);
          ctx.fillText('2', tx - 45, ty + 205);
          ctx.fillText('2', tx + 45, ty + 205);
          ctx.fillText('5', tx + 145, ty + 205);
          ctx.font = '22px Georgia, serif';
          ctx.fillText('2 + 2     { 2 + 5 }   { 2 + 5 }   { 2 + 5 }', tx, ty + 248);
          ctx.shadowBlur = 0;
        } else {
          // Universal Golden Astrolabe & Module Constellation for Chapters 2-14
          ctx.save();
          ctx.translate(cx, cy);
          for (let r = 1; r <= 3; r++) {
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.22)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(0, 0, r * 145, r * 72, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();

          const nodeCount = st.allClips.length;
          const nodes = st.allClips.map((c, idx) => {
            const angle = (idx / nodeCount) * Math.PI * 2 + t * 0.25 + (videoSeed % 5);
            const rx = 315;
            const ry = 130;
            return {
              x: cx + Math.cos(angle) * rx,
              y: cy + Math.sin(angle) * ry,
              title: c.title.slice(0, 26),
              formula: c.boardFormula.slice(0, 22),
              idx,
            };
          });

          ctx.strokeStyle = pal.gold;
          ctx.lineWidth = 2;
          ctx.beginPath();
          nodes.forEach((n, idx) => {
            if (idx === 0) ctx.moveTo(n.x, n.y);
            else ctx.lineTo(n.x, n.y);
          });
          ctx.closePath();
          ctx.stroke();

          ctx.fillStyle = '#1C1107';
          ctx.strokeStyle = pal.gold;
          ctx.lineWidth = 3.5;
          ctx.shadowColor = pal.gold;
          ctx.shadowBlur = 24;
          ctx.beginPath();
          ctx.arc(cx, cy, 84, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#FEF08A';
          ctx.font = 'bold 18px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.fillText(st.moduleCode.toUpperCase(), cx, cy - 8);
          ctx.fillStyle = pal.gold;
          ctx.font = 'bold 15px Georgia, serif';
          ctx.fillText(st.moduleTitle.slice(0, 24), cx, cy + 18);

          nodes.forEach((n, idx) => {
            const isHighlightedNode = idx === sIdx % nodes.length;
            ctx.fillStyle = isHighlightedNode ? '#3B230E' : '#1A1007';
            ctx.strokeStyle = isHighlightedNode ? '#FEF08A' : pal.accent;
            ctx.lineWidth = isHighlightedNode ? 3.5 : 2;
            ctx.beginPath();
            ctx.roundRect(n.x - 105, n.y - 32, 210, 64, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#FEF08A';
            ctx.font = 'bold 13px Georgia, serif';
            ctx.fillText(n.title, n.x, n.y - 5);
            ctx.fillStyle = '#FDE68A';
            ctx.font = '12px monospace';
            ctx.fillText(n.formula, n.x, n.y + 16);
          });
        }
      }

      // =======================================================================
      // 2. 100 ANTIQUE BRASS LOCKERS VAULT (Matches 00:00-00:04 of Reference Video!)
      // =======================================================================
      else if (sceneId === 'corridor_3d_perspective') {
        const cols = 10;
        const rows = 7;
        const cellW = 84;
        const cellH = 50;
        const x0 = cx - (cols * cellW) / 2;
        const y0 = 105;
        const stepK = (Math.floor(t * 0.7) % 4) + 1;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const num = r * cols + c + 1;
            const lx = x0 + c * cellW;
            const ly = y0 + r * cellH;
            const root = Math.round(Math.sqrt(num));
            const isSquare = root * root === num;
            const isOpen = isSquare || (prog < 0.45 && num % (stepK + 1) === 0 && num <= 30);

            ctx.fillStyle = isOpen ? '#FEF08A' : '#3E2A16';
            ctx.strokeStyle = isOpen ? '#FDE047' : '#24170B';
            ctx.lineWidth = 2;
            ctx.fillRect(lx + 2, ly + 2, cellW - 4, cellH - 4);
            ctx.strokeRect(lx + 2, ly + 2, cellW - 4, cellH - 4);

            if (isOpen) {
              ctx.save();
              ctx.shadowColor = '#FDE047';
              ctx.shadowBlur = 24;
              ctx.fillStyle = '#FFFBEB';
              ctx.fillRect(lx + 4, ly + 4, cellW - 8, cellH - 8);
              ctx.restore();

              ctx.fillStyle = '#78522B';
              ctx.strokeStyle = '#FDE047';
              ctx.beginPath();
              ctx.moveTo(lx + cellW - 4, ly + 2);
              ctx.lineTo(lx + cellW + 16, ly + 9);
              ctx.lineTo(lx + cellW + 16, ly + cellH - 5);
              ctx.lineTo(lx + cellW - 4, ly + cellH - 2);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = '#451A03';
              ctx.font = 'bold 13px Georgia, serif';
              ctx.textAlign = 'center';
              ctx.fillText(`#${num}`, lx + cellW / 2 - 4, ly + 30);
            } else {
              ctx.fillStyle = '#1C1208';
              ctx.fillRect(lx + cellW / 2 - 14, ly + 7, 28, 11);
              ctx.fillStyle = '#D97706';
              ctx.font = 'bold 9px monospace';
              ctx.textAlign = 'center';
              ctx.fillText(String(num).padStart(3, '0'), lx + cellW / 2, ly + 16);
              ctx.beginPath();
              ctx.arc(lx + cellW / 2, ly + 31, 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Swirling Golden Stardust Ring over the Open Lockers
        ctx.save();
        ctx.translate(cx, cy + 10);
        ctx.strokeStyle = '#FDE047';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#FDE047';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 1.75; a += 0.08) {
          const rad = 110 + Math.sin(a * 2 + t * 4) * 16;
          const rx = Math.cos(a + t * 2.2) * rad;
          const ry = Math.sin(a + t * 2.2) * rad * 0.85;
          if (a === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
        ctx.stroke();
        ctx.restore();
      }

      // =======================================================================
      // 3. HARMONIC FACTOR-PAIR ARCS (Module 1.1 Scene 2: Why Non-Squares Close)
      // =======================================================================
      else if (sceneId === 'factor_partner_arcs') {
        const factors = [1, 2, 3, 6, 9, 18];
        const yAxis = cy + 95;
        const startX = 220;
        const spanW = w - 440;

        // Horizontal Number Axis
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX - 40, yAxis);
        ctx.lineTo(startX + spanW + 40, yAxis);
        ctx.stroke();

        const pairs = [
          { a: 0, b: 5, label: '1 × 18 = 18 (Open → Shut)', color: '#38BDF8', h: 210 },
          { a: 1, b: 4, label: '2 × 9 = 18 (Open → Shut)', color: '#A78BFA', h: 145 },
          { a: 2, b: 3, label: '3 × 6 = 18 (Open → Shut)', color: '#F472B6', h: 85 },
        ];

        pairs.forEach((p, idx) => {
          const x1 = startX + (p.a / 5) * spanW;
          const x2 = startX + (p.b / 5) * spanW;
          const midX = (x1 + x2) / 2;
          const pulse = Math.sin(t * 2.5 - idx) * 6;

          ctx.strokeStyle = p.color;
          ctx.lineWidth = 4;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.moveTo(x1, yAxis);
          ctx.quadraticCurveTo(midX, yAxis - p.h * 1.4 + pulse, x2, yAxis);
          ctx.stroke();
          ctx.shadowBlur = 0;

          ctx.fillStyle = p.color;
          ctx.font = 'bold 17px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(p.label, midX, yAxis - p.h * 0.72 + pulse);
        });

        factors.forEach((f, idx) => {
          const fx = startX + (idx / 5) * spanW;
          ctx.fillStyle = '#0F172A';
          ctx.strokeStyle = pal.gold;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(fx, yAxis, 28, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 20px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${f}`, fx, yAxis + 7);
        });
      }

      // =======================================================================
      // 4. SOLO TWIN FACTOR CROWN (Module 1.1 Scene 3: Why Perfect Squares Stay Open)
      // =======================================================================
      else if (sceneId === 'square_twin_crown') {
        const factors = [1, 2, 4, 8, 16];
        const yAxis = cy + 100;
        const startX = 240;
        const spanW = w - 480;

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX - 40, yAxis);
        ctx.lineTo(startX + spanW + 40, yAxis);
        ctx.stroke();

        // Outer symmetric partner arcs: (1, 16) and (2, 8)
        [
          { a: 0, b: 4, label: '1 ↔ 16 (Cancels)', h: 190, col: '#38BDF8' },
          { a: 1, b: 3, label: '2 ↔ 8 (Cancels)', h: 120, col: '#2DD4BF' },
        ].forEach((p) => {
          const x1 = startX + (p.a / 4) * spanW;
          const x2 = startX + (p.b / 4) * spanW;
          ctx.strokeStyle = p.col;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(x1, yAxis);
          ctx.quadraticCurveTo(cx, yAxis - p.h * 1.4, x2, yAxis);
          ctx.stroke();
          ctx.fillStyle = p.col;
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(p.label, cx, yAxis - p.h * 0.72);
        });

        // Center Self-Paired Twin Loop on 4 × 4 = 16!
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 5;
        ctx.shadowColor = pal.gold;
        ctx.shadowBlur = 22;
        ctx.beginPath();
        ctx.arc(cx, yAxis - 54, 46, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('4 × 4 = 16 (Unpaired Solo Twin ⇒ Stays OPEN!)', cx, yAxis - 118);

        factors.forEach((f, idx) => {
          const fx = startX + (idx / 4) * spanW;
          const isTwin = f === 4;
          ctx.fillStyle = isTwin ? pal.gold : '#0F172A';
          ctx.strokeStyle = pal.gold;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(fx, yAxis, isTwin ? 34 : 26, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isTwin ? '#0F172A' : '#FFFFFF';
          ctx.font = 'bold 20px monospace';
          ctx.fillText(`${f}`, fx, yAxis + 7);
        });
      }

      // =======================================================================
      // 5. 10×10 HUNDRED-GRID SQUARE PILLARS (Module 1.1 Scene 4)
      // =======================================================================
      else if (sceneId === 'hundred_grid_pillars') {
        const cellW = 58;
        const cellH = 38;
        const gx0 = cx - (10 * cellW) / 2;
        const gy0 = 95;
        const scanN = Math.floor(((t * 16) % 100) + 1);

        for (let r = 0; r < 10; r++) {
          for (let c = 0; c < 10; c++) {
            const n = r * 10 + c + 1;
            const root = Math.round(Math.sqrt(n));
            const isSq = root * root === n;
            const x = gx0 + c * cellW;
            const y = gy0 + r * cellH;
            const lift = isSq ? 8 + Math.sin(t * 3 + root) * 3 : 0;

            ctx.fillStyle = isSq
              ? pal.gold
              : n === scanN
              ? 'rgba(45, 212, 191, 0.45)'
              : 'rgba(30, 41, 59, 0.72)';
            ctx.strokeStyle = isSq ? '#FEF08A' : 'rgba(148, 163, 184, 0.25)';
            ctx.lineWidth = isSq ? 2.5 : 1;
            ctx.beginPath();
            ctx.roundRect(x + 3, y + 3 - lift, cellW - 6, cellH - 6, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isSq ? '#0F172A' : '#94A3B8';
            ctx.font = `${isSq ? 'bold 15px' : '12px'} monospace`;
            ctx.textAlign = 'center';
            ctx.fillText(`${n}`, x + cellW / 2, y + cellH / 2 + 4 - lift);
          }
        }
      }

      // =======================================================================
      // 6. SYMMETRIC UNIT-DIGIT HARMONIC WHEEL (Module 1.2 Scene 1)
      // =======================================================================
      else if (sceneId === 'unit_digit_wheel') {
        const rad = 165;
        const activeD = Math.floor(t * 1.6) % 10;

        // Symmetry chords connecting (1,9), (2,8), (3,7), (4,6)
        const chords = [
          [1, 9, 'End in 1', '#38BDF8'],
          [2, 8, 'End in 4', '#2DD4BF'],
          [3, 7, 'End in 9', '#FBBF24'],
          [4, 6, 'End in 6', '#F472B6'],
        ];
        chords.forEach(([a, b, lbl, col]) => {
          const a1 = (Number(a) / 10) * Math.PI * 2 - Math.PI / 2;
          const a2 = (Number(b) / 10) * Math.PI * 2 - Math.PI / 2;
          const x1 = cx + Math.cos(a1) * rad;
          const y1 = cy + Math.sin(a1) * rad;
          const x2 = cx + Math.cos(a2) * rad;
          const y2 = cy + Math.sin(a2) * rad;

          ctx.strokeStyle = String(col);
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          ctx.fillStyle = String(col);
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(String(lbl), cx, (y1 + y2) / 2 - 6);
        });

        for (let d = 0; d <= 9; d++) {
          const ang = (d / 10) * Math.PI * 2 - Math.PI / 2;
          const dx = cx + Math.cos(ang) * rad;
          const dy = cy + Math.sin(ang) * rad;
          const isLit = d === activeD || d === 10 - activeD;

          ctx.fillStyle = isLit ? pal.gold : '#0F172A';
          ctx.strokeStyle = pal.accent;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(dx, dy, 28, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isLit ? '#0F172A' : '#FFFFFF';
          ctx.font = 'bold 16px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${d}²→${(d * d) % 10}`, dx, dy + 5);
        }
      }

      // =======================================================================
      // 7. FORBIDDEN DIGITS LASER FILTER: {2, 3, 7, 8} (Module 1.2 Scene 2)
      // =======================================================================
      else if (sceneId === 'forbidden_digits_gate') {
        for (let d = 0; d <= 9; d++) {
          const x = 140 + d * 108;
          const isForbidden = d === 2 || d === 3 || d === 7 || d === 8;
          const yOffset = isForbidden ? Math.sin(t * 3 + d) * 8 : 0;

          ctx.fillStyle = isForbidden
            ? 'rgba(225, 29, 72, 0.22)'
            : 'rgba(16, 185, 129, 0.22)';
          ctx.strokeStyle = isForbidden ? '#F43F5E' : '#10B981';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.roundRect(x - 44, cy - 85 + yOffset, 88, 165, 16);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 42px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${d}`, x, cy - 10 + yOffset);

          ctx.fillStyle = isForbidden ? '#FDA4AF' : '#6EE7B7';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(isForbidden ? 'NEVER n²' : 'VALID n²', x, cy + 45 + yOffset);
        }
      }

      // =======================================================================
      // 8. TRAILING ZERO DOUBLER (Module 1.2 Scene 3)
      // =======================================================================
      else if (sceneId === 'trailing_zero_doubler') {
        const rows = [
          { base: '30²', exp: '(3 × 10¹)²', result: '900', zeros: 2, y: 150 },
          { base: '300²', exp: '(3 × 10²)²', result: '90,000', zeros: 4, y: 270 },
          { base: '3,000²', exp: '(3 × 10³)²', result: '9,000,000', zeros: 6, y: 390 },
        ];

        rows.forEach((r, idx) => {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.strokeStyle = pal.accent;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(180, r.y - 42, 920, 84, 16);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = pal.gold;
          ctx.font = 'bold 26px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`${r.base} = ${r.exp}  ⇒  9`, 220, r.y + 9);

          // Draw paired Zero Capsules (00)
          for (let z = 0; z < r.zeros / 2; z++) {
            const zx = 650 + z * 115 + Math.sin(t * 3 + idx + z) * 4;
            ctx.fillStyle = '#10B981';
            ctx.beginPath();
            ctx.roundRect(zx, r.y - 24, 92, 48, 24);
            ctx.fill();
            ctx.fillStyle = '#042F2E';
            ctx.font = 'bold 24px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('00', zx + 46, r.y + 8);
          }
        });
      }

      // =======================================================================
      // 9. CONCENTRIC L-SHAPED GNOMON SHELLS (Module 1.3 Scene 1)
      // =======================================================================
      else if (sceneId === 'concentric_l_gnomons') {
        const colors = ['#F43F5E', '#FB923C', '#FACC15', '#34D399', '#38BDF8', '#A78BFA'];
        const activeLayers = (Math.floor(t * 1.2) % 6) + 1;
        const cell = 54;
        const x0 = cx - (6 * cell) / 2 - 120;
        const y0 = cy - (6 * cell) / 2;

        for (let r = 0; r < 6; r++) {
          for (let c = 0; c < 6; c++) {
            const layer = Math.max(r, c);
            const isVisible = layer < activeLayers;
            ctx.fillStyle = isVisible ? colors[layer] : 'rgba(255,255,255,0.06)';
            ctx.beginPath();
            ctx.roundRect(x0 + c * cell + 3, y0 + r * cell + 3, cell - 6, cell - 6, 8);
            ctx.fill();

            if (isVisible) {
              ctx.fillStyle = '#0F172A';
              ctx.font = 'bold 16px monospace';
              ctx.textAlign = 'center';
              ctx.fillText(`${2 * layer + 1}`, x0 + c * cell + cell / 2, y0 + r * cell + cell / 2 + 6);
            }
          }
        }

        // Live Equation Breakdown on the Right
        const oddTerms = Array.from({ length: activeLayers }, (_, i) => 2 * i + 1).join(' + ');
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 28px Georgia, serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${oddTerms}`, cx + 90, cy - 20);
        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 44px Georgia, serif';
        ctx.fillText(`= ${activeLayers}² = ${activeLayers * activeLayers}`, cx + 90, cy + 40);
      }

      // =======================================================================
      // 10. PALINDROMIC STAIRCASE DIAMOND ROTATION (Module 1.3 Scene 3)
      // =======================================================================
      else if (sceneId === 'staircase_diamond_square') {
        const cols = [1, 2, 3, 4, 5, 4, 3, 2, 1];
        const barW = 56;
        const unitH = 42;
        const baseLine = cy + 135;

        cols.forEach((hUnits, idx) => {
          const x = cx - (cols.length * barW) / 2 + idx * barW;
          const isPeak = hUnits === 5;
          for (let u = 0; u < hUnits; u++) {
            const y = baseLine - (u + 1) * unitH;
            ctx.fillStyle = isPeak ? pal.gold : u % 2 === 0 ? pal.accent : '#38BDF8';
            ctx.beginPath();
            ctx.roundRect(x + 4, y + 4, barW - 8, unitH - 6, 6);
            ctx.fill();
          }
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 18px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${hUnits}`, x + barW / 2, baseLine + 28);
        });

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 24px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('1 + 2 + 3 + 4 + 5 + 4 + 3 + 2 + 1 = 5² = 25', cx, 110);
      }

      // =======================================================================
      // 11. SPLIT GOLDEN DOT-MATRIX SQUARE & FACTOR TREE (Matches 00:05-00:09 of Reference Video!)
      // =======================================================================
      else if (sceneId === 'prime_factor_tree') {
        // Left Side: 8×8 Glowing Golden Dot-Matrix Square with Partition Outlines
        const dotStartX = 235;
        const dotStartY = 120;
        const spacing = 36;
        const activeLayer = Math.min(8, Math.floor(prog * 10) + 3);

        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const dx = dotStartX + c * spacing;
            const dy = dotStartY + r * spacing;
            const isLit = Math.max(r, c) < activeLayer;
            ctx.save();
            ctx.shadowColor = '#FDE047';
            ctx.shadowBlur = isLit ? 12 : 3;
            ctx.fillStyle = isLit ? '#FEF08A' : 'rgba(254, 240, 138, 0.28)';
            ctx.beginPath();
            ctx.arc(dx, dy, isLit ? 4.8 : 3.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // Glowing Dotted Sub-Squares on the Dot Matrix
        ctx.strokeStyle = '#FDE047';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 6]);
        ctx.strokeRect(dotStartX - 8, dotStartY - 8, spacing * 2 + 16, spacing * 2 + 16);
        ctx.strokeRect(dotStartX + spacing * 3 - 8, dotStartY - 8, spacing * 4 + 16, spacing * 4 + 16);
        ctx.strokeRect(dotStartX + spacing * 3 - 8, dotStartY + spacing * 5 - 8, spacing * 4 + 16, spacing * 2 + 16);
        ctx.setLineDash([]);

        // Right Side: Glowing Golden Factor Tree (100 -> 10, 10 -> 2, 2, 5, 5)
        const tx = 855;
        const ty = 130;
        ctx.strokeStyle = '#FDE047';
        ctx.lineWidth = 2.5;
        const treeEdges = [
          [tx, ty + 12, tx - 95, ty + 80],
          [tx, ty + 12, tx + 95, ty + 80],
          [tx - 95, ty + 112, tx - 145, ty + 175],
          [tx - 95, ty + 112, tx - 45, ty + 175],
          [tx + 95, ty + 112, tx + 45, ty + 175],
          [tx + 95, ty + 112, tx + 145, ty + 175],
        ];
        treeEdges.forEach(([x1, y1, x2, y2]) => {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });

        ctx.fillStyle = '#FEF08A';
        ctx.shadowColor = '#FDE047';
        ctx.shadowBlur = 14;
        ctx.font = 'bold 28px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('100', tx, ty);
        ctx.fillText('10', tx - 95, ty + 105);
        ctx.fillText('10', tx + 95, ty + 105);
        ctx.fillText('2', tx - 145, ty + 205);
        ctx.fillText('2', tx - 45, ty + 205);
        ctx.fillText('2', tx + 45, ty + 205);
        ctx.fillText('5', tx + 145, ty + 205);
        ctx.font = '21px Georgia, serif';
        ctx.fillText('{ 2 × 5 } × { 2 × 5 }  ⇒  √100 = 10', tx, ty + 248);
        ctx.shadowBlur = 0;

        // Golden Stardust Wand Sweep across the Factor Tree
        ctx.save();
        ctx.strokeStyle = '#FFFBEB';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#FDE047';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.moveTo(tx - 160, ty + 235);
        ctx.quadraticCurveTo(tx, ty + 275 + Math.sin(t * 3) * 12, tx + 175, ty + 185);
        ctx.stroke();
        ctx.restore();
      }

      // =======================================================================
      // 12. REPEATED ODD SUBTRACTION STEPPER (Module 1.4 Scene 2)
      // =======================================================================
      else if (sceneId === 'repeated_odd_subtraction') {
        const steps = [
          { eq: '25 − 1 = 24', step: 'Step 1 (Odd #1)' },
          { eq: '24 − 3 = 21', step: 'Step 2 (Odd #3)' },
          { eq: '21 − 5 = 16', step: 'Step 3 (Odd #5)' },
          { eq: '16 − 7 = 9', step: 'Step 4 (Odd #7)' },
          { eq: '9 − 9 = 0  ✓', step: 'Step 5 ⇒ √25 = 5' },
        ];
        const activeStep = Math.floor(t * 1.3) % 5;

        steps.forEach((s, idx) => {
          const y = 115 + idx * 72;
          const isCur = idx === activeStep;
          ctx.fillStyle = isCur ? 'rgba(251, 191, 36, 0.22)' : 'rgba(15, 23, 42, 0.78)';
          ctx.strokeStyle = isCur ? pal.gold : '#334155';
          ctx.lineWidth = isCur ? 3 : 1.5;
          ctx.beginPath();
          ctx.roundRect(cx - 340, y, 680, 58, 12);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isCur ? pal.gold : '#94A3B8';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(s.step, cx - 310, y + 36);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 24px monospace';
          ctx.textAlign = 'right';
          ctx.fillText(s.eq, cx + 310, y + 37);
        });
      }

      // =======================================================================
      // 13. NUMBER LINE INTERVAL BISECTION CALIPER (Module 1.4 Scene 3)
      // =======================================================================
      else if (sceneId === 'number_line_caliper') {
        const yLine = cy + 20;
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(160, yLine);
        ctx.lineTo(w - 160, yLine);
        ctx.stroke();

        const marks = [
          { n: 10, sq: 100, x: 200 },
          { n: 15, sq: 225, x: 560 },
          { n: 18, sq: 324, x: 790 },
          { n: 20, sq: 400, x: 1040 },
        ];

        // Animated Caliper Window narrowing onto 18
        const zoomP = (Math.sin(t * 1.5) + 1) / 2;
        const leftX = 200 + zoomP * 530;
        const rightX = 1040 - zoomP * 190;

        ctx.fillStyle = 'rgba(45, 212, 191, 0.16)';
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(leftX, yLine - 75, rightX - leftX, 150, 14);
        ctx.fill();
        ctx.stroke();

        marks.forEach((m) => {
          const isTarget = m.n === 18;
          ctx.fillStyle = isTarget ? pal.gold : '#1E293B';
          ctx.strokeStyle = isTarget ? '#FEF08A' : '#94A3B8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(m.x, yLine, isTarget ? 28 : 20, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isTarget ? '#0F172A' : '#FFFFFF';
          ctx.font = 'bold 16px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${m.n}`, m.x, yLine + 6);

          ctx.fillStyle = isTarget ? pal.gold : '#CBD5E1';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText(`${m.n}² = ${m.sq}`, m.x, yLine + 58);
        });
      }

      // =======================================================================
      // 14. ISOMETRIC 3D VOXEL CUBE ASSEMBLER (Module 1.5)
      // =======================================================================
      else if (sceneId === 'isometric_3d_cubes') {
        const drawIsoVoxel = (ix: number, iy: number, iz: number, size: number, colTop: string, colLeft: string, colRight: string) => {
          const sx = cx + (ix - iy) * size * 0.866;
          const sy = cy + 60 + (ix + iy) * size * 0.5 - iz * size;

          // Top diamond
          ctx.fillStyle = colTop;
          ctx.beginPath();
          ctx.moveTo(sx, sy - size);
          ctx.lineTo(sx + size * 0.866, sy - size * 0.5);
          ctx.lineTo(sx, sy);
          ctx.lineTo(sx - size * 0.866, sy - size * 0.5);
          ctx.closePath();
          ctx.fill();

          // Left face
          ctx.fillStyle = colLeft;
          ctx.beginPath();
          ctx.moveTo(sx - size * 0.866, sy - size * 0.5);
          ctx.lineTo(sx, sy);
          ctx.lineTo(sx, sy + size);
          ctx.lineTo(sx - size * 0.866, sy + size * 0.5);
          ctx.closePath();
          ctx.fill();

          // Right face
          ctx.fillStyle = colRight;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + size * 0.866, sy - size * 0.5);
          ctx.lineTo(sx + size * 0.866, sy + size * 0.5);
          ctx.lineTo(sx, sy + size);
          ctx.closePath();
          ctx.fill();
        };

        const maxVoxels = Math.min(27, Math.floor((t * 8) % 28) + 1);
        let count = 0;
        for (let z = 0; z < 3; z++) {
          for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
              if (count < maxVoxels) {
                drawIsoVoxel(
                  x - 1,
                  y - 1,
                  z,
                  42,
                  z === 2 ? '#FEF08A' : '#5EEAD4',
                  z === 2 ? '#F59E0B' : '#0D9488',
                  z === 2 ? '#D97706' : '#115E59'
                );
              }
              count++;
            }
          }
        }

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 24px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Building 3³ = 3 × 3 × 3 = ${maxVoxels} / 27 Unit Cubes`, cx, 105);
      }

      // =======================================================================
      // 15. TAXICAB 1729 DUAL-CUBE HOLOGRAM & EQUILIBRIUM (Module 1.6)
      // =======================================================================
      else if (sceneId === 'taxicab_1729_nocturne' || sceneId === 'dual_cube_balance') {
        // Center Fulcrum & Precision Brass Balance Beam
        const tilt = Math.sin(t * 2) * 0.03;
        ctx.save();
        ctx.translate(cx, cy + 120);
        ctx.fillStyle = pal.gold;
        ctx.beginPath();
        ctx.moveTo(0, -110);
        ctx.lineTo(-42, 0);
        ctx.lineTo(42, 0);
        ctx.closePath();
        ctx.fill();

        ctx.translate(0, -110);
        ctx.rotate(tilt);

        // Balance Beam
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(-310, 0);
        ctx.lineTo(310, 0);
        ctx.stroke();

        // Left Pan: 12³ + 1³ = 1728 + 1 = 1729
        ctx.fillStyle = 'rgba(45, 212, 191, 0.2)';
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(-430, -135, 240, 125, 16);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 26px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('12³ + 1³', -310, -85);
        ctx.fillStyle = pal.accent;
        ctx.font = 'bold 20px monospace';
        ctx.fillText('1728 + 1 = 1729', -310, -45);

        // Right Pan: 10³ + 9³ = 1000 + 729 = 1729
        ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.strokeStyle = pal.gold;
        ctx.beginPath();
        ctx.roundRect(190, -135, 240, 125, 16);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 26px Georgia, serif';
        ctx.fillText('10³ + 9³', 310, -85);
        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px monospace';
        ctx.fillText('1000 + 729 = 1729', 310, -45);

        ctx.restore();

        // Center Hardy-Ramanujan Taxicab Emblem
        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('HARDY–RAMANUJAN TAXICAB NUMBER: Ta(2) = 1729', cx, 110);
      }

      // =======================================================================
      // 16. FINITE DIFFERENCE PYRAMID (Module 1.7 Scene 3: 3rd Diff = 6)
      // =======================================================================
      else if (sceneId === 'difference_pyramid') {
        const levels = [
          { name: 'n³ Cubes:', vals: ['1', '8', '27', '64', '125'], col: '#FFFFFF' },
          { name: '1st Diff (Δ¹):', vals: ['7', '19', '37', '61'], col: '#38BDF8' },
          { name: '2nd Diff (Δ²):', vals: ['12', '18', '24'], col: '#2DD4BF' },
          { name: '3rd Diff (Δ³):', vals: ['6', '6'], col: '#FDE047' },
        ];

        levels.forEach((lv, r) => {
          const y = 130 + r * 82;
          ctx.fillStyle = lv.col;
          ctx.font = 'bold 17px sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(lv.name, 330, y + 8);

          const count = lv.vals.length;
          lv.vals.forEach((v, c) => {
            const x = cx + 40 + (c - (count - 1) / 2) * 130;
            ctx.fillStyle = r === 3 ? pal.gold : '#0F172A';
            ctx.strokeStyle = lv.col;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(x - 45, y - 24, 90, 48, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = r === 3 ? '#0F172A' : '#FFFFFF';
            ctx.font = 'bold 22px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(v, x, y + 8);
          });
        });
      }

      // =======================================================================
      // 17. PAPER FOLDING LOGARITHMIC ALTITUDE CURVE (Module 2.1)
      // =======================================================================
      else if (sceneId === 'paper_moon_trajectory') {
        const landmarks = [
          { f: 'Fold 0', h: '0.1 mm (Sheet)', x: 200, y: 410 },
          { f: 'Fold 10', h: '10.2 cm (Book)', x: 420, y: 375 },
          { f: 'Fold 17', h: '73 m (Qutub Minar)', x: 640, y: 305 },
          { f: 'Fold 27', h: '8,848 m (Mt. Everest)', x: 860, y: 215 },
          { f: 'Fold 42', h: '384,400 km (THE MOON)', x: 1080, y: 115 },
        ];

        // Glowing Exponential Curve
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 4;
        ctx.shadowColor = pal.gold;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        landmarks.forEach((lm, idx) => {
          if (idx === 0) ctx.moveTo(lm.x, lm.y);
          else ctx.lineTo(lm.x, lm.y);
        });
        ctx.stroke();
        ctx.shadowBlur = 0;

        const activeIdx = Math.floor(t * 1.2) % landmarks.length;
        landmarks.forEach((lm, idx) => {
          const isCur = idx === activeIdx;
          ctx.fillStyle = isCur ? pal.gold : '#0F172A';
          ctx.strokeStyle = pal.accent;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(lm.x, lm.y, isCur ? 22 : 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isCur ? pal.gold : '#FFFFFF';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(lm.f, lm.x, lm.y - 32);
          ctx.fillStyle = '#94A3B8';
          ctx.font = '14px monospace';
          ctx.fillText(lm.h, lm.x, lm.y + 38);
        });
      }

      // =======================================================================
      // 18. 64-SQUARE EXPONENTIAL CHESSBOARD (Module 2.2 / 2.3)
      // =======================================================================
      else if (sceneId === 'chessboard_exponential' || sceneId === 'exponent_laws_fusion') {
        const cols = 8;
        const rows = 2;
        const cw = 115;
        const ch = 115;
        const x0 = cx - (cols * cw) / 2;
        const y0 = cy - ch;
        const activeCell = Math.floor(t * 2) % 16;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            const x = x0 + c * cw;
            const y = y0 + r * ch;
            const isLit = idx === activeCell;

            ctx.fillStyle = isLit
              ? 'rgba(251, 191, 36, 0.3)'
              : (r + c) % 2 === 0
              ? 'rgba(30, 41, 59, 0.9)'
              : 'rgba(15, 23, 42, 0.9)';
            ctx.strokeStyle = isLit ? pal.gold : '#334155';
            ctx.lineWidth = isLit ? 3.5 : 1.5;
            ctx.strokeRect(x, y, cw, ch);
            ctx.fillRect(x, y, cw, ch);

            ctx.fillStyle = pal.gold;
            ctx.font = 'bold 20px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`2^${idx}`, x + cw / 2, y + 48);

            ctx.fillStyle = '#CBD5E1';
            ctx.font = '14px monospace';
            ctx.fillText(`${Math.pow(2, idx).toLocaleString()}`, x + cw / 2, y + 84);
          }
        }
      }

      // =======================================================================
      // 19. NEGATIVE EXPONENT HALVING STAIRCASE (Module 2.5)
      // =======================================================================
      else if (sceneId === 'negative_exponent_halving') {
        const steps = [
          { p: '2³', v: '8', h: 220 },
          { p: '2²', v: '4', h: 165 },
          { p: '2¹', v: '2', h: 120 },
          { p: '2⁰', v: '1', h: 85 },
          { p: '2⁻¹', v: '1/2', h: 55 },
          { p: '2⁻²', v: '1/4', h: 35 },
          { p: '2⁻³', v: '1/8', h: 22 },
        ];
        const bw = 125;
        const base = cy + 145;

        steps.forEach((s, idx) => {
          const x = cx - (steps.length * bw) / 2 + idx * bw;
          const isZero = s.p === '2⁰';
          ctx.fillStyle = isZero ? pal.gold : idx > 3 ? '#F472B6' : pal.accent;
          ctx.beginPath();
          ctx.roundRect(x + 8, base - s.h, bw - 16, s.h, 10);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 20px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(s.p, x + bw / 2, base - s.h - 32);
          ctx.fillStyle = isZero ? pal.gold : '#94A3B8';
          ctx.fillText(`= ${s.v}`, x + bw / 2, base - s.h - 10);
        });
      }

      // =======================================================================
      // 20. COSMIC SCALE DUAL LENS: ATOM TO GALAXY (Module 2.6 / 2.8)
      // =======================================================================
      else if (sceneId === 'cosmic_scale_dual_lens') {
        // Left Lens: Subatomic / DNA (10^-9 m)
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx - 260, cy, 145, 0, Math.PI * 2);
        ctx.stroke();

        for (let o = 0; o < 3; o++) {
          ctx.save();
          ctx.translate(cx - 260, cy);
          ctx.rotate(t * 0.8 + (o * Math.PI) / 3);
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(0, 0, 110, 38, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Quantum Scale: 10⁻¹⁰ m', cx - 260, cy + 180);

        // Right Lens: Spiral Galaxy (10^21 m)
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx + 260, cy, 145, 0, Math.PI * 2);
        ctx.stroke();

        ctx.save();
        ctx.translate(cx + 260, cy);
        ctx.rotate(t * 0.4);
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 3;
        for (let arm = 0; arm < 2; arm++) {
          ctx.rotate(Math.PI);
          ctx.beginPath();
          for (let i = 0; i < 90; i++) {
            const a = i * 0.1;
            const r = i * 1.25;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
        ctx.fillStyle = pal.gold;
        ctx.fillText('Galactic Scale: 10²¹ m', cx + 260, cy + 180);
      }

      // =======================================================================
      // 21. ANCIENT CIVILIZATIONS: STONES, LEBOMBO BONE, ROME, EGYPT, BABYLON, INDIA
      // =======================================================================
      else if (
        sceneId === 'bijection_river_stones' ||
        sceneId === 'lebombo_lunar_tally' ||
        sceneId === 'roman_marble_abacus' ||
        sceneId === 'egyptian_papyrus_lotus' ||
        sceneId === 'babylon_cuneiform_base60' ||
        sceneId === 'india_sunya_astrolabe' ||
        sceneId === 'trairasika_sanskrit_matrix'
      ) {
        if (sceneId === 'india_sunya_astrolabe' || sceneId === 'trairasika_sanskrit_matrix') {
          // Precision Astronomical Yantra (Āryabhaṭa & Brahmagupta Observatory Blueprint)
          ctx.save();
          ctx.translate(cx - 280, cy);
          for (let r = 1; r <= 3; r++) {
            ctx.strokeStyle = r === 2 ? pal.gold : pal.accent;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, r * 48, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.rotate(t * 0.5);
          for (let sp = 0; sp < 8; sp++) {
            ctx.rotate(Math.PI / 4);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(144, 0);
            ctx.stroke();
          }
          ctx.restore();

          // Illuminated Sanskrit & Mathematical Manuscript Panel on Right
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.strokeStyle = pal.gold;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.roundRect(cx - 70, cy - 145, 540, 290, 18);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = pal.gold;
          ctx.font = 'bold 22px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.fillText('Classical Indian Mathematics · Ujjain & Kusumapura', cx + 200, cy - 95);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 26px Georgia, serif';
          ctx.fillText(st.currentClip.boardFormula.slice(0, 38), cx + 200, cy - 25);

          ctx.fillStyle = pal.accent;
          ctx.font = '18px sans-serif';
          ctx.fillText(st.currentClip.visualCaption.slice(0, 52), cx + 200, cy + 45);
          ctx.fillStyle = '#94A3B8';
          ctx.fillText('0 (Śūnya) · Place Value · Trairāśika Proportion', cx + 200, cy + 95);
        } else if (sceneId === 'egyptian_papyrus_lotus') {
          const powers = [
            { p: '10⁰ = 1', name: 'Vertical Stroke', sym: '|', col: '#38BDF8' },
            { p: '10¹ = 10', name: 'Heel Bone Arch', sym: '∩', col: '#2DD4BF' },
            { p: '10² = 100', name: 'Coiled Rope Spiral', sym: '⌾', col: '#FBBF24' },
            { p: '10³ = 1,000', name: 'Nile Lotus Bloom', sym: '✿', col: '#F472B6' },
          ];
          powers.forEach((pw, idx) => {
            const x = 230 + idx * 270;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.strokeStyle = pw.col;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(x - 110, cy - 125, 220, 250, 18);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = pw.col;
            ctx.font = 'bold 64px serif';
            ctx.textAlign = 'center';
            ctx.fillText(pw.sym, x, cy - 20);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText(pw.name, x, cy + 45);
            ctx.fillStyle = pal.gold;
            ctx.font = 'bold 20px monospace';
            ctx.fillText(pw.p, x, cy + 85);
          });
        } else if (sceneId === 'babylon_cuneiform_base60') {
          const slots = [
            { pos: '60² = 3,600s Place', code: '< ▼▼ (12)', val: '12 × 3600' },
            { pos: '60¹ = 60s Place', code: '<<< ▼▼▼▼ (34)', val: '34 × 60' },
            { pos: '60⁰ = 1s Place', code: '<< ▼▼▼▼▼ (25)', val: '25 × 1' },
          ];
          slots.forEach((sl, idx) => {
            const x = 310 + idx * 330;
            ctx.fillStyle = 'rgba(67, 20, 7, 0.85)';
            ctx.strokeStyle = pal.gold;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(x - 140, cy - 115, 280, 230, 18);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = pal.gold;
            ctx.font = 'bold 28px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(sl.code, x, cy - 15);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 17px sans-serif';
            ctx.fillText(sl.pos, x, cy + 45);
            ctx.fillStyle = pal.accent;
            ctx.fillText(sl.val, x, cy + 80);
          });
        } else if (sceneId === 'roman_marble_abacus') {
          const grooves = [
            { sym: 'M', v: 1000 },
            { sym: 'D', v: 500 },
            { sym: 'C', v: 100 },
            { sym: 'L', v: 50 },
            { sym: 'X', v: 10 },
            { sym: 'V', v: 5 },
            { sym: 'I', v: 1 },
          ];
          grooves.forEach((g, idx) => {
            const x = 220 + idx * 140;
            ctx.strokeStyle = '#64748B';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x, cy - 110);
            ctx.lineTo(x, cy + 110);
            ctx.stroke();

            const beadY = cy + Math.sin(t * 2 + idx) * 55;
            ctx.fillStyle = pal.gold;
            ctx.beginPath();
            ctx.arc(x, beadY, 24, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 28px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.fillText(g.sym, x, cy - 135);
            ctx.fillStyle = pal.accent;
            ctx.font = 'bold 16px monospace';
            ctx.fillText(`${g.v}`, x, cy + 148);
          });
        } else {
          // 1-to-1 Bijection & 5-Bar Tally Bundling Blueprint
          for (let b = 0; b < 4; b++) {
            const bx = 240 + b * 240;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.strokeStyle = pal.accent;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(bx - 85, cy - 95, 170, 190, 16);
            ctx.fill();
            ctx.stroke();

            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 5;
            for (let s = 0; s < 4; s++) {
              ctx.beginPath();
              ctx.moveTo(bx - 45 + s * 30, cy - 45);
              ctx.lineTo(bx - 45 + s * 30, cy + 35);
              ctx.stroke();
            }
            ctx.strokeStyle = pal.gold;
            ctx.beginPath();
            ctx.moveTo(bx - 60, cy + 25);
            ctx.lineTo(bx + 60, cy - 35);
            ctx.stroke();

            ctx.fillStyle = pal.gold;
            ctx.font = 'bold 18px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`Bundle #${b + 1} (= ${5 * (b + 1)})`, bx, cy + 72);
          }
        }
      }

      // =======================================================================
      // 22. QUADRILATERAL GEOMETRY: DIAGONALS, 360° ROSE, COMPASS, VENN
      // =======================================================================
      else if (
        sceneId === 'quad_diagonal_triangles' ||
        sceneId === 'four_corners_360_rose' ||
        sceneId === 'compass_rhombus_kite' ||
        sceneId === 'quad_hierarchy_venn'
      ) {
        if (sceneId === 'four_corners_360_rose') {
          const sep = (1 - Math.abs(Math.sin(t * 1.3))) * 48;
          const cols = ['#F43F5E', '#F59E0B', '#10B981', '#38BDF8'];
          const degs = ['∠A = 75°', '∠B = 105°', '∠C = 85°', '∠D = 95°'];
          for (let q = 0; q < 4; q++) {
            const a0 = (q * Math.PI) / 2;
            const a1 = ((q + 1) * Math.PI) / 2;
            const mid = (a0 + a1) / 2;
            const ox = cx + Math.cos(mid) * sep;
            const oy = cy + Math.sin(mid) * sep;

            ctx.fillStyle = cols[q];
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.arc(ox, oy, 135, a0, a1);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 18px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(degs[q], ox + Math.cos(mid) * 78, oy + Math.sin(mid) * 78);
          }
        } else if (sceneId === 'quad_hierarchy_venn') {
          // Overlapping Venn Lens: Rectangles (90° Angles) ∩ Rhombuses (Equal Sides) = Squares
          ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(cx - 125, cy, 165, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
          ctx.strokeStyle = pal.gold;
          ctx.beginPath();
          ctx.arc(cx + 125, cy, 165, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 20px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('RECTANGLES', cx - 195, cy - 10);
          ctx.fillText('(All Angles 90°)', cx - 195, cy + 18);
          ctx.fillText('RHOMBUSES', cx + 195, cy - 10);
          ctx.fillText('(All Sides Equal)', cx + 195, cy + 18);
          ctx.fillStyle = pal.gold;
          ctx.font = 'bold 22px sans-serif';
          ctx.fillText('SQUARES', cx, cy - 8);
          ctx.fillText('(Both!)', cx, cy + 20);
        } else {
          // Animated Parallelogram/Rhombus with Perpendicular/Bisecting Diagonals
          const shear = Math.sin(t * 1.4) * 55;
          const pts = [
            { x: cx - 220 + shear, y: cy - 125, lbl: 'A' },
            { x: cx + 220 + shear, y: cy - 125, lbl: 'B' },
            { x: cx + 220 - shear, y: cy + 125, lbl: 'C' },
            { x: cx - 220 - shear, y: cy + 125, lbl: 'D' },
          ];
          ctx.fillStyle = 'rgba(45, 212, 191, 0.18)';
          ctx.strokeStyle = pal.accent;
          ctx.lineWidth = 4;
          ctx.beginPath();
          pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.strokeStyle = pal.gold;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          ctx.lineTo(pts[2].x, pts[2].y);
          ctx.moveTo(pts[1].x, pts[1].y);
          ctx.lineTo(pts[3].x, pts[3].y);
          ctx.stroke();

          pts.forEach((p) => {
            ctx.fillStyle = pal.gold;
            ctx.font = 'bold 22px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(p.lbl, p.x, p.y - 14);
          });
        }
      }

      // =======================================================================
      // 23. NUMBER PLAY: MODULAR RINGS, MOD 9/11 BEAM, CRYPTARITHM CIPHER
      // =======================================================================
      else if (
        sceneId === 'modular_remainder_rings' ||
        sceneId === 'digital_root_mod11_beam' ||
        sceneId === 'cryptarithm_cipher_lock'
      ) {
        if (sceneId === 'cryptarithm_cipher_lock') {
          const solved = Math.floor(t * 0.8) % 2 === 1;
          const items = [
            { c: 'E F', v: '3 7', y: cy - 95, lbl: 'Multiplicand' },
            { c: '×   E', v: '×   3', y: cy - 15, lbl: 'Multiplier' },
            { c: 'G G G', v: '1 1 1', y: cy + 85, lbl: 'Repunit Product (3 × 37)' },
          ];
          items.forEach((it) => {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.strokeStyle = solved ? '#10B981' : pal.gold;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(cx - 220, it.y - 34, 440, 68, 14);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = solved ? '#6EE7B7' : pal.gold;
            ctx.font = 'bold 34px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(solved ? it.v : it.c, cx - 40, it.y + 12);

            ctx.fillStyle = '#94A3B8';
            ctx.font = '15px sans-serif';
            ctx.fillText(it.lbl, cx + 125, it.y + 6);
          });
        } else {
          // Place-Value Decomposition: 100 = 99 + 1 and 1000 = 999 + 1
          const blocks = [
            { orig: '100', mult: '99 (9 × 11)', rem: '+ 1', y: 155 },
            { orig: '1,000', mult: '999 (9 × 111)', rem: '+ 1', y: 265 },
            { orig: 'a·100 + b·10 + c', mult: 'Multiple of 9', rem: '+ (a + b + c)', y: 375 },
          ];
          blocks.forEach((b) => {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.strokeStyle = pal.accent;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(210, b.y - 38, 860, 76, 14);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 22px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`${b.orig}  =  ${b.mult}`, 245, b.y + 8);

            ctx.fillStyle = pal.gold;
            ctx.textAlign = 'right';
            ctx.fillText(b.rem, 1035, b.y + 8);
          });
        }
      }

      // =======================================================================
      // 24. ALGEBRA DISSECTIONS: BINOMIAL AREA, DIFFERENCE OF SQUARES, STEP-K
      // =======================================================================
      else if (
        sceneId === 'binomial_area_dissection' ||
        sceneId === 'difference_squares_slider' ||
        sceneId === 'visual_pattern_step_k'
      ) {
        const sep = Math.abs(Math.sin(t * 1.3)) * 24;
        const aW = 190;
        const bW = 105;
        const x0 = cx - (aW + bW) / 2;
        const y0 = cy - (aW + bW) / 2;

        const quads = [
          { x: x0 - sep, y: y0 - sep, w: aW, h: aW, col: '#0D9488', lbl: 'a²' },
          { x: x0 + aW + sep, y: y0 - sep, w: bW, h: aW, col: '#F59E0B', lbl: 'a·b' },
          { x: x0 - sep, y: y0 + aW + sep, w: aW, h: bW, col: '#F59E0B', lbl: 'a·b' },
          { x: x0 + aW + sep, y: y0 + aW + sep, w: bW, h: bW, col: '#EC4899', lbl: 'b²' },
        ];
        quads.forEach((q) => {
          ctx.fillStyle = q.col;
          ctx.beginPath();
          ctx.roundRect(q.x, q.y, q.w, q.h, 10);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 30px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.fillText(q.lbl, q.x + q.w / 2, q.y + q.h / 2 + 10);
        });
      }

      // =======================================================================
      // 25. PROPORTIONAL REASONING: DECANTERS, HYPERBOLA GAUGE, ASPECT GRID
      // =======================================================================
      else if (
        sceneId === 'mixture_decanters' ||
        sceneId === 'inverse_hyperbola_gauge' ||
        sceneId === 'aspect_ratio_grid'
      ) {
        if (sceneId === 'inverse_hyperbola_gauge') {
          // Coordinate Axes plotting Direct Line (y = kx) vs Inverse Hyperbola (x * y = k)
          const ox = 280;
          const oy = 420;
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(ox, 100);
          ctx.lineTo(ox, oy);
          ctx.lineTo(980, oy);
          ctx.stroke();

          // Direct Line y = kx
          ctx.strokeStyle = pal.accent;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(880, 120);
          ctx.stroke();
          ctx.fillStyle = pal.accent;
          ctx.font = 'bold 18px sans-serif';
          ctx.fillText('Direct Proportion: y = k · x', 780, 115);

          // Inverse Hyperbola x * y = k
          ctx.strokeStyle = pal.gold;
          ctx.lineWidth = 4;
          ctx.beginPath();
          for (let px = 40; px <= 640; px += 10) {
            const py = 14000 / px;
            if (py <= 310) {
              if (px === 40) ctx.moveTo(ox + px, oy - py);
              else ctx.lineTo(ox + px, oy - py);
            }
          }
          ctx.stroke();
          ctx.fillStyle = pal.gold;
          ctx.fillText('Inverse Proportion: x × y = k (Speed × Time = Distance)', 720, 360);
        } else {
          // Proportional Mixture Vessels (2:3 vs 4:6)
          [
            { x: cx - 220, title: 'Ratio 2 : 3 (5 Parts)', a: 2, b: 3 },
            { x: cx + 220, title: 'Scaled 4 : 6 (10 Parts)', a: 4, b: 6 },
          ].forEach((v) => {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 4;
            ctx.strokeRect(v.x - 95, 135, 190, 260);
            ctx.fillStyle = '#F59E0B';
            ctx.fillRect(v.x - 91, 139, 182, 150);
            ctx.fillStyle = '#0D9488';
            ctx.fillRect(v.x - 91, 289, 182, 102);

            ctx.fillStyle = pal.gold;
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(v.title, v.x, 115);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`${v.b} parts Milk (60%)`, v.x, 220);
            ctx.fillText(`${v.a} parts Decoction (40%)`, v.x, 348);
          });
        }
      }

      // =======================================================================
      // 25A. 2D AREA: TRIANGLE ENCLOSURE IN RECTANGLE & OBTUSE EXTERNAL ALTITUDE
      // =======================================================================
      else if (sceneId === 'triangle_enclosure_altitude') {
        const rx = 200;
        const ry = 130;
        const rw = 420;
        const rh = 240;
        const apexX = rx + 150 + Math.sin(t * 1.1) * 70;

        // Enclosing Rectangle b x h
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.setLineDash([8, 6]);
        ctx.lineWidth = 2.5;
        ctx.strokeRect(rx, ry, rw, rh);
        ctx.setLineDash([]);

        // Shaded Triangle ABC (Exact half of b x h)
        ctx.fillStyle = 'rgba(45, 212, 191, 0.34)';
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(rx, ry + rh);
        ctx.lineTo(rx + rw, ry + rh);
        ctx.lineTo(apexX, ry);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Altitude h drop
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(apexX, ry);
        ctx.lineTo(apexX, ry + rh);
        ctx.stroke();
        ctx.strokeRect(apexX, ry + rh - 16, 16, 16);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Enclosing Rectangle = b × h', rx + rw / 2, ry - 16);
        ctx.fillStyle = pal.gold;
        ctx.fillText('Triangle Area = ½ × b × h (Regions I≡II, III≡IV)', rx + rw / 2, ry + rh + 34);

        // Right panel: Obtuse Triangle with External Altitude & Median Bisector
        const ox = 740;
        const oy = 370;
        const baseW = 210;
        const overhang = 95;
        const altH = 220;
        ctx.fillStyle = 'rgba(251, 191, 36, 0.28)';
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + baseW, oy);
        ctx.lineTo(ox + baseW + overhang, oy - altH);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Median line bisecting base
        ctx.strokeStyle = pal.rose;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(ox + baseW + overhang, oy - altH);
        ctx.lineTo(ox + baseW / 2, oy);
        ctx.stroke();

        // Extended base & External perpendicular height h
        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = '#38BDF8';
        ctx.beginPath();
        ctx.moveTo(ox + baseW, oy);
        ctx.lineTo(ox + baseW + overhang, oy);
        ctx.lineTo(ox + baseW + overhang, oy - altH);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#38BDF8';
        ctx.fillText('External Altitude h', ox + baseW + overhang + 75, oy - altH / 2);
        ctx.fillStyle = pal.rose;
        ctx.fillText('Median splits into 2 Equal Areas', ox + 130, oy + 34);
      }

      // =======================================================================
      // 25B. 2D AREA: PARALLEL LINES SHEARING & GOPAL'S RIVER REFLECTION
      // =======================================================================
      else if (sceneId === 'gopal_parallel_river_reflection') {
        // Left: Parallel Lines L1 & L2 with gliding vertex C(t)
        const lx = 120;
        const lw = 480;
        const yTop = 145;
        const yBot = 355;
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(lx, yTop);
        ctx.lineTo(lx + lw, yTop);
        ctx.moveTo(lx, yBot);
        ctx.lineTo(lx + lw, yBot);
        ctx.stroke();

        const bx1 = lx + 130;
        const bx2 = lx + 330;
        const glideX = lx + 240 + Math.sin(t * 1.5) * 170;

        // Ghost reference triangle
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath();
        ctx.moveTo(bx1, yBot);
        ctx.lineTo(bx2, yBot);
        ctx.lineTo(lx + 160, yTop);
        ctx.closePath();
        ctx.fill();

        // Live sheared triangle
        ctx.fillStyle = 'rgba(45, 212, 191, 0.35)';
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(bx1, yBot);
        ctx.lineTo(bx2, yBot);
        ctx.lineTo(glideX, yTop);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 17px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Parallel Line L₂: Gliding Apex C keeps Area = ½bh Constant!', lx + lw / 2, yTop - 18);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Fixed Base AB on L₁ (Height h = 210 units)', lx + lw / 2, yBot + 34);

        // Right: Gopal's River Reflection Shortest Path
        const rx = 680;
        const riverY = 265;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.fillRect(rx, riverY - 14, 480, 28);
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(rx, riverY);
        ctx.lineTo(rx + 480, riverY);
        ctx.stroke();

        const gopal = { x: rx + 70, y: 155 };
        const shed = { x: rx + 390, y: 185 };
        const shedRef = { x: rx + 390, y: riverY + (riverY - 185) };
        const optP = { x: rx + 250, y: riverY };

        // Straight line from Gopal to reflected shed S'
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(gopal.x, gopal.y);
        ctx.lineTo(shedRef.x, shedRef.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Actual shortest path G -> P* -> S
        ctx.strokeStyle = pal.rose;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(gopal.x, gopal.y);
        ctx.lineTo(optP.x, optP.y);
        ctx.lineTo(shed.x, shed.y);
        ctx.stroke();

        [
          { pt: gopal, label: 'Gopal (G)' },
          { pt: shed, label: 'Shed (S)' },
          { pt: shedRef, label: "Reflected S'" },
          { pt: optP, label: 'P* (Shortest)' },
        ].forEach((n) => {
          ctx.fillStyle = pal.gold;
          ctx.beginPath();
          ctx.arc(n.pt.x, n.pt.y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(n.label, n.pt.x, n.pt.y - 12);
        });
      }

      // =======================================================================
      // 25C. 2D AREA: PARALLELOGRAM CUT-AND-SLIDE TO RECTANGLE (b x h)
      // =======================================================================
      else if (sceneId === 'parallelogram_cut_slide') {
        const slideT = 0.5 - 0.5 * Math.cos(t * 1.4);
        const px = 340;
        const py = 145;
        const bWidth = 460;
        const pHeight = 230;
        const skew = 130;

        // Central trapezoidal body
        ctx.fillStyle = 'rgba(45, 212, 191, 0.34)';
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(px + skew, py);
        ctx.lineTo(px + bWidth + skew, py);
        ctx.lineTo(px + bWidth, py + pHeight);
        ctx.lineTo(px + skew, py + pHeight);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cut right-triangle translating from left to right by bWidth * slideT
        const offsetX = bWidth * slideT;
        ctx.fillStyle = 'rgba(251, 191, 36, 0.45)';
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(px + skew + offsetX, py);
        ctx.lineTo(px + offsetX, py + pHeight);
        ctx.lineTo(px + skew + offsetX, py + pHeight);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 21px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          slideT > 0.5
            ? 'Reassembled into Exact b × h Rectangle! (Area = Base × Perpendicular Height)'
            : 'Slicing Right-Triangle ΔADP Along Perpendicular Altitude h...',
          cx,
          108
        );
        ctx.fillStyle = pal.gold;
        ctx.fillText('Base b (Perpendicular Height h ≠ Slant Side s)', cx, py + pHeight + 42);
      }

      // =======================================================================
      // 25D. 2D AREA: TRAPEZIUM TWIN 180° ROTATION LOCK -> ½h(a + b)
      // =======================================================================
      else if (sceneId === 'trapezium_twin_lock') {
        const lockT = 0.5 - 0.5 * Math.cos(t * 1.25);
        const tx = 250;
        const ty = 155;
        const aTop = 220;
        const bBot = 380;
        const th = 210;
        const leftSkew = 70;

        // Original Trapezium #1
        ctx.fillStyle = 'rgba(45, 212, 191, 0.36)';
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(tx + leftSkew, ty);
        ctx.lineTo(tx + leftSkew + aTop, ty);
        ctx.lineTo(tx + bBot, ty + th);
        ctx.lineTo(tx, ty + th);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Twin Inverted Trapezium #2 sliding into lock position
        const slideOffset = (1 - lockT) * 140;
        ctx.fillStyle = 'rgba(251, 191, 36, 0.36)';
        ctx.strokeStyle = pal.gold;
        ctx.beginPath();
        ctx.moveTo(tx + leftSkew + aTop + slideOffset, ty);
        ctx.lineTo(tx + leftSkew + aTop + bBot + slideOffset, ty);
        ctx.lineTo(tx + bBot + aTop + slideOffset, ty + th);
        ctx.lineTo(tx + bBot + slideOffset, ty + th);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 21px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          'Two Congruent Trapeziums Lock into a Parallelogram of Base (a + b) & Height h',
          cx,
          112
        );
        ctx.fillStyle = pal.gold;
        ctx.fillText('Single Trapezium Area = ½ × h × (a + b)', cx, ty + th + 45);
      }

      // =======================================================================
      // 25E. 2D AREA: POLYGON SURVEYOR OFFSETS & 10,000 cm² SQUARE-UNIT GRID
      // =======================================================================
      else if (sceneId === 'polygon_surveyor_offsets') {
        // Left: Irregular Quadrilateral with Diagonal d and Perpendicular Offsets h1, h2
        const qx = 130;
        const qy = 260;
        const A = { x: qx, y: qy + 30 };
        const C = { x: qx + 430, y: qy - 20 };
        const B = { x: qx + 170, y: qy - 135 };
        const D = { x: qx + 275, y: qy + 135 };

        ctx.fillStyle = 'rgba(45, 212, 191, 0.28)';
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.lineTo(C.x, C.y);
        ctx.lineTo(D.x, D.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Surveyor baseline diagonal AC
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(C.x, C.y);
        ctx.stroke();

        // Offsets h1 & h2
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = pal.rose;
        ctx.beginPath();
        ctx.moveTo(B.x, B.y);
        ctx.lineTo(B.x, qy + 10);
        ctx.moveTo(D.x, D.y);
        ctx.lineTo(D.x, qy - 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Surveyor Baseline Diagonal d with Offsets h₁, h₂', qx + 215, 102);
        ctx.fillStyle = pal.gold;
        ctx.fillText('Area = ½ × d × (h₁ + h₂)', qx + 215, 430);

        // Right: 1 m² = 100 cm × 100 cm = 10,000 cm² Grid
        const gx = 720;
        const gy = 135;
        const gSize = 250;
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 3;
        ctx.strokeRect(gx, gy, gSize, gSize);
        const cells = Math.min(100, Math.floor(prog * 110));
        for (let r = 0; r < 10; r++) {
          for (let c = 0; c < 10; c++) {
            const idx = r * 10 + c;
            ctx.fillStyle = idx < cells ? 'rgba(251, 191, 36, 0.38)' : 'rgba(255,255,255,0.05)';
            ctx.fillRect(gx + c * 25 + 2, gy + r * 25 + 2, 21, 21);
          }
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('1 m = 100 cm  ⇒  1 m² = 100² = 10,000 cm²', gx + gSize / 2, 112);
        ctx.fillStyle = pal.gold;
        ctx.fillText('1 Hectare = 100 m × 100 m = 10,000 m²', gx + gSize / 2, gy + gSize + 36);
      }

      // =======================================================================
      // 25F. PART II CH 1: PERCENTAGE 10x10 HUNDRED-GRID & COMPOUND CURVE
      // =======================================================================
      else if (sceneId === 'percentage_hundred_bar') {
        const gx = 160;
        const gy = 130;
        const pct = 75;
        const activeCells = Math.floor(pct * Math.min(1, prog * 1.3));
        for (let r = 0; r < 10; r++) {
          for (let c = 0; c < 10; c++) {
            const idx = r * 10 + c;
            ctx.fillStyle = idx < activeCells ? pal.accent : 'rgba(255,255,255,0.08)';
            ctx.fillRect(gx + c * 26, gy + r * 26, 23, 23);
          }
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 19px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Per Cent (Out of 100): ¾ = 0.75 = 75%', gx + 130, gy - 16);

        // Right: Simple vs Compound Growth Curve P(1 + r/100)^n
        const cx0 = 580;
        const cy0 = 380;
        const cw = 520;
        const ch = 240;
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx0, cy0 - ch);
        ctx.lineTo(cx0, cy0);
        ctx.lineTo(cx0 + cw, cy0);
        ctx.stroke();

        // Linear Simple Interest
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx0, cy0 - 30);
        ctx.lineTo(cx0 + cw, cy0 - 130);
        ctx.stroke();

        // Exponential Compound Growth
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let i = 0; i <= 40; i++) {
          const u = i / 40;
          const px = cx0 + u * cw;
          const py = cy0 - 30 * Math.pow(2.2, u);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.fillStyle = pal.gold;
        ctx.fillText('Compound Growth A = P(1 + R/100)ⁿ vs Linear Simple Interest', cx0 + cw / 2, 118);
      }

      // =======================================================================
      // 25G. PART II CH 2: BAUDHAYANA-PYTHAGORAS SQUARES & THEODORUS SPIRAL
      // =======================================================================
      else if (sceneId === 'baudhayana_right_triangle_squares') {
        const bx = 260;
        const by = 290;
        const a = 96; // 3 * 32
        const b = 128; // 4 * 32

        // Right triangle (3-4-5)
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + b, by);
        ctx.lineTo(bx, by - a);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Square a^2 on left leg
        ctx.fillStyle = 'rgba(45, 212, 191, 0.32)';
        ctx.strokeStyle = pal.accent;
        ctx.fillRect(bx - a, by - a, a, a);
        ctx.strokeRect(bx - a, by - a, a, a);

        // Square b^2 on bottom leg
        ctx.fillStyle = 'rgba(251, 191, 36, 0.32)';
        ctx.strokeStyle = pal.gold;
        ctx.fillRect(bx, by, b, b);
        ctx.strokeRect(bx, by, b, b);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('a² = 9', bx - a / 2, by - a / 2);
        ctx.fillText('b² = 16', bx + b / 2, by + b / 2);
        ctx.fillStyle = pal.gold;
        ctx.fillText('Baudhāyana Śulba-Sūtra: a² + b² = c² (9 + 16 = 25)', bx + 60, 115);

        // Right: Spiral of Theodorus (√1, √2, √3, ... √12)
        const sx = 880;
        const sy = 265;
        let angle = 0;
        const scale = 42;
        for (let n = 1; n <= 10; n++) {
          const r1 = Math.sqrt(n) * scale;
          const dTheta = Math.atan(1 / Math.sqrt(n));
          const x1 = sx + r1 * Math.cos(angle);
          const y1 = sy - r1 * Math.sin(angle);
          const x2 = sx + Math.sqrt(n + 1) * scale * Math.cos(angle + dTheta);
          const y2 = sy - Math.sqrt(n + 1) * scale * Math.sin(angle + dTheta);

          ctx.fillStyle = `hsla(${(n * 34) % 360}, 80%, 60%, 0.28)`;
          ctx.strokeStyle = pal.accent;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          angle += dTheta;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Spiral of Theodorus: √1, √2, √3, √4 ... √n', sx, 115);
      }

      // =======================================================================
      // 25H. PART II CH 3: 360° PIE CHART SECTORS & CARTOGRAPHY MAP SCALE
      // =======================================================================
      else if (sceneId === 'pie_chart_360_sector') {
        const px = 340;
        const py = 265;
        const rad = 135;
        const slices = [
          { label: '40% (144°)', frac: 0.4, color: '#2DD4BF' },
          { label: '25% (90°)', frac: 0.25, color: '#FBBF24' },
          { label: '20% (72°)', frac: 0.2, color: '#38BDF8' },
          { label: '15% (54°)', frac: 0.15, color: '#FB7185' },
        ];
        let startA = -Math.PI / 2;
        slices.forEach((sl) => {
          const sweep = sl.frac * Math.PI * 2 * Math.min(1, prog * 1.25);
          ctx.fillStyle = sl.color;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.arc(px, py, rad, startA, startA + sweep);
          ctx.closePath();
          ctx.fill();
          startA += sweep;
        });
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Sector Angle θ = (Value / Total) × 360°', px, 105);

        // Right: Map Scale Coordinate Grid
        const mx = 680;
        const my = 140;
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(mx, my, 420, 240);
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(mx + 60, my + 180);
        ctx.lineTo(mx + 350, my + 65);
        ctx.stroke();
        ctx.fillStyle = pal.gold;
        ctx.fillText('Map Scale 1 : 50,000  (1 cm = 0.5 km)', mx + 210, 105);
      }

      // =======================================================================
      // 25I. PART II CH 4: SIERPINSKI CARPET/GASKET & KOCH SNOWFLAKE FRACTALS
      // =======================================================================
      else if (sceneId === 'fractal_sierpinski_koch') {
        const fx = 220;
        const fy = 130;
        const fSize = 255;

        const drawCarpet = (x: number, y: number, s: number, depth: number) => {
          if (depth === 0) {
            ctx.fillStyle = pal.accent;
            ctx.fillRect(x, y, s - 1, s - 1);
            return;
          }
          const sub = s / 3;
          for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
              if (r === 1 && c === 1) continue;
              drawCarpet(x + c * sub, y + r * sub, sub, depth - 1);
            }
          }
        };
        drawCarpet(fx, fy, fSize, 2);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Sierpinski Carpet: 8ⁿ Squares, Area × (8/9)ⁿ', fx + fSize / 2, 108);
        ctx.fillStyle = pal.gold;
        ctx.fillText('Koch Snowflake Perimeter × (4/3)ⁿ → ∞ Inside Finite Area!', 880, 108);

        // Right: Sierpinski Gasket Triangle
        const drawGasket = (x: number, y: number, s: number, d: number) => {
          if (d === 0) {
            ctx.fillStyle = pal.gold;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + s, y);
            ctx.lineTo(x + s / 2, y - s * 0.866);
            ctx.closePath();
            ctx.fill();
            return;
          }
          const h2 = s / 2;
          drawGasket(x, y, h2, d - 1);
          drawGasket(x + h2, y, h2, d - 1);
          drawGasket(x + h2 / 2, y - h2 * 0.866, h2, d - 1);
        };
        drawGasket(740, 385, 280, 3);
      }

      // =======================================================================
      // 25J. PART II CH 4: UNFOLDED CUBOID NET & HUNGRY ANT SHORTEST GEODESIC
      // =======================================================================
      else if (sceneId === 'cuboid_net_hungry_ant') {
        const nx = 260;
        const ny = 150;
        const cell = 68;
        // Cross Cube Net (6 faces)
        const faces = [
          { c: 1, r: 0, label: 'TOP' },
          { c: 0, r: 1, label: 'LEFT' },
          { c: 1, r: 1, label: 'FRONT' },
          { c: 2, r: 1, label: 'RIGHT' },
          { c: 3, r: 1, label: 'BACK' },
          { c: 1, r: 2, label: 'BASE' },
        ];
        faces.forEach((f) => {
          ctx.fillStyle = 'rgba(45, 212, 191, 0.25)';
          ctx.strokeStyle = pal.accent;
          ctx.lineWidth = 3;
          ctx.fillRect(nx + f.c * cell, ny + f.r * cell, cell, cell);
          ctx.strokeRect(nx + f.c * cell, ny + f.r * cell, cell, cell);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(f.label, nx + (f.c + 0.5) * cell, ny + (f.r + 0.55) * cell);
        });

        // Hungry Ant Geodesic Straight Line across unfolded faces
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(nx + cell, ny + cell * 2);
        ctx.lineTo(nx + cell * 3, ny + cell);
        ctx.stroke();

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 19px sans-serif';
        ctx.fillText(
          'Unfolded Surface Net: Shortest Geodesic d = √((l+h)² + w²) = 40 cm',
          cx,
          112
        );
      }

      // =======================================================================
      // 25K. PART II CH 5: MEAN SEESAW FULCRUM & MULTI-LINE TIME-SERIES GRAPH
      // =======================================================================
      else if (sceneId === 'mean_fulcrum_line_graph') {
        const bx = 330;
        const by = 290;
        const tilt = Math.sin(t * 1.8) * 0.04;
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(tilt);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-190, 0);
        ctx.lineTo(190, 0);
        ctx.stroke();

        [-140, -60, 50, 150].forEach((dx, idx) => {
          ctx.fillStyle = dx < 0 ? '#38BDF8' : pal.rose;
          ctx.fillRect(dx - 18, -36, 36, 36);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 13px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(['12', '16', '23', '29'][idx], dx, -14);
        });
        ctx.restore();

        // Fulcrum Triangle at Mean x-bar = 20
        ctx.fillStyle = pal.gold;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx - 28, by + 48);
        ctx.lineTo(bx + 28, by + 48);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Mean x̄ = 20 · Fulcrum where Σ(Left Deviations) = Σ(Right Deviations)', bx, 118);

        const gx = 680;
        const gy = 340;
        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        [0, 1, 2, 3, 4, 5].forEach((i) => {
          const px = gx + i * 76;
          const py = gy - [40, 95, 75, 145, 130, 185][i];
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
        ctx.fillStyle = pal.gold;
        ctx.fillText('Deviation Balance & Trend Trajectory', gx + 190, 118);
      }

      // =======================================================================
      // 25L. PART II CH 1: MENTAL PERCENT DECOMPOSER (10%, 5%, 1% Building Blocks)
      // =======================================================================
      else if (sceneId === 'mental_percent_decomposer') {
        const blocks = [
          { label: '100% Base Value', pct: '100%', val: '₹840', w: 540, color: '#38BDF8' },
          { label: '10% Block (÷10)', pct: '10%', val: '₹84', w: 280, color: '#F59E0B' },
          { label: '5% Block (Half of 10%)', pct: '5%', val: '₹42', w: 190, color: '#10B981' },
          { label: '1% Block (÷100)', pct: '1%', val: '₹8.40', w: 110, color: '#EC4899' },
        ];
        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Mental Percentage Decomposer · Build Any % from 10%, 5%, 1%', cx, 96);

        blocks.forEach((b, i) => {
          const y = 130 + i * 62;
          const pulseW = b.w * (0.94 + 0.06 * Math.sin(t * 2.2 + i));
          ctx.fillStyle = 'rgba(255,255,255,0.06)';
          ctx.beginPath();
          ctx.roundRect(220, y, 560, 44, 10);
          ctx.fill();

          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.roundRect(220, y, pulseW, 44, 10);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(`${b.label} = ${b.val}`, 238, y + 28);
        });

        // Right Synthesis Box: 15% = 10% + 5%
        ctx.fillStyle = 'rgba(253, 224, 71, 0.14)';
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(820, 145, 290, 210, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 19px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Instant Synthesis', 965, 185);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 17px monospace';
        ctx.fillText('15% = 10% + 5%', 965, 225);
        ctx.fillText('= ₹84 + ₹42 = ₹126', 965, 260);
        ctx.fillStyle = '#6EE7B7';
        ctx.fillText('99% = 100% − 1%', 965, 305);
        ctx.fillText('= ₹840 − ₹8.40', 965, 335);
      }

      // =======================================================================
      // 25M. PART II CH 1: RETAIL PRICE WATERFALL (CP → MP → Discount → SP → GST)
      // =======================================================================
      else if (sceneId === 'retail_price_waterfall') {
        const stages = [
          { name: 'Cost Price (CP)', amt: '₹1,000', h: 150, tag: 'Base Cost', col: '#64748B' },
          { name: 'Marked Price (MP)', amt: '₹1,400', h: 210, tag: '+40% Markup', col: '#38BDF8' },
          { name: 'Discount (−20%)', amt: '−₹280', h: 168, tag: 'On MP!', col: '#F43F5E' },
          { name: 'Selling Price (SP)', amt: '₹1,120', h: 168, tag: '+12% Profit', col: '#10B981' },
          { name: 'Final Bill (+18% GST)', amt: '₹1,321.60', h: 198, tag: '+₹201.60 Tax', col: '#F59E0B' },
        ];
        const baseY = 385;
        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Commercial Price Waterfall · Cost → Markup → Discount → Selling Price → GST', cx, 95);

        stages.forEach((stItem, idx) => {
          const x = 165 + idx * 198;
          const animH = stItem.h * Math.min(1, prog * 1.8 + 0.35);
          ctx.fillStyle = stItem.col;
          ctx.strokeStyle = '#FEF08A';
          ctx.lineWidth = idx === sIdx % stages.length ? 3 : 1.5;
          ctx.beginPath();
          ctx.roundRect(x, baseY - animH, 145, animH, 12);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 17px monospace';
          ctx.fillText(stItem.amt, x + 72, baseY - animH - 12);
          ctx.fillStyle = '#FEF08A';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(stItem.tag, x + 72, baseY - animH / 2 + 4);
          ctx.fillStyle = '#E2E8F0';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(stItem.name, x + 72, baseY + 24);
        });
      }

      // =======================================================================
      // 25N. PART II CH 1: COMPOUND INTEREST SNOWBALL vs LINEAR SIMPLE INTEREST
      // =======================================================================
      else if (sceneId === 'compound_snowball_curve') {
        const ox = 200;
        const oy = 375;
        const gw = 640;
        const gh = 240;

        ctx.strokeStyle = 'rgba(255,255,255,0.28)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ox, oy - gh);
        ctx.lineTo(ox, oy);
        ctx.lineTo(ox + gw, oy);
        ctx.stroke();

        // Simple Interest Line (P + P*r*t)
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        for (let yr = 0; yr <= 5; yr++) {
          const x = ox + (yr / 5) * gw;
          const y = oy - ((1 + 0.18 * yr - 1) / 1.5) * gh - 30;
          if (yr === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Compound Growth Curve P(1 + r)^t
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let yr = 0; yr <= 5; yr++) {
          const x = ox + (yr / 5) * gw;
          const factor = Math.pow(1.18, yr);
          const y = oy - ((factor - 1) / 1.5) * gh - 30;
          if (yr === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        for (let yr = 0; yr <= 5; yr++) {
          const x = ox + (yr / 5) * gw;
          const factor = Math.pow(1.18, yr);
          const y = oy - ((factor - 1) / 1.5) * gh - 30;
          ctx.fillStyle = pal.gold;
          ctx.beginPath();
          ctx.arc(x, y, 6 + yr * 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`Yr ${yr}`, x, oy + 22);
        }

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 19px Georgia, serif';
        ctx.fillText('Compound Multiplier A = P(1 + R/100)ⁿ vs Linear Simple Interest', cx, 95);
        ctx.fillStyle = '#FEF08A';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('Interest-on-Interest Snowball: ×1.18 Every Year', 990, 230);
      }

      // =======================================================================
      // 25O. PART II CH 1: ARTHASHASTRA TREASURY LEDGER & SUCCESSIVE % MULTIPLIER
      // =======================================================================
      else if (sceneId === 'arthashastra_treasury_ledger') {
        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Successive Percentage Multiplier · Why +20% then −20% = 96% (Not 100%!)', cx, 96);

        const boxes = [
          { x: 210, title: 'Start Base', val: '100', sub: 'Original Value (1.00)', col: '#38BDF8' },
          { x: 520, title: 'After +20% Rise', val: '120', sub: '100 × 1.20 = 120', col: '#10B981' },
          { x: 830, title: 'After −20% Drop on 120', val: '96', sub: '120 × 0.80 = 96 (−4% Net!)', col: '#F59E0B' },
        ];
        boxes.forEach((b, i) => {
          ctx.fillStyle = 'rgba(28, 17, 7, 0.9)';
          ctx.strokeStyle = b.col;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(b.x, 155, 250, 195, 18);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = b.col;
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText(b.title, b.x + 125, 192);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 44px Georgia, serif';
          ctx.fillText(b.val, b.x + 125, 265);
          ctx.fillStyle = '#FEF08A';
          ctx.font = 'bold 14px monospace';
          ctx.fillText(b.sub, b.x + 125, 318);

          if (i < 2) {
            ctx.strokeStyle = pal.gold;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(b.x + 258, 250);
            ctx.lineTo(b.x + 302, 250);
            ctx.stroke();
          }
        });
      }

      // =======================================================================
      // 25P. PART II CH 2: ŚULBA-SŪTRA ALTAR SQUARE DOUBLER (Diagonal = √2 · a)
      // =======================================================================
      else if (sceneId === 'sulba_altar_square_doubler') {
        const sx = 310;
        const sy = 165;
        const side = 150;

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Baudhāyana Śulba-Sūtra (800 BCE) · Dvikaraṇī Diagonal Square Doubler', cx, 95);

        // Base square a × a
        ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 3;
        ctx.fillRect(sx, sy, side, side);
        ctx.strokeRect(sx, sy, side, side);

        // Diagonal cord
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(sx, sy + side);
        ctx.lineTo(sx + side, sy);
        ctx.stroke();

        // Tilted Square of Area 2a^2 built on the diagonal!
        ctx.save();
        ctx.translate(770, 255);
        ctx.rotate(-Math.PI / 4 + Math.sin(t * 1.2) * 0.04);
        const diag = side * Math.SQRT2 * 0.78;
        ctx.fillStyle = 'rgba(245, 158, 11, 0.24)';
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 3.5;
        ctx.fillRect(-diag / 2, -diag / 2, diag, diag);
        ctx.strokeRect(-diag / 2, -diag / 2, diag, diag);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px Georgia, serif';
        ctx.fillText('Area = 2a²', 0, -6);
        ctx.fillStyle = '#FEF08A';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('Side = a√2', 0, 20);
        ctx.restore();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 17px sans-serif';
        ctx.fillText('Unit Altar Square (Area = a²)', sx + side / 2, sy + side + 36);
        ctx.fillStyle = pal.gold;
        ctx.fillText('Diagonal Square (Area = a² + a² = 2a²)', 770, sy + side + 36);
      }

      // =======================================================================
      // 25Q. PART II CH 2: 12-KNOT HARPEDONAPTAE CORD & (2m, m²−1, m²+1) TRIPLES
      // =======================================================================
      else if (sceneId === 'knotted_cord_triples') {
        const ax = 240;
        const ay = 345;
        const bx = 520;
        const by = 345;
        const tx = 240;
        const ty = 135;

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('12-Knot Cord & Baudhāyana Triple Generator (2m, m² − 1, m² + 1)', cx, 95);

        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.lineTo(tx, ty);
        ctx.closePath();
        ctx.stroke();

        // Right-angle square marker
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 3;
        ctx.strokeRect(ax, ay - 26, 26, 26);

        // Draw glowing knots along 3-4-5 sides
        for (let k = 0; k <= 4; k++) {
          const kx = ax + (k / 4) * (bx - ax);
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(kx, ay, 7, 0, Math.PI * 2);
          ctx.fill();
        }
        for (let k = 0; k <= 3; k++) {
          const ky = ay - (k / 3) * (ay - ty);
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(ax, ky, 7, 0, Math.PI * 2);
          ctx.fill();
        }
        for (let k = 0; k <= 5; k++) {
          const kx = tx + (k / 5) * (bx - tx);
          const ky = ty + (k / 5) * (by - ty);
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(kx, ky, 7, 0, Math.PI * 2);
          ctx.fill();
        }

        // Right table of primitive triples
        const triples = [
          'm = 2  →  (3, 4, 5)      ·  9 + 16 = 25',
          'm = 3  →  (6, 8, 10)     ·  36 + 64 = 100',
          'm = 4  →  (8, 15, 17)    ·  64 + 225 = 289',
          'b = 12 →  (5, 12, 13)    ·  25 + 144 = 169',
        ];
        triples.forEach((tr, i) => {
          const ry = 165 + i * 52;
          ctx.fillStyle = 'rgba(255,255,255,0.07)';
          ctx.strokeStyle = i === sIdx % triples.length ? pal.gold : 'rgba(255,255,255,0.2)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(630, ry - 26, 460, 42, 10);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FEF08A';
          ctx.font = 'bold 16px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(tr, 652, ry);
        });
      }

      // =======================================================================
      // 25R. PART II CH 2: BHĀSKARA'S SWAYING LOTUS IN THE POND (Lilavati Proof)
      // =======================================================================
      else if (sceneId === 'bhaskara_lotus_pond') {
        const waterY = 255;
        const rootX = 430;
        const rootY = 395;
        const swayX = rootX + 185 + Math.sin(t * 1.5) * 14;

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Bhāskara II’s Lilāvati Lotus Puzzle · Depth x, Wind Drift b, Stem x + h', cx, 95);

        // Water surface wave
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(180, waterY);
        ctx.lineTo(750, waterY);
        ctx.stroke();

        // Vertical stem (x + h)
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(rootX, rootY);
        ctx.lineTo(rootX, waterY - 65);
        ctx.stroke();
        ctx.setLineDash([]);

        // Tilted stem touching water at swayX
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(rootX, rootY);
        ctx.lineTo(swayX, waterY);
        ctx.lineTo(rootX, waterY);
        ctx.closePath();
        ctx.stroke();

        // Glowing Lotus Blossom
        ctx.fillStyle = '#F472B6';
        ctx.beginPath();
        ctx.arc(swayX, waterY - 8, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rootX, waterY - 72, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('Depth = x', rootX - 58, (rootY + waterY) / 2);
        ctx.fillText('Drift b = 21', (rootX + swayX) / 2, waterY - 14);
        ctx.fillStyle = pal.gold;
        ctx.fillText('Hypotenuse = x + h', (rootX + swayX) / 2 + 45, (rootY + waterY) / 2 + 18);

        // Right algebraic cancellation card
        ctx.fillStyle = 'rgba(28, 17, 7, 0.9)';
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(770, 155, 340, 210, 16);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 17px monospace';
        ctx.fillText('x² + b² = (x + h)²', 940, 198);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('x² + b² = x² + 2xh + h²', 940, 240);
        ctx.fillStyle = '#6EE7B7';
        ctx.fillText('x² cancels on both sides!', 940, 282);
        ctx.fillStyle = '#FEF08A';
        ctx.fillText('2xh = b² − h²', 940, 326);
      }

      // =======================================================================
      // 25S. PART II CH 2: SPIRAL OF THEODORUS (√1, √2, √3, √4, √5, √6...)
      // =======================================================================
      else if (sceneId === 'theodorus_root_spiral') {
        const ox = 420;
        const oy = 265;
        const scale = 68;
        let angle = 0;

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Spiral of Theodorus · Constructing √2, √3, √4, √5, √6 by Unit Right Triangles', cx, 95);

        for (let n = 1; n <= 7; n++) {
          const r1 = Math.sqrt(n) * scale;
          const nextAngle = angle + Math.atan(1 / Math.sqrt(n));
          const x1 = ox + Math.cos(angle) * r1;
          const y1 = oy - Math.sin(angle) * r1;
          const r2 = Math.sqrt(n + 1) * scale;
          const x2 = ox + Math.cos(nextAngle) * r2;
          const y2 = oy - Math.sin(nextAngle) * r2;

          ctx.fillStyle = `hsla(${38 + n * 24}, 85%, 55%, 0.22)`;
          ctx.strokeStyle = n === (sIdx % 7) + 1 ? '#FEF08A' : pal.accent;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 14px monospace';
          ctx.fillText(`√${n + 1}`, (ox + x2) / 2, (oy + y2) / 2);
          angle = nextAngle;
        }

        ctx.fillStyle = '#FEF08A';
        ctx.font = 'bold 17px monospace';
        ctx.fillText('(√n)² + 1² = n + 1  ⇒  Hypotenuse = √(n + 1)', 895, 255);
      }

      // =======================================================================
      // 25T. PART II CH 3: CARTOGRAPHY MAP SCALE & AREA k² MAGNIFIER
      // =======================================================================
      else if (sceneId === 'cartography_map_scale_compass') {
        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Cartographic Scale Factor (RF) · Linear Scale ×k vs Area Scale ×k²', cx, 95);

        // Left: Map Blueprint (1 cm = 5 km)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 3;
        ctx.strokeRect(220, 165, 160, 160);
        ctx.fillRect(220, 165, 160, 160);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('Map Blueprint', 300, 148);
        ctx.fillText('4 cm × 4 cm = 16 cm²', 300, 250);

        // Right: Real-World Ground Grid (k^2 = 25 km^2 per cm^2)
        const gx = 580;
        const gy = 140;
        const cell = 46;
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 5; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? 'rgba(245, 158, 11, 0.28)' : 'rgba(16, 185, 129, 0.22)';
            ctx.strokeStyle = pal.gold;
            ctx.lineWidth = 1.5;
            ctx.fillRect(gx + c * cell, gy + r * cell, cell, cell);
            ctx.strokeRect(gx + c * cell, gy + r * cell, cell, cell);
          }
        }
        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 17px monospace';
        ctx.fillText('1 cm = 5 km  ⇒  1 cm² = 25 km² (k²!)', 965, 225);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('16 cm² × 25 = 400 km²', 965, 265);
      }

      // =======================================================================
      // 25U. PART II CH 3: HARMONIC GEAR TRAIN & WORK-TIME RECIPROCAL BALANCE
      // =======================================================================
      else if (sceneId === 'harmonic_gear_train') {
        const g1x = 410;
        const g1y = 260;
        const r1 = 88;
        const g2x = g1x + r1 + 58;
        const g2y = 260;
        const r2 = 54;

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Inverse & Reciprocal Rates · Teeth × RPM = Constant · (1/A + 1/B) Combined Rate', cx, 95);

        // Gear 1 (Slow, many teeth)
        ctx.save();
        ctx.translate(g1x, g1y);
        ctx.rotate(t * 0.9);
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, r1, 0, Math.PI * 2);
        ctx.stroke();
        for (let k = 0; k < 12; k++) {
          const a = (k / 12) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * (r1 - 12), Math.sin(a) * (r1 - 12));
          ctx.lineTo(Math.cos(a) * (r1 + 12), Math.sin(a) * (r1 + 12));
          ctx.stroke();
        }
        ctx.restore();

        // Gear 2 (Fast, fewer teeth)
        ctx.save();
        ctx.translate(g2x, g2y);
        ctx.rotate(-t * 0.9 * (12 / 8));
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, r2, 0, Math.PI * 2);
        ctx.stroke();
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * (r2 - 10), Math.sin(a) * (r2 - 10));
          ctx.lineTo(Math.cos(a) * (r2 + 10), Math.sin(a) * (r2 + 10));
          ctx.stroke();
        }
        ctx.restore();

        ctx.fillStyle = '#FEF08A';
        ctx.font = 'bold 17px monospace';
        ctx.fillText('x₁ · y₁ = x₂ · y₂ = k', 875, 220);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Combined Rate = 1/t₁ + 1/t₂', 875, 265);
      }

      // =======================================================================
      // 25V. PART II CH 4: ŚIKHARA TEMPLE & MENGER CARPET SELF-SIMILARITY (8^n)
      // =======================================================================
      else if (sceneId === 'sikhara_temple_self_similarity') {
        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Self-Similar Architecture · Śikhara Urushringas & Menger Carpet (8ⁿ Squares)', cx, 95);

        // Left: Recursive Temple Tower Tiers
        const tx = 340;
        for (let tier = 0; tier < 4; tier++) {
          const wTier = 220 - tier * 44;
          const yTier = 335 - tier * 52;
          ctx.fillStyle = `rgba(245, 158, 11, ${0.22 + tier * 0.12})`;
          ctx.strokeStyle = pal.gold;
          ctx.lineWidth = 2.5;
          ctx.fillRect(tx - wTier / 2, yTier, wTier, 46);
          ctx.strokeRect(tx - wTier / 2, yTier, wTier, 46);
        }

        // Right: 3x3 Menger Carpet Subdivision (8^n remaining squares)
        const mx = 680;
        const my = 145;
        const mSize = 225;
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(mx, my, mSize, mSize);
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const subX = mx + c * 75;
            const subY = my + r * 75;
            if (r === 1 && c === 1) {
              ctx.fillStyle = '#090D16';
              ctx.fillRect(subX + 4, subY + 4, 67, 67);
            } else {
              for (let sr = 0; sr < 3; sr++) {
                for (let sc = 0; sc < 3; sc++) {
                  ctx.fillStyle = sr === 1 && sc === 1 ? '#090D16' : 'rgba(56, 189, 248, 0.45)';
                  ctx.fillRect(subX + sc * 25 + 2, subY + sr * 25 + 2, 21, 21);
                }
              }
            }
          }
        }
        ctx.fillStyle = '#FEF08A';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('Step 0: 1 · Step 1: 8 · Step 2: 64 · Step n: 8ⁿ', 792, 402);
      }

      // =======================================================================
      // 25W. PART II CH 4: ORTHOGRAPHIC 3-VIEW SHADOW PROJECTOR (Front, Top, Side)
      // =======================================================================
      else if (sceneId === 'orthographic_shadow_projector') {
        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Orthographic Engineering Views · Front Elevation, Top Plan & Side Profile', cx, 95);

        const views = [
          { title: 'Front View (Elevation)', x: 205, grid: [[1, 0, 0], [1, 1, 0], [1, 1, 1]], col: '#F59E0B' },
          { title: 'Top View (Plan)', x: 525, grid: [[1, 1, 1], [1, 1, 0], [1, 0, 0]], col: '#38BDF8' },
          { title: 'Side View (Profile)', x: 845, grid: [[0, 0, 1], [0, 1, 1], [1, 1, 1]], col: '#10B981' },
        ];
        views.forEach((v) => {
          ctx.fillStyle = v.col;
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText(v.title, v.x + 84, 148);
          for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
              const on = v.grid[r][c] === 1;
              ctx.fillStyle = on ? v.col : 'rgba(255,255,255,0.05)';
              ctx.strokeStyle = 'rgba(255,255,255,0.28)';
              ctx.lineWidth = 2;
              ctx.fillRect(v.x + c * 56, 168 + r * 56, 52, 52);
              ctx.strokeRect(v.x + c * 56, 168 + r * 56, 52, 52);
            }
          }
        });
      }

      // =======================================================================
      // 25X. PART II CH 5: ROBUST MEDIAN vs OUTLIER-SENSITIVE MEAN PODIUM
      // =======================================================================
      else if (sceneId === 'mean_vs_median_podium') {
        const vals = [12, 14, 15, 16, 18, 20, 95];
        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Outlier Robustness · Why One Extreme Value Pulls the Mean While Median Stands Firm', cx, 95);

        vals.forEach((v, idx) => {
          const x = 195 + idx * 128;
          const h = Math.min(210, v * 2.1);
          const isMedian = idx === 3;
          const isOutlier = idx === 6;
          ctx.fillStyle = isMedian ? '#10B981' : isOutlier ? '#F43F5E' : '#38BDF8';
          ctx.beginPath();
          ctx.roundRect(x, 365 - h, 82, h, 10);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 17px monospace';
          ctx.fillText(String(v), x + 41, 365 - h - 12);
          ctx.fillStyle = '#FEF08A';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(isMedian ? 'MEDIAN (16)' : isOutlier ? 'OUTLIER!' : `#${idx + 1}`, x + 41, 390);
        });
      }

      // =======================================================================
      // 25Y. PART II CH 5: 5-NUMBER SUMMARY & BOX-AND-WHISKER QUARTILE PLOT
      // =======================================================================
      else if (sceneId === 'quartile_boxplot_whisker') {
        const y = 245;
        const minX = 220;
        const q1X = 410;
        const medX = 580;
        const q3X = 770;
        const maxX = 980;

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('5-Number Summary & Box-and-Whisker Plot · IQR = Q₃ − Q₁ (Middle 50%)', cx, 95);

        // Whiskers
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(minX, y);
        ctx.lineTo(q1X, y);
        ctx.moveTo(q3X, y);
        ctx.lineTo(maxX, y);
        ctx.stroke();

        // Interquartile Box [Q1, Q3]
        ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 3.5;
        ctx.fillRect(q1X, y - 55, q3X - q1X, 110);
        ctx.strokeRect(q1X, y - 55, q3X - q1X, 110);

        // Median Divider
        ctx.strokeStyle = pal.gold;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(medX, y - 55);
        ctx.lineTo(medX, y + 55);
        ctx.stroke();

        [
          { x: minX, lbl: 'Min (12)' },
          { x: q1X, lbl: 'Q₁ (24)' },
          { x: medX, lbl: 'Median Q₂ (35)' },
          { x: q3X, lbl: 'Q₃ (48)' },
          { x: maxX, lbl: 'Max (64)' },
        ].forEach((pt) => {
          ctx.fillStyle = '#FEF08A';
          ctx.font = 'bold 15px monospace';
          ctx.fillText(pt.lbl, pt.x, y + 88);
        });
      }

      // =======================================================================
      // 25Z. PART II CH 5: DIGITAL SPREADSHEET FORMULA MATRIX (A1:C5, =AVERAGE)
      // =======================================================================
      else if (sceneId === 'spreadsheet_formula_matrix') {
        const sx = 240;
        const sy = 135;
        const cw = 180;
        const ch = 46;
        const rows = [
          ['Cell', 'City Station', 'Temp (°C)', 'Formula / Output'],
          ['Row 2', 'Chennai', '34', 'B2 = 34'],
          ['Row 3', 'Bengaluru', '26', 'B3 = 26'],
          ['Row 4', 'Shimla', '15', 'B4 = 15'],
          ['Row 5', 'Summary', '25.0', '=AVERAGE(B2:B4)'],
        ];

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Digital Spreadsheet Grid · Dynamic Cell Ranges & Live Formulas', cx, 95);

        rows.forEach((r, ri) => {
          r.forEach((cellTxt, ci) => {
            const x = sx + ci * cw;
            const y = sy + ri * ch;
            ctx.fillStyle =
              ri === 0
                ? 'rgba(245, 158, 11, 0.32)'
                : ri === 4
                ? 'rgba(16, 185, 129, 0.26)'
                : 'rgba(255,255,255,0.06)';
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.35)';
            ctx.lineWidth = 1.5;
            ctx.fillRect(x, y, cw, ch);
            ctx.strokeRect(x, y, cw, ch);

            ctx.fillStyle = ri === 0 || ri === 4 ? '#FEF08A' : '#FFFFFF';
            ctx.font = ri === 0 ? 'bold 15px sans-serif' : 'bold 15px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(cellTxt, x + cw / 2, y + 29);
          });
        });
      }

      // =======================================================================
      // 25AA. PART II CH 5: CROSSING MULTI-LINE TRAJECTORIES & SLOPE COMPARISON
      // =======================================================================
      else if (sceneId === 'crossing_trajectories_chart') {
        const ox = 230;
        const oy = 370;
        const gw = 720;
        const gh = 230;

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Multi-Line Time-Series · Comparing Steepness (Rate of Change) & Crossover Point', cx, 95);

        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ox, oy - gh);
        ctx.lineTo(ox, oy);
        ctx.lineTo(ox + gw, oy);
        ctx.stroke();

        const seriesA = [35, 65, 105, 145, 185, 215];
        const seriesB = [175, 160, 145, 130, 115, 95];

        [
          { pts: seriesA, col: '#F59E0B', name: 'Solar Capacity (Steep Rise)' },
          { pts: seriesB, col: '#38BDF8', name: 'Coal Cost (Steady Decline)' },
        ].forEach((ser) => {
          ctx.strokeStyle = ser.col;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ser.pts.forEach((v, i) => {
            const x = ox + (i / 5) * gw;
            const y = oy - v;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();
        });

        // Highlight Crossover Point
        const crossX = ox + (2.5 / 5) * gw;
        const crossY = oy - 132;
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(crossX, crossY, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = 'bold 15px monospace';
        ctx.fillText('Crossover Equilibrium!', crossX, crossY - 18);
      }

      // =======================================================================
      // 25AB. PART II CH 6: THINK-OF-A-NUMBER ALGEBRAIC MYSTERY PIPELINE
      // =======================================================================
      else if (sceneId === 'think_of_number_mystery_box') {
        const steps = [
          { title: '1. Secret Number', expr: 'x', sub: '1 Bag', col: '#38BDF8' },
          { title: '2. Double It', expr: '2x', sub: '2 Bags', col: '#8B5CF6' },
          { title: '3. Add 6 Coins', expr: '2x + 6', sub: '2 Bags + 6', col: '#F59E0B' },
          { title: '4. Divide by 2', expr: 'x + 3', sub: '1 Bag + 3', col: '#10B981' },
          { title: '5. Subtract x', expr: '3', sub: 'x Cancels Out!', col: '#F43F5E' },
        ];

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Think-of-a-Number Pipeline · How Algebraic Cancellation Forces a Constant Result', cx, 95);

        steps.forEach((stItem, i) => {
          const x = 155 + i * 202;
          const y = 165;
          ctx.fillStyle = 'rgba(28, 17, 7, 0.9)';
          ctx.strokeStyle = stItem.col;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(x, y, 168, 185, 16);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = stItem.col;
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(stItem.title, x + 84, y + 34);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 30px monospace';
          ctx.fillText(stItem.expr, x + 84, y + 102);
          ctx.fillStyle = '#FEF08A';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(stItem.sub, x + 84, y + 154);
        });
      }

      // =======================================================================
      // 25AC. PART II CH 6: BIRTHDAY PLACE-VALUE SUITCASE (100m + d)
      // =======================================================================
      else if (sceneId === 'birthday_place_value_suitcase') {
        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Place-Value Suitcase · 5(4(5m + 9) + d) − 225 = 100m + d', cx, 95);

        // Hundreds Compartment (Month m) + Last Two Digits Compartment (Day d)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.roundRect(240, 155, 340, 195, 18);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
        ctx.strokeStyle = pal.gold;
        ctx.beginPath();
        ctx.roundRect(620, 155, 340, 195, 18);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('Hundreds Slot (100m)', 410, 195);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 54px monospace';
        ctx.fillText('08', 410, 270);
        ctx.fillStyle = '#FEF08A';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('Month m = August (8)', 410, 322);

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('Ones & Tens Slot (+d)', 790, 195);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 54px monospace';
        ctx.fillText('15', 790, 270);
        ctx.fillStyle = '#FEF08A';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('Day d = 15th  →  815!', 790, 322);
      }

      // =======================================================================
      // 25AD. PART II CH 6: VIRAHĀṄKA-MERU NUMBER PYRAMID (a + 2b + c)
      // =======================================================================
      else if (sceneId === 'meru_number_pyramid_weights') {
        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Virahāṅka-Meru Number Pyramid · Middle Brick b Contributes Twice (a + 2b + c)', cx, 95);

        const bricks = [
          // Top row
          [{ x: cx - 95, y: 135, w: 190, txt: 'a + 2b + c', col: '#F59E0B' }],
          // Middle row
          [
            { x: cx - 185, y: 215, w: 175, txt: 'a + b', col: '#38BDF8' },
            { x: cx + 10, y: 215, w: 175, txt: 'b + c', col: '#38BDF8' },
          ],
          // Bottom row
          [
            { x: cx - 275, y: 295, w: 170, txt: 'a', col: '#64748B' },
            { x: cx - 85, y: 295, w: 170, txt: 'b (×2 Path!)', col: '#10B981' },
            { x: cx + 105, y: 295, w: 170, txt: 'c', col: '#64748B' },
          ],
        ];

        bricks.forEach((row) => {
          row.forEach((b) => {
            ctx.fillStyle = 'rgba(28, 17, 7, 0.92)';
            ctx.strokeStyle = b.col;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(b.x, b.y, b.w, 58, 12);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 20px monospace';
            ctx.fillText(b.txt, b.x + b.w / 2, b.y + 36);
          });
        });
      }

      // =======================================================================
      // 25AE. PART II CH 6: THE GENIE'S BRIDGE DOUBLING & TOLL LOOP (8x − 210 = 0)
      // =======================================================================
      else if (sceneId === 'genie_bridge_doubling_loop') {
        const crossings = [
          { lbl: 'Start Coins', f: 'x = 26.25', col: '#38BDF8' },
          { lbl: 'Crossing 1', f: '2x − 30 = 22.50', col: '#10B981' },
          { lbl: 'Crossing 2', f: '4x − 90 = 15.00', col: '#F59E0B' },
          { lbl: 'Crossing 3', f: '8x − 210 = 0', col: '#F43F5E' },
        ];

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('The Genie’s Bridge Puzzle · Doubling & Paying 30 Coins Three Times', cx, 95);

        crossings.forEach((cItem, i) => {
          const x = 180 + i * 245;
          // Golden Bridge Arch
          if (i < 3) {
            ctx.strokeStyle = pal.gold;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x + 185, 225, 55, Math.PI, 0, false);
            ctx.stroke();
            ctx.fillStyle = '#FEF08A';
            ctx.font = 'bold 13px monospace';
            ctx.fillText('×2 then −30', x + 185, 158);
          }

          ctx.fillStyle = 'rgba(28, 17, 7, 0.92)';
          ctx.strokeStyle = cItem.col;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(x, 225, 165, 120, 14);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = cItem.col;
          ctx.font = 'bold 15px sans-serif';
          ctx.fillText(cItem.lbl, x + 82, 258);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 16px monospace';
          ctx.fillText(cItem.f, x + 82, 302);
        });
      }

      // =======================================================================
      // 25AF. PART II CH 6: 3×3 CALENDAR MAGIC CROSS (Sum = 9c)
      // =======================================================================
      else if (sceneId === 'calendar_3x3_symmetric_cross') {
        const gx = 300;
        const gy = 135;
        const cell = 78;
        const labels = [
          ['c − 8', 'c − 7', 'c − 6'],
          ['c − 1', 'c', 'c + 1'],
          ['c + 6', 'c + 7', 'c + 8'],
        ];

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('3×3 Calendar Window · Symmetric Offsets Cancel Around Center Date c (Sum = 9c)', cx, 95);

        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const isCenter = r === 1 && c === 1;
            ctx.fillStyle = isCenter ? 'rgba(245, 158, 11, 0.42)' : 'rgba(56, 189, 248, 0.16)';
            ctx.strokeStyle = isCenter ? pal.gold : '#38BDF8';
            ctx.lineWidth = isCenter ? 3.5 : 2;
            ctx.fillRect(gx + c * cell, gy + r * cell, cell - 4, cell - 4);
            ctx.strokeRect(gx + c * cell, gy + r * cell, cell - 4, cell - 4);

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 17px monospace';
            ctx.fillText(labels[r][c], gx + c * cell + cell / 2 - 2, gy + r * cell + cell / 2 + 5);
          }
        }

        ctx.fillStyle = '#FEF08A';
        ctx.font = 'bold 17px monospace';
        ctx.fillText('(c − 8) + (c + 8) = 2c', 785, 195);
        ctx.fillText('(c − 7) + (c + 7) = 2c', 785, 235);
        ctx.fillText('(c − 1) + (c + 1) = 2c', 785, 275);
        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('Total 9-Cell Sum = 9c!', 785, 325);
      }

      // =======================================================================
      // 25AG. PART II CH 6: TWO-PAN ALGEBRAIC EQUATION BALANCE SCALE
      // =======================================================================
      else if (sceneId === 'two_pan_equation_scale') {
        const bx = cx;
        const by = 225;
        const sway = Math.sin(t * 2) * 0.03;

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 20px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Two-Pan Equation Balance · Equal Operations on Both Sides Preserve Equilibrium', cx, 95);

        // Central Pillar
        ctx.fillStyle = pal.gold;
        ctx.fillRect(bx - 8, by, 16, 155);
        ctx.fillRect(bx - 85, by + 150, 170, 14);

        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(sway);

        // Beam
        ctx.strokeStyle = '#FEF08A';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-240, 0);
        ctx.lineTo(240, 0);
        ctx.stroke();

        // Left Pan & Right Pan
        [-240, 240].forEach((px, idx) => {
          ctx.strokeStyle = pal.accent;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(px - 85, 70);
          ctx.lineTo(px + 85, 70);
          ctx.stroke();

          ctx.fillStyle = idx === 0 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(16, 185, 129, 0.25)';
          ctx.strokeStyle = idx === 0 ? '#38BDF8' : '#10B981';
          ctx.beginPath();
          ctx.roundRect(px - 80, 18, 160, 50, 10);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 18px monospace';
          ctx.fillText(
            idx === 0 ? 'LHS: 3n + 3' : `RHS: ${st.currentClip.boardFormula.slice(0, 14)}`,
            px,
            49
          );
        });
        ctx.restore();
      }

      // =======================================================================
      // 26. FALLBACK INTERACTIVE GEOMETRIC & ALGEBRAIC CONSTELLATION
      // =======================================================================
      else {
        ctx.save();
        ctx.translate(cx, cy - 10);
        for (let ring = 1; ring <= 3; ring++) {
          ctx.strokeStyle = `rgba(253, 224, 71, ${0.4 - ring * 0.08})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, ring * 68, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        ctx.fillStyle = pal.gold;
        ctx.font = 'bold 22px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(st.currentClip.title, cx, 120);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 26px monospace';
        ctx.fillText(st.currentClip.boardFormula, cx, cy - 5);
        ctx.fillStyle = '#FEF08A';
        ctx.font = '18px sans-serif';
        ctx.fillText(st.currentClip.visualCaption.slice(0, 88), cx, 385);
      }

      ctx.restore();

      // =======================================================================
      // SWIRLING GOLDEN STARDUST WAND TRAIL (Synchronized to Active Sentence!)
      // =======================================================================
      ctx.save();
      const wandCenterX = cx + Math.cos(t * 1.1 + sIdx * 1.4) * 210;
      const wandCenterY = cy + Math.sin(t * 1.4 + sIdx) * 85;
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#FDE047';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      for (let k = 0; k < 18; k++) {
        const tau = t - k * 0.035;
        const wx = cx + Math.cos(tau * 1.5 + sIdx) * (190 + Math.sin(tau * 3) * 35);
        const wy = cy + Math.sin(tau * 1.9 + sIdx) * (95 + Math.cos(tau * 2) * 20);
        if (k === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.stroke();
      ctx.fillStyle = '#FFFBEB';
      ctx.beginPath();
      ctx.arc(wandCenterX, wandCenterY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // =======================================================================
      // GOLDEN VAULT SERIF HEADER, LOWER-THIRD FORMULA FLARE & LIVE TRANSCRIPT
      // (Exact match to "100 Lockers. 1 Hidden Code." / "Perfect Squares & Square Roots")
      // =======================================================================
      const topGrad = ctx.createLinearGradient(0, 0, 0, 105);
      topGrad.addColorStop(0, 'rgba(9, 5, 2, 0.92)');
      topGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, w, 105);

      const subGrad = ctx.createLinearGradient(0, h - 220, 0, h);
      subGrad.addColorStop(0, 'transparent');
      subGrad.addColorStop(0.32, 'rgba(12, 7, 3, 0.86)');
      subGrad.addColorStop(1, 'rgba(8, 4, 2, 0.98)');
      ctx.fillStyle = subGrad;
      ctx.fillRect(0, h - 220, w, 220);

      // Top Glowing Serif Gold Headline + Per-Module / Per-Beat Distinct Identity Badges
      ctx.save();
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(253, 224, 71, 0.75)';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#FEF3C7';
      ctx.font = 'bold 32px Georgia, "Playfair Display", serif';
      ctx.fillText(st.currentClip.title.slice(0, 52), cx, 56);
      ctx.shadowBlur = 0;

      // Top-Left Module / Intro Beat Identifier
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
      ctx.font = 'bold 13px monospace';
      const beatOrSceneLabel = isIntroVideo
        ? `25s CHAPTER GIST · BEAT ${Math.min(3, Math.floor(prog * 3) + 1)}/3`
        : `${st.moduleCode.toUpperCase()} · SCENE ${st.activeClipIdx + 1}/${st.clipsCount}`;
      ctx.fillText(beatOrSceneLabel, 68, 34);

      // Top-Right Active Visual Scene & Formula Cue
      ctx.textAlign = 'right';
      ctx.fillStyle = pal.gold;
      ctx.font = 'bold 13px monospace';
      ctx.fillText(st.currentClip.visualCaption.slice(0, 38), w - 68, 34);
      ctx.restore();

      // Bottom Glowing Serif Gold Subtitle & Formula + Golden Light-Flare Line
      ctx.save();
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(253, 224, 71, 0.7)';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 30px Georgia, "Playfair Display", serif';
      ctx.fillText(st.moduleTitle.slice(0, 48), cx, h - 132);

      // Warm Golden Horizontal Light-Flare Underline beneath the title
      const flareGrad = ctx.createLinearGradient(cx - 260, 0, cx + 260, 0);
      flareGrad.addColorStop(0, 'transparent');
      flareGrad.addColorStop(0.5, '#FDE047');
      flareGrad.addColorStop(1, 'transparent');
      ctx.strokeStyle = flareGrad;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 260, h - 118);
      ctx.lineTo(cx + 260, h - 118);
      ctx.stroke();

      // Glowing Formula directly beneath the golden flare line (like √n² = ±n)
      ctx.fillStyle = '#FEF08A';
      ctx.font = 'italic bold 22px Georgia, serif';
      ctx.fillText(st.currentClip.boardFormula.slice(0, 64), cx, h - 90);
      ctx.restore();

      // Signature 4-Point Diamond Sparkle Emblem (✦) at Bottom-Right Corner
      ctx.save();
      ctx.translate(w - 88, h - 118);
      ctx.fillStyle = 'rgba(254, 243, 199, 0.85)';
      ctx.shadowColor = '#FDE047';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.quadraticCurveTo(3, -3, 16, 0);
      ctx.quadraticCurveTo(3, 3, 0, 16);
      ctx.quadraticCurveTo(-3, 3, -16, 0);
      ctx.quadraticCurveTo(-3, -3, 0, -16);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      if (st.isPlaying) {
        // Synchronized Spoken Transcript Bar at Bottom with Word-by-Word Gold Highlight
        const sentenceFrac =
          (prog * Math.max(1, sentences.length)) -
          Math.floor(prog * Math.max(1, sentences.length));
        const words = activeSentence.split(/\s+/).filter(Boolean);
        const activeWordIdx = Math.min(
          words.length - 1,
          Math.floor(sentenceFrac * words.length)
        );

        ctx.textAlign = 'center';
        ctx.font = '600 20px Georgia, serif';
        const line1 = activeSentence.slice(0, 92);
        const line2 = activeSentence.slice(92, 184);

        ctx.fillStyle = '#FEF3C7';
        ctx.fillText(line1, cx, h - 52);
        if (line2) {
          ctx.fillText(line2, cx, h - 24);
        }

        // Golden Scrubber Progress Bar at Bottom Edge
        const totalProg = (st.activeClipIdx + st.clipProgress) / st.clipsCount;
        ctx.fillStyle = 'rgba(255,255,255,0.16)';
        ctx.fillRect(0, h - 5, w, 5);
        ctx.fillStyle = '#FDE047';
        ctx.fillRect(0, h - 5, w * totalProg, 5);
      }

      rafId = requestAnimationFrame(drawDocumentaryFrame);
    };

    rafId = requestAnimationFrame(drawDocumentaryFrame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const unlockAudioElement = () => {
    try {
      if (audioRef.current) {
        audioRef.current.muted = isMuted;
        // Unlock audio context / HTMLAudioElement synchronously on user gesture
        if (!audioRef.current.src) {
          audioRef.current.load();
        }
      }
    } catch {
      // Ignore
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      unlockAudioElement();
      if (activeClipIdx === clips.length - 1 && clipProgress >= 0.98) {
        setActiveClipIdx(0);
        setClipProgress(0);
      }
      setIsPlaying(true);
    }
  };

  const handleSelectClip = (idx: number) => {
    unlockAudioElement();
    setClipProgress(0);
    setActiveClipIdx(idx);
    setIsPlaying(true);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  const showCoverOverlay = !isPlaying && activeClipIdx === 0 && clipProgress === 0;

  return (
    <div className="space-y-8">
      <audio ref={audioRef} preload="auto" className="hidden" />
      <div
        ref={containerRef}
        className="rounded-[28px] overflow-hidden shadow-2xl border border-amber-500/30 bg-[#0E0804]"
      >
        <div
          onClick={handleTogglePlay}
          className="relative w-full aspect-video max-h-[560px] cursor-pointer select-none overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="w-full h-full object-cover"
          />

          {/* COVER OVERLAY: Golden Vault Cinema Poster + Centered Frosted Play Circle */}
          {showCoverOverlay && (
            <div className="absolute inset-0 flex flex-col justify-between p-7 sm:p-12 bg-gradient-to-t from-black/85 via-black/20 to-transparent">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-amber-200 text-xs font-bold border border-amber-400/40">
                  <Film className="w-3.5 h-3.5 text-amber-300" /> {moduleCode} · {formatMMSS(totalVideoSeconds)} Golden Vault Cinema
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-amber-100 text-xs font-serif border border-amber-400/30">
                  {formatMathText(clips[0]?.boardFormula || '')}
                </span>
              </div>

              <div className="my-auto mx-auto">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-amber-400/25 hover:bg-amber-400/35 backdrop-blur-md border-[3px] border-amber-200 flex items-center justify-center shadow-[0_0_45px_rgba(253,224,71,0.55)] transition-transform hover:scale-105">
                  <Play className="w-10 h-10 sm:w-14 sm:h-14 text-amber-100 fill-amber-100 ml-1.5" />
                </div>
              </div>

              <div className="space-y-1.5 max-w-3xl">
                <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-amber-100 tracking-tight drop-shadow-md">
                  {formatMathText(moduleTitle)}
                </h2>
                <p className="text-sm sm:text-base text-amber-200/90 font-medium drop-shadow">
                  Transcript-Synchronized Visual Cinema · Duration {formatMMSS(totalVideoSeconds)}
                </p>
              </div>
            </div>
          )}

          {!isPlaying && !showCoverOverlay && (
            <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-amber-400/30 backdrop-blur-md border-[3px] border-amber-200 flex items-center justify-center shadow-2xl">
                <Play className="w-10 h-10 text-amber-100 fill-amber-100 ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Clean Transport Bar (No Scene Bar, No Vault Intro Clip Button) */}
        <div className="px-6 py-4 bg-[#120A04] text-white flex flex-wrap items-center justify-between gap-4 border-t border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-sm transition cursor-pointer shadow"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Video'}</span>
            </button>

            <span className="px-3 py-1.5 rounded-full bg-white/10 text-amber-200 font-mono text-xs font-bold tabular-nums">
              {formatMMSS(elapsedVideoSeconds)} / {formatMMSS(totalVideoSeconds)}
            </span>

            <button
              type="button"
              onClick={() => handleSelectClip(Math.max(0, activeClipIdx - 1))}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Rewind"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                handleSelectClip(Math.min(clips.length - 1, activeClipIdx + 1))
              }
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Fast Forward"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setActiveClipIdx(0);
                setClipProgress(0);
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Restart Video"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {isLoadingAudio && (
              <span className="text-xs text-amber-300 font-medium">
                Synthesizing Voice...
              </span>
            )}

            <button
              type="button"
              onClick={() =>
                setVoiceName((v) => (v === 'Kore' ? 'Puck' : 'Kore'))
              }
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-amber-200 cursor-pointer"
            >
              🎙️ Voice: {voiceName === 'Kore' ? 'British Narrator' : 'US Narrator'}
            </button>

            <button
              type="button"
              onClick={() => setIsMuted((m) => !m)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-300" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-300" />
              )}
            </button>

            <button
              type="button"
              onClick={handleFullscreen}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Study Notes & Worked Example below the video (only if explicitly requested) */}
      {showStudyNotes && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#0F766E] font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>{moduleCode} Concept Guide · {formatMathText(moduleTitle)}</span>
            </div>

            <div className="space-y-3 text-stone-700 leading-relaxed text-base">
              {videoCue.readingParagraphs.map((paragraph: string, idx: number) => (
                <p key={idx}>{formatMathText(paragraph)}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {videoCue.keyTakeaways.map((item: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-3.5 rounded-2xl bg-[#F0FDFA] border border-[#99F6E4] text-[#115E59] text-xs font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                    <span>{formatMathText(item)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#12352B] text-white rounded-3xl p-6 md:p-8 border border-[#2DD4BF]/30 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold uppercase tracking-wider">
                Worked Example
              </span>
              <h4 className="text-xl font-bold leading-snug">
                {formatMathText(videoCue.workedExample.problem)}
              </h4>
              <div className="space-y-2.5 pt-1">
                {videoCue.workedExample.steps.map((step: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-black/25 border border-white/10 text-sm text-emerald-100"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#2DD4BF] text-[#042F2E] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{formatMathText(step)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-400/15 border border-amber-300/40 text-amber-200 font-bold text-base">
              Answer: {formatMathText(videoCue.workedExample.answer)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
