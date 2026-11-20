import { HERITAGE } from "../data/heritage.js";
export const escapeXml = (value) =>
  String(value).replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
export function makePreview({
  pattern = "Bandhani",
  material = "Cotton",
  seed = 42,
  density = 7,
  palette = "heritage",
} = {}) {
  const safePattern = Object.hasOwn(HERITAGE, pattern) ? pattern : "Bandhani";
  const colours =
    palette === "indigo"
      ? ["#24365b", "#eee8d9", "#b6c4d1"]
      : palette === "rose"
        ? ["#8c3b4e", "#f3dfc6", "#d99d6c"]
        : HERITAGE[safePattern].colors.map((c) => c.hex);
  const n = Math.max(3, Math.min(12, Math.round(Number(density) || 7)));
  const normalizedSeed = Number.isFinite(Number(seed))
    ? Number(seed) >>> 0
    : 42;
  let t = normalizedSeed;
  const rng = () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
  const size = 512 / n;
  const shapes = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const cx = (x + 0.5) * size,
        cy = (y + 0.5) * size,
        c = colours[1 + Math.floor(rng() * (colours.length - 1))],
        r = size * (0.12 + rng() * 0.08);
      if (safePattern === "Bandhani")
        shapes.push(
          `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="2" fill="${c}"/>`,
        );
      else if (safePattern === "Ikat")
        shapes.push(
          `<path d="M${cx} ${cy - size * 0.36} l${size * 0.27} ${size * 0.36} l-${size * 0.27} ${size * 0.36} l-${size * 0.27} -${size * 0.36}Z" fill="${c}" opacity=".88"/>`,
        );
      else
        shapes.push(
          `<g transform="translate(${cx} ${cy}) rotate(45)"><rect x="-${size * 0.23}" y="-${size * 0.23}" width="${size * 0.46}" height="${size * 0.46}" fill="none" stroke="${c}" stroke-width="4"/><circle r="${size * 0.09}" fill="${c}"/></g>`,
        );
    }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><title>${escapeXml(safePattern)}-inspired geometric study on ${escapeXml(material)}</title><rect width="512" height="512" fill="${colours[0]}"/>${shapes.join("")}<rect x="10" y="10" width="492" height="492" fill="none" stroke="${colours[1]}" stroke-width="3"/></svg>`;
  return {
    svg,
    imageUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    pattern: safePattern,
    material: String(material).slice(0, 80),
    seed: normalizedSeed,
    density: n,
    palette,
    authenticityScore: null,
  };
}
const designService = {
  async generate(options) {
    return {
      ...makePreview(options),
      id: globalThis.crypto?.randomUUID?.() || `study-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
  },
};
export default designService;
