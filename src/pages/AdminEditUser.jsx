import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

import api from '../services/api';

import '../styles/Auth.css';
import '../styles/index.css';

export default function AdminEditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');


  useEffect(() => {
    const currentUserId = currentUser?._id || currentUser?.id;
    if (currentUserId && String(currentUserId) === String(id)) {
      alert('Para editar os seus próprios dados, utilize a página de Perfil.');
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
        setRole(user.role || 'user');
      } catch (error) {
        setErrorMsg(error.response?.data?.message || 'Erro ao carregar dados do utilizador.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id], currentUser, navigate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Atualiza os dados no backend
      const response = await api.put(`/admin/users/${id}`, {
        name,
        lastName,
        email,
        role,
      });
      const updatedUser = response.data;
      localStorage.setItem('@Pratudo:user', JSON.stringify(updatedUser));

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
          <label className="auth-label">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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