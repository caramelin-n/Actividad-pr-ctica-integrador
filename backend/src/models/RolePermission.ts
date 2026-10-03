import { Role } from "./Role.js";
import { Permission } from "./Permission.js";
import { Model, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { DBConnection } from "../database/DatabaseConnection.js";

export class RolePermission extends Model<InferAttributes<RolePermission>, InferCreationAttributes<RolePermission>> {
    declare roleId: ForeignKey<Role["id"]>;
    declare permissionId: ForeignKey<Permission["id"]>;
}

RolePermission.init(
    {},
    {
        sequelize: DBConnection.getInstance(),
        tableName: "role_permissions",
        timestamps: false,
    }
)