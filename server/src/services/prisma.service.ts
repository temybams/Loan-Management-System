import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

const connectPrisma = async () => {
    prisma = new PrismaClient()
    prisma.$connect().catch((error:unknown) => {
        console.error('Error connecting to Prisma client')
        console.error(error)
    })
}

export { connectPrisma, prisma }
