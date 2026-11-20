import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import type { EstadoLibro, Libro } from "../types";
import { librosApi } from "../api/libros.api";
import { Can } from "../components/Can";

export const LibroListPage = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<EstadoLibro | "TODOS">("TODOS");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    let vivo = true;
    librosApi
      .listar()
      .then((data) => {
        if (vivo) setLibros(data);
      })
      .catch(() => {
        if (vivo) setError("No se pudieron cargar los libros");
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });
    return () => {
      vivo = false;
    };
  }, []);

  const librosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return libros.filter((l) => {
      const coincideEstado = filtro === "TODOS" || l.estado === filtro;
      const coincideBusqueda =
        termino === "" ||
        l.titulo.toLowerCase().includes(termino) ||
        l.descripcion.toLowerCase().includes(termino);
      return coincideEstado && coincideBusqueda;
    });
  }, [libros, filtro, busqueda]);

  const agrupados = useMemo(() => {
    const grupos: Record<EstadoLibro, Libro[]> = {
      DISPONIBLE: [],
      PRESTADO: [],
      EN_REPARACION: [],
    };
    for (const l of librosFiltrados) {
      grupos[l.estado].push(l);
    }
    return grupos;
  }, [librosFiltrados]);

  if (cargando) return <p>Cargando libros...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <div className="contenedor">
      <div className="encabezado">
        <h1>Libros</h1>
        <Can permiso="libro:create">
          <Link to="/libros/new" className="boton">
            Crear libro
          </Link>
        </Can>
      </div>

      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por título o descripción"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as EstadoLibro | "TODOS")}
        >
          <option value="TODOS">Todos</option>
          <option value="DISPONIBLE">Disponibles</option>
          <option value="PRESTADO">Prestados</option>
          <option value="EN_REPARACION">En reparación</option>
        </select>
      </div>

      <section>
        <h2>Disponibles ({agrupados.DISPONIBLE.length})</h2>
        <ul className="lista-libros">
          {agrupados.DISPONIBLE.map((l) => (
            <li key={l.id} className="tarjeta-libro">
              <Link to={`/libros/${l.id}`}>
                <h3>{l.titulo}</h3>
                <p>{l.descripcion}</p>
                <span className={`badge badge-${l.estado.toLowerCase()}`}>
                  {l.estado}
                </span>
              </Link>
            </li>
          ))}
          {agrupados.DISPONIBLE.length === 0 && <li>No hay libros disponibles</li>}
        </ul>
      </section>

      <section>
        <h2>Prestados ({agrupados.PRESTADO.length})</h2>
        <ul className="lista-libros">
          {agrupados.PRESTADO.map((l) => (
            <li key={l.id} className="tarjeta-libro">
              <Link to={`/libros/${l.id}`}>
                <h3>{l.titulo}</h3>
                <p>{l.descripcion}</p>
                <span className={`badge badge-${l.estado.toLowerCase()}`}>
                  {l.estado}
                </span>
              </Link>
            </li>
          ))}
          {agrupados.PRESTADO.length === 0 && <li>No hay libros prestados</li>}
        </ul>
      </section>

      <section>
        <h2>En reparación ({agrupados.EN_REPARACION.length})</h2>
        <ul className="lista-libros">
          {agrupados.EN_REPARACION.map((l) => (
            <li key={l.id} className="tarjeta-libro">
              <Link to={`/libros/${l.id}`}>
                <h3>{l.titulo}</h3>
                <p>{l.descripcion}</p>
                <span className={`badge badge-${l.estado.toLowerCase()}`}>
                  {l.estado}
                </span>
              </Link>
            </li>
          ))}
          {agrupados.EN_REPARACION.length === 0 && <li>No hay libros en reparación</li>}
        </ul>
      </section>
    </div>
  );
};
