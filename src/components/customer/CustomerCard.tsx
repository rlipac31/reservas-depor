'use client';

import { Mail, Phone, ShieldCheck, User as UserIcon, Power, Edit3 } from 'lucide-react';
import { toggleCustomerStatusAction } from '@/actions/customer';
import { useState } from 'react';
import UserModal from '../utils/UserModal';
import Link from 'next/link';

export default function CustomerCard({ customer }: { customer: any }) {
  const [loading, setLoading] = useState(false);
    const [modalConfig, setModalConfig] = useState<{isOpen: boolean, mode:'edit' | 'confirm'}>({
    isOpen: false,
    mode:'confirm'
  });



  

  // const handleToggleStatus = async () => {
  //   setLoading(true);
  //   await toggleUserStatusAction(user.id, user.state);
  //   setLoading(false);
  // };

 

    const handleToggleStatus = async () => {
    setLoading(true);
    await toggleCustomerStatusAction(customer.id, customer.state);
    setLoading(false);
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleEdit = async () => {
    setLoading(true);
    // Aquí iría tu server action de edición: await updateUserAction(...)
    setLoading(false);
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  return (
   <> 
    <div className="bg-white rounded-[2rem] border border-brand-primary/5 p-6 shadow-sm hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform ${customer.state ? 'bg-brand-accent text-brand-primary' : 'bg-gray-100 text-gray-400'}`}>
          <UserIcon size={24} />
        </div>
        <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${customer.state ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
          {customer.state ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="space-y-1 mb-6">
        <h3 className="text-xl font-black italic uppercase text-brand-primary leading-none truncate">
          {customer.name}
        </h3>
        <p className="text-[10px] font-bold text-brand-primary/30 uppercase tracking-widest flex items-center gap-1">
          <ShieldCheck size={10} className="text-brand-accent" /> {customer.role}
        </p>
      </div>

      <div className="space-y-2 border-t border-brand-primary/5 pt-4 mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/60">
          <Mail size={14} className="text-brand-accent" /> {customer.email}
        </div>
        {customer.phone && (
          <div className="flex items-center gap-2 text-xs font-bold text-brand-primary/60">
            <Phone size={14} className="text-brand-accent" /> {customer.phone}
          </div>
        )}
      </div>

      {/* <div className="flex gap-2 mt-auto">
        <button 
          onClick={handleToggleStatus}
          disabled={loading}
          className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${customer.state ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
        >
          {loading ? <span className="animate-spin text-lg">●</span> : <Power size={14} />}
          {customer.state ? 'Desactivar' : 'Activar'}
        </button>
        <button className="p-3 bg-brand-primary text-white rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-all">
          <Edit3 size={16} />
        </button>
      </div> */}
         
        {/* Solo cambiamos los eventos de los botones al final: */}
        <div className="flex gap-2 mt-auto">
          <button 
            onClick={() => setModalConfig({ isOpen: true, mode: 'confirm' })} // Abrir modal confirmación
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${customer.state ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
          >
            <Power size={14} />
            {customer.state ? 'Desactivar' : 'Activar'}
          </button>
         <Link href={`/dashboard/clientes/${customer.id}`}>
          <button 
            //onClick={() => setModalConfig({ isOpen: true, mode: 'edit' })} // Abrir modal edición
            className="p-3 bg-brand-primary text-white rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-all"
          >
            <Edit3 size={16} />
          </button>
         </Link> 
 
        </div>
    </div>

     {/* Insertamos el Modal */}
    <UserModal 
        isOpen={modalConfig.isOpen}
        mode={modalConfig.mode}
        user={customer}
        loading={loading}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onAction={modalConfig.mode === 'confirm' ? handleToggleStatus : handleEdit}
      />
    </>
  );
}


/////////////////////



// function UserCard2({ user }: { user: any }) {
//   const [loading, setLoading] = useState(false);
//   const [modalConfig, setModalConfig] = useState<{isOpen: boolean, mode: 'edit' | 'confirm'}>({
//     isOpen: false,
//     mode: 'confirm'
//   });

//   const handleToggleStatus = async () => {
//     setLoading(true);
//     await toggleUserStatusAction(user.id, user.state);
//     setLoading(false);
//     setModalConfig({ ...modalConfig, isOpen: false });
//   };

//   const handleEdit = async () => {
//     setLoading(true);
//     // Aquí iría tu server action de edición: await updateUserAction(...)
//     setLoading(false);
//     setModalConfig({ ...modalConfig, isOpen: false });
//   };

//   return (
//     <>
//       <div className="bg-white rounded-[2rem] border border-brand-primary/5 p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
//         {/* ... (Todo tu código actual del UserCard se mantiene igual) ... */}
        
//         {/* Solo cambiamos los eventos de los botones al final: */}
//         <div className="flex gap-2 mt-auto">
//           <button 
//             onClick={() => setModalConfig({ isOpen: true, mode: 'confirm' })} // Abrir modal confirmación
//             className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${user.state ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
//           >
//             <Power size={14} />
//             {user.state ? 'Desactivar' : 'Activar'}
//           </button>
//           <button 
//             onClick={() => setModalConfig({ isOpen: true, mode: 'edit' })} // Abrir modal edición
//             className="p-3 bg-brand-primary text-white rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-all"
//           >
//             <Edit3 size={16} />
//           </button>
//         </div>
//       </div>

//       {/* Insertamos el Modal */}
//       <UserModal 
//         isOpen={modalConfig.isOpen}
//         mode={modalConfig.mode}
//         user={user}
//         loading={loading}
//         onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
//         onAction={modalConfig.mode === 'confirm' ? handleToggleStatus : handleEdit}
//       />
//     </>
//   );
// }