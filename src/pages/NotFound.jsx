import { Link } from 'react-router-dom';
import logoSvg from '../assets/praTudo.svg';

import '../styles/NotFound.css';
import '../styles/index.css';

export default function NotFound() {
    return (
        <div className="notfound-container">
            <div className="notfound-illustration">
                <img
                    src={logoSvg}
                    alt="Logotipo Pra Tudo"
                    className="home-hero-logo"
                />
            </div>
            <h1 className="notfound-code">404</h1>
            <h2 className="notfound-title">Ops! Receita não encontrada</h2>
            <p className="notfound-description">
                Parece que a página ou receita que você está procurando não existe, mudou de endereço ou foi removida do nosso livro de receitas.
            </p>

            <div className="notfound-actions">
                <Link to="/" className="btn-notfound-primary">
                    🏠 Voltar para o Início
                </Link>
                <Link to="/explorer" className="btn-notfound-secondary">
                    🔍 Explorar Receitas
                </Link>
            </div>
        </div>
    );
}