import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService.js";
import { getUserId } from "../helpers/ParamsHelper.js";

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

    loginUser = async (req:Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = await this.authService.login(req.body)
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 60*60*1000
            })
            res.status(200).json({ message: "Sesión iniciada con éxito", token })
        } catch (error) {
            next(error)
        }
    }

    logoutUser = async (_req:Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.clearCookie("token", { httpOnly: true, sameSite: "lax" })
            res.status(200).json({ message: "Sesión cerrada con éxito" })
        } catch (error) {
            next(error)
        }
    }

    getAuthenticatedUser = async (req:Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await this.authService.getAuthenticatedUser(getUserId(req))
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }
}
