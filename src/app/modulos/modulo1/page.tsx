"use client"
import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { message } from 'antd';
import { useRouter } from 'next/navigation';


export default function page() {
  const { auth } = useAuth();
  console.log(auth)
  const router = useRouter();

    if (auth) {
      message.info(`Bienvenido: ${auth.nombre} ${auth.apellido}`);
    } if(auth === null) {
      <div>No autenticado</div>
    }
  

  // if (!auth) {
  //   router.replace("/")
  // }

  return (
    <>
    <div>page1</div>
    <p>Bienvenido, {auth?.nombre} {auth?.apellido}</p>
    </>
  )
}
