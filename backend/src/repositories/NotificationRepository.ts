import { CreateNotificationDTO, NotificationResponseDTO } from "../dtos/notification/NotificationDto.js";
import { Notification } from "../models/Relations.js";
import { availableStatuses } from "../models/Notification.js";
import { INotificationRepository } from "./interfaces/INotificationRepository.js";

export class NotificationRepository implements INotificationRepository {

    private toResponse(notification: Notification): NotificationResponseDTO {
        return {
            id: notification.id,
            userId: notification.userId,
            message: notification.message,
            status: notification.status,
            createdAt: notification.createdAt,
        }
    }

    async crearNotificacion(data: CreateNotificationDTO): Promise<NotificationResponseDTO> {
        const notification = await Notification.create({ ...data, status: "no leida" })
        return this.toResponse(notification)
    }

    async listarNotificaciones(userId: number): Promise<NotificationResponseDTO[]> {
        const notifications = await Notification.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
        })
        return notifications.map(notification => this.toResponse(notification))
    }

    async contarNoLeidas(userId: number): Promise<number> {
        return await Notification.count({ where: { userId, status: "no leida" } })
    }

    async cambiarEstado(id: number, userId: number, nuevoEstado: availableStatuses): Promise<NotificationResponseDTO | null> {
        const notification = await Notification.findOne({ where: { id, userId } })
        if (!notification) return null
        await notification.update({ status: nuevoEstado })
        return this.toResponse(notification)
    }

    async marcarTodasComoLeidas(userId: number): Promise<void> {
        await Notification.update({ status: "leida" }, { where: { userId, status: "no leida" } })
    }
}
