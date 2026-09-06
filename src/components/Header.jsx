import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logoSvg from '../assets/praTudo.svg';
import '../styles/Header.css';

export default function Header() {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
    <header className="header">
      <div className="header-container">
        
        {/* LOGO (Com efeito "vazado") */}
        <div className="header-logo-wrapper">
          <Link to="/">
            <img src={logoSvg} alt="PraTudo Logo" className="header-logo" />
          </Link>
        </div>

        {/* NAVEGAÇÃO CENTRAL */}
        <nav className="header-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Página Inicial
          </NavLink>

          <NavLink to="/explorer" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Explorar
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink to="/menu" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Cardápio Semanal
              </NavLink>
              <NavLink to="/my-recipes" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Minhas Receitas
              </NavLink>
            </>
          )}

          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Painel Admin
            </NavLink>
          )}
        </nav>

        {/* ÁREA DO USUÁRIO (DIREITA) */}
        <div className="header-user">
          {isLoggedIn ? (
            <>
              <span className="user-greeting">
                Olá,{' '}
                <Link to="/profile" className="user-profile-link">
                  {user?.name || user?.email}
                </Link>
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Sair
              </button>
            </>
          ) : (
            <div className="auth-links">
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Entrar
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Cadastrar
              </NavLink>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}