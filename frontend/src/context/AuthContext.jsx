import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AUTH_STORAGE } from "../constants/authStorage";
import { api } from "../lib/api";

/**
 * @typedef {{ id: string, email: string, full_name: string | null, is_active: boolean, created_at: string }} AuthUser
 */

/** @type {import('react').Context<null | { user: AuthUser | null, loading: boolean, login: Function, signup: Function, logout: Function, refresh: Function }>} */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(/** @type {AuthUser | null} */ (null));
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem(AUTH_STORAGE.ACCESS_TOKEN);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/api/v1/auth/me");
      setUser(data);
    } catch {
      localStorage.removeItem(AUTH_STORAGE.ACCESS_TOKEN);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (/** @type {{ email: string, password: string }} */ creds) => {
      const { data } = await api.post("/api/v1/auth/login", creds);
      localStorage.setItem(AUTH_STORAGE.ACCESS_TOKEN, data.access_token);
      setLoading(true);
      await refresh();
    },
    [refresh],
  );

  const signup = useCallback(
    async (
      /** @type {{ email: string, password: string, full_name?: string | null }} */ payload,
    ) => {
      const { data } = await api.post("/api/v1/auth/signup", {
        email: payload.email,
        password: payload.password,
        full_name: payload.full_name || null,
      });
      localStorage.setItem(AUTH_STORAGE.ACCESS_TOKEN, data.access_token);
      setLoading(true);
      await refresh();
    },
    [refresh],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE.ACCESS_TOKEN);
    setUser(null);
    window.location.assign("/login");
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      refresh,
    }),
    [user, loading, login, signup, logout, refresh],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
