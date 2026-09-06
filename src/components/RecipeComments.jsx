//RecipeComments
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

    // Adiciona o comentário passando o ID da receita, dados do usuário e o texto
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
    <section style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
      <h3 style={{ marginBottom: '20px' }}>
        💬 Comentários ({recipeComments.length})
      </h3>

      {/* Formulário de Envio */}
      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva um comentário ou dica sobre esta receita..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              resize: 'vertical',
              fontSize: '14px',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="submit"
            disabled={!text.trim()}
            style={{
              marginTop: '8px',
              padding: '8px 16px',
              backgroundColor: text.trim() ? '#4CAF50' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: text.trim() ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            Publicar Comentário
          </button>
        </form>
      ) : (
        <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '25px', backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '6px' }}>
          🔒 Faça login para deixar um comentário sobre esta receita.
        </p>
      )}

      {/* Lista de Comentários */}
      {recipeComments.length === 0 ? (
        <p style={{ color: '#888' }}>Seja o primeiro a comentar!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {recipeComments.map((comment) => {
            const isAuthor = user && String(user.id) === String(comment.userId);

            return (
              <div
                key={comment.id}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <strong style={{ color: '#333' }}>👤 {comment.userName}</strong>
                  <span style={{ color: '#888' }}>{formatDate(comment.createdAt)}</span>
                </div>

                <p style={{ margin: 0, fontSize: '14px', color: '#444', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {comment.text}
                </p>

                {isAuthor && (
                  <button
                    onClick={() => deleteComment(comment.id)}
                    title="Excluir comentário"
                    style={{
                      marginTop: '8px',
                      background: 'none',
                      border: 'none',
                      color: '#d32f2f',
                      fontSize: '12px',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline'
                    }}
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