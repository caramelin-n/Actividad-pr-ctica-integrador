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

    loginUser = async (req:Request, res: Response, next: NextFunction) => {
        try {
            const token = await this.authService.login(req.body)
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 60*60*1000
            })
            res.status(200).json("Sesión iniciada con éxito")
        } catch (error) {
            next(error)
        }
    }

    getAuthenticatedUser = async (req:Request, res: Response, next: NextFunction) => {
        try {
            
        } catch (error) {
            
        }
    }
}