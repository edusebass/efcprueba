"use client"
import React, { useState, useEffect } from 'react';
import { Form, Select, Button, message, Input, Card, Modal, Table } from 'antd';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const MatriculaForm = () => {
	const columns = [
		{
		key: "1",
		title: "ID",
		dataIndex: "id",
		},
		{
		key: "2",
		title: "Codigo",
		dataIndex: "codigo",
		},
		{
		key: "3",
		title: "Descripcion",
		dataIndex: "descripcion",
		},
		{
			key: "4",
			title: "Estudiante",
			dataIndex: "estudiante",
		},
		{
			key: "5",
			title: "Materia",
			dataIndex: "materia",
		},
		{
		key: "6",
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

	interface Estudiante {
		id: number;
		_id: string;
		nombre: string;
		apellido: string;
	}
	
	interface Materia {
		id: number;
		_id: string;
		nombre: string;
		codigo: string;
		descripcion: string;
		creditos: number;
	}

	const [dataSource, setDataSource] = useState<Estudiante[]>([]); //aqui se guardar los datos obtenidos de la api
	const [dataSource2, setDataSource2] = useState<Materia[]>([]); //aqui se guardar los datos obtenidos de la api
	const [dataSource3, setDataSource3] = useState([]); //aqui se guardar los datos obtenidos de la api
	console.log(dataSource)
	console.log(dataSource2)
	console.log(dataSource3)

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

	const fetchModules = async (token:any) => {
		try {
			const response = await fetch("http://localhost:3000/api/materias", {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			}
			});
			if (!response.ok) {
			throw new Error("Error al obtener las materias");
			}
			const data = await response.json();
			console.log(data)

			const formattedData1 = data.map((materia:any, index:any) => ({
			id: index + 1,
			_id: materia._id,
			nombre: materia.nombre,
			codigo: materia.codigo,
			descripcion: materia.descripcion,
			creditos: materia.creditos
			
			}));
			return formattedData1 
		} catch (error) {
			console.log("Error:", error);
			return [];
		}
	};

	//obtiene lo de la tabla
	const fetchModules3 = async (token:any) => {
		try {
			const response = await fetch("http://localhost:3000/api/matriculas", {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			}
			});
			if (!response.ok) {
			throw new Error("Error al obtener las materias");
			}
			const data = await response.json();
			console.log(data)

			const formattedData2 = data.map((matriculas:any, index:any) => ({
			id: index + 1,
			_id: matriculas._id,
			codigo: matriculas.codigo,
			descripcion: matriculas.descripcion,
			estudiante: matriculas.id_estudiante.nombre,
			materia: matriculas.id_materia.nombre
			
			}));
			return formattedData2 
		} catch (error) {
			console.log("Error:", error);
			return [];
		}
	};

	useEffect(() => {
		// token
		const token = localStorage.getItem('token')
		fetchModule(token).then((formattedData) => {
			setDataSource(formattedData);
		});
		fetchModules(token).then((formattedData1) => {
			setDataSource2(formattedData1);
		});
		fetchModules3(token).then((formattedData2) => {
			setDataSource3(formattedData2);
		});
	}, []);


	const { Option } = Select;
	const [form] = Form.useForm();
	const [isEditing, setIsEditing] = useState(false); //variable para modal editar
  	const [editingModule, setEditingModule] = useState<any>(null); //variable para saber si se esta editando
	const [loading, setLoading] = useState(false);

	const onSave = async () => {
		try {
			const token = localStorage.getItem('token');
			form.validateFields().then(async (values) => {
				console.log(values)
		
				let url = 'http://localhost:3000/api/matricula/registro';
				let method = 'POST';
				if (editingModule) {
					url = `http://localhost:3000/api/matricula/actualizar/${editingModule._id}`;
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
			
				fetchModules3(token).then((formattedData) => {
					setDataSource3(formattedData);
				});
			});
		} catch (error:any) {
			console.log('Error:', error.message);
			message.error(error.message || 'Error al procesar la solicitud');
		}
	};
	
	const onEdit = (record:any) => {
		setIsEditing(true);
		setEditingModule(record);
		form.setFieldsValue(record); // Llenar el formulario con los datos del estudiante
	};

	const onDelete = async (_id:any) => {
	try {
		const token = localStorage.getItem('token');
		const response = await fetch(`http://localhost:3000/api/matricula/eliminar/${_id}`, {
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
		fetchModules3(token).then((formattedData) => {
			setDataSource3(formattedData);
		});
		
		} catch (error:any) {
			console.log('Error:', error.message);
			message.error(error.message);
		}
	};

	return (
		
		<div className="App">
		<header className="App-header">
			<Button onClick={() => setIsEditing(true)}>Añadir nueva matricula</Button>
			<Table columns={columns} dataSource={dataSource3}></Table>
			{/* Modal para agregar y editar */}
			<Modal
				title={editingModule ? "Editar " : "Agregar "}
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
					name="codigo"
					label="Codigo"
					rules={[{ required: true, message: 'Por favor ingrese el codigo de la materia' }]}
					>
				<Input />
				</Form.Item>
				<Form.Item
					name="descripcion"
					label="Descripcion"
					rules={[{ required: true, message: 'Por favor ingrese el codigo de la materia' }]}
					>
				<Input />
				</Form.Item>
				<Form.Item
					name="id_estudiante"
					label="Estudiante"
					rules={[{ required: true, message: 'Por favor seleccione un estudiante' }]}
					>
					<Select placeholder="Seleccione un estudiante">
					{dataSource.map(estudiante => (
						<Option key={estudiante.id} value={estudiante._id}>
						{estudiante.nombre} {estudiante.apellido}
						</Option>
					))}
					</Select>
				</Form.Item>
				<Form.Item
					name="id_materia"
					label="Materia"
					rules={[{ required: true, message: 'Por favor seleccione una materia' }]}
					>
					<Select placeholder="Seleccione una materia">
					{dataSource2.map(materia => (
						<Option key={materia.id} value={materia._id}>
						{materia.nombre}
						</Option>
					))}
					</Select>
				</Form.Item>
				
			</Form>
		  </Modal>
		</header>
	  </div>
		

	);
};

export default MatriculaForm;
