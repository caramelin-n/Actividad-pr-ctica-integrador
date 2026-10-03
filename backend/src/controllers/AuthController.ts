import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService.js";
import { NotFoundError } from "../middlewares/errorHandler.js";

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
            const authUserId = req.user?.id
            if (authUserId === undefined) {
                throw new NotFoundError("No hay usuario autenticado")
            }
            const currentUser = await this.authService.getAuthUser(authUserId)
            res.status(200).json(currentUser)
        } catch (error) {
            next(error)
        }
    }

    logout = async (req:Request, res: Response) => {
        res.clearCookie("token")
        res.status(200).json("Sesión cerrada con éxito")
    }
}