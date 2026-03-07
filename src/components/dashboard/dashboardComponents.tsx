// components/dashboard/DashboardComponents.tsx
'use client'
import { useEffect, useState } from 'react';
import {
    Wallet, Calendar, Users, TrendingUp,
    ArrowUpRight, ArrowDownRight, Clock,
    AlertCircle, Star, Filter, Loader2
} from 'lucide-react';
import { StatCard } from './StatCard';
import { DashboardKPIs, TimelineBooking, FieldRanking, HeatmapItem, DashboardStats } from '@/types/dashboard';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { getPaymentDetailAction } from '@/actions/payments';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

// 1. KPI SECTION

// ... (mismos imports que ya tienes)

// 1. KPI SECTION (Sin cambios mayores, solo tipado)
export const KpiSection = ({ kpis, currency }: { kpis?: DashboardStats['kpis'], currency: string }) => {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Ingresos Recaudados"
                value={`${currency} ${kpis?.ingresos?.recaudado.toLocaleString() || 0}`}
                trend={`+${kpis?.nuevas24h} nuevas`}
                icon={<Wallet className="text-brand-primary" />}
            />
            <StatCard
                title="Pendiente de Cobro"
                value={`${currency} ${kpis?.ingresos?.pendiente.toLocaleString() || 0}`}
                trend={`${kpis?.cancelaciones} cancelaciones`}
                trendType="neutral"
                icon={<AlertCircle className="text-red-500" />}
            />
            <StatCard
                title="Ocupación"
                value={`${kpis?.ocupacionPorcentaje?.toFixed(0) || 0}%`}
                trend="Capacidad hoy"
                icon={<TrendingUp className="text-brand-primary" />}
            />
            <StatCard
                title="Nuevas (24h)"
                value={kpis?.nuevas24h || 0}
                trend="Últimas 24 horas"
                icon={<Users className="text-brand-primary" />}
            />
        </section>
    );
};

// 2. TIMELINE SECTION (Ajustado: status y id)
export const TimelineSection = ({ bookings }: { bookings: DashboardStats['timeline'] }) => {
    const TZ = 'America/Lima';
    const hours = Array.from({ length: 16 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);
    const fields = Array.from(new Set(bookings.map(b => b.fieldName)));

    return (
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl text-brand-primary uppercase flex items-center gap-2">
                    <Clock size={20} /> Cronograma de Hoy
                </h3>
            </div>

            <div className="relative overflow-x-auto">
                <div className="min-w-[800px]">
                    <div className="flex border-b border-gray-100 mb-4 pb-2">
                        <div className="w-40 shrink-0 font-black text-[10px] text-gray-400 uppercase">Cancha / Hora</div>
                        {hours.map(hour => (
                            <div key={hour} className="flex-1 text-center text-[10px] font-bold text-gray-400">{hour}</div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {fields.map(field => (
                            <div key={field} className="flex items-center group">
                                <div className="w-40 font-bold text-xs text-brand-primary truncate pr-2">{field}</div>
                                <div className="flex-1 flex gap-1 h-14 bg-gray-50/50 rounded-xl p-1 relative border border-dashed border-gray-200">
                                    {hours.map(hour => {
                                        const booking = bookings.find(b =>
                                            b.fieldName === field &&
                                            dayjs(b.startTime).tz(TZ).format('HH:00') === hour
                                        );

                                        return (
                                            <div key={hour} className={`flex-1 rounded-lg transition-all relative
                                                ${booking 
                                                    ? (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' 
                                                        ? 'bg-brand-accent text-brand-primary border-l-4 border-brand-primary/20 shadow-md' 
                                                        : 'bg-gray-200 text-gray-500') 
                                                    : 'hover:bg-brand-primary/10'}`}>
                                                {booking && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-1 overflow-hidden">
                                                        <span className="text-[8px] font-black truncate w-full text-center">
                                                            {booking.customerName}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 3. NEXT MATCH ALERT (Ajustado: id y status)
export const NextMatchAlert = ({ nextMatch, currency }: { nextMatch: DashboardStats['proximoPartido'], currency: string }) => {
    if (!nextMatch) return null;
    const [loading, setLoading] = useState(false);
    const router = useRouter();
      const TZ = 'America/Lima';

    const handleViewDetails = async () => {
        setLoading(true);
        // Usamos nextMatch.id (que viene del service)
        router.push(`/dashboard/reservas/${nextMatch.id}`);
        setLoading(false);
    }

    const isUrgent = nextMatch.minutosParaInicio < 60;

    


    return (
        <div className={`rounded-2xl border-2 p-6 transition-all shadow-lg ${isUrgent ? 'bg-brand-accent border-brand-primary/60  ' : 'bg-brand-primary border-brand-accent-hover text-brand-accent'
            }`}>

            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl ${isUrgent ? 'bg-brand-primary text-brand-accent-hover animate-pulse' : 'bg-brand-accent text-brand-primary'}`}>
                    <Clock size={20} />
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${isUrgent ? 'bg-brand-accent text-brand-primary' : 'bg-brand-accent text-brand-primary'
                    }`}>
                    {isUrgent ? '¡Empieza Pronto!' : 'Siguiente Partido'}
                </div>
            </div>

            <h4 className={`text-xl font-black capitalize mb-1 ${isUrgent ? 'text-brand-accent' : 'text-brand-primary'}`}>
                {nextMatch.customerName}
            </h4>
            <div className={`text-sm font-bold mb-4 ${isUrgent ? 'text-brand-accent/80 ' : 'text-gray-400'}`}>
                {/* {nextMatch.fieldName} • {(TZ ? dayjs(nextMatch.startTime).tz(TZ) : dayjs(nextMatch.startTime)).format('HH:mm')} hs */}
                {nextMatch.fieldName} • {dayjs(nextMatch.startTime).format('HH:mm')}
            </div>

            <div className={`p-4 rounded-xl flex items-center justify-between ${isUrgent ? 'bg-brand-gol/50 border border-brand-primary/20  animate-pulse' : 'bg-white/5 border border-white/10'
                }`}>
                <div>
                    <p className="text-[9px] font-black text-brand-secondary uppercase opacity-60">Faltan:</p>
                    <p className="text-lg font-black text-brand-accent" >{nextMatch.minutosParaInicio} min</p>
                </div>
                <button
                    onClick={handleViewDetails}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg font-black text-xs transition-transform hover:scale-105 flex items-center gap-2 ${isUrgent ? 'bg-brand-accent text-brand-primary shadow-md' : 'bg-brand-primary text-brand-accent'
                        }`}>
                    {loading ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            CARGANDO...
                        </>
                    ) : (
                        'DETALLE'
                    )}
                </button>

            </div>
        </div>
    );
};

// ... (FieldRankingSection y HeatmapSection se mantienen similares pero usando DashboardStats['rankingCampos'] etc)



// 4. FIELD RANKING
export const FieldRankingSection = ({ ranking, currency }: { ranking: FieldRanking[], currency: string }) => {
    const maxRevenue = Math.max(...ranking.map(r => r.totalGenerado), 1);
    console.warn("cmapo dashboard")
   // console.table(field)
    console.warn("raniki dashboard")
    console.table(ranking)

    return (
        <div className="bg-brand-secondary rounded-2xl border-2 border-brand-primary/5 p-6">
            <h3 className="font-black text-lg text-brand-primary uppercase mb-6 flex items-center gap-2">
                <Star size={18} className="text-brand-primary" /> Ranking de Canchas
            </h3>
            <div className="space-y-6">
                {ranking.map((field:any, index) => (
                    <div key={field.id} className="space-y-2">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase block">Puesto #{index + 1}</span>
                                <span className="font-bold text-sm text-brand-primary">{field.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-black text-brand-primary block">{currency}{field.totalGenerado}</span>
                                <span className="text-[9px] font-bold text-gray-500 uppercase">{field.vecesReservada} usos</span>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-brand-accent transition-all duration-1000"
                                style={{ width: `${(field.totalGenerado / maxRevenue) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Actualización del HeatmapSection ---
export const HeatmapSection = ({ items }: { items: HeatmapItem[] }) => {
    // 1. Agregamos por hora (Simplificado porque ahora el item ya trae la hora plana)
    const totalsByHour = items.reduce((acc, curr) => {
        acc[curr.hora] = (acc[curr.hora] || 0) + curr.cantidad;
        return acc;
    }, {} as Record<number, number>);

    // 2. Extraer horas pico dinámicamente
    const dynamicPeaks = Object.entries(totalsByHour)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([hour]) => parseInt(hour))
        .sort((a, b) => a - b);

    const maxVal = Math.max(...Object.values(totalsByHour), 1);

    return (
        <div className="bg-brand-primary rounded-2xl p-6 text-brand-accent-hover shadow-xl">
            <h3 className="font-bold text-lg mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-brand-primary" /> Tendencia
                </div>
            </h3>
            <div className="grid grid-cols-6 gap-2 h-24 items-end">
                {dynamicPeaks.map(hour => (
                    <div key={hour} className="flex-1 flex flex-col items-center justify-end gap-2 h-full group">
                        <div 
                            className="w-full bg-brand-accent rounded-t-sm transition-all duration-500"
                            style={{ 
                                height: `${(totalsByHour[hour] / maxVal) * 100}%`,
                                opacity: 0.5 + (totalsByHour[hour] / maxVal) * 0.5
                            }}
                        />
                        <span className="text-[10px] font-black text-gray-500">{hour}h</span>
                    </div>
                ))}
            </div>
        </div>
    );
};