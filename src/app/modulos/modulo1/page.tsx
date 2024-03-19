"use client"
import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Form, message } from 'antd';
import { useRouter } from 'next/navigation';
// import "antd/dist/antd.css";
// import "./App.css";
import { Button, Table, Modal, Input } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";


export default function page() {

  // variables auth
  const { auth } = useAuth();
  console.log(auth)
  const router = useRouter();

  //variables crud 
  const [isEditing, setIsEditing] = useState(false); //variable para modal
  const [editingStudent, setEditingStudent] = useState(null); //variable para saber si se esta editando
  const [dataSource, setDataSource] = useState([]); //aqui se guardar los datos obtenidos de la api
  const [form] = Form.useForm();

  
  // Aqui se define las columnas para la tabla de estudiantes
  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
    },
    {
      key: "2",
      title: "Nombre",
      dataIndex: "nombre",
    },
    {
      key: "3",
      title: "Apellido",
      dataIndex: "apellido",
    },
    {
      key: "4",
      title: "Cedula",
      dataIndex: "cedula",
    },
    {
      key: "5",
      title: "Fecha de nacimiento",
      dataIndex: "fechaNacimiento",
    },
    {
      key: "6",
      title: "Ciudad",
      dataIndex: "ciudad",
    },
    {
      key: "7",
      title: "Direccion",
      dataIndex: "direccion",
    },
    {
      key: "8",
      title: "Telefono",
      dataIndex: "telefono",
    },
    {
      key: "9",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "10",
      title: "Acciones",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditStudent(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteStudent(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  // listar estudiantes
  const fetchStudents = async (token:any) => {
    try {
      const response = await fetch("http://localhost:3000/api/estudiantes", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Error al obtener estudiantes");
      }
      const data = await response.json();
      console.log(data)

      const formattedData = data.map((estudiante:any, index:any) => ({
        id: index + 1,
        nombre: `${estudiante.nombre}`,
        apellido: estudiante.apellido,
        cedula: estudiante.cedula,
        fechaNacimiento: estudiante.fecha_nacimiento,
        ciudad: estudiante.ciudad,
        direccion: estudiante.direccion,
        telefono: estudiante.telefono,
        
        email: estudiante.email,
      }));
      return formattedData
    } catch (error) {
      console.log("Error:", error);
      return [];
    }
  };

  const onSaveStudent = async () => {
    
    try {
      const token = localStorage.getItem('token')
      form.validateFields().then(async (values) => {
        const response = await fetch('http://localhost:3000/api/estudiante/registro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Añade el token de autorización si es necesario
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Error al registrar el estudiante');
        }
  
        const responseData = await response.json();
        console.log(responseData.msg); // Mensaje de éxito del backend
        message.success('Estudiante registrado exitosamente');
        setIsEditing(false);
        form.resetFields(); // Limpiar el formulario después de agregar el estudiante
      });
    } catch (error:any) {
      console.error('Error:', error.message);
      message.error(error.message);
    }
  };



  useEffect(() => {
     // Reemplaza "tu_token_aqui" con el token real
     const token = localStorage.getItem('token')
    console.log(token)
    fetchStudents(token).then((formattedData) => {
      setDataSource(formattedData);
    });
  }, []);
  useEffect(() => {
    if (auth) {
      message.info(`Bienvenido: ${auth.nombre} ${auth.apellido}`);
    }
  }, [auth]); // Ejecutar efecto solo cuando 'auth' cambia





  // const onDeleteStudent = (record) => {
  //   Modal.confirm({
  //     title: "Are you sure, you want to delete this student record?",
  //     okText: "Yes",
  //     okType: "danger",
  //     onOk: () => {
  //       setDataSource((pre) => {
  //         return pre.filter((student) => student.id !== record.id);
  //       });
  //     },
  //   });
  // };
  // const onEditStudent = (record) => {
  //   setIsEditing(true);
  //   setEditingStudent({ ...record });
  // };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingStudent(null);
  };



  
  return (
    <>
      <div className="App">
      <header className="App-header">
        <Button onClick={() => setIsEditing(true)}>Add a new Student</Button>
        <Table columns={columns} dataSource={dataSource}></Table>
        {/* Modal para agregar estudiante */}
        <Modal
          title="Agregar Estudiante"
          visible={isEditing}
          onCancel={() => {
            resetEditing();
          }}
          footer={[
            <Button key="cancel" onClick={() => {
              resetEditing();
            }}>
              Cancelar
            </Button>,
            <Button key="save" type="primary" onClick={onSaveStudent}>
              Guardar
            </Button>,
          ]}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Nombre"
              rules={[{ required: true, message: 'Por favor ingrese el nombre del estudiante' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Por favor ingrese el correo electrónico del estudiante' },
                { type: 'email', message: 'Por favor ingrese un correo electrónico válido' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Dirección">
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal para editar */}
        {/* <Modal
          title="Edit Student"
          visible={isEditing}
          okText="Save"
          onCancel={() => {
            resetEditing();
          }}
          onOk={() => {
            setDataSource((pre) => {
              return pre.map((student) => {
                if (student.id === editingStudent.id) {
                  return editingStudent;
                } else {
                  return student;
                }
              });
            });
            resetEditing();
          }}
        >
          <Input
            value={editingStudent?.name}
            onChange={(e) => {
              setEditingStudent((pre) => {
                return { ...pre, name: e.target.value };
              });
            }}
          />
          <Input
            value={editingStudent?.email}
            onChange={(e) => {
              setEditingStudent((pre) => {
                return { ...pre, email: e.target.value };
              });
            }}
          />
          <Input
            value={editingStudent?.address}
            onChange={(e) => {
              setEditingStudent((pre) => {
                return { ...pre, address: e.target.value };
              });
            }}
          />
        </Modal> */}
      </header>
    </div>
    </>
  )
}
