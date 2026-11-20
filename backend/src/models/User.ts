import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, type CreationOptional, type ForeignKey, type NonAttribute } from "sequelize";
import type { Role } from "./Role.js";
import { DBConnection } from "../database/DatabaseConnection.js";

export class User extends Model <InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare email: string;
    declare password: string;
    declare roleId: ForeignKey<Role["id"]>;
    declare Role?: NonAttribute<Role>;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        sequelize: DBConnection.getInstance(),
        tableName: "users",
        timestamps: true,
    }
)