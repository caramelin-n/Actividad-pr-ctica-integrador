import { availableStatuses } from "../../models/Notification.js"
import { estadosDisponibles } from "../../models/Libro.js"

export interface CreateNotificationDTO {
    userId: number,
    message: string,
}

export interface NotificationResponseDTO {
    id: number,
    userId: number,
    message: string,
    status: availableStatuses,
    createdAt: Date,
}

export interface NotificationDTO {
    userId: number,
    userEmail: string,
    libroId: number,
    libroTitle: string,
    previousState: estadosDisponibles,
    newState: estadosDisponibles,
    message: string,
}
