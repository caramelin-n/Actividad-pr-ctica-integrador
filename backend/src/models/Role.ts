import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, type CreationOptional } from "sequelize";
import { DBConnection } from "../database/DatabaseConnection.js";

type rolesDisponibles = 'admin' | 'operador' | 'usuario'

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
    declare id: CreationOptional<number>;
    declare name: rolesDisponibles;
}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.ENUM('admin', 'operador', 'usuario'),
            allowNull: false,
        },
    },
    {
        sequelize: DBConnection.getInstance(),
        tableName: "roles",
        timestamps: false,
    },
)