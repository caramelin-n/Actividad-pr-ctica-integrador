import { CreateSubscriptionDTO, SubscriberDTO, SubscriptionResponseDTO } from "../dtos/subscription/SubscriptionDto.js";
import { Libro, Subscription, User } from "../models/Relations.js";
import { ISubscriptionRepository } from "./interfaces/ISubscriptionRepository.js";

export class SubscriptionRepository implements ISubscriptionRepository {

    async crearSuscripcion(data: CreateSubscriptionDTO): Promise<SubscriptionResponseDTO> {
        const subscription = await Subscription.create(data)
        return {
            id: subscription.id,
            userId: subscription.userId,
            libroId: subscription.libroId,
        }
    }

    async eliminarSuscripcion(userId: number, libroId: number): Promise<boolean> {
        const deleted = await Subscription.destroy({ where: { userId, libroId } })
        return deleted > 0
    }

    async buscarSuscripcion(userId: number, libroId: number): Promise<SubscriptionResponseDTO | null> {
        const subscription = await Subscription.findOne({ where: { userId, libroId } })
        if (!subscription) return null
        return {
            id: subscription.id,
            userId: subscription.userId,
            libroId: subscription.libroId,
        }
    }

    async listarSuscripcionesPorUsuario(userId: number): Promise<SubscriptionResponseDTO[]> {
        const subscriptions = await Subscription.findAll({
            where: { userId },
            include: [{ model: Libro, attributes: ["title"] }],
            order: [["id", "ASC"]],
        })
        return subscriptions.map(subscription => ({
            id: subscription.id,
            userId: subscription.userId,
            libroId: subscription.libroId,
            libroTitle: subscription.Libro?.title ?? "",
        }))
    }

    async listarSuscriptoresPorLibro(libroId: number): Promise<SubscriberDTO[]> {
        const subscriptions = await Subscription.findAll({
            where: { libroId },
            include: [{ model: User, attributes: ["id", "email"] }],
        })
        return subscriptions
            .filter(subscription => subscription.User)
            .map(subscription => ({
                userId: subscription.userId,
                email: subscription.User?.email ?? "",
            }))
    }
}
