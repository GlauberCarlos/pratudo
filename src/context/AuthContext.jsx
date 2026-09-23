import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('@Pratudo:user');
    const storedToken = localStorage.getItem('@Pratudo:token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;

    const SESSION_TIMEOUT = 60 * 60 * 1000; 

    const timer = setTimeout(() => {
      alert('Sua sessão expirou por tempo de utilização. Por favor, faça login novamente.');
      logout();
    }, SESSION_TIMEOUT);

    return () => clearTimeout(timer);
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('@Pratudo:token', token);
      localStorage.setItem('@Pratudo:user', JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao realizar login.',
      };
    }
  };

  const register = async (name, lastName, email, birthdate, password, requestAdmin) => {
    try {
      await api.post('/auth/register', {
        name,
        lastName,
        email,
        birthdate,
        password,
        role: requestAdmin ? 'admin_pending' : 'user',
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao cadastrar usuário.',
      };
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      const updatedUser = response.data;

      localStorage.setItem('@Pratudo:user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar perfil.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('@Pratudo:token');
    localStorage.removeItem('@Pratudo:user');
    setUser(null);
  };

  const deleteAccount = async () => {
    try {
      await api.delete('/auth/profile');
      logout();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao excluir conta.',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        updateProfile,
        logout,
        deleteAccount,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}