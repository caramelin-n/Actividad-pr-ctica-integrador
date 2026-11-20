import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { authApi } from "../api/auth.api";
import { setUnauthorizedHandler } from "../api/client";
import type { Permiso, User } from "../types";

interface AuthContextValue {
  user: User | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<void>;
  registrar: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  tienePermiso: (permiso: Permiso) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);

  // Al montar, preguntar al backend si la cookie sigue siendo valida.
  // Con cookie httpOnly el frontend no puede saberlo solo: tiene que preguntar.
  useEffect(() => {
    let vivo = true;
    authApi
      .sesion()
      .then((u) => {
        if (vivo) setUser(u);
      })
      .catch(() => {
        if (vivo) setUser(null);
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });
    return () => {
      vivo = false;
    };
  }, []);

  // Si cualquier request devuelve 401, la sesion cayo: limpiar el estado.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setCargando(false);
    });
    return () => setUnauthorizedHandler(() => {});
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await authApi.login(email, password);
    const u = await authApi.sesion();
    setUser(u);
  }, []);

  const registrar = useCallback(async (email: string, password: string) => {
    await authApi.registrar(email, password);
    await login(email, password);
  }, [login]);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const tienePermiso = useCallback(
    (permiso: Permiso): boolean => user?.permissions.includes(permiso) ?? false,
    [user],
  );

  return (
    <AuthContext.Provider value={{ user, cargando, login, registrar, logout, tienePermiso }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
