//recipeComments
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useComments } from '../context/CommentsContext';

export default function RecipeComments({ recipeId }) {
  const { user } = useAuth();
  const { comments, loading, fetchRecipeComments, addComment, editComment, deleteComment } = useComments();
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (recipeId) {
      fetchRecipeComments(recipeId);
    }
  }, [recipeId, fetchRecipeComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const result = await addComment(recipeId, text);
    if (result.success) {
      setText('');
    }
  };

  const handleStartEdit = (comment) => {
    setEditingId(comment._id || comment.id);
    setEditText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) return;

    const result = await editComment(commentId, editText);
    if (result.success) {
      setEditingId(null);
      setEditText('');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja apagar o comentário?')) {
      const result = await deleteComment(id);
      if (!result?.success && result?.message) {
        alert(result.message);
      }
    }
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const currentUserId = user?._id || user?.id;
  const isAdmin = user?.role === 'admin';

  return (
    <section className="comments-section">
      <h3 className="comments-title">
        Comentários ({comments.length})
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
      {loading ? (
        <p className="comments-empty">A carregar comentários...</p>
      ) : comments.length === 0 ? (
        <p className="comments-empty">Seja o primeiro a comentar!</p>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => {
            const commentId = comment._id || comment.id;
            const authorId = comment.user?._id || comment.user?.id || comment.user;
            const userName = comment.user?.name
              ? `${comment.user.name} ${comment.user.lastName || ''}`.trim()
              : comment.userName || 'Usuário';

            const isAuthor = Boolean(
              currentUserId && authorId && String(currentUserId) === String(authorId)
            );

            // Permissão de exclusão: Autor OU Admin
            const canDelete = isAuthor || isAdmin;

            const isEditingThis = editingId === commentId;

            return (
              <div key={commentId} className="comment-card">
                <div className="comment-header">
                  <strong className="comment-author">👤 {userName}</strong>
                  <span className="comment-date">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>

                {isEditingThis ? (
                  <div className="comment-edit-box" style={{ marginTop: '10px' }}>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={2}
                      className="comments-textarea"
                    />
                    <div className="comment-edit-actions" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button
                        onClick={() => handleSaveEdit(commentId)}
                        disabled={!editText.trim()}
                        className="btn-submit-comment"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn-cancel-recipe"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="comment-body">{comment.text}</p>

                    {(isAuthor || canDelete) && (
                      <div className="comment-actions" style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        {/* Apenas o AUTOR pode EDITAR */}
                        {isAuthor && (
                          <button
                            onClick={() => handleStartEdit(comment)}
                            title="Editar comentário"
                            className="btn-edit-comment"
                            style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0 }}
                          >
                            Editar
                          </button>
                        )}

                        {/* AUTOR OU ADMIN podem EXCLUIR */}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(commentId)}
                            title="Excluir comentário"
                            className="btn-delete-comment"
                          >
                            Excluir
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}