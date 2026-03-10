

import type { Metadata } from "next";
//import { Inter, Kanit } from 'next/font/google';
import "./globals.css";
import { UserData, UserProvider } from '@/context/UserContext';
import Navbar from "@/components/landing/Nabvar"; // Lo crearemos en el siguiente paso
import { getServerUser } from "@/actions/useServer";
import { getSessionServer } from "@/lib/jwt/session";


export const metadata: Metadata = {
  title: "Booking Pukllay | Reserva tu cancha",
  description: "La plataforma moderna para reservar campos deportivos en 2026",
};
  const session = await getSessionServer();
  console.log("initial user desde rooLaoyyt")
  console.table(session)


// const inter = Inter({ 
//   subsets: ['latin'],
//   variable: '--font-inter', // Variable CSS
// });

// // Configuramos la fuente para los títulos deportivos
// const kanit = Kanit({
//   weight: ['400', '700', '900'],
//   subsets: ['latin'],
//   style: ['normal', 'italic'],
//   variable: '--font-kanit',
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={``}>
      <body className="antialiased min-h-screen flex flex-col">
        {/* Navbar persistente en todas las páginas */}
        <UserProvider initialUser={session}>
             <main className="flex-grow">
              {children}
             </main>
        </UserProvider>
        {/* Aquí podría ir un Footer más adelante */}
      </body>
    </html>
  );
}