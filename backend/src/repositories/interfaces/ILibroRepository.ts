import { Libro } from "../../models/Libro.js";

export interface ILibroRepository {
    listarLibros(): Promise<Libro[]>
    verDetalle(id: number): Promise<Libro>
    crearLibro(libro: Libro): Promise<Libro>
    editarLibro(id: number): Promise<Libro>
    cambiarEstado(id: number, nuevoEstado: string): Promise<Libro>
    eliminarLibro(id: number): Promise<Libro>
}