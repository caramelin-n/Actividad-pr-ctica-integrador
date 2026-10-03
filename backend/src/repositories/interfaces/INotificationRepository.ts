import { Notification } from "../../models/Notification.js"

export interface INotificationRepository {
    crearNotificacion(notificacion: Notification): Promise<Notification>
    listarNotificaciones(): Promise<Notification[]>
    cambiarEstado(id: number, nuevoEstado: string): Promise<Notification>
}