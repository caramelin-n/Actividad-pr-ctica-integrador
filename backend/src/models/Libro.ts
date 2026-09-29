type estadosDisponibles = 'DISPONIBLE' | 'PRESTADO' | 'EN_REPARACION'

export class Libro {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public state: estadosDisponibles,
        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}