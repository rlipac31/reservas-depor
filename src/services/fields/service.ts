import { prisma } from "@/lib/prisma";
import dayjs from "@/lib/dayjs/dayjs"; // Tu config de dayjs con timezone
import { Prisma } from "@prisma/client";
import { updateTag } from "next/cache";

export async function createField(data: {
  name: string;
  description?: string;
  capacity: number;
  price_per_hour: number;
  location?: string;
}) {
  return await prisma.fields.create({
    data: {
      name: data.name,
      description: data.description,
      capacity: data.capacity,
      price_per_hour: data.price_per_hour,
      location: data.location,
      updated_at: new Date(), // Necesario en Prisma 7 si no es automático
    },
  });
}




export const FieldService = {
  // Obtener todos los campos activos
  getAll: async () => {
    return await prisma.fields.findMany({
      where: { is_deleted: false, state: true },
      orderBy: { name: 'asc' }
    });
  },

    getAllAdmin: async () => {
    return await prisma.fields.findMany({
      where: { is_deleted: false },
      orderBy: { name: 'asc' }
    });
  },

  // Obtener reservas de un campo para un día específico
  getReservationsByDay: async (fieldId: string, dateStr: string) => {
    // Definimos el rango: desde las 00:00 hasta las 23:59 del día elegido
    const start = dayjs(dateStr).startOf('day').toDate();
    const end = dayjs(dateStr).endOf('day').toDate();

    return await prisma.bookings.findMany({
      where: {
        field_id: fieldId,
        start_time: {
          gte: start,
          lte: end
        },
        // status: { not: 'CANCELLED' } // Opcional si tienes estados
      },
      select: {
        start_time: true
      }
    });
  },

// desactivar campo
 ToggleStateField: async(id: string) =>{
  try {
        
     const campo = await prisma.fields.findUnique({
        where: { id: id },
      });
      const estado = campo?.state;
    // 2. Actualizamos el Pago a COMPLETED
      const updatedField = await prisma.fields.update({
        where: { id: id },
        data: { state: !estado, updated_at: new Date() },
      });

    if (!updatedField) return null;
    return updatedField;
  } catch (error) {
    console.error("Error al obtener detalle de pago:", error);
    throw new Error("No se pudo cargar la información del pago");
  }
},

// eliminando campo(logico)
deletedField: async(id: string) =>{
  try {
       const campo = await prisma.fields.findUnique({
        where: { id: id },
      });
      if(!campo){
        throw new Error("el campo con ese id no exite");
      }

    // 2. Actualizamos el Pago a COMPLETED
      const updatedField = await prisma.fields.update({
        where: { id: id },
        data: { is_deleted: true, updated_at: new Date() },
      });

    if (!updatedField) return null;
    return updatedField;
  } catch (error) {
    console.error("Error al obtener detalle de pago:", error);
    throw new Error("No se pudo cargar la información del pago");
  }
},
// editar campo
 getFieldId: async(id: string) =>{
  try {
        
    const campo = await prisma.fields.findUnique({
        where: { id: id },
      });
      if(!campo){
        throw new Error("el campo con ese id no exite");
      } 
    return campo;
  } catch (error) {
    console.error("Error al obtener detalle de pago:", error);
    throw new Error("No se pudo cargar la información del pago");
  }
},

 updateField: async(id: string, data: Partial<Prisma.fieldsUpdateInput>) => {
  try {
    return await prisma.fields.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(), // Sincronizamos manualmente si no tienes el trigger
      },
    });
  } catch (error) {
    console.error("Error en Service updateField:", error);
    throw new Error("No se pudo actualizar el campo deportivo");
  }
}

};