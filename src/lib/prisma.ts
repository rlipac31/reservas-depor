import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
  // 1. Creamos un pool de conexiones usando el driver de 'pg'
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  
  // 2. Creamos el adaptador oficial de Prisma 7 para PostgreSQL
  const adapter = new PrismaPg(pool)

  // 3. Pasamos el adaptador al constructor (esto quita el error de 'adapter required')
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}



export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma



///////////////////////

