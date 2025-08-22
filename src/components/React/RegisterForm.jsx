import { useState } from "react";
import { register } from "../../services/axios";
import { Toast, Toaster, createToaster } from "@ark-ui/react/toast";

const toaster = createToaster({
  placement: "bottom-end",
  overlap: true,
  gap: 24,
});

export default function Register() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(name, lastName, email, password);
      console.log(res);
      toaster.create({
        title: "¡Registro exitoso!",
        description: "Ahora puedes iniciar sesión",
        type: "success",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.error("Error al registrar usuario", err);
      toaster.create({
        title: "Error de registro",
        description: "Verifique sus credenciales",
        type: "error",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-10 w-[400px] mx-auto p-10 border-1 border-gray-200 rounded"
      >
        <h1 className="text-2xl font-bold text-center">Registrarse</h1>
        <div className="flex flex-col gap-4">
          <input
            type="name"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-200 p-2 rounded text-gray-400 placeholder:font-light"
          />
          <input
            type="lastName"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border border-gray-200 p-2 rounded text-gray-400 placeholder:font-light"
          />
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-200 p-2 rounded text-gray-400 placeholder:font-light"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-200 p-2 rounded text-gray-400 placeholder:font-light"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-fit mx-auto cursor-pointer">
          Registrar
        </button>
      </form>
      {/* Toaster component */}
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root
            key={toast.id}
            className="w-[300px] rounded-lg shadow-xl p-4"
          >
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.description}</Toast.Description>
          </Toast.Root>
        )}
      </Toaster>
    </div>
  );
}
