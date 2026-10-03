import { api } from "./client.ts";
import type { Notification } from "../types"; // el tipo del proyecto, no el global del navegador

export const notificationsApi = {
  listar: () => api<Notification[]>("/notificaciones"), // trae las notificaciones del usuario logueado
  marcarLeida: (id: number) =>
    api<void>(`/notificaciones/${id}/leida`, { method: "PATCH" }), // pasa leida a true en la base
};