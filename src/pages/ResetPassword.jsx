import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

import '../styles/Auth.css';
import '../styles/index.css';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!\%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMsg(
        'A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial (@$!%*?&).'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem!');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      setSuccessMsg(response.data.message || 'Senha redefinida com sucesso!');

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Erro ao redefinir a senha. O token pode ser inválido ou ter expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Nova Senha</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666', fontSize: '14px' }}>
        Crie uma nova senha segura para a sua conta.
      </p>

      {errorMsg && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: 'green', textAlign: 'center', marginBottom: '15px' }}>{successMsg}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label className="auth-label">Nova Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            required
            className="auth-input"
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Confirmar Nova Senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme a nova senha"
            required
            className="auth-input"
          />
        </div>

        <button type="submit" className="btn-auth-submit" disabled={loading}>
          {loading ? 'A guardar...' : 'Redefinir Senha'}
        </button>
      </form>

      <p className="auth-footer">
        Voltar ao <Link to="/login" className="auth-link">Login</Link>
      </p>
    </div>
  );
}