/**
 * Heritage knowledge base powering the Design Studio's "Heritage Inspiration"
 * panel. Keyed by pattern name so selecting a pattern instantly surfaces its
 * history, authentic colours, recommended materials, motifs and a link into
 * the Textile Encyclopedia. This ties the AI generator, material
 * recommendations and encyclopedia together — the app's signature feature.
 */
export const HERITAGE = {
  Bandhani: {
    slug: 'bandhani',
    tagline: 'Tie-and-dye artistry of Gujarat & Rajasthan',
    image: '/images/bandhani.png',
    history:
      'Bandhani (from Sanskrit "bandh", to tie) is a resist tie-dye craft dating back over 5,000 years, flourishing among the Khatri community of Gujarat and Rajasthan. Thousands of tiny knots are hand-tied before dyeing to form dotted motifs.',
    colors: [
      { name: 'Crimson Red', hex: '#b91c1c' },
      { name: 'Marigold', hex: '#f59e0b' },
      { name: 'Indigo', hex: '#1e3a8a' },
      { name: 'Ivory', hex: '#f8f5f2' },
    ],
    materials: ['Silk', 'Cotton', 'Georgette'],
    motifs: ['Chandrakala', 'Bavan Baug', 'Ekdali', 'Shikari'],
  },
  Ikat: {
    slug: 'ikat',
    tagline: 'Resist-dyed yarns of Telangana & Odisha',
    image: '/images/ikat.png',
    history:
      'Ikat is a dyeing technique where yarns are resist-dyed before weaving, creating the craft\'s signature feathered edges. India\'s Pochampally (Telangana) and Sambalpuri (Odisha) traditions are renowned worldwide.',
    colors: [
      { name: 'Deep Maroon', hex: '#7f1d1d' },
      { name: 'Ochre', hex: '#d97706' },
      { name: 'Teal', hex: '#0f766e' },
      { name: 'Black', hex: '#111827' },
    ],
    materials: ['Silk', 'Cotton'],
    motifs: ['Ikkat diamond', 'Bandha fish', 'Temple border', 'Conch'],
  },
  Patola: {
    slug: 'patola',
    tagline: 'Double-ikat silk royalty of Patan',
    image: '/images/patola.png',
    history:
      'Patola from Patan, Gujarat is a double-ikat silk woven by only a handful of families. Both warp and weft are resist-dyed with such precision that the pattern is identical on both faces — a single sari can take months to weave.',
    colors: [
      { name: 'Royal Red', hex: '#9d174d' },
      { name: 'Emerald', hex: '#10b981' },
      { name: 'Gold', hex: '#d4af37' },
      { name: 'Cream', hex: '#faf3e0' },
    ],
    materials: ['Silk'],
    motifs: ['Narikunj (parrot)', 'Elephant', 'Flower basket', 'Geometric grid'],
  },
};

export const PATTERNS = Object.keys(HERITAGE);
