import axios from 'axios';

// Base URL rules:
//  - In dev, leave VITE_API_BASE_URL empty and let the Vite proxy forward
//    /api and /health to the Express backend (same-origin, no CORS).
//  - In production, set VITE_API_BASE_URL to the API's absolute origin.
const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const TOKEN_KEY = 'vastra_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT to every request when we have one.
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize the backend's error envelope into a plain Error with a readable
// message, so callers can just `catch (e) { setError(e.message) }`.
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.request && !error.response
        ? 'Cannot reach the server. Is the backend running?'
        : 'Something went wrong. Please try again.');

    // A 401 on an authenticated route means the token is stale — clear it.
    if (status === 401 && tokenStore.get()) tokenStore.clear();

    return Promise.reject(Object.assign(new Error(message), { status }));
  }
);

export default apiClient;
