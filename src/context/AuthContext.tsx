"use client"
import { message } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Define types for authentication data
interface AuthData {
  token: string;
  nombre: string;
  apellido: string;
  _id: string;
  email: string;
}

// Define context type
interface AuthContextType {
  auth: AuthData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const router = useRouter();


  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3000/api/login', { email, password });
      const userData = response.data;
      console.log(response)
      setAuth(userData);
      localStorage.setItem('token', userData.token); // Guardar token en localStorage
      document.cookie = `token=${userData.token}; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;

      router.push("/modulos/modulo1");
      

    } catch (error:any) {
      console.log('Error during login:', error.request.status === 404);
      router.push("/");
      message.error("Usuario o contraseña incorrectos")

    }
  };

  // Logout function
  const logout = () => {
    setAuth(null);
    localStorage.removeItem('token'); // Remover token del localStorage al cerrar sesión
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };


  const fetchUserProfile = async (storedToken:any) => {
    try {
      const response = await axios.get('http://localhost:3000/api/perfil', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      setAuth(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Fetch user profile on component mount and after login
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token)
    {
        fetchUserProfile(token)
    }
  }, [])
    
  

  console.log(auth)

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
