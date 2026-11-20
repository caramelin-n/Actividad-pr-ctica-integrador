import { Router } from "express";
import { LibroController } from "../controllers/LibroController.js";
import { AuthMiddleware } from "../middlewares/authenticate.js";
import { AuthorizeMiddleware } from "../middlewares/authorize.js";

export const libroRoutes = (controller: LibroController, authMiddleware: AuthMiddleware, authorizeMiddleware: AuthorizeMiddleware): Router => {
    const router = Router()
    const { authorize } = authorizeMiddleware

    router.use(authMiddleware.authenticate)
    router.get("/", authorize("libro:read"), controller.listLibros)
    router.get("/:id", authorize("libro:read"), controller.getLibro)
    router.post("/", authorize("libro:create"), controller.createLibro)
    router.put("/:id", authorize("libro:update"), controller.updateLibro)
    router.patch("/:id/state", authorize("libro:change-status"), controller.changeState)
    router.delete("/:id", authorize("libro:delete"), controller.deleteLibro)

    return router
}
