import { getServerUser } from "@/actions/useServer";
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

  // getMeUser:async()=>{
  //   const session =await getSession();
  //   console.log("session de service user ", session);
  //   const id = session?.id as string;

  //    try {
        
  //   const user = await prisma.users.findUnique({
  //       where: { id: id },
  //     });
  //     if(!user){
  //       throw new Error("el user con ese id no exite");
  //     } 
  //   return user;
  // } catch (error) {
  //   console.error("Error al obtener detalle de pago:", error);
  //   throw new Error("No se pudo cargar la información del pago");
  // }
  // }

  getMeUser: async () => {
  const session = await getSession();
  console.log("session de service user ", session);

  const id = session?.id;

  // 1. Validación crítica: Si no hay ID, lanzamos error antes de tocar Prisma
  if (!id) {
    console.error("No se encontró un ID válido en la sesión");
    throw new Error("No hay una sesión activa o el ID de usuario es inválido");
  }

  try {
    const user = await prisma.users.findUnique({
      // Ahora estamos seguros de que 'id' es un string real
      where: { id: id as string },
    });

    if (!user) {
      throw new Error("El usuario con ese id no existe");
    }

    return user;
  } catch (error) {
    // Evita confundir errores: si el error es el que tú lanzaste, propágalo
    if (error instanceof Error && error.message.includes("no existe")) {
      throw error;
    }
    
    console.error("Error al obtener detalle de usuario:", error);
    throw new Error("Error interno al cargar la información del usuario");
  }
}
};