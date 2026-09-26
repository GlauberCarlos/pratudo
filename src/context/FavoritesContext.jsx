import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;

  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!currentUserId) {
      setFavorites([]);
      return;
    }

    try {
      setLoadingFavorites(true);
      const response = await api.get('/users/favorites'); 
      
      const favoriteIds = response.data.map((item) =>
        typeof item === 'object' ? item._id || item.id : item
      );
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Erro ao carregar favoritos da API:', error);
      // Fallback em caso de erro
      try {
        const saved = localStorage.getItem(`@my-menu:favorites_${currentUserId}`);
        setFavorites(saved ? JSON.parse(saved) : []);
      } catch {
        setFavorites([]);
      }
    } finally {
      setLoadingFavorites(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (recipeId) => {
    if (!currentUserId || !recipeId) {
      alert('Precisa de estar autenticado para favoritar receitas!');
      return;
    }

    const idString = String(recipeId);
    const exists = favorites.some((id) => String(id) === idString);

    setFavorites((prev) =>
      exists
        ? prev.filter((id) => String(id) !== idString)
        : [...prev, idString]
    );

    try {
      if (exists) {
        await api.delete(`/users/favorites/${idString}`);
      } else {
        await api.post(`/users/favorites/${idString}`);
      }

      const updatedList = exists
        ? favorites.filter((id) => String(id) !== idString)
        : [...favorites, idString];
      localStorage.setItem(`@my-menu:favorites_${currentUserId}`, JSON.stringify(updatedList));

    } catch (error) {
      console.error('Erro ao atualizar favorito na API:', error);
      setFavorites((prev) =>
        exists
          ? [...prev, idString]
          : prev.filter((id) => String(id) !== idString)
      );
      alert('Não foi possível guardar o favorito. Tente novamente.');
    }
  };

  const isFavorite = (recipeId) => {
    if (!recipeId) return false;
    return favorites.some((id) => String(id) === String(recipeId));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        loadingFavorites,
        refetchFavorites: fetchFavorites,
      }}
    >
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