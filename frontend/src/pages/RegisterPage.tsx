import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

export const RegisterPage = () => {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await registrar(email, password);
      navigate("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("Ya existe un usuario con ese email");
      } else if (err instanceof ApiError && err.status === 400) {
        setError("Revisá los datos, hay algo incorrecto");
      } else if (err instanceof ApiError && err.status >= 500) {
        setError("Error del servidor, probá más tarde");
      } else {
        setError("No pudimos conectar con el servidor");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-tarjeta">
        <h1 className="auth-titulo">Crear cuenta</h1>

        {error && <p role="alert">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              required
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              required
              minLength={6}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button type="submit" className="boton boton-bloque" disabled={enviando}>
            {enviando ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="auth-pie">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
};
