import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService.js";

export class AuthController {
    constructor(private authService: AuthService) {}

    registerUser = async (req:Request, res:Response, next: NextFunction): Promise<void> => {
        try {
            const newUser = await this.authService.register(req.body)
            res.status(201).json(newUser)
        } catch (error) {
            next(error)
        }
    }
}