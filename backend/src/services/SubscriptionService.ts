import { SubscriptionResponseDTO } from "../dtos/subscription/SubscriptionDto.js";
import { ConflictError, NotFoundError } from "../middlewares/errorHandler.js";
import { ILibroRepository } from "../repositories/interfaces/ILibroRepository.js";
import { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository.js";

export class SubscriptionService {
    constructor(private subscriptionRepository: ISubscriptionRepository,
        private libroRepository: ILibroRepository,
    ) {}

    async suscribirse(userId: number, libroId: number): Promise<SubscriptionResponseDTO> {
        const libro = await this.libroRepository.verDetalle(libroId)
        if (!libro) {
            throw new NotFoundError(`No se encontró el libro ${libroId}`)
        }
        const existing = await this.subscriptionRepository.buscarSuscripcion(userId, libroId)
        if (existing) {
            throw new ConflictError("Ya estás suscripto a este libro.")
        }
        const subscription = await this.subscriptionRepository.crearSuscripcion({ userId, libroId })
        return { ...subscription, libroTitle: libro.title }
    }

    async desuscribirse(userId: number, libroId: number): Promise<void> {
        const deleted = await this.subscriptionRepository.eliminarSuscripcion(userId, libroId)
        if (!deleted) {
            throw new NotFoundError("No estás suscripto a este libro.")
        }
    }

    async listarMisSuscripciones(userId: number): Promise<SubscriptionResponseDTO[]> {
        return await this.subscriptionRepository.listarSuscripcionesPorUsuario(userId)
    }
}
