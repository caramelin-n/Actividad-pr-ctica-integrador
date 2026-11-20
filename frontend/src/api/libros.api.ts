import type { EstadoLibro, Libro, Subscription } from "../types";
import { api } from "./client";

// Un libro nuevo todavia no tiene id ni fechas: eso lo pone el backend.
export type LibroNuevo = Omit<Libro, "id" | "createdAt" | "updatedAt">;

export type LibroEditable = Pick<Libro, "title" | "description">;

export const librosApi = {
  listar: () => api.get<Libro[]>("/libros"),
  obtener: (id: number) => api.get<Libro>(`/libros/${id}`),

  crear: (body: LibroNuevo) => api.post<Libro>("/libros", body),
  editar: (id: number, body: LibroEditable) => api.put<Libro>(`/libros/${id}`, body),
  eliminar: (id: number) => api.delete<void>(`/libros/${id}`),

  // Devuelve el libro ya actualizado para que la pagina reemplace el viejo.
  cambiarEstado: (id: number, state: EstadoLibro) =>
    api.patch<Libro>(`/libros/${id}/state`, { state }),

  // RF4 — suscripciones. Estan aca porque la seccion 8.3 de las consignas
  // no lista un api/subscriptions.api.ts separado.
  misSuscripciones: () => api.get<Subscription[]>("/subscriptions"),
  verificarSuscripcion: async (libroId: number) => {
    const suscripciones = await api.get<Subscription[]>("/subscriptions");
    return { suscrito: suscripciones.some((s) => s.libroId === libroId) };
  },
  suscribir: (libroId: number) =>
    api.post<Subscription>("/subscriptions", { libroId }),
  desuscribir: (libroId: number) =>
    api.delete<void>(`/subscriptions/${libroId}`),
};
