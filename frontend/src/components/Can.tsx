import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import type { Permiso } from "../types";

export function Can({
  permiso,
  children,
}: {
  permiso: Permiso;
  children: ReactNode;
}) {
  const { tienePermiso } = useAuth();
  if (!tienePermiso(permiso)) return null;
  return <>{children}</>;
}
