import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useComments } from '../context/CommentsContext';

export default function RecipeComments({ recipeId }) {
  const { user } = useAuth();
  const { addComment, deleteComment, getRecipeComments } = useComments();
  const [text, setText] = useState('');

  const recipeComments = getRecipeComments(recipeId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    addComment(recipeId, user.id, user.name || user.email, text);
    setText('');
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <section className="comments-section">
      <h3 className="comments-title">
        Comentários ({recipeComments.length})
      </h3>

      {/* Formulário de Envio */}
      {user ? (
        <form onSubmit={handleSubmit} className="comments-form">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Comente sobre esta receita..."
            rows={3}
            className="comments-textarea"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="btn-submit-comment"
          >
            Publicar
          </button>
        </form>
      ) : (
        <p className="comments-login-warning">
          🔒 Faça login para deixar um comentário sobre esta receita.
        </p>
      )}

      {/* Lista de Comentários */}
      {recipeComments.length === 0 ? (
        <p className="comments-empty">Seja o primeiro a comentar!</p>
      ) : (
        <div className="comments-list">
          {recipeComments.map((comment) => {
            const isAuthor = user && String(user.id) === String(comment.userId);

            return (
              <div key={comment.id} className="comment-card">
                <div className="comment-header">
                  <strong className="comment-author">👤 {comment.userName}</strong>
                  <span className="comment-date">{formatDate(comment.createdAt)}</span>
                </div>

                <p className="comment-body">
                  {comment.text}
                </p>

                {isAuthor && (
                  <button
                    onClick={() => deleteComment(comment.id)}
                    title="Excluir comentário"
                    className="btn-delete-comment"
                  >
                    Excluir
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}