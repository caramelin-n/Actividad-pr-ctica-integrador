import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // A donde queria ir antes de que lo mandaran a /login.
  const destino = location.state?.from;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await login(email, password);
      navigate(typeof destino === "string" ? destino : "/");
    } catch (err) {
      // ApiError conserva el status, por eso se puede diferenciar el motivo.
      if (err instanceof ApiError && err.status === 401) {
        setError("Credenciales incorrectas");
      } else if (err instanceof ApiError && err.status === 500) {
        setError("Error del servidor, probá más tarde");
      } else {
        setError("No pudimos conectar con el servidor");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <h1>Iniciar sesión</h1>

      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p>
        ¿No tenés cuenta? <Link to="/register">Registrate acá</Link>
      </p>
    </div>
  );
};
