import { useState } from "react";
import { login } from "../../services/axios";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      console.log(res);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-10 w-[400px] mx-auto p-10 border-1 border-gray-200 rounded"
      >
        <h1 className="text-2xl font-bold text-center">Iniciar sesión</h1>
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded text-gray-400 placeholder:font-light"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded text-gray-400 placeholder:font-light"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-fit mx-auto cursor-pointer">
          Ingresar
        </button>
      </form>
    </div>
  );
}