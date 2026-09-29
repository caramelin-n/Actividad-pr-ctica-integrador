import { Role } from "./Role.js";
import { Permission } from "./Permission.js";

export class RolePermission {
    constructor(
        public id: number,
        public role_id: Role,
        public permission_id: Permission
    ) {}
}