import { prisma } from "@/lib/prisma";
import { any, success } from "zod";

export const BusinessService = {
  async ensureDefaultProfile() {
    try {
      // 1. Intentamos buscar si ya existe algún perfil
      const profileCount = await prisma.business_profile.count();

      if (profileCount === 0) {
        console.log('🚀 No se encontró perfil de negocio. Creando perfil inicial...');
        
        const defaultProfile = await prisma.business_profile.create({
          data: {
                name: "MI Negocio",
                description: "Descripcion del negocio",
                state: true,
                slug: "MI-Negocio",
                currency_code: "USD",
                currency_symbol: "$",
                language: "es",
                slot_duration: 60,
                timezone: "America/Lima",
                updated_at: new Date()
          }
        });

        console.log('✅ Perfil inicial creado con ID:', defaultProfile.id);
        return defaultProfile;
      }

      return null;
    } catch (error) {
      console.error('❌ Error al inicializar el perfil del negocio:', error);
    }
  },

  getBusinessProfile: async() =>{
    try {
        const profile = await prisma.business_profile.findFirst({
        where: { state: true },
        orderBy: { created_at: 'asc' }
        });
        
        return { success:true, content:profile};
    } catch (error) {
        console.error("Error obteniendo el perfil:", error);
        return null;
    }
    }
};