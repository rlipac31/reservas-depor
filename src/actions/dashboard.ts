

'use server'

import { getAdvancedDashboard } from "@/services/dashboard/service";
import { ActionResponse, DashboardStats } from "@/types/dashboard";
import { redis, connectRedis } from "@/lib/redis/cliente"; // El archivo que creamos antes

export async function  db_getDashboardDataAction() : Promise<ActionResponse<DashboardStats>> {
    try {
        const data = await getAdvancedDashboard();
        return { success: true, data };
    } catch (error) {
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Error al cargar el dashboard" 
        };
    }
}




export async function getDashboardDataAction(forceRefresh = false) : Promise<ActionResponse<DashboardStats>> {


    if (forceRefresh) {
        await redis.del("pukllay:dashboard:stats");
    }

    try {
        // 1. Conexión segura a Redis
        await connectRedis();
        const CACHE_KEY = "pukllay:dashboard:stats";

        // 2. Intentar obtener de Redis
        const cachedData = await redis.get(CACHE_KEY);
        
        // if (cachedData) {
        //     console.log("🟢 Servido desde Redis");
        //     return { 
        //         success: true, 
        //         data: JSON.parse(cachedData) as DashboardStats 
        //     };
        // }

        if (cachedData) {
        const data = typeof cachedData === 'string' 
            ? JSON.parse(cachedData) 
            : cachedData;
        return { success: true, data };
    }

        // 3. Cache Miss: Consultar Base de Datos (Servicio real)
        console.log("🔵 Consultando PostgreSQL...");
        
        const stats:DashboardStats = await getAdvancedDashboard(); // Llamada al servicio que tiene el Prisma/Supabase

        if (!stats) {
            return { success: false, error: "No se encontraron datos" };
        }

        // 4. GUARDAR SOLO LOS DATOS (stats), NO EL ACTION RESPONSE
        // Aquí estaba tu error: guardabas el objeto {success, data} y luego intentabas parsearlo mal
        await redis.set(CACHE_KEY, JSON.stringify(stats), {
            ex: 300 // 5 minutos
        });

         
        return { success: true, data: stats };

    } catch (error) {
        console.error("❌ Error en Dashboard Action:", error);
        
        // Fallback: Si Redis falla, intentamos devolver los datos de la DB directamente
        try {
            const stats = await getAdvancedDashboard();
            return { success: true, data: stats };
        } catch (dbError) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : "Error general" 
            };
        }
    }
}

// actions/dashboard.ts




