import { Request, Response, NextFunction } from "express";
import { LibroService } from "../services/LibroService.js";
import { parseId } from "../helpers/ParamsHelper.js";

export class LibroController {
    constructor(private libroService: LibroService) {}

    listLibros = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const libros = await this.libroService.listarLibros()
            res.status(200).json(libros)
        } catch (error) {
            next(error)
        }
    }

    getLibro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const libro = await this.libroService.verDetalle(parseId(req.params.id))
            res.status(200).json(libro)
        } catch (error) {
            next(error)
        }
    }

    createLibro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const libro = await this.libroService.crearLibro(req.body)
            res.status(201).json(libro)
        } catch (error) {
            next(error)
        }
    }

    updateLibro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const libro = await this.libroService.editarLibro(parseId(req.params.id), req.body)
            res.status(200).json(libro)
        } catch (error) {
            next(error)
        }
    }

    changeState = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const libro = await this.libroService.cambiarEstado(parseId(req.params.id), req.body)
            res.status(200).json(libro)
        } catch (error) {
            next(error)
        }
    }

    deleteLibro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.libroService.eliminarLibro(parseId(req.params.id))
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}
