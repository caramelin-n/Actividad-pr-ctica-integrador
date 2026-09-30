import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, type CreationOptional, type ForeignKey} from "sequelize";
import { Role } from "./Role.js";
import { DBConnection } from "../database/DatabaseConnection.js";

export class User extends Model <InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare email: string;
    declare password: string;
    declare roleId: ForeignKey<Role["id"]>;
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