import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'
import catchAsync from '../middleware/catchasync.middleware'

const validationMiddleware = (schema: z.ZodTypeAny) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                req.body = schema.parse(req.body)
                next()
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.issues.map((issue) => issue.message)
                    return res.status(400).json({
                        success: false,
                        message,
                    })
                }
                next(error)
            }
        },
    )
}

export default validationMiddleware