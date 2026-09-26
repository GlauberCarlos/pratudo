import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import { toast } from 'sonner';

import '../styles/Auth.css';
import '../styles/index.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const result = await login(email, password);

    if (result.success) {
      navigate('/my-recipes');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Fazer login</h2>

      {errorMsg && <p style={{ color: 'red', textAlign: 'center' }}>{errorMsg}</p>}

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

        <div className="auth-footer">
          <Link to="/forgot-password" className="auth-link">
            Esqueceu a senha?
          </Link>
        </div>
      </form>

      <p className="auth-footer">
        Ainda não tem conta? <Link to="/register" className="auth-link">Cadastre-se</Link>
      </p>
    </div>
  );
}