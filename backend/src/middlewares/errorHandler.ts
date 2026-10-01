import { Request, Response, NextFunction } from "express"

export abstract class HttpError extends Error {
    
    statusCode: number 

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
    }
}

export class NotFoundError extends HttpError {

    constructor(message: string = "Content not found", statusCode: number = 404 ) {
        super(message, statusCode)
    }
}

export class BadRequestError extends HttpError {

    constructor(message: string = "Bad Request", statusCode: number = 400 ) {
        super(message, statusCode)
    }
}

export class InternalServerError extends HttpError {

    constructor(message: string = "Internal Server Error", statusCode: number = 500) {
        super(message, statusCode)
    }
}

export const handleError = (err: Error ,_req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof HttpError) {
        res.status(err.statusCode).json({
            status: "error",
            statusCode: err.statusCode,
            errorMessage: err.message,
        })
        return
    }
    console.log("Se ha producido un error desconocido", err)
    res.status(500).json({
        status: "error",
        statusCode: 500,
        errorMessage: "Error interno del servidor"
    })
}