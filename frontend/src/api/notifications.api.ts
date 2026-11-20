import { api } from "./client.ts";
import type { Notification } from "../types"; // el tipo del proyecto, no el global del navegador

export const notificationsApi = {
  // api es un objeto con get/post/patch/delete, no se puede llamar como funcion
  listar: () => api.get<Notification[]>("/notifications"), // trae las notificaciones del usuario logueado
  contarNoLeidas: () => api.get<{ count: number }>("/notifications/unread-count"),
  marcarLeida: (id: number) =>
    api.patch<Notification>(`/notifications/${id}/read`), // pasa la notificacion a "leida" en la base
  marcarTodasLeidas: () => api.patch<void>("/notifications/read-all"),
};
