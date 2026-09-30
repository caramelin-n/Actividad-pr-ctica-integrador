import dotenv from "dotenv"
dotenv.config()

const envValidation = (variable: string): string => {
    const value = process.env[variable]
    if (!value) throw new Error(`Falta una variable de entorno: ${variable}`)
    return value
}

export const DB_HOST = envValidation("DB_HOST")
export const DB_PORT = Number(envValidation("DB_PORT"))
export const DB_USER = envValidation("POSTGRES_USER")
export const DB_PASSWORD = envValidation("POSTGRES_PASSWORD")
export const DB_NAME = envValidation("POSTGRES_DB")
export const JWT_SECRET = envValidation("JWT_SECRET")
export const API_PORT = envValidation("API_PORT")