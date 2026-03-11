"use client";

import { registerUserAction } from "@/actions/usuarios";
import Button from "@/components/landing/Button";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod'; 
import { useRouter } from "next/router";

const usuarioSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto"),
  email: z.string().email("Correo inválido").min(1, "El correo es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  dni: z.string()
      .length(8, "El DNI debe tener 8 dígitos")
      .regex(/^\d+$/, "Solo se permiten números"),
  phone: z.string()
          .length(9, "El teléfono debe tener 9 dígitos")
          .regex(/^\d+$/, "Solo se permiten números")
});

type UserFormValues = z.infer<typeof usuarioSchema>;

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
   // const [error, setError] = useState(string, []);
   const router= useRouter();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<UserFormValues>({
    resolver: zodResolver(usuarioSchema),
    mode: "onChange" // Valida mientras el usuario escribe
  });

  const onSubmit = async (data: UserFormValues) => {
    setServerError(null);
    try {
      const result:any = await registerUserAction(data);
      if (!result.success) {
        setServerError(result?.error);
      } else {
        // Redirigir o mostrar éxito
        router.push(`/dashboard`)
       // alert("¡Cuenta creada!");
      }
    } catch (error) {
      setServerError("Ocurrió un error inesperado");
    }
  };

  // Dentro de tu componente RegisterPage
const [checking, setChecking] = useState(false);

// const checkUniqueness = async (dni: string, email:string) => {
//   if (dni.length !== 8) return;
//   console.warn("dendre de chenck dni..")
  
//   setChecking(true);
//   try {
//     const res = await fetch(`/api/users/check?dni=${dni}&email=${email}`);
//     const data = await res.json();
//    // Si el DNI ya existe, marcamos el error en el input de DNI
//     if (data.dniExists) {
//       console.warn("dni registrado", dni)
//       setError("dni", { 
//         type: "manual", 
//         message: "Este DNI ya está registrado en Pukllay" 
//       });
//     }

//     // Si el Email ya existe, marcamos el error en el input de Email
//     if (data.emailExists) {
//       console.warn("email registrado", email)
//       setError("email", { 
//         type: "manual", 
//         message: "Este correo ya tiene una cuenta activa" 
//       });
//     }
//  } catch (err) {
//     console.error("Error validando unicidad:", err);
//   } finally {
//     setChecking(false);
//   }
// };


const checkUniqueness = async (field: 'dni' | 'email', value: string) => {
  if (!value || (field === 'dni' && value.length < 8)) return;

  setChecking(true);
  try {
    // Construcción limpia de parámetros
    const params = new URLSearchParams();
    if (field === 'dni') params.append('dni', value);
    if (field === 'email') params.append('email', value);

    const res = await fetch(`/api/users/check?${params.toString()}`);
    const data = await res.json();
    
    if (field === 'dni' && data.dniExists) {
      console.warn("dni ya registrado")
      setError("dni", { type: "manual", message: "Este DNI ya está registrado" });
    }

    if (field === 'email' && data.emailExists) {
      console.log("email ya registrado ")
      setError("email", { type: "manual", message: "Este correo ya está en uso" });
    }
  } catch (err) {
    console.error("Error en validación:", err);
  } finally {
    setChecking(false);
  }
};


  return (
    <section className="min-h-screen flex items-center justify-center bg-brand-secondary/20 py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-brand-primary/5 overflow-hidden">
        
        <div className="w-full text-center py-6 bg-brand-primary">
          <h2 className="text-3xl font-black text-brand-secondary uppercase tracking-tighter">
            Únete a <span className="text-brand-accent">Pukllay</span>
          </h2>
          <p className="text-brand-secondary/60 font-medium text-sm">Crea tu cuenta para empezar a reservar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Nombre Completo */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[10px] font-black text-brand-primary/40 uppercase ml-1">Nombre Completo</label>
            <input
              {...register("name")}
              placeholder="Ej. Juan Pérez"
              className={`bg-brand-secondary/40 p-4 rounded-2xl border-2 outline-none transition-all font-bold ${errors.name ? "border-red-400 bg-red-50" : "border-transparent focus:border-brand-accent"}`}
            />
            {errors.name && <span className="text-[10px] text-red-500 font-black ml-2 uppercase italic">{errors.name.message}</span>}
          </div>

          {/* DNI */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-brand-primary/40 uppercase ml-1">DNI / Documento</label>
            <input 
              {...register("dni", {
                  onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8) },
                  onBlur: (e) => checkUniqueness('dni', e.target.value) // Se dispara cuando el usuario sale del input
              })}
              inputMode="numeric"
              placeholder="8 dígitos"
              className={`bg-brand-secondary/40 p-4 rounded-2xl border-2 outline-none transition-all font-bold ${errors.dni ? "border-red-400 bg-red-50" : "border-transparent focus:border-brand-accent"}`}
            />
            {errors.dni && <span className="text-[10px] text-red-500 font-black ml-2 uppercase italic">{errors.dni.message}</span>}
            {checking && <span className="text-[9px] animate-pulse text-brand-accent ml-2">Verificando...</span>}
          </div>

          {/* Teléfono */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-brand-primary/40 uppercase ml-1">Teléfono móvil</label>
            <input
              {...register("phone", {
                onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9) }
              })}
              inputMode="numeric"
              placeholder="999888777"
              className={`bg-brand-secondary/40 p-4 rounded-2xl border-2 outline-none transition-all font-bold ${errors.phone ? "border-red-400 bg-red-50" : "border-transparent focus:border-brand-accent"}`}
            />
            {errors.phone && <span className="text-[10px] text-red-500 font-black ml-2 uppercase italic">{errors.phone.message}</span>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[10px] font-black text-brand-primary/40 uppercase ml-1">Correo Electrónico</label>
            <input
              {...register("email",{
                  //onChange: (e) => { e.target.value = e.target.value },
                  onBlur: (e) => checkUniqueness('email', e.target.value) // Se dispara cuando el usuario sale del input
              }) }
              type="email"
              placeholder="tu@email.com"
              className={`bg-brand-secondary/40 p-4 rounded-2xl border-2 outline-none transition-all font-bold ${errors.email ? "border-red-400 bg-red-50" : "border-transparent focus:border-brand-accent"}`}
            />
            {errors.email && <span className="text-[10px] text-red-500 font-black ml-2 uppercase italic">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[10px] font-black text-brand-primary/40 uppercase ml-1">Contraseña</label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className={`bg-brand-secondary/40 p-4 rounded-2xl border-2 outline-none transition-all font-bold ${errors.password ? "border-red-400 bg-red-50" : "border-transparent focus:border-brand-accent"}`}
            />
            {errors.password && <span className="text-[10px] text-red-500 font-black ml-2 uppercase italic">{errors.password.message}</span>}
          </div>

          {/* Error del Servidor */}
          {serverError && (
            <div className="md:col-span-2 bg-red-500 text-white p-3 rounded-xl text-xs font-black uppercase text-center animate-pulse">
              {serverError}
            </div>
          )}

          <div className="md:col-span-2 mt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full py-4 text-lg shadow-xl font-black uppercase tracking-widest italic"
            >
              {isSubmitting ? "Procesando..." : "Registrarme ahora"}
            </Button>
          </div>
        </form>

        <p className="text-center pb-8 text-sm text-brand-primary/60 font-bold uppercase tracking-tight">
          ¿Ya tienes cuenta? <Link href="/login" className="text-brand-accent font-black hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </section>
  );
}