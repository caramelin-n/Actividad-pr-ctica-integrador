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