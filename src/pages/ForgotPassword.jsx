import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

import '../styles/Auth.css';
import '../styles/index.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/forgot-password', { email });
      setSuccessMsg(response.data.message || 'E-mail de recuperação enviado com sucesso!');
      setEmail('');
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Erro ao solicitar recuperação de senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Recuperar Senha</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666', fontSize: '14px' }}>
        Insira o seu e-mail cadastrado para receber um link de redefinição de senha.
      </p>

      {errorMsg && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: 'green', textAlign: 'center', marginBottom: '15px' }}>{successMsg}</p>}

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

        <button type="submit" className="btn-auth-submit" disabled={loading}>
          {loading ? 'A enviar...' : 'Enviar Link'}
        </button>
      </form>

      <p className="auth-footer">
        Lembrou-se da senha? <Link to="/login" className="auth-link">Voltar ao Login</Link>
      </p>
    </div>
  );
}