import { ChangeLibroStateDTO, CreateLibroDTO, LibroResponseDTO, LibroStateChangedEvent, UpdateLibroDTO } from "../dtos/libro/LibroDto.js";
import { BadRequestError, NotFoundError } from "../middlewares/errorHandler.js";
import { ESTADOS_LIBRO, estadosDisponibles } from "../models/Libro.js";
import { ISubject } from "../observer/ISubject.js";
import { ILibroRepository } from "../repositories/interfaces/ILibroRepository.js";

export class LibroService {
    constructor(private libroRepository: ILibroRepository,
        private eventPublisher: ISubject<LibroStateChangedEvent>,
    ) {}

    private isValidState(state: unknown): state is estadosDisponibles {
        return typeof state === "string" && (ESTADOS_LIBRO as readonly string[]).includes(state)
    }

    async listarLibros(): Promise<LibroResponseDTO[]> {
        return await this.libroRepository.listarLibros()
    }

    async verDetalle(id: number): Promise<LibroResponseDTO> {
        const libro = await this.libroRepository.verDetalle(id)
        if (!libro) {
            throw new NotFoundError(`No se encontró el libro ${id}`)
        }
        return libro
    }

    async crearLibro(data: CreateLibroDTO): Promise<LibroResponseDTO> {
        const { title, description, state } = data ?? {}
        if (!title?.trim() || !description?.trim()) {
            throw new BadRequestError("Título y descripción son obligatorios.")
        }
        if (state !== undefined && !this.isValidState(state)) {
            throw new BadRequestError(`Estado inválido. Estados posibles: ${ESTADOS_LIBRO.join(", ")}`)
        }
        return await this.libroRepository.crearLibro({
            title: title.trim(),
            description: description.trim(),
            state: state ?? "DISPONIBLE",
        })
    }

    async editarLibro(id: number, data: UpdateLibroDTO): Promise<LibroResponseDTO> {
        const { title, description } = data ?? {}
        const changes: UpdateLibroDTO = {}
        if (title !== undefined) {
            if (!title.trim()) throw new BadRequestError("El título no puede estar vacío.")
            changes.title = title.trim()
        }
        if (description !== undefined) {
            if (!description.trim()) throw new BadRequestError("La descripción no puede estar vacía.")
            changes.description = description.trim()
        }
        if (Object.keys(changes).length === 0) {
            throw new BadRequestError("No hay datos para actualizar.")
        }
        const libro = await this.libroRepository.editarLibro(id, changes)
        if (!libro) {
            throw new NotFoundError(`No se encontró el libro ${id}`)
        }
        return libro
    }

    async cambiarEstado(id: number, data: ChangeLibroStateDTO): Promise<LibroResponseDTO> {
        const { state } = data ?? {}
        if (!this.isValidState(state)) {
            throw new BadRequestError(`Estado inválido. Estados posibles: ${ESTADOS_LIBRO.join(", ")}`)
        }
        const libro = await this.verDetalle(id)
        if (libro.state === state) {
            throw new BadRequestError(`El libro ya se encuentra en estado ${state}.`)
        }
        const updatedLibro = await this.libroRepository.cambiarEstado(id, state)
        if (!updatedLibro) {
            throw new NotFoundError(`No se encontró el libro ${id}`)
        }
        await this.eventPublisher.notify({
            libroId: updatedLibro.id,
            libroTitle: updatedLibro.title,
            previousState: libro.state,
            newState: updatedLibro.state,
        })
        return updatedLibro
    }

    async eliminarLibro(id: number): Promise<void> {
        const deleted = await this.libroRepository.eliminarLibro(id)
        if (!deleted) {
            throw new NotFoundError(`No se encontró el libro ${id}`)
        }
    }
}
