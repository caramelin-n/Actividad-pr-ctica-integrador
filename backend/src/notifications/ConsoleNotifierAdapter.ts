import { NotificationDTO } from "../dtos/notification/NotificationDto.js";
import { INotifier } from "./INotifier.js";

export class ConsoleNotifierAdapter implements INotifier {

    constructor(private readonly log: (message: string) => void = console.log) {}

    async send(notification: NotificationDTO): Promise<void> {
        const text = `[NOTIFICACIÓN] Para: ${notification.userEmail} | Libro #${notification.libroId} | Estado: ${notification.previousState} → ${notification.newState}`
        this.log(text)
    }
}
