import { AuthenticatedUserDTO, LoginUserDTO, RegisterUserDTO, UserParser, UserResponseDTO } from "../dtos/user/UserDto.js";
import { comparePassword, hashPassword } from "../helpers/BcryptHelper.js";
import { JWTHandler } from "../helpers/JWTHelper.js";
import { BadRequestError, ConflictError, InternalServerError, NotFoundError, UnauthorizedError } from "../middlewares/errorHandler.js";
import { IRoleRepository } from "../repositories/interfaces/IRoleRepository.js";
import { IUserRepository } from "../repositories/interfaces/IUserRepository.js";

export class AuthService {
    constructor(private userRepository: IUserRepository,
        private roleRepository: IRoleRepository,
        private jwtUtil: JWTHandler,
        private jwtParser: UserParser,
    ) {}

    async register(data: RegisterUserDTO): Promise<UserResponseDTO> {
        const { email, password } = data ?? {}
        if (!email || !password ) {
            throw new BadRequestError("Email y contraseña son obligatorios.")
        }
        const validEmail = email.trim().toLowerCase()
        if (!validEmail.includes("@")) {
            throw new BadRequestError("El email no es válido.")
        }
        if (password.length < 6) {
            throw new BadRequestError("La contraseña debe tener al menos 6 caracteres.")
        }
        const existingUser = await this.userRepository.buscarUsuarioPorEmail(validEmail)
        if (existingUser) {
            throw new ConflictError("Ya existe un usuario con ese email.")
        }
        const defaultRole = await this.roleRepository.buscarRolPorNombre("usuario")
        if (!defaultRole) {
            throw new InternalServerError("No se encontró el rol por defecto.")
        }
        const hashedPassword = await hashPassword(password)
        const user = await this.userRepository.crearUsuario({
            email: validEmail,
            password: hashedPassword,
            roleId: defaultRole.id,
        })
        return { ...user, role: defaultRole.name }
    }

    async login(data: LoginUserDTO): Promise<string> {
        const { email, password } = data ?? {}
        if (!email || !password) {
            throw new BadRequestError("Ingrese sus credenciales")
        }
        const user = await this.userRepository.buscarUsuarioPorEmail(email.trim().toLowerCase())
        if (!user) {
            throw new UnauthorizedError("Credenciales inválidas")
        }
        const validPassword = await comparePassword(password, user.password)
        if (!validPassword) {
            throw new UnauthorizedError("Credenciales inválidas")
        }
        const jwtPayload = this.jwtParser.JWTParser(user)
        const newToken = this.jwtUtil.generateToken(jwtPayload)
        return newToken
    }

    async getAuthenticatedUser(userId: number): Promise<AuthenticatedUserDTO> {
        const user = await this.userRepository.listarUsuarioPorID(userId)
        if (!user) {
            throw new NotFoundError("El usuario no existe")
        }
        const role = user.roleId ? await this.roleRepository.buscarRolPorId(user.roleId) : null
        const permissions = role ? await this.roleRepository.obtenerPermisos(role.id) : []
        return {
            id: user.id,
            email: user.email,
            role: role?.name ?? null,
            permissions,
        }
    }

    async obtenerPermisosDeUsuario(userId: number): Promise<string[]> {
        const user = await this.userRepository.listarUsuarioPorID(userId)
        if (!user) {
            throw new UnauthorizedError("El usuario de la sesión ya no existe")
        }
        if (!user.roleId) return []
        return await this.roleRepository.obtenerPermisos(user.roleId)
    }
}
