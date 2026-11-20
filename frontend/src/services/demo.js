export const isDemo = import.meta.env.VITE_DEMO_MODE === "true";
export const demoUser = {
  id: "demo-explorer",
  name: "Demo explorer",
  email: "No account needed",
  role: "brand",
  isActive: true,
};
export const SAMPLE_MATERIALS = [
  {
    _id: "cotton",
    materialName: "Everyday cotton",
    category: "Cotton",
    pricePerMeter: 320,
    isAvailable: true,
    description: "A light, matte sample for experimenting with colour.",
    imageUrl: "/images/bandhani.webp",
    supplierName: "Sample catalogue",
    countryOfOrigin: "India",
    stockQuantity: 0,
    colorOptions: ["Ivory", "Indigo"],
  },
  {
    _id: "silk",
    materialName: "Lustrous silk",
    category: "Silk",
    pricePerMeter: 1200,
    isAvailable: true,
    description: "A smooth sample for a richer colour study.",
    imageUrl: "/images/patola.webp",
    supplierName: "Sample catalogue",
    countryOfOrigin: "India",
    stockQuantity: 0,
    colorOptions: ["Crimson", "Gold"],
  },
  {
    _id: "linen",
    materialName: "Textured linen",
    category: "Linen",
    pricePerMeter: 650,
    isAvailable: false,
    description: "An open-textured sample with a natural finish.",
    imageUrl: "/images/ikat.webp",
    supplierName: "Sample catalogue",
    countryOfOrigin: "India",
    stockQuantity: 0,
    colorOptions: ["Natural"],
  },
];
export function listSampleMaterials({
  category,
  isAvailable,
  search = "",
  page = 1,
  limit = 12,
} = {}) {
  const all = SAMPLE_MATERIALS.filter(
    (m) =>
      (!category || m.category === category) &&
      (typeof isAvailable !== "boolean" || m.isAvailable === isAvailable) &&
      m.materialName.toLowerCase().includes(search.toLowerCase().trim()),
  );
  const pages = Math.max(1, Math.ceil(all.length / limit));
  const current = Math.max(1, Math.min(Number(page) || 1, pages));
  return {
    materials: all.slice((current - 1) * limit, current * limit),
    total: all.length,
    count: all.length,
    pages,
    page: current,
  };
}
