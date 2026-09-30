import type { Libro } from "../types";
import { api } from "./client";

export const librosApi = {
  listar: () => api.get<Libro[]>("/libros"),
};
