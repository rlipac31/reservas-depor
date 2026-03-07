"use client";

import { getUserIdAction } from '@/actions/usuarios';
import { getSession } from '@/lib/jwt/auth-utils';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
//import { verifySession as verifySessionAction } from '@/app/actions/auth';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
//   slug?: string;
//   businessId?: string;
//   currency?: { code: string; symbol: string };
//   zonaHoraria?: string;
//   configId?: string;
// 
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, initialUser }: { children: ReactNode, initialUser: UserData | null }) {
  // Inicializamos el estado directamente con lo que el servidor ya leyó del JWT
  const [user, setUser] = useState<UserData | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser); // Si no hay initialUser, activamos carga
  //console.log(" desde contes desde arriba.... user ", user)




  useEffect(() => {
    // Solo ejecutamos verifySession si el servidor NO nos pasó datos (ej. navegación directa)
    if (!initialUser) {
      const verifySession = async () => {
        try {

          const { success, content}:any = await getUserIdAction()
          if(success){
             const dataUser:any ={
              id:content.id,
              name:content.name,
              email:content.email,
              role:content.role
             }
            
            setUser(dataUser)
          }
         
        } catch (error) {
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      verifySession();
    }
  }, [initialUser]);


  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  // console.log('user desde useUser ', context);
  if (context === undefined) {
    return { user: null, setUser: () => { }, loading: false };
  }
  return context;
}