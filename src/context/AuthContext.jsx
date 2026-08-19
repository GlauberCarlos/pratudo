import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('@my-menu:user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Helper para ler todos os usuários cadastrados no localStorage
  const DEFAULT_SUPER_ADMIN = {
    id: 1,
    name: 'Super Admin',
    email: 'admin@menu.com',
    password: 'admin', // Senha padrão para testes
    role: 'admin',
    status: 'active'
  };

  const getRegisteredUsers = () => {
    const saved = localStorage.getItem('@my-menu:registered_users');
    
    if (!saved) {
      // Se for a primeira vez, inicializa a "base" já com o Super Admin
      const initialUsers = [DEFAULT_SUPER_ADMIN];
      localStorage.setItem('@my-menu:registered_users', JSON.stringify(initialUsers));
      return initialUsers;
    }

    const users = JSON.parse(saved);

    // Garante que, mesmo que o localStorage já exista, sempre haja pelo menos um Admin no sistema
    const hasAdmin = users.some((u) => u.role === 'admin');
    if (!hasAdmin) {
      users.unshift(DEFAULT_SUPER_ADMIN);
      localStorage.setItem('@my-menu:registered_users', JSON.stringify(users));
    }

    return users;
  };

  // Helper para salvar no localStorage
  const saveRegisteredUsers = (usersList) => {
    localStorage.setItem('@my-menu:registered_users', JSON.stringify(usersList));
  };

  // 1. Cadastro com solicitação de Role
  const register = (name, email, password, requestAdmin = false) => {
    const users = getRegisteredUsers();

    const userExists = users.some((u) => u.email === email);
    if (userExists) {
      return { success: false, message: 'Este e-mail já está cadastrado!' };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: requestAdmin ? 'admin_pending' : 'user',
      status: 'active'
    };

    users.push(newUser);
    saveRegisteredUsers(users);

    return { success: true };
  };

  // 2. Login com verificação de Status Inativo
  const login = (email, password) => {
    const users = getRegisteredUsers();
    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (!foundUser) {
      return { success: false, message: 'E-mail ou senha incorretos!' };
    }

    if (foundUser.status === 'inactive') {
      return { 
        success: false, 
        message: 'Sua conta foi desativada pelo administrador.' 
      };
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('@my-menu:user', JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@my-menu:user');
  };

  // --- Funções Administrativas ---

  const approveAdmin = (userId) => {
    const users = getRegisteredUsers().map((u) => 
      u.id === userId ? { ...u, role: 'admin' } : u
    );
    saveRegisteredUsers(users);
  };

  const rejectAdmin = (userId) => {
    const users = getRegisteredUsers().map((u) => 
      u.id === userId ? { ...u, role: 'user' } : u
    );
    saveRegisteredUsers(users);
  };

  const toggleUserStatus = (userId) => {
    const users = getRegisteredUsers().map((u) => {
      if (u.id === userId) {
        const newStatus = u.status === 'active' ? 'inactive' : 'active';
        return { ...u, status: newStatus };
      }
      return u;
    });
    saveRegisteredUsers(users);
  };

  const deleteUser = (userId) => {
    const users = getRegisteredUsers().filter((u) => u.id !== userId);
    saveRegisteredUsers(users);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoggedIn: !!user, 
        isAdmin: user?.role === 'admin',
        login, 
        register, 
        logout,
        getRegisteredUsers,
        approveAdmin,
        rejectAdmin,
        toggleUserStatus,
        deleteUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}