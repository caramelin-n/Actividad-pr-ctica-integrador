import dotenv from "dotenv"
dotenv.config()

export const DB_HOST = process.env
export const DB_PORT = process.env
export const DB_USER = process.env
export const DB_PASSWORD = process.env
export const DB_NAME = process.env
export const JWT_SECRET = process.env
export const API_PORT = process.env

// Modificar esto cuando se tenga el .env global.