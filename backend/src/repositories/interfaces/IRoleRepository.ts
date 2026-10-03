import type { Role } from "../../models/Role.js";

export interface IRoleRepository {
    crearRol(rol: Role): Promise<Role>
}

// Esta interfaz no va a tener todos los métodos, ya que tanto esta como permisos se cargan mediante seed.ts.
