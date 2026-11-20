import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";
import { ForbiddenError, UnauthorizedError } from "./errorHandler.js";

export class AuthorizeMiddleware {

    constructor(private authService: AuthService) {}

    public authorize = (permission: string) => {
        return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
            try {
                if (!req.user) {
                    throw new UnauthorizedError("No autenticado")
                }
                const permissions = await this.authService.obtenerPermisosDeUsuario(req.user.id)
                if (!permissions.includes(permission)) {
                    throw new ForbiddenError(`No tenés el permiso ${permission}`)
                }
                next()
            } catch (error) {
                next(error)
            }
        }
    }
}
