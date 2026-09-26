import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import '../styles/Auth.css';
import '../styles/index.css';

export default function Register() {
  const [name, setName] = useState('');
  const [lastName, setlastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requestAdmin, setRequestAdmin] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const validadeAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 16;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim().length <= 2) {
      toast.error('O Nome deve ter mais de 2 caracteres.');
      return;
    }
    if (lastName.trim().length <= 2) {
      toast.error('O Apelido deve ter mais de 2 caracteres.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor, insira um e-mail válido.');
      return;
    }
    if (!birthDate || !validadeAge(birthDate)) {
      toast.error('Deve ter pelo menos 16 anos para se registar.');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        'A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial (@$!%*?&).'
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }

    const result = await register(name, lastName, email, birthDate, password, requestAdmin);
    if (result.success) {
      toast.success('Cadastro realizado com sucesso!');
      navigate('/login');
    } else {
      toast.error(result.message);
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
          <label className="auth-label">Data de Nascimento</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
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