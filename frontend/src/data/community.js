// Seed feed for the Community page (placeholder until /api/community exists).
export const COMMUNITY_POSTS = [
  {
    id: 'post_1',
    author: 'Ananya Rao',
    role: 'artisan',
    title: 'Revived a Sambalpuri Ikat border on handloom',
    description:
      'Spent three weeks aligning the weft for this temple border. The AI mock-up helped me test colour combos before touching the loom.',
    category: 'Ikat',
    image: null,
    likes: 128,
    likedByMe: false,
    bookmarkedByMe: false,
    comments: [
      { author: 'Vikram S', text: 'The alignment is flawless 🙌', at: '2026-07-10T09:00:00Z' },
    ],
    createdAt: '2026-07-10T08:00:00Z',
  },
  {
    id: 'post_2',
    author: 'Nova Label',
    role: 'brand',
    title: 'Bandhani-inspired capsule for our summer line',
    description:
      'Generated 40 variations in the Design Studio, shortlisted 6, and paired them with the recommended georgette. Feedback welcome!',
    category: 'Bandhani',
    image: null,
    likes: 86,
    likedByMe: true,
    bookmarkedByMe: true,
    comments: [],
    createdAt: '2026-07-12T14:30:00Z',
  },
  {
    id: 'post_3',
    author: 'Meera Textiles',
    role: 'brand',
    title: 'How authentic is AI-generated Patola?',
    description:
      'The authenticity score nudged us toward traditional emerald-and-gold. Curious how other brands are using the heritage panel.',
    category: 'Patola',
    image: null,
    likes: 54,
    likedByMe: false,
    bookmarkedByMe: false,
    comments: [
      { author: 'Ananya Rao', text: 'Keep the double-ikat symmetry in mind!', at: '2026-07-13T10:00:00Z' },
    ],
    createdAt: '2026-07-13T09:15:00Z',
  },
];
