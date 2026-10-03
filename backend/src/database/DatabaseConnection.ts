import { Sequelize } from "sequelize";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "../config/env.js";

export class DBConnection {

    private static instance: Sequelize

    private constructor() {}

    static getInstance(): Sequelize {
        if (!DBConnection.instance) {
            DBConnection.instance = new Sequelize({
                dialect: "postgres",
                host: DB_HOST,
                port: DB_PORT,
                username: DB_USER,
                password: DB_PASSWORD,
                database: DB_NAME,
            })
        }
        return DBConnection.instance
    }

    static async connect(): Promise<void> {
        await DBConnection.getInstance().authenticate()
    }
}