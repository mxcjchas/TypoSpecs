import { Unit, ReferenceConfig, UnitInfo, PresetPaper, ModularScalePreset, TypographyStep } from '../types';

export const UNITS_INFO: Record<Unit, UnitInfo> = {
  mm: {
    id: 'mm',
    name: 'Millimeter',
    symbol: 'mm',
    category: 'metric',
    description: 'International metric standard unit for print, editorial, and physical dimensioning.',
    commonUse: 'European & international print layouts, paper specs, bleeds, margins',
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    badgeText: 'text-emerald-700',
    borderColor: 'border-emerald-300',
  },
  em: {
    id: 'em',
    name: 'Em',
    symbol: 'em',
    category: 'relative',
    description: 'Typographic unit proportional to the current or inherited font size (historically the width of uppercase M).',
    commonUse: 'Responsive typography, margins, letter-spacing, scalable component padding',
    colorClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    badgeBg: 'bg-indigo-100 text-indigo-800',
    badgeText: 'text-indigo-700',
    borderColor: 'border-indigo-300',
  },
  rem: {
    id: 'rem',
    name: 'Root Em',
    symbol: 'rem',
    category: 'relative',
    description: 'Relative to the root <html> font-size (usually 16px default), immune to compounding font scaling.',
    commonUse: 'Modern web layout scaling, consistent design system spacing tokens',
    colorClass: 'text-violet-700 bg-violet-50 border-violet-200',
    badgeBg: 'bg-violet-100 text-violet-800',
    badgeText: 'text-violet-700',
    borderColor: 'border-violet-300',
  },
  px: {
    id: 'px',
    name: 'Pixel',
    symbol: 'px',
    category: 'digital',
    description: 'Picture element; standard digital screen raster display unit (1/96th of an inch in CSS standard).',
    commonUse: 'Screen UI design, web layouts, digital assets, raster export resolutions',
    colorClass: 'text-sky-700 bg-sky-50 border-sky-200',
    badgeBg: 'bg-sky-100 text-sky-800',
    badgeText: 'text-sky-700',
    borderColor: 'border-sky-300',
  },
  in: {
    id: 'in',
    name: 'Inch',
    symbol: 'in',
    category: 'imperial',
    description: 'Imperial physical unit. Exactly 25.4 mm or 72 PostScript points.',
    commonUse: 'North American print formats (US Letter, Tabloid), poster sizing, billboard layout',
    colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-800',
    badgeText: 'text-amber-700',
    borderColor: 'border-amber-300',
  },
  pt: {
    id: 'pt',
    name: 'Point',
    symbol: 'pt',
    category: 'typographic',
    description: 'Traditional typographic and DTP unit. 1 pt = 1/72 inch = ~0.3528 mm.',
    commonUse: 'Type sizing, leading/line-height, strokes, InDesign & Illustrator print specs',
    colorClass: 'text-blue-700 bg-blue-50 border-blue-200',
    badgeBg: 'bg-blue-100 text-blue-800',
    badgeText: 'text-blue-700',
    borderColor: 'border-blue-300',
  },
  cm: {
    id: 'cm',
    name: 'Centimeter',
    symbol: 'cm',
    category: 'metric',
    description: '10 millimeters. Common metric unit for signage and larger print formats.',
    commonUse: 'Posters, large format printing, packaging dimensions',
    colorClass: 'text-teal-700 bg-teal-50 border-teal-200',
    badgeBg: 'bg-teal-100 text-teal-800',
    badgeText: 'text-teal-700',
    borderColor: 'border-teal-300',
  },
  pc: {
    id: 'pc',
    name: 'Pica',
    symbol: 'pc',
    category: 'typographic',
    description: 'Traditional printing unit. Exactly 12 points or 1/6th of an inch (approx 4.233 mm).',
    commonUse: 'Editorial column widths, grid gutters in publication & newspaper design',
    colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
    badgeBg: 'bg-rose-100 text-rose-800',
    badgeText: 'text-rose-700',
    borderColor: 'border-rose-300',
  },
  vw: {
    id: 'vw',
    name: 'Viewport Width',
    symbol: 'vw',
    category: 'relative',
    description: '1% of the reference viewport width.',
    commonUse: 'Fluid typography, responsive full-bleed web components',
    colorClass: 'text-purple-700 bg-purple-50 border-purple-200',
    badgeBg: 'bg-purple-100 text-purple-800',
    badgeText: 'text-purple-700',
    borderColor: 'border-purple-300',
  },
  vh: {
    id: 'vh',
    name: 'Viewport Height',
    symbol: 'vh',
    category: 'relative',
    description: '1% of the reference viewport height.',
    commonUse: 'Hero sections, full-screen cards, vertical responsive typography',
    colorClass: 'text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200',
    badgeBg: 'bg-fuchsia-100 text-fuchsia-800',
    badgeText: 'text-fuchsia-700',
    borderColor: 'border-fuchsia-300',
  },
  ch: {
    id: 'ch',
    name: 'Character Width',
    symbol: 'ch',
    category: 'relative',
    description: 'Width of the glyph "0" in the active font (approx. 0.55em in proportional type).',
    commonUse: 'Optimal reading measure limits (e.g. 60-75ch line lengths for readability)',
    colorClass: 'text-stone-700 bg-stone-100 border-stone-300',
    badgeBg: 'bg-stone-200 text-stone-800',
    badgeText: 'text-stone-700',
    borderColor: 'border-stone-400',
  },
  twip: {
    id: 'twip',
    name: 'Twip',
    symbol: 'twip',
    category: 'typographic',
    description: 'Twentieth of an Imperial Point (1/1440 inch). Micro-unit used in font rasterizers and DTP.',
    commonUse: 'Font hinting, RTF specs, high-precision typesetting calculations',
    colorClass: 'text-orange-700 bg-orange-50 border-orange-200',
    badgeBg: 'bg-orange-100 text-orange-800',
    badgeText: 'text-orange-700',
    borderColor: 'border-orange-300',
  },
};

/**
 * Converts any value in any supported unit to standard Inches first (the golden universal base)
 */
export function convertToInches(value: number, fromUnit: Unit, config: ReferenceConfig): number {
  if (isNaN(value) || !isFinite(value)) return 0;

  const dpi = config.dpi || 96;
  const basePx = config.baseFontSizePx || 16;
  const emPx = config.emContextFontSizePx || basePx;
  const vwPx = (config.viewportWidthPx || 1440) / 100;
  const vhPx = (config.viewportHeightPx || 900) / 100;

  switch (fromUnit) {
    case 'in':
      return value;
    case 'mm':
      return value / 25.4;
    case 'cm':
      return (value * 10) / 25.4;
    case 'pt':
      return value / 72;
    case 'pc':
      return (value * 12) / 72; // 1 pc = 12 pt = 1/6 inch
    case 'twip':
      return value / 1440;
    case 'px':
      return value / dpi;
    case 'em':
      // 1 em = emPx pixels
      return (value * emPx) / dpi;
    case 'rem':
      // 1 rem = root basePx pixels
      return (value * basePx) / dpi;
    case 'vw':
      return (value * vwPx) / dpi;
    case 'vh':
      return (value * vhPx) / dpi;
    case 'ch':
      // approx 0.55em
      return (value * 0.55 * emPx) / dpi;
    default:
      return value;
  }
}

/**
 * Converts standard Inches to any target Unit
 */
export function convertFromInches(inches: number, toUnit: Unit, config: ReferenceConfig): number {
  if (isNaN(inches) || !isFinite(inches)) return 0;

  const dpi = config.dpi || 96;
  const basePx = config.baseFontSizePx || 16;
  const emPx = config.emContextFontSizePx || basePx;
  const vwPx = (config.viewportWidthPx || 1440) / 100;
  const vhPx = (config.viewportHeightPx || 900) / 100;

  switch (toUnit) {
    case 'in':
      return inches;
    case 'mm':
      return inches * 25.4;
    case 'cm':
      return (inches * 25.4) / 10;
    case 'pt':
      return inches * 72;
    case 'pc':
      return (inches * 72) / 12;
    case 'twip':
      return inches * 1440;
    case 'px':
      return inches * dpi;
    case 'em':
      // target in em = (inches * dpi) / emPx
      return emPx > 0 ? (inches * dpi) / emPx : 0;
    case 'rem':
      return basePx > 0 ? (inches * dpi) / basePx : 0;
    case 'vw':
      return vwPx > 0 ? (inches * dpi) / vwPx : 0;
    case 'vh':
      return vhPx > 0 ? (inches * dpi) / vhPx : 0;
    case 'ch':
      return emPx > 0 ? (inches * dpi) / (emPx * 0.55) : 0;
    default:
      return inches;
  }
}

/**
 * Universal direct converter between any two units
 */
export function convertUnit(
  value: number,
  fromUnit: Unit,
  toUnit: Unit,
  config: ReferenceConfig
): number {
  if (fromUnit === toUnit) return value;
  const inches = convertToInches(value, fromUnit, config);
  return convertFromInches(inches, toUnit, config);
}

/**
 * Computes all unit conversions from a single source value
 */
export function getAllConversions(
  value: number,
  fromUnit: Unit,
  config: ReferenceConfig
): Record<Unit, number> {
  const inches = convertToInches(value, fromUnit, config);
  const result: Partial<Record<Unit, number>> = {};
  const units: Unit[] = ['mm', 'em', 'rem', 'px', 'in', 'pt', 'cm', 'pc', 'vw', 'vh', 'ch', 'twip'];

  for (const unit of units) {
    result[unit] = convertFromInches(inches, unit, config);
  }

  return result as Record<Unit, number>;
}

/**
 * Formats a unit value with optimal decimal precision based on unit scale
 */
export function formatValue(value: number, unit: Unit, maxDecimals?: number): string {
  if (isNaN(value) || !isFinite(value)) return '0';

  if (maxDecimals !== undefined) {
    return Number(value.toFixed(maxDecimals)).toString();
  }

  // Adaptive decimals based on unit magnitude
  switch (unit) {
    case 'in':
      return Number(value.toFixed(4)).toString();
    case 'mm':
      return Number(value.toFixed(2)).toString();
    case 'cm':
      return Number(value.toFixed(3)).toString();
    case 'pt':
      return Number(value.toFixed(2)).toString();
    case 'pc':
      return Number(value.toFixed(3)).toString();
    case 'px':
      return Number(value.toFixed(2)).toString();
    case 'em':
    case 'rem':
      return Number(value.toFixed(4)).toString();
    case 'vw':
    case 'vh':
      return Number(value.toFixed(2)).toString();
    case 'ch':
      return Number(value.toFixed(2)).toString();
    case 'twip':
      return Math.round(value).toString();
    default:
      return Number(value.toFixed(2)).toString();
  }
}

/**
 * Standard Modular Type Scales
 */
export const MODULAR_SCALE_PRESETS: ModularScalePreset[] = [
  { name: 'Minor Second (15:16)', ratio: 1.067, description: 'Very subtle step, great for dense UI dashboards and technical typography', category: 'Subtle' },
  { name: 'Major Second (8:9)', ratio: 1.125, description: 'Low contrast, ideal for mobile apps and content-heavy blogs', category: 'Compact' },
  { name: 'Minor Third (5:6)', ratio: 1.200, description: 'Classic editorial standard with balanced, comfortable hierarchy', category: 'Harmonic' },
  { name: 'Major Third (4:5)', ratio: 1.250, description: 'Standard harmonious modern web scale with distinct heading levels', category: 'Harmonic' },
  { name: 'Perfect Fourth (3:4)', ratio: 1.333, description: 'High contrast, dynamic for marketing, magazine headlines, and posters', category: 'Expressive' },
  { name: 'Augmented Fourth (1:√2)', ratio: 1.414, description: 'ISO 216 paper aspect ratio, mathematically elegant for print', category: 'Mathematical' },
  { name: 'Perfect Fifth (2:3)', ratio: 1.500, description: 'High typographic drama, bold punchy headings and hero display text', category: 'Expressive' },
  { name: 'Golden Ratio (1:1.618)', ratio: 1.618, description: 'Divine proportion, monumental contrast for editorial & fine typography', category: 'Mathematical' },
];

/**
 * Generates typography hierarchy steps given a base size and modular ratio
 */
export function generateTypeScale(
  baseSizePt: number,
  ratio: number,
  config: ReferenceConfig,
  baselineStepPt: number = 12
): TypographyStep[] {
  const stepsDef = [
    { id: 'display-2', name: 'Display Hero', step: 5 },
    { id: 'display-1', name: 'Display Title', step: 4 },
    { id: 'h1', name: 'Heading 1', step: 3 },
    { id: 'h2', name: 'Heading 2', step: 2 },
    { id: 'h3', name: 'Heading 3', step: 1 },
    { id: 'body-lg', name: 'Body Large', step: 0.5 },
    { id: 'base', name: 'Body Regular (Base)', step: 0 },
    { id: 'body-sm', name: 'Small / Secondary', step: -1 },
    { id: 'caption', name: 'Caption / Label', step: -2 },
    { id: 'micro', name: 'Legal / Micro', step: -3 },
  ];

  return stepsDef.map((def) => {
    const ptValue = baseSizePt * Math.pow(ratio, def.step);
    const pxValue = convertUnit(ptValue, 'pt', 'px', config);
    const emValue = convertUnit(ptValue, 'pt', 'em', config);
    const mmValue = convertUnit(ptValue, 'pt', 'mm', config);
    const inValue = convertUnit(ptValue, 'pt', 'in', config);
    const pcValue = convertUnit(ptValue, 'pt', 'pc', config);

    // Calculate ideal proportional leading (line-height)
    // Larger headings have tighter leading (1.1 - 1.2), body text has open leading (1.4 - 1.6)
    const leadingRatio = def.step >= 3 ? 1.15 : def.step >= 1 ? 1.25 : 1.5;
    const rawLineHeightPt = ptValue * leadingRatio;
    // Snap to baseline grid units if baseline grid is specified
    const baselineUnits = Math.max(1, Math.ceil(rawLineHeightPt / (baselineStepPt || 12)));
    const snappedLineHeightPt = baselineUnits * (baselineStepPt || 12);
    const snappedLineHeightPx = convertUnit(snappedLineHeightPt, 'pt', 'px', config);

    return {
      id: def.id,
      name: def.name,
      step: def.step,
      calculatedPt: ptValue,
      calculatedPx: pxValue,
      calculatedEm: emValue,
      calculatedMm: mmValue,
      calculatedIn: inValue,
      calculatedPc: pcValue,
      lineHeightPt: snappedLineHeightPt,
      lineHeightPx: snappedLineHeightPx,
      baselineFit: baselineUnits,
    };
  });
}

/**
 * Standard paper and screen format presets
 */
export const PRESET_PAPERS: PresetPaper[] = [
  { id: 'a4', name: 'A4 (ISO Standard)', width: 210, height: 297, unit: 'mm', category: 'print-iso', defaultDpi: 300 },
  { id: 'a3', name: 'A3 (ISO Poster)', width: 297, height: 420, unit: 'mm', category: 'print-iso', defaultDpi: 300 },
  { id: 'a5', name: 'A5 (Booklet / Journal)', width: 148, height: 210, unit: 'mm', category: 'print-iso', defaultDpi: 300 },
  { id: 'us-letter', name: 'US Letter', width: 8.5, height: 11, unit: 'in', category: 'print-us', defaultDpi: 300 },
  { id: 'us-tabloid', name: 'US Tabloid / Ledger', width: 11, height: 17, unit: 'in', category: 'print-us', defaultDpi: 300 },
  { id: 'business-card', name: 'Business Card (US)', width: 3.5, height: 2.0, unit: 'in', category: 'print-us', defaultDpi: 300 },
  { id: 'business-card-eu', name: 'Business Card (EU)', width: 85, height: 55, unit: 'mm', category: 'print-iso', defaultDpi: 300 },
  { id: 'poster-50-70', name: 'B2 Poster (50×70 cm)', width: 500, height: 700, unit: 'mm', category: 'print-iso', defaultDpi: 300 },
  { id: 'web-desktop', name: 'Desktop HD (1440×900)', width: 1440, height: 900, unit: 'px', category: 'screen', defaultDpi: 96 },
  { id: 'web-fhd', name: 'Full HD (1920×1080)', width: 1920, height: 1080, unit: 'px', category: 'screen', defaultDpi: 96 },
  { id: 'mobile-iphone', name: 'Mobile (393×852 px)', width: 393, height: 852, unit: 'px', category: 'screen', defaultDpi: 96 },
  { id: 'ig-square', name: 'Instagram Square (1080×1080)', width: 1080, height: 1080, unit: 'px', category: 'social', defaultDpi: 96 },
  { id: 'ig-story', name: 'Instagram Story (1080×1920)', width: 1080, height: 1920, unit: 'px', category: 'social', defaultDpi: 96 },
];

/**
 * Standard DPI presets
 */
export const DPI_PRESETS = [
  { value: 72, label: '72 DPI', note: 'PostScript / Classic Mac DTP (1 pt = 1 px)' },
  { value: 96, label: '96 DPI', note: 'CSS Web Standard (1 in = 96 px)' },
  { value: 150, label: '150 DPI', note: 'Newspaper & Draft Proof Print' },
  { value: 300, label: '300 DPI', note: 'Standard Commercial Offset & Digital Print' },
  { value: 600, label: '600 DPI', note: 'High-Definition Fine Art & Vector Screen-Print' },
];

/**
 * Parse expression or raw string into value + unit
 */
export function parseUnitString(input: string, defaultUnit: Unit = 'px'): { value: number; unit: Unit } | null {
  const cleaned = input.trim().toLowerCase();
  if (!cleaned) return null;

  const match = cleaned.match(/^([+-]?[0-9]*\.?[0-9]+)\s*([a-z%]+)?$/);
  if (!match) return null;

  const num = parseFloat(match[1]);
  if (isNaN(num)) return null;

  const rawUnit = match[2] || defaultUnit;
  const unitMap: Record<string, Unit> = {
    mm: 'mm',
    millimeter: 'mm',
    millimeters: 'mm',
    em: 'em',
    rem: 'rem',
    px: 'px',
    pixel: 'px',
    pixels: 'px',
    in: 'in',
    inch: 'in',
    inches: 'in',
    '"': 'in',
    pt: 'pt',
    point: 'pt',
    points: 'pt',
    cm: 'cm',
    centimeter: 'cm',
    centimeters: 'cm',
    pc: 'pc',
    pica: 'pc',
    picas: 'pc',
    vw: 'vw',
    vh: 'vh',
    ch: 'ch',
    twip: 'twip',
    twips: 'twip',
  };

  const detectedUnit = unitMap[rawUnit] || defaultUnit;
  return { value: num, unit: detectedUnit };
}

/**
 * Result of converting decimal inches into a standard Tape Measure Fraction
 * (supporting halves, quarters, eighths, sixteenths, thirty-seconds, and sixty-fourths)
 */
export interface TapeMeasureFractionResult {
  whole: number;
  numerator: number;
  denominator: number;
  isExact: boolean;
  text: string;
  unicodeText: string;
  unicodeFractionChar?: string;
  decimalValue: number;
  approxDiff: number;
  nearestMarkDescription: string;
}

const UNICODE_FRACTION_MAP: Record<string, string> = {
  '1/2': '½',
  '1/4': '¼',
  '3/4': '¾',
  '1/8': '⅛',
  '3/8': '⅜',
  '5/8': '⅝',
  '7/8': '⅞',
};

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

/**
 * Converts decimal inches to standard tape measure fractions (1/2, 1/4, 1/8, 1/16, 1/32, 1/64)
 */
export function getTapeMeasureFraction(
  inches: number,
  maxDenominator: 16 | 32 | 64 = 16
): TapeMeasureFractionResult {
  if (isNaN(inches) || !isFinite(inches)) {
    return {
      whole: 0,
      numerator: 0,
      denominator: 1,
      isExact: true,
      text: '0',
      unicodeText: '0',
      decimalValue: 0,
      approxDiff: 0,
      nearestMarkDescription: '0"',
    };
  }

  const sign = inches < 0 ? -1 : 1;
  const abs = Math.abs(inches);
  const whole = Math.floor(abs);
  const frac = abs - whole;

  // Exact integer check
  if (frac < 0.0003 || frac > 0.9997) {
    const finalWhole = Math.round(abs) * sign;
    return {
      whole: finalWhole,
      numerator: 0,
      denominator: 1,
      isExact: true,
      text: `${finalWhole}`,
      unicodeText: `${finalWhole}`,
      decimalValue: finalWhole,
      approxDiff: 0,
      nearestMarkDescription: `Exact ${finalWhole}"`,
    };
  }

  // Check exact matches against standard tape measure denominators: 2, 4, 8, 16, 32, 64
  const standardDenominators = [2, 4, 8, 16, 32, 64];
  for (const d of standardDenominators) {
    const n = Math.round(frac * d);
    if (Math.abs(frac - n / d) < 0.0003) {
      const g = gcd(n, d);
      const reducedN = n / g;
      const reducedD = d / g;

      if (reducedN === reducedD) {
        const finalWhole = (whole + 1) * sign;
        return {
          whole: finalWhole,
          numerator: 0,
          denominator: 1,
          isExact: true,
          text: `${finalWhole}`,
          unicodeText: `${finalWhole}`,
          decimalValue: finalWhole,
          approxDiff: 0,
          nearestMarkDescription: `Exact ${finalWhole}"`,
        };
      }

      const fracKey = `${reducedN}/${reducedD}`;
      const uniChar = UNICODE_FRACTION_MAP[fracKey];
      const textStr = whole > 0 ? `${sign * whole} ${fracKey}` : `${sign < 0 ? '-' : ''}${fracKey}`;
      const unicodeStr = whole > 0 
        ? `${sign * whole} ${uniChar || fracKey}` 
        : `${sign < 0 ? '-' : ''}${uniChar || fracKey}`;

      return {
        whole: sign * whole,
        numerator: reducedN,
        denominator: reducedD,
        isExact: true,
        text: textStr,
        unicodeText: unicodeStr,
        unicodeFractionChar: uniChar,
        decimalValue: (whole + reducedN / reducedD) * sign,
        approxDiff: 0,
        nearestMarkDescription: `Exact ${reducedN}/${reducedD}" mark`,
      };
    }
  }

  // Approximate to nearest mark on the selected tape measure graduation (1/16, 1/32, or 1/64)
  const rawNumerator = Math.round(frac * maxDenominator);
  if (rawNumerator === 0) {
    return {
      whole: sign * whole,
      numerator: 0,
      denominator: 1,
      isExact: false,
      text: `≈ ${sign * whole}`,
      unicodeText: `≈ ${sign * whole}`,
      decimalValue: sign * whole,
      approxDiff: frac,
      nearestMarkDescription: `≈ ${whole}"`,
    };
  }
  if (rawNumerator === maxDenominator) {
    const finalWhole = (whole + 1) * sign;
    return {
      whole: finalWhole,
      numerator: 0,
      denominator: 1,
      isExact: false,
      text: `≈ ${finalWhole}`,
      unicodeText: `≈ ${finalWhole}`,
      decimalValue: finalWhole,
      approxDiff: 1 - frac,
      nearestMarkDescription: `≈ ${finalWhole}"`,
    };
  }

  const g = gcd(rawNumerator, maxDenominator);
  const n = rawNumerator / g;
  const d = maxDenominator / g;
  const approxDecimal = whole + n / d;
  const diff = inches - sign * approxDecimal;

  const fracKey = `${n}/${d}`;
  const uniChar = UNICODE_FRACTION_MAP[fracKey];
  const textStr = whole > 0 ? `≈ ${sign * whole} ${fracKey}` : `≈ ${sign < 0 ? '-' : ''}${fracKey}`;
  const unicodeStr = whole > 0 
    ? `≈ ${sign * whole} ${uniChar || fracKey}` 
    : `≈ ${sign < 0 ? '-' : ''}${uniChar || fracKey}`;

  return {
    whole: sign * whole,
    numerator: n,
    denominator: d,
    isExact: false,
    text: textStr,
    unicodeText: unicodeStr,
    unicodeFractionChar: uniChar,
    decimalValue: sign * approxDecimal,
    approxDiff: diff,
    nearestMarkDescription: `Nearest ${maxDenominator}th mark: ${n}/${d}" (${diff > 0 ? '+' : ''}${diff.toFixed(3)}")`,
  };
}

/**
 * Parses a numeric string which may be a decimal (e.g. "1.5") or mixed/pure fraction (e.g. "1 1/2", "3/4", "1-1/2")
 */
export function parseFractionOrDecimal(str: string): number | null {
  const trimmed = str.trim();
  if (!trimmed) return null;

  // Mixed fraction: e.g. "1 1/2", "1-1/2", "2 3/8"
  const mixedMatch = trimmed.match(/^([+-]?\d+)\s*[- ]\s*(\d+)\s*\/\s*(\d+)$/);
  if (mixedMatch) {
    const whole = parseFloat(mixedMatch[1]);
    const num = parseFloat(mixedMatch[2]);
    const den = parseFloat(mixedMatch[3]);
    if (den !== 0) {
      return whole < 0 ? whole - num / den : whole + num / den;
    }
  }

  // Pure fraction: e.g. "1/2", "3/16", "5/8"
  const pureFracMatch = trimmed.match(/^([+-]?\d+)\s*\/\s*(\d+)$/);
  if (pureFracMatch) {
    const num = parseFloat(pureFracMatch[1]);
    const den = parseFloat(pureFracMatch[2]);
    if (den !== 0) {
      return num / den;
    }
  }

  // Standard float
  const parsed = parseFloat(trimmed);
  return isNaN(parsed) ? null : parsed;
}
