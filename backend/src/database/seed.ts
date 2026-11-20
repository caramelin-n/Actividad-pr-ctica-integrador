import { hashPassword } from "../helpers/BcryptHelper.js";
import { Libro, Permission, Role, RolePermission, User } from "../models/Relations.js";
import { rolesDisponibles } from "../models/Role.js";

const PERMISSIONS_BY_ROLE: Record<rolesDisponibles, string[]> = {
    admin: [
        "libro:read", "libro:create", "libro:update", "libro:change-status", "libro:delete",
        "subscription:create", "subscription:delete", "notification:read",
        "user:read", "user:assign-role",
    ],
    operador: [
        "libro:read", "libro:create", "libro:update", "libro:change-status",
        "subscription:create", "subscription:delete", "notification:read",
    ],
    usuario: [
        "libro:read", "subscription:create", "subscription:delete", "notification:read",
    ],
}

const TEST_USERS: { email: string, password: string, role: rolesDisponibles }[] = [
    { email: "admin@tp.com", password: "admin123", role: "admin" },
    { email: "operador@tp.com", password: "operador123", role: "operador" },
    { email: "usuario@tp.com", password: "usuario123", role: "usuario" },
]

const TEST_LIBROS = [
    { title: "Clean Code", description: "Manual de buenas prácticas para escribir código mantenible." },
    { title: "Design Patterns", description: "Los 23 patrones de diseño del Gang of Four." },
    { title: "El Principito", description: "Novela corta de Antoine de Saint-Exupéry." },
]

export const runSeed = async (): Promise<void> => {
    const allPermissions = [...new Set(Object.values(PERMISSIONS_BY_ROLE).flat())]
    const permissionIds = new Map<string, number>()
    for (const permissionName of allPermissions) {
        const [permission] = await Permission.findOrCreate({ where: { permissionName } })
        permissionIds.set(permissionName, permission.id)
    }

    const roleIds = new Map<rolesDisponibles, number>()
    for (const [roleName, permissions] of Object.entries(PERMISSIONS_BY_ROLE) as [rolesDisponibles, string[]][]) {
        const [role] = await Role.findOrCreate({ where: { name: roleName } })
        roleIds.set(roleName, role.id)
        for (const permissionName of permissions) {
            const permissionId = permissionIds.get(permissionName)
            if (!permissionId) continue
            await RolePermission.findOrCreate({ where: { roleId: role.id, permissionId } })
        }
    }

    for (const testUser of TEST_USERS) {
        const existing = await User.findOne({ where: { email: testUser.email } })
        if (existing) continue
        const roleId = roleIds.get(testUser.role)
        if (!roleId) continue
        await User.create({
            email: testUser.email,
            password: await hashPassword(testUser.password),
            roleId,
        })
    }

    if (await Libro.count() === 0) {
        await Libro.bulkCreate(TEST_LIBROS.map(libro => ({ ...libro, state: "DISPONIBLE" as const })))
    }

    console.log("Seed ejecutado correctamente")
}
