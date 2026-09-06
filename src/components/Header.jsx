import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0', padding: '15px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                {/* Logo / Nome da Aplicação */}
                <Link to="/" style={{ textDecoration: 'none', color: '#2e7d32', fontSize: '24px', fontWeight: 'bold' }}>
                    🥗 MyMenu
                </Link>

                {/* Links de Navegação Principal */}
                <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link to="/explorer" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>
                        Explorar
                    </Link>

                    {user && (
                        <>
                            <Link to="/my-recipes" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>
                                Minhas Receitas
                            </Link>
                            <Link to="/menu" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>
                                Cardápio Semanal
                            </Link>
                        </>
                    )}
                </nav>

                {/* Área do Usuário / Autenticação */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {user ? (
                        <>
                            <span style={{ fontSize: '14px', color: '#555' }}>
                                Olá, <Link to="/profile">
                                    <strong>{user.name || user.email}</strong>
                                </Link>
                                
                            </span>
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#f44336',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                }}
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#2e7d32',
                                color: '#fff',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                            }}
                        >
                            Entrar
                        </Link>
                    )}
                </div>

            </div>
        </header>
    );
}