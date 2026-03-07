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
  id: string; // ID de Prisma
  customerName: string;
  startTime: Date | string;
  endTime: Date | string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'; // Enums de tu DB
  fieldName: string;
  minutosParaInicio: number;
}

export interface FieldRanking {
  name: string;
  totalGenerado: number;
  vecesReservada: number;
}

export interface HeatmapItem {
  dia: number;  // 0-6 (Domingo a Sábado)
  hora: number; // 0-23
  cantidad: number;
}

export interface DashboardStats {
  kpis: DashboardKPIs;
  timeline: TimelineBooking[];
  proximoPartido: TimelineBooking | undefined;
  rankingCampos: FieldRanking[];
  mapaCalor: HeatmapItem[];
}

// Estructura para la respuesta de los Server Actions
export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}