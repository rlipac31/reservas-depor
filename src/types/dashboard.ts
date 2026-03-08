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
  timeline: TimelineBooking[] | undefined;
  proximoPartido: TimelineBooking | undefined;
  rankingCampos: FieldRanking[] | undefined;
  mapaCalor: HeatmapItem[] | undefined;
}

// Estructura para la respuesta de los Server Actions
export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/// para redis

//types/dashboard.ts (o similar)
// export interface DashboardData {
//   kpis: {
//     cancelaciones: number;
//     ingresos: {
//       recaudado: number;
//       pendiente: number;
//     };
//     nuevas24h: number;
//     ocupacionPorcentaje: number;
//   };
//   mapaCalor: any[]; // Puedes definirlo más exacto según tus {x, y, value}
//   rankingCampos: any[];
//   timeline: any[];
// }

// export interface DashboardData {
//   kpis: DashboardKPIs;
//   mapaCalor: HeatmapItem; // Puedes definirlo más exacto según tus {x, y, value}
//   rankingCampos: FieldRanking;
//   timeline: TimelineBooking;
// }

export interface DashboardData {
  kpis: DashboardKPIs;
  mapaCalor: HeatmapItem[] | undefined;      // Añadido [] porque son muchos puntos
  rankingCampos: FieldRanking[] | undefined; // Añadido [] porque son varios campos
  timeline: TimelineBooking[] | undefined;   // Añadido [] porque son varias reservas
  proximoPartido?: any | undefined;          // Opcional, por si no hay partidos programados
}

