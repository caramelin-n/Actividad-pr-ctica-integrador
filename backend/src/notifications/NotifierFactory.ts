import { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";
import { ConsoleNotifierAdapter } from "./ConsoleNotifierAdapter.js";
import { InAppNotifier } from "./InAppNotifier.js";
import { INotifier } from "./INotifier.js";

export type NotifierType = 'inapp' | 'console'

export class NotifierFactory {

    constructor(private notificationRepository: INotificationRepository) {}

    create(type: NotifierType): INotifier {
        switch (type) {
            case 'inapp':
                return new InAppNotifier(this.notificationRepository)
            case 'console':
                return new ConsoleNotifierAdapter()
            default:
                throw new Error(`Canal de notificación no soportado: ${type}`)
        }
    }
}
