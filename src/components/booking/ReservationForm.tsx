"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
    Percent, UserCheck, UserPlus, Lock,BanknoteArrowUp,
    Phone, CreditCard, Wallet, Banknote, Clock,Smartphone
} from 'lucide-react';
import dayjs from "@/lib/dayjs/dayjs";

// Importamos el Server Action atómico
import { createBookingAction } from "@/actions/booking";
import { CustomerAutocomplete } from './CustomerAutocomplete';
import { getServerUser } from "@/actions/useServer";
//import { useUser } from "@/context/UserContext";




interface Props {
    initialData: {
        fieldId: string;
        fieldName: string;
        date: string;
        time: string;
        campo: any
    };
}

export default function ReservationForm({ initialData }: Props) {
    const router = useRouter();
    const [ user, setUser] = useState<any | null>(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [showDiscount, setShowDiscount] = useState(false);

    useEffect(() => {
        const loadUser = async()=>{
             const user = await getServerUser()
             console.log("user desde efec form reserva ", user)

        }
        loadUser();
      
    }, [user])
    


    // Estado inicial alineado con tu tabla SQL
    const [formData, setFormData] = useState({
        fieldId: initialData.fieldId,
        startTime: `${initialData.date}T${initialData.time}`,
        durationInMinutes: 60,
        paymentMethod: "",
        nameCustomer: 'CONSUMIDOR FINAL',
        dniCustomer: '',
        phoneCustomer: '',
        amount: initialData.campo?.price_per_hour || 0,
        discount: 0,
        
    });

    // Precio dinámico con useMemo
    const finalPrice = useMemo(() => {
        const base = Number(initialData.campo?.price_per_hour || 0);
        const durationFactor = formData.durationInMinutes / 60;
        return (base * durationFactor) * (1 - (formData.discount / 100));
    }, [initialData.campo?.price_per_hour, formData.discount, formData.durationInMinutes]);

    const handleSuccessVisuals = () => {
        const duration = 3 * 1000;
        const end = Date.now() + duration;
        const frame = () => {
            confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FF8A00', '#000000'] });
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FF8A00', '#000000'] });
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
    };

    const onSubmit = async (e: React.FormEvent) => {
       

        e.preventDefault();
        if (!formData.paymentMethod) return setError("Selecciona un método de pago");

        setLoading(true);
        setError('');

        try {
            // Invocamos el Server Action (Todo o Nada)
            const result:any = await createBookingAction(formData);

            if (result.success) {
                console.log("Reserva creada:", result);
                handleSuccessVisuals();
                // Redirección con datos para el ticket
                const params = new URLSearchParams({
                    id: result.data.booking.id,
                    total: finalPrice.toString(),
                    date: initialData.date,
                    time: initialData.time
                });
                // setTimeout(() => router.push(`/dashboard/checkout/success?${params}`), 1500);
                // ✅ Redirección limpia sin slug
                setTimeout(() => router.push(`/dashboard/reservas`), 1500);
            } else {
                setError(result.error || "Error al procesar");
            }
        } catch (err: any) {
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-brand-primary/5 max-w-lg mx-auto space-y-6">
            <header className="text-center space-y-1">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-brand-primary">
                    Finalizar <span className="text-brand-accent">Reserva</span>
                </h2>
                <p className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">
                    {initialData.fieldName} • {dayjs(initialData.date).format('DD/MM/YYYY')}
                </p>
            </header>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold border border-red-100 animate-shake">
                    ⚠️ {error}
                </div>
            )}

            <div className="space-y-4">
                {/* Bloque de Tiempo (Solo lectura si viene de la grilla) */}
                <div className="flex gap-4 bg-brand-secondary/20 p-4 rounded-2xl border border-brand-primary/5">
                    <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-black text-brand-primary/40 uppercase flex items-center gap-1">
                            <Lock size={10} /> Inicio
                        </label>
                        <div className="font-bold text-brand-primary">{initialData.time}</div>
                    </div>
                    <div className="w-1/3 space-y-1">
                        <label className="text-[10px] font-black text-brand-primary/40 uppercase flex items-center gap-1 text-right justify-end">
                            Duración
                        </label>
                        <select
                            className="bg-transparent font-bold text-brand-primary outline-none w-full text-right"
                            value={formData.durationInMinutes}
                            onChange={(e) => setFormData({ ...formData, durationInMinutes: Number(e.target.value) })}
                        >
                            <option value={60}>60 min</option>
                            <option value={90}>90 min</option>
                            <option value={120}>120 min</option>
                        </select>
                    </div>
                </div>

                {/* Sección Cliente */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-brand-primary rounded-2xl text-white">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${isRegistered ? 'bg-brand-accent text-brand-primary' : 'bg-white/10 text-white'}`}>
                                {isRegistered ? <UserCheck size={18} /> : <UserPlus size={18} />}
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase italic">¿Socio Pukllay?</p>
                                <p className="text-[9px] text-white/40 uppercase">Busca por Nombre o DNI</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsRegistered(!isRegistered)}
                            className={`w-10 h-5 rounded-full relative transition-colors ${isRegistered ? 'bg-brand-accent' : 'bg-white/20'}`}
                        >
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isRegistered ? 'left-6' : 'left-1'}`} />
                        </button>
                    </div>

                    {isRegistered ? (
                        <CustomerAutocomplete onSelect={(c: any) => setFormData({ ...formData, nameCustomer: c.name, dniCustomer: c.dni })} />
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            <input
                                placeholder="Nombre del Cliente"
                                className="w-full bg-brand-secondary/30 p-4 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-brand-accent transition-all"
                                value={formData.nameCustomer}
                                onChange={(e) => setFormData({ ...formData, nameCustomer: e.target.value.toUpperCase() })}
                            />
                            <input
                                placeholder="DNI / Documento"
                                className="w-full bg-brand-secondary/30 p-4 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-brand-accent transition-all"
                                maxLength={8}
                                value={formData.dniCustomer}
                                onChange={(e) => setFormData({ ...formData, dniCustomer: e.target.value })}
                            />
                        </div>
                    )}
                </div>

                {/* {user && user.role !== 'CUSTOMER' && ( */}
                    <div className="space-y-4">
                        {/* Contenedor del Toggle */}
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-brand-primary/10 shadow-sm hover:border-brand-accent/30 transition-all">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black text-brand-primary uppercase italic tracking-tighter">
                                    ¿Aplicar Descuento?
                                </span>
                                <span className="text-[9px] font-bold text-brand-primary/40 uppercase">
                                    Solo para administradores
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    const nextState = !showDiscount;
                                    setShowDiscount(nextState);

                                    // SI SE DESACTIVA, RESETEAMOS EL VALOR A 0
                                    if (!nextState) {
                                        setFormData(prev => ({ ...prev, discount: 0 }));
                                    }
                                }}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none ${showDiscount ? 'bg-brand-accent' : 'bg-brand-primary/10'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${showDiscount ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Sección del Selector (Se muestra con animación) */}
                        {showDiscount && (
                            <div className="space-y-3 p-4 bg-brand-accent/5 rounded-2xl border border-dashed border-brand-accent/30 animate-in zoom-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-brand-accent rounded-lg flex items-center justify-center">
                                        <Percent className="text-brand-primary" size={12} />
                                    </div>
                                    <label className="text-[10px] font-black text-brand-primary uppercase italic tracking-widest">
                                        Porcentaje de Descuento
                                    </label>
                                </div>

                                <select
                                    value={formData.discount ?? 0}
                                    onChange={(e) => setFormData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                                    className="w-full px-4 py-3 border-2 border-brand-primary/5 rounded-xl text-sm focus:border-brand-accent outline-none bg-white font-black italic text-brand-primary appearance-none cursor-pointer"
                                >
                                    <option value={0}>Sin descuento (0%)</option>
                                    {[5, 10, 15, 20, 25, 30, 40, 50].map(val => (
                                        <option key={val} value={val}>{val}% de descuento</option>
                                    ))}
                                </select>

                                {/* Feedback de Ahorro con el diseño Pukllay */}
                                <div className="flex items-center justify-between px-2">
                                    <p className="text-[9px] text-brand-primary/50 font-bold uppercase tracking-widest">
                                        Tu ahorro estimado:
                                    </p>
                                    <p className="text-sm font-black text-brand-primary italic">
                                        {"S/"}
                                        {((Number(formData.amount) || 0) * ((formData.discount || 0) / 100)).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                {/* )} */}

                {/* Métodos de Pago */}
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest text-center">Método de Pago</p>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'MOVIL', label: 'Movil', icon: Smartphone },
                            { id: 'CASH', label: 'Efectivo', icon: Banknote },
                            { id: 'CARD_CREDIT', label: 'Tarjeta', icon: CreditCard },
                            { id: 'CARD_DEBIT', label: 'Debito', icon: CreditCard },
                            { id: 'TRANFER', label: 'Transferencia', icon: BanknoteArrowUp }
                        ].map((m) => (
                            <button
                                key={m.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all
                                ${formData.paymentMethod === m.id
                                        ? 'border-brand-accent bg-brand-accent/5 text-brand-primary shadow-lg'
                                        : 'border-transparent bg-brand-secondary/30 text-gray-400'}`}
                            >
                                <m.icon size={16} />
                                <span className="text-[10px] font-black uppercase tracking-tighter">{m.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Botón de Acción */}
                <button
                    type="submit"
                    disabled={loading || !formData.paymentMethod}
                    className="w-full bg-brand-primary text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-brand-accent hover:text-brand-primary transition-all disabled:opacity-30 disabled:grayscale"
                >
                    {loading ? "Procesando..." : `Pagar S/ ${finalPrice.toFixed(2)}`}
                </button>
            </div>
        </form>
    );
}