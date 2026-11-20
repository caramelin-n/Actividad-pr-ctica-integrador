import { CreateLibroDTO, LibroResponseDTO, UpdateLibroDTO } from "../../dtos/libro/LibroDto.js";
import { estadosDisponibles } from "../../models/Libro.js";

export interface ILibroRepository {
    listarLibros(): Promise<LibroResponseDTO[]>
    verDetalle(id: number): Promise<LibroResponseDTO | null>
    crearLibro(data: CreateLibroDTO): Promise<LibroResponseDTO>
    editarLibro(id: number, data: UpdateLibroDTO): Promise<LibroResponseDTO | null>
    cambiarEstado(id: number, nuevoEstado: estadosDisponibles): Promise<LibroResponseDTO | null>
    eliminarLibro(id: number): Promise<boolean>
}
