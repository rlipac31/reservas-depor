import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { DashboardStats } from "@/types/dashboard";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getAdvancedDashboard = async (): Promise<DashboardStats> => {
  try {
    // 1. Obtener configuración del negocio (Timezone)
    const business = await prisma.business_profile.findFirst();
    const zonaHoraria = business?.timezone || 'America/Lima';

    // Tiempos de referencia
    const ahora = dayjs().tz(zonaHoraria);
    const inicioHoy = ahora.startOf('day').toDate();
    const finHoy = ahora.endOf('day').toDate();
    const hace24Horas = ahora.subtract(24, 'hours').toDate();

    const HORAS_OPERATIVAS_DIA = 15;

    // 2. Consultas en paralelo
    const [totalCanchas, reservasHoy, nuevas24h, rankingRaw, todasReservas] = await Promise.all([
      prisma.fields.count({ 
        where: { is_deleted: false, state: true } 
      }),
      prisma.bookings.findMany({
        where: { start_time: { gte: inicioHoy, lt: finHoy } },
        include: { 
            fields: { select: { name: true } },
            customers: { select: { name: true } } 
        },
        orderBy: { start_time: 'asc' }
      }),
      prisma.bookings.count({ 
        where: { created_at: { gte: hace24Horas } } 
      }),
      prisma.bookings.groupBy({
        by: ['field_id'],
        where: { status: 'CONFIRMED' }, // O 'COMPLETED' según tu lógica
        _sum: { total_price: true },
        _count: { id: true },
      }),
      prisma.bookings.findMany({ 
        select: { start_time: true } 
      })
    ]);

    // 3. Procesar KPIs (Cálculos rápidos en memoria)
    const kpisBase = reservasHoy.reduce((acc, curr) => {
      const precio = Number(curr.total_price);
      if (curr.status === 'CONFIRMED' || curr.status === 'COMPLETED') acc.recaudado += precio;
      if (curr.status === 'PENDING') acc.pendiente += precio;
      if (curr.status === 'CANCELLED') acc.canceladas++;
      
      acc.totalHoras += (curr.duration_minutes / 60);
      return acc;
    }, { recaudado: 0, pendiente: 0, canceladas: 0, totalHoras: 0 });

    const capacidadTotalHoras = totalCanchas * HORAS_OPERATIVAS_DIA;

    // 4. Formatear Timeline
    const timeline = reservasHoy.map(b => {
      const nombreCliente = b.manual_customer_name || b.customers?.name || "Cliente General";
      return {
        id: b.id,
        customerName: nombreCliente,
        startTime: b.start_time,
        endTime: b.end_time,
        status: b.status,
        fieldName: b.fields.name,
        minutosParaInicio: dayjs(b.start_time).diff(ahora, 'minute')
      };
    });

    // 5. Ranking de campos (Mapeo de IDs a Nombres)
    const fieldsInfo = await prisma.fields.findMany({
      where: { id: { in: rankingRaw.map(r => r.field_id) } },
      select: { id: true, name: true }
    });

    const rankingCampos = rankingRaw.map(rank => ({
      name: fieldsInfo.find(f => f.id === rank.field_id)?.name || "Campo eliminado",
      totalGenerado: Number(rank._sum.total_price || 0),
      vecesReservada: rank._count.id
    })).sort((a, b) => b.totalGenerado - a.totalGenerado);

    // 6. Mapa de Calor (Agrupación por Día/Hora)
    const mapaCalor = todasReservas.reduce((acc: DashboardStats['mapaCalor'], res) => {
      const m = dayjs(res.start_time).tz(zonaHoraria);
      const dia = m.day();
      const hora = m.hour();
      
      const idx = acc.findIndex(i => i.dia === dia && i.hora === hora);
      if (idx > -1) acc[idx].cantidad++;
      else acc.push({ dia, hora, cantidad: 1 });
      
      return acc;
    }, []);

    return {
      kpis: {
        ingresos: { recaudado: kpisBase.recaudado, pendiente: kpisBase.pendiente },
        ocupacionPorcentaje: capacidadTotalHoras > 0 
          ? (kpisBase.totalHoras / capacidadTotalHoras) * 100 
          : 0,
        cancelaciones: kpisBase.canceladas,
        nuevas24h
      },
      timeline,
      proximoPartido: timeline.find(b => b.minutosParaInicio > 0 && b.status !== 'CANCELLED'),
      rankingCampos,
      mapaCalor
    };

  } catch (error) {
    console.error("Dashboard Service Error:", error);
    throw new Error("No se pudo cargar la información del dashboard");
  }
};