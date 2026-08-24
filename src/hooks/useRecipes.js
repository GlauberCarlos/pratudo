import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
// import initialRecipes from '../data/recipes.json';

export function useRecipes() {
  const { user } = useAuth();

  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem('@my-menu:recipes');
    if (savedRecipes) {
      return JSON.parse(savedRecipes);
    }
    else {
      return []
    }
    // return initialRecipes.map((r) => ({ ...r, userId: r.userId || 1 }));
  });

  useEffect(() => {
    localStorage.setItem('@my-menu:recipes', JSON.stringify(recipes));
  }, [recipes]);

  const userRecipes = recipes.filter((recipe) => recipe.userId === user?.id);
  const publicRecipes = recipes.filter((recipe) => recipe.isPublic);

  // Adicionar
  const addRecipe = (newRecipe) => {
    if (!user) return;

    const recipeWithUser = {
      ...newRecipe,
      id: Date.now(),
      userId: user.id
    };

    setRecipes((prev) => [...prev, recipeWithUser]);
  };

  // Modificar
  const updateRecipe = (updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((item) => (item.id === updatedRecipe.id ? { ...item, ...updatedRecipe } : item))
    );
  };

  // Apagar
  const deleteRecipe = (id) => {
    setRecipes((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    recipes: 
    userRecipes,
    publicRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe
  };
}