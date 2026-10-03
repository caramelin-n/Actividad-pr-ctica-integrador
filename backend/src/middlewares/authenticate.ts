import { NextFunction, Request, Response } from "express";
import { JWTHandler } from "../helpers/JWTHelper.js";

export class AuthMiddleware {

    constructor(private jwtUtil: JWTHandler) {}
    
    public authenticate = (req: Request, res: Response, next: NextFunction): void => {
        const token = req.cookies?.token
        if (!token) {
            res.status(401).json("No autenticado")
            return
        }
        const verifiedToken = this.jwtUtil.verifyToken(token)
        if (!verifiedToken) {
            res.status(401).json("Token no válido o expirado")
            return
        }
        req.user = verifiedToken
        next()
    }
}