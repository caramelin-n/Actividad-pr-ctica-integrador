import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from "sequelize";
import type { User } from "./User.js";
import { DBConnection } from "../database/DatabaseConnection.js";

export type availableStatuses = 'leida' | "no leida"

export class Notification extends Model<InferAttributes<Notification>, InferCreationAttributes<Notification>> {
    declare id: CreationOptional<number>;
    declare status: availableStatuses;
    declare message: string;
    declare userId: ForeignKey<User["id"]>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Notification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        status: {
            type: DataTypes.ENUM("leida", "no leida"),
            allowNull: false,
            defaultValue: "no leida",
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize: DBConnection.getInstance(),
        tableName: "notifications",
        timestamps: true,
    }
)