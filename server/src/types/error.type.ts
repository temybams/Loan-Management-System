type IError = Error & {
    status?: number
    intentional?: boolean
}

export { IError }