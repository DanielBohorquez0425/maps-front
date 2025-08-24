import { useState } from "react";
import { IconEmail, IconPassword } from "../../assets/icons/icons";
import { login } from "../../services/axios";
import { Toast, Toaster, createToaster } from "@ark-ui/react/toast";

const toaster = createToaster({
  placement: "bottom-end",
  overlap: true,
  gap: 24,
});

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "El email es requerido";
    }
    if (!emailRegex.test(email)) {
      return "Ingresa un email válido";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "La contraseña es requerida";
    }
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toaster.create({
        title: "Datos inválidos",
        description: "Por favor corrige los errores en el formulario",
        type: "error",
      });
      return;
    }

    const TEST_USER = {
      email: "admin@test.com",
      password: "654321",
    };

    if (email === TEST_USER.email && password === TEST_USER.password) {
      localStorage.setItem("token", "MOCK_TOKEN");
      toaster.create({
        title: "¡Bienvenido!",
        description: "Has ingresado con el usuario de prueba",
        type: "success",
      });
      setTimeout(() => {
        window.location.href = "/home";
      }, 1500);
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email, password);
      console.log(res);

      toaster.create({
        title: "¡Bienvenido!",
        description: "Inicio de sesión exitoso",
        type: "success",
      });

      setTimeout(() => {
        window.location.href = "/home";
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);

      let errorMessage = "Error al iniciar sesión";

      if (err.response?.data?.message) {
        switch (err.response.data.message) {
          case "Usuario no encontrado":
            errorMessage = "No existe una cuenta con este email";
            break;
          case "Credenciales incorrectas":
            errorMessage = "Email o contraseña incorrectos";
            break;
          case "Error en el servidor":
            errorMessage = "Error del servidor. Inténtalo más tarde";
            break;
          default:
            errorMessage = err.response.data.message;
        }
      }

      toaster.create({
        title: "Error de inicio de sesión",
        description: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto h-screen flex items-center justify-center">
      <div className="bg-[#161720] p-8 rounded-2xl border border-[#3A3A46] shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
          <p className="text-[#9A9AA5]">Accede a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 w-[350px]">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-2"
            >
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateField("email", e.target.value);
                }}
                className={`w-full pl-12 pr-4 py-3 bg-[#292935] border rounded-lg focus:ring-2 focus:ring-focus focus:border-primary outline-none transition-all duration-200 text-[#9A9AA5] placeholder:text-[#9A9AA5] ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[#585870]"
                }`}
                placeholder="tu@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-2"
            >
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateField("password", e.target.value);
                }}
                className={`w-full pl-12 pr-12 py-3 bg-[#292935] border rounded-lg focus:ring-2 focus:ring-focus focus:border-primary outline-none transition-all duration-200 text-[#9A9AA5] placeholder:text-[#9A9AA5] ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[#585870]"
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 cursor-pointer bg-[#4C6FFF] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#3A3A46] text-center">
          <p className="text-[#9A9AA5]">
            ¿No tienes cuenta?{" "}
            <a
              href="/register"
              className="text-[#4C6FFF] cursor-pointer hover:text-link-hover font-medium transition-colors duration-200"
            >
              Crear cuenta
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
            <Toast.Description className="text-[#9A9AA5]">
              {toast.description}
            </Toast.Description>
          </Toast.Root>
        )}
      </Toaster>
    </div>
  );
}
