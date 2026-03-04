// app/dashboard/pagos/[id]/page.tsx
import { getPaymentDetailAction } from "@/actions/payments";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Importar el idioma español
import localizedFormat from "dayjs/plugin/localizedFormat"; // Plugin para formatos locales (LL, LLLL)

// Activar el plugin y el idioma
dayjs.extend(localizedFormat);
dayjs.locale("es");

export default async function PaymentDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params; // En Next 16 params es una Promise
  const { data } = await getPaymentDetailAction(id);
  const payment = data;

  if (!payment) notFound();

  // Helper para moneda
  const formatCurrency = (val: any) => 
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(Number(val));

  return (
    <main className="min-h-screen p-4 md:p-8 bg-brand-secondary">
      <div className="max-w-3xl mx-auto">
        
        {/* Encabezado con gradiente Accent */}
        <div className="bg-gradient-accent p-1 rounded-t-2xl shadow-lg">
          <div className="bg-brand-primary p-6 rounded-t-[calc(1rem-1px)] flex justify-between items-center">
            <div>
              <h1 className="text-brand-white text-2xl font-bold tracking-tight">Detalle de Pago</h1>
              <p className="text-brand-secondary/70 text-sm font-mono">{payment.id}</p>
            </div>
            <div className="bg-brand-white/10 px-4 py-2 rounded-lg border border-brand-white/20">
              <span className="text-brand-white font-bold">{payment.status}</span>
            </div>
          </div>
        </div>

        {/* Cuerpo del Recibo */}
        <div className="bg-brand-white shadow-xl rounded-b-2xl overflow-hidden border-x border-b border-gray-200">
          
          <div className="p-8 grid md:grid-cols-2 gap-8">
            
            {/* Sección Izquierda: Información del Cliente */}
            <section className="space-y-4">
              <h2 className="text-brand-primary font-bold uppercase tracking-wider text-xs border-b border-gray-100 pb-2">
                Información del Cliente
              </h2>
              <div>
                <p className="text-gray-500 text-xs">Nombre / Razón Social</p>
                <p className="font-semibold text-brand-primary">
                  {payment.customer_name_snapshot || payment.customers?.name}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">DNI / Documento</p>
                <p className="font-semibold text-brand-primary">
                  {payment.customer_dni_snapshot || payment.customers?.dni}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Email de contacto</p>
                <p className="font-medium">{payment.customers?.email || "No registrado"}</p>
              </div>
            </section>

            {/* Sección Derecha: Detalles de la Reserva */}
            <section className="space-y-4">
              <h2 className="text-brand-primary font-bold uppercase tracking-wider text-xs border-b border-gray-100 pb-2">
                Detalle del Servicio
              </h2>
              <div className="bg-brand-secondary/50 p-4 rounded-xl border border-brand-primary/5">
                <p className="text-brand-primary font-bold text-lg">{payment?.bookings?.fields.name}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <span className="bg-brand-primary text-brand-white text-[10px] px-2 py-0.5 rounded">RESERVA</span>
                  <span>{dayjs(payment.bookings.start_time).format("LLLL")}</span> 
                </div>
                <p className="text-xs mt-1 text-gray-500">
                   Duración: {payment.bookings?.duration_minutes} minutos
                </p>
              </div>
            </section>

          </div>

          {/* Tabla de Precios (Corte de recibo) */}
          <div className="px-8 py-6 bg-gray-50 border-t border-dashed border-gray-300 relative">
             {/* Círculos decorativos para efecto ticket */}
            <div className="absolute -left-3 -top-3 w-6 h-6 bg-brand-secondary rounded-full border-r border-gray-300"></div>
            <div className="absolute -right-3 -top-3 w-6 h-6 bg-brand-secondary rounded-full border-l border-gray-300"></div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Monto Base</span>
                <span className="font-medium">{formatCurrency(payment.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Descuento aplicado</span>
                <span className="text-brand-accent-hover font-medium">-{formatCurrency(payment.discount)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
                <span className="text-brand-primary font-bold text-xl">TOTAL PAGADO</span>
                <span className="text-brand-primary font-black text-2xl">{formatCurrency(payment.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer del Detalle */}
          <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-brand-white text-xs font-bold">
                {payment.users?.name?.charAt(0) || "S"}
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Atendido por</p>
                <p className="text-sm font-semibold">{payment.users?.name || "Sistema"}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
                <button className="px-6 py-2 rounded-full border border-brand-primary text-brand-primary font-bold text-sm hover:bg-brand-primary hover:text-brand-white transition-colors">
                    Imprimir
                </button>
                <button className="px-6 py-2 rounded-full bg-brand-primary text-brand-white font-bold text-sm hover:opacity-90 shadow-md">
                    Descargar PDF
                </button>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-gray-400 text-xs">
            Este es un comprobante de pago electrónico generado por Pukllay App.
        </p>
      </div>
    </main>
  );
}