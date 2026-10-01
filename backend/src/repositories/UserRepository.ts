import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from "../dtos/user/UserDto.js";
import { User } from "../models/User.js";
import { IUserRepository } from "./interfaces/IUserRepository.js";

export class UserRepository implements IUserRepository {

    async crearUsuario(data: CreateUserDTO): Promise<UserResponseDTO> {
        return await User.create(data)
    }

    async listarUsuarioPorID(id: number): Promise<UserResponseDTO | null> {
        return await User.findByPk(id)
    }

    async listarUsuarios(): Promise<UserResponseDTO[]> {
        return await User.findAll({ attributes: { exclude: ["password"]}})
    }

    async editarUsuario(id: number, data: UpdateUserDTO): Promise<void> {
        const updatedUser = await User.findByPk(id, { attributes: { exclude: ["password"]}})
        if (!updatedUser) throw new Error(`No se encontró al usuario ${id}`)
        await updatedUser.update(data)
    }

    async eliminarUsuario(id: number): Promise<void> {
        const user = await User.findByPk(id)
        if (!user) throw new Error(`No se encontró al usuario ${id}`)
        await user.destroy()
    }
}