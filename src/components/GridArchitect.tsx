import React, { useState, useMemo, useRef } from 'react';
import { GridSettings, LayoutBlock, ReferenceConfig, Unit, PresetPaper } from '../types';
import { convertUnit, formatValue, PRESET_PAPERS } from '../utils/converters';
import {
  Grid3X3,
  Sliders,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  Eye,
  Maximize2,
  Code,
  FileText,
  MousePointer,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface GridArchitectProps {
  config: ReferenceConfig;
  gridSettings: GridSettings;
  onChangeGridSettings: (newSettings: Partial<GridSettings>) => void;
  selectedPreset: PresetPaper | null;
  onApplyPreset: (preset: PresetPaper) => void;
}

export const GridArchitect: React.FC<GridArchitectProps> = ({
  config,
  gridSettings,
  onChangeGridSettings,
  selectedPreset,
  onApplyPreset,
}) => {
  const isSpread = !!gridSettings.isTwoPageSpread;
  const [zoom, setZoom] = useState<number>(gridSettings.isTwoPageSpread ? 0.55 : 0.85);
  const [activeBlockId, setActiveBlockId] = useState<string>('block-1');
  const [inspectorUnit, setInspectorUnit] = useState<Unit>('mm');
  const [exportFormat, setExportFormat] = useState<'css' | 'affinity' | 'indesign'>('css');
  const [copiedExport, setCopiedExport] = useState<boolean>(false);
  const [isLinkedMargins, setIsLinkedMargins] = useState<boolean>(true);

  const handleToggleSpread = (spread: boolean) => {
    onChangeGridSettings({ isTwoPageSpread: spread });
    if (spread && zoom > 0.65) {
      setZoom(0.55);
    } else if (!spread && zoom < 0.7) {
      setZoom(0.85);
    }
  };

  // Layout blocks on the artboard (supports both single page & 2-page facing spreads)
  const [blocks, setBlocks] = useState<LayoutBlock[]>([
    {
      id: 'block-1',
      title: 'Hero Headline',
      type: 'heading',
      colStart: 1,
      colSpan: 8,
      rowBaseline: 2,
      heightBaselines: 3,
      fontSizePt: 32,
      lineHeightRatio: 1.15,
      fontFamily: 'serif',
      content: 'The Architecture of Editorial Layouts',
      bgColor: 'bg-stone-900',
      textColor: 'text-stone-100',
    },
    {
      id: 'block-2',
      title: 'Pull Quote',
      type: 'pullquote',
      colStart: 9,
      colSpan: 4,
      rowBaseline: 2,
      heightBaselines: 4,
      fontSizePt: 16,
      lineHeightRatio: 1.3,
      fontFamily: 'serif',
      content: '“A grid does not restrict creative vision; it crystallizes rhythmic clarity.”',
      bgColor: 'bg-amber-100/90',
      textColor: 'text-amber-950',
    },
    {
      id: 'block-3',
      title: 'Story Column 1 (Verso)',
      type: 'text',
      colStart: 1,
      colSpan: 6,
      rowBaseline: 6,
      heightBaselines: 7,
      fontSizePt: 11,
      lineHeightRatio: 1.5,
      fontFamily: 'sans',
      content: 'When Jan Tschichold codified the principles of the New Typography, he emphasized that whitespace and structural margins are active design components rather than mere passive borders.',
      bgColor: 'bg-white',
      textColor: 'text-stone-800',
    },
    {
      id: 'block-4',
      title: 'Figure Frame (Verso)',
      type: 'image',
      colStart: 7,
      colSpan: 6,
      rowBaseline: 6,
      heightBaselines: 7,
      fontSizePt: 10,
      lineHeightRatio: 1.3,
      fontFamily: 'mono',
      content: 'FIG 1.0 — MODULAR GRID MATRIX',
      bgColor: 'bg-stone-200',
      textColor: 'text-stone-700',
    },
    {
      id: 'block-5',
      title: 'Feature Essay (Recto)',
      type: 'text',
      colStart: 13,
      colSpan: 6,
      rowBaseline: 2,
      heightBaselines: 11,
      fontSizePt: 12,
      lineHeightRatio: 1.55,
      fontFamily: 'serif',
      content: 'Across a facing two-page spread, the visual center shifts toward the optical center. The inner spine gutter provides clearance for physical binding, while baseline grids align across facing leaves.',
      bgColor: 'bg-white',
      textColor: 'text-stone-900',
    },
    {
      id: 'block-6',
      title: 'Specimen Plate (Recto)',
      type: 'image',
      colStart: 19,
      colSpan: 6,
      rowBaseline: 2,
      heightBaselines: 11,
      fontSizePt: 10,
      lineHeightRatio: 1.4,
      fontFamily: 'mono',
      content: 'PLATE II — SYMMETRICAL SPREAD RATIOS',
      bgColor: 'bg-stone-100',
      textColor: 'text-stone-800',
    },
  ]);

  // Page dimensions converted to standard Millimeters and Pixels
  const pageWidthMm = useMemo(
    () => convertUnit(gridSettings.pageWidth, gridSettings.pageUnit, 'mm', config),
    [gridSettings.pageWidth, gridSettings.pageUnit, config]
  );
  const pageHeightMm = useMemo(
    () => convertUnit(gridSettings.pageHeight, gridSettings.pageUnit, 'mm', config),
    [gridSettings.pageHeight, gridSettings.pageUnit, config]
  );

  const marginTopMm = useMemo(
    () => convertUnit(gridSettings.marginTop, gridSettings.marginUnit, 'mm', config),
    [gridSettings.marginTop, gridSettings.marginUnit, config]
  );
  const marginBottomMm = useMemo(
    () => convertUnit(gridSettings.marginBottom, gridSettings.marginUnit, 'mm', config),
    [gridSettings.marginBottom, gridSettings.marginUnit, config]
  );
  const marginLeftMm = useMemo(
    () => convertUnit(gridSettings.marginLeft, gridSettings.marginUnit, 'mm', config),
    [gridSettings.marginLeft, gridSettings.marginUnit, config]
  );
  const marginRightMm = useMemo(
    () => convertUnit(gridSettings.marginRight, gridSettings.marginUnit, 'mm', config),
    [gridSettings.marginRight, gridSettings.marginUnit, config]
  );

  const gutterMm = useMemo(
    () => convertUnit(gridSettings.gutter, gridSettings.gutterUnit, 'mm', config),
    [gridSettings.gutter, gridSettings.gutterUnit, config]
  );

  const baselineStepMm = useMemo(
    () => convertUnit(gridSettings.baselineStep, gridSettings.baselineUnit, 'mm', config),
    [gridSettings.baselineStep, gridSettings.baselineUnit, config]
  );

  // Content area dimensions
  const contentWidthMm = Math.max(10, pageWidthMm - marginLeftMm - marginRightMm);
  const contentHeightMm = Math.max(10, pageHeightMm - marginTopMm - marginBottomMm);

  // Single column width computation
  const columnWidthMm = useMemo(() => {
    const cols = Math.max(1, gridSettings.columns);
    const totalGutters = (cols - 1) * gutterMm;
    const available = Math.max(1, contentWidthMm - totalGutters);
    return available / cols;
  }, [contentWidthMm, gridSettings.columns, gutterMm]);

  // Artboard pixel scaling for live preview rendering
  const canvasScale = (isSpread ? 1.5 : 2.2) * zoom; // pixels per mm on artboard
  const singlePageWidthPx = pageWidthMm * canvasScale;
  const artboardWidthPx = (isSpread ? pageWidthMm * 2 : pageWidthMm) * canvasScale;
  const artboardHeightPx = pageHeightMm * canvasScale;

  // Selected block
  const activeBlock = useMemo(() => {
    return blocks.find((b) => b.id === activeBlockId) || blocks[0];
  }, [blocks, activeBlockId]);

  // Update active block
  const updateActiveBlock = (changes: Partial<LayoutBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === activeBlockId ? { ...b, ...changes } : b))
    );
  };

  // Add new block
  const handleAddBlock = () => {
    const newId = `block-${Date.now()}`;
    const maxCols = isSpread ? gridSettings.columns * 2 : gridSettings.columns;
    const newBlock: LayoutBlock = {
      id: newId,
      title: `Block ${blocks.length + 1}`,
      type: 'text',
      colStart: 1,
      colSpan: Math.min(6, gridSettings.columns),
      rowBaseline: 3,
      heightBaselines: 4,
      fontSizePt: 12,
      lineHeightRatio: 1.4,
      fontFamily: 'sans',
      content: 'Sample responsive text block anchored to grid.',
      bgColor: 'bg-white',
      textColor: 'text-stone-900',
    };
    setBlocks((prev) => [...prev, newBlock]);
    setActiveBlockId(newId);
  };

  const handleDeleteBlock = (id: string) => {
    if (blocks.length <= 1) return;
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setActiveBlockId(blocks[0].id);
  };

  // Export Snippet generator (supports single page and 2-page facing spreads)
  const generatedExportSnippet = useMemo(() => {
    const colPx = formatValue(convertUnit(columnWidthMm, 'mm', 'px', config), 'px');
    const gutterPx = formatValue(convertUnit(gutterMm, 'mm', 'px', config), 'px');
    const baseStepPx = formatValue(convertUnit(baselineStepMm, 'mm', 'px', config), 'px');
    const topMarginPx = formatValue(convertUnit(marginTopMm, 'mm', 'px', config), 'px');
    const bottomMarginPx = formatValue(convertUnit(marginBottomMm, 'mm', 'px', config), 'px');
    const outsideMarginPx = formatValue(convertUnit(marginLeftMm, 'mm', 'px', config), 'px');
    const insideMarginPx = formatValue(convertUnit(marginRightMm, 'mm', 'px', config), 'px');

    if (exportFormat === 'css') {
      if (isSpread) {
        return `/* TypoGraph 2-Page Facing Spread CSS Grid Specification */
.editorial-spread-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: ${formatValue(convertUnit(pageWidthMm * 2, 'mm', 'px', config), 'px')}px;
  margin: 0 auto;
}

/* Verso (Left Page) */
.verso-page {
  display: grid;
  grid-template-columns: repeat(${gridSettings.columns}, 1fr);
  gap: ${gutterPx}px;
  padding: ${topMarginPx}px ${insideMarginPx}px ${bottomMarginPx}px ${outsideMarginPx}px;
  border-right: 1px dashed rgba(0, 0, 0, 0.15); /* Center Spine Crease */
}

/* Recto (Right Page) */
.recto-page {
  display: grid;
  grid-template-columns: repeat(${gridSettings.columns}, 1fr);
  gap: ${gutterPx}px;
  padding: ${topMarginPx}px ${outsideMarginPx}px ${bottomMarginPx}px ${insideMarginPx}px;
}

/* Baseline Grid Rhythm */
:root {
  --baseline-step: ${baseStepPx}px; /* ${gridSettings.baselineStep}${gridSettings.baselineUnit} */
  --column-width: ${colPx}px;
  --gutter-width: ${gutterPx}px;
}`;
      }

      return `/* TypoGraph CSS Grid Specification (Single Page) */
.editorial-grid-container {
  display: grid;
  grid-template-columns: repeat(${gridSettings.columns}, 1fr);
  gap: ${gutterPx}px;
  padding: ${topMarginPx}px ${insideMarginPx}px ${bottomMarginPx}px ${outsideMarginPx}px;
  max-width: ${formatValue(convertUnit(pageWidthMm, 'mm', 'px', config), 'px')}px;
  margin: 0 auto;
}

/* Baseline Grid Rhythm (leading) */
:root {
  --baseline-step: ${baseStepPx}px; /* ${gridSettings.baselineStep}${gridSettings.baselineUnit} */
  --column-width: ${colPx}px;
  --gutter-width: ${gutterPx}px;
}`;
    }

    if (exportFormat === 'affinity') {
      return `// Serif Affinity Studio / Publisher / Designer Layout Specs
Spread & Document Setup:
  Dimensions (Single Leaf): ${gridSettings.pageWidth} ${gridSettings.pageUnit} × ${gridSettings.pageHeight} ${gridSettings.pageUnit}
  Facing Pages: ${isSpread ? 'Enabled (2-Page Facing Spread / Verso & Recto)' : 'Disabled (Single Page)'}
  ${isSpread ? `Total Spread Dimensions: ${gridSettings.pageWidth * 2} ${gridSettings.pageUnit} × ${gridSettings.pageHeight} ${gridSettings.pageUnit}` : ''}
  Orientation: ${pageWidthMm >= pageHeightMm ? 'Landscape' : 'Portrait'}

Guides Manager > Column Guides:
  Columns Per Page: ${gridSettings.columns}${isSpread ? ` (${gridSettings.columns * 2} across entire spread)` : ''}
  Column Width: ${formatValue(columnWidthMm, 'mm')} mm (${formatValue(convertUnit(columnWidthMm, 'mm', 'pt', config), 'pt')} pt)
  Gutter: ${gridSettings.gutter} ${gridSettings.gutterUnit} (${gutterPx} px)
  Margins:
    Top: ${gridSettings.marginTop} ${gridSettings.marginUnit}
    Bottom: ${gridSettings.marginBottom} ${gridSettings.marginUnit}
    ${isSpread ? `Inner (Spine Gutter): ${gridSettings.marginRight} ${gridSettings.marginUnit}` : `Left: ${gridSettings.marginLeft} ${gridSettings.marginUnit}`}
    ${isSpread ? `Outer (Trim Edge): ${gridSettings.marginLeft} ${gridSettings.marginUnit}` : `Right: ${gridSettings.marginRight} ${gridSettings.marginUnit}`}

Guides Manager > Baseline Grid:
  Use Baseline Grid: Enabled
  Grid Spacing: ${gridSettings.baselineStep} ${gridSettings.baselineUnit} (${baseStepPx} px)
  Start Position: ${gridSettings.marginTop} ${gridSettings.marginUnit} (Top Margin)
  Display Threshold: 50%`;
    }

    // InDesign / Print DTP script specs
    return `// Adobe InDesign Document Setup Specs
Facing Pages: ${isSpread ? 'true (2-Page Facing Spread)' : 'false (Single Page)'}
${isSpread ? 'Pages: 2 (Spread / Verso & Recto)' : 'Pages: 1'}
Page Width: ${gridSettings.pageWidth} ${gridSettings.pageUnit}
Page Height: ${gridSettings.pageHeight} ${gridSettings.pageUnit}
Columns: ${gridSettings.columns}
Column Gutter: ${gridSettings.gutter} ${gridSettings.gutterUnit}
Margins:
  Top: ${gridSettings.marginTop} ${gridSettings.marginUnit}
  Bottom: ${gridSettings.marginBottom} ${gridSettings.marginUnit}
  ${isSpread ? `Inside (Spine): ${gridSettings.marginRight} ${gridSettings.marginUnit}` : `Inside/Left: ${gridSettings.marginLeft} ${gridSettings.marginUnit}`}
  ${isSpread ? `Outside (Trim): ${gridSettings.marginLeft} ${gridSettings.marginUnit}` : `Outside/Right: ${gridSettings.marginRight} ${gridSettings.marginUnit}`}
Baseline Grid:
  Increment: ${gridSettings.baselineStep} ${gridSettings.baselineUnit}
  Start Offset: ${gridSettings.marginTop} ${gridSettings.marginUnit}
Computed Single Column Width: ${formatValue(columnWidthMm, 'mm')} mm (${formatValue(convertUnit(columnWidthMm, 'mm', 'pt', config), 'pt')} pt)`;
  }, [exportFormat, isSpread, gridSettings, columnWidthMm, gutterMm, marginTopMm, marginBottomMm, marginLeftMm, marginRightMm, baselineStepMm, pageWidthMm, config, blocks]);

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(generatedExportSnippet);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  // Block dimensions calculated in inspector unit
  const activeBlockWidthMm = useMemo(() => {
    if (!activeBlock) return 0;
    const spans = activeBlock.colSpan;
    return spans * columnWidthMm + (spans - 1) * gutterMm;
  }, [activeBlock, columnWidthMm, gutterMm]);

  const activeBlockHeightMm = useMemo(() => {
    if (!activeBlock) return 0;
    return activeBlock.heightBaselines * baselineStepMm;
  }, [activeBlock, baselineStepMm]);

  return (
    <div id="grid-architect-container" className="space-y-8">
      
      {/* Top Banner / Grid Overview */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-stone-900 text-stone-100 font-mono">
                Layout Engine
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Modular Column & Baseline Grid Architect
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mt-2 font-sans">
              Custom Grid Settings & Live Layout Preview
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl mt-1 leading-relaxed">
              Configure artboard dimensions, facing 2-page spreads, column counts, margins, and baseline grids. Place and inspect layout blocks with live dimension readouts across millimeters, points, pixels, inches, and ems.
            </p>
          </div>

          {/* Quick Computed Column Width & Spread Mode Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Page Spread Toggle: Single Page vs. 2-Page Facing Spread */}
            <div className="bg-stone-100 p-1.5 rounded-xl border border-stone-200 flex items-center gap-1">
              <button
                id="btn-toggle-single-page"
                onClick={() => handleToggleSpread(false)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isSpread
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Single Page</span>
              </button>
              <button
                id="btn-toggle-two-page-spread"
                onClick={() => handleToggleSpread(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSpread
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>2-Page Spread</span>
              </button>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 min-w-48 text-left">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Column Width
              </span>
              <div className="text-xl font-black font-mono text-stone-900 mt-0.5">
                {formatValue(columnWidthMm, 'mm')} <span className="text-xs font-normal text-stone-500">mm</span>
              </div>
              <div className="text-[11px] font-mono text-stone-500 mt-1 flex items-center gap-2">
                <span>{formatValue(convertUnit(columnWidthMm, 'mm', 'pt', config), 'pt')} pt</span>
                <span>•</span>
                <span>{formatValue(convertUnit(columnWidthMm, 'mm', 'px', config), 'px')} px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Master Configuration Controls Row */}
        <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Page Format & Dimensions */}
          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Page / Canvas Size
              </span>
              <span className="text-[10px] font-mono font-bold text-stone-600 bg-stone-200/80 px-1.5 py-0.5 rounded">
                {isSpread ? '2-Page Spread' : 'Single Page'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-stone-400 font-mono">
                  {isSpread ? 'Leaf Width' : 'Width'}
                </label>
                <input
                  id="input-page-width"
                  type="number"
                  value={gridSettings.pageWidth}
                  onChange={(e) => onChangeGridSettings({ pageWidth: Number(e.target.value) || 100 })}
                  className="w-full bg-white text-stone-900 font-mono font-bold text-sm px-2 py-1 rounded border border-stone-300"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-400 font-mono">Height</label>
                <input
                  id="input-page-height"
                  type="number"
                  value={gridSettings.pageHeight}
                  onChange={(e) => onChangeGridSettings({ pageHeight: Number(e.target.value) || 100 })}
                  className="w-full bg-white text-stone-900 font-mono font-bold text-sm px-2 py-1 rounded border border-stone-300"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-stone-500">Unit:</span>
              <select
                id="select-page-unit"
                value={gridSettings.pageUnit}
                onChange={(e) => onChangeGridSettings({ pageUnit: e.target.value as Unit })}
                className="bg-white font-mono text-xs font-semibold text-stone-800 px-2 py-1 rounded border border-stone-300"
              >
                <option value="mm">mm (Metric)</option>
                <option value="in">in (Inches)</option>
                <option value="pt">pt (Points)</option>
                <option value="px">px (Pixels)</option>
              </select>
            </div>

            {/* Quick 2-Page Spread Toggle Switch */}
            <div className="pt-1.5 border-t border-stone-200 flex items-center justify-between">
              <label htmlFor="checkbox-2-page-spread" className="text-xs text-stone-700 font-medium flex items-center gap-1.5 cursor-pointer">
                <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                <span>2-Page Spread:</span>
              </label>
              <input
                id="checkbox-2-page-spread"
                type="checkbox"
                checked={isSpread}
                onChange={(e) => handleToggleSpread(e.target.checked)}
                className="w-4 h-4 rounded text-stone-900 focus:ring-stone-900 cursor-pointer"
              />
            </div>
          </div>

          {/* 2. Columns & Gutters */}
          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Columns & Gutters
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-600 font-medium">Columns:</span>
              <div className="flex items-center gap-2">
                <input
                  id="input-columns-count"
                  type="number"
                  min="1"
                  max="24"
                  value={gridSettings.columns}
                  onChange={(e) => onChangeGridSettings({ columns: Math.max(1, Math.min(24, Number(e.target.value) || 12)) })}
                  className="w-14 bg-white text-stone-900 font-mono font-bold text-sm px-2 py-1 rounded border border-stone-300 text-center"
                />
                <span className="text-xs font-bold text-stone-500">cols</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-stone-600 font-medium">Gutter:</span>
              <div className="flex items-center gap-1.5">
                <input
                  id="input-gutter-width"
                  type="number"
                  min="0"
                  step="0.5"
                  value={gridSettings.gutter}
                  onChange={(e) => onChangeGridSettings({ gutter: Math.max(0, Number(e.target.value)) })}
                  className="w-16 bg-white text-stone-900 font-mono font-bold text-sm px-2 py-1 rounded border border-stone-300 text-center"
                />
                <select
                  value={gridSettings.gutterUnit}
                  onChange={(e) => onChangeGridSettings({ gutterUnit: e.target.value as Unit })}
                  className="bg-white font-mono text-xs font-semibold text-stone-800 px-1.5 py-1 rounded border border-stone-300"
                >
                  <option value="mm">mm</option>
                  <option value="pt">pt</option>
                  <option value="px">px</option>
                  <option value="pc">pc</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Margins */}
          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Margins
              </span>
              <button
                onClick={() => setIsLinkedMargins(!isLinkedMargins)}
                className="text-[10px] text-stone-500 hover:text-stone-900 font-mono underline cursor-pointer"
              >
                {isLinkedMargins ? 'Linked (All Equal)' : 'Independent'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="text-[9px] text-stone-400 font-mono">Top / Outer</label>
                <input
                  id="input-margin-top"
                  type="number"
                  value={gridSettings.marginTop}
                  onChange={(e) => {
                    const v = Math.max(0, Number(e.target.value));
                    if (isLinkedMargins) {
                      onChangeGridSettings({ marginTop: v, marginBottom: v, marginLeft: v, marginRight: v });
                    } else {
                      onChangeGridSettings({ marginTop: v });
                    }
                  }}
                  className="w-full bg-white text-stone-900 font-mono text-xs px-2 py-1 rounded border border-stone-300"
                />
              </div>
              <div>
                <label className="text-[9px] text-stone-400 font-mono">Bottom</label>
                <input
                  id="input-margin-bottom"
                  type="number"
                  value={gridSettings.marginBottom}
                  disabled={isLinkedMargins}
                  onChange={(e) => onChangeGridSettings({ marginBottom: Math.max(0, Number(e.target.value)) })}
                  className="w-full bg-white text-stone-900 font-mono text-xs px-2 py-1 rounded border border-stone-300 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-[9px] text-stone-400 font-mono">Left / Inside</label>
                <input
                  id="input-margin-left"
                  type="number"
                  value={gridSettings.marginLeft}
                  disabled={isLinkedMargins}
                  onChange={(e) => onChangeGridSettings({ marginLeft: Math.max(0, Number(e.target.value)) })}
                  className="w-full bg-white text-stone-900 font-mono text-xs px-2 py-1 rounded border border-stone-300 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-[9px] text-stone-400 font-mono">Right / Outside</label>
                <input
                  id="input-margin-right"
                  type="number"
                  value={gridSettings.marginRight}
                  disabled={isLinkedMargins}
                  onChange={(e) => onChangeGridSettings({ marginRight: Math.max(0, Number(e.target.value)) })}
                  className="w-full bg-white text-stone-900 font-mono text-xs px-2 py-1 rounded border border-stone-300 disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* 4. Baseline Grid System */}
          <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Baseline Grid Rhythm
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-600 font-medium">Step:</span>
              <div className="flex items-center gap-1.5">
                <input
                  id="input-baseline-step-grid"
                  type="number"
                  min="1"
                  value={gridSettings.baselineStep}
                  onChange={(e) => onChangeGridSettings({ baselineStep: Math.max(1, Number(e.target.value)) })}
                  className="w-16 bg-white text-stone-900 font-mono font-bold text-sm px-2 py-1 rounded border border-stone-300 text-center"
                />
                <select
                  value={gridSettings.baselineUnit}
                  onChange={(e) => onChangeGridSettings({ baselineUnit: e.target.value as Unit })}
                  className="bg-white font-mono text-xs font-semibold text-stone-800 px-1.5 py-1 rounded border border-stone-300"
                >
                  <option value="pt">pt</option>
                  <option value="px">px</option>
                  <option value="mm">mm</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-1.5 text-xs text-stone-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={gridSettings.showBaselineGrid}
                  onChange={(e) => onChangeGridSettings({ showBaselineGrid: e.target.checked })}
                  className="rounded text-stone-900 focus:ring-stone-900"
                />
                Show Baseline Lines
              </label>

              <label className="flex items-center gap-1.5 text-xs text-stone-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={gridSettings.showColumns}
                  onChange={(e) => onChangeGridSettings({ showColumns: e.target.checked })}
                  className="rounded text-stone-900 focus:ring-stone-900"
                />
                Show Columns
              </label>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Live Layout Canvas & Inspector Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left/Center Canvas Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-stone-700" />
                Live Artboard & Layout Preview
              </h3>
              <span className="text-xs text-stone-400 font-mono">
                {isSpread ? (
                  <>
                    Spread: {gridSettings.pageWidth * 2}{gridSettings.pageUnit} × {gridSettings.pageHeight}{gridSettings.pageUnit} ({gridSettings.columns * 2} cols total • Facing Pages)
                  </>
                ) : (
                  <>
                    Single: {gridSettings.pageWidth}{gridSettings.pageUnit} × {gridSettings.pageHeight}{gridSettings.pageUnit} ({gridSettings.columns} cols)
                  </>
                )}
              </span>
            </div>

            {/* Canvas Zoom & Add Block Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-stone-100 rounded-lg p-1 border border-stone-200">
                <button
                  onClick={() => setZoom((z) => Math.max(0.3, Number((z - 0.1).toFixed(1))))}
                  className="p-1 hover:bg-white text-stone-700 rounded cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono px-2 text-stone-700">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(1.6, Number((z + 0.1).toFixed(1))))}
                  className="p-1 hover:bg-white text-stone-700 rounded cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoom(isSpread ? 0.55 : 0.85)}
                  className="p-1 hover:bg-white text-stone-700 rounded cursor-pointer ml-0.5"
                  title="Reset Fit"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              <button
                id="btn-add-layout-block"
                onClick={handleAddBlock}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Block
              </button>
            </div>
          </div>

          {/* Artboard Render Viewport */}
          <div className="relative bg-stone-100/80 rounded-xl p-6 sm:p-8 border border-stone-200 overflow-auto flex justify-center min-h-[500px] max-h-[640px]">
            {isSpread ? (
              /* 2-PAGE FACING SPREAD CONTAINER (VERSO + SPINE + RECTO) */
              <div
                id="live-artboard-canvas"
                className="relative bg-white shadow-2xl rounded-xs border border-stone-300 transition-all origin-top flex"
                style={{
                  width: `${artboardWidthPx}px`,
                  height: `${artboardHeightPx}px`,
                }}
              >
                {/* --- VERSO (LEFT) PAGE --- */}
                <div
                  className="relative h-full flex-1 border-r border-stone-300"
                  style={{
                    paddingTop: `${marginTopMm * canvasScale}px`,
                    paddingBottom: `${marginBottomMm * canvasScale}px`,
                    paddingLeft: `${marginLeftMm * canvasScale}px`,
                    paddingRight: `${marginRightMm * canvasScale}px`,
                  }}
                >
                  {/* Verso Page Marker */}
                  <div className="absolute top-2 left-3 pointer-events-none text-[9px] font-mono font-bold tracking-widest text-stone-400 select-none uppercase">
                    Verso • Page 2
                  </div>

                  {/* Column Guides Overlay (Verso) */}
                  {gridSettings.showColumns && (
                    <div
                      className="absolute inset-0 pointer-events-none z-0 flex justify-between"
                      style={{
                        top: `${marginTopMm * canvasScale}px`,
                        bottom: `${marginBottomMm * canvasScale}px`,
                        left: `${marginLeftMm * canvasScale}px`,
                        right: `${marginRightMm * canvasScale}px`,
                      }}
                    >
                      {Array.from({ length: gridSettings.columns }).map((_, colIdx) => (
                        <div
                          key={`verso-col-${colIdx}`}
                          className="h-full bg-rose-500/8 border-x border-rose-500/20"
                          style={{
                            width: `${columnWidthMm * canvasScale}px`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Baseline Grid (Verso) */}
                  {gridSettings.showBaselineGrid && (
                    <div
                      className="absolute inset-0 pointer-events-none z-0"
                      style={{
                        top: `${marginTopMm * canvasScale}px`,
                        bottom: `${marginBottomMm * canvasScale}px`,
                        left: `${marginLeftMm * canvasScale}px`,
                        right: `${marginRightMm * canvasScale}px`,
                        backgroundImage: `linear-gradient(to bottom, transparent ${baselineStepMm * canvasScale - 1}px, rgba(59, 130, 246, 0.2) ${baselineStepMm * canvasScale}px)`,
                        backgroundSize: `100% ${baselineStepMm * canvasScale}px`,
                      }}
                    />
                  )}

                  {/* Margin Guide (Verso) */}
                  <div
                    className="absolute inset-0 border border-dashed border-stone-300 pointer-events-none"
                    style={{
                      top: `${marginTopMm * canvasScale}px`,
                      bottom: `${marginBottomMm * canvasScale}px`,
                      left: `${marginLeftMm * canvasScale}px`,
                      right: `${marginRightMm * canvasScale}px`,
                    }}
                  />

                  {/* Verso Blocks */}
                  <div className="relative z-10 w-full h-full">
                    {blocks
                      .filter((b) => b.colStart <= gridSettings.columns)
                      .map((block) => {
                        const isSelected = block.id === activeBlockId;
                        const startColIndex = Math.max(0, block.colStart - 1);
                        const spanCols = Math.min(block.colSpan, gridSettings.columns - startColIndex);
                        const blockLeftPx = startColIndex * (columnWidthMm + gutterMm) * canvasScale;
                        const blockWidthPx = (spanCols * columnWidthMm + (spanCols - 1) * gutterMm) * canvasScale;
                        const blockTopPx = (block.rowBaseline - 1) * baselineStepMm * canvasScale;
                        const blockHeightPx = block.heightBaselines * baselineStepMm * canvasScale;

                        return (
                          <div
                            key={block.id}
                            id={`canvas-block-${block.id}`}
                            onClick={() => setActiveBlockId(block.id)}
                            className={`absolute rounded-md p-2.5 cursor-pointer transition-all border select-none overflow-hidden ${
                              isSelected
                                ? 'ring-2 ring-blue-600 shadow-md border-blue-600 z-20'
                                : 'border-stone-200/80 hover:border-stone-400 hover:shadow-xs z-10'
                            } ${block.bgColor} ${block.textColor}`}
                            style={{
                              left: `${blockLeftPx}px`,
                              top: `${blockTopPx}px`,
                              width: `${Math.max(20, blockWidthPx)}px`,
                              height: `${Math.max(20, blockHeightPx)}px`,
                            }}
                          >
                            <div className="flex items-center justify-between mb-1 opacity-70 text-[9px] font-mono uppercase tracking-wider">
                              <span className="truncate max-w-[120px]">{block.title}</span>
                              <span>{spanCols}c</span>
                            </div>
                            <div
                              className={`leading-tight ${
                                block.fontFamily === 'serif'
                                  ? 'font-serif'
                                  : block.fontFamily === 'mono'
                                  ? 'font-mono'
                                  : 'font-sans'
                              }`}
                              style={{
                                fontSize: `${(block.fontSizePt / 72) * 25.4 * canvasScale * 0.4}px`,
                              }}
                            >
                              {block.content}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* --- CENTER SPINE CREASE & BINDING FOLD --- */}
                <div className="relative w-0 flex justify-center items-center pointer-events-none z-30">
                  <div className="absolute inset-y-0 w-8 -left-4 bg-gradient-to-r from-black/5 via-black/15 to-black/5" />
                  <div className="absolute inset-y-0 w-[1px] bg-stone-400/80 border-r border-dashed border-stone-500/60" />
                  <div className="absolute top-3 bg-stone-900/90 text-stone-100 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm">
                    Spine Gutter
                  </div>
                </div>

                {/* --- RECTO (RIGHT) PAGE --- */}
                <div
                  className="relative h-full flex-1"
                  style={{
                    paddingTop: `${marginTopMm * canvasScale}px`,
                    paddingBottom: `${marginBottomMm * canvasScale}px`,
                    paddingLeft: `${marginRightMm * canvasScale}px`,
                    paddingRight: `${marginLeftMm * canvasScale}px`,
                  }}
                >
                  {/* Recto Page Marker */}
                  <div className="absolute top-2 right-3 pointer-events-none text-[9px] font-mono font-bold tracking-widest text-stone-400 select-none uppercase">
                    Recto • Page 3
                  </div>

                  {/* Column Guides Overlay (Recto) */}
                  {gridSettings.showColumns && (
                    <div
                      className="absolute inset-0 pointer-events-none z-0 flex justify-between"
                      style={{
                        top: `${marginTopMm * canvasScale}px`,
                        bottom: `${marginBottomMm * canvasScale}px`,
                        left: `${marginRightMm * canvasScale}px`,
                        right: `${marginLeftMm * canvasScale}px`,
                      }}
                    >
                      {Array.from({ length: gridSettings.columns }).map((_, colIdx) => (
                        <div
                          key={`recto-col-${colIdx}`}
                          className="h-full bg-rose-500/8 border-x border-rose-500/20"
                          style={{
                            width: `${columnWidthMm * canvasScale}px`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Baseline Grid (Recto) */}
                  {gridSettings.showBaselineGrid && (
                    <div
                      className="absolute inset-0 pointer-events-none z-0"
                      style={{
                        top: `${marginTopMm * canvasScale}px`,
                        bottom: `${marginBottomMm * canvasScale}px`,
                        left: `${marginRightMm * canvasScale}px`,
                        right: `${marginLeftMm * canvasScale}px`,
                        backgroundImage: `linear-gradient(to bottom, transparent ${baselineStepMm * canvasScale - 1}px, rgba(59, 130, 246, 0.2) ${baselineStepMm * canvasScale}px)`,
                        backgroundSize: `100% ${baselineStepMm * canvasScale}px`,
                      }}
                    />
                  )}

                  {/* Margin Guide (Recto) */}
                  <div
                    className="absolute inset-0 border border-dashed border-stone-300 pointer-events-none"
                    style={{
                      top: `${marginTopMm * canvasScale}px`,
                      bottom: `${marginBottomMm * canvasScale}px`,
                      left: `${marginRightMm * canvasScale}px`,
                      right: `${marginLeftMm * canvasScale}px`,
                    }}
                  />

                  {/* Recto Blocks */}
                  <div className="relative z-10 w-full h-full">
                    {blocks
                      .filter((b) => b.colStart > gridSettings.columns)
                      .map((block) => {
                        const isSelected = block.id === activeBlockId;
                        const startColIndex = Math.max(0, block.colStart - gridSettings.columns - 1);
                        const spanCols = Math.min(block.colSpan, gridSettings.columns - startColIndex);
                        const blockLeftPx = startColIndex * (columnWidthMm + gutterMm) * canvasScale;
                        const blockWidthPx = (spanCols * columnWidthMm + (spanCols - 1) * gutterMm) * canvasScale;
                        const blockTopPx = (block.rowBaseline - 1) * baselineStepMm * canvasScale;
                        const blockHeightPx = block.heightBaselines * baselineStepMm * canvasScale;

                        return (
                          <div
                            key={block.id}
                            id={`canvas-block-${block.id}`}
                            onClick={() => setActiveBlockId(block.id)}
                            className={`absolute rounded-md p-2.5 cursor-pointer transition-all border select-none overflow-hidden ${
                              isSelected
                                ? 'ring-2 ring-blue-600 shadow-md border-blue-600 z-20'
                                : 'border-stone-200/80 hover:border-stone-400 hover:shadow-xs z-10'
                            } ${block.bgColor} ${block.textColor}`}
                            style={{
                              left: `${blockLeftPx}px`,
                              top: `${blockTopPx}px`,
                              width: `${Math.max(20, blockWidthPx)}px`,
                              height: `${Math.max(20, blockHeightPx)}px`,
                            }}
                          >
                            <div className="flex items-center justify-between mb-1 opacity-70 text-[9px] font-mono uppercase tracking-wider">
                              <span className="truncate max-w-[120px]">{block.title}</span>
                              <span>{spanCols}c</span>
                            </div>
                            <div
                              className={`leading-tight ${
                                block.fontFamily === 'serif'
                                  ? 'font-serif'
                                  : block.fontFamily === 'mono'
                                  ? 'font-mono'
                                  : 'font-sans'
                              }`}
                              style={{
                                fontSize: `${(block.fontSizePt / 72) * 25.4 * canvasScale * 0.4}px`,
                              }}
                            >
                              {block.content}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              /* SINGLE PAGE ARTBOARD CONTAINER */
              <div
                id="live-artboard-canvas"
                className="relative bg-white shadow-xl rounded-xs border border-stone-300 transition-all origin-top"
                style={{
                  width: `${artboardWidthPx}px`,
                  height: `${artboardHeightPx}px`,
                  paddingTop: `${marginTopMm * canvasScale}px`,
                  paddingBottom: `${marginBottomMm * canvasScale}px`,
                  paddingLeft: `${marginLeftMm * canvasScale}px`,
                  paddingRight: `${marginRightMm * canvasScale}px`,
                }}
              >
                {/* Column Guides Overlay */}
                {gridSettings.showColumns && (
                  <div
                    className="absolute inset-0 pointer-events-none z-0 flex justify-between"
                    style={{
                      top: `${marginTopMm * canvasScale}px`,
                      bottom: `${marginBottomMm * canvasScale}px`,
                      left: `${marginLeftMm * canvasScale}px`,
                      right: `${marginRightMm * canvasScale}px`,
                    }}
                  >
                    {Array.from({ length: gridSettings.columns }).map((_, colIdx) => (
                      <div
                        key={`col-${colIdx}`}
                        className="h-full bg-rose-500/8 border-x border-rose-500/20"
                        style={{
                          width: `${columnWidthMm * canvasScale}px`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Baseline Grid Horizontal Lines Overlay */}
                {gridSettings.showBaselineGrid && (
                  <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                      top: `${marginTopMm * canvasScale}px`,
                      bottom: `${marginBottomMm * canvasScale}px`,
                      left: `${marginLeftMm * canvasScale}px`,
                      right: `${marginRightMm * canvasScale}px`,
                      backgroundImage: `linear-gradient(to bottom, transparent ${baselineStepMm * canvasScale - 1}px, rgba(59, 130, 246, 0.2) ${baselineStepMm * canvasScale}px)`,
                      backgroundSize: `100% ${baselineStepMm * canvasScale}px`,
                    }}
                  />
                )}

                {/* Margin Border Guide */}
                <div
                  className="absolute inset-0 border border-dashed border-stone-300 pointer-events-none"
                  style={{
                    top: `${marginTopMm * canvasScale}px`,
                    bottom: `${marginBottomMm * canvasScale}px`,
                    left: `${marginLeftMm * canvasScale}px`,
                    right: `${marginRightMm * canvasScale}px`,
                  }}
                />

                {/* Layout Blocks Canvas Layer */}
                <div className="relative z-10 w-full h-full">
                  {blocks.map((block) => {
                    const isSelected = block.id === activeBlockId;
                    const startColIndex = Math.max(0, (block.colStart > gridSettings.columns ? (block.colStart % gridSettings.columns || 1) : block.colStart) - 1);
                    const spanCols = Math.min(block.colSpan, gridSettings.columns - startColIndex);
                    
                    const blockLeftPx = startColIndex * (columnWidthMm + gutterMm) * canvasScale;
                    const blockWidthPx = (spanCols * columnWidthMm + (spanCols - 1) * gutterMm) * canvasScale;
                    const blockTopPx = (block.rowBaseline - 1) * baselineStepMm * canvasScale;
                    const blockHeightPx = block.heightBaselines * baselineStepMm * canvasScale;

                    return (
                      <div
                        key={block.id}
                        id={`canvas-block-${block.id}`}
                        onClick={() => setActiveBlockId(block.id)}
                        className={`absolute rounded-md p-2.5 cursor-pointer transition-all border select-none overflow-hidden ${
                          isSelected
                            ? 'ring-2 ring-blue-600 shadow-md border-blue-600 z-20'
                            : 'border-stone-200/80 hover:border-stone-400 hover:shadow-xs z-10'
                        } ${block.bgColor} ${block.textColor}`}
                        style={{
                          left: `${blockLeftPx}px`,
                          top: `${blockTopPx}px`,
                          width: `${Math.max(20, blockWidthPx)}px`,
                          height: `${Math.max(20, blockHeightPx)}px`,
                        }}
                      >
                        <div className="flex items-center justify-between mb-1 opacity-70 text-[9px] font-mono uppercase tracking-wider">
                          <span>{block.title}</span>
                          <span>{spanCols} cols</span>
                        </div>
                        <div
                          className={`leading-tight ${
                            block.fontFamily === 'serif'
                              ? 'font-serif'
                              : block.fontFamily === 'mono'
                              ? 'font-mono'
                              : 'font-sans'
                          }`}
                          style={{
                            fontSize: `${(block.fontSizePt / 72) * 25.4 * canvasScale * 0.4}px`,
                          }}
                        >
                          {block.content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Inspector & Code Export (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Floating Element Inspector */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <MousePointer className="w-4 h-4 text-stone-700" />
                Element Inspector
              </h3>
              
              {/* Unit selector for inspector readout */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-stone-400 font-mono">Unit:</span>
                <select
                  id="select-inspector-unit"
                  value={inspectorUnit}
                  onChange={(e) => setInspectorUnit(e.target.value as Unit)}
                  className="bg-stone-100 text-stone-800 text-xs font-semibold px-2 py-0.5 rounded border border-stone-300"
                >
                  <option value="mm">mm</option>
                  <option value="pt">pt</option>
                  <option value="px">px</option>
                  <option value="in">in</option>
                  <option value="em">em</option>
                </select>
              </div>
            </div>

            {activeBlock ? (
              <div className="space-y-3.5 text-xs">
                {/* Block Title & Delete */}
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={activeBlock.title}
                    onChange={(e) => updateActiveBlock({ title: e.target.value })}
                    className="font-bold text-stone-900 text-sm bg-stone-50 px-2 py-1 rounded border border-stone-200 w-full"
                  />
                  <button
                    onClick={() => handleDeleteBlock(activeBlock.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* 2-Page Spread Leaf Selector (Verso vs Recto) */}
                {isSpread && (
                  <div className="bg-stone-100 p-1.5 rounded-xl border border-stone-200 space-y-1">
                    <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
                      Target Spread Leaf
                    </span>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => {
                          if (activeBlock.colStart > gridSettings.columns) {
                            const newCol = Math.max(1, activeBlock.colStart - gridSettings.columns);
                            updateActiveBlock({ colStart: newCol });
                          }
                        }}
                        className={`px-2 py-1 rounded text-xs font-semibold text-center transition-all cursor-pointer ${
                          activeBlock.colStart <= gridSettings.columns
                            ? 'bg-stone-900 text-white shadow-xs'
                            : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
                        }`}
                      >
                        Verso (Left Page)
                      </button>
                      <button
                        onClick={() => {
                          if (activeBlock.colStart <= gridSettings.columns) {
                            const newCol = activeBlock.colStart + gridSettings.columns;
                            updateActiveBlock({ colStart: newCol });
                          }
                        }}
                        className={`px-2 py-1 rounded text-xs font-semibold text-center transition-all cursor-pointer ${
                          activeBlock.colStart > gridSettings.columns
                            ? 'bg-stone-900 text-white shadow-xs'
                            : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
                        }`}
                      >
                        Recto (Right Page)
                      </button>
                    </div>
                  </div>
                )}

                {/* Grid Placement Controls: Col Start & Col Span */}
                <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <div>
                    <label className="text-[10px] text-stone-500 font-bold uppercase block mb-1">
                      Start Column {isSpread && <span className="text-stone-400 font-normal">/ {gridSettings.columns * 2}</span>}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={isSpread ? gridSettings.columns * 2 : gridSettings.columns}
                      value={activeBlock.colStart}
                      onChange={(e) => updateActiveBlock({ colStart: Math.max(1, Number(e.target.value)) })}
                      className="w-full bg-white text-stone-900 font-mono font-bold text-sm px-2 py-1 rounded border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 font-bold uppercase block mb-1">
                      Span (Columns)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={
                        isSpread
                          ? (activeBlock.colStart <= gridSettings.columns
                              ? gridSettings.columns - activeBlock.colStart + 1
                              : gridSettings.columns * 2 - activeBlock.colStart + 1)
                          : gridSettings.columns - activeBlock.colStart + 1
                      }
                      value={activeBlock.colSpan}
                      onChange={(e) => updateActiveBlock({ colSpan: Math.max(1, Number(e.target.value)) })}
                      className="w-full bg-white text-stone-900 font-mono font-bold text-sm px-2 py-1 rounded border border-stone-300"
                    />
                  </div>
                </div>

                {/* Baseline Row Placement */}
                <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <div>
                    <label className="text-[10px] text-stone-500 font-bold uppercase block mb-1">
                      Start Baseline
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={activeBlock.rowBaseline}
                      onChange={(e) => updateActiveBlock({ rowBaseline: Math.max(1, Number(e.target.value)) })}
                      className="w-full bg-white text-stone-900 font-mono font-bold text-sm px-2 py-1 rounded border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 font-bold uppercase block mb-1">
                      Height (Baselines)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={activeBlock.heightBaselines}
                      onChange={(e) => updateActiveBlock({ heightBaselines: Math.max(1, Number(e.target.value)) })}
                      className="w-full bg-white text-stone-900 font-mono font-bold text-sm px-2 py-1 rounded border border-stone-300"
                    />
                  </div>
                </div>

                {/* Live Converted Dimensions Readout */}
                <div className="bg-stone-900 text-stone-100 rounded-xl p-3 font-mono space-y-1.5">
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    Calculated Physical Bounds
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-400">Width:</span>
                    <span className="font-bold">
                      {formatValue(convertUnit(activeBlockWidthMm, 'mm', inspectorUnit, config), inspectorUnit)} {inspectorUnit}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-400">Height:</span>
                    <span className="font-bold">
                      {formatValue(convertUnit(activeBlockHeightMm, 'mm', inspectorUnit, config), inspectorUnit)} {inspectorUnit}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-400">Font Size:</span>
                    <span className="font-bold">
                      {formatValue(convertUnit(activeBlock.fontSizePt, 'pt', inspectorUnit, config), inspectorUnit)} {inspectorUnit}
                    </span>
                  </div>
                </div>

                {/* Content Text Editor */}
                <div>
                  <label className="text-[10px] text-stone-500 font-bold uppercase block mb-1">
                    Sample Content
                  </label>
                  <textarea
                    rows={2}
                    value={activeBlock.content}
                    onChange={(e) => updateActiveBlock({ content: e.target.value })}
                    className="w-full bg-stone-50 text-stone-800 text-xs px-2 py-1.5 rounded-lg border border-stone-200 focus:bg-white"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">No block selected</p>
            )}
          </div>

          {/* Export Layout Specs Card */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-4 h-4 text-stone-700" />
                Export Grid Specs
              </h3>

              <button
                id="btn-copy-grid-export"
                onClick={handleCopySnippet}
                className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-semibold cursor-pointer shadow-2xs"
              >
                {copiedExport ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedExport ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Export Format Selector Tabs */}
            <div className="flex gap-1 bg-stone-100 p-1 rounded-lg">
              {[
                { id: 'css', label: 'CSS Grid' },
                { id: 'affinity', label: 'Affinity Studio' },
                { id: 'indesign', label: 'InDesign' },
              ].map((f) => (
                <button
                  key={f.id}
                  id={`btn-export-tab-${f.id}`}
                  onClick={() => setExportFormat(f.id as any)}
                  className={`flex-1 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    exportFormat === f.id
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Code Box */}
            <div className="bg-stone-950 text-stone-200 rounded-xl p-3 text-[11px] font-mono overflow-x-auto max-h-48 whitespace-pre leading-relaxed border border-stone-800">
              {generatedExportSnippet}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
