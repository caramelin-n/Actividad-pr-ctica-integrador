import { useEffect, useState } from "react";
import { usersApi } from "../api/users.api";
import { useAuth } from "../context/AuthContext";
import type { Rol, UserListItem } from "../types";

const ROLES: Rol[] = ["admin", "operador", "usuario"];

export const AdminPage = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<UserListItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    usersApi
      .listar()
      .then((data) => {
        if (vivo) setUsuarios(data);
      })
      .catch(() => {
        if (vivo) setError("No se pudieron cargar los usuarios");
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });
    return () => {
      vivo = false;
    };
  }, []);

  async function handleCambiarRol(id: number, role: Rol) {
    setError(null);
    setMensaje(null);
    setGuardando(id);
    try {
      const actualizado = await usersApi.asignarRol(id, role);
      setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, ...actualizado } : u)));
      setMensaje(`Rol de ${actualizado.email} actualizado a ${role}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo asignar el rol");
    } finally {
      setGuardando(null);
    }
  }

  if (cargando) return <p className="cargando">Cargando usuarios...</p>;

  return (
    <div className="contenedor">
      <h1>Usuarios</h1>

      {error && <p role="alert">{error}</p>}
      {mensaje && <p className="exito">{mensaje}</p>}

      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    value={u.role ?? ""}
                    disabled={guardando === u.id || u.id === user?.id}
                    title={u.id === user?.id ? "No podés cambiar tu propio rol" : undefined}
                    onChange={(e) => handleCambiarRol(u.id, e.target.value as Rol)}
                  >
                    {u.role === null && <option value="">Sin rol</option>}
                    {ROLES.map((rol) => (
                      <option key={rol} value={rol}>
                        {rol}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
