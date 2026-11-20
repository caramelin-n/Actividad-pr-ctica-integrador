import { Request } from "express";
import { BadRequestError, UnauthorizedError } from "../middlewares/errorHandler.js";

export const parseId = (value: unknown, field: string = "id"): number => {
    const id = Number(value)
    if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestError(`El parámetro ${field} debe ser un número entero positivo`)
    }
    return id
}

export const getUserId = (req: Request): number => {
    if (!req.user) {
        throw new UnauthorizedError("No autenticado")
    }
    return req.user.id
}
