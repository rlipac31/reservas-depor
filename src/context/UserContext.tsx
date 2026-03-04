"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
//import { verifySession as verifySessionAction } from '@/app/actions/auth';

export interface UserData {
  uid: string;
  nameUser: string;
  email?: string;
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
          // console.log("ejecutando getMe....debtreo del try")
          const url = `/api-backend/auth/me`;//production
          // console.log("url desde context", url);
          const urlLocal = `${process.env.NEXT_PUBLIC_API_URL}/auth/me`;

          // Cambia esto solo para probar si llega al backend
          const res = await fetch(`${url}`, {
            method: "GET",
            credentials: "include",
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            console.log(" user desde del effec context ", res);

          } else {
            setUser(null);
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

  // console.log('user desde user Context page ', user);

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