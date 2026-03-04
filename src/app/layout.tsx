

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/landing/Nabvar"; // Lo crearemos en el siguiente paso

export const metadata: Metadata = {
  title: "Booking Pukllay | Reserva tu cancha",
  description: "La plataforma moderna para reservar campos deportivos en 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen flex flex-col">
        {/* Navbar persistente en todas las páginas */}
       

        <main className="flex-grow">
          {children}
        </main>

        {/* Aquí podría ir un Footer más adelante */}
      </body>
    </html>
  );
}