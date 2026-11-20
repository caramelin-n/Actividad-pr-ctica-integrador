import type { EstadoLibro, Libro } from "../types";
import { api } from "./client";

// Un libro nuevo todavia no tiene id ni fechas: eso lo pone el backend.
export type LibroNuevo = Omit<Libro, "id" | "createdAt" | "updatedAt">;

export const librosApi = {
  listar: () => api.get<Libro[]>("/libros"),
  obtener: (id: number) => api.get<Libro>(`/libros/${id}`),

  crear: (body: LibroNuevo) => api.post<Libro>("/libros", body),

  // Devuelve el libro ya actualizado para que la pagina reemplace el viejo.
  cambiarEstado: (id: number, estado: EstadoLibro) =>
    api.patch<Libro>(`/libros/${id}`, { estado }),

  // RF4 — suscripciones. Estan aca porque la seccion 8.3 de las consignas
  // no lista un api/subscriptions.api.ts separado.
  verificarSuscripcion: (libroId: number) =>
    api.get<{ suscrito: boolean }>(`/suscripciones/libros/${libroId}`),
  suscribir: (libroId: number) =>
    api.post<void>(`/suscripciones/libros/${libroId}`),
  desuscribir: (libroId: number) =>
    api.delete<void>(`/suscripciones/libros/${libroId}`),
};
