"use client"
import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { DatePicker, Form, message } from 'antd';
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
  const [editingStudentData, setEditingStudentData] = useState(null); //nuevo estado para almacenar los datos del estudiante que se está editando.

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
      render: (record:any) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditStudent(record._id);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteStudent(record._id);
                console.log(record.id)
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
        _id: estudiante._id,
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
      const token = localStorage.getItem('token');
      form.validateFields().then(async (values) => {
        // Convertir la fecha de nacimiento a formato AAAA/MM/DD
        const fechaNacimiento = values.fecha_nacimiento.toISOString().split('T')[0];
  
        // Asignar la fecha formateada de vuelta a los values
        values.fecha_nacimiento = fechaNacimiento;
  
        const response = await fetch('http://localhost:3000/api/estudiante/registro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          message.error(errorData.msg)
          // throw new Error(errorData.msg || 'Error al registrar el estudiante');
          return null
          
        }
        
  
        message.success('Estudiante registrado exitosamente');
        setIsEditing(false);
        form.resetFields(); 

        // Obtener la lista actualizada de estudiantes después de agregar uno nuevo
        fetchStudents(token).then((formattedData) => {
          setDataSource(formattedData);
        });
      });
    } catch (error:any) {
      console.error('Error:', error.message);
      message.error(error.message);
    }
  };

  //funcion para poder eliminar un estudiante
  const onDeleteStudent = async (_id:any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/estudiante/eliminar/${_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al eliminar el estudiante');
      }
  
      // Eliminar el estudiante de la lista localmente
      setDataSource((prevData) => prevData.filter((student) => student._id));
      console.log(dataSource)
      message.success('Estudiante eliminado exitosamente');

      // Obtener la lista actualizada de estudiantes después de agregar uno nuevo
      fetchStudents(token).then((formattedData) => {
        setDataSource(formattedData);
      });
      
    } catch (error:any) {
      console.log('Error:', error.message);
      message.error(error.message);
    }
  };

  //useeffect para poder enviar el mesnaje de bienvenida y obtener el token cuando
  // se despliega la tabla
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
  
  const onEditStudent = (_id:any) => {
    setIsEditing(true);
    setEditingStudent({ ..._id });
  };

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
              name="nombre"
              label="Nombre"
              rules={[{ required: true, message: 'Por favor ingrese el nombre del estudiante' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="apellido"
              label="Apellido"
              rules={[{ required: true, message: 'Por favor ingrese el apellido del estudiante' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="cedula"
              label="Cédula"
              rules={[{ required: true, message: 'Por favor ingrese la cédula del estudiante' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="fecha_nacimiento"
              label="Fecha de nacimiento"
              rules={[{ required: true, message: 'Por favor ingrese la fecha de nacimiento del estudiante' }]}
            >
              <DatePicker format="YYYY/MM/DD" />
            </Form.Item>
            <Form.Item
              name="ciudad"
              label="Ciudad"
              rules={[{ required: true, message: 'Por favor ingrese la ciudad del estudiante' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="direccion"
              label="Dirección"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="telefono"
              label="Teléfono"
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
