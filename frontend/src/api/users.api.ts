import type { Rol, UserListItem } from "../types";
import { api } from "./client";

export const usersApi = {
  listar: () => api.get<UserListItem[]>("/users"),
  asignarRol: (id: number, role: Rol) =>
    api.patch<UserListItem>(`/users/${id}/role`, { role }),
};
