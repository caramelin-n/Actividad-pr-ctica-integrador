import type { Subscription } from "../../models/Subscription.js";

export interface ISubscriptionRepository {
    crearSuscripción(suscripcion: Subscription): Promise<Subscription>
    eliminarSuscripción(id: number): void
}
