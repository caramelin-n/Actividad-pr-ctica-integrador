import { NextFunction, Request, Response } from "express";
import { JWTHandler } from "../helpers/JWTHelper.js";

export class AuthMiddleware {

    constructor(private jwtUtil: JWTHandler) {}
    
    public authenticate = (req: Request, res: Response, next: NextFunction): void => {
        const token = req.cookies.token
        const verifiedToken = this.jwtUtil.verifyToken(token)
        req.user = verifiedToken
    }
}