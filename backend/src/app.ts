import express from "express"
import cookieParser from "cookie-parser"
import { createAuthRouter } from "./routes/auth.routes.js"
import { AuthController } from "./controllers/AuthController.js"
import { AuthService } from "./services/AuthService.js"
import { UserRepository } from "./repositories/UserRepository.js"
import { JWTHandler } from "./helpers/JWTHelper.js"
import { UserParser } from "./dtos/user/UserDto.js"
import { AuthMiddleware } from "./middlewares/authenticate.js"
import { handleError } from "./middlewares/errorHandler.js"
import { RoleRepository } from "./repositories/RoleRepository.js"

const jwtParser = new UserParser()
const jwtHandler = new JWTHandler()
const userRepository = new UserRepository()
const roleRepository = new RoleRepository()
const authService = new AuthService(userRepository, jwtHandler, jwtParser, roleRepository)
const authController = new AuthController(authService)
const authMiddleware = new AuthMiddleware(jwtHandler)

export const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api", createAuthRouter(authController, authMiddleware))
app.use(handleError)