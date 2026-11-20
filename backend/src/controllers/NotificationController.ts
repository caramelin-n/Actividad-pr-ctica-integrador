import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/NotificationService.js";
import { getUserId, parseId } from "../helpers/ParamsHelper.js";

export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    listNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const notifications = await this.notificationService.listarNotificaciones(getUserId(req))
            res.status(200).json(notifications)
        } catch (error) {
            next(error)
        }
    }

    unreadCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const count = await this.notificationService.contarNoLeidas(getUserId(req))
            res.status(200).json({ count })
        } catch (error) {
            next(error)
        }
    }

    markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const notification = await this.notificationService.marcarComoLeida(parseId(req.params.id), getUserId(req))
            res.status(200).json(notification)
        } catch (error) {
            next(error)
        }
    }

    markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.notificationService.marcarTodasComoLeidas(getUserId(req))
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}
