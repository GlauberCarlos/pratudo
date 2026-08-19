import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  //fazer apagar conta
  //editar perfil

  return (
    <div>
      <h2>Meu Perfil</h2>
      <p><strong>Nome:</strong> {user?.name}</p>
      <p><strong>E-mail:</strong> {user?.email}</p>
      <button onClick={handleLogout}>Sair da Conta</button>
    </div>
  );
}