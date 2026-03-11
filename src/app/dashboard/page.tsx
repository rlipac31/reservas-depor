'use client';
import { useEffect, useState } from 'react';
import { RefreshCw, LayoutDashboard } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { db_getDashboardDataAction, getDashboardDataAction } from '@/actions/dashboard'; // Importa el action
import { DashboardStats } from '@/types/dashboard';
import {
    KpiSection,
    TimelineSection,
    NextMatchAlert,
    FieldRankingSection,
    HeatmapSection
} from '@/components/dashboard/dashboardComponents';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

export default function SoccerDashboard() {
    const { user } = useUser();
    const [data, setData] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currency ="S/";

    console.warn(" user desde  login")
         console.table(user)


    const fetchData = async (force = false) => {
        setLoading(true);
        const result:any = await  getDashboardDataAction(force);
        console.warn("data dashboard")
        console.group("data de dashboard")
        console.table(result.data);
        console.log(result.data)
        console.groupEnd();
        if (result.success && result.data) {
            setData(result.data);
            setError(null);
        } else {
            setError(result.error || "Error al conectar");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);



//     if (loading) return (
//     <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
//         <div className="p-4 bg-white rounded-2xl shadow-[4px_4px_0px_0px_black] border-2 border-black">
//            <RefreshCw className={`text-brand-primary ${loading ? 'animate-spin' : ''}`} size={48} />
//         </div>
//         <p className="font-black uppercase tracking-tighter">Sincronizando con la cancha...</p>
//     </div>
// );
    if(loading)return <DashboardSkeleton/>;

    if (error || !data) return (
        <div className="p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button  onClick={() => fetchData(true)} className="bg-brand-primary text-white px-6 py-2 rounded-xl">Reintentar</button>
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between gap-4">
                <div className=' flex items-center gap-4'>
                <div className="p-3 bg-brand-accent-hover text-brand-primary rounded-2xl shadow-[4px_4px_0px_0px_black]">
                    <LayoutDashboard size={28} />
                </div>
                {/* Botón de Refrescar Manual */}
               
                   
                <div>
                    <h1 className="text-3xl font-black uppercase">Panel de Control</h1>
                    <p className="text-gray-500">Bienvenido, {user?.name}</p>
                </div>
                </div>
                 <button 
                        onClick={() => fetchData(true)} // Aquí forzamos el refresco
                        disabled={loading}
                        className="p-3  bg-brand-accent border border-brand-accent-hover rounded-xl hover:bg-brand-primary  hover:text-brand-accent-hover transition-colors shadow-[2px_2px_0px_0px_black] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                        title="Actualizar datos (Limpia caché)"
                    >
                        <RefreshCw className={`${loading ? 'animate-spin' : ''}`} size={20} />
                    </button>
               
                 
            </header>

            <KpiSection kpis={data.kpis} currency={currency} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <TimelineSection bookings={data.timeline} />
                </div>
                <div className="space-y-6">
                    <NextMatchAlert nextMatch={data.proximoPartido} currency={currency} />
                    <FieldRankingSection ranking={data.rankingCampos ?? []} currency={currency} />
                    <HeatmapSection items={data.mapaCalor ?? []} />
                </div>
            </div>
        </div>
    );
}