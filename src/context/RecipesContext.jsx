import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

const RecipesContext = createContext();

export const RecipesProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPublicRecipes = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setRecipes([]);

      const apiParams = { ...params };
      if (apiParams.searchTerm) {
        apiParams.search = apiParams.searchTerm;
        delete apiParams.searchTerm;
      }
      if (apiParams.category === 'Todas') {
        delete apiParams.category;
      }

      const response = await api.get('/recipes', { params: apiParams });
      setRecipes(response.data);
    } catch (error) {
      console.error('Erro ao carregar receitas públicas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyRecipes = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const apiParams = { ...params };
      if (apiParams.searchTerm) {
        apiParams.search = apiParams.searchTerm;
        delete apiParams.searchTerm;
      }
      if (apiParams.category === 'Todas') {
        delete apiParams.category;
      }

      const response = await api.get('/recipes/my-recipes', { params: apiParams });
      setMyRecipes(response.data);
    } catch (error) {
      console.error('Erro ao carregar as minhas receitas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca síncrona na memória
  const getRecipeById = (id) => {
    if (!id) return null;
    return (
      recipes.find((r) => String(r._id) === String(id) || String(r.id) === String(id)) ||
      myRecipes.find((r) => String(r._id) === String(id) || String(r.id) === String(id))
    );
  };

  // NOVA FUNÇÃO: Busca na memória; se não encontrar, faz pedido à API
  const fetchRecipeById = useCallback(async (id) => {
    if (!id) return null;

    // Procura primeiro no estado local (memória)
    const localRecipe = recipes.find((r) => String(r._id) === String(id) || String(r.id) === String(id)) ||
      myRecipes.find((r) => String(r._id) === String(id) || String(r.id) === String(id));

    if (localRecipe) return localRecipe;

    // Se não estiver em memória (ex: após refresh), busca no servidor
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar receita por ID:', error);
      return null;
    }
  }, [recipes, myRecipes]);

  const addRecipe = async (recipeData) => {
    try {
      const response = await api.post('/recipes', recipeData);
      const newRec = response.data.recipe;
      setRecipes((prev) => [newRec, ...prev]);
      setMyRecipes((prev) => [newRec, ...prev]);
      return { success: true, recipe: newRec };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao criar receita.',
      };
    }
  };

  const updateRecipe = async (id, updatedData) => {
    try {
      const response = await api.put(`/recipes/${id}`, updatedData);
      const updated = response.data.recipe || response.data;
      setRecipes((prev) => prev.map((r) => (r._id === id ? updated : r)));
      setMyRecipes((prev) => prev.map((r) => (r._id === id ? updated : r)));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar receita.',
      };
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await api.delete(`/recipes/${id}`);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
      setMyRecipes((prev) => prev.filter((r) => r._id !== id));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao excluir receita.',
      };
    }
  };

  return (
    <RecipesContext.Provider
      value={{
        recipes,
        myRecipes,
        loading,
        fetchPublicRecipes,
        fetchMyRecipes,
        getRecipeById,
        fetchRecipeById,
        addRecipe,
        updateRecipe,
        deleteRecipe,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

export const useRecipes = () => useContext(RecipesContext);