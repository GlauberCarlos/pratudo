import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import RecipeWeek from './pages/RecipeWeek';
import RecipeNew from './pages/RecipeNew';
import RecipeEdit from './pages/RecipeEdit';
import RecipeDetails from './pages/RecipeDetails';

import initialRecipes from './data/recipes.json'

function App() {
  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem('@my-menu:recipes');
    if (savedRecipes) {
      return JSON.parse(savedRecipes);
    }
    return initialRecipes; // Caso seja o primeiro acesso do usuário
  });

  // 2. Salva no localStorage toda vez que o estado 'recipes' mudar
  useEffect(() => {
    localStorage.setItem('@my-menu:recipes', JSON.stringify(recipes));
  }, [recipes]);

  // Funções do CRUD
  const handleAddRecipe = (newRecipe) => {
    const recipeWithId = { ...newRecipe, id: Date.now() };
    setRecipes((prevRecipes) => [...prevRecipes, recipeWithId]);
  };

  const handleUpdateRecipe = (updatedRecipe) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((item) => (item.id === updatedRecipe.id ? updatedRecipe : item))
    );
  };

  const handleDeleteRecipe = (id) => {
    setRecipes((prevRecipes) => prevRecipes.filter((item) => item.id !== id));
  };

  return (
    <BrowserRouter>
      <nav style={{ padding: '15px', backgroundColor: '#f0f0f0', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Página Inicial</Link>
        <Link to="/menu" style={{ marginRight: '15px' }}>Meu Cardápio</Link>
        <Link to="/menu/new" style={{ marginRight: '15px' }}>Adicionar Receita</Link>
      </nav>

      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/menu" 
            element={<RecipeWeek recipes={recipes} onDelete={handleDeleteRecipe} />} 
          />
          <Route 
            path="/menu/new" 
            element={<RecipeNew onAdd={handleAddRecipe} />} 
          />
          <Route 
            path="/menu/:id" 
            element={<RecipeDetails recipes={recipes} />} 
          />
          <Route 
            path="/menu/:id/edit" 
            element={<RecipeEdit recipes={recipes} onUpdate={handleUpdateRecipe} />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;