"use server";

import { PaymentService, PaymentStatusService, getPaymentDetail } from "@/services/payment/service";
import { revalidatePath } from "next/cache";

export async function getPagosConFiltro(
  filter?: string,
  date?: string,
  method?: string,
  page: string = "1",
  limit: string = "10"
) {
  try {
    const { payments, totalCount, totalPages, resumen } = await PaymentService.getFilteredPaginated({
      filter,
      date,
      method,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    // Serialización de Decimal y Dates
    const safePayments = payments.map(p => ({
      ...p,
      amount: Number(p.amount),
      total: Number(p.total),
      discount: Number(p.discount),
      start_time: p.bookings.start_time.toISOString(),
      end_time:p.bookings.end_time.toISOString(),
      payment_date: p.payment_date.toISOString(),
    }));

    return {
      success: true,
      data: safePayments,
      resumen,
      pagination: {
        totalResults: totalCount,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message, data: [], resumen: { totalGlobal: 0, porYape: 0, porEfectivo: 0, porTarjeta: 0 } };
  }
}



// confirmar pago
export async function confirmPaymentAction(id: string) {
  try {
    const result = await PaymentStatusService.confirmAtomic(id);
    
    // IMPORTANTE: Limpiar el cache para que la tabla se actualice sola
    revalidatePath("/dashboard/pagos");
    revalidatePath("/dashboard/reservas");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error confirmando pago:", error.message);
    return { success: false, error: error.message };
  }
}

// cancelar pago
export async function cancelPaymentAction(id: string) {
  try {
    const result = await PaymentStatusService.cancelAtomic(id);
    
    revalidatePath("/dashboard/pagos");
    revalidatePath("/dashboard/reservas");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error cancelando pago:", error.message);
    return { success: false, error: error.message };
  }
}

// paymentId detalle



export async function getPaymentDetailAction(paymentId: string) {
  if (!paymentId) {
    return { error: "ID de pago no proporcionado" };
  }

  try {
    const payment = await getPaymentDetail(paymentId);

    if (!payment) {
      return { error: "Pago no encontrado" };
    }

    // Retornamos el objeto completo para que el componente lo use
    return { data: payment, success: true };
  } catch (error) {
    return { error: "Error interno al procesar la solicitud" };
  }
}