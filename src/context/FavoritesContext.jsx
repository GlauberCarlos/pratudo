import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { user } = useAuth();

  const loadFavorites = (userId) => {
    if (!userId) return [];
    try {
      const saved = localStorage.getItem(`@my-menu:favorites_${userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const [favorites, setFavorites] = useState(() => loadFavorites(user?.id));

  useEffect(() => {
    setFavorites(loadFavorites(user?.id));
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`@my-menu:favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user?.id]);

  const toggleFavorite = (recipeId) => {
    if (!user) return;

    setFavorites((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const isFavorite = (recipeId) => favorites.includes(recipeId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
}