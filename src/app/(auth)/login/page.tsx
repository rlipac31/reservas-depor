"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Importante para redirigir
import Button from '@/components/landing/Button';
import { loginAction } from "@/actions/auth";
import { useUser } from '@/context/UserContext';

export default function ListaPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
     const { user, setUser } = useUser();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Creamos el FormData para enviarlo al Server Action
        const formData = new FormData(e.currentTarget);
          console.warn("antes de login")
            console.log(formData)
        
        try {
            const result:any = await loginAction(formData);
            

            if (result.success) {
                 setUser(result.content)
                 console.warn("entrooo  datos login")
                // console.log(formData)
                 console.log("desde login")
                 console.table(user)
                 router.push("/dashboard");
                 router.refresh();
                
            } else {
                setError(result.error);
                setLoading(false);
                console.warn("no entrooo login")
            console.log(formData)
               
                // Si no hay error, el Action debería haber redirigido, 
                // pero si no, forzamos la entrada al dashboard
               
            }
        } catch (err) {
            setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
            setLoading(false);
        }
    };

    return (
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-brand-secondary/30 px-4 py-12">
            <div className="w-full max-w-md bg-brand-white rounded-[2.5rem] shadow-2xl border border-brand-primary/5 p-8 md:p-12 overflow-hidden relative">
                
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary" />

                <div className="text-center mb-10 ">
                    <h2 className="text-3xl font-black text-brand-primary tracking-tight uppercase">
                        BIENVENIDO A <span className="text-brand-accent">PUKLLAY</span>
                    </h2>
                    <p className="text-brand-primary/60 mt-2 font-medium">
                        Ingresa tus datos para gestionar tus reservas
                    </p>
                </div>

                {/* Mostrar alerta de error si existe */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-primary/40 uppercase ml-1">Correo Electrónico</label>
                        <input
                            name="email" // Importante: loginAction busca este nombre
                            type="email"
                            placeholder="ejemplo@pukllay.com"
                            required
                            className="w-full bg-brand-secondary/50 p-4 rounded-2xl border-2 border-transparent focus:border-brand-accent focus:bg-brand-white outline-none transition-all duration-300 font-medium text-brand-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-brand-primary/40 uppercase">Contraseña</label>
                            <Link href="#" className="text-xs font-bold text-brand-accent hover:text-brand-accent-hover transition-colors">
                                ¿Olvidaste tu clave?
                            </Link>
                        </div>
                        <input
                            name="password" // Importante: loginAction busca este nombre
                            type="password"
                            placeholder="••••••••"
                            required
                            className="w-full bg-brand-secondary/50 p-4 rounded-2xl border-2 border-transparent focus:border-brand-accent focus:bg-brand-white outline-none transition-all duration-300 font-medium text-brand-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="w-full py-4 text-lg mt-4 shadow-xl shadow-brand-accent/20 disabled:opacity-50"
                    >
                        {loading ? "Verificando..." : "Entrar a mi cuenta"}
                    </Button>
                </form>
{/* 
                <div className="mt-8 text-center">
                    <p className="text-sm text-brand-primary/60">
                        ¿Aún no tienes cuenta?{' '}
                        <Link href="/registro" className="font-bold text-brand-primary hover:text-brand-accent transition-colors">
                            Regístrate aquí
                        </Link>
                    </p>
                </div> */}
            </div>
        </section>
    );
}