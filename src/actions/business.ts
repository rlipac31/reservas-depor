
"use server";

import { BusinessService } from '@/services/business/service'

export async function getPerfilBusiness(){
    try {
        const result = await BusinessService.getBusinessProfile();

        if(result?.success){
        return { success: true, content: result.content, error: null };
        }
        return { success: false,  error: "error al consultar el perfil del negocio" };

    } catch (e) {
        return { success: false,  error: `error tipo: ${e}` };
    }
}

export async function updateBusinessConfig(formData: any) {
    try {
         const result = await BusinessService.getBusinessProfile();
        if(result?.success){
        return { success: true, content: result.content, error: null };
        }
        return { success: false,  error: "error al consultar el perfil del negocio" };
        
    } catch (error) {
        return { error:`error tipo: ${error}`}
    }
}