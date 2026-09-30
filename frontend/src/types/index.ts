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
  nombre: string;
  rol: Rol;
  permisos: Permiso[];
}

export type EstadoLibro = "DISPONIBLE" | "PRESTADO" | "EN_REPARACION";

export interface Libro {
  id: number;
  titulo: string;
  descripcion: string;
  estado: EstadoLibro;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  libroId: number;
  mensaje: string;
  leida: boolean;
  createdAt: string;
}
