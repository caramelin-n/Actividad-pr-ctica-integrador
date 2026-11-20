import { RoleResponseDTO } from "../dtos/role/RoleDto.js";
import { Permission, Role } from "../models/Relations.js";
import { ROLES, rolesDisponibles } from "../models/Role.js";
import { IRoleRepository } from "./interfaces/IRoleRepository.js";

export class RoleRepository implements IRoleRepository {

    async crearRol(name: rolesDisponibles): Promise<RoleResponseDTO> {
        const [role] = await Role.findOrCreate({ where: { name } })
        return { id: role.id, name: role.name }
    }

    async buscarRolPorNombre(name: string): Promise<RoleResponseDTO | null> {
        if (!(ROLES as readonly string[]).includes(name)) return null
        const role = await Role.findOne({ where: { name } })
        if (!role) return null
        return { id: role.id, name: role.name }
    }

    async buscarRolPorId(id: number): Promise<RoleResponseDTO | null> {
        const role = await Role.findByPk(id)
        if (!role) return null
        return { id: role.id, name: role.name }
    }

    async obtenerPermisos(roleId: number): Promise<string[]> {
        const role = await Role.findByPk(roleId, {
            include: [{ model: Permission, attributes: ["permissionName"], through: { attributes: [] } }],
        })
        if (!role || !role.Permissions) return []
        return role.Permissions.map(permission => permission.permissionName)
    }
}
