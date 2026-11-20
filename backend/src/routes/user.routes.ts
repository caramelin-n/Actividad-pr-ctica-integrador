import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { AuthMiddleware } from "../middlewares/authenticate.js";
import { AuthorizeMiddleware } from "../middlewares/authorize.js";

export const userRoutes = (controller: UserController, authMiddleware: AuthMiddleware, authorizeMiddleware: AuthorizeMiddleware): Router => {
    const router = Router()
    const { authorize } = authorizeMiddleware

    router.use(authMiddleware.authenticate)
    router.get("/", authorize("user:read"), controller.listUsers)
    router.patch("/:id/role", authorize("user:assign-role"), controller.assignRole)

    return router
}
