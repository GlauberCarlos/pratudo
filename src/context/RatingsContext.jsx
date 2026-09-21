import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const RatingsContext = createContext();

export function RatingsProvider({ children }) {
  const [ratings, setRatings] = useState([]);

  const fetchRatings = useCallback(async () => {
    try {
      const response = await api.get('/ratings');
      setRatings(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    }
  }, []);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const submitRating = useCallback(async (recipeId, userId, stars) => {
    if (!recipeId || !userId) return;

    try {
      const response = await api.post('/ratings', {
        recipeId,
        stars: Number(stars),
      });

      const updatedEntry = response.data.rating;

      setRatings((prevRatings) => {
        const currentList = Array.isArray(prevRatings) ? prevRatings : [];
        const existingIndex = currentList.findIndex(
          (r) =>
            String(r.recipe || r.recipeId) === String(recipeId) &&
            String(r.user || r.userId) === String(userId)
        );

        if (existingIndex > -1) {
          const updated = [...currentList];
          updated[existingIndex] = updatedEntry;
          return updated;
        }

        return [...currentList, updatedEntry];
      });
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao guardar a avaliação.');
    }
  }, []);

  const getRecipeRating = useCallback(
    (recipeId, currentUserId) => {
      if (!recipeId) {
        return { rating: 0, ratingCount: 0, userRating: 0, hasRated: false };
      }

      const safeRatings = Array.isArray(ratings) ? ratings : [];

      const recipeRatings = safeRatings.filter(
        (r) => String(r.recipe || r.recipeId) === String(recipeId)
      );

      const count = recipeRatings.length;
      const totalStars = recipeRatings.reduce(
        (acc, curr) => acc + (Number(curr.stars || curr.rating) || 0),
        0
      );
      const average = count > 0 ? totalStars / count : 0;

      const userEntry = currentUserId
        ? recipeRatings.find(
            (r) => String(r.user || r.userId) === String(currentUserId)
          )
        : null;

      return {
        rating: Number(average.toFixed(1)),
        ratingCount: count,
        userRating: userEntry ? Number(userEntry.stars || userEntry.rating) : 0,
        hasRated: Boolean(userEntry),
      };
    },
    [ratings]
  );

  return (
    <RatingsContext.Provider value={{ ratings, submitRating, getRecipeRating, fetchRatings }}>
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