import { useState } from "react";
import { IconEmail, IconPassword} from "../../assets/icons/icons";
import { login } from "../../services/axios";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      console.log(res);
      window.location.href = "/home";
    } catch (err) {
      console.error("Login error:", err);
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
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-separator text-center">
          <p className="text-[#9A9AA5]">
            ¿No tienes cuenta?{' '}
            <a
              href="/register"
              className="text-[#4C6FFF] cursor-pointer hover:text-link-hover font-medium transition-colors duration-200"
            >
              Crear cuenta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}