import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

import api from '../services/api';

import '../styles/AdminDashboard.css';
import '../styles/index.css';

export default function AdminDashboard() {
  const { user: currentUser } = useContext(AuthContext);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca lista de usuários
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsersList(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao carregar lista de usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/approve-admin`, { role: 'admin' });
      loadUsers();
    } catch (error) {
      alert('Erro ao aprovar usuário.');
    }
  };

  const handleReject = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/approve-admin`, { role: 'user' });
      loadUsers();
    } catch (error) {
      alert('Erro ao rejeitar solicitação.');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-status`);
      loadUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao alterar status do usuário.');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Tem certeza que deseja excluir permanentemente este usuário?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        loadUsers();
      } catch (error) {
        alert('Erro ao excluir usuário.');
      }
    }
  };

  const pendingAdmins = usersList.filter((u) => u.role === 'admin_pending');
  const activeUsers = usersList.filter((u) => u.status === 'active');

  if (loading) {
    return <div className="admin-container"><p>Carregando painel...</p></div>;
  }

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
                  <tr key={u._id}>
                    <td>{u.name} {u.lastName}</td>
                    <td>{u.email}</td>
                    <td>
                      <div className="actions-cell">
                        <button
                          onClick={() => handleApprove(u._id)}
                          className="btn-action btn-action-approve"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => handleReject(u._id)}
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
              {usersList.map((u) => {
                const isSelf = String(currentUser?._id || currentUser?.id) === String(u._id);

                return (
                  <tr key={u._id}>
                    <td>{u.name} {u.lastName}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.status}</td>
                    <td>
                      <div className="actions-cell">
                        {/* Se for o próprio admin, esconde ou desativa o botão de editar */}
                        {!isSelf ? (
                          <Link
                            to={`/admin/users/edit/${u._id}`}
                            className="btn-action btn-action-edit"
                          >
                            Editar
                          </Link>
                        ) : (
                          <span
                            className="btn-action btn-action-disabled"
                            title="Para editar o seu próprio perfil, aceda à página de Perfil"
                            style={{ opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' }}
                          >
                            Editar
                          </span>
                        )}

                        <button
                          onClick={() => handleToggleStatus(u._id)}
                          className="btn-action btn-action-toggle"
                          disabled={isSelf} // Também previne que desative a sua própria conta
                        >
                          {u.status === 'active' ? 'Desativar' : 'Ativar'}
                        </button>

                        <button
                          onClick={() => handleDelete(u._id)}
                          className="btn-action btn-action-delete"
                          disabled={isSelf} // Previne que exclua a sua própria conta
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}