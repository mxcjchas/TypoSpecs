import React, { useState, useMemo } from 'react';
import { 
  HardDrive, 
  Database, 
  Copy, 
  Check, 
  ArrowRightLeft, 
  Layers, 
  Info, 
  SlidersHorizontal, 
  Sparkles, 
  RotateCcw,
  Cpu,
  FileCode,
  CheckCircle2
} from 'lucide-react';

export type DataUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';

interface UnitDef {
  key: DataUnit;
  name: string;
  binarySymbol: string;
  decimalSymbol: string;
  power: number; // 0 for B, 1 for KB, 2 for MB, 3 for GB, 4 for TB, 5 for PB
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  description: string;
  designExample: string;
}

const DATA_UNITS_DEF: Record<DataUnit, UnitDef> = {
  B: {
    key: 'B',
    name: 'Bytes',
    binarySymbol: 'B',
    decimalSymbol: 'B',
    power: 0,
    badgeBg: 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200',
    badgeText: 'text-stone-700 dark:text-stone-300',
    borderColor: 'border-stone-300 dark:border-stone-700',
    description: 'Fundamental digital storage unit (8 bits), encodes a single ASCII character.',
    designExample: 'Single glyph encoding, color hex codes, SVG path byte offsets',
  },
  KB: {
    key: 'KB',
    name: 'Kilobytes',
    binarySymbol: 'KiB',
    decimalSymbol: 'KB',
    power: 1,
    badgeBg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300',
    badgeText: 'text-blue-700 dark:text-blue-400',
    borderColor: 'border-blue-300 dark:border-blue-800',
    description: '1,024 Bytes (binary) or 1,000 Bytes (decimal). Standard for web assets & typefaces.',
    designExample: 'WOFF2 fonts (20–90 KB), SVG icons (2–8 KB), minified CSS stylesheets',
  },
  MB: {
    key: 'MB',
    name: 'Megabytes',
    binarySymbol: 'MiB',
    decimalSymbol: 'MB',
    power: 2,
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300',
    badgeText: 'text-emerald-700 dark:text-emerald-400',
    borderColor: 'border-emerald-300 dark:border-emerald-800',
    description: '1,024 KB (binary) or 1,000 KB (decimal). Primary unit for images, audio & print files.',
    designExample: 'High-res photos (3–10 MB), vector Illustrator PDFs, uncompressed audio',
  },
  GB: {
    key: 'GB',
    name: 'Gigabytes',
    binarySymbol: 'GiB',
    decimalSymbol: 'GB',
    power: 3,
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300',
    badgeText: 'text-amber-700 dark:text-amber-400',
    borderColor: 'border-amber-300 dark:border-amber-800',
    description: '1,024 MB (binary) or 1,000 MB (decimal). OS RAM memory, video files, SSD allocations.',
    designExample: '4K video footage (~15 GB/hr), 3D render cache, system RAM (16–64 GB)',
  },
  TB: {
    key: 'TB',
    name: 'Terabytes',
    binarySymbol: 'TiB',
    decimalSymbol: 'TB',
    power: 4,
    badgeBg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300',
    badgeText: 'text-purple-700 dark:text-purple-400',
    borderColor: 'border-purple-300 dark:border-purple-800',
    description: '1,024 GB (binary) or 1,000 GB (decimal). Modern external drives, cloud storage pools.',
    designExample: 'Creative project archives, video production arrays, backup drives',
  },
  PB: {
    key: 'PB',
    name: 'Petabytes',
    binarySymbol: 'PiB',
    decimalSymbol: 'PB',
    power: 5,
    badgeBg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300',
    badgeText: 'text-rose-700 dark:text-rose-400',
    borderColor: 'border-rose-300 dark:border-rose-800',
    description: '1,024 TB (binary) or 1,000 TB (decimal). Datacenter, large-scale media CDN scale.',
    designExample: 'Enterprise cloud backups, video streaming server storage clusters',
  },
};

const PRESETS = [
  { label: '50 KB', unit: 'KB' as DataUnit, val: 50, note: 'WOFF2 WebFont' },
  { label: '250 KB', unit: 'KB' as DataUnit, val: 250, note: 'WebP Image' },
  { label: '1.44 MB', unit: 'MB' as DataUnit, val: 1.44, note: '3.5" Floppy' },
  { label: '5 MB', unit: 'MB' as DataUnit, val: 5, note: 'Vector PDF' },
  { label: '700 MB', unit: 'MB' as DataUnit, val: 700, note: 'Standard CD' },
  { label: '1 GB', unit: 'GB' as DataUnit, val: 1, note: '1 Gigabyte' },
  { label: '4.7 GB', unit: 'GB' as DataUnit, val: 4.7, note: 'Standard DVD' },
  { label: '25 GB', unit: 'GB' as DataUnit, val: 25, note: 'Blu-ray Disc' },
  { label: '512 GB', unit: 'GB' as DataUnit, val: 512, note: 'NVMe SSD' },
  { label: '1 TB', unit: 'TB' as DataUnit, val: 1, note: '1 Terabyte Drive' },
];

export const DataUnitsConverter: React.FC = () => {
  // Current active unit being edited and its user input string
  const [activeUnit, setActiveUnit] = useState<DataUnit>('MB');
  const [activeInputString, setActiveInputString] = useState<string>('1024');
  
  // Standard base mode: binary (1024) vs decimal (1000)
  const [baseMode, setBaseMode] = useState<'binary' | 'decimal'>('binary');
  
  // Clipboard copied tracker
  const [copiedUnit, setCopiedUnit] = useState<string | null>(null);

  // Toggle for additional units (Bytes, Bits, Petabytes)
  const [showExtendedUnits, setShowExtendedUnits] = useState<boolean>(false);
  const [showDiffExplanation, setShowDiffExplanation] = useState<boolean>(false);

  // Base conversion factor (1024 or 1000)
  const multiplier = baseMode === 'binary' ? 1024 : 1000;

  // Numerical value parsed from active input
  const numericInputValue = useMemo(() => {
    const parsed = parseFloat(activeInputString.replace(/,/g, ''));
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }, [activeInputString]);

  // Compute total bytes based on active unit
  const totalBytes = useMemo(() => {
    const power = DATA_UNITS_DEF[activeUnit].power;
    return numericInputValue * Math.pow(multiplier, power);
  }, [numericInputValue, activeUnit, multiplier]);

  // Compute converted values for all units
  const conversions = useMemo(() => {
    const result: Record<DataUnit, number> = {
      B: 0,
      KB: 0,
      MB: 0,
      GB: 0,
      TB: 0,
      PB: 0,
    };

    (Object.keys(DATA_UNITS_DEF) as DataUnit[]).forEach((unitKey) => {
      const power = DATA_UNITS_DEF[unitKey].power;
      result[unitKey] = totalBytes / Math.pow(multiplier, power);
    });

    return result;
  }, [totalBytes, multiplier]);

  // Format numbers for display cleanly (scientific notation only for extreme numbers)
  const formatDataValue = (val: number, isDirectInput: boolean): string => {
    if (isDirectInput) {
      return activeInputString;
    }
    if (val === 0) return '0';
    
    // For whole numbers or clean fractions
    if (val >= 1000000000000) {
      return val.toExponential(4);
    }
    if (val >= 1000) {
      // e.g. 1,024 or 1,048,576
      return val.toLocaleString('en-US', {
        maximumFractionDigits: 4,
      });
    }
    if (val >= 1) {
      // 1.5, 4.7
      const str = val.toFixed(4);
      return parseFloat(str).toLocaleString('en-US', {
        maximumFractionDigits: 4,
      });
    }
    if (val < 0.000001) {
      return val.toExponential(4);
    }
    // Small fractions
    return val.toFixed(6).replace(/\.?0+$/, '');
  };

  const handleInputChange = (rawVal: string, unitKey: DataUnit) => {
    setActiveUnit(unitKey);
    // Allow numbers and decimal points
    const cleaned = rawVal.replace(/[^0-9.]/g, '');
    // Ensure only single decimal point
    const parts = cleaned.split('.');
    const sanitized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
    setActiveInputString(sanitized);
  };

  const handleApplyPreset = (unit: DataUnit, val: number) => {
    setActiveUnit(unit);
    setActiveInputString(val.toString());
  };

  const handleMultiply = (factor: number) => {
    const newVal = Math.max(0, numericInputValue * factor);
    // Format cleanly
    const formatted = Number.isInteger(newVal) ? newVal.toString() : parseFloat(newVal.toFixed(4)).toString();
    setActiveInputString(formatted);
  };

  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedUnit(key);
      setTimeout(() => setCopiedUnit(null), 1800);
    }
  };

  // Primary 4 units requested by user: KB, MB, GB, TB
  const primaryUnits: DataUnit[] = ['KB', 'MB', 'GB', 'TB'];

  // Proportional fill calculation relative to 1 TB or next tier
  const proportionalBarPercent = useMemo(() => {
    if (conversions.TB >= 1) return 100;
    if (conversions.GB >= 1) return Math.min(100, (conversions.GB / (multiplier / 1)) * 100);
    if (conversions.MB >= 1) return Math.min(100, (conversions.MB / multiplier) * 100);
    return Math.min(100, (conversions.KB / multiplier) * 100);
  }, [conversions, multiplier]);

  return (
    <div id="data-units-conversions-section" className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
      {/* Section Header & Mode Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider font-sans">
                Data Units Conversions
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                KB • MB • GB • TB
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Interactive bi-directional memory & storage converter with real-time synchronization.
            </p>
          </div>
        </div>

        {/* Standard Mode Selector (Binary 1024 vs Decimal 1000) */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <div className="flex items-center bg-stone-100 dark:bg-stone-800/80 rounded-lg p-1 border border-stone-200 dark:border-stone-700/60 text-xs">
            <button
              type="button"
              id="btn-mode-binary"
              onClick={() => setBaseMode('binary')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                baseMode === 'binary'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="Binary Standard (IEC): 1 KiB/KB = 1,024 Bytes. Used by Windows, RAM, font files, and system memory."
            >
              Binary (1,024 B)
            </button>
            <button
              type="button"
              id="btn-mode-decimal"
              onClick={() => setBaseMode('decimal')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                baseMode === 'decimal'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="Decimal Standard (SI): 1 KB = 1,000 Bytes. Used by storage manufacturers (SSD, HDD), macOS, and networking."
            >
              Decimal (1,000 B)
            </button>
          </div>

          <button
            type="button"
            id="btn-toggle-extended-units"
            onClick={() => setShowExtendedUnits(!showExtendedUnits)}
            className={`px-2 py-1 rounded-md text-[11px] font-medium border cursor-pointer transition-colors ${
              showExtendedUnits
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                : 'bg-white dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            {showExtendedUnits ? 'Hide Bytes/PB' : '+ Bytes & PB'}
          </button>

          <button
            type="button"
            id="btn-toggle-diff-guide"
            onClick={() => setShowDiffExplanation(!showDiffExplanation)}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded cursor-pointer"
            title="Why does 1TB show as 931 GB in Windows?"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Explanatory Drawer for Binary vs Decimal difference */}
      {showDiffExplanation && (
        <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 text-xs space-y-1.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Binary (1,024) vs. Decimal (1,000) Explained
            </span>
            <button
              onClick={() => setShowDiffExplanation(false)}
              className="text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-200 font-bold px-1 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-amber-900 dark:text-amber-300/90 leading-relaxed">
            <strong>Drive Manufacturers</strong> advertise storage in base-10 decimal: 1 TB = 1,000,000,000,000 Bytes.
            Meanwhile, <strong>Windows & System RAM</strong> count in base-2 binary: 1 TiB = 1,024 × 1,024 × 1,024 × 1,024 = 1,099,511,627,776 Bytes.
            Dividing 1,000,000,000,000 by 1,024⁴ is why a retail &quot;1 TB&quot; drive appears as approximately <strong>931.32 GB</strong> in Windows!
          </p>
        </div>
      )}

      {/* Quick Presets & Multiplier Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100 dark:border-stone-800 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mr-1">
            Presets:
          </span>
          {PRESETS.map((p) => {
            const isSelected = activeUnit === p.unit && Math.abs(numericInputValue - p.val) < 0.001;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handleApplyPreset(p.unit, p.val)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                    : 'bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-700/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700/60'
                }`}
                title={`${p.note} (${p.label})`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Step Multipliers */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => handleMultiply(1 / multiplier)}
            className="px-2 py-0.5 rounded bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-700/80 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60 cursor-pointer"
            title={`Divide by ${multiplier}`}
          >
            ÷{multiplier}
          </button>
          <button
            type="button"
            onClick={() => handleMultiply(multiplier)}
            className="px-2 py-0.5 rounded bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-700/80 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60 cursor-pointer"
            title={`Multiply by ${multiplier}`}
          >
            ×{multiplier}
          </button>
          <button
            type="button"
            onClick={() => handleMultiply(0.5)}
            className="px-2 py-0.5 rounded bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-700/80 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60 cursor-pointer"
            title="Half (÷2)"
          >
            ½×
          </button>
          <button
            type="button"
            onClick={() => handleMultiply(2)}
            className="px-2 py-0.5 rounded bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-700/80 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60 cursor-pointer"
            title="Double (×2)"
          >
            2×
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('GB', 1)}
            className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer ml-1"
            title="Reset to 1 GB"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Primary 4 Unit Conversion Cards: KB, MB, GB, TB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {primaryUnits.map((unitKey) => {
          const def = DATA_UNITS_DEF[unitKey];
          const isEditing = activeUnit === unitKey;
          const displayVal = formatDataValue(conversions[unitKey], isEditing);
          const symbolLabel = baseMode === 'binary' ? def.binarySymbol : def.decimalSymbol;
          const copyText = `${displayVal} ${symbolLabel}`;

          return (
            <div
              key={unitKey}
              id={`data-card-${unitKey}`}
              className={`relative rounded-xl p-3.5 border transition-all duration-150 ${
                isEditing
                  ? 'bg-blue-50/30 dark:bg-blue-950/20 border-blue-400 dark:border-blue-700 ring-1 ring-blue-400/30 dark:ring-blue-700/30 shadow-xs'
                  : 'bg-stone-50/60 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800/80 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[11px] font-extrabold font-mono uppercase ${def.badgeBg}`}>
                    {symbolLabel}
                  </span>
                  <span className="font-bold text-xs text-stone-900 dark:text-stone-100 font-sans">
                    {def.name}
                  </span>
                </div>

                <button
                  type="button"
                  id={`btn-copy-data-${unitKey}`}
                  onClick={() => handleCopy(copyText, unitKey)}
                  className="p-1 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-white dark:hover:bg-stone-800 rounded transition-colors cursor-pointer"
                  title={`Copy ${copyText}`}
                >
                  {copiedUnit === unitKey ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Editable Input Box - Strictly with subtle border in dark mode per user styling instructions */}
              <div className="flex items-center rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 px-2.5 py-1.5 focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
                <input
                  id={`input-data-${unitKey}`}
                  type="text"
                  value={displayVal}
                  onChange={(e) => handleInputChange(e.target.value, unitKey)}
                  onFocus={() => {
                    if (activeUnit !== unitKey) {
                      setActiveUnit(unitKey);
                      setActiveInputString(formatDataValue(conversions[unitKey], false).replace(/,/g, ''));
                    }
                  }}
                  className="w-full text-lg font-bold font-mono text-stone-900 dark:text-stone-100 bg-transparent focus:outline-none tracking-tight border-none p-0 focus:ring-0 shadow-none"
                />
                <span className="text-xs font-mono font-bold text-stone-400 dark:text-stone-500 pl-1.5 shrink-0">
                  {symbolLabel}
                </span>
              </div>

              {/* Sub-text / Usage Info */}
              <div className="mt-2 text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1" title={def.designExample}>
                {def.designExample}
              </div>
            </div>
          );
        })}
      </div>

      {/* Extended Units Row: Bytes (B) and Petabytes (PB) */}
      {showExtendedUnits && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-100 dark:border-stone-800 animate-in fade-in duration-150">
          {(['B', 'PB'] as DataUnit[]).map((unitKey) => {
            const def = DATA_UNITS_DEF[unitKey];
            const isEditing = activeUnit === unitKey;
            const displayVal = formatDataValue(conversions[unitKey], isEditing);
            const symbolLabel = baseMode === 'binary' ? def.binarySymbol : def.decimalSymbol;
            const copyText = `${displayVal} ${symbolLabel}`;

            return (
              <div
                key={unitKey}
                id={`data-card-${unitKey}`}
                className={`rounded-xl p-3 border transition-all ${
                  isEditing
                    ? 'bg-blue-50/30 dark:bg-blue-950/20 border-blue-400 dark:border-blue-700 ring-1 ring-blue-400/30 shadow-xs'
                    : 'bg-stone-50/40 dark:bg-stone-800/30 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${def.badgeBg}`}>
                      {symbolLabel}
                    </span>
                    <span className="font-bold text-xs text-stone-900 dark:text-stone-100">{def.name}</span>
                    {unitKey === 'B' && (
                      <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">
                        ({(conversions.B * 8).toLocaleString()} bits)
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(copyText, unitKey)}
                    className="p-1 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded cursor-pointer"
                  >
                    {copiedUnit === unitKey ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 px-2 py-1">
                  <input
                    type="text"
                    value={displayVal}
                    onChange={(e) => handleInputChange(e.target.value, unitKey)}
                    onFocus={() => {
                      if (activeUnit !== unitKey) {
                        setActiveUnit(unitKey);
                        setActiveInputString(formatDataValue(conversions[unitKey], false).replace(/,/g, ''));
                      }
                    }}
                    className="w-full text-sm font-bold font-mono text-stone-900 dark:text-stone-100 bg-transparent focus:outline-none border-none p-0 focus:ring-0 shadow-none"
                  />
                  <span className="text-xs font-mono font-bold text-stone-400 pl-1 shrink-0">{symbolLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Proportional Hierarchy Bar & Quick Equivalence Reference */}
      <div className="bg-stone-50 dark:bg-stone-800/40 rounded-xl p-3 border border-stone-200 dark:border-stone-800/70 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
              Equivalence Breakdown:
            </span>
            <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
              1 TB = {multiplier.toLocaleString()} GB = {(multiplier * multiplier).toLocaleString()} MB = {(multiplier * multiplier * multiplier).toLocaleString()} KB
            </span>
          </div>

          <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
            Current: <strong className="text-stone-800 dark:text-stone-200">{formatDataValue(conversions.GB, false)} GB</strong> ({formatDataValue(conversions.MB, false)} MB)
          </div>
        </div>

        {/* Multi-tier Visual Scale Bar */}
        <div className="space-y-1">
          <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-linear-to-r from-blue-500 via-emerald-500 to-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(2, Math.min(100, proportionalBarPercent))}%` }}
              title={`Relative scale position: ${proportionalBarPercent.toFixed(1)}%`}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-stone-400 dark:text-stone-500 px-0.5">
            <span>0 KB</span>
            <span>1 MB</span>
            <span>1 GB</span>
            <span>1 TB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
