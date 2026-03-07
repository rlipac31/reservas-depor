export interface CustomerIdTypeResponse {
  id: string;
  password:string;
  name: string;
  email?: string | null;
  dni?: string | null;
  phone?: string | null;
  state: boolean;
  created_at: string | Date;
  updated_at:string | Date;
}