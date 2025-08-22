import axios from "axios";

const API_URL = "http://localhost:4000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const register = async (email, password, name, last_name) => {
  const res = await api.post("/auth/register", { email, password, name, last_name });
  return res.data;
};

export default api;
