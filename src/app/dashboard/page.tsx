'use client';
import { useEffect, useState } from 'react';
import { RefreshCw, LayoutDashboard } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { getDashboardDataAction } from '@/actions/dashboard'; // Importa el action
import { DashboardStats } from '@/types/dashboard';
import {
    KpiSection,
    TimelineSection,
    NextMatchAlert,
    FieldRankingSection,
    HeatmapSection
} from '@/components/dashboard/dashboardComponents';

export default function SoccerDashboard() {
    const { user } = useUser();
    const [data, setData] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currency =  "S/";

    const fetchData = async () => {
        setLoading(true);
        const result = await getDashboardDataAction();
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

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <RefreshCw className="animate-spin text-brand-accent" size={48} />
            <p className="font-black uppercase animate-pulse">Sincronizando datos...</p>
        </div>
    );

    if (error || !data) return (
        <div className="p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchData} className="bg-brand-primary text-white px-6 py-2 rounded-xl">Reintentar</button>
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex items-center gap-4">
                <div className="p-3 bg-brand-accent-hover text-brand-primary rounded-2xl shadow-[4px_4px_0px_0px_black]">
                    <LayoutDashboard size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-black uppercase">Panel de Control</h1>
                    <p className="text-gray-500">Bienvenido, {user?.name}</p>
                </div>
            </header>

            <KpiSection kpis={data.kpis} currency={currency} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <TimelineSection bookings={data.timeline} />
                </div>
                <div className="space-y-6">
                    <NextMatchAlert nextMatch={data.proximoPartido} currency={currency} />
                    <FieldRankingSection ranking={data.rankingCampos} currency={currency} />
                    <HeatmapSection items={data.mapaCalor} />
                </div>
            </div>
        </div>
    );
}