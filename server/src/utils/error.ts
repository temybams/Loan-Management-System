import { IError } from '../types/error.type'

const throwError = (message: string, status: number) => {
    const error: IError = new Error(message)
    error.status = status
    error.intentional = true

    throw error
}

export default throwError
