import React, { useState, useEffect } from 'react';
import { ReferenceConfig, GridSettings, PresetPaper, Unit } from './types';
import { PRESET_PAPERS } from './utils/converters';
import { Header } from './components/Header';
import { ConverterMatrix } from './components/ConverterMatrix';
import { GridArchitect } from './components/GridArchitect';
import { TypeScaleCalculator } from './components/TypeScaleCalculator';
import { VisualRuler } from './components/VisualRuler';
import { FormulaGuide } from './components/FormulaGuide';
import { FontAnatomyAndPairing } from './components/FontAnatomyAndPairing';
import { Ruler, Sparkles, Sliders, Type, Grid3X3, Layers } from 'lucide-react';

export default function App() {
  // Screen Theme State: 'light' or 'dark' with localStorage persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('typograph-screen-theme');
      if (stored === 'dark' || stored === 'light') return stored;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Sync theme class with document root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('typograph-screen-theme', theme);
    } catch {
      // ignore storage write errors
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Global Reference Settings
  const [config, setConfig] = useState<ReferenceConfig>({
    dpi: 96,
    baseFontSizePx: 16,
    baseLineHeightRatio: 1.5,
    viewportWidthPx: 1440,
    viewportHeightPx: 900,
    emContextFontSizePx: 16,
    screenCalibrationPpi: 96,
  });

  // Global Grid and Layout Settings (Default A4 ISO Standard)
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    pageWidth: 210,
    pageHeight: 297,
    pageUnit: 'mm',
    columns: 12,
    gutter: 5,
    gutterUnit: 'mm',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    marginUnit: 'mm',
    baselineStep: 12,
    baselineUnit: 'pt',
    baselineOffset: 0,
    showBaselineGrid: true,
    showColumns: true,
    showMargins: true,
    showRulers: true,
    snapToGrid: true,
    isTwoPageSpread: false,
  });

  const [selectedPreset, setSelectedPreset] = useState<PresetPaper | null>(PRESET_PAPERS[0]); // A4 default
  const [activeTab, setActiveTab] = useState<'converter' | 'grid' | 'typescale' | 'fonts' | 'ruler' | 'formulas'>('converter');

  // Handle updates to reference configuration
  const handleConfigChange = (newConfig: Partial<ReferenceConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Handle updates to grid settings
  const handleGridChange = (newSettings: Partial<GridSettings>) => {
    setGridSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Apply paper/screen preset
  const handleApplyPreset = (preset: PresetPaper) => {
    setSelectedPreset(preset);
    setGridSettings((prev) => ({
      ...prev,
      pageWidth: preset.width,
      pageHeight: preset.height,
      pageUnit: preset.unit,
      gutter: preset.unit === 'mm' ? 5 : preset.unit === 'in' ? 0.25 : 16,
      gutterUnit: preset.unit,
      marginTop: preset.unit === 'mm' ? 20 : preset.unit === 'in' ? 0.75 : 24,
      marginBottom: preset.unit === 'mm' ? 20 : preset.unit === 'in' ? 0.75 : 24,
      marginLeft: preset.unit === 'mm' ? 20 : preset.unit === 'in' ? 0.75 : 24,
      marginRight: preset.unit === 'mm' ? 20 : preset.unit === 'in' ? 0.75 : 24,
      marginUnit: preset.unit,
    }));
    setConfig((prev) => ({ ...prev, dpi: preset.defaultDpi }));
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans transition-colors duration-150">
      {/* Top Header & Context Settings */}
      <Header
        config={config}
        onChangeConfig={handleConfigChange}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        selectedPreset={selectedPreset}
        onApplyPreset={handleApplyPreset}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'converter' && (
          <ConverterMatrix config={config} onChangeConfig={handleConfigChange} />
        )}

        {activeTab === 'grid' && (
          <GridArchitect
            config={config}
            gridSettings={gridSettings}
            onChangeGridSettings={handleGridChange}
            selectedPreset={selectedPreset}
            onApplyPreset={handleApplyPreset}
          />
        )}

        {activeTab === 'typescale' && (
          <TypeScaleCalculator config={config} onChangeConfig={handleConfigChange} />
        )}

        {activeTab === 'fonts' && <FontAnatomyAndPairing config={config} />}

        {activeTab === 'ruler' && (
          <VisualRuler config={config} onChangeConfig={handleConfigChange} />
        )}

        {activeTab === 'formulas' && <FormulaGuide config={config} />}
      </main>

      {/* Footer Specs & Typography Rules */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-stone-700">TypoGraph Engine</span>
            <span>•</span>
            <span>PostScript, CSS & Metric Precision</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400 font-mono text-[11px]">
            <span>1 in = 25.4 mm = 72 pt = {config.dpi} px</span>
            <span>•</span>
            <span>1 pc = 12 pt</span>
            <span>•</span>
            <span>1 rem = {config.baseFontSizePx} px</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
