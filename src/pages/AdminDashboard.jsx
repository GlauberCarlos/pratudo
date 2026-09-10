import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

import '../styles/AdminDashboard.css';
import '../styles/index.css';

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
    <div className="admin-container">
      <h2 className="admin-title">Painel do Administrador</h2>

      {/* Cartões de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card stat-card-total">
          <h4 className="stat-card-title">Total de Usuários</h4>
          <p className="stat-card-number">{usersList.length}</p>
        </div>
        <div className="stat-card stat-card-active">
          <h4 className="stat-card-title">Usuários Ativos</h4>
          <p className="stat-card-number">{activeUsers.length}</p>
        </div>
        <div className="stat-card stat-card-pending">
          <h4 className="stat-card-title">Solicitações Admin</h4>
          <p className="stat-card-number">{pendingAdmins.length}</p>
        </div>
      </div>

      {/* Fila de Solicitações de Admin */}
      <section className="admin-section">
        <h3 className="admin-section-title">Solicitações de Administrador Pendentes</h3>
        {pendingAdmins.length === 0 ? (
          <p className="empty-state-text">Nenhuma solicitação pendente no momento.</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pendingAdmins.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <div className="actions-cell">
                        <button 
                          onClick={() => handleApprove(u.id)} 
                          className="btn-action btn-action-approve"
                        >
                          Aprovar
                        </button>
                        <button 
                          onClick={() => handleReject(u.id)} 
                          className="btn-action btn-action-reject"
                        >
                          Rejeitar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Lista Geral de Usuários */}
      <section className="admin-section">
        <h3 className="admin-section-title">Gerenciamento de Usuários</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Cargo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${
                      u.role === 'admin' ? 'badge-role-admin' :
                      u.role === 'admin_pending' ? 'badge-role-pending' : 'badge-role-user'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-status-active' : 'badge-status-inactive'}`}>
                      {u.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        onClick={() => handleToggleStatus(u.id)} 
                        className="btn-action btn-action-toggle"
                      >
                        {u.status === 'active' ? 'Desativar' : 'Ativar'}
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)} 
                        className="btn-action btn-action-delete"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}