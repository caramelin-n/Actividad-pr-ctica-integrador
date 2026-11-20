import { useEffect, useState } from "react";
import { notificationsApi } from "../api/notifications.api";
import { EVENTO_NOTIFICACIONES } from "../components/NotificationBell";
import type { Notification } from "../types";

const avisarCambios = () => window.dispatchEvent(new Event(EVENTO_NOTIFICACIONES));

export const NotificationsPage = () => {
  const [notificaciones, setNotificaciones] = useState<Notification[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    notificationsApi
      .listar()
      .then((data) => {
        if (vivo) setNotificaciones(data);
      })
      .catch(() => {
        if (vivo) setError("No se pudieron cargar las notificaciones");
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });
    return () => {
      vivo = false;
    };
  }, []);

  const noLeidas = notificaciones.filter((n) => n.status === "no leida").length;

  async function handleMarcarLeida(id: number) {
    setError(null);
    try {
      const actualizada = await notificationsApi.marcarLeida(id);
      setNotificaciones((prev) => prev.map((n) => (n.id === id ? actualizada : n)));
      avisarCambios();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo marcar como leída");
    }
  }

  async function handleMarcarTodas() {
    setError(null);
    try {
      await notificationsApi.marcarTodasLeidas();
      setNotificaciones((prev) => prev.map((n) => ({ ...n, status: "leida" })));
      avisarCambios();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron marcar como leídas");
    }
  }

  if (cargando) return <p className="cargando">Cargando notificaciones...</p>;

  return (
    <div className="contenedor">
      <div className="encabezado">
        <h1>Notificaciones {noLeidas > 0 && <span className="contador-titulo">{noLeidas} sin leer</span>}</h1>
        {noLeidas > 0 && (
          <button type="button" className="boton" onClick={handleMarcarTodas}>
            Marcar todas como leídas
          </button>
        )}
      </div>

      {error && <p role="alert">{error}</p>}

      {notificaciones.length === 0 ? (
        <p className="vacio">No tenés notificaciones. Suscribite a un libro para enterarte cuando cambie de estado.</p>
      ) : (
        <ul className="lista-notificaciones">
          {notificaciones.map((n) => (
            <li key={n.id} className={`notificacion ${n.status === "no leida" ? "notificacion-nueva" : ""}`}>
              <div>
                <p className="notificacion-mensaje">{n.message}</p>
                <span className="notificacion-fecha">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
              {n.status === "no leida" ? (
                <button type="button" className="boton-secundario" onClick={() => handleMarcarLeida(n.id)}>
                  Marcar como leída
                </button>
              ) : (
                <span className="notificacion-leida">Leída</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
