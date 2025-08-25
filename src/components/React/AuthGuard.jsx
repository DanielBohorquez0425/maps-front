import { useState, useEffect } from 'react';
import RedirectToLogin from './RedirectToLogin';

const AuthGuard = ({ children, fallback }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const API_BASE_URL = 
        import.meta.env.PUBLIC_API_BASE_URL ||
        process.env.PUBLIC_API_BASE_URL ||
        'http://localhost:4000';

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setError(null);
      } else {
        const errorData = await response.json().catch(() => null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setError(`Error ${response.status}: ${errorData?.message || 'Token inválido'}`);
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('No se puede conectar al servidor. Verifica que esté ejecutándose.');
      } else {
        setError(`Error de conexión: ${error.message}`);
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4C6FFF] mx-auto mb-4"></div>
          <p className="text-[#9A9AA5]">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback === 'login') {
      return <RedirectToLogin />;
    } else if (fallback) {
      return fallback;
    } else {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F0F1A]">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Acceso Denegado</h2>
            <p className="text-[#9A9AA5] mb-4">Necesitas iniciar sesión para acceder a esta página</p>

            {error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4">
                <p className="text-red-400 text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <a
                href="/login"
                className="inline-block px-6 py-3 bg-[#4C6FFF] text-white rounded-lg hover:bg-[#3A5AFF] transition-colors"
              >
                Ir al Login
              </a>

              <button
                onClick={checkAuthentication}
                className="block w-full px-6 py-2 border border-[#4C6FFF] text-[#4C6FFF] rounded-lg hover:bg-[#4C6FFF] hover:text-white transition-colors"
              >
                Reintentar Verificación
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default AuthGuard;