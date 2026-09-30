import { User } from "../models/User.js";
import type { IUserRepository } from "./interfaces/IUserRepository.js";

export class UserRepository implements IUserRepository {
    
    async crearUsuario(user: User): Promise<User> {
        return User.create(user)
    }

    async listarUsuarios(): Promise<User[]> {
        return User.findAll()
    }

    async listarUsuarioPorID(id: number): Promise<User | null> {
        return User.findByPk(id)
    }

    async editarUsuario(id: number, user: User): Promise<void> {
        const updatedUser = await this.listarUsuarioPorID(id)
        if 
    }
}