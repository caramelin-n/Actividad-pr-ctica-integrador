import { Notification } from "./Notification.js";
import { Role } from "./Role.js";
import { User } from "./User.js";
import { Libro } from "./Libro.js";
import { Permission } from "./Permission.js";
import { RolePermission } from "./RolePermission.js";
import { Subscription } from "./Subscription.js";

// 1:N - Role/User
Role.hasMany(User, { foreignKey: "roleId" })
User.belongsTo(Role, { foreignKey: "roleId" })

// 1:N - User/Notification
User.hasMany(Notification, { foreignKey: "userId" })
Notification.belongsTo(User, { foreignKey: "userId" })

// N:M - Role/Permission
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "roleId" })
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permissionId" })

// N:M - User/Libro
User.belongsToMany(Libro, { through: Subscription, foreignKey: "userId" })
Libro.belongsToMany(User, { through: Subscription, foreignKey: "libroId"})

export { Notification, Role, User, Libro }