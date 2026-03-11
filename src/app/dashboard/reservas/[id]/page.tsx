"use client";

import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useParams, useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Calendar, User, Trophy, CreditCard, Clock, IdCard } from 'lucide-react';
import { getBookingIdAction, getReservasPorCampoPorFecha, updateBookingAction } from '@/actions/booking';
import { getFieldIdReservations, getFields } from '@/actions/fields'
import { useUser } from '@/context/UserContext';
//import { updateBookingAction } from '@/app/actions/bookings';
import { getSession } from '@/lib/jwt/auth-utils';



// Configuración de Dayjs
dayjs.extend(utc);
dayjs.extend(timezone);


const EditReserva = () => {


  const router = useRouter();
  const params = useParams();
  const bookingId = String(params.id || "");
  const { user } = useUser()

  const TIMEZONE = "America/Lima";

  // --- ESTADOS ---
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false); // Para el Skeleton
  const [fields, setFields] = useState<any[]>([]);
  const [isEditable, setIsEditable] = useState<Record<string, boolean>>({});

  const [baseDate, setBaseDate] = useState<string>(dayjs().tz(TIMEZONE).format('YYYY-MM-DD'));
  const [bookingsData, setBookingsData] = useState<any[]>([]);

  // --- 1. CARGA INICIAL DE LA RESERVA ---
  useEffect(() => {
    const loadBooking = async () => {
      const res: any = await getBookingIdAction(bookingId);
      if (res.success) {
        setBooking(res.content);
        console.log("horas disponobles update booking")
        console.table(res.content);

        // Sincronizar fecha inicial con la reserva
        const reservationDate = dayjs(res.content?.start_time).tz(TIMEZONE).format('YYYY-MM-DD');
        setBaseDate(reservationDate);
      }

      // Cargar campos activos
      const fieldsRes = await getFields();
      if (fieldsRes.success) {
        setFields(fieldsRes.content);

      }

      setLoading(false);
    };
    loadBooking();
  }, [bookingId]);

  // --- 2. CARGA DE RESERVAS DEL DÍA (Para disponibilidad) ---
  useEffect(() => {
    const fetchAvailability = async () => {
      console.log(" load reservas por campo disponibles")
      if (!booking?.field_id || !baseDate) return;
      setFetchingSlots(true);
      console.warn("antes de res")
      //const res:any = await getReservasPorCampoPorFecha(booking.field_id, baseDate);
      const res: any = await getFieldIdReservations(booking.field_id, baseDate);
      if (res.success) {
        console.warn("dentro del if edit")
        setBookingsData(res.content);
        console.log("reservas disponobles por campo y fecha bookisData")
        console.log(bookingsData)
      }
      setFetchingSlots(false);
    };
    fetchAvailability();
  }, [baseDate, booking?.field_id]);

  // --- 3. LÓGICA DE SLOTS DISPONIBLES (Tu lógica de FieldCard) ---
  // const getAvailableSlots = () => {
  //   console.warn("tabla boogindata dentreo de getAvailables")
  //   console.table(bookingsData)
  //   const openTime = 8;
  //   const closeTime = 24;
  //   const slots = [];

  //   const nowInLima = dayjs().tz(TIMEZONE);
  //   const isSelectedDateToday = baseDate === nowInLima.format('YYYY-MM-DD');

  //   for (let hour = openTime; hour <= closeTime; hour++) {
  //     const timeLabel = `${hour.toString().padStart(2, '0')}:00`;

  //     // Verificamos si la hora ya pasó o es la hora actual (bloqueo inmediato)
  //     let isPast = false;
  //     if (isSelectedDateToday) {
  //       // Bloquea si la hora del slot es menor O IGUAL a la hora actual de Lima
  //       isPast = hour <= nowInLima.hour();
  //     }

  //     // Verificamos si está ocupada en el servidor
  //     const isOccupied = bookingsData?.some((b: any) => {
  //       const bookingHour = dayjs(b.start_time).tz(TIMEZONE).hour();
  //       return bookingHour === hour;
  //     });

  //     // La hora actual de la reserva SIEMPRE debe ser seleccionable aunque esté ocupada
  //     const isCurrentReservationSlot = booking?.start_time && dayjs(booking.start_time).tz(TIMEZONE).hour() === hour && isSelectedDateToday;

  //     slots.push({
  //       hour,
  //       label: timeLabel,
  //       // Disponible si no está ocupada y no ha pasado (o si es la reserva que estamos editando)
  //       available: (!isOccupied && !isPast) || isCurrentReservationSlot,
  //       reason: isOccupied ? 'OCUPADO' : (isPast ? 'PASADO' : 'LIBRE')
  //     });
  //   }
  //   return slots;
  // };

  const availableSlots = useMemo(() => {
    console.log("Recalculando slots por cambio en datos de reservas...");

    const openTime = 8;
    const closeTime = 23; // Representa el último slot (23:00 - 00:00)
    const slots = [];

    const nowInLima = dayjs().tz(TIMEZONE);
    const isSelectedDateToday = baseDate === nowInLima.format('YYYY-MM-DD');

    for (let hour = openTime; hour <= closeTime; hour++) {
      const timeLabel = `${hour.toString().padStart(2, '0')}:00`;

      // 1. Identificar si es el slot que el usuario ya tiene reservado (Modo Edición)
      // Usamos ?. por seguridad si booking es null
      const isCurrentReservationSlot =
        booking?.start_time &&
        dayjs(booking.start_time).tz(TIMEZONE).hour() === hour &&
        isSelectedDateToday;

      // 2. Verificar si la hora ya pasó
      let isPast = false;
      if (isSelectedDateToday) {
        isPast = hour <= nowInLima.hour();
      }

      // 3. Verificar ocupación por otros (Excluyendo la reserva actual si existe)
      // Filtramos bookings que NO sean el que estamos editando para que no se auto-bloquee
      const isOccupiedByOthers = bookingsData?.some((b: any) => {
        const bHour = dayjs(b.start_time).tz(TIMEZONE).hour();
        // Está ocupado si la hora coincide Y no es el ID de la reserva que editamos
        const isDifferentBooking = booking?.id ? b.id !== booking.id : true;
        return bHour === hour && isDifferentBooking;
      });

      // --- ASIGNACIÓN DE ESTADO CON JERARQUÍA ---
      let reason: 'LIBRE' | 'PASADO' | 'OCUPADO' | 'ACTUAL' = 'LIBRE';
      let available = false;

      if (isCurrentReservationSlot) {
        reason = 'ACTUAL';
        available = true; // Siempre disponible porque es la que estamos editando
      } else if (isPast) {
        reason = 'PASADO';
        available = false; // Bloqueado por tiempo
      } else if (isOccupiedByOthers) {
        reason = 'OCUPADO';
        available = false; // Bloqueado por otro usuario
      } else {
        reason = 'LIBRE';
        available = true;  // ¡Disponible para reservar!
      }

      slots.push({
        hour,
        label: timeLabel,
        available,
        reason
      });
    }

    return slots;
  }, [bookingsData, baseDate, booking, TIMEZONE]);
  // ^ Cada vez que uno de estos cambie, la función se ejecutará de nuevo.

  // --- COMPONENTES INTERNOS ---
  const SkeletonSlots = () => (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {[...Array(15)].map((_, i) => (
        <div key={i} className="h-10 w-full bg-brand-gray/50 animate-pulse rounded-xl border border-gray-100" />
      ))}
    </div>
  );


  const handleTimeSelection = (hour: number) => {
    // Creamos la nueva fecha basada en el baseDate y la hora elegida
    const newStartTime = dayjs.tz(baseDate, TIMEZONE).hour(hour).minute(0).second(0).toISOString();

    // Actualizamos el objeto booking (puedes usar setBooking o similar)
    setBooking({ ...booking, start_time: newStartTime });
  };

  /*  update */

  // ... dentro de tu componente EditReserva ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Preparamos la data que espera tu backend
    // Nota: Enviamos solo lo necesario para no sobrecargar el body
    const updateData = {
      fieldId: booking.selectedId,
      customerName: booking.manual_customer_name.toLowerCase(),
      customerDNI: booking.manual_customer_dni,
      startTime: booking.start_time,
    };

    const result = await updateBookingAction(booking.id, updateData);

    if (result.success) {
     // console.log("✅ ¡Excelente! Reserva actualizada.", result); // Aquí puedes usar Sonner o Toast
      router.push(`/dashboard/reservas`);
      router.refresh();
    } else {
      // Aquí se mostrará el mensaje: "No puedes editar con menos de 2 horas..."
      alert(`❌ Error: ${result.message}`);
    }

    setSaving(false);
  };
  /* bloquea el boton si si an npasado menos de 2 horas */
  const isTooLateToEdit = () => {
    if (!booking?.start_time) return false;
    const now = dayjs();
    const start = dayjs(booking.start_time);
    return start.diff(now, 'hour', true) < 2;
  };



  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="animate-spin text-brand-accent-hover" size={40} />
      <p className="text-[10px] font-black text-brand-black uppercase tracking-widest">Cargando Reserva...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-brand-primary mb-6 font-black text-[10px] uppercase">
          <ArrowLeft size={14} /> Volver al control
        </button>

        <div className="bg-brand-secondary rounded-[2.5rem] shadow-2xl border border-brand-primary/40 overflow-hidden">
          {/* Header Superior */}
          <div className="bg-brand-primary/90 p-8 text-white flex justify-between items-center">
            <div>
              <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.3em]">Usuario Editor</span>
              <h1 className="text-2xl font-black uppercase leading-tight">{user?.name}</h1>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hidden md:block">
              <Calendar className="text-brand-accent" size={32} />
            </div>
          </div>

          <form className="p-8 md:p-12 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* SECCIÓN IZQUIERDA: DATOS */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Creado por (User)</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      value={user?.name || ""}
                      readOnly
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-brand-gray bg-slate-50 text-slate-400 font-bold text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Cliente</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      value={booking?.manual_customer_name || ""}
                      onChange={(e) => setBooking({ ...booking, manual_customer_name: e.target.value })}
                      disabled={!isEditable.manual_customer_name}
                      className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 font-bold text-sm transition-all
                      ${isEditable.manual_customer_name ? 'border-brand-accent-hover bg-white' : 'border-brand-primary/10 bg-slate-50 text-slate-400'}`}
                    />
                    <button type="button" onClick={() => setIsEditable({ ...isEditable, manual_customer_name: !isEditable.customerName })} className="absolute right-4 top-1/2 -translate-y-1/2">
                      {isEditable.manual_customer_name ? '🔓' : '🔒'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DNI del Cliente</label>
                  <div className="relative">
                    <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      value={booking?.manual_customer_dni || ""}
                      maxLength={8}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ''); // Solo números
                        if (val.length <= 8) {
                          setBooking({ ...booking, manual_customer_dni: val });
                        }
                      }}
                      disabled={!isEditable.manual_customer_dni}
                      className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 font-bold text-sm transition-all
                      ${isEditable.manual_customer_dni ? 'border-brand-accent bg-white' : 'border-brand-primary/20 bg-slate-50 text-slate-400'}`}
                    />
                    <button type="button" onClick={() => setIsEditable({ ...isEditable, manual_customer_dni: !isEditable.manual_customer_dni })} className="absolute right-4 top-1/2 -translate-y-1/2">
                      {isEditable.manual_customer_dni ? '🔓' : '🔒'}
                    </button>
                  </div>
                  <p className="text-[9px] text-gray-500 italic ml-2">
                    * Máximo 8 dígitos. Si su documento es más largo, ingrese los primeros 8.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cancha (Cambiar Espacio)</label>
                  <div className="relative">
                    <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      value={booking?.field_id}
                      disabled={!isEditable.field}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedField = fields.find(f => f._id === selectedId);
                        setBooking({ ...booking, field_id: selectedId });
                        console.log("campo selecionado ", selectedId)
                      }}
                      className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 font-bold text-sm appearance-none outline-none transition-all
                      ${isEditable.field ? 'border-brand-accent bg-brand-secondary' : 'border-brand-primary/20 bg-slate-50 text-slate-400 cursor-not-allowed'}`}
                    >
                      {fields.map((f: any) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => setIsEditable({ ...isEditable, field: !isEditable.field })} className="absolute right-4 top-1/2 -translate-y-1/2">
                      {isEditable.field ? '🔓' : '🔒'}
                    </button>
                  </div>
                </div>

                <div className="bg-brand-gray/20 p-6 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-3 rounded-xl shadow-sm text-brand-accent"><CreditCard /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Total Pagado</p>
                      <p className="text-xl font-black text-brand-primary">S/ {booking?.total_price}</p>
                    </div>
                  </div>
                </div>
              </div>

{/* SECTION TIME GRIG */}

              <div className="space-y-3">
                 <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">1. Elegir Fecha</label>
                  <input
                    type="date"
                    value={baseDate}
                    min={dayjs().tz(TIMEZONE).format('YYYY-MM-DD')}
                    disabled={!isEditable.time}
                    onChange={(e) => setBaseDate(e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-brand-primary/20 font-bold text-sm focus:border-brand-accent-hover outline-none"
                  />
                </div>
                {/* Cabecera de la Sección */}
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    2. Bloque Horario
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsEditable({ ...isEditable, time: !isEditable.time })}
                    className={`text-xs font-bold uppercase transition-colors ${isEditable.time ? "text-green-500 underline" : "text-brand-accent underline"
                      }`}
                  >
                    {isEditable.time ? "✔ Confirmar" : "✎ Cambiar Hora"}
                  </button>
                </div>

                {fetchingSlots ? (
                  <SkeletonSlots />
                ) : isEditable.time ? (
                  /* MODO EDICIÓN: Grilla de Slots */
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map((slot) => {
                      // Determinamos el estilo basado en el "reason" que viene del useMemo
                      const isSelected = slot.reason === 'ACTUAL';
                      const isOccupied = slot.reason === 'OCUPADO';
                      const isPast = slot.reason === 'PASADO';

                      return (
                        <button
                          key={slot.hour}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => handleTimeSelection(slot.hour)}
                          className={`relative py-2 rounded-xl border-2 text-[12px] font-black transition-all active:scale-95
                    ${isSelected
                              ? 'bg-brand-primary border-brand-primary text-white shadow-lg -translate-y-1'
                              : slot.available
                                ? 'bg-brand-accent/30 border-brand-accent/30 text-brand-primary hover:border-brand-accent hover:bg-brand-accent hover:text-white'
                                : isOccupied
                                  ? 'bg-red-100 border-red-200 text-red-500 cursor-not-allowed opacity-70'
                                  : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                            }`}
                        >
                          {slot.label}
                          {/* Pequeño indicador visual del estado */}
                          <span className="block text-[8px] mt-0.5 opacity-60">
                            {slot.reason === 'ACTUAL' ? 'TU HORA' : slot.reason}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* MODO LECTURA: Vista de Hora Confirmada */
                  <div className="p-4 bg-brand-black rounded-2xl flex items-center justify-between border-2 border-brand-accent/20 animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center gap-3 text-brand-accent">
                      <Clock size={18} className="animate-pulse" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-500 uppercase leading-none">Hora Seleccionada</span>
                        <span className="font-black text-lg tracking-tight">
                          {dayjs(booking?.start_time).tz(TIMEZONE).format('hh:00 A')}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-2 py-1 bg-brand-accent/10 rounded-lg text-[9px] font-black text-brand-accent border border-brand-accent/20">
                        RESERVADO
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={saving}
              className="w-full bg-brand-primary/90 text-brand-accent font-black py-5 rounded-3xl flex items-center justify-center gap-4 hover:scale-[1.01] transition-all shadow-2xl disabled:opacity-50 uppercase tracking-[0.2em] text-xs mt-4"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              {saving ? "Procesando cambios..." : "Actualizar Reserva"}
            </button>


          </form>
        </div>
      </div>
    </div>
  );
};

export default EditReserva;