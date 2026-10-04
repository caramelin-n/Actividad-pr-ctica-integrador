import { DBConnection } from "./DatabaseConnection.js"
import { hashPassword } from "../helpers/BcryptHelper.js"
import { Role } from "../models/Role.js"
import { Permission } from "../models/Permission.js"
import { RolePermission } from "../models/RolePermission.js"
import { User } from "../models/User.js"

const PERMISOS_POR_ROL = {
    admin: [
        "libro:read", "libro:create", "libro:update", "libro:change-status", "libro:delete",
        "subscription:create", "subscription:delete",
        "notification:read",
        "user:read", "user:assign-role",
    ],
    operador: [
        "libro:read", "libro:create", "libro:update", "libro:change-status",
        "subscription:create", "subscription:delete",
        "notification:read",
    ],
    usuario: [
        "libro:read",
        "subscription:create", "subscription:delete",
        "notification:read",
    ],
} as const

const USUARIOS_DE_PRUEBA: { email: string; password: string; rol: Role["name"] }[] = [
    { email: "admin@test.com", password: "admin1234", rol: "admin" },
    { email: "operador@test.com", password: "operador1234", rol: "operador" },
    { email: "usuario@test.com", password: "usuario1234", rol: "usuario" },
]

export async function runSeed(): Promise<void> {
    await DBConnection.getInstance().transaction(async (transaction) => {
        // 1. Permisos
        const nombresPermisos = [...new Set(Object.values(PERMISOS_POR_ROL).flat())]
        const permisos = new Map<string, Permission>()
        for (const permissionName of nombresPermisos) {
            const [permiso] = await Permission.findOrCreate({ where: { permissionName }, transaction })
            permisos.set(permissionName, permiso)
        }

        // 2. Roles y sus vínculos con los permisos
        const roles = new Map<Role["name"], Role>()
        for (const nombreRol of Object.keys(PERMISOS_POR_ROL) as Role["name"][]) {
            const [rol] = await Role.findOrCreate({ where: { name: nombreRol }, transaction })
            roles.set(nombreRol, rol)

            for (const nombre of PERMISOS_POR_ROL[nombreRol]) {
                await RolePermission.findOrCreate({
                    where: { roleId: rol.id, permissionId: permisos.get(nombre)!.id },
                    transaction,
                })
            }
        }

        // 3. Usuarios de prueba (solo si no existen, para no hashear en cada arranque)
        for (const { email, password, rol } of USUARIOS_DE_PRUEBA) {
            const existente = await User.findOne({ where: { email }, transaction })
            if (existente) continue
            await User.create(
                { email, password: await hashPassword(password), roleId: roles.get(rol)!.id },
                { transaction },
            )
        }
    })
}