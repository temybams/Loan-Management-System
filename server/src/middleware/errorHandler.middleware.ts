import { NextFunction, Request, Response } from 'express'
import { IError } from '../types/error.type'

const errorHandler = (
    err: IError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (err.intentional === true) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Internal Server Error',
            error: err.stack,
        })
    }
    console.error(`Error: ${err.message}`)
    console.error(`Stack: ${err.stack}`)
    if (process.env.NODE_ENV === 'production') {
        return res.status(err.status || 500).json({
            success: false,
            message:
                err.message ||
                'An unexpected error occurred. Please try again later.',
            error: {},
        })
    } else {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Internal Server Error',
            error: err.stack,
        })
    }
}

export default errorHandler
