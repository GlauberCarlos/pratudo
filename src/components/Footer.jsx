import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#222', color: '#ccc', padding: '30px 20px', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        
        <div>
          <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>🥗 MyMenu</h4>
          <p style={{ margin: 0, fontSize: '13px' }}>Seu planejador de receitas e cardápio semanal.</p>
        </div>

        <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
          <Link to="/explorer" style={{ color: '#ccc', textDecoration: 'none' }}>Explorar</Link>
          <Link to="/about" style={{ color: '#ccc', textDecoration: 'none' }}>Sobre</Link>
        </div>

        <div style={{ fontSize: '12px', color: '#888' }}>
          © {new Date().getFullYear()} MyMenu. Todos os direitos reservados.
        </div>

      </div>
    </footer>
  );
}