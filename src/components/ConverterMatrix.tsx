import React, { useState, useMemo } from 'react';
import { Unit, ReferenceConfig } from '../types';
import { 
  UNITS_INFO, 
  convertUnit, 
  getAllConversions, 
  formatValue, 
  parseUnitString, 
  getTapeMeasureFraction, 
  parseFractionOrDecimal 
} from '../utils/converters';
import { Copy, Check, ArrowRightLeft, Sparkles, Plus, Minus, Layers, FileCode, CheckCircle2, ChevronRight, Ruler, MoveHorizontal, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { RelativeScaleRuler } from './RelativeScaleRuler';
import { DataUnitsConverter } from './DataUnitsConverter';

interface ConverterMatrixProps {
  config: ReferenceConfig;
  onChangeConfig: (newConfig: Partial<ReferenceConfig>) => void;
}

export const ConverterMatrix: React.FC<ConverterMatrixProps> = ({ config, onChangeConfig }) => {
  // Active primary input state
  const [activeUnit, setActiveUnit] = useState<Unit>('pt');
  const [inputValue, setInputValue] = useState<number>(12);
  const [rawText, setRawText] = useState<string>('12');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [offsetInches, setOffsetInches] = useState<number>(0);

  // Tape measure fraction graduation precision (1/16 standard tape, 1/32 fine, 1/64 precision)
  const [tapePrecision, setTapePrecision] = useState<16 | 32 | 64>(16);

  // Batch conversion state
  const [batchInput, setBatchInput] = useState<string>('8px, 12pt, 16px, 24px, 32px, 48px, 72pt');
  const [batchCopied, setBatchCopied] = useState<boolean>(false);

  // Calculate all unit conversions from the active input
  const conversions = useMemo(() => {
    return getAllConversions(inputValue, activeUnit, config);
  }, [inputValue, activeUnit, config]);

  // Tape measure fraction computed for the inch value
  const inchTapeFraction = useMemo(() => {
    return getTapeMeasureFraction(conversions.in, tapePrecision);
  }, [conversions.in, tapePrecision]);

  // Synchronize ruler changes directly back to all unit conversion boxes
  const handleRulerValueChange = (newInches: number) => {
    const safeInches = Math.max(0, Number(newInches.toFixed(4)));

    let newValForActiveUnit: number;
    switch (activeUnit) {
      case 'in':
        newValForActiveUnit = Number(safeInches.toFixed(3));
        break;
      case 'pt':
        newValForActiveUnit = Number((safeInches * 72).toFixed(2));
        break;
      case 'mm':
        newValForActiveUnit = Number((safeInches * 25.4).toFixed(2));
        break;
      case 'px':
        newValForActiveUnit = Number((safeInches * config.dpi).toFixed(1));
        break;
      case 'pc':
        newValForActiveUnit = Number((safeInches * 6).toFixed(3));
        break;
      case 'cm':
        newValForActiveUnit = Number((safeInches * 2.54).toFixed(3));
        break;
      case 'em':
      case 'rem':
        newValForActiveUnit = Number(((safeInches * config.dpi) / config.baseFontSizePx).toFixed(3));
        break;
      case 'twip':
        newValForActiveUnit = Math.round(safeInches * 1440);
        break;
      default:
        const converted = getAllConversions(safeInches, 'in', config);
        newValForActiveUnit = Number((converted[activeUnit] || safeInches).toFixed(3));
        break;
    }

    setInputValue(newValForActiveUnit);
    setRawText(newValForActiveUnit.toString());
  };

  // Handle user typing into any unit card
  const handleUnitInputChange = (val: string, unit: Unit) => {
    setActiveUnit(unit);
    setRawText(val);

    if (unit === 'in') {
      const parsed = parseFractionOrDecimal(val);
      if (parsed !== null) {
        setInputValue(parsed);
      } else if (val === '' || val === '-') {
        setInputValue(0);
      }
    } else {
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) {
        setInputValue(parsed);
      } else if (val === '' || val === '-') {
        setInputValue(0);
      }
    }
  };

  const handleQuickCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // Steppers and multipliers
  const applyMultiplier = (factor: number) => {
    const newVal = Number((inputValue * factor).toFixed(3));
    setInputValue(newVal);
    setRawText(newVal.toString());
  };

  const applyDelta = (delta: number) => {
    const newVal = Math.max(0, Number((inputValue + delta).toFixed(3)));
    setInputValue(newVal);
    setRawText(newVal.toString());
  };

  // Primary focal units to show in large cards
  const primaryUnits: Unit[] = ['pt', 'mm', 'px', 'in', 'em', 'pc'];
  const secondaryUnits: Unit[] = ['cm', 'rem', 'vw', 'vh', 'ch', 'twip'];

  // Parse batch input items
  const batchList = useMemo(() => {
    const tokens = batchInput.split(/[,;\n]+/).map((t) => t.trim()).filter(Boolean);
    return tokens.map((token) => {
      const parsed = parseUnitString(token, 'px') || { value: 0, unit: 'px' as Unit };
      const all = getAllConversions(parsed.value, parsed.unit, config);
      return {
        raw: token,
        sourceValue: parsed.value,
        sourceUnit: parsed.unit,
        all,
      };
    });
  }, [batchInput, config]);

  const copyBatchAsCSS = () => {
    const cssVars = batchList
      .map((item, idx) => {
        const pt = formatValue(item.all.pt, 'pt');
        const px = formatValue(item.all.px, 'px');
        const rem = formatValue(item.all.rem, 'rem');
        return `  --size-step-${idx + 1}: ${px}px; /* ${pt}pt | ${rem}rem | ${formatValue(item.all.mm, 'mm')}mm */`;
      })
      .join('\n');
    const fullSnippet = `:root {\n${cssVars}\n}`;
    navigator.clipboard.writeText(fullSnippet);
    setBatchCopied(true);
    setTimeout(() => setBatchCopied(false), 2000);
  };

  // Calculate visual proportion relative to 1 inch and 100mm
  const currentInches = conversions.in;
  const clampedWidthPercent = Math.min(100, Math.max(2, (currentInches / 5) * 100));

  return (
    <div id="converter-matrix-container" className="space-y-8">
      
      {/* Top Banner / Hero Title */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-stone-900 text-stone-100 font-mono">
                Universal DTP Matrix
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Live Dynamic Reciprocal Engine
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mt-2 font-sans">
              Instant Graphic Design & Typography Converter
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl mt-1 leading-relaxed">
              Type in any unit box below to compute high-precision conversions across traditional print points, picas, metric millimeters, standard inches, web pixels, and fluid em units.
            </p>
          </div>

          {/* Steppers & Quick Math Multipliers */}
          <div className="flex flex-wrap items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200/80">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider px-2">
              Quick Math:
            </div>
            <div className="flex items-center gap-1">
              <button
                id="btn-sub-1"
                onClick={() => applyDelta(-1)}
                className="px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold border border-stone-200 shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                title="Subtract 1 from active unit"
              >
                <Minus className="w-3 h-3" /> 1
              </button>
              <button
                id="btn-add-1"
                onClick={() => applyDelta(1)}
                className="px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold border border-stone-200 shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                title="Add 1 to active unit"
              >
                <Plus className="w-3 h-3" /> 1
              </button>
            </div>
            <div className="h-4 w-px bg-stone-200 mx-1"></div>
            <div className="flex items-center gap-1">
              <button
                id="btn-mult-half"
                onClick={() => applyMultiplier(0.5)}
                className="px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold border border-stone-200 shadow-2xs cursor-pointer transition-colors"
              >
                ½×
              </button>
              <button
                id="btn-mult-1-5"
                onClick={() => applyMultiplier(1.5)}
                className="px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold border border-stone-200 shadow-2xs cursor-pointer transition-colors"
                title="1.5x (Classic Leading multiplier)"
              >
                1.5×
              </button>
              <button
                id="btn-mult-2"
                onClick={() => applyMultiplier(2)}
                className="px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold border border-stone-200 shadow-2xs cursor-pointer transition-colors"
                title="2x (Retina / Double)"
              >
                2×
              </button>
              <button
                id="btn-mult-4"
                onClick={() => applyMultiplier(4)}
                className="px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold border border-stone-200 shadow-2xs cursor-pointer transition-colors"
                title="4x (Grid Step)"
              >
                4×
              </button>
            </div>
          </div>
        </div>

        {/* Visual Measurement Gauge Bar & Synchronized Scale Gauge */}
        <div className="mt-6 pt-5 border-t border-stone-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-semibold text-stone-600 gap-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Synchronized Scale Gauge & Visual Proportions
            </span>
            <span className="font-mono text-stone-800">
              {formatValue(conversions.pt, 'pt')} pt = {formatValue(conversions.mm, 'mm')} mm = {formatValue(conversions.px, 'px')} px ({formatValue(conversions.in, 'in')} in)
            </span>
          </div>

          {/* Interactive Ruler Controls: Synchronized Value Slider & Position Slider */}
          <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-2xs space-y-3">
            {/* Primary Slider: Ruler Measurement Value (Directly synchronizes all conversion boxes) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Ruler className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-bold text-stone-900">Ruler Measurement Value:</span>
                <span className="font-mono text-xs font-bold text-amber-700 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded shadow-2xs">
                  {formatValue(conversions.in, 'in')}&quot; {inchTapeFraction.unicodeText ? `(${inchTapeFraction.unicodeText}")` : ''}
                </span>
                <span className="text-[11px] font-mono font-medium text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                  {formatValue(conversions.mm, 'mm')} mm
                </span>
                <span className="text-[11px] font-mono font-medium text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                  {formatValue(conversions.pt, 'pt')} pt
                </span>
                <span className="text-[11px] font-mono font-medium text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                  {formatValue(conversions.px, 'px')} px
                </span>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1 text-[11px] font-mono flex-wrap">
                <span className="text-stone-400 mr-1 text-[10px] uppercase font-bold tracking-wider">Presets:</span>
                {[
                  { label: '¼"', val: 0.25 },
                  { label: '½"', val: 0.5 },
                  { label: '1"', val: 1.0 },
                  { label: '2"', val: 2.0 },
                  { label: '3"', val: 3.0 },
                  { label: 'Card (3.37")', val: 3.37 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleRulerValueChange(preset.val)}
                    className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                      Math.abs(conversions.in - preset.val) < 0.02
                        ? 'bg-amber-600 text-white border-amber-600 font-bold'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider Bar */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-stone-400 font-bold">0&quot;</span>
              <input
                id="ruler-measurement-slider"
                type="range"
                min="0"
                max={Math.max(5, Math.ceil(conversions.in * 1.25))}
                step="0.0625"
                value={conversions.in}
                onChange={(e) => handleRulerValueChange(parseFloat(e.target.value) || 0)}
                className="flex-1 h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                title="Slide ruler measurement to update all conversion boxes (1/16 inch tape measure steps)"
              />
              <span className="text-[11px] font-mono text-stone-400 font-bold">
                {Math.max(5, Math.ceil(conversions.in * 1.25))}&quot;
              </span>
            </div>

            {/* Secondary Controls: Caliper Position Slider */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
              <div className="flex items-center gap-2 text-stone-600 flex-wrap">
                <MoveHorizontal className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-[11px] font-medium">Slide Caliper Position along Ruler:</span>
                <span className="font-mono text-[11px] text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">
                  Start at {offsetInches.toFixed(2)}&quot; ({(offsetInches * 25.4).toFixed(1)} mm)
                </span>
                {offsetInches > 0 && (
                  <span className="text-[10px] font-mono text-stone-400 hidden md:inline">
                    [Window: {offsetInches.toFixed(2)}&quot; → {(offsetInches + conversions.in).toFixed(2)}&quot;]
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
                <input
                  type="range"
                  min="0"
                  max={Math.max(3, Math.ceil(conversions.in * 1.25) - 1)}
                  step="0.0625"
                  value={offsetInches}
                  onChange={(e) => setOffsetInches(parseFloat(e.target.value) || 0)}
                  className="flex-1 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-600"
                  title="Slide measurement position along ruler"
                />
                <button
                  type="button"
                  onClick={() => setOffsetInches(0)}
                  disabled={offsetInches === 0}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded border transition-colors cursor-pointer shrink-0 ${
                    offsetInches === 0
                      ? 'bg-stone-50 text-stone-300 border-stone-100 cursor-not-allowed'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Align to 0
                </button>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-stone-100/90 rounded-2xl p-3 border border-stone-200 space-y-3 shadow-2xs">
            {/* Top Ruler: Relative Scale Gauge with Measurement Lines */}
            <RelativeScaleRuler
              inputValue={inputValue}
              activeUnit={activeUnit}
              inches={conversions.in}
              millimeters={conversions.mm}
              points={conversions.pt}
              pixels={conversions.px}
              offsetInches={offsetInches}
              onChangeOffset={setOffsetInches}
              onChangeValue={handleRulerValueChange}
              maxInches={5}
            />

            {/* Data Units Conversions Section (KB • MB • GB • TB) in place of the black comparison ruler */}
            <DataUnitsConverter />
          </div>
        </div>
      </div>

      {/* Primary 6-Card High-Visibility Conversion Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-stone-900"></span>
            Primary Typographic & Layout Units
          </h3>
          <span className="text-xs text-stone-500">
            Click any box to edit — others synchronize instantly
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {primaryUnits.map((unitKey) => {
            const info = UNITS_INFO[unitKey];
            const isEditing = activeUnit === unitKey;
            const valueDisplay = isEditing ? rawText : formatValue(conversions[unitKey], unitKey);
            const copyText = unitKey === 'in'
              ? `${formatValue(conversions.in, 'in')} in (${inchTapeFraction.unicodeText}")`
              : `${formatValue(conversions[unitKey], unitKey)}${unitKey}`;

            return (
              <div
                key={unitKey}
                id={`card-unit-${unitKey}`}
                className={`relative rounded-2xl p-5 border transition-all duration-200 bg-white ${
                  isEditing
                    ? 'border-stone-900 ring-2 ring-stone-900/10 shadow-md'
                    : 'border-stone-200 hover:border-stone-300 hover:shadow-xs'
                }`}
              >
                {/* Header of Unit Card */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-extrabold uppercase font-mono ${info.badgeBg}`}>
                      {info.symbol}
                    </span>
                    <span className="font-bold text-sm text-stone-900">{info.name}</span>
                    {unitKey === 'in' && (
                      <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200/70 dark:border-amber-800/60 font-mono">
                        Tape Fraction
                      </span>
                    )}
                  </div>

                  <button
                    id={`btn-copy-${unitKey}`}
                    onClick={() => handleQuickCopy(copyText, unitKey)}
                    className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    title={`Copy ${copyText}`}
                  >
                    {copiedKey === unitKey ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Input Field with Unit Label */}
                {unitKey === 'in' ? (
                  <div className="flex items-center rounded-xl border border-stone-200 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-900/60 px-3 py-2 focus-within:bg-white dark:focus-within:bg-stone-900 focus-within:border-stone-900 dark:focus-within:border-stone-700 focus-within:ring-1 focus-within:ring-stone-900 dark:focus-within:ring-0 transition-all">
                    {/* Decimal Input Section */}
                    <div className="flex-1 min-w-0 flex items-center">
                      <input
                        id={`input-${unitKey}`}
                        type="text"
                        value={valueDisplay}
                        onChange={(e) => handleUnitInputChange(e.target.value, unitKey)}
                        onFocus={() => {
                          if (activeUnit !== unitKey) {
                            setActiveUnit(unitKey);
                            setRawText(formatValue(conversions[unitKey], unitKey));
                          }
                        }}
                        placeholder="1.5 or 1 1/2"
                        className="w-full text-2xl font-bold font-mono text-stone-900 dark:text-stone-100 bg-transparent focus:outline-none tracking-tight border-none p-0 focus:ring-0 shadow-none"
                        title="Enter decimal or fraction (e.g. 1.5 or 1 1/2)"
                      />
                    </div>

                    {/* Vertical Dividing Line */}
                    <div className="h-7 w-px bg-stone-300 dark:bg-stone-700/60 mx-2.5 shrink-0" aria-hidden="true" />

                    {/* Tape Measure Fraction Conversion Section */}
                    <div
                      id="inch-fraction-display"
                      onClick={() => handleQuickCopy(`${inchTapeFraction.unicodeText} in`, 'inch-fraction')}
                      className="flex items-center gap-1 shrink-0 cursor-pointer group hover:opacity-85 transition-opacity"
                      title={`Tape Measure Fraction: ${inchTapeFraction.text}" (${inchTapeFraction.nearestMarkDescription}). Click to copy.`}
                    >
                      <div className="flex items-baseline font-mono">
                        {!inchTapeFraction.isExact && (
                          <span className="text-xs font-bold text-amber-500 mr-0.5" title="Approximate to nearest tape mark">
                            ≈
                          </span>
                        )}
                        {/* Whole number part */}
                        {inchTapeFraction.whole !== 0 && (
                          <span className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                            {inchTapeFraction.whole}
                          </span>
                        )}
                        {/* Fractional part */}
                        {inchTapeFraction.numerator > 0 ? (
                          <span className={`inline-flex items-baseline text-amber-600 dark:text-amber-400 font-bold ${inchTapeFraction.whole !== 0 ? 'ml-1' : ''}`}>
                            {inchTapeFraction.unicodeFractionChar ? (
                              <span className="text-2xl font-bold leading-none font-mono">
                                {inchTapeFraction.unicodeFractionChar}
                              </span>
                            ) : (
                              <span className="inline-flex flex-col items-center justify-center leading-none text-xs -translate-y-0.5">
                                <span className="font-bold border-b border-current pb-0.5 leading-none px-0.5 text-[11px]">
                                  {inchTapeFraction.numerator}
                                </span>
                                <span className="font-bold pt-0.5 leading-none px-0.5 text-[11px]">
                                  {inchTapeFraction.denominator}
                                </span>
                              </span>
                            )}
                          </span>
                        ) : (
                          inchTapeFraction.whole === 0 && (
                            <span className="text-2xl font-bold text-stone-900 dark:text-stone-100">0</span>
                          )
                        )}
                      </div>

                      {/* Unit label or copied notification */}
                      <div className="flex items-center pl-1">
                        {copiedKey === 'inch-fraction' ? (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 font-mono">
                            <Check className="w-3 h-3" /> copied
                          </span>
                        ) : (
                          <span className="text-sm font-bold font-mono text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                            {info.symbol}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center rounded-xl border border-stone-200 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-900/60 px-3 py-2 focus-within:bg-white dark:focus-within:bg-stone-900 focus-within:border-stone-900 dark:focus-within:border-stone-700 focus-within:ring-1 focus-within:ring-stone-900 dark:focus-within:ring-0 transition-all">
                    <input
                      id={`input-${unitKey}`}
                      type="text"
                      value={valueDisplay}
                      onChange={(e) => handleUnitInputChange(e.target.value, unitKey)}
                      onFocus={() => {
                        if (activeUnit !== unitKey) {
                          setActiveUnit(unitKey);
                          setRawText(formatValue(conversions[unitKey], unitKey));
                        }
                      }}
                      className="w-full text-2xl font-bold font-mono text-stone-900 dark:text-stone-100 bg-transparent focus:outline-none tracking-tight border-none p-0 focus:ring-0 shadow-none"
                    />
                    <span className="text-sm font-bold font-mono text-stone-400 dark:text-stone-500 pl-2">
                      {info.symbol}
                    </span>
                  </div>
                )}

                {/* Description & Common Usage */}
                {unitKey === 'in' ? (
                  <div className="mt-3 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 font-medium text-stone-700 dark:text-stone-300">
                        <Ruler className="w-3 h-3 text-amber-500" />
                        <span>Tape fraction:</span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                          {inchTapeFraction.unicodeText}&quot;
                        </span>
                      </div>

                      {/* Tape Graduation Selector */}
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-stone-400 font-mono">Tape:</span>
                        {([16, 32, 64] as const).map((denom) => (
                          <button
                            key={denom}
                            type="button"
                            onClick={() => setTapePrecision(denom)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                              tapePrecision === denom
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-700'
                                : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                            }`}
                            title={`Set tape measure fraction graduation to 1/${denom}"`}
                          >
                            1/{denom}&quot;
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-[10px] text-stone-400 font-mono">
                      {inchTapeFraction.isExact
                        ? `${inchTapeFraction.nearestMarkDescription} • Exactly 25.4 mm or 72 pt`
                        : `${inchTapeFraction.nearestMarkDescription} • Decimal: ${conversions.in.toFixed(4)}"`}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 text-[11px] text-stone-500 leading-tight">
                    <p className="font-medium text-stone-600">{info.description}</p>
                    <p className="text-[10px] text-stone-400 mt-1 truncate font-mono">
                      Use: {info.commonUse}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary & Relative Units Row */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-stone-400"></span>
            Secondary, Web & Precision Units
          </h3>
          <span className="text-xs text-stone-500">
            Viewport, Root Em, Twip (1/20 pt), Character width
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {secondaryUnits.map((unitKey) => {
            const info = UNITS_INFO[unitKey];
            const isEditing = activeUnit === unitKey;
            const valDisplay = isEditing ? rawText : formatValue(conversions[unitKey], unitKey);
            const copyText = `${formatValue(conversions[unitKey], unitKey)}${unitKey}`;

            return (
              <div
                key={unitKey}
                id={`card-secondary-${unitKey}`}
                className={`bg-white rounded-xl p-3.5 border transition-all ${
                  isEditing
                    ? 'border-stone-900 ring-1 ring-stone-900/10 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold font-mono text-stone-700 uppercase">
                    {info.name}
                  </span>
                  <button
                    onClick={() => handleQuickCopy(copyText, unitKey)}
                    className="text-stone-400 hover:text-stone-900 cursor-pointer p-0.5"
                    title={`Copy ${copyText}`}
                  >
                    {copiedKey === unitKey ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <div className="flex items-baseline gap-1">
                  <input
                    type="text"
                    value={valDisplay}
                    onChange={(e) => handleUnitInputChange(e.target.value, unitKey)}
                    onFocus={() => {
                      if (activeUnit !== unitKey) {
                        setActiveUnit(unitKey);
                        setRawText(formatValue(conversions[unitKey], unitKey));
                      }
                    }}
                    className="w-full text-base font-bold font-mono text-stone-900 dark:text-stone-100 bg-transparent focus:outline-none border-none p-0 focus:ring-0 shadow-none"
                  />
                  <span className="text-xs font-semibold text-stone-400 dark:text-stone-500 font-mono">
                    {info.symbol}
                  </span>
                </div>
                <div className="text-[9px] text-stone-400 truncate mt-1">
                  {info.category}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preset Quick-Click Measurement Chips (Cheat Sheet) */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Standard Graphic Design & Typography Benchmarks
          </h3>
          <span className="text-xs text-stone-500">
            Click any benchmark to load into converter
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Typographic Benchmarks */}
          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
              Typography Sizing
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '8 pt (Caption)', val: 8, unit: 'pt' as Unit },
                { label: '10 pt (Book Body)', val: 10, unit: 'pt' as Unit },
                { label: '12 pt (Print Standard)', val: 12, unit: 'pt' as Unit },
                { label: '16 px (1 rem Web)', val: 16, unit: 'px' as Unit },
                { label: '24 pt (Subheading)', val: 24, unit: 'pt' as Unit },
                { label: '72 pt (1 Inch Display)', val: 72, unit: 'pt' as Unit },
              ].map((bench) => (
                <button
                  key={bench.label}
                  onClick={() => {
                    setActiveUnit(bench.unit);
                    setInputValue(bench.val);
                    setRawText(bench.val.toString());
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-stone-900 hover:text-white text-stone-800 rounded-md text-xs font-medium border border-stone-200 shadow-2xs transition-colors cursor-pointer"
                >
                  {bench.label}
                </button>
              ))}
            </div>
          </div>

          {/* Print & Editorial Layout Benchmarks */}
          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
              Print & Margins
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '3 mm (Standard Bleed)', val: 3, unit: 'mm' as Unit },
                { label: '12.7 mm (½ in Margin)', val: 12.7, unit: 'mm' as Unit },
                { label: '19.05 mm (¾ in Margin)', val: 19.05, unit: 'mm' as Unit },
                { label: '25.4 mm (1 in Margin)', val: 25.4, unit: 'mm' as Unit },
                { label: '1 Pica (12 pt Gutter)', val: 1, unit: 'pc' as Unit },
                { label: '3.5 in (Card Width)', val: 3.5, unit: 'in' as Unit },
              ].map((bench) => (
                <button
                  key={bench.label}
                  onClick={() => {
                    setActiveUnit(bench.unit);
                    setInputValue(bench.val);
                    setRawText(bench.val.toString());
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-stone-900 hover:text-white text-stone-800 rounded-md text-xs font-medium border border-stone-200 shadow-2xs transition-colors cursor-pointer"
                >
                  {bench.label}
                </button>
              ))}
            </div>
          </div>

          {/* Web & Digital Spacing Tokens */}
          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
              UI Spacing Tokens
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '4 px (0.25 rem)', val: 4, unit: 'px' as Unit },
                { label: '8 px (0.5 rem)', val: 8, unit: 'px' as Unit },
                { label: '16 px (1.0 rem)', val: 16, unit: 'px' as Unit },
                { label: '24 px (1.5 rem)', val: 24, unit: 'px' as Unit },
                { label: '32 px (2.0 rem)', val: 32, unit: 'px' as Unit },
                { label: '64 px (4.0 rem)', val: 64, unit: 'px' as Unit },
              ].map((bench) => (
                <button
                  key={bench.label}
                  onClick={() => {
                    setActiveUnit(bench.unit);
                    setInputValue(bench.val);
                    setRawText(bench.val.toString());
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-stone-900 hover:text-white text-stone-800 rounded-md text-xs font-medium border border-stone-200 shadow-2xs transition-colors cursor-pointer"
                >
                  {bench.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Batch Converter & Code Snippet Generator */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-stone-700" />
              Batch Multi-Value Conversion Table
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Enter a list of measurements (e.g. typography scales, padding arrays, or margin steps) separated by commas.
            </p>
          </div>

          <button
            id="btn-copy-batch-css"
            onClick={copyBatchAsCSS}
            className="flex items-center gap-2 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            {batchCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{batchCopied ? 'Copied CSS Variables!' : 'Copy CSS Variables'}</span>
          </button>
        </div>

        {/* Input Bar */}
        <div>
          <input
            id="input-batch-values"
            type="text"
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            placeholder="e.g. 10pt, 12pt, 16px, 24px, 32px, 48px, 64px"
            className="w-full bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-2.5 text-sm font-mono text-stone-900 dark:text-stone-100 focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-700"
          />
        </div>

        {/* Generated Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-stone-200">
          <table className="min-w-full divide-y divide-stone-200 text-left text-xs font-mono">
            <thead className="bg-stone-50 dark:bg-stone-900/90 text-stone-600 dark:text-stone-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Input</th>
                <th className="px-4 py-3 text-blue-700 dark:text-blue-300">Points (pt)</th>
                <th className="px-4 py-3 text-emerald-700 dark:text-emerald-300">Millimeters (mm)</th>
                <th className="px-4 py-3 text-sky-700 dark:text-sky-300">Pixels (px @{config.dpi}dpi)</th>
                <th className="px-4 py-3 text-amber-700 dark:text-amber-300">Inches (in)</th>
                <th className="px-4 py-3 text-indigo-700 dark:text-indigo-300">Em / Rem</th>
                <th className="px-4 py-3 text-rose-700 dark:text-rose-300">Picas (pc)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80 bg-white dark:bg-stone-900/40 text-stone-800 dark:text-stone-200">
              {batchList.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/60 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-stone-900 dark:text-stone-100">{row.raw}</td>
                  <td className="px-4 py-2.5 font-semibold text-blue-800 dark:text-blue-300">{formatValue(row.all.pt, 'pt')} pt</td>
                  <td className="px-4 py-2.5 text-emerald-800 dark:text-emerald-300">{formatValue(row.all.mm, 'mm')} mm</td>
                  <td className="px-4 py-2.5 text-sky-800 dark:text-sky-300">{formatValue(row.all.px, 'px')} px</td>
                  <td className="px-4 py-2.5 text-amber-800 dark:text-amber-300">{formatValue(row.all.in, 'in')} in</td>
                  <td className="px-4 py-2.5 text-indigo-800 dark:text-indigo-300">{formatValue(row.all.rem, 'rem')} rem</td>
                  <td className="px-4 py-2.5 text-rose-800 dark:text-rose-300">{formatValue(row.all.pc, 'pc')} pc</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
