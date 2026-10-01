import { RegisterUserDTO, UserResponseDTO } from "../dtos/user/UserDto.js";
import { hashPassword } from "../helpers/BcryptHelper.js";
import { BadRequestError } from "../middlewares/errorHandler.js";
import { IUserRepository } from "../repositories/interfaces/IUserRepository.js";

export class AuthService {
    constructor(private userRepository: IUserRepository) {}

    async register(data: RegisterUserDTO): Promise<UserResponseDTO> {
        const { email, password } = data
        if (!email || !password ) {
            throw new BadRequestError("Email y contraseña son obligatorios.")
        }
        const validEmail = data.email.trim().toLowerCase()
        const hashedPassword = await hashPassword(password)
        const user = await this.userRepository.crearUsuario({
            email: validEmail,
            password: hashedPassword
        })
        return user
    }
}