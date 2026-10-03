import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env.js";
import { UserJWTDTO } from "../dtos/user/UserDto.js";

export class JWTHandler {

    constructor(private readonly JWT_KEY = JWT_SECRET) {}
    
    public generateToken(payload: UserJWTDTO): string {
        const token = jwt.sign(payload, this.JWT_KEY, { expiresIn: "1h"})
        return token
    }

    public verifyToken(token: string): UserJWTDTO | null {
        try {
            const decoded = jwt.verify(token, this.JWT_KEY) as UserJWTDTO
            return decoded
        } catch (error) {
            return null
        }
    }
}