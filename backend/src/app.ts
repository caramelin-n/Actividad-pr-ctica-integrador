import express, { Express, Router } from "express";
import cors from "cors";
import { handleError, NotFoundError } from "./middlewares/errorHandler.js";

export interface AppRouters {
    auth: Router,
    users: Router,
    libros: Router,
    subscriptions: Router,
    notifications: Router,
}

export const createApp = (routers: AppRouters): Express => {
    const app = express()

    app.use(cors({ origin: true, credentials: true }))
    app.use(express.json())

    app.get("/api/health", (_req, res) => {
        res.status(200).json({ status: "ok" })
    })

    app.use("/api/auth", routers.auth)
    app.use("/api/users", routers.users)
    app.use("/api/libros", routers.libros)
    app.use("/api/subscriptions", routers.subscriptions)
    app.use("/api/notifications", routers.notifications)

    app.use((_req, _res, next) => {
        next(new NotFoundError("Ruta no encontrada"))
    })
    app.use(handleError)

    return app
}
