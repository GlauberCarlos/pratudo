import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import '../styles/Profile.css';
import '../styles/index.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePlaceholderAction = (actionName) => {
    alert(`Ação "${actionName}" em desenvolvimento.`);
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
          <span className="profile-info-label">E-mail:</span>
          <span className="profile-info-value">{user?.email || 'Não informado'}</span>
        </div>
      </div>

      {/* Botões de Edição (Futuras Funcionalidades) */}
      <div className="profile-actions-section">
        <button 
          className="btn-profile-action"
          onClick={() => handlePlaceholderAction('Editar Dados')}
        >
          ✏️ Editar Informações Pessoais
        </button>
        <button 
          className="btn-profile-action"
          onClick={() => handlePlaceholderAction('Alterar Senha')}
        >
          🔒 Alterar Senha
        </button>
      </div>

      {/* Ações da Conta / Sair */}
      <div className="profile-danger-zone">
        <button onClick={handleLogout} className="btn-profile-logout">
          Sair da Conta
        </button>
        <button 
          onClick={() => handlePlaceholderAction('Apagar Conta')}
          className="btn-profile-delete"
        >
          Excluir minha conta
        </button>
      </div>
    </div>
  );
}