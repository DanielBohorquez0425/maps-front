import { useState } from "react";
import { register } from "../../services/axios";
import { Toast, Toaster, createToaster } from "@ark-ui/react/toast";
import { IconEmail, IconPassword, IconName } from "../../assets/icons/icons"; // Supongamos que existen estos iconos

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
    <div className="w-full max-w-md mx-auto h-screen flex items-center justify-center">
      <div className="bg-[#161720] p-8 rounded-2xl border border-[#3A3A46] shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Registrarse</h1>
          <p className="text-[#9A9AA5]">Crea una nueva cuenta</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 w-[350px]">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Nombre
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5">
                <IconName />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-[#292935] border border-[#585870] rounded-lg focus:ring-2 focus:ring-focus focus:border-primary outline-none transition-all duration-200 text-[#9A9AA5] placeholder:text-[#9A9AA5]"
                placeholder="Tu nombre"
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
              Apellido
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5">
                <IconName />
              </div>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-[#292935] border border-[#585870] rounded-lg focus:ring-2 focus:ring-focus focus:border-primary outline-none transition-all duration-200 text-[#9A9AA5] placeholder:text-[#9A9AA5]"
                placeholder="Tu apellido"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5">
                <IconEmail />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-[#292935] border border-[#585870] rounded-lg focus:ring-2 focus:ring-focus focus:border-primary outline-none transition-all duration-200 text-[#9A9AA5] placeholder:text-[#9A9AA5]"
                placeholder="tu@email.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5">
                <IconPassword />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3 bg-[#292935] border border-[#585870] rounded-lg focus:ring-2 focus:ring-focus focus:border-primary outline-none transition-all duration-200 text-[#9A9AA5] placeholder:text-[#9A9AA5]"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 cursor-pointer bg-[#4C6FFF] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Registrarse
          </button>
        </form>
        <div className="mt-8 pt-6 border-t border-separator text-center">
          <p className="text-[#9A9AA5]">
            ¿Ya tienes una cuenta?{' '}
            <a
              href="/login"
              className="text-[#4C6FFF] cursor-pointer hover:text-link-hover font-medium transition-colors duration-200"
            >
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root
            key={toast.id}
            className="w-[300px] rounded-lg shadow-xl p-4 bg-[#161720] border border-[#3A3A46]"
          >
            <Toast.Title className="text-white">{toast.title}</Toast.Title>
            <Toast.Description className="text-[#9A9AA5]">{toast.description}</Toast.Description>
          </Toast.Root>
        )}
      </Toaster>
    </div>
  );
}
