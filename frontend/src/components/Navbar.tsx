import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Can } from "./Can";
import { NotificationBell } from "./NotificationBell";

export const Navbar = () => {
  const { user, logout, cargando } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-contenido">
        <div className="navbar-izquierda">
          <Link to="/" className="navbar-logo">
            Biblioteca
          </Link>
          {!cargando && user && (
            <div className="navbar-links">
              <NavLink to="/" end>Libros</NavLink>
              <Can permiso="notification:read">
                <NavLink to="/notificaciones">Notificaciones</NavLink>
              </Can>
              <Can permiso="user:read">
                <NavLink to="/admin/usuarios">Usuarios</NavLink>
              </Can>
            </div>
          )}
        </div>

        <div className="navbar-derecha">
          {!cargando && user && (
            <>
              <Can permiso="notification:read">
                <NotificationBell />
              </Can>
              <span className="navbar-usuario">
                {user.email}
                {user.role && ` · ${user.role}`}
              </span>
              <button type="button" onClick={handleLogout} className="boton-secundario">
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
