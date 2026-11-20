// Tipos compartidos entre la API y los componentes.
// La idea es que el backend y el frontend hablen el mismo idioma:
// si aca cambia un nombre, hay que cambiarlo del otro lado tambien.

export type Rol = "admin" | "operador" | "usuario";

// Permisos con el formato "recurso:accion" (seccion 4 de las consignas).
// Se deja como string y no como union de literales para poder agregar
// permisos nuevos desde el seed sin tocar el frontend.
export type Permiso = string;

export interface User {
  id: number;
  email: string;
  role: Rol | null;
  permissions: Permiso[];
}

export interface UserListItem {
  id: number;
  email: string;
  roleId: number | null;
  role: Rol | null;
}

export type EstadoLibro = "DISPONIBLE" | "PRESTADO" | "EN_REPARACION";

export const ESTADOS_LIBRO: EstadoLibro[] = ["DISPONIBLE", "PRESTADO", "EN_REPARACION"];

export interface Libro {
  id: number;
  title: string;
  description: string;
  state: EstadoLibro;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: number;
  userId: number;
  libroId: number;
  libroTitle?: string;
}

export type EstadoNotificacion = "leida" | "no leida";

export interface Notification {
  id: number;
  userId: number;
  message: string;
  status: EstadoNotificacion;
  createdAt: string;
}
