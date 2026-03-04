import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";



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
  getAll: async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    
    const [customers, totalCount] = await Promise.all([
      prisma.customers.findMany({
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.customers.count()
    ]);

    return {
      customers,
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    };
  },

  toggleState: async (id: string, currentState: boolean) => {
    return await prisma.customers.update({
      where: { id },
      data: { state: !currentState }
    });
  }
};