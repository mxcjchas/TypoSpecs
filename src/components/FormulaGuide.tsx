import React, { useState } from 'react';
import { ReferenceConfig } from '../types';
import { BookOpen, Sparkles, Copy, CheckCircle2, Layers, HelpCircle, Check } from 'lucide-react';

interface FormulaGuideProps {
  config: ReferenceConfig;
}

export const FormulaGuide: React.FC<FormulaGuideProps> = ({ config }) => {
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const formulas = [
    {
      id: 'pt-to-in',
      name: 'Points (pt) to Inches (in)',
      equation: '1 in = 72 pt',
      inverse: '1 pt = 1/72 in ≈ 0.013889 in',
      explanation: 'Established by John Warnock and Adobe in 1984 for PostScript DTP, fixing the traditional American point (1/72.27 in) to exactly 1/72 inch.',
      practical: '72 pt type = 1 inch tall cap-height; 36 pt = 0.5 inch; 18 pt = 0.25 inch.',
    },
    {
      id: 'pt-to-mm',
      name: 'Points (pt) to Millimeters (mm)',
      equation: '1 pt = 25.4 / 72 mm ≈ 0.352778 mm',
      inverse: '1 mm = 72 / 25.4 pt ≈ 2.834646 pt',
      explanation: 'Converts between standard metric ISO publication standards and typographic point sizes.',
      practical: '12 pt type = 4.233 mm; 3 mm bleed = 8.504 pt; 10 mm margin = 28.35 pt.',
    },
    {
      id: 'px-to-in',
      name: 'Pixels (px) to Inches (in)',
      equation: 'Pixels = Inches × DPI',
      inverse: 'Inches = Pixels / DPI',
      explanation: `At standard CSS 96 DPI: 1 in = 96 px. At commercial 300 DPI print: 1 in = 300 px.`,
      practical: `At your active ${config.dpi} DPI setting: 1 in = ${config.dpi} px; 0.5 in = ${config.dpi / 2} px.`,
    },
    {
      id: 'px-to-pt',
      name: 'Pixels (px) to Points (pt)',
      equation: 'Points = Pixels × (72 / DPI)',
      inverse: 'Pixels = Points × (DPI / 72)',
      explanation: 'When DPI is 96 (Web): 1 pt = 1.3333 px (16px = 12pt). When DPI is 72 (Classic Mac): 1 pt = 1 px. When DPI is 300 (Print): 1 pt = 4.167 px.',
      practical: 'In CSS, 16px body font equals 12pt in print software at 96 DPI.',
    },
    {
      id: 'em-to-px',
      name: 'Em / Rem to Pixels & Points',
      equation: 'Pixels = Em × BaseFontSizePx',
      inverse: 'Em = Pixels / BaseFontSizePx',
      explanation: '1 em represents 100% of the active font size. 1 rem is locked to the root <html> font size (default 16px).',
      practical: `With root at ${config.baseFontSizePx}px: 1.5rem = ${config.baseFontSizePx * 1.5}px; 2rem = ${config.baseFontSizePx * 2}px; 0.75rem = ${config.baseFontSizePx * 0.75}px.`,
    },
    {
      id: 'pica-to-pt',
      name: 'Picas (pc) to Points & Millimeters',
      equation: '1 pc = 12 pt = 1/6 in = 4.2333 mm',
      inverse: '6 pc = 1 in = 72 pt = 25.4 mm',
      explanation: 'Picas are the foundational unit for newspaper and magazine column grid systems.',
      practical: 'Standard editorial gutter is typically 1 pica (12 pt); standard column is 12 to 18 picas.',
    },
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(id);
    setTimeout(() => setCopiedFormula(null), 1800);
  };

  return (
    <div id="formula-guide-container" className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-stone-900 text-stone-100 font-mono">
            Reference Guide
          </span>
          <span className="text-xs text-stone-500 font-medium">
            Mathematical Equations & Typography Rules of Thumb
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mt-2 font-sans">
          Conversion Mathematics & Typographic History
        </h2>
        <p className="text-sm text-stone-600 max-w-2xl mt-1 leading-relaxed">
          Exact mathematical relationships between physical print standards (InDesign, Affinity Studio, QuarkXPress) and digital web standards (CSS, Canvas).
        </p>
      </div>

      {/* Grid of Formulas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formulas.map((f) => (
          <div
            key={f.id}
            id={`formula-card-${f.id}`}
            className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-stone-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 text-base">{f.name}</h3>
                <button
                  onClick={() => handleCopy(`${f.equation} | ${f.inverse}`, f.id)}
                  className="text-stone-400 hover:text-stone-900 p-1 rounded cursor-pointer transition-colors"
                  title="Copy equations"
                >
                  {copiedFormula === f.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Equation Box */}
              <div className="mt-3 bg-stone-50 rounded-xl p-3 border border-stone-200/80 font-mono text-xs space-y-1">
                <div className="font-bold text-stone-900 text-sm">{f.equation}</div>
                <div className="text-stone-500">{f.inverse}</div>
              </div>

              {/* Historical Context & Rationale */}
              <p className="mt-3 text-xs text-stone-600 leading-relaxed">
                {f.explanation}
              </p>
            </div>

            {/* Practical Rule of Thumb */}
            <div className="pt-3 border-t border-stone-100 text-xs">
              <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded text-[10px] uppercase font-mono mr-1.5 border border-amber-200">
                Rule of Thumb
              </span>
              <span className="text-stone-700 font-medium">{f.practical}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Lookup Conversion Table Cheat Sheet */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-stone-700" />
          Quick Lookup Equivalency Matrix (at 96 DPI CSS Standard)
        </h3>

        <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
          <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-800 text-left text-xs font-mono">
            <thead className="bg-stone-50 dark:bg-stone-900/90 text-stone-600 dark:text-stone-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Points (pt)</th>
                <th className="px-4 py-3">Inches (in)</th>
                <th className="px-4 py-3">Millimeters (mm)</th>
                <th className="px-4 py-3">Pixels (px @96dpi)</th>
                <th className="px-4 py-3">Picas (pc)</th>
                <th className="px-4 py-3">Em / Rem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80 bg-white dark:bg-stone-900/40 text-stone-800 dark:text-stone-200">
              {[
                { pt: '6 pt', in: '0.0833 in', mm: '2.117 mm', px: '8 px', pc: '0.5 pc', em: '0.500 em' },
                { pt: '9 pt', in: '0.1250 in', mm: '3.175 mm', px: '12 px', pc: '0.75 pc', em: '0.750 em' },
                { pt: '12 pt', in: '0.1667 in', mm: '4.233 mm', px: '16 px', pc: '1.0 pc', em: '1.000 em' },
                { pt: '14 pt', in: '0.1944 in', mm: '4.939 mm', px: '18.67 px', pc: '1.167 pc', em: '1.167 em' },
                { pt: '18 pt', in: '0.2500 in', mm: '6.350 mm', px: '24 px', pc: '1.5 pc', em: '1.500 em' },
                { pt: '24 pt', in: '0.3333 in', mm: '8.467 mm', px: '32 px', pc: '2.0 pc', em: '2.000 em' },
                { pt: '36 pt', in: '0.5000 in', mm: '12.700 mm', px: '48 px', pc: '3.0 pc', em: '3.000 em' },
                { pt: '72 pt', in: '1.0000 in', mm: '25.400 mm', px: '96 px', pc: '6.0 pc', em: '6.000 em' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-blue-900 dark:text-blue-300">{row.pt}</td>
                  <td className="px-4 py-2.5 text-amber-900 dark:text-amber-300">{row.in}</td>
                  <td className="px-4 py-2.5 text-emerald-900 dark:text-emerald-300">{row.mm}</td>
                  <td className="px-4 py-2.5 text-sky-900 dark:text-sky-300">{row.px}</td>
                  <td className="px-4 py-2.5 text-rose-900 dark:text-rose-300">{row.pc}</td>
                  <td className="px-4 py-2.5 text-indigo-900 dark:text-indigo-300">{row.em}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
