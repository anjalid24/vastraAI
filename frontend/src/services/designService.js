import { HERITAGE } from '../data/heritage.js';

/**
 * Design service — PLACEHOLDER.
 *
 * In production this calls the separate Django REST AI image-generation
 * service (AI_SERVICE_URL) through the Node backend. That module isn't wired
 * yet, so we simulate generation client-side: a short delay, then a
 * deterministic "woven" SVG preview built from the chosen pattern + material.
 * Swap `generate()` for a real `apiClient.post('/api/designs/generate', ...)`
 * once the endpoint exists — the rest of the Design Studio stays unchanged.
 */

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Build a data-URI SVG so the studio has a real, downloadable preview offline.
function mockPreview({ pattern, material, seed }) {
  const heritage = HERITAGE[pattern] || {};
  const colors = heritage.colors?.map((c) => c.hex) || ['#1e3a8a', '#f59e0b', '#10b981'];
  const [a, b, c] = [colors[0] || '#1e3a8a', colors[1] || '#f59e0b', colors[2] || '#b91c1c'];
  const dots = [];
  const rng = mulberry32(seed || 42);
  for (let i = 0; i < 60; i++) {
    const cx = Math.round(rng() * 512);
    const cy = Math.round(rng() * 512);
    const r = 6 + Math.round(rng() * 10);
    const fill = [a, b, c, '#ffffff'][Math.floor(rng() * 4)];
    dots.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="0.9"/>`);
  }
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${a}"/>
          <stop offset="1" stop-color="${b}"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#g)"/>
      ${dots.join('')}
      <text x="24" y="486" font-family="Poppins, sans-serif" font-size="20"
        fill="#ffffff" opacity="0.85">${pattern || 'Design'} · ${material || 'Fabric'}</text>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Small deterministic PRNG so the same seed reproduces the same preview.
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const designService = {
  async generate(options) {
    await wait(1400); // simulate model latency
    const seed = options.seed || Math.floor(Math.random() * 99999);
    return {
      id: `dg_${Date.now()}`,
      imageUrl: mockPreview({ ...options, seed }),
      seed,
      pattern: options.pattern,
      material: options.material,
      prompt: options.prompt,
      // A playful placeholder "authenticity score" the right panel shows.
      authenticityScore: 72 + Math.floor(Math.random() * 24),
      createdAt: new Date().toISOString(),
    };
  },
};

export default designService;
