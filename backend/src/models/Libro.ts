import { Model, DataTypes, type InferAttributes, type InferCreationAttributes,type CreationOptional } from "sequelize";
import { DBConnection } from "../database/DatabaseConnection.js";

export const ESTADOS_LIBRO = ['DISPONIBLE', 'PRESTADO', 'EN_REPARACION'] as const
export type estadosDisponibles = typeof ESTADOS_LIBRO[number]

export class Libro extends Model <InferAttributes<Libro>, InferCreationAttributes<Libro>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare description: string;
    declare state: CreationOptional<estadosDisponibles>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Libro.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        state: {
            type: DataTypes.ENUM(...ESTADOS_LIBRO),
            allowNull: false,
            defaultValue: "DISPONIBLE",
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize: DBConnection.getInstance(),
        tableName: "libros",
        timestamps: true
    }
)
