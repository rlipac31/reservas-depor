import { getSession } from "@/lib/jwt/auth-utils";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { error } from "console";
import { success } from "zod";

export const createUser = async (data: Prisma.usersCreateInput) => {
    try {
       await prisma.users.create({
            data,
        });
        return { success:true }
    } catch (error:any) {
      
        throw new Error(`${error.message}`);
    }

   
};

export const UserService = {

 checkExistingUser: async (dni?: string, email?: string) => {
    return await prisma.users.findFirst({
      where: {
        OR: [
          ...(dni ? [{ dni }] : []),
          ...(email ? [{ email }] : []),
        ],
      },
      select: { id: true } // Solo necesitamos saber si existe
    });
  },

  getAll: async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    
    const [users, totalCount] = await Promise.all([
      prisma.users.findMany({
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.users.count()
    ]);

    return {
      users,
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    };
  },




  // Buscar un usuario por ID
  getById: async (id: string) => {
     if(!id){
        return { error:"no hay id en la peticion"}
      }
    return await prisma.users.findUnique({
      where: { id },
    });
  },

  // Actualizar datos del usuario
  update: async (id: string, data: { name?: string; phone?: string; dni?: string; }) => {
    try {
       if(!id){
        return { error:"no hay id en la peticion"}
      }
    return await prisma.users.update({
      where: { id },
      data,
    });
      
    } catch (error) {
      throw new Error(`Hubo un erro typo:  ${error}`);
    
    }
    
  },
//activar o desactivar estado
  toggleState: async (id: string, currentState: boolean) => {
    try {

      if(!id){
        return { error:"no hay id en la peticion"}
      }

    return await prisma.users.update({
      where: { id },
      data: { state: !currentState }
    });
      
    } catch (error) {
       throw new Error(`Hubo un erro typo:  ${error}`);
    }
      
  },

  getMeUser:async()=>{
    const sesssion =await getSession();
    const id = sesssion?.id as string;

     try {
        
    const user = await prisma.users.findUnique({
        where: { id: id },
      });
      if(!user){
        throw new Error("el user con ese id no exite");
      } 
    return user;
  } catch (error) {
    console.error("Error al obtener detalle de pago:", error);
    throw new Error("No se pudo cargar la información del pago");
  }
  }
};