import { getSession } from "@/lib/jwt/auth-utils";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import MobileNavbar from "@/components/layout/MovilNavBar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session:any = await getSession();

  // Si no hay sesión o el rol no es válido, fuera.
  if (!session || (session.role !== "ADMIN" && session.role !== "USER")) {
    redirect("/login");
  }
 // console.log("sessin ", session )

  return (
   // <div className="flex min-h-screen bg-[#F8F9FA]"> {/* Fondo claro para contrastar el Sidebar oscuro */}
    <div className="flex flex-col  min-h-screen bg-[#F8F9FA] lg:flex-row min-h-screen">
       {/* Navbar Superior para Móviles */}
      <MobileNavbar userRole={session.role} />
      {/* Sidebar fijo a la izquierda */}
      <div className="hidden lg:inline-block">
               <Sidebar userRole={session.role} />
      </div>

     

     
 
      
      {/* Área de contenido que SI hace scroll */}
      <div className="flex-1 flex flex-col">
        {/* Un Header superior opcional para dar aire */}
        <header className="h-20 flex items-center justify-end px-10 bg-white/50 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200">
          {/* <div>
            <p className="text-brand-primary/40 font-bold uppercase text-xs tracking-widest">Bienvenido de nuevo</p>
            <h1 className="mt-2 text-2xl font-black text-brand-primary capitalize italic">{session.name}</h1>
          </div> */}
           <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-brand-primary/60 uppercase">Estado: <span className="text-green-500">Online</span></span>
              <div className="bg-brand-accent-hover w-10 h-10 rounded-full  flex items-center justify-center font-bold text-brand-secondary border-2 border-brand-accent-hover">
                {session?.name.charAt(0).toUpperCase() || 'U'}
              </div>
           </div>
        </header>

        <main className="p-0 flex-1 ">
          {children}
        </main>
      </div>
    </div>
  );
}