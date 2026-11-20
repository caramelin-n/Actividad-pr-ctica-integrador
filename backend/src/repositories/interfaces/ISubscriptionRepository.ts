import { CreateSubscriptionDTO, SubscriberDTO, SubscriptionResponseDTO } from "../../dtos/subscription/SubscriptionDto.js";

export interface ISubscriptionRepository {
    crearSuscripcion(data: CreateSubscriptionDTO): Promise<SubscriptionResponseDTO>
    eliminarSuscripcion(userId: number, libroId: number): Promise<boolean>
    buscarSuscripcion(userId: number, libroId: number): Promise<SubscriptionResponseDTO | null>
    listarSuscripcionesPorUsuario(userId: number): Promise<SubscriptionResponseDTO[]>
    listarSuscriptoresPorLibro(libroId: number): Promise<SubscriberDTO[]>
}
