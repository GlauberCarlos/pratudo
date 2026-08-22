import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function GuestRoute({ children }) {
  const { isLoggedIn } = useAuth();

  // Se o usuário já estiver logado, redireciona para a Home (ou outra página padrão)
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}