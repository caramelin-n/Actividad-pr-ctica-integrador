import { Router } from "express"
import { AuthController } from "../controllers/AuthController.js"
import { AuthMiddleware } from "../middlewares/authenticate.js"

export function createAuthRouter(controller: AuthController, auth: AuthMiddleware): Router {
    const router = Router()

    router.post("/register", controller.registerUser)
    router.post("/login", controller.loginUser)
    router.post("/logout", controller.logout)
    router.get("/me", auth.authenticate, controller.getAuthenticatedUser)

    return router
}