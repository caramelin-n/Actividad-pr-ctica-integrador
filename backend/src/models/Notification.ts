type availableStatuses = 'leida' | "no leida"

export class Notification {
    constructor(
        public id: number,
        public status: availableStatuses,
        public message: string,
        public emailDirection: string
    ) {}
}