import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { notificationsApi } from "../api/notifications.api";

const INTERVALO_MS = 10000;

export const EVENTO_NOTIFICACIONES = "notificaciones:actualizadas";

export const NotificationBell = () => {
  const [noLeidas, setNoLeidas] = useState(0);

  const actualizar = useCallback(() => {
    notificationsApi
      .contarNoLeidas()
      .then((data) => setNoLeidas(data.count))
      .catch(() => setNoLeidas(0));
  }, []);

  useEffect(() => {
    actualizar();
    const intervalo = window.setInterval(actualizar, INTERVALO_MS);
    window.addEventListener(EVENTO_NOTIFICACIONES, actualizar);
    return () => {
      window.clearInterval(intervalo);
      window.removeEventListener(EVENTO_NOTIFICACIONES, actualizar);
    };
  }, [actualizar]);

  return (
    <Link to="/notificaciones" className="campana" aria-label={`Notificaciones: ${noLeidas} sin leer`}>
      <span aria-hidden="true">🔔</span>
      {noLeidas > 0 && <span className="campana-contador">{noLeidas > 99 ? "99+" : noLeidas}</span>}
    </Link>
  );
};
