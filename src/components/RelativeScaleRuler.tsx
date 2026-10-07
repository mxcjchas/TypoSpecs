import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Unit } from '../types';
import { formatValue } from '../utils/converters';
import { GripVertical } from 'lucide-react';

interface RelativeScaleRulerProps {
  inputValue: number;
  activeUnit: Unit;
  inches: number;
  millimeters: number;
  points: number;
  pixels: number;
  offsetInches?: number;
  onChangeOffset?: (newOffset: number) => void;
  onChangeValue?: (newInches: number) => void;
  maxInches?: number;
}

export const RelativeScaleRuler: React.FC<RelativeScaleRulerProps> = ({
  inputValue,
  activeUnit,
  inches,
  millimeters,
  offsetInches = 0,
  onChangeOffset,
  onChangeValue,
  maxInches: propMaxInches = 5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragMode, setDragMode] = useState<'none' | 'resize' | 'move'>('none');
  const dragStartRef = useRef<{
    startX: number;
    initialInches: number;
    initialOffset: number;
  }>({ startX: 0, initialInches: 0, initialOffset: 0 });

  // Dynamically ensure ruler accommodates measurement + offset with at least 5 inches
  const maxInches = Math.max(propMaxInches, Math.ceil(inches + offsetInches));

  // SVG coordinate padding to ensure labels never clip on the left/right rounded edges
  const SVG_WIDTH = 1000;
  const LEFT_PAD = 32;
  const RIGHT_PAD = 32;
  const USABLE_WIDTH = SVG_WIDTH - LEFT_PAD - RIGHT_PAD;

  // Generate ruler tick marks for the relative scale
  const ticks = useMemo(() => {
    const list: Array<{
      fraction: number;
      x: number;
      type: 'inch' | 'half' | 'quarter' | 'eighth' | 'sixteenth';
      inchNum?: number;
    }> = [];

    const totalSixteenths = maxInches * 16;
    for (let s = 0; s <= totalSixteenths; s++) {
      const fraction = s / totalSixteenths;
      const x = LEFT_PAD + fraction * USABLE_WIDTH;
      if (s % 16 === 0) {
        list.push({ fraction, x, type: 'inch', inchNum: s / 16 });
      } else if (s % 8 === 0) {
        list.push({ fraction, x, type: 'half' });
      } else if (s % 4 === 0) {
        list.push({ fraction, x, type: 'quarter' });
      } else if (s % 2 === 0) {
        list.push({ fraction, x, type: 'eighth' });
      } else {
        list.push({ fraction, x, type: 'sixteenth' });
      }
    }
    return list;
  }, [maxInches, USABLE_WIDTH, LEFT_PAD]);

  // Compute CSS percentage positions for the active measurement bar
  const startFraction = Math.max(0, Math.min(1, offsetInches / maxInches));
  const spanFraction = Math.max(0.008, Math.min(1 - startFraction, inches / maxInches));

  const leftPercent = ((LEFT_PAD + startFraction * USABLE_WIDTH) / SVG_WIDTH) * 100;
  const widthPercent = ((spanFraction * USABLE_WIDTH) / SVG_WIDTH) * 100;

  // Convert container mouse pixel position to inches on the ruler
  const pxToInches = (clientX: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const effectiveLeft = rect.left + (LEFT_PAD / SVG_WIDTH) * rect.width;
    const effectiveWidth = (USABLE_WIDTH / SVG_WIDTH) * rect.width;
    const fraction = (clientX - effectiveLeft) / effectiveWidth;
    return Math.max(0, fraction * maxInches);
  };

  // Start resizing the measurement value (Right caliper edge)
  const handleStartResize = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!onChangeValue) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragMode('resize');
    dragStartRef.current = {
      startX: clientX,
      initialInches: inches,
      initialOffset: offsetInches,
    };
  };

  // Start sliding the measurement position (Bar body)
  const handleStartMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!onChangeOffset) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragMode('move');
    dragStartRef.current = {
      startX: clientX,
      initialInches: inches,
      initialOffset: offsetInches,
    };
  };

  // Click on background ruler track sets measurement value directly
  const handleTrackClick = (e: React.MouseEvent) => {
    if (!onChangeValue || dragMode !== 'none') return;
    const clickedInch = pxToInches(e.clientX);
    // Snap to 1/16"
    const snapped = Math.round(clickedInch * 16) / 16;
    onChangeValue(Math.max(0.0625, snapped));
  };

  useEffect(() => {
    if (dragMode === 'none') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaPx = e.clientX - dragStartRef.current.startX;
      const pxPerInch = (rect.width * (USABLE_WIDTH / SVG_WIDTH)) / maxInches;
      const deltaInches = deltaPx / pxPerInch;

      if (dragMode === 'resize' && onChangeValue) {
        const newInches = Math.max(0.0625, dragStartRef.current.initialInches + deltaInches);
        const snapped = Math.round(newInches * 16) / 16;
        onChangeValue(snapped);
      } else if (dragMode === 'move' && onChangeOffset) {
        const newOffset = Math.max(0, Math.min(maxInches - 0.1, dragStartRef.current.initialOffset + deltaInches));
        const snapped = Math.round(newOffset * 16) / 16;
        onChangeOffset(snapped);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaPx = e.touches[0].clientX - dragStartRef.current.startX;
      const pxPerInch = (rect.width * (USABLE_WIDTH / SVG_WIDTH)) / maxInches;
      const deltaInches = deltaPx / pxPerInch;

      if (dragMode === 'resize' && onChangeValue) {
        const newInches = Math.max(0.0625, dragStartRef.current.initialInches + deltaInches);
        const snapped = Math.round(newInches * 16) / 16;
        onChangeValue(snapped);
      } else if (dragMode === 'move' && onChangeOffset) {
        const newOffset = Math.max(0, Math.min(maxInches - 0.1, dragStartRef.current.initialOffset + deltaInches));
        const snapped = Math.round(newOffset * 16) / 16;
        onChangeOffset(snapped);
      }
    };

    const handleMouseUp = () => setDragMode('none');

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [dragMode, maxInches, onChangeOffset, onChangeValue, USABLE_WIDTH, SVG_WIDTH]);

  // Determine badge placement to avoid clipping
  const isBadgeInside = widthPercent > 20;
  const isNearRightEdge = leftPercent + widthPercent > 80;

  return (
    <div className="w-full space-y-1.5">
      {/* Ruler Track Container */}
      <div
        ref={containerRef}
        onClick={handleTrackClick}
        className="relative h-12 w-full bg-stone-200/90 rounded-xl overflow-hidden border border-stone-300 shadow-inner select-none cursor-crosshair"
        title="Click anywhere to set measurement, drag bar to move, or drag right edge to resize"
      >
        {/* Background Inactive Ruler Track (Etched tick marks) */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 44">
            {ticks.map((t, idx) => {
              let y2 = 8;
              let strokeWidth = 1;
              let color = '#94a3b8'; // stone-400

              if (t.type === 'inch') {
                y2 = 28;
                strokeWidth = 1.8;
                color = '#64748b'; // stone-500
              } else if (t.type === 'half') {
                y2 = 20;
                strokeWidth = 1.3;
              } else if (t.type === 'quarter') {
                y2 = 14;
                strokeWidth = 1;
              } else if (t.type === 'eighth') {
                y2 = 10;
                strokeWidth = 0.8;
              }

              return (
                <g key={`bg-tick-${idx}`}>
                  {/* Top tick line */}
                  <line
                    x1={t.x}
                    y1={0}
                    x2={t.x}
                    y2={y2}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="square"
                  />
                  {/* Bottom tick line */}
                  <line
                    x1={t.x}
                    y1={44}
                    x2={t.x}
                    y2={44 - Math.min(y2, 16)}
                    stroke={color}
                    strokeWidth={strokeWidth * 0.8}
                    strokeLinecap="square"
                  />
                  {/* Major inch numbers on track */}
                  {t.type === 'inch' && t.inchNum !== undefined && (
                    <text
                      x={t.x + (t.inchNum === 0 ? 4 : -4)}
                      y={24}
                      fill="#64748b"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor={t.inchNum === 0 ? 'start' : 'middle'}
                    >
                      {t.inchNum}&quot;
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dynamic Slidable & Resizable Measurement Bar (Active Measurement Span) */}
        <div
          id="relative-ruler-black-bar"
          onMouseDown={handleStartMove}
          onTouchStart={handleStartMove}
          className={`absolute top-0 bottom-0 bg-stone-900 overflow-hidden transition-all duration-75 flex items-center shadow-md border-l-2 border-r-2 border-amber-400 ${
            onChangeOffset ? (dragMode === 'move' ? 'cursor-grabbing' : 'cursor-grab') : ''
          }`}
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
          }}
          title="Drag bar to slide position along ruler"
        >
          {/* Internal High-Contrast Amber Ticks Layer matching the background position */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: `${-((startFraction * USABLE_WIDTH + LEFT_PAD) / (spanFraction * USABLE_WIDTH)) * 100}%`,
              width: `${(SVG_WIDTH / (spanFraction * USABLE_WIDTH)) * 100}%`,
              height: '100%',
            }}
          >
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 44">
              {ticks.map((t, idx) => {
                let y2 = 8;
                let strokeWidth = 1;
                let color = 'rgba(255, 255, 255, 0.45)';

                if (t.type === 'inch') {
                  y2 = 28;
                  strokeWidth = 2;
                  color = '#f59e0b'; // amber-500
                } else if (t.type === 'half') {
                  y2 = 20;
                  strokeWidth = 1.4;
                  color = '#fde68a'; // amber-200
                } else if (t.type === 'quarter') {
                  y2 = 14;
                  strokeWidth = 1.1;
                  color = 'rgba(255, 255, 255, 0.75)';
                } else if (t.type === 'eighth') {
                  y2 = 10;
                  strokeWidth = 0.9;
                  color = 'rgba(255, 255, 255, 0.5)';
                }

                return (
                  <g key={`fg-tick-${idx}`}>
                    <line
                      x1={t.x}
                      y1={0}
                      x2={t.x}
                      y2={y2}
                      stroke={color}
                      strokeWidth={strokeWidth}
                      strokeLinecap="square"
                    />
                    <line
                      x1={t.x}
                      y1={44}
                      x2={t.x}
                      y2={44 - Math.min(y2, 16)}
                      stroke={color}
                      strokeWidth={strokeWidth * 0.8}
                      strokeLinecap="square"
                    />
                    {t.type === 'inch' && t.inchNum !== undefined && (
                      <text
                        x={t.x + (t.inchNum === 0 ? 4 : -4)}
                        y={24}
                        fill="#fbbf24"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor={t.inchNum === 0 ? 'start' : 'middle'}
                      >
                        {t.inchNum}&quot;
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Edge Resize Handle (Drag to adjust measurement value) */}
        {onChangeValue && (
          <div
            onMouseDown={handleStartResize}
            onTouchStart={handleStartResize}
            className="absolute top-0 bottom-0 w-5 -ml-2.5 z-40 cursor-ew-resize flex items-center justify-center group"
            style={{ left: `${leftPercent + widthPercent}%` }}
            title="Drag right edge to resize measurement value"
          >
            <div className="w-1.5 h-7 bg-amber-400 group-hover:bg-amber-300 rounded-full shadow-md flex items-center justify-center transition-transform group-hover:scale-110">
              <div className="w-0.5 h-3 bg-stone-900 rounded-full" />
            </div>
          </div>
        )}

        {/* Floating Active Measurement Readout Badge (Safely positioned outside overflow-hidden) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none transition-all duration-75 flex items-center gap-1 bg-stone-950/95 border border-amber-400/90 px-2 py-0.5 rounded-md shadow-md"
          style={{
            left: isBadgeInside
              ? `${leftPercent + widthPercent / 2}%`
              : isNearRightEdge
              ? `${Math.max(2, leftPercent - 1)}%`
              : `${Math.min(96, leftPercent + widthPercent + 1)}%`,
            transform: isBadgeInside
              ? 'translate(-50%, -50%)'
              : isNearRightEdge
              ? 'translate(-100%, -50%)'
              : 'translate(0%, -50%)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="text-[11px] font-mono text-amber-300 font-bold tracking-tight whitespace-nowrap">
            {formatValue(inputValue, activeUnit)} {activeUnit}
          </span>
          <span className="text-[10px] font-mono text-stone-300 font-medium whitespace-nowrap pl-1 border-l border-stone-700">
            {formatValue(inches, 'in')}&quot; ({formatValue(millimeters, 'mm')} mm)
          </span>
          {offsetInches > 0 && (
            <span className="text-[10px] font-mono text-amber-400 font-semibold whitespace-nowrap pl-1 border-l border-stone-700">
              @{offsetInches.toFixed(2)}&quot;
            </span>
          )}
        </div>

        {/* Caliper End Glow Guides */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 pointer-events-none shadow-[0_0_8px_rgba(251,191,36,0.8)] z-20"
          style={{ left: `${leftPercent}%` }}
        />
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 pointer-events-none shadow-[0_0_8px_rgba(251,191,36,0.8)] z-20"
          style={{ left: `${leftPercent + widthPercent}%` }}
        />
      </div>

      {/* Scale Reference Footnotes */}
      <div className="flex justify-between items-center text-[10px] text-stone-500 font-mono px-3 select-none">
        <span className="font-semibold text-stone-700">0&quot; (0 mm)</span>
        <span>1 in (25.4 mm)</span>
        <span>2.5 in (63.5 mm)</span>
        <span className="font-semibold text-stone-700">
          {maxInches} in ({maxInches * 25.4} mm)
        </span>
      </div>
    </div>
  );
};
