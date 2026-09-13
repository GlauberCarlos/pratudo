import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaura a sessão ao recarregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem('@Pratudo:user');
    const storedToken = localStorage.getItem('@Pratudo:token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

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

  const register = async (name, lastName, email, password, requestAdmin) => {
    try {
      await api.post('/auth/register', {
        name,
        lastName,
        email,
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

      // Atualiza o localStorage e o estado com os dados novos
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
      logout(); // Limpa token e dados do usuário do estado/storage
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
        deleteAccount
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}