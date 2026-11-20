import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

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
        <Link to="/" className="navbar-logo">
          Biblioteca
        </Link>

        <div className="navbar-derecha">
          {!cargando && user && (
            <>
              <span className="navbar-usuario">
                {user.email}
                {/* el backend todavia no manda rol, si no existe no mostramos
                    el separador para que no quede "email · " colgando */}
                {user.rol && ` · ${user.rol}`}
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
