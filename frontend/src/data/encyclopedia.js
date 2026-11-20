/**
 * Textile Encyclopedia articles. Keyed by slug; the Encyclopedia list and
 * article pages read from here. Shares slugs with heritage.js so the studio
 * can deep-link "Read more" into the matching article.
 */
export const ENCYCLOPEDIA = [
  {
    slug: 'bandhani',
    name: 'Bandhani',
    region: 'Gujarat · Rajasthan',
    origin: 'Kutch & Jamnagar, Gujarat',
    accent: '#b91c1c',
    image: '/images/bandhani.webp',
    summary:
      'An ancient tie-and-dye craft where thousands of hand-tied knots resist the dye to form dotted patterns.',
    technique:
      'Fabric is pinched and tied into thousands of tiny knots with thread, then dyed in stages from light to dark. Untying reveals crisp undyed dots. Master artisans tie by feel, using a pointed fingernail guard.',
    materials: ['Silk', 'Cotton', 'Georgette'],
    colors: ['Crimson', 'Marigold', 'Indigo', 'Ivory'],
    timeline: [{ year: 'Project note', event: 'Historical dates from the original prototype have been omitted pending source review. See the linked reading for a wider introduction.' }],
    references: [
      'Handbook of Indian Textiles — Rustam J. Mehta',
      'Textiles and Weaves of India — Ministry of Textiles',
    ],
    related: ['ikat', 'patola'],
  },
  {
    slug: 'ikat',
    name: 'Ikat',
    region: 'Telangana · Odisha · Gujarat',
    origin: 'Pochampally & Sambalpur',
    accent: '#0f766e',
    image: '/images/ikat.webp',
    summary:
      'A resist-dyeing technique applied to yarns before weaving, giving patterns their soft feathered edges.',
    technique:
      'Warp and/or weft yarns are bound and dyed before being mounted on the loom. Aligning the dyed yarns during weaving demands extraordinary precision; the slight blur where colours meet is Ikat\'s signature.',
    materials: ['Silk', 'Cotton'],
    colors: ['Maroon', 'Ochre', 'Teal', 'Black'],
    timeline: [{ year: 'Project note', event: 'Historical dates from the original prototype have been omitted pending source review. See the linked reading for a wider introduction.' }],
    references: [
      'Ikat Textiles of India — Chelna Desai',
      'The Sari — Linda Lynton',
    ],
    related: ['patola', 'bandhani'],
  },
  {
    slug: 'patola',
    name: 'Patola',
    region: 'Patan, Gujarat',
    origin: 'Patan',
    accent: '#9d174d',
    image: '/images/patola.webp',
    summary:
      'A rare double-ikat silk weave, identical on both sides, historically worn by royalty.',
    technique:
      'Both warp and weft are resist-dyed to the exact final pattern before weaving. The two dyed grids must align thread-for-thread on the loom — a single sari can take four to six months and is woven by only a few remaining families.',
    materials: ['Silk'],
    colors: ['Royal Red', 'Emerald', 'Gold', 'Cream'],
    timeline: [{ year: 'Project note', event: 'Historical dates from the original prototype have been omitted pending source review. See the linked reading for a wider introduction.' }],
    references: [
      'Patola of Gujarat — Calico Museum of Textiles',
      'Master Weavers — Victoria & Albert Museum',
    ],
    related: ['ikat', 'bandhani'],
  },
];

export const findArticle = (slug) => ENCYCLOPEDIA.find((a) => a.slug === slug);
