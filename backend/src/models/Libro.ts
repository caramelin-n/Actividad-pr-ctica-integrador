import { Model, DataTypes, type InferAttributes, type InferCreationAttributes,type CreationOptional } from "sequelize";
import { DBConnection } from "../database/DatabaseConnection.js";

type estadosDisponibles = 'DISPONIBLE' | 'PRESTADO' | 'EN_REPARACION'

export class Libro extends Model <InferAttributes<Libro>, InferCreationAttributes<Libro>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare description: string;
    declare state: estadosDisponibles;
    declare createdAt: Date;
    declare updatedAt: Date;
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
            type: DataTypes.ENUM("DISPONIBLE", "PRESTADO", "EN REPARACION"),
            allowNull: false,
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
