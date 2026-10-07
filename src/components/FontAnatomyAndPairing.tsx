import React, { useState, useMemo } from 'react';
import { ReferenceConfig, AnatomyCallout, TypefaceClassification, TypographicPairing } from '../types';
import {
  BookOpen,
  Type,
  Sparkles,
  Layers,
  Copy,
  Check,
  Sliders,
  Eye,
  Info,
  ChevronRight,
  ArrowRight,
  Compass,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface FontAnatomyAndPairingProps {
  config: ReferenceConfig;
}

// --------------------------------------------------------------------------
// 1. Comprehensive Anatomical Terms & Data
// --------------------------------------------------------------------------
const ANATOMY_DATA: AnatomyCallout[] = [
  {
    id: 'cap-height',
    name: 'Cap Height',
    category: 'metric-line',
    definition: 'The height of a capital letter above the baseline for a particular typeface, measured from the baseline to the top of flat uppercase letters like H or E.',
    historicalOrigin: 'Originates from the metal type era when uppercase letters were cast on lead blocks with consistent top alignment.',
    opticalRole: 'Creates visual alignment for headlines; curved capital letters like O or C often extend slightly above the cap height (overshoot) to appear optically equal.',
    exampleLetters: ['H', 'E', 'T', 'B'],
    xPercent: 18,
    yPercent: 26,
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    id: 'x-height',
    name: 'X-Height (Mean Line)',
    category: 'metric-line',
    definition: 'The height of lowercase letters, traditionally exemplified by the lowercase x, excluding ascenders and descenders.',
    historicalOrigin: 'First systematically categorized by Renaissance punchcutters imitating humanistic bookhands.',
    opticalRole: 'Primary determinant of readability and perceived font size. Typefaces with tall x-heights (like Helvetica) appear larger at equal point sizes than those with small x-heights (like Garamond).',
    exampleLetters: ['x', 'e', 'o', 'a', 'n'],
    xPercent: 50,
    yPercent: 44,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'baseline',
    name: 'Baseline',
    category: 'metric-line',
    definition: 'The invisible foundational line upon which all characters sit and from which all typographic vertical metrics are measured.',
    historicalOrigin: 'The brass baseline guide used by typographers when composing metal slugs into typesetting sticks.',
    opticalRole: 'Guarantees horizontal continuity across a line of text. In modern design systems, locking text baselines to a modular grid is called the Baseline Grid Rhythm.',
    exampleLetters: ['H', 'x', 'g', 'p', 'M'],
    xPercent: 50,
    yPercent: 72,
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  {
    id: 'ascender',
    name: 'Ascender & Ascender Line',
    category: 'metric-line',
    definition: 'The upward vertical stroke in certain lowercase letters (such as h, b, d, k, l) that rises above the x-height mean line.',
    historicalOrigin: 'Evolved from early Carolingian minuscule calligraphy where quill pen strokes flourished upward for swift fluid writing.',
    opticalRole: 'Provides word-shape differentiation (BOUSTROPHEON contour recognition), allowing human brains to recognize words instantly by their silhouettes.',
    exampleLetters: ['h', 'b', 'd', 'k', 'l'],
    xPercent: 64,
    yPercent: 22,
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  {
    id: 'descender',
    name: 'Descender & Descender Line',
    category: 'metric-line',
    definition: 'The portion of a letter that falls beneath the baseline (as seen in g, j, p, q, y).',
    historicalOrigin: 'Calligraphic terminal strokes in humanistic script drawn below the line of writing to balance ascenders.',
    opticalRole: 'Determines the minimum safe leading (line-height) between text lines so descenders on one line do not collide with ascenders below.',
    exampleLetters: ['g', 'p', 'q', 'y', 'j'],
    xPercent: 78,
    yPercent: 92,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 'stem',
    name: 'Stem',
    category: 'stroke',
    definition: 'The primary vertical or near-vertical structural stroke of a letterform (such as the uprights of H, l, B, or I).',
    historicalOrigin: 'The heavy downward stroke made by a broad-nib calligraphy quill holding ink at a 30° to 45° angle.',
    opticalRole: 'Provides the visual weight (boldness) and optical gravity of the letterform. Optical adjustments ensure stems are slightly thinner than horizontal bars.',
    exampleLetters: ['H', 'l', 'F', 'p'],
    xPercent: 14,
    yPercent: 48,
    badgeColor: 'bg-stone-100 text-stone-800 border-stone-300',
  },
  {
    id: 'crossbar',
    name: 'Crossbar (Bar)',
    category: 'stroke',
    definition: 'The horizontal stroke connecting two stems in uppercase letters (H, A) or enclosed in lowercase letters (e).',
    historicalOrigin: 'A connecting ligature stroke in Roman lapidary inscriptions etched into stone monuments.',
    opticalRole: 'Usually drawn slightly above the true mathematical midpoint to avoid an optical illusion that makes the upper half appear bottom-heavy.',
    exampleLetters: ['H', 'A', 'e', 'f'],
    xPercent: 24,
    yPercent: 50,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    id: 'bowl',
    name: 'Bowl',
    category: 'counter-enclosure',
    definition: 'The fully curved stroke enclosing an inner negative space or counter (such as in d, b, o, p, B).',
    historicalOrigin: 'Formed by sweeping circular quill rotations in Roman uncials and insular scripts.',
    opticalRole: 'The thickness of a bowl typically varies based on the stroke stress axis, giving life, modulation, and historical character to the typeface.',
    exampleLetters: ['b', 'd', 'p', 'q', 'B'],
    xPercent: 72,
    yPercent: 56,
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  {
    id: 'counter',
    name: 'Counter (Aperture)',
    category: 'counter-enclosure',
    definition: 'The enclosed or semi-enclosed negative interior space within a letter (closed in o, p, b; open in c, e, s, a).',
    historicalOrigin: 'The physical metal punch cut by the punchcutter into the steel die to create the void before striking the matrix.',
    opticalRole: 'Wide, open counters dramatically enhance legibility at small sizes and low screen resolutions by preventing ink or pixel clogging.',
    exampleLetters: ['o', 'e', 'c', 'a', 'p'],
    xPercent: 74,
    yPercent: 54,
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  {
    id: 'serif-bracket',
    name: 'Serif & Bracket',
    category: 'terminal-serif',
    definition: 'A small decorative or finishing stroke attached to the terminal of a stem or arm; a bracket is the curved transition joining the serif to the stem.',
    historicalOrigin: 'Originated in imperial Roman stone carving (Trajan Column, 113 AD) as chisel fluting to prevent paint feathering at stroke ends.',
    opticalRole: 'Guides the reader’s eye horizontally along the line of text, tying individual letters into seamless word units in print editorial.',
    exampleLetters: ['H', 'T', 'I', 'l', 'd'],
    xPercent: 12,
    yPercent: 26,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    id: 'ear',
    name: 'Ear & Link / Neck',
    category: 'feature',
    definition: 'The small distinctive stroke projecting from the upper right of the lowercase double-story g; the link connects the upper bowl to the lower loop.',
    historicalOrigin: 'Preserved from early 15th-century Italian humanist bookhands to distinguish roman lowercase g from minuscule letters.',
    opticalRole: 'One of the most identifiable typographic signatures used by designers to recognize classical typefaces (e.g. Garamond vs. Baskerville vs. Caslon).',
    exampleLetters: ['g'],
    xPercent: 88,
    yPercent: 42,
    badgeColor: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  },
  {
    id: 'terminal',
    name: 'Terminal & Finial',
    category: 'terminal-serif',
    definition: 'The end of any stroke that does not terminate in a serif. Can take the form of a ball terminal (curved bulb in Bodoni), teardrop, or sheared angle.',
    historicalOrigin: 'The lift of the pen at the end of a handwritten brush or quill stroke.',
    opticalRole: 'Determines the rhythm and mood of modern sans-serifs (horizontal terminals in Helvetica create neutrality; angled terminals in Gill Sans add warmth).',
    exampleLetters: ['a', 'c', 'f', 'r', 'y'],
    xPercent: 86,
    yPercent: 68,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'tittle',
    name: 'Tittle (Dot)',
    category: 'feature',
    definition: 'The small distinguishing diacritical dot placed above the lowercase i and j.',
    historicalOrigin: 'Introduced in medieval Latin manuscripts (around the 11th century) to prevent confusion when adjacent minims (strokes in m, n, u, i) merged together.',
    opticalRole: 'Can be circular, square, diamond-shaped, or calligraphic; must be optically positioned so as not to appear detached from its base stem.',
    exampleLetters: ['i', 'j'],
    xPercent: 50,
    yPercent: 18,
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  {
    id: 'ligature',
    name: 'Ligature',
    category: 'feature',
    definition: 'A special combined glyph where two or more adjacent letters are fused together (e.g., fi, fl, ffi, ffl) to prevent collision.',
    historicalOrigin: 'In metal type, the overhanging hood of the lowercase f would physically collide with and snap off the tittle of the letter i unless cast on a single shared slug.',
    opticalRole: 'Eliminates distracting visual friction and negative-space collisions between awkward letter combinations, elevating professional editorial layout.',
    exampleLetters: ['fi', 'fl', 'ff', 'ae', 'oe'],
    xPercent: 60,
    yPercent: 30,
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  {
    id: 'spine-tail',
    name: 'Spine & Tail',
    category: 'stroke',
    definition: 'The spine is the central curved stroke of the letter S; the tail is the decorative or functional downward stroke in uppercase Q, R, and K.',
    historicalOrigin: 'Roman monumental inscriptions carving sweeping flourishes for imperial authority.',
    opticalRole: 'The tail of Q often extends beneath the baseline and requires generous tracking or open space to avoid colliding with following lowercase letters.',
    exampleLetters: ['S', 'Q', 'R', 'K'],
    xPercent: 40,
    yPercent: 60,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
];

// --------------------------------------------------------------------------
// 2. Typeface Classifications & Taxonomy
// --------------------------------------------------------------------------
const CLASSIFICATIONS_DATA: TypefaceClassification[] = [
  {
    id: 'old-style',
    name: 'Old Style / Humanist Serif',
    category: 'serif',
    era: '1470s – 1600s (Renaissance)',
    keyFeatures: 'Angled stroke stress (mimicking a quill tilted at 30°), moderate contrast between thick and thin strokes, bracketed cupped serifs, angled crossbar on lowercase e.',
    contrast: 'Low',
    axisOfStress: 'Diagonal / Calligraphic',
    aperture: 'Moderate',
    notableTypefaces: ['EB Garamond', 'Bembo', 'Caslon', 'Centaur', 'Minion'],
    idealUse: 'Long-form editorial book publishing, classical literature, and extended reading without eye fatigue.',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
  },
  {
    id: 'transitional',
    name: 'Transitional Serif',
    category: 'serif',
    era: '1750s (Enlightenment)',
    keyFeatures: 'Sharper contrast between thick and thin strokes, more upright/vertical stress axis, flatter and sharper serifs. Bridges Old Style warmth with Modern precision.',
    contrast: 'Medium',
    axisOfStress: 'Semi-Vertical',
    aperture: 'Moderate',
    notableTypefaces: ['Baskerville', 'Times New Roman', 'Georgia', 'Mrs Eaves'],
    idealUse: 'Newspapers, periodicals, scholarly essays, and authoritative corporate publications.',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
  },
  {
    id: 'didone-modern',
    name: 'Modern / Didone Serif',
    category: 'serif',
    era: 'Late 1700s – Early 1800s',
    keyFeatures: 'Radical extreme contrast between heavy vertical stems and hairline horizontals, strictly vertical stress axis, unbracketed razor-sharp flat serifs, ball terminals on lowercase letters.',
    contrast: 'Extreme',
    axisOfStress: 'Strictly Vertical',
    aperture: 'Moderate',
    notableTypefaces: ['Playfair Display', 'Bodoni', 'Didot', 'Cinzel'],
    idealUse: 'Luxury branding, fashion magazines (Vogue, Harper’s Bazaar), high-end cosmetics, and large display headings.',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
  },
  {
    id: 'slab-serif',
    name: 'Slab Serif / Egyptian',
    category: 'serif',
    era: '1810s (Industrial Revolution)',
    keyFeatures: 'Heavy, bold, square or rectangular serifs with little or no bracketing. Minimal stroke contrast, sturdy unyielding geometry designed to grab attention.',
    contrast: 'None / Uniform',
    axisOfStress: 'Strictly Vertical',
    aperture: 'Very Open',
    notableTypefaces: ['Rockwell', 'Clarendon', 'Sentinel', 'Roboto Slab'],
    idealUse: 'Posters, industrial signage, punchy editorial headlines, sports branding, and robust mobile UI buttons.',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-800',
  },
  {
    id: 'grotesque',
    name: 'Grotesque & Neo-Grotesque Sans',
    category: 'sans',
    era: 'Late 1800s – 1957 (Swiss Style)',
    keyFeatures: 'Neutral, objective, uniform stroke weight, horizontal stroke terminals, closed apertures (C and S curl inward), high x-height for maximum information density.',
    contrast: 'None / Uniform',
    axisOfStress: 'N/A (Geometric/Uniform)',
    aperture: 'Closed / Tight',
    notableTypefaces: ['Helvetica', 'Akzidenz-Grotesk', 'Univers', 'Space Grotesk', 'Inter'],
    idealUse: 'Wayfinding signs, airport terminals, international design systems, UI dashboards, and corporate identity.',
    badgeBg: 'bg-stone-200',
    badgeText: 'text-stone-800',
  },
  {
    id: 'geometric-sans',
    name: 'Geometric Sans',
    category: 'sans',
    era: '1920s – 1930s (Bauhaus)',
    keyFeatures: 'Constructed from pure geometric primitives: circles (O, C), sharp equilateral triangles (A, V), and clean vertical rectangles. Single-story lowercase a and g.',
    contrast: 'None / Uniform',
    axisOfStress: 'N/A (Geometric/Uniform)',
    aperture: 'Very Open',
    notableTypefaces: ['Futura', 'Avant Garde', 'Century Gothic', 'Plus Jakarta Sans', 'Outfit'],
    idealUse: 'Modern tech startups, architectural branding, posters, clean minimalist UI interfaces.',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800',
  },
  {
    id: 'humanist-sans',
    name: 'Humanist Sans',
    category: 'sans',
    era: '1920s – Present',
    keyFeatures: 'Sans-serif based on classical Renaissance proportion and calligraphic stroke modulation. Open apertures, double-story g and a, slanted terminals.',
    contrast: 'Low',
    axisOfStress: 'Diagonal / Calligraphic',
    aperture: 'Very Open',
    notableTypefaces: ['Gill Sans', 'Frutiger', 'Optima', 'Open Sans', 'Lato'],
    idealUse: 'Public signage, medical guides, high-legibility digital body text, and small screen captions.',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
  },
  {
    id: 'monospaced',
    name: 'Monospaced / Fixed-Pitch',
    category: 'mono',
    era: '1880s (Typewriters) – Modern Computing',
    keyFeatures: 'Every single character occupies the exact same horizontal width. Wide serifs on narrow letters (like i and l) and compressed wide letters (like m and w).',
    contrast: 'Low',
    axisOfStress: 'Strictly Vertical',
    aperture: 'Very Open',
    notableTypefaces: ['JetBrains Mono', 'Courier', 'Source Code Pro', 'IBM Plex Mono'],
    idealUse: 'Source code editors, financial tabular matrices, technical documentation, architectural specs, and brutalist web design.',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
  },
];

// --------------------------------------------------------------------------
// 3. Curated Typographic Pairings
// --------------------------------------------------------------------------
const CURATED_PAIRINGS: TypographicPairing[] = [
  {
    id: 'editorial-couture',
    name: 'Editorial Couture',
    tag: 'Classic Magazine',
    description: 'High-contrast Didone display serif paired with a geometric, high-clarity sans for a luxury editorial publication feel.',
    mood: 'Regal, authoritative, refined, sophisticated',
    contrastScore: 5,
    headingFont: 'Playfair Display',
    headingFamilyCss: "'Playfair Display', serif",
    headingCategory: 'Modern Didone Serif',
    bodyFont: 'Plus Jakarta Sans',
    bodyFamilyCss: "'Plus Jakarta Sans', sans-serif",
    bodyCategory: 'Geometric Sans',
    accentFont: 'JetBrains Mono',
    accentFamilyCss: "'JetBrains Mono', monospace",
    bestFor: 'Fashion magazines, architectural reviews, art galleries, luxury lifestyle blogs',
    rationale: 'The extreme stroke contrast and sculptural elegance of Playfair Display command attention in headings, while the uniform neutral geometry of Plus Jakarta Sans guarantees crystalline body readability.',
  },
  {
    id: 'literary-chronicle',
    name: 'The Literary Chronicle',
    tag: 'Publishing & Essays',
    description: 'Renaissance Old Style serif paired with a clean, unobtrusive sans-serif for deep, immersive reading.',
    mood: 'Intellectual, warm, historic, trustworthy',
    contrastScore: 4,
    headingFont: 'EB Garamond',
    headingFamilyCss: "'EB Garamond', serif",
    headingCategory: 'Old Style Humanist Serif',
    bodyFont: 'Plus Jakarta Sans',
    bodyFamilyCss: "'Plus Jakarta Sans', sans-serif",
    bodyCategory: 'Humanist / Geometric Sans',
    accentFont: 'Instrument Serif',
    accentFamilyCss: "'Instrument Serif', serif",
    bestFor: 'Book publishing, academic journals, philosophical long-form essays, literary criticism',
    rationale: 'EB Garamond’s humanistic calligraphic axis and organic warmth invite the reader in without visual fatigue. The subtle sans subhead provides a crisp counterpoint.',
  },
  {
    id: 'brutalist-tech',
    name: 'Brutalist Technologist',
    tag: 'Engineering & Web3',
    description: 'Bold expressive grotesque sans paired with a razor-sharp monospace for developer platforms and architectural studios.',
    mood: 'Futuristic, precise, utilitarian, avant-garde',
    contrastScore: 4,
    headingFont: 'Space Grotesk',
    headingFamilyCss: "'Space Grotesk', sans-serif",
    headingCategory: 'Expressive Grotesque Sans',
    bodyFont: 'Plus Jakarta Sans',
    bodyFamilyCss: "'Plus Jakarta Sans', sans-serif",
    bodyCategory: 'Geometric Sans',
    accentFont: 'JetBrains Mono',
    accentFamilyCss: "'JetBrains Mono', monospace",
    bestFor: 'Developer tools, SaaS dashboards, tech manifestos, architectural portfolios',
    rationale: 'Space Grotesk’s idiosyncratic geometric quirks establish immediate brand punch, while JetBrains Mono provides structural legitimacy for data readouts and metadata.',
  },
  {
    id: 'roman-monumental',
    name: 'Roman Monumental',
    tag: 'Classical Heritage',
    description: 'Imperial inscriptional Roman serif headers paired with classical serif body text for institutions, universities, and museums.',
    mood: 'Timeless, monumental, solemn, prestigious',
    contrastScore: 3,
    headingFont: 'Cinzel',
    headingFamilyCss: "'Cinzel', serif",
    headingCategory: 'Roman Inscriptional Serif',
    bodyFont: 'EB Garamond',
    bodyFamilyCss: "'EB Garamond', serif",
    bodyCategory: 'Old Style Serif',
    accentFont: 'Plus Jakarta Sans',
    accentFamilyCss: "'Plus Jakarta Sans', sans-serif",
    bestFor: 'Museum exhibits, law firms, historical institutions, fine wine estates, high-end heritage branding',
    rationale: 'Cinzel is modeled after 1st-century Roman Trajan inscriptions. Pairing it with Garamond maintains pure classical lineage without jarring modern intrusions.',
  },
  {
    id: 'modernist-minimal',
    name: 'Modernist Minimal',
    tag: 'Contemporary Studio',
    description: 'Clean typographic rhythm relying on scale, tracking, and weight contrast within clean sans and expressive serif accents.',
    mood: 'Airy, deliberate, contemporary, Scandinavian',
    contrastScore: 3,
    headingFont: 'Space Grotesk',
    headingFamilyCss: "'Space Grotesk', sans-serif",
    headingCategory: 'Neo-Grotesque Sans',
    bodyFont: 'Plus Jakarta Sans',
    bodyFamilyCss: "'Plus Jakarta Sans', sans-serif",
    bodyCategory: 'Geometric Sans',
    accentFont: 'Instrument Serif',
    accentFamilyCss: "'Instrument Serif', serif",
    bestFor: 'Design studio portfolios, interior design magazines, boutique agency websites',
    rationale: 'Demonstrates the Golden Rule: If pairing similar sans families, enforce high contrast in weight, scale, and tracking to avoid visual mud.',
  },
];

export const FontAnatomyAndPairing: React.FC<FontAnatomyAndPairingProps> = ({ config }) => {
  // Active sub-view within this tab
  const [subView, setSubView] = useState<'anatomy' | 'classifications' | 'pairing'>('anatomy');

  // Anatomy viewer states
  const [selectedTermId, setSelectedTermId] = useState<string>('cap-height');
  const [specimenSample, setSpecimenSample] = useState<'Hg' | 'Qy' | 'Rk' | 'fi' | 'ag'>('Hg');
  const [specimenFontType, setSpecimenFontType] = useState<'serif' | 'sans' | 'display'>('serif');
  const [showMetricLines, setShowMetricLines] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Pairing Studio states
  const [activePairingId, setActivePairingId] = useState<string>('editorial-couture');
  const [customHeadingSizePt, setCustomHeadingSizePt] = useState<number>(36);
  const [customBodySizePt, setCustomBodySizePt] = useState<number>(11);
  const [customLineHeightRatio, setCustomLineHeightRatio] = useState<number>(1.6);
  const [customTracking, setCustomTracking] = useState<number>(-0.02); // in em
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark' | 'paper'>('light');

  // Active Anatomy Term
  const activeTerm = useMemo(() => {
    return ANATOMY_DATA.find((t) => t.id === selectedTermId) || ANATOMY_DATA[0];
  }, [selectedTermId]);

  // Active Pairing
  const activePairing = useMemo(() => {
    return CURATED_PAIRINGS.find((p) => p.id === activePairingId) || CURATED_PAIRINGS[0];
  }, [activePairingId]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div id="font-anatomy-container" className="space-y-8">
      {/* Top Banner & Sub-View Switcher */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-stone-900 text-stone-100 font-mono">
                Typographic Sciences
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Anatomy of Letters, Historical Classifications & Typeface Pairing Studio
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight mt-2 font-sans">
              Font Anatomy & Typeface Pairing Studio
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl mt-1 leading-relaxed">
              Explore the structural anatomy of letterforms from ascenders to ball terminals, master the historical classifications of serif and sans-serif type, and test curated font pairings with real-time editorial layout previews.
            </p>
          </div>

          {/* Sub-tab navigation pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200 self-start lg:self-center">
            <button
              id="subtab-anatomy"
              onClick={() => setSubView('anatomy')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                subView === 'anatomy'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Anatomy of Letters</span>
            </button>

            <button
              id="subtab-classifications"
              onClick={() => setSubView('classifications')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                subView === 'classifications'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>2. Type Classifications</span>
            </button>

            <button
              id="subtab-pairing"
              onClick={() => setSubView('pairing')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                subView === 'pairing'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>3. Type Pairing Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 1: INTERACTIVE ANATOMY OF LETTERS                           */}
      {/* ==================================================================== */}
      {subView === 'anatomy' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
                Glyph Specimen:
              </span>
              <div className="flex gap-1 bg-stone-100 p-1 rounded-lg">
                {[
                  { id: 'Hg', label: 'Hg (Cap & Descender)' },
                  { id: 'Qy', label: 'Qy (Tail & Descender)' },
                  { id: 'Rk', label: 'Rk (Leg & Arm)' },
                  { id: 'fi', label: 'fi (Ligature & Tittle)' },
                  { id: 'ag', label: 'ag (Double-Story Bowl)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSpecimenSample(s.id as any)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer transition-all ${
                      specimenSample === s.id
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Typeface Style */}
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg">
                <span className="text-[11px] text-stone-500 font-semibold px-1">Style:</span>
                <button
                  onClick={() => setSpecimenFontType('serif')}
                  className={`px-2.5 py-1 text-xs font-serif rounded cursor-pointer transition-all ${
                    specimenFontType === 'serif' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  Serif (EB Garamond)
                </button>
                <button
                  onClick={() => setSpecimenFontType('sans')}
                  className={`px-2.5 py-1 text-xs font-sans rounded cursor-pointer transition-all ${
                    specimenFontType === 'sans' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  Sans (Plus Jakarta)
                </button>
                <button
                  onClick={() => setSpecimenFontType('display')}
                  className={`px-2.5 py-1 text-xs font-serif rounded cursor-pointer transition-all ${
                    specimenFontType === 'display' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  Modern (Playfair)
                </button>
              </div>

              {/* Metric Lines Toggle */}
              <button
                onClick={() => setShowMetricLines(!showMetricLines)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                  showMetricLines
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showMetricLines ? 'Hide Metrics' : 'Show Metrics'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Specimen Stage & Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Large High-Resolution Specimen Stage (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col justify-between relative overflow-hidden min-h-[440px]">
              
              {/* Background Graph Grid */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `linear-gradient(to right, #78716c 1px, transparent 1px), linear-gradient(to bottom, #78716c 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Top Bar Callout Title */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                    Interactive Anatomical Specimen Stage
                  </span>
                </div>

                <div className="text-xs text-stone-400 font-mono">
                  {specimenFontType === 'serif' ? 'EB Garamond' : specimenFontType === 'sans' ? 'Plus Jakarta Sans' : 'Playfair Display'} • 240pt
                </div>
              </div>

              {/* Center Giant Glyph Stage with Typographic Metric Guide Lines */}
              <div className="relative z-10 my-8 py-8 flex items-center justify-center">
                
                {/* Visual Metric Lines Overlay */}
                {showMetricLines && (
                  <div className="absolute inset-x-0 inset-y-0 pointer-events-none flex flex-col justify-between">
                    {/* Ascender Line */}
                    <div className="absolute top-[16%] inset-x-0 border-b border-dashed border-indigo-400/80 flex items-center justify-between px-2 text-[10px] font-mono text-indigo-600 bg-indigo-50/20">
                      <span>ASCENDER LINE</span>
                      <span>+1000 Units</span>
                    </div>

                    {/* Cap Height Line */}
                    <div className="absolute top-[26%] inset-x-0 border-b border-dashed border-blue-500 flex items-center justify-between px-2 text-[10px] font-mono text-blue-700 bg-blue-50/20 font-bold">
                      <span>CAP HEIGHT (700 Units)</span>
                      <span>Top of flat capitals (H, E)</span>
                    </div>

                    {/* Mean Line / X-Height */}
                    <div className="absolute top-[44%] inset-x-0 border-b border-dashed border-emerald-500 flex items-center justify-between px-2 text-[10px] font-mono text-emerald-700 bg-emerald-50/20 font-bold">
                      <span>MEAN LINE / X-HEIGHT (480 Units)</span>
                      <span>Top of lowercase x</span>
                    </div>

                    {/* Baseline */}
                    <div className="absolute top-[72%] inset-x-0 border-b-2 border-rose-600 flex items-center justify-between px-2 text-[10px] font-mono text-rose-700 bg-rose-50/20 font-extrabold">
                      <span>BASELINE (0 Units)</span>
                      <span>Foundation line of all typography</span>
                    </div>

                    {/* Descender Line */}
                    <div className="absolute top-[92%] inset-x-0 border-b border-dashed border-amber-500 flex items-center justify-between px-2 text-[10px] font-mono text-amber-700 bg-amber-50/20">
                      <span>DESCENDER LINE (-280 Units)</span>
                      <span>Bottom of descending strokes (g, p, y)</span>
                    </div>
                  </div>
                )}

                {/* The Rendered Glyph Specimen */}
                <div
                  className={`select-none tracking-normal leading-none text-stone-900 transition-all ${
                    specimenFontType === 'serif'
                      ? 'font-serif'
                      : specimenFontType === 'sans'
                      ? 'font-sans'
                      : 'font-serif font-black'
                  }`}
                  style={{
                    fontSize: '180px',
                    fontFamily:
                      specimenFontType === 'serif'
                        ? "'EB Garamond', serif"
                        : specimenFontType === 'sans'
                        ? "'Plus Jakarta Sans', sans-serif"
                        : "'Playfair Display', serif",
                  }}
                >
                  {specimenSample}
                </div>
              </div>

              {/* Bottom Quick Pin Badges */}
              <div className="relative z-10 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-stone-400 uppercase font-mono mr-1">
                  Parts on Display:
                </span>
                {ANATOMY_DATA.map((term) => {
                  const isSelected = term.id === selectedTermId;
                  return (
                    <button
                      key={term.id}
                      onClick={() => setSelectedTermId(term.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-white border-stone-900 shadow-2xs scale-105'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                      }`}
                    >
                      {term.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Detailed Anatomy Definition & Historical Card (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider font-mono border ${activeTerm.badgeColor}`}>
                    {activeTerm.category.replace('-', ' ')}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    Term #{ANATOMY_DATA.findIndex((t) => t.id === activeTerm.id) + 1} of {ANATOMY_DATA.length}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-stone-900 tracking-tight mt-3 font-sans">
                  {activeTerm.name}
                </h3>

                {/* Definition */}
                <div className="mt-3 bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono block">
                    Core Definition
                  </span>
                  <p className="text-xs text-stone-800 leading-relaxed font-medium">
                    {activeTerm.definition}
                  </p>
                </div>

                {/* Optical Role */}
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 font-mono block">
                    Optical & Design Significance
                  </span>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {activeTerm.opticalRole}
                  </p>
                </div>

                {/* Historical Origin */}
                <div className="mt-3 pt-3 border-t border-stone-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 font-mono block">
                    Historical Origin
                  </span>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {activeTerm.historicalOrigin}
                  </p>
                </div>
              </div>

              {/* Example Letters Pill List */}
              <div className="pt-4 border-t border-stone-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono block mb-1.5">
                  Prominent In Characters:
                </span>
                <div className="flex items-center gap-1.5">
                  {activeTerm.exampleLetters.map((char) => (
                    <span
                      key={char}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-100 border border-stone-200 font-mono font-bold text-xs text-stone-800"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SECTION 2: TYPEFACE CLASSIFICATIONS TAXONOMY                        */}
      {/* ==================================================================== */}
      {subView === 'classifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <h3 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2 font-sans">
              <BookOpen className="w-5 h-5 text-amber-600" />
              The Eight Core Typeface Classifications
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
              From Renaissance punchcutting in Venice to 1950s Swiss International Modernism, every typeface belongs to an evolutionary branch defined by its stroke modulation, stress axis, serifs, and aperture.
            </p>
          </div>

          {/* Grid of Classifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLASSIFICATIONS_DATA.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-stone-400 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono tracking-wider ${cls.badgeBg} ${cls.badgeText}`}>
                      {cls.category}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">{cls.era.split(' ')[0]}</span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-base mt-2">{cls.name}</h4>
                  <p className="text-[11px] text-stone-500 font-mono mt-0.5">{cls.era}</p>

                  <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                    {cls.keyFeatures}
                  </p>

                  {/* Metrics Table */}
                  <div className="mt-3 bg-stone-50 rounded-xl p-2.5 border border-stone-200 text-[11px] space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Contrast:</span>
                      <span className="font-semibold text-stone-800">{cls.contrast}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Stress Axis:</span>
                      <span className="font-semibold text-stone-800">{cls.axisOfStress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Aperture:</span>
                      <span className="font-semibold text-stone-800">{cls.aperture}</span>
                    </div>
                  </div>
                </div>

                {/* Notable Typefaces */}
                <div className="pt-3 border-t border-stone-100 text-xs">
                  <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider block mb-1">
                    Canonical Typefaces:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cls.notableTypefaces.map((name) => (
                      <span
                        key={name}
                        className="px-1.5 py-0.5 bg-stone-100 rounded text-[11px] text-stone-700 font-medium"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Golden Rules of Typography Callout */}
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h4 className="text-base font-bold font-sans tracking-tight text-white">
                The 5 Golden Laws of Typeface Selection & Harmony
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              <div className="bg-stone-800/80 rounded-xl p-3.5 border border-stone-700/80 space-y-1">
                <span className="font-mono text-amber-400 font-bold block text-[11px]">01. CONTRAST, NOT CONFLICT</span>
                <p className="text-stone-300 leading-relaxed text-[11px]">
                  Never pair two very similar neo-grotesque sans (e.g. Helvetica and Arial). It looks like a rendering mistake. Pair opposing categories (Serif + Sans).
                </p>
              </div>

              <div className="bg-stone-800/80 rounded-xl p-3.5 border border-stone-700/80 space-y-1">
                <span className="font-mono text-amber-400 font-bold block text-[11px]">02. SUPERFAMILY HARMONY</span>
                <p className="text-stone-300 leading-relaxed text-[11px]">
                  When in doubt, use a superfamily that contains both serif and sans variants (e.g. Merriweather & Merriweather Sans, Roboto & Roboto Slab).
                </p>
              </div>

              <div className="bg-stone-800/80 rounded-xl p-3.5 border border-stone-700/80 space-y-1">
                <span className="font-mono text-amber-400 font-bold block text-[11px]">03. ALIGN X-HEIGHTS</span>
                <p className="text-stone-300 leading-relaxed text-[11px]">
                  If pairing distinct families across body and captions, ensure their optical x-heights match so the reader’s eye doesn’t stumble across lines.
                </p>
              </div>

              <div className="bg-stone-800/80 rounded-xl p-3.5 border border-stone-700/80 space-y-1">
                <span className="font-mono text-amber-400 font-bold block text-[11px]">04. ASSIGN RIGID ROLES</span>
                <p className="text-stone-300 leading-relaxed text-[11px]">
                  Give each typeface a distinct non-overlapping duty: Font A = Display Titles only; Font B = Body reading; Font C = Metadata & code.
                </p>
              </div>

              <div className="bg-stone-800/80 rounded-xl p-3.5 border border-stone-700/80 space-y-1">
                <span className="font-mono text-amber-400 font-bold block text-[11px]">05. THE RULE OF THREE</span>
                <p className="text-stone-300 leading-relaxed text-[11px]">
                  Strictly limit your document or web app to a maximum of 2 to 3 typefaces. Varied weights and italics inside one family supply plenty of contrast.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SECTION 3: INTERACTIVE TYPEFACE PAIRING STUDIO                      */}
      {/* ==================================================================== */}
      {subView === 'pairing' && (
        <div className="space-y-6">
          {/* Preset Pairings Selector */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 tracking-tight font-sans">
                  Curated Typographic Pairings & Recipe Engine
                </h3>
                <p className="text-xs text-stone-500">
                  Select a battle-tested pairing recipe or tweak the typographic controls below.
                </p>
              </div>

              {/* Theme toggle for article sandbox */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
                <span className="text-[11px] text-stone-500 font-mono px-1">Canvas Theme:</span>
                <button
                  onClick={() => setPreviewTheme('light')}
                  className={`px-2 py-1 text-xs rounded cursor-pointer transition-all ${
                    previewTheme === 'light' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  Light Clean
                </button>
                <button
                  onClick={() => setPreviewTheme('paper')}
                  className={`px-2 py-1 text-xs rounded cursor-pointer transition-all ${
                    previewTheme === 'paper' ? 'bg-amber-100 text-amber-950 font-bold shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  Warm Paper
                </button>
                <button
                  onClick={() => setPreviewTheme('dark')}
                  className={`px-2 py-1 text-xs rounded cursor-pointer transition-all ${
                    previewTheme === 'dark' ? 'bg-stone-900 text-white font-bold shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  Dark Room
                </button>
              </div>
            </div>

            {/* Curated Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {CURATED_PAIRINGS.map((p) => {
                const isSelected = p.id === activePairingId;
                return (
                  <button
                    key={p.id}
                    id={`btn-pairing-${p.id}`}
                    onClick={() => setActivePairingId(p.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-stone-900'
                        : 'bg-stone-50 text-stone-900 border-stone-200 hover:border-stone-300 hover:bg-white'
                    }`}
                  >
                    <div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-stone-800 text-amber-300' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {p.tag}
                      </span>
                      <div className="font-bold text-xs mt-2">{p.name}</div>
                      <div className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                        {p.headingFont} + {p.bodyFont}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-200/40 flex items-center justify-between text-[10px]">
                      <span className={isSelected ? 'text-stone-400' : 'text-stone-500'}>Contrast:</span>
                      <span className="font-bold text-amber-500">{'★'.repeat(p.contrastScore)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Editorial Stage & Control Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Real-time Live Editorial Layout Article (8 cols) */}
            <div
              className={`lg:col-span-8 rounded-2xl p-8 sm:p-10 border shadow-xs transition-colors space-y-6 ${
                previewTheme === 'light'
                  ? 'bg-white text-stone-900 border-stone-200'
                  : previewTheme === 'paper'
                  ? 'bg-stone-100 text-stone-900 border-amber-200/80 shadow-stone-200'
                  : 'bg-stone-950 text-stone-100 border-stone-800 shadow-xl'
              }`}
            >
              {/* Category Kicker & Date */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-stone-200/60">
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[11px] font-bold uppercase tracking-widest text-amber-600"
                    style={{ fontFamily: activePairing.accentFamilyCss }}
                  >
                    VOL. 42 // ESSAYS IN TYPOGRAPHY
                  </span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-500 font-mono text-[10px]">
                    PAIRING: {activePairing.headingFont} & {activePairing.bodyFont}
                  </span>
                </div>

                <div
                  className="font-mono text-[10px] text-stone-400"
                  style={{ fontFamily: activePairing.accentFamilyCss }}
                >
                  READING TIME: 4 MIN
                </div>
              </div>

              {/* Main Headline */}
              <h1
                id="preview-article-headline"
                className="font-bold tracking-tight leading-tight"
                style={{
                  fontFamily: activePairing.headingFamilyCss,
                  fontSize: `${customHeadingSizePt}pt`,
                  letterSpacing: `${customTracking}em`,
                }}
              >
                The Architecture of Rhythm & Optical Equilibrium in Modern Editorial Design
              </h1>

              {/* Author Byline */}
              <div className="flex items-center gap-3 py-1">
                <div className="w-8 h-8 rounded-full bg-stone-800 text-stone-100 flex items-center justify-center font-mono font-bold text-xs">
                  TG
                </div>
                <div>
                  <div
                    className="text-xs font-bold"
                    style={{ fontFamily: activePairing.bodyFamilyCss }}
                  >
                    Dr. Adrian Frutiger & Jan Tschichold
                  </div>
                  <div
                    className="text-[10px] text-stone-500 font-mono"
                    style={{ fontFamily: activePairing.accentFamilyCss }}
                  >
                    Typographic Directors, Institute of Contemporary Letterforms
                  </div>
                </div>
              </div>

              {/* Lead Paragraph with Drop Cap */}
              <p
                className="text-justify leading-relaxed"
                style={{
                  fontFamily: activePairing.bodyFamilyCss,
                  fontSize: `${customBodySizePt * 1.15}pt`,
                  lineHeight: customLineHeightRatio,
                }}
              >
                <span
                  className="float-left text-4xl sm:text-5xl font-bold pr-3 pt-1 leading-none text-amber-700"
                  style={{ fontFamily: activePairing.headingFamilyCss }}
                >
                  T
                </span>
                ypography exists at the sacred intersection of pure mathematical geometry and human optical perception. Letters are not static brick-like symbols assembled on a page; they are fluid negative-space conductors that guide the unconscious human eye across a rhythmic landscape of cadence, pauses, and emphasis.
              </p>

              {/* Pull Quote Callout */}
              <blockquote
                className="my-6 pl-4 border-l-4 border-amber-500 italic text-stone-800"
                style={{
                  fontFamily: activePairing.headingFamilyCss,
                  fontSize: `${customBodySizePt * 1.4}pt`,
                  lineHeight: 1.35,
                }}
              >
                “A masterfully paired typeface does not demand admiration for itself; it renders the thought of the writer luminous, effortless, and indelible.”
              </blockquote>

              {/* Secondary Body Paragraph */}
              <p
                className="leading-relaxed text-justify"
                style={{
                  fontFamily: activePairing.bodyFamilyCss,
                  fontSize: `${customBodySizePt}pt`,
                  lineHeight: customLineHeightRatio,
                }}
              >
                When pairing a high-contrast serif with a neutral geometric sans, each font assumes a complementary responsibility. The title commands majesty and historical authority, while the body text retreats into invisible clarity, granting the reader hours of effortless comprehension without eye strain.
              </p>

              {/* Metadata Caption Tag */}
              <div
                className="pt-4 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-mono text-stone-500"
                style={{ fontFamily: activePairing.accentFamilyCss }}
              >
                <span>FIG 2.4 — SPECIFICATION METRICS</span>
                <span>ROOT: {config.baseFontSizePx}PX • SCALE: 1.333 PERFECT FOURTH</span>
              </div>
            </div>

            {/* Right: Fine-Tuning Controls & Code Export (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Typeface Specs & Rationale Card */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono">
                    Pairing Diagnostics
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-emerald-100 text-emerald-800">
                    Contrast: {activePairing.contrastScore}/5
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-400 font-mono block">Primary Display / Headline:</span>
                    <span className="font-bold text-stone-900">{activePairing.headingFont}</span>
                    <span className="text-stone-500 text-[11px] block">{activePairing.headingCategory}</span>
                  </div>

                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-400 font-mono block">Secondary Body / Content:</span>
                    <span className="font-bold text-stone-900">{activePairing.bodyFont}</span>
                    <span className="text-stone-500 text-[11px] block">{activePairing.bodyCategory}</span>
                  </div>

                  {activePairing.accentFont && (
                    <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-400 font-mono block">Accent / Captions & Metadata:</span>
                      <span className="font-bold text-stone-900">{activePairing.accentFont}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-mono block mb-1">
                    Design Rationale:
                  </span>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {activePairing.rationale}
                  </p>
                </div>
              </div>

              {/* Typographic Sliders */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono block">
                  Fine-Tune Hierarchy & Rhythm
                </span>

                {/* Heading Size */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-600">Heading Size:</span>
                    <span className="font-mono font-bold text-stone-900">{customHeadingSizePt} pt</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="64"
                    value={customHeadingSizePt}
                    onChange={(e) => setCustomHeadingSizePt(Number(e.target.value))}
                    className="w-full accent-stone-900"
                  />
                </div>

                {/* Body Size */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-600">Body Size:</span>
                    <span className="font-mono font-bold text-stone-900">{customBodySizePt} pt</span>
                  </div>
                  <input
                    type="range"
                    min="9"
                    max="18"
                    step="0.5"
                    value={customBodySizePt}
                    onChange={(e) => setCustomBodySizePt(Number(e.target.value))}
                    className="w-full accent-stone-900"
                  />
                </div>

                {/* Line Height Leading */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-600">Body Leading Ratio:</span>
                    <span className="font-mono font-bold text-stone-900">{customLineHeightRatio}</span>
                  </div>
                  <input
                    type="range"
                    min="1.2"
                    max="2.0"
                    step="0.05"
                    value={customLineHeightRatio}
                    onChange={(e) => setCustomLineHeightRatio(Number(e.target.value))}
                    className="w-full accent-stone-900"
                  />
                </div>

                {/* Heading Tracking */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-600">Heading Tracking:</span>
                    <span className="font-mono font-bold text-stone-900">{customTracking} em</span>
                  </div>
                  <input
                    type="range"
                    min="-0.05"
                    max="0.10"
                    step="0.01"
                    value={customTracking}
                    onChange={(e) => setCustomTracking(Number(e.target.value))}
                    className="w-full accent-stone-900"
                  />
                </div>
              </div>

              {/* Code / Style Tokens Export Card */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono">
                    CSS / DTP Typography Tokens
                  </span>
                  <button
                    onClick={() => {
                      const snippet = `/* TypoGraph Pairing Specification: ${activePairing.name} */
:root {
  --font-heading: ${activePairing.headingFamilyCss};
  --font-body: ${activePairing.bodyFamilyCss};
  --font-accent: ${activePairing.accentFamilyCss || 'sans-serif'};
  --heading-size: ${customHeadingSizePt}pt;
  --body-size: ${customBodySizePt}pt;
  --body-leading: ${customLineHeightRatio};
  --heading-tracking: ${customTracking}em;
}

h1, h2, h3 {
  font-family: var(--font-heading);
  letter-spacing: var(--heading-tracking);
}

body, p {
  font-family: var(--font-body);
  font-size: var(--body-size);
  line-height: var(--body-leading);
}`;
                      handleCopy(snippet, 'css-pairing');
                    }}
                    className="flex items-center gap-1 text-[11px] text-stone-700 hover:text-stone-900 font-semibold cursor-pointer"
                  >
                    {copiedCode === 'css-pairing' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy CSS
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-stone-900 text-stone-200 font-mono text-[11px] p-3 rounded-xl overflow-x-auto leading-relaxed">
                  <div>--font-heading: {activePairing.headingFamilyCss};</div>
                  <div>--font-body: {activePairing.bodyFamilyCss};</div>
                  <div>--heading-size: {customHeadingSizePt}pt;</div>
                  <div>--body-size: {customBodySizePt}pt;</div>
                  <div>--body-leading: {customLineHeightRatio};</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
