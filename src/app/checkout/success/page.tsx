"use client";

import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ReceiptText, Clock, Hash, Share2, Link } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { SearchParams } from "next/dist/server/request/search-params";
//componente comprobante
import BookingTicket from '@/components/comprobante/BootikgTicket'

//para boton compartir 
import dayjs from "dayjs";

function SuccessContent() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();



  const business = searchParams.get("business");
  const campo = searchParams.get("campo") || "Cancha";
  const cliente = searchParams.get("cliente");
  const precio = searchParams.get("precio");
  const descuento = searchParams.get("descuento");
  const total = searchParams.get("total");
  const fechaJuegoLocal = searchParams.get("fechaJuego");
  const inicio = searchParams.get("inicio");
  const fin = searchParams.get("fin");
  const duracion = searchParams.get("duracion");
  const estado = searchParams.get("estado");
  const metodoPago = searchParams.get("metodoPago");
  const fechaPago = searchParams.get("fechaPago");
  const refePago = searchParams.get("refePago");

  /////

    // business:'Mi_Negocio',
    //                 idPago: result.data.payment.id,
    //                 campo:result.data.field.name,
    //                 precio:result.data.field.price_per_hour,
    //                 cliente:result.data.payment.name_customer_snapshot,
    //                 fechaJuego:result.data.booking.start_time,
    //                 inicio:result.data.booking.start_time,
    //                 fin:result.data.booking.end_time,
    //                 duracion:result.data.bookimg.duration_minutes,
    //                 estado:result.data.payment.status,
    //                 descuento:result.data.payment.discount,
    //                 total:result.data.payment.total,
    //                 metodoPago:result.data.payment.payment_method,
    //                 fechaPago:result.data.payment.payment_date,
    //                 refePago:result.data.payment.payment_reference ||''



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

  const horaInicio = formatTime(inicio);
  //const fechaJuego = formatDate(inicio);
  const horaFin = formatTime(fin);
  const fechaDePago = formatDate(fechaPago);
  const horaPago = formatTime(fechaPago)

  /*  useEffect(() => {
     const timer = setTimeout(() => {
       router.push(`/${user?.slug}/dashboard/campos`);
     }, 15000);
 
     return () => clearTimeout(timer);
   }, [router]); */
  //////////
  /*  Boton compartir*/

  const currency={
    symbol:'S/',
    modeda:'Soles'
  }

  const handleShare = async () => {
    // Formateamos los datos para el mensaje
    //  const formattedDate = dayjs().format('dddd D [de] MMMM');
    const shareData = {
      title: '¡Cancha Reservada! ⚽',
      text:
        `Hola Gente soy: ${cliente} y reserve la` +
        ` ${campo}\n` +
        ` para el dia  ${fechaJuegoLocal}\n` +
        ` Desde ${horaInicio} hasta las: ${horaFin} ...\n\n` +
        ` ¡Puntuales por favor!!!`,
      url: window.location.origin // O un link específico si lo tienes
    };

    try {
      // Si el navegador soporta el menú nativo (Móviles/Safari)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback para PC (WhatsApp Web)
        const waMessage = encodeURIComponent(shareData.text);
        window.open(`https://wa.me/?text=${waMessage}`, '_blank');
      }
    } catch (err) {
      console.log('El usuario canceló el compartir o hubo un error');
    }
  };

  const dataTikeck = {
    business: business || 'Mi Negocio',
    campoName: campo || '',
    cliente: cliente || '',
    precio: precio || '',
    descuento: descuento || '',
    total: total || '',
    inicio: inicio || '',
    fin: fin || '',
    duracion: duracion || '',
    estado: estado || '',
    metodoPago: metodoPago || '',
   // phonePayment: phonePayment || '',
    fechaPago: fechaDePago || '',
    horaPago: horaPago || '',
    ref: refePago || '',
    // Agregamos los ya formateados para que el ticket sea legible
    horaInicio,
    horaFin,
    fechaJuegoLocal
  };


  /* fin boton compartir */

  return (
    <div className="flex flex-row gap-10 items-center">
      <div className="bg-brand-primary p-2  md:p-8 rounded-2xl border border-brand-accent/70 text-center max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-6">
          <div className="bg-brand-primary border-brand-accent p-4 rounded-full">
            <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16  text-brand-accent border-brand-accent" />
          </div>
        </div>

        <h1 className="text-xl md:2xl lg:text-3xl  font-bold text-brand-secondary mb-2 italic uppercase">
          ¡Reserva Confirmada!
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-brand-accent-hover mb-2 italic uppercase">{business}</h2>

        {/* Ticket de Reserva Estilo "Arena Prometeo" */}
        <div className="bg-brand-primary rounded-xl p-5 mb-8  border-white/10 text-left space-y-4 relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-brand-accent border-brand-accent text-[10px] uppercase font-black tracking-widest">Cancha</p>
              <p className="text-brand-white font-bold">{campo}</p>
              <p className="text-brand-accent border-brand-accent text-[10px] uppercase font-black tracking-widest">Cliente</p>
              <p className="text-brand-secondary font-medium text-[12px] md:text-[15px]">{cliente || 'cliente'} </p>
            </div>
            <ReceiptText size={20} className="text-brand-white/20" />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
            <div>
              <p className="text-brand-accent border-brand-accent text-[10px] uppercase font-black tracking-widest flex items-center gap-1">
                <Clock size={10} /> Horario
              </p>
              <p className="text-brand-white text-sm">Inicio:{horaInicio || "Por confirmar"}</p>
              <p className="text-brand-white text-sm">Fin: {horaFin || "Por confirmar"}</p>
              <p className="text-brand-white text-sm">duracion: {duracion || "Por confirmar"} minutos</p>
            </div>
            <div>
              <p className="text-brand-accent border-brand-accent text-[10px] uppercase font-black tracking-widest flex items-center gap-1">
                <Hash size={10} /> Referencia
              </p>
              <p className="text-brand-white text-sm font-mono">{refePago?.slice(0, 12).toUpperCase() || "N/A"}</p>
              <p className="text-brand-white text-sm font-mono">Precio: {currency?.symbol || "$"}{precio || "0.0"}</p>
              <p className="text-brand-white text-sm font-mono">Descuento {descuento || "0.0"}%</p>
            </div>
          </div>
          <div>
            <p className="text-brand-accent font-medium uppercase   text-[12px] md:text-[12px]">Fecha De Pago: {formatDate(fechaPago)}</p>
            {/* <p className="text-brandborder-brand-accent font-medium uppercase text-[12px] md:text-[12px]">Metodo De Pago: <span className="text-brand-white"> {metodoPago}</span> </p>
            {phonePayment && (
              <p className="text-brandborder-brand-accent font-medium uppercase text-[12px] md:text-[12px]">
                Telefono de Pago: <span className="text-brand-white"> {phonePayment}</span>
              </p>
            )} */}

          </div>
          <div className="border-t border-dashed border-white/20 pt-4 flex justify-between items-center">
            <p className="text-brand-accent font-bold uppercase text-xs">Total Pagado</p>
            <p className="text-brand-secondary border-brand-accent font-black text-xl">{currency?.symbol || "$"} {total}</p>
          </div>
        </div>

        {/* Barra de progreso y redirección */}
        <div className="space-y-3">
          <div className="h-1 w-full bg-brand-primary rounded-full overflow-hidden">
            <div className="h-full bg-brand-accent border-brand-accent animate-loading-slide"></div>
          </div>
          <p className="py-4 text-[10px] text-brand-accent uppercase tracking-widest animate-pulse">
            Generando tu pase de entrada...
          </p>
        </div>


        {/* Boton compartir */}
        <button
          onClick={handleShare}
          className="w-full group flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-gray-300 font-bold py-4 rounded-2xl text-[11px] uppercase tracking-widest hover:bg-brand-accent hover:text-brand-primary border-brand-accent transition-all duration-300"
        >
          <div className="p-2 rounded-full bg-brand-primary border-brand-accent/10 text-brand-accent border-brand-accent group-hover:scale-110 transition-transform">
            <Share2 size={18} />
          </div>
          Compartir con mi equipo
        </button>
        <button
          onClick={() => router.push(`/dashboard/campos`)}
          className="bg-brand-accent border-brand-accent hover:bg-brand-accent-hover text-brand-primary px-4 py-2 rounded-xl mt-4 uppercase font-bold text-[12px]"
        >
          volver a campos
        </button>

      </div>
      <BookingTicket booking={dataTikeck} />
    </div>

  );
}

// ... mantener el export default SuccessPage con Suspense igual que antes
export default function SuccessPage() {
  const router = useRouter()
  const { user } = useUser()
  return (
    <div className="min-h-screen bg-brand-black flex flex-row items-center justify-center p-4 border-green-700  rounded-xl">


      <Suspense fallback={
        <div className="text-brandborder-brand-accent animate-pulse uppercase font-bold tracking-widest">
          Cargando...
        </div>
      }>

        <SuccessContent />
      </Suspense>
    </div>
  );
}