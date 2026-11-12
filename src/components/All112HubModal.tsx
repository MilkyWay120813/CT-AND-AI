import React, { useState, useMemo } from 'react';
import {
  Gamepad2,
  Sliders,
  X,
  Search,
  Filter,
  ArrowRight,
  Play,
  Sparkles,
  Trophy,
  BookOpen,
  Zap,
  CheckCircle2,
  Award,
} from 'lucide-react';
import {
  PART1_CURRICULUM_CHAPTERS,
  PART2_CURRICULUM_CHAPTERS,
} from '../data/part1CurriculumData';
import { Part1ModuleItem } from '../types/part1Curriculum';
import { formatMathText } from '../utils/formatMath';

export interface All112HubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'games' | 'simulations';
  onLaunchModule: (chapterId: string, moduleCode: string, slideIndex: 2 | 3) => void;
}

export interface All112Item {
  globalIndex: number; // 1 to 112
  partLabel: 'Part I' | 'Part II';
  chapterId: string;
  chapterIndex: number;
  chapterTitle: string;
  module: Part1ModuleItem;
}

export const All112HubModal: React.FC<All112HubModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'games',
  onLaunchModule,
}) => {
  const [activeTab, setActiveTab] = useState<'games' | 'simulations'>(initialTab);
  const [partFilter, setPartFilter] = useState<'all' | 'part1' | 'part2'>('all');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Assemble the canonical list of all 112 modules (56 in Part I + 56 in Part II)
  const all112Items = useMemo<All112Item[]>(() => {
    const items: All112Item[] = [];
    let counter = 1;

    // Part I (Chapters 1 to 7 = 56 modules)
    PART1_CURRICULUM_CHAPTERS.filter((c) => c.modules.length > 0).forEach((c) => {
      c.modules.forEach((m) => {
        items.push({
          globalIndex: counter++,
          partLabel: 'Part I',
          chapterId: c.chapterId,
          chapterIndex: c.chapterIndex,
          chapterTitle: c.title,
          module: m,
        });
      });
    });

    // Part II (Chapters 1 to 7 = 56 modules)
    PART2_CURRICULUM_CHAPTERS.filter((c) => c.modules.length > 0).forEach((c) => {
      c.modules.forEach((m) => {
        items.push({
          globalIndex: counter++,
          partLabel: 'Part II',
          chapterId: c.chapterId,
          chapterIndex: c.chapterIndex,
          chapterTitle: c.title,
          module: m,
        });
      });
    });

    return items;
  }, []);

  // Filtered items based on volume, chapter, and search
  const filteredItems = useMemo(() => {
    return all112Items.filter((item) => {
      // Volume filter
      if (partFilter === 'part1' && item.partLabel !== 'Part I') return false;
      if (partFilter === 'part2' && item.partLabel !== 'Part II') return false;

      // Chapter filter
      if (selectedChapterId !== 'all' && item.chapterId !== selectedChapterId) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const searchable = `${item.globalIndex} ${item.partLabel} ${item.chapterTitle} ${
          item.module.moduleCode
        } ${item.module.title} ${item.module.simulation.title} ${
          item.module.simulation.description
        } ${item.module.simulation.formulaHighlight} ${item.module.game.title} ${
          item.module.game.subtitle
        } ${item.module.game.rules}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }

      return true;
    });
  }, [all112Items, partFilter, selectedChapterId, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="All 112 Games and Simulations Hub"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-7xl max-h-[94vh] flex flex-col rounded-3xl border-3 border-teal-500/40 bg-[#0F281E] text-white shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-teal-700/40 bg-[#0A1F17] px-6 py-5">
          <div className="flex items-center gap-3.5">
            <div
              className={`flex h-13 w-13 items-center justify-center rounded-2xl border-2 shadow-lg text-stone-950 font-black text-2xl ${
                activeTab === 'games'
                  ? 'bg-amber-400 border-amber-300'
                  : 'bg-teal-400 border-teal-300'
              }`}
            >
              {activeTab === 'games' ? <Gamepad2 className="w-7 h-7" /> : <Sliders className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-amber-400 text-stone-950 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider">
                  Total Universe: 112 Modules
                </span>
                <span className="text-xs font-bold text-teal-300">
                  56 Part I + 56 Part II = 112 Total
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                {activeTab === 'games'
                  ? 'The Complete 112 Creative Games Arcade'
                  : 'The Complete 112 Interactive Simulations Lab'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switcher Tabs */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-black/40 border border-white/15 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('games')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                  activeTab === 'games'
                    ? 'bg-amber-400 text-stone-950 shadow-md'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>112 Games ({all112Items.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('simulations')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                  activeTab === 'simulations'
                    ? 'bg-[#00B4A7] text-white shadow-md'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>112 Simulations ({all112Items.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/30 hover:bg-white/10 text-white transition cursor-pointer"
              title="Close Hub"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-4 border-b border-teal-700/30 bg-[#0E241B] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Volume:
            </span>
            <div className="inline-flex items-center rounded-xl bg-black/30 p-1 border border-white/10">
              {[
                { id: 'all' as const, label: `All 112 Modules` },
                { id: 'part1' as const, label: `Part I (1–56)` },
                { id: 'part2' as const, label: `Part II (57–112)` },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setPartFilter(pill.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                    partFilter === pill.id
                      ? 'bg-amber-400 text-stone-950 shadow-xs'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Chapter select */}
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/15 text-xs font-bold text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="all">All 14 Chapters (Part I & II)</option>
              <optgroup label="Part I Chapters (1 to 7)">
                {PART1_CURRICULUM_CHAPTERS.filter((c) => c.modules.length > 0).map((c) => (
                  <option key={c.chapterId} value={c.chapterId}>
                    Part I Ch {c.chapterIndex}: {c.title} (8 modules)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Part II Chapters (1 to 7)">
                {PART2_CURRICULUM_CHAPTERS.filter((c) => c.modules.length > 0).map((c) => (
                  <option key={c.chapterId} value={c.chapterId}>
                    Part II Ch {c.chapterIndex}: {c.title} (8 modules)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-300 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search all 112 ${activeTab}...`}
              className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 112 Items Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-teal-200">
            <span>
              Showing <strong>{filteredItems.length}</strong> of <strong>112</strong> {activeTab}
            </span>
            <span className="text-stone-400">
              Click any card to launch immediately into Slide {activeTab === 'games' ? '4 (Game)' : '3 (Simulation)'}!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const isGame = activeTab === 'games';
              const targetSlideIndex: 2 | 3 = isGame ? 3 : 2; // Slide 4 (index 3) or Slide 3 (index 2)

              return (
                <div
                  key={`${item.chapterId}-${item.module.id}`}
                  className="rounded-2xl border-2 border-teal-600/30 bg-[#0B2117] hover:border-amber-400/80 transition-all p-4.5 flex flex-col justify-between gap-3 shadow-md group hover:bg-[#0D281C]"
                >
                  <div className="space-y-2">
                    {/* Header Pill: Index + Chapter */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black text-[11px] uppercase tracking-wider">
                        #{item.globalIndex} of 112
                      </span>
                      <span className="text-[10px] font-bold text-teal-300 truncate max-w-[170px]">
                        {item.partLabel} · Ch {item.chapterIndex}
                      </span>
                    </div>

                    {/* Module Title */}
                    <div>
                      <div className="text-[11px] font-bold text-stone-400">
                        {item.module.moduleCode}
                      </div>
                      <h4 className="text-sm font-extrabold text-white leading-snug line-clamp-1 group-hover:text-amber-200 transition-colors">
                        {formatMathText(item.module.title)}
                      </h4>
                    </div>

                    {/* Mode Specific Card Body */}
                    {isGame ? (
                      <div className="space-y-1.5 p-3 rounded-xl bg-black/30 border border-white/10 text-xs">
                        <div className="flex items-center gap-1.5 font-black text-amber-300">
                          <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{item.module.game.title}</span>
                        </div>
                        <p className="text-[11px] text-teal-100 line-clamp-2 leading-relaxed">
                          {formatMathText(item.module.game.subtitle || item.module.game.rules)}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 p-3 rounded-xl bg-black/30 border border-white/10 text-xs">
                        <div className="flex items-center gap-1.5 font-black text-teal-300">
                          <Sliders className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{item.module.simulation.title}</span>
                        </div>
                        <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed">
                          {formatMathText(item.module.simulation.description)}
                        </p>
                        <div className="text-[10px] font-mono text-amber-300 truncate pt-0.5">
                          {formatMathText(item.module.simulation.formulaHighlight)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Launch Button */}
                  <button
                    type="button"
                    onClick={() => {
                      onLaunchModule(item.chapterId, item.module.moduleCode, targetSlideIndex);
                      onClose();
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow ${
                      isGame
                        ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                        : 'bg-teal-600 hover:bg-teal-500 text-white'
                    }`}
                  >
                    <span>
                      {isGame
                        ? `Play Game #${item.globalIndex} (Slide 4)`
                        : `Launch Simulation #${item.globalIndex} (Slide 3)`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
