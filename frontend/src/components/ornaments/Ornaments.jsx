/**
 * Ornaments — reusable folk-art motifs that give Vastra AI its "desi royal"
 * identity: block-print (ठप्पा) dividers, bilingual eyebrows, temple-arch
 * frames, paisley (buta) marks and faint mandalas. All are inline SVG/CSS so
 * they stay crisp, themeable and offline-friendly.
 */

/* Bilingual eyebrow: a Devanagari word beside its Latin label. */
export function Eyebrow({ deva, children, className = '' }) {
  return (
    <span className={`v-eyebrow ${className}`}>
      {deva && <span className="deva">{deva}</span>}
      {children}
    </span>
  );
}

/* A single block-print stamp: lotus bud flanked by leaves and dots.
   Tiled horizontally by BlockPrintDivider. */
function stampSvg(color, bg = 'none') {
  const s = `
  <svg xmlns='http://www.w3.org/2000/svg' width='60' height='26' viewBox='0 0 60 26'>
    <rect width='60' height='26' fill='${bg}'/>
    <g fill='none' stroke='${color}' stroke-width='1.4' stroke-linecap='round'>
      <path d='M30 4 C34 9 34 15 30 21 C26 15 26 9 30 4 Z'/>
      <path d='M30 21 L30 24'/>
      <path d='M18 13 C22 10 25 12 26 15 C22 16 19 16 18 13 Z'/>
      <path d='M42 13 C38 10 35 12 34 15 C38 16 41 16 42 13 Z'/>
      <circle cx='9' cy='13' r='2'/>
      <circle cx='51' cy='13' r='2'/>
    </g>
    <g fill='${color}'>
      <circle cx='30' cy='12' r='1.3'/>
    </g>
  </svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
}

/* A stamped floral rule used to separate sections. `tone` picks the ink. */
export function BlockPrintDivider({ tone = 'gold', className = '', style }) {
  const color = {
    gold: '#a97c2f', indigo: '#1b2a6b', rani: '#a6234c', terracotta: '#c1502e',
    cream: '#e6d5b6',
  }[tone] || '#a97c2f';
  return (
    <div
      className={`v-blockprint ${className}`}
      style={{ backgroundImage: stampSvg(color), ...style }}
      role="presentation"
      aria-hidden="true"
    />
  );
}

/* Temple-arch (jharokha) framed art. Wrap any content; it clips to the
   pointed-arch silhouette with a gold border — the brand's signature frame. */
export function ArchArt({ children, className = '', style, outline = false }) {
  return (
    <div className={`${outline ? 'v-arch-outline' : 'v-arch'} ${className}`} style={style}>
      {children}
    </div>
  );
}

/* A paisley (buta) mark for small accents. */
export function Paisley({ size = 22, color = 'currentColor', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M14 2c5 2 7 7 4 12-2 4-7 5-10 3 3 1 6-1 7-4 1-4-1-7-4-8-3-1-6 1-6 4 0 2 1 3 3 4-4-1-6-5-4-9 2-3 6-4 10-2Z"
        fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round"
      />
      <circle cx="9.5" cy="10.5" r="1.3" fill={color} />
    </svg>
  );
}

/* A faint concentric mandala for backgrounds / corners. */
export function Mandala({ size = 260, color = '#a97c2f', opacity = 0.12, className = '', style }) {
  const petals = Array.from({ length: 16 }, (_, i) => {
    const a = (i * 360) / 16;
    return (
      <path key={i} transform={`rotate(${a} 60 60)`}
        d="M60 10 C67 26 67 34 60 46 C53 34 53 26 60 10 Z"
        fill="none" stroke={color} strokeWidth="1" />
    );
  });
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className}
      style={{ opacity, ...style }} aria-hidden="true">
      <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="1" />
      <circle cx="60" cy="60" r="40" fill="none" stroke={color} strokeWidth="1" />
      <circle cx="60" cy="60" r="8" fill="none" stroke={color} strokeWidth="1" />
      {petals}
    </svg>
  );
}
