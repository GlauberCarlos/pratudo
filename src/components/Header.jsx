import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logoSvg from '../assets/praTudo.svg';
import '../styles/Header.css';

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo-wrapper">
          <Link to="/" onClick={closeMenu}>
            <img src={logoSvg} alt="PraTudo Logo" className="header-logo" />
          </Link>
        </div>

        <button
          className={`hamburger-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Abrir menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {isMenuOpen && <div className="menu-backdrop" onClick={closeMenu} />}

        <div className={`header-menu-wrapper ${isMenuOpen ? 'active' : ''}`}>
          <nav className="header-nav">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMenu}
            >
              Início
            </NavLink>

            <NavLink
              to="/explorer"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMenu}
            >
              Explorar
            </NavLink>

            {isLoggedIn && (
              <>
                <NavLink
                  to="/menu"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  onClick={closeMenu}
                >
                  Cardápio Semanal
                </NavLink>
                <NavLink
                  to="/my-recipes"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  onClick={closeMenu}
                >
                  Minhas Receitas
                </NavLink>
              </>
            )}

            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={closeMenu}
              >
                Painel Administrativo
              </NavLink>
            )}
          </nav>

          <div className="header-user">
            {isLoggedIn ? (
              <>
                <span className="user-greeting">
                  Olá,{' '}
                  <Link to="/profile" className="user-profile-link" onClick={closeMenu}>
                    {user?.name || user?.email}
                  </Link>
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  Sair
                </button>
              </>
            ) : (
              <div className="auth-links">
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  onClick={closeMenu}
                >
                  Entrar
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  onClick={closeMenu}
                >
                  Cadastrar
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}