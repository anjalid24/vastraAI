import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService.js';
import { tokenStore } from '../services/apiClient.js';

const AuthContext = createContext(null);

/**
 * Holds the authenticated user and exposes login/register/logout.
 * On boot, if a token exists we re-validate it against /api/auth/me so a
 * refreshed page keeps the session (or clears a stale token silently).
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!tokenStore.get()) {
        setBooting(false);
        return;
      }
      try {
        const me = await authService.me();
        if (alive) setUser(me);
      } catch {
        tokenStore.clear();
      } finally {
        if (alive) setBooting(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const login = async (creds) => {
    const { user: u } = await authService.login(creds);
    setUser(u);
    return u;
  };

  const register = async (payload) => {
    const { user: u } = await authService.register(payload);
    setUser(u);
    return u;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      booting,
      isAuthenticated: !!user,
      role: user?.role || null,
      login,
      register,
      logout,
    }),
    [user, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
