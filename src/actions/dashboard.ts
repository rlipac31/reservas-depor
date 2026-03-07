

'use server'

import { getAdvancedDashboard } from "@/services/dashboard/service";
import { ActionResponse, DashboardStats } from "@/types/dashboard";

export async function getDashboardDataAction(): Promise<ActionResponse<DashboardStats>> {
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