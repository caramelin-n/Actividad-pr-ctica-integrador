import { NotificationDTO } from "../dtos/notification/NotificationDto.js";

export interface INotifier {
    send(notification: NotificationDTO): Promise<void>
}
