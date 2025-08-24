import { useState, useEffect } from "react";
import { getCurrentUser, logout } from "../services/axios";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const userData = await getCurrentUser();
      setUser(userData.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    logout();
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    logout: handleLogout,
    refreshAuth: checkAuth,
  };
};

export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  return { isAuthenticated, isLoading };
};
