// comentarios hechos con inteligencia artesanal para ayudarme a entender mejor (no usé ia) (bueno un poco pero solo para explicaciones)
import { useEffect, useState } from "react"; //usestate para guardar datos que cuando cambian vuelven a dibujar la pantalla. useeffect para ejecutar codigo en momentos concretos
import { useParams, useNavigate } from "react-router"; //useparams lee el :id de la url y usenavigate cambia la ruta desde el codigo
import { librosApi } from "../api/libros.api";
import { notificationsApi } from "../api/notifications.api";
import { Can } from "../components/Can";
import type { Libro, EstadoLibro } from "../types";
import { useAuth } from "../context/AuthContext";
//todo esto son importaciones del propio sistema que armamos

export const LibroDetailPage = () => {
  const { id } = useParams();// id viene de la url como texto
  const navigate = useNavigate();
  const { user, tienePermiso } = useAuth() // user es el usuario logueado y se checkea si tiene permiso
  const [libro, setLibro] = useState<Libro | null>(null); //guarda el libro cargado y la funcion para cambiar su valor. Es un libro o nada.
  const [cargando, setCargando] = useState(true); //un simple cargando para agregar a la pagina
  const [subscribed, setSubscribed] = useState(false);// subscirbed = esta suscripto. empieza en false hasta que se demuestre lo contrario
  const [cambiandoEstado, setCambiandoEstado] = useState(false); //cambiandoEstado = true mientras lo hace (se usa para bloquar el select)
  const [error, setError] = useState<string | null>(null); // para el manejo de errores de carga inicial del libro en texto o en null si no hay
  const [errorAccion, setErrorAccion] = useState<string | null>(null); //guarda el mensaje de error de las acciones del usuario como suscribirse

  useEffect(() => { //primer componente que busca cargar el libro cuando se abre la pagina
    let vivo = true; //indica si el componente esta activo o no
    librosApi
      .obtener(Number(id)) //llama al backend para obtener el libro y lo convierte en numero
      .then((data) => {
        if (vivo) setLibro(data); //solo guarda el libro si la pagina sigue abierta
      })
      .catch(() => {
        if (vivo) setError("No se pudo cargar el libro"); // se ejecuta si hay algun error
      })
      .finally(() => {
        if (vivo) setCargando(false);// apaga el cargando si la pagina sigue abierta 
      });
    return () => { vivo = false; }; // devuelve que el componente ya no esta activo para limpieza
  }, [id]);

  // verificar si el usuario actual esta suscrito
  useEffect(() => {
    if (!user || !libro) return; //si no hay un user o un libro se corta la ejecucion
    let vivo = true; //la misma seguridad de antes
    librosApi
      .verificarSuscripcion(libro.id) //verifica si esta suscrito o no
      .then((data) => {
        if (vivo) setSubscribed(data.subscribed);
      }); //guarda la respuesta para que el boton muestre "suscribirse" o "desuscribirse"
      .catch(() => {
        //no pongo un seterror porqwue va a tapar todo el libro, mejor hago que falle en silencio
        if (vivo) setSubscribed(false);
      })
    return () => { vivo = false; }; // lo mismo de antes, desactiva el componente para limpieza
  }, [user, libro]); // se vuelve a ejecutar cuando cambia el usuario o el libro

  const handleSubscribe = async () => { //funcion que se ejecuta cuando se hace click en el boton
    if (!libro) return; //si no hay libro no hace nada
    setErrorAccion(null) //limpia el error de algun intento anterior
    try {
      if (subscribed) {
        await librosApi.desuscribir(libro!.id);
        setSubscribed(false);
        //si ya esta suscripto el boton ejecuta la funcion de desuscribir
      } else {
        await librosApi.suscribir(libro!.id);
        setSubscribed(true);
        //si no lo está, se suscribe
      }
    } catch (err) {
      setErrorAccion(
        err instanceof Error ? err.message : "no se puede actualizar la suscripcion"
      ) //guarda el error en erroraccion asi el libro no desaparece.
      // se usa instanceof error para comprobar porque por defecto es de tipo unknown.
    }
  };
//funcion que se ejecuta cuando se elige otro estado en select
  const handleCambiarEstado = async (nuevoEstado: EstadoLibro) => { //recibe el nuevo estado elegido
    if (!libro) return; //de nuevo, si no hay libro no hace nada
    setErrorAccion(null) //limpia el error de algun intento anterior
    setCambiandoEstado(true); //marca que se esta guardando (para deshabilitar el select)
    try {
      const actualizado = await librosApi.cambiarEstado(libro.id, nuevoEstado);//pide al backend cambiar el estado del libro y el backend devuelve el libro ya actualizado
      setLibro(actualizado); // reemplaza el ibro por la version actualizada.
    } catch (err) {
      setErrorAccion(
        err instanceof Error ? err.message: " No se pudo cambiar el estado" // de igual forma se usa el instanceoff para comprobar que no sea unknown
      )
    } finally {
      setCambiandoEstado(false); //vuelve a habilitar el select
    }
  };

  if (cargando) return <p>Cargando...</p>; //mientras se espera respuesta del backend la pagina muestra el cargando
  if (error) return <p role="alert">{error}</p>; //si falló la carga del libro muestra el error role="alert"
  if (!libro) return <p>Libro no encontrado</p>; //Si cargó pero no hay libro lo informa

  const estados: EstadoLibro[] = ["DISPONIBLE", "PRESTADO", "EN_REPARACION"]; //se repite los estados para que aparezca en el javascript final

  return (
    //contenedor principal
    <div className="contenedor">
      {/* //muestra el titulo y descripcion del libro */}
      <h1>{libro.titulo}</h1>
      <p>{libro.descripcion}</p>
      <div className="libro-meta">
        <span className={`badge badge-${libro.estado.toLowerCase()}`}>
          {libro.estado}
        </span>
        <span>Creado: {new Date(libro.createdAt).toLocaleDateString()}</span>
        <span>Actualizado: {new Date(libro.updatedAt).toLocaleDateString()}</span>
      </div>

      <div className="acciones-libro">
        <button
          onClick={handleSubscribe}
          className={subscribed ? "boton-secundario" : "boton"}
        >
          {subscribed ? "Desuscribirse" : "Suscribirse"}
        </button>

        <Can permiso="libro:change-status">
          <div className="cambio-estado">
            <label>
              Cambiar estado:
              <select
                value={libro.estado}
                onChange={(e) => handleCambiarEstado(e.target.value as EstadoLibro)}
                disabled={cambiandoEstado}
              >
                {estados.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Can>
      </div>

      <button onClick={() => navigate(-1)} className="boton-secundario">
        Volver a la lista
      </button>
    </div>
  );
};
