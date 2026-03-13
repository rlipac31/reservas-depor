"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Globe, DollarSign, Clock, Save, Loader2, CheckCircle, AlertTriangle, LogOut } from 'lucide-react';
import { getPerfilBusiness, updateBusinessConfig } from '@/actions/business';
import { logout } from '@/actions/auth';
import { useUser } from '@/context/UserContext';

// Listado de zonas horarias comunes en Latam
const TIMEZONES = [
  { label: "Perú (Lima)", value: "America/Lima" },
  { label: "México (CDMX)", value: "America/Mexico_City" },
  { label: "Colombia (Bogotá)", value: "America/Bogota" },
  { label: "Argentina (Buenos Aires)", value: "America/Argentina/Buenos_Aires" },
  { label: "Chile (Santiago)", value: "America/Santiago" },
  { label: "Ecuador (Quito)", value: "America/Guayaquil" },
];
const SOUTH_AMERICA_TIMEZONES = [
  { label: "Argentina (Buenos Aires)", value: "America/Argentina/Buenos_Aires" },
  { label: "Bolivia (La Paz)", value: "America/La_Paz" },
  { label: "Brasil (Brasilia)", value: "America/Sao_Paulo" },
  { label: "Brasil (Manaos - Oeste)", value: "America/Manaus" },
  { label: "Chile (Santiago)", value: "America/Santiago" },
  { label: "Chile (Isla de Pascua)", value: "America/Easter" },
  { label: "Colombia (Bogotá)", value: "America/Bogota" },
  { label: "Ecuador (Quito)", value: "America/Guayaquil" },
  { label: "Ecuador (Islas Galápagos)", value: "America/Galapagos" },
  //{ label: "Guyana (Georgetown)", value: "America/Guyana" },
  { label: "México (CDMX)", value: "America/Mexico_City" },
  { label: "Paraguay (Asunción)", value: "America/Asuncion" },
  { label: "Perú (Lima)", value: "America/Lima" },
  //  { label: "Surinam (Paramaribo)", value: "America/Paramaribo" },
  { label: "Uruguay (Montevideo)", value: "America/Montevideo" },
  { label: "Venezuela (Caracas)", value: "America/Caracas" },
];

// Monedas por país
const CURRENCIES = [
  { label: "Soles (S/)", code: "PEN", symbol: "S/" },
  { label: "Peso Mexicano ($)", code: "MXN", symbol: "$" },
  { label: "Peso Colombiano ($)", code: "COP", symbol: "$" },
  { label: "Peso Argentino ($)", code: "ARS", symbol: "$" },
  { label: "Dólar (USD)", code: "USD", symbol: "$" },
];

const SOUTH_AMERICA_CURRENCIES = [
  { label: "Soles - Perú (S/)", code: "PEN", symbol: "S/" },
  { label: "Pesos - Argentina ($)", code: "ARS", symbol: "$" },
  { label: "Boliviano - Bolivia (Bs)", code: "BOB", symbol: "Bs" },
  { label: "Peso Mexicano ($)", code: "MXN", symbol: "$" },
  { label: "Real - Brasil (R$)", code: "BRL", symbol: "R$" },
  { label: "Pesos - Chile ($)", code: "CLP", symbol: "$" },
  { label: "Pesos - Colombia ($)", code: "COP", symbol: "$" },
  { label: "Dólares - Ecuador/EE.UU. ($)", code: "USD", symbol: "$" },
  { label: "Guaraníes - Paraguay (₲)", code: "PYG", symbol: "₲" },
  { label: "Pesos - Uruguay ($)", code: "UYU", symbol: "$" },
  { label: "Bolívares - Venezuela (Bs.S)", code: "VES", symbol: "Bs.S" },
  //{ label: "Dólar Guyanés - Guyana ($)", code: "GYD", symbol: "$" },
  // { label: "Dólar de Surinam - Surinam ($)", code: "SRD", symbol: "$" },
];

export default function ConfigPage({ initialData }: { initialData?: any }) {
  // para modal de cerrar sesión
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter(); // Importar de 'next/navigation'
  const { user, setUser } = useUser();// para acualizar la config en el contexto global después de guardar cambios y
  //  para mostrar la moneda actual en el formulario
  console.log("user config page", user);


  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Estado del formulario
  const [formData, setFormData] = useState({
    zonaHoraria: initialData?.timezone || "America/Lima",
    currencyCode: initialData?.currency_code || "PEN",
    currencySymbol: initialData?.currency_symbol || "S/",
    slotDuration: initialData?.slot_duration || 60,
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    // Si cambia el código de moneda, actualizamos el símbolo automáticamente
    if (name === "currencyCode") {
      // Buscamos el símbolo real basado en el código seleccionado para estar 100% seguros

      const selected = SOUTH_AMERICA_CURRENCIES.find(c => c.code === value);
      setFormData(prev => ({
        ...prev,
        currencyCode: value,
        currencySymbol: selected?.symbol || "$"
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });


    const currencyData = SOUTH_AMERICA_CURRENCIES.find(c => c.code === formData.currencyCode);
    const payload = {
      zonaHoraria: formData.zonaHoraria,
      currency: {
        code: formData.currencyCode,
        // symbol: formData.currencySymbol
        symbol: currencyData ? currencyData.symbol : "$" // <-- Garantiza el símbolo correcto
      },
      slotDuration: Number(formData.slotDuration),
      language: "es"
    };

    const result = await updateBusinessConfig(payload);

    if (result.success) {
      setMessage({ type: 'success', text: 'Configuración actualizada correctamente' });
      setShowLogoutModal(true); // <--- Abrimos el modal aquí
    } else {
      setMessage({ type: 'error', text: result.error ?? '' });
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    // Aquí tu lógica de borrar cookies/localStorage
    // Ejemplo: document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    await logout();
    setUser(null);
    window.location.href = "/login"; // Redirección completa para limpiar estados
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-brand-accent p-3 rounded-2xl shadow-lg shadow-brand-accent-hover/20">
          <Settings className="text-brand-primary" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-brand-primary uppercase italic tracking-tighter">Ajustes del Negocio</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Configura la moneda y zona horaria de tu arena</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* PANEL IZQUIERDO: SECCIÓN PRINCIPAL */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-primary/30 p-8 shadow-sm">
            <h2 className="text-sm font-black text-brand-primary uppercase mb-6 flex items-center gap-2">
              <Globe size={18} className="text-brand-accent" /> Localización y Horarios
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {/* ZONA HORARIA */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Zona Horaria del País</label>
                <select
                  name="zonaHoraria"
                  value={formData.zonaHoraria}
                  onChange={handleChange}
                  className="w-full bg-brand-gray/30 border border-gray-500 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-accent-hover/10 focus:border-brand-accent outline-none transition-all"
                >
                  {SOUTH_AMERICA_TIMEZONES.map(tz => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>

              {/* DURACIÓN DE TURNO */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Duración por Reserva (minutos)</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-accent-hover" size={18} />
                  <input
                    type="number"
                    name="slotDuration"
                    value={formData.slotDuration}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent-hover outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: MONEDA */}
        <div className="space-y-6">
          <div className="bg-brand-primary rounded-3xl p-8 shadow-xl text-white">
            <h2 className="text-sm font-black text-brand-accent uppercase mb-6 flex items-center gap-2">
              <DollarSign size={18} /> Moneda
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500">Divisa</label>
                <select
                  name="currencyCode"
                  value={formData.currencyCode}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-brand-gold transition-all"
                >
                  {SOUTH_AMERICA_CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code} className="bg-brand-primary">{curr.label}</option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Vista Previa</p>
                <span className="text-3xl font-black text-brand-accent">
                  {formData.currencySymbol} 120.00
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-accent text-brand-primary font-black py-4 rounded-2xl uppercase tracking-tighter shadow-lg shadow-brand-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Guardar Cambios</>}
          </button>

          {message.text && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
              <p className="text-[10px] font-black uppercase">{message.text}</p>
            </div>
          )}
        </div>
      </form>

      {/* MODAL DE CERRAR SESIÓN */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop con desenfoque */}
          <div className="absolute inset-0 bg-brand-primary/80 backdrop-blur-sm animate-in fade-in duration-300" />

          {/* Contenido del Modal */}
          <div className="relative bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-gray-400 animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="bg-brand-accent/10 p-4 rounded-2xl mb-6">
                <LogOut className="text-brand-accent" size={40} />
              </div>

              <h3 className="text-2xl font-black text-brand-primary uppercase italic tracking-tighter mb-2">
                ¡Configuración Guardada!
              </h3>
              <p className="text-gray-500 text-sm font-bold leading-relaxed mb-8 uppercase tracking-tight">
                Para que los cambios de moneda y zona horaria se apliquen en todo el sistema, es necesario <span className="text-brand-primary">reiniciar tu sesión</span>.
              </p>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  Después
                </button>
                <button
                  onClick={handleLogout}
                  className="py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-brand-black text-brand-accent  shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Cerrar Sesión Ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* fin modal */}
    </div>
  );
}