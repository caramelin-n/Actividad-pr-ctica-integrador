import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { DBConnection } from "../database/DatabaseConnection.js";

export class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
    declare id: CreationOptional<number>;
    declare permissionName: string;
}

Permission.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        permissionName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    },
    {
        sequelize: DBConnection.getInstance(),
        tableName: "permissions",
        timestamps: true,
    }
)