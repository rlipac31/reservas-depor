"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { logout } from '@/actions/auth';
import { useRouter } from "next/navigation";

// Importamos los mismos iconos que usas en tu Sidebar
import { 
  FiMap, 
  FiCalendar, 
  FiCreditCard, 
  FiUsers, 
  FiUserCheck 
} from "react-icons/fi";

interface NavbarProps {
  userRole: "ADMIN" | "USER";
}

export default function MobileNavbar({ userRole }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Campos", href: "/dashboard/campos", icon: FiMap, roles: ["ADMIN", "USER"] },
    { name: "Reservas", href: "/dashboard/reservas", icon: FiCalendar, roles: ["ADMIN", "USER"] },
    { name: "Pagos", href: "/dashboard/pagos", icon: FiCreditCard, roles: ["ADMIN", "USER"] },
    { name: "Usuarios", href: "/dashboard/usuarios", icon: FiUsers, roles: ["ADMIN"] },
    { name: "Clientes", href: "/dashboard/clientes", icon: FiUserCheck, roles: ["ADMIN", "USER"] },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="lg:hidden w-full bg-brand-primary text-brand-white sticky top-0 z-[60] shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo Mini */}
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter text-brand-accent italic uppercase">
            PUKLLAY
          </span>
          <div className="h-0.5 w-6 bg-brand-accent rounded-full" />
        </div>

        {/* Botón Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-2xl text-brand-accent focus:outline-none"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Menú Desplegable */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-brand-primary border-t border-brand-white/10 p-4 space-y-2 animate-in slide-in-from-top duration-300">
          {menuItems.map((item) => {
            if (!item.roles.includes(userRole)) return null;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-5 py-3 rounded-xl font-bold transition-all ${
                  isActive 
                    ? "bg-brand-accent text-brand-primary shadow-lg" 
                    : "text-brand-white/70 active:bg-brand-white/5"
                }`}
              >
                <item.icon className="text-lg" />
                <span className="uppercase text-xs tracking-wider">{item.name}</span>
              </Link>
            );
          })}
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-3 w-full rounded-xl font-black text-xs uppercase text-red-400 border border-red-500/20 mt-4"
          >
            <FiLogOut className="text-lg" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </nav>
  );
}