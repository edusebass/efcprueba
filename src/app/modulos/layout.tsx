"use client"
import SideBar from "@/components/LogOut"
import { AuthProvider } from "@/context/AuthContext"
import React from 'react';
import { Layout, Menu } from 'antd';
const { Header, Content} = Layout;
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import Link from 'next/link';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <AuthProvider>

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
            <SideBar />
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
    </AuthProvider>

  )
}
