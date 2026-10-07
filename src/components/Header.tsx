import React from 'react';
import { ReferenceConfig, Unit, PresetPaper } from '../types';
import { DPI_PRESETS, PRESET_PAPERS } from '../utils/converters';
import { Ruler, Sparkles, Sliders, Monitor, Layers, Type, Grid3X3, BookOpen, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  config: ReferenceConfig;
  onChangeConfig: (newConfig: Partial<ReferenceConfig>) => void;
  activeTab: 'converter' | 'ruler' | 'typescale' | 'grid' | 'fonts' | 'formulas';
  onSelectTab: (tab: 'converter' | 'ruler' | 'typescale' | 'grid' | 'fonts' | 'formulas') => void;
  selectedPreset: PresetPaper | null;
  onApplyPreset: (preset: PresetPaper) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onChangeConfig,
  activeTab,
  onSelectTab,
  selectedPreset,
  onApplyPreset,
  theme,
  onToggleTheme,
}) => {
  return (
    <header id="app-header" className="border-b border-stone-200 bg-white/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo and Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs border border-stone-800">
              <Ruler className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-stone-900 font-sans">
                  TypoGraph
                </h1>
                <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                  DTP & Web Precision
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Graphic Design & Typographic Measurement Engine
              </p>
            </div>
          </div>

          {/* Quick Context Controls: DPI & Base Font Size */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            {/* Quick Canvas Preset Dropdown */}
            <div className="flex items-center gap-1.5 bg-stone-100/90 rounded-lg p-1 border border-stone-200">
              <span className="text-stone-500 font-semibold px-1.5 text-[11px] flex items-center gap-1">
                <Monitor className="w-3 h-3 text-stone-400" /> Preset:
              </span>
              <select
                id="preset-selector"
                value={selectedPreset?.id || 'custom'}
                onChange={(e) => {
                  const found = PRESET_PAPERS.find((p) => p.id === e.target.value);
                  if (found) onApplyPreset(found);
                }}
                className="bg-white text-stone-800 text-xs font-medium py-1 px-2.5 rounded-md border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer shadow-2xs"
              >
                <optgroup label="Standard Print (ISO)">
                  {PRESET_PAPERS.filter((p) => p.category === 'print-iso').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.width}×{p.height}{p.unit})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Standard Print (US)">
                  {PRESET_PAPERS.filter((p) => p.category === 'print-us').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.width}×{p.height}{p.unit})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Digital & Screens">
                  {PRESET_PAPERS.filter((p) => p.category === 'screen' || p.category === 'social').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Target Resolution / DPI */}
            <div className="flex items-center gap-1.5 bg-stone-100/90 rounded-lg p-1 border border-stone-200">
              <span className="text-stone-500 font-semibold px-1.5 text-[11px]">
                Target DPI:
              </span>
              <select
                id="header-dpi-select"
                value={config.dpi}
                onChange={(e) => onChangeConfig({ dpi: Number(e.target.value) })}
                className="bg-white text-stone-800 text-xs font-semibold py-1 px-2 rounded-md border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer shadow-2xs"
              >
                {DPI_PRESETS.map((dpi) => (
                  <option key={dpi.value} value={dpi.value}>
                    {dpi.value} DPI {dpi.value === 96 ? '(Web)' : dpi.value === 300 ? '(Print)' : dpi.value === 72 ? '(DTP)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Base Font Size Root (px) */}
            <div className="flex items-center gap-1 bg-stone-100/90 rounded-lg p-1 border border-stone-200">
              <span className="text-stone-500 font-semibold px-1.5 text-[11px] flex items-center gap-1">
                <Type className="w-3 h-3 text-stone-400" /> Root:
              </span>
              <div className="flex items-center bg-white rounded-md border border-stone-200 px-1.5 py-0.5 shadow-2xs">
                <input
                  id="header-base-fontsize"
                  type="number"
                  min="8"
                  max="48"
                  value={config.baseFontSizePx}
                  onChange={(e) => onChangeConfig({ baseFontSizePx: Math.max(1, Number(e.target.value) || 16) })}
                  className="w-10 text-center font-mono font-semibold text-stone-800 text-xs focus:outline-none"
                  title="Base root font-size in CSS pixels"
                />
                <span className="text-[10px] text-stone-400 font-mono font-semibold ml-0.5">px</span>
              </div>
            </div>

            {/* Dark & Light Screen Mode Toggle */}
            <button
              id="theme-toggle-header-btn"
              type="button"
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 bg-stone-100/90 hover:bg-stone-200/90 text-stone-700 px-2.5 py-1.5 rounded-lg border border-stone-200 transition-colors cursor-pointer shadow-2xs"
              title={theme === 'dark' ? 'Switch to Pastel Beige Screen' : 'Switch to Dark Leather Screen'}
              aria-label={theme === 'dark' ? 'Switch to Pastel Beige Screen' : 'Switch to Dark Leather Screen'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-xs text-stone-800">Pastel Beige</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-stone-700 fill-stone-700" />
                  <span className="font-semibold text-xs text-stone-800">Dark Leather</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2.5 overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1 sm:space-x-2" aria-label="Main Navigation">
            <button
              id="tab-converter"
              onClick={() => onSelectTab('converter')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'converter'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Unit Converter & Matrix</span>
            </button>

            <button
              id="tab-grid"
              onClick={() => onSelectTab('grid')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'grid'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Custom Grid & Live Layout</span>
            </button>

            <button
              id="tab-typescale"
              onClick={() => onSelectTab('typescale')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'typescale'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Typography Scale</span>
            </button>

            <button
              id="tab-fonts"
              onClick={() => onSelectTab('fonts')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'fonts'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>Font Anatomy & Pairing</span>
            </button>

            <button
              id="tab-ruler"
              onClick={() => onSelectTab('ruler')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'ruler'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Visual Reference Ruler</span>
            </button>

            <button
              id="tab-formulas"
              onClick={() => onSelectTab('formulas')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'formulas'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Formulas & Cheat Sheet</span>
            </button>
          </nav>

          {/* Quick Context Summary Badge */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-stone-500 font-mono pl-4">
            <span className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded border border-stone-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              1 in = 25.4 mm = 72 pt = {config.dpi} px
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
