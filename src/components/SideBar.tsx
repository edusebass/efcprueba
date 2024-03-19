"use client"
import React, { ReactNode } from 'react';
import { Breadcrumb, Button, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer } = Layout;
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';



const SideBar = ({children} : {children: ReactNode}) => {
  
  const { logout } = useAuth(); // Usa el hook useAuth para obtener la función de inicio de sesión del contexto de autenticación

  return (
    <Layout className=''>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="flex justify-between w-full items-center">
          <h1 className='text-white'>Nombre de la empresa</h1>
          <Button className='bg-blue-500' href='/' onClick={logout}> Salir </Button>
        </div>
      </Header>
      <Content className='flex'>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} className='w-1/6 h-screen'>
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link href="/modulos/modulo1">
            Modulo 1
          </Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
          <Link href="/modulos/modulo2">
            Modulo 2
          </Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<UploadOutlined />}>
          <Link href="/modulos/modulo3">
            Modulo 3
          </Link>
        </Menu.Item>
      </Menu>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            
          }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default SideBar;