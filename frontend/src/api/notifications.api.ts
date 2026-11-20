import { api } from "./client.ts";
import type { Notification } from "../types"; // el tipo del proyecto, no el global del navegador

export const notificationsApi = {
  // api es un objeto con get/post/patch/delete, no se puede llamar como funcion
  listar: () => api.get<Notification[]>("/notificaciones"), // trae las notificaciones del usuario logueado
  marcarLeida: (id: number) =>
    api.patch<void>(`/notificaciones/${id}/leida`), // pasa leida a true en la base
};
