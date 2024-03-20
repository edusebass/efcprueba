"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'
import { DatePicker, Form, message, Button, Table, Modal, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";


export default function page() {

  // variables auth
  const { auth } = useAuth();
  console.log(auth)
  const router = useRouter();

  //variables crud 
  const [isEditing, setIsEditing] = useState(false); //variable para modal editar
  const [editingModule, setEditingModule] = useState(null); //variable para saber si se esta editando
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
      render: (record:any) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEdit(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDelete(record._id);
                console.log(record.id)
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  // listar
  const fetchModule = async (token:any) => {
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
        fechaNacimiento: new Date(estudiante.fecha_nacimiento).toISOString().split('T')[0],
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

  
  //funcion para actualizar y registrar
  const onSave = async () => {
    try {
      const token = localStorage.getItem('token');
      form.validateFields().then(async (values) => {
        // solo cuando utilze fechas
        const fechaNacimiento = values.fecha_nacimiento.toISOString().split('T')[0];
        values.fecha_nacimiento = fechaNacimiento;
  
        let url = 'http://localhost:3000/api/estudiante/registro';
        let method = 'POST';
        if (editingModule) {
          url = `http://localhost:3000/api/estudiante/actualizar/${editingModule._id}`;
          method = 'PUT';
        }
  
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          message.error(errorData.msg)
          return null;
        }
  
        message.success(editingModule ? 'Estudiante actualizado exitosamente' : 'Estudiante registrado exitosamente');
        setIsEditing(false);
        form.resetFields();
  
        fetchModule(token).then((formattedData) => {
          setDataSource(formattedData);
        });
      });
    } catch (error:any) {
      console.log('Error:', error.message);
      message.error(error.message || 'Error al procesar la solicitud');
    }
  };

  //funcion para poder eliminar un estudiante
  const onDelete = async (_id:any) => {
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
      setDataSource((prevData) => prevData.filter((student:any) => student._id));
      console.log(dataSource)
      message.success('Estudiante eliminado exitosamente');

      // Obtener la lista actualizada de estudiantes después de agregar uno nuevo
      fetchModule(token).then((formattedData) => {
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
    fetchModule(token).then((formattedData) => {
      setDataSource(formattedData);
    });
  }, []);
  useEffect(() => {
    if (auth) {
      message.info(`Bienvenido: ${auth.nombre} ${auth.apellido}`);
    }
  }, [auth]); // Ejecutar efecto solo cuando 'auth' cambia
  
  // Función para abrir el modal de edición y establecer los datos del estudiante en edición
  const onEdit = (record:any) => {
    setIsEditing(true);
    setEditingModule(record);
    form.setFieldsValue(record); // Llenar el formulario con los datos del estudiante
  };

  return (
    <>
      <div className="App">
      <header className="App-header">
        <Button onClick={() => setIsEditing(true)}>Add a new Student</Button>
        <Table columns={columns} dataSource={dataSource}></Table>
        {/* Modal para agregar estudiante */}
        <Modal
          title={editingModule ? "Editar Estudiante" : "Agregar Estudiante"}
          visible={isEditing}
          onCancel={() => {
            setIsEditing(false);
            form.resetFields();
          }}
          footer={[
            <Button key="cancel" onClick={() => {
              setIsEditing(false);
              form.resetFields();
            }}>
              Cancelar
            </Button>,
            <Button key="save" type="primary" onClick={onSave} className='bg-blue-700'>
              {editingModule ? 'Actualizar' : 'Guardar'}
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
      </header>
    </div>
    </>
  )
}
