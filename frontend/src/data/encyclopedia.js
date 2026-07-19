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
    summary:
      'An ancient tie-and-dye craft where thousands of hand-tied knots resist the dye to form dotted patterns.',
    technique:
      'Fabric is pinched and tied into thousands of tiny knots with thread, then dyed in stages from light to dark. Untying reveals crisp undyed dots. Master artisans tie by feel, using a pointed fingernail guard.',
    materials: ['Silk', 'Cotton', 'Georgette'],
    colors: ['Crimson', 'Marigold', 'Indigo', 'Ivory'],
    timeline: [
      { year: '~3000 BCE', event: 'Earliest evidence of resist dyeing in the Indus Valley.' },
      { year: '7th c. CE', event: 'Bandhani depicted in Ajanta cave murals.' },
      { year: '12th c.', event: 'Khatri community establishes Kutch as a Bandhani hub.' },
      { year: 'Today', event: 'GI-tagged Kutch Bandhani sustains thousands of artisan families.' },
    ],
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
    summary:
      'A resist-dyeing technique applied to yarns before weaving, giving patterns their soft feathered edges.',
    technique:
      'Warp and/or weft yarns are bound and dyed before being mounted on the loom. Aligning the dyed yarns during weaving demands extraordinary precision; the slight blur where colours meet is Ikat\'s signature.',
    materials: ['Silk', 'Cotton'],
    colors: ['Maroon', 'Ochre', 'Teal', 'Black'],
    timeline: [
      { year: 'Ancient', event: 'Independent Ikat traditions arise across Asia and India.' },
      { year: '18th c.', event: 'Pochampally refines the telia rumal oil-treated Ikat.' },
      { year: '2005', event: 'Pochampally Ikat receives a Geographical Indication tag.' },
      { year: 'Today', event: 'Sambalpuri & Pochampally Ikat prized on global runways.' },
    ],
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
    summary:
      'A rare double-ikat silk weave, identical on both sides, historically worn by royalty.',
    technique:
      'Both warp and weft are resist-dyed to the exact final pattern before weaving. The two dyed grids must align thread-for-thread on the loom — a single sari can take four to six months and is woven by only a few remaining families.',
    materials: ['Silk'],
    colors: ['Royal Red', 'Emerald', 'Gold', 'Cream'],
    timeline: [
      { year: '11th c.', event: 'Salvi weavers migrate to Patan under the Solanki dynasty.' },
      { year: 'Mughal era', event: 'Patola becomes a coveted export and royal textile.' },
      { year: '2013', event: 'Patan Patola earns its Geographical Indication tag.' },
      { year: 'Today', event: 'Fewer than a handful of families keep double-ikat alive.' },
    ],
    references: [
      'Patola of Gujarat — Calico Museum of Textiles',
      'Master Weavers — Victoria & Albert Museum',
    ],
    related: ['ikat', 'bandhani'],
  },
];

export const findArticle = (slug) => ENCYCLOPEDIA.find((a) => a.slug === slug);
