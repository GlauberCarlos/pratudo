import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import '../styles/Profile.css';
import '../styles/index.css';

export default function Profile() {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const editProfile = () => {
    navigate('/edit-profile');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Tem certeza de que deseja excluir sua conta? Esta ação é irreversível e apagará todas as suas receitas.'
    );

    if (confirmed) {
      const result = await deleteAccount();
      if (result.success) {
        alert('Sua conta foi excluída com sucesso.');
        navigate('/login');
      } else {
        setErrorMsg(result.message);
      }
    }
  };

  // Primeira letra do nome para o Avatar
  const initialLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="profile-container">
      {/* Cabeçalho do Perfil */}
      <div className="profile-header">
        <div className="profile-avatar">{initialLetter}</div>
        <div className="profile-title-box">
          <h2>Meu Perfil</h2>
          <span className="profile-role-badge">
            {user?.isAdmin ? 'Administrador' : 'Membro'}
          </span>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="profile-info-group">
        <div className="profile-info-item">
          <span className="profile-info-label">Nome:</span>
          <span className="profile-info-value">{user?.name || 'Não informado'}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-label">Apelido:</span>
          <span className="profile-info-value">{user?.lastName || 'Não informado'}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-label">E-mail:</span>
          <span className="profile-info-value">{user?.email || 'Não informado'}</span>
        </div>
      </div>

      {/* Botões de Edição (Futuras Funcionalidades) */}
      <div className="profile-actions-section">
        <button
          className="btn-profile-action"
          onClick={() => editProfile()}
        >
          ✏️ Editar Informações Pessoais
        </button>
      </div>

      {/* Ações da Conta / Sair */}
      <div className="profile-danger-zone">
        <button onClick={handleLogout} className="btn-profile-logout">
          Sair da Conta
        </button>
        <button onClick={handleDeleteAccount} className="btn-profile-delete">
          Excluir conta
        </button>
      </div>
    </div>
  );
}