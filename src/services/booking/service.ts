import { prisma } from "@/lib/prisma";
import dayjs from "@/lib/dayjs/dayjs"; // Tu config con TIMEZONE = "America/Lima"
import { Prisma } from "@prisma/client";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = "America/Lima";

export const BookingService = {
  createWithPayment: async (data: any) => {
    const {
      fieldId,
      userId,
      startTime,
      durationInMinutes,
      paymentMethod,
      customer_name_snapshot,
      customer_dni_snapshot,
      customer_id,
      customer_phone,
      payment_reference,
      discount = 0
    } = data;

    // 1. Preparar tiempos en Lima
    const localStart = dayjs.tz(startTime, "America/Lima").second(0).millisecond(0);
    const localEnd = localStart.add(durationInMinutes, 'minute');
    
    const startUTC = localStart.toDate();
    const endUTC = localEnd.toDate();

    // 2. Transacción Atómica
    return await prisma.$transaction(async (tx) => {
      
      // A. Verificar solapamiento (Overlap)
      const conflicto = await tx.bookings.findFirst({
        where: {
          field_id: fieldId,
          status: { in: ['PENDING', 'CONFIRMED'] },
          AND: [
            { start_time: { lt: endUTC } },
            { end_time: { gt: startUTC } }
          ]
        }
      });

      if (conflicto) {
        throw new Error(`Horario ocupado: ${dayjs(conflicto.start_time).tz("America/Lima").format('HH:mm')} - ${dayjs(conflicto.end_time).tz("America/Lima").format('HH:mm')}`);
      }

      // B. Obtener cancha y calcular precio
      const field = await tx.fields.findUnique({ where: { id: fieldId } });
      if (!field || !field.state) throw new Error('Cancha no disponible');

      const pricePerHour = Number(field.price_per_hour);
      const subtotal = pricePerHour * (durationInMinutes / 60);
      const total = subtotal - (subtotal * (discount / 100));

      // C. Crear la Reserva
      const booking = await tx.bookings.create({
        data: {
          user_id: userId,
          field_id: fieldId,
          customer_id:customer_id,
          start_time: startUTC,
          end_time: endUTC,
          duration_minutes: durationInMinutes,
          total_price: new Prisma.Decimal(total),
          status: (paymentMethod === 'CASH' || paymentMethod === 'MOVIL') ? 'CONFIRMED' : 'PENDING',
          manual_customer_name: customer_name_snapshot,
          manual_customer_dni: customer_dni_snapshot,
          manual_customer_phone: customer_phone,
          updated_at: new Date()
        }
      });

      // D. Crear el Pago
      const payment = await tx.payments.create({
        data: {
          booking_id: booking.id,
          user_id: userId,
          customer_id:customer_id,
          amount: new Prisma.Decimal(pricePerHour),
          total: new Prisma.Decimal(total),
          discount: new Prisma.Decimal(discount),
          payment_method: paymentMethod,
          status: booking.status === 'CONFIRMED' ? 'COMPLETED' : 'PENDING',
          customer_name_snapshot: customer_name_snapshot,
          customer_dni_snapshot: customer_dni_snapshot,
        }
      });

      return { booking, payment };
    });
  }
};




export const ListBookingWithFilterService = {
  getFilteredPaginated: async (params: {
    filter?: string;
    date?: string;
    page?: number;
    limit?: number;
  }) => {
    const { filter, date, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;
    const nowLocal = dayjs().tz("America/Lima");

    // Construcción del WHERE dinámico
    let where: any = {
      status: { in: ['PENDING', 'CONFIRMED', 'COMPLETED'] }
    };

    // Filtros de fecha
    if (date) {
      const target = dayjs.tz(date, "America/Lima");
      where.start_time = {
        gte: target.startOf('day').toDate(),
        lte: target.endOf('day').toDate()
      };
    } else if (filter) {
      switch (filter) {
        case 'today':
          where.start_time = {
            gte: nowLocal.startOf('day').toDate(),
            lte: nowLocal.endOf('day').toDate()
          };
          break;
        case '7days':
          where.start_time = {
            gte: nowLocal.subtract(7, 'day').startOf('day').toDate(),
            lte: nowLocal.toDate()
          };
          break;
        case 'month':
          where.start_time = {
            gte: nowLocal.startOf('month').toDate(),
            lte: nowLocal.endOf('month').toDate()
          };
          break;
        case 'all':
          // No añadimos filtro de tiempo, solo el de estado inicial
          break;
      }
    } else {
      // Por defecto: Hoy en adelante (Pendientes y Confirmados)
      where.start_time = { gte: nowLocal.startOf('day').toDate() };
    }

    const [bookings, totalCount] = await Promise.all([
      prisma.bookings.findMany({
        where,
        include: {
          fields: { select: { name: true, location: true } },
          // user: { select: { name: true, email: true } } // Si necesitas el creador
        },
        orderBy: { start_time: 'desc' },
        skip,
        take: limit,
      }),
      prisma.bookings.count({ where })
    ]);
    

    return {
      bookings,
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    };
  },

 getReservationsByFieldAndDate: async (idField: string, date?: string) => {
  try {
    // 1. Gestión de Fechas con Day.js (Igual a tu lógica original)
    const baseDate = date 
      ? dayjs.tz(date, TIMEZONE) 
      : dayjs().tz(TIMEZONE);

    if (!baseDate.isValid()) {
      throw new Error("Formato de fecha inválido. Use YYYY-MM-DD.");
    }

    // Definimos el rango exacto del día en ISO para Prisma
    const startOfDay = baseDate.startOf('day').toISOString();
    const endOfDay = baseDate.endOf('day').toISOString();

    // 2. Consulta con Prisma
    const bookings = await prisma.bookings.findMany({
      where: {
        field_id: idField,
        status: {
          not: 'CANCELLED', // $ne en Mongoose es 'not' en Prisma
        },
        start_time: {
          gte: new Date(startOfDay),
          lte: new Date(endOfDay),
        },
      },
      include: {
        // En Prisma, 'populate' se hace con 'include' o 'select'
        fields: {
          select: {
            name: true,
            location: true,
          },
        },
        users: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        start_time: 'asc', // Orden cronológico
      },
    });

    // 3. Respuesta estructurada (Formato similar al que tenías)
    return {
      success: true,
      results: bookings.length,
      metaData: {
        requestedDate: baseDate.format('YYYY-MM-DD'),
        field_id: idField,
      },
      content: bookings,
    };

  } catch (error) {
    console.error(`[Error getReservationsByField]:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
      data: []
    };
  }
}



};


export const BookingIdService = {
   getBookingId: async(id: string) =>{
  try {
        
    const booking = await prisma.bookings.findUnique({
        where: { id: id },
      });
      if(!booking){
        throw new Error("el booking con ese id no exite");
      } 
    return booking;
  } catch (error) {
    console.error("Error al obtener detalle de pago:", error);
    throw new Error("No se pudo cargar la información del pago");
  }
},

 updateBooking: async(id: string, data: Partial<Prisma.bookingsUpdateInput>) => {
  try {
    return await prisma.bookings.update({
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

}




