import { Request, Response } from "express";

export class UserController {

    constructor(userService: UserService) {}
    
    crearUsuario = async(req: Request, res: Response): Promise<void> => {
        const user = await 
    }
}