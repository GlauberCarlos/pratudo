import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import '../styles/Auth.css';
import '../styles/index.css';

export default function EditProfile() {
    const { user, updateProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Preenche os campos com os dados atuais
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (password && password !== confirmPassword) {
            setErrorMsg('As senhas não coincidem!');
            return;
        }

        const payload = { name, lastName, email };
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
    }

    return (
        <div className="auth-container">
            <h2 className="auth-title">Editar Perfil</h2>

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
                    <label className="auth-label">Nova Senha (deixe em branco para não alterar)</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nova senha"
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
                            className="auth-input"
                        />
                    </div>
                )}

                <button type="submit" className="btn-auth-submit">
                    Guardar Alterações
                </button>
            </form>
            <div className="profile-actions-cancel">
                <button
                    className="btn-profile-cancel"
                    onClick={() => cancelEdit()}
                >
                    Cancelar Alterações
                </button>
            </div>
        </div>
    );
}