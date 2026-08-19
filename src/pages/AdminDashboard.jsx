import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AdminDashboard() {
  const { 
    getRegisteredUsers, 
    approveAdmin, 
    rejectAdmin, 
    toggleUserStatus, 
    deleteUser 
  } = useAuth();

  const [usersList, setUsersList] = useState([]);

  // Atualiza a lista exibida na tela
  const loadUsers = () => {
    setUsersList(getRegisteredUsers());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleApprove = (id) => {
    approveAdmin(id);
    loadUsers();
  };

  const handleReject = (id) => {
    rejectAdmin(id);
    loadUsers();
  };

  const handleToggleStatus = (id) => {
    toggleUserStatus(id);
    loadUsers();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir permanentemente este usuário?')) {
      deleteUser(id);
      loadUsers();
    }
  };

  // Separação por categorias
  const pendingAdmins = usersList.filter((u) => u.role === 'admin_pending');
  const activeUsers = usersList.filter((u) => u.status === 'active');

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2>Painel do Administrador</h2>

      {/* Cartões de Estatísticas */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', marginTop: '20px' }}>
        <div style={{ flex: 1, padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h4>Total de Usuários</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>{usersList.length}</p>
        </div>
        <div style={{ flex: 1, padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#e8f5e9' }}>
          <h4>Usuários Ativos</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>{activeUsers.length}</p>
        </div>
        <div style={{ flex: 1, padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff3e0' }}>
          <h4>Solicitações Admin</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>{pendingAdmins.length}</p>
        </div>
      </div>

      {/* Fila de Solicitações de Admin */}
      <section style={{ marginBottom: '40px' }}>
        <h3>Solicitações de Administrador Pendentes</h3>
        {pendingAdmins.length === 0 ? (
          <p style={{ color: '#666' }}>Nenhuma solicitação pendente no momento.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Nome</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>E-mail</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pendingAdmins.map((u) => (
                <tr key={u.id}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{u.name}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{u.email}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleApprove(u.id)} style={{ backgroundColor: '#4CAF50', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                      Aprovar
                    </button>
                    <button onClick={() => handleReject(u.id)} style={{ backgroundColor: '#ff9800', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                      Rejeitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Lista Geral de Usuários */}
      <section>
        <h3>Gerenciamento de Usuários</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Nome</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>E-mail</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Cargo</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{u.name}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{u.email}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}><strong>{u.role}</strong></td>
                <td style={{ padding: '8px', border: '1px solid #ddd', color: u.status === 'active' ? 'green' : 'red' }}>
                  {u.status === 'active' ? 'Ativo' : 'Inativo'}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd', display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleToggleStatus(u.id)} style={{ cursor: 'pointer' }}>
                    {u.status === 'active' ? 'Desativar' : 'Ativar'}
                  </button>
                  <button onClick={() => handleDelete(u.id)} style={{ backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}