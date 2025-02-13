import React, { useState, useEffect } from "react";
import { getPrograms } from "./services/studentService";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  message,
  Space,
} from "antd";
import { UserOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons";

const { Option } = Select;

const StudentRegistrationForm = ({ onStudentAdded }) => {
  const [form] = Form.useForm();
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProgramsData = async () => {
      try {
        const data = await getPrograms();
        setProgramas(data);
      } catch (err) {
        console.error("Error fetching Programs:", err);
        message.error("Error al cargar los programas");
      }
    };
    fetchProgramsData();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    const apiUrl =
      "https://back.app.validaciondebachillerato.com.co/api/students";
    try {
      if (!values.fechaNacimiento) {
        throw new Error("La fecha de nacimiento es requerida");
      }
      const formattedValues = {
        ...values,
        fechaNacimiento: values.fechaNacimiento.format("YYYY-MM-DD"),
        programa_id: parseInt(values.programa_id, 10),
        coordinador: "Mauricio Pulido",
        simat: "Inactivo",
        pagoMatricula: false,
      };
      console.log("Sending data:", formattedValues);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedValues),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error del servidor: ${response.status}`);
      }
      const data = await response.json();
      console.log("Success response:", data);
      message.success("Estudiante registrado exitosamente");
      onStudentAdded?.();
      form.resetFields();
    } catch (error) {
      console.error("Error detallado al registrar el estudiante:", {
        message: error.message,
        stack: error.stack,
        values: values,
      });
      message.error(
        `Error al registrar el estudiante: ${
          error.message || "Por favor intente nuevamente"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Encabezado con el nombre de la institución */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-800">Corporación Educativa Santa Sofía</h1>
        <p className="text-gray-600 mt-2">Registro de Estudiantes</p>
      </div>

      <Card
        title="Formulario de Registro"
        headStyle={{ backgroundColor: "#f0f5ff", fontWeight: "bold" }}
        bordered={false}
        style={{ marginBottom: 24 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          scrollToFirstError
        >
          {/* Información Personal */}
          <Card title="Información Personal" bordered={false}>
            <Form.Item
              name="nombre"
              label="Nombre"
              rules={[{ required: true, message: "El nombre es requerido" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Ingrese el nombre" />
            </Form.Item>
            <Form.Item
              name="apellido"
              label="Apellido"
              rules={[{ required: true, message: "El apellido es requerido" }]}
            >
              <Input placeholder="Ingrese el apellido" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Correo Electrónico"
              rules={[
                { required: true, message: "El correo es requerido" },
                { type: "email", message: "Ingrese un correo válido" },
              ]}
            >
              <Input placeholder="Ingrese el correo electrónico" />
            </Form.Item>
            <Form.Item
              name="fechaNacimiento"
              label="Fecha de Nacimiento"
              rules={[{ required: true, message: "La fecha de nacimiento es requerida" }]}
            >
              <DatePicker className="w-full" placeholder="Seleccione la fecha" />
            </Form.Item>
            <Form.Item
              name="eps"
              label="EPS"
             
            >
              <Input placeholder="Ingrese la EPS" />
            </Form.Item>
            <Form.Item
              name="rh"
              label="RH"
             
            >
              <Input placeholder="Ingrese el RH" />
            </Form.Item>
          </Card>

          {/* Documentación */}
          <Card title="Documentación" bordered={false}>
            <Form.Item
              name="tipoDocumento"
              label="Tipo de Documento"
              rules={[{ required: true, message: "El tipo de documento es requerido" }]}
            >
              <Select placeholder="Seleccione el tipo de documento">
                <Option value="CC">Cédula</Option>
                <Option value="TI">Tarjeta de Identidad</Option>
                <Option value="CE">Cédula Extranjería</Option>
                <Option value="PA">Pasaporte</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="numeroDocumento"
              label="Número de Documento"
              rules={[{ required: true, message: "El número de documento es requerido" }]}
            >
              <Input prefix={<IdcardOutlined />} placeholder="Ingrese el número de documento" />
            </Form.Item>
            <Form.Item
              name="lugarExpedicion"
              label="Lugar de Expedición"
              rules={[{ required: true, message: "El lugar de expedición es requerido" }]}
            >
              <Input placeholder="Ingrese el lugar de expedición" />
            </Form.Item>
          </Card>

          {/* Información de Contacto */}
          <Card title="Información de Contacto" bordered={false}>
            <Form.Item
              name="telefonoLlamadas"
              label="Teléfono para Llamadas"
              rules={[{ required: true, message: "El teléfono es requerido" }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Ingrese el teléfono" />
            </Form.Item>
            <Form.Item
              name="telefonoWhatsapp"
              label="Teléfono para WhatsApp"
              rules={[{ required: true, message: "El teléfono es requerido" }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Ingrese el teléfono" />
            </Form.Item>
          </Card>

          {/* Información Académica */}
          <Card title="Información Académica" bordered={false}>
            <Form.Item
              name="programa_id"
              label="Programa"
              rules={[{ required: true, message: "El programa es requerido" }]}
            >
              <Select placeholder="Seleccione el programa">
                {programas.map((programa) => (
                  <Option key={programa.id} value={programa.id}>
                    {programa.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="ultimoCursoAprobado"
              label="Último Curso Aprobado"
              rules={[{ required: true, message: "El curso es requerido" }]}
            >
              <Input placeholder="Ingrese el último curso aprobado" />
            </Form.Item>
            <Form.Item
              name="modalidad_estudio"
              label="Modalidad de estudio"
              rules={[{ required: true, message: "La modalidad es requerida" }]}
            >
              <Select placeholder="Seleccione la modalidad">
                <Option value="Clases en Linea">Clases en Línea</Option>
                <Option value="Modulos por WhastApp">Módulos por WhatsApp</Option>
              </Select>
            </Form.Item>
          </Card>

          {/* Información del Acudiente */}
          <Card title="Información del Acudiente" bordered={false}>
            <Form.Item name="nombreAcudiente" label="Nombre del Acudiente">
              <Input placeholder="Ingrese el nombre del acudiente" />
            </Form.Item>
            <Form.Item name="telefonoAcudiente" label="Teléfono del Acudiente">
              <Input prefix={<PhoneOutlined />} placeholder="Ingrese el teléfono" />
            </Form.Item>
            <Form.Item name="direccionAcudiente" label="Dirección del Acudiente">
              <Input placeholder="Ingrese la dirección" />
            </Form.Item>
          </Card>

          {/* Botón de Envío */}
          <Card bordered={false}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
            >
              Registrar Estudiante
            </Button>
          </Card>
        </Form>
      </Card>
    </div>
  );
};

export default StudentRegistrationForm;