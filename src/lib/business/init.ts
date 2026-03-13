// lib/init.ts
import { BusinessService } from '@/services/business/service';
import { initialize } from 'next/dist/server/lib/render-server';

let isInitialized = false;

export async function initializeDatabase() {
  if (isInitialized) return;
  
  try {
    console.log("🚀 Verificando perfil de negocio inicial...", isInitialized);
    await BusinessService.ensureDefaultProfile();
    isInitialized = true;
    console.log('🛡️ Sistema inicializado correctamente.', isInitialized);
  } catch (error) {
    console.error('❌ Error crítico en la inicialización:', error);
  }
}