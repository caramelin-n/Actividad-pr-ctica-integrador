import { User } from "../../models/User.js";

export interface IUserRepository {
    crearUsuario(user: User): Promise<User>
    listarUsuarios(): Promise<User[]>
    editarUsuario(id: number): Promise<User>
    eliminarUsuario(id: number): Promise<User>
}