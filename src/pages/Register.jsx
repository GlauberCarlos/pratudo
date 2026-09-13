//register
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import '../styles/Auth.css';
import '../styles/index.css';

export default function Register() {
  const [name, setName] = useState('');
  const [lastName, setlastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requestAdmin, setRequestAdmin] = useState(false);
  const { register } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    const result = await register(name, lastName, email, password, requestAdmin);
    if (result.success) {
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Criar Conta</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label className="auth-label">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Maria Silva"
            required
            className="auth-input"
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Apelido</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setlastName(e.target.value)}
            placeholder=""
            required
            className="auth-input"
          />
        </div>

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

        <div className="auth-field">
          <label className="auth-label">Confirmar Senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="auth-input"
          />
        </div>

        <label className="auth-checkbox-group">
          <input
            type="checkbox"
            checked={requestAdmin}
            onChange={(e) => setRequestAdmin(e.target.checked)}
            className="auth-checkbox"
          />
          <span className="auth-checkbox-label">Solicitar perfil de Administrador</span>
        </label>

        <button type="submit" className="btn-auth-submit">
          Cadastrar
        </button>
      </form>

      <p className="auth-footer">
        Já tem uma conta? <Link to="/login" className="auth-link">Faça Login</Link>
      </p>
    </div>
  );
}