import type { Libro } from "./Libro.js";
import type { User } from "./User.js";

export class Subscription {
    constructor(
        public id: number,
        public user_id: User,
        public resource_id: Libro
    ) {}
}