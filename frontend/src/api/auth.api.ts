import type { User } from "../types";
import { api } from "./client";

export const authApi = {
  login: (email: string, password: string) =>
    api.post<User>("/auth/login", { email, password }),

  registrar: (nombre: string, email: string, password: string) =>
    api.post<User>("/auth/register", { nombre, email, password }),

  // Se llama al montar la app para recuperar la sesion. Con cookie httpOnly
  // el frontend no puede leerla, tiene que preguntarle al backend.
  sesion: () => api.get<User>("/auth/me"),

  logout: () => api.post<void>("/auth/logout"),
};
