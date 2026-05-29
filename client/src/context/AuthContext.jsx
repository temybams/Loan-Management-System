import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "loan_os_auth";

function readInitialAuth() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readInitialAuth);

  async function login(credentials) {
    const nextAuth = await api.login(credentials);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
    return nextAuth;
  }

  async function signup(payload) {
    await api.signup(payload);
    return login({
      email: payload.email,
      password: payload.password,
    });
  }

  async function logout() {
    try {
      if (auth?.token) await api.logout();
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      setAuth(null);
    }
  }

  const value = useMemo(
    () => ({
      auth,
      user: auth?.user || null,
      isAuthenticated: Boolean(auth?.token),
      login,
      signup,
      logout,
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
