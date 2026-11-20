import { NextFunction, Request, Response } from "express";
import { JWTHandler } from "../helpers/JWTHelper.js";
import { UnauthorizedError } from "./errorHandler.js";

export class AuthMiddleware {

    constructor(private jwtUtil: JWTHandler) {}

    private getToken(req: Request): string | null {
        const header = req.headers.authorization
        if (header && header.startsWith("Bearer ")) {
            return header.slice(7)
        }
        const cookies = req.headers.cookie
        if (!cookies) return null
        const tokenCookie = cookies
            .split(";")
            .map(cookie => cookie.trim())
            .find(cookie => cookie.startsWith("token="))
        return tokenCookie ? decodeURIComponent(tokenCookie.slice(6)) : null
    }

    public authenticate = (req: Request, _res: Response, next: NextFunction): void => {
        const token = this.getToken(req)
        if (!token) {
            return next(new UnauthorizedError("No se encontró un token de sesión"))
        }
        const verifiedToken = this.jwtUtil.verifyToken(token)
        if (!verifiedToken) {
            return next(new UnauthorizedError("Token inválido o expirado"))
        }
        req.user = verifiedToken
        next()
    }
}
