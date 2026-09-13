// RecipesContext
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const RecipesContext = createContext();

export const RecipesProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPublicRecipes = async (params = {}) => {
    try {
      setLoading(true);
      const response = await api.get('/recipes', { params });
      setRecipes(response.data);
    } catch (error) {
      console.error('Erro ao carregar receitas públicas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecipeById = (id) => {
    if (!id) return null;
    return recipes.find((recipe) =>
      String(recipe._id) === String(id) || String(recipe.id) === String(id)
    );
  };

  const addRecipe = async (recipeData) => {
    try {
      const response = await api.post('/recipes', recipeData);
      setRecipes((prev) => [response.data.recipe, ...prev]);
      return { success: true, recipe: response.data.recipe };
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
      setRecipes((prev) =>
        prev.map((r) => (r._id === id ? response.data.recipe || response.data : r))
      );
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
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao excluir receita.',
      };
    }
  };

  useEffect(() => {
    fetchPublicRecipes();
  }, []);

  return (
    <RecipesContext.Provider
      value={{
        recipes,
        loading,
        fetchPublicRecipes,
        getRecipeById,
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