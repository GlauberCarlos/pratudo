import { Link } from 'react-router-dom';
import logoSvg from '../assets/praTudo.svg';
import '../styles/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* LOGO + NOME DA MARCA */}
        <div className="footer-brand">
          <Link to="/" className="footer-brand-link">
            <img src={logoSvg} alt="PraTudo" className="footer-logo" />
            <span className="footer-brand-title">PraTudo</span>
          </Link>
          <span className="footer-tagline">Seu planejador de receitas e cardápio semanal.</span>
        </div>

        {/* LINKS RÁPIDOS */}
        <nav className="footer-nav">
          <Link to="/" className="footer-link">Página Inicial</Link>
          <Link to="/menu" className="footer-link">Cardápio Semanal</Link>
        </nav>

        {/* DIREITOS AUTORAIS */}
        <div className="footer-copyright">
          © {currentYear} PraTudo. Todos os direitos reservados.
        </div>

      </div>
    </footer>
  );
}