import dotenv from "dotenv"
dotenv.config()

export const DB_HOST = process.env.DB_HOST
export const DB_PORT = process.env.DB_PORT
export const DB_USER = process.env.POSTGRES_USER
export const DB_PASSWORD = process.env.POSTGRES_PASSWORD
export const DB_NAME = process.env.POSTGRES_DB
export const JWT_SECRET = process.env.JWT_SECRET
export const API_PORT = process.env.API_PORT

// Estas variables deben pasar por validaciones:
// Por ejemplo, si llegan como undefined, devolver un error y que no conecte a la base de datos.
// Se modificará según el tiempo disponible, por ahora, solo se definen.