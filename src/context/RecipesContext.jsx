// RecipesContext
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const RecipesContext = createContext();

const STORAGE_KEY = '@my-menu:recipes';

export function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Erro ao carregar receitas do localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch (error) {
      console.error('Erro ao salvar receitas no localStorage:', error);
    }
  }, [recipes]);

  const addRecipe = useCallback((newRecipe) => {
    const recipeWithId = {
      ...newRecipe,
      id: newRecipe.id || Date.now(),
      createdAt: new Date().toISOString()
    };
    setRecipes((prev) => [recipeWithId, ...prev]);
    return recipeWithId;
  }, []);

  const updateRecipe = useCallback((updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((r) => (String(r.id) === String(updatedRecipe.id) ? updatedRecipe : r))
    );
  }, []);

  const deleteRecipe = useCallback((recipeId) => {
    setRecipes((prev) => prev.filter((r) => String(r.id) !== String(recipeId)));
  }, []);

  const getRecipeById = useCallback(
    (recipeId) => {
      return recipes.find((r) => String(r.id) === String(recipeId));
    },
    [recipes]
  );

  return (
    <RecipesContext.Provider
      value={{
        recipes,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipeById
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error('useRecipes deve ser usado dentro de um RecipesProvider');
  }
  return context;
}