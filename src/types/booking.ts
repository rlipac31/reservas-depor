export interface CreateBookingResponse {
  data:{
    booking: { id: string; field_id:string; customer_id:string | null; duration_minutes: number; end_time: string;start_time: string; state: string; total_price: number; user_id: string; manual_customer_dni:string;manual_customer_name:string; manual_customer_phone:string; created_at: string};

    payment: {customer_dni_snapshot: string; customer_id: string | null; customer_name_snapshot: string; discount: number; id: string; payment_date: string; payment_method: string; status: string; total: number; user_id:
   string;  booking_id: string};
   
  },
   message:string;
  success: boolean;  
}



export interface BookingIdResponse {
  _id: string;
  userId: { name: string; uid: string };
  fieldId: { _id: string; name: string; location: string; pricePerHour: number };
  startTime: string; // Viene como string ISO de la API
  durationInMinutes: number;
  endTime: string;
  totalPrice: number;
  state: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  businessId: string;
}

//payment method
export interface PaymentDataRequest {
  bookingId?: string;
  userId: string;
  nameCustomer?: string;
  idUser: string;
  idCustomer?: string;
  dniCustomer?: string;
  amount: number;
  descuento?: number;
  total: number
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'YAPE' | 'CASH';
}



//bookins
export interface BookingType {
  _id: string;
  userId: { name: string; email: string };
  fieldId: { name: string; location: string };
  businessId: { slug: string; name: string; id: string; };
  startTime: string;
  endTime: string;
  durationInMinutes: number;
  totalPrice: number;
  state: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
  customerName: string;
  customerDNI: string;
  createdAt: string;
}


// types/booking.ts
//export type PaymentMethod = ['YAPE' , 'CASH' , 'CREDIT_CARD'];



// Nota: 'number' en minúscula siempre
export interface BookingFormInput {
  fieldId: string;
  idUser: string;
  startTime: string;
  durationInMinutes: number;
  paymentMethod: string; // O el Enum que uses
  amount: number;        // Corregido: 'amount' con 'n'
  descuento: number;
  total: number;
  idCustomer?: string;
  dniCustomer?: string;
  nameCustomer?: string;
  phonePayment?: string;
}


//create bookings method
export interface bookingRequest {
  userId: string;
  fieldId: string;
  starTime: Date;
  durationInMinutes: number;
}







// Tipos para Usuarios (si tu API maneja autenticación)
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
}

// Tipos para la respuesta de la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Tipos para el formulario de reserva
export interface FormularioReserva {
  userId: string;
  fieldId: string;
  startTime: Date;
  durationInMinutes: number;
}



// response reservas por campo

export interface userIdBookingsByField {
  _id: string;
  name: string;
  email: string;
  phone: string;

}
export interface fieldIdBoookingByField {
  _id: string;
  neme: string;
  location: string;
}

export interface dataBookisByField {
  _id: string;
  userId: userIdBookingsByField;
  fieldId: fieldIdBoookingByField;
  startTime: Date;
  durationInMinutes: number;
  endTime: Date;
  totalPrice: number;
  state: string;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;

}

export interface metadataBookingByField {
  requestedDate: Date;
  fieldId: string;
  businessId: string;
}

export interface bookingsByFieldResponse {
  status: string;
  results: number;
  metadata: bookingsByFieldResponse;
  data: dataBookisByField;
}


