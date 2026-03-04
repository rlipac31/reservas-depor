import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const createUser = async (data: Prisma.usersCreateInput) => {
    try {
        return await prisma.users.create({
            data,
        });
    } catch (error) {
        throw new Error("Error al crear el usuario en la base de datos");
    }
};

export const UserService = {
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

  toggleState: async (id: string, currentState: boolean) => {
    return await prisma.users.update({
      where: { id },
      data: { state: !currentState }
    });
  }
};