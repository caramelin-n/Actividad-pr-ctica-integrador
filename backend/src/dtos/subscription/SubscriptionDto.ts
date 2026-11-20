export interface CreateSubscriptionDTO {
    userId: number,
    libroId: number,
}

export interface SubscriptionResponseDTO {
    id: number,
    userId: number,
    libroId: number,
    libroTitle?: string,
}

export interface SubscriberDTO {
    userId: number,
    email: string,
}
