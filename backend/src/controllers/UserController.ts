import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService.js";
import { parseId } from "../helpers/ParamsHelper.js";

export class UserController {
    constructor(private userService: UserService) {}

    listUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await this.userService.listarUsuarios()
            res.status(200).json(users)
        } catch (error) {
            next(error)
        }
    }

    assignRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseId(req.params.id)
            const user = await this.userService.asignarRol(id, req.body)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }
}
