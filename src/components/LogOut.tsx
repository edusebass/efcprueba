"use client"
import React, { ReactNode, useState } from 'react';
import { Breadcrumb, Button, Layout, Menu, theme } from 'antd';
import { useAuth } from '@/context/AuthContext';

const LogOut = () => {
  const [loading, setLoading] = useState(false)
  const { logout } = useAuth(); // Usa el hook useAuth para obtener la función de inicio de sesión del contexto de autenticación

  // const loadingCharge = () => {
  //   setLoading(true)
  // }
  return (
    
    <Button className='bg-blue-500 text-white' href='/' onClick={logout} loading={loading}> Salir </Button>
        
  );
};

export default LogOut;