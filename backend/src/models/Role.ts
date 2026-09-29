type rolesDisponibles = 'admin' | 'operador' | 'usuario'

export class Role {
    constructor(
        public id: number,
        public roles: rolesDisponibles
    )
    {}
}