import { UserJWTDTO } from "../dtos/user/UserDto.js";

declare global {
    namespace Express {
        interface Request {
            user?: UserJWTDTO
        }
    }
}

export {}
