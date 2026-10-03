import { Router } from "express"
import { AuthController } from "../controllers/AuthController.js"
import { AuthMiddleware } from "../middlewares/authenticate.js"

export function createAuthRouter(controller: AuthController, auth: AuthMiddleware): Router {
    const router = Router()

    router.post("/auth/register", controller.registerUser)
    router.post("/auth/login", controller.loginUser)
    router.post("/auth/logout", controller.logout)
    router.get("/auth/me", auth.authenticate, controller.getAuthenticatedUser)

    return router
}