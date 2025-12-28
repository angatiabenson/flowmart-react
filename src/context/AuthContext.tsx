import React, { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

type User = {id:number, name: string; email: string } | null;
type AuthState = { user: User; token?: string } | null;

type AuthCtx = {
  user: User;
  token?: string;
  login: (payload: { id:number, name: string; email: string; token?: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);
const STORAGE_KEY = "flowmart:auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useLocalStorage<AuthState>(STORAGE_KEY, null);

  const login = (payload: { id:number, name: string; email: string; token?: string }) => {
    setState({ user: { id: payload.id, name: payload.name, email: payload.email }, token: payload.token });
  };

  const logout = () => setState(null);

  const value = useMemo(
    () => ({ user: state?.user ?? null, token: state?.token, login, logout }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider/>");
  return ctx;
};