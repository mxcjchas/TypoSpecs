export type Unit = 'mm' | 'em' | 'rem' | 'px' | 'in' | 'pt' | 'cm' | 'pc' | 'vw' | 'vh' | 'ch' | 'twip';

export interface ReferenceConfig {
  dpi: number; // e.g. 96 for screen, 300 for print, 72 for PostScript
  baseFontSizePx: number; // e.g. 16
  baseLineHeightRatio: number; // e.g. 1.5
  viewportWidthPx: number; // e.g. 1440
  viewportHeightPx: number; // e.g. 900
  emContextFontSizePx?: number; // for nested em context, defaults to baseFontSizePx
  screenCalibrationPpi?: number; // physical screen PPI for true 1:1 visual scale
}

export interface UnitInfo {
  id: Unit;
  name: string;
  symbol: string;
  category: 'metric' | 'imperial' | 'typographic' | 'digital' | 'relative';
  description: string;
  commonUse: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export interface GridSettings {
  pageWidth: number;
  pageHeight: number;
  pageUnit: Unit;
  columns: number;
  gutter: number;
  gutterUnit: Unit;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  marginUnit: Unit;
  baselineStep: number;
  baselineUnit: Unit;
  baselineOffset: number;
  showBaselineGrid: boolean;
  showColumns: boolean;
  showMargins: boolean;
  showRulers: boolean;
  snapToGrid: boolean;
  isTwoPageSpread?: boolean;
  insideMargin?: number;
  outsideMargin?: number;
}

export interface AnatomyCallout {
  id: string;
  name: string;
  category: 'metric-line' | 'stroke' | 'terminal-serif' | 'counter-enclosure' | 'feature';
  definition: string;
  historicalOrigin: string;
  opticalRole: string;
  exampleLetters: string[];
  xPercent: number; // For SVG callout pin
  yPercent: number;
  badgeColor: string;
}

export interface TypefaceClassification {
  id: string;
  name: string;
  category: 'serif' | 'sans' | 'display' | 'mono';
  era: string;
  keyFeatures: string;
  contrast: 'None / Uniform' | 'Low' | 'Medium' | 'High' | 'Extreme';
  axisOfStress: 'Diagonal / Calligraphic' | 'Semi-Vertical' | 'Strictly Vertical' | 'N/A (Geometric/Uniform)';
  aperture: 'Very Open' | 'Moderate' | 'Closed / Tight';
  notableTypefaces: string[];
  idealUse: string;
  badgeBg: string;
  badgeText: string;
}

export interface TypographicPairing {
  id: string;
  name: string;
  tag: string;
  description: string;
  mood: string;
  contrastScore: number; // 1 to 5
  headingFont: string;
  headingFamilyCss: string;
  headingCategory: string;
  bodyFont: string;
  bodyFamilyCss: string;
  bodyCategory: string;
  accentFont?: string;
  accentFamilyCss?: string;
  bestFor: string;
  rationale: string;
}

export interface LayoutBlock {
  id: string;
  title: string;
  type: 'heading' | 'text' | 'image' | 'pullquote' | 'caption' | 'button';
  colStart: number;
  colSpan: number;
  rowBaseline: number;
  heightBaselines: number;
  fontSizePt: number;
  lineHeightRatio: number;
  fontFamily: 'sans' | 'serif' | 'mono' | 'display';
  content?: string;
  bgColor?: string;
  textColor?: string;
}

export interface ModularScalePreset {
  name: string;
  ratio: number;
  description: string;
  category: string;
}

export interface TypographyStep {
  id: string;
  name: string;
  step: number; // e.g. -2, -1, 0, 1, 2, 3, 4...
  calculatedPx: number;
  calculatedPt: number;
  calculatedEm: number;
  calculatedMm: number;
  calculatedIn: number;
  calculatedPc: number;
  lineHeightPx: number;
  lineHeightPt: number;
  baselineFit: number; // number of baseline grid units this fits neatly into
}

export interface PresetPaper {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: Unit;
  category: 'print-iso' | 'print-us' | 'screen' | 'social' | 'custom';
  defaultDpi: number;
}
