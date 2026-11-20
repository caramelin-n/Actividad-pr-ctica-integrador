import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController.js";
import { AuthMiddleware } from "../middlewares/authenticate.js";
import { AuthorizeMiddleware } from "../middlewares/authorize.js";

export const notificationRoutes = (controller: NotificationController, authMiddleware: AuthMiddleware, authorizeMiddleware: AuthorizeMiddleware): Router => {
    const router = Router()
    const { authorize } = authorizeMiddleware

    router.use(authMiddleware.authenticate)
    router.use(authorize("notification:read"))
    router.get("/", controller.listNotifications)
    router.get("/unread-count", controller.unreadCount)
    router.patch("/read-all", controller.markAllAsRead)
    router.patch("/:id/read", controller.markAsRead)

    return router
}
