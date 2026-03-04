//campos de tipos compartidos entre frontend y backend
export interface SoccerField {
  id: string;
  name: string;
  description: string;
  location: string;
  capacity: number;
  pricePerHour: number;
  available: boolean;
  state: boolean;
  businessId: string;
  bookings:string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


// Tipos para Canchas
export interface Cancha {
  id: number;
  nombre: string;
  ubicacion: string;
  precioPorHora: number;
  imagen: string;
  horariosDisponibles: string[];
  descripcion?: string; // Opcional
  servicios?: string[]; // Ej: ["Vestidores", "Iluminación", "Parking"]
}



// Tipos para Reservas
export interface Reserva {
  id: string; // UUID o ID generado por tu backend
  canchaId: number;
  usuarioId: string; // ID del usuario que reserva
  fecha: string; // Formato YYYY-MM-DD
  horario: string; // Formato HH:MM
  precioTotal: number;
  estado: "pendiente" | "confirmada" | "cancelada" | "completada";
  creadoEn: string; // ISO Date string
}

// Tipos para el dashboard de reservas (ejemplo)
export type ReservaConCancha = Reserva & {
  cancha: Cancha;
};


