import { RoleResponseDTO } from "../../dtos/role/RoleDto.js";
import type { Role } from "../../models/Role.js";

export interface IRoleRepository {
    crearRol(rol: Role): Promise<Role>
    obtenerRolPorNombre(name: RoleResponseDTO["name"]): Promise<RoleResponseDTO | null>
    obtenerPermisos(roleId: number): Promise<string[]>
}

// Esta interfaz no va a tener todos los métodos, ya que tanto esta como permisos se cargan mediante seed.ts.
