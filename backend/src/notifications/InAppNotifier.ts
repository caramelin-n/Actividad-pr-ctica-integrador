import { NotificationDTO } from "../dtos/notification/NotificationDto.js";
import { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";
import { INotifier } from "./INotifier.js";

export class InAppNotifier implements INotifier {

    constructor(private notificationRepository: INotificationRepository) {}

    async send(notification: NotificationDTO): Promise<void> {
        await this.notificationRepository.crearNotificacion({
            userId: notification.userId,
            message: notification.message,
        })
    }
}
