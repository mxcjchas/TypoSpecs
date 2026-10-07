import React, { useState, useMemo } from 'react';
import { ReferenceConfig, Unit, ModularScalePreset, TypographyStep } from '../types';
import { MODULAR_SCALE_PRESETS, generateTypeScale, formatValue, convertUnit } from '../utils/converters';
import { Type, Copy, Check, Eye, Sliders, CheckCircle2, AlignLeft, Grid, Sparkles, Layers } from 'lucide-react';

interface TypeScaleCalculatorProps {
  config: ReferenceConfig;
  onChangeConfig: (newConfig: Partial<ReferenceConfig>) => void;
}

export const TypeScaleCalculator: React.FC<TypeScaleCalculatorProps> = ({ config, onChangeConfig }) => {
  // Base Type size state
  const [baseSizePt, setBaseSizePt] = useState<number>(12); // 12pt standard print / 16px
  const [baseUnit, setBaseUnit] = useState<Unit>('pt');
  const [selectedRatio, setSelectedRatio] = useState<number>(1.250); // Major Third default
  const [customRatio, setCustomRatio] = useState<string>('1.250');
  const [baselineStepPt, setBaselineStepPt] = useState<number>(12); // 12pt baseline grid

  // Specimen Live Preview controls
  const [previewFontFamily, setPreviewFontFamily] = useState<'sans' | 'serif' | 'mono' | 'display'>('serif');
  const [previewHeading, setPreviewHeading] = useState<string>('Harmonic Proportions in Visual Design');
  const [previewBody, setPreviewBody] = useState<string>(
    'Typography is the craft of endowing human language with a durable visual form. When type sizes adhere to a strict modular scale and snap cleanly to a baseline grid, the entire page breathes with rhythmic balance and effortless readability.'
  );
  const [showBaselineOverlay, setShowBaselineOverlay] = useState<boolean>(true);
  const [activeStepId, setActiveStepId] = useState<string>('h1');
  const [trackingEm, setTrackingEm] = useState<number>(0);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  // Generate typography ladder
  const typeSteps = useMemo(() => {
    return generateTypeScale(baseSizePt, selectedRatio, config, baselineStepPt);
  }, [baseSizePt, selectedRatio, config, baselineStepPt]);

  // Selected step for detail preview
  const activeStep = useMemo(() => {
    return typeSteps.find((s) => s.id === activeStepId) || typeSteps[2];
  }, [typeSteps, activeStepId]);

  const handleBaseSizeChange = (val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      if (baseUnit === 'pt') {
        setBaseSizePt(num);
      } else {
        const inPt = convertUnit(num, baseUnit, 'pt', config);
        setBaseSizePt(Number(inPt.toFixed(2)));
      }
    }
  };

  const handleRatioSelect = (preset: ModularScalePreset) => {
    setSelectedRatio(preset.ratio);
    setCustomRatio(preset.ratio.toString());
  };

  const handleCustomRatioChange = (val: string) => {
    setCustomRatio(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 1) {
      setSelectedRatio(num);
    }
  };

  // Font family classes
  const getFontFamilyClass = () => {
    switch (previewFontFamily) {
      case 'serif':
        return 'font-serif font-normal';
      case 'mono':
        return 'font-mono';
      case 'display':
        return 'font-sans font-extrabold tracking-tight';
      case 'sans':
      default:
        return 'font-sans font-medium';
    }
  };

  // Copy CSS typography system
  const copyTypographyCSS = () => {
    const cssVars = typeSteps
      .map((step) => {
        const pt = formatValue(step.calculatedPt, 'pt');
        const px = formatValue(step.calculatedPx, 'px');
        const rem = formatValue(step.calculatedEm, 'rem');
        const lh = formatValue(step.lineHeightPx, 'px');
        return `  --font-size-${step.id}: ${rem}rem; /* ${px}px / ${pt}pt | line-height: ${lh}px */\n  --line-height-${step.id}: ${lh}px;`;
      })
      .join('\n');

    const fullCode = `/* TypoGraph Modular Scale: ${selectedRatio} | Base: ${baseSizePt}pt */\n:root {\n  --baseline-grid-step: ${baselineStepPt}pt;\n${cssVars}\n}`;
    navigator.clipboard.writeText(fullCode);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div id="typescale-calculator-container" className="space-y-8">
      
      {/* Top Banner / Scale Controls */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-stone-900 text-stone-100 font-mono">
                Typographic Hierarchy
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Modular Scale & Baseline Leading Engine
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mt-2 font-sans">
              Typography Scale & Measurement Calculator
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl mt-1 leading-relaxed">
              Construct harmonious typographic scales using classic musical ratios. View calculated sizes across points, pixels, millimeters, and relative ems while verifying exact baseline grid alignment.
            </p>
          </div>

          <button
            id="btn-copy-type-css"
            onClick={copyTypographyCSS}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs whitespace-nowrap self-start lg:self-auto"
          >
            {copiedToken ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedToken ? 'Copied Typography Tokens!' : 'Export CSS Tokens'}</span>
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Base Font Size */}
          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
              Base Body Size
            </span>
            <div className="flex items-center gap-2">
              <input
                id="input-typescale-base-size"
                type="number"
                step="0.5"
                min="6"
                max="36"
                value={baseSizePt}
                onChange={(e) => handleBaseSizeChange(e.target.value)}
                className="w-full bg-white text-stone-900 font-mono font-bold text-lg px-3 py-1.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
              <span className="font-mono text-sm font-bold text-stone-700 bg-stone-200/80 px-2.5 py-1.5 rounded-lg">
                pt
              </span>
            </div>
            <span className="text-[10px] text-stone-400 font-mono mt-1 block">
              = {formatValue(convertUnit(baseSizePt, 'pt', 'px', config), 'px')} px | {formatValue(convertUnit(baseSizePt, 'pt', 'mm', config), 'mm')} mm
            </span>
          </div>

          {/* Modular Ratio Selector */}
          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
              Modular Scale Ratio
            </span>
            <select
              id="select-modular-ratio"
              value={selectedRatio}
              onChange={(e) => {
                const ratioVal = parseFloat(e.target.value);
                setSelectedRatio(ratioVal);
                setCustomRatio(ratioVal.toString());
              }}
              className="w-full bg-white text-stone-900 font-medium text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
            >
              {MODULAR_SCALE_PRESETS.map((p) => (
                <option key={p.name} value={p.ratio}>
                  {p.name} — {p.ratio}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] text-stone-400">Ratio:</span>
              <input
                type="number"
                step="0.001"
                value={customRatio}
                onChange={(e) => handleCustomRatioChange(e.target.value)}
                className="w-20 bg-white font-mono text-xs text-stone-800 px-1.5 py-0.5 rounded border border-stone-200"
              />
            </div>
          </div>

          {/* Baseline Grid Step (Leading) */}
          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
              Baseline Grid Step
            </span>
            <div className="flex items-center gap-2">
              <select
                id="select-baseline-step"
                value={baselineStepPt}
                onChange={(e) => setBaselineStepPt(Number(e.target.value))}
                className="w-full bg-white text-stone-900 font-semibold text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
              >
                <option value={8}>8 pt (Compact 8pt Grid)</option>
                <option value={12}>12 pt / 1 Pica (Classic Editorial)</option>
                <option value={14}>14 pt (Open Editorial)</option>
                <option value={16}>16 pt / 4-pixel web grid</option>
                <option value={18}>18 pt (Generous Book Type)</option>
              </select>
            </div>
            <span className="text-[10px] text-stone-400 font-mono mt-1 block">
              Snaps leading to integer multiples
            </span>
          </div>

          {/* Typeface Specimen Family */}
          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
              Specimen Typeface
            </span>
            <div className="grid grid-cols-2 gap-1">
              {[
                { id: 'serif', label: 'Editorial Serif' },
                { id: 'sans', label: 'Modern Sans' },
                { id: 'display', label: 'Display Headline' },
                { id: 'mono', label: 'Monospace' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setPreviewFontFamily(f.id as any)}
                  className={`px-2 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                    previewFontFamily === f.id
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Live Typography Specimen & Baseline Alignment Tester */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-stone-700" />
              Live Specimen & Baseline Snapping Viewer
            </h3>
            <span className="text-xs text-stone-500">
              Active: <strong className="text-stone-900">{activeStep.name}</strong> ({formatValue(activeStep.calculatedPt, 'pt')} pt / {formatValue(activeStep.calculatedPx, 'px')} px)
            </span>
          </div>

          {/* Controls: Baseline Grid Overlay Toggle & Tracking */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <span>Tracking:</span>
              <input
                id="input-tracking"
                type="range"
                min="-0.05"
                max="0.2"
                step="0.01"
                value={trackingEm}
                onChange={(e) => setTrackingEm(Number(e.target.value))}
                className="w-20 h-1.5 bg-stone-200 rounded accent-stone-900 cursor-pointer"
              />
              <span className="font-mono text-[11px] min-w-8">{trackingEm}em</span>
            </div>

            <button
              id="btn-toggle-baseline-grid"
              onClick={() => setShowBaselineOverlay(!showBaselineOverlay)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                showBaselineOverlay
                  ? 'bg-blue-50 text-blue-900 border-blue-300 font-bold'
                  : 'bg-stone-100 text-stone-600 border-stone-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{showBaselineOverlay ? 'Baseline Grid: ON' : 'Baseline Grid: OFF'}</span>
            </button>
          </div>
        </div>

        {/* Specimen Canvas Box with Live Baseline Guides */}
        <div
          className="relative bg-stone-50/50 rounded-xl p-8 border border-stone-200 overflow-hidden"
          style={{
            backgroundImage: showBaselineOverlay
              ? `linear-gradient(to bottom, transparent ${baselineStepPt * 1.333 - 1}px, rgba(59, 130, 246, 0.15) ${baselineStepPt * 1.333}px)`
              : 'none',
            backgroundSize: `100% ${baselineStepPt * 1.333}px`,
          }}
        >
          {/* Active Heading Specimen */}
          <div
            className={`text-stone-950 transition-all ${getFontFamilyClass()}`}
            style={{
              fontSize: `${activeStep.calculatedPx}px`,
              lineHeight: `${activeStep.lineHeightPx}px`,
              letterSpacing: `${trackingEm}em`,
            }}
          >
            {previewHeading}
          </div>

          {/* Body Copy Specimen */}
          <p
            className="mt-6 text-stone-700 font-sans max-w-3xl leading-relaxed"
            style={{
              fontSize: `${convertUnit(baseSizePt, 'pt', 'px', config)}px`,
              lineHeight: `${baselineStepPt * 1.5 * 1.333}px`,
            }}
          >
            {previewBody}
          </p>

          {/* Metric Badges on Specimen */}
          <div className="mt-8 pt-4 border-t border-stone-200/80 flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="bg-white px-2.5 py-1 rounded-md border border-stone-200 text-stone-800 font-semibold shadow-2xs">
              Size: {formatValue(activeStep.calculatedPt, 'pt')} pt / {formatValue(activeStep.calculatedPx, 'px')} px / {formatValue(activeStep.calculatedMm, 'mm')} mm
            </span>
            <span className="bg-white px-2.5 py-1 rounded-md border border-stone-200 text-stone-800 font-semibold shadow-2xs">
              Leading: {formatValue(activeStep.lineHeightPt, 'pt')} pt ({activeStep.baselineFit}× baseline step)
            </span>
            <span className="bg-white px-2.5 py-1 rounded-md border border-stone-200 text-stone-800 font-semibold shadow-2xs">
              Em: {formatValue(activeStep.calculatedEm, 'em')} em
            </span>
          </div>
        </div>
      </div>

      {/* Typography Hierarchy Ladder Table */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <AlignLeft className="w-4 h-4 text-stone-700" />
            Complete Typographic Scale Ladder
          </h3>
          <span className="text-xs text-stone-500">
            Click any row to test in live specimen viewer
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
          <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-800 text-left text-xs font-mono">
            <thead className="bg-stone-50 dark:bg-stone-900/90 text-stone-600 dark:text-stone-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Step</th>
                <th className="px-4 py-3 text-blue-700 dark:text-blue-300">Points (pt)</th>
                <th className="px-4 py-3 text-sky-700 dark:text-sky-300">Pixels (px)</th>
                <th className="px-4 py-3 text-emerald-700 dark:text-emerald-300">Millimeters (mm)</th>
                <th className="px-4 py-3 text-indigo-700 dark:text-indigo-300">Em / Rem</th>
                <th className="px-4 py-3 text-stone-700 dark:text-stone-300">Leading (Line Height)</th>
                <th className="px-4 py-3 text-amber-700 dark:text-amber-300">Baseline Grid Fit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80 bg-white dark:bg-stone-900/40 text-stone-800 dark:text-stone-200">
              {typeSteps.map((step) => {
                const isSelected = step.id === activeStepId;
                return (
                  <tr
                    key={step.id}
                    onClick={() => setActiveStepId(step.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/60 font-bold text-blue-950 dark:text-blue-200 ring-1 ring-blue-300 dark:ring-blue-800/60'
                        : 'hover:bg-stone-50 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    <td className="px-4 py-3 font-sans font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>}
                      {step.name}
                    </td>
                    <td className="px-4 py-3 text-stone-400 dark:text-stone-400 font-semibold">{step.step >= 0 ? `+${step.step}` : step.step}</td>
                    <td className="px-4 py-3 text-blue-800 dark:text-blue-300 font-bold">{formatValue(step.calculatedPt, 'pt')} pt</td>
                    <td className="px-4 py-3 text-sky-800 dark:text-sky-300">{formatValue(step.calculatedPx, 'px')} px</td>
                    <td className="px-4 py-3 text-emerald-800 dark:text-emerald-300">{formatValue(step.calculatedMm, 'mm')} mm</td>
                    <td className="px-4 py-3 text-indigo-800 dark:text-indigo-300">{formatValue(step.calculatedEm, 'em')} em</td>
                    <td className="px-4 py-3 text-stone-800 dark:text-stone-300">{formatValue(step.lineHeightPt, 'pt')} pt ({formatValue(step.lineHeightPx, 'px')} px)</td>
                    <td className="px-4 py-3 text-amber-800 dark:text-amber-300 font-bold">
                      {step.baselineFit}× {baselineStepPt}pt units
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
