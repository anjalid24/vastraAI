import apiClient, { tokenStore } from './apiClient.js';

/**
 * Auth service — thin wrappers over the backend's /api/auth endpoints.
 * The backend returns: { success, message, data: { user, token } }.
 */
const authService = {
  // role must be 'brand' or 'artisan' (SIGNUP_ROLES); omit to use the
  // backend default. name/email/password are required.
  async register({ name, email, password, role }) {
    const body = { name, email, password };
    if (role) body.role = role;
    const { data } = await apiClient.post('/api/auth/signup', body);
    const { user, token } = data.data;
    tokenStore.set(token);
    return { user, token };
  },

  async login({ email, password }) {
    const { data } = await apiClient.post('/api/auth/login', { email, password });
    const { user, token } = data.data;
    tokenStore.set(token);
    return { user, token };
  },

  // Re-hydrate the session from a stored token on app boot.
  async me() {
    const { data } = await apiClient.get('/api/auth/me');
    return data.data.user;
  },

  logout() {
    tokenStore.clear();
  },
};

export default authService;
