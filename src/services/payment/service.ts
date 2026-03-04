import { prisma } from "@/lib/prisma";
import dayjs from "@/lib/dayjs/dayjs";

export const PaymentService = {
  getFilteredPaginated: async (params: {
    filter?: string;
    date?: string;
    method?: string;
    page?: number;
    limit?: number;
  }) => {
    const { filter, date, method, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;
    const nowLocal = dayjs().tz("America/Lima");

    // 1. Construcción del filtro WHERE
    let where: any = {};

    // Filtro por Método
    if (method && method !== 'ALL') {
      where.payment_method = method;
    }

    // Filtros de Fecha
    if (date) {
      const target = dayjs.tz(date, "America/Lima");
      where.payment_date = {
        gte: target.startOf('day').toDate(),
        lte: target.endOf('day').toDate()
      };
    } else if (filter) {
      switch (filter) {
        case 'today':
          where.payment_date = {
            gte: nowLocal.startOf('day').toDate(),
            lte: nowLocal.endOf('day').toDate()
          };
          break;
        case '7days':
          where.payment_date = {
            gte: nowLocal.subtract(7, 'day').startOf('day').toDate(),
            lte: nowLocal.toDate()
          };
          break;
        case 'month':
          where.payment_date = {
            gte: nowLocal.startOf('month').toDate(),
            lte: nowLocal.endOf('month').toDate()
          };
          break;
      }
    }

    // 2. Consultas en paralelo (Data + Total + Resumen Stats)
    const [payments, totalCount, allPaymentsForStats] = await Promise.all([
      prisma.payments.findMany({
        where,
        include: {
          users: { select: { name: true, email: true } }, // User que creó el pago
          bookings: { select: {start_time: true, end_time: true } },
        },
        orderBy: { payment_date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.payments.count({ where }),
      // Obtenemos solo los totales y métodos para las cards de arriba (sin paginación)
      prisma.payments.findMany({
        where: { ...where, status: 'COMPLETED' },
        select: { total: true, payment_method: true }
      })
    ]);

    // 3. Cálculo de Resumen para las StatCards
    const resumen = {
      totalGlobal: 0,
      porYape: 0,
      porEfectivo: 0,
      porTarjeta: 0
    };

    allPaymentsForStats.forEach(p => {
       // console.log(`Método: ${p.payment_method} | Monto: ${p.total}`);
      const monto = Number(p.total);
      const metodo = p.payment_method; // Guardamos en variable para limpiar el código
      resumen.totalGlobal += monto;
      if (metodo === 'MOVIL') resumen.porYape += monto;
      if (metodo === 'CASH') resumen.porEfectivo += monto;
     else if (metodo.includes('CARD_CREDIT') || metodo.includes('TRANFER') || metodo.includes('CARD_DEBIT')) {
        resumen.porTarjeta += monto;
      }
      
  });
    return {
      payments,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      resumen
    };
  }
};


// buscar dpcuemnto de pago y obtener detalle


export async function getPaymentDetail(id: string) {
  try {
    const payment = await prisma.payments.findUnique({
      where: { id },
      include: {
        // Traemos el usuario que registró el pago (Staff/Admin)
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        // Traemos el cliente asociado al pago
        customers: true,
        // Traemos la reserva y, dentro de ella, el campo (field)
        bookings: {
          include: {
            fields: true, // Esto puebla el campo deportivo de esa reserva
          },
        },
      },
    });

    if (!payment) return null;
    return payment;
  } catch (error) {
    console.error("Error al obtener detalle de pago:", error);
    throw new Error("No se pudo cargar la información del pago");
  }
}

export const PaymentStatusService = {

  confirmAtomic: async (paymentId: string) => {
    // Prisma $transaction asegura que si falla la reserva, el pago no se confirma
    return await prisma.$transaction(async (tx) => {
      // 1. Buscamos el pago para obtener el booking_id
      const payment = await tx.payments.findUnique({
        where: { id: paymentId },
      });

      if (!payment) throw new Error("Pago no encontrado");

      // 2. Actualizamos el Pago a COMPLETED
      const updatedPayment = await tx.payments.update({
        where: { id: paymentId },
        data: { status: 'COMPLETED' },
      });

      // 3. Actualizamos la Reserva asociada a CONFIRMED
      const updatedBooking = await tx.bookings.update({
        where: { id: payment.booking_id },
        data: { status: 'CONFIRMED' },
      });

      return { payment: updatedPayment, booking: updatedBooking };
    });
  },


 //cancelacion de pgo y reserva

  cancelAtomic: async (paymentId: string) => {
    return await prisma.$transaction(async (tx) => {
      // 1. Buscamos el pago y traemos los datos de la reserva asociada (start_time)
      const payment = await tx.payments.findUnique({
        where: { id: paymentId },
        include: {
          bookings: {
            select: { start_time: true }
          }
        }
      });

      if (!payment) throw new Error("Pago no encontrado");
      if (!payment.bookings) throw new Error("Reserva asociada no encontrada");

      // 2. VALIDACIÓN DE 2 HORAS
      const now = dayjs();
      const startTime = dayjs(payment.bookings.start_time);
      const diffInHours = startTime.diff(now, 'hour', true);

      // Si falta menos de 2 horas para que empiece el partido, bloqueamos
      if (diffInHours < 2) {
        throw new Error(
          `No se puede cancelar. Faltan ${diffInHours.toFixed(1)}h para el partido. (Mínimo 2h de anticipación)`
        );
      }

      // 3. Si pasa la validación, procedemos a cancelar ambos registros
      const cancelledPayment = await tx.payments.update({
        where: { id: paymentId },
        data: { status: 'CANCELLED' },
      });

      const cancelledBooking = await tx.bookings.update({
        where: { id: payment.booking_id },
        data: { status: 'CANCELLED' },
      });

      return { payment: cancelledPayment, bookings: cancelledBooking };
    });
  }

};

