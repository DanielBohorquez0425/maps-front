import axios from "axios";

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || "https://maps-backend-fv42.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error en interceptor de petición:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Error en respuesta:", error.response?.status, error.message);

    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Register
export const register = async (name, lastName, email, password) => {
  try {
    console.log("📝 Intentando registro para:", email);
    const response = await api.post("/auth/register", {
      name,
      last_name: lastName,
      email,
      password,
    });
    console.log("✅ Registro exitoso");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error en registro:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Login
export const login = async (email, password) => {
  try {
    console.log("🔐 Intentando login para:", email);
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    console.log("✅ Login exitoso");
    return response.data;
  } catch (error) {
    console.error("❌ Error en login:", error.response?.data || error.message);
    throw error;
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// Current User
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/verify");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error obteniendo usuario:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default api;
