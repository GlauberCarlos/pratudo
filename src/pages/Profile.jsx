import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

import '../styles/Profile.css';
import '../styles/index.css';

export default function Profile() {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const data = new Date(user?.birthDate);
  const dia = String(data.getUTCDate()).padStart(2, '0');
  const mes = String(data.getUTCMonth() + 1).padStart(2, '0'); 
  const ano = data.getUTCFullYear();
  const bDate = `${dia}/${mes}/${ano}`;

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
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="profile-info-group">
        <div className="profile-info-item">
          <span className="profile-info-label">Nome:</span>
          <span className="profile-info-value">{user?.name}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-label">Apelido:</span>
          <span className="profile-info-value">{user?.lastName}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-label">E-mail:</span>
          <span className="profile-info-value">{user?.email}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-info-label">Data de Nascimento:</span>
          <span className="profile-info-value">{bDate}</span>
        </div>
      </div>

      {/* Botões de Edição (Futuras Funcionalidades) */}
      <div className="profile-actions-section">
        <Link to="/my-comments" className="btn-profile-comment">
          💬 Meus Comentários
        </Link>
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