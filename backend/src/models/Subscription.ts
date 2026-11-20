import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes, type NonAttribute } from "sequelize";
import type { Libro } from "./Libro.js";
import type { User } from "./User.js";
import { DBConnection } from "../database/DatabaseConnection.js";

export class Subscription extends Model<InferAttributes<Subscription>, InferCreationAttributes<Subscription>> {
    declare id: CreationOptional<number>;
    declare userId: ForeignKey<User["id"]>;
    declare libroId: ForeignKey<Libro["id"]>;
    declare User?: NonAttribute<User>;
    declare Libro?: NonAttribute<Libro>;
}

Subscription.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
    },
    {
        sequelize: DBConnection.getInstance(),
        tableName: "subscriptions",
        timestamps: true,
    }
)