



"use client";

import { registerCustomerAction } from "@/actions/customer";
import Button from "@/components/landing/Button";
import Link from "next/link";
import { useState } from "react";

export default function SaveClientePage() {
    const [loading, setLoading] = useState(false);
    console.warn("form data de cliente nuevo")
    console.log(FormData)

    return (
        <section className="min-h-screen flex items-center justify-center bg-brand-secondary/20 py-12 px-4">
            <div className="w-full max-w-2xl bg-brand-white rounded-[2.5rem] shadow-2xl border border-brand-primary/5 p-8 md:p-12">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-brand-primary uppercase tracking-tighter">
                        Únete a <span className="text-brand-accent">Pukllay</span>
                    </h2>
                    <p className="text-brand-primary/50 font-medium">Crea tu cuenta para empezar a reservar</p>
                </div>

                {/* Usamos el Server Action directamente en el action del form */}
                <form
                    action={async (formData) => {
                        setLoading(true);
                        const result = await registerCustomerAction(formData);
                        if (result?.error) alert(result.error);
                        setLoading(false);
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Nombre Completo */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-primary/40 uppercase ml-1">Nombre Completo</label>
                        <input name="name" type="text" required placeholder="Ej. Juan Pérez"
                            className="bg-brand-secondary/50 p-4 rounded-2xl border-2 border-transparent focus:border-brand-accent outline-none transition-all" />
                    </div>

                    {/* DNI */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-primary/40 uppercase ml-1">DNI / Documento</label>
                        <input name="dni" type="text" placeholder="8 dígitos"
                            className="bg-brand-secondary/50 p-4 rounded-2xl border-2 border-transparent focus:border-brand-accent outline-none transition-all" />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-xs font-bold text-brand-primary/40 uppercase ml-1">Correo Electrónico</label>
                        <input name="email" type="email" required placeholder="tu@email.com"
                            className="bg-brand-secondary/50 p-4 rounded-2xl border-2 border-transparent focus:border-brand-accent outline-none transition-all" />
                    </div>

                    {/* Teléfono */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-primary/40 uppercase ml-1">Teléfono móvil</label>
                        <input name="phone" type="tel" placeholder="999 999 999"
                            className="bg-brand-secondary/50 p-4 rounded-2xl border-2 border-transparent focus:border-brand-accent outline-none transition-all" />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-primary/40 uppercase ml-1">Contraseña</label>
                        <input name="password" type="password" required placeholder="••••••••"
                            className="bg-brand-secondary/50 p-4 rounded-2xl border-2 border-transparent focus:border-brand-accent outline-none transition-all" />
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <Button
                            type="submit"
                            variant="accent"
                            disabled={loading}
                            className="w-full py-4 text-lg shadow-xl"
                        >
                            {loading ? "Creando cuenta..." : "Registrarme ahora"}
                        </Button>
                    </div>
                </form>

                <p className="text-center mt-8 text-sm text-brand-primary/60 font-medium">
                    ¿Ya tienes cuenta? <Link href="/login" className="text-brand-accent font-bold hover:underline">Inicia sesión</Link>
                </p>
            </div>
        </section>
    );
}