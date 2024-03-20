"use client"
import React, { ReactNode } from 'react';
import { Breadcrumb, Button, Layout, Menu, theme } from 'antd';
import { useAuth } from '@/context/AuthContext';



const LogOut = () => {
  
  const { logout } = useAuth(); // Usa el hook useAuth para obtener la función de inicio de sesión del contexto de autenticación

  return (
    
          <Button className='bg-blue-500' href='/' onClick={logout}> Salir </Button>
        
  );
};

export default LogOut;