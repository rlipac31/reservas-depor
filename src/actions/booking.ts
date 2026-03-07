"use server";

import { BookingIdService, BookingService, ListBookingWithFilterService } from "@/services/booking/service";
import { getSession } from "@/lib/jwt/auth-utils";
import { revalidatePath } from "next/cache";
import { any } from "zod";

export async function createBookingAction(formData: any) {
  try {
    const session = await getSession();
    if (!session) throw new Error("No autorizado");

    // Agregamos el userId de la sesión a los datos
    const result = await BookingService.createWithPayment({
      ...formData
    });

     revalidatePath("/dashboard/reservas");
     revalidatePath("/dashboard/campos");

    return { 
      success: true, 
      data: result,
      message: "Reserva creada exitosamente" 
    };
  } catch (error: any) {
    console.error("❌ Error Action:", error.message);
    return { 
      success: false, 
      error: error.message || "Error al procesar la reserva" 
    };
  }
}


//listar reservas con filtros y paginación

export async function getBookingsConPagination(
  filter?: string, 
  date?: string, 
  page: string = "1", 
  limit: string = "10"
) {
  try {
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    const { bookings, totalCount, totalPages } = await ListBookingWithFilterService.getFilteredPaginated({
      filter,
      date,
      page: pageInt,
      limit: limitInt
    });

    // Serialización manual de Decimal y Date para Next.js
    const safeBookings = bookings.map((b:any) => ({
      ...b,
      total_price: b.total_price.toString() || 0,
      start_time: b.start_time.toISOString(),
      end_time: b.end_time.toISOString(),
      created_at: b.created_at.toISOString(),
    }));

    return {
      success: true,
      data: safeBookings,
      meta: {
        totalResults: totalCount,
        totalPages,
        page: pageInt,
        limit: limitInt,
        appliedFilter: filter || (date ? `Día: ${date}` : 'Próximas')
      }
    };
  } catch (error: any) {
    return { 
      success: false, 
      data: [], 
      error: error.message || "Error al obtener reservas",
      meta: { totalResults: 0, totalPages: 0, page: 1, limit: 10 } 
    };
  }
}

// lsitando reservas del campo con fecha para edit reservas
export async function getReservasPorCampoPorFecha(fieldId: string, date: string) {
  try {
    const data = await ListBookingWithFilterService.getReservationsByFieldAndDate(fieldId, date);
  

      return {
      success: true,
      results: data.results,
      metaData: data.metaData,
      content: data.content
    };
  } catch (e) {
    return { success:false, error: e, data: [] };
  }
}

//buscamos reserva por id
export async function getBookingIdAction(fieldId:string) {
  try {
    const data = await BookingIdService.getBookingId(fieldId);

    const safeBookingId = { 
      ...data,
       total_price: Number(data.total_price),
       start_time: data.start_time.toISOString(),
       end_time:data.end_time.toISOString(),
       created_at: data.created_at.toISOString(),
       updated_at:data.updated_at.toISOString()
      }

    return { success: true, content: safeBookingId, error: null };
  } catch (e) {
    return { success: false, content: [], error: e };
  }
}


//actualizar
export async function updateBookingAction(id: string, data: any) {
  try {
    // 1. Extraer y convertir datos
        const manual_customer_name = data.customerName;
        const manual_customer_dni = data.customerDNI;
        const start_time = data.startTime;
        const feild_id = data.fieldId;
      
  // 2. Ejecutar la actualización

    // 2. Ejecutar la actualización
    await BookingIdService.updateBooking(id, {
    //  field_id,
      manual_customer_name,
      manual_customer_dni,
      start_time
    });

    // 3. Limpiar caché para que el usuario vea el cambio
    revalidatePath("/dashboard/campos");
    revalidatePath(`/dashboard/campos/${id}`);

    return { success: true, message: "Campo actualizado correctamente" };
  } catch (error) {
    console.error("Error en Action:", error);
    return { error: "Error al intentar actualizar el campo. Intenta de nuevo." };
  }
}
