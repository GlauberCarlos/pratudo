import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logoSvg from '../assets/praTudo.svg';

import '../styles/home.css';
import '../styles/index.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      {/* Banner de Boas-vindas para Usuário Logado */}
      {user && (
        <div className="user-welcome-card">
          <div className="user-welcome-text">
            <h3>Olá, {user.name || 'Cozinheiro(a)'}! 👋</h3>
            <p>O que vamos preparar ou compartilhar hoje?</p>
          </div>
          <Link to="/recipe/new" className="btn-primary-home">
            + Nova Receita
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-badge">Culinária & Saúde</span>
          <h1 className="home-title">
            Sua cozinha, suas regras, <br />
            <span className="home-title-highlight">sem complicações.</span>
          </h1>
          <p className="home-subtitle">
            Organize seu livro de receitas pessoal, filtre por restrições alimentares 
            e compartilhe suas melhores criações com a comunidade.
          </p>

          {/* Botões Dinâmicos (Logado vs Visitante) */}
          <div className="home-actions">
            {user ? (
              <>
                <Link to="/explorer" className="btn-primary-home">
                  🔍 Explorar Receitas
                </Link>
                <Link to="/my-recipes" className="btn-secondary-home">
                  📖 Minhas Receitas
                </Link>
              </>
            ) : (
              <>
                <Link to="/explorer" className="btn-primary-home">
                  🔍 Explorar Receitas
                </Link>
                <Link to="/login" className="btn-secondary-home">
                  Entrar
                </Link>
                <Link to="/register" className="btn-outline-home">
                  Criar Conta
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Logotipo posicionado à direita */}
        <img 
          src={logoSvg} 
          alt="Logotipo Pra Tudo" 
          className="home-hero-logo" 
        />
      </section>

      {/* Recursos / Funcionalidades */}
      <section>
        <h2 className="home-section-title">O que você pode fazer por aqui?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🥗</div>
            <h3 className="feature-card-title">Filtros Inteligentes</h3>
            <p className="feature-card-desc">
              Encontre facilmente opções vegetarianas, veganas, sem glúten ou sem lactose.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3 className="feature-card-title">Caderno Digital</h3>
            <p className="feature-card-desc">
              Guarde suas receitas favoritas e mantenha seu próprio acervo sempre organizado.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-card-title">Comunidade</h3>
            <p className="feature-card-desc">
              Torne suas receitas públicas para inspirar outras pessoas e deixe seus comentários.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3 className="feature-card-title">Preparo Rápido</h3>
            <p className="feature-card-desc">
              Visualize ingredientes, porções e tempo de preparo de forma clara e objetiva.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}