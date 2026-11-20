import { CreateUserDTO, UpdateUserDTO, UserRawModel, UserResponseDTO } from "../dtos/user/UserDto.js";
import { User, Role } from "../models/Relations.js";
import { NotFoundError } from "../middlewares/errorHandler.js";
import { IUserRepository } from "./interfaces/IUserRepository.js";

export class UserRepository implements IUserRepository {

    async crearUsuario(data: CreateUserDTO): Promise<UserResponseDTO> {
        const user = await User.create(data)
        return {
            id: user.id,
            email: user.email,
            roleId: user.roleId ?? null,
        }
    }

    async listarUsuarioPorID(id: number): Promise<UserRawModel | null> {
        return await User.findByPk(id)
    }

    async listarUsuarios(): Promise<UserResponseDTO[]> {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            include: [{ model: Role, attributes: ["name"] }],
            order: [["id", "ASC"]],
        })
        return users.map(user => ({
            id: user.id,
            email: user.email,
            roleId: user.roleId ?? null,
            role: user.Role?.name ?? null,
        }))
    }

    async editarUsuario(id: number, data: UpdateUserDTO): Promise<void> {
        const updatedUser = await User.findByPk(id, { attributes: { exclude: ["password"]}})
        if (!updatedUser) throw new NotFoundError(`No se encontró al usuario ${id}`)
        await updatedUser.update(data)
    }

    async eliminarUsuario(id: number): Promise<void> {
        const user = await User.findByPk(id)
        if (!user) throw new NotFoundError(`No se encontró al usuario ${id}`)
        await user.destroy()
    }

    async buscarUsuarioPorEmail(email: string): Promise<UserRawModel | null> {
        return await User.findOne({ where: { email: email } })
    }
}
