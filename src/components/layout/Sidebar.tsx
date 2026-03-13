"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GiSoccerField } from "react-icons/gi";
import { 
  CalendarDays, 
  CreditCard, 
  Users, 
  BookUser, 
  LayoutDashboard,
  Settings
} from "lucide-react";

import { logout } from '@/actions/auth';

interface SidebarProps {
  userRole: "ADMIN" | "USER";
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashoboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "USER"] },
    { name: "Campos", href: "/dashboard/campos", icon: GiSoccerField , roles: ["ADMIN", "USER"] },
    { name: "Reservas", href: "/dashboard/reservas", icon: CalendarDays, roles: ["ADMIN", "USER"] },
    { name: "Pagos", href: "/dashboard/pagos", icon: CreditCard, roles:["ADMIN", "USER"] },
    { name: "Usuarios", href: "/dashboard/usuarios", icon: Users, roles: ["ADMIN"] },
    { name: "Clientes", href: "/dashboard/clientes", icon: BookUser, roles: ["ADMIN", "USER"] },
    { name: "Configuracion", href: "/dashboard/configuracion", icon: Settings, roles: ["ADMIN"] },
  ];

 const handleLogout = async()=>{
  await logout();
  router.push("/login");
 }


  return (
    /* Cambios clave: h-screen (alto total), sticky (se queda fijo al scrollear), top-0 */
    <aside className="w-50 lg:w-64 h-screen sticky top-0 bg-brand-primary flex flex-col shadow-2xl text-brand-white z-50">
      
      {/* Logo con Padding Superior */}
      <div className="pt-6 pb-5 px-8">
        <h2 className="text-2xl font-black tracking-tighter text-brand-accent italic uppercase">
          PUKLLAY
        </h2>
        <div className="h-1 w-10 bg-brand-accent mt-1 rounded-full" />
      </div>

      {/* Navegación con Scroll interno si hay muchos items */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          if (!item.roles.includes(userRole)) return null;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group ${
                isActive 
                  ? "bg-brand-accent text-brand-primary shadow-lg shadow-brand-accent/30 scale-105" 
                  : "hover:bg-brand-white/5 text-brand-white/50 hover:text-brand-white"
              }`}
            >
              <item.icon className={`text-xl ${isActive ? "text-brand-primary" : "group-hover:text-brand-accent"}`} />
              <span className="tracking-tight uppercase text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer del Sidebar: Botón Salir */}
      <div className="px-6 py-2 border-t border-brand-white/5 bg-brand-primary/50">
        <button 
        onClick={handleLogout}
        className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl font-black text-xs uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
          <BookUser className="text-lg" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}