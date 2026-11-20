import { Router } from "express";
import { SubscriptionController } from "../controllers/SubscriptionController.js";
import { AuthMiddleware } from "../middlewares/authenticate.js";
import { AuthorizeMiddleware } from "../middlewares/authorize.js";

export const subscriptionRoutes = (controller: SubscriptionController, authMiddleware: AuthMiddleware, authorizeMiddleware: AuthorizeMiddleware): Router => {
    const router = Router()
    const { authorize } = authorizeMiddleware

    router.use(authMiddleware.authenticate)
    router.get("/", authorize("libro:read"), controller.listMySubscriptions)
    router.post("/", authorize("subscription:create"), controller.subscribe)
    router.delete("/:libroId", authorize("subscription:delete"), controller.unsubscribe)

    return router
}
