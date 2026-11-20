import { CreateLibroDTO, LibroResponseDTO, UpdateLibroDTO } from "../dtos/libro/LibroDto.js";
import { Libro } from "../models/Relations.js";
import { estadosDisponibles } from "../models/Libro.js";
import { ILibroRepository } from "./interfaces/ILibroRepository.js";

export class LibroRepository implements ILibroRepository {

    async listarLibros(): Promise<LibroResponseDTO[]> {
        const libros = await Libro.findAll({ order: [["id", "ASC"]] })
        return libros.map(libro => libro.toJSON())
    }

    async verDetalle(id: number): Promise<LibroResponseDTO | null> {
        const libro = await Libro.findByPk(id)
        return libro ? libro.toJSON() : null
    }

    async crearLibro(data: CreateLibroDTO): Promise<LibroResponseDTO> {
        const libro = await Libro.create(data)
        return libro.toJSON()
    }

    async editarLibro(id: number, data: UpdateLibroDTO): Promise<LibroResponseDTO | null> {
        const libro = await Libro.findByPk(id)
        if (!libro) return null
        await libro.update(data)
        return libro.toJSON()
    }

    async cambiarEstado(id: number, nuevoEstado: estadosDisponibles): Promise<LibroResponseDTO | null> {
        const libro = await Libro.findByPk(id)
        if (!libro) return null
        await libro.update({ state: nuevoEstado })
        return libro.toJSON()
    }

    async eliminarLibro(id: number): Promise<boolean> {
        const deleted = await Libro.destroy({ where: { id } })
        return deleted > 0
    }
}
