import { isDemo, listSampleMaterials } from './demo.js';
import apiClient from './apiClient.js';

/**
 * Material service — wraps /api/materials. Reads are public; create/update/
 * delete require an Admin token (attached automatically by the client).
 * List response: { success, count, total, page, pages, data: { materials } }.
 */
const materialService = {
  async list({ category, isAvailable, search, page = 1, limit = 12 } = {}) {
    if (isDemo) return listSampleMaterials({ category, isAvailable, search, page, limit });
    const params = {};
    if (category) params.category = category.toLowerCase();
    if (typeof isAvailable === 'boolean') params.isAvailable = isAvailable;
    if (search) params.search = search;

    const { data } = await apiClient.get('/api/materials', { params });
    const all = (data.data?.materials || []).map(m => ({ ...m, materialName:m.name, category:m.category?.replace(/^./, c=>c.toUpperCase()), isAvailable:m.availability, imageUrl:m.images?.[0], supplierName:m.supplier?.name, countryOfOrigin:m.origin?.country, colorOptions:m.colors?.map(c=>c.name) || [] }));
    const filtered = all.filter(m => typeof isAvailable !== 'boolean' || m.isAvailable === isAvailable);
    const pages = Math.max(1, Math.ceil(filtered.length / limit));
    const current = Math.max(1, Math.min(page, pages));
    return { materials:filtered.slice((current-1)*limit,current*limit), total:filtered.length, page:current, pages, count:filtered.length };
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
  'Cotton', 'Silk', 'Wool', 'Linen', 'Polyester', 'Blend', 'Georgette', 'Chiffon',
];

export default materialService;
