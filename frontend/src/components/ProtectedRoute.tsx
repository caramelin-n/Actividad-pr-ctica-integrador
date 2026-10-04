import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, cargando } = useAuth();
  const location = useLocation();

  // Mientras se consulta /auth/me no se sabe todavia si hay sesion.
  // Decidir antes de que responda mandaria al usuario a /login sin motivo.
  if (cargando) return <p className="cargando">Cargando...</p>;

  // 'state' guarda a donde iba, para devolverlo despues de loguearse.
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return <>{children}</>;
}
