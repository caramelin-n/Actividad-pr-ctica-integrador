import { RoleResponseDTO } from "../../dtos/role/RoleDto.js";
import { rolesDisponibles } from "../../models/Role.js";

export interface IRoleRepository {
    crearRol(name: rolesDisponibles): Promise<RoleResponseDTO>
    buscarRolPorNombre(name: string): Promise<RoleResponseDTO | null>
    buscarRolPorId(id: number): Promise<RoleResponseDTO | null>
    obtenerPermisos(roleId: number): Promise<string[]>
}
