import { useState } from "react";
import { register } from "../../services/axios";
import { Toast, Toaster, createToaster } from "@ark-ui/react/toast";
import { IconEmail, IconPassword, IconName } from "../../assets/icons/icons";

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateName = (name) => {
    if (!name.trim()) {
      return "El nombre es requerido";
    }
    if (name.trim().length < 2) {
      return "El nombre debe tener al menos 2 caracteres";
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
      return "El nombre solo puede contener letras";
    }
    return "";
  };

  const validateLastName = (lastName) => {
    if (!lastName.trim()) {
      return "El apellido es requerido";
    }
    if (lastName.trim().length < 2) {
      return "El apellido debe tener al menos 2 caracteres";
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastName)) {
      return "El apellido solo puede contener letras";
    }
    return "";
  };

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
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "La contraseña debe contener al menos una letra minúscula";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "La contraseña debe contener al menos un número";
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return "Confirma tu contraseña";
    }
    if (confirmPassword !== password) {
      return "Las contraseñas no coinciden";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nameError = validateName(name);
    const lastNameError = validateLastName(lastName);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);

    if (nameError) newErrors.name = nameError;
    if (lastNameError) newErrors.lastName = lastNameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (fieldName, value) => {
    let error = "";
    
    switch (fieldName) {
      case "name":
        error = validateName(value);
        break;
      case "lastName":
        error = validateLastName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        if (confirmPassword) {
          const confirmError = validateConfirmPassword(confirmPassword, value);
          setErrors(prev => ({
            ...prev,
            confirmPassword: confirmError
          }));
        }
        break;
      case "confirmPassword":
        error = validateConfirmPassword(value, password);
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error
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

    setIsLoading(true);

    try {
      const res = await register(name.trim(), lastName.trim(), email.trim(), password);
      console.log(res);
      
      toaster.create({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente",
        type: "success",
      });
      
      setName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});

      setTimeout(() => {
      window.location.href = "/login";
      }, 1500);
    } catch (err) {
      console.error("Error al registrar usuario", err);
      
      let errorMessage = "Error al crear la cuenta";
      
      if (err.response?.data?.message) {
        switch (err.response.data.message) {
          case "El usuario ya existe":
            errorMessage = "Ya existe una cuenta con este email";
            break;
          case "Error en el servidor":
            errorMessage = "Error del servidor. Inténtalo más tarde";
            break;
          default:
            errorMessage = err.response.data.message;
        }
      }

      toaster.create({
        title: "Error de registro",
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
                onChange={(e) => {
                  setName(e.target.value);
                  validateField("name", e.target.value);
                }}
                className={`w-full pl-12 pr-4 py-3 bg-[#292935] border rounded-lg focus:ring-2 focus:ring-focus focus:border-primary outline-none transition-all duration-200 text-[#9A9AA5] placeholder:text-[#9A9AA5] ${
                  errors.name 
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                    : "border-[#585870]"
                }`}
                placeholder="Tu nombre"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
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
                onChange={(e) => {
                  setLastName(e.target.value);
                  validateField("lastName", e.target.value);
                }}
                className={`w-full pl-12 pr-4 py-3 bg-[#292935] border rounded-lg focus:ring-2 focus:ring-focus focus:border-primary outline-none transition-all duration-200 text-[#9A9AA5] placeholder:text-[#9A9AA5] ${
                  errors.lastName 
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                    : "border-[#585870]"
                }`}
                placeholder="Tu apellido"
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5">
                <IconPassword />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateField("confirmPassword", e.target.value);
                }}
                className={`w-full pl-12 pr-12 py-3 bg-[#292935] border rounded-lg focus:ring-2 focus:ring-focus focus:border-primary outline-none transition-all duration-200 text-[#9A9AA5] placeholder:text-[#9A9AA5] ${
                  errors.confirmPassword 
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                    : "border-[#585870]"
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
            {confirmPassword && !errors.confirmPassword && password && (
              <p className="mt-1 text-sm text-green-500">✓ Las contraseñas coinciden</p>
            )}
            {password && !errors.password && (
              <div className="mt-1 text-sm text-green-500">
                ✓ Contraseña válida
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 cursor-pointer bg-[#4C6FFF] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? "Creando cuenta..." : "Registrarse"}
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