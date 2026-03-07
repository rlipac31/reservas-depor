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

export interface FieldIdResponse {
  id: string;
  name: string;
  description: string | null;
  location?: string |  undefined;
  capacity: number;
  price_per_hour: number | null;
  is_deleted: boolean;
  state: boolean;
  created_at: string;
  updated_at: string;
} 
/* 
 getFieldId 
 
id	'e2cfe09c-5c1d-432c-b1aa-1ca8560896f9'
name	'Campo Premiun'
description	'campo de gras nmatural medidas y tamaño profesional'
capacity	22
price_per_hour	200
location	'Chorrillos'
state	true
is_deleted	false
created_at	Mon Mar 02 2026 12:30:32 GMT-0500 (hora estándar de Colombia)
updated_at	Mon Mar 02 2026 12:30:32 GMT-0500 (hora estánd
*/

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


