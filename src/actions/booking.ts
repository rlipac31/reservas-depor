"use server";

import { BookingService, ListBookingWithFilterService } from "@/services/booking/service";
import { getSession } from "@/lib/jwt/auth-utils";
import { revalidatePath } from "next/cache";

export async function createBookingAction(formData: any) {
  try {
    const session = await getSession();
    if (!session) throw new Error("No autorizado");

    // Agregamos el userId de la sesión a los datos
    const result = await BookingService.createWithPayment({
      ...formData,
      userId: session.id
    });

    // revalidatePath("/dashboard/reservas");
    // revalidatePath("/dashboard/campos");

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
    const safeBookings = bookings.map(b => ({
      ...b,
      total_price: b.total_price.toString(),
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