import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from "../../dtos/user/UserDto.js";

export interface IUserRepository {
    crearUsuario(data: CreateUserDTO): Promise<UserResponseDTO>
    listarUsuarios(): Promise<UserResponseDTO[]>
    listarUsuarioPorID(id: number): Promise<UserResponseDTO | null>
    editarUsuario(id: number, data: UpdateUserDTO): Promise<void>
    eliminarUsuario(id: number): Promise<void>
}