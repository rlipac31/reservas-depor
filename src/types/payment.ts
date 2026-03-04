

export interface dataPaymentType {
     id: string;
     booking_id: string;
     start_time: string;
     end_time: string;
     user_id: string | null;                       // puede ser null
     users: { name: string; email: string } | null; // o bien null
     customer_id: string | null;
     customer_name_snapshot: string | null;
     customer_dni_snapshot: string | null;
     amount: number;
     discount: number;
     total: number;
     payment_date: string;                         // la API devuelve ISO
     payment_method: string;
     payment_reference: string | null;
     status: string;
}

export interface resumenPaymentType{
   totaGlobals:number;
   porYape:number;
   porEfectivo:number;
   porTarjeta:number;
}
export interface paginationType{
        totalResults:number;
        totalPages:number;
        currentPage: number;
        limit: number;
     }
export interface paymentConFiltroResponse {
     
      data:dataPaymentType[];
      resumen:resumenPaymentType;
      pagination:paginationType;
}