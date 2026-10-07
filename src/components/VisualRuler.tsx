import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ReferenceConfig, Unit } from '../types';
import { convertUnit, formatValue, getAllConversions } from '../utils/converters';
import { 
  Ruler, 
  CreditCard, 
  Crosshair, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  MoveHorizontal, 
  CheckCircle2, 
  SlidersHorizontal, 
  Info,
  Maximize2,
  GripVertical,
  Smartphone,
  Tablet,
  Monitor,
  ArrowLeftRight
} from 'lucide-react';

interface VisualRulerProps {
  config: ReferenceConfig;
  onChangeConfig: (newConfig: Partial<ReferenceConfig>) => void;
}

export const VisualRuler: React.FC<VisualRulerProps> = ({ config, onChangeConfig }) => {
  // Screen PPI calibration state (defaults to ~96 or 110 for typical desktop screens)
  const [screenPpi, setScreenPpi] = useState<number>(config.screenCalibrationPpi || 96);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [calibrationCardWidthPx, setCalibrationCardWidthPx] = useState<number>(323); // ~85.6mm at 96ppi is 323.5px

  // Interactive Caliper Measure tool
  const [measureStartMm, setMeasureStartMm] = useState<number>(0);
  const [measureEndMm, setMeasureEndMm] = useState<number>(50.8); // 2 inches default
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [unitMode, setUnitMode] = useState<Unit>('mm');

  // Container width observation and responsive resizing
  const containerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const [containerWidthPx, setContainerWidthPx] = useState<number>(1000);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);
  const [customWidthPx, setCustomWidthPx] = useState<number | null>(null);
  const [isResizingRuler, setIsResizingRuler] = useState<boolean>(false);

  // When calibration width changes, update screenPpi
  // Standard credit card width is 85.60 mm = 3.37007874 inches
  const handleCardSlider = (pxVal: number) => {
    setCalibrationCardWidthPx(pxVal);
    const computedPpi = Math.round(pxVal / 3.37007874);
    setScreenPpi(computedPpi);
    onChangeConfig({ screenCalibrationPpi: computedPpi });
  };

  // Measure container width and resize dynamically with window / container changes
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        const measured = containerRef.current.clientWidth;
        if (measured > 0) {
          setContainerWidthPx(measured);
        }
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    window.addEventListener('resize', updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const GUTTER_WIDTH = 112; // 112px width for the sticky left unit labels gutter

  // Effective total width: spans 100% across container by default, or user-defined custom width
  const effectiveWidthPx = Math.max(
    340,
    isAutoFit || !customWidthPx ? (containerWidthPx || 1000) : customWidthPx
  );

  // Active scale area width (excluding the sticky gutter column)
  const scaleAreaWidthPx = Math.max(220, effectiveWidthPx - GUTTER_WIDTH);

  // Pixels per millimeter on calibrated screen
  const pxPerMm = (screenPpi / 25.4) * zoomLevel;

  // Total ruler length in mm to span across the active scale area
  const rulerLengthMm = Math.max(50, Math.ceil(scaleAreaWidthPx / pxPerMm));
  const rulerWidthPx = Math.max(scaleAreaWidthPx, rulerLengthMm * pxPerMm);

  // Measure distance computations
  const measuredDistanceMm = Math.abs(measureEndMm - measureStartMm);
  const measuredConversions = useMemo(() => {
    return getAllConversions(measuredDistanceMm, 'mm', config);
  }, [measuredDistanceMm, config]);

  // Window-level mouse handling for caliper dragging and right-edge ruler resizing
  useEffect(() => {
    if (!isDragging && !isResizingRuler) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isResizingRuler && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newWidth = Math.max(320, Math.min(3000, e.clientX - rect.left));
        setCustomWidthPx(newWidth);
        setIsAutoFit(false);
        return;
      }

      if (isDragging && rulerRef.current) {
        const rect = rulerRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentMm = Math.max(0, Math.min(rulerLengthMm, currentX / pxPerMm));

        if (isDragging === 'start') {
          setMeasureStartMm(Number(currentMm.toFixed(2)));
        } else if (isDragging === 'end') {
          setMeasureEndMm(Number(currentMm.toFixed(2)));
        }
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(null);
      setIsResizingRuler(false);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, isResizingRuler, rulerLengthMm, pxPerMm]);

  // Handle dragging ruler markers
  const handleRulerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickMm = Math.max(0, Math.min(rulerLengthMm, clickX / pxPerMm));

    // Determine if closer to start or end marker
    const distToStart = Math.abs(clickMm - measureStartMm);
    const distToEnd = Math.abs(clickMm - measureEndMm);

    if (distToStart < distToEnd) {
      setMeasureStartMm(Number(clickMm.toFixed(2)));
      setIsDragging('start');
    } else {
      setMeasureEndMm(Number(clickMm.toFixed(2)));
      setIsDragging('end');
    }
  };

  const handleApplyWidthPreset = (targetPx: number | 'auto') => {
    if (targetPx === 'auto') {
      setIsAutoFit(true);
      setCustomWidthPx(null);
    } else {
      setIsAutoFit(false);
      setCustomWidthPx(targetPx);
    }
  };

  const handleMeasureEntireSpan = () => {
    setMeasureStartMm(0);
    setMeasureEndMm(rulerLengthMm);
  };

  const handleMouseUp = () => {
    setIsDragging(null);
    setIsResizingRuler(false);
  };

  return (
    <div id="visual-ruler-container" className="space-y-8 select-none" onMouseUp={handleMouseUp}>
      
      {/* Header Info & Calibrator Toggle */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-stone-900 text-stone-100 font-mono">
                Visual Reference
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Side-by-Side Multi-Scale Caliper & Physical Comparator
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mt-2 font-sans">
              Interactive Typographic & Layout Ruler
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl mt-1 leading-relaxed">
              Compare millimeters, points, inches, picas, and pixels on an aligned physical/digital timeline. Drag the measurement handles to inspect any distance in all units simultaneously.
            </p>
          </div>

          {/* Controls Bar: Zoom & Calibration Trigger */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
              <button
                id="btn-zoom-out"
                onClick={() => setZoomLevel((z) => Math.max(0.6, Number((z - 0.2).toFixed(1))))}
                className="p-1.5 hover:bg-white text-stone-700 rounded-lg cursor-pointer transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold px-2 text-stone-700 min-w-14 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                id="btn-zoom-in"
                onClick={() => setZoomLevel((z) => Math.min(2.5, Number((z + 0.2).toFixed(1))))}
                className="p-1.5 hover:bg-white text-stone-700 rounded-lg cursor-pointer transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                id="btn-zoom-reset"
                onClick={() => setZoomLevel(1)}
                className="p-1.5 hover:bg-white text-stone-700 rounded-lg cursor-pointer transition-colors ml-1"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Screen Calibration Button */}
            <button
              id="btn-toggle-calibrator"
              onClick={() => setIsCalibrating(!isCalibrating)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                isCalibrating
                  ? 'bg-amber-500 text-stone-900 border-amber-600 font-bold'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{isCalibrating ? 'Close Calibrator' : '1:1 True Screen Calibrator'}</span>
            </button>
          </div>
        </div>

        {/* Real-world Screen PPI Calibrator Accordion */}
        {isCalibrating && (
          <div className="mt-6 p-5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  Calibrate True 1:1 Physical Dimensions on your Display
                </h4>
                <p className="text-xs text-amber-900 mt-1 max-w-xl">
                  Hold a standard credit card, driver’s license, or bank card up against your monitor. Adjust the slider below until the dark on-screen box matches the physical width of your card (85.60 mm / 3.37 in).
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300">
                  Screen PPI: {screenPpi} PPI
                </span>
              </div>
            </div>

            {/* Calibrator Slider & Box */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-amber-900 whitespace-nowrap">
                  Adjust Box Width:
                </span>
                <input
                  id="slider-calibrator-card"
                  type="range"
                  min="240"
                  max="450"
                  value={calibrationCardWidthPx}
                  onChange={(e) => handleCardSlider(Number(e.target.value))}
                  className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-700"
                />
                <span className="text-xs font-mono font-semibold text-amber-900 min-w-16">
                  {calibrationCardWidthPx} px
                </span>
              </div>

              {/* True-Scale Card Box */}
              <div className="flex justify-center py-2">
                <div
                  className="h-28 bg-stone-900 text-stone-100 rounded-xl p-4 shadow-lg border border-stone-700 flex flex-col justify-between transition-all"
                  style={{ width: `${calibrationCardWidthPx}px` }}
                >
                  <div className="flex justify-between items-center text-xs opacity-70">
                    <span className="font-mono">STANDARD ID-1 CARD</span>
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="text-center font-mono text-xs font-bold text-amber-300">
                    85.60 mm × 53.98 mm (3.37 in × 2.125 in)
                  </div>
                  <div className="text-[10px] opacity-60 text-right">
                    Matches physical card edge-to-edge
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  id="btn-lock-calibration"
                  onClick={() => setIsCalibrating(false)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save & Lock Calibration
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Active Caliper Distance Readout Card */}
        <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-stone-900 text-white rounded-xl p-3 shadow-xs">
            <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase font-mono block">
              Active Measure
            </span>
            <div className="text-xl font-black font-mono mt-0.5">
              {formatValue(measuredConversions.mm, 'mm')} <span className="text-xs font-normal text-stone-400">mm</span>
            </div>
            <span className="text-[10px] text-stone-400">Metric Standard</span>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <span className="text-[10px] font-bold tracking-wider text-blue-700 uppercase font-mono block">
              Points (DTP)
            </span>
            <div className="text-xl font-black font-mono text-blue-950 mt-0.5">
              {formatValue(measuredConversions.pt, 'pt')} <span className="text-xs font-normal text-blue-600">pt</span>
            </div>
            <span className="text-[10px] text-blue-600">1/72 inch</span>
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
            <span className="text-[10px] font-bold tracking-wider text-sky-700 uppercase font-mono block">
              Pixels (@{config.dpi}dpi)
            </span>
            <div className="text-xl font-black font-mono text-sky-950 mt-0.5">
              {formatValue(measuredConversions.px, 'px')} <span className="text-xs font-normal text-sky-600">px</span>
            </div>
            <span className="text-[10px] text-sky-600">Digital Raster</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <span className="text-[10px] font-bold tracking-wider text-amber-700 uppercase font-mono block">
              Inches
            </span>
            <div className="text-xl font-black font-mono text-amber-950 mt-0.5">
              {formatValue(measuredConversions.in, 'in')} <span className="text-xs font-normal text-amber-600">in</span>
            </div>
            <span className="text-[10px] text-amber-600">25.4 mm</span>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
            <span className="text-[10px] font-bold tracking-wider text-indigo-700 uppercase font-mono block">
              Em (16px base)
            </span>
            <div className="text-xl font-black font-mono text-indigo-950 mt-0.5">
              {formatValue(measuredConversions.em, 'em')} <span className="text-xs font-normal text-indigo-600">em</span>
            </div>
            <span className="text-[10px] text-indigo-600">Relative Type</span>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
            <span className="text-[10px] font-bold tracking-wider text-rose-700 uppercase font-mono block">
              Picas
            </span>
            <div className="text-xl font-black font-mono text-rose-950 mt-0.5">
              {formatValue(measuredConversions.pc, 'pc')} <span className="text-xs font-normal text-rose-600">pc</span>
            </div>
            <span className="text-[10px] text-rose-600">12 points</span>
          </div>
        </div>
      </div>

      {/* Multi-Scale Aligned Interactive Ruler Canvas */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4 overflow-hidden w-full">
        {/* Header & Status Readouts */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Synchronized Multi-Unit Ruler
            </h3>
            <span className="text-xs text-stone-400">
              (Auto-spans container • Resizable • Drag caliper flags A &amp; B)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700 font-semibold">
              Ruler Width: {Math.round(effectiveWidthPx)} px ({rulerLengthMm} mm / {(rulerLengthMm / 25.4).toFixed(1)}&quot;)
            </span>
            <span className="text-xs font-mono text-stone-500 bg-stone-50 dark:bg-stone-800/60 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
              Caliper: {measureStartMm} mm → {measureEndMm} mm (Span: {measuredDistanceMm.toFixed(2)} mm / {(measuredDistanceMm / 25.4).toFixed(2)}&quot;)
            </span>
          </div>
        </div>

        {/* Responsive Width Toolbar: Auto-Fit, Presets & Width Slider */}
        <div className="bg-stone-50 dark:bg-stone-850 p-3 rounded-xl border border-stone-200 dark:border-stone-700/80 space-y-2.5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mr-1 flex items-center gap-1">
                <ArrowLeftRight className="w-3 h-3 text-amber-600" />
                Width Mode:
              </span>

              {/* 100% Container Span Button */}
              <button
                type="button"
                id="btn-ruler-autofit"
                onClick={() => handleApplyWidthPreset('auto')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                  isAutoFit
                    ? 'bg-amber-600 text-white border-amber-600 font-bold'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                }`}
                title="Automatically span 100% of the screen/container width"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>100% Container Span (Auto)</span>
              </button>

              {/* Screen & Format Width Presets */}
              {[
                { label: 'Mobile (390px)', val: 390 },
                { label: 'Tablet (768px)', val: 768 },
                { label: 'Laptop (1024px)', val: 1024 },
                { label: 'A4 (210mm)', val: Math.round(210 * pxPerMm) + GUTTER_WIDTH },
                { label: 'Letter (8.5")', val: Math.round(8.5 * 25.4 * pxPerMm) + GUTTER_WIDTH },
              ].map((preset) => {
                const isActive = !isAutoFit && customWidthPx === preset.val;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyWidthPreset(preset.val)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                      isActive
                        ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-2xs'
                        : 'bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Action: Measure Full Span */}
            <button
              type="button"
              id="btn-measure-full-span"
              onClick={handleMeasureEntireSpan}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-semibold border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
              title="Expand caliper from 0 to full ruler edge"
            >
              <MoveHorizontal className="w-3.5 h-3.5 text-amber-600" />
              <span>Measure Entire Span</span>
            </button>
          </div>

          {/* Continuous Width Scrubbing Slider */}
          <div className="flex items-center gap-3 pt-1 border-t border-stone-200/70 dark:border-stone-700/60">
            <span className="text-[11px] font-mono text-stone-500 font-medium whitespace-nowrap">
              Adjust Width:
            </span>
            <input
              id="slider-ruler-width"
              type="range"
              min="320"
              max={Math.max(1600, Math.round((containerWidthPx || 1200) * 1.5))}
              step="10"
              value={Math.round(effectiveWidthPx)}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCustomWidthPx(val);
                setIsAutoFit(false);
              }}
              className="flex-1 h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
              title="Drag slider to adjust ruler width"
            />
            <span className="text-[11px] font-mono font-bold text-stone-800 dark:text-stone-200 min-w-16 text-right">
              {Math.round(effectiveWidthPx)} px
            </span>
          </div>
        </div>

        {/* Scrollable Ruler Track with Dedicated Sticky Labels Column */}
        <div
          ref={containerRef}
          id="ruler-scroll-container"
          className="overflow-x-auto pb-4 pt-2 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50/50 dark:bg-stone-900/40 relative cursor-crosshair w-full"
        >
          <div
            id="multi-unit-ruler-track"
            className="relative flex h-64 bg-white dark:bg-stone-900 select-none transition-all w-full min-w-full"
            style={{ width: `${GUTTER_WIDTH + rulerWidthPx}px` }}
          >
            {/* Dedicated Sticky Left Column for Scale Unit Badges (Never overlaps numbers) */}
            <div
              id="ruler-labels-gutter"
              className="sticky left-0 z-30 w-28 shrink-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs border-r-2 border-stone-300 dark:border-stone-700 select-none pointer-events-none shadow-xs"
            >
              {/* Label 1: Millimeters */}
              <div className="absolute top-4 left-2 right-2 h-10 flex items-center">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase font-mono bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded shadow-2xs border border-emerald-300 dark:border-emerald-800/60 truncate">
                  mm (Metric)
                </span>
              </div>

              {/* Label 2: Points */}
              <div className="absolute top-16 left-2 right-2 h-10 flex items-center">
                <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase font-mono bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded shadow-2xs border border-blue-300 dark:border-blue-800/60 truncate">
                  pt (Points)
                </span>
              </div>

              {/* Label 3: Inches */}
              <div className="absolute top-28 left-2 right-2 h-10 flex items-center">
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase font-mono bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded shadow-2xs border border-amber-300 dark:border-amber-800/60 truncate">
                  in (Inches)
                </span>
              </div>

              {/* Label 4: Picas */}
              <div className="absolute top-40 left-2 right-2 h-10 flex items-center">
                <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase font-mono bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded shadow-2xs border border-rose-300 dark:border-rose-800/60 truncate">
                  pc (Picas)
                </span>
              </div>

              {/* Label 5: Pixels */}
              <div className="absolute top-52 left-2 right-2 h-10 flex items-center">
                <span className="text-[10px] font-bold text-sky-800 dark:text-sky-300 uppercase font-mono bg-sky-100 dark:bg-sky-950/80 px-2 py-0.5 rounded shadow-2xs border border-sky-300 dark:border-sky-800/60 truncate">
                  px (@{config.dpi})
                </span>
              </div>
            </div>

            {/* Scaled Measurement Canvas (Ticks, Caliper Handles & Numbers) */}
            <div
              ref={rulerRef}
              id="multi-unit-ruler-canvas"
              className="relative flex-1 h-full select-none"
              style={{ width: `${rulerWidthPx}px` }}
              onMouseDown={handleRulerMouseDown}
            >
              {/* Interactive Right-Edge Drag Resize Handle */}
              <div
                id="ruler-right-resize-handle"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsResizingRuler(true);
                  setIsAutoFit(false);
                  if (!customWidthPx) setCustomWidthPx(GUTTER_WIDTH + rulerWidthPx);
                }}
                className="absolute top-0 right-0 bottom-0 w-3 hover:w-4 bg-stone-200/80 dark:bg-stone-800/80 hover:bg-amber-500 dark:hover:bg-amber-600 cursor-ew-resize flex items-center justify-center transition-all z-40 group"
                title="Click & drag right edge to resize ruler width"
              >
                <GripVertical className="w-3.5 h-3.5 text-stone-400 group-hover:text-white" />
              </div>

              {/* Caliper Highlight Overlay Box */}
              <div
                className="absolute top-0 bottom-0 bg-amber-400/15 border-x-2 border-amber-500 pointer-events-none z-10 flex items-center justify-center transition-all"
                style={{
                  left: `${Math.min(measureStartMm, measureEndMm) * pxPerMm}px`,
                  width: `${measuredDistanceMm * pxPerMm}px`,
                }}
              >
                {measuredDistanceMm * pxPerMm > 60 && (
                  <div className="bg-stone-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    {measuredDistanceMm.toFixed(1)} mm ({formatValue(measuredConversions.pt, 'pt')} pt)
                  </div>
                )}
              </div>

              {/* Caliper Handle Start */}
              <div
                id="caliper-handle-start"
                className="absolute top-0 -bottom-2 w-0.5 bg-amber-600 z-30 cursor-ew-resize group"
                style={{ left: `${measureStartMm * pxPerMm}px` }}
              >
                <div className="absolute -top-3 -translate-x-1/2 bg-amber-500 text-stone-950 font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm border border-amber-600">
                  A
                </div>
              </div>

              {/* Caliper Handle End */}
              <div
                id="caliper-handle-end"
                className="absolute top-0 -bottom-2 w-0.5 bg-amber-600 z-30 cursor-ew-resize group"
                style={{ left: `${measureEndMm * pxPerMm}px` }}
              >
                <div className="absolute -top-3 -translate-x-1/2 bg-amber-500 text-stone-950 font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm border border-amber-600">
                  B
                </div>
              </div>

              {/* Scale 1: Millimeters (mm) */}
              <div className="absolute top-4 left-0 right-0 h-10 border-b border-stone-200 dark:border-stone-800">
                {Array.from({ length: Math.floor(rulerLengthMm) + 1 }).map((_, mm) => {
                  const isTen = mm % 10 === 0;
                  const isFive = mm % 5 === 0;
                  const height = isTen ? 'h-5' : isFive ? 'h-3.5' : 'h-2';
                  const leftPx = mm * pxPerMm;

                  return (
                    <div
                      key={`mm-${mm}`}
                      className={`absolute bottom-0 w-px bg-stone-700 dark:bg-stone-400 ${height}`}
                      style={{ left: `${leftPx}px` }}
                    >
                      {isTen && (
                        <span className={`absolute -top-3.5 font-mono text-stone-600 dark:text-stone-300 font-semibold text-[9px] ${mm === 0 ? 'left-0.5' : '-translate-x-1/2'}`}>
                          {mm}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Scale 2: Points (pt) - 1 pt = 0.352778 mm */}
              <div className="absolute top-16 left-0 right-0 h-10 border-b border-stone-200 dark:border-stone-800">
                {Array.from({ length: Math.floor(rulerLengthMm / 0.352778) + 1 }).map((_, ptIndex) => {
                  // Draw ticks every 6 pt, label every 12 or 24 pt
                  if (ptIndex % 6 !== 0) return null;
                  const is24 = ptIndex % 24 === 0;
                  const is12 = ptIndex % 12 === 0;
                  const height = is24 ? 'h-5' : is12 ? 'h-3.5' : 'h-2';
                  const leftPx = (ptIndex / 72) * 25.4 * pxPerMm;

                  return (
                    <div
                      key={`pt-${ptIndex}`}
                      className={`absolute bottom-0 w-px bg-blue-700 dark:bg-blue-400 ${height}`}
                      style={{ left: `${leftPx}px` }}
                    >
                      {is24 && (
                        <span className={`absolute -top-3.5 font-mono text-blue-800 dark:text-blue-300 font-semibold text-[9px] ${ptIndex === 0 ? 'left-0.5' : '-translate-x-1/2'}`}>
                          {ptIndex}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Scale 3: Inches (in) - 1 in = 25.4 mm */}
              <div className="absolute top-28 left-0 right-0 h-10 border-b border-stone-200 dark:border-stone-800">
                {Array.from({ length: Math.floor(rulerLengthMm / 25.4) * 8 + 1 }).map((_, eigthIdx) => {
                  const isWhole = eigthIdx % 8 === 0;
                  const isHalf = eigthIdx % 4 === 0;
                  const isQuarter = eigthIdx % 2 === 0;
                  const height = isWhole ? 'h-6' : isHalf ? 'h-4' : isQuarter ? 'h-3' : 'h-2';
                  const leftPx = (eigthIdx / 8) * 25.4 * pxPerMm;

                  return (
                    <div
                      key={`in-${eigthIdx}`}
                      className={`absolute bottom-0 w-px bg-amber-800 dark:bg-amber-400 ${height}`}
                      style={{ left: `${leftPx}px` }}
                    >
                      {isWhole && (
                        <span className={`absolute -top-3.5 font-mono text-amber-900 dark:text-amber-300 font-bold text-[10px] ${eigthIdx === 0 ? 'left-0.5' : '-translate-x-1/2'}`}>
                          {eigthIdx / 8}&quot;
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Scale 4: Picas (pc) - 1 pc = 12 pt = 4.2333 mm */}
              <div className="absolute top-40 left-0 right-0 h-10 border-b border-stone-200 dark:border-stone-800">
                {Array.from({ length: Math.floor(rulerLengthMm / 4.233333) + 1 }).map((_, pcIdx) => {
                  const isEven = pcIdx % 2 === 0;
                  const height = isEven ? 'h-5' : 'h-3';
                  const leftPx = pcIdx * 4.233333 * pxPerMm;

                  return (
                    <div
                      key={`pc-${pcIdx}`}
                      className={`absolute bottom-0 w-px bg-rose-700 dark:bg-rose-400 ${height}`}
                      style={{ left: `${leftPx}px` }}
                    >
                      {isEven && (
                        <span className={`absolute -top-3.5 font-mono text-rose-800 dark:text-rose-300 font-semibold text-[9px] ${pcIdx === 0 ? 'left-0.5' : '-translate-x-1/2'}`}>
                          {pcIdx}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Scale 5: Pixels (px) at current DPI */}
              <div className="absolute top-52 left-0 right-0 h-10">
                {Array.from({ length: Math.floor((rulerLengthMm / 25.4) * config.dpi / 10) + 1 }).map((_, pxTenIdx) => {
                  const pxVal = pxTenIdx * 10;
                  const is50 = pxVal % 50 === 0;
                  const height = is50 ? 'h-5' : 'h-2.5';
                  const leftPx = (pxVal / config.dpi) * 25.4 * pxPerMm;

                  return (
                    <div
                      key={`px-${pxVal}`}
                      className={`absolute bottom-0 w-px bg-sky-700 dark:bg-sky-400 ${height}`}
                      style={{ left: `${leftPx}px` }}
                    >
                      {is50 && (
                        <span className={`absolute -top-3.5 font-mono text-sky-800 dark:text-sky-300 font-semibold text-[9px] ${pxVal === 0 ? 'left-0.5' : '-translate-x-1/2'}`}>
                          {pxVal}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Design Object Comparator Cards */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
          <MoveHorizontal className="w-4 h-4 text-stone-700" />
          Common Graphic Design Physical Scale Visualizers
        </h3>
        <p className="text-xs text-stone-500">
          Visual sizing reference comparing typographic elements, paper margins, and physical objects.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Card 1: 72pt vs 12pt Typography Height */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Cap-Height & Type Scale
              </span>
              <p className="text-xs text-stone-600 mb-3">
                72 pt (1 inch) display type vs 12 pt body text
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 border border-stone-200 flex items-baseline gap-4">
              <span className="text-5xl font-bold font-serif text-stone-900 leading-none">
                Ag
              </span>
              <div className="space-y-1">
                <span className="text-base font-bold font-sans text-stone-800 block leading-tight">
                  12 pt Body Text
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  72pt = 25.4mm | 12pt = 4.23mm
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Standard Credit Card Reference */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Standard ID-1 Card
              </span>
              <p className="text-xs text-stone-600 mb-3">
                85.60 mm × 53.98 mm (3.370 in × 2.125 in)
              </p>
            </div>

            <div className="bg-linear-to-r from-stone-900 to-stone-800 rounded-lg p-3 text-white flex items-center justify-between shadow-2xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-amber-300 font-bold block">
                  ISO/IEC 7810
                </span>
                <span className="text-xs font-semibold">Universal Bank Card</span>
              </div>
              <CreditCard className="w-6 h-6 text-stone-400" />
            </div>
          </div>

          {/* Card 3: Standard 1-inch swatch */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                1 Exact Inch Benchmark
              </span>
              <p className="text-xs text-stone-600 mb-3">
                25.4 mm = 72 pt = 6 picas = 96 CSS px
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 border border-stone-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-md flex items-center justify-center font-bold text-xs text-stone-950 font-mono border border-amber-600 shadow-2xs">
                1"
              </div>
              <div className="text-xs text-stone-700 font-mono space-y-0.5">
                <div>25.40 mm</div>
                <div className="text-stone-400">72.00 pt / 6.00 pc</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
