"use client";
import { useState } from 'react';
import {
    CheckCircle2,
    Loader2,
    User,
    Mail,
    Lock,
    Unlock,
    Fingerprint,
    Phone,
    X,
    AlertCircle,
    Save,
    Edit2,
    Shield
} from 'lucide-react';
import { updateUserAction } from '@/actions/usuarios';
import { useRouter } from 'next/navigation';
import { updateCustomerAction } from '@/actions/customer';

interface EditCustomerFormProps {
    customerData: {
        id: string;
        name: string;
        email: string;
        dni: string;
        phone: string;
        
    };
}

export default function EditUserForm({ customerData}: EditCustomerFormProps) {
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const router = useRouter();

    const [isEditable, setIsEditable] = useState({
        name: false,
        dni: false,
        phone: false,
        //  role: false,
        password: false
    });

    const [formData, setFormData] = useState({
        id: customerData.id || '',
        name: customerData.name || '',
        email: customerData.email || '',
        dni: customerData.dni || '',
        phone: customerData.phone || '',
        // role: userData.role || 'USER',
       // password: ''
    });

    const toggleField = (field: keyof typeof isEditable) => {
        setIsEditable(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'dni') {
            const onlyNums = value.replace(/[^0-9]/g, '');
            if (onlyNums.length <= 8) {
                setFormData(prev => ({ ...prev, [name]: onlyNums }));
            }
            return;
        }

        if (name === 'phone') {
            const onlyNums = value.replace(/[^0-9]/g, '');
            if (onlyNums.length <= 9) {
                setFormData(prev => ({ ...prev, [name]: onlyNums }));
            }
            return;
        }

        if (name === 'name') {
            const onlyLetters = value.replace(/[0-9]/g, '');
            setFormData(prev => ({ ...prev, [name]: onlyLetters }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (isEditable.dni && formData.dni.length > 0 && formData.dni.length !== 8) {
            setErrorMsg("El DNI debe tener exactamente 8 números");
            return;
        }

        if (isEditable.phone && formData.phone.length < 9) {
            setErrorMsg("El número debe tener entre 9  dígitos");
            return;
        }

        setLoading(true);
        // Enviamos solo los campos que están habilitados para editar (o el uid que es necesario)
        const dataToSend: any = {id: formData.id };
        if (isEditable.name) dataToSend.name = formData.name;
        if (isEditable.dni) dataToSend.dni = formData.dni;
        if (isEditable.phone) dataToSend.phone = formData.phone;
        // if (isEditable.role) dataToSend.role = formData.role;
        // if (isEditable.password && formData.password.length >= 6) dataToSend.password = formData.password;
       
        const result = await updateCustomerAction(customerData.id, dataToSend);
         console.warn("forData update customer ", formData, "dataToSend ==> ", dataToSend)
        if (result.success) {
            setLoading(false);
            setShowSuccess(true);
            setTimeout(() => {
                router.push(`/dashboard/clientes`);
                router.refresh();
            }, 1500);
        } else {
            setLoading(false);
            setErrorMsg(result.message || "Ocurrió un error inesperado al actualizar");
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-8 w-full">
            {/* MODAL DE ÉXITO */}
            {showSuccess && (
                <div className="fixed inset-0 bg-brand-primary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-brand-secondary rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-brand-accent text-brand-primary rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-brand-primary uppercase italic">¡Cliente Actualizado!</h3>
                        <p className="text-gray-500 mt-2 font-medium">Los cambios se han guardado correctamente.</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-brand-primary/20 overflow-hidden shadow-2xl">
                {/* HEADER */}
                <div className="bg-brand-primary p-6 flex items-center justify-between border-b-4 border-brand-accent-hover">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                            <Save size={24} className="text-brand-accent-hover" /> Editar Cliente (Staff)
                        </h2>
                    </div>
                    <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

                    {errorMsg && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3">
                            <AlertCircle className="text-red-500 shrink-0" size={20} />
                            <p className="text-red-800 text-xs font-bold uppercase">{errorMsg}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* NOMBRE */}
                        <div className="md:col-span-2 space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[11px] font-black text-brand-primary uppercase flex items-center gap-1.5">
                                    <User size={16} className="text-brand-accent-hover" /> Nombre Completo
                                </label>
                                <button
                                    type="button"
                                    onClick={() => toggleField('name')}
                                    className={`p-1.5  rounded-lg transition-all flex items-center gap-2 text-[10px] font-bold uppercase ${isEditable.name ? 'text-brand-accent bg-brand-primary shadow-lg scale-105' : 'text-gray-400 hover:text-brand-primary bg-gray-100'}`}
                                >
                                    {isEditable.name ? <Unlock size={16} /> : <Lock size={16} />}
                                    {isEditable.name ? 'Editar Activo' : 'Desbloquear'}
                                </button>
                            </div>
                            <input
                                required
                                type='text'
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditable.name}
                                className={`w-full px-4 py-3 border border-brand-primary/20 rounded-xl text-sm outline-none transition-all font-semibold ${!isEditable.name ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-dashed' : 'bg-gray-50 focus:border-brand-primary focus:ring-4 focus:ring-brand-accent/20 shadow-inner'}`}
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[11px] font-black text-brand-primary uppercase flex items-center gap-1.5">
                                    <Mail size={16} className="text-brand-accent-hover" /> Email (No editable)
                                </label>
                            </div>
                            <input
                                required
                                type='email'
                                name="email"
                                readOnly
                                value={formData.email}
                                disabled={true}
                                className={`w-full px-4 py-3 border border-brand-gray rounded-xl text-sm outline-none transition-all font-semibold bg-gray-100 text-gray-400 cursor-not-allowed border-dashed`}
                            />
                        </div>

               

                        {/* DNI */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[11px] font-black text-brand-primary uppercase flex items-center gap-1.5">
                                    <Fingerprint size={16} className="text-brand-accent-hover" /> DNI
                                </label>
                                <button
                                    type="button"
                                    onClick={() => toggleField('dni')}
                                    className={`p-1.5 rounded-lg transition-all ${isEditable.dni ? 'text-brand-accent-hover bg-brand-primary' : 'text-gray-400 hover:text-brand-primary bg-gray-100'}`}
                                >
                                    {isEditable.dni ? <Unlock size={16} /> : <Lock size={16} />}
                                </button>
                            </div>
                            <input
                                required
                                type='text'
                                name="dni"
                                value={formData.dni}
                                onChange={handleChange}
                                disabled={!isEditable.dni}
                                className={`w-full px-4 py-3 border border-brand-gray rounded-xl text-sm outline-none transition-all font-semibold ${!isEditable.dni ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-dashed' : 'bg-gray-50 focus:border-brand-black focus:ring-4 focus:ring-brand-gold/20 shadow-inner'}`}
                            />
                        </div>

                        {/* TELÉFONO */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[11px] font-black text-brand-primary uppercase flex items-center gap-1.5">
                                    <Phone size={16} className="text-brand-accent-hover" /> Teléfono
                                </label>
                                <button
                                    type="button"
                                    onClick={() => toggleField('phone')}
                                    className={`p-1.5 rounded-lg transition-all ${isEditable.phone ? 'text-brand-accent-hover bg-brand-primary' : 'text-gray-400 hover:text-brand-primary bg-gray-100'}`}
                                >
                                    {isEditable.phone ? <Unlock size={16} /> : <Lock size={16} />}
                                </button>
                            </div>
                            <input
                                required
                                type='text'
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditable.phone}
                                maxLength={10}
                                className={`w-full px-4 py-3 border border-brand-gray rounded-xl text-sm outline-none transition-all font-semibold ${!isEditable.phone ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-dashed' : 'bg-gray-50 focus:border-brand-black focus:ring-4 focus:ring-brand-gold/20 shadow-inner'}`}
                            />
                        </div>

                        {/* PASSWORD */}

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-brand-accent text-brand-primary font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-brand-accent/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] hover:bg-brand-primary/90 hover:text-brand-accent-hover"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            "Guardar Cambios del Usuario"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
