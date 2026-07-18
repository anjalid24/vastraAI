import { COMMUNITY_POSTS } from '../data/community.js';

/**
 * Community service — PLACEHOLDER for a future /api/community module.
 * Keeps an in-memory feed so the Community page is fully interactive
 * (like / bookmark / comment / create) during development.
 */
let posts = COMMUNITY_POSTS.map((p) => ({ ...p }));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const communityService = {
  async feed() {
    await wait(250);
    return posts.map((p) => ({ ...p }));
  },

  async toggleLike(id) {
    posts = posts.map((p) =>
      p.id === id
        ? { ...p, likedByMe: !p.likedByMe, likes: p.likes + (p.likedByMe ? -1 : 1) }
        : p
    );
    return posts.find((p) => p.id === id);
  },

  async toggleBookmark(id) {
    posts = posts.map((p) =>
      p.id === id ? { ...p, bookmarkedByMe: !p.bookmarkedByMe } : p
    );
    return posts.find((p) => p.id === id);
  },

  async addComment(id, { author, text }) {
    posts = posts.map((p) =>
      p.id === id
        ? { ...p, comments: [...p.comments, { author, text, at: new Date().toISOString() }] }
        : p
    );
    return posts.find((p) => p.id === id);
  },

  async createPost({ author, role, title, description, category, image }) {
    const post = {
      id: `post_${Date.now()}`,
      author,
      role: role || 'brand',
      title,
      description,
      category: category || 'Design',
      image: image || null,
      likes: 0,
      likedByMe: false,
      bookmarkedByMe: false,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    posts = [post, ...posts];
    return post;
  },
};

export default communityService;
