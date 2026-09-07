import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

import '../styles/Auth.css';
import '../styles/index.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      navigate('/profile');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Fazer login</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label className="auth-label">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@email.com"
            required
            className="auth-input"
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
        </div>

        <button type="submit" className="btn-auth-submit">
          Entrar
        </button>
      </form>

      <p className="auth-footer">
        Ainda não tem conta? <Link to="/register" className="auth-link">Cadastre-se</Link>
      </p>
    </div>
  );
}