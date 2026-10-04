import { AuthUserResponseDTO, LoginUserDTO, RegisterUserDTO, UserParser, UserResponseDTO } from "../dtos/user/UserDto.js";
import { hashPassword } from "../helpers/BcryptHelper.js";
import { JWTHandler } from "../helpers/JWTHelper.js";
import { BadRequestError, NotFoundError } from "../middlewares/errorHandler.js";
import { IUserRepository } from "../repositories/interfaces/IUserRepository.js";
import { RoleRepository } from "../repositories/RoleRepository.js";

export class AuthService {
    constructor(private userRepository: IUserRepository,
        private jwtUtil: JWTHandler,
        private jwtParser: UserParser,
        private roleRepository: RoleRepository
    ) {}

    async register(data: RegisterUserDTO): Promise<UserResponseDTO> {
        const { email, password } = data
        if (!email || !password ) {
            throw new BadRequestError("Email y contraseña son obligatorios.")
        }
        const validEmail = data.email.trim().toLowerCase()
        const hashedPassword = await hashPassword(password)
        const defaultRole = await this.roleRepository.obtenerRolPorNombre("usuario")
        if (!defaultRole) {
            throw new NotFoundError("No se encontró el rol.")
        }
        const user = await this.userRepository.crearUsuario({
            email: validEmail,
            password: hashedPassword,
            roleId: defaultRole.id
        })
        return user
    }

    async login(data: LoginUserDTO): Promise<string> {
        const { email, password } = data
        if (!email || !password) {
            throw new BadRequestError("Ingrese sus credenciales")
        }
        const user = await this.userRepository.buscarUsuarioPorEmail(email)
        if (!user) {
            throw new NotFoundError("El usuario no existe")
        }
        const jwtPayload = this.jwtParser.JWTParser(user)
        const newToken = this.jwtUtil.generateToken(jwtPayload)
        return newToken
    }
    
    async getAuthUser(id: number): Promise<AuthUserResponseDTO> {
        const user = await this.userRepository.listarUsuarioPorID(id)
        if (!user) {
            throw new NotFoundError("El usuario no existe")
        }
        const permissions = user.roleId
        ? await this.roleRepository.obtenerPermisos(user.roleId)
        : []
        return { id: user.id, email: user.email, roleId: user.roleId, permissions}
    }

}