"use client";

import React from 'react';
import { ShieldAlert, ChevronLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

const UnauthorizedPage = () => {
  const { user }= useUser();
  const router = useRouter();

  return (
    <div className=" min-h-screen bg-brand-primary flex items-center justify-center p-4 relative overflow-hidden rounded-2xl">
      
      {/* Elementos decorativos de fondo (brillos dorados) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-gold/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-[120px]" />

      <div className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 text-center shadow-2xl animate-in fade-in zoom-in duration-500">
        
        {/* Icono de Alerta */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-accent   rounded-full blur-xl animate-pulse" />
            <div className="bg-brand-accent-hover/30 p-5 rounded-full border border-brand-accent-hover/30 relative">
              <ShieldAlert className="w-16 h-16 text-brand-gold" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Mensaje principal */}
        <h1 className="text-3xl md:text-4xl font-black text-brand-white mb-3 italic uppercase tracking-tighter">
          Acceso <span className="text-brand-accent">Restringido</span>
        </h1>
        
        <p className="text-brand-secondary  text-sm md:text-base mb-10 font-medium leading-relaxed">
          Lo sentimos, no tienes los permisos necesarios para ver esta sección. Si crees que esto es un error, contacta con el administrador de tu negocio.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col gap-3">
          <Link href={`/dashboard/campos`} className="w-full">
            <button className="w-full group flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-black py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(255,195,0,0.3)] active:scale-95">
              <Home size={18} className="group-hover:translate-y-[-2px] transition-transform" />
              IR AL DASHBOARD
            </button>
          </Link>

          <button 
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 bg-transparent border border-white/10 text-brand-white/50 hover:text-brand-white hover:bg-white/5 font-bold py-4 rounded-2xl transition-all duration-300 text-xs uppercase tracking-widest"
          >
            <ChevronLeft size={16} />
            Volver atrás
          </button>
        </div>

        {/* Footer discreto */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase">
            Arena Prometeo © 2026 • Security System
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;