import { CreateUserDTO, UpdateUserDTO, UserRawModel, UserResponseDTO } from "../../dtos/user/UserDto.js";

export interface IUserRepository {
    crearUsuario(data: CreateUserDTO): Promise<UserResponseDTO>
    listarUsuarios(): Promise<UserResponseDTO[]>
    listarUsuarioPorID(id: number): Promise<UserRawModel | null>
    buscarUsuarioPorEmail(email: string): Promise<UserRawModel | null>
    editarUsuario(id: number, data: UpdateUserDTO): Promise<void>
    eliminarUsuario(id: number): Promise<void>
}