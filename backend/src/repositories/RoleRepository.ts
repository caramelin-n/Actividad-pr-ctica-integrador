import { RoleResponseDTO } from "../dtos/role/RoleDto.js";
import { Permission } from "../models/Permission.js";
import { Role } from "../models/Role.js";
import { IRoleRepository } from "./interfaces/IRoleRepository.js";

export class RoleRepository implements IRoleRepository {

    async crearRol(rol: Role): Promise<Role> {
        return await Role.create(rol)
    }

    async obtenerRolPorNombre(name: RoleResponseDTO["name"]): Promise<RoleResponseDTO | null> {
        const rol = await Role.findOne({ where: { name: name }})
        return rol ? { id: rol.id, name: rol.name } : null
    }

    async obtenerPermisos(roleId: number): Promise<string[]> {
        const permisos = await Permission.findAll({
            attributes: ["permissionName"],
            include: [{
                model: Role,
                where: { id: roleId},
                attributes: [],
                through: { attributes: []}
            }]
        })
        return permisos.map((p) => p.permissionName)
    }
}