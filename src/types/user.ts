//create user method
export interface CustomerRequest {
  name: string;
  email: string;
  password: string;
  dni?: string;
  phone?: string;
  businessId: string;
}

// cliente
export interface UserType {
  uid: string;
  name: string;
  email: string;
  dni: string;
  phone: string;
  role: 'ADMIN' | 'USER' | 'CUSTOMER';
  state: boolean;
}

//create user method
export interface userRequest {
  name: string;
  email: string;
  password: string;
  dni?: string;
  phone?: string;
  businessId: string;
}
