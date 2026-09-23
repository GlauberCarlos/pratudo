import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import api from '../services/api';

import defaultIMG from '../assets/praTudo-placeholder.svg'
import '../styles/MyComments.css';
import '../styles/index.css';

export default function MyComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/comments/my-comments');
      setComments(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao carregar os seus comentários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Tem certeza que deseja apagar este comentário?')) {
      try {
        await api.delete(`/comments/${commentId}`);
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      } catch (error) {
        alert(error.response?.data?.message || 'Erro ao apagar o comentário.');
      }
    }
  };

  if (loading) {
    return (
      <div className="comments-page-container">
        <p className="loading-text">A carregar os seus comentários...</p>
      </div>
    );
  }

  return (
    <div className="comments-page-container">
      <div className="comments-header-section">
        <h2 className="comments-page-title">Meus Comentários</h2>
      </div>

      {comments.length === 0 ? (
        <p className="empty-state-text">Ainda não fez nenhum comentário em nenhuma receita.</p>
      ) : (
        <div className="comments-grid">
          {comments.map((comment) => {
            const recipe = comment.recipe; // Objeto da receita vindo do populate

            return (
              <div key={comment._id} className="comment-card">
                {/* Imagem da receita */}
                <div className="comment-card-image-wrapper">
                  <img
                    src={recipe?.img || defaultIMG}
                    alt={recipe?.title || 'Receita'}
                    className="comment-card-image"
                  />
                </div>

                {/* Conteúdo do Card */}
                <div className="comment-card-content">
                  <div>
                    <h3 className="comment-card-recipe-title">
                      {recipe?.title || 'Receita não encontrada'}
                    </h3>
                    <p className="comment-card-text">"{comment.content || comment.text}"</p>
                  </div>

                  {/* Botões de Ação */}
                  <div className="comment-card-actions">
                    {recipe?._id && (
                      <Link to={`/recipe/${recipe._id}`} className="btn-action btn-view">
                        Ver Receita
                      </Link>
                    )}
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="btn-action btn-delete"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}