import { estadosDisponibles } from "../../models/Libro.js"

export interface LibroRawModel {
    id: number,
    title: string,
    description: string,
    state: estadosDisponibles,
    createdAt: Date,
    updatedAt: Date,
}

export type LibroResponseDTO = LibroRawModel

export interface CreateLibroDTO {
    title: string,
    description: string,
    state?: estadosDisponibles,
}

export interface UpdateLibroDTO {
    title?: string,
    description?: string,
}

export interface ChangeLibroStateDTO {
    state: estadosDisponibles,
}

export interface LibroStateChangedEvent {
    libroId: number,
    libroTitle: string,
    previousState: estadosDisponibles,
    newState: estadosDisponibles,
}
