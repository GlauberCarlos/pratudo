import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { toast } from 'sonner';

import '../styles/Auth.css';
import '../styles/index.css';

export default function EditProfile() {
  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const validateAge = (dateString) => {
    const today = new Date();
    const birth = new Date(dateString);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 16;
  };

  // Preenche os campos com os dados atuais do utilizador
  useEffect(() => {
    if (user) {
      setName(user.name);
      setLastName(user.lastName);
      const userDate = user.birthDate;
      setBirthDate(formatDateForInput(userDate));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (name.trim().length <= 2) {
      toast.error('O Nome deve ter mais de 2 caracteres.');
      return;
    }
    if (lastName.trim().length <= 2) {
      toast.error('O Apelido deve ter mais de 2 caracteres.');
      return;
    }    
    if (!birthDate || !validateAge(birthDate)) {
      toast.error('Deve ter pelo menos 16 anos para se registar.');
      return;
    }

    if (password) {
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
    }

    const payload = { 
      name, 
      lastName, 
      birthDate
    };

    if (password) {
      payload.password = password;
    }

    const result = await updateProfile(payload);

    if (result.success) {
      setSuccessMsg('Perfil atualizado com sucesso!');
      setPassword('');
      setConfirmPassword('');
    } else {
      setErrorMsg(result.message);
    }
  };

  const cancelEdit = () => {
    navigate('/profile');
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Editar Perfil</h2>
      <p className="auth-email">{user.email}</p>

      {errorMsg && <p style={{ color: 'red', textAlign: 'center' }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: 'green', textAlign: 'center' }}>{successMsg}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label className="auth-label">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="auth-input"
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Apelido</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
          <label className="auth-label">Senha (vazio se não quiser alterar)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=""
            className="auth-input"
          />
        </div>

        {password && (
          <div className="auth-field">
            <label className="auth-label">Confirmar Nova Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a nova senha"
              className="auth-input"
            />
          </div>
        )}

        <button type="submit" className="btn-auth-submit">
          Guardar Alterações
        </button>
      </form>

      <div className="profile-actions-cancel">
        <button className="btn-profile-delete" onClick={cancelEdit}>
          Cancelar Alterações
        </button>
      </div>
    </div>
  );
}