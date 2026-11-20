import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { AuthMiddleware } from "../middlewares/authenticate.js";

export const authRoutes = (controller: AuthController, authMiddleware: AuthMiddleware): Router => {
    const router = Router()

    router.post("/register", controller.registerUser)
    router.post("/login", controller.loginUser)
    router.post("/logout", controller.logoutUser)
    router.get("/me", authMiddleware.authenticate, controller.getAuthenticatedUser)

    return router
}
