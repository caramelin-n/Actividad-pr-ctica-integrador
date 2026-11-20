import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { librosApi } from "../api/libros.api";
import { ESTADOS_LIBRO } from "../types";
import type { EstadoLibro } from "../types";

export const LibroFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = id !== undefined;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState<EstadoLibro>("DISPONIBLE");
  const [cargando, setCargando] = useState(esEdicion);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!esEdicion) return;
    let vivo = true;
    librosApi
      .obtener(Number(id))
      .then((libro) => {
        if (!vivo) return;
        setTitle(libro.title);
        setDescription(libro.description);
        setState(libro.state);
      })
      .catch(() => {
        if (vivo) setError("No se pudo cargar el libro");
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });
    return () => {
      vivo = false;
    };
  }, [id, esEdicion]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const libro = esEdicion
        ? await librosApi.editar(Number(id), { title, description })
        : await librosApi.crear({ title, description, state });
      navigate(`/libros/${libro.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el libro");
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) return <p className="cargando">Cargando...</p>;

  return (
    <div className="contenedor">
      <h1>{esEdicion ? "Editar libro" : "Crear libro"}</h1>

      {error && <p role="alert">{error}</p>}

      <form onSubmit={handleSubmit} className="formulario">
        <label>
          Título
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label>
          Descripción
          <textarea
            value={description}
            required
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        {!esEdicion && (
          <label>
            Estado inicial
            <select value={state} onChange={(e) => setState(e.target.value as EstadoLibro)}>
              {ESTADOS_LIBRO.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="acciones-formulario">
          <button type="submit" className="boton" disabled={enviando}>
            {enviando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear libro"}
          </button>
          <Link to={esEdicion ? `/libros/${id}` : "/"} className="boton-secundario">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};
