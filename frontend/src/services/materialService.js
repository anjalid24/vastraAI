import apiClient from './apiClient.js';

/**
 * Material service — wraps /api/materials. Reads are public; create/update/
 * delete require a Brand or Admin token (attached automatically by the client).
 * List response: { success, count, total, page, pages, data: { materials } }.
 */
const materialService = {
  async list({ category, isAvailable, search, page = 1, limit = 12 } = {}) {
    const params = { page, limit };
    if (category) params.category = category;
    if (typeof isAvailable === 'boolean') params.isAvailable = isAvailable;
    if (search) params.search = search;

    const { data } = await apiClient.get('/api/materials', { params });
    return {
      materials: data.data.materials,
      total: data.total,
      page: data.page,
      pages: data.pages,
      count: data.count,
    };
  },

  async getById(id) {
    const { data } = await apiClient.get(`/api/materials/${id}`);
    return data.data.material;
  },

  async create(payload) {
    const { data } = await apiClient.post('/api/materials', payload);
    return data.data.material;
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/api/materials/${id}`, payload);
    return data.data.material;
  },

  async remove(id) {
    const { data } = await apiClient.delete(`/api/materials/${id}`);
    return data;
  },
};

// Mirrors the backend Material model enum.
export const MATERIAL_CATEGORIES = [
  'Cotton', 'Silk', 'Linen', 'Wool', 'Rayon',
  'Polyester', 'Denim', 'Velvet', 'Other',
];

export default materialService;
