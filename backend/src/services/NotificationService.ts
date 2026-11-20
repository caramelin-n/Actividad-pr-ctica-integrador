import { LibroStateChangedEvent } from "../dtos/libro/LibroDto.js";
import { NotificationDTO, NotificationResponseDTO } from "../dtos/notification/NotificationDto.js";
import { NotFoundError } from "../middlewares/errorHandler.js";
import { NotifierFactory, NotifierType } from "../notifications/NotifierFactory.js";
import { IObserver } from "../observer/IObserver.js";
import { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";
import { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository.js";

export class NotificationService implements IObserver<LibroStateChangedEvent> {
    constructor(private subscriptionRepository: ISubscriptionRepository,
        private notificationRepository: INotificationRepository,
        private notifierFactory: NotifierFactory,
        private channels: NotifierType[],
    ) {}

    async update(event: LibroStateChangedEvent): Promise<void> {
        const subscribers = await this.subscriptionRepository.listarSuscriptoresPorLibro(event.libroId)
        if (subscribers.length === 0) return
        const notifiers = this.channels.map(channel => this.notifierFactory.create(channel))
        const message = `El libro "${event.libroTitle}" (#${event.libroId}) cambió de estado: ${event.previousState} → ${event.newState}`

        await Promise.all(subscribers.flatMap(subscriber => {
            const notification: NotificationDTO = {
                userId: subscriber.userId,
                userEmail: subscriber.email,
                libroId: event.libroId,
                libroTitle: event.libroTitle,
                previousState: event.previousState,
                newState: event.newState,
                message,
            }
            return notifiers.map(notifier => notifier.send(notification))
        }))
    }

    async listarNotificaciones(userId: number): Promise<NotificationResponseDTO[]> {
        return await this.notificationRepository.listarNotificaciones(userId)
    }

    async contarNoLeidas(userId: number): Promise<number> {
        return await this.notificationRepository.contarNoLeidas(userId)
    }

    async marcarComoLeida(id: number, userId: number): Promise<NotificationResponseDTO> {
        const notification = await this.notificationRepository.cambiarEstado(id, userId, "leida")
        if (!notification) {
            throw new NotFoundError(`No se encontró la notificación ${id}`)
        }
        return notification
    }

    async marcarTodasComoLeidas(userId: number): Promise<void> {
        await this.notificationRepository.marcarTodasComoLeidas(userId)
    }
}
