import { CreateNotificationDTO, NotificationResponseDTO } from "../../dtos/notification/NotificationDto.js"
import { availableStatuses } from "../../models/Notification.js"

export interface INotificationRepository {
    crearNotificacion(data: CreateNotificationDTO): Promise<NotificationResponseDTO>
    listarNotificaciones(userId: number): Promise<NotificationResponseDTO[]>
    contarNoLeidas(userId: number): Promise<number>
    cambiarEstado(id: number, userId: number, nuevoEstado: availableStatuses): Promise<NotificationResponseDTO | null>
    marcarTodasComoLeidas(userId: number): Promise<void>
}
