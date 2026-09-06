// ratingContext

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const RatingsContext = createContext();

const STORAGE_KEY = '@my-menu:ratings';

export function RatingsProvider({ children }) {
  const [ratings, setRatings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      // Garante que o retorno seja estritamente um Array
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Erro ao carregar avaliações do localStorage:', error);
      return [];
    }
  });

  // Salva no localStorage sempre que a lista de avaliações mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
    } catch (error) {
      console.error('Erro ao salvar avaliações no localStorage:', error);
    }
  }, [ratings]);

  // Envia ou atualiza a avaliação de um usuário para uma receita específica
  const submitRating = useCallback((recipeId, userId, stars) => {
    if (recipeId === undefined || recipeId === null || !userId) return;

    setRatings((prevRatings) => {
      // Garantia defensiva de que prevRatings é um array
      const currentList = Array.isArray(prevRatings) ? prevRatings : [];

      const existingIndex = currentList.findIndex(
        (r) => String(r.recipeId) === String(recipeId) && String(r.userId) === String(userId)
      );

      if (existingIndex > -1) {
        const updated = [...currentList];
        updated[existingIndex] = {
          ...updated[existingIndex],
          rating: Number(stars),
        };
        return updated;
      }

      const newRating = {
        id: Date.now(),
        recipeId,
        userId,
        rating: Number(stars),
      };

      return [...currentList, newRating];
    });
  }, []);

  // Calcula estatísticas e busca a nota do usuário para uma receita específica
  const getRecipeRating = useCallback((recipeId, currentUserId) => {
    if (recipeId === undefined || recipeId === null) {
      return { rating: 0, ratingCount: 0, userRating: 0, hasRated: false };
    }

    // Garantia defensiva: se ratings não for array, usa array vazio
    const safeRatings = Array.isArray(ratings) ? ratings : [];

    // Filtra todas as avaliações pertencentes a esta receita
    const recipeRatings = safeRatings.filter(
      (r) => String(r.recipeId) === String(recipeId)
    );

    const count = recipeRatings.length;
    const totalStars = recipeRatings.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0);
    const average = count > 0 ? totalStars / count : 0;

    const userEntry = currentUserId
      ? recipeRatings.find((r) => String(r.userId) === String(currentUserId))
      : null;

    return {
      rating: Number(average.toFixed(1)),
      ratingCount: count,
      userRating: userEntry ? Number(userEntry.rating) : 0,
      hasRated: Boolean(userEntry),
    };
  }, [ratings]);

  return (
    <RatingsContext.Provider value={{ ratings, submitRating, getRecipeRating }}>
      {children}
    </RatingsContext.Provider>
  );
}

export function useRatings() {
  const context = useContext(RatingsContext);
  if (!context) {
    throw new Error('useRatings deve ser usado dentro de um RatingsProvider');
  }
  return context;
}