import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const CommentsContext = createContext();

export function CommentsProvider({ children }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipeComments = useCallback(async (recipeId) => {
    if (!recipeId) return;

    try {
      setLoading(true);
      const response = await api.get(`/comments/recipe/${recipeId}`);
      setComments(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar comentários da receita:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = async (recipeId, text) => {
    if (!text || !text.trim() || !recipeId) return { success: false };

    try {
      const response = await api.post('/comments', {
        recipeId,
        text: text.trim(),
      });

      setComments((prev) => [response.data, ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      alert(error.response?.data?.message || 'Erro ao publicar comentário.');
      return { success: false };
    }
  };

  const editComment = async (commentId, newText) => {
    if (!newText || !newText.trim() || !commentId) return { success: false };

    try {
      const response = await api.put(`/comments/${commentId}`, {
        text: newText.trim(),
      });
      setComments((prev) =>
        prev.map((item) =>
          (item._id || item.id) === commentId ? response.data : item
        )
      );
      return { success: true };
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
      alert(error.response?.data?.message || 'Erro ao guardar alterações do comentário.');
      return { success: false };
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((item) => (item._id || item.id) !== commentId));
      return { success: true };
    } catch (error) {
      console.error('Erro ao remover comentário:', error);
      alert('Erro ao excluir comentário.');
      return { success: false };
    }
  };

  return (
    <CommentsContext.Provider
      value={{
        comments,
        loading,
        fetchRecipeComments,
        addComment,
        editComment,
        deleteComment,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useComments deve ser usado dentro de um CommentsProvider');
  }
  return context;
}