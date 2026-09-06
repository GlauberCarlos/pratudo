// CommentsContext
import { createContext, useContext, useState, useEffect } from 'react';

const CommentsContext = createContext();

const STORAGE_KEY = 'mymenu_comments';

export function CommentsProvider({ children }) {
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  }, [comments]);

  // Adiciona um novo comentário
  const addComment = (recipeId, userId, userName, text) => {
    if (!text || !text.trim()) return;

    const newComment = {
      id: Date.now(),
      recipeId,
      userId,
      userName: userName || 'Usuário Anônimo',
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    setComments((prev) => [newComment, ...prev]);
  };

  // Remove um comentário pelo ID (somente se for o dono ou admin)
  const deleteComment = (commentId) => {
    setComments((prev) => prev.filter((item) => item.id !== commentId));
  };

  // Retorna todos os comentários referentes a uma receita específica
  const getRecipeComments = (recipeId) => {
    return comments.filter((item) => String(item.recipeId) === String(recipeId));
  };

  return (
    <CommentsContext.Provider value={{ comments, addComment, deleteComment, getRecipeComments }}>
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