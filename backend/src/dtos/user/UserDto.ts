export interface UserRawModel {
    id: number,
    email: string,
    password: string,
    roleId: number
}

export interface CreateUserDTO {
    email: string,
    password: string,
    roleId?: number,
}

export type UpdateUserDTO = Partial<CreateUserDTO>

export interface UserResponseDTO {
    id: number,
    email: string,
    roleId: number | null
}

export interface RegisterUserDTO {
    email: string,
    password: string,
}

export interface UserJWTDTO {
    id: number,
    email: string,
    roleId: number,
}

export interface LoginUserDTO {
    id: number,
    email: string,
    password: string,
}

export class UserParser {

    public JWTParser(user: UserRawModel): UserJWTDTO {
        return {
            id: user.id,
            email: user.email,
            roleId: user.roleId,
        }
    }
}