import { Role } from "./Role.js";

export class User {
    constructor(
        public id: number,
        public email: string,
        public password: string,
        public role: Role
    ) {}
}