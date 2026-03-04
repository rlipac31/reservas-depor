// types/dashboard.ts

export interface DashboardKPIs {
    ingresos: {
        recaudado: number;
        pendiente: number;
    };
    ocupacionPorcentaje: number;
    cancelaciones: number;
    nuevas24h: number;
}

export interface TimelineBooking {
    _id: string;
    startTime: string;
    endTime: string;
    customerName: string;
    state: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
    fieldName: string;
    minutosParaInicio: number;
}

export interface FieldRanking {
    _id: string;
    totalGenerado: number;
    vecesReservada: number;
    name: string;
}

export interface HeatmapItem {
    _id: {
        dia: number; // 1-7
        hora: number; // 0-23
    };
    cantidad: number;
}

export interface DashboardResponse {
    kpis: DashboardKPIs;
    timeline: TimelineBooking[];
    proximoPartido: TimelineBooking | null;
    rankingCampos: FieldRanking[];
    mapaCalor: HeatmapItem[];
}
