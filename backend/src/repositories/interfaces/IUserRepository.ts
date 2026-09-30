import { User } from "../../models/User.js";



export interface IUserRepository {
    crearUsuario(user: User): Promise<User>
    listarUsuarios(): Promise<User[]>
    listarUsuarioPorID(id: number): Promise<User | null>
    editarUsuario(id: number): Promise<void>
    eliminarUsuario(id: number): Promise<User>
}