import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, type CreationOptional, type NonAttribute } from "sequelize";
import type { Permission } from "./Permission.js";
import { DBConnection } from "../database/DatabaseConnection.js";

export const ROLES = ['admin', 'operador', 'usuario'] as const
export type rolesDisponibles = typeof ROLES[number]

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
    declare id: CreationOptional<number>;
    declare name: rolesDisponibles;
    declare Permissions?: NonAttribute<Permission[]>;
}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.ENUM(...ROLES),
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize: DBConnection.getInstance(),
        tableName: "roles",
        timestamps: false,
    },
)