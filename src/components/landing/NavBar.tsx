'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    // Cerrar menú al cambiar de tamaño (evita bugs visuales)
    useEffect(() => {
        const handleResize = () => { if (window.innerWidth > 768) setIsOpen(false); };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <nav className="sticky top-0 z-[100] w-full bg-white/70 backdrop-blur-xl border-b border-brand-primary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* Logo con estilo 2026 */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-2xl font-black tracking-tighter text-brand-primary group-hover:scale-105 transition-transform duration-300">
                            PUKLLAY<span className="text-brand-accent italic">ARENA.</span>
                        </span>
                    </Link>

                    {/* Menú Desktop (Laptops & Monitor) */}
                    <div className="hidden md:flex items-center gap-10 text-[13px] uppercase font-black tracking-widest text-brand-primary/60">
                        <Link href="/dashboard/reservas" className="hover:text-brand-accent transition-all">Reservar</Link>
                        <Link href="/nosotros" className="hover:text-brand-accent transition-all">Nosotros</Link>
                        
                        <Link href="/login">
                            <button className='bg-brand-primary text-brand-accent px-6 py-3 hover:bg-brand-accent hover:text-brand-primary transition-all duration-500 rounded-2xl shadow-lg shadow-brand-primary/10 active:scale-95'>
                                Iniciar Sesión
                            </button>
                        </Link>
                    </div>

                    {/* Botón Hamburguesa (Móviles y Tablets) */}
                    <div className="md:hidden">
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-colors"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú Móvil / Tablet Overlay */}
            <div className={`
                fixed inset-x-0 top-20 bg-white/95 backdrop-blur-2xl border-b border-brand-primary/5 p-6 transition-all duration-500 md:hidden
                ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
            `}>
                <div className="flex flex-col gap-6">
                    <Link 
                        href="/dashboard/reservas" 
                        onClick={() => setIsOpen(false)}
                        className="flex justify-between items-center text-xl font-black italic uppercase tracking-tighter text-brand-primary border-b border-brand-primary/5 pb-4"
                    >
                        Reservar <ChevronRight className="text-brand-accent" />
                    </Link>
                    
                    <Link 
                        href="/nosotros" 
                        onClick={() => setIsOpen(false)}
                        className="flex justify-between items-center text-xl font-black italic uppercase tracking-tighter text-brand-primary border-b border-brand-primary/5 pb-4"
                    >
                        Nosotros <ChevronRight className="text-brand-accent" />
                    </Link>

                    <Link href="/login" onClick={() => setIsOpen(false)}>
                        <button className='w-full bg-brand-accent text-brand-primary py-5 rounded-[2rem] font-black uppercase italic tracking-widest shadow-xl shadow-brand-accent/20'>
                            Iniciar Sesión
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}