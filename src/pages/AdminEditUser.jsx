import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

import { toast } from 'sonner';

import '../styles/Auth.css';
import '../styles/index.css';

export default function AdminEditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const currentUserId = currentUser?._id || currentUser?.id;
    if (currentUserId && String(currentUserId) === String(id)) {
      toast.error('Para editar os seus próprios dados, utilize a página de Perfil.');
      navigate('/edit-profile');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/users/${id}`);
        const user = response.data;

        setName(user.name || '');
        setLastName(user.lastName || '');
        setEmail(user.email || '');
        setBirthDate(formatDateForInput(user.birthDate));
        setRole(user.role || 'user');
      } catch (error) {
        setErrorMsg(error.response?.data?.message || 'Erro ao carregar dados do utilizador.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validações 
    if (name.trim().length <= 2) {
      setErrorMsg('O Nome deve ter mais de 2 caracteres.');
      return;
    }
    if (lastName.trim().length <= 2) {
      setErrorMsg('O Apelido deve ter mais de 2 caracteres.');
      return;
    }
    if (!birthDate || !validateAge(birthDate)) {
      setErrorMsg('O utilizador deve ter pelo menos 16 anos.');
      return;
    }

    try {
      await api.put(`/admin/users/${id}`, {
        name,
        lastName,
        birthDate,
        role,
      });

      setSuccessMsg('Utilizador atualizado com sucesso!');
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Erro ao atualizar utilizador.');
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <p style={{ textAlign: 'center' }}>A carregar dados do utilizador...</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2 className="auth-title">Editar Utilizador</h2>
      <p className="auth-email">{email}</p>

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
          <label className="auth-label">Cargo</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="auth-input"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn-auth-submit">
          Guardar Alterações
        </button>
      </form>

      <div className="profile-actions-cancel" style={{ marginTop: '15px' }}>
        <button
          className="btn-profile-cancel"
          onClick={() => navigate('/admin')}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}