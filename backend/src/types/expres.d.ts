import { UserJWTDTO } from "../dtos/user/UserDto.ts"

declare global {
    namespace Express {
        interface Request {
            user?: UserJWTDTO
        }
    }
}