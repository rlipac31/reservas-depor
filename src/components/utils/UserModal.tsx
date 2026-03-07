'use client';

import { X, AlertTriangle, Save, User as UserIcon } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode:'edit' | 'confirm';
  onAction: (data?: any) => void;
  loading: boolean;
  user:any;
}

export default function UserModal({ isOpen, onClose, mode, user, onAction, loading }: UserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-primary/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-brand-primary/5 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 flex justify-between items-start">
          <div className="w-12 h-12 bg-brand-accent rounded-2xl flex items-center justify-center -rotate-6">
            {mode === 'edit' ? <UserIcon className="text-brand-primary" /> : <AlertTriangle className="text-brand-primary" />}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="px-8 pb-8">
          {mode === 'edit' ? (
            /* --- FORMULARIO DE EDICIÓN --- */
            <div className="space-y-4">
              <h2 className="text-2xl font-black italic uppercase text-brand-primary">Editar Usuario</h2>
              <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onAction(); }}>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nombre Completo</label>
                  <input 
                   // defaultValue={user.name}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-accent rounded-xl p-3 text-sm font-bold outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Teléfono</label>
                  <input 
                  //  defaultValue={user.phone}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-accent rounded-xl p-3 text-sm font-bold outline-none transition-all"
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-accent hover:text-brand-primary transition-all mt-4"
                >
                  {loading ? <span className="animate-spin text-lg">●</span> : <Save size={18} />}
                  Guardar Cambios
                </button>
              </form>
            </div>
          ) : (
            /* --- CONFIRMACIÓN DE ESTADO --- */
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-black italic uppercase text-brand-primary">
                  {user.state ? '¿Desactivar Usuario?' : '¿Activar Usuario?'}
                </h2>
                <p className="text-sm font-bold text-slate-500">
                  Estás a punto de cambiar el acceso para <span className="text-brand-primary">{user.name}</span>. 
                  ¿Deseas continuar?
                </p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => onAction()}
                  disabled={loading}
                  className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${user.state ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
                >
                  {loading && <span className="animate-spin">●</span>}
                  Sí, {user.state ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}