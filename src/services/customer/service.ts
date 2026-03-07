import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { success } from "zod";



// export async function createCustomer(data: {
//   name: string;
//   dni:string;
//   email?: string;
//   password?: string;
//   phone?: string;
//   state?:boolean;
//   updated_at: Date;
// }) {
//   return await prisma.customer.create({
//     data: {
//       name: data.name,
//       dni: data.dni,
//       email: data.email,
//       password: data.password,
//       phone: data.phone,
//       updated_at: new Date(), // Necesario en Prisma 7 si no es automático
//     },
//   });
// }

export const createCustomer = async (data: Prisma.customersCreateInput) => {
    try {
        return await prisma.customers.create({
            data,
        });
    } catch (error) {
        throw new Error("Error al crear el usuario en la base de datos");
    }
};




export const CustomerService = {
// vefificar si dni o email ya esta registrado
   checkExistingCustomer: async (dni?: string, email?: string) => {
    return await prisma.customers.findFirst({
      where: {
        OR: [
          ...(dni ? [{ dni }] : []),
          ...(email ? [{ email }] : []),
        ],
      },
      select: { id: true } // Solo necesitamos saber si existe
    });
  },
  //lista clientes
  getAll: async (page: number = 1, limit: number = 10) => {

      try {
             const skip = (page - 1) * limit;
    
        const [customers, totalCount] = await Promise.all([
              prisma.customers.findMany({
                orderBy: { created_at: 'desc' },
                skip,
                take: limit,
              }),
              prisma.customers.count()
            ]);
            if(customers && totalCount){

            return {
              customers,
              totalCount,
              totalPages: Math.ceil(totalCount / limit)
            };
         }else{
          return { success:false, error:"erro al cargar datos"}
         }
      } catch (error) {
          return { success:false, error:`erro tipo: ${error}`}
      }

   

  },

  // Buscar uncustomer por ID
  getById: async (id: string) => {
     if(!id){
        return { error:"no hay id en la peticion"}
      }
    return await prisma.customers.findUnique({
      where: { id },
    });
  },

  // Actualizar datos del usuario
  update: async (id: string, data: { name?: string; phone?: string; dni?: string; }) => {
     if(!id){
        return { error:"no hay id en la peticion"}
      }
    return await prisma.customers.update({
      where: { id },
      data,
    });
  },

  toggleState: async (id: string, currentState: boolean) => {
    return await prisma.customers.update({
      where: { id },
      data: { state: !currentState }
    });
  }
};