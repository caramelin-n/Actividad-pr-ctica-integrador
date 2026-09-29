import { Model, type CreationOptional } from "sequelize";

type estadosDisponibles = 'DISPONIBLE' | 'PRESTADO' | 'EN_REPARACION'

// export class Libro {
//     constructor(
//         public id: number,
//         public title: string,
//         public description: string,
//         public state: estadosDisponibles,
//         public createdAt: Date,
//         public updatedAt: Date,
//      ) {}
// }

export class Libro extends Model {
    declare id: CreationOptional<number>;
    declare title: string;
    declare description: string;
    declare state: estadosDisponibles;
    declare createdAt: Date;
    declare updatedAt: Date;
}

/*  
TODO: Debe hacerse un mini-refactor, no solo acá sino en todos los modelos.
El motivo se debe a que se necesita de la instancia de sequelize, para poder instanciar acá como:
new sequelize(Libro ...)
*/