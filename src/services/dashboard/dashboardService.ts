// // services/dashboardService.ts
// import { redis, connectRedis } from "@/lib/redis/cliente";
// import { DashboardData, DashboardStats, ActionResponse } from "@/types/dashboard";
// import { getDashboardDataAction,  db_getDashboardDataAction } from "@/actions/dashboard";

// export async function getDashboardStats() {
//   try {
//     // 1. Asegurar conexión a Redis
//     await connectRedis();

//     const CACHE_KEY = "pukllay:dashboard:stats";

//     // 2. Intentar buscar en Redis
//     const cachedRaw = await redis.get(CACHE_KEY);

//     // if (cachedRaw) {
//     //   console.log("🟢 Datos recuperados desde el caché (Redis)");
//     //   // Parseamos el string de vuelta a un objeto con el tipo DashboardData
//     //   return JSON.parse(cachedRaw) as DashboardData;
//     // }

//     if (cachedRaw) {
//         const data = typeof cachedRaw  === 'string' 
//             ? JSON.parse(cachedRaw ) 
//             : cachedRaw ;
//         return { success: true, data };
//     }

//     // 3. Si no existe en Redis, vamos a la base de datos (Supabase/Prisma)
//     console.log("🔵 Cache Miss: Consultando PostgreSQL...");
    
//     // Aquí llamas a tu función original que trae los datos de Prisma
//     const result = await db_getDashboardDataAction(); 

//     if (!result.data) {
//       throw new Error("No se pudieron obtener los datos");
//     }

//     const dataToCache: DashboardData= result.data;

//     // 4. Guardar en Redis para la próxima vez
//     // 'EX': 300 -> Indica que los datos expiran en 5 minutos
//     // Esto es vital para que el dashboard se actualice solo periódicamente
//     await redis.set(CACHE_KEY, JSON.stringify(dataToCache), {
//       EX: 300 
//     });

//     return dataToCache;

//   } catch (error) {
//     console.error("Error en el sistema de caché:", error);
//     // Si falla Redis, como fallback, intentamos traer los datos directamente
//     const fallback = await db_getDashboardDataAction() ;
//     return fallback.data as DashboardData;
//   }
// }

import { redis, connectRedis } from "@/lib/redis/cliente";
import { DashboardData, ActionResponse } from "@/types/dashboard";
import { db_getDashboardDataAction } from "@/actions/dashboard";

// Definimos que el retorno SIEMPRE será una ActionResponse para ser consistentes
export async function getDashboardStats(): Promise<ActionResponse<DashboardData>> {
  try {
    // 1. Asegurar conexión (si usas Upstash, connectRedis ya no hace nada, pero no estorba)
    await connectRedis();

    const CACHE_KEY = "pukllay:dashboard:stats";

    // 2. Intentar buscar en Redis
    const cachedRaw = await redis.get(CACHE_KEY);

    if (cachedRaw) {
        console.log("🟢 Datos recuperados desde el caché (Redis)");
        
        // Upstash a veces devuelve el objeto ya parseado, node-redis siempre string
        const data = typeof cachedRaw === 'string' 
            ? JSON.parse(cachedRaw) 
            : cachedRaw;

        return { success: true, data: data as DashboardData };
    }

    // 3. Cache Miss: Consultar Base de Datos
    console.log("🔵 Cache Miss: Consultando PostgreSQL...");
    const result = await db_getDashboardDataAction(); 

    if (!result.success || !result.data) {
      return { success: false, error: result.error || "No se pudieron obtener los datos" };
    }

    const dataToCache = result.data as DashboardData;

    // 4. Guardar en Redis (Convertimos a string para asegurar compatibilidad)
    await redis.set(CACHE_KEY, JSON.stringify(dataToCache), {
      ex: 300 // uptash se encribe ex en minusculas// tiempo que se guarda los datos y luego refresca
    });

    return { success: true, data: dataToCache };

  } catch (error) {
    console.error("❌ Error en el sistema de caché:", error);
    
    // Fallback: Intentar traer datos de la DB si falla Redis
    const fallback = await db_getDashboardDataAction();
    return {
        success: fallback.success,
        data: fallback.data as DashboardData,
        error: fallback.error
    };
  }
}