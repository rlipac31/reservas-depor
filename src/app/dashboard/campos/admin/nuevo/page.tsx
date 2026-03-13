
'use client'
 
import { useRouter } from 'next/navigation'
import { createFieldAction } from "@/actions/fields";
import Button from "@/components/landing/Button";
import { useState } from "react";
import{CheckCircle2 } from'lucide-react';


interface payloadType {
    name: string;
    description: string;
    location: string;
    capacity: undefined;
    pricePerHour: undefined;
}

export default function NuevoCampoPage() {


  const router = useRouter();




  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Inicializamos el estado del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    capacity: undefined,
    pricePerHour: undefined,
  });




  // 2. FUNCIÓN PARA CAPTURAR LOS CAMBIOS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value // Actualiza solo el campo que cambió
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Datos del formulario a enviar:", formData);

    setLoading(true);
    setError(null);

    const payload = {
      name: formData.name,
      description: formData.description,
      location: formData.location,
      capacity: formData.capacity,
      pricePerHour: formData.pricePerHour
    };

    const result = await createFieldAction(payload);
    

    if (result.success) {
      console.log("Campo creado exitosamente");
      setSuccess(true);
      setTimeout(() => router.push(`/dashboard/campos`), 1000);
    } else {
      console.log("error tipo :: ", result.error)
      //setError(result.error);
      setLoading(false);
    }
  };
  
//if (user?.role !== 'ADMIN') return null;

  if (success) {
    return (
      <div className="min-h-screen bg-brand-white flex items-center justify-center p-4">
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
          <CheckCircle2 size={80} className="text-success mx-auto" />
          <h2 className="text-2xl font-bold text-brand-black">¡Reserva Creada!</h2>
          <p className="text-gray-500">Redirigiendo al panel principal...</p>
        </div>
      </div>
    );
  }







/*  fin  */
  return (
    <div className="max-w-2xl mx-auto ">
        <div className='bg-brand-primary pt-8 pb-1 items-center rounded-t-xl w-[100%]'>
          <h1 className="text-3xl  text-center font-black text-brand-accent-hover mb-8 italic uppercase">
            Registrar Nueva Cancha
          </h1>

      </div>
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-brand-primary/5 space-y-6">
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre de la Cancha */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-primary/40 uppercase ml-1">Nombre del Campo</label>
            <input 
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Cancha Maracaná" 
              required 
              className="w-full bg-brand-secondary/30 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent transition-all font-medium"
            />
          </div>

          {/* Precio por Hora */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-primary/40 uppercase ml-1">Precio por Hora (S/)</label>
            <input 
              id="pricePerHour"
              name="pricePerHour" 
              type="number" 
              step="0.01" 
              value={formData.pricePerHour || ""}
              onChange={handleChange}
              placeholder="80.00" 
              required 
              className="w-full bg-brand-secondary/30 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent transition-all font-medium"
            />
          </div>

          {/* Capacidad */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-primary/40 uppercase ml-1">Capacidad (Personas)</label>
            <input 
             id='capacity'
              name="capacity" 
              type="number" 
              value={formData.capacity || ""}
              onChange={handleChange}
              placeholder="10" 
              required 
              className="w-full bg-brand-secondary/30 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent transition-all font-medium"
            />
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-primary/40 uppercase ml-1">Ubicación / Sector</label>
            <input
              id='location'
              name="location"
               value={formData.location || ""}
              onChange={handleChange} 
              placeholder="Ej: Zona Norte" 
              className="w-full bg-brand-secondary/30 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent transition-all font-medium"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-brand-primary/40 uppercase ml-1">Descripción</label>
          <input 
            id='description'
            type='text'
            name="description"
            value={formData.description || ""}
            onChange={handleChange} 
            placeholder="Detalles sobre el tipo de césped, iluminación, etc." 
            className="w-full bg-brand-secondary/30 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent transition-all font-medium resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-brand-accent/10 ${
            loading
              ? 'bg-brand-gray text-gray-400 cursor-not-allowed'
              : 'bg-brand-primary text-brand-secondary hover:bg-brand-accent  active:scale-95 transition-all duration-300'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Procesando...
            </span>
          ) : "Confirmar Registro"}
        </button>
      </form>
    </div>
  );
}