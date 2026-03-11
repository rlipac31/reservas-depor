
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, ArrowLeft, Lock, Unlock, Info, MapPin, Loader2, Banknote, Users } from 'lucide-react';
import { getFieldIdAction, updateFieldAction } from '@/actions/fields';
import { useUser } from '@/context/UserContext';
import { FieldIdResponse } from '@/types/field';
// ... Interfaz SoccerField y FieldInputProps se mantienen igual


interface FieldInputProps {
  label: string;
  name: keyof FieldIdResponse; // Obligamos a que el name sea una llave de SoccerField
  value: string | number | undefined;
  icon: React.ReactNode;
  isEditable: boolean;
  onToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}


const EditCampo = () => {
  const router = useRouter();
  const params = useParams();
  const idfield = params.id;
    


  // 1. UNIFICAMOS EL ESTADO: Solo necesitamos "campo"
  const [campo, setCampo] = useState<FieldIdResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState<Partial<Record<keyof FieldIdResponse, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [mensage, setMensage] = useState('');

  const fieldId = String(idfield || "");

  useEffect(() => {
    if (!fieldId) return;
    const loadField = async () => {
      try {
        const {success, content } = await getFieldIdAction(fieldId); 
       if (success && content && !Array.isArray(content)) {
        

        // const sanitizedField = {
        //   ...content,
        //   description: content?.description ?? "", // Si es null, pon ""
        //   location: content?.location ?? "",       // Si es null, pon ""
        //   price_per_hour: Number(content?.price_per_hour), // De Decimal a Number
        // } as FieldIdResponse;
       await setCampo(content as FieldIdResponse);
        }
      } catch (error) {
       // console.error("Error cargando campo:", error);
      } finally {
        setLoading(false);
      }
    };
    loadField();
  }, [fieldId]);

  const toggleLock = (fieldName: keyof FieldIdResponse) => {
    setIsEditable(prev => ({ 
      ...prev, 
      [fieldName]: !prev[fieldName] 
    }));
  };

  // 2. CORREGIMOS EL HANDLE CHANGE: Actualiza "setCampo"
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;

    setCampo(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: type === 'checkbox' ? isChecked : value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldId || !campo) return;

    setSaving(true);
    try {
      // 3. ENVIAMOS EL ESTADO ACTUALIZADO (campo)
      const res = await updateFieldAction(fieldId, campo);
      
      if (res.success) {
        setMensage("¡El campo se actualizó correctamente!");
        setTimeout(() => {
          setSaving(false);
          setMensage('');
          router.push(`/dashboard/campos/admin`);
        }, 500);
      } else {
        setMensage("Error al actualizar");
        setSaving(false);
      }
    } catch (error) {
      console.error(error);
      setSaving(false);
    }
  };

  console.warn("campo data ")
  console.table(campo)

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="animate-spin text-brand-accent-hover" size={40} />
      <p className="text-sm font-bold text-brand-primary uppercase">Cargando datos...</p>
    </div>
  );


  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-10">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-primary mb-6 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} /> Volver al listado
        </button>
      { mensage !== '' && (
         <div className='bg-brand-primary/20'>
            <span className='text-blue-600 text-xl font-medium'>{mensage}</span>
        </div>
      )}
        

        <div className="bg-white rounded-2xl shadow-xl border border-brand-gray overflow-hidden">
          {/* Cabecera */}
          <div className="bg-brand-black p-6 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-brand-accent-hover uppercase tracking-tight">
                {campo?.name || "Editar Campo"}
              </h1>
              <p className="text-[10px] text-gray-400 font-mono mt-1">UUID: {campo?.id}</p>
            </div>
            {/* <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Estado</span>
                <input 
                    type="checkbox" 
                    name="state"
                    checked={campo?.state || false}
                    onChange={handleChange}
                    className="w-5 h-5 accent-brand-accent-hover cursor-pointer"
                />
                <span className={`text-[11px] font-black ${campo?.state ? "text-brand-accent-hover/50" : "text-red-500"}`}>
                    {campo?.state ? 'ACTIVO' : 'INACTIVO'}
                </span>
            </div> */}
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
             
              <FieldInput 
                label="Nombre de la Cancha"
                name="name" // Si escribes "nombree" dará error, lo cual es genial
                value={campo?.name}
                icon={<Info size={18} />}
                isEditable={!!isEditable.name}
                onToggle={() => toggleLock('name')}
                onChange={handleChange}
              />

              {/* Ubicación */}
              <FieldInput 
                label="Ubicación / Sector"
                name="location"
                value={campo?.location}
                icon={<MapPin size={16}/>}
                isEditable={!!isEditable.location}
                onToggle={() => toggleLock('location')}
                onChange={handleChange}
              />

              {/* Precio */}
              <FieldInput 
                label="Precio por Hora (S/)"
                name="price_per_hour"
                type="number"
                value={Number(campo?.price_per_hour)}
                icon={<Banknote size={16}/>}
                isEditable={!!isEditable.price_per_hour}
                onToggle={() => toggleLock('price_per_hour')}
                onChange={handleChange}
              />

              {/* Capacidad */}
              <FieldInput 
                label="Capacidad (Jugadores)"
                name="capacity"
                type="number"
                value={campo?.capacity}
                icon={<Users size={16}/>}
                isEditable={!!isEditable.capacity}
                onToggle={() => toggleLock('capacity')}
                onChange={handleChange}
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Descripción detallada</label>
                <button
                  type="button"
                  onClick={() => toggleLock('description')}
                  className="bg-brand-gold p-2 rounded-sm hover:bg-brand-gold/80 text-brand-black transition-all duration-300 text-[12px] font-bold  uppercase hover:underline"
                >
                  {isEditable.description ? 'Cerrar edición' : 'Editar Descripcion'}
                </button>
              </div>
              <textarea
                name="description"
                value={campo?.description || ""}
                onChange={handleChange}
                rows={4}
                disabled={!isEditable.description}
                className={`w-full p-4 rounded-xl border text-sm transition-all outline-none resize-none
                    ${isEditable.description ? 'border-brand-accent-hover bg-white ring-4 ring-brand-accent-hover/5' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
              />
            </div>

            {/* Botón Guardar */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-brand-primary text-brand-accent-hover font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-brand-primary/90 transition-all shadow-xl active:scale-[0.98] disabled:opacity-70 mt-4 uppercase tracking-widest text-sm"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {saving ? "Guardando..." : "Confirmar Actualización"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};



const FieldInput = ({ 
  label, 
  name, 
  value, 
  icon, 
  isEditable, 
  onToggle, 
  onChange, 
  type = "text" 
}: FieldInputProps) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-wider">
      {label}
    </label>
    <div className="flex gap-2">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        <input
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          disabled={!isEditable}
          className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 text-sm transition-all outline-none
            ${isEditable 
              ? 'border-brand-gold bg-white shadow-lg shadow-brand-gold/5 text-brand-black' 
              : 'border-brand-gray bg-slate-50 text-slate-400 cursor-not-allowed'}`}
        />
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
          isEditable 
            ? 'bg-brand-gold border-brand-gold text-brand-black shadow-md shadow-brand-gold/20' 
            : 'bg-white border-brand-gray text-slate-300 hover:border-brand-black hover:text-brand-black'
        }`}
      >
        {isEditable ? <Unlock size={18}/> : <Lock size={18}/>}
      </button>
    </div>
  </div>
);

export default EditCampo;