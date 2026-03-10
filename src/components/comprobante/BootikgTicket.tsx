"use client";
import { useState } from "react";
import { Printer, Download, QrCode, CheckCircle2 } from "lucide-react";
import dayjs from "dayjs";
import { useUser } from "@/context/UserContext";





import { QRCodeSVG } from "qrcode.react";

export default function BookingTicket({ booking }: { booking: any }) {

  const [isDownloading, setIsDownloading] = useState(false);

  const { user } = useUser();

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Fecha inválida"; // Validación por si el string no es fecha

    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "--:--";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Hora inválida";

    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };


  const currency={
    symbol:'S/',
    modeda:'Soles'
  }


  /*  logica para descargar comprobante */



  /*  fin de comprobante */

  const qrUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/dashboard/pagos?filter=${encodeURIComponent(booking.ref)}`
    : `/dashboard/pagos?filter=${encodeURIComponent(booking.ref)}`;

  // // Log para depuración - Ayuda al usuario a ver qué se está codificando
  if (typeof window !== 'undefined') {
    console.log("QR URL construida:", qrUrl);
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto py-4">

      {/* CONTENEDOR DEL TICKET */}
      <div
        id="printable-ticket"
        className="bg-white text-slate-900 p-8 rounded-sm shadow-2xl w-full relative border-t-[12px] border-brand-gold print:shadow-none print:m-0"
      >
        {/* Agujeros laterales estéticos de ticket */}
        <div className="absolute -left-3 top-1/2 w-6 h-6 bg-brand-black rounded-full print:hidden"></div>
        <div className="absolute -right-3 top-1/2 w-6 h-6 bg-brand-black rounded-full print:hidden"></div>

        <div className="text-center space-y-1 mb-6 border-b border-dashed border-slate-300 pb-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">{booking.business || 'ARENA PROMETEO'}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comprobante de Reserva</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Cancha</span>
            <span className="text-sm font-black text-right text-[14px] ">{booking?.campoName || 'Cancha Premium 66'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Fecha</span>
            <span className="text-sm font-bold text-[10px] uppercase ">{formatDate(booking.fechaJuegoLocal)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Horario</span>
            <span className="text-sm font-bold text-[10px] uppercase">
              Inicio {booking.horaInicio} - Fin {booking.horaFin}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Duracion</span>
            <span className="text-sm font-bold text-[10px] uppercase">
              {booking.duracion} minutos
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Cliente</span>
            <span className="text-sm font-bold text-[10px] uppercase">
              {booking.cliente}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Precio</span>
            <span className="text-sm font-bold text-[10px] uppercase">
              {currency?.symbol || "$"} {booking.precio}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Descuento</span>
            <span className="text-sm font-bold text-[10px] uppercase">
              {booking.descuento}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Metodo de Pago</span>
            <span className="text-sm font-bold text-[10px] uppercase">
              {booking.metodoPago}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Telefono De Pago</span>
            <span className="text-sm font-bold text-[12px] uppercase">
              {booking.ref}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Fecha De Pago</span>
            <span className="text-sm font-bold text-[10px] uppercase">
              {booking.fechaPago} - {booking.horaPago}
            </span>
          </div>


          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Referencia</span>
            <span className="text-sm font-mono font-bold tracking-tighter">
              #{booking.ref.slice(-10).toUpperCase() || 'PROMETEO-X'}

            </span>
          </div>

          <div className="pt-6 border-t border-dashed border-slate-300">
            <div className="flex justify-between items-end ">
              <div className="w-2/3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Estado</span>
                <div className="flex items-center gap-1 text-green-600 font-black text-xs uppercase">
                  <CheckCircle2 size={14} /> {booking.estado === 'COMPLETED' ? 'Pago Confirmado' : booking.estado.toUpperCase()}

                </div>
                {booking.estado !== 'COMPLETED' && (
                  <span className="text-gray-600 font-bold uppercase text-[10px] ">sI LA TRASNFERENCIA NO SE VISUALIZA  DENTRO DE 15 MINUTOS  LA RESERVA SERA CANCELADA</span>
                )}
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Pagado</span>
                <span className="text-3xl font-black">{currency?.symbol || "$"} {booking.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR de Validación Real (Local con qrcode.react) */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-2">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 hover:scale-105 transition-transform duration-300">
             <QRCodeSVG
              value={qrUrl}
              size={128} // Aumentado ligeramente para mejor lectura
              level="M" // Cambiado a M para reducir la densidad si el link es largo
              includeMargin={true} // Agregado margen para que los escáneres lo detecten mejor
            /> 
          </div>
          <div className="text-center space-y-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              ID de Pago: <span className="text-brand-black">{booking.ref.toUpperCase()}</span>
            </p>
            <p className="text-[9px] text-slate-400 font-medium uppercase leading-tight">
              Escanee para validar acceso instantáneamente
            </p>
          </div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex gap-3 w-full print:hidden">
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-brand-primary font-black py-4 rounded-2xl text-xs uppercase hover:bg-brand-primary hover:text-brand-accent transition-all shadow-lg active:scale-95"
        >
          <Printer size={18} /> Imprimir
        </button>

      </div>
    </div>
  );
}