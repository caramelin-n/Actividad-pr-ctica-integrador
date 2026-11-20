import { AssignRoleDTO, UserParser, UserResponseDTO } from "../dtos/user/UserDto.js";
import { BadRequestError, NotFoundError } from "../middlewares/errorHandler.js";
import { IRoleRepository } from "../repositories/interfaces/IRoleRepository.js";
import { IUserRepository } from "../repositories/interfaces/IUserRepository.js";

export class UserService {
    constructor(private userRepository: IUserRepository,
        private roleRepository: IRoleRepository,
        private userParser: UserParser,
    ) {}

    async listarUsuarios(): Promise<UserResponseDTO[]> {
        return await this.userRepository.listarUsuarios()
    }

    async asignarRol(userId: number, data: AssignRoleDTO): Promise<UserResponseDTO> {
        const { role } = data ?? {}
        if (!role) {
            throw new BadRequestError("Debe indicar el rol a asignar.")
        }
        const newRole = await this.roleRepository.buscarRolPorNombre(role)
        if (!newRole) {
            throw new BadRequestError(`El rol ${role} no existe.`)
        }
        const user = await this.userRepository.listarUsuarioPorID(userId)
        if (!user) {
            throw new NotFoundError(`No se encontró al usuario ${userId}`)
        }
        await this.userRepository.editarUsuario(userId, { roleId: newRole.id })
        return { ...this.userParser.ResponseParser(user, newRole.name), roleId: newRole.id }
    }
}
